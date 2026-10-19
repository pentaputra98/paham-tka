import { expect, test } from '@playwright/test';

/** Matriks viewport PRD §16.2 (landscape) + potret yang harus menampilkan layar putar. */
const LANDSCAPE: Array<[number, number]> = [
  [667, 360],
  [780, 360],
  [812, 375],
  [844, 390],
  [915, 412],
  [1024, 600],
  [1024, 768],
  [1280, 720],
  [1280, 800],
  [1366, 768],
  [1440, 860],
  [1920, 1080],
];
const PORTRAIT: Array<[number, number]> = [
  [390, 844],
  [768, 1024],
];
const ROUTES = [
  ['beranda', '#/'],
  ['detail-25', '#/soal/25'],
  ['tentang', '#/tentang'],
  ['pengaturan', '#/pengaturan'],
] as const;

/** Elemen yang tidak boleh terpotong secara horizontal (teks tunggal-baris). */
const NO_CLIP =
  '.btn, .chip, .qcard-no, .qcard-domain, .hero-title .ln, .page-title, .tblock .tb-n, .seg button, .offline-badge, .sheet-title';

for (const [w, h] of LANDSCAPE) {
  test(`landscape ${w}×${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    for (const [name, hash] of ROUTES) {
      await page.goto(`./${hash}`);
      await page.waitForTimeout(700);
      // tutup lembar panduan pasang bila muncul
      if (await page.getByRole('dialog').count()) await page.keyboard.press('Escape');
      await page.waitForTimeout(250);
      await page.screenshot({ path: `tests/visual/__out__/${w}x${h}-${name}.png` });
      const r = await page.evaluate((sel) => {
        const doc = document.documentElement;
        const clipped = [...document.querySelectorAll<HTMLElement>(sel)]
          .filter((e) => e.offsetParent !== null && e.scrollWidth > e.clientWidth + 1)
          .map(
            (e) =>
              `${e.className}: "${(e.textContent ?? '').trim().slice(0, 30)}" ${e.scrollWidth}>${e.clientWidth}`,
          );
        return { hscroll: doc.scrollWidth > innerWidth, clipped };
      }, NO_CLIP);
      expect(r.hscroll, `${name}: gulir horizontal`).toBe(false);
      expect(r.clipped, `${name}: teks terpotong`).toEqual([]);
    }
  });
}

for (const [w, h] of PORTRAIT) {
  test(`potret ${w}×${h} → layar putar`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('./#/');
    await expect(page.locator('#rotate')).toBeVisible();
    await page.screenshot({ path: `tests/visual/__out__/${w}x${h}-potret.png` });
  });
}
