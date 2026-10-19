/// <reference types="vitest/config" />
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/** Header produksi (vercel.json) juga dipasang di vite preview agar CSP teruji sebelum rilis. */
const vercel = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8')) as {
  headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
};
const prodHeaders = Object.fromEntries(vercel.headers[0]!.headers.map((h) => [h.key, h.value]));

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version: string;
};

/** Keluarga font KaTeX yang dipakai rumus sekolah; sisanya tidak dibundel (anggaran font §14.7). */
const KATEX_KEEP = /KaTeX_(AMS|Main|Math|Size[1-4])\b/;

/**
 * KaTeX: hanya woff2 dan hanya keluarga yang dipakai. Keluarga lain jatuh ke cadangan
 * sistem; rumus TKA tidak memakai Fraktur/Script/Typewriter/Caligraphic/SansSerif.
 */
function katexFonts(): Plugin {
  return {
    name: 'paham-katex-fonts',
    enforce: 'pre',
    transform(code, id) {
      if (!/katex(-swap)?(\.min)?\.css$/.test(id.split('?')[0] ?? '')) return null;
      const out = code
        .replace(/@font-face\{[^}]*\}/g, (face) => (KATEX_KEEP.test(face) ? face : ''))
        .replace(/,url\([^)]+\.woff\) format\("woff"\)/g, '')
        .replace(/,url\([^)]+\.ttf\) format\("truetype"\)/g, '');
      return { code: out, map: null };
    },
  };
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/**
 * Service worker sendiri (PRD §14.6, §14.12): daftar precache ber-hash dibuat saat build
 * dari seluruh berkas keluaran + isi public/, lalu disuntikkan ke templat src/sw/sw.js.
 */
function pahamServiceWorker(): Plugin {
  return {
    name: 'paham-sw',
    apply: 'build',
    enforce: 'post',
    generateBundle(_opts, bundle) {
      const publicDir = join(process.cwd(), 'public');
      const publicFiles = walk(publicDir)
        .map((p) => relative(publicDir, p).replaceAll('\\', '/'))
        .filter((p) => !p.endsWith('.DS_Store'));
      const bundleFiles = Object.keys(bundle).filter((f) => !f.endsWith('.map') && f !== 'index.html');
      const files = ['./', './index.html', ...[...bundleFiles, ...publicFiles].sort().map((f) => `./${f}`)];
      const hash = createHash('sha256');
      for (const f of bundleFiles.sort()) hash.update(f);
      for (const f of publicFiles.sort()) hash.update(readFileSync(join(publicDir, f)));
      hash.update(pkg.version);
      const version = `${pkg.version}-${hash.digest('hex').slice(0, 10)}`;
      const template = readFileSync(join(process.cwd(), 'src/sw/sw.js'), 'utf8');
      const source = template
        .replace('self.__PRECACHE__', JSON.stringify(files))
        .replace('__SW_VERSION__', version);
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
      this.emitFile({
        type: 'asset',
        fileName: 'precache-manifest.json',
        source: JSON.stringify({ version, files }, null, 2),
      });
    },
  };
}

export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [katexFonts(), pahamServiceWorker()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    sourcemap: false,
    modulePreload: { polyfill: false },
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true, headers: { ...prodHeaders, 'Cache-Control': 'no-cache' } },
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.ts'],
  },
});
