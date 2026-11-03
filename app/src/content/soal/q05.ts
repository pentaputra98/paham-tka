/**
 * SOAL 5 — Titik Potong dengan Sumbu X (akar suku banyak; multi-jawaban). Kunci: (−2, 0) dan (3, 0).
 * Sumber: docs/pembahasan25.md "SOAL 5", docs/soal25.md no. 5.
 * Alur pemilik (v1.33, dicatat di dokumen):
 *  - pahami: diketahui f(x), ditanya titik potong dengan sumbu X (bisa lebih dari satu);
 *  - titik potong sumbu X artinya y = 0, jadi f(x) = 0; semua pilihan berbentuk (x, 0), cukup substitusi x-nya;
 *    tawaran opsional "Lihat dengan grafik" (kurva, sumbu X, penggeser x);
 *  - substitusi langsung dari pilihan: f(−2) = 0, f(−1) = −12, f(3) = 0, f(4) = 48, f(5) = 126 → (−2, 0) dan (3, 0);
 *  - tawaran opsional "Cara esai" (soal tanpa pilihan): calon akar dari pembagi −24, f(3) = 0, Horner,
 *    f(x) = (x − 3)(x + 2)(x + 4), akar −4 tidak ada di pilihan.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Visual } from '../../engine/types';
import type { CubicState } from '../../visuals/cubic5';
import type { Subst5State } from '../../visuals/subst5';
import { getSoal } from '../index';

const graph = (state: CubicState): Visual => ({ kind: 'svg', scene: 'cubic5', state });
const sub = (state: Subst5State): Visual => ({ kind: 'svg', scene: 'subst5', state });
const PIN = ['pf'];
const OPTS = ['-2', '-1', '3', '4', '5'];

/** f(x) satu pilihan: angka tiap suku, lalu hasilnya; emas bila nol (titik potong = jawaban) */
const test = (id: string, i: number, terms: string, out: string, note: string): Row => {
  const zero = out === '0';
  return {
    id,
    toks: [
      T(`${id}a`, 'f('),
      T(`${id}b`, OPTS[i]!, 'blue', `@o-${i + 1}`),
      T(`${id}c`, ')'),
      O(`${id}d`, '='),
      T(`${id}e`, terms),
      O(`${id}f`, '='),
      T(`${id}g`, out, zero ? 'gold' : 'red'),
    ],
    note,
    ...(zero ? { box: 'gold' as const } : {}),
  };
};

const q05: SoalContent = {
  meta: getSoal(5)!,
  sourceRef: 'docs/pembahasan25.md#soal-5',
  layout: 'full',
  paper: {
    html: `<p>Di manakah koordinat titik perpotongan grafik fungsi $\\htmlClass{hl hl-red}{\\htmlData{src=s-f, hl=2}{f(x)=x^{3}+3x^{2}-10x-24}}$ terhadap <span class="hl hl-blue" data-hl="3"><span data-src="s-sx">sumbu X</span></span>?</p>
<p>Pilih pada <span class="hl hl-gold" data-hl="1"><span data-src="s-tanya">semua jawaban benar</span></span>! Jawaban benar lebih dari satu.</p>
<ul class="checks">
${OPTS.map((x, i) => `<li><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">$(${x},0)$</span></span></li>`).join('\n')}
</ul>`,
    srcNames: ['s-f', 's-sx', 's-tanya', 's-o1', 's-o2', 's-o3', 's-o4', 's-o5'],
  },
  visualSrc: ['o-1', 'o-2', 'o-3', 'o-4', 'o-5'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Suku banyak',
    titleLines: ['Pembahasan Soal', 'Akar <span class="accent">Suku Banyak</span>', 'Sumbu X'],
    lede: 'Grafik $f(x)=x^3+3x^2-10x-24$ memotong sumbu X di beberapa titik. Kita substitusi tiap pilihan dan cari yang hasilnya nol.',
    facts: [
      { dt: 'Derajat', dd: '3' },
      { dt: 'Kondisi', dd: 'y = 0' },
      { dt: 'Dicari', dd: 'titik potong sumbu X' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Titik potong sumbu X', d: 'Artinya y = 0' },
    { t: 'Lihat dengan grafik', d: 'Opsional: kurva dan sumbu X', opt: true },
    { t: 'Substitusi pilihan', d: 'Hasilnya nol atau bukan' },
    { t: 'Jawaban', d: '(−2, 0) dan (3, 0)' },
    { t: 'Cara esai', d: 'Opsional: tanpa pilihan ganda', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: '(−2, 0) dan (3, 0)' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pf: {
      id: 'pf',
      toks: [T('Pf1', 'f(x)', '', 'k1b'), O('Pf2', '='), T('Pf3', 'x^3+3x^2-10x-24', '', 'k1b')],
    },
    pX3: { id: 'pX3', toks: [T('Px1', '(x-3)', '', 'e2c'), H('Px2', 'faktor', 'tx')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [H('k1a', 'Diketahui', 'lbl'), T('k1b', 'f(x)=x^3+3x^2-10x-24', 'red', '@s-f')],
        note: 'suku banyak derajat $3$; simpan ke catatan',
      },
      {
        id: 'k2',
        toks: [H('k2a', 'Ditanya', 'lbl'), H('k2b', 'titik potong dengan sumbu X', 'gold', '@s-sx')],
        note: 'jawabannya bisa lebih dari satu',
      },
    ],
    L2: [
      {
        id: 'z1',
        toks: [
          H('z1a', 'pada sumbu X', 'tx'),
          T('z1b', 'y=0'),
          O('z1c', '\\Rightarrow'),
          T('z1d', 'f(x)=0', 'blue'),
        ],
        note: 'semua titik di sumbu X tingginya nol',
        box: 'navy',
      },
      {
        id: 'z2',
        toks: [
          H('z2a', 'pilihan', 'lbl'),
          T('z2b', '(x,0)'),
          O('z2c', '\\to'),
          H('z2d', 'substitusi x ke f(x)', 'tx'),
        ],
        note: 'titik potong bila hasilnya $0$',
      },
    ],
    // lihat dengan grafik (opsional)
    LG: [
      {
        id: 'g1',
        toks: [H('g1a', 'kurva bertemu sumbu X', 'tx'), O('g1b', '\\to'), T('g1c', 'y=f(x)=0', 'blue')],
        note: 'di titik potong, tinggi kurva nol',
      },
      {
        id: 'g2',
        toks: [T('g2a', 'f(-1)=-12'), O('g2b', '\\to'), H('g2c', 'di bawah sumbu X', 'tx')],
        note: 'nilai $f(x)$ negatif berarti titiknya di bawah sumbu X',
      },
    ],
    LU: [
      {
        id: 'u1',
        toks: [T('u1a', '(-2)^3+3(-2)^2-10(-2)-24', '', '@o-1')],
        note: '$x$ pada $f(x)$ diganti $-2$ dari pilihan $(-2,0)$',
      },
      {
        id: 'u2',
        toks: [
          T('u2a', 'f(-2)'),
          O('u2b', '='),
          T('u2c', '-8+12+20-24'),
          O('u2d', '='),
          T('u2e', '0', 'gold'),
        ],
        note: 'nol → titik potong',
        box: 'gold',
      },
      test('u3', 1, '-1+3+10-24', '-12', '$(-1)^3=-1$, $3(-1)^2=3$, $-10(-1)=10$; bukan nol'),
      test('u4', 2, '27+27-30-24', '0', 'nol → titik potong'),
      test('u5', 3, '64+48-40-24', '48', 'bukan nol; $4$ pembagi $24$, tetapi bukan akar'),
      test('u6', 4, '125+75-50-24', '126', 'bukan nol'),
    ],
    LJ: [
      {
        id: 'j1',
        toks: [H('j1a', 'Jawaban', 'lbl'), T('j1b', '(-2,0)'), H('j1c', 'dan', 'tx'), T('j1d', '(3,0)')],
        note: 'hanya dua pilihan ini yang hasilnya nol',
        box: 'gold',
      },
    ],
    // cara esai (opsional): tanpa pilihan ganda
    LE: [
      {
        id: 'e1',
        toks: [
          H('e1a', 'calon akar', 'tx'),
          T('e1b', '\\pm1,\\ \\pm2,\\ \\pm3,\\ \\pm4,\\ \\dots,\\ \\pm24', '', 'Pf3'),
        ],
        note: 'pembagi suku tetap $-24$',
      },
      {
        id: 'e2',
        toks: [
          T('e2a', 'f(3)=0'),
          O('e2b', '\\Rightarrow'),
          T('e2c', '(x-3)', 'blue'),
          H('e2d', 'faktor', 'tx'),
        ],
        note: 'calon dicoba sampai hasilnya nol; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'e3',
        toks: [
          H('e3a', 'koefisien', 'tx'),
          T('e3b', '1,\\ 3,\\ -10,\\ -24', '', 'Pf3'),
          H('e3c', 'pembagi', 'tx'),
          T('e3d', '3', 'blue'),
        ],
        note: 'cara Horner',
      },
      {
        id: 'e4',
        toks: [T('e4a', '1,\\ 6,\\ 8'), H('e4b', 'sisa', 'tx'), T('e4c', '0', 'blue')],
        note: '$3+3=6$, $-10+18=8$, $-24+24=0$',
        box: 'navy',
      },
      {
        id: 'e5',
        toks: [T('e5a', 'f(x)'), O('e5b', '='), T('e5c', '(x-3)(x^2+6x+8)', '', 'e4a')],
        note: 'hasil bagi $x^2+6x+8$ dari angka $1$, $6$, $8$',
      },
      {
        id: 'e6',
        toks: [T('e6a', 'f(x)'), O('e6b', '='), T('e6c', '(x-3)(x+2)(x+4)', 'blue')],
        note: '$x^2+6x+8=(x+2)(x+4)$',
        box: 'navy',
      },
      {
        id: 'e7',
        toks: [H('e7a', 'akar', 'tx'), O('e7b', '\\to'), T('e7c', 'x=3,\\ -2,\\ -4', 'blue')],
        note: 'titik potong $(3,0)$, $(-2,0)$, dan $(-4,0)$',
      },
      {
        id: 'e8',
        toks: [H('e8a', 'Hati-hati', 'lbl'), T('e8b', '(-4,0)'), H('e8c', 'tidak ada di pilihan', 'tx')],
        note: 'jawaban pilihan ganda tetap $(-2,0)$ dan $(3,0)$',
      },
    ],
    L8: [
      {
        id: 'v1',
        toks: [H('v1a', 'Jawaban', 'lbl'), T('v1b', '(-2,0)'), H('v1c', 'dan', 'tx'), T('v1d', '(3,0)')],
        box: 'gold',
      },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', 'f(-2)=0')], box: 'gold' },
      { id: 'r2', toks: [T('r2a', 'f(3)=0')], box: 'gold' },
      {
        id: 'r3',
        toks: [H('r3a', 'Jawaban', 'lbl'), T('r3b', '(-2,0)'), H('r3c', 'dan', 'tx'), T('r3d', '(3,0)')],
        box: 'gold',
      },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Yang diketahui fungsi $f(x)=x^3+3x^2-10x-24$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0, save: ['pf'] },
    },
    {
      ch: 1,
      cap: 'Yang ditanya titik potong grafiknya dengan sumbu X, dan jawabannya bisa lebih dari satu.',
      visual: { kind: 'soal', hl: 3 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Titik potong sumbu X ----
    {
      ch: 2,
      cap: 'Titik potong dengan sumbu X artinya nilai $y=0$, karena semua titik di sumbu X tingginya nol. Jadi kita cari $x$ yang membuat $f(x)=0$.',
      visual: { kind: 'soal', hl: 3 },
      board: { title: 'Titik potong sumbu X', pins: PIN, list: 'L2', upTo: 1, from: 0 },
      ask: {
        before: 'z1',
        q: 'Titik potong grafik dengan sumbu X dicari dari…',
        opts: [
          { tex: 'f(x)=0', ok: true },
          {
            tex: 'x=0',
            hint: '$x=0$ adalah sumbu Y. Titik potong sumbu X ditandai dengan tinggi $y=0$.',
          },
          { tex: 'f(0)=0', hint: '$f(0)=-24$ adalah titik potong sumbu Y, bukan sumbu X.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Lihat pilihannya, semuanya berbentuk $(x,0)$ dengan $y=0$. Jadi cukup substitusi $x$ tiap pilihan ke $f(x)$, lalu cek hasilnya nol atau bukan.',
      visual: sub({ y0: true }),
      board: { title: 'Titik potong sumbu X', pins: PIN, list: 'L2', upTo: 2, from: 1 },
    },
    // tawaran grafik (opsional): Ya masuk Bagian 3, Tidak/Lewati langsung ke Bagian 4
    {
      ch: 2,
      cap: 'Sebelum substitusi, mau lihat dulu arti titik potong sumbu X pada grafiknya?',
      visual: sub({ y0: true }),
      board: { title: 'Titik potong sumbu X', pins: PIN, list: 'L2', upTo: 2, from: 2 },
      branch: { yes: 'Ya, lihat grafik' },
    },
    // ---- 3 · Lihat dengan grafik (opsional) ----
    {
      ch: 3,
      cap: 'Ini grafik $f(x)$. Titik potongnya ada di tempat kurva bertemu sumbu X, dan di sana tingginya nol.',
      visual: graph({ sx: true, roots: true, pt: 0 }),
      board: { title: 'Lihat dengan grafik', pins: PIN, list: 'LG', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Misalnya di $x=-1$, $f(-1)=-12$ dan titiknya di bawah sumbu X. Geser $x$ untuk mencoba nilai lain.',
      visual: graph({ sx: true, lab: true, pt: -1 }),
      board: { title: 'Lihat dengan grafik', pins: PIN, list: 'LG', upTo: 2, from: 1 },
    },
    // ---- 4 · Substitusi pilihan ----
    {
      ch: 4,
      cap: 'Pilihan $(-2,0)$, ganti $x$ dengan $-2$. Hasilnya $f(-2)=-8+12+20-24=0$, jadi $(-2,0)$ titik potong.',
      visual: sub({ y0: true, n: 1, cur: 1 }),
      board: { title: 'Substitusi pilihan', pins: PIN, list: 'LU', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Pilihan $(-1,0)$, $f(-1)=-1+3+10-24=-12$. Hasilnya bukan nol, jadi bukan titik potong.',
      visual: sub({ y0: true, n: 2, cur: 2 }),
      board: { title: 'Substitusi pilihan', pins: PIN, list: 'LU', upTo: 3, from: 2 },
      ask: {
        before: 'u3',
        q: 'Nilai $f(-1)$ adalah…',
        opts: [
          { tex: '-12', ok: true },
          { tex: '-18', hint: '$3(-1)^2=3$, karena $(-1)^2=1$ positif.' },
          { tex: '-32', hint: '$-10(-1)=+10$, minus kali minus menjadi plus.' },
          { tex: '0', hint: 'Hitung lagi, $-1+3+10-24=-12$.' },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Pilihan $(3,0)$, $f(3)=27+27-30-24=0$. Hasilnya nol, jadi $(3,0)$ titik potong.',
      visual: sub({ y0: true, n: 3, cur: 3 }),
      board: { title: 'Substitusi pilihan', pins: PIN, list: 'LU', upTo: 4, from: 3 },
    },
    {
      ch: 4,
      cap: 'Pilihan $(4,0)$, $f(4)=64+48-40-24=48$, bukan nol. Hati-hati, $4$ memang pembagi $24$, tetapi belum tentu akar.',
      visual: sub({ y0: true, n: 4, cur: 4 }),
      board: { title: 'Substitusi pilihan', pins: PIN, list: 'LU', upTo: 5, from: 4 },
    },
    {
      ch: 4,
      cap: 'Pilihan $(5,0)$, $f(5)=125+75-50-24=126$, bukan nol.',
      visual: sub({ y0: true, n: 5, cur: 5 }),
      board: { title: 'Substitusi pilihan', pins: PIN, list: 'LU', upTo: 6, from: 5 },
    },
    // ---- 5 · Jawaban ----
    {
      ch: 5,
      cap: 'Yang hasilnya nol hanya $(-2,0)$ dan $(3,0)$. Itulah jawabannya.',
      visual: sub({ y0: true, n: 5, win: true }),
      board: { title: 'Jawaban', pins: PIN, list: 'LJ', upTo: 1, from: 0 },
    },
    // tawaran cara esai (opsional): Ya masuk Bagian 6, Tidak/Lewati langsung ke Bagian 7
    {
      ch: 5,
      cap: 'Bagaimana kalau soalnya esai, tanpa pilihan ganda? Mau lihat cara normal tanpa substitusi pilihan?',
      visual: sub({ y0: true, n: 5, win: true }),
      board: { title: 'Jawaban', pins: PIN, list: 'LJ', upTo: 1, from: 1 },
      branch: { yes: 'Ya, lihat cara esai' },
    },
    // ---- 6 · Cara esai (opsional) ----
    {
      ch: 6,
      cap: 'Tanpa pilihan, kita cari dulu satu akar bulat. Calon akarnya adalah pembagi suku tetap $-24$, yaitu $\\pm1$, $\\pm2$, $\\pm3$, $\\pm4$, dan seterusnya.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Cara esai', pins: PIN, list: 'LE', upTo: 1, from: 0 },
    },
    {
      ch: 6,
      cap: 'Coba calon itu satu per satu sampai hasilnya nol, misalnya $f(3)=0$. Jadi $(x-3)$ adalah faktor, dan $f(x)$ kita bagi dengan cara Horner.',
      visual: sub({ view: 'horner', h: 1 }),
      board: { title: 'Cara esai', pins: PIN, list: 'LE', upTo: 2, from: 1, save: ['pX3'] },
    },
    {
      ch: 6,
      cap: 'Tulis koefisien $1$, $3$, $-10$, $-24$ dengan pembagi $3$ di kiri. Turunkan $1$, kalikan $3$, jumlahkan, lalu ulangi.',
      visual: sub({ view: 'horner', h: 4 }),
      board: { title: 'Horner', pins: ['pf', 'pX3'], list: 'LE', upTo: 4, from: 2 },
    },
    {
      ch: 6,
      cap: 'Sisanya $0$ dan hasil baginya $x^2+6x+8=(x+2)(x+4)$. Jadi $f(x)=(x-3)(x+2)(x+4)$.',
      visual: sub({ view: 'horner', h: 4 }),
      board: { title: 'Horner', pins: ['pf', 'pX3'], list: 'LE', upTo: 6, from: 4 },
    },
    {
      ch: 6,
      cap: 'Akarnya $3$, $-2$, dan $-4$, sehingga grafik memotong sumbu X di tiga titik.',
      visual: graph({ sx: true, roots: true, pt: 0 }),
      board: { title: 'Akar dan titik potong', pins: PIN, list: 'LE', upTo: 7, from: 6 },
    },
    {
      ch: 6,
      cap: 'Hati-hati, $(-4,0)$ juga titik potong, tetapi tidak ada di pilihan. Untuk soal pilihan ganda, jawabannya tetap $(-2,0)$ dan $(3,0)$.',
      visual: graph({ sx: true, roots: true, pt: 0 }),
      board: { title: 'Akar dan titik potong', pins: PIN, list: 'LE', upTo: 8, from: 7 },
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
      cap: 'Cocokkan dengan pilihan. Hanya $(-2,0)$ dan $(3,0)$ yang hasil substitusinya nol, pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: PIN, list: 'L8', upTo: 1, from: 0 },
      ask: {
        before: 'v1',
        q: 'Titik potong yang ada di pilihan adalah…',
        col: true,
        win: '$(-2,0)$ dan $(3,0)$.',
        opts: [
          { tex: '(3,0)\\ \\text{saja}', hint: '$f(-2)=0$ juga, jadi $(-2,0)$ titik potong.' },
          { tex: '(-2,0)\\ \\text{dan}\\ (3,0)', ok: true },
          {
            tex: '(-2,0),\\ (3,0),\\ \\text{dan}\\ (4,0)',
            hint: '$f(4)=48$, bukan nol. $4$ hanya pembagi $24$.',
          },
          { tex: '(-1,0)\\ \\text{dan}\\ (3,0)', hint: '$f(-1)=-12$, bukan nol.' },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">(−2, 0) · (3, 0)</span><span>Dari pilihan yang ada, grafik memotong sumbu X di $(-2,0)$ dan $(3,0)$, karena $f(-2)=0$ dan $f(3)=0$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
    },
  ],
  cards: [
    { label: '1', statement: '$(-2,0)$', ok: true, formula: 'f(-2)=0', why: 'Akar $x=-2$.' },
    {
      label: '2',
      statement: '$(-1,0)$',
      ok: false,
      formula: 'f(-1)=-12',
      why: 'Grafik berada di bawah sumbu X pada $x=-1$.',
    },
    { label: '3', statement: '$(3,0)$', ok: true, formula: 'f(3)=0', why: 'Akar $x=3$.' },
    {
      label: '4',
      statement: '$(4,0)$',
      ok: false,
      formula: 'f(4)=48',
      why: 'Jebakan: $4$ pembagi $24$, tetapi pembagi suku tetap belum tentu akar.',
    },
    { label: '5', statement: '$(5,0)$', ok: false, formula: 'f(5)=126', why: 'Jauh di atas sumbu X.' },
  ],
  notes: {
    title: 'Pembahasan Soal 5: Titik Potong dengan Sumbu X',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Suku banyak',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Titik potong sumbu X artinya y = 0',
        lists: ['L2'],
        why: 'Semua titik pada sumbu X punya $y=0$. Jadi titik potong terhadap sumbu X adalah titik $(x,0)$ dengan $f(x)=0$.',
      },
      { title: 'Lihat dengan grafik (opsional)', lists: ['LG'], sketch: 'cubic5' },
      { title: 'Substitusi pilihan', lists: ['LU', 'LJ'] },
      {
        title: 'Cara esai tanpa pilihan (opsional)',
        lists: ['LE'],
        why: 'Akar bulat suku banyak adalah pembagi suku tetapnya; setelah satu faktor ditemukan, sisanya dibagi dengan cara Horner.',
      },
    ],
    answer: 'Jawaban: <b>$(-2,0)$</b> dan <b>$(3,0)$</b>; akar ketiga $x=-4$ tidak ada di pilihan.',
  },
  done: {
    seal: '(−2, 0) · (3, 0)',
    message:
      'Dari pilihan yang ada, grafik memotong sumbu X di $(-2,0)$ dan $(3,0)$, karena $f(-2)=0$ dan $f(3)=0$.',
  },
  key: {
    answer: '(-2,0), (3,0)',
    cardOk: [true, false, true, false, false],
    goldRows: ['u2', 'u4', 'j1', 'v1', 'r1', 'r2', 'r3'],
  },
  authorNotes: [
    'Ditulis ulang dengan alur pemilik (v1.33): substitusi langsung dari pilihan ganda, dengan penjelasan bahwa titik potong sumbu X artinya y = 0, sehingga semua pilihan berbentuk (x, 0).',
    'Grafik (dokumen Langkah 2.1) menjadi bagian opsional "Lihat dengan grafik" sebelum substitusi; penggeser x tetap ada.',
    'Substitusi tiap pilihan dari dokumen u1–u6, satu langkah per pilihan; adegan baru subst5 (tabel pilihan dan hasilnya). Pertanyaan cepat baru f(−1) dengan pengecoh −18, −32, 0 (kesalahan tanda).',
    'Faktorisasi Horner (dokumen 2.3, h1–h5) menjadi bagian opsional "Cara esai" di akhir; calon akar dari pembagi −24 diambil dari "Kesalahan umum" dokumen. Skema Horner digambar di adegan subst5.',
    'Kartu dan pertanyaan kesimpulan dari Bagian 4 dokumen; kartu dibuka sekaligus dalam satu langkah.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q05;
