import { describe, expect, it } from 'vitest';
import { OPEN, RELEASE_1, SOAL, isReady } from '../../src/content';

describe('daftar soal (PRD §5)', () => {
  it('25 soal berurutan dengan slug qNN', () => {
    expect(SOAL.map((s) => s.no)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    expect(SOAL[4]!.slug).toBe('q05');
  });
  it('hanya soal yang dibuka pemilik berstatus ready; semuanya bagian Rilis 1 (PRD v1.6)', () => {
    expect(SOAL.filter((s) => s.status === 'ready').map((s) => s.no)).toEqual([...OPEN]);
    expect(OPEN.every((n) => RELEASE_1.includes(n))).toBe(true);
    expect(RELEASE_1).toHaveLength(11);
    expect(isReady(1)).toBe(true);
    expect(isReady(3)).toBe(false);
    expect(isReady(24)).toBe(OPEN.includes(24));
  });
  it('soal 18 memakai label Pas / Tidak Pas', () => {
    expect(SOAL[17]!.labels).toEqual(['Pas', 'Tidak Pas']);
  });
});

describe('verify:content menangkap garis miring LaTeX tunggal', () => {
  it('karakter kendali (\b dari "\begin" tunggal) ditolak', async () => {
    const { validateSoal } = await import('../../src/engine/validate');
    const q06 = (await import('../../src/content/soal/q06')).default;
    expect(validateSoal(q06).errors).toEqual([]);
    const bad = structuredClone(q06);
    bad.steps[0]!.cap = 'x \begin{aligned} y';
    expect(validateSoal(bad).errors.some((e) => e.includes('karakter kendali'))).toBe(true);
  });
});
