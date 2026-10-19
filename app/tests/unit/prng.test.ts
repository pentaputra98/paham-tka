import { describe, expect, it } from 'vitest';
import { codeToSeed, int, mulberry32, seedToCode } from '../../src/core/prng';

describe('prng mulberry32 (PRD §11.1)', () => {
  it('deterministik: benih sama → urutan sama', () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    expect(Array.from({ length: 5 }, a)).toEqual(Array.from({ length: 5 }, b));
  });
  it('nilai di [0, 1) dan bilangan bulat dalam rentang', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const v = int(r, -3, 3);
      expect(v).toBeGreaterThanOrEqual(-3);
      expect(v).toBeLessThanOrEqual(3);
    }
  });
  it('kode soal 6 karakter dan bolak-balik', () => {
    const c = seedToCode(123456789);
    expect(c).toHaveLength(6);
    expect(seedToCode(codeToSeed(c))).toBe(c);
  });
});
