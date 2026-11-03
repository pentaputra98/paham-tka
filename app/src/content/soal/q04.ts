/**
 * SOAL 4 — Pendapatan Tiga Hotel (kapasitas × tarif; pilih semua yang benar). Kunci: (3) dan (5).
 * Sumber: docs/pembahasan25.md "SOAL 4", docs/soal25.md no. 4, docs/ikon_hotel.png.
 * Alur guru (v1.31; revisi pemilik v1.32: angka rupiah apa adanya, tanpa desimal juta; dicatat di dokumen):
 *  - pahami: pilih semua pernyataan yang benar; kamar penuh = semua kamar laku satu malam;
 *  - data dari gambar: harga per malam 150.000, 500.000, 1.000.000, disimpan ke catatan;
 *  - pendapatan tiap hotel: kolom hotel dibingkai di gambar, angka terbang, tiap tipe kamar dikali harganya, hasil
 *    tumbuh sebagai batang (A 7.350.000; B 6.400.000; C 7.550.000); hati-hati: kamar terbanyak (A) bukan pendapatan
 *    terbesar;
 *  - total 21.300.000; cara cepat per tipe kamar (3.300.000 + 9.000.000 + 9.000.000) → batasnya (hanya total);
 *  - bagian opsional "Cara alternatif": kapasitas (baris hotel) × vektor harga;
 *  - tiap pernyataan disalin dari soal lalu diuji di batang pendapatan.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Step, Visual } from '../../engine/types';
import type { Hotel4State } from '../../visuals/hotel4';
import { getSoal } from '../index';

/** Gambar asli soal (docs/ikon_hotel.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/ikon_hotel.png', import.meta.url).href;
const hotel = (state: Hotel4State): Visual => ({ kind: 'svg', scene: 'hotel4', state });
/** pernyataan (docs/soal25.md no. 4) */
const STMT = [
  'Pendapatan Hotel A dan Hotel C sama besar.',
  'Pendapatan Hotel B lebih besar daripada Hotel A.',
  'Pendapatan paling besar diperoleh dari Hotel C.',
  'Masing-masing hotel memiliki selisih pendapatan yang sama besar.',
  'Pendapatan yang diperoleh dari ketiga hotel tersebut lebih dari Rp20.000.000.',
];
const NT = ['pTar'];
const N3 = ['pA', 'pB', 'pC'];
const N4 = ['pA', 'pB', 'pC', 'pS'];
const v3 = (a: string, b: string, c: string): string => `\\begin{pmatrix}${a}\\\\${b}\\\\${c}\\end{pmatrix}`;
/** harga per malam (gambar soal), rupiah */
const PRICE = ['150{.}000', '500{.}000', '1{.}000{.}000'] as const;
const TYPES = ['Standard', 'Deluxe', 'Suite'] as const;

const quote = (n: number): Row => ({
  id: `q${n}`,
  toks: [T(`q${n}a`, `(${n})`, 'sp'), H(`q${n}b`, STMT[n - 1]!, 'q', `@s-o${n}`)],
});
/** pendapatan satu tipe kamar di satu hotel: banyak kamar (dari gambar) × harga (dari catatan) */
const typ = (h: 'a' | 'b' | 'c', i: 0 | 1 | 2, n: string, out: string): Row => {
  const id = `${h}${i + 1}`;
  return {
    id,
    toks: [
      H(`${id}a`, TYPES[i], 'tx'),
      T(`${id}b`, n, 'blue', `@h-${h}${i + 1}`),
      T(`${id}c`, `\\times${PRICE[i]}`, '', `PT${i + 1}`),
      O(`${id}d`, '='),
      T(`${id}e`, out),
    ],
  };
};
/** total satu hotel */
const tot = (h: 'A' | 'B' | 'C', out: string, note: string): Row => {
  const id = `${h.toLowerCase()}4`;
  return {
    id,
    toks: [T(`${id}a`, h), O(`${id}b`, '='), T(`${id}c`, out, 'blue')],
    note: `${note}; simpan ke catatan`,
    box: 'navy',
  };
};
const open6 = (n: number, cap: string): Step => ({
  ch: 6,
  cap,
  visual: { kind: 'soal', hl: 0, focus: `s-o${n}` },
  board: { title: `Pernyataan (${n})`, pins: N4, list: `LO${n}`, upTo: 1, from: 0 },
});
const check6 = (n: number, cap: string, visual: Hotel4State): Step => ({
  ch: 6,
  cap,
  visual: hotel(visual),
  board: { title: `Pernyataan (${n})`, pins: N4, list: `LO${n}`, upTo: 2, from: 1 },
});

const q04: SoalContent = {
  meta: getSoal(4)!,
  sourceRef: 'docs/pembahasan25.md#soal-4',
  layout: 'full',
  paper: {
    html: `<p>Seorang pemilik hotel mengelola 3 hotel yang berada pada kota yang berbeda. Hotel tersebut memiliki konsep dan tipe kamar yang sama yaitu Standard Room, Deluxe Room, dan Suite Room, dengan kapasitas dan harga per malam sebagai berikut.</p>
<figure class="soal-fig soal-fig-wide"><img src="${fig}" width="1178" height="605" alt="Kapasitas kamar hotel. Standard Room: Hotel A 9, Hotel B 6, Hotel C 7, harga Rp150.000. Deluxe Room: 6, 7, 5, harga Rp500.000. Suite Room: 3, 2, 4, harga Rp1.000.000." /></figure>
<p>Pemilik hotel akan melakukan perhitungan pendapatan yang diperoleh dari ketiga hotel tersebut. <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">Bagaimana kondisi pendapatan ketiga hotel tersebut</span></span> dalam <span class="hl hl-red" data-hl="1"><span data-src="s-hari">1 hari</span></span> jika <span class="hl hl-blue" data-hl="1"><span data-src="s-penuh">semua tipe kamar terisi penuh</span></span>?</p>
<p>Pilih pada semua jawaban benar! Jawaban benar lebih dari satu.</p>
<ul class="checks">
${STMT.map((t, i) => `<li><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">${t}</span></span></li>`).join('\n')}
</ul>`,
    srcNames: ['s-tanya', 's-hari', 's-penuh', 's-o1', 's-o2', 's-o3', 's-o4', 's-o5'],
  },
  visualSrc: ['h-a1', 'h-a2', 'h-a3', 'h-b1', 'h-b2', 'h-b3', 'h-c1', 'h-c2', 'h-c3', 'h-p1', 'h-p2', 'h-p3'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Aritmetika dan matriks',
    titleLines: ['Pembahasan Soal', 'Pendapatan <span class="accent">Hotel</span>', 'Kamar Terisi Penuh'],
    lede: 'Tiga hotel, tiga tipe kamar, satu hari penuh. Hotel mana yang paling besar pendapatannya, dan berapa totalnya?',
    facts: [
      { dt: 'Jumlah hotel', dd: '3' },
      { dt: 'Kondisi', dd: 'kamar penuh' },
      { dt: 'Dicari', dd: 'pendapatan per hari' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Kamar terisi penuh' },
    { t: 'Data dari gambar', d: 'Harga per malam' },
    { t: 'Pendapatan tiap hotel', d: 'Kamar × harga' },
    { t: 'Total pendapatan', d: 'Dan cara cepatnya' },
    { t: 'Cara alternatif', d: 'Opsional: perkalian matriks', opt: true },
    { t: 'Analisis pernyataan', d: 'Satu per satu' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Pernyataan 3 dan 5' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pTar: {
      id: 'pTar',
      toks: [
        H('PT0', 'harga', 'tx', 't1a'),
        T('PT1', PRICE[0], '', 't1b'),
        O('PT4', ','),
        T('PT2', PRICE[1], '', 't2b'),
        O('PT5', ','),
        T('PT3', PRICE[2], '', 't3b'),
      ],
    },
    pA: { id: 'pA', toks: [T('PA1', 'A', '', 'a4a'), O('PA0', '='), T('PA2', '7{.}350{.}000', '', 'a4c')] },
    pB: { id: 'pB', toks: [T('PB1', 'B', '', 'b4a'), O('PB0', '='), T('PB2', '6{.}400{.}000', '', 'b4c')] },
    pC: { id: 'pC', toks: [T('PC1', 'C', '', 'c4a'), O('PC0', '='), T('PC2', '7{.}550{.}000', '', 'c4c')] },
    pS: {
      id: 'pS',
      toks: [H('PS1', 'total', 'tx', 's2a'), O('PS0', '='), T('PS2', '21{.}300{.}000', '', 's2c')],
    },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [
          H('k1a', 'Ditanya', 'lbl'),
          H('k1b', 'pendapatan tiap hotel dalam 1 hari', 'gold', '@s-tanya'),
        ],
        note: 'lalu bandingkan; pilih semua pernyataan yang benar',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', 'kamar penuh', 'tx', '@s-penuh'),
          O('k2b', '\\to'),
          H('k2c', 'semua kamar laku 1 malam', 'tx'),
        ],
        note: 'pendapatan = banyak kamar × harga per malam',
      },
    ],
    LT: [
      {
        id: 't1',
        toks: [H('t1a', 'Standard', 'tx'), T('t1b', PRICE[0], 'blue', '@h-p1')],
        note: 'rupiah per kamar per malam',
      },
      { id: 't2', toks: [H('t2a', 'Deluxe', 'tx'), T('t2b', PRICE[1], 'blue', '@h-p2')] },
      {
        id: 't3',
        toks: [H('t3a', 'Suite', 'tx'), T('t3b', PRICE[2], 'blue', '@h-p3')],
        note: 'simpan ke catatan',
      },
    ],
    LA: [
      typ('a', 0, '9', '1{.}350{.}000'),
      typ('a', 1, '6', '3{.}000{.}000'),
      typ('a', 2, '3', '3{.}000{.}000'),
      tot('A', '7{.}350{.}000', '$1.350.000+3.000.000+3.000.000$'),
    ],
    LB: [
      typ('b', 0, '6', '900{.}000'),
      typ('b', 1, '7', '3{.}500{.}000'),
      typ('b', 2, '2', '2{.}000{.}000'),
      tot('B', '6{.}400{.}000', '$900.000+3.500.000+2.000.000$'),
    ],
    LC: [
      typ('c', 0, '7', '1{.}050{.}000'),
      typ('c', 1, '5', '2{.}500{.}000'),
      typ('c', 2, '4', '4{.}000{.}000'),
      tot('C', '7{.}550{.}000', '$1.050.000+2.500.000+4.000.000$'),
      {
        id: 'w1',
        toks: [
          H('w1a', 'Hati-hati', 'lbl'),
          H('w1b', 'kamar terbanyak', 'tx'),
          O('w1c', '\\ne'),
          H('w1d', 'pendapatan terbesar', 'tx'),
        ],
        note: 'A punya 18 kamar dan C 16, tetapi C punya 4 Suite (harga tertinggi)',
      },
    ],
    LS: [
      {
        id: 's1',
        toks: [
          T('s1a', '7{.}350{.}000', '', 'PA2'),
          O('s1b', '+'),
          T('s1c', '6{.}400{.}000', '', 'PB2'),
          O('s1d', '+'),
          T('s1e', '7{.}550{.}000', '', 'PC2'),
        ],
        note: 'pendapatan A + B + C dalam 1 hari',
      },
      {
        id: 's2',
        toks: [H('s2a', 'total', 'tx'), O('s2b', '='), T('s2c', '21{.}300{.}000', 'blue')],
        note: 'rupiah; simpan ke catatan',
        box: 'navy',
      },
    ],
    LQ: [
      {
        id: 'u1',
        toks: [
          H('u1a', 'Standard', 'tx'),
          T('u1b', '22\\times150{.}000', '', 'PT1'),
          O('u1c', '='),
          T('u1d', '3{.}300{.}000', 'blue'),
        ],
        note: '$9+6+7=22$ kamar Standard di ketiga hotel',
      },
      {
        id: 'u2',
        toks: [
          H('u2a', 'Deluxe', 'tx'),
          T('u2b', '18\\times500{.}000', '', 'PT2'),
          O('u2c', '='),
          T('u2d', '9{.}000{.}000', 'blue'),
        ],
        note: '$6+7+5=18$ kamar Deluxe',
      },
      {
        id: 'u3',
        toks: [
          H('u3a', 'Suite', 'tx'),
          T('u3b', '9\\times1{.}000{.}000', '', 'PT3'),
          O('u3c', '='),
          T('u3d', '9{.}000{.}000', 'blue'),
        ],
        note: '$3+2+4=9$ kamar Suite',
      },
      {
        id: 'u4',
        toks: [
          T('u4a', '3{.}300{.}000', '', 'u1d'),
          O('u4b', '+'),
          T('u4c', '9{.}000{.}000', '', 'u2d'),
          O('u4d', '+'),
          T('u4e', '9{.}000{.}000', '', 'u3d'),
        ],
        note: 'hasilnya $21.300.000$, sama dengan total di catatan',
      },
      {
        id: 'u5',
        toks: [H('u5a', 'Batasnya', 'lbl'), H('u5b', 'hanya memberi total', 'tx')],
        note: 'untuk membandingkan hotel tetap perlu pendapatan tiap hotel',
      },
    ],
    // cara alternatif (opsional): perkalian matriks
    LM: [
      {
        id: 'm1',
        toks: [
          T('m1a', '\\begin{pmatrix}9&6&3\\\\6&7&2\\\\7&5&4\\end{pmatrix}'),
          T('m1b', v3(...PRICE), '', 'PT1'),
        ],
        note: 'baris = Hotel A, B, C; kolom = Standard, Deluxe, Suite; dikali vektor harga',
      },
      {
        id: 'm2',
        toks: [O('m2a', '='), T('m2b', v3('7{.}350{.}000', '6{.}400{.}000', '7{.}550{.}000'), 'blue')],
        note: 'tiap baris × kolom harga = pendapatan hotel itu; sama dengan catatan',
        box: 'navy',
      },
    ],
    LO1: [
      quote(1),
      {
        id: 'o1',
        toks: [
          T('o1a', '7{.}350{.}000', 'red', 'PA2'),
          O('o1b', '\\ne'),
          T('o1c', '7{.}550{.}000', 'red', 'PC2'),
        ],
        note: 'A dan C berselisih Rp200.000 → <b class="k-red">salah</b>',
      },
    ],
    LO2: [
      quote(2),
      {
        id: 'o2',
        toks: [T('o2a', '6{.}400{.}000', 'red', 'PB2'), O('o2b', '<'), T('o2c', '7{.}350{.}000', '', 'PA2')],
        note: 'B lebih kecil daripada A → <b class="k-red">salah</b>',
      },
    ],
    LO3: [
      quote(3),
      {
        id: 'o3',
        toks: [
          T('o3a', '7{.}550{.}000', 'gold', 'PC2'),
          O('o3b', '>'),
          T('o3c', '7{.}350{.}000', '', 'PA2'),
          O('o3d', '>'),
          T('o3e', '6{.}400{.}000', '', 'PB2'),
        ],
        note: 'Hotel C paling besar → <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    LO4: [
      quote(4),
      {
        id: 'o4',
        toks: [T('o4a', '950{.}000', 'red'), O('o4b', '\\ne'), T('o4c', '200{.}000', 'red')],
        note: '$A-B=950.000$ dan $C-A=200.000$, tidak sama → <b class="k-red">salah</b>',
      },
    ],
    LO5: [
      quote(5),
      {
        id: 'o5',
        toks: [T('o5a', '21{.}300{.}000', 'gold', 'PS2'), O('o5b', '>'), T('o5c', '20{.}000{.}000')],
        note: 'total ketiga hotel lebih dari Rp20.000.000 → <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    L8: [
      { id: 'z1', toks: [H('z1a', 'Jawaban', 'lbl'), H('z1b', 'pernyataan (3) dan (5)', 'tx')], box: 'gold' },
    ],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', '\\text{total}=21{.}300{.}000')],
        note: 'Hotel C paling besar, Rp7.550.000 per hari',
        box: 'gold',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), H('r2b', '(3) dan (5)', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Kita memilih semua pernyataan yang benar tentang pendapatan ketiga hotel dalam $1$ hari.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Semua kamar terisi penuh, artinya setiap kamar laku satu malam. Jadi pendapatan = banyak kamar × harga per malam.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Data dari gambar ----
    {
      ch: 2,
      cap: 'Perhatikan kolom harga per malam. Standard Rp150.000, Deluxe Rp500.000, dan Suite Rp1.000.000; simpan ke catatan.',
      visual: hotel({ price: true }),
      board: { title: 'Harga per malam', list: 'LT', upTo: 3, from: 0, save: ['pTar'] },
    },
    // ---- 3 · Pendapatan tiap hotel ----
    {
      ch: 3,
      cap: 'Hotel A dulu. Kalikan banyak kamar tiap tipe dengan harganya, $9\\times150.000$, $6\\times500.000$, dan $3\\times1.000.000$.',
      visual: hotel({ col: 'A' }),
      board: { title: 'Pendapatan Hotel A', pins: NT, list: 'LA', upTo: 3, from: 0 },
    },
    {
      ch: 3,
      cap: 'Jumlahkan, $1.350.000+3.000.000+3.000.000=7.350.000$ rupiah. Simpan ke catatan.',
      visual: hotel({ view: 'bars', n: 1 }),
      board: { title: 'Pendapatan Hotel A', pins: NT, list: 'LA', upTo: 4, from: 3, save: ['pA'] },
    },
    {
      ch: 3,
      cap: 'Cara yang sama untuk Hotel B, $6\\times150.000$, $7\\times500.000$, dan $2\\times1.000.000$.',
      visual: hotel({ col: 'B' }),
      board: { title: 'Pendapatan Hotel B', pins: ['pTar', 'pA'], list: 'LB', upTo: 3, from: 0 },
    },
    {
      ch: 3,
      cap: 'Jumlahkan, $900.000+3.500.000+2.000.000=6.400.000$ rupiah. Simpan ke catatan.',
      visual: hotel({ view: 'bars', n: 2 }),
      board: {
        title: 'Pendapatan Hotel B',
        pins: ['pTar', 'pA'],
        list: 'LB',
        upTo: 4,
        from: 3,
        save: ['pB'],
      },
      ask: {
        before: 'b4',
        q: 'Pendapatan Hotel B ($6$ Standard, $7$ Deluxe, $2$ Suite) adalah…',
        opts: [
          { txt: 'Rp6.400.000', ok: true },
          { txt: 'Rp7.350.000', hint: 'Itu pendapatan Hotel A. Pakai kolom Hotel B, yaitu $6$, $7$, $2$.' },
          {
            txt: 'Rp5.650.000',
            hint: 'Periksa lagi, $7\\times$ Rp500.000 = Rp3.500.000 dan $2\\times$ Rp1.000.000 = Rp2.000.000.',
          },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Hotel C, $7\\times150.000$, $5\\times500.000$, dan $4\\times1.000.000$.',
      visual: hotel({ col: 'C' }),
      board: { title: 'Pendapatan Hotel C', pins: ['pTar', 'pA', 'pB'], list: 'LC', upTo: 3, from: 0 },
    },
    {
      ch: 3,
      cap: 'Jumlahkan, $1.050.000+2.500.000+4.000.000=7.550.000$ rupiah, batang paling panjang. Simpan ke catatan.',
      visual: hotel({ view: 'bars', n: 3 }),
      board: {
        title: 'Pendapatan Hotel C',
        pins: ['pTar', 'pA', 'pB'],
        list: 'LC',
        upTo: 4,
        from: 3,
        save: ['pC'],
      },
    },
    {
      ch: 3,
      cap: 'Hati-hati, Hotel A punya kamar terbanyak ($18$), tetapi pendapatannya bukan yang terbesar. Hotel C punya $4$ Suite, tipe yang paling mahal.',
      visual: hotel({ view: 'bars', n: 3, hl: ['A', 'C'] }),
      board: { title: 'Pendapatan Hotel C', pins: N3, list: 'LC', upTo: 5, from: 4 },
    },
    // ---- 4 · Total pendapatan ----
    {
      ch: 4,
      cap: 'Jumlahkan ketiganya, $7.350.000+6.400.000+7.550.000=21.300.000$ rupiah. Simpan ke catatan.',
      visual: hotel({ view: 'total', stack: 'hotel' }),
      board: { title: 'Total pendapatan', pins: N3, list: 'LS', upTo: 2, from: 0, save: ['pS'] },
    },
    {
      ch: 4,
      cap: 'Tahukah kalian? Total juga bisa dihitung per tipe kamar, misalnya Standard $9+6+7=22$ kamar, $22\\times150.000=3.300.000$.',
      visual: hotel({ view: 'total', stack: 'type' }),
      board: { title: 'Cara cepat untuk total', pins: ['pTar', 'pS'], list: 'LQ', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Deluxe $18\\times500.000=9.000.000$ dan Suite $9\\times1.000.000=9.000.000$, jadi totalnya sama, $21.300.000$.',
      visual: hotel({ view: 'total', stack: 'type' }),
      board: { title: 'Cara cepat untuk total', pins: ['pTar', 'pS'], list: 'LQ', upTo: 4, from: 1 },
    },
    {
      ch: 4,
      cap: 'Batasnya, cara cepat ini hanya memberi total. Untuk membandingkan hotel, kita tetap butuh pendapatan tiap hotel.',
      visual: hotel({ view: 'bars', n: 3 }),
      board: { title: 'Cara cepat untuk total', pins: ['pTar', 'pS'], list: 'LQ', upTo: 5, from: 4 },
    },
    // tawaran cara alternatif (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Hitungan tiap hotel tadi sebenarnya perkalian matriks. Mau lihat cara alternatif dengan matriks?',
      visual: hotel({ view: 'bars', n: 3 }),
      board: { title: 'Cara cepat untuk total', pins: ['pTar', 'pS'], list: 'LQ', upTo: 5, from: 5 },
      branch: { yes: 'Ya, lihat cara matriks' },
    },
    // ---- 5 · Cara alternatif dengan perkalian matriks (opsional) ----
    {
      ch: 5,
      cap: 'Kapasitas disusun dengan baris Hotel A, B, C dan kolom tipe kamar, lalu dikali vektor harga.',
      visual: hotel({ price: true }),
      board: { title: 'Perkalian matriks', pins: NT, list: 'LM', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Tiap baris dikali kolom harga memberi $7.350.000$, $6.400.000$, dan $7.550.000$, sama dengan hitungan tiap hotel.',
      visual: hotel({ view: 'bars', n: 3 }),
      board: { title: 'Perkalian matriks', pins: N3, list: 'LM', upTo: 2, from: 1 },
    },
    // ---- 6 · Analisis pernyataan ----
    open6(1, 'Kita cek pernyataan (1) dulu. Salin ke papan.'),
    check6(
      1,
      'Batang A dan C tidak sama panjang, selisihnya Rp200.000. Pernyataan (1) <b class="k-red">salah</b>.',
      {
        view: 'bars',
        n: 3,
        hl: ['A', 'C'],
        bad: true,
        diff: [['A', 'C']],
      },
    ),
    open6(2, 'Lanjut pernyataan (2).'),
    check6(
      2,
      'Batang B lebih pendek daripada A, $6.400.000<7.350.000$. Pernyataan (2) <b class="k-red">salah</b>.',
      {
        view: 'bars',
        n: 3,
        hl: ['A', 'B'],
        bad: true,
        diff: [['B', 'A']],
      },
    ),
    open6(3, 'Pernyataan (3).'),
    check6(3, 'Batang C paling panjang, Rp7.550.000. Pernyataan (3) <b class="k-gold">benar</b>.', {
      view: 'bars',
      n: 3,
      win: true,
    }),
    open6(4, 'Pernyataan (4).'),
    check6(
      4,
      'Selisih A dan B Rp950.000, sedangkan C dan A hanya Rp200.000, tidak sama besar. Pernyataan (4) <b class="k-red">salah</b>.',
      {
        view: 'bars',
        n: 3,
        diff: [
          ['B', 'A'],
          ['A', 'C'],
        ],
      },
    ),
    open6(5, 'Terakhir, pernyataan (5).'),
    check6(
      5,
      'Total ketiga hotel Rp21.300.000, melewati garis Rp20.000.000. Pernyataan (5) <b class="k-gold">benar</b>.',
      { view: 'total', stack: 'hotel' },
    ),
    // ---- 7 · Catatan lengkap ----
    {
      ch: 7,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 8 · Cocokkan pilihan ----
    {
      ch: 8,
      cap: 'Cocokkan dengan pilihan: yang benar hanya pernyataan (3) dan (5). Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: N4, list: 'L8', upTo: 1, from: 0 },
      ask: {
        before: 'z1',
        q: 'Pernyataan yang benar adalah…',
        col: true,
        win: 'Pernyataan <b>(3) dan (5)</b>.',
        opts: [
          {
            txt: '(3) saja',
            hint: 'Periksa pernyataan (5), totalnya Rp21.300.000, lebih dari Rp20.000.000.',
          },
          { txt: '(3) dan (5)', ok: true },
          { txt: '(1), (3), dan (5)', hint: 'Pernyataan (1), Rp7.350.000 tidak sama dengan Rp7.550.000.' },
          { txt: '(2) dan (5)', hint: 'Pernyataan (2), Rp6.400.000 lebih kecil daripada Rp7.350.000.' },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">3 · 5</span><span>Hotel C paling besar (Rp7.550.000), dan total ketiga hotel Rp21.300.000, lebih dari Rp20.000.000.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: '(1)',
      statement: STMT[0]!,
      ok: false,
      formula: '7{.}350{.}000\\ne7{.}550{.}000',
      why: 'Selisihnya Rp200.000.',
    },
    {
      label: '(2)',
      statement: STMT[1]!,
      ok: false,
      formula: '6{.}400{.}000<7{.}350{.}000',
      why: 'B paling banyak Deluxe, tetapi tetap lebih kecil.',
    },
    {
      label: '(3)',
      statement: STMT[2]!,
      ok: true,
      formula: 'C=7{.}550{.}000',
      why: 'C punya 4 Suite, harga tertinggi.',
    },
    {
      label: '(4)',
      statement: STMT[3]!,
      ok: false,
      formula: '950{.}000\\ne200{.}000',
      why: 'Selisih antarhotel tidak sama.',
    },
    {
      label: '(5)',
      statement: STMT[4]!,
      ok: true,
      formula: '21{.}300{.}000>20{.}000{.}000',
      why: 'Total Rp21.300.000.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 4: Pendapatan Tiga Hotel',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Aritmetika dan matriks',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      { title: 'Harga per malam', lists: ['LT'] },
      {
        title: 'Pendapatan tiap hotel',
        lists: ['LA', 'LB', 'LC'],
        why: 'Pendapatan hotel = jumlah (banyak kamar × harga) untuk setiap tipe kamar.',
      },
      {
        title: 'Total pendapatan',
        lists: ['LS', 'LQ'],
        why: 'Total juga bisa dihitung per tipe kamar, tetapi cara itu tidak memberi pendapatan tiap hotel.',
      },
      {
        title: 'Cara alternatif dengan perkalian matriks (opsional)',
        lists: ['LM'],
        why: 'Kapasitas (baris hotel) dikali vektor harga memberi pendapatan tiap hotel.',
      },
      { title: 'Analisis pernyataan', lists: ['LO1', 'LO2', 'LO3', 'LO4', 'LO5'] },
    ],
    answer: 'Jawaban: pernyataan <b>(3) dan (5)</b>.',
  },
  done: {
    seal: '3 · 5',
    message:
      'Hotel C paling besar (Rp7.550.000), dan total ketiga hotel Rp21.300.000, lebih dari Rp20.000.000.',
  },
  key: {
    answer: '3, 5',
    cardOk: [false, false, true, false, true],
    goldRows: ['o3', 'o5', 'z1', 'r1', 'r2'],
  },
  authorNotes: [
    'Modul baru (v1.31) dengan alur guru: pendapatan tiap hotel dihitung dari kolom gambar dan tumbuh sebagai batang, lalu total, cara cepat, dan analisis pernyataan di batang pendapatan.',
    'Revisi pemilik (v1.32): semua angka ditulis rupiah apa adanya (150.000; 7.350.000; 21.300.000), tanpa desimal juta, karena siswa bingung dengan koma; tiap tipe kamar dihitung pada barisnya sendiri.',
    'Cara cepat per tipe kamar (3.300.000 + 9.000.000 + 9.000.000 = 21.300.000) dari "Pemeriksaan hasil" dokumen; batas berlakunya ditambahkan: cara itu hanya memberi total.',
    'Bagian opsional "Cara alternatif": kapasitas dengan baris hotel (Kᵀ di dokumen) dikali vektor harga.',
    'Langkah Hati-hati "kamar terbanyak bukan pendapatan terbesar" dari "Kesalahan umum" dokumen.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q04;
