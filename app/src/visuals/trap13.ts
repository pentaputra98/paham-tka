/**
 * Adegan SVG "bidang koordinat" soal 13 (pembahasan25.md soal 13, playbook §15 Dimensi dua dengan vektor).
 * Tahap: pts (A, B, D; alas AB biru, kaki AD merah) → sym (sumbu simetri x = 3; D dicerminkan menjadi C, morph)
 * → legs (kedua kaki √17) → final (trapesium utuh, alas atas DC).
 */
import { tween } from '../core/tween';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Trap13Stage = 'pts' | 'sym' | 'legs' | 'final';
const ORDER: Trap13Stage[] = ['pts', 'sym', 'legs', 'final'];

const VW = 440;
const VH = 300;
const U = 44;
const OX = 22 + U; // x = 0
const OY = VH - 22 - U; // y = 0
const px = (x: number): number => OX + x * U;
const py = (y: number): number => OY - y * U;
const A = [0, 0] as const;
const B = [6, 0] as const;
const D = [1, 4] as const;
const C = [5, 4] as const;

function grid(): string {
  const g: string[] = [];
  for (let x = -1; x <= 8; x++)
    g.push(
      `<line x1="${px(x)}" y1="${py(-1)}" x2="${px(x)}" y2="${py(5)}" class="tp-grid${x === 0 ? ' tp-ax' : ''}"/>`,
    );
  for (let y = -1; y <= 5; y++)
    g.push(
      `<line x1="${px(-1)}" y1="${py(y)}" x2="${px(8)}" y2="${py(y)}" class="tp-grid${y === 0 ? ' tp-ax' : ''}"/>`,
    );
  return g.join('');
}

function markup(live: boolean): string {
  const lbl = (cls: string, x: number, y: number, t: string, anchor = 'middle'): string =>
    `<text class="tp-lbl ${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Bidang koordinat: trapesium sama kaki ABCD dengan A(0, 0), B(6, 0), C(5, 4), D(1, 4)"${live ? '' : ' class="n-sketch vis-trap at-pts at-sym at-legs at-final"'}>
    ${grid()}
    <line class="tp-sym" x1="${px(3)}" y1="${py(-0.6)}" x2="${px(3)}" y2="${py(4.8)}"/>
    ${lbl('tp-sym-t', px(3) + 6, py(4.7), 'x = 3', 'start')}
    <line class="tp-ab" x1="${px(A[0])}" y1="${py(A[1])}" x2="${px(B[0])}" y2="${py(B[1])}"/>
    <line class="tp-ad" x1="${px(A[0])}" y1="${py(A[1])}" x2="${px(D[0])}" y2="${py(D[1])}"/>
    <line class="tp-bc" x1="${px(B[0])}" y1="${py(B[1])}" x2="${px(C[0])}" y2="${py(C[1])}"/>
    <line class="tp-dc" x1="${px(D[0])}" y1="${py(D[1])}" x2="${px(C[0])}" y2="${py(C[1])}"/>
    <path class="tp-mirror" d="M${px(D[0])} ${py(D[1]) - 12} Q${px(3)} ${py(D[1]) - 44} ${px(C[0])} ${py(C[1]) - 12}"/>
    ${lbl('tp-len', px(0.5) - 12, py(2), '√17', 'end')}
    ${lbl('tp-len tp-len-bc', px(5.5) + 12, py(2), '√17', 'start')}
    <circle class="tp-pt" cx="${px(A[0])}" cy="${py(A[1])}" r="5"/>
    <circle class="tp-pt" cx="${px(B[0])}" cy="${py(B[1])}" r="5"/>
    <circle class="tp-pt" cx="${px(D[0])}" cy="${py(D[1])}" r="5"/>
    <circle class="tp-pt tp-c" cx="${px(C[0])}" cy="${py(C[1])}" r="5"/>
    ${lbl('', px(A[0]) - 8, py(A[1]) + 20, 'A(0, 0)', 'end')}
    ${lbl('', px(B[0]) + 8, py(B[1]) + 20, 'B(6, 0)', 'start')}
    ${lbl('', px(D[0]) - 8, py(D[1]) - 10, 'D(1, 4)', 'end')}
    <text class="tp-lbl tp-c-t" x="${px(C[0]) + 8}" y="${py(C[1]) - 10}">C(5, 4)</text>
  </svg>`;
}

export function createTrap13(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-trap';
  el.innerHTML = markup(true);
  const c = el.querySelector<SVGCircleElement>('.tp-c')!;
  const ct = el.querySelector<SVGTextElement>('.tp-c-t')!;
  let stage: Trap13Stage = 'pts';

  const placeC = (k: number): void => {
    const x = D[0] + (C[0] - D[0]) * k;
    c.setAttribute('cx', String(px(x)));
    ct.setAttribute('x', String(px(x) + 8));
  };

  return {
    el,
    async apply(state, ctx: Ctx) {
      const next = (state.stage as Trap13Stage | undefined) ?? 'pts';
      const mirror = stage === 'pts' && next === 'sym' && ctx.dir > 0;
      stage = next;
      el.dataset.stage = next;
      ORDER.forEach((s) => el.classList.toggle(`at-${s}`, ORDER.indexOf(next) >= ORDER.indexOf(s)));
      if (mirror) {
        // pencerminan: C bergerak dari posisi D ke (5, 4)
        placeC(0);
        await tween({ from: 0, to: 1, dur: 1100, tag: 'trap13', update: placeC });
      }
      placeC(1);
    },
    sketch: () => markup(false),
  };
}
