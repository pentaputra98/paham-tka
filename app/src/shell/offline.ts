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

export function mountBadge(el: HTMLElement, upEl?: HTMLButtonElement | null): void {
  badge = el;
  updBadge = upEl ?? null;
  if (updBadge) {
    updBadge.addEventListener('click', () => void applyUpdate());
    renderUpdBadge();
  }
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

// ---------------------------------------------------------------------------------------------
// Pembaruan (revisi 1.25): aplikasi terpasang dulu baru berganti versi bila semua jendelanya ditutup,
// padahal di HP aplikasi jarang benar-benar tertutup. Kini versi baru dipasang otomatis saat aplikasi
// baru dibuka, saat kembali dari latar belakang, atau saat siswa membuka Beranda; di halaman lain muncul
// tombol "Perbarui" di header. Pengaturan punya "Cek pembaruan" dan "Perbaiki aplikasi" (unduh ulang).
// ---------------------------------------------------------------------------------------------
export type UpdatePhase =
  'idle' | 'checking' | 'downloading' | 'ready' | 'latest' | 'offline' | 'error' | 'unsupported';

interface UpdateStatus {
  phase: UpdatePhase;
  pct: number;
  checkedAt: number | null;
}

const upd: UpdateStatus = { phase: 'idle', pct: 0, checkedAt: null };
const updListeners = new Set<(s: Readonly<UpdateStatus>) => void>();
let updBadge: HTMLButtonElement | null = null;
let registration: ServiceWorkerRegistration | null = null;
let applying = false;
let offered = false;
const bootAt = Date.now();
/** jendela "baru dibuka": pembaruan yang siap dalam rentang ini langsung dipasang */
const BOOT_WINDOW_MS = 15000;
/** kembali dari latar belakang setelah selama ini dianggap membuka ulang aplikasi */
const RESUME_MS = 60000;
let hiddenAt = 0;

export const updateStatus = (): Readonly<UpdateStatus> => upd;

export function onUpdateStatus(f: (s: Readonly<UpdateStatus>) => void): () => void {
  updListeners.add(f);
  return () => updListeners.delete(f);
}

function setUpd(patch: Partial<UpdateStatus>): void {
  Object.assign(upd, patch);
  renderUpdBadge();
  updListeners.forEach((f) => f(upd));
}

function renderUpdBadge(): void {
  if (!updBadge) return;
  const on = upd.phase === 'ready';
  updBadge.hidden = !on;
  if (on) updBadge.innerHTML = `${icon('refresh-cw')}<span class="btn-label">Perbarui aplikasi</span>`;
}

/** Halaman tempat memuat ulang tidak memutus apa pun (tes tetap tersimpan, tetapi tidak dimuat ulang tiba-tiba). */
function safeRoute(): boolean {
  const h = location.hash.replace(/\?.*$/, '');
  return (
    h === '' ||
    h === '#' ||
    h === '#/' ||
    h === '#/tes' ||
    h === '#/tes/hasil' ||
    h === '#/tes/riwayat' ||
    h === '#/pengaturan' ||
    h === '#/tentang' ||
    h === '#/kemajuan'
  );
}

/** Pasang versi yang menunggu: SW baru mengambil alih → controllerchange → muat ulang. */
export function applyUpdate(): boolean {
  const waiting = registration?.waiting;
  if (!waiting || applying) return false;
  if (!canReload()) {
    toast('Selesaikan latihan atau coretanmu dulu, lalu tekan Perbarui aplikasi.');
    return false;
  }
  applying = true;
  document.body.append(
    Object.assign(document.createElement('div'), {
      className: 'upd-veil',
      role: 'status',
      innerHTML: `<span class="upd-veil-c">${icon('refresh-cw')}<span>Memasang versi terbaru…</span></span>`,
    }),
  );
  waiting.postMessage({ type: 'SKIP_WAITING' });
  // cadangan bila controllerchange tidak datang (mis. halaman tidak dikendalikan SW)
  setTimeout(() => location.reload(), 4000);
  return true;
}

function onReady(reg: ServiceWorkerRegistration): void {
  if (!reg.waiting || !navigator.serviceWorker.controller) return;
  setUpd({ phase: 'ready', pct: 100 });
  const fresh = Date.now() - bootAt < BOOT_WINDOW_MS;
  if ((fresh || safeRoute()) && applyUpdate()) return;
  if (offered) return;
  offered = true;
  toast('Versi baru Paham TKA sudah siap.', {
    duration: 8000,
    action: { label: 'Perbarui', onClick: () => void applyUpdate() },
  });
}

async function readManifestVersion(): Promise<string | null> {
  try {
    const r = await fetch('./precache-manifest.json', { cache: 'no-store' });
    if (!r.ok) return null;
    return ((await r.json()) as { version?: string }).version ?? null;
  } catch {
    return null;
  }
}

/** Tunggu SW yang sedang dipasang selesai (siap menunggu) atau gagal. */
function settle(reg: ServiceWorkerRegistration): Promise<UpdatePhase> {
  return new Promise((resolve) => {
    const sw = reg.installing;
    if (!sw) return resolve(reg.waiting ? 'ready' : 'latest');
    sw.addEventListener('statechange', () => {
      if (sw.state === 'installed') resolve('ready');
      else if (sw.state === 'redundant') resolve('error');
    });
  });
}

/** Cek pembaruan sekarang (tombol di Pengaturan, saat dibuka, dan berkala). */
export async function checkUpdate(): Promise<UpdatePhase> {
  if (!supported() || !import.meta.env.PROD || !registration) {
    setUpd({ phase: 'unsupported' });
    return 'unsupported';
  }
  const reg = registration;
  if (reg.waiting) {
    onReady(reg);
    return 'ready';
  }
  if (upd.phase === 'checking' || upd.phase === 'downloading') return upd.phase;
  if (!navigator.onLine) {
    setUpd({ phase: 'offline', checkedAt: Date.now() });
    return 'offline';
  }
  setUpd({ phase: 'checking', pct: 0 });
  try {
    const [remote] = await Promise.all([readManifestVersion(), reg.update()]);
    if (reg.installing || reg.waiting) {
      if (reg.installing) setUpd({ phase: 'downloading' });
      const r = await settle(reg);
      setUpd({ phase: r, checkedAt: Date.now() });
      if (r === 'ready') onReady(reg);
      return r;
    }
    const mine = status.version ?? (await checkOffline()).version;
    // versi di server berbeda tetapi peramban belum melihatnya: coba sekali lagi tanpa cache
    if (remote && mine && remote !== mine) {
      await reg.update();
      if (reg.installing || reg.waiting) {
        setUpd({ phase: 'downloading' });
        const r = await settle(reg);
        setUpd({ phase: r, checkedAt: Date.now() });
        if (r === 'ready') onReady(reg);
        return r;
      }
    }
    setUpd({ phase: remote || mine ? 'latest' : 'offline', checkedAt: Date.now() });
    return upd.phase;
  } catch (err) {
    logError(`update: ${String(err)}`);
    setUpd({ phase: navigator.onLine ? 'error' : 'offline', checkedAt: Date.now() });
    return upd.phase;
  }
}

/**
 * Jalan terakhir bila aplikasi tetap tampil versi lama: lepas service worker dan cache aplikasi, lalu
 * muat ulang dari internet. Kemajuan, coretan, dan hasil tes (localStorage) tidak tersentuh.
 */
export async function repairApp(): Promise<void> {
  try {
    const regs = (await navigator.serviceWorker?.getRegistrations?.()) ?? [];
    await Promise.all(regs.map((r) => r.unregister()));
    const keys = (await caches?.keys?.()) ?? [];
    await Promise.all(keys.filter((k) => k.startsWith('pahamtka-')).map((k) => caches.delete(k)));
  } catch (err) {
    logError(`repair: ${String(err)}`);
  }
  location.reload();
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
    if (!d?.type) return;
    if (d.isUpdate) {
      if (d.type === 'precache-progress' && d.total)
        setUpd({ phase: 'downloading', pct: Math.min(99, Math.floor(((d.done ?? 0) / d.total) * 100)) });
      return;
    }
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
    registration = reg;
    if (reg.waiting) onReady(reg);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (hadController) setUpd({ phase: 'downloading', pct: 0 });
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed') onReady(reg);
        else if (nw.state === 'redundant' && upd.phase === 'downloading') setUpd({ phase: 'error' });
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
    // periksa pembaruan saat dibuka, saat kembali terlihat, dan tiap 15 menit selama terbuka
    if (hadController && !reg.waiting) void checkUpdate();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now();
        return;
      }
      // lama di latar belakang = seperti membuka ulang: pembaruan yang sudah siap langsung dipasang
      const resumed = hiddenAt > 0 && Date.now() - hiddenAt > RESUME_MS;
      if (reg.waiting && resumed && (safeRoute() || location.hash.startsWith('#/tes/kerjakan'))) {
        applyUpdate();
        return;
      }
      void checkUpdate();
    });
    window.setInterval(() => {
      if (document.visibilityState === 'visible') void checkUpdate();
    }, 15 * 60000);
    // pembaruan yang menunggu dipasang saat siswa kembali ke Beranda
    window.addEventListener('hashchange', () => {
      if (reg.waiting && safeRoute()) applyUpdate();
    });
  } catch (err) {
    logError(`sw: ${String(err)}`);
    set({ state: 'error' });
  }
}
