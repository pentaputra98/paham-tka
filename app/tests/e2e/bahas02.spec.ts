import { expect, test, type Page } from '@playwright/test';
import q02 from '../../src/content/soal/q02';

/** G-Gerak soal 2 (SPL dan invers matriks, pilihan tunggal). */
const steps = q02.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q02.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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
      }),
      { timeout: 30_000 },
    )
    .toEqual({ rows: want, hid: 0, fly: 0 });
}

test.describe('Pembahasan soal 2 (G-Gerak, gambar sumber + papan)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/2/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.getByRole('dialog')).toContainText('E');
    expect(errors).toEqual([]);
  });

  test('Ikut berpikir: persamaan gajah lalu determinan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/2/bahas?m=ikut&b=2&l=0');
    const foot = page.locator('.bd-foot');
    await expect(foot).toContainText('total rumput gajah', { timeout: 20_000 });
    await foot.locator('.opt').nth(3).click();
    await expect(foot.locator('.ask-h')).toContainText('kilogram');
    await foot.locator('.opt').first().click();
    await settled(page, 4);
    await page.goto('./#/soal/2/bahas?m=ikut&b=3&l=0');
    await expect(foot).toContainText('det', { timeout: 20_000 });
    await foot.locator('.opt').first().click();
    await settled(page, 6);
    await expect(page.locator('[data-row="i4"]')).toBeVisible();
  });
});
