/**
 * verify:content (PRD §9.5, §10): memeriksa daftar soal dan setiap modul konten soal.
 * Aturan per soal ada di src/engine/validate.ts agar dapat dipakai ulang oleh uji unit.
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { RELEASE_1, SOAL } from '../src/content/index';

const errors: string[] = [];
const warns: string[] = [];

// ---- daftar 25 soal ----
if (SOAL.length !== 25) errors.push(`daftar soal berisi ${SOAL.length}, seharusnya 25`);
SOAL.forEach((s, i) => {
  if (s.no !== i + 1) errors.push(`urutan soal salah di indeks ${i}: ${s.no}`);
  if (!s.title.trim()) errors.push(`soal ${s.no}: judul kosong`);
  if (s.response === 'truefalse' && !s.labels) errors.push(`soal ${s.no}: truefalse tanpa labels`);
});
const ready = SOAL.filter((s) => s.status === 'ready').map((s) => s.no);
if (ready.join() !== [...RELEASE_1].sort((a, b) => a - b).join())
  errors.push(`status ready (${ready.join(', ')}) tidak sama dengan Rilis 1 (K10)`);

// ---- modul konten soal ----
const dir = join(process.cwd(), 'src/content/soal');
const mods = readdirSync(dir).filter((f) => /^q\d{2}\.ts$/.test(f));
let validated = 0;
if (mods.length) {
  const { validateSoal } = (await import(
    pathToFileURL(join(process.cwd(), 'src/engine/validate.ts')).href
  )) as {
    validateSoal: (c: unknown) => { errors: string[]; warns: string[] };
  };
  for (const f of mods) {
    const mod = (await import(pathToFileURL(join(dir, f)).href)) as { default: unknown };
    const r = validateSoal(mod.default);
    errors.push(...r.errors.map((e) => `${f}: ${e}`));
    warns.push(...r.warns.map((e) => `${f}: ${e}`));
    validated++;
  }
}

for (const w of warns) console.warn(`peringatan  ${w}`);
if (errors.length) {
  console.error(`verify:content GAGAL (${errors.length}):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(
  `verify:content lolos — 25 soal terdaftar, ${ready.length} dibuka, ${validated} modul konten diperiksa.`,
);
