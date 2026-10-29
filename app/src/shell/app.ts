/**
 * Shell aplikasi: header, area utama, kaki halaman, transisi rute terarah (maju ke kiri,
 * mundur ke kanan), fokus pindah ke kepala halaman setiap rute berubah (PRD §14.4).
 */
import { esc, html, pad2 } from '../core/dom';
import { icon } from '../core/icons';
import { play } from '../core/motion';
import { DUR, EASE_OUT, SLIDE_PX } from '../core/tokens';
import { isFullscreen, onFullscreenChange, toggleFullscreen, canFullscreen } from '../core/fullscreen';
import { getSoal, isReady, SOON_MESSAGE } from '../content';
import { createRouter, type Route } from '../router/router';
import { mountBadge } from './offline';
import { openSheet, closeSheet, isSheetOpen } from './sheet';
import { initTooltips } from './tooltip';
import { wordmark } from './wordmark';

export interface HeaderSpec {
  /** tombol kembali; tanpa ini header menampilkan wordmark */
  back?: { label: string; href: string };
  /** blok judul gambar teknik */
  block?: { k: string; n: string; t: string };
  /** tampilkan tombol Kemajuan berlabel */
  progress?: boolean;
  /** kontrol tambahan khusus halaman (HTML tepercaya), disisipkan sebelum Pengaturan */
  extra?: string;
}

export interface PageView {
  el: HTMLElement;
  title: string;
  header: HeaderSpec;
  footer?: boolean;
  destroy?: () => void;
  /** alamat untuk tombol Muat ulang (mis. bagian dan langkah pembahasan yang sedang tampil) */
  refreshHash?: () => string;
}

export type PageFactory = (route: Route) => PageView;

const COPYRIGHT = '© 2026 Penta Putra Purnomo, S.Pd., Gr. | SMA Vidatra Bontang';

let pages: Partial<Record<Route['name'], PageFactory>> = {};
let current: PageView | null = null;
let router: ReturnType<typeof createRouter>;

export const navigate = (hash: string, opts?: { replace?: boolean }): void => router.go(hash, opts);
export const currentRoute = (): Route => router.current();

/**
 * home = tampilkan tombol Beranda (ikon rumah) di tengah header; semua halaman selain beranda.
 * Di sampingnya tombol Muat ulang: memasang ulang halaman aktif tanpa memuat ulang peramban (layar penuh tetap).
 */
function headerHtml(h: HeaderSpec, home: boolean): string {
  const left = h.back
    ? `<a class="btn top-back" href="${esc(h.back.href)}">${icon('arrow-left')}<span class="btn-label">${esc(h.back.label)}</span></a>`
    : `<a class="brand" href="#/">${wordmark()}<span class="brand-sub">Pembahasan TKA Mat. Lanjut 2025</span></a>`;
  const block = h.block
    ? `<div class="tblock" aria-live="polite"><span class="tb-k">${esc(h.block.k)}</span><span class="tb-n">${esc(h.block.n)}</span><span class="tb-t">${esc(h.block.t)}</span></div>`
    : '';
  const fs = canFullscreen()
    ? `<button class="icon-btn" type="button" data-act="fs" aria-label="${isFullscreen() ? 'Keluar dari layar penuh' : 'Layar penuh'}" title="Layar penuh (F)">${icon(isFullscreen() ? 'minimize' : 'maximize')}</button>`
    : '';
  const homeBtn = `<div class="top-mid">${
    home
      ? `<a class="icon-btn top-home" href="#/" aria-label="Beranda" title="Beranda">${icon('house')}</a>`
      : ''
  }<button type="button" class="icon-btn top-refresh" data-act="refresh" aria-label="Muat ulang halaman ini" title="Muat ulang halaman ini">${icon('refresh-cw')}</button></div>`;
  // kelompok kiri dan kanan sama lebar (flex 1 1 0) → tombol Beranda tepat di tengah layar; bila kontrol kanan
  // lebih lebar dari separuh, tombol bergeser sedikit (tidak pernah menimpa), judul blok kiri yang dipangkas
  return `<div class="top-side">${left}${block}</div>${homeBtn}
    <div class="top-side top-side--end"><div class="top-ctrls">
      <span class="offline-badge" data-offline-badge hidden></span>
      <button type="button" class="btn upd-badge" data-update-badge hidden></button>
      ${h.extra ?? ''}
      ${h.progress ? `<a class="btn" href="#/kemajuan">${icon('list-checks')}<span class="btn-label">Kemajuan</span></a>` : ''}
      <a class="icon-btn" href="#/pengaturan" aria-label="Pengaturan" title="Pengaturan">${icon('settings')}</a>
      ${fs}
    </div></div>`;
}

function footerHtml(): string {
  return `<span class="foot-copy">${esc(COPYRIGHT)}</span>
    <a class="foot-about" href="#/tentang">${icon('info')}<span>Tentang aplikasi</span><span class="foot-ver num">v${esc(__APP_VERSION__)}</span></a>`;
}

function showSoonSheet(no: number): void {
  const s = getSoal(no);
  openSheet({
    title: s ? `Soal ${pad2(no)} · Segera hadir` : 'Segera hadir',
    body: `<p>${esc(SOON_MESSAGE)}</p>`,
    closeLabel: 'Mengerti',
  });
}

export { showSoonSheet };

function render(route: Route, prev: Route | null): void {
  // soal "Segera hadir" tidak dapat dibuka lewat URL (FR-HOME-1 KP)
  if (route.no !== undefined && !isReady(route.no)) {
    navigate('#/', { replace: true });
    showSoonSheet(route.no);
    return;
  }
  const factory = pages[route.name] ?? pages.home!;
  if (isSheetOpen()) closeSheet();
  const top = document.querySelector<HTMLElement>('.top')!;
  const main = document.querySelector<HTMLElement>('#main')!;
  const foot = document.querySelector<HTMLElement>('.foot')!;

  const next = factory(route);
  const old = current;
  current = next;

  top.innerHTML = headerHtml(next.header, route.name !== 'home');
  const badge = top.querySelector<HTMLElement>('[data-offline-badge]');
  if (badge) mountBadge(badge, top.querySelector<HTMLButtonElement>('[data-update-badge]'));
  foot.innerHTML = footerHtml();
  foot.hidden = next.footer === false;
  document.title = next.title ? `${next.title} · Paham TKA` : 'Paham TKA';

  old?.destroy?.();
  main.replaceChildren(next.el);

  if (prev && prev.name !== route.name) {
    const dir = route.depth >= prev.depth ? 1 : -1;
    play(
      next.el,
      [
        { opacity: 0, transform: `translateX(${dir * SLIDE_PX}px)` },
        { opacity: 1, transform: 'none' },
      ],
      {
        duration: DUR.slow,
        easing: EASE_OUT,
        ui: true,
      },
    );
    // fokus ke kepala halaman untuk pembaca layar
    const h1 = next.el.querySelector<HTMLElement>('h1');
    (h1 ?? main).setAttribute('tabindex', '-1');
    (h1 ?? main).focus({ preventScroll: true });
  }
}

/**
 * Muat ulang halaman aktif: halaman dibuat ulang dari rutenya (atau dari alamat yang diberikan halaman, mis.
 * bagian dan langkah pembahasan saat ini). Tanpa location.reload(), sehingga layar penuh tidak keluar.
 */
function refreshPage(): void {
  const hash = current?.refreshHash?.() ?? (location.hash || '#/');
  navigate(hash, { replace: true });
}

export function startShell(registry: Partial<Record<Route['name'], PageFactory>>): void {
  pages = registry;
  const app = document.getElementById('app')!;
  app.replaceChildren(
    html('<header class="top"></header>'),
    html('<main class="main" id="main" tabindex="-1"></main>'),
    html('<footer class="foot"></footer>'),
  );
  app.addEventListener('click', (e) => {
    const t = (e.target as Element).closest<HTMLElement>('[data-act="fs"], [data-act="refresh"]');
    if (t?.dataset.act === 'fs') void toggleFullscreen();
    else if (t) refreshPage();
  });
  onFullscreenChange((on) => {
    const b = document.querySelector<HTMLElement>('[data-act="fs"]');
    if (!b) return;
    b.innerHTML = icon(on ? 'minimize' : 'maximize');
    b.setAttribute('aria-label', on ? 'Keluar dari layar penuh' : 'Layar penuh');
  });
  initTooltips();
  router = createRouter(render);
  router.start();
}
