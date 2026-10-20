import { expect, test, type Page } from '@playwright/test';
import q17 from '../../src/content/soal/q17';

/** G-Gerak soal 17 (rambu SVG berlapis, multi-jawaban). */
const steps = q17.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q17.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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

test.describe('Pembahasan soal 17 (G-Gerak, rambu SVG)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/17/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.getByRole('dialog')).toContainText('1 · 2 · 5');
    expect(errors).toEqual([]);
  });

  test('sorotan warna mengikuti langkah, maju cepat lalu mundur', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/17/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    const on = (): Promise<string | null> =>
      page.locator('.vis-sign [data-layer].on').getAttribute('data-layer', { timeout: 5000 });
    for (let k = 0; k < 4; k++) await page.locator('[data-next]').click({ delay: 15 });
    await settled(page, 5);
    expect(await on()).toBe('blue');
    await expect(page.locator('.vis-sign [data-val="black"]')).toHaveClass(/on/);
    await page.locator('[data-next]').click();
    await settled(page, 6);
    expect(await on()).toBe('red');
    await page.locator('[data-prev]').click();
    await page.locator('[data-prev]').click();
    await settled(page, 4);
    expect(await on()).toBe('black');
    await expect(page.locator('.vis-sign [data-val="black"]')).not.toHaveClass(/on/);
  });

  test('Ikut berpikir: pertanyaan luas putih', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/17/bahas?m=ikut&b=2&l=3');
    const foot = page.locator('.bd-foot');
    await expect(foot).toContainText('Luas putih', { timeout: 20_000 });
    await foot.getByRole('button', { name: /persegi dikurangi/ }).click();
    await expect(foot.locator('.ask-h')).toContainText('Belum tepat');
    await foot.getByRole('button', { name: /cakram dikurangi/ }).click();
    await settled(page, 7);
    await expect(foot).toBeEmpty();
    await expect(page.locator('[data-row="b5"]')).toContainText('231,44');
  });
});
