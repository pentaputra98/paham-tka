/** Layar penuh dan kunci landscape (FR-ORI-2); best-effort, iOS memutar sendiri. */
type FsDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};
type FsEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };
type LockableOrientation = ScreenOrientation & { lock?: (o: string) => Promise<void> };

export const isFullscreen = (): boolean => {
  const d = document as FsDoc;
  return !!(d.fullscreenElement ?? d.webkitFullscreenElement);
};

export const canFullscreen = (): boolean => {
  const el = document.documentElement as FsEl;
  return typeof el.requestFullscreen === 'function' || typeof el.webkitRequestFullscreen === 'function';
};

async function lockLandscapeOnly(): Promise<void> {
  try {
    await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape');
  } catch {
    /* tidak didukung (iOS, desktop) */
  }
}

export async function enterFullscreenLandscape(): Promise<void> {
  const el = document.documentElement as FsEl;
  try {
    if (!isFullscreen()) await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.());
  } catch {
    /* ditolak peramban */
  }
  await lockLandscapeOnly();
}

export async function toggleFullscreen(): Promise<void> {
  const d = document as FsDoc;
  if (isFullscreen()) {
    try {
      await (d.exitFullscreen?.() ?? d.webkitExitFullscreen?.());
    } catch {
      /* diabaikan */
    }
  } else {
    await enterFullscreenLandscape();
  }
}

export function onFullscreenChange(f: (on: boolean) => void): void {
  for (const ev of ['fullscreenchange', 'webkitfullscreenchange'])
    document.addEventListener(ev, () => f(isFullscreen()));
}

export const isStandalone = (): boolean =>
  matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

export const isIOS = (): boolean =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
