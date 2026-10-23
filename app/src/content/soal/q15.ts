/**
 * SOAL 15 — Lingkaran yang Sepusat (lingkaran; pilihan tunggal). Kunci: A.
 * Sumber: docs/pembahasan25.md "SOAL 15", docs/soal25.md no. 15, docs/lingkaran_A.png.
 * Alur gaya mengajar Pak Penta (23 Okt 2026, dicatat di dokumen): sepusat = pusat sama, jari-jari boleh beda
 * → baca pusat p(−3, 4) dan r = 2 dari grafik (disimpan ke catatan) → cara cepat pusat (−A/2, −B/2), dengan alasan
 * dan batas berlakunya → tiap pilihan disalin dari soal, pusatnya dihitung dan digambar di grafik → pastikan A
 * dengan melengkapkan kuadrat → hati-hati dengan B (jari-jari sama, pusat beda).
 * Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { Row, SoalContent, Step, Visual } from '../../engine/types';
import type { CircState, Opt } from '../../visuals/circ15';
import { getSoal } from '../index';

/** Gambar asli soal (docs/lingkaran_A.png), dibundel dan ikut precache. */
const fig = new URL('../../assets/soal/lingkaran_A.png', import.meta.url).href;
const circ = (state: CircState): Visual => ({ kind: 'svg', scene: 'circ15', state });
const N1 = ['pP'];
const N2 = ['pP', 'pRA'];
const N3 = ['pP', 'pRA', 'pRule'];
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
/** baris pusat pilihan: koefisien x dan y masing-masing dibagi −2 */
const center = (o: Opt, a: number, b: number, note: string, ok = false): Row => {
  const t = (v: number): string => (v < 0 ? `-${-v}` : String(v));
  const h = -a / 2;
  const k = -b / 2;
  return {
    id: `o${o}`,
    toks: [
      T(`o${o}a`, `\\left(\\tfrac{${t(a)}}{-2},\\ \\tfrac{${t(b)}}{-2}\\right)`),
      O(`o${o}d`, '='),
      T(`o${o}e`, `(${t(h)},\\ ${t(k)})`, ok ? 'gold' : 'red'),
    ],
    note,
    ...(ok ? { box: 'gold' as const } : {}),
  };
};
const open4 = (o: Opt, cap: string): Step => ({
  ch: 4,
  cap,
  visual: { kind: 'soal', hl: 0, focus: `s-o${o}` },
  board: { title: `Pilihan ${o}`, pins: N3, list: `L4${o}`, upTo: 1, from: 0 },
});
const check4 = (o: Opt, cap: string): Step => ({
  ch: 4,
  cap,
  visual: circ({ opts: [o] }),
  board: { title: `Pilihan ${o}`, pins: N3, list: `L4${o}`, upTo: 2, from: 1 },
});

const q15: SoalContent = {
  meta: getSoal(15)!,
  sourceRef: 'docs/pembahasan25.md#soal-15',
  layout: 'full',
  paper: {
    html: `<div class="soal-split"><div>
<p>Perhatikan gambar lingkaran berikut.</p>
<p><span class="hl hl-red" data-hl="1"><span data-src="s-d">Diameter lingkaran pada gambar adalah 4 satuan</span></span>. <span class="hl hl-gold" data-hl="2"><span data-src="s-tanya">Persamaan lingkaran yang <span data-src="s-pusat">sepusat</span> dengan lingkaran pada gambar</span></span> tersebut adalah ....</p>
</div><figure class="soal-fig"><img src="${fig}" width="529" height="591" alt="Bidang koordinat dengan Lingkaran A; titik pusat p berada di x = −3 (di antara label −4 dan −2) dan y = 4; sebuah diameter melewati p." /></figure></div>
<ol class="abc">
${LETTERS.map((o) => `<li><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">$${OPTS[o]}$</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-d', 's-tanya', 's-pusat', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  visualSrc: ['g-p', 'g-x', 'g-y', 'g-d'],
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
    { t: 'Pahami soal', d: 'Arti sepusat' },
    { t: 'Baca pusat', d: 'p = (−3, 4)' },
    { t: 'Cara cepat', d: 'Pusat (−A/2, −B/2)' },
    { t: 'Uji kelima pilihan', d: 'Satu per satu' },
    { t: 'Pastikan jawaban', d: 'Melengkapkan kuadrat' },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Cocokkan pilihan', d: '5 kartu' },
    { t: 'Selesai', d: 'Jawaban A' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pP: {
      id: 'pP',
      toks: [T('PP1', 'p', '', 'a2a'), O('PP2', '='), T('PP3', '(-3,\\ 4)', '', 'a2c')],
    },
    pRA: {
      id: 'pRA',
      toks: [T('PA1', 'r_A', '', 'a3a'), O('PA2', '='), T('PA3', '2', '', 'a3e')],
    },
    pRule: {
      id: 'pRule',
      toks: [
        H('PU1', 'pusat', 'tx', 'e4a'),
        O('PU2', '='),
        T('PU3', '\\left(-\\tfrac A2,\\ -\\tfrac B2\\right)', '', 'e4c'),
      ],
    },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [H('k1a', 'diameter lingkaran A', 'tx'), O('k1b', '='), T('k1c', '4', 'red', '@s-d')],
        note: 'jadi jari-jarinya $2$',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', 'sepusat', 'blue', '@s-pusat'),
          O('k2b', '='),
          H('k2c', 'pusatnya sama, jari-jari boleh beda', 'tx'),
        ],
      },
      {
        id: 'k3',
        toks: [
          H('k3a', 'Ditanya', 'lbl'),
          H('k3b', 'persamaan yang sepusat dengan lingkaran A', 'gold', '@s-tanya'),
        ],
      },
    ],
    LP: [
      {
        id: 'a1',
        toks: [
          H('a1a', 'pusat', 'tx'),
          O('a1b', '='),
          H('a1c', 'titik tengah diameter, yaitu', 'tx'),
          T('a1d', 'p', 'blue', '@g-p'),
        ],
      },
      {
        id: 'a2',
        toks: [T('a2a', 'p'), O('a2b', '='), T('a2c', '(-3,\\ 4)', 'blue')],
        note: '$x=-3$ (di antara $-4$ dan $-2$), $y=4$; simpan ke catatan',
        box: 'navy',
      },
      {
        id: 'a3',
        toks: [
          T('a3a', 'r_A'),
          O('a3b', '='),
          T('a3c', '\\tfrac12\\times'),
          T('a3d', '4', '', '@g-d'),
          O('a3f', '='),
          T('a3e', '2', 'blue'),
        ],
        note: 'jari-jari lingkaran A; simpan ke catatan',
      },
    ],
    LC: [
      {
        id: 'e1',
        toks: [T('e1a', '(x+3)^2+(y-4)^2=r^2')],
        note: 'lingkaran berpusat $(-3,4)$',
      },
      {
        id: 'e2',
        toks: [
          T('e2a', 'x^2'),
          T('e2b', '+6x', 'blue'),
          T('e2c', '+9+y^2'),
          T('e2d', '-8y', 'blue'),
          T('e2e', '+16=r^2'),
        ],
        note: 'dijabarkan: $+6x$ dari $2\\cdot3$, $-8y$ dari $2\\cdot(-4)$',
      },
      {
        id: 'e3',
        toks: [
          T('e3a', '\\left(\\tfrac{6}{-2},\\ \\tfrac{-8}{-2}\\right)', '', 'e2b'),
          O('e3d', '='),
          T('e3e', '(-3,\\ 4)', 'blue'),
        ],
        note: 'koefisien $x$ dan $y$ dibagi $-2$: kembali ke pusat',
      },
      {
        id: 'e4',
        toks: [
          H('e4a', 'pusat', 'tx'),
          O('e4b', '='),
          T('e4c', '\\left(-\\tfrac A2,\\ -\\tfrac B2\\right)', 'blue'),
        ],
        note: 'untuk $x^2+Ax+y^2+By+C=0$; berlaku bila koefisien $x^2$ dan $y^2$ sama-sama $1$',
        box: 'navy',
      },
    ],
    L4A: [quote('A'), center('A', 6, -8, 'sama dengan $p$ di catatan → <b class="k-gold">cocok</b>', true)],
    L4B: [quote('B'), center('B', -6, -8, 'tanda $x$ terbalik → <b class="k-red">bukan</b>')],
    L4C: [quote('C'), center('C', 6, 8, 'tanda $y$ terbalik → <b class="k-red">bukan</b>')],
    L4D: [quote('D'), center('D', -8, -6, 'koefisien $x$ dan $y$ tertukar → <b class="k-red">bukan</b>')],
    L4E: [quote('E'), center('E', 8, -6, 'koefisien $x$ dan $y$ tertukar → <b class="k-red">bukan</b>')],
    LK: [
      {
        id: 'f2',
        toks: [T('f2a', '(x^2+6x+9)+(y^2-8y+16)', '', '@s-oA')],
        note: 'pilihan A, lengkapkan kuadrat: tambah $\\left(\\frac62\\right)^2=9$ dan $\\left(\\frac82\\right)^2=16$',
      },
      {
        id: 'f6',
        toks: [O('f6a', '='), T('f6b', '-16+9+16'), O('f6c', '='), T('f6d', '9')],
        note: 'kedua ruas ditambah $9$ dan $16$',
      },
      {
        id: 'f3',
        toks: [T('f3a', '(x+3)^2+(y-4)^2=9')],
        note: 'pusat $(-3,4)$, jari-jari $3$',
        box: 'navy',
      },
      {
        id: 'f4',
        toks: [T('f4a', 'r=3'), O('f4b', '\\ne'), T('f4c', 'r_A=2', '', 'PA3')],
        note: 'tidak masalah: sepusat hanya mensyaratkan pusat sama',
      },
      {
        id: 'f5',
        toks: [H('f5a', 'Hati-hati', 'lbl'), H('f5b', 'B: jari-jari 2 sama, tetapi pusat (3, 4)', 'tx')],
        note: 'konstanta $21$ memberi $r=2$, tetapi tanda $x$ salah → bukan sepusat',
      },
    ],
    L7: [{ id: 's1', toks: [H('s1a', 'Jawaban', 'lbl'), H('s1b', 'A', 'tx')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', '\\text{pusat}=(-3,\\ 4)')],
        note: 'hanya pilihan A yang berpusat di sana',
        box: 'navy',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), H('r2b', 'A', 'tx')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan lingkaran A pada bidang koordinat. Diketahui diameternya $4$ satuan.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0 },
    },
    {
      ch: 1,
      cap: 'Tahukah kalian? Sepusat artinya pusatnya sama, jari-jarinya boleh berbeda, seperti lingkaran-lingkaran pada papan target panahan.',
      visual: circ({ conc: true }),
      board: { title: 'Pahami soal', list: 'L1', upTo: 2, from: 1 },
    },
    {
      ch: 1,
      cap: 'Yang ditanya: persamaan lingkaran yang sepusat dengan lingkaran A. Jadi yang kita butuhkan hanya pusatnya.',
      visual: { kind: 'soal', hl: 2 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 3, from: 2 },
    },
    // ---- 2 · Baca pusat ----
    {
      ch: 2,
      cap: 'Pusat lingkaran A adalah titik $p$, tepat di tengah diameter. Tarik garis ke kedua sumbu: $x=-3$ dan $y=4$.',
      visual: circ({ read: true }),
      board: { title: 'Pusat lingkaran A', list: 'LP', upTo: 2, from: 0, save: ['pP'] },
      ask: {
        before: 'a2',
        q: 'Titik $p$ berada di antara $x=-4$ dan $x=-2$ serta tepat pada $y=4$. Koordinatnya…',
        opts: [
          { tex: '(-3,\\ 4)', ok: true },
          { tex: '(4,\\ -3)', hint: 'Urutan koordinat tertukar. Pertama $x$ (mendatar), baru $y$ (tegak).' },
          { tex: '(3,\\ 4)', hint: '$p$ berada di sebelah kiri sumbu tegak, jadi $x$-nya negatif.' },
        ],
      },
    },
    {
      ch: 2,
      cap: 'Diameternya $4$, jadi jari-jari lingkaran A $=2$. Catat juga, nanti berguna untuk mengenali jebakan.',
      visual: circ({ dlab: true }),
      board: { title: 'Pusat lingkaran A', pins: N1, list: 'LP', upTo: 3, from: 2, save: ['pRA'] },
    },
    // ---- 3 · Cara cepat ----
    {
      ch: 3,
      cap: 'Tahukah kalian? Lingkaran berpusat $(-3,4)$ kalau dijabarkan memunculkan $+6x$ dan $-8y$.',
      visual: circ({}),
      board: { title: 'Cara cepat', pins: N2, list: 'LC', upTo: 2, from: 0 },
    },
    {
      ch: 3,
      cap: 'Lihat polanya: $6$ dibagi $-2$ jadi $-3$, dan $-8$ dibagi $-2$ jadi $4$. Itulah pusatnya!',
      visual: circ({ read: true }),
      board: { title: 'Cara cepat', pins: N2, list: 'LC', upTo: 3, from: 2 },
    },
    {
      ch: 3,
      cap: 'Cara cepat: pusat $=\\left(-\\frac A2,-\\frac B2\\right)$. Ingat, ini berlaku bila koefisien $x^2$ dan $y^2$ sama-sama $1$, seperti di kelima pilihan.',
      visual: circ({}),
      board: { title: 'Cara cepat', pins: N2, list: 'LC', upTo: 4, from: 3, save: ['pRule'] },
    },
    // ---- 4 · Uji kelima pilihan ----
    open4('A', 'Kita cek pilihan A dulu. Salin persamaannya ke papan.'),
    check4(
      'A',
      'Koefisien $x$ adalah $6$ dan $y$ adalah $-8$: pusatnya $(-3,4)$, sama dengan $p$ di catatan. A <b class="k-gold">cocok</b>.',
    ),
    open4('B', 'Lanjut pilihan B.'),
    check4(
      'B',
      'Di B koefisien $x$-nya $-6$, jadi pusatnya $(3,4)$, di sebelah kanan. Tanda $x$ terbalik, B <b class="k-red">bukan</b>.',
    ),
    open4('C', 'Pilihan C.'),
    check4(
      'C',
      'Di C koefisien $y$-nya $+8$, jadi pusatnya $(-3,-4)$, di bawah. Tanda $y$ terbalik, C <b class="k-red">bukan</b>.',
    ),
    open4('D', 'Pilihan D.'),
    check4(
      'D',
      'Di D angka $8$ ada di $x$ dan $6$ di $y$: pusatnya $(4,3)$. Koefisiennya tertukar, D <b class="k-red">bukan</b>.',
    ),
    open4('E', 'Terakhir, pilihan E.'),
    check4('E', 'Di E pusatnya $(-4,3)$, juga tertukar. E <b class="k-red">bukan</b>.'),
    // ---- 5 · Pastikan jawaban ----
    {
      ch: 5,
      cap: 'Kita pastikan pilihan A dengan melengkapkan kuadrat: hasilnya $(x+3)^2+(y-4)^2=9$, pusat $(-3,4)$ dan jari-jari $3$.',
      visual: circ({ opts: ['A'] }),
      board: { title: 'Pastikan jawaban', pins: N3, list: 'LK', upTo: 3, from: 0 },
    },
    {
      ch: 5,
      cap: 'Jari-jari $3$ berbeda dengan $2$, tidak masalah karena sepusat hanya meminta pusat sama. Hati-hati dengan B: jari-jarinya $2$, tetapi pusatnya $(3,4)$.',
      visual: circ({ opts: ['A', 'B'] }),
      board: { title: 'Pastikan jawaban', pins: N3, list: 'LK', upTo: 5, from: 3 },
    },
    // ---- 6 · Catatan lengkap ----
    {
      ch: 6,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 7 · Cocokkan pilihan ----
    {
      ch: 7,
      cap: 'Cocokkan dengan pilihan: hanya A yang berpusat di $(-3,4)$. Pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Cocokkan pilihan', pins: N3, list: 'L7', upTo: 1, from: 0 },
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
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">A</span><span>Pusat lingkaran A adalah $(-3,4)$. Hanya pilihan A yang berpusat di sana.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
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
        title: 'Baca pusat',
        lists: ['LP'],
        why: 'Pusat lingkaran = titik tengah diameter; baca dari garis kisi: $x$ dulu, baru $y$.',
      },
      {
        title: 'Cara cepat',
        lists: ['LC'],
        why: 'Untuk $x^2+Ax+y^2+By+C=0$ (koefisien $x^2$ dan $y^2$ sama-sama 1), pusatnya $\\left(-\\frac A2,-\\frac B2\\right)$.',
      },
      { title: 'Uji kelima pilihan', lists: ['L4A', 'L4B', 'L4C', 'L4D', 'L4E'] },
      { title: 'Pastikan jawaban', lists: ['LK'] },
    ],
    answer: 'Jawaban: <b>A</b>, $x^2+6x+y^2-8y+16=0$ (pusat $(-3,4)$, jari-jari $3$).',
  },
  done: {
    seal: 'A',
    message: 'Pusat lingkaran A adalah $(-3,4)$. Hanya pilihan A yang berpusat di sana.',
  },
  key: { answer: 'A', cardOk: [true, false, false, false, false], goldRows: ['oA', 's1', 'r2'] },
  authorNotes: [
    'Modul baru (23 Okt 2026), disusun dari docs/pembahasan25.md soal 15 dengan gaya mengajar Pak Penta.',
    'Cara cepat pusat (−A/2, −B/2) ditunjukkan dari menjabarkan (x+3)² + (y−4)² (dokumen: prasyarat konsep Bagian 3); batas berlakunya disebut.',
    'Baris "Hati-hati" pilihan B (jari-jari 2 sama, pusat beda) dari kolom jebakan kartu B dokumen.',
  ],
};

export default q15;
