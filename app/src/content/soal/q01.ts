/**
 * SOAL 1 — Invers Matriks Diagonal (matriks 2×2, pilihan tunggal). Kunci: E.
 * Sumber: docs/pembahasan25.md "SOAL 1", docs/soal25.md no. 1.
 * Alur mengikuti cara Pak Penta membahas di kelas (revisi 20 Okt 2026, dicatat di dokumen):
 * pahami (ordo, jenis matriks diagonal) → cara cepat (balik pembilang–penyebut elemen diagonal, ordo berapa pun)
 * → contoh lain → "hanya untuk matriks diagonal": uji dengan rumus umum → cocokkan pilihan → selesai.
 * Tata letak: panggung penuh dua kolom (pop-up + visual kiri, papan kapur kanan; PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Mat1State } from '../../visuals/mat1';
import { getSoal } from '../index';

const mat = (state: Mat1State): Visual => ({ kind: 'svg', scene: 'mat1', state });
const F = '\\begin{pmatrix}2&0\\\\0&\\frac12\\end{pmatrix}';
const INV = '\\begin{pmatrix}\\frac12&0\\\\0&2\\end{pmatrix}';

const q01: SoalContent = {
  meta: getSoal(1)!,
  sourceRef: 'docs/pembahasan25.md#soal-1',
  layout: 'full',
  paper: {
    html: `<p>Perhatikan <span class="hl hl-red" data-hl="1"><span data-src="s-F">matriks</span></span> berikut!</p>
<div class="soal-math">$$F=\\begin{pmatrix}\\htmlData{src=Fa}{2}&\\htmlData{src=Fb}{0}\\\\\\htmlData{src=Fc}{0}&\\htmlData{src=Fd}{\\frac{1}{2}}\\end{pmatrix}$$</div>
<p><span class="hl hl-gold" data-hl="1"><span data-src="s-inv">Invers</span></span> dari matriks F adalah ....</p>
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
    lede: 'Matriks $F$ hanya punya dua angka di diagonal. Ada cara cepat untuk mencari inversnya, dan kita uji dengan rumus umum.',
    facts: [
      { dt: 'Ordo', dd: '2 × 2' },
      { dt: 'Jenis', dd: 'matriks diagonal' },
      { dt: 'Dicari', dd: 'F⁻¹' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Ordo 2×2, matriks diagonal' },
    { t: 'Cara cepat matriks diagonal', d: 'Balik pembilang dan penyebut' },
    { t: 'Uji dengan rumus umum', d: 'Hasilnya sama' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan dengan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban E' },
  ],
  pins: {
    pInv: { id: 'pInv', gold: true, toks: [T('PI1', 'F^{-1}'), O('PI2', '='), T('PI3', INV)] },
  },
  lists: {
    LK: [
      {
        id: 'k1',
        toks: [H('k1a', 'Diketahui', 'lbl'), T('k1b', 'F'), O('k1c', '='), T('k1d', F, '', '@s-F')],
      },
      { id: 'k2', toks: [H('k2a', 'ordo', 'tx'), T('k2b', '2\\times2')], note: 'dua baris, dua kolom' },
      {
        id: 'k3',
        toks: [H('k3a', 'jenis', 'tx'), H('k3b', 'matriks diagonal', 'blue')],
        note: 'semua elemen di luar diagonal utama bernilai $0$',
      },
      {
        id: 'k4',
        toks: [H('k4a', 'Ditanya', 'lbl'), T('k4b', 'F^{-1}', 'gold', '@s-inv')],
        note: 'invers matriks $F$',
      },
    ],
    L2: [
      {
        id: 'q1',
        toks: [
          T('q1a', '\\begin{pmatrix}a&0\\\\0&d\\end{pmatrix}^{-1}'),
          O('q1b', '='),
          T('q1c', '\\begin{pmatrix}\\frac1a&0\\\\0&\\frac1d\\end{pmatrix}', 'blue'),
        ],
        note: 'cara cepat, berlaku untuk matriks diagonal ordo berapa pun',
        box: 'navy',
      },
      {
        id: 'c1',
        toks: [
          T('c1a', '2', 'blue', '@Fa'),
          O('c1b', '='),
          T('c1c', '\\tfrac21'),
          O('c1d', '\\;\\longrightarrow\\;'),
          T('c1e', '\\tfrac12', 'blue'),
        ],
        note: 'pembilang dan penyebut ditukar',
      },
      {
        id: 'c2',
        toks: [
          T('c2a', '\\tfrac12', 'blue', '@Fd'),
          O('c2b', '\\;\\longrightarrow\\;'),
          T('c2c', '\\tfrac21'),
          O('c2d', '='),
          T('c2e', '2', 'blue'),
        ],
      },
      {
        id: 'c3',
        toks: [T('c3a', 'F^{-1}'), O('c3b', '='), T('c3c', INV, 'gold')],
        note: 'cepat, tanpa menghitung determinan',
        box: 'gold',
      },
    ],
    LE: [
      {
        id: 'e1',
        toks: [
          T('e1a', '\\begin{pmatrix}4&0\\\\0&\\frac13\\end{pmatrix}^{-1}'),
          O('e1b', '='),
          T('e1c', '\\begin{pmatrix}\\frac14&0\\\\0&3\\end{pmatrix}', 'blue'),
        ],
        note: 'contoh ordo $2\\times2$',
      },
      {
        id: 'e2',
        toks: [
          T('e2a', '\\begin{pmatrix}3&0&0\\\\0&-2&0\\\\0&0&\\frac15\\end{pmatrix}^{-1}'),
          O('e2b', '='),
          T('e2c', '\\begin{pmatrix}\\frac13&0&0\\\\0&-\\frac12&0\\\\0&0&5\\end{pmatrix}', 'blue'),
        ],
        note: 'ordo $3\\times3$: tanda tetap, angka dibalik',
      },
    ],
    LU: [
      {
        id: 'g1',
        toks: [
          T('g1a', 'A^{-1}'),
          O('g1b', '='),
          T('g1c', '\\dfrac{1}{ad-bc}'),
          T('g1d', '\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}'),
        ],
        note: 'rumus umum invers $2\\times2$, untuk matriks apa pun',
        box: 'navy',
      },
      {
        id: 'g2',
        toks: [
          T('g2a', '\\det F'),
          O('g2b', '='),
          T('g2c', '2', 'blue', '@Fa'),
          T('g2d', '\\cdot'),
          T('g2e', '\\tfrac12', 'blue', '@Fd'),
          O('g2f', '-'),
          T('g2g', '0', 'red', '@Fb'),
          T('g2h', '\\cdot'),
          T('g2i', '0', 'red', '@Fc'),
        ],
        note: '$ad-bc$',
      },
      {
        id: 'g3',
        toks: [T('g3a', '\\det F'), O('g3b', '='), T('g3c', '1', 'blue')],
        note: 'tidak nol, jadi $F$ punya invers',
        box: 'navy',
      },
      {
        id: 'g4',
        toks: [
          T('g4a', 'F^{-1}'),
          O('g4b', '='),
          T('g4c', '\\dfrac11', '', 'g3c'),
          T('g4d', '\\begin{pmatrix}\\frac12&-0\\\\-0&2\\end{pmatrix}'),
          O('g4e', '='),
          T('g4f', INV, 'blue'),
        ],
        note: 'tukar $a,d$; tanda minus pada $b,c$ → sama dengan cara cepat',
        box: 'navy',
      },
    ],
    // semua kartu sudah terbuka dengan stempelnya: papan cukup memuat jawaban
    L5: [
      { id: 's6', toks: [H('s6a', 'Jawaban', 'lbl'), T('s6b', '\\textbf{E}'), T('s6c', INV)], box: 'gold' },
    ],
    LR: [
      {
        id: 'z1',
        toks: [H('z1a', 'cara cepat', 'tx'), T('z1b', 'a\\to\\tfrac1a,\\ d\\to\\tfrac1d')],
        note: 'khusus matriks diagonal',
        box: 'navy',
      },
      { id: 'z2', toks: [T('z2a', `F^{-1}=${INV}`)], box: 'gold' },
      { id: 'z3', toks: [H('z3a', 'Jawaban', 'lbl'), T('z3b', '\\textbf{E}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan matriks $F$ ini. Ordonya $2\\times2$: dua baris dan dua kolom.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'LK', upTo: 2, from: 0 },
    },
    {
      ch: 1,
      cap: 'Elemen di luar diagonal utama semuanya $0$, jadi $F$ adalah <b>matriks diagonal</b>. Yang ditanya: inversnya, $F^{-1}$.',
      visual: mat({ m: 'F', hl: true }),
      board: { title: 'Pahami soal', list: 'LK', upTo: 4, from: 2 },
    },
    // ---- 2 · Cara cepat matriks diagonal ----
    {
      ch: 2,
      cap: 'Tahukah kalian? Untuk matriks diagonal ordo berapa pun, inversnya bisa dicari dengan cara cepat ini.',
      visual: mat({ m: 'G', hl: true, flip: true }),
      board: { title: 'Cara cepat matriks diagonal', list: 'L2', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Caranya: tukar posisi pembilang dan penyebut elemen $a$ dan $d$. Perhatikan animasinya, cepat bukan?',
      visual: mat({ m: 'F', hl: true, flip: true }),
      board: { title: 'Cara cepat matriks diagonal', list: 'L2', upTo: 4, from: 1 },
      ask: {
        before: 'c1',
        q: 'Elemen $2$ ditulis $\\frac21$. Setelah pembilang dan penyebutnya ditukar, menjadi…',
        opts: [
          { tex: '\\tfrac12', ok: true },
          { tex: '-2', hint: 'Itu lawan dari $2$ (invers penjumlahan). Yang dicari invers perkalian.' },
          { tex: '2', hint: 'Itu belum ditukar. Pembilang $2$ pindah ke bawah, penyebut $1$ naik ke atas.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Contoh lain: matriks diagonal berikut juga cukup dibalik elemen diagonalnya.',
      visual: mat({ m: 'ex2', hl: true, flip: true }),
      board: { title: 'Contoh lain', list: 'LE', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Ordo $3\\times3$ pun sama, tiap elemen diagonal dibalik dan tandanya tetap. Mau tahu kenapa bisa begitu?',
      visual: mat({ m: 'ex3', hl: true, flip: true }),
      board: { title: 'Contoh lain', list: 'LE', upTo: 2, from: 1 },
      optional: {
        label: 'Kenapa bisa begitu?',
        yes: 'Ya, tunjukkan alasannya',
        panel: `<p>Invers adalah matriks yang jika dikalikan menghasilkan matriks identitas $I$. Untuk matriks diagonal:</p>
<p>$$\\begin{pmatrix}a&0\\\\0&d\\end{pmatrix}\\begin{pmatrix}\\frac1a&0\\\\0&\\frac1d\\end{pmatrix}=\\begin{pmatrix}a\\cdot\\frac1a&0\\\\0&d\\cdot\\frac1d\\end{pmatrix}=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}=I$$</p>
<p>Lewat rumus umum hasilnya sama: $\\dfrac{1}{ad}\\begin{pmatrix}d&0\\\\0&a\\end{pmatrix}=\\begin{pmatrix}\\frac1a&0\\\\0&\\frac1d\\end{pmatrix}$, dengan syarat $a\\ne0$ dan $d\\ne0$.</p>
<p>Pada soal ini: $FF^{-1}=\\begin{pmatrix}2\\cdot\\frac12&0\\\\0&\\frac12\\cdot2\\end{pmatrix}=I$. Terbukti.</p>`,
      },
    },
    // ---- 3 · Uji dengan rumus umum ----
    {
      ch: 3,
      cap: 'Ingat, cara cepat ini hanya berlaku untuk matriks diagonal. Untuk matriks lain, pakai rumus umum invers $2\\times2$.',
      visual: mat({ m: 'F' }),
      board: { title: 'Uji dengan rumus umum', list: 'LU', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Mari kita uji pada $F$, hasilnya harus sama. Pertama, hitung determinannya: $ad-bc$.',
      visual: mat({ m: 'F', hl: true }),
      board: { title: 'Uji dengan rumus umum', list: 'LU', upTo: 3, from: 1 },
      ask: {
        before: 'g3',
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
      ch: 3,
      cap: 'Tukar $a$ dan $d$, beri tanda minus pada $b$ dan $c$, lalu bagi dengan $\\det F=1$. Hasilnya sama dengan cara cepat.',
      visual: mat({ m: 'F', adj: true }),
      board: { title: 'Uji dengan rumus umum', list: 'LU', upTo: 4, from: 3 },
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
      cap: 'Cocokkan dengan pilihan: hanya E yang sama dengan $F^{-1}$. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pInv'], list: 'L5', upTo: 1, from: 0 },
      ask: {
        before: 's6',
        q: 'Jawaban yang tepat adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>E</b>.',
        opts: [
          {
            tex: '\\begin{pmatrix}1&0\\\\0&2\\end{pmatrix}',
            hint: 'Hanya elemen $d$ yang dibalik; elemen $a=2$ seharusnya menjadi $\\frac12$.',
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
      why: 'Hanya elemen $d$ yang dibalik.',
    },
    {
      label: 'B',
      statement: '$\\begin{pmatrix}-1&0\\\\0&-2\\end{pmatrix}$',
      ok: false,
      formula: 'F\\cdot B\\ne I',
      why: 'Jebakan: invers dikira lawan.',
    },
    {
      label: 'C',
      statement: '$\\begin{pmatrix}2&0\\\\0&1\\end{pmatrix}$',
      ok: false,
      formula: 'F\\cdot C\\ne I',
      why: 'Elemen $2$ tidak dibalik.',
    },
    {
      label: 'D',
      statement: '$\\begin{pmatrix}-\\frac12&0\\\\0&-2\\end{pmatrix}$',
      ok: false,
      formula: 'F\\cdot D=-I',
      why: 'Angkanya benar, tandanya salah.',
    },
    {
      label: 'E',
      statement: `$${INV}$`,
      ok: true,
      formula: 'F\\cdot E=I',
      why: 'Tiap elemen diagonal dibalik.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 1: Invers Matriks Diagonal',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Matriks',
    sections: [
      { title: 'Pahami soal', lists: ['LK'] },
      {
        title: 'Cara cepat matriks diagonal',
        lists: ['L2', 'LE'],
        sketch: 'mat1',
        why: 'Untuk matriks diagonal ordo berapa pun, invers diperoleh dengan membalik tiap elemen diagonal (tukar pembilang dan penyebut); elemen di luar diagonal tetap $0$. Cara ini hanya berlaku untuk matriks diagonal.',
      },
      {
        title: 'Uji dengan rumus umum',
        lists: ['LU'],
        why: 'Untuk $A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}$ berlaku $A^{-1}=\\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}$ asalkan $ad-bc\\ne0$.',
      },
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
    goldRows: ['c3', 's6', 'z2', 'z3'],
  },
  authorNotes: [
    'Alur Bagian 1–3 mengikuti cara Pak Penta membahas di kelas (pesan 20 Okt 2026): ordo dan jenis matriks → cara cepat matriks diagonal → contoh lain → "hanya untuk matriks diagonal", uji dengan rumus umum.',
    'Contoh tambahan diminta pemilik: diag(4, 1/3) → diag(1/4, 3) dan diag(3, −2, 1/5) → diag(1/3, −1/2, 5); dicatat di dokumen.',
    'Konten opsional "Kenapa bisa begitu?" menggabungkan pemeriksaan F·F⁻¹ (Bagian 3 lama) dan penurunan dari rumus umum.',
    'Analisis kartu dipadatkan menjadi satu langkah (semua kartu terbuka) dengan pertanyaan berhuruf A–E.',
  ],
};

export default q01;
