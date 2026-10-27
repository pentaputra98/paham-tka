import { expect, test, type Page } from '@playwright/test';

/** Tes penguasaan materi (v1.24): identitas → petunjuk → 21 soal → proses → hasil → riwayat. */
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

interface Stored {
  active: { items: Array<{ kind: string; ok: boolean[] }>; deadline: number } | null;
  history: Array<{ id: string; no: number }>;
}
const stored = (page: Page): Promise<Stored> =>
  page.evaluate(() => JSON.parse(localStorage.getItem('pahamtka:v1:tes') ?? '{}') as Stored);

/** Ketik lewat papan ketik aplikasi. */
async function typeKb(page: Page, text: string): Promise<void> {
  for (const ch of text.toLowerCase()) await page.locator(`.kb [data-k="${ch}"]`).click();
}

async function startTest(page: Page, name = 'Budi Santoso'): Promise<void> {
  await page.goto('./#/tes');
  await expect(page.getByRole('heading', { name: 'Identitas peserta' })).toBeVisible();
  await page.locator('[data-f="name"]').click();
  await expect(page.locator('.kb')).toBeVisible();
  await typeKb(page, name);
  // huruf besar otomatis di awal kata
  await expect(page.locator('[data-f="name"]')).toHaveValue(name);
  await page.locator('.kb [data-k="next"]').click();
  await page.locator('.kb [data-k="close"]').click();
  await page.getByRole('button', { name: 'SMA Vidatra Bontang' }).click();
  await page.getByRole('button', { name: /Lanjut ke petunjuk/ }).click();
  await expect(page.getByRole('heading', { name: 'Baca dulu sebelum mulai' })).toBeVisible();
  await page.getByRole('button', { name: 'Mulai tes' }).click();
  await expect(page).toHaveURL(/#\/tes\/kerjakan\?n=1/);
  await expect(page.locator('.tes-paper .soal-h')).toContainText('Soal 1 dari 21');
}

/** Jawab soal yang sedang tampil sesuai kunci (dari penyimpanan lokal). */
async function answerKey(page: Page, i: number): Promise<void> {
  const it = (await stored(page)).active!.items[i]!;
  if (it.kind === 'tf') {
    for (let r = 0; r < it.ok.length; r++)
      await page.locator(`[data-tf="${r}"][data-v="${it.ok[r] ? 1 : 0}"]`).click();
  } else for (let k = 0; k < it.ok.length; k++) if (it.ok[k]) await page.locator(`[data-opt="${k}"]`).click();
}

test.describe('Tes penguasaan', () => {
  test('identitas wajib diisi; papan ketik aplikasi menggantikan papan ketik bawaan', async ({ page }) => {
    await setup(page);
    await page.goto('./#/');
    await page.getByRole('link', { name: 'Tes penguasaan' }).click();
    await page.getByRole('button', { name: /Lanjut ke petunjuk/ }).click();
    await expect(page.locator('[data-err]')).toContainText('nama');
    await expect(page.locator('[data-f="name"]')).toHaveAttribute('inputmode', 'none');
    await expect(page.locator('.kb')).toBeVisible();
    await typeKb(page, 'an');
    await page.locator('.kb [data-k="del"]').click();
    await expect(page.locator('[data-f="name"]')).toHaveValue('A');
  });

  test('21 soal dijawab benar → animasi proses → hasil 100% per materi → riwayat', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await startTest(page);
    const st = await stored(page);
    expect(st.active!.items).toHaveLength(21);

    // lompat lewat daftar soal, tandai ragu-ragu, kembali
    await page.getByRole('button', { name: /Daftar soal/ }).click();
    await page.getByRole('button', { name: /^Soal 10,/ }).click();
    await expect(page.locator('.tes-paper .soal-h')).toContainText('Soal 10 dari 21');
    await page.getByRole('button', { name: 'Ragu-ragu' }).click();
    await expect(page.getByRole('button', { name: 'Ragu-ragu' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: /Sebelumnya/ }).click();
    await expect(page.locator('.tes-paper .soal-h')).toContainText('Soal 9 dari 21');

    // jawaban tersimpan saat dimuat ulang
    await page.getByRole('button', { name: /Daftar soal/ }).click();
    await page.getByRole('button', { name: /^Soal 1,/ }).click();
    await answerKey(page, 0);
    await page.reload();
    await expect(page.locator('.tes-paper .soal-h')).toContainText('Soal 1 dari 21');
    await expect(page.locator('.tes-opts [aria-checked="true"]').first()).toBeVisible();

    for (let i = 0; i < 21; i++) {
      if (i > 0) await answerKey(page, i);
      if (i < 20) await page.getByRole('button', { name: 'Berikutnya' }).click();
    }
    await expect(page.locator('[data-count]')).toHaveText('21/21');
    await page.getByRole('button', { name: 'Kumpulkan' }).click();
    await expect(page.getByRole('heading', { name: 'Kumpulkan tes sekarang?' })).toBeVisible();
    await expect(page.locator('.sheet-body')).toContainText('Ditandai ragu-ragu: soal 10');
    await page.getByRole('button', { name: 'Kumpulkan sekarang' }).click();
    await expect(page.locator('.tes-proc')).toBeVisible();
    await expect(page).toHaveURL(/#\/tes\/hasil\?id=/, { timeout: 15000 });
    await expect(page.locator('.tes-res-pct')).toContainText('100');
    await expect(page.locator('.tes-res-sub')).toContainText('21 dari 21');
    await expect(page.locator('.tes-mrow')).toHaveCount(7);
    await expect(page.locator('.tes-mrow-p').first()).toHaveText('100%');
    await expect(page.locator('.tes-good')).toBeVisible();
    // rincian: pembahasan singkat terbuka
    await page.locator('[data-rx="0"]').click();
    await expect(page.locator('.tes-rv-ex').first()).toBeVisible();

    // coba lagi dengan soal baru → percobaan ke-2
    await page.getByRole('link', { name: /Coba lagi dengan soal baru/ }).click();
    await expect(page.locator('.tes-attempt')).toContainText('Percobaan ke-2');
    await page.getByRole('button', { name: 'Mulai tes' }).click();
    await expect(page).toHaveURL(/#\/tes\/kerjakan/);
    const papers2 = (await stored(page)).active!.items;
    expect(JSON.stringify(papers2)).not.toBe(JSON.stringify(st.active!.items));
    await page.getByRole('button', { name: /Daftar soal/ }).click();
    await page.getByRole('button', { name: 'Kumpulkan tes' }).click();
    await page.getByRole('button', { name: 'Kumpulkan sekarang' }).click();
    await page.getByRole('button', { name: 'Lewati' }).click();
    await expect(page).toHaveURL(/#\/tes\/hasil/);
    await expect(page.locator('.tes-res-pct')).toContainText('0');
    await expect(page.locator('.tes-res-delta')).toContainText('Turun 100');
    await expect(page.locator('.tes-trend li')).toHaveCount(2);

    await page.goto('./#/tes/riwayat');
    await expect(page.locator('.tes-hrow')).toHaveCount(2);
    await expect(page.locator('.tes-hist-g h2')).toHaveText('Budi Santoso · SMA Vidatra Bontang');
    expect(errors).toEqual([]);
  });

  test('waktu habis saat aplikasi ditutup → dikumpulkan otomatis', async ({ page }) => {
    await setup(page);
    await startTest(page, 'Ani');
    await answerKey(page, 0);
    // "tutup aplikasi": tinggalkan halaman tes (jawaban tersimpan), muat ulang, lalu waktu dimajukan
    await page.goto('./#/');
    await page.reload();
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('pahamtka:v1:tes')!) as { active: { deadline: number } };
      s.active.deadline = Date.now() - 1000;
      localStorage.setItem('pahamtka:v1:tes', JSON.stringify(s));
    });
    await page.reload();
    await page.goto('./#/tes');
    await expect(page).toHaveURL(/#\/tes\/hasil\?id=/);
    await expect(page.locator('.tes-res-date')).toContainText('waktu habis');
    await expect(page.locator('.tes-res-sub')).toContainText('1 dari 21');
  });

  test('coretan: kertas terpisah, tersimpan per soal, cubit dan telapak tidak menulis, dihapus saat dikumpulkan', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await setup(page);
    await startTest(page, 'Dewi');
    const pages = (): Promise<Record<string, unknown[]>> =>
      page.evaluate(
        () =>
          (
            JSON.parse(localStorage.getItem('pahamtka:v1:tes-coret') ?? '{"pages":{}}') as {
              pages: Record<string, unknown[]>;
            }
          ).pages,
      );

    // aktifkan: papan jawaban diganti kertas coretan, soal tetap terlihat
    const ink = page.getByRole('button', { name: 'Coretan' });
    await ink.click();
    await expect(ink).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.sc')).toBeVisible();
    await expect(page.locator('.tes-ans')).toBeHidden();
    await expect(page.locator('.tes-paper')).toBeVisible();
    await expect(page.getByRole('toolbar', { name: 'Alat coretan' })).toBeVisible();

    // dua goresan tetikus
    const box = (await page.locator('.sc-cv').boundingBox())!;
    for (const y of [60, 110]) {
      await page.mouse.move(box.x + 40, box.y + y);
      await page.mouse.down();
      await page.mouse.move(box.x + 160, box.y + y + 20, { steps: 6 });
      await page.mouse.up();
    }
    expect((await pages())['0']).toHaveLength(2);
    await page.getByRole('button', { name: 'Urungkan' }).click();
    expect((await pages())['0']).toHaveLength(1);

    // cubit dua jari dan telapak: tidak ada goresan baru, kertas membesar
    await page.evaluate(() => {
      const cv = document.querySelector('.sc-cv')!;
      const r = cv.getBoundingClientRect();
      const ev = (type: string, id: number, x: number, y: number, size = 12): void => {
        cv.dispatchEvent(
          new PointerEvent(type, {
            pointerId: id,
            pointerType: 'touch',
            clientX: r.left + x,
            clientY: r.top + y,
            width: size,
            height: size,
            bubbles: true,
            cancelable: true,
          }),
        );
      };
      ev('pointerdown', 11, 150, 150);
      ev('pointermove', 11, 160, 152);
      ev('pointerdown', 12, 230, 150);
      for (let i = 1; i <= 8; i++) {
        ev('pointermove', 11, 160 - i * 8, 150);
        ev('pointermove', 12, 230 + i * 8, 150);
      }
      ev('pointerup', 12, 294, 150);
      ev('pointermove', 11, 60, 200);
      ev('pointerup', 11, 60, 200);
      ev('pointerdown', 21, 100, 100, 80);
      ev('pointermove', 21, 140, 160, 80);
      ev('pointerup', 21, 140, 160, 80);
    });
    expect((await pages())['0']).toHaveLength(1);
    await expect(page.locator('.sc-zoom')).toBeVisible();
    await page.locator('.sc-zoom').click();
    await expect(page.locator('.sc-zoom')).toBeHidden();

    // pindah soal: halaman coretan baru; kembali: coretan lama masih ada; mode coretan tetap aktif
    await page.getByRole('button', { name: 'Berikutnya' }).click();
    await expect(page.locator('.tes-paper .soal-h')).toContainText('Soal 2 dari 21');
    await expect(page.locator('.sc-hint')).toBeVisible();
    await page.getByRole('button', { name: 'Sebelumnya' }).click();
    await expect(page.locator('.sc-hint')).toBeHidden();

    // muat ulang: coretan dan mode aktif dipulihkan
    await page.reload();
    await expect(page.locator('.sc')).toBeVisible();
    expect((await pages())['0']).toHaveLength(1);

    // matikan: papan jawaban kembali
    await page.getByRole('button', { name: 'Coretan' }).click();
    await expect(page.locator('.tes-ans')).toBeVisible();
    await expect(page.locator('.sc')).toBeHidden();

    // dikumpulkan: coretan ikut dihapus
    await page.getByRole('button', { name: /Daftar soal/ }).click();
    await page.getByRole('button', { name: 'Kumpulkan tes' }).click();
    await page.getByRole('button', { name: 'Kumpulkan sekarang' }).click();
    await expect(page).toHaveURL(/#\/tes\/hasil\?id=/, { timeout: 20_000 });
    expect(await page.evaluate(() => localStorage.getItem('pahamtka:v1:tes-coret'))).toBeNull();
    expect(errors).toEqual([]);
  });

  test('meninggalkan tes meminta konfirmasi; tes bisa dilanjutkan dari menu', async ({ page }) => {
    await setup(page);
    await startTest(page, 'Citra');
    await page.getByRole('link', { name: 'Keluar' }).click();
    await expect(page.getByRole('heading', { name: 'Tinggalkan tes?' })).toBeVisible();
    await page.getByRole('button', { name: 'Tinggalkan' }).click();
    await expect(page.getByRole('heading', { name: 'Tes sedang berjalan' })).toBeVisible();
    await page.getByRole('link', { name: 'Lanjutkan tes' }).click();
    await expect(page.locator('.tes-paper .soal-h')).toContainText('Soal 1 dari 21');
  });
});
