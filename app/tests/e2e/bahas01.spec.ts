import { expect, test, type Page } from '@playwright/test';
import q01 from '../../src/content/soal/q01';

/** G-Gerak soal 1 (grid matriks, pilihan tunggal). */
const steps = q01.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q01.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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

test.describe('Pembahasan soal 1 (G-Gerak, grid matriks)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.getByRole('dialog')).toContainText('E');
    expect(errors).toEqual([]);
  });

  test('adjoin menukar a dan d; mundur mengembalikan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=amati&b=2&l=1');
    await settled(page, 5);
    await expect(page.locator('.vis-mat')).toHaveAttribute('data-stage', 'adj');
    await expect(page.locator('.vis-mat [data-k="d"]')).toHaveCSS('grid-row-start', '1');
    await page.locator('[data-prev]').click();
    await settled(page, 4);
    await expect(page.locator('.vis-mat [data-k="d"]')).toHaveCSS('grid-row-start', '2');
  });

  test('Ikut berpikir: pertanyaan determinan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=ikut&b=2&l=0');
    const foot = page.locator('.bd-foot');
    await expect(foot).toContainText('Coba jawab', { timeout: 20_000 });
    await foot.locator('.opt').nth(1).click();
    await expect(foot.locator('.ask-h')).toContainText('Belum tepat');
    await foot.locator('.opt').first().click();
    await settled(page, 4);
    await expect(foot).toBeEmpty();
  });
});
