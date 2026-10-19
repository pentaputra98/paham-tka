/**
 * Satu requestAnimationFrame untuk seluruh aplikasi (PRD §9.1 core/loop, template `raf`/`LOOPS`).
 * Berhenti saat tab tersembunyi; dt dibatasi 50 ms agar lompatan tidak merusak animasi.
 */
export type LoopFn = (dt: number, now: number) => void;

const loops = new Set<LoopFn>();
let running = false;
let last = 0;
let rafId = 0;

function frame(now: number): void {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  for (const f of [...loops]) {
    try {
      f(dt, now);
    } catch (e) {
      console.error(e);
    }
  }
  rafId = requestAnimationFrame(frame);
}

function start(): void {
  if (running || document.hidden) return;
  running = true;
  last = performance.now();
  rafId = requestAnimationFrame(frame);
}

function stop(): void {
  running = false;
  cancelAnimationFrame(rafId);
}

document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

export function addLoop(f: LoopFn): () => void {
  loops.add(f);
  start();
  return () => loops.delete(f);
}

export const loopCount = (): number => loops.size;
