import { describe, expect, it } from 'vitest';
import q24 from '../../src/content/soal/q24';
import q25 from '../../src/content/soal/q25';
import { ratio } from '../../src/visuals/cone';

/**
 * Oracle independen (PRD §11.5, §16.3): TIDAK memakai rumus pembahasan.
 * Soal 24: X dari koordinat (rumus tali sepatu), Y dari integral numerik Simpson.
 * Soal 25: evaluasi numerik fungsi soal di x = 3 ± h.
 */

// ---------- soal 24 ----------
function areaTriangle(r: number, thetaDeg: number): number {
  const half = (thetaDeg * Math.PI) / 360;
  const h = thetaDeg >= 180 ? 0 : r / Math.tan(half);
  const P = [
    [-r, 0],
    [r, 0],
    [0, -h],
  ] as const;
  let s = 0;
  for (let i = 0; i < 3; i++) {
    const [x1, y1] = P[i]!;
    const [x2, y2] = P[(i + 1) % 3]!;
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}

function areaSemicircle(r: number, n = 2000): number {
  const f = (x: number): number => Math.sqrt(Math.max(0, r * r - x * x));
  const a = -r;
  const hh = (2 * r) / n;
  let s = f(a) + f(r);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * hh);
  return (s * hh) / 3;
}

const XY = (r: number, deg: number): number => areaTriangle(r, deg) / areaSemicircle(r);

describe('oracle soal 24', () => {
  it('rasio koordinat+integral sama dengan HUD visual pada banyak sudut dan jari-jari', () => {
    for (const deg of [30, 45, 60, 90, 120, 150, 179])
      for (const r of [1, 2.5, 5]) expect(XY(r, deg)).toBeCloseTo(ratio(deg), 3);
  });

  it('menilai kelima pernyataan secara numerik dan cocok dengan kunci', () => {
    const lim = (aDeg: number): number => (XY(3, aDeg - 0.01) + XY(3, aDeg + 0.01)) / 2;
    const s1 = Math.abs(XY(1, 60) - XY(5, 60)) > 1e-6; // jari-jari berpengaruh?
    const s2 = Math.abs(lim(60) - lim(120)) < 1e-6; // sudut tidak berpengaruh?
    const s3 = Math.abs(XY(3, 40) - XY(3, 140)) < 1e-6; // selalu sama?
    const s4 = Math.abs(lim(30) - 2 / Math.PI) < 1e-3; // limit di π/6 = 2/π ?
    const s5 = Math.abs(XY(3, 180)) < 1e-9; // θ = π → 0 ?
    expect([s1, s2, s3, s4, s5]).toEqual(q24.key.cardOk);
    expect(lim(30)).toBeCloseTo(2.38, 2);
  });
});

// ---------- soal 25 ----------
const f25 = (x: number): number => (1 - Math.cos(6 * x - 18)) / ((x - 9 / x) * Math.sin(6 * x - 18));

describe('oracle soal 25', () => {
  it('limit numerik di x → 3 adalah 3/2 = pilihan E', () => {
    for (const h of [1e-3, 1e-4]) {
      expect(f25(3 - h)).toBeCloseTo(1.5, 2);
      expect(f25(3 + h)).toBeCloseTo(1.5, 2);
    }
    const options: Record<string, number> = { A: -1.5, B: -2 / 3, C: 0, D: 2 / 3, E: 1.5 };
    const v = (f25(3 - 1e-4) + f25(3 + 1e-4)) / 2;
    const match = Object.entries(options)
      .filter(([, x]) => Math.abs(x - v) < 1e-3)
      .map(([k]) => k);
    expect(match).toEqual([q25.key.answer]);
  });

  it('angka tabel opsional (Pemeriksaan hasil dokumen) sesuai fungsi', () => {
    expect(f25(2.999)).toBeCloseTo(1.4998, 3);
    expect(f25(3.001)).toBeCloseTo(1.5003, 3);
  });
});
