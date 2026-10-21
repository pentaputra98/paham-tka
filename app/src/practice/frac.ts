/**
 * Pecahan eksak dan matriks 2×2 untuk generator dan oracle latihan (PRD §11.1 "valid mutlak").
 * Bilangan dijaga kecil (entri soal ≤ 5, penyebut ≤ 25), sehingga number biasa cukup tanpa bigint.
 */
export interface Q {
  n: number;
  d: number;
}
export type M2 = [[Q, Q], [Q, Q]];

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/** Pecahan ternormalisasi: penyebut positif, bentuk paling sederhana; 0 = 0/1. */
export function q(n: number, d = 1): Q {
  if (d === 0) throw new Error('penyebut nol');
  if (n === 0) return { n: 0, d: 1 };
  const g = gcd(n, d);
  const s = d < 0 ? -1 : 1;
  return { n: (s * n) / g, d: (s * d) / g };
}

export const add = (a: Q, b: Q): Q => q(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Q, b: Q): Q => q(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Q, b: Q): Q => q(a.n * b.n, a.d * b.d);
export const div = (a: Q, b: Q): Q => q(a.n * b.d, a.d * b.n);
export const neg = (a: Q): Q => q(-a.n, a.d);
export const inv = (a: Q): Q => q(a.d, a.n);
export const eq = (a: Q, b: Q): boolean => a.n === b.n && a.d === b.d;
export const isZero = (a: Q): boolean => a.n === 0;
export const isInt = (a: Q): boolean => a.d === 1;

/** LaTeX: bulat apa adanya, pecahan \frac dengan tanda di depan. */
export function qTex(a: Q): string {
  if (a.d === 1) return String(a.n);
  return `${a.n < 0 ? '-' : ''}\\frac{${Math.abs(a.n)}}{${a.d}}`;
}

/** LaTeX untuk faktor perkalian: bilangan negatif diberi kurung. */
export const qTexP = (a: Q): string => (a.n < 0 ? `\\left(${qTex(a)}\\right)` : qTex(a));

export const m2 = (a: Q, b: Q, c: Q, d: Q): M2 => [
  [a, b],
  [c, d],
];
export const mMap = (m: M2, f: (x: Q) => Q): M2 => m2(f(m[0][0]), f(m[0][1]), f(m[1][0]), f(m[1][1]));
export const mEq = (a: M2, b: M2): boolean =>
  eq(a[0][0], b[0][0]) && eq(a[0][1], b[0][1]) && eq(a[1][0], b[1][0]) && eq(a[1][1], b[1][1]);

/** Perkalian baris × kolom (dipakai oracle: F · X harus I). */
export function mMul(a: M2, b: M2): M2 {
  const cell = (i: 0 | 1, j: 0 | 1): Q => add(mul(a[i][0], b[0][j]), mul(a[i][1], b[1][j]));
  return m2(cell(0, 0), cell(0, 1), cell(1, 0), cell(1, 1));
}

export const I2: M2 = m2(q(1), q(0), q(0), q(1));

export const mTex = (m: M2): string =>
  `\\begin{pmatrix}${qTex(m[0][0])}&${qTex(m[0][1])}\\\\${qTex(m[1][0])}&${qTex(m[1][1])}\\end{pmatrix}`;

/** Entri terbesar (pembilang dan penyebut) untuk uji "bilangan bagus". */
export const mSize = (m: M2): number => Math.max(...m.flat().map((x) => Math.max(Math.abs(x.n), x.d)));
