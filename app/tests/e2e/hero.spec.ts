import { expect, test } from '@playwright/test';

/** Hero beranda (revisi PRD v1.5): string art (kapal, kardioid, bintang), bukan soal. */
test.describe('Hero beranda: string art', () => {
  test('benang ditarik satu per satu; tiga karya bergantian', async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem(
        'pahamtka:v1:ui',
        JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
      ),
    );
    await page.goto('./#/');
    await expect(page.locator('.hero-art .sa-shape')).toHaveCount(3);
    await expect(page.locator('.hero-art .sa-shape.on')).toHaveCount(1);
    expect(await page.locator('.hero-art .sa-shape.on .sa-l').count()).toBeGreaterThan(100);
    // tidak ada isi soal di beranda
    await expect(page.locator('.hero .katex')).toHaveCount(0);
    const running = () =>
      page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
    await expect.poll(running, { timeout: 4000 }).toBeGreaterThan(10);
    await expect(page.locator('.hero-stage')).toHaveClass(/is-live/);
  });

  test('hemat gerak: kapal utuh statis, tanpa animasi', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./#/');
    await page.waitForTimeout(800);
    await expect(page.locator('.hero-stage')).toHaveClass(/is-still/);
    const n = await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter(
            (a) => a.playState === 'running' && (a.effect as KeyframeEffect)?.target?.closest?.('.hero-art'),
          ).length,
    );
    expect(n).toBe(0);
  });

  test('meninggalkan beranda menghentikan animasi', async ({ page }) => {
    await page.goto('./#/');
    await page.waitForTimeout(600);
    await page.goto('./#/tentang');
    await page.waitForTimeout(600);
    await expect(page.locator('.hero-art')).toHaveCount(0);
  });
});
