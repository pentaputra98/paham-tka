/**
 * Adegan SVG "kerucut es krim" soal 24 (PRD §5.1, §9.4; alur guru, revisi pemilik v1.7).
 * Segitiga sama kaki ABC (sudut θ di C) + setengah lingkaran berdiameter AB.
 * Urutan cerita mengikuti cara Pak Penta di kelas:
 *  - rad/diam: jari-jari dari pusat ke B berkedip (r), diameter AB memerah (2r);
 *  - semi/tri: luas setengah lingkaran (Y) atau segitiga (X) disorot;
 *  - height/split/halves: garis tinggi t, sudut θ terbelah dua (θ/2), segitiga terbelah menjadi dua bagian;
 *  - right/piece: segitiga siku-siku kanan disorot, lalu dipindahkan ke tengah, diperbesar, dan diputar
 *    sehingga sudut θ/2 di kanan: sisi depan r tegak, sisi samping t mendatar (tan θ/2 = r/t);
 *    tanpa piece, potongan itu kembali ke tempatnya;
 *  - lab: slider θ dan r dengan nilai X, Y, X/Y langsung (r berubah, X/Y tetap).
 * Morph, bukan ganti: θ dan r berubah halus; label menempel pada objek dan menjadi sumber terbang.
 * Gerak hanya transform/opacity (busur dan garis memakai opacity; potongan memakai translate/rotate/scale).
 */
import { sleep } from '../core/clock';
import { fmt } from '../core/dom';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE } from '../core/tokens';
import { tween } from '../core/tween';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

const NS = 'http://www.w3.org/2000/svg';
const VW = 400;
const VH = 360;
const R_MAX = 4.5;
const TH_MIN = 30;
const TH_MAX = 180;
/** lama perpindahan potongan segitiga siku-siku (ms) */
const PIECE_MS = 1300;

export interface ConeState {
  theta: number; // derajat
  r: number; // cm
  /** jari-jari dari pusat AB ke B, label r berkedip */
  rad?: boolean;
  /** diameter AB merah, label 2r */
  diam?: boolean;
  /** sorot setengah lingkaran (Y) */
  semi?: boolean;
  /** sorot segitiga (X) */
  tri?: boolean;
  /** garis tinggi t (putus-putus) */
  height?: boolean;
  /** sudut θ terbelah menjadi dua θ/2 */
  split?: boolean;
  /** segitiga terbelah menjadi dua bagian (sedikit merenggang) */
  halves?: boolean;
  /** segitiga siku-siku kanan: depan r, samping t */
  right?: boolean;
  /** potongan segitiga siku-siku kanan dipindahkan ke tengah dan diputar (sudut θ/2 di kanan) */
  piece?: boolean;
  /** label X dan Y */
  areas?: boolean;
  /** slider + nilai langsung */
  lab?: boolean;
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

/** Nilai rasio dari rumus X/Y = 2 / (π tan(θ/2)) (dipakai HUD; oracle independen ada di uji). */
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
  const s = Math.min((VW - 50) / (2 * R_MAX), (VH - 50) / (R_MAX * (1 + hUnit)));
  const rPx = r * s;
  const h = r * hUnit * s;
  const total = rPx + h;
  const top = (VH - total) / 2 + 6;
  const yAB = top + rPx;
  return { s, cx: VW / 2, yAB, h, rPx, yC: yAB + h };
}

export function createCone(): VisualScene {
  const st: ConeState = { theta: 60, r: 4 };
  const el = document.createElement('div');
  el.className = 'vis-cone';
  const svg = sv('svg', {
    viewBox: `0 0 ${VW} ${VH}`,
    role: 'img',
    'aria-label': 'Segitiga sama kaki ABC dengan setengah lingkaran berdiameter AB di atasnya',
  });
  el.append(svg);
  const gAll = sv('g', { class: 'c-all' }, svg);
  const gShape = sv('g', {}, gAll);
  const semi = sv('path', { class: 'c-semi' }, gShape);
  const tri = sv('path', { class: 'c-tri' }, gShape);
  const halfL = sv('path', { class: 'c-hl' }, gShape);
  const halfR = sv('path', { class: 'c-hr' }, gShape);
  const rightTri = sv('path', { class: 'c-right' }, gShape);
  const ab = sv('line', { class: 'c-ab' }, gShape);
  const cm = sv('line', { class: 'c-cm' }, gShape);
  const mb = sv('line', { class: 'c-mb' }, gShape);
  const sq = sv('path', { class: 'c-sq' }, gShape);
  const arcT = sv('path', { class: 'c-arc' }, gShape);
  const arcL = sv('path', { class: 'c-arc-half' }, gShape);
  const arcR = sv('path', { class: 'c-arc-half c-arc-r' }, gShape);
  const ticks = sv('g', { class: 'c-ticks' }, gShape);
  const tick1 = sv('path', {}, ticks);
  const tick2 = sv('path', {}, ticks);
  const dot = sv('circle', { class: 'c-dot', r: 3.5 }, gShape);
  const gLab = sv('g', { class: 'c-labels' }, gAll);
  const mk = (txt: string, cls: string, src?: string): SVGTextElement => {
    const t = sv('text', { class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, gLab);
    if (src) t.setAttribute('data-src', src);
    t.textContent = txt;
    return t;
  };
  const tA = mk('A', 'c-pt');
  const tB = mk('B', 'c-pt');
  const tC = mk('C', 'c-pt');
  const tTh = mk('θ', 'c-var c-theta', 'g-theta');
  const tHalfL = mk('θ/2', 'c-var c-halfth');
  const tHalfR = mk('θ/2', 'c-var c-halfth c-halfth-r', 'g-half');
  const tR = mk('r', 'c-var c-r', 'g-r');
  const t2r = mk('2r', 'c-var c-2r', 'g-2r');
  const tT = mk('t', 'c-var c-t', 'g-t');
  const tDepan = mk('depan', 'c-side c-depan');
  const tSamping = mk('samping', 'c-side c-samping');
  const tX = mk('X', 'c-var c-x', 's-X');
  const tY = mk('Y', 'c-var c-y', 's-Y');

  // ---------- potongan segitiga siku-siku kanan (dipindahkan dan diputar saat membahas tangen) ----------
  // koordinat lokal: siku di M (0, 0), B di (r, 0), C di (0, h); label digambar di koordinat layar (tidak ikut berputar)
  const gPiece = sv('g', { class: 'c-piece' }, svg);
  const ns = { 'vector-effect': 'non-scaling-stroke' };
  const pTri = sv('path', { class: 'cp-tri', ...ns }, gPiece);
  const pDepan = sv('line', { class: 'cp-depan', ...ns }, gPiece);
  const pSamping = sv('line', { class: 'cp-samping', ...ns }, gPiece);
  const gPLab = sv('g', { class: 'cp-labels' }, svg);
  const pArc = sv('path', { class: 'cp-arc' }, gPLab);
  const pSq = sv('path', { class: 'cp-sq' }, gPLab);
  const pmk = (txt: string, cls: string, src?: string): SVGTextElement => {
    const t = sv('text', { class: cls, 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, gPLab);
    if (src) t.setAttribute('data-src', src);
    t.textContent = txt;
    return t;
  };
  const pR = pmk('r', 'c-var cp-r', 'p-r');
  const pRk = pmk('depan', 'cp-k', 'p-depan');
  const pT = pmk('t', 'c-var cp-t', 'p-t');
  const pTk = pmk('samping', 'cp-k', 'p-samping');
  const pH = pmk('θ/2', 'c-var cp-h', 'p-half');
  let pieceFrom = '';
  let pieceTo = '';
  let pieceOut = false;
  let pieceMoving = false;

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
  const o = { th: out('th'), r: out('r'), x: out('x'), y: out('y'), q: out('q') };
  let labOn = false;

  function draw(): void {
    const g = geometry(st.theta, st.r);
    const { cx, yAB, rPx, yC } = g;
    const flat = st.theta >= 179.9;
    const Ax = cx - rPx;
    const Bx = cx + rPx;
    semi.setAttribute('d', `M${Ax} ${yAB} A${rPx} ${rPx} 0 0 1 ${Bx} ${yAB} Z`);
    tri.setAttribute('d', `M${Ax} ${yAB} L${Bx} ${yAB} L${cx} ${yC} Z`);
    rightTri.setAttribute('d', `M${cx} ${yAB} L${Bx} ${yAB} L${cx} ${yC} Z`);
    halfL.setAttribute('d', `M${Ax} ${yAB} L${cx} ${yAB} L${cx} ${yC} Z`);
    halfR.setAttribute('d', `M${cx} ${yAB} L${Bx} ${yAB} L${cx} ${yC} Z`);
    drawPiece(g);
    for (const [ln, x1, y1, x2, y2] of [
      [ab, Ax, yAB, Bx, yAB],
      [cm, cx, yAB, cx, yC],
      [mb, cx, yAB, Bx, yAB],
    ] as const) {
      ln.setAttribute('x1', String(x1));
      ln.setAttribute('y1', String(y1));
      ln.setAttribute('x2', String(x2));
      ln.setAttribute('y2', String(y2));
    }
    dot.setAttribute('cx', String(cx));
    dot.setAttribute('cy', String(yAB));
    // tanda siku di kaki garis tinggi (sisi kanan)
    const q = Math.min(12, g.h * 0.4);
    sq.setAttribute('d', flat ? '' : `M${cx + q} ${yAB} L${cx + q} ${yAB + q} L${cx} ${yAB + q}`);
    // busur sudut θ di C; dua busur θ/2 (kiri dan kanan)
    const ra = Math.min(34, Math.max(14, g.h * 0.28 + 10));
    const half = (Math.min(st.theta, 179.9) * Math.PI) / 360;
    const p = (ang: number, rr: number): string => `${cx + rr * Math.sin(ang)} ${yC - rr * Math.cos(ang)}`;
    arcT.setAttribute('d', flat ? '' : `M${p(-half, ra)} A${ra} ${ra} 0 0 1 ${p(half, ra)}`);
    const rh = ra + 10;
    arcL.setAttribute('d', flat ? '' : `M${p(-half, rh)} A${rh} ${rh} 0 0 1 ${p(0, rh)}`);
    arcR.setAttribute('d', flat ? '' : `M${p(0, rh)} A${rh} ${rh} 0 0 1 ${p(half, rh)}`);
    // tanda sama panjang pada kaki
    const tickAt = (x0: number): string => {
      const mx = (x0 + cx) / 2;
      const my = (yAB + yC) / 2;
      const ang = Math.atan2(yC - yAB, cx - x0) + Math.PI / 2;
      const dx = Math.cos(ang) * 6;
      const dy = Math.sin(ang) * 6;
      return `M${mx - dx} ${my - dy} L${mx + dx} ${my + dy}`;
    };
    tick1.setAttribute('d', flat ? '' : tickAt(Ax));
    tick2.setAttribute('d', flat ? '' : tickAt(Bx));
    const at = (t: SVGTextElement, x: number, y: number): void => {
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
    };
    at(tA, Ax - 14, yAB);
    at(tB, Bx + 14, yAB);
    at(tC, cx, yC + 16);
    at(tTh, cx, yC - ra - (g.h > 40 ? 12 : 4));
    const lh = rh + 14;
    const hl = Math.max(half * 0.5, 0.18);
    at(tHalfL, cx - lh * Math.sin(hl) - 8, yC - lh * Math.cos(hl));
    at(tHalfR, cx + lh * Math.sin(hl) + 8, yC - lh * Math.cos(hl));
    at(tR, (cx + Bx) / 2, yAB - 12);
    at(tDepan, (cx + Bx) / 2, yAB - 28);
    // 2r di bawah separuh kiri AB (garis tinggi turun dari tengah)
    at(t2r, (Ax + cx) / 2, yAB + 15);
    // t dan "samping" (tegak) di kanan garis tinggi, di bagian atas segitiga siku-siku kanan yang lebar
    const yT = yAB + g.h * 0.3;
    at(tT, cx + 11, yT);
    at(tSamping, cx + 27, yT);
    tSamping.setAttribute('transform', `rotate(90 ${cx + 27} ${yT})`);
    at(tX, cx - rPx * 0.32, yAB + g.h * 0.36);
    at(tY, cx, yAB - rPx * 0.5);
    el.classList.toggle('flat', flat);
    // HUD hanya saat lab tampil
    if (!labOn) return;
    const X = st.r * st.r * (st.theta >= 180 ? 0 : 1 / Math.tan(half));
    const Y = 0.5 * Math.PI * st.r * st.r;
    thIn.value = String(Math.round(st.theta));
    rIn.value = String(st.r);
    o.th.textContent = `${Math.round(st.theta)}°`;
    o.r.textContent = `${fmt(st.r, 1)} cm`;
    o.x.textContent = `${fmt(X, 2)} cm²`;
    o.y.textContent = `${fmt(Y, 2)} cm²`;
    o.q.textContent = fmt(X / Y, 3);
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

  /**
   * Potongan segitiga siku-siku kanan. Posisi awal = tepat di atas bagian kanan segitiga (siku di M).
   * Posisi akhir = tengah gambar, diperbesar k kali dan diputar −90°: C ke kanan (sudut θ/2 di kanan),
   * B ke atas (sisi depan r tegak), sisi samping t mendatar di bawah.
   */
  function drawPiece(g: Geo): void {
    const { cx, yAB, rPx } = g;
    const h = Math.max(g.h, 1);
    pTri.setAttribute('d', `M0 0 L${rPx} 0 L0 ${h} Z`);
    for (const [ln, x2, y2] of [
      [pDepan, rPx, 0],
      [pSamping, 0, h],
    ] as const) {
      ln.setAttribute('x1', '0');
      ln.setAttribute('y1', '0');
      ln.setAttribute('x2', String(x2));
      ln.setAttribute('y2', String(y2));
    }
    const k = Math.min(250 / h, 170 / rPx, 2.4);
    const x0 = VW / 2 - (k * h) / 2;
    const y0 = VH / 2 + (k * rPx) / 2 + 6;
    pieceFrom = `translate(${cx}px, ${yAB}px) rotate(0deg) scale(1)`;
    pieceTo = `translate(${x0}px, ${y0}px) rotate(-90deg) scale(${k})`;
    if (!pieceMoving) gPiece.style.transform = pieceOut ? pieceTo : pieceFrom;
    // label di koordinat layar pada posisi akhir: M' = (x0, y0), B' = (x0, y0 − kr), C' = (x0 + kh, y0)
    const Cx = x0 + k * h;
    const ymid = y0 - (k * rPx) / 2;
    const at = (t: SVGTextElement, x: number, y: number): void => {
      t.setAttribute('x', String(x));
      t.setAttribute('y', String(y));
    };
    at(pR, x0 - 16, ymid - 8);
    at(pRk, x0 - 16, ymid + 12);
    at(pT, x0 + (k * h) / 2, y0 + 16);
    at(pTk, x0 + (k * h) / 2, y0 + 34);
    // busur θ/2 di C': dari arah M' (kiri) ke arah B' (kiri atas)
    const ra = 34;
    const phi = Math.atan2(-k * rPx, -k * h);
    pArc.setAttribute(
      'd',
      `M${Cx - ra} ${y0} A${ra} ${ra} 0 0 1 ${Cx + ra * Math.cos(phi)} ${y0 + ra * Math.sin(phi)}`,
    );
    const mid = (Math.PI + phi + 2 * Math.PI) / 2;
    at(pH, Cx + (ra + 22) * Math.cos(mid), y0 + (ra + 22) * Math.sin(mid));
    pSq.setAttribute('d', `M${x0 + 12} ${y0} L${x0 + 12} ${y0 - 12} L${x0} ${y0 - 12}`);
  }

  /** Pindahkan potongan keluar (true) atau kembalikan (false); beranimasi hanya saat maju. */
  async function movePiece(out: boolean, c: Ctx): Promise<void> {
    if (out === pieceOut) return;
    pieceOut = out;
    const from = out ? pieceFrom : pieceTo;
    const to = out ? pieceTo : pieceFrom;
    if (out) {
      el.classList.add('show-right');
      // sorot dulu segitiga yang akan diambil, lalu pindahkan
      if (c.dir > 0 && !(await sleep(650))) return;
      el.classList.add('show-piece');
    } else el.classList.remove('piece-done');
    gPiece.style.transform = to;
    if (c.dir > 0) {
      pieceMoving = true;
      await play(gPiece, [{ transform: from }, { transform: to }], {
        duration: PIECE_MS,
        easing: EASE,
        tag: 'cone',
      }).finished;
      pieceMoving = false;
    }
    if (out) el.classList.add('piece-done');
    else el.classList.remove('show-piece');
  }

  draw();

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as ConeState;
      for (const f of ['rad', 'diam', 'semi', 'tri', 'height', 'split', 'halves', 'right', 'areas'] as const)
        el.classList.toggle(`show-${f}`, !!s[f]);
      labOn = !!s.lab;
      el.classList.toggle('lab-on', labOn);
      // mundur/diselesaikan: kelas dan posisi potongan diterapkan ulang langsung (tanpa animasi)
      if (c.dir < 0) pieceOut = !s.piece;
      await movePiece(!!s.piece, c);
      const th0 = st.theta;
      const r0 = st.r;
      const th1 = s.theta ?? th0;
      const r1 = s.r ?? r0;
      if (c.dir > 0 && (th0 !== th1 || r0 !== r1)) {
        await tween({
          from: 0,
          to: 1,
          dur: 1100,
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
      const g = geometry(60, 4);
      const Ax = g.cx - g.rPx;
      const Bx = g.cx + g.rPx;
      return `<svg viewBox="0 0 ${VW} ${VH}" class="n-sketch vis-cone-sketch" aria-label="Sketsa kerucut es krim: tinggi t, sudut θ/2, jari-jari r">
        <path d="M${Ax} ${g.yAB} A${g.rPx} ${g.rPx} 0 0 1 ${Bx} ${g.yAB} Z" class="c-semi"/>
        <path d="M${Ax} ${g.yAB} L${Bx} ${g.yAB} L${g.cx} ${g.yC} Z" class="c-tri"/>
        <path d="M${g.cx} ${g.yAB} L${Bx} ${g.yAB} L${g.cx} ${g.yC} Z" class="c-right c-on"/>
        <line x1="${g.cx}" y1="${g.yAB}" x2="${g.cx}" y2="${g.yC}" class="c-cm c-on"/>
        <line x1="${g.cx}" y1="${g.yAB}" x2="${Bx}" y2="${g.yAB}" class="c-mb c-on"/>
        <text x="${Ax - 14}" y="${g.yAB}" class="c-pt" text-anchor="middle">A</text>
        <text x="${Bx + 14}" y="${g.yAB}" class="c-pt" text-anchor="middle">B</text>
        <text x="${g.cx}" y="${g.yC + 18}" class="c-pt" text-anchor="middle">C</text>
        <text x="${(g.cx + Bx) / 2}" y="${g.yAB - 10}" class="c-var c-r c-on" text-anchor="middle">r</text>
        <text x="${g.cx - 12}" y="${g.yAB + g.h * 0.55}" class="c-var c-t c-on" text-anchor="middle">t</text>
        <text x="${g.cx}" y="${g.yAB - g.rPx * 0.5}" class="c-var" text-anchor="middle">Y</text>
        <text x="${g.cx - g.rPx * 0.32}" y="${g.yAB + g.h * 0.36}" class="c-var" text-anchor="middle">X</text></svg>`;
    },
  };
}
