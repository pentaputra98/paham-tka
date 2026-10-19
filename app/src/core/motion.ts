/**
 * Adaptor gerak tunggal (PRD §13.5a): play(el, keyframes, opsi) → Kendali.
 * M0: implementasi WAAPI. M1 menambahkan pilihan Motion (vanilla) setelah uji kelayakan.
 * Setiap kendali aktif terdaftar agar mesin dapat menyelesaikan/membatalkan semuanya seketika.
 */
import { dur, reducedMotion } from './clock';
import { EASE } from './tokens';

export interface PlayOptions {
  duration: number;
  easing?: string;
  delay?: number;
  /** jangan skala dengan timeScale (mikro-interaksi antarmuka) */
  ui?: boolean;
  /** batas minimum durasi agar tetap terbaca */
  min?: number;
  fill?: FillMode;
  tag?: string;
}

export interface Kendali {
  readonly finished: Promise<boolean>;
  pause(): void;
  play(): void;
  complete(): void;
  cancel(): void;
  speed(rate: number): void;
}

const active = new Set<{ k: Kendali; tag?: string }>();

export function play(el: Element, keyframes: Keyframe[], o: PlayOptions): Kendali {
  const ms = o.ui ? (reducedMotion() ? Math.min(o.duration, 1) : o.duration) : dur(o.duration, o.min);
  const anim = el.animate(keyframes, {
    duration: Math.max(1, ms),
    easing: o.easing ?? EASE,
    delay: o.delay ? (o.ui ? o.delay : dur(o.delay)) : 0,
    fill: o.fill ?? 'none',
  });
  let settle: (ok: boolean) => void = () => undefined;
  const finished = new Promise<boolean>((r) => (settle = r));
  const rec = { k: null as unknown as Kendali, tag: o.tag };
  const k: Kendali = {
    finished,
    pause: () => anim.pause(),
    play: () => anim.play(),
    complete: () => {
      try {
        anim.finish();
      } catch {
        anim.cancel();
        settle(true);
      }
    },
    cancel: () => anim.cancel(),
    speed: (rate) => anim.updatePlaybackRate(rate),
  };
  rec.k = k;
  active.add(rec);
  anim.onfinish = () => {
    active.delete(rec);
    settle(true);
  };
  anim.oncancel = () => {
    active.delete(rec);
    settle(false);
  };
  return k;
}

/** Selesaikan seketika semua animasi aktif (opsional per tag). */
export function completeAll(tag?: string): void {
  for (const r of [...active]) if (!tag || r.tag === tag) r.k.complete();
}

export function cancelAll(tag?: string): void {
  for (const r of [...active]) if (!tag || r.tag === tag) r.k.cancel();
}

export const activeCount = (): number => active.size;
