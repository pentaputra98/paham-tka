/**
 * Efek Ekspedisi TKA (v1.27): hitung mundur sebelum soal, konfeti hasil akhir, swafoto kelompok.
 * Semua gerak memakai transform/opacity (atau kanvas) dan menghormati hemat gerak.
 */
import { SND } from '../core/audio';
import { reducedMotion } from '../core/clock';
import { html } from '../core/dom';
import { play } from '../core/motion';
import { DUR, EASE_OUT } from '../core/tokens';

/** Hitung mundur besar di atas host (5…1), lalu selesai. */
export function countdown(host: HTMLElement, from = 5): Promise<void> {
  return new Promise((resolve) => {
    const el = html(
      `<div class="eks-cd" role="status" aria-live="assertive"><span class="eks-cd-n num"></span><span class="eks-cd-t">Bersiap…</span></div>`,
    );
    host.append(el);
    const n = el.querySelector<HTMLElement>('.eks-cd-n')!;
    let k = from;
    const step = (): void => {
      if (k === 0) {
        SND.count(true);
        el.remove();
        resolve();
        return;
      }
      SND.count();
      n.textContent = String(k);
      play(
        n,
        [
          { opacity: 0, transform: 'scale(1.6)' },
          { opacity: 1, transform: 'scale(1)', offset: 0.35 },
          { opacity: 0.15, transform: 'scale(.82)' },
        ],
        { duration: 950, easing: EASE_OUT, ui: true },
      );
      k--;
      window.setTimeout(step, 1000);
    };
    step();
  });
}

/** Konfeti di kanvas penuh layar (±4 detik). Warna dari token --confetti-1…5. */
export function confetti(host: HTMLElement): () => void {
  if (reducedMotion()) return () => undefined;
  const cv = document.createElement('canvas');
  cv.className = 'eks-confetti';
  cv.setAttribute('aria-hidden', 'true');
  host.append(cv);
  const ctx = cv.getContext('2d')!;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const W = (cv.width = Math.round(innerWidth * dpr));
  const H = (cv.height = Math.round(innerHeight * dpr));
  const css = getComputedStyle(host);
  const colors = [1, 2, 3, 4, 5].map((i) => css.getPropertyValue(`--confetti-${i}`).trim() || 'white');
  const parts = Array.from({ length: 160 }, (_, i) => ({
    x: (i % 2 ? 0.15 : 0.85) * W + (Math.random() - 0.5) * W * 0.2,
    y: H * 0.9,
    vx: (Math.random() - 0.5) * 9 * dpr + (i % 2 ? 3 : -3) * dpr,
    vy: -(10 + Math.random() * 9) * dpr,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    w: (6 + Math.random() * 6) * dpr,
    h: (3 + Math.random() * 4) * dpr,
    c: colors[i % colors.length]!,
  }));
  const t0 = performance.now();
  let raf = 0;
  const frame = (now: number): void => {
    const t = now - t0;
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += 0.28 * dpr;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - 3000) / 1200);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (t < 4300) raf = requestAnimationFrame(frame);
    else cv.remove();
  };
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    cv.remove();
  };
}

/** Kilatan pendek (layar memutih) saat foto diambil. */
export function flash(host: HTMLElement): void {
  const el = html('<div class="eks-flash" aria-hidden="true"></div>');
  host.append(el);
  void play(el, [{ opacity: 1 }, { opacity: 0 }], {
    duration: DUR.slow,
    ui: true,
    fill: 'forwards',
  }).finished.then(() => el.remove());
}

export interface Camera {
  video: HTMLVideoElement;
  /** potret persegi JPEG (data URL) */
  shot(size?: number): string;
  stop(): void;
}

/** Kamera depan tablet. Gagal (izin ditolak, tanpa kamera) → null. */
export async function openCamera(video: HTMLVideoElement): Promise<Camera | null> {
  if (!navigator.mediaDevices?.getUserMedia) return null;
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 960 }, height: { ideal: 720 } },
      audio: false,
    });
  } catch {
    return null;
  }
  video.srcObject = stream;
  video.muted = true;
  video.playsInline = true;
  await video.play().catch(() => undefined);
  return {
    video,
    shot(size = 320) {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const vw = video.videoWidth || size;
      const vh = video.videoHeight || size;
      const s = Math.min(vw, vh);
      const g = c.getContext('2d')!;
      // cermin, seperti yang dilihat di layar
      g.translate(size, 0);
      g.scale(-1, 1);
      g.drawImage(video, (vw - s) / 2, (vh - s) / 2, s, s, 0, 0, size, size);
      return c.toDataURL('image/jpeg', 0.8);
    },
    stop() {
      stream.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    },
  };
}
