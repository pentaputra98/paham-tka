/**
 * Bank soal tes penguasaan (revisi pemilik v1.24): 7 materi × 3 cetakan soal. Tiap cetakan membuat soal
 * baru dari benih (angka berbeda setiap percobaan) dengan tingkat sedikit di bawah soal TKA 2025 yang
 * materinya sama. Pengecoh diambil dari kesalahan umum siswa. Kebenaran kunci diperiksa oracle
 * independen di tests/unit/tes-bank.test.ts (1.000 benih per cetakan).
 */
import { int, mulberry32, pick, type Rng } from '../core/prng';
import { MATERI, type Kind, type Materi, type TesItem } from './types';

// ---------------------------------------------------------------------------------------------
// format LaTeX
// ---------------------------------------------------------------------------------------------
const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

/** Pecahan sederhana; penyebut negatif dipindah ke depan. */
export function frac(n: number, d: number): string {
  if (d < 0) [n, d] = [-n, -d];
  const g = gcd(n, d);
  n /= g;
  d /= g;
  if (d === 1) return String(n);
  return `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`;
}

/** Jumlah suku [koefisien, monomial]; koefisien 1 disembunyikan kecuali suku tetap. */
export function terms(list: Array<[number, string]>): string {
  let out = '';
  for (const [c, mono] of list) {
    if (c === 0) continue;
    const abs = Math.abs(c);
    const coef = mono && abs === 1 ? '' : String(abs);
    out += `${c < 0 ? '-' : out ? '+' : ''}${coef}${mono}`;
  }
  return out || '0';
}

/** Suku banyak dari koefisien pangkat tertinggi ke terendah. */
function poly(cs: number[], v: string): string {
  const deg = cs.length - 1;
  return terms(
    cs.map((c, i): [number, string] => [c, deg - i === 0 ? '' : deg - i === 1 ? v : `${v}^${deg - i}`]),
  );
}

/** x − a dengan tanda yang rapi: x−3, x+3, x. */
export const lin = (v: string, a: number): string => (a === 0 ? v : a > 0 ? `${v}-${a}` : `${v}+${-a}`);
export const sq = (v: string, a: number): string => (a === 0 ? `${v}^2` : `(${lin(v, a)})^2`);
export const pt = (...c: number[]): string => `(${c.join(',\\,')})`;
const colv = (...c: Array<number | string>): string => `\\begin{pmatrix} ${c.join(' \\\\ ')} \\end{pmatrix}`;
const mat2 = (a: number, b: number, c: number, d: number): string =>
  `\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}`;
/** suku bertanda untuk baris hitungan: + 5 / − 5 */
const sg = (n: number): string => (n < 0 ? `-${-n}` : `+${n}`);
/** (−3) dalam kurung bila negatif */
const par = (n: number): string => (n < 0 ? `(${n})` : String(n));

/** Ribuan bertitik: 324000 → 324.000. */
const thousands = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/** Ribu rupiah → "Rp324.000". */
const rp = (ribu: number): string => `Rp${thousands(ribu * 1000)}`;

/** Bilangan dalam perseratus → "62,8" (teks) atau "62{,}8" (rumus). */
function hund(h: number, math = false): string {
  const neg = h < 0;
  const a = Math.abs(h);
  const int = thousands(Math.floor(a / 100));
  const fr = String(a % 100)
    .padStart(2, '0')
    .replace(/0+$/, '');
  return `${neg ? '-' : ''}${int}${fr ? (math ? '{,}' : ',') + fr : ''}`;
}

/** Bilangan dalam perseribu → "0{,}05" untuk koefisien rumus. */
function milli(m: number): string {
  const int = Math.floor(m / 1000);
  const fr = String(m % 1000)
    .padStart(3, '0')
    .replace(/0+$/, '');
  return `${int}${fr ? `{,}${fr}` : ''}`;
}

/** Suku dengan koefisien perseribu (1000 = 1, disembunyikan). */
function milliTerms(list: Array<[number, string]>): string {
  return list.map(([m, mono], i) => `${i ? '+' : ''}${m === 1000 ? '' : milli(m)}${mono}`).join('');
}

const math = (t: string): string => `$${t}$`;

// ---------------------------------------------------------------------------------------------
// pilihan
// ---------------------------------------------------------------------------------------------
interface Cand {
  /** HTML pilihan (dengan $…$) */
  t: string;
  /** nilai untuk mengurutkan pilihan angka */
  v?: number;
}

function shuffle<T>(rng: Rng, a: T[]): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

/** Empat pengecoh pertama yang berbeda dari kunci dan satu sama lain (teks dan nilainya). */
function distinct(correct: Cand, cands: Cand[], n = 4): Cand[] {
  const seen = new Set([correct.t]);
  const seenV = new Set<number>(correct.v === undefined ? [] : [correct.v]);
  const out: Cand[] = [];
  for (const c of cands) {
    if (out.length >= n) break;
    if (seen.has(c.t) || (c.v !== undefined && seenV.has(c.v))) continue;
    seen.add(c.t);
    if (c.v !== undefined) seenV.add(c.v);
    out.push(c);
  }
  if (out.length < n) throw new Error('pengecoh kurang');
  return out;
}

/** Pilihan ganda: kunci + 4 pengecoh; diurutkan menurut nilai (pilihan angka) atau diacak. */
function single(
  rng: Rng,
  correct: Cand,
  cands: Cand[],
  byValue = false,
): { options: string[]; ok: boolean[] } {
  const all = [{ ...correct, ok: true }, ...distinct(correct, cands).map((c) => ({ ...c, ok: false }))];
  const ord = byValue ? all.sort((a, b) => a.v! - b.v!) : shuffle(rng, all);
  return { options: ord.map((o) => o.t), ok: ord.map((o) => o.ok) };
}

/** Angka di sekitar kunci untuk melengkapi pengecoh. */
const near = (v: number, f = (x: number): string => math(String(x))): Cand[] =>
  [1, -1, 2, -2, 3, -3, 4, 5].map((d) => ({ t: f(v + d), v: v + d }));
const numC = (v: number): Cand => ({ t: math(String(v)), v });
const fracC = (n: number, d: number): Cand => ({ t: math(frac(n, d)), v: n / d });

/** Tiga pernyataan Benar/Salah; tidak boleh semuanya sama. */
function truths(rng: Rng): [boolean, boolean, boolean] {
  const t: [boolean, boolean, boolean] = [rng() < 0.5, rng() < 0.5, rng() < 0.5];
  if (t[0] === t[1] && t[1] === t[2]) t[int(rng, 0, 2)] = !t[0];
  return t;
}

// ---------------------------------------------------------------------------------------------
// cetakan soal
// ---------------------------------------------------------------------------------------------
type Made = Pick<TesItem, 'paper' | 'options' | 'ok' | 'explain' | 'params'>;

interface Tpl {
  id: string;
  materi: Materi;
  kind: Kind;
  topic: string;
  make(rng: Rng): Made;
}

// ============================== MATRIKS (soal TKA 1–4) ==============================
const m1: Tpl = {
  id: 'm1',
  materi: 'matriks',
  kind: 'single',
  topic: 'Invers matriks 2×2',
  make(rng) {
    let [a, b, c, d] = [2, 1, 5, 3];
    for (let i = 0; i < 400; i++) {
      const A = int(rng, 2, 5);
      const D = int(rng, 2, 5);
      const B = int(rng, 1, 4);
      if (A === D || (A * D - 1) % B) continue;
      const C = (A * D - 1) / B;
      if (C < 1 || C > 9 || C === B) continue;
      [a, b, c, d] = [A, B, C, D];
      break;
    }
    if (rng() < 0.5) [b, c] = [-b, -c];
    const inv = mat2(d, -b, -c, a);
    const { options, ok } = single(rng, { t: math(inv) }, [
      { t: math(mat2(d, b, c, a)) },
      { t: math(mat2(a, -b, -c, d)) },
      { t: math(mat2(-d, b, c, -a)) },
      { t: math(mat2(d, -c, -b, a)) },
      { t: math(mat2(a, c, b, d)) },
    ]);
    return {
      paper: `<p>Diketahui matriks $$A=${mat2(a, b, c, d)}.$$ Invers matriks $A$ adalah ....</p>`,
      options,
      ok,
      explain: `$\\det A=${a}\\cdot ${d}-${par(b)}\\cdot ${par(c)}=1$. Tukar letak ${a} dan ${d}, ubah tanda ${b} dan ${c}, lalu kalikan $\\frac{1}{\\det A}=1$: $A^{-1}=${inv}$.`,
      params: { a, b, c, d },
    };
  },
};

const m2: Tpl = {
  id: 'm2',
  materi: 'matriks',
  kind: 'single',
  topic: 'Sistem persamaan dengan matriks',
  make(rng) {
    let [a, b, c, d, D] = [2, 1, 1, 3, 5];
    for (let i = 0; i < 100; i++) {
      [a, b, c, d] = [int(rng, 1, 5), int(rng, 1, 5), int(rng, 1, 5), int(rng, 1, 5)];
      D = a * d - b * c;
      if (D !== 0) break;
    }
    if (D === 0) [a, b, c, d, D] = [2, 1, 1, 3, 5];
    const x = int(rng, 2, 9);
    let y = int(rng, 1, 6);
    if (y === x) y = x === 6 ? 5 : 6;
    const p = a * x + b * y;
    const q = c * x + d * y;
    const pair = (u: number, w: number): Cand => ({ t: `${rp(u)} dan ${rp(w)}` });
    const cands = [
      pair(y, x),
      pair(x + 1, y - 1),
      pair(x - 1, y + 1),
      pair(x + 1, y),
      pair(x, y + 1),
      pair(x - 1, y),
    ];
    const { options, ok } = single(
      rng,
      pair(x, y),
      cands.filter((cd) => !/Rp0|Rp-/.test(cd.t)),
    );
    return {
      paper: `<p>Harga $${a}$ buku dan $${b}$ pensil adalah ${rp(p)}, sedangkan harga $${c}$ buku dan $${d}$ pensil adalah ${rp(q)}. Jika harga satu buku $x$ ribu rupiah dan satu pensil $y$ ribu rupiah, maka $$${mat2(a, b, c, d)}${colv('x', 'y')}=${colv(p, q)}.$$ Harga satu buku dan satu pensil berturut-turut adalah ....</p>`,
      options,
      ok,
      explain: `$\\det=${a}\\cdot ${d}-${b}\\cdot ${c}=${D}$, maka $${colv('x', 'y')}=${frac(1, D)}${mat2(d, -b, -c, a)}${colv(p, q)}=${frac(1, D)}${colv(d * p - b * q, a * q - c * p)}=${colv(x, y)}$. Buku ${rp(x)}, pensil ${rp(y)}.`,
      params: { a, b, c, d, p, q, x, y },
    };
  },
};

const m3: Tpl = {
  id: 'm3',
  materi: 'matriks',
  kind: 'tf',
  topic: 'Perkalian matriks dalam masalah sehari-hari',
  make(rng) {
    let [n11, n12, n21, n22] = [20, 15, 18, 25];
    const h1 = pick(rng, [8, 10, 12, 15]);
    const h2 = pick(rng, [3, 4, 5]);
    for (let i = 0; i < 100; i++) {
      [n11, n12, n21, n22] = [int(rng, 10, 30), int(rng, 10, 30), int(rng, 10, 30), int(rng, 10, 30)];
      if (n11 !== n12 && n11 * h1 + n12 * h2 !== n21 * h1 + n22 * h2) break;
    }
    const RA = n11 * h1 + n12 * h2;
    const RB = n21 * h1 + n22 * h2;
    const total = RA + RB;
    // pernyataan 2: kebenarannya ditentukan perbandingan; arah kalimat diundi
    const aBig = rng() < 0.5;
    const t = truths(rng);
    t[1] = aBig ? RA > RB : RB > RA;
    if (t[0] === t[1] && t[1] === t[2]) t[rng() < 0.5 ? 0 : 2] = !t[1];
    const ra = t[0] ? RA : n11 * h2 + n12 * h1;
    const T = t[2] ? Math.floor((total - 1) / 100) * 100 : Math.ceil(total / 100) * 100;
    const options = [
      `Pendapatan kantin A dalam sehari adalah ${rp(ra)}.`,
      aBig
        ? 'Pendapatan kantin A lebih besar daripada pendapatan kantin B.'
        : 'Pendapatan kantin B lebih besar daripada pendapatan kantin A.',
      `Total pendapatan kedua kantin dalam sehari lebih dari ${rp(T)}.`,
    ];
    return {
      paper: `<p>Kantin A dan kantin B menjual nasi goreng dan es teh. Banyak porsi yang terjual dalam sehari dinyatakan oleh matriks $Q$ (baris: kantin A, kantin B; kolom: nasi goreng, es teh), sedangkan harga per porsi dalam ribu rupiah dinyatakan oleh matriks $H$. $$Q=${mat2(n11, n12, n21, n22)},\\quad H=${colv(h1, h2)}$$ Pendapatan kedua kantin dihitung dengan $QH$.</p>`,
      options,
      ok: [...t],
      explain: `$QH=${colv(`${n11}\\cdot ${h1}+${n12}\\cdot ${h2}`, `${n21}\\cdot ${h1}+${n22}\\cdot ${h2}`)}=${colv(RA, RB)}$. Pendapatan kantin A ${rp(RA)}, kantin B ${rp(RB)}, total ${rp(total)}.`,
      params: { n11, n12, n21, n22, h1, h2, ra, aBig, T },
    };
  },
};

// ============================== POLINOMIAL (soal TKA 5–8) ==============================
const p1: Tpl = {
  id: 'p1',
  materi: 'polinom',
  kind: 'single',
  topic: 'Teorema sisa',
  make(rng) {
    const k = pick(rng, [-3, -2, 2, 3]);
    const nz = (a: number, b: number): number => {
      const v = int(rng, a, b);
      return v === 0 ? b : v;
    };
    const b = nz(-5, 5);
    const c = nz(-5, 5);
    const d = nz(-9, 9);
    const f = (x: number): number => x ** 3 + b * x * x + c * x + d;
    const v = f(k);
    const { options, ok } = single(
      rng,
      numC(v),
      [numC(f(-k)), numC(d), numC(v - d), numC(f(1)), ...near(v)],
      true,
    );
    return {
      paper: `<p>Sisa pembagian suku banyak $f(x)=${poly([1, b, c, d], 'x')}$ oleh $(${lin('x', k)})$ adalah ....</p>`,
      options,
      ok,
      explain: `Teorema sisa: sisa pembagian oleh $(${lin('x', k)})$ adalah $f(${k})$. $f(${k})=${k ** 3}${sg(b * k * k)}${sg(c * k)}${sg(d)}=${v}$.`,
      params: { b, c, d, k },
    };
  },
};

const p2: Tpl = {
  id: 'p2',
  materi: 'polinom',
  kind: 'multi',
  topic: 'Faktor dan titik potong sumbu X',
  make(rng) {
    const roots = shuffle(rng, [-4, -3, -2, -1, 1, 2, 3, 4]).slice(0, 3);
    const [r1, r2, r3] = roots as [number, number, number];
    const s1 = r1 + r2 + r3;
    const s2 = r1 * r2 + r1 * r3 + r2 * r3;
    const s3 = r1 * r2 * r3;
    const known = r1;
    const cands: Array<[number, number]> = [
      ...roots.filter((r) => !roots.includes(-r)).map((r): [number, number] => [-r, 0]),
      [0, -s3],
    ];
    const extras = shuffle(rng, cands).slice(0, 2);
    const pts = [
      ...roots.map((r): [number, number, boolean] => [r, 0, true]),
      ...extras.map(([x, y]): [number, number, boolean] => [x, y, false]),
    ];
    // pengecoh tambahan bila akar negatifnya sudah akar semua (mis. 1, −1, 2, −2)
    for (let x = -5; pts.length < 5; x++) if (!pts.some((p) => p[0] === x)) pts.push([x, 0, false]);
    pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const [o1, o2] = [r2, r3];
    const hasY = pts.some((p) => p[0] === 0);
    return {
      paper: `<p>Diketahui $(${lin('x', known)})$ adalah salah satu faktor dari $$f(x)=${poly([1, -s1, s2, -s3], 'x')}.$$ Titik potong grafik $y=f(x)$ dengan sumbu $X$ adalah ....</p>`,
      options: pts.map((p) => math(pt(p[0], p[1]))),
      ok: pts.map((p) => p[2]),
      explain: `Bagi $f(x)$ dengan $(${lin('x', known)})$: hasilnya $${poly([1, -(o1 + o2), o1 * o2], 'x')}=(${lin('x', o1)})(${lin('x', o2)})$. Jadi $f(x)=(${lin('x', r1)})(${lin('x', o1)})(${lin('x', o2)})$ dan grafik memotong sumbu $X$ di $x=${[...roots].sort((p, q) => p - q).join(',\\ ')}$.${hasY ? ` Titik $${pt(0, -s3)}$ adalah titik potong dengan sumbu $Y$.` : ''}`,
      params: { roots, s1, s2, s3, pts },
    };
  },
};

const p3: Tpl = {
  id: 'p3',
  materi: 'polinom',
  kind: 'single',
  topic: 'Perkalian suku banyak dengan konstanta',
  make(rng) {
    const a = pick(rng, [20, 40, 50]);
    const b = pick(rng, [200, 300, 400, 600]);
    const c = pick(rng, [12000, 15000, 20000, 25000]);
    const n = pick(rng, [5, 10, 20]);
    const f = (x: number, y: number, z: number): Cand => ({
      t: math(
        milliTerms([
          [x, 'T^3'],
          [y, 'T^2'],
          [z, 'T'],
        ]),
      ),
    });
    const { options, ok } = single(rng, f(n * a, n * b, n * c), [
      f(10 * n * a, n * b, n * c),
      f(n * a, b, n * c),
      f(a, n * b, n * c),
      f(n * a, n * b, c),
      f(10 * n * a, 10 * n * b, n * c),
      f(n * a, 10 * n * b, n * c),
    ]);
    return {
      paper: `<p>Penambahan volume sebuah tangki logam ketika dipanaskan dinyatakan oleh $$V(T)=${milliTerms([
        [a, 'T^3'],
        [b, 'T^2'],
        [c, 'T'],
      ])}$$ dengan $T$ suhu dalam $^\\circ\\text{C}$ dan $V(T)$ dalam liter. Total penambahan volume ${n} tangki sejenis pada suhu yang sama adalah ....</p>`,
      options,
      ok,
      explain: `Total untuk ${n} tangki adalah $${n}\\cdot V(T)$: setiap suku dikalikan ${n}. $${n}\\cdot ${milli(a)}=${milli(n * a)}$, $${n}\\cdot ${milli(b)}=${milli(n * b)}$, $${n}\\cdot ${milli(c)}=${milli(n * c)}$.`,
      params: { a, b, c, n },
    };
  },
};

// ============================== FUNGSI (soal TKA 9–11) ==============================
const f1: Tpl = {
  id: 'f1',
  materi: 'fungsi',
  kind: 'single',
  topic: 'Nilai fungsi eksponen',
  make(rng) {
    const a = int(rng, 2, 6);
    const p = int(rng, 2, 6);
    const k = int(rng, 2, 4);
    const t = k * p;
    const v = a * 2 ** k;
    const { options, ok } = single(
      rng,
      numC(v),
      [
        numC(2 * a * k),
        numC(a * 2 ** (k + 1)),
        numC(a * 2 ** (k - 1)),
        numC(2 ** k),
        numC(a * k),
        ...near(v),
      ],
      true,
    );
    return {
      paper: `<p>Banyak bakteri dalam suatu biakan dimodelkan oleh $$B(t)=${a}\\cdot 2^{\\frac{t}{${p}}}$$ dengan $t$ dalam jam dan $B(t)$ dalam ribu bakteri. Banyak bakteri pada saat $t=${t}$ adalah ... ribu.</p>`,
      options,
      ok,
      explain: `$B(${t})=${a}\\cdot 2^{\\frac{${t}}{${p}}}=${a}\\cdot 2^{${k}}=${a}\\cdot ${2 ** k}=${v}$. Setiap ${p} jam banyaknya menjadi 2 kali lipat, bukan bertambah tetap.`,
      params: { a, p, t },
    };
  },
};

const f2: Tpl = {
  id: 'f2',
  materi: 'fungsi',
  kind: 'tf',
  topic: 'Interpretasi model eksponen',
  make(rng) {
    const m = pick(rng, [2, 3]);
    const a = int(rng, 2, 5);
    const p = pick(
      rng,
      [2, 3, 4, 5, 6].filter((x) => x !== m),
    );
    const j = m === 2 ? 3 : 2;
    const t = truths(rng);
    const options = [
      `Setiap ${p} tahun, populasi menjadi ${t[0] ? m : p} kali lipat.`,
      `Populasi awal (saat $t=0$) adalah ${t[1] ? a : a * m} ribu ekor.`,
      `Pada tahun ke-${j * p}, populasi mencapai ${t[2] ? a * m ** j : a * m * j} ribu ekor.`,
    ];
    return {
      paper: `<p>Populasi rusa di suatu taman nasional dimodelkan oleh $$P(t)=${a}\\cdot ${m}^{\\frac{t}{${p}}}$$ dengan $t$ dalam tahun dan $P(t)$ dalam ribu ekor.</p>`,
      options,
      ok: [...t],
      explain: `$P(0)=${a}\\cdot ${m}^0=${a}$. Setiap $t$ bertambah ${p}, pangkatnya bertambah 1, jadi populasi dikali ${m}. $P(${j * p})=${a}\\cdot ${m}^{${j}}=${a * m ** j}$.`,
      params: { a, m, p, j, t },
    };
  },
};

const f3: Tpl = {
  id: 'f3',
  materi: 'fungsi',
  kind: 'single',
  topic: 'Model fungsi trigonometri',
  make(rng) {
    const a = int(rng, 8, 14);
    const b = int(rng, 1, 4);
    const mode = pick(rng, ['t', 't', 'max', 'min'] as const);
    const t = pick(rng, [3, 6, 9]);
    const cosv = mode === 't' ? (t === 6 ? -1 : 0) : mode === 'max' ? 1 : -1;
    const v = a + b * cosv;
    const ang: Record<number, string> = { 3: '\\frac{\\pi}{2}', 6: '\\pi', 9: '\\frac{3\\pi}{2}' };
    const ask =
      mode === 't'
        ? `Ketinggian air pada pukul 0${t}.00 adalah ... meter.`
        : `Ketinggian air ${mode === 'max' ? 'tertinggi' : 'terendah'} adalah ... meter.`;
    const cands = [a + b, a - b, a, b, a + 2 * b, a - 2 * b, 2 * b].map(numC);
    const { options, ok } = single(rng, numC(v), [...cands, ...near(v)], true);
    const explain =
      mode === 't'
        ? `$h(${t})=${a}+${b}\\cos\\left(${ang[t]}\\right)=${a}+${b}\\cdot (${cosv})=${v}$.`
        : `Nilai $\\cos$ paling ${mode === 'max' ? 'besar $1$' : 'kecil $-1$'}, jadi ketinggian ${mode === 'max' ? 'tertinggi' : 'terendah'} $${a}${mode === 'max' ? '+' : '-'}${b}=${v}$ meter.`;
    return {
      paper: `<p>Ketinggian air laut di sebuah dermaga dimodelkan oleh $$h(t)=${a}+${b}\\cos\\left(\\frac{\\pi}{6}t\\right)$$ dengan $t$ dalam jam setelah pukul 00.00 dan $h(t)$ dalam meter. ${ask}</p>`,
      options,
      ok,
      explain,
      params: { a, b, mode, t },
    };
  },
};

// ============================== LINGKARAN (soal TKA 15–18) ==============================
const rootTex = (n: number): { t: string; v: number } => {
  const s = Math.round(Math.sqrt(n));
  return s * s === n ? { t: String(s), v: s } : { t: `\\sqrt{${n}}`, v: Math.sqrt(n) };
};

const l1: Tpl = {
  id: 'l1',
  materi: 'lingkaran',
  kind: 'single',
  topic: 'Pusat dan jari-jari dari bentuk umum',
  make(rng) {
    let p = 0;
    let q = 0;
    while (p === q || p === 0 || q === 0) [p, q] = [int(rng, -5, 5), int(rng, -5, 5)];
    const r = int(rng, 2, 6);
    const C = p * p + q * q - r * r;
    const eq = `${terms([
      [1, 'x^2'],
      [1, 'y^2'],
      [-2 * p, 'x'],
      [-2 * q, 'y'],
      [C, ''],
    ])}=0`;
    const o = (x: number, y: number, rad: string): Cand => ({ t: `pusat $${pt(x, y)}$, jari-jari $${rad}$` });
    const wrongR = p * p + q * q + C;
    const cands = [
      o(-p, -q, String(r)),
      o(p, q, String(r * r)),
      o(q, p, String(r)),
      o(-p, -q, String(r * r)),
      o(-2 * p, -2 * q, String(r)),
      ...(wrongR > 0 && wrongR !== r * r ? [o(p, q, rootTex(wrongR).t)] : []),
    ];
    const { options, ok } = single(rng, o(p, q, String(r)), cands);
    return {
      paper: `<p>Pusat dan jari-jari lingkaran $$${eq}$$ adalah ....</p>`,
      options,
      ok,
      explain: `Untuk $x^2+y^2+Ax+By+C=0$: pusat $\\left(-\\frac{A}{2},-\\frac{B}{2}\\right)=${pt(p, q)}$ dan $r=\\sqrt{${par(p)}^2+${par(q)}^2-${par(C)}}=\\sqrt{${r * r}}=${r}$.`,
      params: { p, q, r, C },
    };
  },
};

const l2: Tpl = {
  id: 'l2',
  materi: 'lingkaran',
  kind: 'single',
  topic: 'Persamaan lingkaran dari pusat dan satu titik',
  make(rng) {
    let a = 0;
    let b = 0;
    while (a === 0 || b === 0 || a === b) [a, b] = [int(rng, -4, 4), int(rng, -4, 4)];
    const [dx0, dy0] = pick(rng, [
      [3, 4],
      [4, 3],
      [0, 3],
      [4, 0],
      [0, 5],
      [5, 0],
      [2, 0],
      [0, 2],
    ] as Array<[number, number]>);
    const dx = rng() < 0.5 ? -dx0 : dx0;
    const dy = rng() < 0.5 ? -dy0 : dy0;
    const r = Math.hypot(dx, dy);
    const [px, py] = [a + dx, b + dy];
    const e = (h: number, k: number, rhs: number): Cand => ({
      t: math(`${sq('x', h)}+${sq('y', k)}=${rhs}`),
    });
    const correct = e(a, b, r * r);
    const { options, ok } = single(rng, correct, [
      e(-a, -b, r * r),
      e(a, b, r),
      e(-a, -b, r),
      e(px, py, r * r),
      e(b, a, r * r),
      e(a, b, 2 * r),
    ]);
    return {
      paper: `<p>Persamaan lingkaran yang berpusat di $${pt(a, b)}$ dan melalui titik $${pt(px, py)}$ adalah ....</p>`,
      options,
      ok,
      explain: `$r=\\sqrt{(${px}-${par(a)})^2+(${py}-${par(b)})^2}=\\sqrt{${dx * dx}+${dy * dy}}=${r}$. Bentuk baku $(x-a)^2+(y-b)^2=r^2$ menjadi $${sq('x', a)}+${sq('y', b)}=${r * r}$.`,
      params: { a, b, px, py },
    };
  },
};

const l3: Tpl = {
  id: 'l3',
  materi: 'lingkaran',
  kind: 'tf',
  topic: 'Keliling dan luas lingkaran',
  make(rng) {
    const sev = rng() < 0.5;
    const r = sev ? pick(rng, [7, 14, 21]) : pick(rng, [10, 20]);
    // semua nilai dalam perseratus agar pecahan 3,14 tepat
    const K = sev ? (4400 * r) / 7 : 628 * r;
    const L = sev ? (2200 * r * r) / 7 : 314 * r * r;
    const S = 400 * r * r;
    const t = truths(rng);
    const options = [
      `Keliling ornamen adalah ${hund(t[0] ? K : K / 2)} cm.`,
      `Luas ornamen adalah ${hund(t[1] ? L : 4 * L)} cm².`,
      `Luas bagian bingkai yang tidak tertutup ornamen adalah ${hund(t[2] ? S - L : S - K)} cm².`,
    ];
    const pi = sev ? '\\frac{22}{7}' : '3{,}14';
    return {
      paper: `<p>Sebuah ornamen kaca berbentuk lingkaran berjari-jari ${r} cm dipasang tepat di dalam bingkai persegi sehingga menyinggung keempat sisi bingkai. Gunakan $\\pi=${pi}$.</p>`,
      options,
      ok: [...t],
      explain: `Keliling $=2\\pi r=${hund(K, true)}$ cm dan luas $=\\pi r^2=${hund(L, true)}$ cm². Sisi bingkai $=2r=${2 * r}$ cm, jadi bagian yang tidak tertutup $=${2 * r}^2-${hund(L, true)}=${hund(S - L, true)}$ cm².`,
      params: { r, sev, t },
    };
  },
};

// ============================== TRANSFORMASI (soal TKA 19–21) ==============================
type P2 = [number, number];
const MIRRORS: Array<{ label: string; rule: string; f: (p: P2) => P2 }> = [
  { label: 'sumbu $X$', rule: '(x,-y)', f: ([x, y]) => [x, -y] },
  { label: 'sumbu $Y$', rule: '(-x,y)', f: ([x, y]) => [-x, y] },
  { label: 'garis $y=x$', rule: '(y,x)', f: ([x, y]) => [y, x] },
  { label: 'garis $y=-x$', rule: '(-y,-x)', f: ([x, y]) => [-y, -x] },
];

const t1: Tpl = {
  id: 't1',
  materi: 'transformasi',
  kind: 'single',
  topic: 'Translasi lalu pencerminan',
  make(rng) {
    const nz = (): number => {
      const v = int(rng, -5, 5);
      return v === 0 ? 2 : v;
    };
    const P: P2 = [nz(), nz()];
    const T: P2 = [int(rng, 1, 4) * (rng() < 0.5 ? -1 : 1), int(rng, 1, 4) * (rng() < 0.5 ? -1 : 1)];
    const mi = int(rng, 0, 3);
    const M = MIRRORS[mi]!;
    const Q: P2 = [P[0] + T[0], P[1] + T[1]];
    const R = M.f(Q);
    const c = (p: P2): Cand => ({ t: math(pt(p[0], p[1])) });
    const RP = M.f(P);
    const cands = [
      c([RP[0] + T[0], RP[1] + T[1]]),
      ...MIRRORS.filter((_, i) => i !== mi).map((m) => c(m.f(Q))),
      c(Q),
      c(M.f([P[0] - T[0], P[1] - T[1]])),
      c([R[0] + 1, R[1]]),
      c([R[0], R[1] - 1]),
    ];
    const { options, ok } = single(rng, c(R), cands);
    return {
      paper: `<p>Titik $A${pt(P[0], P[1])}$ ditranslasikan oleh $T=${colv(T[0], T[1])}$, kemudian dicerminkan terhadap ${M.label}. Koordinat bayangan akhir titik $A$ adalah ....</p>`,
      options,
      ok,
      explain: `Translasi dulu: $${pt(P[0], P[1])}\\to${pt(Q[0], Q[1])}$. Lalu pencerminan terhadap ${M.label}: $(x,y)\\to${M.rule}$, jadi $${pt(Q[0], Q[1])}\\to${pt(R[0], R[1])}$.`,
      params: { P, T, mi },
    };
  },
};

const t2: Tpl = {
  id: 't2',
  materi: 'transformasi',
  kind: 'single',
  topic: 'Dilatasi lingkaran',
  make(rng) {
    let a = 0;
    let b = 0;
    while (a === 0 || b === 0) [a, b] = [int(rng, -4, 4), int(rng, -4, 4)];
    const r = int(rng, 1, 4);
    const k = pick(rng, [2, 3]);
    const e = (h: number, kk: number, rhs: number): Cand => ({
      t: math(`${sq('x', h)}+${sq('y', kk)}=${rhs}`),
    });
    const R2 = (k * r) ** 2;
    const { options, ok } = single(rng, e(k * a, k * b, R2), [
      e(k * a, k * b, r * r),
      e(k * a, k * b, k * r * r),
      e(a, b, R2),
      e(-k * a, -k * b, R2),
      e(k * a, k * b, k * r),
      e(a + k, b + k, R2),
    ]);
    return {
      paper: `<p>Lingkaran $L: ${sq('x', a)}+${sq('y', b)}=${r * r}$ didilatasi dengan pusat $O(0,0)$ dan faktor skala $${k}$. Persamaan bayangan lingkaran $L$ adalah ....</p>`,
      options,
      ok,
      explain: `Dilatasi $[O,${k}]$: $(x,y)\\to(${k}x,${k}y)$. Pusat $${pt(a, b)}\\to${pt(k * a, k * b)}$ dan jari-jari $${r}\\to${k * r}$, jadi bayangannya $${sq('x', k * a)}+${sq('y', k * b)}=${R2}$.`,
      params: { a, b, r, k },
    };
  },
};

const t3: Tpl = {
  id: 't3',
  materi: 'transformasi',
  kind: 'multi',
  topic: 'Rotasi garis 90°',
  make(rng) {
    const m = pick(rng, [-2, -1, 1, 2]);
    const c = pick(rng, [-3, -2, -1, 1, 2, 3]);
    const onImage = ([x, y]: P2): boolean => -x === m * y + c;
    const ts = shuffle(rng, [-2, -1, 0, 1, 2]);
    const nOk = rng() < 0.5 ? 2 : 3;
    const pts: Array<[number, number, boolean]> = [];
    const add = (p: P2): void => {
      if (Math.abs(p[0]) > 9 || Math.abs(p[1]) > 9 || pts.some((q) => q[0] === p[0] && q[1] === p[1])) return;
      pts.push([p[0], p[1], onImage(p)]);
    };
    for (const t of ts) {
      if (pts.filter((p) => p[2]).length >= nOk) break;
      add([-(m * t + c), t]);
    }
    // pengecoh: rotasi searah jarum jam, titik asal pada g, pencerminan
    const wrong: P2[] = [];
    for (const t of ts) wrong.push([m * t + c, -t], [t, m * t + c], [t, -(m * t + c)]);
    for (const w of shuffle(rng, wrong)) {
      if (pts.length >= 5) break;
      if (!onImage(w)) add(w);
    }
    pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const t0 = ts[0]!;
    return {
      paper: `<p>Garis $g: y=${poly([m, c], 'x')}$ dirotasi sejauh $90^\\circ$ berlawanan arah jarum jam dengan pusat $O(0,0)$. Titik mana saja yang terletak pada bayangan garis $g$?</p>`,
      options: pts.map((p) => math(pt(p[0], p[1]))),
      ok: pts.map((p) => p[2]),
      explain: `Rotasi $90^\\circ$ berlawanan arah jarum jam: $(x,y)\\to(-y,x)$. Contoh: titik $${pt(t0, m * t0 + c)}$ pada $g$ menjadi $${pt(-(m * t0 + c), t0)}$. Titik $(x,y)$ ada pada bayangan bila $(y,-x)$ ada pada $g$, yaitu $${terms(
        [
          [1, 'x'],
          [m, 'y'],
          [c, ''],
        ],
      )}=0$.`,
      params: { m, c, pts },
    };
  },
};

// ============================== VEKTOR (soal TKA 12–14) ==============================
const QUADS: Array<[number, number, number, number]> = [
  [1, 2, 2, 3],
  [2, 3, 6, 7],
  [1, 4, 8, 9],
  [4, 4, 7, 9],
  [2, 6, 9, 11],
  [6, 6, 7, 11],
];

const signed = (rng: Rng, v: number[]): number[] => shuffle(rng, v).map((x) => (rng() < 0.5 ? -x : x));

const v1: Tpl = {
  id: 'v1',
  materi: 'vektor',
  kind: 'single',
  topic: 'Panjang vektor',
  make(rng) {
    const [a0, b0, c0, L] = pick(rng, QUADS);
    const [p, q, r] = signed(rng, [a0, b0, c0]) as [number, number, number];
    const two = rootTex(p * p + q * q);
    const { options, ok } = single(
      rng,
      numC(L),
      [
        numC(Math.abs(p) + Math.abs(q) + Math.abs(r)),
        numC(L * L),
        { t: math(two.t), v: two.v },
        { t: math(`\\sqrt{${L}}`), v: Math.sqrt(L) },
        ...near(L),
      ],
      true,
    );
    return {
      paper: `<p>Panjang vektor $$\\vec{u}=${colv(p, q, r)}$$ adalah ....</p>`,
      options,
      ok,
      explain: `$|\\vec{u}|=\\sqrt{${par(p)}^2+${par(q)}^2+${par(r)}^2}=\\sqrt{${p * p}+${q * q}+${r * r}}=\\sqrt{${L * L}}=${L}$.`,
      params: { p, q, r },
    };
  },
};

const v2: Tpl = {
  id: 'v2',
  materi: 'vektor',
  kind: 'single',
  topic: 'Vektor posisi dan titik ujung',
  make(rng) {
    const nz = (a: number, b: number): number => {
      const v = int(rng, a, b);
      return v === 0 ? b : v;
    };
    const A = [nz(-4, 4), nz(-4, 4), nz(-4, 4)] as const;
    const U = [nz(-5, 5), nz(-5, 5), nz(-5, 5)] as const;
    const B = [A[0] + U[0], A[1] + U[1], A[2] + U[2]] as const;
    const c = (v: readonly number[]): Cand => ({ t: math(pt(...v)) });
    const { options, ok } = single(rng, c(B), [
      c(A.map((x, i) => x - U[i]!)),
      c(U.map((u, i) => u - A[i]!)),
      c([A[0] - U[0], A[1] + U[1], A[2] + U[2]]),
      c(U),
      c([B[0], B[1], -B[2]]),
      c([B[1], B[0], B[2]]),
    ]);
    return {
      paper: `<p>Diketahui titik $A${pt(...A)}$ dan $\\vec{AB}=${colv(...U)}$. Koordinat titik $B$ adalah ....</p>`,
      options,
      ok,
      explain: `$\\vec{AB}=B-A$, jadi $B=A+\\vec{AB}=${pt(...A)}+${pt(...U)}=${pt(...B)}$.`,
      params: { A: [...A], U: [...U] },
    };
  },
};

/** selisih koordinat dan kuadrat panjangnya (bulat dan tidak bulat) untuk soal jarak */
const DIFFS: Array<[number, number, number]> = [
  [1, 2, 2],
  [2, 3, 6],
  [1, 1, 1],
  [2, 2, 2],
  [3, 3, 3],
  [4, 4, 2],
  [3, 4, 0],
  [1, 2, 3],
  [3, 5, 4],
  [4, 0, 3],
  [5, 5, 5],
  [4, 4, 7],
  [2, 4, 5],
  [1, 4, 8],
];

const v3: Tpl = {
  id: 'v3',
  materi: 'vektor',
  kind: 'multi',
  topic: 'Jarak dua titik di ruang',
  make(rng) {
    const d = pick(rng, [5, 6, 7]);
    const n2 = (v: number[]): number => v.reduce((s, x) => s + x * x, 0);
    const lt = shuffle(
      rng,
      DIFFS.filter((v) => n2(v) < d * d),
    );
    const ge = shuffle(
      rng,
      DIFFS.filter((v) => n2(v) >= d * d),
    );
    const nOk = rng() < 0.5 ? 2 : 3;
    const chosen = [...lt.slice(0, nOk), ...ge.slice(0, 5 - nOk)];
    const pairs = chosen.map((v) => {
      const P = [int(rng, -3, 5), int(rng, -3, 5), int(rng, -3, 5)];
      const s = signed(rng, v);
      return { P, Q: P.map((x, i) => x + s[i]!), s2: n2(v) };
    });
    const order = shuffle(rng, pairs);
    return {
      paper: `<p>Pasangan titik mana saja yang jaraknya kurang dari ${d} satuan?</p>`,
      options: order.map((o) => `$${pt(...o.P)}$ dan $${pt(...o.Q)}$`),
      ok: order.map((o) => o.s2 < d * d),
      explain: `Jarak $=\\sqrt{\\Delta x^2+\\Delta y^2+\\Delta z^2}$ dan kurang dari ${d} berarti jumlah kuadrat selisihnya kurang dari $${d}^2=${d * d}$. Jumlah kuadratnya berturut-turut ${order.map((o) => `$${o.s2}$`).join(', ')}.`,
      params: { d, pairs: order.map((o) => [o.P, o.Q]) },
    };
  },
};

// ============================== LIMIT (soal TKA 22–25) ==============================
const li1: Tpl = {
  id: 'li1',
  materi: 'limit',
  kind: 'single',
  topic: 'Limit bentuk 0/0 dengan pemfaktoran',
  make(rng) {
    const a = pick(rng, [-4, -3, -2, -1, 1, 2, 3, 4]);
    let b = int(rng, -5, 5);
    if (b === -a || b === 0) b = a > 0 ? a + 1 : a - 1;
    const v = a + b;
    const num = poly([1, b - a, -a * b], 'x');
    const { options, ok } = single(
      rng,
      numC(v),
      [numC(0), numC(a - b), numC(b), numC(2 * a), numC(a * b), ...near(v)],
      true,
    );
    return {
      paper: `<p>Nilai $$\\lim_{x\\to ${a}}\\frac{${num}}{${lin('x', a)}}$$ adalah ....</p>`,
      options,
      ok,
      explain: `Substitusi $x=${a}$ menghasilkan $\\frac{0}{0}$, jadi faktorkan: $${num}=(${lin('x', a)})(${lin('x', -b)})$. Setelah $(${lin('x', a)})$ dicoret, $\\lim_{x\\to ${a}}(${lin('x', -b)})=${v}$.`,
      params: { a, b },
    };
  },
};

const li2: Tpl = {
  id: 'li2',
  materi: 'limit',
  kind: 'single',
  topic: 'Limit di tak hingga',
  make(rng) {
    let p = int(rng, 1, 9);
    let s = int(rng, 1, 9);
    if (p === s) s = s === 9 ? 2 : s + 1;
    const q = int(rng, -9, 9);
    const r = int(rng, 1, 9);
    let t = int(rng, -9, 9);
    if (t === 0) t = 3;
    const u = int(rng, 1, 9);
    if (gcd(p, s) > 1 && rng() < 0.5) [p, s] = [p / gcd(p, s), s / gcd(p, s)];
    const { options, ok } = single(
      rng,
      fracC(p, s),
      [
        fracC(r, u),
        fracC(q, t),
        numC(0),
        { t: math('\\infty'), v: 1e9 },
        fracC(s, p),
        numC(1),
        fracC(p + q + r, s + t + u || 1),
        fracC(p + 1, s),
        fracC(p, s + 1),
      ],
      true,
    );
    return {
      paper: `<p>Nilai $$\\lim_{x\\to\\infty}\\frac{${poly([p, q, r], 'x')}}{${poly([s, t, u], 'x')}}$$ adalah ....</p>`,
      options,
      ok,
      explain: `Pangkat tertinggi pembilang dan penyebut sama-sama $x^2$. Bagi semua suku dengan $x^2$; suku lain mendekati $0$, jadi limitnya perbandingan koefisien $x^2$: $\\frac{${p}}{${s}}${frac(p, s) === `\\frac{${p}}{${s}}` ? '' : `=${frac(p, s)}`}$.`,
      params: { p, q, r, s, t, u },
    };
  },
};

const li3: Tpl = {
  id: 'li3',
  materi: 'limit',
  kind: 'single',
  topic: 'Limit fungsi trigonometri',
  make(rng) {
    const a = int(rng, 1, 9);
    let b = int(rng, 1, 9);
    if (b === a) b = a === 9 ? 2 : a + 1;
    const form = pick(rng, ['st', 'ts', 'sx', 'ss'] as const);
    const kx = (k: number): string => (k === 1 ? 'x' : `${k}x`);
    const fn: Record<typeof form, [string, string]> = {
      st: [`\\sin ${kx(a)}`, `\\tan ${kx(b)}`],
      ts: [`\\tan ${kx(a)}`, `\\sin ${kx(b)}`],
      sx: [`\\sin ${kx(a)}`, kx(b)],
      ss: [`\\sin ${kx(a)}`, `\\sin ${kx(b)}`],
    };
    const [top, bot] = fn[form];
    const { options, ok } = single(
      rng,
      fracC(a, b),
      [fracC(b, a), numC(a * b), numC(1), numC(0), fracC(a * a, b * b), fracC(a, 2 * b), fracC(a + 1, b)],
      true,
    );
    return {
      paper: `<p>Nilai $$\\lim_{x\\to 0}\\frac{${top}}{${bot}}$$ adalah ....</p>`,
      options,
      ok,
      explain: `Untuk $x\\to 0$, $\\sin kx$ dan $\\tan kx$ berperilaku seperti $kx$. Jadi limitnya $\\frac{${kx(a)}}{${kx(b)}}=\\frac{${a}}{${b}}${frac(a, b) === `\\frac{${a}}{${b}}` ? '' : `=${frac(a, b)}`}$.`,
      params: { a, b, form },
    };
  },
};

/** Tiga cetakan per materi, urutan materi sesuai MATERI. */
export const TEMPLATES: readonly Tpl[] = [
  m1,
  m2,
  m3,
  p1,
  p2,
  p3,
  f1,
  f2,
  f3,
  l1,
  l2,
  l3,
  t1,
  t2,
  t3,
  v1,
  v2,
  v3,
  li1,
  li2,
  li3,
];

/** Benih turunan per cetakan dan per percobaan ulang. */
const mix = (seed: number, i: number, k: number): number =>
  (Math.imul(seed ^ 0x5bd1e995, 0x2c1b3c6d) ^ Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(k + 1, 0x85ebca6b)) >>>
  0;

/** Satu soal dari cetakan ke-i (dicoba ulang dengan benih lain bila pengecoh tidak cukup). */
export function makeItem(seed: number, i: number): TesItem {
  const tpl = TEMPLATES[i]!;
  for (let k = 0; ; k++) {
    try {
      const made = tpl.make(mulberry32(mix(seed, i, k)));
      return { tid: tpl.id, materi: tpl.materi, kind: tpl.kind, topic: tpl.topic, ...made };
    } catch (e) {
      if (k > 30) throw e;
    }
  }
}

/** 21 soal tes dari satu benih, dikelompokkan menurut materi. */
export function makeTest(seed: number): TesItem[] {
  const items = TEMPLATES.map((_, i) => makeItem(seed, i));
  return MATERI.flatMap((m) => items.filter((it) => it.materi === m));
}
