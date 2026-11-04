/**
 * SOAL 6 — Sisa Pembagian Suku Banyak (Horner-Kino, kesamaan koefisien; pilihan tunggal). Kunci: C (a + b = −1).
 * Sumber: docs/pembahasan25.md "SOAL 6", docs/soal25.md no. 6.
 * Alur revisi pemilik v1.36–v1.38 (dicatat di dokumen; v1.38: koefisien diambil dari f(x) ke tabel, kali k₂ dulu lalu k₁,
 *  nama pengali selalu diganti angkanya):
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
const HK: Hk6State = { m: true, co: true, x: true, cut: true };
const DONE: Hk6State = { ...HK, k0: 12, k: 12 };
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
  visualSrc: ['h-c1', 'h-k1', 'h-k2', 'h-s1', 'h-s2', 'h-s3', 'h-s4', 'h-s5', 'h-g4', 'h-g5'],
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
    { t: 'Syarat Horner-Kino', d: 'Pembagi kuadrat, k₁ dan k₂' },
    { t: 'Susun Horner-Kino', d: 'Koefisien dan tanda X' },
    { t: 'Hitung kolom a', d: 'Turun, kali k₁, kali k₂, jumlah' },
    { t: 'Hitung kolom b', d: 'Kali k₁, kali k₂, jumlah' },
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
    pK: { id: 'pK', toks: [T('PK1', 'k_1=-1', '', 'h3g'), O('PK0', ','), T('PK2', 'k_2=-1', '', 'h4g')] },
    pR: { id: 'pR', toks: [H('PR1', 'sisa', 'tx', 'u5a'), T('PR2', '(2-b)x+(a-b-6)', '', 'u5b')] },
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
    // syarat Horner-Kino dan k₁, k₂
    LK0: [
      {
        id: 'h1',
        toks: [H('h1a', 'syarat', 'lbl'), H('h1b', 'pembagi berderajat 2', 'tx'), T('h1c', 'ax^2+bx+c')],
        note: 'Horner-Kino hanya untuk pembagi kuadrat',
      },
      {
        id: 'h2',
        toks: [T('h2a', 'x^2+x+1', 'blue', '@s-p'), O('h2b', '\\to'), T('h2c', 'a=1,\\ b=1,\\ c=1')],
        note: 'koefisien pembagi, bukan $a$ dan $b$ pada $f(x)$',
      },
      {
        id: 'h3',
        toks: [
          T('h3a', 'k_1'),
          O('h3b', '='),
          T('h3c', '-\\tfrac{c}{a}'),
          O('h3d', '='),
          T('h3e', '-\\tfrac{1}{1}'),
          O('h3f', '='),
          T('h3g', '-1', 'blue'),
        ],
        note: 'ditulis di baris atas',
        box: 'navy',
      },
      {
        id: 'h4',
        toks: [
          T('h4a', 'k_2'),
          O('h4b', '='),
          T('h4c', '-\\tfrac{b}{a}'),
          O('h4d', '='),
          T('h4e', '-\\tfrac{1}{1}'),
          O('h4f', '='),
          T('h4g', '-1', 'blue'),
        ],
        note: 'ditulis di baris bawah; simpan ke catatan',
        box: 'navy',
      },
    ],
    // susun Horner-Kino
    LH: [
      {
        id: 'h5',
        toks: [H('h5a', 'koefisien', 'tx'), T('h5b', '1,\\ a,\\ b,\\ 1,\\ -6', '', '@h-c1')],
        note: '$x^4$ berarti $1x^4$ dan $x$ berarti $1x$; urut dari $x^4$ sampai konstanta',
      },
      {
        id: 'h6',
        toks: [
          H('h6a', 'baris', 'tx'),
          T('h6b', 'k_2', '', '@h-k2'),
          H('h6c', 'mulai kolom ke-2', 'tx'),
          O('h6d', ','),
          H('h6e', 'baris', 'tx'),
          T('h6f', 'k_1', '', '@h-k1'),
          H('h6g', 'kolom ke-3', 'tx'),
        ],
        note: 'tempat yang tidak terisi diberi tanda X',
      },
      {
        id: 'h7',
        toks: [H('h7a', 'Hati-hati', 'lbl'), H('h7b', 'hanya 3 kolom pertama yang dikali', 'tx')],
        note: 'hasil bagi berderajat $4-2=2$; garis batas dan X di ujung tanda perkalian berhenti',
      },
    ],
    // hitung kolom a: kali k₂ dulu (baris bawah), lalu naik ke k₁
    LP: [
      {
        id: 'p1',
        toks: [T('p1a', '1', '', '@h-c1'), H('p1b', 'turun ke baris hasil', 'tx')],
        note: 'angka pertama selalu turun',
      },
      {
        id: 'p2',
        toks: [
          T('p2a', '1\\cdot k_2', '', '@h-s1'),
          O('p2b', '='),
          T('p2c', '1\\cdot(-1)', '', '@h-k2'),
          O('p2d', '='),
          T('p2e', '-1', 'blue'),
        ],
        note: 'ditulis di baris $k_2$, satu kolom ke kanan (kolom $a$)',
      },
      {
        id: 'p3',
        toks: [
          T('p3a', '1\\cdot k_1', '', '@h-s1'),
          O('p3b', '='),
          T('p3c', '1\\cdot(-1)', '', '@h-k1'),
          O('p3d', '='),
          T('p3e', '-1', 'blue'),
        ],
        note: 'naik ke baris $k_1$, dua kolom ke kanan (kolom $b$)',
      },
      {
        id: 'p4',
        toks: [
          H('p4a', 'kolom a', 'tx'),
          T('p4b', 'a+(-1)'),
          O('p4c', '='),
          T('p4d', 'a-1', 'blue', '@h-s2'),
        ],
        note: 'baris $k_1$ di kolom ini X, jadi tidak ikut',
      },
    ],
    // hitung kolom b
    LQ: [
      {
        id: 'q1',
        toks: [
          T('q1a', '(a-1)\\cdot k_2', '', '@h-s2'),
          O('q1b', '='),
          T('q1c', '(a-1)\\cdot(-1)', '', '@h-k2'),
          O('q1d', '='),
          T('q1e', '1-a', 'blue'),
        ],
        note: 'ditulis di baris $k_2$, kolom $b$',
      },
      {
        id: 'q2',
        toks: [
          T('q2a', '(a-1)\\cdot k_1', '', '@h-s2'),
          O('q2b', '='),
          T('q2c', '(a-1)\\cdot(-1)', '', '@h-k1'),
          O('q2d', '='),
          T('q2e', '1-a', 'blue'),
        ],
        note: 'naik ke baris $k_1$, kolom $1$',
      },
      {
        id: 'q3',
        toks: [
          H('q3a', 'kolom b', 'tx'),
          T('q3b', 'b+(-1)+(1-a)'),
          O('q3c', '='),
          T('q3d', 'b-a', 'blue', '@h-s3'),
        ],
        note: '$-1+1=0$, tinggal $b-a$',
      },
    ],
    // hitung kolom sisa
    LU: [
      {
        id: 'u1',
        toks: [
          T('u1a', '(b-a)\\cdot k_2', '', '@h-s3'),
          O('u1b', '='),
          T('u1c', '(b-a)\\cdot(-1)', '', '@h-k2'),
          O('u1d', '='),
          T('u1e', 'a-b', 'blue'),
        ],
        note: 'ditulis di baris $k_2$, kolom $1$; sesudahnya X',
      },
      {
        id: 'u2',
        toks: [
          T('u2a', '(b-a)\\cdot k_1', '', '@h-s3'),
          O('u2b', '='),
          T('u2c', '(b-a)\\cdot(-1)', '', '@h-k1'),
          O('u2d', '='),
          T('u2e', 'a-b', 'blue'),
        ],
        note: 'naik ke baris $k_1$, kolom $-6$; tempat terakhir, perkalian berhenti',
      },
      {
        id: 'u3',
        toks: [
          H('u3a', 'kolom 1', 'tx'),
          T('u3b', '1+(1-a)+(a-b)'),
          O('u3c', '='),
          T('u3d', '2-b', 'blue', '@h-s4'),
        ],
        note: '$a-a=0$ dan $1+1=2$',
      },
      {
        id: 'u4',
        toks: [
          H('u4a', 'kolom −6', 'tx'),
          T('u4b', '-6+(a-b)'),
          O('u4c', '='),
          T('u4d', 'a-b-6', 'blue', '@h-s5'),
        ],
        note: 'baris $k_2$ di kolom ini X',
      },
      {
        id: 'u5',
        toks: [H('u5a', 'sisa', 'lbl'), T('u5b', '(2-b)x+(a-b-6)', 'blue', '@h-s4')],
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
    // ---- 2 · Syarat Horner-Kino ----
    {
      ch: 2,
      cap: 'Tahukah kalian? Cara Horner-Kino bisa dipakai bila pembaginya berderajat dua, berbentuk $ax^2+bx+c$, seperti $x^2+x+1$ di soal ini.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Syarat Horner-Kino', list: 'LK0', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Cari dulu $k_1=-\\frac{c}{a}=-1$ untuk baris atas dan $k_2=-\\frac{b}{a}=-1$ untuk baris bawah.',
      visual: hk({ k: 0, m: true }),
      board: { title: 'Syarat Horner-Kino', list: 'LK0', upTo: 4, from: 2, save: ['pK'] },
      ask: {
        before: 'h3',
        q: 'Untuk pembagi $x^2+x+1$, nilai $k_1=-\\frac{c}{a}$ adalah…',
        opts: [
          { tex: '-1', ok: true },
          { tex: '1', hint: 'Jangan lupa tanda minus di depan, $-\\frac{1}{1}=-1$.' },
          { tex: '-6', hint: '$-6$ adalah konstanta $f(x)$. $c$ di sini konstanta pembagi, yaitu $1$.' },
        ],
      },
    },
    // ---- 3 · Susun Horner-Kino ----
    {
      ch: 3,
      cap: 'Ambil koefisien $f(x)$ satu per satu dari $x^4$. $x^4$ berarti $1x^4$ dan $x$ berarti $1x$, jadi koefisiennya $1$, $a$, $b$, $1$, $-6$.',
      visual: hk({ k: 0, m: true, co: true, coIn: true }),
      board: { title: 'Susun Horner-Kino', pins: ['pK'], list: 'LH', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Hasil kali dengan $k_2$ ditulis satu kolom ke kanan, dengan $k_1$ dua kolom ke kanan. Tempat yang tidak terisi diberi tanda X, sehingga membentuk pola diagonal.',
      visual: hk({ k: 0, m: true, co: true, x: true }),
      board: { title: 'Susun Horner-Kino', pins: ['pK'], list: 'LH', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Hati-hati, hanya tiga kolom pertama yang dikali karena hasil baginya berderajat $4-2=2$. Garis batas dan X di ujung menandai perkalian berhenti.',
      visual: hk({ k: 0, m: true, co: true, x: true, cut: true }),
      board: { title: 'Susun Horner-Kino', pins: ['pK'], list: 'LH', upTo: 3, from: 2 },
    },
    // ---- 4 · Hitung kolom a ----
    {
      ch: 4,
      cap: 'Angka pertama, $1$, turun ke baris hasil.',
      visual: hk({ ...HK, k0: 0, k: 1 }),
      board: { title: 'Hitung kolom a', pins: ['pK'], list: 'LP', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Kalikan $1$ dengan $k_2=-1$, jadi $1\\cdot(-1)=-1$. Tulis di baris $k_2$, satu kolom ke kanan (kolom $a$).',
      visual: hk({ ...HK, k0: 1, k: 2 }),
      board: { title: 'Hitung kolom a', pins: ['pK'], list: 'LP', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: 'Naik ke $k_1=-1$, jadi $1\\cdot(-1)=-1$. Tulis di baris $k_1$, dua kolom ke kanan (kolom $b$).',
      visual: hk({ ...HK, k0: 2, k: 3 }),
      board: { title: 'Hitung kolom a', pins: ['pK'], list: 'LP', upTo: 3, from: 2 },
    },
    {
      ch: 4,
      cap: 'Jumlahkan kolom $a$, $a+(-1)=a-1$. Baris $k_1$ di kolom ini X, jadi tidak ikut.',
      visual: hk({ ...HK, k0: 3, k: 4 }),
      board: { title: 'Hitung kolom a', pins: ['pK'], list: 'LP', upTo: 4, from: 3 },
    },
    // ---- 5 · Hitung kolom b ----
    {
      ch: 5,
      cap: 'Kalikan $a-1$ dengan $k_2=-1$, jadi $(a-1)\\cdot(-1)=1-a$. Tulis di baris $k_2$, kolom $b$.',
      visual: hk({ ...HK, k0: 4, k: 5 }),
      board: { title: 'Hitung kolom b', pins: ['pK'], list: 'LQ', upTo: 1, from: 0 },
      ask: {
        before: 'q1',
        q: 'Hasil $(a-1)\\cdot(-1)$ adalah…',
        opts: [
          { tex: '1-a', ok: true },
          { tex: 'a-1', hint: 'Dikali $-1$, jadi semua tanda berubah, $-a+1=1-a$.' },
          { tex: '-a-1', hint: '$-1$ dikali $-1$ menjadi $+1$, bukan $-1$.' },
        ],
      },
    },
    {
      ch: 5,
      cap: 'Naik ke $k_1=-1$, $(a-1)\\cdot(-1)=1-a$ juga. Tulis di baris $k_1$, kolom $1$.',
      visual: hk({ ...HK, k0: 5, k: 6 }),
      board: { title: 'Hitung kolom b', pins: ['pK'], list: 'LQ', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: 'Jumlahkan kolom $b$, $b+(-1)+(1-a)=b-a$.',
      visual: hk({ ...HK, k0: 6, k: 7 }),
      board: { title: 'Hitung kolom b', pins: ['pK'], list: 'LQ', upTo: 3, from: 2 },
    },
    // ---- 6 · Hitung kolom sisa ----
    {
      ch: 6,
      cap: 'Kalikan $b-a$ dengan $k_2=-1$, jadi $(b-a)\\cdot(-1)=a-b$. Tulis di baris $k_2$, kolom $1$; sesudahnya X.',
      visual: hk({ ...HK, k0: 7, k: 8 }),
      board: { title: 'Hitung kolom sisa', pins: ['pK'], list: 'LU', upTo: 1, from: 0 },
    },
    {
      ch: 6,
      cap: 'Naik ke $k_1=-1$, hasilnya $a-b$ di baris $k_1$, kolom $-6$. Itu tempat terakhir, jadi perkalian berhenti di sini.',
      visual: hk({ ...HK, k0: 8, k: 9 }),
      board: { title: 'Hitung kolom sisa', pins: ['pK'], list: 'LU', upTo: 2, from: 1 },
    },
    {
      ch: 6,
      cap: 'Jumlahkan dua kolom terakhir, $1+(1-a)+(a-b)=2-b$ dan $-6+(a-b)=a-b-6$.',
      visual: hk({ ...HK, k0: 9, k: 11 }),
      board: { title: 'Hitung kolom sisa', pins: ['pK'], list: 'LU', upTo: 4, from: 2 },
    },
    {
      ch: 6,
      cap: 'Tiga angka pertama adalah hasil bagi $x^2+(a-1)x+(b-a)$. Dua angka terakhir adalah sisanya, $(2-b)x+(a-b-6)$.',
      visual: hk({ ...HK, k0: 11, k: 12 }),
      board: { title: 'Hitung kolom sisa', pins: ['pK'], list: 'LU', upTo: 5, from: 4, save: ['pR'] },
    },
    // ---- 7 · Samakan sisanya ----
    {
      ch: 7,
      cap: 'Sisa hasil hitungan harus sama dengan sisa di soal, yaitu $5x-1$.',
      visual: hk({ ...DONE, cmp: true }),
      board: { title: 'Samakan sisanya', pins: ['pR'], list: 'LS', upTo: 1, from: 0 },
    },
    {
      ch: 7,
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
      ch: 7,
      cap: 'Samakan konstantanya, $a-b-6=-1$. Masukkan $b=-3$, jadi $a-3=-1$ dan $a=2$.',
      visual: hk({ ...DONE, cmp: true, hl: 'c' }),
      board: { title: 'Samakan sisanya', pins: ['pR', 'pB'], list: 'LS', upTo: 8, from: 4, save: ['pA'] },
    },
    // ---- 8 · Jawaban ----
    {
      ch: 8,
      cap: 'Jadi $a+b=2+(-3)=-1$, pilihan C. Cek, sisanya $(2+3)x+(2+3-6)=5x-1$, sesuai soal.',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Jawaban', pins: ['pA', 'pB'], list: 'LJ', upTo: 2, from: 0 },
    },
    {
      ch: 8,
      cap: 'Hati-hati, $5$ adalah koefisien $x$ pada sisa, bukan $a+b$. Pilihan B hanya mengambil angka dari soal.',
      visual: { kind: 'soal', hl: 0, focus: 's-oB' },
      board: { title: 'Jawaban', pins: ['pA', 'pB'], list: 'LJ', upTo: 3, from: 2 },
    },
    // tawaran cara alternatif (opsional): Ya masuk Bagian 9, Tidak/Lewati langsung ke Bagian 10
    {
      ch: 8,
      cap: 'Mau lihat cara alternatif dengan kesamaan koefisien, tanpa Horner-Kino?',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Jawaban', pins: ['pA', 'pB'], list: 'LJ', upTo: 3, from: 3 },
      branch: { yes: 'Ya, lihat kesamaan koefisien' },
    },
    // ---- 9 · Kesamaan koefisien (opsional) ----
    {
      ch: 9,
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
      ch: 9,
      cap: 'Hasil baginya berderajat dua, $x^2+px+q$. Kalikan dengan pembagi, lalu kumpulkan per pangkat.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 4, from: 1 },
    },
    {
      ch: 9,
      cap: 'Samakan koefisiennya. Konstanta memberi $q=-5$, dan koefisien $x$ memberi $p+q=-4$, jadi $p=1$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 6, from: 4 },
    },
    {
      ch: 9,
      cap: 'Koefisien $x^3$ dan $x^2$ memberi $a=p+1=2$ dan $b=p+q+1=-3$, sama dengan Horner-Kino.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 7, from: 6 },
    },
    {
      ch: 9,
      cap: 'Tahukah kalian? Hasil bagi Horner-Kino $x^2+(a-1)x+(b-a)$ menjadi $x^2+x-5$, sama dengan $x^2+px+q$.',
      visual: hk(DONE),
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 8, from: 7 },
    },
    // ---- 10 · Catatan lengkap ----
    {
      ch: 10,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 11 · Cocokkan pilihan ----
    {
      ch: 11,
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
    // ---- 12 · Selesai ----
    {
      ch: 12,
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
        lists: ['LK0', 'LH', 'LP', 'LQ', 'LU'],
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
