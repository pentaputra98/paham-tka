import { expect, test, type Page } from '@playwright/test';
import { gen11 } from '../../src/practice/gen11';
import { parseCode } from '../../src/practice/types';

/** Latihan serupa soal 11 (v1.22): kapan kedalaman air laut muncul ke-n kalinya dari grafik. */
async function setup(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({ schemaVersion: 1, speed: 1.5, motion: 'full', sfx: false, music: false }),
    );
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
    );
  });
}

/** Indeks kunci soal yang sedang tampil, dihitung ulang dari kode soal (generator deterministik). */
async function keyIndex(page: Page): Promise<number> {
  const head = await page.locator('.lat-paper .soal-h').innerText();
  const p = parseCode(/Kode\s+(\S+)/i.exec(head)![1]!)!;
  return gen11.make(p.seed, p.level).key;
}

test.describe('Latihan serupa soal 11', () => {
  test('dari Detail: grafik → belum tepat (jebakan) → kunci → langkah → ringkasan', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/11');
    await page.getByRole('link', { name: 'Coba latihan serupa' }).click();
    await page.getByRole('radio', { name: /Menantang/ }).click();
    await page.getByRole('radio', { name: '1', exact: true }).click();
    await page.getByRole('radio', { name: 'Tanpa waktu' }).click();
    await page.getByRole('button', { name: 'Mulai latihan' }).click();
    await expect(page.locator('.lat-opt')).toHaveCount(5);
    await expect(page.locator('.lat-fig svg .lt-curve')).toBeVisible();
    await expect(page.locator('.lat-paper')).toContainText('kalinya');

    const key = await keyIndex(page);
    const wrong = [0, 1, 2, 3, 4].filter((i) => i !== key);
    await page.locator('.lat-opt').nth(wrong[0]!).click();
    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-fb')).toContainText('Belum tepat');
    await expect(page.locator('.lat-fb')).toContainText(/Hati-hati|Perhatikan/);
    await page.locator('.lat-opt').nth(wrong[1]!).click();
    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-opt.is-key')).toHaveCount(1);
    await expect(page.locator('.lat-opt').nth(key)).toHaveClass(/is-key/);

    await page.getByRole('button', { name: 'Lihat langkah' }).click();
    const sol = page.locator('.lat-sol');
    await expect(sol.locator('.bl').first()).toBeVisible();
    for (let k = 0; k < 10 && (await sol.isVisible()); k++) {
      await page.locator('[data-sol-next]').click();
      await page.waitForTimeout(150);
    }
    await expect(sol).toBeHidden();

    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-sum')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Bahas bagian terkait' })).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('kode soal Mudah dan Sedang: garis tengah lalu lembah, jawaban benar langsung', async ({ page }) => {
    await setup(page);
    for (const [code, text] of [
      ['000003-M', 'kalinya'],
      ['000001-S', 'terendah'],
    ] as const) {
      await page.goto(`./#/soal/11/latihan?s=${code}`);
      await expect(page.locator('.lat-paper')).toContainText(`Kode ${code}`);
      await expect(page.locator('.lat-paper')).toContainText(text);
      await expect(page.locator('.lat-fig svg .lt-guide').first()).toBeAttached();
      await page
        .locator('.lat-opt')
        .nth(await keyIndex(page))
        .click();
      await page.locator('[data-check]').click();
      await expect(page.locator('.lat-fb')).toContainText('Benar');
    }
  });
});
