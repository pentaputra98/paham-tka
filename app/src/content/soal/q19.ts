/**
 * SOAL 19 — Cermin lalu Translasi pada Garis (transformasi geometri; pilihan tunggal). Kunci: E (2a − b = 6).
 * Sumber: docs/pembahasan25.md "SOAL 19", docs/soal25.md no. 19.
 * Alur (v1.51, dicatat di dokumen):
 *  - pahami: garis ax + y − 9 = 0 dan x + by + 6 = 0, dicerminkan terhadap y = x lalu ditranslasi T(1, −1);
 *    bayangannya x + 2y − 8 = 0 dan 2x − y − 9 = 0; ditanya 2a − b;
 *  - aturan lewat satu titik di kisi: (4, 1) → cermin (1, 4) → geser (2, 3); pada persamaan, cermin y = x berarti
 *    x dan y bertukar, translasi (1, −1) berarti x diganti x − 1 dan y diganti y + 1 (kebalikan geserannya);
 *  - garis pertama: x + ay − 9 = 0 → (x − 1) + a(y + 1) − 9 = 0 → x + ay + (a − 10) = 0, samakan dengan
 *    x + 2y − 8 = 0 → a = 2 (cek a − 10 = −8);
 *  - garis kedua: bx + y + 6 = 0 → b(x − 1) + (y + 1) + 6 = 0 → bx + y + (7 − b) = 0; bayangan dikali −1,
 *    −2x + y + 9 = 0 → b = −2 (cek 7 − b = 9);
 *  - 2a − b = 4 + 2 = 6 → pilihan E; bagian opsional "Cek dengan grafik" (uji titik dari Pemeriksaan hasil).
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Refl19State } from '../../visuals/refl19';
import { getSoal } from '../index';

const sc = (state: Refl19State): Visual => ({ kind: 'svg', scene: 'refl19', state });
const eq = (set: 1 | 2 | 3, s: number): Visual => sc({ view: 'eq', set, s });
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
const OPT = ['-6', '-2', '0', '2', '6'];
const RULE = ['pC', 'pT'];

const q19: SoalContent = {
  meta: getSoal(19)!,
  sourceRef: 'docs/pembahasan25.md#soal-19',
  layout: 'full',
  paper: {
    html: `<p>Apabila garis <span class="hl hl-red" data-hl="1"><span data-src="s-l1">$ax+y-9=0$</span></span> dan <span class="hl hl-red" data-hl="1"><span data-src="s-l2">$x+by+6=0$</span></span> <span class="hl hl-blue" data-hl="1"><span data-src="s-urut">dicerminkan terhadap garis $y=x$ kemudian dilanjutkan translasi $T\\begin{pmatrix}1\\\\-1\\end{pmatrix}$</span></span> menghasilkan bayangan dengan persamaan berturut-turut <span class="hl hl-red" data-hl="2"><span data-src="s-b1">$x+2y-8=0$</span></span> dan <span class="hl hl-red" data-hl="2"><span data-src="s-b2">$2x-y-9=0$</span></span>. Nilai <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">$2a-b$</span></span>$=....$</p>
<ol class="abc">
${LETTERS.map((o, i) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">$${OPT[i]}$</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-l1', 's-l2', 's-urut', 's-b1', 's-b2', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Transformasi geometri',
    titleLines: ['Pembahasan Soal', 'Cermin lalu <span class="accent">Translasi</span>', 'Persamaan Garis'],
    lede: 'Dua garis dicerminkan terhadap $y=x$ lalu digeser. Dari bayangan akhirnya kita cari $a$ dan $b$.',
    facts: [
      { dt: 'Cermin', dd: 'y = x' },
      { dt: 'Translasi', dd: '(1, −1)' },
      { dt: 'Dicari', dd: '2a − b' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Garis awal dan bayangan' },
    { t: 'Aturan transformasi', d: 'Cermin lalu geser' },
    { t: 'Garis pertama', d: 'a = 2' },
    { t: 'Garis kedua', d: 'b = −2' },
    { t: 'Nilai 2a − b', d: 'Pilihan E' },
    { t: 'Cek dengan grafik', d: 'Opsional: uji satu titik', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban E' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pC: { id: 'pC', toks: [T('PC1', '\\text{cermin }y=x\\to x\\leftrightarrow y', '', 'r1c')] },
    pT: { id: 'pT', toks: [T('PT1', 'x\\to x-1,\\ y\\to y+1', '', 'r3b')] },
    pA: { id: 'pA', toks: [T('PA1', 'a=2', '', 'a5e')] },
    pB: { id: 'pB', toks: [T('PB1', 'b=-2', '', 'b6c')] },
    pQ: { id: 'pQ', toks: [T('PQ1', 'bx+y+(7-b)=0', '', 'b4a')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [T('k1a', 'ax+y-9=0', 'red', '@s-l1'), O('k1b', ','), T('k1c', 'x+by+6=0', 'red', '@s-l2')],
        note: 'dua garis awal',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', 'cermin <i>y</i> = <i>x</i>, lalu translasi', 'tx', '@s-urut'),
          T('k2b', 'T(1,-1)', 'blue'),
        ],
        note: 'urutannya cermin dulu, baru digeser',
      },
      {
        id: 'k3',
        toks: [T('k3a', 'x+2y-8=0', 'red', '@s-b1'), O('k3b', ','), T('k3c', '2x-y-9=0', 'red', '@s-b2')],
        note: 'bayangan akhir kedua garis',
      },
      { id: 'k4', toks: [H('k4a', 'Ditanya', 'lbl'), T('k4b', '2a-b', 'gold', '@s-tanya')] },
    ],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', '(4,1)\\to(1,4)'), O('r1b', '\\to'), T('r1c', 'x\\leftrightarrow y', 'blue')],
        note: 'cermin $y=x$, titik $(x,y)$ menjadi $(y,x)$; pada persamaan $x$ dan $y$ bertukar; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'r2',
        toks: [T('r2a', '(1,4)\\to(2,3)')],
        note: 'translasi $(1,-1)$, geser $1$ ke kanan dan $1$ ke bawah, $(x,y)\\to(x+1,\\ y-1)$',
      },
      {
        id: 'r3',
        toks: [H('r3a', 'pada persamaan', 'tx'), T('r3b', 'x\\to x-1,\\ y\\to y+1', 'blue')],
        note: 'kebalikan geserannya, karena titik baru berasal dari $(x-1,\\ y+1)$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LA: [
      { id: 'a1', toks: [T('a1a', 'ax+y-9=0', '', '@s-l1')], note: 'garis pertama' },
      {
        id: 'a2',
        toks: [T('a2a', 'x+ay-9=0', '', 'PC1')],
        note: 'cermin, $x$ dan $y$ bertukar',
      },
      {
        id: 'a3',
        toks: [T('a3a', '(x-1)+a(y+1)-9=0', '', 'PT1')],
        note: 'translasi, $x$ diganti $x-1$ dan $y$ diganti $y+1$',
      },
      {
        id: 'a4',
        toks: [T('a4a', 'x+ay+(a-10)=0', 'blue')],
        note: 'dijabarkan, $-1+a-9=a-10$',
        box: 'navy',
      },
      {
        id: 'a5',
        toks: [T('a5a', 'x+2y-8=0', '', '@s-b1'), O('a5b', '\\to'), T('a5e', 'a=2', 'blue')],
        note: 'koefisien $y$ sama, $a=2$; cek $a-10=-8$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LB: [
      { id: 'b1', toks: [T('b1a', 'x+by+6=0', '', '@s-l2')], note: 'garis kedua' },
      {
        id: 'b2',
        toks: [T('b2a', 'bx+y+6=0', '', 'PC1')],
        note: 'cermin, $x$ dan $y$ bertukar',
      },
      {
        id: 'b3',
        toks: [T('b3a', 'b(x-1)+(y+1)+6=0', '', 'PT1')],
        note: 'translasi, $x$ diganti $x-1$ dan $y$ diganti $y+1$',
      },
      {
        id: 'b4',
        toks: [T('b4a', 'bx+y+(7-b)=0', 'blue')],
        note: 'dijabarkan, $-b+1+6=7-b$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LB2: [
      {
        id: 'b5',
        toks: [T('b5a', '2x-y-9=0', '', '@s-b2')],
        note: 'bayangan kedua, koefisien $y$ masih $-1$',
      },
      {
        id: 'b5x',
        toks: [T('b5c', '-2x+y+9=0', 'blue', 'b5a')],
        note: 'dikali $-1$, supaya koefisien $y$ sama-sama $1$',
      },
      {
        id: 'b6',
        toks: [T('b6a', 'bx+y+(7-b)', '', 'PQ1'), O('b6b', '\\to'), T('b6c', 'b=-2', 'blue')],
        note: 'koefisien $x$ sama, $b=-2$; cek $7-b=9$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LN: [
      {
        id: 'n1',
        toks: [T('n1a', '2a-b'), O('n1b', '='), T('n1c', '2(2)', '', 'PA1'), T('n1d', '-(-2)', '', 'PB1')],
      },
      { id: 'n2', toks: [T('n2a', '2a-b'), O('n2b', '='), T('n2c', '4+2')], note: '$-(-2)=+2$' },
      { id: 'n3', toks: [T('n3a', '2a-b'), O('n3b', '='), T('n3c', '6', 'gold')], box: 'gold' },
      {
        id: 'n4',
        toks: [H('n4a', 'Jawaban', 'lbl'), T('n4b', '\\textbf{E}', '', '@s-oE'), T('n4c', '6', 'gold')],
        note: 'ada di pilihan E',
        box: 'gold',
      },
    ],
    // cek dengan grafik (opsional)
    LG: [
      {
        id: 'g1',
        toks: [
          T('g1a', '(3,3)'),
          O('g1b', '\\to'),
          T('g1c', '(3,3)'),
          O('g1d', '\\to'),
          T('g1e', '(4,2)', 'blue'),
        ],
        note: 'titik pada $2x+y-9=0$, dicerminkan lalu digeser',
      },
      {
        id: 'g2',
        toks: [T('g2a', '4+2(2)-8=0'), T('g2b', '\\;\\checkmark', 'blue')],
        note: 'terletak pada bayangan $x+2y-8=0$',
      },
      {
        id: 'g3',
        toks: [
          T('g3a', '(0,3)'),
          O('g3b', '\\to'),
          T('g3c', '(3,0)'),
          O('g3d', '\\to'),
          T('g3e', '(4,-1)', 'blue'),
        ],
        note: 'titik pada $x-2y+6=0$, dicerminkan lalu digeser',
      },
      {
        id: 'g4',
        toks: [T('g4a', '2(4)-(-1)-9=0'), T('g4b', '\\;\\checkmark', 'blue')],
        note: 'terletak pada bayangan $2x-y-9=0$',
      },
    ],
    L7: [{ id: 'w1', toks: [H('w1a', 'Jawaban', 'lbl'), T('w1b', '\\textbf{E}')], box: 'gold' }],
    LS: [
      {
        id: 's1',
        toks: [T('s1a', 'a=2'), O('s1b', ','), T('s1c', 'b=-2')],
        note: '$2a-b=4+2=6$',
        box: 'gold',
      },
      { id: 's2', toks: [H('s2a', 'Jawaban', 'lbl'), T('s2b', '\\textbf{E}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Dua garis dicerminkan terhadap $y=x$ dulu, lalu digeser dengan translasi $T(1,-1)$.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 0 },
    },
    {
      ch: 1,
      cap: 'Bayangan akhirnya $x+2y-8=0$ dan $2x-y-9=0$. Yang ditanya $2a-b$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 4, from: 2 },
    },
    // ---- 2 · Aturan transformasi ----
    {
      ch: 2,
      cap: 'Coba pada satu titik. Dicerminkan terhadap $y=x$, titik $(4,1)$ menjadi $(1,4)$, jadi $x$ dan $y$ bertukar.',
      visual: sc({ view: 'rule', r: 1 }),
      board: { title: 'Aturan transformasi', list: 'LR', upTo: 1, from: 0, save: ['pC'] },
    },
    {
      ch: 2,
      cap: 'Translasi $(1,-1)$ menggeser titik $1$ ke kanan dan $1$ ke bawah, jadi $(1,4)$ menjadi $(2,3)$.',
      visual: sc({ view: 'rule', r: 2 }),
      board: { title: 'Aturan transformasi', list: 'LR', upTo: 2, from: 1 },
    },
    {
      ch: 2,
      cap: 'Pada persamaan, kebalikannya. Titik baru berasal dari $(x-1,\\ y+1)$, jadi $x$ diganti $x-1$ dan $y$ diganti $y+1$.',
      visual: sc({ view: 'rule', r: 2 }),
      board: { title: 'Aturan transformasi', list: 'LR', upTo: 3, from: 2, save: ['pT'] },
      ask: {
        before: 'r3',
        q: 'Setelah translasi $(1,-1)$, pada persamaan $x$ dan $y$ diganti dengan…',
        col: true,
        opts: [
          { tex: 'x-1\\ \\text{dan}\\ y+1', ok: true },
          {
            tex: 'x+1\\ \\text{dan}\\ y-1',
            hint: 'Itu arah geseran titik. Pada persamaan bayangan kebalikannya, titik $(x,y)$ berasal dari $(x-1,\\ y+1)$.',
          },
          {
            tex: 'x-1\\ \\text{dan}\\ y-1',
            hint: 'Geseran $y$ adalah $-1$, jadi pada persamaan $y$ diganti $y+1$.',
          },
        ],
      },
    },
    // ---- 3 · Garis pertama ----
    {
      ch: 3,
      cap: 'Garis pertama $ax+y-9=0$ dicerminkan. Huruf $x$ dan $y$ bertukar tempat, jadi $x+ay-9=0$.',
      visual: eq(1, 2),
      board: { title: 'Garis pertama', pins: RULE, list: 'LA', upTo: 2, from: 0 },
    },
    {
      ch: 3,
      cap: 'Lalu translasi. Ganti $x$ dengan $x-1$ dan $y$ dengan $y+1$.',
      visual: eq(1, 3),
      board: { title: 'Garis pertama', pins: RULE, list: 'LA', upTo: 3, from: 2 },
    },
    {
      ch: 3,
      cap: 'Jabarkan dan kumpulkan konstantanya, $-1+a-9=a-10$. Jadi $x+ay+(a-10)=0$.',
      visual: eq(1, 4),
      board: { title: 'Garis pertama', pins: RULE, list: 'LA', upTo: 4, from: 3 },
    },
    {
      ch: 3,
      cap: 'Samakan dengan bayangan $x+2y-8=0$. Koefisien $y$ memberi $a=2$, dan konstantanya cocok, $a-10=-8$.',
      visual: eq(1, 5),
      board: { title: 'Garis pertama', pins: RULE, list: 'LA', upTo: 5, from: 4, save: ['pA'] },
    },
    // ---- 4 · Garis kedua ----
    {
      ch: 4,
      cap: 'Garis kedua $x+by+6=0$ dicerminkan dengan cara yang sama. Huruf $x$ dan $y$ bertukar, jadi $bx+y+6=0$.',
      visual: eq(2, 2),
      board: { title: 'Garis kedua', pins: RULE, list: 'LB', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Translasi, ganti $x$ dengan $x-1$ dan $y$ dengan $y+1$.',
      visual: eq(2, 3),
      board: { title: 'Garis kedua', pins: RULE, list: 'LB', upTo: 3, from: 2 },
    },
    {
      ch: 4,
      cap: 'Jabarkan, $-b+1+6=7-b$. Jadi $bx+y+(7-b)=0$.',
      visual: eq(2, 4),
      board: { title: 'Garis kedua', pins: RULE, list: 'LB', upTo: 4, from: 3, save: ['pQ'] },
    },
    {
      ch: 4,
      cap: 'Hati-hati, pada bayangan $2x-y-9=0$ koefisien $y$ masih $-1$. Kalikan dengan $-1$ supaya sama-sama $1$.',
      visual: eq(2, 5),
      board: { title: 'Garis kedua', pins: ['pQ'], list: 'LB2', upTo: 2, from: 0 },
      ask: {
        before: 'b5x',
        q: 'Supaya koefisien $y$ sama dengan $bx+y+(7-b)=0$, bayangan $2x-y-9=0$ dikali…',
        opts: [
          { tex: '-1', ok: true },
          { tex: '1', hint: 'Koefisien $y$ masih $-1$. Harus diubah menjadi $1$.' },
          { tex: '2', hint: 'Yang disamakan koefisien $y$, cukup dikali $-1$.' },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Samakan $bx+y+(7-b)=0$ dengan $-2x+y+9=0$. Koefisien $x$ memberi $b=-2$, dan $7-b=9$ cocok.',
      visual: eq(2, 6),
      board: { title: 'Garis kedua', pins: ['pQ'], list: 'LB2', upTo: 3, from: 2, save: ['pB'] },
    },
    // ---- 5 · Nilai 2a − b ----
    {
      ch: 5,
      cap: 'Masukkan $a=2$ dan $b=-2$. Hati-hati tanda, $-(-2)=+2$, jadi $2a-b=4+2=6$.',
      visual: eq(3, 3),
      board: { title: 'Nilai 2a − b', pins: ['pA', 'pB'], list: 'LN', upTo: 3, from: 0 },
    },
    {
      ch: 5,
      cap: 'Jadi $2a-b=6$, yaitu pilihan E.',
      visual: { kind: 'soal', hl: 0, focus: 's-oE' },
      board: { title: 'Nilai 2a − b', pins: ['pA', 'pB'], list: 'LN', upTo: 4, from: 3 },
    },
    // tawaran cek grafik (opsional): Ya masuk Bagian 6, Tidak/Lewati langsung ke Bagian 7
    {
      ch: 5,
      cap: 'Mau cek hasilnya dengan grafik, yaitu menggerakkan satu titik dari tiap garis?',
      visual: eq(3, 3),
      board: { title: 'Nilai 2a − b', pins: ['pA', 'pB'], list: 'LN', upTo: 4, from: 4 },
      branch: { yes: 'Ya, lihat grafiknya' },
    },
    // ---- 6 · Cek dengan grafik (opsional) ----
    {
      ch: 6,
      cap: 'Dengan $a=2$, garis pertama $2x+y-9=0$. Titik $(3,3)$ dicerminkan tetap $(3,3)$, lalu digeser menjadi $(4,2)$, dan terletak pada $x+2y-8=0$.',
      visual: sc({ view: 'graph', g: 1, k: 3 }),
      board: { title: 'Cek dengan grafik', pins: ['pA', 'pB'], list: 'LG', upTo: 2, from: 0 },
    },
    {
      ch: 6,
      cap: 'Dengan $b=-2$, garis kedua $x-2y+6=0$. Titik $(0,3)$ menjadi $(3,0)$, lalu $(4,-1)$, dan terletak pada $2x-y-9=0$.',
      visual: sc({ view: 'graph', g: 2, k: 3 }),
      board: { title: 'Cek dengan grafik', pins: ['pA', 'pB'], list: 'LG', upTo: 4, from: 2 },
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
      cap: 'Cocokkan dengan pilihan. Hasilnya $2a-b=6$; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pA', 'pB'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'w1',
        q: 'Nilai $2a-b$ adalah…',
        letters: true,
        win: 'Jawabannya <b>E</b>.',
        opts: [
          { tex: '-6', hint: '$2(2)-(-2)=4+2$, bukan $-6$.' },
          { tex: '-2', hint: 'Itu nilai $b$, bukan $2a-b$.' },
          { tex: '0', hint: '$2(2)-(-2)=4+2=6$.' },
          { tex: '2', hint: 'Tanda $b$ terbalik. $b=-2$, jadi $-(-2)=+2$.' },
          { tex: '6', ok: true },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">E</span><span>Dari dua garis diperoleh $a=2$ dan $b=-2$, sehingga $2a-b=\\mathbf{6}$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LS', upTo: 2, from: 2 },
    },
  ],
  cards: [
    { label: 'A', statement: '$-6$', ok: false, formula: '-6\\ne6', why: 'Tidak sama dengan $2(2)-(-2)=6$.' },
    { label: 'B', statement: '$-2$', ok: false, formula: 'b=-2', why: 'Itu nilai $b$, bukan $2a-b$.' },
    { label: 'C', statement: '$0$', ok: false, formula: '0\\ne6', why: 'Tidak sama dengan $2(2)-(-2)=6$.' },
    { label: 'D', statement: '$2$', ok: false, formula: '4-2=2', why: 'Jebakan tanda, $b$ terbaca $+2$.' },
    { label: 'E', statement: '$6$', ok: true, formula: '4+2=6', why: '$2(2)-(-2)=6$.' },
  ],
  notes: {
    title: 'Pembahasan Soal 19: Cermin lalu Translasi pada Garis',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Transformasi geometri',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Aturan transformasi',
        lists: ['LR'],
        why: 'Cermin $y=x$ memetakan $(x,y)$ ke $(y,x)$. Translasi $(p,q)$ memetakan $(x,y)$ ke $(x+p,\\ y+q)$, jadi pada persamaan $x$ diganti $x-p$ dan $y$ diganti $y-q$.',
      },
      { title: 'Garis pertama', lists: ['LA'] },
      { title: 'Garis kedua', lists: ['LB', 'LB2'] },
      { title: 'Nilai 2a − b', lists: ['LN'] },
      { title: 'Cek dengan grafik (opsional)', lists: ['LG'], sketch: 'refl19' },
    ],
    answer: 'Jawaban: <b>E</b>, $2a-b=6$ (dengan $a=2$, $b=-2$).',
  },
  done: { seal: 'E', message: 'Dari dua garis diperoleh $a=2$ dan $b=-2$, sehingga $2a-b=\\mathbf{6}$.' },
  key: {
    answer: 'E',
    cardOk: [false, false, false, false, true],
    goldRows: ['n3', 'n4', 'w1', 's1', 's2'],
  },
  authorNotes: [
    'Modul baru (v1.51). Aturan dijelaskan lewat satu titik di kisi: (4, 1) → (1, 4) → (2, 3); pertanyaan cepat x − 1 dan y + 1 dari dokumen.',
    'Penurunan dokumen a1–a6 dan b1–b6 sebagai baris besar di panggung; huruf x (biru langit) dan y (ungu) terbang dari baris sebelumnya ke tempat barunya, sehingga pertukaran dan penggantian terlihat.',
    'Kesalahan umum dokumen (lupa dikali −1) menjadi pertanyaan cepat; jebakan tanda b pada kartu D. Uji titik dari Pemeriksaan hasil menjadi bagian opsional "Cek dengan grafik". Tanpa simbol ":" di baris papan.',
  ],
};

export default q19;
