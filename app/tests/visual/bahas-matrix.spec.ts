import { expect, test } from '@playwright/test';

/** Matriks viewport PRD §16.2 untuk pembahasan (G-Visual): lobi, papan, kartu, catatan. */
const SIZES: Array<[number, number]> = [
  [667, 360],
  [780, 360],
  [812, 375],
  [844, 390],
  [915, 412],
  [1024, 600],
  [1024, 768],
  [1280, 720],
  [1366, 768],
  [1440, 860],
  [1920, 1080],
];
const SCREENS: Array<[string, string, number]> = [
  ['lobi', '#/soal/25/bahas?m=amati', 900],
  ['papan', '#/soal/25/bahas?m=amati&b=2&l=1', 6500],
  ['faktor', '#/soal/25/bahas?m=amati&b=3&l=1', 6500],
  ['kartu', '#/soal/25/bahas?m=amati&b=6&l=5', 5000],
  ['catatan', '#/soal/25/bahas?m=amati&b=5', 1200],
];
const NO_CLIP = '.btn, .seg button, .cap-k, .bd-t, .tblock .tb-n, .stamp, .front .num, .facts dd';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'pahamtka:v1:settings',
      JSON.stringify({ schemaVersion: 1, speed: 1.5, motion: 'full', sfx: false }),
    );
    localStorage.setItem(
      'pahamtka:v1:ui',
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true }),
    );
  });
});

for (const [w, h] of SIZES) {
  test(`pembahasan ${w}×${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    for (const [name, hash, wait] of SCREENS) {
      await page.goto(`./${hash}`);
      await page.waitForTimeout(wait);
      await page.screenshot({ path: `tests/visual/__out__/bahas-${w}x${h}-${name}.png` });
      const r = await page.evaluate((sel) => {
        const vis = (e: HTMLElement): boolean => e.offsetParent !== null;
        const clipped = [...document.querySelectorAll<HTMLElement>(sel)]
          .filter((e) => vis(e) && e.scrollWidth > e.clientWidth + 1)
          .map((e) => `${e.className}: ${(e.textContent ?? '').trim().slice(0, 24)}`);
        // baris rumus tidak boleh lebih lebar dari papan (tidak terpotong)
        const rows = [...document.querySelectorAll<HTMLElement>('.bd-lines .bl-m')]
          .filter(
            (e) =>
              vis(e) &&
              e.getBoundingClientRect().right > e.closest('.bd-lines')!.getBoundingClientRect().right + 1,
          )
          .map((e) => (e.closest('.bl') as HTMLElement).dataset.row);
        // baris papan tidak boleh bertumpuk secara vertikal
        const bl = [...document.querySelectorAll<HTMLElement>('.bd-lines .bl')]
          .filter(vis)
          .map((e) => e.getBoundingClientRect());
        const overlap = bl.slice(1).filter((b, i) => b.top < bl[i]!.bottom - 1).length;
        const cap = document.querySelector<HTMLElement>('.cap');
        const capOver = cap && vis(cap) && cap.scrollHeight > cap.clientHeight + 1;
        return {
          hscroll: document.documentElement.scrollWidth > innerWidth,
          clipped,
          rows,
          capOver,
          overlap,
        };
      }, NO_CLIP);
      expect(r.hscroll, `${name}: gulir horizontal`).toBe(false);
      expect(r.clipped, `${name}: teks terpotong`).toEqual([]);
      expect(r.rows, `${name}: baris papan melebihi papan`).toEqual([]);
      expect(r.capOver, `${name}: pop-up meluap`).toBeFalsy();
      expect(r.overlap, `${name}: baris papan bertumpuk`).toBe(0);
    }
  });
}
