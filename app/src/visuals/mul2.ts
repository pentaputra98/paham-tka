/**
 * Adegan "uji perkalian matriks" soal 2, alur guru (v1.29): pilihan D atau E ditulis ulang sebagai
 * matriks × vektor = hasil tertulis, lalu dikalikan baris × kolom.
 *  - row 1 | 2: baris itu dan kolom vektor dibingkai (pasangan yang dikalikan); angkanya sumber terbang
 *    (m-a, m-b, m-c, m-d, m-v1, m-v2); hasil kali baris yang sudah dihitung muncul di vektor "hasil kali";
 *  - cmp: hasil kali dibandingkan dengan hasil tertulis (merah ≠ bila berbeda, emas = bila sama: jawaban);
 *  - v19: Tahukah kalian, 19 = 38 ÷ 2 (persamaan gajah dibagi 2).
 * Angka dari docs/pembahasan25.md soal 2 (kartu D dan E). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Mul2Key = 'D' | 'E';
export interface Mul2State {
  o?: Mul2Key;
  row?: 0 | 1 | 2;
  cmp?: boolean;
  v19?: boolean;
  [k: string]: unknown;
}

interface Opt {
  m: [[string, string], [string, string]];
  v: [string, string];
  /** hasil yang tertulis di pilihan */
  w: [string, string];
  /** hasil perkalian sebenarnya */
  r: [string, string];
}
const OPTS: Record<Mul2Key, Opt> = {
  D: {
    m: [
      ['-1', '2'],
      ['10', '-10'],
    ],
    v: ['38', '34'],
    w: ['3', '4'],
    r: ['30', '40'],
  },
  E: {
    m: [
      ['-\\tfrac15', '\\tfrac15'],
      ['2', '-1'],
    ],
    v: ['19', '34'],
    w: ['3', '4'],
    r: ['3', '4'],
  },
};
const SRC = [
  ['m-a', 'm-b'],
  ['m-c', 'm-d'],
];

function markup(k: Mul2Key): string {
  const o = OPTS[k];
  const cell = (t: string, attrs: string): string =>
    `<div class="m2-c"${attrs}><span class="m2-ring" aria-hidden="true"></span>${tex(t)}</div>`;
  const mat = o.m
    .map((row, r) => row.map((t, j) => cell(t, ` data-r="${r + 1}" data-src="${SRC[r]![j]}"`)).join(''))
    .join('');
  const vec = o.v.map((t, i) => cell(t, ` data-col data-src="m-v${i + 1}"`)).join('');
  const wr = o.w.map((t) => cell(t, '')).join('');
  const res = o.r.map((t, i) => cell(t, ` data-res="${i + 1}"`)).join('');
  const ok = o.r.join() === o.w.join();
  return `<div class="m2-eq">
    <span class="m2-name">${k}</span>
    <div class="m2-br m2-g2">${mat}</div>
    <div class="m2-vcol"><div class="m2-br m2-g1">${vec}</div><span class="m2-v19">38 ÷ 2</span></div>
    <span class="m2-op">=</span>
    <div class="m2-vcol"><div class="m2-br m2-g1 m2-w">${wr}</div><span class="m2-lbl">tertulis</span></div>
  </div>
  <div class="m2-calc${ok ? ' is-ok' : ''}">
    <span class="m2-lbl">hasil kali</span>
    <div class="m2-br m2-g1 m2-res">${res}</div>
    <span class="m2-cmp">${ok ? '=' : '≠'}</span>
    <div class="m2-br m2-g1 m2-w2">${o.w.map((t) => `<div class="m2-c">${tex(t)}</div>`).join('')}</div>
  </div>`;
}

export function createMul2(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-mul';
  let key: Mul2Key | null = null;
  let row = 0;
  let cmp = false;
  let v19 = false;

  const pop = (e: Element, delay: number): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    return play(
      e,
      [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 480, delay, easing: EASE_OUT, fill: 'backwards', tag: 'mul' },
    ).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Mul2State;
      const anim = c.dir > 0 && !reducedMotion();
      const k = s.o ?? 'D';
      const fresh = k !== key;
      if (fresh) {
        el.innerHTML = markup(k);
        el.setAttribute('aria-label', `Pilihan ${k} dikalikan baris kali kolom`);
        key = k;
        row = 0;
        cmp = false;
        v19 = false;
      }
      const runs: Array<Promise<boolean>> = [];
      const r = s.row ?? 0;
      el.dataset.row = String(r);
      // baris yang sedang dikalikan dan kolom vektornya dibingkai
      if (r && anim && (r !== row || c.replay))
        el.querySelectorAll(`[data-r="${r}"] .m2-ring, [data-col] .m2-ring`).forEach((e, i) =>
          runs.push(pop(e, i * 120)),
        );
      el.querySelectorAll<HTMLElement>('[data-res]').forEach((e) => {
        const i = Number(e.dataset.res);
        e.classList.toggle('on', i <= r);
        if (i === r && anim && (r !== row || c.replay)) runs.push(pop(e, 900));
      });
      row = r;
      const wantCmp = !!s.cmp;
      el.classList.toggle('show-cmp', wantCmp);
      if (wantCmp && anim && (!cmp || c.replay))
        el.querySelectorAll('.m2-cmp, .m2-w2').forEach((e, i) => runs.push(pop(e, i * 250)));
      cmp = wantCmp;
      const want19 = !!s.v19;
      el.classList.toggle('show-v19', want19);
      if (want19 && anim && (!v19 || c.replay)) runs.push(pop(el.querySelector('.m2-v19')!, 0));
      v19 = want19;
      await Promise.all(runs);
    },
  };
}
