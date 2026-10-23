import { describe, expect, it } from 'vitest';
import { gen15, type Eq } from '../../src/practice/gen15';
import { LEVELS, parseCode, toCode } from '../../src/practice/types';

/** Uji properti generator soal 15 (PRD §11.5): 1.000 benih × 3 tingkat. */
const N = 1000;
const coefs = (e: Eq): number[] => (e.f === 'baku' ? [e.p, e.q, e.s] : [e.A, e.B, e.C]);

describe('generator latihan soal 15 (persamaan lingkaran)', () => {
  for (const level of LEVELS)
    it(`tingkat ${level}: valid, unik, distraktor berjebakan, bilangan bulat`, () => {
      for (let s = 0; s < N; s++) {
        const seed = (s * 2654435761) % 2176782336;
        const inst = gen15.make(seed, level);
        const p = inst.params as { mode: string; form: string; h: number; k: number; r: number; opts: Eq[] };
        // (a) oracle independen lolos (dan menjamin jawaban unik)
        expect(gen15.oracle(inst), inst.code).toBe(true);
        expect(inst.options.filter((o) => o.ok)).toHaveLength(1);
        // (c) tidak ada dua pilihan identik
        expect(new Set(inst.options.map((o) => o.tex)).size).toBe(5);
        // (d) setiap distraktor membawa jebakan dengan petunjuk yang tidak menyalahkan
        for (const o of inst.options.filter((x) => !x.ok))
          expect(o.trap?.hint).toMatch(/^(Hati-hati|Perhatikan)/);
        // (e) bilangan bulat dan kecil
        for (const e of p.opts)
          for (const c of coefs(e)) {
            expect(Number.isInteger(c)).toBe(true);
            expect(Math.abs(c)).toBeLessThanOrEqual(80);
          }
        // (f) bukan soal asli: pusat (−3, 4) tidak dipakai
        expect(p.h === -3 && p.k === 4).toBe(false);
        expect(p.h * p.k).not.toBe(0);
        // struktur sesuai tingkat
        const forms = new Set(p.opts.map((e) => e.f));
        expect(forms.size).toBe(1);
        if (level === 'mudah') expect([p.mode, p.form]).toEqual(['gambar', 'baku']);
        if (level === 'sedang') expect([p.mode, p.form]).toEqual(['gambar', 'umum']);
        if (level === 'menantang') expect(['sepusat', 'kali']).toContain(p.mode);
        // gambar ada di naskah, diameter disebut
        expect(inst.paper).toContain('<svg');
        expect(inst.paper).toContain(`$${2 * p.r}$ satuan`);
        // (g) penyelesaian dan petunjuk muat tata letak
        const rows = inst.solution.flatMap((c) => c.rows);
        expect(rows.length).toBeLessThanOrEqual(7);
        expect(inst.solution.every((c) => c.rows.length <= 3)).toBe(true);
        expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
        expect(inst.hints.every((h) => h.length > 20 && h.length <= 220)).toBe(true);
        // umpan balik hitung konsisten dengan kunci
        inst.options.forEach((o, i) => expect(inst.test(i).ok).toBe(o.ok));
      }
    });

  it('oracle menolak kunci yang dipindah ke distraktor', () => {
    for (const level of LEVELS)
      for (let s = 0; s < 50; s++) {
        const inst = gen15.make(s, level);
        const other = (inst.key + 1) % 5;
        const moved = {
          ...inst,
          key: other,
          options: inst.options.map((o, i) => ({ ...o, ok: i === other })),
        };
        expect(gen15.oracle(moved)).toBe(false);
      }
  });

  it('deterministik: benih yang sama menghasilkan soal yang sama persis; kode bolak-balik', () => {
    for (const level of LEVELS)
      for (const seed of [0, 1, 42, 123456, 2176782335]) {
        const a = gen15.make(seed, level);
        const b = gen15.make(seed, level);
        expect(b.paper).toBe(a.paper);
        expect(b.options.map((o) => o.tex)).toEqual(a.options.map((o) => o.tex));
        expect(parseCode(toCode(seed, level))).toEqual({ seed, level });
      }
  });

  it('variasi: posisi kunci tersebar, pusat dan jari-jari beragam, Menantang memuat kedua struktur dan bentuk', () => {
    const keys = new Set<number>();
    const papers = new Set<string>();
    const kinds = new Set<string>();
    for (let s = 0; s < 300; s++) {
      for (const level of LEVELS) {
        const inst = gen15.make(s, level);
        keys.add(inst.key);
        papers.add(inst.paper);
        if (level === 'menantang') kinds.add(`${String(inst.params.mode)}-${String(inst.params.form)}`);
      }
    }
    expect(keys.size).toBe(5);
    expect(papers.size).toBeGreaterThan(200);
    expect(kinds).toEqual(new Set(['sepusat-umum', 'kali-baku', 'kali-umum']));
  });
});
