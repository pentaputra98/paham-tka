/**
 * Generator latihan per soal (dimuat malas, ikut precache sehingga tetap offline).
 * Soal tanpa generator menampilkan "Coba latihan serupa" sebagai Segera hadir.
 */
import type { Generator } from './types';

const LOADERS: Partial<Record<number, () => Promise<Generator>>> = {
  1: () => import('./gen01').then((m) => m.gen01),
};

export const hasPractice = (no: number): boolean => no in LOADERS;

export async function loadGenerator(no: number): Promise<Generator | null> {
  const f = LOADERS[no];
  return f ? f() : null;
}
