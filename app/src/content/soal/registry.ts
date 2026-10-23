/**
 * Pemuat modul konten per soal (dimuat malas; setiap potongan ikut precache sehingga tetap offline).
 * Soal Rilis 1 yang modulnya belum dibuat menampilkan kertas "sedang disusun" di Detail soal.
 */
import { store } from '../../core/store';
import type { SoalContent } from '../../engine/types';

const LOADERS: Partial<Record<number, () => Promise<{ default: SoalContent }>>> = {
  1: () => import('./q01'),
  2: () => import('./q02'),
  5: () => import('./q05'),
  6: () => import('./q06'),
  11: () => import('./q11'),
  13: () => import('./q13'),
  15: () => import('./q15'),
  16: () => import('./q16'),
  17: () => import('./q17'),
  18: () => import('./q18'),
  24: () => import('./q24'),
  25: () => import('./q25'),
};

export const hasContent = (no: number): boolean => no in LOADERS;

export async function loadContent(no: number): Promise<SoalContent | null> {
  const f = LOADERS[no];
  return f ? (await f()).default : null;
}

/** Potongan berat yang dipakai pembahasan (mis. Three.js soal 18): dimuat lebih awal saat Detail soal dibuka. */
const PREFETCH: Partial<Record<number, () => Promise<unknown>>> = {
  // Mode ringan memakai padanan 2D: Three.js tidak perlu dimuat
  18: () => (store.settings.lite ? Promise.resolve() : import('../../visuals/door3d-scene')),
};

/** Muat modul konten dan potongan tambahannya di latar (PRD §9.6 aturan 6). Galat diabaikan. */
export function prefetchContent(no: number): void {
  void LOADERS[no]?.().catch(() => undefined);
  void PREFETCH[no]?.().catch(() => undefined);
}
