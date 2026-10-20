/**
 * SOAL 1 — Invers Matriks Diagonal (matriks 2×2, pilihan tunggal).
 * Sumber: docs/pembahasan25.md "SOAL 1", docs/soal25.md no. 1. Kunci: E.
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Mat1Stage } from '../../visuals/mat1';
import { getSoal } from '../index';

const mat = (stage: Mat1Stage): Visual => ({ kind: 'svg', scene: 'mat1', state: { stage } });
const F = '\\begin{pmatrix}2&0\\\\0&\\frac12\\end{pmatrix}';
const INV = '\\begin{pmatrix}\\frac12&0\\\\0&2\\end{pmatrix}';
const ADJ = '\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}';

const q1: SoalContent = {
  meta: getSoal(1)!,
  sourceRef: 'docs/pembahasan25.md#soal-1',
  paper: {
    html: `<p>Perhatikan <span class="hl hl-red" data-hl="1"><span data-src="s-F">matriks</span></span> berikut!</p>
<div class="soal-math">$$F=\\begin{pmatrix}\\htmlData{src=Fa}{2}&\\htmlData{src=Fb}{0}\\\\\\htmlData{src=Fc}{0}&\\htmlData{src=Fd}{\\frac{1}{2}}\\end{pmatrix}$$</div>
<p><span class="hl hl-gold" data-hl="2"><span data-src="s-inv">Invers</span></span> dari matriks F adalah ....</p>
<ol class="abc">
<li><span>A.</span>$\\begin{pmatrix}1&0\\\\0&2\\end{pmatrix}$</li>
<li><span>B.</span>$\\begin{pmatrix}-1&0\\\\0&-2\\end{pmatrix}$</li>
<li><span>C.</span>$\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$</li>
<li><span>D.</span>$\\begin{pmatrix}-\\frac{1}{2}&0\\\\0&-2\\end{pmatrix}$</li>
<li><span>E.</span>$\\begin{pmatrix}\\frac{1}{2}&0\\\\0&2\\end{pmatrix}$</li>
</ol>`,
    srcNames: ['s-F', 's-inv', 'Fa', 'Fb', 'Fc', 'Fd'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Matriks',
    titleLines: ['Pembahasan Soal', 'Invers <span class="accent">Matriks</span>', 'Diagonal'],
    lede: 'Matriks $F$ hanya punya dua angka di diagonal. Kita cari matriks yang jika dikalikan dengan $F$ menghasilkan matriks identitas.',
    facts: [
      { dt: 'Ordo', dd: '2 × 2' },
      { dt: 'Elemen diagonal', dd: '2 dan 1/2' },
      { dt: 'Dicari', dd: 'F⁻¹' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Menghitung invers', d: 'Determinan, adjoin, invers' },
    { t: 'Periksa dengan perkalian', d: 'Opsional: F · F⁻¹ = I' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan dengan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban E' },
  ],
  pins: {
    pF: { id: 'pF', toks: [T('PF1', 'F'), O('PF2', '='), T('PF3', F)] },
    pDet: { id: 'pDet', toks: [T('PD1', '\\det F'), O('PD2', '='), T('PD3', '1')] },
    pInv: { id: 'pInv', gold: true, toks: [T('PI1', 'F^{-1}'), O('PI2', '='), T('PI3', INV)] },
  },
  lists: {
    LK: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      {
        id: 'k2',
        toks: [T('k2a', 'F'), O('k2b', '='), T('k2c', F, 'red', '@s-F')],
        note: 'matriks diagonal',
      },
      {
        id: 'k3',
        toks: [H('k3a', 'Ditanya', 'lbl'), T('k3b', 'F^{-1}', 'gold', '@s-inv')],
        note: 'invers matriks $F$',
      },
    ],
    L2: [
      {
        id: 'a1',
        toks: [T('a1a', '\\det F'), O('a1b', '='), T('a1c', 'ad-bc')],
        note: 'rumus determinan 2×2',
      },
      {
        id: 'a2',
        toks: [
          T('a2a', '\\det F'),
          O('a2b', '='),
          T('a2c', '2', 'blue', '@Fa'),
          T('a2d', '\\cdot'),
          T('a2e', '\\tfrac12', 'blue', '@Fd'),
          O('a2f', '-'),
          T('a2g', '0', 'red', '@Fb'),
          T('a2h', '\\cdot'),
          T('a2i', '0', 'red', '@Fc'),
        ],
        note: 'masukkan elemen $F$',
      },
      {
        id: 'a3',
        toks: [T('a3a', '\\det F'), O('a3b', '='), T('a3c', '1-0')],
        note: '$2\\cdot\\frac12=1$',
      },
      {
        id: 'a4',
        toks: [T('a4a', '\\det F'), O('a4b', '='), T('a4c', '1', 'blue')],
        note: 'tidak nol, jadi $F$ punya invers',
        box: 'navy',
      },
    ],
    L2b: [
      { id: 'b1', toks: [T('b1a', ADJ)], note: 'pola adjoin' },
      { id: 'b2', toks: [T('b2a', '\\begin{pmatrix}\\frac12&-0\\\\-0&2\\end{pmatrix}')], note: '$-0=0$' },
      {
        id: 'b3',
        toks: [T('b3a', INV, 'blue')],
        note: 'tanda minus pada nol tidak berpengaruh',
        box: 'navy',
      },
      {
        id: 'c1',
        toks: [T('c1a', 'F^{-1}'), O('c1b', '='), T('c1c', '\\dfrac{1}{\\det F}'), T('c1d', ADJ)],
        note: 'rumus invers',
      },
      {
        id: 'c2',
        toks: [
          T('c2a', 'F^{-1}'),
          O('c2b', '='),
          T('c2c', '\\dfrac{1}{1}', '', 'PD3'),
          T('c2d', INV, '', 'b3a'),
        ],
        note: 'masukkan hasil sebelumnya',
      },
      {
        id: 'c3',
        toks: [T('c3a', 'F^{-1}'), O('c3b', '='), T('c3c', INV, 'gold')],
        note: 'dikali $1$ tidak mengubah apa pun',
        box: 'gold',
      },
    ],
    L5: [
      {
        id: 's1',
        toks: [
          T('s1a', '\\text{A}', 'sp'),
          T('s1b', 'F\\cdot A=\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}\\ne I'),
          T('s1c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's2',
        toks: [
          T('s2a', '\\text{B}', 'sp'),
          T('s2b', 'F\\cdot B=\\begin{pmatrix}-2&0\\\\0&-1\\end{pmatrix}\\ne I'),
          T('s2c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's3',
        toks: [
          T('s3a', '\\text{C}', 'sp'),
          T('s3b', 'F\\cdot C=\\begin{pmatrix}4&0\\\\0&\\frac12\\end{pmatrix}\\ne I'),
          T('s3c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's4',
        toks: [T('s4a', '\\text{D}', 'sp'), T('s4b', 'F\\cdot D=-I'), T('s4c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's5',
        toks: [T('s5a', '\\text{E}', 'sp'), T('s5b', 'F\\cdot E=I'), T('s5c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      { id: 's6', toks: [H('s6a', 'Jawaban', 'lbl'), T('s6b', '\\textbf{E}'), T('s6c', INV)], box: 'gold' },
    ],
    LP: [
      {
        id: 'p1',
        toks: [T('p1a', 'FF^{-1}'), O('p1b', '='), T('p1c', F), T('p1d', INV, '', 'PI3')],
      },
      {
        id: 'p2',
        toks: [
          T('p2a', 'FF^{-1}'),
          O('p2b', '='),
          T('p2c', '\\begin{pmatrix}2\\cdot\\frac12&0\\\\0&\\frac12\\cdot2\\end{pmatrix}'),
        ],
        note: 'baris × kolom',
      },
      {
        id: 'p3',
        toks: [
          T('p3a', 'FF^{-1}'),
          O('p3b', '='),
          T('p3c', '\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}=I', 'blue'),
        ],
        note: 'terbukti',
        box: 'navy',
      },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', '\\det F=1')], box: 'navy' },
      { id: 'r2', toks: [T('r2a', `F^{-1}=${INV}`)], note: 'elemen diagonal dibalik', box: 'gold' },
      { id: 'r3', toks: [H('r3a', 'Jawaban', 'lbl'), T('r3b', '\\textbf{E}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Baca soalnya dulu. Santai, belum perlu menghitung apa pun.',
      visual: { kind: 'soal', hl: 0 },
      board: { title: 'Diketahui dan ditanya', list: 'LK', upTo: 0, from: 0 },
    },
    {
      ch: 1,
      cap: 'Yang <b>diketahui</b>: matriks $F$ berukuran 2×2.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Diketahui dan ditanya', list: 'LK', upTo: 2, from: 0 },
    },
    {
      ch: 1,
      cap: 'Yang <b>ditanya</b>: invers $F$, yaitu matriks yang jika dikali $F$ menghasilkan $I$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Diketahui dan ditanya', list: 'LK', upTo: 3, from: 2 },
    },
    // ---- 2 · Menghitung invers ----
    {
      ch: 2,
      cap: 'Rumus invers membutuhkan determinan. Hitung $ad-bc$ dari $F$.',
      visual: mat('diag'),
      board: { title: 'Determinan F', pins: ['pF'], list: 'L2', upTo: 4, from: 0 },
      ask: {
        before: 'a3',
        q: 'Berapa $2\\cdot\\frac{1}{2}-0\\cdot0$?',
        opts: [
          { tex: '1', ok: true },
          {
            tex: '2',
            hint: 'Itu hanya elemen $a$. Determinan adalah $ad-bc$, jadi $a$ harus dikali $d=\\frac12$.',
          },
          { tex: '\\tfrac12', hint: 'Itu hanya elemen $d$. Kalikan $a=2$ dengan $d=\\frac12$.' },
          { tex: '0', hint: 'Nol adalah hasil $bc$. Kurangkan $bc$ dari $ad$, bukan sebaliknya.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Tukar posisi $a$ dan $d$, lalu ubah tanda $b$ dan $c$.',
      visual: mat('adj'),
      board: { title: 'Adjoin dan invers', pins: ['pDet'], list: 'L2b', upTo: 3, from: 0 },
    },
    {
      ch: 2,
      cap: 'Kalikan adjoin dengan $\\frac{1}{\\det F}=\\frac{1}{1}$. Hasilnya langsung invers $F$.',
      visual: mat('compare'),
      board: { title: 'Adjoin dan invers', pins: ['pDet'], list: 'L2b', upTo: 6, from: 3 },
    },
    // ---- 3 · Periksa dengan perkalian (opsional) ----
    {
      ch: 3,
      cap: 'Mau memeriksa hasilnya dengan perkalian $FF^{-1}$?',
      visual: mat('compare'),
      // baris p1–p3 ada di catatan; di langkah ini ditawarkan lewat panel Ya/Tidak
      board: { title: 'Pemeriksaan', pins: ['pInv'], list: 'LP', upTo: 0, from: 0 },
      optional: {
        label: 'Pemeriksaan F · F⁻¹',
        yes: 'Ya, periksa',
        panel: `<p>Kalikan $F$ dengan $F^{-1}$ (baris × kolom):</p>
<p>$$FF^{-1}=\\begin{pmatrix}2&0\\\\0&\\frac12\\end{pmatrix}\\begin{pmatrix}\\frac12&0\\\\0&2\\end{pmatrix}=\\begin{pmatrix}2\\cdot\\frac12&0\\\\0&\\frac12\\cdot2\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}=I$$</p>
<p>Terbukti: hasilnya matriks identitas.</p>`,
      },
    },
    // ---- 4 · Catatan lengkap ----
    {
      ch: 4,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 5 · Cocokkan dengan pilihan (kartu A–E) ----
    {
      ch: 5,
      cap: 'Setiap pilihan diuji dengan mengalikannya dengan $F$. Hasilnya harus $I$.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pInv'], list: 'L5', upTo: 0, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pilihan A: hanya elemen $d$ yang dibalik; elemen $a$ seharusnya $\\frac12$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pInv'], list: 'L5', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pilihan B: jebakan, invers dikira lawan (dinegatifkan), padahal itu invers penjumlahan. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pInv'], list: 'L5', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: 'Pilihan C: bukan hasil rumus; elemen $2$ tidak berubah. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pInv'], list: 'L5', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: 'Pilihan D: angkanya benar tetapi tandanya salah; hasilnya $-I$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 4 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pInv'], list: 'L5', upTo: 4, from: 3 },
    },
    {
      ch: 5,
      cap: 'Pilihan E: kebalikan tiap elemen diagonal (<b class="k-gold">benar</b>). Pilih jawabannya di papan tulis.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pInv'], list: 'L5', upTo: 6, from: 4 },
      ask: {
        before: 's6',
        q: 'Jawaban yang tepat adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>E</b>.',
        opts: [
          {
            tex: '\\begin{pmatrix}1&0\\\\0&2\\end{pmatrix}',
            hint: 'Hanya elemen $d$ yang dibalik; elemen $a$ seharusnya $\\frac12$.',
          },
          {
            tex: '\\begin{pmatrix}-1&0\\\\0&-2\\end{pmatrix}',
            hint: 'Invers perkalian bukan lawan (negatif). Hasil kalinya harus $I$.',
          },
          {
            tex: '\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}',
            hint: 'Elemen $2$ seharusnya menjadi $\\frac12$.',
          },
          {
            tex: '\\begin{pmatrix}-\\frac12&0\\\\0&-2\\end{pmatrix}',
            hint: 'Tandanya salah: $F$ dikali matriks ini menghasilkan $-I$.',
          },
          { tex: INV, ok: true },
        ],
      },
    },
    // ---- 6 · Selesai ----
    {
      ch: 6,
      cap: `<span class="verdict"><span class="seal">E</span><span>Invers $F$ adalah $${INV}$. Elemen diagonalnya dibalik: $2\\to\\frac12$ dan $\\frac12\\to2$.</span></span>`,
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: '$\\begin{pmatrix}1&0\\\\0&2\\end{pmatrix}$',
      ok: false,
      formula: 'F\\cdot A\\ne I',
      why: 'Hanya elemen $d$ yang dibalik; elemen $a$ seharusnya $\\frac12$.',
    },
    {
      label: 'B',
      statement: '$\\begin{pmatrix}-1&0\\\\0&-2\\end{pmatrix}$',
      ok: false,
      formula: 'F\\cdot B\\ne I',
      why: 'Jebakan: invers dikira lawan. Itu invers penjumlahan.',
    },
    {
      label: 'C',
      statement: '$\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$',
      ok: false,
      formula: 'F\\cdot C\\ne I',
      why: 'Bukan hasil rumus; elemen $2$ tidak berubah.',
    },
    {
      label: 'D',
      statement: '$\\begin{pmatrix}-\\frac12&0\\\\0&-2\\end{pmatrix}$',
      ok: false,
      formula: 'F\\cdot D=-I',
      why: 'Angkanya benar tetapi tandanya salah.',
    },
    {
      label: 'E',
      statement: `$${INV}$`,
      ok: true,
      formula: 'F\\cdot E=I',
      why: 'Kebalikan tiap elemen diagonal.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 1: Invers Matriks Diagonal',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Matriks',
    sections: [
      { title: 'Pahami soal', lists: ['LK'] },
      {
        title: 'Menghitung invers',
        lists: ['L2', 'L2b'],
        sketch: 'mat1',
        why: 'Untuk $A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ berlaku $A^{-1}=\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$ asalkan $ad-bc\\ne0$. Invers matriks diagonal adalah matriks diagonal dengan elemen kebalikan.',
      },
      { title: 'Periksa dengan perkalian', lists: ['LP'] },
    ],
    answer: `Jawaban: <b>E</b>, $F^{-1}=${INV}$.`,
  },
  done: {
    seal: 'E',
    message: `Invers $F$ adalah $${INV}$. Elemen diagonalnya dibalik: $2\\to\\frac12$ dan $\\frac12\\to2$.`,
  },
  key: {
    answer: 'E',
    cardOk: [false, false, false, false, true],
    goldRows: ['c3', 's6', 'r2', 'r3'],
  },
  authorNotes: [
    'Bagian 2: papan dibagi dua judul ("Determinan F" untuk a1–a4, "Adjoin dan invers" untuk b1–c3) agar baris matriks muat; pin det F menjadi sumber 1/1 pada c2.',
    'Baris b2 ditulis kapur sebagai satu matriks (elemen tidak dapat terbang satu per satu di dalam satu matriks KaTeX); pertukaran a ↔ d diperlihatkan oleh adegan grid matriks.',
    'Bagian 3 (opsional): baris p1–p3 ditampilkan sebagai panel Ya/Tidak.',
    'Ringkasan LR: det F memakai kotak navy (bukan emas) karena emas hanya untuk jawaban (PRD).',
    'Bagian 5: pop-up per kartu dari kolom alasan; papan ringkasan s1–s6 dan pertanyaan berhuruf A–E.',
  ],
};

export default q1;
