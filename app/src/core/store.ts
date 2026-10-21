/**
 * Penyimpanan keadaan kecil (PRD §14.4, §14.5): pengaturan dan kemajuan di localStorage,
 * masing-masing dengan `schemaVersion` dan migrasi. Semua mutasi lewat fungsi bernama.
 */
import { storage } from './storage';

export const KEY_SETTINGS = 'pahamtka:v1:settings';
export const KEY_PROGRESS = 'pahamtka:v1:progress';
export const KEY_PROFILE = 'pahamtka:v1:profile';
export const KEY_UI = 'pahamtka:v1:ui';

export type Speed = 0.75 | 1 | 1.5;
export type MotionPref = 'system' | 'reduce' | 'full';
export type Path = 'amati' | 'ikut';
export type PenColor = 'navy' | 'red' | 'blue' | 'gray';

export interface Settings {
  schemaVersion: 1;
  music: boolean;
  sfx: boolean;
  speed: Speed;
  motion: MotionPref;
  lite: boolean;
  classroom: boolean;
  defaultMode: Path;
  pen: { color: PenColor; width: 1 | 2 | 3 };
}

export interface PracticeRecord {
  ts: number;
  level: 'mudah' | 'sedang' | 'menantang';
  seed: string;
  correct: boolean;
  hints: number;
  timeMs: number;
  /** waktu habis sebelum dijawab (FR-LAT-7) */
  timeout?: boolean;
}

export interface ItemProgress {
  watched: number;
  done: boolean;
  lastStep?: { b: number; l: number };
  marks: number[];
  practice: PracticeRecord[];
  lastTs?: number;
}

export interface Progress {
  schemaVersion: 1;
  items: Record<string, ItemProgress>;
  totalMs: number;
  lastOpened?: number;
}

/** Keadaan antarmuka yang perlu bertahan (kunjungan, lembar panduan sudah dilihat). */
export interface UiState {
  schemaVersion: 1;
  visits: number;
  installGuideShown: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  schemaVersion: 1,
  music: false,
  sfx: true,
  speed: 1,
  motion: 'system',
  lite: false,
  classroom: false,
  defaultMode: 'ikut',
  pen: { color: 'navy', width: 2 },
};

const DEFAULT_PROGRESS: Progress = { schemaVersion: 1, items: {}, totalMs: 0 };
const DEFAULT_UI: UiState = { schemaVersion: 1, visits: 0, installGuideShown: false };

type Json = Record<string, unknown>;

function read(key: string): Json | null {
  const raw = storage.get(key);
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(raw);
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Json) : null;
  } catch {
    return null;
  }
}

const SPEEDS: readonly Speed[] = [0.75, 1, 1.5];
const MOTIONS: readonly MotionPref[] = ['system', 'reduce', 'full'];
const PATHS: readonly Path[] = ['amati', 'ikut'];
const PENS: readonly PenColor[] = ['navy', 'red', 'blue', 'gray'];

const bool = (v: unknown, d: boolean): boolean => (typeof v === 'boolean' ? v : d);
const oneOf = <T>(v: unknown, list: readonly T[], d: T): T => (list.includes(v as T) ? (v as T) : d);

/** Migrasi + validasi: data rusak atau versi lama tidak pernah membuat aplikasi gagal. */
export function migrateSettings(raw: Json | null): Settings {
  const d = DEFAULT_SETTINGS;
  if (!raw) return structuredClone(d);
  const pen = (raw.pen ?? {}) as Json;
  return {
    schemaVersion: 1,
    music: bool(raw.music, d.music),
    sfx: bool(raw.sfx, d.sfx),
    speed: oneOf(raw.speed, SPEEDS, d.speed),
    motion: oneOf(raw.motion ?? (raw.reducedMotion === true ? 'reduce' : undefined), MOTIONS, d.motion),
    lite: bool(raw.lite, d.lite),
    classroom: bool(raw.classroom, d.classroom),
    defaultMode: oneOf(raw.defaultMode, PATHS, d.defaultMode),
    pen: {
      color: oneOf(pen.color, PENS, d.pen.color),
      width: oneOf(pen.width, [1, 2, 3] as const, d.pen.width),
    },
  };
}

export function migrateProgress(raw: Json | null): Progress {
  if (!raw || typeof raw.items !== 'object' || raw.items === null) return structuredClone(DEFAULT_PROGRESS);
  const items: Record<string, ItemProgress> = {};
  for (const [k, v] of Object.entries(raw.items as Json)) {
    if (!/^\d{1,2}$/.test(k) || !v || typeof v !== 'object') continue;
    const it = v as Json;
    const ls = it.lastStep as Json | undefined;
    items[k] = {
      watched: typeof it.watched === 'number' ? it.watched : 0,
      done: bool(it.done, false),
      lastStep: ls && typeof ls.b === 'number' && typeof ls.l === 'number' ? { b: ls.b, l: ls.l } : undefined,
      marks: Array.isArray(it.marks) ? it.marks.filter((m): m is number => typeof m === 'number') : [],
      practice: Array.isArray(it.practice) ? (it.practice as PracticeRecord[]) : [],
      lastTs: typeof it.lastTs === 'number' ? it.lastTs : undefined,
    };
  }
  return {
    schemaVersion: 1,
    items,
    totalMs: typeof raw.totalMs === 'number' ? raw.totalMs : 0,
    lastOpened: typeof raw.lastOpened === 'number' ? raw.lastOpened : undefined,
  };
}

function migrateUi(raw: Json | null): UiState {
  return {
    schemaVersion: 1,
    visits: typeof raw?.visits === 'number' ? raw.visits : 0,
    installGuideShown: bool(raw?.installGuideShown, false),
  };
}

type Topic = 'settings' | 'progress' | 'ui';
const subs = new Map<Topic, Set<() => void>>();

let settings = migrateSettings(read(KEY_SETTINGS));
let progress = migrateProgress(read(KEY_PROGRESS));
let ui = migrateUi(read(KEY_UI));

function emit(t: Topic): void {
  subs.get(t)?.forEach((f) => f());
}

export const store = {
  get settings(): Readonly<Settings> {
    return settings;
  },
  get progress(): Readonly<Progress> {
    return progress;
  },
  get ui(): Readonly<UiState> {
    return ui;
  },
  subscribe(t: Topic, f: () => void): () => void {
    if (!subs.has(t)) subs.set(t, new Set());
    subs.get(t)!.add(f);
    return () => subs.get(t)?.delete(f);
  },
  updateSettings(patch: Partial<Omit<Settings, 'schemaVersion'>>): void {
    settings = migrateSettings({ ...settings, ...patch } as unknown as Json);
    storage.set(KEY_SETTINGS, JSON.stringify(settings));
    emit('settings');
  },
  markOpened(no: number): void {
    progress = { ...progress, lastOpened: no };
    storage.set(KEY_PROGRESS, JSON.stringify(progress));
    emit('progress');
  },
  /** Item kemajuan satu soal (dibuat bila belum ada). */
  item(no: number): ItemProgress {
    return progress.items[String(no)] ?? { watched: 0, done: false, marks: [], practice: [] };
  },
  updateItem(no: number, f: (it: ItemProgress) => ItemProgress): void {
    const it = f(structuredClone(store.item(no)));
    progress = { ...progress, items: { ...progress.items, [String(no)]: { ...it, lastTs: Date.now() } } };
    storage.set(KEY_PROGRESS, JSON.stringify(progress));
    emit('progress');
  },
  /** Posisi terakhir pembahasan (FR-BAH-9). */
  setLastStep(no: number, b: number, l: number): void {
    store.updateItem(no, (it) => ({ ...it, lastStep: { b, l } }));
  },
  /** Pop-up SELESAI tercapai (status Sudah dibahas, §7.4). */
  markDone(no: number): void {
    store.updateItem(no, (it) => ({ ...it, done: true, watched: it.watched + 1 }));
  },
  /** Satu soal latihan selesai (FR-LAT-8); status Sudah paham/Perlu diulang dihitung dari sini (§7.4). */
  addPractice(no: number, rec: PracticeRecord): void {
    store.updateItem(no, (it) => ({ ...it, practice: [...it.practice, rec].slice(-50) }));
  },
  /** Tandai/batal tandai bagian sebagai "belum paham" (FR-BAH-2, FR-BAH-12). */
  toggleMark(no: number, ch: number): boolean {
    let on = false;
    store.updateItem(no, (it) => {
      on = !it.marks.includes(ch);
      return {
        ...it,
        marks: on ? [...it.marks, ch].sort((a, b) => a - b) : it.marks.filter((m) => m !== ch),
      };
    });
    return on;
  },
  /** Tambah waktu belajar (ms) untuk ringkasan beranda. */
  addTime(ms: number): void {
    if (ms <= 0 || ms > 6 * 3600000) return;
    progress = { ...progress, totalMs: progress.totalMs + ms };
    storage.set(KEY_PROGRESS, JSON.stringify(progress));
  },
  countVisit(): number {
    ui = { ...ui, visits: ui.visits + 1 };
    storage.set(KEY_UI, JSON.stringify(ui));
    emit('ui');
    return ui.visits;
  },
  setInstallGuideShown(): void {
    ui = { ...ui, installGuideShown: true };
    storage.set(KEY_UI, JSON.stringify(ui));
    emit('ui');
  },
  /** Hapus semua data lokal (dua langkah konfirmasi ada di antarmuka, FR-KEM-5). */
  resetAll(): void {
    for (const k of storage.keys('pahamtka:')) storage.remove(k);
    settings = structuredClone(DEFAULT_SETTINGS);
    progress = structuredClone(DEFAULT_PROGRESS);
    ui = { ...DEFAULT_UI, visits: 1 };
    storage.set(KEY_UI, JSON.stringify(ui));
    emit('settings');
    emit('progress');
    emit('ui');
  },
};

/** Ringkasan kemajuan untuk beranda (FR-HOME-4). */
export function progressSummary(readyCount: number): {
  done: number;
  ready: number;
  practiceOk: number;
  practiceTotal: number;
  minutes: number;
} {
  let done = 0;
  let ok = 0;
  let total = 0;
  for (const it of Object.values(progress.items)) {
    if (it.done) done++;
    total += it.practice.length;
    ok += it.practice.filter((p) => p.correct).length;
  }
  return {
    done,
    ready: readyCount,
    practiceOk: ok,
    practiceTotal: total,
    minutes: Math.round(progress.totalMs / 60000),
  };
}
