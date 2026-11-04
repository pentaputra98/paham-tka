/**
 * Adegan "eceng gondok" soal 10 (v1.43; docs/grafik_eceng_gondok.png).
 * Tiga tampilan pada panggung yang sama:
 *  - pic: gambar grafik soal; label 10, 70, 490 dibingkai dan menjadi sumber terbang (g0, g1, g2); arr = banyak panah
 *    "× 7" yang tampil (tahun 0 → 1, tahun 1 → 2).
 *  - chain: luas awal 49 dikali 7 tiga kali, 49 → 343 → 2.401 → 16.807; k = banyak perkalian yang sudah tampil.
 *    Hasil akhir menjadi sumber terbang (c-3).
 *  - bars: luas tiap danau setelah 3 tahun (data soal) dibandingkan dengan garis batas 16.807; n = banyak danau yang
 *    sudah dibandingkan; di bawah garis merah (bukan), di atas garis emas (jawaban).
 * Angka dari docs/pembahasan25.md soal 10 (a1–d5, Pemeriksaan hasil). Gerak hanya transform/opacity/clip-path.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Eceng10State {
  view?: 'pic' | 'chain' | 'bars';
  box?: boolean;
  arr?: 0 | 1 | 2;
  k?: 0 | 1 | 2 | 3;
  n?: number;
  [k: string]: unknown;
}

const fig = new URL('../assets/soal/grafik_eceng_gondok.png', import.meta.url).href;
/** label sumbu tegak pada gambar asli 1127 × 635: [sumber, x, y] */
const LBL: Array<[string, number, number]> = [
  ['g0', 112, 437],
  ['g1', 112, 319],
  ['g2', 106, 56],
];

function picMarkup(): string {
  const boxes = LBL.map(
    ([s, x, y]) =>
      `<rect class="e10-box" data-src="${s}" x="${x}" y="${y}" width="${s === 'g2' ? 52 : 40}" height="26" rx="6"/>`,
  ).join('');
  return `<svg class="e10-pic" viewBox="0 0 1127 635" role="img" aria-label="Grafik luas eceng gondok: tahun ke-0 10 m², tahun ke-1 70 m², tahun ke-2 490 m²">
  <image href="${fig}" x="0" y="0" width="1127" height="635"/>${boxes}
  <g class="e10-ar" data-i="1"><path d="M160 446Q250 420 212 340" marker-end="url(#e10-h)"/><text x="232" y="410">× 7</text></g>
  <g class="e10-ar" data-i="2"><path d="M214 326Q330 230 272 80" marker-end="url(#e10-h)"/><text x="300" y="220">× 7</text></g>
  <defs><marker id="e10-h" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs>
  </svg>`;
}

const CHAIN = ['49', '343', '2{.}401', '16{.}807'];
const YEAR = ['awal', 'tahun 1', 'tahun 2', 'tahun 3'];

function chainMarkup(): string {
  const items = CHAIN.map(
    (v, i) =>
      `${i ? `<span class="e10-x" data-i="${i}">${tex('\\xrightarrow{\\times7}')}</span>` : ''}<span class="e10-v" data-i="${i}"${i === 3 ? ' data-src="c-3"' : ''}>${tex(v)}<small>${YEAR[i]}</small></span>`,
  ).join('');
  return `<div class="e10-chain" role="img" aria-label="49 dikali 7 tiga kali: 343, 2.401, 16.807">${items}</div>`;
}

// ---- batang (viewBox 640 × 300), skala 0–19.000 selebar 420 ----
const DANAU: Array<[string, number]> = [
  ['A', 15000],
  ['B', 16500],
  ['C', 17000],
  ['D', 17500],
  ['E', 18000],
];
const LIM = 16807;
const BX = 110;
const bx = (v: number): number => BX + (v / 19000) * 420;
const rp = (v: number): string => v.toLocaleString('id-ID');

function barsMarkup(): string {
  const bars = DANAU.map(([d, v], i) => {
    const y = 34 + i * 48;
    return `<g class="e10-bar${v > LIM ? ' is-ok' : ''}" data-i="${i}">
      <text class="e10-bl" x="${BX - 12}" y="${y + 25}" text-anchor="end">Danau ${d}</text>
      <rect class="e10-br" x="${BX}" y="${y}" width="${bx(v) - BX}" height="36" rx="5"/>
      <text class="e10-bv" x="${bx(v) + 8}" y="${y + 25}">${rp(v)}</text></g>`;
  }).join('');
  return `<svg class="e10-bars" viewBox="0 0 640 300" role="img" aria-label="Luas setelah 3 tahun dibanding batas 16.807: A 15.000 dan B 16.500 di bawah, C 17.000, D 17.500, E 18.000 di atas">
  <path class="e10-ax" d="M${BX} 24V${34 + 5 * 48}"/>
  <path class="e10-line" d="M${bx(LIM)} 18V${34 + 5 * 48 + 4}"/>${bars}
  <text class="e10-lt" x="${bx(LIM)}" y="${34 + 5 * 48 + 22}" text-anchor="middle">batas 16.807</text></svg>`;
}

export function createEceng10(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-eceng';
  el.innerHTML = picMarkup() + chainMarkup() + barsMarkup();
  let view = '';
  let box = false;
  let arr = 0;
  let k = 0;
  let n = 0;
  let chained = false;

  const pop = (e: Element, delay = 0): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    (e as SVGElement).style.transformBox = 'fill-box';
    return play(
      e,
      [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 450, delay, easing: EASE_OUT, fill: 'backwards', tag: 'eceng' },
    ).finished;
  };
  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'eceng',
    }).finished;
  const grow = (e: SVGElement, delay = 0): Promise<boolean> => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = 'left center';
    return play(
      e,
      [
        { transform: 'scaleX(0)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 700, delay, easing: EASE, fill: 'backwards', tag: 'eceng' },
    ).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Eceng10State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'pic';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(`.e10-${v}`)!));
        view = v;
      }

      const b = !!s.box;
      el.classList.toggle('show-box', b);
      if (anim && b && (!box || c.replay))
        el.querySelectorAll('.e10-box').forEach((e, i) => runs.push(pop(e, i * 200)));
      box = b;

      const a = s.arr ?? 0;
      el.querySelectorAll<SVGGElement>('.e10-ar').forEach((g) => {
        const i = Number(g.dataset.i);
        g.classList.toggle('on', i <= a);
        if (i <= a && anim && (i > arr || c.replay)) runs.push(fadeIn(g, (i - 1) * 500));
      });
      arr = a;

      const kk = s.k ?? 0;
      el.querySelectorAll<HTMLElement>('.e10-v, .e10-x').forEach((e) => {
        const i = Number(e.dataset.i);
        e.classList.toggle('on', i <= kk);
        if (i <= kk && anim && v === 'chain' && (i > k || c.replay || (i === 0 && !chained)))
          runs.push(pop(e, i * 420 - (e.classList.contains('e10-x') ? 200 : 0)));
      });
      k = kk;
      if (v === 'chain') chained = true;

      const m = s.n ?? 0;
      el.querySelectorAll<SVGGElement>('.e10-bar').forEach((g) => {
        const i = Number(g.dataset.i);
        g.classList.toggle('on', i < m);
        if (i < m && anim && v === 'bars' && (i >= n || c.replay)) {
          const d = (i - (c.replay ? 0 : n)) * 350;
          runs.push(
            grow(g.querySelector('.e10-br')!, d),
            fadeIn(g.querySelector('.e10-bl')!, d),
            fadeIn(g.querySelector('.e10-bv')!, d + 650),
          );
        }
      });
      n = m;
      await Promise.all(runs);
    },
  };
}
