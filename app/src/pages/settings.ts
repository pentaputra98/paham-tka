/** Pengaturan (PRD §8.8). Semua perubahan tersimpan lokal seketika. */
import { esc, html } from '../core/dom';
import { icon } from '../core/icons';
import { report } from '../core/diag';
import { store, type MotionPref, type Path, type Settings, type Speed } from '../core/store';
import { storage } from '../core/storage';
import type { PageView } from '../shell/app';
import { openInstallGuide } from '../shell/install';
import {
  checkOffline,
  checkUpdate,
  offlineStatus,
  onUpdateStatus,
  repairApp,
  updateStatus,
  applyUpdate,
} from '../shell/offline';
import { openSheet } from '../shell/sheet';
import { toast } from '../shell/toast';
import { tes } from '../tes/state';

type BoolKey = 'sfx' | 'music' | 'lite' | 'classroom';

const toggle = (key: BoolKey, label: string, hint: string): string =>
  `<button type="button" class="toggle" role="switch" data-bool="${key}" aria-checked="${store.settings[key]}">
     <span class="toggle-text">${esc(label)}<small>${esc(hint)}</small></span><span class="sw" aria-hidden="true"></span>
   </button>`;

function seg<T extends string | number>(
  name: string,
  label: string,
  value: T,
  opts: Array<[T, string]>,
): string {
  return `<div class="row"><span class="row-label" id="lbl-${name}">${esc(label)}</span>
    <div class="seg" role="radiogroup" aria-labelledby="lbl-${name}" data-seg="${name}">
      ${opts.map(([v, t]) => `<button type="button" role="radio" data-v="${v}" aria-checked="${v === value}">${esc(t)}</button>`).join('')}
    </div></div>`;
}

function offlineText(): string {
  const s = offlineStatus();
  switch (s.state) {
    case 'unsupported':
      return 'Mode offline aktif setelah aplikasi dibuka dari tautan kelas (https).';
    case 'saving':
      return `Sedang menyimpan agar bisa offline… ${s.pct}%`;
    case 'error':
      return 'Belum siap offline. Sambungkan internet sekali lagi.';
    default:
      return 'Siap offline.';
  }
}

export const buildLabel = (): string =>
  `Versi ${__APP_VERSION__}, dibuat ${new Date(__BUILD_TIME__).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}`;

function updateText(): string {
  const u = updateStatus();
  switch (u.phase) {
    case 'checking':
      return 'Memeriksa versi terbaru…';
    case 'downloading':
      return `Mengunduh versi baru… ${u.pct}%`;
    case 'ready':
      return 'Versi baru sudah siap. Tekan Perbarui sekarang.';
    case 'latest':
      return 'Sudah versi terbaru.';
    case 'offline':
      return 'Tidak tersambung internet. Sambungkan internet, lalu cek lagi.';
    case 'error':
      return 'Pemeriksaan gagal. Coba lagi, atau pakai Perbaiki aplikasi.';
    case 'unsupported':
      return 'Pembaruan otomatis aktif saat aplikasi dibuka dari tautan kelas (https).';
    default:
      return 'Aplikasi memeriksa versi baru setiap kali dibuka.';
  }
}

export function settingsPage(): PageView {
  const s = store.settings;
  const el = html(`<div class="page-scroll"><div class="page-col">
    <h1 class="page-title">Pengaturan</h1>
    <section class="panel">
      <h2>Pembaruan aplikasi</h2>
      <div class="row"><span class="row-label">${esc(buildLabel())}<small data-upd-text aria-live="polite">${esc(updateText())}</small></span>
        <button type="button" class="btn btn--primary" data-upd>${icon('refresh-cw')}<span data-upd-l>Cek pembaruan</span></button></div>
      <div class="row"><span class="row-label">Perbaiki aplikasi<small>Bila tampilan tetap versi lama atau ada yang macet. Aplikasi diunduh ulang dari internet; kemajuan, coretan, dan hasil tes tetap aman.</small></span>
        <button type="button" class="btn" data-repair>${icon('wrench')}<span>Perbaiki aplikasi</span></button></div>
    </section>
    <section class="panel">
      <h2>Suara</h2>
      ${toggle('sfx', 'Efek suara', 'Bunyi kapur, angka terbang, dan jawaban.')}
      ${toggle('music', 'Musik latar', 'Musik tenang bervolume rendah. Bawaan: mati.')}
    </section>
    <section class="panel">
      <h2>Animasi</h2>
      ${seg<Speed>('speed', 'Kecepatan animasi', s.speed, [
        [0.75, '0,75×'],
        [1, '1×'],
        [1.5, '1,5×'],
      ])}
      ${seg<MotionPref>('motion', 'Hemat gerak', s.motion, [
        ['system', 'Ikuti sistem'],
        ['reduce', 'Aktif'],
        ['full', 'Nonaktif'],
      ])}
      ${toggle('lite', 'Mode ringan', 'Mengganti animasi 3D dengan gambar 2D dan mematikan efek berat. Cocok untuk perangkat yang terasa lambat.')}
      ${toggle('classroom', 'Mode kelas', 'Huruf papan dan pop-up 20% lebih besar untuk proyektor.')}
      ${seg<Path>('defaultMode', 'Jalur pembahasan bawaan', s.defaultMode, [
        ['amati', 'Amati'],
        ['ikut', 'Ikut berpikir'],
      ])}
    </section>
    <section class="panel">
      <h2>Tanpa internet</h2>
      <div class="row"><span class="row-label">Status<small data-offline-text>${esc(offlineText())}</small></span>
        <button type="button" class="btn" data-check>${icon('wifi-off')}<span>Periksa mode offline</span></button></div>
      <div class="row"><span class="row-label">Pasang di layar utama<small>Agar bisa dibuka seperti aplikasi.</small></span>
        <button type="button" class="btn" data-install>${icon('download')}<span>Pasang di perangkat</span></button></div>
    </section>
    <section class="panel">
      <h2>Data dan bantuan</h2>
      <div class="row"><span class="row-label">Salin laporan masalah<small>Versi, perangkat, dan galat terakhir. Tanpa data pribadi.</small></span>
        <button type="button" class="btn" data-report>${icon('clipboard-copy')}<span>Salin laporan</span></button></div>
      <div class="row"><span class="row-label">Hapus semua data<small>Pengaturan, kemajuan, dan coretan di perangkat ini.</small></span>
        <button type="button" class="btn btn--danger" data-reset>${icon('trash-2')}<span>Hapus semua data</span></button></div>
      <p class="muted" data-storage-warn ${storage.healthy ? 'hidden' : ''}>Penyimpanan perangkat penuh atau diblokir. Perubahan hanya berlaku sampai halaman ditutup.</p>
      <p class="muted">${esc(buildLabel())}</p>
    </section>
  </div></div>`);

  const updText = el.querySelector<HTMLElement>('[data-upd-text]')!;
  const updBtn = el.querySelector<HTMLButtonElement>('[data-upd]')!;
  const syncUpd = (): void => {
    const ph = updateStatus().phase;
    updText.textContent = updateText();
    updBtn.disabled = ph === 'checking' || ph === 'downloading';
    el.querySelector('[data-upd-l]')!.textContent = ph === 'ready' ? 'Perbarui sekarang' : 'Cek pembaruan';
  };
  syncUpd();
  const offUpd = onUpdateStatus(syncUpd);

  el.addEventListener('click', async (e) => {
    const t = e.target as Element;
    const tg = t.closest<HTMLElement>('[data-bool]');
    if (tg) {
      const key = tg.dataset.bool as BoolKey;
      const v = !store.settings[key];
      store.updateSettings({ [key]: v } as Partial<Settings>);
      tg.setAttribute('aria-checked', String(v));
      return;
    }
    const opt = t.closest<HTMLElement>('[data-seg] [data-v]');
    if (opt) {
      const group = opt.closest<HTMLElement>('[data-seg]')!;
      const name = group.dataset.seg as 'speed' | 'motion' | 'defaultMode';
      const raw = opt.dataset.v!;
      const value = name === 'speed' ? Number(raw) : raw;
      store.updateSettings({ [name]: value } as Partial<Settings>);
      group.querySelectorAll('[data-v]').forEach((b) => b.setAttribute('aria-checked', String(b === opt)));
      return;
    }
    if (t.closest('[data-install]')) return openInstallGuide();
    if (t.closest('[data-upd]')) {
      if (updateStatus().phase === 'ready') applyUpdate();
      else void checkUpdate();
      return;
    }
    if (t.closest('[data-repair]')) {
      if (!navigator.onLine) {
        toast('Sambungkan internet dulu, lalu tekan Perbaiki aplikasi lagi.');
        return;
      }
      openSheet({
        title: 'Perbaiki aplikasi?',
        body: '<p>Paham TKA akan diunduh ulang dari internet lalu dimuat ulang. <b>Kemajuan belajar, coretan, dan hasil tes tidak terhapus.</b> Setelah itu tunggu lencana <b>Siap offline</b> muncul lagi.</p>',
        actions: [
          { label: 'Perbaiki sekarang', kind: 'primary', icon: 'wrench', onClick: () => void repairApp() },
        ],
        closeLabel: 'Batal',
      });
      return;
    }
    if (t.closest('[data-check]')) {
      const r = await checkOffline();
      openSheet({
        title: 'Periksa mode offline',
        body: r.total
          ? r.ok
            ? `<p><b>Siap offline.</b> Semua ${r.total} berkas aplikasi tersimpan di perangkat ini. Kamu bisa memakai Paham TKA dalam mode pesawat.</p>`
            : `<p><b>Belum lengkap.</b> ${r.missing} dari ${r.total} berkas belum tersimpan. Sambungkan internet, buka aplikasi sebentar, lalu periksa lagi.</p>`
          : '<p><b>Belum siap offline.</b> Buka aplikasi dari tautan kelas sambil tersambung internet, tunggu lencana <b>Siap offline</b>, lalu periksa lagi.</p>',
      });
      return;
    }
    if (t.closest('[data-report]')) {
      const text = report({
        Offline: offlineStatus().state,
        Penyimpanan: storage.healthy ? 'normal' : 'gagal',
      });
      try {
        await navigator.clipboard.writeText(text);
        toast('Laporan masalah disalin. Tempel di pesan untuk gurumu.');
      } catch {
        openSheet({ title: 'Laporan masalah', body: `<pre class="report">${esc(text)}</pre>` });
      }
      return;
    }
    if (t.closest('[data-reset]')) {
      openSheet({
        title: 'Hapus semua data?',
        body: '<p>Pengaturan, kemajuan belajar, dan coretan di perangkat ini akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>',
        actions: [
          {
            label: 'Lanjutkan',
            kind: 'danger',
            onClick: () => {
              // langkah kedua (FR-KEM-5)
              setTimeout(() => {
                openSheet({
                  title: 'Yakin menghapus?',
                  body: '<p>Data yang sudah dihapus tidak bisa dikembalikan. Tekan <b>Hapus sekarang</b> untuk melanjutkan.</p>',
                  actions: [
                    {
                      label: 'Hapus sekarang',
                      kind: 'danger',
                      icon: 'trash-2',
                      onClick: () => {
                        store.resetAll();
                        tes.reload();
                        toast('Semua data di perangkat ini sudah dihapus.');
                        location.hash = '#/';
                      },
                    },
                  ],
                  closeLabel: 'Batal',
                });
              }, 0);
            },
          },
        ],
        closeLabel: 'Batal',
      });
    }
  });

  return {
    el,
    title: 'Pengaturan',
    header: { back: { label: 'Kembali', href: '#/' } },
    footer: true,
    destroy: offUpd,
  };
}
