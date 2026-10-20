/**
 * Pemuat modul konten per soal (dimuat malas; setiap potongan ikut precache sehingga tetap offline).
 * Soal Rilis 1 yang modulnya belum dibuat menampilkan kertas "sedang disusun" di Detail soal.
 */
import type { SoalContent } from '../../engine/types';

const LOADERS: Partial<Record<number, () => Promise<{ default: SoalContent }>>> = {
  25: () => import('./q25'),
};

export const hasContent = (no: number): boolean => no in LOADERS;

export async function loadContent(no: number): Promise<SoalContent | null> {
  const f = LOADERS[no];
  return f ? (await f()).default : null;
}
