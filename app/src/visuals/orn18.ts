/**
 * Adegan SVG "ornamen kaca patri" soal 18 (alur guru, revisi pemilik v1.12; docs/ornamen_kaca_patri.png).
 * Ornamen dipandang sebagai TUMPUKAN: lingkaran merah utuh, di atasnya persegi miring (4 segitiga hijau/kuning)
 * yang sudutnya menyentuh lingkaran. Kaca merah = lingkaran − persegi.
 *  - build: lingkaran lalu keempat segitiga ditumpuk satu per satu;
 *  - lift: persegi diangkat ke kanan, tersisa empat kaca merah (lubang putus-putus);
 *  - tri: satu segitiga disorot, kedua kakinya jari-jari r;
 *  - v456: label 456 pada keempat kaca merah (sumber terbang);
 *  - frame: kaca dilepas, tersisa kerangka logam; hl menyorot satu jenis garis beserta ukurannya
 *    (ring = lingkaran, diam = dua diameter, side = sisi persegi dengan kaki 40 dan 40);
 *  - ruler: penggaris 0–8 m: 'parts' = batang kerangka (lingkaran + diameter + sisi), 'zone' = zona pas
 *    637,5–737,5 cm, 1/2/3 = logam pilihan (2 × A, 1 × B, 1 × C) dibandingkan dengan zona.
 * Angka dari docs/pembahasan25.md soal 18 (r = 40 cm; 251,2 + 160 + 226,27 ≈ 637,5 cm). Gerak transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface OrnState {
  build?: boolean;
  lift?: boolean;
  tri?: boolean;
  v456?: boolean;
  frame?: boolean;
  hl?: 'ring' | 'diam' | 'side';
  /** label r = 40 cm pada gambar (setelah jari-jari diketahui) */
  r40?: boolean;
  ruler?: 'parts' | 'zone' | 1 | 2 | 3;
  [k: string]: unknown;
}

const VW = 620;
const VH = 372;
const CX = 175;
const CY = 186;
const R = 150;
const LX = 500;
/** penggaris: 0–800 cm */
const RX0 = 50;
const RK = 0.68;
const rx = (cm: number): number => RX0 + cm * RK;
const PARTS: Array<[string, number, string, string]> = [
  ['ring', 251.2, '251,2', 'lingkaran'],
  ['diam', 160, '160', '2 diameter'],
  ['side', 226.27, '226,27', '4 sisi'],
];
const TOTAL = 637.5;
const LIMIT = 737.5;
const LOGAM: Record<1 | 2 | 3, { parts: number[]; label: string; cm: number }> = {
  1: { parts: [400, 400], label: '2 × logam A = 800 cm', cm: 800 },
  2: { parts: [500], label: '1 × logam B = 500 cm', cm: 500 },
  3: { parts: [650], label: '1 × logam C = 650 cm', cm: 650 },
};

const V = [
  [CX, CY - R],
  [CX + R, CY],
  [CX, CY + R],
  [CX - R, CY],
] as const;
const pt = (p: readonly [number, number]): string => `${p[0]} ${p[1]}`;
/** segitiga i: pusat, V[i], V[i+1] (0 = kanan atas kuning, 1 = kanan bawah hijau, 2 = kiri bawah kuning, 3 = kiri atas hijau) */
const tri = (i: number): string => `M${CX} ${CY}L${pt(V[i]!)}L${pt(V[(i + 1) % 4]!)}Z`;
const TRI_CLS = ['yellow', 'green', 'yellow', 'green'];

let uid = 0;
function markup(live: boolean): string {
  const src = (n: string): string => (live ? ` data-src="${n}"` : '');
  const sq = V.map(pt).join(' L');
  const d456 = (R + R * Math.SQRT1_2) / 2;
  const v456 = [-45, 45, 135, 225]
    .map((a, i) => {
      const t = (a * Math.PI) / 180;
      return `<text class="or-val" x="${(CX + d456 * Math.cos(t)).toFixed(1)}" y="${(CY + d456 * Math.sin(t)).toFixed(1)}"${i === 0 ? src('g-456') : ''}>456</text>`;
    })
    .join('');
  const ticks = Array.from({ length: 9 }, (_, i) => {
    const x = rx(i * 100);
    return `<path class="or-tick" d="M${x} 300V312"/><text class="or-tick-lbl" x="${x}" y="328">${i === 0 ? '0' : `${i} m`}</text>`;
  }).join('');
  let acc = 0;
  const parts = PARTS.map(([k, cm, txt, name]) => {
    const x = rx(acc);
    acc += cm;
    return `<g class="or-part" data-part="${k}"><rect class="or-bar or-bar-${k}" x="${x}" y="96" width="${cm * RK}" height="34" rx="3"/>
      <text class="or-bar-lbl" x="${x + (cm * RK) / 2}" y="113">${txt}</text>
      <text class="or-bar-name" x="${x + (cm * RK) / 2}" y="146">${name}</text></g>`;
  }).join('');
  return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Ornamen kaca patri: lingkaran dengan persegi miring yang sudutnya menyentuh lingkaran, empat segitiga hijau dan kuning, empat kaca merah; kerangka logam berupa lingkaran, empat sisi persegi, dan dua diameter"${live ? '' : ' class="n-sketch"'}>
  <g class="or-orn">
    <circle class="or-red" cx="${CX}" cy="${CY}" r="${R}"/>
    <path class="or-hole" d="M${sq}Z"/>
    <g class="or-g" data-g="sq">
      ${[0, 1, 2, 3].map((i) => `<path class="or-tri or-${TRI_CLS[i]}" data-tri="${i}" d="${tri(i)}"/>`).join('')}
      <path class="or-tri-hl" d="${tri(0)}"/>
      <g class="or-legs"><path class="or-leg" d="M${CX} ${CY}V${CY - R}M${CX} ${CY}H${CX + R}"/>
        <text class="or-lbl or-ink" x="${CX - 12}" y="${CY - R / 2}">r</text>
        <text class="or-lbl or-ink" x="${CX + R / 2}" y="${CY + 16}">r</text></g>
    </g>
    ${live ? v456 : ''}
    <g class="or-frame">
      <circle class="or-f or-f-ring" cx="${CX}" cy="${CY}" r="${R}"/>
      <path class="or-f or-f-diam" d="M${CX - R} ${CY}H${CX + R}M${CX} ${CY - R}V${CY + R}"/>
      <path class="or-f or-f-side" d="M${sq}Z"/>
      <path class="or-f-side1" d="M${pt(V[0])}L${pt(V[1])}"/>
    </g>
    <g class="or-m or-m-r40"><path class="or-dim" d="M${CX} ${CY}L${(CX + R * Math.SQRT1_2).toFixed(1)} ${(CY + R * Math.SQRT1_2).toFixed(1)}"/>
      <text class="or-lbl or-lbl-out" x="${(CX + 0.84 * R * Math.SQRT1_2 + 14).toFixed(1)}" y="${(CY + 0.84 * R * Math.SQRT1_2 - 8).toFixed(1)}"${src('g-r40')}>40 cm</text></g>
    <g class="or-m or-m-diam"><text class="or-lbl" x="${CX - R / 2}" y="${CY - 10}"${src('g-80')}>80 cm</text>
      <text class="or-lbl" x="${CX + 34}" y="${CY + R / 2 + 10}">80 cm</text></g>
    <g class="or-m or-m-side"><path class="or-dim" d="M${CX} ${CY}V${CY - R}M${CX} ${CY}H${CX + R}"/>
      <text class="or-lbl" x="${CX - 26}" y="${CY - R / 2}"${src('g-40a')}>40</text>
      <text class="or-lbl" x="${CX + R / 2}" y="${CY + 20}"${src('g-40b')}>40</text>
      <text class="or-lbl or-side-q" x="${CX + R / 2 + 22}" y="${CY - R / 2 - 14}">sisi</text></g>
  </g>
  ${
    live
      ? `<text class="or-lbl or-lift-lbl" x="${LX}" y="${VH - 22}">persegi (4 segitiga)</text>
  <g class="or-ruler">
    <path class="or-axis" d="M${RX0} 300H${rx(800)}"/>${ticks}
    <rect class="or-zone" x="${rx(TOTAL)}" y="70" width="${(LIMIT - TOTAL) * RK}" height="222"/>
    <text class="or-zone-lbl" x="${rx((TOTAL + LIMIT) / 2)}" y="60">zona pas</text>
    <text class="or-row-lbl" x="${RX0}" y="86">kerangka ≈ 637,5 cm</text>
    ${parts}
    <path class="or-limit" d="M${rx(TOTAL)} 88V292"/>
    <g class="or-logam"></g>
  </g>`
      : ''
  }
</svg>`;
}

export function createOrn(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-orn';
  el.dataset.uid = String(++uid);
  el.innerHTML = markup(true);
  const sq = el.querySelector<SVGGElement>('[data-g="sq"]')!;
  sq.style.transformBox = 'view-box';
  sq.style.transformOrigin = `${CX}px ${CY}px`;
  const logamG = el.querySelector<SVGGElement>('.or-logam')!;
  const parts = [...el.querySelectorAll<SVGGElement>('[data-part]')];
  const stack = [el.querySelector<SVGElement>('.or-red')!, ...el.querySelectorAll<SVGElement>('.or-tri')];
  let lifted = false;
  let built = false;
  let ruler: OrnState['ruler'];

  const grow = (g: SVGElement, delay: number): Promise<boolean> => {
    g.style.transformBox = 'fill-box';
    g.style.transformOrigin = 'left center';
    return play(g, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: 700,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'orn',
    }).finished;
  };

  async function setLift(on: boolean, c: Ctx): Promise<void> {
    if (on === lifted) return;
    lifted = on;
    el.classList.toggle('is-lift', on);
    const off = 'none';
    const up = `translate(${LX - CX}px, 0px) scale(0.55)`;
    sq.style.transform = on ? up : off;
    if (c.dir > 0 && !reducedMotion())
      await play(sq, [{ transform: on ? off : up }, { transform: on ? up : off }], {
        duration: 1100,
        easing: EASE,
        tag: 'orn',
      }).finished;
  }

  async function setRuler(next: OrnState['ruler'], c: Ctx): Promise<void> {
    const prev = ruler;
    ruler = next;
    el.classList.toggle('is-ruler', !!next);
    el.classList.toggle('show-zone', next !== undefined && next !== 'parts');
    const n = typeof next === 'number' ? next : 0;
    if (typeof prev === 'number' ? prev !== n : n !== 0)
      logamG.innerHTML = n ? logamMarkup(n as 1 | 2 | 3) : '';
    const anim = c.dir > 0 && !reducedMotion();
    if (!anim) return;
    // batang kerangka tersusun satu per satu saat penggaris pertama dibuka
    if (next && !prev) await Promise.all(parts.map((p, i) => grow(p, i * 650)));
    if (n && prev !== n) {
      const segs = [...logamG.querySelectorAll<SVGElement>('[data-seg]')];
      await Promise.all(segs.map((s, i) => grow(s, i * 600)));
      const v = logamG.querySelector<SVGElement>('.or-verdict');
      if (v) await play(v, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, tag: 'orn' }).finished;
    }
  }

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as OrnState;
      el.classList.toggle('show-tri', !!s.tri);
      el.classList.toggle('show-456', !!s.v456);
      el.classList.toggle('is-frame', !!s.frame);
      el.classList.toggle('show-r40', !!s.r40);
      for (const h of ['ring', 'diam', 'side'] as const) el.classList.toggle(`hl-${h}`, s.hl === h);
      if (s.build && c.dir > 0 && (!built || c.replay) && !reducedMotion()) {
        built = true;
        await setLift(false, c);
        await Promise.all(
          stack.map(
            (e, i) =>
              play(
                e,
                [
                  { opacity: 0, transform: 'translateY(-16px)' },
                  { opacity: 1, transform: 'none' },
                ],
                { duration: 600, delay: i * 700, easing: EASE_OUT, fill: 'backwards', tag: 'orn' },
              ).finished,
          ),
        );
      }
      if (s.build) built = true;
      await setLift(!!s.lift, c);
      await setRuler(s.ruler, c);
    },
    sketch: () => markup(false),
  };
}

function logamMarkup(n: 1 | 2 | 3): string {
  const L = LOGAM[n];
  let acc = 0;
  const segs = L.parts
    .map((cm, i) => {
      const x = rx(acc);
      acc += cm;
      return `<rect class="or-bar or-bar-logam" data-seg="${i}" x="${x}" y="196" width="${cm * RK}" height="34" rx="3"/>`;
    })
    .join('');
  const pas = L.cm >= TOTAL && L.cm <= LIMIT;
  const txt = L.cm < TOTAL ? 'tidak cukup' : L.cm > LIMIT ? 'sisa lebih dari 1 m' : 'masuk zona pas';
  return `<text class="or-row-lbl" x="${RX0}" y="186">${L.label}</text>${segs}
    <text class="or-verdict${pas ? ' is-pas' : ''}" x="${RX0}" y="252">${L.cm} cm: ${txt}</text>`;
}
