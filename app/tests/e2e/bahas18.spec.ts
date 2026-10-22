import { expect, test, type Page } from '@playwright/test';
import q18 from '../../src/content/soal/q18';
import { isReady } from '../../src/content';

// soal 18 dibuka (PRD v1.12); tetap dilewati bila suatu saat dikunci lagi lewat daftar OPEN
test.skip(!isReady(18), 'Soal 18 dikunci sementara');

/** G-Gerak soal 18 (alur guru: pintu 3D pelengkap di Bagian 1, adegan 2D orn18, tabel Pas/Tidak Pas). */
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
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
    );
  }, lite);
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

async function walk(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Mulai' }).click();
  for (let i = 1; i <= steps.length; i++) {
    await settled(page, i);
    if (i < steps.length) await page.locator('[data-next]').click();
  }
  await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
  await expect(page.locator('.done-body .seal-sm')).toHaveText(['Tidak', 'Tidak', 'Pas']);
}

test.describe('Pembahasan soal 18 (G-Gerak, 3D pelengkap)', () => {
  test('jalan penuh jalur Amati dengan 3D sampai SELESAI tanpa galat', async ({ page }) => {
    test.setTimeout(180_000);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/18/bahas?m=amati');
    await walk(page);
    expect(errors).toEqual([]);
  });

  test('Mode ringan: pintu memakai padanan 2D tanpa memuat Three.js; ornamen 2D tersusun', async ({
    page,
  }) => {
    const errors: string[] = [];
    const three: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('request', (r) => {
      if (/door3d-scene/.test(r.url())) three.push(r.url());
    });
    await setup(page, true);
    await page.goto('./#/soal/18/bahas?m=amati&b=1&l=1');
    await settled(page, 2);
    await expect(page.locator('.vis-door')).toHaveClass(/is-2d/);
    await page.locator('[data-next]').click();
    await settled(page, 3);
    await expect(page.locator('.vis-orn')).toBeVisible();
    expect(three).toEqual([]);
    expect(errors).toEqual([]);
  });

  test('ornamen: persegi diangkat, kerangka per bagian, penggaris; r disimpan ke catatan', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await setup(page, true);
    await page.goto('./#/soal/18/bahas?m=amati&b=2&l=0');
    await settled(page, 5);
    await expect(page.locator('.vis-orn.is-lift')).toHaveCount(1);
    await page.goto('./#/soal/18/bahas?m=amati&b=2&l=3');
    await settled(page, 8);
    await expect(page.locator('.bd-pins [data-pin="pR"]')).toContainText('40', { timeout: 10_000 });
    await page.goto('./#/soal/18/bahas?m=amati&b=3&l=2');
    await settled(page, 11);
    await expect(page.locator('.vis-orn.hl-diam')).toHaveCount(1);
    await page.goto('./#/soal/18/bahas?m=amati&b=3&l=4');
    await settled(page, 13);
    await expect(page.locator('.vis-orn.is-ruler')).toHaveCount(1);
    await expect(page.locator('.bd-pins [data-pin]')).toHaveCount(5);
  });

  test('tiap pilihan: soal tampil lagi, pilihan disorot dan disalin, lalu logam dibandingkan dengan zona', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await setup(page, true);
    for (const [n, segs] of [
      [1, 2],
      [2, 1],
      [3, 1],
    ] as const) {
      const l = 2 * n - 1;
      await page.goto(`./#/soal/18/bahas?m=amati&b=4&l=${l}`);
      await settled(page, 14 + l);
      await expect(page.locator('.hl-q.focus [data-src]')).toHaveAttribute('data-src', `s-o${n}`);
      await expect(page.locator(`.board .bl[data-row="c${n}"] .tk.q`)).toHaveCount(1);
      await page.locator('[data-next]').click();
      await settled(page, 15 + l);
      await expect(page.locator('.vis-orn.show-zone .or-logam [data-seg]')).toHaveCount(segs);
    }
  });

  test('Detail soal 18 memuat potongan 3D lebih awal', async ({ page }) => {
    await setup(page);
    const req = page.waitForRequest((r) => /door3d-scene/.test(r.url()), { timeout: 15_000 });
    await page.goto('./#/soal/18');
    await req;
  });

  test('Ikut berpikir: pertanyaan r²', async ({ page }) => {
    await setup(page, true);
    await page.goto('./#/soal/18/bahas?m=ikut&b=2&l=3');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('nilai', { timeout: 20_000 });
    await foot.getByRole('button', { name: /2079/ }).click();
    await expect(foot.locator('.ask-h')).toContainText('Belum tepat');
    await foot.getByRole('button', { name: /1600/ }).click();
    await settled(page, 8);
    await expect(page.locator('[data-row="a5"]')).toContainText('1600');
  });
});
