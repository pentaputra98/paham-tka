/** PRNG deterministik mulberry32 (PRD §11.1 butir 6). Benih → urutan sama persis. */
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bilangan bulat [a, b]. */
export const int = (rng: Rng, a: number, b: number): number => a + Math.floor(rng() * (b - a + 1));

export const pick = <T>(rng: Rng, list: readonly T[]): T => list[Math.floor(rng() * list.length)]!;

/** Kode soal: benih basis 36, 6 karakter (PRD §11.1). */
export const seedToCode = (seed: number): string => (seed >>> 0).toString(36).padStart(6, '0').slice(-6);
export const codeToSeed = (code: string): number => parseInt(code, 36) >>> 0;
