/**
 * Adegan "pembagian bersusun" soal 6, alur v1.35: f(x) = x⁴ + ax³ + bx² + x − 6 dibagi x² + x + 1 dengan a dan b
 * dibawa sebagai huruf. Kolom = pangkat x (x⁴ … konstanta), seperti pembagian bilangan bersusun.
 *  - s 1 = pembagi dan yang dibagi; 2 = hasil bagi x², dikali dan dikurangkan; 3 = hasil bagi (a − 1)x;
 *    4 = hasil bagi (b − a), sisa hitungan (2 − b)x + (a − b − 6); 5 = sisa soal 5x − 1 ditulis di bawahnya.
 *  - hl 'x' | 'c': koefisien x atau konstanta pada sisa hitungan dan sisa soal dibingkai berpasangan.
 *  Sisa menjadi sumber terbang (d-rx, d-rc, d-gx, d-gc); hasil bagi d-q1 … d-q3.
 * Angka dari docs/pembahasan25.md soal 6 (Pemeriksaan hasil: pembagian bersusun dan f(ω) = (2 − b)ω + (a − b − 6)).
 * Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Div6State {
  s?: 1 | 2 | 3 | 4 | 5;
  hl?: 'x' | 'c';
  [k: string]: unknown;
}

/** [baris, kolom, isi TeX, tahap, sumber terbang] — kolom 1 pembagi/label, 2 tanda kurang, 3–7 = x⁴ … konstanta */
type Cell = [number, number, string, number, string?];
const CELLS: Cell[] = [
  [1, 5, 'x^2', 2, 'd-q1'],
  [1, 6, '+(a-1)x', 3, 'd-q2'],
  [1, 7, '+(b-a)', 4, 'd-q3'],
  [2, 1, 'x^2+x+1', 1],
  [2, 3, 'x^4', 1],
  [2, 4, '+ax^3', 1],
  [2, 5, '+bx^2', 1],
  [2, 6, '+x', 1],
  [2, 7, '-6', 1],
  [3, 2, '-', 2],
  [3, 3, 'x^4', 2],
  [3, 4, '+x^3', 2],
  [3, 5, '+x^2', 2],
  [4, 4, '(a-1)x^3', 2],
  [4, 5, '+(b-1)x^2', 2],
  [4, 6, '+x', 2],
  [4, 7, '-6', 2],
  [5, 2, '-', 3],
  [5, 4, '(a-1)x^3', 3],
  [5, 5, '+(a-1)x^2', 3],
  [5, 6, '+(a-1)x', 3],
  [6, 5, '(b-a)x^2', 3],
  [6, 6, '+(2-a)x', 3],
  [6, 7, '-6', 3],
  [7, 2, '-', 4],
  [7, 5, '(b-a)x^2', 4],
  [7, 6, '+(b-a)x', 4],
  [7, 7, '+(b-a)', 4],
  [8, 6, '(2-b)x', 4, 'd-rx'],
  [8, 7, '+(a-b-6)', 4, 'd-rc'],
  [9, 6, '5x', 5, 'd-gx'],
  [9, 7, '-1', 5, 'd-gc'],
];
/** garis pengurangan di bawah baris hasil kali: [baris, kolom awal, kolom akhir (eksklusif), tahap] */
const LINES: Array<[number, number, number, number]> = [
  [3, 3, 6, 2],
  [5, 4, 7, 3],
  [7, 5, 8, 4],
];

function markup(): string {
  const cells = CELLS.map(([r, c, t, s, src]) => {
    const pair =
      src === 'd-rx' || src === 'd-gx'
        ? ' data-p="x"'
        : src === 'd-rc' || src === 'd-gc'
          ? ' data-p="c"'
          : '';
    const cls = `d6-c${r === 1 ? ' d6-q' : ''}${r >= 8 ? ' d6-r' : ''}${r === 9 ? ' d6-g' : ''}${c === 1 ? ' d6-p' : ''}`;
    return `<span class="${cls}" data-s="${s}"${src ? ` data-src="${src}"` : ''}${pair} style="grid-area:${r}/${c}"><span class="d6-ring" aria-hidden="true"></span>${tex(t)}</span>`;
  }).join('');
  const lines = LINES.map(
    ([r, c0, c1, s]) =>
      `<span class="d6-ln" data-s="${s}" style="grid-area:${r}/${c0}/${r + 1}/${c1}" aria-hidden="true"></span>`,
  ).join('');
  return `<div class="d6-grid" role="img" aria-label="Pembagian bersusun x⁴ + ax³ + bx² + x − 6 oleh x² + x + 1: hasil bagi x² + (a − 1)x + (b − a), sisa (2 − b)x + (a − b − 6), sama dengan sisa soal 5x − 1">
    <span class="d6-br" data-s="1" style="grid-area:2/2/3/8" aria-hidden="true"></span>${lines}${cells}
    <span class="d6-lb" data-s="4" style="grid-area:8/1/9/3">sisa</span>
    <span class="d6-lb d6-g" data-s="5" style="grid-area:9/1/10/3">soal</span>
  </div>`;
}

export function createDiv6(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-div';
  el.innerHTML = markup();
  const parts = [...el.querySelectorAll<HTMLElement>('[data-s]')];
  let s = 0;
  let hl = '';

  const pop = (e: Element, delay: number): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'left center';
    return play(
      e,
      [
        { transform: 'scale(0.6)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 420, delay, easing: EASE_OUT, fill: 'backwards', tag: 'div' },
    ).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const st = state as Div6State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const want = st.s ?? 1;
      parts.forEach((p) => p.classList.toggle('on', Number(p.dataset.s) <= want));
      // tahap baru muncul baris demi baris; putar ulang = semua tahap dari awal
      const from = c.replay ? 0 : s;
      if (anim && want > from)
        parts
          .filter((p) => Number(p.dataset.s) > from && Number(p.dataset.s) <= want)
          .forEach((p, i) => runs.push(pop(p, i * 140)));
      s = want;

      const h = st.hl ?? '';
      el.dataset.hl = h;
      if (h && anim && (h !== hl || c.replay))
        el.querySelectorAll(`[data-p="${h}"] .d6-ring`).forEach((r, i) => runs.push(pop(r, 200 + i * 250)));
      hl = h;
      await Promise.all(runs);
    },
  };
}
