/**
 * SOAL 2 — Pakan Sapi dan Kambing (SPL dua variabel dan invers matriks; pilihan tunggal).
 * Sumber: docs/pembahasan25.md "SOAL 2", docs/soal25.md no. 2, docs/sapi_dan_kambing.png. Kunci: E (3 sapi, 4 kambing).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent } from '../../engine/types';
import { getSoal } from '../index';

/** Gambar asli soal (docs/sapi_dan_kambing.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/sapi_dan_kambing.png', import.meta.url).href;
const PAPER = { kind: 'soal', hl: 2 } as const;
const v = (a: string, b: string): string => `\\begin{pmatrix}${a}\\\\${b}\\end{pmatrix}`;
const m = (a: string, b: string, c: string, d: string): string =>
  `\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}`;
const MINV = m('-\\frac{1}{10}', '\\frac{2}{10}', '1', '-1');
const OPT = {
  A: `${m('-1', '1', '10', '-5')}${v('19', '34')}=${v('15', '20')}`,
  B: `${m('10', '-10', '-1', '2')}${v('38', '34')}=${v('4', '3')}`,
  C: `${m('-\\frac{1}{10}', '\\frac{2}{10}', '1', '-1')}${v('34', '38')}=${v('4', '3')}`,
  D: `${m('-1', '2', '10', '-10')}${v('38', '34')}=${v('3', '4')}`,
  E: `${m('-\\frac{1}{5}', '\\frac{1}{5}', '2', '-1')}${v('19', '34')}=${v('3', '4')}`,
};

/** pernyataan kartu dua baris: perkalian, lalu "= hasil" (muat di kartu sempit) */
const card = (k: keyof typeof OPT): string => {
  const [lhs, rhs] = OPT[k].split('=');
  return `$${lhs}$ $=${rhs}$`;
};

const q02: SoalContent = {
  meta: getSoal(2)!,
  sourceRef: 'docs/pembahasan25.md#soal-2',
  paper: {
    html: `<p>Pak Andi memiliki beberapa sapi dan kambing. Semua hewan ternaknya selalu diberikan pakan berupa campuran rumput gajah dan rumput gamal. Setiap hari, ia selalu menyediakan <span class="hl hl-red" data-hl="1"><span data-src="s-gajah">38 kg rumput gajah</span></span> dan <span class="hl hl-red" data-hl="1"><span data-src="s-gamal">34 kg rumput gamal</span></span> untuk seluruh kambing dan sapi miliknya <span class="hl hl-blue" data-hl="1"><span data-src="s-tanpa">tanpa sisa</span></span>.</p>
<figure class="soal-fig soal-fig-wide"><img src="${fig}" width="918" height="571" alt="Sapi: rumput gajah 10 kg, rumput gamal 10 kg. Kambing: rumput gajah 2 kg, rumput gamal 1 kg." /></figure>
<table class="soal-table"><thead><tr><th scope="col">Sapi</th><th scope="col">Kambing</th></tr></thead>
<tbody><tr><td>Rumput Gajah <span data-src="sg">10 kg</span></td><td>Rumput Gajah <span data-src="kg">2 kg</span></td></tr>
<tr><td>Rumput Gamal <span data-src="sm">10 kg</span></td><td>Rumput Gamal <span data-src="km">1 kg</span></td></tr></tbody></table>
<p>Jika banyaknya sapi dan kambing yang dipelihara oleh Pak Andi berturut-turut adalah <span class="hl hl-blue" data-hl="2"><span data-src="s-xy">$x$ dan $y$</span></span>, maka $\\htmlClass{hl hl-gold}{\\htmlData{src=s-tanya, hl=2}{${v('x', 'y')}}}=....$</p>
<ol class="abc">
<li><span>A.</span>$${OPT.A}$</li><li><span>B.</span>$${OPT.B}$</li><li><span>C.</span>$${OPT.C}$</li>
<li><span>D.</span>$${OPT.D}$</li><li><span>E.</span>$${OPT.E}$</li>
</ol>`,
    srcNames: ['s-gajah', 's-gamal', 's-tanpa', 's-xy', 's-tanya', 'sg', 'sm', 'kg', 'km'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Matriks dan SPL',
    titleLines: ['Pembahasan Soal', 'Sistem <span class="accent">Persamaan</span>', 'Pakan Ternak'],
    lede: 'Pak Andi menyediakan 38 kg rumput gajah dan 34 kg rumput gamal untuk sapi dan kambingnya, tanpa sisa. Berapa ekor sapi dan kambing yang ia pelihara?',
    facts: [
      { dt: 'Rumput gajah', dd: '38 kg' },
      { dt: 'Rumput gamal', dd: '34 kg' },
      { dt: 'Dicari', dd: '(x, y)' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Menyusun persamaan', d: 'Dua persamaan, satu matriks' },
    { t: 'Menyelesaikan dengan invers', d: 'x = 3, y = 4' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan dengan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban E' },
  ],
  pins: {
    pM: { id: 'pM', toks: [T('PM1', 'M'), O('PM2', '='), T('PM3', m('10', '2', '10', '1'))] },
    pMi: { id: 'pMi', toks: [T('PI1', 'M^{-1}'), O('PI2', '='), T('PI3', MINV)] },
    pB: { id: 'pB', toks: [T('PB1', '\\mathbf b'), O('PB2', '='), T('PB3', v('38', '34'))] },
    pXY: { id: 'pXY', gold: true, toks: [T('PX1', v('x', 'y')), O('PX2', '='), T('PX3', v('3', '4'))] },
  },
  lists: {
    L1: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      {
        id: 'k2',
        toks: [
          H('k2a', 'gajah: sapi', 'tx'),
          T('k2b', '10', '', '@sg'),
          H('k2c', 'kambing', 'tx'),
          T('k2d', '2', '', '@kg'),
          H('k2e', 'total', 'tx'),
          T('k2f', '38', 'red', '@s-gajah'),
        ],
        note: 'kg per ekor dan total',
      },
      {
        id: 'k3',
        toks: [
          H('k3a', 'gamal: sapi', 'tx'),
          T('k3b', '10', '', '@sm'),
          H('k3c', 'kambing', 'tx'),
          T('k3d', '1', '', '@km'),
          H('k3e', 'total', 'tx'),
          T('k3f', '34', 'red', '@s-gamal'),
        ],
        note: 'kg per ekor dan total',
      },
      {
        id: 'k4',
        toks: [H('k4a', 'Ditanya', 'lbl'), T('k4b', v('x', 'y'), 'gold', '@s-tanya')],
        note: '$x$ = sapi, $y$ = kambing',
      },
    ],
    L2: [
      {
        id: 'e1',
        toks: [
          T('e1a', '10', '', '@sg'),
          T('e1b', 'x', 'blue', '@s-xy'),
          O('e1c', '+'),
          T('e1d', '2', '', '@kg'),
          T('e1e', 'y', 'blue', '@s-xy'),
          O('e1f', '='),
          T('e1g', '38', 'red', '@s-gajah'),
        ],
        note: 'rumput gajah',
      },
      {
        id: 'e2',
        toks: [
          T('e2a', '10', '', '@sm'),
          T('e2b', 'x', 'blue'),
          O('e2c', '+'),
          T('e2d', '1', '', '@km'),
          T('e2e', 'y', 'blue'),
          O('e2f', '='),
          T('e2g', '34', 'red', '@s-gamal'),
        ],
        note: 'rumput gamal',
      },
      {
        id: 'm1',
        toks: [
          T('m1a', m('10', '2', '10', '1'), '', 'e1a'),
          T('m1b', v('x', 'y'), 'blue'),
          O('m1c', '='),
          T('m1d', v('38', '34'), 'red', 'e1g'),
        ],
        note: 'urutan: gajah di atas, gamal di bawah',
        box: 'navy',
      },
      {
        id: 'm2',
        toks: [T('m2a', 'M', '', 'm1a'), T('m2b', v('x', 'y')), O('m2c', '='), T('m2d', v('38', '34'))],
        note: 'beri nama $M$',
      },
    ],
    L3: [
      {
        id: 'i1',
        toks: [T('i1a', '\\det M'), O('i1b', '='), T('i1c', '10\\cdot1-2\\cdot10', '', 'PM3')],
        note: '$ad-bc$',
      },
      {
        id: 'i2',
        toks: [T('i2a', '\\det M'), O('i2b', '='), T('i2c', '10-20'), O('i2d', '='), T('i2e', '-10', 'blue')],
        note: 'tidak nol',
        box: 'navy',
      },
      {
        id: 'i3',
        toks: [
          T('i3a', 'M^{-1}'),
          O('i3b', '='),
          T('i3c', '\\dfrac{1}{-10}', '', 'i2e'),
          T('i3d', m('1', '-2', '-10', '10')),
        ],
        note: 'tukar $a,d$; ubah tanda $b,c$',
      },
      {
        id: 'i4',
        toks: [T('i4a', 'M^{-1}'), O('i4b', '='), T('i4c', MINV, 'blue')],
        note: 'setiap elemen dibagi $-10$',
        box: 'navy',
      },
    ],
    L3b: [
      {
        id: 's1',
        toks: [
          T('s1a', v('x', 'y')),
          O('s1b', '='),
          T('s1c', 'M^{-1}', '', 'PI1'),
          T('s1d', v('38', '34'), '', 'PB3'),
        ],
      },
      {
        id: 's2',
        toks: [
          T('s2a', 'x'),
          O('s2b', '='),
          T('s2c', '-\\tfrac{1}{10}'),
          T('s2d', '(38)'),
          O('s2e', '+'),
          T('s2f', '\\tfrac{2}{10}'),
          T('s2g', '(34)'),
        ],
        note: 'baris 1 × kolom',
      },
      {
        id: 's3',
        toks: [T('s3a', 'x'), O('s3b', '='), T('s3c', '-3{,}8+6{,}8'), O('s3d', '='), T('s3e', '3', 'gold')],
        box: 'gold',
      },
      {
        id: 's4',
        toks: [T('s4a', 'y'), O('s4b', '='), T('s4c', '1(38)-1(34)'), O('s4d', '='), T('s4e', '4', 'gold')],
        note: 'baris 2 × kolom',
        box: 'gold',
      },
      {
        id: 's5',
        toks: [T('s5a', v('x', 'y')), O('s5b', '='), T('s5c', v('3', '4'), 'gold', 's3e')],
        note: '3 sapi, 4 kambing',
        box: 'gold',
      },
    ],
    L5p: [
      {
        id: 'q1',
        toks: [H('q1a', 'gajah ÷ 2', 'tx'), O('q1b', ':'), T('q1c', '5x+y=19')],
        note: 'persamaan gamal tetap $10x+y=34$',
      },
      {
        id: 'q2',
        toks: [T('q2a', `M'=${m('5', '1', '10', '1')}`), O('q2b', ','), T('q2c', "\\det M'=-5")],
      },
      {
        id: 'q3',
        toks: [T('q3a', `M'^{-1}=${m('-\\frac15', '\\frac15', '2', '-1')}`, 'blue')],
        note: 'susunan setara pada pilihan E',
        box: 'navy',
      },
    ],
    L5: [
      {
        id: 'v1',
        toks: [
          T('v1a', '\\text{A}', 'sp'),
          T('v1b', '10(15)+2(20)=190\\ne38'),
          T('v1c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 'v2',
        toks: [
          T('v2a', '\\text{B}', 'sp'),
          T('v2b', `\\text{hasil}=${v('40', '30')}`),
          T('v2c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 'v3',
        toks: [
          T('v3a', '\\text{C}', 'sp'),
          T('v3b', `\\text{hasil}=${v('4{,}2', '-4')}`),
          T('v3c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 'v4',
        toks: [
          T('v4a', '\\text{D}', 'sp'),
          T('v4b', `\\text{hasil}=${v('30', '40')}`),
          T('v4c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 'v5',
        toks: [
          T('v5a', '\\text{E}', 'sp'),
          T('v5b', `\\text{hasil}=${v('3', '4')}`),
          T('v5c', '\\;\\checkmark', 'gold'),
        ],
        note: '<b class="k-gold">BENAR</b>',
      },
      { id: 'v6', toks: [H('v6a', 'Jawaban', 'lbl'), T('v6b', '\\textbf{E}')], box: 'gold' },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', 'x=3')], note: 'sapi', box: 'gold' },
      { id: 'r2', toks: [T('r2a', 'y=4')], note: 'kambing', box: 'gold' },
      { id: 'r3', toks: [H('r3a', 'Jawaban', 'lbl'), T('r3b', '\\textbf{E}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Baca soal dan lihat tabel kebutuhan pakan tiap hewan.',
      visual: { kind: 'soal', hl: 0 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 0, from: 0 },
    },
    {
      ch: 1,
      cap: 'Catat <b>jumlah pakan</b> yang tersedia dan kebutuhan per ekor.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 3, from: 0 },
    },
    {
      ch: 1,
      cap: 'Yang <b>ditanya</b> adalah $\\begin{pmatrix}x\\\\y\\end{pmatrix}$. Pilihan jawaban berbentuk perkalian matriks, jadi kita susun persamaan matriksnya.',
      visual: PAPER,
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 4, from: 3 },
    },
    // ---- 2 · Menyusun persamaan ----
    {
      ch: 2,
      cap: 'Setiap jenis rumput menghasilkan satu persamaan. Mulai dari rumput gajah.',
      visual: PAPER,
      board: { title: 'Persamaan pakan', list: 'L2', upTo: 2, from: 0 },
      ask: {
        before: 'e1',
        q: 'Untuk $x$ sapi dan $y$ kambing, total rumput gajah adalah…',
        opts: [
          { tex: '10x+2y=38', ok: true },
          {
            tex: '2x+10y=38',
            hint: 'Angkanya tertukar. Sapi memakan $10$ kg gajah per ekor, jadi $x$ dikali $10$.',
          },
          { tex: '10x+y=38', hint: 'Itu persamaan untuk rumput gamal. Kambing memakan $2$ kg gajah.' },
          { tex: 'x+y=38', hint: 'Kamu menghitung jumlah hewan. Yang dijumlahkan adalah kilogram pakannya.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Koefisien $x$ dan $y$ disusun menjadi matriks. Baris pertama untuk gajah, baris kedua untuk gamal.',
      visual: PAPER,
      board: { title: 'Persamaan pakan', list: 'L2', upTo: 4, from: 2 },
    },
    // ---- 3 · Menyelesaikan dengan invers ----
    {
      ch: 3,
      cap: 'Cari determinan, lalu bentuk invers $M$.',
      visual: PAPER,
      board: { title: 'Invers matriks', pins: ['pM'], list: 'L3', upTo: 4, from: 0 },
      ask: {
        before: 'i2',
        q: 'Berapa $\\det M$?',
        opts: [
          { tex: '-10', ok: true },
          { tex: '10', hint: '$10\\cdot1=10$ memang benar, tetapi masih harus dikurangi $2\\cdot10=20$.' },
          { tex: '20', hint: 'Determinan = $ad-bc$, jadi $bc=20$ dikurangkan, bukan dijadikan hasil.' },
          {
            tex: '0',
            hint: 'Baris pertama dan kedua tidak sebanding ($10:2\\neq10:1$), jadi determinannya tidak nol.',
          },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Kalikan $M^{-1}$ dengan $\\begin{pmatrix}38\\\\34\\end{pmatrix}$. Urutan vektornya: gajah dulu, baru gamal.',
      visual: PAPER,
      board: { title: 'Kalikan dengan ruas kanan', pins: ['pMi', 'pB'], list: 'L3b', upTo: 5, from: 0 },
    },
    // ---- 4 · Catatan lengkap ----
    {
      ch: 4,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 5 · Cocokkan dengan pilihan ----
    {
      ch: 5,
      cap: 'Pilihan memakai susunan setara: persamaan gajah dibagi 2. Uji matriks, vektor, dan hasil perkaliannya.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Susunan setara', pins: ['pXY'], list: 'L5p', upTo: 3, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pilihan A: matriksnya 5 kali invers yang benar, sehingga hasilnya $(15,20)$, bukan solusi. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pXY'], list: 'L5', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pilihan B: matriksnya bukan invers, dan hasil perkalian sebenarnya $(40,30)$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pXY'], list: 'L5', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: 'Pilihan C: jebakan urutan, vektor ruas kanan dibalik (gamal di atas gajah). <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pXY'], list: 'L5', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: 'Pilihan D: adjoin tanpa dibagi $-10$, sehingga perkaliannya menghasilkan $(30,40)$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 4 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pXY'], list: 'L5', upTo: 4, from: 3 },
    },
    {
      ch: 5,
      cap: 'Pilihan E: invers $M\'$ yang benar dan vektor sesuai, hasilnya $(3,4)$ (<b class="k-gold">benar</b>). Pilih jawabannya di papan tulis.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan dengan pilihan', pins: ['pXY'], list: 'L5', upTo: 6, from: 4 },
      ask: {
        before: 'v6',
        q: 'Jawaban yang tepat adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>E</b>.',
        opts: [
          { txt: 'hasil (15, 20)', hint: 'Pembagi $\\det=-5$ terlewat, jadi hasilnya $5\\times(3,4)$.' },
          { txt: 'hasil (4, 3)', hint: 'Hasil perkalian sebenarnya $(40,30)$.' },
          { txt: 'vektor (34, 38)', hint: 'Urutan vektor terbalik: gajah harus di atas.' },
          { txt: 'adjoin × (38, 34)', hint: 'Adjoin belum dibagi $-10$, hasilnya $(30,40)$.' },
          { txt: "M'⁻¹ × (19, 34) = (3, 4)", ok: true },
        ],
      },
    },
    // ---- 6 · Selesai ----
    {
      ch: 6,
      cap: '<span class="verdict"><span class="seal">E</span><span>Pak Andi memelihara <b>3 sapi</b> dan <b>4 kambing</b>. Pilihan E satu-satunya yang matriks, vektor, dan hasil perkaliannya konsisten.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: card('A'),
      ok: false,
      formula: '10(15)+2(20)=190\\ne38',
      why: 'Matriksnya 5 kali invers yang benar (pembagi $\\det=-5$ terlewat).',
    },
    {
      label: 'B',
      statement: card('B'),
      ok: false,
      formula: `\\text{hasil}=${v('40', '30')}`,
      why: 'Bukan invers matriks koefisien mana pun; hasil tertulis keliru.',
    },
    {
      label: 'C',
      statement: card('C'),
      ok: false,
      formula: `\\text{hasil}=${v('4{,}2', '-4')}`,
      why: 'Jebakan urutan: vektor ruas kanan dibalik.',
    },
    {
      label: 'D',
      statement: card('D'),
      ok: false,
      formula: `\\text{hasil}=${v('30', '40')}`,
      why: 'Adjoin tanpa dibagi $-10$.',
    },
    {
      label: 'E',
      statement: card('E'),
      ok: true,
      formula: '-\\tfrac{19}{5}+\\tfrac{34}{5}=3;\\ 38-34=4',
      why: "Invers $M'$ yang benar, vektor sesuai, hasil cocok.",
    },
  ],
  notes: {
    title: 'Pembahasan Soal 2: Pakan Sapi dan Kambing',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Matriks dan SPL',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Menyusun persamaan',
        lists: ['L2'],
        why: 'Total pakan = (pakan per ekor sapi × jumlah sapi) + (pakan per ekor kambing × jumlah kambing).',
      },
      {
        title: 'Menyelesaikan dengan invers',
        lists: ['L3', 'L3b'],
        why: '$M\\mathbf v=\\mathbf b\\Rightarrow\\mathbf v=M^{-1}\\mathbf b$.',
      },
      { title: 'Susunan setara pada pilihan', lists: ['L5p'] },
    ],
    answer: 'Jawaban: <b>E</b>; Pak Andi memelihara 3 sapi dan 4 kambing.',
  },
  done: {
    seal: 'E',
    message:
      'Pak Andi memelihara <b>3 sapi</b> dan <b>4 kambing</b>. Pilihan E satu-satunya yang matriks, vektor, dan hasil perkaliannya konsisten.',
  },
  key: {
    answer: 'E',
    cardOk: [false, false, false, false, true],
    goldRows: ['s3', 's4', 's5', 'v6', 'r1', 'r2', 'r3'],
  },
  authorNotes: [
    'Bagian 5: langkah pembuka menampilkan susunan setara pada papan (q1–q3, dari paragraf "Cara menguji" dokumen); id ringkasan kartu memakai v1–v6 karena s1–s5 sudah dipakai baris penyelesaian.',
    'Bagian 5: pertanyaan berhuruf A–E memakai teks singkat per pilihan (matriks lengkap terlalu lebar untuk tombol).',
    'Sorotan angka 3 dan 4 pada gambar sapi/kambing belum dibuat (gambar sumber dipakai apa adanya).',
  ],
};

export default q02;
