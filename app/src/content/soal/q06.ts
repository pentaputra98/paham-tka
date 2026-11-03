/**
 * SOAL 6 — Sisa Pembagian Suku Banyak (pembagian bersusun, kesamaan koefisien; pilihan tunggal). Kunci: C (a + b = −1).
 * Sumber: docs/pembahasan25.md "SOAL 6", docs/soal25.md no. 6.
 * Alur v1.35 (dicatat di dokumen):
 *  - pahami: f(x) memuat a dan b; dibagi x² + x + 1 bersisa 5x − 1; ditanya a + b;
 *  - pembagian bersusun dengan a dan b dibawa sebagai huruf (dokumen, Pemeriksaan hasil): hasil bagi
 *    x² + (a − 1)x + (b − a), sisa hitungan (2 − b)x + (a − b − 6);
 *  - samakan dengan sisa soal: 2 − b = 5 → b = −3; a − b − 6 = −1 → a = 2; a + b = −1 (pilihan C), cek sisa;
 *  - bagian opsional "Kesamaan koefisien" (alur utama dokumen): f(x) − (5x − 1) = (x² + x + 1)(x² + px + q).
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Div6State } from '../../visuals/div6';
import { getSoal } from '../index';

const div = (state: Div6State): Visual => ({ kind: 'svg', scene: 'div6', state });
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
  visualSrc: ['d-q1', 'd-q2', 'd-q3', 'd-rx', 'd-rc', 'd-gx', 'd-gc'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Suku banyak',
    titleLines: ['Pembahasan Soal', 'Sisa <span class="accent">Pembagian</span>', 'Suku Banyak'],
    lede: '$f(x)=x^4+ax^3+bx^2+x-6$ dibagi $x^2+x+1$ bersisa $5x-1$. Kita bagi bersusun, lalu samakan sisanya untuk mencari $a$ dan $b$.',
    facts: [
      { dt: 'Pembagi', dd: 'x² + x + 1' },
      { dt: 'Sisa', dd: '5x − 1' },
      { dt: 'Dicari', dd: 'a + b' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Pembagian bersusun', d: 'a dan b ikut dibawa' },
    { t: 'Samakan sisanya', d: 'b = −3, a = 2' },
    { t: 'Jawaban', d: 'a + b = −1' },
    { t: 'Kesamaan koefisien', d: 'Opsional: cara alternatif', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban C' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pR: { id: 'pR', toks: [H('PR1', 'sisa', 'tx', 'b6a'), T('PR2', '(2-b)x+(a-b-6)', '', 'b6b')] },
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
    // pembagian bersusun
    LB: [
      {
        id: 'b1',
        toks: [H('b1a', 'suku 1', 'tx'), T('b1b', 'x^4\\div x^2=x^2', 'blue', '@d-q1')],
        note: 'kalikan $x^2$ dengan pembagi, lalu kurangkan',
      },
      {
        id: 'b2',
        toks: [T('b2b', '(a-1)x^3+(b-1)x^2+x-6')],
        note: 'sisa sementara; $ax^3-x^3=(a-1)x^3$ dan $bx^2-x^2=(b-1)x^2$',
      },
      {
        id: 'b3',
        toks: [H('b3a', 'suku 2', 'tx'), T('b3b', '(a-1)x^3\\div x^2=(a-1)x', 'blue', '@d-q2')],
        note: 'kalikan dengan pembagi, lalu kurangkan lagi',
      },
      {
        id: 'b4',
        toks: [H('b4a', 'suku x', 'tx'), T('b4b', 'x-(a-1)x'), O('b4c', '='), T('b4d', '(2-a)x', 'blue')],
        note: 'kurung dibuka, $x-ax+x=(2-a)x$',
      },
      {
        id: 'b5',
        toks: [H('b5a', 'suku 3', 'tx'), T('b5b', '(b-a)x^2\\div x^2=b-a', 'blue', '@d-q3')],
        note: 'kalikan dengan pembagi, lalu kurangkan sekali lagi',
      },
      {
        id: 'b6',
        toks: [H('b6a', 'sisa', 'lbl'), T('b6b', '(2-b)x+(a-b-6)', 'blue', '@d-rx')],
        note: 'derajatnya di bawah pembagi, pembagian berhenti; simpan ke catatan',
        box: 'navy',
      },
    ],
    // samakan sisa hitungan dengan sisa soal
    LS: [
      {
        id: 'c1',
        toks: [T('c1a', '(2-b)x+(a-b-6)', '', 'PR2'), O('c1b', '='), T('c1c', '5x-1', 'red', '@d-gx')],
        note: 'sisa hitungan sama dengan sisa soal',
        box: 'navy',
      },
      {
        id: 'c2',
        toks: [
          H('c2a', 'koefisien x', 'tx'),
          T('c2b', '2-b', '', '@d-rx'),
          O('c2c', '='),
          T('c2d', '5', 'red', '@d-gx'),
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
          T('c5b', 'a-b-6', '', '@d-rc'),
          O('c5c', '='),
          T('c5d', '-1', 'red', '@d-gc'),
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
      {
        id: 'a4',
        toks: [T('a4a', '+(p+q)x+q', 'blue')],
        note: 'lanjutan baris di atas',
      },
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
        note: 'koefisien $x^3$ dan $x^2$; sama dengan cara bersusun',
        box: 'navy',
      },
      {
        id: 'a8',
        toks: [T('a8a', 'x^2+(a-1)x+(b-a)'), O('a8b', '='), T('a8c', 'x^2+x-5')],
        note: 'hasil bagi cara bersusun, sama dengan $x^2+px+q$',
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
    // ---- 2 · Pembagian bersusun ----
    {
      ch: 2,
      cap: 'Kita bagi $f(x)$ dengan $x^2+x+1$ secara bersusun, seperti membagi bilangan. Huruf $a$ dan $b$ ikut dibawa.',
      visual: div({ s: 1 }),
      board: { title: 'Pembagian bersusun', list: 'LB', upTo: 0, from: 0 },
    },
    {
      ch: 2,
      cap: 'Suku pertama, $x^4\\div x^2=x^2$. Kalikan $x^2$ dengan pembagi lalu kurangkan, sisanya $(a-1)x^3+(b-1)x^2+x-6$.',
      visual: div({ s: 2 }),
      board: { title: 'Pembagian bersusun', list: 'LB', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Suku kedua, $(a-1)x^3\\div x^2=(a-1)x$. Hati-hati saat mengurangkan, $x-(a-1)x=(2-a)x$.',
      visual: div({ s: 3 }),
      board: { title: 'Pembagian bersusun', list: 'LB', upTo: 4, from: 2 },
      ask: {
        before: 'b4',
        q: 'Hasil $x-(a-1)x$ adalah…',
        opts: [
          { tex: '(2-a)x', ok: true },
          { tex: 'ax', hint: 'Kurung dibuka dulu, $-(a-1)x=-ax+x$, jadi $x-ax+x$.' },
          { tex: '(a-2)x', hint: 'Tandanya terbalik. $x-ax+x=2x-ax=(2-a)x$.' },
          { tex: '-ax', hint: 'Masih ada $x+x=2x$ dari kurung yang dibuka.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Suku ketiga, $(b-a)x^2\\div x^2=b-a$. Setelah dikurangkan sisanya $(2-b)x+(a-b-6)$, dan pembagian berhenti.',
      visual: div({ s: 4 }),
      board: { title: 'Pembagian bersusun', list: 'LB', upTo: 6, from: 4, save: ['pR'] },
    },
    // ---- 3 · Samakan sisanya ----
    {
      ch: 3,
      cap: 'Sisa hasil hitungan harus sama dengan sisa di soal, yaitu $5x-1$.',
      visual: div({ s: 5 }),
      board: { title: 'Samakan sisanya', pins: ['pR'], list: 'LS', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Samakan koefisien $x$, $2-b=5$. Angka $2$ pindah ruas, $-b=3$, jadi $b=-3$.',
      visual: div({ s: 5, hl: 'x' }),
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
      ch: 3,
      cap: 'Samakan konstantanya, $a-b-6=-1$. Masukkan $b=-3$, jadi $a-3=-1$ dan $a=2$.',
      visual: div({ s: 5, hl: 'c' }),
      board: { title: 'Samakan sisanya', pins: ['pR', 'pB'], list: 'LS', upTo: 8, from: 4, save: ['pA'] },
    },
    // ---- 4 · Jawaban ----
    {
      ch: 4,
      cap: 'Jadi $a+b=2+(-3)=-1$, pilihan C. Cek, sisanya $(2+3)x+(2+3-6)=5x-1$, sesuai soal.',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Jawaban', pins: ['pA', 'pB'], list: 'LJ', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Hati-hati, $5$ adalah koefisien $x$ pada sisa, bukan $a+b$. Pilihan B hanya mengambil angka dari soal.',
      visual: { kind: 'soal', hl: 0, focus: 's-oB' },
      board: { title: 'Jawaban', pins: ['pA', 'pB'], list: 'LJ', upTo: 3, from: 2 },
    },
    // tawaran cara alternatif (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Mau lihat cara alternatif dengan kesamaan koefisien, tanpa pembagian bersusun?',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Jawaban', pins: ['pA', 'pB'], list: 'LJ', upTo: 3, from: 3 },
      branch: { yes: 'Ya, lihat kesamaan koefisien' },
    },
    // ---- 5 · Kesamaan koefisien (opsional) ----
    {
      ch: 5,
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
      ch: 5,
      cap: 'Hasil baginya berderajat dua, $x^2+px+q$. Kalikan dengan pembagi, lalu kumpulkan per pangkat.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 4, from: 1 },
    },
    {
      ch: 5,
      cap: 'Samakan koefisiennya. Konstanta memberi $q=-5$, dan koefisien $x$ memberi $p+q=-4$, jadi $p=1$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 6, from: 4 },
    },
    {
      ch: 5,
      cap: 'Koefisien $x^3$ dan $x^2$ memberi $a=p+1=2$ dan $b=p+q+1=-3$, sama dengan cara bersusun.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 7, from: 6 },
    },
    {
      ch: 5,
      cap: 'Tahukah kalian? Hasil bagi cara bersusun $x^2+(a-1)x+(b-a)$ menjadi $x^2+x-5$, sama dengan $x^2+px+q$.',
      visual: div({ s: 4 }),
      board: { title: 'Kesamaan koefisien', list: 'LK', upTo: 8, from: 7 },
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
    // ---- 8 · Selesai ----
    {
      ch: 8,
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
    {
      label: 'E',
      statement: '$-7$',
      ok: false,
      formula: '-7\\ne-1',
      why: 'Tidak sama dengan $2+(-3)$.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 6: Sisa Pembagian Suku Banyak',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Suku banyak',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Pembagian bersusun',
        lists: ['LB'],
        why: 'Bagi suku demi suku seperti membagi bilangan: bagi suku terdepan, kalikan dengan pembagi, kurangkan, ulangi sampai derajat sisa di bawah pembagi.',
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
    'Ditulis ulang dengan alur v1.35: jalur utama pembagian bersusun dengan a dan b dibawa sebagai huruf (dokumen, Pemeriksaan hasil). Sisa hitungan (2 − b)x + (a − b − 6) sama dengan bentuk f(ω) pada metode kedua dokumen.',
    'Langkah pembagian (sisa sementara (a − 1)x³ + (b − 1)x² + x − 6, lalu (b − a)x² + (2 − a)x − 6) adalah turunan aljabar dari pembagian bersusun itu; adegan baru div6.',
    'b = −3 dan a = 2 dari penyamaan sisa (dokumen d2, d4); angka pindah ruas terbang, tidak dicoret. Pertanyaan cepat baru x − (a − 1)x dan 2 − b = 5 dengan pengecoh kesalahan tanda.',
    'Kesamaan koefisien (alur utama dokumen, a1–d5) menjadi bagian opsional; Tahukah kalian: hasil bagi bersusun x² + (a − 1)x + (b − a) = x² + x − 5 sama dengan x² + px + q.',
    'Jebakan pilihan B (5 = koefisien x pada sisa) dan D (−5 = konstanta hasil bagi) dari kartu dokumen.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q06;
