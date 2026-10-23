import { describe, expect, it } from 'vitest';
import { gen16 } from '../../src/practice/gen16';
import { LEVELS, keysOf, parseCode, toCode } from '../../src/practice/types';

/** Uji properti generator soal 16 (PRD §11.5): 1.000 benih × 3 tingkat. */
const N = 1000;
type P = [number, number];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const len2 = (u: P): number => u[0] * u[0] + u[1] * u[1];

describe('generator latihan soal 16 (titik singgung)', () => {
  for (const level of LEVELS)
    it(`tingkat ${level}: valid, tepat dua titik singgung, distraktor berjebakan, bilangan bulat`, () => {
      for (let s = 0; s < N; s++) {
        const seed = (s * 2654435761) % 2176782336;
        const inst = gen16.make(seed, level);
        const p = inst.params as { mode: string; A: P; B: P; C: P; D: P; s: number; d: P; cands: P[] };
        // (a) oracle independen lolos
        expect(gen16.oracle(inst), inst.code).toBe(true);
        // (b) tepat dua jawaban benar, pilihan banyak
        expect(inst.multi).toBe(true);
        expect(keysOf(inst)).toHaveLength(2);
        // (c) tidak ada dua pilihan identik
        expect(new Set(inst.options.map((o) => o.tex)).size).toBe(5);
        // (d) setiap distraktor membawa jebakan yang tidak menyalahkan; distraktor "di luar" memang di luar
        const r2 = len2(sub(p.B, p.A));
        inst.options.forEach((o, i) => {
          if (o.ok) return;
          expect(o.trap?.hint).toMatch(/^(Hati-hati|Perhatikan)/);
          if (o.trap?.id === 'di-luar-lingkaran') expect(len2(sub(p.cands[i]!, p.A))).not.toBe(r2);
        });
        // (e) bilangan bulat dan dalam rentang
        for (const q of [p.A, p.B, p.C, p.D, ...p.cands])
          for (const v of q) {
            expect(Number.isInteger(v)).toBe(true);
            expect(Math.abs(v)).toBeLessThanOrEqual(12);
          }
        // (f) bukan soal asli: pusat A(2, −3) tidak dipakai
        expect(p.A[0] === 2 && p.A[1] === -3).toBe(false);
        // struktur sesuai tingkat
        if (level === 'mudah') {
          expect([p.mode, p.s]).toEqual(['tegak', 1]);
          expect(p.d[1]).toBeGreaterThan(0);
          expect(
            inst.options.some((o, i) => o.ok && p.cands[i]![0] === p.B[0] && p.cands[i]![1] === p.B[1]),
          ).toBe(true);
        }
        if (level === 'sedang') expect([p.mode, p.s]).toEqual(['tegak', 1]);
        if (level === 'menantang') expect(p.s === 2 || p.mode === 'sejajar').toBe(true);
        // gambar dan naskah
        expect(inst.paper).toContain('<svg');
        expect(inst.paper).toContain(p.mode === 'tegak' ? 'tegak lurus' : 'sejajar garis');
        // (g) penyelesaian dan petunjuk muat tata letak
        expect(inst.solution.every((c) => c.rows.length <= 3)).toBe(true);
        expect(inst.hints.every((h) => h.length > 20 && h.length <= 220)).toBe(true);
        // umpan balik hitung dan alasan tersedia
        inst.options.forEach((o, i) => {
          expect(inst.test(i).ok).toBe(o.ok);
          expect(o.why?.length ?? 0).toBeGreaterThan(10);
        });
      }
    });

  it('oracle menolak kunci yang ditukar dengan distraktor', () => {
    for (const level of LEVELS)
      for (let s = 0; s < 50; s++) {
        const inst = gen16.make(s, level);
        const keys = keysOf(inst);
        const wrong = [0, 1, 2, 3, 4].find((i) => !keys.includes(i))!;
        const moved = {
          ...inst,
          options: inst.options.map((o, i) => ({ ...o, ok: i === wrong || i === keys[1] })),
        };
        expect(gen16.oracle(moved)).toBe(false);
      }
  });

  it('deterministik: benih yang sama menghasilkan soal yang sama persis; kode bolak-balik', () => {
    for (const level of LEVELS)
      for (const seed of [0, 1, 42, 123456, 2176782335]) {
        const a = gen16.make(seed, level);
        const b = gen16.make(seed, level);
        expect(b.paper).toBe(a.paper);
        expect(b.options.map((o) => o.tex)).toEqual(a.options.map((o) => o.tex));
        expect(parseCode(toCode(seed, level))).toEqual({ seed, level });
      }
  });

  it('variasi: posisi kunci tersebar, soal beragam, Menantang memuat kedua struktur', () => {
    const pos = new Set<number>();
    const papers = new Set<string>();
    const kinds = new Set<string>();
    for (let s = 0; s < 300; s++)
      for (const level of LEVELS) {
        const inst = gen16.make(s, level);
        keysOf(inst).forEach((k) => pos.add(k));
        papers.add(inst.paper);
        if (level === 'menantang') kinds.add(`${String(inst.params.mode)}-${String(inst.params.s)}`);
      }
    expect(pos.size).toBe(5);
    expect(papers.size).toBeGreaterThan(200);
    expect(kinds).toEqual(new Set(['tegak-2', 'sejajar-1']));
  });
});
