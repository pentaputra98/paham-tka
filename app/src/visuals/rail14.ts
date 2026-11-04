/**
 * Adegan "kereta api" soal 14 (revisi pemilik v1.49; docs/jarak_kereta_api.png). Tiga tampilan pada panggung yang sama:
 *  - pic: gambar asli soal; label waktu 5, 3, 2, 3 menit dibingkai dan menjadi sumber terbang (t-AB, t-BC, t-CD, t-DE).
 *  - calc: baris penurunan panjang vektor AE (tanpa balok); ae = banyak baris: AE = E − A, AE = (9, 3, 3),
 *    |AE| = √(9² + 3² + 3²) = √99, √99 ≈ √100 = 10 km. Baris baru meluncur masuk, baris lama memudar.
 *  - bar: lintasan lurus A–E dibagi 13 menit; n = banyak segmen yang tumbuh; tot = kurung total (13 menit, AE ≈ 10 km);
 *    ce = kurung C–E (2 + 3 = 5 menit); km = pasangan yang jaraknya sudah tampil; judge = segmen diwarnai
 *    (lebih dari 3,5 km merah, kurang dari 3,5 km emas = jawaban); cur = pasangan yang sedang dihitung, panel di
 *    bawah lintasan: t/13 × 10, t/13 ≈ desimal, lalu dikali 10 dengan koma bergeser satu tempat ke kanan
 *    (k = banyak baris panel).
 * Angka: |AE| = √99 (docs a1–a4), dibulatkan ke 10 atas arahan pemilik. Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Pair = 'AB' | 'BC' | 'CD' | 'DE' | 'CE';

export interface Rail14State {
  view?: 'pic' | 'calc' | 'bar';
  box?: boolean;
  ae?: number;
  n?: number;
  tot?: boolean;
  ce?: boolean;
  km?: Pair[];
  judge?: boolean;
  cur?: { p: Pair; k: number };
  [k: string]: unknown;
}

const fig = new URL('../assets/soal/jarak_kereta_api.png', import.meta.url).href;
/** label waktu pada gambar asli 1185 × 370: [sumber, x, y] */
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

/** penurunan panjang AE (docs a1–a4), baris terakhir pembulatan arahan pemilik */
const AE_LINES = [
  '\\overrightarrow{AE}=E-A=(11-2,\\ 6-3,\\ 8-5)',
  '\\overrightarrow{AE}=(9,\\ 3,\\ 3)',
  '|\\overrightarrow{AE}|=\\sqrt{9^2+3^2+3^2}=\\sqrt{81+9+9}=\\sqrt{99}',
  '\\sqrt{99}\\approx\\sqrt{100}=10\\text{ km}',
];

function calcMarkup(): string {
  return `<div class="r14-calc" role="img" aria-label="Vektor AE sama dengan E dikurangi A, yaitu (9, 3, 3); panjangnya akar 99, dibulatkan akar 100 sama dengan 10 km">${AE_LINES.map(
    (t, i) => `<div class="r14-ln${i === 3 ? ' r14-key' : ''}" data-i="${i}">${tex(t)}</div>`,
  ).join('')}</div>`;
}

// ---- lintasan 13 menit (viewBox 640 × 210), 40 px per menit ----
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
/** pasangan: menit awal, menit akhir, jarak (km, dibulatkan), dua angka desimal t/13 */
const PAIR: Record<Pair, { a: number; b: number; km: string; d: [string, string] }> = {
  AB: { a: 0, b: 5, km: '3,8', d: ['3', '8'] },
  BC: { a: 5, b: 8, km: '2,3', d: ['2', '3'] },
  CD: { a: 8, b: 10, km: '1,5', d: ['1', '5'] },
  DE: { a: 10, b: 13, km: '2,3', d: ['2', '3'] },
  CE: { a: 8, b: 13, km: '3,8', d: ['3', '8'] },
};
const SEGS: Pair[] = ['AB', 'BC', 'CD', 'DE'];
const far = (p: Pair): boolean => PAIR[p].b - PAIR[p].a === 5;

function barMarkup(): string {
  const ticks = Array.from({ length: 14 }, (_, m) => `M${tx(m)} ${TY - 6}V${TY + 6}`).join('');
  const segs = SEGS.map((k, i) => {
    const { a, b, km } = PAIR[k];
    const cx = (tx(a) + tx(b)) / 2;
    return `<g class="r14-seg${far(k) ? ' is-far' : ''}" data-i="${i}" data-p="${k}"><rect x="${tx(a) + 2}" y="${TY - 9}" width="${tx(b) - tx(a) - 4}" height="18" rx="4"/>
      <text class="r14-mn" x="${cx}" y="${TY + 34}" text-anchor="middle">${b - a} menit</text>
      <text class="r14-km" x="${cx}" y="${TY + 60}" text-anchor="middle">${km} km</text></g>`;
  }).join('');
  const sta = STA.map(
    ([s, m]) =>
      `<g class="r14-sta"><circle cx="${tx(m)}" cy="${TY}" r="7"/><text x="${tx(m)}" y="${TY - 18}" text-anchor="middle">${s}</text></g>`,
  ).join('');
  return `<svg class="r14-bar" viewBox="0 0 640 210" role="img" aria-label="Lintasan lurus A sampai E selama 13 menit, AE kira-kira 10 km: AB 5 menit 3,8 km, BC 3 menit 2,3 km, CD 2 menit 1,5 km, DE 3 menit 2,3 km; CE 5 menit 3,8 km">
  <path class="r14-trk" d="M${tx(0)} ${TY}H${tx(13)}"/><path class="r14-tk" d="${ticks}"/>${segs}
  <g class="r14-ce is-far" data-p="CE"><path d="M${tx(8) + 3} 38V30H${tx(13) - 3}V38"/><text x="${(tx(8) + tx(13)) / 2}" y="22" text-anchor="middle">CE = 2 + 3 = 5 menit<tspan class="r14-cek"> → 3,8 km</tspan></text></g>
  ${sta}
  <g class="r14-tot"><path d="M${tx(0)} 172V180H${tx(13)}V172"/><text x="${(tx(0) + tx(13)) / 2}" y="202" text-anchor="middle">A ke E = 13 menit, AE ≈ 10 km</text></g>
  </svg>`;
}

/** panel perhitungan satu pasangan: t/13 × 10, t/13 ≈ desimal, desimal × 10 dengan koma bergeser */
function curMarkup(p: Pair): string {
  const { a, b, d } = PAIR[p];
  const t = b - a;
  const head =
    p === 'CE'
      ? `CE=\\dfrac{2+3}{13}\\times10=\\dfrac{5}{13}\\times10`
      : `${p === 'BC' ? 'BC=DE' : p}=\\dfrac{${t}}{13}\\times10`;
  const dec = `0{,}${d[0]}${d[1]}`;
  const slot = (v: string, cls = ''): string => `<span class="r14-d${cls}">${tex(v)}</span>`;
  return `<div class="r14-ln" data-i="0">${tex(head)}</div>
  <div class="r14-ln" data-i="1">${tex(`\\dfrac{${t}}{13}=${t}\\div13\\approx${dec}`)}</div>
  <div class="r14-ln r14-key" data-i="2">${tex(`${dec}\\times10=`)}<span class="r14-sh">${slot('0', ' is-z')}<span class="r14-g"></span>${slot(d[0])}<span class="r14-g"></span>${slot(d[1])}<span class="r14-cm">${tex('{,}')}</span>${tex('\\text{ km}')}</span></div>`;
}

export function createRail14(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-rail';
  el.innerHTML = `${picMarkup()}${calcMarkup()}<div class="r14-bv">${barMarkup()}<div class="r14-cur" aria-live="polite"></div></div>`;
  const curEl = el.querySelector<HTMLElement>('.r14-cur')!;
  let view = '';
  let box = false;
  let ae = 0;
  let n = 0;
  let tot = false;
  let ce = false;
  let km = new Set<string>();
  let judge = false;
  let curKey = '';
  let curK = 0;

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
  const slideIn = (e: Element, delay = 0): Promise<boolean> =>
    play(
      e,
      [
        { transform: 'translateY(0.6em)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 550, delay, easing: EASE_OUT, fill: 'backwards', tag: 'rail' },
    ).finished;
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
  /** denyut singkat saat segmen diberi warna (warna sendiri tidak dianimasikan) */
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
  /** koma bergeser satu tempat ke kanan, nol di depan memudar, angka merapat ke kiri */
  const shift = async (sh: HTMLElement, delay: number): Promise<boolean> => {
    const cm = sh.querySelector<HTMLElement>('.r14-cm')!;
    const z = sh.querySelector<HTMLElement>('.is-z')!;
    const o = { easing: EASE, fill: 'backwards' as const, tag: 'rail' };
    const r = await Promise.all([
      play(cm, [{ transform: 'none' }, { transform: 'translateX(var(--r14-slot))' }], {
        ...o,
        duration: 700,
        delay,
      }).finished,
      play(z, [{ opacity: 1 }, { opacity: 0 }], { ...o, duration: 400, delay: delay + 800 }).finished,
      play(sh, [{ transform: 'none' }, { transform: 'translateX(calc(-1 * var(--r14-slot)))' }], {
        ...o,
        duration: 500,
        delay: delay + 1200,
      }).finished,
    ]);
    return r.every(Boolean);
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
        if (anim && view) runs.push(fadeIn(el.querySelector(v === 'bar' ? '.r14-bv' : `.r14-${v}`)!));
        view = v;
      }

      // ---- gambar soal ----
      const b = !!s.box;
      el.classList.toggle('show-box', b);
      if (anim && b && (!box || c.replay))
        el.querySelectorAll('.r14-box').forEach((e, i) => runs.push(pop(e, i * 220)));
      box = b;

      // ---- penurunan panjang AE ----
      const ak = s.ae ?? 0;
      el.querySelectorAll<HTMLElement>('.r14-calc .r14-ln').forEach((ln) => {
        const i = Number(ln.dataset.i);
        ln.classList.toggle('on', i < ak);
        ln.classList.toggle('is-old', i < ak - 1);
        if (anim && v === 'calc' && i < ak && (i >= ae || c.replay))
          runs.push(slideIn(ln, (i - (c.replay ? 0 : ae)) * 650));
      });
      ae = ak;

      // ---- lintasan ----
      const m = s.n ?? 0;
      el.querySelectorAll<SVGGElement>('.r14-seg').forEach((g) => {
        const i = Number(g.dataset.i);
        g.classList.toggle('on', i < m);
        if (anim && v === 'bar' && i < m && (i >= n || c.replay)) {
          const d = (i - (c.replay ? 0 : n)) * 380;
          runs.push(grow(g.querySelector('rect')!, d), fadeIn(g.querySelector('.r14-mn')!, d + 500));
        }
      });
      n = m;
      const tt = !!s.tot;
      el.classList.toggle('show-tot', tt);
      if (anim && tt && (!tot || c.replay)) runs.push(fadeIn(el.querySelector('.r14-tot')!, 300));
      tot = tt;
      const cc = !!s.ce;
      el.classList.toggle('show-ce', cc);
      if (anim && cc && (!ce || c.replay)) runs.push(fadeIn(el.querySelector('.r14-ce')!));
      ce = cc;
      const ks = new Set<string>(s.km ?? []);
      el.querySelectorAll<SVGGElement>('.r14-bar [data-p]').forEach((g) => {
        const p = g.dataset.p!;
        const on = ks.has(p);
        g.classList.toggle('has-km', on);
        const lbl = g.querySelector<SVGElement>(p === 'CE' ? '.r14-cek' : '.r14-km');
        if (anim && v === 'bar' && on && lbl && (!km.has(p) || c.replay)) runs.push(fadeIn(lbl, 1900));
      });
      km = ks;
      const jg = !!s.judge;
      el.classList.toggle('is-judge', jg);
      if (anim && jg && (!judge || c.replay)) {
        el.querySelectorAll<SVGGElement>('.r14-seg rect').forEach((r, i) => runs.push(pulse(r, i * 150)));
        runs.push(pulse(el.querySelector<SVGGElement>('.r14-ce path')!, 600));
      }
      judge = jg;

      // ---- panel perhitungan pasangan ----
      const cu = s.cur;
      const key = cu?.p ?? '';
      const ck = cu?.k ?? 0;
      // pasangan yang sedang dihitung diberi warna sendiri (BC dan DE dihitung bersama)
      el.dataset.cur = key === 'BC' ? 'BC DE' : key;
      if (key !== curKey) {
        curEl.innerHTML = cu ? curMarkup(cu.p) : '';
        curKey = key;
        curK = 0;
      }
      curEl.querySelectorAll<HTMLElement>('.r14-ln').forEach((ln) => {
        const i = Number(ln.dataset.i);
        ln.classList.toggle('on', i < ck);
        ln.classList.toggle('is-old', i < ck - 1);
        ln.classList.toggle('is-gone', i < ck - 2);
        const fresh = anim && i < ck && (i >= curK || c.replay);
        const d = (i - (c.replay ? 0 : curK)) * 650;
        const sh = ln.querySelector<HTMLElement>('.r14-sh');
        if (fresh) runs.push(slideIn(ln, d));
        if (sh) sh.classList.toggle('is-done', i < ck);
        if (fresh && sh) runs.push(shift(sh, d + 700));
      });
      curK = ck;
      await Promise.all(runs);
    },
    sketch: () =>
      `<div class="vis-rail n-sketch is-sketch show-ce show-tot is-judge" data-view="bar">${barMarkup()}</div>`,
  };
}
