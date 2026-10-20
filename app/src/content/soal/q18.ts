/**
 * SOAL 18 — Kerangka Kaca Patri (geometri bidang; tabel Pas/Tidak Pas, 3 baris).
 * Sumber: docs/pembahasan25.md "SOAL 18", docs/soal25.md no. 18, docs/ornamen_kaca_patri.png.
 * Kunci: 2 logam A Tidak Pas; 1 logam B Tidak Pas; 1 logam C Pas. Visual: adegan 3D pelengkap (door3d)
 * dengan padanan 2D (ribbon18); keduanya menyediakan sumber terbang l3-*.
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Stage } from '../../visuals/door3d-scene';
import { getSoal } from '../index';

/** Gambar asli soal (docs/ornamen_kaca_patri.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/ornamen_kaca_patri.png', import.meta.url).href;
const door = (stage: Stage): Visual => ({ kind: 'svg', scene: 'door3d', state: { stage } });
const hl = (cls: string, lvl: number, src: string, text: string): string =>
  `<span class="hl ${cls}" data-hl="${lvl}"><span data-src="${src}">${text}</span></span>`;

const q18: SoalContent = {
  meta: getSoal(18)!,
  sourceRef: 'docs/pembahasan25.md#soal-18',
  paper: {
    html: `<p>Pak Baskara akan membuat daun pintu dengan ornamen kaca patri berbentuk bulat di tengahnya.</p>
<figure class="soal-fig soal-fig-wide"><img src="${fig}" width="973" height="691" alt="Daun pintu dengan ornamen bulat; detail ornamen: lingkaran berisi persegi yang sudutnya menyentuh lingkaran, dibagi menjadi segitiga hijau dan kuning, empat kaca merah di antara persegi dan lingkaran; gambar kerangka berupa lingkaran, persegi, dan dua garis tengah." /></figure>
<p>Catatan pada gambar: ${hl('hl-red', 1, 's-merah', 'luas 1 potong kaca merah $=456\\ \\text{cm}^2$')}, gunakan pendekatan ${hl('hl-red', 1, 's-pi', '$\\pi=3{,}14$')}.</p>
<p>Kerangka ornamen terbuat dari logam yang berfungsi untuk menempelkan potongan-potongan kaca patri. Pak Baskara sedang memilih logam yang dapat digunakan untuk membuat kerangka ornamen kaca patri. Beliau ingin memilih yang pas. Maksud pas di sini adalah ${hl('hl-blue', 1, 's-pas', 'cukup untuk membuat kerangka dan sisanya tidak lebih dari 1 meter')}.</p>
<p>Berikut ini adalah jenis logam dan panjangnya yang dapat dipilih Pak Baskara untuk membuat kerangka ornamen.</p>
<table class="soal-table"><thead><tr><th scope="col">Jenis Logam</th><th scope="col">Logam A</th><th scope="col">Logam B</th><th scope="col">Logam C</th></tr></thead>
<tbody><tr data-src="s-logam"><th scope="row">Panjang Satuan</th><td><span class="hl hl-red" data-hl="1">4 m</span></td><td><span class="hl hl-red" data-hl="1">5 m</span></td><td><span class="hl hl-red" data-hl="1">6,5 m</span></td></tr></tbody></table>
<p>Tentukan apakah pilihan logam berikut ${hl('hl-gold', 2, 's-tanya', 'Pas atau Tidak Pas')}.</p>
<table class="soal-table"><thead><tr><th scope="col">Pilihan</th><th scope="col">Pas</th><th scope="col">Tidak Pas</th></tr></thead>
<tbody><tr><th scope="row">Membeli 2 buah logam A</th><td></td><td></td></tr><tr><th scope="row">Membeli 1 buah logam B</th><td></td><td></td></tr><tr><th scope="row">Membeli 1 buah logam C</th><td></td><td></td></tr></tbody></table>`,
    srcNames: ['s-merah', 's-pi', 's-pas', 's-logam', 's-tanya'],
  },
  visualSrc: ['l3-merah', 'l3-r', 'l3-ring', 'l3-side', 'l3-diam', 'l3-total'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Geometri bidang',
    titleLines: ['Pembahasan Soal', 'Kerangka <span class="accent">Kaca Patri</span>', 'Pas atau Tidak'],
    lede: 'Dari luas satu kaca merah kita cari ukuran ornamen, lalu hitung panjang logam untuk kerangkanya.',
    facts: [
      { dt: 'Luas 1 kaca merah', dd: '456 cm²' },
      { dt: 'π', dd: '3,14' },
      { dt: 'Syarat pas', dd: 'sisa ≤ 1 m' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Jari-jari lingkaran', d: 'r = 40 cm' },
    { t: 'Panjang kerangka', d: '≈ 637,5 cm' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Analisis pilihan', d: '3 kartu' },
    { t: 'Selesai', d: 'Hanya logam C yang pas' },
  ],
  pins: {
    pR: { id: 'pR', toks: [T('PR1', 'r'), O('PR2', '='), T('PR3', '40'), H('PR4', 'cm', 'tx')] },
    pTot: {
      id: 'pTot',
      toks: [H('PT1', 'kerangka', 'tx'), O('PT2', '\\approx'), T('PT3', '6{,}37'), H('PT4', 'm', 'tx')],
    },
    pPas: {
      id: 'pPas',
      toks: [
        H('PP1', 'pas', 'tx'),
        O('PP2', ':'),
        H('PP3', 'cukup, sisa', 'tx'),
        T('PP4', '\\le1\\ \\text{m}'),
      ],
    },
  },
  lists: {
    L1: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      {
        id: 'k2',
        toks: [
          H('k2a', '1 kaca merah', 'tx'),
          O('k2b', '='),
          T('k2c', '456\\ \\text{cm}^2', 'red', '@s-merah'),
        ],
        note: '4 kaca merah sama besar',
      },
      { id: 'k3', toks: [T('k3a', '\\pi'), O('k3b', '='), T('k3c', '3{,}14', 'red', '@s-pi')] },
      {
        id: 'k4',
        toks: [
          H('k4a', 'logam', 'tx'),
          O('k4b', ':'),
          T('k4c', 'A=4\\ \\text{m},\\ B=5\\ \\text{m},\\ C=6{,}5\\ \\text{m}', 'red', '@s-logam'),
        ],
      },
      {
        id: 'k5',
        toks: [H('k5a', 'Ditanya', 'lbl'), H('k5b', 'pas atau tidak pas', 'gold', '@s-tanya')],
      },
    ],
    L2: [
      { id: 'a1', toks: [H('a1a', 'luas lingkaran', 'tx'), O('a1b', '='), T('a1c', '\\pi r^2')] },
      {
        id: 'a2',
        toks: [
          H('a2a', 'luas persegi', 'tx'),
          O('a2b', '='),
          T('a2c', '\\dfrac12(2r)(2r)'),
          O('a2d', '='),
          T('a2e', '2r^2'),
        ],
        note: 'rumus layang-layang/belah ketupat',
      },
      {
        id: 'a3',
        toks: [H('a3a', '1 merah', 'tx'), O('a3b', '='), T('a3c', '\\dfrac{\\pi r^2-2r^2}{4}')],
        note: 'dibagi 4 kaca',
      },
      {
        id: 'a4',
        toks: [T('a4a', '456', 'red', '@l3-merah'), O('a4b', '='), T('a4c', '\\dfrac{(\\pi-2)r^2}{4}')],
      },
      {
        id: 'b1',
        toks: [
          T('b1a', '456', '', 'a4a'),
          T('b1b', '\\times4'),
          O('b1c', '='),
          T('b1d', '(3{,}14', 'red', '@s-pi'),
          T('b1e', '-2)\\,r^2'),
        ],
        note: 'kedua ruas dikali 4',
      },
      {
        id: 'b2',
        toks: [T('b2a', '1824'), O('b2b', '='), T('b2c', '1{,}14\\,r^2')],
        note: '$456\\cdot4=1824$',
        box: 'navy',
      },
      {
        id: 'b3',
        toks: [
          T('b3a', 'r^2'),
          O('b3b', '='),
          T('b3c', '\\dfrac{1824}{1{,}14}'),
          O('b3d', '='),
          T('b3e', '1600', 'blue'),
        ],
        note: '$1{,}14\\cdot1600=1824$',
        box: 'navy',
      },
      {
        id: 'b4',
        toks: [T('b4a', 'r'), O('b4b', '='), T('b4c', '40\\ \\text{cm}', 'blue', '@l3-r')],
        note: '$\\sqrt{1600}=40$',
        box: 'navy',
      },
    ],
    L3: [
      {
        id: 'c1',
        toks: [
          H('c1a', 'lingkaran', 'tx'),
          O('c1b', '='),
          T('c1c', '2\\pi r'),
          O('c1d', '='),
          T('c1e', '2(3{,}14)'),
          T('c1f', '(40)', '', 'PR3'),
          O('c1g', '='),
          T('c1h', '251{,}2\\ \\text{cm}', 'blue'),
        ],
        note: 'keliling',
      },
      {
        id: 'c2',
        toks: [
          H('c2a', 'sisi', 'tx'),
          O('c2b', '='),
          T('c2c', 'r\\sqrt2'),
          O('c2d', '='),
          T('c2e', '40', '', 'PR3'),
          T('c2f', '\\sqrt2'),
          O('c2g', '\\approx'),
          T('c2h', '56{,}57\\ \\text{cm}', 'blue'),
        ],
        note: 'sisi persegi; $\\sqrt2\\approx1{,}414$',
      },
      {
        id: 'c3',
        toks: [
          H('c3a', '4 sisi', 'tx'),
          O('c3b', '='),
          T('c3c', '4'),
          T('c3d', '(56{,}57)', '', 'c2h'),
          O('c3e', '\\approx'),
          T('c3f', '226{,}27\\ \\text{cm}', 'blue'),
        ],
      },
      {
        id: 'c4',
        toks: [
          H('c4a', '2 diagonal', 'tx'),
          O('c4b', '='),
          T('c4c', '2(2r)'),
          O('c4d', '='),
          T('c4e', '2(80)'),
          O('c4f', '='),
          T('c4g', '160\\ \\text{cm}', 'blue'),
        ],
        note: 'tiap diameter $80$ cm',
      },
      {
        id: 'c5',
        toks: [
          H('c5a', 'total', 'tx'),
          O('c5b', '='),
          T('c5c', '251{,}2', '', 'c1h'),
          O('c5d', '+'),
          T('c5e', '226{,}27', '', 'c3f'),
          O('c5f', '+'),
          T('c5g', '160', '', 'c4g'),
          O('c5h', '\\approx'),
          T('c5i', '637{,}5\\ \\text{cm}', 'blue', '@l3-total'),
        ],
        note: '$\\approx6{,}37$ m',
        box: 'navy',
      },
    ],
    L3b: [
      {
        id: 'd1',
        toks: [
          H('d1a', '2 logam A', 'tx'),
          O('d1b', '='),
          T('d1c', '8\\ \\text{m}', '', '@s-logam'),
          O('d1d', ':'),
          T('d1e', '8-'),
          T('d1f', '6{,}37', '', 'PT3'),
          O('d1g', '='),
          T('d1h', '1{,}63\\ \\text{m}'),
          O('d1i', '>'),
          T('d1j', '1\\ \\text{m}'),
        ],
        note: 'cukup, tetapi sisa lebih dari 1 m → <b class="k-red">tidak pas</b>',
      },
      {
        id: 'd2',
        toks: [
          H('d2a', '1 logam B', 'tx'),
          O('d2b', '='),
          T('d2c', '5\\ \\text{m}', '', '@s-logam'),
          O('d2d', ':'),
          T('d2e', '5'),
          O('d2f', '<'),
          T('d2g', '6{,}37', '', 'PT3'),
        ],
        note: 'tidak cukup → <b class="k-red">tidak pas</b>',
      },
      {
        id: 'd3',
        toks: [
          H('d3a', '1 logam C', 'tx'),
          O('d3b', '='),
          T('d3c', '6{,}5\\ \\text{m}', '', '@s-logam'),
          O('d3d', ':'),
          T('d3e', '6{,}5-'),
          T('d3f', '6{,}37', '', 'PT3'),
          O('d3g', '='),
          T('d3h', '0{,}13\\ \\text{m}', 'gold'),
          O('d3i', '\\le'),
          T('d3j', '1\\ \\text{m}'),
        ],
        note: 'cukup dan sisa kecil → <b class="k-gold">pas</b>',
        box: 'gold',
      },
    ],
    L5: [
      {
        id: 's1',
        toks: [
          T('s1a', '(1)', 'sp'),
          T('s1b', '\\text{sisa}\\approx1{,}63\\ \\text{m}>1\\ \\text{m}'),
          T('s1c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">TIDAK PAS</b>',
      },
      {
        id: 's2',
        toks: [T('s2a', '(2)', 'sp'), T('s2b', '5<6{,}37'), T('s2c', '\\;\\times', 'red')],
        note: '<b class="k-red">TIDAK PAS</b>',
      },
      {
        id: 's3',
        toks: [
          T('s3a', '(3)', 'sp'),
          T('s3b', '\\text{sisa}\\approx0{,}13\\ \\text{m}\\le1\\ \\text{m}'),
          T('s3c', '\\;\\checkmark', 'gold'),
        ],
        note: '<b class="k-gold">PAS</b>',
      },
      {
        id: 's4',
        toks: [H('s4a', 'Jawaban', 'lbl'), H('s4b', 'Tidak Pas · Tidak Pas · Pas', 'tx')],
        box: 'gold',
      },
    ],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', '\\text{kerangka}\\approx6{,}37\\ \\text{m}')],
        note: 'hanya 1 logam C (6,5 m) yang cukup dengan sisa kurang dari 1 meter',
        box: 'gold',
      },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Baca soal. Pas berarti logam <b>cukup</b> dan <b>sisanya tidak lebih dari 1 meter</b>.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 4, from: 0 },
    },
    {
      ch: 1,
      cap: 'Kita cari jari-jari lingkaran dari luas kaca merah, lalu panjang seluruh kerangka.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 5, from: 4 },
    },
    // ---- 2 · Jari-jari lingkaran ----
    {
      ch: 2,
      cap: 'Luas lingkaran dikurangi luas persegi dibagi 4 sama dengan luas satu kaca merah.',
      visual: door('ornament'),
      board: { title: 'Mencari jari-jari', list: 'L2', upTo: 4, from: 0 },
    },
    {
      ch: 2,
      cap: 'Kalikan kedua ruas dengan 4, lalu bagi dengan $1{,}14$ untuk mendapatkan $r^2$.',
      visual: door('unglass'),
      board: { title: 'Mencari jari-jari', list: 'L2', upTo: 7, from: 4 },
      ask: {
        before: 'b3',
        q: 'Dari $1824=1{,}14\\,r^2$, nilai $r^2$ adalah…',
        opts: [
          { tex: '1600', ok: true },
          {
            tex: '40',
            hint: '$40$ adalah $r$; di sini yang dicari baru $r^2$ ($40$ muncul setelah diakarkan).',
          },
          {
            tex: '2079',
            hint: 'Itu hasil kali $1824\\cdot1{,}14$. Untuk mencari $r^2$, bagi $1824$ dengan $1{,}14$.',
          },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Akar dari $1600$ adalah $40$. Jari-jari lingkaran ornamen $40$ cm.',
      visual: door('radius'),
      board: { title: 'Mencari jari-jari', list: 'L2', upTo: 8, from: 7 },
    },
    // ---- 3 · Panjang kerangka ----
    {
      ch: 3,
      cap: 'Hitung panjang tiga jenis garis: lingkaran, sisi persegi, dan dua diameter.',
      visual: door('unroll'),
      board: { title: 'Panjang kerangka', pins: ['pR'], list: 'L3', upTo: 4, from: 0 },
    },
    {
      ch: 3,
      cap: 'Jajarkan semua batang pada penggaris: totalnya sekitar $637{,}5$ cm.',
      visual: door('ruler'),
      board: { title: 'Panjang kerangka', pins: ['pR'], list: 'L3', upTo: 5, from: 4 },
    },
    {
      ch: 3,
      cap: 'Pas jika panjang logam $\\ge6{,}37$ m dan sisanya $\\le1$ m. Uji tiga pilihan.',
      visual: door('match'),
      board: { title: 'Menguji pilihan logam', pins: ['pTot', 'pPas'], list: 'L3b', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: '1 logam B hanya 5 m, lebih pendek dari kerangka. Tidak cukup.',
      visual: door('match'),
      board: { title: 'Menguji pilihan logam', pins: ['pTot', 'pPas'], list: 'L3b', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: '1 logam C cukup, dan sisanya hanya $0{,}13$ m.',
      visual: door('match'),
      board: { title: 'Menguji pilihan logam', pins: ['pTot', 'pPas'], list: 'L3b', upTo: 3, from: 2 },
    },
    // ---- 4 · Catatan lengkap ----
    {
      ch: 4,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 5 · Analisis pilihan (3 kartu) ----
    {
      ch: 5,
      cap: 'Kerangka butuh sekitar $6{,}37$ m. Sekarang periksa ketiga pilihan.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Analisis pilihan', pins: ['pTot', 'pPas'], list: 'L5', upTo: 0, from: 0 },
    },
    {
      ch: 5,
      cap: '(1) 2 logam A cukup, tetapi sisanya lebih dari 1 meter. <b class="k-red">Tidak Pas.</b>',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Analisis pilihan', pins: ['pTot', 'pPas'], list: 'L5', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: '(2) 1 logam B tidak cukup untuk kerangka. <b class="k-red">Tidak Pas.</b>',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Analisis pilihan', pins: ['pTot', 'pPas'], list: 'L5', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: '(3) 1 logam C cukup dan sisanya kecil (<b class="k-gold">Pas</b>). Pilih kesimpulannya di papan tulis.',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Analisis pilihan', pins: ['pTot', 'pPas'], list: 'L5', upTo: 4, from: 2 },
      ask: {
        before: 's4',
        q: 'Pilihan yang pas adalah…',
        col: true,
        win: 'Hanya <b>1 logam C</b>.',
        opts: [
          { txt: '2 buah logam A', hint: 'Cukup, tetapi sisanya $1{,}63$ m, lebih dari 1 meter.' },
          { txt: '1 buah logam B', hint: '$5<6{,}37$: tidak cukup untuk kerangka.' },
          { txt: '1 buah logam C', ok: true },
        ],
      },
    },
    // ---- 6 · Selesai ----
    {
      ch: 6,
      cap: '<span class="verdict"><span class="seal">Tidak · Tidak · Pas</span><span>Kerangka butuh sekitar <b>6,37 m</b>. Hanya 1 logam C (6,5 m) yang cukup dengan sisa kurang dari 1 meter.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 1, from: 1 },
    },
  ],
  cards: [
    {
      label: '1',
      statement: 'Membeli 2 buah logam A (8 m)',
      ok: false,
      formula: '\\text{sisa}\\approx1{,}63\\ \\text{m}>1\\ \\text{m}',
      why: 'Cukup, tetapi sisanya lebih dari 1 meter.',
    },
    {
      label: '2',
      statement: 'Membeli 1 buah logam B (5 m)',
      ok: false,
      formula: '5<6{,}37',
      why: 'Tidak cukup untuk kerangka.',
    },
    {
      label: '3',
      statement: 'Membeli 1 buah logam C (6,5 m)',
      ok: true,
      formula: '\\text{sisa}\\approx0{,}13\\ \\text{m}\\le1\\ \\text{m}',
      why: 'Cukup dan sisa kecil.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 18: Kerangka Kaca Patri',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Geometri bidang',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Jari-jari lingkaran',
        lists: ['L2'],
        why: 'Persegi yang titik sudutnya pada lingkaran memiliki diagonal $2r$, sehingga luasnya $\\frac12(2r)(2r)=2r^2$. Empat kaca merah adalah sisa lingkaran di luar persegi.',
      },
      {
        title: 'Panjang kerangka',
        lists: ['L3', 'L3b'],
        sketch: 'door3d',
        why: 'Kerangka = keliling lingkaran + empat sisi persegi + dua diagonal persegi (sekaligus diameter). Sisi persegi $r\\sqrt2$.',
      },
    ],
    answer: 'Jawaban: 2 logam A <b>Tidak Pas</b>; 1 logam B <b>Tidak Pas</b>; 1 logam C <b>Pas</b>.',
  },
  done: {
    seal: 'Tidak · Tidak · Pas',
    message:
      'Kerangka butuh sekitar <b>6,37 m</b>. Hanya 1 logam C (6,5 m) yang cukup dengan sisa kurang dari 1 meter.',
  },
  key: {
    answer: 'Tidak Pas, Tidak Pas, Pas',
    cardOk: [false, false, true],
    goldRows: ['d3', 's4', 'r1'],
  },
  authorNotes: [
    'Kotak b4 ($r=40$ cm) memakai navy, bukan emas seperti tabel dokumen: emas hanya untuk jawaban (PRD). Dokumen diperbarui serempak.',
    'Sumber terbang 456 (a4) dan r (b4) memakai label adegan l3-merah/l3-r (3D dan padanan 2D); 637,5 (c5) dari l3-total.',
    'Bagian 2: langkah 2.2 dipecah: b1–b3 (pertanyaan sebelum b3) lalu b4; pop-up 2.2 dan 2.3 disusun dari keterangan baris.',
    'Bagian 3: pin r, total, dan syarat pas; langkah penggaris (c5) dan satu langkah per pilihan logam (d1–d3) dengan pop-up dari kolom alasan kartu.',
    'Bagian 5: pop-up per kartu dari kolom alasan; papan ringkasan s1–s4 dan pertanyaan kesimpulan disusun dari kartu.',
  ],
};

export default q18;
