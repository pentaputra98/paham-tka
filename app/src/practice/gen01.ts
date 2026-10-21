/**
 * Generator latihan soal 1 — invers matriks 2×2 (PRD §11.4 baris 1).
 *  - Mudah: F = diag(p, q), p, q ∈ {2, 3, 4, 5, ½, ⅓, ⅔, 3⁄2}, p ≠ q, pq ≠ 1 (pq = 1 membuat "tukar a dan d"
 *    sama dengan kunci; termasuk soal asli diag(2, ½)). Cara cepat: balik tiap elemen diagonal.
 *  - Sedang: segitiga atas [[a, b], [0, d]], a, d ∈ {±1, ±2, ½}, b ∈ [−3, 3] \ {0}. Cara cepat TIDAK berlaku.
 *  - Menantang: [[a, b], [c, d]] entri [−4, 4], b, c ≠ 0, det ∈ {±1, ±2, ±5}.
 * Kunci = (1/det)·adj. Distraktor dari jebakan nyata (Kesalahan umum soal 1 dan kartu analisis).
 * Oracle: F · X dihitung dengan pecahan eksak dan dibandingkan dengan I (tidak memakai rumus adjoin).
 */
import { H, O, T } from '../engine/dsl';
import type { Row } from '../engine/types';
import { int, mulberry32, pick, type Rng } from '../core/prng';
import {
  I2,
  inv,
  isZero,
  m2,
  mEq,
  mMap,
  mMul,
  mTex,
  mul,
  neg,
  q,
  qTex,
  qTexP,
  sub,
  type M2,
  type Q,
} from './frac';
import { toCode, type Generator, type Instance, type Level, type Option, type Trap } from './types';

const NAMES = ['A', 'B', 'F', 'M', 'P'];
const DIAG: Q[] = [q(2), q(3), q(4), q(5), q(1, 2), q(1, 3), q(2, 3), q(3, 2)];
const TRI: Q[] = [q(1), q(-1), q(2), q(-2), q(1, 2)];
const DETS = [1, -1, 2, -2, 5, -5];

/** Jebakan; bab mengacu ke pembahasan soal 1 (2 = cara cepat diagonal, 3 = uji rumus umum). */
const TRAPS: Record<string, Trap> = {
  lawan: {
    id: 'lawan',
    hint: 'Hati-hati, invers perkalian bukan lawan (negatif). Hasil kali matriks dengan inversnya harus $I$.',
    chapter: 2,
  },
  tanda: {
    id: 'tanda',
    hint: 'Perhatikan tandanya. Angkanya sudah benar, tetapi seluruh tandanya terbalik sehingga hasil kalinya $-I$.',
    chapter: 2,
  },
  sebagian: {
    id: 'sebagian',
    hint: 'Hati-hati, semua elemen diagonal harus dibalik, bukan hanya salah satunya.',
    chapter: 2,
  },
  tanpaBalik: {
    id: 'tanpa-balik',
    hint: 'Perhatikan, pilihan ini sama dengan matriks soalnya. Elemen diagonalnya belum dibalik.',
    chapter: 2,
  },
  lupaDet: {
    id: 'lupa-det',
    hint: 'Hati-hati, matriks adjoin (tukar $a,d$ dan minus pada $b,c$) masih harus dibagi determinan $ad-bc$.',
    chapter: 3,
  },
  adjTanpaTanda: {
    id: 'adjoin-tanpa-tanda',
    hint: 'Hati-hati, setelah $a$ dan $d$ ditukar, elemen $b$ dan $c$ harus diberi tanda minus.',
    chapter: 3,
  },
  tukarSalah: {
    id: 'tukar-salah',
    hint: 'Perhatikan, yang ditukar posisinya adalah $a$ dan $d$. Pada pilihan ini $a$ dan $d$ masih di tempat semula.',
    chapter: 3,
  },
  balikElemen: {
    id: 'balik-elemen',
    hint: 'Hati-hati, cara cepat "balik tiap elemen" hanya berlaku untuk matriks diagonal. Matriks ini bukan diagonal, jadi pakai rumus umum.',
    chapter: 3,
  },
  transpos: {
    id: 'transpos',
    hint: 'Perhatikan letak elemennya. Baris dan kolomnya tertukar (transpos), padahal posisi $b$ dan $c$ tidak berpindah.',
    chapter: 3,
  },
};

const det = (m: M2): Q => sub(mul(m[0][0], m[1][1]), mul(m[0][1], m[1][0]));
const adj = (m: M2): M2 => m2(m[1][1], neg(m[0][1]), neg(m[1][0]), m[0][0]);
const scale = (m: M2, k: Q): M2 => mMap(m, (x) => mul(x, k));
const transpose = (m: M2): M2 => m2(m[0][0], m[1][0], m[0][1], m[1][1]);

function shuffle<T>(rng: Rng, a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [b[i], b[j]] = [b[j]!, b[i]!];
  }
  return b;
}

interface Raw {
  F: M2;
  key: M2;
  pool: Array<[M2, Trap]>;
}

/** Parameter mentah per tingkat; null bila kendala tidak terpenuhi (dibuat ulang). */
function raw(rng: Rng, level: Level): Raw | null {
  if (level === 'mudah') {
    const p = pick(rng, DIAG);
    const r = pick(rng, DIAG);
    // p ≠ q dan pq ≠ 1 (soal asli diag(2, ½) termasuk pq = 1)
    if (p.n * r.d === r.n * p.d || p.n * r.n === p.d * r.d) return null;
    const F = m2(p, q(0), q(0), r);
    const key = m2(inv(p), q(0), q(0), inv(r));
    return {
      F,
      key,
      pool: [
        [scale(F, q(-1)), TRAPS.lawan!],
        [scale(key, q(-1)), TRAPS.tanda!],
        [m2(inv(p), q(0), q(0), r), TRAPS.sebagian!],
        [m2(p, q(0), q(0), inv(r)), TRAPS.sebagian!],
        [F, TRAPS.tanpaBalik!],
        [adj(F), TRAPS.lupaDet!],
      ],
    };
  }
  if (level === 'sedang') {
    const a = pick(rng, TRI);
    const d = pick(rng, TRI);
    const b = q(pick(rng, [-3, -2, -1, 1, 2, 3]));
    const F = m2(a, b, q(0), d);
    const D = det(F);
    const key = scale(adj(F), inv(D));
    return {
      F,
      key,
      pool: [
        [scale(m2(d, b, q(0), a), inv(D)), TRAPS.adjTanpaTanda!],
        [adj(F), TRAPS.lupaDet!],
        [m2(inv(a), inv(b), q(0), inv(d)), TRAPS.balikElemen!],
        [transpose(key), TRAPS.transpos!],
        [scale(key, q(-1)), TRAPS.tanda!],
        [scale(F, q(-1)), TRAPS.lawan!],
      ],
    };
  }
  // pilih det lalu a, d, b; c ditentukan dari ad − bc = det (harus bulat, bukan nol, di [−4, 4])
  const D = q(pick(rng, DETS));
  const a0 = int(rng, -4, 4);
  const d0 = int(rng, -4, 4);
  const b0 = pick(rng, [-4, -3, -2, -1, 1, 2, 3, 4]);
  const c0 = (a0 * d0 - D.n) / b0;
  if (!Number.isInteger(c0) || c0 === 0 || Math.abs(c0) > 4) return null;
  const F = m2(q(a0), q(b0), q(c0), q(d0));
  const key = scale(adj(F), inv(D));
  const [a, b, c, d] = [F[0][0], F[0][1], F[1][0], F[1][1]];
  const pool: Array<[M2, Trap]> = [
    [scale(m2(d, b, c, a), inv(D)), TRAPS.adjTanpaTanda!],
    [adj(F), TRAPS.lupaDet!],
    [scale(m2(a, neg(b), neg(c), d), inv(D)), TRAPS.tukarSalah!],
    [transpose(key), TRAPS.transpos!],
    [scale(key, q(-1)), TRAPS.tanda!],
  ];
  if (![a, b, c, d].some(isZero)) pool.push([mMap(F, inv), TRAPS.balikElemen!]);
  return { F, key, pool };
}

/** Empat distraktor berbeda satu sama lain dan dari kunci, dipilih acak dari kumpulan jebakan. */
function distractors(rng: Rng, r: Raw): Array<[M2, Trap]> | null {
  const out: Array<[M2, Trap]> = [];
  for (const [m, t] of shuffle(rng, r.pool)) {
    if (mEq(m, r.key) || out.some(([x]) => mEq(x, m))) continue;
    out.push([m, t]);
    if (out.length === 4) return out;
  }
  return null;
}

// ---------- penyelesaian (baris papan) ----------
function solution(level: Level, N: string, F: M2, key: M2): Instance['solution'] {
  const known: Row = {
    id: 's0',
    toks: [H('s0a', 'Diketahui', 'lbl'), T('s0b', N), O('s0c', '='), T('s0d', mTex(F))],
    note: level === 'mudah' ? 'matriks diagonal: di luar diagonal utama bernilai $0$' : 'matriks $2\\times2$',
  };
  const check: Row = {
    id: 'u1',
    toks: [
      T('u1a', `${N}\\cdot ${N}^{-1}`),
      O('u1b', '='),
      T('u1c', mTex(mMul(F, key))),
      O('u1d', '='),
      T('u1e', 'I', 'blue'),
    ],
    note: 'baris × kolom: hasilnya matriks identitas, jadi inversnya benar',
    box: 'navy',
  };
  if (level === 'mudah') {
    const [p, r] = [F[0][0], F[1][1]];
    const flip = (id: string, x: Q): Row => ({
      id,
      toks: [
        T(`${id}a`, `${qTex(x)}${x.d === 1 ? `=\\tfrac{${x.n}}{1}` : ''}`, 'blue'),
        O(`${id}b`, '\\;\\longrightarrow\\;'),
        T(`${id}c`, qTex(inv(x)), 'blue'),
      ],
      note: 'pembilang dan penyebut ditukar',
    });
    return [
      { title: 'Kenali matriksnya', rows: [known] },
      {
        title: 'Cara cepat: balik elemen diagonal',
        rows: [
          flip('c1', p),
          flip('c2', r),
          {
            id: 'c3',
            toks: [T('c3a', `${N}^{-1}`), O('c3b', '='), T('c3c', mTex(key), 'gold')],
            note: 'elemen di luar diagonal tetap $0$',
            box: 'gold',
          },
        ],
      },
      { title: 'Uji dengan perkalian', rows: [check] },
    ];
  }
  const [a, b, c, d] = [F[0][0], F[0][1], F[1][0], F[1][1]];
  const D = det(F);
  const A = adj(F);
  return [
    {
      title: 'Rumus umum invers',
      rows: [
        known,
        {
          id: 'g1',
          toks: [
            T('g1a', `${N}^{-1}`),
            O('g1b', '='),
            T('g1c', '\\dfrac{1}{ad-bc}'),
            T('g1d', '\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}'),
          ],
          note:
            level === 'sedang'
              ? 'bukan matriks diagonal ($b\\ne0$), jadi cara cepat tidak berlaku'
              : 'berlaku untuk semua matriks $2\\times2$ dengan $ad-bc\\ne0$',
          box: 'navy',
        },
      ],
    },
    {
      title: 'Hitung determinan',
      rows: [
        {
          id: 'd1',
          toks: [
            T('d1a', `\\det ${N}`),
            O('d1b', '='),
            T('d1c', `${qTexP(a)}\\cdot${qTexP(d)}`, 'blue'),
            O('d1d', '-'),
            T('d1e', `${qTexP(b)}\\cdot${qTexP(c)}`, 'red'),
          ],
          note: '$ad-bc$',
        },
        {
          id: 'd2',
          toks: [T('d2a', `\\det ${N}`), O('d2b', '='), T('d2c', qTex(D), 'blue')],
          note: 'tidak nol, jadi inversnya ada',
          box: 'navy',
        },
      ],
    },
    {
      title: 'Adjoin, lalu bagi determinan',
      rows: [
        {
          id: 'a1',
          toks: [T('a1a', '\\operatorname{adj}'), O('a1b', '='), T('a1c', mTex(A))],
          note: 'tukar $a$ dan $d$, beri tanda minus pada $b$ dan $c$',
        },
        {
          id: 'a2',
          toks: [
            T('a2a', `${N}^{-1}`),
            O('a2b', '='),
            T('a2c', `\\dfrac{1}{${qTex(D)}}`),
            T('a2d', mTex(A)),
            O('a2e', '='),
            T('a2f', mTex(key), 'gold'),
          ],
          note: 'setiap elemen adjoin dibagi determinan',
          box: 'gold',
        },
      ],
    },
    { title: 'Uji dengan perkalian', rows: [check] },
  ];
}

function hints(level: Level, nm: string, F: M2): [string, string, string] {
  if (level === 'mudah')
    return [
      `Matriks $${nm}$ adalah matriks diagonal: semua elemen di luar diagonal utama bernilai $0$.`,
      'Tulis tiap elemen diagonal sebagai pecahan, misalnya $3=\\frac31$, lalu tukar pembilang dan penyebutnya.',
      `Balik elemen ${qTex(F[0][0])}$ dan ${qTex(F[1][1])}$; elemen $0$ tetap $0$. Pilihan mana yang cocok?`,
    ];
  const [a, b, c, d] = [F[0][0], F[0][1], F[1][0], F[1][1]];
  return [
    `Matriks ini bukan matriks diagonal, jadi pakai rumus umum: $A^{-1}=\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$.`,
    `Langkah pertama: hitung $ad-bc$ dengan $a=${qTex(a)}$, $b=${qTex(b)}$, $c=${qTex(c)}$, $d=${qTex(d)}$.`,
    'Tukar $a$ dan $d$, beri tanda minus pada $b$ dan $c$, lalu bagi setiap elemen dengan determinan. Cocokkan dengan pilihan.',
  ];
}

const FALLBACK: Record<Level, number[]> = { mudah: [11, 23], sedang: [5, 17], menantang: [3, 41] };

function build(seed: number, level: Level): Instance | null {
  const rng = mulberry32(seed);
  for (let tries = 0; tries < 20; tries++) {
    const r = raw(rng, level);
    if (!r) continue;
    const ds = distractors(rng, r);
    if (!ds) continue;
    const nm = pick(rng, NAMES);
    const opts: Array<{ m: M2; trap?: Trap }> = shuffle(rng, [
      { m: r.key },
      ...ds.map(([m, trap]) => ({ m, trap })),
    ]);
    const keyIdx = opts.findIndex((o) => !o.trap);
    const options: Option[] = opts.map((o) => ({
      tex: mTex(o.m),
      ok: !o.trap,
      ...(o.trap ? { trap: o.trap } : {}),
    }));
    const F = r.F;
    return {
      no: 1,
      seed,
      level,
      code: toCode(seed, level),
      paper: `<p>Perhatikan matriks berikut!</p>
<div class="soal-math">$$${nm}=${mTex(F)}$$</div>
<p>Invers dari matriks $${nm}$ adalah ....</p>`,
      options,
      key: keyIdx,
      hints: hints(level, nm, F),
      solution: solution(level, nm, F, r.key),
      timeAdvice: level === 'mudah' ? 60 : level === 'sedang' ? 120 : 180,
      test(i) {
        const P = mMul(F, opts[i]!.m);
        const ok = mEq(P, I2);
        return { tex: `${nm}\\cdot X=${mTex(P)}${ok ? '=I' : '\\ne I'}`, ok };
      },
      params: { name: nm, F, opts: opts.map((o) => o.m) },
    };
  }
  return null;
}

export const gen01: Generator = {
  no: 1,
  levels: {
    mudah: 'Matriks diagonal, seperti soal aslinya. Cukup cara cepat.',
    sedang: 'Matriks segitiga: cara cepat tidak berlaku, pakai rumus umum.',
    menantang: 'Matriks 2×2 umum dengan dua jebakan tanda.',
  },
  make(seed, level) {
    // §11.1 butir 1: gagal 20 kali → pakai varian cadangan yang sudah terbukti valid
    return build(seed, level) ?? build(FALLBACK[level][seed % 2]!, level)!;
  },
  oracle(inst) {
    const F = inst.params.F as M2;
    const opts = inst.params.opts as M2[];
    const good = opts.map((m, i) => (mEq(mMul(F, m), I2) ? i : -1)).filter((i) => i >= 0);
    // tepat satu pilihan yang dikali F menghasilkan I, dan itu kuncinya
    return good.length === 1 && good[0] === inst.key && inst.options[inst.key]!.ok;
  },
};
