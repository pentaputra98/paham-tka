/**
 * Bank soal Ekspedisi TKA (v1.26): penguatan titik lemah kelas, bukan materi baru. Semua soal pilih satu;
 * setiap pilihan salah membawa NAMA JEBAKANNYA, yang ditampilkan saat tim keliru. Soal kembaran
 * (kesempatan kedua) dibuat dari cetakan yang sama dengan benih lain. Kunci diperiksa oracle di
 * tests/unit/eks-bank.test.ts.
 */
import { int, mulberry32, pick, type Rng } from '../core/prng';
import { frac, lin, pt, sq, terms } from '../tes/bank';
import type { PosId } from './codes';

export interface GItem {
  /** isi soal (HTML + $…$) */
  paper: string;
  options: string[];
  ok: number;
  /** nama jebakan untuk tiap pilihan (null pada kunci) */
  traps: Array<string | null>;
  /** petunjuk "Ingatkan rumus" */
  hint: string;
  /** pembahasan singkat */
  explain: string;
  /** cetakan (untuk uji) */
  tpl: string;
  /** data mentah untuk oracle uji */
  data?: Record<string, unknown>;
}

export interface PosInfo {
  id: PosId | 0;
  name: string;
  goal: string;
  /** banyak soal */
  n: number;
}

export const POS: Record<PosId | 0, PosInfo> = {
  0: { id: 0, name: 'Pemanasan', goal: 'Mencoba cara bermain', n: 2 },
  1: { id: 1, name: 'Lingkaran Kilat', goal: 'Pusat dan jari-jari dari persamaan lingkaran', n: 3 },
  2: { id: 2, name: 'Gelombang', goal: 'Fungsi trigonometri: tertinggi, terendah, nilai, periode', n: 3 },
  3: { id: 3, name: 'Tanpa Cheatsheet', goal: 'Rumus transformasi geometri di luar kepala', n: 3 },
  4: { id: 4, name: 'Detektif Aljabar', goal: 'Menemukan langkah aljabar yang salah', n: 3 },
  5: { id: 5, name: 'Museum Jebakan', goal: 'Jebakan dari soal TKA 2025', n: 3 },
  6: { id: 6, name: 'Pacu Waktu', goal: '6 soal dalam 5 menit: pilah, jangan kosongkan', n: 6 },
  7: { id: 7, name: 'Final', goal: 'Campuran tanpa petunjuk', n: 3 },
};

// ---------------------------------------------------------------------------------------------
// perakitan pilihan
// ---------------------------------------------------------------------------------------------
type Cand = [string, string | null];

/** Kunci di urutan pertama; pilihan kembar dibuang; diacak; 4–5 pilihan. */
function build(
  rng: Rng,
  cands: Cand[],
  extra: { paper: string; hint: string; explain: string; tpl: string; data?: Record<string, unknown> },
): GItem {
  const seen = new Set<string>();
  const list: Cand[] = [];
  for (const c of cands) {
    if (seen.has(c[0])) continue;
    seen.add(c[0]);
    list.push(c);
  }
  if (list.length < 4) throw new Error(`pengecoh kurang: ${extra.tpl}`);
  const key = list[0]!;
  const rest = list.slice(1);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [rest[i], rest[j]] = [rest[j]!, rest[i]!];
  }
  const chosen = [key, ...rest.slice(0, 4)];
  for (let i = chosen.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [chosen[i], chosen[j]] = [chosen[j]!, chosen[i]!];
  }
  return {
    ...extra,
    options: chosen.map((c) => c[0]),
    traps: chosen.map((c) => c[1]),
    ok: chosen.indexOf(key),
  };
}

const m = (s: string | number): string => `$${s}$`;
const nz = (rng: Rng, a: number, b: number): number => {
  let v = 0;
  while (v === 0) v = int(rng, a, b);
  return v;
};

function sqrtTex(n: number): string {
  const r = Math.round(Math.sqrt(n));
  return r * r === n ? String(r) : `\\sqrt{${n}}`;
}

/** koefisien di depan variabel: 1→x, −1→−x */
const co = (n: number, v: string): string => (n === 1 ? v : n === -1 ? `-${v}` : `${n}${v}`);

// ---------------------------------------------------------------------------------------------
// Pos 1 — Lingkaran Kilat
// ---------------------------------------------------------------------------------------------
function circle(rng: Rng): { a: number; b: number; r: number; A: number; B: number; C: number; eq: string } {
  let a = 0;
  let b = 0;
  while (Math.abs(a) === Math.abs(b)) {
    a = nz(rng, -6, 6);
    b = nz(rng, -6, 6);
  }
  const r = int(rng, 2, 7);
  const A = -2 * a;
  const B = -2 * b;
  const C = a * a + b * b - r * r;
  const eq = `${terms([
    [1, 'x^2'],
    [1, 'y^2'],
    [A, 'x'],
    [B, 'y'],
    [C, ''],
  ])}=0`;
  return { a, b, r, A, B, C, eq };
}

const HINT_CIRCLE =
  'Bentuk $x^2+y^2+Ax+By+C=0$ mempunyai pusat $\\left(-\\frac{A}{2},\\,-\\frac{B}{2}\\right)$ dan jari-jari $r=\\sqrt{\\left(\\frac{A}{2}\\right)^2+\\left(\\frac{B}{2}\\right)^2-C}$.';

function l1(rng: Rng): GItem {
  const c = circle(rng);
  return build(
    rng,
    [
      [m(pt(c.a, c.b)), null],
      [
        m(pt(-c.a, -c.b)),
        'Tanda pusat terbalik. Pusat $=\\left(-\\frac{A}{2},-\\frac{B}{2}\\right)$, tandanya berlawanan dengan $A$ dan $B$.',
      ],
      [m(pt(c.A, c.B)), 'Itu $(A, B)$ apa adanya. Pusat $=\\left(-\\frac{A}{2},-\\frac{B}{2}\\right)$.'],
      [m(pt(-c.A, -c.B)), 'Lupa membagi 2. Pusat $=\\left(-\\frac{A}{2},-\\frac{B}{2}\\right)$.'],
      [m(pt(c.b, c.a)), 'Koordinat $x$ dan $y$ tertukar.'],
      [m(pt(-c.b, -c.a)), 'Tanda terbalik dan $x$, $y$ tertukar.'],
    ],
    {
      tpl: 'l1',
      paper: `<p>Pusat lingkaran</p><p class="eq">${m(c.eq)}</p><p>adalah ….</p>`,
      hint: HINT_CIRCLE,
      explain: `$A=${c.A}$, $B=${c.B}$, jadi pusat $=\\left(-\\frac{${c.A}}{2},-\\frac{${c.B}}{2}\\right)=${pt(c.a, c.b)}$.`,
      data: { ...c, ans: [c.a, c.b] },
    },
  );
}

function l2(rng: Rng): GItem {
  const c = circle(rng);
  const s = c.a * c.a + c.b * c.b;
  const cands: Cand[] = [
    [m(c.r), null],
    [m(c.r * c.r), 'Itu $r^2$, belum diakar.'],
  ];
  if (s + c.C > 0) cands.push([m(sqrtTex(s + c.C)), 'Tanda $C$ terbalik. $r^2=a^2+b^2-C$.']);
  cands.push([
    m(sqrtTex(4 * s - c.C)),
    'Lupa membagi 2: yang dikuadratkan $\\frac{A}{2}$ dan $\\frac{B}{2}$, bukan $A$ dan $B$.',
  ]);
  cands.push([m(c.r + 1), 'Salah hitung. $r^2=a^2+b^2-C$.']);
  cands.push([m(2 * c.r), 'Itu diameter, bukan jari-jari.']);
  return build(rng, cands, {
    tpl: 'l2',
    paper: `<p>Jari-jari lingkaran</p><p class="eq">${m(c.eq)}</p><p>adalah ….</p>`,
    hint: HINT_CIRCLE,
    explain: `Pusat $${pt(c.a, c.b)}$, jadi $r^2=${c.a}^2+${c.b < 0 ? `(${c.b})` : c.b}^2-${c.C < 0 ? `(${c.C})` : c.C}=${c.r * c.r}$ dan $r=${c.r}$.`,
    data: { ...c, ans: c.r },
  });
}

function l3(rng: Rng): GItem {
  const c = circle(rng);
  const rhs = c.r * c.r;
  return build(
    rng,
    [
      [m(`${sq('x', c.a)}+${sq('y', c.b)}=${rhs}`), null],
      [
        m(`${sq('x', -c.a)}+${sq('y', -c.b)}=${rhs}`),
        'Tanda pusat terbalik. Pusat $(a,b)$ ditulis $(x-a)^2+(y-b)^2$.',
      ],
      [m(`${sq('x', c.a)}+${sq('y', c.b)}=${c.r}`), 'Ruas kanan harus $r^2$, bukan $r$.'],
      [m(`${sq('x', c.b)}+${sq('y', c.a)}=${rhs}`), 'Koordinat pusat $x$ dan $y$ tertukar.'],
      [
        m(`${sq('x', -c.a)}+${sq('y', -c.b)}=${c.r}`),
        'Tanda pusat terbalik dan ruas kanan belum dikuadratkan.',
      ],
    ],
    {
      tpl: 'l3',
      paper: `<p>Persamaan lingkaran yang berpusat di ${m(pt(c.a, c.b))} dan berjari-jari ${m(c.r)} adalah ….</p>`,
      hint: 'Lingkaran berpusat $(a,b)$ dan berjari-jari $r$: $(x-a)^2+(y-b)^2=r^2$.',
      explain: `$(x-a)^2+(y-b)^2=r^2$ dengan $a=${c.a}$, $b=${c.b}$, $r^2=${rhs}$.`,
      data: { ...c },
    },
  );
}

// ---------------------------------------------------------------------------------------------
// Pos 2 — Gelombang (fungsi trigonometri, soal 11)
// ---------------------------------------------------------------------------------------------
function wave(rng: Rng): { a: number; b: number; fn: 'cos' | 'sin'; tex: string; intro: string } {
  const a = int(rng, 5, 15);
  const b = int(rng, 2, 4);
  const fn = pick(rng, ['cos', 'sin'] as const);
  const tex = `h(t)=${a}+${b}\\${fn}\\left(\\frac{\\pi}{6}t\\right)`;
  const intro = `<p>Ketinggian air laut (meter) pada pukul $t$ dimodelkan oleh</p><p class="eq">${m(tex)}</p>`;
  return { a, b, fn, tex, intro };
}

const HINT_WAVE =
  'Nilai $\\sin$ dan $\\cos$ selalu dari $-1$ sampai $1$. Untuk $h(t)=a+b\\cos(kt)$: tertinggi $a+b$, terendah $a-b$, periode $\\frac{2\\pi}{k}$. Ingat $\\cos 0=1$, $\\cos\\frac{\\pi}{2}=0$, $\\cos\\pi=-1$, $\\sin\\frac{\\pi}{2}=1$, $\\sin\\frac{3\\pi}{2}=-1$.';

function g1(rng: Rng): GItem {
  const w = wave(rng);
  const hi = rng() < 0.5;
  const ans = hi ? w.a + w.b : w.a - w.b;
  return build(
    rng,
    [
      [m(ans), null],
      [
        m(hi ? w.a - w.b : w.a + w.b),
        hi ? 'Itu ketinggian terendah, $a-b$.' : 'Itu ketinggian tertinggi, $a+b$.',
      ],
      [m(w.a), 'Itu ketinggian rata-rata (garis tengah), saat nilai trigonometrinya $0$.'],
      [m(hi ? w.b : -w.b), `Lupa menambahkan $${w.a}$.`],
      [
        m(hi ? w.a + 2 * w.b : w.a - 2 * w.b),
        '$b$ cukup dihitung sekali: nilai trigonometri paling besar $1$, paling kecil $-1$.',
      ],
    ],
    {
      tpl: 'g1',
      paper: `${w.intro}<p>Ketinggian air ${hi ? 'tertinggi' : 'terendah'} adalah … meter.</p>`,
      hint: HINT_WAVE,
      explain: `$\\${w.fn}$ ${hi ? 'paling besar $1$' : 'paling kecil $-1$'}, jadi $h=${w.a}${hi ? '+' : '-'}${w.b}=${ans}$.`,
      data: { ...w, hi, ans },
    },
  );
}

function g2(rng: Rng): GItem {
  const w = wave(rng);
  const t = pick(rng, [0, 3, 6, 9]);
  const val = (fn: 'cos' | 'sin', tt: number): number =>
    Math.round(fn === 'cos' ? Math.cos((Math.PI * tt) / 6) : Math.sin((Math.PI * tt) / 6));
  const v = val(w.fn, t);
  const ans = w.a + w.b * v;
  const cands: Cand[] = [[m(ans), null]];
  for (const u of [1, 0, -1])
    if (u !== v)
      cands.push([
        m(w.a + w.b * u),
        `Itu memakai $\\${w.fn}\\left(\\frac{\\pi}{6}\\cdot ${t}\\right)=${u}$. Seharusnya $\\${w.fn}\\left(${t === 0 ? '0' : `\\frac{${t}\\pi}{6}`}\\right)=${v}$.`,
      ]);
  cands.push([m(w.b * v), `Lupa menambahkan $${w.a}$.`]);
  cands.push([
    m(w.a + w.b * t),
    'Sudut tidak boleh dikali langsung dengan $b$; hitung dulu nilai trigonometrinya.',
  ]);
  return build(rng, cands, {
    tpl: 'g2',
    paper: `${w.intro}<p>Ketinggian air pada pukul ${m(t === 0 ? '0{.}00' : `${t}{.}00`)} $(t=${t})$ adalah … meter.</p>`,
    hint: HINT_WAVE,
    explain: `$\\${w.fn}\\left(\\frac{\\pi}{6}\\cdot ${t}\\right)=${v}$, jadi $h(${t})=${w.a}+${w.b}\\cdot(${v})=${ans}$.`,
    data: { ...w, t, ans },
  });
}

function g3(rng: Rng): GItem {
  const w = wave(rng);
  return build(
    rng,
    [
      ['$12$ jam', null],
      ['$6$ jam', 'Itu setengah periode (dari puncak ke lembah).'],
      ['$24$ jam', 'Periode $=\\frac{2\\pi}{\\pi/6}=12$, bukan $24$.'],
      ['$3$ jam', 'Itu seperempat periode.'],
      [m('\\frac{\\pi}{6}') + ' jam', 'Itu koefisien $t$, bukan periode. Periode $=\\frac{2\\pi}{\\pi/6}$.'],
    ],
    {
      tpl: 'g3',
      paper: `${w.intro}<p>Pola ketinggian air berulang setiap ….</p>`,
      hint: HINT_WAVE,
      explain: 'Periode $=\\dfrac{2\\pi}{\\pi/6}=12$ jam.',
      data: { ...w, ans: 12 },
    },
  );
}

// ---------------------------------------------------------------------------------------------
// Pos 3 — Tanpa Cheatsheet (transformasi, soal 19–21)
// ---------------------------------------------------------------------------------------------
type Rule = { id: string; name: string; f: (p: number, q: number) => [number, number] };
export const RULES: Rule[] = [
  { id: 'X', name: 'pencerminan terhadap sumbu $X$', f: (p, q) => [p, -q] },
  { id: 'Y', name: 'pencerminan terhadap sumbu $Y$', f: (p, q) => [-p, q] },
  { id: 'yx', name: 'pencerminan terhadap garis $y=x$', f: (p, q) => [q, p] },
  { id: 'ymx', name: 'pencerminan terhadap garis $y=-x$', f: (p, q) => [-q, -p] },
  { id: 'r90', name: 'rotasi $90^\\circ$ berlawanan arah jarum jam berpusat $O$', f: (p, q) => [-q, p] },
  { id: 'r270', name: 'rotasi $90^\\circ$ searah jarum jam berpusat $O$', f: (p, q) => [q, -p] },
  { id: 'r180', name: 'rotasi $180^\\circ$ berpusat $O$', f: (p, q) => [-p, -q] },
];

const HINT_TRANS =
  'Sumbu $X$: $(x,-y)$ · sumbu $Y$: $(-x,y)$ · $y=x$: $(y,x)$ · $y=-x$: $(-y,-x)$ · rotasi $90^\\circ$ berlawanan: $(-y,x)$ · $90^\\circ$ searah: $(y,-x)$ · $180^\\circ$: $(-x,-y)$ · dilatasi $[O,k]$: $(kx,ky)$.';

function point(rng: Rng): [number, number] {
  let p = 0;
  let q = 0;
  while (Math.abs(p) === Math.abs(q)) {
    p = nz(rng, -7, 7);
    q = nz(rng, -7, 7);
  }
  return [p, q];
}

function t1(rng: Rng): GItem {
  const [p, q] = point(rng);
  const R = pick(rng, RULES);
  const img = R.f(p, q);
  const cands: Cand[] = [[m(pt(...img)), null]];
  for (const o of RULES) if (o !== R) cands.push([m(pt(...o.f(p, q))), `Itu aturan ${o.name}.`]);
  cands.push([m(pt(p, q)), 'Itu titik asalnya, belum ditransformasi.']);
  return build(rng, cands, {
    tpl: 't1',
    paper: `<p>Bayangan titik ${m(`A${pt(p, q)}`)} oleh ${R.name} adalah ….</p>`,
    hint: HINT_TRANS,
    explain: `Aturan ${R.name}: $(${p},${q})\\mapsto ${pt(...img)}$.`,
    data: { p, q, rule: R.id, ans: img },
  });
}

function t2(rng: Rng): GItem {
  const [p, q] = point(rng);
  const k = pick(rng, [2, 3, -2, -3]);
  return build(
    rng,
    [
      [m(pt(k * p, k * q)), null],
      [m(pt(p + k, q + k)), 'Dilatasi mengalikan koordinat dengan $k$, bukan menambahkan.'],
      [m(pt(k * p, q)), 'Kedua koordinat dikalikan $k$, bukan hanya $x$.'],
      [m(pt(-k * p, -k * q)), 'Tanda $k$ terbalik.'],
      [m(pt(k * q, k * p)), 'Koordinat tertukar; dilatasi tidak menukar $x$ dan $y$.'],
    ],
    {
      tpl: 't2',
      paper: `<p>Bayangan titik ${m(`B${pt(p, q)}`)} oleh dilatasi $[O,\\,${k}]$ adalah ….</p>`,
      hint: HINT_TRANS,
      explain: `Dilatasi $[O,k]$: $(x,y)\\mapsto(kx,ky)=${pt(k * p, k * q)}$.`,
      data: { p, q, k, ans: [k * p, k * q] },
    },
  );
}

function t3(rng: Rng): GItem {
  const [p, q] = point(rng);
  const s = nz(rng, -4, 4);
  const t = nz(rng, -4, 4);
  const R = pick(rng, RULES.slice(0, 4));
  const right = R.f(p + s, q + t);
  const swapped = R.f(p, q);
  const cands: Cand[] = [
    [m(pt(...right)), null],
    [m(pt(swapped[0] + s, swapped[1] + t)), `Urutan tertukar: translasi dulu, baru ${R.name}.`],
    [m(pt(...R.f(p - s, q - t))), 'Translasi menambahkan $(a,b)$, bukan mengurangkan.'],
  ];
  for (const o of RULES.slice(0, 4))
    if (o !== R) cands.push([m(pt(...o.f(p + s, q + t))), `Langkah kedua memakai aturan ${o.name}.`]);
  return build(rng, cands, {
    tpl: 't3',
    paper: `<p>Titik ${m(`P${pt(p, q)}`)} ditranslasikan oleh ${m(`\\begin{pmatrix} ${s} \\\\ ${t} \\end{pmatrix}`)}, kemudian hasilnya dicerminkan ${R.name.replace('pencerminan ', '')}. Bayangan akhirnya adalah ….</p>`,
    hint: HINT_TRANS,
    explain: `Translasi dulu: $(${p}${s < 0 ? s : `+${s}`},\\,${q}${t < 0 ? t : `+${t}`})=${pt(p + s, q + t)}$, lalu ${R.name}: $${pt(...right)}$.`,
    data: { p, q, s, t, rule: R.id, ans: right },
  });
}

// ---------------------------------------------------------------------------------------------
// Pos 4 — Detektif Aljabar
// ---------------------------------------------------------------------------------------------
interface Chain {
  eq: string;
  lines: string[];
  /** penjelasan kesalahan per baris (indeks 0–3) */
  why: string[];
}

function dChain(rng: Rng, kind: number, errAt: number): Chain {
  if (kind === 0) {
    // c·x − (x − a) = b; c ≥ 3 agar baris (3) dan (4) tidak kembar
    const c = int(rng, 3, 6);
    const a = int(rng, 2, 9);
    const x0 = pick(rng, [-5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8]);
    const b = (c - 1) * x0 + a;
    const eq = `${c}x-(x-${a})=${b}`;
    const L = [
      `${c}x-x+${a}=${b}`,
      `${co(c - 1, 'x')}+${a}=${b}`,
      `${co(c - 1, 'x')}=${b - a}`,
      `x=${frac(b - a, c - 1)}`,
    ];
    if (errAt === 0)
      L.splice(
        0,
        4,
        `${c}x-x-${a}=${b}`,
        `${co(c - 1, 'x')}-${a}=${b}`,
        `${co(c - 1, 'x')}=${b + a}`,
        `x=${frac(b + a, c - 1)}`,
      );
    if (errAt === 1)
      L.splice(1, 3, `${co(c + 1, 'x')}+${a}=${b}`, `${co(c + 1, 'x')}=${b - a}`, `x=${frac(b - a, c + 1)}`);
    if (errAt === 2) L.splice(2, 2, `${co(c - 1, 'x')}=${b + a}`, `x=${frac(b + a, c - 1)}`);
    if (errAt === 3) L.splice(3, 1, `x=${frac(c - 1, b - a)}`);
    return {
      eq,
      lines: L,
      why: [
        `Tanda di dalam kurung ikut berubah: $-(x-${a})=-x+${a}$.`,
        `$${c}x-x=${co(c - 1, 'x')}$, bukan $${co(c + 1, 'x')}$.`,
        `Memindahkan $+${a}$ ke ruas kanan menjadi $-${a}$.`,
        `Kedua ruas dibagi $${c - 1}$: $x=${frac(b - a, c - 1)}$, bukan dibalik.`,
      ],
    };
  }
  if (kind === 1) {
    // (x − a)² − x² = b
    const a = int(rng, 2, 6);
    const x0 = pick(rng, [-4, -3, -2, 2, 3, 4, 5]);
    const b = a * a - 2 * a * x0;
    const eq = `${sq('x', a)}-x^2=${b}`;
    const L = [
      `x^2-${2 * a}x+${a * a}-x^2=${b}`,
      `-${2 * a}x+${a * a}=${b}`,
      `-${2 * a}x=${b - a * a}`,
      `x=${x0}`,
    ];
    if (errAt === 0)
      L.splice(
        0,
        4,
        `x^2-${2 * a}x-${a * a}-x^2=${b}`,
        `-${2 * a}x-${a * a}=${b}`,
        `-${2 * a}x=${b + a * a}`,
        `x=${frac(b + a * a, -2 * a)}`,
      );
    if (errAt === 1)
      L.splice(1, 3, `${2 * a}x+${a * a}=${b}`, `${2 * a}x=${b - a * a}`, `x=${frac(b - a * a, 2 * a)}`);
    if (errAt === 2) L.splice(2, 2, `-${2 * a}x=${b + a * a}`, `x=${frac(b + a * a, -2 * a)}`);
    if (errAt === 3) L.splice(3, 1, `x=${frac(b - a * a, 2 * a)}`);
    return {
      eq,
      lines: L,
      why: [
        `$(x-${a})^2=x^2-${2 * a}x+${a * a}$; suku $${a * a}$ bertanda plus.`,
        `Suku $-${2 * a}x$ tetap bertanda negatif setelah $x^2-x^2$ dihapus.`,
        `Memindahkan $+${a * a}$ ke ruas kanan menjadi $-${a * a}$.`,
        `Membagi dengan $-${2 * a}$: tanda ikut berubah, $x=${x0}$.`,
      ],
    };
  }
  // x/p + x/q = r
  let p = int(rng, 2, 6);
  let q = int(rng, 2, 6);
  while (q === p) q = int(rng, 2, 6);
  if (p > q) [p, q] = [q, p];
  const k = int(rng, 1, 2);
  const x0 = k * p * q;
  const r = k * (p + q);
  const eq = `\\frac{x}{${p}}+\\frac{x}{${q}}=${r}`;
  const L = [
    `\\frac{${q}x+${p}x}{${p * q}}=${r}`,
    `\\frac{${p + q}x}{${p * q}}=${r}`,
    `${p + q}x=${r * p * q}`,
    `x=${x0}`,
  ];
  if (errAt === 0)
    L.splice(
      0,
      4,
      `\\frac{x+x}{${p + q}}=${r}`,
      `\\frac{2x}{${p + q}}=${r}`,
      `2x=${r * (p + q)}`,
      `x=${frac(r * (p + q), 2)}`,
    );
  if (errAt === 1) L.splice(1, 3, `\\frac{${p + q}x}{${p + q}}=${r}`, `${p + q}x=${r * (p + q)}`, `x=${r}`);
  if (errAt === 2) L.splice(2, 2, `${p + q}x=${r + p * q}`, `x=${frac(r + p * q, p + q)}`);
  if (errAt === 3) L.splice(3, 1, `x=${frac(p + q, r * p * q)}`);
  return {
    eq,
    lines: L,
    why: [
      `Pecahan dijumlah dengan menyamakan penyebut ($${p * q}$), bukan dengan menjumlah penyebut.`,
      `Penyebutnya tetap $${p * q}$; hanya pembilang yang dijumlah.`,
      `Kedua ruas dikali $${p * q}$, bukan ditambah: $${p + q}x=${r * p * q}$.`,
      `Kedua ruas dibagi $${p + q}$: $x=${x0}$, bukan dibalik.`,
    ],
  };
}

function d1(rng: Rng): GItem {
  const kind = int(rng, 0, 2);
  const none = rng() < 0.15;
  const errAt = none ? -1 : int(rng, 0, 3);
  const ch = dChain(rng, kind, errAt);
  const options = ['Baris (1)', 'Baris (2)', 'Baris (3)', 'Baris (4)', 'Semua baris benar'];
  const ok = none ? 4 : errAt;
  const traps = options.map((_, i): string | null => {
    if (i === ok) return null;
    if (i === 4) return `Ada langkah yang salah. ${ch.why[errAt]!}`;
    if (none) return 'Baris ini benar. Semua langkah sudah tepat.';
    return i < errAt
      ? `Baris (${i + 1}) masih benar.`
      : `Baris (${i + 1}) hanya meneruskan kesalahan sebelumnya. Cari yang PERTAMA salah.`;
  });
  return {
    tpl: `d1-${kind}`,
    paper: `<p>Seorang siswa menyelesaikan ${m(ch.eq)} seperti berikut.</p><ol class="eks-lines">${ch.lines.map((l) => `<li>${m(l)}</li>`).join('')}</ol><p>Baris mana yang <b>pertama kali</b> salah?</p>`,
    options,
    ok,
    traps,
    hint: 'Periksa satu per satu: tanda negatif di depan kurung, kuadrat $(a-b)^2=a^2-2ab+b^2$, pindah ruas mengubah tanda, menjumlah pecahan dengan menyamakan penyebut.',
    explain: none ? 'Semua langkah benar.' : `Baris (${errAt + 1}) salah. ${ch.why[errAt]!}`,
    data: { kind, errAt },
  };
}

// ---------------------------------------------------------------------------------------------
// Pos 5 — Museum Jebakan (pola jebakan soal TKA 2025)
// ---------------------------------------------------------------------------------------------
function j1(rng: Rng): GItem {
  const P0 = pick(rng, [100, 200, 500]);
  const d = pick(rng, [2, 3, 5]);
  const k = int(rng, 2, 4);
  return build(
    rng,
    [
      [`$${2 ** k}$ kali`, null],
      [
        `$${k}$ kali`,
        `Jebakan soal 9: setelah $${k}$ periode populasi menjadi $2^{${k}}$ kali, bukan $${k}$ kali.`,
      ],
      [`$${2 * k}$ kali`, `Pangkat $2^{${k}}$ bukan $2\\times ${k}$.`],
      [`$${2 ** (k + 1)}$ kali`, `Pangkatnya $\\frac{t}{${d}}=${k}$, bukan $${k + 1}$.`],
      [`$${k * d}$ kali`, 'Itu lamanya waktu, bukan kelipatan populasi.'],
    ],
    {
      tpl: 'j1',
      paper: `<p>Populasi bakteri dimodelkan oleh ${m(`P(t)=${P0}\\cdot 2^{t/${d}}`)} dengan $t$ dalam jam. Setelah ${m(k * d)} jam, populasinya menjadi berapa kali populasi awal?</p>`,
      hint: 'Substitusikan $t$ ke pangkat dulu: $2^{t/d}$. Bandingkan $P(t)$ dengan $P(0)$.',
      explain: `$P(${k * d})=${P0}\\cdot 2^{${k}}$, jadi $2^{${k}}=${2 ** k}$ kali populasi awal.`,
      data: { P0, d, k, ans: 2 ** k },
    },
  );
}

function j2(rng: Rng): GItem {
  const d = pick(rng, [14, 28, 42]);
  const half = (11 * d) / 7;
  return build(
    rng,
    [
      [`$${half + d}$ cm`, null],
      [`$${half}$ cm`, 'Jebakan soal 17: sisi lurus (diameter) lupa ditambahkan.'],
      [`$${2 * half}$ cm`, 'Itu keliling lingkaran penuh.'],
      [`$${half + d / 2}$ cm`, 'Sisi lurusnya diameter, bukan jari-jari.'],
      [`$${2 * half + d}$ cm`, 'Busurnya setengah keliling, bukan keliling penuh.'],
    ],
    {
      tpl: 'j2',
      paper: `<p>Sebuah bangun berbentuk setengah lingkaran dengan diameter ${m(d)} cm. Dengan $\\pi=\\frac{22}{7}$, keliling bangun itu adalah ….</p>`,
      hint: 'Keliling setengah lingkaran = setengah keliling lingkaran + diameter.',
      explain: `$\\frac12\\cdot\\frac{22}{7}\\cdot ${d}+${d}=${half}+${d}=${half + d}$ cm.`,
      data: { d, ans: half + d },
    },
  );
}

function j3(rng: Rng): GItem {
  const a = int(rng, 2, 6);
  let b = int(rng, 1, 6);
  while (b === a) b = int(rng, 1, 6);
  const num = terms([
    [1, 'x^2'],
    [b - a, 'x'],
    [-a * b, ''],
  ]);
  return build(
    rng,
    [
      [m(a + b), null],
      [m(0), 'Substitusi langsung menghasilkan $\\frac{0}{0}$; itu belum jawaban. Faktorkan dulu.'],
      ['tidak ada', 'Bentuk $\\frac{0}{0}$ belum tentu tidak ada; faktorkan, lalu coret faktor yang sama.'],
      [m(a - b), `Faktornya $(x+${b})$, bukan $(x-${b})$.`],
      [m(b), `Setelah dicoret, substitusikan $x=${a}$ ke $x+${b}$.`],
    ],
    {
      tpl: 'j3',
      paper: `<p class="eq">${m(`\\lim_{x\\to ${a}}\\dfrac{${num}}{${lin('x', a)}}`)}</p><p>Nilai limit tersebut adalah ….</p>`,
      hint: 'Bila substitusi menghasilkan $\\frac{0}{0}$, faktorkan pembilang, coret faktor yang sama, lalu substitusi.',
      explain: `$\\frac{(x-${a})(x+${b})}{x-${a}}=x+${b}\\to ${a}+${b}=${a + b}$.`,
      data: { a, b, ans: a + b },
    },
  );
}

function j4(rng: Rng): GItem {
  const p = int(rng, 2, 7);
  let q = int(rng, 2, 7);
  while (q === p) q = int(rng, 2, 7);
  const u = nz(rng, -6, 6);
  const v = int(rng, 1, 9);
  let w = int(rng, 1, 9);
  while (w * p === v * q) w = int(rng, 1, 9);
  return build(
    rng,
    [
      [m(frac(p, q)), null],
      [m(frac(q, p)), 'Terbalik: pembilang dibagi penyebut.'],
      [m(frac(v, w)), 'Di tak hingga yang menentukan suku pangkat tertinggi, bukan konstanta.'],
      [
        m(0),
        'Pangkat tertinggi pembilang dan penyebut sama, jadi hasilnya perbandingan koefisiennya, bukan 0.',
      ],
      [m('\\infty'), 'Pangkat sama, jadi limitnya bilangan tertentu, bukan $\\infty$.'],
    ],
    {
      tpl: 'j4',
      paper: `<p class="eq">${m(
        `\\lim_{x\\to\\infty}\\dfrac{${terms([
          [p, 'x^2'],
          [u, 'x'],
          [v, ''],
        ])}}{${terms([
          [q, 'x^2'],
          [w, ''],
        ])}}`,
      )}</p><p>Nilai limit tersebut adalah ….</p>`,
      hint: 'Limit di tak hingga: bagi dengan pangkat tertinggi. Pangkat sama → hasilnya perbandingan koefisien pangkat tertinggi.',
      explain: `Pangkat tertinggi sama-sama $x^2$, jadi limitnya $\\frac{${p}}{${q}}$.`,
      data: { p, q, u, v, w },
    },
  );
}

const QUAD: Array<[number, number, number, number]> = [
  [1, 2, 2, 3],
  [2, 3, 6, 7],
  [1, 4, 8, 9],
  [4, 4, 7, 9],
  [2, 6, 9, 11],
  [6, 6, 7, 11],
  [2, 5, 14, 15],
];

function j5(rng: Rng): GItem {
  const [x, y, z, d] = pick(rng, QUAD);
  const sx = pick(rng, [1, -1]);
  const sz = pick(rng, [1, -1]);
  const v = [sx * x, y, sz * z];
  return build(
    rng,
    [
      [m(d), null],
      [m(d * d), 'Lupa diakar: $|\\vec v|=\\sqrt{x^2+y^2+z^2}$.'],
      [m(Math.abs(v[0]! + v[1]! + v[2]!)), 'Panjang vektor bukan jumlah komponennya.'],
      [m(x + y + z), 'Panjang vektor bukan jumlah komponennya.'],
      [m(sqrtTex(x + y + z)), 'Komponennya dikuadratkan dulu sebelum dijumlah.'],
    ],
    {
      tpl: 'j5',
      paper: `<p>Panjang vektor ${m(`\\vec v=\\begin{pmatrix} ${v.join(' \\\\ ')} \\end{pmatrix}`)} adalah ….</p>`,
      hint: '$|\\vec v|=\\sqrt{x^2+y^2+z^2}$; bilangan negatif dikuadratkan menjadi positif.',
      explain: `$\\sqrt{${x * x}+${y * y}+${z * z}}=\\sqrt{${d * d}}=${d}$.`,
      data: { v, ans: d },
    },
  );
}

// ---------------------------------------------------------------------------------------------
// Pemanasan
// ---------------------------------------------------------------------------------------------
function w1(rng: Rng): GItem {
  const a = int(rng, 2, 5);
  const b = a + int(rng, 1, 3);
  return build(
    rng,
    [
      [m(a * a + b * b), null],
      [m((a + b) ** 2), `$(${a}+${b})^2$ tidak sama dengan $${a}^2+${b}^2$.`],
      [m(2 * a + 2 * b), `$${a}^2$ artinya $${a}\\times${a}$, bukan $${a}\\times 2$.`],
      [m(a * a + b * b + 1), 'Salah hitung.'],
    ],
    {
      tpl: 'w1',
      paper: `<p>Nilai ${m(`${a}^2+${b}^2`)} adalah ….</p>`,
      hint: `$${a}^2=${a}\\times${a}$.`,
      explain: `$${a * a}+${b * b}=${a * a + b * b}$.`,
      data: { ans: a * a + b * b },
    },
  );
}

function w2(rng: Rng): GItem {
  const a = int(rng, 2, 9);
  const b = int(rng, 2, 9);
  return build(
    rng,
    [
      [m(a * b), null],
      [m(-a * b), 'Negatif kali negatif hasilnya positif.'],
      [m(-(a + b)), 'Ini perkalian, bukan penjumlahan.'],
      [m(a + b), 'Ini perkalian, bukan penjumlahan.'],
    ],
    {
      tpl: 'w2',
      paper: `<p>Hasil ${m(`(-${a})\\times(-${b})`)} adalah ….</p>`,
      hint: 'Negatif × negatif = positif.',
      explain: `$(-${a})\\times(-${b})=${a * b}$.`,
      data: { ans: a * b },
    },
  );
}

// ---------------------------------------------------------------------------------------------
// pemilihan soal
// ---------------------------------------------------------------------------------------------
type Gen = (rng: Rng) => GItem;
export const GENS: Record<PosId | 0, Gen[]> = {
  0: [w1, w2],
  1: [l1, l2, l3],
  2: [g1, g2, g3],
  3: [t1, t2, t3],
  4: [d1],
  5: [j1, j2, j3, j4, j5],
  6: [l1, l2, g1, g2, t1, t2, j1, j3, j5],
  7: [l2, g2, t3, d1, j3, j4],
};

/** Urutan cetakan per pos untuk satu tim (diacak dari benih tim). */
function order(seed: number, pos: PosId | 0): Gen[] {
  const rng = mulberry32(seed ^ (pos * 0x9e3779b1));
  const g = [...GENS[pos]];
  for (let i = g.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [g[i], g[j]] = [g[j]!, g[i]!];
  }
  return g;
}

/** Soal ke-i di pos untuk tim; attempt 1 = soal kembaran (kesempatan kedua). */
export function gameItem(seed: number, pos: PosId | 0, i: number, attempt = 0): GItem {
  const gens = order(seed, pos);
  const gen = gens[i % gens.length]!;
  for (let k = 0; k < 30; k++) {
    try {
      return gen(mulberry32((seed + pos * 7919 + i * 104729 + attempt * 15485863 + k * 32452843) >>> 0));
    } catch {
      /* coba benih berikutnya */
    }
  }
  throw new Error('soal gagal dibuat');
}
