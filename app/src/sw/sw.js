/* Service worker Paham TKA — "online sekali, offline selamanya" (PRD §14.6, §14.12).
 * Templat: daftar precache dan versi disuntikkan saat build (vite.config.ts → paham-sw).
 * - install: unduh SEMUA aset ke cache versi ini; gagal satu = instalasi gagal (atomik).
 * - activate: hapus cache versi lama; ambil alih halaman.
 * - fetch: cache dahulu untuk asal sendiri; navigasi → index dari cache.
 * - pembaruan: versi baru menunggu sampai siswa menekan "Muat ulang" (SKIP_WAITING).
 */
const VERSION = '__SW_VERSION__';
const PREFIX = 'pahamtka-';
const CACHE = `${PREFIX}${VERSION}`;
const FILES = self.__PRECACHE__;

const toUrl = (f) => new URL(f, self.registration.scope).href;

async function broadcast(msg) {
  const list = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  for (const c of list) c.postMessage(msg);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const total = FILES.length;
      let done = 0;
      let lastPct = -1;
      const isUpdate = !!self.registration.active;
      try {
        // unduh berurutan dalam kelompok kecil agar tidak membebani HP kelas menengah
        const queue = [...FILES];
        const worker = async () => {
          while (queue.length) {
            const f = queue.shift();
            const url = toUrl(f);
            const hit = await cache.match(url, { ignoreVary: true });
            if (!hit) {
              const res = await fetch(new Request(url, { cache: 'reload', credentials: 'same-origin' }));
              if (!res.ok) throw new Error(`${res.status} ${f}`);
              await cache.put(url, res);
            }
            done++;
            const pct = Math.floor((done / total) * 100);
            if (pct !== lastPct) {
              lastPct = pct;
              await broadcast({ type: 'precache-progress', version: VERSION, done, total, isUpdate });
            }
          }
        };
        await Promise.all([worker(), worker(), worker(), worker()]);
        await broadcast({ type: 'precache-complete', version: VERSION, total, isUpdate });
      } catch (err) {
        await caches.delete(CACHE);
        await broadcast({ type: 'precache-error', version: VERSION, message: String(err), isUpdate });
        throw err;
      }
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/sw.js')) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (req.mode === 'navigate') {
        const shell =
          (await cache.match(toUrl('./'), { ignoreVary: true })) ||
          (await cache.match(toUrl('./index.html'), { ignoreVary: true }));
        if (shell) return shell;
      }
      const hit = await cache.match(req.url, { ignoreSearch: true, ignoreVary: true });
      if (hit) return hit;
      try {
        return await fetch(req);
      } catch {
        return new Response('', { status: 504, statusText: 'Offline' });
      }
    })(),
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (data.type === 'CHECK') {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE);
        const missing = [];
        for (const f of FILES) if (!(await cache.match(toUrl(f), { ignoreVary: true }))) missing.push(f);
        const reply = { type: 'check-result', version: VERSION, total: FILES.length, missing };
        if (event.ports && event.ports[0]) event.ports[0].postMessage(reply);
        else if (event.source) event.source.postMessage(reply);
      })(),
    );
  }
});
