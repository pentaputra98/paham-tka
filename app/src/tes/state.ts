/**
 * Penyimpanan tes penguasaan di perangkat (localStorage, PRD §14.5, §15.2): identitas terakhir, tes yang
 * sedang dikerjakan (bertahan saat halaman dimuat ulang; waktu tetap berjalan), dan riwayat percobaan.
 * Data rusak tidak pernah membuat aplikasi gagal: bagian yang tidak sah dibuang.
 */
import { storage } from '../core/storage';
import { MATERI, type Resp, type TesItem } from './types';

export const KEY_TES = 'pahamtka:v1:tes';
/** riwayat dibatasi agar penyimpanan tidak penuh (satu percobaan ≈ 20 KB) */
export const HISTORY_MAX = 40;

export interface Profile {
  name: string;
  school: string;
}

export interface Active extends Profile {
  id: string;
  seed: number;
  start: number;
  deadline: number;
  items: TesItem[];
  resps: Resp[];
  cur: number;
}

export interface Attempt extends Profile {
  id: string;
  /** percobaan ke-n untuk nama dan sekolah ini */
  no: number;
  seed: number;
  start: number;
  end: number;
  limitMs: number;
  msUsed: number;
  /** dikumpulkan otomatis karena waktu habis */
  timeUp: boolean;
  items: TesItem[];
  resps: Resp[];
}

interface TesState {
  schemaVersion: 1;
  profile: Profile | null;
  active: Active | null;
  history: Attempt[];
}

type Json = Record<string, unknown>;
const isObj = (v: unknown): v is Json => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const num = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

function okItem(v: unknown): v is TesItem {
  if (!isObj(v)) return false;
  return (
    typeof v.tid === 'string' &&
    MATERI.includes(v.materi as never) &&
    ['single', 'multi', 'tf'].includes(v.kind as string) &&
    typeof v.paper === 'string' &&
    Array.isArray(v.options) &&
    Array.isArray(v.ok) &&
    v.options.length === v.ok.length
  );
}

function resp(v: unknown, it: TesItem): Resp {
  const r = isObj(v) ? v : {};
  const n = it.options.length;
  return {
    pick: Array.isArray(r.pick)
      ? r.pick.filter((x): x is number => Number.isInteger(x) && (x as number) >= 0 && (x as number) < n)
      : [],
    tf:
      it.kind === 'tf'
        ? it.options.map((_, i) => {
            const x = Array.isArray(r.tf) ? (r.tf as unknown[])[i] : null;
            return typeof x === 'boolean' ? x : null;
          })
        : [],
    flag: r.flag === true,
    ms: num(r.ms),
  };
}

function items(v: unknown): { items: TesItem[]; resps: Resp[] } | null {
  const o = isObj(v) ? v : {};
  if (!Array.isArray(o.items) || !o.items.length || !o.items.every(okItem)) return null;
  const its = o.items;
  const rs = Array.isArray(o.resps) ? o.resps : [];
  return { items: its, resps: its.map((it, i) => resp(rs[i], it)) };
}

export function migrateTes(raw: unknown): TesState {
  const o = isObj(raw) ? raw : {};
  const p = isObj(o.profile) ? o.profile : null;
  const profile = p && str(p.name) ? { name: str(p.name), school: str(p.school) } : null;
  let active: Active | null = null;
  if (isObj(o.active)) {
    const a = o.active;
    const body = items(a);
    if (body && str(a.id) && num(a.deadline) > 0)
      active = {
        id: str(a.id),
        seed: num(a.seed),
        start: num(a.start),
        deadline: num(a.deadline),
        name: str(a.name),
        school: str(a.school),
        cur: Math.max(0, Math.min(body.items.length - 1, Math.floor(num(a.cur)))),
        ...body,
      };
  }
  const history: Attempt[] = [];
  for (const h of Array.isArray(o.history) ? o.history : []) {
    if (!isObj(h)) continue;
    const body = items(h);
    if (!body || !str(h.id)) continue;
    history.push({
      id: str(h.id),
      no: Math.max(1, num(h.no)),
      seed: num(h.seed),
      start: num(h.start),
      end: num(h.end),
      limitMs: num(h.limitMs),
      msUsed: num(h.msUsed),
      timeUp: h.timeUp === true,
      name: str(h.name),
      school: str(h.school),
      ...body,
    });
  }
  return { schemaVersion: 1, profile, active, history };
}

let state: TesState = load();

function load(): TesState {
  try {
    return migrateTes(JSON.parse(storage.get(KEY_TES) ?? 'null'));
  } catch {
    return migrateTes(null);
  }
}

function persist(): void {
  storage.set(KEY_TES, JSON.stringify(state));
}

/** Nama dan sekolah dinormalkan: huruf kecil, spasi tunggal (percobaan ke-n dihitung per identitas). */
export const identity = (p: Profile): string =>
  `${p.name}|${p.school}`.toLowerCase().replace(/\s+/g, ' ').trim();

/** parameter oracle tidak ikut disimpan */
const strip = (its: TesItem[]): TesItem[] => its.map(({ params: _p, ...rest }) => rest);

export const tes = {
  /** muat ulang dari penyimpanan (mis. setelah "Hapus semua data") */
  reload(): void {
    state = load();
  },
  get profile(): Profile | null {
    return state.profile;
  },
  get active(): Active | null {
    return state.active;
  },
  get history(): readonly Attempt[] {
    return state.history;
  },
  setProfile(p: Profile): void {
    state = { ...state, profile: { name: p.name.trim(), school: p.school.trim() } };
    persist();
  },
  start(p: Profile, seed: number, its: TesItem[], resps: Resp[], limitMs: number, now = Date.now()): Active {
    const a: Active = {
      id: `${now.toString(36)}${seed.toString(36).slice(-3)}`,
      seed,
      start: now,
      deadline: now + limitMs,
      name: p.name.trim(),
      school: p.school.trim(),
      items: strip(its),
      resps,
      cur: 0,
    };
    state = { ...state, active: a };
    persist();
    return a;
  },
  /** simpan jawaban dan posisi soal tes yang sedang berjalan */
  saveActive(): void {
    if (state.active) persist();
  },
  cancelActive(): void {
    state = { ...state, active: null };
    persist();
  },
  /** Kumpulkan tes yang sedang berjalan → satu percobaan di riwayat. */
  submit(timeUp: boolean, now = Date.now()): Attempt | null {
    const a = state.active;
    if (!a) return null;
    const limitMs = a.deadline - a.start;
    const same = state.history.filter((h) => identity(h) === identity(a));
    const at: Attempt = {
      id: a.id,
      no: same.reduce((m, h) => Math.max(m, h.no), 0) + 1,
      seed: a.seed,
      start: a.start,
      end: Math.min(now, a.deadline),
      limitMs,
      msUsed: Math.max(0, Math.min(limitMs, now - a.start)),
      timeUp,
      name: a.name,
      school: a.school,
      items: a.items,
      resps: a.resps,
    };
    state = { ...state, active: null, history: [...state.history, at].slice(-HISTORY_MAX) };
    persist();
    return at;
  },
  get(id: string): Attempt | undefined {
    return state.history.find((h) => h.id === id);
  },
  /** percobaan milik identitas yang sama, urut waktu */
  sameAs(p: Profile): Attempt[] {
    return state.history.filter((h) => identity(h) === identity(p)).sort((x, y) => x.start - y.start);
  },
  clearHistory(): void {
    state = { ...state, history: [] };
    persist();
  },
};
