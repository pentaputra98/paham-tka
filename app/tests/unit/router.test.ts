import { describe, expect, it } from 'vitest';
import { parseHash, toHash } from '../../src/router/router';

describe('router hash (PRD §7.1)', () => {
  it('beranda untuk hash kosong dan tak dikenal', () => {
    expect(parseHash('').name).toBe('home');
    expect(parseHash('#/').name).toBe('home');
    expect(parseHash('#/apa-saja').name).toBe('home');
    expect(parseHash('#/soal/26').name).toBe('home');
    expect(parseHash('#/soal/0').name).toBe('home');
    expect(parseHash('#/soal/5/entah').name).toBe('home');
  });
  it('detail, bahas dengan parameter, latihan, catatan', () => {
    expect(parseHash('#/soal/5')).toMatchObject({ name: 'detail', no: 5 });
    const r = parseHash('#/soal/5/bahas?b=2&l=1&m=amati');
    expect(r).toMatchObject({ name: 'bahas', no: 5, query: { b: '2', l: '1', m: 'amati' } });
    expect(parseHash('#/soal/25/latihan?s=abc123').query.s).toBe('abc123');
    expect(parseHash('#/soal/18/catatan').name).toBe('catatan');
  });
  it('halaman tingkat atas', () => {
    for (const n of ['kemajuan', 'pengaturan', 'tentang'] as const) expect(parseHash(`#/${n}`).name).toBe(n);
  });
  it('kedalaman menentukan arah transisi', () => {
    expect(parseHash('#/soal/5/bahas').depth).toBeGreaterThan(parseHash('#/soal/5').depth);
    expect(parseHash('#/soal/5').depth).toBeGreaterThan(parseHash('#/').depth);
  });
  it('toHash kebalikan parseHash', () => {
    for (const h of ['#/', '#/soal/5', '#/soal/5/bahas?b=2&l=1', '#/tentang']) {
      const r = parseHash(h);
      expect(toHash({ name: r.name, no: r.no, query: r.query })).toBe(h);
    }
  });
});
