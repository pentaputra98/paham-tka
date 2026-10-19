/** Uji kelayakan Motion, kriteria 4: ukuran tambahan gzip per varian (PRD §13.5a). */
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';

const variants: Record<string, string> = {
  'motion (penuh: animate)': "import { animate } from 'motion'; export { animate };",
  'motion (penuh: animate+stagger+spring)':
    "import { animate, stagger, spring } from 'motion'; export { animate, stagger, spring };",
  'motion/mini (animate WAAPI)': "import { animate } from 'motion/mini'; export { animate };",
};

for (const [name, code] of Object.entries(variants)) {
  const dir = mkdtempSync(join(process.cwd(), 'node_modules', '.pt-motion-'));
  const entry = join(dir, 'entry.js');
  writeFileSync(entry, code);
  await build({
    configFile: false,
    logLevel: 'silent',
    root: process.cwd(),
    build: {
      outDir: join(dir, 'out'),
      emptyOutDir: true,
      minify: true,
      lib: { entry, formats: ['es'], fileName: 'm' },
      write: true,
    },
  });
  const f = readdirSync(join(dir, 'out')).find((x) => x.endsWith('.js'))!;
  const buf = readFileSync(join(dir, 'out', f));
  console.log(
    `${name.padEnd(42)} ${(buf.length / 1024).toFixed(1).padStart(6)} KB min  ${(gzipSync(buf).length / 1024).toFixed(1).padStart(5)} KB gzip`,
  );
}
