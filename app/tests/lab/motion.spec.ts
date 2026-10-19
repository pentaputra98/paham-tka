import { writeFileSync, mkdirSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

type Lab = {
  setBackend: (b: string) => Promise<void>;
  setSpeed: (s: number) => void;
  setMotion: (m: string) => void;
  fly: (i: number, d?: number) => Promise<boolean>;
  flyAll: (d?: number) => Promise<boolean[]>;
  flySequence: (n: number) => Promise<number[]>;
  completeAll: () => void;
  activeCount: () => number;
  flyingLeft: () => number;
  hiddenTargets: () => number;
  reset: () => void;
  pos: (i: number) => { x: number; y: number } | null;
};
declare global {
  interface Window {
    lab: Lab;
  }
}

const results: Record<string, Record<string, unknown>> = {};

async function open(page: Page, backend: string): Promise<void> {
  await page.goto('./lab/motion.html');
  await page.waitForFunction(() => !!window.lab);
  await page.evaluate(async (b) => {
    localStorage.clear();
    await window.lab.setBackend(b);
    window.lab.setSpeed(1);
    window.lab.setMotion('full');
  }, backend);
  expect(await page.evaluate(() => (window.lab as unknown as { backend: () => string }).backend())).toBe(
    backend,
  );
}

for (const backend of ['motion', 'waapi']) {
  test.describe(`backend ${backend}`, () => {
    test('K1: ubah kecepatan di tengah gerak tanpa lompatan', async ({ page }) => {
      await open(page, backend);
      const r = await page.evaluate(async () => {
        const lab = window.lab;
        lab.setSpeed(0.75);
        const samples: Array<{ t: number; x: number; y: number }> = [];
        let changedAt = -1;
        const p = lab.fly(0, 1600);
        const t0 = performance.now();
        await new Promise<void>((res) => {
          const tick = (): void => {
            const q = lab.pos(0);
            if (!q) return res();
            samples.push({ t: performance.now() - t0, ...q });
            if (changedAt < 0 && performance.now() - t0 > 700) {
              lab.setSpeed(1.5);
              changedAt = samples.length;
            }
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
        await p;
        const steps = samples.slice(1).map((s, i) => Math.hypot(s.x - samples[i]!.x, s.y - samples[i]!.y));
        const before = steps.slice(Math.max(0, changedAt - 6), changedAt - 1);
        const after = steps.slice(changedAt - 1, changedAt + 2);
        const avgBefore = before.reduce((a, b) => a + b, 0) / Math.max(1, before.length);
        const maxAfter = Math.max(...after);
        return {
          frames: samples.length,
          changedAt,
          avgBefore,
          maxAfter,
          ratio: maxAfter / Math.max(0.01, avgBefore),
          maxStep: Math.max(...steps),
        };
      });
      results[backend] = { ...results[backend], k1: r };
      // laju naik 2× (0,75→1,5): langkah sesudah ≤ 3× langkah sebelum = tanpa lompatan
      expect(r.ratio).toBeLessThan(3);
    });

    test('K2: complete() menyelesaikan seketika, tidak ada token tersisa', async ({ page }) => {
      await open(page, backend);
      const r = await page.evaluate(async () => {
        const lab = window.lab;
        const p = lab.flyAll(1500);
        await new Promise((res) => setTimeout(res, 400));
        const midFlying = lab.flyingLeft();
        const t = performance.now();
        lab.completeAll();
        await p;
        await new Promise((res) => requestAnimationFrame(() => res(null)));
        return {
          midFlying,
          ms: performance.now() - t,
          flyingLeft: lab.flyingLeft(),
          hidden: lab.hiddenTargets(),
          active: lab.activeCount(),
        };
      });
      results[backend] = { ...results[backend], k2: r };
      expect(r.midFlying).toBe(24);
      expect(r.flyingLeft).toBe(0);
      expect(r.hidden).toBe(0);
      expect(r.active).toBe(0);
    });

    test('K3: fps 24 token terbang bersamaan, CPU diperlambat 4×', async ({ page }) => {
      await open(page, backend);
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      const r = await page.evaluate(async () => {
        const lab = window.lab;
        let frames = 0;
        let worst = 0;
        let last = performance.now();
        let run = true;
        const tick = (now: number): void => {
          frames++;
          worst = Math.max(worst, now - last);
          last = now;
          if (run) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        const t0 = performance.now();
        for (let k = 0; k < 3; k++) {
          lab.reset();
          await lab.flyAll(860);
        }
        run = false;
        const sec = (performance.now() - t0) / 1000;
        return { fps: frames / sec, worstFrameMs: worst, seconds: sec };
      });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
      results[backend] = { ...results[backend], k3: r };
      expect(r.fps).toBeGreaterThanOrEqual(55);
    });

    test('K5: hemat gerak memangkas durasi tanpa merusak urutan', async ({ page }) => {
      await open(page, backend);
      const r = await page.evaluate(async () => {
        const lab = window.lab;
        lab.setMotion('reduce');
        const t = performance.now();
        await lab.fly(0, 860);
        const single = performance.now() - t;
        lab.reset();
        const order = await lab.flySequence(5);
        return { single, order };
      });
      results[backend] = { ...results[backend], k5: r };
      expect(r.single).toBeLessThan(400);
      expect(r.order).toEqual([0, 1, 2, 3, 4]);
    });
  });
}

test.afterAll(() => {
  mkdirSync('tests/lab/__out__', { recursive: true });
  writeFileSync('tests/lab/__out__/motion-results.json', JSON.stringify(results, null, 2));
});
