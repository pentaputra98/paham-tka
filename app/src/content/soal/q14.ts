/**
 * SOAL 14 — Kereta Api dan Koordinat 3D (panjang vektor, perbandingan waktu; multi-jawaban). Kunci: BC, CD, DE.
 * Sumber: docs/pembahasan25.md "SOAL 14", docs/soal25.md no. 14, docs/jarak_kereta_api.png.
 * Alur revisi pemilik (v1.49, dicatat di dokumen):
 *  - pahami: kecepatan konstan, lintasan lurus; A(2, 3, 5), E(11, 6, 8); waktu 5, 3, 2, 3 menit; ditanya jarak < 3,5 km;
 *  - panjang vektor AE: AE = E − A = (9, 3, 3); panjangnya akar dari jumlah kuadrat komponennya, √99 (tanpa balok);
 *    √99 mendekati √100 = 10, jadi AE dianggap 10 km supaya mudah dihitung;
 *  - perbandingan waktu: total A ke E 5 + 3 + 2 + 3 = 13 menit, jarak pasangan = t/13 × 10; CE = 2 + 3 = 5 menit;
 *  - jarak tiap pasangan: t/13 diubah ke desimal (5 ÷ 13 ≈ 0,38), lalu dikali 10 (koma bergeser satu tempat):
 *    AB ≈ 3,8, BC = DE ≈ 2,3, CD ≈ 1,5, CE ≈ 3,8 km;
 *  - analisis: kurang dari 3,5 km → BC, CD, DE.
 * Tanpa simbol ":" di baris papan (pembagian ditulis dengan ÷). Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Pair, Rail14State } from '../../visuals/rail14';
import { getSoal } from '../index';

/** Gambar asli soal (docs/jarak_kereta_api.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/jarak_kereta_api.png', import.meta.url).href;
const rail = (state: Rail14State): Visual => ({ kind: 'svg', scene: 'rail14', state });
const PAIRS = ['AB', 'BC', 'CD', 'DE', 'CE'];
const BAR: Rail14State = { view: 'bar', n: 4, tot: true, ce: true };
/** lintasan dengan jarak yang sudah dihitung dan panel perhitungan pasangan p */
const pair = (p: Pair, k: number, km: Pair[]): Visual => rail({ ...BAR, km, cur: { p, k } });
const ALL: Pair[] = ['AB', 'BC', 'DE', 'CD', 'CE'];
const AE = '\\overrightarrow{AE}';

const q14: SoalContent = {
  meta: getSoal(14)!,
  sourceRef: 'docs/pembahasan25.md#soal-14',
  layout: 'full',
  paper: {
    html: `<p>Sebuah kereta api sedang melaju dengan <span class="hl hl-blue" data-hl="1"><span data-src="s-konstan">kecepatan konstan</span></span> pada sebuah <span class="hl hl-blue" data-hl="1"><span data-src="s-lurus">lintasan lurus</span></span> dari stasiun A sampai stasiun E. Diketahui koordinat stasiun A dan E (dalam km) berturut-turut adalah <span class="hl hl-red" data-hl="1"><span data-src="s-A">$(2,3,5)$</span></span> dan <span class="hl hl-red" data-hl="1"><span data-src="s-E">$(11,6,8)$</span></span>.</p>
<p>Perhatikan gambar berikut yang menggambarkan waktu tempuh (dalam menit) kereta tersebut antar stasiun.</p>
<figure class="soal-fig soal-fig-wide"><img src="${fig}" width="1185" height="370" alt="Kereta melaju dari A ke E. Waktu tempuh A–B 5 menit, B–C 3 menit, C–D 2 menit, D–E 3 menit." /></figure>
<p>Manakah pasangan stasiun yang <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">jaraknya kurang dari 3,5 km</span></span>? Pilih semua jawaban yang benar! Jawaban benar lebih dari satu.</p>
<ul class="checks">
${PAIRS.map((p, i) => `<li><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">${p}</span></span></li>`).join('\n')}
</ul>`,
    srcNames: ['s-konstan', 's-lurus', 's-A', 's-E', 's-tanya', 's-o1', 's-o2', 's-o3', 's-o4', 's-o5'],
  },
  visualSrc: ['t-AB', 't-BC', 't-CD', 't-DE'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Vektor di ruang',
    titleLines: ['Pembahasan Soal', 'Jarak <span class="accent">Stasiun</span>', 'Kereta Api'],
    lede: 'Kereta melaju lurus dan konstan dari A ke E. Dari koordinat A dan E serta waktu antarstasiun, kita cari pasangan stasiun yang jaraknya kurang dari 3,5 km.',
    facts: [
      { dt: 'Waktu A–E', dd: '13 menit' },
      { dt: 'Ambang', dd: '3,5 km' },
      { dt: 'Dicari', dd: 'pasangan < 3,5 km' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Koordinat dan waktu' },
    { t: 'Panjang vektor AE', d: '√99, dianggap 10 km' },
    { t: 'Perbandingan waktu', d: 'Total 13 menit' },
    { t: 'Jarak tiap pasangan', d: 'Desimal, koma bergeser' },
    { t: 'Analisis', d: 'Kurang dari 3,5 km' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'BC, CD, DE' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pAE: { id: 'pAE', toks: [T('PAE1', '|AE|\\approx10\\text{ km}', '', 'a5c')] },
    pJ: { id: 'pJ', toks: [T('PJ1', '\\text{jarak}=\\dfrac{t}{13}\\times10', '', 'b2c')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [
          H('k1a', 'kecepatan konstan', 'tx', '@s-konstan'),
          O('k1b', ','),
          H('k1c', 'lintasan lurus', 'tx', '@s-lurus'),
        ],
        note: 'jarak sebanding dengan waktu tempuh',
      },
      {
        id: 'k2',
        toks: [T('k2a', 'A(2,3,5)', 'red', '@s-A'), O('k2b', ','), T('k2c', 'E(11,6,8)', 'red', '@s-E')],
        note: 'koordinat dalam km',
      },
      {
        id: 'k3',
        toks: [
          T('k3a', 'AB=5', '', '@t-AB'),
          O('k3b', ','),
          T('k3c', 'BC=3', '', '@t-BC'),
          O('k3d', ','),
          T('k3e', 'CD=2', '', '@t-CD'),
          O('k3f', ','),
          T('k3g', 'DE=3', '', '@t-DE'),
        ],
        note: 'waktu tempuh dalam menit, dari gambar',
      },
      {
        id: 'k4',
        toks: [
          H('k4a', 'Ditanya', 'lbl'),
          H('k4b', 'pasangan dengan jarak', 'tx'),
          T('k4c', '<3{,}5\\text{ km}', 'gold', '@s-tanya'),
        ],
      },
    ],
    LA: [
      {
        id: 'a1',
        toks: [T('a1a', AE), O('a1b', '='), T('a1c', 'E-A', '', '@s-E')],
        note: 'vektor posisi, ujung dikurangi pangkal',
      },
      {
        id: 'a1x',
        toks: [T('a1d', AE), O('a1e', '='), T('a1f', '(11-2,\\ 6-3,\\ 8-5)')],
        note: 'kurangkan koordinat $E(11,6,8)$ dengan $A(2,3,5)$',
      },
      {
        id: 'a2',
        toks: [T('a2a', AE), O('a2b', '='), T('a2c', '(9,3,3)', 'blue')],
        note: 'komponen vektor $AE$',
        box: 'navy',
      },
      {
        id: 'a3',
        toks: [T('a3a', '|AE|'), O('a3b', '='), T('a3c', '\\sqrt{9^2+3^2+3^2}', '', 'a2c')],
        note: 'panjang vektor = akar dari jumlah kuadrat komponennya',
      },
      {
        id: 'a4',
        toks: [
          T('a4a', '|AE|'),
          O('a4b', '='),
          T('a4c', '\\sqrt{81+9+9}'),
          O('a4d', '='),
          T('a4e', '\\sqrt{99}'),
        ],
      },
      {
        id: 'a5',
        toks: [
          T('a5a', '\\sqrt{99}', '', 'a4e'),
          O('a5b', '\\approx'),
          T('a5c', '\\sqrt{100}=10\\text{ km}', 'blue'),
        ],
        note: '$99$ paling dekat dengan $100$, jadi sementara dianggap $10$ km supaya mudah dihitung; simpan ke catatan',
        box: 'navy',
      },
    ],
    LB: [
      {
        id: 'b1',
        toks: [T('b1c', '5+3+2+3'), O('b1d', '='), T('b1e', '13\\text{ menit}', 'blue')],
        note: 'total waktu, semua waktu $A$ ke $E$ dijumlahkan; $AE\\approx10$ km ditempuh $13$ menit',
        box: 'navy',
      },
      {
        id: 'b2',
        toks: [T('b2a', '\\text{jarak}'), O('b2b', '='), T('b2c', '\\dfrac{t}{13}\\times10', 'blue', 'PAE1')],
        note: '$t$ = waktu pasangan dibagi total waktu, dikali jarak $AE$; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'b3',
        toks: [
          T('b3a', 'CE'),
          O('b3b', '='),
          T('b3c', '2+3'),
          O('b3d', '='),
          T('b3e', '5\\text{ menit}', 'blue'),
        ],
        note: 'dari $C$ ke $E$ melewati $CD$ dan $DE$',
      },
    ],
    LC: [
      {
        id: 'c1',
        toks: [T('c1a', 'AB'), O('c1b', '='), T('c1c', '\\dfrac{5}{13}\\times10', '', 'PJ1')],
        note: 'waktu $AB=5$ menit',
      },
      {
        id: 'c2',
        toks: [
          T('c2a', '\\dfrac{5}{13}', '', 'c1c'),
          O('c2b', '='),
          T('c2c', '5\\div13'),
          O('c2d', '\\approx'),
          T('c2e', '0{,}38'),
        ],
        note: '$5$ dibagi $13$ hasilnya $0{,}384\\ldots$, cukup dua angka di belakang koma',
      },
      {
        id: 'c3',
        toks: [T('c3a', '0{,}38\\times10', '', 'c2e'), O('c3b', '='), T('c3c', '3{,}8\\text{ km}', 'blue')],
        note: 'dikali $10$, koma bergeser satu tempat ke kanan',
        box: 'navy',
      },
    ],
    LD: [
      {
        id: 'd1',
        toks: [
          T('d1a', 'BC=DE=\\dfrac{3}{13}\\times10', '', 'PJ1'),
          O('d1b', '\\approx'),
          T('d1c', '2{,}3\\text{ km}', 'blue'),
        ],
        note: '$3\\div13\\approx0{,}23$, dikali $10$ menjadi $2{,}3$',
      },
      {
        id: 'd2',
        toks: [
          T('d2a', 'CD=\\dfrac{2}{13}\\times10', '', 'PJ1'),
          O('d2b', '\\approx'),
          T('d2c', '1{,}5\\text{ km}', 'blue'),
        ],
        note: '$2\\div13\\approx0{,}15$, dikali $10$ menjadi $1{,}5$',
      },
      {
        id: 'd3',
        toks: [
          T('d3a', 'CE=\\dfrac{5}{13}\\times10', '', 'PJ1'),
          O('d3b', '\\approx'),
          T('d3c', '3{,}8\\text{ km}', 'blue'),
        ],
        note: 'waktunya $5$ menit, sama dengan $AB$',
      },
    ],
    LE: [
      {
        id: 'e1',
        toks: [T('e1a', 'AB=CE\\approx3{,}8', 'red'), O('e1b', '>'), T('e1c', '3{,}5')],
        note: 'lebih dari $3{,}5$ km, bukan jawaban',
      },
      {
        id: 'e2',
        toks: [T('e2a', 'BC=DE\\approx2{,}3', 'blue'), O('e2b', '<'), T('e2c', '3{,}5')],
        note: 'kurang dari $3{,}5$ km',
      },
      {
        id: 'e3',
        toks: [T('e3a', 'CD\\approx1{,}5', 'blue'), O('e3b', '<'), T('e3c', '3{,}5')],
        note: 'kurang dari $3{,}5$ km, pasangan terdekat',
      },
      { id: 'e4', toks: [H('e4a', 'Jawaban', 'lbl'), H('e4b', 'BC, CD, dan DE', 'tx')], box: 'gold' },
    ],
    L7: [{ id: 'w1', toks: [H('w1a', 'Jawaban', 'lbl'), H('w1b', 'BC, CD, dan DE', 'tx')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', '\\text{jarak}=\\dfrac{t}{13}\\times10')],
        note: '$AB=CE\\approx3{,}8$, $BC=DE\\approx2{,}3$, $CD\\approx1{,}5$ km',
        box: 'navy',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), H('r2b', 'BC, CD, dan DE', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Kereta melaju dengan kecepatan konstan pada lintasan lurus dari $A(2,3,5)$ ke $E(11,6,8)$.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 0 },
    },
    {
      ch: 1,
      cap: 'Dari gambar, waktu tempuhnya $5$, $3$, $2$, dan $3$ menit.',
      visual: rail({ view: 'pic', box: true }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 3, from: 2 },
    },
    {
      ch: 1,
      cap: 'Yang ditanya pasangan stasiun yang jaraknya kurang dari $3{,}5$ km.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 4, from: 3 },
    },
    // ---- 2 · Panjang vektor AE ----
    {
      ch: 2,
      cap: 'Tentukan dulu vektor $\\overrightarrow{AE}$. Vektor posisinya $E-A$, jadi komponennya $(9,3,3)$.',
      visual: rail({ view: 'calc', ae: 2 }),
      board: { title: 'Panjang vektor AE', list: 'LA', upTo: 3, from: 0 },
    },
    {
      ch: 2,
      cap: 'Panjang vektor adalah akar dari jumlah kuadrat komponennya. Hasilnya $\\sqrt{81+9+9}=\\sqrt{99}$.',
      visual: rail({ view: 'calc', ae: 3 }),
      board: { title: 'Panjang vektor AE', list: 'LA', upTo: 5, from: 3 },
      ask: {
        before: 'a4',
        q: 'Berapa $9^2+3^2+3^2$?',
        opts: [
          { tex: '99', ok: true },
          { tex: '15', hint: 'Itu jumlah komponen $9+3+3$. Kuadratkan dulu setiap komponen.' },
          { tex: '90', hint: 'Ketiga kuadrat dijumlahkan, $81+9+9=99$.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Supaya mudah dihitung, $\\sqrt{99}$ dianggap sementara $\\sqrt{100}=10$, karena $99$ paling dekat dengan $100$. Jadi $AE\\approx10$ km.',
      visual: rail({ view: 'calc', ae: 4 }),
      board: { title: 'Panjang vektor AE', list: 'LA', upTo: 6, from: 5, save: ['pAE'] },
      ask: {
        before: 'a5',
        q: '$\\sqrt{99}$ paling dekat dengan…',
        opts: [
          { tex: '\\sqrt{100}=10', ok: true },
          { tex: '\\sqrt{81}=9', hint: '$99$ lebih dekat ke $100$ daripada ke $81$.' },
          { tex: '\\sqrt{121}=11', hint: '$121$ lebih jauh dari $99$ daripada $100$.' },
        ],
      },
    },
    // ---- 3 · Perbandingan waktu ----
    {
      ch: 3,
      cap: 'Jumlahkan semua waktunya, $5+3+2+3=13$ menit. Jadi jarak $AE\\approx10$ km ditempuh dalam $13$ menit.',
      visual: rail({ view: 'bar', n: 4, tot: true }),
      board: { title: 'Perbandingan waktu', pins: ['pAE'], list: 'LB', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Kecepatannya konstan, jadi pakai perbandingan. Jarak pasangan sama dengan waktu pasangan dibagi $13$, dikali $10$.',
      visual: rail({ view: 'bar', n: 4, tot: true }),
      board: { title: 'Perbandingan waktu', pins: ['pAE'], list: 'LB', upTo: 2, from: 1, save: ['pJ'] },
    },
    {
      ch: 3,
      cap: 'Hati-hati dengan $CE$. Kereta melewati $CD$ dan $DE$, jadi waktunya $2+3=5$ menit.',
      visual: rail(BAR),
      board: { title: 'Perbandingan waktu', pins: ['pAE'], list: 'LB', upTo: 3, from: 2 },
      ask: {
        before: 'b3',
        q: 'Waktu kereta dari $C$ ke $E$ adalah…',
        opts: [
          { txt: '5 menit', ok: true },
          { txt: '3 menit', hint: 'Itu waktu $DE$. Dari $C$ ke $E$ kereta melewati $CD$ dan $DE$.' },
          { txt: '8 menit', hint: 'Itu waktu $BE$. Waktu $CE$ hanya $CD+DE=2+3$.' },
        ],
      },
    },
    // ---- 4 · Jarak tiap pasangan ----
    {
      ch: 4,
      cap: 'Jarak $AB=\\frac{5}{13}\\times10$. Ubah dulu $\\frac{5}{13}$ ke desimal, $5\\div13\\approx0{,}38$.',
      visual: pair('AB', 2, []),
      board: { title: 'Jarak tiap pasangan', pins: ['pJ'], list: 'LC', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Dikali $10$, komanya bergeser satu tempat ke kanan. Jadi $0{,}38\\times10=3{,}8$, jarak $AB\\approx3{,}8$ km.',
      visual: pair('AB', 3, ['AB']),
      board: { title: 'Jarak tiap pasangan', pins: ['pJ'], list: 'LC', upTo: 3, from: 2 },
      ask: {
        before: 'c3',
        q: '$0{,}38\\times10$ sama dengan…',
        opts: [
          { tex: '3{,}8', ok: true },
          { tex: '0{,}038', hint: 'Dikali $10$, koma bergeser ke kanan, bukan ke kiri.' },
          { tex: '38', hint: 'Dikali $10$, koma bergeser satu tempat saja. $38$ itu dikali $100$.' },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Dengan cara yang sama, $BC$ dan $DE$ sama-sama $3$ menit. $3\\div13\\approx0{,}23$, dikali $10$ menjadi $2{,}3$ km.',
      visual: pair('BC', 3, ['AB', 'BC', 'DE']),
      board: { title: 'Jarak tiap pasangan', pins: ['pJ'], list: 'LD', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: '$CD$ hanya $2$ menit. $2\\div13\\approx0{,}15$, dikali $10$ menjadi $1{,}5$ km.',
      visual: pair('CD', 3, ['AB', 'BC', 'DE', 'CD']),
      board: { title: 'Jarak tiap pasangan', pins: ['pJ'], list: 'LD', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: '$CE$ ditempuh $5$ menit, sama dengan $AB$. Jadi jaraknya juga $\\frac{5}{13}\\times10\\approx3{,}8$ km.',
      visual: pair('CE', 3, ALL),
      board: { title: 'Jarak tiap pasangan', pins: ['pJ'], list: 'LD', upTo: 3, from: 2 },
    },
    // ---- 5 · Analisis ----
    {
      ch: 5,
      cap: 'Bandingkan tiap jarak dengan $3{,}5$ km. $AB$ dan $CE$ sekitar $3{,}8$ km, lebih dari $3{,}5$, jadi bukan jawaban.',
      visual: rail({ ...BAR, km: ALL, judge: true }),
      board: { title: 'Analisis', list: 'LE', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: '$BC$ dan $DE$ sekitar $2{,}3$ km, sedangkan $CD$ sekitar $1{,}5$ km. Ketiganya kurang dari $3{,}5$ km.',
      visual: rail({ ...BAR, km: ALL, judge: true }),
      board: { title: 'Analisis', list: 'LE', upTo: 3, from: 1 },
    },
    {
      ch: 5,
      cap: 'Jadi pasangan yang jaraknya kurang dari $3{,}5$ km adalah $BC$, $CD$, dan $DE$.',
      visual: rail({ ...BAR, km: ALL, judge: true }),
      board: { title: 'Analisis', list: 'LE', upTo: 4, from: 3 },
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
      cap: 'Cocokkan dengan pilihan. Hanya pasangan yang jaraknya kurang dari $3{,}5$ km; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pJ'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'w1',
        q: 'Pasangan stasiun yang jaraknya kurang dari 3,5 km adalah…',
        col: true,
        win: '<b>BC, CD, dan DE</b>.',
        opts: [
          { txt: 'BC, CD, dan DE', ok: true },
          { txt: 'AB, BC, CD, dan DE', hint: '$AB\\approx3{,}8$ km, lebih dari $3{,}5$ km.' },
          { txt: 'BC dan DE', hint: '$CD\\approx1{,}5$ km, juga kurang dari $3{,}5$ km.' },
          { txt: 'BC, CD, DE, dan CE', hint: '$CE=2+3=5$ menit, jaraknya sekitar $3{,}8$ km seperti $AB$.' },
        ],
      },
    },
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">BC · CD · DE</span><span>Dengan $AE\\approx10$ km dalam $13$ menit, $BC$ dan $DE$ sekitar $2{,}3$ km, $CD$ sekitar $1{,}5$ km, kurang dari $3{,}5$ km.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: 'AB',
      statement: 'AB',
      ok: false,
      formula: '3{,}8>3{,}5',
      why: '$5$ menit, lebih dari $3{,}5$ km.',
    },
    {
      label: 'BC',
      statement: 'BC',
      ok: true,
      formula: '2{,}3<3{,}5',
      why: '$3$ menit, kurang dari $3{,}5$ km.',
    },
    { label: 'CD', statement: 'CD', ok: true, formula: '1{,}5<3{,}5', why: '$2$ menit, pasangan terdekat.' },
    {
      label: 'DE',
      statement: 'DE',
      ok: true,
      formula: '2{,}3<3{,}5',
      why: '$3$ menit, kurang dari $3{,}5$ km.',
    },
    {
      label: 'CE',
      statement: 'CE',
      ok: false,
      formula: '3{,}8>3{,}5',
      why: 'Hati-hati, $CE=2+3=5$ menit, sama dengan $AB$.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 14: Kereta Api dan Koordinat 3D',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Vektor di ruang',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Panjang vektor AE',
        lists: ['LA'],
        why: 'Untuk $\\vec v=(x,y,z)$, panjangnya $|\\vec v|=\\sqrt{x^2+y^2+z^2}$. Karena $\\sqrt{99}$ sedikit kurang dari $10$, jarak sebenarnya sedikit lebih pendek, tetapi selisihnya kecil sehingga kesimpulannya tetap.',
      },
      {
        title: 'Perbandingan waktu',
        lists: ['LB'],
        sketch: 'rail14',
        why: 'Pada kecepatan konstan, jarak sebanding dengan waktu tempuh, jadi jarak pasangan $=\\frac{\\text{waktu pasangan}}{\\text{total waktu}}\\times$ jarak total.',
      },
      { title: 'Jarak tiap pasangan', lists: ['LC', 'LD'] },
      { title: 'Analisis', lists: ['LE'] },
    ],
    answer: 'Jawaban: <b>BC, CD, dan DE</b>.',
  },
  done: {
    seal: 'BC · CD · DE',
    message:
      'Dengan $AE\\approx10$ km dalam $13$ menit, $BC$ dan $DE$ sekitar $2{,}3$ km, $CD$ sekitar $1{,}5$ km, kurang dari $3{,}5$ km.',
  },
  key: {
    answer: 'BC, CD, DE',
    cardOk: [false, true, true, true, false],
    goldRows: ['e4', 'w1', 'r2'],
  },
  authorNotes: [
    'Revisi pemilik (v1.49): tanpa balok. Vektor posisi AE = E − A = (9, 3, 3), panjangnya akar dari jumlah kuadrat komponennya, √99 (dokumen a1–a4); pertanyaan cepat 9² + 3² + 3² dari dokumen.',
    'Atas arahan pemilik √99 dianggap sementara √100 = 10 km supaya mudah dihitung, lalu dipakai perbandingan waktu, jarak = t/13 × 10 dengan total 13 menit (dokumen b1–b2).',
    'Tiap pecahan diubah ke desimal (5 ÷ 13 ≈ 0,38) lalu dikali 10 dengan koma bergeser satu tempat ke kanan (animasi): AB = CE ≈ 3,8, BC = DE ≈ 2,3, CD ≈ 1,5 km, sejalan dengan nilai dokumen c1–c5 (3,83; 2,30; 1,53).',
    'Pertanyaan cepat waktu CE dari dokumen; jebakan CE sebagai satu segmen (Kesalahan umum) ditonjolkan. Tanpa simbol ":" di baris papan; pembagian ditulis dengan ÷.',
  ],
};

export default q14;
