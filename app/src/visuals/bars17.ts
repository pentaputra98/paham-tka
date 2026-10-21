/**
 * Adegan SVG "batang pembanding cat" soal 17 (alur guru, revisi pemilik v1.9).
 * Banyak cat sebanding dengan luas, jadi tiap kuantitas digambar sebagai batang (panjang ∝ luas, cm²).
 * Baris atas: cat hitam (640,56) dengan garis putus-putus "batas hitam" di ujungnya; half membelah batang
 * hitam menjadi dua bagian 320,28. Baris bawah: pilihan n = dua batang ditumpuk (mis. ½ hitam + biru);
 * ujungnya melewati batas → lebih banyak dari hitam, tidak sampai → kurang.
 * cmp (cara cepat pilihan 1–3): setengah hitam ada di kedua baris, jadi yang dibandingkan cukup warna kedua
 * dengan setengah hitam yang kedua.
 * Angka dari docs/pembahasan25.md soal 17 (π = 3,14). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

type Seg = 'half' | 'blue' | 'red' | 'white';
export interface BarsState {
  /** batang hitam dibelah dua (½ hitam = 320,28) */
  half?: boolean;
  /** pilihan 1–5 yang ditumpuk di baris bawah (0 = belum ada) */
  opt?: number;
  /** sorot pembanding cara cepat (warna kedua vs setengah hitam kedua) */
  cmp?: boolean;
  [k: string]: unknown;
}

const VW = 620;
const VH = 320;
const X = 120;
const H = 46;
const Y1 = 58;
const Y2 = 186;
const KX = 390 / 730;
const BLACK = 640.56;
const XL = X + BLACK * KX;
const NUM: Record<Seg, number> = { half: 320.28, blue: 344, red: 384, white: 231.44 };
const TXT: Record<Seg, string> = { half: '320,28', blue: '344', red: '384', white: '231,44' };
const NAME: Record<Seg, string> = { half: '½ hitam', blue: 'biru', red: 'merah', white: 'putih' };
const OPT: Record<number, [Seg, Seg, string]> = {
  1: ['half', 'blue', '664,28'],
  2: ['half', 'red', '704,28'],
  3: ['half', 'white', '551,72'],
  4: ['blue', 'white', '575,44'],
  5: ['blue', 'red', '728'],
};

const rect = (cls: string, x: number, y: number, w: number, h = H): string =>
  `<rect class="${cls}" x="${x}" y="${y}" width="${Math.max(0, w)}" height="${h}" rx="3"/>`;
const text = (cls: string, x: number, y: number, s: string, anchor = 'middle'): string =>
  `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle">${s}</text>`;

/** angka di atas batang putih memakai tinta gelap */
const numCls = (s: Seg): string => (s === 'white' ? 'br-num br-num-ink' : 'br-num');

function optMarkup(n: number): string {
  const [a, b, total] = OPT[n]!;
  const wa = NUM[a] * KX;
  const wb = NUM[b] * KX;
  const end = X + wa + wb;
  const more = end > XL;
  const diff = more
    ? rect('br-diff more', XL, Y2 - 6, end - XL, H + 12)
    : rect('br-diff less', end, Y2 - 6, XL - end, H + 12);
  return `${text('br-name', X - 12, Y2 + H / 2, `pilihan ${n}`, 'end')}
  <g data-seg="a">${rect(`br-seg br-${a}`, X, Y2, wa)}${text(numCls(a), X + wa / 2, Y2 + H / 2, TXT[a])}</g>
  <g data-seg="b">${rect(`br-seg br-${b}`, X + wa, Y2, wb)}${text(numCls(b), X + wa + wb / 2, Y2 + H / 2, TXT[b])}
    ${rect('br-cmp', X + wa - 2, Y2 - 3, wb + 4, H + 6)}</g>
  <g data-seg="c">${text('br-name', X + wa / 2, Y2 + H + 18, NAME[a])}${text('br-name', X + wa + wb / 2, Y2 + H + 18, NAME[b])}
    ${text('br-total', Math.max(end, XL) + 10, Y2 + H / 2, `= ${total}`, 'start')}${diff}
    ${text('br-verdict', X, Y2 + H + 52, `${total} ${more ? '&gt;' : '&lt;'} 640,56 · ${more ? 'lebih banyak dari' : 'kurang dari'} cat hitam`, 'start')}</g>`;
}

export function createBars(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-bars';
  const xh = X + NUM.half * KX;
  el.innerHTML = `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Batang pembanding banyak cat: cat hitam dan gabungan dua cat pada pilihan">
    ${text('br-name', X - 12, Y1 + H / 2, 'hitam', 'end')}
    ${rect('br-seg br-black', X, Y1, BLACK * KX)}
    <line class="br-tick" x1="${xh}" y1="${Y1 - 4}" x2="${xh}" y2="${Y1 + H + 4}"/>
    ${text('br-num', XL - 34, Y1 + H / 2, '640,56')}
    ${text('br-num br-half-lbl', X + (xh - X) / 2, Y1 + H + 16, '320,28')}
    ${text('br-num br-half-lbl', xh + (XL - xh) / 2, Y1 + H + 16, '320,28')}
    ${rect('br-cmp', xh, Y1 - 3, XL - xh, H + 6)}
    <line class="br-limit" x1="${XL}" y1="${Y1 - 22}" x2="${XL}" y2="${Y2 + H + 26}"/>
    ${text('br-limit-lbl', XL, Y1 - 32, 'batas cat hitam')}
    <g class="br-opt"></g></svg>`;
  const optG = el.querySelector<SVGGElement>('.br-opt')!;
  let shown = 0;

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as BarsState;
      el.classList.toggle('show-half', !!s.half);
      el.classList.toggle('show-cmp', !!s.cmp);
      const n = s.opt ?? 0;
      if (n === shown && !(c.replay && n)) return;
      shown = n;
      optG.innerHTML = n ? optMarkup(n) : '';
      if (!n || c.dir < 0 || reducedMotion()) return;
      // tumpuk: batang pertama tumbuh dari kiri, lalu batang kedua, lalu jumlah dan perbandingannya
      const grow = (sel: string, delay: number): Promise<boolean> => {
        const g = optG.querySelector<SVGGElement>(sel)!;
        g.style.transformBox = 'fill-box';
        g.style.transformOrigin = 'left center';
        return play(g, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
          duration: 700,
          delay,
          easing: EASE_OUT,
          fill: 'backwards',
          tag: 'bars',
        }).finished;
      };
      const c1 = optG.querySelector<SVGGElement>('[data-seg="c"]')!;
      await Promise.all([
        grow('[data-seg="a"]', 0),
        grow('[data-seg="b"]', 750),
        play(c1, [{ opacity: 0 }, { opacity: 1 }], {
          duration: 500,
          delay: 1500,
          fill: 'backwards',
          tag: 'bars',
        }).finished,
      ]);
    },
  };
}
