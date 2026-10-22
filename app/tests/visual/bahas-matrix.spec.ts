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
  ['24-awal', '#/soal/24/bahas?m=amati&b=1&l=0', 4500],
  ['24-soal', '#/soal/24/bahas?m=amati&b=1&l=1', 4000],
  ['24-jari', '#/soal/24/bahas?m=amati&b=2&l=0', 5000],
  ['24-belah', '#/soal/24/bahas?m=amati&b=3&l=1', 6000],
  ['24-potong', '#/soal/24/bahas?m=amati&b=3&l=2', 7000],
  ['24-coret', '#/soal/24/bahas?m=amati&b=3&l=6', 7000],
  ['24-gabung', '#/soal/24/bahas?m=amati&b=4&l=4', 8000],
  ['24-salin', '#/soal/24/bahas?m=amati&b=5&l=4', 5000],
  ['24-uji3', '#/soal/24/bahas?m=amati&b=5&l=6', 7000],
  ['24-uji5', '#/soal/24/bahas?m=amati&b=5&l=10', 7000],
  ['24-catatan', '#/soal/24/bahas?m=amati&b=6', 1500],
  ['24-kartu', '#/soal/24/bahas?m=amati&b=7', 5000],
  ['24-latihan-siap', '#/soal/24/latihan', 1500],
  ['24-latihan-soal', '#/soal/24/latihan?s=00000D-T', 1500],
  ['17-latihan-siap', '#/soal/17/latihan', 1500],
  ['17-latihan-soal', '#/soal/17/latihan?s=00000B-M', 1500],
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
  ['17-tumpuk', '#/soal/17/bahas?m=amati&b=1&l=1', 5500],
  ['17-ukuran', '#/soal/17/bahas?m=amati&b=2&l=2', 6000],
  ['17-hitam', '#/soal/17/bahas?m=amati&b=3&l=1', 9000],
  ['17-lengan', '#/soal/17/bahas?m=amati&b=3&l=5', 6000],
  ['17-kotak', '#/soal/17/bahas?m=amati&b=3&l=7', 6000],
  ['17-putih', '#/soal/17/bahas?m=amati&b=3&l=10', 9000],
  ['17-awas', '#/soal/17/bahas?m=amati&b=3&l=12', 8000],
  ['17-cepat', '#/soal/17/bahas?m=amati&b=4&l=1', 5000],
  ['17-salin', '#/soal/17/bahas?m=amati&b=4&l=6', 4500],
  ['17-pilihan3', '#/soal/17/bahas?m=amati&b=4&l=7', 6500],
  ['17-pilihan5', '#/soal/17/bahas?m=amati&b=4&l=11', 6500],
  ['17-catatan', '#/soal/17/bahas?m=amati&b=5', 1500],
  ['17-kartu', '#/soal/17/bahas?m=amati&b=6', 5000],
  ['18-pahami', '#/soal/18/bahas?m=amati&b=1&l=0', 5000],
  ['18-pintu', '#/soal/18/bahas?m=amati&b=1&l=1', 7000],
  ['18-tumpuk', '#/soal/18/bahas?m=amati&b=1&l=2', 6000],
  ['18-angkat', '#/soal/18/bahas?m=amati&b=2&l=0', 5000],
  ['18-segitiga', '#/soal/18/bahas?m=amati&b=2&l=1', 5000],
  ['18-jari', '#/soal/18/bahas?m=amati&b=2&l=3', 8000],
  ['18-sisi', '#/soal/18/bahas?m=amati&b=3&l=3', 8000],
  ['18-penggaris', '#/soal/18/bahas?m=amati&b=3&l=4', 8000],
  ['18-zona', '#/soal/18/bahas?m=amati&b=4&l=0', 7000],
  ['18-pilihan1', '#/soal/18/bahas?m=amati&b=4&l=2', 7000],
  ['18-catatan', '#/soal/18/bahas?m=amati&b=5', 1500],
  ['18-kartu', '#/soal/18/bahas?m=amati&b=6', 5000],
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
      JSON.stringify({ schemaVersion: 1, visits: 5, installGuideShown: true, welcomeSeen: true }),
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
      test.setTimeout(30_000 + screens.reduce((s, [, , ms]) => s + ms + 2500, 0));
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
