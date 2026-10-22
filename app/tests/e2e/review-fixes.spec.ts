import { expect, test, type Page } from '@playwright/test';
import q01 from '../../src/content/soal/q01';

/** Uji regresi temuan code-review M1. */
async function setup(page: Page, speed = 1): Promise<void> {
  await page.addInitScript((sp) => {
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({ schemaVersion: 1, speed: sp, motion: 'full', sfx: false, music: false }),
    );
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
    );
  }, speed);
}

test('putar otomatis ditekan di tengah penulisan tidak memotong langkah', async ({ page }) => {
  await setup(page, 0.75);
  await page.goto('./#/soal/1/bahas?m=amati&b=2&l=1');
  await page.waitForTimeout(400);
  await page.locator('[data-auto]').click();
  // langkah 4 (q1, c1–c3) harus selesai ditulis sebelum pindah ke langkah berikutnya
  const want = (q01.lists.L2 ?? []).slice(0, 4).map((r) => r.id);
  await expect
    .poll(
      async () =>
        page.$$eval('.board .bl[data-row]', (els) => els.map((e) => (e as HTMLElement).dataset.row!)),
      { timeout: 30_000 },
    )
    .toEqual(want);
  await expect(page.locator('.board .tk.hid')).toHaveCount(0);
  // lalu pindah otomatis ke langkah berikutnya (contoh lain, bagian 2)
  await expect(page.locator('.navlabel')).toContainText('langkah 3 dari 4', { timeout: 15_000 });
});

test('pintasan M menyinkronkan tombol musik di header', async ({ page }) => {
  await setup(page);
  await page.goto('./#/soal/1/bahas?m=amati&b=1');
  const btn = page.locator('[data-act="music"]');
  await expect(btn).toHaveAttribute('aria-pressed', 'false');
  await page.locator('.scene').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('m');
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
});

test('rute Catatan lengkap membuka bagian catatan; rumus dirender, tanpa TeX mentah', async ({ page }) => {
  await setup(page);
  await page.goto('./#/soal/1/catatan');
  await expect(page.locator('.notes-ov')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('.nsheet h2').filter({ hasText: 'Uji dengan rumus umum' })).toHaveCount(1);
  expect(await page.locator('.nsheet .n-m .katex').count()).toBeGreaterThan(5);
  // tidak ada TeX mentah yang terlihat (anotasi MathML tersembunyi tidak dihitung)
  const titles = await page.locator('.nsheet h2').allInnerTexts();
  expect(titles.filter((t) => t.includes('$'))).toEqual([]);
});

test('tombol Selesai di akhir tidak menggandakan hitungan tonton', async ({ page }) => {
  await setup(page, 1.5);
  const last = q01.chapters.length - 1;
  await page.goto(`./#/soal/1/bahas?m=amati&b=${last}`);
  await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 15_000 });
  await page.keyboard.press('Escape');
  await page.locator('[data-next]').click();
  await expect(page.getByRole('dialog')).toContainText('SELESAI');
  const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('pahamtka:v1:progress') ?? '{}'));
  expect(prog.items['1'].watched).toBe(1);
});
