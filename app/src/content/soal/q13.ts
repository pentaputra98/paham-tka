/**
 * SOAL 13 — Trapesium Sama Kaki (vektor di bidang; pilihan tunggal). Kunci: C (a² + 2b = 9; a = −1, b = 4).
 * Sumber: docs/pembahasan25.md "SOAL 13", docs/soal25.md no. 13.
 * Alur pemilik (v1.47, logika gambar dulu, cara aljabar opsional):
 *  - pahami: AD = BC (kaki), A(0, 0), AD = (1, 4), AB = (6, 0), BC = (a, b); ditanya a² + 2b;
 *  - gambar titik di kisi: dari A, AB berarti 6 ke kanan → B(6, 0); AD berarti 1 ke kanan, 4 ke atas → D(1, 4);
 *  - titik C: sama kaki berarti simetris terhadap x = 3; D 1 ke kanan dari A, maka C 1 ke kiri dari B → C(5, 4);
 *    pertanyaan dokumen "Kenapa C di y = 4?" (DC sejajar AB);
 *  - vektor BC dibaca di kisi: 1 ke kiri, 4 ke atas → (−1, 4); hati-hati BC ≠ AD (jajargenjang, C′(7, 4));
 *  - a² + 2b = 1 + 8 = 9 → pilihan C; bagian opsional "Cara aljabar" (BC = C − B, |AD| = |BC| = √17).
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Trap13State } from '../../visuals/trap13';
import { getSoal } from '../index';

const plane = (state: Trap13State): Visual => ({ kind: 'svg', scene: 'trap13', state });
const col = (a: string, b: string): string => `\\begin{pmatrix}${a}\\\\${b}\\end{pmatrix}`;
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
const OPT = ['5', '7', '9', '10', '13'];
/** keadaan adegan bertahap */
const PTS: Trap13State = { n: 3, lean: true };
const CC: Trap13State = { ...PTS, sym: true, mir: true };
const ALL: Trap13State = { ...CC, step: true, fill: true };

const q13: SoalContent = {
  meta: getSoal(13)!,
  sourceRef: 'docs/pembahasan25.md#soal-13',
  layout: 'full',
  paper: {
    html: `<p>Diketahui trapesium sama kaki ABCD dengan <span class="hl hl-blue" data-hl="1"><span data-src="s-kaki">$AD=BC$</span></span> dan titik <span class="hl hl-red" data-hl="1"><span data-src="s-A">$A(0, 0)$</span></span>. Vektor-vektor posisi pembentuk trapesium adalah <span class="hl hl-red" data-hl="2"><span data-src="s-AD">$\\overrightarrow{AD}=${col('1', '4')}$</span></span>, <span class="hl hl-red" data-hl="2"><span data-src="s-AB">$\\overrightarrow{AB}=${col('6', '0')}$</span></span> dan <span class="hl hl-blue" data-hl="2"><span data-src="s-BC">$\\overrightarrow{BC}=${col('a', 'b')}$</span></span>.</p>
<p>Nilai dari <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">$a^{2}+2b$</span></span>$=....$</p>
<ol class="abc">
${LETTERS.map((o, i) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">${OPT[i]}</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-kaki', 's-A', 's-AD', 's-AB', 's-BC', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['v-bc'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Vektor',
    titleLines: ['Pembahasan Soal', 'Trapesium <span class="accent">Sama Kaki</span>', 'Vektor'],
    lede: 'Tiga vektor membentuk trapesium sama kaki $ABCD$ dengan $A$ di titik asal. Gambar di kisi, lalu baca komponen $\\overrightarrow{BC}$.',
    facts: [
      { dt: 'AD', dd: '(1, 4)' },
      { dt: 'AB', dd: '(6, 0)' },
      { dt: 'Dicari', dd: 'a² + 2b' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Gambar titik', d: 'B(6, 0) dan D(1, 4)' },
    { t: 'Titik C', d: 'Simetris, C(5, 4)' },
    { t: 'Vektor BC', d: '1 ke kiri, 4 ke atas' },
    { t: 'Nilai a² + 2b', d: 'Pilihan C' },
    { t: 'Cara aljabar', d: 'Opsional: C − B dan panjang kaki', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban C' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pB: { id: 'pB', toks: [T('PB1', 'B=(6,0)', '', 'g2c')] },
    pD: { id: 'pD', toks: [T('PD1', 'D=(1,4)', '', 'g3c')] },
    pC: { id: 'pC', toks: [T('PC1', 'C=(5,4)', '', 'c3c')] },
    pab: { id: 'pab', toks: [T('PQ1', 'a=-1,\\ b=4', '', 'v2e')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [T('k1a', 'AD=BC', 'blue', '@s-kaki'), O('k1b', ','), T('k1c', 'A(0,0)', 'red', '@s-A')],
        note: 'kedua kaki sama panjang, $A$ di titik asal',
      },
      {
        id: 'k2',
        toks: [
          T('k2a', `\\overrightarrow{AD}=${col('1', '4')}`, 'red', '@s-AD'),
          O('k2b', ','),
          T('k2c', `\\overrightarrow{AB}=${col('6', '0')}`, 'red', '@s-AB'),
        ],
      },
      {
        id: 'k3',
        toks: [
          T('k3a', `\\overrightarrow{BC}=${col('a', 'b')}`, 'blue', '@s-BC'),
          O('k3b', ','),
          H('k3c', 'Ditanya', 'lbl'),
          T('k3d', 'a^2+2b', 'gold', '@s-tanya'),
        ],
      },
    ],
    LG: [
      { id: 'g1', toks: [T('g1a', 'A=(0,0)', '', '@s-A')], note: 'titik asal, pangkal kedua vektor' },
      {
        id: 'g2',
        toks: [
          T('g2a', '\\overrightarrow{AB}=(6,0)', '', '@s-AB'),
          O('g2b', '\\to'),
          T('g2c', 'B=(6,0)', 'blue'),
        ],
        note: 'dari $A$, $6$ ke kanan dan $0$ ke atas; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'g3',
        toks: [
          T('g3a', '\\overrightarrow{AD}=(1,4)', '', '@s-AD'),
          O('g3b', '\\to'),
          T('g3c', 'D=(1,4)', 'red'),
        ],
        note: 'dari $A$, $1$ ke kanan dan $4$ ke atas; simpan ke catatan',
        box: 'navy',
      },
    ],
    LC: [
      {
        id: 'c1',
        toks: [H('c1a', 'garis simetri', 'tx'), T('c1b', 'x=3', 'blue', 'PB1')],
        note: 'tepat di tengah alas $AB$, $6$ dibagi $2$',
      },
      {
        id: 'c2',
        toks: [
          T('c2a', 'D', '', 'PD1'),
          H('c2b', '1 ke kanan dari <i>A</i>', 'tx'),
          O('c2c', '\\to'),
          T('c2d', 'C'),
          H('c2e', '1 ke kiri dari <i>B</i>', 'tx'),
        ],
        note: 'kaki kanan cerminan kaki kiri terhadap $x=3$',
      },
      {
        id: 'c3',
        toks: [
          T('c3a', 'C'),
          O('c3b', '='),
          T('c3d', '(6-1,\\ 4)'),
          O('c3e', '='),
          T('c3c', '(5,4)', 'blue'),
        ],
        note: 'tingginya sama dengan $D$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LV: [
      {
        id: 'v1',
        toks: [
          H('v1a', 'dari <i>B</i> ke <i>C</i>', 'tx'),
          O('v1b', '\\to'),
          H('v1c', '1 ke kiri, 4 ke atas', 'tx'),
        ],
        note: 'baca langkahnya di kisi, dari $(6,0)$ ke $(5,4)$',
      },
      {
        id: 'v2',
        toks: [
          T('v2a', '\\overrightarrow{BC}'),
          O('v2b', '='),
          T('v2c', '(-1,4)', 'blue', '@v-bc'),
          O('v2d', '\\to'),
          T('v2e', 'a=-1,\\ b=4', 'blue'),
        ],
        note: 'ke kiri bernilai negatif, ke atas positif; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'v3',
        toks: [H('v3a', 'Hati-hati', 'lbl'), T('v3b', '\\overrightarrow{BC}\\ne\\overrightarrow{AD}', 'red')],
        note: 'kalau $\\overrightarrow{BC}=(1,4)$, $C$ di $(7,4)$ dan bangunnya jajargenjang',
      },
    ],
    LN: [
      {
        id: 'n1',
        toks: [T('n1a', 'a^2+2b'), O('n1b', '='), T('n1c', '(-1)^2+2(4)', '', 'PQ1')],
        note: 'masukkan $a=-1$ dan $b=4$',
      },
      {
        id: 'n2',
        toks: [T('n2a', 'a^2+2b'), O('n2b', '='), T('n2c', '1+8')],
        note: '$(-1)^2=1$ dan $2\\cdot4=8$',
      },
      { id: 'n3', toks: [T('n3a', 'a^2+2b'), O('n3b', '='), T('n3c', '9', 'gold')], box: 'gold' },
      {
        id: 'n4',
        toks: [H('n4a', 'Jawaban', 'lbl'), T('n4b', '\\textbf{C}', '', '@s-oC'), T('n4c', '9', 'gold')],
        note: 'ada di pilihan C',
        box: 'gold',
      },
    ],
    // cara aljabar (opsional)
    LA: [
      {
        id: 'x1',
        toks: [
          T('x1a', '\\overrightarrow{BC}'),
          O('x1b', '='),
          T('x1c', 'C-B', '', 'PC1'),
          O('x1d', '='),
          T('x1e', '(5-6,\\ 4-0)'),
        ],
        note: 'vektor antara dua titik, ujung dikurangi pangkal',
      },
      {
        id: 'x2',
        toks: [T('x2a', '\\overrightarrow{BC}'), O('x2b', '='), T('x2c', '(-1,4)', 'blue')],
        note: 'sama dengan hasil membaca kisi',
        box: 'navy',
      },
      {
        id: 'x3',
        toks: [
          T('x3a', '|\\overrightarrow{AD}|'),
          O('x3b', '='),
          T('x3c', '\\sqrt{1^2+4^2}', '', 'PD1'),
          O('x3d', '='),
          T('x3e', '\\sqrt{17}'),
        ],
      },
      {
        id: 'x4',
        toks: [
          T('x4a', '|\\overrightarrow{BC}|'),
          O('x4b', '='),
          T('x4c', '\\sqrt{(-1)^2+4^2}', '', 'x2c'),
          O('x4d', '='),
          T('x4e', '\\sqrt{17}', 'blue'),
        ],
        note: 'kedua kaki sama panjang, cocok',
        box: 'navy',
      },
    ],
    L7: [{ id: 'w1', toks: [H('w1a', 'Jawaban', 'lbl'), T('w1b', '\\textbf{C}')], box: 'gold' }],
    LR: [
      { id: 'r1', toks: [T('r1a', '\\overrightarrow{BC}=(-1,4)')], note: '$a^2+2b=1+8=9$', box: 'gold' },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), T('r2b', '\\textbf{C}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Trapesium $ABCD$ sama kaki, artinya kaki $AD$ dan $BC$ sama panjang, dan $A$ di titik asal.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Diketahui $\\overrightarrow{AD}=(1,4)$ dan $\\overrightarrow{AB}=(6,0)$, sedangkan $\\overrightarrow{BC}=(a,b)$. Yang ditanya $a^2+2b$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 3, from: 1 },
    },
    // ---- 2 · Gambar titik ----
    {
      ch: 2,
      cap: 'Gambar di kisi. Dari $A(0,0)$, vektor $\\overrightarrow{AB}=(6,0)$ artinya $6$ ke kanan, jadi $B=(6,0)$.',
      visual: plane({ n: 2 }),
      board: { title: 'Gambar titik', list: 'LG', upTo: 2, from: 0, save: ['pB'] },
    },
    {
      ch: 2,
      cap: 'Vektor $\\overrightarrow{AD}=(1,4)$ artinya $1$ ke kanan lalu $4$ ke atas, jadi $D=(1,4)$.',
      visual: plane(PTS),
      board: { title: 'Gambar titik', list: 'LG', upTo: 3, from: 2, save: ['pD'] },
    },
    // ---- 3 · Titik C ----
    {
      ch: 3,
      cap: 'Trapesium sama kaki itu simetris. Garis simetrinya tegak di tengah alas $AB$, yaitu $x=3$.',
      visual: plane({ ...PTS, sym: true }),
      board: { title: 'Titik C', pins: ['pB', 'pD'], list: 'LC', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Kaki kiri condong $1$ ke kanan dari $A$, maka kaki kanan condong $1$ ke kiri dari $B$. Jadi $C=(5,4)$.',
      visual: plane(CC),
      board: { title: 'Titik C', pins: ['pB', 'pD'], list: 'LC', upTo: 3, from: 1, save: ['pC'] },
      ask: {
        before: 'c3',
        q: 'Kenapa $C$ berada di ketinggian $y=4$?',
        col: true,
        opts: [
          { txt: 'Karena DC harus sejajar alas AB yang mendatar', ok: true },
          {
            txt: 'Karena C harus sama panjang dengan D',
            hint: 'Yang sama panjang adalah kaki $AD$ dan $BC$, bukan titik $C$ dengan $D$.',
          },
          {
            txt: 'Karena B berada di y = 0',
            hint: '$B$ memang di $y=0$, tetapi alasannya sisi $DC$ sejajar sisi $AB$.',
          },
        ],
      },
    },
    // ---- 4 · Vektor BC ----
    {
      ch: 4,
      cap: 'Baca vektor $\\overrightarrow{BC}$ di kisi. Dari $B$ ke $C$ langkahnya $1$ ke kiri lalu $4$ ke atas, jadi $\\overrightarrow{BC}=(-1,4)$.',
      visual: plane({ ...CC, step: true }),
      board: { title: 'Vektor BC', pins: ['pB', 'pC'], list: 'LV', upTo: 2, from: 0, save: ['pab'] },
      ask: {
        before: 'v2',
        q: 'Komponen mendatar $\\overrightarrow{BC}$, yaitu $a$, adalah…',
        opts: [
          { tex: '-1', ok: true },
          { tex: '1', hint: 'Arahnya ke kiri, jadi bernilai negatif.' },
          { tex: '-5', hint: 'Langkahnya hanya $1$ kotak, dari $x=6$ ke $x=5$.' },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Hati-hati, $\\overrightarrow{BC}$ tidak sama dengan $\\overrightarrow{AD}$. Kalau $\\overrightarrow{BC}=(1,4)$, $C$ jatuh di $(7,4)$ dan bangunnya jajargenjang.',
      visual: plane({ ...CC, step: true, ghost: true }),
      board: { title: 'Vektor BC', pins: ['pB', 'pC'], list: 'LV', upTo: 3, from: 2 },
    },
    // ---- 5 · Nilai a² + 2b ----
    {
      ch: 5,
      cap: 'Masukkan $a=-1$ dan $b=4$. Hasilnya $a^2+2b=(-1)^2+2(4)=1+8=9$.',
      visual: plane(ALL),
      board: { title: 'Nilai a² + 2b', pins: ['pab'], list: 'LN', upTo: 3, from: 0 },
    },
    {
      ch: 5,
      cap: 'Jadi $a^2+2b=9$, yaitu pilihan C.',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Nilai a² + 2b', pins: ['pab'], list: 'LN', upTo: 4, from: 3 },
    },
    // tawaran cara aljabar (opsional): Ya masuk Bagian 6, Tidak/Lewati langsung ke Bagian 7
    {
      ch: 5,
      cap: 'Mau lihat cara aljabarnya, dengan $\\overrightarrow{BC}=C-B$ dan pemeriksaan panjang kedua kaki?',
      visual: plane(ALL),
      board: { title: 'Nilai a² + 2b', pins: ['pab'], list: 'LN', upTo: 4, from: 4 },
      branch: { yes: 'Ya, lihat cara aljabar' },
    },
    // ---- 6 · Cara aljabar (opsional) ----
    {
      ch: 6,
      cap: 'Vektor antara dua titik sama dengan ujung dikurangi pangkal. $\\overrightarrow{BC}=C-B=(5-6,\\ 4-0)=(-1,4)$.',
      visual: plane(ALL),
      board: { title: 'Cara aljabar', pins: ['pD', 'pC'], list: 'LA', upTo: 2, from: 0 },
    },
    {
      ch: 6,
      cap: 'Periksa panjang kaki. $|\\overrightarrow{AD}|$ dan $|\\overrightarrow{BC}|$ sama-sama $\\sqrt{17}$, jadi trapesiumnya memang sama kaki.',
      visual: plane(ALL),
      board: { title: 'Cara aljabar', pins: ['pD', 'pC'], list: 'LA', upTo: 4, from: 2 },
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
      cap: 'Cocokkan dengan pilihan. Hasilnya $a^2+2b=9$; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pab'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'w1',
        q: 'Nilai $a^2+2b$ adalah…',
        letters: true,
        win: 'Jawabannya <b>C</b>.',
        opts: [
          { tex: '5', hint: '$(-1)^2+2(4)=1+8$, bukan $5$.' },
          { tex: '7', hint: '$2b=2\\cdot4=8$, jadi hasilnya $1+8$.' },
          { tex: '9', ok: true },
          { tex: '10', hint: '$(-1)^2=1$, bukan $2$.' },
          { tex: '13', hint: 'Hasilnya $1+8=9$.' },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">C</span><span>$\\overrightarrow{BC}=(-1,4)$, sehingga $a^2+2b=1+8=\\mathbf{9}$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    { label: 'A', statement: '$5$', ok: false, formula: '5\\ne9', why: 'Tidak sama dengan $(-1)^2+2(4)=9$.' },
    { label: 'B', statement: '$7$', ok: false, formula: '7\\ne9', why: 'Tidak sama dengan $9$.' },
    { label: 'C', statement: '$9$', ok: true, formula: '1+8=9', why: '$a^2+2b=1+8=9$.' },
    { label: 'D', statement: '$10$', ok: false, formula: '10\\ne9', why: 'Tidak sama dengan $9$.' },
    { label: 'E', statement: '$13$', ok: false, formula: '13\\ne9', why: 'Tidak sama dengan $9$.' },
  ],
  notes: {
    title: 'Pembahasan Soal 13: Trapesium Sama Kaki',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Vektor',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Gambar titik',
        lists: ['LG'],
        sketch: 'trap13',
        why: 'Karena $A$ di titik asal, ujung vektor $\\overrightarrow{AB}$ dan $\\overrightarrow{AD}$ langsung menjadi titik $B$ dan $D$.',
      },
      {
        title: 'Titik C',
        lists: ['LC'],
        why: 'Trapesium sama kaki simetris terhadap garis tegak di tengah alasnya, dan sisi atas $DC$ sejajar alas $AB$.',
      },
      { title: 'Vektor BC', lists: ['LV'] },
      { title: 'Nilai a² + 2b', lists: ['LN'] },
      { title: 'Cara aljabar (opsional)', lists: ['LA'] },
    ],
    answer: 'Jawaban: <b>C</b>, $a^2+2b=9$ (dengan $a=-1$, $b=4$).',
  },
  done: { seal: 'C', message: '$\\overrightarrow{BC}=(-1,4)$, sehingga $a^2+2b=1+8=\\mathbf{9}$.' },
  key: {
    answer: 'C',
    cardOk: [false, false, true, false, false],
    goldRows: ['n3', 'n4', 'w1', 'r1', 'r2'],
  },
  authorNotes: [
    'Ditulis ulang dengan gaya pemilik (v1.47): logika gambar dulu. Titik B dan D dibaca langsung dari vektor karena A di titik asal; C dari simetri trapesium sama kaki (garis x = 3), lalu vektor BC dibaca sebagai langkah di kisi.',
    'Pertanyaan dokumen "Kenapa C di y = 4?" dipertahankan. Kesalahan umum dokumen (BC = AD = (1, 4)) ditampilkan sebagai jebakan C′(7, 4) yang membentuk jajargenjang.',
    'Cara aljabar dokumen (BC = C − B dan |AD| = |BC| = √17) menjadi bagian opsional. Tanpa simbol ":" di baris papan.',
  ],
};

export default q13;
