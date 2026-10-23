/**
 * Adegan SVG "garis f dan lingkaran c" soal 16, alur guru (revisi pemilik v1.17; docs/garis_dan_lingkaran.png).
 * f melalui C(−1, 0) dan D(0, 2); lingkaran berpusat A(2, −3) melalui B(3, −1), r = √5.
 *  - cam: kamera memperbesar ke garis f ('f') atau ke lingkaran ('A'); tanpa cam = bidang utuh;
 *  - grad: dari C ke D geser 1 kotak lalu naik 2 kotak (label 1 dan 2 = sumber terbang g-run, g-rise);
 *  - rad: dari A ke B geser 1 lalu naik 2, ruas AB = jari-jari (g-run2, g-rise2);
 *  - sifat: contoh garis singgung di titik paling kiri lingkaran, siku-siku dengan jari-jarinya;
 *  - par: salinan garis f digeser turun sampai melewati pusat A (jari-jari sejajar f);
 *  - go: panah dari A searah f (1: ke T₁, 2: juga arah sebaliknya ke T₂); pts: titik singgung emas T₁ (1) atau keduanya (2);
 *  - tan: dua garis singgung tegak lurus f di T₁(3, −1) dan T₂(1, −5), titik singgung emas;
 *  - miss: "hati-hati" — jarak A ke garis f (≈ 4,02) lebih dari jari-jari, f tidak menyentuh lingkaran;
 *  - cand: satu pilihan diuji: titiknya dan ruas AT; emas bila titik singgung, merah bila bukan.
 * Angka dari docs/pembahasan25.md soal 16 (jarak 9/√5 ≈ 4,02 dari Kesalahan umum). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Cam16 = 'f' | 'A';
export interface Sing16State {
  cam?: Cam16;
  grad?: boolean;
  rad?: boolean;
  sifat?: boolean;
  par?: boolean;
  go?: 0 | 1 | 2;
  /** titik singgung tampil (1: T₁, 2: T₁ dan T₂) */
  pts?: 0 | 1 | 2;
  tan?: boolean;
  miss?: boolean;
  /** pilihan yang sedang diuji (1–5, urut naskah) */
  cand?: number;
  [k: string]: unknown;
}

/** pilihan soal (urut naskah) */
export const CAND16: Array<[number, number]> = [
  [3, 1],
  [1, -5],
  [-1, 5],
  [3, -1],
  [-3, -1],
];
const A: [number, number] = [2, -3];
const R = Math.sqrt(5);
const isTangentPoint = ([x, y]: [number, number]): boolean => {
  const dx = x - A[0];
  const dy = y - A[1];
  return dx * dx + dy * dy === 5 && dy === 2 * dx;
};

const X0 = -4;
const X1 = 7;
const Y0 = -6;
const Y1 = 5.5;
const U = 30;
const PAD = 20;
const VW = (X1 - X0) * U + 2 * PAD;
const VH = (Y1 - Y0) * U + 2 * PAD;
const px = (x: number): number => PAD + (x - X0) * U;
const py = (y: number): number => PAD + (Y1 - y) * U;
const minus = (n: number): string => String(n).replace('-', '−');
const n1 = (v: number): string => v.toFixed(1);

const CAM: Record<Cam16 | 'all', [number, number, number]> = {
  all: [(X0 + X1) / 2, (Y0 + Y1) / 2, 1],
  f: [-0.5, 1, 2.2],
  A: [2.4, -2.4, 1.7],
};
const camT = (k: Cam16 | 'all'): string => {
  if (k === 'all') return 'none';
  const [cx, cy, s] = CAM[k];
  return `translate(${VW / 2 - s * px(cx)}px, ${VH / 2 - s * py(cy)}px) scale(${s})`;
};

/** garis y = m x + c dipotong ke kotak gambar */
function line(m: number, c: number, cls: string): string {
  const xs = [X0, X1];
  const clip = (x: number): [number, number] => {
    const y = m * x + c;
    if (y > Y1) return [(Y1 - c) / m, Y1];
    if (y < Y0) return [(Y0 - c) / m, Y0];
    return [x, y];
  };
  const [a, b] = xs.map(clip) as [[number, number], [number, number]];
  return `<line class="${cls}" x1="${n1(px(a[0]))}" y1="${n1(py(a[1]))}" x2="${n1(px(b[0]))}" y2="${n1(py(b[1]))}"/>`;
}

/** tanda siku di titik P antara arah u dan arah v (satuan), sisi 0,35 satuan */
function rightAngle(P: [number, number], u: [number, number], v: [number, number]): string {
  const s = 0.35;
  const p1 = [P[0] + u[0] * s, P[1] + u[1] * s];
  const p2 = [P[0] + (u[0] + v[0]) * s, P[1] + (u[1] + v[1]) * s];
  const p3 = [P[0] + v[0] * s, P[1] + v[1] * s];
  return `<path class="s16-ra" d="M${n1(px(p1[0]!))} ${n1(py(p1[1]!))}L${n1(px(p2[0]!))} ${n1(py(p2[1]!))}L${n1(px(p3[0]!))} ${n1(py(p3[1]!))}"/>`;
}

function markup(live: boolean): string {
  const src = (n: string): string => (live ? ` data-src="${n}"` : '');
  let grid = '';
  for (let x = X0; x <= X1; x++) {
    grid += `<path class="s16-grid${x === 0 ? ' s16-ax' : ''}" d="M${px(x)} ${py(Y1)}V${py(Y0)}"/>`;
    if (x && x > X0) grid += `<text class="s16-num" x="${px(x)}" y="${py(0) + 14}">${minus(x)}</text>`;
  }
  for (let y = Math.ceil(Y0); y <= Y1; y++) {
    grid += `<path class="s16-grid${y === 0 ? ' s16-ax' : ''}" d="M${px(X0)} ${py(y)}H${px(X1)}"/>`;
    if (y) grid += `<text class="s16-num s16-num-y" x="${px(0) - 6}" y="${py(y) + 4}">${minus(y)}</text>`;
  }
  const T1: [number, number] = [3, -1];
  const T2: [number, number] = [1, -5];
  const u: [number, number] = [1 / R, 2 / R];
  const t: [number, number] = [2 / R, -1 / R];
  const Q: [number, number] = [A[0] - R, A[1]];
  const foot: [number, number] = [-1.6, -1.2];
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Garis f melalui C(−1, 0) dan D(0, 2); lingkaran c berpusat A(2, −3) melalui B(3, −1)"${live ? '' : ' class="n-sketch vis-sing show-tan"'}>
  <g class="s16-cam">
    <g>${grid}</g>
    <circle class="s16-circ" cx="${px(A[0])}" cy="${py(A[1])}" r="${n1(R * U)}"/>
    <text class="s16-lbl" x="${px(0.9)}" y="${py(-1.5)}">c</text>
    ${line(2, 2, 's16-f')}
    <text class="s16-lbl s16-f-t" x="${px(1.55) + 8}" y="${py(5.2)}">f</text>
    <g class="s16-miss">
      <path class="s16-dash" d="M${px(A[0])} ${py(A[1])}L${n1(px(foot[0]))} ${n1(py(foot[1]))}"/>
      ${rightAngle(foot, [2 / R, -1 / R], [1 / R, 2 / R])}
      <text class="s16-tag s16-tag-end" x="${px(-0.3)}" y="${py(-2.55)}">≈ 4,02</text>
    </g>
    <g class="s16-sifat">
      <path class="s16-rline" d="M${px(A[0])} ${py(A[1])}H${n1(px(Q[0]))}"/>
      <path class="s16-tl" d="M${n1(px(Q[0]))} ${py(-0.9)}V${py(-5.1)}"/>
      ${rightAngle(Q, [1, 0], [0, 1])}
      <circle class="s16-pt" cx="${n1(px(Q[0]))}" cy="${py(Q[1])}" r="5"/>
    </g>
    <g class="s16-par">${line(2, -7, 's16-pl')}</g>
    <g class="s16-tan">
      ${line(-0.5, 0.5, 's16-tl')}${line(-0.5, -4.5, 's16-tl')}
      ${rightAngle(T1, [-u[0], -u[1]], t)}${rightAngle(T2, u, t)}
    </g>
    <g class="s16-grad">
      <path class="s16-run" d="M${px(-1)} ${py(0)}H${px(0)}"/>
      <path class="s16-rise" d="M${px(0)} ${py(0)}V${py(2)}"/>
      <text class="s16-step" x="${px(-0.5)}" y="${py(0) + 20}"${src('g-run')}>1</text>
      <text class="s16-step" x="${px(0) + 14}" y="${py(1) + 6}"${src('g-rise')}>2</text>
    </g>
    <g class="s16-rad">
      <path class="s16-run" d="M${px(2)} ${py(-3)}H${px(3)}"/>
      <path class="s16-rise" d="M${px(3)} ${py(-3)}V${py(-1)}"/>
      <text class="s16-step" x="${px(2.5)}" y="${py(-3) + 20}"${src('g-run2')}>1</text>
      <text class="s16-step" x="${px(3) + 14}" y="${py(-2) + 6}"${src('g-rise2')}>2</text>
      <path class="s16-rline" d="M${px(2)} ${py(-3)}L${px(3)} ${py(-1)}"/>
      <text class="s16-tag" x="${px(2.3) - 10}" y="${py(-1.9)}">r</text>
    </g>
    <path class="s16-arrow s16-go1" d="M${px(2)} ${py(-3)}L${px(3)} ${py(-1)}"/>
    <path class="s16-arrow s16-go2" d="M${px(2)} ${py(-3)}L${px(1)} ${py(-5)}"/>
    <g class="s16-cands"></g>
    <circle class="s16-pt" cx="${px(-1)}" cy="${py(0)}" r="5"/><circle class="s16-pt" cx="${px(0)}" cy="${py(2)}" r="5"/>
    <circle class="s16-pt" cx="${px(A[0])}" cy="${py(A[1])}" r="5"/><circle class="s16-pt s16-B" cx="${px(3)}" cy="${py(-1)}" r="5"/>
    <circle class="s16-T s16-T1" cx="${px(T1[0])}" cy="${py(T1[1])}" r="7"/><circle class="s16-T s16-T2" cx="${px(T2[0])}" cy="${py(T2[1])}" r="7"/>
    <text class="s16-lbl s16-Tt" x="${px(T2[0]) - 10}" y="${py(T2[1]) + 20}">(1, −5)</text>
    <text class="s16-lbl s16-lbl-end" x="${px(-1) - 8}" y="${py(0) - 10}"${src('g-C')}>C = (−1, 0)</text>
    <text class="s16-lbl" x="${px(0) + 10}" y="${py(2) + 4}"${src('g-D')}>D = (0, 2)</text>
    <text class="s16-lbl s16-lbl-end" x="${px(A[0]) - 8}" y="${py(A[1]) + 22}"${src('g-A')}>A = (2, −3)</text>
    <text class="s16-lbl" x="${px(3) + 12}" y="${py(-1) + 4}"${src('g-B')}>B = (3, −1)</text>
  </g>
  </svg>`;
}

function candMarkup(i: number): string {
  const c = CAND16[i - 1]!;
  const ok = isTangentPoint(c);
  return `<g class="s16-cand${ok ? ' is-ok' : ''}" data-i="${i}">
    <path class="s16-at" d="M${px(A[0])} ${py(A[1])}L${px(c[0])} ${py(c[1])}"/>
    <circle class="s16-cp" cx="${px(c[0])}" cy="${py(c[1])}" r="7"/>
    <text class="s16-lbl s16-ct" x="${px(c[0]) + 11}" y="${py(c[1]) - 9}">(${minus(c[0])}, ${minus(c[1])})</text></g>`;
}

export function createSing16(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-sing';
  el.innerHTML = markup(true);
  const cam = el.querySelector<SVGGElement>('.s16-cam')!;
  cam.style.transformBox = 'view-box';
  cam.style.transformOrigin = '0 0';
  const candG = el.querySelector<SVGGElement>('.s16-cands')!;
  const parG = el.querySelector<SVGGElement>('.s16-par')!;
  const go1 = el.querySelector<SVGPathElement>('.s16-go1')!;
  const go2 = el.querySelector<SVGPathElement>('.s16-go2')!;
  const grow = (sel: string): SVGElement[] => [...el.querySelectorAll<SVGElement>(sel)];
  let camKey: Cam16 | 'all' = 'all';
  let shown = 0;
  const prev = new Set<string>();

  /** tumbuh dari titik asal (satuan view-box) */
  const growFrom = (e: SVGElement, x: number, y: number, delay: number): Promise<boolean> => {
    e.style.transformBox = 'view-box';
    e.style.transformOrigin = `${x}px ${y}px`;
    return play(
      e,
      [
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 700, delay, easing: EASE_OUT, fill: 'backwards', tag: 'sing' },
    ).finished;
  };
  const fadeIn = (e: Element, delay: number): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'sing',
    }).finished;

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Sing16State;
      const anim = c.dir > 0 && !reducedMotion();
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
          tag: 'sing',
        }).finished;

      const flags: Record<string, boolean> = {
        grad: !!s.grad,
        rad: !!s.rad,
        sifat: !!s.sifat,
        par: !!s.par,
        go1: (s.go ?? 0) >= 1,
        go2: (s.go ?? 0) >= 2,
        pts1: (s.pts ?? 0) >= 1,
        pts2: (s.pts ?? 0) >= 2,
        tan: !!s.tan,
        miss: !!s.miss,
      };
      const fresh = (k: string): boolean => flags[k]! && (!prev.has(k) || c.replay) && anim;
      const runs: Array<Promise<boolean>> = [];
      // segitiga geser–naik: ruas mendatar tumbuh dari kiri, lalu ruas tegak dari bawah, lalu angkanya
      for (const k of ['grad', 'rad'] as const)
        if (fresh(k)) {
          const g = el.querySelector(`.s16-${k}`)!;
          const [run, rise] = [
            g.querySelector<SVGElement>('.s16-run')!,
            g.querySelector<SVGElement>('.s16-rise')!,
          ];
          const [x0, y0] = k === 'grad' ? [px(-1), py(0)] : [px(2), py(-3)];
          runs.push(growFrom(run, x0, y0, 0), growFrom(rise, x0 + U, y0, 600));
          g.querySelectorAll('text, .s16-rline').forEach((e, i) => runs.push(fadeIn(e, 900 + i * 300)));
        }
      if (fresh('par'))
        runs.push(
          play(parG, [{ transform: `translateY(${-9 * U}px)` }, { transform: 'none' }], {
            duration: 1400,
            easing: EASE,
            tag: 'sing',
          }).finished,
        );
      if (fresh('go1')) runs.push(growFrom(go1, px(2), py(-3), 0));
      if (fresh('go2')) runs.push(growFrom(go2, px(2), py(-3), 0));
      if (fresh('tan')) grow('.s16-tan > *').forEach((e, i) => runs.push(fadeIn(e, i * 200)));
      if (fresh('sifat')) grow('.s16-sifat > *').forEach((e, i) => runs.push(fadeIn(e, i * 300)));
      if (fresh('miss')) grow('.s16-miss > *').forEach((e, i) => runs.push(fadeIn(e, i * 400)));
      for (const [k, on] of Object.entries(flags)) {
        el.classList.toggle(`show-${k}`, on);
        if (on) prev.add(k);
        else prev.delete(k);
      }
      const cand = s.cand ?? 0;
      if (cand !== shown || (c.replay && cand)) {
        shown = cand;
        candG.innerHTML = cand ? candMarkup(cand) : '';
        const g = candG.firstElementChild as SVGGElement | null;
        if (g && anim) {
          runs.push(growFrom(g.querySelector<SVGElement>('.s16-at')!, px(A[0]), py(A[1]), 0));
          runs.push(fadeIn(g.querySelector('.s16-cp')!, 500), fadeIn(g.querySelector('.s16-ct')!, 700));
        }
      }
      await Promise.all(runs);
    },
    sketch: () => markup(false),
  };
}
