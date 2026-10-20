/**
 * Satu requestAnimationFrame untuk seluruh aplikasi (PRD §9.1 core/loop, template `raf`/`LOOPS`).
 * Hemat daya: setiap fungsi loop mengembalikan `true` bila masih punya pekerjaan; bila semuanya diam,
 * rAF berhenti dan baru berjalan lagi setelah `wake()` (dipanggil oleh sleep/tween/perubahan laju).
 * Berhenti juga saat tab tersembunyi; dt dibatasi 50 ms agar lompatan tidak merusak animasi.
 */
export type LoopFn = (dt: number, now: number) => boolean;

const loops = new Set<LoopFn>();
let running = false;
let last = 0;
let rafId = 0;

function frame(now: number): void {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  let busy = false;
  for (const f of [...loops]) {
    try {
      if (f(dt, now)) busy = true;
    } catch (e) {
      console.error(e);
    }
  }
  if (busy && !document.hidden) rafId = requestAnimationFrame(frame);
  else running = false;
}

/** Jalankan rAF bila belum berjalan (aman dipanggil berkali-kali). */
export function wake(): void {
  if (running || document.hidden) return;
  running = true;
  last = performance.now();
  rafId = requestAnimationFrame(frame);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    running = false;
    cancelAnimationFrame(rafId);
  } else wake();
});

export function addLoop(f: LoopFn): () => void {
  loops.add(f);
  wake();
  return () => loops.delete(f);
}

export const loopRunning = (): boolean => running;
