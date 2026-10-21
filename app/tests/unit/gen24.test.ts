import { describe, expect, it } from 'vitest';
import { gen24 } from '../../src/practice/gen24';
import { keysOf, LEVELS } from '../../src/practice/types';

/** Uji properti generator soal 24 (PRD §11.5): 1.000 benih × 3 tingkat. */
const N = 1000;
/** Pernyataan (4) soal asli: dengan struktur X/Y tidak boleh muncul persis sama di tingkat Mudah. */
const ORIGINAL_4 = '\\lim_{\\theta\\to\\frac{\\pi}{6}}\\frac{X}{Y}=\\frac{2}{\\pi}';

describe('generator latihan soal 24 (kerucut es krim dan limit)', () => {
  for (const level of LEVELS)
    it(`tingkat ${level}: valid, 1–2 pernyataan benar, jebakan, muat tata letak`, () => {
      for (let s = 0; s < N; s++) {
        const seed = (s * 2654435761) % 2176782336;
        const inst = gen24.make(seed, level);
        // (a) oracle independen lolos (koordinat + integral numerik)
        expect(gen24.oracle(inst), inst.code).toBe(true);
        // (b) pilihan banyak: 1 atau 2 pernyataan benar, key = pernyataan benar pertama
        expect(inst.multi).toBe(true);
        const keys = keysOf(inst);
        expect(keys.length).toBeGreaterThanOrEqual(1);
        expect(keys.length).toBeLessThanOrEqual(2);
        expect(inst.key).toBe(keys[0]);
        // (c) lima pernyataan berbeda
        expect(inst.options).toHaveLength(5);
        expect(new Set(inst.options.map((o) => o.html)).size).toBe(5);
        // (d) pernyataan salah membawa jebakan dengan petunjuk yang tidak menyalahkan; semua punya alasan
        for (const o of inst.options) {
          if (!o.ok) expect(o.trap?.hint).toMatch(/^(Hati-hati|Perhatikan)/);
          else expect(o.trap).toBeUndefined();
          expect(o.why?.length ?? 0).toBeGreaterThan(20);
        }
        // (e) tidak ada TeX mentah yang rusak: tanda $ berpasangan
        for (const o of inst.options) expect((o.html!.match(/\$/g) ?? []).length % 2).toBe(0);
        // (f) bukan soal asli
        if (level === 'mudah') expect(inst.options.some((o) => o.html === `$${ORIGINAL_4}$`)).toBe(false);
        // struktur sesuai tingkat
        expect(inst.params.kind).toBe({ mudah: 'XY', sedang: 'YX', menantang: 'XYp' }[level]);
        // (g) penyelesaian dan petunjuk muat tata letak
        expect(inst.solution.every((c) => c.rows.length <= 4)).toBe(true);
        expect(inst.hints.every((h) => h.length > 20 && h.length <= 220)).toBe(true);
        inst.options.forEach((o, i) => expect(inst.test(i).ok).toBe(o.ok));
      }
    });

  it('deterministik dan bervariasi', () => {
    for (const level of LEVELS)
      for (const seed of [0, 1, 42, 123456, 2176782335]) {
        const a = gen24.make(seed, level);
        expect(gen24.make(seed, level).options.map((o) => o.html)).toEqual(a.options.map((o) => o.html));
      }
    const counts = new Set<number>();
    const pos = new Set<number>();
    const sets = new Set<string>();
    for (let s = 0; s < 300; s++) {
      const inst = gen24.make(s, 'sedang');
      const k = keysOf(inst);
      counts.add(k.length);
      k.forEach((i) => pos.add(i));
      sets.add(inst.options.map((o) => o.html).join('|'));
    }
    // satu dan dua pernyataan benar sama-sama muncul; pernyataan benar tidak selalu di posisi yang sama
    expect(counts).toEqual(new Set([1, 2]));
    expect(pos.size).toBe(5);
    expect(sets.size).toBeGreaterThan(100);
  });
});
