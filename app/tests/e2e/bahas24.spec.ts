import { expect, test, type Page } from '@playwright/test';
import q24 from '../../src/content/soal/q24';

/** G-Gerak dan interaksi SVG untuk pilot soal 24 (mesin visual). */
const steps = q24.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q24.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
};

async function setup(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({ schemaVersion: 1, speed: 1.5, motion: 'full', sfx: false }),
    );
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true }),
    );
  });
}

async function settled(page: Page, i: number): Promise<void> {
  const want = expectedRows(i);
  if (!want) {
    await expect(page.locator('.board')).toBeHidden({ timeout: 10_000 });
    await expect(page.locator('.bnav[data-running]')).toHaveCount(0, { timeout: 10_000 });
    return;
  }
  await expect
    .poll(
      async () => ({
        rows: await page.$$eval('.board .bl[data-row]', (els) =>
          els.map((e) => (e as HTMLElement).dataset.row!),
        ),
        hid: await page.locator('.board .tk.hid').count(),
        fly: await page.locator('.fly-tok').count(),
        run: await page.locator('.bnav[data-running]').count(),
      }),
      { timeout: 30_000 },
    )
    .toEqual({ rows: want, hid: 0, fly: 0, run: 0 });
}

test.describe('Pembahasan soal 24 (G-Gerak, SVG interaktif)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/24/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    expect(errors).toEqual([]);
  });

  test('Lanjut cepat dan mundur: keadaan papan dan visual tepat', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/24/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let k = 0; k < 18; k++) await page.locator('[data-next]').click({ delay: 15 });
    await settled(page, 10);
    // langkah 10 = pernyataan (4): θ = 30°
    await expect(page.locator('[data-o="th"]')).toHaveText('30°', { timeout: 5000 });
    await page.locator('[data-prev]').click();
    await settled(page, 9);
    await expect(page.locator('[data-o="th"]')).toHaveText('90°');
  });

  test('slider: jari-jari tidak mengubah X/Y, sudut mengubahnya', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/24/bahas?m=amati&b=2&l=3');
    const q = page.locator('[data-o="q"]');
    await expect(page.locator('.labctl')).toBeVisible({ timeout: 10_000 });
    const before = await q.innerText();
    await page.locator('#cone-r').fill('5');
    await expect(q).toHaveText(before);
    await page.locator('#cone-th').fill('120');
    await expect(q).not.toHaveText(before);
    await page.locator('#cone-th').fill('180');
    await expect(q).toHaveText('0,000');
  });

  test('label θ pada gambar menjadi sumber terbang (tidak ditulis kapur)', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/24/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    await settled(page, 1);
    await page.locator('[data-next]').click();
    await settled(page, 2);
    await page.locator('[data-next]').click();
    // baris a3: token θ/2 terbang dari label SVG [data-src=g-theta]
    await expect.poll(() => page.locator('.fly-tok').count(), { timeout: 15_000 }).toBeGreaterThan(0);
    await settled(page, 3);
  });
});
