/**
 * SOAL 24 — Kerucut Es Krim dan Limit (pilot mesin visual SVG, PRD §5.1).
 * Sumber: docs/pembahasan25.md "SOAL 24", docs/soal25.md no. 24, docs/kerucut_es_krim.png.
 * Kunci: hanya pernyataan (5) benar; X/Y = (2/π)·cot(θ/2).
 */
import { F, H, O, T } from '../../engine/dsl';
import type { SoalContent } from '../../engine/types';
import { getSoal } from '../index';

const PIN = ['pXY'];
/** Gambar asli soal (docs/kerucut_es_krim.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/kerucut_es_krim.png', import.meta.url).href;

const q24: SoalContent = {
  meta: getSoal(24)!,
  sourceRef: 'docs/pembahasan25.md#soal-24',
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
  visualSrc: ['g-theta'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Limit dan trigonometri',
    titleLines: ['Pembahasan Soal', 'Kerucut <span class="accent">Es Krim</span>', 'Rasio luas'],
    lede: 'Segitiga di bawah dan setengah lingkaran di atas membentuk bentuk es krim. Bagaimana perbandingan luas keduanya berubah ketika sudut $\\theta$ berubah?',
    facts: [
      { dt: 'X', dd: 'luas segitiga ABC' },
      { dt: 'Y', dd: 'luas setengah lingkaran' },
      { dt: 'Dicari', dd: 'X/Y dan limitnya' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Rumus X, Y, dan X/Y', d: 'X/Y = (2/π) cot(θ/2)' },
    { t: 'Menilai kelima pernyataan', d: 'Sudut berpengaruh, jari-jari tidak' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Analisis pernyataan', d: '5 kartu' },
    { t: 'Selesai', d: 'Hanya pernyataan (5)' },
  ],
  pins: {
    pXY: {
      id: 'pXY',
      gold: true,
      toks: [T('Pq1', '\\tfrac{X}{Y}'), O('Pq2', '='), T('Pq3', '\\tfrac{2}{\\pi}\\cot\\tfrac{\\theta}{2}')],
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
        toks: [T('k4a', 'AB', '', '@s-semi'), O('k4b', '='), H('k4c', 'diameter', 'tx')],
        note: 'setengah lingkaran di atas $AB$',
      },
      {
        id: 'k5',
        toks: [T('k5a', '\\theta'), O('k5b', '='), T('k5c', '\\angle ACB')],
        note: 'di titik $C$, antara kedua kaki',
      },
      {
        id: 'k6',
        toks: [
          H('k6a', 'Ditanya', 'lbl'),
          T('k6b', '\\lim_{\\theta\\to a}\\dfrac{X}{Y}', 'gold', '@s-tanya'),
        ],
      },
    ],
    L2: [
      {
        id: 'a1',
        toks: [T('a1a', 'AB'), O('a1b', '='), T('a1c', '2r', '', '@s-semi')],
        note: '$AB$ = diameter setengah lingkaran',
      },
      {
        id: 'a2',
        toks: [T('a2a', 'AM'), O('a2b', '='), T('a2c', 'r', 'red')],
        note: '$M$ titik tengah $AB$',
      },
      {
        id: 'a3',
        toks: [
          T('a3a', '\\tan'),
          T('a3b', '\\frac{\\theta}{2}', 'blue', '@g-theta'),
          O('a3c', '='),
          F([T('a3d', 'AM')], [T('a3e', 'CM')]),
          O('a3f', '='),
          F([T('a3g', 'r', 'red', 'a2c')], [T('a3h', 'CM')]),
        ],
        note: 'sudut $ACM=\\frac\\theta2$',
      },
      {
        id: 'a4',
        toks: [
          T('a4a', 'CM'),
          O('a4b', '='),
          F([T('a4c', 'r', 'red', 'a3g')], [T('a4d', '\\tan\\frac{\\theta}{2}')]),
          O('a4e', '='),
          T('a4f', 'r\\cot\\dfrac{\\theta}{2}'),
        ],
        box: 'navy',
      },
      {
        id: 'b1',
        toks: [
          T('b1a', 'X'),
          O('b1b', '='),
          T('b1c', '\\tfrac12\\cdot AB\\cdot CM'),
          O('b1d', '='),
          T('b1e', '\\tfrac12'),
          T('b1f', '(2r)', '', 'a1c'),
          T('b1g', '\\left(r\\cot\\tfrac{\\theta}{2}\\right)', '', 'a4f'),
        ],
        note: 'luas segitiga',
      },
      {
        id: 'b2',
        toks: [T('b2a', 'X', '', 'b1a'), O('b2b', '='), T('b2c', 'r^2\\cot\\dfrac{\\theta}{2}')],
        note: '$\\frac12\\cdot2=1$',
        box: 'navy',
      },
      {
        id: 'b3',
        toks: [T('b3a', 'Y', '', '@s-Y'), O('b3b', '='), T('b3c', '\\tfrac12\\pi r^2')],
        note: 'luas setengah lingkaran',
        box: 'navy',
      },
      {
        id: 'c1',
        toks: [
          F([T('c1a', 'X')], [T('c1b', 'Y')]),
          O('c1c', '='),
          F([T('c1d', 'r^2\\cot\\tfrac{\\theta}{2}', '', 'b2c')], [T('c1e', '\\tfrac12\\pi r^2', '', 'b3c')]),
        ],
      },
      {
        id: 'c2',
        toks: [
          F([T('c2a', 'X')], [T('c2b', 'Y')]),
          O('c2c', '='),
          T('c2d', '\\dfrac{2}{\\pi}\\cot\\dfrac{\\theta}{2}', 'gold'),
        ],
        note: '$r^2$ saling menghilang',
        box: 'gold',
      },
      {
        id: 'c3',
        toks: [
          T('c3a', '\\displaystyle\\lim_{\\theta\\to a}\\dfrac{X}{Y}'),
          O('c3b', '='),
          T('c3c', '\\dfrac{2}{\\pi}\\cot\\dfrac{a}{2}', 'gold'),
        ],
        note: '$\\cot\\frac\\theta2$ kontinu untuk $0<a\\le\\pi$',
        box: 'gold',
      },
    ],
    L3: [
      {
        id: 'd1',
        toks: [
          T('d1a', '(1)', 'sp'),
          T('d1b', 'r', 'red'),
          H('d1c', 'tidak muncul di', 'tx'),
          T('d1d', '\\tfrac{2}{\\pi}\\cot\\tfrac{\\theta}{2}', '', 'Pq3'),
        ],
        note: 'jari-jari tidak berpengaruh → <b class="k-red">salah</b>',
      },
      {
        id: 'd2',
        toks: [
          T('d2a', '(2)', 'sp'),
          H('d2b', 'limit bergantung pada', 'tx'),
          T('d2c', 'a'),
          O('d2d', ':'),
          T('d2e', '\\tfrac{2}{\\pi}\\cot\\tfrac{a}{2}'),
        ],
        note: 'sudut berpengaruh → <b class="k-red">salah</b>',
      },
      {
        id: 'd3',
        toks: [
          T('d3a', '(3)', 'sp'),
          T('d3b', '\\tfrac{X}{Y}', '', 'Pq1'),
          H('d3c', 'berubah mengikuti', 'tx'),
          T('d3d', '\\theta', '', '@g-theta'),
        ],
        note: 'tidak selalu sama → <b class="k-red">salah</b>',
      },
      {
        id: 'd4',
        toks: [
          T('d4a', '(4)', 'sp'),
          T('d4b', 'a=\\tfrac{\\pi}{6}'),
          O('d4c', ':'),
          T('d4d', '\\tfrac{2}{\\pi}\\cot\\tfrac{\\pi}{12}'),
          O('d4e', '='),
          T('d4f', '\\tfrac{2}{\\pi}(2+\\sqrt3)'),
          O('d4g', '\\approx'),
          T('d4h', '2{,}38'),
          O('d4i', '\\ne'),
          T('d4j', '\\tfrac{2}{\\pi}'),
        ],
        note: '$\\cot15^\\circ=2+\\sqrt3$ → <b class="k-red">salah</b>',
      },
      {
        id: 'd5',
        toks: [
          T('d5a', '(5)', 'sp'),
          T('d5b', '\\theta=\\pi'),
          O('d5c', ':'),
          T('d5d', '\\tfrac{2}{\\pi}\\cot\\tfrac{\\pi}{2}'),
          O('d5e', '='),
          T('d5f', '\\tfrac{2}{\\pi}(0)'),
          O('d5g', '='),
          T('d5h', '0', 'gold'),
        ],
        note: '→ <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    L5: [
      {
        id: 's1',
        toks: [T('s1a', '(1)', 'sp'), T('s1b', 'r^2\\ \\text{habis dibagi}'), T('s1c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's2',
        toks: [
          T('s2a', '(2)', 'sp'),
          T('s2b', '\\tfrac{2}{\\pi}\\cot\\tfrac{a}{2}\\ \\text{bergantung } a'),
          T('s2c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's3',
        toks: [
          T('s3a', '(3)', 'sp'),
          T('s3b', '\\tfrac{2}{\\pi}\\cot\\tfrac{\\theta}{2}\\ \\text{berubah}', '', 'Pq3'),
          T('s3c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's4',
        toks: [
          T('s4a', '(4)', 'sp'),
          T('s4b', '\\approx2{,}38\\ne\\tfrac{2}{\\pi}'),
          T('s4c', '\\;\\times', 'red'),
        ],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's5',
        toks: [
          T('s5a', '(5)', 'sp'),
          T('s5b', '\\cot\\tfrac{\\pi}{2}=0'),
          T('s5c', '\\;\\checkmark', 'gold'),
        ],
        note: '<b class="k-gold">BENAR</b>',
      },
      { id: 's6', toks: [H('s6a', 'Jawaban', 'lbl'), H('s6b', 'hanya pernyataan (5)', 'tx')], box: 'gold' },
    ],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', '\\dfrac{X}{Y}=\\dfrac{2}{\\pi}\\cot\\dfrac{\\theta}{2}')],
        note: 'bebas dari $r$, bergantung pada $\\theta$',
        box: 'gold',
      },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Baca soal dan lihat gambar. Sudut $\\theta$ ada di titik $C$, di antara kedua kaki.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 5, from: 0 },
    },
    {
      ch: 1,
      cap: 'Kita cari rumus $\\frac XY$ dahulu, baru menilai kelima pernyataan.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 6, from: 5 },
    },
    // ---- 2 · Rumus X, Y, X/Y ----
    {
      ch: 2,
      cap: 'Tarik tinggi $CM$ dari $C$ ke tengah $AB$. Segitiga siku-siku $AMC$ punya sudut $\\frac\\theta2$ di $C$.',
      visual: { kind: 'svg', scene: 'cone', state: { theta: 60, r: 3, height: true, half: true } },
      board: { title: 'Tinggi segitiga', list: 'L2', upTo: 4, from: 0 },
      ask: {
        before: 'a3',
        q: 'Sudut $ACM$ di segitiga siku-siku $AMC$ adalah…',
        opts: [
          { tex: '\\dfrac{\\theta}{2}', ok: true },
          {
            tex: '\\theta',
            hint: '$\\theta$ adalah seluruh sudut di $C$. Garis tinggi membaginya menjadi dua sama besar.',
          },
          { tex: '90^\\circ-\\theta', hint: 'Itu bukan sudut di $C$. Sudut $ACM$ separuh dari $\\theta$.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Luas segitiga memakai alas $AB$ dan tinggi $CM$. Luas setengah lingkaran adalah $\\frac12\\pi r^2$.',
      visual: { kind: 'svg', scene: 'cone', state: { theta: 60, r: 3, height: true, areas: true } },
      board: { title: 'Tinggi segitiga', list: 'L2', upTo: 7, from: 4 },
    },
    {
      ch: 2,
      cap: 'Bagi $X$ dengan $Y$. Jari-jari $r^2$ saling menghilang.',
      visual: { kind: 'svg', scene: 'cone', state: { theta: 60, r: 3, height: true, areas: true } },
      board: { title: 'Tinggi segitiga', list: 'L2', upTo: 10, from: 7 },
    },
    {
      ch: 2,
      cap: 'Coba sendiri: geser jari-jari, nilai $\\frac XY$ tidak berubah. Geser sudut $\\theta$, nilainya berubah.',
      visual: { kind: 'svg', scene: 'cone', state: { theta: 60, r: 3, areas: true, lab: true } },
      board: { title: 'Tinggi segitiga', list: 'L2', upTo: 10, from: 10 },
    },
    // ---- 3 · Menilai kelima pernyataan ----
    {
      ch: 3,
      cap: 'Pernyataan (1): jari-jari $r$ tidak muncul di $\\frac2\\pi\\cot\\frac\\theta2$. Lihat, $\\frac XY$ tetap saat jari-jari diubah.',
      visual: { kind: 'svg', scene: 'cone', state: { theta: 60, r: 4.5, areas: true, lab: true } },
      board: { title: 'Menilai pernyataan', pins: PIN, list: 'L3', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Pernyataan (2): hasil limit bergantung pada $a$, jadi besar sudut berpengaruh.',
      visual: { kind: 'svg', scene: 'cone', state: { theta: 120, r: 3, areas: true, lab: true } },
      board: { title: 'Menilai pernyataan', pins: PIN, list: 'L3', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Pernyataan (3): $\\frac XY$ berubah mengikuti $\\theta$, jadi nilainya tidak selalu sama.',
      visual: { kind: 'svg', scene: 'cone', state: { theta: 90, r: 3, areas: true, lab: true } },
      board: { title: 'Menilai pernyataan', pins: PIN, list: 'L3', upTo: 3, from: 2 },
      optional: {
        label: 'Tabel nilai X/Y',
        yes: 'Ya, lihat tabel nilai',
        panel: `<p>Nilai $\\frac XY=\\frac2\\pi\\cot\\frac\\theta2$ untuk beberapa sudut:</p>
<table class="n-table num"><thead><tr><th scope="col">$\\theta$</th><th scope="col">$\\frac XY$</th></tr></thead><tbody>
<tr><td>$\\frac\\pi6$</td><td>$\\frac2\\pi(2+\\sqrt3)\\approx2{,}38$</td></tr>
<tr><td>$\\frac\\pi3$</td><td>$\\frac2\\pi\\sqrt3\\approx1{,}10$</td></tr>
<tr><td>$\\frac\\pi2$</td><td>$\\frac2\\pi\\approx0{,}64$</td></tr>
<tr><td>$\\frac{2\\pi}3$</td><td>$\\frac2\\pi\\cdot\\frac{\\sqrt3}3\\approx0{,}37$</td></tr>
<tr><td>$\\pi$</td><td>$0$</td></tr></tbody></table>`,
      },
    },
    {
      ch: 3,
      cap: 'Pernyataan (4): di $\\theta=\\frac\\pi6$ nilainya $\\frac2\\pi(2+\\sqrt3)\\approx2{,}38$, bukan $\\frac2\\pi$.',
      visual: { kind: 'svg', scene: 'cone', state: { theta: 30, r: 3, areas: true, lab: true } },
      board: { title: 'Menilai pernyataan', pins: PIN, list: 'L3', upTo: 4, from: 3 },
    },
    {
      ch: 3,
      cap: 'Pernyataan (5): saat $\\theta=\\pi$, segitiga menjadi garis lurus dan luasnya $X=0$.',
      visual: { kind: 'svg', scene: 'cone', state: { theta: 180, r: 3, areas: true, lab: true } },
      board: { title: 'Menilai pernyataan', pins: PIN, list: 'L3', upTo: 5, from: 4 },
    },
    // ---- 4 · Catatan lengkap ----
    {
      ch: 4,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 5 · Analisis pernyataan (5 kartu) ----
    {
      ch: 5,
      cap: 'Hasil kita $\\frac XY=\\frac2\\pi\\cot\\frac\\theta2$. Sekarang periksa kelima pernyataan.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Analisis pernyataan', pins: PIN, list: 'L5', upTo: 0, from: 0 },
    },
    {
      ch: 5,
      cap: '(1) Jari-jari menghilang dari perbandingan. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Analisis pernyataan', pins: PIN, list: 'L5', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: '(2) Nilai limit berubah ketika sudut $a$ berubah. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Analisis pernyataan', pins: PIN, list: 'L5', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: '(3) Jebakan: karena $r$ tidak berpengaruh, seluruh nilai dikira konstan. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Analisis pernyataan', pins: PIN, list: 'L5', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: '(4) $\\frac2\\pi$ adalah nilai di $\\theta=\\frac\\pi2$, bukan di $\\frac\\pi6$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 4 },
      board: { title: 'Analisis pernyataan', pins: PIN, list: 'L5', upTo: 4, from: 3 },
    },
    {
      ch: 5,
      cap: '(5) Segitiga menjadi garis lurus sehingga $X=0$ (<b class="k-gold">benar</b>). Pilih kesimpulannya di papan tulis.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Analisis pernyataan', pins: PIN, list: 'L5', upTo: 6, from: 4 },
      ask: {
        before: 's6',
        q: 'Pernyataan yang benar adalah…',
        col: true,
        win: 'Hanya pernyataan <b>(5)</b>.',
        opts: [
          { txt: '(1) dan (5)', hint: 'Jari-jari tidak berpengaruh: $r^2$ habis dibagi.' },
          { txt: '(2) dan (5)', hint: 'Nilai limit berubah ketika sudut $a$ berubah, jadi (2) salah.' },
          {
            txt: '(3) dan (5)',
            hint: '$\\frac2\\pi\\cot\\frac\\theta2$ berubah mengikuti $\\theta$, jadi (3) salah.',
          },
          {
            txt: '(4) dan (5)',
            hint: '$\\frac2\\pi$ adalah nilai di $\\theta=\\frac\\pi2$, bukan $\\frac\\pi6$.',
          },
          { txt: '(5) saja', ok: true },
        ],
      },
    },
    // ---- 6 · Selesai ----
    {
      ch: 6,
      cap: '<span class="verdict"><span class="seal">(5)</span><span>$\\frac XY=\\frac2\\pi\\cot\\frac\\theta2$: bebas dari jari-jari, tetapi bergantung pada sudut. Hanya pernyataan (5) yang benar.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 1, from: 1 },
    },
  ],
  cards: [
    {
      label: '(1)',
      statement: 'Besar jari-jari mempengaruhi nilai limit.',
      ok: false,
      formula: 'r^2\\ \\text{habis dibagi}',
      why: 'Jari-jari menghilang dari perbandingan.',
    },
    {
      label: '(2)',
      statement: 'Besar sudut tidak mempengaruhi nilai limit.',
      ok: false,
      formula: '\\tfrac2\\pi\\cot\\tfrac a2\\ \\text{bergantung } a',
      why: 'Nilai limit berubah ketika sudut $a$ berubah.',
    },
    {
      label: '(3)',
      statement: 'Nilai $\\frac{X}{Y}$ selalu sama untuk berapa pun $\\theta$.',
      ok: false,
      formula: '\\tfrac2\\pi\\cot\\tfrac\\theta2\\ \\text{berubah}',
      why: 'Jebakan: karena $r$ tidak berpengaruh, mengira seluruh nilai konstan.',
    },
    {
      label: '(4)',
      statement: '$\\lim_{\\theta\\to\\frac{\\pi}{6}}\\frac{X}{Y}=\\frac{2}{\\pi}$',
      ok: false,
      formula: '\\tfrac2\\pi(2+\\sqrt3)\\approx2{,}38',
      why: '$\\frac2\\pi$ adalah nilai di $\\theta=\\frac\\pi2$ ($\\cot\\frac\\pi4=1$).',
    },
    {
      label: '(5)',
      statement: 'Jika $\\theta=\\pi$ maka $\\frac{X}{Y}=0$',
      ok: true,
      formula: '\\cot\\tfrac\\pi2=0',
      why: 'Segitiga menjadi garis lurus: luas $X=0$.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 24: Kerucut Es Krim dan Limit',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Limit trigonometri pada geometri',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Rumus X, Y, dan X/Y',
        lists: ['L2'],
        sketch: 'cone',
        why: 'Garis tinggi dari $C$ membagi sudut $\\theta$ dan alas $AB$ menjadi dua bagian sama.',
      },
      { title: 'Menilai kelima pernyataan', lists: ['L3'] },
    ],
    answer: 'Jawaban: hanya pernyataan <b>(5)</b> yang benar; $\\frac XY=\\frac2\\pi\\cot\\frac\\theta2$.',
  },
  done: {
    seal: '(5)',
    message:
      '$\\frac XY=\\frac2\\pi\\cot\\frac\\theta2$: bebas dari jari-jari, tetapi bergantung pada sudut. Hanya pernyataan (5) yang benar.',
  },
  key: {
    answer: '(5)',
    cardOk: [false, false, false, false, true],
    goldRows: ['c2', 'c3', 'd5', 's6', 'r1'],
  },
  authorNotes: [
    'Bagian 1: baris papan k1–k6 disusun dari teks soal dan stabilo dokumen.',
    'Bagian 2: pop-up langkah 2.2–2.4 (luas, pembagian, coba sendiri) disusun dari baris b1–c3 dan "Sorotan" dokumen.',
    'Bagian 3: pop-up per pernyataan dari kolom keterangan d1–d5; tabel nilai opsional dari "Visual" Bagian 3 dokumen.',
    'Bagian 5: pop-up per kartu dari kolom alasan; papan ringkasan s1–s6 dan pertanyaan kesimpulan disusun dari kartu.',
  ],
};

export default q24;
