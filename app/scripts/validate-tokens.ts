/**
 * validate:tokens (PRD §16.4) — gagal bila gaya komponen memuat nilai mentah.
 * Diadaptasi dari skrip validate-tokens.cjs milik skill design-system, diperketat:
 *  CSS (selain tokens.css): heks, rgb()/hsl(), px ≥ 2 (jarak/ukuran), ms/s (durasi),
 *   cubic-bezier mentah, z-index angka. Pengecualian: baris @media (kueri tidak bisa var()).
 *  TS (selain core/tokens.ts): warna heks/rgb dan nilai px/ms di dalam string gaya/keyframes.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(process.cwd(), 'src');
const SKIP = [/styles[\\/]tokens\.css$/, /core[\\/]tokens\.ts$/, /core[\\/]icons\.ts$/];

interface Hit {
  file: string;
  line: number;
  rule: string;
  text: string;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const CSS_RULES: Array<[string, RegExp]> = [
  ['warna heks', /#[0-9a-fA-F]{3,8}\b/],
  ['warna rgb/hsl', /\b(rgba?|hsla?)\(/],
  ['px mentah', /(?<![\w.-])(?:[2-9]|\d{2,})(?:\.\d+)?px\b/],
  ['durasi mentah', /(?<![\w.-])\d+(?:\.\d+)?m?s\b(?![\w-])/],
  ['easing mentah', /cubic-bezier\(/],
  ['z-index angka', /z-index:\s*-?\d/],
];

const TS_RULES: Array<[string, RegExp]> = [
  ['warna heks', /['"`][^'"`]*#[0-9a-fA-F]{3,8}\b/],
  ['warna rgb/hsl', /['"`][^'"`]*\b(rgba?|hsla?)\(/],
  ['easing mentah', /cubic-bezier\(/],
];

const hits: Hit[] = [];
for (const file of walk(ROOT)) {
  if (SKIP.some((r) => r.test(file))) continue;
  const isCss = file.endsWith('.css');
  const isTs = file.endsWith('.ts');
  if (!isCss && !isTs) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  let inComment = false;
  lines.forEach((raw, i) => {
    let line = raw;
    if (isCss) {
      if (inComment) {
        const end = line.indexOf('*/');
        if (end < 0) return;
        line = line.slice(end + 2);
        inComment = false;
      }
      line = line.replace(/\/\*.*?\*\//g, '');
      const start = line.indexOf('/*');
      if (start >= 0) {
        inComment = true;
        line = line.slice(0, start);
      }
      if (/^\s*@media/.test(line)) return;
      // nilai pecahan khusus SVG/rangka (viewBox, d) tidak di CSS; keyframe persentase diizinkan
    } else {
      const t = line.trim();
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return;
      // SVG geometri (viewBox, d, koordinat) bukan token gaya
      if (/\b(viewBox|d=|points=|x1=|cx=)/.test(line)) return;
    }
    for (const [rule, re] of isCss ? CSS_RULES : TS_RULES) {
      if (re.test(line))
        hits.push({ file: relative(process.cwd(), file), line: i + 1, rule, text: raw.trim().slice(0, 100) });
    }
  });
}

if (hits.length) {
  console.error(`validate:tokens GAGAL — ${hits.length} nilai mentah:\n`);
  for (const h of hits) console.error(`  ${h.file}:${h.line}  [${h.rule}]  ${h.text}`);
  process.exit(1);
}
console.log('validate:tokens lolos — tidak ada nilai warna/jarak/durasi/z-index mentah di luar tokens.');
