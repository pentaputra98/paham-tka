/**
 * Router berbasis hash (PRD §7.1, §14.4): jalan di https:// dan file://, mendukung tombol kembali,
 * dapat dibagikan. Contoh: #/soal/5/bahas?b=2&l=1&m=amati
 */
export type RouteName =
  'home' | 'detail' | 'bahas' | 'latihan' | 'catatan' | 'kemajuan' | 'pengaturan' | 'tentang';

export interface Route {
  name: RouteName;
  no?: number;
  query: Record<string, string>;
  /** kedalaman navigasi untuk arah transisi (maju ke kiri, mundur ke kanan) */
  depth: number;
}

const DEPTH: Record<RouteName, number> = {
  home: 0,
  kemajuan: 1,
  pengaturan: 1,
  tentang: 1,
  detail: 1,
  bahas: 2,
  latihan: 2,
  catatan: 2,
};

/** Fungsi murni: hash → rute. Rute yang tidak dikenal menjadi beranda. */
export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, '');
  const [pathPart = '', queryPart = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const query: Record<string, string> = {};
  for (const [k, v] of new URLSearchParams(queryPart)) query[k] = v;

  const mk = (name: RouteName, no?: number): Route => ({ name, no, query, depth: DEPTH[name] });

  if (parts.length === 0) return mk('home');
  const [a, b, c] = parts;
  if (a === 'soal' && b && /^\d{1,2}$/.test(b)) {
    const no = Number(b);
    if (no < 1 || no > 25) return mk('home');
    if (parts.length === 2) return mk('detail', no);
    if (parts.length === 3 && (c === 'bahas' || c === 'latihan' || c === 'catatan')) return mk(c, no);
    return mk('home');
  }
  if (parts.length === 1 && (a === 'kemajuan' || a === 'pengaturan' || a === 'tentang')) return mk(a);
  return mk('home');
}

/** Rute → hash kanonis. */
export function toHash(r: Pick<Route, 'name' | 'no'> & { query?: Record<string, string> }): string {
  const q = r.query && Object.keys(r.query).length ? `?${new URLSearchParams(r.query).toString()}` : '';
  switch (r.name) {
    case 'home':
      return `#/${q}`;
    case 'detail':
      return `#/soal/${r.no}${q}`;
    case 'bahas':
    case 'latihan':
    case 'catatan':
      return `#/soal/${r.no}/${r.name}${q}`;
    default:
      return `#/${r.name}${q}`;
  }
}

type Listener = (to: Route, from: Route | null) => void;

export function createRouter(onChange: Listener): {
  current: () => Route;
  go: (hash: string, opts?: { replace?: boolean }) => void;
  start: () => void;
} {
  let cur: Route | null = null;

  const handle = (): void => {
    const next = parseHash(location.hash);
    const prev = cur;
    cur = next;
    onChange(next, prev);
  };

  return {
    current: () => cur ?? parseHash(location.hash),
    go(hash, opts) {
      if (opts?.replace) {
        history.replaceState(null, '', hash);
        handle();
      } else if (location.hash === hash) {
        handle();
      } else {
        location.hash = hash;
      }
    },
    start() {
      window.addEventListener('hashchange', handle);
      handle();
    },
  };
}
