/**
 * SOAL 11 — Kedalaman Air Laut (fungsi trigonometri; pilihan tunggal). Kunci: E (15 jam).
 * Sumber: docs/pembahasan25.md "SOAL 11", docs/soal25.md no. 11, docs/grafik_kedalaman_air_laut.png.
 * Alur gaya mengajar Pak Penta (revisi pemilik v1.20, dicatat di dokumen): cari dulu a dan b dari grafik —
 * puncak 14,3 dan lembah 10,3 → garis tengah a = 12,3, amplitudo b = 2, model disimpan ke catatan → tahukah
 * kalian: 12,3 tepat garis tengah → persamaan, 12,3 pindah ruas (bukan dicoret) → cos(πt/6) = 0 → t = 3 + 6k →
 * titik berjalan menandai kemunculan ke-1, ke-2, ke-3 (t = 3, 9, 15) → hati-hati: t = 12 itu puncak →
 * tiap pilihan disalin dari soal dan disubstitusikan ke model.
 * Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Step, Visual } from '../../engine/types';
import type { Tide11State } from '../../visuals/tide11';
import { getSoal } from '../index';

/** Gambar asli soal (docs/grafik_kedalaman_air_laut.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/grafik_kedalaman_air_laut.png', import.meta.url).href;
const tide = (state: Tide11State): Visual => ({ kind: 'svg', scene: 'tide11', state });
/** catatan: a, b, model, rumus waktu */
const N1 = ['pA'];
const N2 = ['pA', 'pB'];
const N3 = ['pA', 'pB', 'pY'];
const N4 = ['pY', 'pT'];
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
type L = (typeof LETTERS)[number];
/** pilihan (docs/soal25.md no. 11): jam */
const OPTS: Record<L, number> = { A: 3, B: 9, C: 10, D: 12, E: 15 };
/** sudut πt/6 dan kedalaman y(t) = 12,3 + 2 cos(πt/6), diturunkan dari model dokumen */
const SUB: Record<L, [string, string]> = {
  A: ['\\tfrac\\pi2', '12{,}3'],
  B: ['\\tfrac{3\\pi}2', '12{,}3'],
  C: ['\\tfrac{5\\pi}3', '13{,}3'],
  D: ['2\\pi', '14{,}3'],
  E: ['\\tfrac{5\\pi}2', '12{,}3'],
};
const quote = (o: L): Row => ({
  id: `q${o}`,
  toks: [T(`q${o}a`, `\\text{${o}}`, 'sp'), H(`q${o}b`, `${OPTS[o]} jam`, 'q', `@s-o${o}`)],
});
const check = (o: L, note: string): Row => {
  const ok = o === 'E';
  const [ang, val] = SUB[o];
  return {
    id: `o${o}`,
    toks: [
      T(`o${o}a`, `y(${OPTS[o]})`, '', `q${o}b`),
      O(`o${o}b`, '='),
      T(`o${o}c`, `12{,}3+2\\cos${ang}`),
      O(`o${o}d`, '='),
      T(`o${o}e`, val, ok ? 'gold' : val === '12{,}3' ? 'blue' : 'red'),
    ],
    note,
    ...(ok ? { box: 'gold' as const } : {}),
  };
};
const open5 = (o: L, cap: string): Step => ({
  ch: 5,
  cap,
  visual: { kind: 'soal', hl: 0, focus: `s-o${o}` },
  board: { title: `Pilihan ${o}`, pins: N4, list: `LO${o}`, upTo: 1, from: 0 },
});
const check5 = (o: L, cap: string): Step => ({
  ch: 5,
  cap,
  visual: tide({ ext: true, mid: true, cand: OPTS[o] }),
  board: { title: `Pilihan ${o}`, pins: N4, list: `LO${o}`, upTo: 2, from: 1 },
});

const q11: SoalContent = {
  meta: getSoal(11)!,
  sourceRef: 'docs/pembahasan25.md#soal-11',
  layout: 'full',
  paper: {
    html: `<div class="soal-split"><div>
<p>Grafik berikut menyatakan perubahan kedalaman air laut di sebuah teluk.</p>
<p>Pada grafik tersebut, $y$ menyatakan kedalaman air laut dalam meter, $t$ dalam jam, serta $a$ dan $b$ adalah konstanta. Berkenaan dengan nilai $t$ pada grafik, <span class="hl hl-blue" data-hl="1"><span data-src="s-t">nilai $t=6$ menyatakan 6 jam setelah pukul 00.00</span></span>, demikian pula untuk nilai $t$ lainnya.</p>
<p>Waktu saat <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">kedalaman air laut mencapai 12,3 meter untuk ketiga kalinya</span></span> setelah pukul 00.00 adalah ....</p>
</div><figure class="soal-fig"><img src="${fig}" width="652" height="485" alt="Grafik y = a + b cos(πt/6): puncak 14,3 meter di t = 0 dan t = 12, lembah 10,3 meter di t = 6." /></figure></div>
<ol class="abc">
${LETTERS.map((o) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">${OPTS[o]} jam</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-t', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['g-max', 'g-min'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Trigonometri',
    titleLines: ['Pembahasan Soal', 'Pasang <span class="accent">Surut</span>', 'Kedalaman Air'],
    lede: 'Kedalaman air teluk naik-turun seperti gelombang kosinus. Kapan kedalamannya 12,3 meter untuk ketiga kalinya?',
    facts: [
      { dt: 'Puncak', dd: '14,3 m' },
      { dt: 'Lembah', dd: '10,3 m' },
      { dt: 'Dicari', dd: 'waktu ke-3' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Mencari a dan b', d: 'Dari puncak dan lembah' },
    { t: 'Kapan y = 12,3', d: 'Garis tengah' },
    { t: 'Hitung kemunculan', d: 'Ke-1, ke-2, ke-3' },
    { t: 'Uji kelima pilihan', d: 'Satu per satu' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Jawaban E' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pA: { id: 'pA', toks: [T('PA0', 'a', '', 'a1a'), O('PA1', '='), T('PA2', '12{,}3', '', 'a1g')] },
    pB: { id: 'pB', toks: [T('PB0', 'b', '', 'a2a'), O('PB1', '='), T('PB2', '2', '', 'a2g')] },
    pY: {
      id: 'pY',
      toks: [
        T('PY0', 'y', '', 'a3a'),
        O('PY1', '='),
        T('PY2', '12{,}3', '', 'a3c'),
        T('PY3', '+2\\cos\\left(\\tfrac16\\pi t\\right)', '', 'a3f'),
      ],
    },
    pT: { id: 'pT', toks: [T('PT0', 't', '', 'z3a'), O('PT1', '='), T('PT2', '3+6k', '', 'z3c')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [
          H('k1a', 'Ditanya', 'lbl'),
          H('k1b', 'waktu kedalaman 12,3 m yang ketiga', 'gold', '@s-tanya'),
        ],
        note: 'setelah pukul 00.00; $t$ dalam jam',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', 'Langkah pertama', 'lbl'),
          H('k2b', 'cari dulu', 'tx'),
          T('k2c', 'a'),
          H('k2d', 'dan', 'tx'),
          T('k2e', 'b'),
        ],
        note: 'dari puncak dan lembah pada grafik',
      },
    ],
    LD: [
      {
        id: 'd1',
        toks: [H('d1a', 'puncak', 'tx'), O('d1b', '='), T('d1c', '14{,}3', 'blue', '@g-max')],
        note: 'di $t=0$ dan $t=12$',
      },
      {
        id: 'd2',
        toks: [H('d2a', 'lembah', 'tx'), O('d2b', '='), T('d2c', '10{,}3', 'blue', '@g-min')],
        note: 'di $t=6$',
      },
    ],
    LA: [
      {
        id: 'a1',
        toks: [
          T('a1a', 'a'),
          O('a1b', '='),
          T('a1c', '\\tfrac{14{,}3+10{,}3}{2}', '', '@g-max'),
          O('a1d', '='),
          T('a1e', '\\tfrac{24{,}6}{2}'),
          O('a1f', '='),
          T('a1g', '12{,}3', 'blue'),
        ],
        note: 'garis tengah: rata-rata puncak dan lembah; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'a2',
        toks: [
          T('a2a', 'b'),
          O('a2b', '='),
          T('a2c', '\\tfrac{14{,}3-10{,}3}{2}', '', '@g-min'),
          O('a2d', '='),
          T('a2e', '\\tfrac42'),
          O('a2f', '='),
          T('a2g', '2', 'blue'),
        ],
        note: 'amplitudo: setengah selisih; positif karena grafik mulai dari puncak',
        box: 'navy',
      },
      {
        id: 'a3',
        toks: [
          T('a3a', 'y'),
          O('a3b', '='),
          T('a3c', '12{,}3', 'blue', 'PA2'),
          T('a3d', '+'),
          T('a3e', '2', 'blue', 'PB2'),
          T('a3f', '\\cos\\left(\\tfrac16\\pi t\\right)'),
        ],
        note: 'model lengkap; simpan ke catatan',
        box: 'navy',
      },
    ],
    LQ1: [
      {
        id: 'q1',
        toks: [T('q1a', '12{,}3', '', '@s-tanya'), O('q1b', '='), T('q1c', 'a', 'blue', 'PA0')],
        note: 'kedalaman yang ditanya tepat di garis tengah',
      },
      {
        id: 'b1',
        toks: [
          T('b1a', '12{,}3', '', 'PY2'),
          T('b1b', '+2\\cos\\left(\\tfrac16\\pi t\\right)', '', 'PY3'),
          O('b1c', '='),
          T('b1d', '12{,}3'),
        ],
        note: 'model disamakan dengan $12{,}3$',
      },
      {
        id: 'b2',
        toks: [
          T('b2a', '2\\cos\\left(\\tfrac16\\pi t\\right)', '', 'b1b'),
          O('b2b', '='),
          T('b2c', '12{,}3', '', 'b1d'),
          T('b2d', '-12{,}3', 'red', 'b1a'),
        ],
        note: '$12{,}3$ di ruas kiri pindah ke ruas kanan menjadi $-12{,}3$',
      },
    ],
    LQ2: [
      {
        id: 'b3',
        toks: [T('b3a', '2\\cos\\left(\\tfrac16\\pi t\\right)'), O('b3b', '='), T('b3c', '0')],
        note: '$12{,}3-12{,}3=0$',
      },
      {
        id: 'b4',
        toks: [T('b4a', '\\cos\\left(\\tfrac16\\pi t\\right)'), O('b4b', '='), T('b4c', '0', 'blue')],
        note: 'kedua ruas dibagi $2$',
        box: 'navy',
      },
    ],
    LZ: [
      {
        id: 'z1',
        toks: [
          T('z1a', '\\cos\\theta=0'),
          O('z1b', '\\Rightarrow'),
          T('z1c', '\\theta=\\tfrac\\pi2,\\ \\tfrac{3\\pi}2,\\ \\tfrac{5\\pi}2,\\ \\dots', 'blue'),
        ],
        note: 'kosinus bernilai $0$ setiap setengah putaran: $\\frac\\pi2+k\\pi$',
      },
      {
        id: 'z2',
        toks: [T('z2a', '\\tfrac16\\pi t'), O('z2b', '='), T('z2c', '\\tfrac\\pi2+k\\pi')],
        note: 'sudutnya $\\theta=\\frac16\\pi t$',
      },
      {
        id: 'z3',
        toks: [T('z3a', 't'), O('z3b', '='), T('z3c', '3+6k', 'blue')],
        note: 'kedua ruas dikali $\\frac6\\pi$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LK: [
      {
        id: 'c1',
        toks: [T('c1a', 'k=0'), O('c1b', ':'), T('c1c', 't=3', 'blue')],
        note: 'kemunculan ke-1',
      },
      {
        id: 'c2',
        toks: [T('c2a', 'k=1'), O('c2b', ':'), T('c2c', 't=9', 'blue')],
        note: 'kemunculan ke-2',
      },
      {
        id: 'c3',
        toks: [T('c3a', 'k=2'), O('c3b', ':'), T('c3c', 't=15', 'gold')],
        note: 'kemunculan ke-3',
        box: 'gold',
      },
      {
        id: 'h1',
        toks: [H('h1a', 'Hati-hati', 'lbl'), T('h1b', 't=12'), H('h1c', 'bukan jawabannya', 'tx')],
        note: '$y(12)=12{,}3+2\\cos2\\pi=14{,}3$, puncak; dalam $12$ jam garis tengah dilewati dua kali',
      },
    ],
    LOA: [
      quote('A'),
      check('A', 'memang $12{,}3$, tetapi baru kemunculan ke-1 → <b class="k-red">bukan</b>'),
    ],
    LOB: [
      quote('B'),
      check('B', 'memang $12{,}3$, tetapi baru kemunculan ke-2 → <b class="k-red">bukan</b>'),
    ],
    LOC: [
      quote('C'),
      check('C', '$\\cos\\frac{5\\pi}3=\\frac12$, jadi $13{,}3\\ne12{,}3$ → <b class="k-red">bukan</b>'),
    ],
    LOD: [quote('D'), check('D', 'puncak, bukan $12{,}3$ → <b class="k-red">bukan</b>')],
    LOE: [quote('E'), check('E', 'kemunculan ke-3 → <b class="k-gold">benar</b>')],
    L7: [{ id: 's1', toks: [H('s1a', 'Jawaban', 'lbl'), H('s1b', 'E · 15 jam', 'tx')], box: 'gold' }],
    LS: [
      {
        id: 'y1',
        toks: [T('y1a', 't=3,\\ 9,\\ 15,\\ \\dots')],
        note: 'kedalaman $12{,}3$ m: garis tengah dilewati tiap $6$ jam',
        box: 'navy',
      },
      { id: 'y2', toks: [H('y2a', 'Jawaban', 'lbl'), H('y2b', 'E · 15 jam', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan grafik dan soalnya. Kita mencari waktu saat kedalaman air $12{,}3$ meter untuk ketiga kalinya.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Langkah pertama, tentukan dulu konstanta $a$ dan $b$ dari grafik.',
      visual: tide({ lab: 'ask', mid: true, amp: true }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Mencari a dan b ----
    {
      ch: 2,
      cap: 'Baca grafiknya: puncak $14{,}3$ meter di $t=0$ dan $t=12$, lembah $10{,}3$ meter di $t=6$.',
      visual: tide({}),
      board: { title: 'Data dari grafik', list: 'LD', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Tahukah kalian? $a$ adalah garis tengah, tepat di tengah puncak dan lembah: $a=\\frac{14{,}3+10{,}3}{2}=12{,}3$.',
      visual: tide({ lab: 'val', mid: true }),
      board: { title: 'Mencari a dan b', list: 'LA', upTo: 1, from: 0, save: ['pA'] },
      ask: {
        before: 'a1',
        q: 'Nilai $a$ (garis tengah) adalah…',
        opts: [
          { tex: '12{,}3', ok: true },
          {
            tex: '14{,}3',
            hint: '$14{,}3$ adalah puncak. Garis tengah ada di tengah antara puncak dan lembah.',
          },
          { tex: '10{,}3', hint: '$10{,}3$ adalah lembah. Rata-ratakan puncak dan lembah.' },
          { tex: '2', hint: '$2$ adalah amplitudo ($b$), bukan garis tengah.' },
        ],
      },
    },
    {
      ch: 2,
      cap: '$b$ adalah amplitudo, jarak garis tengah ke puncak: $b=\\frac{14{,}3-10{,}3}{2}=2$. Positif karena grafiknya mulai dari puncak.',
      visual: tide({ lab: 'val', mid: true, amp: true }),
      board: { title: 'Mencari a dan b', pins: N1, list: 'LA', upTo: 2, from: 1, save: ['pB'] },
    },
    {
      ch: 2,
      cap: 'Jadi modelnya $y=12{,}3+2\\cos\\left(\\frac16\\pi t\\right)$, kita simpan ke catatan.',
      visual: tide({ lab: 'val', mid: true, amp: true, ext: true }),
      board: { title: 'Mencari a dan b', pins: N2, list: 'LA', upTo: 3, from: 2, save: ['pY'] },
    },
    // ---- 3 · Kapan y = 12,3 ----
    {
      ch: 3,
      cap: 'Tahukah kalian? $12{,}3$ tepat sama dengan $a$, garis tengah, jadi yang dicari adalah saat gelombang memotong garis tengah.',
      visual: tide({ lab: 'val', mid: true, zeros: true }),
      board: { title: 'Kapan y = 12,3', pins: N3, list: 'LQ1', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Kita buktikan dengan persamaan: modelnya disamakan dengan $12{,}3$.',
      visual: tide({ lab: 'val', mid: true, zeros: true }),
      board: { title: 'Kapan y = 12,3', pins: N3, list: 'LQ1', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Perhatikan $12{,}3$ di ruas kiri. Pindahkan ke ruas kanan, tandanya berubah menjadi $-12{,}3$.',
      visual: tide({ lab: 'val', mid: true, zeros: true }),
      board: { title: 'Kapan y = 12,3', pins: N3, list: 'LQ1', upTo: 3, from: 2 },
    },
    {
      ch: 3,
      cap: 'Hitung $12{,}3-12{,}3=0$, lalu kedua ruas dibagi $2$: $\\cos\\left(\\frac16\\pi t\\right)=0$.',
      visual: tide({ lab: 'val', mid: true, zeros: true }),
      board: { title: 'Sederhanakan', pins: N3, list: 'LQ2', upTo: 2, from: 0 },
    },
    {
      ch: 3,
      cap: 'Kosinus bernilai $0$ di $\\frac\\pi2,\\frac{3\\pi}2,\\frac{5\\pi}2,\\dots$, yaitu setiap setengah putaran.',
      visual: tide({ mid: true, zeros: true, ext: true }),
      board: { title: 'Nilai t', pins: N3, list: 'LZ', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Samakan $\\frac16\\pi t=\\frac\\pi2+k\\pi$, lalu kali $\\frac6\\pi$: $t=3+6k$. Garis tengah dilewati tiap $6$ jam.',
      visual: tide({ mid: true, zeros: true, gap: true, ext: true }),
      board: { title: 'Nilai t', pins: N3, list: 'LZ', upTo: 3, from: 1, save: ['pT'] },
    },
    // ---- 4 · Hitung kemunculan ----
    {
      ch: 4,
      cap: 'Titik berjalan mulai pukul 00.00 dari puncak. Kemunculan pertama di $t=3$ ($k=0$).',
      visual: tide({ mid: true, ext: true, walk: 1 }),
      board: { title: 'Hitung kemunculan', pins: N4, list: 'LK', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Turun ke lembah lalu naik lagi: kemunculan kedua di $t=9$ ($k=1$).',
      visual: tide({ mid: true, ext: true, walk: 2 }),
      board: { title: 'Hitung kemunculan', pins: N4, list: 'LK', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: 'Melewati puncak di $t=12$, lalu turun lagi: kemunculan ketiga di $t=15$ ($k=2$).',
      visual: tide({ mid: true, ext: true, walk: 3 }),
      board: { title: 'Hitung kemunculan', pins: N4, list: 'LK', upTo: 3, from: 2 },
      ask: {
        before: 'c3',
        q: 'Kemunculan ketiga terjadi pada $t=$…',
        opts: [
          { tex: '15', ok: true },
          { tex: '12', hint: '$t=12$ adalah puncak berikutnya ($14{,}3$ m), bukan saat $y=12{,}3$.' },
          { tex: '9', hint: '$t=9$ baru kemunculan ke-2.' },
          {
            tex: '10',
            hint: 'Gelombang melewati garis tengah tiap setengah periode ($6$ jam), bukan tiap $5$ jam.',
          },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Hati-hati, jangan menjawab $12$ jam. Pada $t=12$ kedalamannya $14{,}3$ meter (puncak); dalam satu periode garis tengah dilewati dua kali.',
      visual: tide({ mid: true, ext: true, walk: 3, warn: true }),
      board: { title: 'Hitung kemunculan', pins: N4, list: 'LK', upTo: 4, from: 3 },
    },
    // ---- 5 · Uji kelima pilihan ----
    open5('A', 'Kita cek pilihan A dulu. Salin ke papan.'),
    check5(
      'A',
      'Pada $t=3$ kedalamannya memang $12{,}3$ m, tetapi itu kemunculan pertama. A <b class="k-red">bukan</b>.',
    ),
    open5('B', 'Lanjut pilihan B.'),
    check5('B', 'Pada $t=9$ juga $12{,}3$ m, tetapi baru kemunculan kedua. B <b class="k-red">bukan</b>.'),
    open5('C', 'Pilihan C.'),
    check5(
      'C',
      'Pada $t=10$: $\\cos\\frac{5\\pi}3=\\frac12$, kedalamannya $13{,}3$ m, bukan $12{,}3$. C <b class="k-red">bukan</b>.',
    ),
    open5('D', 'Pilihan D.'),
    check5('D', 'Pada $t=12$ kedalamannya $14{,}3$ m, puncak. D <b class="k-red">bukan</b>.'),
    open5('E', 'Terakhir, pilihan E.'),
    check5(
      'E',
      'Pada $t=15$ kedalamannya $12{,}3$ m dan ini kemunculan ketiga. E <b class="k-gold">benar</b>.',
    ),
    // ---- 6 · Catatan lengkap ----
    {
      ch: 6,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 7 · Cocokkan pilihan ----
    {
      ch: 7,
      cap: 'Cocokkan dengan pilihan: kedalaman $12{,}3$ m yang ketiga terjadi pada $t=15$. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: N4, list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 's1',
        q: 'Waktu saat kedalaman air laut mencapai $12{,}3$ meter untuk ketiga kalinya adalah…',
        letters: true,
        win: 'Jawabannya <b>E</b>, 15 jam.',
        opts: [
          { txt: '3 jam', hint: 'Itu kemunculan pertama.' },
          { txt: '9 jam', hint: 'Itu kemunculan kedua.' },
          { txt: '10 jam', hint: 'Pada $t=10$ kedalamannya $13{,}3$ m.' },
          { txt: '12 jam', hint: 'Pada $t=12$ kedalamannya $14{,}3$ m (puncak).' },
          { txt: '15 jam', ok: true },
        ],
      },
    },
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">E</span><span>Kedalaman $12{,}3$ m tercapai pada $t=3,9,15$. Yang ketiga: $15$ jam setelah pukul 00.00.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LS', upTo: 2, from: 2 },
    },
  ],
  cards: [
    { label: 'A', statement: '3 jam', ok: false, formula: 't=3', why: 'Kemunculan pertama.' },
    { label: 'B', statement: '9 jam', ok: false, formula: 't=9', why: 'Kemunculan kedua.' },
    { label: 'C', statement: '10 jam', ok: false, formula: 'y(10)=13{,}3', why: 'Bukan akar $t=3+6k$.' },
    {
      label: 'D',
      statement: '12 jam',
      ok: false,
      formula: 'y(12)=14{,}3',
      why: 'Pada $t=12$ kedalaman 14,3 m (puncak).',
    },
    { label: 'E', statement: '15 jam', ok: true, formula: 'k=2:\\ t=15', why: 'Kemunculan ketiga.' },
  ],
  notes: {
    title: 'Pembahasan Soal 11: Kedalaman Air Laut',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Trigonometri',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Mencari a dan b',
        lists: ['LD', 'LA'],
        why: 'Garis tengah $a=\\frac{\\text{maks}+\\text{min}}2$, amplitudo $b=\\frac{\\text{maks}-\\text{min}}2$ (positif karena grafik mulai dari puncak).',
      },
      {
        title: 'Kapan y = 12,3',
        lists: ['LQ1', 'LQ2', 'LZ'],
        why: '$12{,}3$ = garis tengah, jadi $\\cos\\left(\\frac16\\pi t\\right)=0$ dan $t=3+6k$.',
      },
      {
        title: 'Hitung kemunculan',
        lists: ['LK'],
        why: 'Dalam satu periode (12 jam) garis tengah dilewati dua kali; kemunculan ketiga ada di periode berikutnya.',
      },
      { title: 'Uji kelima pilihan', lists: ['LOA', 'LOB', 'LOC', 'LOD', 'LOE'] },
    ],
    answer: 'Jawaban: <b>E</b>, 15 jam.',
  },
  done: {
    seal: 'E',
    message: 'Kedalaman $12{,}3$ m tercapai pada $t=3,9,15$. Yang ketiga: $15$ jam setelah pukul 00.00.',
  },
  key: { answer: 'E', cardOk: [false, false, false, false, true], goldRows: ['c3', 'oE', 's1', 'y2'] },
  authorNotes: [
    'Modul baru (revisi pemilik v1.20, 23 Okt 2026), disusun dari docs/pembahasan25.md soal 11 dengan gaya mengajar Pak Penta; soal 11 ditambahkan ke Rilis 1.',
    'Model lengkap (dokumen a4) diberi kotak biru, bukan emas: emas hanya untuk jawaban.',
    '"Tahukah kalian? 12,3 = a (garis tengah)" ditambahkan sebagai cara memahami; persamaan tetap dikerjakan seperti dokumen b1–b5, dengan 12,3 pindah ruas (bukan dicoret).',
    'Nilai uji pilihan C dan D diturunkan dari model dokumen: y(10) = 12,3 + 2 cos(5π/3) = 13,3; y(12) = 14,3.',
    'Langkah Hati-hati t = 12 dari Kesalahan umum dokumen.',
  ],
};

export default q11;
