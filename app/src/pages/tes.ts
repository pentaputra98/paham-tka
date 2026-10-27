/**
 * Tes penguasaan materi (revisi pemilik v1.24).
 *  - #/tes: identitas (nama, asal sekolah, papan ketik aplikasi) → petunjuk → mulai; atau lanjutkan tes yang berjalan.
 *  - #/tes/kerjakan?n=: 21 soal, 40 menit; bebas berpindah lewat Daftar soal, tanda Ragu-ragu; waktu habis →
 *    dikumpulkan otomatis. Jawaban tersimpan setiap berubah, jadi muat ulang atau menutup aplikasi aman.
 *  - Kumpulkan → animasi proses → #/tes/hasil?id=: persen per materi, statistik, saran belajar, perkembangan,
 *    rincian jawaban dengan pembahasan singkat, simpan PDF, coba lagi (soal baru).
 *  - #/tes/riwayat: semua percobaan di perangkat ini, dikelompokkan per peserta.
 * Tanpa poin, peringkat, atau bahasa permainan; data hanya di perangkat (PRD §15.2).
 */
import { SND } from '../core/audio';
import { reducedMotion } from '../core/clock';
import { clamp, esc, html, pad2 } from '../core/dom';
import { icon } from '../core/icons';
import { mathHtml, mathLabel, renderMath } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE_OUT, SLIDE_PX } from '../core/tokens';
import { isReady } from '../content';
import { hasPractice } from '../practice/registry';
import type { Route } from '../router/router';
import { navigate, type HeaderSpec, type PageView } from '../shell/app';
import { mountKeyboard, type Keyboard } from '../shell/keyboard';
import { closeSheet, isSheetOpen, openSheet } from '../shell/sheet';
import { toast } from '../shell/toast';
import {
  emptyResp,
  isCorrect,
  itemState,
  LEVEL_LABEL,
  levelOf,
  summarize,
  weakestFirst,
  type Level,
  type Summary,
} from '../tes/score';
import { tes, type Attempt, type Profile } from '../tes/state';
import {
  KIND_LABEL,
  MATERI,
  MATERI_LABEL,
  MATERI_SOAL,
  TES_MINUTES,
  type Resp,
  type TesItem,
} from '../tes/types';

const LETTERS = 'ABCDE';
const LIMIT_MS = TES_MINUTES * 60000;
const SCHOOL_DEFAULT = 'SMA Vidatra Bontang';

const mmss = (ms: number): string => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
};

const fmtDate = (ts: number): string =>
  new Date(ts).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const PILL: Record<Level, string> = {
  kuat: 'pill--done',
  cukup: 'pill--done',
  lemah: 'pill--review',
  belum: 'pill--review',
};

/** Tes yang waktunya sudah habis (mis. aplikasi ditutup) dikumpulkan otomatis. */
function collectExpired(): Attempt | null {
  const a = tes.active;
  return a && Date.now() >= a.deadline ? tes.submit(true) : null;
}

function freshSeed(): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0]!;
}

function swapIn(host: HTMLElement, node: HTMLElement): void {
  host.replaceChildren(node);
  // tampilan pertama ikut transisi halaman dari shell (elemen belum terpasang di dokumen)
  if (!host.isConnected) return;
  play(
    node,
    [
      { opacity: 0, transform: `translateX(${SLIDE_PX}px)` },
      { opacity: 1, transform: 'none' },
    ],
    { duration: DUR.enter, easing: EASE_OUT, ui: true },
  );
}

/** Pengalihan setelah halaman terpasang (router sedang merender). */
const later = (hash: string, msg?: string): void => {
  setTimeout(() => {
    navigate(hash, { replace: true });
    if (msg) toast(msg);
  }, 0);
};

export function tesPage(route: Route): PageView {
  switch (route.name) {
    case 'tes-kerjakan':
      return sessionView(route);
    case 'tes-hasil':
      return resultView(route);
    case 'tes-riwayat':
      return historyView();
    default:
      return lobbyView(route);
  }
}

const INTRO = `<section class="tes-intro bp crop" aria-labelledby="tes-t">
  <p class="eyebrow">Tes penguasaan materi</p>
  <h1 class="tes-title" id="tes-t">Seberapa kuat penguasaanmu di setiap materi TKA?</h1>
  <p class="tes-lede">Soal-soal dari 7 materi Matematika Tingkat Lanjut, sedikit lebih ringan dari soal TKA 2025. Hasilnya menunjukkan persen penguasaanmu per materi, jadi kamu tahu materi mana yang perlu diperkuat.</p>
  <dl class="tes-facts">
    <div><dt>Soal</dt><dd class="num">21</dd></div>
    <div><dt>Waktu</dt><dd class="num">${TES_MINUTES} menit</dd></div>
    <div><dt>Materi</dt><dd class="num">7</dd></div>
  </dl>
  <ul class="tes-chips" aria-label="Materi yang diuji">${MATERI.map((m) => `<li>${MATERI_LABEL[m]}</li>`).join('')}</ul>
</section>`;

// =============================================================================================
// Lobi: identitas → petunjuk → mulai
// =============================================================================================
function lobbyView(route: Route): PageView {
  const el = html('<div class="tes"></div>');
  const header: HeaderSpec = {
    back: { label: 'Beranda', href: '#/' },
    block: { k: 'TES', n: '–', t: 'Penguasaan materi' },
  };
  let kb: Keyboard | null = null;
  let tick = 0;
  const view = { el, title: 'Tes penguasaan', header, footer: false, destroy };

  const expired = collectExpired();
  if (expired) {
    later(`#/tes/hasil?id=${expired.id}`, 'Waktu tes sudah habis. Jawabanmu dikumpulkan otomatis.');
    return view;
  }

  function destroy(): void {
    kb?.destroy();
    kb = null;
    window.clearInterval(tick);
  }

  // header dirender setelah halaman dibuat: nilai awal lewat objek header, berikutnya langsung di DOM
  const setBlock = (t: string): void => {
    header.block!.t = t;
    const tb = el.isConnected ? document.querySelector('.tblock .tb-t') : null;
    if (tb) tb.textContent = t;
  };

  // ---------- identitas ----------
  function showIdentity(): void {
    destroy();
    setBlock('Identitas');
    history.replaceState(null, '', '#/tes');
    const p = tes.profile;
    const schools = [
      ...new Set([p?.school, ...[...tes.history].reverse().map((h) => h.school), SCHOOL_DEFAULT]),
    ]
      .filter((s): s is string => !!s)
      .slice(0, 3);
    const n = tes.history.length;
    const node = html(`<div class="tes-lobby">
      ${INTRO}
      <section class="tes-form" aria-labelledby="id-t">
        <h2 class="tes-h2" id="id-t">Identitas peserta</h2>
        <label class="tes-field"><span class="tes-lbl">Nama lengkap</span>
          <input class="tes-input" data-f="name" maxlength="40" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Ketuk untuk mengisi"></label>
        <label class="tes-field"><span class="tes-lbl">Asal sekolah</span>
          <input class="tes-input" data-f="school" maxlength="50" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Ketuk untuk mengisi"></label>
        <div class="tes-sugg" role="group" aria-label="Pilih sekolah">${schools
          .map((s) => `<button type="button" class="chip" data-school="${esc(s)}">${esc(s)}</button>`)
          .join('')}</div>
        <p class="tes-err" role="alert" data-err></p>
        <div class="tes-actions">
          <button type="button" class="btn btn--primary btn--lg" data-next><span>Lanjut ke petunjuk</span>${icon('arrow-right')}</button>
          ${n ? `<a class="btn" href="#/tes/riwayat">${icon('history')}<span>Riwayat tes (${n})</span></a>` : ''}
        </div>
        <p class="tes-note">Nama dan sekolah hanya tersimpan di perangkat ini.</p>
      </section>
    </div>`);
    const name = node.querySelector<HTMLInputElement>('[data-f="name"]')!;
    const school = node.querySelector<HTMLInputElement>('[data-f="school"]')!;
    name.value = p?.name ?? '';
    school.value = p?.school ?? '';
    const err = node.querySelector<HTMLElement>('[data-err]')!;

    const submit = (): void => {
      const nm = name.value.replace(/\s+/g, ' ').trim();
      const sc = school.value.replace(/\s+/g, ' ').trim();
      const bad = nm.replace(/[^a-z]/gi, '').length < 3 ? name : sc.length < 3 ? school : null;
      if (bad) {
        err.textContent =
          bad === name ? 'Isi nama lengkapmu dulu, minimal 3 huruf.' : 'Isi asal sekolahmu dulu.';
        bad.classList.add('is-bad');
        kb?.open(bad === name ? 0 : 1);
        bad.focus({ preventScroll: true });
        SND.wrong();
        return;
      }
      SND.click();
      tes.setProfile({ name: nm, school: sc });
      showGuide();
    };

    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      const s = tg.closest<HTMLElement>('[data-school]');
      if (s) {
        school.value = s.dataset.school!;
        school.dispatchEvent(new Event('input', { bubbles: true }));
        SND.click();
      } else if (tg.closest('[data-next]')) {
        kb?.close();
        submit();
      }
    });
    node.addEventListener('input', (e) => {
      (e.target as HTMLElement).classList.remove('is-bad');
      err.textContent = '';
    });
    node.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || !(e.target instanceof HTMLInputElement)) return;
      e.preventDefault();
      if (e.target === name) school.focus();
      else {
        kb?.close();
        submit();
      }
    });
    swapIn(el, node);
    kb = mountKeyboard(
      el,
      [
        { input: name, label: 'Nama lengkap' },
        { input: school, label: 'Asal sekolah' },
      ],
      submit,
    );
  }

  // ---------- petunjuk ----------
  function showGuide(): void {
    destroy();
    const p = tes.profile;
    if (!p) return showIdentity();
    setBlock('Petunjuk');
    history.replaceState(null, '', '#/tes?langkah=petunjuk');
    const next = tes.sameAs(p).reduce((m, h) => Math.max(m, h.no), 0) + 1;
    const rule = (ic: Parameters<typeof icon>[0], b: string, t: string): string =>
      `<li>${icon(ic)}<p><b>${b}</b> ${t}</p></li>`;
    const node = html(`<div class="tes-guide">
      <section class="tes-guide-card" aria-labelledby="g-t">
        <p class="eyebrow">Petunjuk tes</p>
        <h1 class="tes-title tes-title--ink" id="g-t">Baca dulu sebelum mulai</h1>
        <ol class="tes-rules">
          ${rule('clipboard-check', 'Tujuan.', `Tes ini mengukur berapa persen penguasaanmu di setiap materi: ${MATERI.map((m) => MATERI_LABEL[m]).join(', ')}.`)}
          ${rule('list-checks', `21 soal, ${TES_MINUTES} menit.`, 'Tiga soal per materi. Tingkatnya sedikit di bawah soal TKA 2025, dan angkanya berbeda setiap kali tes diulang.')}
          ${rule('circle-dot', 'Bentuk soal seperti TKA.', 'Pilih satu jawaban, pilih semua jawaban yang benar, dan tabel Benar/Salah. Soal dihitung tepat bila seluruh bagiannya tepat.')}
          ${rule('layout-grid', 'Bebas berpindah soal.', 'Lewati soal yang sulit, lalu kembali lewat Daftar soal. Tandai Ragu-ragu bila kurang yakin.')}
          ${rule('timer', 'Waktu terus berjalan,', 'walaupun aplikasi ditutup. Saat waktu habis, jawabanmu dikumpulkan otomatis.')}
          ${rule('eye-off', 'Kerjakan sendiri.', 'Jangan membuka pembahasan selama tes, supaya hasilnya menggambarkan kemampuanmu yang sebenarnya.')}
        </ol>
      </section>
      <aside class="tes-guide-side" aria-label="Peserta">
        <p class="tes-lbl">Peserta</p>
        <p class="tes-who"><b data-who-n></b><span data-who-s></span></p>
        <p class="tes-attempt">${icon('history')}Percobaan ke-${next}</p>
        <button type="button" class="btn btn--primary btn--lg" data-start>${icon('play')}<span>Mulai tes</span></button>
        <button type="button" class="btn" data-edit>${icon('pen-line')}<span>Ubah identitas</span></button>
      </aside>
    </div>`);
    node.querySelector('[data-who-n]')!.textContent = p.name;
    node.querySelector('[data-who-s]')!.textContent = p.school;
    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      if (tg.closest('[data-edit]')) {
        SND.click();
        showIdentity();
      } else if (tg.closest('[data-start]')) void start(p, tg.closest<HTMLButtonElement>('[data-start]')!);
    });
    swapIn(el, node);
  }

  async function start(p: Profile, btn: HTMLButtonElement): Promise<void> {
    btn.disabled = true;
    SND.init();
    SND.click();
    const { makeTest } = await import('../tes/bank');
    const seed = freshSeed();
    const items = makeTest(seed);
    tes.start(p, seed, items, items.map(emptyResp), LIMIT_MS);
    navigate('#/tes/kerjakan?n=1');
  }

  // ---------- tes yang sedang berjalan ----------
  function showActive(): void {
    destroy();
    const a = tes.active!;
    setBlock('Sedang berjalan');
    const answered = a.items.filter((it, i) => itemState(it, a.resps[i]!) === 'done').length;
    const node = html(`<div class="tes-lobby">
      ${INTRO}
      <section class="tes-form" aria-labelledby="act-t">
        <h2 class="tes-h2" id="act-t">Tes sedang berjalan</h2>
        <p class="tes-who"><b data-who-n></b><span data-who-s></span></p>
        <dl class="tes-run">
          <div><dt>Sisa waktu</dt><dd class="num" data-left>${mmss(a.deadline - Date.now())}</dd></div>
          <div><dt>Dijawab</dt><dd class="num">${answered}/${a.items.length}</dd></div>
        </dl>
        <div class="tes-actions">
          <a class="btn btn--primary btn--lg" href="#/tes/kerjakan?n=${a.cur + 1}">${icon('play')}<span>Lanjutkan tes</span></a>
          <button type="button" class="btn" data-cancel>${icon('x')}<span>Batalkan tes ini</span></button>
        </div>
        <p class="tes-note">Waktu tes terus berjalan. Saat waktu habis, jawabanmu dikumpulkan otomatis.</p>
      </section>
    </div>`);
    node.querySelector('[data-who-n]')!.textContent = a.name;
    node.querySelector('[data-who-s]')!.textContent = a.school;
    const left = node.querySelector<HTMLElement>('[data-left]')!;
    tick = window.setInterval(() => {
      const ms = a.deadline - Date.now();
      left.textContent = mmss(ms);
      if (ms <= 0) {
        window.clearInterval(tick);
        const at = collectExpired();
        if (at) later(`#/tes/hasil?id=${at.id}`, 'Waktu tes sudah habis. Jawabanmu dikumpulkan otomatis.');
      }
    }, 1000);
    node.querySelector('[data-cancel]')!.addEventListener('click', () =>
      openSheet({
        title: 'Batalkan tes ini?',
        body: '<p>Jawaban yang sudah diisi akan dihapus dan tidak masuk riwayat. Kamu bisa memulai tes baru kapan saja.</p>',
        actions: [
          {
            label: 'Batalkan tes',
            kind: 'danger',
            icon: 'trash-2',
            onClick: () => {
              tes.cancelActive();
              toast('Tes dibatalkan.');
              showIdentity();
            },
          },
        ],
        closeLabel: 'Kembali',
      }),
    );
    swapIn(el, node);
  }

  if (tes.active) showActive();
  else if (route.query.langkah === 'petunjuk' && tes.profile) showGuide();
  else showIdentity();
  return view;
}

// =============================================================================================
// Pengerjaan
// =============================================================================================
function sessionView(route: Route): PageView {
  const el = html('<div class="tes tes-play-host"></div>');
  const header: HeaderSpec = {
    back: { label: 'Keluar', href: '#/tes' },
    block: { k: 'TES', n: '–', t: '' },
    extra: `<span class="tes-timer" role="timer" aria-live="off" data-timer>${icon('timer')}<span data-time>${pad2(TES_MINUTES)}:00</span></span>`,
  };
  const cleanups: Array<() => void> = [];
  const view: PageView = {
    el,
    title: 'Tes penguasaan',
    header,
    footer: false,
    refreshHash: () => `#/tes/kerjakan?n=${cur + 1}`,
    destroy: () => cleanups.forEach((f) => f()),
  };

  const expired = collectExpired();
  if (expired) {
    later(`#/tes/hasil?id=${expired.id}`, 'Waktu tes sudah habis. Jawabanmu dikumpulkan otomatis.');
    return view;
  }
  const a = tes.active;
  if (!a) {
    later('#/tes');
    return view;
  }
  const items = a.items;
  const resps = a.resps;
  const total = items.length;
  let cur = clamp(Number(route.query.n ?? a.cur + 1) - 1 || 0, 0, total - 1);
  let finished = false;
  let warned5 = false;
  let warned1 = false;
  let lastTick = performance.now();
  let lastSave = Date.now();

  const node = html(`<div class="tes-play">
    <section class="tes-stage" aria-label="Soal tes">
      <article class="soal tes-paper" aria-live="polite"></article>
      <div class="tes-ans">
        <p class="tes-k" data-kind></p>
        <div class="tes-opts"></div>
        <div class="tes-ans-f"><button type="button" class="link-btn" data-clear>Hapus jawaban</button></div>
      </div>
    </section>
    <nav class="tes-nav" aria-label="Navigasi soal">
      <button type="button" class="btn" data-prev>${icon('arrow-left')}<span class="btn-label">Sebelumnya</span></button>
      <div class="tes-nav-mid">
        <button type="button" class="btn tes-map-btn" data-map aria-expanded="false">${icon('layout-grid')}<span class="btn-label">Daftar soal</span><span class="tes-count num" data-count></span></button>
        <button type="button" class="btn tes-flag" data-flag aria-pressed="false">${icon('flag')}<span>Ragu-ragu</span></button>
      </div>
      <button type="button" class="btn btn--primary" data-next><span data-next-t>Berikutnya</span>${icon('arrow-right')}</button>
    </nav>
      <div class="tes-map" hidden>
        <div class="tes-map-card" role="dialog" aria-label="Daftar soal">
          <header class="tes-map-h">
            <p class="tes-k">Daftar soal</p>
            <ul class="tes-legend" aria-hidden="true">
              <li><span class="tes-cell is-done"></span>Dijawab</li>
              <li><span class="tes-cell is-partial"></span>Belum lengkap</li>
              <li><span class="tes-cell"></span>Belum dijawab</li>
              <li><span class="tes-cell is-flag"></span>Ragu-ragu</li>
            </ul>
            <button type="button" class="icon-btn" data-map-x aria-label="Tutup daftar soal">${icon('x')}</button>
          </header>
          <div class="tes-map-b">${MATERI.map(
            (m) =>
              `<div class="tes-map-row"><span class="tes-map-l">${MATERI_LABEL[m]}</span><div class="tes-map-n">${items
                .flatMap((it, i) => (it.materi === m ? [i] : []))
                .map((i) => `<button type="button" class="tes-cell" data-go="${i}">${i + 1}</button>`)
                .join('')}</div></div>`,
          ).join('')}</div>
          <footer class="tes-map-f">
            <p class="tes-map-sum" data-map-sum></p>
            <button type="button" class="btn btn--primary" data-submit>${icon('check')}<span>Kumpulkan tes</span></button>
          </footer>
        </div>
      </div>
  </div>`);
  el.append(node);
  const stage = node.querySelector<HTMLElement>('.tes-stage')!;
  const paper = node.querySelector<HTMLElement>('.tes-paper')!;
  const opts = node.querySelector<HTMLElement>('.tes-opts')!;
  const map = node.querySelector<HTMLElement>('.tes-map')!;
  const nav = node.querySelector<HTMLElement>('.tes-nav')!;

  const item = (): TesItem => items[cur]!;
  const resp = () => resps[cur]!;
  const save = (): void => {
    a.cur = cur;
    tes.saveActive();
    lastSave = Date.now();
  };

  // header dirender setelah halaman dibuat: nilai awal lewat objek header, berikutnya langsung di DOM
  const setBlock = (): void => {
    const n = `${pad2(cur + 1)}/${total}`;
    const t = MATERI_LABEL[item().materi];
    header.block = { k: 'TES', n, t };
    const tb = el.isConnected ? document.querySelector('.tblock') : null;
    if (!tb) return;
    tb.querySelector('.tb-n')!.textContent = n;
    tb.querySelector('.tb-t')!.textContent = t;
  };

  /** Pilihan rumus tidak boleh terpotong: satu skala huruf untuk semua pilihan (min 60 %). */
  function fitOpts(): void {
    const ms = [...opts.querySelectorAll<HTMLElement>('.tes-opt-m.is-fit')];
    ms.forEach((m) => m.style.removeProperty('--k'));
    const need = Math.min(
      1,
      ...ms.map((m) => (m.clientWidth && m.scrollWidth ? m.clientWidth / m.scrollWidth : 1)),
    );
    if (need < 0.99) ms.forEach((m) => m.style.setProperty('--k', Math.max(0.6, need).toFixed(3)));
  }

  function showItem(anim: boolean): void {
    const it = item();
    setBlock();
    history.replaceState(null, '', `#/tes/kerjakan?n=${cur + 1}`);
    paper.innerHTML = `<header class="soal-h"><span>Soal ${cur + 1} dari ${total}</span><span>${MATERI_LABEL[it.materi]}</span></header>
      <div class="soal-b">${it.paper}</div>`;
    renderMath(paper);
    node.querySelector('[data-kind]')!.textContent = KIND_LABEL[it.kind];
    // pilihan panjang (kalimat, persamaan) satu kolom; pilihan pendek (angka, titik, matriks) berpetak
    const long = (o: string): boolean => {
      if (o.includes('=') || o.replace(/\$[^$]*\$/g, '').trim()) return true;
      const flat = o
        .replace(/\\begin\{pmatrix\}[\s\S]*?\\end\{pmatrix\}/g, 'M')
        .replace(/\\[a-z]+/gi, '')
        .replace(/[{}$\s]/g, '');
      return flat.length > 14;
    };
    const textual = it.kind === 'tf' || it.options.some(long);
    opts.className = `tes-opts is-${it.kind}${textual ? ' is-col' : ''}`;
    if (it.kind === 'tf') {
      opts.setAttribute('role', 'list');
      opts.innerHTML = it.options
        .map(
          (o, i) => `<div class="tes-tf" role="listitem">
            <p class="tes-tf-s"><span class="tes-tf-n">${i + 1}</span><span>${mathHtml(o)}</span></p>
            <div class="tes-tf-b" role="radiogroup" aria-label="Pernyataan ${i + 1}">
              <button type="button" role="radio" data-tf="${i}" data-v="1" aria-checked="false">Benar</button>
              <button type="button" role="radio" data-tf="${i}" data-v="0" aria-checked="false">Salah</button>
            </div></div>`,
        )
        .join('');
    } else {
      const multi = it.kind === 'multi';
      opts.setAttribute('role', multi ? 'group' : 'radiogroup');
      opts.setAttribute('aria-label', KIND_LABEL[it.kind]);
      opts.innerHTML = it.options
        .map(
          (o, i) =>
            `<button type="button" role="${multi ? 'checkbox' : 'radio'}" class="tes-opt" data-opt="${i}" aria-checked="false"><span class="ol">${multi ? icon('check') : LETTERS[i]}</span><span class="tes-opt-m${textual ? '' : ' is-fit'}">${mathHtml(o)}</span></button>`,
        )
        .join('');
      opts.querySelectorAll<HTMLElement>('.tes-opt').forEach((b, i) => {
        const lbl = mathLabel(b.querySelector('.tes-opt-m')!);
        b.setAttribute('aria-label', multi ? lbl : `${LETTERS[i]}. ${lbl}`);
      });
    }
    renderState();
    fitOpts();
    stage.scrollTop = 0;
    node.querySelector('.tes-ans')!.scrollTop = 0;
    if (anim)
      play(
        stage,
        [
          { opacity: 0, transform: `translateY(${SLIDE_PX / 2}px)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.slow, easing: EASE_OUT, ui: true },
      );
  }

  /** Keadaan tombol dari jawaban (idempoten). */
  function renderState(): void {
    const it = item();
    const r = resp();
    if (it.kind === 'tf')
      opts.querySelectorAll<HTMLElement>('[data-tf]').forEach((b) => {
        const v = r.tf[Number(b.dataset.tf)];
        b.setAttribute('aria-checked', String(v !== null && v === (b.dataset.v === '1')));
      });
    else
      opts
        .querySelectorAll<HTMLElement>('.tes-opt')
        .forEach((b, i) => b.setAttribute('aria-checked', String(r.pick.includes(i))));
    const fb = node.querySelector<HTMLElement>('[data-flag]')!;
    fb.setAttribute('aria-pressed', String(r.flag));
    fb.classList.toggle('is-on', r.flag);
    node.querySelector<HTMLElement>('[data-clear]')!.hidden = itemState(it, r) === 'empty';
    // navigasi
    const done = items.filter((x, i) => itemState(x, resps[i]!) === 'done').length;
    node.querySelector('[data-count]')!.textContent = `${done}/${total}`;
    nav.querySelector<HTMLButtonElement>('[data-prev]')!.disabled = cur === 0;
    const last = cur === total - 1;
    const nb = nav.querySelector<HTMLElement>('[data-next]')!;
    nav.querySelector('[data-next-t]')!.textContent = last ? 'Kumpulkan' : 'Berikutnya';
    nb.querySelector('.lucide')!.outerHTML = icon(last ? 'check' : 'arrow-right');
    // daftar soal
    map.querySelectorAll<HTMLElement>('[data-go]').forEach((b) => {
      const i = Number(b.dataset.go);
      const st = itemState(items[i]!, resps[i]!);
      const fl = resps[i]!.flag;
      b.className = `tes-cell${st === 'done' ? ' is-done' : st === 'partial' ? ' is-partial' : ''}${fl ? ' is-flag' : ''}${i === cur ? ' is-cur' : ''}`;
      b.setAttribute(
        'aria-label',
        `Soal ${i + 1}, ${MATERI_LABEL[items[i]!.materi]}: ${st === 'done' ? 'sudah dijawab' : st === 'partial' ? 'belum lengkap' : 'belum dijawab'}${fl ? ', ragu-ragu' : ''}`,
      );
      if (i === cur) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    const empty = items.filter((x, i) => itemState(x, resps[i]!) !== 'done').length;
    const flagged = resps.filter((x) => x.flag).length;
    map.querySelector('[data-map-sum]')!.textContent =
      `${done} dijawab · ${empty} belum dijawab atau belum lengkap · ${flagged} ragu-ragu`;
  }

  function go(i: number): void {
    if (i < 0 || i >= total || i === cur) return;
    accrue();
    cur = i;
    SND.click();
    save();
    showItem(true);
  }

  function pickOpt(i: number): void {
    const it = item();
    const r = resp();
    if (it.kind === 'tf' || i < 0 || i >= it.options.length) return;
    if (it.kind === 'multi')
      r.pick = r.pick.includes(i) ? r.pick.filter((x) => x !== i) : [...r.pick, i].sort();
    else r.pick = r.pick[0] === i ? [] : [i];
    SND.click();
    save();
    renderState();
  }

  // ---------- daftar soal ----------
  function openMap(): void {
    renderState();
    map.hidden = false;
    nav.querySelector('[data-map]')!.setAttribute('aria-expanded', 'true');
    play(map, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.base, ui: true });
    play(
      map.querySelector('.tes-map-card')!,
      [
        { opacity: 0, transform: `translateY(${SLIDE_PX / 2}px) scale(.98)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration: DUR.base, easing: EASE_OUT, ui: true },
    );
    requestAnimationFrame(() =>
      map.querySelector<HTMLElement>('.tes-cell.is-cur')?.focus({ preventScroll: true }),
    );
  }
  function closeMap(): void {
    if (map.hidden) return;
    map.hidden = true;
    nav.querySelector<HTMLElement>('[data-map]')!.setAttribute('aria-expanded', 'false');
  }

  // ---------- mengumpulkan ----------
  function askSubmit(): void {
    accrue();
    save();
    const notDone = items.flatMap((x, i) => (itemState(x, resps[i]!) !== 'done' ? [i + 1] : []));
    const flagged = resps.flatMap((x, i) => (x.flag ? [i + 1] : []));
    const list = (ns: number[]): string => ns.join(', ');
    const body = `<p>Setelah dikumpulkan, jawaban tidak bisa diubah lagi. Sisa waktu <b>${mmss(a!.deadline - Date.now())}</b>.</p>
      <ul class="tes-sheet-list">
        <li>${icon('circle-check')}<span>Sudah dijawab: <b>${total - notDone.length}</b> dari ${total} soal</span></li>
        ${notDone.length ? `<li class="is-warn">${icon('circle-alert')}<span>Belum dijawab atau belum lengkap: soal ${list(notDone)}</span></li>` : ''}
        ${flagged.length ? `<li class="is-warn">${icon('flag')}<span>Ditandai ragu-ragu: soal ${list(flagged)}</span></li>` : ''}
      </ul>`;
    openSheet({
      title: 'Kumpulkan tes sekarang?',
      body,
      actions: [
        { label: 'Kumpulkan sekarang', kind: 'primary', icon: 'check', onClick: () => finish(false) },
      ],
      closeLabel: 'Periksa lagi',
    });
  }

  function finish(timeUp: boolean): void {
    if (finished) return;
    finished = true;
    accrue();
    save();
    window.clearInterval(timer);
    closeMap();
    const at = tes.submit(timeUp);
    if (!at) return;
    void processing(at).then(() => navigate(`#/tes/hasil?id=${at.id}&baru=1`, { replace: true }));
  }

  // ---------- waktu ----------
  /** waktu tampil soal ini (hanya saat layar terlihat) */
  function accrue(): void {
    const now = performance.now();
    if (document.visibilityState === 'visible' && !finished) resp().ms += Math.min(now - lastTick, 5000);
    lastTick = now;
  }

  const timeEl = (): HTMLElement | null => document.querySelector<HTMLElement>('[data-timer]');
  function tick(): void {
    if (finished) return;
    accrue();
    const left = a!.deadline - Date.now();
    const t = timeEl();
    if (t) {
      t.querySelector('[data-time]')!.textContent = mmss(left);
      t.classList.toggle('is-warn', left <= 5 * 60000);
      t.setAttribute('aria-label', `Sisa waktu ${mmss(left)}`);
    }
    if (left <= 5 * 60000 && !warned5) {
      warned5 = true;
      if (left > 60000) toast('Sisa waktu 5 menit. Periksa soal yang belum dijawab lewat Daftar soal.');
    }
    if (left <= 60000 && !warned1) {
      warned1 = true;
      warned5 = true;
      toast('Sisa waktu 1 menit.');
      navigator.vibrate?.(80);
    }
    if (left <= 0) {
      if (isSheetOpen()) closeSheet();
      SND.wrong();
      finish(true);
      return;
    }
    if (Date.now() - lastSave > 5000) save();
  }
  const timer = window.setInterval(tick, 250);
  cleanups.push(() => window.clearInterval(timer));
  const onVis = (): void => {
    accrue();
    if (document.visibilityState === 'hidden') save();
  };
  document.addEventListener('visibilitychange', onVis);
  cleanups.push(() => document.removeEventListener('visibilitychange', onVis));
  cleanups.push(() => {
    if (!finished) {
      accrue();
      save();
    }
  });

  // ---------- kejadian ----------
  // satu pendengar untuk panggung, navigasi bawah, dan daftar soal
  node.addEventListener('click', (e) => {
    const tg = e.target as Element;
    if (tg.closest('[data-prev]')) return go(cur - 1);
    if (tg.closest('[data-next]')) {
      SND.init();
      if (cur === total - 1) askSubmit();
      else go(cur + 1);
      return;
    }
    if (tg.closest('[data-map]')) {
      SND.click();
      if (map.hidden) openMap();
      else closeMap();
      return;
    }
    const o = tg.closest<HTMLElement>('[data-opt]');
    const tf = tg.closest<HTMLElement>('[data-tf]');
    const g = tg.closest<HTMLElement>('[data-go]');
    if (o) pickOpt(Number(o.dataset.opt));
    else if (tf) {
      const r = resp();
      const i = Number(tf.dataset.tf);
      const v = tf.dataset.v === '1';
      r.tf[i] = r.tf[i] === v ? null : v;
      SND.click();
      save();
      renderState();
    } else if (tg.closest('[data-flag]')) {
      resp().flag = !resp().flag;
      SND.click();
      save();
      renderState();
    } else if (tg.closest('[data-clear]')) {
      const r = resp();
      r.pick = [];
      r.tf = r.tf.map(() => null);
      SND.click();
      save();
      renderState();
    } else if (g) {
      closeMap();
      go(Number(g.dataset.go));
    } else if (tg.closest('[data-map-x]') || tg === map) closeMap();
    else if (tg.closest('[data-submit]')) askSubmit();
  });

  // meninggalkan halaman tes lewat tautan: konfirmasi (jawaban tetap tersimpan, waktu tetap berjalan)
  const onLeave = (e: MouseEvent): void => {
    if (finished) return;
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.closest('.sheet')) return;
    const href = link.getAttribute('href')!;
    if (href.startsWith('#/tes/kerjakan')) return;
    e.preventDefault();
    e.stopPropagation();
    openSheet({
      title: 'Tinggalkan tes?',
      body: '<p>Jawabanmu tersimpan, tetapi <b>waktu tes tetap berjalan</b>. Kamu bisa melanjutkan dari menu Tes penguasaan.</p>',
      actions: [
        { label: 'Lanjut mengerjakan', kind: 'primary' },
        { label: 'Tinggalkan', onClick: () => setTimeout(() => navigate(href), 0) },
      ],
      closeLabel: null,
    });
  };
  document.addEventListener('click', onLeave, true);
  cleanups.push(() => document.removeEventListener('click', onLeave, true));

  const onKey = (e: KeyboardEvent): void => {
    if (isSheetOpen() || e.ctrlKey || e.metaKey || e.altKey || finished) return;
    const k = e.key.toLowerCase();
    if (e.key === 'Escape') return closeMap();
    if (!map.hidden) return;
    if (e.key === 'ArrowRight') go(cur + 1);
    else if (e.key === 'ArrowLeft') go(cur - 1);
    else if (k === 'r') {
      resp().flag = !resp().flag;
      save();
      renderState();
    } else if (item().kind !== 'tf' && !(e.target as Element | null)?.closest?.('button, a')) {
      const i = item().kind === 'multi' ? '12345'.indexOf(k) : 'abcde'.indexOf(k);
      if (i >= 0) pickOpt(i);
    }
  };
  document.addEventListener('keydown', onKey);
  cleanups.push(() => document.removeEventListener('keydown', onKey));

  const ro = new ResizeObserver(() => requestAnimationFrame(fitOpts));
  ro.observe(stage);
  cleanups.push(() => ro.disconnect());

  save();
  showItem(false);
  tick();
  return view;
}

// =============================================================================================
// Animasi proses data
// =============================================================================================
function processing(at: Attempt): Promise<void> {
  const s = summarize(at.items, at.resps, at.msUsed, at.limitMs);
  const right = at.items.map((it, i) => isCorrect(it, at.resps[i]!));
  const root = html(`<div class="tes-proc" role="status" aria-live="polite">
    <div class="tes-proc-card">
      <p class="eyebrow">${at.timeUp ? 'Waktu habis · jawaban dikumpulkan otomatis' : 'Tes dikumpulkan'}</p>
      <h2 class="tes-proc-t">Memproses jawabanmu</h2>
      <ol class="tes-proc-steps">
        <li data-s="0"><span class="tes-proc-i">${icon('check')}</span><span>Memeriksa ${at.items.length} jawaban</span></li>
        <li data-s="1"><span class="tes-proc-i">${icon('check')}</span><span>Menghitung penguasaan tiap materi</span></li>
        <li data-s="2"><span class="tes-proc-i">${icon('check')}</span><span>Menyusun saran belajar</span></li>
      </ol>
      <div class="tes-proc-grid" aria-hidden="true">${MATERI.map(
        (m) =>
          `<div class="tes-proc-g">${at.items
            .flatMap((it, i) => (it.materi === m ? [i] : []))
            .map((i) => `<span class="tes-proc-c" data-c="${i}"></span>`)
            .join('')}</div>`,
      ).join('')}</div>
      <ul class="tes-proc-bars" aria-hidden="true">${s.materi
        .map(
          (m) =>
            `<li><span class="tes-proc-l">${MATERI_LABEL[m.materi]}</span><span class="tes-bar"><span class="tes-bar-f lv-${levelOf(m.pct)}" style="--p:${m.pct / 100}"></span></span><span class="tes-proc-p num" data-p="${m.pct}">0%</span></li>`,
        )
        .join('')}</ul>
      <button type="button" class="btn tes-proc-skip" data-skip>Lewati</button>
    </div>
  </div>`);
  document.body.append(root);
  const rm = reducedMotion();
  let skip = false;
  let wake: () => void = () => undefined;
  const wait = (ms: number): Promise<void> =>
    new Promise((res) => {
      if (skip) return res();
      const t = setTimeout(res, rm ? Math.min(ms, 60) : ms);
      wake = () => {
        clearTimeout(t);
        res();
      };
    });
  root.querySelector('[data-skip]')!.addEventListener('click', () => {
    skip = true;
    wake();
  });
  const step = (i: number, st: 'on' | 'ok'): void =>
    root.querySelector(`[data-s="${i}"]`)!.setAttribute('data-st', st);
  play(root, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.base, ui: true });

  return (async () => {
    step(0, 'on');
    for (let i = 0; i < at.items.length && !skip; i++) {
      const c = root.querySelector<HTMLElement>(`[data-c="${i}"]`)!;
      c.classList.add(right[i] ? 'is-ok' : 'is-no');
      play(
        c,
        [
          { transform: 'scale(0.4)', opacity: 0 },
          { transform: 'none', opacity: 1 },
        ],
        {
          duration: DUR.slow,
          easing: EASE_OUT,
          ui: true,
        },
      );
      await wait(75);
    }
    root.querySelectorAll<HTMLElement>('[data-c]').forEach((c) => {
      const i = Number(c.dataset.c);
      c.classList.add(right[i] ? 'is-ok' : 'is-no');
    });
    step(0, 'ok');
    step(1, 'on');
    await wait(250);
    const bars = [...root.querySelectorAll<HTMLElement>('.tes-proc-bars li')];
    for (const li of bars) {
      if (skip) break;
      const f = li.querySelector<HTMLElement>('.tes-bar-f')!;
      const p = li.querySelector<HTMLElement>('[data-p]')!;
      f.classList.add('is-on');
      play(f, [{ transform: 'scaleX(0)' }, { transform: `scaleX(${f.style.getPropertyValue('--p')})` }], {
        duration: DUR.enter,
        easing: EASE_OUT,
        ui: true,
      });
      p.textContent = `${p.dataset.p}%`;
      await wait(140);
    }
    bars.forEach((li) => {
      const p = li.querySelector<HTMLElement>('[data-p]')!;
      li.querySelector('.tes-bar-f')!.classList.add('is-on');
      p.textContent = `${p.dataset.p}%`;
    });
    step(1, 'ok');
    step(2, 'on');
    await wait(700);
    step(2, 'ok');
    await wait(350);
    if (s.pct >= 80) SND.chime();
    const out = play(root, [{ opacity: 1 }, { opacity: 0 }], {
      duration: DUR.slow,
      ui: true,
      fill: 'forwards',
    });
    setTimeout(() => void out.finished.then(() => root.remove()), 0);
  })();
}

// =============================================================================================
// Hasil
// =============================================================================================
const barHtml = (pct: number, lv: string): string =>
  `<span class="tes-bar"><span class="tes-bar-f lv-${lv}" style="--p:${pct / 100}"></span></span>`;

function suggestions(at: Attempt, s: Summary): string {
  const weak = weakestFirst(s).filter((m) => m.pct < 80);
  if (!weak.length)
    return `<p class="tes-good">${icon('circle-check')}<span>Semua materi sudah dikuasai. Pertahankan dengan mencoba tes lagi (soalnya berbeda), lalu lanjutkan ke latihan serupa dengan tingkat Menantang.</span></p>`;
  return `<ol class="tes-sar">${weak
    .map((m) => {
      const wrong = at.items.flatMap((it, i) =>
        it.materi === m.materi && !isCorrect(it, at.resps[i]!) ? [it.topic] : [],
      );
      const soal = MATERI_SOAL[m.materi].filter((n) => isReady(n));
      const links = soal
        .map(
          (n) =>
            `<a class="btn" href="#/soal/${n}">${icon('play')}<span>Soal TKA ${n}</span></a>${hasPractice(n) ? `<a class="btn" href="#/soal/${n}/latihan">${icon('rotate-ccw')}<span>Latihan ${n}</span></a>` : ''}`,
        )
        .join('');
      return `<li class="tes-sar-i lv-${levelOf(m.pct)}">
        <p class="tes-sar-h"><b>${MATERI_LABEL[m.materi]}</b><span class="num">${m.pct}%</span><span class="pill ${PILL[levelOf(m.pct)]}">${LEVEL_LABEL[levelOf(m.pct)]}</span></p>
        <p class="tes-sar-t">Pelajari lagi: ${[...new Set(wrong)].join('; ')}.</p>
        <div class="tes-sar-a">${links || '<span class="tes-note">Pembahasan soal TKA untuk materi ini segera hadir.</span>'}</div>
      </li>`;
    })
    .join('')}</ol>`;
}

function reviewBody(it: TesItem, r: Resp): string {
  let ans: string;
  if (it.kind === 'tf')
    ans = `<ul class="tes-rv-tf">${it.options
      .map((o, i) => {
        const v = r.tf[i];
        const mine = v === null ? 'kosong' : v ? 'Benar' : 'Salah';
        const okRow = v === it.ok[i];
        return `<li class="${okRow ? 'is-ok' : 'is-no'}"><span>${mathHtml(o)}</span><span class="tes-rv-k">Jawabanmu: <b>${mine}</b> · Kunci: <b class="k-key">${it.ok[i] ? 'Benar' : 'Salah'}</b></span></li>`;
      })
      .join('')}</ul>`;
  else
    ans = `<ul class="tes-rv-opts">${it.options
      .map((o, i) => {
        const mine = r.pick.includes(i);
        const cls = `${it.ok[i] ? ' is-key' : ''}${mine && !it.ok[i] ? ' is-no' : ''}`;
        const tag = `${mine ? '<span class="tes-rv-tag">Jawabanmu</span>' : ''}${it.ok[i] ? '<span class="tes-rv-tag tes-rv-tag--key">Kunci</span>' : ''}`;
        return `<li class="tes-rv-o${cls}"><span class="ol">${it.kind === 'multi' ? i + 1 : LETTERS[i]}</span><span class="tes-rv-m">${mathHtml(o)}</span>${tag}</li>`;
      })
      .join('')}</ul>`;
  return `<div class="soal tes-rv-paper"><div class="soal-b">${it.paper}</div></div>${ans}
    <div class="tes-rv-ex"><p class="tes-k">Pembahasan singkat</p><p>${mathHtml(it.explain)}</p></div>`;
}

function resultView(route: Route): PageView {
  const at = route.query.id ? tes.get(route.query.id) : tes.history.at(-1);
  const header: HeaderSpec = {
    back: { label: 'Beranda', href: '#/' },
    block: { k: 'HASIL TES', n: at ? `ke-${at.no}` : '–', t: at?.name ?? '' },
    extra: `<a class="btn" href="#/tes/riwayat">${icon('history')}<span class="btn-label">Riwayat</span></a>`,
  };
  if (!at) {
    const el = html(`<div class="page-scroll"><div class="page-col">
      <h1 class="page-title">Hasil tes</h1>
      <section class="panel empty-state"><p>Hasil tes ini tidak ditemukan di perangkat ini.</p>
        <a class="btn btn--primary" href="#/tes">${icon('play')}<span>Mulai tes</span></a></section>
    </div></div>`);
    return { el, title: 'Hasil tes', header, footer: true };
  }
  const s = summarize(at.items, at.resps, at.msUsed, at.limitMs);
  const mine = tes.sameAs(at);
  const prev = mine.filter((h) => h.start < at.start).at(-1);
  const ps = prev ? summarize(prev.items, prev.resps, prev.msUsed, prev.limitMs) : null;
  const prevPct = (m: string): number | undefined => ps?.materi.find((x) => x.materi === m)?.pct;
  const lvAll = levelOf(s.pct);
  const fresh = route.query.baru === '1';
  const avg = s.answered + s.partial ? s.msUsed / Math.max(1, s.n - s.empty) : 0;
  const slow = [...s.materi].sort((x, y) => y.ms - x.ms)[0]!;
  const delta = ps ? s.pct - ps.pct : 0;

  const tile = (k: string, v: string, sub = ''): string =>
    `<div class="tes-tile"><dt>${k}</dt><dd><span class="num">${v}</span>${sub ? `<small>${sub}</small>` : ''}</dd></div>`;

  const trend =
    mine.length >= 2
      ? `<section class="tes-card tes-card--trend" aria-labelledby="tr-t">
        <h2 class="tes-h2" id="tr-t">${icon('trending-up')}Perkembangan</h2>
        <ol class="tes-trend">${mine
          .slice(-8)
          .map((h) => {
            const hp = summarize(h.items, h.resps, h.msUsed, h.limitMs).pct;
            return `<li class="${h.id === at.id ? 'is-cur' : ''}"><a href="#/tes/hasil?id=${h.id}" aria-label="Percobaan ke-${h.no}: ${hp}%"><span class="tes-trend-v num">${hp}%</span><span class="tes-trend-b"><span style="--p:${hp / 100}"></span></span><span class="tes-trend-l">Ke-${h.no}</span></a></li>`;
          })
          .join('')}</ol>
      </section>`
      : '';

  const el = html(`<div class="page-scroll tes-res-scroll"><div class="tes-res">
    <section class="tes-res-hero bp crop" aria-labelledby="res-t">
      <div class="tes-res-who">
        <p class="eyebrow">Hasil tes penguasaan · Percobaan ke-${at.no}</p>
        <h1 class="tes-res-name" id="res-t" data-name></h1>
        <p class="tes-res-school" data-school></p>
        <p class="tes-res-date">${esc(fmtDate(at.end))}${at.timeUp ? ' · dikumpulkan otomatis saat waktu habis' : ''}</p>
      </div>
      <div class="tes-res-big">
        <p class="tes-k">Penguasaan keseluruhan</p>
        <p class="tes-res-pct"><span class="num" data-count="${s.pct}">${s.pct}</span><span class="tes-res-pc">%</span></p>
        ${barHtml(s.pct, 'all')}
        <p class="tes-res-sub"><b>${s.ok} dari ${s.n}</b> soal tepat · ${LEVEL_LABEL[lvAll]}</p>
        ${ps ? `<p class="tes-res-delta">${icon(delta >= 0 ? 'trending-up' : 'trending-down')}${delta === 0 ? 'Sama dengan' : delta > 0 ? `Naik ${delta} dari` : `Turun ${-delta} dari`} percobaan ke-${prev!.no} (${ps.pct}%)</p>` : ''}
      </div>
    </section>
    <div class="tes-res-grid">
      <section class="tes-card tes-card--materi" aria-labelledby="mt-t">
        <h2 class="tes-h2" id="mt-t">${icon('chart-column')}Penguasaan per materi</h2>
        <ol class="tes-mat">${s.materi
          .map((m) => {
            const lv = levelOf(m.pct);
            const pp = prevPct(m.materi);
            return `<li class="tes-mrow">
              <span class="tes-mrow-l">${MATERI_LABEL[m.materi]}<small>${m.ok} dari ${m.n} tepat${pp !== undefined ? ` · sebelumnya ${pp}%` : ''}</small></span>
              ${barHtml(m.pct, lv)}
              <span class="tes-mrow-p num">${m.pct}%</span>
              <span class="pill ${PILL[lv]}">${LEVEL_LABEL[lv]}</span>
            </li>`;
          })
          .join('')}</ol>
      </section>
      <section class="tes-card tes-card--stats" aria-labelledby="st-t">
        <h2 class="tes-h2" id="st-t">${icon('timer')}Statistik pengerjaan</h2>
        <dl class="tes-tiles">
          ${tile('Waktu dipakai', mmss(s.msUsed), `dari ${pad2(TES_MINUTES)}:00`)}
          ${tile('Rata-rata per soal', mmss(avg), 'soal yang diisi')}
          ${tile('Dijawab', `${s.answered}/${s.n}`, s.partial ? `${s.partial} belum lengkap` : 'soal')}
          ${tile('Dikosongkan', String(s.empty), 'soal')}
          ${tile('Ragu-ragu', String(s.flagged), s.flagged ? `${s.flaggedOk} di antaranya tepat` : 'soal')}
          ${tile('Yakin, tetapi tidak tepat', String(s.sureWrong), s.sureWrong ? 'periksa konsepnya lagi' : 'soal')}
          ${tile('Pilih satu jawaban', `${s.kinds.single.ok}/${s.kinds.single.n}`, 'tepat')}
          ${tile('Pilih banyak dan Benar/Salah', `${s.kinds.complex.ok}/${s.kinds.complex.n}`, 'tepat')}
          ${tile('Waktu terlama', MATERI_LABEL[slow.materi], mmss(slow.ms))}
        </dl>
      </section>
      <section class="tes-card tes-card--saran" aria-labelledby="sr-t">
        <h2 class="tes-h2" id="sr-t">${icon('flag')}Yang perlu diperkuat</h2>
        ${suggestions(at, s)}
      </section>
      ${trend}
    </div>
    <section class="tes-card tes-card--rinci" aria-labelledby="rc-t">
      <h2 class="tes-h2" id="rc-t">${icon('list')}Rincian jawaban</h2>
      <ol class="tes-rinci">${at.items
        .map((it, i) => {
          const r = at.resps[i]!;
          const st = itemState(it, r);
          const ok = isCorrect(it, r);
          const pill = ok
            ? `<span class="pill pill--done">${icon('check')}Tepat</span>`
            : st === 'empty'
              ? `<span class="pill">${icon('circle-dot')}Kosong</span>`
              : `<span class="pill pill--review">${icon('x')}Tidak tepat</span>`;
          return `<li class="tes-rrow">
            <button type="button" class="tes-rrow-h" aria-expanded="false" data-rx="${i}">
              <span class="tes-rrow-no num">${pad2(i + 1)}</span>
              <span class="tes-rrow-t"><b>${MATERI_LABEL[it.materi]}</b><span>${esc(it.topic)}</span></span>
              ${r.flag ? `<span class="tes-rrow-f">${icon('flag')}Ragu</span>` : ''}
              ${pill}${icon('chevron-down', 'tes-rrow-c')}
            </button>
            <div class="tes-rrow-b" hidden></div>
          </li>`;
        })
        .join('')}</ol>
    </section>
    <div class="tes-res-actions">
      <a class="btn btn--primary btn--lg" href="#/tes?langkah=petunjuk" data-again>${icon('rotate-ccw')}<span>Coba lagi dengan soal baru</span></a>
      <button type="button" class="btn" data-print>${icon('printer')}<span>Simpan PDF / cetak</span></button>
      <a class="btn" href="#/tes/riwayat">${icon('history')}<span>Riwayat tes</span></a>
      <a class="btn" href="#/">${icon('house')}<span>Beranda</span></a>
    </div>
  </div></div>`);
  el.querySelector('[data-name]')!.textContent = at.name;
  el.querySelector('[data-school]')!.textContent = at.school;

  el.addEventListener('click', (e) => {
    const tg = e.target as Element;
    const rx = tg.closest<HTMLElement>('[data-rx]');
    if (rx) {
      const body = rx.nextElementSibling as HTMLElement;
      const open = rx.getAttribute('aria-expanded') !== 'true';
      if (open && !body.childElementCount) {
        const i = Number(rx.dataset.rx);
        body.innerHTML = reviewBody(at.items[i]!, at.resps[i]!);
        renderMath(body);
      }
      rx.setAttribute('aria-expanded', String(open));
      body.hidden = !open;
      SND.click();
      if (open)
        play(
          body,
          [
            { opacity: 0, transform: `translateY(${SLIDE_PX / 3}px)` },
            { opacity: 1, transform: 'none' },
          ],
          { duration: DUR.base, easing: EASE_OUT, ui: true },
        );
    } else if (tg.closest('[data-print]')) printResult(at, s);
    else if (tg.closest('[data-again]')) {
      // identitas peserta hasil ini menjadi identitas tes berikutnya
      tes.setProfile({ name: at.name, school: at.school });
    }
  });

  if (fresh && !reducedMotion())
    requestAnimationFrame(() => {
      el.querySelectorAll<HTMLElement>('.tes-bar-f').forEach((f, i) =>
        play(f, [{ transform: 'scaleX(0)' }, { transform: `scaleX(${f.style.getPropertyValue('--p')})` }], {
          duration: DUR.enter * 1.5,
          delay: 120 + i * 60,
          easing: EASE_OUT,
          ui: true,
        }),
      );
      const n = el.querySelector<HTMLElement>('[data-count]')!;
      const t0 = performance.now();
      const step = (): void => {
        const k = Math.min(1, (performance.now() - t0) / 900);
        n.textContent = String(Math.round(s.pct * (1 - (1 - k) ** 3)));
        if (k < 1 && n.isConnected) requestAnimationFrame(step);
      };
      step();
    });

  return { el, title: `Hasil tes ${at.name}`, header, footer: true };
}

/** Lembar hasil ringkas untuk dicetak atau disimpan sebagai PDF (A4 tegak). */
function printResult(at: Attempt, s: Summary): void {
  const root = document.createElement('div');
  root.className = 'print-root';
  const weak = weakestFirst(s).filter((m) => m.pct < 80);
  root.innerHTML = `<div class="tes-print">
    <header><p class="tes-k">Paham TKA · Tes penguasaan materi</p><h1 data-n></h1><p data-s></p>
      <p>Percobaan ke-${at.no} · ${esc(fmtDate(at.end))}</p></header>
    <p class="tes-print-big">Penguasaan keseluruhan <b>${s.pct}%</b> (${s.ok} dari ${s.n} soal tepat · ${LEVEL_LABEL[levelOf(s.pct)]})</p>
    <table><thead><tr><th scope="col">Materi</th><th scope="col">Tepat</th><th scope="col">Penguasaan</th><th scope="col">Tingkat</th></tr></thead>
      <tbody>${s.materi
        .map(
          (m) =>
            `<tr><td>${MATERI_LABEL[m.materi]}</td><td>${m.ok}/${m.n}</td><td><span class="tes-print-bar"><span style="--p:${m.pct / 100}"></span></span> ${m.pct}%</td><td>${LEVEL_LABEL[levelOf(m.pct)]}</td></tr>`,
        )
        .join('')}</tbody></table>
    <p>Waktu dipakai ${mmss(s.msUsed)} dari ${pad2(TES_MINUTES)}:00 · dijawab ${s.answered}/${s.n} · ragu-ragu ${s.flagged} (${s.flaggedOk} tepat) · yakin tetapi tidak tepat ${s.sureWrong}.</p>
    <h2>Yang perlu diperkuat</h2>
    <p>${weak.length ? weak.map((m) => `${MATERI_LABEL[m.materi]} (${m.pct}%)`).join(', ') : 'Semua materi sudah dikuasai.'}</p>
    <footer>© 2026 Penta Putra Purnomo, S.Pd., Gr. | SMA Vidatra Bontang</footer>
  </div>`;
  root.querySelector('[data-n]')!.textContent = at.name;
  root.querySelector('[data-s]')!.textContent = at.school;
  document.body.append(root);
  const clean = (): void => {
    root.remove();
    window.removeEventListener('afterprint', clean);
  };
  window.addEventListener('afterprint', clean);
  window.print();
  setTimeout(clean, 60000);
}

// =============================================================================================
// Riwayat
// =============================================================================================
function historyView(): PageView {
  const header: HeaderSpec = { back: { label: 'Tes', href: '#/tes' } };
  const el = html('<div class="page-scroll"><div class="page-col tes-hist"></div></div>');
  const col = el.querySelector<HTMLElement>('.tes-hist')!;

  const render = (): void => {
    const groups = new Map<string, Attempt[]>();
    for (const h of [...tes.history].reverse()) {
      const k = `${h.name.toLowerCase()}|${h.school.toLowerCase()}`;
      groups.set(k, [...(groups.get(k) ?? []), h]);
    }
    col.innerHTML = `<h1 class="page-title">Riwayat tes penguasaan</h1>
      <div class="tes-hist-top">
        <a class="btn btn--primary" href="#/tes">${icon('play')}<span>Mulai tes</span></a>
        ${tes.history.length ? `<button type="button" class="btn" data-clear>${icon('trash-2')}<span>Hapus riwayat</span></button>` : ''}
      </div>
      ${
        groups.size
          ? [...groups.values()]
              .map(
                (list) => `<section class="panel tes-hist-g">
          <h2 data-who="${list[0]!.id}"></h2>
          <ol class="tes-hist-l">${list
            .map((h) => {
              const s = summarize(h.items, h.resps, h.msUsed, h.limitMs);
              return `<li><a class="tes-hrow" href="#/tes/hasil?id=${h.id}">
                <span class="tes-hrow-n">Percobaan ke-${h.no}<small>${esc(fmtDate(h.end))}</small></span>
                <span class="tes-mini" aria-hidden="true">${s.materi.map((m) => `<span class="lv-${levelOf(m.pct)}" style="--p:${Math.max(0.06, m.pct / 100)}"></span>`).join('')}</span>
                <span class="tes-hrow-p num">${s.pct}%</span>${icon('chevron-right')}
              </a></li>`;
            })
            .join('')}</ol></section>`,
              )
              .join('')
          : `<section class="panel empty-state"><p>Belum ada riwayat tes. Mulai tes pertamamu untuk melihat penguasaan tiap materi.</p></section>`
      }`;
    // nama dan sekolah dari masukan siswa: lewat textContent
    col.querySelectorAll<HTMLElement>('[data-who]').forEach((h2) => {
      const a = tes.get(h2.dataset.who!)!;
      h2.textContent = `${a.name} · ${a.school}`;
    });
  };
  render();

  col.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('[data-clear]')) return;
    openSheet({
      title: 'Hapus semua riwayat tes?',
      body: '<p>Semua hasil tes di perangkat ini akan dihapus dan tidak bisa dikembalikan.</p>',
      actions: [
        {
          label: 'Hapus riwayat',
          kind: 'danger',
          icon: 'trash-2',
          onClick: () => {
            tes.clearHistory();
            toast('Riwayat tes sudah dihapus.');
            render();
          },
        },
      ],
      closeLabel: 'Batal',
    });
  });

  return { el, title: 'Riwayat tes', header, footer: true };
}
