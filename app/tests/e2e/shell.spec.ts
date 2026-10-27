import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { OPEN } from '../../src/content';

const cspErrors = (page: Page): string[] => {
  const errs: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && /Content Security Policy|Refused to/i.test(m.text())) errs.push(m.text());
  });
  return errs;
};

test.describe('Sambutan pertama masuk (v1.12)', () => {
  test('muncul sekali: tentang Paham TKA dan saran layar lebar; tidak muncul lagi setelah ditutup', async ({
    page,
  }) => {
    await page.goto('./#/');
    const dlg = page.getByRole('dialog');
    await expect(dlg).toContainText('Selamat datang di Paham TKA');
    await expect(dlg).toContainText('tablet atau laptop');
    await dlg.getByRole('button', { name: 'Mulai belajar' }).click();
    await expect(dlg).toHaveCount(0);
    await page.reload();
    await expect(page.locator('.qcard').first()).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

test.describe('Beranda dan rute (M0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() =>
      localStorage.setItem(
        'pahamtka:v1:ui',
        JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
      ),
    );
  });

  test('25 kartu: hanya soal OPEN dibuka, sisanya segera hadir; tanpa pelanggaran CSP', async ({ page }) => {
    const errs = cspErrors(page);
    await page.goto('./#/');
    await expect(page.locator('.qcard')).toHaveCount(25);
    await expect(page.locator('.qcard[data-status="ready"]')).toHaveCount(OPEN.length);
    await expect(page.locator('.qcard[data-status="soon"]')).toHaveCount(25 - OPEN.length);
    await expect(page.locator('.foot-copy')).toHaveText(
      '© 2026 Penta Putra Purnomo, S.Pd., Gr. | SMA Vidatra Bontang',
    );
    expect(errs).toEqual([]);
  });

  test('kartu Segera hadir membuka lembar dan Esc menutupnya', async ({ page }) => {
    await page.goto('./#/');
    await page.locator('.qcard[data-no="3"]').click();
    const dlg = page.getByRole('dialog');
    await expect(dlg).toContainText('Soal ini sedang disiapkan');
    await page.keyboard.press('Escape');
    await expect(dlg).toHaveCount(0);
  });

  test('URL soal Segera hadir dialihkan ke beranda dengan lembar', async ({ page }) => {
    await page.goto('./#/soal/3');
    await expect(page).toHaveURL(/#\/$/);
    await expect(page.getByRole('dialog')).toContainText('sedang disiapkan');
  });

  test('filter ranah materi; tanpa kolom cari (papan ketik layar sentuh, PRD v1.4)', async ({ page }) => {
    await page.goto('./#/');
    await expect(page.locator('input[type="search"]')).toHaveCount(0);
    await page.getByRole('button', { name: 'Limit', exact: true }).click();
    await expect(page.locator('.qcard')).toHaveCount(4);
    await page.getByRole('button', { name: 'Semua', exact: true }).click();
    await expect(page.locator('.qcard')).toHaveCount(25);
  });

  test('detail soal Rilis 1, Tentang, Pengaturan dapat dibuka', async ({ page }) => {
    await page.goto('./#/soal/1');
    await expect(page.locator('h1')).toHaveText('Invers Matriks Diagonal');
    await page.goto('./#/tentang');
    await expect(page.locator('body')).toContainText(
      'Kementerian Pendidikan Dasar dan Menengah (Kemendikdasmen)',
    );
    await page.goto('./#/pengaturan');
    const sw = page.getByRole('switch', { name: /Mode ringan/ });
    await sw.click();
    await expect(sw).toHaveAttribute('aria-checked', 'true');
    await page.reload();
    await expect(page.getByRole('switch', { name: /Mode ringan/ })).toHaveAttribute('aria-checked', 'true');
  });

  test('aksesibilitas beranda: 0 pelanggaran serius/kritis (axe)', async ({ page }) => {
    await page.goto('./#/');
    await page.waitForTimeout(800);
    const r = await new AxeBuilder({ page }).analyze();
    const bad = r.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
    expect(bad.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
});

test.describe('Orientasi (FR-ORI-1)', () => {
  test('potret menampilkan layar putar dan menyembunyikan aplikasi', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./#/');
    await expect(page.locator('#rotate')).toBeVisible();
    await expect(page.locator('#rotate')).toContainText('tablet atau laptop');
    await expect(page.locator('#app')).toBeHidden();
    await page.setViewportSize({ width: 844, height: 390 });
    await expect(page.locator('#rotate')).toBeHidden();
    await expect(page.locator('#app')).toBeVisible();
  });
});

test.describe('Offline (G-Offline, PRD §14.12)', () => {
  test('setelah sekali online, aplikasi terbuka tanpa jaringan', async ({ page, context }) => {
    await page.goto('./#/');
    // tunggu service worker aktif dan semua aset tersimpan
    await page.waitForFunction(
      async () => {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg?.active || !navigator.serviceWorker.controller) return false;
        const res = await fetch('./precache-manifest.json', { cache: 'no-store' })
          .then((r) => r.json())
          .catch(() => null);
        if (!res) return false;
        const c = await caches.open(`pahamtka-${res.version}`);
        for (const f of res.files as string[])
          if (!(await c.match(new URL(f, location.href).href, { ignoreVary: true }))) return false;
        return true;
      },
      null,
      { timeout: 30_000 },
    );
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('.qcard')).toHaveCount(25);
    await page.goto('./#/tentang');
    await expect(page.locator('h1')).toHaveText('Tentang Paham TKA');
    await context.setOffline(false);
  });
});

test.describe('Pembaruan aplikasi (v1.25)', () => {
  test('Pengaturan: versi dan waktu build tampil; Cek pembaruan menyatakan versi terbaru', async ({
    page,
  }) => {
    await page.addInitScript(() =>
      localStorage.setItem(
        'pahamtka:v1:ui',
        JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
      ),
    );
    await page.goto('./#/pengaturan');
    const panel = page.locator('section.panel', {
      has: page.getByRole('heading', { name: 'Pembaruan aplikasi' }),
    });
    await expect(panel).toContainText(/Versi \d+\.\d+\.\d+, dibuat/);
    await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration()), null, {
      timeout: 30_000,
    });
    await panel.getByRole('button', { name: 'Cek pembaruan' }).click();
    await expect(panel.locator('[data-upd-text]')).toHaveText('Sudah versi terbaru.', { timeout: 30_000 });
    await expect(panel.getByRole('button', { name: 'Perbaiki aplikasi' })).toBeVisible();
  });
});
