/**
 * Generator latihan soal 16 — titik singgung lingkaran dari garis singgung yang tegak lurus (atau sejajar) garis f
 * (PRD §11.4 baris 16; revisi pemilik v1.19). Pilihan banyak: tepat dua titik singgung dari lima kandidat.
 * Gambar: garis f melalui C dan D (titik bulat), lingkaran berpusat A melalui B (titik bulat).
 *  - Mudah: seperti soal asli — f naik dengan arah (a, b), a, b ∈ [1, 3] koprima, a ≠ b; r = √(a² + b²), sehingga
 *    langkah "geser a, naik b" dari pusat langsung sampai di lingkaran; B salah satu titik singgung.
 *  - Sedang: arah f boleh turun (a, −b); B titik bulat lain di lingkaran yang tidak searah f (B hanya memberi r).
 *  - Menantang: (a) jari-jari dua kali panjang langkah (s = 2, r = 2√(a² + b²), a, b ∈ {1, 2}): langkah dari pusat
 *    harus dikali r/k; atau (b) garis singgung yang SEJAJAR f (jari-jari tegak lurus f). B acak di lingkaran.
 * Pusat A ∈ [−4, 4]², bukan A(2, −3) soal asli. f tidak memotong lingkaran (jarak pusat ke f ≥ r + 2/k).
 * Distraktor dari Kesalahan umum soal 16 dan alur pembahasan: titik yang garis singgungnya sejajar f (atau tegak
 * lurus pada varian sejajar), tanda gradien terbalik, geser–naik tertukar, langkah belum dikali r/k, titik B
 * (hanya memberi r), titik pada garis f, titik di luar lingkaran.
 * Oracle: r² dari jarak AB, arah f dari D − C; tiap kandidat diperiksa AT² = r² dan AT sejajar (atau tegak lurus)
 * D − C — tanpa memakai arah dan pengali pembuat.
 */
import { H, O, T } from '../engine/dsl';
import type { Row } from '../engine/types';
import { int, mulberry32, pick, type Rng } from '../core/prng';
import { toCode, type Generator, type Instance, type Level, type Option, type Trap } from './types';

type P = [number, number];
type Mode = 'tegak' | 'sejajar';

/** Jebakan; bab mengacu ke pembahasan soal 16 (2 data, 3 sifat, 4 titik singgung, 5 cara alternatif, 6 uji). */
const TRAPS: Record<string, Trap> = {
  sejajarF: {
    id: 'singgung-sejajar-f',
    hint: 'Hati-hati, titik ini memang di lingkaran, tetapi garis singgungnya sejajar $f$. Yang diminta tegak lurus $f$, jadi jari-jarinya harus searah $f$.',
    chapter: 3,
  },
  tegakF: {
    id: 'singgung-tegak-f',
    hint: 'Hati-hati, titik ini memang di lingkaran, tetapi garis singgungnya tegak lurus $f$. Yang diminta sejajar $f$, jadi jari-jarinya harus tegak lurus $f$.',
    chapter: 3,
  },
  tanda: {
    id: 'tanda-gradien',
    hint: 'Perhatikan tanda gradien $f$: naik atau turun. Titik ini memakai arah yang terbalik.',
    chapter: 2,
  },
  tertukar: {
    id: 'geser-naik-tertukar',
    hint: 'Perhatikan, geser dan naiknya tertukar. Gradien $=\\frac{\\text{naik}}{\\text{geser}}$, jadi arahnya berbeda.',
    chapter: 2,
  },
  setengah: {
    id: 'belum-dikali-r-per-k',
    hint: 'Hati-hati, langkah geser–naik ini panjangnya baru $k$, belum sejauh $r$. Kalikan dulu dengan $\\frac rk$.',
    chapter: 5,
  },
  titikB: {
    id: 'titik-B',
    hint: 'Hati-hati, $B$ memang di lingkaran, tetapi jari-jari $AB$ tidak searah yang diminta. $B$ hanya dipakai untuk mencari $r$.',
    chapter: 5,
  },
  titikF: {
    id: 'titik-pada-f',
    hint: 'Hati-hati, titik singgung tidak berada pada garis $f$. Garis $f$ bahkan tidak menyentuh lingkaran; yang dipakai hanya arahnya.',
    chapter: 4,
  },
  luar: {
    id: 'di-luar-lingkaran',
    hint: 'Perhatikan, jarak titik ini ke pusat bukan $r$: $AT^2\\ne r^2$, jadi titik ini tidak berada di lingkaran.',
    chapter: 6,
  },
};

const add = (a: P, b: P, s = 1): P => [a[0] + s * b[0], a[1] + s * b[1]];
const sub = (a: P, b: P): P => [a[0] - b[0], a[1] - b[1]];
const cross = (u: P, v: P): number => u[0] * v[1] - u[1] * v[0];
const dot = (u: P, v: P): number => u[0] * v[0] + u[1] * v[1];
const len2 = (u: P): number => dot(u, u);
const eq = (u: P, v: P): boolean => u[0] === v[0] && u[1] === v[1];
const ptTex = (p: P): string => `(${p[0]},${p[1]})`;
const par = (v: number): string => (v < 0 ? `(${v})` : String(v));
const fig = (v: number): string => (v < 0 ? `−${-v}` : String(v));
const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : Math.abs(x));

function shuffle<T>(rng: Rng, a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [b[i], b[j]] = [b[j]!, b[i]!];
  }
  return b;
}

interface Raw {
  mode: Mode;
  A: P;
  /** arah garis f (geser, naik) */
  d: P;
  /** pengali: jari-jari = s × panjang d */
  s: number;
  B: P;
  C: P;
  D: P;
  keys: [P, P];
  pool: Array<[P, Trap]>;
}

function raw(rng: Rng, level: Level): Raw | null {
  const s = level === 'menantang' && rng() < 0.5 ? 2 : 1;
  const mode: Mode = level === 'menantang' && s === 1 ? 'sejajar' : 'tegak';
  const range = s === 2 ? [1, 2] : [1, 3];
  const a = int(rng, range[0]!, range[1]!);
  const b = int(rng, range[0]!, range[1]!);
  if (a === b || gcd(a, b) !== 1) return null;
  const down = level !== 'mudah' && rng() < 0.5;
  const d: P = [a, down ? -b : b];
  const A: P = [int(rng, -4, 4), int(rng, -4, 4)];
  if (eq(A, [2, -3])) return null;
  const n: P = [-d[1], d[0]];
  // arah jari-jari ke titik singgung: searah f (tegak) atau tegak lurus f (sejajar)
  const u = mode === 'tegak' ? d : n;
  const keys: [P, P] = [add(A, u, s), add(A, u, -s)];
  const kk = len2(d);
  const r2 = s * s * kk;
  // titik bulat lain di lingkaran, untuk B
  const others: P[] = [
    [a, down ? b : -b],
    [-a, down ? -b : b],
    [b, a],
    [-b, -a],
    [b, -a],
    [-b, a],
  ].map((v) => add(A, v as P, s));
  const onCircle = (p: P): boolean => len2(sub(p, A)) === r2;
  const notKey = (p: P): boolean => !keys.some((k) => eq(k, p));
  const B =
    level === 'mudah'
      ? keys[0]
      : pick(
          rng,
          others.filter((p) => onCircle(p) && notKey(p)),
        );
  if (!B) return null;
  // garis f melalui C dan D = C + d, tidak memotong lingkaran: jarak |cross(C − A, d)|/k ≥ r + 2/k
  let C: P | null = null;
  for (let t = 0; t < 120 && !C; t++) {
    const c: P = [int(rng, -6, 6), int(rng, -6, 6)];
    const cr = Math.abs(cross(sub(c, A), d));
    if (cr >= s * kk + 2 && cr <= s * kk + kk + 2 && len2(sub(c, A)) <= (s * Math.sqrt(kk) + 5) ** 2) C = c;
  }
  if (!C) return null;
  const D = add(C, d);
  const wrongDir = mode === 'tegak' ? n : d;
  const pool: Array<[P, Trap]> = [
    [add(A, wrongDir, s), mode === 'tegak' ? TRAPS.sejajarF! : TRAPS.tegakF!],
    [add(A, wrongDir, -s), mode === 'tegak' ? TRAPS.sejajarF! : TRAPS.tegakF!],
    [add(A, [u[0], -u[1]], s), TRAPS.tanda!],
    [add(A, [u[1], u[0]], s), TRAPS.tertukar!],
    [add(keys[0], [0, 2]), TRAPS.luar!],
    [add(keys[1], [-2, 0]), TRAPS.luar!],
    [C, TRAPS.titikF!],
    [D, TRAPS.titikF!],
  ];
  if (s === 2) pool.push([add(A, u), TRAPS.setengah!], [add(A, u, -1), TRAPS.setengah!]);
  if (level !== 'mudah') pool.push([B, TRAPS.titikB!]);
  return { mode, A, d, s, B, C, D, keys, pool };
}

/** benar menurut pembuat: di lingkaran dan arah jari-jarinya sesuai mode */
function isKey(p: P, w: Raw): boolean {
  const v = sub(p, w.A);
  const ok = w.mode === 'tegak' ? cross(v, w.d) === 0 : dot(v, w.d) === 0;
  return ok && len2(v) === w.s * w.s * len2(w.d);
}

function distractors(rng: Rng, w: Raw): Array<[P, Trap]> | null {
  const out: Array<[P, Trap]> = [];
  const seen = new Set(w.keys.map(ptTex));
  const r2 = w.s * w.s * len2(w.d);
  for (const [p, t] of shuffle(rng, w.pool)) {
    if (seen.has(ptTex(p)) || isKey(p, w) || Math.max(Math.abs(p[0]), Math.abs(p[1])) > 12) continue;
    // titik "di luar lingkaran" yang kebetulan jatuh di lingkaran tidak sesuai jebakannya
    if (t === TRAPS.luar && len2(sub(p, w.A)) === r2) continue;
    seen.add(ptTex(p));
    out.push([p, t]);
    if (out.length === 3) return out;
  }
  return null;
}

// ---------- gambar ----------
function figure(w: Raw): string {
  const r = w.s * Math.sqrt(len2(w.d));
  const xs = [w.A[0] - r, w.A[0] + r, w.C[0], w.D[0], 0];
  const ys = [w.A[1] - r, w.A[1] + r, w.C[1], w.D[1], 0];
  let x0 = Math.floor(Math.min(...xs)) - 1;
  let x1 = Math.ceil(Math.max(...xs)) + 1;
  let y0 = Math.floor(Math.min(...ys)) - 1;
  let y1 = Math.ceil(Math.max(...ys)) + 1;
  const S = Math.max(x1 - x0, y1 - y0);
  x0 -= Math.floor((S - (x1 - x0)) / 2);
  x1 = x0 + S;
  y0 -= Math.floor((S - (y1 - y0)) / 2);
  y1 = y0 + S;
  const M = 14;
  const U = 200 / S;
  const X = (x: number): number => M + (x - x0) * U;
  const Y = (y: number): number => M + (y1 - y) * U;
  const f1 = (v: number): string => v.toFixed(1);
  let g = '';
  for (let x = x0; x <= x1; x++)
    g += `<path class="lg-grid${x === 0 ? ' lg-axis' : ''}" d="M${f1(X(x))} ${f1(Y(y1))}V${f1(Y(y0))}"/>`;
  for (let y = y0; y <= y1; y++)
    g += `<path class="lg-grid${y === 0 ? ' lg-axis' : ''}" d="M${f1(X(x0))} ${f1(Y(y))}H${f1(X(x1))}"/>`;
  const step = S > 12 ? 4 : 2;
  for (let x = x0 + 1; x < x1; x++)
    if (x % step === 0 && x !== 0)
      g += `<text class="lg-tick" x="${f1(X(x))}" y="${f1(Y(0) + 9)}">${fig(x)}</text>`;
  for (let y = y0 + 1; y < y1; y++)
    if (y % step === 0 && y !== 0)
      g += `<text class="lg-tick lg-tick-y" x="${f1(X(0) + 4)}" y="${f1(Y(y))}">${fig(y)}</text>`;
  // garis f dipotong ke kotak gambar (parameter t sepanjang d dari C)
  const ts = [x0, x1].map((x) => (x - w.C[0]) / (w.d[0] || 1e-9));
  if (w.d[1]) ts.push(...[y0, y1].map((y) => (y - w.C[1]) / w.d[1]));
  const inside = ts
    .map((t) => add(w.C, w.d, t))
    .filter((p) => p[0] >= x0 - 1e-6 && p[0] <= x1 + 1e-6 && p[1] >= y0 - 1e-6 && p[1] <= y1 + 1e-6);
  inside.sort((p, q) => p[0] - q[0]);
  const [e1, e2] = [inside[0]!, inside[inside.length - 1]!];
  const pt = (p: P, name: string, cls = 'lg-e'): string =>
    `<circle class="${cls}" cx="${f1(X(p[0]))}" cy="${f1(Y(p[1]))}" r="3"/><text class="lg-pl" x="${f1(X(p[0]) + 5)}" y="${f1(Y(p[1]) - 6)}">${name}</text>`;
  return `<figure class="lat-fig"><svg viewBox="0 0 ${200 + 2 * M} ${200 + 2 * M}" role="img" aria-label="Bidang koordinat: garis f melalui C${ptTex(w.C)} dan D${ptTex(w.D)}; lingkaran berpusat A${ptTex(w.A)} melalui B${ptTex(w.B)}">
<g>${g}</g>
<circle class="lg-c" cx="${f1(X(w.A[0]))}" cy="${f1(Y(w.A[1]))}" r="${f1(r * U)}"/>
<path class="lg-d" d="M${f1(X(e1[0]))} ${f1(Y(e1[1]))}L${f1(X(e2[0]))} ${f1(Y(e2[1]))}"/>
${pt(w.C, 'C')}${pt(w.D, 'D')}${pt(w.A, 'A', 'lg-p')}${pt(w.B, 'B')}
</svg></figure>`;
}

// ---------- penyelesaian (baris papan) ----------
function solution(w: Raw): Instance['solution'] {
  const { A, d, s, B, C, D, mode } = w;
  const kk = len2(d);
  const r2 = s * s * kk;
  const u: P = mode === 'tegak' ? d : [-d[1], d[0]];
  const ab = sub(B, A);
  const data: Row[] = [
    {
      id: 'g1',
      toks: [
        T('g1a', 'm_f'),
        O('g1b', '='),
        T('g1c', `\\tfrac{${D[1]}-${par(C[1])}}{${D[0]}-${par(C[0])}}`),
        O('g1d', '='),
        T('g1e', `\\tfrac{${d[1]}}{${d[0]}}`, 'blue'),
      ],
      note: `dari $C$ ke $D$: geser $${d[0]}$, ${d[1] < 0 ? 'turun' : 'naik'} $${Math.abs(d[1])}$`,
    },
    {
      id: 'g2',
      toks: [
        T('g2a', 'r^2'),
        O('g2b', '='),
        T('g2c', `${ab[0] ** 2}+${ab[1] ** 2}`),
        O('g2d', '='),
        T('g2e', String(r2), 'blue'),
      ],
      note: `jarak $A${ptTex(A)}$ ke $B${ptTex(B)}$`,
      box: 'navy',
    },
  ];
  const dir: Row[] = [
    {
      id: 'j1',
      toks: [H('j1a', 'arah jari-jari', 'tx'), O('j1b', '='), T('j1c', `(${u[0]},\\ ${u[1]})`, 'blue')],
      note:
        mode === 'tegak'
          ? 'garis singgung $\\perp f$ dan $\\perp$ jari-jari, jadi jari-jari searah $f$'
          : 'garis singgung $\\parallel f$, jadi jari-jari tegak lurus $f$: gradiennya $-\\frac{1}{m_f}$',
    },
    {
      id: 'j2',
      toks: [
        T('j2a', 'k'),
        O('j2b', '='),
        T('j2c', `\\sqrt{${kk}}`),
        H('j2d', ', jadi', 'tx'),
        T('j2e', `\\tfrac rk=${s}`, 'blue'),
      ],
      note:
        s === 1 ? 'langkah ini tepat sejauh jari-jari' : 'langkah ini baru setengah jari-jari: kalikan $2$',
    },
  ];
  const [T1, T2] = w.keys;
  const res: Row[] = [
    {
      id: 't1',
      toks: [T('t1a', 'T'), O('t1b', '='), T('t1c', `A\\pm${s === 1 ? '' : s}(${u[0]},\\ ${u[1]})`)],
      note: 'dari pusat ke dua arah',
    },
    {
      id: 't2',
      toks: [T('t2a', `T_1=${ptTex(T1)}`, 'gold'), O('t2b', ','), T('t2c', `T_2=${ptTex(T2)}`, 'gold')],
      box: 'gold',
    },
  ];
  return [
    { title: 'Data dari gambar', rows: data },
    { title: mode === 'tegak' ? 'Jari-jari searah f' : 'Jari-jari tegak lurus f', rows: dir },
    { title: 'Geser dari pusat', rows: res },
  ];
}

function hints(w: Raw): [string, string, string] {
  const { d, s, B, mode } = w;
  const r2 = s * s * len2(d);
  return [
    mode === 'tegak'
      ? 'Garis singgung selalu tegak lurus jari-jari. Bila garis singgungnya tegak lurus $f$, jari-jarinya searah $f$.'
      : 'Garis singgung selalu tegak lurus jari-jari. Bila garis singgungnya sejajar $f$, jari-jarinya tegak lurus $f$.',
    `Dari gambar: gradien $f=\\frac{${d[1]}}{${d[0]}}$ dan $r^2=AB^2=${r2}$ ($B${ptTex(B)}$ hanya memberi $r$).`,
    `Dari pusat $A$ geser searah jari-jari tadi sejauh $r$, ke dua arah. Cek: $AT^2$ harus $${r2}$.`,
  ];
}

const FALLBACK: Record<Level, number[]> = { mudah: [4, 9], sedang: [6, 15], menantang: [3, 12] };

function build(seed: number, level: Level): Instance | null {
  const rng = mulberry32(seed);
  for (let tries = 0; tries < 20; tries++) {
    const w = raw(rng, level);
    if (!w) continue;
    const ds = distractors(rng, w);
    if (!ds) continue;
    const r2 = w.s * w.s * len2(w.d);
    const cands = shuffle(rng, [
      ...w.keys.map((p) => ({ p, trap: undefined as Trap | undefined })),
      ...ds.map(([p, trap]) => ({ p, trap })),
    ]);
    const why = (p: P, trap?: Trap): string => {
      const v = sub(p, w.A);
      return trap
        ? `$AT^2=${len2(v)}$${len2(v) === r2 ? ', di lingkaran, tetapi arah $\\vec{AT}$ tidak sesuai' : ''}. ${trap.hint}`
        : `$\\vec{AT}=(${v[0]},${v[1]})$: di lingkaran ($AT^2=${r2}$) dan arahnya sesuai.`;
    };
    const options: Option[] = cands.map((c) => ({
      tex: ptTex(c.p),
      html: `$${ptTex(c.p)}$`,
      ok: !c.trap,
      why: why(c.p, c.trap),
      ...(c.trap ? { trap: c.trap } : {}),
    }));
    const keys = options.map((o, i) => (o.ok ? i : -1)).filter((i) => i >= 0);
    const ask =
      w.mode === 'tegak'
        ? 'Tentukan semua koordinat titik singgung lingkaran dari garis-garis singgung lingkaran yang tegak lurus terhadap garis $f$.'
        : 'Tentukan semua koordinat titik singgung lingkaran dari garis-garis singgung lingkaran yang sejajar garis $f$.';
    const paper = `<div class="lat24"><div>
<p>Perhatikan gambar berikut. Garis $f$ melalui $C${ptTex(w.C)}$ dan $D${ptTex(w.D)}$. Lingkaran berpusat di $A${ptTex(w.A)}$ dan melalui $B${ptTex(w.B)}$.</p>
<p>${ask}</p>
<p class="lat-multi-note">Pilih semua jawaban yang benar.</p>
</div>${figure(w)}</div>`;
    return {
      no: 16,
      seed,
      level,
      code: toCode(seed, level),
      paper,
      options,
      key: keys[0]!,
      multi: true,
      summary: `A${ptTex(w.A)},\\ r^2=${r2}`,
      chapter: 4,
      hints: hints(w),
      solution: solution(w),
      timeAdvice: level === 'mudah' ? 150 : level === 'sedang' ? 210 : 270,
      test(i) {
        const v = sub(cands[i]!.p, w.A);
        const on = len2(v) === r2;
        return {
          tex: `\\vec{AT}=(${v[0]},${v[1]}),\\ AT^2=${len2(v)}${on ? '=r^2' : '\\ne r^2'}`,
          ok: !cands[i]!.trap,
        };
      },
      params: { mode: w.mode, A: w.A, B: w.B, C: w.C, D: w.D, s: w.s, d: w.d, cands: cands.map((c) => c.p) },
    };
  }
  return null;
}

export const gen16: Generator = {
  no: 16,
  levels: {
    mudah: 'Seperti soal asli: titik B sendiri salah satu titik singgung.',
    sedang: 'Garis f bisa naik atau turun; B di tempat lain, hanya memberi jari-jari.',
    menantang: 'Jari-jari dua kali langkah, atau garis singgung yang sejajar f.',
  },
  make(seed, level) {
    // §11.1 butir 1: gagal 20 kali → pakai varian cadangan yang sudah terbukti valid
    return build(seed, level) ?? build(FALLBACK[level][seed % 2]!, level)!;
  },
  oracle(inst) {
    const { mode, A, B, C, D } = inst.params as { mode: Mode; A: P; B: P; C: P; D: P };
    const cands = inst.params.cands as P[];
    const r2 = len2(sub(B, A));
    const f = sub(D, C);
    const good = cands
      .map((p, i) => {
        const v = sub(p, A);
        const dirOk = mode === 'tegak' ? cross(v, f) === 0 : dot(v, f) === 0;
        return len2(v) === r2 && dirOk ? i : -1;
      })
      .filter((i) => i >= 0);
    const ok = inst.options.map((o, i) => (o.ok ? i : -1)).filter((i) => i >= 0);
    // f tidak memotong lingkaran: jarak pusat ke f lebih dari r
    const far = cross(sub(C, A), f) ** 2 > r2 * len2(f);
    return far && good.length === 2 && good.join() === ok.join();
  },
};
