/**
 * Adegan "grid matriks" soal 1 (pembahasan25.md soal 1, playbook §15 Matriks/SPL).
 * Tahap: diag (diagonal utama biru, diagonal samping merah) → adj (a ↔ d bertukar, tanda b dan c diubah)
 * → compare (F dan F⁻¹ berdampingan: tiap elemen diagonal diganti kebalikannya).
 * Pertukaran memakai FLIP: posisi akhir diterapkan, lalu transform dari posisi lama ke nol (hanya transform).
 */
import { tex } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

export type Mat1Stage = 'show' | 'diag' | 'adj' | 'compare';
type Key = 'a' | 'b' | 'c' | 'd';
const VAL: Record<Key, string> = { a: '2', b: '0', c: '0', d: '\\tfrac12' };
/** posisi sel [baris, kolom] untuk F dan untuk adjoin (a ↔ d) */
const POS: Record<'F' | 'adj', Record<Key, [number, number]>> = {
  F: { a: [1, 1], b: [1, 2], c: [2, 1], d: [2, 2] },
  adj: { a: [2, 2], b: [1, 2], c: [2, 1], d: [1, 1] },
};
const NOTE: Record<Mat1Stage, string> = {
  show: '',
  diag: `diagonal utama ${tex('a,\\ d')} · diagonal samping ${tex('b,\\ c')}`,
  adj: `tukar ${tex('a\\leftrightarrow d')}, ubah tanda ${tex('b')} dan ${tex('c')}`,
  compare: 'tiap elemen diagonal diganti kebalikannya',
};

export function createMat1(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-mat';
  const cell = (k: Key): string =>
    `<div class="mx-c mk-${k}" data-k="${k}" data-src="F${k}"><span class="mx-neg">−</span><span class="mx-v">${tex(VAL[k])}</span><span class="mx-tag">${tex(k)}</span></div>`;
  el.innerHTML = `<div class="mx-row">
    <div class="mx"><span class="mx-name"><span class="nm-F">${tex('F=')}</span><span class="nm-adj">${tex('\\operatorname{adj}F=')}</span></span><div class="mx-b"><div class="mx-g">${(['a', 'b', 'c', 'd'] as Key[]).map(cell).join('')}</div></div></div>
    <div class="mx-to" aria-hidden="true"><span>${tex('2\\to\\tfrac12')}</span><span>${tex('\\tfrac12\\to2')}</span></div>
    <div class="mx mx-inv"><span class="mx-name">${tex('F^{-1}=')}</span><div class="mx-b"><div class="mx-g">
      <div class="mx-c"><span class="mx-v">${tex('\\tfrac12')}</span></div><div class="mx-c"><span class="mx-v">${tex('0')}</span></div>
      <div class="mx-c"><span class="mx-v">${tex('0')}</span></div><div class="mx-c"><span class="mx-v">${tex('2')}</span></div>
    </div></div></div></div>
    <p class="mx-note" aria-live="polite"></p>`;
  const cells = [...el.querySelectorAll<HTMLElement>('.mx-c[data-k]')];
  const note = el.querySelector<HTMLElement>('.mx-note')!;
  let layout: 'F' | 'adj' = 'F';

  function place(to: 'F' | 'adj', animate: boolean): void {
    const before = animate ? cells.map((c) => c.getBoundingClientRect()) : [];
    for (const c of cells) {
      const [r, col] = POS[to][c.dataset.k as Key];
      c.style.gridArea = `${r} / ${col}`;
    }
    layout = to;
    if (!animate) return;
    cells.forEach((c, i) => {
      const a = before[i]!;
      const b = c.getBoundingClientRect();
      const dx = a.left - b.left;
      const dy = a.top - b.top;
      if (Math.abs(dx) + Math.abs(dy) < 1) return;
      play(c, [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
        duration: DUR.flip,
        easing: EASE,
      });
    });
  }

  place('F', false);

  return {
    el,
    apply(state, c: Ctx) {
      const stage = (state.stage as Mat1Stage | undefined) ?? 'show';
      el.dataset.stage = stage;
      const want = stage === 'adj' ? 'adj' : 'F';
      if (want !== layout) place(want, c.dir > 0);
      note.innerHTML = NOTE[stage];
    },
    sketch: () =>
      `<div class="vis-mat n-sketch-mat" data-stage="compare">${el.querySelector('.mx-row')!.outerHTML.replace(/ data-src="[^"]*"/g, '')}</div>`,
  };
}
