import { expect, test, type Page } from '@playwright/test';
import q17 from '../../src/content/soal/q17';
import { isReady } from '../../src/content';

// soal 17 dibuka (PRD v1.9); tetap dilewati bila suatu saat dikunci lagi lewat daftar OPEN
test.skip(!isReady(17), 'Soal 17 dikunci sementara');

/** G-Gerak soal 17 (alur guru: rambu = tumpukan bangun, batang pembanding, multi-jawaban). */
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

test.describe('Pembahasan soal 17 (G-Gerak, rambu SVG)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    test.setTimeout(180_000);
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
    // jawaban banyak: satu medali per pilihan (revisi v1.10)
    await expect(page.locator('.done-body .seal-sm')).toHaveText(['1', '2', '5']);
    expect(errors).toEqual([]);
  });

  test('rambu ditumpuk; bangun di atas diangkat sesuai warna; mundur mengembalikan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/17/bahas?m=amati&b=1&l=1');
    await settled(page, 2);
    await expect(page.locator('.vis-sign.show-legend')).toHaveCount(1);
    await page.goto('./#/soal/17/bahas?m=amati&b=3&l=2');
    await settled(page, 9);
    await expect(page.locator('.vis-sign')).toHaveAttribute('data-lift', 'big');
    await page.goto('./#/soal/17/bahas?m=amati&b=3&l=4');
    await settled(page, 11);
    await expect(page.locator('.vis-sign')).toHaveAttribute('data-lift', 'vbar');
    await expect(page.locator('.vis-sign.show-dim')).toHaveCount(1);
    await page.locator('[data-prev]').click();
    await settled(page, 10);
    await expect(page.locator('.vis-sign')).toHaveAttribute('data-lift', 'big');
    await expect(page.locator('.vis-sign.show-dim')).toHaveCount(0);
    // merah: lengan disatukan lagi lalu disorot satu per satu, kotak tengah disorot pada salib utuh
    await page.goto('./#/soal/17/bahas?m=amati&b=3&l=5');
    await settled(page, 12);
    await expect(page.locator('.vis-sign[data-lift="vbar"]')).toHaveCount(0);
    await expect(page.locator('.vis-sign.arm-h')).toHaveCount(1);
    await page.goto('./#/soal/17/bahas?m=amati&b=3&l=7');
    await settled(page, 14);
    await expect(page.locator('.vis-sign.ov-whole')).toHaveCount(1);
  });

  test('catatan luas: luas disimpan begitu didapat dan dipakai di semua pilihan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/17/bahas?m=amati&b=3&l=0');
    await settled(page, 7);
    await expect(page.locator('.bd-pins [data-pin]')).toHaveCount(0);
    await page.locator('[data-next]').click();
    await settled(page, 8);
    await expect(page.locator('.bd-pins')).toHaveAttribute('data-label', 'Catatan luas');
    await expect(page.locator('.bd-pins [data-pin="pH"]')).toContainText('640,56', { timeout: 10_000 });
    await expect(page.locator('.bd-pins .tk.hid')).toHaveCount(0);
    await page.locator('[data-prev]').click();
    await settled(page, 7);
    await expect(page.locator('.bd-pins [data-pin]')).toHaveCount(0);
    await page.goto('./#/soal/17/bahas?m=amati&b=4&l=2');
    await settled(page, 20);
    await expect(page.locator('.bd-pins [data-pin]')).toHaveCount(5);
  });

  test('tiap pilihan: soal tampil lagi, pilihan disorot dan disalin, lalu batang ditumpuk', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await setup(page);
    for (const n of [1, 2, 3, 4, 5]) {
      const l = 2 * n;
      await page.goto(`./#/soal/17/bahas?m=amati&b=4&l=${l}`);
      await settled(page, 18 + l);
      await expect(page.locator('.hl-q.focus [data-src]')).toHaveAttribute('data-src', `s-o${n}`);
      await expect(page.locator(`.board .bl[data-row="c${n}"] .tk.q`)).toHaveCount(1);
      await page.locator('[data-next]').click();
      await settled(page, 19 + l);
      await expect(page.locator('.vis-bars .br-opt [data-seg]')).toHaveCount(3);
    }
  });

  test('Ikut berpikir: pertanyaan luas putih', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/17/bahas?m=ikut&b=3&l=9');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('Luas putih', { timeout: 20_000 });
    await foot.getByRole('button', { name: /persegi dikurangi/ }).click();
    await expect(foot.locator('.ask-h')).toContainText('Belum tepat');
    await foot.getByRole('button', { name: /lingkaran kecil dikurangi/ }).click();
    await settled(page, 16);
    await expect(foot).toBeEmpty();
    await expect(page.locator('[data-row="p1"]')).toContainText('lingkaran kecil');
  });
});
