/**
 * Adegan "panjang vektor" soal 12 (revisi pemilik v1.45): AB = (2m, m + 3, m), |AB| = 9, murni aljabar.
 * Dua tampilan pada panggung yang sama:
 *  - alg: baris penurunan aljabar yang besar, satu baris per langkah (s = 1 … 12). Tiga baris terakhir tampil; baris
 *    baru meluncur masuk, baris lama naik dan memudar (FLIP). Bagian penting baris saat ini (kelas a12-k) disorot dan
 *    berdenyut. Baris yang punya bentuk kedua (b) berganti bentuk dengan pudar silang, misalnya 9² → 81,
 *    6m² + 6m + 9 − 81 → 6m² + 6m − 72, (6m + 24)/6 → (m + 4). Baris 9 adalah panel pencarian dua bilangan
 *    (dikali −432, dijumlah 6), barisnya muncul satu per satu sampai pasangan 24 dan −18.
 *  - tab: tabel uji nilai m dari pilihan (opsional): komponen vektor dan jumlah kuadrat dibandingkan dengan 81.
 * Angka dari docs/pembahasan25.md soal 12 (a1–b5, kartu A–E); cara a·c turunan aljabar dari 6m² + 6m − 72 = 0.
 * Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Vec12State {
  view?: 'alg' | 'tab';
  s?: number;
  n?: number;
  cur?: number;
  [k: string]: unknown;
}

const K = (t: string): string => `\\htmlClass{a12-k}{${t}}`;
/** baris penurunan: a = bentuk pertama, b = bentuk sesudah diganti (opsional), lbl = keterangan kecil */
const LINES: Array<{ a: string; b?: string; lbl: string }> = [
  { a: `|\\vec{AB}|=${K('\\sqrt{x^2+y^2+z^2}')}`, lbl: 'akar dari jumlah kuadrat komponen' },
  { a: `${K('9')}=\\sqrt{${K('(2m)^2')}+${K('(m+3)^2')}+${K('m^2')}}`, lbl: 'komponen dimasukkan' },
  {
    a: `${K('9^2')}=(2m)^2+(m+3)^2+m^2`,
    b: `${K('81')}=(2m)^2+(m+3)^2+m^2`,
    lbl: 'kedua ruas dikuadratkan',
  },
  { a: `81=${K('4m^2')}+${K('(m^2+6m+9)')}+${K('m^2')}`, lbl: 'tiap kuadrat dijabarkan' },
  { a: `81=${K('4m^2+m^2+m^2')}+6m+9`, b: `81=${K('6m^2')}+6m+9`, lbl: 'suku sejenis dijumlahkan' },
  { a: `6m^2+6m+${K('9-81')}=0`, b: `6m^2+6m${K('-72')}=0`, lbl: '81 pindah ruas' },
  {
    a: `\\underset{a}{${K('6')}}m^2+\\underset{b}{${K('6')}}m\\underset{c}{${K('-72')}}=0`,
    lbl: 'bentuk am² + bm + c = 0',
  },
  { a: `a\\cdot c=${K('6\\cdot(-72)')}`, b: `a\\cdot c=${K('-432')}`, lbl: 'kalikan a dan c dulu' },
  { a: '', lbl: 'cari dua bilangan' },
  { a: `\\dfrac{(6m${K('+24')})(6m${K('-18')})}{${K('6')}}=0`, lbl: 'tulis dalam kurung, dibagi a' },
  {
    a: `\\left(\\dfrac{6m+24}{${K('6')}}\\right)(6m-18)=0`,
    b: `${K('(m+4)')}(6m-18)=0`,
    lbl: 'satu kurung dibagi 6',
  },
  {
    a: `${K('m+4=0')}\\quad\\text{atau}\\quad${K('6m-18=0')}`,
    b: `\\htmlClass{a12-ans}{m=-4\\quad\\text{atau}\\quad m=3}`,
    lbl: 'tiap kurung sama dengan nol',
  },
];
/** pasangan bilangan yang dicoba: dikali −432, dijumlah 6 */
const PAIRS: Array<[number, number]> = [
  [12, -36],
  [18, -24],
  [24, -18],
];
const p = (v: number): string => (v < 0 ? `(${v})` : String(v));

function algMarkup(): string {
  const lines = LINES.map((l, i) => {
    if (i === 8) {
      const rows = PAIRS.map(([x, y]) => {
        const ok = x + y === 6;
        return `<span class="a12-pr${ok ? ' is-ok' : ''}">${tex(`${x}\\times${p(y)}=-432`)}<span>${tex(`${x}+${p(y)}=${x + y}`)}</span><b>${tex(ok ? '\\checkmark' : '\\ne6')}</b></span>`;
      }).join('');
      return `<div class="a12-l a12-pairs" data-i="${i + 1}"><span class="a12-ph">${tex('\\text{dikali }-432,\\ \\text{dijumlah }6')}</span>${rows}<small>${l.lbl}</small></div>`;
    }
    return `<div class="a12-l" data-i="${i + 1}"><span class="a12-f a12-fa">${tex(l.a)}</span>${l.b ? `<span class="a12-f a12-fb">${tex(l.b)}</span>` : ''}<small>${l.lbl}</small></div>`;
  }).join('');
  return `<div class="a12-alg" role="img" aria-label="Penurunan: 9 = akar jumlah kuadrat komponen, 6m² + 6m − 72 = 0, a·c = −432, pasangan 24 dan −18, (m + 4)(6m − 18) = 0, m = −4 atau m = 3">${lines}</div>`;
}

/** nilai m yang muncul di pilihan, urut seperti diuji */
const MS = [-4, -3, 3, 4];
const comp = (m: number): [number, number, number] => [2 * m, m + 3, m];
const sq = (m: number): number => comp(m).reduce((s, v) => s + v * v, 0);

function tabMarkup(): string {
  const head = `<span class="v12-h">${tex('m')}</span><span class="v12-h">${tex('\\vec{AB}')}</span><span class="v12-h">${tex('x^2+y^2+z^2')}</span><span class="v12-h"></span>`;
  const rows = MS.map((m, i) => {
    const [x, y, z] = comp(m);
    const s = sq(m);
    const ok = s === 81;
    return `<span class="v12-c v12-m" data-i="${i}" data-src="v-m${i}">${tex(String(m))}</span>
      <span class="v12-c" data-i="${i}">${tex(`(${x},\\ ${y},\\ ${z})`)}</span>
      <span class="v12-c" data-i="${i}">${tex(`${p(x)}^2+${p(y)}^2+${p(z)}^2=${s}`)}</span>
      <span class="v12-c v12-tag${ok ? ' is-ok' : ''}" data-i="${i}">${ok ? tex('=81') : tex('\\ne81')}</span>`;
  }).join('');
  return `<div class="v12-tab" role="img" aria-label="Uji nilai m: m = −4 dan m = 3 memberi jumlah kuadrat 81; m = −3 memberi 45; m = 4 memberi 129">${head}${rows}</div>`;
}

/** banyak baris terakhir yang tampil bersamaan */
const SHOW = 3;

export function createVec12(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-vec';
  el.innerHTML = algMarkup() + tabMarkup();
  const lines = [...el.querySelectorAll<HTMLElement>('.a12-l')];
  let view = '';
  let s = 0;
  let n = 0;
  let gen = 0;

  const pop = (e: Element, delay = 0): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
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
  const pulse = (e: Element, delay = 0): Promise<boolean> => {
    (e as HTMLElement).style.transformOrigin = 'center';
    return play(e, [{ transform: 'none' }, { transform: 'scale(1.18)' }, { transform: 'none' }], {
      duration: 700,
      delay,
      easing: EASE,
      tag: 'vec',
    }).finished;
  };

  /** tandai baris yang tampil (tiga terakhir sampai baris k) dan bentuknya (a atau b) */
  function layout(k: number, morphed: boolean): void {
    lines.forEach((l) => {
      const i = Number(l.dataset.i);
      l.classList.toggle('on', i <= k && i > k - SHOW);
      l.classList.toggle('is-cur', i === k);
      // baris lama selalu dalam bentuk akhirnya; baris saat ini menurut morphed
      l.classList.toggle('is-b', !!l.querySelector('.a12-fb') && (i < k || (i === k && morphed)));
    });
  }

  return {
    el,
    async apply(state, c: Ctx) {
      const st = state as Vec12State;
      const my = ++gen;
      const live = (): boolean => c.live() && my === gen;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = st.view ?? 'alg';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(v === 'alg' ? '.a12-alg' : '.v12-tab')!));
        view = v;
      }

      // ---- penurunan aljabar ----
      const k = st.s ?? 0;
      const runAlg = anim && v === 'alg' && k > 0 && (k !== s || c.replay);
      if (!runAlg) layout(k, true);
      else {
        // FLIP: baris yang sudah tampil naik ke tempat barunya, baris baru meluncur dari bawah
        const before = new Map(lines.map((l) => [l, l.getBoundingClientRect().top]));
        const was = new Set(lines.filter((l) => l.classList.contains('on')));
        layout(k, false);
        const scale = el.offsetHeight / (el.getBoundingClientRect().height || 1);
        lines
          .filter((l) => l.classList.contains('on'))
          .forEach((l) => {
            if (was.has(l) && Number(l.dataset.i) !== k) {
              const dy = (before.get(l)! - l.getBoundingClientRect().top) * scale;
              if (Math.abs(dy) > 1)
                runs.push(
                  play(l, [{ transform: `translateY(${dy}px)` }, { transform: 'none' }], {
                    duration: DUR.flip,
                    easing: EASE,
                    tag: 'vec',
                  }).finished,
                );
            }
          });
        const cur = lines[k - 1]!;
        runs.push(
          play(
            cur,
            [
              { transform: 'translateY(0.8em)', opacity: 0 },
              { transform: 'none', opacity: 1 },
            ],
            { duration: 600, easing: EASE_OUT, fill: 'backwards', tag: 'vec' },
          ).finished,
        );
        await Promise.all(runs.splice(0));
        if (!live()) return;
        // sorot bagian penting bentuk pertama
        const fa = cur.querySelector('.a12-fa');
        if (fa) await Promise.all([...fa.querySelectorAll('.a12-k')].map((e, j) => pulse(e, j * 220)));
        // panel pasangan: baris dicoba satu per satu
        if (cur.classList.contains('a12-pairs'))
          for (const [j, r] of [...cur.querySelectorAll('.a12-pr')].entries()) {
            if (!live()) return;
            await pop(r, j ? 250 : 0);
          }
        if (!live()) return;
        // ganti ke bentuk kedua dengan pudar silang
        const fb = cur.querySelector('.a12-fb');
        if (fb && fa) {
          await play(fa, [{ opacity: 1 }, { opacity: 1 }], { duration: 500, tag: 'vec' }).finished;
          if (!live()) return;
          cur.classList.add('is-b');
          await Promise.all([
            play(fa, [{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: EASE, tag: 'vec' }).finished,
            play(
              fb,
              [
                { opacity: 0, transform: 'translateY(0.25em)' },
                { opacity: 1, transform: 'none' },
              ],
              { duration: 550, easing: EASE_OUT, tag: 'vec' },
            ).finished,
          ]);
          if (!live()) return;
          await Promise.all([...fb.querySelectorAll('.a12-k')].map((e, j) => pulse(e, j * 220)));
        }
      }
      s = k;

      // ---- tabel uji (opsional) ----
      const m = st.n ?? 0;
      const cur = st.cur ?? -1;
      el.querySelectorAll<HTMLElement>('.v12-c').forEach((e) => {
        const i = Number(e.dataset.i);
        e.classList.toggle('on', i < m);
        e.classList.toggle('is-cur', i === cur);
      });
      if (anim && v === 'tab' && (m > n || c.replay)) {
        const from = c.replay ? 0 : n;
        el.querySelectorAll<HTMLElement>('.v12-c').forEach((e) => {
          const i = Number(e.dataset.i);
          const col = [...e.parentElement!.children].indexOf(e) % 4;
          if (i >= from && i < m) runs.push(pop(e, (i - from) * 500 + col * 200));
        });
      }
      n = m;
      await Promise.all(runs);
    },
  };
}
