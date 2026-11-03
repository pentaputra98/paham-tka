/**
 * Adegan "pakan sapi dan kambing" soal 2, alur guru (v1.29; docs/sapi_dan_kambing.png).
 * Gambar soal; kebutuhan pakan 'sapi' | 'kambing' | 'all' dibingkai, angka per ekor menjadi sumber terbang
 * (f-sg, f-sm, f-kg, f-km); claim [x, y]: banyak sapi dan kambing ditempel di atas hewannya (emas bila sama dengan
 * hasil 3 sapi dan 4 kambing, merah bila bukan). Model batang v1.29 dihapus pada v1.32 (alur matriks pemilik).
 * Angka dari docs/pembahasan25.md soal 2. Gerak hanya transform/opacity.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE_OUT } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export interface Pakan2State {
  pic?: 'sapi' | 'kambing' | 'all';
  claim?: [number, number];
  [k: string]: unknown;
}

const fig = new URL('../assets/soal/sapi_dan_kambing.png', import.meta.url).href;
/** hasil sistem persamaan (docs): 3 sapi, 4 kambing */
const SOL: [number, number] = [3, 4];

// ---- tampilan gambar (satuan = piksel gambar asli 918 × 571) ----
const BOX = {
  sapi: [100, 410, 278, 130],
  kambing: [584, 400, 258, 136],
} as const;
const NUM: Array<[string, number, number, number]> = [
  ['f-sg', 284, 465, 78],
  ['f-sm', 290, 502, 78],
  ['f-kg', 764, 460, 66],
  ['f-km', 769, 495, 66],
];
const TAG: Array<[number, number, string]> = [
  [250, 168, 'sapi'],
  [700, 206, 'kambing'],
];

function picMarkup(): string {
  const box = (k: 'sapi' | 'kambing'): string => {
    const [x, y, w, h] = BOX[k];
    return `<rect class="pk-box" data-box="${k}" x="${x}" y="${y}" width="${w}" height="${h}" rx="16"/>`;
  };
  const nums = NUM.map(
    ([src, x, y, w]) =>
      `<rect class="pk-n" data-n="${src}" data-src="${src}" x="${x}" y="${y}" width="${w}" height="34" rx="8"/>`,
  ).join('');
  const tags = TAG.map(
    ([cx, cy, who], i) =>
      `<g class="pk-tag" data-tag="${i}"><rect x="${cx - 92}" y="${cy - 30}" width="184" height="60" rx="30"/><text x="${cx}" y="${cy + 10}" text-anchor="middle" data-t="${who}"></text></g>`,
  ).join('');
  return `<svg class="pk-pic" viewBox="0 0 918 571" role="img" aria-label="Sapi: rumput gajah 10 kg, rumput gamal 10 kg. Kambing: rumput gajah 2 kg, rumput gamal 1 kg.">
  <image href="${fig}" x="0" y="0" width="918" height="571"/>
  ${box('sapi')}${box('kambing')}${nums}${tags}
  </svg>`;
}

export function createPakan2(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-pakan';
  el.innerHTML = picMarkup();
  const tags = [...el.querySelectorAll<SVGGElement>('.pk-tag')];
  let claimKey = '';

  const fadeIn = (e: Element, delay: number): Promise<boolean> =>
    play(e, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 450,
      delay,
      easing: EASE_OUT,
      fill: 'backwards',
      tag: 'pakan',
    }).finished;
  return {
    el,
    async apply(state, c: Ctx) {
      const s = state as Pakan2State;
      const anim = c.dir > 0 && !reducedMotion();
      const runs: Array<Promise<boolean>> = [];
      // gambar: bingkai kebutuhan pakan tiap hewan
      const pic = s.pic ?? '';
      el.querySelectorAll<SVGRectElement>('.pk-box').forEach((b) => {
        const on = pic === 'all' || pic === b.dataset.box;
        if (on && anim && !b.classList.contains('on')) runs.push(fadeIn(b, 0));
        b.classList.toggle('on', on);
      });
      el.querySelectorAll<SVGRectElement>('.pk-n').forEach((n, i) => {
        const on = pic === 'all' || (pic === 'sapi' && i < 2) || (pic === 'kambing' && i >= 2);
        n.classList.toggle('on', on);
      });

      // klaim pilihan: banyak sapi dan kambing ditempel di atas hewannya
      const cl = s.claim;
      const key = cl ? cl.join() : '';
      tags.forEach((g, i) => {
        const n = cl?.[i];
        const t = g.querySelector('text')!;
        t.textContent = n === undefined ? '' : `${n} ${t.dataset.t}`;
        g.classList.toggle('on', n !== undefined);
        g.classList.toggle('is-ok', n === SOL[i]);
      });
      if (cl && anim && (key !== claimKey || c.replay))
        tags.forEach((g, i) => {
          g.style.transformBox = 'fill-box';
          g.style.transformOrigin = 'center';
          runs.push(
            play(
              g,
              [
                { transform: 'scale(0.4)', opacity: 0 },
                { transform: 'none', opacity: 1 },
              ],
              { duration: 480, delay: i * 260, easing: EASE_OUT, fill: 'backwards', tag: 'pakan' },
            ).finished,
          );
        });
      claimKey = key;

      await Promise.all(runs);
    },
  };
}
