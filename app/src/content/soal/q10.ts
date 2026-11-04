/**
 * SOAL 10 — Eceng Gondok (fungsi eksponensial dari grafik; multi-jawaban). Kunci: Danau C, D, E.
 * Sumber: docs/pembahasan25.md "SOAL 10", docs/soal25.md no. 10, docs/grafik_eceng_gondok.png.
 * Alur (v1.43, dicatat di dokumen):
 *  - pahami: grafik memberi 10, 70, 490; data = luas tiap danau setelah 3 tahun; ditanya luas awal lebih dari 49 m²;
 *  - baca grafik: 10 → 70 → 490, tiap tahun dikali 7 (rasio, bukan selisih);
 *  - 3 tahun berarti dikali 7 tiga kali, 7³ = 343 (bukan 7 · 3);
 *  - logika dulu tanpa desimal: luas awal tepat 49 menjadi 49 → 343 → 2.401 → 16.807 setelah 3 tahun, jadi danau yang
 *    awalnya lebih dari 49 harus lebih dari 16.807 setelah 3 tahun; tiap danau dibandingkan dengan batas itu;
 *  - bagian opsional "Cara lain": luas awal tiap danau = data ÷ 343 (dibulatkan), model L(t) = 10 · 7^t.
 * Asumsi dokumen: semua danau tumbuh dengan faktor 7 per tahun. Tanpa simbol ":" di baris papan.
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Eceng10State } from '../../visuals/eceng10';
import { getSoal } from '../index';

/** Gambar asli soal (docs/grafik_eceng_gondok.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/grafik_eceng_gondok.png', import.meta.url).href;
const ec = (state: Eceng10State): Visual => ({ kind: 'svg', scene: 'eceng10', state });
const DANAU: Array<[string, string]> = [
  ['A', '15.000'],
  ['B', '16.500'],
  ['C', '17.000'],
  ['D', '17.500'],
  ['E', '18.000'],
];
const PIN = ['pF', 'pB'];

const q10: SoalContent = {
  meta: getSoal(10)!,
  sourceRef: 'docs/pembahasan25.md#soal-10',
  layout: 'full',
  paper: {
    html: `<p>Seorang peneliti lingkungan melakukan pengamatan terhadap pertumbuhan tanaman eceng gondok di beberapa danau sekitar wilayah X. <span class="hl hl-red" data-hl="1"><span data-src="s-3th">Pengamatan dilakukan selama 3 tahun</span></span> dan hasil menunjukkan bahwa pertumbuhan eceng gondok dapat dimodelkan dengan fungsi berikut.</p>
<figure class="soal-fig soal-fig-wide"><img src="${fig}" width="1127" height="635" alt="Grafik luas area tertutup eceng gondok: tahun ke-0 10 m², tahun ke-1 70 m², tahun ke-2 490 m²; foto tanaman eceng gondok." /></figure>
<p>Setelah 3 tahun pengamatan, peneliti mencatat luas area yang tertutupi tanaman eceng gondok pada beberapa wilayah perairan. Berikut data yang diperoleh.</p>
<table class="soal-table"><thead><tr><th scope="col">Wilayah Perairan</th><th scope="col">Luas Area yang Tertutupi Tanaman Eceng Gondok (m²)</th></tr></thead>
<tbody>${DANAU.map(([d, v]) => `<tr><th scope="row">Danau ${d}</th><td><span class="hl hl-red" data-hl="1"><span data-src="s-L${d}">${v}</span></span></td></tr>`).join('')}</tbody></table>
<p>Berdasarkan data tersebut, wilayah perairan manakah dengan <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">luas area yang tertutupi tanaman eceng gondok lebih dari 49 m² pada awal pengamatan</span></span>? Pilih semua jawaban yang benar!</p>
<ul class="checks">
${DANAU.map(([d], i) => `<li><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">Danau ${d}</span></span></li>`).join('\n')}
</ul>`,
    srcNames: [
      's-3th',
      's-LA',
      's-LB',
      's-LC',
      's-LD',
      's-LE',
      's-tanya',
      's-o1',
      's-o2',
      's-o3',
      's-o4',
      's-o5',
    ],
  },
  visualSrc: ['g0', 'g1', 'g2', 'c-3'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Fungsi eksponensial',
    titleLines: ['Pembahasan Soal', 'Eceng <span class="accent">Gondok</span>', 'Luas Awal'],
    lede: 'Eceng gondok menutupi permukaan danau makin cepat. Dari luas area setelah 3 tahun, kita cari danau mana yang awalnya sudah lebih dari 49 m².',
    facts: [
      { dt: 'Lama pengamatan', dd: '3 tahun' },
      { dt: 'Ambang awal', dd: '49 m²' },
      { dt: 'Pilihan', dd: '5 danau' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Grafik dan data 3 tahun' },
    { t: 'Baca grafik', d: 'Tiap tahun dikali 7' },
    { t: 'Batas setelah 3 tahun', d: '49 menjadi 16.807' },
    { t: 'Cocokkan tiap danau', d: 'Di atas atau di bawah batas' },
    { t: 'Cara lain', d: 'Opsional: luas awal tiap danau', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Danau C, D, E' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pF: { id: 'pF', toks: [H('PF1', 'tiap tahun', 'tx', 'a3a'), T('PF2', '\\times7', '', 'a3c')] },
    pB: { id: 'pB', toks: [H('PB1', 'batas', 'tx', 'b5a'), T('PB2', '16{.}807', '', 'b5c')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [H('k1a', 'grafik', 'tx'), T('k1b', '10,\\ 70,\\ 490', 'blue', '@g0')],
        note: 'luas pada tahun ke-0, ke-1, dan ke-2',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', 'data', 'tx', '@s-3th'),
          O('k2b', '\\to'),
          H('k2c', 'luas tiap danau setelah 3 tahun', 'tx'),
        ],
      },
      {
        id: 'k3',
        toks: [H('k3a', 'Ditanya', 'lbl'), H('k3b', 'luas awal lebih dari 49 m²', 'gold', '@s-tanya')],
        note: 'jawabannya bisa lebih dari satu',
      },
    ],
    LG: [
      {
        id: 'a1',
        toks: [
          T('a1a', '10', '', '@g0'),
          O('a1b', '\\to'),
          T('a1c', '70', '', '@g1'),
          H('a1d', 'dikali', 'tx'),
          T('a1e', '7', 'blue'),
        ],
        note: '$10\\times7=70$',
      },
      {
        id: 'a2',
        toks: [
          T('a2a', '70', '', '@g1'),
          O('a2b', '\\to'),
          T('a2c', '490', '', '@g2'),
          H('a2d', 'dikali', 'tx'),
          T('a2e', '7', 'blue'),
        ],
        note: '$70\\times7=490$',
      },
      {
        id: 'a3',
        toks: [H('a3a', 'tiap tahun', 'tx'), O('a3b', '\\to'), T('a3c', '\\times7', 'blue')],
        note: 'dikali bilangan yang sama, jadi eksponensial; simpan ke catatan',
        box: 'navy',
      },
    ],
    LB: [
      {
        id: 'b1',
        toks: [
          H('b1a', '3 tahun', 'tx'),
          O('b1b', '\\to'),
          T('b1c', '\\times7\\times7\\times7=7^3'),
          O('b1d', '='),
          T('b1e', '343', 'blue'),
        ],
        note: '$7\\cdot7=49$ dan $49\\cdot7=343$',
      },
      {
        id: 'b2',
        toks: [H('b2a', 'Hati-hati', 'lbl'), T('b2b', '7\\times3=21'), H('b2c', 'salah', 'tx')],
        note: 'dikali $7$ tiga kali, bukan $7$ dikali $3$',
      },
      {
        id: 'b3',
        toks: [H('b3a', 'awal', 'tx'), T('b3b', '49'), O('b3c', '\\to'), T('b3d', '49\\times7=343')],
        note: 'misalkan luas awalnya tepat $49$ m²',
      },
      {
        id: 'b4',
        toks: [T('b4c', '2{.}401\\times7=16{.}807')],
        note: 'tahun ke-2 $343\\times7=2.401$, lalu tahun ke-3',
      },
      {
        id: 'b5',
        toks: [
          H('b5a', 'batas', 'tx'),
          T('b5b', 'L(3)'),
          O('b5c0', '>'),
          T('b5c', '16{.}807', 'blue', '@c-3'),
        ],
        note: 'awal lebih dari $49$ berarti setelah 3 tahun lebih dari $16.807$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LC: [
      {
        id: 'c1',
        toks: [
          H('c1a', 'A', 'sp'),
          T('c1b', '15{.}000', '', '@s-LA'),
          O('c1c', '<'),
          T('c1d', '16{.}807', '', 'PB2'),
        ],
        note: 'di bawah batas → <b class="k-red">bukan</b>',
      },
      {
        id: 'c2',
        toks: [
          H('c2a', 'B', 'sp'),
          T('c2b', '16{.}500', '', '@s-LB'),
          O('c2c', '<'),
          T('c2d', '16{.}807', '', 'PB2'),
        ],
        note: 'hampir, tetapi masih di bawah → <b class="k-red">bukan</b>',
      },
      {
        id: 'c3',
        toks: [
          H('c3a', 'C, D, E', 'tx'),
          T('c3b', '17{.}000,\\ 17{.}500,\\ 18{.}000'),
          O('c3c', '>'),
          T('c3d', '16{.}807', '', 'PB2'),
        ],
        note: 'di atas batas → <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    // cara lain (opsional): luas awal tiap danau
    LO: [
      {
        id: 'o1',
        toks: [T('o1a', 'L(t)=10\\cdot7^{t}'), H('o1b', 'untuk grafik', 'tx')],
        note: 'luas awal $10$, dikali $7$ tiap tahun',
      },
      {
        id: 'o2',
        toks: [
          H('o2a', 'luas awal', 'tx'),
          O('o2b', '='),
          T('o2c', '\\dfrac{\\text{luas setelah 3 tahun}}{343}'),
        ],
        note: 'dibagi $343$ karena dikali $343$ selama 3 tahun',
      },
      {
        id: 'o3',
        toks: [T('o3a', 'A\\approx43,\\ B\\approx48'), O('o3b', '<'), T('o3c', '49')],
        note: '$15.000\\div343$ dan $16.500\\div343$, dibulatkan ke bawah',
      },
      {
        id: 'o4',
        toks: [T('o4a', 'C,\\ D\\approx51,\\ E\\approx52'), O('o4b', '>'), T('o4c', '49')],
        note: 'C sedikit di atas 49; hasilnya sama dengan cara batas',
      },
    ],
    L8: [{ id: 'v1', toks: [H('v1a', 'Jawaban', 'lbl'), H('v1b', 'Danau C, D, dan E', 'tx')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', '7^3=343'), O('r1b', ','), T('r1c', '49\\times343=16{.}807')],
        note: 'batas setelah 3 tahun',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), H('r2b', 'Danau C, D, dan E', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan grafiknya. Luas eceng gondok tahun ke-0, ke-1, dan ke-2 adalah $10$, $70$, dan $490$ m².',
      visual: ec({ box: true }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Data tabel adalah luas setelah 3 tahun. Yang ditanya danau mana yang luas awalnya lebih dari $49$ m².',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 3, from: 1 },
    },
    // ---- 2 · Baca grafik ----
    {
      ch: 2,
      cap: 'Dari $10$ menjadi $70$, luasnya dikali $7$.',
      visual: ec({ box: true, arr: 1 }),
      board: { title: 'Baca grafik', list: 'LG', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Dari $70$ menjadi $490$, dikali $7$ lagi. Jadi tiap tahun luasnya dikali $7$.',
      visual: ec({ box: true, arr: 2 }),
      board: { title: 'Baca grafik', list: 'LG', upTo: 3, from: 1, save: ['pF'] },
      ask: {
        before: 'a2',
        q: 'Dari $70$ m² ke $490$ m², luasnya dikali…',
        opts: [
          { tex: '7', ok: true },
          { tex: '420', hint: '$490-70=420$ adalah selisih. Yang dicari pengalinya, $490\\div70$.' },
          { tex: '49', hint: '$49$ adalah ambang pada soal. Hitung $490\\div70$.' },
        ],
      },
    },
    // ---- 3 · Batas setelah 3 tahun ----
    {
      ch: 3,
      cap: 'Selama 3 tahun luasnya dikali $7$ tiga kali, $7\\times7\\times7=343$. Hati-hati, bukan $7\\times3=21$.',
      visual: ec({ view: 'chain', k: 0 }),
      board: { title: 'Batas setelah 3 tahun', pins: ['pF'], list: 'LB', upTo: 2, from: 0 },
    },
    {
      ch: 3,
      cap: 'Misalkan luas awal tepat $49$ m². Tiap tahun dikali $7$, jadi $343$, lalu $2.401$, lalu $16.807$ setelah 3 tahun.',
      visual: ec({ view: 'chain', k: 3 }),
      board: { title: 'Batas setelah 3 tahun', pins: ['pF'], list: 'LB', upTo: 4, from: 2 },
    },
    {
      ch: 3,
      cap: 'Jadi danau yang awalnya lebih dari $49$ m² harus lebih dari $16.807$ m² setelah 3 tahun. Itu batasnya.',
      visual: ec({ view: 'chain', k: 3 }),
      board: { title: 'Batas setelah 3 tahun', pins: ['pF'], list: 'LB', upTo: 5, from: 4, save: ['pB'] },
    },
    // ---- 4 · Cocokkan tiap danau ----
    {
      ch: 4,
      cap: 'Bandingkan data tiap danau dengan batas $16.807$. Danau A, $15.000$, masih di bawah batas.',
      visual: ec({ view: 'bars', n: 1 }),
      board: { title: 'Cocokkan tiap danau', pins: PIN, list: 'LC', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Danau B, $16.500$. Hati-hati, hampir sampai, tetapi masih di bawah $16.807$.',
      visual: ec({ view: 'bars', n: 2 }),
      board: { title: 'Cocokkan tiap danau', pins: PIN, list: 'LC', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: 'Danau C, D, dan E, yaitu $17.000$, $17.500$, dan $18.000$, semuanya di atas batas. Jadi jawabannya Danau C, D, dan E.',
      visual: ec({ view: 'bars', n: 5 }),
      board: { title: 'Cocokkan tiap danau', pins: PIN, list: 'LC', upTo: 3, from: 2 },
    },
    // tawaran cara lain (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Mau lihat cara lain, yaitu menghitung luas awal tiap danau?',
      visual: ec({ view: 'bars', n: 5 }),
      board: { title: 'Cocokkan tiap danau', pins: PIN, list: 'LC', upTo: 3, from: 3 },
      branch: { yes: 'Ya, lihat cara lain' },
    },
    // ---- 5 · Cara lain (opsional) ----
    {
      ch: 5,
      cap: 'Grafik itu bisa ditulis $L(t)=10\\cdot7^t$. Karena selama 3 tahun dikali $343$, luas awal tiap danau sama dengan datanya dibagi $343$.',
      visual: ec({ box: true, arr: 2 }),
      board: { title: 'Cara lain', pins: PIN, list: 'LO', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Hasilnya, A dan B di bawah $49$, sedangkan C, D, dan E di atas $49$. Sama dengan cara batas.',
      visual: ec({ view: 'bars', n: 5 }),
      board: { title: 'Cara lain', pins: PIN, list: 'LO', upTo: 4, from: 2 },
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
      cap: 'Cocokkan dengan pilihan. Hanya danau yang lebih dari $16.807$ m² setelah 3 tahun; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: PIN, list: 'L8', upTo: 1, from: 0 },
      ask: {
        before: 'v1',
        q: 'Danau yang luas awalnya lebih dari 49 m² adalah…',
        col: true,
        win: '<b>Danau C, D, dan E</b>.',
        opts: [
          { txt: 'Danau C, D, dan E', ok: true },
          { txt: 'Danau B, C, D, dan E', hint: '$16.500$ masih di bawah batas $16.807$.' },
          { txt: 'Danau D dan E', hint: '$17.000$ sudah di atas batas $16.807$.' },
          { txt: 'Semua danau', hint: 'Bandingkan dengan batas $16.807$, bukan dengan $49$.' },
        ],
      },
    },
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">C · D · E</span><span>Luasnya berlipat 7 tiap tahun, jadi 343 kali dalam 3 tahun. Danau C, D, dan E yang luas awalnya lebih dari 49 m².</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    { label: 'A', statement: 'Danau A', ok: false, formula: '15{.}000<16{.}807', why: 'Di bawah batas.' },
    {
      label: 'B',
      statement: 'Danau B',
      ok: false,
      formula: '16{.}500<16{.}807',
      why: 'Hampir, tetapi belum melewati batas.',
    },
    { label: 'C', statement: 'Danau C', ok: true, formula: '17{.}000>16{.}807', why: 'Di atas batas.' },
    { label: 'D', statement: 'Danau D', ok: true, formula: '17{.}500>16{.}807', why: 'Di atas batas.' },
    { label: 'E', statement: 'Danau E', ok: true, formula: '18{.}000>16{.}807', why: 'Di atas batas.' },
  ],
  notes: {
    title: 'Pembahasan Soal 10: Eceng Gondok',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Fungsi eksponensial',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Baca grafik',
        lists: ['LG'],
        why: 'Jika luas dikali bilangan yang sama setiap tahun, modelnya eksponensial $L(t)=L_0\\cdot r^t$.',
      },
      {
        title: 'Batas setelah 3 tahun',
        lists: ['LB'],
        why: 'Asumsi: semua danau tumbuh dengan faktor 7 per tahun, yang berbeda hanya luas awalnya.',
      },
      { title: 'Cocokkan tiap danau', lists: ['LC'] },
      { title: 'Cara lain (opsional)', lists: ['LO'] },
    ],
    answer: 'Jawaban: <b>Danau C, D, dan E</b>.',
  },
  done: {
    seal: 'C · D · E',
    message:
      'Luasnya berlipat 7 tiap tahun, jadi 343 kali dalam 3 tahun. Danau C, D, dan E yang luas awalnya lebih dari 49 m².',
  },
  key: {
    answer: 'C, D, E',
    cardOk: [false, false, true, true, true],
    goldRows: ['c3', 'v1', 'r2'],
  },
  authorNotes: [
    'Modul baru (v1.43). Faktor × 7 dibaca dari grafik (10 → 70 → 490, dokumen a1–a4) dengan panah di gambar asli; pertanyaan cepat 490 : 70 dari dokumen.',
    'Jalur utama tanpa desimal (arahan pemilik): luas awal tepat 49 dikali 7 tiga kali menjadi 16.807 (= 49 × 343, dokumen c1–c3), lalu data tiap danau dibandingkan dengan batas itu.',
    'Pembagian dengan 343 (dokumen d1–d5) menjadi bagian opsional "Cara lain"; nilai dibulatkan. Hati-hati 7 × 3 = 21 dari Kesalahan umum dokumen.',
    'Asumsi dokumen dicatat: semua danau tumbuh dengan faktor 7 per tahun. Tanpa simbol ":" di baris papan.',
  ],
};

export default q10;
