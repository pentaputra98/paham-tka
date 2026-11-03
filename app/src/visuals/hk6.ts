/**
 * Adegan "Horner-Kino" soal 6 (revisi pemilik v1.36): f(x) = x⁴ + ax³ + bx² + x − 6 dibagi x² + x + 1.
 * Pembagi x² + x + 1 = 0 → x² = −x − 1, jadi pengalinya −1 (baris A, geser satu kolom) dan −1 (baris B, geser dua kolom).
 * Skema (kolom = koefisien x⁴ … konstanta):
 *        1     a      b      1      −6
 *   −1         −1     1−a    a−b
 *   −1                −1     1−a    a−b
 *        1    a−1    b−a  │  2−b   a−b−6
 * Langkah (op): 1 turun; 2 kali 1; 3 jumlah kolom a; 4 kali a−1; 5 jumlah kolom b; 6 kali b−a; 7 jumlah kolom 1;
 * 8 jumlah kolom −6; 9 tanda hasil bagi dan sisa. State: m (pengali tampil), cut (batas kolom sisa), k0..k = op yang
 * dijalankan pada langkah ini (panahnya digambar, angkanya terbang), cmp (sisa soal 5x − 1 di bawah), hl 'x' | 'c'.
 * Hasil penjumlahan menjadi sumber terbang (h-s1 … h-s5), sisa soal h-g4, h-g5.
 * Angka turunan aljabar dari docs/pembahasan25.md soal 6 (sisa (2 − b)x + (a − b − 6), hasil bagi x² + x − 5).
 * Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Hk6State {
  m?: boolean;
  cut?: boolean;
  k0?: number;
  k?: number;
  cmp?: boolean;
  hl?: 'x' | 'c';
  [k: string]: unknown;
}

interface Cell {
  r: number;
  c: number;
  t: string;
  cls: string;
  /** op yang memunculkan sel ini (0 = sejak awal) */
  op: number;
}
/** baris grid: 1 pangkat, 2 koefisien, 3 baris A, 4 baris B, 5 hasil jumlah, 6 label, 7 sisa soal */
const CELLS: Record<string, Cell> = {
  hd: { r: 1, c: 1, t: 'x^2=-x-1', cls: 'hk-hd', op: -1 },
  p1: { r: 1, c: 2, t: 'x^4', cls: 'hk-pw', op: 0 },
  p2: { r: 1, c: 3, t: 'x^3', cls: 'hk-pw', op: 0 },
  p3: { r: 1, c: 4, t: 'x^2', cls: 'hk-pw', op: 0 },
  p4: { r: 1, c: 5, t: 'x', cls: 'hk-pw', op: 0 },
  p5: { r: 1, c: 6, t: 'x^0', cls: 'hk-pw', op: 0 },
  c1: { r: 2, c: 2, t: '1', cls: 'hk-k', op: 0 },
  c2: { r: 2, c: 3, t: 'a', cls: 'hk-k', op: 0 },
  c3: { r: 2, c: 4, t: 'b', cls: 'hk-k', op: 0 },
  c4: { r: 2, c: 5, t: '1', cls: 'hk-k', op: 0 },
  c5: { r: 2, c: 6, t: '-6', cls: 'hk-k', op: 0 },
  mA: { r: 3, c: 1, t: '-1', cls: 'hk-m', op: -1 },
  mB: { r: 4, c: 1, t: '-1', cls: 'hk-m', op: -1 },
  a2: { r: 3, c: 3, t: '-1', cls: 'hk-p', op: 2 },
  b3: { r: 4, c: 4, t: '-1', cls: 'hk-p', op: 2 },
  a3: { r: 3, c: 4, t: '1-a', cls: 'hk-p', op: 4 },
  b4: { r: 4, c: 5, t: '1-a', cls: 'hk-p', op: 4 },
  a4: { r: 3, c: 5, t: 'a-b', cls: 'hk-p', op: 6 },
  b5: { r: 4, c: 6, t: 'a-b', cls: 'hk-p', op: 6 },
  s1: { r: 5, c: 2, t: '1', cls: 'hk-s', op: 1 },
  s2: { r: 5, c: 3, t: 'a-1', cls: 'hk-s', op: 3 },
  s3: { r: 5, c: 4, t: 'b-a', cls: 'hk-s', op: 5 },
  s4: { r: 5, c: 5, t: '2-b', cls: 'hk-s hk-r', op: 7 },
  s5: { r: 5, c: 6, t: 'a-b-6', cls: 'hk-s hk-r', op: 8 },
  g4: { r: 7, c: 5, t: '5', cls: 'hk-g', op: -2 },
  g5: { r: 7, c: 6, t: '-1', cls: 'hk-g', op: -2 },
};
/** sumber terbang ke papan */
const SRC: Record<string, string> = {
  c1: 'h-c1',
  s1: 'h-s1',
  s2: 'h-s2',
  s3: 'h-s3',
  s4: 'h-s4',
  s5: 'h-s5',
  g4: 'h-g4',
  g5: 'h-g5',
};

type Op = { kind: 'down' | 'mul' | 'sum' | 'mark'; from: string[]; to: string[] };
const OPS: Op[] = [
  { kind: 'down', from: ['c1'], to: ['s1'] },
  { kind: 'mul', from: ['s1'], to: ['a2', 'b3'] },
  { kind: 'sum', from: ['c2', 'a2'], to: ['s2'] },
  { kind: 'mul', from: ['s2'], to: ['a3', 'b4'] },
  { kind: 'sum', from: ['c3', 'a3', 'b3'], to: ['s3'] },
  { kind: 'mul', from: ['s3'], to: ['a4', 'b5'] },
  { kind: 'sum', from: ['c4', 'a4', 'b4'], to: ['s4'] },
  { kind: 'sum', from: ['c5', 'b5'], to: ['s5'] },
  { kind: 'mark', from: [], to: [] },
];

const SVGNS = 'http://www.w3.org/2000/svg';

function markup(): string {
  const cells = Object.entries(CELLS)
    .map(([k, d]) => {
      const pair = k === 's4' || k === 'g4' ? ' data-p="x"' : k === 's5' || k === 'g5' ? ' data-p="c"' : '';
      const src = SRC[k] ? ` data-src="${SRC[k]}"` : '';
      return `<span class="hk-c ${d.cls}" data-k="${k}"${src}${pair} style="grid-area:${d.r}/${d.c}"><span class="hk-ring" aria-hidden="true"></span>${tex(d.t)}</span>`;
    })
    .join('');
  return `<div class="hk-wrap" role="img" aria-label="Horner-Kino: koefisien 1, a, b, 1, −6 dengan pengali −1 dan −1. Hasil 1, a − 1, b − a; sisa 2 − b dan a − b − 6.">
  <div class="hk-grid">
    <span class="hk-vl" style="grid-area:2/1/6/2" aria-hidden="true"></span>
    <span class="hk-hl" style="grid-area:5/2/6/7" aria-hidden="true"></span>
    <span class="hk-cut" style="grid-area:2/5/7/6" aria-hidden="true"></span>
    ${cells}
    <span class="hk-lb hk-lq" style="grid-area:6/2/7/5">hasil bagi</span>
    <span class="hk-lb hk-ls" style="grid-area:6/5/7/7">sisa</span>
    <span class="hk-lb hk-lg" style="grid-area:7/1/8/2">sisa soal</span>
  </div>
  <svg class="hk-arrows" aria-hidden="true"><defs><marker id="hk-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs><g class="hk-ar"></g></svg>
  <div class="hk-fly" aria-hidden="true"></div>
</div>`;
}

export function createHk6(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-hk';
  el.innerHTML = markup();
  const wrap = el.querySelector<HTMLElement>('.hk-wrap')!;
  const arG = el.querySelector<SVGGElement>('.hk-ar')!;
  const fly = el.querySelector<HTMLElement>('.hk-fly')!;
  const cell = (k: string): HTMLElement => el.querySelector<HTMLElement>(`[data-k="${k}"]`)!;
  let shownOps: [number, number] = [0, 0];
  let lastK = -1;
  let hl = '';
  let prev = { m: false, cut: false, cmp: false };

  /** posisi sel dalam piksel tata letak wrap (tidak terpengaruh skala panggung) */
  function box(e: Element): { x: number; y: number; w: number; h: number } {
    const R = wrap.getBoundingClientRect();
    const s = R.width ? wrap.offsetWidth / R.width : 1;
    const r = e.getBoundingClientRect();
    return { x: (r.left - R.left) * s, y: (r.top - R.top) * s, w: r.width * s, h: r.height * s };
  }

  function line(x1: number, y1: number, x2: number, y2: number, cls: string, tag?: string): SVGGElement {
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', `hk-a ${cls}`);
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`);
    p.setAttribute('marker-end', 'url(#hk-head)');
    g.append(p);
    if (tag) {
      const t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('x', ((x1 + x2) / 2 + 6).toFixed(1));
      t.setAttribute('y', ((y1 + y2) / 2 + 4).toFixed(1));
      t.textContent = tag;
      g.append(t);
    }
    arG.append(g);
    return g;
  }

  /** bingkai satu kolom yang dijumlahkan, dengan tanda + di kirinya */
  function column(keys: string[]): SVGGElement {
    const bs = keys.map((k) => box(cell(k)));
    const x0 = Math.min(...bs.map((b) => b.x)) - 4;
    const x1 = Math.max(...bs.map((b) => b.x + b.w)) + 4;
    const y0 = Math.min(...bs.map((b) => b.y)) - 2;
    const y1 = Math.max(...bs.map((b) => b.y + b.h)) + 2;
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 'hk-a hk-sum');
    const r = document.createElementNS(SVGNS, 'rect');
    r.setAttribute('x', x0.toFixed(1));
    r.setAttribute('y', y0.toFixed(1));
    r.setAttribute('width', (x1 - x0).toFixed(1));
    r.setAttribute('height', (y1 - y0).toFixed(1));
    r.setAttribute('rx', '8');
    const t = document.createElementNS(SVGNS, 'text');
    t.setAttribute('x', (x0 - 4).toFixed(1));
    t.setAttribute('y', ((y0 + y1) / 2 + 5).toFixed(1));
    t.setAttribute('text-anchor', 'end');
    t.textContent = '+';
    g.append(r, t);
    arG.append(g);
    return g;
  }

  /** panah satu op: turun (vertikal), kali (diagonal ke baris 1 dan 2, satu label ×(−1)), jumlah (bingkai kolom) */
  function arrows(op: Op): SVGGElement[] {
    if (op.kind === 'mark') return [];
    if (op.kind === 'down') {
      const a = box(cell(op.from[0]!));
      const b = box(cell(op.to[0]!));
      return [line(a.x + a.w / 2, a.y + a.h + 2, b.x + b.w / 2, b.y - 2, 'hk-down', 'turun')];
    }
    if (op.kind === 'mul') {
      const a = box(cell(op.from[0]!));
      const out = op.to.map((k, i) => {
        const b = box(cell(k));
        // ke baris 1: ujung kiri bawah sel; ke baris 2 (lebih jauh, lebih landai): ujung kiri tengah sel
        return line(a.x + a.w, a.y + 2, b.x + 2, i ? b.y + b.h / 2 : b.y + b.h - 2, 'hk-mul');
      });
      const t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('x', (a.x + a.w + 4).toFixed(1));
      t.setAttribute('y', (a.y + a.h + 14).toFixed(1));
      t.textContent = '×(−1)';
      out[0]!.append(t);
      return out;
    }
    return [column([...op.from, ...op.to])];
  }

  /** salinan angka terbang dari sel asal ke sel tujuan */
  function ghost(from: string, to: string, delay: number): Promise<boolean> {
    const a = box(cell(from));
    const b = box(cell(to));
    const g = document.createElement('span');
    g.className = 'hk-gh';
    g.innerHTML = tex(CELLS[from]!.t);
    g.style.left = `${a.x}px`;
    g.style.top = `${a.y}px`;
    fly.append(g);
    const k = play(
      g,
      [
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: `translate(${b.x - a.x}px, ${b.y - a.y}px)`, opacity: 0.85 },
      ],
      { duration: 700, delay, easing: EASE, fill: 'both', tag: 'hk' },
    ).finished;
    void k.then(() => g.remove());
    return k;
  }

  const pop = (e: Element, delay: number): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    return play(
      e,
      [
        { transform: 'scale(0.4)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 380, delay, easing: EASE_OUT, fill: 'backwards', tag: 'hk' },
    ).finished;
  };
  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 300,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'hk',
    }).finished;

  function visible(k: number, s: Hk6State): void {
    for (const [key, d] of Object.entries(CELLS)) {
      const on = d.op === -1 ? !!s.m : d.op === -2 ? !!s.cmp : d.op <= k;
      cell(key).classList.toggle('on', on);
    }
    el.classList.toggle('show-cut', !!s.cut);
    el.classList.toggle('show-mark', k >= 9);
    el.classList.toggle('show-cmp', !!s.cmp);
  }

  function drawStatic(k0: number, k: number): void {
    arG.replaceChildren();
    for (let i = k0; i < k; i++) arrows(OPS[i]!);
    shownOps = [k0, k];
  }

  new ResizeObserver(() => {
    if (!fly.childElementCount) drawStatic(...shownOps);
  }).observe(wrap);

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Hk6State;
      const k = s.k ?? 0;
      const k0 = s.k0 ?? k;
      const anim = c.dir > 0 && !reducedMotion();
      const runOps = anim && k > k0 && (k !== lastK || c.replay);
      fly.replaceChildren();
      const runs: Array<Promise<boolean>> = [];
      // pengali, batas sisa, dan sisa soal yang baru muncul
      const fresh = (flag: boolean, was: boolean): boolean => anim && flag && (!was || c.replay);
      const newM = fresh(!!s.m, prev.m);
      const newCut = fresh(!!s.cut, prev.cut);
      const newCmp = fresh(!!s.cmp, prev.cmp);
      prev = { m: !!s.m, cut: !!s.cut, cmp: !!s.cmp };
      if (newM) ['hd', 'mA', 'mB'].forEach((x, i) => runs.push(pop(cell(x), i * 140)));
      if (newCut) runs.push(fadeIn(el.querySelector('.hk-cut')!, 200));

      if (!runOps) {
        visible(k, s);
        drawStatic(k0, k);
      } else {
        // mulai dari keadaan sebelum langkah ini, lalu jalankan op satu per satu
        visible(k0, s);
        arG.replaceChildren();
        shownOps = [k0, k0];
        await Promise.all(runs.splice(0));
        for (let i = k0; i < k; i++) {
          if (!c.live()) return;
          const op = OPS[i]!;
          const ar = arrows(op);
          shownOps = [k0, i + 1];
          await Promise.all(ar.map((g) => fadeIn(g)));
          if (op.kind === 'mark') {
            el.classList.add('show-mark');
            await Promise.all([...el.querySelectorAll('.hk-lq, .hk-ls')].map((e, j) => fadeIn(e, j * 200)));
            continue;
          }
          await Promise.all(
            op.kind === 'sum'
              ? op.from.map((f, j) => ghost(f, op.to[0]!, j * 120))
              : op.to.map((t, j) => ghost(op.from[0]!, t, j * 180)),
          );
          if (!c.live()) return;
          for (const t of op.to) cell(t).classList.add('on');
          await Promise.all(op.to.map((t) => pop(cell(t), 0)));
        }
        visible(k, s);
      }
      if (newCmp) runs.push(...['g4', 'g5'].map((x, i) => pop(cell(x), 300 + i * 150)));
      lastK = k;

      const h = s.hl ?? '';
      el.dataset.hl = h;
      if (h && c.dir > 0 && !reducedMotion() && (h !== hl || c.replay))
        el.querySelectorAll(`[data-p="${h}"] .hk-ring`).forEach((r, i) => runs.push(pop(r, 200 + i * 250)));
      hl = h;
      await Promise.all(runs);
    },
  };
}
