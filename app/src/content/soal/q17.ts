/**
 * SOAL 17 — Cat pada Rambu Rumah Makan (geometri bidang, multi-jawaban).
 * Sumber: docs/pembahasan25.md "SOAL 17", docs/soal25.md no. 17, docs/rambu_rumah_makan.png.
 * Kunci: pilihan 1, 2, 5. Tafsir: pilihan benar bila jumlah kedua kuantitas > cat hitam (dicatat di dokumen).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent } from '../../engine/types';
import type { SignState } from '../../visuals/sign17';
import { getSoal } from '../index';

const PIN = ['pH', 'pB', 'pM', 'pP'];
const ALL: SignState = { vals: ['black', 'blue', 'red', 'white'] };
/** Gambar asli soal (docs/rambu_rumah_makan.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/rambu_rumah_makan.png', import.meta.url).href;
const sign = (state: SignState): { kind: 'svg'; scene: string; state: SignState } => ({
  kind: 'svg',
  scene: 'sign',
  state,
});

const q17: SoalContent = {
  meta: getSoal(17)!,
  sourceRef: 'docs/pembahasan25.md#soal-17',
  paper: {
    html: `<div class="soal-split"><div>
<p>Suatu rumah makan terdapat gambar rambu lalu lintas. Gambarnya seperti gambar rambu lalu lintas balai pertolongan pertama, namun tidak sama persis.</p>
<p>Biasanya rambu lalu lintas itu berfungsi untuk memberikan informasi mengenai lokasi pelayanan kesehatan terdekat seperti balai kesehatan, puskesmas, atau tempat pertolongan pertama jika terjadi keadaan darurat atau kecelakaan.</p>
<p>Rumah makan ini mempunyai tanda rambu lalu lintas tersebut tujuannya jika perut pelanggan sedang kelaparan segera merapat ke rumah makan tersebut supaya mendapatkan pertolongan pertama.</p>
<p>Pemilik rumah makan ingin membuat rambu tersebut dalam jumlah banyak untuk cabang yang baru dan <span class="hl hl-blue" data-hl="1"><span data-src="s-cat">cat yang dibeli dalam ukuran yang sama</span></span>.</p>
<p>Cat warna apakah yang <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">lebih banyak digunakan dibanding cat warna hitam</span></span>?</p>
<p>Pilih semua jawaban yang benar. Jawaban benar lebih dari satu.</p>
</div><figure class="soal-fig"><img src="${fig}" width="588" height="546" alt="Rambu persegi biru 40 cm × 40 cm dengan cincin hitam, cakram putih berjari-jari 14 cm, dan salib merah; pada tepi atas lengan mendatar tertulis 10 cm di kiri dan kanan lengan tegak." /></figure></div>
<ul class="checks">
<li>Setengah hitam dan biru.</li>
<li>Setengah hitam dan merah.</li>
<li>Setengah hitam dan putih.</li>
<li>Biru dan putih.</li>
<li>Biru dan merah.</li>
</ul>`,
    srcNames: ['s-cat', 's-tanya'],
  },
  visualSrc: ['g-40', 'g-14', 'g-10a', 'g-10b'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Geometri bidang',
    titleLines: ['Pembahasan Soal', 'Cat <span class="accent">Rambu</span>', 'Rumah Makan'],
    lede: 'Satu rambu terdiri dari persegi biru, cincin hitam, salib merah, dan sisa putih. Berapa banyak cat tiap warna, dan mana yang lebih banyak dari cat hitam?',
    facts: [
      { dt: 'Sisi persegi', dd: '40 cm' },
      { dt: 'Jari-jari cakram', dd: '14 cm' },
      { dt: 'Dicari', dd: 'bandingkan cat' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Diketahui dan ditanya' },
    { t: 'Luas tiap warna', d: 'Hitam, biru, merah, putih' },
    { t: 'Membandingkan dengan hitam', d: 'Setengah hitam = 320,28' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Analisis pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Pilihan 1, 2, dan 5' },
  ],
  pins: {
    pH: { id: 'pH', toks: [H('PH1', 'hitam', 'tx'), O('PH2', '='), T('PH3', '640{,}56')] },
    pB: { id: 'pB', toks: [H('PB1', 'biru', 'tx'), O('PB2', '='), T('PB3', '344')] },
    pM: { id: 'pM', toks: [H('PM1', 'merah', 'tx'), O('PM2', '='), T('PM3', '384')] },
    pP: { id: 'pP', toks: [H('PP1', 'putih', 'tx'), O('PP2', '='), T('PP3', '231{,}44')] },
  },
  lists: {
    L1: [
      { id: 'k1', toks: [H('k1a', 'Diketahui', 'lbl')] },
      { id: 'k2', toks: [H('k2a', 'sisi persegi', 'tx'), O('k2b', '='), T('k2c', '40\\ \\text{cm}')] },
      {
        id: 'k3',
        toks: [H('k3a', 'jari-jari cakram putih', 'tx'), O('k3b', '='), T('k3c', '14\\ \\text{cm}')],
      },
      {
        id: 'k4',
        toks: [H('k4a', 'tepi lengan mendatar', 'tx'), O('k4b', '='), T('k4c', '10\\ \\text{cm}')],
        note: 'di kiri dan kanan lengan tegak',
      },
      {
        id: 'k5',
        toks: [H('k5a', 'banyak cat', 'blue', '@s-cat'), O('k5b', '\\propto'), H('k5c', 'luas warna', 'tx')],
        note: 'cat dibeli dalam ukuran yang sama',
      },
      {
        id: 'k6',
        toks: [H('k6a', 'Ditanya', 'lbl'), H('k6b', 'cat yang lebih banyak dari hitam', 'gold', '@s-tanya')],
      },
      {
        id: 'k7',
        toks: [
          H('k7a', 'Tafsir', 'lbl'),
          H('k7b', 'jumlah dua kuantitas', 'tx'),
          O('k7c', '>'),
          H('k7d', 'hitam', 'tx'),
        ],
        note: '"setengah hitam" $=\\frac12\\times$ luas hitam',
      },
    ],
    L2: [
      {
        id: 'a1',
        toks: [
          H('a1a', 'hitam', 'tx'),
          O('a1b', '='),
          T('a1c', '\\pi('),
          T('a1d', '20^2', 'blue', '@g-40'),
          O('a1e', '-'),
          T('a1f', '14^2', 'blue', '@g-14'),
          T('a1g', ')'),
        ],
        note: 'luas cincin; $20$ = setengah sisi $40$',
      },
      {
        id: 'a2',
        toks: [
          H('a2a', 'hitam', 'tx'),
          O('a2b', '='),
          T('a2c', '\\pi(400-196)'),
          O('a2d', '='),
          T('a2e', '204\\pi'),
        ],
      },
      {
        id: 'a3',
        toks: [
          H('a3a', 'hitam', 'tx'),
          O('a3b', '='),
          T('a3c', '204(3{,}14)', '', 'a2e'),
          O('a3d', '='),
          T('a3e', '640{,}56\\ \\text{cm}^2', 'blue'),
        ],
        box: 'navy',
      },
      {
        id: 'a4',
        toks: [
          H('a4a', 'biru', 'tx'),
          O('a4b', '='),
          T('a4c', '40^2', 'blue', '@g-40'),
          O('a4d', '-'),
          T('a4g', '\\pi\\cdot20^2'),
          O('a4e', '='),
          T('a4f', '1600-400\\pi'),
        ],
        note: 'persegi dikurangi lingkaran luar',
      },
      {
        id: 'a5',
        toks: [
          H('a5a', 'biru', 'tx'),
          O('a5b', '='),
          T('a5c', '1600-1256'),
          O('a5d', '='),
          T('a5e', '344\\ \\text{cm}^2', 'blue'),
        ],
        note: '$400(3{,}14)=1256$',
        box: 'navy',
      },
    ],
    L2b: [
      {
        id: 'b1',
        toks: [
          T('b1a', '10', 'blue', '@g-10a'),
          O('b1b', '+'),
          T('b1c', 'w'),
          O('b1d', '+'),
          T('b1e', '10', 'blue', '@g-10b'),
          O('b1f', '='),
          T('b1g', '28'),
          O('b1h', '\\Rightarrow'),
          T('b1i', 'w=8'),
        ],
        note: '$28=2\\cdot14$, diameter cakram',
      },
      {
        id: 'b2',
        toks: [H('b2a', 'merah', 'tx'), O('b2b', '='), T('b2c', '2(28\\cdot8)-8\\cdot8')],
        note: 'dua lengan dikurangi irisan',
      },
      {
        id: 'b3',
        toks: [
          H('b3a', 'merah', 'tx'),
          O('b3b', '='),
          T('b3c', '448-64'),
          O('b3d', '='),
          T('b3e', '384\\ \\text{cm}^2', 'blue'),
        ],
        box: 'navy',
      },
      {
        id: 'b4',
        toks: [
          H('b4a', 'cakram', 'tx'),
          O('b4b', '='),
          T('b4c', '\\pi\\cdot'),
          T('b4d', '14^2', 'blue', '@g-14'),
          O('b4f', '='),
          T('b4g', '196(3{,}14)'),
          O('b4h', '='),
          T('b4i', '615{,}44'),
        ],
      },
      {
        id: 'b5',
        toks: [
          H('b5a', 'putih', 'tx'),
          O('b5b', '='),
          T('b5c', '615{,}44', '', 'b4i'),
          O('b5d', '-'),
          T('b5e', '384', '', 'b3e'),
          O('b5f', '='),
          T('b5g', '231{,}44\\ \\text{cm}^2', 'blue'),
        ],
        note: 'sisa cakram',
        box: 'navy',
      },
    ],
    L3: [
      {
        id: 'c1',
        toks: [
          T('c1a', '\\tfrac12\\ \\text{hitam}'),
          O('c1b', '='),
          T('c1c', '\\tfrac12'),
          T('c1d', '(640{,}56)', '', 'PH3'),
          O('c1e', '='),
          T('c1f', '320{,}28', 'blue'),
        ],
        box: 'navy',
      },
      {
        id: 'c2',
        toks: [
          T('c2c', '320{,}28', '', 'c1f'),
          O('c2d', '+'),
          T('c2e', '344', '', 'PB3'),
          O('c2f', '='),
          T('c2g', '664{,}28', 'gold'),
          O('c2h', '>'),
          T('c2i', '640{,}56', '', 'PH3'),
        ],
        note: 'pilihan 1, $\\frac12$ hitam + biru: <b class="k-gold">benar</b>',
        box: 'gold',
      },
      {
        id: 'c3',
        toks: [
          T('c3c', '320{,}28', '', 'c1f'),
          O('c3d', '+'),
          T('c3e', '384', '', 'PM3'),
          O('c3f', '='),
          T('c3g', '704{,}28', 'gold'),
          O('c3h', '>'),
          T('c3i', '640{,}56'),
        ],
        note: 'pilihan 2, $\\frac12$ hitam + merah: <b class="k-gold">benar</b>',
        box: 'gold',
      },
      {
        id: 'c4',
        toks: [
          T('c4c', '320{,}28', '', 'c1f'),
          O('c4d', '+'),
          T('c4e', '231{,}44', '', 'PP3'),
          O('c4f', '='),
          T('c4g', '551{,}72'),
          O('c4h', '<'),
          T('c4i', '640{,}56'),
        ],
        note: 'pilihan 3, $\\frac12$ hitam + putih: <b class="k-red">salah</b>',
      },
      {
        id: 'c5',
        toks: [
          T('c5c', '344', '', 'PB3'),
          O('c5d', '+'),
          T('c5e', '231{,}44', '', 'PP3'),
          O('c5f', '='),
          T('c5g', '575{,}44'),
          O('c5h', '<'),
          T('c5i', '640{,}56'),
        ],
        note: 'pilihan 4, biru + putih: <b class="k-red">salah</b>',
      },
      {
        id: 'c6',
        toks: [
          T('c6c', '344', '', 'PB3'),
          O('c6d', '+'),
          T('c6e', '384', '', 'PM3'),
          O('c6f', '='),
          T('c6g', '728', 'gold'),
          O('c6h', '>'),
          T('c6i', '640{,}56'),
        ],
        note: 'pilihan 5, biru + merah: <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    L5: [
      {
        id: 's1',
        toks: [T('s1a', '(1)', 'sp'), T('s1b', '664{,}28>640{,}56'), T('s1c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      {
        id: 's2',
        toks: [T('s2a', '(2)', 'sp'), T('s2b', '704{,}28>640{,}56'), T('s2c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      {
        id: 's3',
        toks: [T('s3a', '(3)', 'sp'), T('s3b', '551{,}72<640{,}56'), T('s3c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's4',
        toks: [T('s4a', '(4)', 'sp'), T('s4b', '575{,}44<640{,}56'), T('s4c', '\\;\\times', 'red')],
        note: '<b class="k-red">SALAH</b>',
      },
      {
        id: 's5',
        toks: [T('s5a', '(5)', 'sp'), T('s5b', '728>640{,}56'), T('s5c', '\\;\\checkmark', 'gold')],
        note: '<b class="k-gold">BENAR</b>',
      },
      { id: 's6', toks: [H('s6a', 'Jawaban', 'lbl'), H('s6b', 'pilihan 1, 2, dan 5', 'tx')], box: 'gold' },
    ],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', '\\text{hitam}\\approx640{,}56\\ \\text{cm}^2')],
        note: '$\\frac12$ hitam + biru, $\\frac12$ hitam + merah, dan biru + merah melebihinya',
        box: 'gold',
      },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Cat dibeli dalam ukuran yang sama, jadi banyak cat sebanding dengan <b>luas</b> tiap warna.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 5, from: 0 },
    },
    {
      ch: 1,
      cap: 'Kita hitung luas hitam, biru, merah, putih, lalu bandingkan dengan hitam.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 6, from: 5 },
    },
    {
      ch: 1,
      cap: 'Setiap pilihan menyebut dua kuantitas cat. Pilihan benar bila jumlah keduanya lebih banyak daripada cat hitam.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Diketahui dan ditanya', list: 'L1', upTo: 7, from: 6 },
    },
    // ---- 2 · Luas tiap warna ----
    {
      ch: 2,
      cap: 'Hitam adalah cincin antara jari-jari 14 dan 20. Jari-jari 20 adalah setengah sisi persegi 40.',
      visual: sign({ focus: 'black' }),
      board: { title: 'Luas hitam dan biru', list: 'L2', upTo: 3, from: 0 },
    },
    {
      ch: 2,
      cap: 'Biru adalah persegi dikurangi lingkaran besar.',
      visual: sign({ focus: 'blue', vals: ['black'] }),
      board: { title: 'Luas hitam dan biru', list: 'L2', upTo: 5, from: 3 },
    },
    {
      ch: 2,
      cap: 'Salib: dua persegi panjang $28\\times8$ yang bertumpuk di persegi $8\\times8$.',
      visual: sign({ focus: 'red', w: true, vals: ['black', 'blue'] }),
      board: { title: 'Luas merah dan putih', list: 'L2b', upTo: 3, from: 0 },
    },
    {
      ch: 2,
      cap: 'Putih adalah sisa cakram setelah dikurangi salib.',
      visual: sign({ focus: 'white', vals: ['black', 'blue', 'red'] }),
      board: { title: 'Luas merah dan putih', list: 'L2b', upTo: 5, from: 3 },
      ask: {
        before: 'b5',
        q: 'Luas putih sama dengan…',
        col: true,
        opts: [
          { txt: 'luas cakram dikurangi luas merah', ok: true },
          {
            txt: 'luas persegi dikurangi luas merah',
            hint: 'Persegi juga memuat hitam dan biru. Putih hanya ada di dalam cakram.',
          },
          {
            txt: 'luas cincin dikurangi luas merah',
            hint: 'Cincin itu hitam; merah dan putih berada di dalam cakram.',
          },
        ],
      },
    },
    // ---- 3 · Membandingkan dengan hitam ----
    {
      ch: 3,
      cap: 'Hitung setengah dari cat hitam, lalu jumlahkan dengan tiap kuantitas pada pilihan.',
      visual: sign(ALL),
      board: { title: 'Membandingkan dengan hitam', pins: PIN, list: 'L3', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Pilihan 1 dan 2: setengah hitam ditambah biru, atau ditambah merah, sama-sama melebihi hitam.',
      visual: sign(ALL),
      board: { title: 'Membandingkan dengan hitam', pins: PIN, list: 'L3', upTo: 3, from: 1 },
    },
    {
      ch: 3,
      cap: 'Pilihan 3: putih paling sedikit, sehingga setengah hitam ditambah putih masih kurang dari hitam.',
      visual: sign(ALL),
      board: { title: 'Membandingkan dengan hitam', pins: PIN, list: 'L3', upTo: 4, from: 3 },
    },
    {
      ch: 3,
      cap: 'Pilihan 4 hampir, tetapi masih kurang. Pilihan 5, biru ditambah merah, melebihi hitam.',
      visual: sign(ALL),
      board: { title: 'Membandingkan dengan hitam', pins: PIN, list: 'L3', upTo: 6, from: 4 },
    },
    // ---- 4 · Catatan lengkap ----
    {
      ch: 4,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 5 · Analisis pilihan (5 kartu) ----
    {
      ch: 5,
      cap: 'Hitam sekitar $640{,}56$ cm². Sekarang periksa kelima pilihan.',
      visual: { kind: 'cards', flip: 0 },
      board: { title: 'Analisis pilihan', pins: PIN, list: 'L5', upTo: 0, from: 0 },
    },
    {
      ch: 5,
      cap: '(1) $320{,}28+344=664{,}28$, lebih dari hitam. Kebenarannya tidak bergantung ukuran salib (<b class="k-gold">benar</b>).',
      visual: { kind: 'cards', flip: 1 },
      board: { title: 'Analisis pilihan', pins: PIN, list: 'L5', upTo: 1, from: 0 },
    },
    {
      ch: 5,
      cap: '(2) $320{,}28+384=704{,}28$, lebih dari hitam (<b class="k-gold">benar</b>).',
      visual: { kind: 'cards', flip: 2 },
      board: { title: 'Analisis pilihan', pins: PIN, list: 'L5', upTo: 2, from: 1 },
    },
    {
      ch: 5,
      cap: '(3) Putih paling sedikit: $551{,}72<640{,}56$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 3 },
      board: { title: 'Analisis pilihan', pins: PIN, list: 'L5', upTo: 3, from: 2 },
    },
    {
      ch: 5,
      cap: '(4) Hampir, tetapi masih kurang: $575{,}44<640{,}56$. <b class="k-red">Salah.</b>',
      visual: { kind: 'cards', flip: 4 },
      board: { title: 'Analisis pilihan', pins: PIN, list: 'L5', upTo: 4, from: 3 },
    },
    {
      ch: 5,
      cap: '(5) $344+384=728$, lebih dari hitam (<b class="k-gold">benar</b>). Pilih kesimpulannya di papan tulis.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Analisis pilihan', pins: PIN, list: 'L5', upTo: 6, from: 4 },
      ask: {
        before: 's6',
        q: 'Pilihan yang benar adalah…',
        col: true,
        win: 'Pilihan <b>1, 2, dan 5</b>.',
        opts: [
          { txt: '1 dan 2 saja', hint: 'Periksa pilihan 5: $344+384=728>640{,}56$.' },
          { txt: '1, 2, dan 5', ok: true },
          { txt: '1, 2, 4, dan 5', hint: 'Pilihan 4: $575{,}44<640{,}56$, masih kurang dari hitam.' },
          { txt: '5 saja', hint: 'Setengah hitam ditambah biru atau merah juga melebihi hitam.' },
        ],
      },
    },
    // ---- 6 · Selesai ----
    {
      ch: 6,
      cap: '<span class="verdict"><span class="seal">1 · 2 · 5</span><span>Hitam sekitar $640{,}56$ cm². Gabungan $\\frac12$ hitam + biru, $\\frac12$ hitam + merah, dan biru + merah masing-masing melebihinya.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 1, from: 1 },
    },
  ],
  cards: [
    {
      label: '1',
      statement: 'Setengah hitam dan biru.',
      ok: true,
      formula: '664{,}28>640{,}56',
      why: 'Kebenarannya tidak bergantung ukuran salib.',
    },
    {
      label: '2',
      statement: 'Setengah hitam dan merah.',
      ok: true,
      formula: '704{,}28>640{,}56',
      why: 'Setengah hitam ditambah merah melebihi hitam.',
    },
    {
      label: '3',
      statement: 'Setengah hitam dan putih.',
      ok: false,
      formula: '551{,}72<640{,}56',
      why: 'Putih paling sedikit.',
    },
    {
      label: '4',
      statement: 'Biru dan putih.',
      ok: false,
      formula: '575{,}44<640{,}56',
      why: 'Hampir, tetapi masih kurang.',
    },
    {
      label: '5',
      statement: 'Biru dan merah.',
      ok: true,
      formula: '728>640{,}56',
      why: 'Biru ditambah merah melebihi hitam.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 17: Cat pada Rambu Rumah Makan',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Geometri bidang',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Luas tiap warna',
        lists: ['L2', 'L2b'],
        sketch: 'sign',
        why: 'Luas lingkaran $\\pi r^2$, luas cincin $\\pi(R^2-r^2)$, dan dua persegi panjang bertumpuk: jumlah kedua luas dikurangi irisan. Dipakai $\\pi=3{,}14$.',
      },
      { title: 'Membandingkan dengan hitam', lists: ['L3'] },
    ],
    answer:
      'Jawaban: pilihan <b>1, 2, dan 5</b> (setengah hitam dan biru, setengah hitam dan merah, biru dan merah).',
  },
  done: {
    seal: '1 · 2 · 5',
    message:
      'Hitam sekitar $640{,}56$ cm². Gabungan $\\frac12$ hitam + biru, $\\frac12$ hitam + merah, dan biru + merah masing-masing melebihinya.',
  },
  key: {
    answer: '1, 2, 5',
    cardOk: [true, true, false, false, true],
    goldRows: ['c2', 'c3', 'c6', 's6', 'r1'],
  },
  authorNotes: [
    'Bagian 1: baris papan k1–k7 disusun dari data gambar, pop-up 1.1–1.2, dan tafsir pilihan di dokumen; langkah 1.3 menampilkan tafsir itu.',
    'Bagian 2: pop-up 2.1 dan 2.2 dokumen masing-masing dipecah menjadi dua langkah (hitam/biru, merah/putih); kalimat "Jari-jari 20 adalah setengah sisi persegi 40" dari kolom "Terbang dari" a1.',
    'Bagian 3: pin hitam/biru/merah/putih (dari Bagian 5 dokumen) dipasang agar angka terbang ke baris c; pop-up per langkah disusun dari kolom keterangan c2–c6 dan alasan kartu; baris c2–c6 hanya memuat angka, nama kuantitas di keterangan (muat di 667 px).',
    'Bagian 5: pop-up per kartu dari kolom alasan; papan ringkasan s1–s6 dan pertanyaan kesimpulan disusun dari kartu; rumus kartu diringkas menjadi perbandingan akhir agar muat.',
  ],
};

export default q17;
