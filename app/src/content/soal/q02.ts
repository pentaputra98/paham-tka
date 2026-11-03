/**
 * SOAL 2 — Pakan Sapi dan Kambing (SPL dua variabel dan matriks; pilihan tunggal). Kunci: E.
 * Sumber: docs/pembahasan25.md "SOAL 2", docs/soal25.md no. 2, docs/sapi_dan_kambing.png.
 * Alur guru (revisi pemilik v1.32, dicatat di dokumen):
 *  - pahami: yang ditanya (x, y) = (sapi, kambing); pilihan berbentuk matriks × vektor;
 *  - data dari gambar, lalu bentuk matriks dari tabel: baris = hewan, kolom = rumput, dikali (x, y) = (38, 34);
 *    baris sapi dan baris kambing dibaca artinya;
 *  - samakan konteks: kolom (rumput) harus sama dengan konteks variabel (hewan) → matriks ditranspos; kini baris
 *    (rumput) juga sama dengan konteks hasil di ruas kanan;
 *  - bentuk SPLDV (baris × kolom), lalu disederhanakan: 10x + 2y = 38 dibagi 2 menjadi 5x + y = 19;
 *  - bagian opsional "Cari x dan y": eliminasi y (pilihan ganda hanya meminta bentuk inversnya);
 *  - kembali ke bentuk matriks paling sederhana AX = B → X = A⁻¹B; invers A tepat pilihan E;
 *    pilihan C (invers sebelum disederhanakan, vektor terbalik), A dan D (5 dan 10 kali invers).
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Pakan2State } from '../../visuals/pakan2';
import type { Trans2State } from '../../visuals/trans2';
import { getSoal } from '../index';

/** Gambar asli soal (docs/sapi_dan_kambing.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/sapi_dan_kambing.png', import.meta.url).href;
const pakan = (state: Pakan2State): Visual => ({ kind: 'svg', scene: 'pakan2', state });
const tr = (state: Trans2State): Visual => ({ kind: 'svg', scene: 'trans2', state });
const v = (a: string, b: string): string => `\\begin{pmatrix}${a}\\\\${b}\\end{pmatrix}`;
const m = (a: string, b: string, c: string, d: string): string =>
  `\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}`;
/** matriks koefisien sebelum disederhanakan (sesudah ditranspos) dan inversnya A⁻¹ (matriks pilihan E) */
const M0 = m('10', '2', '10', '1');
const AINV = m('-\\frac15', '\\frac15', '2', '-1');
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
type L = (typeof LETTERS)[number];
/** Kelima pilihan (docs/soal25.md no. 2): kertas soal dan kartu memakai teks yang sama. */
const OPT: Record<L, string> = {
  A: `${m('-1', '1', '10', '-5')}${v('19', '34')}=${v('15', '20')}`,
  B: `${m('10', '-10', '-1', '2')}${v('38', '34')}=${v('4', '3')}`,
  C: `${m('-\\frac{1}{10}', '\\frac{2}{10}', '1', '-1')}${v('34', '38')}=${v('4', '3')}`,
  D: `${m('-1', '2', '10', '-10')}${v('38', '34')}=${v('3', '4')}`,
  E: `${m('-\\frac{1}{5}', '\\frac{1}{5}', '2', '-1')}${v('19', '34')}=${v('3', '4')}`,
};
/** keadaan adegan matriks sesudah ditranspos dan disederhanakan */
const AX: Trans2State = { t: true, simp: true, lab: false, ax: true };

/** pernyataan kartu dua baris: perkalian, lalu "= hasil" (muat di kartu sempit) */
const card = (k: L): string => {
  const [lhs, rhs] = OPT[k].split('=');
  return `$${lhs}$ $=${rhs}$`;
};

const q02: SoalContent = {
  meta: getSoal(2)!,
  sourceRef: 'docs/pembahasan25.md#soal-2',
  layout: 'full',
  paper: {
    html: `<div class="soal-split"><div>
<p>Pak Andi memiliki beberapa sapi dan kambing. Semua hewan ternaknya selalu diberikan pakan berupa campuran rumput gajah dan rumput gamal. Setiap hari, ia selalu menyediakan <span class="hl hl-red" data-hl="1"><span data-src="s-gajah">38 kg rumput gajah</span></span> dan <span class="hl hl-red" data-hl="1"><span data-src="s-gamal">34 kg rumput gamal</span></span> untuk seluruh kambing dan sapi miliknya <span class="hl hl-blue" data-hl="1"><span data-src="s-tanpa">tanpa sisa</span></span>.</p>
<table class="soal-table"><thead><tr><th scope="col">Sapi</th><th scope="col">Kambing</th></tr></thead>
<tbody><tr><td>Rumput Gajah 10 kg</td><td>Rumput Gajah 2 kg</td></tr>
<tr><td>Rumput Gamal 10 kg</td><td>Rumput Gamal 1 kg</td></tr></tbody></table>
</div><figure class="soal-fig"><img src="${fig}" width="918" height="571" alt="Sapi: rumput gajah 10 kg, rumput gamal 10 kg. Kambing: rumput gajah 2 kg, rumput gamal 1 kg." /></figure></div>
<p>Jika banyaknya sapi dan kambing yang dipelihara oleh Pak Andi berturut-turut adalah <span class="hl hl-blue" data-hl="2"><span data-src="s-xy">$x$ dan $y$</span></span>, maka $\\htmlClass{hl hl-gold}{\\htmlData{src=s-tanya, hl=2}{${v('x', 'y')}}}=....$</p>
<ol class="abc abc-2">
${LETTERS.map((o) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">$${OPT[o]}$</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-gajah', 's-gamal', 's-tanpa', 's-xy', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['f-sg', 'f-sm', 'f-kg', 'f-km', 't-11', 't-12', 't-21', 't-22', 't-x', 't-y', 't-r1', 't-r2'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Matriks dan SPL',
    titleLines: ['Pembahasan Soal', 'Sistem <span class="accent">Persamaan</span>', 'Pakan Ternak'],
    lede: 'Pak Andi menyediakan 38 kg rumput gajah dan 34 kg rumput gamal untuk sapi dan kambingnya, tanpa sisa. Bentuk matriks mana yang tepat untuk banyak sapi dan kambingnya?',
    facts: [
      { dt: 'Rumput gajah', dd: '38 kg' },
      { dt: 'Rumput gamal', dd: '34 kg' },
      { dt: 'Dicari', dd: '(x, y)' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Yang ditanya dan bentuk pilihan' },
    { t: 'Data dari gambar', d: 'Pakan per ekor dan yang tersedia' },
    { t: 'Bentuk matriks', d: 'Baris hewan, kolom rumput' },
    { t: 'Samakan konteks', d: 'Matriks ditranspos' },
    { t: 'Bentuk SPLDV', d: 'Lalu disederhanakan' },
    { t: 'Cari x dan y', d: 'Opsional: eliminasi', opt: true },
    { t: 'Kembali ke matriks', d: 'AX = B' },
    { t: 'Invers matriks', d: 'X = A⁻¹B, pilihan E' },
    { t: 'Pilihan lain', d: 'Matriks C, A, dan D' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Jawaban E' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pM: {
      id: 'pM',
      toks: [
        T('PM1', M0, '', 'c2a'),
        T('PM2', v('x', 'y'), '', 'c2b'),
        O('PM3', '='),
        T('PM4', v('38', '34'), '', 'c2d'),
      ],
    },
    pE: { id: 'pE', toks: [T('PE1', '5x+y', '', 's3a'), O('PE2', '='), T('PE3', '19', '', 's3e')] },
    pL: { id: 'pL', toks: [T('PL1', '10x+y', '', 's4a'), O('PL2', '='), T('PL3', '34', '', 's4c')] },
    pX: { id: 'pX', toks: [T('PX1', 'x', '', 'o3a'), O('PX2', '='), T('PX3', '3', '', 'o3e')] },
    pA: { id: 'pA', toks: [T('PA1', 'A'), O('PA2', '='), T('PA3', m('5', '1', '10', '1'), '', 'a1a')] },
    pF: { id: 'pF', toks: [T('PF1', 'X'), O('PF2', '='), T('PF3', 'A^{-1}B', '', 'a3c')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [H('k1a', 'Ditanya', 'lbl'), T('k1b', v('x', 'y'), 'gold', '@s-tanya')],
        note: '$x$ = banyak sapi, $y$ = banyak kambing',
      },
      {
        id: 'k2',
        toks: [H('k2a', 'Pilihan', 'lbl'), H('k2b', 'matriks × vektor', 'tx')],
        note: 'susun dulu persamaan matriksnya, lalu cari bentuk inversnya',
      },
    ],
    LD: [
      {
        id: 'd1',
        toks: [
          H('d1a', '1 sapi', 'tx'),
          O('d1b', '\\to'),
          H('d1c', 'gajah', 'tx'),
          T('d1d', '10', 'blue', '@f-sg'),
          H('d1e', 'gamal', 'tx'),
          T('d1f', '10', 'blue', '@f-sm'),
        ],
        note: 'kg per ekor setiap hari',
      },
      {
        id: 'd2',
        toks: [
          H('d2a', '1 kambing', 'tx'),
          O('d2b', '\\to'),
          H('d2c', 'gajah', 'tx'),
          T('d2d', '2', 'blue', '@f-kg'),
          H('d2e', 'gamal', 'tx'),
          T('d2f', '1', 'blue', '@f-km'),
        ],
        note: 'kg per ekor setiap hari',
      },
      {
        id: 'd3',
        toks: [
          H('d3a', 'tersedia', 'tx'),
          O('d3b', '\\to'),
          H('d3c', 'gajah', 'tx'),
          T('d3d', '38', 'red', '@s-gajah'),
          H('d3e', 'gamal', 'tx'),
          T('d3f', '34', 'red', '@s-gamal'),
        ],
        note: 'kg setiap hari, habis tanpa sisa',
      },
    ],
    // bentuk matriks dari tabel: baris hewan, kolom rumput
    LM: [
      {
        id: 'm1',
        toks: [
          T('m1a', m('10', '10', '2', '1'), '', '@t-11'),
          T('m1b', v('x', 'y'), 'blue', '@t-x'),
          O('m1c', '='),
          T('m1d', v('38', '34'), 'red', '@t-r1'),
        ],
        note: 'baris sapi dan kambing, kolom rumput gajah dan rumput gamal',
        box: 'navy',
      },
      {
        id: 'm2',
        toks: [
          H('m2a', 'baris sapi', 'tx'),
          O('m2b', '\\to'),
          H('m2c', 'gajah', 'tx'),
          T('m2d', '10', 'blue', '@t-11'),
          H('m2e', 'gamal', 'tx'),
          T('m2f', '10', 'blue', '@t-12'),
        ],
        note: 'satu sapi makan $10$ kg rumput gajah dan $10$ kg rumput gamal',
      },
      {
        id: 'm3',
        toks: [
          H('m3a', 'baris kambing', 'tx'),
          O('m3b', '\\to'),
          H('m3c', 'gajah', 'tx'),
          T('m3d', '2', 'blue', '@t-21'),
          H('m3e', 'gamal', 'tx'),
          T('m3f', '1', 'blue', '@t-22'),
        ],
        note: 'satu kambing makan $2$ kg rumput gajah dan $1$ kg rumput gamal',
      },
      {
        id: 'm4',
        toks: [
          H('m4a', 'variabel', 'lbl'),
          T('m4b', 'x', 'blue', '@t-x'),
          H('m4c', 'sapi', 'tx'),
          T('m4d', 'y', 'blue', '@t-y'),
          H('m4e', 'kambing', 'tx'),
        ],
        note: 'konteks $x$ dan $y$ adalah hewan',
      },
    ],
    // samakan konteks: kolom = variabel, baris = hasil
    LC: [
      {
        id: 'c1',
        toks: [
          H('c1a', 'kolom', 'lbl'),
          H('c1b', 'rumput', 'tx'),
          O('c1c', '\\ne'),
          H('c1d', 'variabel', 'lbl'),
          H('c1e', 'hewan', 'tx'),
        ],
        note: 'konteks kolom harus sama dengan konteks variabel',
      },
      {
        id: 'c2',
        toks: [
          T('c2a', M0, 'blue', '@t-11'),
          T('c2b', v('x', 'y'), '', '@t-x'),
          O('c2c', '='),
          T('c2d', v('38', '34'), 'red', '@t-r1'),
        ],
        note: 'ditranspos, baris menjadi kolom dan kolom menjadi baris',
        box: 'navy',
      },
      {
        id: 'c3',
        toks: [
          H('c3a', 'kolom', 'lbl'),
          H('c3b', 'hewan', 'tx'),
          O('c3c', '='),
          H('c3d', 'variabel', 'lbl'),
          H('c3e', 'hewan', 'tx'),
        ],
        note: 'kolom 1 sapi dan kolom 2 kambing, sama dengan $x$ dan $y$',
      },
      {
        id: 'c4',
        toks: [
          H('c4a', 'baris', 'lbl'),
          H('c4b', 'rumput', 'tx'),
          O('c4c', '='),
          H('c4d', 'hasil', 'lbl'),
          H('c4e', 'rumput', 'tx'),
        ],
        note: 'baris 1 rumput gajah $38$ kg, baris 2 rumput gamal $34$ kg; simpan ke catatan',
      },
    ],
    // bentuk SPLDV, lalu disederhanakan
    LS: [
      {
        id: 's1',
        toks: [
          T('s1a', '10', '', '@t-11'),
          T('s1b', 'x', 'blue'),
          O('s1c', '+'),
          T('s1d', '2', '', '@t-12'),
          T('s1e', 'y', 'blue'),
          O('s1f', '='),
          T('s1g', '38', 'red', '@t-r1'),
        ],
        note: 'baris 1 dikali kolom $(x,y)$, rumput gajah',
      },
      {
        id: 's2',
        toks: [
          T('s2a', '10', '', '@t-21'),
          T('s2b', 'x', 'blue'),
          O('s2c', '+'),
          T('s2d', 'y', 'blue', '@t-y'),
          O('s2e', '='),
          T('s2f', '34', 'red', '@t-r2'),
        ],
        note: 'baris 2, rumput gamal; $1y$ cukup ditulis $y$',
      },
      {
        id: 's3',
        toks: [
          T('s3a', '5x', '', 's1a'),
          O('s3b', '+'),
          T('s3c', 'y', '', 's1e'),
          O('s3d', '='),
          T('s3e', '19', 'blue', 's1g'),
        ],
        note: '$10$, $2$, dan $38$ sama-sama dibagi $2$',
        box: 'navy',
      },
      {
        id: 's4',
        toks: [T('s4a', '10x+y', '', 's2a'), O('s4b', '='), T('s4c', '34', '', 's2f')],
        note: 'tetap, karena $1$ tidak bisa dibagi $2$; simpan keduanya ke catatan',
        box: 'navy',
      },
    ],
    // cari x dan y (opsional): eliminasi y
    LO: [
      {
        id: 'o1',
        toks: [T('o1a', '(10x+y)-(5x+y)', '', 'PL1'), O('o1b', '='), T('o1c', '34-19', '', 'PL3')],
        note: '$y$ sama di kedua persamaan, jadi hilang saat dikurangkan',
      },
      {
        id: 'o2',
        toks: [T('o2a', '5x'), O('o2b', '='), T('o2c', '15', 'blue')],
        note: '$10x-5x=5x$ dan $34-19=15$',
      },
      {
        id: 'o3',
        toks: [
          T('o3a', 'x'),
          O('o3b', '='),
          T('o3c', '15\\div5', '', 'o2c'),
          O('o3d', '='),
          T('o3e', '3', 'blue'),
        ],
        note: 'kedua ruas dibagi $5$; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'o4',
        toks: [
          T('o4a', '5(3)', '', 'PX3'),
          O('o4b', '+'),
          T('o4c', 'y'),
          O('o4d', '='),
          T('o4e', '19', '', 'PE3'),
        ],
        note: '$x=3$ dimasukkan ke $5x+y=19$',
      },
      {
        id: 'o5',
        toks: [
          T('o5a', 'y'),
          O('o5b', '='),
          T('o5c', '19', '', 'o4e'),
          T('o5d', '-15', 'red', 'o4a'),
          O('o5e', '='),
          T('o5f', '4', 'blue'),
        ],
        note: '$5(3)=15$ di ruas kiri pindah ke ruas kanan menjadi $-15$',
      },
      {
        id: 'o6',
        toks: [T('o6a', v('x', 'y')), O('o6b', '='), T('o6c', v('3', '4'), 'blue')],
        note: '3 sapi dan 4 kambing',
        box: 'navy',
      },
    ],
    // kembali ke bentuk matriks paling sederhana
    LA: [
      {
        id: 'a1',
        toks: [
          T('a1a', m('5', '1', '10', '1'), '', 'PE1'),
          T('a1b', v('x', 'y'), 'blue'),
          O('a1c', '='),
          T('a1d', v('19', '34'), 'red', 'PE3'),
        ],
        note: 'baris 1 dari $5x+y=19$, baris 2 dari $10x+y=34$',
        box: 'navy',
      },
      {
        id: 'a2',
        toks: [T('a2a', 'A', '', 'a1a'), T('a2b', 'X', '', 'a1b'), O('a2c', '='), T('a2d', 'B', '', 'a1d')],
        note: '$A$ matriks koefisien, $X$ vektor $(x,y)$, $B$ ruas kanan',
      },
      {
        id: 'a3',
        toks: [T('a3a', 'X'), O('a3b', '='), T('a3c', 'A^{-1}', 'blue'), T('a3d', 'B', '', 'a2d')],
        note: 'kedua ruas dikali $A^{-1}$ dari kiri; simpan ke catatan',
        box: 'navy',
      },
    ],
    // invers A dan bentuk akhirnya
    LV: [
      {
        id: 'i1',
        toks: [
          T('i1a', '\\det A'),
          O('i1b', '='),
          T('i1c', '5\\cdot1-1\\cdot10', '', 'PA3'),
          O('i1d', '='),
          T('i1e', '-5', 'blue'),
        ],
        note: '$ad-bc$, tidak nol, jadi inversnya ada',
      },
      {
        id: 'i2',
        toks: [
          T('i2a', 'A^{-1}'),
          O('i2b', '='),
          T('i2c', '\\tfrac{1}{-5}', '', 'i1e'),
          T('i2d', m('1', '-1', '-10', '5')),
        ],
        note: 'tukar $a$ dan $d$, ubah tanda $b$ dan $c$',
      },
      {
        id: 'i3',
        toks: [T('i3a', 'A^{-1}'), O('i3b', '='), T('i3c', AINV, 'blue')],
        note: 'tiap elemen dibagi $-5$',
        box: 'navy',
      },
      {
        id: 'i4',
        toks: [
          T('i4a', v('x', 'y')),
          O('i4b', '='),
          T('i4c', AINV, '', 'i3c'),
          T('i4d', v('19', '34'), '', 'PF3'),
          O('i4e', '='),
          T('i4f', v('3', '4'), 'gold'),
        ],
        note: 'tepat sama dengan pilihan E',
        box: 'gold',
      },
    ],
    LW: [
      {
        id: 'w1',
        toks: [
          H('w1a', 'matriks pilihan C', 'tx'),
          T('w1b', m('-\\frac1{10}', '\\frac2{10}', '1', '-1')),
          O('w1c', '='),
          T('w1d', `${M0}^{-1}`),
        ],
        note: 'invers sebelum disederhanakan, tetapi vektornya terbalik $(34,38)$',
      },
      {
        id: 'w2',
        toks: [
          H('w2a', 'matriks pilihan A', 'tx'),
          O('w2x', '='),
          T('w2b', '5\\times A^{-1}', '', 'PA1'),
          O('w2c', '\\to'),
          H('w2d', 'hasil', 'tx'),
          T('w2e', v('15', '20'), 'red'),
        ],
        note: 'pembagi $5$ terlewat, hasilnya $5$ kali $(3,4)$',
      },
      {
        id: 'w3',
        toks: [
          H('w3a', 'matriks pilihan D', 'tx'),
          O('w3x', '='),
          T('w3b', `10\\times${M0}^{-1}`),
          O('w3c', '\\to'),
          H('w3d', 'hasil', 'tx'),
          T('w3e', v('30', '40'), 'red'),
        ],
        note: 'pembagi $10$ terlewat; tertulis $(3,4)$, padahal hasil kalinya $(30,40)$',
      },
    ],
    L7: [{ id: 'v6', toks: [H('v6a', 'Jawaban', 'lbl'), T('v6b', '\\textbf{E}')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', v('x', 'y')), O('r1b', '='), T('r1c', AINV), T('r1d', v('19', '34'))],
        note: 'hasilnya $(3,4)$, yaitu 3 sapi dan 4 kambing',
        box: 'gold',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), T('r2b', '\\textbf{E}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Yang ditanya $\\begin{pmatrix}x\\\\y\\end{pmatrix}$, dengan $x$ banyak sapi dan $y$ banyak kambing.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Semua pilihan berbentuk matriks dikali vektor. Jadi kita susun dulu persamaan matriksnya dari soal.',
      visual: { kind: 'soal', hl: 9 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Data dari gambar ----
    {
      ch: 2,
      cap: 'Perhatikan gambar sapi. Satu ekor sapi makan $10$ kg rumput gajah dan $10$ kg rumput gamal setiap hari.',
      visual: pakan({ pic: 'sapi' }),
      board: { title: 'Data dari gambar', list: 'LD', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Satu ekor kambing makan $2$ kg rumput gajah dan $1$ kg rumput gamal.',
      visual: pakan({ pic: 'kambing' }),
      board: { title: 'Data dari gambar', list: 'LD', upTo: 2, from: 1 },
    },
    {
      ch: 2,
      cap: 'Pak Andi menyediakan $38$ kg rumput gajah dan $34$ kg rumput gamal, dan semuanya habis tanpa sisa.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Data dari gambar', list: 'LD', upTo: 3, from: 2 },
    },
    // ---- 3 · Bentuk matriks ----
    {
      ch: 3,
      cap: 'Dari data itu kita bentuk matriksnya. Baris untuk sapi dan kambing, kolom untuk rumput gajah dan rumput gamal, dan hasilnya rumput yang tersedia.',
      visual: tr({}),
      board: { title: 'Bentuk matriks', list: 'LM', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Baris sapi berisi $10$ dan $10$. Artinya satu sapi memakan $10$ kg rumput gajah dan $10$ kg rumput gamal.',
      visual: tr({ hl: 'sapi' }),
      board: { title: 'Bentuk matriks', list: 'LM', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Begitu juga baris kambing. Satu kambing memakan $2$ kg rumput gajah dan $1$ kg rumput gamal.',
      visual: tr({ hl: 'kambing' }),
      board: { title: 'Bentuk matriks', list: 'LM', upTo: 3, from: 2 },
    },
    {
      ch: 3,
      cap: 'Sekarang perhatikan $x$ dan $y$. Konteksnya hewan, yaitu banyak sapi dan banyak kambing.',
      visual: tr({ hl: 'xy', vars: true }),
      board: { title: 'Bentuk matriks', list: 'LM', upTo: 4, from: 3 },
    },
    // ---- 4 · Samakan konteks ----
    {
      ch: 4,
      cap: 'Hati-hati, kolom matriks membicarakan rumput, sedangkan $x$ dan $y$ membicarakan hewan. Konteks kolom harus sama dengan konteks variabel.',
      visual: tr({ hl: 'mis', vars: true }),
      board: { title: 'Samakan konteks', list: 'LC', upTo: 1, from: 0 },
      ask: {
        before: 'c1',
        q: 'Agar kolom matriks membicarakan sapi dan kambing seperti $x$ dan $y$, matriksnya…',
        opts: [
          { txt: 'ditranspos', ok: true },
          {
            txt: 'diinverskan',
            hint: 'Invers dipakai nanti untuk mencari $x$ dan $y$. Sekarang kita menyamakan konteks kolom.',
          },
          {
            txt: 'barisnya ditukar',
            hint: 'Menukar baris tidak mengubah kolom. Kolomnya tetap rumput gajah dan rumput gamal.',
          },
          { txt: 'dikali 2', hint: 'Dikali $2$ hanya mengubah angkanya. Konteks kolomnya tetap rumput.' },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Matriksnya kita transpos, baris menjadi kolom. Sekarang kolom 1 sapi dan kolom 2 kambing, sama dengan konteks $x$ dan $y$.',
      visual: tr({ t: true, hl: 'col', vars: true }),
      board: { title: 'Samakan konteks', list: 'LC', upTo: 3, from: 1 },
    },
    {
      ch: 4,
      cap: 'Dengan begini konteks baris juga sama dengan hasil di ruas kanan. Baris 1 rumput gajah $38$ kg dan baris 2 rumput gamal $34$ kg.',
      visual: tr({ t: true, hl: 'row', vars: true, res: true }),
      board: { title: 'Samakan konteks', list: 'LC', upTo: 4, from: 3, save: ['pM'] },
    },
    // ---- 5 · Bentuk SPLDV ----
    {
      ch: 5,
      cap: 'Bentuk matriks yang benar bisa diubah menjadi SPLDV. Baris 1 dikali kolom memberi $10x+2y=38$.',
      visual: tr({ t: true, hl: 'r1', res: true }),
      board: { title: 'Bentuk SPLDV', pins: ['pM'], list: 'LS', upTo: 1, from: 0 },
      ask: {
        before: 's1',
        q: 'Baris 1 dikali kolom $\\begin{pmatrix}x\\\\y\\end{pmatrix}$ menghasilkan…',
        opts: [
          { tex: '10x+2y=38', ok: true },
          {
            tex: '10x+10y=38',
            hint: 'Itu baris sapi sebelum ditranspos. Baris 1 sekarang berisi $10$ dan $2$.',
          },
          { tex: '12x=38', hint: '$10x$ dan $2y$ tidak bisa dijumlahkan karena variabelnya berbeda.' },
          { tex: '10x+2y=34', hint: '$34$ adalah hasil baris 2. Baris 1 sama dengan $38$.' },
        ],
      },
    },
    {
      ch: 5,
      cap: 'Baris 2 dikali kolom memberi $10x+y=34$.',
      visual: tr({ t: true, hl: 'r2', res: true }),
      board: { title: 'Bentuk SPLDV', pins: ['pM'], list: 'LS', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: 'Sederhanakan bila bisa. Persamaan pertama dibagi $2$ menjadi $5x+y=19$, sedangkan $10x+y=34$ tidak bisa disederhanakan.',
      visual: tr({ t: true, simp: true, lab: false }),
      board: { title: 'Bentuk SPLDV', pins: ['pM'], list: 'LS', upTo: 4, from: 2, save: ['pE', 'pL'] },
      ask: {
        before: 's3',
        q: '$10x+2y=38$ disederhanakan menjadi…',
        opts: [
          { tex: '5x+y=19', ok: true },
          { tex: '5x+2y=19', hint: 'Semua suku dibagi $2$, termasuk $2y$ menjadi $y$.' },
          { tex: '5x+y=38', hint: 'Ruas kanan juga dibagi $2$, jadi $38\\div2=19$.' },
          { tex: '10x+y=19', hint: '$10x$ juga ikut dibagi $2$ menjadi $5x$.' },
        ],
      },
    },
    // tawaran cari x dan y (opsional): Ya masuk Bagian 6, Tidak/Lewati langsung ke Bagian 7
    {
      ch: 5,
      cap: 'Dari SPLDV ini $x$ dan $y$ bisa langsung dicari, tetapi pilihan ganda hanya meminta bentuk inversnya. Mau lihat cara mencari $x$ dan $y$?',
      visual: tr({ t: true, simp: true, lab: false }),
      board: { title: 'Bentuk SPLDV', pins: ['pE', 'pL'], list: 'LS', upTo: 4, from: 4 },
      branch: { yes: 'Ya, cari x dan y' },
    },
    // ---- 6 · Cari x dan y (opsional) ----
    {
      ch: 6,
      cap: 'Perhatikan $y$ di kedua persamaan sama. Jadi $10x+y=34$ dikurangi $5x+y=19$, dan $y$ hilang.',
      visual: tr({ view: 'elim', e: 1 }),
      board: { title: 'Cari x dan y', pins: ['pE', 'pL'], list: 'LO', upTo: 1, from: 0 },
    },
    {
      ch: 6,
      cap: 'Hasilnya $5x=15$. Kedua ruas dibagi $5$, jadi $x=3$.',
      visual: tr({ view: 'elim', e: 2 }),
      board: { title: 'Cari x dan y', pins: ['pE', 'pL'], list: 'LO', upTo: 3, from: 1, save: ['pX'] },
    },
    {
      ch: 6,
      cap: 'Masukkan $x=3$ ke $5x+y=19$, jadi $y=19-15=4$. Pak Andi memelihara $3$ sapi dan $4$ kambing.',
      visual: pakan({ pic: 'all', claim: [3, 4] }),
      board: { title: 'Cari x dan y', pins: ['pE', 'pX'], list: 'LO', upTo: 6, from: 3 },
    },
    // ---- 7 · Kembali ke matriks ----
    {
      ch: 7,
      cap: 'Kembali ke bentuk matriks dengan angka yang paling sederhana. Baris 1 dari $5x+y=19$ dan baris 2 dari $10x+y=34$.',
      visual: tr(AX),
      board: { title: 'Kembali ke matriks', pins: ['pE', 'pL'], list: 'LA', upTo: 1, from: 0 },
    },
    {
      ch: 7,
      cap: 'Bentuknya $AX=B$. Kedua ruas dikali $A^{-1}$ dari kiri, jadi $X=A^{-1}B$.',
      visual: tr(AX),
      board: {
        title: 'Kembali ke matriks',
        pins: ['pE', 'pL'],
        list: 'LA',
        upTo: 3,
        from: 1,
        save: ['pA', 'pF'],
      },
    },
    // ---- 8 · Invers matriks ----
    {
      ch: 8,
      cap: 'Determinan $A$ adalah $5\\cdot1-1\\cdot10=-5$, tidak nol. Jadi $A$ punya invers.',
      visual: tr(AX),
      board: { title: 'Invers matriks', pins: ['pA', 'pF'], list: 'LV', upTo: 1, from: 0 },
      ask: {
        before: 'i1',
        q: '$\\det A$ untuk $A=\\begin{pmatrix}5&1\\\\10&1\\end{pmatrix}$ adalah…',
        opts: [
          { tex: '-5', ok: true },
          { tex: '15', hint: 'Rumusnya $ad-bc$, jadi dikurangi, bukan dijumlah.' },
          { tex: '5', hint: '$5\\cdot1=5$ masih dikurangi $1\\cdot10=10$.' },
          { tex: '-10', hint: 'Kalikan kedua diagonal, $5\\cdot1=5$ dan $1\\cdot10=10$, lalu kurangkan.' },
        ],
      },
    },
    {
      ch: 8,
      cap: 'Tukar $a$ dan $d$, ubah tanda $b$ dan $c$, lalu bagi dengan $-5$. Itulah $A^{-1}$ di papan.',
      visual: tr(AX),
      board: { title: 'Invers matriks', pins: ['pA', 'pF'], list: 'LV', upTo: 3, from: 1 },
    },
    {
      ch: 8,
      cap: 'Jadi $X=A^{-1}B$ tepat sama dengan pilihan E, dan hasilnya $(3,4)$. Jawabannya <b class="k-gold">E</b>.',
      visual: { kind: 'soal', hl: 0, focus: 's-oE' },
      board: { title: 'Invers matriks', pins: ['pA', 'pF'], list: 'LV', upTo: 4, from: 3 },
    },
    {
      ch: 9,
      cap: 'Tahukah kalian? Matriks pilihan C adalah invers matriks sebelum disederhanakan, tetapi vektornya terbalik $(34,38)$.',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Pilihan lain', pins: ['pA'], list: 'LW', upTo: 1, from: 0 },
    },
    {
      ch: 9,
      cap: 'Hati-hati dengan pilihan A dan D. Matriksnya $5$ dan $10$ kali invers, jadi hasil kalinya $(15,20)$ dan $(30,40)$.',
      visual: { kind: 'soal', hl: 9 },
      board: { title: 'Pilihan lain', pins: ['pA'], list: 'LW', upTo: 3, from: 1 },
    },
    // ---- 10 · Catatan lengkap ----
    {
      ch: 10,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 11 · Cocokkan pilihan ----
    {
      ch: 11,
      cap: 'Cocokkan dengan pilihan. Hanya E yang tepat sama dengan $X=A^{-1}B$, pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pF'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'v6',
        q: 'Jawaban yang tepat adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>E</b>.',
        opts: [
          { txt: 'matriks 5 kali invers', hint: 'Pembagi $5$ terlewat, hasil kalinya $(15,20)$.' },
          { txt: 'hasil (4, 3)', hint: 'Urutannya terbalik: $4$ sapi dan $3$ kambing.' },
          { txt: 'vektor (34, 38)', hint: 'Invers sebelum disederhanakan, dan vektornya terbalik.' },
          { txt: 'matriks 10 kali invers', hint: 'Pembagi $10$ terlewat, hasil kalinya $(30,40)$.' },
          { txt: 'vektor (19, 34), hasil (3, 4)', ok: true },
        ],
      },
    },
    // ---- 12 · Selesai ----
    {
      ch: 12,
      cap: '<span class="verdict"><span class="seal">E</span><span>Bentuknya $X=A^{-1}B$ dengan $A$ dari $5x+y=19$ dan $10x+y=34$. Pak Andi memelihara <b>3 sapi</b> dan <b>4 kambing</b>.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: card('A'),
      ok: false,
      formula: '5\\times A^{-1}',
      why: 'Matriksnya $5$ kali invers, hasilnya $(15,20)$.',
    },
    {
      label: 'B',
      statement: card('B'),
      ok: false,
      formula: `\\text{hasil}=${v('4', '3')}`,
      why: 'Urutan hasil terbalik: 4 sapi, 3 kambing.',
    },
    {
      label: 'C',
      statement: card('C'),
      ok: false,
      formula: `${M0}^{-1}`,
      why: 'Invers sebelum disederhanakan, vektornya terbalik.',
    },
    {
      label: 'D',
      statement: card('D'),
      ok: false,
      formula: `\\text{hasil kali}=${v('30', '40')}`,
      why: 'Matriksnya $10$ kali invers, hasil kalinya $(30,40)$.',
    },
    {
      label: 'E',
      statement: card('E'),
      ok: true,
      formula: 'X=A^{-1}B',
      why: 'Tepat $A^{-1}B$ dari $5x+y=19$ dan $10x+y=34$.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 2: Pakan Sapi dan Kambing',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Matriks dan SPL',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      { title: 'Data dari gambar', lists: ['LD'] },
      {
        title: 'Bentuk matriks dan samakan konteks',
        lists: ['LM', 'LC'],
        why: 'Konteks kolom matriks harus sama dengan konteks variabel $(x,y)$, dan konteks baris sama dengan hasil di ruas kanan. Karena itu matriks dari tabel ditranspos.',
      },
      {
        title: 'Bentuk SPLDV',
        lists: ['LS'],
        why: 'Baris dikali kolom memberi satu persamaan; persamaan yang semua angkanya genap dibagi $2$.',
      },
      { title: 'Cari x dan y (opsional)', lists: ['LO'] },
      {
        title: 'Invers matriks',
        lists: ['LA', 'LV', 'LW'],
        why: '$AX=B\\Rightarrow X=A^{-1}B$, dengan $A^{-1}=\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$.',
      },
    ],
    answer: 'Jawaban: <b>E</b>; Pak Andi memelihara 3 sapi dan 4 kambing.',
  },
  done: {
    seal: 'E',
    message:
      'Bentuknya $X=A^{-1}B$ dengan $A$ dari $5x+y=19$ dan $10x+y=34$. Pak Andi memelihara <b>3 sapi</b> dan <b>4 kambing</b>.',
  },
  key: {
    answer: 'E',
    cardOk: [false, false, false, false, true],
    goldRows: ['i4', 'v6', 'r1', 'r2'],
  },
  authorNotes: [
    'Ditulis ulang dengan alur pemilik (v1.32): matriks dari tabel (baris hewan, kolom rumput) → konteks kolom harus sama dengan konteks variabel, jadi ditranspos → baris kini sama dengan konteks hasil → SPLDV → disederhanakan → kembali ke bentuk matriks paling sederhana → X = A⁻¹B → pilihan E.',
    'Matriks sebelum ditranspos (10 10; 2 1) adalah tabel soal yang ditulis apa adanya; sesudah ditranspos menjadi M dokumen (10 2; 10 1). Susunan 5x + y = 19 dan invers A = (5 1; 10 1) adalah M′ dokumen langkah i5–i6.',
    'Mencari x dan y dengan SPLDV menjadi bagian opsional (pemilik: pilihan ganda hanya meminta bentuk inversnya). Eliminasi y dari 10x + y = 34 dan 5x + y = 19 adalah turunan aljabar dari kedua persamaan dokumen.',
    'Tambahan turunan aljabar: matriks C = invers M (dokumen langkah i4) dengan vektor terbalik; matriks A = 5 × A⁻¹ dan matriks D = 10 × M⁻¹, sehingga hasil kalinya 5 dan 10 kali (3, 4).',
    'Model batang dan uji perkalian pilihan D dan E dari v1.29 dihapus; adegan mul2 dihapus, adegan pakan2 tinggal gambar.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q02;
