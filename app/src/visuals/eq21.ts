/**
 * Adegan "rumus cepat rotasi" soal 21 (revisi pemilik v1.55). Baris penurunan besar, memakai tampilan dan gaya
 * penurunan soal 19 (kelas t19-*, wadah vis-refl, data-view eq). set = 1 rumus cepat, 2 garis l, 3 asal rumus
 * (opsional); s = baris terakhir yang tampil (tiga baris terakhir tampil). Huruf x (biru langit) dan y (ungu) terbang
 * dari baris sebelumnya ke tempat barunya; bagian penting (mint) berdenyut; bentuk kedua berganti dengan pudar silang.
 * Rumus cepat arahan pemilik: rotasi 90° berlawanan jarum jam berpusat (a, b), pada persamaan x diganti (y + a − b)
 * dan y diganti (a + b − x). Angka dari docs/pembahasan25.md soal 21 (b1–b6). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Eq21State {
  set?: 1 | 2 | 3;
  s?: number;
  [k: string]: unknown;
}

const X = (t: string): string => `\\htmlClass{t19-x}{${t}}`;
const Y = (t: string): string => `\\htmlClass{t19-y}{${t}}`;
const K = (t: string): string => `\\htmlClass{t19-k}{${t}}`;
type Line = { a: string; b?: string; lbl: string };
const SETS: Record<1 | 2 | 3, Line[]> = {
  1: [
    {
      a: `${X('x')}\\ \\to\\ ${K('(y+a-b)')}\\qquad ${Y('y')}\\ \\to\\ ${K('(a+b-x)')}`,
      lbl: 'rumus cepat, rotasi 90° pusat (a, b)',
    },
    {
      a: `${X('x')}\\ \\to\\ (y+${K('2')}-${K('0')})\\qquad ${Y('y')}\\ \\to\\ (${K('2')}+${K('0')}-x)`,
      b: `${X('x')}\\ \\to\\ ${K('(y+2)')}\\qquad ${Y('y')}\\ \\to\\ ${K('(2-x)')}`,
      lbl: 'pusat (2, 0), jadi a = 2 dan b = 0',
    },
  ],
  2: [
    { a: `3${X('x')}+2${Y('y')}=6`, lbl: 'garis awal' },
    { a: `3${X('(y+2)')}+2${Y('(2-x)')}=6`, lbl: 'x diganti (y + 2), y diganti (2 − x)' },
    { a: `3y+6+4-2x=6`, b: `-2x+3y${K('+4')}=0`, lbl: 'dijabarkan, 6 + 4 − 6 = 4' },
    { a: `-2x+3y+4=0`, b: `\\htmlClass{t19-key}{2x-3y=4}`, lbl: 'dikali −1, konstanta pindah ruas, garis l' },
  ],
  3: [
    {
      a: `(${X('x')},${Y('y')})\\ \\to\\ (x^{\\prime},y^{\\prime})`,
      lbl: 'titik lama diputar menjadi titik baru',
    },
    {
      a: `(${K('x-a')},\\ ${K('y-b')})\\ \\to\\ (${K('-(y-b)')},\\ ${K('x-a')})`,
      lbl: 'selisih diputar 90°, (u, v) menjadi (−v, u)',
    },
    { a: `x^{\\prime}=a-(y-b)`, b: `x^{\\prime}=${K('a+b-y')}`, lbl: 'tambahkan kembali pusat, koordinat x' },
    { a: `y^{\\prime}=b+(x-a)`, b: `y^{\\prime}=${K('x-a+b')}`, lbl: 'tambahkan kembali pusat, koordinat y' },
    {
      a: `${Y('y')}=a+b-x^{\\prime}\\qquad ${X('x')}=y^{\\prime}+a-b`,
      lbl: 'dibalik, titik lama dinyatakan dengan titik baru',
    },
    {
      a: `\\htmlClass{t19-key}{${X('x')}\\ \\to\\ (y+a-b)\\qquad ${Y('y')}\\ \\to\\ (a+b-x)}`,
      lbl: 'aksen dilepas, inilah rumus cepatnya',
    },
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
  return `<div class="t19-eq" role="img" aria-label="Rumus cepat rotasi 90° berlawanan jarum jam berpusat (a, b): x diganti (y + a − b), y diganti (a + b − x); untuk pusat (2, 0) garis 3x + 2y = 6 menjadi 2x − 3y = 4">${sets}</div>`;
}

/** banyak baris terakhir yang tampil bersamaan */
const SHOW = 3;

export function createEq21(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-refl';
  el.dataset.view = 'eq';
  el.innerHTML = eqMarkup();
  let set = 0;
  let s = 0;
  let gen = 0;

  const pulse = (e: Element, delay = 0): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    return play(e, [{ transform: 'none' }, { transform: 'scale(1.18)' }, { transform: 'none' }], {
      duration: 700,
      delay,
      easing: EASE,
      tag: 'eq21',
    }).finished;
  };
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
      const st = state as Eq21State;
      const my = ++gen;
      const live = (): boolean => c.live() && my === gen;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = 'eq';
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
                tag: 'eq21',
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
          { duration: 600, easing: EASE_OUT, fill: 'backwards', tag: 'eq21' },
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
              { duration: 1200, delay: 150, easing: EASE, fill: 'backwards', tag: 'eq21' },
            ).finished,
        ),
      );
      await Promise.all(runs.splice(0));
      if (!live()) return;
      await Promise.all([...fa.querySelectorAll('.t19-k')].map((e, j) => pulse(e, j * 220)));
      if (!live()) return;
      const fb = cur.querySelector<HTMLElement>('.t19-fb');
      if (fb) {
        await play(fa, [{ opacity: 1 }, { opacity: 1 }], { duration: 600, tag: 'eq21' }).finished;
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
          play(fa, [{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: EASE, tag: 'eq21' }).finished,
          play(
            fb,
            [
              { opacity: 0, transform: 'translateY(0.25em)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 550, easing: EASE_OUT, tag: 'eq21' },
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
              tag: 'eq21',
            }).finished;
          }),
        ]);
        if (!live()) return;
        await Promise.all([...fb.querySelectorAll('.t19-k')].map((e, j) => pulse(e, j * 220)));
      }
    },
  };
}
