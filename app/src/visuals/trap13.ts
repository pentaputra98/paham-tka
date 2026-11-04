/**
 * Adegan "trapesium sama kaki di bidang koordinat" soal 13 (alur v1.47): A(0, 0), AB = (6, 0), AD = (1, 4).
 * State bertahap (boleh digabung):
 *  - n: 1 = titik A; 2 = vektor AB (panah biru) dan titik B(6, 0); 3 = vektor AD (panah merah) dan titik D(1, 4).
 *  - lean: kaki kiri AD dihitung di kisi, 1 ke kanan lalu 4 ke atas (tangga putus-putus berlabel +1, +4).
 *  - sym: garis simetri x = 3 (tengah-tengah A dan B).
 *  - mir: titik C(5, 4) muncul, D dicerminkan terhadap x = 3 (titik bergeser dari D ke C).
 *  - step: vektor BC dihitung di kisi dari B, 1 ke kiri (−1) lalu 4 ke atas (+4); panah BC biru dan labelnya.
 *  - ghost: jebakan BC = AD = (1, 4), C′(7, 4) putus-putus merah, bangunnya jajargenjang.
 *  - fill: trapesium ABCD terisi, alas atas DC.
 * Kelas kisi 1 satuan; label sumber terbang v-bc (vektor BC). Angka dari docs/pembahasan25.md soal 13.
 * Gerak hanya transform/opacity. Status kelas pada svg: n1–n3, is-lean, is-sym, is-mir, is-step, is-ghost, is-fill.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE, EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Trap13State {
  n?: 0 | 1 | 2 | 3;
  lean?: boolean;
  sym?: boolean;
  mir?: boolean;
  step?: boolean;
  ghost?: boolean;
  fill?: boolean;
  [k: string]: unknown;
}

const VW = 570;
const VH = 300;
const U = 50;
const OX = 44;
const OY = VH - 50;
const px = (x: number): number => OX + x * U;
const py = (y: number): number => OY - y * U;

function grid(): string {
  const g: string[] = [];
  for (let x = -1; x <= 10; x++)
    g.push(`<path class="t13-g${x === 0 ? ' t13-ax' : ''}" d="M${px(x)} ${py(-0.6)}V${py(4.8)}"/>`);
  for (let y = 0; y <= 4; y++)
    g.push(`<path class="t13-g${y === 0 ? ' t13-ax' : ''}" d="M${px(-0.6)} ${py(y)}H${px(10)}"/>`);
  const tx = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .map((x) => `<text class="t13-tk" x="${px(x)}" y="${py(0) + 18}" text-anchor="middle">${x}</text>`)
    .join('');
  const ty = [1, 2, 3, 4]
    .map((y) => `<text class="t13-tk" x="${px(0) - 10}" y="${py(y) + 5}" text-anchor="end">${y}</text>`)
    .join('');
  return g.join('') + tx + ty;
}

const arrow = (cls: string, mk: 'b' | 'r', x1: number, y1: number, x2: number, y2: number): string =>
  `<path class="${cls}" d="M${px(x1)} ${py(y1)}L${px(x2)} ${py(y2)}" marker-end="url(#t13-h${mk})"/>`;
const marker = (mk: 'b' | 'r'): string =>
  `<marker id="t13-h${mk}" class="t13-h${mk}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z"/></marker>`;
const dot = (cls: string, x: number, y: number, name: string, dx = 0, dy = -14): string =>
  `<g class="${cls}"><circle cx="${px(x)}" cy="${py(y)}" r="6"/><text x="${px(x) + dx}" y="${py(y) + dy}" text-anchor="middle">${name}</text></g>`;

function markup(sketch: boolean): string {
  return `<svg class="t13-svg${sketch ? ' n-sketch is-all' : ''}" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Bidang koordinat: trapesium sama kaki ABCD dengan A(0, 0), B(6, 0), C(5, 4), D(1, 4); vektor BC = (−1, 4)">
  <defs>${marker('b')}${marker('r')}</defs>
  ${grid()}
  <path class="t13-fill" d="M${px(0)} ${py(0)}L${px(6)} ${py(0)}L${px(5)} ${py(4)}L${px(1)} ${py(4)}Z"/>
  <path class="t13-sym" d="M${px(3)} ${py(-0.6)}V${py(4.8)}"/>
  <text class="t13-sl" x="${px(3) + 6}" y="${py(4.8) + 14}">x = 3</text>
  <g class="t13-ghost"><path d="M${px(6)} ${py(0)}L${px(7)} ${py(4)}L${px(1)} ${py(4)}"/>
    <text x="${px(7) + 10}" y="${py(4) + 5}">C′(7, 4)</text>
    <text x="${px(7) + 10}" y="${py(3.4)}">jajargenjang</text></g>
  ${arrow('t13-ab', 'b', 0, 0, 6, 0)}${arrow('t13-ad', 'r', 0, 0, 1, 4)}
  <g class="t13-lean"><path d="M${px(0)} ${py(0)}H${px(1)}V${py(4)}"/>
    <text x="${px(0.5)}" y="${py(0) - 10}" text-anchor="middle">+1</text>
    <text x="${px(1) + 8}" y="${py(2.2)}">+4</text></g>
  <g class="t13-step"><path d="M${px(6)} ${py(0)}H${px(5)}V${py(4)}"/>
    <text x="${px(5.5)}" y="${py(0) - 10}" text-anchor="middle">−1</text>
    <text x="${px(5) - 8}" y="${py(2.2)}" text-anchor="end">+4</text></g>
  ${arrow('t13-bc', 'b', 6, 0, 5, 4)}
  <text class="t13-bcl" data-src="v-bc" x="${px(7.3)}" y="${py(1.2)}">BC = (−1, 4)</text>
  ${dot('t13-p t13-pa', 0, 0, 'A(0, 0)', 0, 40)}${dot('t13-p t13-pb', 6, 0, 'B(6, 0)', 0, 40)}${dot('t13-p t13-pd', 1, 4, 'D(1, 4)')}${dot('t13-p t13-pc', 5, 4, 'C(5, 4)')}
  </svg>`;
}

export function createTrap13(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-trap';
  el.innerHTML = markup(false);
  const svg = el.querySelector('svg')!;
  const q = (s: string): SVGElement => svg.querySelector<SVGElement>(s)!;
  let prev: Required<Pick<Trap13State, 'lean' | 'sym' | 'mir' | 'step' | 'ghost' | 'fill'>> & { n: number } =
    {
      n: 0,
      lean: false,
      sym: false,
      mir: false,
      step: false,
      ghost: false,
      fill: false,
    };

  const fadeIn = (e: Element, delay = 0): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'trap',
    }).finished;
  const pop = (e: SVGElement, delay = 0): Promise<boolean> => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = 'center';
    return play(
      e,
      [
        { transform: 'scale(0.3)', opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 450, delay, easing: EASE_OUT, fill: 'backwards', tag: 'trap' },
    ).finished;
  };
  /** panah mendatar tumbuh dari pangkalnya (A) */
  const draw = (e: SVGElement, delay = 0): Promise<boolean> => {
    e.style.transformBox = 'fill-box';
    e.style.transformOrigin = 'left center';
    return play(e, [{ transform: 'scaleX(0)' }, { transform: 'none' }], {
      duration: 700,
      delay,
      easing: EASE,
      fill: 'backwards',
      tag: 'trap',
    }).finished;
  };

  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Trap13State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      const n = s.n ?? 0;
      const cur = {
        n,
        lean: !!s.lean,
        sym: !!s.sym,
        mir: !!s.mir,
        step: !!s.step,
        ghost: !!s.ghost,
        fill: !!s.fill,
      };
      svg.classList.toggle('n1', n >= 1);
      svg.classList.toggle('n2', n >= 2);
      svg.classList.toggle('n3', n >= 3);
      for (const k of ['lean', 'sym', 'mir', 'step', 'ghost', 'fill'] as const)
        svg.classList.toggle(`is-${k}`, cur[k]);
      const fresh = (k: 'lean' | 'sym' | 'mir' | 'step' | 'ghost' | 'fill'): boolean =>
        anim && cur[k] && (!prev[k] || c.replay);

      if (anim && n >= 1 && (prev.n < 1 || c.replay)) runs.push(pop(q('.t13-pa')));
      if (anim && n >= 2 && (prev.n < 2 || c.replay))
        runs.push(draw(q('.t13-ab'), 200), pop(q('.t13-pb'), 800));
      if (anim && n >= 3 && (prev.n < 3 || c.replay))
        runs.push(fadeIn(q('.t13-ad'), 200), pop(q('.t13-pd'), 800));
      if (fresh('lean')) runs.push(fadeIn(q('.t13-lean')));
      if (fresh('sym')) runs.push(fadeIn(q('.t13-sym')), fadeIn(q('.t13-sl')));
      if (fresh('mir')) {
        // D dicerminkan terhadap x = 3: titik bergerak dari D ke C
        const pc = q('.t13-pc');
        runs.push(
          play(
            pc,
            [
              { transform: `translateX(${px(1) - px(5)}px)`, opacity: 0.4 },
              { transform: 'none', opacity: 1 },
            ],
            { duration: 1100, delay: 200, easing: EASE, fill: 'backwards', tag: 'trap' },
          ).finished,
        );
      }
      if (fresh('step')) {
        runs.push(fadeIn(q('.t13-step')), fadeIn(q('.t13-bc'), 900), fadeIn(q('.t13-bcl'), 1300));
      }
      if (fresh('ghost')) runs.push(fadeIn(q('.t13-ghost')));
      if (fresh('fill')) runs.push(fadeIn(q('.t13-fill')));
      prev = cur;
      await Promise.all(runs);
    },
    sketch: () => markup(true),
  };
}
