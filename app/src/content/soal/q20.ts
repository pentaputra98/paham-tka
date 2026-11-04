/**
 * SOAL 20 — Translasi lalu Dilatasi Lingkaran (transformasi geometri; pilihan tunggal). Kunci: C (T = (3, −1), k = 2).
 * Sumber: docs/pembahasan25.md "SOAL 20", docs/soal25.md no. 20.
 * Alur (v1.52, dicatat di dokumen):
 *  - pahami: L pusat (−5, 3), r = 2; translasi T lalu dilatasi [O, k]; L″ (x + 4)² + (y − 4)² = 16; ditanya T dan k;
 *  - baca L″: pusat (−4, 4), r² = 16 jadi r = 4;
 *  - faktor skala dulu dari jari-jari: translasi tidak mengubah jari-jari (r′ = 2), 4 = k × 2 jadi k = 2;
 *    pilihan tinggal C dan D;
 *  - pusat L′ mundur dari L″: dilatasi dari O mengalikan pusat dengan 2, jadi (−4, 4) dibagi 2 = (−2, 2);
 *  - T = pusat L′ − pusat L = (3, −1) → pilihan C (hati-hati D, (1, 1) dihitung langsung dari L ke L″);
 *  - bagian opsional "Cek maju dari pilihan": C (−5, 3) → (−2, 2) → (−4, 4) ✓, D (−5, 3) → (−4, 4) → (−8, 8) ✗.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Dil20State } from '../../visuals/dil20';
import { getSoal } from '../index';

const sc = (state: Dil20State): Visual => ({ kind: 'svg', scene: 'dil20', state });
const col = (a: string, b: string): string => `\\begin{pmatrix}${a}\\\\${b}\\end{pmatrix}`;
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
const OPT: Array<[string, string, string]> = [
  ['3', '-1', '8'],
  ['3', '-1', '4'],
  ['3', '-1', '2'],
  ['1', '1', '2'],
  ['1', '1', '8'],
];
const BASE: Dil20State = { L: true, L2: true, rad: true };
const L1 = 'L^{\\prime}';
const L2 = 'L^{\\prime\\prime}';

const q20: SoalContent = {
  meta: getSoal(20)!,
  sourceRef: 'docs/pembahasan25.md#soal-20',
  layout: 'full',
  paper: {
    html: `<p>Lingkaran L memiliki <span class="hl hl-red" data-hl="1"><span data-src="s-L">pusat di $(-5, 3)$ dan jari-jari $2$</span></span>. Lingkaran $L'$ merupakan bayangan lingkaran L setelah dilakukan <span class="hl hl-blue" data-hl="1"><span data-src="s-T">translasi T</span></span>. Lingkaran $L''$ dengan persamaan <span class="hl hl-red" data-hl="2"><span data-src="s-L2">$(x+4)^{2}+(y-4)^{2}=16$</span></span> merupakan bayangan lingkaran $L'$ setelah dilakukan <span class="hl hl-blue" data-hl="2"><span data-src="s-dil">dilatasi berpusat di $O(0, 0)$</span></span> dengan faktor skala tertentu. Pernyataan yang benar mengenai <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">translasi T dan faktor skala dilatasi</span></span> tersebut adalah ....</p>
<ol class="abc abc-col">
${LETTERS.map((o, i) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">$T=${col(OPT[i]![0], OPT[i]![1])}$ dan faktor skala dilatasi $${OPT[i]![2]}$</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-L', 's-T', 's-L2', 's-dil', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Transformasi geometri',
    titleLines: ['Pembahasan Soal', 'Translasi lalu <span class="accent">Dilatasi</span>', 'Lingkaran'],
    lede: 'Lingkaran $L$ digeser lalu diperbesar menjadi $L^{\\prime\\prime}$. Dari lingkaran awal dan akhir, kita cari translasi dan faktor skalanya.',
    facts: [
      { dt: 'L', dd: 'pusat (−5, 3), r = 2' },
      { dt: 'L″', dd: '(x+4)² + (y−4)² = 16' },
      { dt: 'Dicari', dd: 'T dan k' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Lingkaran awal dan akhir' },
    { t: 'Lingkaran L″', d: 'Pusat (−4, 4), r = 4' },
    { t: 'Faktor skala', d: 'k = 2, sisa C dan D' },
    { t: 'Pusat L′', d: 'Mundur, dibagi 2' },
    { t: 'Translasi T', d: 'Pilihan C' },
    { t: 'Cek maju dari pilihan', d: 'Opsional: C dan D', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban C' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pL: { id: 'pL', toks: [T('PL1', 'L\\ (-5,3),\\ r=2', '', 'k1a')] },
    pL2: { id: 'pL2', toks: [T('PL21', `${L2}\\ (-4,4),\\ r=4`, '', 'a3c')] },
    pK: { id: 'pK', toks: [T('PK1', 'k=2', '', 'b3a')] },
    pLp: { id: 'pLp', toks: [T('PP1', `${L1}\\ (-2,2)`, '', 'c3c')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [T('k1a', 'L\\ (-5,3),\\ r=2', 'red', '@s-L')],
        note: 'pusat dan jari-jari lingkaran awal',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', 'translasi <i>T</i>', 'tx', '@s-T'),
          O('k2b', '\\to'),
          H('k2c', 'dilatasi pusat <i>O</i>', 'tx', '@s-dil'),
        ],
        note: `urutannya $L\\to ${L1}\\to ${L2}$`,
      },
      { id: 'k3', toks: [T('k3a', `${L2}\\ (x+4)^2+(y-4)^2=16`, 'red', '@s-L2')], note: 'lingkaran akhir' },
      {
        id: 'k4',
        toks: [
          H('k4a', 'Ditanya', 'lbl'),
          T('k4b', 'T', 'gold', '@s-tanya'),
          H('k4c', 'dan', 'tx'),
          T('k4d', 'k', 'gold'),
        ],
        note: 'translasi dan faktor skala',
      },
    ],
    LA: [
      { id: 'a1', toks: [T('a1a', '(x+4)^2+(y-4)^2=16', '', '@s-L2')], note: 'bentuk $(x-p)^2+(y-q)^2=r^2$' },
      {
        id: 'a2',
        toks: [H('a2a', 'pusat', 'tx'), T('a2b', '(-4,\\ 4)', 'blue')],
        note: '$x+4=x-(-4)$, tandanya dibalik',
        box: 'navy',
      },
      {
        id: 'a3',
        toks: [T('a3a', 'r^2=16'), O('a3b', '\\to'), T('a3c', 'r=4', 'blue')],
        note: '$\\sqrt{16}=4$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LB: [
      {
        id: 'b1',
        toks: [T('b1a', `r^{\\prime}=r=2`, '', 'PL1')],
        note: 'translasi hanya menggeser, ukurannya tetap',
      },
      {
        id: 'b2',
        toks: [T('b2a', '4', '', 'PL21'), O('b2b', '='), T('b2c', 'k\\times2')],
        note: 'dilatasi mengalikan jari-jari dengan $k$',
      },
      { id: 'b3', toks: [T('b3a', 'k=2', 'blue')], note: '$4\\div2=2$; simpan ke catatan', box: 'navy' },
      {
        id: 'b4',
        toks: [H('b4a', 'pilihan tinggal', 'tx'), T('b4b', '\\text{C}\\ \\text{dan}\\ \\text{D}')],
        note: 'A dan E memakai $k=8$, B memakai $k=4$',
      },
    ],
    LC: [
      {
        id: 'c1',
        toks: [
          T('c1a', `2\\times\\text{pusat }${L1}`, '', 'PK1'),
          O('c1b', '='),
          T('c1c', `\\text{pusat }${L2}`),
        ],
        note: 'dilatasi dari $O$ mengalikan koordinat pusat dengan $k$',
      },
      {
        id: 'c2',
        toks: [T('c2a', `2\\times(p,q)`), O('c2b', '='), T('c2c', '(-4,4)', '', 'PL21')],
      },
      {
        id: 'c3',
        toks: [T('c3a', `\\text{pusat }${L1}`), O('c3b', '='), T('c3c', '(-2,\\ 2)', 'blue')],
        note: 'mundur, tiap koordinat dibagi $2$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LD: [
      {
        id: 'd1',
        toks: [T('d1a', 'T'), O('d1b', '='), T('d1c', `\\text{pusat }${L1}-\\text{pusat }L`)],
        note: 'translasi memindahkan pusat $L$ ke pusat $L^{\\prime}$',
      },
      {
        id: 'd2',
        toks: [T('d2a', 'T'), O('d2b', '='), T('d2c', '(-2-(-5),\\ 2-3)', '', 'PP1')],
        note: 'tujuan dikurangi asal',
      },
      {
        id: 'd3',
        toks: [T('d3a', 'T'), O('d3b', '='), T('d3c', col('3', '-1'), 'blue')],
        note: 'geser $3$ ke kanan, $1$ ke bawah',
        box: 'navy',
      },
      {
        id: 'd4',
        toks: [
          H('d4a', 'Jawaban', 'lbl'),
          T('d4b', '\\textbf{C}', '', '@s-oC'),
          T('d4c', `T=${col('3', '-1')},\\ k=2`, 'gold'),
        ],
        box: 'gold',
      },
    ],
    // cek maju dari pilihan (opsional)
    LX: [
      {
        id: 'x1',
        toks: [
          T('x1a', '\\text{C}', 'blue'),
          T('x1b', '(-5,3)\\to(-2,2)\\to(-4,4)'),
          T('x1c', '\\;\\checkmark', 'blue'),
        ],
        note: 'digeser $(3,-1)$ lalu dikali $2$; jari-jari $2\\to2\\to4$, tepat $L^{\\prime\\prime}$',
      },
      {
        id: 'x2',
        toks: [
          T('x2a', '\\text{D}', 'red'),
          T('x2b', '(-5,3)\\to(-4,4)\\to(-8,8)'),
          T('x2c', '\\;\\times', 'red'),
        ],
        note: 'digeser $(1,1)$ lalu dikali $2$; jebakan, $T$ dihitung langsung dari $L$ ke $L^{\\prime\\prime}$ tanpa dilatasi',
      },
    ],
    L7: [{ id: 'w1', toks: [H('w1a', 'Jawaban', 'lbl'), T('w1b', '\\textbf{C}')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', `T=${col('3', '-1')},\\ k=2`)],
        note: '$(-5,3)\\to(-2,2)\\to(-4,4)$',
        box: 'gold',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), T('r2b', '\\textbf{C}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Lingkaran $L$ berpusat di $(-5,3)$ dengan jari-jari $2$, lalu digeser dengan translasi $T$.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 0, save: ['pL'] },
    },
    {
      ch: 1,
      cap: 'Setelah digeser, lingkaran diperbesar dari $O$ menjadi $L^{\\prime\\prime}$. Yang ditanya translasi $T$ dan faktor skala $k$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 4, from: 2 },
    },
    // ---- 2 · Lingkaran L″ ----
    {
      ch: 2,
      cap: 'Baca lingkaran akhir. Dari $(x+4)^2+(y-4)^2=16$, pusatnya $(-4,4)$, tanda di dalam kurung dibalik.',
      visual: sc({ L: true, L2: true }),
      board: { title: 'Lingkaran L″', pins: ['pL'], list: 'LA', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Ruas kanan $16$ adalah $r^2$, jadi jari-jarinya $\\sqrt{16}=4$.',
      visual: sc(BASE),
      board: { title: 'Lingkaran L″', pins: ['pL'], list: 'LA', upTo: 3, from: 2, save: ['pL2'] },
      ask: {
        before: 'a3',
        q: 'Jari-jari lingkaran dengan ruas kanan $16$ adalah…',
        opts: [
          { tex: '4', ok: true },
          { tex: '16', hint: 'Ruas kanan adalah $r^2$, bukan $r$. Akarkan $16$.' },
          { tex: '8', hint: '$16\\div2=8$ tidak dipakai di sini. Jari-jari adalah akar dari $16$.' },
        ],
      },
    },
    // ---- 3 · Faktor skala ----
    {
      ch: 3,
      cap: 'Cari faktor skala dulu dari jari-jari. Translasi hanya menggeser, jadi jari-jari $L^{\\prime}$ tetap $2$.',
      visual: sc(BASE),
      board: { title: 'Faktor skala', pins: ['pL', 'pL2'], list: 'LB', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Dilatasi mengubah jari-jari $2$ menjadi $4$, jadi $4=k\\times2$ dan $k=2$. Pilihan dengan $k=2$ tinggal C dan D.',
      visual: sc(BASE),
      board: { title: 'Faktor skala', pins: ['pL', 'pL2'], list: 'LB', upTo: 4, from: 1, save: ['pK'] },
    },
    // ---- 4 · Pusat L′ ----
    {
      ch: 4,
      cap: 'Dilatasi dari $O$ juga mengalikan pusat dengan $2$. Jadi $2\\times$ pusat $L^{\\prime}$ sama dengan $(-4,4)$.',
      visual: sc({ ...BASE, ray: true }),
      board: { title: 'Pusat L′', pins: ['pK', 'pL2'], list: 'LC', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Mundur, bagi tiap koordinat dengan $2$. Pusat $L^{\\prime}$ adalah $(-2,2)$, tepat di tengah antara $O$ dan pusat $L^{\\prime\\prime}$.',
      visual: sc({ ...BASE, ray: true, Lp: true }),
      board: { title: 'Pusat L′', pins: ['pK', 'pL2'], list: 'LC', upTo: 3, from: 2, save: ['pLp'] },
    },
    // ---- 5 · Translasi T ----
    {
      ch: 5,
      cap: 'Translasi memindahkan pusat $L(-5,3)$ ke pusat $L^{\\prime}(-2,2)$. Hitung tujuan dikurangi asal.',
      visual: sc({ ...BASE, ray: true, Lp: true, tv: true }),
      board: { title: 'Translasi T', pins: ['pL', 'pLp'], list: 'LD', upTo: 3, from: 0 },
      ask: {
        before: 'd3',
        q: 'Dari pusat $(-5,3)$ ke $(-2,2)$, translasinya…',
        opts: [
          { tex: col('3', '-1'), ok: true },
          {
            tex: col('1', '1'),
            hint: 'Itu selisih $L$ ke $L^{\\prime\\prime}$, melewatkan dilatasi. Tujuan translasi adalah $L^{\\prime}(-2,2)$.',
          },
          { tex: col('-3', '1'), hint: 'Arahnya terbalik. Hitung tujuan dikurangi asal.' },
        ],
      },
    },
    {
      ch: 5,
      cap: 'Jadi $T=(3,-1)$ dan $k=2$, yaitu pilihan C.',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Translasi T', pins: ['pL', 'pLp'], list: 'LD', upTo: 4, from: 3 },
    },
    // tawaran cek maju (opsional): Ya masuk Bagian 6, Tidak/Lewati langsung ke Bagian 7
    {
      ch: 5,
      cap: 'Mau cek maju dari pilihan, yaitu menjalankan translasi dan dilatasi pilihan C dan D pada lingkaran $L$?',
      visual: sc({ ...BASE, ray: true, Lp: true, tv: true }),
      board: { title: 'Translasi T', pins: ['pL', 'pLp'], list: 'LD', upTo: 4, from: 4 },
      branch: { yes: 'Ya, cek maju' },
    },
    // ---- 6 · Cek maju dari pilihan (opsional) ----
    {
      ch: 6,
      cap: 'Pilihan C. Lingkaran $L$ digeser $(3,-1)$ ke $(-2,2)$, lalu diperbesar $2$ kali dari $O$ dan mendarat tepat di $L^{\\prime\\prime}$.',
      visual: sc({ ...BASE, fwd: 'C' }),
      board: { title: 'Cek maju dari pilihan', pins: ['pL', 'pL2'], list: 'LX', upTo: 1, from: 0 },
    },
    {
      ch: 6,
      cap: 'Pilihan D. Digeser $(1,1)$ ke $(-4,4)$, lalu diperbesar $2$ kali menjadi pusat $(-8,8)$, meleset dari $L^{\\prime\\prime}$.',
      visual: sc({ ...BASE, fwd: 'D' }),
      board: { title: 'Cek maju dari pilihan', pins: ['pL', 'pL2'], list: 'LX', upTo: 2, from: 1 },
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
      cap: 'Cocokkan dengan pilihan. Hasilnya $T=(3,-1)$ dan $k=2$; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pK', 'pLp'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'w1',
        q: 'Translasi $T$ dan faktor skala dilatasinya adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>C</b>.',
        opts: [
          {
            tex: `T=${col('3', '-1')},\\ k=8`,
            hint: '$16$ adalah $r^2$. Jari-jarinya $4$, jadi $k=4\\div2=2$.',
          },
          {
            tex: `T=${col('3', '-1')},\\ k=4`,
            hint: '$4$ adalah jari-jari $L^{\\prime\\prime}$, bukan faktor skala.',
          },
          { tex: `T=${col('3', '-1')},\\ k=2`, ok: true },
          {
            tex: `T=${col('1', '1')},\\ k=2`,
            hint: '$(1,1)$ dihitung langsung dari $L$ ke $L^{\\prime\\prime}$, melewatkan dilatasi.',
          },
          { tex: `T=${col('1', '1')},\\ k=8`, hint: 'Translasi dan faktor skalanya sama-sama keliru.' },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">C</span><span>$L(-5,3)$ digeser $(3,-1)$ menjadi $L^{\\prime}(-2,2)$, lalu diperbesar $2$ kali menjadi $L^{\\prime\\prime}(-4,4)$ berjari-jari $4$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: '$T=(3,-1)$, $k=8$',
      ok: false,
      formula: '8\\times2=16\\ne4',
      why: '$16$ adalah $r^2$, bukan jari-jari.',
    },
    {
      label: 'B',
      statement: '$T=(3,-1)$, $k=4$',
      ok: false,
      formula: '4\\times2=8\\ne4',
      why: '$4$ adalah jari-jari $L^{\\prime\\prime}$.',
    },
    {
      label: 'C',
      statement: '$T=(3,-1)$, $k=2$',
      ok: true,
      formula: '(-2,2)\\times2=(-4,4)',
      why: 'Cocok seluruhnya.',
    },
    {
      label: 'D',
      statement: '$T=(1,1)$, $k=2$',
      ok: false,
      formula: '(-4,4)\\times2=(-8,8)',
      why: 'Translasi melewatkan dilatasi.',
    },
    { label: 'E', statement: '$T=(1,1)$, $k=8$', ok: false, formula: 'r=16\\ne4', why: 'Kedua nilai salah.' },
  ],
  notes: {
    title: 'Pembahasan Soal 20: Translasi lalu Dilatasi Lingkaran',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Transformasi geometri',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Lingkaran L″',
        lists: ['LA'],
        why: 'Lingkaran $(x-p)^2+(y-q)^2=r^2$ berpusat di $(p,q)$ dengan jari-jari $r$.',
      },
      {
        title: 'Faktor skala',
        lists: ['LB'],
        why: 'Translasi tidak mengubah jari-jari; dilatasi $[O,k]$ mengalikan jari-jari dengan $|k|$.',
      },
      {
        title: 'Pusat L′',
        lists: ['LC'],
        sketch: 'dil20',
        why: 'Dilatasi berpusat di $O$ mengalikan koordinat pusat dengan $k$, jadi untuk mundur pusatnya dibagi $k$.',
      },
      { title: 'Translasi T', lists: ['LD'] },
      { title: 'Cek maju dari pilihan (opsional)', lists: ['LX'] },
    ],
    answer: 'Jawaban: <b>C</b>, $T=(3,-1)$ dan faktor skala $2$.',
  },
  done: {
    seal: 'C',
    message:
      '$L(-5,3)$ digeser $(3,-1)$ menjadi $L^{\\prime}(-2,2)$, lalu diperbesar $2$ kali menjadi $L^{\\prime\\prime}(-4,4)$ berjari-jari $4$.',
  },
  key: {
    answer: 'C',
    cardOk: [false, false, true, false, false],
    goldRows: ['d4', 'w1', 'r1', 'r2'],
  },
  authorNotes: [
    'Modul baru (v1.52). Faktor skala dicari dulu dari jari-jari (dokumen b1–b4), sehingga pilihan langsung tinggal C dan D; pusat L′ dicari mundur (c1–c3) dan T dari selisih pusat (d1–d3). Pertanyaan cepat jari-jari dan translasi dari dokumen.',
    'Adegan dil20: L′ muncul dengan menyusut dari L″ ke arah O (skala berpusat di O), panah T dari pusat L ke pusat L′.',
    'Bagian opsional "Cek maju dari pilihan" memakai Pemeriksaan hasil dokumen untuk C dan jebakan D dari kartu dokumen. Tanpa simbol ":" di baris papan.',
  ],
};

export default q20;
