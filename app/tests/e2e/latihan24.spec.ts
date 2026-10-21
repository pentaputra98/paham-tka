import { expect, test, type Page } from '@playwright/test';
import { gen24 } from '../../src/practice/gen24';
import { keysOf, parseCode } from '../../src/practice/types';

/** Latihan serupa soal 24 (pilihan banyak): pilih semua pernyataan yang benar. */
async function setup(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({ schemaVersion: 1, speed: 1.5, motion: 'full', sfx: false, music: false }),
    );
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true }),
    );
  });
}

/** Indeks pernyataan benar soal yang sedang tampil, dihitung ulang dari kode soal. */
async function keys(page: Page): Promise<number[]> {
  const head = await page.locator('.lat-paper .soal-h').innerText();
  const p = parseCode(/Kode\s+(\S+)/i.exec(head)![1]!)!;
  return keysOf(gen24.make(p.seed, p.level));
}

test.describe('Latihan serupa soal 24', () => {
  test('dari Detail: centang pernyataan → belum tepat → coba lagi benar → langkah → ringkasan', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/24');
    await page.getByRole('link', { name: 'Coba latihan serupa' }).click();
    await page.getByRole('radio', { name: /Sedang/ }).click();
    await page.getByRole('radio', { name: '1', exact: true }).click();
    await page.getByRole('radio', { name: 'Tanpa waktu' }).click();
    await page.getByRole('button', { name: 'Mulai latihan' }).click();
    await expect(page.getByRole('checkbox')).toHaveCount(5);
    await expect(page.locator('.lat-fig svg')).toBeVisible();

    // percobaan pertama: pilih satu pernyataan salah → "Belum tepat" dengan jebakan, tanpa membuka kunci
    const k = await keys(page);
    const wrong = [0, 1, 2, 3, 4].find((i) => !k.includes(i))!;
    await page.getByRole('checkbox').nth(wrong).click();
    await expect(page.getByRole('checkbox').nth(wrong)).toHaveAttribute('aria-checked', 'true');
    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-fb')).toContainText('Belum tepat');
    await expect(page.locator('.lat-fb')).toContainText(/Hati-hati|Perhatikan/);
    await expect(page.locator('.lat-opt.is-key')).toHaveCount(0);

    // percobaan kedua: lepas yang salah, centang semua yang benar
    await page.getByRole('checkbox').nth(wrong).click();
    for (const i of k) await page.getByRole('checkbox').nth(i).click();
    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-fb')).toContainText('Benar.');
    await expect(page.locator('.lat-opt.is-key')).toHaveCount(k.length);
    await expect(page.locator('.lat-verdicts li')).toHaveCount(5);

    // Lihat langkah: papan pembahasan dengan baris penyelesaian
    await page.locator('[data-steps]').click();
    await expect(page.locator('.lat-sol .bl').first()).toBeVisible();
    for (let i = 0; i < 4; i++) {
      await page.locator('[data-sol-next]').click();
      await page.locator('[data-sol-next]').click();
    }
    await expect(page.locator('.lat-sol')).toBeHidden();

    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-sum-big .num')).toHaveText('1');
    expect(errors).toEqual([]);
  });

  test('kunci terbuka setelah dua kali belum tepat; angka 1–5 mencentang pernyataan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/24/latihan?s=00000D-T');
    await expect(page.getByRole('checkbox')).toHaveCount(5);
    const k = await keys(page);
    const wrong = [0, 1, 2, 3, 4].find((i) => !k.includes(i))!;
    await page.keyboard.press(String(wrong + 1));
    await expect(page.getByRole('checkbox').nth(wrong)).toHaveAttribute('aria-checked', 'true');
    await page.locator('[data-check]').click();
    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-fb')).toContainText('Pernyataan yang benar');
    await expect(page.locator('.lat-opt.is-wrong')).toHaveCount(1);
    await expect(page.locator('.lat-opt.is-key')).toHaveCount(k.length);
  });
});
