/**
 * Anggaran performa (PRD §14.7, §14.12): gagal bila keluaran build melewati batas.
 * JS awal ≤ 250 KB gzip, CSS ≤ 40 KB gzip, font ≤ 350 KB, total precache ≤ 8 MB.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = join(process.cwd(), 'dist');
const KB = 1024;
const files = (function walk(d: string): string[] {
  return readdirSync(d).flatMap((n) =>
    statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)],
  );
})(DIST);

const gz = (f: string): number => gzipSync(readFileSync(f)).length;
const html = readFileSync(join(DIST, 'index.html'), 'utf8');
// JS awal = skrip yang dirujuk index.html beserta impor statisnya (modulepreload)
const initial = [...html.matchAll(/(?:src|href)="\.\/(assets\/[^"]+\.js)"/g)].map((m) => join(DIST, m[1]!));
const jsInitial = initial.reduce((s, f) => s + gz(f), 0);
const css = files.filter((f) => f.endsWith('.css')).reduce((s, f) => s + gz(f), 0);
const fonts = files.filter((f) => f.endsWith('.woff2')).reduce((s, f) => s + statSync(f).size, 0);
const total = files.reduce((s, f) => s + statSync(f).size, 0);
const lazy3d = files
  .filter((f) => /solid3d|three/i.test(f) && f.endsWith('.js'))
  .reduce((s, f) => s + gz(f), 0);

const rows: Array<[string, number, number]> = [
  ['JS awal (gzip)', jsInitial, 250 * KB],
  ['CSS (gzip)', css, 40 * KB],
  ['Font (woff2)', fonts, 350 * KB],
  ['Total precache', total, 8 * KB * KB],
];
if (lazy3d) rows.push(['Potongan 3D (gzip)', lazy3d, 180 * KB]);

let fail = false;
for (const [name, v, max] of rows) {
  const ok = v <= max;
  if (!ok) fail = true;
  console.log(
    `${ok ? 'OK   ' : 'GAGAL'} ${name.padEnd(20)} ${(v / KB).toFixed(1).padStart(8)} KB  / batas ${(max / KB).toFixed(0)} KB`,
  );
}
if (fail) {
  console.error('Anggaran performa terlampaui (PRD §14.7).');
  process.exit(1);
}
