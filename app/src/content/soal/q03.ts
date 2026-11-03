/**
 * SOAL 3 — Bahan Baku Pabrik Minuman (perkalian matriks; pilihan tunggal). Kunci: C (k = 40 ml).
 * Sumber: docs/pembahasan25.md "SOAL 3", docs/soal25.md no. 3.
 * Alur guru (v1.30; revisi pemilik v1.32 "langsung dapat 40 ya sudah", dicatat di dokumen):
 *  - pahami: yang ditanya k, air untuk satu botol kunir asem; baris matriks = minuman, kolom = bahan;
 *  - data dari matriks: kolom air (50, 40, k) dan pesanan (100, 120, 80) terbang dari adegan; total air 13.000 dari
 *    soal; Tahukah kalian, hanya kolom air yang memuat k;
 *  - hitung air: tiap baris dipasangkan (air per botol × banyak botol) → 5.000, 4.800, 80k; batang air 13.000 ml;
 *    9.800 + 80k = 13.000;
 *  - cari k: 9.800 pindah ruas (tidak dicoret) → 80k = 3.200 → k = 40; hati-hati 3.200 itu untuk 80 botol; cek;
 *  - bagian opsional "Cara alternatif": pesanan (baris) × matriks, entri air; kenapa kolom;
 *  - k = 40 ml langsung dicocokkan dengan pilihan C (uji tiap pilihan v1.30 dihapus).
 * Anomali sumber (total J dan GM tidak cocok, catatan dokumen): kolom J dan GM tidak dihitung atau dibandingkan.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Drink3State } from '../../visuals/drink3';
import { getSoal } from '../index';

const drink = (state: Drink3State): Visual => ({ kind: 'svg', scene: 'drink3', state });
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
type L = (typeof LETTERS)[number];
/** pilihan (docs/soal25.md no. 3): ml */
const OPTS: Record<L, number> = { A: 30, B: 35, C: 40, D: 45, E: 50 };
const N1 = ['pT'];
const NE = ['pE'];
const NK = ['pE', 'pK'];

/** matriks berlabel di kertas soal: label kolom di atas, label baris di kiri */
const mx = (cols: string[], rows: Array<[string, string[]]>): string =>
  `<span class="soal-mx" style="--n:${cols.length}"><span></span>${cols.map((c) => `<span class="smx-l">${c}</span>`).join('')}${rows
    .map(([l, vals]) => `<span class="smx-l">${l}</span>${vals.map((x) => `<span>${x}</span>`).join('')}`)
    .join('')}<span class="smx-br" aria-hidden="true"></span></span>`;
const K = '<span class="hl hl-red" data-hl="1"><span data-src="s-k"><i>k</i></span></span>';
const AIR = '<span class="hl hl-red" data-hl="3"><span data-src="s-air">13000</span></span>';

const q03: SoalContent = {
  meta: getSoal(3)!,
  sourceRef: 'docs/pembahasan25.md#soal-3',
  layout: 'full',
  paper: {
    html: `<p>Sebuah pabrik minuman tradisional memproduksi tiga jenis minuman yaitu wedang jahe (WJ), beras kencur (BK), dan kunir asem (KA).</p>
<p>Dalam proses produksinya, digunakan tiga bahan utama yaitu jahe (J) dalam gram, gula merah (GM) dalam gram, dan <span class="hl hl-blue" data-hl="2"><span data-src="s-a">air (A) dalam mililiter</span></span>. Setiap botol minuman memerlukan bahan sebagai berikut.</p>
<div class="soal-mxs">${mx(
      ['J', 'GM', 'A'],
      [
        ['WJ', ['20', '15', '50']],
        ['BK', ['10', '25', '40']],
        ['KA', ['12', '8', K]],
      ],
    )}</div>
<p>Pada suatu hari pabrik tersebut menerima pesanan sebagai berikut. Jumlah bahan baku yang digunakan dalam proses pembuatan setiap minuman adalah:</p>
<div class="soal-mxs">${mx(
      [''],
      [
        ['WJ', ['100']],
        ['BK', ['120']],
        ['KA', ['80']],
      ],
    )}${mx(
      [''],
      [
        ['J', ['4360']],
        ['GM', ['4960']],
        ['A', [AIR]],
      ],
    )}</div>
<p>Banyak <span class="hl hl-gold" data-hl="1"><span data-src="s-tanya">air yang dibutuhkan untuk memproduksi satu botol kunir asem</span></span> adalah ....</p>
<ol class="abc">
${LETTERS.map((o) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">${OPTS[o]} ml</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-a', 's-k', 's-air', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['d-a1', 'd-a2', 'd-k', 'd-o1', 'd-o2', 'd-o3'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Matriks',
    titleLines: ['Pembahasan Soal', 'Matriks <span class="accent">Kebutuhan</span>', 'Bahan Baku'],
    lede: 'Tiga jenis minuman, tiga bahan, satu angka yang belum diketahui: kebutuhan air untuk kunir asem. Pesanan dan total air sudah tercatat, jadi $k$ bisa dicari.',
    facts: [
      { dt: 'Jenis minuman', dd: '3' },
      { dt: 'Total air', dd: '13.000 ml' },
      { dt: 'Dicari', dd: 'k' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Baris dan kolom matriks' },
    { t: 'Data dari matriks', d: 'Kolom air dan pesanan' },
    { t: 'Hitung air', d: 'Per botol × banyak botol' },
    { t: 'Cari k', d: 'k = 40 ml, pilihan C' },
    { t: 'Cara alternatif', d: 'Opsional: perkalian matriks', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Jawaban C' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pT: {
      id: 'pT',
      toks: [H('PT0', 'total air', 'tx', 'd3a'), O('PT1', '='), T('PT2', '13{.}000', '', 'd3c')],
    },
    pE: {
      id: 'pE',
      toks: [
        T('PE1', '9{.}800', '', 'h5a'),
        O('PE2', '+'),
        T('PE3', '80k', '', 'h5c'),
        O('PE4', '='),
        T('PE5', '13{.}000', '', 'h5e'),
      ],
    },
    pK: { id: 'pK', gold: true, toks: [T('PK0', 'k', '', 'c3a'), O('PK1', '='), T('PK2', '40', '', 'c3e')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [H('k1a', 'Ditanya', 'lbl'), H('k1b', 'air untuk 1 botol KA', 'gold', '@s-tanya')],
        note: 'yaitu $k$ di matriks, dalam ml',
      },
      {
        id: 'k2',
        toks: [H('k2a', 'Langkah pertama', 'lbl'), H('k2b', 'baca matriksnya', 'tx')],
        note: 'baris = jenis minuman, kolom = bahan',
      },
    ],
    LD: [
      {
        id: 'd1',
        toks: [
          H('d1a', 'air per botol', 'tx'),
          O('d1b', '\\to'),
          T('d1c', '50', 'blue', '@d-a1'),
          O('d1d', ','),
          T('d1e', '40', 'blue', '@d-a2'),
          O('d1f', ','),
          T('d1g', 'k', 'red', '@d-k'),
        ],
        note: 'kolom A untuk WJ, BK, KA (ml)',
      },
      {
        id: 'd2',
        toks: [
          H('d2a', 'pesanan', 'tx'),
          O('d2b', '\\to'),
          T('d2c', '100', 'blue', '@d-o1'),
          O('d2d', ','),
          T('d2e', '120', 'blue', '@d-o2'),
          O('d2f', ','),
          T('d2g', '80', 'blue', '@d-o3'),
        ],
        note: 'botol WJ, BK, KA',
      },
      {
        id: 'd3',
        toks: [H('d3a', 'total air', 'tx'), O('d3b', '='), T('d3c', '13{.}000', 'red', '@s-air')],
        note: 'ml; simpan ke catatan',
      },
      {
        id: 'd4',
        toks: [
          H('d4a', 'Tahukah kalian?', 'lbl'),
          H('d4b', 'hanya kolom air yang memuat', 'tx'),
          T('d4c', 'k', 'red'),
        ],
        note: 'jadi cukup bahan air yang dihitung',
      },
    ],
    LH: [
      {
        id: 'h1',
        toks: [
          T('h1a', '50', '', '@d-a1'),
          T('h1b', '\\times'),
          T('h1c', '100', '', '@d-o1'),
          O('h1d', '='),
          T('h1e', '5{.}000', 'blue'),
        ],
        note: 'air untuk 100 botol WJ (ml)',
      },
      {
        id: 'h2',
        toks: [
          T('h2a', '40', '', '@d-a2'),
          T('h2b', '\\times'),
          T('h2c', '120', '', '@d-o2'),
          O('h2d', '='),
          T('h2e', '4{.}800', 'blue'),
        ],
        note: 'air untuk 120 botol BK',
      },
      {
        id: 'h3',
        toks: [
          T('h3a', 'k', '', '@d-k'),
          T('h3b', '\\times'),
          T('h3c', '80', '', '@d-o3'),
          O('h3d', '='),
          T('h3e', '80k', 'blue'),
        ],
        note: 'air untuk 80 botol KA',
      },
      {
        id: 'h4',
        toks: [
          T('h4a', '5{.}000', '', 'h1e'),
          O('h4b', '+'),
          T('h4c', '4{.}800', '', 'h2e'),
          O('h4d', '+'),
          T('h4e', '80k', '', 'h3e'),
          O('h4f', '='),
          T('h4g', '13{.}000', 'red', 'PT2'),
        ],
        note: 'jumlahnya harus sama dengan total air',
      },
      {
        id: 'h5',
        toks: [
          T('h5a', '9{.}800', 'blue'),
          O('h5b', '+'),
          T('h5c', '80k', '', 'h4e'),
          O('h5d', '='),
          T('h5e', '13{.}000', '', 'h4g'),
        ],
        note: '$5.000+4.800=9.800$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LK: [
      {
        id: 'c1',
        toks: [
          T('c1a', '80k', '', 'PE3'),
          O('c1b', '='),
          T('c1c', '13{.}000', '', 'PE5'),
          T('c1d', '-9{.}800', 'red', 'PE1'),
        ],
        note: '$9.800$ di ruas kiri pindah ke ruas kanan menjadi $-9.800$',
      },
      {
        id: 'c2',
        toks: [T('c2a', '80k'), O('c2b', '='), T('c2c', '3{.}200', 'blue')],
        note: '$13.000-9.800=3.200$, air untuk 80 botol KA',
      },
      {
        id: 'c3',
        toks: [
          T('c3a', 'k'),
          O('c3b', '='),
          T('c3c', '3{.}200\\div80', '', 'c2c'),
          O('c3d', '='),
          T('c3e', '40', 'gold'),
        ],
        note: 'kedua ruas dibagi $80$; ml per botol, simpan ke catatan',
        box: 'gold',
      },
      {
        id: 'c4',
        toks: [H('c4a', 'Hati-hati', 'lbl'), T('c4b', '3{.}200'), H('c4c', 'bukan jawabannya', 'tx')],
        note: '$3.200$ ml untuk 80 botol, satu botol $3.200\\div80=40$ ml',
      },
      {
        id: 'c5',
        toks: [
          H('c5a', 'cek', 'tx'),
          T('c5b', '9{.}800+40\\cdot80', '', 'PE1'),
          O('c5c', '='),
          T('c5d', '13{.}000'),
          T('c5e', '\\;\\checkmark', 'blue'),
        ],
        note: '$40\\cdot80=3.200$ dan $9.800+3.200=13.000$',
      },
      {
        id: 'c6',
        toks: [H('c6a', 'Jawaban', 'lbl'), H('c6b', 'C · 40 ml', 'tx', '@s-oC')],
        note: '$40$ ml ada di pilihan C',
        box: 'gold',
      },
    ],
    // cara alternatif (opsional): perkalian matriks
    LM: [
      {
        id: 'x1',
        toks: [
          T('x1a', '\\begin{pmatrix}100&120&80\\end{pmatrix}'),
          T('x1b', '\\begin{bmatrix}20&15&50\\\\10&25&40\\\\12&8&k\\end{bmatrix}'),
        ],
        note: 'pesanan (WJ, BK, KA) sebagai baris, dikali matriks kebutuhan',
      },
      {
        id: 'x2',
        toks: [
          H('x2a', 'entri air', 'tx'),
          O('x2b', '='),
          T('x2c', '100\\cdot50+120\\cdot40+80\\cdot k', 'blue'),
        ],
        note: 'baris pesanan × kolom air; sama dengan hitungan kita',
        box: 'navy',
      },
      {
        id: 'x3',
        toks: [H('x3a', 'kenapa kolom?', 'tx'), O('x3b', '\\to'), H('x3c', 'satu kolom = satu bahan', 'tx')],
        note: 'baris matriks = minuman, jadi total satu bahan dikumpulkan dari kolomnya',
      },
    ],
    L8: [{ id: 's1', toks: [H('s1a', 'Jawaban', 'lbl'), H('s1b', 'C · 40 ml', 'tx')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', 'k=40\\ \\text{ml}')],
        note: 'air untuk satu botol kunir asem',
        box: 'gold',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), H('r2b', 'C · 40 ml', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Yang ditanya banyak air untuk satu botol kunir asem, yaitu $k$ di matriks.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Langkah pertama, baca matriksnya. Baris menyatakan jenis minuman, kolom menyatakan bahan.',
      visual: drink({ rc: true }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Data dari matriks ----
    {
      ch: 2,
      cap: 'Perhatikan kolom A, yaitu air. Satu botol WJ butuh $50$ ml, BK $40$ ml, dan KA $k$ ml.',
      visual: drink({ colA: true }),
      board: { title: 'Data dari matriks', list: 'LD', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Pesanannya $100$ botol WJ, $120$ botol BK, dan $80$ botol KA.',
      visual: drink({ colA: true }),
      board: { title: 'Data dari matriks', list: 'LD', upTo: 2, from: 1 },
    },
    {
      ch: 2,
      cap: 'Total air yang dipakai untuk seluruh pesanan adalah $13.000$ ml. Simpan ke catatan.',
      visual: { kind: 'soal', hl: 3 },
      board: { title: 'Data dari matriks', list: 'LD', upTo: 3, from: 2, save: ['pT'] },
    },
    {
      ch: 2,
      cap: 'Tahukah kalian? Hanya kolom air yang memuat $k$, jadi cukup bahan air saja yang kita hitung.',
      visual: drink({ colA: true }),
      board: { title: 'Data dari matriks', list: 'LD', upTo: 4, from: 3 },
    },
    // ---- 3 · Hitung air ----
    {
      ch: 3,
      cap: 'Air untuk wedang jahe, $50$ ml per botol dikali $100$ botol, yaitu $5.000$ ml.',
      visual: drink({ colA: true, pair: 1 }),
      board: { title: 'Hitung air', pins: N1, list: 'LH', upTo: 1, from: 0 },
      ask: {
        before: 'h1',
        q: 'Air untuk $100$ botol wedang jahe ($50$ ml per botol) adalah…',
        opts: [
          { txt: '50 × 100 = 5.000 ml', ok: true },
          { txt: '50 + 100 = 150 ml', hint: 'Kebutuhan per botol dikali banyak botol, bukan dijumlahkan.' },
          {
            txt: '40 × 100 = 4.000 ml',
            hint: '$40$ adalah air untuk beras kencur. Wedang jahe memakai $50$.',
          },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Air untuk beras kencur, $40\\times120=4.800$ ml.',
      visual: drink({ colA: true, pair: 2 }),
      board: { title: 'Hitung air', pins: N1, list: 'LH', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Air untuk kunir asem, $k$ ml dikali $80$ botol, yaitu $80k$ ml.',
      visual: drink({ colA: true, pair: 3 }),
      board: { title: 'Hitung air', pins: N1, list: 'LH', upTo: 3, from: 2 },
    },
    {
      ch: 3,
      cap: 'Ketiganya dijumlahkan harus sama dengan total air, $13.000$ ml. Lihat batang airnya.',
      visual: drink({ view: 'bar', bar: 2 }),
      board: { title: 'Hitung air', pins: N1, list: 'LH', upTo: 4, from: 3 },
    },
    {
      ch: 3,
      cap: '$5.000+4.800=9.800$, jadi $9.800+80k=13.000$. Simpan ke catatan.',
      visual: drink({ view: 'bar', bar: 2 }),
      board: { title: 'Hitung air', pins: N1, list: 'LH', upTo: 5, from: 4, save: ['pE'] },
    },
    // ---- 4 · Cari k ----
    {
      ch: 4,
      cap: 'Angka $9.800$ di ruas kiri pindah ke ruas kanan menjadi $-9.800$, sehingga $80k=3.200$.',
      visual: drink({ view: 'bar', bar: 3 }),
      board: { title: 'Cari k', pins: NE, list: 'LK', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Kedua ruas dibagi $80$, jadi $k=40$ ml. Simpan ke catatan.',
      visual: drink({ view: 'bar', bar: 3 }),
      board: { title: 'Cari k', pins: NE, list: 'LK', upTo: 3, from: 2, save: ['pK'] },
      ask: {
        before: 'c3',
        q: 'Dari $80k=3.200$, berapa $k$?',
        opts: [
          { tex: '40', ok: true },
          { tex: '3{.}200', hint: 'Itu nilai $80k$, belum dibagi $80$.' },
          { tex: '45', hint: '$80\\times45=3.600$, terlalu besar.' },
          { tex: '30', hint: '$80\\times30=2.400$, terlalu kecil.' },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Hati-hati, jangan berhenti di $3.200$. Itu air untuk $80$ botol, sedangkan yang ditanya air untuk satu botol.',
      visual: drink({ colA: true, kval: true }),
      board: { title: 'Cari k', pins: NK, list: 'LK', upTo: 4, from: 3 },
    },
    {
      ch: 4,
      cap: 'Cek, $9.800+40\\cdot80=9.800+3.200=13.000$, cocok.',
      visual: drink({ colA: true, kval: true }),
      board: { title: 'Cari k', pins: NK, list: 'LK', upTo: 5, from: 4 },
    },
    {
      ch: 4,
      cap: 'Jadi satu botol kunir asem butuh $40$ ml air, dan $40$ ml ada di pilihan C. Jawabannya <b class="k-gold">C</b>.',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Cari k', pins: NK, list: 'LK', upTo: 6, from: 5 },
    },
    // tawaran cara alternatif (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6 (catatan)
    {
      ch: 4,
      cap: 'Hitungan tadi sebenarnya perkalian matriks. Mau lihat cara alternatif dengan menuliskan perkaliannya?',
      visual: drink({ colA: true, kval: true }),
      board: { title: 'Cari k', pins: NK, list: 'LK', upTo: 6, from: 6 },
      branch: { yes: 'Ya, lihat perkalian matriks' },
    },
    // ---- 5 · Cara alternatif dengan perkalian matriks (opsional) ----
    {
      ch: 5,
      cap: 'Pesanan ditulis sebagai satu baris, lalu dikali matriks kebutuhan. Hasilnya total jahe, gula merah, dan air.',
      visual: drink({ rc: true }),
      board: { title: 'Perkalian matriks', list: 'LM', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Entri air adalah baris pesanan dikali kolom air, $100\\cdot50+120\\cdot40+80k$, sama dengan hitungan kita.',
      visual: drink({ colA: true, pair: 3 }),
      board: { title: 'Perkalian matriks', list: 'LM', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: 'Kenapa kolom? Baris matriks adalah minuman dan kolomnya bahan, jadi total satu bahan dikumpulkan dari satu kolom.',
      visual: drink({ rc: true, colA: true }),
      board: { title: 'Perkalian matriks', list: 'LM', upTo: 3, from: 2 },
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
      cap: 'Cocokkan dengan pilihan: satu botol kunir asem butuh $40$ ml air. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: NK, list: 'L8', upTo: 1, from: 0 },
      ask: {
        before: 's1',
        q: 'Banyak air untuk satu botol kunir asem adalah…',
        letters: true,
        win: 'Jawabannya <b>C</b>, 40 ml.',
        opts: [
          { txt: '30 ml', hint: 'Totalnya $12.200$ ml, kurang dari $13.000$.' },
          { txt: '35 ml', hint: 'Totalnya $12.600$ ml, kurang dari $13.000$.' },
          { txt: '40 ml', ok: true },
          { txt: '45 ml', hint: 'Totalnya $13.400$ ml, lebih dari $13.000$.' },
          { txt: '50 ml', hint: '$50$ adalah air untuk wedang jahe; totalnya $13.800$ ml.' },
        ],
      },
    },
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">C</span><span>Satu botol kunir asem membutuhkan <b>40 ml</b> air. Seluruh pesanan memakai $5.000+4.800+3.200=13.000$ ml.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: '30 ml',
      ok: false,
      formula: '9800+80\\cdot30=12200',
      why: 'Kurang dari 13.000.',
    },
    {
      label: 'B',
      statement: '35 ml',
      ok: false,
      formula: '9800+80\\cdot35=12600',
      why: 'Kurang dari 13.000.',
    },
    { label: 'C', statement: '40 ml', ok: true, formula: '9800+80\\cdot40=13000', why: 'Tepat 13.000.' },
    {
      label: 'D',
      statement: '45 ml',
      ok: false,
      formula: '9800+80\\cdot45=13400',
      why: 'Lebih dari 13.000.',
    },
    {
      label: 'E',
      statement: '50 ml',
      ok: false,
      formula: '9800+80\\cdot50=13800',
      why: 'Jebakan: 50 adalah air wedang jahe.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 3: Bahan Baku Pabrik Minuman',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Matriks',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Data dari matriks',
        lists: ['LD'],
        why: 'Baris matriks = jenis minuman, kolom = bahan. Hanya kolom air yang memuat $k$.',
      },
      {
        title: 'Hitung air',
        lists: ['LH'],
        why: 'Total satu bahan = jumlah (kebutuhan per botol × banyak botol) untuk tiap jenis minuman.',
      },
      { title: 'Cari k', lists: ['LK'] },
      {
        title: 'Cara alternatif dengan perkalian matriks (opsional)',
        lists: ['LM'],
        why: 'Pesanan (baris) dikali matriks kebutuhan memberi total tiap bahan; entri air memuat $k$.',
      },
    ],
    answer: 'Jawaban: <b>C</b>, 40 ml.',
  },
  done: {
    seal: 'C',
    message:
      'Satu botol kunir asem membutuhkan <b>40 ml</b> air. Seluruh pesanan memakai $5.000+4.800+3.200=13.000$ ml.',
  },
  key: { answer: 'C', cardOk: [false, false, true, false, false], goldRows: ['c3', 'c6', 's1', 'r1', 'r2'] },
  authorNotes: [
    'Modul baru (v1.30) dengan alur guru: data dari matriks (kolom air, pesanan), hitung air per minuman, batang air 13.000 ml, 9.800 pindah ruas (tidak dicoret), k = 40, hati-hati 3.200, cek, lalu langsung dicocokkan dengan pilihan C.',
    'Revisi pemilik (v1.32): bagian "Uji kelima pilihan" (10 langkah) dihapus; cukup k = 40 ml lalu pilihan C. Kartu A–E tetap memuat total tiap pilihan.',
    'Bagian opsional "Cara alternatif": pesanan sebagai baris dikali matriks kebutuhan (bentuk lain dari MᵀP di dokumen), hanya entri air yang dihitung, ditambah alasan "kenapa kolom".',
    'Anomali sumber: total J (4.360) dan GM (4.960) di naskah tidak cocok dengan hitungan; sesuai catatan dokumen, kolom J dan GM tidak dihitung atau dibandingkan di depan siswa.',
    'Batang air (model batang) dari langkah dokumen; nilai total tiap pilihan (12.200, 12.600, 13.000, 13.400, 13.800) di kartu dari kartu A–E dokumen.',
    'Tanpa simbol ":" di baris papan; pembagian ditulis dengan ÷.',
  ],
};

export default q03;
