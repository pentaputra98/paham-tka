/**
 * Adegan SVG "lingkaran sepusat" soal 15 (alur guru v1.14; docs/lingkaran_A.png).
 * Bidang koordinat x ∈ [−7, 6], y ∈ [−5, 7] dengan Lingkaran A (pusat p(−3, 4), diameter 4).
 *  - conc: lingkaran-lingkaran sepusat tumbuh dari p (jari-jari 1 dan 3): pusat sama, jari-jari boleh beda;
 *  - read: garis putus-putus dari p ke kedua sumbu, label −3 dan 4 (sumber terbang);
 *  - dlab: label diameter 4 pada ruas garis tengah;
 *  - opts: lingkaran pilihan digambar dari pusat dan jari-jarinya; pusat yang sama dengan p disorot emas,
 *    yang berbeda merah.
 * Angka dari docs/pembahasan25.md soal 15. Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Opt = 'A' | 'B' | 'C' | 'D' | 'E';
export interface CircState {
  conc?: boolean;
  read?: boolean;
  dlab?: boolean;
  opts?: Opt[];
  [k: string]: unknown;
}

/** pusat (h, k) dan jari-jari tiap pilihan (dari koefisien; docs kartu A–E) */
export const OPT: Record<Opt, [number, number, number]> = {
  A: [-3, 4, 3],
  B: [3, 4, 2],
  C: [-3, -4, 3],
  D: [4, 3, 3],
  E: [-4, 3, 2],
};
const VW = 620;
const VH = 372;
const U = 27;
const XMIN = -7;
const XMAX = 6;
const YMIN = -5;
const YMAX = 7;
const OX = 18 - XMIN * U;
const OY = 14 + YMAX * U;
const sx = (x: number): number => OX + x * U;
const sy = (y: number): number => OY - y * U;
const P: [number, number] = [-3, 4];
const LX = sx(XMAX) + 22;

function grid(): string {
  let s = '';
  for (let x = XMIN; x <= XMAX; x++)
    s += `<path class="c5-grid${x === 0 ? ' c5-axis' : ''}" d="M${sx(x)} ${sy(YMAX)}V${sy(YMIN)}"/>`;
  for (let y = YMIN; y <= YMAX; y++)
    s += `<path class="c5-grid${y === 0 ? ' c5-axis' : ''}" d="M${sx(XMIN)} ${sy(y)}H${sx(XMAX)}"/>`;
  for (let x = XMIN + 1; x <= XMAX; x++)
    if (x % 2 === 0 && x !== 0)
      s += `<text class="c5-tick" x="${sx(x)}" y="${sy(0) + 15}">${x < 0 ? '−' : ''}${Math.abs(x)}</text>`;
  for (let y = YMIN; y <= YMAX; y++)
    if (y % 2 === 0 && y !== 0)
      s += `<text class="c5-tick c5-tick-y" x="${sx(0) + 7}" y="${sy(y) + 4}">${y < 0 ? '−' : ''}${Math.abs(y)}</text>`;
  return s + `<text class="c5-tick" x="${sx(0) + 8}" y="${sy(0) + 15}">0</text>`;
}

const fmt = (v: number): string => (v < 0 ? `−${Math.abs(v)}` : String(v));

function optMarkup(o: Opt): string {
  const [h, k, r] = OPT[o];
  const same = h === P[0] && k === P[1];
  return `<g class="c5-opt${same ? ' is-same' : ''}" data-opt="${o}">
    <circle class="c5-oc" cx="${sx(h)}" cy="${sy(k)}" r="${r * U}"/>
    <circle class="c5-op" cx="${sx(h)}" cy="${sy(k)}" r="5"/>
    <text class="c5-olbl${same ? ' c5-olbl-mid' : ''}" x="${same ? sx(h) : sx(h) + 9}" y="${same ? sy(k) + 2.55 * U : sy(k) - 9}">${o}: (${fmt(h)}, ${fmt(k)})</text></g>`;
}

export function createCirc(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-circ';
  const e1: [number, number] = [-4, 5.75];
  const e2: [number, number] = [-2, 2.25];
  el.innerHTML = `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Bidang koordinat dengan Lingkaran A berpusat di p(−3, 4) dan berdiameter 4">
    <g class="c5-grids">${grid()}</g>
    <g class="c5-conc">
      <circle class="c5-cc" data-cc="1" cx="${sx(P[0])}" cy="${sy(P[1])}" r="${U}"/>
      <circle class="c5-cc" data-cc="3" cx="${sx(P[0])}" cy="${sy(P[1])}" r="${3 * U}"/>
      <text class="c5-note" x="${LX}" y="${sy(5)}">sepusat:</text>
      <text class="c5-note-s" x="${LX}" y="${sy(5) + 20}">pusat sama,</text>
      <text class="c5-note-s" x="${LX}" y="${sy(5) + 38}">jari-jari beda</text>
    </g>
    <g class="c5-opts"></g>
    <circle class="c5-a" cx="${sx(P[0])}" cy="${sy(P[1])}" r="${2 * U}"/>
    <path class="c5-diam" d="M${sx(e1[0])} ${sy(e1[1])}L${sx(e2[0])} ${sy(e2[1])}"/>
    <circle class="c5-end" cx="${sx(e1[0])}" cy="${sy(e1[1])}" r="5"/>
    <circle class="c5-end" cx="${sx(e2[0])}" cy="${sy(e2[1])}" r="5"/>
    <text class="c5-albl" x="${sx(XMIN) + 4}" y="${sy(6.55)}">Lingkaran A</text>
    <g class="c5-read">
      <path class="c5-dash" d="M${sx(P[0])} ${sy(P[1])}V${sy(0)}M${sx(P[0])} ${sy(P[1])}H${sx(0)}"/>
      <text class="c5-rlbl" x="${sx(P[0])}" y="${sy(0) + 30}" data-src="g-x">−3</text>
      <text class="c5-rlbl" x="${sx(0) + 32}" y="${sy(P[1]) + 6}" data-src="g-y">4</text>
    </g>
    <text class="c5-dlbl" x="${sx(-2.3)}" y="${sy(4.6)}" data-src="g-d">d = 4</text>
    <circle class="c5-p" cx="${sx(P[0])}" cy="${sy(P[1])}" r="6"/>
    <text class="c5-plbl" x="${sx(P[0]) + 8}" y="${sy(P[1]) - 10}" data-src="g-p">p</text>
  </svg>`;
  const optG = el.querySelector<SVGGElement>('.c5-opts')!;
  const ccs = [...el.querySelectorAll<SVGCircleElement>('.c5-cc')];
  let conc = false;
  let shown: string = '';

  const grow = (e: SVGElement, delay: number): Promise<boolean> => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = 'center';
    return play(
      e,
      [
        { transform: 'scale(0)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      {
        duration: 800,
        delay,
        easing: EASE_OUT,
        fill: 'backwards',
        tag: 'circ',
      },
    ).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as CircState;
      const anim = c.dir > 0 && !reducedMotion();
      el.classList.toggle('show-read', !!s.read);
      el.classList.toggle('show-dlab', !!s.dlab);
      el.classList.toggle('show-conc', !!s.conc);
      const runs: Array<Promise<boolean>> = [];
      if (s.conc && (!conc || c.replay) && anim) ccs.forEach((e, i) => runs.push(grow(e, i * 500)));
      conc = !!s.conc;
      const key = (s.opts ?? []).join();
      if (key !== shown || (c.replay && key)) {
        const prev = shown.split(',').filter(Boolean);
        shown = key;
        optG.innerHTML = (s.opts ?? []).map(optMarkup).join('');
        if (anim)
          [...optG.querySelectorAll<SVGGElement>('[data-opt]')].forEach((g, i) => {
            if (prev.includes(g.dataset.opt!) && !c.replay) return;
            const circle = g.querySelector<SVGElement>('.c5-oc')!;
            runs.push(grow(g.querySelector<SVGElement>('.c5-op')!, i * 300));
            runs.push(grow(circle, i * 300 + 350));
          });
      }
      await Promise.all(runs);
    },
  };
}
