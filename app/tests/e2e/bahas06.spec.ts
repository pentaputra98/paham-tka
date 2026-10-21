import { expect, test, type Page } from '@playwright/test';
import q06 from '../../src/content/soal/q06';
import { isReady } from '../../src/content';

// dikunci sementara oleh pemilik sampai soal 1 selesai seluruh fiturnya (PRD v1.6, daftar OPEN)
test.skip(!isReady(6), 'Soal 6 dikunci sementara (PRD v1.6)');

/** G-Gerak soal 6 (papan saja, pilihan tunggal). */
const steps = q06.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q06.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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

test.describe('Pembahasan soal 6 (G-Gerak, papan saja)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/6/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.getByRole('dialog')).toContainText('C');
    expect(errors).toEqual([]);
  });

  test('Ikut berpikir: dua pertanyaan (suku x, nilai p)', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/6/bahas?m=ikut&b=2&l=0');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('Suku', { timeout: 20_000 });
    await foot.locator('.opt').nth(1).click();
    await expect(foot.locator('.ask-h')).toContainText('dikurangkan');
    await foot.locator('.opt').first().click();
    await settled(page, 3);
    await page.goto('./#/soal/6/bahas?m=ikut&b=3&l=0');
    await expect(foot).toContainText('berapa', { timeout: 20_000 });
    await foot.locator('.opt').first().click();
    await settled(page, 5);
    await expect(page.locator('[data-row="c4"]')).toBeVisible();
  });
});
