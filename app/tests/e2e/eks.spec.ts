import { expect, test, type Browser, type Page } from '@playwright/test';
import { gameItem } from '../../src/eks/bank';
import { hash32, startCode } from '../../src/eks/codes';

/** Ekspedisi TKA (v1.26–v1.27): Game Master di satu konteks, tablet kelompok di konteks lain. */
async function open(browser: Browser): Promise<Page> {
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => {
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
    );
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({ schemaVersion: 1, speed: 1.5, motion: 'full', sfx: false, music: false }),
    );
  });
  return ctx.newPage();
}

/** Game Master: buat permainan, buka kode gabung kelompok 1, tekan Mulai. */
async function gmStart(gm: Page, teams: number): Promise<string> {
  await gm.goto('./#/ekspedisi');
  await gm.locator('[data-role="gm"]').click();
  await gm.locator('[data-pw]').fill('salah');
  await gm.locator('[data-go]').click();
  await expect(gm.locator('[data-err]')).toHaveText('Kata sandi salah.');
  // kata sandi asli tidak ditulis di repo: uji memakai status "sudah masuk" Game Master di perangkat
  await gm.evaluate(() => localStorage.setItem('pahamtka:v1:eks-gm-ok', String(Date.now() + 3600_000)));
  await gm.locator('[data-back]').click();
  await gm.locator('[data-role="gm"]').click();
  await gm.locator(`[data-teams="${teams}"]`).click();
  await gm.getByRole('button', { name: 'Buat permainan' }).click();
  // kode gabung tersembunyi sampai dibuka satu per satu
  await expect(gm.locator('.eks-joins li').first()).toContainText('••••-••');
  await gm.locator('[data-show="1"]').click();
  const join = (await gm.locator('.eks-joins li.is-open b').textContent())!.trim();
  expect(join).toMatch(/^[A-Z2-9]{4}-1[A-Z2-9]$/);
  await gm.locator('[data-codes-x]').click();
  await expect(gm.locator('[data-startcode]')).toHaveText('• • •');
  await gm.locator('[data-run]').click();
  await expect(gm.locator('[data-gm-state]')).toHaveText('berjalan');
  await expect(gm.locator('[data-startcode]')).toHaveText(startCode(join.slice(0, 4)));
  return join;
}

async function teamJoin(tab: Page, join: string, names: string[]): Promise<void> {
  await tab.goto('./#/ekspedisi');
  await tab.getByRole('button', { name: /Masuk sebagai kelompok/ }).click();
  // papan ketik tidak terbuka sendiri; huruf kecil diubah menjadi kapital
  await expect(tab.locator('.kb')).toBeHidden();
  await tab.locator('[data-code]').click();
  await expect(tab.locator('.kb')).toBeVisible();
  for (const ch of join.replace('-', '').toLowerCase()) await tab.locator(`.kb [data-k="${ch}"]`).click();
  await expect(tab.locator('[data-code]')).toHaveValue(join.replace('-', ''));
  // ketuk di luar menyembunyikan papan ketik
  await tab.locator('.eks-h2').click();
  await expect(tab.locator('.kb')).toBeHidden();
  await tab.locator('[data-go]').click();
  await expect(tab.locator('.eks-confirm-n')).toContainText('Kelompok 1');
  await tab.getByRole('button', { name: 'Ya, benar' }).click();
  for (const n of names) {
    await tab.locator('[data-name]').fill(n);
    await tab.getByRole('button', { name: 'Tambah' }).click();
  }
  await expect(tab.locator('.eks-names li')).toHaveCount(names.length);
  await tab.getByRole('button', { name: 'Lanjut' }).click();
  // swafoto boleh dilewati
  await tab.getByRole('button', { name: 'Lewati' }).click();
  await expect(tab.locator('.eks-order li')).toHaveCount(names.length);
  await tab.getByRole('button', { name: 'Lanjut' }).click();
  // gerbang: tombol baru aktif setelah jeda, dan perlu kode mulai dari layar guru
  const go = tab.locator('.eks-gate [data-go]');
  await expect(go).toBeDisabled();
  await tab.locator('[data-start]').fill('zzz');
  // ketuk di luar kolom menutup papan ketik agar tombol terlihat
  await tab.locator('.eks-gate .eks-h2').click();
  await expect(go).toBeEnabled({ timeout: 8000 });
  await go.click();
  await expect(tab.locator('[data-err]')).toContainText('belum cocok');
  await tab.locator('[data-start]').fill(startCode(join.slice(0, 4)).toLowerCase());
  await tab.locator('.eks-gate .eks-h2').click();
  await go.click();
  await expect(tab.locator('.eks-trail')).toBeVisible();
}

const seedOf = (join: string): number => hash32(`${join.slice(0, 4)}|${Number(join[5])}`);

async function ready(tab: Page): Promise<void> {
  await tab.locator('[data-ready]').click();
  // hitung mundur 5 detik, lalu fase Mandiri
  await expect(tab.locator('.eks-cd')).toBeVisible();
  await expect(tab.locator('[data-phase]')).toContainText('Fase Mandiri', { timeout: 8000 });
}

test.describe('Ekspedisi TKA', () => {
  test('Game Master → kelompok bergabung → pos 1 benar semua → kode bukti → peringkat', async ({
    browser,
  }) => {
    const errors: string[] = [];
    const gm = await open(browser);
    const tab = await open(browser);
    for (const p of [gm, tab]) p.on('pageerror', (e) => errors.push(e.message));
    const join = await gmStart(gm, 3);
    await teamJoin(tab, join, ['Ana', 'Bimo', 'Citra', 'Dodi']);
    const seed = seedOf(join);

    // pos berurutan: pos 2 terkunci, pos 1 berikutnya
    await expect(tab.locator('[data-pin="2"]')).toHaveClass(/is-locked/);
    await expect(tab.locator('[data-pin="1"]')).toHaveClass(/is-cur/);
    await tab.getByRole('button', { name: 'Mulai pos' }).click();
    const seen: string[] = [];
    for (let i = 0; i < 3; i++) {
      seen.push((await tab.locator('.eks-veil-who').textContent())!);
      await ready(tab);
      await tab.locator(`[data-opt="${gameItem(seed, 1, i).ok}"]`).click();
      await expect(tab.locator('.eks-fb-big')).toHaveText('+10');
      await tab.locator('[data-cont]').click();
    }
    expect(new Set(seen).size).toBe(3);
    await expect(tab.locator('.eks-report h2')).toContainText('35 poin');
    const code = (await tab.locator('.eks-code').textContent())!.trim();

    await gm.locator('[data-proof]').fill(code.toLowerCase());
    await gm.locator('[data-record]').click();
    await expect(gm.locator('[data-msg]')).toContainText('Lingkaran Kilat · +35');
    await expect(gm.locator('.eks-rank li').first()).toContainText('35');
    await gm.locator('[data-proof]').fill(code);
    await gm.locator('[data-record]').click();
    await expect(gm.locator('[data-msg]')).toContainText('sudah dicatat');
    await gm.locator('[data-proof]').fill('AAAAA');
    await gm.locator('[data-record]').click();
    await expect(gm.locator('[data-msg]')).toContainText('tidak dikenali');

    // akhiri → umumkan hasil: podium dan statistik
    await gm.locator('[data-end]').click();
    await gm.locator('.sheet .btn--danger').click();
    await expect(gm.locator('.eks-timeup')).toBeVisible();
    await gm.locator('.eks-timeup').click();
    await gm.locator('[data-run]').click();
    await expect(gm.locator('.eks-pod--1')).toContainText('Kelompok 1');
    await expect(gm.locator('.eks-tiles')).toContainText('35');

    // tablet: selesai ekspedisi → layar selesai dan riwayat
    await tab.getByRole('button', { name: 'Kembali ke peta' }).click();
    await tab.locator('[data-end]').click();
    await tab.locator('.sheet .btn--danger').click();
    await expect(tab.locator('.eks-finish-s')).toHaveText('35 poin');
    await tab.getByRole('button', { name: 'Riwayat ekspedisi' }).click();
    await expect(tab.locator('.eks-hist li')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('salah: jebakan dan kesempatan kedua; kembali ke peta aman; soal yang ditinggal hangus', async ({
    browser,
  }) => {
    const gm = await open(browser);
    const tab = await open(browser);
    const join = await gmStart(gm, 2);
    await teamJoin(tab, join, ['Eka', 'Fajar']);
    const seed = seedOf(join);

    await tab.getByRole('button', { name: 'Mulai pos' }).click();
    // belum siap: kembali ke peta tanpa kehilangan apa pun
    await tab.getByRole('button', { name: 'Kembali ke peta' }).click();
    await tab.getByRole('button', { name: 'Lanjutkan pos' }).click();
    await expect(tab.locator('.eks-veil-c .eyebrow')).toContainText('soal 1 dari 3');
    await ready(tab);
    const it = gameItem(seed, 1, 0);
    await tab.locator(`[data-opt="${it.ok === 0 ? 1 : 0}"]`).click();
    await expect(tab.locator('.eks-fb-k')).toContainText('Kena jebakan');
    await tab.getByRole('button', { name: 'Kesempatan kedua' }).click();
    await expect(tab.locator('[data-phase]')).toContainText('Kesempatan kedua');
    await tab.locator(`[data-opt="${gameItem(seed, 1, 0, 1).ok}"]`).click();
    await expect(tab.locator('.eks-fb-big')).toHaveText('+3');
    await tab.locator('[data-cont]').click();

    // soal 2: panggil tim hanya sekali per pos
    await ready(tab);
    await tab.locator('[data-help]').click();
    await expect(tab.locator('[data-phase]')).toContainText('Fase Diskusi');
    // dibuka lalu ditinggal (muat ulang): hangus, lanjut ke soal 3
    await tab.reload();
    await expect(tab.locator('[data-pin="1"] .eks-pin-s')).toHaveText('Lanjutkan');
    await tab.getByRole('button', { name: 'Lanjutkan pos' }).click();
    await expect(tab.locator('.toast').last()).toContainText('hangus');
    await expect(tab.locator('.eks-veil-c .eyebrow')).toContainText('soal 3 dari 3');
    await ready(tab);
    await expect(tab.locator('[data-help]')).toBeDisabled();
  });

  test('Coba cara bermain: semua fase dengan penjelasan, tanpa kode gabung', async ({ browser }) => {
    const tab = await open(browser);
    await tab.goto('./#/ekspedisi');
    await tab.getByRole('button', { name: /Coba cara bermain/ }).click();
    for (const n of ['Gita', 'Hadi']) {
      await tab.locator('[data-name]').fill(n);
      await tab.getByRole('button', { name: 'Tambah' }).click();
    }
    await tab.getByRole('button', { name: 'Lanjut' }).click();
    await tab.getByRole('button', { name: 'Mulai latihan' }).click();
    await expect(tab.locator('[data-coach]')).toContainText('Latihan');
    for (let i = 0; i < 2; i++) {
      await ready(tab);
      await expect(tab.locator('[data-coach]')).toBeVisible();
      if (i === 0) {
        await tab.locator('[data-help]').click();
        await expect(tab.locator('[data-coach]')).toContainText('Fase Diskusi');
      }
      await tab.locator('[data-opt="0"]').click();
      await tab.locator('[data-cont]').click();
      if (await tab.locator('[data-phase][data-p="kedua"]').count()) {
        await tab.locator('[data-opt="0"]').click();
        await tab.locator('[data-cont]').click();
      }
    }
    await expect(tab.locator('.eks-fb-k')).toContainText('Latihan selesai');
    await expect(tab.locator('.eks-recap li')).toHaveCount(4);
  });
});
