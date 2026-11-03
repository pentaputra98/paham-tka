/**
 * SOAL 6 — Sisa Pembagian Suku Banyak (Horner-Kino, kesamaan koefisien; pilihan tunggal). Kunci: C (a + b = −1).
 * Sumber: docs/pembahasan25.md "SOAL 6", docs/soal25.md no. 6.
 * Alur revisi pemilik v1.36 (dicatat di dokumen):
 *  - pahami: f(x) memuat a dan b; dibagi x² + x + 1 bersisa 5x − 1; ditanya a + b;
 *  - susun Horner-Kino: koefisien 1, a, b, 1, −6; x² + x + 1 = 0 → x² = −x − 1, pengali −1 dan −1; hanya tiga
 *    kolom pertama yang dikali (hasil bagi berderajat 2), dua kolom terakhir untuk sisa;
 *  - hitung bertahap dengan angka terbang dan panah: turun, kali ×(−1) ke dua kolom berikutnya, jumlah per kolom;
 *    hasil bagi x² + (a − 1)x + (b − a), sisa (2 − b)x + (a − b − 6);
 *  - samakan dengan sisa soal: 2 − b = 5 → b = −3; a − b − 6 = −1 → a = 2; a + b = −1 (pilihan C), cek sisa;
 *  - bagian opsional "Kesamaan koefisien" (alur utama dokumen).
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Hk6State } from '../../visuals/hk6';
import { getSoal } from '../index';

const hk = (state: Hk6State): Visual => ({ kind: 'svg', scene: 'hk6', state });
/** skema Horner-Kino lengkap (semua op selesai) */
const DONE: Hk6State = { m: true, cut: true, k0: 9, k: 9 };
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
/** pilihan (docs/soal25.md no. 6) */
const OPT = ['11', '5', '−1', '−5', '−7'];

const q06: SoalContent = {
  meta: getSoal(6)!,
  sourceRef: 'docs/pembahasan25.md#soal-6',
  layout: 'full',
  paper: {
    html: `<p>Diketahui suku banyak $\\htmlClass{hl hl-red}{\\htmlData{src=s-f, hl=1}{f(x)=x^{4}+ax^{3}+bx^{2}+x-6}}$ apabila dibagi oleh $\\htmlClass{hl hl-blue}{\\htmlData{src=s-p, hl=2}{x^{2}+x+1}}$ menghasilkan sisa $\\htmlClass{hl hl-red}{\\htmlData{src=s-r, hl=2}{5x-1}}$. Nilai dari $\\htmlClass{hl hl-gold}{\\htmlData{src=s-tanya, hl=2}{a+b}}=....$</p>
<ol class="abc">
${LETTERS.map((o, i) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">${OPT[i]}</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-f', 's-p', 's-r', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['h-c1', 'h-s1', 'h-s2', 'h-s3', 'h-s4', 'h-s5', 'h-g4', 'h-g5'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Suku banyak',
    titleLines: ['Pembahasan Soal', 'Sisa <span class="accent">Pembagian</span>', 'Suku Banyak'],
    lede: '$f(x)=x^4+ax^3+bx^2+x-6$ dibagi $x^2+x+1$ bersisa $5x-1$. Kita bagi dengan Horner-Kino, lalu samakan sisanya untuk mencari $a$ dan $b$.',
    facts: [
      { dt: 'Pembagi', dd: 'x² + x + 1' },
      { dt: 'Sisa', dd: '5x − 1' },
      { dt: 'Dicari', dd: 'a + b' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Susun Horner-Kino', d: 'Koefisien dan pengali' },
    { t: 'Hitung kolom a dan b', d: 'Turun, kali, jumlah' },
    { t: 'Hitung kolom sisa', d: 'Sisa (2 − b)x + (a − b − 6)' },
    { t: 'Samakan sisanya', d: 'b = −3, a = 2' },
    { t: 'Jawaban', d: 'a + b = −1' },
    { t: 'Kesamaan koefisien', d: 'Opsional: cara alternatif', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban C' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pK: { id: 'pK', toks: [H('PK1', 'pengali', 'tx', 'h2a'), T('PK2', '-1,\\ -1', '', 'h2c')] },
    pR: { id: 'pR', toks: [H('PR1', 'sisa', 'tx', 'u4a'), T('PR2', '(2-b)x+(a-b-6)', '', 'u4b')] },
    pB: { id: 'pB', toks: [T('PB1', 'b', '', 'c4a'), O('PB2', '='), T('PB3', '-3', '', 'c4c')] },
    pA: { id: 'pA', toks: [T('PA1', 'a', '', 'c8a'), O('PA2', '='), T('PA3', '2', '', 'c8f')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [T('k1b', 'f(x)=x^4+ax^3+bx^2+x-6', 'red', '@s-f')],
        note: 'diketahui; ada dua huruf yang belum diketahui, $a$ dan $b$',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', 'dibagi', 'tx'),
          T('k2b', 'x^2+x+1', 'blue', '@s-p'),
          O('k2c', '\\to'),
          H('k2d', 'sisa', 'tx'),
          T('k2e', '5x-1', 'red', '@s-r'),
        ],
      },
      { id: 'k3', toks: [H('k3a', 'Ditanya', 'lbl'), T('k3b', 'a+b', 'gold', '@s-tanya')] },
    ],
    // susun Horner-Kino
    LH: [
      {
        id: 'h1',
        toks: [H('h1a', 'koefisien', 'tx'), T('h1b', '1,\\ a,\\ b,\\ 1,\\ -6', '', '@s-f')],
        note: 'urut dari $x^4$ sampai konstanta, tidak ada yang terlewat',
      },
      {
        id: 'h2',
        toks: [
          H('h2a', 'pembagi', 'tx'),
          T('h2b', 'x^2=-x-1', '', '@s-p'),
          O('h2d', '\\to'),
          T('h2c', '-1,\\ -1', 'blue'),
        ],
        note: 'dari $x^2+x+1=0$; pengali $-1$ (untuk $x$) dan $-1$ (konstanta); simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'h3',
        toks: [H('h3a', 'Hati-hati', 'lbl'), H('h3b', 'hanya 3 kolom pertama yang dikali', 'tx')],
        note: 'hasil bagi berderajat $4-2=2$, jadi $3$ angka; $2$ kolom terakhir untuk sisa',
      },
    ],
    // hitung kolom a dan b
    LP: [
      {
        id: 'p1',
        toks: [
          T('p1a', '1', '', '@h-c1'),
          H('p1b', 'turun', 'tx'),
          O('p1c', '\\to'),
          T('p1d', '1\\cdot(-1)=-1', 'blue'),
        ],
        note: 'hasilnya ditulis di kolom $a$ (baris $1$) dan kolom $b$ (baris $2$)',
      },
      {
        id: 'p2',
        toks: [
          H('p2a', 'kolom a', 'tx'),
          T('p2b', 'a+(-1)'),
          O('p2c', '='),
          T('p2d', 'a-1', 'blue', '@h-s2'),
        ],
        note: 'jumlahkan angka di kolom itu',
      },
      {
        id: 'p3',
        toks: [T('p3a', '(a-1)\\cdot(-1)', '', 'p2d'), O('p3b', '='), T('p3c', '1-a', 'blue')],
        note: 'ditulis di kolom $b$ (baris $1$) dan kolom $1$ (baris $2$)',
      },
      {
        id: 'p4',
        toks: [
          H('p4a', 'kolom b', 'tx'),
          T('p4b', 'b+(-1)+(1-a)'),
          O('p4c', '='),
          T('p4d', 'b-a', 'blue', '@h-s3'),
        ],
        note: '$-1+1=0$, tinggal $b-a$',
      },
    ],
    // hitung kolom sisa
    LU: [
      {
        id: 'u1',
        toks: [T('u1a', '(b-a)\\cdot(-1)', '', '@h-s3'), O('u1b', '='), T('u1c', 'a-b', 'blue')],
        note: 'ditulis di dua kolom terakhir; perkalian berhenti di sini',
      },
      {
        id: 'u2',
        toks: [
          H('u2a', 'kolom 1', 'tx'),
          T('u2b', '1+(a-b)+(1-a)'),
          O('u2c', '='),
          T('u2d', '2-b', 'blue', '@h-s4'),
        ],
        note: '$a-a=0$ dan $1+1=2$',
      },
      {
        id: 'u3',
        toks: [
          H('u3a', 'kolom −6', 'tx'),
          T('u3b', '-6+(a-b)'),
          O('u3c', '='),
          T('u3d', 'a-b-6', 'blue', '@h-s5'),
        ],
      },
      {
        id: 'u4',
        toks: [H('u4a', 'sisa', 'lbl'), T('u4b', '(2-b)x+(a-b-6)', 'blue', '@h-s4')],
        note: 'hasil bagi $x^2+(a-1)x+(b-a)$; simpan ke catatan',
        box: 'navy',
      },
    ],
    // samakan sisa hitungan dengan sisa soal
    LS: [
      {
        id: 'c1',
        toks: [T('c1a', '(2-b)x+(a-b-6)', '', 'PR2'), O('c1b', '='), T('c1c', '5x-1', 'red', '@h-g4')],
        note: 'sisa hitungan sama dengan sisa soal',
        box: 'navy',
      },
      {
        id: 'c2',
        toks: [
          H('c2a', 'koefisien x', 'tx'),
          T('c2b', '2-b', '', '@h-s4'),
          O('c2c', '='),
          T('c2d', '5', 'red', '@h-g4'),
        ],
      },
      {
        id: 'c3',
        toks: [
          T('c3a', '-b'),
          O('c3b', '='),
          T('c3c', '5'),
          T('c3d', '-2', 'red', 'c2b'),
          O('c3e', '='),
          T('c3f', '3'),
        ],
        note: '$2$ di ruas kiri pindah ke ruas kanan menjadi $-2$',
      },
      {
        id: 'c4',
        toks: [T('c4a', 'b'), O('c4b', '='), T('c4c', '-3', 'blue')],
        note: 'kedua ruas dikali $-1$; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'c5',
        toks: [
          H('c5a', 'konstanta', 'tx'),
          T('c5b', 'a-b-6', '', '@h-s5'),
          O('c5c', '='),
          T('c5d', '-1', 'red', '@h-g5'),
        ],
      },
      {
        id: 'c6',
        toks: [T('c6a', 'a-(-3)-6', '', 'PB3'), O('c6b', '='), T('c6c', '-1')],
        note: '$b=-3$ dimasukkan',
      },
      {
        id: 'c7',
        toks: [T('c7a', 'a-3'), O('c7b', '='), T('c7c', '-1')],
        note: '$-(-3)-6=3-6=-3$',
      },
      {
        id: 'c8',
        toks: [
          T('c8a', 'a'),
          O('c8b', '='),
          T('c8c', '-1'),
          T('c8d', '+3', 'red', 'c7a'),
          O('c8e', '='),
          T('c8f', '2', 'blue'),
        ],
        note: '$-3$ pindah ruas menjadi $+3$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LJ: [
      {
        id: 'j1',
        toks: [
          T('j1a', 'a+b'),
          O('j1b', '='),
          T('j1c', '2+(-3)', '', 'PA3'),
          O('j1d', '='),
          T('j1e', '-1', 'gold'),
        ],
        note: 'ada di pilihan C',
        box: 'gold',
      },
      {
        id: 'j2',
        toks: [
          T('j2b', '(2+3)x+(2+3-6)'),
          O('j2c', '='),
          T('j2d', '5x-1'),
          T('j2e', '\\;\\checkmark', 'blue'),
        ],
        note: 'cek, $a=2$ dan $b=-3$ dimasukkan ke sisa hitungan',
      },
      {
        id: 'j3',
        toks: [H('j3a', 'Hati-hati', 'lbl'), T('j3b', '5'), H('j3c', 'bukan', 'tx'), T('j3d', 'a+b')],
        note: '$5$ adalah koefisien $x$ pada sisa soal (pilihan B)',
      },
    ],
    // kesamaan koefisien (opsional): alur utama dokumen
    LK: [
      {
        id: 'a1',
        toks: [T('a1a', 'x^4+ax^3+bx^2-4x-5', 'blue')],
        note: '$f(x)-(5x-1)$, dengan $x-5x=-4x$ dan $-6+1=-5$; habis dibagi $x^2+x+1$',
        box: 'navy',
      },
      {
        id: 'a2',
        toks: [H('a2a', 'hasil bagi', 'tx'), T('a2b', 'x^2+px+q')],
        note: 'berderajat $2$, koefisien depannya $1$ agar muncul $x^4$',
      },
      {
        id: 'a3',
        toks: [T('a3a', 'x^4+(p+1)x^3+(p+q+1)x^2')],
        note: 'hasil kali $(x^2+x+1)(x^2+px+q)$, dikumpulkan per pangkat',
      },
      { id: 'a4', toks: [T('a4a', '+(p+q)x+q', 'blue')], note: 'lanjutan baris di atas' },
      {
        id: 'a5',
        toks: [H('a5a', 'konstanta', 'tx'), T('a5b', 'q=-5', 'blue')],
        note: 'suku tetap $-5$ sama dengan $q$',
      },
      {
        id: 'a6',
        toks: [
          H('a6a', 'koefisien x', 'tx'),
          T('a6b', 'p+q=-4'),
          O('a6c', '\\Rightarrow'),
          T('a6d', 'p=1', 'blue'),
        ],
        note: '$p-5=-4$, jadi $p=-4+5=1$',
      },
      {
        id: 'a7',
        toks: [T('a7a', 'a=p+1=2'), O('a7b', ','), T('a7c', 'b=p+q+1=-3', 'blue')],
        note: 'koefisien $x^3$ dan $x^2$; sama dengan Horner-Kino',
        box: 'navy',
      },
      {
        id: 'a8',
        toks: [T('a8a', 'x^2+(a-1)x+(b-a)'), O('a8b', '='), T('a8c', 'x^2+x-5')],
        note: 'hasil bagi Horner-Kino, sama dengan $x^2+px+q$',
      },
    ],
    L7: [{ id: 'v1', toks: [H('v1a', 'Jawaban', 'lbl'), T('v1b', '\\textbf{C}')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', 'a=2'), O('r1b', ','), T('r1c', 'b=-3')],
        note: '$f(x)=x^4+2x^3-3x^2+x-6$',
        box: 'navy',
      },
      { id: 'r2', toks: [T('r2a', 'a+b=-1')], box: 'gold' },
      { id: 'r3', toks: [H('r3a', 'Jawaban', 'lbl'), T('r3b', '\\textbf{C}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. $f(x)$ memuat dua huruf yang belum diketahui, $a$ dan $b$.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Diketahui $f(x)$ dibagi $x^2+x+1$ bersisa $5x-1$. Yang ditanya $a+b$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 3, from: 1 },
    },
    // ---- 2 · Susun Horner-Kino ----
    {
      ch: 2,
      cap: 'Kita bagi dengan cara Horner-Kino. Tulis koefisien $f(x)$ berurutan dari $x^4$, yaitu $1$, $a$, $b$, $1$, $-6$.',
      visual: hk({ k: 0 }),
      board: { title: 'Susun Horner-Kino', list: 'LH', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Pembagi $x^2+x+1=0$ berarti $x^2=-x-1$. Jadi pengalinya $-1$ dan $-1$, ditulis di kiri.',
      visual: hk({ k: 0, m: true }),
      board: { title: 'Susun Horner-Kino', list: 'LH', upTo: 2, from: 1, save: ['pK'] },
      ask: {
        before: 'h2',
        q: 'Dari $x^2+x+1=0$, nilai $x^2$ sama dengan…',
        opts: [
          { tex: '-x-1', ok: true },
          { tex: 'x+1', hint: '$x$ dan $1$ pindah ruas, jadi tandanya berubah menjadi $-x-1$.' },
          { tex: '-x+1', hint: 'Angka $1$ juga pindah ruas, menjadi $-1$.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Hati-hati, hanya tiga kolom pertama yang dikali, karena hasil baginya berderajat $4-2=2$. Dua kolom terakhir untuk sisa.',
      visual: hk({ k: 0, m: true, cut: true }),
      board: { title: 'Susun Horner-Kino', pins: ['pK'], list: 'LH', upTo: 3, from: 2 },
    },
    // ---- 3 · Hitung kolom a dan b ----
    {
      ch: 3,
      cap: 'Turunkan angka $1$. Lalu kalikan $1$ dengan kedua pengali, hasilnya $-1$ ditulis di kolom $a$ dan kolom $b$.',
      visual: hk({ m: true, cut: true, k0: 0, k: 2 }),
      board: { title: 'Hitung kolom a dan b', pins: ['pK'], list: 'LP', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Jumlahkan kolom $a$, $a+(-1)=a-1$.',
      visual: hk({ m: true, cut: true, k0: 2, k: 3 }),
      board: { title: 'Hitung kolom a dan b', pins: ['pK'], list: 'LP', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Kalikan $a-1$ dengan kedua pengali, $(a-1)\\cdot(-1)=1-a$. Hasilnya ditulis di kolom $b$ dan kolom $1$.',
      visual: hk({ m: true, cut: true, k0: 3, k: 4 }),
      board: { title: 'Hitung kolom a dan b', pins: ['pK'], list: 'LP', upTo: 3, from: 2 },
      ask: {
        before: 'p3',
        q: 'Hasil $(a-1)\\cdot(-1)$ adalah…',
        opts: [
          { tex: '1-a', ok: true },
          { tex: 'a-1', hint: 'Dikali $-1$, jadi semua tanda berubah, $-a+1=1-a$.' },
          { tex: '-a-1', hint: '$-1$ dikali $-1$ menjadi $+1$, bukan $-1$.' },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Jumlahkan kolom $b$, $b+(-1)+(1-a)=b-a$.',
      visual: hk({ m: true, cut: true, k0: 4, k: 5 }),
      board: { title: 'Hitung kolom a dan b', pins: ['pK'], list: 'LP', upTo: 4, from: 3 },
    },
    // ---- 4 · Hitung kolom sisa ----
    {
      ch: 4,
      cap: 'Kalikan $b-a$ dengan kedua pengali, hasilnya $a-b$ di dua kolom terakhir. Ini perkalian terakhir, karena batas sisa sudah tercapai.',
      visual: hk({ m: true, cut: true, k0: 5, k: 6 }),
      board: { title: 'Hitung kolom sisa', pins: ['pK'], list: 'LU', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Jumlahkan dua kolom terakhir, $1+(a-b)+(1-a)=2-b$ dan $-6+(a-b)=a-b-6$.',
      visual: hk({ m: true, cut: true, k0: 6, k: 8 }),
      board: { title: 'Hitung kolom sisa', pins: ['pK'], list: 'LU', upTo: 3, from: 1 },
    },
    {
      ch: 4,
      cap: 'Tiga angka pertama adalah hasil bagi $x^2+(a-1)x+(b-a)$. Dua angka terakhir adalah sisanya, $(2-b)x+(a-b-6)$.',
      visual: hk({ m: true, cut: true, k0: 8, k: 9 }),
      board: { title: 'Hitung kolom sisa', pins: ['pK'], list: 'LU', upTo: 4, from: 3, save: ['pR'] },
    },
    // ---- 5 · Samakan sisanya ----
    {
      ch: 5,
      cap: 'Sisa hasil hitungan harus sama dengan sisa di soal, yaitu $5x-1$.',
      visual: hk({ ...DONE, cmp: true }),
      board: { title: 'Samakan sisanya', pins: ['pR'], list: 'LS', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Samakan koefisien $x$, $2-b=5$. Angka $2$ pindah ruas, $-b=3$, jadi $b=-3$.',
      visual: hk({ ...DONE, cmp: true, hl: 'x' }),
      board: { title: 'Samakan sisanya', pins: ['pR'], list: 'LS', upTo: 4, from: 1, save: ['pB'] },
      ask: {
        before: 'c4',
        q: 'Dari $2-b=5$, nilai $b$ adalah…',
        opts: [
          { tex: '-3', ok: true },
          { tex: '3', hint: 'Itu nilai $-b$. Kedua ruas dikali $-1$, jadi $b=-3$.' },
          { tex: '7', hint: '$2$ pindah ruas menjadi $-2$, jadi $-b=5-2$.' },
          { tex: '-7', hint: '$2$ pindah ruas menjadi $-2$, bukan $+2$.' },
        ],
      },
    },
    {
      ch: 5,
      cap: 'Samakan konstantanya, $a-b-6=-1$. Masukkan $b=-3$, jadi $a-3=-1$ dan $a=2$.',
      visual: hk({ ...DONE, cmp: true, hl: 'c' }),
      board: { title: 'Samakan sisanya', pins: ['pR', 'pB'], list: 'LS', upTo: 8, from: 4, save: ['pA'] },
    },
    // ---- 6 · Jawaban ----
    {
      ch: 6,
      cap: 'Jadi $a+b=2+(-3)=-1$, pilihan C. Cek, sisanya $(2+3)x+(2+3-6)=5x-1$, sesuai soal.',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Jawaban', pins: ['pA', 'pB'], list: 'LJ', upTo: 2, from: 0 },
    },
    {
      ch: 6,
      cap: 'Hati-hati, $5$ adalah koefisien $x$ pada sisa, bukan $a+b$. Pilihan B hanya mengambil angka dari soal.',
      visual: { kind: 'soal', hl: 0, focus: 's-oB' },
      board: { title: 'Jawaban', pins: ['pA', 'pB'], list: 'LJ', upTo: 3, from: 2 },
    },
    // tawaran cara alternatif (opsional): Ya masuk Bagian 7, Tidak/Lewati langsung ke Bagian 8
    {
      ch: 6,
      cap: 'Mau lihat cara alternatif dengan kesamaan koefisien, tanpa Horner-Kino?',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Jawaban', pins: ['pA', 'pB'], list: 'LJ', upTo: 3, from: 3 },
      branch: { yes: 'Ya, lihat kesamaan koefisien' },
    },
    // ---- 7 · Kesamaan koefisien (opsional) ----
    {
      ch: 7,
      cap: 'Sisa dikurangkan dulu, $f(x)-(5x-1)=x^4+ax^3+bx^2-4x-5$. Hasilnya pasti habis dibagi $x^2+x+1$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 1, from: 0 },
      ask: {
        before: 'a1',
        q: 'Suku $x$ setelah dikurangi sisa $(5x-1)$ menjadi…',
        opts: [
          { tex: '-4x', ok: true },
          { tex: '6x', hint: 'Sisa dikurangkan, jadi $x-5x$, bukan $x+5x$.' },
          { tex: 'x', hint: 'Suku $x$ ikut berkurang oleh $5x$.' },
        ],
      },
    },
    {
      ch: 7,
      cap: 'Hasil baginya berderajat dua, $x^2+px+q$. Kalikan dengan pembagi, lalu kumpulkan per pangkat.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 4, from: 1 },
    },
    {
      ch: 7,
      cap: 'Samakan koefisiennya. Konstanta memberi $q=-5$, dan koefisien $x$ memberi $p+q=-4$, jadi $p=1$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 6, from: 4 },
    },
    {
      ch: 7,
      cap: 'Koefisien $x^3$ dan $x^2$ memberi $a=p+1=2$ dan $b=p+q+1=-3$, sama dengan Horner-Kino.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 7, from: 6 },
    },
    {
      ch: 7,
      cap: 'Tahukah kalian? Hasil bagi Horner-Kino $x^2+(a-1)x+(b-a)$ menjadi $x^2+x-5$, sama dengan $x^2+px+q$.',
      visual: hk(DONE),
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 8, from: 7 },
    },
    // ---- 8 · Catatan lengkap ----
    {
      ch: 8,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 9 · Cocokkan pilihan ----
    {
      ch: 9,
      cap: 'Cocokkan dengan pilihan. $a=2$ dan $b=-3$, jadi $a+b=-1$; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pA', 'pB'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'v1',
        q: 'Nilai $a+b$ adalah…',
        letters: true,
        win: 'Jawabannya <b>C</b>, $a+b=-1$.',
        opts: [
          { txt: '11', hint: 'Tidak sama dengan $2+(-3)$.' },
          { txt: '5', hint: '$5$ adalah koefisien $x$ pada sisa $5x-1$, bukan $a+b$.' },
          { txt: '−1', ok: true },
          { txt: '−5', hint: '$-5$ adalah konstanta hasil bagi, bukan $a+b$.' },
          { txt: '−7', hint: 'Tidak sama dengan $2+(-3)$.' },
        ],
      },
    },
    // ---- 10 · Selesai ----
    {
      ch: 10,
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
      why: '$-5$ adalah konstanta hasil bagi ($b-a$), bukan $a+b$.',
    },
    { label: 'E', statement: '$-7$', ok: false, formula: '-7\\ne-1', why: 'Tidak sama dengan $2+(-3)$.' },
  ],
  notes: {
    title: 'Pembahasan Soal 6: Sisa Pembagian Suku Banyak',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Suku banyak',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Horner-Kino',
        lists: ['LH', 'LP', 'LU'],
        why: 'Pembagi $x^2+x+1$ diubah menjadi $x^2=-x-1$, sehingga pengalinya $-1$ dan $-1$. Turunkan, kalikan ke dua kolom berikutnya, lalu jumlahkan per kolom. Dua kolom terakhir adalah sisa.',
      },
      {
        title: 'Samakan sisanya',
        lists: ['LS', 'LJ'],
        why: 'Sisa hasil hitungan sama dengan sisa soal, jadi koefisien $x$ dan konstantanya masing-masing sama.',
      },
      {
        title: 'Kesamaan koefisien (opsional)',
        lists: ['LK'],
        why: 'Jika $f(x)$ dibagi $P(x)$ bersisa $r(x)$, maka $f(x)-r(x)$ habis dibagi $P(x)$.',
      },
    ],
    answer: 'Jawaban: <b>C</b>, $a+b=-1$ (dengan $a=2$, $b=-3$).',
  },
  done: { seal: 'C', message: '$f(x)=x^4+2x^3-3x^2+x-6$, sehingga $a=2$, $b=-3$, dan $a+b=-1$.' },
  key: {
    answer: 'C',
    cardOk: [false, false, true, false, false],
    goldRows: ['j1', 'v1', 'r2', 'r3'],
  },
  authorNotes: [
    'Revisi pemilik (v1.36): jalur utama Horner-Kino dengan animasi penuh, yaitu angka terbang dan panah cara menghitung (turun, kali ×(−1) ke dua kolom berikutnya, jumlah per kolom); menggantikan pembagian bersusun v1.35. Adegan baru hk6, adegan div6 dihapus.',
    'Angka skema adalah turunan aljabar dari pembagian dokumen: hasil bagi x² + (a − 1)x + (b − a) dan sisa (2 − b)x + (a − b − 6) (sama dengan f(ω) pada metode kedua dokumen).',
    'b = −3 dan a = 2 dari penyamaan sisa (dokumen d2, d4); angka pindah ruas terbang, tidak dicoret. Pertanyaan cepat baru x² = −x − 1, (a − 1)·(−1), dan 2 − b = 5, dengan pengecoh kesalahan tanda.',
    'Kesamaan koefisien (alur utama dokumen, a1–d5) menjadi bagian opsional; Tahukah kalian: hasil bagi Horner-Kino x² + (a − 1)x + (b − a) = x² + x − 5 sama dengan x² + px + q.',
    'Jebakan pilihan B (5 = koefisien x pada sisa) dan D (−5 = konstanta hasil bagi) dari kartu dokumen.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q06;
