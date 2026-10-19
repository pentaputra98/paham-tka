/**
 * Kesiapan offline (PRD §14.12): mendaftarkan service worker, menampilkan lencana
 * "Menyimpan agar bisa offline… N%" → "Siap offline", memeriksa cache, dan
 * menawarkan pembaruan lewat toast tanpa memuat ulang paksa.
 */
import { icon } from '../core/icons';
import { logError } from '../core/diag';
import { toast } from './toast';

export type OfflineState = 'unsupported' | 'idle' | 'saving' | 'ready' | 'error';

interface Status {
  state: OfflineState;
  pct: number;
  version: string | null;
}

const status: Status = { state: 'idle', pct: 0, version: null };
const listeners = new Set<(s: Readonly<Status>) => void>();
let badge: HTMLElement | null = null;
let hideTimer = 0;
/** penjaga: jangan memuat ulang saat latihan/coretan berjalan (FR-OFF-2) */
let canReload: () => boolean = () => true;

export const offlineStatus = (): Readonly<Status> => status;

export function onOfflineStatus(f: (s: Readonly<Status>) => void): () => void {
  listeners.add(f);
  return () => listeners.delete(f);
}

export function setReloadGuard(f: () => boolean): void {
  canReload = f;
}

function set(patch: Partial<Status>): void {
  Object.assign(status, patch);
  renderBadge();
  listeners.forEach((f) => f(status));
}

function renderBadge(): void {
  if (!badge) return;
  clearTimeout(hideTimer);
  const { state, pct } = status;
  badge.dataset.state = state;
  if (state === 'saving') {
    badge.hidden = false;
    badge.innerHTML = `${icon('cloud-download')}<span class="ob-text">Menyimpan agar bisa offline… ${pct}%</span><span class="bar" aria-hidden="true"><i style="--p:${pct / 100}"></i></span>`;
    badge.setAttribute('aria-label', `Menyimpan agar bisa offline, ${pct} persen`);
  } else if (state === 'ready') {
    badge.hidden = false;
    badge.innerHTML = `${icon('circle-check')}<span class="ob-text">Siap offline</span>`;
    badge.setAttribute('aria-label', 'Siap offline');
    hideTimer = window.setTimeout(() => {
      if (badge) badge.hidden = true;
    }, 4000);
  } else if (state === 'error') {
    badge.hidden = false;
    badge.innerHTML = `${icon('wifi-off')}<span class="ob-text">Belum siap offline. Sambungkan internet sekali lagi.</span>`;
    badge.setAttribute('aria-label', 'Belum siap offline. Sambungkan internet sekali lagi.');
  } else {
    badge.hidden = true;
  }
}

export function mountBadge(el: HTMLElement): void {
  badge = el;
  // lencana "Siap offline" yang sudah tampil tidak diulang saat ganti halaman
  const keep = status.state === 'ready' ? 'idle' : status.state;
  if (keep !== status.state) badge.hidden = true;
  else renderBadge();
}

const supported = (): boolean =>
  'serviceWorker' in navigator &&
  'caches' in window &&
  (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1');

/** Tanya SW apakah semua aset ada di cache. */
export async function checkOffline(): Promise<{
  ok: boolean;
  total: number;
  missing: number;
  version: string | null;
}> {
  if (!supported()) return { ok: false, total: 0, missing: 0, version: null };
  const reg = await navigator.serviceWorker.getRegistration();
  const sw = reg?.active;
  if (!sw) return { ok: false, total: 0, missing: 0, version: null };
  const res = await new Promise<{ total: number; missing: string[]; version: string } | null>((resolve) => {
    const ch = new MessageChannel();
    const t = setTimeout(() => resolve(null), 8000);
    ch.port1.onmessage = (e: MessageEvent<{ total: number; missing: string[]; version: string }>) => {
      clearTimeout(t);
      resolve(e.data);
    };
    sw.postMessage({ type: 'CHECK' }, [ch.port2]);
  });
  if (!res) return { ok: false, total: 0, missing: 0, version: null };
  return {
    ok: res.missing.length === 0,
    total: res.total,
    missing: res.missing.length,
    version: res.version,
  };
}

function offerUpdate(reg: ServiceWorkerRegistration): void {
  const waiting = reg.waiting;
  if (!waiting || !navigator.serviceWorker.controller) return;
  toast('Versi baru tersedia. Muat ulang?', {
    duration: 0,
    action: {
      label: 'Muat ulang',
      onClick: () => {
        if (!canReload()) {
          toast('Selesaikan latihan atau coretanmu dulu, lalu muat ulang dari Pengaturan.');
          return;
        }
        waiting.postMessage({ type: 'SKIP_WAITING' });
      },
    },
  });
}

export async function startOffline(): Promise<void> {
  if (!supported() || !import.meta.env.PROD) {
    set({ state: 'unsupported' });
    return;
  }
  const hadController = !!navigator.serviceWorker.controller;

  navigator.serviceWorker.addEventListener('message', (e: MessageEvent) => {
    const d = e.data as {
      type?: string;
      done?: number;
      total?: number;
      version?: string;
      isUpdate?: boolean;
    } | null;
    if (!d?.type || d.isUpdate) return;
    if (d.type === 'precache-progress' && d.total) {
      set({
        state: 'saving',
        pct: Math.min(99, Math.floor(((d.done ?? 0) / d.total) * 100)),
        version: d.version ?? null,
      });
    } else if (d.type === 'precache-complete') {
      set({ state: 'ready', pct: 100, version: d.version ?? null });
      void navigator.storage?.persist?.().catch(() => undefined);
    } else if (d.type === 'precache-error') {
      set({ state: 'error' });
    }
  });

  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloading) return;
    reloading = true;
    location.reload();
  });

  try {
    const reg = await navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' });
    if (reg.waiting) offerUpdate(reg);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed') offerUpdate(reg);
      });
    });
    if (hadController) {
      const c = await checkOffline();
      set({ state: c.ok ? 'idle' : 'error', pct: c.ok ? 100 : 0, version: c.version });
    } else if (!reg.installing && reg.active) {
      const c = await checkOffline();
      set({ state: c.ok ? 'ready' : 'error', version: c.version });
    } else {
      set({ state: 'saving', pct: 0 });
    }
    // periksa pembaruan saat aplikasi kembali terlihat
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') void reg.update().catch(() => undefined);
    });
  } catch (err) {
    logError(`sw: ${String(err)}`);
    set({ state: 'error' });
  }
}
