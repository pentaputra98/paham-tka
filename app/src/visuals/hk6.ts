/**
 * Adegan "Horner-Kino" soal 6 (revisi pemilik v1.37): f(x) = x⁴ + ax³ + bx² + x − 6 dibagi x² + x + 1.
 * Pembagi berderajat dua (bentuk ax² + bx + c dengan a = b = c = 1): k₁ = −c/a = −1 di baris atas (hasil kalinya
 * ditulis dua kolom ke kanan), k₂ = −b/a = −1 di baris bawah (satu kolom ke kanan). Tempat kosong diberi X sehingga
 * terlihat pola diagonal; X di ujung baris k₂ dan garis batas menandai perkalian berhenti.
 *        x⁴    x³     x²     x      x⁰
 *         1     a      b      1     −6
 *   k₁    X     X     −1     1−a    a−b
 *   k₂    X    −1     1−a    a−b     X
 *         1    a−1    b−a  │ 2−b   a−b−6
 * Revisi v1.38: co = koefisien diambil dari f(x) di atas skema (tiap koefisien disorot lalu melayang ke tabel; x⁴ dan x
 * ditulis 1x⁴ dan 1x); perkalian dengan k₂ (baris bawah, kolom berikutnya) lebih dulu, baru k₁ (naik ke baris atas).
 * Op (satu operasi = satu animasi): 1 turun; 2 1·k₂; 3 1·k₁; 4 jumlah kolom a; 5 (a−1)·k₂; 6 (a−1)·k₁; 7 jumlah kolom b;
 * 8 (b−a)·k₂; 9 (b−a)·k₁; 10 jumlah kolom 1; 11 jumlah kolom −6; 12 tanda hasil bagi dan sisa.
 * Animasi kali: angka asal dan pengalinya disorot, tempat tujuan dibingkai putus-putus, panah berlabel "× k₂" yang lalu
 * berganti menjadi angkanya "× (−1)", angka melayang ke tujuan, lalu hasilnya muncul dengan warna baru. Animasi jumlah:
 * kolom dibingkai dengan tanda +, semua angkanya melayang ke baris hasil. State: m (k₁, k₂), co (koefisien), x (tanda X),
 * cut (batas sisa), k0..k (op langkah ini), cmp (sisa soal 5x − 1), hl 'x' | 'c'. Hasil jumlah menjadi sumber terbang
 * (h-s1 … h-s5), sisa soal h-g4, h-g5.
 * Angka turunan aljabar dari docs/pembahasan25.md soal 6. Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Hk6State {
  m?: boolean;
  co?: boolean;
  /** langkah ini memperagakan pengambilan koefisien dari f(x) */
  coIn?: boolean;
  x?: boolean;
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
  /** op yang memunculkan sel ini; 0 = sejak awal, −1 = pengali, −2 = X, −3 = sisa soal, −4 = koefisien */
  op: number;
}
/** baris grid: 1 pangkat, 2 koefisien, 3 baris k₁, 4 baris k₂, 5 hasil jumlah, 6 label, 7 sisa soal */
const CELLS: Record<string, Cell> = {
  p1: { r: 1, c: 2, t: 'x^4', cls: 'hk-pw', op: 0 },
  p2: { r: 1, c: 3, t: 'x^3', cls: 'hk-pw', op: 0 },
  p3: { r: 1, c: 4, t: 'x^2', cls: 'hk-pw', op: 0 },
  p4: { r: 1, c: 5, t: 'x', cls: 'hk-pw', op: 0 },
  p5: { r: 1, c: 6, t: 'x^0', cls: 'hk-pw', op: 0 },
  c1: { r: 2, c: 2, t: '1', cls: 'hk-k', op: -4 },
  c2: { r: 2, c: 3, t: 'a', cls: 'hk-k', op: -4 },
  c3: { r: 2, c: 4, t: 'b', cls: 'hk-k', op: -4 },
  c4: { r: 2, c: 5, t: '1', cls: 'hk-k', op: -4 },
  c5: { r: 2, c: 6, t: '-6', cls: 'hk-k', op: -4 },
  k1: { r: 3, c: 1, t: 'k_1=-1', cls: 'hk-m', op: -1 },
  k2: { r: 4, c: 1, t: 'k_2=-1', cls: 'hk-m', op: -1 },
  x1: { r: 3, c: 2, t: '\\text{X}', cls: 'hk-x', op: -2 },
  x2: { r: 3, c: 3, t: '\\text{X}', cls: 'hk-x', op: -2 },
  x3: { r: 4, c: 2, t: '\\text{X}', cls: 'hk-x', op: -2 },
  x4: { r: 4, c: 6, t: '\\text{X}', cls: 'hk-x hk-stop', op: -2 },
  u2: { r: 4, c: 3, t: '-1', cls: 'hk-p', op: 2 },
  t3: { r: 3, c: 4, t: '-1', cls: 'hk-p', op: 3 },
  s1: { r: 5, c: 2, t: '1', cls: 'hk-s', op: 1 },
  s2: { r: 5, c: 3, t: 'a-1', cls: 'hk-s', op: 4 },
  u3: { r: 4, c: 4, t: '1-a', cls: 'hk-p', op: 5 },
  t4: { r: 3, c: 5, t: '1-a', cls: 'hk-p', op: 6 },
  s3: { r: 5, c: 4, t: 'b-a', cls: 'hk-s', op: 7 },
  u4: { r: 4, c: 5, t: 'a-b', cls: 'hk-p', op: 8 },
  t5: { r: 3, c: 6, t: 'a-b', cls: 'hk-p', op: 9 },
  s4: { r: 5, c: 5, t: '2-b', cls: 'hk-s hk-r', op: 10 },
  s5: { r: 5, c: 6, t: 'a-b-6', cls: 'hk-s hk-r', op: 11 },
  g4: { r: 7, c: 5, t: '5', cls: 'hk-g', op: -3 },
  g5: { r: 7, c: 6, t: '-1', cls: 'hk-g', op: -3 },
};
/** sumber terbang ke papan */
const SRC: Record<string, string> = {
  c1: 'h-c1',
  k1: 'h-k1',
  k2: 'h-k2',
  s1: 'h-s1',
  s2: 'h-s2',
  s3: 'h-s3',
  s4: 'h-s4',
  s5: 'h-s5',
  g4: 'h-g4',
  g5: 'h-g5',
};

/** op: down (turun), mul (kali dengan pengali `by`), sum (jumlah satu kolom), mark (tanda akhir) */
type Op =
  | { kind: 'down'; from: string; to: string }
  | { kind: 'mul'; from: string; by: 'k1' | 'k2'; to: string }
  | { kind: 'sum'; from: string[]; to: string }
  | { kind: 'mark' };
export const OPS: Op[] = [
  { kind: 'down', from: 'c1', to: 's1' },
  { kind: 'mul', from: 's1', by: 'k2', to: 'u2' },
  { kind: 'mul', from: 's1', by: 'k1', to: 't3' },
  { kind: 'sum', from: ['c2', 'u2'], to: 's2' },
  { kind: 'mul', from: 's2', by: 'k2', to: 'u3' },
  { kind: 'mul', from: 's2', by: 'k1', to: 't4' },
  { kind: 'sum', from: ['c3', 't3', 'u3'], to: 's3' },
  { kind: 'mul', from: 's3', by: 'k2', to: 'u4' },
  { kind: 'mul', from: 's3', by: 'k1', to: 't5' },
  { kind: 'sum', from: ['c4', 't4', 'u4'], to: 's4' },
  { kind: 'sum', from: ['c5', 't5'], to: 's5' },
  { kind: 'mark' },
];
/** keterangan hitungan tiap op, ditulis di bawah skema */
const SAY: string[] = [
  '1\\ \\text{turun ke baris hasil}',
  '1\\times k_2=1\\times(-1)=-1',
  '1\\times k_1=1\\times(-1)=-1',
  'a+(-1)=a-1',
  '(a-1)\\times k_2=(a-1)\\times(-1)=1-a',
  '(a-1)\\times k_1=(a-1)\\times(-1)=1-a',
  'b+(-1)+(1-a)=b-a',
  '(b-a)\\times k_2=(b-a)\\times(-1)=a-b',
  '(b-a)\\times k_1=(b-a)\\times(-1)=a-b',
  '1+(1-a)+(a-b)=2-b',
  '-6+(a-b)=a-b-6',
  '\\text{3 angka hasil bagi, 2 angka sisa}',
];
/** f(x) lengkap dengan koefisien 1 yang tersirat: [TeX sebelum koefisien, koefisien] */
const FX: Array<[string, string]> = [
  ['f(x)=', '1'],
  ['x^4+', 'a'],
  ['x^3+', 'b'],
  ['x^2+', '1'],
  ['x', '-6'],
];
const LAST = OPS.length;
const SVGNS = 'http://www.w3.org/2000/svg';

function markup(): string {
  const cells = Object.entries(CELLS)
    .map(([k, d]) => {
      const pair = k === 's4' || k === 'g4' ? ' data-p="x"' : k === 's5' || k === 'g5' ? ' data-p="c"' : '';
      const src = SRC[k] ? ` data-src="${SRC[k]}"` : '';
      return `<span class="hk-c ${d.cls}" data-k="${k}"${src}${pair} style="grid-area:${d.r}/${d.c}"><span class="hk-ring" aria-hidden="true"></span>${tex(d.t)}</span>`;
    })
    .join('');
  return `<div class="hk-wrap" role="img" aria-label="Horner-Kino: koefisien 1, a, b, 1, −6; k1 = −1 di atas, k2 = −1 di bawah, tempat kosong diberi X. Hasil 1, a − 1, b − a; sisa 2 − b dan a − b − 6.">
  <div class="hk-fx">${FX.map(([pre, co], i) => `${tex(pre)}<span class="hk-co" data-co="${i + 1}"><span class="hk-ring" aria-hidden="true"></span>${tex(co)}</span>`).join('')}</div>
  <div class="hk-grid">
    <span class="hk-vl" style="grid-area:2/1/6/2" aria-hidden="true"></span>
    <span class="hk-hl" style="grid-area:5/2/6/7" aria-hidden="true"></span>
    <span class="hk-cut" style="grid-area:2/5/7/6" aria-hidden="true"></span>
    ${cells}
    <span class="hk-lb hk-lq" style="grid-area:6/2/7/5">hasil bagi</span>
    <span class="hk-lb hk-ls" style="grid-area:6/5/7/7">sisa</span>
    <span class="hk-lb hk-lg" style="grid-area:7/1/8/2">sisa soal</span>
    <span class="hk-say" style="grid-area:8/1/9/7" aria-live="off"></span>
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
  const say = el.querySelector<HTMLElement>('.hk-say')!;
  /** tulis keterangan op ke-i (0 = kosong) */
  const tell = (i: number): void => {
    say.innerHTML = i > 0 ? tex(SAY[i - 1]!) : '';
  };
  const cell = (k: string): HTMLElement => el.querySelector<HTMLElement>(`[data-k="${k}"]`)!;
  let shown: [number, number] = [0, 0];
  let lastK = -1;
  let hl = '';
  let prev = { m: false, co: false, x: false, cut: false, cmp: false };
  /** nomor panggilan apply terakhir: animasi lama berhenti bila sudah ada langkah baru */
  let gen = 0;
  /** animasi op sedang berjalan: jangan gambar ulang panah saat ukuran berubah */
  let busy = false;

  /** posisi sel dalam piksel tata letak wrap (tidak terpengaruh skala panggung) */
  function box(e: Element): { x: number; y: number; w: number; h: number } {
    const R = wrap.getBoundingClientRect();
    const s = R.width ? wrap.offsetWidth / R.width : 1;
    const r = e.getBoundingClientRect();
    return { x: (r.left - R.left) * s, y: (r.top - R.top) * s, w: r.width * s, h: r.height * s };
  }
  function svg<K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string | number>,
  ): SVGElementTagNameMap[K] {
    const e = document.createElementNS(SVGNS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, typeof v === 'number' ? v.toFixed(1) : v);
    return e;
  }

  /** gambar panah/bingkai satu op; kembalikan grupnya */
  function draw(op: Op): SVGGElement | null {
    if (op.kind === 'mark') return null;
    const g = svg('g', { class: `hk-a hk-${op.kind}` });
    if (op.kind === 'down') {
      const a = box(cell(op.from));
      const b = box(cell(op.to));
      const x = a.x + a.w / 2;
      g.append(
        svg('path', {
          d: `M${x.toFixed(1)} ${(a.y + a.h + 2).toFixed(1)}V${(b.y - 3).toFixed(1)}`,
          'marker-end': 'url(#hk-head)',
        }),
      );
      const t = svg('text', { x: x + 8, y: (a.y + a.h + b.y) / 2 + 4 });
      t.textContent = 'turun';
      g.append(t);
    } else if (op.kind === 'mul') {
      const a = box(cell(op.from));
      const b = box(cell(op.to));
      // tempat tujuan dibingkai putus-putus, panah dari angka asal ke tempat itu
      g.append(
        svg('rect', { class: 'hk-slot', x: b.x - 3, y: b.y - 2, width: b.w + 6, height: b.h + 4, rx: 6 }),
      );
      const x1 = a.x + a.w;
      const y1 = a.y + 2;
      const x2 = b.x - 2;
      const y2 = b.y + b.h * 0.6;
      g.append(
        svg('path', {
          d: `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`,
          'marker-end': 'url(#hk-head)',
        }),
      );
      // label di bawah angka asal (baris kosong), tidak menimpa panah
      const t = svg('text', { x: a.x + a.w + 2, y: a.y + a.h + 16 });
      // label mula-mula nama pengalinya, lalu (saat animasi) diganti angkanya
      t.textContent = '× (−1)';
      t.dataset.k = op.by === 'k1' ? '× k₁' : '× k₂';
      g.append(t);
    } else {
      const bs = [...op.from, op.to].map((k) => box(cell(k)));
      const x0 = Math.min(...bs.map((b) => b.x)) - 4;
      const x1 = Math.max(...bs.map((b) => b.x + b.w)) + 4;
      const y0 = Math.min(...bs.map((b) => b.y)) - 2;
      const y1 = Math.max(...bs.map((b) => b.y + b.h)) + 2;
      g.append(svg('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 8 }));
      const t = svg('text', { x: x0 - 5, y: (y0 + y1) / 2 + 6, 'text-anchor': 'end' });
      t.textContent = '+';
      g.append(t);
    }
    arG.append(g);
    return g;
  }

  /** salinan angka melayang dari sel asal ke sel tujuan */
  function ghost(from: string, to: string, delay: number): Promise<boolean> {
    return ghostEl(cell(from), cell(to), CELLS[from]!.t, delay);
  }
  function ghostEl(fromEl: Element, toEl: Element, t: string, delay: number): Promise<boolean> {
    const a = box(fromEl);
    const b = box(toEl);
    const g = document.createElement('span');
    g.className = 'hk-gh';
    g.innerHTML = tex(t);
    g.style.left = `${a.x}px`;
    g.style.top = `${a.y}px`;
    fly.append(g);
    const k = play(
      g,
      [
        { transform: 'translate(0, 0) scale(1.15)', opacity: 1 },
        { transform: `translate(${b.x - a.x}px, ${b.y - a.y}px) scale(1)`, opacity: 0.9 },
      ],
      { duration: 800, delay, easing: EASE, fill: 'both', tag: 'hk' },
    ).finished;
    void k.then(() => g.remove());
    return k;
  }

  const pop = (e: Element, delay = 0): Promise<boolean> => {
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
      duration: 320,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'hk',
    }).finished;
  /** jeda yang ikut pengaturan kecepatan (animasi kosong pada elemen lepas) */
  const idle = document.createElement('span');
  const wait = (ms: number): Promise<boolean> =>
    play(idle, [{ opacity: 1 }, { opacity: 1 }], { duration: ms, tag: 'hk' }).finished;

  function visible(k: number, s: Hk6State): void {
    for (const [key, d] of Object.entries(CELLS)) {
      const on =
        d.op === -1 ? !!s.m : d.op === -2 ? !!s.x : d.op === -3 ? !!s.cmp : d.op === -4 ? !!s.co : d.op <= k;
      cell(key).classList.toggle('on', on);
    }
    el.classList.toggle('show-cut', !!s.cut);
    el.classList.toggle('show-mark', k >= LAST);
    el.classList.toggle('show-cmp', !!s.cmp);
  }
  /** sorotan: sel asal dan pengali (sedang dikali), sel terbaru (warna baru) */
  function mark(src: string[], mul: string | null, fresh: string[]): void {
    el.querySelectorAll('.is-src, .is-mul, .is-new').forEach((e) =>
      e.classList.remove('is-src', 'is-mul', 'is-new'),
    );
    src.forEach((k) => cell(k).classList.add('is-src'));
    if (mul) cell(mul).classList.add('is-mul');
    fresh.forEach((k) => cell(k).classList.add('is-new'));
  }
  const dst = (op: Op): string[] => (op.kind === 'mark' ? [] : [op.to]);

  function drawStatic(k0: number, k: number): void {
    arG.replaceChildren();
    for (let i = k0; i < k; i++) draw(OPS[i]!);
    mark([], null, k > k0 ? dst(OPS[k - 1]!) : []);
    tell(k > k0 ? k : 0);
    shown = [k0, k];
  }

  new ResizeObserver(() => {
    if (!busy && !fly.childElementCount) {
      arG.replaceChildren();
      for (let i = shown[0]; i < shown[1]; i++) draw(OPS[i]!);
    }
  }).observe(wrap);

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Hk6State;
      const k = s.k ?? 0;
      const k0 = s.k0 ?? k;
      const anim = c.dir > 0 && !reducedMotion();
      const runOps = anim && k > k0 && (k !== lastK || c.replay);
      const my = ++gen;
      busy = false;
      const live = (): boolean => c.live() && my === gen;
      fly.querySelectorAll('.hk-gh').forEach((g) => g.remove());
      el.querySelectorAll('.hk-co.is-src').forEach((e) => e.classList.remove('is-src'));
      const runs: Array<Promise<boolean>> = [];
      // pengali, X, batas sisa, dan sisa soal yang baru muncul
      const fresh = (flag: boolean, was: boolean): boolean => anim && flag && (!was || c.replay);
      const newM = fresh(!!s.m, prev.m);
      const newCo = anim && !!s.coIn && (!prev.co || c.replay);
      const newX = fresh(!!s.x, prev.x);
      const newCut = fresh(!!s.cut, prev.cut);
      const newCmp = fresh(!!s.cmp, prev.cmp);
      prev = { m: !!s.m, co: !!s.co, x: !!s.x, cut: !!s.cut, cmp: !!s.cmp };

      if (!runOps) {
        visible(k, s);
        drawStatic(k0, k);
      } else {
        // mulai dari keadaan sebelum langkah ini, lalu jalankan op satu per satu
        busy = true;
        visible(k0, s);
        arG.replaceChildren();
        mark([], null, []);
        shown = [k0, k0];
        for (let i = k0; i < k; i++) {
          if (!live()) return;
          const op = OPS[i]!;
          shown = [k0, i + 1];
          tell(i + 1);
          void fadeIn(say);
          if (op.kind === 'mark') {
            mark([], null, []);
            el.classList.add('show-mark');
            await Promise.all([...el.querySelectorAll('.hk-lq, .hk-ls')].map((e, j) => fadeIn(e, j * 200)));
            continue;
          }
          // 1) sorot angka asal (dan pengalinya)
          const src = op.kind === 'sum' ? op.from : [op.from];
          mark(src, op.kind === 'mul' ? op.by : null, []);
          await Promise.all([
            ...src.map((x) => pop(cell(x).querySelector('.hk-ring')!)),
            ...(op.kind === 'mul' ? [pop(cell(op.by).querySelector('.hk-ring')!)] : []),
          ]);
          if (!live()) return;
          // 2) panah/bingkai dan tempat tujuan
          const g = draw(op);
          const lbl = g?.querySelector<SVGTextElement>('text[data-k]');
          if (lbl) lbl.textContent = lbl.dataset.k ?? '';
          if (g) await fadeIn(g);
          await wait(250);
          if (!live()) return;
          // nama pengali berganti menjadi angkanya
          if (lbl) {
            await wait(450);
            if (!live()) return;
            lbl.textContent = '× (−1)';
            await fadeIn(lbl);
          }
          if (!live()) return;
          // 3) angka melayang ke tujuan
          await Promise.all(src.map((f, j) => ghost(f, op.to, j * 140)));
          if (!live()) return;
          // 4) hasil muncul dengan warna baru
          cell(op.to).classList.add('on');
          mark([], null, [op.to]);
          await pop(cell(op.to));
          await wait(200);
        }
        if (!live()) return;
        busy = false;
        visible(k, s);
      }
      if (newM && !runOps) runs.push(...['k1', 'k2'].map((x, i) => pop(cell(x), i * 200)));
      if (newCo) {
        // koefisien diambil satu per satu dari f(x): disorot, melayang ke tabel, muncul
        ['c1', 'c2', 'c3', 'c4', 'c5'].forEach((x) => cell(x).classList.remove('on'));
        for (let i = 1; i <= 5; i++) {
          if (!live()) return;
          const co = el.querySelector(`[data-co="${i}"]`)!;
          const to = cell(`c${i}`);
          to.classList.remove('on');
          co.classList.add('is-src');
          await pop(co.querySelector('.hk-ring')!);
          if (!live()) return void co.classList.remove('is-src');
          await ghostEl(co, to, FX[i - 1]![1], 0);
          co.classList.remove('is-src');
          if (!live()) return;
          to.classList.add('on');
          mark([], null, [`c${i}`]);
          await pop(to);
        }
        if (!live()) return;
        mark([], null, []);
      }
      if (newX && !runOps) runs.push(...['x1', 'x2', 'x3', 'x4'].map((x, i) => pop(cell(x), 200 + i * 220)));
      if (newCut && !runOps) runs.push(fadeIn(el.querySelector('.hk-cut')!, 300));
      if (newCmp) runs.push(...['g4', 'g5'].map((x, i) => pop(cell(x), 300 + i * 150)));
      lastK = k;

      const h = s.hl ?? '';
      el.dataset.hl = h;
      if (h && anim && (h !== hl || c.replay))
        el.querySelectorAll(`[data-p="${h}"] .hk-ring`).forEach((r, i) => runs.push(pop(r, 200 + i * 250)));
      hl = h;
      await Promise.all(runs);
    },
  };
}
