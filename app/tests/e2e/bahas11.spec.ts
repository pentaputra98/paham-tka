import { expect, test, type Page } from '@playwright/test';
import q11 from '../../src/content/soal/q11';
import { isReady } from '../../src/content';

// soal 11 dibuka (PRD v1.20); tetap dilewati bila suatu saat dikunci lagi lewat daftar OPEN
test.skip(!isReady(11), 'Soal 11 dikunci sementara');

/** G-Gerak soal 11 (alur logika v1.21: garis tengah, tengah waktu, titik berjalan, cara rumus opsional, uji pilihan). */
const steps = q11.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q11.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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

test.describe('Pembahasan soal 11 (G-Gerak, gelombang)', () => {
  test('jalan penuh jalur Amati (termasuk cara rumus) sampai SELESAI tanpa galat', async ({ page }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/11/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i === steps.length) break;
      if (steps[i - 1]!.branch) await page.getByRole('button', { name: 'Ya, lihat cara rumus' }).click();
      else await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    expect(errors).toEqual([]);
  });

  test('logika grafik: garis tengah, lembah diperbesar, tengah waktu, tiga kemunculan tanpa ":"', async ({
    page,
  }) => {
    await setup(page);
    await page.goto('./#/soal/11/bahas?m=amati&b=2&l=2');
    await settled(page, 5);
    await expect(page.locator('.bd-pins [data-pin="pM"]')).toContainText('12', { timeout: 10_000 });
    await page.goto('./#/soal/11/bahas?m=amati&b=3&l=1');
    await settled(page, 7);
    await expect(page.locator('.vis-tide.is-zoom.show-ring.show-half')).toHaveCount(1);
    await page.goto('./#/soal/11/bahas?m=amati&b=4&l=2');
    await settled(page, 11);
    await expect(page.locator('.vis-tide .t11-mk.on')).toHaveCount(3);
    await expect(page.locator('.board .bd-lines')).not.toContainText(':');
  });

  test('cara rumus opsional: dasar cos dan π/6, 12,3 pindah ruas, contoh 13,3 m', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/11/bahas?m=amati&b=4&l=4');
    await settled(page, 13);
    await expect(page.getByRole('button', { name: 'Ya, lihat cara rumus' })).toBeVisible();
    await page.getByRole('button', { name: 'Ya, lihat cara rumus' }).click();
    await settled(page, 14);
    await expect(page.locator('.vis-tide.show-sin')).toHaveCount(1);
    await page.goto('./#/soal/11/bahas?m=amati&b=5&l=3');
    await settled(page, 17);
    await expect(page.locator('.board .bl[data-row="e2"] .tk.red')).toContainText('12');
    await page.goto('./#/soal/11/bahas?m=amati&b=5&l=5');
    await settled(page, 19);
    await expect(page.locator('.vis-tide.show-alt')).toHaveCount(1);
  });

  test('tiap pilihan: disalin dari soal, dicek dengan pola 3, 9, 15; hanya E benar', async ({ page }) => {
    test.setTimeout(120_000);
    await setup(page);
    for (const [i, o] of [
      [0, 'A'],
      [1, 'B'],
      [2, 'C'],
      [3, 'D'],
      [4, 'E'],
    ] as const) {
      const l = 2 * i;
      await page.goto(`./#/soal/11/bahas?m=amati&b=6&l=${l}`);
      await settled(page, 20 + l);
      await expect(page.locator('.hl-q.focus [data-src]')).toHaveAttribute('data-src', `s-o${o}`);
      await expect(page.locator(`.board .bl[data-row="q${o}"] .tk.q`)).toHaveCount(1);
      await page.locator('[data-next]').click();
      await settled(page, 21 + l);
      await expect(page.locator('.vis-tide .t11-cand')).toHaveCount(1);
      await expect(page.locator('.vis-tide .t11-cand.is-ok')).toHaveCount(o === 'E' ? 1 : 0);
    }
  });

  test('Ikut berpikir: garis tengah', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/11/bahas?m=ikut&b=2&l=2');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('Garis tengah', { timeout: 20_000 });
    const opt = (re: RegExp) => foot.locator('.opt').filter({ hasText: re }).first();
    await opt(/14,\s*3/).click();
    await expect(foot.locator('.ask-h')).toContainText('puncak');
    await opt(/12,\s*3/).click();
    await settled(page, 5);
    await expect(foot).toBeEmpty();
  });
});
