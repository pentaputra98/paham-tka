/**
 * Cermin token gerak untuk JavaScript (WAAPI/Motion tidak membaca variabel CSS).
 * Nilai harus sama dengan src/styles/tokens.css; berkas ini dikecualikan dari validate:tokens.
 */
export const EASE = 'cubic-bezier(0.65, 0, 0.35, 1)';
export const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
export const EASE_IN = 'cubic-bezier(0.55, 0, 1, 0.45)';

export const DUR = {
  instant: 100,
  fast: 150,
  base: 220,
  slow: 360,
  enter: 600,
  /** penerbangan token: 480–860 ms mengikuti jarak; ≥ 320 ms pada 1,5× (PRD §9.2 butir 7) */
  flyMin: 480,
  flyMax: 860,
  flyFloor: 320,
  chalk: 300,
  flip: 1050,
  toast: 4000,
  autoplayGap: 1200,
} as const;

/** Geser terarah antarlayar: maju dari kanan, mundur dari kiri (px). */
export const SLIDE_PX = 28;

/** Naik kecil saat masuk (toast, lembar), px. */
export const RISE_PX = 12;
