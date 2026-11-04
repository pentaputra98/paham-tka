/**
 * Adegan "modal saham" soal 8 (v1.41): f(x) = x³ − 70x² − 600x + 74.000 (juta rupiah), modal 2.000 juta.
 * Dua tampilan pada panggung yang sama:
 *  - bars: modal yang dibutuhkan tiap pilihan sebagai batang, dibandingkan dengan garis modal 2.000 juta. n = banyak
 *    pilihan yang sudah dihitung (30, 40, 60 unit); cur = pilihan yang sedang dihitung. Batang melewati garis = merah
 *    (tidak mungkin), tepat di garis = emas (mungkin, jawaban "Benar").
 *  - graph: kurva y = f(x) untuk 0 ≤ x ≤ 75 dan garis y = 2.000; titik 30 (merah), 40 dan 60 (emas); band: daerah
 *    40 ≤ x ≤ 60 (kurva di bawah atau pada garis) diwarnai biru langit.
 * Angka dari docs/pembahasan25.md soal 8 (a1–c3, Langkah 2.3). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Saham8State {
  view?: 'bars' | 'graph';
  n?: 0 | 1 | 2 | 3;
  cur?: 0 | 1 | 2 | 3;
  band?: boolean;
  [k: string]: unknown;
}

const f8 = (x: number): number => x ** 3 - 70 * x ** 2 - 600 * x + 74000;
const MODAL = 2000;
const UNITS = [30, 40, 60];
const rp = (v: number): string => v.toLocaleString('id-ID');

// ---- batang (viewBox 640 × 300), skala 0–22.000 juta selebar 440 ----
const BX = 130;
const BW = 440;
const bx = (v: number): number => BX + (v / 22000) * BW;
const BY = [56, 130, 204];
const BH = 46;

function barsMarkup(): string {
  const bars = UNITS.map((u, i) => {
    const v = f8(u);
    const ok = v <= MODAL;
    return `<g class="s8-bar${ok ? ' is-ok' : ''}" data-i="${i + 1}">
      <text class="s8-bl" x="${BX - 14}" y="${BY[i]! + BH / 2 + 7}" text-anchor="end">${u} unit</text>
      <rect class="s8-br" x="${BX}" y="${BY[i]}" width="${bx(v) - BX}" height="${BH}" rx="6"/>
      <text class="s8-bv" x="${bx(v) + 10}" y="${BY[i]! + BH / 2 - 2}">${rp(v)}</text>
      <text class="s8-bt" x="${bx(v) + 10}" y="${BY[i]! + BH / 2 + 18}">${ok ? 'mungkin' : 'tidak mungkin'}</text></g>`;
  }).join('');
  return `<svg class="s8-bars" viewBox="0 0 640 300" role="img" aria-label="Modal yang dibutuhkan: 30 unit 20.000 juta, 40 unit 2.000 juta, 60 unit 2.000 juta; modal perusahaan 2.000 juta">
  <path class="s8-ax" d="M${BX} 40V${BY[2]! + BH + 12}"/>
  ${bars}
  <path class="s8-line" d="M${bx(MODAL)} 30V${BY[2]! + BH + 18}"/>
  <text class="s8-lt" x="${bx(MODAL) + 6}" y="26">modal 2.000</text>
  <text class="s8-note" x="${BX}" y="292">juta rupiah</text></svg>`;
}

// ---- grafik (viewBox 640 × 300) ----
const GX0 = 70;
const GX1 = 610;
const GY0 = 270;
const GY1 = 20;
const XMAX = 75;
const YMIN = -10000;
const YMAX = 80000;
const gx = (x: number): number => GX0 + (x / XMAX) * (GX1 - GX0);
const gy = (y: number): number => GY0 - ((y - YMIN) / (YMAX - YMIN)) * (GY0 - GY1);

function graphMarkup(): string {
  const pts: string[] = [];
  for (let i = 0; i <= 150; i++) {
    const x = (XMAX * i) / 150;
    pts.push(`${i ? 'L' : 'M'}${gx(x).toFixed(1)} ${gy(f8(x)).toFixed(1)}`);
  }
  const ticks = [0, 10, 20, 30, 40, 50, 60, 70]
    .map((x) => `<text class="s8-tk" x="${gx(x)}" y="${gy(YMIN) + 18}" text-anchor="middle">${x}</text>`)
    .join('');
  const dots = UNITS.map((u) => {
    const ok = f8(u) <= MODAL;
    return `<g class="s8-dot${ok ? ' is-ok' : ''}"><circle cx="${gx(u)}" cy="${gy(f8(u))}" r="7"/>
      <text x="${gx(u)}" y="${gy(f8(u)) - 14}" text-anchor="middle">${ok ? `${u}` : `${u}, ${rp(f8(u))}`}</text></g>`;
  }).join('');
  return `<svg class="s8-graph" viewBox="0 0 640 300" role="img" aria-label="Grafik f(x) dan garis modal 2.000; kurva di bawah atau pada garis untuk x dari 40 sampai 60">
  <rect class="s8-band" x="${gx(40)}" y="${GY1}" width="${gx(60) - gx(40)}" height="${GY0 - GY1}"/>
  <path class="s8-ax" d="M${GX0} ${gy(YMIN)}H${GX1}M${GX0} ${GY0}V${GY1}"/>
  ${ticks}<text class="s8-tk" x="${GX1}" y="${gy(YMIN) + 34}" text-anchor="end">unit saham</text>
  <path class="s8-line" d="M${GX0} ${gy(MODAL)}H${GX1}"/>
  <text class="s8-lt" x="${GX0 + 6}" y="${gy(MODAL) + 18}">modal 2.000</text>
  <path class="s8-curve" d="${pts.join('')}"/>
  ${dots}</svg>`;
}

export function createSaham8(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-saham';
  el.innerHTML = barsMarkup() + graphMarkup();
  const bars = [...el.querySelectorAll<SVGGElement>('.s8-bar')];
  let view = '';
  let n = 0;
  let band = false;

  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'saham',
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
      { duration: 900, delay, easing: EASE, fill: 'backwards', tag: 'saham' },
    ).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Saham8State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'bars';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(v === 'bars' ? '.s8-bars' : '.s8-graph')!));
        if (anim && v === 'graph') {
          const cv = el.querySelector<SVGPathElement>('.s8-curve')!;
          cv.style.clipPath = 'inset(0 0 0 0)';
          runs.push(
            play(cv, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], {
              duration: 1400,
              easing: EASE,
              fill: 'backwards',
              tag: 'saham',
            }).finished,
          );
          el.querySelectorAll('.s8-dot').forEach((d, i) => runs.push(fadeIn(d, 1200 + i * 250)));
        }
        view = v;
      }

      // batang tumbuh satu per satu menuju (atau melewati) garis modal
      const m = s.n ?? 0;
      const cur = s.cur ?? 0;
      bars.forEach((b, i) => {
        b.classList.toggle('on', i < m);
        b.classList.toggle('is-cur', cur === i + 1);
        if (i < m && anim && v === 'bars' && (i >= n || c.replay)) {
          runs.push(grow(b.querySelector('.s8-br')!), fadeIn(b.querySelector('.s8-bl')!));
          b.querySelectorAll('.s8-bv, .s8-bt').forEach((t, j) => runs.push(fadeIn(t, 900 + j * 250)));
        }
      });
      n = m;

      const wantBand = !!s.band;
      el.classList.toggle('show-band', wantBand);
      if (anim && wantBand && (!band || c.replay)) runs.push(fadeIn(el.querySelector('.s8-band')!, 300));
      band = wantBand;
      await Promise.all(runs);
    },
  };
}
