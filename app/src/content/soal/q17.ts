/**
 * SOAL 17 — Cat pada Rambu Rumah Makan (geometri bidang, multi-jawaban). Kunci: pilihan 1, 2, 5.
 * Sumber: docs/pembahasan25.md "SOAL 17", docs/soal25.md no. 17, docs/rambu_rumah_makan.png.
 * Alur gaya mengajar Pak Penta (revisi 21 Okt 2026, dicatat di dokumen): banyak cat ∝ luas → rambu dipandang
 * sebagai tumpukan empat bangun (warna terlihat = bangunnya − bangun di atasnya) → ukuran dari gambar
 * (R = 20, r = 14, w = 8) → luas tiap warna dengan "mengangkat" bangun di atasnya → batang pembanding:
 * cara cepat "warna kedua > setengah hitam" untuk pilihan 1–3, jumlah langsung untuk pilihan 4–5.
 * Tafsir pilihan: benar bila jumlah kedua kuantitas > cat hitam (dicatat di dokumen).
 * Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Step, Visual } from '../../engine/types';
import type { BarsState } from '../../visuals/bars17';
import type { SignState } from '../../visuals/sign17';
import { getSoal } from '../index';

/** Gambar asli soal (docs/rambu_rumah_makan.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/rambu_rumah_makan.png', import.meta.url).href;
const sign = (state: SignState): Visual => ({ kind: 'svg', scene: 'sign', state });
const bars = (state: BarsState): Visual => ({ kind: 'svg', scene: 'bars', state });
const ALL: SignState = { vals: ['black', 'blue', 'red', 'white'] };

/** Kelima pilihan (docs/soal25.md no. 17): kertas soal dan kutipan di papan memakai teks yang sama. */
const OPTS = [
  'Setengah hitam dan biru.',
  'Setengah hitam dan merah.',
  'Setengah hitam dan putih.',
  'Biru dan putih.',
  'Biru dan merah.',
];
/** pin per pilihan: hanya angka yang dipakai pilihan itu */
const OPIN: Record<number, string[]> = {
  1: ['pH', 'pS', 'pB'],
  2: ['pH', 'pS', 'pM'],
  3: ['pH', 'pS', 'pP'],
  4: ['pH', 'pB', 'pP'],
  5: ['pH', 'pB', 'pM'],
};
/** Baris kutipan pilihan ke-n: disalin dari kertas soal ke papan sebelum dicek. */
const quote = (n: number): Row => ({
  id: `c${n}`,
  toks: [T(`c${n}a`, `(${n})`, 'sp'), H(`c${n}b`, OPTS[n - 1]!, 'q', `@s-o${n}`)],
});
/** Langkah pembuka tiap pilihan: soal tampil lagi, pilihan ke-n disorot, lalu teksnya disalin. */
const open4 = (n: number, cap: string): Step => ({
  ch: 4,
  cap,
  visual: { kind: 'soal', hl: 0, focus: `s-o${n}` },
  board: { title: `Pilihan (${n})`, pins: OPIN[n], list: `L4${n}`, upTo: 1, from: 0 },
});
/** Langkah analisis pilihan ke-n: batang ditumpuk, lalu baris hitungannya. */
const check4 = (n: number, cap: string): Step => ({
  ch: 4,
  cap,
  visual: bars({ half: n <= 3, opt: n, cmp: n <= 3 }),
  board: { title: `Pilihan (${n})`, pins: OPIN[n], list: `L4${n}`, upTo: 2, from: 1 },
});
const sum = (
  id: string,
  a: [string, string],
  b: [string, string],
  total: string,
  more: boolean,
): Row['toks'] => [
  T(`${id}a`, a[0], '', a[1]),
  O(`${id}b`, '+'),
  T(`${id}c`, b[0], '', b[1]),
  O(`${id}d`, '='),
  T(`${id}e`, total, more ? 'gold' : ''),
  O(`${id}f`, more ? '>' : '<'),
  T(`${id}g`, '640{,}56', '', 'PH3'),
];

const q17: SoalContent = {
  meta: getSoal(17)!,
  sourceRef: 'docs/pembahasan25.md#soal-17',
  layout: 'full',
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
${OPTS.map((t, i) => `<li><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${i + 1}">${t}</span></span></li>`).join('\n')}
</ul>`,
    srcNames: ['s-cat', 's-tanya', 's-o1', 's-o2', 's-o3', 's-o4', 's-o5'],
  },
  visualSrc: ['g-40', 'g-20', 'g-14', 'g-10a', 'g-10b', 'g-w', 'g-28'],
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Geometri bidang',
    titleLines: ['Pembahasan Soal', 'Cat <span class="accent">Rambu</span>', 'Rumah Makan'],
    lede: 'Rambu ini sebenarnya tumpukan empat bangun. Hitung luas tiap warna, lalu bandingkan gabungan dua cat dengan cat hitam.',
    facts: [
      { dt: 'Sisi persegi', dd: '40 cm' },
      { dt: 'Jari-jari putih', dd: '14 cm' },
      { dt: 'Dicari', dd: 'lebih dari hitam' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Cat sebanding luas' },
    { t: 'Ukuran dari gambar', d: 'R = 20, r = 14, w = 8' },
    { t: 'Luas tiap warna', d: 'Angkat bangun di atasnya' },
    { t: 'Bandingkan dengan hitam', d: 'Satu per satu' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Pilihan 1, 2, dan 5' },
  ],
  pins: {
    pH: { id: 'pH', toks: [H('PH1', 'hitam', 'tx'), O('PH2', '='), T('PH3', '640{,}56')] },
    pS: {
      id: 'pS',
      toks: [T('PS1', '\\tfrac12'), H('PS2', 'hitam', 'tx'), O('PS0', '='), T('PS3', '320{,}28')],
    },
    pB: { id: 'pB', toks: [H('PB1', 'biru', 'tx'), O('PB2', '='), T('PB3', '344')] },
    pM: { id: 'pM', toks: [H('PM1', 'merah', 'tx'), O('PM2', '='), T('PM3', '384')] },
    pP: { id: 'pP', toks: [H('PP1', 'putih', 'tx'), O('PP2', '='), T('PP3', '231{,}44')] },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [H('k1a', 'banyak cat', 'blue', '@s-cat'), O('k1b', '\\propto'), H('k1c', 'luas warna', 'tx')],
        note: 'cat dibeli dalam ukuran yang sama',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', 'warna terlihat', 'tx'),
          O('k2b', '='),
          H('k2c', 'bangunnya − bangun di atasnya', 'tx'),
        ],
        note: 'rambu = tumpukan persegi, lingkaran besar, lingkaran kecil, salib',
      },
      {
        id: 'k3',
        toks: [H('k3a', 'Ditanya', 'lbl'), H('k3b', 'cat yang lebih banyak dari hitam', 'gold', '@s-tanya')],
      },
      {
        id: 'k4',
        toks: [
          H('k4a', 'tiap pilihan', 'tx'),
          H('k4b', 'cat 1 + cat 2', 'tx'),
          O('k4c', '>'),
          H('k4d', 'hitam?', 'tx'),
        ],
        note: '"setengah hitam" $=\\frac12\\times$ luas hitam',
      },
    ],
    LU: [
      {
        id: 'u1',
        toks: [
          T('u1a', 'R'),
          O('u1b', '='),
          T('u1c', '\\tfrac12\\times'),
          T('u1d', '40', 'blue', '@g-40'),
          O('u1e', '='),
          T('u1f', '20\\ \\text{cm}', 'blue'),
        ],
        note: 'lingkaran hitam menyentuh sisi persegi',
      },
      {
        id: 'u2',
        toks: [T('u2a', 'r'), O('u2b', '='), T('u2c', '14\\ \\text{cm}', 'blue', '@g-14')],
        note: 'jari-jari lingkaran putih, tertulis di gambar',
      },
      {
        id: 'u3',
        toks: [
          T('u3a', '10', '', '@g-10a'),
          O('u3b', '+'),
          T('u3c', 'w', '', '@g-w'),
          O('u3d', '+'),
          T('u3e', '10', '', '@g-10b'),
          O('u3f', '='),
          T('u3g', '28', '', '@g-28'),
          O('u3h', '\\Rightarrow'),
          T('u3i', 'w=8\\ \\text{cm}', 'blue'),
        ],
        note: '$28=2\\times14$, diameter lingkaran putih',
        box: 'navy',
      },
    ],
    LH: [
      {
        id: 'h1',
        toks: [H('h1a', 'hitam', 'tx'), O('h1b', '='), H('h1c', 'lingkaran besar − lingkaran kecil', 'tx')],
        note: 'lingkaran putih diangkat, tersisa cincin',
      },
      {
        id: 'h2',
        toks: [O('h2a', '='), T('h2b', '3{,}14'), O('h2c', '\\times'), T('h2d', '(20^2-14^2)')],
        note: '$\\pi R^2-\\pi r^2=\\pi(R^2-r^2)$',
      },
      {
        id: 'h3',
        toks: [
          O('h3a', '='),
          T('h3b', '3{,}14\\times204'),
          O('h3c', '='),
          T('h3d', '640{,}56\\ \\text{cm}^2', 'blue'),
        ],
        note: '$400-196=204$',
        box: 'navy',
      },
    ],
    LB: [
      {
        id: 'b1',
        toks: [H('b1a', 'biru', 'tx'), O('b1b', '='), H('b1c', 'persegi − lingkaran besar', 'tx')],
        note: 'lingkaran besar diangkat, tersisa persegi berlubang',
      },
      {
        id: 'b2',
        toks: [O('b2a', '='), T('b2b', '40^2'), O('b2c', '-'), T('b2d', '3{,}14\\times20^2')],
      },
      {
        id: 'b3',
        toks: [O('b3a', '='), T('b3b', '1600-1256'), O('b3c', '='), T('b3d', '344\\ \\text{cm}^2', 'blue')],
        box: 'navy',
      },
    ],
    LM: [
      {
        id: 'm1',
        toks: [
          H('m1a', 'merah', 'tx'),
          O('m1b', '='),
          T('m1c', '28\\times8'),
          O('m1d', '+'),
          T('m1e', '28\\times8'),
        ],
        note: 'lengan mendatar + lengan tegak',
      },
      {
        id: 'm2',
        toks: [O('m2a', '='), T('m2b', '224+224'), O('m2c', '-'), T('m2d', '8\\times8', 'red')],
        note: 'kotak tengah terhitung dua kali, kurangi sekali',
      },
      {
        id: 'm3',
        toks: [O('m3a', '='), T('m3b', '448-64'), O('m3c', '='), T('m3d', '384\\ \\text{cm}^2', 'blue')],
        box: 'navy',
      },
    ],
    LP: [
      {
        id: 'p1',
        toks: [H('p1a', 'putih', 'tx'), O('p1b', '='), H('p1c', 'lingkaran kecil − merah', 'tx')],
        note: 'salib diangkat, tersisa lingkaran putih berlubang',
      },
      {
        id: 'p2',
        toks: [O('p2a', '='), T('p2b', '3{,}14\\times14^2'), O('p2c', '-'), T('p2d', '384')],
      },
      {
        id: 'p3',
        toks: [
          O('p3a', '='),
          T('p3b', '615{,}44-384'),
          O('p3c', '='),
          T('p3d', '231{,}44\\ \\text{cm}^2', 'blue'),
        ],
        box: 'navy',
      },
    ],
    LW: [
      { id: 'w1', toks: [H('w1a', 'hitam', 'tx'), O('w1b', '='), T('w1c', '640{,}56\\ \\text{cm}^2')] },
      { id: 'w2', toks: [H('w2a', 'biru', 'tx'), O('w2b', '='), T('w2c', '344\\ \\text{cm}^2')] },
      { id: 'w3', toks: [H('w3a', 'merah', 'tx'), O('w3b', '='), T('w3c', '384\\ \\text{cm}^2')] },
      { id: 'w4', toks: [H('w4a', 'putih', 'tx'), O('w4b', '='), T('w4c', '231{,}44\\ \\text{cm}^2')] },
    ],
    LS: [
      {
        id: 's1',
        toks: [
          T('s1a', '\\tfrac12'),
          H('s1b', 'hitam', 'tx'),
          O('s1c', '='),
          T('s1d', '\\tfrac12\\times640{,}56', '', 'PH3'),
          O('s1e', '='),
          T('s1f', '320{,}28', 'blue'),
        ],
        box: 'navy',
      },
      {
        id: 's2',
        toks: [
          T('s2a', '\\tfrac12\\text{ hitam}+X>\\text{hitam}'),
          O('s2b', '\\iff'),
          T('s2c', 'X>320{,}28', 'blue'),
        ],
        note: 'cara cepat, hanya untuk pilihan yang memuat setengah hitam',
      },
    ],
    L41: [
      quote(1),
      {
        id: 'o1',
        toks: sum('o1', ['320{,}28', 'PS3'], ['344', 'PB3'], '664{,}28', true),
        note: 'biru $344>320{,}28$ → <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    L42: [
      quote(2),
      {
        id: 'o2',
        toks: sum('o2', ['320{,}28', 'PS3'], ['384', 'PM3'], '704{,}28', true),
        note: 'merah $384>320{,}28$ → <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    L43: [
      quote(3),
      {
        id: 'o3',
        toks: sum('o3', ['320{,}28', 'PS3'], ['231{,}44', 'PP3'], '551{,}72', false),
        note: 'putih $231{,}44<320{,}28$ → <b class="k-red">salah</b>',
      },
    ],
    L44: [
      quote(4),
      {
        id: 'o4',
        toks: sum('o4', ['344', 'PB3'], ['231{,}44', 'PP3'], '575{,}44', false),
        note: 'hampir, tetapi kurang → <b class="k-red">salah</b>',
      },
    ],
    L45: [
      quote(5),
      {
        id: 'o5',
        toks: sum('o5', ['344', 'PB3'], ['384', 'PM3'], '728', true),
        note: 'melewati batas hitam → <b class="k-gold">benar</b>',
        box: 'gold',
      },
    ],
    L6: [
      { id: 's6', toks: [H('s6a', 'Jawaban', 'lbl'), H('s6b', 'pilihan 1, 2, dan 5', 'tx')], box: 'gold' },
    ],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', '\\text{hitam}\\approx640{,}56\\ \\text{cm}^2')],
        note: '$\\frac12$ hitam + biru, $\\frac12$ hitam + merah, dan biru + merah melebihinya',
        box: 'navy',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), H('r2b', 'pilihan 1, 2, dan 5', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan: cat dibeli dalam ukuran yang sama. Jadi warna yang lebih <b>luas</b> butuh cat lebih banyak, dan yang kita bandingkan adalah luasnya.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Tahukah kalian? Rambu ini sebenarnya tumpukan empat bangun: persegi biru, lingkaran hitam, lingkaran putih, lalu salib merah.',
      visual: sign({ build: true }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    {
      ch: 1,
      cap: 'Yang ditanya: cat mana yang lebih banyak dari cat hitam. Tiap pilihan menyebut dua cat, jadi jumlahkan keduanya lalu bandingkan dengan hitam.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 4, from: 2 },
    },
    // ---- 2 · Ukuran dari gambar ----
    {
      ch: 2,
      cap: 'Mulai dari ukuran. Lingkaran hitam menyentuh keempat sisi persegi, jadi jari-jarinya setengah dari $40$, yaitu $20$ cm.',
      visual: sign({ meas: ['40', 'R'] }),
      board: { title: 'Ukuran dari gambar', list: 'LU', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Jari-jari lingkaran putih sudah tertulis di gambar: $14$ cm.',
      visual: sign({ meas: ['40', 'R', 'r'] }),
      board: { title: 'Ukuran dari gambar', list: 'LU', upTo: 2, from: 1 },
    },
    {
      ch: 2,
      cap: 'Lebar lengan salib belum tertulis, kita sebut $w$. Tepi atas lengan mendatar $10+w+10$ sama panjang dengan diameter lingkaran putih, $28$ cm.',
      visual: sign({ meas: ['r', 'w'] }),
      board: { title: 'Ukuran dari gambar', list: 'LU', upTo: 3, from: 2 },
      ask: {
        before: 'u3',
        q: '$10+w+10=28$. Lebar lengan $w$ adalah…',
        opts: [
          { tex: '8\\ \\text{cm}', ok: true },
          {
            tex: '18\\ \\text{cm}',
            hint: '$28-10$ baru mengurangi satu sisi. Masih ada $10$ cm di sisi lainnya.',
          },
          { tex: '14\\ \\text{cm}', hint: '$14$ cm itu jari-jari lingkaran putih, bukan lebar lengan.' },
        ],
      },
    },
    // ---- 3 · Luas tiap warna ----
    {
      ch: 3,
      cap: 'Hitam dulu. Angkat lingkaran putih dari atasnya: yang tersisa cincin hitam, yaitu lingkaran besar dikurangi lingkaran kecil.',
      visual: sign({ lift: 'small' }),
      board: { title: 'Luas hitam', list: 'LH', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Masukkan angkanya: $3{,}14\\times(20^2-14^2)=3{,}14\\times204$. Luas hitam $640{,}56$ cm².',
      visual: sign({ lift: 'small' }),
      board: { title: 'Luas hitam', list: 'LH', upTo: 3, from: 1 },
    },
    {
      ch: 3,
      cap: 'Sekarang biru. Angkat lingkaran besar: tersisa persegi berlubang, jadi biru = persegi dikurangi lingkaran besar.',
      visual: sign({ lift: 'big' }),
      board: { title: 'Luas biru', list: 'LB', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Hitung: $40^2-3{,}14\\times20^2=1600-1256$. Luas biru $344$ cm².',
      visual: sign({ lift: 'big' }),
      board: { title: 'Luas biru', list: 'LB', upTo: 3, from: 1 },
    },
    {
      ch: 3,
      cap: 'Merah berbentuk salib. Pisahkan lengan tegaknya: ternyata salib terdiri dari dua persegi panjang $28\\times8$.',
      visual: sign({ lift: 'vbar', dim: true }),
      board: { title: 'Luas merah', list: 'LM', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Hati-hati, kotak tengah $8\\times8$ ikut terhitung di kedua lengan, jadi kurangi sekali. Luas merah $448-64=384$ cm².',
      visual: sign({ lift: 'vbar', dim: true, ov: true }),
      board: { title: 'Luas merah', list: 'LM', upTo: 3, from: 1 },
      ask: {
        before: 'm2',
        q: 'Kedua lengan sama-sama $28\\times8=224$. Luas salib merah adalah…',
        opts: [
          { tex: '448-64=384', ok: true },
          {
            tex: '448',
            hint: 'Kotak tengah $8\\times8$ terhitung dua kali, sekali di tiap lengan. Kurangi sekali.',
          },
          { tex: '224', hint: 'Itu baru satu lengan. Salib punya dua lengan.' },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Terakhir putih. Angkat salib merahnya: putih = lingkaran kecil dikurangi merah.',
      visual: sign({ lift: 'cross' }),
      board: { title: 'Luas putih', list: 'LP', upTo: 1, from: 0 },
      ask: {
        before: 'p1',
        q: 'Luas putih sama dengan…',
        col: true,
        opts: [
          { txt: 'luas lingkaran kecil dikurangi luas merah', ok: true },
          {
            txt: 'luas persegi dikurangi luas merah',
            hint: 'Persegi juga memuat hitam dan biru. Putih hanya ada di dalam lingkaran kecil.',
          },
          {
            txt: 'luas cincin hitam dikurangi luas merah',
            hint: 'Cincin itu hitam; merah dan putih berada di dalam lingkaran kecil.',
          },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Hitung: $3{,}14\\times14^2=615{,}44$, dikurangi merah $384$. Luas putih $231{,}44$ cm².',
      visual: sign({ lift: 'cross' }),
      board: { title: 'Luas putih', list: 'LP', upTo: 3, from: 1 },
    },
    {
      ch: 3,
      cap: 'Ini luas keempat warna. Sekarang kita siap membandingkan setiap pilihan dengan cat hitam.',
      visual: sign(ALL),
      board: { title: 'Luas tiap warna', list: 'LW', upTo: 4, from: 0 },
    },
    // ---- 4 · Bandingkan dengan hitam ----
    {
      ch: 4,
      cap: 'Gambar banyak cat sebagai batang. Tiga pilihan pertama memuat <b>setengah hitam</b>: setengah dari $640{,}56$ adalah $320{,}28$.',
      visual: bars({ half: true }),
      board: { title: 'Setengah hitam', pins: ['pH'], list: 'LS', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Cara cepat: setengah hitam ada di kedua sisi, jadi cukup cek apakah warna keduanya lebih dari $320{,}28$. Ingat, ini hanya berlaku untuk pilihan yang memuat setengah hitam.',
      visual: bars({ half: true, cmp: true }),
      board: { title: 'Setengah hitam', pins: ['pH'], list: 'LS', upTo: 2, from: 1 },
    },
    open4(1, 'Kita cek pilihan (1) dulu. Salin ke papan: setengah hitam dan biru.'),
    check4(
      1,
      'Tumpuk setengah hitam dengan biru: ujungnya melewati batas hitam. Cara cepatnya, biru $344>320{,}28$, jadi (1) <b class="k-gold">benar</b>.',
    ),
    open4(2, 'Lanjut pilihan (2): setengah hitam dan merah.'),
    check4(
      2,
      'Setengah hitam ditambah merah: $704{,}28>640{,}56$. Merah $384>320{,}28$, jadi (2) <b class="k-gold">benar</b>.',
    ),
    open4(3, 'Pilihan (3): setengah hitam dan putih.'),
    check4(
      3,
      'Setengah hitam ditambah putih tidak sampai batas: $551{,}72<640{,}56$. Putih $231{,}44<320{,}28$, jadi (3) <b class="k-red">salah</b>.',
    ),
    open4(4, 'Pilihan (4): biru dan putih. Perhatikan, kali ini tidak ada setengah hitam.'),
    check4(
      4,
      'Tanpa setengah hitam, jumlahkan langsung: $344+231{,}44=575{,}44$. Hampir, tetapi kurang dari $640{,}56$, jadi (4) <b class="k-red">salah</b>.',
    ),
    open4(5, 'Terakhir, pilihan (5): biru dan merah.'),
    check4(
      5,
      'Biru ditambah merah: $344+384=728$, melewati batas $640{,}56$. Jadi (5) <b class="k-gold">benar</b>.',
    ),
    // ---- 5 · Catatan lengkap ----
    {
      ch: 5,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 6 · Cocokkan pilihan ----
    {
      ch: 6,
      cap: 'Cocokkan dengan kelima pilihan: (1), (2), dan (5) benar. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: ['pH', 'pB', 'pM', 'pP'], list: 'L6', upTo: 1, from: 0 },
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
    // ---- 7 · Selesai ----
    {
      ch: 7,
      cap: '<span class="verdict"><span class="seal">1 · 2 · 5</span><span>Hitam sekitar $640{,}56$ cm². Gabungan $\\frac12$ hitam + biru, $\\frac12$ hitam + merah, dan biru + merah masing-masing melebihinya.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: '1',
      statement: 'Setengah hitam dan biru.',
      ok: true,
      formula: '664{,}28>640{,}56',
      why: 'Biru $344$ lebih dari setengah hitam $320{,}28$.',
    },
    {
      label: '2',
      statement: 'Setengah hitam dan merah.',
      ok: true,
      formula: '704{,}28>640{,}56',
      why: 'Merah $384$ lebih dari setengah hitam $320{,}28$.',
    },
    {
      label: '3',
      statement: 'Setengah hitam dan putih.',
      ok: false,
      formula: '551{,}72<640{,}56',
      why: 'Putih paling sedikit, kurang dari setengah hitam.',
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
      { title: 'Ukuran dari gambar', lists: ['LU'], sketch: 'sign' },
      {
        title: 'Luas tiap warna',
        lists: ['LH', 'LB', 'LM', 'LP'],
        why: 'Rambu = tumpukan persegi, lingkaran besar, lingkaran kecil, dan salib. Warna yang terlihat = bangunnya dikurangi bangun di atasnya. Dipakai $\\pi=3{,}14$.',
      },
      {
        title: 'Bandingkan dengan hitam',
        lists: ['LS', 'L41', 'L42', 'L43', 'L44', 'L45'],
        why: 'Cara cepat pilihan 1–3: setengah hitam ada di kedua sisi, jadi cukup bandingkan warna kedua dengan $320{,}28$.',
      },
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
    goldRows: ['o1', 'o2', 'o5', 's6', 'r2'],
  },
  authorNotes: [
    'Alur ditulis ulang dengan gaya mengajar Pak Penta (21 Okt 2026, dicatat di dokumen): rambu sebagai tumpukan empat bangun, ukuran dari gambar, luas tiap warna dengan mengangkat bangun di atasnya, lalu batang pembanding per pilihan.',
    'Cara cepat pilihan 1–3 (setengah hitam + X > hitam ⇔ X > 320,28) diturunkan dari angka dokumen; batasnya disebut: hanya untuk pilihan yang memuat setengah hitam.',
    'Pertanyaan cepat baru: lebar lengan w (dari 10 + w + 10 = 28) dan luas salib (448 − 64), dari "Kesalahan umum" dokumen.',
  ],
};

export default q17;
