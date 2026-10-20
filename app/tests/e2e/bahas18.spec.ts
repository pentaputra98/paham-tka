import { expect, test, type Page } from '@playwright/test';
import q18 from '../../src/content/soal/q18';

/** G-Gerak soal 18 (adegan 3D pelengkap + padanan 2D, tabel Pas/Tidak Pas). */
const steps = q18.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q18.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
};

async function setup(page: Page, lite = false): Promise<void> {
  await page.addInitScript((l) => {
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({ schemaVersion: 1, speed: 1.5, motion: 'full', sfx: false, lite: l }),
    );
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true }),
    );
  }, lite);
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

async function walk(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Mulai' }).click();
  for (let i = 1; i <= steps.length; i++) {
    await settled(page, i);
    if (i < steps.length) await page.locator('[data-next]').click();
  }
  await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
  await expect(page.getByRole('dialog')).toContainText('Tidak · Tidak · Pas');
}

test.describe('Pembahasan soal 18 (G-Gerak, 3D pelengkap)', () => {
  test('jalan penuh jalur Amati dengan 3D sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/18/bahas?m=amati');
    await walk(page);
    expect(errors).toEqual([]);
  });

  test('Mode ringan: padanan 2D, tanpa memuat Three.js, angka tetap terbang dari label', async ({ page }) => {
    const errors: string[] = [];
    const three: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('request', (r) => {
      if (/door3d-scene/.test(r.url())) three.push(r.url());
    });
    await setup(page, true);
    await page.goto('./#/soal/18/bahas?m=amati&b=2&l=0');
    await settled(page, 3);
    await expect(page.locator('.vis-door')).toHaveClass(/is-2d/);
    await expect(page.locator('.ribbon18 [data-src="l3-merah"]')).toBeVisible();
    await page.locator('[data-next]').click();
    await page.locator('[data-next]').click();
    await page.locator('[data-next]').click();
    await settled(page, 6);
    await expect(page.locator('.ribbon18')).toContainText('251,2');
    expect(three).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('Detail soal 18 memuat potongan 3D lebih awal', async ({ page }) => {
    await setup(page);
    const req = page.waitForRequest((r) => /door3d-scene/.test(r.url()), { timeout: 15_000 });
    await page.goto('./#/soal/18');
    await req;
  });

  test('Ikut berpikir: pertanyaan r²', async ({ page }) => {
    await setup(page, true);
    await page.goto('./#/soal/18/bahas?m=ikut&b=2&l=1');
    const foot = page.locator('.bd-foot');
    await expect(foot).toContainText('nilai', { timeout: 20_000 });
    await foot.getByRole('button', { name: /2079/ }).click();
    await expect(foot.locator('.ask-h')).toContainText('Belum tepat');
    await foot.getByRole('button', { name: /1600/ }).click();
    await settled(page, 4);
    await expect(page.locator('[data-row="b3"]')).toContainText('1600');
  });
});
