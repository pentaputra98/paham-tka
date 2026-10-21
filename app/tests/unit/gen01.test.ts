import { describe, expect, it } from 'vitest';
import { gen01 } from '../../src/practice/gen01';
import { I2, isZero, mEq, mMul, mSize, q, type M2 } from '../../src/practice/frac';
import { LEVELS, parseCode, toCode } from '../../src/practice/types';

/** Uji properti generator soal 1 (PRD §11.5): 1.000 benih × 3 tingkat. */
const N = 1000;
const ORIGINAL: M2 = [
  [q(2), q(0)],
  [q(0), q(1, 2)],
];

describe('generator latihan soal 1 (invers matriks)', () => {
  for (const level of LEVELS)
    it(`tingkat ${level}: valid, unik, distraktor berjebakan, bilangan bagus`, () => {
      for (let s = 0; s < N; s++) {
        const seed = (s * 2654435761) % 2176782336;
        const inst = gen01.make(seed, level);
        const F = inst.params.F as M2;
        const opts = inst.params.opts as M2[];
        // (a) oracle independen lolos
        expect(gen01.oracle(inst), `${inst.code}`).toBe(true);
        // (b) jawaban unik: tepat satu pilihan dengan F·X = I
        expect(opts.filter((m) => mEq(mMul(F, m), I2))).toHaveLength(1);
        expect(inst.options.filter((o) => o.ok)).toHaveLength(1);
        // (c) tidak ada dua pilihan identik
        expect(new Set(inst.options.map((o) => o.tex)).size).toBe(5);
        // (d) setiap distraktor membawa jebakan dengan petunjuk yang tidak menyalahkan
        for (const o of inst.options.filter((x) => !x.ok))
          expect(o.trap?.hint).toMatch(/^(Hati-hati|Perhatikan)/);
        // (e) bilangan dalam rentang (entri soal dan pilihan kecil)
        expect(mSize(F)).toBeLessThanOrEqual(5);
        for (const m of opts) expect(mSize(m)).toBeLessThanOrEqual(25);
        // (f) bukan soal asli
        expect(mEq(F, ORIGINAL)).toBe(false);
        // struktur sesuai tingkat
        if (level === 'mudah') expect(isZero(F[0][1]) && isZero(F[1][0])).toBe(true);
        if (level === 'sedang') expect(isZero(F[1][0]) && !isZero(F[0][1])).toBe(true);
        if (level === 'menantang') expect(!isZero(F[0][1]) && !isZero(F[1][0])).toBe(true);
        // (g) penyelesaian dan petunjuk muat tata letak
        const rows = inst.solution.flatMap((c) => c.rows);
        expect(rows.length).toBeLessThanOrEqual(8);
        expect(inst.solution.every((c) => c.rows.length <= 3)).toBe(true);
        expect(inst.hints.every((h) => h.length > 20 && h.length <= 220)).toBe(true);
        // umpan balik hitung konsisten dengan kunci
        inst.options.forEach((o, i) => expect(inst.test(i).ok).toBe(o.ok));
      }
    });

  it('deterministik: benih yang sama menghasilkan soal yang sama persis; kode bolak-balik', () => {
    for (const level of LEVELS)
      for (const seed of [0, 1, 42, 123456, 2176782335]) {
        const a = gen01.make(seed, level);
        const b = gen01.make(seed, level);
        expect(b.paper).toBe(a.paper);
        expect(b.options.map((o) => o.tex)).toEqual(a.options.map((o) => o.tex));
        expect(parseCode(toCode(seed, level))).toEqual({ seed, level });
      }
  });

  it('variasi: posisi kunci tersebar di A–E dan soal bervariasi', () => {
    const keys = new Set<number>();
    const papers = new Set<string>();
    for (let s = 0; s < 200; s++) {
      const inst = gen01.make(s, 'sedang');
      keys.add(inst.key);
      papers.add(inst.paper);
    }
    expect(keys.size).toBe(5);
    expect(papers.size).toBeGreaterThan(50);
  });
});
