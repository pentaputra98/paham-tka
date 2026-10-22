import { expect, test } from '@playwright/test';
test('hero tidak menggeser tata letak', async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
    ),
  );
  await page.goto('./#/');
  await page.waitForTimeout(800);
  const y0 = await page.locator('.hero-art').evaluate((e) => e.getBoundingClientRect().top);
  await page.waitForTimeout(5500);
  await page.screenshot({
    path: 'tests/visual/__out__/hero-end.png',
    clip: { x: 0, y: 60, width: 560, height: 600 },
  });
  const y1 = await page.locator('.hero-art').evaluate((e) => e.getBoundingClientRect().top);
  expect(Math.abs(y1 - y0)).toBeLessThan(1);
});
