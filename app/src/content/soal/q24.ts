/**
 * SOAL 24 — Kerucut Es Krim dan Limit (pilihan banyak). Kunci: hanya pernyataan (5) benar.
 * Sumber: docs/pembahasan25.md "SOAL 24", docs/soal25.md no. 24, docs/kerucut_es_krim.png.
 * Alur mengikuti cara Pak Penta membahas di kelas (revisi 21 Okt 2026, dicatat di dokumen):
 * es krim berputar → beri nama jari-jari r (AB = 2r) → Y = ½πr² → X = ½·alas·tinggi, tinggi t dari
 * tan(θ/2) = depan/samping = r/t → X = r²/tan(θ/2) (angka 2 dicoret) → X/Y, r² dicoret →
 * X/Y = 2/(π tan(θ/2)) → uji kelima pernyataan satu per satu.
 * Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { F, H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { ConeState } from '../../visuals/cone';
import { getSoal } from '../index';

/** Gambar asli soal (docs/kerucut_es_krim.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/kerucut_es_krim.png', import.meta.url).href;
const cone = (state: Partial<ConeState>): Visual => ({
  kind: 'svg',
  scene: 'cone',
  state: { theta: 60, r: 4, ...state },
});
const HALF = '\\tan\\tfrac{\\theta}{2}';
const PQ = ['pQ'];

const q24: SoalContent = {
  meta: getSoal(24)!,
  sourceRef: 'docs/pembahasan25.md#soal-24',
  layout: 'full',
  paper: {
    html: `<div class="soal-split"><div>
<p>Sebuah <span class="hl hl-blue" data-hl="1"><span data-src="s-semi">setengah lingkaran dengan diameter AB</span></span> terletak pada <span class="hl hl-blue" data-hl="1"><span data-src="s-tri">segitiga sama kaki ABC</span></span> sehingga membentuk daerah menyerupai kerucut es krim seperti pada gambar berikut.</p>
<p>Jika luas segitiga ABC dinyatakan dengan <span class="hl" data-hl="1"><span data-src="s-X">$X$</span></span> dan luas setengah lingkaran dinyatakan dengan <span class="hl" data-hl="1"><span data-src="s-Y">$Y$</span></span>, manakah pernyataan berikut yang benar mengenai nilai <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">$\\lim_{\\theta\\rightarrow a}\\frac{X}{Y}$</span></span>?</p>
</div><figure class="soal-fig"><img src="${fig}" width="414" height="410" alt="Setengah lingkaran berdiameter AB di atas segitiga sama kaki ABC; sudut θ di titik C, kaki AC dan BC bertanda sama panjang." /></figure></div>
<ul class="checks">
<li>Besar jari-jari mempengaruhi nilai limit.</li>
<li>Besar sudut tidak mempengaruhi nilai limit.</li>
<li>Nilai $\\frac{X}{Y}$ selalu sama untuk berapa pun $\\theta$.</li>
<li>$\\lim_{\\theta\\rightarrow\\frac{\\pi}{6}}\\frac{X}{Y}=\\frac{2}{\\pi}$</li>
<li>Jika $\\theta=\\pi$ maka $\\frac{X}{Y}=0$</li>
</ul>`,
    srcNames: ['s-semi', 's-tri', 's-X', 's-Y', 's-tanya'],
  },
  visualSrc: ['g-theta', 'g-r', 'g-2r', 'g-t', 'g-half'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Limit dan trigonometri',
    titleLines: ['Pembahasan Soal', 'Kerucut <span class="accent">Es Krim</span>', 'Rasio luas'],
    lede: 'Soal limit geometri ini tampak rumit, padahal kalau konsepnya tahu, bisa selesai cepat dan logis.',
    facts: [
      { dt: 'X', dd: 'luas segitiga ABC' },
      { dt: 'Y', dd: 'luas setengah lingkaran' },
      { dt: 'Dicari', dd: 'lim X/Y' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Bentuk es krim, X dan Y' },
    { t: 'Luas setengah lingkaran', d: 'Y = ½πr²' },
    { t: 'Luas segitiga', d: 'Tinggi dari tangen' },
    { t: 'Gabungkan X/Y', d: 'r² dicoret' },
    { t: 'Uji kelima pernyataan', d: 'Satu per satu' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pernyataan', d: '5 kartu' },
    { t: 'Selesai', d: 'Hanya pernyataan (5)' },
  ],
  pins: {
    pX: {
      id: 'pX',
      toks: [T('PX1', 'X'), O('PX2', '='), T('PX3', `\\dfrac{r^2}{${HALF}}`)],
    },
    pT: {
      id: 'pT',
      toks: [T('PT1', 't'), O('PT2', '='), T('PT3', `\\dfrac{r}{${HALF}}`)],
    },
    pY: {
      id: 'pY',
      toks: [T('PY1', 'Y'), O('PY2', '='), T('PY3', '\\tfrac12\\pi r^2')],
    },
    pQ: {
      id: 'pQ',
      toks: [T('PQ1', '\\tfrac{X}{Y}'), O('PQ2', '='), T('PQ3', `\\dfrac{2}{\\pi${HALF}}`)],
    },
  },
  lists: {
    L1: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      { id: 'k2', toks: [T('k2a', 'X', 'blue', '@s-X'), O('k2b', '='), H('k2c', 'luas segitiga ABC', 'tx')] },
      {
        id: 'k3',
        toks: [T('k3a', 'Y', 'blue', '@s-Y'), O('k3b', '='), H('k3c', 'luas setengah lingkaran', 'tx')],
      },
      {
        id: 'k4',
        toks: [T('k4a', '\\theta', 'blue', '@g-theta'), O('k4b', '='), H('k4c', 'sudut puncak di C', 'tx')],
        note: 'segitiga sama kaki: $AC=BC$',
      },
      {
        id: 'k5',
        toks: [
          H('k5a', 'Ditanya', 'lbl'),
          T('k5b', '\\lim_{\\theta\\to a}\\dfrac{X}{Y}', 'gold', '@s-tanya'),
        ],
      },
    ],
    LY: [
      {
        id: 'y1',
        toks: [T('y1a', 'r', 'red', '@g-r'), O('y1b', '='), H('y1c', 'jari-jari', 'tx')],
        note: 'dari pusat $AB$ ke titik $B$',
      },
      {
        id: 'y2',
        toks: [T('y2a', 'AB'), O('y2b', '='), T('y2c', '2r', 'red', '@g-2r')],
        note: '$AB$ adalah diameter',
      },
      {
        id: 'y3',
        toks: [T('y3a', 'Y', '', '@s-Y'), O('y3b', '='), T('y3c', '\\tfrac12'), T('y3d', '\\pi r^2', 'blue')],
        note: 'setengah dari luas lingkaran $\\pi r^2$',
        box: 'navy',
      },
    ],
    LX: [
      {
        id: 'x1',
        toks: [
          T('x1a', 'X', '', '@s-X'),
          O('x1b', '='),
          T('x1c', '\\tfrac12\\times\\text{alas}\\times\\text{tinggi}'),
        ],
        note: 'alas $AB=2r$, tingginya belum diketahui',
      },
      {
        id: 'x2',
        toks: [
          T('x2a', '\\theta', '', '@g-theta'),
          O('x2b', '='),
          T('x2c', '\\tfrac{\\theta}{2}', 'blue'),
          O('x2d', '+'),
          T('x2e', '\\tfrac{\\theta}{2}', 'blue', '@g-half'),
        ],
        note: 'garis tinggi $t$ membagi sudut puncak sama besar',
      },
      {
        id: 'x3',
        toks: [
          T('x3a', '\\tan'),
          T('x3b', '\\tfrac{\\theta}{2}', 'blue', 'x2e'),
          O('x3c', '='),
          F([H('x3d', 'depan', 'tx')], [H('x3e', 'samping', 'tx')]),
          O('x3f', '='),
          F([T('x3g', 'r', 'red', '@g-r')], [T('x3h', 't', 'blue', '@g-t')]),
        ],
        note: 'Demi Sami Desa: depan per samping adalah tangen',
      },
      {
        id: 'x4',
        toks: [
          T('x4a', 't', 'blue', 'x3h'),
          O('x4b', '='),
          F([T('x4c', 'r', 'red', 'x3g')], [T('x4d', '\\tan\\tfrac{\\theta}{2}', '', 'x3b')]),
        ],
        note: 'rumus diputar untuk mencari tinggi',
        box: 'navy',
      },
    ],
    // langkah 3.5: baris tinggi diringkas menjadi pin t (papan tidak penuh)
    LX2: [
      {
        id: 'x5',
        toks: [
          T('x5a', 'X'),
          O('x5b', '='),
          F([T('x5c', '1')], [T('x5d', '2', 'x')]),
          O('x5e', '\\times'),
          T('x5f', '2', 'x', '@g-2r'),
          T('x5g', 'r'),
          O('x5h', '\\times'),
          F([T('x5i', 'r', 'red', 'PT3')], [T('x5j', '\\tan\\tfrac{\\theta}{2}', '', 'PT3')]),
        ],
        note: 'alas $2r$, tinggi $t$; angka $2$ saling coret',
      },
      {
        id: 'x6',
        toks: [T('x6a', 'X'), O('x6b', '='), F([T('x6c', 'r^2')], [T('x6d', '\\tan\\tfrac{\\theta}{2}')])],
        note: 'luas segitiga yang sederhana',
        box: 'navy',
      },
    ],
    LQ: [
      {
        id: 'q1',
        toks: [
          T('q1a', '\\dfrac{X}{Y}'),
          O('q1b', '='),
          F(
            [F([T('q1c', 'r^2', '', 'PX3')], [T('q1d', '\\tan\\tfrac{\\theta}{2}', '', 'PX3')])],
            [T('q1e', '\\tfrac12\\pi', '', 'PY3'), T('q1f', 'r^2', '', 'PY3')],
          ),
        ],
        note: '$X$ di atas, $Y$ di bawah',
      },
    ],
    // langkah 4.2: ekspresi yang sama kini dengan r² dicoret (menggantikan q1 di papan)
    LQ2: [
      {
        id: 'q2',
        toks: [
          T('q2a', '\\dfrac{X}{Y}'),
          O('q2b', '='),
          F(
            [F([T('q2c', 'r^2', 'x')], [T('q2d', '\\tan\\tfrac{\\theta}{2}')])],
            [T('q2e', '\\tfrac12\\pi'), T('q2f', 'r^2', 'x')],
          ),
        ],
        note: '$r^2$ di atas dan di bawah dicoret',
      },
      {
        id: 'q3',
        toks: [
          T('q3a', '\\dfrac{X}{Y}'),
          O('q3b', '='),
          F([T('q3c', '2', 'blue')], [T('q3d', '\\pi'), T('q3e', '\\tan\\tfrac{\\theta}{2}')]),
        ],
        note: 'jari-jari hilang; $1:\\frac12=2$ naik ke pembilang',
        box: 'navy',
      },
    ],
    L51: [
      {
        id: 'p1',
        toks: [
          T('p1a', '(1)', 'sp'),
          T('p1b', 'r', 'red'),
          H('p1c', 'tidak ada di', 'tx'),
          T('p1d', `\\dfrac{2}{\\pi${HALF}}`, '', 'PQ3'),
        ],
        note: 'jari-jari tidak berpengaruh → <b class="k-red">salah</b>',
      },
    ],
    L52: [
      {
        id: 'p2',
        toks: [
          T('p2a', '(2)', 'sp'),
          T('p2b', '\\lim_{\\theta\\to a}\\dfrac{X}{Y}'),
          O('p2c', '='),
          T('p2d', '\\dfrac{2}{\\pi\\tan\\frac{a}{2}}', '', 'PQ3'),
        ],
        note: 'hasilnya bergantung pada sudut $a$ → <b class="k-red">salah</b>',
      },
    ],
    L53: [
      {
        id: 'p3',
        toks: [
          T('p3a', '(3)', 'sp'),
          T('p3b', '\\theta=90^\\circ'),
          O('p3c', ':'),
          T('p3d', '\\tan45^\\circ'),
          O('p3e', '='),
          T('p3f', '1', 'blue'),
        ],
        note: 'setengah dari $90^\\circ$ adalah $45^\\circ$',
      },
      {
        id: 'p4',
        toks: [
          T('p4a', '\\dfrac{X}{Y}'),
          O('p4b', '='),
          F([T('p4c', '2')], [T('p4d', '\\pi\\cdot'), T('p4e', '1', 'blue', 'p3f')]),
          O('p4f', '='),
          T('p4g', '\\dfrac{2}{\\pi}'),
          O('p4h', '\\approx'),
          T('p4i', '0{,}64'),
        ],
        note: 'nilai di $\\theta=90^\\circ$',
      },
      {
        id: 'p5',
        toks: [
          T('p5a', '\\theta=60^\\circ'),
          O('p5b', ':'),
          T('p5c', '\\dfrac{2}{\\pi\\cdot\\frac{\\sqrt3}{3}}'),
          O('p5d', '\\approx'),
          T('p5e', '1{,}10'),
          O('p5f', '\\ne'),
          T('p5g', '0{,}64', '', 'p4i'),
        ],
        note: '$\\tan30^\\circ=\\frac{\\sqrt3}{3}$; nilainya berubah → <b class="k-red">salah</b>',
      },
    ],
    L54: [
      {
        id: 'p6',
        toks: [
          T('p6a', '(4)', 'sp'),
          T('p6b', '\\theta\\to\\tfrac{\\pi}{6}'),
          O('p6c', ':'),
          T('p6d', '\\tan15^\\circ'),
          O('p6e', '='),
          T('p6f', '2-\\sqrt3', 'blue'),
        ],
        note: 'setengah dari $30^\\circ$ adalah $15^\\circ$',
      },
      {
        id: 'p7',
        toks: [
          T('p7a', '\\lim\\dfrac{X}{Y}'),
          O('p7b', '='),
          F([T('p7c', '2')], [T('p7d', '\\pi'), T('p7e', '(2-\\sqrt3)', 'blue', 'p6f')]),
          O('p7f', '\\approx'),
          T('p7g', '2{,}38'),
          O('p7h', '\\ne'),
          T('p7i', '\\dfrac{2}{\\pi}'),
        ],
        note: 'bukan $\\frac{2}{\\pi}$ → <b class="k-red">salah</b>',
      },
    ],
    L55: [
      {
        id: 'p8',
        toks: [
          T('p8a', '(5)', 'sp'),
          T('p8b', '\\theta=\\pi'),
          O('p8c', ':'),
          T('p8d', 't'),
          O('p8e', '='),
          T('p8f', '0', 'blue'),
        ],
        note: 'kaki segaris, titik $C$ jatuh di $AB$',
      },
      {
        id: 'p9',
        toks: [
          T('p9a', 'X'),
          O('p9b', '='),
          T('p9c', '\\tfrac12\\cdot2r\\cdot'),
          T('p9d', '0', 'blue', 'p8f'),
          O('p9e', '='),
          T('p9f', '0'),
          O('p9g', '\\Rightarrow'),
          T('p9h', '\\dfrac{X}{Y}=0', 'gold'),
        ],
        note: 'pernyataan (5) <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    L7: [
      { id: 's6', toks: [H('s6a', 'Jawaban', 'lbl'), H('s6b', 'hanya pernyataan (5)', 'tx')], box: 'gold' },
    ],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', `\\dfrac{X}{Y}=\\dfrac{2}{\\pi${HALF}}`)],
        note: 'bebas dari $r$, bergantung pada $\\theta$',
        box: 'navy',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), H('r2b', 'hanya pernyataan (5)', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan es krim ini: setengah lingkaran berdiameter $AB$ di atas, segitiga sama kaki $ABC$ di bawah, dengan sudut puncak $\\theta$ di $C$.',
      visual: cone({ spin: true, areas: true }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 4, from: 0 },
    },
    {
      ch: 1,
      cap: 'Yang ditanya nilai $\\lim_{\\theta\\to a}\\frac XY$. Yuk kita bedah satu per satu, lalu uji kelima pernyataannya.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 5, from: 4 },
    },
    // ---- 2 · Luas setengah lingkaran ----
    {
      ch: 2,
      cap: 'Langkah pertama, beri nama jari-jari setengah lingkaran ini $r$. Diameternya $AB$, jadi panjangnya $2r$.',
      visual: cone({ rad: true, diam: true }),
      board: { title: 'Luas setengah lingkaran', list: 'LY', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Masih ingat luas lingkaran, $\\pi r^2$? Karena ini hanya setengahnya, luasnya juga setengah.',
      visual: cone({ semi: true, rad: true }),
      board: { title: 'Luas setengah lingkaran', list: 'LY', upTo: 3, from: 2 },
      ask: {
        before: 'y3',
        q: 'Luas setengah lingkaran dengan jari-jari $r$ adalah…',
        opts: [
          { tex: '\\tfrac12\\pi r^2', ok: true },
          { tex: '\\pi r^2', hint: 'Itu luas lingkaran penuh. Yang di gambar hanya setengahnya.' },
          { tex: '\\pi r', hint: 'Itu setengah keliling lingkaran, bukan luas.' },
          { tex: '\\tfrac14\\pi r^2', hint: 'Itu luas seperempat lingkaran.' },
        ],
      },
    },
    // ---- 3 · Luas segitiga ----
    {
      ch: 3,
      cap: 'Sekarang luas segitiga $X$: $\\frac12\\times$ alas $\\times$ tinggi. Alasnya $AB=2r$, masalahnya berapa tingginya?',
      visual: cone({ tri: true, diam: true }),
      board: { title: 'Luas segitiga', list: 'LX', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Tarik garis tinggi $t$ dari $C$ tegak lurus ke tengah $AB$. Sudut $\\theta$ terbelah menjadi dua sama besar.',
      visual: cone({ tri: true, height: true, split: true }),
      board: { title: 'Luas segitiga', list: 'LX', upTo: 2, from: 1 },
      ask: {
        before: 'x2',
        q: 'Garis tinggi membagi sudut $\\theta$ di $C$. Sudut puncak segitiga siku-siku kecil adalah…',
        opts: [
          { tex: '\\tfrac{\\theta}{2}', ok: true },
          {
            tex: '\\theta',
            hint: '$\\theta$ adalah seluruh sudut di $C$. Garis tinggi membaginya menjadi dua sama besar.',
          },
          {
            tex: '90^\\circ-\\theta',
            hint: 'Itu bukan sudut di $C$. Sudut puncaknya separuh dari $\\theta$.',
          },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Lihat segitiga siku-siku di kanan: sudutnya $\\frac\\theta2$, sisi depannya $r$, sisi sampingnya $t$. Depan per samping adalah tangen!',
      visual: cone({ right: true, height: true, split: true }),
      board: { title: 'Luas segitiga', list: 'LX', upTo: 3, from: 2 },
    },
    {
      ch: 3,
      cap: 'Putar rumusnya untuk mencari tinggi $t$: kalikan dengan $t$, lalu bagi dengan $\\tan\\frac\\theta2$.',
      visual: cone({ right: true, height: true, split: true }),
      board: { title: 'Luas segitiga', list: 'LX', upTo: 4, from: 3 },
    },
    {
      ch: 3,
      cap: 'Masukkan alas $2r$ dan tinggi $t$ ke rumus luas. Angka $2$ di penyebut dan di depan $r$ saling coret, jadi luasnya sederhana.',
      visual: cone({ tri: true, height: true, diam: true }),
      board: { title: 'Luas segitiga', pins: ['pT'], list: 'LX2', upTo: 2, from: 0 },
    },
    // ---- 4 · Gabungkan X/Y ----
    {
      ch: 4,
      cap: 'Langkah terakhir, gabungkan keduanya menjadi perbandingan $\\frac XY$ seperti yang diminta soal.',
      visual: cone({ areas: true, semi: true, tri: true }),
      board: { title: 'Gabungkan X/Y', pins: ['pX', 'pY'], list: 'LQ', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Di atas ada $r^2$, di bawah juga $r^2$, jadi kita coret! Jari-jari hilang dari rumus dan tersisa bentuk sederhana.',
      visual: cone({ areas: true, semi: true, tri: true }),
      board: { title: 'Gabungkan X/Y', pins: ['pX', 'pY'], list: 'LQ2', upTo: 2, from: 0 },
    },
    // ---- 5 · Uji kelima pernyataan ----
    {
      ch: 5,
      cap: 'Pernyataan (1): $r$ sudah hilang dari rumus. Lihat, jari-jari diubah tetapi $\\frac XY$ tetap, jadi (1) <b class="k-red">salah</b>.',
      visual: cone({ r: 2.5, areas: true, lab: true }),
      board: { title: 'Pernyataan (1)', pins: PQ, list: 'L51', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pernyataan (2): rumusnya masih memuat sudut. Saat sudut berubah, nilainya ikut berubah, jadi (2) <b class="k-red">salah</b>.',
      visual: cone({ theta: 120, areas: true, lab: true }),
      board: { title: 'Pernyataan (2)', pins: PQ, list: 'L52', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pernyataan (3): uji dulu di $\\theta=90^\\circ$. Setengahnya $45^\\circ$, dan $\\tan45^\\circ=1$.',
      visual: cone({ theta: 90, height: true, split: true, lab: true }),
      board: { title: 'Pernyataan (3)', pins: PQ, list: 'L53', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Sekarang $\\theta=60^\\circ$: nilainya sekitar $1{,}10$, berbeda dari $0{,}64$. Jadi nilainya tidak selalu sama, (3) <b class="k-red">salah</b>.',
      visual: cone({ theta: 60, height: true, split: true, lab: true }),
      board: { title: 'Pernyataan (3)', pins: PQ, list: 'L53', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: 'Pernyataan (4): $\\theta\\to\\frac\\pi6$ berarti $30^\\circ$, setengahnya $15^\\circ$. Hasilnya sekitar $2{,}38$, bukan $\\frac2\\pi$, jadi (4) <b class="k-red">salah</b>.',
      visual: cone({ theta: 30, height: true, split: true, lab: true }),
      board: { title: 'Pernyataan (4)', pins: PQ, list: 'L54', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pernyataan (5): saat $\\theta=\\pi$, titik $C$ jatuh di $AB$ sehingga tingginya $0$. Luas $X=0$, jadi $\\frac XY=0$ dan (5) <b class="k-gold">benar</b>.',
      visual: cone({ theta: 180, lab: true }),
      board: { title: 'Pernyataan (5)', pins: PQ, list: 'L55', upTo: 2, from: 0 },
    },
    // ---- 6 · Catatan lengkap ----
    {
      ch: 6,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 7 · Cocokkan pernyataan ----
    {
      ch: 7,
      cap: 'Cocokkan dengan kelima pernyataan: hanya (5) yang benar. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pernyataan', pins: PQ, list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 's6',
        q: 'Pernyataan yang benar adalah…',
        col: true,
        win: 'Hanya pernyataan <b>(5)</b>.',
        opts: [
          { txt: '(1) dan (5)', hint: 'Jari-jari hilang setelah $r^2$ dicoret, jadi (1) salah.' },
          {
            txt: '(2) dan (5)',
            hint: 'Rumusnya masih memuat sudut: nilai limit berubah saat sudut berubah.',
          },
          {
            txt: '(3) dan (5)',
            hint: 'Di $90^\\circ$ nilainya $0{,}64$, di $60^\\circ$ sekitar $1{,}10$. Tidak selalu sama.',
          },
          {
            txt: '(4) dan (5)',
            hint: 'Di $\\theta=\\frac\\pi6$ hasilnya sekitar $2{,}38$, bukan $\\frac2\\pi$.',
          },
          { txt: '(5) saja', ok: true },
        ],
      },
    },
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">(5)</span><span>$\\frac XY=\\frac{2}{\\pi\\tan\\frac\\theta2}$: bebas dari jari-jari, tetapi bergantung pada sudut. Hanya pernyataan (5) yang benar.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: '(1)',
      statement: 'Besar jari-jari mempengaruhi nilai limit.',
      ok: false,
      formula: 'r^2\\ \\text{dicoret}',
      why: 'Jari-jari hilang dari $\\frac XY$.',
    },
    {
      label: '(2)',
      statement: 'Besar sudut tidak mempengaruhi nilai limit.',
      ok: false,
      formula: '\\tfrac{2}{\\pi\\tan\\frac a2}\\ \\text{bergantung } a',
      why: 'Nilai limit berubah saat sudut berubah.',
    },
    {
      label: '(3)',
      statement: 'Nilai $\\frac{X}{Y}$ selalu sama untuk berapa pun $\\theta$.',
      ok: false,
      formula: '0{,}64\\ne1{,}10',
      why: 'Di $90^\\circ$ dan $60^\\circ$ nilainya berbeda.',
    },
    {
      label: '(4)',
      statement: '$\\lim_{\\theta\\to\\frac{\\pi}{6}}\\frac{X}{Y}=\\frac{2}{\\pi}$',
      ok: false,
      formula: '\\tfrac{2}{\\pi(2-\\sqrt3)}\\approx2{,}38',
      why: 'Dengan $\\tan15^\\circ=2-\\sqrt3$, hasilnya bukan $\\frac2\\pi$.',
    },
    {
      label: '(5)',
      statement: 'Jika $\\theta=\\pi$ maka $\\frac{X}{Y}=0$',
      ok: true,
      formula: 't=0\\Rightarrow X=0',
      why: 'Titik $C$ jatuh di $AB$, luas segitiga nol.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 24: Kerucut Es Krim dan Limit',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Limit trigonometri pada geometri',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      { title: 'Luas setengah lingkaran', lists: ['LY'] },
      {
        title: 'Luas segitiga',
        lists: ['LX', 'LX2'],
        sketch: 'cone',
        why: 'Garis tinggi dari $C$ membagi sudut $\\theta$ dan alas $AB$ menjadi dua bagian sama. Pada segitiga siku-siku kanan: $\\tan\\frac\\theta2=\\frac{\\text{depan}}{\\text{samping}}=\\frac rt$.',
      },
      { title: 'Gabungkan X/Y', lists: ['LQ', 'LQ2'] },
      { title: 'Uji kelima pernyataan', lists: ['L51', 'L52', 'L53', 'L54', 'L55'] },
    ],
    answer:
      'Jawaban: hanya pernyataan <b>(5)</b> yang benar; $\\frac XY=\\frac{2}{\\pi\\tan\\frac\\theta2}$.',
  },
  done: {
    seal: '(5)',
    message:
      '$\\frac XY=\\frac{2}{\\pi\\tan\\frac\\theta2}$: bebas dari jari-jari, tetapi bergantung pada sudut. Hanya pernyataan (5) yang benar.',
  },
  key: {
    answer: '(5)',
    cardOk: [false, false, false, false, true],
    goldRows: ['p9', 's6', 'r2'],
  },
  authorNotes: [
    'Alur mengikuti cara Pak Penta membahas di kelas (pesan 21 Okt 2026): es krim berputar, jari-jari r dan 2r, Y, tinggi dari tangen (Demi Sami Desa), angka 2 dan r² dicoret, lalu uji pernyataan.',
    'Bentuk tan dipakai sesuai penjelasan guru: X/Y = 2/(π tan(θ/2)), setara dengan (2/π) cot(θ/2) di dokumen.',
    'Pernyataan (3) diuji di 90° (tan 45° = 1, nilai 2/π) dan 60° (tan 30° = √3/3, ≈ 1,10); pernyataan (4) memakai tan 15° = 2 − √3 (≈ 2,38).',
    'Pertanyaan cepat luas setengah lingkaran ditambahkan dari penjelasan guru; dicatat di dokumen.',
  ],
};

export default q24;
