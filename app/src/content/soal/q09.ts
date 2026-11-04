/**
 * SOAL 9 — Populasi Kelinci (interpretasi model eksponensial; tabel Benar/Salah). Kunci: Salah, Benar, Salah.
 * Sumber: docs/pembahasan25.md "SOAL 9", docs/soal25.md no. 9.
 * Alur (v1.42, dicatat di dokumen):
 *  - pahami: K(t) = 4 · 2^(t/4), t dalam tahun, K dalam ribu ekor; tiga pernyataan, benar atau salah;
 *  - tabel nilai (logika dulu): t = 0, 4, 8, …, 20 disubstitusi, K = 4, 8, 16, 32, 64, 128 ribu; tiap 4 tahun × 2;
 *  - pernyataan (1) "menjadi 4 kalinya": dari tabel hanya × 2 → Salah; hati-hati, × 4 baru dalam 8 tahun;
 *  - pernyataan (2) "awal 4 ribu": t = 0, 2⁰ = 1, K = 4 → Benar;
 *  - pernyataan (3) "1 juta sebelum 20 tahun": 1 juta = 1.000 ribu; K(20) = 128 < 1.000 → Salah (grafik);
 *  - bagian opsional "Cara aljabar": K(t + 4)/K(t) = 2 dan 4 · 2^(t/4) = 1.000 → 28 < t < 32.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Visual } from '../../engine/types';
import type { Kel9State } from '../../visuals/kel9';
import { getSoal } from '../index';

const kel = (state: Kel9State): Visual => ({ kind: 'svg', scene: 'kel9', state });
/** pernyataan (docs/soal25.md no. 9) */
const STMT = [
  'Setiap 4 tahun populasi bertambah menjadi 4 kalinya.',
  'Pada saat awal populasi kelinci berjumlah 4 ribu ekor.',
  'Populasi mencapai 1 juta sebelum 20 tahun dari awal pengamatan.',
];
const PIN = ['pK'];
const quote = (n: number): Row => ({
  id: `q${n}`,
  toks: [T(`q${n}a`, `(${n})`, 'sp'), H(`q${n}b`, STMT[n - 1]!, 'q', `@s-o${n}`)],
});
const TAB: Kel9State = { n: 6, arr: true };

const q09: SoalContent = {
  meta: getSoal(9)!,
  sourceRef: 'docs/pembahasan25.md#soal-9',
  layout: 'full',
  paper: {
    html: `<p>Populasi kelinci di suatu pulau dimodelkan dengan fungsi eksponensial, yaitu</p>
<p>$\\htmlClass{hl hl-red}{\\htmlData{src=s-K, hl=1}{K(t)=4\\cdot2^{\\frac{t}{4}}}}$</p>
<p>dengan <span class="hl hl-blue" data-hl="1"><span data-src="s-t">$t$ menyatakan waktu dalam satuan tahun</span></span> dan <span class="hl hl-blue" data-hl="1"><span data-src="s-ribu">$K(t)$ menyatakan populasi dalam ribu ekor</span></span>.</p>
<p>Bagaimana <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">interpretasi yang tepat</span></span> mengenai model eksponensial populasi kelinci tersebut?</p>
<table class="soal-table"><thead><tr><th scope="col">Pernyataan</th><th scope="col">Benar</th><th scope="col">Salah</th></tr></thead>
<tbody>${STMT.map((t, i) => `<tr><th scope="row"><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">${t}</span></span></th><td></td><td></td></tr>`).join('')}</tbody></table>`,
    srcNames: ['s-K', 's-t', 's-ribu', 's-tanya', 's-o1', 's-o2', 's-o3'],
  },
  visualSrc: ['k-0', 'k-1', 'k-2', 'k-3', 'k-4', 'k-5'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Fungsi eksponensial',
    titleLines: ['Pembahasan Soal', 'Model <span class="accent">Eksponensial</span>', 'Populasi Kelinci'],
    lede: 'Populasi kelinci mengikuti $K(t)=4\\cdot2^{t/4}$. Kita buat tabel nilainya, lalu cek ketiga pernyataan satu per satu.',
    facts: [
      { dt: 'Populasi awal', dd: '4 ribu' },
      { dt: 'Basis', dd: '2' },
      { dt: 'Satuan K', dd: 'ribu ekor' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Satuan tahun dan ribu ekor' },
    { t: 'Tabel nilai', d: 'Tiap 4 tahun' },
    { t: 'Pernyataan (1)', d: '4 kali tiap 4 tahun?' },
    { t: 'Pernyataan (2)', d: 'Awal 4 ribu?' },
    { t: 'Pernyataan (3)', d: '1 juta sebelum 20 tahun?' },
    { t: 'Cara aljabar', d: 'Opsional: sifat pangkat', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pernyataan', d: '3 kartu' },
    { t: 'Selesai', d: 'Salah · Benar · Salah' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pK: {
      id: 'pK',
      toks: [T('PK1', 'K(t)=4\\cdot2^{\\frac{t}{4}}', '', 'k1a'), H('PK2', 'ribu ekor', 'tx')],
    },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [T('k1a', 'K(t)=4\\cdot2^{\\frac{t}{4}}', 'red', '@s-K')],
        note: '$t$ dalam tahun, $K$ dalam <b>ribu</b> ekor; simpan ke catatan',
      },
      {
        id: 'k2',
        toks: [H('k2a', 'Ditanya', 'lbl'), H('k2b', 'tiga pernyataan, benar atau salah', 'gold', '@s-tanya')],
      },
    ],
    LT: [
      {
        id: 't1',
        toks: [T('t1a', 'K(0)=4\\cdot2^{0}=4\\cdot1'), O('t1b', '='), T('t1c', '4', 'blue', '@k-0')],
        note: 'pangkat nol sama dengan $1$',
      },
      {
        id: 't2',
        toks: [T('t2a', 'K(4)=4\\cdot2^{1}'), O('t2b', '='), T('t2c', '8', 'blue', '@k-1')],
        note: '$\\frac44=1$',
      },
      {
        id: 't3',
        toks: [T('t3a', 'K(8)=4\\cdot2^{2}'), O('t3b', '='), T('t3c', '16', 'blue', '@k-2')],
        note: '$\\frac84=2$',
      },
      {
        id: 't4',
        toks: [T('t4a', 'K(20)=4\\cdot2^{5}'), O('t4b', '='), T('t4c', '128', 'blue', '@k-5')],
        note: 'sebelumnya $K(12)=32$ dan $K(16)=64$',
      },
      {
        id: 't5',
        toks: [H('t5a', 'tiap 4 tahun', 'tx'), O('t5b', '\\to'), T('t5c', '\\times2', 'blue')],
        note: 'pangkat bertambah $1$, jadi dikali basisnya, $2$',
        box: 'navy',
      },
    ],
    LP1: [
      quote(1),
      {
        id: 'a1',
        toks: [
          T('a1a', '4\\to8\\to16', '', '@k-1'),
          O('a1b', '\\to'),
          H('a1c', 'tiap 4 tahun hanya', 'tx'),
          T('a1d', '\\times2'),
        ],
        note: 'bukan $\\times4$ → <b class="k-red">Salah</b>',
      },
      {
        id: 'a2',
        toks: [H('a2a', 'Hati-hati', 'lbl'), T('a2b', '4\\to16'), H('a2c', 'butuh 8 tahun', 'tx')],
        note: 'angka $4$ di depan adalah populasi awal, bukan pengalinya',
      },
    ],
    LP2: [
      quote(2),
      {
        id: 'b1',
        toks: [
          H('b1a', 'awal', 'tx'),
          T('b1b', 't=0'),
          O('b1c', '\\to'),
          T('b1d', 'K(0)=4', 'gold', '@k-0'),
          H('b1e', 'ribu', 'tx'),
        ],
        note: '$2^0=1$, jadi tepat $4$ ribu ekor → <b class="k-gold">Benar</b>',
        box: 'gold',
      },
    ],
    LP3: [
      quote(3),
      {
        id: 'c1',
        toks: [
          T('c1a', '1'),
          H('c1b', 'juta', 'tx'),
          O('c1c', '='),
          T('c1d', '1{.}000', 'red'),
          H('c1e', 'ribu', 'tx'),
        ],
        note: 'satuan $K$ adalah ribu ekor',
      },
      {
        id: 'c2',
        toks: [T('c2a', 'K(20)=128', '', '@k-5'), O('c2b', '<'), T('c2c', '1{.}000', '', 'c1d')],
        note: 'tahun ke-20 baru $128$ ribu → <b class="k-red">Salah</b>',
      },
      {
        id: 'c3',
        toks: [H('c3a', 'Hati-hati', 'lbl'), H('c3b', 'jangan bandingkan 128 dengan 1', 'tx')],
        note: '$1$ juta ditulis $1.000$ dalam satuan ribu',
      },
    ],
    // cara aljabar (opsional)
    LA: [
      {
        id: 'd1',
        toks: [
          T('d1a', '\\dfrac{K(t+4)}{K(t)}'),
          O('d1b', '='),
          T('d1c', '\\dfrac{4\\cdot2^{\\frac{t+4}{4}}}{4\\cdot2^{\\frac{t}{4}}}', '', 'PK1'),
        ],
        note: 'populasi 4 tahun kemudian dibagi populasi sekarang',
      },
      {
        id: 'd2',
        toks: [T('d2a', '=2^{\\frac{t+4}{4}-\\frac{t}{4}}=2^{1}'), O('d2b', '='), T('d2c', '2', 'blue')],
        note: 'sifat pangkat $\\frac{a^m}{a^n}=a^{m-n}$; selalu $2$ kali',
        box: 'navy',
      },
      {
        id: 'd3',
        toks: [
          T('d3a', '4\\cdot2^{\\frac{t}{4}}=1{.}000'),
          O('d3b', '\\Rightarrow'),
          T('d3c', '2^{\\frac{t}{4}}=250'),
        ],
        note: 'kapan mencapai 1 juta',
      },
      {
        id: 'd4',
        toks: [T('d4a', '2^7=128<250<256=2^8'), O('d4b', '\\Rightarrow'), T('d4c', '28<t<32', 'blue')],
        note: 'baru melewati 1 juta setelah sekitar $32$ tahun',
      },
    ],
    L7: [
      { id: 'v1', toks: [H('v1a', 'Jawaban', 'lbl'), H('v1b', 'Salah · Benar · Salah', 'tx')], box: 'gold' },
    ],
    LR: [
      { id: 'r1', toks: [T('r1a', 'K(0)=4')], note: 'awal 4 ribu ekor, Benar', box: 'gold' },
      {
        id: 'r2',
        toks: [T('r2a', '\\times2'), H('r2b', 'tiap 4 tahun', 'tx'), O('r2c', ','), T('r2d', 'K(20)=128')],
        note: '(1) dan (3) Salah',
      },
      { id: 'r3', toks: [H('r3a', 'Jawaban', 'lbl'), H('r3b', 'Salah · Benar · Salah', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan modelnya. $t$ dalam tahun, dan hati-hati, $K(t)$ dalam <b>ribu</b> ekor.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0, save: ['pK'] },
    },
    {
      ch: 1,
      cap: 'Ada tiga pernyataan yang harus kita tentukan benar atau salah. Supaya mudah, kita buat dulu tabel nilainya.',
      visual: { kind: 'soal', hl: 9 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    // ---- 2 · Tabel nilai ----
    {
      ch: 2,
      cap: 'Mulai dari $t=0$. Pangkatnya $\\frac04=0$ dan $2^0=1$, jadi $K(0)=4$ ribu ekor.',
      visual: kel({ n: 1 }),
      board: { title: 'Tabel nilai', pins: PIN, list: 'LT', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Untuk $t=4$ pangkatnya $1$, jadi $K(4)=4\\cdot2=8$. Untuk $t=8$ pangkatnya $2$, jadi $K(8)=4\\cdot4=16$.',
      visual: kel({ n: 3 }),
      board: { title: 'Tabel nilai', pins: PIN, list: 'LT', upTo: 3, from: 1 },
    },
    {
      ch: 2,
      cap: 'Lanjutkan sampai $t=20$, yaitu $32$, $64$, dan $128$. Tiap 4 tahun pangkatnya naik $1$, jadi populasinya dikali $2$.',
      visual: kel(TAB),
      board: { title: 'Tabel nilai', pins: PIN, list: 'LT', upTo: 5, from: 3 },
      ask: {
        before: 't5',
        q: 'Dari tabel, setiap 4 tahun populasi menjadi…',
        opts: [
          { txt: '2 kali', ok: true },
          { txt: '4 kali', hint: 'Angka $4$ di depan adalah populasi awal. Lihat tabel, $4\\to8\\to16$.' },
          { txt: '8 kali', hint: 'Dari tabel, $4\\to8\\to16$, tiap 4 tahun hanya berlipat dua.' },
        ],
      },
    },
    // ---- 3 · Pernyataan (1) ----
    {
      ch: 3,
      cap: 'Pernyataan (1), setiap 4 tahun populasi menjadi 4 kalinya.',
      visual: { kind: 'soal', hl: 0, focus: 's-o1' },
      board: { title: 'Pernyataan (1)', pins: PIN, list: 'LP1', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Dari tabel, $4\\to8\\to16$, tiap 4 tahun hanya dikali $2$. Pernyataan (1) <b class="k-red">salah</b>.',
      visual: kel({ ...TAB, hl: [0, 1, 2] }),
      board: { title: 'Pernyataan (1)', pins: PIN, list: 'LP1', upTo: 2, from: 1 },
    },
    {
      ch: 3,
      cap: 'Hati-hati, menjadi 4 kali ($4\\to16$) butuh 8 tahun. Angka $4$ di depan adalah populasi awal, bukan pengalinya.',
      visual: kel({ ...TAB, hl: [0, 2], x4: true }),
      board: { title: 'Pernyataan (1)', pins: PIN, list: 'LP1', upTo: 3, from: 2 },
    },
    // ---- 4 · Pernyataan (2) ----
    {
      ch: 4,
      cap: 'Pernyataan (2), pada saat awal populasi kelinci 4 ribu ekor.',
      visual: { kind: 'soal', hl: 0, focus: 's-o2' },
      board: { title: 'Pernyataan (2)', pins: PIN, list: 'LP2', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Saat awal berarti $t=0$, dan dari tabel $K(0)=4$ ribu ekor. Pernyataan (2) <b class="k-gold">benar</b>.',
      visual: kel({ ...TAB, hl: [0] }),
      board: { title: 'Pernyataan (2)', pins: PIN, list: 'LP2', upTo: 2, from: 1 },
    },
    // ---- 5 · Pernyataan (3) ----
    {
      ch: 5,
      cap: 'Pernyataan (3), populasi mencapai 1 juta sebelum 20 tahun. Hati-hati satuannya, 1 juta sama dengan $1.000$ ribu.',
      visual: { kind: 'soal', hl: 0, focus: 's-o3' },
      board: { title: 'Pernyataan (3)', pins: PIN, list: 'LP3', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pada tahun ke-20 baru $128$ ribu, jauh di bawah garis $1.000$ ribu. Pernyataan (3) <b class="k-red">salah</b>.',
      visual: kel({ view: 'graph', t20: true }),
      board: { title: 'Pernyataan (3)', pins: PIN, list: 'LP3', upTo: 4, from: 2 },
    },
    // tawaran cara aljabar (opsional): Ya masuk Bagian 6, Tidak/Lewati langsung ke Bagian 7
    {
      ch: 5,
      cap: 'Mau lihat cara aljabarnya, dengan sifat pangkat, dan kapan populasi benar-benar mencapai 1 juta?',
      visual: kel({ view: 'graph', t20: true }),
      board: { title: 'Pernyataan (3)', pins: PIN, list: 'LP3', upTo: 4, from: 4 },
      branch: { yes: 'Ya, lihat cara aljabar' },
    },
    // ---- 6 · Cara aljabar (opsional) ----
    {
      ch: 6,
      cap: 'Bagi populasi 4 tahun kemudian dengan populasi sekarang. Dengan sifat $\\frac{a^m}{a^n}=a^{m-n}$, hasilnya selalu $2^1=2$.',
      visual: kel(TAB),
      board: { title: 'Cara aljabar', pins: PIN, list: 'LA', upTo: 2, from: 0 },
    },
    {
      ch: 6,
      cap: 'Untuk 1 juta, $4\\cdot2^{t/4}=1.000$, jadi $2^{t/4}=250$. Karena $2^7=128<250<256=2^8$, populasinya baru mencapai 1 juta setelah sekitar 32 tahun.',
      visual: kel({ view: 'graph', t20: true, cross: true }),
      board: { title: 'Cara aljabar', pins: PIN, list: 'LA', upTo: 4, from: 2 },
    },
    // ---- 7 · Catatan lengkap ----
    {
      ch: 7,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 8 · Cocokkan pernyataan ----
    {
      ch: 8,
      cap: 'Cocokkan dengan tabel. Hanya pernyataan (2) yang benar; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Cocokkan pernyataan', pins: PIN, list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'v1',
        q: 'Isi tabel yang tepat untuk pernyataan (1), (2), (3) adalah…',
        col: true,
        win: '<b>Salah · Benar · Salah</b>.',
        opts: [
          { txt: 'Salah · Benar · Salah', ok: true },
          { txt: 'Benar · Benar · Salah', hint: 'Tiap 4 tahun hanya dikali $2$, bukan $4$.' },
          { txt: 'Salah · Benar · Benar', hint: '$K(20)=128$ ribu, belum $1.000$ ribu.' },
          { txt: 'Salah · Salah · Salah', hint: '$K(0)=4\\cdot2^0=4$ ribu ekor.' },
        ],
      },
    },
    // ---- 9 · Selesai ----
    {
      ch: 9,
      cap: '<span class="verdict"><span class="seal">Salah · Benar · Salah</span><span>Populasi awal 4 ribu ekor, berlipat <b>dua</b> tiap 4 tahun, dan pada tahun ke-20 baru 128 ribu ekor.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 3, from: 3 },
    },
  ],
  cards: [
    {
      label: '(1)',
      statement: STMT[0]!,
      ok: false,
      formula: '\\frac{K(t+4)}{K(t)}=2',
      why: 'Menjadi 2 kali. Jebakan: angka 4 di depan adalah populasi awal.',
    },
    { label: '(2)', statement: STMT[1]!, ok: true, formula: 'K(0)=4', why: '$2^0=1$.' },
    {
      label: '(3)',
      statement: STMT[2]!,
      ok: false,
      formula: 'K(20)=128<1{.}000',
      why: 'Jebakan: satuan $K$ ribu, jadi 1 juta = 1.000.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 9: Populasi Kelinci',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Fungsi eksponensial',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Tabel nilai',
        lists: ['LT'],
        why: 'Untuk $K(t)=K_0\\cdot b^{t/p}$, nilai $K_0$ adalah nilai awal dan populasi dikali $b$ setiap $p$ tahun.',
      },
      { title: 'Pernyataan (1)', lists: ['LP1'] },
      { title: 'Pernyataan (2)', lists: ['LP2'] },
      { title: 'Pernyataan (3)', lists: ['LP3'] },
      { title: 'Cara aljabar (opsional)', lists: ['LA'] },
    ],
    answer: 'Jawaban: (1) <b>Salah</b>; (2) <b>Benar</b>; (3) <b>Salah</b>.',
  },
  done: {
    seal: 'Salah · Benar · Salah',
    message:
      'Populasi awal 4 ribu ekor, berlipat <b>dua</b> tiap 4 tahun, dan pada tahun ke-20 baru 128 ribu ekor.',
  },
  key: {
    answer: 'Salah, Benar, Salah',
    cardOk: [false, true, false],
    goldRows: ['b1', 'v1', 'r1', 'r3'],
  },
  authorNotes: [
    'Modul baru (v1.42). Jalur utama logika dulu: tabel nilai t = 0, 4, …, 20 (Visual Langkah 2.2 dan Pemeriksaan hasil dokumen) dengan panah × 2, lalu tiap pernyataan dicek dari tabel atau grafik.',
    'Rasio K(t + 4)/K(t) = 2 (dokumen b1–b3) dan perkiraan 28 < t < 32 (sorotan opsional dokumen) dipindah ke bagian opsional "Cara aljabar".',
    'Pertanyaan cepat "setiap 4 tahun menjadi…" dari dokumen, dijawab dari tabel. Langkah Hati-hati × 4 butuh 8 tahun dan satuan ribu dari Kesalahan umum dan kartu dokumen.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q09;
