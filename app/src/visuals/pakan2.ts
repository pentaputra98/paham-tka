/**
 * Adegan "pakan sapi dan kambing" soal 2, alur guru (v1.29; docs/sapi_dan_kambing.png).
 * Dua tampilan pada panggung yang sama:
 *  - pic: gambar soal; kebutuhan pakan 'sapi' | 'kambing' | 'all' dibingkai, angka per ekor menjadi sumber terbang
 *    (f-sg, f-sm, f-kg, f-km); claim [x, y]: banyak sapi dan kambing menurut suatu pilihan ditempel di atas hewannya
 *    (emas bila sama dengan hasil 3 sapi dan 4 kambing, merah bila bukan);
 *  - bars: model batang (tidak berskala). 1 = batang gajah 10x + y + y = 38; 2 = ditambah batang gamal
 *    10x + y = 34; align: bagian sapi kedua batang sama panjang (garis putus-putus), satu y sisa di batang gajah
 *    disorot sebagai selisih 38 − 34; y: tiap y = 4; x: bagian sapi 10x = 30, jadi x = 3.
 * Angka dari docs/pembahasan25.md soal 2. Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Pakan2State {
  view?: 'pic' | 'bars';
  pic?: 'sapi' | 'kambing' | 'all';
  claim?: [number, number];
  bars?: 0 | 1 | 2;
  align?: boolean;
  y?: boolean;
  x?: boolean;
  [k: string]: unknown;
}

const fig = new URL('../assets/soal/sapi_dan_kambing.png', import.meta.url).href;
/** hasil sistem persamaan (docs): 3 sapi, 4 kambing */
const SOL: [number, number] = [3, 4];

// ---- tampilan gambar (satuan = piksel gambar asli 918 × 571) ----
const BOX = {
  sapi: [100, 410, 278, 130],
  kambing: [584, 400, 258, 136],
} as const;
const NUM: Array<[string, number, number, number]> = [
  ['f-sg', 284, 465, 78],
  ['f-sm', 290, 502, 78],
  ['f-kg', 764, 460, 66],
  ['f-km', 769, 495, 66],
];
const TAG: Array<[number, number, string]> = [
  [250, 168, 'sapi'],
  [700, 206, 'kambing'],
];

function picMarkup(): string {
  const box = (k: 'sapi' | 'kambing'): string => {
    const [x, y, w, h] = BOX[k];
    return `<rect class="pk-box" data-box="${k}" x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/>`;
  };
  const nums = NUM.map(
    ([src, x, y, w]) =>
      `<rect class="pk-n" data-n="${src}" data-src="${src}" x="${x}" y="${y}" width="${w}" height="34" rx="8"/>`,
  ).join('');
  const tags = TAG.map(
    ([cx, cy, who], i) =>
      `<g class="pk-tag" data-tag="${i}"><rect x="${cx - 92}" y="${cy - 30}" width="184" height="60" rx="30"/><text x="${cx}" y="${cy + 10}" text-anchor="middle" data-t="${who}"></text></g>`,
  ).join('');
  return `<svg class="pk-pic" viewBox="0 0 918 571" role="img" aria-label="Sapi: rumput gajah 10 kg, rumput gamal 10 kg. Kambing: rumput gajah 2 kg, rumput gamal 1 kg.">
  <image href="${fig}" x="0" y="0" width="918" height="571"/>
  ${box('sapi')}${box('kambing')}${nums}${tags}
  </svg>`;
}

// ---- model batang (viewBox 640 × 300) ----
const X0 = 120;
const W1 = 300;
const WY = 72;
const ROW = { g: 66, m: 186 } as const;
const BH = 56;

function block(row: 'g' | 'm', i: number, x: number, w: number, kind: 'sapi' | 'kambing'): string {
  const y = ROW[row];
  const big = kind === 'sapi';
  return `<g class="pk-blk pk-${kind}" data-row="${row}" data-i="${i}">
    <rect x="${x}" y="${y}" width="${w}" height="${BH}" rx="6"/>
    <text class="pk-bt" x="${x + w / 2}" y="${y + BH / 2 + 7}" text-anchor="middle" data-v="${big ? 'x' : 'y'}">${big ? '10x' : 'y'}</text>
    <text class="pk-cap" x="${x + w / 2}" y="${y + BH + 18}" text-anchor="middle"${big ? ' data-v="xc"' : ''}>${kind}</text>
  </g>`;
}

function barsMarkup(): string {
  const xa = X0 + W1;
  const xb = xa + WY;
  const xc = xb + WY;
  return `<svg class="pk-bars" viewBox="0 0 640 300" role="img" aria-label="Model batang: rumput gajah 10x + y + y = 38, rumput gamal 10x + y = 34">
  <text class="pk-rl" x="${X0 - 12}" y="${ROW.g + BH / 2 + 6}" text-anchor="end">gajah</text>
  <text class="pk-rl pk-rl-m" x="${X0 - 12}" y="${ROW.m + BH / 2 + 6}" text-anchor="end">gamal</text>
  ${block('g', 0, X0, W1, 'sapi')}${block('g', 1, xa, WY, 'kambing')}${block('g', 2, xb, WY, 'kambing')}
  <text class="pk-tot" data-row="g" x="${xc + 10}" y="${ROW.g + BH / 2 + 7}">= 38</text>
  ${block('m', 0, X0, W1, 'sapi')}${block('m', 1, xa, WY, 'kambing')}
  <text class="pk-tot pk-rl-m" data-row="m" x="${xb + 10}" y="${ROW.m + BH / 2 + 7}">= 34</text>
  <g class="pk-align">
    <path class="pk-dash" d="M${xa} ${ROW.g - 10}V${ROW.m + BH + 4}M${xb} ${ROW.g - 10}V${ROW.m + BH + 4}"/>
    <rect class="pk-extra" x="${xb}" y="${ROW.g}" width="${WY}" height="${BH}" rx="6"/>
    <text class="pk-diff" x="${xb + WY / 2}" y="${ROW.g - 18}" text-anchor="middle">selisih 38 − 34</text>
  </g>
  <text class="pk-note" x="${X0}" y="292">model batang, tidak berskala</text>
  </svg>`;
}

export function createPakan2(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-pakan';
  el.innerHTML = picMarkup() + barsMarkup();
  const tags = [...el.querySelectorAll<SVGGElement>('.pk-tag')];
  const prev = new Set<string>();
  let view: 'pic' | 'bars' | '' = '';
  let rows = 0;
  let claimKey = '';

  const fadeIn = (e: Element, delay: number): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'pakan',
    }).finished;
  /** batang tumbuh dari kiri ke kanan, satu bagian demi satu bagian */
  const grow = (e: SVGGElement, delay: number): Promise<boolean> => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = 'left center';
    return play(
      e,
      [
        { transform: 'scaleX(0)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 520, delay, easing: EASE, fill: 'backwards', tag: 'pakan' },
    ).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Pakan2State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'pic';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(v === 'pic' ? '.pk-pic' : '.pk-bars')!, 0));
        view = v;
      }

      // gambar: bingkai kebutuhan pakan tiap hewan
      const pic = s.pic ?? '';
      el.querySelectorAll<SVGRectElement>('.pk-box').forEach((b) => {
        const on = pic === 'all' || pic === b.dataset.box;
        if (on && anim && !b.classList.contains('on')) runs.push(fadeIn(b, 0));
        b.classList.toggle('on', on);
      });
      el.querySelectorAll<SVGRectElement>('.pk-n').forEach((n, i) => {
        const on = pic === 'all' || (pic === 'sapi' && i < 2) || (pic === 'kambing' && i >= 2);
        n.classList.toggle('on', on);
      });

      // klaim pilihan: banyak sapi dan kambing ditempel di atas hewannya
      const cl = s.claim;
      const key = cl ? cl.join() : '';
      tags.forEach((g, i) => {
        const n = cl?.[i];
        const t = g.querySelector('text')!;
        t.textContent = n === undefined ? '' : `${n} ${t.dataset.t}`;
        g.classList.toggle('on', n !== undefined);
        g.classList.toggle('is-ok', n === SOL[i]);
      });
      if (cl && anim && (key !== claimKey || c.replay))
        tags.forEach((g, i) => {
          g.style.transformBox = 'fill-box';
          g.style.transformOrigin = 'center';
          runs.push(
            play(
              g,
              [
                { transform: 'scale(0.4)', opacity: 0 },
                { transform: 'none', opacity: 1 },
              ],
              { duration: 480, delay: i * 260, easing: EASE_OUT, fill: 'backwards', tag: 'pakan' },
            ).finished,
          );
        });
      claimKey = key;

      // model batang: baris gajah lalu gamal tumbuh bagian demi bagian
      const n = s.bars ?? 0;
      el.querySelectorAll<SVGGElement>('.pk-blk').forEach((b) => {
        const r = b.dataset.row === 'g' ? 1 : 2;
        b.classList.toggle('on', r <= n);
        if (r <= n && anim && (r > rows || c.replay)) runs.push(grow(b, Number(b.dataset.i) * 300));
      });
      el.querySelectorAll<SVGElement>('.pk-tot, .pk-rl').forEach((t) => {
        const r = t.classList.contains('pk-rl-m') ? 2 : 1;
        t.classList.toggle('on', r <= n);
        if (r <= n && anim && (r > rows || c.replay))
          runs.push(fadeIn(t, t.classList.contains('pk-tot') ? 900 : 0));
      });
      rows = n;

      const flags: Record<string, boolean> = { align: !!s.align, y: !!s.y, x: !!s.x };
      for (const [k, on] of Object.entries(flags)) {
        if (on && anim && (!prev.has(k) || c.replay)) {
          const sel = k === 'align' ? '.pk-align > *' : `[data-v="${k}"], [data-v="${k}c"]`;
          el.querySelectorAll(sel).forEach((e, i) => runs.push(fadeIn(e, i * 200)));
        }
        el.classList.toggle(`show-${k}`, on);
        if (on) prev.add(k);
        else prev.delete(k);
      }
      // nilai yang sudah diketahui ditulis di dalam batang
      el.querySelectorAll<SVGTextElement>('[data-v="y"]').forEach(
        (t) => (t.textContent = s.y ? 'y = 4' : 'y'),
      );
      el.querySelectorAll<SVGTextElement>('[data-v="x"]').forEach(
        (t) => (t.textContent = s.x ? '10x = 30' : '10x'),
      );
      el.querySelectorAll<SVGTextElement>('[data-v="xc"]').forEach(
        (t) => (t.textContent = s.x ? 'sapi, x = 3' : 'sapi'),
      );
      await Promise.all(runs);
    },
  };
}
