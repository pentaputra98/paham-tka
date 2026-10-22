import { expect, test, type Page } from '@playwright/test';
import q05 from '../../src/content/soal/q05';
import { isReady } from '../../src/content';

// dikunci sementara oleh pemilik sampai soal 1 selesai seluruh fiturnya (PRD v1.6, daftar OPEN)
test.skip(!isReady(5), 'Soal 5 dikunci sementara (PRD v1.6)');

/** G-Gerak soal 5 (grafik kubik, multi-jawaban). */
const steps = q05.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q05.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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

test.describe('Pembahasan soal 5 (G-Gerak, grafik kubik)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/5/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.locator('.done-body .seal-sm')).toHaveText(['(−2, 0)', '(3, 0)']);
    expect(errors).toEqual([]);
  });

  test('titik bergerak ke tiap pilihan; emas hanya bila f(x) = 0', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/5/bahas?m=amati&b=2&l=1');
    await settled(page, 5);
    await expect(page.locator('.cb-pt')).toHaveClass(/zero/);
    await expect(page.locator('.cb-opt[data-i="1"]')).toHaveClass(/ok/);
    await page.locator('[data-next]').click();
    await settled(page, 6);
    await expect(page.locator('.cb-pt')).not.toHaveClass(/zero/);
    await expect(page.locator('.cb-opt[data-i="2"]')).toHaveClass(/no/);
    await expect(page.locator('.cb-pv')).toHaveText('f(−1) = −12');
  });

  test('Ikut berpikir: f(x) = 0 dan slider', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/5/bahas?m=ikut&b=2&l=0');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('Coba jawab', { timeout: 20_000 });
    await foot.locator('.opt').nth(2).click();
    await expect(foot.locator('.ask-h')).toContainText('sumbu Y');
    await foot.locator('.opt').first().click();
    await settled(page, 4);
    await page.locator('#cubic-x').fill('3');
    await expect(page.locator('[data-o="fx"]')).toHaveText('f(x) = 0');
  });
});
