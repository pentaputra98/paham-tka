/**
 * Jam global (PRD §9.1 core/clock, §9.2 butir 7 dan 9).
 * - `rate()` = kecepatan siswa (0,75 / 1 / 1,5) atau 0 saat dijeda. Diterapkan sebagai playbackRate,
 *   sehingga perubahan kecepatan di tengah animasi tidak menimbulkan lompatan.
 * - `dur(ms)` = durasi dasar × faktor hemat gerak (≈25 %). Kecepatan TIDAK dipanggang ke durasi.
 * - `sleep(ms)` menghitung waktu dengan laju yang sama (ikut dipercepat/dijeda).
 */
import { addLoop, wake } from './loop';
import { store } from './store';

const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

/** Hemat gerak efektif: pengaturan menang atas sistem. */
export function reducedMotion(): boolean {
  const pref = store.settings.motion;
  if (pref === 'reduce') return true;
  if (pref === 'full') return false;
  return mq?.matches ?? false;
}

let paused = false;
const rateListeners = new Set<(r: number) => void>();

export const speed = (): number => store.settings.speed;
export const rate = (): number => (paused ? 0 : speed());
export const isPaused = (): boolean => paused;

function emitRate(): void {
  const r = rate();
  wake();
  rateListeners.forEach((f) => f(r));
}

export function onRate(f: (r: number) => void): () => void {
  rateListeners.add(f);
  return () => rateListeners.delete(f);
}

export function setPaused(p: boolean): void {
  if (paused === p) return;
  paused = p;
  emitRate();
}

/** Faktor durasi (hemat gerak memangkas ≈75 %). */
export const rmFactor = (): number => (reducedMotion() ? 0.25 : 1);

/** Durasi dasar terskala hemat gerak (kecepatan diterapkan lewat `rate()`). */
export const dur = (ms: number): number => Math.max(1, ms * rmFactor());

/** Durasi nyata yang dilihat siswa (untuk putar otomatis dan pengukuran). */
export const wallMs = (ms: number): number => dur(ms) / Math.max(0.0001, speed());

interface Timer {
  left: number;
  res: (ok: boolean) => void;
}
const timers = new Set<Timer>();
addLoop((dt) => {
  const r = rate();
  // dijeda: diam sampai laju berubah (emitRate membangunkan loop)
  if (!r || !timers.size) return false;
  for (const t of [...timers]) {
    t.left -= dt * 1000 * r;
    if (t.left <= 0) {
      timers.delete(t);
      t.res(true);
    }
  }
  return timers.size > 0;
});

/** Jeda yang mengikuti kecepatan dan tombol jeda. Hasil false = dipotong oleh flushSleeps(). */
export function sleep(ms: number): Promise<boolean> {
  return new Promise((res) => {
    timers.add({ left: dur(ms), res });
    wake();
  });
}

/** Selesaikan semua jeda seketika (dipakai saat siswa pindah langkah). */
export function flushSleeps(): void {
  for (const t of [...timers]) {
    timers.delete(t);
    t.res(false);
  }
}

/** Terapkan pengaturan gerak ke <html> agar token CSS ikut. */
export function applyMotionAttr(): void {
  const root = document.documentElement;
  const pref = store.settings.motion;
  if (pref === 'system') delete root.dataset.motion;
  else root.dataset.motion = pref;
  root.style.setProperty('--time-scale', String(rmFactor() / speed()));
}

export function watchMotion(): void {
  applyMotionAttr();
  let lastSpeed = speed();
  store.subscribe('settings', () => {
    applyMotionAttr();
    if (speed() !== lastSpeed) {
      lastSpeed = speed();
      emitRate();
    }
  });
  mq?.addEventListener('change', applyMotionAttr);
}
