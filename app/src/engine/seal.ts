/**
 * Segel jawaban (pop-up Selesai dan SELESAI). Jawaban tunggal = satu medali bundar. Jawaban banyak
 * (bagian dipisah " · ", mis. "1 · 2 · 5") = deret medali kecil, satu bagian per medali, agar tidak berdesakan
 * di satu lingkaran (revisi pemilik v1.10); bagian panjang (mis. "(−2, 0)", "Tidak") memakai bentuk pil.
 */
import { esc } from '../core/dom';

export function sealHtml(text: string, attrs = ''): string {
  const parts = text.split(/\s*·\s*/).filter(Boolean);
  if (parts.length <= 1) return `<span class="seal"${attrs}>${esc(text)}</span>`;
  const pill = parts.some((p) => p.length > 3);
  return `<span class="seal-row${pill ? ' is-pill' : ''}"${attrs}>${parts
    .map((p) => `<span class="seal seal-sm">${esc(p)}</span>`)
    .join('')}</span>`;
}

/** Ganti segel jawaban banyak yang ditulis di HTML pop-up (`<span class="seal">1 · 2 · 5</span>`). */
export function expandSeals(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('.seal:not(.seal-sm)').forEach((s) => {
    const t = (s.textContent ?? '').trim();
    if (t.includes('·')) s.outerHTML = sealHtml(t);
  });
}
