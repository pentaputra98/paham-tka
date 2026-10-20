import { expect, test, type Page } from '@playwright/test';
import q13 from '../../src/content/soal/q13';

/** G-Gerak soal 13 (vektor, bidang koordinat). */
const steps = q13.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q13.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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

test.describe('Pembahasan soal 13 (G-Gerak, bidang koordinat)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/13/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.getByRole('dialog')).toContainText('C');
    expect(errors).toEqual([]);
  });

  test('pencerminan D ke C; mundur menyembunyikan C', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/13/bahas?m=amati&b=2&l=1');
    await settled(page, 4);
    await expect(page.locator('.vis-trap')).toHaveClass(/at-sym/);
    await expect(page.locator('.tp-c')).toHaveAttribute('cx', '286');
    await page.locator('[data-prev]').click();
    await settled(page, 3);
    await expect(page.locator('.vis-trap')).not.toHaveClass(/at-sym/);
  });

  test('Ikut berpikir: alasan C di y = 4', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/13/bahas?m=ikut&b=2&l=1');
    const foot = page.locator('.bd-foot');
    await expect(foot).toContainText('ketinggian', { timeout: 20_000 });
    await foot.locator('.opt').nth(1).click();
    await expect(foot.locator('.ask-h')).toContainText('kaki');
    await foot.locator('.opt').first().click();
    await settled(page, 4);
    await expect(page.locator('[data-row="b5"]')).toContainText('4');
  });
});
