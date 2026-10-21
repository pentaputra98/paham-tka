/**
 * Catatan lengkap dari data (PRD FR-CAT-1, §9.1 engine/notes): setiap bagian dibangkitkan dari
 * BARIS PAPAN YANG SAMA, sehingga catatan identik dengan papan (satu sumber kebenaran; template
 * menulis ulang manual, di sini tidak).
 * Lembar ringkas dua kolom (revisi pemilik v1.5): tiap baris papan menjadi satu baris catatan
 * (rumus rata kiri, keterangan kecil di bawahnya, kotak biru/emas sama dengan papan); cetak A4 dua kolom.
 */
import { esc } from '../core/dom';
import { mathHtml, tex } from '../core/math';
import { isFrac, verdictLabels, type Card, type Piece, type Row, type SoalContent } from './types';

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

/** Potongan di dalam pecahan papan → LaTeX (pecahan bersarang ditulis \dfrac). */
function piecesTex(ps: Piece[]): string {
  return ps
    .map((p) => {
      if (isFrac(p)) return `\\dfrac{${piecesTex(p.frac[0])}}{${piecesTex(p.frac[1])}}`;
      if (p.h != null) return `${textTex(p.h)}\\;`;
      // token dicoret di dalam pecahan: \cancel (pecahan dirender sebagai satu rumus KaTeX)
      return p.c === 'x' ? `\\cancel{${p.t ?? ''}}` : (p.t ?? '');
    })
    .join(' ');
}

/** Satu token papan → HTML catatan: teks tetap teks (huruf isi), rumus lewat KaTeX; warna token dipertahankan. */
function pieceHtml(p: Piece): string {
  if (isFrac(p)) return tex(`\\dfrac{${piecesTex(p.frac[0])}}{${piecesTex(p.frac[1])}}`);
  const c = p.c ? ` ${p.c}` : '';
  if (p.h != null) return `<span class="n-tx${c}">${p.h}</span>`;
  return `<span class="n-tk${c}">${tex(p.t ?? '')}</span>`;
}

function rowHtml(r: Row): string {
  return `<div class="n-row${r.box ? ` box-${r.box}` : ''}"><span class="n-m">${r.toks.map(pieceHtml).join('')}</span>${
    r.note ? `<span class="n-note">${mathHtml(r.note)}</span>` : ''
  }</div>`;
}

function cardsTable(cards: Card[], labels: [string, string]): string {
  return `<table class="n-table n-cards"><tbody>${cards
    .map(
      (c) =>
        `<tr><th scope="row">${esc(c.label)}</th><td>${mathHtml(c.statement)}</td><td class="${c.ok ? 'ok' : 'no'}">${c.ok ? labels[0] : labels[1]}</td></tr>`,
    )
    .join('')}</tbody></table>`;
}

/** HTML lembar catatan (dipakai di layar, cetak, dan unduhan). */
export function buildNotes(c: SoalContent, sketches: Record<string, () => string> = {}): string {
  const labels = verdictLabels(c.meta);
  const sections = c.notes.sections
    .map((s, i) => {
      const rows = s.lists.flatMap((id) => c.lists[id] ?? []);
      const sketch = s.sketch && sketches[s.sketch] ? sketches[s.sketch]!() : '';
      return `<section class="n-sec"><h2><span>${i + 1}</span>${mathHtml(s.title)}</h2>
        ${rows.length ? `<div class="n-rows">${rows.map(rowHtml).join('')}</div>` : ''}
        ${sketch ? `<figure class="n-fig">${sketch}</figure>` : ''}
        ${s.why ? `<div class="why">${mathHtml(s.why)}</div>` : ''}</section>`;
    })
    .join('');
  return `<article class="nsheet" aria-label="Catatan lengkap">
    <header class="n-head">
      <div><p class="meta">${esc(c.notes.meta)}</p><h1>${esc(c.notes.title)}</h1></div>
      <p class="n-seal"><span>Jawaban</span><b>${esc(c.done.seal)}</b></p>
    </header>
    <div class="n-cols">
      ${sections}
      <section class="n-sec"><h2><span>${c.notes.sections.length + 1}</span>${c.meta.response === 'single' ? 'Cocokkan dengan pilihan' : 'Analisis'}</h2>
        ${cardsTable(c.cards, labels)}
        <p class="ans">${mathHtml(c.notes.answer)}</p></section>
    </div>
  </article>`;
}
