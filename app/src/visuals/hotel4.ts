/**
 * Adegan "pendapatan tiga hotel" soal 4, alur guru (v1.31; docs/ikon_hotel.png).
 * Tiga tampilan pada panggung yang sama:
 *  - pic: tabel kapasitas dari gambar soal; col 'A' | 'B' | 'C' membingkai kolom hotel itu, price membingkai kolom
 *    harga. Angka sel menjadi sumber terbang (h-a1 … h-c3 per hotel dan tipe kamar, h-p1 … h-p3 harga).
 *  - bars: batang pendapatan per hari (juta rupiah), n = banyak hotel yang sudah dihitung; hl = hotel yang
 *    dibandingkan (biru langit); win = hotel terbesar (emas, jawaban pernyataan 3); diff = selisih dua hotel
 *    (bagian batang yang lebih panjang disorot, berlabel); bad = pernyataan salah (pasangan merah).
 *  - total: batang bertumpuk ketiga hotel (stack 'hotel') atau per tipe kamar (stack 'type', cara cepat), dibandingkan
 *    dengan garis Rp20.000.000.
 * Angka dari docs/pembahasan25.md soal 4. Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Hotel = 'A' | 'B' | 'C';
export interface Hotel4State {
  view?: 'pic' | 'bars' | 'total';
  col?: Hotel;
  price?: boolean;
  n?: 0 | 1 | 2 | 3;
  hl?: Hotel[];
  win?: boolean;
  diff?: Array<[Hotel, Hotel]>;
  bad?: boolean;
  stack?: 'hotel' | 'type';
  [k: string]: unknown;
}

const fig = new URL('../assets/soal/ikon_hotel.png', import.meta.url).href;
const HOTELS: Hotel[] = ['A', 'B', 'C'];
/** pendapatan per hari, juta rupiah (docs) */
const INC: Record<Hotel, number> = { A: 7.35, B: 6.4, C: 7.55 };
const dec = (v: number): string => String(Math.round(v * 100) / 100).replace('.', ',');

// ---- gambar (piksel gambar asli 1178 × 605) ----
const COLX: Record<Hotel | 'P', [number, number]> = {
  A: [450, 152],
  B: [607, 150],
  C: [762, 150],
  P: [920, 234],
};
const ROWY: Array<[number, number]> = [
  [266, 118],
  [388, 114],
  [506, 84],
];

function picMarkup(): string {
  const frames = (['A', 'B', 'C', 'P'] as const)
    .map((k) => {
      const [x, w] = COLX[k];
      return `<rect class="h4-col" data-col="${k}" x="${x}" y="150" width="${w}" height="440" rx="10"/>`;
    })
    .join('');
  const cells = (['A', 'B', 'C', 'P'] as const)
    .map((k) =>
      ROWY.map(([y, h], i) => {
        const [x, w] = COLX[k];
        const cw = k === 'P' ? 196 : 64;
        const src = k === 'P' ? `h-p${i + 1}` : `h-${k.toLowerCase()}${i + 1}`;
        return `<rect class="h4-cell" data-src="${src}" data-col="${k}" x="${x + (w - cw) / 2}" y="${y + h / 2 - 26}" width="${cw}" height="52" rx="8"/>`;
      }).join(''),
    )
    .join('');
  return `<svg class="h4-pic" viewBox="0 0 1178 605" role="img" aria-label="Kapasitas kamar hotel. Standard: A 9, B 6, C 7, Rp150.000. Deluxe: A 6, B 7, C 5, Rp500.000. Suite: A 3, B 2, C 4, Rp1.000.000.">
  <image href="${fig}" x="0" y="0" width="1178" height="605"/>${frames}${cells}</svg>`;
}

// ---- batang pendapatan (viewBox 640 × 300), skala 0–8 juta selebar 440 ----
const BX = 110;
const BW = 440;
const bx = (v: number): number => BX + (v / 8) * BW;
const BY: Record<Hotel, number> = { A: 50, B: 130, C: 210 };
const BH = 50;

function barsMarkup(): string {
  const bars = HOTELS.map(
    (h) => `<g class="h4-bar" data-h="${h}">
    <text class="h4-bl" x="${BX - 14}" y="${BY[h] + BH / 2 + 7}" text-anchor="end">Hotel ${h}</text>
    <rect class="h4-br" x="${BX}" y="${BY[h]}" width="${bx(INC[h]) - BX}" height="${BH}" rx="6"/>
    <text class="h4-bv" x="${bx(INC[h]) + 10}" y="${BY[h] + BH / 2 + 7}">${dec(INC[h])}</text></g>`,
  ).join('');
  return `<svg class="h4-bars" viewBox="0 0 640 300" role="img" aria-label="Pendapatan per hari: Hotel A 7,35 juta, Hotel B 6,4 juta, Hotel C 7,55 juta">
  <path class="h4-ax" d="M${BX} 36V${BY.C + BH + 14}"/>
  ${bars}<g class="h4-diffs"></g>
  <text class="h4-note" x="${BX}" y="294">juta rupiah per hari</text></svg>`;
}

// ---- batang bertumpuk (viewBox 640 × 260), skala 0–24 juta selebar 520 ----
const TX = 60;
const tx = (v: number): number => TX + (v / 24) * 520;
const STACK: Record<'hotel' | 'type', Array<[string, number]>> = {
  hotel: [
    ['A', 7.35],
    ['B', 6.4],
    ['C', 7.55],
  ],
  type: [
    ['Standard', 3.3],
    ['Deluxe', 9],
    ['Suite', 9],
  ],
};

function totalMarkup(): string {
  const seg = (k: 'hotel' | 'type'): string => {
    let at = 0;
    return STACK[k]
      .map(([l, v], i) => {
        const x0 = tx(at);
        at += v;
        const x1 = tx(at);
        return `<g class="h4-seg" data-i="${i}"><rect class="h4-s${i}" x="${x0}" y="90" width="${x1 - x0}" height="64" rx="6"/>
        <text class="h4-sv" x="${(x0 + x1) / 2}" y="129" text-anchor="middle">${dec(v)}</text>
        <text class="h4-sl" x="${(x0 + x1) / 2}" y="176" text-anchor="middle">${l}</text></g>`;
      })
      .join('');
  };
  return `<svg class="h4-total" viewBox="0 0 640 260" role="img" aria-label="Total pendapatan ketiga hotel 21,3 juta, lebih dari 20 juta">
  <g class="h4-stack" data-k="hotel">${seg('hotel')}</g><g class="h4-stack" data-k="type">${seg('type')}</g>
  <path class="h4-brace" d="M${TX} 78V70H${tx(21.3)}V78"/>
  <text class="h4-tt" x="${(TX + tx(21.3)) / 2}" y="60" text-anchor="middle">total 21,3</text>
  <path class="h4-line" d="M${tx(20)} 40V200"/>
  <text class="h4-lt" x="${tx(20)}" y="222" text-anchor="middle">20 juta</text>
  </svg>`;
}

export function createHotel4(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-hotel';
  el.innerHTML = picMarkup() + barsMarkup() + totalMarkup();
  const diffG = el.querySelector<SVGGElement>('.h4-diffs')!;
  let view = '';
  let n = 0;
  let col = '';
  let diffKey = '';
  let stack = '';

  const fadeIn = (e: Element, delay: number): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'hotel',
    }).finished;
  const grow = (e: Element, delay: number): Promise<boolean> => {
    const g = e as SVGElement;
    g.style.transformBox = 'fill-box';
    g.style.transformOrigin = 'left center';
    return play(
      e,
      [
        { transform: 'scaleX(0)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 600, delay, easing: EASE, fill: 'backwards', tag: 'hotel' },
    ).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Hotel4State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'pic';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(`.h4-${v}`)!, 0));
        view = v;
      }

      // gambar: kolom hotel (dan harga) dibingkai
      const k = s.col ?? '';
      el.dataset.col = k;
      el.classList.toggle('show-price', !!s.price);
      if (k && k !== col && anim)
        el.querySelectorAll(`.h4-col[data-col="${k}"], .h4-cell[data-col="${k}"]`).forEach((e, i) =>
          runs.push(fadeIn(e, i * 120)),
        );
      col = k;

      // batang pendapatan
      const m = s.n ?? 0;
      const hl = s.hl ?? [];
      el.querySelectorAll<SVGGElement>('.h4-bar').forEach((g, i) => {
        const h = g.dataset.h as Hotel;
        g.classList.toggle('on', i < m);
        g.classList.toggle('is-hl', hl.includes(h));
        g.classList.toggle('is-win', !!s.win && h === 'C');
        g.classList.toggle('is-bad', !!s.bad && hl.includes(h));
        if (i < m && anim && v === 'bars' && (i >= n || c.replay)) {
          runs.push(grow(g.querySelector('.h4-br')!, 0), fadeIn(g.querySelector('.h4-bv')!, 500));
          runs.push(fadeIn(g.querySelector('.h4-bl')!, 0));
        }
      });
      n = m;
      const d = s.diff ?? [];
      const key = d.map((p) => p.join('')).join();
      if (key !== diffKey || c.replay) {
        diffG.innerHTML = d
          .map(([lo, hi]) => {
            const x0 = bx(INC[lo]);
            const x1 = bx(INC[hi]);
            const y = BY[hi];
            return `<g class="h4-df"><path class="h4-dl" d="M${x0} ${BY[lo] + BH}V${y - 6}"/>
            <rect class="h4-dr" x="${x0}" y="${y}" width="${x1 - x0}" height="${BH}" rx="4"/>
            <text class="h4-dt" x="${x0 - 8}" y="${y - 10}" text-anchor="end">${hi} − ${lo} = ${dec(INC[hi] - INC[lo])}</text></g>`;
          })
          .join('');
        if (anim) diffG.querySelectorAll('.h4-df').forEach((g, i) => runs.push(fadeIn(g, 300 + i * 450)));
        diffKey = key;
      }

      // batang bertumpuk
      const st = s.stack ?? 'hotel';
      el.dataset.stack = st;
      if (v === 'total' && anim && (st !== stack || c.replay))
        el.querySelectorAll(`.h4-stack[data-k="${st}"] .h4-seg`).forEach((g, i) =>
          runs.push(grow(g, i * 450)),
        );
      stack = v === 'total' ? st : '';
      await Promise.all(runs);
    },
  };
}
