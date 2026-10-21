import { expect, test } from '@playwright/test';
import { isReady } from '../../src/content';

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
const ALL: Array<[string, string, number]> = [
  ['1-lobi', '#/soal/1/bahas?m=amati', 900],
  ['1-catatan', '#/soal/1/bahas?m=amati&b=4', 1200],
  ['1-selesai', '#/soal/1/bahas?m=amati&b=6', 3500],
  ['1-latihan-siap', '#/soal/1/latihan', 1500],
  ['1-latihan-soal', '#/soal/1/latihan?s=00ABCD-T', 1500],
  ['1-latihan-mudah', '#/soal/1/latihan?s=000777-M', 1500],
  ['lobi', '#/soal/25/bahas?m=amati', 900],
  ['papan', '#/soal/25/bahas?m=amati&b=2&l=1', 6500],
  ['faktor', '#/soal/25/bahas?m=amati&b=3&l=1', 6500],
  ['kartu', '#/soal/25/bahas?m=amati&b=6&l=5', 5000],
  ['catatan', '#/soal/25/bahas?m=amati&b=5', 1200],
  ['24-pahami', '#/soal/24/bahas?m=amati&b=1&l=1', 5000],
  ['24-rumus', '#/soal/24/bahas?m=amati&b=2&l=0', 6500],
  ['24-lab', '#/soal/24/bahas?m=amati&b=2&l=3', 2500],
  ['24-pernyataan', '#/soal/24/bahas?m=amati&b=3&l=3', 6500],
  ['17-pahami', '#/soal/17/bahas?m=amati&b=1&l=2', 5000],
  ['17-luas', '#/soal/17/bahas?m=amati&b=2&l=3', 6500],
  ['17-banding', '#/soal/17/bahas?m=amati&b=3&l=3', 6500],
  ['17-kartu', '#/soal/17/bahas?m=amati&b=5&l=5', 5000],
  ['18-pahami', '#/soal/18/bahas?m=amati&b=1&l=0', 5000],
  ['18-3d', '#/soal/18/bahas?m=amati&b=2&l=0', 7000],
  ['18-logam', '#/soal/18/bahas?m=amati&b=3&l=4', 7000],
  ['18-kartu', '#/soal/18/bahas?m=amati&b=5&l=3', 5000],
  ['1-pahami', '#/soal/1/bahas?m=amati&b=1&l=1', 5000],
  ['1-cepat', '#/soal/1/bahas?m=amati&b=2&l=1', 7000],
  ['1-3x3', '#/soal/1/bahas?m=amati&b=2&l=3', 6000],
  ['1-uji', '#/soal/1/bahas?m=amati&b=3&l=2', 7000],
  ['1-kartu', '#/soal/1/bahas?m=amati&b=5&l=0', 5000],
  ['2-pahami', '#/soal/2/bahas?m=amati&b=1&l=2', 5000],
  ['2-matriks', '#/soal/2/bahas?m=amati&b=2&l=1', 6500],
  ['2-invers', '#/soal/2/bahas?m=amati&b=3&l=1', 7000],
  ['2-kartu', '#/soal/2/bahas?m=amati&b=5&l=5', 5000],
  ['5-lab', '#/soal/5/bahas?m=amati&b=2&l=0', 5000],
  ['5-uji', '#/soal/5/bahas?m=amati&b=2&l=4', 7000],
  ['5-kartu', '#/soal/5/bahas?m=amati&b=4&l=5', 5000],
  ['16-gambar', '#/soal/16/bahas?m=amati&b=1&l=1', 5000],
  ['16-singgung', '#/soal/16/bahas?m=amati&b=3&l=0', 7000],
  ['16-uji', '#/soal/16/bahas?m=amati&b=3&l=4', 7000],
  ['16-kartu', '#/soal/16/bahas?m=amati&b=5&l=5', 5000],
  ['13-titik', '#/soal/13/bahas?m=amati&b=2&l=1', 7000],
  ['13-kaki', '#/soal/13/bahas?m=amati&b=2&l=3', 7000],
  ['13-kartu', '#/soal/13/bahas?m=amati&b=4&l=5', 5000],
  ['6-sisa', '#/soal/6/bahas?m=amati&b=2&l=0', 6500],
  ['6-hasilbagi', '#/soal/6/bahas?m=amati&b=2&l=1', 6500],
  ['6-ab', '#/soal/6/bahas?m=amati&b=3&l=1', 7000],
];
// hanya soal yang dibuka (PRD v1.6: soal lain dikunci sementara)
const SCREENS = ALL.filter(([, hash]) => isReady(Number(/soal\/(\d+)/.exec(hash)![1])));
const NO_CLIP =
  '.btn, .seg button, .cap-k, .bd-t, .tblock .tb-n, .stamp, .front .num, .facts dd, .lat-opt-m, .lat-level';

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

// satu uji per ukuran × soal agar batas waktu per uji tetap wajar saat soal bertambah
const BY_SOAL = new Map<string, typeof SCREENS>();
for (const sc of SCREENS) {
  const no = /#\/soal\/(\d+)/.exec(sc[1])![1]!;
  BY_SOAL.set(no, [...(BY_SOAL.get(no) ?? []), sc]);
}

for (const [w, h] of SIZES) {
  for (const [no, screens] of BY_SOAL)
    test(`pembahasan ${w}×${h} soal ${no}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      for (const [name, hash, wait] of screens) {
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
