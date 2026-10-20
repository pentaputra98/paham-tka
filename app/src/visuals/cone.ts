/**
 * Adegan SVG "kerucut es krim" soal 24 (PRD §5.1, §9.4; pembahasan25.md soal 24).
 * Segitiga sama kaki ABC (sudut θ di C) + setengah lingkaran berdiameter AB.
 * Morph, bukan ganti: θ dan r berubah halus; label menempel pada objek dan menjadi sumber terbang.
 * Lab: slider θ dan jari-jari, nilai X, Y, dan X/Y langsung (X/Y = (2/π)·cot(θ/2)).
 */
import { fmt } from '../core/dom';
import { tex } from '../core/math';
import { tween } from '../core/tween';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

const NS = 'http://www.w3.org/2000/svg';
const VW = 400;
const VH = 360;
const R_MAX = 5;
const TH_MIN = 30;
const TH_MAX = 180;

export interface ConeState {
  theta: number; // derajat
  r: number; // cm
  height?: boolean; // garis tinggi CM
  half?: boolean; // segitiga siku-siku AMC disorot, AM = r merah, θ/2 biru
  areas?: boolean; // label X dan Y
  lab?: boolean; // slider + HUD
  [k: string]: unknown;
}

function sv<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  parent?: Element,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  parent?.append(e);
  return e;
}

/** Nilai rasio dari rumus (dipakai HUD; oracle independen ada di uji). */
export const ratio = (thetaDeg: number): number => {
  const half = (thetaDeg * Math.PI) / 360;
  return thetaDeg >= 180 ? 0 : 2 / Math.PI / Math.tan(half);
};

interface Geo {
  s: number;
  cx: number;
  yAB: number;
  h: number;
  rPx: number;
  yC: number;
}

function geometry(theta: number, r: number): Geo {
  const half = (Math.min(theta, 179.999) * Math.PI) / 360;
  const hUnit = theta >= 180 ? 0 : 1 / Math.tan(half); // tinggi per satuan r
  // skala hanya bergantung pada θ (bukan r) agar perubahan jari-jari terlihat
  const s = Math.min((VW - 60) / (2 * R_MAX), (VH - 70) / (R_MAX * (1 + hUnit)));
  const rPx = r * s;
  const h = r * hUnit * s;
  const total = rPx + h;
  const top = (VH - total) / 2 + 6;
  const yAB = top + rPx;
  return { s, cx: VW / 2, yAB, h, rPx, yC: yAB + h };
}

export function createCone(): VisualScene {
  const st: ConeState = { theta: 60, r: 3 };
  const el = document.createElement('div');
  el.className = 'vis-cone';
  const svg = sv('svg', {
    viewBox: `0 0 ${VW} ${VH}`,
    role: 'img',
    'aria-label': 'Segitiga sama kaki ABC dengan setengah lingkaran berdiameter AB',
  });
  el.append(svg);
  const gShape = sv('g', {}, svg);
  const semi = sv('path', { class: 'c-semi' }, gShape);
  const tri = sv('path', { class: 'c-tri' }, gShape);
  const halfTri = sv('path', { class: 'c-half' }, gShape);
  const ab = sv('line', { class: 'c-ab' }, gShape);
  const cm = sv('line', { class: 'c-cm' }, gShape);
  const am = sv('line', { class: 'c-am' }, gShape);
  const arcT = sv('path', { class: 'c-arc' }, gShape);
  const arcH = sv('path', { class: 'c-arc-half' }, gShape);
  const ticks = sv('g', { class: 'c-ticks' }, gShape);
  const tick1 = sv('path', {}, ticks);
  const tick2 = sv('path', {}, ticks);
  const gLab = sv('g', { class: 'c-labels' }, svg);
  const mk = (txt: string, cls: string, src?: string): SVGTextElement => {
    const t = sv('text', { class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, gLab);
    if (src) t.setAttribute('data-src', src);
    t.textContent = txt;
    return t;
  };
  const tA = mk('A', 'c-pt');
  const tB = mk('B', 'c-pt');
  const tC = mk('C', 'c-pt');
  const tM = mk('M', 'c-pt c-m');
  const tTh = mk('θ', 'c-var c-theta', 'g-theta');
  const tHalf = mk('θ/2', 'c-var c-halfth');
  const tR = mk('r', 'c-var c-r');
  const t2r = mk('AB = 2r', 'c-lbl', 's-semi');
  const tX = mk('X', 'c-var c-x', 's-X');
  const tY = mk('Y', 'c-var c-y', 's-Y');

  // ---------- lab: slider + HUD ----------
  const lab = document.createElement('div');
  lab.className = 'labctl';
  lab.innerHTML = `<div class="lab-row"><label for="cone-th">Sudut ${tex('\\theta')}</label>
      <input class="slider" id="cone-th" type="range" min="${TH_MIN}" max="${TH_MAX}" step="1" aria-valuetext="" />
      <output data-o="th"></output></div>
    <div class="lab-row"><label for="cone-r">Jari-jari ${tex('r')}</label>
      <input class="slider" id="cone-r" type="range" min="1" max="${R_MAX}" step="0.1" />
      <output data-o="r"></output></div>
    <dl class="hud"><div><dt>${tex('X')}</dt><dd data-o="x"></dd></div><div><dt>${tex('Y')}</dt><dd data-o="y"></dd></div>
      <div class="hud-main"><dt>${tex('\\tfrac{X}{Y}')}</dt><dd data-o="q"></dd></div></dl>`;
  el.append(lab);
  const thIn = lab.querySelector<HTMLInputElement>('#cone-th')!;
  const rIn = lab.querySelector<HTMLInputElement>('#cone-r')!;
  const out = (k: string): HTMLElement => lab.querySelector<HTMLElement>(`[data-o="${k}"]`)!;

  function draw(): void {
    const g = geometry(st.theta, st.r);
    const { cx, yAB, rPx, yC } = g;
    const Ax = cx - rPx;
    const Bx = cx + rPx;
    semi.setAttribute('d', `M${Ax} ${yAB} A${rPx} ${rPx} 0 0 1 ${Bx} ${yAB} Z`);
    tri.setAttribute('d', `M${Ax} ${yAB} L${Bx} ${yAB} L${cx} ${yC} Z`);
    halfTri.setAttribute('d', `M${Ax} ${yAB} L${cx} ${yAB} L${cx} ${yC} Z`);
    for (const [ln, x1, y1, x2, y2] of [
      [ab, Ax, yAB, Bx, yAB],
      [cm, cx, yAB, cx, yC],
      [am, Ax, yAB, cx, yAB],
    ] as const) {
      ln.setAttribute('x1', String(x1));
      ln.setAttribute('y1', String(y1));
      ln.setAttribute('x2', String(x2));
      ln.setAttribute('y2', String(y2));
    }
    // busur sudut θ di C dan θ/2
    const ra = Math.min(34, Math.max(14, g.h * 0.28 + 10));
    const half = (Math.min(st.theta, 179.9) * Math.PI) / 360;
    const p = (ang: number, rr: number): string => `${cx + rr * Math.sin(ang)} ${yC - rr * Math.cos(ang)}`;
    arcT.setAttribute('d', st.theta >= 179.9 ? '' : `M${p(-half, ra)} A${ra} ${ra} 0 0 1 ${p(half, ra)}`);
    const rh = ra + 12;
    arcH.setAttribute('d', st.theta >= 179.9 ? '' : `M${p(-half, rh)} A${rh} ${rh} 0 0 1 ${p(0, rh)}`);
    // tanda sama panjang pada kaki
    const tickAt = (x0: number): string => {
      const mx = (x0 + cx) / 2;
      const my = (yAB + yC) / 2;
      const ang = Math.atan2(yC - yAB, cx - x0) + Math.PI / 2;
      const dx = Math.cos(ang) * 6;
      const dy = Math.sin(ang) * 6;
      return `M${mx - dx} ${my - dy} L${mx + dx} ${my + dy}`;
    };
    tick1.setAttribute('d', st.theta >= 179.9 ? '' : tickAt(Ax));
    tick2.setAttribute('d', st.theta >= 179.9 ? '' : tickAt(Bx));
    const at = (t: SVGTextElement, x: number, y: number): void => {
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
    };
    at(tA, Ax - 14, yAB);
    at(tB, Bx + 14, yAB);
    at(tC, cx, yC + 16);
    at(tM, cx + 11, yAB + 11);
    at(tTh, cx, yC - ra - (g.h > 40 ? 12 : 4));
    at(tHalf, cx - rh * 0.55 - 14, yC - rh * 0.9);
    at(tR, (Ax + cx) / 2, yAB + 14);
    at(t2r, cx, yAB - 12);
    at(tX, cx + rPx * 0.3, yAB + g.h * 0.36);
    at(tY, cx, yAB - rPx * 0.5);
    el.classList.toggle('show-height', !!st.height);
    el.classList.toggle('show-half', !!st.half);
    el.classList.toggle('show-areas', !!st.areas);
    el.classList.toggle('flat', st.theta >= 179.9);
    // HUD
    const X = st.r * st.r * (st.theta >= 180 ? 0 : 1 / Math.tan(half));
    const Y = 0.5 * Math.PI * st.r * st.r;
    thIn.value = String(Math.round(st.theta));
    rIn.value = String(st.r);
    out('th').textContent = `${Math.round(st.theta)}°`;
    out('r').textContent = `${fmt(st.r, 1)} cm`;
    out('x').textContent = `${fmt(X, 2)} cm²`;
    out('y').textContent = `${fmt(Y, 2)} cm²`;
    out('q').textContent = fmt(X / Y, 3);
    thIn.setAttribute('aria-valuetext', `${Math.round(st.theta)} derajat`);
  }

  thIn.addEventListener('input', () => {
    st.theta = Number(thIn.value);
    draw();
  });
  rIn.addEventListener('input', () => {
    st.r = Number(rIn.value);
    draw();
  });

  draw();

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as ConeState;
      st.height = !!s.height;
      st.half = !!s.half;
      st.areas = !!s.areas;
      el.classList.toggle('lab-on', !!s.lab);
      const th0 = st.theta;
      const r0 = st.r;
      const th1 = s.theta ?? th0;
      const r1 = s.r ?? r0;
      if (c.dir > 0 && (th0 !== th1 || r0 !== r1)) {
        await tween({
          from: 0,
          to: 1,
          dur: 900,
          tag: 'cone',
          update: (k) => {
            st.theta = th0 + (th1 - th0) * k;
            st.r = r0 + (r1 - r0) * k;
            draw();
          },
        });
      } else {
        st.theta = th1;
        st.r = r1;
        draw();
      }
    },
    sketch() {
      const g = geometry(60, 3);
      const Ax = g.cx - g.rPx;
      const Bx = g.cx + g.rPx;
      return `<svg viewBox="0 0 ${VW} ${VH}" class="n-sketch" aria-label="Sketsa kerucut es krim">
        <path d="M${Ax} ${g.yAB} A${g.rPx} ${g.rPx} 0 0 1 ${Bx} ${g.yAB} Z" class="c-semi"/>
        <path d="M${Ax} ${g.yAB} L${Bx} ${g.yAB} L${g.cx} ${g.yC} Z" class="c-tri"/>
        <line x1="${g.cx}" y1="${g.yAB}" x2="${g.cx}" y2="${g.yC}" class="c-cm"/>
        <text x="${Ax - 14}" y="${g.yAB}" class="c-pt" text-anchor="middle">A</text>
        <text x="${Bx + 14}" y="${g.yAB}" class="c-pt" text-anchor="middle">B</text>
        <text x="${g.cx}" y="${g.yC + 18}" class="c-pt" text-anchor="middle">C</text>
        <text x="${g.cx}" y="${g.yAB - g.rPx * 0.5}" class="c-var" text-anchor="middle">Y</text>
        <text x="${g.cx + g.rPx * 0.3}" y="${g.yAB + g.h * 0.36}" class="c-var" text-anchor="middle">X</text></svg>`;
    },
  };
}
