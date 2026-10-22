/**
 * Panduan "Pasang di perangkat" (FR-OFF-3; tidak khusus HP sejak v1.12): Android memakai pemicu pemasangan peramban (tombol Pasang);
 * iPhone/iPad menampilkan langkah Bagikan → Tambahkan ke Layar Utama. Muncul satu kali setelah
 * kunjungan kedua dan selalu tersedia di Tentang dan Pengaturan.
 */
import { icon } from '../core/icons';
import { isIOS, isStandalone } from '../core/fullscreen';
import { store } from '../core/store';
import { openSheet } from './sheet';
import { toast } from './toast';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: InstallPromptEvent | null = null;

export function captureInstallPrompt(): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as InstallPromptEvent;
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    toast('Paham TKA terpasang. Buka dari layar utama perangkatmu.');
  });
}

const step = (n: number, html: string): string =>
  `<li class="install-step"><span class="install-n">${n}</span><span>${html}</span></li>`;

export function openInstallGuide(): void {
  if (isStandalone()) {
    openSheet({
      title: 'Sudah terpasang',
      body: '<p>Paham TKA sudah berjalan dari layar utama. Semua soal yang dibuka tersedia tanpa internet.</p>',
    });
    return;
  }
  if (isIOS()) {
    openSheet({
      title: 'Pasang di iPhone atau iPad',
      body: `<p>Buka halaman ini di <b>Safari</b>, lalu:</p>
        <ol class="install-steps">
          ${step(1, `Ketuk tombol <b>Bagikan</b> ${icon('share', 'inline-ic')} di bilah bawah atau atas.`)}
          ${step(2, `Pilih <b>Tambahkan ke Layar Utama</b> ${icon('square-plus', 'inline-ic')}.`)}
          ${step(3, 'Ketuk <b>Tambah</b>, lalu buka Paham TKA dari layar utama.')}
        </ol>
        <p class="muted">Kemajuan belajarmu lebih aman bila aplikasi dipasang, karena Safari dapat menghapus data situs yang lama tidak dibuka.</p>`,
    });
    return;
  }
  if (deferred) {
    const ev = deferred;
    openSheet({
      title: 'Pasang di perangkat',
      body: `<p>Pasang Paham TKA di perangkatmu agar bisa dibuka seperti aplikasi, tanpa internet.</p>`,
      actions: [
        {
          label: 'Pasang',
          kind: 'primary',
          icon: 'download',
          onClick: async () => {
            await ev.prompt();
            const r = await ev.userChoice;
            if (r.outcome === 'accepted') deferred = null;
          },
        },
      ],
      closeLabel: 'Nanti saja',
    });
    return;
  }
  openSheet({
    title: 'Pasang di perangkat',
    body: `<ol class="install-steps">
        ${step(1, 'Buka menu peramban (ikon tiga titik).')}
        ${step(2, 'Pilih <b>Instal aplikasi</b>, <b>Pasang Paham TKA</b>, atau <b>Tambahkan ke layar utama</b>. Di laptop, tombol pasang biasanya ada di ujung kanan kolom alamat.')}
        ${step(3, 'Buka Paham TKA dari layar utama atau daftar aplikasi. Setelah itu aplikasi berjalan tanpa internet.')}
      </ol>`,
  });
}

/** Tampilkan sekali setelah kunjungan kedua (bukan saat sudah terpasang). */
export function maybeShowInstallGuide(visits: number): void {
  if (visits < 2 || store.ui.installGuideShown || isStandalone()) return;
  store.setInstallGuideShown();
  setTimeout(openInstallGuide, 1500);
}
