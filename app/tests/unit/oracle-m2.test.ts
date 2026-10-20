import { describe, expect, it } from 'vitest';
import q01 from '../../src/content/soal/q01';
import q02 from '../../src/content/soal/q02';
import q05 from '../../src/content/soal/q05';
import q06 from '../../src/content/soal/q06';
import q17 from '../../src/content/soal/q17';
import q18 from '../../src/content/soal/q18';

/**
 * Oracle independen konten M2 (PRD §11.5, §16.3): TIDAK memakai rumus pembahasan.
 * Soal 1: setiap pilihan dikalikan dengan F; hanya yang menghasilkan I yang benar (tanpa rumus adjoin).
 * Soal 2: solusi dicari dengan mencoba semua bilangan cacah; tiap pilihan dihitung ulang perkaliannya.
 * Soal 5: akar dicari dengan bagi dua pada perubahan tanda di kisi; tiap pilihan diuji dengan f(x) = 0.
 * Soal 6: pembagian bersusun numerik untuk semua pasangan bulat (a, b); hanya satu yang bersisa 5x − 1.
 * Soal 17: luas tiap warna dihitung dengan mencacah titik pada kisi halus di atas rambu 40 × 40 cm.
 * Soal 18: lingkaran sebagai poligon 20.000 sisi; jari-jari dicari dengan bagi dua, bukan rumus.
 */

// ---------- soal 17 ----------
interface Areas {
  black: number;
  blue: number;
  red: number;
  white: number;
}

/** w = lebar lengan salib; clip = ujung lengan dipotong tepi cakram (sensitivitas dokumen). */
function signAreas(w: number, clip: boolean, n = 1600): Areas {
  const a: Areas = { black: 0, blue: 0, red: 0, white: 0 };
  const h = 40 / n;
  const cell = h * h;
  const hw = w / 2;
  for (let i = 0; i < n; i++) {
    const x = -20 + (i + 0.5) * h;
    for (let j = 0; j < n; j++) {
      const y = -20 + (j + 0.5) * h;
      const d = Math.hypot(x, y);
      const cross = (Math.abs(x) <= 14 && Math.abs(y) <= hw) || (Math.abs(x) <= hw && Math.abs(y) <= 14);
      if (d > 20) a.blue += cell;
      else if (d > 14) a.black += cell;
      else if (!cross) a.white += cell;
      // tanpa dipotong: sudut lengan di luar cakram tetap dihitung merah (model dokumen 28 × 8)
      if (cross && (d <= 14 || !clip)) a.red += cell;
    }
  }
  return a;
}

const verdicts = (a: Areas): boolean[] => [
  a.black / 2 + a.blue > a.black,
  a.black / 2 + a.red > a.black,
  a.black / 2 + a.white > a.black,
  a.blue + a.white > a.black,
  a.blue + a.red > a.black,
];

describe('oracle soal 17', () => {
  it('luas dari kisi sesuai ukuran gambar (40, 14, 10 + 8 + 10)', () => {
    const a = signAreas(8, false);
    expect(a.black).toBeCloseTo(204 * Math.PI, 0);
    expect(a.blue).toBeCloseTo(1600 - 400 * Math.PI, 0);
    expect(a.red).toBeCloseTo(384, 0);
  });

  it('stempel kelima pilihan cocok dengan kunci (tafsir: jumlah > hitam)', () => {
    expect(verdicts(signAreas(8, false))).toEqual(q17.key.cardOk);
    expect(q17.key.cardOk.flatMap((ok, i) => (ok ? [i + 1] : []))).toEqual([1, 2, 5]);
  });

  it('sensitivitas: salib dipotong cakram atau lengan 7,1 cm tidak mengubah stempel', () => {
    const clipped = signAreas(8, true);
    expect(clipped.red).toBeGreaterThan(370);
    expect(clipped.red).toBeLessThan(384);
    expect(verdicts(clipped)).toEqual(q17.key.cardOk);
    expect(verdicts(signAreas(7.1, true))).toEqual(q17.key.cardOk);
  });
});

// ---------- soal 18 ----------

/** Lingkaran didekati poligon beraturan N sisi (luas tali sepatu, keliling jumlah sisi). */
function polyCircle(r: number, n = 20000): { area: number; perim: number } {
  let area = 0;
  let perim = 0;
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n;
    const b = (2 * Math.PI * (i + 1)) / n;
    const [x1, y1, x2, y2] = [r * Math.cos(a), r * Math.sin(a), r * Math.cos(b), r * Math.sin(b)];
    area += (x1 * y2 - x2 * y1) / 2;
    perim += Math.hypot(x2 - x1, y2 - y1);
  }
  return { area, perim };
}
/** Persegi yang titik sudutnya (0,r), (r,0), (0,−r), (−r,0): luas tali sepatu dan panjang sisi. */
const square = (r: number): { area: number; side: number } => ({ area: 2 * r * r, side: Math.hypot(r, r) });
const red = (r: number): number => (polyCircle(r, 4000).area - square(r).area) / 4;

describe('oracle soal 18', () => {
  it('jari-jari dari luas kaca merah 456 cm² (bagi dua) ≈ 40 cm', () => {
    let lo = 1;
    let hi = 100;
    for (let k = 0; k < 60; k++) {
      const mid = (lo + hi) / 2;
      if (red(mid) < 456) lo = mid;
      else hi = mid;
    }
    // π sejati memberi 39,97; π = 3,14 pada soal memberi tepat 40
    expect(lo).toBeCloseTo(39.97, 1);
    expect(((3.14 - 2) * 40 * 40) / 4).toBeCloseTo(456, 9);
  });

  it('panjang kerangka geometris dan stempel Pas/Tidak Pas cocok dengan kunci', () => {
    for (const r of [40, 39.97]) {
      const total = polyCircle(r).perim + 4 * square(r).side + 2 * (2 * r);
      expect(total).toBeGreaterThan(630);
      expect(total).toBeLessThan(640);
      const pas = (cm: number): boolean => cm >= total && cm - total <= 100;
      expect([pas(800), pas(500), pas(650)]).toEqual(q18.key.cardOk);
    }
  });
});

// ---------- soal 1 ----------
type M2 = [number, number, number, number];
const mul = (a: M2, b: M2): M2 => [
  a[0] * b[0] + a[1] * b[2],
  a[0] * b[1] + a[1] * b[3],
  a[2] * b[0] + a[3] * b[2],
  a[2] * b[1] + a[3] * b[3],
];
const isI = (m: M2): boolean => [1, 0, 0, 1].every((v, i) => Math.abs(m[i]! - v) < 1e-12);

describe('oracle soal 1', () => {
  it('hanya pilihan E yang memenuhi F·X = X·F = I', () => {
    const F: M2 = [2, 0, 0, 0.5];
    const opts: Record<string, M2> = {
      A: [1, 0, 0, 2],
      B: [-1, 0, 0, -2],
      C: [2, 0, 0, 1],
      D: [-0.5, 0, 0, -2],
      E: [0.5, 0, 0, 2],
    };
    const ok = Object.entries(opts).filter(([, X]) => isI(mul(F, X)) && isI(mul(X, F)));
    expect(ok.map(([k]) => k)).toEqual([q01.key.answer]);
    expect(q01.key.cardOk).toEqual(Object.keys(opts).map((k) => k === 'E'));
    // D menghasilkan −I (alasan kartu)
    expect(mul(F, opts.D!)).toEqual([-1, 0, 0, -1]);
  });
});

// ---------- soal 6 ----------
/** Sisa pembagian polinom (koefisien dari pangkat tertinggi) dengan pembagi monik, cara bersusun. */
function remainder(num: number[], den: number[]): number[] {
  const r = [...num];
  for (let i = 0; i <= r.length - den.length; i++) {
    const k = r[i]!;
    den.forEach((d, j) => (r[i + j]! -= k * d));
  }
  return r.slice(r.length - den.length + 1);
}

describe('oracle soal 6', () => {
  it('hanya a = 2, b = −3 yang memberi sisa 5x − 1; a + b = −1 = pilihan C', () => {
    const hits: Array<[number, number]> = [];
    for (let a = -20; a <= 20; a++)
      for (let b = -20; b <= 20; b++) {
        const [r1, r0] = remainder([1, a, b, 1, -6], [1, 1, 1]);
        if (r1 === 5 && r0 === -1) hits.push([a, b]);
      }
    expect(hits).toEqual([[2, -3]]);
    const options: Record<string, number> = { A: 11, B: 5, C: -1, D: -5, E: -7 };
    const sum = hits[0]![0] + hits[0]![1];
    expect(Object.keys(options).filter((k) => options[k] === sum)).toEqual([q06.key.answer]);
  });
});

// ---------- soal 5 ----------
describe('oracle soal 5', () => {
  const f = (x: number): number => x ** 3 + 3 * x ** 2 - 10 * x - 24;
  it('akar dari perubahan tanda + bagi dua: −4, −2, 3; pilihan benar (−2,0) dan (3,0)', () => {
    const roots: number[] = [];
    for (let x = -10; x < 10; x += 0.25) {
      const [a, b] = [x, x + 0.25];
      if (f(a) === 0) roots.push(a);
      else if (f(a) * f(b) < 0) {
        let [lo, hi] = [a, b];
        for (let k = 0; k < 60; k++) {
          const mid = (lo + hi) / 2;
          if (f(lo) * f(mid) <= 0) hi = mid;
          else lo = mid;
        }
        roots.push(Math.round(lo * 1e6) / 1e6);
      }
    }
    expect(roots).toEqual([-4, -2, 3]);
    const opts = [-2, -1, 3, 4, 5];
    expect(opts.map((x) => roots.includes(x))).toEqual(q05.key.cardOk);
    expect(opts.map(f)).toEqual([0, -12, 0, 48, 126]);
  });
});

// ---------- soal 2 ----------
describe('oracle soal 2', () => {
  it('cari (x, y) cacah yang memenuhi pakan; hanya E yang perkaliannya benar dan hasilnya solusi', () => {
    const sol: Array<[number, number]> = [];
    for (let x = 0; x <= 10; x++)
      for (let y = 0; y <= 20; y++) if (10 * x + 2 * y === 38 && 10 * x + y === 34) sol.push([x, y]);
    expect(sol).toEqual([[3, 4]]);
    type Opt = { m: M2; b: [number, number]; r: [number, number] };
    const opts: Record<string, Opt> = {
      A: { m: [-1, 1, 10, -5], b: [19, 34], r: [15, 20] },
      B: { m: [10, -10, -1, 2], b: [38, 34], r: [4, 3] },
      C: { m: [-0.1, 0.2, 1, -1], b: [34, 38], r: [4, 3] },
      D: { m: [-1, 2, 10, -10], b: [38, 34], r: [3, 4] },
      E: { m: [-0.2, 0.2, 2, -1], b: [19, 34], r: [3, 4] },
    };
    const ok = Object.entries(opts).filter(([, o]) => {
      const p = [o.m[0] * o.b[0] + o.m[1] * o.b[1], o.m[2] * o.b[0] + o.m[3] * o.b[1]];
      const tulisBenar = Math.abs(p[0]! - o.r[0]) < 1e-9 && Math.abs(p[1]! - o.r[1]) < 1e-9;
      return tulisBenar && o.r[0] === sol[0]![0] && o.r[1] === sol[0]![1];
    });
    expect(ok.map(([k]) => k)).toEqual([q02.key.answer]);
  });
});
