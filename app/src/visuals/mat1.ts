/**
 * Adegan "matriks diagonal" soal 1 (alur guru, revisi pemilik 20 Okt 2026).
 * Elemen diagonal ditulis sebagai pecahan pembilang/penyebut (bilangan bulat k = k/1, angka 1 dibuat pudar),
 * sehingga "invers = tukar pembilang dan penyebut" terlihat sebagai gerak nyata: pembilang turun, penyebut naik.
 * Keadaan: m (matriks), hl (sorot diagonal), flip (tampilkan inversnya di kanan, dianimasikan saat maju),
 * adj (uji rumus umum: a ↔ d bertukar posisi, b dan c diberi tanda minus). Gerak hanya transform/opacity.
 */
import { play } from '../core/motion';
import { DUR, EASE, SLIDE_PX } from '../core/tokens';
import type { Ctx } from '../engine/board';
import type { VisualScene } from '../engine/scene';

/** elemen diagonal: tanda, pembilang, penyebut */
type Ent = [sign: '' | '−', n: string, d: string];
export type MatKey = 'F' | 'G' | 'ex2' | 'ex3';
export interface Mat1State {
  m?: MatKey;
  /** sorot diagonal utama (dan redupkan elemen nol di luar diagonal) */
  hl?: boolean;
  /** tampilkan invers di kanan */
  flip?: boolean;
  /** uji rumus umum: posisi a ↔ d ditukar, b dan c diberi tanda minus */
  adj?: boolean;
  [k: string]: unknown;
}

/** angka dari docs/pembahasan25.md soal 1 (F) dan contoh tambahan yang diminta pemilik (ex2, ex3) */
const MATS: Record<MatKey, { name: string; diag: Ent[] }> = {
  F: {
    name: 'F',
    diag: [
      ['', '2', '1'],
      ['', '1', '2'],
    ],
  },
  G: {
    name: 'A',
    diag: [
      ['', 'a', '1'],
      ['', 'd', '1'],
    ],
  },
  ex2: {
    name: 'P',
    diag: [
      ['', '4', '1'],
      ['', '1', '3'],
    ],
  },
  ex3: {
    name: 'Q',
    diag: [
      ['', '3', '1'],
      ['−', '2', '1'],
      ['', '1', '5'],
    ],
  },
};

const SRC = ['Fa', 'Fb', 'Fc', 'Fd'];

function frac(e: Ent, inv: boolean): string {
  const [s, n, d] = inv ? [e[0], e[2], e[1]] : e;
  // penyebut 1 dipudarkan: bilangan bulat = pecahan berpenyebut 1
  return `<span class="fr">${s ? `<span class="fr-s">${s}</span>` : ''}<span class="fr-n">${n}</span><span class="fr-bar"></span><span class="fr-d${d === '1' ? ' one' : ''}">${d}</span></span>`;
}

function matrix(key: MatKey, inv: boolean, live: boolean): string {
  const { diag } = MATS[key];
  const n = diag.length;
  const cells: string[] = [];
  let k = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const on = r === c;
      const src = live && key === 'F' && !inv ? ` data-src="${SRC[k]}"` : '';
      const pos = n === 2 ? ` data-k="${'abcd'[k]}"` : '';
      cells.push(
        `<div class="mx-c${on ? ' dg' : ' off'}"${pos}${src}>${on ? frac(diag[r]!, inv) : '<span class="mx-neg">−</span><span class="z">0</span>'}</div>`,
      );
      k++;
    }
  return `<div class="mx-b"><div class="mx-g" style="--n:${n}">${cells.join('')}</div></div>`;
}

export function createMat1(): VisualScene {
  const el = document.createElement('div');
  el.className = 'vis-mat';
  let key: MatKey | null = null;
  let flipped = false;
  let adj = false;

  function render(k: MatKey): void {
    const { name } = MATS[k];
    el.innerHTML = `<div class="mx-row">
      <div class="mx mx-src"><span class="mx-name"><i>${name}</i> =</span>${matrix(k, false, true)}</div>
      <div class="mx-to" aria-hidden="true"><span class="mx-arrow">→</span><span class="mx-to-t">balik pembilang<br>dan penyebut</span></div>
      <div class="mx mx-inv"><span class="mx-name"><i>${name}</i><sup>−1</sup> =</span>${matrix(k, true, false)}</div>
    </div>
    <p class="mx-ordo">ordo ${MATS[k].diag.length}×${MATS[k].diag.length}</p>`;
    el.setAttribute(
      'aria-label',
      k === 'F'
        ? 'Matriks F: 2 dan setengah di diagonal utama, nol di luar diagonal.'
        : `Contoh matriks diagonal ${name}`,
    );
    el.classList.toggle('n3', MATS[k].diag.length === 3);
    el.classList.toggle('is-ans', k === 'F');
    key = k;
    flipped = false;
    adj = false;
  }

  /** gerak tukar: pembilang turun ke bawah garis, penyebut naik ke atas (pada matriks invers) */
  function animateFlip(): void {
    el.querySelectorAll<HTMLElement>('.mx-inv .dg .fr').forEach((fr, i) => {
      const n = fr.querySelector<HTMLElement>('.fr-n')!;
      const d = fr.querySelector<HTMLElement>('.fr-d')!;
      const h = d.getBoundingClientRect().top - n.getBoundingClientRect().top;
      const o = { duration: DUR.flip, easing: EASE, delay: 380 + i * 260 };
      play(
        n,
        [
          { transform: `translateY(${h}px)` },
          { transform: `translateY(${h / 2}px) scale(1.25)`, offset: 0.5 },
          { transform: 'none' },
        ],
        o,
      );
      play(
        d,
        [
          { transform: `translateY(${-h}px)` },
          { transform: `translateY(${-h / 2}px) scale(1.25)`, offset: 0.5 },
          { transform: 'none' },
        ],
        o,
      );
    });
    play(
      el.querySelector('.mx-inv')!,
      [
        { opacity: 0, transform: `translateX(${-SLIDE_PX}px)` },
        { opacity: 1, transform: 'none' },
      ],
      {
        duration: DUR.enter,
        easing: EASE,
      },
    );
  }

  /** uji rumus umum: a dan d bertukar tempat (FLIP), b dan c mendapat tanda minus */
  function placeAdj(on: boolean, animate: boolean): void {
    const cells = [...el.querySelectorAll<HTMLElement>('.mx-src .mx-c[data-k]')];
    const before = animate ? cells.map((c) => c.getBoundingClientRect()) : [];
    for (const c of cells) {
      const k = c.dataset.k!;
      const swap = on && (k === 'a' || k === 'd');
      const pos = { a: [1, 1], b: [1, 2], c: [2, 1], d: [2, 2] }[k as 'a']!;
      const [r, col] = swap ? [3 - pos[0]!, 3 - pos[1]!] : pos;
      c.style.gridArea = `${r} / ${col}`;
    }
    el.classList.toggle('is-adj', on);
    adj = on;
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

  return {
    el,
    apply(state, c: Ctx) {
      const s = state as Mat1State;
      const k = s.m ?? 'F';
      const fresh = k !== key;
      if (fresh) render(k);
      el.classList.toggle('is-hl', !!s.hl);
      const wantFlip = !!s.flip;
      el.classList.toggle('is-flip', wantFlip);
      if (wantFlip && (!flipped || fresh) && c.dir > 0) animateFlip();
      flipped = wantFlip;
      if (!!s.adj !== adj || fresh) placeAdj(!!s.adj, !fresh && c.dir > 0);
    },
    sketch: () => {
      const tmp = document.createElement('div');
      tmp.innerHTML = `<div class="vis-mat is-hl is-flip is-ans n-sketch-mat"><div class="mx-row">
        <div class="mx mx-src"><span class="mx-name"><i>F</i> =</span>${matrix('F', false, false)}</div>
        <div class="mx-to"><span class="mx-arrow">→</span><span class="mx-to-t">balik pembilang<br>dan penyebut</span></div>
        <div class="mx mx-inv"><span class="mx-name"><i>F</i><sup>−1</sup> =</span>${matrix('F', true, false)}</div></div></div>`;
      return tmp.innerHTML;
    },
  };
}
