/**
 * SOAL 21 — Rotasi Garis Berpusat (2, 0) (transformasi geometri; multi-jawaban). Kunci: (2, 0) dan (5, 2).
 * Sumber: docs/pembahasan25.md "SOAL 21", docs/soal25.md no. 21.
 * Alur revisi pemilik (v1.55, cara cepat dulu, dicatat di dokumen):
 *  - pahami: garis 3x + 2y = 6, rotasi 90° berlawanan arah jarum jam, pusat (2, 0) (bukan titik asal); ditanya titik pada l;
 *  - rumus cepat: rotasi 90° berlawanan jarum jam berpusat (a, b), pada persamaan x diganti (y + a − b) dan
 *    y diganti (a + b − x); pusat (2, 0) memberi x → (y + 2), y → (2 − x);
 *  - garis l: 3(y + 2) + 2(2 − x) = 6 → −2x + 3y + 4 = 0, yaitu 2x − 3y = 4; garis awal berputar menjadi l;
 *  - uji tiap titik pilihan pada 2x − 3y = 4: hanya (2, 0) dan (5, 2) yang memenuhi;
 *  - tawaran "Mau tahu kenapa rumus cepatnya seperti itu?" → bagian opsional "Asal rumus cepat": gambar umum titik (x, y)
 *    diputar mengelilingi (a, b), selisih (x − a, y − b) menjadi (−(y − b), x − a), sehingga x′ = a + b − y dan
 *    y′ = x − a + b; dibalik, y = a + b − x′ dan x = y′ + a − b, jadi x diganti (y + a − b), y diganti (a + b − x).
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Visual } from '../../engine/types';
import type { Eq21State } from '../../visuals/eq21';
import type { Rot21State } from '../../visuals/rot21';
import { getSoal } from '../index';

const sc = (state: Rot21State): Visual => ({ kind: 'svg', scene: 'rot21', state });
const eq = (set: Eq21State['set'], s: number): Visual => ({ kind: 'svg', scene: 'eq21', state: { set, s } });
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
    lede: 'Garis $3x+2y=6$ diputar $90^\\circ$ berlawanan arah jarum jam terhadap titik $(2,0)$. Dengan rumus cepat, kita cari garis bayangannya, lalu uji titik-titiknya.',
    facts: [
      { dt: 'Garis awal', dd: '3x + 2y = 6' },
      { dt: 'Rotasi', dd: '90° berlawanan jarum jam' },
      { dt: 'Pusat', dd: '(2, 0)' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Garis, sudut, dan pusat' },
    { t: 'Rumus cepat', d: 'x → (y + 2), y → (2 − x)' },
    { t: 'Garis bayangan l', d: '2x − 3y = 4' },
    { t: 'Uji tiap titik', d: '(2, 0) dan (5, 2)' },
    { t: 'Asal rumus cepat', d: 'Opsional: gambar dan pemisalan', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: '(2, 0) dan (5, 2)' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pR: { id: 'pR', toks: [T('PR1', 'x\\to(y+2),\\ y\\to(2-x)', '', 'q3c')] },
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
    LQ: [
      {
        id: 'q1',
        toks: [H('q1a', 'rotasi 90° berlawanan jarum jam, pusat', 'tx'), T('q1b', '(a,b)')],
        note: 'rumus cepat',
      },
      {
        id: 'q2',
        toks: [T('q2a', 'x\\to(y+a-b)'), O('q2b', ','), T('q2c', 'y\\to(a+b-x)')],
        note: 'pada persamaan, $x$ dan $y$ diganti',
        box: 'navy',
      },
      {
        id: 'q3',
        toks: [T('q3a', 'a=2,\\ b=0', '', '@s-pusat')],
        note: 'pusat $(2,0)$',
      },
      {
        id: 'q3x',
        toks: [T('q3c', 'x\\to(y+2),\\ y\\to(2-x)', 'blue', 'q3a')],
        note: '$y+2-0$ dan $2+0-x$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LB: [
      { id: 'b2', toks: [T('b2a', '3x+2y=6', '', '@s-g')], note: 'garis awal' },
      {
        id: 'b3',
        toks: [T('b3a', '3(y+2)+2(2-x)=6', '', 'PR1')],
        note: '$x$ diganti $(y+2)$, $y$ diganti $(2-x)$',
      },
      { id: 'b4', toks: [T('b4a', '3y+6+4-2x=6')], note: 'dijabarkan' },
      { id: 'b5', toks: [T('b5a', '-2x+3y+4=0')], note: '$6+4-6=4$' },
      {
        id: 'b6',
        toks: [H('b6a', 'garis', 'tx'), T('b6c', 'l\\ \\ 2x-3y=4', 'blue')],
        note: 'dikali $-1$, konstanta pindah ruas; simpan ke catatan',
        box: 'navy',
      },
    ],
    LC: [
      test('c1', 0, '-6+6', '0', false, '$2(-3)-3(-2)$, tidak pada $l$'),
      test('c2', 1, '-4+3', '-1', false, '$2(-2)-3(-1)$, tidak pada $l$'),
      test('c3', 2, '2-6', '-4', false, '$2(1)-3(2)$, tidak pada $l$'),
      test('c4', 3, '4-0', '4', true, '$2(2)-3(0)$, pada $l$; ini pusat rotasi, tidak berpindah'),
      test('c5', 4, '10-6', '4', true, '$2(5)-3(2)$, pada $l$'),
      {
        id: 'c6',
        toks: [H('c6a', 'Jawaban', 'lbl'), T('c6b', '(2,0)\\ \\text{dan}\\ (5,2)', 'gold')],
        box: 'gold',
      },
    ],
    // asal rumus cepat (opsional)
    LZ1: [
      {
        id: 'z1',
        toks: [T('z1a', '(x,y)'), O('z1b', '\\to'), T('z1c', "(x',y')")],
        note: 'misalkan titik $(x,y)$ diputar mengelilingi pusat $(a,b)$',
      },
      {
        id: 'z2',
        toks: [T('z2a', '(x-a,\\ y-b)')],
        note: 'selisih titik terhadap pusat',
      },
      {
        id: 'z3',
        toks: [H('z3a', 'diputar', 'tx'), O('z3b', '\\to'), T('z3c', '(-(y-b),\\ x-a)', 'blue', 'z2a')],
        note: 'selisih diputar $90^\\circ$ berlawanan jarum jam, $(u,v)$ menjadi $(-v,u)$',
      },
    ],
    LZ2: [
      {
        id: 'z4',
        toks: [T('z4a', "x'=a-(y-b)"), O('z4b', '='), T('z4c', 'a+b-y', 'blue')],
        note: 'tambahkan kembali pusat, koordinat $x$',
      },
      {
        id: 'z5',
        toks: [T('z5a', "y'=b+(x-a)"), O('z5b', '='), T('z5c', 'x-a+b', 'blue')],
        note: 'tambahkan kembali pusat, koordinat $y$',
      },
      {
        id: 'z6',
        toks: [T('z6a', "y=a+b-x'"), O('z6b', ','), T('z6c', "x=y'+a-b")],
        note: 'dibalik, titik lama dinyatakan dengan titik baru',
      },
      {
        id: 'z7',
        toks: [T('z7a', 'x\\to(y+a-b)'), O('z7b', ','), T('z7c', 'y\\to(a+b-x)', 'blue')],
        note: 'pada persamaan bayangan tanda aksen dilepas, inilah rumus cepatnya',
        box: 'navy',
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
    // ---- 2 · Rumus cepat ----
    {
      ch: 2,
      cap: 'Pakai rumus cepat. Untuk rotasi $90^\\circ$ berlawanan jarum jam berpusat $(a,b)$, $x$ diganti $(y+a-b)$ dan $y$ diganti $(a+b-x)$.',
      visual: eq(1, 1),
      board: { title: 'Rumus cepat', list: 'LQ', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Pusatnya $(2,0)$, jadi $a=2$ dan $b=0$. Maka $x$ diganti $(y+2)$ dan $y$ diganti $(2-x)$.',
      visual: eq(1, 2),
      board: { title: 'Rumus cepat', list: 'LQ', upTo: 4, from: 2, save: ['pR'] },
      ask: {
        before: 'q3x',
        q: 'Dengan pusat $(2,0)$, $x$ diganti dengan…',
        opts: [
          { tex: '(y+2)', ok: true },
          { tex: '(y-2)', hint: '$a-b=2-0=2$, jadi $y+2$.' },
          { tex: '(2-x)', hint: 'Itu pengganti $y$. Pengganti $x$ adalah $(y+a-b)=(y+2)$.' },
        ],
      },
    },
    // ---- 3 · Garis bayangan l ----
    {
      ch: 3,
      cap: 'Masukkan ke garis awal $3x+2y=6$. Huruf $x$ diganti $(y+2)$ dan $y$ diganti $(2-x)$.',
      visual: eq(2, 2),
      board: { title: 'Garis bayangan l', pins: ['pR'], list: 'LB', upTo: 2, from: 0 },
    },
    {
      ch: 3,
      cap: 'Jabarkan, $3y+6+4-2x=6$, lalu kumpulkan konstantanya, $-2x+3y+4=0$.',
      visual: eq(2, 3),
      board: { title: 'Garis bayangan l', pins: ['pR'], list: 'LB', upTo: 4, from: 2 },
    },
    {
      ch: 3,
      cap: 'Kalikan $-1$ dan pindahkan konstantanya. Garis bayangannya $l$, $2x-3y=4$.',
      visual: eq(2, 4),
      board: { title: 'Garis bayangan l', pins: ['pR'], list: 'LB', upTo: 5, from: 4, save: ['pL'] },
    },
    {
      ch: 3,
      cap: 'Di gambar, garis awal berputar $90^\\circ$ mengelilingi $(2,0)$ dan berhenti tepat di garis $l$.',
      visual: sc(GRAPH),
      board: { title: 'Garis bayangan l', pins: ['pR'], list: 'LB', upTo: 5, from: 5 },
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
      cap: 'Titik $(2,0)$ memberi $4$, karena pusat rotasi tidak berpindah. Titik $(5,2)$ memberi $10-6=4$.',
      visual: sc({ ...GRAPH, n: 5 }),
      board: { title: 'Uji tiap titik', pins: ['pL'], list: 'LC', upTo: 5, from: 3 },
    },
    {
      ch: 4,
      cap: 'Jadi titik yang terletak pada garis $l$ adalah $(2,0)$ dan $(5,2)$.',
      visual: sc({ ...GRAPH, n: 5 }),
      board: { title: 'Uji tiap titik', pins: ['pL'], list: 'LC', upTo: 6, from: 5 },
    },
    // tawaran asal rumus cepat (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Mau tahu kenapa rumus cepatnya $x\\to(y+a-b)$ dan $y\\to(a+b-x)$?',
      visual: sc({ ...GRAPH, n: 5 }),
      board: { title: 'Uji tiap titik', pins: ['pL'], list: 'LC', upTo: 6, from: 6 },
      branch: { yes: 'Ya, jelaskan asal rumusnya' },
    },
    // ---- 5 · Asal rumus cepat (opsional) ----
    {
      ch: 5,
      cap: 'Misalkan titik $(x,y)$ diputar mengelilingi pusat $(a,b)$ menjadi $(x^{\\prime},y^{\\prime})$. Selisih titik terhadap pusat adalah $(x-a,\\ y-b)$.',
      visual: sc({ r: 1, gen: true }),
      board: { title: 'Asal rumus cepat', list: 'LZ1', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Diputar $90^\\circ$ berlawanan jarum jam, $(u,v)$ menjadi $(-v,u)$. Jadi selisihnya menjadi $(-(y-b),\\ x-a)$.',
      visual: sc({ r: 2, gen: true }),
      board: { title: 'Asal rumus cepat', list: 'LZ1', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: 'Tambahkan kembali pusatnya. Jadi $x^{\\prime}=a+b-y$ dan $y^{\\prime}=x-a+b$.',
      visual: eq(3, 4),
      board: { title: 'Asal rumus cepat', list: 'LZ2', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Dibalik, titik lama $y=a+b-x^{\\prime}$ dan $x=y^{\\prime}+a-b$. Pada persamaan bayangan tanda aksen dilepas, itulah rumus cepatnya.',
      visual: eq(3, 6),
      board: { title: 'Asal rumus cepat', list: 'LZ2', upTo: 4, from: 2 },
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
        title: 'Rumus cepat',
        lists: ['LQ'],
        why: 'Rotasi $90^\\circ$ berlawanan jarum jam berpusat $(a,b)$: pada persamaan, $x$ diganti $(y+a-b)$ dan $y$ diganti $(a+b-x)$.',
      },
      { title: 'Garis bayangan l', lists: ['LB'], sketch: 'rot21' },
      { title: 'Uji tiap titik', lists: ['LC'] },
      { title: 'Asal rumus cepat (opsional)', lists: ['LZ1', 'LZ2'] },
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
    'Revisi pemilik (v1.55): langsung rumus cepat, rotasi 90° berlawanan jarum jam berpusat (a, b), x diganti (y + a − b) dan y diganti (a + b − x); dengan pusat (2, 0), x → (y + 2) dan y → (2 − x). Hasilnya sama dengan dokumen b1–b6, l: 2x − 3y = 4.',
    'Adegan eq21 memakai gaya penurunan soal 19: huruf x dan y terbang ke penggantinya. Garis awal berputar menjadi l (adegan rot21), lalu tiap titik pilihan diuji (dokumen c1–c5).',
    'Tawaran "Mau tahu kenapa rumus cepatnya seperti itu?" membuka bagian opsional: gambar umum titik (x, y) dan pusat (a, b) (rot21 mode gen), pemisalan selisih (x − a, y − b) yang diputar menjadi (−(y − b), x − a), lalu dibalik menjadi rumus cepat. Tanpa simbol ":" di baris papan.',
  ],
};

export default q21;
