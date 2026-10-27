import katex from 'katex';
import { describe, expect, it } from 'vitest';
import { makeItem, makeTest, TEMPLATES } from '../../src/tes/bank';
import { MATERI, PER_MATERI, type TesItem } from '../../src/tes/types';

/**
 * Uji properti bank tes penguasaan: 1.000 benih per cetakan. Oracle tiap cetakan menghitung ulang dengan
 * cara lain (substitusi, hitung numerik, matriks transformasi), tanpa rumus pembuat soal.
 */
const N = 1000;
const seedOf = (s: number): number => (s * 2654435761) % 4294967296;

/** Nilai pilihan sederhana: bilangan bulat/desimal, pecahan, akar, tak hingga. */
function val(tex: string): number {
  const t = tex.replace(/\$/g, '').replace(/\{,\}/g, '.').trim();
  if (t === '\\infty') return Infinity;
  let m = /^(-?)\\frac\{(\d+)\}\{(\d+)\}$/.exec(t);
  if (m) return (m[1] ? -1 : 1) * (Number(m[2]) / Number(m[3]));
  m = /^\\sqrt\{(\d+)\}$/.exec(t);
  if (m) return Math.sqrt(Number(m[1]));
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  throw new Error(`nilai tidak terbaca: ${tex}`);
}

/** Semua bilangan bulat (bertanda) dalam teks, berurutan. */
const ints = (s: string): number[] =>
  [...s.replace(/\\frac|\\sqrt|\^2|\^3|\^\\circ/g, ' ').matchAll(/-?\d+/g)].map((x) => Number(x[0]));

/** Titik "(x,\,y)" atau tiga dimensi. */
const point = (s: string): number[] => ints(s.replace(/\\,/g, ' '));

/** "(x-h)^2+(y-k)^2=c" → [h, k, c] */
function circle(s: string): [number, number, number] {
  const t = s.replace(/\$/g, '');
  const part = (v: 'x' | 'y'): number => {
    const m = new RegExp(`\\(${v}([+-]\\d+)\\)\\^2`).exec(t);
    return m ? -Number(m[1]) : 0;
  };
  return [part('x'), part('y'), Number(t.split('=')[1])];
}

const idxOk = (it: TesItem): number[] => it.ok.flatMap((o, i) => (o ? [i] : []));

type Oracle = (it: TesItem) => boolean;
const P = (it: TesItem): Record<string, number> => it.params as Record<string, number>;

const ORACLES: Record<string, Oracle> = {
  m1(it) {
    const { a, b, c, d } = P(it);
    const isInv = (s: string): boolean => {
      const [w, x, y, z] = ints(s);
      return (
        a! * w! + b! * y! === 1 &&
        a! * x! + b! * z! === 0 &&
        c! * w! + d! * y! === 0 &&
        c! * x! + d! * z! === 1
      );
    };
    return it.options.every((o, i) => isInv(o) === it.ok[i]);
  },
  m2(it) {
    const { a, b, c, d, p, q } = P(it);
    return it.options.every((o, i) => {
      const [x, y] = [...o.matchAll(/Rp(\d+)\.000/g)].map((m) => Number(m[1]));
      return (a! * x! + b! * y! === p && c! * x! + d! * y! === q) === it.ok[i];
    });
  },
  m3(it) {
    const { n11, n12, n21, n22, h1, h2 } = P(it);
    const RA = n11! * h1! + n12! * h2!;
    const RB = n21! * h1! + n22! * h2!;
    const rp = (s: string): number => Number(/Rp([\d.]+)/.exec(s)![1]!.replace(/\./g, '')) / 1000;
    const t1 = rp(it.options[0]!) === RA;
    const t2 = it.options[1]!.includes('kantin A lebih besar') ? RA > RB : RB > RA;
    const t3 = RA + RB > rp(it.options[2]!);
    return [t1, t2, t3].every((t, i) => t === it.ok[i]);
  },
  p1(it) {
    const { b, c, d, k } = P(it);
    // sisa lewat pembagian bersusun (Horner), bukan substitusi
    let r = 0;
    for (const co of [1, b!, c!, d!]) r = r * k! + co;
    return it.options.every((o, i) => (val(o) === r) === it.ok[i]);
  },
  p2(it) {
    const { s1, s2, s3 } = P(it);
    const f = (x: number): number => x ** 3 - s1! * x * x + s2! * x - s3!;
    return it.options.every((o, i) => {
      const [x, y] = point(o);
      return (y === 0 && f(x!) === 0) === it.ok[i];
    });
  },
  p3(it) {
    const { a, b, c, n } = P(it);
    const coef = (s: string): number[] =>
      s
        .replace(/\$/g, '')
        .split('+')
        .map((t) => {
          const m = /^([\d{},]*)T/.exec(t)!;
          return m[1] ? Math.round(Number(m[1].replace('{,}', '.')) * 1000) : 1000;
        });
    return it.options.every((o, i) => {
      const [x, y, z] = coef(o);
      return (x === n! * a! && y === n! * b! && z === n! * c!) === it.ok[i];
    });
  },
  f1(it) {
    const { a, p, t } = P(it);
    const v = a! * Math.pow(2, t! / p!);
    return it.options.every((o, i) => Math.abs(val(o) - v) < 1e-9 === it.ok[i]);
  },
  f2(it) {
    const { a, m, p } = P(it);
    const Pf = (t: number): number => a! * Math.pow(m!, t / p!);
    const [s1, s2, s3] = it.options.map((o) => ints(o.replace(/\$t=0\$/, '').replace('ke-', 'ke ')));
    const t1 = Math.abs(Pf(p! + 1) / Pf(1) - s1![1]!) < 1e-9;
    const t2 = Math.abs(Pf(0) - s2![0]!) < 1e-9;
    const t3 = Math.abs(Pf(s3![0]!) - s3![1]!) < 1e-9;
    return [t1, t2, t3].every((t, i) => t === it.ok[i]);
  },
  f3(it) {
    const { a, b, t } = P(it);
    const mode = (it.params as { mode: string }).mode;
    const h = (x: number): number => a! + b! * Math.cos((Math.PI / 6) * x);
    let v = h(t!);
    if (mode !== 't') {
      const ys = Array.from({ length: 2401 }, (_, i) => h(i / 100));
      v = mode === 'max' ? Math.max(...ys) : Math.min(...ys);
    }
    return it.options.every((o, i) => Math.abs(val(o) - v) < 1e-9 === it.ok[i]);
  },
  l1(it) {
    const { p, q, C } = P(it);
    const g = (x: number, y: number): number => x * x + y * y - 2 * p! * x - 2 * q! * y + C!;
    return it.options.every((o, i) => {
      const [cx, cy] = point(/\$\(([^$]+)\)\$/.exec(o)![1]!);
      const r = val(/jari-jari \$([^$]+)\$/.exec(o)![1]!);
      const onCircle = [0, 1, 2, 3, 4, 5].every((k) => {
        const th = (k * Math.PI) / 3;
        return Math.abs(g(cx! + r * Math.cos(th), cy! + r * Math.sin(th))) < 1e-6;
      });
      return onCircle === it.ok[i];
    });
  },
  l2(it) {
    const { a, b, px, py } = P(it);
    return it.options.every((o, i) => {
      const [h, k, c] = circle(o);
      return (h === a && k === b && (px! - h) ** 2 + (py! - k) ** 2 === c) === it.ok[i];
    });
  },
  l3(it) {
    const { r } = P(it);
    const pi = (it.params as { sev: boolean }).sev ? 22 / 7 : 3.14;
    const n = (s: string): number =>
      Number(/adalah ([\d.,]+) cm/.exec(s)![1]!.replace(/\./g, '').replace(',', '.'));
    const t = [
      Math.abs(n(it.options[0]!) - 2 * pi * r!) < 1e-6,
      Math.abs(n(it.options[1]!) - pi * r! * r!) < 1e-6,
      Math.abs(n(it.options[2]!) - (4 * r! * r! - pi * r! * r!)) < 1e-6,
    ];
    return t.every((x, i) => x === it.ok[i]);
  },
  t1(it) {
    const { P: Pt, T, mi } = it.params as { P: number[]; T: number[]; mi: number };
    // matriks pencerminan: sumbu X, sumbu Y, y = x, y = −x
    const M = [
      [1, 0, 0, -1],
      [-1, 0, 0, 1],
      [0, 1, 1, 0],
      [0, -1, -1, 0],
    ][mi]!;
    const x = Pt[0]! + T[0]!;
    const y = Pt[1]! + T[1]!;
    const R = [M[0]! * x + M[1]! * y, M[2]! * x + M[3]! * y];
    return it.options.every((o, i) => {
      const [u, v] = point(o);
      return (u === R[0] && v === R[1]) === it.ok[i];
    });
  },
  t2(it) {
    const { a, b, r, k } = P(it);
    return it.options.every((o, i) => {
      const [h, kk, c] = circle(o);
      const fits = [
        [r!, 0],
        [0, r!],
        [-r!, 0],
        [0, -r!],
      ].every(([dx, dy]) => (k! * (a! + dx!) - h) ** 2 + (k! * (b! + dy!) - kk) ** 2 === c);
      return fits === it.ok[i];
    });
  },
  t3(it) {
    const { m, c } = P(it);
    return it.options.every((o, i) => {
      const [x, y] = point(o);
      // putar balik −90°: (x, y) → (y, −x), lalu periksa pada g
      const [gx, gy] = [y!, -x!];
      return (gy === m! * gx + c!) === it.ok[i];
    });
  },
  v1(it) {
    const { p, q, r } = P(it);
    const L = Math.hypot(p!, q!, r!);
    return it.options.every((o, i) => Math.abs(val(o) - L) < 1e-9 === it.ok[i]);
  },
  v2(it) {
    const { A, U } = it.params as { A: number[]; U: number[] };
    return it.options.every((o, i) => {
      const B = point(o);
      return B.every((x, j) => x - A[j]! === U[j]) === it.ok[i];
    });
  },
  v3(it) {
    const { d } = P(it);
    return it.options.every((o, i) => {
      const [x1, y1, z1, x2, y2, z2] = point(o);
      return Math.hypot(x2! - x1!, y2! - y1!, z2! - z1!) < d! - 1e-9 === it.ok[i];
    });
  },
  li1(it) {
    const { a, b } = P(it);
    const f = (x: number): number => (x * x + (b! - a!) * x - a! * b!) / (x - a!);
    const L = (f(a! + 1e-7) + f(a! - 1e-7)) / 2;
    return it.options.every((o, i) => Math.abs(val(o) - L) < 1e-4 === it.ok[i]);
  },
  li2(it) {
    const { p, q, r, s, t, u } = P(it);
    const x = 1e9;
    const L = (p! * x * x + q! * x + r!) / (s! * x * x + t! * x + u!);
    return it.options.every((o, i) => Math.abs(val(o) - L) < 1e-6 === it.ok[i]);
  },
  li3(it) {
    const { a, b } = P(it);
    const form = (it.params as { form: string }).form;
    const x = 1e-6;
    const top = form === 'ts' ? Math.tan(a! * x) : Math.sin(a! * x);
    const bot = form === 'st' ? Math.tan(b! * x) : form === 'sx' ? b! * x : Math.sin(b! * x);
    return it.options.every((o, i) => Math.abs(val(o) - top / bot) < 1e-6 === it.ok[i]);
  },
};

/** Semua segmen $…$ / $$…$$ dapat dirender KaTeX tanpa galat. */
function texOk(html: string): boolean {
  const segs = [...html.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)].map((m) => m[1] ?? m[2]!);
  for (const s of segs) katex.renderToString(s, { throwOnError: true, strict: 'ignore' });
  return !/undefined|NaN|Infinity|\[object/.test(html);
}

describe('bank tes penguasaan', () => {
  it('21 cetakan: 3 per materi, setiap cetakan punya oracle', () => {
    expect(TEMPLATES).toHaveLength(21);
    for (const m of MATERI) expect(TEMPLATES.filter((t) => t.materi === m)).toHaveLength(PER_MATERI);
    for (const t of TEMPLATES) expect(ORACLES[t.id], t.id).toBeTypeOf('function');
  });

  TEMPLATES.forEach((tpl, ti) =>
    it(`${tpl.id} (${tpl.topic}): ${N} benih valid, unik, kunci lolos oracle`, () => {
      for (let s = 0; s < N; s++) {
        const it = makeItem(seedOf(s), ti);
        const tag = `${tpl.id}#${s}`;
        expect(new Set(it.options).size, tag).toBe(it.options.length);
        if (it.kind === 'tf') {
          expect(it.options, tag).toHaveLength(3);
          expect(new Set(it.ok).size, tag).toBe(2);
        } else {
          expect(it.options, tag).toHaveLength(5);
          const k = idxOk(it).length;
          if (it.kind === 'single') expect(k, tag).toBe(1);
          else expect(k >= 2 && k <= 3, tag).toBe(true);
        }
        expect(ORACLES[tpl.id]!(it), tag).toBe(true);
        expect(it.explain.length, tag).toBeGreaterThan(30);
        if (s < 150) expect(texOk([it.paper, it.explain, ...it.options].join(' ')), tag).toBe(true);
      }
    }),
  );

  it('benih berbeda menghasilkan soal berbeda; benih sama menghasilkan soal sama', () => {
    const a = makeTest(1).map((x) => x.paper);
    const b = makeTest(2).map((x) => x.paper);
    expect(makeTest(1).map((x) => x.paper)).toEqual(a);
    expect(a.filter((p, i) => p !== b[i]).length).toBeGreaterThanOrEqual(15);
  });

  it('tes berisi 21 soal berurutan menurut materi', () => {
    const t = makeTest(12345);
    expect(t).toHaveLength(21);
    expect(t.map((x) => x.materi)).toEqual(MATERI.flatMap((m) => [m, m, m]));
  });
});
