import { expect, test, type Page } from '@playwright/test';
import q16 from '../../src/content/soal/q16';
import { isReady } from '../../src/content';

// soal 16 dibuka (PRD v1.17); tetap dilewati bila suatu saat dikunci lagi lewat daftar OPEN
test.skip(!isReady(16), 'Soal 16 dikunci sementara');

/** G-Gerak soal 16 (alur guru v1.17: data dari gambar, jari-jari sejajar f, uji pilihan). */
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
  test('jalan penuh jalur Amati (termasuk cara alternatif) sampai SELESAI tanpa galat', async ({ page }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/16/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i === steps.length) break;
      // tawaran cara alternatif: pilih Ya agar setiap langkah dilalui berurutan
      if (steps[i - 1]!.branch) await page.getByRole('button', { name: 'Ya, lihat cara alternatif' }).click();
      else await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.locator('.done-body .seal-sm')).toHaveText(['(3, −1)', '(1, −5)']);
    expect(errors).toEqual([]);
  });

  test('data dari gambar disimpan ke catatan; titik singgung dari pusat searah f', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/16/bahas?m=amati&b=1&l=1');
    await settled(page, 2);
    await expect(page.locator('.vis-sing [data-src="g-A"]')).toBeVisible();
    await page.goto('./#/soal/16/bahas?m=amati&b=2&l=2');
    await settled(page, 5);
    await expect(page.locator('.vis-sing.is-zoom.show-rad')).toHaveCount(1);
    await expect(page.locator('.bd-pins [data-pin]')).toHaveCount(3, { timeout: 10_000 });
    await page.goto('./#/soal/16/bahas?m=amati&b=4&l=2');
    await settled(page, 11);
    await expect(page.locator('.vis-sing.is-zoom.show-w2.show-pts2')).toHaveCount(1);
    await expect(page.locator('.bd-pins [data-pin="pT"]')).toContainText('-5', { timeout: 10_000 });
  });

  test('cara alternatif opsional: Lewati melompatinya, Kembali ke tawaran, Ya masuk', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/16/bahas?m=amati&b=4&l=5');
    await settled(page, 14);
    await expect(page.getByRole('button', { name: 'Ya, lihat cara alternatif' })).toBeVisible();
    await expect(page.locator('[data-next-t]')).toHaveText('Lewati');
    // Lewati: langsung ke uji pilihan (1)
    await page.locator('[data-next]').click();
    await settled(page, 22);
    await expect(page.locator('.board .bl[data-row="q1"]')).toHaveCount(1);
    // Kembali: ke tawaran, bukan ke bagian yang dilewati
    await page.locator('[data-prev]').click();
    await settled(page, 14);
    await page.getByRole('button', { name: 'Ya, lihat cara alternatif' }).click();
    await settled(page, 15);
    await expect(page.locator('.vis-sing.show-rot')).toHaveCount(1);
    // dari dalam bagian opsional, Kembali ke tawaran; "Tidak, lanjut saja" juga melewati
    await page.locator('[data-prev]').click();
    await settled(page, 14);
    await page.getByRole('button', { name: 'Tidak, lanjut saja' }).click();
    await settled(page, 22);
  });

  test('tiap pilihan: disalin dari soal, diuji dengan AT²; hanya (2) dan (4) titik singgung', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await setup(page);
    for (let n = 1; n <= 5; n++) {
      const l = 2 * (n - 1);
      await page.goto(`./#/soal/16/bahas?m=amati&b=6&l=${l}`);
      await settled(page, 22 + l);
      await expect(page.locator('.hl-q.focus [data-src]')).toHaveAttribute('data-src', `s-o${n}`);
      await expect(page.locator(`.board .bl[data-row="q${n}"] .tk.q`)).toHaveCount(1);
      await page.locator('[data-next]').click();
      await settled(page, 23 + l);
      await expect(page.locator(`.s16-cand[data-i="${n}"]`)).toHaveCount(1);
      await expect(page.locator('.s16-cand.is-ok')).toHaveCount(n === 2 || n === 4 ? 1 : 0);
    }
  });

  test('Ikut berpikir: gradien dan jari-jari sejajar f', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/16/bahas?m=ikut&b=2&l=0');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('Gradien', { timeout: 20_000 });
    await foot.locator('.opt').nth(1).click();
    await expect(foot.locator('.ask-h')).toContainText('naik dibagi geser');
    await foot.locator('.opt').first().click();
    await settled(page, 3);
    await page.goto('./#/soal/16/bahas?m=ikut&b=3&l=1');
    await expect(foot).toContainText('jari-jari', { timeout: 20_000 });
    await foot.locator('.opt').first().click();
    await settled(page, 8);
    await expect(page.locator('[data-row="s3"]')).toBeVisible();
  });
});
