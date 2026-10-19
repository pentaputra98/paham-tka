/**
 * Membuat ikon PNG dari SVG buatan tangan (public/icons/icon.svg) memakai Chromium Playwright.
 * Dijalankan manual bila ikon berubah: `npx tsx scripts/make-icons.ts`. Hasil di-commit.
 */
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const svg = readFileSync('public/icons/icon.svg', 'utf8');
const targets: Array<[string, number]> = [
  ['public/icons/icon-192.png', 192],
  ['public/icons/icon-512.png', 512],
  ['public/icons/icon-maskable-512.png', 512],
  ['public/icons/apple-touch-icon.png', 180],
];

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
for (const [out, size] of targets) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;background:#0E2A5C">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
  );
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: size, height: size } });
  console.log('ikon', out, size);
}
await browser.close();
