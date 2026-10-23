/**
 * SOAL 16 — Titik Singgung Tegak Lurus Garis f (lingkaran dan garis singgung; multi-jawaban).
 * Sumber: docs/pembahasan25.md "SOAL 16", docs/soal25.md no. 16, docs/garis_dan_lingkaran.png.
 * Kunci: (3, −1) dan (1, −5).
 * Alur gaya mengajar Pak Penta (revisi pemilik v1.17, dicatat di dokumen): kumpulkan data dari gambar dulu —
 * gradien f dari hitung kotak (geser 1, naik 2), pusat A, jari-jari dari A ke B (geser 1, naik 2, r = √5) →
 * sifat: garis singgung ⊥ jari-jari, garis singgung ⊥ f, jadi jari-jari ∥ f → dari A searah f sejauh r: T₁ = B,
 * arah sebaliknya T₂ → hati-hati: bukan perpotongan f dengan lingkaran → tiap pilihan disalin dari soal, AT²
 * dibandingkan dengan r² dan titik di catatan.
 * Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Step, Visual } from '../../engine/types';
import type { Sing16State } from '../../visuals/sing16';
import { getSoal } from '../index';

/** Gambar asli soal (docs/garis_dan_lingkaran.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/garis_dan_lingkaran.png', import.meta.url).href;
const sing = (state: Sing16State): Visual => ({ kind: 'svg', scene: 'sing16', state });
/** catatan: gradien f, pusat, jari-jari, titik singgung */
const N1 = ['pM'];
const N2 = ['pM', 'pA'];
const N3 = ['pM', 'pA', 'pR'];
const N4 = ['pA', 'pR', 'pT'];
/** kelima pilihan (docs/soal25.md no. 16): titik dan vektor AT dengan A = (2, −3) */
const OPTS: Array<[number, number]> = [
  [3, 1],
  [1, -5],
  [-1, 5],
  [3, -1],
  [-3, -1],
];
const ptTex = ([x, y]: [number, number]): string => `(${x},${y})`;
const quote = (n: number): Row => ({
  id: `q${n}`,
  toks: [T(`q${n}a`, `(${n})`, 'sp'), H(`q${n}b`, `$${ptTex(OPTS[n - 1]!)}$`, 'q', `@s-o${n}`)],
});
/** baris uji: AT² dari vektor AT (di keterangan) dibandingkan dengan r² = 5 */
const test = (n: number, note: string): Row => {
  const [x, y] = OPTS[n - 1]!;
  const [dx, dy] = [x - 2, y + 3];
  const v = dx * dx + dy * dy;
  const ok = v === 5 && dy === 2 * dx;
  return {
    id: `o${n}`,
    toks: [
      T(`o${n}a`, 'AT^2', '', `q${n}b`),
      O(`o${n}b`, '='),
      T(`o${n}c`, `${dx * dx}+${dy * dy}`),
      O(`o${n}d`, '='),
      T(`o${n}e`, String(v)),
      T(`o${n}f`, ok ? '=r^2' : '\\ne5', ok ? 'gold' : 'red'),
    ],
    note: `$\\vec{AT}=(${dx},${dy})$; ${note}`,
    ...(ok ? { box: 'gold' as const } : {}),
  };
};
const open6 = (n: number, cap: string): Step => ({
  ch: 6,
  cap,
  visual: { kind: 'soal', hl: 0, focus: `s-o${n}` },
  board: { title: `Pilihan (${n})`, pins: N4, list: `LO${n}`, upTo: 1, from: 0 },
});
const check6 = (n: number, cap: string): Step => ({
  ch: 6,
  cap,
  visual: sing({ cand: n, pts: 2 }),
  board: { title: `Pilihan (${n})`, pins: N4, list: `LO${n}`, upTo: 2, from: 1 },
});

const q16: SoalContent = {
  meta: getSoal(16)!,
  sourceRef: 'docs/pembahasan25.md#soal-16',
  layout: 'full',
  paper: {
    html: `<div class="soal-split"><div>
<p>Perhatikan gambar berikut.</p>
<p>Tentukan <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">semua koordinat titik singgung</span></span> lingkaran dari <span class="hl hl-blue" data-hl="1"><span data-src="s-singgung">garis-garis singgung lingkaran</span></span> yang <span class="hl hl-red" data-hl="1"><span data-src="s-tegak">tegak lurus terhadap garis f</span></span>.</p>
<p>Pilih semua jawaban yang benar! Jawaban benar lebih dari satu.</p>
</div><figure class="soal-fig"><img src="${fig}" width="780" height="716" alt="Bidang koordinat: garis f melalui C = (−1, 0) dan D = (0, 2); lingkaran c berpusat A = (2, −3) dan melalui B = (3, −1)." /></figure></div>
<ul class="checks">
${OPTS.map((p, i) => `<li><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">$${ptTex(p)}$</span></span></li>`).join('\n')}
</ul>`,
    srcNames: ['s-tanya', 's-singgung', 's-tegak', 's-o1', 's-o2', 's-o3', 's-o4', 's-o5'],
  },
  visualSrc: ['g-A', 'g-B', 'g-C', 'g-D', 'g-run', 'g-rise', 'g-run2', 'g-rise2'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Lingkaran',
    titleLines: ['Pembahasan Soal', 'Titik <span class="accent">Singgung</span>', 'Garis Tegak Lurus'],
    lede: 'Ada lingkaran dan garis $f$. Garis singgung yang tegak lurus $f$ menyentuh lingkaran di titik mana saja?',
    facts: [
      { dt: 'Pusat', dd: 'A(2, −3)' },
      { dt: 'Garis f', dd: 'melalui C dan D' },
      { dt: 'Dicari', dd: 'titik singgung' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Data dari gambar', d: 'Gradien, pusat, jari-jari' },
    { t: 'Sifat garis singgung', d: 'Jari-jari sejajar f' },
    { t: 'Titik singgung', d: 'Dari pusat searah f' },
    { t: 'Cara alternatif', d: 'Opsional: rumus geser dari pusat', opt: true },
    { t: 'Uji kelima pilihan', d: 'Satu per satu' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: '(3, −1) dan (1, −5)' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pM: { id: 'pM', toks: [T('PM0', 'm_f', '', 'a2a'), O('PM1', '='), T('PM2', '2', '', 'a2g')] },
    pA: { id: 'pA', toks: [T('PA0', 'A', '', 'c1a'), O('PA1', '='), T('PA2', '(2,\\ -3)', '', 'c1c')] },
    pR: { id: 'pR', toks: [T('PR0', 'r', '', 'c3a'), O('PR1', '='), T('PR2', '\\sqrt5', '', 'c3e')] },
    pT: {
      id: 'pT',
      gold: true,
      toks: [T('PT1', 'T_1=(3,\\ -1)', '', 't3e'), O('PT2', ','), T('PT3', 'T_2=(1,\\ -5)', '', 't4e')],
    },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [
          H('k1a', 'Ditanya', 'lbl'),
          H('k1b', 'titik singgung', 'gold', '@s-tanya'),
          H('k1c', 'dari garis singgung', 'tx', '@s-singgung'),
          T('k1d', '\\perp f', 'red', '@s-tegak'),
        ],
        note: 'garis singgungnya tegak lurus garis $f$',
      },
      {
        id: 'k2',
        toks: [H('k2a', 'Langkah pertama', 'lbl'), H('k2b', 'kumpulkan data dari gambar', 'tx')],
        note: 'gradien $f$, pusat lingkaran, dan jari-jarinya',
      },
    ],
    LG: [
      {
        id: 'a1',
        toks: [
          H('a1a', 'dari', 'tx'),
          T('a1b', 'C', '', '@g-C'),
          H('a1c', 'ke', 'tx'),
          T('a1d', 'D', '', '@g-D'),
          O('a1e', '\\to'),
          H('a1f', 'geser', 'tx'),
          T('a1g', '1', 'blue', '@g-run'),
          H('a1h', 'naik', 'tx'),
          T('a1i', '2', 'blue', '@g-rise'),
        ],
        note: 'hitung kotaknya',
      },
      {
        id: 'a2',
        toks: [
          T('a2a', 'm_f'),
          O('a2b', '='),
          T('a2c', '\\tfrac{\\text{naik}}{\\text{geser}}'),
          O('a2d', '='),
          T('a2e', '\\tfrac21', '', 'a1i'),
          O('a2f', '='),
          T('a2g', '2', 'blue'),
        ],
        note: '$f$ naik ke kanan, gradiennya positif; simpan ke catatan',
        box: 'navy',
      },
    ],
    LC: [
      {
        id: 'c1',
        toks: [T('c1a', 'A'), O('c1b', '='), T('c1c', '(2,\\ -3)', 'blue', '@g-A')],
        note: 'pusat lingkaran; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'c2',
        toks: [
          H('c2a', 'dari', 'tx'),
          T('c2b', 'A', '', 'PA0'),
          H('c2c', 'ke', 'tx'),
          T('c2d', 'B', '', '@g-B'),
          O('c2e', '\\to'),
          H('c2f', 'geser', 'tx'),
          T('c2g', '1', 'blue', '@g-run2'),
          H('c2h', 'naik', 'tx'),
          T('c2i', '2', 'blue', '@g-rise2'),
        ],
        note: '$B$ ada di lingkaran, jadi $AB$ = jari-jari',
      },
      {
        id: 'c3',
        toks: [
          T('c3a', 'r'),
          O('c3b', '='),
          T('c3c', '\\sqrt{1^2+2^2}'),
          O('c3d', '='),
          T('c3e', '\\sqrt5', 'blue'),
        ],
        note: 'Pythagoras; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'c4',
        toks: [T('c4a', 'AB'), O('c4b', '\\parallel'), T('c4c', 'f', 'blue')],
        note: 'sama-sama geser $1$, naik $2$',
      },
    ],
    LS: [
      {
        id: 's1',
        toks: [H('s1a', 'garis singgung', 'tx'), O('s1b', '\\perp'), H('s1c', 'jari-jari', 'tx')],
        note: 'selalu, di titik singgungnya',
        box: 'navy',
      },
      {
        id: 's2',
        toks: [H('s2a', 'garis singgung', 'tx'), O('s2b', '\\perp'), T('s2c', 'f')],
        note: 'yang diminta soal',
      },
      {
        id: 's3',
        toks: [H('s3a', 'jadi jari-jari', 'tx'), O('s3b', '\\parallel'), T('s3c', 'f', 'blue')],
        note: 'keduanya tegak lurus garis singgung yang sama',
        box: 'navy',
      },
    ],
    LT1: [
      {
        id: 't1',
        toks: [
          H('t1a', 'searah', 'tx'),
          T('t1b', 'f'),
          O('t1c', '\\to'),
          T('t1d', '(1,\\ 2)', 'blue', 'PM2'),
        ],
        note: 'gradien $2$: geser $1$, naik $2$',
      },
      {
        id: 't2',
        toks: [
          H('t2a', 'panjangnya', 'tx'),
          O('t2b', '='),
          T('t2c', '\\sqrt{1^2+2^2}'),
          O('t2d', '='),
          T('t2e', '\\sqrt5', 'blue', 'PR2'),
          O('t2f', '='),
          T('t2g', 'r'),
        ],
        note: 'tepat sejauh jari-jari, jadi langsung sampai di lingkaran',
        box: 'navy',
      },
      {
        id: 't3',
        toks: [
          T('t3a', 'T_1'),
          O('t3b', '='),
          T('t3c', '(2+1,\\ -3+2)'),
          O('t3d', '='),
          T('t3e', '(3,\\ -1)', 'gold'),
        ],
        note: 'yaitu titik $B$ pada gambar',
        box: 'gold',
      },
      {
        id: 't4',
        toks: [
          T('t4a', 'T_2'),
          O('t4b', '='),
          T('t4c', '(2-1,\\ -3-2)'),
          O('t4d', '='),
          T('t4e', '(1,\\ -5)', 'gold'),
        ],
        note: 'arah sebaliknya: geser $1$ ke kiri, turun $2$; simpan ke catatan',
        box: 'gold',
      },
    ],
    LT2: [
      {
        id: 't5',
        toks: [
          T('t5a', 'm_s'),
          O('t5b', '='),
          T('t5c', '-\\tfrac{1}{m_f}'),
          O('t5d', '='),
          T('t5e', '-\\tfrac12', 'blue'),
        ],
        note: 'tegak lurus $f$: $m_f\\cdot m_s=-1$; garis singgung di $T_1$ dan di $T_2$',
      },
      {
        id: 'h1',
        toks: [H('h1a', 'Hati-hati', 'lbl'), T('h1b', 'f'), H('h1c', 'tidak memotong lingkaran', 'tx')],
        note: 'jarak $A$ ke $f$ $=\\frac{9}{\\sqrt5}\\approx4{,}02>\\sqrt5$; yang dipakai hanya arah $f$',
      },
    ],
    // cara alternatif (opsional, revisi pemilik v1.18): rumus geser dari pusat
    LX: [
      {
        id: 'x1',
        toks: [
          H('x1a', 'titik', 'tx'),
          T('x1b', 'B'),
          H('x1c', 'hanya untuk mencari', 'tx'),
          T('x1d', 'r'),
          O('x1e', '='),
          T('x1f', '\\sqrt5', 'blue', 'PR2'),
        ],
        note: '$B$ boleh di mana saja pada lingkaran',
      },
      {
        id: 'x2',
        toks: [
          T('x2a', 'm'),
          O('x2b', '='),
          T('x2c', '2', '', 'PM2'),
          O('x2d', '='),
          T('x2e', '\\tfrac pq'),
          O('x2f', '\\Rightarrow'),
          T('x2g', 'q=1,\\ p=2', 'blue'),
        ],
        note: 'jari-jari sejajar $f$, gradiennya sama; $q$ = geser, $p$ = naik',
      },
      {
        id: 'x3',
        toks: [
          T('x3a', 'k'),
          O('x3b', '='),
          T('x3c', '\\sqrt{q^2+p^2}'),
          O('x3d', '='),
          T('x3e', '\\sqrt{1^2+2^2}'),
          O('x3f', '='),
          T('x3g', '\\sqrt5', 'blue'),
        ],
        note: 'sisi miring segitiga geser–naik',
        box: 'navy',
      },
    ],
    LY: [
      {
        id: 'y1',
        toks: [T('y1a', 'x_T'), O('y1b', '='), T('y1c', 'x_A\\pm r\\cdot\\tfrac qk', 'blue')],
        note: 'pusat digeser mendatar',
        box: 'navy',
      },
      {
        id: 'y2',
        toks: [T('y2a', 'y_T'), O('y2b', '='), T('y2c', 'y_A\\pm r\\cdot\\tfrac pk', 'blue')],
        note: 'pusat digeser tegak; $A=(x_A,\\ y_A)$',
        box: 'navy',
      },
    ],
    LV: [
      {
        id: 'v1',
        toks: [
          T('v1a', 'x'),
          O('v1b', '='),
          T('v1c', '2', '', 'PA2'),
          T('v1d', '+\\sqrt5\\cdot\\tfrac{1}{\\sqrt5}', '', 'PR2'),
          O('v1e', '='),
          T('v1f', '2+1'),
          O('v1g', '='),
          T('v1h', '3', 'blue'),
        ],
        note: '$r=\\sqrt5$, $q=1$, $k=\\sqrt5$: $\\sqrt5\\cdot\\frac{1}{\\sqrt5}=1$',
      },
      {
        id: 'v2',
        toks: [
          T('v2a', 'y'),
          O('v2b', '='),
          T('v2c', '-3', '', 'PA2'),
          T('v2d', '+\\sqrt5\\cdot\\tfrac{2}{\\sqrt5}'),
          O('v2e', '='),
          T('v2f', '-3+2'),
          O('v2g', '='),
          T('v2h', '-1', 'blue'),
        ],
        note: '$p=2$',
      },
      {
        id: 'v3',
        toks: [T('v3a', 'T_1'), O('v3b', '='), T('v3c', '(3,\\ -1)', 'gold')],
        note: 'sama dengan cara pertama',
        box: 'gold',
      },
    ],
    LW: [
      {
        id: 'w1',
        toks: [
          T('w1a', 'x'),
          O('w1b', '='),
          T('w1c', '2-\\sqrt5\\cdot\\tfrac{1}{\\sqrt5}'),
          O('w1d', '='),
          T('w1e', '2-1'),
          O('w1f', '='),
          T('w1g', '1', 'blue'),
        ],
      },
      {
        id: 'w2',
        toks: [
          T('w2a', 'y'),
          O('w2b', '='),
          T('w2c', '-3-\\sqrt5\\cdot\\tfrac{2}{\\sqrt5}'),
          O('w2d', '='),
          T('w2e', '-3-2'),
          O('w2f', '='),
          T('w2g', '-5', 'blue'),
        ],
      },
      {
        id: 'w3',
        toks: [T('w3a', 'T_2'), O('w3b', '='), T('w3c', '(1,\\ -5)', 'gold')],
        note: 'sama dengan cara pertama',
        box: 'gold',
      },
    ],
    LZ: [
      {
        id: 'z1',
        toks: [
          H('z1a', 'hasil sama', 'tx'),
          T('z1b', 'T_1=(3,-1)', '', 'PT1'),
          O('z1c', ','),
          T('z1d', 'T_2=(1,-5)', '', 'PT3'),
        ],
        note: 'berlaku di mana pun letak $B$; $B$ cukup untuk mencari $r$',
        box: 'navy',
      },
    ],
    LO1: [quote(1), test(1, 'tidak berada di lingkaran → <b class="k-red">bukan</b>')],
    LO2: [quote(2), test(2, 'di lingkaran, sama dengan $T_2$ di catatan → <b class="k-gold">benar</b>')],
    LO3: [quote(3), test(3, 'jauh di luar lingkaran → <b class="k-red">bukan</b>')],
    LO4: [quote(4), test(4, 'di lingkaran, sama dengan $T_1$ di catatan → <b class="k-gold">benar</b>')],
    LO5: [quote(5), test(5, 'tidak berada di lingkaran → <b class="k-red">bukan</b>')],
    L7: [
      {
        id: 's6',
        toks: [H('s6a', 'Jawaban', 'lbl'), T('s6b', '(3,-1)'), H('s6c', 'dan', 'tx'), T('s6d', '(1,-5)')],
        box: 'gold',
      },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', 'T_1=(3,-1)')], note: 'garis singgung $x+2y-1=0$', box: 'gold' },
      { id: 'r2', toks: [T('r2a', 'T_2=(1,-5)')], note: 'garis singgung $x+2y+9=0$', box: 'gold' },
      {
        id: 'r3',
        toks: [H('r3a', 'Jawaban', 'lbl'), T('r3b', '(3,-1)'), H('r3c', 'dan', 'tx'), T('r3d', '(1,-5)')],
        box: 'gold',
      },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan gambar dan soalnya. Kita mencari titik singgung dari garis singgung yang tegak lurus garis $f$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Langkah pertama, kumpulkan data dari gambar: gradien garis $f$, pusat lingkaran, dan jari-jarinya.',
      visual: sing({}),
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Data dari gambar ----
    {
      ch: 2,
      cap: 'Perbesar garis $f$. Dari $C$ ke $D$ geser $1$ kotak ke kanan lalu naik $2$ kotak, jadi gradiennya $\\frac21=2$.',
      visual: sing({ cam: 'f', grad: true }),
      board: { title: 'Gradien garis f', list: 'LG', upTo: 2, from: 0, save: ['pM'] },
      ask: {
        before: 'a2',
        q: 'Dari $C$ ke $D$ geser $1$ dan naik $2$. Gradien garis $f$ adalah…',
        opts: [
          { tex: '2', ok: true },
          { tex: '\\tfrac12', hint: 'Gradien = naik dibagi geser: $2$ dibagi $1$, bukan sebaliknya.' },
          { tex: '-2', hint: 'Garis $f$ naik ke kanan pada gambar, jadi gradiennya positif.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Sekarang lingkarannya. Pusatnya titik $A=(2,-3)$, kita simpan ke catatan.',
      visual: sing({ cam: 'A' }),
      board: { title: 'Lingkaran c', pins: N1, list: 'LC', upTo: 1, from: 0, save: ['pA'] },
    },
    {
      ch: 2,
      cap: 'Jari-jari = jarak $A$ ke $B$. Dari $A$ ke $B$ geser $1$ lalu naik $2$, jadi $r=\\sqrt{1^2+2^2}=\\sqrt5$.',
      visual: sing({ cam: 'A', rad: true }),
      board: { title: 'Lingkaran c', pins: N2, list: 'LC', upTo: 3, from: 1, save: ['pR'] },
    },
    {
      ch: 2,
      cap: 'Tahukah kalian? Dari $A$ ke $B$ juga geser $1$ naik $2$, sama seperti garis $f$; ingat ini, nanti sangat berguna.',
      visual: sing({ grad: true, rad: true }),
      board: { title: 'Lingkaran c', pins: N3, list: 'LC', upTo: 4, from: 3 },
    },
    // ---- 3 · Sifat garis singgung ----
    {
      ch: 3,
      cap: 'Tahukah kalian? Garis singgung selalu tegak lurus jari-jari di titik singgungnya.',
      visual: sing({ sifat: true }),
      board: { title: 'Sifat garis singgung', pins: N3, list: 'LS', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Garis singgung yang dicari tegak lurus $f$ dan juga tegak lurus jari-jari. Jadi jari-jarinya sejajar $f$: geser $f$ sampai melewati pusat $A$.',
      visual: sing({ par: true }),
      board: { title: 'Sifat garis singgung', pins: N3, list: 'LS', upTo: 3, from: 1 },
      ask: {
        before: 's3',
        q: 'Titik singgung terletak pada jari-jari yang…',
        col: true,
        opts: [
          { txt: 'sejajar garis f', ok: true },
          {
            txt: 'tegak lurus garis f',
            hint: 'Yang tegak lurus $f$ adalah garis <b>singgung</b>. Jari-jari tegak lurus garis singgung, jadi sejajar $f$.',
          },
          {
            txt: 'sama dengan garis f',
            hint: '$f$ tidak melalui pusat lingkaran. Jari-jari hanya <b>sejajar</b> $f$.',
          },
        ],
      },
    },
    // ---- 4 · Titik singgung ----
    {
      ch: 4,
      cap: 'Perbesar di pusat $A$. Dari $A$ geser $1$ ke kanan lalu naik $2$, searah $f$; panjangnya $\\sqrt5$, tepat sejauh jari-jari, jadi kita sampai di lingkaran.',
      visual: sing({ cam: 'T', par: true, walk: 1 }),
      board: { title: 'Titik singgung', pins: N3, list: 'LT1', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Titik singgung pertama $T_1=(2+1,\\ -3+2)=(3,-1)$, yaitu titik $B$ pada gambar.',
      visual: sing({ cam: 'T', par: true, walk: 1, pts: 1 }),
      board: { title: 'Titik singgung', pins: N3, list: 'LT1', upTo: 3, from: 2 },
    },
    {
      ch: 4,
      cap: 'Hati-hati, ada arah kebalikannya: dari $A$ geser $1$ ke kiri lalu turun $2$. Ketemu titik singgung kedua $T_2=(2-1,\\ -3-2)=(1,-5)$.',
      visual: sing({ cam: 'T', par: true, walk: 2, pts: 2 }),
      board: { title: 'Titik singgung', pins: N3, list: 'LT1', upTo: 4, from: 3, save: ['pT'] },
    },
    {
      ch: 4,
      cap: 'Di kedua titik itu garis singgungnya tegak lurus $f$, gradiennya $-\\frac12$. Jadi ada dua titik singgung, bukan satu.',
      visual: sing({ tan: true, pts: 2 }),
      board: { title: 'Garis singgungnya', pins: N4, list: 'LT2', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Hati-hati, jangan mencari perpotongan garis $f$ dengan lingkaran. Garis $f$ tidak menyentuh lingkaran; yang kita pakai hanya arahnya.',
      visual: sing({ miss: true, pts: 2 }),
      board: { title: 'Garis singgungnya', pins: N4, list: 'LT2', upTo: 2, from: 1 },
    },
    // tawaran cara alternatif (revisi pemilik v1.18): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Di soal ini $B$ kebetulan searah $f$, jadi $B$ langsung menjadi titik singgung. Mau lihat cara alternatif yang tetap berlaku walau $B$ ada di tempat lain?',
      visual: sing({ rad: true, pts: 2 }),
      board: { title: 'Garis singgungnya', pins: N4, list: 'LT2', upTo: 2, from: 2 },
      branch: { yes: 'Ya, lihat cara alternatif' },
    },
    // ---- 5 · Cara alternatif (opsional): rumus geser dari pusat ----
    {
      ch: 5,
      cap: 'Misalkan titik $B$ ada di tempat lain pada lingkaran. Maka $B$ hanya berguna untuk satu hal: mencari panjang jari-jari $r$.',
      visual: sing({ rot: true }),
      board: { title: 'Cara alternatif', pins: N3, list: 'LX', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Jari-jari yang dicari sejajar $f$, jadi gradiennya $2=\\frac pq$. Artinya geser $q=1$, naik $p=2$.',
      visual: sing({ rot: true, cam: 'T', pq: 1 }),
      board: { title: 'Cara alternatif', pins: N3, list: 'LX', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: 'Hitung sisi miring segitiga geser–naik itu: $k=\\sqrt{q^2+p^2}=\\sqrt{1^2+2^2}=\\sqrt5$.',
      visual: sing({ rot: true, cam: 'T', pq: 2 }),
      board: { title: 'Cara alternatif', pins: N3, list: 'LX', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: 'Tahukah kalian? Titik singgung didapat dengan menggeser pusat: $x$ digeser $r\\cdot\\frac qk$ dan $y$ digeser $r\\cdot\\frac pk$, ke dua arah ($\\pm$).',
      visual: sing({ rot: true, cam: 'T', pq: 2, go: 2 }),
      board: { title: 'Rumus geser dari pusat', pins: N3, list: 'LY', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pakai tanda plus: $x=2+\\sqrt5\\cdot\\frac1{\\sqrt5}=2+1=3$ dan $y=-3+\\sqrt5\\cdot\\frac2{\\sqrt5}=-3+2=-1$. Jadi $T_1=(3,-1)$.',
      visual: sing({ rot: true, cam: 'T', walk: 1, pts: 1 }),
      board: { title: 'Tanda plus', pins: N3, list: 'LV', upTo: 3, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pakai tanda minus: $x=2-1=1$ dan $y=-3-2=-5$. Jadi $T_2=(1,-5)$, sama dengan cara tadi.',
      visual: sing({ rot: true, cam: 'T', walk: 2, pts: 2 }),
      board: { title: 'Tanda minus', pins: N3, list: 'LW', upTo: 3, from: 0 },
    },
    {
      ch: 5,
      cap: 'Hasilnya sama dengan cara pertama. Rumus geser dari pusat ini tetap berlaku di mana pun letak $B$, karena $B$ hanya dipakai untuk mencari $r$.',
      visual: sing({ rot: true, tan: true, pts: 2 }),
      board: { title: 'Kesimpulan', pins: N4, list: 'LZ', upTo: 1, from: 0 },
    },
    // ---- 6 · Uji kelima pilihan ----
    open6(1, 'Kita cek pilihan (1) dulu. Salin titiknya ke papan.'),
    check6(
      1,
      'Titik $(3,1)$: $AT^2=1+16=17$, bukan $5$. Titik ini tidak berada di lingkaran, (1) <b class="k-red">bukan</b>.',
    ),
    open6(2, 'Lanjut pilihan (2).'),
    check6(
      2,
      'Titik $(1,-5)$: $AT^2=1+4=5=r^2$, berada di lingkaran dan sama dengan $T_2$ di catatan. (2) <b class="k-gold">benar</b>.',
    ),
    open6(3, 'Pilihan (3).'),
    check6(3, 'Titik $(-1,5)$: $AT^2=9+64=73$, jauh di luar lingkaran. (3) <b class="k-red">bukan</b>.'),
    open6(4, 'Pilihan (4).'),
    check6(
      4,
      'Titik $(3,-1)$: $AT^2=1+4=5$, sama dengan $T_1$, yaitu titik $B$. (4) <b class="k-gold">benar</b>.',
    ),
    open6(5, 'Terakhir, pilihan (5).'),
    check6(5, 'Titik $(-3,-1)$: $AT^2=25+4=29$, tidak berada di lingkaran. (5) <b class="k-red">bukan</b>.'),
    // ---- 7 · Catatan lengkap ----
    {
      ch: 7,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 8 · Cocokkan pilihan ----
    {
      ch: 8,
      cap: 'Cocokkan dengan pilihan: titik singgungnya $(3,-1)$ dan $(1,-5)$. Pilih kesimpulannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: N4, list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 's6',
        q: 'Titik singgung yang benar adalah…',
        col: true,
        win: '$(3,-1)$ dan $(1,-5)$.',
        opts: [
          {
            tex: '(3,-1)\\ \\text{saja}',
            hint: 'Selalu ada dua garis singgung dengan arah yang sama: $(1,-5)$ juga.',
          },
          { tex: '(3,1)\\ \\text{dan}\\ (1,-5)', hint: '$(3,1)$: $AT^2=17$, tidak berada di lingkaran.' },
          { tex: '(3,-1)\\ \\text{dan}\\ (1,-5)', ok: true },
          {
            tex: '(-1,5)\\ \\text{dan}\\ (-3,-1)',
            hint: 'Keduanya tidak berada di lingkaran ($73$ dan $29$, bukan $5$).',
          },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">(3, −1) · (1, −5)</span><span>Jari-jari yang sejajar $f$ menembus lingkaran di $(3,-1)$ dan $(1,-5)$; di dua titik itulah garis singgung tegak lurus $f$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
    },
  ],
  cards: [
    {
      label: '1',
      statement: '$(3,1)$',
      ok: false,
      formula: 'AT^2=17\\ne5',
      why: 'Tidak berada di lingkaran.',
    },
    {
      label: '2',
      statement: '$(1,-5)$',
      ok: true,
      formula: 'AT^2=5,\\ \\vec{AT}=-(1,2)',
      why: 'Titik singgung bawah.',
    },
    {
      label: '3',
      statement: '$(-1,5)$',
      ok: false,
      formula: 'AT^2=73\\ne5',
      why: 'Tidak berada di lingkaran.',
    },
    {
      label: '4',
      statement: '$(3,-1)$',
      ok: true,
      formula: 'AT^2=5,\\ \\vec{AT}=(1,2)',
      why: 'Titik $B$ pada gambar.',
    },
    {
      label: '5',
      statement: '$(-3,-1)$',
      ok: false,
      formula: 'AT^2=29\\ne5',
      why: 'Tidak berada di lingkaran.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 16: Titik Singgung Tegak Lurus Garis f',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Lingkaran',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Data dari gambar',
        lists: ['LG', 'LC'],
        why: 'Gradien dan jari-jari dibaca dengan menghitung kotak: geser dan naik.',
      },
      {
        title: 'Sifat garis singgung',
        lists: ['LS'],
        why: 'Garis singgung selalu tegak lurus jari-jari. Bila garis singgungnya tegak lurus $f$, jari-jarinya sejajar $f$.',
      },
      {
        title: 'Titik singgung',
        lists: ['LT1', 'LT2'],
        sketch: 'sing16',
        why: 'Dari pusat bergerak searah $f$ sejauh jari-jari, ke dua arah. Garis singgungnya: $x+2y-1=0$ di $(3,-1)$ dan $x+2y+9=0$ di $(1,-5)$.',
      },
      {
        title: 'Cara alternatif (opsional)',
        lists: ['LX', 'LY', 'LV', 'LW', 'LZ'],
        why: 'Bila $B$ tidak searah $f$, $B$ hanya memberi $r$. Gradien jari-jari $\\frac pq$, $k=\\sqrt{q^2+p^2}$, lalu $T=\\left(x_A\\pm r\\frac qk,\\ y_A\\pm r\\frac pk\\right)$.',
      },
      { title: 'Uji kelima pilihan', lists: ['LO1', 'LO2', 'LO3', 'LO4', 'LO5'] },
    ],
    answer: 'Jawaban: <b>$(3,-1)$</b> dan <b>$(1,-5)$</b>.',
  },
  done: {
    seal: '(3, −1) · (1, −5)',
    message:
      'Jari-jari yang sejajar $f$ menembus lingkaran di $(3,-1)$ dan $(1,-5)$; di dua titik itulah garis singgung tegak lurus $f$.',
  },
  key: {
    answer: '(3,-1), (1,-5)',
    cardOk: [false, true, false, true, false],
    goldRows: ['t3', 't4', 'v3', 'w3', 'o2', 'o4', 's6', 'r1', 'r2', 'r3'],
  },
  authorNotes: [
    'Revisi pemilik v1.17 (23 Okt 2026): ditulis ulang dengan gaya mengajar Pak Penta, modul visual baru sing16 (menggantikan tan16).',
    'Gradien f dan jari-jari dibaca dengan hitung kotak (geser 1, naik 2), diturunkan dari C, D, A, B dokumen; pengamatan "AB sejajar f" ditambahkan sebagai Tahukah kalian.',
    'Titik singgung dicari dengan bergerak dari A searah f sejauh r (vektor (1, 2) panjangnya √5 = r), dokumen langkah 3.1.',
    'Langkah Hati-hati "jangan mencari perpotongan f dengan lingkaran" dan jarak 9/√5 ≈ 4,02 dari Kesalahan umum dokumen; "dua titik, bukan satu" juga dari Kesalahan umum.',
    'Gradien garis singgung −1/2 dari Catatan lengkap dokumen (garis singgung x + 2y − 1 = 0 dan x + 2y + 9 = 0).',
    'Revisi pemilik v1.18: T₁ dan T₂ dicari dengan memperbesar pusat lalu berjalan 1 ke kanan, 2 ke atas dan kebalikannya 1 ke kiri, 2 ke bawah (pemilik menulis "1 ke bawah dan 2 ke kiri"; yang sesuai dengan T₂ = (1, −5) adalah 1 ke kiri, 2 ke bawah).',
    'Bagian 5 "Cara alternatif" opsional (Ya/Tidak) dari rumus yang diberikan pemilik: T = (x_A ± r·q/k, y_A ± r·p/k) dengan m = p/q dan k = √(q² + p²); angka dari dokumen (A, r, m_f).',
  ],
};

export default q16;
