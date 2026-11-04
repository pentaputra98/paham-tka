/**
 * SOAL 14 — Kereta Api dan Koordinat 3D (jarak antartitik, kecepatan konstan; multi-jawaban). Kunci: BC, CD, DE.
 * Sumber: docs/pembahasan25.md "SOAL 14", docs/soal25.md no. 14, docs/jarak_kereta_api.png.
 * Alur pemilik (v1.48, tanpa desimal, dicatat di dokumen):
 *  - pahami: kecepatan konstan, lintasan lurus; A(2, 3, 5), E(11, 6, 8); waktu 5, 3, 2, 3 menit; ditanya jarak < 3,5 km;
 *  - jarak A ke E: AE = E − A = (9, 3, 3) (langkah balok), |AE|² = 81 + 9 + 9 = 99, |AE| = √99 km;
 *  - jarak sebanding waktu: total 13 menit, jarak t menit = t/13 × √99; waktu tiap pilihan, CE = 2 + 3 = 5 menit;
 *    cukup uji dua waktu, 5 menit (AB, CE) dan 3 menit (BC, DE);
 *  - uji tanpa desimal: kuadratkan (akar hilang), kali silang dengan (7/2)² = 49/4 (penyebut hilang):
 *    5 menit → 9900 > 8281 (lebih dari 3,5 km); 3 menit → 3564 < 8281 (kurang); CD 2 menit lebih pendek lagi;
 *  - bagian opsional "Batas waktu": 396t² < 8281, t = 4 lolos (6336), t = 5 tidak (9900).
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Rail14State } from '../../visuals/rail14';
import { getSoal } from '../index';

/** Gambar asli soal (docs/jarak_kereta_api.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/jarak_kereta_api.png', import.meta.url).href;
const rail = (state: Rail14State): Visual => ({ kind: 'svg', scene: 'rail14', state });
const PAIRS = ['AB', 'BC', 'CD', 'DE', 'CE'];
const BAR: Rail14State = { view: 'bar', n: 4, ce: true };
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
    { t: 'Jarak A ke E', d: '√99 km' },
    { t: 'Jarak sebanding waktu', d: '13 menit untuk √99 km' },
    { t: 'Uji 5 menit', d: 'AB dan CE' },
    { t: 'Uji 3 dan 2 menit', d: 'BC, CD, DE' },
    { t: 'Batas waktu', d: 'Opsional: paling lama 4 menit', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'BC, CD, DE' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pAE: { id: 'pAE', toks: [T('PAE1', '|AE|=\\sqrt{99}\\text{ km}', '', 'a5c')] },
    pJ: { id: 'pJ', toks: [T('PJ1', '\\text{jarak}=\\dfrac{t}{13}\\times\\sqrt{99}', '', 'b2c')] },
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
        toks: [
          T('a1a', AE),
          O('a1b', '='),
          T('a1c', 'E-A', '', '@s-E'),
          O('a1d', '='),
          T('a1e', '(11-2,\\ 6-3,\\ 8-5)'),
        ],
        note: 'ujung dikurangi pangkal',
      },
      {
        id: 'a2',
        toks: [T('a2a', AE), O('a2b', '='), T('a2c', '(9,3,3)', 'blue')],
        note: 'langkah $+9$, $+3$, dan $+3$ pada balok',
        box: 'navy',
      },
      {
        id: 'a3',
        toks: [T('a3a', '|AE|^2'), O('a3b', '='), T('a3c', '9^2+3^2+3^2', '', 'a2c')],
        note: 'jumlah kuadrat semua komponen',
      },
      {
        id: 'a4',
        toks: [T('a4a', '|AE|^2'), O('a4b', '='), T('a4c', '81+9+9'), O('a4d', '='), T('a4e', '99')],
      },
      {
        id: 'a5',
        toks: [T('a5a', '|AE|'), O('a5b', '='), T('a5c', '\\sqrt{99}\\text{ km}', 'blue')],
        note: 'sedikit kurang dari $10$ km, karena $10^2=100$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LB: [
      {
        id: 'b1',
        toks: [
          T('b1a', '\\text{waktu }A\\to E'),
          O('b1b', '='),
          T('b1c', '5+3+2+3'),
          O('b1d', '='),
          T('b1e', '13\\text{ menit}', 'blue'),
        ],
        note: 'seluruh lintasan $\\sqrt{99}$ km ditempuh $13$ menit',
        box: 'navy',
      },
      {
        id: 'b2',
        toks: [
          T('b2a', '\\text{jarak }t\\text{ menit}'),
          O('b2b', '='),
          T('b2c', '\\dfrac{t}{13}\\times\\sqrt{99}', 'blue', 'PAE1'),
        ],
        note: 'kecepatan konstan, jadi jarak sebanding waktu; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'b3',
        toks: [
          T('b3a', 'AB=5'),
          O('b3b', ','),
          T('b3c', 'BC=3'),
          O('b3d', ','),
          T('b3e', 'CD=2'),
          O('b3f', ','),
          T('b3g', 'DE=3'),
        ],
        note: 'waktu tiap pilihan, dalam menit',
      },
      {
        id: 'b4',
        toks: [
          T('b4a', 'CE'),
          O('b4b', '='),
          T('b4c', '2+3', '', 'b3e'),
          O('b4d', '='),
          T('b4e', '5\\text{ menit}', 'blue'),
        ],
        note: 'dari $C$ ke $E$ melewati $CD$ dan $DE$',
      },
      {
        id: 'b5',
        toks: [
          H('b5a', 'cukup uji', 'tx'),
          T('b5b', '5\\text{ menit}'),
          H('b5c', 'dan', 'tx'),
          T('b5d', '3\\text{ menit}'),
        ],
        note: '$AB$ dan $CE$ sama-sama $5$ menit, $BC$ dan $DE$ sama-sama $3$ menit',
      },
    ],
    LU: [
      {
        id: 'u1',
        toks: [
          T('u1a', '5\\text{ menit}'),
          O('u1b', '\\to'),
          T('u1c', '\\dfrac{5}{13}\\times\\sqrt{99}', '', 'PJ1'),
          O('u1d', '='),
          T('u1e', '\\dfrac{5\\sqrt{99}}{13}'),
        ],
        note: 'jarak $AB$, sama dengan jarak $CE$',
      },
      {
        id: 'u2',
        toks: [
          T('u2a', '\\Big(\\dfrac{5\\sqrt{99}}{13}\\Big)^2=\\dfrac{2475}{169}', '', 'u1e'),
          O('u2b', ','),
          T('u2c', '\\Big(\\dfrac{7}{2}\\Big)^2=\\dfrac{49}{4}'),
        ],
        note: '$3{,}5=\\frac{7}{2}$; kuadratkan supaya akarnya hilang',
      },
      {
        id: 'u3',
        toks: [
          T('u3a', '2475\\times4=9900', '', 'u2a'),
          O('u3b', ','),
          T('u3c', '49\\times169=8281', '', 'u2c'),
        ],
        note: 'kali silang supaya penyebutnya hilang',
      },
      {
        id: 'u4',
        toks: [
          T('u4a', '9900>8281', 'red'),
          O('u4b', '\\to'),
          H('u4c', '<i>AB</i> dan <i>CE</i> lebih dari 3,5 km', 'tx'),
        ],
        note: 'keduanya bukan jawaban',
      },
    ],
    LV: [
      {
        id: 'v1',
        toks: [
          T('v1a', '3\\text{ menit}'),
          O('v1b', '\\to'),
          T('v1c', '\\dfrac{3}{13}\\times\\sqrt{99}', '', 'PJ1'),
          O('v1d', '='),
          T('v1e', '\\dfrac{3\\sqrt{99}}{13}'),
        ],
        note: 'jarak $BC$, sama dengan jarak $DE$',
      },
      {
        id: 'v2',
        toks: [
          T('v2a', '\\Big(\\dfrac{3\\sqrt{99}}{13}\\Big)^2=\\dfrac{891}{169}', '', 'v1e'),
          O('v2b', ','),
          T('v2c', '\\Big(\\dfrac{7}{2}\\Big)^2=\\dfrac{49}{4}'),
        ],
        note: '$9\\times99=891$',
      },
      {
        id: 'v3',
        toks: [
          T('v3a', '891\\times4=3564', '', 'v2a'),
          O('v3b', ','),
          T('v3c', '49\\times169=8281', '', 'v2c'),
        ],
        note: 'kali silang',
      },
      {
        id: 'v4',
        toks: [
          T('v4a', '3564<8281', 'blue'),
          O('v4b', '\\to'),
          H('v4c', '<i>BC</i> dan <i>DE</i> kurang dari 3,5 km', 'tx'),
        ],
        box: 'navy',
      },
      {
        id: 'v5',
        toks: [
          T('v5a', 'CD=2\\text{ menit}'),
          O('v5b', '\\to'),
          H('v5c', 'lebih singkat lagi, juga kurang', 'tx'),
        ],
        note: 'waktunya kurang dari $3$ menit, jadi jaraknya lebih pendek',
      },
      {
        id: 'v6',
        toks: [H('v6a', 'Jawaban', 'lbl'), H('v6b', 'BC, CD, dan DE', 'tx')],
        box: 'gold',
      },
    ],
    // batas waktu (opsional)
    LX: [
      {
        id: 'x1',
        toks: [
          T('x1a', '\\Big(\\dfrac{t\\sqrt{99}}{13}\\Big)^2<\\dfrac{49}{4}', '', 'PJ1'),
          O('x1b', '\\to'),
          T('x1c', '396\\,t^2<8281'),
        ],
        note: 'kali silang, $99\\times4=396$ dan $49\\times169=8281$',
      },
      {
        id: 'x2',
        toks: [T('x2a', 't=4'), O('x2b', '\\to'), T('x2c', '396\\times16=6336<8281', 'blue')],
        note: 'lolos',
      },
      {
        id: 'x3',
        toks: [T('x3a', 't=5'), O('x3b', '\\to'), T('x3c', '396\\times25=9900>8281', 'red')],
        note: 'tidak lolos',
      },
      {
        id: 'x4',
        toks: [H('x4a', 'paling lama 4 menit', 'tx'), O('x4b', '\\to'), H('x4c', 'BC, CD, DE', 'tx')],
        note: 'sama dengan hasil uji',
        box: 'navy',
      },
    ],
    L7: [{ id: 'w1', toks: [H('w1a', 'Jawaban', 'lbl'), H('w1b', 'BC, CD, dan DE', 'tx')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [
          T('r1a', '5\\text{ menit}\\to9900>8281'),
          O('r1b', ','),
          T('r1c', '3\\text{ menit}\\to3564<8281'),
        ],
        note: 'pembanding $(3{,}5)^2$ tanpa desimal',
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
    // ---- 2 · Jarak A ke E ----
    {
      ch: 2,
      cap: 'Dari $A$ ke $E$, kurangkan koordinatnya. Hasilnya $(9,3,3)$, yaitu langkah $9$, $3$, dan $3$ pada balok.',
      visual: rail({ view: 'box', k: 3 }),
      board: { title: 'Jarak A ke E', list: 'LA', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Jarak $AE$ adalah diagonal balok. Kuadratnya $9^2+3^2+3^2=99$, jadi $|AE|=\\sqrt{99}$ km.',
      visual: rail({ view: 'box', k: 3, diag: true }),
      board: { title: 'Jarak A ke E', list: 'LA', upTo: 5, from: 2, save: ['pAE'] },
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
    // ---- 3 · Jarak sebanding waktu ----
    {
      ch: 3,
      cap: 'Seluruh lintasan ditempuh $5+3+2+3=13$ menit. Jadi $\\sqrt{99}$ km dibagi menjadi $13$ bagian menit yang sama.',
      visual: rail({ view: 'bar', n: 4 }),
      board: { title: 'Jarak sebanding waktu', pins: ['pAE'], list: 'LB', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Kecepatannya konstan, jadi jarak sebanding waktu. Jarak $t$ menit adalah $\\frac{t}{13}\\times\\sqrt{99}$.',
      visual: rail({ view: 'bar', n: 4 }),
      board: { title: 'Jarak sebanding waktu', pins: ['pAE'], list: 'LB', upTo: 2, from: 1, save: ['pJ'] },
    },
    {
      ch: 3,
      cap: 'Lihat waktu tiap pilihan. Hati-hati, $CE$ melewati $CD$ dan $DE$, jadi $2+3=5$ menit.',
      visual: rail(BAR),
      board: { title: 'Jarak sebanding waktu', pins: ['pAE'], list: 'LB', upTo: 5, from: 2 },
      ask: {
        before: 'b4',
        q: 'Waktu kereta dari $C$ ke $E$ adalah…',
        opts: [
          { txt: '5 menit', ok: true },
          { txt: '3 menit', hint: 'Itu waktu $DE$. Dari $C$ ke $E$ kereta melewati $CD$ dan $DE$.' },
          { txt: '8 menit', hint: 'Itu waktu $BE$. Waktu $CE$ hanya $CD+DE=2+3$.' },
        ],
      },
    },
    // ---- 4 · Uji 5 menit ----
    {
      ch: 4,
      cap: 'Uji $5$ menit, yaitu $AB$ dan $CE$. Supaya akarnya hilang, kuadratkan jaraknya dan juga $3{,}5=\\frac{7}{2}$.',
      visual: rail({ ...BAR, g5: 1, cmp: { t: 5, k: 2 } }),
      board: { title: 'Uji 5 menit', pins: ['pJ'], list: 'LU', upTo: 2, from: 0 },
      ask: {
        before: 'u2',
        q: '$\\Big(\\dfrac{5\\sqrt{99}}{13}\\Big)^2$ sama dengan…',
        opts: [
          { tex: '\\dfrac{2475}{169}', ok: true },
          { tex: '\\dfrac{2475}{13}', hint: 'Penyebutnya juga dikuadratkan, $13^2=169$.' },
          { tex: '\\dfrac{495}{169}', hint: '$5$ juga dikuadratkan, $25\\times99=2475$.' },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Kali silang supaya penyebutnya hilang, $9900$ dan $8281$. Karena $9900>8281$, jarak $AB$ dan $CE$ lebih dari $3{,}5$ km.',
      visual: rail({ ...BAR, g5: 2, cmp: { t: 5, k: 4 } }),
      board: { title: 'Uji 5 menit', pins: ['pJ'], list: 'LU', upTo: 4, from: 2 },
    },
    // ---- 5 · Uji 3 dan 2 menit ----
    {
      ch: 5,
      cap: 'Uji $3$ menit, yaitu $BC$ dan $DE$, dengan cara yang sama. Kuadratnya $\\frac{891}{169}$, lalu kali silang menjadi $3564$ dan $8281$.',
      visual: rail({ ...BAR, g5: 2, g3: 1, cmp: { t: 3, k: 3 } }),
      board: { title: 'Uji 3 dan 2 menit', pins: ['pJ'], list: 'LV', upTo: 3, from: 0 },
    },
    {
      ch: 5,
      cap: 'Karena $3564<8281$, jarak $BC$ dan $DE$ kurang dari $3{,}5$ km. $CD$ hanya $2$ menit, jadi lebih pendek lagi.',
      visual: rail({ ...BAR, g5: 2, g3: 2, cmp: { t: 3, k: 4 } }),
      board: { title: 'Uji 3 dan 2 menit', pins: ['pJ'], list: 'LV', upTo: 5, from: 3 },
      ask: {
        before: 'v5',
        q: 'Pasangan $CD$ ($2$ menit) jaraknya…',
        col: true,
        opts: [
          { txt: 'Kurang dari 3,5 km', ok: true },
          {
            txt: 'Lebih dari 3,5 km',
            hint: 'Waktunya lebih singkat dari $3$ menit, jadi jaraknya lebih pendek dari $BC$.',
          },
        ],
      },
    },
    {
      ch: 5,
      cap: 'Jadi pasangan yang jaraknya kurang dari $3{,}5$ km adalah $BC$, $CD$, dan $DE$.',
      visual: rail({ ...BAR, g5: 2, g3: 2 }),
      board: { title: 'Uji 3 dan 2 menit', pins: ['pJ'], list: 'LV', upTo: 6, from: 5 },
    },
    // tawaran batas waktu (opsional): Ya masuk Bagian 6, Tidak/Lewati langsung ke Bagian 7
    {
      ch: 5,
      cap: 'Mau lihat cara lain, yaitu mencari batas waktu perjalanan yang jaraknya kurang dari $3{,}5$ km?',
      visual: rail({ ...BAR, g5: 2, g3: 2 }),
      board: { title: 'Uji 3 dan 2 menit', pins: ['pJ'], list: 'LV', upTo: 6, from: 6 },
      branch: { yes: 'Ya, lihat batas waktu' },
    },
    // ---- 6 · Batas waktu (opsional) ----
    {
      ch: 6,
      cap: 'Untuk waktu $t$ menit, syaratnya jarak kuadrat kurang dari $\\frac{49}{4}$. Setelah kali silang menjadi $396t^2<8281$.',
      visual: rail({ ...BAR, g5: 2, g3: 2 }),
      board: { title: 'Batas waktu', pins: ['pJ'], list: 'LX', upTo: 1, from: 0 },
    },
    {
      ch: 6,
      cap: 'Waktu $4$ menit masih lolos, $5$ menit tidak. Jadi pasangan yang waktunya paling lama $4$ menit, yaitu $BC$, $CD$, $DE$.',
      visual: rail({ ...BAR, g5: 2, g3: 2, lim: true }),
      board: { title: 'Batas waktu', pins: ['pJ'], list: 'LX', upTo: 4, from: 1 },
    },
    // ---- 7 · Catatan lengkap ----
    {
      ch: 7,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 8 · Cocokkan pilihan ----
    {
      ch: 8,
      cap: 'Cocokkan dengan pilihan. Pasangan $5$ menit lebih dari $3{,}5$ km, sedangkan yang $3$ dan $2$ menit kurang; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pJ'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'w1',
        q: 'Pasangan stasiun yang jaraknya kurang dari 3,5 km adalah…',
        col: true,
        win: '<b>BC, CD, dan DE</b>.',
        opts: [
          { txt: 'BC, CD, dan DE', ok: true },
          { txt: 'AB, BC, CD, dan DE', hint: '$AB$ ditempuh $5$ menit, $9900>8281$.' },
          { txt: 'BC dan DE', hint: '$CD$ hanya $2$ menit, jaraknya lebih pendek lagi.' },
          { txt: 'BC, CD, DE, dan CE', hint: '$CE=2+3=5$ menit, sama seperti $AB$.' },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">BC · CD · DE</span><span>Jarak sebanding waktu. Pasangan $5$ menit memberi $9900>8281$, pasangan $3$ menit memberi $3564<8281$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: 'AB',
      statement: 'AB',
      ok: false,
      formula: '9900>8281',
      why: '$5$ menit, lebih dari $3{,}5$ km.',
    },
    {
      label: 'BC',
      statement: 'BC',
      ok: true,
      formula: '3564<8281',
      why: '$3$ menit, kurang dari $3{,}5$ km.',
    },
    { label: 'CD', statement: 'CD', ok: true, formula: '1584<8281', why: '$2$ menit, pasangan terdekat.' },
    {
      label: 'DE',
      statement: 'DE',
      ok: true,
      formula: '3564<8281',
      why: '$3$ menit, kurang dari $3{,}5$ km.',
    },
    {
      label: 'CE',
      statement: 'CE',
      ok: false,
      formula: '9900>8281',
      why: 'Hati-hati, $CE=2+3=5$ menit, sama dengan $AB$.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 14: Kereta Api dan Koordinat 3D',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Vektor di ruang',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Jarak A ke E',
        lists: ['LA'],
        why: 'Jarak dua titik di ruang adalah akar dari jumlah kuadrat selisih koordinatnya.',
      },
      {
        title: 'Jarak sebanding waktu',
        lists: ['LB'],
        sketch: 'rail14',
        why: 'Pada kecepatan konstan, jarak $=$ kecepatan $\\times$ waktu, jadi jarak sebanding dengan waktu tempuh.',
      },
      {
        title: 'Uji 5 menit',
        lists: ['LU'],
        why: 'Membandingkan dua bilangan positif sama saja dengan membandingkan kuadratnya, dan dua pecahan dibandingkan dengan kali silang.',
      },
      { title: 'Uji 3 dan 2 menit', lists: ['LV'] },
      { title: 'Batas waktu (opsional)', lists: ['LX'] },
    ],
    answer: 'Jawaban: <b>BC, CD, dan DE</b>.',
  },
  done: {
    seal: 'BC · CD · DE',
    message:
      'Jarak sebanding waktu. Pasangan $5$ menit memberi $9900>8281$, pasangan $3$ menit memberi $3564<8281$.',
  },
  key: {
    answer: 'BC, CD, DE',
    cardOk: [false, true, true, true, false],
    goldRows: ['v6', 'w1', 'r2'],
  },
  authorNotes: [
    'Modul baru (v1.48). Jarak AE dari dokumen a1–a5 (AE = (9, 3, 3), |AE| = √99) dengan balok kerangka; pertanyaan cepat 9² + 3² + 3² dari dokumen.',
    'Jalur utama tanpa desimal (arahan pemilik): jarak t menit = t/13 × √99, lalu tiap waktu diuji dengan mengkuadratkan dan kali silang terhadap (7/2)² = 49/4, sesuai metode eksak di Pemeriksaan hasil dokumen (9900 > 8281, 3564 < 8281).',
    'Pertanyaan cepat waktu CE dari dokumen; jebakan CE sebagai satu segmen (Kesalahan umum) ditonjolkan. Kecepatan 0,765 km/menit dari dokumen tidak dipakai (desimal); "Batas waktu" 396t² < 8281 menjadi bagian opsional.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q14;
