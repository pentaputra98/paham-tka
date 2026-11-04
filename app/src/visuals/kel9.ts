/**
 * Adegan "populasi kelinci" soal 9 (v1.42): K(t) = 4 · 2^(t/4) ribu ekor.
 * Dua tampilan pada panggung yang sama:
 *  - tab: tabel t = 0, 4, 8, 12, 16, 20 dan K = 4, 8, 16, 32, 64, 128. n = banyak kolom yang sudah dihitung (muncul
 *    satu per satu); arr: panah "× 2" di antara kolom berturutan; hl: kolom yang disorot; x4: busur "× 4 dalam 8 tahun"
 *    dari t = 0 ke t = 8. Nilai K menjadi sumber terbang (k-0 … k-5).
 *  - graph: kurva K(t) untuk 0 ≤ t ≤ 34 dan garis 1 juta = 1.000 ribu; t20: penanda t = 20 (K = 128, jauh di bawah
 *    garis); cross: penanda saat kurva melewati 1.000 ribu (antara 28 dan 32 tahun).
 * Angka dari docs/pembahasan25.md soal 9 (Langkah 2.1–2.3, Pemeriksaan hasil). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Kel9State {
  view?: 'tab' | 'graph';
  n?: number;
  arr?: boolean;
  hl?: number[];
  x4?: boolean;
  t20?: boolean;
  cross?: boolean;
  [k: string]: unknown;
}

const K9 = (t: number): number => 4 * 2 ** (t / 4);
const TS = [0, 4, 8, 12, 16, 20];

function tabMarkup(): string {
  const col = (i: number): string => `${2 + 2 * i} / span 2`;
  const head = `<span class="k9-h" style="grid-area:1/1">${tex('t')}<small>tahun</small></span>
    <span class="k9-h" style="grid-area:2/1">${tex('K')}<small>ribu ekor</small></span>`;
  const cells = TS.map(
    (
      t,
      i,
    ) => `<span class="k9-t" data-i="${i}" style="grid-row:1;grid-column:${col(i)}">${tex(String(t))}</span>
      <span class="k9-k" data-i="${i}" data-src="k-${i}" style="grid-row:2;grid-column:${col(i)}"><span class="k9-ring" aria-hidden="true"></span>${tex(String(K9(t)))}</span>`,
  ).join('');
  const arrows = TS.slice(1)
    .map(
      (_, i) =>
        `<span class="k9-ar" data-i="${i}" style="grid-row:3;grid-column:${3 + 2 * i} / span 2">${tex('\\times2')}</span>`,
    )
    .join('');
  return `<div class="k9-tab" role="img" aria-label="Tabel populasi: t 0, 4, 8, 12, 16, 20 tahun; K 4, 8, 16, 32, 64, 128 ribu ekor; tiap 4 tahun dikali 2">
    ${head}${cells}${arrows}
    <span class="k9-x4" style="grid-row:4;grid-column:3 / span 4">${tex('\\times4')}<small>dalam 8 tahun</small></span>
  </div>`;
}

// ---- grafik (viewBox 640 × 300) ----
const GX0 = 70;
const GX1 = 610;
const GY0 = 262;
const GY1 = 24;
const TMAX = 34;
const KMAX = 1150;
const gx = (t: number): number => GX0 + (t / TMAX) * (GX1 - GX0);
const gy = (k: number): number => GY0 - (k / KMAX) * (GY0 - GY1);
/** t saat K = 1.000: 4 · 2^(t/4) = 1.000 → t = 4 log₂ 250 */
const TC = 4 * Math.log2(250);

function graphMarkup(): string {
  const pts: string[] = [];
  for (let i = 0; i <= 170; i++) {
    const t = (TMAX * i) / 170;
    pts.push(`${i ? 'L' : 'M'}${gx(t).toFixed(1)} ${gy(K9(t)).toFixed(1)}`);
  }
  const ticks = [0, 4, 8, 12, 16, 20, 24, 28, 32]
    .map((t) => `<text class="k9-tk" x="${gx(t)}" y="${GY0 + 18}" text-anchor="middle">${t}</text>`)
    .join('');
  return `<svg class="k9-graph" viewBox="0 0 640 300" role="img" aria-label="Grafik K(t) dan garis 1.000 ribu; pada t = 20 baru 128 ribu, kurva melewati 1.000 ribu antara 28 dan 32 tahun">
  <path class="k9-ax" d="M${GX0} ${GY0}H${GX1}M${GX0} ${GY0}V${GY1}"/>
  ${ticks}<text class="k9-tk" x="${GX1}" y="${GY0 + 34}" text-anchor="end">tahun</text>
  <path class="k9-line" d="M${GX0} ${gy(1000)}H${GX1}"/>
  <text class="k9-lt" x="${GX0 + 6}" y="${gy(1000) - 8}">1 juta = 1.000 ribu</text>
  <path class="k9-curve" d="${pts.join('')}"/>
  <g class="k9-m20"><path class="k9-drop" d="M${gx(20)} ${gy(1000)}V${gy(K9(20))}"/><circle cx="${gx(20)}" cy="${gy(K9(20))}" r="7"/>
    <text x="${gx(20) - 10}" y="${gy(K9(20)) - 12}" text-anchor="end">t = 20, K = 128</text></g>
  <g class="k9-mc"><circle cx="${gx(TC)}" cy="${gy(1000)}" r="7"/>
    <text x="${gx(TC) - 10}" y="${gy(1000) + 22}" text-anchor="end">sekitar 32 tahun</text></g></svg>`;
}

export function createKel9(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-kel';
  el.innerHTML = tabMarkup() + graphMarkup();
  let view = '';
  let n = 0;
  let arr = false;
  let x4 = false;
  let t20 = false;
  let cross = false;

  const pop = (e: Element, delay = 0): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    return play(
      e,
      [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 420, delay, easing: EASE_OUT, fill: 'backwards', tag: 'kel' },
    ).finished;
  };
  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'kel',
    }).finished;

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Kel9State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'tab';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(v === 'tab' ? '.k9-tab' : '.k9-graph')!));
        if (anim && v === 'graph') {
          runs.push(
            play(
              el.querySelector('.k9-curve')!,
              [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
              {
                duration: 1400,
                easing: EASE,
                fill: 'backwards',
                tag: 'kel',
              },
            ).finished,
          );
        }
        view = v;
      }

      // tabel: kolom muncul satu per satu
      const m = s.n ?? 0;
      el.querySelectorAll<HTMLElement>('.k9-t, .k9-k').forEach((e) => {
        const i = Number(e.dataset.i);
        e.classList.toggle('on', i < m);
        if (i < m && anim && v === 'tab' && (i >= n || c.replay))
          runs.push(pop(e, (i - (c.replay ? 0 : n)) * 260 + (e.classList.contains('k9-k') ? 140 : 0)));
      });
      n = m;
      const hl = s.hl ?? [];
      el.querySelectorAll<HTMLElement>('.k9-k').forEach((e) =>
        e.classList.toggle('is-hl', hl.includes(Number(e.dataset.i))),
      );

      const flag = (on: boolean, was: boolean, cls: string, sel: string, gap = 200): boolean => {
        el.classList.toggle(cls, on);
        if (on && anim && (!was || c.replay))
          el.querySelectorAll(sel).forEach((e, i) => runs.push(pop(e, 200 + i * gap)));
        return on;
      };
      arr = flag(!!s.arr, arr, 'show-arr', '.k9-ar', 240);
      x4 = flag(!!s.x4, x4, 'show-x4', '.k9-x4');
      t20 = flag(!!s.t20, t20, 'show-t20', '.k9-m20');
      cross = flag(!!s.cross, cross, 'show-cross', '.k9-mc');
      await Promise.all(runs);
    },
  };
}
