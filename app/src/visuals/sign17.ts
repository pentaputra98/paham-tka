/**
 * Adegan SVG "rambu rumah makan" soal 17 (alur guru, revisi pemilik v1.9; docs/rambu_rumah_makan.png).
 * Rambu dipandang sebagai TUMPUKAN empat bangun utuh: persegi biru, lingkaran besar hitam, lingkaran kecil
 * putih, salib merah. Warna yang terlihat = bangunnya dikurangi bangun di atasnya.
 *  - build: keempat bangun ditumpuk satu per satu (dengan daftar lapisan di kanan);
 *  - meas: ukuran dari gambar (40 cm, jari-jari besar 20 cm, jari-jari kecil 14 cm, 10 + w + 10 = 28);
 *  - lift: bangun di atas diangkat ke kanan sehingga tampak lubangnya (hitam = lingkaran besar − lingkaran
 *    kecil, biru = persegi − lingkaran besar, putih = lingkaran kecil − salib); untuk merah, lengan tegak
 *    dipisah dari lengan mendatar dan kotak tengah 8 × 8 (terhitung dua kali) disorot;
 *  - vals: label luas tiap warna.
 * Ukuran: sisi 40 cm, R = 20 cm, r = 14 cm, lengan 10 + 8 + 10 = 28 cm. Skala 7,5 px/cm.
 * Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Layer = 'blue' | 'black' | 'white' | 'red';
export type Lift = 'big' | 'small' | 'cross' | 'vbar';
export type Meas = '40' | 'R' | 'r' | 'w';
export interface SignState {
  /** tumpukan dibangun satu per satu (beranimasi saat maju) + daftar lapisan */
  build?: boolean;
  /** ukuran yang ditampilkan */
  meas?: Meas[];
  /** bangun yang diangkat ke kanan */
  lift?: Lift;
  /** kotak tengah 8 × 8 pada kedua lengan disorot (setelah lengan tegak dipisah) */
  ov?: boolean;
  /** rambu di bawah salib diredupkan (membahas merah) */
  dim?: boolean;
  /** label luas yang sudah dihitung */
  vals?: Layer[];
  [k: string]: unknown;
}

const VW = 620;
const VH = 372;
const K = 7.5;
const X0 = 24;
const Y0 = 20;
const S = 40 * K;
const CX = X0 + S / 2;
const CY = Y0 + S / 2;
const R = 20 * K;
const RI = 14 * K;
const HW = 4 * K;
/** pusat daerah kanan tempat bangun yang diangkat diletakkan */
const LX = 500;
const LIFT: Record<Lift, { s: number; label: string }> = {
  big: { s: 0.5, label: 'lingkaran besar, r = 20' },
  small: { s: 0.62, label: 'lingkaran kecil, r = 14' },
  cross: { s: 0.7, label: 'salib merah' },
  vbar: { s: 1, label: 'lengan tegak 28 × 8' },
};
const LIFTS: Lift[] = ['big', 'small', 'cross', 'vbar'];
const LAYERS: Layer[] = ['blue', 'black', 'white', 'red'];
/** luas dari docs/pembahasan25.md soal 17 */
const VAL: Record<Layer, [string, number, number]> = {
  black: ['640,56', CX, CY + (R + RI) / 2],
  blue: ['344', X0 + 26, Y0 + 24],
  red: ['384', CX, CY + 72],
  white: ['231,44', CX - 61, CY + 52],
};
const LEGEND: Array<[Layer, string]> = [
  ['blue', 'persegi'],
  ['black', 'lingkaran besar'],
  ['white', 'lingkaran kecil'],
  ['red', 'salib'],
];

const hbar = `M${CX - RI} ${CY - HW}H${CX + RI}V${CY + HW}H${CX - RI}Z`;
const vbar = `M${CX - HW} ${CY - RI}H${CX + HW}V${CY + RI}H${CX - HW}Z`;
const ovRect = `<rect class="sg-ov" x="${CX - HW}" y="${CY - HW}" width="${2 * HW}" height="${2 * HW}"/>`;

let uid = 0;
/** Markup rambu; `id` membedakan clipPath antara panggung dan sketsa catatan. */
function markup(id: string, live: boolean): string {
  const src = (name: string): string => (live ? ` data-src="${name}"` : '');
  const clip = `clip-path="url(#${id}-disk)"`;
  const vals = LAYERS.map(
    (l) =>
      `<text class="sg-val sg-val-${l}" data-val="${l}" x="${VAL[l][1]}" y="${VAL[l][2]}" text-anchor="middle" dominant-baseline="middle">${VAL[l][0]}</text>`,
  ).join('');
  const legend = LEGEND.map(
    ([l, t], i) =>
      `<g class="sg-leg" data-leg="${i}"><rect class="sg-leg-sw sg-${l}" x="${LX - 98}" y="${70 + i * 52}" width="22" height="22" rx="4"/>
      <text class="sg-lbl" x="${LX - 66}" y="${81 + i * 52}" dominant-baseline="middle">${i + 1}. ${t}</text></g>`,
  ).join('');
  const liftLbl = LIFTS.map(
    (l) =>
      `<text class="sg-lbl sg-lift-lbl" data-lift-lbl="${l}" x="${LX}" y="${VH - 18}" text-anchor="middle">${LIFT[l].label}</text>`,
  ).join('');
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Rambu: persegi biru 40 cm, lingkaran hitam, lingkaran putih berjari-jari 14 cm, dan salib merah"${live ? '' : ' class="n-sketch show-m-40 show-m-r show-m-w"'}>
  <defs><clipPath id="${id}-disk"><circle cx="${CX}" cy="${CY}" r="${RI}"/></clipPath></defs>
  <rect class="sg-l sg-blue" data-layer="blue" x="${X0}" y="${Y0}" width="${S}" height="${S}"/>
  <circle class="sg-hole" data-hole="big" cx="${CX}" cy="${CY}" r="${R}"/>
  <g class="sg-g" data-g="big">
    <circle class="sg-l sg-black" data-layer="black" cx="${CX}" cy="${CY}" r="${R}"/>
    <circle class="sg-hole" data-hole="small" cx="${CX}" cy="${CY}" r="${RI}"/>
    <g class="sg-g" data-g="small">
      <circle class="sg-l sg-white" data-layer="white" cx="${CX}" cy="${CY}" r="${RI}"/>
      <g class="sg-hole" data-hole="cross"><path d="${hbar}" ${clip}/><path d="${vbar}" ${clip}/></g>
      <rect class="sg-dimmer" x="${X0 - 2}" y="${Y0 - 2}" width="${S + 4}" height="${S + 4}"/>
      <g class="sg-g" data-g="cross" data-layer="red">
        <path class="sg-red" d="${hbar}" ${clip}/>${ovRect}
        <g class="sg-g" data-g="vbar"><path class="sg-red" d="${vbar}" ${clip}/>${ovRect}</g>
      </g>
    </g>
  </g>
  <g class="sg-m sg-m-40">
    <path class="sg-arrow" d="M${X0} ${Y0 + S + 16}H${X0 + S}M${X0 + 8} ${Y0 + S + 11}L${X0} ${Y0 + S + 16}L${X0 + 8} ${Y0 + S + 21}M${X0 + S - 8} ${Y0 + S + 11}L${X0 + S} ${Y0 + S + 16}L${X0 + S - 8} ${Y0 + S + 21}"/>
    <text class="sg-lbl" x="${CX}" y="${Y0 + S + 38}" text-anchor="middle"${src('g-40')}>40 cm</text>
  </g>
  <g class="sg-m sg-m-R">
    <path class="sg-r" d="M${CX} ${CY}V${CY - R}"/>
    <text class="sg-lbl sg-on-dark" x="${CX - 10}" y="${CY - R + 40}" text-anchor="end"${src('g-20')}>20 cm</text>
  </g>
  <g class="sg-m sg-m-r">
    <path class="sg-r" d="M${CX} ${CY}H${CX + RI}"/>
    <text class="sg-lbl sg-on-red" x="${CX + 58}" y="${CY - 11}" text-anchor="middle"${src('g-14')}>14 cm</text>
  </g>
  <g class="sg-m sg-m-w">
    <text class="sg-lbl sg-on-white" x="${CX - (RI + HW) / 2}" y="${CY - HW - 10}" text-anchor="middle"${src('g-10a')}>10 cm</text>
    <text class="sg-lbl sg-on-white" x="${CX + (RI + HW) / 2}" y="${CY - HW - 10}" text-anchor="middle"${src('g-10b')}>10 cm</text>
    <path class="sg-r" d="M${CX - HW} ${CY - RI + 30}H${CX + HW}"/>
    <text class="sg-lbl sg-on-red" x="${CX}" y="${CY - RI + 22}" text-anchor="middle"${src('g-w')}>w</text>
    <path class="sg-arrow sg-arrow-ink" d="M${CX - RI} ${CY + HW + 14}H${CX + RI}"/>
    <text class="sg-lbl sg-on-white" x="${CX - 40}" y="${CY + HW + 32}" text-anchor="middle"${src('g-28')}>28 cm</text>
  </g>
  ${live ? `<g class="sg-legend">${legend}</g>${liftLbl}<text class="sg-lbl sg-ov-lbl" x="${LX}" y="${Y0 + 12}" text-anchor="middle">8 × 8 terhitung dua kali</text>${vals}` : ''}
</svg>`;
}

/** transform bangun yang diangkat: ke pusat daerah kanan, diperkecil (pusat skala = pusat rambu) */
const liftT = (l: Lift): string => `translate(${LX - CX}px, 0px) scale(${LIFT[l].s})`;

export function createSign(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-sign';
  el.innerHTML = markup(`sg${++uid}`, true);
  const q = <T extends Element>(sel: string): T => el.querySelector<T>(sel)!;
  const groups = Object.fromEntries(LIFTS.map((l) => [l, q<SVGGElement>(`[data-g="${l}"]`)])) as Record<
    Lift,
    SVGGElement
  >;
  for (const g of Object.values(groups)) {
    g.style.transformBox = 'view-box';
    g.style.transformOrigin = `${CX}px ${CY}px`;
  }
  const vals = [...el.querySelectorAll<SVGElement>('[data-val]')];
  const stack = [
    q<SVGElement>('[data-layer="blue"]'),
    q<SVGElement>('.sg-black'),
    q<SVGElement>('.sg-white'),
    q<SVGElement>('[data-g="cross"]'),
  ];
  const legs = [...el.querySelectorAll<SVGElement>('[data-leg]')];
  let lifted: Lift | undefined;
  let built = false;

  /** angkat / kembalikan bangun; beranimasi hanya saat maju */
  async function setLift(next: Lift | undefined, c: Ctx): Promise<void> {
    if (next === lifted) return;
    const prev = lifted;
    lifted = next;
    el.dataset.lift = next ?? '';
    const anim = c.dir > 0 && !reducedMotion();
    const runs: Array<Promise<boolean>> = [];
    for (const l of LIFTS) {
      const g = groups[l];
      const want = l === next ? liftT(l) : 'none';
      const had = l === prev ? liftT(l) : 'none';
      g.style.transform = want;
      if (anim && want !== had)
        runs.push(
          play(g, [{ transform: had }, { transform: want }], { duration: 1100, easing: EASE, tag: 'sign' })
            .finished,
        );
    }
    await Promise.all(runs);
  }

  /** tumpuk keempat bangun satu per satu (persegi → lingkaran besar → lingkaran kecil → salib) */
  async function buildUp(): Promise<void> {
    const runs = stack.map(
      (e, i) =>
        play(
          e,
          [
            { opacity: 0, transform: 'translateY(-18px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 650, delay: i * 900, easing: EASE_OUT, fill: 'backwards', tag: 'sign' },
        ).finished,
    );
    legs.forEach((g, i) =>
      play(g, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 400,
        delay: i * 900,
        fill: 'backwards',
        tag: 'sign',
      }),
    );
    await Promise.all(runs);
  }

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as SignState;
      for (const m of ['40', 'R', 'r', 'w'] as const)
        el.classList.toggle(`show-m-${m}`, !!s.meas?.includes(m));
      el.classList.toggle('show-legend', !!s.build);
      el.classList.toggle('show-ov', !!s.ov);
      el.classList.toggle('show-dim', !!s.dim);
      for (const v of vals) v.classList.toggle('on', !!s.vals?.includes(v.dataset.val as Layer));
      if (s.build && c.dir > 0 && (!built || c.replay) && !reducedMotion()) {
        built = true;
        await setLift(undefined, c);
        await buildUp();
        return;
      }
      if (s.build) built = true;
      await setLift(s.lift, c);
    },
    sketch: () => markup('sgn', false),
  };
}
