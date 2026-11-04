/**
 * SOAL 7 — Penambahan Volume 10 Drum (polinom dikali konstanta; pilihan tunggal). Kunci: D (0,5T³ + 4T² + 200T).
 * Sumber: docs/pembahasan25.md "SOAL 7", docs/soal25.md no. 7.
 * Alur (v1.39, dicatat di dokumen):
 *  - pahami: V(T) untuk satu drum; 10 drum sama dan suhunya sama; ditanya total penambahan volume;
 *  - total 10 drum: satu drum menjadi sepuluh, V(T) + V(T) + … = 10·V(T);
 *  - kalikan tiap suku dengan 10: 0,05 → 0,5 dan 0,4 → 4 (koma bergeser satu tempat ke kanan), 20 → 200 (tambah nol);
 *  - cocokkan dengan pilihan per suku (jalur cepat pilihan ganda): suku T sama semua, suku T² menggugurkan A dan E,
 *    suku T³ menggugurkan B dan C → D;
 *  - bagian opsional "Cek dengan T = 10" (Pemeriksaan hasil dokumen): 10 × 290 = 2.900.
 * Tanpa simbol ":" di baris papan. Tata letak: panggung penuh dua kolom (PRD v1.5).
 */
import { H, O, T } from '../../engine/dsl';
import type { SoalContent, Visual } from '../../engine/types';
import type { Drum7State } from '../../visuals/drum7';
import { getSoal } from '../index';

const drum = (state: Drum7State): Visual => ({ kind: 'svg', scene: 'drum7', state });
const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
/** pilihan (docs/soal25.md no. 7) */
const OPT = [
  '50T^{3}+40T^{2}+200T',
  '50T^{3}+4T^{2}+200T',
  '5T^{3}+4T^{2}+200T',
  '0{,}5T^{3}+4T^{2}+200T',
  '0{,}5T^{3}+0{,}4T^{2}+200T',
];
const PIN = ['pV'];

const q07: SoalContent = {
  meta: getSoal(7)!,
  sourceRef: 'docs/pembahasan25.md#soal-7',
  layout: 'full',
  paper: {
    html: `<p>Sebuah drum bahan bakar logam mengalami penambahan kapasitas volume saat terkena panas, yang dapat dinyatakan dalam fungsi berikut.</p>
<p>$\\htmlClass{hl hl-red}{\\htmlData{src=s-V, hl=1}{V(T)=0{,}05T^{3}+0{,}4T^{2}+20T}}$</p>
<p>dengan $T$ adalah suhu dalam derajat Celsius dan $V(T)$ adalah penambahan volume dalam liter.</p>
<p>Apabila terdapat <span class="hl hl-blue" data-hl="2"><span data-src="s-10">10 drum dengan jenis dan ukuran yang sama</span></span>, <span class="hl hl-gold" data-hl="3"><span data-src="s-tanya">total penambahan volume</span></span> dari drum-drum tersebut ketika terkena panas dengan <span class="hl hl-blue" data-hl="2"><span data-src="s-suhu">suhu yang sama</span></span> dapat dinyatakan dengan ....</p>
<ol class="abc">
${LETTERS.map((o, i) => `<li><span>${o}.</span><span class="hl hl-blue hl-q" data-hl="9"><span data-src="s-o${o}">$${OPT[i]}$</span></span></li>`).join('\n')}
</ol>`,
    srcNames: ['s-V', 's-10', 's-suhu', 's-tanya', 's-oA', 's-oB', 's-oC', 's-oD', 's-oE'],
  },
  lobby: {
    eyebrow: 'Kelas 12 · Matematika Lanjut · Fungsi polinom',
    titleLines: ['Pembahasan Soal', 'Fungsi <span class="accent">Volume</span>', '10 Drum'],
    lede: 'Satu drum bertambah volumenya menurut $V(T)$ saat dipanasi. Berapa fungsi penambahan volume untuk 10 drum yang sama?',
    facts: [
      { dt: 'Banyak drum', dd: '10' },
      { dt: 'Suhu', dd: 'sama' },
      { dt: 'Dicari', dd: 'fungsi total' },
    ],
  },
  chapters: [
    { t: 'Lobi', d: 'Halaman awal' },
    { t: 'Pahami soal', d: 'Satu drum dan sepuluh drum' },
    { t: 'Total 10 drum', d: '10 · V(T)' },
    { t: 'Kalikan tiap suku', d: 'Koma bergeser satu tempat' },
    { t: 'Cocokkan pilihan', d: 'Bandingkan per suku' },
    { t: 'Cek dengan T = 10', d: 'Opsional: uji nilai', opt: true },
    { t: 'Catatan lengkap', d: 'Simpan dan cetak' },
    { t: 'Kartu pilihan', d: 'Kartu A–E' },
    { t: 'Selesai', d: 'Jawaban D' },
  ],
  pinsLabel: 'Catatan',
  pins: {
    pV: {
      id: 'pV',
      toks: [T('PV1', 'V(T)', '', 'k1a'), O('PV2', '='), T('PV3', '0{,}05T^3+0{,}4T^2+20T', '', 'k1a')],
    },
    pW: {
      id: 'pW',
      toks: [
        T('PW1', 'V_{\\text{total}}', '', 'm5a'),
        O('PW2', '='),
        T('PW3', '0{,}5T^3+4T^2+200T', '', 'm5c'),
      ],
    },
  },
  lists: {
    L1: [
      {
        id: 'k1',
        toks: [T('k1a', 'V(T)=0{,}05T^3+0{,}4T^2+20T', 'red', '@s-V')],
        note: 'penambahan volume satu drum; simpan ke catatan',
      },
      {
        id: 'k2',
        toks: [
          H('k2a', '10 drum sama, suhu sama', 'tx', '@s-10'),
          O('k2b', '\\to'),
          H('k2c', 'tiap drum bertambah', 'tx'),
          T('k2d', 'V(T)', 'blue'),
        ],
      },
      {
        id: 'k3',
        toks: [H('k3a', 'Ditanya', 'lbl'), H('k3b', 'total penambahan volume 10 drum', 'gold', '@s-tanya')],
      },
    ],
    LA: [
      {
        id: 'a1',
        toks: [T('a1a', 'V(T)+V(T)+\\dots+V(T)'), H('a1b', '(10 kali)', 'tx')],
        note: 'sepuluh drum, masing-masing $V(T)$',
      },
      {
        id: 'a2',
        toks: [T('a2a', 'V_{\\text{total}}(T)'), O('a2b', '='), T('a2c', '10\\cdot V(T)', 'blue')],
        note: 'penjumlahan berulang sama dengan perkalian',
        box: 'navy',
      },
    ],
    LM: [
      {
        id: 'm1',
        toks: [T('m1a', '10(0{,}05T^3+0{,}4T^2+20T)', '', 'PV3')],
        note: '$V(T)$ diganti rumusnya',
      },
      {
        id: 'm2',
        toks: [T('m2a', '10\\times0{,}05'), O('m2b', '='), T('m2c', '0{,}5', 'blue')],
        note: 'dikali $10$, koma bergeser satu tempat ke kanan',
      },
      {
        id: 'm3',
        toks: [T('m3a', '10\\times0{,}4'), O('m3b', '='), T('m3c', '4', 'blue')],
        note: 'koma bergeser ke belakang angka $4$, jadi $4$',
      },
      {
        id: 'm4',
        toks: [T('m4a', '10\\times20'), O('m4b', '='), T('m4c', '200', 'blue')],
        note: 'bilangan bulat dikali $10$, tambah satu nol',
      },
      {
        id: 'm5',
        toks: [T('m5a', 'V_{\\text{total}}'), O('m5b', '='), T('m5c', '0{,}5T^3+4T^2+200T', 'gold')],
        note: 'setiap suku dikali $10$; simpan ke catatan',
        box: 'gold',
      },
    ],
    LO: [
      {
        id: 'o1',
        toks: [
          H('o1a', 'suku T', 'tx'),
          T('o1b', '200T', '', 'PW3'),
          O('o1c', '\\to'),
          H('o1d', 'sama di semua pilihan', 'tx'),
        ],
        note: 'belum bisa membedakan, lanjut ke suku berikutnya',
      },
      {
        id: 'o2',
        toks: [
          H('o2a', 'suku T²', 'tx'),
          T('o2b', '4T^2', '', 'PW3'),
          O('o2c', '\\to'),
          H('o2d', 'A dan E gugur', 'tx'),
        ],
        note: 'A menulis $40T^2$, E menulis $0{,}4T^2$',
      },
      {
        id: 'o3',
        toks: [
          H('o3a', 'suku T³', 'tx'),
          T('o3b', '0{,}5T^3', '', 'PW3'),
          O('o3c', '\\to'),
          H('o3d', 'B dan C gugur', 'tx'),
        ],
        note: 'B menulis $50T^3$, C menulis $5T^3$',
      },
      {
        id: 'o4',
        toks: [H('o4a', 'Jawaban', 'lbl'), T('o4b', '\\textbf{D}', '', '@s-oD')],
        note: 'ketiga sukunya sama dengan hasil kita',
        box: 'gold',
      },
      {
        id: 'o5',
        toks: [H('o5a', 'Hati-hati', 'lbl'), H('o5b', 'semua suku dikali 10', 'tx')],
        note: 'pilihan E lupa mengalikan suku $T^2$',
      },
    ],
    // cek dengan T = 10 (opsional)
    LC: [
      {
        id: 'c1',
        toks: [
          T('c1a', 'V(10)'),
          O('c1b', '='),
          T('c1c', '50+40+200'),
          O('c1d', '='),
          T('c1e', '290', 'blue'),
        ],
        note: '$0{,}05\\times1.000=50$, $0{,}4\\times100=40$, $20\\times10=200$',
      },
      {
        id: 'c2',
        toks: [
          H('c2a', '10 drum', 'tx'),
          T('c2b', '10\\times290', '', 'c1e'),
          O('c2c', '='),
          T('c2d', '2{.}900', 'blue'),
        ],
        note: 'liter',
      },
      {
        id: 'c3',
        toks: [
          H('c3a', 'pilihan D', 'tx'),
          T('c3b', '500+400+2{.}000'),
          O('c3c', '='),
          T('c3d', '2{.}900'),
          T('c3e', '\\;\\checkmark', 'blue'),
        ],
        note: 'pilihan lain memberi $56.000$, $52.400$, $7.400$, dan $2.540$',
      },
    ],
    L7: [{ id: 'v1', toks: [H('v1a', 'Jawaban', 'lbl'), T('v1b', '\\textbf{D}')], box: 'gold' }],
    LR: [
      {
        id: 'r1',
        toks: [T('r1a', 'V_{\\text{total}}=0{,}5T^3+4T^2+200T')],
        note: 'setiap suku dikali $10$',
        box: 'gold',
      },
      { id: 'r2', toks: [H('r2a', 'Jawaban', 'lbl'), T('r2b', '\\textbf{D}')], box: 'gold' },
    ],
  },
  steps: [
    // ---- 1 · Pahami soal ----
    {
      ch: 1,
      cap: 'Perhatikan soalnya. $V(T)$ adalah penambahan volume untuk satu drum.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 1, from: 0, save: ['pV'] },
    },
    {
      ch: 1,
      cap: 'Ada $10$ drum yang sama dan suhunya sama, jadi tiap drum bertambah $V(T)$. Yang ditanya total penambahan volumenya.',
      visual: { kind: 'soal', hl: 3 },
      board: { title: 'Pahami soal', list: 'L1', upTo: 3, from: 1 },
    },
    // ---- 2 · Total 10 drum ----
    {
      ch: 2,
      cap: 'Satu drum bertambah $V(T)$. Sepuluh drum yang sama berarti $V(T)$ dijumlahkan sepuluh kali.',
      visual: drum({ n: 10 }),
      board: { title: 'Total 10 drum', pins: PIN, list: 'LA', upTo: 1, from: 0 },
    },
    {
      ch: 2,
      cap: 'Penjumlahan berulang sama dengan perkalian, jadi totalnya $10\\cdot V(T)$.',
      visual: drum({ n: 10, sum: true }),
      board: { title: 'Total 10 drum', pins: PIN, list: 'LA', upTo: 2, from: 1 },
    },
    // ---- 3 · Kalikan tiap suku ----
    {
      ch: 3,
      cap: 'Ganti $V(T)$ dengan rumusnya, $10(0{,}05T^3+0{,}4T^2+20T)$. Angka $10$ dikali ke setiap suku.',
      visual: drum({ view: 'mul', t: 0 }),
      board: { title: 'Kalikan tiap suku', pins: PIN, list: 'LM', upTo: 1, from: 0 },
    },
    {
      ch: 3,
      cap: 'Tahukah kalian? Dikali $10$ berarti koma bergeser satu tempat ke kanan, jadi $10\\times0{,}05=0{,}5$.',
      visual: drum({ view: 'mul', t: 1 }),
      board: { title: 'Kalikan tiap suku', pins: PIN, list: 'LM', upTo: 2, from: 1 },
      ask: {
        before: 'm2',
        q: 'Berapa $10\\times0{,}05$?',
        opts: [
          { tex: '0{,}5', ok: true },
          {
            tex: '5',
            hint: 'Dikali $10$ menggeser koma satu tempat, bukan dua, jadi $0{,}05$ menjadi $0{,}5$.',
          },
          { tex: '50', hint: 'Itu kalau koma bergeser tiga tempat. $10\\times0{,}05=0{,}5$.' },
        ],
      },
    },
    {
      ch: 3,
      cap: 'Begitu juga $10\\times0{,}4$. Koma bergeser ke belakang angka $4$, jadi hasilnya $4$.',
      visual: drum({ view: 'mul', t: 2 }),
      board: { title: 'Kalikan tiap suku', pins: PIN, list: 'LM', upTo: 3, from: 2 },
    },
    {
      ch: 3,
      cap: 'Lalu $10\\times20=200$, cukup tambah satu nol. Jadi totalnya $0{,}5T^3+4T^2+200T$.',
      visual: drum({ view: 'mul', t: 3 }),
      board: { title: 'Kalikan tiap suku', pins: PIN, list: 'LM', upTo: 5, from: 3, save: ['pW'] },
    },
    // ---- 4 · Cocokkan pilihan ----
    {
      ch: 4,
      cap: 'Bandingkan dengan pilihan per suku. Mulai dari suku $T$, semuanya $200T$, jadi belum ada yang gugur.',
      visual: drum({ view: 'opts', col: 1 }),
      board: { title: 'Cocokkan pilihan', pins: ['pW'], list: 'LO', upTo: 1, from: 0 },
    },
    {
      ch: 4,
      cap: 'Suku $T^2$ harus $4T^2$. A menulis $40T^2$ dan E menulis $0{,}4T^2$, jadi A dan E gugur.',
      visual: drum({ view: 'opts', col: 2 }),
      board: { title: 'Cocokkan pilihan', pins: ['pW'], list: 'LO', upTo: 2, from: 1 },
    },
    {
      ch: 4,
      cap: 'Suku $T^3$ harus $0{,}5T^3$. B menulis $50T^3$ dan C menulis $5T^3$, jadi tinggal D.',
      visual: drum({ view: 'opts', col: 3, win: true }),
      board: { title: 'Cocokkan pilihan', pins: ['pW'], list: 'LO', upTo: 4, from: 2 },
    },
    {
      ch: 4,
      cap: 'Hati-hati, semua suku harus dikali $10$. Pilihan E lupa mengalikan suku $T^2$.',
      visual: { kind: 'soal', hl: 0, focus: 's-oE' },
      board: { title: 'Cocokkan pilihan', pins: ['pW'], list: 'LO', upTo: 5, from: 4 },
    },
    // tawaran cek (opsional): Ya masuk Bagian 5, Tidak/Lewati langsung ke Bagian 6
    {
      ch: 4,
      cap: 'Mau cek jawabannya dengan memasukkan satu nilai suhu, misalnya $T=10$?',
      visual: drum({ view: 'opts', col: 3, win: true }),
      board: { title: 'Cocokkan pilihan', pins: ['pW'], list: 'LO', upTo: 5, from: 5 },
      branch: { yes: 'Ya, cek dengan T = 10' },
    },
    // ---- 5 · Cek dengan T = 10 (opsional) ----
    {
      ch: 5,
      cap: 'Satu drum pada $T=10$, $V(10)=50+40+200=290$ liter. Sepuluh drum berarti $10\\times290=2.900$ liter.',
      visual: { kind: 'soal', hl: 1 },
      board: { title: 'Cek dengan T = 10', list: 'LC', upTo: 2, from: 0 },
    },
    {
      ch: 5,
      cap: 'Pilihan D pada $T=10$ memberi $500+400+2.000=2.900$, cocok. Pilihan lain tidak memberi $2.900$.',
      visual: drum({ view: 'opts', col: 3, win: true, val: true }),
      board: { title: 'Cek dengan T = 10', list: 'LC', upTo: 3, from: 2 },
    },
    // ---- 6 · Catatan lengkap ----
    {
      ch: 6,
      cap: 'Semua langkah dari awal sampai akhir. Simpan untuk belajar lagi.',
      visual: { kind: 'notes' },
    },
    // ---- 7 · Kartu pilihan ----
    {
      ch: 7,
      cap: 'Cocokkan dengan pilihan. Hanya D yang ketiga sukunya dikali $10$ dengan benar; pilih jawabannya di bawah.',
      visual: { kind: 'cards', flip: 5 },
      board: { title: 'Kartu pilihan', pins: ['pW'], list: 'L7', upTo: 1, from: 0 },
      ask: {
        before: 'v1',
        q: 'Total penambahan volume 10 drum adalah…',
        letters: true,
        col: true,
        win: 'Jawabannya <b>D</b>.',
        opts: [
          { tex: OPT[0]!, hint: 'Koma pada $0{,}05$ dan $0{,}4$ digeser terlalu jauh.' },
          { tex: OPT[1]!, hint: 'Suku $T^3$ salah, $10\\times0{,}05=0{,}5$, bukan $50$.' },
          { tex: OPT[2]!, hint: 'Suku $T^3$ salah, $10\\times0{,}05=0{,}5$, bukan $5$.' },
          { tex: OPT[3]!, ok: true },
          { tex: OPT[4]!, hint: 'Suku $T^2$ lupa dikali $10$.' },
        ],
      },
    },
    // ---- 8 · Selesai ----
    {
      ch: 8,
      cap: '<span class="verdict"><span class="seal">D</span><span>Untuk 10 drum, tiap suku dikali $10$, jadi $0{,}5T^3+4T^2+200T$.</span></span>',
      visual: { kind: 'done' },
      board: { title: 'Ringkasan', list: 'LR', upTo: 2, from: 2 },
    },
  ],
  cards: [
    {
      label: 'A',
      statement: `$${OPT[0]}$`,
      ok: false,
      formula: '50\\ne0{,}5;\\ 40\\ne4',
      why: 'Koma digeser terlalu jauh pada dua suku pertama.',
    },
    { label: 'B', statement: `$${OPT[1]}$`, ok: false, formula: '50\\ne0{,}5', why: 'Suku $T^3$ salah.' },
    { label: 'C', statement: `$${OPT[2]}$`, ok: false, formula: '5\\ne0{,}5', why: 'Suku $T^3$ salah.' },
    {
      label: 'D',
      statement: `$${OPT[3]}$`,
      ok: true,
      formula: '10\\cdot V(T)',
      why: 'Semua suku dikali 10 dengan benar.',
    },
    {
      label: 'E',
      statement: `$${OPT[4]}$`,
      ok: false,
      formula: '0{,}4\\ne4',
      why: 'Suku $T^2$ lupa dikali 10.',
    },
  ],
  notes: {
    title: 'Pembahasan Soal 7: Penambahan Volume 10 Drum',
    meta: 'TKA Matematika Tingkat Lanjut 2025 · Fungsi polinom',
    sections: [
      { title: 'Pahami soal', lists: ['L1'] },
      {
        title: 'Total 10 drum',
        lists: ['LA', 'LM'],
        why: 'Total $=10\\times$ penambahan satu drum. Mengalikan fungsi dengan konstanta berarti mengalikan setiap suku.',
      },
      { title: 'Cocokkan pilihan per suku', lists: ['LO'] },
      { title: 'Cek dengan T = 10 (opsional)', lists: ['LC'] },
    ],
    answer: 'Jawaban: <b>D</b>, $0{,}5T^3+4T^2+200T$.',
  },
  done: { seal: 'D', message: 'Untuk 10 drum, tiap suku dikali $10$, jadi $0{,}5T^3+4T^2+200T$.' },
  key: {
    answer: 'D',
    cardOk: [false, false, false, true, false],
    goldRows: ['m5', 'o4', 'v1', 'r1', 'r2'],
  },
  authorNotes: [
    'Modul baru (v1.39). Total 10 drum = 10·V(T) dengan gambar satu drum menjadi sepuluh (dokumen Langkah 2.1); penjumlahan berulang ditambahkan sebagai jembatan ke perkalian.',
    'Tiap suku dikali 10 dengan animasi geser koma (0,05 → 0,5; 0,4 → 4) dan tambah nol (20 → 200), dari baris a3–a4 dokumen; pertanyaan cepat 10 × 0,05 dari dokumen.',
    'Jalur cepat pilihan ganda: pilihan dibandingkan per suku (T, lalu T², lalu T³); turunan dari tabel kartu dokumen. Uji T = 10 dari Pemeriksaan hasil dokumen menjadi bagian opsional.',
    'Tanpa simbol ":" di baris papan.',
  ],
};

export default q07;
