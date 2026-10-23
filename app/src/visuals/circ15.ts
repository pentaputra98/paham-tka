/**
 * Adegan SVG "lingkaran sepusat" soal 15 (alur guru, revisi pemilik v1.15; docs/lingkaran_A.png).
 * Bidang koordinat x ∈ [−7, 6], y ∈ [−5, 7] dengan Lingkaran A (pusat p(−3, 4), diameter 4).
 *  - cam: kamera memperbesar ke pusat p lalu bergeser ke sumbu x, sumbu y, atau ke jari-jari (transform pada
 *    grup kamera); tanpa cam = bingkai bagian atas bidang, 'wide' = bidang utuh;
 *  - rx / ry: garis putus-putus dari p ke sumbu x (label −3) dan ke sumbu y (label 4), sumber terbang;
 *  - count: dari p turun kotak demi kotak (1, 2) sampai titik terbawah lingkaran, lalu garis ke sumbu y (label 2);
 *  - rad: ruas jari-jari dari p ke titik terbawah dengan labelnya; lab mengganti label pusat dan jari-jari
 *    ('ask' = belum diketahui, 'ab' = bentuk baku, 'AB' = bentuk umum, 'num' = angka lingkaran A);
 *  - panel: tulisan di kanan bidang (dua bentuk persamaan, persamaan lingkaran A baku/jabaran/pindah ruas/umum);
 *  - dlab: label diameter 4 pada ruas garis tengah;
 *  - conc: lingkaran-lingkaran sepusat tumbuh dari p (jari-jari 1 dan 3): pusat sama, jari-jari boleh beda;
 *  - opts: lingkaran pilihan digambar dari pusat dan jari-jarinya; pusat yang sama dengan p disorot emas,
 *    yang berbeda merah.
 * Angka dari docs/pembahasan25.md soal 15 (titik terbawah (−3, 2) = pusat dikurangi jari-jari 2).
 * Gerak hanya transform/opacity.
 */
import { reducedMotion, sleep } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Opt = 'A' | 'B' | 'C' | 'D' | 'E';
/** p/x/y/r = diperbesar; 'wide' = bidang utuh (pilihan C di bawah sumbu x); tanpa cam = bingkai bawaan 'fit' */
export type Cam = 'p' | 'x' | 'y' | 'r' | 'wide';
export type Lab = 'ask' | 'ab' | 'AB' | 'num';
export type Panel = 'forms' | 'baku' | 'jabar' | 'pindah' | 'umum';
export interface CircState {
  cam?: Cam;
  rx?: boolean;
  ry?: boolean;
  count?: boolean;
  rad?: boolean;
  lab?: Lab;
  panel?: Panel;
  dlab?: boolean;
  conc?: boolean;
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
/** titik terbawah lingkaran A: pusat turun sejauh jari-jari 2 */
const LOW = 2;
/** tulisan samping (panel, catatan sepusat) di kanan sumbu y, di atas sumbu x */
const LX = sx(2.6);

type CamKey = Exclude<Cam, 'wide'> | 'fit';
/**
 * sasaran kamera: titik tengah layar (satuan bidang) dan perbesaran. 'fit' membingkai bagian atas bidang
 * (y ≥ −1) beserta tulisan samping, agar gambar tidak kecil di ponsel.
 */
const CAM: Record<CamKey, [number, number, number]> = {
  fit: [0.8, 3, 1.45],
  p: [-3, 4, 2.2],
  x: [-3, 1.7, 2],
  y: [-1.3, 4, 2],
  r: [-2, 3, 2],
};
const camT = (k: Cam | 'fit'): string => {
  if (k === 'wide') return 'none';
  const [cx, cy, s] = CAM[k];
  return `translate(${VW / 2 - s * sx(cx)}px, ${VH / 2 - s * sy(cy)}px) scale(${s})`;
};

/** label pusat dan jari-jari per mode */
const LAB: Record<Lab, [string, string]> = {
  ask: ['pusat = ?', 'r = ?'],
  ab: ['(a, b)', 'r'],
  AB: ['(−A/2, −B/2)', 'r'],
  num: ['(−3, 4)', 'r = 2'],
};

/** baris panel kanan: [teks, redup?] */
const PANEL: Record<Panel, Array<[string, boolean]>> = {
  forms: [
    ['bentuk baku:', true],
    ['(x−a)²+(y−b)²=r²', false],
    ['dijabarkan, umum:', true],
    ['x²+y²+Ax+By+C=0', false],
  ],
  baku: [
    ['bentuk baku:', true],
    ['(x+3)²+(y−4)²=4', false],
  ],
  jabar: [
    ['dijabarkan:', true],
    ['(x+3)² = x²+6x+9', false],
    ['(y−4)² = y²−8y+16', false],
  ],
  pindah: [
    ['4 pindah ruas:', true],
    ['... + 16 = 4', false],
    ['... + 16 − 4 = 0', false],
  ],
  umum: [
    ['bentuk umum:', true],
    ['x²+6x+y²−8y+21=0', false],
  ],
};

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
  const d = r * U * Math.SQRT1_2;
  return `<g class="c5-opt${same ? ' is-same' : ''}" data-opt="${o}">
    <circle class="c5-oc" cx="${sx(h)}" cy="${sy(k)}" r="${r * U}"/>
    <circle class="c5-op" cx="${sx(h)}" cy="${sy(k)}" r="5"/>
    <text class="c5-olbl${same ? ' c5-olbl-mid' : ''}" x="${same ? sx(h) : sx(h) + 9}" y="${same ? sy(k) + 2.55 * U : sy(k) - 9}">${o}: (${fmt(h)}, ${fmt(k)})</text>
    <text class="c5-olbl c5-orl${same ? ' c5-orl-l' : ''}" x="${same ? sx(h) - d - 4 : sx(h) + d + 4}" y="${sy(k) + d + 14}">r = ${r}</text></g>`;
}

export function createCirc(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-circ';
  const e1: [number, number] = [-4, 5.75];
  const e2: [number, number] = [-2, 2.25];
  const [px, py] = [sx(P[0]), sy(P[1])];
  el.innerHTML = `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Bidang koordinat dengan Lingkaran A berpusat di p(−3, 4) dan berjari-jari 2">
    <g class="c5-cam">
    <g class="c5-grids">${grid()}</g>
    <g class="c5-conc">
      <circle class="c5-cc" data-cc="1" cx="${px}" cy="${py}" r="${U}"/>
      <circle class="c5-cc" data-cc="3" cx="${px}" cy="${py}" r="${3 * U}"/>
      <text class="c5-note" x="${LX}" y="${sy(5)}">sepusat:</text>
      <text class="c5-note-s" x="${LX}" y="${sy(5) + 20}">pusat sama,</text>
      <text class="c5-note-s" x="${LX}" y="${sy(5) + 38}">jari-jari beda</text>
    </g>
    <g class="c5-panel"></g>
    <g class="c5-opts"></g>
    <circle class="c5-a" cx="${px}" cy="${py}" r="${2 * U}"/>
    <path class="c5-diam" d="M${sx(e1[0])} ${sy(e1[1])}L${sx(e2[0])} ${sy(e2[1])}"/>
    <circle class="c5-end" cx="${sx(e1[0])}" cy="${sy(e1[1])}" r="5"/>
    <circle class="c5-end" cx="${sx(e2[0])}" cy="${sy(e2[1])}" r="5"/>
    <text class="c5-albl" x="${sx(XMIN) + 4}" y="${sy(6.55)}">Lingkaran A</text>
    <g class="c5-rx">
      <path class="c5-dash" d="M${px} ${py}V${sy(0)}"/>
      <text class="c5-rlbl" x="${px}" y="${sy(0) + 30}" data-src="g-x">−3</text>
    </g>
    <g class="c5-ry">
      <path class="c5-dash" d="M${px} ${py}H${sx(0)}"/>
      <text class="c5-rlbl" x="${sx(0) + 32}" y="${py + 6}" data-src="g-y">4</text>
    </g>
    <g class="c5-count">
      <path class="c5-seg" d="M${px} ${py}V${sy(LOW)}"/>
      <path class="c5-mark" d="M${px - 7} ${sy(3)}h14M${px - 7} ${sy(LOW)}h14"/>
      <text class="c5-cnt" data-n="1" x="${px - 12}" y="${sy(3.5) + 6}">1</text>
      <text class="c5-cnt" data-n="2" x="${px - 12}" y="${sy(2.5) + 6}">2</text>
      <path class="c5-dash c5-low-dash" d="M${px} ${sy(LOW)}H${sx(0)}"/>
      <circle class="c5-low" cx="${px}" cy="${sy(LOW)}" r="6"/>
      <text class="c5-rlbl c5-low-lbl" x="${sx(0) + 32}" y="${sy(LOW) + 6}" data-src="g-low">2</text>
    </g>
    <g class="c5-rad">
      <path class="c5-seg" d="M${px} ${py}V${sy(LOW)}"/>
      <text class="c5-rl" x="${px - 10}" y="${sy(3) + 6}">r = 2</text>
    </g>
    <text class="c5-dlbl" x="${sx(-2.2)}" y="${sy(2.9)}" data-src="g-d">d = 4</text>
    <circle class="c5-p" cx="${px}" cy="${py}" r="6"/>
    <text class="c5-plbl" x="${px + 8}" y="${py - 10}" data-src="g-p">p</text>
    <text class="c5-pc" x="${px + 24}" y="${py - 10}"></text>
    </g>
  </svg>`;
  const cam = el.querySelector<SVGGElement>('.c5-cam')!;
  cam.style.transformBox = 'view-box';
  cam.style.transformOrigin = '0 0';
  cam.style.transform = camT('fit');
  const optG = el.querySelector<SVGGElement>('.c5-opts')!;
  const panelG = el.querySelector<SVGGElement>('.c5-panel')!;
  const pc = el.querySelector<SVGTextElement>('.c5-pc')!;
  const rl = el.querySelector<SVGTextElement>('.c5-rl')!;
  const ccs = [...el.querySelectorAll<SVGCircleElement>('.c5-cc')];
  const countSeg = el.querySelector<SVGPathElement>('.c5-count .c5-seg')!;
  const countRest = [
    ...el.querySelectorAll<SVGElement>(
      '.c5-count .c5-mark, .c5-count .c5-cnt, .c5-low, .c5-low-dash, .c5-low-lbl',
    ),
  ];
  let camKey: Cam | 'fit' = 'fit';
  let conc = false;
  let count = false;
  let panel = '';
  let shown = '';

  const grow = (e: SVGElement, delay: number, from = 'scale(0)', origin = 'center'): Promise<boolean> => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = origin;
    return play(
      e,
      [
        { transform: from, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 800, delay, easing: EASE_OUT, fill: 'backwards', tag: 'circ' },
    ).finished;
  };
  const fadeIn = (e: Element, delay: number): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'circ',
    }).finished;

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as CircState;
      const anim = c.dir > 0 && !reducedMotion();
      // kamera dulu: perbesar/geser, baru tanda-tanda baru muncul
      const nextCam = s.cam ?? 'fit';
      const fromT = camT(camKey);
      const toT = camT(nextCam);
      const moved = nextCam !== camKey;
      camKey = nextCam;
      el.classList.toggle('is-zoom', nextCam !== 'fit' && nextCam !== 'wide');
      cam.style.transform = toT;
      if (moved && anim)
        await play(cam, [{ transform: fromT }, { transform: toT }], {
          duration: 1100,
          easing: EASE,
          tag: 'circ',
        }).finished;

      const fresh = (cls: string, on: boolean | undefined): boolean =>
        !!on && (!el.classList.contains(cls) || c.replay);
      const newRead = fresh('show-rx', s.rx) || fresh('show-ry', s.ry) || fresh('show-dlab', s.dlab);
      el.classList.toggle('show-rx', !!s.rx);
      el.classList.toggle('show-ry', !!s.ry);
      el.classList.toggle('show-rad', !!s.rad);
      el.classList.toggle('show-dlab', !!s.dlab);
      el.classList.toggle('show-conc', !!s.conc);
      el.classList.toggle('show-count', !!s.count);
      const [pcText, rlText] = s.lab ? LAB[s.lab] : ['', 'r = 2'];
      pc.textContent = pcText;
      rl.textContent = rlText;

      const runs: Array<Promise<boolean>> = [];
      // hitung kotak: ruas turun dari p, kotak 1 dan 2 bergantian, titik terbawah, lalu garis ke sumbu y
      if (s.count && (!count || c.replay) && anim) {
        runs.push(grow(countSeg, 0, 'scaleY(0)', 'top'));
        countRest.forEach((e, i) => runs.push(fadeIn(e, 350 + i * 260)));
      }
      count = !!s.count;
      if (s.conc && (!conc || c.replay) && anim) ccs.forEach((e, i) => runs.push(grow(e, i * 500)));
      conc = !!s.conc;
      const pKey = s.panel ?? '';
      if (pKey !== panel || (c.replay && pKey)) {
        panel = pKey;
        panelG.innerHTML = (s.panel ? PANEL[s.panel] : [])
          .map(
            ([t, dim], i) =>
              `<text class="${dim ? 'c5-note-s' : 'c5-pt'}" x="${LX}" y="${sy(6) + i * 24}">${t}</text>`,
          )
          .join('');
        if (anim) [...panelG.children].forEach((e, i) => runs.push(fadeIn(e, i * 220)));
      }
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
      // label sumber terbang memudar masuk lewat transisi CSS: tunggu sampai terbaca
      if (newRead && anim) runs.push(sleep(420));
      await Promise.all(runs);
    },
  };
}
