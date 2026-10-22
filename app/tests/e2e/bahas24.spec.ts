import { expect, test, type Page } from '@playwright/test';
import q24 from '../../src/content/soal/q24';
import { isReady } from '../../src/content';

// soal 24 dibuka (PRD v1.7); tetap dilewati bila suatu saat dikunci lagi lewat daftar OPEN
test.skip(!isReady(24), 'Soal 24 dikunci sementara');

/** G-Gerak dan interaksi SVG soal 24 (alur guru, panggung penuh dua kolom). */
const steps = q24.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q24.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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

test.describe('Pembahasan soal 24 (G-Gerak, SVG interaktif)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/24/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    expect(errors).toEqual([]);
  });

  test('Lanjut beruntun tanpa sisa animasi; mundur dari pernyataan (4) ke (3)', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/24/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let k = 0; k < 18; k++) await page.locator('[data-next]').click({ delay: 15 });
    await expect(page.locator('.bnav[data-running]')).toHaveCount(0, { timeout: 30_000 });
    const ids = await page.$$eval('.board .bl[data-row]', (els) =>
      els.map((e) => (e as HTMLElement).dataset.row!),
    );
    expect(new Set(ids).size).toBe(ids.length);
    await expect(page.locator('.board .tk.hid')).toHaveCount(0);
    // langkah 25 = analisis pernyataan (4): θ = 30°; mundur ke langkah salin pernyataan (4), lalu ke (3): θ = 60°
    await page.goto('./#/soal/24/bahas?m=amati&b=5&l=8');
    await settled(page, 25);
    await expect(page.locator('[data-o="th"]')).toHaveText('30°', { timeout: 5000 });
    await expect(page.locator('.bd-t')).toHaveText('Pernyataan (4)');
    await page.locator('[data-prev]').click();
    await settled(page, 24);
    await expect(page.locator('.hl-q.focus')).toHaveCount(1);
    await page.locator('[data-prev]').click();
    await settled(page, 23);
    await expect(page.locator('[data-o="th"]')).toHaveText('60°');
  });

  test('coretan muncul setelah rumus utuh; r² dicoret lalu diolah bertahap; slider', async ({ page }) => {
    await setup(page);
    // langkah 10: baris x5 tampil utuh tanpa coretan; langkah 11: angka 2 dicoret
    await page.goto('./#/soal/24/bahas?m=amati&b=3&l=5');
    await settled(page, 10);
    await expect(page.locator('.board .bl.cut')).toHaveCount(0);
    await page.locator('[data-next]').click();
    await settled(page, 11);
    await expect(page.locator('.board .bl.cut[data-row="x5"] .tk.x')).toHaveCount(2);
    await page.goto('./#/soal/24/bahas?m=amati&b=4&l=1');
    await settled(page, 13);
    await expect(page.locator('.board .bl.cut[data-row="q1"] .tk.x')).toHaveCount(2);
    await page.goto('./#/soal/24/bahas?m=amati&b=4&l=4');
    await settled(page, 16);
    await expect(page.locator('.board .bl.cut[data-row="q1"]')).toHaveCount(1);
    await page.goto('./#/soal/24/bahas?m=amati&b=5&l=1');
    await settled(page, 18);
    const q = page.locator('[data-o="q"]');
    await expect(page.locator('.labctl')).toBeVisible({ timeout: 10_000 });
    const before = await q.innerText();
    await page.locator('#cone-r').fill('4');
    await expect(q).toHaveText(before);
    await page.locator('#cone-th').fill('120');
    await expect(q).not.toHaveText(before);
    await page.locator('#cone-th').fill('180');
    await expect(q).toHaveText('0,000');
  });

  test('label θ dan θ/2 pada gambar menjadi sumber terbang (tidak ditulis kapur)', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/24/bahas?m=amati&b=3&l=1');
    await expect.poll(() => page.locator('.fly-tok').count(), { timeout: 15_000 }).toBeGreaterThan(0);
    await settled(page, 6);
  });

  test('segitiga siku-siku dipindahkan dan diputar, lalu dikembalikan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/24/bahas?m=amati&b=3&l=2');
    await settled(page, 7);
    await expect(page.locator('.vis-cone.piece-done')).toHaveCount(1);
    await expect(page.locator('.board .bd-t')).toHaveText('Segitiga siku-siku');
    await page.locator('[data-next]').click();
    await settled(page, 8);
    await expect(page.locator('.vis-cone.piece-done')).toHaveCount(1);
    await page.goto('./#/soal/24/bahas?m=amati&b=3&l=5');
    await settled(page, 10);
    await expect(page.locator('.vis-cone.show-piece')).toHaveCount(0);
    await page.locator('[data-prev]').click();
    await settled(page, 9);
    await expect(page.locator('.vis-cone.piece-done')).toHaveCount(1);
  });

  test('tiap pernyataan: soal tampil lagi, pernyataan disorot dan disalin ke papan', async ({ page }) => {
    await setup(page);
    for (const [l, n] of [
      [0, 1],
      [2, 2],
      [4, 3],
      [7, 4],
      [9, 5],
    ] as const) {
      await page.goto(`./#/soal/24/bahas?m=amati&b=5&l=${l}`);
      await settled(page, 17 + l);
      await expect(page.locator('.hl-q.focus [data-src]')).toHaveAttribute('data-src', `s-p${n}`);
      await expect(page.locator(`.board .bl[data-row="c${n}"] .tk.q`)).toHaveCount(1);
    }
  });
});
