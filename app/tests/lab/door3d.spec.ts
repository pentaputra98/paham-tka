import { mkdirSync, writeFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const STAGES = ['door', 'ornament', 'unglass', 'radius', 'unroll', 'ruler', 'match'];
const out: Record<string, unknown> = {};

async function open(page: Page): Promise<void> {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('./lab/door3d.html');
  await page.waitForFunction(() => !!(window as unknown as { lab3d?: unknown }).lab3d);
}
const lab = (page: Page, fn: string, ...args: unknown[]): Promise<unknown> =>
  page.evaluate(
    ([f, a]) =>
      (window as unknown as { lab3d: Record<string, (...x: unknown[]) => unknown> }).lab3d[f as string]!(
        ...(a as unknown[]),
      ),
    [fn, args] as const,
  );

for (const throttle of [1, 4]) {
  test(`fps tiap tahap, CPU ${throttle}×`, async ({ page }) => {
    await open(page);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });
    const rows: Record<string, { fps: number; worst: number }> = {};
    for (const s of STAGES) {
      const p = lab(page, 'stage', s, true);
      rows[s] = (await lab(page, 'measure', 2500)) as { fps: number; worst: number };
      await p;
      if (throttle === 1) await page.screenshot({ path: `tests/lab/__out__/door3d-${s}.png` });
    }
    const info = await lab(page, 'info');
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    out[`cpu${throttle}x`] = { rows, info };
    for (const s of STAGES) expect(rows[s]!.fps, `${s} @${throttle}x`).toBeGreaterThanOrEqual(30);
    expect((info as { triangles: number }).triangles).toBeLessThan(25000);
  });
}

test('20 kali buka-tutup: satu kanvas, memori stabil', async ({ page }) => {
  await open(page);
  await lab(page, 'stage', 'door', false);
  const cdp = await page.context().newCDPSession(page);
  const gc = async (): Promise<void> => {
    await cdp.send('HeapProfiler.collectGarbage');
    await page.waitForTimeout(300);
    await cdp.send('HeapProfiler.collectGarbage');
  };
  await lab(page, 'cycle', 2);
  await gc();
  const first = (await lab(page, 'cycle', 0)) as { heapMB: number | null; canvases: number };
  await lab(page, 'cycle', 20);
  await gc();
  const after = (await lab(page, 'cycle', 0)) as { heapMB: number | null; canvases: number };
  out.memory = { first, after };
  expect(after.canvases).toBe(1);
  if (first.heapMB && after.heapMB) expect(after.heapMB - first.heapMB).toBeLessThan(3);
});

test('Mode ringan menampilkan padanan 2D tanpa kanvas aktif', async ({ page }) => {
  await open(page);
  await lab(page, 'setLite', true);
  await lab(page, 'stage', 'match', true);
  expect(await lab(page, 'is2d')).toBe(true);
  await expect(page.locator('.ribbon18')).toContainText('Pas');
  await expect(page.locator('.ribbon18')).toContainText('637,5');
});

test('fps < 30 selama 3 detik → beralih otomatis ke 2D dengan toast', async ({ page }) => {
  await open(page);
  await lab(page, 'stage', 'door', true);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 40 });
  await expect.poll(() => lab(page, 'is2d'), { timeout: 30_000 }).toBe(true);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await expect(page.locator('.toast')).toContainText('beralih ke gambar 2D');
});

test.afterAll(() => {
  mkdirSync('tests/lab/__out__', { recursive: true });
  writeFileSync('tests/lab/__out__/door3d-results.json', JSON.stringify(out, null, 2));
});
