/**
 * Adegan "konteks matriks" soal 2, alur guru (revisi pemilik v1.32).
 * Dua tampilan pada panggung yang sama:
 *  - mx: persamaan matriks berlabel. Mula-mula baris = hewan (sapi, kambing) dan kolom = rumput (R. Gajah, R. Gamal),
 *    dikali (x, y) = (38, 34). t: matriks ditranspos (FLIP: elemen dan label berpindah tempat), sehingga kolom = hewan
 *    (sama dengan konteks x dan y) dan baris = rumput (sama dengan konteks hasil di ruas kanan).
 *    hl: 'sapi' | 'kambing' (baris itu dibingkai), 'xy' (vektor dan konteksnya), 'mis' (konteks kolom ≠ konteks
 *    variabel, merah), 'col' (kolom = variabel), 'row' (baris = hasil), 'r1' | 'r2' (baris × kolom).
 *    vars / res: label konteks di samping vektor dan hasil; lab: label baris dan kolom; simp: baris 1 dibagi 2
 *    (10, 2, 38 menjadi 5, 1, 19); ax: nama A, X, B di bawah.
 *    Angka menjadi sumber terbang menurut posisinya (t-11, t-12, t-21, t-22, t-x, t-y, t-r1, t-r2).
 *  - elim: 10x + y = 34 dikurangi 5x + y = 19 (opsional). e 1 = dua persamaan, y sejajar dan dibingkai;
 *    2 = dikurangkan, y hilang, 5x = 15.
 * Angka dari docs/pembahasan25.md soal 2 (tabel pakan, 5x + y = 19, invers). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Trans2State {
  view?: 'mx' | 'elim';
  t?: boolean;
  hl?: 'sapi' | 'kambing' | 'xy' | 'mis' | 'col' | 'row' | 'r1' | 'r2';
  vars?: boolean;
  res?: boolean;
  lab?: boolean;
  simp?: boolean;
  ax?: boolean;
  e?: 0 | 1 | 2;
  [k: string]: unknown;
}

/** tabel pakan (docs/soal25.md no. 2): baris hewan, kolom rumput */
const CELL: Record<string, { v: string; s?: string }> = {
  '11': { v: '10', s: '5' },
  '12': { v: '10' },
  '21': { v: '2', s: '1' },
  '22': { v: '1' },
};
/** label: teks dan posisinya [baris, kolom grid] sebelum dan sesudah ditranspos */
const LAB: Record<string, { t: string; a: [number, number]; b: [number, number] }> = {
  s: { t: 'sapi', a: [2, 1], b: [1, 2] },
  k: { t: 'kambing', a: [3, 1], b: [1, 3] },
  g: { t: 'R. Gajah', a: [1, 2], b: [2, 1] },
  m: { t: 'R. Gamal', a: [1, 3], b: [3, 1] },
};

function mxMarkup(): string {
  const cells = Object.keys(CELL)
    .map(
      (k) =>
        `<div class="t2-c" data-k="${k}"><span class="t2-ring" aria-hidden="true"></span><span class="t2-v"></span></div>`,
    )
    .join('');
  const labs = Object.entries(LAB)
    .map(([k, l]) => `<span class="t2-lb" data-l="${k}">${l.t}</span>`)
    .join('');
  const ring = '<span class="t2-ring" aria-hidden="true"></span>';
  return `<div class="t2-mx" role="img" aria-label="Persamaan matriks pakan: matriks kebutuhan pakan dikali vektor x, y sama dengan 38 dan 34">
  <span class="t2-br" style="grid-area:2/2/4/4"></span><span class="t2-br" style="grid-area:2/5/4/6"></span><span class="t2-br" style="grid-area:2/8/4/9"></span>
  ${labs}${cells}
  <div class="t2-c t2-vc" data-src="t-x" style="grid-area:2/5">${ring}${tex('x')}</div>
  <div class="t2-c t2-vc" data-src="t-y" style="grid-area:3/5">${ring}${tex('y')}</div>
  <span class="t2-vl" style="grid-area:2/6">sapi</span><span class="t2-vl" style="grid-area:3/6">kambing</span>
  <span class="t2-eqs" style="grid-area:2/7/4/8">${tex('=')}</span>
  <div class="t2-c t2-rc" data-src="t-r1" data-i="1" style="grid-area:2/8">${ring}<span class="t2-v"></span></div>
  <div class="t2-c t2-rc" data-src="t-r2" data-i="2" style="grid-area:3/8">${ring}${tex('34')}</div>
  <span class="t2-rl" style="grid-area:2/9">R. Gajah</span><span class="t2-rl" style="grid-area:3/9">R. Gamal</span>
  <span class="t2-nm" style="grid-area:4/2/5/4">${tex('A')}</span><span class="t2-nm" style="grid-area:4/5">${tex('X')}</span><span class="t2-nm" style="grid-area:4/8">${tex('B')}</span>
  </div>`;
}

function elimMarkup(): string {
  const y = (r: number): string =>
    `<span class="t2-ey" style="grid-area:${r}/4"><span class="t2-ring" aria-hidden="true"></span>${tex('y')}<span class="t2-cut" aria-hidden="true"></span></span>`;
  return `<div class="t2-el" role="img" aria-label="10x + y = 34 dikurangi 5x + y = 19, hasilnya 5x = 15">
  <span style="grid-area:1/2">${tex('10x')}</span><span style="grid-area:1/3">${tex('+')}</span>${y(1)}<span style="grid-area:1/5">${tex('=')}</span><span style="grid-area:1/6">${tex('34')}</span>
  <span class="t2-e2" style="grid-area:2/1">${tex('-')}</span>
  <span style="grid-area:2/2">${tex('5x')}</span><span style="grid-area:2/3">${tex('+')}</span>${y(2)}<span style="grid-area:2/5">${tex('=')}</span><span style="grid-area:2/6">${tex('19')}</span>
  <span class="t2-e2 t2-rule" style="grid-area:3/1/4/7"></span>
  <span class="t2-e2 t2-ans" style="grid-area:4/2">${tex('5x')}</span><span class="t2-e2 t2-ans" style="grid-area:4/5">${tex('=')}</span><span class="t2-e2 t2-ans" style="grid-area:4/6">${tex('15')}</span>
  </div>`;
}

export function createTrans2(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-tr';
  el.innerHTML = mxMarkup() + elimMarkup();
  const mx = el.querySelector<HTMLElement>('.t2-mx')!;
  const cells = [...mx.querySelectorAll<HTMLElement>('.t2-c[data-k]')];
  const labs = [...mx.querySelectorAll<HTMLElement>('.t2-lb')];
  const r1 = mx.querySelector<HTMLElement>('.t2-rc[data-i="1"] .t2-v')!;
  let view = '';
  let trans: boolean | null = null;
  let simp: boolean | null = null;
  let hl = '';
  let e = 0;
  let shown = false;

  const pop = (x: Element, delay: number): Promise<boolean> => {
    (x as HTMLElement).style.transformOrigin = 'center';
    return play(
      x,
      [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 480, delay, easing: EASE_OUT, fill: 'backwards', tag: 'trans' },
    ).finished;
  };
  const fadeIn = (x: Element, delay: number): Promise<boolean> =>
    play(x, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'trans',
    }).finished;

  /** letakkan elemen dan label menurut keadaan transpos; sumber terbang mengikuti posisi */
  function place(t: boolean): void {
    for (const c of cells) {
      const k = c.dataset.k!;
      const [i, j] = t ? [k[1], k[0]] : [k[0], k[1]];
      c.style.gridArea = `${Number(i) + 1} / ${Number(j) + 1}`;
      c.dataset.r = i;
      c.dataset.src = `t-${i}${j}`;
    }
    for (const l of labs) {
      const p = LAB[l.dataset.l!]!;
      const [r, col] = t ? p.b : p.a;
      l.style.gridArea = `${r} / ${col}`;
      l.dataset.pos = r === 1 ? 'top' : 'left';
      l.dataset.r = String(r - 1);
    }
  }

  function setValues(sm: boolean): void {
    for (const c of cells) {
      const d = CELL[c.dataset.k!]!;
      c.querySelector('.t2-v')!.innerHTML = tex(sm && d.s ? d.s : d.v);
    }
    r1.innerHTML = tex(sm ? '19' : '38');
  }

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Trans2State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'mx';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(v === 'mx' ? '.t2-mx' : '.t2-el')!, 0));
        view = v;
      }

      // transpos: elemen di luar diagonal dan label baris/kolom bertukar tempat (FLIP)
      const t = !!s.t;
      if (t !== trans) {
        const move = anim && trans !== null && v === 'mx';
        const items = [...cells, ...labs];
        const before = move ? items.map((x) => x.getBoundingClientRect()) : [];
        place(t);
        if (move)
          items.forEach((x, i) => {
            const a = before[i]!;
            const b = x.getBoundingClientRect();
            const dx = a.left - b.left;
            const dy = a.top - b.top;
            if (Math.abs(dx) + Math.abs(dy) < 1) return;
            runs.push(
              play(x, [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
                duration: DUR.flip * 1.6,
                easing: EASE,
                tag: 'trans',
              }).finished,
            );
          });
        trans = t;
      }

      // baris 1 disederhanakan (dibagi 2): angka yang berubah muncul kembali
      const sm = !!s.simp;
      if (sm !== simp) {
        setValues(sm);
        if (anim && simp !== null)
          [...cells.filter((x) => CELL[x.dataset.k!]!.s), r1].forEach((x, i) => runs.push(pop(x, i * 150)));
        simp = sm;
      }

      // sorotan: baris, vektor, hasil, dan label konteks
      const h = s.hl ?? '';
      const row = h === 'sapi' || h === 'r1' ? '1' : h === 'kambing' || h === 'r2' ? '2' : '0';
      el.dataset.row = row;
      el.dataset.vec = h === 'xy' || h === 'r1' || h === 'r2' ? '1' : '';
      el.dataset.res = h === 'r1' ? '1' : h === 'r2' ? '2' : '';
      el.dataset.top = h === 'mis' ? 'bad' : h === 'col' ? 'acc' : '';
      el.dataset.vl = h === 'mis' ? 'bad' : h === 'col' || h === 'xy' ? 'acc' : '';
      el.dataset.left = h === 'row' ? 'acc' : h === 'sapi' || h === 'kambing' ? 'row' : '';
      el.dataset.rl = h === 'row' ? 'acc' : '';
      el.classList.toggle('show-vars', !!s.vars);
      el.classList.toggle('show-res', !!s.res);
      el.classList.toggle('no-lab', s.lab === false);
      el.classList.toggle('show-ax', !!s.ax);
      if (anim && v === 'mx' && (h !== hl || c.replay))
        mx.querySelectorAll(
          `.t2-c[data-r="${row}"] .t2-ring, ${el.dataset.vec ? '.t2-vc .t2-ring' : '_'}, .t2-rc[data-i="${el.dataset.res}"] .t2-ring`,
        ).forEach((x, i) => runs.push(pop(x, i * 120)));
      hl = h;

      // kemunculan pertama: label, matriks, vektor, lalu hasil
      if (v === 'mx' && anim && (!shown || c.replay))
        mx.querySelectorAll('.t2-lb, .t2-br, .t2-c, .t2-eqs').forEach((x, i) => runs.push(fadeIn(x, i * 60)));
      if (v === 'mx') shown = true;

      // eliminasi (opsional)
      const n = v === 'elim' ? (s.e ?? 1) : 0;
      el.dataset.e = String(n);
      if (anim && n >= 1 && (n !== e || c.replay)) {
        if (n === 1)
          el.querySelectorAll('.t2-ey .t2-ring').forEach((x, i) => runs.push(pop(x, 300 + i * 150)));
        else el.querySelectorAll('.t2-e2, .t2-cut').forEach((x, i) => runs.push(fadeIn(x, i * 160)));
      }
      e = n;
      await Promise.all(runs);
    },
  };
}
