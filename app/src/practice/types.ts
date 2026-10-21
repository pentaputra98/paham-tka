/**
 * Antarmuka mesin latihan serupa (PRD §11.2), disesuaikan dengan mesin pembahasan yang ada:
 * penyelesaian berupa bagian-bagian baris papan (Row[]) sehingga "Lihat langkah" memakai papan yang sama.
 */
import type { Row } from '../engine/types';

export type Level = 'mudah' | 'sedang' | 'menantang';
export const LEVELS: readonly Level[] = ['mudah', 'sedang', 'menantang'];

/** Jebakan konsep pada distraktor (§11.1 butir 4, §11.6): petunjuk diawali "Hati-hati…"/"Perhatikan…". */
export interface Trap {
  id: string;
  hint: string;
  /** bagian pembahasan yang menjelaskan konsep terkait (tautan "Bahas bagian yang terkait") */
  chapter: number;
}

export interface Option {
  /** LaTeX pilihan */
  tex: string;
  ok: boolean;
  trap?: Trap;
}

export interface Instance {
  no: number;
  seed: number;
  level: Level;
  /** kode soal untuk mengulang soal yang sama (benih basis 36 + tingkat) */
  code: string;
  /** naskah soal baru (HTML tepercaya dengan $…$ / $$…$$) */
  paper: string;
  /** lima pilihan sudah teracak; label A–E sesuai urutan */
  options: Option[];
  /** indeks pilihan benar */
  key: number;
  /** petunjuk bertahap: konsep → langkah pertama → arah (FR-LAT-4) */
  hints: [string, string, string];
  /** penyelesaian untuk "Lihat langkah" (FR-LAT-6) */
  solution: Array<{ title: string; rows: Row[] }>;
  /** saran waktu per soal (detik) */
  timeAdvice: number;
  /** umpan balik hitung: "uji pilihanmu" (mis. F · X = …), LaTeX */
  test(i: number): { tex: string; ok: boolean };
  /** parameter mentah untuk oracle dan uji properti */
  params: Record<string, unknown>;
}

export interface Generator {
  no: number;
  /** deskripsi singkat tiap tingkat untuk layar penyiapan */
  levels: Record<Level, string>;
  make(seed: number, level: Level): Instance;
  /** verifikasi independen (§11.5): tidak memakai rumus pembuat */
  oracle(inst: Instance): boolean;
}

const LEVEL_CH: Record<Level, string> = { mudah: 'M', sedang: 'S', menantang: 'T' };

/** Kode soal "K3X9Q2-S": benih basis 36 (6 karakter) + huruf tingkat (PRD §11.1 butir 6). */
export function toCode(seed: number, level: Level): string {
  return `${(seed >>> 0).toString(36).padStart(6, '0').slice(-6).toUpperCase()}-${LEVEL_CH[level]}`;
}

export function parseCode(code: string): { seed: number; level: Level } | null {
  const m = /^([0-9a-z]{6})-([mst])$/i.exec(code.trim());
  if (!m) return null;
  const level = LEVELS.find((l) => LEVEL_CH[l] === m[2]!.toUpperCase())!;
  return { seed: parseInt(m[1]!, 36) >>> 0, level };
}
