/**
 * Generator latihan soal 11 — kedalaman air laut, gelombang y = a + b cos(2πt/P) (revisi pemilik v1.22).
 * Gambar: grafik mulai dari puncak M di t = 0, lembah m di t = P/2, puncak lagi di t = P; persamaan
 * y = a + b cos(kt) tertera di gambar (k = 2π/P), a dan b tidak diberikan.
 *  - Mudah: kapan kedalaman di garis tengah untuk ke-n kalinya, n ∈ {2, 3, 4} (seperti soal asli);
 *    logika: tengah waktu puncak–lembah P/4, lalu tiap P/2.
 *  - Sedang: garis tengah ke-n, n ∈ {3, 4, 5}, atau lembah ke-n, n ∈ {2, 3} (tiap P).
 *  - Menantang: kedalaman a + b/2 atau a − b/2 (bukan garis tengah) ke-n, n ∈ {2, 3}: perlu rumus,
 *    cos(kt) = ±½ (seperti contoh 13,3 m pada cara alternatif pembahasan).
 * P ∈ {8, 12, 16, 24} (Menantang {12, 24} agar waktunya bulat); a, b satu desimal; bukan soal asli
 * (a = 12,3, b = 2, P = 12, garis tengah ke-3).
 * Distraktor dari Kesalahan umum soal 11: urutan meleset satu (ke-(n−1), ke-(n+1)), menjawab waktu puncak/akhir
 * satu gelombang, waktu yang tidak ada di pola, dan memakai tengah-tengah waktu untuk kedalaman yang bukan
 * garis tengah.
 * Oracle: kemunculan dihitung numerik dari y(t) pada kisi halus (perubahan tanda dan titik terendah), tanpa
 * memakai rumus waktu pembuat.
 */
import { H, O, T } from '../engine/dsl';
import type { Row } from '../engine/types';
import { int, mulberry32, pick, type Rng } from '../core/prng';
import { toCode, type Generator, type Instance, type Level, type Option, type Trap } from './types';

type Kind = 'tengah' | 'lembah' | 'atas' | 'bawah';

/** Jebakan; bab mengacu ke pembahasan soal 11 (2 garis tengah, 3 waktu, 4 hitung kemunculan, 5 rumus). */
const TRAPS: Record<string, Trap> = {
  kurang: {
    id: 'urutan-kurang-satu',
    hint: 'Perhatikan urutannya. Pada waktu ini kedalaman itu baru muncul sekali lebih sedikit dari yang diminta.',
    chapter: 4,
  },
  lebih: {
    id: 'urutan-lebih-satu',
    hint: 'Perhatikan urutannya. Pada waktu ini kemunculannya sudah lewat satu dari yang diminta.',
    chapter: 4,
  },
  puncak: {
    id: 'waktu-puncak',
    hint: 'Hati-hati, pada waktu ini air di puncak (akhir satu gelombang), bukan pada kedalaman yang ditanya.',
    chapter: 4,
  },
  pola: {
    id: 'bukan-di-pola',
    hint: 'Perhatikan polanya. Kedalaman itu muncul pada waktu-waktu tertentu yang berjarak tetap; waktu ini tidak termasuk.',
    chapter: 3,
  },
  tengahWaktu: {
    id: 'tengah-waktu-bukan-garis-tengah',
    hint: 'Hati-hati, tengah-tengah waktu puncak–lembah hanya berlaku untuk garis tengah. Kedalaman ini bukan garis tengah, jadi pakai rumus.',
    chapter: 5,
  },
};

const ORD = ['', 'pertama', 'kedua', 'ketiga', 'keempat', 'kelima'];
const PLACES = ['teluk', 'pelabuhan', 'dermaga', 'muara sungai', 'pantai'];
const dec = (v: number): string => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');
const decTex = (v: number): string => dec(v).replace(',', '{,}');
/** k = 2π/P sebagai teks gambar dan LaTeX: P = 12 → π/6 */
const kText = (P: number): string => `πt/${P / 2}`;
const kTex = (P: number): string => `\\tfrac{1}{${P / 2}}\\pi t`;

function shuffle<T>(rng: Rng, a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [b[i], b[j]] = [b[j]!, b[i]!];
  }
  return b;
}

interface Raw {
  kind: Kind;
  a: number;
  b: number;
  P: number;
  n: number;
  /** kedalaman yang ditanya */
  target: number;
  /** waktu-waktu kemunculan (pembuat), urut */
  times: number[];
  key: number;
  pool: Array<[number, Trap]>;
}

/** waktu kemunculan ke-1..6 menurut pembuat (rumus); oracle memakai cara numerik */
function timesOf(kind: Kind, P: number): number[] {
  const out: number[] = [];
  for (let j = 0; j < 4; j++) {
    if (kind === 'tengah') out.push(P / 4 + j * P, (3 * P) / 4 + j * P);
    if (kind === 'lembah') out.push(P / 2 + j * P);
    if (kind === 'atas') out.push(P / 6 + j * P, (5 * P) / 6 + j * P);
    if (kind === 'bawah') out.push(P / 3 + j * P, (2 * P) / 3 + j * P);
  }
  return [...new Set(out.map((t) => Math.round(t * 1e6) / 1e6))].sort((x, y) => x - y);
}

function raw(rng: Rng, level: Level): Raw | null {
  const P = level === 'menantang' ? pick(rng, [12, 24]) : pick(rng, [8, 12, 16, 24]);
  const a = int(rng, 85, 155) / 10;
  const b = level === 'menantang' ? pick(rng, [1, 2, 3]) : pick(rng, [1, 1.5, 2, 2.5, 3]);
  let kind: Kind = 'tengah';
  let n = int(rng, 2, 4);
  if (level === 'sedang') {
    kind = rng() < 0.5 ? 'tengah' : 'lembah';
    n = kind === 'tengah' ? int(rng, 3, 5) : int(rng, 2, 3);
  }
  if (level === 'menantang') {
    kind = rng() < 0.5 ? 'atas' : 'bawah';
    n = int(rng, 2, 3);
  }
  if (a === 12.3 && b === 2 && P === 12 && kind === 'tengah' && n === 3) return null;
  const target = kind === 'tengah' ? a : kind === 'lembah' ? a - b : kind === 'atas' ? a + b / 2 : a - b / 2;
  const times = timesOf(kind, P);
  const key = times[n - 1]!;
  const pool: Array<[number, Trap]> = [
    [times[n - 2]!, TRAPS.kurang!],
    [times[n]!, TRAPS.lebih!],
    [times[n + 1]!, TRAPS.lebih!],
    [P * Math.max(1, Math.round(key / P)), TRAPS.puncak!],
    [P * (Math.floor(key / P) + 1), TRAPS.puncak!],
    [key + 1, TRAPS.pola!],
    [key - 1, TRAPS.pola!],
    [key + 2, TRAPS.pola!],
    [key - 2, TRAPS.pola!],
  ];
  if (n >= 3) pool.push([times[n - 3]!, TRAPS.kurang!]);
  if (kind === 'atas' || kind === 'bawah') {
    // memakai tengah-tengah waktu seolah garis tengah: t = P/4 + (n − 1)·P/2
    pool.push([P / 4 + ((n - 1) * P) / 2, TRAPS.tengahWaktu!]);
  }
  if (kind === 'lembah') pool.push([P / 4 + ((n - 1) * P) / 2, TRAPS.pola!]);
  return { kind, a, b, P, n, target, times, key, pool };
}

/**
 * Empat distraktor; pilihan diurutkan naik seperti soal asli, jadi posisi kunci diundi lebih dulu (A–E) lalu
 * dipilih sebanyak itu distraktor yang lebih kecil dan sisanya yang lebih besar.
 */
function distractors(rng: Rng, w: Raw): Array<[number, Trap]> | null {
  const pos = int(rng, 0, 4);
  const out: Array<[number, Trap]> = [];
  const seen = new Set([w.key]);
  const isTime = (t: number): boolean => w.times.some((x) => Math.abs(x - t) < 1e-9);
  let lo = 0;
  let hi = 0;
  // jenis jebakan yang belum dipakai didahulukan, supaya pilihan tidak semuanya "meleset satu jam"
  const mixed = shuffle(rng, w.pool);
  const firsts = mixed.filter(([, trap], i) => mixed.findIndex(([, x]) => x === trap) === i);
  for (const [t, trap] of [...firsts, ...mixed.filter((e) => !firsts.includes(e))]) {
    if (t === undefined || t <= 0 || !Number.isInteger(t) || seen.has(t)) continue;
    // jebakan "bukan di pola" tidak boleh jatuh tepat di salah satu kemunculan
    if ((trap === TRAPS.pola || trap === TRAPS.puncak || trap === TRAPS.tengahWaktu) && isTime(t)) continue;
    if (t < w.key ? lo >= pos : hi >= 4 - pos) continue;
    if (t < w.key) lo++;
    else hi++;
    seen.add(t);
    out.push([t, trap]);
    if (out.length === 4) return out;
  }
  return null;
}

// ---------- gambar ----------
function figure(w: Raw): string {
  const { a, b, P } = w;
  const M = a + b;
  const m = a - b;
  const VW = 260;
  const VH = 200;
  const L = 58;
  const TOP = 34;
  const BOT = 26;
  const tMax = P * 1.08;
  const yLo = m - 0.35 * b;
  const yHi = M + 0.3 * b;
  const X = (t: number): number => L + (t / tMax) * (VW - L - 12);
  const Y = (y: number): number => TOP + ((yHi - y) / (yHi - yLo)) * (VH - TOP - BOT);
  const f1 = (v: number): string => v.toFixed(1);
  let d = '';
  for (let t = 0; t <= tMax + 1e-9; t += tMax / 120)
    d += `${d ? 'L' : 'M'}${f1(X(t))} ${f1(Y(a + b * Math.cos((2 * Math.PI * t) / P)))}`;
  const guide = (t: number, y: number): string =>
    `<path class="lt-guide" d="M${f1(X(0))} ${f1(Y(y))}H${f1(X(t))}V${f1(Y(yLo))}"/>`;
  return `<figure class="lat-fig is-graph"><svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="Grafik kedalaman y = a + b cos(${kText(P)}): puncak ${dec(M)} meter di t = 0 dan t = ${P}, lembah ${dec(m)} meter di t = ${P / 2}">
<text class="lt-eq" x="${f1(X(P / 2))}" y="16">y = a + b cos(${kText(P)})</text>
<path class="lt-ax" d="M${f1(X(0))} ${f1(Y(yHi) - 6)}V${f1(Y(yLo))}H${f1(X(tMax) + 6)}"/>
${guide(P, M)}${guide(P / 2, m)}
<path class="lt-curve" d="${d}"/>
<text class="lt-yl" x="${f1(X(0) - 4)}" y="${f1(Y(M) + 4)}">${dec(M)} m</text>
<text class="lt-yl" x="${f1(X(0) - 4)}" y="${f1(Y(m) + 4)}">${dec(m)} m</text>
<text class="lt-tl" x="${f1(X(P / 2))}" y="${f1(Y(yLo) + 14)}">${P / 2}</text>
<text class="lt-tl" x="${f1(X(P))}" y="${f1(Y(yLo) + 14)}">${P}</text>
<text class="lt-tl" x="${f1(X(tMax) + 4)}" y="${f1(Y(yLo) + 4)}">t</text>
<text class="lt-tl" x="${f1(X(0))}" y="${f1(Y(yHi) - 9)}">y</text>
</svg></figure>`;
}

// ---------- penyelesaian (baris papan) ----------
function solution(w: Raw): Instance['solution'] {
  const { a, b, P, n, kind, key, times } = w;
  const M = a + b;
  const m = a - b;
  const list = (k: number): string => `${times.slice(0, k).join(',\\ ')},\\ \\dots`;
  const ans: Row = {
    id: 'z1',
    toks: [H('z1a', `ke-${n}`, 'tx'), O('z1b', '\\to'), T('z1c', `t=${key}`, 'gold')],
    box: 'gold',
  };
  const mid: Row = {
    id: 'g1',
    toks: [
      H('g1a', 'garis tengah', 'tx'),
      O('g1b', '='),
      T('g1c', `${decTex(m)}+\\tfrac{${decTex(M)}-${decTex(m)}}{2}`),
      O('g1d', '='),
      T('g1e', decTex(a), 'blue'),
    ],
    note: 'lembah ditambah setengah selisih puncak dan lembah',
    box: 'navy',
  };
  if (kind === 'tengah')
    return [
      { title: 'Garis tengah', rows: [mid] },
      {
        title: 'Waktu dari grafik',
        rows: [
          {
            id: 'w1',
            toks: [
              H('w1a', 'tengah waktu', 'tx'),
              O('w1b', '='),
              T('w1c', `${P / 2}\\div2`),
              O('w1d', '='),
              T('w1e', String(P / 4), 'blue'),
            ],
            note: `dari puncak ($t=0$) ke lembah ($t=${P / 2}$)`,
          },
          {
            id: 'w2',
            toks: [
              H('w2a', 'di garis tengah', 'tx'),
              O('w2b', '\\to'),
              T('w2c', `t=${list(Math.min(n + 1, 5))}`, 'blue'),
            ],
            note: `berulang tiap $${P / 2}$ jam (setengah gelombang)`,
          },
        ],
      },
      { title: 'Hitung kemunculan', rows: [ans] },
    ];
  if (kind === 'lembah')
    return [
      {
        title: 'Lembah dari grafik',
        rows: [
          {
            id: 'w1',
            toks: [H('w1a', 'lembah pertama', 'tx'), O('w1b', '\\to'), T('w1c', `t=${P / 2}`, 'blue')],
            note: `kedalaman terendah $${decTex(m)}$ m`,
          },
          {
            id: 'w2',
            toks: [H('w2a', 'lembah', 'tx'), O('w2b', '\\to'), T('w2c', `t=${list(n + 1)}`, 'blue')],
            note: `berulang tiap satu gelombang, $${P}$ jam`,
          },
        ],
      },
      { title: 'Hitung kemunculan', rows: [ans] },
    ];
  const sgn = kind === 'atas' ? '' : '-';
  return [
    {
      title: 'Model dari grafik',
      rows: [
        { ...mid, note: `$a$ = garis tengah; $b=\\tfrac{${decTex(M)}-${decTex(m)}}{2}=${decTex(b)}$` },
        {
          id: 'g2',
          toks: [
            T('g2a', 'y'),
            O('g2b', '='),
            T('g2c', `${decTex(a)}+${decTex(b)}\\cos\\left(${kTex(P)}\\right)`, 'blue'),
          ],
          note: `mulai dari puncak → kosinus; satu gelombang $${P}$ jam → $\\frac{2\\pi}{${P}}$`,
        },
      ],
    },
    {
      title: 'Bukan garis tengah: pakai rumus',
      rows: [
        {
          id: 'e1',
          toks: [
            T('e1a', `\\cos\\left(${kTex(P)}\\right)`),
            O('e1b', '='),
            T('e1c', `${sgn}\\tfrac12`, 'blue'),
          ],
          note: `$${decTex(w.target)}-${decTex(a)}=${sgn}${decTex(b / 2)}$, lalu dibagi $${decTex(b)}$`,
        },
        {
          id: 'e2',
          toks: [T('e2a', 't'), O('e2b', '='), T('e2c', list(Math.min(n + 1, 4)), 'blue')],
          note:
            kind === 'atas'
              ? 'sudut $\\frac\\pi3,\\frac{5\\pi}3,\\frac{7\\pi}3,\\dots$'
              : 'sudut $\\frac{2\\pi}3,\\frac{4\\pi}3,\\frac{8\\pi}3,\\dots$',
        },
      ],
    },
    { title: 'Hitung kemunculan', rows: [ans] },
  ];
}

function hints(w: Raw): [string, string, string] {
  const { a, b, P, kind } = w;
  if (kind === 'tengah')
    return [
      'Cari garis tengahnya dulu: lembah ditambah setengah selisih puncak dan lembah.',
      `Garis tengahnya $${decTex(a)}$ m. Dari puncak ($t=0$) ke lembah ($t=${P / 2}$), garis tengah dilewati tepat di tengah waktunya.`,
      `Garis tengah dilewati di $t=${P / 4}$, lalu tiap $${P / 2}$ jam. Hitung sampai kemunculan yang diminta.`,
    ];
  if (kind === 'lembah')
    return [
      'Baca dari grafik kapan lembah pertama dicapai.',
      `Lembah pertama di $t=${P / 2}$. Lembah berikutnya datang setelah satu gelombang penuh.`,
      `Lembah berulang tiap $${P}$ jam. Hitung sampai lembah yang diminta.`,
    ];
  return [
    `Kedalaman ini bukan garis tengah ($${decTex(a)}$ m), jadi tengah-tengah waktu tidak berlaku: pakai rumus.`,
    `Modelnya $y=${decTex(a)}+${decTex(b)}\\cos\\left(${kTex(P)}\\right)$. Samakan dengan kedalaman yang ditanya.`,
    `Dapat $\\cos\\left(${kTex(P)}\\right)=${kind === 'atas' ? '' : '-'}\\frac12$. Tulis semua sudutnya berurutan, lalu ubah ke $t$.`,
  ];
}

const FALLBACK: Record<Level, number[]> = { mudah: [2, 7], sedang: [4, 9], menantang: [5, 11] };

function build(seed: number, level: Level): Instance | null {
  const rng = mulberry32(seed);
  for (let tries = 0; tries < 20; tries++) {
    const w = raw(rng, level);
    if (!w) continue;
    const ds = distractors(rng, w);
    if (!ds) continue;
    const opts = [
      { t: w.key, trap: undefined as Trap | undefined },
      ...ds.map(([t, trap]) => ({ t, trap })),
    ].sort((x, y) => x.t - y.t);
    const keyIdx = opts.findIndex((o) => !o.trap);
    const options: Option[] = opts.map((o) => ({
      tex: `\\text{${o.t} jam}`,
      ok: !o.trap,
      ...(o.trap ? { trap: o.trap } : {}),
    }));
    const place = pick(rng, PLACES);
    const what =
      w.kind === 'lembah'
        ? `mencapai kedalaman terendah (${dec(w.target)} meter) untuk ${ORD[w.n]} kalinya`
        : `mencapai ${dec(w.target)} meter untuk ${ORD[w.n]} kalinya`;
    const paper = `<div class="lat24"><div>
<p>Grafik berikut menyatakan kedalaman air laut $y$ meter di sebuah ${place}, $t$ jam setelah pukul 00.00, dengan $a$ dan $b$ konstanta.</p>
<p>Waktu saat kedalaman air laut ${what} setelah pukul 00.00 adalah ....</p>
</div>${figure(w)}</div>`;
    const y = (t: number): number => w.a + w.b * Math.cos((2 * Math.PI * t) / w.P);
    return {
      no: 11,
      seed,
      level,
      code: toCode(seed, level),
      paper,
      options,
      key: keyIdx,
      summary: `${decTex(w.target)}\\ \\text{m, ke-}${w.n}`,
      chapter: w.kind === 'atas' || w.kind === 'bawah' ? 5 : 4,
      hints: hints(w),
      solution: solution(w),
      timeAdvice: level === 'mudah' ? 120 : level === 'sedang' ? 150 : 210,
      test(i) {
        const t = opts[i]!.t;
        const at = w.times.findIndex((x) => Math.abs(x - t) < 1e-9);
        return {
          tex: `y(${t})=${decTex(y(t))}${at >= 0 ? `\\ \\text{(kemunculan ke-${at + 1})}` : `\\ne${decTex(w.target)}`}`,
          ok: !opts[i]!.trap,
        };
      },
      params: { kind: w.kind, a: w.a, b: w.b, P: w.P, n: w.n, target: w.target, opts: opts.map((o) => o.t) },
    };
  }
  return null;
}

/** kemunculan kedalaman target pada y(t) = a + b cos(2πt/P), dihitung numerik pada kisi halus (oracle) */
function occurrences(a: number, b: number, P: number, target: number, tEnd: number): number[] {
  const f = (t: number): number => a + b * Math.cos((2 * Math.PI * t) / P) - target;
  const out: number[] = [];
  const h = P / 4800;
  for (let t = h; t < tEnd; t += h) {
    const [f0, f1, f2] = [f(t - h), f(t), f(t + h)];
    if (Math.abs(f1) < 1e-9 && Math.abs(f1) <= Math.abs(f0) && Math.abs(f1) <= Math.abs(f2)) out.push(t);
    else if (f0 * f1 < 0) {
      // akar di antara t − h dan t: bagi dua
      let [lo, hi] = [t - h, t];
      for (let k = 0; k < 60; k++) {
        const mid = (lo + hi) / 2;
        if (f(lo) * f(mid) <= 0) hi = mid;
        else lo = mid;
      }
      out.push((lo + hi) / 2);
    } else if (f1 < f0 && f1 <= f2 && Math.abs(f1) < 1e-6) out.push(t);
  }
  // gabungkan temuan yang berdekatan (satu kemunculan)
  return out.filter((t, i) => i === 0 || t - out[i - 1]! > P / 100);
}

export const gen11: Generator = {
  no: 11,
  levels: {
    mudah: 'Garis tengah ke-n, seperti soal asli: cukup logika dari grafik.',
    sedang: 'Garis tengah lebih jauh, atau lembah ke-n.',
    menantang: 'Kedalaman yang bukan garis tengah: perlu rumus.',
  },
  make(seed, level) {
    // §11.1 butir 1: gagal 20 kali → pakai varian cadangan yang sudah terbukti valid
    return build(seed, level) ?? build(FALLBACK[level][seed % 2]!, level)!;
  },
  oracle(inst) {
    const { a, b, P, n, target } = inst.params as {
      a: number;
      b: number;
      P: number;
      n: number;
      target: number;
    };
    const opts = inst.params.opts as number[];
    const occ = occurrences(a, b, P, target, Math.max(...opts) + P);
    const nth = occ[n - 1];
    if (nth === undefined) return false;
    const good = opts.map((t, i) => (Math.abs(t - nth) < 1e-4 ? i : -1)).filter((i) => i >= 0);
    return good.length === 1 && good[0] === inst.key && inst.options[inst.key]!.ok;
  },
};
