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
  // pendaran sumber (dipicu ulang). Kelasnya dilepas begitu animasi selesai/batal: bila tertinggal, pendaran
  // terulang setiap kali kertas soal tampil lagi (revisi pemilik v1.22). Sumber yang terpatah ke beberapa baris
  // tidak diberi pendaran karena kotaknya tidak membungkus teks dengan benar.
  from.classList.remove('src-glow');
  if (from.getClientRects().length <= 1) {
    void (from as HTMLElement).offsetWidth;
    from.classList.add('src-glow');
    const off = (): void => from.classList.remove('src-glow');
    from.addEventListener('animationend', off, { once: true });
    from.addEventListener('animationcancel', off, { once: true });
  }
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

/** Sumber hanya dipakai bila benar-benar terlihat di layar (template visibleEnough). */
export function visibleEnough(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) return false;
  if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false;
  if (el.closest('.tk.hid')) return false;
  const hidden = el.closest<HTMLElement>('[hidden], .is-hidden');
  if (hidden) return false;
  const lines = el.closest('.bd-lines');
  if (lines) {
    const lr = lines.getBoundingClientRect();
    if (r.bottom < lr.top || r.top > lr.bottom) return false;
  }
  return getComputedStyle(el).visibility !== 'hidden';
}
