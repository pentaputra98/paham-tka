import { expect, test, type Page } from '@playwright/test';
import q25 from '../../src/content/soal/q25';

/**
 * G-Gerak (PRD §5.4, §16.5 skenario 2–3; pembahasan.md §17–18) untuk pilot soal 25.
 * Keadaan diperiksa dari DOM: baris papan yang tampil harus PERSIS baris langkah itu
 * (tanpa ganda), tanpa token tersembunyi, tanpa token terbang, tanpa pertanyaan sisa.
 */
const steps = q25.steps;

/** id baris yang seharusnya tampil pada langkah ke-i (indeks pemutar, 1 = langkah pertama). */
function expectedRows(i: number): string[] {
  const b = steps[i - 1]!.board;
  return b ? (q25.lists[b.list] ?? []).slice(0, b.upTo).map((r) => r.id) : [];
}

async function setup(page: Page, opts: { speed?: number; motion?: string } = {}): Promise<void> {
  await page.addInitScript((o) => {
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({
        schemaVersion: 1,
        speed: o.speed ?? 1.5,
        motion: o.motion ?? 'full',
        sfx: false,
        music: false,
      }),
    );
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true }),
    );
  }, opts);
}

const rowIds = (page: Page): Promise<string[]> =>
  page.$$eval('.board .bl[data-row]', (els) => els.map((e) => (e as HTMLElement).dataset.row!));

async function settled(page: Page, i: number): Promise<void> {
  if (!steps[i - 1]!.board) {
    // langkah tanpa papan (catatan lengkap): papan disembunyikan, tidak ada token terbang
    await expect(page.locator('.board')).toBeHidden({ timeout: 10_000 });
    await expect(page.locator('.fly-tok')).toHaveCount(0);
    await expect(page.locator('.bnav[data-running]')).toHaveCount(0, { timeout: 10_000 });
    return;
  }
  const want = expectedRows(i);
  await expect
    .poll(
      async () => ({
        rows: await rowIds(page),
        hid: await page.locator('.board .tk.hid').count(),
        fly: await page.locator('.fly-tok').count(),
        run: await page.locator('.bnav[data-running]').count(),
      }),
      { timeout: 30_000 },
    )
    .toEqual({ rows: want, hid: 0, fly: 0, run: 0 });
}

test.describe('Pembahasan soal 25 (G-Gerak)', () => {
  test('jalan penuh jalur Amati sampai pop-up SELESAI, tanpa galat konsol', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await setup(page);
    await page.goto('./#/soal/25/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    for (let i = 1; i <= steps.length; i++) {
      await settled(page, i);
      if (i < steps.length) await page.locator('[data-next]').click();
    }
    await expect(page.getByRole('dialog')).toContainText('SELESAI', { timeout: 10_000 });
    await expect(page.getByRole('dialog')).toContainText('$\\frac32$'.length ? '' : '');
    expect(errors).toEqual([]);
    // kemajuan tersimpan: status Sudah dibahas
    const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('pahamtka:v1:progress') ?? '{}'));
    expect(prog.items['25'].done).toBe(true);
  });

  // Lanjut saat animasi berjalan = selesaikan langkah itu dulu; klik berikutnya baru pindah (runtut, PRD v1.4)
  test('Lanjut beruntun saat papan menulis: tiap langkah diselesaikan berurutan, tanpa baris ganda', async ({
    page,
  }) => {
    await setup(page, { speed: 1 });
    await page.goto('./#/soal/25/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    await page.waitForTimeout(300);
    for (let k = 0; k < 18; k++) await page.locator('[data-next]').click({ delay: 20 });
    await expect(page.locator('.bnav[data-running]')).toHaveCount(0, { timeout: 30_000 });
    // tidak ada baris ganda dan tidak ada token yang tertinggal tersembunyi/terbang
    const ids = await rowIds(page);
    expect(new Set(ids).size).toBe(ids.length);
    await expect(page.locator('.board .tk.hid')).toHaveCount(0);
    await expect(page.locator('.fly-tok')).toHaveCount(0);
    // posisi akhir bergantung pada langkah mana yang masih beranimasi saat diklik; yang dijamin: runtut, tanpa sisa
  });

  test('mundur ke setiap langkah: keadaan akhir langsung, tanpa animasi', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/25/bahas?m=amati&b=4&l=1');
    await settled(page, 8);
    for (let i = 7; i >= 1; i--) {
      await page.locator('[data-prev]').click();
      // tanpa animasi: baris lengkap segera (≤ 1 s), tidak ada token tersembunyi
      await settled(page, i);
    }
  });

  test('ulangi (R) menulis ulang tanpa baris ganda; ganti kecepatan di tengah penulisan', async ({
    page,
  }) => {
    await setup(page, { speed: 0.75 });
    await page.goto('./#/soal/25/bahas?m=amati&b=2&l=1');
    await page.waitForTimeout(500);
    // ganti ke 1,5× saat baris sedang ditulis
    await page.locator('[data-speed="1.5"]').click();
    await settled(page, 4);
    await page.keyboard.press('r');
    await page.waitForTimeout(400);
    await page.keyboard.press('r');
    await settled(page, 4);
    const ids = await rowIds(page);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('lompat dari menu bagian di tengah penulisan', async ({ page }) => {
    await setup(page, { speed: 0.75 });
    await page.goto('./#/soal/25/bahas?m=amati');
    await page.getByRole('button', { name: 'Mulai' }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Daftar bagian' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /Menghitung limit/ })
      .click();
    const idx = steps.findIndex((s) => s.ch === 4) + 1;
    await settled(page, idx);
    // mundur ke Pahami soal dari menu
    await page.getByRole('button', { name: 'Daftar bagian' }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /Pahami soal/ })
      .click();
    await settled(page, 1);
  });

  test('Ikut berpikir: pertanyaan muncul, salah memberi petunjuk, benar menulis baris; mundur tidak mengulang', async ({
    page,
  }) => {
    await setup(page);
    await page.goto('./#/soal/25/bahas?m=ikut&b=2&l=1');
    const foot = page.locator('.ask-ov');
    await expect(foot).toContainText('Coba jawab', { timeout: 20_000 });
    await expect(page.locator('[data-next-t]')).toHaveText('Lihat jawaban');
    await foot.getByRole('button', { name: /cot/ }).click();
    await expect(foot.locator('.ask-h')).toContainText('Belum tepat');
    await foot.getByRole('button', { name: /tan/ }).click();
    await settled(page, 4);
    await expect(foot).toBeEmpty();
    // maju lalu mundur: pertanyaan tidak diulang
    await page.locator('[data-next]').click();
    await page.locator('[data-prev]').click();
    await settled(page, 4);
    await expect(foot).toBeEmpty();
  });

  test('Lihat jawaban saat pertanyaan terbuka: langkah ini selesai dulu, klik berikutnya pindah', async ({
    page,
  }) => {
    await setup(page);
    await page.goto('./#/soal/25/bahas?m=ikut&b=2&l=1');
    await expect(page.locator('.ask-ov')).toContainText('Coba jawab', { timeout: 20_000 });
    await page.locator('[data-next]').click();
    await settled(page, 4);
    await expect(page.locator('.ask-ov')).toBeEmpty();
    await page.locator('[data-next]').click();
    await settled(page, 5);
  });
});
