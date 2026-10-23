import { expect, test, type Page } from '@playwright/test';
import q15 from '../../src/content/soal/q15';
import { isReady } from '../../src/content';

// soal 15 dibuka (PRD v1.14); tetap dilewati bila suatu saat dikunci lagi lewat daftar OPEN
test.skip(!isReady(15), 'Soal 15 dikunci sementara');

/** G-Gerak soal 15 (alur guru: sepusat, baca pusat, cara cepat, uji pilihan di bidang koordinat). */
const steps = q15.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q15.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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

test.describe('Pembahasan soal 15 (G-Gerak, bidang koordinat)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/15/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    expect(errors).toEqual([]);
  });

  test('pusat dan jari-jari dibaca dari gambar lalu disimpan; hasil jabaran masuk catatan', async ({
    page,
  }) => {
    await setup(page);
    await page.goto('./#/soal/15/bahas?m=amati&b=2&l=2');
    await settled(page, 5);
    await expect(page.locator('.vis-circ.is-zoom.show-rx.show-ry')).toHaveCount(1);
    await expect(page.locator('.bd-pins [data-pin="pP"]')).toContainText('4', { timeout: 10_000 });
    await page.goto('./#/soal/15/bahas?m=amati&b=2&l=3');
    await settled(page, 6);
    await expect(page.locator('.vis-circ.show-count')).toHaveCount(1);
    await expect(page.locator('.bd-pins [data-pin="pR"]')).toContainText('2', { timeout: 10_000 });
    await page.goto('./#/soal/15/bahas?m=amati&b=4&l=3');
    await settled(page, 14);
    // 4 pindah ruas: terbang dari ruas kanan menjadi −4 di ruas kiri (bukan dicoret)
    await expect(page.locator('.board .bl[data-row="j5"] .tk.red')).toContainText('4');
    await expect(page.locator('.board .bl.cut')).toHaveCount(0);
    await page.goto('./#/soal/15/bahas?m=amati&b=4&l=4');
    await settled(page, 15);
    await expect(page.locator('.vis-circ.is-zoom')).toHaveCount(0);
    // catatan: pusat, jari-jari, hasil bentuk umum (pin rumus baku hanya dipakai saat substitusi)
    await expect(page.locator('.bd-pins [data-pin]')).toHaveCount(3, { timeout: 10_000 });
    await expect(page.locator('.bd-pins [data-pin="pHasil"]')).toContainText('21');
  });

  test('tiap pilihan: disalin dari soal, pusatnya digambar; hanya A sepusat', async ({ page }) => {
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
      await page.goto(`./#/soal/15/bahas?m=amati&b=6&l=${l}`);
      await settled(page, 19 + l);
      await expect(page.locator('.hl-q.focus [data-src]')).toHaveAttribute('data-src', `s-o${o}`);
      await expect(page.locator(`.board .bl[data-row="c${o}"] .tk.q`)).toHaveCount(1);
      await page.locator('[data-next]').click();
      await settled(page, 20 + l);
      await expect(page.locator(`.vis-circ [data-opt="${o}"]`)).toHaveCount(1);
      await expect(page.locator('.vis-circ .c5-opt.is-same')).toHaveCount(o === 'A' ? 1 : 0);
    }
  });

  test('Ikut berpikir: pertanyaan koordinat p', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/15/bahas?m=ikut&b=2&l=2');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('ditulis', { timeout: 20_000 });
    // KaTeX: teks tombol memuat MathML, jadi dicocokkan longgar tanpa memedulikan spasi
    const opt = (re: RegExp) => foot.locator('.opt').filter({ hasText: re }).first();
    await opt(/4,\s*[−-]\s*3/).click();
    await expect(foot.locator('.ask-h')).toContainText('Belum tepat');
    await opt(/[−-]\s*3,\s*4/).click();
    await settled(page, 5);
    await expect(foot).toBeEmpty();
  });

  test('Ikut berpikir: hati-hati arti sepusat', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/15/bahas?m=ikut&b=5&l=1');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('sepusat', { timeout: 20_000 });
    await foot
      .locator('.opt')
      .filter({ hasText: /^jari-jari yang sama$/ })
      .click();
    await expect(foot.locator('.ask-h')).toContainText('Belum tepat');
    await foot
      .locator('.opt')
      .filter({ hasText: /^pusat yang sama$/ })
      .click();
    await settled(page, 17);
    await expect(foot).toBeEmpty();
  });
});
