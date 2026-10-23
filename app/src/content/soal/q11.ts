/**
 * SOAL 11 — Kedalaman Air Laut (fungsi trigonometri; pilihan tunggal). Kunci: E (15 jam).
 * Sumber: docs/pembahasan25.md "SOAL 11", docs/soal25.md no. 11, docs/grafik_kedalaman_air_laut.png.
 * Alur logika dari grafik (revisi pemilik v1.21, dicatat di dokumen):
 *  - baca puncak 14,3 dan lembah 10,3 → selisih 4, setengahnya 2 → garis tengah 10,3 + 2 = 12,3 (yang ditanya);
 *  - lembah dicapai di t = 6 (diperbesar, dilingkari) → dari puncak (t = 0) ke lembah (t = 6) garis tengah
 *    dilewati tepat di tengah waktunya: 6 ÷ 2 = 3 → pola berulang tiap 6 jam: t = 3, 9, 15;
 *  - titik berjalan menandai kemunculan ke-1, ke-2, ke-3; hati-hati t = 12 (puncak);
 *  - bagian opsional "Cara alternatif dengan rumus": kenapa cos (grafik mulai dari puncak), dari mana π/6
 *    (periode 12 jam), model, persamaan dengan 12,3 pindah ruas, t = 3 + 6k, dan contoh 13,3 m (angka tidak cantik);
 *  - tiap pilihan disalin dari soal lalu dicek dengan pola t = 3, 9, 15.
 * Tanpa simbol ":" di baris papan (revisi pemilik v1.21): pakai panah atau teks.
 * Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Step, Visual } from '../../engine/types';
import type { Tide11State } from '../../visuals/tide11';
import { getSoal } from '../index';

/** Gambar asli soal (docs/grafik_kedalaman_air_laut.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/grafik_kedalaman_air_laut.png', import.meta.url).href;
const tide = (state: Tide11State): Visual => ({ kind: 'svg', scene: 'tide11', state });
/** catatan: garis tengah, waktu lembah, waktu-waktu di garis tengah */
const N1 = ['pM'];
const N2 = ['pM', 'pL'];
const N3 = ['pM', 'pT'];
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
type L = (typeof LETTERS)[number];
/** pilihan (docs/soal25.md no. 11): jam */
const OPTS: Record<L, number> = { A: 3, B: 9, C: 10, D: 12, E: 15 };
const quote = (o: L): Row => ({
  id: `q${o}`,
  toks: [T(`q${o}a`, `\\text{${o}}`, 'sp'), H(`q${o}b`, `${OPTS[o]} jam`, 'q', `@s-o${o}`)],
});
/** baris cek pilihan: waktu → apa yang terjadi pada grafik (dibandingkan dengan pola di catatan) */
const check = (o: L, what: string, cls: 'blue' | 'red' | 'gold', note: string): Row => ({
  id: `o${o}`,
  toks: [T(`o${o}a`, `t=${OPTS[o]}`, '', `q${o}b`), O(`o${o}b`, '\\to'), H(`o${o}c`, what, cls)],
  note,
  ...(cls === 'gold' ? { box: 'gold' as const } : {}),
});
const open6 = (o: L, cap: string): Step => ({
  ch: 6,
  cap,
  visual: { kind: 'soal', hl: 0, focus: `s-o${o}` },
  board: { title: `Pilihan ${o}`, pins: N3, list: `LO${o}`, upTo: 1, from: 0 },
});
const check6 = (o: L, cap: string): Step => ({
  ch: 6,
  cap,
  visual: tide({ ext: true, mid: true, cand: OPTS[o] }),
  board: { title: `Pilihan ${o}`, pins: N3, list: `LO${o}`, upTo: 2, from: 1 },
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
  visualSrc: ['g-max', 'g-min', 'g-t6'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Trigonometri',
    titleLines: ['Pembahasan Soal', 'Pasang <span class="accent">Surut</span>', 'Kedalaman Air'],
    lede: 'Kedalaman air teluk naik-turun seperti gelombang. Kapan kedalamannya 12,3 meter untuk ketiga kalinya?',
    facts: [
      { dt: 'Puncak', dd: '14,3 m' },
      { dt: 'Lembah', dd: '10,3 m' },
      { dt: 'Dicari', dd: 'waktu ke-3' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Garis tengah', d: 'Dari puncak dan lembah' },
    { t: 'Waktu dari grafik', d: 'Tengah-tengah waktu' },
    { t: 'Hitung kemunculan', d: 'Ke-1, ke-2, ke-3' },
    { t: 'Cara alternatif', d: 'Opsional: dengan rumus', opt: true },
    { t: 'Uji kelima pilihan', d: 'Satu per satu' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Jawaban E' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pM: {
      id: 'pM',
      toks: [H('PM0', 'garis tengah', 'tx', 'm3a'), O('PM1', '='), T('PM2', '12{,}3', '', 'm3g')],
    },
    pL: { id: 'pL', toks: [H('PL0', 'lembah', 'tx', 'w1a'), O('PL1', '\\to'), T('PL2', 't=6', '', 'w1d')] },
    pT: {
      id: 'pT',
      toks: [
        H('PT0', 'di garis tengah', 'tx', 'w4a'),
        O('PT1', '\\to'),
        T('PT2', 't=3,\\ 9,\\ 15,\\ \\dots', '', 'w4c'),
      ],
    },
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
        toks: [H('k2a', 'Langkah pertama', 'lbl'), H('k2b', 'baca grafiknya', 'tx')],
        note: 'puncak, lembah, dan kapan terjadinya',
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
    LG: [
      {
        id: 'm1',
        toks: [
          H('m1a', 'selisih', 'tx'),
          O('m1b', '='),
          T('m1c', '14{,}3', '', '@g-max'),
          O('m1d', '-'),
          T('m1e', '10{,}3', '', '@g-min'),
          O('m1f', '='),
          T('m1g', '4'),
        ],
        note: 'jarak puncak ke lembah',
      },
      {
        id: 'm2',
        toks: [
          H('m2a', 'setengahnya', 'tx'),
          O('m2b', '='),
          T('m2c', '4\\div2', '', 'm1g'),
          O('m2d', '='),
          T('m2e', '2', 'blue'),
        ],
        note: 'jarak garis tengah ke puncak, juga ke lembah',
      },
      {
        id: 'm3',
        toks: [
          H('m3a', 'garis tengah', 'tx'),
          O('m3b', '='),
          T('m3c', '10{,}3', '', '@g-min'),
          O('m3d', '+'),
          T('m3e', '2', '', 'm2e'),
          O('m3f', '='),
          T('m3g', '12{,}3', 'blue'),
        ],
        note: 'tepat yang ditanya soal; simpan ke catatan',
        box: 'navy',
      },
    ],
    LW: [
      {
        id: 'w1',
        toks: [H('w1a', 'lembah dicapai', 'tx'), O('w1b', '\\to'), T('w1d', 't=6', 'blue', '@g-t6')],
        note: 'baca dari sumbu $t$; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'w2',
        toks: [
          H('w2a', 'tengah waktunya', 'tx'),
          O('w2b', '='),
          T('w2c', '6', '', 'PL2'),
          T('w2d', '\\div2'),
          O('w2e', '='),
          T('w2f', '3', 'blue'),
        ],
        note: 'dari puncak ($t=0$) ke lembah ($t=6$) garis tengah dilewati tepat di tengahnya',
      },
      {
        id: 'w3',
        toks: [
          H('w3a', 'puncak', 'tx'),
          T('w3b', '0'),
          O('w3c', '\\to'),
          H('w3d', 'lembah', 'tx'),
          T('w3e', '6'),
          O('w3f', '\\to'),
          H('w3g', 'puncak', 'tx'),
          T('w3h', '12'),
        ],
        note: 'pola gelombang berulang tiap $12$ jam',
      },
      {
        id: 'w4',
        toks: [
          H('w4a', 'di garis tengah', 'tx'),
          O('w4b', '\\to'),
          T('w4c', 't=3,\\ 9,\\ 15,\\ \\dots', 'blue'),
        ],
        note: 'selalu di tengah antara puncak dan lembah: tiap $6$ jam; simpan ke catatan',
        box: 'navy',
      },
    ],
    LK: [
      {
        id: 'c1',
        toks: [H('c1a', 'ke-1', 'tx'), O('c1b', '\\to'), T('c1c', 't=3', 'blue')],
        note: 'turun dari puncak',
      },
      {
        id: 'c2',
        toks: [H('c2a', 'ke-2', 'tx'), O('c2b', '\\to'), T('c2c', 't=9', 'blue')],
        note: 'naik dari lembah',
      },
      {
        id: 'c3',
        toks: [H('c3a', 'ke-3', 'tx'), O('c3b', '\\to'), T('c3c', 't=15', 'gold')],
        note: 'turun lagi setelah puncak $t=12$',
        box: 'gold',
      },
      {
        id: 'h1',
        toks: [H('h1a', 'Hati-hati', 'lbl'), T('h1b', 't=12'), H('h1c', 'bukan jawabannya', 'tx')],
        note: 'di $t=12$ kedalamannya $14{,}3$ m (puncak); dalam $12$ jam garis tengah dilewati dua kali',
      },
    ],
    // cara alternatif (opsional): dengan rumus
    LX: [
      {
        id: 'x1',
        toks: [H('x1a', 'mulai dari puncak', 'tx'), O('x1b', '\\to'), T('x1c', '\\cos', 'blue')],
        note: '$\\cos0=1$ (nilai terbesar); $\\sin0=0$ mulai dari tengah',
      },
      {
        id: 'x2',
        toks: [H('x2a', '1 gelombang', 'tx'), O('x2b', '='), T('x2c', '12\\ \\text{jam}')],
        note: 'dari puncak $t=0$ ke puncak $t=12$',
      },
      {
        id: 'x3',
        toks: [T('x3a', '\\tfrac{2\\pi}{12}'), O('x3b', '='), T('x3c', '\\tfrac\\pi6', 'blue')],
        note: 'kosinus berulang tiap $2\\pi$; cocok dengan $\\frac16\\pi t$ di soal',
        box: 'navy',
      },
    ],
    LY: [
      {
        id: 'y1',
        toks: [
          T('y1a', 'a'),
          O('y1b', '='),
          T('y1c', '12{,}3', 'blue', 'PM2'),
          O('y1d', ','),
          T('y1e', 'b'),
          O('y1f', '='),
          T('y1g', '2', 'blue'),
        ],
        note: '$a$ = garis tengah, $b$ = setengah selisih (positif karena mulai dari puncak)',
      },
      {
        id: 'y2',
        toks: [T('y2a', 'y'), O('y2b', '='), T('y2c', '12{,}3+2\\cos\\left(\\tfrac16\\pi t\\right)', 'blue')],
        note: 'model lengkap',
        box: 'navy',
      },
    ],
    LE: [
      {
        id: 'e1',
        toks: [
          T('e1a', '12{,}3'),
          T('e1b', '+2\\cos\\left(\\tfrac16\\pi t\\right)'),
          O('e1c', '='),
          T('e1d', '12{,}3'),
        ],
        note: 'model disamakan dengan $12{,}3$',
      },
      {
        id: 'e2',
        toks: [
          T('e2a', '2\\cos\\left(\\tfrac16\\pi t\\right)', '', 'e1b'),
          O('e2b', '='),
          T('e2c', '12{,}3', '', 'e1d'),
          T('e2d', '-12{,}3', 'red', 'e1a'),
        ],
        note: '$12{,}3$ di ruas kiri pindah ke ruas kanan menjadi $-12{,}3$',
      },
      {
        id: 'e3',
        toks: [T('e3a', '\\cos\\left(\\tfrac16\\pi t\\right)'), O('e3b', '='), T('e3c', '0', 'blue')],
        note: '$12{,}3-12{,}3=0$, lalu kedua ruas dibagi $2$',
        box: 'navy',
      },
    ],
    LZ: [
      {
        id: 'z1',
        toks: [
          T('z1a', '\\tfrac16\\pi t'),
          O('z1b', '='),
          T('z1c', '\\tfrac\\pi2,\\ \\tfrac{3\\pi}2,\\ \\tfrac{5\\pi}2,\\ \\dots'),
        ],
        note: 'kosinus bernilai $0$ setiap setengah putaran',
      },
      {
        id: 'z2',
        toks: [T('z2a', 't'), O('z2b', '='), T('z2c', '3,\\ 9,\\ 15,\\ \\dots', 'blue', 'PT2')],
        note: 'kedua ruas dikali $\\frac6\\pi$; sama dengan cara logika',
        box: 'navy',
      },
    ],
    LU: [
      {
        id: 'u1',
        toks: [T('u1a', '12{,}3+2\\cos\\left(\\tfrac16\\pi t\\right)'), O('u1b', '='), T('u1c', '13{,}3')],
        note: 'misalnya ditanya kedalaman $13{,}3$ m (bukan garis tengah)',
      },
      {
        id: 'u2',
        toks: [T('u2a', '\\cos\\left(\\tfrac16\\pi t\\right)'), O('u2b', '='), T('u2c', '\\tfrac12')],
        note: '$13{,}3-12{,}3=1$, lalu dibagi $2$',
      },
      {
        id: 'u3',
        toks: [
          T('u3a', '\\tfrac16\\pi t'),
          O('u3b', '='),
          T('u3c', '\\tfrac\\pi3'),
          O('u3d', '\\Rightarrow'),
          T('u3e', 't=2', 'blue'),
        ],
        note: 'bukan $t=3$: tengah-tengah waktu hanya berlaku untuk garis tengah',
        box: 'navy',
      },
    ],
    LOA: [
      quote('A'),
      check(
        'A',
        'kemunculan ke-1',
        'red',
        'memang $12{,}3$ m, tetapi baru yang pertama → <b class="k-red">bukan</b>',
      ),
    ],
    LOB: [
      quote('B'),
      check(
        'B',
        'kemunculan ke-2',
        'red',
        'memang $12{,}3$ m, tetapi baru yang kedua → <b class="k-red">bukan</b>',
      ),
    ],
    LOC: [
      quote('C'),
      check(
        'C',
        'bukan 3, 9, atau 15',
        'red',
        'tidak di garis tengah (grafik: $13{,}3$ m) → <b class="k-red">bukan</b>',
      ),
    ],
    LOD: [quote('D'), check('D', 'puncak 14,3 m', 'red', 'bukan $12{,}3$ m → <b class="k-red">bukan</b>')],
    LOE: [
      quote('E'),
      check(
        'E',
        'kemunculan ke-3',
        'gold',
        'tepat di garis tengah, yang ketiga → <b class="k-gold">benar</b>',
      ),
    ],
    L7: [{ id: 's1', toks: [H('s1a', 'Jawaban', 'lbl'), H('s1b', 'E · 15 jam', 'tx')], box: 'gold' }],
    LS: [
      {
        id: 'r1',
        toks: [T('r1a', 't=3,\\ 9,\\ 15,\\ \\dots')],
        note: 'kedalaman $12{,}3$ m = garis tengah, dilewati tiap $6$ jam',
        box: 'navy',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), H('r2b', 'E · 15 jam', 'tx')], box: 'gold' },
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
      cap: 'Langkah pertama, baca grafiknya baik-baik: di mana puncak dan lembahnya, dan kapan terjadinya.',
      visual: tide({ pts: true }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Garis tengah ----
    {
      ch: 2,
      cap: 'Dari grafik: puncak $14{,}3$ meter di $t=0$ dan $t=12$, lembah $10{,}3$ meter di $t=6$.',
      visual: tide({ pts: true }),
      board: { title: 'Puncak dan lembah', list: 'LD', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Selisih puncak dan lembah $14{,}3-10{,}3=4$. Setengahnya, $2$, adalah jarak garis tengah ke puncak.',
      visual: tide({ amp: true, lab: 'val' }),
      board: { title: 'Garis tengah', list: 'LG', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Tahukah kalian? Garis tengahnya $10{,}3+2=12{,}3$, tepat kedalaman yang ditanya soal.',
      visual: tide({ amp: true, mid: true, lab: 'val' }),
      board: { title: 'Garis tengah', list: 'LG', upTo: 3, from: 2, save: ['pM'] },
      ask: {
        before: 'm3',
        q: 'Garis tengah grafik, tepat di tengah puncak dan lembah, adalah…',
        opts: [
          { tex: '12{,}3', ok: true },
          {
            tex: '14{,}3',
            hint: '$14{,}3$ adalah puncak. Garis tengah ada di tengah antara puncak dan lembah.',
          },
          { tex: '10{,}3', hint: '$10{,}3$ adalah lembah. Tambahkan setengah selisihnya, $2$.' },
          { tex: '2', hint: '$2$ adalah setengah selisih, jarak dari garis tengah ke puncak.' },
        ],
      },
    },
    // ---- 3 · Waktu dari grafik ----
    {
      ch: 3,
      cap: 'Sekarang lihat waktunya. Perbesar lembahnya: lembah dicapai tepat saat $t=6$.',
      visual: tide({ cam: 'low', mid: true, ring: true }),
      board: { title: 'Waktu dari grafik', pins: N1, list: 'LW', upTo: 1, from: 0, save: ['pL'] },
    },
    {
      ch: 3,
      cap: 'Tahukah kalian? Dari puncak ($t=0$) ke lembah ($t=6$), garis tengah dilewati tepat di tengah waktunya: $6\\div2=3$.',
      visual: tide({ cam: 'half', mid: true, ring: true, half: true }),
      board: { title: 'Waktu dari grafik', pins: N2, list: 'LW', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Polanya berulang: puncak $0$, lembah $6$, puncak $12$, dan seterusnya. Jadi garis tengah dilewati tiap $6$ jam: $t=3,9,15,\\dots$',
      visual: tide({ mid: true, ext: true, zeros: true, gap: true }),
      board: { title: 'Waktu dari grafik', pins: N2, list: 'LW', upTo: 4, from: 2, save: ['pT'] },
    },
    // ---- 4 · Hitung kemunculan ----
    {
      ch: 4,
      cap: 'Titik berjalan mulai pukul 00.00 dari puncak. Kemunculan pertama di $t=3$.',
      visual: tide({ mid: true, ext: true, walk: 1 }),
      board: { title: 'Hitung kemunculan', pins: N3, list: 'LK', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Turun ke lembah lalu naik lagi: kemunculan kedua di $t=9$.',
      visual: tide({ mid: true, ext: true, walk: 2 }),
      board: { title: 'Hitung kemunculan', pins: N3, list: 'LK', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: 'Melewati puncak di $t=12$, lalu turun lagi: kemunculan ketiga di $t=15$.',
      visual: tide({ mid: true, ext: true, walk: 3 }),
      board: { title: 'Hitung kemunculan', pins: N3, list: 'LK', upTo: 3, from: 2 },
      ask: {
        before: 'c3',
        q: 'Kemunculan ketiga terjadi pada $t=$…',
        opts: [
          { tex: '15', ok: true },
          { tex: '12', hint: '$t=12$ adalah puncak berikutnya ($14{,}3$ m), bukan saat $12{,}3$ m.' },
          { tex: '9', hint: '$t=9$ baru kemunculan ke-2.' },
          { tex: '10', hint: 'Garis tengah dilewati tiap $6$ jam ($3,9,15$), bukan tiap $5$ jam.' },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Hati-hati, jangan menjawab $12$ jam. Pada $t=12$ kedalamannya $14{,}3$ meter (puncak); dalam satu gelombang garis tengah dilewati dua kali.',
      visual: tide({ mid: true, ext: true, walk: 3, warn: true }),
      board: { title: 'Hitung kemunculan', pins: N3, list: 'LK', upTo: 4, from: 3 },
    },
    // tawaran cara alternatif (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Cara logika ini mudah karena $12{,}3$ tepat garis tengah. Mau lihat cara alternatif dengan rumus, yang tetap bisa dipakai saat angkanya tidak cantik?',
      visual: tide({ mid: true, ext: true, zeros: true }),
      board: { title: 'Hitung kemunculan', pins: N3, list: 'LK', upTo: 4, from: 4 },
      branch: { yes: 'Ya, lihat cara rumus' },
    },
    // ---- 5 · Cara alternatif dengan rumus (opsional) ----
    {
      ch: 5,
      cap: 'Kenapa kosinus? Grafik ini dimulai dari puncak, dan $\\cos0=1$ adalah nilai terbesar kosinus; sinus justru dimulai dari tengah, $\\sin0=0$.',
      visual: tide({ sin: true, mid: true }),
      board: { title: 'Dari mana rumusnya', pins: N3, list: 'LX', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Dari mana $\\frac16\\pi$? Satu gelombang penuh $12$ jam, sedangkan kosinus berulang tiap $2\\pi$, jadi $\\frac{2\\pi}{12}=\\frac\\pi6$.',
      visual: tide({ per: true, mid: true }),
      board: { title: 'Dari mana rumusnya', pins: N3, list: 'LX', upTo: 3, from: 1 },
    },
    {
      ch: 5,
      cap: '$a$ adalah garis tengah $12{,}3$ dan $b$ setengah selisih $2$, jadi $y=12{,}3+2\\cos\\left(\\frac16\\pi t\\right)$.',
      visual: tide({ mid: true, amp: true, lab: 'ab' }),
      board: { title: 'Model', pins: N3, list: 'LY', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Samakan dengan $12{,}3$. Angka $12{,}3$ di ruas kiri pindah ke ruas kanan menjadi $-12{,}3$, sehingga $\\cos\\left(\\frac16\\pi t\\right)=0$.',
      visual: tide({ mid: true, zeros: true, ext: true }),
      board: { title: 'Persamaan', pins: N3, list: 'LE', upTo: 3, from: 0 },
    },
    {
      ch: 5,
      cap: 'Kosinus bernilai $0$ di $\\frac\\pi2,\\frac{3\\pi}2,\\frac{5\\pi}2$; dikali $\\frac6\\pi$ menjadi $t=3,9,15$, sama dengan cara logika.',
      visual: tide({ mid: true, zeros: true, gap: true, ext: true }),
      board: { title: 'Nilai t', pins: N3, list: 'LZ', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Kapan rumus diperlukan? Misalnya ditanya kedalaman $13{,}3$ m, yang bukan garis tengah: hasilnya $t=2$, bukan $3$.',
      visual: tide({ mid: true, alt: true }),
      board: { title: 'Kalau angkanya tidak cantik', pins: N3, list: 'LU', upTo: 3, from: 0 },
    },
    // ---- 6 · Uji kelima pilihan ----
    open6('A', 'Kita cek pilihan A dulu. Salin ke papan.'),
    check6(
      'A',
      'Pada $t=3$ kedalamannya memang $12{,}3$ m, tetapi itu kemunculan pertama. A <b class="k-red">bukan</b>.',
    ),
    open6('B', 'Lanjut pilihan B.'),
    check6('B', 'Pada $t=9$ juga $12{,}3$ m, tetapi baru kemunculan kedua. B <b class="k-red">bukan</b>.'),
    open6('C', 'Pilihan C.'),
    check6(
      'C',
      '$t=10$ tidak ada di pola $3,9,15$, jadi tidak di garis tengah (grafiknya $13{,}3$ m). C <b class="k-red">bukan</b>.',
    ),
    open6('D', 'Pilihan D.'),
    check6('D', 'Pada $t=12$ kedalamannya $14{,}3$ m, puncak. D <b class="k-red">bukan</b>.'),
    open6('E', 'Terakhir, pilihan E.'),
    check6(
      'E',
      'Pada $t=15$ kedalamannya $12{,}3$ m dan ini kemunculan ketiga. E <b class="k-gold">benar</b>.',
    ),
    // ---- 7 · Catatan lengkap ----
    {
      ch: 7,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 8 · Cocokkan pilihan ----
    {
      ch: 8,
      cap: 'Cocokkan dengan pilihan: kedalaman $12{,}3$ m yang ketiga terjadi pada $t=15$. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: N3, list: 'L7', upTo: 1, from: 0 },
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
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">E</span><span>Kedalaman $12{,}3$ m (garis tengah) tercapai pada $t=3,9,15$. Yang ketiga: $15$ jam setelah pukul 00.00.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LS', upTo: 2, from: 2 },
    },
  ],
  cards: [
    { label: 'A', statement: '3 jam', ok: false, formula: 't=3', why: 'Kemunculan pertama.' },
    { label: 'B', statement: '9 jam', ok: false, formula: 't=9', why: 'Kemunculan kedua.' },
    {
      label: 'C',
      statement: '10 jam',
      ok: false,
      formula: 'y(10)=13{,}3',
      why: 'Bukan di garis tengah ($3, 9, 15$).',
    },
    {
      label: 'D',
      statement: '12 jam',
      ok: false,
      formula: 'y(12)=14{,}3',
      why: 'Pada $t=12$ kedalaman 14,3 m (puncak).',
    },
    { label: 'E', statement: '15 jam', ok: true, formula: 't=15', why: 'Kemunculan ketiga.' },
  ],
  notes: {
    title: 'Pembahasan Soal 11: Kedalaman Air Laut',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Trigonometri',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Garis tengah',
        lists: ['LD', 'LG'],
        why: 'Garis tengah = lembah + setengah selisih puncak dan lembah. Di soal ini tepat $12{,}3$.',
      },
      {
        title: 'Waktu dari grafik',
        lists: ['LW'],
        why: 'Dari puncak ke lembah, garis tengah dilewati tepat di tengah waktunya; polanya berulang tiap $6$ jam.',
      },
      { title: 'Hitung kemunculan', lists: ['LK'] },
      {
        title: 'Cara alternatif dengan rumus (opsional)',
        lists: ['LX', 'LY', 'LE', 'LZ', 'LU'],
        why: 'Mulai dari puncak → kosinus; periode $12$ jam → $\\frac{2\\pi}{12}=\\frac\\pi6$. Rumus dipakai bila kedalaman yang ditanya bukan garis tengah.',
      },
      { title: 'Uji kelima pilihan', lists: ['LOA', 'LOB', 'LOC', 'LOD', 'LOE'] },
    ],
    answer: 'Jawaban: <b>E</b>, 15 jam.',
  },
  done: {
    seal: 'E',
    message:
      'Kedalaman $12{,}3$ m (garis tengah) tercapai pada $t=3,9,15$. Yang ketiga: $15$ jam setelah pukul 00.00.',
  },
  key: { answer: 'E', cardOk: [false, false, false, false, true], goldRows: ['c3', 'oE', 's1', 'r2'] },
  authorNotes: [
    'Modul baru (v1.20), ditulis ulang pada revisi pemilik v1.21: jalur utama memakai logika dari grafik saja (garis tengah = lembah + setengah selisih; tengah waktu puncak–lembah 6 ÷ 2 = 3; berulang tiap 6 jam), sesuai saran pemilik.',
    'Cara rumus (dokumen Bagian 2–3) dipindah ke bagian opsional, ditambah dasarnya: kenapa kosinus (grafik mulai dari puncak) dan dari mana π/6 (periode 12 jam dari grafik).',
    'Contoh "angka tidak cantik" kedalaman 13,3 m → t = 2 diturunkan dari model dokumen (12,3 + 2 cos(π/3) = 13,3), untuk menunjukkan kapan cara logika tengah-waktu tidak berlaku.',
    'Tanpa simbol ":" di baris papan (revisi pemilik v1.21): kemunculan ditulis "ke-1 → t = 3".',
    'Langkah Hati-hati t = 12 dari Kesalahan umum dokumen; nilai pilihan C (13,3) dan D (14,3) dibaca dari grafik, sesuai model dokumen.',
  ],
};

export default q11;
