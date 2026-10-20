/**
 * Adegan SVG "rambu rumah makan" soal 17 (PRD §5.1; pembahasan25.md soal 17, docs/rambu_rumah_makan.png).
 * Lapisan tanpa tumpang tindih agar sorotan satu warna tidak tembus ke warna lain:
 * biru = persegi − lingkaran R, hitam = cincin R/r, putih = cakram − salib, merah = salib dipotong cakram.
 * Ukuran dari gambar: sisi 40 cm, R = 20 cm, r = 14 cm, lengan 10 + 8 + 10 = 28 cm. Skala 7,5 px/cm.
 */
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Layer = 'blue' | 'black' | 'white' | 'red';
export interface SignState {
  /** warna yang disorot; warna lain diredupkan */
  focus?: Layer;
  /** tampilkan lebar lengan 8 cm */
  w?: boolean;
  /** label luas yang sudah dihitung */
  vals?: Layer[];
  [k: string]: unknown;
}

const VW = 440;
const VH = 372;
const K = 7.5;
const X0 = 30;
const Y0 = 16;
const S = 40 * K;
const CX = X0 + S / 2;
const CY = Y0 + S / 2;
const R = 20 * K;
const RI = 14 * K;
const HW = 4 * K;
const LAYERS: Layer[] = ['blue', 'black', 'white', 'red'];
/** luas dari docs/pembahasan25.md soal 17 (baris a3, a5, b3, b5) */
const VAL: Record<Layer, [string, number, number]> = {
  black: ['640,56', CX, CY + (R + RI) / 2],
  blue: ['344', X0 + 26, Y0 + 24],
  red: ['384', CX, CY + 72],
  white: ['231,44', CX - 61, CY + 52],
};

const circle = (r: number): string =>
  `M${CX - r} ${CY}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
const cross = `M${CX - RI} ${CY - HW}H${CX + RI}V${CY + HW}H${CX - RI}Z M${CX - HW} ${CY - RI}H${CX + HW}V${CY + RI}H${CX - HW}Z`;

let uid = 0;
/** Markup rambu; `id` membedakan clipPath/mask antara panggung dan sketsa catatan. */
function markup(id: string, live: boolean): string {
  const src = (name: string): string => (live ? ` data-src="${name}"` : '');
  const vals = LAYERS.map(
    (l) =>
      `<text class="sg-val sg-val-${l}" data-val="${l}" x="${VAL[l][1]}" y="${VAL[l][2]}" text-anchor="middle" dominant-baseline="middle">${VAL[l][0]}</text>`,
  ).join('');
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Rambu: persegi biru 40 cm, cincin hitam, cakram putih berjari-jari 14 cm, dan salib merah"${live ? '' : ' class="n-sketch"'}>
  <defs>
    <clipPath id="${id}-disk"><path d="${circle(RI)}"/></clipPath>
    <mask id="${id}-hole"><rect width="${VW}" height="${VH}" fill="white"/><path d="${cross}" fill="black"/></mask>
  </defs>
  <path class="sg-l sg-blue" data-layer="blue" fill-rule="evenodd" d="M${X0} ${Y0}h${S}v${S}h${-S}Z ${circle(R)}"/>
  <path class="sg-l sg-black" data-layer="black" fill-rule="evenodd" d="${circle(R)} ${circle(RI)}"/>
  <path class="sg-l sg-white" data-layer="white" d="${circle(RI)}" mask="url(#${id}-hole)"/>
  <path class="sg-l sg-red" data-layer="red" d="${cross}" clip-path="url(#${id}-disk)"/>
  <g class="sg-dim">
    <path class="sg-arrow" d="M${X0} ${Y0 + S + 16}H${X0 + S}M${X0 + 8} ${Y0 + S + 11}L${X0} ${Y0 + S + 16}L${X0 + 8} ${Y0 + S + 21}M${X0 + S - 8} ${Y0 + S + 11}L${X0 + S} ${Y0 + S + 16}L${X0 + S - 8} ${Y0 + S + 21}"/>
    <text class="sg-lbl" x="${CX}" y="${Y0 + S + 40}" text-anchor="middle"${src('g-40')}>40 cm</text>
    <path class="sg-arrow" d="M${X0 + S + 16} ${Y0}V${Y0 + S}M${X0 + S + 11} ${Y0 + 8}L${X0 + S + 16} ${Y0}L${X0 + S + 21} ${Y0 + 8}M${X0 + S + 11} ${Y0 + S - 8}L${X0 + S + 16} ${Y0 + S}L${X0 + S + 21} ${Y0 + S - 8}"/>
    <text class="sg-lbl" x="${X0 + S + 52}" y="${CY}" text-anchor="middle" dominant-baseline="middle">40 cm</text>
    <path class="sg-r" d="M${CX} ${CY}H${CX + RI}"/>
    <text class="sg-lbl sg-on-red" x="${CX + 58}" y="${CY - 11}" text-anchor="middle"${src('g-14')}>14 cm</text>
    <text class="sg-lbl sg-on-white" x="${CX - (RI + HW) / 2}" y="${CY - HW - 10}" text-anchor="middle"${src('g-10a')}>10 cm</text>
    <text class="sg-lbl sg-on-white" x="${CX + (RI + HW) / 2}" y="${CY - HW - 10}" text-anchor="middle"${src('g-10b')}>10 cm</text>
    <g class="sg-w"><path class="sg-r" d="M${CX - HW} ${CY - RI + 30}H${CX + HW}"/>
      <text class="sg-lbl sg-on-red" x="${CX}" y="${CY - RI + 22}" text-anchor="middle">8 cm</text></g>
  </g>
  ${live ? vals : ''}
</svg>`;
}

export function createSign(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-sign';
  el.innerHTML = markup(`sg${++uid}`, true);
  const layers = [...el.querySelectorAll<SVGElement>('[data-layer]')];
  const vals = [...el.querySelectorAll<SVGElement>('[data-val]')];

  return {
    el,
    apply(state, _c: Ctx) {
      const s = state as SignState;
      el.classList.toggle('has-focus', !!s.focus);
      for (const l of layers) l.classList.toggle('on', l.dataset.layer === s.focus);
      el.classList.toggle('show-w', !!s.w);
      for (const v of vals) v.classList.toggle('on', !!s.vals?.includes(v.dataset.val as Layer));
    },
    sketch: () => markup('sgn', false),
  };
}
