/**
 * SOAL 2 — Pakan Sapi dan Kambing (SPL dua variabel dan matriks; pilihan tunggal). Kunci: E (3 sapi, 4 kambing).
 * Sumber: docs/pembahasan25.md "SOAL 2", docs/soal25.md no. 2, docs/sapi_dan_kambing.png.
 * Alur guru (v1.29, dicatat di dokumen):
 *  - pahami: yang ditanya (x, y) = (sapi, kambing); pilihan berbentuk matriks × vektor = hasil;
 *  - data dari gambar: kebutuhan per ekor (angka terbang dari gambar), pakan tersedia, dua persamaan;
 *  - model batang: bagian sapi 10x sama di kedua batang, selisihnya satu y → y = 38 − 34 = 4; batang gamal
 *    10x + 4 = 34, angka 4 pindah ruas (tidak dicoret) → x = 3; cek ke persamaan gajah; hati-hati urutan (4, 3);
 *  - uji pilihan: cara cepat (hasil harus (3, 4)) → batas berlakunya (hasil tertulis belum tentu benar) → tiap
 *    pilihan disalin dari soal; D dan E dikalikan baris × kolom;
 *  - bagian opsional "Cara alternatif": invers matriks M, susunan setara 5x + y = 19 (asal matriks E), dan
 *    kenapa A dan D hasilnya 5 dan 10 kali lipat.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Step, Visual } from '../../engine/types';
import type { Mul2State } from '../../visuals/mul2';
import type { Pakan2State } from '../../visuals/pakan2';
import { getSoal } from '../index';

/** Gambar asli soal (docs/sapi_dan_kambing.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/sapi_dan_kambing.png', import.meta.url).href;
const pakan = (state: Pakan2State): Visual => ({ kind: 'svg', scene: 'pakan2', state });
const mul = (state: Mul2State): Visual => ({ kind: 'svg', scene: 'mul2', state });
const v = (a: string, b: string): string => `\\begin{pmatrix}${a}\\\\${b}\\end{pmatrix}`;
const m = (a: string, b: string, c: string, d: string): string =>
  `\\begin{pmatrix}${a}&${b}\\\\${c}&${d}\\end{pmatrix}`;
const MINV = m('-\\frac{1}{10}', '\\frac{2}{10}', '1', '-1');
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
type L = (typeof LETTERS)[number];
/** Kelima pilihan (docs/soal25.md no. 2): kertas soal dan kutipan di papan memakai teks yang sama. */
const OPT: Record<L, string> = {
  A: `${m('-1', '1', '10', '-5')}${v('19', '34')}=${v('15', '20')}`,
  B: `${m('10', '-10', '-1', '2')}${v('38', '34')}=${v('4', '3')}`,
  C: `${m('-\\frac{1}{10}', '\\frac{2}{10}', '1', '-1')}${v('34', '38')}=${v('4', '3')}`,
  D: `${m('-1', '2', '10', '-10')}${v('38', '34')}=${v('3', '4')}`,
  E: `${m('-\\frac{1}{5}', '\\frac{1}{5}', '2', '-1')}${v('19', '34')}=${v('3', '4')}`,
};
/** hasil yang tertulis di tiap pilihan */
const RES: Record<L, [string, string]> = {
  A: ['15', '20'],
  B: ['4', '3'],
  C: ['4', '3'],
  D: ['3', '4'],
  E: ['3', '4'],
};
/** catatan: dua persamaan, lalu y, x, dan hasilnya */
const N1 = ['pG', 'pL'];
const NS = ['pS'];

/** pernyataan kartu dua baris: perkalian, lalu "= hasil" (muat di kartu sempit) */
const card = (k: L): string => {
  const [lhs, rhs] = OPT[k].split('=');
  return `$${lhs}$ $=${rhs}$`;
};
const quote = (o: L): Row => ({
  id: `q${o}`,
  toks: [T(`q${o}a`, `\\text{${o}}`, 'sp'), H(`q${o}b`, `$${OPT[o]}$`, 'q', `@s-o${o}`)],
});
/** syarat 1: hasil tertulis (terbang dari kutipan) dibandingkan dengan (3, 4) di catatan */
const res = (o: L, note: string): Row => {
  const ok = RES[o].join() === '3,4';
  return {
    id: `o${o}`,
    toks: [
      H(`o${o}a`, 'hasil', 'tx'),
      T(`o${o}b`, v(...RES[o]), ok ? 'blue' : 'red', `q${o}b`),
      O(`o${o}c`, ok ? '=' : '\\ne'),
      T(`o${o}d`, v('3', '4'), '', 'PS3'),
    ],
    note,
  };
};
const open4 = (o: L, cap: string, ch = 4, pins: string[] = NS): Step => ({
  ch,
  cap,
  visual: { kind: 'soal', hl: 0, focus: `s-o${o}` },
  board: { title: `Pilihan ${o}`, pins, list: `LO${o}`, upTo: 1, from: 0 },
});
const claim4 = (o: L, cap: string): Step => ({
  ch: 4,
  cap,
  visual: pakan({ pic: 'all', claim: [Number(RES[o][0]), Number(RES[o][1])] }),
  board: { title: `Pilihan ${o}`, pins: NS, list: `LO${o}`, upTo: 2, from: 1 },
});
/** baris perkalian baris × kolom; angka terbang dari adegan mul2 */
const prod = (
  id: string,
  r: 1 | 2,
  a: string,
  b: string,
  x: string,
  y: string,
  out: string,
  cls: 'blue' | 'red',
  note: string,
): Row => ({
  id,
  toks: [
    H(`${id}a`, `baris ${r}`, 'tx'),
    T(`${id}b`, `(${a})`, '', r === 1 ? '@m-a' : '@m-c'),
    T(`${id}c`, `(${x})`, '', '@m-v1'),
    O(`${id}d`, '+'),
    T(`${id}e`, `(${b})`, '', r === 1 ? '@m-b' : '@m-d'),
    T(`${id}f`, `(${y})`, '', '@m-v2'),
    O(`${id}g`, '='),
    T(`${id}h`, out, cls),
  ],
  note,
});

const q02: SoalContent = {
  meta: getSoal(2)!,
  sourceRef: 'docs/pembahasan25.md#soal-2',
  layout: 'full',
  paper: {
    html: `<div class="soal-split"><div>
<p>Pak Andi memiliki beberapa sapi dan kambing. Semua hewan ternaknya selalu diberikan pakan berupa campuran rumput gajah dan rumput gamal. Setiap hari, ia selalu menyediakan <span class="hl hl-red" data-hl="1"><span data-src="s-gajah">38 kg rumput gajah</span></span> dan <span class="hl hl-red" data-hl="1"><span data-src="s-gamal">34 kg rumput gamal</span></span> untuk seluruh kambing dan sapi miliknya <span class="hl hl-blue" data-hl="1"><span data-src="s-tanpa">tanpa sisa</span></span>.</p>
<table class="soal-table"><thead><tr><th scope="col">Sapi</th><th scope="col">Kambing</th></tr></thead>
<tbody><tr><td>Rumput Gajah 10 kg</td><td>Rumput Gajah 2 kg</td></tr>
<tr><td>Rumput Gamal 10 kg</td><td>Rumput Gamal 1 kg</td></tr></tbody></table>
</div><figure class="soal-fig"><img src="${fig}" width="918" height="571" alt="Sapi: rumput gajah 10 kg, rumput gamal 10 kg. Kambing: rumput gajah 2 kg, rumput gamal 1 kg." /></figure></div>
<p>Jika banyaknya sapi dan kambing yang dipelihara oleh Pak Andi berturut-turut adalah <span class="hl hl-blue" data-hl="2"><span data-src="s-xy">$x$ dan $y$</span></span>, maka $\\htmlClass{hl hl-gold}{\\htmlData{src=s-tanya, hl=2}{${v('x', 'y')}}}=....$</p>
<ol class="abc abc-2">
${LETTERS.map((o) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">$${OPT[o]}$</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-gajah', 's-gamal', 's-tanpa', 's-xy', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['f-sg', 'f-sm', 'f-kg', 'f-km', 'm-a', 'm-b', 'm-c', 'm-d', 'm-v1', 'm-v2'],
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
    { t: 'Pahami soal', d: 'Yang ditanya dan bentuk pilihan' },
    { t: 'Data dari gambar', d: 'Dua persamaan pakan' },
    { t: 'Model batang', d: 'y = 4, lalu x = 3' },
    { t: 'Cara cepat', d: 'Pilihan A, B, C' },
    { t: 'Uji pilihan D', d: 'Kalikan baris × kolom' },
    { t: 'Uji pilihan E', d: 'Kalikan baris × kolom' },
    { t: 'Cara alternatif', d: 'Opsional: invers matriks', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Jawaban E' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pG: { id: 'pG', toks: [T('PG1', '10x+2y', '', 'e1a'), O('PG2', '='), T('PG3', '38', '', 'e1g')] },
    pL: { id: 'pL', toks: [T('PL1', '10x+y', '', 'e2a'), O('PL2', '='), T('PL3', '34', '', 'e2g')] },
    pY: { id: 'pY', toks: [T('PY1', 'y', '', 'b2a'), O('PY2', '='), T('PY3', '4', '', 'b2g')] },
    pX: { id: 'pX', toks: [T('PX1', 'x', '', 'x4a'), O('PX2', '='), T('PX3', '3', '', 'x4e')] },
    pS: {
      id: 'pS',
      gold: true,
      toks: [T('PS1', v('x', 'y'), '', 'h2a'), O('PS2', '='), T('PS3', v('3', '4'), '', 'h2c')],
    },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [H('k1a', 'Ditanya', 'lbl'), T('k1b', v('x', 'y'), 'gold', '@s-tanya')],
        note: '$x$ = banyak sapi, $y$ = banyak kambing',
      },
      {
        id: 'k2',
        toks: [H('k2a', 'Pilihan', 'lbl'), H('k2b', 'matriks × vektor = hasil', 'tx')],
        note: 'cari dulu $x$ dan $y$, lalu uji tiap pilihan',
      },
    ],
    LD: [
      {
        id: 'd1',
        toks: [
          H('d1a', '1 sapi', 'tx'),
          O('d1b', '\\to'),
          H('d1c', 'gajah', 'tx'),
          T('d1d', '10', 'blue', '@f-sg'),
          H('d1e', 'gamal', 'tx'),
          T('d1f', '10', 'blue', '@f-sm'),
        ],
        note: 'kg per ekor setiap hari',
      },
      {
        id: 'd2',
        toks: [
          H('d2a', '1 kambing', 'tx'),
          O('d2b', '\\to'),
          H('d2c', 'gajah', 'tx'),
          T('d2d', '2', 'blue', '@f-kg'),
          H('d2e', 'gamal', 'tx'),
          T('d2f', '1', 'blue', '@f-km'),
        ],
        note: 'kg per ekor setiap hari',
      },
      {
        id: 'd3',
        toks: [
          H('d3a', 'tersedia', 'tx'),
          O('d3b', '\\to'),
          H('d3c', 'gajah', 'tx'),
          T('d3d', '38', 'red', '@s-gajah'),
          H('d3e', 'gamal', 'tx'),
          T('d3f', '34', 'red', '@s-gamal'),
        ],
        note: 'kg setiap hari, habis tanpa sisa',
      },
      {
        id: 'e1',
        toks: [
          T('e1a', '10', '', 'd1d'),
          T('e1b', 'x', 'blue'),
          O('e1c', '+'),
          T('e1d', '2', '', 'd2d'),
          T('e1e', 'y', 'blue'),
          O('e1f', '='),
          T('e1g', '38', 'red', 'd3d'),
        ],
        note: 'rumput gajah: bagian sapi + bagian kambing',
        box: 'navy',
      },
      {
        id: 'e2',
        toks: [
          T('e2a', '10', '', 'd1f'),
          T('e2b', 'x', 'blue'),
          O('e2c', '+'),
          T('e2d', '1', '', 'd2f'),
          T('e2e', 'y', 'blue'),
          O('e2f', '='),
          T('e2g', '34', 'red', 'd3f'),
        ],
        note: 'rumput gamal; $1y$ cukup ditulis $y$',
        box: 'navy',
      },
    ],
    LB: [
      {
        id: 'b1',
        toks: [
          H('b1a', 'batang gajah − batang gamal', 'tx'),
          O('b1b', '\\to'),
          H('b1c', 'satu', 'tx'),
          T('b1d', 'y', 'blue'),
        ],
        note: 'bagian sapi $10x$ sama panjang di kedua batang',
      },
      {
        id: 'b2',
        toks: [
          T('b2a', 'y'),
          O('b2b', '='),
          T('b2c', '38', '', 'PG3'),
          O('b2d', '-'),
          T('b2e', '34', '', 'PL3'),
          O('b2f', '='),
          T('b2g', '4', 'blue'),
        ],
        note: 'selisih rumput gajah dan gamal; simpan ke catatan',
        box: 'navy',
      },
    ],
    LX: [
      {
        id: 'x1',
        toks: [
          T('x1a', '10x', '', 'PL1'),
          O('x1b', '+'),
          T('x1c', '4', 'blue', 'PY3'),
          O('x1d', '='),
          T('x1e', '34', '', 'PL3'),
        ],
        note: '$y=4$ dimasukkan ke persamaan gamal',
      },
      {
        id: 'x2',
        toks: [
          T('x2a', '10x', '', 'x1a'),
          O('x2b', '='),
          T('x2c', '34', '', 'x1e'),
          T('x2d', '-4', 'red', 'x1c'),
        ],
        note: '$4$ di ruas kiri pindah ke ruas kanan menjadi $-4$',
      },
      {
        id: 'x3',
        toks: [T('x3a', '10x'), O('x3b', '='), T('x3c', '30', 'blue')],
        note: '$34-4=30$',
      },
      {
        id: 'x4',
        toks: [
          T('x4a', 'x'),
          O('x4b', '='),
          T('x4c', '30\\div10', '', 'x3c'),
          O('x4d', '='),
          T('x4e', '3', 'blue'),
        ],
        note: 'kedua ruas dibagi $10$; simpan ke catatan',
        box: 'navy',
      },
    ],
    LH: [
      {
        id: 'h1',
        toks: [
          H('h1a', 'cek gajah', 'tx'),
          T('h1b', '10\\cdot'),
          T('h1c', '3', '', 'PX3'),
          T('h1d', '+2\\cdot'),
          T('h1e', '4', '', 'PY3'),
          O('h1f', '='),
          T('h1g', '38'),
          T('h1h', '\\;\\checkmark', 'blue'),
        ],
        note: '$30+8=38$, cocok dengan rumput gajah',
      },
      {
        id: 'h2',
        toks: [T('h2a', v('x', 'y')), O('h2b', '='), T('h2c', v('3', '4'), 'gold')],
        note: '3 sapi dan 4 kambing; simpan ke catatan',
        box: 'gold',
      },
      {
        id: 'h3',
        toks: [H('h3a', 'Hati-hati', 'lbl'), T('h3b', v('4', '3')), H('h3c', 'bukan hasilnya', 'tx')],
        note: 'artinya 4 sapi dan 3 kambing, gajah $10(4)+2(3)=46\\ne38$',
      },
    ],
    LQ: [
      {
        id: 'c1',
        toks: [
          H('c1a', 'Syarat 1', 'lbl'),
          H('c1b', 'hasilnya', 'tx'),
          O('c1c', '='),
          T('c1d', v('3', '4'), '', 'PS3'),
        ],
        note: 'cara cepat, cukup lihat ruas kanan pilihan',
      },
      {
        id: 'c2',
        toks: [H('c2a', 'Syarat 2', 'lbl'), H('c2b', 'perkaliannya benar', 'tx')],
        note: 'hasil yang tertulis belum tentu hasil perkalian sebenarnya',
      },
    ],
    LOA: [quote('A'), res('A', 'syarat 1 gagal → <b class="k-red">bukan</b>')],
    LOB: [quote('B'), res('B', 'urutan terbalik, 4 sapi dan 3 kambing → <b class="k-red">bukan</b>')],
    LOC: [quote('C'), res('C', 'urutan terbalik, vektornya pun gamal di atas → <b class="k-red">bukan</b>')],
    LOD: [quote('D'), res('D', 'syarat 1 lolos; cek syarat 2')],
    LDM: [
      prod('dm1', 1, '-1', '2', '38', '34', '30', 'red', '$-38+68=30$, bukan $3$'),
      prod('dm2', 2, '10', '-10', '38', '34', '40', 'red', '$380-340=40$, bukan $4$'),
      {
        id: 'dm3',
        toks: [
          H('dm3a', 'hasil kali', 'tx'),
          T('dm3b', v('30', '40'), 'red'),
          O('dm3c', '\\ne'),
          T('dm3d', v('3', '4'), '', 'PS3'),
        ],
        note: 'hasil yang tertulis tidak benar → <b class="k-red">bukan</b>',
      },
    ],
    LOE: [
      quote('E'),
      res('E', 'syarat 1 lolos; cek syarat 2'),
      {
        id: 'e19',
        toks: [T('e19a', '19'), O('e19b', '='), T('e19c', '38', '', 'PG3'), T('e19d', '\\div2')],
        note: 'persamaan gajah dibagi $2$ → $5x+y=19$',
      },
    ],
    LEM: [
      prod(
        'em1',
        1,
        '-\\tfrac15',
        '\\tfrac15',
        '19',
        '34',
        '3',
        'blue',
        '$-\\frac{19}5+\\frac{34}5=\\frac{15}5=3$',
      ),
      prod('em2', 2, '2', '-1', '19', '34', '4', 'blue', '$38-34=4$'),
      {
        id: 'em3',
        toks: [
          H('em3a', 'hasil kali', 'tx'),
          T('em3b', v('3', '4'), 'gold'),
          O('em3c', '='),
          T('em3d', v('3', '4'), '', 'PS3'),
        ],
        note: 'kedua syarat lolos → <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    // cara alternatif (opsional): invers matriks
    LI: [
      {
        id: 'i1',
        toks: [
          T('i1a', m('10', '2', '10', '1'), '', 'PG1'),
          T('i1b', v('x', 'y'), 'blue'),
          O('i1c', '='),
          T('i1d', v('38', '34'), 'red', 'PG3'),
        ],
        note: 'gajah di baris 1, gamal di baris 2; matriksnya diberi nama $M$',
        box: 'navy',
      },
      {
        id: 'i2',
        toks: [T('i2a', v('x', 'y')), O('i2b', '='), T('i2c', 'M^{-1}'), T('i2d', v('38', '34'), '', 'i1d')],
        note: 'kedua ruas dikali $M^{-1}$ dari kiri',
      },
    ],
    LJ: [
      {
        id: 'j1',
        toks: [
          T('j1a', '\\det M'),
          O('j1b', '='),
          T('j1c', '10\\cdot1-2\\cdot10'),
          O('j1d', '='),
          T('j1e', '-10', 'blue'),
        ],
        note: '$ad-bc$, tidak nol',
      },
      {
        id: 'j2',
        toks: [
          T('j2a', 'M^{-1}'),
          O('j2b', '='),
          T('j2c', '\\tfrac{1}{-10}', '', 'j1e'),
          T('j2d', m('1', '-2', '-10', '10')),
        ],
        note: 'tukar $a,d$; ubah tanda $b,c$',
      },
      {
        id: 'j3',
        toks: [T('j3a', 'M^{-1}'), O('j3b', '='), T('j3c', MINV, 'blue')],
        note: 'tiap elemen dibagi $-10$; ini matriks pilihan C',
        box: 'navy',
      },
    ],
    LK: [
      {
        id: 's1',
        toks: [H('s1a', 'gajah ÷ 2', 'tx'), O('s1b', '\\to'), T('s1c', '5x+y=19', 'blue')],
        note: 'persamaan gamal tetap $10x+y=34$',
      },
      {
        id: 's2',
        toks: [T('s2a', "M'"), O('s2b', '='), T('s2c', m('5', '1', '10', '1'))],
        note: "$\\det M'=5\\cdot1-1\\cdot10=-5$",
      },
      {
        id: 's3',
        toks: [
          T('s3a', "M'^{-1}"),
          O('s3b', '='),
          T('s3c', '\\tfrac{1}{-5}'),
          T('s3d', m('1', '-1', '-10', '5')),
          O('s3e', '='),
          T('s3f', m('-\\frac15', '\\frac15', '2', '-1'), 'blue'),
        ],
        note: 'tepat matriks pilihan E',
        box: 'navy',
      },
    ],
    LT: [
      {
        id: 't1',
        toks: [
          H('t1a', 'A', 'sp'),
          T('t1b', "5\\times M'^{-1}"),
          O('t1c', '\\to'),
          H('t1d', 'hasil', 'tx'),
          T('t1e', v('15', '20'), 'red'),
        ],
        note: 'pembagi $5$ terlewat, hasilnya $5$ kali $(3,4)$',
      },
      {
        id: 't2',
        toks: [
          H('t2a', 'D', 'sp'),
          T('t2b', '10\\times M^{-1}'),
          O('t2c', '\\to'),
          H('t2d', 'hasil', 'tx'),
          T('t2e', v('30', '40'), 'red'),
        ],
        note: 'pembagi $10$ terlewat, hasilnya $10$ kali $(3,4)$',
      },
    ],
    L7: [{ id: 'v6', toks: [H('v6a', 'Jawaban', 'lbl'), T('v6b', '\\textbf{E}')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', v('x', 'y')), O('r1b', '='), T('r1c', v('3', '4'))],
        note: '3 sapi, 4 kambing',
        box: 'gold',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), T('r2b', '\\textbf{E}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. Yang ditanya $\\begin{pmatrix}x\\\\y\\end{pmatrix}$, dengan $x$ banyak sapi dan $y$ banyak kambing.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Semua pilihan berbentuk matriks dikali vektor beserta hasilnya. Kita cari dulu $x$ dan $y$, baru menguji tiap pilihan.',
      visual: { kind: 'soal', hl: 9 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Data dari gambar ----
    {
      ch: 2,
      cap: 'Perhatikan gambar sapi. Satu ekor sapi makan $10$ kg rumput gajah dan $10$ kg rumput gamal setiap hari.',
      visual: pakan({ pic: 'sapi' }),
      board: { title: 'Data dari gambar', list: 'LD', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Satu ekor kambing makan $2$ kg rumput gajah dan $1$ kg rumput gamal.',
      visual: pakan({ pic: 'kambing' }),
      board: { title: 'Data dari gambar', list: 'LD', upTo: 2, from: 1 },
    },
    {
      ch: 2,
      cap: 'Pak Andi menyediakan $38$ kg rumput gajah dan $34$ kg rumput gamal, dan semuanya habis tanpa sisa.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Data dari gambar', list: 'LD', upTo: 3, from: 2 },
    },
    {
      ch: 2,
      cap: 'Rumput gajah dimakan $x$ sapi dan $y$ kambing, jadi $10x+2y=38$. Pada batangnya, bagian sapi $10x$ lalu dua bagian kambing.',
      visual: pakan({ view: 'bars', bars: 1 }),
      board: { title: 'Data dari gambar', list: 'LD', upTo: 4, from: 3 },
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
          { tex: 'x+y=38', hint: 'Itu menghitung jumlah hewan. Yang dijumlahkan adalah kilogram pakannya.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Dengan cara yang sama untuk rumput gamal, $10x+y=34$. Simpan kedua persamaan ke catatan.',
      visual: pakan({ view: 'bars', bars: 2 }),
      board: { title: 'Data dari gambar', list: 'LD', upTo: 5, from: 4, save: ['pG', 'pL'] },
    },
    // ---- 3 · Model batang ----
    {
      ch: 3,
      cap: 'Tahukah kalian? Bagian sapi $10x$ sama panjang di kedua batang, bedanya hanya satu bagian $y$ di ujung batang gajah.',
      visual: pakan({ view: 'bars', bars: 2, align: true }),
      board: { title: 'Model batang', pins: N1, list: 'LB', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Jadi selisih kedua batang adalah satu $y$, yaitu $y=38-34=4$. Simpan ke catatan.',
      visual: pakan({ view: 'bars', bars: 2, align: true, y: true }),
      board: { title: 'Model batang', pins: N1, list: 'LB', upTo: 2, from: 1, save: ['pY'] },
      ask: {
        before: 'b2',
        q: 'Dari model batang, nilai $y$ adalah…',
        opts: [
          { tex: '4', ok: true },
          {
            tex: '2',
            hint: 'Batang gajah memang punya dua bagian $y$, tetapi selisih kedua batang hanya satu $y$.',
          },
          { tex: '72', hint: '$38+34$ adalah jumlahnya. Yang dicari selisih kedua batang.' },
          {
            tex: '8',
            hint: '$8$ adalah dua bagian $y$ di batang gajah. Selisihnya satu $y$, yaitu $38-34$.',
          },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Sekarang batang gamal. $10x+y=34$ dan $y=4$, jadi $10x+4=34$.',
      visual: pakan({ view: 'bars', bars: 2, y: true }),
      board: { title: 'Mencari x', pins: ['pL', 'pY'], list: 'LX', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Angka $4$ di ruas kiri pindah ke ruas kanan menjadi $-4$, sehingga $10x=34-4=30$.',
      visual: pakan({ view: 'bars', bars: 2, y: true }),
      board: { title: 'Mencari x', pins: ['pL', 'pY'], list: 'LX', upTo: 3, from: 1 },
    },
    {
      ch: 3,
      cap: 'Kedua ruas dibagi $10$, jadi $x=3$. Simpan ke catatan.',
      visual: pakan({ view: 'bars', bars: 2, y: true, x: true }),
      board: { title: 'Mencari x', pins: ['pL', 'pY'], list: 'LX', upTo: 4, from: 3, save: ['pX'] },
    },
    {
      ch: 3,
      cap: 'Cek ke persamaan gajah, $10\\cdot3+2\\cdot4=38$, cocok. Jadi Pak Andi memelihara $3$ sapi dan $4$ kambing.',
      visual: pakan({ pic: 'all', claim: [3, 4] }),
      board: { title: 'Hasilnya', pins: ['pX', 'pY'], list: 'LH', upTo: 2, from: 0, save: ['pS'] },
      ask: {
        before: 'h2',
        q: 'Karena $x$ untuk sapi dan $y$ untuk kambing, $\\begin{pmatrix}x\\\\y\\end{pmatrix}=$…',
        opts: [
          { tex: v('3', '4'), ok: true },
          { tex: v('4', '3'), hint: 'Urutannya terbalik. Baris atas untuk sapi, $x=3$.' },
          { tex: v('30', '4'), hint: '$30$ adalah $10x$, bagian sapi. Satu sapi $10$ kg, jadi $x=3$.' },
          { tex: v('3', '8'), hint: '$8$ adalah $2y$ di batang gajah. Satu $y$ adalah $4$.' },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Hati-hati dengan urutannya. $x$ (sapi) di atas dan $y$ (kambing) di bawah, jadi $(4,3)$ berarti $4$ sapi dan $3$ kambing, bukan hasilnya.',
      visual: pakan({ pic: 'all', claim: [4, 3] }),
      board: { title: 'Hasilnya', pins: NS, list: 'LH', upTo: 3, from: 2 },
    },
    // ---- 4 · Cara cepat (A, B, C) ----
    {
      ch: 4,
      cap: 'Cara cepat, hasil pilihan yang benar harus $\\begin{pmatrix}3\\\\4\\end{pmatrix}$. Cukup lihat ruas kanan setiap pilihan.',
      visual: { kind: 'soal', hl: 9 },
      board: { title: 'Syarat pilihan', pins: NS, list: 'LQ', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Tetapi hati-hati, hasil yang tertulis belum tentu benar. Jadi perkaliannya juga harus kita cek.',
      visual: { kind: 'soal', hl: 9 },
      board: { title: 'Syarat pilihan', pins: NS, list: 'LQ', upTo: 2, from: 1 },
    },
    open4('A', 'Kita cek pilihan A dulu. Salin ke papan.'),
    claim4(
      'A',
      'Hasil A adalah $(15,20)$, bukan $(3,4)$. Syarat pertama sudah gagal, A <b class="k-red">bukan</b>.',
    ),
    open4('B', 'Lanjut pilihan B.'),
    claim4(
      'B',
      'Hasil B $(4,3)$ berarti $4$ sapi dan $3$ kambing, urutannya terbalik. B <b class="k-red">bukan</b>.',
    ),
    open4('C', 'Pilihan C.'),
    claim4(
      'C',
      'Hasil C juga $(4,3)$, dan vektornya pun terbalik (gamal di atas). C <b class="k-red">bukan</b>.',
    ),
    // ---- 5 · Uji pilihan D ----
    open4('D', 'Pilihan D. Salin ke papan.', 5),
    {
      ch: 5,
      cap: 'Hasil D tertulis $(3,4)$, syarat pertama lolos. Hati-hati, kita kalikan dulu untuk memastikannya.',
      visual: mul({ o: 'D' }),
      board: { title: 'Pilihan D', pins: NS, list: 'LOD', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: 'Baris 1 dikali kolom, $(-1)(38)+(2)(34)=-38+68=30$. Seharusnya $3$.',
      visual: mul({ o: 'D', row: 1 }),
      board: { title: 'Pilihan D, perkalian', pins: NS, list: 'LDM', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Baris 2 dikali kolom, $(10)(38)+(-10)(34)=380-340=40$.',
      visual: mul({ o: 'D', row: 2 }),
      board: { title: 'Pilihan D, perkalian', pins: NS, list: 'LDM', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: 'Hasil kali sebenarnya $(30,40)$, bukan $(3,4)$ seperti yang tertulis. D <b class="k-red">bukan</b>.',
      visual: mul({ o: 'D', row: 2, cmp: true }),
      board: { title: 'Pilihan D, perkalian', pins: NS, list: 'LDM', upTo: 3, from: 2 },
      ask: {
        before: 'dm3',
        q: 'Hasil perkalian pilihan D yang sebenarnya adalah…',
        opts: [
          { tex: v('30', '40'), ok: true },
          {
            tex: v('3', '4'),
            hint: 'Itu hasil yang tertulis. Lihat hasil kali baris 1 dan baris 2 di papan.',
          },
          {
            tex: v('40', '30'),
            hint: 'Baris 1 menghasilkan $30$ (atas), baris 2 menghasilkan $40$ (bawah).',
          },
        ],
      },
    },
    // ---- 6 · Uji pilihan E ----
    open4('E', 'Terakhir, pilihan E. Salin ke papan.', 6, ['pG', 'pS']),
    {
      ch: 6,
      cap: 'Hasil E tertulis $(3,4)$, syarat pertama lolos. Vektornya memakai $19=38\\div2$, yaitu persamaan gajah dibagi $2$.',
      visual: mul({ o: 'E', v19: true }),
      board: { title: 'Pilihan E', pins: ['pG', 'pS'], list: 'LOE', upTo: 3, from: 1 },
    },
    {
      ch: 6,
      cap: 'Baris 1 dikali kolom, $\\left(-\\frac15\\right)(19)+\\left(\\frac15\\right)(34)=\\frac{15}5=3$.',
      visual: mul({ o: 'E', row: 1, v19: true }),
      board: { title: 'Pilihan E, perkalian', pins: NS, list: 'LEM', upTo: 1, from: 0 },
    },
    {
      ch: 6,
      cap: 'Baris 2 dikali kolom, $(2)(19)+(-1)(34)=38-34=4$.',
      visual: mul({ o: 'E', row: 2, v19: true }),
      board: { title: 'Pilihan E, perkalian', pins: NS, list: 'LEM', upTo: 2, from: 1 },
    },
    {
      ch: 6,
      cap: 'Hasil kali sebenarnya $(3,4)$, sama dengan yang tertulis dan dengan hasil kita. E <b class="k-gold">benar</b>.',
      visual: mul({ o: 'E', row: 2, cmp: true, v19: true }),
      board: { title: 'Pilihan E, perkalian', pins: NS, list: 'LEM', upTo: 3, from: 2 },
    },
    // tawaran cara alternatif (opsional): Ya masuk Bagian 7, Tidak/Lewati langsung ke Bagian 8
    {
      ch: 6,
      cap: 'Dari mana matriks pilihan E itu? Mau lihat cara alternatif dengan invers matriks?',
      visual: mul({ o: 'E', row: 2, cmp: true, v19: true }),
      board: { title: 'Pilihan E, perkalian', pins: NS, list: 'LEM', upTo: 3, from: 3 },
      branch: { yes: 'Ya, lihat cara invers' },
    },
    // ---- 7 · Cara alternatif dengan invers matriks (opsional) ----
    {
      ch: 7,
      cap: 'Kedua persamaan disusun menjadi satu persamaan matriks. Koefisien rumput gajah di baris 1, rumput gamal di baris 2.',
      visual: pakan({ view: 'bars', bars: 2 }),
      board: { title: 'Bentuk matriks', pins: N1, list: 'LI', upTo: 1, from: 0 },
    },
    {
      ch: 7,
      cap: 'Kedua ruas dikali $M^{-1}$ dari kiri, sehingga $\\begin{pmatrix}x\\\\y\\end{pmatrix}=M^{-1}\\begin{pmatrix}38\\\\34\\end{pmatrix}$.',
      visual: pakan({ view: 'bars', bars: 2 }),
      board: { title: 'Bentuk matriks', pins: N1, list: 'LI', upTo: 2, from: 1 },
    },
    {
      ch: 7,
      cap: 'Determinan $M$ adalah $10\\cdot1-2\\cdot10=-10$. Tukar $a$ dan $d$, ubah tanda $b$ dan $c$, lalu bagi dengan $-10$.',
      visual: pakan({ view: 'bars', bars: 2 }),
      board: { title: 'Invers M', list: 'LJ', upTo: 2, from: 0 },
    },
    {
      ch: 7,
      cap: 'Hasilnya matriks pilihan C. Tetapi C mengalikannya dengan $\\begin{pmatrix}34\\\\38\\end{pmatrix}$, urutan vektornya terbalik.',
      visual: { kind: 'soal', hl: 0, focus: 's-oC' },
      board: { title: 'Invers M', list: 'LJ', upTo: 3, from: 2 },
    },
    {
      ch: 7,
      cap: "Pilihan E memakai susunan setara. Persamaan gajah dibagi $2$ menjadi $5x+y=19$, sehingga matriksnya $M'$.",
      visual: pakan({ view: 'bars', bars: 2 }),
      board: { title: 'Susunan setara', list: 'LK', upTo: 2, from: 0 },
    },
    {
      ch: 7,
      cap: "Determinan $M'$ adalah $5-10=-5$, dan inversnya tepat matriks pilihan E.",
      visual: { kind: 'soal', hl: 0, focus: 's-oE' },
      board: { title: 'Susunan setara', list: 'LK', upTo: 3, from: 2 },
    },
    {
      ch: 7,
      cap: "Tahukah kalian? Matriks A adalah $5$ kali $M'^{-1}$ dan matriks D $10$ kali $M^{-1}$, sehingga hasilnya ikut $5$ dan $10$ kali lipat.",
      visual: { kind: 'soal', hl: 9 },
      board: { title: 'Jebakan pilihan A dan D', list: 'LT', upTo: 2, from: 0 },
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
      cap: 'Cocokkan dengan pilihan: hanya E yang hasilnya $(3,4)$ dan perkaliannya benar. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: NS, list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'v6',
        q: 'Jawaban yang tepat adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>E</b>.',
        opts: [
          { txt: 'hasil (15, 20)', hint: 'Hasilnya bukan $(3,4)$, syarat pertama gagal.' },
          { txt: 'hasil (4, 3)', hint: 'Urutannya terbalik: $4$ sapi dan $3$ kambing.' },
          { txt: 'vektor (34, 38), hasil (4, 3)', hint: 'Hasil dan vektornya sama-sama terbalik.' },
          { txt: 'hasil tertulis (3, 4)', hint: 'Hasil kali sebenarnya $(30,40)$.' },
          { txt: 'vektor (19, 34), hasil (3, 4)', ok: true },
        ],
      },
    },
    // ---- 10 · Selesai ----
    {
      ch: 10,
      cap: '<span class="verdict"><span class="seal">E</span><span>Pak Andi memelihara <b>3 sapi</b> dan <b>4 kambing</b>. Hanya E yang hasilnya $(3,4)$ dan perkaliannya benar.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: card('A'),
      ok: false,
      formula: `\\text{hasil}=${v('15', '20')}`,
      why: 'Hasilnya bukan $(3,4)$; matriksnya $5$ kali invers.',
    },
    {
      label: 'B',
      statement: card('B'),
      ok: false,
      formula: '10(4)+2(3)=46\\ne38',
      why: 'Urutan hasil terbalik: 4 sapi, 3 kambing.',
    },
    {
      label: 'C',
      statement: card('C'),
      ok: false,
      formula: `\\text{hasil}=${v('4', '3')}`,
      why: 'Jebakan urutan: vektor dan hasilnya terbalik.',
    },
    {
      label: 'D',
      statement: card('D'),
      ok: false,
      formula: `\\text{hasil kali}=${v('30', '40')}`,
      why: 'Hasil tertulis $(3,4)$, tetapi perkaliannya $(30,40)$.',
    },
    {
      label: 'E',
      statement: card('E'),
      ok: true,
      formula: '-\\tfrac{19}{5}+\\tfrac{34}{5}=3;\\ 38-34=4',
      why: 'Hasil $(3,4)$ dan perkaliannya benar.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 2: Pakan Sapi dan Kambing',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Matriks dan SPL',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Data dari gambar',
        lists: ['LD'],
        why: 'Total pakan = (pakan per ekor sapi × banyak sapi) + (pakan per ekor kambing × banyak kambing).',
      },
      {
        title: 'Model batang',
        lists: ['LB', 'LX', 'LH'],
        why: 'Bagian sapi $10x$ sama di kedua persamaan, jadi selisih keduanya hanya satu $y$: $y=38-34=4$.',
      },
      {
        title: 'Uji kelima pilihan',
        lists: ['LQ', 'LOA', 'LOB', 'LOC', 'LOD', 'LDM', 'LOE', 'LEM'],
        why: 'Syarat 1: hasilnya $(3,4)$. Syarat 2: perkalian baris × kolom memang menghasilkan $(3,4)$.',
      },
      {
        title: 'Cara alternatif dengan invers matriks (opsional)',
        lists: ['LI', 'LJ', 'LK', 'LT'],
        why: "$M\\mathbf v=\\mathbf b\\Rightarrow\\mathbf v=M^{-1}\\mathbf b$. Pilihan E memakai susunan setara $5x+y=19$ dengan matriks $M'$.",
      },
    ],
    answer: 'Jawaban: <b>E</b>; Pak Andi memelihara 3 sapi dan 4 kambing.',
  },
  done: {
    seal: 'E',
    message:
      'Pak Andi memelihara <b>3 sapi</b> dan <b>4 kambing</b>. Hanya E yang hasilnya $(3,4)$ dan perkaliannya benar.',
  },
  key: {
    answer: 'E',
    cardOk: [false, false, false, false, true],
    goldRows: ['h2', 'em3', 'v6', 'r1', 'r2'],
  },
  authorNotes: [
    'Ditulis ulang dengan alur guru (v1.29). Jalur utama memakai logika model batang (eliminasi): bagian sapi 10x sama di kedua persamaan, jadi y = 38 − 34 = 4, lalu x = 3; ini metode kedua di "Pemeriksaan hasil" dokumen.',
    'Invers matriks (dokumen Bagian 2–3) dan susunan setara 5x + y = 19 dipindah ke bagian opsional "Cara alternatif".',
    'Uji pilihan memakai dua syarat dari paragraf "Cara menguji" dokumen: cara cepat "hasil harus (3, 4)" untuk A, B, C; D dan E dikalikan baris × kolom (angka dari kartu D dan E dokumen).',
    'Tambahan turunan aljabar: matriks A = 5 × M′⁻¹ dan matriks D = 10 × M⁻¹, sehingga hasilnya 5 dan 10 kali (3, 4); matriks C sama dengan M⁻¹ (dokumen langkah i4) dengan vektor terbalik.',
    'Sorotan hasil 3 sapi dan 4 kambing pada gambar (yang belum dibuat di M2) kini ada; klaim pilihan A, B, C ditempel di atas hewannya.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q02;
