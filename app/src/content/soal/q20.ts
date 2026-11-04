/**
 * SOAL 20 — Translasi lalu Dilatasi Lingkaran (transformasi geometri; pilihan tunggal). Kunci: C (T = (3, −1), k = 2).
 * Sumber: docs/pembahasan25.md "SOAL 20", docs/soal25.md no. 20.
 * Alur revisi pemilik (v1.53, murni aljabar dengan timeline L → L′ → L″, dicatat di dokumen):
 *  - pahami: L pusat (−5, 3), r = 2; translasi T lalu dilatasi [O, k]; L″ (x + 4)² + (y − 4)² = 16; ditanya T dan k;
 *  - L: (x + 5)² + (y − 3)² = 2²;
 *  - L′: translasi dimisalkan T = (a, b), x diganti x − a dan y diganti y − b, jari-jari tetap:
 *    ((x − a) + 5)² + ((y − b) − 3)² = 2², yaitu (x − (a − 5))² + (y − (b + 3))² = 2²;
 *  - L″: dilatasi [O, k] mengalikan jari-jari dengan k (2 menjadi 2k) DAN mengalikan pusat dengan k (pusat ikut
 *    berpindah karena dilatasinya berpusat di O): (x − k(a − 5))² + (y − k(b + 3))² = (2k)² = 4k²;
 *    pertanyaan cepat: kalau pusat dianggap tetap, hasilnya T = (1, 1), jebakan pilihan D;
 *  - samakan dengan soal (x − (−4))² + (y − 4)² = 16: 4k² = 16 → k = 2; k(a − 5) = −4 → a = 3; k(b + 3) = 4 → b = −1;
 *    T = (3, −1), k = 2 → pilihan C;
 *  - bagian opsional "Cek dengan gambar" (adegan dil20): pilihan C mendarat tepat di L″, pilihan D meleset.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Dil20State } from '../../visuals/dil20';
import type { Tl20State } from '../../visuals/tl20';
import { getSoal } from '../index';

const tl = (state: Tl20State): Visual => ({ kind: 'svg', scene: 'tl20', state });
const pic = (state: Dil20State): Visual => ({ kind: 'svg', scene: 'dil20', state });
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
    lede: 'Lingkaran $L$ digeser lalu diperbesar menjadi $L^{\\prime\\prime}$. Kita ikuti persamaannya dari $L$ ke $L^{\\prime}$ ke $L^{\\prime\\prime}$, lalu samakan dengan soal.',
    facts: [
      { dt: 'L', dd: 'pusat (−5, 3), r = 2' },
      { dt: 'L″', dd: '(x+4)² + (y−4)² = 16' },
      { dt: 'Dicari', dd: 'T dan k' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Lingkaran awal dan akhir' },
    { t: 'Lingkaran L', d: 'Persamaan awal' },
    { t: 'Translasi ke L′', d: 'T = (a, b), jari-jari tetap' },
    { t: 'Dilatasi ke L″', d: 'Pusat dan jari-jari dikali k' },
    { t: 'Samakan dengan soal', d: 'k = 2, a = 3, b = −1' },
    { t: 'Cek dengan gambar', d: 'Opsional: pilihan C dan D', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban C' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pL: { id: 'pL', toks: [T('PL1', '(x+5)^2+(y-3)^2=2^2', '', 'l2a')] },
    pLp: { id: 'pLp', toks: [T('PP1', `\\text{pusat }${L1}\\ (a-5,\\ b+3),\\ r=2`, '', 't4a')] },
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
    LL: [
      { id: 'l1', toks: [T('l1a', 'L\\ (-5,3),\\ r=2', '', '@s-L')], note: 'dari soal' },
      {
        id: 'l2',
        toks: [T('l2a', '(x+5)^2+(y-3)^2=2^2', 'blue')],
        note: 'bentuk $(x-p)^2+(y-q)^2=r^2$, tanda pusat dibalik; simpan ke catatan',
        box: 'navy',
      },
    ],
    LT: [
      {
        id: 't1',
        toks: [T('t1a', 'T'), O('t1b', '='), T('t1c', '(a,b)')],
        note: 'translasi dimisalkan $a$ dan $b$',
      },
      {
        id: 't2',
        toks: [T('t2a', 'x\\to x-a'), O('t2b', ','), T('t2c', 'y\\to y-b')],
        note: 'masukkan ke persamaan $L$',
      },
      {
        id: 't3',
        toks: [T('t3a', '\\begin{aligned}&((x-a)+5)^2+((y-b)-3)^2\\\\&=2^2\\end{aligned}', '', 'PL1')],
        note: 'jari-jari tetap $2$',
      },
      {
        id: 't4',
        toks: [T('t4a', '\\begin{aligned}&(x-(a-5))^2+(y-(b+3))^2\\\\&=2^2\\end{aligned}', 'blue')],
        note: `$${L1}$ berpusat di $(a-5,\\ b+3)$, translasi tidak mengubah jari-jari; simpan ke catatan`,
        box: 'navy',
      },
    ],
    LD: [
      {
        id: 'd1',
        toks: [T('d1a', 'r=2\\to2k', '', 'PP1')],
        note: 'dilatasi mengalikan jari-jari dengan $k$',
      },
      {
        id: 'd2',
        toks: [H('d2a', 'pusat', 'tx'), T('d2b', '(k(a-5),\\ k(b+3))')],
        note: 'pusat $(a-5,\\ b+3)$ ikut dikali $k$, karena dilatasinya berpusat di $O$',
      },
      {
        id: 'd3',
        toks: [T('d3a', '\\begin{aligned}&(x-k(a-5))^2+(y-k(b+3))^2\\\\&=(2k)^2=4k^2\\end{aligned}', 'blue')],
        note: `persamaan $${L2}$, $(2k)^2=4k^2$`,
        box: 'navy',
      },
    ],
    LE: [
      {
        id: 'e1',
        toks: [T('e1a', '(x+4)^2+(y-4)^2=16', '', '@s-L2')],
        note: 'dari soal, sama dengan $(x-(-4))^2+(y-4)^2=16$',
      },
      {
        id: 'e2',
        toks: [T('e2a', '4k^2=16'), O('e2b', '\\to'), T('e2c', 'k=2', 'blue')],
        note: '$k^2=4$; faktor skala pada pilihan positif',
      },
      {
        id: 'e3',
        toks: [T('e3a', 'k(a-5)=-4'), O('e3b', '\\to'), T('e3c', 'a=3', 'blue')],
        note: '$2(a-5)=-4$, jadi $a-5=-2$',
      },
      {
        id: 'e4',
        toks: [T('e4a', 'k(b+3)=4'), O('e4b', '\\to'), T('e4c', 'b=-1', 'blue')],
        note: '$2(b+3)=4$, jadi $b+3=2$',
      },
      {
        id: 'e5',
        toks: [
          H('e5a', 'Jawaban', 'lbl'),
          T('e5b', '\\textbf{C}', '', '@s-oC'),
          T('e5c', `T=${col('3', '-1')},\\ k=2`, 'gold'),
        ],
        box: 'gold',
      },
    ],
    // cek dengan gambar (opsional)
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
        note: 'digeser $(1,1)$ lalu dikali $2$; pusatnya ikut dikali $2$, jadi meleset',
      },
    ],
    L7: [{ id: 'w1', toks: [H('w1a', 'Jawaban', 'lbl'), T('w1b', '\\textbf{C}')], box: 'gold' }],
    LR: [
      { id: 'r1', toks: [T('r1a', `T=${col('3', '-1')},\\ k=2`)], note: '$a=3$, $b=-1$, $k=2$', box: 'gold' },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), T('r2b', '\\textbf{C}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Lingkaran $L$ berpusat di $(-5,3)$ dengan jari-jari $2$, lalu digeser dengan translasi $T$.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 0 },
    },
    {
      ch: 1,
      cap: 'Setelah digeser, lingkaran didilatasi dari $O$ menjadi $L^{\\prime\\prime}$. Yang ditanya translasi $T$ dan faktor skala $k$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 4, from: 2 },
    },
    // ---- 2 · Lingkaran L ----
    {
      ch: 2,
      cap: 'Mulai dari $L$. Pusat $(-5,3)$ dan jari-jari $2$ memberi persamaan $(x+5)^2+(y-3)^2=2^2$.',
      visual: tl({ view: 'tl', n: 1 }),
      board: { title: 'Lingkaran L', list: 'LL', upTo: 2, from: 0, save: ['pL'] },
    },
    // ---- 3 · Translasi ke L′ ----
    {
      ch: 3,
      cap: 'Misalkan translasinya $T=(a,b)$. Pada persamaan, $x$ diganti $x-a$ dan $y$ diganti $y-b$, sedangkan jari-jarinya tetap $2$.',
      visual: tl({ view: 'tl', n: 2, m: 0 }),
      board: { title: 'Translasi ke L′', pins: ['pL'], list: 'LT', upTo: 3, from: 0 },
    },
    {
      ch: 3,
      cap: 'Rapikan isi kurungnya. Jadi $L^{\\prime}$ berpusat di $(a-5,\\ b+3)$ dengan jari-jari tetap $2$.',
      visual: tl({ view: 'tl', n: 2, m: 1 }),
      board: { title: 'Translasi ke L′', pins: ['pL'], list: 'LT', upTo: 4, from: 3, save: ['pLp'] },
    },
    // ---- 4 · Dilatasi ke L″ ----
    {
      ch: 4,
      cap: 'Dilatasi $[O,k]$ mengalikan jari-jari dengan $k$, jadi $2$ menjadi $2k$. Pusatnya juga dikali $k$, karena dilatasinya berpusat di $O$.',
      visual: tl({ view: 'tl', n: 3, m: 0 }),
      board: { title: 'Dilatasi ke L″', pins: ['pLp'], list: 'LD', upTo: 2, from: 0 },
      ask: {
        before: 'd2',
        q: 'Pada dilatasi berpusat di $O(0,0)$, pusat lingkaran…',
        col: true,
        opts: [
          { txt: 'Ikut dikali k, menjadi (k(a − 5), k(b + 3))', ok: true },
          {
            txt: 'Tetap di (a − 5, b + 3)',
            hint: 'Dilatasi dari $O$ memindahkan setiap titik $(x,y)$ ke $(kx,ky)$, termasuk pusat. Kalau pusat dianggap tetap, hasilnya $T=(1,1)$, jebakan pilihan D.',
          },
        ],
      },
    },
    {
      ch: 4,
      cap: 'Tulis persamaan $L^{\\prime\\prime}$ dengan pusat baru dan jari-jari $2k$. Ruas kanannya $(2k)^2=4k^2$.',
      visual: tl({ view: 'tl', n: 3, m: 1 }),
      board: { title: 'Dilatasi ke L″', pins: ['pLp'], list: 'LD', upTo: 3, from: 2 },
    },
    // ---- 5 · Samakan dengan soal ----
    {
      ch: 5,
      cap: 'Samakan hasil aljabar dengan persamaan dari soal. Bagian yang warnanya sama harus bernilai sama.',
      visual: tl({ view: 'cmp', s: 0 }),
      board: { title: 'Samakan dengan soal', list: 'LE', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Ruas kanan, $4k^2=16$, jadi $k^2=4$ dan $k=2$.',
      visual: tl({ view: 'cmp', s: 1 }),
      board: { title: 'Samakan dengan soal', list: 'LE', upTo: 2, from: 1 },
      ask: {
        before: 'e2',
        q: 'Dari $4k^2=16$, faktor skalanya $k=$…',
        opts: [
          { tex: '2', ok: true },
          { tex: '4', hint: '$4k^2=16$ memberi $k^2=4$, jadi $k=2$.' },
          { tex: '8', hint: 'Bagi dulu dengan $4$, lalu akarkan. $k^2=4$.' },
        ],
      },
    },
    {
      ch: 5,
      cap: 'Bagian $x$, $k(a-5)=-4$. Dengan $k=2$, $a-5=-2$, jadi $a=3$.',
      visual: tl({ view: 'cmp', s: 2 }),
      board: { title: 'Samakan dengan soal', list: 'LE', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: 'Bagian $y$, $k(b+3)=4$. Dengan $k=2$, $b+3=2$, jadi $b=-1$.',
      visual: tl({ view: 'cmp', s: 3 }),
      board: { title: 'Samakan dengan soal', list: 'LE', upTo: 4, from: 3 },
    },
    {
      ch: 5,
      cap: 'Jadi $T=(3,-1)$ dan faktor skalanya $2$, yaitu pilihan C.',
      visual: tl({ view: 'cmp', s: 4 }),
      board: { title: 'Samakan dengan soal', list: 'LE', upTo: 5, from: 4 },
    },
    // tawaran cek dengan gambar (opsional): Ya masuk Bagian 6, Tidak/Lewati langsung ke Bagian 7
    {
      ch: 5,
      cap: 'Mau cek dengan gambar, yaitu menjalankan translasi dan dilatasi pilihan C dan D pada lingkaran $L$?',
      visual: tl({ view: 'cmp', s: 4 }),
      board: { title: 'Samakan dengan soal', list: 'LE', upTo: 5, from: 5 },
      branch: { yes: 'Ya, cek dengan gambar' },
    },
    // ---- 6 · Cek dengan gambar (opsional) ----
    {
      ch: 6,
      cap: 'Pilihan C. Lingkaran $L$ digeser $(3,-1)$ ke $(-2,2)$, lalu didilatasi $2$ kali dari $O$ dan mendarat tepat di $L^{\\prime\\prime}$.',
      visual: pic({ ...BASE, fwd: 'C' }),
      board: { title: 'Cek dengan gambar', list: 'LX', upTo: 1, from: 0 },
    },
    {
      ch: 6,
      cap: 'Pilihan D. Digeser $(1,1)$ ke $(-4,4)$, lalu didilatasi $2$ kali sehingga pusatnya pindah ke $(-8,8)$, meleset dari $L^{\\prime\\prime}$.',
      visual: pic({ ...BASE, fwd: 'D' }),
      board: { title: 'Cek dengan gambar', list: 'LX', upTo: 2, from: 1 },
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
      board: { title: 'Cocokkan pilihan', pins: ['pLp'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'w1',
        q: 'Translasi $T$ dan faktor skala dilatasinya adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>C</b>.',
        opts: [
          { tex: `T=${col('3', '-1')},\\ k=8`, hint: '$4k^2=16$ memberi $k=2$, bukan $8$.' },
          {
            tex: `T=${col('3', '-1')},\\ k=4`,
            hint: '$4$ adalah jari-jari $L^{\\prime\\prime}$, bukan faktor skala.',
          },
          { tex: `T=${col('3', '-1')},\\ k=2`, ok: true },
          {
            tex: `T=${col('1', '1')},\\ k=2`,
            hint: 'Itu hasil bila pusat dianggap tidak ikut dikali $k$. Pusatnya ikut dikali $k$.',
          },
          { tex: `T=${col('1', '1')},\\ k=8`, hint: 'Translasi dan faktor skalanya sama-sama keliru.' },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">C</span><span>Dari $L\\to L^{\\prime}\\to L^{\\prime\\prime}$ diperoleh $4k^2=16$, $k(a-5)=-4$, $k(b+3)=4$, jadi $T=(3,-1)$ dan $k=2$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: '$T=(3,-1)$, $k=8$',
      ok: false,
      formula: '4\\cdot8^2\\ne16',
      why: '$4k^2=16$ memberi $k=2$.',
    },
    {
      label: 'B',
      statement: '$T=(3,-1)$, $k=4$',
      ok: false,
      formula: '4\\cdot4^2\\ne16',
      why: '$4$ adalah jari-jari $L^{\\prime\\prime}$.',
    },
    {
      label: 'C',
      statement: '$T=(3,-1)$, $k=2$',
      ok: true,
      formula: 'a=3,\\ b=-1,\\ k=2',
      why: 'Cocok seluruhnya.',
    },
    {
      label: 'D',
      statement: '$T=(1,1)$, $k=2$',
      ok: false,
      formula: '2(1-5)=-8\\ne-4',
      why: 'Jebakan, pusat dianggap tidak ikut dikali $k$.',
    },
    {
      label: 'E',
      statement: '$T=(1,1)$, $k=8$',
      ok: false,
      formula: '4\\cdot8^2\\ne16',
      why: 'Kedua nilai salah.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 20: Translasi lalu Dilatasi Lingkaran',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Transformasi geometri',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Lingkaran L',
        lists: ['LL'],
        why: 'Lingkaran $(x-p)^2+(y-q)^2=r^2$ berpusat di $(p,q)$ dengan jari-jari $r$.',
      },
      {
        title: 'Translasi ke L′',
        lists: ['LT'],
        why: 'Translasi $(a,b)$ hanya menggeser, jadi pada persamaan $x$ diganti $x-a$ dan $y$ diganti $y-b$, jari-jari tetap.',
      },
      {
        title: 'Dilatasi ke L″',
        lists: ['LD'],
        why: 'Dilatasi $[O,k]$ memetakan $(x,y)$ ke $(kx,ky)$, jadi pusat dan jari-jari sama-sama dikali $k$.',
      },
      { title: 'Samakan dengan soal', lists: ['LE'] },
      { title: 'Cek dengan gambar (opsional)', lists: ['LX'], sketch: 'dil20' },
    ],
    answer: 'Jawaban: <b>C</b>, $T=(3,-1)$ dan faktor skala $2$.',
  },
  done: {
    seal: 'C',
    message:
      'Dari $L\\to L^{\\prime}\\to L^{\\prime\\prime}$ diperoleh $4k^2=16$, $k(a-5)=-4$, $k(b+3)=4$, jadi $T=(3,-1)$ dan $k=2$.',
  },
  key: {
    answer: 'C',
    cardOk: [false, false, true, false, false],
    goldRows: ['e5', 'w1', 'r1', 'r2'],
  },
  authorNotes: [
    'Revisi pemilik (v1.53): murni aljabar dengan timeline L → L′ → L″. Translasi dimisalkan T = (a, b) dan dimasukkan ke persamaan L (x → x − a, y → y − b), jari-jari tetap 2; dilatasi mengubah jari-jari 2 menjadi 2k sehingga ruas kanan (2k)² = 4k².',
    'Koreksi matematis: dilatasi berpusat di O(0, 0) juga mengalikan koordinat pusat dengan k (dokumen c1–c3). Kalau pusat dianggap tetap, penyamaan memberi T = (1, 1) dan k = 2, yaitu jebakan pilihan D; hal ini dijadikan pertanyaan cepat. Kunci tetap C.',
    'Penyamaan dengan soal (x − (−4))² + (y − 4)² = 16 memakai warna pasangan: 4k² = 16, k(a − 5) = −4, k(b + 3) = 4, jadi k = 2, a = 3, b = −1. Cek dengan gambar (adegan dil20) menjadi bagian opsional. Tanpa simbol ":" di baris papan.',
  ],
};

export default q20;
