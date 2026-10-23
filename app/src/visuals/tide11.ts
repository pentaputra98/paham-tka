/**
 * Adegan SVG "kedalaman air laut" soal 11, alur guru (revisi pemilik v1.21; docs/grafik_kedalaman_air_laut.png).
 * Grafik y = 12,3 + 2 cos(πt/6): puncak 14,3 m di t = 0 dan t = 12, lembah 10,3 m di t = 6.
 * Jalur utama memakai logika dari grafik saja:
 *  - pts: puncak (t = 0, 12) dan lembah (t = 6) dilingkari;
 *  - amp: selisih puncak dan garis tengah = 2 (setengah selisih puncak–lembah); mid: garis tengah y = 12,3;
 *  - cam 'low': diperbesar ke lembah; ring: lembah dilingkari jelas dengan label t = 6 (sumber terbang g-t6);
 *  - cam 'half' + half: dari t = 0 ke t = 6 dibagi dua sama panjang (3 jam + 3 jam): garis tengah di t = 3;
 *  - ext: gelombang diteruskan sampai t = 18; zeros: titik pada garis tengah (t = 3, 9, 15); gap: tiap 6 jam;
 *  - walk: titik berjalan menyusuri gelombang sampai kemunculan ke-n, meninggalkan penanda bernomor 1–3
 *    (ke-3 emas, jawaban); warn: hati-hati t = 12 adalah puncak 14,3 m;
 *  - cand: satu pilihan diuji: titik (t, y(t)) dengan garis bantu; emas bila jawaban, merah bila bukan.
 * Cara alternatif dengan rumus (bagian opsional):
 *  - sin: kurva sinus putus-putus pembanding (mulai dari garis tengah) — grafik soal mulai dari puncak, jadi kosinus;
 *  - per: satu gelombang penuh t = 0 → 12 (periode 12 jam);
 *  - lab 'ab': label a = 12,3 dan b = 2 pada garis tengah dan amplitudo;
 *  - alt: contoh angka tidak cantik — kedalaman 13,3 m pertama kali di t = 2 (dari model dokumen).
 * Label puncak dan lembah pada sumbu y menjadi sumber terbang g-max, g-min. Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Cam11 = 'low' | 'half';
export interface Tide11State {
  cam?: Cam11;
  ext?: boolean;
  /** label garis tengah dan amplitudo: 'ask' (?), 'val' (garis tengah, 2), 'ab' (a = 12,3, b = 2) */
  lab?: 'ask' | 'val' | 'ab';
  pts?: boolean;
  mid?: boolean;
  amp?: boolean;
  ring?: boolean;
  half?: boolean;
  zeros?: boolean;
  gap?: boolean;
  walk?: 0 | 1 | 2 | 3;
  warn?: boolean;
  sin?: boolean;
  per?: boolean;
  alt?: boolean;
  /** waktu pilihan yang diuji (jam) */
  cand?: number;
  [k: string]: unknown;
}

/** model dari docs: a = 12,3; b = 2 */
export const depth = (t: number): number => 12.3 + 2 * Math.cos((Math.PI * t) / 6);
const T1 = 18;
const Y0 = 9.4;
const Y1 = 15.3;
const VW = 640;
const VH = 340;
const L = 70;
const R = 24;
const TOP = 18;
const BOT = 46;
const px = (t: number): number => L + (t / T1) * (VW - L - R);
const py = (y: number): number => TOP + ((Y1 - y) / (Y1 - Y0)) * (VH - TOP - BOT);
const f1 = (v: number): string => v.toFixed(1);
const dec = (v: number): string => v.toFixed(1).replace('.', ',');
const ZEROS = [3, 9, 15];

const CAM: Record<Cam11, [number, number, number]> = {
  low: [6, 11.2, 2],
  half: [3, 11.9, 1.7],
};
const camT = (k: Cam11 | 'all'): string => {
  if (k === 'all') return 'none';
  const [ct, cy, s] = CAM[k];
  return `translate(${f1(VW / 2 - s * px(ct))}px, ${f1(VH / 2 - s * py(cy))}px) scale(${s})`;
};

function curve(f: (t: number) => number, t0: number, t1: number): string {
  let d = '';
  for (let t = t0; t <= t1 + 1e-9; t += 0.1) d += `${d ? 'L' : 'M'}${f1(px(t))} ${f1(py(f(t)))}`;
  return d;
}

function markup(): string {
  let ticks = '';
  for (const t of [3, 6, 9, 12, 15, 18])
    ticks += `<text class="t11-num${t > 12 ? ' t11-x' : ''}" x="${f1(px(t))}" y="${f1(py(Y0) + 18)}">${t}</text>`;
  const guide = (t: number, y: number): string =>
    `<path class="t11-guide" d="M${f1(px(0))} ${f1(py(y))}H${f1(px(t))}V${f1(py(Y0))}"/>`;
  const sinus = (t: number): number => 12.3 + 2 * Math.sin((Math.PI * t) / 6);
  const yb = py(Y0) - 14;
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Grafik kedalaman air laut y = a + b cos(πt/6): puncak 14,3 meter di t = 0 dan t = 12, lembah 10,3 meter di t = 6">
  <g class="t11-cam">
  <path class="t11-ax" d="M${px(0)} ${f1(py(Y1))}V${f1(py(Y0))}H${f1(px(T1) + 8)}"/>
  <path class="t11-brk" d="M${px(0) - 6} ${f1(py(Y0) - 14)}l12 -6M${px(0) - 6} ${f1(py(Y0) - 8)}l12 -6"/>
  <text class="t11-axl" x="${px(0) - 6}" y="${f1(py(Y1) - 4)}">y</text>
  <text class="t11-axl" x="${f1(px(T1) + 10)}" y="${f1(py(Y0) + 4)}">t</text>
  ${ticks}
  ${guide(12, 14.3)}${guide(6, 10.3)}
  <text class="t11-yl" x="${px(0) - 8}" y="${f1(py(14.3) + 5)}" data-src="g-max">14,3</text>
  <text class="t11-yl" x="${px(0) - 8}" y="${f1(py(10.3) + 5)}" data-src="g-min">10,3</text>
  <g class="t11-mid">
    <path class="t11-midl" d="M${px(0)} ${f1(py(12.3))}H${f1(px(T1))}"/>
    <text class="t11-yl" x="${px(0) - 8}" y="${f1(py(12.3) + 5)}">12,3</text>
    <text class="t11-tag t11-a" x="${f1(px(T1))}" y="${f1(py(12.3) - 8)}"></text>
  </g>
  <g class="t11-amp">
    <path class="t11-arrow" d="M${f1(px(0.25))} ${f1(py(12.3))}V${f1(py(14.3))}"/>
    <text class="t11-tag t11-b" x="${f1(px(0.25) + 10)}" y="${f1(py(13.3) + 5)}"></text>
  </g>
  <g class="t11-per">
    <path class="t11-span" d="M${f1(px(0))} ${f1(py(14.95))}H${f1(px(12))}"/>
    <text class="t11-tag t11-tag-mid" x="${f1(px(6))}" y="${f1(py(14.95) - 8)}">1 gelombang = 12 jam</text>
  </g>
  <g class="t11-sin">
    <path class="t11-sinc" d="${curve(sinus, 0, 12.6)}"/>
    <text class="t11-tag" x="${f1(px(0.4))}" y="${f1(py(12.3) + 20)}">sin: mulai dari tengah</text>
    <text class="t11-tag t11-cos" x="${f1(px(0.4))}" y="${f1(py(14.3) - 12)}">cos: mulai dari puncak</text>
  </g>
  <path class="t11-curve" d="${curve(depth, 0, 12.6)}"/>
  <path class="t11-curve t11-ext" d="${curve(depth, 12.6, T1)}"/>
  <g class="t11-pts">${[0, 12].map((t) => `<circle class="t11-pk" cx="${f1(px(t))}" cy="${f1(py(14.3))}" r="9"/>`).join('')}<circle class="t11-pk" cx="${f1(px(6))}" cy="${f1(py(10.3))}" r="9"/></g>
  <g class="t11-ring">
    <circle class="t11-rg" cx="${f1(px(6))}" cy="${f1(py(10.3))}" r="14"/>
    <circle class="t11-rg" cx="${f1(px(6))}" cy="${f1(py(Y0))}" r="12"/>
    <text class="t11-tag t11-tag-mid" x="${f1(px(6))}" y="${f1(py(10.3) - 22)}">lembah</text>
    <text class="t11-tag" x="${f1(px(6) + 18)}" y="${f1(py(Y0) - 10)}" data-src="g-t6">t = 6</text>
  </g>
  <g class="t11-half">
    <path class="t11-span" d="M${f1(px(0))} ${f1(yb)}H${f1(px(3))}"/>
    <path class="t11-span t11-span2" d="M${f1(px(3))} ${f1(yb)}H${f1(px(6))}"/>
    <text class="t11-tag t11-tag-mid" x="${f1(px(1.5))}" y="${f1(yb - 8)}">3 jam</text>
    <text class="t11-tag t11-tag-mid" x="${f1(px(4.5))}" y="${f1(yb - 8)}">3 jam</text>
    <path class="t11-guide" d="M${f1(px(3))} ${f1(py(12.3))}V${f1(py(Y0))}"/>
    <circle class="t11-z" cx="${f1(px(3))}" cy="${f1(py(12.3))}" r="6"/>
  </g>
  <g class="t11-zeros">${ZEROS.map((t) => `<circle class="t11-z${t > 12 ? ' t11-x' : ''}" cx="${f1(px(t))}" cy="${f1(py(12.3))}" r="5"/>`).join('')}</g>
  <g class="t11-gap">
    <path class="t11-span" d="M${f1(px(3))} ${f1(py(11.3))}H${f1(px(9))}"/>
    <text class="t11-tag t11-tag-mid" x="${f1(px(6))}" y="${f1(py(11.3) - 8)}">6 jam</text>
    <path class="t11-span t11-x" d="M${f1(px(9))} ${f1(py(13.3))}H${f1(px(15))}"/>
    <text class="t11-tag t11-tag-mid t11-x" x="${f1(px(12))}" y="${f1(py(13.3) - 8)}">6 jam</text>
  </g>
  <g class="t11-warn">
    <circle class="t11-wp" cx="${f1(px(12))}" cy="${f1(py(14.3))}" r="8"/>
    <text class="t11-tag t11-wt" x="${f1(px(12))}" y="${f1(py(14.3) - 14)}">t = 12 → 14,3 m</text>
  </g>
  <g class="t11-alt">
    <path class="t11-guide" d="M${f1(px(0))} ${f1(py(13.3))}H${f1(px(T1))}"/>
    <path class="t11-guide" d="M${f1(px(2))} ${f1(py(13.3))}V${f1(py(Y0))}"/>
    <circle class="t11-ap" cx="${f1(px(2))}" cy="${f1(py(13.3))}" r="7"/>
    <text class="t11-tag" x="${f1(px(2) + 10)}" y="${f1(py(13.3) - 10)}">t = 2 → 13,3 m</text>
  </g>
  <circle class="t11-dot" cx="${f1(px(0))}" cy="${f1(py(depth(0)))}" r="7"/>
  <g class="t11-marks">${ZEROS.map((t, i) => `<g class="t11-mk${i === 2 ? ' is-ans' : ''}" data-n="${i + 1}"><circle cx="${f1(px(t))}" cy="${f1(py(12.3))}" r="9"/><text x="${f1(px(t))}" y="${f1(py(12.3) + 4)}">${i + 1}</text></g>`).join('')}</g>
  <g class="t11-cands"></g>
  </g>
  </svg>`;
}

function candMarkup(t: number): string {
  const y = depth(t);
  const ok = t === 15;
  const [x0, y0] = [px(t), py(y)];
  return `<g class="t11-cand${ok ? ' is-ok' : ''}">
    <path class="t11-cg" d="M${f1(x0)} ${f1(py(Y0))}V${f1(y0)}H${px(0)}"/>
    <circle class="t11-cp" cx="${f1(x0)}" cy="${f1(y0)}" r="7"/>
    <text class="t11-tag t11-ct${t > 9 ? ' t11-ct-l' : ''}" x="${f1(t > 9 ? x0 - 10 : x0 + 10)}" y="${f1(y0 - 10)}">t = ${t} → ${dec(y)} m</text></g>`;
}

const LABELS: Record<'ask' | 'val' | 'ab', [string, string]> = {
  ask: ['garis tengah = ?', '?'],
  val: ['garis tengah', '2'],
  ab: ['a = 12,3', 'b = 2'],
};

export function createTide11(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-tide';
  el.innerHTML = markup();
  const cam = el.querySelector<SVGGElement>('.t11-cam')!;
  cam.style.transformBox = 'view-box';
  cam.style.transformOrigin = '0 0';
  const dot = el.querySelector<SVGCircleElement>('.t11-dot')!;
  const marks = [...el.querySelectorAll<SVGGElement>('.t11-mk')];
  const candG = el.querySelector<SVGGElement>('.t11-cands')!;
  const aT = el.querySelector<SVGTextElement>('.t11-a')!;
  const bT = el.querySelector<SVGTextElement>('.t11-b')!;
  const prev = new Set<string>();
  let camKey: Cam11 | 'all' = 'all';
  let walked = 0;
  let shown = 0;

  /** posisi titik berjalan pada waktu t, relatif terhadap posisi awalnya (t = 0) */
  const at = (t: number): string => `translate(${f1(px(t) - px(0))}px, ${f1(py(depth(t)) - py(depth(0)))}px)`;
  const fadeIn = (e: Element, delay: number): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'tide',
    }).finished;

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Tide11State;
      const anim = c.dir > 0 && !reducedMotion();
      // kamera dulu: perbesar ke lembah atau ke separuh pertama gelombang
      const next = s.cam ?? 'all';
      const fromT = camT(camKey);
      const toT = camT(next);
      const moved = next !== camKey;
      camKey = next;
      el.classList.toggle('is-zoom', next !== 'all');
      cam.style.transform = toT;
      if (moved && anim)
        await play(cam, [{ transform: fromT }, { transform: toT }], {
          duration: 1100,
          easing: EASE,
          tag: 'tide',
        }).finished;

      const flags: Record<string, boolean> = {
        ext: !!s.ext,
        pts: !!s.pts,
        mid: !!s.mid,
        amp: !!s.amp,
        ring: !!s.ring,
        half: !!s.half,
        zeros: !!s.zeros,
        gap: !!s.gap,
        warn: !!s.warn,
        sin: !!s.sin,
        per: !!s.per,
        alt: !!s.alt,
      };
      const fresh = (k: string): boolean => flags[k]! && (!prev.has(k) || c.replay) && anim;
      const runs: Array<Promise<boolean>> = [];
      for (const k of Object.keys(flags))
        if (fresh(k))
          el.querySelectorAll(k === 'ext' ? '.t11-ext, .t11-num.t11-x' : `.t11-${k} > *`).forEach((e, i) =>
            runs.push(fadeIn(e, i * 250)),
          );
      for (const [k, on] of Object.entries(flags)) {
        el.classList.toggle(`show-${k}`, on);
        if (on) prev.add(k);
        else prev.delete(k);
      }
      const [aL, bL] = LABELS[s.lab ?? 'val'];
      // saat titik berjalan atau menguji pilihan, label garis tengah disembunyikan agar tidak menimpa penanda
      aT.textContent = s.cand || s.walk ? '' : aL;
      bT.textContent = bL;

      // titik berjalan menyusuri gelombang; penanda bernomor muncul saat titik melewati garis tengah
      const n = s.walk ?? 0;
      const target = n ? ZEROS[n - 1]! : 0;
      dot.style.transformBox = 'view-box';
      dot.style.transform = at(target);
      el.classList.toggle('show-dot', n > 0);
      marks.forEach((m, i) => m.classList.toggle('on', i < n));
      if (n > 0 && anim && (n !== walked || c.replay)) {
        const from = c.replay || n < walked ? 0 : walked ? ZEROS[walked - 1]! : 0;
        const frames: Keyframe[] = [];
        for (let t = from; t <= target + 1e-9; t += 0.25) frames.push({ transform: at(t) });
        frames.push({ transform: at(target) });
        const ms = Math.max(700, (target - from) * 220);
        runs.push(play(dot, frames, { duration: ms, easing: 'linear', tag: 'tide' }).finished);
        marks.forEach((m, i) => {
          if (i >= n || (i < walked && !c.replay)) return;
          const delay = ((ZEROS[i]! - from) / Math.max(1e-9, target - from)) * ms;
          m.style.transformBox = 'fill-box';
          m.style.transformOrigin = 'center';
          runs.push(
            play(
              m,
              [
                { transform: 'scale(0)', opacity: 0 },
                { transform: 'none', opacity: 1 },
              ],
              { duration: 450, delay, easing: EASE_OUT, fill: 'backwards', tag: 'tide' },
            ).finished,
          );
        });
      }
      walked = n;

      const cand = s.cand ?? 0;
      if (cand !== shown || (c.replay && cand)) {
        shown = cand;
        candG.innerHTML = cand ? candMarkup(cand) : '';
        const g = candG.firstElementChild;
        if (g && anim) g.querySelectorAll('*').forEach((e, i) => runs.push(fadeIn(e, i * 250)));
      }
      await Promise.all(runs);
    },
  };
}
