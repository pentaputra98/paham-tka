/**
 * Adegan "kereta api" soal 14 (v1.48; docs/jarak_kereta_api.png). Empat tampilan pada panggung yang sama:
 *  - pic: gambar asli soal; label waktu 5, 3, 2, 3 menit dibingkai dan menjadi sumber terbang (t-AB, t-BC, t-CD, t-DE).
 *  - box: balok kerangka miring dari A(2, 3, 5) ke E(11, 6, 8); k = banyak langkah rusuk yang tampil (+9, +3, +3);
 *    diag = diagonal ruang AE (√99 km).
 *  - bar: lintasan lurus A–E dibagi 13 menit (1 menit 1 ruas); n = banyak segmen yang tumbuh; ce = kurung C–E
 *    (2 + 3 = 5 menit); g5 / g3 = kelompok pasangan 5 menit (AB, CE) dan paling lama 3 menit (BC, CD, DE):
 *    1 sedang diuji (biru langit), 2 sudah diputuskan (5 menit merah, 3 menit emas = jawaban); lim = penggaris
 *    4 dan 5 menit (bagian opsional batas waktu).
 *  - cmp (di bawah bar): baris pembanding tanpa desimal untuk waktu t (5 atau 3 menit), k = banyak baris; baris baru
 *    meluncur masuk, baris sebelumnya memudar, hanya dua baris terakhir yang tampil (papan memuat semuanya).
 * Angka dari docs/pembahasan25.md soal 14 (a1–c5, Pemeriksaan hasil metode eksak). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Rail14State {
  view?: 'pic' | 'box' | 'bar';
  box?: boolean;
  k?: number;
  diag?: boolean;
  n?: number;
  ce?: boolean;
  g5?: 0 | 1 | 2;
  g3?: 0 | 1 | 2;
  lim?: boolean;
  cmp?: { t: 5 | 3; k: number };
  [k: string]: unknown;
}

const fig = new URL('../assets/soal/jarak_kereta_api.png', import.meta.url).href;
/** label waktu pada gambar asli 1185 × 370: [sumber, x, y, lebar] */
const TL: Array<[string, number, number]> = [
  ['t-AB', 210, 300],
  ['t-BC', 478, 300],
  ['t-CD', 688, 304],
  ['t-DE', 896, 300],
];

function picMarkup(): string {
  const boxes = TL.map(
    ([s, x, y]) => `<rect class="r14-box" data-src="${s}" x="${x}" y="${y}" width="92" height="40" rx="8"/>`,
  ).join('');
  return `<svg class="r14-pic" viewBox="0 0 1185 370" role="img" aria-label="Gambar soal: kereta dari A ke E, waktu tempuh A–B 5 menit, B–C 3 menit, C–D 2 menit, D–E 3 menit">
  <image href="${fig}" x="0" y="0" width="1185" height="370"/>${boxes}</svg>`;
}

// ---- balok kerangka miring (viewBox 600 × 330) ----
const AX = 96;
const AY = 270;
const SX = 34; // per satuan x
const DZ = 34; // per satuan z (tegak)
const DY: [number, number] = [22, -16]; // per satuan y (miring ke belakang)
const P = (x: number, y: number, z: number): [number, number] => [
  AX + x * SX + y * DY[0],
  AY - z * DZ + y * DY[1],
];
const pt = (q: [number, number]): string => `${q[0]} ${q[1]}`;

function boxMarkup(): string {
  const v = [0, 9];
  const w = [0, 3];
  const edges: string[] = [];
  // 12 rusuk balok 9 × 3 × 3
  for (const y of w) for (const z of w) edges.push(`M${pt(P(0, y, z))}L${pt(P(9, y, z))}`);
  for (const x of v) for (const z of w) edges.push(`M${pt(P(x, 0, z))}L${pt(P(x, 3, z))}`);
  for (const x of v) for (const y of w) edges.push(`M${pt(P(x, y, 0))}L${pt(P(x, y, 3))}`);
  const s1 = P(9, 0, 0);
  const s2 = P(9, 3, 0);
  const e = P(9, 3, 3);
  const a = P(0, 0, 0);
  const mid = (p: [number, number], q: [number, number]): [number, number] => [
    (p[0] + q[0]) / 2,
    (p[1] + q[1]) / 2,
  ];
  const m1 = mid(a, s1);
  const m2 = mid(s1, s2);
  const m3 = mid(s2, e);
  const md = mid(a, e);
  return `<svg class="r14-boxv" viewBox="0 0 600 330" role="img" aria-label="Balok kerangka: dari A(2, 3, 5) ke E(11, 6, 8) langkahnya 9, 3, dan 3; diagonal ruang AE panjangnya akar 99 km">
  <defs><marker id="r14-h" class="r14-hm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs>
  <path class="r14-edge" d="${edges.join('')}"/>
  <g class="r14-st" data-i="1"><path d="M${pt(a)}L${pt(s1)}" marker-end="url(#r14-h)"/><text x="${m1[0]}" y="${m1[1] + 30}" text-anchor="middle">+9</text></g>
  <g class="r14-st" data-i="2"><path d="M${pt(s1)}L${pt(s2)}" marker-end="url(#r14-h)"/><text x="${m2[0] + 16}" y="${m2[1] + 20}">+3</text></g>
  <g class="r14-st" data-i="3"><path d="M${pt(s2)}L${pt(e)}" marker-end="url(#r14-h)"/><text x="${m3[0] + 14}" y="${m3[1] + 6}">+3</text></g>
  <g class="r14-dg"><path d="M${pt(a)}L${pt(e)}"/><text x="${md[0] + 40}" y="${md[1] + 54}">√99 km</text></g>
  <g class="r14-pt"><circle cx="${a[0]}" cy="${a[1]}" r="7"/><text x="${a[0] - 8}" y="${a[1] + 34}">A(2, 3, 5)</text></g>
  <g class="r14-pt"><circle cx="${e[0]}" cy="${e[1]}" r="7"/><text x="${e[0] - 40}" y="${e[1] - 18}">E(11, 6, 8)</text></g>
  </svg>`;
}

// ---- lintasan 13 menit (viewBox 640 × 200), 40 px per menit ----
const X0 = 60;
const PM = 40;
const TY = 84;
const STA: Array<[string, number]> = [
  ['A', 0],
  ['B', 5],
  ['C', 8],
  ['D', 10],
  ['E', 13],
];
const tx = (m: number): number => X0 + m * PM;
/** segmen: [kunci, menit awal, menit akhir, kelompok] */
const SEG: Array<[string, number, number, 5 | 3]> = [
  ['AB', 0, 5, 5],
  ['BC', 5, 8, 3],
  ['CD', 8, 10, 3],
  ['DE', 10, 13, 3],
];

function barMarkup(): string {
  const ticks = Array.from({ length: 14 }, (_, m) => `M${tx(m)} ${TY - 6}V${TY + 6}`).join('');
  const segs = SEG.map(
    ([k, a, b, g], i) =>
      `<g class="r14-seg" data-i="${i}" data-g="${g}"><rect x="${tx(a) + 2}" y="${TY - 9}" width="${tx(b) - tx(a) - 4}" height="18" rx="4"/>
      <text x="${(tx(a) + tx(b)) / 2}" y="${TY + 34}" text-anchor="middle">${b - a} menit</text><title>${k}</title></g>`,
  ).join('');
  const sta = STA.map(
    ([s, m]) =>
      `<g class="r14-sta"><circle cx="${tx(m)}" cy="${TY}" r="7"/><text x="${tx(m)}" y="${TY - 18}" text-anchor="middle">${s}</text></g>`,
  ).join('');
  const brace = (a: number, b: number, y: number, cls: string, label: string): string =>
    `<g class="${cls}"><path d="M${tx(a) + 3} ${y + 8}V${y}H${tx(b) - 3}V${y + 8}"/><text x="${(tx(a) + tx(b)) / 2}" y="${y - 8}" text-anchor="middle">${label}</text></g>`;
  const ruler = (m: number, y: number, ok: boolean): string =>
    `<g class="r14-ru ${ok ? 'is-ok' : 'is-no'}"><path d="M${tx(0)} ${y - 6}V${y + 6}M${tx(0)} ${y}H${tx(m)}M${tx(m)} ${y - 6}V${y + 6}"/><text x="${tx(m) + 10}" y="${y + 6}">${m} menit ${ok ? '✓' : '✗'}</text></g>`;
  return `<svg class="r14-bar" viewBox="0 0 640 200" role="img" aria-label="Lintasan lurus A sampai E selama 13 menit: AB 5 menit, BC 3 menit, CD 2 menit, DE 3 menit; CE 2 + 3 = 5 menit">
  <path class="r14-trk" d="M${tx(0)} ${TY}H${tx(13)}"/><path class="r14-tk" d="${ticks}"/>${segs}
  ${brace(8, 13, 30, 'r14-ce', 'CE = 2 + 3 = 5 menit')}${sta}
  ${ruler(4, 150, true)}${ruler(5, 180, false)}
  </svg>`;
}

/** baris pembanding tanpa desimal (docs Pemeriksaan hasil metode eksak) */
const CMP: Record<5 | 3, string[]> = {
  5: [
    '\\dfrac{5}{13}\\times\\sqrt{99}=\\dfrac{5\\sqrt{99}}{13}',
    '\\Big(\\dfrac{5\\sqrt{99}}{13}\\Big)^2=\\dfrac{2475}{169}\\quad\\text{dan}\\quad\\Big(\\dfrac{7}{2}\\Big)^2=\\dfrac{49}{4}',
    '2475\\times4=9900\\quad\\text{dan}\\quad49\\times169=8281',
    '9900>8281\\ \\to\\ \\text{lebih dari }3{,}5\\text{ km}',
  ],
  3: [
    '\\dfrac{3}{13}\\times\\sqrt{99}=\\dfrac{3\\sqrt{99}}{13}',
    '\\Big(\\dfrac{3\\sqrt{99}}{13}\\Big)^2=\\dfrac{891}{169}\\quad\\text{dan}\\quad\\Big(\\dfrac{7}{2}\\Big)^2=\\dfrac{49}{4}',
    '891\\times4=3564\\quad\\text{dan}\\quad49\\times169=8281',
    '3564<8281\\ \\to\\ \\text{kurang dari }3{,}5\\text{ km}',
  ],
};

export function createRail14(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-rail';
  el.innerHTML = `${picMarkup()}${boxMarkup()}<div class="r14-bv">${barMarkup()}<div class="r14-cmp" aria-live="polite"></div></div>`;
  const cmpEl = el.querySelector<HTMLElement>('.r14-cmp')!;
  let view = '';
  let box = false;
  let k = 0;
  let diag = false;
  let n = 0;
  let ce = false;
  let g5 = 0;
  let g3 = 0;
  let lim = false;
  let cmpKey = '';
  let cmpK = 0;

  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'rail',
    }).finished;
  const pop = (e: Element, delay = 0): Promise<boolean> => {
    (e as SVGElement).style.transformBox = 'fill-box';
    (e as SVGElement).style.transformOrigin = 'center';
    return play(
      e,
      [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 450, delay, easing: EASE_OUT, fill: 'backwards', tag: 'rail' },
    ).finished;
  };
  const grow = (e: SVGElement, delay = 0): Promise<boolean> => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = 'left center';
    return play(
      e,
      [
        { transform: 'scaleX(0)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 650, delay, easing: EASE, fill: 'backwards', tag: 'rail' },
    ).finished;
  };
  /** denyut singkat saat kelompok berganti warna (warna sendiri tidak dianimasikan) */
  const pulse = (e: SVGElement, delay = 0): Promise<boolean> => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = 'center';
    return play(e, [{ transform: 'none' }, { transform: 'scaleY(1.6)' }, { transform: 'none' }], {
      duration: 600,
      delay,
      easing: EASE,
      tag: 'rail',
    }).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Rail14State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'pic';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view)
          runs.push(fadeIn(el.querySelector(v === 'bar' ? '.r14-bv' : `.r14-${v === 'box' ? 'boxv' : v}`)!));
        view = v;
      }

      // ---- gambar soal ----
      const b = !!s.box;
      el.classList.toggle('show-box', b);
      if (anim && b && (!box || c.replay))
        el.querySelectorAll('.r14-box').forEach((e, i) => runs.push(pop(e, i * 220)));
      box = b;

      // ---- balok ----
      const kk = s.k ?? 0;
      el.querySelectorAll<SVGGElement>('.r14-st').forEach((g) => {
        const i = Number(g.dataset.i);
        g.classList.toggle('on', i <= kk);
        if (anim && v === 'box' && i <= kk && (i > k || c.replay))
          runs.push(fadeIn(g, (i - 1 - (c.replay ? 0 : k)) * 550));
      });
      k = kk;
      const dg = !!s.diag;
      el.classList.toggle('show-diag', dg);
      if (anim && dg && (!diag || c.replay)) runs.push(fadeIn(el.querySelector('.r14-dg')!, 200));
      diag = dg;

      // ---- lintasan ----
      const m = s.n ?? 0;
      el.querySelectorAll<SVGGElement>('.r14-seg').forEach((g) => {
        const i = Number(g.dataset.i);
        g.classList.toggle('on', i < m);
        if (anim && v === 'bar' && i < m && (i >= n || c.replay)) {
          const d = (i - (c.replay ? 0 : n)) * 380;
          runs.push(grow(g.querySelector('rect')!, d), fadeIn(g.querySelector('text')!, d + 500));
        }
      });
      n = m;
      const cc = !!s.ce;
      el.classList.toggle('show-ce', cc);
      if (anim && cc && (!ce || c.replay)) runs.push(fadeIn(el.querySelector('.r14-ce')!));
      ce = cc;
      const a5 = s.g5 ?? 0;
      const a3 = s.g3 ?? 0;
      el.dataset.g5 = String(a5);
      el.dataset.g3 = String(a3);
      if (anim && v === 'bar') {
        el.querySelectorAll<SVGGElement>('.r14-seg').forEach((g) => {
          const grp = g.dataset.g === '5' ? 5 : 3;
          const now = grp === 5 ? a5 : a3;
          const was = grp === 5 ? g5 : g3;
          if (now && (now !== was || c.replay)) runs.push(pulse(g.querySelector('rect')!, 150));
        });
        if (a5 && (a5 !== g5 || c.replay) && cc)
          runs.push(pulse(el.querySelector<SVGGElement>('.r14-ce path')!, 150));
      }
      g5 = a5;
      g3 = a3;
      const li = !!s.lim;
      el.classList.toggle('show-lim', li);
      if (anim && li && (!lim || c.replay))
        el.querySelectorAll<SVGGElement>('.r14-ru').forEach((g, i) => runs.push(grow(g, i * 700)));
      lim = li;

      // ---- baris pembanding ----
      const cm = s.cmp;
      const key = cm ? String(cm.t) : '';
      const ck = cm?.k ?? 0;
      if (key !== cmpKey) {
        cmpEl.innerHTML = cm
          ? CMP[cm.t]
              .map(
                (t, i) =>
                  `<div class="r14-ln${i === 3 ? ` r14-v${cm.t}` : ''}" data-i="${i}">${tex(t)}</div>`,
              )
              .join('')
          : '';
        cmpKey = key;
        cmpK = 0;
      }
      cmpEl.querySelectorAll<HTMLElement>('.r14-ln').forEach((ln) => {
        const i = Number(ln.dataset.i);
        ln.classList.toggle('on', i < ck);
        ln.classList.toggle('is-old', i < ck - 1);
        ln.classList.toggle('is-gone', i < ck - 2);
        if (anim && i < ck && (i >= cmpK || c.replay)) {
          const d = (i - (c.replay ? 0 : cmpK)) * 600;
          runs.push(
            play(
              ln,
              [
                { transform: 'translateY(0.6em)', opacity: 0 },
                { transform: 'none', opacity: 1 },
              ],
              { duration: 550, delay: d, easing: EASE_OUT, fill: 'backwards', tag: 'rail' },
            ).finished,
          );
        }
      });
      cmpK = ck;
      await Promise.all(runs);
    },
    sketch: () =>
      `<div class="vis-rail n-sketch is-sketch show-ce" data-view="bar" data-g5="2" data-g3="2">${barMarkup()}</div>`,
  };
}
