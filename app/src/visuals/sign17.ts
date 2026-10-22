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
 *  - quart (Hati-hati, pertanyaan siswa v1.13): empat potongan putih tampil sendiri, digeser ke tengah sampai celah
 *    salib tertutup ('merge'), lalu lingkaran r = 10 putus-putus ditumpuk ('ring10'): lingkaran itu menonjol keluar
 *    karena potongan putih lebih pipih (lengkungnya milik lingkaran r = 14, bukan seperempat lingkaran r = 10).
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
  /** kotak tengah 8 × 8 disorot (lengan tegak dipisah: di kedua lengan; salib utuh: di tengah salib) */
  ov?: boolean;
  /** sorot satu lengan salib utuh beserta ukurannya: h = lengan mendatar, v = lengan tegak */
  arm?: 'h' | 'v';
  /** empat potongan putih: tampil di tempat, digeser ke tengah, atau digeser + lingkaran r = 10 ditumpuk */
  quart?: 'show' | 'merge' | 'ring10';
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

/** kuadran potongan putih (tanda x, tanda y; y ke bawah) */
const QUARTS: Array<[1 | -1, 1 | -1]> = [
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
];
/** potongan putih sebenarnya: di antara dua lengan salib dan lengkung lingkaran r = 14 */
function quartPath(sx: number, sy: number): string {
  const x1 = Math.sqrt(RI * RI - HW * HW);
  const p = (dx: number, dy: number): string => `${(CX + sx * dx).toFixed(1)} ${(CY + sy * dy).toFixed(1)}`;
  return `M${p(HW, HW)}L${p(x1, HW)}A${RI} ${RI} 0 0 ${sx * sy > 0 ? 1 : 0} ${p(HW, x1)}Z`;
}

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
        <path class="sg-red" data-arm="h" d="${hbar}" ${clip}/>${ovRect}
        <g class="sg-g" data-g="vbar"><path class="sg-red" data-arm="v" d="${vbar}" ${clip}/>${ovRect}</g>
        <path class="sg-arm-line" data-arm-line="h" d="${hbar}" ${clip}/>
        <path class="sg-arm-line" data-arm-line="v" d="${vbar}" ${clip}/>
      </g>
    </g>
  </g>
  <g class="sg-m sg-m-40">
    <path class="sg-arrow" d="M${X0} ${Y0 + S + 16}H${X0 + S}M${X0 + 8} ${Y0 + S + 11}L${X0} ${Y0 + S + 16}L${X0 + 8} ${Y0 + S + 21}M${X0 + S - 8} ${Y0 + S + 11}L${X0 + S} ${Y0 + S + 16}L${X0 + S - 8} ${Y0 + S + 21}"/>
    <text class="sg-lbl" x="${CX}" y="${Y0 + S + 38}" text-anchor="middle"${src('g-40')}>40 cm</text>
  </g>
  <g class="sg-m sg-m-R">
    <path class="sg-r" d="M${CX} ${CY}V${CY - R}"/>
    <text class="sg-lbl sg-on-dark" x="${CX - 10}" y="${CY - R + 40}" text-anchor="end"${src('g-R')}>20 cm</text>
  </g>
  <g class="sg-m sg-m-r">
    <path class="sg-r" d="M${CX} ${CY}H${CX + RI}"/>
    <text class="sg-lbl sg-on-red" x="${CX + 58}" y="${CY - 11}" text-anchor="middle"${src('g-r')}>14 cm</text>
  </g>
  <g class="sg-m sg-m-w">
    <text class="sg-lbl sg-on-white" x="${CX - (RI + HW) / 2}" y="${CY - HW - 10}" text-anchor="middle"${src('g-10a')}>10 cm</text>
    <text class="sg-lbl sg-on-white" x="${CX + (RI + HW) / 2}" y="${CY - HW - 10}" text-anchor="middle"${src('g-10b')}>10 cm</text>
    <path class="sg-r" d="M${CX - HW} ${CY - RI + 30}H${CX + HW}"/>
    <text class="sg-lbl sg-on-red" x="${CX}" y="${CY - RI + 22}" text-anchor="middle"${src('g-w')}>w</text>
    <path class="sg-arrow sg-arrow-ink" d="M${CX - RI} ${CY + HW + 14}H${CX + RI}"/>
    <text class="sg-lbl sg-on-white" x="${CX - 40}" y="${CY + HW + 32}" text-anchor="middle"${src('g-28')}>28 cm</text>
  </g>
  <g class="sg-m sg-arm-h">
    <path class="sg-arrow sg-arrow-ink" d="M${CX - RI + 4} ${CY + HW + 9}H${CX + RI - 4}"/>
    <text class="sg-lbl sg-on-white" x="${CX - 62}" y="${CY + HW + 27}" text-anchor="middle"${src('g-h28')}>28 cm</text>
    <text class="sg-lbl sg-on-dark" x="${CX + RI + 6}" y="${CY}" dominant-baseline="middle"${src('g-h8')}>8 cm</text>
  </g>
  <g class="sg-m sg-arm-v">
    <path class="sg-arrow sg-arrow-ink" d="M${CX + HW + 9} ${CY - RI + 4}V${CY + RI - 4}"/>
    <text class="sg-lbl sg-on-white" x="${CX + HW + 16}" y="${CY - RI + 46}"${src('g-v28')}>28 cm</text>
    <text class="sg-lbl sg-on-dark" x="${CX}" y="${CY - RI - 10}" text-anchor="middle"${src('g-v8')}>8 cm</text>
  </g>
  ${
    live
      ? `<rect class="sg-qdim" x="${X0 - 2}" y="${Y0 - 2}" width="${S + 4}" height="${S + 4}"/>
  <circle class="sg-q10" cx="${CX}" cy="${CY}" r="${10 * K}"/>
  <g class="sg-quart">${QUARTS.map(([sx, sy]) => `<path class="sg-qp" data-q="${sx}${sy}" d="${quartPath(sx, sy)}"/>`).join('')}</g>
  <circle class="sg-q10-line" cx="${CX}" cy="${CY}" r="${10 * K}"/>
  <text class="sg-lbl sg-q10-lbl" x="${LX}" y="${CY - 40}" text-anchor="middle">lingkaran r = 10</text>
  <text class="sg-lbl sg-q10-lbl2" x="${LX}" y="${CY - 16}" text-anchor="middle">menonjol keluar</text>`
      : ''
  }
  <text class="sg-lbl sg-on-white sg-ov-in" x="${CX}" y="${CY}" text-anchor="middle" dominant-baseline="middle"${src('g-ov')}>8×8</text>
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
  let merged = false;
  const qps = [...el.querySelectorAll<SVGPathElement>('.sg-qp')];

  /** geser keempat potongan putih ke tengah (celah salib tertutup) atau kembalikan */
  async function setMerge(on: boolean, c: Ctx): Promise<void> {
    if (on === merged) return;
    merged = on;
    const runs = qps.map((p, i) => {
      const [sx, sy] = QUARTS[i]!;
      const to = on ? `translate(${-sx * HW}px, ${-sy * HW}px)` : 'none';
      const from = on ? 'none' : `translate(${-sx * HW}px, ${-sy * HW}px)`;
      p.style.transform = to;
      return c.dir > 0 && !reducedMotion()
        ? play(p, [{ transform: from }, { transform: to }], { duration: 1200, easing: EASE, tag: 'sign' })
            .finished
        : Promise.resolve(true);
    });
    await Promise.all(runs);
  }

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
      el.classList.toggle('arm-h', s.arm === 'h');
      el.classList.toggle('arm-v', s.arm === 'v');
      el.classList.toggle('ov-whole', !!s.ov && s.lift !== 'vbar');
      el.classList.toggle('show-dim', !!s.dim);
      el.classList.toggle('show-quart', !!s.quart);
      el.classList.toggle('show-q10', s.quart === 'ring10');
      for (const v of vals) v.classList.toggle('on', !!s.vals?.includes(v.dataset.val as Layer));
      if (s.build && c.dir > 0 && (!built || c.replay) && !reducedMotion()) {
        built = true;
        await setLift(undefined, c);
        await buildUp();
        return;
      }
      if (s.build) built = true;
      await setLift(s.lift, c);
      await setMerge(s.quart === 'merge' || s.quart === 'ring10', c);
    },
    sketch: () => markup('sgn', false),
  };
}
