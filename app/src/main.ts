/** Bootstrap Paham TKA: gaya, keadaan, shell, router, offline. */
import 'katex/dist/katex-swap.min.css';
import './styles/index.css';

import { watchMotion } from './core/clock';
import { logError } from './core/diag';
import { report } from './core/diag';
import { store } from './core/store';
import { aboutPage, progressPage } from './pages/info';
import { detailPage } from './pages/detail';
import { homePage } from './pages/home';
import { settingsPage } from './pages/settings';
import { startShell } from './shell/app';
import { captureInstallPrompt, maybeShowInstallGuide } from './shell/install';
import { startOffline } from './shell/offline';
import { mountRotate } from './shell/rotate';
import { openSheet } from './shell/sheet';

// pembatas galat global: lembar ramah, sekali per sesi (PRD §14.8)
let errorShown = false;
function onFatal(msg: string): void {
  logError(msg);
  if (errorShown) return;
  errorShown = true;
  openSheet({
    title: 'Ada yang tidak berjalan',
    body: '<p>Ada yang tidak berjalan. Muat ulang halaman. Kemajuanmu tetap tersimpan.</p>',
    actions: [
      { label: 'Muat ulang', kind: 'primary', onClick: () => location.reload() },
      {
        label: 'Salin laporan masalah',
        onClick: async () => {
          await navigator.clipboard?.writeText(report()).catch(() => undefined);
          return false;
        },
      },
    ],
    closeLabel: 'Tutup',
  });
}
window.addEventListener('error', (e) => onFatal(`${e.message} @${e.filename}:${e.lineno}`));
window.addEventListener('unhandledrejection', (e) => onFatal(`promise: ${String(e.reason)}`));

watchMotion();
const applyClassroom = (): void => {
  document.documentElement.classList.toggle('is-classroom', store.settings.classroom);
};
applyClassroom();
store.subscribe('settings', applyClassroom);

captureInstallPrompt();
mountRotate();
startShell({
  home: homePage,
  detail: detailPage,
  kemajuan: progressPage,
  pengaturan: settingsPage,
  tentang: aboutPage,
});
void startOffline();
maybeShowInstallGuide(store.countVisit());
