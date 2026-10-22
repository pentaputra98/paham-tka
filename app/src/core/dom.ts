/** Utilitas DOM kecil. Konten HTML hanya berasal dari data yang dibundel; masukan siswa lewat textContent. */
export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(sel);

export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document): T[] => [
  ...root.querySelectorAll<T>(sel),
];

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Meloloskan teks sebelum disisipkan ke templat HTML. */
export const esc = (s: string | number): string => String(s).replace(/[&<>"']/g, (c) => ESC[c] ?? c);

/** Membuat elemen dari templat HTML tepercaya (konten bundel). */
export function html<T extends Element = HTMLElement>(markup: string): T {
  const t = document.createElement('template');
  t.innerHTML = markup.trim();
  return t.content.firstElementChild as T;
}

/** Format angka Indonesia: 1.200 dan 2,5. */
export const fmt = (n: number, digits = 0): string =>
  n.toLocaleString('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const pad2 = (n: number): string => String(n).padStart(2, '0');

export const clamp = (v: number, a: number, b: number): number => Math.max(a, Math.min(b, v));

/**
 * ResizeObserver yang menjalankan callback pada frame berikutnya, paling banyak sekali per frame. Callback kita
 * mengubah tata letak (skala huruf, ukuran kanvas); bila dijalankan langsung di dalam notifikasi, peramban
 * mencatat "ResizeObserver loop completed with undelivered notifications".
 */
export function sizeObserver(cb: () => void): ResizeObserver {
  let raf = 0;
  return new ResizeObserver(() => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      cb();
    });
  });
}

/** Peringatan ResizeObserver dari peramban: bukan galat aplikasi, tidak dilaporkan. */
export const isBenignError = (msg: string): boolean => /ResizeObserver loop/i.test(msg);
