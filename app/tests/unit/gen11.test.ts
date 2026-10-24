import { describe, expect, it } from 'vitest';
import { gen11 } from '../../src/practice/gen11';
import { LEVELS, parseCode, toCode } from '../../src/practice/types';

/** Uji properti generator soal 11 (PRD §11.5): 1.000 benih × 3 tingkat. */
const N = 1000;

describe('generator latihan soal 11 (kedalaman air laut)', () => {
  for (const level of LEVELS)
    it(`tingkat ${level}: valid, unik, distraktor berjebakan, waktu bulat`, () => {
      for (let s = 0; s < N; s++) {
        const seed = (s * 2654435761) % 2176782336;
        const inst = gen11.make(seed, level);
        const p = inst.params as { kind: string; a: number; b: number; P: number; n: number; opts: number[] };
        // (a) oracle independen lolos
        expect(gen11.oracle(inst), inst.code).toBe(true);
        expect(inst.options.filter((o) => o.ok)).toHaveLength(1);
        // (c) pilihan berbeda dan urut naik, seperti soal asli
        expect(new Set(p.opts).size).toBe(5);
        expect([...p.opts].sort((x, y) => x - y)).toEqual(p.opts);
        // (d) setiap distraktor membawa jebakan yang tidak menyalahkan
        for (const o of inst.options.filter((x) => !x.ok))
          expect(o.trap?.hint).toMatch(/^(Hati-hati|Perhatikan)/);
        // (e) waktu bulat positif dan dalam rentang
        for (const t of p.opts) {
          expect(Number.isInteger(t)).toBe(true);
          expect(t).toBeGreaterThan(0);
          expect(t).toBeLessThanOrEqual(130);
        }
        // (f) bukan soal asli
        expect(p.a === 12.3 && p.b === 2 && p.P === 12 && p.kind === 'tengah' && p.n === 3).toBe(false);
        // struktur sesuai tingkat
        if (level === 'mudah') expect(p.kind).toBe('tengah');
        if (level === 'sedang') expect(['tengah', 'lembah']).toContain(p.kind);
        if (level === 'menantang') expect(['atas', 'bawah']).toContain(p.kind);
        // gambar dan naskah
        expect(inst.paper).toContain('<svg');
        // (g) penyelesaian dan petunjuk muat tata letak
        expect(inst.solution.every((c) => c.rows.length <= 3)).toBe(true);
        expect(inst.hints.every((h) => h.length > 20 && h.length <= 220)).toBe(true);
        inst.options.forEach((o, i) => expect(inst.test(i).ok).toBe(o.ok));
        // tanpa ":" sebagai pemisah di baris penyelesaian
        for (const r of inst.solution.flatMap((c) => c.rows))
          for (const t of r.toks) expect('t' in t ? t.t : '').not.toBe(':');
      }
    });

  it('oracle menolak kunci yang dipindah ke distraktor', () => {
    for (const level of LEVELS)
      for (let s = 0; s < 50; s++) {
        const inst = gen11.make(s, level);
        const other = (inst.key + 1) % 5;
        const moved = {
          ...inst,
          key: other,
          options: inst.options.map((o, i) => ({ ...o, ok: i === other })),
        };
        expect(gen11.oracle(moved)).toBe(false);
      }
  });

  it('deterministik: benih yang sama menghasilkan soal yang sama persis; kode bolak-balik', () => {
    for (const level of LEVELS)
      for (const seed of [0, 1, 42, 123456, 2176782335]) {
        const a = gen11.make(seed, level);
        const b = gen11.make(seed, level);
        expect(b.paper).toBe(a.paper);
        expect(b.options.map((o) => o.tex)).toEqual(a.options.map((o) => o.tex));
        expect(parseCode(toCode(seed, level))).toEqual({ seed, level });
      }
  });

  it('variasi: posisi kunci tersebar, soal beragam, semua jenis muncul', () => {
    const keys = new Set<number>();
    const papers = new Set<string>();
    const kinds = new Set<string>();
    for (let s = 0; s < 300; s++)
      for (const level of LEVELS) {
        const inst = gen11.make(s, level);
        keys.add(inst.key);
        papers.add(inst.paper);
        kinds.add(String(inst.params.kind));
      }
    expect(keys.size).toBe(5);
    expect(papers.size).toBeGreaterThan(200);
    expect(kinds).toEqual(new Set(['tengah', 'lembah', 'atas', 'bawah']));
  });
});
