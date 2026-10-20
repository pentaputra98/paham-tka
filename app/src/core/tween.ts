/**
 * Tween nilai (template `Ease`, `tween`, `killTween`). Kemajuan dihitung dari dt × rate(),
 * sehingga ikut kecepatan dan jeda. Hemat gerak memangkas durasi lewat `dur()`.
 */
import { dur, rate } from './clock';
import { addLoop, wake } from './loop';

export type EaseFn = (t: number) => number;
const clamp01 = (x: number): number => Math.max(0, Math.min(1, x));

export const Ease: Record<'lin' | 'io' | 'out' | 'smooth', EaseFn> = {
  lin: (t) => t,
  io: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  smooth: (t) => {
    const s = (x: number): number => 1 / (1 + Math.exp(-x));
    const k = 10;
    const e = s(-k / 2);
    return clamp01((s(k * (t - 0.5)) - e) / (1 - 2 * e));
  },
};

export interface TweenOpts {
  from: number;
  to: number;
  dur: number;
  ease?: EaseFn;
  delay?: number;
  tag?: string;
  update: (v: number, p: number) => void;
}

interface Tw extends TweenOpts {
  t: number;
  total: number;
  wait: number;
  res: (done: boolean) => void;
}

const active = new Set<Tw>();

addLoop((dt) => {
  const r = rate();
  if (!r || !active.size) return false;
  for (const tw of [...active]) {
    const step = dt * 1000 * r;
    if (tw.wait > 0) {
      tw.wait -= step;
      continue;
    }
    tw.t += step;
    const p = Math.min(1, tw.t / tw.total);
    tw.update(tw.from + (tw.to - tw.from) * (tw.ease ?? Ease.io)(p), p);
    if (p >= 1) {
      active.delete(tw);
      tw.res(true);
    }
  }
  return active.size > 0;
});

export function tween(o: TweenOpts): Promise<boolean> {
  if (o.tag) killTween(o.tag);
  return new Promise((res) => {
    active.add({ ...o, t: 0, total: dur(o.dur), wait: o.delay ? dur(o.delay) : 0, res });
    wake();
  });
}

/** Hentikan tween bertag di posisinya (seperti template). */
export function killTween(tag: string): void {
  for (const tw of [...active])
    if (tw.tag === tag) {
      active.delete(tw);
      tw.res(false);
    }
}

/** Lompat ke akhir: nilai akhir diterapkan seketika (dipakai `flush`). */
export function completeTweens(tag?: string): void {
  for (const tw of [...active])
    if (!tag || tw.tag === tag) {
      active.delete(tw);
      tw.update(tw.to, 1);
      tw.res(true);
    }
}

export const tweenCount = (): number => active.size;
