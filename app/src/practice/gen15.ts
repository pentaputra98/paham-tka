/**
 * Generator latihan soal 15 — persamaan lingkaran dari gambar (revisi pemilik v1.16; pola PRD §11.4).
 * Gambar: lingkaran di bidang koordinat dengan pusat P(h, k) dan sebuah diameter; naskah menyebut diameternya.
 *  - Mudah: persamaan lingkaran pada gambar dalam BENTUK BAKU (x − a)² + (y − b)² = r².
 *  - Sedang: persamaan lingkaran pada gambar dalam BENTUK UMUM x² + Ax + y² + By + C = 0 (baku lalu dijabarkan).
 *  - Menantang: variasi "sepusat" — (a) seperti soal asli: lingkaran yang sepusat (bentuk umum, jari-jari lain);
 *    (b) sepusat dan berjari-jari m kali lingkaran pada gambar (bentuk baku atau umum).
 * h, k ∈ [−4, 4] \ {0}, h ≠ ±k, pusat ≠ (−3, 4) soal asli; r ∈ {1, 2, 3}; semua koefisien bulat.
 * Distraktor dari Kesalahan umum soal 15 dan kebiasaan salah saat menjabarkan (tanda pusat, x–y tertukar, r tidak
 * dikuadratkan, diameter dipakai sebagai jari-jari, r² tidak berganti tanda saat pindah ruas, lupa faktor 2,
 * konstanta sama tetapi pusat beda).
 * Oracle: titik-titik pada lingkaran sasaran disubstitusikan ke persamaan tiap pilihan (sepusat: simetri nilai
 * persamaan terhadap pusat), tanpa memakai rumus pembuat.
 */
import { H, O, T } from '../engine/dsl';
import type { Row } from '../engine/types';
import { int, mulberry32, pick, type Rng } from '../core/prng';
import { toCode, type Generator, type Instance, type Level, type Option, type Trap } from './types';

/** persamaan pilihan seperti tertulis: baku (x − p)² + (y − q)² = s, atau umum x² + Ax + y² + By + C = 0 */
export type Eq =
  { f: 'baku'; p: number; q: number; s: number } | { f: 'umum'; A: number; B: number; C: number };
type Mode = 'gambar' | 'sepusat' | 'kali';

/** Jebakan; bab mengacu ke pembahasan soal 15 (2 = pusat dan jari-jari, 3 = rumus, 4 = baku ke umum, 5 = sepusat). */
const TRAPS: Record<string, Trap> = {
  tandaPusat: {
    id: 'tanda-pusat',
    hint: 'Hati-hati dengan tanda. Pada $(x-a)^2+(y-b)^2=r^2$ pusatnya $(a,b)$, jadi tanda di dalam kurung berkebalikan dengan koordinat pusat.',
    chapter: 3,
  },
  tertukar: {
    id: 'x-y-tertukar',
    hint: 'Perhatikan urutan koordinat. Koordinat pertama pusat dipasangkan dengan $x$, koordinat kedua dengan $y$.',
    chapter: 2,
  },
  rTanpaKuadrat: {
    id: 'r-tanpa-kuadrat',
    hint: 'Hati-hati, ruas kanan bentuk baku adalah $r^2$, bukan $r$.',
    chapter: 3,
  },
  diameter: {
    id: 'diameter-bukan-jari',
    hint: 'Perhatikan, yang dimasukkan ke rumus adalah jari-jari, yaitu setengah diameter.',
    chapter: 2,
  },
  lupaPindah: {
    id: 'r2-tidak-pindah-tanda',
    hint: 'Hati-hati saat memindahkan $r^2$ ke ruas kiri: tandanya berubah menjadi negatif.',
    chapter: 4,
  },
  lupaKali2: {
    id: 'lupa-faktor-2',
    hint: 'Hati-hati, $(x-a)^2=x^2-2ax+a^2$: koefisien $x$ adalah $-2a$, bukan $-a$.',
    chapter: 4,
  },
  tandaAB: {
    id: 'tanda-koefisien',
    hint: 'Perhatikan, pusat bentuk umum adalah $\\left(-\\frac A2,-\\frac B2\\right)$: tanda koefisien $x$ dan $y$ berkebalikan dengan koordinat pusat.',
    chapter: 3,
  },
  konstantaSama: {
    id: 'konstanta-sama-pusat-beda',
    hint: 'Hati-hati, konstantanya sama dengan lingkaran pada gambar, tetapi pusatnya berbeda. Sepusat berarti pusatnya sama.',
    chapter: 5,
  },
  lingkaranSendiri: {
    id: 'lingkaran-sendiri',
    hint: 'Perhatikan, ini lingkaran pada gambar itu sendiri. Pusatnya benar, tetapi jari-jari yang diminta berbeda.',
    chapter: 5,
  },
  kuadratSebagian: {
    id: 'kuadrat-sebagian',
    hint: 'Hati-hati, jari-jari baru dikuadratkan seluruhnya: $(m\\times r)^2=m^2r^2$, bukan $m\\times r^2$.',
    chapter: 3,
  },
};

// ---------- penulisan persamaan ----------
const sgn = (v: number): string => (v < 0 ? `-${-v}` : `+${v}`);
const term = (c: number, v: string): string =>
  c === 0 ? '' : c === 1 ? `+${v}` : c === -1 ? `-${v}` : `${sgn(c)}${v}`;
const sq = (v: string, p: number): string => (p === 0 ? `${v}^{2}` : `(${v}${sgn(-p)})^{2}`);
export const eqTex = (e: Eq): string =>
  e.f === 'baku'
    ? `${sq('x', e.p)}+${sq('y', e.q)}=${e.s}`
    : `x^{2}${term(e.A, 'x')}+y^{2}${term(e.B, 'y')}${e.C === 0 ? '' : sgn(e.C)}=0`;
const P = (v: number): string => (v < 0 ? `(${v})` : String(v));
const fig = (v: number): string => (v < 0 ? `−${-v}` : String(v));

/** pusat dan r² persamaan (pembuat; oracle memakai substitusi titik) */
const centerOf = (e: Eq): [number, number, number] =>
  e.f === 'baku' ? [e.p, e.q, e.s] : [-e.A / 2, -e.B / 2, (e.A * e.A + e.B * e.B) / 4 - e.C];
const umumOf = (h: number, k: number, R2: number): Eq => ({
  f: 'umum',
  A: -2 * h,
  B: -2 * k,
  C: h * h + k * k - R2,
});
const bakuOf = (h: number, k: number, R2: number): Eq => ({ f: 'baku', p: h, q: k, s: R2 });

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
  form: 'baku' | 'umum';
  h: number;
  k: number;
  /** jari-jari lingkaran pada gambar */
  r: number;
  /** pengali jari-jari (mode 'kali') */
  m: number;
  key: Eq;
  pool: Array<[Eq, Trap]>;
}

/** Benar menurut pembuat: sama dengan lingkaran sasaran, atau (sepusat) pusatnya sama. */
function correct(e: Eq, w: Raw): boolean {
  const [a, b, R2] = centerOf(e);
  if (a !== w.h || b !== w.k) return false;
  if (w.mode === 'sepusat') return R2 > 0;
  const R = w.mode === 'kali' ? w.m * w.r : w.r;
  return R2 === R * R;
}

function raw(rng: Rng, level: Level): Raw | null {
  const h = pick(rng, [-4, -3, -2, -1, 1, 2, 3, 4]);
  const k = pick(rng, [-4, -3, -2, -1, 1, 2, 3, 4]);
  // h ≠ ±k agar jebakan "x dan y tertukar" bermakna; pusat soal asli (−3, 4) tidak dipakai
  if (Math.abs(h) === Math.abs(k) || (h === -3 && k === 4)) return null;
  const tr = TRAPS;
  if (level === 'mudah') {
    const r = int(rng, 2, 3);
    const R2 = r * r;
    return {
      mode: 'gambar',
      form: 'baku',
      h,
      k,
      r,
      m: 1,
      key: bakuOf(h, k, R2),
      pool: [
        [bakuOf(-h, -k, R2), tr.tandaPusat!],
        [bakuOf(-h, k, R2), tr.tandaPusat!],
        [bakuOf(h, -k, R2), tr.tandaPusat!],
        [bakuOf(k, h, R2), tr.tertukar!],
        [bakuOf(h, k, r), tr.rTanpaKuadrat!],
        [bakuOf(h, k, 4 * R2), tr.diameter!],
      ],
    };
  }
  if (level === 'sedang') {
    const r = int(rng, 1, 3);
    const R2 = r * r;
    const key = umumOf(h, k, R2) as Extract<Eq, { f: 'umum' }>;
    return {
      mode: 'gambar',
      form: 'umum',
      h,
      k,
      r,
      m: 1,
      key,
      pool: [
        [{ f: 'umum', A: -key.A, B: -key.B, C: key.C }, tr.tandaAB!],
        [{ f: 'umum', A: key.A, B: key.B, C: h * h + k * k + R2 }, tr.lupaPindah!],
        [{ f: 'umum', A: -h, B: -k, C: key.C }, tr.lupaKali2!],
        [umumOf(h, k, 4 * R2), tr.diameter!],
        [umumOf(k, h, R2), tr.tertukar!],
        [{ f: 'umum', A: -key.A, B: key.B, C: key.C }, tr.tandaAB!],
      ],
    };
  }
  // menantang: (a) sepusat seperti soal asli, atau (b) sepusat dengan jari-jari m kali
  if (rng() < 0.5) {
    const r = int(rng, 1, 3);
    const r2 = int(rng, 1, 5);
    if (r2 === r) return null;
    const R2 = r2 * r2;
    const key = umumOf(h, k, R2) as Extract<Eq, { f: 'umum' }>;
    const CA = h * h + k * k - r * r;
    return {
      mode: 'sepusat',
      form: 'umum',
      h,
      k,
      r,
      m: 1,
      key,
      pool: [
        [{ f: 'umum', A: -key.A, B: -key.B, C: key.C }, tr.tandaAB!],
        [{ f: 'umum', A: -key.A, B: key.B, C: CA }, tr.konstantaSama!],
        [{ f: 'umum', A: key.A, B: -key.B, C: CA }, tr.konstantaSama!],
        [umumOf(k, h, R2), tr.tertukar!],
        [umumOf(k, h, r * r), tr.tertukar!],
        [{ f: 'umum', A: -h, B: -k, C: key.C }, tr.lupaKali2!],
      ],
    };
  }
  const r = int(rng, 1, 2);
  const m = int(rng, 2, 3);
  const R = m * r;
  const form = rng() < 0.5 ? 'baku' : 'umum';
  const mk = (a: number, b: number, R2: number): Eq =>
    form === 'baku' ? bakuOf(a, b, R2) : umumOf(a, b, R2);
  return {
    mode: 'kali',
    form,
    h,
    k,
    r,
    m,
    key: mk(h, k, R * R),
    pool: [
      [mk(h, k, r * r), tr.lingkaranSendiri!],
      [mk(h, k, m * r * r), tr.kuadratSebagian!],
      [mk(-h, -k, R * R), form === 'baku' ? tr.tandaPusat! : tr.tandaAB!],
      [mk(k, h, R * R), tr.tertukar!],
      ...(form === 'baku' ? [[bakuOf(h, k, R), tr.rTanpaKuadrat!] as [Eq, Trap]] : []),
    ],
  };
}

/** Empat distraktor berbeda satu sama lain dan dari kunci, tidak ada yang benar. */
function distractors(rng: Rng, w: Raw): Array<[Eq, Trap]> | null {
  const out: Array<[Eq, Trap]> = [];
  const seen = new Set([eqTex(w.key)]);
  for (const [e, t] of shuffle(rng, w.pool)) {
    const tx = eqTex(e);
    if (seen.has(tx) || correct(e, w)) continue;
    seen.add(tx);
    out.push([e, t]);
    if (out.length === 4) return out;
  }
  return null;
}

// ---------- gambar ----------
/** Bidang koordinat (garis kisi tiap 1 satuan, label tiap 2) memuat titik asal dan seluruh lingkaran. */
function figure(h: number, k: number, r: number): string {
  let x0 = Math.min(0, h - r) - 1;
  let x1 = Math.max(0, h + r) + 1;
  let y0 = Math.min(0, k - r) - 1;
  let y1 = Math.max(0, k + r) + 1;
  const S = Math.max(x1 - x0, y1 - y0);
  x0 -= Math.floor((S - (x1 - x0)) / 2);
  x1 = x0 + S;
  y0 -= Math.floor((S - (y1 - y0)) / 2);
  y1 = y0 + S;
  const M = 14;
  const U = 200 / S;
  const X = (x: number): string => (M + (x - x0) * U).toFixed(1);
  const Y = (y: number): string => (M + (y1 - y) * U).toFixed(1);
  let g = '';
  for (let x = x0; x <= x1; x++)
    g += `<path class="lg-grid${x === 0 ? ' lg-axis' : ''}" d="M${X(x)} ${Y(y1)}V${Y(y0)}"/>`;
  for (let y = y0; y <= y1; y++)
    g += `<path class="lg-grid${y === 0 ? ' lg-axis' : ''}" d="M${X(x0)} ${Y(y)}H${X(x1)}"/>`;
  for (let x = x0 + 1; x < x1; x++)
    if (x % 2 === 0 && x !== 0)
      g += `<text class="lg-tick" x="${X(x)}" y="${(+Y(0) + 9).toFixed(1)}">${fig(x)}</text>`;
  for (let y = y0 + 1; y < y1; y++)
    if (y % 2 === 0 && y !== 0)
      g += `<text class="lg-tick lg-tick-y" x="${(+X(0) + 4).toFixed(1)}" y="${Y(y)}">${fig(y)}</text>`;
  g += `<text class="lg-tick lg-tick-y" x="${(+X(0) + 4).toFixed(1)}" y="${(+Y(0) + 9).toFixed(1)}">0</text>`;
  // diameter miring melewati pusat, seperti gambar soal asli
  const dx = r * 0.5;
  const dy = r * Math.sqrt(3) * 0.5;
  const R = (r * U).toFixed(1);
  return `<figure class="lat-fig"><svg viewBox="0 0 ${200 + 2 * M} ${200 + 2 * M}" role="img" aria-label="Bidang koordinat dengan sebuah lingkaran berpusat di titik P dan sebuah diameternya">
<g>${g}</g>
<circle class="lg-c" cx="${X(h)}" cy="${Y(k)}" r="${R}"/>
<path class="lg-d" d="M${X(h - dx)} ${Y(k + dy)}L${X(h + dx)} ${Y(k - dy)}"/>
<circle class="lg-e" cx="${X(h - dx)}" cy="${Y(k + dy)}" r="3"/>
<circle class="lg-e" cx="${X(h + dx)}" cy="${Y(k - dy)}" r="3"/>
<circle class="lg-p" cx="${X(h)}" cy="${Y(k)}" r="3.5"/>
<text class="lg-plbl" x="${(+X(h) + 9).toFixed(1)}" y="${(+Y(k) - 7).toFixed(1)}">P</text>
</svg></figure>`;
}

// ---------- penyelesaian (baris papan) ----------
function solution(w: Raw): Instance['solution'] {
  const { h, k, r, m, key } = w;
  const d = 2 * r;
  const center: Row = {
    id: 'g1',
    toks: [H('g1a', 'pusat', 'tx'), O('g1b', '='), T('g1c', `(${h},\\ ${k})`, 'blue')],
    note: 'tarik garis dari $P$ ke sumbu $x$ dan sumbu $y$',
    box: 'navy',
  };
  const radius: Row = {
    id: 'g2',
    toks: [
      T('g2a', 'r'),
      O('g2b', '='),
      T('g2c', `\\tfrac12\\times${d}`),
      O('g2d', '='),
      T('g2e', String(r), 'blue'),
    ],
    note: 'setengah diameter; cocok dengan hitungan kotak dari pusat ke lingkaran',
    box: 'navy',
  };
  const ans: Row = {
    id: 'z1',
    toks: [T('z1a', eqTex(key), 'gold')],
    box: 'gold',
  };
  const subst = (R: number, id: string): Row => ({
    id,
    toks: [T(`${id}a`, `(x-${P(h)})^{2}+(y-${P(k)})^{2}=${R}^{2}`)],
    note: `bentuk baku $(x-a)^2+(y-b)^2=r^2$ dengan $a=${h}$, $b=${k}$, $r=${R}$`,
  });
  const expand = (R: number, id: string): Row => ({
    id,
    toks: [
      T(`${id}a`, `x^{2}${term(-2 * h, 'x')}${sgn(h * h)}+y^{2}${term(-2 * k, 'y')}${sgn(k * k)}=${R * R}`),
    ],
    note: `$(x-a)^2=x^2-2ax+a^2$; lalu $${R * R}$ pindah ke ruas kiri: $${h * h}+${k * k}-${R * R}=${h * h + k * k - R * R}$`,
  });
  if (w.mode === 'gambar' && w.form === 'baku')
    return [
      { title: 'Pusat dan jari-jari dari gambar', rows: [center, radius] },
      { title: 'Masukkan ke bentuk baku', rows: [subst(r, 'b1'), { ...ans, note: 'rapikan tandanya' }] },
    ];
  if (w.mode === 'gambar')
    return [
      { title: 'Pusat dan jari-jari dari gambar', rows: [center, radius] },
      { title: 'Masukkan ke bentuk baku', rows: [subst(r, 'b1')] },
      { title: 'Jabarkan ke bentuk umum', rows: [expand(r, 'j1'), { ...ans, note: 'bentuk umum' }] },
    ];
  if (w.mode === 'sepusat')
    return [
      { title: 'Pusat dari gambar', rows: [center] },
      {
        title: 'Hati-hati: sepusat',
        rows: [
          {
            id: 'p1',
            toks: [
              H('p1a', 'sepusat', 'blue'),
              O('p1b', '='),
              H('p1c', 'pusat sama, jari-jari boleh beda', 'tx'),
            ],
          },
          {
            id: 'p2',
            toks: [
              H('p2a', 'pusat', 'tx'),
              O('p2b', '='),
              T('p2c', '\\left(-\\tfrac A2,\\ -\\tfrac B2\\right)'),
            ],
            note: `cari koefisien $x$ sama dengan $${-2 * h}$ dan koefisien $y$ sama dengan $${-2 * k}$`,
          },
        ],
      },
      {
        title: 'Pilihan yang sepusat',
        rows: [{ ...ans, note: `pusat $(${h},${k})$; konstanta boleh berbeda` }],
      },
    ];
  const R = m * r;
  return [
    { title: 'Pusat dan jari-jari dari gambar', rows: [center, radius] },
    {
      title: 'Jari-jari yang diminta',
      rows: [
        {
          id: 'm1',
          toks: [
            T('m1a', 'r_{\\text{baru}}'),
            O('m1b', '='),
            T('m1c', `${m}\\times${r}`),
            O('m1d', '='),
            T('m1e', String(R), 'blue'),
          ],
          note: 'pusat tetap sama (sepusat)',
          box: 'navy',
        },
      ],
    },
    {
      title: w.form === 'baku' ? 'Masukkan ke bentuk baku' : 'Baku, lalu jabarkan',
      rows:
        w.form === 'baku'
          ? [subst(R, 'b1'), { ...ans, note: `ruas kanan $${R}^2=${R * R}$` }]
          : [subst(R, 'b1'), expand(R, 'j1'), { ...ans, note: 'bentuk umum' }],
    },
  ];
}

function hints(w: Raw): [string, string, string] {
  const { h, k, r, m } = w;
  const first =
    'Cari dulu pusat dan jari-jari lingkaran pada gambar: pusat dibaca dari garis kisi, jari-jari setengah diameter.';
  if (w.mode === 'gambar' && w.form === 'baku')
    return [
      first,
      `Pusatnya $(${h},${k})$ dan jari-jarinya $${r}$. Masukkan ke bentuk baku $(x-a)^2+(y-b)^2=r^2$.`,
      'Perhatikan tanda di dalam kurung dan ruas kanan $r^2$. Pilihan mana yang cocok?',
    ];
  if (w.mode === 'gambar')
    return [
      first,
      `Pusatnya $(${h},${k})$ dan jari-jarinya $${r}$. Tulis bentuk bakunya, lalu jabarkan: $(x-a)^2=x^2-2ax+a^2$.`,
      `Pindahkan $${r * r}$ ke ruas kiri (tandanya berubah), lalu jumlahkan angkanya. Cocokkan dengan pilihan.`,
    ];
  if (w.mode === 'sepusat')
    return [
      'Sepusat artinya pusatnya sama, jari-jarinya boleh berbeda. Jadi cukup cari pusat lingkaran pada gambar.',
      `Pusatnya $(${h},${k})$. Untuk $x^2+y^2+Ax+By+C=0$, pusatnya $\\left(-\\frac A2,-\\frac B2\\right)$.`,
      `Cari pilihan dengan koefisien $x$ sama dengan $${-2 * h}$ dan koefisien $y$ sama dengan $${-2 * k}$; konstanta boleh beda.`,
    ];
  return [
    'Sepusat artinya pusatnya sama. Jari-jarinya ditentukan soal: kalikan jari-jari lingkaran pada gambar.',
    `Pusatnya $(${h},${k})$, jari-jari pada gambar $${r}$, jadi jari-jari baru $${m}\\times${r}=${m * r}$.`,
    w.form === 'baku'
      ? 'Masukkan ke $(x-a)^2+(y-b)^2=r^2$; ingat ruas kanan $r^2$, jari-jari baru dikuadratkan seluruhnya.'
      : 'Masukkan ke bentuk baku, jabarkan, lalu pindahkan $r^2$ ke ruas kiri. Cocokkan dengan pilihan.',
  ];
}

const ASK: Record<string, (w: Raw) => string> = {
  'gambar-baku': () => 'Persamaan lingkaran tersebut dalam bentuk baku adalah ....',
  'gambar-umum': () => 'Persamaan lingkaran tersebut dalam bentuk umum adalah ....',
  'sepusat-umum': () => 'Persamaan lingkaran yang sepusat dengan lingkaran pada gambar tersebut adalah ....',
  kali: (w) =>
    `Persamaan lingkaran yang sepusat dengan lingkaran pada gambar dan berjari-jari ${w.m === 2 ? 'dua' : 'tiga'} kali jari-jarinya, dalam bentuk ${w.form}, adalah ....`,
};

const FALLBACK: Record<Level, number[]> = { mudah: [3, 8], sedang: [5, 13], menantang: [2, 21] };

function build(seed: number, level: Level): Instance | null {
  const rng = mulberry32(seed);
  for (let tries = 0; tries < 20; tries++) {
    const w = raw(rng, level);
    if (!w) continue;
    const ds = distractors(rng, w);
    if (!ds) continue;
    const opts: Array<{ e: Eq; trap?: Trap }> = shuffle(rng, [
      { e: w.key },
      ...ds.map(([e, trap]) => ({ e, trap })),
    ]);
    const keyIdx = opts.findIndex((o) => !o.trap);
    const options: Option[] = opts.map((o) => ({
      tex: eqTex(o.e),
      ok: !o.trap,
      ...(o.trap ? { trap: o.trap } : {}),
    }));
    const ask = ASK[w.mode === 'kali' ? 'kali' : `${w.mode}-${w.form}`]!(w);
    const paper = `<div class="lat24"><div>
<p>Perhatikan gambar lingkaran berikut.</p>
<p>Diameter lingkaran pada gambar adalah $${2 * w.r}$ satuan. ${ask}</p>
</div>${figure(w.h, w.k, w.r)}</div>`;
    const target = (e: Eq): string => {
      const [a, b, R2] = centerOf(e);
      const rr =
        R2 <= 0
          ? `r^2=${R2}\\le0`
          : Number.isInteger(Math.sqrt(R2))
            ? `r=${Math.sqrt(R2)}`
            : `r=\\sqrt{${R2}}`;
      return `\\text{pusat }(${a},\\ ${b}),\\ ${rr}`;
    };
    return {
      no: 15,
      seed,
      level,
      code: toCode(seed, level),
      paper,
      options,
      key: keyIdx,
      col: true,
      summary: eqTex(w.key),
      chapter: w.mode === 'gambar' ? (w.form === 'baku' ? 3 : 4) : 5,
      hints: hints(w),
      solution: solution(w),
      timeAdvice: level === 'mudah' ? 90 : level === 'sedang' ? 150 : 180,
      test(i) {
        return { tex: target(opts[i]!.e), ok: !opts[i]!.trap };
      },
      params: { mode: w.mode, form: w.form, h: w.h, k: w.k, r: w.r, m: w.m, opts: opts.map((o) => o.e) },
    };
  }
  return null;
}

/** nilai ruas kiri − ruas kanan persamaan pada titik (x, y), seperti tertulis */
const value = (e: Eq, x: number, y: number): number =>
  e.f === 'baku' ? (x - e.p) ** 2 + (y - e.q) ** 2 - e.s : x * x + e.A * x + y * y + e.B * y + e.C;

export const gen15: Generator = {
  no: 15,
  levels: {
    mudah: 'Pusat dan jari-jari dari gambar, jawab dalam bentuk baku.',
    sedang: 'Lingkaran yang sama, jawab dalam bentuk umum (jabarkan).',
    menantang: 'Sepusat: seperti soal asli, atau sepusat dengan jari-jari berlipat.',
  },
  make(seed, level) {
    // §11.1 butir 1: gagal 20 kali → pakai varian cadangan yang sudah terbukti valid
    return build(seed, level) ?? build(FALLBACK[level][seed % 2]!, level)!;
  },
  oracle(inst) {
    const { mode, h, k, r, m } = inst.params as { mode: Mode; h: number; k: number; r: number; m: number };
    const opts = inst.params.opts as Eq[];
    const eps = 1e-9;
    const good = opts
      .map((e, i) => {
        if (mode === 'sepusat') {
          // sepusat dengan P: nilai persamaan simetris terhadap P, dan P berada di dalam lingkaran (lingkaran nyata)
          const sym = [1, 2, 3].every(
            (t) =>
              Math.abs(value(e, h + t, k) - value(e, h - t, k)) < eps &&
              Math.abs(value(e, h, k + t) - value(e, h, k - t)) < eps,
          );
          return sym && value(e, h, k) < 0 ? i : -1;
        }
        // lingkaran sasaran: semua titik pada lingkaran berpusat P berjari-jari R memenuhi persamaan
        const R = mode === 'kali' ? m * r : r;
        const on = Array.from({ length: 12 }, (_, j) => (j * Math.PI) / 6).every(
          (t) => Math.abs(value(e, h + R * Math.cos(t), k + R * Math.sin(t))) < 1e-7,
        );
        return on ? i : -1;
      })
      .filter((i) => i >= 0);
    return good.length === 1 && good[0] === inst.key && inst.options[inst.key]!.ok;
  },
};
