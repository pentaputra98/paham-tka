/**
 * Adegan SVG "garis f dan lingkaran c" soal 16 (pembahasan25.md soal 16, docs/garis_dan_lingkaran.png).
 * f melalui C(−1, 0) dan D(0, 2); lingkaran berpusat A(2, −3) melalui B(3, −1), r = √5.
 * Tahap: base → grad (segitiga naik 2, geser 1) → radius (AB = √5) → par (jari-jari ∥ f, dua garis singgung ⊥ f)
 * → test (kandidat diuji satu per satu; emas bila titik singgung, merah bila bukan).
 * Label titik menjadi sumber terbang g-A, g-B, g-C, g-D; chip pilihan menjadi o-1…o-5.
 */
import { tex } from '../core/math';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Tan16Stage = 'base' | 'grad' | 'radius' | 'par' | 'test';
export interface Tan16State {
  stage?: Tan16Stage;
  /** pilihan yang sudah diuji (1–5) */
  tested?: number[];
  cur?: number;
  [k: string]: unknown;
}
const ORDER: Tan16Stage[] = ['base', 'grad', 'radius', 'par', 'test'];
/** pilihan soal (urut naskah) */
export const CAND: Array<[number, number]> = [
  [3, 1],
  [1, -5],
  [-1, 5],
  [3, -1],
  [-3, -1],
];
const A: [number, number] = [2, -3];
const R2 = 5;
const isTangentPoint = ([x, y]: [number, number]): boolean => {
  const dx = x - A[0];
  const dy = y - A[1];
  return dx * dx + dy * dy === R2 && dy === 2 * dx;
};

const X0 = -4;
const X1 = 7;
const Y0 = -6;
const Y1 = 3.5;
const U = 34;
const PAD = 22;
const VW = (X1 - X0) * U + 2 * PAD;
const VH = (Y1 - Y0) * U + 2 * PAD;
const px = (x: number): number => PAD + (x - X0) * U;
const py = (y: number): number => PAD + (Y1 - y) * U;
const minus = (n: number): string => String(n).replace('-', '−');
const pt = ([x, y]: [number, number]): string => `(${minus(x)}, ${minus(y)})`;

/** garis y = m x + c dipotong ke kotak gambar */
function line(m: number, c: number, cls: string): string {
  const xs = [X0, X1];
  const ys = xs.map((x) => m * x + c);
  const clip = (i: number): [number, number] => {
    const y = ys[i]!;
    if (y > Y1) return [(Y1 - c) / m, Y1];
    if (y < Y0) return [(Y0 - c) / m, Y0];
    return [xs[i]!, y];
  };
  const [a, b] = [clip(0), clip(1)];
  return `<line class="${cls}" x1="${px(a[0])}" y1="${py(a[1])}" x2="${px(b[0])}" y2="${py(b[1])}"/>`;
}

function rightAngle([x, y]: [number, number]): string {
  // sudut siku antara arah jari-jari (1, 2) dan arah singgung (2, −1), sisi 0,35 satuan
  const s = 0.35 / Math.sqrt(5);
  const sgn = y > A[1] ? -1 : 1; // menghadap ke dalam lingkaran
  const r: [number, number] = [sgn * 1 * s, sgn * 2 * s];
  const t: [number, number] = [2 * s, -1 * s];
  const p1 = [x + r[0], y + r[1]];
  const p2 = [x + r[0] + t[0], y + r[1] + t[1]];
  const p3 = [x + t[0], y + t[1]];
  return `<path class="t16-ra" d="M${px(p1[0]!)} ${py(p1[1]!)} L${px(p2[0]!)} ${py(p2[1]!)} L${px(p3[0]!)} ${py(p3[1]!)}"/>`;
}

function markup(live: boolean): string {
  const src = (n: string): string => (live ? ` data-src="${n}"` : '');
  const grid: string[] = [];
  for (let x = X0; x <= X1; x++)
    grid.push(
      `<line class="t16-grid${x === 0 ? ' t16-ax' : ''}" x1="${px(x)}" y1="${py(Y0)}" x2="${px(x)}" y2="${py(Y1)}"/>`,
      x && x > X0
        ? `<text class="t16-num" x="${px(x)}" y="${py(0) + 14}" text-anchor="middle">${minus(x)}</text>`
        : '',
    );
  for (let y = Math.ceil(Y0); y <= Y1; y++)
    grid.push(
      `<line class="t16-grid${y === 0 ? ' t16-ax' : ''}" x1="${px(X0)}" y1="${py(y)}" x2="${px(X1)}" y2="${py(y)}"/>`,
      y ? `<text class="t16-num" x="${px(0) - 6}" y="${py(y) + 4}" text-anchor="end">${minus(y)}</text>` : '',
    );
  const T1: [number, number] = [3, -1];
  const T2: [number, number] = [1, -5];
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Garis f melalui C(−1, 0) dan D(0, 2); lingkaran berpusat A(2, −3) melalui B(3, −1)"${live ? '' : ' class="n-sketch vis-tan at-base at-grad at-radius at-par"'}>
    ${grid.join('')}
    <circle class="t16-circ" cx="${px(A[0])}" cy="${py(A[1])}" r="${Math.sqrt(R2) * U}"/>
    ${line(2, 2, 't16-f')}
    <text class="t16-lbl t16-f-t" x="${px(0.75) + 10}" y="${py(3.2)}">f</text>
    <path class="t16-rise" d="M${px(-1)} ${py(0)} H${px(0)} V${py(2)}"/>
    <text class="t16-lbl t16-rise-t" x="${px(-0.5)}" y="${py(0) + 16}" text-anchor="middle">1</text>
    <text class="t16-lbl t16-rise-t" x="${px(0) + 6}" y="${py(1)}">2</text>
    <line class="t16-r" x1="${px(A[0])}" y1="${py(A[1])}" x2="${px(3)}" y2="${py(-1)}"/>
    <text class="t16-lbl t16-r-t" x="${px(2.5) + 10}" y="${py(-2)}">√5</text>
    <line class="t16-par" x1="${px(T2[0])}" y1="${py(T2[1])}" x2="${px(T1[0])}" y2="${py(T1[1])}"/>
    ${line(-0.5, 0.5, 't16-tan')}${line(-0.5, -4.5, 't16-tan')}
    ${rightAngle(T1)}${rightAngle(T2)}
    <circle class="t16-T" cx="${px(T1[0])}" cy="${py(T1[1])}" r="6"/>
    <circle class="t16-T" cx="${px(T2[0])}" cy="${py(T2[1])}" r="6"/>
    <text class="t16-lbl t16-T-t" x="${px(T2[0]) - 10}" y="${py(T2[1]) + 18}" text-anchor="end">(1, −5)</text>
    <line class="t16-at"/>
    ${CAND.map((c, i) =>
      c[1] > Y1
        ? // di luar gambar: panah di tepi atas menunjuk ke arah titik
          `<path class="t16-cand t16-off" data-i="${i + 1}" d="M${px(c[0]) - 7} ${py(Y1) + 4} L${px(c[0])} ${py(Y1) - 8} L${px(c[0]) + 7} ${py(Y1) + 4} Z"/>`
        : `<circle class="t16-cand" data-i="${i + 1}" cx="${px(c[0])}" cy="${py(c[1])}" r="6"/>`,
    ).join('')}
    <circle class="t16-pt" cx="${px(-1)}" cy="${py(0)}" r="5"/><circle class="t16-pt" cx="${px(0)}" cy="${py(2)}" r="5"/>
    <circle class="t16-pt" cx="${px(A[0])}" cy="${py(A[1])}" r="5"/><circle class="t16-pt" cx="${px(3)}" cy="${py(-1)}" r="5"/>
    <text class="t16-lbl" x="${px(-1) - 8}" y="${py(0) - 10}" text-anchor="end"${src('g-C')}>C = (−1, 0)</text>
    <text class="t16-lbl" x="${px(0) + 10}" y="${py(2) + 4}"${src('g-D')}>D = (0, 2)</text>
    <text class="t16-lbl" x="${px(A[0]) + 8}" y="${py(A[1]) - 10}"${src('g-A')}>A = (2, −3)</text>
    <text class="t16-lbl" x="${px(3) + 12}" y="${py(-1) + 4}"${src('g-B')}>B = (3, −1)</text>
  </svg>`;
}

export function createTan16(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-tan';
  el.innerHTML = `${markup(true)}<div class="cb-opts t16-opts">${CAND.map((c, i) => `<span class="cb-opt" data-i="${i + 1}"><span data-src="o-${i + 1}">${tex(pt(c).replace(/−/g, '-'))}</span></span>`).join('')}</div>`;
  const cands = [...el.querySelectorAll<SVGElement>('.t16-cand')];
  const chips = [...el.querySelectorAll<HTMLElement>('.cb-opt')];
  const at = el.querySelector<SVGLineElement>('.t16-at')!;

  return {
    el,
    apply(state, _c: Ctx) {
      const s = state as Tan16State;
      const stage = s.stage ?? 'base';
      ORDER.forEach((o) => el.classList.toggle(`at-${o}`, ORDER.indexOf(stage) >= ORDER.indexOf(o)));
      const tested = stage === 'test' ? (s.tested ?? []) : [];
      [...cands, ...chips].forEach((e) => {
        const i = Number(e.dataset.i);
        const done = tested.includes(i);
        const ok = isTangentPoint(CAND[i - 1]!);
        e.classList.toggle('on', s.cur === i);
        e.classList.toggle('ok', done && ok);
        e.classList.toggle('no', done && !ok);
      });
      const cur = s.cur ? CAND[s.cur - 1] : undefined;
      at.classList.toggle('on', !!cur && stage === 'test');
      if (cur) {
        at.setAttribute('x1', String(px(A[0])));
        at.setAttribute('y1', String(py(A[1])));
        at.setAttribute('x2', String(px(cur[0])));
        at.setAttribute('y2', String(py(Math.min(cur[1], Y1))));
      }
    },
    sketch: () => markup(false),
  };
}
