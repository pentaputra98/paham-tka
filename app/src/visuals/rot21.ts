/**
 * Adegan "rotasi garis berpusat (2, 0)" soal 21 (v1.54). Bidang koordinat x −4..7, y −4..4, pusat rotasi P(2, 0).
 * State (boleh digabung):
 *  - r: aturan lewat satu titik; 1 = titik A(4, −3) pada garis awal dan lengan P→A (selisih (2, −3));
 *    2 = lengan diputar 90° berlawanan arah jarum jam mengelilingi P, A mendarat di A′(5, 2) (selisih (3, 2)).
 *  - g0: garis awal 3x + 2y = 6 (putih). rot: salinan garis awal berputar 90° mengelilingi P menjadi garis
 *    l: 2x − 3y = 4 (biru langit).
 *  - n: banyak titik pilihan yang sudah diuji pada l; di l emas (jawaban), di luar l merah.
 *  - two: cara dua titik (opsional); (0, 3) berputar menjadi (−1, −2), (2, 0) tetap karena pusat rotasi.
 *  - gen: label umum, titik (x, y), pusat (a, b), selisih (x − a, y − b) menjadi (−(y − b), x − a), bayangan (x′, y′).
 * Angka dari docs/pembahasan25.md soal 21 (a1–c5, Pemeriksaan hasil). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Rot21State {
  r?: number;
  g0?: boolean;
  rot?: boolean;
  n?: number;
  two?: boolean;
  /** label umum (x, y), (a, b) untuk menjelaskan asal rumus cepat */
  gen?: boolean;
  [k: string]: unknown;
}

const U = 34;
const VW = 440;
const VH = 330;
const OX = 166;
const OY = 168;
const px = (x: number): number => OX + x * U;
const py = (y: number): number => OY - y * U;
const XR: [number, number] = [-4, 7];
const YR: [number, number] = [-4, 4];

/** ruas garis Ax + By = C, diperpanjang agar tetap menutup jendela setelah diputar */
function seg(A: number, B: number, C: number, ext = 6): string {
  const n = Math.hypot(A, B);
  // titik terdekat ke pusat jendela, lalu arah garis
  const cx = 1.5;
  const cy = 0;
  const d = (A * cx + B * cy - C) / (n * n);
  const fx = cx - A * d;
  const fy = cy - B * d;
  const ux = -B / n;
  const uy = A / n;
  return `M${px(fx - ux * ext * 2)} ${py(fy - uy * ext * 2)}L${px(fx + ux * ext * 2)} ${py(fy + uy * ext * 2)}`;
}

/** titik pilihan dari soal: [x, y, di l?] */
const OPTS: Array<[number, number, boolean]> = [
  [-3, -2, false],
  [-2, -1, false],
  [1, 2, false],
  [2, 0, true],
  [5, 2, true],
];

function markup(sketch: boolean): string {
  const g: string[] = [];
  for (let x = XR[0]; x <= XR[1]; x++)
    g.push(`<path class="r21-g${x === 0 ? ' r21-ax' : ''}" d="M${px(x)} ${py(YR[0])}V${py(YR[1])}"/>`);
  for (let y = YR[0]; y <= YR[1]; y++)
    g.push(`<path class="r21-g${y === 0 ? ' r21-ax' : ''}" d="M${px(XR[0])} ${py(y)}H${px(XR[1])}"/>`);
  const tk = [-2, 2, 4, 6]
    .map((x) => `<text class="r21-tk" x="${px(x)}" y="${py(0) + 16}" text-anchor="middle">${x}</text>`)
    .join('');
  const ty = [-2, 2]
    .map((y) => `<text class="r21-tk" x="${px(0) - 6}" y="${py(y) + 4}" text-anchor="end">${y}</text>`)
    .join('');
  const opts = OPTS.map(
    ([x, y, ok], i) =>
      `<g class="r21-op${ok ? ' is-ok' : ''}" data-i="${i}"><circle cx="${px(x)}" cy="${py(y)}" r="6"/><text x="${px(x) + (i === 3 ? -24 : 9)}" y="${py(y) + (i === 3 ? 36 : -9)}">(${x}, ${y})</text></g>`,
  ).join('');
  const dot = (x: number, y: number): string => `<circle cx="${px(x)}" cy="${py(y)}" r="6"/>`;
  return `<svg class="r21-svg${sketch ? ' n-sketch is-all' : ''}" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Garis 3x + 2y = 6 diputar 90° berlawanan arah jarum jam mengelilingi (2, 0) menjadi garis l: 2x − 3y = 4; titik (2, 0) dan (5, 2) terletak pada l">
  <defs><clipPath id="rot-clip"><rect x="${px(XR[0])}" y="${py(YR[1])}" width="${(XR[1] - XR[0]) * U}" height="${(YR[1] - YR[0]) * U}"/></clipPath></defs>
  ${g.join('')}${tk}${ty}
  <g clip-path="url(#rot-clip)">
    <path class="r21-l0" d="${seg(3, 2, 6)}"/>
    <path class="r21-l1" d="${seg(2, -3, 4)}"/>
    <path class="r21-l0r" d="${seg(3, 2, 6)}"/>
  </g>
  <text class="r21-n0" x="${px(4.7)}" y="${py(-3.5)}">3x + 2y = 6</text>
  <text class="r21-n1" x="${px(4.4)}" y="${py(3.2)}">l: 2x − 3y = 4</text>
  <path class="r21-arc" d="M${px(4)} ${py(-3)}A${Math.sqrt(13) * U} ${Math.sqrt(13) * U} 0 0 0 ${px(5)} ${py(2)}"/>
  <g class="r21-arm0"><path d="M${px(2)} ${py(0)}L${px(4)} ${py(-3)}"/>${dot(4, -3)}<text x="${px(4) + 9}" y="${py(-3) + 5}"><tspan class="r21-cv">A (4, −3)</tspan><tspan class="r21-gv">(x, y)</tspan></text></g>
  <g class="r21-arm"><path d="M${px(2)} ${py(0)}L${px(4)} ${py(-3)}"/>${dot(4, -3)}</g>
  <text class="r21-v0" x="${px(3.1)}" y="${py(-1.7)}"><tspan class="r21-cv">(2, −3)</tspan><tspan class="r21-gv">(x − a, y − b)</tspan></text>
  <text class="r21-v1" x="${px(3.4)}" y="${py(2.5)}" text-anchor="end"><tspan class="r21-cv">(3, 2)</tspan><tspan class="r21-gv">(−(y − b), x − a)</tspan></text>
  <text class="r21-a1" x="${px(5) + 9}" y="${py(2) - 8}"><tspan class="r21-cv">A′ (5, 2)</tspan><tspan class="r21-gv">(x′, y′)</tspan></text>
  <g class="r21-tw"><g class="r21-twa"><path d="M${px(2)} ${py(0)}L${px(0)} ${py(3)}"/>${dot(0, 3)}</g>
    <g class="r21-tw0">${dot(0, 3)}<text x="${px(0) + 9}" y="${py(3) - 6}">(0, 3)</text></g>
    <text class="r21-tw1" x="${px(-1) - 8}" y="${py(-2) + 20}" text-anchor="end">(−1, −2)</text></g>
  ${opts}
  <g class="r21-P"><circle cx="${px(2)}" cy="${py(0)}" r="7"/><text x="${px(2) + 10}" y="${py(0) - 9}"><tspan class="r21-cv">P (2, 0)</tspan><tspan class="r21-gv">pusat (a, b)</tspan></text></g>
  </svg>`;
}

export function createRot21(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-rot';
  el.innerHTML = markup(false);
  const svg = el.querySelector('svg')!;
  const q = (s: string): SVGElement => svg.querySelector<SVGElement>(s)!;
  let r = 0;
  let g0 = false;
  let rot = false;
  let n = 0;
  let two = false;

  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'rot',
    }).finished;
  const pop = (e: SVGElement, delay = 0): Promise<boolean> => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = 'center';
    return play(
      e,
      [
        { transform: 'scale(0.3)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 450, delay, easing: EASE_OUT, fill: 'backwards', tag: 'rot' },
    ).finished;
  };
  /** putar 90° berlawanan arah jarum jam mengelilingi P (di layar y ke bawah, jadi sudut negatif) */
  const aboutP = (e: SVGElement): void => {
    e.style.transformBox = 'view-box';
    e.style.transformOrigin = `${px(2)}px ${py(0)}px`;
  };
  const spin = (e: SVGElement, delay: number, duration = 1400): Promise<boolean> => {
    aboutP(e);
    return play(e, [{ transform: 'none' }, { transform: 'rotate(-90deg)' }], {
      duration,
      delay,
      easing: EASE,
      fill: 'backwards',
      tag: 'rot',
    }).finished;
  };
  for (const s of ['.r21-arm', '.r21-l0r', '.r21-twa']) aboutP(q(s));

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Rot21State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const rr = s.r ?? 0;
      svg.classList.toggle('r1', rr >= 1);
      svg.classList.toggle('r2', rr >= 2);
      if (anim && rr >= 1 && (r < 1 || c.replay))
        runs.push(fadeIn(q('.r21-arm0')), fadeIn(q('.r21-v0'), 400), pop(q('.r21-P')));
      if (anim && rr >= 2 && (r < 2 || c.replay)) {
        const d = r < 1 || c.replay ? 1000 : 200;
        runs.push(
          fadeIn(q('.r21-arc'), d),
          spin(q('.r21-arm'), d),
          fadeIn(q('.r21-v1'), d + 1300),
          fadeIn(q('.r21-a1'), d + 1300),
        );
      }
      r = rr;

      const gg = !!s.g0;
      svg.classList.toggle('is-g0', gg);
      if (anim && gg && (!g0 || c.replay)) runs.push(fadeIn(q('.r21-l0')), fadeIn(q('.r21-n0'), 300));
      g0 = gg;

      const ro = !!s.rot;
      svg.classList.toggle('is-rot', ro);
      if (anim && ro && (!rot || c.replay))
        runs.push(spin(q('.r21-l0r'), 300, 1800), fadeIn(q('.r21-l1'), 2000), fadeIn(q('.r21-n1'), 2100));
      rot = ro;

      const nn = s.n ?? 0;
      svg.querySelectorAll<SVGGElement>('.r21-op').forEach((o) => {
        const i = Number(o.dataset.i);
        o.classList.toggle('on', i < nn);
        if (anim && i < nn && (i >= n || c.replay)) runs.push(pop(o, (i - (c.replay ? 0 : n)) * 450));
      });
      n = nn;

      svg.classList.toggle('is-gen', !!s.gen);
      const tw = !!s.two;
      svg.classList.toggle('is-two', tw);
      if (anim && tw && (!two || c.replay))
        runs.push(fadeIn(q('.r21-tw0')), spin(q('.r21-twa'), 500), fadeIn(q('.r21-tw1'), 1900));
      two = tw;
      await Promise.all(runs);
    },
    sketch: () => markup(true),
  };
}
