/**
 * Adegan "panjang vektor 3D" soal 12 (v1.44): AB = (2m, m + 3, m), |AB| = 9.
 * Dua tampilan pada panggung yang sama:
 *  - box: balok kerangka (proyeksi miring) dengan rusuk |x|, |y|, |z| dan diagonal ruang sebagai panjang vektor.
 *    m = nilai m yang dipakai (rusuk diberi angka komponennya); tanpa m rusuk berlabel x, y, z.
 *  - tab: tabel uji nilai m dari pilihan (−4, −3, 3, 4): komponen vektor, jumlah kuadrat, dibandingkan dengan 81.
 *    n = banyak baris yang sudah diuji; cur = baris yang sedang diuji. Baris yang tepat 81 emas, lainnya merah.
 * Angka dari docs/pembahasan25.md soal 12 (kartu A–E, Pemeriksaan hasil). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Vec12State {
  view?: 'box' | 'tab';
  m?: number;
  n?: number;
  cur?: number;
  [k: string]: unknown;
}

/** nilai m yang muncul di pilihan, urut seperti diuji */
const MS = [-4, -3, 3, 4];
const comp = (m: number): [number, number, number] => [2 * m, m + 3, m];
const sq = (m: number): number => comp(m).reduce((s, v) => s + v * v, 0);
const neg = (v: number): string => String(v).replace('-', '−');
const par = (v: number): string => (v < 0 ? `(${v})` : String(v));

function tabMarkup(): string {
  const head = `<span class="v12-h">${tex('m')}</span><span class="v12-h">${tex('\\vec{AB}')}</span><span class="v12-h">${tex('x^2+y^2+z^2')}</span><span class="v12-h"></span>`;
  const rows = MS.map((m, i) => {
    const [x, y, z] = comp(m);
    const s = sq(m);
    const ok = s === 81;
    return `<span class="v12-c v12-m" data-i="${i}" data-src="v-m${i}">${tex(String(m))}</span>
      <span class="v12-c" data-i="${i}">${tex(`(${x},\\ ${y},\\ ${z})`)}</span>
      <span class="v12-c" data-i="${i}">${tex(`${par(x)}^2+${par(y)}^2+${par(z)}^2=${s}`)}</span>
      <span class="v12-c v12-tag${ok ? ' is-ok' : ''}" data-i="${i}">${ok ? tex('=81') : tex('\\ne81')}</span>`;
  }).join('');
  return `<div class="v12-tab" role="img" aria-label="Uji nilai m: m = −4 dan m = 3 memberi jumlah kuadrat 81; m = −3 memberi 45; m = 4 memberi 129">${head}${rows}</div>`;
}

// ---- balok (viewBox 640 × 300), proyeksi miring ----
const O = [210, 250];
const W = 260;
const H = 150;
const D = [120, -70];

function boxMarkup(): string {
  const [ox, oy] = O as [number, number];
  const [dx, dy] = D as [number, number];
  const p = {
    a: [ox, oy],
    b: [ox + W, oy],
    c: [ox + W + dx, oy + dy],
    d: [ox + dx, oy + dy],
    e: [ox, oy - H],
    f: [ox + W, oy - H],
    g: [ox + W + dx, oy + dy - H],
    h: [ox + dx, oy + dy - H],
  } satisfies Record<string, [number, number]>;
  const L = (k: keyof typeof p, l: keyof typeof p, cls = 'v12-e'): string =>
    `<path class="${cls}" d="M${p[k].join(' ')}L${p[l].join(' ')}"/>`;
  const edges = [
    L('a', 'b'),
    L('b', 'c'),
    L('c', 'd', 'v12-e v12-hid'),
    L('d', 'a', 'v12-e v12-hid'),
    L('e', 'f'),
    L('f', 'g'),
    L('g', 'h'),
    L('h', 'e'),
    L('a', 'e'),
    L('b', 'f'),
    L('c', 'g'),
    L('d', 'h', 'v12-e v12-hid'),
  ].join('');
  return `<svg class="v12-box" viewBox="0 0 640 300" role="img" aria-label="Balok dengan rusuk x, y, z; diagonal ruang adalah panjang vektor AB">
  ${edges}
  <path class="v12-diag" d="M${p.a.join(' ')}L${p.g.join(' ')}"/>
  <circle class="v12-pt" cx="${p.a[0]}" cy="${p.a[1]}" r="6"/><circle class="v12-pt" cx="${p.g[0]}" cy="${p.g[1]}" r="6"/>
  <text class="v12-pl" x="${p.a[0] - 14}" y="${p.a[1] + 6}" text-anchor="end">A</text>
  <text class="v12-pl" x="${p.g[0] + 12}" y="${p.g[1] - 4}">B</text>
  <text class="v12-rl" data-r="x" x="${ox + W / 2}" y="${oy + 26}" text-anchor="middle">x</text>
  <text class="v12-rl" data-r="y" x="${ox + W + dx / 2 + 14}" y="${oy + dy / 2 + 20}">y</text>
  <text class="v12-rl" data-r="z" x="${ox - 14}" y="${oy - H / 2}" text-anchor="end">z</text>
  <text class="v12-dl" x="${(p.a[0] + p.g[0]) / 2 - 10}" y="${(p.a[1] + p.g[1]) / 2 - 12}" text-anchor="end">|AB| = 9</text>
  </svg>`;
}

export function createVec12(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-vec';
  el.innerHTML = boxMarkup() + tabMarkup();
  const rl = [...el.querySelectorAll<SVGTextElement>('.v12-rl')];
  let view = '';
  let n = 0;
  let m: number | undefined;

  const pop = (e: Element, delay = 0): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    (e as SVGElement).style.transformBox = 'fill-box';
    return play(
      e,
      [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 420, delay, easing: EASE_OUT, fill: 'backwards', tag: 'vec' },
    ).finished;
  };
  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'vec',
    }).finished;

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Vec12State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'box';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(v === 'box' ? '.v12-box' : '.v12-tab')!));
        if (anim && v === 'box') runs.push(pop(el.querySelector('.v12-diag')!, 300));
        view = v;
      }

      // rusuk balok: x, y, z atau nilai komponennya untuk m tertentu
      const mm = s.m;
      const vals = mm === undefined ? ['x', 'y', 'z'] : comp(mm).map((t) => neg(t));
      rl.forEach((t, i) => (t.textContent = mm === undefined ? vals[i]! : `${'xyz'[i]} = ${vals[i]}`));
      el.classList.toggle('has-m', mm !== undefined);
      if (anim && mm !== m && mm !== undefined) rl.forEach((t, i) => runs.push(pop(t, i * 160)));
      m = mm;

      // tabel uji
      const k = s.n ?? 0;
      const cur = s.cur ?? -1;
      el.querySelectorAll<HTMLElement>('.v12-c').forEach((e) => {
        const i = Number(e.dataset.i);
        e.classList.toggle('on', i < k);
        e.classList.toggle('is-cur', i === cur);
      });
      if (anim && v === 'tab' && (k > n || c.replay)) {
        const from = c.replay ? 0 : n;
        el.querySelectorAll<HTMLElement>('.v12-c').forEach((e) => {
          const i = Number(e.dataset.i);
          const col = [...e.parentElement!.children].indexOf(e) % 4;
          if (i >= from && i < k) runs.push(pop(e, (i - from) * 600 + col * 220));
        });
      }
      n = k;
      await Promise.all(runs);
    },
  };
}
