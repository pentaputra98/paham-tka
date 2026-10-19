/**
 * Catatan lengkap dari data (PRD FR-CAT-1, §9.1 engine/notes): setiap bagian menjadi blok
 * `aligned` yang dibangkitkan dari BARIS PAPAN YANG SAMA, sehingga catatan identik dengan papan
 * (satu sumber kebenaran; template menulis ulang manual, di sini tidak).
 */
import { esc } from '../core/dom';
import { tex } from '../core/math';
import type { Card, Piece, Row, SoalContent } from './types';

const isFrac = (p: Piece): p is { frac: [Piece[], Piece[]] } => 'frac' in p;

/** Teks HTML pendek → \text{} yang aman untuk LaTeX. */
function textTex(h: string): string {
  const plain = h
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
  const safe = plain.replace(/[\\{}#$%&_~^]/g, (c) => (c === '\\' ? '\\textbackslash{}' : `\\${c}`));
  return `\\text{${safe}}`;
}

function piecesTex(ps: Piece[]): string {
  return ps
    .map((p) => {
      if (isFrac(p)) return `\\dfrac{${piecesTex(p.frac[0])}}{${piecesTex(p.frac[1])}}`;
      if (p.h != null) return p.c === 'lbl' ? `\\textbf{${textTex(p.h).slice(6, -1)}}\\;` : textTex(p.h);
      return p.t ?? '';
    })
    .join(' ');
}

/** Satu baris papan → satu baris aligned: rataan pada tanda "=" pertama di tingkat atas. */
export function rowTex(row: Row): string {
  const i = row.toks.findIndex((p) => !isFrac(p) && p.c === 'op' && p.t === '=');
  if (i < 0) return `&${piecesTex(row.toks)}`;
  return `${piecesTex(row.toks.slice(0, i))} &${piecesTex(row.toks.slice(i))}`;
}

export function alignedTex(rows: Row[]): string {
  return `\\begin{aligned}${rows.map(rowTex).join('\\\\[2pt]')}\\end{aligned}`;
}

function cardsTable(cards: Card[], labels: [string, string]): string {
  return `<table class="n-table"><tbody>${cards
    .map(
      (c) =>
        `<tr><td>${esc(c.label)} ${c.statement.replace(/\$([^$]+)\$/g, (_m, s: string) => tex(s))}</td><td class="${c.ok ? 'ok' : 'no'}">${c.ok ? labels[0] : labels[1]}</td></tr>`,
    )
    .join('')}</tbody></table>`;
}

/** HTML lembar catatan (dipakai di layar, cetak, dan unduhan). */
export function buildNotes(c: SoalContent, sketches: Record<string, () => string> = {}): string {
  const labels: [string, string] = c.meta.response === 'truefalse' && c.meta.labels ? [c.meta.labels[0].toUpperCase(), c.meta.labels[1].toUpperCase()] : ['BENAR', 'SALAH'];
  const sections = c.notes.sections
    .map((s, i) => {
      const rows = s.lists.flatMap((id) => c.lists[id] ?? []);
      const sketch = s.sketch && sketches[s.sketch] ? sketches[s.sketch]!() : '';
      return `<section class="${sketch ? '' : 'full'}"><h2><span>${i + 1}</span>${esc(s.title)}</h2>
        <div>${rows.length ? tex(alignedTex(rows), true) : ''}${s.why ? `<p class="why">${s.why.replace(/\$([^$]+)\$/g, (_m, x: string) => tex(x))}</p>` : ''}</div>${sketch}</section>`;
    })
    .join('');
  return `<article class="nsheet" aria-label="Catatan lengkap">
    <h1>${esc(c.notes.title)}</h1>
    <p class="meta">${esc(c.notes.meta)}</p>
    ${sections}
    <section class="full"><h2><span>${c.notes.sections.length + 1}</span>${c.meta.response === 'single' ? 'Cocokkan dengan pilihan' : 'Analisis'}</h2>
      ${cardsTable(c.cards, labels)}
      <p class="ans">${c.notes.answer.replace(/\$([^$]+)\$/g, (_m, x: string) => tex(x))}</p></section>
  </article>`;
}
