import { expect, test, type Page } from '@playwright/test';
import q16 from '../../src/content/soal/q16';
import { isReady } from '../../src/content';

// dikunci sementara oleh pemilik sampai soal 1 selesai seluruh fiturnya (PRD v1.6, daftar OPEN)
test.skip(!isReady(16), 'Soal 16 dikunci sementara (PRD v1.6)');

/** G-Gerak soal 16 (garis singgung, multi-jawaban). */
const steps = q16.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q16.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
};

async function setup(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({ schemaVersion: 1, speed: 1.5, motion: 'full', sfx: false }),
    );
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
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

test.describe('Pembahasan soal 16 (G-Gerak, garis dan lingkaran)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/16/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.locator('.done-body .seal-sm')).toHaveText(['(3, −1)', '(1, −5)']);
    expect(errors).toEqual([]);
  });

  test('label titik pada grafik menjadi sumber; uji kandidat emas/merah', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/16/bahas?m=amati&b=1&l=1');
    await settled(page, 2);
    await expect(page.locator('.vis-tan [data-src="g-A"]')).toBeVisible();
    await page.goto('./#/soal/16/bahas?m=amati&b=3&l=2');
    await settled(page, 7);
    await expect(page.locator('.t16-cand[data-i="1"]')).toHaveClass(/no/);
    await expect(page.locator('.t16-cand[data-i="2"]')).toHaveClass(/ok/);
    await expect(page.locator('.cb-opt[data-i="2"]')).toHaveClass(/ok/);
  });

  test('Ikut berpikir: gradien dan jari-jari sejajar f', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/16/bahas?m=ikut&b=2&l=0');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('Gradien', { timeout: 20_000 });
    await foot.locator('.opt').nth(1).click();
    await expect(foot.locator('.ask-h')).toContainText('perubahan');
    await foot.locator('.opt').first().click();
    await settled(page, 3);
    await page.goto('./#/soal/16/bahas?m=ikut&b=3&l=0');
    await expect(foot).toContainText('jari-jari', { timeout: 20_000 });
    await foot.locator('.opt').first().click();
    await settled(page, 5);
    await expect(page.locator('[data-row="c4"]')).toBeVisible();
  });
});
