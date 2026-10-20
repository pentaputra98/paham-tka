/**
 * Lab spike 3D soal 18 (M1 tugas 1.6) — khusus pengembangan, tidak ikut dist.
 * Mengukur fps tiap tahap, memori (20× buka-tutup), dan memperlihatkan padanan 2D.
 */
import '../styles/index.css';
import { store } from '../core/store';
import type { Ctx } from '../engine/board';
import { createDoor3d } from '../visuals/door3d';
import type { Stage } from '../visuals/door3d-scene';

const root = document.getElementById('lab3d')!;
root.className = 'bp';
Object.assign(root.style, { position: 'fixed', inset: '0' });
const ctx = (dir: 1 | -1): Ctx => ({
  run: 1,
  dir,
  seq: true,
  replay: false,
  entered: false,
  live: () => true,
});
let vis = createDoor3d();
root.append(vis.el);
vis.el.style.height = '100%';

(window as unknown as { lab3d: unknown }).lab3d = {
  stage: (s: Stage, animate = true) => vis.apply({ stage: s }, ctx(animate ? 1 : -1)),
  info: () => vis.info(),
  is2d: () => vis.el.classList.contains('is-2d'),
  canvas: () => !!vis.el.querySelector('canvas'),
  /** fps rata-rata selama ms (rAF halaman) */
  measure: (ms: number) =>
    new Promise<{ fps: number; worst: number }>((res) => {
      let n = 0;
      let worst = 0;
      let last = performance.now();
      const t0 = last;
      const f = (now: number): void => {
        n++;
        worst = Math.max(worst, now - last);
        last = now;
        if (now - t0 < ms) requestAnimationFrame(f);
        else res({ fps: (n * 1000) / (now - t0), worst });
      };
      requestAnimationFrame(f);
    }),
  setLite: (on: boolean) => store.updateSettings({ lite: on }),
  /** buka-tutup adegan n kali (cek kebocoran) */
  cycle: async (n: number) => {
    for (let i = 0; i < n; i++) {
      vis.destroy?.();
      vis.el.remove();
      vis = createDoor3d();
      root.append(vis.el);
      vis.el.style.height = '100%';
      await vis.apply({ stage: 'unroll' }, ctx(-1));
    }
    const mem = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
    return {
      heapMB: mem ? mem.usedJSHeapSize / 1048576 : null,
      canvases: document.querySelectorAll('canvas').length,
    };
  },
};
