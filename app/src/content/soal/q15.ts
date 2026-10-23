/**
 * SOAL 15 — Lingkaran yang Sepusat (lingkaran; pilihan tunggal). Kunci: A.
 * Sumber: docs/pembahasan25.md "SOAL 15", docs/soal25.md no. 15, docs/lingkaran_A.png.
 * Alur cara Pak Penta menyampaikan ke siswa (revisi pemilik v1.15, dicatat di dokumen): cari dulu pusat dan
 * jari-jari → pusat: perbesar ke p, geser ke sumbu x (−3) dan sumbu y (4) → jari-jari: hitung kotak dari pusat
 * turun ke titik terbawah (y = 2), r = 4 − 2 = 2 → dua bentuk persamaan (baku, umum) beserta rumus pusat dan
 * jari-jari bentuk umum → masukkan pusat dan jari-jari ke bentuk baku, jabarkan menjadi bentuk umum
 * x² + 6x + y² − 8y + 21 = 0 → cocokkan dengan pilihan (hati-hati: yang ditanya SEPUSAT, cukup +6x dan −8y)
 * → pastikan A dengan rumus bentuk umum, hati-hati dengan B.
 * Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Step, Visual } from '../../engine/types';
import type { CircState, Opt } from '../../visuals/circ15';
import { getSoal } from '../index';

/** Gambar asli soal (docs/lingkaran_A.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/lingkaran_A.png', import.meta.url).href;
const circ = (state: CircState): Visual => ({ kind: 'svg', scene: 'circ15', state });
/** catatan: pusat, jari-jari, bentuk baku, hasil bentuk umum lingkaran A */
const N1 = ['pP'];
const N2 = ['pP', 'pR'];
const N3 = ['pP', 'pR', 'pBaku'];
const N4 = ['pP', 'pR', 'pHasil'];
const LETTERS: Opt[] = ['A', 'B', 'C', 'D', 'E'];
/** Kelima pilihan (docs/soal25.md no. 15): kertas soal dan kutipan di papan memakai teks yang sama. */
const OPTS: Record<Opt, string> = {
  A: 'x^{2}+6x+y^{2}-8y+16=0',
  B: 'x^{2}-6x+y^{2}-8y+21=0',
  C: 'x^{2}+6x+y^{2}+8y+16=0',
  D: 'x^{2}-8x+y^{2}-6y+16=0',
  E: 'x^{2}+8x+y^{2}-6y+21=0',
};
const quote = (o: Opt): Row => ({
  id: `c${o}`,
  toks: [T(`c${o}a`, `\\text{${o}}`, 'sp'), H(`c${o}b`, `$${OPTS[o]}$`, 'q', `@s-o${o}`)],
});
/**
 * baris cocokkan: suku x dan suku y pilihan (terbang dari kutipan) dibandingkan dengan +6x dan −8y di catatan;
 * pusatnya (−A/2, −B/2) ditulis sesudah tanda ⇒.
 */
const match = (
  o: Opt,
  xs: string,
  ys: string,
  okX: boolean,
  okY: boolean,
  ctr: string,
  note: string,
): Row => {
  const ok = okX && okY;
  return {
    id: `o${o}`,
    toks: [
      T(`o${o}x`, xs, okX ? 'blue' : 'red', `c${o}b`),
      T(`o${o}y`, ys, okY ? 'blue' : 'red', `c${o}b`),
      O(`o${o}r`, '\\Rightarrow'),
      H(`o${o}t`, 'pusat', 'tx'),
      T(`o${o}c`, ctr, ok ? 'gold' : 'red'),
    ],
    note,
    ...(ok ? { box: 'gold' as const } : {}),
  };
};
const open6 = (o: Opt, cap: string): Step => ({
  ch: 6,
  cap,
  visual: { kind: 'soal', hl: 0, focus: `s-o${o}` },
  board: { title: `Pilihan ${o}`, pins: N4, list: `L6${o}`, upTo: 1, from: 0 },
});
const check6 = (o: Opt, cap: string): Step => ({
  ch: 6,
  cap,
  // pusat C di bawah sumbu x: bidang utuh
  visual: circ(o === 'C' ? { opts: [o], cam: 'wide' } : { opts: [o] }),
  board: { title: `Pilihan ${o}`, pins: N4, list: `L6${o}`, upTo: 2, from: 1 },
});

const q15: SoalContent = {
  meta: getSoal(15)!,
  sourceRef: 'docs/pembahasan25.md#soal-15',
  layout: 'full',
  paper: {
    html: `<div class="soal-split"><div>
<p>Perhatikan gambar lingkaran berikut.</p>
<p><span class="hl hl-red" data-hl="1"><span data-src="s-d">Diameter lingkaran pada gambar adalah 4 satuan</span></span>. <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">Persamaan lingkaran yang <span class="hl hl-blue" data-hl="3"><span data-src="s-pusat">sepusat</span></span> dengan lingkaran pada gambar</span></span> tersebut adalah ....</p>
</div><figure class="soal-fig"><img src="${fig}" width="529" height="591" alt="Bidang koordinat dengan Lingkaran A; titik pusat p berada di x = −3 (di antara label −4 dan −2) dan y = 4; sebuah diameter melewati p." /></figure></div>
<ol class="abc abc-col">
${LETTERS.map((o) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">$${OPTS[o]}$</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-d', 's-tanya', 's-pusat', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['g-p', 'g-x', 'g-y', 'g-low', 'g-d'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Lingkaran',
    titleLines: ['Pembahasan Soal', 'Lingkaran <span class="accent">Sepusat</span>', 'Koordinat'],
    lede: 'Lingkaran A sudah digambar di bidang koordinat. Persamaan mana yang menggambarkan lingkaran lain dengan pusat yang sama?',
    facts: [
      { dt: 'Diameter', dd: '4 satuan' },
      { dt: 'Pusat', dd: 'terbaca dari grafik' },
      { dt: 'Dicari', dd: 'persamaan sepusat' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Cari pusat dan jari-jari' },
    { t: 'Pusat dan jari-jari', d: 'Dibaca dari gambar' },
    { t: 'Rumus lingkaran', d: 'Bentuk baku dan umum' },
    { t: 'Baku ke umum', d: 'Masukkan lalu jabarkan' },
    { t: 'Cocokkan hasil', d: 'Hati-hati: sepusat' },
    { t: 'Uji kelima pilihan', d: 'Satu per satu' },
    { t: 'Pastikan jawaban', d: 'Rumus bentuk umum' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Jawaban A' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pP: {
      id: 'pP',
      toks: [
        H('PP0', 'pusat', 'tx', 'a4a'),
        O('PP1', '='),
        T('PP2', '(', '', 'a4b'),
        T('PPx', '-3', '', 'a4c'),
        T('PP3', ',\\ ', '', 'a4d'),
        T('PPy', '4', '', 'a4e'),
        T('PP4', ')', '', 'a4f'),
      ],
    },
    pR: {
      id: 'pR',
      toks: [T('PR0', 'r', '', 'r2a'), O('PR1', '='), T('PRv', '2', '', 'r2g')],
    },
    pBaku: {
      id: 'pBaku',
      toks: [T('PB0', '(x-a)^2+(y-b)^2=r^2', '', 'f1b')],
    },
    pHasil: {
      id: 'pHasil',
      toks: [
        T('PH1', 'x^2', '', 'j4a'),
        T('PH2', '+6x', '', 'j4b'),
        T('PH3', '+y^2', '', 'j4c'),
        T('PH4', '-8y', '', 'j4d'),
        T('PH5', '+21', '', 'j4e'),
        T('PH6', '=0', '', 'j4f'),
      ],
    },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [H('k1a', 'Ditanya', 'lbl'), H('k1b', 'persamaan lingkaran sepusat', 'gold', '@s-tanya')],
        note: 'sepusat dengan lingkaran A pada gambar',
      },
      {
        id: 'k2',
        toks: [H('k2a', 'Langkah pertama', 'lbl'), H('k2b', 'cari pusat dan jari-jari lingkaran A', 'tx')],
        note: 'keduanya dibaca dari gambar',
      },
    ],
    LP: [
      {
        id: 'a1',
        toks: [
          H('a1a', 'pusat', 'tx'),
          O('a1b', '='),
          H('a1c', 'titik', 'tx'),
          T('a1d', 'p', 'blue', '@g-p'),
        ],
      },
      {
        id: 'a2',
        toks: [T('a2a', 'x'), O('a2b', '='), T('a2c', '-3', 'blue', '@g-x')],
        note: 'garis dari $p$ lurus ke bawah, di tengah antara $-4$ dan $-2$',
      },
      {
        id: 'a3',
        toks: [T('a3a', 'y'), O('a3b', '='), T('a3c', '4', 'blue', '@g-y')],
        note: 'garis dari $p$ lurus ke kanan',
      },
      {
        id: 'a4',
        toks: [
          H('a4a', 'pusat', 'tx'),
          O('a4o', '='),
          T('a4b', '('),
          T('a4c', '-3', 'blue', 'a2c'),
          T('a4d', ',\\ '),
          T('a4e', '4', 'blue', 'a3c'),
          T('a4f', ')'),
        ],
        note: '$x$ dulu, baru $y$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LR: [
      {
        id: 'r1',
        toks: [
          H('r1a', 'titik terbawah', 'tx'),
          T('r1b', 'y'),
          O('r1c', '='),
          T('r1d', '2', 'blue', '@g-low'),
        ],
        note: 'dari $p$ turun $2$ kotak',
      },
      {
        id: 'r2',
        toks: [
          T('r2a', 'r'),
          O('r2b', '='),
          T('r2c', '4', '', 'PPy'),
          O('r2d', '-'),
          T('r2e', '2', '', 'r1d'),
          O('r2f', '='),
          T('r2g', '2', 'blue'),
        ],
        note: 'selisih $y$ pusat dan titik terbawah; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'r3',
        toks: [
          H('r3a', 'Cek', 'lbl'),
          H('r3b', 'diameter', 'tx'),
          O('r3c', '='),
          T('r3d', '2\\times'),
          T('r3e', '2', '', 'PRv'),
          O('r3f', '='),
          T('r3g', '4', 'blue', '@g-d'),
        ],
        note: 'sama dengan soal: diameter $4$ satuan',
      },
    ],
    LF: [
      {
        id: 'f1',
        toks: [H('f1a', 'Baku', 'lbl'), T('f1b', '(x-a)^2+(y-b)^2=r^2', 'blue')],
        note: 'pusat $(a,b)$, jari-jari $r$; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'f2',
        toks: [H('f2a', 'Umum', 'lbl'), T('f2b', 'x^2+y^2+Ax+By+C=0', 'blue')],
        note: 'hasil menjabarkan bentuk baku',
        box: 'navy',
      },
      {
        id: 'f3',
        toks: [
          H('f3a', 'pusat', 'tx'),
          O('f3b', '='),
          T('f3c', '\\left(-\\tfrac A2,\\ -\\tfrac B2\\right)', 'blue'),
        ],
        note: 'rumus pusat dari bentuk umum',
      },
      {
        id: 'f4',
        toks: [
          T('f4a', 'r'),
          O('f4b', '='),
          T('f4c', '\\sqrt{\\left(-\\tfrac A2\\right)^2+\\left(-\\tfrac B2\\right)^2-C}', 'blue'),
        ],
        note: 'rumus jari-jari dari bentuk umum',
      },
    ],
    LB: [
      {
        id: 'j1',
        toks: [
          T('j1a', '(x-'),
          T('j1b', '(-3)', 'blue', 'PPx'),
          T('j1c', ')^2+(y-'),
          T('j1d', '4', 'blue', 'PPy'),
          T('j1e', ')^2'),
          O('j1f', '='),
          T('j1g', '2^2', 'blue', 'PRv'),
        ],
        note: 'bentuk baku dengan $a=-3$, $b=4$, $r=2$ dari catatan',
      },
      {
        id: 'j2',
        toks: [T('j2a', '(x+3)^2+(y-4)^2'), O('j2b', '='), T('j2c', '4')],
        note: '$-(-3)=+3$ dan $2^2=4$',
      },
    ],
    // jabarkan, lalu 4 pindah ruas (terbang melewati "=" menjadi −4) dan angkanya dihitung (revisi pemilik v1.16)
    LJ: [
      {
        id: 'j3',
        toks: [
          T('j3a', 'x^2+6x'),
          T('j3b', '+9'),
          T('j3c', '+y^2-8y'),
          T('j3d', '+16'),
          O('j3e', '='),
          T('j3f', '4'),
        ],
        note: '$(x+3)^2=x^2+6x+9$ dan $(y-4)^2=y^2-8y+16$',
      },
      {
        id: 'j5',
        toks: [
          T('j5a', 'x^2+6x', '', 'j3a'),
          T('j5c', '+y^2-8y', '', 'j3c'),
          T('j5b', '+9', 'blue', 'j3b'),
          T('j5d', '+16', 'blue', 'j3d'),
          T('j5f', '-4', 'red', 'j3f'),
          O('j5e', '='),
          T('j5g', '0'),
        ],
        note: '$4$ pindah ke ruas kiri menjadi $-4$, berkumpul dengan $+9$ dan $+16$',
      },
      {
        id: 'j6',
        toks: [
          T('j6a', '9', '', 'j5b'),
          T('j6b', '+16', '', 'j5d'),
          T('j6c', '-4', '', 'j5f'),
          O('j6d', '='),
          T('j6e', '21', 'blue'),
        ],
        note: 'hitung angkanya',
      },
      {
        id: 'j4',
        toks: [
          T('j4a', 'x^2', '', 'j5a'),
          T('j4b', '+6x', 'blue', 'j5a'),
          T('j4c', '+y^2', '', 'j5c'),
          T('j4d', '-8y', 'blue', 'j5c'),
          T('j4e', '+21', 'blue', 'j6e'),
          T('j4f', '=0'),
        ],
        note: 'bentuk umum lingkaran A; simpan ke catatan',
        box: 'navy',
      },
    ],
    LM: [
      {
        id: 'm1',
        toks: [
          H('m1a', 'hasil kita', 'tx'),
          T('m1b', '+6x', 'blue', 'PH2'),
          T('m1c', '-8y', 'blue', 'PH4'),
          T('m1d', '+21', 'blue', 'PH5'),
        ],
        note: 'tidak ada pilihan yang persis sama',
      },
      {
        id: 'm2',
        toks: [
          H('m2a', 'sepusat', 'blue', '@s-pusat'),
          O('m2b', '='),
          H('m2c', 'pusat sama, jari-jari boleh beda', 'tx'),
        ],
      },
      {
        id: 'm3',
        toks: [
          H('m3a', 'cukup cocokkan', 'tx'),
          T('m3b', '+6x', 'blue', 'PH2'),
          T('m3c', '-8y', 'blue', 'PH4'),
        ],
        note: '$A$ dan $B$ menentukan pusat; $C$ hanya mengubah jari-jari, jadi $21$ boleh beda',
      },
    ],
    L6A: [
      quote('A'),
      match(
        'A',
        '+6x',
        '-8y',
        true,
        true,
        '(-3,\\ 4)',
        'sama dengan $+6x$ dan $-8y$ di catatan → <b class="k-gold">sepusat</b>',
      ),
    ],
    L6B: [
      quote('B'),
      match(
        'B',
        '-6x',
        '-8y',
        false,
        true,
        '(3,\\ 4)',
        '$-6x$, seharusnya $+6x$ → <b class="k-red">bukan</b>',
      ),
    ],
    L6C: [
      quote('C'),
      match(
        'C',
        '+6x',
        '+8y',
        true,
        false,
        '(-3,\\ -4)',
        '$+8y$, seharusnya $-8y$ → <b class="k-red">bukan</b>',
      ),
    ],
    L6D: [
      quote('D'),
      match(
        'D',
        '-8x',
        '-6y',
        false,
        false,
        '(4,\\ 3)',
        'angka $x$ dan $y$ tertukar → <b class="k-red">bukan</b>',
      ),
    ],
    L6E: [
      quote('E'),
      match(
        'E',
        '+8x',
        '-6y',
        false,
        false,
        '(-4,\\ 3)',
        'angka $x$ dan $y$ tertukar → <b class="k-red">bukan</b>',
      ),
    ],
    LK: [
      {
        id: 'g1',
        toks: [
          H('g1a', 'pusat', 'tx'),
          O('g1b', '='),
          T('g1c', '\\left(-\\tfrac{6}{2},\\ -\\tfrac{-8}{2}\\right)'),
          O('g1d', '='),
          T('g1e', '(-3,\\ 4)', 'blue'),
        ],
        note: 'pilihan A: $A=6$, $B=-8$; sama dengan pusat di catatan',
      },
      {
        id: 'g2',
        toks: [
          T('g2a', 'r'),
          O('g2b', '='),
          T('g2c', '\\sqrt{(-3)^2+4^2-16}'),
          O('g2d', '='),
          T('g2e', '\\sqrt9'),
          O('g2f', '='),
          T('g2g', '3', 'blue'),
        ],
        note: '$C=16$',
        box: 'navy',
      },
      {
        id: 'g3',
        toks: [T('g3a', 'r=3'), O('g3b', '\\ne'), T('g3c', 'r'), O('g3e', '='), T('g3d', '2', '', 'PRv')],
        note: 'tidak masalah: sepusat hanya meminta pusat sama',
      },
      {
        id: 'g4',
        toks: [H('g4a', 'Hati-hati', 'lbl'), H('g4b', 'B: +21 sama, tetapi pusatnya (3, 4)', 'tx')],
        note: 'konstanta $21$ memberi $r=2$ seperti lingkaran A, tetapi $-6x$ menggeser pusat → bukan sepusat',
      },
    ],
    L7: [{ id: 's1', toks: [H('s1a', 'Jawaban', 'lbl'), H('s1b', 'A', 'tx')], box: 'gold' }],
    LS: [
      {
        id: 'y1',
        toks: [T('y1a', '\\text{pusat}=(-3,\\ 4)')],
        note: 'hanya pilihan A yang berpusat di sana',
        box: 'navy',
      },
      { id: 'y2', toks: [H('y2a', 'Jawaban', 'lbl'), H('y2b', 'A', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan gambar pada soal. Kita diminta mencari persamaan lingkaran yang sepusat dengan lingkaran A.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Untuk soal persamaan lingkaran, langkah pertama selalu sama: cari dulu titik pusat dan jari-jarinya.',
      visual: circ({ rad: true, lab: 'ask' }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Pusat dan jari-jari ----
    {
      ch: 2,
      cap: 'Perhatikan titik $p$, itulah pusat lingkaran A. Kita perbesar di sekitar titik $p$.',
      visual: circ({ cam: 'p' }),
      board: { title: 'Pusat lingkaran A', list: 'LP', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Dari $p$ tarik garis lurus ke bawah sampai sumbu $x$. Garis jatuh di $x=-3$, tepat di tengah antara $-4$ dan $-2$.',
      visual: circ({ cam: 'x', rx: true }),
      board: { title: 'Pusat lingkaran A', list: 'LP', upTo: 2, from: 1 },
    },
    {
      ch: 2,
      cap: 'Dari $p$ tarik garis ke kanan sampai sumbu $y$: $y=4$. Jadi pusatnya $(-3,4)$, kita simpan ke catatan.',
      visual: circ({ cam: 'y', rx: true, ry: true }),
      board: { title: 'Pusat lingkaran A', list: 'LP', upTo: 4, from: 2, save: ['pP'] },
      ask: {
        before: 'a4',
        q: 'Dengan $x=-3$ dan $y=4$, titik pusatnya ditulis…',
        opts: [
          { tex: '(-3,\\ 4)', ok: true },
          { tex: '(4,\\ -3)', hint: 'Urutan koordinat tertukar. Pertama $x$ (mendatar), baru $y$ (tegak).' },
          { tex: '(3,\\ 4)', hint: '$p$ berada di sebelah kiri sumbu $y$, jadi $x$-nya negatif.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Jari-jari: hitung kotak dari pusat ke lingkaran. Dari $p$ turun $2$ kotak, titik terbawah di $y=2$, jadi $r=4-2=2$.',
      visual: circ({ cam: 'r', ry: true, count: true }),
      board: { title: 'Jari-jari lingkaran A', pins: N1, list: 'LR', upTo: 2, from: 0, save: ['pR'] },
    },
    {
      ch: 2,
      cap: 'Cek dengan soal: diameternya $4$, jadi jari-jarinya $2$, cocok. Data kita lengkap: pusat $(-3,4)$ dan jari-jari $2$.',
      visual: circ({ rad: true, dlab: true }),
      board: { title: 'Jari-jari lingkaran A', pins: N2, list: 'LR', upTo: 3, from: 2 },
    },
    // ---- 3 · Rumus lingkaran ----
    {
      ch: 3,
      cap: 'Tahukah kalian? Bentuk baku persamaan lingkaran adalah $(x-a)^2+(y-b)^2=r^2$, dengan pusat $(a,b)$ dan jari-jari $r$.',
      visual: circ({ rad: true, lab: 'ab' }),
      board: { title: 'Rumus lingkaran', pins: N2, list: 'LF', upTo: 1, from: 0, save: ['pBaku'] },
    },
    {
      ch: 3,
      cap: 'Kalau bentuk baku dijabarkan, kita dapat bentuk umum: $x^2+y^2+Ax+By+C=0$.',
      visual: circ({ rad: true, lab: 'ab', panel: 'forms' }),
      board: { title: 'Rumus lingkaran', pins: N3, list: 'LF', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Dari bentuk umum, pusatnya $\\left(-\\frac A2,-\\frac B2\\right)$ dan jari-jarinya $\\sqrt{\\left(-\\frac A2\\right)^2+\\left(-\\frac B2\\right)^2-C}$. Tolong diingat semua rumus ini ya.',
      visual: circ({ rad: true, lab: 'AB', panel: 'forms' }),
      board: { title: 'Rumus lingkaran', pins: N3, list: 'LF', upTo: 4, from: 2 },
    },
    // ---- 4 · Baku ke umum ----
    {
      ch: 4,
      cap: 'Kembali ke soal. Pilihan jawabannya berbentuk umum, jadi masukkan dulu pusat dan jari-jari ke bentuk baku.',
      visual: circ({ rad: true, lab: 'num' }),
      board: { title: 'Masukkan ke bentuk baku', pins: N3, list: 'LB', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Rapikan tandanya: $-(-3)$ menjadi $+3$ dan $2^2=4$. Inilah bentuk baku lingkaran A.',
      visual: circ({ rad: true, lab: 'num', panel: 'baku' }),
      board: { title: 'Masukkan ke bentuk baku', pins: N2, list: 'LB', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: 'Sekarang jabarkan kedua kuadrat: $(x+3)^2=x^2+6x+9$ dan $(y-4)^2=y^2-8y+16$.',
      visual: circ({ rad: true, lab: 'num', panel: 'jabar' }),
      board: { title: 'Jabarkan', pins: N2, list: 'LJ', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Perhatikan angka $4$ di ruas kanan. Pindahkan ke ruas kiri, tandanya berubah menjadi $-4$, lalu berkumpul dengan $+9$ dan $+16$.',
      visual: circ({ rad: true, lab: 'num', panel: 'pindah' }),
      board: { title: 'Jabarkan', pins: N2, list: 'LJ', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: 'Hitung angkanya: $9+16-4=21$. Jadi bentuk umum lingkaran A adalah $x^2+6x+y^2-8y+21=0$, simpan ke catatan.',
      visual: circ({ rad: true, lab: 'num', panel: 'umum' }),
      board: { title: 'Jabarkan', pins: N2, list: 'LJ', upTo: 4, from: 2, save: ['pHasil'] },
    },
    // ---- 5 · Cocokkan hasil (hati-hati: sepusat) ----
    {
      ch: 5,
      cap: 'Sekarang cocokkan dengan pilihan jawaban. Ternyata tidak ada pilihan yang persis sama dengan hasil kita.',
      visual: { kind: 'soal', hl: 9 },
      board: { title: 'Cocokkan dengan pilihan', pins: N4, list: 'LM', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Hati-hati, baca lagi soalnya. Yang ditanya lingkaran yang sepusat, bukan lingkaran A itu sendiri.',
      visual: { kind: 'soal', hl: 3, focus: 's-pusat' },
      board: { title: 'Cocokkan dengan pilihan', pins: N4, list: 'LM', upTo: 2, from: 1 },
      ask: {
        before: 'm2',
        q: 'Lingkaran yang sepusat dengan lingkaran A harus memiliki…',
        opts: [
          { txt: 'pusat yang sama', ok: true },
          { txt: 'jari-jari yang sama', hint: 'Jari-jari boleh berbeda. Yang wajib sama adalah pusatnya.' },
          {
            txt: 'pusat dan jari-jari yang sama',
            hint: 'Kalau keduanya sama, itu lingkaran A sendiri. Sepusat cukup pusatnya sama.',
          },
        ],
      },
    },
    {
      ch: 5,
      cap: 'Sepusat artinya pusatnya sama, jari-jarinya boleh beda. Jadi cukup cari pilihan yang memuat $+6x$ dan $-8y$; angka $21$ boleh berbeda.',
      visual: circ({ conc: true }),
      board: { title: 'Cocokkan dengan pilihan', pins: N4, list: 'LM', upTo: 3, from: 2 },
    },
    // ---- 6 · Uji kelima pilihan ----
    open6('A', 'Kita cek pilihan A dulu. Salin persamaannya ke papan.'),
    check6(
      'A',
      'Pilihan A memuat $+6x$ dan $-8y$, sama dengan hasil kita. Pusatnya $(-3,4)$, jadi A <b class="k-gold">sepusat</b>.',
    ),
    open6('B', 'Lanjut pilihan B.'),
    check6(
      'B',
      'Pilihan B memuat $-6x$, bukan $+6x$, jadi pusatnya pindah ke $(3,4)$. B <b class="k-red">bukan</b>.',
    ),
    open6('C', 'Pilihan C.'),
    check6(
      'C',
      'Pilihan C memuat $+8y$, bukan $-8y$, jadi pusatnya turun ke $(-3,-4)$. C <b class="k-red">bukan</b>.',
    ),
    open6('D', 'Pilihan D.'),
    check6(
      'D',
      'Pilihan D memuat $-8x$ dan $-6y$: angkanya tertukar, pusatnya $(4,3)$. D <b class="k-red">bukan</b>.',
    ),
    open6('E', 'Terakhir, pilihan E.'),
    check6(
      'E',
      'Pilihan E memuat $+8x$ dan $-6y$, juga tertukar, pusatnya $(-4,3)$. E <b class="k-red">bukan</b>.',
    ),
    // ---- 7 · Pastikan jawaban ----
    {
      ch: 7,
      cap: 'Kita pastikan pilihan A dengan rumus bentuk umum: pusatnya $(-3,4)$ dan jari-jarinya $\\sqrt{9+16-16}=3$.',
      visual: circ({ opts: ['A'] }),
      board: { title: 'Pastikan jawaban', pins: N4, list: 'LK', upTo: 2, from: 0 },
    },
    {
      ch: 7,
      cap: 'Jari-jari $3$ berbeda dengan $2$, tidak masalah. Sepusat hanya meminta pusatnya sama.',
      visual: circ({ opts: ['A'], rad: true }),
      board: { title: 'Pastikan jawaban', pins: N4, list: 'LK', upTo: 3, from: 2 },
    },
    {
      ch: 7,
      cap: 'Hati-hati dengan B: konstantanya $21$ sama dengan hasil kita sehingga jari-jarinya $2$, tetapi $-6x$ membuat pusatnya $(3,4)$.',
      visual: circ({ opts: ['A', 'B'], rad: true }),
      board: { title: 'Pastikan jawaban', pins: N4, list: 'LK', upTo: 4, from: 3 },
    },
    // ---- 8 · Catatan lengkap ----
    {
      ch: 8,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 9 · Cocokkan pilihan ----
    {
      ch: 9,
      cap: 'Cocokkan dengan pilihan: hanya A yang berpusat di $(-3,4)$. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: N4, list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 's1',
        q: 'Persamaan lingkaran yang sepusat dengan lingkaran A adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>A</b>.',
        opts: [
          { tex: OPTS.A, ok: true },
          { tex: OPTS.B, hint: 'Jari-jarinya memang $2$, tetapi pusatnya $(3,4)$: tanda $x$ terbalik.' },
          { tex: OPTS.C, hint: 'Pusatnya $(-3,-4)$: tanda $y$ terbalik.' },
          { tex: OPTS.D, hint: 'Pusatnya $(4,3)$: koefisien $x$ dan $y$ tertukar.' },
          { tex: OPTS.E, hint: 'Pusatnya $(-4,3)$: koefisien $x$ dan $y$ tertukar.' },
        ],
      },
    },
    // ---- 10 · Selesai ----
    {
      ch: 10,
      cap: '<span class="verdict"><span class="seal">A</span><span>Pusat lingkaran A adalah $(-3,4)$. Hanya pilihan A yang berpusat di sana.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LS', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: `$${OPTS.A}$`,
      ok: true,
      formula: '(-3,4),\\ r=3',
      why: 'Sepusat dengan lingkaran A.',
    },
    {
      label: 'B',
      statement: `$${OPTS.B}$`,
      ok: false,
      formula: '(3,4),\\ r=2',
      why: 'Jari-jari 2 cocok, tetapi pusatnya salah.',
    },
    { label: 'C', statement: `$${OPTS.C}$`, ok: false, formula: '(-3,-4)', why: 'Tanda $y$ salah.' },
    { label: 'D', statement: `$${OPTS.D}$`, ok: false, formula: '(4,3)', why: '$x$ dan $y$ tertukar.' },
    { label: 'E', statement: `$${OPTS.E}$`, ok: false, formula: '(-4,3)', why: '$x$ dan $y$ tertukar.' },
  ],
  notes: {
    title: 'Pembahasan Soal 15: Lingkaran yang Sepusat',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Lingkaran',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Pusat dan jari-jari',
        lists: ['LP', 'LR'],
        why: 'Pusat: tarik garis dari $p$ ke kedua sumbu ($x$ dulu, baru $y$). Jari-jari: hitung kotak dari pusat ke lingkaran.',
      },
      {
        title: 'Rumus lingkaran',
        lists: ['LF'],
        why: 'Bentuk baku $(x-a)^2+(y-b)^2=r^2$ dijabarkan menjadi bentuk umum $x^2+y^2+Ax+By+C=0$.',
      },
      { title: 'Baku ke umum', lists: ['LB', 'LJ'] },
      {
        title: 'Cocokkan hasil',
        lists: ['LM'],
        why: 'Sepusat: cukup $+6x$ dan $-8y$ yang sama; konstanta boleh beda karena jari-jari boleh beda.',
      },
      { title: 'Uji kelima pilihan', lists: ['L6A', 'L6B', 'L6C', 'L6D', 'L6E'] },
      { title: 'Pastikan jawaban', lists: ['LK'] },
    ],
    answer: 'Jawaban: <b>A</b>, $x^2+6x+y^2-8y+16=0$ (pusat $(-3,4)$, jari-jari $3$).',
  },
  done: {
    seal: 'A',
    message: 'Pusat lingkaran A adalah $(-3,4)$. Hanya pilihan A yang berpusat di sana.',
  },
  key: { answer: 'A', cardOk: [true, false, false, false, false], goldRows: ['oA', 's1', 'y2'] },
  authorNotes: [
    'Revisi pemilik v1.15 (23 Okt 2026): alur mengikuti cara Pak Penta menyampaikan ke siswa — cari pusat dan jari-jari dulu, dua bentuk persamaan, masukkan ke bentuk baku, jabarkan, cocokkan dengan pilihan.',
    'Jari-jari dibaca dengan menghitung kotak dari pusat turun ke titik terbawah (−3, 2): r = 4 − 2 = 2 (diturunkan dari pusat dan jari-jari dokumen); dicek dengan diameter 4 dari naskah.',
    'Hasil jabaran x² + 6x + y² − 8y + 21 = 0 adalah persamaan lingkaran A sendiri (dokumen Bagian 4); tidak ada di pilihan, sehingga ditambahkan langkah "Hati-hati": yang ditanya sepusat, cukup +6x dan −8y yang sama.',
    'Rumus jari-jari bentuk umum ditulis seperti disampaikan pemilik: √((−A/2)² + (−B/2)² − C), setara dengan dokumen √(A²/4 + B²/4 − C).',
    'Pertanyaan cepat "sepusat harus memiliki…" dari Kesalahan umum dokumen (mengira jari-jari juga sama).',
    'Baris "Hati-hati" pilihan B (konstanta 21 sama, pusat beda) dari kolom jebakan kartu B dokumen.',
    'Revisi pemilik v1.16: angka 4 tidak dicoret, tetapi pindah ruas menjadi −4 (terbang melewati "="), lalu 9 + 16 − 4 = 21 dihitung di baris sendiri; kertas soal memakai huruf A–E satu kolom.',
  ],
};

export default q15;
