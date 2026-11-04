/**
 * Adegan "timeline aljabar" soal 20 (revisi pemilik v1.53): L → L′ → L″ dalam bentuk persamaan lingkaran.
 * Dua tampilan pada panggung yang sama:
 *  - tl: tiga baris bertingkat L, L′, L″ dengan panah transformasi di antaranya. n = banyak baris yang tampil,
 *    m = 1 berarti baris terakhir sudah berganti ke bentuk keduanya. Huruf x (biru langit) dan y (ungu) TERBANG dari
 *    baris sebelumnya; bagian yang berubah (mint) berdenyut; bentuk pertama berganti ke bentuk kedua dengan pudar silang.
 *     L   (x + 5)² + (y − 3)² = 2²                                   pusat (−5, 3), r = 2
 *     ↓ translasi T(a, b): x diganti x − a, y diganti y − b, jari-jari tetap
 *     L′  ((x − a) + 5)² + ((y − b) − 3)² = 2²  →  (x − (a − 5))² + (y − (b + 3))² = 2²
 *     ↓ dilatasi [O, k]: pusat dikali k, jari-jari dikali k
 *     L″  (x − k(a − 5))² + (y − k(b + 3))² = (2k)²  →  … = 4k²
 *  - cmp: persamaan L″ aljabar di atas persamaan dari soal, bagian yang bersesuaian berwarna sama (biru langit,
 *    ungu, mint); s = banyak baris penyelesaian: k = 2, a = 3, b = −1, lalu T = (3, −1), k = 2 (emas, jawaban).
 * Angka dari docs/pembahasan25.md soal 20 (a1–d3) dengan pemisalan T = (a, b) arahan pemilik. Gerak hanya
 * transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Tl20State {
  view?: 'tl' | 'cmp';
  n?: number;
  m?: 0 | 1;
  s?: number;
  [k: string]: unknown;
}

const X = (t: string): string => `\\htmlClass{t20-x}{${t}}`;
const Y = (t: string): string => `\\htmlClass{t20-y}{${t}}`;
const K = (t: string): string => `\\htmlClass{t20-k}{${t}}`;
const A = (t: string): string => `\\htmlClass{t20-ka}{${t}}`;
const B = (t: string): string => `\\htmlClass{t20-kb}{${t}}`;
const C = (t: string): string => `\\htmlClass{t20-kc}{${t}}`;

type Row = { tag: string; a: string; b?: string; ca: string; cb?: string };
const ROWS: Row[] = [
  { tag: 'L', a: `(${X('x')}+5)^2+(${Y('y')}-3)^2=${K('2')}^2`, ca: 'pusat (−5, 3), jari-jari 2' },
  {
    tag: 'L′',
    a: `(${X('(x-a)')}+5)^2+(${Y('(y-b)')}-3)^2=${K('2^2')}`,
    b: `(${X('x')}-${K('(a-5)')})^2+(${Y('y')}-${K('(b+3)')})^2=2^2`,
    ca: 'x diganti x − a, y diganti y − b',
    cb: 'pusat (a − 5, b + 3), jari-jari tetap 2',
  },
  {
    tag: 'L″',
    a: `(${X('x')}-${K('k')}(a-5))^2+(${Y('y')}-${K('k')}(b+3))^2=(${K('2k')})^2`,
    b: `(${X('x')}-k(a-5))^2+(${Y('y')}-k(b+3))^2=${K('4k^2')}`,
    ca: 'pusat dikali k, jari-jari 2 menjadi 2k',
    cb: '(2k)² = 4k²',
  },
];
const ARR = ['translasi T(a, b), jari-jari tetap', 'dilatasi [O, k], pusat dan jari-jari dikali k'];

function tlMarkup(): string {
  const parts: string[] = [];
  ROWS.forEach((r, i) => {
    if (i)
      parts.push(
        `<div class="t20-arr" data-i="${i + 1}"><span class="t20-ah">↓</span><span>${ARR[i - 1]}</span></div>`,
      );
    parts.push(`<div class="t20-row" data-i="${i + 1}"><span class="t20-tag">${r.tag}</span>
      <span class="t20-eq"><span class="t20-f t20-fa">${tex(r.a)}</span>${r.b ? `<span class="t20-f t20-fb">${tex(r.b)}</span>` : ''}</span>
      <small><span class="t20-ca">${r.ca}</span>${r.cb ? `<span class="t20-cb">${r.cb}</span>` : ''}</small></div>`);
  });
  return `<div class="t20-tl" role="img" aria-label="Timeline: L (x + 5)² + (y − 3)² = 2²; translasi T(a, b) memberi L′ (x − (a − 5))² + (y − (b + 3))² = 2²; dilatasi [O, k] memberi L″ (x − k(a − 5))² + (y − k(b + 3))² = 4k²">${parts.join('')}</div>`;
}

/** penyamaan dengan soal (docs a1–d3 dalam bentuk pemisalan) */
const PAIR = [
  `(x-${A('k(a-5)')})^2+(y-${B('k(b+3)')})^2=${C('4k^2')}`,
  `(x-${A('(-4)')})^2+(y-${B('4')})^2=${C('16')}`,
];
const SOLVE = [
  `${C('4k^2=16')}\\ \\to\\ k^2=4\\ \\to\\ k=2`,
  `${A('k(a-5)=-4')}\\ \\to\\ 2(a-5)=-4\\ \\to\\ a-5=-2\\ \\to\\ a=3`,
  `${B('k(b+3)=4')}\\ \\to\\ 2(b+3)=4\\ \\to\\ b+3=2\\ \\to\\ b=-1`,
  `\\htmlClass{t20-ans}{T=\\begin{pmatrix}3\\\\-1\\end{pmatrix},\\ k=2}`,
];

function cmpMarkup(): string {
  return `<div class="t20-cmp" role="img" aria-label="(x − k(a − 5))² + (y − k(b + 3))² = 4k² disamakan dengan (x − (−4))² + (y − 4)² = 16: k = 2, a = 3, b = −1">
  <div class="t20-pair"><span class="t20-pl">${tex(PAIR[0]!)}<small>hasil aljabar</small></span><span class="t20-pl">${tex(PAIR[1]!)}<small>dari soal, (x + 4)² + (y − 4)² = 16</small></span></div>
  ${SOLVE.map((t, i) => `<div class="t20-sl" data-i="${i + 1}">${tex(t)}</div>`).join('')}</div>`;
}

export function createTl20(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-tl20';
  el.innerHTML = tlMarkup() + cmpMarkup();
  const rows = [...el.querySelectorAll<HTMLElement>('.t20-row')];
  const arrs = [...el.querySelectorAll<HTMLElement>('.t20-arr')];
  let view = '';
  let n = 0;
  let m = 0;
  let s = 0;
  let gen = 0;

  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'tl20',
    }).finished;
  const slideIn = (e: Element, delay = 0): Promise<boolean> =>
    play(
      e,
      [
        { transform: 'translateY(0.6em)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 600, delay, easing: EASE_OUT, fill: 'backwards', tag: 'tl20' },
    ).finished;
  const pulse = (e: Element, delay = 0): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    return play(e, [{ transform: 'none' }, { transform: 'scale(1.2)' }, { transform: 'none' }], {
      duration: 700,
      delay,
      easing: EASE,
      tag: 'tl20',
    }).finished;
  };
  const form = (r: HTMLElement): HTMLElement =>
    r.querySelector<HTMLElement>(r.classList.contains('is-b') ? '.t20-fb' : '.t20-fa')!;
  /** huruf x/y pada target terbang dari posisi huruf yang sama di sumber */
  const fly = (
    from: HTMLElement,
    to: HTMLElement,
    scale: number,
    delay: number,
    arc: number,
  ): Array<Promise<boolean>> => {
    const src = new Map<string, DOMRect>();
    for (const c of ['t20-x', 't20-y']) {
      const e = from.querySelector(`.${c}`);
      if (e) src.set(c, e.getBoundingClientRect());
    }
    return [...to.querySelectorAll<HTMLElement>('.t20-x, .t20-y')].flatMap((e) => {
      const f = src.get(e.classList.contains('t20-x') ? 't20-x' : 't20-y');
      if (!f) return [];
      const t = e.getBoundingClientRect();
      const dx = (f.left + f.width / 2 - (t.left + t.width / 2)) * scale;
      const dy = (f.top + f.height / 2 - (t.top + t.height / 2)) * scale;
      return [
        play(
          e,
          [
            { transform: `translate(${dx}px, ${dy}px) scale(1.2)` },
            { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - arc}px) scale(1.3)`, offset: 0.5 },
            { transform: 'none' },
          ],
          { duration: 1200, delay, easing: EASE, fill: 'backwards', tag: 'tl20' },
        ).finished,
      ];
    });
  };

  function layout(nn: number, mm: number): void {
    rows.forEach((r, i) => {
      r.classList.toggle('on', i < nn);
      r.classList.toggle('is-cur', i === nn - 1);
      r.classList.toggle('is-b', !!r.querySelector('.t20-fb') && (i < nn - 1 || (i === nn - 1 && mm === 1)));
    });
    arrs.forEach((a) => a.classList.toggle('on', Number(a.dataset.i) <= nn));
  }

  return {
    el,
    async apply(state, c: Ctx) {
      const st = state as Tl20State;
      const my = ++gen;
      const live = (): boolean => c.live() && my === gen;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = st.view ?? 'tl';
      const wasView = view;
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(`.t20-${v}`)!));
        view = v;
      }

      // ---- baris penyelesaian ----
      const ss = st.s ?? 0;
      el.querySelectorAll<HTMLElement>('.t20-sl').forEach((l) => {
        const i = Number(l.dataset.i);
        l.classList.toggle('on', i <= ss);
        l.classList.toggle('is-cur', i === ss);
        l.classList.toggle('is-gone', i < ss - 1);
        if (anim && v === 'cmp' && i <= ss && (i > s || c.replay))
          runs.push(slideIn(l, (i - 1 - (c.replay ? 0 : s)) * 700));
      });
      if (anim && v === 'cmp' && ss === 0 && (s !== 0 || c.replay || wasView !== 'cmp')) {
        el.querySelectorAll('.t20-pair :is(.t20-ka, .t20-kb, .t20-kc)').forEach((e, j) =>
          runs.push(pulse(e, 400 + (j % 3) * 350)),
        );
      }
      s = ss;

      // ---- timeline ----
      const nn = st.n ?? 0;
      const mm = st.m ?? 0;
      const runTl = anim && v === 'tl' && nn > 0 && (nn !== n || mm !== m || c.replay);
      if (!runTl) {
        layout(nn, mm);
        n = nn;
        m = mm;
        await Promise.all(runs);
        return;
      }
      const newRow = nn > n || c.replay;
      const scale = el.offsetHeight / (el.getBoundingClientRect().height || 1);
      const cur = rows[nn - 1]!;
      const prevRow = rows[nn - 2];
      // sumber terbang: bentuk yang tampil di baris sebelumnya
      if (newRow) layout(nn - 1, 1);
      const srcForm = prevRow && prevRow.classList.contains('on') ? form(prevRow) : null;
      layout(nn, 0);
      n = nn;
      m = mm;
      if (newRow) {
        const fa = cur.querySelector<HTMLElement>('.t20-fa')!;
        const arr = arrs.find((a) => Number(a.dataset.i) === nn);
        if (arr) runs.push(slideIn(arr));
        runs.push(slideIn(cur, arr ? 300 : 0));
        if (srcForm) runs.push(...fly(srcForm, fa, scale, 500, 20));
        await Promise.all(runs.splice(0));
        if (!live()) return;
        await Promise.all([...fa.querySelectorAll('.t20-k')].map((e, j) => pulse(e, j * 220)));
        if (!live()) return;
      }
      if (mm === 1) {
        const fa = cur.querySelector<HTMLElement>('.t20-fa')!;
        const fb = cur.querySelector<HTMLElement>('.t20-fb');
        if (fb) {
          if (newRow)
            await play(fa, [{ opacity: 1 }, { opacity: 1 }], { duration: 600, tag: 'tl20' }).finished;
          if (!live()) return;
          cur.classList.add('is-b');
          await Promise.all([
            play(fa, [{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: EASE, tag: 'tl20' }).finished,
            play(
              fb,
              [
                { opacity: 0, transform: 'translateY(0.25em)' },
                { opacity: 1, transform: 'none' },
              ],
              { duration: 550, easing: EASE_OUT, tag: 'tl20' },
            ).finished,
            ...fly(fa, fb, scale, 0, 0),
          ]);
          if (!live()) return;
          await Promise.all([...fb.querySelectorAll('.t20-k')].map((e, j) => pulse(e, j * 220)));
        }
      }
      await Promise.all(runs);
    },
  };
}
