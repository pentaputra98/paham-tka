import { expect, test, type Browser, type Page } from '@playwright/test';
import { gameItem } from '../../src/eks/bank';
import { hash32 } from '../../src/eks/codes';

/** Ekspedisi TKA (v1.26): Game Master di satu konteks, tablet kelompok di konteks lain. */
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
  await expect(gm.getByRole('heading', { name: 'Kode gabung kelompok' })).toBeVisible();
  const join = (await gm.locator('.eks-joins b').first().textContent())!.trim();
  await gm.keyboard.press('Escape');
  await gm.locator('[data-run]').click();
  await expect(gm.locator('[data-gm-state]')).toHaveText('Berjalan');
  return join;
}

async function teamJoin(tab: Page, join: string, names: string[]): Promise<void> {
  await tab.goto('./#/ekspedisi');
  await tab.getByRole('button', { name: /Masuk sebagai kelompok/ }).click();
  await tab.locator('[data-code]').fill(join.toLowerCase());
  await tab.locator('.kb [data-k="next"]').click();
  for (const n of names) {
    await tab.locator('[data-name]').fill(n);
    await tab.locator('.kb [data-k="next"]').click();
  }
  await expect(tab.locator('.eks-names li')).toHaveCount(names.length);
  await tab.locator('.kb [data-k="close"]').click();
  await tab.getByRole('button', { name: 'Acak giliran' }).click();
  await expect(tab.locator('.eks-order li')).toHaveCount(names.length);
  await tab.getByRole('button', { name: 'Buka peta pos' }).click();
}

const seedOf = (join: string): number => hash32(`${join.slice(0, 4)}|${Number(join[5])}`);

test.describe('Ekspedisi TKA', () => {
  test('Game Master berkata sandi → kelompok bergabung → pos benar semua → kode bukti → peringkat', async ({
    browser,
  }) => {
    const errors: string[] = [];
    const gm = await open(browser);
    const tab = await open(browser);
    for (const p of [gm, tab]) p.on('pageerror', (e) => errors.push(e.message));
    const join = await gmStart(gm, 3);
    const names = ['Ana', 'Bimo', 'Citra', 'Dodi'];
    await teamJoin(tab, join, names);
    const seed = seedOf(join);

    await tab.locator('[data-pos="1"]').click();
    const seen: string[] = [];
    for (let i = 0; i < 3; i++) {
      const who = (await tab.locator('.eks-veil-who').textContent())!;
      seen.push(who);
      await tab.locator('[data-ready]').click();
      await expect(tab.locator('[data-phase]')).toContainText('Fase Mandiri');
      await tab.locator(`[data-opt="${gameItem(seed, 1, i).ok}"]`).click();
      await expect(tab.locator('.eks-fb-big')).toHaveText('+10');
      await tab.locator('[data-cont]').click();
    }
    // tiga penjawab berbeda dalam satu putaran
    expect(new Set(seen).size).toBe(3);
    await expect(tab.locator('.eks-report h2')).toContainText('35 poin');
    const code = (await tab.locator('.eks-code').textContent())!.trim();

    await gm.locator('[data-proof]').fill(code.toLowerCase());
    await gm.locator('[data-record]').click();
    await expect(gm.locator('[data-msg]')).toContainText('Kelompok 1 · Lingkaran Kilat · +35');
    await expect(gm.locator('.eks-rank li').first()).toContainText('35');
    // kode yang sama dua kali ditolak; kode karangan ditolak
    await gm.locator('[data-proof]').fill(code);
    await gm.locator('[data-record]').click();
    await expect(gm.locator('[data-msg]')).toContainText('sudah dicatat');
    await gm.locator('[data-proof]').fill('AAAAA');
    await gm.locator('[data-record]').click();
    await expect(gm.locator('[data-msg]')).toContainText('tidak dikenali');
    expect(errors).toEqual([]);
  });

  test('jawaban salah: jebakan tampil, kesempatan kedua; pos yang ditinggal tidak bisa diulang', async ({
    browser,
  }) => {
    const gm = await open(browser);
    const tab = await open(browser);
    const join = await gmStart(gm, 2);
    await teamJoin(tab, join, ['Eka', 'Fajar']);
    const seed = seedOf(join);

    await tab.locator('[data-pos="2"]').click();
    await tab.locator('[data-ready]').click();
    const it = gameItem(seed, 2, 0);
    const bad = it.ok === 0 ? 1 : 0;
    await tab.locator(`[data-opt="${bad}"]`).click();
    await expect(tab.locator('.eks-fb-k')).toContainText('Kena jebakan');
    await tab.getByRole('button', { name: 'Kesempatan kedua' }).click();
    await expect(tab.locator('[data-phase]')).toContainText('Kesempatan kedua');
    await tab.locator(`[data-opt="${gameItem(seed, 2, 0, 1).ok}"]`).click();
    await expect(tab.locator('.eks-fb-big')).toHaveText('+3');
    await tab.locator('[data-cont]').click();

    // soal 2 dibuka lalu ditinggal (muat ulang): dihitung hangus, lanjut ke soal 3
    await tab.locator('[data-ready]').click();
    await tab.reload();
    await expect(tab.locator('.eks-pos[data-pos="2"]')).toContainText('Lanjutkan');
    await tab.locator('[data-pos="3"]').click();
    await expect(tab.locator('.toast').last()).toContainText('Selesaikan dulu pos Gelombang');
    await tab.locator('[data-pos="2"]').click();
    await expect(tab.locator('.toast').last()).toContainText('hangus');
    await expect(tab.locator('.eks-veil-c .eyebrow')).toContainText('soal 3 dari 3');
  });

  test('Coba cara bermain: 2 soal latihan tanpa kode gabung', async ({ browser }) => {
    const tab = await open(browser);
    await tab.goto('./#/ekspedisi');
    await tab.getByRole('button', { name: /Coba cara bermain/ }).click();
    for (const n of ['Gita', 'Hadi']) {
      await tab.locator('[data-name]').fill(n);
      await tab.locator('.kb [data-k="next"]').click();
    }
    await tab.locator('.kb [data-k="close"]').click();
    await tab.getByRole('button', { name: 'Acak giliran' }).click();
    await tab.getByRole('button', { name: 'Mulai latihan' }).click();
    for (let i = 0; i < 2; i++) {
      await tab.locator('[data-ready]').click();
      await tab.locator('[data-help]').click();
      await expect(tab.locator('[data-phase]')).toContainText('Fase Diskusi');
      await tab.locator('[data-opt="0"]').click();
      await tab.locator('[data-cont]').click();
      if (await tab.locator('[data-phase][data-p="kedua"]').count()) {
        await tab.locator('[data-opt="0"]').click();
        await tab.locator('[data-cont]').click();
      }
    }
    await expect(tab.locator('.eks-fb-k')).toContainText('Latihan selesai');
  });
});
