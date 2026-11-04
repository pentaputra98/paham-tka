/**
 * SOAL 21 — Rotasi Garis Berpusat (2, 0) (transformasi geometri; multi-jawaban). Kunci: (2, 0) dan (5, 2).
 * Sumber: docs/pembahasan25.md "SOAL 21", docs/soal25.md no. 21.
 * Alur (v1.54, dicatat di dokumen):
 *  - pahami: garis 3x + 2y = 6, rotasi 90° berlawanan arah jarum jam, pusat (2, 0) (bukan titik asal); ditanya titik pada l;
 *  - aturan lewat satu titik: A(4, −3), geser pusat ke O (u, v) = (2, −3), putar (−v, u) = (3, 2), geser kembali (5, 2);
 *    jadi (x, y) → (2 − y, x − 2);
 *  - garis l: y = 2 − x′ dan x = y′ + 2 dimasukkan ke 3x + 2y = 6 → −2x′ + 3y′ + 4 = 0, yaitu 2x − 3y = 4;
 *    di panggung garis awal berputar 90° mengelilingi P menjadi l;
 *  - uji tiap titik pilihan pada 2x − 3y = 4: hanya (2, 0) dan (5, 2) yang memenuhi;
 *  - bagian opsional "Cara dua titik": (0, 3) → (−1, −2), (2, 0) tetap (pusat rotasi), garis melalui keduanya.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Visual } from '../../engine/types';
import type { Rot21State } from '../../visuals/rot21';
import { getSoal } from '../index';

const sc = (state: Rot21State): Visual => ({ kind: 'svg', scene: 'rot21', state });
const PTS: Array<[string, string]> = [
  ['-3', '-2'],
  ['-2', '-1'],
  ['1', '2'],
  ['2', '0'],
  ['5', '2'],
];
const GRAPH: Rot21State = { g0: true, rot: true };

/** uji satu titik pada l: 2x − 3y = 4 */
const test = (id: string, i: number, sub: string, val: string, ok: boolean, note: string): Row => ({
  id,
  toks: [
    T(`${id}a`, `(${PTS[i]![0]},${PTS[i]![1]})`, '', `@s-o${i + 1}`),
    O(`${id}b`, '\\to'),
    T(`${id}c`, sub),
    O(`${id}d`, '='),
    T(`${id}e`, val, ok ? 'gold' : 'red'),
    ...(ok ? [T(`${id}g`, '\\;\\checkmark', 'gold')] : [O(`${id}f`, '\\ne'), T(`${id}g`, '4')]),
  ],
  note,
  ...(ok ? { box: 'gold' as const } : {}),
});

const q21: SoalContent = {
  meta: getSoal(21)!,
  sourceRef: 'docs/pembahasan25.md#soal-21',
  layout: 'full',
  paper: {
    html: `<p>Garis l merupakan bayangan garis <span class="hl hl-red" data-hl="1"><span data-src="s-g">$3x+2y=6$</span></span> setelah dirotasikan sebesar <span class="hl hl-blue" data-hl="1"><span data-src="s-90">$90^{\\circ}$ berlawanan arah jarum jam</span></span> dengan <span class="hl hl-blue" data-hl="1"><span data-src="s-pusat">pusat rotasi $(2, 0)$</span></span>.</p>
<p>Manakah koordinat titik berikut yang <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">terletak pada garis l</span></span>? Pilih semua jawaban yang benar.</p>
<ul class="checks">
${PTS.map(([x, y], i) => `<li><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">$(${x},${y})$</span></span></li>`).join('\n')}
</ul>`,
    srcNames: ['s-g', 's-90', 's-pusat', 's-tanya', 's-o1', 's-o2', 's-o3', 's-o4', 's-o5'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Transformasi geometri',
    titleLines: ['Pembahasan Soal', 'Rotasi <span class="accent">Garis</span>', 'Pusat (2, 0)'],
    lede: 'Garis $3x+2y=6$ diputar $90^\\circ$ berlawanan arah jarum jam terhadap titik $(2,0)$. Titik mana saja yang terletak pada garis hasil putaran?',
    facts: [
      { dt: 'Garis awal', dd: '3x + 2y = 6' },
      { dt: 'Rotasi', dd: '90° berlawanan jarum jam' },
      { dt: 'Pusat', dd: '(2, 0)' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Garis, sudut, dan pusat' },
    { t: 'Aturan rotasi', d: '(x, y) → (2 − y, x − 2)' },
    { t: 'Garis bayangan l', d: '2x − 3y = 4' },
    { t: 'Uji tiap titik', d: '(2, 0) dan (5, 2)' },
    { t: 'Cara dua titik', d: 'Opsional: putar dua titik', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: '(2, 0) dan (5, 2)' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pR: { id: 'pR', toks: [T('PR1', '(x,y)\\to(2-y,\\ x-2)', '', 'a3c')] },
    pL: { id: 'pL', toks: [T('PL1', 'l\\ \\ 2x-3y=4', '', 'b6c')] },
  },
  lists: {
    L1: [
      { id: 'k1', toks: [T('k1a', '3x+2y=6', 'red', '@s-g')], note: 'garis awal' },
      {
        id: 'k2',
        toks: [H('k2a', 'rotasi 90° berlawanan jarum jam', 'tx', '@s-90')],
        note: 'sudut dan arah putaran',
      },
      {
        id: 'k2x',
        toks: [H('k2c', 'pusat', 'tx'), T('k2d', '(2,0)', 'blue', '@s-pusat')],
        note: 'pusatnya bukan titik asal',
      },
      {
        id: 'k3',
        toks: [
          H('k3a', 'Ditanya', 'lbl'),
          H('k3b', 'titik yang terletak pada garis <i>l</i>', 'tx', '@s-tanya'),
        ],
      },
    ],
    LA: [
      {
        id: 'a1',
        toks: [T('a1a', '(u,v)'), O('a1b', '='), T('a1c', '(x-2,\\ y)')],
        note: 'geser pusat $(2,0)$ ke titik asal; contoh $A(4,-3)$ menjadi $(2,-3)$',
      },
      {
        id: 'a2',
        toks: [T('a2a', '(u,v)'), O('a2b', '\\to'), T('a2c', '(-v,\\ u)')],
        note: 'putar $90^\\circ$ berlawanan jarum jam; $(2,-3)$ menjadi $(3,2)$',
      },
      {
        id: 'a3',
        toks: [T('a3a', '(x,y)'), O('a3b', '\\to'), T('a3c', '(2-y,\\ x-2)', 'blue')],
        note: 'geser kembali, $x$ ditambah $2$; $A$ menjadi $A^{\\prime}(5,2)$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LB: [
      {
        id: 'b1',
        toks: [T('b1a', "x'=2-y", '', 'PR1'), O('b1b', '\\to'), T('b1c', "y=2-x'", 'blue')],
        note: 'ambil $y$ lama',
      },
      {
        id: 'b1x',
        toks: [T('b1d', "y'=x-2", '', 'PR1'), O('b1e', '\\to'), T('b1f', "x=y'+2", 'blue')],
        note: 'ambil $x$ lama',
      },
      { id: 'b2', toks: [T('b2a', '3x+2y=6', '', '@s-g')], note: 'garis awal' },
      {
        id: 'b3',
        toks: [T('b3a', "3(y'+2)+2(2-x')=6", '', 'b1f')],
        note: '$x$ dan $y$ lama dimasukkan',
      },
      { id: 'b4', toks: [T('b4a', "3y'+6+4-2x'=6")], note: 'dijabarkan' },
      { id: 'b5', toks: [T('b5a', "-2x'+3y'+4=0")], note: '$6+4-6=4$' },
      {
        id: 'b6',
        toks: [H('b6a', 'garis', 'tx'), T('b6c', 'l\\ \\ 2x-3y=4', 'blue')],
        note: 'dikali $-1$, konstanta pindah ruas, tanda aksen dilepas; simpan ke catatan',
        box: 'navy',
      },
    ],
    LC: [
      test('c1', 0, '-6+6', '0', false, '$2(-3)-3(-2)$, tidak pada $l$'),
      test('c2', 1, '-4+3', '-1', false, '$2(-2)-3(-1)$, tidak pada $l$'),
      test('c3', 2, '2-6', '-4', false, '$2(1)-3(2)$, tidak pada $l$'),
      test('c4', 3, '4-0', '4', true, '$2(2)-3(0)$, pada $l$; ini pusat rotasi, tidak berpindah'),
      test('c5', 4, '10-6', '4', true, '$2(5)-3(2)$, pada $l$; bayangan $A(4,-3)$'),
      {
        id: 'c6',
        toks: [H('c6a', 'Jawaban', 'lbl'), T('c6b', '(2,0)\\ \\text{dan}\\ (5,2)', 'gold')],
        box: 'gold',
      },
    ],
    // cara dua titik (opsional)
    LX: [
      {
        id: 'x1',
        toks: [T('x1a', '(0,3)'), O('x1b', '\\to'), T('x1e', '(-1,-2)', 'blue', 'PR1')],
        note: 'titik $(0,3)$ pada garis awal diputar, $(2-3,\\ 0-2)$',
      },
      {
        id: 'x2',
        toks: [T('x2a', '(2,0)'), O('x2b', '\\to'), T('x2c', '(2,0)', 'blue')],
        note: 'pusat rotasi ada di garis awal, jadi tidak berpindah',
      },
      {
        id: 'x3',
        toks: [T('x3a', '-2+6=4'), O('x3b', ','), T('x3c', '4-0=4'), T('x3d', '\\;\\checkmark', 'blue')],
        note: '$(-1,-2)$ dan $(2,0)$ memenuhi $2x-3y=4$, sama dengan hasil aljabar',
      },
    ],
    L7: [
      { id: 'w1', toks: [H('w1a', 'Jawaban', 'lbl'), T('w1b', '(2,0)\\ \\text{dan}\\ (5,2)')], box: 'gold' },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', 'l\\ \\ 2x-3y=4')], note: 'bayangan $3x+2y=6$', box: 'navy' },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), T('r2b', '(2,0)\\ \\text{dan}\\ (5,2)')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Garis $3x+2y=6$ diputar $90^\\circ$ berlawanan arah jarum jam, dan pusatnya $(2,0)$, bukan titik asal.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 3, from: 0 },
    },
    {
      ch: 1,
      cap: 'Yang ditanya titik-titik yang terletak pada bayangannya, yaitu garis $l$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 4, from: 3 },
    },
    // ---- 2 · Aturan rotasi ----
    {
      ch: 2,
      cap: 'Coba pada titik $A(4,-3)$. Geser dulu pusat $(2,0)$ ke titik asal, jadi selisihnya $(4-2,\\ -3-0)=(2,-3)$.',
      visual: sc({ r: 1 }),
      board: { title: 'Aturan rotasi', list: 'LA', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Putar $90^\\circ$ berlawanan arah jarum jam, $(u,v)$ menjadi $(-v,u)$. Jadi $(2,-3)$ menjadi $(3,2)$.',
      visual: sc({ r: 2 }),
      board: { title: 'Aturan rotasi', list: 'LA', upTo: 2, from: 1 },
      ask: {
        before: 'a2',
        q: 'Rotasi $90^\\circ$ berlawanan jarum jam mengubah $(u,v)$ menjadi…',
        opts: [
          { tex: '(-v,\\ u)', ok: true },
          {
            tex: '(v,\\ -u)',
            hint: 'Itu rotasi searah jarum jam. Berlawanan jarum jam, titik $(1,0)$ menjadi $(0,1)$.',
          },
          { tex: '(-u,\\ -v)', hint: 'Itu rotasi $180^\\circ$.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Geser kembali, tambahkan $2$ pada $x$. Jadi $A$ menjadi $(5,2)$, dan aturannya $(x,y)\\to(2-y,\\ x-2)$.',
      visual: sc({ r: 2 }),
      board: { title: 'Aturan rotasi', list: 'LA', upTo: 3, from: 2, save: ['pR'] },
    },
    // ---- 3 · Garis bayangan l ----
    {
      ch: 3,
      cap: 'Dari aturan itu, ambil $x$ dan $y$ lama. $x^{\\prime}=2-y$ memberi $y=2-x^{\\prime}$, dan $y^{\\prime}=x-2$ memberi $x=y^{\\prime}+2$.',
      visual: sc({ g0: true }),
      board: { title: 'Garis bayangan l', pins: ['pR'], list: 'LB', upTo: 2, from: 0 },
      ask: {
        before: 'b1',
        q: "Dari $x'=2-y$, maka $y=$…",
        opts: [
          { tex: "2-x'", ok: true },
          { tex: "x'-2", hint: "Pindahkan $y$ ke kiri dan $x'$ ke kanan, $y=2-x'$." },
          { tex: "2+x'", hint: "$x'=2-y$ memberi $y=2-x'$. Tanda $x'$ tetap negatif." },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Masukkan ke garis awal $3x+2y=6$. Jadi $3(y^{\\prime}+2)+2(2-x^{\\prime})=6$.',
      visual: sc({ g0: true }),
      board: { title: 'Garis bayangan l', pins: ['pR'], list: 'LB', upTo: 4, from: 2 },
    },
    {
      ch: 3,
      cap: 'Jabarkan, $3y^{\\prime}+6+4-2x^{\\prime}=6$, lalu kumpulkan konstantanya, $-2x^{\\prime}+3y^{\\prime}+4=0$.',
      visual: sc({ g0: true }),
      board: { title: 'Garis bayangan l', pins: ['pR'], list: 'LB', upTo: 6, from: 4 },
    },
    {
      ch: 3,
      cap: 'Kalikan $-1$ dan pindahkan konstantanya. Garis bayangannya $l$, $2x-3y=4$, yaitu garis awal yang berputar mengelilingi $(2,0)$.',
      visual: sc(GRAPH),
      board: { title: 'Garis bayangan l', pins: ['pR'], list: 'LB', upTo: 7, from: 6, save: ['pL'] },
    },
    // ---- 4 · Uji tiap titik ----
    {
      ch: 4,
      cap: 'Masukkan tiap titik pilihan ke $2x-3y=4$. Titik $(-3,-2)$ dan $(-2,-1)$ memberi $0$ dan $-1$, bukan $4$.',
      visual: sc({ ...GRAPH, n: 2 }),
      board: { title: 'Uji tiap titik', pins: ['pL'], list: 'LC', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Titik $(1,2)$ memberi $2-6=-4$, juga bukan $4$.',
      visual: sc({ ...GRAPH, n: 3 }),
      board: { title: 'Uji tiap titik', pins: ['pL'], list: 'LC', upTo: 3, from: 2 },
    },
    {
      ch: 4,
      cap: 'Titik $(2,0)$ memberi $4$, karena pusat rotasi tidak berpindah. Titik $(5,2)$ memberi $10-6=4$, bayangan $A(4,-3)$.',
      visual: sc({ ...GRAPH, n: 5 }),
      board: { title: 'Uji tiap titik', pins: ['pL'], list: 'LC', upTo: 5, from: 3 },
    },
    {
      ch: 4,
      cap: 'Jadi titik yang terletak pada garis $l$ adalah $(2,0)$ dan $(5,2)$.',
      visual: sc({ ...GRAPH, n: 5 }),
      board: { title: 'Uji tiap titik', pins: ['pL'], list: 'LC', upTo: 6, from: 5 },
    },
    // tawaran cara dua titik (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Mau lihat cara lain, yaitu memutar dua titik dari garis awal?',
      visual: sc({ ...GRAPH, n: 5 }),
      board: { title: 'Uji tiap titik', pins: ['pL'], list: 'LC', upTo: 6, from: 6 },
      branch: { yes: 'Ya, lihat cara dua titik' },
    },
    // ---- 5 · Cara dua titik (opsional) ----
    {
      ch: 5,
      cap: 'Ambil dua titik pada garis awal, $(0,3)$ dan $(2,0)$. Titik $(0,3)$ diputar menjadi $(-1,-2)$, sedangkan $(2,0)$ adalah pusat, jadi tetap.',
      visual: sc({ g0: true, two: true }),
      board: { title: 'Cara dua titik', pins: ['pR'], list: 'LX', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Garis $l$ melalui $(-1,-2)$ dan $(2,0)$. Keduanya memenuhi $2x-3y=4$, sama dengan hasil aljabar.',
      visual: sc({ ...GRAPH, two: true }),
      board: { title: 'Cara dua titik', pins: ['pR'], list: 'LX', upTo: 3, from: 2 },
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
      cap: 'Cocokkan dengan pilihan. Hanya titik yang memenuhi $2x-3y=4$; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pL'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'w1',
        q: 'Titik yang terletak pada garis $l$ adalah…',
        col: true,
        win: '<b>(2, 0) dan (5, 2)</b>.',
        opts: [
          { txt: '(2, 0) dan (5, 2)', ok: true },
          { txt: '(5, 2) saja', hint: '$(2,0)$ juga, $2(2)-3(0)=4$. Pusat rotasi tidak berpindah.' },
          { txt: '(1, 2) dan (5, 2)', hint: '$(1,2)$ memberi $2-6=-4$, bukan $4$.' },
          { txt: '(−3, −2) dan (2, 0)', hint: '$(-3,-2)$ memberi $-6+6=0$, bukan $4$.' },
        ],
      },
    },
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">(2, 0) · (5, 2)</span><span>Garis bayangan $l$ adalah $2x-3y=4$. Titik yang terletak padanya $(2,0)$ dan $(5,2)$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    { label: '1', statement: '$(-3,-2)$', ok: false, formula: '0\\ne4', why: 'Tidak memenuhi $2x-3y=4$.' },
    { label: '2', statement: '$(-2,-1)$', ok: false, formula: '-1\\ne4', why: 'Tidak memenuhi $2x-3y=4$.' },
    { label: '3', statement: '$(1,2)$', ok: false, formula: '-4\\ne4', why: 'Tidak memenuhi $2x-3y=4$.' },
    { label: '4', statement: '$(2,0)$', ok: true, formula: '4=4', why: 'Pusat rotasi, tidak berpindah.' },
    { label: '5', statement: '$(5,2)$', ok: true, formula: '10-6=4', why: 'Bayangan $(4,-3)$.' },
  ],
  notes: {
    title: 'Pembahasan Soal 21: Rotasi Garis Berpusat (2, 0)',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Transformasi geometri',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Aturan rotasi',
        lists: ['LA'],
        why: 'Rotasi $90^\\circ$ berlawanan jarum jam berpusat $(a,b)$: geser pusat ke titik asal, putar $(u,v)\\to(-v,u)$, lalu geser kembali.',
      },
      { title: 'Garis bayangan l', lists: ['LB'], sketch: 'rot21' },
      { title: 'Uji tiap titik', lists: ['LC'] },
      { title: 'Cara dua titik (opsional)', lists: ['LX'] },
    ],
    answer: 'Jawaban: <b>(2, 0) dan (5, 2)</b>.',
  },
  done: {
    seal: '(2, 0) · (5, 2)',
    message: 'Garis bayangan $l$ adalah $2x-3y=4$. Titik yang terletak padanya $(2,0)$ dan $(5,2)$.',
  },
  key: {
    answer: '(2, 0), (5, 2)',
    cardOk: [false, false, false, true, true],
    goldRows: ['c4', 'c5', 'c6', 'w1', 'r2'],
  },
  authorNotes: [
    'Modul baru (v1.54). Aturan rotasi dijelaskan lewat satu titik A(4, −3) dari Pemeriksaan hasil dokumen: lengan dari pusat (2, 0) berputar 90° dan A mendarat di (5, 2); dokumen a1–a3 dan pertanyaan cepat (−v, u).',
    'Garis l dari dokumen b1–b6 (pertanyaan cepat y = 2 − x′), di panggung garis awal berputar mengelilingi P menjadi l. Uji titik dokumen c1–c5 satu per satu dari pilihan.',
    'Cara dua titik dari Pemeriksaan hasil dokumen menjadi bagian opsional. Tanpa simbol ":" di baris papan.',
  ],
};

export default q21;
