/**
 * Ekspedisi TKA (revisi pemilik v1.26): permainan kelas untuk menguatkan titik lemah, bukan materi baru.
 * - #/ekspedisi: pilih peran — Tim (tablet kelompok), Game Master (guru, berkata sandi), atau Coba cara bermain.
 * - Tim: kode gabung → nama anggota → giliran acak → peta pos → soal dua fase (Mandiri, Diskusi) dengan
 *   kesempatan kedua, petunjuk terbatas → kode bukti dibawa juru lapor ke Game Master.
 * - Game Master: atur waktu, jumlah kelompok, pos → kode gabung → papan waktu + peringkat → umumkan hasil.
 * Tanpa server: tablet dan laptop terhubung lewat kode (src/eks/codes.ts). Bahasa permainan hanya di mode ini.
 */
import { SND } from '../core/audio';
import { esc, html, pad2 } from '../core/dom';
import { icon } from '../core/icons';
import { mathHtml, renderMath } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE_OUT, SLIDE_PX } from '../core/tokens';
import { gameItem, POS, type GItem } from '../eks/bank';
import {
  checkGmPassword,
  joinCode,
  makeGameCode,
  parseJoin,
  posList,
  posMaskOf,
  proofCode,
  readProof,
  POS_IDS,
  type PosId,
} from '../eks/codes';
import {
  answerer,
  gmStore,
  HINTS,
  newTeam,
  nextTurn,
  PTS,
  ranking,
  T_KEDUA,
  T_MANDIRI,
  T_PACU,
  T_SOAL,
  takeReporter,
  teamStore,
  timeLeft,
  type GmState,
  type PosResult,
  type TeamState,
} from '../eks/state';
import type { PageView } from '../shell/app';
import { mountKeyboard, type Keyboard } from '../shell/keyboard';
import { closeSheet, isSheetOpen, openSheet } from '../shell/sheet';
import { toast } from '../shell/toast';

const LETTERS = 'ABCDE';
const mmss = (ms: number): string => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
};
const DEMO_GAME = 'DEMO';

/** pos yang memakai alur dua fase (bukan Pacu Waktu) */
type SoalPos = Exclude<PosId, 6> | 0;

export function eksPage(): PageView {
  const el = html('<div class="eks"></div>');
  const cleanups: Array<() => void> = [];
  const clear = (): void => {
    while (cleanups.length) cleanups.pop()!();
  };
  const view: PageView = {
    el,
    title: 'Ekspedisi TKA',
    header: { back: { label: 'Beranda', href: '#/' } },
    footer: false,
    destroy: clear,
  };

  /** pengatur waktu layar berikutnya: dipasang sebelum show(), dibersihkan saat layar itu diganti */
  let pending: Array<() => void> = [];

  function show(node: HTMLElement): void {
    clear();
    cleanups.push(...pending);
    pending = [];
    if (isSheetOpen()) closeSheet();
    el.replaceChildren(node);
    renderMath(node);
    if (el.isConnected)
      play(
        node,
        [
          { opacity: 0, transform: `translateX(${SLIDE_PX}px)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.enter, easing: EASE_OUT, ui: true },
      );
  }

  /** setInterval milik layar yang akan ditampilkan (panggil sebelum show) */
  function every(ms: number, f: () => void): void {
    const id = window.setInterval(f, ms);
    pending.push(() => window.clearInterval(id));
  }

  function keyboard(fields: Array<{ input: HTMLInputElement; label: string }>, onDone: () => void): Keyboard {
    const kb = mountKeyboard(el, fields, onDone);
    cleanups.push(() => kb.destroy());
    return kb;
  }

  // ===========================================================================================
  // Peran
  // ===========================================================================================
  function roleView(): void {
    const saved = teamStore.load();
    const gm = gmStore.load();
    const node = html(`<div class="eks-scroll"><div class="eks-col">
      <section class="eks-hero bp crop" aria-labelledby="eks-t">
        <p class="eyebrow">Permainan kelas · menguatkan titik lemah</p>
        <h1 class="eks-title" id="eks-t">Ekspedisi TKA</h1>
        <p class="eks-lede">Setiap kelompok menjelajahi pos-pos jebakan TKA dengan satu tablet. Penjawab bergiliran duduk di meja depan; teman setim baru boleh membantu di fase Diskusi. Selesaikan pos, bawa kode bukti ke Game Master, dan naikkan peringkat kelompokmu.</p>
      </section>
      <div class="eks-roles">
        ${
          saved && !saved.demo
            ? `<button type="button" class="eks-role eks-role--main" data-role="resume">${icon('map')}<b>Lanjutkan ekspedisi</b><span>Kelompok ${saved.team} · ${saved.members.length} anggota</span></button>`
            : ''
        }
        <button type="button" class="eks-role${saved && !saved.demo ? '' : ' eks-role--main'}" data-role="team">${icon('users')}<b>Masuk sebagai kelompok</b><span>Ketik kode gabung dari Game Master</span></button>
        <button type="button" class="eks-role" data-role="demo">${icon('play')}<b>Coba cara bermain</b><span>Latihan 2 soal, tidak dinilai</span></button>
        <button type="button" class="eks-role eks-role--gm" data-role="gm">${icon('key-round')}<b>Game Master (guru)</b><span>${gm && !gm.revealed ? 'Permainan sedang berjalan' : 'Perlu kata sandi'}</span></button>
      </div>
    </div></div>`);
    node.addEventListener('click', (e) => {
      const r = (e.target as Element).closest<HTMLElement>('[data-role]')?.dataset.role;
      if (!r) return;
      SND.click();
      if (r === 'resume') mapView();
      else if (r === 'team') {
        if (saved && !saved.demo)
          openSheet({
            title: 'Ganti kelompok?',
            body: `<p>Perangkat ini masih menyimpan ekspedisi <b>Kelompok ${saved.team}</b>. Masuk dengan kode baru akan menghapusnya dari perangkat ini. Pos yang sudah dilaporkan tetap tercatat di papan Game Master.</p>`,
            actions: [
              { label: 'Lanjutkan ekspedisi', kind: 'primary', onClick: () => setTimeout(mapView, 0) },
              {
                label: 'Masuk dengan kode baru',
                onClick: () => {
                  teamStore.clear();
                  setTimeout(joinView, 0);
                },
              },
            ],
            closeLabel: null,
          });
        else joinView();
      } else if (r === 'demo') membersView(DEMO_GAME, 1, true);
      else if (gmStore.unlocked()) gmEntry();
      else gmLockView();
    });
    show(node);
  }

  // ===========================================================================================
  // Tim: gabung dan anggota
  // ===========================================================================================
  function joinView(): void {
    const node = html(`<div class="eks-center"><section class="eks-card" aria-labelledby="j-t">
      <h2 class="eks-h2" id="j-t">${icon('users')}Masuk sebagai kelompok</h2>
      <p class="eks-note">Kode gabung ditayangkan Game Master di layar depan, misalnya <b class="num">KX7P-3M</b>.</p>
      <label class="tes-field"><span class="tes-lbl">Kode gabung</span>
        <input class="tes-input eks-code-in num" data-code maxlength="8" autocomplete="off" spellcheck="false" placeholder="Ketuk untuk mengisi"></label>
      <p class="tes-err" role="alert" data-err></p>
      <div class="tes-actions"><button type="button" class="btn" data-back>${icon('arrow-left')}<span>Kembali</span></button>
        <button type="button" class="btn btn--primary" data-go>${icon('arrow-right')}<span>Masuk</span></button></div>
    </section></div>`);
    const input = node.querySelector<HTMLInputElement>('[data-code]')!;
    const err = node.querySelector<HTMLElement>('[data-err]')!;
    const submit = (): void => {
      const j = parseJoin(input.value);
      if (!j) {
        err.textContent = 'Kode tidak dikenali. Periksa lagi hurufnya (contoh: KX7P-3M).';
        SND.wrong();
        return;
      }
      membersView(j.game, j.team, false);
    };
    node.querySelector('[data-go]')!.addEventListener('click', submit);
    node.querySelector('[data-back]')!.addEventListener('click', roleView);
    show(node);
    const kb = keyboard([{ input, label: 'Kode gabung' }], submit);
    kb.open(0);
  }

  function membersView(game: string, team: number, demo: boolean): void {
    const names: string[] = [];
    const node = html(`<div class="eks-center"><section class="eks-card eks-card--wide" aria-labelledby="m-t">
      <h2 class="eks-h2" id="m-t">${icon('users')}${demo ? 'Coba cara bermain' : `Kelompok ${team}`}: nama anggota</h2>
      <p class="eks-note">Ketik nama setiap anggota (2–8 orang). Aplikasi mengacak urutan giliran dari nama-nama ini.</p>
      <div class="eks-add"><label class="tes-field"><span class="tes-lbl">Nama anggota</span>
        <input class="tes-input" data-name maxlength="20" autocomplete="off" spellcheck="false" placeholder="Ketuk untuk mengisi"></label>
        <button type="button" class="btn" data-add>${icon('plus')}<span>Tambah</span></button></div>
      <ol class="eks-names" data-list></ol>
      <p class="tes-err" role="alert" data-err></p>
      <div class="tes-actions"><button type="button" class="btn" data-back>${icon('arrow-left')}<span>Kembali</span></button>
        <button type="button" class="btn btn--primary" data-go>${icon('shuffle')}<span>Acak giliran</span></button></div>
    </section></div>`);
    const input = node.querySelector<HTMLInputElement>('[data-name]')!;
    const list = node.querySelector<HTMLElement>('[data-list]')!;
    const err = node.querySelector<HTMLElement>('[data-err]')!;
    const render = (): void => {
      list.innerHTML = names
        .map(
          (n, i) =>
            `<li><span class="eks-num num">${i + 1}</span><span class="eks-nm">${esc(n)}</span><button type="button" class="icon-btn" data-del="${i}" aria-label="Hapus ${esc(n)}">${icon('x')}</button></li>`,
        )
        .join('');
    };
    const add = (): void => {
      const v = input.value.trim().replace(/\s+/g, ' ');
      if (!v) return;
      if (names.length >= 8) {
        err.textContent = 'Paling banyak 8 anggota.';
        return;
      }
      if (names.some((n) => n.toLowerCase() === v.toLowerCase())) {
        err.textContent = 'Nama itu sudah ada. Tambahkan inisial, misalnya "Budi S".';
        return;
      }
      err.textContent = '';
      names.push(v);
      input.value = '';
      render();
    };
    const go = (): void => {
      add();
      if (names.length < 2) {
        err.textContent = 'Isi paling sedikit 2 nama anggota.';
        return;
      }
      const t = newTeam(game, team, [...names], demo);
      teamStore.save(t);
      orderView(t);
    };
    node.querySelector('[data-add]')!.addEventListener('click', () => {
      add();
      kb.open(0);
    });
    list.addEventListener('click', (e) => {
      const d = (e.target as Element).closest<HTMLElement>('[data-del]');
      if (!d) return;
      names.splice(Number(d.dataset.del), 1);
      render();
    });
    node.querySelector('[data-go]')!.addEventListener('click', go);
    node.querySelector('[data-back]')!.addEventListener('click', roleView);
    show(node);
    // "Lanjut" pada papan ketik menambahkan nama dan tetap membuka papan untuk nama berikutnya
    const kb = keyboard([{ input, label: 'Nama anggota' }], () => {
      if (input.value.trim()) {
        add();
        setTimeout(() => kb.open(0), 0);
      }
    });
    kb.open(0);
  }

  function orderView(t: TeamState): void {
    const node = html(`<div class="eks-center"><section class="eks-card eks-card--wide" aria-labelledby="o-t">
      <h2 class="eks-h2" id="o-t">${icon('shuffle')}Urutan giliran</h2>
      <ol class="eks-order">${t.order.map((i, k) => `<li style="--i:${k}"><span class="eks-num num">${k + 1}</span>${esc(t.members[i]!)}</li>`).join('')}</ol>
      <ul class="eks-rules">
        <li>${icon('armchair')}<span><b>Penjawab duduk di meja depan</b> sendirian dan memegang tablet. Anggota lain menunggu di belakang.</span></li>
        <li>${icon('timer')}<span><b>Fase Mandiri ${T_MANDIRI / 1000} detik</b>: hanya penjawab yang berpikir. Benar = <b>${PTS.mandiri}</b> poin.</span></li>
        <li>${icon('users')}<span><b>Fase Diskusi</b>: setelah ${T_MANDIRI / 1000} detik atau tombol "Minta bantuan tim", semua boleh ke meja. Penjawab tetap yang menekan dan menjelaskan alasannya. Benar = <b>${PTS.diskusi}</b> poin.</span></li>
        <li>${icon('rotate-ccw')}<span><b>Salah?</b> Jebakannya ditunjukkan, lalu ada soal kembaran ${T_KEDUA / 1000} detik. Benar = <b>${PTS.kedua}</b> poin.</span></li>
        <li>${icon('lightbulb')}<span><b>${HINTS} petunjuk</b> untuk seluruh permainan. Soal yang memakai petunjuk paling banyak ${PTS.diskusi} poin.</span></li>
        <li>${icon('hourglass')}<span>Setiap soal paling lama ${T_SOAL / 60000} menit. Giliran berputar sampai semua anggota menjawab, lalu diacak lagi.</span></li>
      </ul>
      <div class="tes-actions"><button type="button" class="btn btn--primary btn--lg" data-go>${icon('map')}<span>${t.demo ? 'Mulai latihan' : 'Buka peta pos'}</span></button></div>
    </section></div>`);
    node.querySelector('[data-go]')!.addEventListener('click', () => (t.demo ? soalView(t, 0) : mapView()));
    show(node);
  }

  // ===========================================================================================
  // Tim: peta pos
  // ===========================================================================================
  const total = (t: TeamState): number => Object.values(t.results).reduce((s, r) => s + (r?.score ?? 0), 0);

  function finalOpen(t: TeamState, active: PosId[]): boolean {
    const others = active.filter((p) => p !== 7);
    const done = others.filter((p) => t.results[p]).length;
    return done >= Math.min(4, others.length);
  }

  function mapView(): void {
    const t = teamStore.load();
    if (!t) return roleView();
    const active = posList(posMaskOf(t.game));
    const allDone = active.every((p) => t.results[p]);
    const node = html(`<div class="eks-scroll"><div class="eks-col">
      <header class="eks-map-h">
        <div><p class="eyebrow">Ekspedisi TKA</p><h1 class="eks-h1">Kelompok ${t.team}</h1></div>
        <dl class="eks-stats">
          <div><dt>Skor</dt><dd class="num">${total(t)}</dd></div>
          <div><dt>Pos selesai</dt><dd class="num">${active.filter((p) => t.results[p]).length}/${active.length}</dd></div>
          <div><dt>Petunjuk</dt><dd class="num">${t.hints}</dd></div>
          <div><dt>Penjawab berikutnya</dt><dd>${esc(answerer(t))}</dd></div>
        </dl>
      </header>
      ${allDone ? summaryHtml(t) : ''}
      <div class="eks-map">${active
        .map((p) => {
          const r = t.results[p];
          const locked = p === 7 && !r && !finalOpen(t, active);
          return `<button type="button" class="eks-pos${r ? ' is-done' : ''}${locked ? ' is-locked' : ''}" data-pos="${p}" ${locked ? 'aria-disabled="true"' : ''}>
            <span class="eks-pos-n num">${pad2(p)}</span>
            <b>${POS[p].name}</b>
            <span class="eks-pos-g">${POS[p].goal}</span>
            <span class="eks-pos-s">${
              r
                ? `${icon('circle-check')}${r.score} poin · kode <b class="num">${r.code}</b>`
                : t.cur && t.cur.pos === p
                  ? `${icon('play')}Lanjutkan${p === 6 ? '' : ` · soal ${Math.min(POS[p].n, t.cur.i + 1)}`}`
                  : locked
                    ? `${icon('lock')}Terbuka setelah ${Math.min(4, active.length - 1)} pos selesai`
                    : `${icon('play')}${POS[p].n} soal${p === 6 ? ' · 5 menit' : ''}`
            }</span></button>`;
        })
        .join('')}</div>
      <div class="eks-foot"><button type="button" class="link-btn" data-leave>Keluar dari ekspedisi di perangkat ini</button></div>
    </div></div>`);
    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      const b = tg.closest<HTMLElement>('[data-pos]');
      if (b) {
        const p = Number(b.dataset.pos) as PosId;
        const r = t.results[p];
        if (r) return reportView(t, p, r, false);
        if (b.getAttribute('aria-disabled') === 'true') {
          toast('Pos Final terbuka setelah pos lain selesai.');
          return;
        }
        // satu pos dikerjakan sampai selesai: pos yang ditinggal tidak bisa diulang dari awal
        const run = t.cur?.pos;
        if (run && run !== p && !t.results[run]) {
          toast(`Selesaikan dulu pos ${POS[run].name}.`);
          return;
        }
        SND.click();
        if (p === 6) pacuView(t);
        else soalView(t, p);
        return;
      }
      if (tg.closest('[data-leave]'))
        openSheet({
          title: 'Keluar dari ekspedisi?',
          body: '<p>Data kelompok di tablet ini akan dihapus. Pos yang sudah dilaporkan tetap tercatat di papan Game Master.</p>',
          actions: [
            { label: 'Batal', kind: 'secondary' },
            {
              label: 'Keluar',
              kind: 'danger',
              onClick: () => {
                teamStore.clear();
                setTimeout(roleView, 0);
              },
            },
          ],
          closeLabel: null,
        });
    });
    show(node);
  }

  function summaryHtml(t: TeamState): string {
    const count = new Map<string, number>();
    for (const tr of t.traps) count.set(tr, (count.get(tr) ?? 0) + 1);
    const top = [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return `<section class="eks-sum" aria-labelledby="s-t">
      <h2 class="eks-h2" id="s-t">${icon('flag')}Ekspedisi selesai · ${total(t)} poin</h2>
      ${
        top.length
          ? `<p>Jebakan yang perlu kalian ingat untuk hari Senin:</p><ol class="eks-traps">${top.map(([tr]) => `<li>${mathHtml(tr)}</li>`).join('')}</ol>`
          : '<p>Tidak ada jebakan yang mengenai kelompok kalian. Pertahankan ketelitian ini hari Senin.</p>'
      }
    </section>`;
  }

  // ===========================================================================================
  // Tim: soal dua fase
  // ===========================================================================================
  function stageHtml(head: string): HTMLElement {
    return html(`<div class="eks-play">
      <div class="eks-bar">
        <span class="eks-who">${icon('armchair')}<span data-who></span></span>
        <span class="eks-phase" data-phase></span>
        <span class="eks-clock num" data-clock></span>
        <span class="eks-bar-sp"></span>
        <button type="button" class="btn" data-hint>${icon('lightbulb')}<span>Petunjuk <span class="num" data-hints></span></span></button>
        <button type="button" class="btn btn--primary" data-help>${icon('users')}<span>Minta bantuan tim</span></button>
      </div>
      <section class="tes-stage eks-stage" aria-label="Soal">
        <article class="soal tes-paper eks-paper">
          <header class="soal-h"><span>${head}</span><span data-step></span></header>
          <div class="soal-b" data-paper></div>
          <div class="eks-hintbox" data-hintbox hidden></div>
        </article>
        <div class="tes-ans">
          <p class="tes-k">Pilih satu jawaban</p>
          <div class="tes-opts" data-opts></div>
        </div>
      </section>
      <div class="eks-veil" data-veil hidden></div>
    </div>`);
  }

  function renderOptions(box: HTMLElement, it: GItem, struck: Set<number>): void {
    const textual = it.options.some((o) => o.replace(/\$[^$]*\$/g, '').trim().length > 0);
    box.className = `tes-opts${textual ? ' is-col' : ''}`;
    box.setAttribute('role', 'radiogroup');
    box.innerHTML = it.options
      .map(
        (o, i) =>
          `<button type="button" role="radio" class="tes-opt${struck.has(i) ? ' is-struck' : ''}" data-opt="${i}" aria-checked="false" ${struck.has(i) ? 'disabled' : ''}><span class="ol">${LETTERS[i]}</span><span class="tes-opt-m">${mathHtml(o)}</span></button>`,
      )
      .join('');
  }

  /** Alur pos biasa (pos 0–5 dan 7). */
  function soalView(t: TeamState, pos: SoalPos): void {
    const n = POS[pos].n;
    // lanjutkan pos yang sedang dikerjakan (tablet dimuat ulang atau sempat ditinggal)
    const prev = t.cur && t.cur.pos === pos ? t.cur : null;
    const results: number[] = prev ? [...prev.pts] : [];
    let wrong = prev?.wrong ?? 0;
    let helped = prev?.helped ?? 0;
    let firstAll = prev?.firstAll ?? true;
    let open = false;
    const node = stageHtml(`${POS[pos].name}`);
    const q = <T extends HTMLElement>(s: string): T => node.querySelector<T>(s)!;
    const paperB = q<HTMLElement>('[data-paper]');
    const opts = q<HTMLElement>('[data-opts]');
    const veil = q<HTMLElement>('[data-veil]');
    const hintBox = q<HTMLElement>('[data-hintbox]');
    const noHint = pos === 7;
    if (noHint) q<HTMLElement>('[data-hint]').hidden = true;

    let i = prev?.i ?? 0;
    let it: GItem;
    let phase: 'siap' | 'mandiri' | 'diskusi' | 'kedua' | 'hasil' = 'siap';
    let t0 = 0;
    let usedHint = false;
    let struck = new Set<number>();

    const syncBar = (): void => {
      q('[data-who]').textContent = answerer(t);
      q('[data-hints]').textContent = String(t.hints);
      q('[data-step]').textContent = `Soal ${i + 1} dari ${n}`;
      const ph = q<HTMLElement>('[data-phase]');
      ph.dataset.p = phase;
      // soal tersembunyi sampai penjawab menekan "siap" (waktu baru berjalan saat itu)
      node.dataset.ph = phase;
      ph.innerHTML =
        phase === 'mandiri'
          ? `${icon('user')}Fase Mandiri · tim menunggu di belakang`
          : phase === 'diskusi'
            ? `${icon('users')}Fase Diskusi · tim boleh ke meja`
            : phase === 'kedua'
              ? `${icon('rotate-ccw')}Kesempatan kedua · boleh diskusi`
              : '';
      q<HTMLButtonElement>('[data-help]').hidden = phase !== 'mandiri';
      q<HTMLButtonElement>('[data-hint]').disabled =
        t.hints <= 0 || usedHint || !(phase === 'mandiri' || phase === 'diskusi');
    };

    const load = (attempt: number): void => {
      it = gameItem(t.seed, pos, i, attempt);
      paperB.innerHTML = it.paper;
      renderMath(paperB);
      struck = new Set();
      hintBox.hidden = true;
      renderOptions(opts, it, struck);
    };

    /** layar serah giliran: soal tersembunyi sampai penjawab siap */
    const handover = (): void => {
      phase = 'siap';
      usedHint = false;
      load(0);
      syncBar();
      const who = answerer(t);
      veil.hidden = false;
      veil.innerHTML = `<div class="eks-veil-c">
        <p class="eyebrow">${POS[pos].name} · soal ${i + 1} dari ${n}</p>
        <p class="eks-veil-k">Giliran menjawab</p>
        <p class="eks-veil-who">${esc(who)}</p>
        <p class="eks-veil-t">${esc(who)} duduk di meja depan. Anggota lain menunggu di belakang sampai fase Diskusi.</p>
        <button type="button" class="btn btn--primary btn--lg" data-ready>${icon('play')}<span>${esc(who)} siap</span></button>
      </div>`;
      play(
        veil.firstElementChild as HTMLElement,
        [
          { opacity: 0, transform: 'scale(.96)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: DUR.base,
          easing: EASE_OUT,
          ui: true,
        },
      );
    };

    const persist = (): void => {
      t.cur = { pos, i, pts: results, wrong, helped, firstAll, open };
      teamStore.save(t);
    };

    const begin = (): void => {
      open = true;
      persist();
      veil.hidden = true;
      phase = 'mandiri';
      t0 = Date.now();
      syncBar();
    };

    const toDiskusi = (): void => {
      if (phase !== 'mandiri') return;
      phase = 'diskusi';
      SND.click();
      syncBar();
      toast('Fase Diskusi: panggil tim ke meja. Penjawab tetap yang menekan jawaban.');
    };

    const feedback = (html_: string, next: () => void, label = 'Lanjut'): void => {
      veil.hidden = false;
      veil.innerHTML = `<div class="eks-veil-c eks-fb">${html_}<button type="button" class="btn btn--primary btn--lg" data-cont>${icon('arrow-right')}<span>${label}</span></button></div>`;
      renderMath(veil);
      veil.querySelector('[data-cont]')!.addEventListener('click', next, { once: true });
    };

    const finishSoal = (pts: number): void => {
      results.push(pts);
      nextTurn(t);
      i++;
      open = false;
      persist();
      if (i < n) handover();
      else finishPos();
    };

    const finishPos = (): void => {
      t.cur = null;
      teamStore.save(t);
      if (pos === 0) {
        // latihan: tidak dinilai
        const score = results.reduce((s, x) => s + x, 0);
        feedback(
          `<p class="eks-fb-k">Latihan selesai</p><p class="eks-fb-big num">${score} poin</p>
          <p>Di permainan sungguhan, setiap pos yang selesai memberi <b>kode bukti</b>, misalnya <b class="num">Q7K2M</b>. Juru lapor membawanya ke Game Master supaya skor kelompok naik di papan.</p>`,
          () => {
            teamStore.clear();
            roleView();
          },
          'Selesai latihan',
        );
        return;
      }
      const score = results.reduce((s, x) => s + x, 0) + (firstAll ? PTS.bonus : 0);
      const reporter = takeReporter(t);
      const r: PosResult = {
        score,
        wrong,
        helped,
        code: proofCode(t.game, t.team, { pos, score, wrong, helped }),
        reporter,
      };
      t.results[pos] = r;
      teamStore.save(t);
      SND.correct();
      reportView(t, pos, r, true, firstAll);
    };

    const answer = (k: number): void => {
      if (phase !== 'mandiri' && phase !== 'diskusi' && phase !== 'kedua') return;
      const ok = k === it.ok;
      opts.querySelectorAll<HTMLElement>('.tes-opt').forEach((b, j) => {
        b.setAttribute('aria-checked', String(j === k));
        b.classList.toggle('is-key', j === it.ok && (ok || phase === 'kedua'));
        b.classList.toggle('is-bad', j === k && !ok);
      });
      const was = phase;
      phase = 'hasil';
      syncBar();
      if (was === 'kedua') {
        if (ok) {
          SND.correct();
          feedback(
            `<p class="eks-fb-k is-ok">${icon('circle-check')}Benar di kesempatan kedua</p><p class="eks-fb-big num">+${PTS.kedua}</p>`,
            () => finishSoal(PTS.kedua),
          );
        } else {
          SND.wrong();
          feedback(
            `<p class="eks-fb-k is-no">${icon('circle-x')}Belum tepat</p><p class="eks-fb-t">${mathHtml(it.traps[k] ?? '')}</p><p class="eks-fb-ex"><b>Kunci:</b> ${mathHtml(it.options[it.ok]!)}. ${mathHtml(it.explain)}</p>`,
            () => finishSoal(0),
          );
        }
        return;
      }
      if (ok) {
        const pts = was === 'mandiri' && !usedHint ? PTS.mandiri : PTS.diskusi;
        if (pts !== PTS.mandiri) helped++;
        SND.correct();
        feedback(
          `<p class="eks-fb-k is-ok">${icon('circle-check')}Benar${was === 'mandiri' && !usedHint ? ', mandiri' : ''}</p><p class="eks-fb-big num">+${pts}</p>`,
          () => finishSoal(pts),
        );
        return;
      }
      // salah: tunjukkan jebakan, lalu soal kembaran
      wrong++;
      firstAll = false;
      if (was === 'diskusi' || usedHint) helped++;
      const trap = it.traps[k] ?? '';
      t.traps.push(trap);
      persist();
      SND.wrong();
      feedback(
        `<p class="eks-fb-k is-no">${icon('circle-x')}Kena jebakan</p><p class="eks-fb-t">${mathHtml(trap)}</p><p class="eks-fb-ex">Kesempatan kedua: soal kembaran dengan angka lain, ${T_KEDUA / 1000} detik, boleh berdiskusi.</p>`,
        () => {
          veil.hidden = true;
          load(1);
          phase = 'kedua';
          t0 = Date.now();
          syncBar();
        },
        'Kesempatan kedua',
      );
    };

    const timeUp = (): void => {
      const was = phase;
      phase = 'hasil';
      firstAll = false;
      if (was !== 'kedua') {
        wrong++;
        if (was === 'diskusi' || usedHint) helped++;
      }
      opts
        .querySelectorAll<HTMLElement>('.tes-opt')
        .forEach((b, j) => b.classList.toggle('is-key', j === it.ok));
      SND.wrong();
      syncBar();
      feedback(
        `<p class="eks-fb-k is-no">${icon('hourglass')}Waktu soal habis</p><p class="eks-fb-ex"><b>Kunci:</b> ${mathHtml(it.options[it.ok]!)}. ${mathHtml(it.explain)}</p><p class="eks-note">Ingat di TKA: soal yang terlalu lama dilewati dulu, lalu kembali di putaran kedua.</p>`,
        () => finishSoal(0),
      );
    };

    every(200, () => {
      const clock = q<HTMLElement>('[data-clock]');
      if (phase === 'mandiri' || phase === 'diskusi') {
        const el_ = Date.now() - t0;
        if (phase === 'mandiri' && el_ >= T_MANDIRI) toDiskusi();
        const left = T_SOAL - el_;
        clock.textContent = phase === 'mandiri' ? mmss(T_MANDIRI - el_) : mmss(left);
        clock.classList.toggle('is-warn', left <= 20_000);
        if (left <= 0) timeUp();
      } else if (phase === 'kedua') {
        const left = T_KEDUA - (Date.now() - t0);
        clock.textContent = mmss(left);
        clock.classList.toggle('is-warn', left <= 15_000);
        if (left <= 0) timeUp();
      } else clock.textContent = '';
    });

    const useHint = (kind: 'rumus' | 'buang'): void => {
      if (t.hints <= 0 || usedHint) return;
      t.hints--;
      usedHint = true;
      teamStore.save(t);
      if (kind === 'rumus') {
        hintBox.hidden = false;
        hintBox.innerHTML = `<p class="tes-k">${icon('lightbulb')}Petunjuk</p><p>${mathHtml(it.hint)}</p>`;
        renderMath(hintBox);
      } else {
        const wrongs = it.options.map((_, j) => j).filter((j) => j !== it.ok);
        for (let s = wrongs.length - 1; s > 0; s--) {
          const j = Math.floor(Math.random() * (s + 1));
          [wrongs[s], wrongs[j]] = [wrongs[j]!, wrongs[s]!];
        }
        struck = new Set(wrongs.slice(0, 2));
        renderOptions(opts, it, struck);
      }
      syncBar();
    };

    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      if (tg.closest('[data-ready]')) return begin();
      const o = tg.closest<HTMLElement>('[data-opt]');
      if (o) return answer(Number(o.dataset.opt));
      if (tg.closest('[data-help]')) return toDiskusi();
      if (tg.closest('[data-hint]'))
        openSheet({
          title: `Pakai petunjuk? (sisa ${t.hints})`,
          body: `<p>Petunjuk berlaku untuk soal ini saja. Soal yang memakai petunjuk paling banyak <b>${PTS.diskusi} poin</b>.</p>`,
          actions: [
            { label: 'Ingatkan rumus', kind: 'primary', icon: 'lightbulb', onClick: () => useHint('rumus') },
            { label: 'Buang dua pilihan', icon: 'x', onClick: () => useHint('buang') },
          ],
          closeLabel: 'Batal',
        });
    });

    show(node);
    if (prev?.open) {
      // soal yang sudah dibuka lalu ditinggal: hangus, supaya tidak bisa diulang dengan jawaban yang sudah diketahui
      results.push(0);
      firstAll = false;
      wrong++;
      nextTurn(t);
      i++;
      open = false;
      persist();
      toast('Soal yang ditinggalkan di tengah jalan dihitung hangus.');
    } else persist();
    if (i < n) handover();
    else finishPos();
  }

  // ===========================================================================================
  // Tim: Pacu Waktu (6 soal, 5 menit, urutan bebas, jangan dikosongkan)
  // ===========================================================================================
  function pacuView(t: TeamState): void {
    const n = POS[6].n;
    const items = Array.from({ length: n }, (_, k) => gameItem(t.seed, 6, k));
    const prev = t.cur && t.cur.pos === 6 && t.cur.st ? t.cur : null;
    const state: Array<'belum' | 'benar' | 'salah'> = prev
      ? [...prev.st!]
      : Array.from({ length: n }, () => 'belum');
    const who: string[] = Array.from({ length: n }, () => '');
    const tEnd = prev?.end ?? Date.now() + T_PACU;
    const persist = (): void => {
      t.cur = {
        pos: 6,
        i: 0,
        pts: [],
        wrong: 0,
        helped: 0,
        firstAll: true,
        open: false,
        end: tEnd,
        st: state,
      };
      teamStore.save(t);
    };
    persist();
    let cur = -1;
    let done = false;
    const node = html(`<div class="eks-play">
      <div class="eks-bar">
        <span class="eks-who">${icon('armchair')}<span data-next></span></span>
        <span class="eks-phase" data-p="pacu">${icon('timer')}Pacu Waktu · semua boleh berdiskusi, penjawab bergilir menekan</span>
        <span class="eks-bar-sp"></span>
        <span class="eks-clock eks-clock--big num" data-clock>${mmss(T_PACU)}</span>
      </div>
      <p class="eks-alarm" data-alarm hidden>${icon('circle-alert')}<b>Jangan dikosongkan!</b> Di TKA soal kosong pasti 0. Pilih jawaban terbaik untuk soal yang tersisa.</p>
      <div class="eks-pacu" data-grid></div>
      <section class="tes-stage eks-stage" data-stage hidden>
        <article class="soal tes-paper eks-paper"><header class="soal-h"><span data-head></span><span data-who></span></header><div class="soal-b" data-paper></div></article>
        <div class="tes-ans"><p class="tes-k">Pilih satu jawaban</p><div class="tes-opts" data-opts></div>
          <div class="tes-ans-f"><button type="button" class="btn" data-skip>${icon('arrow-right')}<span>Lewati dulu</span></button></div></div>
      </section>
    </div>`);
    const q = <T extends HTMLElement>(s: string): T => node.querySelector<T>(s)!;
    const grid = q<HTMLElement>('[data-grid]');
    const stage = q<HTMLElement>('[data-stage]');

    const renderGrid = (): void => {
      q('[data-next]').textContent = answerer(t);
      grid.hidden = false;
      stage.hidden = true;
      grid.innerHTML = items
        .map(
          (it, k) =>
            `<button type="button" class="eks-tile is-${state[k]}" data-k="${k}" ${state[k] !== 'belum' ? 'disabled' : ''}>
              <span class="eks-num num">${k + 1}</span><span class="eks-tile-t">${it.tpl.startsWith('l') ? 'Lingkaran' : it.tpl.startsWith('g') ? 'Gelombang' : it.tpl.startsWith('t') ? 'Transformasi' : 'Jebakan'}</span>
              <span class="eks-tile-s">${state[k] === 'belum' ? 'Belum' : state[k] === 'benar' ? `${icon('circle-check')}Benar` : `${icon('circle-x')}Salah`}${who[k] ? ` · ${esc(who[k]!)}` : ''}</span></button>`,
        )
        .join('');
    };

    const open = (k: number): void => {
      cur = k;
      const it = items[k]!;
      who[k] = answerer(t);
      q('[data-next]').textContent = who[k]!;
      grid.hidden = true;
      stage.hidden = false;
      q('[data-head]').textContent = `Pacu Waktu · soal ${k + 1}`;
      q('[data-who]').textContent = `Penjawab: ${who[k]}`;
      const pb = q<HTMLElement>('[data-paper]');
      pb.innerHTML = it.paper;
      renderMath(pb);
      renderOptions(q('[data-opts]'), it, new Set());
    };

    const finish = (): void => {
      if (done) return;
      done = true;
      const ok = state.filter((s) => s === 'benar').length;
      const wrong = Math.min(3, state.filter((s) => s !== 'benar').length);
      const score = ok * PTS.pacu + (ok === n ? PTS.bonus : 0);
      const reporter = takeReporter(t);
      const r: PosResult = {
        score,
        wrong,
        helped: 0,
        code: proofCode(t.game, t.team, { pos: 6, score, wrong, helped: 0 }),
        reporter,
      };
      t.cur = null;
      t.results[6] = r;
      teamStore.save(t);
      reportView(t, 6, r, true, ok === n);
    };

    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      const tile = tg.closest<HTMLElement>('[data-k]');
      if (tile && !done) return open(Number(tile.dataset.k));
      if (tg.closest('[data-skip]')) {
        // giliran tetap maju: penjawab berikutnya memegang soal lain
        nextTurn(t);
        teamStore.save(t);
        who[cur] = '';
        return renderGrid();
      }
      const o = tg.closest<HTMLElement>('[data-opt]');
      if (o && cur >= 0 && !done) {
        const it = items[cur]!;
        const ok = Number(o.dataset.opt) === it.ok;
        state[cur] = ok ? 'benar' : 'salah';
        if (!ok) t.traps.push(it.traps[Number(o.dataset.opt)] ?? '');
        nextTurn(t);
        persist();
        if (ok) SND.correct();
        else SND.wrong();
        toast(ok ? 'Benar.' : 'Belum tepat. Lanjut ke soal lain.');
        if (state.every((s) => s !== 'belum')) return finish();
        renderGrid();
      }
    });

    every(200, () => {
      const left = tEnd - Date.now();
      const c = q<HTMLElement>('[data-clock]');
      c.textContent = mmss(left);
      c.classList.toggle('is-warn', left <= 30_000);
      q<HTMLElement>('[data-alarm]').hidden = left > 30_000 || done;
      if (left <= 0) finish();
    });
    show(node);
    renderGrid();
  }

  // ===========================================================================================
  // Tim: kode bukti
  // ===========================================================================================
  function reportView(t: TeamState, pos: PosId, r: PosResult, fresh: boolean, perfect = false): void {
    const node = html(`<div class="eks-center"><section class="eks-card eks-report" aria-labelledby="r-t">
      <p class="eyebrow">${POS[pos].name}${fresh ? ' selesai' : ''}</p>
      <h2 class="eks-h2" id="r-t">${r.score} poin${perfect ? ` · <span class="eks-bonus">bonus +${PTS.bonus} semua benar</span>` : ''}</h2>
      <p class="eks-note">Kode bukti</p>
      <p class="eks-code num" aria-label="Kode bukti ${r.code.split('').join(' ')}">${r.code}</p>
      <p class="eks-rep">${icon('footprints')}<span><b>${esc(r.reporter)}</b>, bawa kode ini ke Game Master dan ketik di laptop guru.</span></p>
      <div class="tes-actions"><button type="button" class="btn btn--primary btn--lg" data-map>${icon('map')}<span>Kembali ke peta</span></button></div>
    </section></div>`);
    node.querySelector('[data-map]')!.addEventListener('click', mapView);
    show(node);
    if (fresh)
      play(
        node.querySelector('.eks-code')!,
        [
          { opacity: 0, transform: 'scale(.8)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.slow, easing: EASE_OUT, ui: true },
      );
  }

  // ===========================================================================================
  // Game Master
  // ===========================================================================================
  function gmLockView(): void {
    const node = html(`<div class="eks-center"><section class="eks-card" aria-labelledby="g-t">
      <h2 class="eks-h2" id="g-t">${icon('key-round')}Game Master</h2>
      <p class="eks-note">Masukkan kata sandi guru untuk membuat dan memandu permainan.</p>
      <label class="tes-field"><span class="tes-lbl">Kata sandi</span>
        <input class="tes-input" type="password" data-pw maxlength="40" autocomplete="off" spellcheck="false" placeholder="Ketuk untuk mengisi"></label>
      <p class="tes-err" role="alert" data-err></p>
      <div class="tes-actions"><button type="button" class="btn" data-back>${icon('arrow-left')}<span>Kembali</span></button>
        <button type="button" class="btn btn--primary" data-go>${icon('key-round')}<span>Masuk</span></button></div>
    </section></div>`);
    const input = node.querySelector<HTMLInputElement>('[data-pw]')!;
    const submit = async (): Promise<void> => {
      if (await checkGmPassword(input.value)) {
        gmStore.unlock();
        gmEntry();
      } else {
        node.querySelector('[data-err]')!.textContent = 'Kata sandi salah.';
        SND.wrong();
      }
    };
    node.querySelector('[data-go]')!.addEventListener('click', () => void submit());
    node.querySelector('[data-back]')!.addEventListener('click', roleView);
    show(node);
    // Game Master memakai papan ketik laptop: Enter untuk masuk
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') void submit();
    });
    input.focus();
  }

  function gmEntry(): void {
    const g = gmStore.load();
    if (g && !g.revealed) gmBoard();
    else gmSetup();
  }

  function gmSetup(): void {
    let minutes = 60;
    let teams = 5;
    let mask = 0x7f;
    const est = (): number => posList(mask).reduce((s, p) => s + (p === 6 ? 6 : 7), 0) + 3;
    const node = html(`<div class="eks-scroll"><div class="eks-col">
      <h1 class="eks-h1">${icon('key-round')}Siapkan permainan</h1>
      <section class="eks-card eks-card--wide eks-setup">
        <div class="row"><span class="row-label" id="s-min">Waktu permainan<small>Bisa ditambah atau dikurangi saat bermain.</small></span>
          <div class="eks-stepper"><button type="button" class="icon-btn" data-min="-5" aria-label="Kurangi 5 menit">${icon('minus')}</button><b class="num" data-mins></b><button type="button" class="icon-btn" data-min="5" aria-label="Tambah 5 menit">${icon('plus')}</button></div></div>
        <div class="row"><span class="row-label">Pilihan cepat</span>
          <div class="seg" role="radiogroup" aria-labelledby="s-min">${[10, 30, 45, 60].map((m) => `<button type="button" role="radio" data-quick="${m}">${m} menit</button>`).join('')}</div></div>
        <div class="row"><span class="row-label" id="s-tim">Jumlah kelompok</span>
          <div class="seg" role="radiogroup" aria-labelledby="s-tim">${[2, 3, 4, 5, 6].map((k) => `<button type="button" role="radio" data-teams="${k}">${k}</button>`).join('')}</div></div>
        <div class="eks-poslist">${POS_IDS.map(
          (p) =>
            `<button type="button" class="toggle" role="switch" data-mpos="${p}"><span class="toggle-text">${pad2(p)} · ${POS[p].name}<small>${POS[p].goal} · ${POS[p].n} soal</small></span><span class="sw" aria-hidden="true"></span></button>`,
        ).join('')}</div>
        <p class="eks-note" data-est></p>
        <div class="tes-actions"><button type="button" class="btn" data-lock>${icon('lock')}<span>Kunci Game Master</span></button>
          <button type="button" class="btn btn--primary btn--lg" data-make>${icon('map')}<span>Buat permainan</span></button></div>
      </section>
    </div></div>`);
    const sync = (): void => {
      node.querySelector('[data-mins]')!.textContent = `${minutes} menit`;
      node
        .querySelectorAll<HTMLElement>('[data-quick]')
        .forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.quick) === minutes)));
      node
        .querySelectorAll<HTMLElement>('[data-teams]')
        .forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.teams) === teams)));
      node
        .querySelectorAll<HTMLElement>('[data-mpos]')
        .forEach((b) =>
          b.setAttribute('aria-checked', String(!!(mask & (1 << (Number(b.dataset.mpos) - 1))))),
        );
      const e = est();
      node.querySelector('[data-est]')!.innerHTML =
        `Perkiraan waktu untuk ${posList(mask).length} pos: <b>±${e} menit</b>${e > minutes ? ' — lebih lama dari waktu permainan; kelompok mungkin tidak menyelesaikan semua pos.' : '.'}`;
    };
    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      const mn = tg.closest<HTMLElement>('[data-min]');
      if (mn) minutes = Math.min(120, Math.max(5, minutes + Number(mn.dataset.min)));
      const qk = tg.closest<HTMLElement>('[data-quick]');
      if (qk) minutes = Number(qk.dataset.quick);
      const tm = tg.closest<HTMLElement>('[data-teams]');
      if (tm) teams = Number(tm.dataset.teams);
      const mp = tg.closest<HTMLElement>('[data-mpos]');
      if (mp) {
        const bit = 1 << (Number(mp.dataset.mpos) - 1);
        if (mask & bit && posList(mask).length === 1) toast('Paling sedikit satu pos.');
        else mask ^= bit;
      }
      if (tg.closest('[data-lock]')) {
        gmStore.lock();
        return roleView();
      }
      if (tg.closest('[data-make]')) {
        const rnd = new Uint32Array(1);
        crypto.getRandomValues(rnd);
        const g: GmState = {
          game: makeGameCode(mask, rnd[0]!),
          mask,
          teams: Array.from({ length: teams }, (_, k) => ({ no: k + 1, name: `Kelompok ${k + 1}` })),
          duration: minutes * 60000,
          deadline: null,
          left: minutes * 60000,
          started: false,
          ended: false,
          revealed: false,
          reports: [],
        };
        gmStore.save(g);
        return gmBoard();
      }
      sync();
    });
    show(node);
    sync();
  }

  function gmBoard(): void {
    const g = gmStore.load();
    if (!g) return gmSetup();
    const active = posList(g.mask);
    const node = html(`<div class="eks-board">
      <section class="eks-b-side">
        <p class="eyebrow">Ekspedisi TKA · Game Master</p>
        <p class="eks-b-clock num" data-clock></p>
        <p class="eks-b-state" data-gm-state></p>
        <div class="eks-b-ctl">
          <button type="button" class="btn" data-adj="-300000">−5</button>
          <button type="button" class="btn" data-adj="-60000">−1</button>
          <button type="button" class="btn btn--primary" data-run></button>
          <button type="button" class="btn" data-adj="60000">+1</button>
          <button type="button" class="btn" data-adj="300000">+5</button>
        </div>
        <div class="eks-b-entry">
          <label class="tes-field"><span class="tes-lbl">Kode bukti dari juru lapor</span>
            <input class="tes-input eks-code-in num" data-proof maxlength="6" autocomplete="off" spellcheck="false" placeholder="5 huruf"></label>
          <button type="button" class="btn btn--primary" data-record>${icon('check')}<span>Catat</span></button>
        </div>
        <p class="eks-b-msg" role="status" data-msg></p>
        <div class="eks-b-more">
          <button type="button" class="btn" data-codes>${icon('users')}<span>Kode gabung</span></button>
          <button type="button" class="btn" data-end>${icon('flag')}<span>Akhiri</span></button>
        </div>
      </section>
      <section class="eks-b-main" aria-labelledby="rk-t">
        <h2 class="eks-h2" id="rk-t">${icon('trophy')}Peringkat</h2>
        <ol class="eks-rank" data-rank></ol>
      </section>
    </div>`);
    const q = <T extends HTMLElement>(s: string): T => node.querySelector<T>(s)!;
    const input = q<HTMLInputElement>('[data-proof]');
    const rankEl = q<HTMLElement>('[data-rank]');
    let endAt = 0;

    const save = (): void => gmStore.save(g);

    const renderRank = (): void => {
      const before = new Map<string, number>();
      rankEl
        .querySelectorAll<HTMLElement>('[data-team]')
        .forEach((li) => before.set(li.dataset.team!, li.getBoundingClientRect().top));
      rankEl.innerHTML = ranking(g)
        .map(
          (r, k) => `<li data-team="${r.no}" class="${k === 0 && r.score > 0 ? 'is-top' : ''}">
            <span class="eks-rk num">${k + 1}</span>
            <span class="eks-rk-n">${esc(r.name)}<span class="eks-rk-p">${active
              .map(
                (p) =>
                  `<span class="eks-dot${r.done.includes(p) ? ' is-on' : ''}" title="${POS[p].name}">${pad2(p)}</span>`,
              )
              .join('')}</span></span>
            <span class="eks-rk-s num">${r.score}</span></li>`,
        )
        .join('');
      // FLIP: baris yang naik/turun bergeser halus
      rankEl.querySelectorAll<HTMLElement>('[data-team]').forEach((li) => {
        const b = before.get(li.dataset.team!);
        if (b === undefined) return;
        const d = b - li.getBoundingClientRect().top;
        if (d)
          play(li, [{ transform: `translateY(${d}px)` }, { transform: 'none' }], {
            duration: DUR.slow,
            easing: EASE_OUT,
            ui: true,
          });
      });
    };

    const renderClock = (): void => {
      const left = timeLeft(g);
      q('[data-clock]').textContent = mmss(left);
      q<HTMLElement>('[data-clock]').classList.toggle('is-warn', g.started && left <= 5 * 60000);
      const st = !g.started
        ? 'Belum dimulai'
        : g.ended
          ? 'Waktu habis'
          : g.deadline === null
            ? 'Dijeda'
            : 'Berjalan';
      q('[data-gm-state]').textContent = st;
      const run = q<HTMLElement>('[data-run]');
      run.innerHTML = !g.started
        ? `${icon('play')}<span>Mulai</span>`
        : g.ended
          ? `${icon('trophy')}<span>Umumkan hasil</span>`
          : g.deadline === null
            ? `${icon('play')}<span>Lanjut</span>`
            : `${icon('pause')}<span>Jeda</span>`;
    };

    const msg = (text: string, ok: boolean): void => {
      const m = q<HTMLElement>('[data-msg]');
      m.textContent = text;
      m.className = `eks-b-msg ${ok ? 'is-ok' : 'is-no'}`;
    };

    const record = (): void => {
      const raw = input.value;
      const got = readProof(
        g.game,
        g.teams.map((t) => t.no),
        raw,
      );
      if (!got) {
        SND.wrong();
        return msg('Kode tidak dikenali. Periksa lagi hurufnya.', false);
      }
      if (!active.includes(got.proof.pos)) return msg('Pos itu tidak dimainkan di permainan ini.', false);
      if (g.reports.some((r) => r.team === got.team && r.pos === got.proof.pos))
        return msg(`Kode pos ${POS[got.proof.pos].name} untuk Kelompok ${got.team} sudah dicatat.`, false);
      if (g.ended && Date.now() - endAt > 60_000 && endAt) return msg('Waktu permainan sudah habis.', false);
      g.reports.push({ team: got.team, ...got.proof, at: Date.now() });
      save();
      input.value = '';
      SND.correct();
      msg(`Kelompok ${got.team} · ${POS[got.proof.pos].name} · +${got.proof.score} poin`, true);
      renderRank();
    };

    const showCodes = (): void =>
      void openSheet({
        title: 'Kode gabung kelompok',
        body: `<p>Setiap kelompok mengetik kodenya di tablet: Ekspedisi TKA → Masuk sebagai kelompok.</p>
          <ul class="eks-joins">${g.teams.map((t) => `<li><span>${esc(t.name)}</span><b class="num">${joinCode(g.game, t.no)}</b></li>`).join('')}</ul>
          <p class="eks-note">Pos: ${active.map((p) => POS[p].name).join(', ')}.</p>`,
      });

    const reveal = (): void => {
      g.revealed = true;
      save();
      gmReveal(g);
    };

    node.addEventListener('click', (e) => {
      const tg = e.target as Element;
      const adj = tg.closest<HTMLElement>('[data-adj]');
      if (adj) {
        const d = Number(adj.dataset.adj);
        if (g.deadline !== null) g.deadline = Math.max(Date.now(), g.deadline + d);
        else g.left = Math.max(0, g.left + d);
        if (g.ended && timeLeft(g) > 0) g.ended = false;
        save();
        renderClock();
        return;
      }
      if (tg.closest('[data-run]')) {
        if (!g.started) {
          g.started = true;
          g.deadline = Date.now() + g.left;
        } else if (g.ended) return reveal();
        else if (g.deadline === null) g.deadline = Date.now() + g.left;
        else {
          g.left = timeLeft(g);
          g.deadline = null;
        }
        save();
        renderClock();
        return;
      }
      if (tg.closest('[data-record]')) return record();
      if (tg.closest('[data-codes]')) return showCodes();
      if (tg.closest('[data-end]'))
        openSheet({
          title: 'Akhiri permainan sekarang?',
          body: '<p>Waktu langsung habis. Kode yang dibawa dalam 1 menit berikutnya masih bisa dicatat, lalu umumkan hasil.</p>',
          actions: [
            {
              label: 'Akhiri',
              kind: 'danger',
              onClick: () => {
                g.started = true;
                g.left = 0;
                g.deadline = Date.now();
                save();
              },
            },
          ],
          closeLabel: 'Batal',
        });
    });

    every(250, () => {
      if (g.started && !g.ended && g.deadline !== null && timeLeft(g) <= 0) {
        g.ended = true;
        endAt = Date.now();
        save();
        SND.wrong();
        toast('Waktu habis. Kode yang sedang dibawa masih bisa dicatat selama 1 menit.');
      }
      renderClock();
    });

    show(node);
    renderRank();
    renderClock();
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') record();
    });
    input.focus();
    if (!g.started) showCodes();
  }

  function gmReveal(g: GmState): void {
    const rk = ranking(g);
    const active = posList(g.mask);
    const hard = active
      .map((p) => {
        const rs = g.reports.filter((r) => r.pos === p);
        return { p, rate: rs.length ? rs.reduce((s, r) => s + r.wrong, 0) / rs.length : 0, n: rs.length };
      })
      .filter((x) => x.n > 0 && x.rate > 0)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 2);
    const node = html(`<div class="eks-scroll"><div class="eks-col">
      <p class="eyebrow">Ekspedisi TKA · hasil akhir</p>
      <h1 class="eks-h1">${icon('trophy')}Peringkat akhir</h1>
      <ol class="eks-final">${rk
        .map(
          (r, k) =>
            `<li class="${k === 0 ? 'is-first' : ''}" style="--d:${rk.length - 1 - k}"><span class="eks-rk num">${k + 1}</span><span class="eks-rk-n">${esc(r.name)}</span><span class="eks-rk-s num">${r.score}</span></li>`,
        )
        .join('')}</ol>
      ${
        hard.length
          ? `<section class="eks-card eks-card--wide"><h2 class="eks-h2">${icon('circle-alert')}Pos yang paling banyak menjebak kelas</h2><ul class="eks-hard">${hard
              .map((h) => `<li><b>${POS[h.p].name}</b> · ${POS[h.p].goal}</li>`)
              .join('')}</ul><p class="eks-note">Bahas pos ini bersama sebelum pulang.</p></section>`
          : ''
      }
      <div class="tes-actions"><button type="button" class="btn" data-board>${icon('arrow-left')}<span>Kembali ke papan</span></button>
        <button type="button" class="btn btn--primary" data-new>${icon('plus')}<span>Permainan baru</span></button></div>
    </div></div>`);
    node.querySelector('[data-board]')!.addEventListener('click', () => {
      g.revealed = false;
      gmStore.save(g);
      gmBoard();
    });
    node.querySelector('[data-new]')!.addEventListener('click', () =>
      openSheet({
        title: 'Buat permainan baru?',
        body: '<p>Papan dan laporan permainan ini dihapus dari perangkat ini.</p>',
        actions: [
          {
            label: 'Permainan baru',
            kind: 'primary',
            onClick: () => {
              gmStore.clear();
              setTimeout(gmSetup, 0);
            },
          },
        ],
        closeLabel: 'Batal',
      }),
    );
    show(node);
    // peringkat dibuka dari bawah ke atas
    node.querySelectorAll<HTMLElement>('.eks-final li').forEach((li) => {
      const d = Number(li.style.getPropertyValue('--d'));
      play(
        li,
        [
          { opacity: 0, transform: `translateY(${SLIDE_PX}px)` },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: DUR.slow,
          delay: d * 700,
          easing: EASE_OUT,
          fill: 'backwards',
          ui: true,
        },
      );
    });
  }

  // halaman pertama: tim yang sedang bermain langsung ke peta; Game Master yang masuk ke papannya
  const saved = teamStore.load();
  if (saved && !saved.demo) mapView();
  else roleView();
  return view;
}
