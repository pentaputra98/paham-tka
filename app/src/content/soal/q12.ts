/**
 * SOAL 12 — Panjang Vektor 3D (panjang vektor dan persamaan kuadrat; pilihan tunggal). Kunci: B (m = −4 atau m = 3).
 * Sumber: docs/pembahasan25.md "SOAL 12", docs/soal25.md no. 12 (opsi E diganti "−4 atau 4", catatan dokumen).
 * Alur revisi pemilik (v1.45, dicatat di dokumen), murni aljabar tanpa gambar balok:
 *  - pahami: AB = (2m, m + 3, m), panjangnya 9; ditanya m;
 *  - panjang vektor = akar dari jumlah kuadrat semua komponennya; komponen dimasukkan, kedua ruas dikuadratkan;
 *  - jabarkan: 81 = 4m² + (m² + 6m + 9) + m², jadi 6m² + 6m − 72 = 0;
 *  - faktorkan bentuk a > 1 dengan cara a · c: a · c = 6 · (−72) = −432; dua bilangan yang dikali −432 dan dijumlah 6
 *    adalah 24 dan −18; tulis (6m + 24)(6m − 18)/6 = 0; kurung yang bisa dibagi 6 disederhanakan, (m + 4)(6m − 18) = 0;
 *  - m = −4 atau m = 3 → pilihan B; bagian opsional "Cek dengan substitusi" (tabel uji nilai m dari pilihan).
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Visual } from '../../engine/types';
import type { Vec12State } from '../../visuals/vec12';
import { getSoal } from '../index';

const vec = (state: Vec12State): Visual => ({ kind: 'svg', scene: 'vec12', state });
const alg = (s: number): Visual => vec({ s });
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
/** pilihan (docs/soal25.md no. 12; opsi E sesuai catatan dokumen) */
const OPT = ['−4 atau −3', '−4 atau 3', '−3 atau 4', '3 atau 4', '−4 atau 4'];
const PIN = ['pV', 'p81'];
const PQ = ['pQ', 'pAC'];

/** uji satu nilai m: jumlah kuadrat komponen dibandingkan dengan 81 */
const test = (id: string, m: string, xyz: string, sum: string, val: string, ok: boolean, i: number): Row => ({
  id,
  toks: [
    T(`${id}a`, `m=${m}`, 'blue', `@v-m${i}`),
    O(`${id}b`, '\\to'),
    T(`${id}c`, sum),
    O(`${id}d`, '='),
    T(`${id}e`, val, ok ? 'blue' : 'red'),
    ...(ok ? [T(`${id}g`, '\\;\\checkmark', 'blue')] : [O(`${id}f`, '\\ne'), T(`${id}g`, '81')]),
  ],
  note: `$\\vec{AB}=${xyz}$`,
});

const q12: SoalContent = {
  meta: getSoal(12)!,
  sourceRef: 'docs/pembahasan25.md#soal-12',
  layout: 'full',
  paper: {
    html: `<p>Diketahui vektor</p>
<p>$\\htmlClass{hl hl-red}{\\htmlData{src=s-v, hl=1}{\\vec{AB}=\\begin{pmatrix}2m\\\\m+3\\\\m\\end{pmatrix}}}$</p>
<p>Jika <span class="hl hl-red" data-hl="2"><span data-src="s-9">panjang vektor $\\vec{AB}=9$ satuan panjang</span></span>, maka <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">nilai $m$</span></span> yang memenuhi vektor $\\vec{AB}$ adalah ....</p>
<ol class="abc">
${LETTERS.map((o, i) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">${OPT[i]}</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-v', 's-9', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['v-m0', 'v-m1', 'v-m2', 'v-m3'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Vektor',
    titleLines: ['Pembahasan Soal', 'Panjang <span class="accent">Vektor</span>', 'Ruang 3D'],
    lede: 'Vektor $\\vec{AB}$ punya tiga komponen yang bergantung pada $m$, dan panjangnya 9. Berapa nilai $m$?',
    facts: [
      { dt: 'Panjang', dd: '9 satuan' },
      { dt: 'Komponen', dd: '2m, m+3, m' },
      { dt: 'Dicari', dd: 'm' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Komponen dan panjang' },
    { t: 'Panjang vektor', d: 'Akar jumlah kuadrat' },
    { t: 'Jabarkan', d: '6m² + 6m − 72 = 0' },
    { t: 'Faktorkan', d: 'Cara a · c' },
    { t: 'Nilai m', d: 'Pilihan B' },
    { t: 'Cek dengan substitusi', d: 'Opsional: uji nilai dari pilihan', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban B' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pV: { id: 'pV', toks: [T('PV1', '\\vec{AB}=(2m,\\ m+3,\\ m)', '', 'k1a')] },
    p81: {
      id: 'p81',
      toks: [T('P811', '(2m)^2+(m+3)^2+m^2', '', 'l3a'), O('P812', '='), T('P813', '81', '', 'l3c')],
    },
    pQ: { id: 'pQ', toks: [T('PQ1', '6m^2+6m-72=0', '', 'j3a')] },
    pAC: { id: 'pAC', toks: [T('PA1', 'a\\cdot c=-432', '', 'f2e')] },
    pF: { id: 'pF', toks: [T('PF1', '(m+4)(6m-18)=0', '', 'f7a')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [T('k1a', '\\vec{AB}=(2m,\\ m+3,\\ m)', 'red', '@s-v')],
        note: 'tiga komponen, semuanya memuat $m$; simpan ke catatan',
      },
      {
        id: 'k2',
        toks: [
          T('k2a', '|\\vec{AB}|=9', 'red', '@s-9'),
          O('k2b', ','),
          H('k2c', 'Ditanya', 'lbl'),
          T('k2d', 'm', 'gold', '@s-tanya'),
        ],
      },
    ],
    LL: [
      {
        id: 'l1',
        toks: [T('l1a', '|\\vec{AB}|'), O('l1b', '='), T('l1c', '\\sqrt{x^2+y^2+z^2}', 'blue')],
        note: 'panjang vektor = akar dari jumlah kuadrat semua komponennya',
        box: 'navy',
      },
      {
        id: 'l2',
        toks: [T('l2a', '9', '', '@s-9'), O('l2b', '='), T('l2c', '\\sqrt{(2m)^2+(m+3)^2+m^2}', '', 'PV1')],
        note: 'komponen $2m$, $m+3$, $m$ dimasukkan',
      },
      {
        id: 'l3',
        toks: [T('l3a', '(2m)^2+(m+3)^2+m^2'), O('l3b', '='), T('l3c', '81', 'blue')],
        note: 'kedua ruas dikuadratkan, $9^2=81$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LJ: [
      {
        id: 'j1',
        toks: [T('j1a', '4m^2+(m^2+6m+9)+m^2', '', 'P811'), O('j1b', '='), T('j1c', '81', '', 'P813')],
        note: '$(2m)^2=4m^2$ dan $(m+3)^2=m^2+6m+9$',
      },
      {
        id: 'j2',
        toks: [T('j2a', '6m^2+6m+9'), O('j2b', '='), T('j2c', '81')],
        note: '$4m^2+m^2+m^2=6m^2$',
      },
      {
        id: 'j3',
        toks: [T('j3a', '6m^2+6m-72=0', 'blue')],
        note: '$81$ pindah ruas menjadi $-81$, dan $9-81=-72$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LF: [
      {
        id: 'f1',
        toks: [T('f1a', 'a=6'), O('f1b', ','), T('f1c', 'b=6'), O('f1d', ','), T('f1e', 'c=-72', '', 'PQ1')],
        note: '$a$ lebih dari $1$, jadi pakai cara $a\\cdot c$',
      },
      {
        id: 'f2',
        toks: [
          H('f2a', 'langkah 1', 'lbl'),
          T('f2b', 'a\\cdot c'),
          O('f2c', '='),
          T('f2d', '6\\cdot(-72)', '', 'f1a'),
          T('f2e', '=-432', 'blue'),
        ],
        note: 'kalikan $a$ dan $c$ dulu; simpan ke catatan',
      },
      {
        id: 'f3',
        toks: [
          H('f3a', 'langkah 2', 'lbl'),
          H('f3b', 'dikali', 'tx'),
          T('f3c', '-432', '', 'PA1'),
          O('f3d', ','),
          H('f3e', 'dijumlah', 'tx'),
          T('f3f', '6', '', 'f1c'),
        ],
        note: 'cari dua bilangan dengan hasil kali $ac$ dan jumlah $b$',
      },
      {
        id: 'f4',
        toks: [T('f4a', '24\\times(-18)=-432'), O('f4b', ','), T('f4c', '24+(-18)=6', 'blue')],
        note: '$12$ dan $-36$ berjumlah $-24$, $18$ dan $-24$ berjumlah $-6$, belum cocok',
        box: 'navy',
      },
      {
        id: 'f5',
        toks: [H('f5a', 'langkah 3', 'lbl'), T('f5b', '\\dfrac{(6m+24)(6m-18)}{6}=0')],
        note: 'kedua bilangan masuk kurung bersama $am$, lalu dibagi $a$',
      },
      {
        id: 'f6',
        toks: [H('f6a', 'langkah 4', 'lbl'), T('f6b', '\\dfrac{6m+24}{6}=m+4', '', 'f5b')],
        note: 'kurung yang bisa dibagi $6$ disederhanakan',
      },
      {
        id: 'f7',
        toks: [T('f7a', '(m+4)(6m-18)=0', 'blue')],
        note: 'bentuk faktornya',
        box: 'navy',
      },
    ],
    LM: [
      {
        id: 'm1',
        toks: [T('m1a', 'm+4=0', '', 'PF1'), O('m1b', '\\to'), T('m1c', 'm=-4', 'gold')],
        note: '$4$ pindah ruas menjadi $-4$',
      },
      {
        id: 'm2',
        toks: [
          T('m2a', '6m-18=0', '', 'PF1'),
          O('m2b', '\\to'),
          T('m2c', '6m=18'),
          O('m2d', '\\to'),
          T('m2e', 'm=3', 'gold'),
        ],
        note: '$18\\div6=3$',
      },
      {
        id: 'm3',
        toks: [
          H('m3a', 'Jawaban', 'lbl'),
          T('m3b', '\\textbf{B}', '', '@s-oB'),
          T('m3c', '-4\\ \\text{atau}\\ 3', 'gold'),
        ],
        note: 'kedua nilai ada di pilihan B',
        box: 'gold',
      },
    ],
    // cek dengan substitusi (opsional)
    LU: [
      test('u1', '-4', '(-8,-1,-4)', '64+1+16', '81', true, 0),
      test('u2', '-3', '(-6,0,-3)', '36+0+9', '45', false, 1),
      test('u3', '3', '(6,6,3)', '36+36+9', '81', true, 2),
      test('u4', '4', '(8,7,4)', '64+49+16', '129', false, 3),
    ],
    L7: [{ id: 'v1', toks: [H('v1a', 'Jawaban', 'lbl'), T('v1b', '\\textbf{B}')], box: 'gold' }],
    LR: [
      { id: 'r1', toks: [T('r1a', '(m+4)(6m-18)=0')], note: '$m=-4$ atau $m=3$', box: 'gold' },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), T('r2b', '\\textbf{B}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Vektor $\\vec{AB}$ punya tiga komponen, $2m$, $m+3$, dan $m$, yang semuanya memuat $m$.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0, save: ['pV'] },
    },
    {
      ch: 1,
      cap: 'Diketahui panjang vektornya $9$ satuan. Yang ditanya nilai $m$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Panjang vektor ----
    {
      ch: 2,
      cap: 'Panjang vektor adalah akar dari jumlah kuadrat semua komponennya, $|\\vec{AB}|=\\sqrt{x^2+y^2+z^2}$.',
      visual: alg(1),
      board: { title: 'Panjang vektor', pins: ['pV'], list: 'LL', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Masukkan komponennya, $x=2m$, $y=m+3$, dan $z=m$, sedangkan panjangnya $9$.',
      visual: alg(2),
      board: { title: 'Panjang vektor', pins: ['pV'], list: 'LL', upTo: 2, from: 1 },
    },
    {
      ch: 2,
      cap: 'Supaya akarnya hilang, kedua ruas dikuadratkan. Ruas kiri menjadi $9^2=81$.',
      visual: alg(3),
      board: { title: 'Panjang vektor', pins: ['pV'], list: 'LL', upTo: 3, from: 2, save: ['p81'] },
      ask: {
        before: 'l3',
        q: 'Kedua ruas $9=\\sqrt{\\dots}$ dikuadratkan, ruas kirinya menjadi…',
        opts: [
          { tex: '81', ok: true },
          { tex: '9', hint: 'Ruas kiri juga ikut dikuadratkan, $9^2=81$.' },
          { tex: '18', hint: '$9^2=9\\times9=81$, bukan $9\\times2$.' },
        ],
      },
    },
    // ---- 3 · Jabarkan ----
    {
      ch: 3,
      cap: 'Jabarkan tiap kuadrat. $(2m)^2=4m^2$, dan hati-hati, $(m+3)^2=m^2+6m+9$.',
      visual: alg(4),
      board: { title: 'Jabarkan', pins: PIN, list: 'LJ', upTo: 1, from: 0 },
      ask: {
        before: 'j1',
        q: 'Hasil $(m+3)^2$ adalah…',
        opts: [
          { tex: 'm^2+6m+9', ok: true },
          { tex: 'm^2+9', hint: 'Suku tengah terlewat, $2\\cdot m\\cdot3=6m$.' },
          { tex: 'm^2+3', hint: 'Angka $3$ juga dikuadratkan, $3^2=9$.' },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Jumlahkan suku yang sejenis, $4m^2+m^2+m^2=6m^2$. Jadi $6m^2+6m+9=81$.',
      visual: alg(5),
      board: { title: 'Jabarkan', pins: PIN, list: 'LJ', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Pindahkan $81$ ke ruas kiri menjadi $-81$, dan $9-81=-72$. Persamaannya $6m^2+6m-72=0$.',
      visual: alg(6),
      board: { title: 'Jabarkan', pins: PIN, list: 'LJ', upTo: 3, from: 2, save: ['pQ'] },
    },
    // ---- 4 · Faktorkan ----
    {
      ch: 4,
      cap: 'Bentuknya $am^2+bm+c=0$ dengan $a=6$, $b=6$, dan $c=-72$. Karena $a$ lebih dari $1$, kita pakai cara $a\\cdot c$.',
      visual: alg(7),
      board: { title: 'Faktorkan', pins: ['pQ'], list: 'LF', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Langkah 1, kalikan $a$ dan $c$ dulu, $6\\cdot(-72)=-432$.',
      visual: alg(8),
      board: { title: 'Faktorkan', pins: ['pQ'], list: 'LF', upTo: 2, from: 1, save: ['pAC'] },
    },
    {
      ch: 4,
      cap: 'Langkah 2, cari dua bilangan yang jika dikali hasilnya $-432$ dan jika dijumlah hasilnya $6$. Ketemu $24$ dan $-18$.',
      visual: alg(9),
      board: { title: 'Faktorkan', pins: PQ, list: 'LF', upTo: 4, from: 2 },
      ask: {
        before: 'f4',
        q: 'Dua bilangan yang dikali $-432$ dan dijumlah $6$ adalah…',
        opts: [
          { tex: '24\\ \\text{dan}\\ -18', ok: true },
          { tex: '-24\\ \\text{dan}\\ 18', hint: 'Hasil kalinya benar, tetapi jumlahnya $-6$, bukan $6$.' },
          { tex: '12\\ \\text{dan}\\ -36', hint: 'Jumlahnya $-24$. Yang dicari berjumlah $6$.' },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Langkah 3, tulis kedua bilangan dalam kurung bersama $6m$, lalu seluruhnya dibagi $a=6$.',
      visual: alg(10),
      board: { title: 'Faktorkan', pins: PQ, list: 'LF', upTo: 5, from: 4 },
    },
    {
      ch: 4,
      cap: 'Langkah 4, kurung yang bisa dibagi $6$ disederhanakan, $\\frac{6m+24}{6}=m+4$. Jadi $(m+4)(6m-18)=0$.',
      visual: alg(11),
      board: { title: 'Faktorkan', pins: PQ, list: 'LF', upTo: 7, from: 5, save: ['pF'] },
    },
    // ---- 5 · Nilai m ----
    {
      ch: 5,
      cap: 'Hasil kali sama dengan nol, jadi tiap kurung sama dengan nol. $m+4=0$ memberi $m=-4$, dan $6m-18=0$ memberi $m=3$.',
      visual: alg(12),
      board: { title: 'Nilai m', pins: ['pF'], list: 'LM', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Jadi $m=-4$ atau $m=3$, yaitu pilihan B.',
      visual: { kind: 'soal', hl: 0, focus: 's-oB' },
      board: { title: 'Nilai m', pins: ['pF'], list: 'LM', upTo: 3, from: 2 },
    },
    // tawaran cek (opsional): Ya masuk Bagian 6, Tidak/Lewati langsung ke Bagian 7
    {
      ch: 5,
      cap: 'Mau cek jawabannya dengan memasukkan nilai $m$ dari pilihan ke vektornya?',
      visual: alg(12),
      board: { title: 'Nilai m', pins: ['pF'], list: 'LM', upTo: 3, from: 3 },
      branch: { yes: 'Ya, cek substitusi' },
    },
    // ---- 6 · Cek dengan substitusi (opsional) ----
    {
      ch: 6,
      cap: 'Untuk $m=-4$ vektornya $(-8,-1,-4)$, jumlah kuadratnya $81$. Untuk $m=-3$ hanya $45$.',
      visual: vec({ view: 'tab', n: 2, cur: 1 }),
      board: { title: 'Cek dengan substitusi', pins: PIN, list: 'LU', upTo: 2, from: 0 },
    },
    {
      ch: 6,
      cap: 'Untuk $m=3$ jumlahnya $81$, sedangkan $m=4$ memberi $129$. Hanya $-4$ dan $3$ yang cocok, sama dengan hasil faktorisasi.',
      visual: vec({ view: 'tab', n: 4, cur: 3 }),
      board: { title: 'Cek dengan substitusi', pins: PIN, list: 'LU', upTo: 4, from: 2 },
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
      cap: 'Cocokkan dengan pilihan. Hasilnya $m=-4$ atau $m=3$; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pQ'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'v1',
        q: 'Nilai $m$ yang memenuhi adalah…',
        letters: true,
        win: 'Jawabannya <b>B</b>.',
        opts: [
          { txt: OPT[0]!, hint: '$m=-3$ memberi $45$, bukan $81$.' },
          { txt: OPT[1]!, ok: true },
          { txt: OPT[2]!, hint: 'Tandanya terbalik. Faktornya $(m+4)(6m-18)$.' },
          { txt: OPT[3]!, hint: '$m=4$ memberi $129$.' },
          { txt: OPT[4]!, hint: '$-4$ memenuhi, tetapi $4$ memberi $129$.' },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">B</span><span>Dari $6m^2+6m-72=0$ diperoleh $(m+4)(6m-18)=0$, jadi $m=-4$ atau $m=3$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    { label: 'A', statement: OPT[0]!, ok: false, formula: 'm=-3\\to45\\ne81', why: '$m=-3$ bukan akar.' },
    { label: 'B', statement: OPT[1]!, ok: true, formula: '(m+4)(6m-18)=0', why: 'Kedua nilai memenuhi.' },
    {
      label: 'C',
      statement: OPT[2]!,
      ok: false,
      formula: 'm=4\\to129\\ne81',
      why: 'Tanda kedua akar terbalik.',
    },
    { label: 'D', statement: OPT[3]!, ok: false, formula: 'm=4\\to129\\ne81', why: '$4$ bukan akar.' },
    { label: 'E', statement: OPT[4]!, ok: false, formula: 'm=4\\to129\\ne81', why: 'Hanya $-4$ yang akar.' },
  ],
  notes: {
    title: 'Pembahasan Soal 12: Panjang Vektor 3D',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Vektor',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Panjang vektor',
        lists: ['LL'],
        why: 'Untuk $\\vec v=(x,y,z)$, panjangnya $|\\vec v|=\\sqrt{x^2+y^2+z^2}$.',
      },
      { title: 'Jabarkan', lists: ['LJ'] },
      {
        title: 'Faktorkan dengan cara a · c',
        lists: ['LF'],
        why: 'Untuk $am^2+bm+c=0$ dengan $a>1$: hitung $a\\cdot c$, cari dua bilangan $p$ dan $q$ dengan $pq=ac$ dan $p+q=b$, tulis $\\frac{(am+p)(am+q)}{a}=0$, lalu sederhanakan kurung yang bisa dibagi $a$.',
      },
      { title: 'Nilai m', lists: ['LM'] },
      { title: 'Cek dengan substitusi (opsional)', lists: ['LU'] },
    ],
    answer: 'Jawaban: <b>B</b>, $m=-4$ atau $m=3$.',
  },
  done: {
    seal: 'B',
    message: 'Dari $6m^2+6m-72=0$ diperoleh $(m+4)(6m-18)=0$, jadi $m=-4$ atau $m=3$.',
  },
  key: {
    answer: 'B',
    cardOk: [false, true, false, false, false],
    goldRows: ['m3', 'v1', 'r1', 'r2'],
  },
  authorNotes: [
    'Ditulis ulang atas arahan pemilik (v1.45): murni aljabar, tanpa gambar balok. Panjang vektor = akar jumlah kuadrat semua komponen, lalu dijabarkan sampai 6m² + 6m − 72 = 0 (dokumen a1–b2).',
    'Faktorisasi memakai cara a · c untuk a > 1 (arahan pemilik): a · c = −432, pasangan 24 dan −18, (6m + 24)(6m − 18)/6 = 0, kurung yang bisa dibagi 6 disederhanakan menjadi (m + 4)(6m − 18) = 0. Ini turunan aljabar; dokumen membagi 6 lebih dulu (m² + m − 12 = 0), hasilnya sama.',
    'Adegan vec12: baris penurunan besar bertahap (baris baru meluncur masuk, bagian penting berdenyut, bentuk berganti dengan pudar silang), panel pencarian pasangan 12 dan −36, 18 dan −24, 24 dan −18.',
    'Pertanyaan cepat: 9² = 81, (m + 3)² dari dokumen, dan pasangan 24 dan −18 (pengecoh −24 dan 18, 12 dan −36). Uji substitusi dari pilihan menjadi bagian opsional.',
    'Opsi E memakai "−4 atau 4" sesuai catatan dokumen. Tanpa simbol ":" di baris papan.',
  ],
};

export default q12;
