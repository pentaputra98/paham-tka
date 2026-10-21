/**
 * Generator latihan soal 24 — kerucut es krim dan limit (PRD §11.4 baris 24). Pilihan banyak: siswa memilih
 * semua pernyataan yang benar (1 atau 2 dari 5).
 *  - Mudah: R = X/Y (Y setengah lingkaran), struktur sama dengan soal asli; sudut a ≠ π/6 (soal asli).
 *  - Sedang: R = Y/X (dibalik); urutan pernyataan diacak.
 *  - Menantang: R = X/Y dengan Y luas lingkaran penuh berdiameter AB; urutan pernyataan diacak.
 * Lima templat pernyataan: jari-jari berpengaruh (salah), sudut tidak berpengaruh (salah), nilai konstan (salah),
 * nilai limit di θ → a (benar/salah), nilai di ujung θ → π atau θ → 0⁺ (benar/salah).
 * Nilai salah dibuat dari jebakan konsep: tan a bukan tan(a/2), tanpa π, terbalik, setengah vs lingkaran penuh,
 * nol vs tak hingga. Nilai eksak dihitung dalam bentuk (p + q√3)/d · π^k (tanpa fungsi tan).
 * Oracle: X dari koordinat (rumus tali sepatu), Y dari integral numerik Simpson, limit dari evaluasi di a ± 10⁻⁴.
 */
import { H, O, T } from '../engine/dsl';
import type { Row } from '../engine/types';
import { mulberry32, pick, type Rng } from '../core/prng';
import { toCode, type Generator, type Instance, type Level, type Option, type Trap } from './types';

// ---------- bilangan bentuk (p + q√3)/d ----------
interface Surd {
  p: number;
  q: number;
  d: number;
}
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
function sd(p: number, q: number, d = 1): Surd {
  const s = d < 0 ? -1 : 1;
  const g = gcd(gcd(Math.abs(p), Math.abs(q)), Math.abs(d)) || 1;
  return { p: (s * p) / g, q: (s * q) / g, d: Math.abs(d) / g };
}
/** s × n/m */
const sMul = (s: Surd, n: number, m = 1): Surd => sd(s.p * n, s.q * n, s.d * m);
/** 1/s = d(p − q√3)/(p² − 3q²) */
const sInv = (s: Surd): Surd => sd(s.d * s.p, -s.d * s.q, s.p * s.p - 3 * s.q * s.q);
const sNum = (s: Surd): number => (s.p + s.q * Math.sqrt(3)) / s.d;

/** Nilai eksak s · π^k. */
interface Val {
  s: Surd;
  k: -1 | 0 | 1;
}
const vNum = (v: Val): number => sNum(v.s) * Math.PI ** v.k;

function termTex(p: number, q: number): string {
  const r = `${Math.abs(q) === 1 ? '' : Math.abs(q)}\\sqrt3`;
  if (q === 0) return String(p);
  if (p === 0) return `${q < 0 ? '-' : ''}${r}`;
  return `${p}${q < 0 ? '-' : '+'}${r}`;
}

/** LaTeX nilai eksak; fr = \frac (dalam kalimat) atau \dfrac (papan). */
function vTex(v: Val, fr = '\\frac'): string {
  const { p, q, d } = v.s;
  let num = termTex(p, q);
  let den = d === 1 ? '' : String(d);
  if (v.k === 1) num = num === '1' ? '\\pi' : p !== 0 && q !== 0 ? `(${num})\\pi` : `${num}\\pi`;
  if (v.k === -1) den = `${den}\\pi`;
  return den ? `${fr}{${num}}{${den}}` : num;
}

// ---------- struktur soal ----------
type Kind = 'XY' | 'YX' | 'XYp';
const KIND: Record<Level, Kind> = { mudah: 'XY', sedang: 'YX', menantang: 'XYp' };
const RATIO: Record<Kind, string> = { XY: '\\frac{X}{Y}', YX: '\\frac{Y}{X}', XYp: '\\frac{X}{Y}' };
const HALF = '\\tan\\frac{\\theta}{2}';
const FORMULA: Record<Kind, string> = {
  XY: `\\frac{2}{\\pi${HALF}}`,
  YX: `\\frac{\\pi${HALF}}{2}`,
  XYp: `\\frac{1}{\\pi${HALF}}`,
};

/** R sebagai fungsi T = tan(θ/2): X/Y = 2/(πT), Y/X = πT/2, X/Y' = 1/(πT). */
function valOf(kind: Kind, t: Surd): Val {
  if (kind === 'XY') return { s: sMul(sInv(t), 2), k: -1 };
  if (kind === 'YX') return { s: sMul(t, 1, 2), k: 1 };
  return { s: sInv(t), k: -1 };
}

interface Angle {
  /** LaTeX sudut a */
  a: string;
  rad: number;
  /** setengah sudut (derajat) */
  half: number;
  /** tan(a/2) */
  t: Surd;
  /** tan a (jebakan "sudut penuh"); null bila tak terdefinisi atau negatif */
  tFull: Surd | null;
}
const ANGLES: Angle[] = [
  { a: '\\frac{\\pi}{6}', rad: Math.PI / 6, half: 15, t: sd(2, -1), tFull: sd(0, 1, 3) },
  { a: '\\frac{\\pi}{3}', rad: Math.PI / 3, half: 30, t: sd(0, 1, 3), tFull: sd(0, 1) },
  { a: '\\frac{\\pi}{2}', rad: Math.PI / 2, half: 45, t: sd(1, 0), tFull: null },
  { a: '\\frac{2\\pi}{3}', rad: (2 * Math.PI) / 3, half: 60, t: sd(0, 1), tFull: null },
];
const NAMES: Array<[string, string, string]> = [
  ['A', 'B', 'C'],
  ['P', 'Q', 'R'],
  ['K', 'L', 'M'],
  ['D', 'E', 'F'],
];

/** Jebakan; bab mengacu ke pembahasan soal 24 (2 = luas setengah lingkaran, 3 = segitiga, 4 = X/Y, 5 = uji). */
const TRAPS = {
  r: {
    id: 'r-tidak-dicoret',
    hint: 'Hati-hati, $r^2$ muncul di pembilang dan penyebut sehingga saling coret. Jari-jari tidak memengaruhi nilainya.',
    chapter: 4,
  },
  sudut: {
    id: 'sudut-ikut-hilang',
    hint: 'Perhatikan, setelah $r^2$ dicoret masih tersisa $\\tan\\frac\\theta2$. Nilainya berubah saat sudut berubah.',
    chapter: 4,
  },
  konstan: {
    id: 'konstan-karena-r-hilang',
    hint: 'Hati-hati, yang hilang hanya $r$. Coba dua sudut berbeda, misalnya $90^\\circ$ dan $60^\\circ$: nilainya berbeda.',
    chapter: 5,
  },
  tanPenuh: {
    id: 'cot-theta-bukan-setengah',
    hint: 'Hati-hati, yang dipakai $\\tan\\frac a2$ (setengah sudut), bukan $\\tan a$. Garis tinggi membelah sudut puncak.',
    chapter: 3,
  },
  tanpaPi: {
    id: 'tanpa-faktor-pi',
    hint: 'Perhatikan, luas lingkaran memuat $\\pi$. Faktor $\\pi$ tidak boleh hilang dari hasilnya.',
    chapter: 2,
  },
  terbalik: {
    id: 'terbalik',
    hint: 'Perhatikan urutannya: nilai pada pilihan ini adalah kebalikan dari perbandingan yang ditanya.',
    chapter: 4,
  },
  setengah: {
    id: 'setengah-vs-penuh',
    hint: 'Hati-hati, $Y$ adalah luas setengah lingkaran, $\\frac12\\pi r^2$, bukan luas lingkaran penuh.',
    chapter: 2,
  },
  penuh: {
    id: 'penuh-vs-setengah',
    hint: 'Hati-hati, di soal ini $Y$ adalah luas lingkaran penuh, $\\pi r^2$, bukan setengahnya.',
    chapter: 2,
  },
  ujung: {
    id: 'limit-nol-vs-tak-hingga',
    hint: 'Perhatikan arah sudutnya. Saat $\\theta\\to\\pi$ segitiga memipih (tinggi menuju $0$); saat $\\theta\\to0^+$ segitiga memanjang tanpa batas.',
    chapter: 5,
  },
} satisfies Record<string, Trap>;

type End = 'pi' | 'nol';
type Lim = '0' | 'inf';
/** Nilai R di ujung: X di pembilang → 0 saat θ → π, tak hingga saat θ → 0⁺; Y/X kebalikannya. */
const endTruth = (kind: Kind, e: End): Lim =>
  kind === 'YX' ? (e === 'pi' ? 'inf' : '0') : e === 'pi' ? '0' : 'inf';

type Stmt =
  | { type: 'r'; ok: false }
  | { type: 'sudut'; ok: false }
  | { type: 'konstan'; ok: false }
  | { type: 'limit'; ok: boolean; a: number; claim: number }
  | { type: 'ujung'; ok: boolean; e: End; claim: Lim };

interface Made {
  html: string;
  ok: boolean;
  trap?: Trap;
  why: string;
  row: (n: string, id: string) => Row;
  test: string;
  stmt: Stmt;
}

const verdict = (ok: boolean): string => (ok ? '<b class="k-gold">benar</b>' : '<b class="k-red">salah</b>');

function shuffle<T>(rng: Rng, a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [b[i], b[j]] = [b[j]!, b[i]!];
  }
  return b;
}

function build(seed: number, level: Level): Instance | null {
  const rng = mulberry32(seed);
  const kind = KIND[level];
  const R = RATIO[kind];
  const formula = FORMULA[kind];
  // bentuk papan: pecahan luar \dfrac agar terbaca
  const big = formula.replace('\\frac', '\\dfrac');
  const nm = pick(rng, NAMES);
  const [A, B, C] = nm;
  const AB = `${A}${B}`;
  // soal asli memakai a = π/6 dengan struktur X/Y: tingkat Mudah memakai sudut lain
  const ang = pick(rng, level === 'mudah' ? ANGLES.slice(1) : ANGLES);
  const truth = valOf(kind, ang.t);
  // banyak pernyataan benar 1 atau 2: (limit, ujung) ∈ {(B,B), (B,S), (S,B)}
  const combo = pick(rng, [
    [true, true],
    [true, false],
    [false, true],
  ] as const);

  // ---- pernyataan limit θ → a ----
  const lim = `\\lim_{\\theta\\to${ang.a}}${R}`;
  let claim = truth;
  let limTrap: Trap | undefined;
  if (!combo[0]) {
    const pool: Array<[Val, Trap]> = [
      [{ s: truth.s, k: 0 }, TRAPS.tanpaPi],
      [{ s: sInv(truth.s), k: -truth.k as Val['k'] }, TRAPS.terbalik],
      kind === 'XYp'
        ? [{ s: sMul(truth.s, 2), k: truth.k }, TRAPS.penuh]
        : [{ s: kind === 'XY' ? sMul(truth.s, 1, 2) : sMul(truth.s, 2), k: truth.k }, TRAPS.setengah],
    ];
    if (ang.tFull) pool.push([valOf(kind, ang.tFull), TRAPS.tanPenuh]);
    const ok = pool.filter(([v]) => Math.abs(vNum(v) - vNum(truth)) > 0.02 * vNum(truth));
    if (!ok.length) return null;
    [claim, limTrap] = pick(rng, ok);
  }
  const tTex = vTex({ s: ang.t, k: 0 });
  const trueTex = vTex(truth);
  const limit: Made = {
    html: `$${lim}=${vTex(claim)}$`,
    ok: combo[0],
    ...(limTrap ? { trap: limTrap } : {}),
    why: `$\\tan${ang.half}^\\circ=${tTex}$, sehingga $${lim}=${trueTex}$${combo[0] ? '' : `, bukan $${vTex(claim)}$`}.`,
    row: (n, id) => ({
      id,
      toks: [
        T(`${id}a`, n, 'sp'),
        T(`${id}b`, `\\tan${ang.half}^\\circ`),
        O(`${id}c`, '='),
        T(`${id}d`, tTex, 'blue'),
        O(`${id}e`, '\\Rightarrow'),
        T(`${id}f`, `${R}=${vTex(truth, '\\dfrac')}`),
      ],
      note: combo[0] ? `sesuai → ${verdict(true)}` : `bukan $${vTex(claim)}$ → ${verdict(false)}`,
    }),
    test: `${lim}=${trueTex}`,
    stmt: { type: 'limit', ok: combo[0], a: ang.rad, claim: vNum(claim) },
  };

  // ---- pernyataan ujung: θ = π (θ → π⁻) atau θ → 0⁺ ----
  const e: End = pick(rng, ['pi', 'nol'] as const);
  const real = endTruth(kind, e);
  const said: Lim = combo[1] ? real : real === '0' ? 'inf' : '0';
  const limE = e === 'pi' ? '\\pi^-' : '0^+';
  const endHtml =
    e === 'pi' && said === '0' && kind !== 'YX'
      ? `Jika $\\theta=\\pi$ maka $${R}=0$`
      : `$\\lim_{\\theta\\to${limE}}${R}=${said === '0' ? '0' : '\\infty'}$`;
  const xTo = e === 'pi' ? 'X\\to0' : 'X\\to\\infty';
  const endWhy =
    (e === 'pi'
      ? `Saat $\\theta\\to\\pi$, titik $${C}$ jatuh ke $${AB}$ sehingga tinggi dan $X$ menuju $0$`
      : `Saat $\\theta\\to0^+$, $\\tan\\frac\\theta2\\to0$ sehingga tinggi dan $X$ membesar tanpa batas`) +
    `; jadi $${R}\\to${real === '0' ? '0' : '\\infty'}$.`;
  const ujung: Made = {
    html: endHtml,
    ok: combo[1],
    ...(combo[1] ? {} : { trap: TRAPS.ujung }),
    why: endWhy,
    row: (n, id) => ({
      id,
      toks: [
        T(`${id}a`, n, 'sp'),
        T(`${id}b`, `\\theta\\to${limE}`),
        O(`${id}c`, ':'),
        T(`${id}d`, xTo, 'blue'),
        O(`${id}e`, '\\Rightarrow'),
        T(`${id}f`, `${R}\\to${real === '0' ? '0' : '\\infty'}`),
      ],
      note: `${e === 'pi' ? 'segitiga memipih' : 'segitiga memanjang'} → ${verdict(combo[1])}`,
    }),
    test: `\\lim_{\\theta\\to${limE}}${R}=${real === '0' ? '0' : '\\infty'}`,
    stmt: { type: 'ujung', ok: combo[1], e, claim: said },
  };

  // ---- tiga pernyataan yang selalu salah (kalimat bervariasi, tidak sama persis dengan soal asli) ----
  const rText = pick(rng, [
    'Besar jari-jari mempengaruhi nilai limit.',
    `Nilai limit berubah jika panjang $${AB}$ diperbesar.`,
    `Semakin panjang $${AB}$, semakin besar nilai limitnya.`,
  ]);
  const sText = pick(rng, [
    'Besar sudut tidak mempengaruhi nilai limit.',
    'Nilai limit sama untuk setiap nilai $a$.',
  ]);
  const kText = pick(rng, [
    `Nilai $${R}$ selalu sama untuk berapa pun $\\theta$.`,
    `Nilai $${R}$ tidak bergantung pada besar sudut $\\theta$.`,
  ]);
  const v90 = vTex(valOf(kind, sd(1, 0)));
  const v60 = vTex(valOf(kind, sd(0, 1, 3)));
  const jari: Made = {
    html: rText,
    ok: false,
    trap: TRAPS.r,
    why: `$r^2$ di pembilang dan penyebut saling coret, jadi $${R}=${formula}$ tanpa $r$.`,
    row: (n, id) => ({
      id,
      toks: [
        T(`${id}a`, n, 'sp'),
        T(`${id}b`, 'r', 'red'),
        H(`${id}c`, 'tidak ada di', 'tx'),
        T(`${id}d`, big),
      ],
      note: `jari-jari tidak berpengaruh → ${verdict(false)}`,
    }),
    test: `r^2\\text{ dicoret: }${R}=${formula}`,
    stmt: { type: 'r', ok: false },
  };
  const sudut: Made = {
    html: sText,
    ok: false,
    trap: TRAPS.sudut,
    why: `$${R}=${formula}$ masih memuat sudut, jadi nilai limitnya bergantung pada $a$.`,
    row: (n, id) => ({
      id,
      toks: [
        T(`${id}a`, n, 'sp'),
        T(`${id}b`, `\\lim_{\\theta\\to a}${R}`),
        O(`${id}c`, '='),
        T(`${id}d`, big.replace('\\frac{\\theta}{2}', '\\frac{a}{2}')),
      ],
      note: `bergantung pada $a$ → ${verdict(false)}`,
    }),
    test: `${R}=${formula}`,
    stmt: { type: 'sudut', ok: false },
  };
  const konstan: Made = {
    html: kText,
    ok: false,
    trap: TRAPS.konstan,
    why: `Di $\\theta=90^\\circ$ nilainya $${v90}$, di $\\theta=60^\\circ$ nilainya $${v60}$: berbeda.`,
    row: (n, id) => ({
      id,
      toks: [
        T(`${id}a`, n, 'sp'),
        T(`${id}b`, `90^\\circ:\\ ${vTex(valOf(kind, sd(1, 0)), '\\dfrac')}`),
        O(`${id}c`, '\\ne'),
        T(`${id}d`, `60^\\circ:\\ ${vTex(valOf(kind, sd(0, 1, 3)), '\\dfrac')}`),
      ],
      note: `nilainya berubah → ${verdict(false)}`,
    }),
    test: `${v90}\\ne${v60}`,
    stmt: { type: 'konstan', ok: false },
  };

  const base = [jari, sudut, konstan, limit, ujung];
  const order = level === 'mudah' ? base : shuffle(rng, base);
  const label = (i: number): string => `(${i + 1})`;
  const options: Option[] = order.map((m) => ({
    tex: '',
    html: m.html,
    ok: m.ok,
    why: m.why,
    ...(m.trap ? { trap: m.trap } : {}),
  }));
  const keys = order.map((m, i) => (m.ok ? i : -1)).filter((i) => i >= 0);
  const keyText = keys.map(label).join(' dan ');

  // ---- penyelesaian (baris papan) ----
  const Ytex = kind === 'XYp' ? '\\pi r^2' : '\\tfrac12\\pi r^2';
  const ratioRow: Row = {
    id: 'g1',
    toks: [
      T('g1a', R.replace('\\frac', '\\dfrac')),
      O('g1b', '='),
      T(
        'g1c',
        kind === 'YX'
          ? `\\dfrac{\\tfrac12\\pi\\cancel{r^2}}{\\dfrac{\\cancel{r^2}}{${HALF}}}`
          : `\\dfrac{\\dfrac{\\cancel{r^2}}{${HALF}}}{${kind === 'XYp' ? '' : '\\tfrac12'}\\pi\\cancel{r^2}}`,
      ),
    ],
    note: '$r^2$ di atas dan di bawah saling coret',
  };
  const tests = order.map((m, i) => m.row(label(i), `u${i + 1}`));
  const solution: Instance['solution'] = [
    {
      title: 'Nyatakan X dan Y',
      rows: [
        {
          id: 'y1',
          toks: [T('y1a', 'Y'), O('y1b', '='), T('y1c', Ytex, 'blue')],
          note:
            kind === 'XYp' ? `luas lingkaran berdiameter $${AB}=2r$` : `luas setengah lingkaran, $${AB}=2r$`,
        },
        {
          id: 'x1',
          toks: [T('x1a', 't'), O('x1b', '='), T('x1c', `\\dfrac{r}{${HALF}}`)],
          note: '$\\tan\\frac\\theta2=\\frac{\\text{depan}}{\\text{samping}}=\\frac rt$',
        },
        {
          id: 'x2',
          toks: [
            T('x2a', 'X'),
            O('x2b', '='),
            T('x2c', '\\tfrac12\\cdot2r\\cdot t'),
            O('x2d', '='),
            T('x2e', `\\dfrac{r^2}{${HALF}}`, 'blue'),
          ],
          note: 'alas $2r$, tinggi $t$',
          box: 'navy',
        },
      ],
    },
    {
      title: `Sederhanakan ${kind === 'YX' ? 'Y/X' : 'X/Y'}`,
      rows: [
        ratioRow,
        {
          id: 'g2',
          toks: [T('g2a', R.replace('\\frac', '\\dfrac')), O('g2b', '='), T('g2c', big)],
          note: 'jari-jari hilang, sudut tetap ada',
          box: 'navy',
        },
      ],
    },
    { title: 'Uji pernyataan (1)–(3)', rows: tests.slice(0, 3) },
    {
      title: 'Uji pernyataan (4)–(5)',
      rows: [
        ...tests.slice(3),
        {
          id: 'ans',
          toks: [H('ansa', 'Jawaban', 'lbl'), H('ansb', `pernyataan ${keyText}`, 'tx')],
          box: 'gold',
        },
      ],
    },
  ];

  const yDesc = kind === 'XYp' ? `luas lingkaran yang berdiameter $${AB}$` : 'luas setengah lingkaran';
  const paper = `<div class="lat24"><div>
<p>Sebuah setengah lingkaran dengan diameter $${AB}$ terletak pada segitiga sama kaki $${A}${B}${C}$ (sudut puncak $\\theta$ di $${C}$) sehingga membentuk daerah menyerupai kerucut es krim.</p>
<p>Jika luas segitiga $${A}${B}${C}$ dinyatakan dengan $X$ dan ${yDesc} dinyatakan dengan $Y$, manakah pernyataan berikut yang benar mengenai nilai $\\lim_{\\theta\\to a}${R}$?</p>
<p class="lat-multi-note">Pilih semua pernyataan yang benar.</p>
</div>${figure(nm, kind === 'XYp')}</div>`;

  return {
    no: 24,
    seed,
    level,
    code: toCode(seed, level),
    paper,
    options,
    key: keys[0]!,
    multi: true,
    summary: `\\lim_{\\theta\\to a}${R}`,
    chapter: 5,
    hints: [
      `Nyatakan $X$ dan $Y$ dengan $r$ dan $\\theta$. Tinggi segitiga $t$ didapat dari $\\tan\\frac\\theta2=\\frac rt$.`,
      `Langkah pertama: $X=\\frac{r^2}{${HALF}}$ dan $Y=${Ytex}$. Susun $${R}$, lalu coret $r^2$.`,
      `Hasilnya $${R}=${formula}$. Uji tiap pernyataan, misalnya dengan $\\tan${ang.half}^\\circ=${tTex}$.`,
    ],
    solution,
    timeAdvice: level === 'mudah' ? 150 : level === 'sedang' ? 180 : 240,
    test(i) {
      const m = order[i]!;
      return { tex: m.test, ok: m.ok };
    },
    params: { kind, names: nm, a: ang.rad, stmts: order.map((m) => m.stmt) },
  };
}

/** Gambar kerucut es krim (sudut puncak di bawah); Menantang: lingkaran penuh putus-putus. */
function figure(nm: [string, string, string], full: boolean): string {
  const [A, B, C] = nm;
  return `<figure class="lat-fig"><svg viewBox="0 0 200 205" role="img" aria-label="Setengah lingkaran berdiameter ${A}${B} di atas segitiga sama kaki ${A}${B}${C} dengan sudut θ di ${C}${full ? '; lingkaran penuh berdiameter ' + A + B + ' digambar putus-putus' : ''}">
${full ? '<path d="M40 80 A60 60 0 0 0 160 80" class="lf-full"/>' : ''}<path d="M40 80 A60 60 0 0 1 160 80 Z" class="lf-semi"/>
<path d="M40 80 L160 80 L100 190 Z" class="lf-tri"/>
<path d="M90.4 172.4 A20 20 0 0 1 109.6 172.4" class="lf-ang"/>
<path d="M65.6 137.4 L74.4 132.6 M134.4 137.4 L125.6 132.6" class="lf-tick"/>
<text x="29" y="84" class="lf-pt">${A}</text><text x="171" y="84" class="lf-pt">${B}</text><text x="100" y="203" class="lf-pt">${C}</text>
<text x="100" y="163" class="lf-th">θ</text></svg></figure>`;
}

// ---------- oracle (jalur berbeda dari pembuat) ----------
/** Luas segitiga dari koordinat A(−r, 0), B(r, 0), C(0, −h) dengan rumus tali sepatu. */
function areaX(theta: number, r: number): number {
  const h = r / Math.tan(theta / 2);
  const P: Array<[number, number]> = [
    [-r, 0],
    [r, 0],
    [0, -h],
  ];
  let s = 0;
  for (let i = 0; i < 3; i++) {
    const [x1, y1] = P[i]!;
    const [x2, y2] = P[(i + 1) % 3]!;
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}
/** Luas setengah lingkaran: ∫ √(r² − x²) dx dari −r sampai r (Simpson, 4000 pias). */
function areaHalf(r: number): number {
  const n = 4000;
  const hh = (2 * r) / n;
  const f = (x: number): number => Math.sqrt(Math.max(0, r * r - x * x));
  let s = f(-r) + f(r);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(-r + i * hh);
  return (s * hh) / 3;
}
function ratio(kind: Kind, theta: number, r: number): number {
  const X = areaX(theta, r);
  const Y = kind === 'XYp' ? 2 * areaHalf(r) : areaHalf(r);
  return kind === 'YX' ? Y / X : X / Y;
}

const FALLBACK: Record<Level, number[]> = { mudah: [7, 19], sedang: [3, 29], menantang: [5, 31] };

export const gen24: Generator = {
  no: 24,
  levels: {
    mudah: 'Perbandingan X/Y seperti soal aslinya, dengan sudut dan pernyataan berbeda.',
    sedang: 'Perbandingan dibalik menjadi Y/X; urutan pernyataan diacak.',
    menantang: 'Y luas lingkaran penuh; pernyataan diacak dengan jebakan nilai.',
  },
  make(seed, level) {
    return build(seed, level) ?? build(FALLBACK[level][seed % 2]!, level)!;
  },
  oracle(inst) {
    const kind = inst.params.kind as Kind;
    const stmts = inst.params.stmts as Stmt[];
    const truth = stmts.map((s) => {
      // "jari-jari berpengaruh": benar bila nilai berubah saat r diubah (sudut tetap)
      if (s.type === 'r') return Math.abs(ratio(kind, 1, 1) - ratio(kind, 1, 3)) > 1e-6;
      // "sudut tidak berpengaruh" / "nilai selalu sama": benar bila nilai tidak berubah saat sudut diubah
      if (s.type === 'sudut' || s.type === 'konstan')
        return Math.abs(ratio(kind, 1, 2) - ratio(kind, 2, 2)) < 1e-6;
      if (s.type === 'limit') {
        const v = (ratio(kind, s.a - 1e-4, 2) + ratio(kind, s.a + 1e-4, 2)) / 2;
        const rel = Math.abs(v - s.claim) / v;
        // nilai salah harus jelas berbeda (margin), nilai benar cocok
        if (rel > 1e-3 && rel < 1e-2) return null;
        return rel <= 1e-3;
      }
      const v = ratio(kind, s.e === 'pi' ? Math.PI - 1e-4 : 1e-4, 2);
      const got: Lim | null = v < 1e-2 ? '0' : v > 1e2 ? 'inf' : null;
      return got === null ? null : got === s.claim;
    });
    const n = truth.filter((t) => t === true).length;
    return (
      truth.every((t, i) => t === inst.options[i]!.ok) &&
      n >= 1 &&
      n <= 2 &&
      new Set(inst.options.map((o) => o.html)).size === inst.options.length
    );
  },
};
