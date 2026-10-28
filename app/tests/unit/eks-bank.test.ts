import katex from 'katex';
import { describe, expect, it } from 'vitest';
import { gameItem, GENS, POS, RULES, type GItem } from '../../src/eks/bank';
import {
  joinCode,
  makeGameCode,
  parseJoin,
  posList,
  posMaskOf,
  proofCode,
  readProof,
  type PosId,
} from '../../src/eks/codes';
import { mulberry32 } from '../../src/core/prng';

/** angka dari teks pilihan: "$-3$", "$\\frac{3}{4}$", "$(2,\\,-1)$" */
const z = (xs: readonly number[]): number[] => xs.map((x) => x + 0);

function nums(s: string): number[] {
  const t = s.replace(/\\frac\{(-?\d+)\}\{(\d+)\}/g, (_, a: string, b: string) =>
    String(Number(a) / Number(b)),
  );
  return z([...t.matchAll(/-?\d+(?:\.\d+)?/g)].map((x) => Number(x[0])));
}

function renders(s: string): void {
  for (const part of s.matchAll(/\$([^$]+)\$/g)) katex.renderToString(part[1]!, { throwOnError: true });
}

function oracle(it: GItem): void {
  const key = it.options[it.ok]!;
  const d = it.data ?? {};
  switch (it.tpl) {
    case 'l1':
      expect(nums(key)).toEqual(z(d.ans as number[]));
      expect(z([-Number(d.A) / 2, -Number(d.B) / 2])).toEqual(z(d.ans as number[]));
      break;
    case 'l2': {
      const r = Math.sqrt((Number(d.A) / 2) ** 2 + (Number(d.B) / 2) ** 2 - Number(d.C));
      expect(nums(key)).toEqual([r]);
      break;
    }
    case 'g1':
    case 'g2':
    case 'g3': {
      const a = Number(d.a);
      const b = Number(d.b);
      const f = (t: number): number =>
        a + b * (d.fn === 'cos' ? Math.cos((Math.PI * t) / 6) : Math.sin((Math.PI * t) / 6));
      const xs = Array.from({ length: 2401 }, (_, i) => f(i / 100));
      if (it.tpl === 'g1') expect(nums(key)[0]).toBeCloseTo(d.hi ? Math.max(...xs) : Math.min(...xs), 6);
      if (it.tpl === 'g2') expect(nums(key)[0]).toBeCloseTo(f(Number(d.t)), 6);
      if (it.tpl === 'g3') expect(f(5) - f(17)).toBeCloseTo(0, 9);
      break;
    }
    case 't1': {
      const R = RULES.find((r) => r.id === d.rule)!;
      // matriks transformasi diperiksa ulang lewat sudut / cermin
      const [p, q] = [Number(d.p), Number(d.q)];
      const ref: Record<string, [number, number]> = {
        X: [p, -q],
        Y: [-p, q],
        yx: [q, p],
        ymx: [-q, -p],
        r90: [
          Math.round(p * Math.cos(Math.PI / 2) - q * Math.sin(Math.PI / 2)),
          Math.round(p * Math.sin(Math.PI / 2) + q * Math.cos(Math.PI / 2)),
        ],
        r270: [
          Math.round(p * Math.cos(-Math.PI / 2) - q * Math.sin(-Math.PI / 2)),
          Math.round(p * Math.sin(-Math.PI / 2) + q * Math.cos(-Math.PI / 2)),
        ],
        r180: [-p, -q],
      };
      expect(nums(key)).toEqual(z(ref[R.id]!));
      break;
    }
    case 't2':
      expect(nums(key)).toEqual(z([Number(d.k) * Number(d.p), Number(d.k) * Number(d.q)]));
      break;
    case 't3': {
      const R = RULES.find((r) => r.id === d.rule)!;
      expect(nums(key)).toEqual(z(R.f(Number(d.p) + Number(d.s), Number(d.q) + Number(d.t))));
      break;
    }
    case 'j1':
      expect(nums(key)[0]).toBe(2 ** Number(d.k));
      break;
    case 'j2':
      expect(nums(key)[0]).toBeCloseTo(((22 / 7) * Number(d.d)) / 2 + Number(d.d), 9);
      break;
    case 'j3': {
      const a = Number(d.a);
      const b = Number(d.b);
      const x = a + 1e-7;
      expect(nums(key)[0]).toBeCloseTo((x * x + (b - a) * x - a * b) / (x - a), 4);
      break;
    }
    case 'j4': {
      const x = 1e7;
      const [p, q, u, v, w] = [d.p, d.q, d.u, d.v, d.w].map(Number) as [
        number,
        number,
        number,
        number,
        number,
      ];
      expect(nums(key)[0]).toBeCloseTo((p * x * x + u * x + v) / (q * x * x + w), 5);
      break;
    }
    case 'j5': {
      const v = d.v as number[];
      expect(nums(key)[0]).toBe(Math.hypot(...v));
      break;
    }
    default:
      break;
  }
}

describe('Ekspedisi: bank soal', () => {
  const posIds = [0, 1, 2, 3, 4, 5, 6, 7] as const;
  it('setiap pos: kunci tunggal, pilihan unik, jebakan berlabel, oracle cocok, KaTeX lolos (400 benih)', () => {
    for (const pos of posIds)
      for (let seed = 1; seed <= 400; seed++)
        for (let i = 0; i < POS[pos].n; i++)
          for (const attempt of [0, 1]) {
            const it = gameItem(seed * 2654435761, pos, i, attempt);
            expect(it.options.length).toBeGreaterThanOrEqual(4);
            expect(new Set(it.options).size).toBe(it.options.length);
            expect(it.ok).toBeGreaterThanOrEqual(0);
            it.traps.forEach((t, k) => (k === it.ok ? expect(t).toBeNull() : expect(t).toBeTruthy()));
            oracle(it);
            if (seed % 40 === 0)
              [it.paper, it.hint, it.explain, ...it.options, ...it.traps.filter(Boolean)].forEach((s) =>
                renders(s!),
              );
          }
  });

  it('detektif aljabar: baris kunci memang baris pertama yang tidak setara', () => {
    for (let seed = 1; seed <= 600; seed++) {
      const it = gameItem(seed * 7919, 4, 0);
      const d = it.data as { errAt: number };
      expect(it.ok).toBe(d.errAt < 0 ? 4 : d.errAt);
      const lines = [...it.paper.matchAll(/<li>\$([^$]+)\$<\/li>/g)].map((x) => x[1]!);
      expect(lines).toHaveLength(4);
      expect(new Set(lines).size).toBe(4);
    }
  });

  it('cetakan pos 6 dan 7 berasal dari pos lain', () => {
    expect(GENS[6].length).toBeGreaterThanOrEqual(6);
    expect(GENS[7].length).toBeGreaterThanOrEqual(3);
  });
});

describe('Ekspedisi: kode', () => {
  it('kode permainan membawa daftar pos', () => {
    const g = makeGameCode(0b1010101, 1234);
    expect(g).toHaveLength(4);
    expect(posList(posMaskOf(g))).toEqual([1, 3, 5, 7]);
  });

  it('kode gabung: sah untuk tim 1–6, salah satu huruf ditolak', () => {
    const g = makeGameCode(0x7f, 77);
    for (let t = 1; t <= 6; t++) {
      const j = joinCode(g, t);
      expect(parseJoin(j)).toEqual({ game: g, team: t });
      expect(parseJoin(j.toLowerCase().replace('-', ' '))).toEqual({ game: g, team: t });
    }
    const j = joinCode(g, 2);
    const bad = j.slice(0, -1) + (j.endsWith('A') ? 'B' : 'A');
    expect(parseJoin(bad)).toBeNull();
  });

  it('kode bukti: bolak-balik, terikat tim, tebakan acak hampir selalu ditolak', () => {
    const g = makeGameCode(0x7f, 4321);
    const rng = mulberry32(9);
    for (let n = 0; n < 500; n++) {
      const team = 1 + Math.floor(rng() * 5);
      const proof = {
        pos: (1 + Math.floor(rng() * 7)) as PosId,
        score: Math.floor(rng() * 80),
        wrong: Math.floor(rng() * 4),
        helped: Math.floor(rng() * 4),
      };
      const code = proofCode(g, team, proof);
      expect(readProof(g, [1, 2, 3, 4, 5], code)).toEqual({ team, proof });
      expect(
        readProof(
          g,
          [1, 2, 3, 4, 5].filter((t) => t !== team),
          code,
        ),
      ).toBeNull();
    }
    let lucky = 0;
    for (let n = 0; n < 2000; n++) {
      const s = Array.from(
        { length: 5 },
        () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(rng() * 32)],
      ).join('');
      if (readProof(g, [1, 2, 3, 4, 5], s)) lucky++;
    }
    expect(lucky).toBeLessThan(30);
  });
});
