/**
 * Adegan "substitusi pilihan" soal 5, alur pemilik (v1.33).
 * Dua tampilan pada panggung yang sama:
 *  - tab: kelima pilihan (x, 0) sebagai baris. y0: angka 0 (y) di setiap pilihan disorot, artinya semua titik itu
 *    di sumbu X; n: banyak pilihan yang sudah disubstitusi (hasil f(x) muncul, emas bila nol, merah bila tidak);
 *    cur: pilihan yang sedang diuji (dibingkai); win: hanya baris yang nol tetap terang (jawaban).
 *    x tiap pilihan menjadi sumber terbang (o-1 … o-5).
 *  - horner: skema Horner f(x) dibagi (x − 3) untuk cara normal tanpa pilihan (opsional). h 1 = koefisien dan
 *    pembagi 3; 2 = 1 turun, 1·3 = 3, 3 + 3 = 6; 3 = 6·3 = 18, −10 + 18 = 8; 4 = 8·3 = 24, −24 + 24 = 0 (sisa).
 * Angka dari docs/pembahasan25.md soal 5 (substitusi u1–u6, Horner h1–h2). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Subst5State {
  view?: 'tab' | 'horner';
  y0?: boolean;
  n?: number;
  cur?: number;
  win?: boolean;
  h?: 0 | 1 | 2 | 3 | 4;
  [k: string]: unknown;
}

/** pilihan (docs/soal25.md no. 5) dan f(x) = x³ + 3x² − 10x − 24 */
const OPTS = [-2, -1, 3, 4, 5];
const f5 = (x: number): number => x ** 3 + 3 * x ** 2 - 10 * x - 24;
const neg = (v: number): string => String(v).replace('-', '−');

/** skema Horner: [baris, kolom, isi, tahap] */
const HORNER: Array<[number, number, string, number]> = [
  [1, 1, '3', 1],
  [1, 2, '1', 1],
  [1, 3, '3', 1],
  [1, 4, '-10', 1],
  [1, 5, '-24', 1],
  [3, 2, '1', 2],
  [2, 3, '3', 2],
  [3, 3, '6', 2],
  [2, 4, '18', 3],
  [3, 4, '8', 3],
  [2, 5, '24', 4],
  [3, 5, '0', 4],
];

function tabMarkup(): string {
  const rows = OPTS.map((x, i) => {
    const v = f5(x);
    return `<div class="s5-row${v === 0 ? ' is-zero' : ''}" data-i="${i + 1}">
      <span class="s5-ring" aria-hidden="true"></span>
      <span class="s5-pt">${tex('(')}<span class="s5-x" data-src="o-${i + 1}">${tex(neg(x))}</span>${tex(',')}<span class="s5-y">${tex('0')}</span>${tex(')')}</span>
      <span class="s5-res">${tex(`f(${neg(x)})=${neg(v)}`)}</span>
      <span class="s5-tag">${v === 0 ? 'titik potong' : 'bukan nol'}</span>
    </div>`;
  }).join('');
  return `<div class="s5-tab" role="img" aria-label="Kelima pilihan disubstitusi ke f(x): f(−2) = 0, f(−1) = −12, f(3) = 0, f(4) = 48, f(5) = 126">${rows}</div>`;
}

function hornerMarkup(): string {
  const cells = HORNER.map(
    ([r, c, t, h]) =>
      `<span class="s5-hc${r === 1 && c === 1 ? ' s5-hd' : ''}${r === 3 && c === 5 ? ' s5-hs' : ''}" data-h="${h}" style="grid-area:${r}/${c}">${tex(t)}</span>`,
  ).join('');
  return `<div class="s5-horner" role="img" aria-label="Skema Horner: koefisien 1, 3, −10, −24 dibagi x = 3; hasil 1, 6, 8, sisa 0">
    ${cells}<span class="s5-vl" aria-hidden="true"></span><span class="s5-hl" aria-hidden="true"></span>
    <span class="s5-cap" data-h="2" style="grid-area:4/2/5/5">hasil bagi</span><span class="s5-cap s5-hs" data-h="4" style="grid-area:4/5">sisa</span>
  </div>`;
}

export function createSubst5(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-subst';
  el.innerHTML = tabMarkup() + hornerMarkup();
  const rows = [...el.querySelectorAll<HTMLElement>('.s5-row')];
  const hcells = [...el.querySelectorAll<HTMLElement>('.s5-horner [data-h]')];
  let view = '';
  let n = 0;
  let cur = 0;
  let h = 0;
  let y0 = false;

  const pop = (e: Element, delay: number): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    return play(
      e,
      [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 460, delay, easing: EASE_OUT, fill: 'backwards', tag: 'subst' },
    ).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Subst5State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'tab';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view)
          runs.push(
            play(
              el.querySelector(v === 'tab' ? '.s5-tab' : '.s5-horner')!,
              [{ opacity: 0 }, { opacity: 1 }],
              {
                duration: 450,
                easing: EASE_OUT,
                tag: 'subst',
              },
            ).finished,
          );
        view = v;
      }

      // y = 0 di setiap pilihan
      const wantY = !!s.y0;
      el.classList.toggle('show-y0', wantY);
      if (wantY && anim && (!y0 || c.replay))
        el.querySelectorAll('.s5-y').forEach((e, i) => runs.push(pop(e, i * 120)));
      y0 = wantY;

      // substitusi: hasil muncul baris demi baris
      const m = s.n ?? 0;
      const k = s.cur ?? 0;
      rows.forEach((r, i) => {
        r.classList.toggle('on', i < m);
        r.classList.toggle('is-cur', k === i + 1);
        if (i < m && anim && v === 'tab' && (i >= n || c.replay))
          r.querySelectorAll('.s5-res, .s5-tag').forEach((e, j) => runs.push(pop(e, 300 + j * 200)));
        if (k === i + 1 && anim && (k !== cur || c.replay)) runs.push(pop(r.querySelector('.s5-ring')!, 0));
      });
      n = m;
      cur = k;
      el.classList.toggle('is-win', !!s.win);

      // Horner: sel tahap baru muncul kolom demi kolom
      const hh = v === 'horner' ? (s.h ?? 1) : 0;
      hcells.forEach((e) => e.classList.toggle('on', Number(e.dataset.h) <= hh));
      const from = c.replay ? 0 : h;
      if (anim && hh > from)
        hcells
          .filter((e) => Number(e.dataset.h) > from && Number(e.dataset.h) <= hh)
          .forEach((e, i) => runs.push(pop(e, i * 260)));
      h = hh;
      await Promise.all(runs);
    },
  };
}
