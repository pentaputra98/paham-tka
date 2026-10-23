import { expect, test, type Page } from '@playwright/test';
import q11 from '../../src/content/soal/q11';
import { isReady } from '../../src/content';

// soal 11 dibuka (PRD v1.20); tetap dilewati bila suatu saat dikunci lagi lewat daftar OPEN
test.skip(!isReady(11), 'Soal 11 dikunci sementara');

/** G-Gerak soal 11 (alur guru v1.20: a dan b dari grafik, garis tengah, pindah ruas, titik berjalan, uji pilihan). */
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

test.describe('Pembahasan soal 11 (G-Gerak, gelombang kosinus)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/11/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    expect(errors).toEqual([]);
  });

  test('a, b, dan model disimpan; 12,3 pindah ruas; titik berjalan menandai tiga kemunculan', async ({
    page,
  }) => {
    await setup(page);
    await page.goto('./#/soal/11/bahas?m=amati&b=2&l=3');
    await settled(page, 6);
    await expect(page.locator('.bd-pins [data-pin]')).toHaveCount(3, { timeout: 10_000 });
    await expect(page.locator('.bd-pins [data-pin="pY"]')).toContainText('12');
    await page.goto('./#/soal/11/bahas?m=amati&b=3&l=2');
    await settled(page, 9);
    // 12,3 terbang ke ruas kanan menjadi −12,3, bukan dicoret
    await expect(page.locator('.board .bl[data-row="b2"] .tk.red')).toContainText('12');
    await expect(page.locator('.board .bl.cut')).toHaveCount(0);
    await page.goto('./#/soal/11/bahas?m=amati&b=4&l=2');
    await settled(page, 15);
    await expect(page.locator('.vis-tide .t11-mk.on')).toHaveCount(3);
  });

  test('tiap pilihan: disalin dari soal, disubstitusikan ke model; hanya E benar', async ({ page }) => {
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
      await page.goto(`./#/soal/11/bahas?m=amati&b=5&l=${l}`);
      await settled(page, 17 + l);
      await expect(page.locator('.hl-q.focus [data-src]')).toHaveAttribute('data-src', `s-o${o}`);
      await expect(page.locator(`.board .bl[data-row="q${o}"] .tk.q`)).toHaveCount(1);
      await page.locator('[data-next]').click();
      await settled(page, 18 + l);
      await expect(page.locator('.vis-tide .t11-cand')).toHaveCount(1);
      await expect(page.locator('.vis-tide .t11-cand.is-ok')).toHaveCount(o === 'E' ? 1 : 0);
    }
  });

  test('Ikut berpikir: nilai a (garis tengah)', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/11/bahas?m=ikut&b=2&l=1');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('garis tengah', { timeout: 20_000 });
    const opt = (re: RegExp) => foot.locator('.opt').filter({ hasText: re }).first();
    await opt(/14,\s*3/).click();
    await expect(foot.locator('.ask-h')).toContainText('puncak');
    await opt(/12,\s*3/).click();
    await settled(page, 4);
    await expect(foot).toBeEmpty();
  });
});
