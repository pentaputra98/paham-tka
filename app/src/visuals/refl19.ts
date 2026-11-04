/**
 * Adegan "cermin lalu translasi pada garis" soal 19 (v1.51). Tiga tampilan pada panggung yang sama:
 *  - rule: kisi dengan garis cermin y = x; r = 1 titik P(4, 1) dicerminkan menjadi (1, 4); r = 2 lalu digeser
 *    T(1, −1) menjadi (2, 3). Menjelaskan aturan (x, y) → (y, x) dan (x, y) → (x + 1, y − 1).
 *  - eq: baris penurunan persamaan yang besar; set = 1 (garis pertama), 2 (garis kedua), 3 (nilai 2a − b); s = baris
 *    terakhir yang tampil (tiga baris terakhir tampil). Huruf x dan y (kelas t19-x, t19-y) TERBANG dari posisinya di
 *    baris sebelumnya ke posisi barunya, sehingga pertukaran x ↔ y dan penggantian x → x − 1, y → y + 1 terlihat.
 *    Baris yang punya bentuk kedua (b) berganti dengan pudar silang; bagian penting (t19-k) berdenyut.
 *  - graph (opsional): uji titik dari dokumen; g = 1 titik (3, 3) pada 2x + y − 9 = 0 → (3, 3) → (4, 2) pada
 *    x + 2y − 8 = 0; g = 2 titik (0, 3) pada x − 2y + 6 = 0 → (3, 0) → (4, −1) pada 2x − y − 9 = 0; k = tahap.
 * Angka dari docs/pembahasan25.md soal 19 (a1–c3, Pemeriksaan hasil). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Refl19State {
  view?: 'rule' | 'eq' | 'graph';
  r?: number;
  set?: 1 | 2 | 3;
  s?: number;
  g?: 1 | 2;
  k?: number;
  [k: string]: unknown;
}

const X = (t: string): string => `\\htmlClass{t19-x}{${t}}`;
const Y = (t: string): string => `\\htmlClass{t19-y}{${t}}`;
const K = (t: string): string => `\\htmlClass{t19-k}{${t}}`;
type Line = { a: string; b?: string; lbl: string };
/** baris penurunan tiap set (docs a1–a6, b1–b6, c1–c3) */
const SETS: Record<1 | 2 | 3, Line[]> = {
  1: [
    { a: `a${X('x')}+${Y('y')}-9=0`, lbl: 'garis pertama' },
    {
      a: `a${Y('y')}+${X('x')}-9=0`,
      b: `${X('x')}+a${Y('y')}-9=0`,
      lbl: 'cermin y = x, x dan y bertukar',
    },
    { a: `${X('(x-1)')}+a${Y('(y+1)')}-9=0`, lbl: 'translasi, x diganti x − 1, y diganti y + 1' },
    {
      a: `x-1+ay+a-9=0`,
      b: `x+ay${K('+(a-10)')}=0`,
      lbl: 'dijabarkan, −1 + a − 9 = a − 10',
    },
    {
      a: `\\begin{aligned}x+${K('a')}y${K('+(a-10)')}&=0\\\\x+${K('2')}y${K('-8')}&=0\\end{aligned}`,
      b: `${K('a=2')}\\qquad a-10=-8\\ \\checkmark`,
      lbl: 'samakan dengan bayangan x + 2y − 8 = 0',
    },
  ],
  2: [
    { a: `${X('x')}+b${Y('y')}+6=0`, lbl: 'garis kedua' },
    {
      a: `${Y('y')}+b${X('x')}+6=0`,
      b: `b${X('x')}+${Y('y')}+6=0`,
      lbl: 'cermin y = x, x dan y bertukar',
    },
    { a: `b${X('(x-1)')}+${Y('(y+1)')}+6=0`, lbl: 'translasi, x diganti x − 1, y diganti y + 1' },
    {
      a: `bx-b+y+1+6=0`,
      b: `bx+y${K('+(7-b)')}=0`,
      lbl: 'dijabarkan, −b + 1 + 6 = 7 − b',
    },
    {
      a: `2x-y-9=0`,
      b: `${K('-2')}x+y${K('+9')}=0`,
      lbl: 'bayangan dikali −1, supaya koefisien y sama-sama 1',
    },
    {
      a: `\\begin{aligned}${K('b')}x+y${K('+(7-b)')}&=0\\\\${K('-2')}x+y${K('+9')}&=0\\end{aligned}`,
      b: `${K('b=-2')}\\qquad 7-b=9\\ \\checkmark`,
      lbl: 'samakan kedua persamaan',
    },
  ],
  3: [
    { a: `2a-b=2(${K('2')})-(${K('-2')})`, lbl: 'a = 2 dan b = −2 dimasukkan' },
    { a: `2a-b=4${K('+2')}`, lbl: '−(−2) = +2' },
    { a: `\\htmlClass{t19-ans}{2a-b=6}`, lbl: 'hasilnya' },
  ],
};

function eqMarkup(): string {
  const sets = ([1, 2, 3] as const)
    .map(
      (n) =>
        `<div class="t19-set" data-set="${n}">${SETS[n]
          .map(
            (l, i) =>
              `<div class="t19-l" data-i="${i + 1}"><span class="t19-f t19-fa">${tex(l.a)}</span>${l.b ? `<span class="t19-f t19-fb">${tex(l.b)}</span>` : ''}<small>${l.lbl}</small></div>`,
          )
          .join('')}</div>`,
    )
    .join('');
  return `<div class="t19-eq" role="img" aria-label="Garis ax + y − 9 = 0 dicerminkan menjadi x + ay − 9 = 0, ditranslasi menjadi x + ay + (a − 10) = 0, jadi a = 2; garis x + by + 6 = 0 menjadi bx + y + (7 − b) = 0, dibandingkan dengan −2x + y + 9 = 0, jadi b = −2; 2a − b = 6">${sets}</div>`;
}

// ---- kisi aturan (viewBox 360 × 300), x −1..6, y −1..5 ----
const RU = 44;
const RX = 70;
const RY = 254;
const rx = (x: number): number => RX + x * RU;
const ry = (y: number): number => RY - y * RU;

function gridLines(
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  sx: (v: number) => number,
  sy: (v: number) => number,
): string {
  const g: string[] = [];
  for (let x = x0; x <= x1; x++)
    g.push(`<path class="t19-g${x === 0 ? ' t19-ax' : ''}" d="M${sx(x)} ${sy(y0)}V${sy(y1)}"/>`);
  for (let y = y0; y <= y1; y++)
    g.push(`<path class="t19-g${y === 0 ? ' t19-ax' : ''}" d="M${sx(x0)} ${sy(y)}H${sx(x1)}"/>`);
  return g.join('');
}

function ruleMarkup(): string {
  const dot = (cls: string, x: number, y: number, lbl: string, dx: number, dy: number): string =>
    `<g class="${cls}"><circle cx="${rx(x)}" cy="${ry(y)}" r="7"/><text x="${rx(x) + dx}" y="${ry(y) + dy}">${lbl}</text></g>`;
  return `<svg class="t19-rule" viewBox="0 0 360 356" role="img" aria-label="Titik (4, 1) dicerminkan terhadap y = x menjadi (1, 4), lalu digeser 1 ke kanan dan 1 ke bawah menjadi (2, 3)">
  <defs><marker id="t19-h" class="t19-hm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs>
  ${gridLines(-1, 6, -1, 5, rx, ry)}
  <path class="t19-mir" d="M${rx(-1)} ${ry(-1)}L${rx(5.4)} ${ry(5.4)}"/><text class="t19-ml" x="${rx(5) - 4}" y="${ry(5.4) + 4}" text-anchor="end">y = x</text>
  <path class="t19-r1 t19-link" d="M${rx(4)} ${ry(1)}Q${rx(4.4)} ${ry(4.4)} ${rx(1)} ${ry(4)}"/>
  <path class="t19-r2 t19-mv" d="M${rx(1)} ${ry(4)}H${rx(2)}V${ry(3.25)}" marker-end="url(#t19-h)"/>
  ${dot('t19-p t19-p0', 4, 1, '(4, 1)', 12, 20)}
  ${dot('t19-p t19-p1 t19-r1', 1, 4, '(1, 4)', -64, -10)}
  ${dot('t19-p t19-p2 t19-r2', 2, 3, '(2, 3)', -70, 6)}
  <text class="t19-cap t19-r1" x="16" y="${ry(-1) + 30}">cermin (x, y) → (y, x)</text>
  <text class="t19-cap t19-r2" x="16" y="${ry(-1) + 52}">geser 1 kanan, 1 bawah</text>
  </svg>`;
}

// ---- grafik uji titik (viewBox 420 × 380), x −2..8, y −3..7 ----
const GU = 34;
const GX = 88;
const GY = 262;
const gx = (x: number): number => GX + x * GU;
const gy = (y: number): number => GY - y * GU;
const XR: [number, number] = [-2, 8];
const YR: [number, number] = [-3, 7];
/** ruas garis Ax + By = C di dalam jendela */
function seg(A: number, B: number, C: number): string {
  const pts: Array<[number, number]> = [];
  if (B !== 0)
    for (const x of XR) {
      const y = (C - A * x) / B;
      if (y >= YR[0] && y <= YR[1]) pts.push([x, y]);
    }
  if (A !== 0)
    for (const y of YR) {
      const x = (C - B * y) / A;
      if (x >= XR[0] && x <= XR[1]) pts.push([x, y]);
    }
  pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const [p, q] = [pts[0]!, pts[pts.length - 1]!];
  return `M${gx(p[0])} ${gy(p[1])}L${gx(q[0])} ${gy(q[1])}`;
}
/** uji titik dokumen: [garis awal, cermin, translasi] dan [titik awal, cermin, translasi] */
const TEST: Record<1 | 2, { L: Array<[number, number, number]>; P: Array<[number, number]>; lbl: string[] }> =
  {
    1: {
      L: [
        [2, 1, 9],
        [1, 2, 9],
        [1, 2, 8],
      ],
      P: [
        [3, 3],
        [3, 3],
        [4, 2],
      ],
      lbl: ['2x + y − 9 = 0', 'x + 2y − 9 = 0', 'x + 2y − 8 = 0'],
    },
    2: {
      L: [
        [1, -2, -6],
        [2, -1, 6],
        [2, -1, 9],
      ],
      P: [
        [0, 3],
        [3, 0],
        [4, -1],
      ],
      lbl: ['x − 2y + 6 = 0', '2x − y − 6 = 0', '2x − y − 9 = 0'],
    },
  };

function graphMarkup(): string {
  const tests = ([1, 2] as const)
    .map((g) => {
      const t = TEST[g];
      const ln = t.L.map(([A, B, C], i) => `<path class="t19-gl t19-k${i}" d="${seg(A, B, C)}"/>`).join('');
      const pt = t.P.map(
        ([x, y], i) =>
          `<g class="t19-gp t19-k${i}"><circle cx="${gx(x)}" cy="${gy(y)}" r="6"/><text x="${gx(x) + 10}" y="${gy(y) - 10}">(${x}, ${y})</text></g>`,
      ).join('');
      const lb = t.lbl
        .map((s, i) => `<text class="t19-lb t19-k${i}" x="${gx(8) + 18}" y="${gy(5.6) + i * 28}">${s}</text>`)
        .join('');
      return `<g class="t19-test" data-g="${g}">${ln}${pt}${lb}</g>`;
    })
    .join('');
  return `<svg class="t19-graph" viewBox="0 0 580 380" role="img" aria-label="Uji titik: (3, 3) pada 2x + y − 9 = 0 menjadi (4, 2) pada x + 2y − 8 = 0; (0, 3) pada x − 2y + 6 = 0 menjadi (4, −1) pada 2x − y − 9 = 0">
  ${gridLines(XR[0], XR[1], YR[0], YR[1], gx, gy)}
  <path class="t19-mir" d="${seg(1, -1, 0)}"/>${tests}</svg>`;
}

/** banyak baris terakhir yang tampil bersamaan */
const SHOW = 3;

export function createRefl19(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-refl';
  el.innerHTML = ruleMarkup() + eqMarkup() + graphMarkup();
  let view = '';
  let r = 0;
  let set = 0;
  let s = 0;
  let gk = '';
  let gen = 0;

  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'refl',
    }).finished;
  const pulse = (e: Element, delay = 0): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    return play(e, [{ transform: 'none' }, { transform: 'scale(1.18)' }, { transform: 'none' }], {
      duration: 700,
      delay,
      easing: EASE,
      tag: 'refl',
    }).finished;
  };
  /** gerakkan titik SVG dari (x0, y0) ke posisinya sekarang */
  const glide = (e: SVGElement, dx: number, dy: number, delay: number): Promise<boolean> =>
    play(
      e,
      [
        { transform: `translate(${dx}px, ${dy}px)`, opacity: 0.3 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 1000, delay, easing: EASE, fill: 'backwards', tag: 'refl' },
    ).finished;

  const visibleForm = (l: HTMLElement): HTMLElement =>
    l.querySelector<HTMLElement>(l.classList.contains('is-b') ? '.t19-fb' : '.t19-fa')!;

  /** tampilkan tiga baris terakhir sampai k pada set n; baris lama dalam bentuk akhirnya */
  function layout(n: number, k: number, morphed: boolean): void {
    el.querySelectorAll<HTMLElement>('.t19-set').forEach((st) =>
      st.classList.toggle('on', Number(st.dataset.set) === n),
    );
    el.querySelectorAll<HTMLElement>(`.t19-set[data-set="${n}"] .t19-l`).forEach((l) => {
      const i = Number(l.dataset.i);
      l.classList.toggle('on', i <= k && i > k - SHOW);
      l.classList.toggle('is-cur', i === k);
      l.classList.toggle('is-b', !!l.querySelector('.t19-fb') && (i < k || (i === k && morphed)));
    });
  }

  return {
    el,
    async apply(state, c: Ctx) {
      const st = state as Refl19State;
      const my = ++gen;
      const live = (): boolean => c.live() && my === gen;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = st.view ?? 'eq';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(`.t19-${v}`)!));
        view = v;
      }

      // ---- aturan pada satu titik ----
      const rr = st.r ?? 0;
      el.classList.toggle('r1', rr >= 1);
      el.classList.toggle('r2', rr >= 2);
      if (anim && v === 'rule') {
        if (rr >= 1 && (r < 1 || c.replay)) {
          runs.push(fadeIn(el.querySelector('.t19-link')!, 200));
          runs.push(glide(el.querySelector<SVGElement>('.t19-p1')!, rx(4) - rx(1), ry(1) - ry(4), 300));
          runs.push(fadeIn(el.querySelector('.t19-cap.t19-r1')!, 900));
        }
        if (rr >= 2 && (r < 2 || c.replay)) {
          // kalau cermin juga baru tampil, geseran menunggu cermin selesai
          const d = r < 1 || c.replay ? 1500 : 200;
          runs.push(fadeIn(el.querySelector('.t19-mv')!, d));
          runs.push(glide(el.querySelector<SVGElement>('.t19-p2')!, rx(1) - rx(2), ry(4) - ry(3), d));
          runs.push(fadeIn(el.querySelector('.t19-cap.t19-r2')!, d + 700));
        }
      }
      r = rr;

      // ---- grafik uji titik ----
      const g = st.g ?? 0;
      const k = st.k ?? 0;
      el.querySelectorAll<SVGGElement>('.t19-test').forEach((t) => {
        const on = Number(t.dataset.g) === g;
        t.classList.toggle('on', on);
        t.querySelectorAll<SVGElement>('[class*="t19-k"]').forEach((e) => {
          const i = Number(/t19-k(\d)/.exec(e.getAttribute('class')!)![1]);
          e.classList.toggle('vis', on && i < k);
        });
      });
      const key = `${g}:${k}`;
      if (anim && v === 'graph' && g && (key !== gk || c.replay)) {
        const t = el.querySelector<SVGGElement>(`.t19-test[data-g="${g}"]`)!;
        const P = TEST[g].P;
        for (let i = 0; i < k; i++) {
          const d = i * 1300;
          t.querySelectorAll(`.t19-gl.t19-k${i}, .t19-lb.t19-k${i}`).forEach((e) => runs.push(fadeIn(e, d)));
          const pt = t.querySelector<SVGElement>(`.t19-gp.t19-k${i}`)!;
          if (i === 0) runs.push(fadeIn(pt, d));
          else runs.push(glide(pt, gx(P[i - 1]![0]) - gx(P[i]![0]), gy(P[i - 1]![1]) - gy(P[i]![1]), d));
        }
      }
      gk = key;

      // ---- penurunan persamaan ----
      const n = st.set ?? 0;
      const kk = st.s ?? 0;
      const runEq = anim && v === 'eq' && n > 0 && kk > 0 && (n !== set || kk !== s || c.replay);
      if (!runEq) {
        layout(n, kk, true);
        set = n;
        s = kk;
        await Promise.all(runs);
        return;
      }
      const lines = [...el.querySelectorAll<HTMLElement>(`.t19-set[data-set="${n}"] .t19-l`)];
      const scale = el.offsetHeight / (el.getBoundingClientRect().height || 1);
      // posisi huruf x dan y pada bentuk yang tampil di baris sebelumnya (sumber terbang)
      if (n !== set) layout(n, kk - 1, true);
      const prev = lines[kk - 2];
      const src = new Map<string, DOMRect>();
      if (prev && prev.classList.contains('on'))
        for (const cls of ['t19-x', 't19-y']) {
          const e = visibleForm(prev).querySelector(`.${cls}`);
          if (e) src.set(cls, e.getBoundingClientRect());
        }
      const before = new Map(lines.map((l) => [l, l.getBoundingClientRect().top]));
      const was = new Set(lines.filter((l) => l.classList.contains('on')));
      layout(n, kk, false);
      lines
        .filter((l) => l.classList.contains('on') && was.has(l) && Number(l.dataset.i) !== kk)
        .forEach((l) => {
          const dy = (before.get(l)! - l.getBoundingClientRect().top) * scale;
          if (Math.abs(dy) > 1)
            runs.push(
              play(l, [{ transform: `translateY(${dy}px)` }, { transform: 'none' }], {
                duration: DUR.flip,
                easing: EASE,
                tag: 'refl',
              }).finished,
            );
        });
      set = n;
      s = kk;
      const cur = lines[kk - 1]!;
      const fa = cur.querySelector<HTMLElement>('.t19-fa')!;
      // huruf yang punya sumber terbang dari baris sebelumnya terbang ke tempat barunya (melengkung ke atas)
      const fly = [...fa.querySelectorAll<HTMLElement>('.t19-x, .t19-y')].flatMap((e) => {
        const from = src.get(e.classList.contains('t19-x') ? 't19-x' : 't19-y');
        if (!from) return [];
        e.style.display = 'inline-block';
        const to = e.getBoundingClientRect();
        const dx = (from.left + from.width / 2 - (to.left + to.width / 2)) * scale;
        const dy = (from.top + from.height / 2 - (to.top + to.height / 2)) * scale;
        return [{ e, dx, dy }];
      });
      runs.push(
        play(
          cur,
          [
            { transform: 'translateY(0.8em)', opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: 600, easing: EASE_OUT, fill: 'backwards', tag: 'refl' },
        ).finished,
        ...fly.map(
          ({ e, dx, dy }) =>
            play(
              e,
              [
                { transform: `translate(${dx}px, ${dy}px) scale(1.25)` },
                { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 18}px) scale(1.3)`, offset: 0.5 },
                { transform: 'none' },
              ],
              { duration: 1200, delay: 150, easing: EASE, fill: 'backwards', tag: 'refl' },
            ).finished,
        ),
      );
      await Promise.all(runs.splice(0));
      if (!live()) return;
      await Promise.all([...fa.querySelectorAll('.t19-k')].map((e, j) => pulse(e, j * 220)));
      if (!live()) return;
      const fb = cur.querySelector<HTMLElement>('.t19-fb');
      if (fb) {
        await play(fa, [{ opacity: 1 }, { opacity: 1 }], { duration: 600, tag: 'refl' }).finished;
        if (!live()) return;
        // bentuk kedua: huruf x dan y terbang dari bentuk pertama
        const srcB = new Map<string, DOMRect>();
        for (const cls of ['t19-x', 't19-y']) {
          const e = fa.querySelector(`.${cls}`);
          if (e) srcB.set(cls, e.getBoundingClientRect());
        }
        cur.classList.add('is-b');
        const flyB = [...fb.querySelectorAll<HTMLElement>('.t19-x, .t19-y')];
        await Promise.all([
          play(fa, [{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: EASE, tag: 'refl' }).finished,
          play(
            fb,
            [
              { opacity: 0, transform: 'translateY(0.25em)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 550, easing: EASE_OUT, tag: 'refl' },
          ).finished,
          ...flyB.map((e) => {
            const from = srcB.get(e.classList.contains('t19-x') ? 't19-x' : 't19-y');
            if (!from) return Promise.resolve(true);
            const to = e.getBoundingClientRect();
            const dx = (from.left - to.left) * scale;
            const dy = (from.top - to.top) * scale;
            e.style.display = 'inline-block';
            return play(e, [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
              duration: 900,
              easing: EASE,
              fill: 'backwards',
              tag: 'refl',
            }).finished;
          }),
        ]);
        if (!live()) return;
        await Promise.all([...fb.querySelectorAll('.t19-k')].map((e, j) => pulse(e, j * 220)));
      }
    },
    sketch: () =>
      `<div class="vis-refl n-sketch is-sketch" data-view="graph">${graphMarkup().replace('<g class="t19-test" data-g="1">', '<g class="t19-test on" data-g="1">')}</div>`,
  };
}
