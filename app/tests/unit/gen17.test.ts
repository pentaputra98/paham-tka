import { describe, expect, it } from 'vitest';
import { gen17 } from '../../src/practice/gen17';
import { keysOf, LEVELS } from '../../src/practice/types';

/** Uji properti generator soal 17 (PRD §11.5): 1.000 benih × 3 tingkat. */
const N = 1000;

interface Geo {
  R: number;
  r: number;
  w: number;
  a: number;
  L: number;
  pi7: boolean;
}

describe('generator latihan soal 17 (cat pada rambu)', () => {
  for (const level of LEVELS)
    it(`tingkat ${level}: valid, 2–3 pilihan benar, jebakan, ukuran dalam kendala`, () => {
      for (let s = 0; s < N; s++) {
        const seed = (s * 2654435761) % 2176782336;
        const inst = gen17.make(seed, level);
        const g = inst.params.geo as Geo;
        // (a) oracle independen lolos (pencacahan kisi)
        expect(gen17.oracle(inst), inst.code).toBe(true);
        // (b) pilihan banyak: 2 atau 3 benar
        expect(inst.multi).toBe(true);
        const keys = keysOf(inst);
        expect(keys.length).toBeGreaterThanOrEqual(2);
        expect(keys.length).toBeLessThanOrEqual(3);
        expect(inst.key).toBe(keys[0]);
        // (c) lima pilihan berbeda
        expect(new Set(inst.options.map((o) => o.html)).size).toBe(5);
        // (d) pilihan salah membawa jebakan yang tidak menyalahkan; semua punya alasan
        for (const o of inst.options) {
          if (!o.ok) expect(o.trap?.hint).toMatch(/^(Hati-hati|Perhatikan)/);
          else expect(o.trap).toBeUndefined();
          expect(o.why?.length ?? 0).toBeGreaterThan(15);
        }
        // (e) ukuran dalam kendala PRD §11.4
        expect(level === 'mudah' ? [16, 20, 24] : [20, 24, 28, 30]).toContain(g.R);
        expect(g.r).toBeGreaterThanOrEqual(Math.ceil(0.55 * g.R));
        expect(g.r).toBeLessThanOrEqual(Math.floor(0.8 * g.R));
        expect(g.w).toBeGreaterThanOrEqual(Math.ceil(0.2 * g.r));
        expect(g.w).toBeLessThanOrEqual(Math.floor(0.35 * g.r));
        expect(g.L).toBe(2 * g.a + g.w);
        expect((g.L / 2) ** 2 + (g.w / 2) ** 2).toBeLessThanOrEqual(g.r * g.r);
        if (g.pi7) expect([g.R, g.r]).toEqual([28, 21]);
        // (f) bukan soal asli (R = 20, r = 14, salib sampai tepi lingkaran)
        expect(g.R === 20 && g.r === 14 && g.L === 28).toBe(false);
        // (g) penyelesaian dan petunjuk muat tata letak; tanda $ berpasangan
        expect(inst.solution.every((c) => c.rows.length <= 4)).toBe(true);
        expect(inst.hints.every((h) => h.length > 20 && h.length <= 220)).toBe(true);
        for (const o of inst.options) expect(((o.why ?? '').match(/\$/g) ?? []).length % 2).toBe(0);
        inst.options.forEach((o, i) => expect(inst.test(i).ok).toBe(o.ok));
      }
    });

  it('deterministik dan bervariasi', () => {
    for (const level of LEVELS)
      for (const seed of [0, 1, 42, 123456, 2176782335]) {
        const a = gen17.make(seed, level);
        expect(gen17.make(seed, level).paper).toBe(a.paper);
      }
    const counts = new Set<number>();
    const pos = new Set<number>();
    const papers = new Set<string>();
    for (let s = 0; s < 300; s++) {
      const inst = gen17.make(s, 'sedang');
      const k = keysOf(inst);
      counts.add(k.length);
      k.forEach((i) => pos.add(i));
      papers.add(inst.paper);
    }
    expect(counts).toEqual(new Set([2, 3]));
    expect(pos.size).toBe(5);
    expect(papers.size).toBeGreaterThan(80);
  });
});
