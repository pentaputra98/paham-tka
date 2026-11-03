/**
 * Adegan "bahan baku pabrik minuman" soal 3, alur guru (v1.30).
 * Dua tampilan pada panggung yang sama:
 *  - mat: matriks kebutuhan per botol (baris = minuman WJ, BK, KA; kolom = bahan J, GM, A) dan vektor pesanan.
 *    rc: label baris dan kolom disorot; colA: kolom air disorot, kolom lain diredupkan; pair n: baris 1..n
 *    dipasangkan (sel air × pesanan) dan hasil kalinya ditulis di kanan; kval: k = 40 masuk ke selnya (emas).
 *    Angka menjadi sumber terbang (d-a1, d-a2, d-k, d-o1, d-o2, d-o3).
 *  - bar: batang air 13.000 ml. bar 1 = 5.000 + 4.800 (= 9.800); 2 = sisanya 80k sampai garis 13.000;
 *    3 = sisanya 3.200; cand k = batang 9.800 + 80k untuk suatu pilihan (emas bila tepat 13.000, merah bila
 *    kurang atau lebih).
 * Angka dari docs/pembahasan25.md soal 3; hanya kolom air yang dipakai (kolom J dan GM tidak dihitung,
 * catatan sumber dokumen). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Drink3State {
  view?: 'mat' | 'bar';
  rc?: boolean;
  colA?: boolean;
  pair?: 0 | 1 | 2 | 3;
  kval?: boolean;
  bar?: 0 | 1 | 2 | 3;
  cand?: number;
  [k: string]: unknown;
}

/** docs/soal25.md no. 3: kebutuhan per botol (J, GM, A) dan pesanan */
const ROWS: Array<[string, [string, string, string], string]> = [
  ['WJ', ['20', '15', '50'], '100'],
  ['BK', ['10', '25', '40'], '120'],
  ['KA', ['12', '8', 'k'], '80'],
];
const PROD = ['5{.}000', '4{.}800', '80k'];
const COLS = ['J', 'GM', 'A'];
const fmt = (n: number): string => n.toLocaleString('id-ID');

// ---- batang air (viewBox 640 × 220), skala 14.000 ml selebar 520 ----
const BX = 60;
const BW = 520;
const BY = 70;
const BH = 64;
const sx = (ml: number): number => BX + (ml / 14000) * BW;

function matMarkup(): string {
  const head = `<div class="d3-h"></div>${COLS.map((c, j) => `<div class="d3-h" data-c="${j}">${c}</div>`).join('')}<div class="d3-gap"></div><div class="d3-h d3-oh">pesanan</div><div class="d3-h d3-ph"></div>`;
  const body = ROWS.map(([r, cells, o], i) => {
    const cs = cells
      .map((t, j) => {
        const src = j === 2 ? ` data-r="${i}" data-src="${i === 2 ? 'd-k' : `d-a${i + 1}`}"` : '';
        return `<div class="d3-c" data-c="${j}"${src}><span class="d3-ring" aria-hidden="true"></span><span class="d3-v">${tex(t)}</span>${i === 2 && j === 2 ? `<span class="d3-k40">${tex('40')}</span>` : ''}</div>`;
      })
      .join('');
    return `<div class="d3-rl" data-r="${i}">${r}</div>${cs}<div class="d3-gap"></div><div class="d3-c d3-o" data-src="d-o${i + 1}" data-r="${i}"><span class="d3-ring" aria-hidden="true"></span>${tex(o)}</div><div class="d3-p" data-p="${i + 1}"><span>${tex(`=${PROD[i]}`)}</span></div>`;
  }).join('');
  return `<div class="d3-mat" role="img" aria-label="Matriks kebutuhan per botol: baris wedang jahe, beras kencur, kunir asem; kolom jahe, gula merah, air. Air per botol 50, 40, dan k mililiter. Pesanan 100, 120, dan 80 botol.">
    <div class="d3-grid">${head}${body}</div>
    <p class="d3-cap"><span>baris = minuman</span><span>kolom = bahan</span></p>
  </div>`;
}

function barMarkup(): string {
  const a = sx(5000);
  const b = sx(9800);
  const t = sx(13000);
  return `<svg class="d3-bar" viewBox="0 0 640 220" role="img" aria-label="Batang air: 5.000 ml wedang jahe, 4.800 ml beras kencur, sisanya 80k ml kunir asem sampai 13.000 ml">
  <g class="d3-seg" data-s="1"><rect class="d3-wj" x="${BX}" y="${BY}" width="${a - BX}" height="${BH}" rx="6"/>
    <text x="${(BX + a) / 2}" y="${BY + BH / 2 + 7}" text-anchor="middle">5.000</text>
    <text class="d3-sl" x="${(BX + a) / 2}" y="${BY + BH + 20}" text-anchor="middle">WJ</text></g>
  <g class="d3-seg" data-s="1"><rect class="d3-bk" x="${a}" y="${BY}" width="${b - a}" height="${BH}" rx="6"/>
    <text x="${(a + b) / 2}" y="${BY + BH / 2 + 7}" text-anchor="middle">4.800</text>
    <text class="d3-sl" x="${(a + b) / 2}" y="${BY + BH + 20}" text-anchor="middle">BK</text></g>
  <path class="d3-brace" d="M${BX} ${BY - 12}V${BY - 20}H${b}V${BY - 12}"/>
  <text class="d3-bt" x="${(BX + b) / 2}" y="${BY - 28}" text-anchor="middle">9.800</text>
  <g class="d3-seg d3-rest" data-s="2"><rect class="d3-ka" x="${b}" y="${BY}" width="${t - b}" height="${BH}" rx="6"/>
    <text class="d3-kt" x="${(b + t) / 2}" y="${BY + BH / 2 + 7}" text-anchor="middle">80k</text>
    <text class="d3-sl" x="${(b + t) / 2}" y="${BY + BH + 20}" text-anchor="middle">KA, 80k</text></g>
  <g class="d3-target"><path class="d3-tl" d="M${t} ${BY - 12}V${BY + BH + 34}"/>
    <text class="d3-tt" x="${t}" y="${BY + BH + 52}" text-anchor="middle">13.000</text></g>
  <g class="d3-cand"><rect class="d3-cr" x="${b}" y="${BY + 8}" width="0" height="${BH - 16}" rx="4"/>
    <text class="d3-ct" x="${b}" y="${BY - 28}" text-anchor="middle"></text></g>
  <text class="d3-note" x="${BX}" y="${BY + BH + 52}">air (ml)</text>
  </svg>`;
}

export function createDrink3(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-drink';
  el.innerHTML = matMarkup() + barMarkup();
  const candR = el.querySelector<SVGRectElement>('.d3-cr')!;
  const candT = el.querySelector<SVGTextElement>('.d3-ct')!;
  const prev = new Set<string>();
  let view = '';
  let pairs = 0;
  let bars = 0;
  let cand = 0;

  const fadeIn = (e: Element, delay: number): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'drink',
    }).finished;
  const pop = (e: Element, delay: number): Promise<boolean> => {
    const h = e as HTMLElement;
    h.style.transformOrigin = 'center';
    h.style.transformBox = 'fill-box';
    return play(
      e,
      [
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 480, delay, easing: EASE_OUT, fill: 'backwards', tag: 'drink' },
    ).finished;
  };
  const grow = (e: Element, delay: number): Promise<boolean> => {
    const g = e as SVGGElement;
    g.style.transformBox = 'fill-box';
    g.style.transformOrigin = 'left center';
    return play(
      e,
      [
        { transform: 'scaleX(0)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 560, delay, easing: EASE, fill: 'backwards', tag: 'drink' },
    ).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Drink3State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const v = s.view ?? 'mat';
      if (v !== view) {
        el.dataset.view = v;
        if (anim && view) runs.push(fadeIn(el.querySelector(v === 'mat' ? '.d3-mat' : '.d3-bar')!, 0));
        view = v;
      }
      const flags: Record<string, boolean> = { rc: !!s.rc, colA: !!s.colA, kval: !!s.kval };
      for (const [k, on] of Object.entries(flags)) {
        if (on && anim && (!prev.has(k) || c.replay)) {
          if (k === 'rc')
            el.querySelectorAll('.d3-rl, .d3-h[data-c], .d3-cap span').forEach((e, i) =>
              runs.push(fadeIn(e, i * 120)),
            );
          if (k === 'kval') runs.push(pop(el.querySelector('.d3-k40')!, 0));
        }
        el.classList.toggle(`show-${k}`, on);
        if (on) prev.add(k);
        else prev.delete(k);
      }

      // pasangan baris: sel air × pesanan, hasil kali muncul di kanan
      const n = s.pair ?? 0;
      el.dataset.pair = String(n);
      el.querySelectorAll<HTMLElement>('.d3-p').forEach((p) => {
        const i = Number(p.dataset.p);
        p.classList.toggle('on', i <= n);
        if (i === n && anim && (n !== pairs || c.replay)) runs.push(pop(p, 500));
      });
      if (n && anim && (n !== pairs || c.replay))
        el.querySelectorAll(`.d3-c[data-r="${n - 1}"] .d3-ring`).forEach((e, i) =>
          runs.push(pop(e, i * 150)),
        );
      pairs = n;

      // batang air
      const b = s.bar ?? 0;
      el.dataset.bar = String(b);
      el.querySelectorAll<SVGGElement>('.d3-seg').forEach((g, i) => {
        const k = Number(g.dataset.s);
        g.classList.toggle('on', k <= b);
        if (k <= b && anim && (k > bars || c.replay)) runs.push(grow(g, i * 350));
      });
      const kt = el.querySelector<SVGTextElement>('.d3-kt')!;
      // sisa batang: 80k, lalu nilainya 3.200 (label di bawah tetap "KA, 80k")
      kt.textContent = b >= 3 ? '3.200' : '80k';
      if (b >= 3 && anim && (bars < 3 || c.replay)) runs.push(fadeIn(kt, 0));
      bars = b;

      // pilihan diuji: 9.800 + 80k dibandingkan dengan garis 13.000
      const k = s.cand ?? 0;
      el.classList.toggle('show-cand', k > 0);
      if (k) {
        const tot = 9800 + 80 * k;
        const x0 = sx(9800);
        candR.setAttribute('width', String(sx(tot) - x0));
        // label di tengah batang pilihan, digeser ke kiri agar tidak keluar bingkai (pilihan 13.800)
        candT.setAttribute('x', String(Math.min((x0 + sx(tot)) / 2, 470)));
        candT.textContent = `80 × ${k} = ${fmt(80 * k)} → ${fmt(tot)}`;
        el.classList.toggle('cand-ok', tot === 13000);
        if (anim && (k !== cand || c.replay)) runs.push(grow(candR, 0), fadeIn(candT, 450));
      }
      cand = k;
      await Promise.all(runs);
    },
  };
}
