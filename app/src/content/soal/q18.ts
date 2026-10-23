/**
 * SOAL 18 — Kerangka Kaca Patri (geometri bidang; tabel Pas/Tidak Pas, 3 baris).
 * Sumber: docs/pembahasan25.md "SOAL 18", docs/soal25.md no. 18, docs/ornamen_kaca_patri.png.
 * Kunci: 2 logam A Tidak Pas; 1 logam B Tidak Pas; 1 logam C Pas.
 * Alur gaya mengajar Pak Penta (revisi 22 Okt 2026, dicatat di dokumen): ornamen = tumpukan lingkaran merah dan
 * persegi miring (4 segitiga) → angkat persegi: 4 merah = lingkaran − persegi → persegi = 4 segitiga berkaki r
 * → r = 40 cm (disimpan ke catatan) → lepas kaca: kerangka = lingkaran + 2 diameter + 4 sisi, tiap bagian
 * disorot dan disimpan → jajarkan pada penggaris (≈ 637,5 cm) → cara cepat "zona pas" 637,5–737,5 cm
 * → tiap pilihan disalin dari soal, diubah ke cm, dicek terhadap zona.
 * Visual: pintu 3D pelengkap (door3d, PRD §9.6) hanya di Bagian 1; selebihnya adegan 2D orn18.
 * Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Step, Visual } from '../../engine/types';
import type { Stage } from '../../visuals/door3d-scene';
import type { OrnState } from '../../visuals/orn18';
import { getSoal } from '../index';

/** Gambar asli soal (docs/ornamen_kaca_patri.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/ornamen_kaca_patri.png', import.meta.url).href;
const door = (stage: Stage): Visual => ({ kind: 'svg', scene: 'door3d', state: { stage } });
const orn = (state: OrnState): Visual => ({ kind: 'svg', scene: 'orn18', state });
const hl = (cls: string, lvl: number, src: string, text: string): string =>
  `<span class="hl ${cls}" data-hl="${lvl}"><span data-src="${src}">${text}</span></span>`;
/** catatan (deret pin) yang terisi bertahap */
const N1 = ['pR'];
const N2 = ['pR', 'pL'];
const N3 = ['pR', 'pL', 'pD'];
const N4 = ['pR', 'pL', 'pD', 'pS'];
const N5 = ['pR', 'pL', 'pD', 'pS', 'pK'];
const N6 = [...N5, 'pZ'];
/** Ketiga pilihan (docs/soal25.md no. 18): kertas soal dan kutipan di papan memakai teks yang sama. */
const OPTS = ['Membeli 2 buah logam A', 'Membeli 1 buah logam B', 'Membeli 1 buah logam C'];
const quote = (n: number): Row => ({
  id: `c${n}`,
  toks: [T(`c${n}a`, `(${n})`, 'sp'), H(`c${n}b`, OPTS[n - 1]!, 'q', `@s-o${n}`)],
});
/** Langkah pembuka tiap pilihan: soal tampil lagi, pilihan ke-n disorot, lalu teksnya disalin. */
const open4 = (n: number, cap: string): Step => ({
  ch: 4,
  cap,
  visual: { kind: 'soal', hl: 0, focus: `s-o${n}` },
  board: { title: `Pilihan (${n})`, pins: N6, list: `L4${n}`, upTo: 1, from: 0 },
});
/** Langkah analisis pilihan ke-n: batang logam pada penggaris dibandingkan dengan zona pas. */
const check4 = (n: 1 | 2 | 3, cap: string): Step => ({
  ch: 4,
  cap,
  visual: orn({ ruler: n }),
  board: { title: `Pilihan (${n})`, pins: N6, list: `L4${n}`, upTo: 3, from: 1 },
});

const q18: SoalContent = {
  meta: getSoal(18)!,
  sourceRef: 'docs/pembahasan25.md#soal-18',
  layout: 'full',
  paper: {
    html: `<p>Pak Baskara akan membuat daun pintu dengan ornamen kaca patri berbentuk bulat di tengahnya.</p>
<figure class="soal-fig soal-fig-wide"><img src="${fig}" width="973" height="691" alt="Daun pintu dengan ornamen bulat; detail ornamen: lingkaran berisi persegi yang sudutnya menyentuh lingkaran, dibagi menjadi segitiga hijau dan kuning, empat kaca merah di antara persegi dan lingkaran; gambar kerangka berupa lingkaran, persegi, dan dua garis tengah." /></figure>
<p>Catatan pada gambar: ${hl('hl-red', 1, 's-merah', 'luas 1 potong kaca merah $=456\\ \\text{cm}^2$')}, gunakan pendekatan ${hl('hl-red', 1, 's-pi', '$\\pi=3{,}14$')}.</p>
<p>Kerangka ornamen terbuat dari logam yang berfungsi untuk menempelkan potongan-potongan kaca patri. Pak Baskara sedang memilih logam yang dapat digunakan untuk membuat kerangka ornamen kaca patri. Beliau ingin memilih yang pas. Maksud pas di sini adalah ${hl('hl-blue', 2, 's-pas', 'cukup untuk membuat kerangka dan sisanya tidak lebih dari 1 meter')}.</p>
<p>Berikut ini adalah jenis logam dan panjangnya yang dapat dipilih Pak Baskara untuk membuat kerangka ornamen.</p>
<table class="soal-table"><thead><tr><th scope="col">Jenis Logam</th><th scope="col">Logam A</th><th scope="col">Logam B</th><th scope="col">Logam C</th></tr></thead>
<tbody><tr data-src="s-logam"><th scope="row">Panjang Satuan</th><td><span class="hl hl-red" data-hl="2">4 m</span></td><td><span class="hl hl-red" data-hl="2">5 m</span></td><td><span class="hl hl-red" data-hl="2">6,5 m</span></td></tr></tbody></table>
<p>Tentukan apakah pilihan logam berikut ${hl('hl-gold', 2, 's-tanya', 'Pas atau Tidak Pas')}.</p>
<table class="soal-table"><thead><tr><th scope="col">Pilihan</th><th scope="col">Pas</th><th scope="col">Tidak Pas</th></tr></thead>
<tbody>${OPTS.map((t, i) => `<tr><th scope="row"><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">${t}</span></span></th><td></td><td></td></tr>`).join('')}</tbody></table>`,
    srcNames: ['s-merah', 's-pi', 's-pas', 's-logam', 's-tanya', 's-o1', 's-o2', 's-o3'],
  },
  visualSrc: [
    'l3-merah',
    'l3-r',
    'l3-ring',
    'l3-side',
    'l3-diam',
    'l3-total',
    'g-456',
    'g-r40',
    'g-80',
    'g-40a',
    'g-40b',
  ],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Geometri bidang',
    titleLines: ['Pembahasan Soal', 'Kerangka <span class="accent">Kaca Patri</span>', 'Pas atau Tidak'],
    lede: 'Dari luas satu kaca merah kita cari jari-jari ornamen, lalu panjang logam untuk kerangkanya.',
    facts: [
      { dt: 'Luas 1 kaca merah', dd: '456 cm²' },
      { dt: 'π', dd: '3,14' },
      { dt: 'Syarat pas', dd: 'sisa ≤ 1 m' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Ornamen dan syarat pas' },
    { t: 'Jari-jari lingkaran', d: 'r = 40 cm' },
    { t: 'Panjang kerangka', d: '≈ 637,5 cm' },
    { t: 'Uji ketiga pilihan', d: 'Zona pas' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '3 kartu' },
    { t: 'Selesai', d: 'Hanya logam C yang pas' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pR: { id: 'pR', toks: [T('PR1', 'r', '', 'a6a'), O('PR2', '='), T('PR3', '40\\ \\text{cm}', '', 'a6e')] },
    pL: {
      id: 'pL',
      toks: [H('PL1', 'lingkaran', 'tx', 'f2a'), O('PL2', '='), T('PL3', '251{,}2', '', 'f2e')],
    },
    pD: {
      id: 'pD',
      toks: [H('PD1', '2 diameter', 'tx', 'f3a'), O('PD2', '='), T('PD3', '160', '', 'f3e')],
    },
    pS: {
      id: 'pS',
      toks: [H('PS1', '4 sisi', 'tx', 'f5a'), O('PS2', '='), T('PS3', '226{,}27', '', 'f5e')],
    },
    pK: {
      id: 'pK',
      toks: [H('PK1', 'kerangka', 'tx'), O('PK2', '\\approx'), T('PK3', '637{,}5\\ \\text{cm}', '', 'f6i')],
    },
    pZ: {
      id: 'pZ',
      toks: [
        H('PZ1', 'zona pas', 'tx', 'z2a'),
        O('PZ2', '='),
        T('PZ3', '637{,}5\\text{–}737{,}5\\ \\text{cm}', '', 'z2e'),
      ],
    },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [
          H('k1a', '1 kaca merah', 'tx'),
          O('k1b', '='),
          T('k1c', '456\\ \\text{cm}^2', 'red', '@s-merah'),
        ],
        note: '4 kaca merah sama besar',
      },
      { id: 'k2', toks: [T('k2a', '\\pi'), O('k2b', '='), T('k2c', '3{,}14', 'red', '@s-pi')] },
      {
        id: 'k3',
        toks: [H('k3a', 'kaca merah', 'tx'), O('k3b', '='), H('k3c', 'sisa lingkaran di luar persegi', 'tx')],
        note: 'persegi miring = 4 segitiga hijau dan kuning',
      },
      {
        id: 'k4',
        toks: [
          H('k4a', 'pas', 'tx'),
          O('k4b', '\\Rightarrow'),
          H('k4c', 'cukup, dan sisa ≤ 1 m', 'blue', '@s-pas'),
        ],
      },
      {
        id: 'k5',
        toks: [
          H('k5a', 'logam', 'tx'),
          O('k5b', '\\to'),
          T('k5c', 'A=4\\ \\text{m},\\ B=5\\ \\text{m},\\ C=6{,}5\\ \\text{m}', '', '@s-logam'),
        ],
      },
      { id: 'k6', toks: [H('k6a', 'Ditanya', 'lbl'), H('k6b', 'pas atau tidak pas', 'gold', '@s-tanya')] },
    ],
    LR: [
      {
        id: 'a1',
        toks: [H('a1a', '4 merah', 'tx'), O('a1b', '='), H('a1c', 'lingkaran − persegi', 'tx')],
        note: 'persegi diangkat, tersisa empat kaca merah',
      },
      {
        id: 'a2',
        toks: [
          H('a2a', 'persegi', 'tx'),
          O('a2b', '='),
          T('a2c', '4\\times\\tfrac12\\times r\\times r'),
          O('a2d', '='),
          T('a2e', '2r^2', 'blue'),
        ],
        note: '4 segitiga siku-siku, kaki-kakinya jari-jari $r$',
      },
      {
        id: 'a3',
        toks: [
          T('a3a', '4\\times'),
          T('a3b', '456', 'red', '@g-456'),
          O('a3c', '='),
          T('a3d', '3{,}14\\,r^2-2r^2'),
        ],
        note: 'lingkaran $\\pi r^2$ dikurangi persegi $2r^2$',
      },
      {
        id: 'a4',
        toks: [T('a4a', '1824'), O('a4b', '='), T('a4c', '1{,}14\\,r^2')],
        note: '$4\\times456=1824$; $3{,}14-2=1{,}14$',
      },
      {
        id: 'a5',
        toks: [T('a5a', 'r^2'), O('a5b', '='), T('a5c', '1824:1{,}14'), O('a5d', '='), T('a5e', '1600')],
        note: 'kedua ruas dibagi $1{,}14$',
      },
      {
        id: 'a6',
        toks: [
          T('a6a', 'r'),
          O('a6b', '='),
          T('a6c', '\\sqrt{1600}'),
          O('a6d', '='),
          T('a6e', '40\\ \\text{cm}', 'blue'),
        ],
        note: 'simpan ke catatan',
        box: 'navy',
      },
    ],
    LK: [
      {
        id: 'f1',
        toks: [H('f1a', 'kerangka', 'tx'), O('f1b', '='), H('f1c', 'lingkaran + 2 diameter + 4 sisi', 'tx')],
        note: 'kaca dilepas, tersisa garis logam',
      },
      {
        id: 'f2',
        toks: [
          H('f2a', 'lingkaran', 'tx'),
          O('f2b', '='),
          T('f2c', '2\\times3{,}14\\times'),
          T('f2d', '40', 'blue', 'PR3'),
          O('f2f', '='),
          T('f2e', '251{,}2', 'blue'),
        ],
        note: 'keliling $2\\pi r$, $r$ dari catatan',
      },
      {
        id: 'f3',
        toks: [
          H('f3a', '2 diameter', 'tx'),
          O('f3b', '='),
          T('f3c', '2\\times'),
          T('f3d', '80', 'blue', '@g-80'),
          O('f3f', '='),
          T('f3e', '160', 'blue'),
        ],
        note: 'diameter $=2r=80$',
      },
      {
        id: 'f4',
        toks: [
          H('f4a', 'sisi', 'tx'),
          O('f4b', '='),
          T('f4c', '\\sqrt{40^2+40^2}', '', '@g-40a'),
          O('f4d', '='),
          T('f4e', '40\\sqrt2'),
          O('f4f', '\\approx'),
          T('f4g', '56{,}57'),
        ],
        note: 'Pythagoras, kaki $40$ dan $40$; $\\sqrt2\\approx1{,}414$',
      },
      {
        id: 'f5',
        toks: [
          H('f5a', '4 sisi', 'tx'),
          O('f5b', '='),
          T('f5c', '4\\times56{,}57'),
          O('f5d', '\\approx'),
          T('f5e', '226{,}27', 'blue'),
        ],
      },
    ],
    // langkah 3.5: papan baru, semua angka diambil dari catatan
    LT: [
      {
        id: 'f6',
        toks: [
          T('f6c', '251{,}2', '', 'PL3'),
          O('f6d', '+'),
          T('f6e', '160', '', 'PD3'),
          O('f6f', '+'),
          T('f6g', '226{,}27', '', 'PS3'),
          O('f6h', '\\approx'),
          T('f6i', '637{,}5', 'blue'),
        ],
        note: 'kerangka sekitar $637{,}5$ cm $=6{,}37$ m; simpan ke catatan',
        box: 'navy',
      },
    ],
    LZ: [
      {
        id: 'z1',
        toks: [
          H('z1a', 'cukup', 'tx'),
          O('z1b', '\\Rightarrow'),
          T('z1c', '\\text{logam}\\ge'),
          T('z1d', '637{,}5\\ \\text{cm}', '', 'PK3'),
        ],
      },
      {
        id: 'z2',
        toks: [
          H('z2a', 'sisa ≤ 1 m', 'tx'),
          O('z2b', '\\Rightarrow'),
          T('z2c', '\\text{logam}\\le637{,}5+100'),
          O('z2d', '='),
          T('z2e', '737{,}5\\ \\text{cm}', 'blue'),
        ],
        note: 'zona pas $637{,}5$–$737{,}5$ cm; simpan ke catatan',
        box: 'navy',
      },
    ],
    L41: [
      quote(1),
      {
        id: 'o1',
        toks: [T('o1a', '2\\times4\\ \\text{m}=8\\ \\text{m}=800\\ \\text{cm}')],
        note: 'ubah ke cm dulu',
      },
      {
        id: 'o1b',
        toks: [T('o1c', '800'), O('o1d', '>'), T('o1f', '737{,}5', '', 'PZ3')],
        note: 'sisa $800-637{,}5=162{,}5$ cm $\\approx1{,}63$ m, lebih dari 1 m → <b class="k-red">Tidak Pas</b>',
      },
    ],
    L42: [
      quote(2),
      { id: 'o2', toks: [T('o2a', '1\\times5\\ \\text{m}=500\\ \\text{cm}')], note: 'ubah ke cm dulu' },
      {
        id: 'o2b',
        toks: [T('o2c', '500'), O('o2d', '<'), T('o2e', '637{,}5', '', 'PK3')],
        note: 'tidak cukup untuk kerangka → <b class="k-red">Tidak Pas</b>',
      },
    ],
    L43: [
      quote(3),
      { id: 'o3', toks: [T('o3a', '1\\times6{,}5\\ \\text{m}=650\\ \\text{cm}')], note: 'ubah ke cm dulu' },
      {
        id: 'o3b',
        toks: [
          T('o3c', '637{,}5', '', 'PZ3'),
          O('o3d', '\\le'),
          T('o3e', '650', 'gold'),
          O('o3f', '\\le'),
          T('o3g', '737{,}5', '', 'PZ3'),
        ],
        note: 'masuk zona pas; sisa $650-637{,}5=12{,}5$ cm $\\approx0{,}13$ m → <b class="k-gold">Pas</b>',
        box: 'gold',
      },
    ],
    L6: [
      {
        id: 's4',
        toks: [H('s4a', 'Jawaban', 'lbl'), H('s4b', 'Tidak Pas · Tidak Pas · Pas', 'tx')],
        box: 'gold',
      },
    ],
    LS: [
      {
        id: 'r1',
        toks: [T('r1a', '\\text{kerangka}\\approx637{,}5\\ \\text{cm}\\approx6{,}37\\ \\text{m}')],
        note: 'zona pas $637{,}5$–$737{,}5$ cm',
        box: 'navy',
      },
      {
        id: 'r2',
        toks: [H('r2a', 'Jawaban', 'lbl'), H('r2b', 'hanya 1 logam C yang pas', 'tx')],
        box: 'gold',
      },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan ornamen bulat di tengah pintu. Yang diketahui hanya luas satu kaca merah, $456$ cm², dan $\\pi=3{,}14$.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 0 },
    },
    {
      ch: 1,
      cap: 'Ini pintunya. Ornamen bulat di tengah tersusun dari potongan kaca merah, hijau, dan kuning yang ditempel pada kerangka logam.',
      visual: door('ornament'),
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 2 },
    },
    {
      ch: 1,
      cap: 'Tahukah kalian? Ornamen ini tumpukan dua bangun: lingkaran merah, lalu di atasnya persegi miring dari 4 segitiga yang sudutnya menyentuh lingkaran.',
      visual: orn({ build: true }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 3, from: 2 },
    },
    {
      ch: 1,
      cap: 'Yang ditanya: logam mana yang pas. Pas artinya cukup untuk kerangka dan sisanya tidak lebih dari 1 meter.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 6, from: 3 },
    },
    // ---- 2 · Jari-jari lingkaran ----
    {
      ch: 2,
      cap: 'Angkat persegi di tengah: yang tersisa empat kaca merah. Jadi 4 kaca merah = lingkaran dikurangi persegi.',
      visual: orn({ lift: true }),
      board: { title: 'Mencari jari-jari', list: 'LR', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Persegi terdiri dari 4 segitiga siku-siku yang kedua kakinya jari-jari $r$. Jadi luas persegi $=4\\times\\frac12\\times r\\times r=2r^2$.',
      visual: orn({ tri: true }),
      board: { title: 'Mencari jari-jari', list: 'LR', upTo: 2, from: 1 },
    },
    {
      ch: 2,
      cap: 'Masukkan angkanya: empat kaca merah $4\\times456=1824$, dan $3{,}14r^2-2r^2=1{,}14r^2$.',
      visual: orn({ v456: true }),
      board: { title: 'Mencari jari-jari', list: 'LR', upTo: 4, from: 2 },
    },
    {
      ch: 2,
      cap: 'Bagi dengan $1{,}14$: $r^2=1600$, jadi $r=40$ cm. Simpan ke catatan, nanti dipakai lagi.',
      visual: orn({ r40: true }),
      board: { title: 'Mencari jari-jari', list: 'LR', upTo: 6, from: 4, save: ['pR'] },
      ask: {
        before: 'a5',
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
    // ---- 3 · Panjang kerangka ----
    {
      ch: 3,
      cap: 'Sekarang lepas semua kacanya: tersisa kerangka logam. Ada tiga jenis garis, yaitu lingkaran, dua diameter, dan empat sisi persegi.',
      visual: orn({ frame: true }),
      board: { title: 'Panjang kerangka', pins: N1, list: 'LK', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Lingkaran dulu: kelilingnya $2\\pi r$ dengan $r=40$ dari catatan, yaitu $2\\times3{,}14\\times40=251{,}2$ cm. Simpan ke catatan.',
      visual: orn({ frame: true, hl: 'ring', r40: true }),
      board: { title: 'Panjang kerangka', pins: N1, list: 'LK', upTo: 2, from: 1, save: ['pL'] },
    },
    {
      ch: 3,
      cap: 'Dua garis tengah adalah diameter, masing-masing $2r=80$ cm. Jadi $2\\times80=160$ cm, simpan juga.',
      visual: orn({ frame: true, hl: 'diam' }),
      board: { title: 'Panjang kerangka', pins: N2, list: 'LK', upTo: 3, from: 2, save: ['pD'] },
    },
    {
      ch: 3,
      cap: 'Sisi persegi adalah sisi miring segitiga siku-siku berkaki $40$ dan $40$. Pythagoras: $40\\sqrt2\\approx56{,}57$ cm, jadi 4 sisi $\\approx226{,}27$ cm.',
      visual: orn({ frame: true, hl: 'side' }),
      board: { title: 'Panjang kerangka', pins: N3, list: 'LK', upTo: 5, from: 3, save: ['pS'] },
      ask: {
        before: 'f4',
        q: 'Sisi persegi adalah sisi miring segitiga berkaki $40$ dan $40$. Panjangnya…',
        opts: [
          { tex: '40\\sqrt2\\approx56{,}57', ok: true },
          { tex: '80', hint: '$80$ adalah diameter (garis tengah), bukan sisi persegi.' },
          { tex: '40', hint: '$40$ adalah kaki segitiga (jari-jari). Sisi persegi adalah sisi miringnya.' },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Jajarkan semua batang kerangka pada penggaris dan ambil angkanya dari catatan: totalnya sekitar $637{,}5$ cm, atau $6{,}37$ m.',
      visual: orn({ ruler: 'parts' }),
      board: { title: 'Total kerangka', pins: N4, list: 'LT', upTo: 1, from: 0, save: ['pK'] },
    },
    // ---- 4 · Uji ketiga pilihan ----
    {
      ch: 4,
      cap: 'Cara cepat: pas berarti logam paling sedikit $637{,}5$ cm dan paling banyak $637{,}5+100=737{,}5$ cm. Cukup cek apakah logam masuk zona ini.',
      visual: orn({ ruler: 'zone' }),
      board: { title: 'Zona pas', pins: N5, list: 'LZ', upTo: 2, from: 0, save: ['pZ'] },
    },
    open4(1, 'Kita cek pilihan (1) dulu. Salin ke papan: membeli 2 buah logam A.'),
    check4(
      1,
      'Ubah ke cm: $2\\times4$ m $=800$ cm. Cukup, tetapi melewati zona karena sisanya $162{,}5$ cm, jadi (1) <b class="k-red">Tidak Pas</b>.',
    ),
    open4(2, 'Pilihan (2): membeli 1 buah logam B.'),
    check4(
      2,
      'Logam B hanya $500$ cm, belum sampai $637{,}5$ cm. Tidak cukup, jadi (2) <b class="k-red">Tidak Pas</b>.',
    ),
    open4(3, 'Pilihan (3): membeli 1 buah logam C.'),
    check4(
      3,
      'Logam C $650$ cm masuk zona $637{,}5$–$737{,}5$ cm, sisanya hanya $12{,}5$ cm. Jadi (3) <b class="k-gold">Pas</b>.',
    ),
    // ---- 5 · Catatan lengkap ----
    {
      ch: 5,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 6 · Cocokkan pilihan ----
    {
      ch: 6,
      cap: 'Cocokkan dengan ketiga pilihan: hanya logam C yang pas. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Cocokkan pilihan', pins: N6, list: 'L6', upTo: 1, from: 0 },
      ask: {
        before: 's4',
        q: 'Pilihan yang pas adalah…',
        col: true,
        win: 'Hanya <b>1 buah logam C</b>.',
        opts: [
          { txt: '2 buah logam A', hint: '$800$ cm melewati $737{,}5$ cm: sisanya lebih dari 1 meter.' },
          { txt: '1 buah logam B', hint: '$500$ cm belum sampai $637{,}5$ cm: tidak cukup.' },
          { txt: '1 buah logam C', ok: true },
        ],
      },
    },
    // ---- 7 · Selesai ----
    {
      ch: 7,
      cap: '<span class="verdict"><span class="seal">Tidak · Tidak · Pas</span><span>Kerangka butuh sekitar <b>6,37 m</b>. Hanya 1 logam C (6,5 m) yang cukup dengan sisa kurang dari 1 meter.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LS', upTo: 2, from: 2 },
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
        lists: ['LR'],
        why: 'Ornamen = lingkaran merah ditumpuk persegi miring. Persegi = 4 segitiga siku-siku berkaki $r$, luasnya $2r^2$; empat kaca merah = lingkaran − persegi.',
      },
      {
        title: 'Panjang kerangka',
        lists: ['LK', 'LT'],
        sketch: 'orn18',
        why: 'Kerangka = keliling lingkaran + dua diameter + empat sisi persegi (sisi miring segitiga berkaki $r$, yaitu $r\\sqrt2$).',
      },
      {
        title: 'Uji ketiga pilihan',
        lists: ['LZ', 'L41', 'L42', 'L43'],
        why: 'Cara cepat: pas ⇔ panjang logam di zona $637{,}5$–$737{,}5$ cm. Ubah meter ke cm sebelum membandingkan.',
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
    goldRows: ['o3b', 's4', 'r2'],
  },
  authorNotes: [
    'Alur ditulis ulang dengan gaya mengajar Pak Penta (22 Okt 2026, dicatat di dokumen): ornamen sebagai tumpukan, persegi diangkat, persegi = 4 segitiga berkaki r, kerangka per bagian dengan catatan, penggaris, lalu zona pas.',
    'Luas persegi lewat 4 segitiga siku-siku berkaki r (setara dengan ½ · 2r · 2r di dokumen); sisi persegi lewat Pythagoras (setara dengan r√2 di dokumen).',
    'Cara cepat "zona pas" 637,5–737,5 cm diturunkan dari Pemeriksaan hasil dokumen; sisa 162,5 cm ≈ 1,63 m dan 12,5 cm ≈ 0,13 m konsisten dengan kartu.',
    'Pertanyaan cepat baru: panjang sisi persegi (40√2), dari "Kesalahan umum" dokumen.',
  ],
};

export default q18;
