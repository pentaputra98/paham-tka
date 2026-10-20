/**
 * SOAL 6 — Sisa Pembagian Suku Banyak (teorema pembagian, kesamaan koefisien; pilihan tunggal).
 * Sumber: docs/pembahasan25.md "SOAL 6", docs/soal25.md no. 6. Kunci: C (a + b = −1).
 * Visual: papan saja (kertas soal tetap tampil sebagai sumber terbang).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent } from '../../engine/types';
import { getSoal } from '../index';

const PAPER = { kind: 'soal', hl: 2 } as const;

const q06: SoalContent = {
  meta: getSoal(6)!,
  sourceRef: 'docs/pembahasan25.md#soal-6',
  paper: {
    html: `<p>Diketahui suku banyak $\\htmlClass{hl hl-red}{\\htmlData{src=s-f, hl=1}{f(x)=x^{4}+ax^{3}+bx^{2}+x-6}}$ apabila dibagi oleh $\\htmlClass{hl hl-blue}{\\htmlData{src=s-p, hl=2}{x^{2}+x+1}}$ menghasilkan sisa $\\htmlClass{hl hl-red}{\\htmlData{src=s-r, hl=2}{5x-1}}$. Nilai dari $\\htmlClass{hl hl-gold}{\\htmlData{src=s-tanya, hl=2}{a+b}}=....$</p>
<ol class="abc">
<li><span>A.</span>11</li><li><span>B.</span>5</li><li><span>C.</span>−1</li><li><span>D.</span>−5</li><li><span>E.</span>−7</li>
</ol>`,
    srcNames: ['s-f', 's-p', 's-r', 's-tanya'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Suku banyak',
    titleLines: ['Pembahasan Soal', 'Sisa <span class="accent">Pembagian</span>', 'Suku Banyak'],
    lede: '$f(x)=x^4+ax^3+bx^2+x-6$ dibagi $x^2+x+1$ bersisa $5x-1$. Dari informasi itu kita cari $a$ dan $b$.',
    facts: [
      { dt: 'Pembagi', dd: 'x² + x + 1' },
      { dt: 'Sisa', dd: '5x − 1' },
      { dt: 'Dicari', dd: 'a + b' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Mengubah sisa menjadi persamaan', d: 'f(x) − (5x − 1) habis dibagi' },
    { t: 'Menyamakan koefisien', d: 'p = 1, q = −5' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan dengan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban C' },
  ],
  pins: {
    // dipecah per suku agar tiap koefisien dapat terbang sendiri ke baris penyamaan
    pG: {
      id: 'pG',
      toks: [T('PG1', 'x^4'), T('PG2', '+ax^3'), T('PG3', '+bx^2'), T('PG4', '-4x'), T('PG5', '-5')],
    },
    pH: {
      id: 'pH',
      toks: [
        T('PH1', 'x^4'),
        T('PH2', '+(p+1)x^3'),
        T('PH3', '+(p+q+1)x^2'),
        T('PH4', '+(p+q)x'),
        T('PH5', '+q'),
      ],
    },
    pPQ: { id: 'pPQ', toks: [T('PQ1', 'p=1'), O('PQ2', ','), T('PQ3', 'q=-5')] },
    pAB: { id: 'pAB', gold: true, toks: [T('PA1', 'a+b'), O('PA2', '='), T('PA3', '-1')] },
  },
  lists: {
    L1: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      { id: 'k2', toks: [T('k2a', 'f(x)=x^4+ax^3+bx^2+x-6', 'red', '@s-f')] },
      { id: 'k3', toks: [H('k3a', 'pembagi', 'tx'), T('k3b', 'x^2+x+1', 'blue', '@s-p')] },
      { id: 'k4', toks: [H('k4a', 'sisa', 'tx'), T('k4b', '5x-1', 'red', '@s-r')] },
      { id: 'k5', toks: [H('k5a', 'Ditanya', 'lbl'), T('k5b', 'a+b', 'gold', '@s-tanya')] },
    ],
    L2: [
      {
        id: 'a1',
        toks: [
          T('a1a', 'f(x)'),
          O('a1b', '='),
          T('a1c', '(x^2+x+1)', 'blue', '@s-p'),
          T('a1d', 'h(x)'),
          O('a1e', '+'),
          T('a1f', '(5x-1)', 'red', '@s-r'),
        ],
        note: 'teorema pembagian',
      },
      {
        id: 'a2',
        toks: [
          T('a2a', 'f(x)'),
          O('a2b', '-'),
          T('a2c', '(5x-1)', 'red', 'a1f'),
          O('a2d', '='),
          T('a2e', '(x^2+x+1)\\,h(x)'),
        ],
        note: 'sisa pindah ruas',
      },
      {
        id: 'a3',
        toks: [
          T('a3a', 'x^4+ax^3+bx^2+x-6', '', '@s-f'),
          T('a3b', '-5x+1', 'red'),
          O('a3c', '='),
          T('a3d', '(x^2+x+1)\\,h(x)'),
        ],
        note: 'tanda sisa berubah',
      },
      {
        id: 'a4',
        toks: [T('a4a', 'x^4+ax^3+bx^2-4x-5', 'blue'), O('a4b', '='), T('a4c', '(x^2+x+1)\\,h(x)')],
        note: '$x-5x=-4x$; $-6+1=-5$',
        box: 'navy',
      },
    ],
    L2b: [
      {
        id: 'b1',
        toks: [T('b1a', 'h(x)'), O('b1b', '='), T('b1c', 'x^2+px+q')],
        note: 'koefisien $x^2$ harus 1 agar $x^4$ muncul',
      },
      { id: 'b2', toks: [T('b2a', '(x^2+x+1)'), T('b2b', '(x^2+px+q)', '', 'b1c')], note: 'kalikan' },
      {
        id: 'b3',
        // dua baris rata "=" agar muat di papan sempit tanpa memotong rumus
        toks: [
          T('b3b', '\\begin{aligned}&=x^4+(p+1)x^3\\\\&\\quad+(p+q+1)x^2+(p+q)x+q\\end{aligned}', 'blue'),
        ],
        note: 'kumpulkan per pangkat',
        box: 'navy',
      },
    ],
    L3: [
      {
        id: 'c1',
        toks: [
          H('c1a', 'konstanta', 'tx'),
          O('c1b', ':'),
          T('c1c', 'q', '', 'PH5'),
          O('c1d', '='),
          T('c1e', '-5', 'blue', 'PG5'),
        ],
        note: 'suku tetap',
        box: 'navy',
      },
      {
        id: 'c2',
        toks: [
          H('c2a', 'koefisien <i>x</i>', 'tx'),
          O('c2b', ':'),
          T('c2c', 'p+q', '', 'PH4'),
          O('c2d', '='),
          T('c2e', '-4', '', 'PG4'),
        ],
      },
      {
        id: 'c3',
        toks: [T('c3a', 'p'), T('c3b', '-5', '', 'c1e'), O('c3c', '='), T('c3d', '-4')],
        note: 'substitusi $q=-5$',
      },
      {
        id: 'c4',
        toks: [T('c4a', 'p'), O('c4b', '='), T('c4c', '1', 'blue')],
        note: '$-4+5=1$',
        box: 'navy',
      },
    ],
    L3b: [
      {
        id: 'd1',
        toks: [
          H('d1a', 'koefisien <i>x</i><sup>3</sup>', 'tx'),
          O('d1b', ':'),
          T('d1c', 'a', '', 'PG2'),
          O('d1d', '='),
          T('d1e', 'p+1', '', 'PH2'),
        ],
      },
      {
        id: 'd2',
        toks: [
          T('d2a', 'a'),
          O('d2b', '='),
          T('d2c', '1', '', 'PQ1'),
          T('d2d', '+1'),
          O('d2e', '='),
          T('d2f', '2', 'blue'),
        ],
        box: 'navy',
      },
      {
        id: 'd3',
        toks: [
          H('d3a', 'koefisien <i>x</i><sup>2</sup>', 'tx'),
          O('d3b', ':'),
          T('d3c', 'b', '', 'PG3'),
          O('d3d', '='),
          T('d3e', 'p+q+1', '', 'PH3'),
        ],
      },
      {
        id: 'd4',
        toks: [
          T('d4a', 'b'),
          O('d4b', '='),
          T('d4c', '1', '', 'PQ1'),
          T('d4d', '+(-5)', '', 'PQ3'),
          T('d4e', '+1'),
          O('d4f', '='),
          T('d4g', '-3', 'blue'),
        ],
        box: 'navy',
      },
      {
        id: 'd5',
        toks: [
          T('d5a', 'a+b'),
          O('d5b', '='),
          T('d5c', '2', '', 'd2f'),
          T('d5d', '+(-3)', '', 'd4g'),
          O('d5e', '='),
          T('d5f', '-1', 'gold'),
        ],
        box: 'gold',
      },
    ],
    L5: [
      {
        id: 's1',
        toks: [T('s1a', '\\text{A}', 'sp'), T('s1b', '11\\ne-1', '', 'PA3'), T('s1c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's2',
        toks: [T('s2a', '\\text{B}', 'sp'), T('s2b', '5\\ne-1', '', 'PA3'), T('s2c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's3',
        toks: [T('s3a', '\\text{C}', 'sp'), T('s3b', '-1=-1', '', 'PA3'), T('s3c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      {
        id: 's4',
        toks: [T('s4a', '\\text{D}', 'sp'), T('s4b', '-5\\ne-1', '', 'PA3'), T('s4c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's5',
        toks: [T('s5a', '\\text{E}', 'sp'), T('s5b', '-7\\ne-1', '', 'PA3'), T('s5c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's6',
        toks: [H('s6a', 'Jawaban', 'lbl'), T('s6b', '\\textbf{C}'), T('s6c', '\\;-1')],
        box: 'gold',
      },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', 'a=2,\\ b=-3')], note: '$f(x)=x^4+2x^3-3x^2+x-6$', box: 'navy' },
      { id: 'r2', toks: [T('r2a', 'a+b=-1')], box: 'gold' },
      { id: 'r3', toks: [H('r3a', 'Jawaban', 'lbl'), T('r3b', '\\textbf{C}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Baca soal. Ada dua huruf yang belum diketahui: $a$ dan $b$.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 2, from: 0 },
    },
    {
      ch: 1,
      cap: '<b>Diketahui</b>: pembagi dan sisa. <b>Ditanya</b>: $a+b$.',
      visual: PAPER,
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 5, from: 2 },
    },
    // ---- 2 · Mengubah sisa menjadi persamaan ----
    {
      ch: 2,
      cap: 'Kurangkan sisa $5x-1$ dari $f(x)$. Yang tersisa pasti habis dibagi $x^2+x+1$.',
      visual: PAPER,
      board: { title: 'Menyingkirkan sisa', list: 'L2', upTo: 4, from: 0 },
      ask: {
        before: 'a4',
        q: 'Suku $x$ setelah dikurangi sisa $(5x-1)$ menjadi…',
        opts: [
          { tex: '-4x', ok: true },
          { tex: '6x', hint: 'Sisa <b>dikurangkan</b>, jadi $x-5x$, bukan $x+5x$.' },
          { tex: 'x', hint: 'Suku $x$ ikut berkurang oleh $5x$.' },
        ],
      },
    },
    {
      ch: 2,
      cap: '$f$ berderajat 4 dan pembagi berderajat 2, jadi hasil bagi berderajat 2 dengan koefisien depan 1: $x^2+px+q$.',
      visual: PAPER,
      board: { title: 'Hasil bagi berderajat dua', pins: ['pG'], list: 'L2b', upTo: 3, from: 0 },
    },
    // ---- 3 · Menyamakan koefisien ----
    {
      ch: 3,
      cap: 'Samakan koefisien $x^4+ax^3+bx^2-4x-5$ dengan hasil perkalian tadi, mulai dari suku $x$ dan konstanta.',
      visual: PAPER,
      board: { title: 'Mencari q dan p', pins: ['pG', 'pH'], list: 'L3', upTo: 4, from: 0 },
      ask: {
        before: 'c4',
        q: 'Dari $p-5=-4$, berapa $p$?',
        opts: [
          { tex: '1', ok: true },
          { tex: '-9', hint: 'Jangan mengurangkan lagi. Pindahkan $-5$ ke kanan menjadi $+5$.' },
          { tex: '-1', hint: '$-4+5=1$, bukan $-1$.' },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Samakan koefisien $x^3$ dan $x^2$, lalu jumlahkan $a$ dan $b$.',
      visual: PAPER,
      board: { title: 'Mencari a dan b', pins: ['pG', 'pH', 'pPQ'], list: 'L3b', upTo: 5, from: 0 },
    },
    // ---- 4 · Catatan lengkap ----
    {
      ch: 4,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 5 · Cocokkan dengan pilihan ----
    {
      ch: 5,
      cap: 'Hasil kita $a+b=-1$. Sekarang cocokkan dengan kelima pilihan.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pAB'], list: 'L5', upTo: 0, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pilihan A, $11$: tidak sama dengan $2+(-3)$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pAB'], list: 'L5', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pilihan B, $5$: itu koefisien $x$ pada sisa $5x-1$, bukan $a+b$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pAB'], list: 'L5', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: 'Pilihan C, $-1$: $a=2$ dan $b=-3$ (<b class="k-gold">benar</b>).',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pAB'], list: 'L5', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: 'Pilihan D, $-5$: itu $q$, konstanta hasil bagi, bukan $a+b$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 4 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pAB'], list: 'L5', upTo: 4, from: 3 },
    },
    {
      ch: 5,
      cap: 'Pilihan E, $-7$: jangan menjumlahkan $b$ dengan $q$ atau $p$ (<b class="k-red">salah</b>). Pilih jawabannya di papan tulis.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pAB'], list: 'L5', upTo: 6, from: 4 },
      ask: {
        before: 's6',
        q: 'Jawaban yang tepat adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>C</b>.',
        opts: [
          { tex: '11', hint: 'Tidak sama dengan $2+(-3)$.' },
          { tex: '5', hint: '$5$ adalah koefisien $x$ pada sisa, bukan $a+b$.' },
          { tex: '-1', ok: true },
          { tex: '-5', hint: '$-5$ adalah $q$, konstanta hasil bagi.' },
          { tex: '-7', hint: 'Tidak sama dengan $2+(-3)$.' },
        ],
      },
    },
    // ---- 6 · Selesai ----
    {
      ch: 6,
      cap: '<span class="verdict"><span class="seal">C</span><span>$f(x)=x^4+2x^3-3x^2+x-6$, sehingga $a=2$, $b=-3$, dan $a+b=-1$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
    },
  ],
  cards: [
    { label: 'A', statement: '$11$', ok: false, formula: '11\\ne-1', why: 'Tidak sama dengan $2+(-3)$.' },
    {
      label: 'B',
      statement: '$5$',
      ok: false,
      formula: '5\\ne-1',
      why: '$5$ adalah koefisien $x$ pada sisa $5x-1$, bukan $a+b$.',
    },
    { label: 'C', statement: '$-1$', ok: true, formula: '2+(-3)=-1', why: '$a=2$, $b=-3$.' },
    {
      label: 'D',
      statement: '$-5$',
      ok: false,
      formula: '-5\\ne-1',
      why: '$-5$ adalah $q$ (konstanta hasil bagi), bukan $a+b$.',
    },
    {
      label: 'E',
      statement: '$-7$',
      ok: false,
      formula: '-7\\ne-1',
      why: 'Jangan menjumlahkan $b$ dengan $q$ atau $p$.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 6: Sisa Pembagian Suku Banyak',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Suku banyak',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Mengubah sisa menjadi persamaan',
        lists: ['L2', 'L2b'],
        why: 'Jika $f(x)$ dibagi $P(x)$ menghasilkan hasil bagi $h(x)$ dan sisa $r(x)$, maka $f(x)=P(x)\\,h(x)+r(x)$. Karena itu $f(x)-r(x)$ habis dibagi $P(x)$.',
      },
      { title: 'Menyamakan koefisien', lists: ['L3', 'L3b'] },
    ],
    answer: 'Jawaban: <b>C</b>, $a+b=-1$ (dengan $a=2$, $b=-3$).',
  },
  done: { seal: 'C', message: '$f(x)=x^4+2x^3-3x^2+x-6$, sehingga $a=2$, $b=-3$, dan $a+b=-1$.' },
  key: {
    answer: 'C',
    cardOk: [false, false, true, false, false],
    goldRows: ['d5', 's6', 'r2', 'r3'],
  },
  authorNotes: [
    'Bagian 1: baris k1–k5 disusun dari stabilo dan pop-up 1.1–1.2.',
    'Bagian 2–3: pin dipecah per suku ($x^4$, $+ax^3$, …) agar koefisien terbang sendiri; papan dibagi "Hasil bagi berderajat dua", "Mencari q dan p", "Mencari a dan b".',
    'Pop-up langkah 3.2 disusun dari judul langkah; pin $p=1$, $q=-5$ untuk d2 dan d4.',
    'Kartu: rumus singkat disusun dari kolom alasan (dokumen tidak memuat kolom rumus untuk soal ini).',
  ],
};

export default q06;
