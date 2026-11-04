/**
 * SOAL 8 — Modal Saham (nilai fungsi polinom dan kecukupan modal; tabel Benar/Salah). Kunci: Salah, Benar, Benar.
 * Sumber: docs/pembahasan25.md "SOAL 8", docs/soal25.md no. 8. Tafsir dokumen: Benar = Mungkin, Salah = Tidak Mungkin.
 * Alur (v1.41, dicatat di dokumen):
 *  - pahami: f(x) dalam juta rupiah; modal 2 miliar = 2.000 juta; mungkin bila modal yang dibutuhkan f(x) ≤ 2.000;
 *  - substitusi langsung tiap pilihan (30, 40, 60 unit), pangkat demi pangkat, lalu dibandingkan dengan garis modal
 *    2.000 pada batang: 30 → 20.000 (melewati, tidak mungkin); 40 dan 60 → 2.000 (pas, mungkin);
 *  - hati-hati: unit lebih banyak tidak selalu butuh modal lebih besar;
 *  - bagian opsional "Lihat dengan grafik": kurva f(x) dan garis 2.000, f(x) − 2.000 = (x + 30)(x − 40)(x − 60).
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Visual } from '../../engine/types';
import type { Saham8State } from '../../visuals/saham8';
import { getSoal } from '../index';

const saham = (state: Saham8State): Visual => ({ kind: 'svg', scene: 'saham8', state });
const UNITS = ['30', '40', '60'];
const PIN = ['pf', 'pM'];

/** satu pilihan: substitusi, hasil tiap suku, nilai f, dibandingkan dengan modal */
const rows = (p: string, i: number, terms: string, notes: string, val: string, ok: boolean): Row[] => [
  {
    id: `${p}1`,
    toks: [T(`${p}1c`, `${UNITS[i]}^3-70(${UNITS[i]})^2-600(${UNITS[i]})+74{.}000`, '', `@s-o${i + 1}`)],
    note: `$f(${UNITS[i]})$, $x$ diganti $${UNITS[i]}$`,
  },
  {
    id: `${p}2`,
    toks: [T(`${p}2c`, terms)],
    note: notes,
  },
  {
    id: `${p}3`,
    toks: [
      T(`${p}3a`, `f(${UNITS[i]})`),
      O(`${p}3b`, '='),
      T(`${p}3c`, val, 'blue'),
      H(`${p}3d`, 'juta', 'tx'),
    ],
    box: 'navy',
  },
  {
    id: `${p}4`,
    toks: [
      T(`${p}4a`, val, '', `${p}3c`),
      O(`${p}4b`, ok ? '\\le' : '>'),
      T(`${p}4c`, '2{.}000', '', 'PM3'),
      O(`${p}4d`, '\\to'),
      H(`${p}4e`, ok ? 'mungkin' : 'tidak mungkin', ok ? 'gold' : 'tx'),
    ],
    note: ok
      ? 'modal pas, jadi <b class="k-gold">Benar</b>'
      : 'modal kurang, jadi <b class="k-red">Salah</b>',
    ...(ok ? { box: 'gold' as const } : {}),
  },
];

const q08: SoalContent = {
  meta: getSoal(8)!,
  sourceRef: 'docs/pembahasan25.md#soal-8',
  layout: 'full',
  paper: {
    html: `<p>Sebuah perusahaan menawarkan saham kepada pembeli. Perusahaan menyiapkan modal saham yang akan dijual dan dapat dinyatakan sebagai fungsi $\\htmlClass{hl hl-red}{\\htmlData{src=s-f, hl=1}{f(x)=x^{3}-70x^{2}-600x+74{.}000}}$ dengan nilai $f(x)$ <span class="hl hl-blue" data-hl="1"><span data-src="s-juta">dalam jutaan rupiah</span></span> dan $x$ menyatakan banyak saham dalam satuan unit saham.</p>
<p>Apabila modal saham yang dimiliki perusahaan tersebut adalah <span class="hl hl-red" data-hl="2"><span data-src="s-modal">2 miliar atau 2.000 juta</span></span>, tentukan <span class="hl hl-gold" data-hl="3"><span data-src="s-tanya">Mungkin atau Tidak Mungkin</span></span> perusahaan dapat menjual sejumlah unit saham berikut!</p>
<table class="soal-table"><thead><tr><th scope="col">Pernyataan</th><th scope="col">Benar</th><th scope="col">Salah</th></tr></thead>
<tbody>${UNITS.map((u, i) => `<tr><th scope="row"><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">${u} unit</span></span></th><td></td><td></td></tr>`).join('')}</tbody></table>`,
    srcNames: ['s-f', 's-juta', 's-modal', 's-tanya', 's-o1', 's-o2', 's-o3'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Fungsi polinom',
    titleLines: ['Pembahasan Soal', 'Modal <span class="accent">Saham</span>', 'Mungkin atau Tidak'],
    lede: 'Modal yang perlu disiapkan untuk menjual $x$ unit saham mengikuti $f(x)$ (dalam juta rupiah). Perusahaan hanya punya modal 2.000 juta. Unit mana yang masih mungkin?',
    facts: [
      { dt: 'Modal perusahaan', dd: '2.000 juta' },
      { dt: 'Satuan f(x)', dd: 'juta rupiah' },
      { dt: 'Dicari', dd: '30, 40, 60 unit' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Satuan juta dan syarat mungkin' },
    { t: 'Uji 30 unit', d: 'Substitusi x = 30' },
    { t: 'Uji 40 unit', d: 'Substitusi x = 40' },
    { t: 'Uji 60 unit', d: 'Substitusi x = 60' },
    { t: 'Lihat dengan grafik', d: 'Opsional: kurva dan garis modal', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pernyataan', d: '3 kartu' },
    { t: 'Selesai', d: 'Salah · Benar · Benar' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pf: {
      id: 'pf',
      toks: [T('Pf1', 'f(x)', '', 'k1a'), O('Pf2', '='), T('Pf3', 'x^3-70x^2-600x+74{.}000', '', 'k1a')],
    },
    pM: { id: 'pM', toks: [H('PM1', 'modal', 'tx', 'k2a'), O('PM2', '='), T('PM3', '2{.}000', '', 'k2c')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [T('k1a', 'f(x)=x^3-70x^2-600x+74{.}000', 'red', '@s-f')],
        note: 'modal yang dibutuhkan untuk $x$ unit, dalam juta rupiah; simpan ke catatan',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', 'modal perusahaan', 'tx', '@s-modal'),
          O('k2b', '='),
          T('k2c', '2{.}000', 'red'),
          H('k2d', 'juta', 'tx'),
        ],
        note: '2 miliar sama dengan 2.000 juta, satuannya sudah sama; simpan ke catatan',
      },
      {
        id: 'k3',
        toks: [H('k3a', 'mungkin', 'lbl'), T('k3b', 'f(x)\\le2{.}000', 'gold', '@s-tanya')],
        note: 'modal yang dibutuhkan tidak boleh melebihi modal yang dimiliki',
        box: 'navy',
      },
    ],
    L30: rows(
      'a',
      0,
      '27{.}000-63{.}000-18{.}000+74{.}000',
      '$30^3=27.000$; $70\\cdot900=63.000$; $600\\cdot30=18.000$',
      '20{.}000',
      false,
    ),
    L40: rows(
      'b',
      1,
      '64{.}000-112{.}000-24{.}000+74{.}000',
      '$40^3=64.000$; $70\\cdot1.600=112.000$; $600\\cdot40=24.000$',
      '2{.}000',
      true,
    ),
    L60: [
      ...rows(
        'c',
        2,
        '216{.}000-252{.}000-36{.}000+74{.}000',
        '$60^3=216.000$; $70\\cdot3.600=252.000$; $600\\cdot60=36.000$',
        '2{.}000',
        true,
      ),
      {
        id: 'c5',
        toks: [
          H('c5a', 'Hati-hati', 'lbl'),
          H('c5b', 'unit lebih banyak tidak selalu modal lebih besar', 'tx'),
        ],
        note: '60 unit butuh 2.000 juta, padahal 30 unit butuh 20.000 juta',
      },
    ],
    // lihat dengan grafik (opsional)
    LG: [
      {
        id: 'g1',
        toks: [
          H('g1a', 'kurva di bawah atau pada garis', 'tx'),
          O('g1b', '\\to'),
          T('g1c', '40\\le x\\le60', 'blue'),
        ],
        note: 'di daerah itu modal yang dibutuhkan paling banyak 2.000 juta',
      },
      {
        id: 'g2',
        toks: [T('g2a', 'f(x)-2{.}000'), O('g2b', '='), T('g2c', '(x+30)(x-40)(x-60)', 'blue')],
        note: 'nol tepat di $x=40$ dan $x=60$; negatif di antaranya',
        box: 'navy',
      },
    ],
    L7: [
      {
        id: 'v1',
        toks: [H('v1a', 'Jawaban', 'lbl'), H('v1b', 'Salah · Benar · Benar', 'tx')],
        box: 'gold',
      },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', 'f(30)=20{.}000>2{.}000')], note: '30 unit, Salah' },
      { id: 'r2', toks: [T('r2a', 'f(40)=f(60)=2{.}000')], note: '40 dan 60 unit, Benar', box: 'gold' },
      { id: 'r3', toks: [H('r3a', 'Jawaban', 'lbl'), H('r3b', 'Salah · Benar · Benar', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. $f(x)$ adalah modal yang dibutuhkan untuk menjual $x$ unit saham, dan satuannya juta rupiah.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0, save: ['pf'] },
    },
    {
      ch: 1,
      cap: 'Hati-hati satuannya. Modal perusahaan 2 miliar sama dengan $2.000$ juta, jadi bisa langsung dibandingkan dengan $f(x)$.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1, save: ['pM'] },
    },
    {
      ch: 1,
      cap: 'Menjual $x$ unit mungkin bila modal yang dibutuhkan tidak melebihi modal yang dimiliki, yaitu $f(x)\\le2.000$.',
      visual: { kind: 'soal', hl: 3 },
      board: { title: 'Pahami soal', pins: PIN, list: 'L1', upTo: 3, from: 2 },
      ask: {
        before: 'k3',
        q: 'Menjual $x$ unit saham mungkin bila…',
        opts: [
          { tex: 'f(x)\\le2{.}000', ok: true },
          {
            tex: 'f(x)\\ge2{.}000',
            hint: 'Modal yang dibutuhkan tidak boleh lebih dari modal yang dimiliki.',
          },
          {
            tex: 'x\\le2{.}000',
            hint: '$x$ adalah banyak unit. Yang dibandingkan dengan modal adalah $f(x)$.',
          },
        ],
      },
    },
    // ---- 2 · Uji 30 unit ----
    {
      ch: 2,
      cap: 'Substitusi pilihan pertama, $x=30$. Hitung pangkat demi pangkat, $30^3=27.000$, $70\\cdot30^2=63.000$, dan $600\\cdot30=18.000$.',
      visual: saham({ n: 0, cur: 1 }),
      board: { title: 'Uji 30 unit', pins: PIN, list: 'L30', upTo: 2, from: 0 },
    },
    {
      ch: 2,
      cap: 'Jadi $f(30)=27.000+74.000-63.000-18.000=20.000$ juta. Batangnya jauh melewati garis modal $2.000$.',
      visual: saham({ n: 1, cur: 1 }),
      board: { title: 'Uji 30 unit', pins: PIN, list: 'L30', upTo: 4, from: 2 },
      ask: {
        before: 'a4',
        q: 'Modal yang dibutuhkan untuk 30 unit adalah $20.000$ juta. Dibanding $2.000$ juta…',
        opts: [
          { txt: 'lebih besar, jadi tidak mungkin', ok: true },
          {
            txt: 'lebih kecil, jadi mungkin',
            hint: '$20.000$ lebih besar dari $2.000$. Yang tersedia hanya $2.000$ juta.',
          },
          { txt: 'sama besar', hint: '$20.000\\ne2.000$, selisihnya $18.000$ juta.' },
        ],
      },
    },
    // ---- 3 · Uji 40 unit ----
    {
      ch: 3,
      cap: 'Pilihan kedua, $x=40$. $40^3=64.000$, $70\\cdot40^2=112.000$, dan $600\\cdot40=24.000$.',
      visual: saham({ n: 1, cur: 2 }),
      board: { title: 'Uji 40 unit', pins: PIN, list: 'L40', upTo: 2, from: 0 },
    },
    {
      ch: 3,
      cap: 'Jadi $f(40)=64.000+74.000-112.000-24.000=2.000$ juta, tepat sama dengan modal. 40 unit <b class="k-gold">mungkin</b>.',
      visual: saham({ n: 2, cur: 2 }),
      board: { title: 'Uji 40 unit', pins: PIN, list: 'L40', upTo: 4, from: 2 },
    },
    // ---- 4 · Uji 60 unit ----
    {
      ch: 4,
      cap: 'Pilihan ketiga, $x=60$. $60^3=216.000$, $70\\cdot60^2=252.000$, dan $600\\cdot60=36.000$.',
      visual: saham({ n: 2, cur: 3 }),
      board: { title: 'Uji 60 unit', pins: PIN, list: 'L60', upTo: 2, from: 0 },
    },
    {
      ch: 4,
      cap: 'Jadi $f(60)=216.000+74.000-252.000-36.000=2.000$ juta, juga pas. 60 unit <b class="k-gold">mungkin</b>.',
      visual: saham({ n: 3, cur: 3 }),
      board: { title: 'Uji 60 unit', pins: PIN, list: 'L60', upTo: 4, from: 2 },
    },
    {
      ch: 4,
      cap: 'Hati-hati, unit lebih banyak tidak selalu butuh modal lebih besar. 60 unit butuh $2.000$ juta, sedangkan 30 unit $20.000$ juta.',
      visual: saham({ n: 3 }),
      board: { title: 'Uji 60 unit', pins: PIN, list: 'L60', upTo: 5, from: 4 },
    },
    // tawaran grafik (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Mau melihat dengan grafik, mengapa 40 dan 60 sama-sama pas?',
      visual: saham({ n: 3 }),
      board: { title: 'Uji 60 unit', pins: PIN, list: 'L60', upTo: 5, from: 5 },
      branch: { yes: 'Ya, lihat grafik' },
    },
    // ---- 5 · Lihat dengan grafik (opsional) ----
    {
      ch: 5,
      cap: 'Kurva $f(x)$ turun dulu lalu naik lagi. Kurva menyentuh garis modal $2.000$ tepat di $x=40$ dan $x=60$, sedangkan di $x=30$ masih jauh di atas.',
      visual: saham({ view: 'graph' }),
      board: { title: 'Lihat dengan grafik', pins: PIN, list: 'LG', upTo: 0, from: 0 },
    },
    {
      ch: 5,
      cap: 'Di antara 40 dan 60, kurva berada di bawah garis, jadi modalnya cukup. Bentuk faktornya $f(x)-2.000=(x+30)(x-40)(x-60)$.',
      visual: saham({ view: 'graph', band: true }),
      board: { title: 'Lihat dengan grafik', pins: PIN, list: 'LG', upTo: 2, from: 0 },
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
      cap: 'Cocokkan dengan tabel. 30 unit tidak mungkin, 40 dan 60 unit mungkin; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Cocokkan pernyataan', pins: PIN, list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'v1',
        q: 'Isi tabel yang tepat untuk 30, 40, dan 60 unit adalah…',
        col: true,
        win: '<b>Salah · Benar · Benar</b>.',
        opts: [
          { txt: 'Salah · Benar · Benar', ok: true },
          { txt: 'Benar · Benar · Benar', hint: '$f(30)=20.000$ juta, lebih dari modal $2.000$ juta.' },
          { txt: 'Salah · Benar · Salah', hint: '$f(60)=2.000$ juta, tepat sama dengan modal.' },
          { txt: 'Benar · Salah · Salah', hint: 'Unit lebih sedikit tidak selalu butuh modal lebih kecil.' },
        ],
      },
    },
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">Salah · Benar · Benar</span><span>30 unit tidak mungkin (butuh $20.000$ juta). 40 unit dan 60 unit mungkin, karena $f=2.000$ juta.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
    },
  ],
  cards: [
    {
      label: '(1)',
      statement: '30 unit',
      ok: false,
      formula: 'f(30)=20{.}000>2{.}000',
      why: 'Butuh 20 miliar. Jebakan: membandingkan dengan "2" miliar tanpa menyamakan satuan.',
    },
    { label: '(2)', statement: '40 unit', ok: true, formula: 'f(40)=2{.}000\\le2{.}000', why: 'Modal pas.' },
    {
      label: '(3)',
      statement: '60 unit',
      ok: true,
      formula: 'f(60)=2{.}000\\le2{.}000',
      why: 'Modal pas. Jebakan: mengira makin banyak unit makin besar modal.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 8: Modal Saham',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Fungsi polinom',
    sections: [
      {
        title: 'Pahami soal',
        lists: ['L1'],
        why: 'Menjual $x$ unit mungkin bila modal yang dibutuhkan $f(x)$ tidak melebihi modal yang dimiliki, $f(x)\\le2.000$ (dua-duanya dalam juta rupiah).',
      },
      { title: 'Uji 30 unit', lists: ['L30'] },
      { title: 'Uji 40 unit', lists: ['L40'] },
      { title: 'Uji 60 unit', lists: ['L60'] },
      { title: 'Lihat dengan grafik (opsional)', lists: ['LG'] },
    ],
    answer: 'Jawaban: 30 unit <b>Salah</b>; 40 unit <b>Benar</b>; 60 unit <b>Benar</b>.',
  },
  done: {
    seal: 'Salah · Benar · Benar',
    message:
      '30 unit tidak mungkin (butuh $20.000$ juta). 40 unit dan 60 unit mungkin, karena $f=2.000$ juta.',
  },
  key: {
    answer: 'Salah, Benar, Benar',
    cardOk: [false, true, true],
    goldRows: ['b4', 'c4', 'v1', 'r2', 'r3'],
  },
  authorNotes: [
    'Modul baru (v1.41). Jalur utama substitusi langsung tiap pernyataan (30, 40, 60 unit), pangkat demi pangkat, dari baris a1–c3 dokumen; batang modal dibandingkan dengan garis 2.000 juta (adegan saham8).',
    'Tafsir dokumen dipakai: Benar = Mungkin, Salah = Tidak Mungkin; syarat mungkin f(x) ≤ 2.000 (kunci sama untuk tafsir f(x) = 2.000).',
    'Pertanyaan cepat syarat f(x) ≤ 2.000 ditambahkan (pengecoh f(x) ≥ 2.000 dan x ≤ 2.000); pertanyaan cepat 30 unit dari dokumen.',
    'Langkah Hati-hati "unit lebih banyak tidak selalu modal lebih besar" dari Kesalahan umum dokumen; grafik dan faktor f(x) − 2.000 = (x + 30)(x − 40)(x − 60) dari Langkah 2.3 dokumen menjadi bagian opsional.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q08;
