import { expect, test } from '@playwright/test';

test.describe('Hero angka terbang (FR-HOME-5, PRD §6.2)', () => {
  test('siklus berjalan: token terbang dari kertas, baris emas muncul, lalu berulang', async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem(
        'pahamtka:v1:ui',
        JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true }),
      ),
    );
    await page.goto('./#/');
    await expect.poll(() => page.locator('.fly-tok').count(), { timeout: 8000 }).toBeGreaterThan(0);
    await expect(page.locator('.fly-board .box-gold')).toHaveCount(1, { timeout: 15_000 });
    // siklus diulang: papan dikosongkan lalu ditulis lagi
    await expect(page.locator('.fly-board .bl')).toHaveCount(0, { timeout: 10_000 });
    await expect.poll(() => page.locator('.fly-board .bl').count(), { timeout: 8000 }).toBeGreaterThan(0);
  });

  test('hemat gerak: keadaan akhir statis, tanpa token terbang', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#/');
    await page.waitForTimeout(2500);
    await expect(page.locator('.fly-tok')).toHaveCount(0);
    await expect(page.locator('.fly-board .box-gold')).toHaveCount(1);
  });

  test('meninggalkan beranda menghentikan siklus', async ({ page }) => {
    await page.goto('./#/');
    await page.waitForTimeout(1200);
    await page.goto('./#/tentang');
    await page.waitForTimeout(1500);
    await expect(page.locator('.fly-tok')).toHaveCount(0);
  });
});
