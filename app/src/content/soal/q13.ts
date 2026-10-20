/**
 * SOAL 13 — Trapesium Sama Kaki (vektor di bidang; pilihan tunggal).
 * Sumber: docs/pembahasan25.md "SOAL 13", docs/soal25.md no. 13. Kunci: C (a² + 2b = 9; a = −1, b = 4).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Trap13Stage } from '../../visuals/trap13';
import { getSoal } from '../index';

const plane = (stage: Trap13Stage): Visual => ({ kind: 'svg', scene: 'trap13', state: { stage } });
const col = (a: string, b: string): string => `\\begin{pmatrix}${a}\\\\${b}\\end{pmatrix}`;

const q13: SoalContent = {
  meta: getSoal(13)!,
  sourceRef: 'docs/pembahasan25.md#soal-13',
  paper: {
    html: `<p>Diketahui trapesium sama kaki ABCD dengan <span class="hl hl-blue" data-hl="1"><span data-src="s-kaki">$AD=BC$</span></span> dan titik <span class="hl hl-red" data-hl="2"><span data-src="s-A">$A(0, 0)$</span></span>. Vektor-vektor posisi pembentuk trapesium adalah <span class="hl hl-red" data-hl="2"><span data-src="s-AD">$\\vec{AD}=${col('1', '4')}$</span></span>, <span class="hl hl-red" data-hl="2"><span data-src="s-AB">$\\vec{AB}=${col('6', '0')}$</span></span> dan <span class="hl hl-blue" data-hl="2"><span data-src="s-BC">$\\vec{BC}=${col('a', 'b')}$</span></span>.</p>
<p>Nilai dari <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">$a^{2}+2b$</span></span>$=....$</p>
<ol class="abc">
<li><span>A.</span>5</li><li><span>B.</span>7</li><li><span>C.</span>9</li><li><span>D.</span>10</li><li><span>E.</span>13</li>
</ol>`,
    srcNames: ['s-kaki', 's-A', 's-AD', 's-AB', 's-BC', 's-tanya'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Vektor',
    titleLines: ['Pembahasan Soal', 'Trapesium <span class="accent">Sama Kaki</span>', 'Vektor'],
    lede: 'Tiga vektor membentuk trapesium sama kaki $ABCD$ dengan $A$ di titik asal. Cari komponen $\\vec{BC}$.',
    facts: [
      { dt: 'AD', dd: '(1, 4)' },
      { dt: 'AB', dd: '(6, 0)' },
      { dt: 'Dicari', dd: 'a² + 2b' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Menentukan titik-titik', d: 'C = (5, 4), BC = (−1, 4)' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan dengan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban C' },
  ],
  pins: {
    pB: { id: 'pB', toks: [T('PB1', 'B'), O('PB2', '='), T('PB3', '(6,0)')] },
    pD: { id: 'pD', toks: [T('PD1', 'D'), O('PD2', '='), T('PD3', '(1,4)')] },
    pAD: { id: 'pAD', toks: [T('PA1', '\\vec{AD}'), O('PA2', '='), T('PA3', '(1,4)')] },
    pBC: { id: 'pBC', toks: [T('PC1', '\\vec{BC}'), O('PC2', '='), T('PC3', '(-1,4)')] },
    pab: { id: 'pab', gold: true, toks: [T('Pq1', 'a=-1'), O('Pq2', ','), T('Pq3', 'b=4')] },
  },
  lists: {
    L1: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      {
        id: 'k2',
        toks: [T('k2a', 'AD=BC', 'blue', '@s-kaki')],
        note: 'kaki trapesium sama panjang',
      },
      { id: 'k3', toks: [T('k3a', 'A(0,0)', 'red', '@s-A')], note: 'titik asal' },
      {
        id: 'k4',
        toks: [
          T('k4a', `\\vec{AD}=${col('1', '4')}`, 'red', '@s-AD'),
          O('k4b', ','),
          T('k4c', `\\vec{AB}=${col('6', '0')}`, 'red', '@s-AB'),
        ],
      },
      { id: 'k5', toks: [T('k5a', `\\vec{BC}=${col('a', 'b')}`, 'blue', '@s-BC')] },
      { id: 'k6', toks: [H('k6a', 'Ditanya', 'lbl'), T('k6b', 'a^2+2b', 'gold', '@s-tanya')] },
    ],
    L2: [
      {
        id: 'a1',
        toks: [
          T('a1a', 'B'),
          O('a1b', '='),
          T('a1c', 'A+\\vec{AB}'),
          O('a1d', '='),
          T('a1e', '(0,0)+'),
          T('a1f', '(6,0)', 'red', '@s-AB'),
        ],
      },
      { id: 'a2', toks: [T('a2a', 'B'), O('a2b', '='), T('a2c', '(6,0)', 'blue')], box: 'navy' },
      {
        id: 'a3',
        toks: [
          T('a3a', 'D'),
          O('a3b', '='),
          T('a3c', 'A+\\vec{AD}'),
          O('a3d', '='),
          T('a3e', '(0,0)+'),
          T('a3f', '(1,4)', 'red', '@s-AD'),
        ],
      },
      { id: 'a4', toks: [T('a4a', 'D'), O('a4b', '='), T('a4c', '(1,4)', 'blue')], box: 'navy' },
    ],
    L2b: [
      {
        id: 'b1',
        toks: [
          H('b1a', 'titik tengah <i>AB</i>', 'tx'),
          O('b1b', ':'),
          T('b1c', 'x='),
          T('b1d', '\\dfrac{0+6}{2}', '', 'PB3'),
          O('b1e', '='),
          T('b1f', '3'),
        ],
        note: 'sumbu simetri $x=3$',
      },
      {
        id: 'b2',
        toks: [T('b2a', 'D=(1,4)', '', 'PD3'), H('b2b', 'dicerminkan terhadap', 'tx'), T('b2c', 'x=3')],
        note: '$1\\to3+(3-1)=5$',
      },
      {
        id: 'b3',
        toks: [T('b3a', 'C'), O('b3b', '='), T('b3c', '(5,4)', 'blue')],
        note: 'tinggi tetap $4$',
        box: 'navy',
      },
      {
        id: 'b4',
        toks: [
          T('b4a', '\\vec{BC}'),
          O('b4b', '='),
          T('b4c', 'C', '', 'b3c'),
          O('b4d', '-'),
          T('b4e', 'B', '', 'PB3'),
          O('b4f', '='),
          T('b4g', '(5-6,\\ 4-0)'),
        ],
      },
      {
        id: 'b5',
        toks: [T('b5a', '\\vec{BC}'), O('b5b', '='), T('b5c', '(-1,\\ 4)', 'gold')],
        note: '$a=-1$, $b=4$',
        box: 'gold',
      },
    ],
    L2c: [
      {
        id: 'c1',
        toks: [
          T('c1a', '\\lvert\\vec{AD}\\rvert', '', 'PA3'),
          O('c1b', '='),
          T('c1c', '\\sqrt{1^2+4^2}'),
          O('c1d', '='),
          T('c1e', '\\sqrt{17}'),
        ],
      },
      {
        id: 'c2',
        toks: [
          T('c2a', '\\lvert\\vec{BC}\\rvert', '', 'PC3'),
          O('c2b', '='),
          T('c2c', '\\sqrt{(-1)^2+4^2}'),
          O('c2d', '='),
          T('c2e', '\\sqrt{17}', 'blue'),
        ],
        note: 'sama panjang',
        box: 'navy',
      },
      {
        id: 'd1',
        toks: [T('d1a', 'a^2+2b'), O('d1b', '='), T('d1c', '(-1)^2', '', 'PC3'), T('d1d', '+2(4)')],
      },
      { id: 'd2', toks: [T('d2a', 'a^2+2b'), O('d2b', '='), T('d2c', '1+8')], note: '$(-1)^2=1$' },
      { id: 'd3', toks: [T('d3a', 'a^2+2b'), O('d3b', '='), T('d3c', '9', 'gold')], box: 'gold' },
    ],
    L4: [
      {
        id: 's1',
        toks: [T('s1a', '\\text{A}', 'sp'), T('s1b', '5\\ne9'), T('s1c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's2',
        toks: [T('s2a', '\\text{B}', 'sp'), T('s2b', '7\\ne9'), T('s2c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's3',
        toks: [T('s3a', '\\text{C}', 'sp'), T('s3b', '1+8=9'), T('s3c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      {
        id: 's4',
        toks: [T('s4a', '\\text{D}', 'sp'), T('s4b', '10\\ne9'), T('s4c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's5',
        toks: [T('s5a', '\\text{E}', 'sp'), T('s5b', '13\\ne9'), T('s5c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's6',
        toks: [H('s6a', 'Jawaban', 'lbl'), T('s6b', '\\textbf{C}'), T('s6c', '\\;9')],
        box: 'gold',
      },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', 'C=(5,4),\\ \\vec{BC}=(-1,4)')], box: 'navy' },
      { id: 'r2', toks: [T('r2a', 'a^2+2b=9')], box: 'gold' },
      { id: 'r3', toks: [H('r3a', 'Jawaban', 'lbl'), T('r3b', '\\textbf{C}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Baca soal. Sisi $AD$ dan $BC$ adalah <b>kaki</b> trapesium (sama panjang).',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 2, from: 0 },
    },
    {
      ch: 1,
      cap: 'Diketahui dua vektor dan titik $A$. <b>Ditanya</b>: $a^2+2b$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 6, from: 2 },
    },
    // ---- 2 · Menentukan titik-titik ----
    {
      ch: 2,
      cap: 'Karena $A$ di titik asal, titik $B$ dan $D$ sama dengan vektor $\\vec{AB}$ dan $\\vec{AD}$.',
      visual: plane('pts'),
      board: { title: 'Titik sudut', list: 'L2', upTo: 4, from: 0 },
    },
    {
      ch: 2,
      cap: 'Alas $AB$ sejajar $DC$ dan bangun simetris terhadap garis $x=3$ (tegak lurus alas melalui titik tengah $AB$).',
      visual: plane('sym'),
      board: { title: 'Titik C dan vektor BC', pins: ['pB', 'pD'], list: 'L2b', upTo: 5, from: 0 },
      ask: {
        before: 'b3',
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
            hint: '$B$ memang di $y=0$, tetapi alasannya adalah sisi $DC$ sejajar sisi $AB$.',
          },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Periksa panjang kedua kaki: $|AD|$ dan $|BC|$.',
      visual: plane('legs'),
      board: { title: 'Kaki dan nilai a² + 2b', pins: ['pAD', 'pBC'], list: 'L2c', upTo: 2, from: 0 },
      optional: {
        label: 'Mengapa bukan a = 1?',
        yes: 'Ya, mengapa bukan (1, 4)?',
        panel: `<p>Syarat panjang saja memberi $a^2+b^2=17$. Agar $DC\\parallel AB$ harus $b=4$, jadi $a=\\pm1$.</p>
<p>Untuk $a=+1$: $C=(7,4)$ dan $\\vec{DC}=(6,0)=\\vec{AB}$, sehingga bangunnya <b>jajargenjang</b>, bukan trapesium sama kaki.</p>
<p>Untuk $a=-1$: $C=(5,4)$, $DC=4\\ne AB=6$, sehingga trapesium sama kaki.</p>
<p>Kebetulan $a^2=1$ pada kedua kasus, jadi $a^2+2b=9$ tidak berubah; tetapi alasan geometrisnya memilih $a=-1$.</p>`,
      },
    },
    {
      ch: 2,
      cap: 'Masukkan $a=-1$ dan $b=4$ ke $a^2+2b$.',
      visual: plane('final'),
      board: { title: 'Kaki dan nilai a² + 2b', pins: ['pAD', 'pBC'], list: 'L2c', upTo: 5, from: 2 },
    },
    // ---- 3 · Catatan lengkap ----
    {
      ch: 3,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 4 · Cocokkan dengan pilihan ----
    {
      ch: 4,
      cap: 'Hasil kita $a=-1$ dan $b=4$, jadi $a^2+2b=9$. Cocokkan dengan kelima pilihan.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pab'], list: 'L4', upTo: 0, from: 0 },
    },
    {
      ch: 4,
      cap: 'Pilihan A, $5$: tidak sama dengan $(-1)^2+2(4)=9$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pab'], list: 'L4', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Pilihan B, $7$: tidak sama dengan $9$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pab'], list: 'L4', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: 'Pilihan C, $9$: $a^2+2b=1+8=9$ (<b class="k-gold">benar</b>).',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pab'], list: 'L4', upTo: 3, from: 2 },
    },
    {
      ch: 4,
      cap: 'Pilihan D, $10$: tidak sama dengan $9$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 4 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pab'], list: 'L4', upTo: 4, from: 3 },
    },
    {
      ch: 4,
      cap: 'Pilihan E, $13$: tidak sama dengan $9$ (<b class="k-red">salah</b>). Pilih jawabannya di papan tulis.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pab'], list: 'L4', upTo: 6, from: 4 },
      ask: {
        before: 's6',
        q: 'Jawaban yang tepat adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>C</b>.',
        opts: [
          { tex: '5', hint: '$(-1)^2+2(4)=1+8$, bukan $5$.' },
          { tex: '7', hint: 'Tidak sama dengan $9$.' },
          { tex: '9', ok: true },
          { tex: '10', hint: 'Tidak sama dengan $9$.' },
          { tex: '13', hint: 'Tidak sama dengan $9$.' },
        ],
      },
    },
    // ---- 5 · Selesai ----
    {
      ch: 5,
      cap: '<span class="verdict"><span class="seal">C</span><span>$\\vec{BC}=(-1,4)$, sehingga $a^2+2b=1+8=\\mathbf{9}$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
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
        title: 'Menentukan titik-titik',
        lists: ['L2', 'L2b', 'L2c'],
        sketch: 'trap13',
        why: 'Vektor antara dua titik: $\\vec{PQ}=Q-P$. Trapesium sama kaki: sepasang sisi sejajar, kedua kaki sama panjang, dan bangun simetris terhadap garis tegak lurus alas melalui titik tengahnya.',
      },
    ],
    answer: 'Jawaban: <b>C</b>, $a^2+2b=9$ (dengan $a=-1$, $b=4$).',
  },
  done: { seal: 'C', message: '$\\vec{BC}=(-1,4)$, sehingga $a^2+2b=1+8=\\mathbf{9}$.' },
  key: {
    answer: 'C',
    cardOk: [false, false, true, false, false],
    goldRows: ['b5', 'd3', 's6', 'r2', 'r3'],
  },
  authorNotes: [
    'Bagian 1: baris k1–k6 disusun dari stabilo dan pop-up 1.1–1.2.',
    'Bagian 2: pin B, D (untuk b1–b4) dan AD, BC (untuk c1–d1) agar angka terbang antar-papan; pop-up 2.4 disusun dari judul langkah.',
    'Bagian 2.3: "Pemeriksaan hasil" dokumen (mengapa bukan a = 1) ditawarkan sebagai konten opsional Ya/Tidak.',
    'Bagian 4: kartu memakai rumus singkat dari kolom alasan; papan ringkasan s1–s6 dan pertanyaan berhuruf A–E.',
  ],
};

export default q13;
