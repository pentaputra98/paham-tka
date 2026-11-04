/**
 * Adegan "translasi lalu dilatasi lingkaran" soal 20 (v1.52). Bidang koordinat x −10..2, y −1..9 dengan tiga lingkaran:
 *  - L pusat (−5, 3), r = 2 (merah muda, diketahui); L″ pusat (−4, 4), r = 4 (putih putus-putus, bayangan akhir);
 *    L′ pusat (−2, 2), r = 2 (biru langit, dicari).
 * State (boleh digabung):
 *  - L, L2: tampilkan L dan L″; rad: jari-jari kedua lingkaran diberi label (r = 2, r = 4);
 *  - ray: sinar dari O ke pusat L″, titik tengahnya pusat L′ (dilatasi [O, 2] dibalik = dibagi 2);
 *  - Lp: L′ muncul dengan menyusut dari L″ ke arah O (skala 1/2 berpusat di O);
 *  - tv: panah translasi T dari pusat L ke pusat L′ (3 ke kanan, 1 ke bawah);
 *  - fwd: cek maju satu pilihan ('C' atau 'D'): lingkaran mint bergeser dari L sejauh T pilihan, lalu diperbesar
 *    2 kali dari O; C mendarat tepat di L″ (✓), D mendarat di pusat (−8, 8) (✗).
 * Angka dari docs/pembahasan25.md soal 20 (a1–d3, kartu A–E, Pemeriksaan hasil). Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Dil20State {
  L?: boolean;
  L2?: boolean;
  rad?: boolean;
  ray?: boolean;
  Lp?: boolean;
  tv?: boolean;
  fwd?: '' | 'C' | 'D';
  [k: string]: unknown;
}

const U = 30;
const VW = 440;
const VH = 350;
const OX = 330;
const OY = 312;
const px = (x: number): number => OX + x * U;
const py = (y: number): number => OY - y * U;

function grid(): string {
  const g: string[] = [];
  for (let x = -10; x <= 2; x++)
    g.push(`<path class="d20-g${x === 0 ? ' d20-ax' : ''}" d="M${px(x)} ${py(-1)}V${py(9.6)}"/>`);
  for (let y = -1; y <= 9; y++)
    g.push(`<path class="d20-g${y === 0 ? ' d20-ax' : ''}" d="M${px(-10.4)} ${py(y)}H${px(2)}"/>`);
  const tk = [-8, -6, -4, -2]
    .map((x) => `<text class="d20-tk" x="${px(x)}" y="${py(0) + 18}" text-anchor="middle">${x}</text>`)
    .join('');
  const ty = [2, 4, 6, 8]
    .map((y) => `<text class="d20-tk" x="${px(0) + 8}" y="${py(y) + 5}">${y}</text>`)
    .join('');
  return g.join('') + tk + ty;
}

const circ = (cls: string, x: number, y: number, r: number, lbl: string, lx: number, ly: number): string =>
  `<g class="${cls}"><circle class="d20-c" cx="${px(x)}" cy="${py(y)}" r="${r * U}"/><circle class="d20-o" cx="${px(x)}" cy="${py(y)}" r="5"/><text x="${px(x) + lx}" y="${py(y) + ly}">${lbl}</text></g>`;

function markup(sketch: boolean): string {
  return `<svg class="d20-svg${sketch ? ' n-sketch is-all' : ''}" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="L pusat (−5, 3) jari-jari 2 digeser T(3, −1) menjadi L′ pusat (−2, 2), lalu diperbesar 2 kali dari O menjadi L″ pusat (−4, 4) jari-jari 4">
  <defs><clipPath id="dil-clip"><rect x="0" y="0" width="${VW}" height="${VH}"/></clipPath>
  <marker id="dil-h" class="d20-hm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs>
  <g clip-path="url(#dil-clip)">${grid()}
  <path class="d20-ray" d="M${px(0)} ${py(0)}L${px(-4)} ${py(4)}"/>
  ${circ('d20-L2', -4, 4, 4, 'L″ (−4, 4)', -36, -128)}
  <g class="d20-r2"><path d="M${px(-4)} ${py(4)}V${py(8)}"/><text x="${px(-4) + 8}" y="${py(6.6)}">r = 4</text></g>
  ${circ('d20-L', -5, 3, 2, 'L (−5, 3)', -48, -70)}
  <g class="d20-r1"><path d="M${px(-5)} ${py(3)}H${px(-7)}"/><text x="${px(-6)}" y="${py(3) - 8}" text-anchor="middle">r = 2</text></g>
  <g class="d20-Lpo">${circ('d20-Lp', -2, 2, 2, 'L′ (−2, 2)', 66, 24)}</g>
  <g class="d20-tv"><path d="M${px(-5)} ${py(3)}L${px(-2) - 6} ${py(2) - 2}" marker-end="url(#dil-h)"/><text x="${px(-3.4)}" y="${py(3.05)}" text-anchor="middle">T</text></g>
  <g class="d20-fo"><g class="d20-fi">${circ('d20-F', -2, 2, 2, '', 0, 0)}</g></g>
  <text class="d20-mk" x="${px(-10) + 6}" y="${py(9.1)}"></text>
  <g class="d20-O"><circle cx="${px(0)}" cy="${py(0)}" r="5"/><text x="${px(0) + 8}" y="${py(0) + 18}">O</text></g>
  </g></svg>`;
}

/** cek maju: translasi pilihan dan pusat hasil dilatasi */
const FWD: Record<'C' | 'D', { t: [number, number]; mid: [number, number]; ok: boolean }> = {
  C: { t: [3, -1], mid: [-2, 2], ok: true },
  D: { t: [1, 1], mid: [-4, 4], ok: false },
};

export function createDil20(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-dil';
  el.innerHTML = markup(false);
  const svg = el.querySelector('svg')!;
  const q = <E extends Element = SVGElement>(s: string): E => svg.querySelector<E>(s)!;
  const keys = ['L', 'L2', 'rad', 'ray', 'Lp', 'tv'] as const;
  let prev: Record<string, boolean> = {};
  let fwd = '';
  let gen = 0;

  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'dil',
    }).finished;
  /** skala berpusat di titik O (koordinat piksel viewBox) */
  const aboutO = (e: SVGElement): void => {
    e.style.transformBox = 'view-box';
    e.style.transformOrigin = `${px(0)}px ${py(0)}px`;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Dil20State;
      const my = ++gen;
      const live = (): boolean => c.live() && my === gen;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const cur: Record<string, boolean> = {};
      for (const k of keys) {
        cur[k] = !!s[k];
        svg.classList.toggle(`is-${k}`, cur[k]);
      }
      const fresh = (k: string): boolean => anim && cur[k]! && (!prev[k] || c.replay);
      if (fresh('L')) runs.push(fadeIn(q('.d20-L')));
      if (fresh('L2')) runs.push(fadeIn(q('.d20-L2'), 200));
      if (fresh('rad')) runs.push(fadeIn(q('.d20-r1')), fadeIn(q('.d20-r2'), 500));
      if (fresh('ray')) runs.push(fadeIn(q('.d20-ray')));
      if (fresh('Lp')) {
        // L′ menyusut dari L″ ke arah O: skala 2 → 1 berpusat di O
        const g = q('.d20-Lpo');
        aboutO(g);
        runs.push(
          play(
            g,
            [
              { transform: 'scale(2)', opacity: 0.3 },
              { transform: 'none', opacity: 1 },
            ],
            { duration: 1300, delay: 400, easing: EASE, fill: 'backwards', tag: 'dil' },
          ).finished,
        );
      }
      if (fresh('tv')) runs.push(fadeIn(q('.d20-tv'), 200));
      prev = cur;

      // ---- cek maju satu pilihan ----
      const f = s.fwd ?? '';
      const fo = q('.d20-fo');
      const fi = q('.d20-fi');
      const mk = q<SVGTextElement>('.d20-mk');
      svg.classList.toggle('is-fwd', !!f);
      svg.classList.toggle('fwd-no', f === 'D');
      if (f) {
        const F = FWD[f];
        // lingkaran mint digambar di pusat hasil translasi pilihan, akhirnya diperbesar 2 kali dari O
        fi.setAttribute('transform', `translate(${(F.mid[0] + 2) * U} ${-(F.mid[1] - 2) * U})`);
        aboutO(fo);
        fo.style.transform = 'scale(2)';
        mk.textContent = F.ok ? 'C cocok dengan L″ ✓' : 'D jatuh di pusat (−8, 8) ✗';
      }
      if (anim && f && (f !== fwd || c.replay)) {
        const F = FWD[f];
        fwd = f;
        // 1) bergeser dari L sejauh T pilihan, 2) diperbesar 2 kali dari O
        const dx = (-5 - F.mid[0]) * U;
        const dy = -(3 - F.mid[1]) * U;
        const inner = fi.querySelector<SVGGElement>('.d20-F')!;
        await Promise.all([
          ...runs.splice(0),
          // skala tetap 1 selama bergeser (sampai 48 %), lalu membesar 2 kali dari O
          play(
            fo,
            [
              { transform: 'none', offset: 0 },
              { transform: 'none', offset: 0.48, easing: EASE },
              { transform: 'scale(2)', offset: 1 },
            ],
            { duration: 2600, tag: 'dil' },
          ).finished,
          play(
            inner,
            [
              { transform: `translate(${dx}px, ${dy}px)`, opacity: 0.4 },
              { transform: 'none', opacity: 1 },
            ],
            { duration: 1200, easing: EASE, fill: 'backwards', tag: 'dil' },
          ).finished,
        ]);
        if (!live()) return;
        await fadeIn(mk);
        return;
      }
      fwd = f;
      await Promise.all(runs);
    },
    sketch: () => markup(true),
  };
}
