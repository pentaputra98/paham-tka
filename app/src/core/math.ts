/**
 * KaTeX (dibundel lokal, PRD §14.1). `tex()` untuk satu rumus; `renderMath()` mengganti
 * segmen $…$ dan $$…$$ di dalam elemen. Tanpa eval; galat rumus ditampilkan sebagai teks.
 */
import katex from 'katex';
import { esc } from './dom';

const cache = new Map<string, string>();
const CACHE_MAX = 4000;

export function tex(src: string, displayMode = false): string {
  const key = (displayMode ? 'D' : 'I') + src;
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const out = render(src, displayMode);
  if (cache.size >= CACHE_MAX) cache.clear();
  cache.set(key, out);
  return out;
}

function render(src: string, displayMode: boolean): string {
  try {
    return katex.renderToString(src, {
      throwOnError: false,
      displayMode,
      output: 'htmlAndMathml',
      strict: 'ignore',
      // stabilo dan sumber terbang di kertas soal (konten bundel, bukan masukan siswa); \href dll. tetap ditolak
      trust: (ctx: { command: string }) => ctx.command === '\\htmlData' || ctx.command === '\\htmlClass',
    });
  } catch {
    return src;
  }
}

/** Ubah teks bercampur rumus menjadi HTML. Bagian non-rumus sudah berupa HTML tepercaya (konten bundel). */
export function mathHtml(s: string): string {
  return s.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (_m, d: string | undefined, i: string | undefined) =>
    d !== undefined ? tex(d, true) : tex(i ?? ''),
  );
}

/** Ganti segmen $…$ pada simpul teks di dalam elemen (teks di luar rumus diloloskan). */
export function renderMath(el: Element): void {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const hits: Text[] = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode())
    if (n.nodeValue?.includes('$')) hits.push(n as Text);
  for (const t of hits) {
    const span = document.createElement('span');
    span.innerHTML = mathHtml(esc(t.nodeValue ?? ''));
    t.replaceWith(...span.childNodes);
  }
}

/** Teks terbaca dari rumus KaTeX di dalam elemen (MathML tanpa anotasi TeX), untuk aria-label. */
export function mathLabel(el: Element): string {
  const parts: string[] = [];
  const walk = (n: Node): void => {
    if (n.nodeType === Node.TEXT_NODE) {
      if (!n.parentElement?.closest('.katex-html, annotation, [aria-hidden="true"]'))
        parts.push(n.nodeValue ?? '');
      return;
    }
    n.childNodes.forEach(walk);
  };
  walk(el);
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}
