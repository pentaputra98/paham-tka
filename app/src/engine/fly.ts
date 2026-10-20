/**
 * Penerbangan token, tanda khas "angka terbang" (pembahasan.md §8; template B.fly).
 * Klon slot tujuan diletakkan tetap di posisi tujuan lalu dianimasikan dari sumber lewat lengkung
 * halus (hanya transform/opacity). Durasi 480–860 ms mengikuti jarak, laju ikut kecepatan siswa.
 * Dipakai bersama oleh papan tulis dan hero beranda.
 */
import { play, type Kendali } from '../core/motion';
import { DUR, EASE } from '../core/tokens';

export interface FlyOptions {
  tag: string;
  /** skala awal klon mengikuti tinggi sumber (papan) */
  scaleFromSource?: boolean;
}

export function flyClone(from: Element, to: HTMLElement, o: FlyOptions): { g: HTMLElement; k: Kendali } {
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const g = to.cloneNode(true) as HTMLElement;
  g.classList.remove('hid');
  g.classList.add('fly-tok');
  Object.assign(g.style, {
    left: `${b.left}px`,
    top: `${b.top}px`,
    width: `${b.width}px`,
    height: `${b.height}px`,
    margin: '0',
    visibility: 'visible',
    fontSize: getComputedStyle(to).fontSize,
  });
  document.body.append(g);
  // pendaran sumber (dipicu ulang)
  from.classList.remove('src-glow');
  void (from as HTMLElement).offsetWidth;
  from.classList.add('src-glow');
  const dx = a.left + a.width / 2 - (b.left + b.width / 2);
  const dy = a.top + a.height / 2 - (b.top + b.height / 2);
  const sc = o.scaleFromSource ? Math.max(0.6, Math.min(1.5, a.height / Math.max(b.height, 1))) : 0.9;
  const dist = Math.hypot(dx, dy);
  const arc = Math.min(80, dist * 0.22);
  const k = play(
    g,
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${sc})`, opacity: 0.85 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.5 - arc}px) scale(${(sc + 1.15) / 2})`,
        opacity: 1,
        offset: 0.5,
      },
      { transform: 'none', opacity: 1 },
    ],
    { duration: Math.max(DUR.flyMin, Math.min(DUR.flyMax, dist * 0.95)), easing: EASE, tag: o.tag },
  );
  return { g, k };
}
