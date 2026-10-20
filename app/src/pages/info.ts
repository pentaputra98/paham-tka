/** Halaman Tentang (PRD §8.12, §15.3, §15.4) dan Kemajuan (kerangka M0; isi lengkap M4). */
import { html } from '../core/dom';
import { icon } from '../core/icons';
import type { PageView } from '../shell/app';
import { openInstallGuide } from '../shell/install';

/** Teks resmi PRD §15.3 — dipakai apa adanya. */
export const SOURCE_STATEMENT =
  'Soal-soal dalam aplikasi ini bersumber dari naskah soal asli Tes Kemampuan Akademik (TKA) Matematika Tingkat Lanjut tahun 2025. Hak atas naskah soal asli beserta gambar di dalamnya dimiliki oleh Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen) dan ditampilkan di sini semata-mata untuk keperluan pembelajaran non-komersial di lingkungan sekolah. Pembahasan, animasi, soal latihan serupa, dan aplikasi ini disusun oleh Penta Putra Purnomo, S.Pd., Gr. Soal latihan serupa dibuat otomatis dengan pola yang terinspirasi soal asli dan bukan soal resmi TKA. Aplikasi ini tidak berafiliasi dengan Kemendikdasmen.';

const LICENSES: Array<[string, string, string]> = [
  ['KaTeX', 'MIT', 'penulisan rumus'],
  ['Three.js', 'MIT', 'animasi 3D pelengkap soal 18'],
  ['Motion', 'MIT', 'lapisan gerak (bila dipakai)'],
  ['Lucide', 'ISC', 'ikon terpilih'],
  ['Archivo', 'SIL OFL 1.1', 'huruf judul'],
  ['Plus Jakarta Sans', 'SIL OFL 1.1', 'huruf isi'],
  ['JetBrains Mono', 'SIL OFL 1.1', 'huruf label dan angka'],
];

const KEYS: Array<[string, string]> = [
  ['← →', 'langkah sebelumnya / berikutnya'],
  ['Spasi', 'putar otomatis atau jeda'],
  ['R', 'ulangi langkah ini'],
  ['C', 'coretan'],
  ['F', 'layar penuh'],
  ['M', 'musik latar'],
  ['Esc', 'tutup lembar'],
  ['?', 'daftar pintasan'],
];

export function aboutPage(): PageView {
  const el = html(`<div class="page-scroll"><div class="page-col">
    <h1 class="page-title">Tentang Paham TKA</h1>
    <section class="panel">
      <h2>Paham TKA</h2>
      <p>Pembahasan interaktif TKA Matematika Tingkat Lanjut 2025. <i>Yuk pahami soal TKA 2025, step by step.</i></p>
      <p class="muted">Versi ${__APP_VERSION__}</p>
      <p><b>© 2026 Penta Putra Purnomo, S.Pd., Gr. | SMA Vidatra Bontang</b></p>
    </section>
    <section class="panel">
      <h2>Sumber soal</h2>
      <p>${SOURCE_STATEMENT}</p>
    </section>
    <section class="panel">
      <h2>Memakai tanpa internet</h2>
      <p>Buka tautan kelas satu kali saat tersambung internet. Setelah lencana <b>Siap offline</b> muncul, semua soal yang dibuka berjalan tanpa internet, termasuk dalam mode pesawat.</p>
      <p>Pasang di layar utama agar kemajuanmu lebih aman tersimpan.</p>
      <div class="row"><span class="row-label">Pasang di HP<small>Android: tombol Pasang. iPhone: Bagikan → Tambahkan ke Layar Utama.</small></span>
        <button type="button" class="btn" data-install>${icon('smartphone')}<span>Pasang di HP</span></button></div>
    </section>
    <section class="panel">
      <h2>Privasi</h2>
      <p>Tidak ada akun, iklan, pelacakan, atau pengiriman data. Pengaturan, kemajuan, dan coretanmu hanya tersimpan di perangkat ini.</p>
    </section>
    <section class="panel">
      <h2>Pintasan keyboard</h2>
      <dl class="keys">${KEYS.map(([k, d]) => `<div><dt><kbd>${k}</kbd></dt><dd>${d}</dd></div>`).join('')}</dl>
    </section>
    <section class="panel">
      <h2>Lisensi pustaka dan huruf</h2>
      <table class="lic"><thead><tr><th scope="col">Komponen</th><th scope="col">Lisensi</th><th scope="col">Dipakai untuk</th></tr></thead>
        <tbody>${LICENSES.map(([a, b, c]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join('')}</tbody></table>
    </section>
  </div></div>`);
  el.querySelector('[data-install]')!.addEventListener('click', openInstallGuide);
  return { el, title: 'Tentang', header: { back: { label: 'Beranda', href: '#/' } }, footer: true };
}

export function progressPage(): PageView {
  const el = html(`<div class="page-scroll"><div class="page-col">
    <h1 class="page-title">Kemajuan belajar</h1>
    <section class="panel empty-state">
      <p>Belum ada kemajuan. Buka soal 1 untuk mulai.</p>
      <a class="btn btn--primary" href="#/soal/1">${icon('play')}<span>Buka soal 1</span></a>
    </section>
  </div></div>`);
  return { el, title: 'Kemajuan', header: { back: { label: 'Beranda', href: '#/' } }, footer: true };
}
