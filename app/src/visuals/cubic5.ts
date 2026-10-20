/**
 * Adegan SVG "grafik kubik" soal 5 (pembahasan25.md soal 5, playbook §15 Fungsi dan grafik).
 * f(x) = x³ + 3x² − 10x − 24. Titik pada kurva bergerak (morph) ke x tiap pilihan; emas bila f(x) = 0
 * (titik potong = jawaban), merah bila tidak. Chip pilihan di bawah grafik menjadi sumber terbang o-1…o-5.
 * Skala sumbu Y dipadatkan (bukan 1:1) agar f(5) = 126 dan minimum ≈ −30 sama-sama terlihat.
 */
import { fmt } from '../core/dom';
import { tex } from '../core/math';
import { tween } from '../core/tween';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface CubicState {
  /** x titik pada kurva */
  pt?: number;
  /** pilihan yang sudah diuji (indeks 1–5) */
  tested?: number[];
  /** pilihan yang sedang diuji (1–5) */
  cur?: number;
  /** sumbu X berpendar */
  sx?: boolean;
  /** slider "geser x" */
  lab?: boolean;
  /** tandai ketiga akar (−4, −2, 3) */
  roots?: boolean;
  [k: string]: unknown;
}

export const f5 = (x: number): number => x ** 3 + 3 * x ** 2 - 10 * x - 24;
/** pilihan soal: x dari (x, 0) */
export const OPTS = [-2, -1, 3, 4, 5];
const ROOTS = [-4, -2, 3];

const VW = 560;
const VH = 300;
const X0 = -5.5;
const X1 = 5.5;
const Y0 = -40;
const Y1 = 135;
const PAD = 26;
const sx = (x: number): number => PAD + ((x - X0) / (X1 - X0)) * (VW - 2 * PAD);
const sy = (y: number): number => VH - PAD - ((y - Y0) / (Y1 - Y0)) * (VH - 2 * PAD);
const isRoot = (x: number): boolean => ROOTS.some((r) => Math.abs(r - x) < 1e-9);
/** bilangan dengan tanda minus tipografis */
const num = (v: number): string => fmt(v, Number.isInteger(v) ? 0 : 1).replace('-', '−');

function curvePath(): string {
  const pts: string[] = [];
  for (let i = 0; i <= 220; i++) {
    const x = X0 + ((X1 - X0) * i) / 220;
    const y = f5(x);
    if (y > Y1 + 20) break;
    pts.push(`${i ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`);
  }
  return pts.join('');
}

function axes(): string {
  const ticks: string[] = [];
  for (let x = -5; x <= 5; x++)
    ticks.push(
      `<line x1="${sx(x)}" y1="${sy(0) - 4}" x2="${sx(x)}" y2="${sy(0) + 4}" class="cb-tick"/>` +
        (x
          ? `<text x="${sx(x)}" y="${sy(0) + 16}" class="cb-num" text-anchor="middle">${num(x)}</text>`
          : ''),
    );
  return `<line x1="${PAD - 6}" y1="${sy(0)}" x2="${VW - PAD + 6}" y2="${sy(0)}" class="cb-axis cb-xaxis"/>
    <line x1="${sx(0)}" y1="${VH - PAD + 4}" x2="${sx(0)}" y2="${PAD - 8}" class="cb-axis"/>
    <text x="${VW - PAD + 10}" y="${sy(0) + 4}" class="cb-lbl">X</text>
    <text x="${sx(0) + 8}" y="${PAD - 6}" class="cb-lbl">Y</text>
    <text x="${sx(0) + 6}" y="${sy(-24) + 4}" class="cb-num">−24</text>
    ${ticks.join('')}`;
}

export function createCubic5(): VisualScene {
  let x = 0;
  const el = document.createElement('div');
  el.className = 'vis-cubic';
  el.innerHTML = `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Grafik f(x) = x³ + 3x² − 10x − 24 dengan sumbu X dan Y">
    ${axes()}
    <path d="${curvePath()}" class="cb-curve"/>
    <g class="cb-roots">${ROOTS.map((r) => `<circle cx="${sx(r)}" cy="${sy(0)}" r="5" class="cb-root"/>`).join('')}</g>
    <line class="cb-drop"/>
    <circle r="7" class="cb-pt"/>
    <text class="cb-pv" x="${PAD}" y="${PAD}"></text>
  </svg>
  <div class="cb-opts">${OPTS.map((o, i) => `<span class="cb-opt" data-i="${i + 1}"><span data-src="o-${i + 1}">${tex(`(${o},0)`)}</span></span>`).join('')}</div>
  <div class="labctl cb-lab"><div class="lab-row"><label for="cubic-x">Geser ${tex('x')}</label>
    <input class="slider" id="cubic-x" type="range" min="-5" max="5" step="0.1" /><output data-o="fx"></output></div></div>`;
  const pt = el.querySelector<SVGCircleElement>('.cb-pt')!;
  const drop = el.querySelector<SVGLineElement>('.cb-drop')!;
  const pv = el.querySelector<SVGTextElement>('.cb-pv')!;
  const opts = [...el.querySelectorAll<HTMLElement>('.cb-opt')];
  const slider = el.querySelector<HTMLInputElement>('#cubic-x')!;
  const out = el.querySelector<HTMLElement>('[data-o="fx"]')!;

  function draw(): void {
    const y = f5(x);
    const yc = Math.max(Y0, Math.min(Y1, y));
    pt.setAttribute('cx', String(sx(x)));
    pt.setAttribute('cy', String(sy(yc)));
    drop.setAttribute('x1', String(sx(x)));
    drop.setAttribute('x2', String(sx(x)));
    drop.setAttribute('y1', String(sy(0)));
    drop.setAttribute('y2', String(sy(yc)));
    const zero = isRoot(x);
    pt.classList.toggle('zero', zero);
    const xr = Math.round(x * 10) / 10;
    pv.textContent = `f(${num(xr)}) = ${num(Math.round(f5(xr) * 10) / 10)}`;
    pv.classList.toggle('zero', zero);
    slider.value = String(xr);
    out.textContent = `f(x) = ${num(Math.round(f5(xr) * 10) / 10)}`;
  }

  slider.addEventListener('input', () => {
    x = Number(slider.value);
    draw();
  });
  draw();

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as CubicState;
      el.classList.toggle('show-sx', !!s.sx);
      el.classList.toggle('show-roots', !!s.roots);
      el.classList.toggle('lab-on', !!s.lab);
      for (const o of opts) {
        const i = Number(o.dataset.i);
        const done = !!s.tested?.includes(i);
        o.classList.toggle('on', s.cur === i);
        o.classList.toggle('ok', done && f5(OPTS[i - 1]!) === 0);
        o.classList.toggle('no', done && f5(OPTS[i - 1]!) !== 0);
      }
      const to = s.pt ?? x;
      if (c.dir > 0 && Math.abs(to - x) > 1e-9) {
        const from = x;
        await tween({
          from: 0,
          to: 1,
          dur: 900,
          tag: 'cubic',
          update: (k) => {
            x = from + (to - from) * k;
            draw();
          },
        });
      }
      x = to;
      draw();
    },
    sketch: () =>
      `<svg viewBox="0 0 ${VW} ${VH}" class="n-sketch vis-cubic show-roots" aria-label="Sketsa grafik f dengan akar −4, −2, 3">${axes()}<path d="${curvePath()}" class="cb-curve"/>${ROOTS.map((r) => `<circle cx="${sx(r)}" cy="${sy(0)}" r="5" class="cb-root"/>`).join('')}</svg>`,
  };
}
