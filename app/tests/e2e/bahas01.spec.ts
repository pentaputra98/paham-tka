import { expect, test, type Page } from '@playwright/test';
import q01 from '../../src/content/soal/q01';
import { OPEN } from '../../src/content';

/** G-Gerak soal 1 (grid matriks, pilihan tunggal). */
const steps = q01.steps;
const expectedRows = (i: number): string[] | null => {
  const b = steps[i - 1]!.board;
  return b ? (q01.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : null;
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

test.describe('Pembahasan soal 1 (G-Gerak, grid matriks)', () => {
  test('jalan penuh jalur Amati sampai SELESAI tanpa galat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    const dlg = page.getByRole('dialog');
    await expect(dlg).toContainText('SELESAI', { timeout: 10_000 });
    await expect(dlg).toContainText('E');
    // aksi SELESAI mengikuti daftar OPEN: soal berikutnya yang dibuka (soal 24) atau kembali ke beranda
    const nx = OPEN[OPEN.indexOf(1) + 1];
    const main = nx ? `Soal berikutnya` : 'Kembali ke beranda';
    for (const t of [main, 'Coba latihan serupa', 'Lihat catatan lengkap', 'Ulang pembahasan'])
      await expect(dlg.getByRole('button', { name: new RegExp(t) })).toBeVisible();
    if (nx) await expect(dlg.getByRole('button', { name: /Soal berikutnya/ })).toContainText(`Soal ${nx}`);
    await dlg.getByRole('button', { name: new RegExp(main) }).click();
    await expect(page).toHaveURL(nx ? new RegExp(`#/soal/${nx}$`) : /#\/$/);
    expect(errors).toEqual([]);
  });

  test('dua kolom: visual kiri, papan kanan, tanpa gulir; cara cepat: pembilang dan penyebut bertukar', async ({
    page,
  }) => {
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=amati&b=2&l=1');
    await settled(page, 4);
    await expect(page.locator('.scene')).toHaveClass(/lay-full/);
    const vis = (await page.locator('.p-svg').boundingBox())!;
    const board = (await page.locator('.board').boundingBox())!;
    expect(board.x).toBeGreaterThan(vis.x + vis.width - 1);
    // semua baris papan muat tanpa gulir
    const over = await page.locator('.bd-lines').evaluate((e) => e.scrollHeight - e.clientHeight);
    expect(over).toBeLessThanOrEqual(1);
    // tombol Beranda di tengah header
    await expect(page.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await expect(page.locator('.vis-mat')).toHaveClass(/is-flip/);
    // F⁻¹: elemen kiri atas 1/2, kanan bawah 2/1 (penyebut 1 dipudarkan)
    const inv = page.locator('.mx-inv .dg');
    await expect(inv.nth(0).locator('.fr-n')).toHaveText('1');
    await expect(inv.nth(0).locator('.fr-d')).toHaveText('2');
    await expect(inv.nth(1).locator('.fr-n')).toHaveText('2');
    await expect(inv.nth(1).locator('.fr-d')).toHaveClass(/one/);
  });

  test('uji rumus umum: a dan d bertukar posisi; mundur mengembalikan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=amati&b=3&l=2');
    await settled(page, 9);
    await expect(page.locator('.vis-mat')).toHaveClass(/is-adj/);
    await expect(page.locator('.mx-src [data-k="d"]')).toHaveCSS('grid-row-start', '1');
    await page.locator('[data-prev]').click();
    await settled(page, 8);
    await expect(page.locator('.mx-src [data-k="d"]')).toHaveCSS('grid-row-start', '2');
  });

  test('Lanjut saat animasi berjalan menyelesaikan langkah itu dulu (tidak melompat)', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=amati&b=2&l=1');
    await page.waitForTimeout(400);
    await page.locator('[data-next]').click();
    // masih langkah 4, tetapi seluruh barisnya sudah lengkap tanpa animasi
    await expect(page.locator('.navlabel')).toContainText('langkah 2 dari 4');
    await settled(page, 4);
  });

  test('Lanjut beruntun sampai akhir: pop-up SELESAI tanpa animasi yang tertinggal', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=amati&b=2&l=0');
    for (let k = 0; k < 40 && !(await page.getByRole('dialog').isVisible()); k++)
      await page.locator('[data-next]').click({ delay: 30 });
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.locator('.tk.hid')).toHaveCount(0);
    await expect(page.locator('.fly-tok')).toHaveCount(0);
    const running = await page.evaluate(
      () =>
        document
          .getAnimations()
          // hanya animasi WAAPI langkah (transisi/animasi CSS antarmuka, mis. pop-up, tidak dihitung)
          .filter(
            (a) =>
              a.playState === 'running' &&
              !(a instanceof CSSTransition) &&
              !(a instanceof CSSAnimation) &&
              !((a.effect as KeyframeEffect | null)?.target as Element | null)?.closest('.sheet, .cap'),
          ).length,
    );
    expect(running).toBe(0);
  });

  test('Ikut berpikir: tukar pembilang-penyebut lalu determinan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=ikut&b=2&l=1');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('Coba jawab', { timeout: 20_000 });
    // pop-up di tengah panggung, menutupi seluruh panggung (latar diburamkan)
    const ov = (await foot.boundingBox())!;
    const sc = (await page.locator('.scene').boundingBox())!;
    expect(Math.abs(ov.width - sc.width)).toBeLessThan(2);
    await expect(foot.getByRole('dialog')).toBeVisible();
    await foot.locator('.opt').nth(1).click();
    await expect(foot.locator('.ask-h')).toContainText('lawan');
    await foot.locator('.opt').first().click();
    await settled(page, 4);
    await page.goto('./#/soal/1/bahas?m=ikut&b=3&l=1');
    await expect(foot).toContainText('Coba jawab', { timeout: 20_000 });
    await foot.locator('.opt').first().click();
    await settled(page, 8);
  });

  test('Coretan: aktif lewat tombol, menggambar, tersimpan per langkah', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=amati&b=2&l=1');
    await settled(page, 4);
    await page.getByRole('button', { name: /Coretan/ }).click();
    await expect(page.locator('.ink-bar')).toBeVisible();
    const box = (await page.locator('canvas.ink').boundingBox())!;
    await page.mouse.move(box.x + 120, box.y + 140);
    await page.mouse.down();
    await page.mouse.move(box.x + 260, box.y + 180, { steps: 8 });
    await page.mouse.up();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('pahamtka:v1:ink:1') ?? '{}'));
    expect(Object.keys(saved)).toEqual(['4']);
    await page.getByRole('button', { name: 'Selesai coret' }).click();
    await expect(page.locator('.ink-bar')).toBeHidden();
  });
});
