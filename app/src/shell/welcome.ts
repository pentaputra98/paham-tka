/**
 * Sambutan saat pertama masuk (revisi pemilik v1.12): sekilas tentang Paham TKA dan saran memakai layar lebar
 * (tablet atau laptop) untuk pengalaman terbaik. Muncul sekali per perangkat; lembar aplikasi, bukan UI bawaan.
 */
import { icon } from '../core/icons';
import { store } from '../core/store';
import { openSheet } from './sheet';

export function openWelcome(onDone?: () => void): void {
  openSheet({
    title: 'Selamat datang di Paham TKA',
    body: `<div class="welcome">
      <p>Paham TKA berisi pembahasan interaktif soal TKA Matematika Tingkat Lanjut 2025, langkah demi langkah
        seperti dijelaskan guru di kelas: animasi, papan tulis, pertanyaan cepat, catatan lengkap, dan latihan serupa.</p>
      <p class="welcome-tip">${icon('monitor-smartphone')}<span><b>Saran:</b> pakai perangkat berlayar lebar seperti
        <b>tablet atau laptop</b> agar gambar dan papan tulis terlihat lega. Di HP tetap bisa, dalam posisi mendatar.</span></p>
    </div>`,
    actions: [{ label: 'Mulai belajar', kind: 'primary', icon: 'play' }],
    closeLabel: null,
    onClose: () => {
      store.setWelcomeSeen();
      onDone?.();
    },
  });
}

/** Tampilkan sambutan bila belum pernah dilihat; panduan pasang (bila ada) menunggu sambutan ditutup. */
export function maybeShowWelcome(next: () => void): void {
  if (store.ui.welcomeSeen) return next();
  openWelcome(next);
}
