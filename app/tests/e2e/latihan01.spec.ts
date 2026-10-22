import { expect, test, type Page } from '@playwright/test';
import { gen01 } from '../../src/practice/gen01';
import { parseCode } from '../../src/practice/types';

/** Latihan serupa soal 1 (PRD §8.4, §11; v1.6): penyiapan, periksa, jebakan, kunci, langkah, waktu, ringkasan. */
async function setup(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({ schemaVersion: 1, speed: 1.5, motion: 'full', sfx: false, music: false }),
    );
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
    );
  });
}

/** Indeks kunci soal yang sedang tampil, dihitung ulang dari kode soal (generator deterministik). */
async function keyIndex(page: Page): Promise<number> {
  const head = await page.locator('.lat-paper .soal-h').innerText();
  const code = /Kode\s+(\S+)/i.exec(head)![1]!;
  const p = parseCode(code)!;
  return gen01.make(p.seed, p.level).key;
}

const practice = (page: Page): Promise<Array<{ correct: boolean; hints: number; timeout?: boolean }>> =>
  page.evaluate(
    () => JSON.parse(localStorage.getItem('pahamtka:v1:progress') ?? '{}').items?.['1']?.practice ?? [],
  );

test.describe('Latihan serupa soal 1', () => {
  test('dari Detail: penyiapan → salah (jebakan) → coba lagi → kunci → langkah → ringkasan', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await page.goto('./#/soal/1');
    await page.getByRole('link', { name: 'Coba latihan serupa' }).click();
    await expect(page.locator('.lat-setup')).toBeVisible();
    await page.getByRole('radio', { name: /Sedang/ }).click();
    await page.getByRole('radio', { name: '3', exact: true }).click();
    await page.getByRole('radio', { name: 'Tanpa waktu' }).click();
    await page.getByRole('button', { name: 'Mulai latihan' }).click();
    await expect(page.locator('.lat-opt')).toHaveCount(5);
    await expect(page.locator('.tblock .tb-n')).toHaveText('01/03');

    // petunjuk bertahap
    await page.locator('[data-hint]').click();
    await expect(page.locator('.lat-hint')).toHaveCount(1);
    await expect(page.locator('[data-hint-t]')).toHaveText('Petunjuk 2 dari 3');

    // dua jawaban salah: jebakan + uji pilihan, lalu kunci terbuka
    const key = await keyIndex(page);
    const wrong = [0, 1, 2, 3, 4].filter((i) => i !== key);
    await page.locator('.lat-opt').nth(wrong[0]!).click();
    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-fb')).toContainText('Belum tepat');
    await expect(page.locator('.lat-fb')).toContainText(/Hati-hati|Perhatikan/);
    await expect(page.locator('.lat-test')).toContainText('Uji pilihan');
    await expect(page.locator('.lat-opt').nth(wrong[0]!)).toBeDisabled();
    await page.locator('.lat-opt').nth(wrong[1]!).click();
    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-opt.is-key')).toHaveCount(1);
    await expect(page.locator('.lat-opt').nth(key)).toHaveClass(/is-key/);

    // Lihat langkah: papan pembahasan yang sama, berakhir di baris emas
    await page.getByRole('button', { name: 'Lihat langkah' }).click();
    const sol = page.locator('.lat-sol');
    await expect(sol).toBeVisible();
    // Berikutnya saat papan menulis = selesaikan bagian itu dulu; klik berikutnya pindah bagian
    for (let k = 0; k < 12 && (await sol.isVisible()); k++) {
      await page.locator('[data-sol-next]').click();
      await page.waitForTimeout(150);
    }
    await expect(sol).toBeHidden();

    // dua soal berikutnya: jawab benar
    for (let n = 2; n <= 3; n++) {
      await page.locator('[data-check]').click();
      await expect(page.locator('.tblock .tb-n')).toHaveText(`0${n}/03`);
      await page
        .locator('.lat-opt')
        .nth(await keyIndex(page))
        .click();
      await page.locator('[data-check]').click();
      await expect(page.locator('.lat-fb')).toContainText('Benar');
    }
    await page.locator('[data-check]').click();
    await expect(page.locator('.lat-sum')).toBeVisible();
    await expect(page.locator('.lat-sum-big')).toContainText('2');
    await expect(page.locator('.lat-sum-big')).toContainText('dari 3 soal benar');
    await expect(page.getByRole('link', { name: 'Bahas bagian terkait' })).toHaveCount(1);
    const rec = await practice(page);
    expect(rec.map((r) => r.correct)).toEqual([false, true, true]);
    expect(rec[0]!.hints).toBe(1);
    expect(errors).toEqual([]);
  });

  test('kode soal mengulang soal yang sama persis', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/1/latihan?s=00ABCD-T');
    await expect(page.locator('.lat-paper')).toContainText('Kode 00ABCD-T');
    const first = await page.locator('.lat-paper .soal-math').innerText();
    const opts = await page.locator('.lat-opts').innerText();
    await page.reload();
    await expect(page.locator('.lat-paper')).toContainText('Kode 00ABCD-T');
    await expect.poll(() => page.locator('.lat-paper .soal-math').innerText()).toBe(first);
    await expect.poll(() => page.locator('.lat-opts').innerText()).toBe(opts);
    // ulangi satu soal: tanpa tombol Soal baru
    await expect(page.locator('[data-new]')).toBeHidden();
  });

  test('waktu per soal: jeda menghentikan waktu; habis → jawaban dikunci, ditandai waktu habis', async ({
    page,
  }) => {
    await page.clock.install();
    await setup(page);
    await page.goto('./#/soal/1/latihan');
    await page.getByRole('radio', { name: /Mudah/ }).click();
    await page.getByRole('radio', { name: '1', exact: true }).first().click();
    await page.getByRole('radio', { name: 'Per soal' }).click();
    await page.locator('[data-mins] [data-v="1"]').click();
    await page.getByRole('button', { name: 'Mulai latihan' }).click();
    const timer = page.locator('.top [data-act="pause"]');
    await expect(timer).toBeVisible();
    await expect(timer).toContainText('01:00');
    // jeda: waktu tidak berkurang
    await timer.click();
    await expect(timer).toHaveAttribute('aria-pressed', 'true');
    await page.clock.runFor(20_000);
    await expect(timer).toContainText('01:00');
    await timer.click();
    await page.clock.runFor(35_000);
    await expect(timer).toHaveClass(/is-warn/);
    await page.locator('.lat-opt').first().click();
    await page.clock.runFor(30_000);
    await expect(page.locator('.lat-fb')).toContainText('Waktu habis');
    await expect(page.locator('.lat-opt.is-key')).toHaveCount(1);
    const rec = await practice(page);
    expect(rec.at(-1)!.timeout).toBe(true);
  });

  test('pop-up SELESAI pembahasan membuka latihan serupa', async ({ page }) => {
    await setup(page);
    await page.goto('./#/soal/1/bahas?m=amati&b=6');
    const dlg = page.getByRole('dialog');
    await expect(dlg).toContainText('SELESAI', { timeout: 15_000 });
    await dlg.getByRole('button', { name: /Coba latihan serupa/ }).click();
    await expect(page).toHaveURL(/#\/soal\/1\/latihan/);
    await expect(page.locator('.lat-setup')).toBeVisible();
  });
});
