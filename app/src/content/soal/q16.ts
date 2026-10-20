/**
 * SOAL 16 — Titik Singgung Tegak Lurus Garis f (lingkaran dan garis singgung; multi-jawaban).
 * Sumber: docs/pembahasan25.md "SOAL 16", docs/soal25.md no. 16, docs/garis_dan_lingkaran.png.
 * Kunci: (3, −1) dan (1, −5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Tan16State } from '../../visuals/tan16';
import { getSoal } from '../index';

/** Gambar asli soal (docs/garis_dan_lingkaran.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/garis_dan_lingkaran.png', import.meta.url).href;
const g = (state: Tan16State): Visual => ({ kind: 'svg', scene: 'tan16', state });
const PIN3 = ['pm', 'pr'];
const PIN3b = ['pA', 'pT'];

const q16: SoalContent = {
  meta: getSoal(16)!,
  sourceRef: 'docs/pembahasan25.md#soal-16',
  paper: {
    html: `<div class="soal-split"><div>
<p>Perhatikan gambar berikut.</p>
<p>Tentukan <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">semua koordinat titik singgung</span></span> lingkaran dari <span class="hl hl-blue" data-hl="1"><span data-src="s-singgung">garis-garis singgung lingkaran</span></span> yang <span class="hl hl-red" data-hl="1"><span data-src="s-tegak">tegak lurus terhadap garis f</span></span>.</p>
<p>Pilih semua jawaban yang benar! Jawaban benar lebih dari satu.</p>
</div><figure class="soal-fig"><img src="${fig}" width="780" height="716" alt="Bidang koordinat: garis f melalui C = (−1, 0) dan D = (0, 2); lingkaran c berpusat A = (2, −3) dan melalui B = (3, −1)." /></figure></div>
<ul class="checks">
<li>$(3,1)$</li><li>$(1,-5)$</li><li>$(-1,5)$</li><li>$(3,-1)$</li><li>$(-3,-1)$</li>
</ul>`,
    srcNames: ['s-tanya', 's-singgung', 's-tegak'],
  },
  visualSrc: ['g-A', 'g-B', 'g-C', 'g-D', 'o-1', 'o-2', 'o-3', 'o-4', 'o-5'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Lingkaran',
    titleLines: ['Pembahasan Soal', 'Titik <span class="accent">Singgung</span>', 'Garis Tegak Lurus'],
    lede: 'Ada lingkaran dan garis $f$. Garis singgung yang tegak lurus $f$ menyentuh lingkaran di titik mana saja?',
    facts: [
      { dt: 'Pusat', dd: 'A(2, −3)' },
      { dt: 'Garis f', dd: 'melalui C dan D' },
      { dt: 'Dicari', dd: 'titik singgung' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Arah f dan jari-jari', d: 'mf = 2, r = √5' },
    { t: 'Titik singgung', d: 'Jari-jari sejajar f' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Analisis pilihan', d: '5 kartu' },
    { t: 'Selesai', d: '(3, −1) dan (1, −5)' },
  ],
  pins: {
    pm: { id: 'pm', toks: [T('Pm1', 'm_f'), O('Pm2', '='), T('Pm3', '2')] },
    pr: { id: 'pr', toks: [T('Pr1', 'r'), O('Pr2', '='), T('Pr3', '\\sqrt5')] },
    pA: {
      id: 'pA',
      toks: [T('PA1', 'A'), O('PA2', '='), T('PA3', '(2,-3)'), O('PA4', ','), T('PA5', 'r^2=5')],
    },
    pT: {
      id: 'pT',
      gold: true,
      toks: [T('PT1', 'T_1=(3,-1)'), O('PT2', ','), T('PT3', 'T_2=(1,-5)')],
    },
  },
  lists: {
    L1: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      {
        id: 'k2',
        toks: [
          H('k2a', '<i>f</i> melalui', 'tx'),
          T('k2b', 'C(-1,0)', 'red', '@g-C'),
          H('k2c', 'dan', 'tx'),
          T('k2d', 'D(0,2)', 'red', '@g-D'),
        ],
      },
      {
        id: 'k3',
        toks: [
          H('k3a', 'lingkaran: pusat', 'tx'),
          T('k3b', 'A(2,-3)', 'red', '@g-A'),
          H('k3c', 'melalui', 'tx'),
          T('k3d', 'B(3,-1)', 'red', '@g-B'),
        ],
      },
      {
        id: 'k4',
        toks: [
          H('k4a', 'Ditanya', 'lbl'),
          H('k4b', 'titik singgung garis', 'gold', '@s-tanya'),
          T('k4c', '\\perp f', 'gold'),
        ],
      },
    ],
    L2: [
      {
        id: 'a1',
        toks: [T('a1a', 'm_f'), O('a1b', '='), T('a1c', '\\dfrac{y_D-y_C}{x_D-x_C}')],
        note: 'rumus gradien',
      },
      {
        id: 'a2',
        toks: [T('a2a', 'm_f'), O('a2b', '='), T('a2c', '\\dfrac{2-0}{0-(-1)}', '', '@g-D')],
      },
      {
        id: 'a3',
        toks: [T('a3a', 'm_f'), O('a3b', '='), T('a3c', '2', 'blue')],
        note: 'arah $f$: naik 2 untuk tiap 1 ke kanan',
        box: 'navy',
      },
    ],
    L2b: [
      {
        id: 'b1',
        toks: [T('b1a', 'r^2'), O('b1b', '='), T('b1c', '(3-2)^2+(-1-(-3))^2', '', '@g-B')],
        note: 'jarak $AB$',
      },
      { id: 'b2', toks: [T('b2a', 'r^2'), O('b2b', '='), T('b2c', '1+4'), O('b2d', '='), T('b2e', '5')] },
      { id: 'b3', toks: [T('b3a', 'r'), O('b3b', '='), T('b3c', '\\sqrt5', 'blue')], box: 'navy' },
    ],
    L3: [
      {
        id: 'c1',
        toks: [H('c1a', 'arah <i>f</i>', 'tx'), O('c1b', ':'), T('c1c', '(1,2)', '', 'Pm3')],
        note: 'gradien 2 → geser 1, naik 2',
      },
      {
        id: 'c2',
        toks: [
          H('c2a', 'panjang arah', 'tx'),
          O('c2b', '='),
          T('c2c', '\\sqrt{1^2+2^2}'),
          O('c2d', '='),
          T('c2e', '\\sqrt5=r', 'blue', 'Pr3'),
        ],
        note: 'vektor $(1,2)$ sudah sepanjang jari-jari',
        box: 'navy',
      },
      {
        id: 'c3',
        toks: [
          T('c3a', 'T'),
          O('c3b', '='),
          T('c3c', 'A', '', '@g-A'),
          T('c3d', '\\pm(1,2)'),
          O('c3e', '='),
          T('c3f', '(2\\pm1,\\ -3\\pm2)'),
        ],
        note: 'pusat digeser sejauh jari-jari',
      },
      {
        id: 'c4',
        toks: [T('c4a', 'T_1=(3,-1)', 'gold'), O('c4b', ','), T('c4c', 'T_2=(1,-5)', 'gold')],
        note: 'titik singgung',
        box: 'gold',
      },
    ],
    L3b: [
      {
        id: 'd1',
        toks: [
          T('d1a', '(3,1)', '', '@o-1'),
          O('d1b', ':'),
          T('d1c', '\\vec{AT}=(1,4)'),
          O('d1d', ','),
          T('d1e', '1+16=17\\ne5'),
        ],
        note: 'di luar lingkaran',
      },
      {
        id: 'd2',
        toks: [
          T('d2a', '(1,-5)', '', '@o-2'),
          O('d2b', ':'),
          T('d2c', '\\vec{AT}=(-1,-2)'),
          O('d2d', ','),
          T('d2e', '1+4=5', 'gold'),
        ],
        note: 'sejajar $(1,2)$ → lolos',
        box: 'gold',
      },
      {
        id: 'd3',
        toks: [
          T('d3a', '(-1,5)', '', '@o-3'),
          O('d3b', ':'),
          T('d3c', '\\vec{AT}=(-3,8)'),
          O('d3d', ','),
          T('d3e', '9+64=73\\ne5'),
        ],
        note: 'di luar lingkaran',
      },
      {
        id: 'd4',
        toks: [
          T('d4a', '(3,-1)', '', '@o-4'),
          O('d4b', ':'),
          T('d4c', '\\vec{AT}=(1,2)'),
          O('d4d', ','),
          T('d4e', '1+4=5', 'gold'),
        ],
        note: 'sejajar $(1,2)$ → lolos',
        box: 'gold',
      },
      {
        id: 'd5',
        toks: [
          T('d5a', '(-3,-1)', '', '@o-5'),
          O('d5b', ':'),
          T('d5c', '\\vec{AT}=(-5,2)'),
          O('d5d', ','),
          T('d5e', '25+4=29\\ne5'),
        ],
        note: 'di luar lingkaran',
      },
    ],
    L5: [
      {
        id: 's1',
        toks: [T('s1a', '(1)', 'sp'), T('s1b', 'AT^2=17\\ne5'), T('s1c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's2',
        toks: [T('s2a', '(2)', 'sp'), T('s2b', 'AT^2=5'), T('s2c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      {
        id: 's3',
        toks: [T('s3a', '(3)', 'sp'), T('s3b', 'AT^2=73\\ne5'), T('s3c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's4',
        toks: [T('s4a', '(4)', 'sp'), T('s4b', 'AT^2=5'), T('s4c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      {
        id: 's5',
        toks: [T('s5a', '(5)', 'sp'), T('s5b', 'AT^2=29\\ne5'), T('s5c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's6',
        toks: [H('s6a', 'Jawaban', 'lbl'), T('s6b', '(3,-1)'), H('s6c', 'dan', 'tx'), T('s6d', '(1,-5)')],
        box: 'gold',
      },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', 'T_1=(3,-1)')], note: 'garis singgung $x+2y-1=0$', box: 'gold' },
      { id: 'r2', toks: [T('r2a', 'T_2=(1,-5)')], note: 'garis singgung $x+2y+9=0$', box: 'gold' },
      {
        id: 'r3',
        toks: [H('r3a', 'Jawaban', 'lbl'), T('r3b', '(3,-1)'), H('r3c', 'dan', 'tx'), T('r3d', '(1,-5)')],
        box: 'gold',
      },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Baca soal dan lihat gambarnya. Garis $f$ dan lingkaran $c$ sudah digambar.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 0, from: 0 },
    },
    {
      ch: 1,
      cap: 'Kita butuh arah garis $f$, serta pusat dan jari-jari lingkaran.',
      visual: g({ stage: 'base' }),
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 4, from: 0 },
    },
    // ---- 2 · Arah f dan jari-jari ----
    {
      ch: 2,
      cap: 'Hitung gradien $f$ dari dua titik yang dilaluinya.',
      visual: g({ stage: 'grad' }),
      board: { title: 'Garis f', list: 'L2', upTo: 3, from: 0 },
      ask: {
        before: 'a3',
        q: 'Gradien garis melalui $(-1,0)$ dan $(0,2)$ adalah…',
        opts: [
          { tex: '2', ok: true },
          {
            tex: '\\tfrac12',
            hint: 'Gradien = perubahan $y$ dibagi perubahan $x$: $2$ dibagi $1$, bukan sebaliknya.',
          },
          { tex: '-2', hint: 'Garis $f$ naik ke kanan pada gambar, jadi gradiennya positif.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Jari-jari adalah jarak dari pusat $A$ ke titik $B$ yang ada di lingkaran.',
      visual: g({ stage: 'radius' }),
      board: { title: 'Jari-jari lingkaran', list: 'L2b', upTo: 3, from: 0 },
    },
    // ---- 3 · Titik singgung ----
    {
      ch: 3,
      cap: 'Garis singgung $\\perp$ jari-jari dan garis singgung $\\perp f$. Jadi jari-jari sejajar $f$, arahnya $(1,2)$.',
      visual: g({ stage: 'par' }),
      board: { title: 'Titik singgung', pins: PIN3, list: 'L3', upTo: 4, from: 0 },
      ask: {
        before: 'c4',
        q: 'Titik singgung terletak pada jari-jari yang…',
        col: true,
        opts: [
          { txt: 'sejajar garis f', ok: true },
          {
            txt: 'tegak lurus garis f',
            hint: 'Garis <b>singgung</b> yang tegak lurus $f$. Jari-jari tegak lurus garis singgung, jadi sejajar $f$.',
          },
          {
            txt: 'sama dengan garis f',
            hint: '$f$ tidak melalui pusat lingkaran. Jari-jari hanya <b>sejajar</b> $f$.',
          },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Uji pilihan: jaraknya dari pusat harus $\\sqrt5$ dan vektor dari pusat harus sejajar $(1,2)$.',
      visual: g({ stage: 'test', cur: 1, tested: [1] }),
      board: { title: 'Menguji tiap pilihan', pins: PIN3b, list: 'L3b', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Pilihan $(1,-5)$: $\\vec{AT}=(-1,-2)$, panjangnya $\\sqrt5$ dan sejajar $(1,2)$. Lolos.',
      visual: g({ stage: 'test', cur: 2, tested: [1, 2] }),
      board: { title: 'Menguji tiap pilihan', pins: PIN3b, list: 'L3b', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Pilihan $(-1,5)$: $AT^2=73$, jauh di luar lingkaran.',
      visual: g({ stage: 'test', cur: 3, tested: [1, 2, 3] }),
      board: { title: 'Menguji tiap pilihan', pins: PIN3b, list: 'L3b', upTo: 3, from: 2 },
    },
    {
      ch: 3,
      cap: 'Pilihan $(3,-1)$: $\\vec{AT}=(1,2)$, yaitu titik $B$ pada gambar. Lolos.',
      visual: g({ stage: 'test', cur: 4, tested: [1, 2, 3, 4] }),
      board: { title: 'Menguji tiap pilihan', pins: PIN3b, list: 'L3b', upTo: 4, from: 3 },
    },
    {
      ch: 3,
      cap: 'Pilihan $(-3,-1)$: $AT^2=29$, tidak berada di lingkaran.',
      visual: g({ stage: 'test', cur: 5, tested: [1, 2, 3, 4, 5] }),
      board: { title: 'Menguji tiap pilihan', pins: PIN3b, list: 'L3b', upTo: 5, from: 4 },
    },
    // ---- 4 · Catatan lengkap ----
    {
      ch: 4,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 5 · Analisis pilihan ----
    {
      ch: 5,
      cap: 'Titik singgungnya $(3,-1)$ dan $(1,-5)$. Sekarang periksa kelima pilihan.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Analisis pilihan', pins: ['pT'], list: 'L5', upTo: 0, from: 0 },
    },
    {
      ch: 5,
      cap: '(1) $(3,1)$: $AT^2=17\\ne5$, tidak berada di lingkaran. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Analisis pilihan', pins: ['pT'], list: 'L5', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: '(2) $(1,-5)$: titik singgung bawah (<b class="k-gold">benar</b>).',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Analisis pilihan', pins: ['pT'], list: 'L5', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: '(3) $(-1,5)$: $AT^2=73\\ne5$, tidak berada di lingkaran. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Analisis pilihan', pins: ['pT'], list: 'L5', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: '(4) $(3,-1)$: titik $B$ pada gambar (<b class="k-gold">benar</b>).',
      visual: { kind: 'cards', flip: 4 },
      board: { title: 'Analisis pilihan', pins: ['pT'], list: 'L5', upTo: 4, from: 3 },
    },
    {
      ch: 5,
      cap: '(5) $(-3,-1)$: $AT^2=29\\ne5$ (<b class="k-red">salah</b>). Pilih kesimpulannya di papan tulis.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Analisis pilihan', pins: ['pT'], list: 'L5', upTo: 6, from: 4 },
      ask: {
        before: 's6',
        q: 'Titik singgung yang benar adalah…',
        col: true,
        win: '$(3,-1)$ dan $(1,-5)$.',
        opts: [
          {
            tex: '(3,-1)\\ \\text{saja}',
            hint: 'Selalu ada dua garis singgung dengan arah yang sama: $(1,-5)$ juga.',
          },
          { tex: '(3,1)\\ \\text{dan}\\ (1,-5)', hint: '$(3,1)$: $AT^2=17$, tidak berada di lingkaran.' },
          { tex: '(3,-1)\\ \\text{dan}\\ (1,-5)', ok: true },
          {
            tex: '(-1,5)\\ \\text{dan}\\ (-3,-1)',
            hint: 'Keduanya tidak berada di lingkaran ($73$ dan $29$, bukan $5$).',
          },
        ],
      },
    },
    // ---- 6 · Selesai ----
    {
      ch: 6,
      cap: '<span class="verdict"><span class="seal">(3, −1) · (1, −5)</span><span>Jari-jari yang sejajar $f$ menembus lingkaran di $(3,-1)$ dan $(1,-5)$; di dua titik itulah garis singgung tegak lurus $f$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
    },
  ],
  cards: [
    {
      label: '1',
      statement: '$(3,1)$',
      ok: false,
      formula: 'AT^2=17\\ne5',
      why: 'Tidak berada di lingkaran.',
    },
    {
      label: '2',
      statement: '$(1,-5)$',
      ok: true,
      formula: 'AT^2=5,\\ \\vec{AT}=-(1,2)',
      why: 'Titik singgung bawah.',
    },
    {
      label: '3',
      statement: '$(-1,5)$',
      ok: false,
      formula: 'AT^2=73\\ne5',
      why: 'Tidak berada di lingkaran.',
    },
    {
      label: '4',
      statement: '$(3,-1)$',
      ok: true,
      formula: 'AT^2=5,\\ \\vec{AT}=(1,2)',
      why: 'Titik $B$ pada gambar.',
    },
    {
      label: '5',
      statement: '$(-3,-1)$',
      ok: false,
      formula: 'AT^2=29\\ne5',
      why: 'Tidak berada di lingkaran.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 16: Titik Singgung Tegak Lurus Garis f',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Lingkaran',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      { title: 'Arah garis f dan jari-jari lingkaran', lists: ['L2', 'L2b'] },
      {
        title: 'Titik singgung',
        lists: ['L3', 'L3b'],
        sketch: 'tan16',
        why: 'Garis singgung selalu tegak lurus jari-jari di titik singgung. Jika garis singgungnya tegak lurus $f$, maka jari-jari sejajar $f$. Garis singgungnya: $x+2y-1=0$ di $(3,-1)$ dan $x+2y+9=0$ di $(1,-5)$.',
      },
    ],
    answer: 'Jawaban: <b>$(3,-1)$</b> dan <b>$(1,-5)$</b>.',
  },
  done: {
    seal: '(3, −1) · (1, −5)',
    message:
      'Jari-jari yang sejajar $f$ menembus lingkaran di $(3,-1)$ dan $(1,-5)$; di dua titik itulah garis singgung tegak lurus $f$.',
  },
  key: {
    answer: '(3,-1), (1,-5)',
    cardOk: [false, true, false, true, false],
    goldRows: ['c4', 'd2', 'd4', 's6', 'r1', 'r2', 'r3'],
  },
  authorNotes: [
    'Langkah 1.2 menampilkan adegan bidang koordinat agar label titik (g-A … g-D) menjadi sumber terbang k2–k3.',
    'Bagian 2: papan dibagi "Garis f" dan "Jari-jari lingkaran"; Bagian 3: pin m_f dan r untuk c1–c2, pin A dan T untuk d1–d5.',
    'Langkah 3.2 dipecah satu langkah per pilihan; pop-up disusun dari kolom keterangan d1–d5 dan alasan kartu. Chip pilihan menjadi sumber o-1…o-5.',
    'Bagian 5: papan ringkasan s1–s6 dan pertanyaan kesimpulan disusun dari kartu; ringkasan LR memuat persamaan garis singgung dari Catatan lengkap.',
  ],
};

export default q16;
