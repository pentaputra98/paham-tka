/**
 * SOAL 25 — Limit Trigonometri (pilot mesin papan, PRD §5.1).
 * Sumber: docs/pembahasan25.md bagian "SOAL 25" dan docs/soal25.md no. 25. Kunci: E (3/2).
 * Baris/teks yang tidak tertulis di dokumen ditandai di `authorNotes` dan ditambahkan serempak ke dokumen.
 */
import { getSoal } from '../index';
import { F, H, O, T } from '../../engine/dsl';
import type { SoalContent } from '../../engine/types';

const q25: SoalContent = {
  meta: getSoal(25)!,
  sourceRef: 'docs/pembahasan25.md#soal-25',
  paper: {
    // stabilo: pembilang (merah), faktor (biru), sin (merah), x→3 (biru), nilai limit (emas)
    html: `<p><span class="hl hl-gold" data-hl="1" data-src="s-tanya">Nilai</span></p>
<div class="soal-math">$$\\lim_{\\htmlClass{hl hl-blue}{\\htmlData{src=s-x3, hl=2}{x\\rightarrow3}}}\\frac{\\htmlClass{hl hl-red}{\\htmlData{src=s-pem, hl=2}{1-\\cos(6x-18)}}}{\\htmlClass{hl hl-blue}{\\htmlData{src=s-faktor, hl=1}{\\left(x-\\frac{9}{x}\\right)}}\\htmlClass{hl hl-red}{\\htmlData{src=s-sin, hl=2}{\\sin(6x-18)}}}=\\ldots$$</div>
<ol class="abc">
<li><span>A.</span>$-\\frac{3}{2}$</li><li><span>B.</span>$-\\frac{2}{3}$</li><li><span>C.</span>$0$</li>
<li><span>D.</span>$\\frac{2}{3}$</li><li><span>E.</span>$\\frac{3}{2}$</li>
</ol>`,
    srcNames: ['s-tanya', 's-x3', 's-pem', 's-faktor', 's-sin'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Limit trigonometri',
    titleLines: ['Pembahasan Soal', 'Limit <span class="accent">Trigonometri</span>', 'x → 3'],
    lede: 'Pembilang dan penyebut sama-sama menjadi nol di $x=3$. Dengan identitas sudut ganda dan faktorisasi, bentuk $\\frac00$ bisa dipecahkan.',
    facts: [
      { dt: 'Titik limit', dd: 'x = 3' },
      { dt: 'Bentuk', dd: '0/0' },
      { dt: 'Sudut', dd: '6x − 18' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Menyederhanakan trigonometri', d: '(1 − cos 6u) / sin 6u = tan 3u' },
    { t: 'Faktor x − 9/x', d: 'x − 9/x = u(x + 3)/x' },
    { t: 'Menghitung limit', d: '3 · ½ = 3/2' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan dengan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban E' },
  ],
  pins: {
    pu: { id: 'pu', toks: [T('Pu1', 'u'), O('Pu2', '='), T('Pu3', 'x-3')] },
    ptan: {
      id: 'ptan',
      toks: [T('Pt1', '\\dfrac{1-\\cos 6u}{\\sin 6u}'), O('Pt2', '='), T('Pt3', '\\tan 3u')],
    },
    pd3: {
      id: 'pd3',
      toks: [T('Pd1', '\\dfrac{\\tan 3u}{u}'), O('Pd2', '\\cdot'), T('Pd3', '\\dfrac{x}{x+3}')],
    },
    pres: { id: 'pres', gold: true, toks: [T('Pr1', '\\text{limit}'), O('Pr2', '='), T('Pr3', '\\dfrac32')] },
  },
  lists: {
    // Bagian 1 — ditulis dari teks soal dan pop-up 1.2 (lihat authorNotes)
    L1: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      { id: 'k2', toks: [T('k2a', 'x\\to3', '', '@s-x3')], note: 'titik limit' },
      { id: 'k3', toks: [T('k3a', '1-\\cos(6x-18)', '', '@s-pem')], note: 'pembilang' },
      {
        id: 'k4',
        toks: [
          T('k4a', '\\left(x-\\frac{9}{x}\\right)', '', '@s-faktor'),
          T('k4b', '\\sin(6x-18)', '', '@s-sin'),
        ],
        note: 'penyebut',
      },
      { id: 'k5', toks: [H('k5a', 'Ditanya', 'lbl'), H('k5b', 'nilai limit', 'gold', '@s-tanya')] },
      { id: 'k6', toks: [T('k6a', '1-\\cos 0'), O('k6b', '='), T('k6c', '0')], note: 'pembilang di $x=3$' },
      { id: 'k7', toks: [T('k7a', '(3-3)\\sin 0'), O('k7b', '='), T('k7c', '0')], note: 'penyebut di $x=3$' },
      {
        id: 'k8',
        toks: [T('k8a', '\\dfrac{0}{0}', 'red')],
        note: 'bentuk tak tentu, perlu disederhanakan',
        box: 'navy',
      },
    ],
    // Bagian 2 — docs a1–a2, b1–b4
    L2: [
      {
        id: 'a1',
        toks: [T('a1a', 'u'), O('a1b', '='), T('a1c', 'x-3')],
        note: '$x\\to3\\Rightarrow u\\to0$',
      },
      {
        id: 'a2',
        toks: [
          T('a2a', '6x-18', '', '@s-pem'),
          O('a2b', '='),
          T('a2c', '6('),
          T('a2d', 'x-3', '', 'a1c'),
          T('a2e', ')'),
          O('a2f', '='),
          T('a2g', '6u'),
        ],
        note: 'sudut menjadi $6u$',
        box: 'navy',
      },
      {
        id: 'b1',
        toks: [
          T('b1a', '1-\\cos'),
          T('b1b', '6u', '', 'a2g'),
          O('b1c', '='),
          T('b1d', '1-\\cos 2(3u)'),
          O('b1e', '='),
          T('b1f', '2\\sin^2 3u'),
        ],
        note: '$1-\\cos2\\alpha=2\\sin^2\\alpha$, $\\alpha=3u$',
      },
      {
        id: 'b2',
        toks: [T('b2a', '\\sin'), T('b2b', '6u', '', 'a2g'), O('b2c', '='), T('b2d', '2\\sin 3u\\cos 3u')],
        note: '$\\sin2\\alpha=2\\sin\\alpha\\cos\\alpha$',
      },
      {
        id: 'b3',
        toks: [
          F([T('b3a', '1-\\cos 6u')], [T('b3b', '\\sin 6u')]),
          O('b3c', '='),
          F([T('b3d', '2\\sin^2 3u', '', 'b1f')], [T('b3e', '2\\sin 3u\\cos 3u', '', 'b2d')]),
        ],
      },
      {
        id: 'b4',
        toks: [
          O('b4a', '='),
          F([T('b4b', '\\sin 3u')], [T('b4c', '\\cos 3u')]),
          O('b4d', '='),
          T('b4e', '\\tan 3u'),
        ],
        note: '2 dan satu $\\sin3u$ dicoret',
        box: 'navy',
      },
    ],
    // Bagian 3 — docs c1–c3, d1–d3
    L3: [
      {
        id: 'c1',
        toks: [
          T('c1a', 'x-\\frac{9}{x}', '', '@s-faktor'),
          O('c1b', '='),
          F([T('c1c', 'x^2-9')], [T('c1d', 'x')]),
        ],
        note: 'samakan penyebut',
      },
      {
        id: 'c2',
        toks: [O('c2a', '='), F([T('c2b', '(x-3)(x+3)')], [T('c2c', 'x', '', 'c1d')])],
        note: '$x^2-9=(x-3)(x+3)$',
      },
      {
        id: 'c3',
        toks: [O('c3a', '='), F([T('c3b', 'u', '', 'Pu1'), T('c3c', '(x+3)')], [T('c3d', 'x', '', 'c2c')])],
        note: '$x-3=u$',
        box: 'navy',
      },
      {
        id: 'd1',
        toks: [
          H('d1a', 'bentuk soal', 'tx'),
          O('d1b', '='),
          F(
            [T('d1c', '1-\\cos 6u')],
            [T('d1d', '\\left(x-\\frac{9}{x}\\right)', '', 'c1a'), T('d1e', '\\sin 6u')],
          ),
        ],
      },
      {
        id: 'd2',
        toks: [O('d2a', '='), F([T('d2b', '\\tan 3u', '', 'Pt3')], [T('d2c', '\\dfrac{u(x+3)}{x}')])],
      },
      {
        id: 'd3',
        toks: [
          O('d3a', '='),
          T('d3b', '\\dfrac{\\tan 3u}{u}'),
          O('d3c', '\\cdot'),
          T('d3d', '\\dfrac{x}{x+3}'),
        ],
        note: 'bagi dengan pecahan = kali kebalikan',
        box: 'navy',
      },
    ],
    // Bagian 4 — docs e1–e3
    L4: [
      {
        id: 'e1',
        toks: [
          T('e1a', '\\displaystyle\\lim_{u\\to0}'),
          T('e1b', '\\dfrac{\\tan 3u}{u}', '', 'Pd1'),
          O('e1c', '='),
          T('e1d', '3'),
        ],
        note: '$\\lim\\frac{\\tan au}{u}=a$',
        box: 'navy',
      },
      {
        id: 'e2',
        toks: [
          T('e2a', '\\displaystyle\\lim_{x\\to3}'),
          T('e2b', '\\dfrac{x}{x+3}', '', 'Pd3'),
          O('e2c', '='),
          F([T('e2d', '3')], [T('e2e', '3+3')]),
          O('e2f', '='),
          T('e2g', '\\dfrac12'),
        ],
        note: 'substitusi langsung',
        box: 'navy',
      },
      {
        id: 'e3',
        toks: [
          H('e3a', 'limit', 'tx'),
          O('e3b', '='),
          T('e3c', '3', '', 'e1d'),
          O('e3d', '\\cdot'),
          T('e3e', '\\dfrac12', '', 'e2g'),
          O('e3f', '='),
          T('e3g', '\\dfrac32', 'gold'),
        ],
        box: 'gold',
      },
    ],
    // Bagian 6 — kartu A–E (docs) di papan
    L6: [
      {
        id: 's1',
        toks: [
          T('s1a', '\\text{A}', 'sp'),
          T('s1b', '-\\tfrac32 \\ne \\tfrac32', '', 'Pr3'),
          T('s1c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's2',
        toks: [
          T('s2a', '\\text{B}', 'sp'),
          T('s2b', '-\\tfrac23 \\ne \\tfrac32', '', 'Pr3'),
          T('s2c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's3',
        toks: [
          T('s3a', '\\text{C}', 'sp'),
          T('s3b', '0 \\ne \\tfrac32', '', 'Pr3'),
          T('s3c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's4',
        toks: [
          T('s4a', '\\text{D}', 'sp'),
          T('s4b', '\\tfrac23 \\ne \\tfrac32', '', 'Pr3'),
          T('s4c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's5',
        toks: [
          T('s5a', '\\text{E}', 'sp'),
          T('s5b', '\\tfrac32 = \\tfrac32', '', 'Pr3'),
          T('s5c', '\\;\\checkmark', 'gold'),
        ],
        note: '<b class="k-gold">BENAR</b>',
      },
      {
        id: 's6',
        toks: [H('s6a', 'Jawaban', 'lbl'), T('s6b', '\\textbf{E}'), T('s6c', '\\;\\tfrac32')],
        box: 'gold',
      },
    ],
    // Bagian 7 — ringkasan
    LR: [
      { id: 'r1', toks: [T('r1a', '\\dfrac{1-\\cos 6u}{\\sin 6u}=\\tan 3u')], note: 'identitas sudut ganda' },
      { id: 'r2', toks: [T('r2a', 'x-\\frac{9}{x}=\\dfrac{u(x+3)}{x}')], note: 'faktor selisih kuadrat' },
      { id: 'r3', toks: [T('r3a', '\\text{limit}=3\\cdot\\tfrac12=\\tfrac32')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Baca limitnya dengan teliti. Faktornya adalah $x-\\frac{9}{x}$ (bukan $\\frac{x-9}{x}$).',
      visual: { kind: 'soal', hl: 1, focus: '@s-faktor' },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 5, from: 0 },
    },
    {
      ch: 1,
      cap: 'Substitusi $x=3$: pembilang $1-\\cos0=0$ dan penyebut $\\left(3-3\\right)\\sin0=0$. Bentuknya $\\frac00$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 8, from: 5 },
    },
    // ---- 2 · Menyederhanakan bentuk trigonometri ----
    {
      ch: 2,
      cap: 'Misalkan $u=x-3$. Maka $x\\to3$ berarti $u\\to0$, dan $6x-18=6u$.',
      visual: { kind: 'soal', hl: 2, focus: '@s-pem' },
      board: { title: 'Menyederhanakan trigonometri', list: 'L2', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Tulis $6u=2(3u)$, lalu pakai identitas sudut ganda.',
      visual: { kind: 'soal', hl: 2, focus: '@s-pem' },
      board: { title: 'Menyederhanakan trigonometri', list: 'L2', upTo: 6, from: 2 },
      ask: {
        before: 'b4',
        q: 'Setelah mencoret, $\\dfrac{2\\sin^23u}{2\\sin3u\\cos3u}$ menjadi…',
        opts: [
          { tex: '\\tan 3u', ok: true },
          {
            tex: '\\cot 3u',
            hint: 'Yang tersisa di pembilang adalah $\\sin3u$ dan di penyebut $\\cos3u$: $\\frac{\\sin}{\\cos}=\\tan$.',
          },
          { tex: '\\sin 3u', hint: 'Penyebut masih menyisakan $\\cos3u$, belum hilang.' },
        ],
      },
    },
    // ---- 3 · Faktor x − 9/x ----
    {
      ch: 3,
      cap: 'Samakan penyebut $x-\\frac9x$ lalu faktorkan selisih kuadrat.',
      visual: { kind: 'soal', hl: 2, focus: '@s-faktor' },
      board: { title: 'Faktor x − 9/x', pins: ['pu', 'ptan'], list: 'L3', upTo: 3, from: 0 },
    },
    {
      ch: 3,
      cap: 'Gabungkan kedua hasil: bagian trigonometri menjadi $\\tan3u$ dan faktornya memberi $u$ di penyebut.',
      visual: { kind: 'soal', hl: 2, focus: '@s-faktor' },
      board: { title: 'Faktor x − 9/x', pins: ['pu', 'ptan'], list: 'L3', upTo: 6, from: 3 },
    },
    // ---- 4 · Menghitung limit ----
    {
      ch: 4,
      cap: 'Pakai limit dasar $\\lim_{u\\to0}\\frac{\\tan au}{u}=a$ untuk bagian pertama.',
      visual: { kind: 'soal', hl: 2, focus: '@s-x3' },
      board: { title: 'Menghitung limit', pins: ['pd3'], list: 'L4', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Substitusi $x=3$ pada bagian kedua, lalu kalikan kedua hasil.',
      visual: { kind: 'soal', hl: 2, focus: '@s-x3' },
      board: { title: 'Menghitung limit', pins: ['pd3'], list: 'L4', upTo: 3, from: 1 },
      ask: {
        before: 'e2',
        q: 'Hasil $\\displaystyle\\lim_{x\\to3}\\dfrac{x}{x+3}$ adalah…',
        opts: [
          { tex: '\\tfrac12', ok: true },
          { tex: '1', hint: '$\\frac{3}{3+3}=\\frac36$, bukan $\\frac33$. Penyebutnya $x+3=6$.' },
          { tex: '0', hint: 'Penyebut dan pembilang tidak nol di $x=3$ untuk bentuk ini.' },
        ],
      },
      optional: {
        label: 'Tabel nilai di sekitar x = 3',
        yes: 'Ya, periksa dengan tabel',
        panel: `<p>Nilai fungsi soal dihitung di dekat $x=3$ (dari kiri dan kanan):</p>
<table class="n-table num"><thead><tr><th scope="col">$x$</th><th scope="col">nilai fungsi</th></tr></thead>
<tbody><tr><td>2,999</td><td>≈ 1,4998</td></tr><tr><td>3,001</td><td>≈ 1,5003</td></tr></tbody></table>
<p>Keduanya mengapit $1{,}5=\\frac32$. Hasil hitungan kita benar.</p>`,
      },
    },
    // ---- 5 · Catatan lengkap ----
    {
      ch: 5,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 6 · Cocokkan dengan pilihan (kartu A–E) ----
    {
      ch: 6,
      cap: 'Hasil kita $\\frac32$. Sekarang cocokkan dengan kelima pilihan.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pres'], list: 'L6', upTo: 0, from: 0 },
    },
    {
      ch: 6,
      cap: 'Pilihan A, $-\\frac32$: tandanya seharusnya positif. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pres'], list: 'L6', upTo: 1, from: 0 },
    },
    {
      ch: 6,
      cap: 'Pilihan B, $-\\frac23$: kebalikan dan tandanya keliru. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pres'], list: 'L6', upTo: 2, from: 1 },
    },
    {
      ch: 6,
      cap: 'Pilihan C, $0$: limitnya bukan nol, karena $\\tan3u$ sebanding dengan $3u$ dan $u$ saling menghilang. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pres'], list: 'L6', upTo: 3, from: 2 },
    },
    {
      ch: 6,
      cap: 'Pilihan D, $\\frac23$: jebakan, ini kebalikan hasilnya. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 4 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pres'], list: 'L6', upTo: 4, from: 3 },
    },
    {
      ch: 6,
      cap: 'Pilihan E, $\\frac32=3\\cdot\\frac12$, sama dengan hasil kita (<b class="k-gold">benar</b>). Pilih jawabannya di papan tulis.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pres'], list: 'L6', upTo: 6, from: 4 },
      ask: {
        before: 's6',
        q: 'Jawaban yang tepat adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>E</b>.',
        opts: [
          { tex: '-\\tfrac32', hint: 'Tandanya seharusnya positif.' },
          { tex: '-\\tfrac23', hint: 'Kebalikan dan tandanya keliru.' },
          { tex: '0', hint: 'Limitnya bukan nol: $\\frac{\\tan3u}{u}\\to3$.' },
          { tex: '\\tfrac23', hint: 'Itu kebalikan hasilnya. Hasil kita $3\\cdot\\frac12$.' },
          { tex: '\\tfrac32', ok: true },
        ],
      },
    },
    // ---- 7 · Selesai ----
    {
      ch: 7,
      cap: '<span class="verdict"><span class="seal">E</span><span>Identitas sudut ganda mengubah bagian trigonometri menjadi $\\tan3u$, faktor $x-\\frac9x$ memberi $u$ di penyebut, dan hasilnya $3\\cdot\\frac12=\\frac32$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: '$-\\frac{3}{2}$',
      ok: false,
      formula: '-\\tfrac32 \\ne \\tfrac32',
      why: 'Tanda seharusnya positif.',
    },
    {
      label: 'B',
      statement: '$-\\frac{2}{3}$',
      ok: false,
      formula: '-\\tfrac23 \\ne \\tfrac32',
      why: 'Kebalikan dan tanda keliru.',
    },
    {
      label: 'C',
      statement: '$0$',
      ok: false,
      formula: '0 \\ne \\tfrac32',
      why: 'Limit bukan nol karena $\\tan3u\\sim3u$ dan $u$ saling menghilang.',
    },
    {
      label: 'D',
      statement: '$\\frac{2}{3}$',
      ok: false,
      formula: '\\tfrac23 \\ne \\tfrac32',
      why: 'Jebakan: kebalikan hasil.',
    },
    {
      label: 'E',
      statement: '$\\frac{3}{2}$',
      ok: true,
      formula: '3\\cdot\\tfrac12=\\tfrac32',
      why: '$3\\cdot\\frac12$.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 25: Limit Trigonometri',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Limit trigonometri',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Menyederhanakan bentuk trigonometri',
        lists: ['L2'],
        why: 'Identitas: $1-\\cos2\\alpha=2\\sin^2\\alpha$ dan $\\sin2\\alpha=2\\sin\\alpha\\cos\\alpha$.',
      },
      { title: 'Faktor $x-\\frac9x$', lists: ['L3'] },
      {
        title: 'Menghitung limit',
        lists: ['L4'],
        why: 'Limit dasar: $\\lim_{u\\to0}\\frac{\\tan au}{u}=a$.',
      },
    ],
    answer: 'Jawaban: <b>E</b>, nilai limitnya $\\frac32$.',
  },
  done: {
    seal: 'E',
    message:
      'Identitas sudut ganda mengubah bagian trigonometri menjadi $\\tan3u$, faktor $x-\\frac9x$ memberi $u$ di penyebut, dan hasilnya $3\\cdot\\frac12=\\frac32$.',
  },
  key: { answer: 'E', cardOk: [false, false, false, false, true], goldRows: ['e3', 's6', 'r3'] },
  authorNotes: [
    'Bagian 1: baris papan k1–k8 disusun dari teks soal dan pop-up 1.2 (disetujui Pak Penta, 19 Okt 2026).',
    'Bagian 3 langkah 3.2, Bagian 4, Bagian 6 (pop-up per kartu dan pertanyaan pilih jawaban): teks pop-up disusun dari baris dan kartu dokumen.',
    'Bagian 4: pertanyaan cepat dipindah dari "sebelum e3" ke "sebelum e2" karena yang ditanyakan adalah isi baris e2 (dicatat serempak di dokumen).',
    'Bagian 4: tabel nilai opsional memakai angka "Pemeriksaan hasil" dokumen (x = 2,999 dan 3,001).',
  ],
};

export default q25;
