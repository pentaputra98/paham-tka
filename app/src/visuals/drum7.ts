/**
 * Adegan "sepuluh drum" soal 7 (v1.39): V(T) = 0,05T³ + 0,4T² + 20T untuk satu drum, total 10 drum = 10·V(T).
 * Tiga tampilan pada panggung yang sama:
 *  - drums: n = 1 (satu drum berlabel V(T)) atau 10 (drum lain muncul dari drum pertama); sum: kurung kurawal
 *    "10 · V(T)" di bawah barisan drum.
 *  - mul: tiap suku dikali 10. t = banyak suku yang sudah dihitung (1 = 0,05 → 0,5: koma bergeser satu tempat ke kanan,
 *    nol depan hilang; 2 = 0,4 → 4: koma bergeser ke belakang angka 4 lalu hilang; 3 = 20 → 200: tambah satu nol).
 *  - opts: kelima pilihan dibandingkan per suku dengan hasil kita 0,5T³ + 4T² + 200T. col = banyak kolom yang sudah
 *    dibandingkan, urut suku T, T², T³ (sel sama biru langit, beda merah, baris gugur pudar); win: D emas (jawaban);
 *    val: kolom nilai di T = 10 (opsional; target 10 × 290 = 2.900).
 * Angka dari docs/pembahasan25.md soal 7 (a1–a4, uji T = 10). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Drum7State {
  view?: 'drums' | 'mul' | 'opts';
  n?: 1 | 10;
  sum?: boolean;
  t?: 0 | 1 | 2 | 3;
  col?: 0 | 1 | 2 | 3;
  win?: boolean;
  val?: boolean;
  [k: string]: unknown;
}

// ---- barisan drum (viewBox 640 × 300): 2 baris × 5 drum ----
const DX = 112;
const pos = (i: number): [number, number] => [80 + (i % 5) * DX, 40 + Math.floor(i / 5) * 118];

function drumsMarkup(): string {
  const drums = Array.from({ length: 10 }, (_, i) => {
    const [x, y] = pos(i);
    return `<g class="d7-drum" data-i="${i}" transform="translate(${x} ${y})">
      <rect class="d7-body" x="-34" y="10" width="68" height="78" rx="8"/>
      <ellipse class="d7-top" cx="0" cy="10" rx="34" ry="10"/>
      <path class="d7-band" d="M-34 36H34M-34 62H34"/>
      <text class="d7-lbl" x="0" y="56" text-anchor="middle">V(T)</text></g>`;
  }).join('');
  return `<svg class="d7-drums" viewBox="0 0 640 300" role="img" aria-label="Sepuluh drum yang sama, masing-masing bertambah V(T); totalnya 10 kali V(T)">
  ${drums}
  <g class="d7-sum"><path class="d7-brace" d="M46 262Q46 274 60 274H306Q320 274 320 286Q320 274 334 274H580Q594 274 594 262"/>
  <text class="d7-st" x="320" y="298" text-anchor="middle">10 · V(T)</text></g></svg>`;
}

// ---- tiap suku dikali 10 ----
interface Term {
  /** angka asal sebagai potongan: angka biasa, ',' = koma */
  from: string[];
  pow: string;
  res: string;
}
const TERMS: Term[] = [
  { from: ['0', ',', '0', '5'], pow: 'T^3', res: '0{,}5' },
  { from: ['0', ',', '4'], pow: 'T^2', res: '4' },
  { from: ['2', '0'], pow: 'T', res: '200' },
];

function mulMarkup(): string {
  const rows = TERMS.map((t, i) => {
    const digits = t.from
      .map(
        (d, j) =>
          `<span class="d7-d${d === ',' ? ' d7-comma' : ''}" data-j="${j}">${tex(d === ',' ? '{,}' : d)}</span>`,
      )
      .join('');
    const extra = i === 2 ? `<span class="d7-d d7-zero">${tex('0')}</span>` : '';
    return `<div class="d7-row" data-i="${i + 1}">
      <span class="d7-x">${tex('10\\times')}</span>
      <span class="d7-num">${digits}${extra}</span>
      <span class="d7-pow">${tex(t.pow)}</span>
      <span class="d7-eq">${tex('=')}</span>
      <span class="d7-res">${tex(t.res + t.pow)}</span>
    </div>`;
  }).join('');
  return `<div class="d7-mul" role="img" aria-label="10 kali 0,05 sama dengan 0,5; 10 kali 0,4 sama dengan 4; 10 kali 20 sama dengan 200">${rows}</div>`;
}

// ---- cocokkan pilihan per suku ----
const OPTS: Array<[string, [string, string, string], string]> = [
  ['A', ['50T^3', '40T^2', '200T'], '56{.}000'],
  ['B', ['50T^3', '4T^2', '200T'], '52{.}400'],
  ['C', ['5T^3', '4T^2', '200T'], '7{.}400'],
  ['D', ['0{,}5T^3', '4T^2', '200T'], '2{.}900'],
  ['E', ['0{,}5T^3', '0{,}4T^2', '200T'], '2{.}540'],
];
const OURS: [string, string, string] = ['0{,}5T^3', '4T^2', '200T'];
/** urutan pembandingan: suku T dulu (kolom 3), lalu T² (2), lalu T³ (1) */
const ORDER = [2, 1, 0];

function optsMarkup(): string {
  const head = `<span class="d7-h"></span>${['T^3', 'T^2', 'T'].map((p, j) => `<span class="d7-h" data-c="${j}">${tex(`\\text{suku }${p}`)}</span>`).join('')}<span class="d7-h d7-vh">${tex('T=10')}</span>`;
  const ours = `<span class="d7-l d7-ol">hasil</span>${OURS.map((t, j) => `<span class="d7-o" data-c="${j}">${tex(t)}</span>`).join('')}<span class="d7-o d7-v">${tex('2{.}900')}</span>`;
  const rows = OPTS.map(
    ([l, ts, val]) =>
      `<span class="d7-l" data-r="${l}">${l}</span>${ts
        .map(
          (t, j) =>
            `<span class="d7-c${t === OURS[j] ? ' ok' : ' no'}" data-r="${l}" data-c="${j}">${tex(t)}</span>`,
        )
        .join('')}<span class="d7-c d7-v${l === 'D' ? ' ok' : ' no'}" data-r="${l}">${tex(val)}</span>`,
  ).join('');
  return `<div class="d7-opts" role="img" aria-label="Kelima pilihan dibandingkan per suku dengan 0,5T³ + 4T² + 200T; hanya D yang sama">${head}${ours}${rows}</div>`;
}

export function createDrum7(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-drum';
  el.innerHTML = drumsMarkup() + mulMarkup() + optsMarkup();
  const drums = [...el.querySelectorAll<SVGGElement>('.d7-drum')];
  const rows = [...el.querySelectorAll<HTMLElement>('.d7-row')];
  let view = '';
  let n = 0;
  let sum = false;
  let t = 0;
  let col = 0;
  let win = false;
  let val = false;
  let gen = 0;

  const pop = (e: Element, delay = 0): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    return play(
      e,
      [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 420, delay, easing: EASE_OUT, fill: 'backwards', tag: 'drum' },
    ).finished;
  };
  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 400,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'drum',
    }).finished;
  const fadeOut = (e: Element): Promise<boolean> =>
    play(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 400, easing: EASE, fill: 'forwards', tag: 'drum' })
      .finished;

  /** geser koma satu tempat ke kanan, lalu buang nol depan / koma di belakang; hasil muncul */
  async function shift(i: number, live: () => boolean): Promise<void> {
    const row = rows[i]!;
    const ds = [...row.querySelectorAll<HTMLElement>('.d7-num .d7-d')];
    const comma = row.querySelector<HTMLElement>('.d7-comma');
    row.classList.add('is-cur');
    if (comma) {
      // koma melompati angka sesudahnya
      const next = comma.nextElementSibling as HTMLElement;
      const w = next.getBoundingClientRect().width;
      const s = el.offsetWidth / (el.getBoundingClientRect().width || 1);
      await Promise.all([
        play(comma, [{ transform: 'none' }, { transform: `translateX(${w * s}px)` }], {
          duration: 700,
          easing: EASE,
          fill: 'forwards',
          tag: 'drum',
        }).finished,
        play(
          next,
          [{ transform: 'none' }, { transform: `translateX(${-comma.getBoundingClientRect().width * s}px)` }],
          {
            duration: 700,
            easing: EASE,
            fill: 'forwards',
            tag: 'drum',
          },
        ).finished,
      ]);
      if (!live()) return;
      // nol depan (dan koma yang kini di ujung) dibuang
      const drop = [ds[0]!];
      if (i === 1) drop.push(comma);
      await Promise.all(drop.map(fadeOut));
    } else {
      await pop(row.querySelector('.d7-zero')!);
    }
    if (!live()) return;
    row.classList.add('done');
    await pop(row.querySelector('.d7-res')!);
  }

  /** kembalikan baris perkalian ke keadaan statis (koma di tempat semula, hasil tampil bila sudah dihitung) */
  function resetRows(m: number): void {
    rows.forEach((r, i) => {
      r.classList.toggle('done', i < m);
      r.classList.remove('is-cur');
      r.querySelectorAll<HTMLElement>('.d7-d').forEach((d) => d.getAnimations().forEach((a) => a.cancel()));
    });
  }

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Drum7State;
      const my = ++gen;
      const live = (): boolean => c.live() && my === gen;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'drums';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(`.d7-${v}`)!));
        view = v;
      }

      // drum: satu lalu sepuluh, drum baru muncul dari drum pertama
      const m = s.n ?? 1;
      drums.forEach((d, i) => d.classList.toggle('on', i < m));
      if (anim && v === 'drums' && m === 10 && (n < 10 || c.replay)) {
        const [x0, y0] = pos(0);
        drums.slice(1).forEach((d, i) => {
          const [x, y] = pos(i + 1);
          runs.push(
            play(
              d,
              [
                { transform: `translate(${x0}px, ${y0}px)`, opacity: 0 },
                { transform: `translate(${x}px, ${y}px)`, opacity: 1 },
              ],
              { duration: 600, delay: i * 110, easing: EASE, fill: 'backwards', tag: 'drum' },
            ).finished,
          );
        });
      }
      n = m;
      const wantSum = !!s.sum;
      el.classList.toggle('show-sum', wantSum);
      if (anim && wantSum && (!sum || c.replay)) runs.push(fadeIn(el.querySelector('.d7-sum')!, 300));
      sum = wantSum;

      // perkalian per suku
      const tt = s.t ?? 0;
      // tiap langkah memperagakan sukunya sendiri (suku sebelumnya sudah tampil)
      const prevT = Math.max(0, tt - 1);
      const runMul = anim && v === 'mul' && tt > prevT && (tt !== t || c.replay);
      resetRows(runMul ? prevT : tt);
      t = tt;
      if (runMul) {
        await Promise.all(runs.splice(0));
        for (let i = prevT; i < tt; i++) {
          if (!live()) return;
          await shift(i, live);
        }
        if (!live()) return;
        rows.forEach((r) => r.classList.remove('is-cur'));
      }

      // cocokkan pilihan per suku
      const cc = s.col ?? 0;
      el.dataset.col = String(cc);
      el.querySelectorAll<HTMLElement>('.d7-opts [data-c]').forEach((e) => {
        const j = Number(e.dataset.c);
        e.classList.toggle('cmp', ORDER.indexOf(j) < cc);
        e.classList.toggle('cur', ORDER.indexOf(j) === cc - 1);
      });
      const out = new Set<string>();
      OPTS.forEach(([l, ts]) => {
        if (ORDER.slice(0, cc).some((j) => ts[j] !== OURS[j])) out.add(l);
      });
      el.querySelectorAll<HTMLElement>('.d7-opts [data-r]').forEach((e) =>
        e.classList.toggle('out', out.has(e.dataset.r!)),
      );
      if (anim && v === 'opts' && (cc > col || c.replay) && cc > 0) {
        const j = ORDER[cc - 1]!;
        el.querySelectorAll(`.d7-opts [data-c="${j}"]`).forEach((e, i) => runs.push(pop(e, i * 120)));
      }
      col = cc;
      const w = !!s.win;
      el.classList.toggle('is-win', w);
      if (anim && w && (!win || c.replay))
        el.querySelectorAll('.d7-opts [data-r="D"]').forEach((e, i) => runs.push(pop(e, i * 100)));
      win = w;
      const vv = !!s.val;
      el.classList.toggle('show-val', vv);
      if (anim && vv && (!val || c.replay))
        el.querySelectorAll('.d7-v, .d7-vh').forEach((e, i) => runs.push(pop(e, i * 160)));
      val = vv;
      await Promise.all(runs);
    },
  };
}
