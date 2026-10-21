/**
 * Latihan serupa (PRD §8.4, §11; revisi pemilik v1.6): penyiapan → sesi → ringkasan.
 *  - Penyiapan: tingkat (Mudah/Sedang/Menantang), jumlah soal (1/3/5), waktu (tanpa/per soal/sesi).
 *  - Sesi: soal baru dari generator (angka berbeda), lima pilihan, petunjuk bertahap (maks. 3),
 *    Periksa jawaban → benar / "Belum tepat" + jebakan (satu kali coba lagi) / kunci dibuka;
 *    "uji pilihanmu" menghitung F · X di depan siswa; Lihat langkah memakai papan pembahasan yang sama.
 *  - Timer tidak menutupi soal; peringatan 30 detik terakhir; habis → jawaban dikunci, ditandai waktu habis.
 *  - Ringkasan: benar/total, waktu, petunjuk; tiap soal: Ulangi soal ini (kode soal) dan Bahas bagian terkait.
 * Tanpa poin, peringkat, atau bahasa permainan. Kode soal di URL (?s=K3X9Q2-S) mengulang soal yang sama.
 */
import { SND } from '../core/audio';
import { reducedMotion } from '../core/clock';
import { esc, html, pad2 } from '../core/dom';
import { icon } from '../core/icons';
import { mathHtml, mathLabel, renderMath } from '../core/math';
import { completeAll, play } from '../core/motion';
import { storage } from '../core/storage';
import { store, type PracticeRecord } from '../core/store';
import { DUR, EASE_OUT, SLIDE_PX } from '../core/tokens';
import { getSoal } from '../content';
import { Board, type Ctx } from '../engine/board';
import { Ink } from '../engine/ink';
import { loadGenerator } from '../practice/registry';
import { LEVELS, parseCode, type Generator, type Instance, type Level } from '../practice/types';
import type { Route } from '../router/router';
import { navigate, type PageView } from '../shell/app';
import { isSheetOpen } from '../shell/sheet';

type TimeMode = 'none' | 'item' | 'session';
interface Prefs {
  level: Level;
  count: 1 | 3 | 5;
  time: TimeMode;
  minutes: 1 | 2 | 3 | 5;
}
type Status = 'open' | 'wrong' | 'ok' | 'key' | 'timeout';
interface Item {
  inst: Instance;
  /** pilihan yang sedang dipilih (belum diperiksa) */
  picked: number | null;
  /** pilihan terakhir yang diperiksa */
  chosen: number | null;
  tries: number;
  hints: number;
  status: Status;
  ms: number;
}

const PREFS_KEY = 'pahamtka:v1:latihan';
const LEVEL_LABEL: Record<Level, string> = { mudah: 'Mudah', sedang: 'Sedang', menantang: 'Menantang' };
const HINT_LABEL = ['Konsep', 'Langkah pertama', 'Arah'];
const SEED_SPACE = 36 ** 6;
const WARN_MS = 30000;

function loadPrefs(): Prefs {
  const d: Prefs = { level: 'mudah', count: 3, time: 'none', minutes: 2 };
  try {
    const p = JSON.parse(storage.get(PREFS_KEY) ?? '{}') as Partial<Prefs>;
    return {
      level: LEVELS.includes(p.level as Level) ? (p.level as Level) : d.level,
      count: [1, 3, 5].includes(p.count as number) ? (p.count as Prefs['count']) : d.count,
      time: ['none', 'item', 'session'].includes(p.time as string) ? (p.time as TimeMode) : d.time,
      minutes: [1, 2, 3, 5].includes(p.minutes as number) ? (p.minutes as Prefs['minutes']) : d.minutes,
    };
  } catch {
    return d;
  }
}

/** Benih sesi acak; benih tiap soal diturunkan darinya (PRD §11.3). */
function freshSeed(): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0]! % SEED_SPACE;
}

const mmss = (ms: number): string => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
};

const LETTERS = 'ABCDE';

export function latihanPage(route: Route): PageView {
  const no = route.no!;
  const meta = getSoal(no)!;
  const t0 = performance.now();
  const el = html(`<div class="lat"><div class="b-loading" role="status">Menyiapkan latihan…</div></div>`);
  const cleanups: Array<() => void> = [];
  let gen: Generator | null = null;
  let prefs = loadPrefs();

  // ---------- keadaan sesi ----------
  let items: Item[] = [];
  let cur = 0;
  let mode: TimeMode = 'none';
  let limitMs = 0;
  let leftMs = 0;
  let paused = false;
  let lastTick = 0;
  let warned = false;
  let replayCode: string | null = null;
  let ink: Ink | null = null;
  let board: Board | null = null;
  let timer = 0;

  const header = {
    back: { label: 'Soal', href: `#/soal/${no}` },
    block: { k: 'LATIHAN', n: '–', t: 'Penyiapan' },
    extra: `<button type="button" class="lat-timer" data-act="pause" aria-pressed="false" hidden>${icon('timer')}<span data-time>00:00</span><span class="lat-timer-k">Jeda</span></button>
      <button type="button" class="btn top-ink" data-act="ink" aria-pressed="false" aria-label="Coretan" title="Coretan (C)" hidden>${icon('pen-line')}<span class="btn-label">Coretan</span></button>`,
  };

  void loadGenerator(no).then((g) => {
    if (!el.isConnected) return;
    if (!g) {
      navigate(`#/soal/${no}`, { replace: true });
      return;
    }
    gen = g;
    const code = route.query.s ? parseCode(route.query.s) : null;
    if (code) {
      // ulangi satu soal dari kodenya, tanpa waktu
      replayCode = route.query.s!.toUpperCase();
      startSession({ ...prefs, level: code.level, count: 1, time: 'none' }, [code.seed]);
    } else showSetup();
  });

  const top = (): HTMLElement | null => document.querySelector<HTMLElement>('.top');
  const setBlock = (n: string, t: string): void => {
    const tb = document.querySelector('.tblock');
    if (!tb) return;
    tb.querySelector('.tb-n')!.textContent = n;
    tb.querySelector('.tb-t')!.textContent = t;
  };
  const swap = (node: HTMLElement): void => {
    el.replaceChildren(node);
    play(
      node,
      [
        { opacity: 0, transform: `translateX(${SLIDE_PX}px)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration: DUR.enter, easing: EASE_OUT, ui: true },
    );
  };

  // =====================================================================
  // Penyiapan
  // =====================================================================
  function showSetup(): void {
    stopTimer();
    ink?.destroy();
    ink = null;
    board?.destroy();
    board = null;
    setBlock('–', 'Penyiapan');
    const t = top();
    t?.querySelector<HTMLElement>('[data-act="pause"]')?.setAttribute('hidden', '');
    t?.querySelector<HTMLElement>('[data-act="ink"]')?.setAttribute('hidden', '');
    const g = gen!;
    const seg = (name: string, opts: Array<[string, string]>, val: string): string =>
      `<div class="seg" role="radiogroup" aria-label="${name}" data-seg="${name}">${opts
        .map(
          ([v, t]) =>
            `<button type="button" role="radio" data-v="${v}" aria-checked="${v === val}">${t}</button>`,
        )
        .join('')}</div>`;
    const node = html(`<div class="lat-setup">
      <section class="lat-intro bp crop" aria-labelledby="lat-t">
        <p class="eyebrow">Latihan serupa · Soal ${pad2(no)}</p>
        <h1 class="lat-title" id="lat-t">${esc(meta.title)}</h1>
        <p class="lat-lede">Soal baru dengan angka berbeda setiap kali, dengan jebakan yang sama seperti soal aslinya. Yang diuji pemahaman, bukan hafalan.</p>
        <ul class="lat-feats">
          <li>${icon('circle-help')}<span><b>Petunjuk bertahap</b> sampai tiga, dari konsep sampai arah.</span></li>
          <li>${icon('rotate-ccw')}<span><b>Satu kali coba lagi</b> setelah "Belum tepat", lengkap dengan jebakannya.</span></li>
          <li>${icon('list')}<span><b>Lihat langkah</b> penyelesaian soal barumu di papan tulis.</span></li>
          <li>${icon('clipboard-copy')}<span><b>Kode soal</b> untuk mengulang soal yang sama kapan saja.</span></li>
        </ul>
      </section>
      <section class="lat-form" aria-label="Penyiapan latihan">
        <div class="lat-field">
          <p class="lat-lbl" id="lv-l">Tingkat</p>
          <div class="lat-levels" role="radiogroup" aria-labelledby="lv-l">
            ${LEVELS.map(
              (
                l,
              ) => `<button type="button" role="radio" class="lat-level" data-level="${l}" aria-checked="${l === prefs.level}">
                <span class="lat-level-t">${LEVEL_LABEL[l]}</span>
                <span class="lat-level-d">${esc(g.levels[l])}</span></button>`,
            ).join('')}
          </div>
        </div>
        <div class="lat-field lat-inline">
          <p class="lat-lbl">Jumlah soal</p>
          ${seg(
            'Jumlah soal',
            [
              ['1', '1'],
              ['3', '3'],
              ['5', '5'],
            ],
            String(prefs.count),
          )}
        </div>
        <div class="lat-field lat-inline">
          <p class="lat-lbl">Waktu</p>
          ${seg(
            'Waktu',
            [
              ['none', 'Tanpa waktu'],
              ['item', 'Per soal'],
              ['session', 'Sesi'],
            ],
            prefs.time,
          )}
        </div>
        <div class="lat-field lat-inline" data-mins>
          <p class="lat-lbl">Menit per soal</p>
          ${seg(
            'Menit per soal',
            [
              ['1', '1'],
              ['2', '2'],
              ['3', '3'],
              ['5', '5'],
            ],
            String(prefs.minutes),
          )}
          <p class="lat-advice" data-advice></p>
        </div>
        <button type="button" class="btn btn--primary btn--lg lat-start" data-start>${icon('play')}<span>Mulai latihan</span></button>
      </section>
    </div>`);
    const sync = (): void => {
      node
        .querySelectorAll<HTMLElement>('[data-level]')
        .forEach((b) => b.setAttribute('aria-checked', String(b.dataset.level === prefs.level)));
      const vals: Record<string, string> = {
        'Jumlah soal': String(prefs.count),
        Waktu: prefs.time,
        'Menit per soal': String(prefs.minutes),
      };
      node
        .querySelectorAll<HTMLElement>('[data-seg]')
        .forEach((s) =>
          s
            .querySelectorAll<HTMLElement>('[data-v]')
            .forEach((b) => b.setAttribute('aria-checked', String(b.dataset.v === vals[s.dataset.seg!]))),
        );
      node.querySelector<HTMLElement>('[data-mins]')!.hidden = prefs.time === 'none';
      const adv = Math.ceil((g.make(0, prefs.level).timeAdvice ?? 60) / 60);
      node.querySelector('[data-advice]')!.textContent =
        prefs.time === 'session'
          ? `Total ${prefs.count * prefs.minutes} menit untuk ${prefs.count} soal. Saran: ${adv} menit per soal.`
          : `Saran untuk tingkat ${LEVEL_LABEL[prefs.level]}: ${adv} menit per soal.`;
    };
    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      const lv = tg.closest<HTMLElement>('[data-level]');
      const opt = tg.closest<HTMLElement>('[data-v]');
      if (lv) prefs = { ...prefs, level: lv.dataset.level as Level };
      else if (opt) {
        const s = opt.closest<HTMLElement>('[data-seg]')!.dataset.seg;
        const v = opt.dataset.v!;
        if (s === 'Jumlah soal') prefs = { ...prefs, count: Number(v) as Prefs['count'] };
        else if (s === 'Waktu') prefs = { ...prefs, time: v as TimeMode };
        else prefs = { ...prefs, minutes: Number(v) as Prefs['minutes'] };
      } else if (tg.closest('[data-start]')) {
        SND.init();
        SND.click();
        storage.set(PREFS_KEY, JSON.stringify(prefs));
        replayCode = null;
        startSession(prefs);
        return;
      } else return;
      SND.click();
      sync();
    });
    sync();
    swap(node);
  }

  // =====================================================================
  // Sesi
  // =====================================================================
  function startSession(p: Prefs, seeds?: number[]): void {
    const g = gen!;
    const s = seeds ?? Array.from({ length: p.count }, freshSeed);
    items = s.map((seed) => ({
      inst: g.make(seed, p.level),
      picked: null,
      chosen: null,
      tries: 0,
      hints: 0,
      status: 'open' as Status,
      ms: 0,
    }));
    cur = 0;
    mode = p.time;
    limitMs = p.minutes * 60000;
    leftMs = mode === 'session' ? limitMs * items.length : limitMs;
    paused = false;
    renderPlay();
  }

  let stage: HTMLElement;
  let nav: HTMLElement;

  function renderPlay(): void {
    const node = html(`<div class="lat-play">
      <section class="lat-stage bp" aria-label="Soal latihan">
        <div class="lat-left">
          <article class="soal lat-paper" aria-live="polite"></article>
          <div class="lat-hints"></div>
        </div>
        <div class="lat-right">
          <div class="lat-ans-h"><p class="lat-k">Pilih jawaban</p>
            <button type="button" class="btn lat-hint-btn" data-hint>${icon('circle-help')}<span data-hint-t>Petunjuk 1 dari 3</span></button></div>
          <div class="lat-opts" role="radiogroup" aria-label="Pilihan jawaban"></div>
          <div class="lat-fb" role="status" aria-live="polite"></div>
        </div>
        <div class="lat-sol lay-full" hidden>
          <div class="lat-sol-card" role="dialog" aria-modal="true" aria-label="Langkah penyelesaian">
            <header class="lat-sol-h"><p class="lat-k">Langkah penyelesaian</p><p class="lat-sol-n" data-sol-n></p>
              <button type="button" class="icon-btn" data-sol-x aria-label="Tutup langkah">${icon('x')}</button></header>
            <div class="lat-sol-b"></div>
            <footer class="lat-sol-f">
              <button type="button" class="btn" data-sol-prev>${icon('arrow-left')}<span>Sebelumnya</span></button>
              <button type="button" class="btn btn--primary" data-sol-next><span data-sol-next-t>Berikutnya</span>${icon('arrow-right')}</button>
            </footer>
          </div>
        </div>
      </section>
      <nav class="lat-nav" aria-label="Navigasi latihan">
        <button type="button" class="btn" data-new>${icon('rotate-ccw')}<span class="btn-label">Soal baru</span></button>
        <div class="lat-dots" aria-label="Kemajuan sesi"></div>
        <button type="button" class="btn btn--primary" data-check><span data-check-t>Periksa jawaban</span>${icon('check')}</button>
      </nav>
    </div>`);
    stage = node.querySelector('.lat-stage')!;
    nav = node.querySelector('.lat-nav')!;
    swap(node);

    ink?.destroy();
    ink = new Ink(stage, no);
    ink.onChange = (on) => top()?.querySelector('[data-act="ink"]')?.setAttribute('aria-pressed', String(on));
    board?.destroy();
    board = new Board();
    board.fitHeight = true;
    board.setReplayIcon(icon('rotate-ccw'));
    node.querySelector('.lat-sol-b')!.append(board.el);

    const t = top();
    t?.querySelector<HTMLElement>('[data-act="ink"]')?.removeAttribute('hidden');
    const tb = t?.querySelector<HTMLElement>('[data-act="pause"]');
    if (tb) tb.hidden = mode === 'none';

    const ro = new ResizeObserver(() => fitOpts());
    ro.observe(stage);
    cleanups.push(() => ro.disconnect());
    stage.addEventListener('click', onStage);
    nav.addEventListener('click', onNav);
    showItem(true);
    startTimer();
  }

  const item = (): Item => items[cur]!;
  const final = (s: Status): boolean => s === 'ok' || s === 'key' || s === 'timeout';

  function showItem(fresh: boolean): void {
    const it = item();
    const inst = it.inst;
    if (fresh) {
      warned = false;
      if (mode === 'item') leftMs = limitMs;
      stage.classList.remove('is-warn');
    }
    setBlock(`${pad2(cur + 1)}/${pad2(items.length)}`, LEVEL_LABEL[inst.level]);
    const paper = stage.querySelector<HTMLElement>('.lat-paper')!;
    paper.innerHTML = `<header class="soal-h"><span>Latihan · soal ${cur + 1} dari ${items.length}</span><span>Kode ${esc(inst.code)}</span></header>
      <div class="soal-b">${inst.paper}</div>`;
    renderMath(paper);
    stage.querySelector('.lat-hints')!.replaceChildren();
    for (let h = 0; h < it.hints; h++) appendHint(h, false);
    const box = stage.querySelector<HTMLElement>('.lat-opts')!;
    box.innerHTML = inst.options
      .map(
        (o, i) =>
          `<button type="button" role="radio" class="lat-opt" data-opt="${i}" aria-checked="false"><span class="ol">${LETTERS[i]}</span><span class="lat-opt-m">${mathHtml(`$${o.tex}$`)}</span></button>`,
      )
      .join('');
    box
      .querySelectorAll<HTMLElement>('.lat-opt')
      .forEach((b, i) =>
        b.setAttribute('aria-label', `${LETTERS[i]}. ${mathLabel(b.querySelector('.lat-opt-m')!)}`),
      );
    ink?.setPage(`lat-${inst.code}`);
    renderState();
    fitOpts();
    if (fresh)
      play(
        stage.querySelector('.lat-left')!,
        [
          { opacity: 0, transform: `translateY(${SLIDE_PX / 2}px)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.enter, easing: EASE_OUT, ui: true },
      );
  }

  /** Matriks pilihan tidak boleh terpotong: satu skala huruf --k untuk kelima pilihan (min 55 %). */
  function fitOpts(): void {
    const ms = [...stage.querySelectorAll<HTMLElement>('.lat-opt-m')];
    ms.forEach((m) => m.style.removeProperty('--k'));
    const need = Math.min(
      1,
      ...ms.map((m) => (m.clientWidth && m.scrollWidth ? m.clientWidth / m.scrollWidth : 1)),
    );
    if (need < 0.99) ms.forEach((m) => m.style.setProperty('--k', Math.max(0.55, need).toFixed(3)));
  }

  function appendHint(h: number, anim: boolean): void {
    const host = stage.querySelector<HTMLElement>('.lat-hints')!;
    const card = html(
      `<div class="lat-hint"><span class="lat-hint-k">Petunjuk ${h + 1} · ${HINT_LABEL[h]}</span><p>${mathHtml(item().inst.hints[h]!)}</p></div>`,
    );
    host.append(card);
    if (anim)
      play(
        card,
        [
          { opacity: 0, transform: `translateY(${SLIDE_PX / 3}px)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.slow, easing: EASE_OUT, ui: true },
      );
  }

  /** Perbarui pilihan, umpan balik, tombol, dan titik kemajuan dari keadaan soal (idempoten). */
  function renderState(): void {
    const it = item();
    const inst = it.inst;
    const done = final(it.status);
    stage.querySelectorAll<HTMLElement>('.lat-opt').forEach((b, i) => {
      const wrongTried = it.status !== 'open' && i === it.chosen && i !== inst.key;
      b.setAttribute('aria-checked', String(i === it.picked));
      b.classList.toggle('is-wrong', wrongTried || (it.status === 'wrong' && i === it.chosen));
      b.classList.toggle('is-key', done && i === inst.key);
      (b as HTMLButtonElement).disabled = done || (it.status === 'wrong' && i === it.chosen);
    });
    const hb = stage.querySelector<HTMLButtonElement>('[data-hint]')!;
    hb.disabled = done || it.hints >= 3;
    stage.querySelector('[data-hint-t]')!.textContent =
      it.hints >= 3 ? 'Semua petunjuk dibuka' : `Petunjuk ${it.hints + 1} dari 3`;
    // umpan balik
    const fb = stage.querySelector<HTMLElement>('.lat-fb')!;
    fb.className = 'lat-fb';
    fb.innerHTML = '';
    const testLine = (i: number): string => {
      const t = inst.test(i);
      return `<p class="lat-test"><span class="lat-test-k">Uji pilihan ${LETTERS[i]}</span>${mathHtml(`$${t.tex}$`)}</p>`;
    };
    const keyLine = `Kuncinya <b>${LETTERS[inst.key]}</b>: ${mathHtml(`$${inst.options[inst.key]!.tex}$`)}`;
    const steps = `<button type="button" class="btn lat-steps" data-steps>${icon('list')}<span>Lihat langkah</span></button>`;
    if (it.status === 'ok') {
      fb.classList.add('is-ok');
      fb.innerHTML = `<p class="lat-fb-t"><b class="k-gold">Benar.</b> ${keyLine}</p>${testLine(inst.key)}<div class="lat-fb-a">${steps}</div>`;
    } else if (it.status === 'wrong') {
      const tr = inst.options[it.chosen!]!.trap;
      fb.classList.add('is-no');
      fb.innerHTML = `<p class="lat-fb-t"><b class="k-red">Belum tepat.</b> ${mathHtml(tr?.hint ?? '')}</p>${testLine(it.chosen!)}
        <p class="lat-fb-s">Coba sekali lagi, atau buka kuncinya.</p>
        <div class="lat-fb-a"><button type="button" class="btn" data-reveal>${icon('eye')}<span>Buka kunci</span></button></div>`;
    } else if (it.status === 'key' || it.status === 'timeout') {
      const tr = it.chosen !== null && it.chosen !== inst.key ? inst.options[it.chosen]!.trap : undefined;
      fb.classList.add(it.status === 'timeout' ? 'is-time' : 'is-key');
      fb.innerHTML = `<p class="lat-fb-t">${it.status === 'timeout' ? `<b class="k-red">Waktu habis.</b> ${it.chosen === inst.key ? 'Jawabanmu yang terkunci sudah benar. ' : ''}` : ''}${keyLine}</p>
        ${tr ? `<p class="lat-fb-s">${mathHtml(tr.hint)}</p>` : ''}${testLine(inst.key)}<div class="lat-fb-a">${steps}</div>`;
    }
    // navigasi bawah
    const last = cur === items.length - 1;
    const check = nav.querySelector<HTMLButtonElement>('[data-check]')!;
    nav.querySelector('[data-check-t]')!.textContent = done
      ? last
        ? 'Lihat hasil'
        : 'Soal berikutnya'
      : 'Periksa jawaban';
    check.querySelector('.lucide')!.outerHTML = icon(done ? 'arrow-right' : 'check');
    check.setAttribute('aria-disabled', String(!done && it.picked === null));
    const nb = nav.querySelector<HTMLButtonElement>('[data-new]')!;
    nb.hidden = done || it.status === 'wrong' || replayCode !== null;
    nav.querySelector('.lat-dots')!.innerHTML = items
      .map((x, i) => {
        const st = final(x.status) ? (x.status === 'ok' ? 'ok' : 'no') : i === cur ? 'cur' : '';
        const lbl = `Soal ${i + 1}: ${x.status === 'ok' ? 'benar' : x.status === 'timeout' ? 'waktu habis' : final(x.status) ? 'belum tepat' : i === cur ? 'sedang dikerjakan' : 'belum dikerjakan'}`;
        return `<span class="lat-dot ${st}${i === cur ? ' is-cur' : ''}" role="img" aria-label="${lbl}"></span>`;
      })
      .join('');
  }

  function pick(i: number): void {
    const it = item();
    if (final(it.status) || (it.status === 'wrong' && i === it.chosen)) return;
    it.picked = i;
    SND.click();
    renderState();
  }

  function check(): void {
    const it = item();
    if (final(it.status)) return advance();
    if (it.picked === null) return;
    const i = it.picked;
    it.chosen = i;
    it.picked = null;
    if (it.inst.options[i]!.ok) {
      it.status = 'ok';
      SND.correct();
      finish(it);
    } else if (it.tries === 0) {
      it.tries = 1;
      it.status = 'wrong';
      SND.wrong();
    } else {
      it.status = 'key';
      SND.wrong();
      finish(it);
    }
    renderState();
    const fb = stage.querySelector<HTMLElement>('.lat-fb')!;
    // layar pendek: kolom jawaban digulir agar umpan balik terlihat
    // (hanya kolom itu sendiri; scrollIntoView juga menggeser leluhur yang overflow: hidden)
    const col = stage.querySelector<HTMLElement>('.lat-right')!;
    col.scrollTo({ top: col.scrollHeight, behavior: reducedMotion() ? 'auto' : 'smooth' });
    play(
      fb,
      [
        { opacity: 0, transform: `translateY(${SLIDE_PX / 3}px)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration: DUR.slow, easing: EASE_OUT, ui: true },
    );
  }

  /** Soal selesai: catat hasil (FR-LAT-4, §7.4). */
  function finish(it: Item): void {
    const rec: PracticeRecord = {
      ts: Date.now(),
      level: it.inst.level,
      seed: it.inst.code,
      correct: it.status === 'ok' || (it.status === 'timeout' && it.chosen === it.inst.key),
      hints: it.hints,
      timeMs: Math.round(it.ms),
      ...(it.status === 'timeout' ? { timeout: true } : {}),
    };
    store.addPractice(no, rec);
  }

  function advance(): void {
    closeSteps();
    if (cur < items.length - 1) {
      cur++;
      SND.click();
      showItem(true);
    } else showSummary();
  }

  function onStage(e: Event): void {
    const tg = e.target as Element;
    const o = tg.closest<HTMLElement>('[data-opt]');
    if (o) return pick(Number(o.dataset.opt));
    if (tg.closest('[data-hint]')) {
      const it = item();
      if (it.hints < 3 && !final(it.status)) {
        SND.click();
        appendHint(it.hints, true);
        it.hints++;
        renderState();
      }
    } else if (tg.closest('[data-reveal]')) {
      const it = item();
      it.status = 'key';
      SND.click();
      finish(it);
      renderState();
    } else if (tg.closest('[data-steps]')) openSteps();
    else if (tg.closest('[data-sol-x]')) closeSteps();
    else if (tg.closest('[data-sol-prev]')) stepTo(solK - 1);
    else if (tg.closest('[data-sol-next]')) solNext();
  }

  function onNav(e: Event): void {
    const tg = e.target as Element;
    if (tg.closest('[data-check]')) {
      SND.init();
      check();
    } else if (tg.closest('[data-new]')) {
      const it = item();
      if (final(it.status) || it.status === 'wrong') return;
      SND.click();
      items[cur] = { ...it, inst: gen!.make(freshSeed(), it.inst.level), picked: null, hints: 0 };
      showItem(false);
    }
  }

  // ---------- Lihat langkah (papan pembahasan yang sama, FR-LAT-6) ----------
  let solK = 0;
  let solRun = 0;
  let solBusy = false;

  function openSteps(): void {
    const sol = stage.querySelector<HTMLElement>('.lat-sol')!;
    sol.hidden = false;
    play(sol, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.base, ui: true });
    stepTo(0);
    requestAnimationFrame(() =>
      sol.querySelector<HTMLElement>('[data-sol-next]')?.focus({ preventScroll: true }),
    );
  }

  function closeSteps(): void {
    const sol = stage?.querySelector<HTMLElement>('.lat-sol');
    if (!sol || sol.hidden) return;
    solRun++;
    board?.flush();
    completeAll('fly');
    sol.hidden = true;
    stage.querySelector<HTMLElement>('[data-steps]')?.focus({ preventScroll: true });
  }

  /** Tampilkan bagian k; animasi baris bila maju, keadaan akhir bila mundur atau dilewati. */
  function stepTo(k: number, animate = true): void {
    const chs = item().inst.solution;
    if (k < 0 || k >= chs.length || !board) return;
    const dirFwd = animate && k >= solK;
    solK = k;
    const run = ++solRun;
    const c: Ctx = {
      run,
      dir: dirFwd ? 1 : -1,
      seq: false,
      replay: false,
      entered: true,
      live: () => run === solRun,
    };
    const ch = chs[k]!;
    stage.querySelector('[data-sol-n]')!.textContent = `Bagian ${k + 1} dari ${chs.length} · ${ch.title}`;
    stage.querySelector<HTMLButtonElement>('[data-sol-prev]')!.disabled = k === 0;
    stage.querySelector('[data-sol-next-t]')!.textContent = k === chs.length - 1 ? 'Tutup' : 'Berikutnya';
    board.chapter(ch.title, [], c);
    solBusy = true;
    void board.to(ch.rows, ch.rows.length, 0, c).then(() => {
      if (run === solRun) solBusy = false;
    });
  }

  function solNext(): void {
    const chs = item().inst.solution;
    // masih menulis: selesaikan bagian ini dulu (sama seperti Lanjut di pembahasan)
    if (solBusy) return stepTo(solK, false);
    if (solK >= chs.length - 1) return closeSteps();
    stepTo(solK + 1);
  }

  // ---------- timer (FR-LAT-7) ----------
  function startTimer(): void {
    stopTimer();
    lastTick = performance.now();
    timer = window.setInterval(tick, 250);
    tick();
  }

  function stopTimer(): void {
    window.clearInterval(timer);
    timer = 0;
  }

  function tick(): void {
    const now = performance.now();
    const dt = now - lastTick;
    lastTick = now;
    if (!items.length) return;
    const it = item();
    const open = !final(it.status);
    if (open && !paused) {
      it.ms += dt;
      if (mode !== 'none') leftMs -= dt;
    }
    const tb = top()?.querySelector<HTMLElement>('[data-act="pause"]');
    if (mode === 'none' || !tb) return;
    tb.querySelector('[data-time]')!.textContent = mmss(leftMs);
    tb.setAttribute('aria-label', `Sisa waktu ${mmss(leftMs)}. ${paused ? 'Lanjutkan waktu' : 'Jeda waktu'}`);
    const warn = leftMs <= WARN_MS && open;
    tb.classList.toggle('is-warn', warn);
    if (warn && !warned) {
      warned = true;
      navigator.vibrate?.(80);
    }
    if (leftMs <= 0 && open) timeUp();
  }

  function timeUp(): void {
    const lock = (x: Item): void => {
      if (final(x.status)) return;
      // jawaban yang sedang dipilih ikut dikunci (FR-LAT-7)
      if (x.picked !== null) x.chosen = x.picked;
      x.picked = null;
      x.status = 'timeout';
      finish(x);
    };
    SND.wrong();
    if (mode === 'session') {
      items.forEach(lock);
      renderState();
      return;
    }
    lock(item());
    renderState();
  }

  function togglePause(): void {
    if (mode === 'none') return;
    paused = !paused;
    const tb = top()?.querySelector<HTMLElement>('[data-act="pause"]');
    tb?.setAttribute('aria-pressed', String(paused));
    tb?.querySelector('.lat-timer-k')?.replaceChildren(paused ? 'Lanjutkan' : 'Jeda');
    stage?.classList.toggle('is-paused', paused);
    tick();
  }

  // =====================================================================
  // Ringkasan (FR-LAT-8)
  // =====================================================================
  function showSummary(): void {
    stopTimer();
    ink?.setActive(false);
    ink?.destroy();
    ink = null;
    const t = top();
    t?.querySelector<HTMLElement>('[data-act="pause"]')?.setAttribute('hidden', '');
    t?.querySelector<HTMLElement>('[data-act="ink"]')?.setAttribute('hidden', '');
    setBlock('HASIL', LEVEL_LABEL[items[0]!.inst.level]);
    const ok = items.filter(
      (x) => x.status === 'ok' || (x.status === 'timeout' && x.chosen === x.inst.key),
    ).length;
    const clean = items.filter((x) => x.status === 'ok' && x.hints === 0).length;
    const totalMs = items.reduce((s, x) => s + x.ms, 0);
    const hints = items.reduce((s, x) => s + x.hints, 0);
    const pill = (x: Item): string =>
      x.status === 'ok'
        ? `<span class="pill pill--done">${icon('check')}Benar</span>`
        : x.status === 'timeout'
          ? `<span class="pill pill--review">${icon('timer')}Waktu habis</span>`
          : `<span class="pill pill--review">${icon('x')}Belum tepat</span>`;
    const chapterOf = (x: Item): number => {
      const tr = x.chosen !== null ? x.inst.options[x.chosen]?.trap : undefined;
      return tr?.chapter ?? (x.inst.level === 'mudah' ? 2 : 3);
    };
    const firstF = (x: Item): string => /\$\$([\s\S]+?)\$\$/.exec(x.inst.paper)?.[1] ?? '';
    const node = html(`<div class="lat-sum">
      <section class="lat-sum-hero bp crop" aria-labelledby="sum-t">
        <p class="eyebrow">Hasil latihan · ${LEVEL_LABEL[items[0]!.inst.level]}</p>
        <h1 class="lat-sum-big" id="sum-t"><span class="num">${ok}</span><span class="lat-sum-of">dari ${items.length} soal benar</span></h1>
        <dl class="lat-sum-stats">
          <div><dt>Waktu</dt><dd class="num">${mmss(totalMs)}</dd></div>
          <div><dt>Petunjuk dipakai</dt><dd class="num">${hints}</dd></div>
          <div><dt>Benar tanpa petunjuk</dt><dd class="num">${clean}</dd></div>
        </dl>
        <p class="lat-sum-note">${
          ok === items.length
            ? 'Semua benar. Coba tingkat berikutnya untuk menguji batas pemahamanmu.'
            : 'Buka bagian pembahasan yang terkait dengan soal yang belum tepat, lalu ulangi soalnya.'
        }</p>
      </section>
      <section class="lat-sum-list" aria-label="Rincian per soal">
        <ol>${items
          .map(
            (x, i) => `<li class="lat-sum-row">
              <span class="lat-sum-no">${pad2(i + 1)}</span>
              <span class="lat-sum-m">${mathHtml(`$${firstF(x)}$`)}</span>
              <span class="lat-sum-meta">${pill(x)}<span class="lat-sum-code">Kode ${esc(x.inst.code)}${x.hints ? ` · ${x.hints} petunjuk` : ''}</span></span>
              <span class="lat-sum-acts">
                <a class="btn" href="#/soal/${no}/latihan?s=${encodeURIComponent(x.inst.code)}">${icon('rotate-ccw')}<span>Ulangi soal ini</span></a>
                ${x.status === 'ok' ? '' : `<a class="btn" href="#/soal/${no}/bahas?b=${chapterOf(x)}">${icon('play')}<span>Bahas bagian terkait</span></a>`}
              </span></li>`,
          )
          .join('')}</ol>
        <div class="lat-sum-foot">
          <button type="button" class="btn btn--primary" data-again>${icon('rotate-ccw')}<span>Latihan lagi</span></button>
          <button type="button" class="btn" data-setup>${icon('settings')}<span>Ubah pengaturan</span></button>
          <a class="btn" href="#/soal/${no}">${icon('arrow-left')}<span>Kembali ke soal</span></a>
        </div>
      </section>
    </div>`);
    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      if (tg.closest('[data-again]')) {
        SND.click();
        replayCode = null;
        startSession(prefs);
      } else if (tg.closest('[data-setup]')) {
        SND.click();
        showSetup();
      }
    });
    swap(node);
    if (ok === items.length) SND.chime();
  }

  // ---------- kontrol global ----------
  const onTop = (e: Event): void => {
    const a = (e.target as Element).closest<HTMLElement>('[data-act]')?.dataset.act;
    if (a === 'pause') togglePause();
    else if (a === 'ink' && ink) ink.setActive(!ink.isActive);
  };
  const onKey = (e: KeyboardEvent): void => {
    const tg = e.target as HTMLElement | null;
    if (isSheetOpen() || e.ctrlKey || e.metaKey || e.altKey) return;
    if (tg && (tg.tagName === 'INPUT' || tg.isContentEditable)) return;
    if (!stage?.isConnected) return;
    const sol = stage.querySelector<HTMLElement>('.lat-sol');
    const k = e.key.toLowerCase();
    if (e.key === 'Escape') {
      if (sol && !sol.hidden) closeSteps();
      else if (ink?.isActive) ink.setActive(false);
    } else if (sol && !sol.hidden) {
      if (e.key === 'ArrowRight') solNext();
      else if (e.key === 'ArrowLeft') stepTo(solK - 1);
    } else if (k === 'c' && ink) ink.setActive(!ink.isActive);
    else if (LETTERS.toLowerCase().includes(k) && k.length === 1 && !(tg && tg.closest('button, a')))
      pick(LETTERS.toLowerCase().indexOf(k));
  };
  const host = top();
  host?.addEventListener('click', onTop);
  document.addEventListener('keydown', onKey);
  cleanups.push(() => host?.removeEventListener('click', onTop));
  cleanups.push(() => document.removeEventListener('keydown', onKey));

  return {
    el,
    title: `Latihan soal ${no}`,
    header,
    footer: false,
    destroy() {
      store.addTime(performance.now() - t0);
      stopTimer();
      solRun++;
      ink?.destroy();
      board?.destroy();
      cleanups.forEach((f) => f());
    },
  };
}
