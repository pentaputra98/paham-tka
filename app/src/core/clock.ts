/**
 * Jam global (PRD §9.1 core/clock): `timeScale` dari kecepatan siswa (0,75× / 1× / 1,5×)
 * dan hemat gerak (sistem atau pengaturan). Semua durasi animasi instruksional lewat `dur()`.
 */
import { store } from './store';

const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

/** Hemat gerak efektif: pengaturan menang atas sistem. */
export function reducedMotion(): boolean {
  const pref = store.settings.motion;
  if (pref === 'reduce') return true;
  if (pref === 'full') return false;
  return mq?.matches ?? false;
}

/** Kecepatan siswa: 1,5× → durasi dikali 1/1,5. */
export function speed(): number {
  return store.settings.speed;
}

/** Pengali durasi; hemat gerak memangkas ≈75 % (PRD §9.2 butir 9). */
export function timeScale(): number {
  return (1 / speed()) * (reducedMotion() ? 0.25 : 1);
}

/**
 * Durasi terskala. `min` menjaga keterbacaan (mis. terbang token ≥ 320 ms pada 1,5×);
 * batas minimum tidak berlaku saat hemat gerak.
 */
export function dur(ms: number, min = 0): number {
  const v = ms * timeScale();
  return reducedMotion() ? v : Math.max(v, Math.min(min, ms));
}

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, dur(ms)));

/** Terapkan pengaturan gerak ke <html> agar token CSS ikut. */
export function applyMotionAttr(): void {
  const root = document.documentElement;
  const pref = store.settings.motion;
  if (pref === 'system') delete root.dataset.motion;
  else root.dataset.motion = pref;
  root.style.setProperty('--time-scale', String(timeScale()));
}

export function watchMotion(): void {
  applyMotionAttr();
  store.subscribe('settings', applyMotionAttr);
  mq?.addEventListener('change', applyMotionAttr);
}
