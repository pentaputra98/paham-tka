/**
 * SOAL 12 — Panjang Vektor 3D (panjang vektor; pilihan tunggal). Kunci: B (m = −4 atau m = 3).
 * Sumber: docs/pembahasan25.md "SOAL 12", docs/soal25.md no. 12 (opsi E diganti "−4 atau 4", catatan dokumen).
 * Alur (v1.44, dicatat di dokumen):
 *  - pahami: AB = (2m, m + 3, m), panjangnya 9; ditanya m;
 *  - panjang vektor = diagonal ruang balok, √(x² + y² + z²) = 9, jadi jumlah kuadrat komponen harus 81;
 *  - jalur cepat dari pilihan: nilai m di pilihan (−4, −3, 3, 4) disubstitusi ke vektornya, lalu jumlah kuadrat
 *    dibandingkan dengan 81 → hanya −4 dan 3 → B;
 *  - bagian opsional "Cara esai": 6m² + 6m + 9 = 81 → m² + m − 12 = 0 → (m + 4)(m − 3) = 0.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Visual } from '../../engine/types';
import type { Vec12State } from '../../visuals/vec12';
import { getSoal } from '../index';

const vec = (state: Vec12State): Visual => ({ kind: 'svg', scene: 'vec12', state });
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
/** pilihan (docs/soal25.md no. 12; opsi E sesuai catatan dokumen) */
const OPT = ['−4 atau −3', '−4 atau 3', '−3 atau 4', '3 atau 4', '−4 atau 4'];
const PIN = ['pV', 'p81'];

/** uji satu nilai m: komponen, jumlah kuadrat, dibandingkan dengan 81 */
const test = (id: string, m: string, xyz: string, sum: string, val: string, ok: boolean, i: number): Row => ({
  id,
  toks: [
    T(`${id}a`, `m=${m}`, 'blue', `@v-m${i}`),
    O(`${id}b`, '\\to'),
    T(`${id}c`, sum),
    O(`${id}d`, '='),
    T(`${id}e`, val, ok ? 'gold' : 'red', 'P813'),
    ...(ok ? [T(`${id}g`, '\\;\\checkmark', 'gold')] : [O(`${id}f`, '\\ne'), T(`${id}g`, '81', '', 'P813')]),
  ],
  note: ok
    ? `$\\vec{AB}=${xyz}$, tepat $81$ → <b class="k-gold">memenuhi</b>`
    : `$\\vec{AB}=${xyz}$, bukan $81$ → <b class="k-red">tidak memenuhi</b>`,
  ...(ok ? { box: 'gold' as const } : {}),
});

const q12: SoalContent = {
  meta: getSoal(12)!,
  sourceRef: 'docs/pembahasan25.md#soal-12',
  layout: 'full',
  paper: {
    html: `<p>Diketahui vektor</p>
<p>$\\htmlClass{hl hl-red}{\\htmlData{src=s-v, hl=1}{\\vec{AB}=\\begin{pmatrix}2m\\\\m+3\\\\m\\end{pmatrix}}}$</p>
<p>Jika <span class="hl hl-red" data-hl="2"><span data-src="s-9">panjang vektor $\\vec{AB}=9$ satuan panjang</span></span>, maka <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">nilai $m$</span></span> yang memenuhi vektor $\\vec{AB}$ adalah ....</p>
<ol class="abc">
${LETTERS.map((o, i) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">${OPT[i]}</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-v', 's-9', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['v-m0', 'v-m1', 'v-m2', 'v-m3'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Vektor',
    titleLines: ['Pembahasan Soal', 'Panjang <span class="accent">Vektor</span>', 'Ruang 3D'],
    lede: 'Vektor $\\vec{AB}$ punya tiga komponen yang bergantung pada $m$, dan panjangnya 9. Berapa nilai $m$?',
    facts: [
      { dt: 'Panjang', dd: '9 satuan' },
      { dt: 'Komponen', dd: '2m, m+3, m' },
      { dt: 'Dicari', dd: 'm' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Komponen dan panjang' },
    { t: 'Panjang vektor', d: 'Jumlah kuadrat = 81' },
    { t: 'Uji nilai dari pilihan', d: 'm = −4, −3, 3, 4' },
    { t: 'Jawaban', d: 'Pilihan B' },
    { t: 'Cara esai', d: 'Opsional: persamaan kuadrat', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban B' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pV: { id: 'pV', toks: [T('PV1', '\\vec{AB}=(2m,\\ m+3,\\ m)', '', 'k1a')] },
    p81: {
      id: 'p81',
      toks: [T('P811', 'x^2+y^2+z^2', '', 'l2a'), O('P812', '='), T('P813', '81', '', 'l2c')],
    },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [T('k1a', '\\vec{AB}=(2m,\\ m+3,\\ m)', 'red', '@s-v')],
        note: 'tiga komponen, semuanya memuat $m$; simpan ke catatan',
      },
      {
        id: 'k2',
        toks: [
          T('k2a', '|\\vec{AB}|=9', 'red', '@s-9'),
          O('k2b', ','),
          H('k2c', 'Ditanya', 'lbl'),
          T('k2d', 'm', 'gold', '@s-tanya'),
        ],
      },
    ],
    LL: [
      {
        id: 'l1',
        toks: [T('l1a', '|\\vec{AB}|=\\sqrt{x^2+y^2+z^2}')],
        note: 'diagonal ruang balok, Pythagoras dua kali',
      },
      {
        id: 'l2',
        toks: [T('l2a', 'x^2+y^2+z^2', '', 'l1a'), O('l2b', '='), T('l2c', '9^2=81', 'blue', '@s-9')],
        note: 'kedua ruas dikuadratkan; simpan ke catatan',
        box: 'navy',
      },
    ],
    LU: [
      {
        id: 'u0',
        toks: [H('u0a', 'nilai m di pilihan', 'tx'), T('u0b', '-4,\\ -3,\\ 3,\\ 4', 'blue', '@s-oA')],
        note: 'cukup empat nilai ini yang diuji',
      },
      test('u1', '-4', '(-8,\\ -1,\\ -4)', '64+1+16', '81', true, 0),
      test('u2', '-3', '(-6,\\ 0,\\ -3)', '36+0+9', '45', false, 1),
      test('u3', '3', '(6,\\ 6,\\ 3)', '36+36+9', '81', true, 2),
      test('u4', '4', '(8,\\ 7,\\ 4)', '64+49+16', '129', false, 3),
    ],
    LJ: [
      {
        id: 'j1',
        toks: [H('j1a', 'memenuhi', 'tx'), T('j1b', 'm=-4'), H('j1c', 'dan', 'tx'), T('j1d', 'm=3')],
        note: '$-3$ dan $4$ tidak memenuhi',
      },
      {
        id: 'j2',
        toks: [
          H('j2a', 'Jawaban', 'lbl'),
          T('j2b', '\\textbf{B}', '', '@s-oB'),
          T('j2c', '-4\\ \\text{atau}\\ 3', 'gold'),
        ],
        note: 'A dan C memuat $-3$, D dan E memuat $4$',
        box: 'gold',
      },
      {
        id: 'j3',
        toks: [H('j3a', 'Hati-hati', 'lbl'), H('j3b', 'kedua nilai harus memenuhi', 'tx')],
        note: 'pilihan E benar untuk $-4$, tetapi $4$ memberi $129$',
      },
    ],
    // cara esai (opsional)
    LE: [
      {
        id: 'e1',
        toks: [T('e1a', '(2m)^2+(m+3)^2+m^2', '', 'P811'), O('e1b', '='), T('e1c', '81', '', 'P813')],
        note: 'komponen dimasukkan ke jumlah kuadrat',
      },
      {
        id: 'e2',
        toks: [T('e2a', '4m^2+(m^2+6m+9)+m^2'), O('e2b', '='), T('e2c', '81')],
        note: '$(m+3)^2=m^2+6m+9$',
      },
      {
        id: 'e3',
        toks: [T('e3a', '6m^2+6m+9'), O('e3b', '='), T('e3c', '81')],
        note: '$4m^2+m^2+m^2=6m^2$',
      },
      {
        id: 'e4',
        toks: [T('e4c', 'm^2+m-12=0', 'blue')],
        note: '$81$ pindah ruas jadi $6m^2+6m-72=0$, lalu dibagi $6$',
        box: 'navy',
      },
      {
        id: 'e5',
        toks: [T('e5a', '(m+4)(m-3)=0')],
        note: '$4\\cdot(-3)=-12$ dan $4+(-3)=1$',
      },
      {
        id: 'e6',
        toks: [T('e6a', 'm=-4'), H('e6b', 'atau', 'tx'), T('e6c', 'm=3', 'blue')],
        note: 'tiap faktor sama dengan nol',
      },
    ],
    L7: [{ id: 'v1', toks: [H('v1a', 'Jawaban', 'lbl'), T('v1b', '\\textbf{B}')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', 'm=-4\\ \\text{atau}\\ m=3')],
        note: 'jumlah kuadrat komponennya $81$',
        box: 'gold',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), T('r2b', '\\textbf{B}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Vektor $\\vec{AB}$ punya tiga komponen, $2m$, $m+3$, dan $m$, yang semuanya memuat $m$.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0, save: ['pV'] },
    },
    {
      ch: 1,
      cap: 'Diketahui panjang vektornya $9$ satuan. Yang ditanya nilai $m$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Panjang vektor ----
    {
      ch: 2,
      cap: 'Tahukah kalian? Panjang vektor tiga dimensi adalah diagonal ruang balok dengan rusuk $x$, $y$, $z$, yaitu $\\sqrt{x^2+y^2+z^2}$.',
      visual: vec({}),
      board: { title: 'Panjang vektor', pins: ['pV'], list: 'LL', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Panjangnya $9$, jadi setelah dikuadratkan, jumlah kuadrat ketiga komponen harus $81$.',
      visual: vec({}),
      board: { title: 'Panjang vektor', pins: ['pV'], list: 'LL', upTo: 2, from: 1, save: ['p81'] },
      ask: {
        before: 'l2',
        q: 'Jika $\\sqrt{x^2+y^2+z^2}=9$, maka $x^2+y^2+z^2=$…',
        opts: [
          { tex: '81', ok: true },
          { tex: '9', hint: 'Akar dihilangkan dengan mengkuadratkan kedua ruas, jadi $9^2=81$.' },
          { tex: '3', hint: '$3$ adalah akar dari $9$. Yang dicari $9^2$.' },
        ],
      },
    },
    // ---- 3 · Uji nilai dari pilihan ----
    {
      ch: 3,
      cap: 'Nilai $m$ di pilihan hanya $-4$, $-3$, $3$, dan $4$. Kita uji satu per satu, mulai dari $m=-4$, vektornya $(-8,-1,-4)$.',
      visual: vec({ view: 'tab', n: 1, cur: 0 }),
      board: { title: 'Uji nilai dari pilihan', pins: PIN, list: 'LU', upTo: 2, from: 0 },
    },
    {
      ch: 3,
      cap: 'Untuk $m=-3$, vektornya $(-6,0,-3)$. Jumlah kuadratnya $36+0+9=45$, bukan $81$.',
      visual: vec({ view: 'tab', n: 2, cur: 1 }),
      board: { title: 'Uji nilai dari pilihan', pins: PIN, list: 'LU', upTo: 3, from: 2 },
    },
    {
      ch: 3,
      cap: 'Untuk $m=3$, vektornya $(6,6,3)$. Jumlah kuadratnya $36+36+9=81$, memenuhi.',
      visual: vec({ view: 'tab', n: 3, cur: 2 }),
      board: { title: 'Uji nilai dari pilihan', pins: PIN, list: 'LU', upTo: 4, from: 3 },
    },
    {
      ch: 3,
      cap: 'Untuk $m=4$, vektornya $(8,7,4)$. Jumlah kuadratnya $64+49+16=129$, bukan $81$.',
      visual: vec({ view: 'tab', n: 4, cur: 3 }),
      board: { title: 'Uji nilai dari pilihan', pins: PIN, list: 'LU', upTo: 5, from: 4 },
      ask: {
        before: 'u4',
        q: 'Untuk $m=4$, jumlah kuadrat $8^2+7^2+4^2$ adalah…',
        opts: [
          { tex: '129', ok: true },
          { tex: '81', hint: '$64+49+16=129$, lebih dari $81$.' },
          { tex: '19', hint: 'Itu $8+7+4$. Setiap komponen dikuadratkan dulu.' },
        ],
      },
    },
    // ---- 4 · Jawaban ----
    {
      ch: 4,
      cap: 'Yang memenuhi hanya $m=-4$ dan $m=3$, jadi jawabannya B. Pilihan A dan C memuat $-3$, sedangkan D dan E memuat $4$.',
      visual: { kind: 'soal', hl: 0, focus: 's-oB' },
      board: { title: 'Jawaban', pins: PIN, list: 'LJ', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Hati-hati, kedua nilai di pilihan harus memenuhi. Pilihan E benar untuk $-4$, tetapi $4$ memberi $129$.',
      visual: { kind: 'soal', hl: 0, focus: 's-oE' },
      board: { title: 'Jawaban', pins: PIN, list: 'LJ', upTo: 3, from: 2 },
    },
    // tawaran cara esai (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Bagaimana kalau soalnya esai tanpa pilihan? Mau lihat cara menyusun persamaan kuadratnya?',
      visual: vec({ m: 3 }),
      board: { title: 'Jawaban', pins: PIN, list: 'LJ', upTo: 3, from: 3 },
      branch: { yes: 'Ya, lihat cara esai' },
    },
    // ---- 5 · Cara esai (opsional) ----
    {
      ch: 5,
      cap: 'Masukkan komponennya ke jumlah kuadrat. Hati-hati, $(m+3)^2=m^2+6m+9$, jadi jumlahnya $6m^2+6m+9=81$.',
      visual: vec({}),
      board: { title: 'Cara esai', pins: PIN, list: 'LE', upTo: 3, from: 0 },
      ask: {
        before: 'e2',
        q: 'Hasil $(m+3)^2$ adalah…',
        opts: [
          { tex: 'm^2+6m+9', ok: true },
          { tex: 'm^2+9', hint: 'Suku tengah terlewat, $2\\cdot m\\cdot3=6m$.' },
          { tex: 'm^2+3', hint: 'Angka $3$ juga dikuadratkan, $3^2=9$.' },
        ],
      },
    },
    {
      ch: 5,
      cap: 'Pindahkan $81$, lalu bagi $6$, jadi $m^2+m-12=0$. Difaktorkan $(m+4)(m-3)=0$, sehingga $m=-4$ atau $m=3$.',
      visual: vec({ m: -4 }),
      board: { title: 'Cara esai', pins: PIN, list: 'LE', upTo: 6, from: 3 },
    },
    // ---- 6 · Catatan lengkap ----
    {
      ch: 6,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 7 · Cocokkan pilihan ----
    {
      ch: 7,
      cap: 'Cocokkan dengan pilihan. Hanya B yang kedua nilainya memenuhi; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: PIN, list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'v1',
        q: 'Nilai $m$ yang memenuhi adalah…',
        letters: true,
        win: 'Jawabannya <b>B</b>.',
        opts: [
          { txt: OPT[0]!, hint: '$m=-3$ memberi $45$, bukan $81$.' },
          { txt: OPT[1]!, ok: true },
          { txt: OPT[2]!, hint: 'Tandanya terbalik, $m=-3$ dan $m=4$ tidak memenuhi.' },
          { txt: OPT[3]!, hint: '$m=4$ memberi $129$.' },
          { txt: OPT[4]!, hint: '$-4$ memenuhi, tetapi $4$ memberi $129$.' },
        ],
      },
    },
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">B</span><span>Vektornya $(-8,-1,-4)$ untuk $m=-4$ atau $(6,6,3)$ untuk $m=3$; keduanya berpanjang $9$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    { label: 'A', statement: OPT[0]!, ok: false, formula: 'm=-3\\to45\\ne81', why: '$m=-3$ bukan akar.' },
    { label: 'B', statement: OPT[1]!, ok: true, formula: '64+1+16=36+36+9=81', why: 'Kedua nilai memenuhi.' },
    {
      label: 'C',
      statement: OPT[2]!,
      ok: false,
      formula: 'm=4\\to129\\ne81',
      why: 'Tanda kedua akar terbalik.',
    },
    { label: 'D', statement: OPT[3]!, ok: false, formula: 'm=4\\to129\\ne81', why: '$4$ bukan akar.' },
    { label: 'E', statement: OPT[4]!, ok: false, formula: 'm=4\\to129\\ne81', why: 'Hanya $-4$ yang akar.' },
  ],
  notes: {
    title: 'Pembahasan Soal 12: Panjang Vektor 3D',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Vektor',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Panjang vektor',
        lists: ['LL'],
        why: 'Untuk $\\vec v=(x,y,z)$, $|\\vec v|=\\sqrt{x^2+y^2+z^2}$, yaitu diagonal ruang balok.',
      },
      { title: 'Uji nilai dari pilihan', lists: ['LU', 'LJ'] },
      { title: 'Cara esai (opsional)', lists: ['LE'] },
    ],
    answer: 'Jawaban: <b>B</b>, $m=-4$ atau $m=3$.',
  },
  done: {
    seal: 'B',
    message: 'Vektornya $(-8,-1,-4)$ untuk $m=-4$ atau $(6,6,3)$ untuk $m=3$; keduanya berpanjang $9$.',
  },
  key: {
    answer: 'B',
    cardOk: [false, true, false, false, false],
    goldRows: ['u1', 'u3', 'j2', 'v1', 'r1', 'r2'],
  },
  authorNotes: [
    'Modul baru (v1.44). Jalur cepat pilihan ganda: nilai m di pilihan (−4, −3, 3, 4) disubstitusi ke vektornya, lalu jumlah kuadrat dibandingkan dengan 81; angka dari kartu A–E dan Pemeriksaan hasil dokumen.',
    'Persamaan kuadrat 6m² + 6m + 9 = 81 → (m + 4)(m − 3) = 0 (dokumen a1–b5) menjadi bagian opsional "Cara esai", dengan pertanyaan cepat (m + 3)² dari dokumen.',
    'Pertanyaan cepat baru: 9² = 81 (pengecoh 9, 3) dan 8² + 7² + 4² = 129 (pengecoh 81, 19). Balok kerangka sebagai gambar panjang vektor (Visual Langkah 2.1 dokumen), tanpa penggeser m.',
    'Opsi E memakai "−4 atau 4" sesuai catatan dokumen (naskah asli sama dengan D). Tanpa simbol ":" di baris papan.',
  ],
};

export default q12;
