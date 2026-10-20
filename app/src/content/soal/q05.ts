/**
 * SOAL 5 — Titik Potong dengan Sumbu X (akar suku banyak; multi-jawaban).
 * Sumber: docs/pembahasan25.md "SOAL 5", docs/soal25.md no. 5. Kunci: (−2, 0) dan (3, 0).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { CubicState } from '../../visuals/cubic5';
import { getSoal } from '../index';

const graph = (state: CubicState): Visual => ({ kind: 'svg', scene: 'cubic5', state });
const PIN = ['pf'];
const ALL = [1, 2, 3, 4, 5];

const q05: SoalContent = {
  meta: getSoal(5)!,
  sourceRef: 'docs/pembahasan25.md#soal-5',
  paper: {
    html: `<p>Di manakah koordinat titik perpotongan grafik fungsi $\\htmlClass{hl hl-red}{\\htmlData{src=s-f, hl=2}{f(x)=x^{3}+3x^{2}-10x-24}}$ terhadap <span class="hl hl-blue" data-hl="3"><span data-src="s-sx">sumbu X</span></span>?</p>
<p>Pilih pada <span class="hl hl-gold" data-hl="1"><span data-src="s-tanya">semua jawaban benar</span></span>! Jawaban benar lebih dari satu.</p>
<ul class="checks">
<li>$(-2,0)$</li><li>$(-1,0)$</li><li>$(3,0)$</li><li>$(4,0)$</li><li>$(5,0)$</li>
</ul>`,
    srcNames: ['s-f', 's-sx', 's-tanya'],
  },
  visualSrc: ['o-1', 'o-2', 'o-3', 'o-4', 'o-5'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Suku banyak',
    titleLines: ['Pembahasan Soal', 'Akar <span class="accent">Suku Banyak</span>', 'Sumbu X'],
    lede: 'Grafik $f(x)=x^3+3x^2-10x-24$ memotong sumbu X di beberapa titik. Kita cari titik-titik itu dan uji kelima pilihan.',
    facts: [
      { dt: 'Derajat', dd: '3' },
      { dt: 'Kondisi', dd: 'y = 0' },
      { dt: 'Dicari', dd: 'titik potong sumbu X' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Titik potong berarti f(x) = 0', d: 'Uji kelima pilihan' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Analisis pilihan', d: '5 kartu' },
    { t: 'Selesai', d: '(−2, 0) dan (3, 0)' },
  ],
  pins: {
    pf: { id: 'pf', toks: [T('Pf1', 'f(x)'), O('Pf2', '='), T('Pf3', 'x^3+3x^2-10x-24')] },
    pAk: { id: 'pAk', toks: [H('Pa1', 'akar', 'tx'), O('Pa2', '='), T('Pa3', '\\{-4,\\ -2,\\ 3\\}')] },
  },
  lists: {
    L1: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      { id: 'k2', toks: [T('k2a', 'f(x)=x^3+3x^2-10x-24', 'red', '@s-f')] },
      {
        id: 'k3',
        toks: [H('k3a', 'Ditanya', 'lbl'), H('k3b', 'titik potong dengan sumbu X', 'gold', '@s-sx')],
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
        note: 'nilai $x$ itu disebut <b>akar</b>',
        box: 'navy',
      },
    ],
    L2u: [
      {
        id: 'u1',
        toks: [
          T('u1a', 'f('),
          T('u1b', '-2', 'blue', '@o-1'),
          T('u1c', ')'),
          O('u1d', '='),
          T('u1e', '(-2)^3+3(-2)^2-10(-2)-24'),
        ],
        note: 'pilihan $(-2,0)$',
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
      {
        id: 'u3',
        toks: [
          T('u3a', 'f('),
          T('u3b', '-1', 'blue', '@o-2'),
          T('u3c', ')'),
          O('u3d', '='),
          T('u3e', '-1+3+10-24'),
          O('u3f', '='),
          T('u3g', '-12', 'red'),
        ],
        note: 'bukan nol',
      },
      {
        id: 'u4',
        toks: [
          T('u4a', 'f('),
          T('u4b', '3', 'blue', '@o-3'),
          T('u4c', ')'),
          O('u4d', '='),
          T('u4e', '27+27-30-24'),
          O('u4f', '='),
          T('u4g', '0', 'gold'),
        ],
        note: 'nol → titik potong',
        box: 'gold',
      },
      {
        id: 'u5',
        toks: [
          T('u5a', 'f('),
          T('u5b', '4', 'blue', '@o-4'),
          T('u5c', ')'),
          O('u5d', '='),
          T('u5e', '64+48-40-24'),
          O('u5f', '='),
          T('u5g', '48', 'red'),
        ],
        note: 'bukan nol',
      },
      {
        id: 'u6',
        toks: [
          T('u6a', 'f('),
          T('u6b', '5', 'blue', '@o-5'),
          T('u6c', ')'),
          O('u6d', '='),
          T('u6e', '125+75-50-24'),
          O('u6f', '='),
          T('u6g', '126', 'red'),
        ],
        note: 'bukan nol',
      },
    ],
    L2h: [
      {
        id: 'h1',
        toks: [
          H('h1a', 'koefisien', 'tx'),
          T('h1b', '1,\\ 3,\\ -10,\\ -24', '', 'Pf3'),
          H('h1c', 'pembagi', 'tx'),
          T('h1d', 'x=3'),
        ],
      },
      {
        id: 'h2',
        toks: [T('h2a', '1\\to3+3=6\\to-10+18=8\\to-24+24=0')],
        note: 'sisa nol → $(x-3)$ faktor',
        box: 'navy',
      },
      {
        id: 'h3',
        toks: [T('h3a', 'f(x)'), O('h3b', '='), T('h3c', '(x-3)(x^2+6x+8)')],
        note: 'hasil bagi $x^2+6x+8$',
      },
      {
        id: 'h4',
        toks: [T('h4a', 'f(x)'), O('h4b', '='), T('h4c', '(x-3)(x+2)(x+4)')],
        note: '$x^2+6x+8=(x+2)(x+4)$',
        box: 'navy',
      },
      {
        id: 'h5',
        toks: [H('h5a', 'akar', 'tx'), O('h5b', ':'), T('h5c', 'x=3,\\ -2,\\ -4', 'gold')],
        note: '$-4$ tidak ada di pilihan',
        box: 'gold',
      },
    ],
    L4: [
      {
        id: 's1',
        toks: [T('s1a', '(1)', 'sp'), T('s1b', 'f(-2)=0'), T('s1c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      {
        id: 's2',
        toks: [T('s2a', '(2)', 'sp'), T('s2b', 'f(-1)=-12'), T('s2c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's3',
        toks: [T('s3a', '(3)', 'sp'), T('s3b', 'f(3)=0'), T('s3c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      {
        id: 's4',
        toks: [T('s4a', '(4)', 'sp'), T('s4b', 'f(4)=48'), T('s4c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's5',
        toks: [T('s5a', '(5)', 'sp'), T('s5b', 'f(5)=126'), T('s5c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's6',
        toks: [H('s6a', 'Jawaban', 'lbl'), T('s6b', '(-2,0)'), H('s6c', 'dan', 'tx'), T('s6d', '(3,0)')],
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
      cap: 'Baca soal. Jawabannya bisa lebih dari satu.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 0, from: 0 },
    },
    {
      ch: 1,
      cap: 'Yang <b>diketahui</b>: bentuk fungsi $f(x)$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 2, from: 0 },
    },
    {
      ch: 1,
      cap: 'Yang <b>ditanya</b>: titik-titik tempat grafik menyentuh sumbu X.',
      visual: { kind: 'soal', hl: 3 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 3, from: 2 },
    },
    // ---- 2 · f(x) = 0 ----
    {
      ch: 2,
      cap: 'Pada sumbu X, tingginya nol. Jadi kita cari $x$ yang membuat $f(x)=0$.',
      visual: graph({ sx: true, lab: true, pt: 0 }),
      board: { title: 'Titik potong sumbu X', list: 'L2', upTo: 1, from: 0 },
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
      cap: 'Masukkan $x$ tiap pilihan ke $f(x)$. Titik potong hanya jika hasilnya nol.',
      visual: graph({ sx: true, pt: -2, cur: 1, tested: [1] }),
      board: { title: 'Uji pilihan', pins: PIN, list: 'L2u', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Pilihan $(-1,0)$: $f(-1)=-12$. Grafik berada di bawah sumbu X.',
      visual: graph({ sx: true, pt: -1, cur: 2, tested: [1, 2] }),
      board: { title: 'Uji pilihan', pins: PIN, list: 'L2u', upTo: 3, from: 2 },
    },
    {
      ch: 2,
      cap: 'Pilihan $(3,0)$: $f(3)=0$, jadi titik potong.',
      visual: graph({ sx: true, pt: 3, cur: 3, tested: [1, 2, 3] }),
      board: { title: 'Uji pilihan', pins: PIN, list: 'L2u', upTo: 4, from: 3 },
    },
    {
      ch: 2,
      cap: 'Pilihan $(4,0)$: $f(4)=48$, titiknya di atas sumbu X.',
      visual: graph({ sx: true, pt: 4, cur: 4, tested: [1, 2, 3, 4] }),
      board: { title: 'Uji pilihan', pins: PIN, list: 'L2u', upTo: 5, from: 4 },
    },
    {
      ch: 2,
      cap: 'Pilihan $(5,0)$: $f(5)=126$, jauh di atas sumbu X.',
      visual: graph({ sx: true, pt: 5, cur: 5, tested: ALL }),
      board: { title: 'Uji pilihan', pins: PIN, list: 'L2u', upTo: 6, from: 5 },
    },
    {
      ch: 2,
      cap: 'Mau memeriksa dengan faktor? Bagi $f(x)$ dengan $(x-3)$ memakai cara Horner.',
      visual: graph({ sx: true, pt: 3, tested: ALL, roots: true }),
      board: { title: 'Faktorisasi (opsional)', pins: PIN, list: 'L2h', upTo: 0, from: 0 },
      optional: {
        label: 'Faktorisasi dengan Horner',
        yes: 'Ya, periksa',
        panel: `<p>Koefisien $1,\\ 3,\\ -10,\\ -24$ dibagi $x=3$ (Horner):</p>
<table class="n-table num"><tbody><tr><td>$1$</td><td>$3+3=6$</td><td>$-10+18=8$</td><td>$-24+24=0$</td></tr></tbody></table>
<p>Sisa nol, jadi $(x-3)$ faktor: $f(x)=(x-3)(x^2+6x+8)=(x-3)(x+2)(x+4)$.</p>
<p>Akarnya $x=3,\\ -2,\\ -4$. Akar $-4$ tidak ada di pilihan.</p>`,
      },
    },
    // ---- 3 · Catatan lengkap ----
    {
      ch: 3,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 4 · Analisis pilihan (5 kartu) ----
    {
      ch: 4,
      cap: 'Akar $f$ adalah $-4$, $-2$, dan $3$. Sekarang periksa kelima pilihan.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Analisis pilihan', pins: ['pAk'], list: 'L4', upTo: 0, from: 0 },
    },
    {
      ch: 4,
      cap: '(1) $f(-2)=0$: akar $x=-2$ (<b class="k-gold">benar</b>).',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Analisis pilihan', pins: ['pAk'], list: 'L4', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: '(2) $f(-1)=-12$: grafik berada di bawah sumbu X pada $x=-1$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Analisis pilihan', pins: ['pAk'], list: 'L4', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: '(3) $f(3)=0$: akar $x=3$ (<b class="k-gold">benar</b>).',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Analisis pilihan', pins: ['pAk'], list: 'L4', upTo: 3, from: 2 },
    },
    {
      ch: 4,
      cap: '(4) Jebakan: $4$ pembagi $24$ sehingga tampak cocok, padahal $f(4)=48$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 4 },
      board: { title: 'Analisis pilihan', pins: ['pAk'], list: 'L4', upTo: 4, from: 3 },
    },
    {
      ch: 4,
      cap: '(5) $f(5)=126$, jauh di atas sumbu X (<b class="k-red">salah</b>). Pilih kesimpulannya di papan tulis.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Analisis pilihan', pins: ['pAk'], list: 'L4', upTo: 6, from: 4 },
      ask: {
        before: 's6',
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
    // ---- 5 · Selesai ----
    {
      ch: 5,
      cap: '<span class="verdict"><span class="seal">(−2, 0) · (3, 0)</span><span>Grafik memotong sumbu X di $(-2,0)$ dan $(3,0)$ dari pilihan yang ada; titik potong ketiganya adalah $x=-4,\\,-2,\\,3$.</span></span>',
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
        title: 'Titik potong berarti f(x) = 0',
        lists: ['L2', 'L2u'],
        sketch: 'cubic5',
        why: 'Semua titik pada sumbu X punya $y=0$. Jadi titik potong terhadap sumbu X adalah titik $(x,0)$ dengan $f(x)=0$; nilai $x$ itu disebut akar.',
      },
      { title: 'Memeriksa dengan faktorisasi', lists: ['L2h'] },
    ],
    answer: 'Jawaban: <b>$(-2,0)$</b> dan <b>$(3,0)$</b>; akar ketiga $x=-4$ tidak ada di pilihan.',
  },
  done: {
    seal: '(−2, 0) · (3, 0)',
    message:
      'Grafik memotong sumbu X di $(-2,0)$ dan $(3,0)$ dari pilihan yang ada; titik potong ketiganya adalah $x=-4,\\,-2,\\,3$.',
  },
  key: {
    answer: '(-2,0), (3,0)',
    cardOk: [true, false, true, false, false],
    goldRows: ['u2', 'u4', 'h5', 's6', 'r1', 'r2', 'r3'],
  },
  authorNotes: [
    'Bagian 1: baris k1–k3 disusun dari stabilo dan pop-up 1.1–1.3.',
    'Bagian 2: baris z1 ("pada sumbu X, y = 0 ⇒ f(x) = 0") ditambahkan sebagai jawaban pertanyaan cepat 2.1; teks pertanyaan disusun dari pop-up 2.1.',
    'Bagian 2: langkah 2.2 dipecah satu langkah per pilihan; pop-up (−1,0) … (5,0) dari kolom keterangan dan alasan kartu. Chip pilihan pada grafik menjadi sumber terbang o-1…o-5.',
    'Bagian 2.3 (opsional): h1–h5 ditampilkan di panel Ya/Tidak dan di catatan.',
    'Bagian 4: papan ringkasan s1–s6 dan pertanyaan kesimpulan disusun dari kartu.',
  ],
};

export default q05;
