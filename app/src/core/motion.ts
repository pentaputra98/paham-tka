/**
 * Adaptor gerak tunggal (PRD §13.5a, K21): play(el, keyframes, opsi) → Kendali.
 * Dua implementasi dengan perilaku sama: 'motion' (paket motion/mini, vanilla) dan 'waapi'
 * (Web Animations API bawaan). Bawaan ditetapkan oleh uji kelayakan (docs/keputusan-motion.md).
 *
 * Prinsip (skill motion-framer, bagian JavaScript murni):
 *  - hanya transform / opacity / clip-path;
 *  - durasi dasar dari `dur()` (hemat gerak), kecepatan siswa sebagai playbackRate → ubah
 *    kecepatan di tengah gerak tanpa lompatan; jeda global = laju 0;
 *  - setiap kendali terdaftar, sehingga mesin dapat complete()/cancel() semuanya seketika.
 */
import { dur, onRate, rate, reducedMotion } from './clock';
import { EASE } from './tokens';

export type Backend = 'motion' | 'waapi';

/**
 * Bawaan hasil uji kelayakan M1: WAAPI + tween (docs/keputusan-motion.md).
 * Motion (motion/mini) dimuat malas hanya bila dipilih, agar tidak menambah bobot awal.
 */
let backend: Backend = 'waapi';
let motionAnimate: (typeof import('motion/mini'))['animate'] | null = null;

export const getBackend = (): Backend => (backend === 'motion' && motionAnimate ? 'motion' : 'waapi');
export async function setBackend(b: Backend): Promise<void> {
  if (b === 'motion' && !motionAnimate) motionAnimate = (await import('motion/mini')).animate;
  backend = b;
}

export interface PlayOptions {
  duration: number;
  easing?: string;
  delay?: number;
  /** mikro-interaksi antarmuka: tidak ikut kecepatan siswa (tetap ikut hemat gerak) */
  ui?: boolean;
  fill?: FillMode;
  tag?: string;
}

export interface Kendali {
  readonly finished: Promise<boolean>;
  pause(): void;
  play(): void;
  /** selesaikan seketika: keadaan akhir diterapkan */
  complete(): void;
  /** batalkan: kembali ke keadaan sebelum animasi */
  cancel(): void;
  /** atur laju (kecepatan siswa) */
  rate(r: number): void;
}

interface Rec {
  k: Kendali;
  tag?: string;
  ui: boolean;
}
const active = new Set<Rec>();

// kecepatan/jeda global berlaku juga untuk animasi yang sedang berjalan
onRate((r) => {
  for (const rec of active) if (!rec.ui) rec.k.rate(r);
});

/** Ubah daftar keyframe WAAPI menjadi bentuk objek Motion ({prop: [..]}, times). */
function toMotionFrames(frames: Keyframe[]): {
  kf: Record<string, Array<string | number>>;
  times?: number[];
} {
  const kf: Record<string, Array<string | number>> = {};
  const props = new Set<string>();
  for (const f of frames) for (const k of Object.keys(f)) if (k !== 'offset' && k !== 'easing') props.add(k);
  let lastVal: Record<string, string | number> = {};
  for (const f of frames) {
    for (const p of props) {
      const v = (f as Record<string, string | number | undefined>)[p] ?? lastVal[p];
      (kf[p] ??= []).push(v ?? (p === 'opacity' ? 1 : 'none'));
    }
    lastVal = { ...lastVal, ...(f as Record<string, string | number>) };
  }
  const hasOffsets = frames.some((f) => typeof f.offset === 'number');
  const times = hasOffsets
    ? frames.map((f, i) => (typeof f.offset === 'number' ? f.offset : i / Math.max(1, frames.length - 1)))
    : undefined;
  return { kf, times };
}

/** cubic-bezier(a, b, c, d) → [a, b, c, d] untuk Motion. */
function bezier(e: string): [number, number, number, number] | string {
  const m = /cubic-bezier\(([^)]+)\)/.exec(e);
  if (!m) return e;
  const n = m[1]!.split(',').map(Number);
  return n.length === 4 ? (n as [number, number, number, number]) : e;
}

function viaWaapi(
  el: Element,
  frames: Keyframe[],
  ms: number,
  delay: number,
  o: PlayOptions,
  r: number,
): Kendali {
  const anim = el.animate(frames, { duration: ms, delay, easing: o.easing ?? EASE, fill: o.fill ?? 'none' });
  anim.playbackRate = r || 1;
  if (!r) anim.pause();
  let settle: (ok: boolean) => void = () => undefined;
  const finished = new Promise<boolean>((res) => (settle = res));
  anim.onfinish = () => settle(true);
  anim.oncancel = () => settle(false);
  return {
    finished,
    pause: () => anim.pause(),
    play: () => anim.play(),
    complete: () => {
      try {
        anim.finish();
      } catch {
        anim.cancel();
      }
    },
    cancel: () => anim.cancel(),
    rate: (x) => {
      if (x <= 0) anim.pause();
      else {
        anim.updatePlaybackRate(x);
        if (anim.playState === 'paused') anim.play();
      }
    },
  };
}

function viaMotion(
  el: Element,
  frames: Keyframe[],
  ms: number,
  delay: number,
  o: PlayOptions,
  r: number,
): Kendali {
  const { kf, times } = toMotionFrames(frames);
  const controls = motionAnimate!(el, kf as never, {
    duration: ms / 1000,
    delay: delay / 1000,
    ease: bezier(o.easing ?? EASE) as never,
    ...(times ? { times } : {}),
  });
  controls.speed = r || 1;
  if (!r) controls.pause();
  let done = false;
  let settle: (ok: boolean) => void = () => undefined;
  const finished = new Promise<boolean>((res) => (settle = res));
  controls.finished.then(
    () => {
      done = true;
      // tanpa fill: kembalikan ke gaya awal seperti WAAPI fill 'none'
      if ((o.fill ?? 'none') === 'none')
        for (const p of Object.keys(kf)) (el as HTMLElement).style.removeProperty(p);
      settle(true);
    },
    () => settle(false),
  );
  return {
    finished,
    pause: () => controls.pause(),
    play: () => controls.play(),
    complete: () => {
      if (!done) controls.complete();
    },
    cancel: () => {
      controls.cancel();
      settle(false);
    },
    rate: (x) => {
      if (x <= 0) controls.pause();
      else {
        controls.speed = x;
        controls.play();
      }
    },
  };
}

export function play(el: Element, frames: Keyframe[], o: PlayOptions): Kendali {
  const ui = !!o.ui;
  const ms = Math.max(1, ui ? (reducedMotion() ? 1 : o.duration) : dur(o.duration));
  const delay = o.delay ? (ui ? o.delay : dur(o.delay)) : 0;
  const r = ui ? 1 : rate();
  const k = (getBackend() === 'motion' ? viaMotion : viaWaapi)(el, frames, ms, delay, o, r);
  const rec: Rec = { k, tag: o.tag, ui };
  active.add(rec);
  void k.finished.then(() => active.delete(rec));
  return k;
}

/** Selesaikan seketika semua animasi aktif (opsional per tag). */
export function completeAll(tag?: string): void {
  for (const r of [...active]) if (!tag || r.tag === tag) r.k.complete();
}

export function cancelAll(tag?: string): void {
  for (const r of [...active]) if (!tag || r.tag === tag) r.k.cancel();
}

export const activeCount = (tag?: string): number => [...active].filter((r) => !tag || r.tag === tag).length;
