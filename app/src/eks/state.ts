/**
 * Keadaan Ekspedisi TKA (v1.26), hanya di perangkat:
 * - tablet tim: `pahamtka:v1:eks-tim` (anggota, giliran, hasil tiap pos, petunjuk tersisa);
 * - laptop Game Master: `pahamtka:v1:eks-gm` (tim, waktu, laporan kode bukti).
 * Giliran: urutan acak dari nama anggota; setiap anggota menjawab sekali per putaran, lalu urutan diacak
 * lagi dan orang terakhir putaran lalu tidak menjadi orang pertama putaran baru.
 */
import { mulberry32 } from '../core/prng';
import { storage } from '../core/storage';
import { hash32, type PosId } from './codes';

const KEY_TEAM = 'pahamtka:v1:eks-tim';
const KEY_GM = 'pahamtka:v1:eks-gm';
const KEY_GM_OK = 'pahamtka:v1:eks-gm-ok';
const KEY_HIST = 'pahamtka:v1:eks-riwayat';
const KEY_GM_HIST = 'pahamtka:v1:eks-gm-riwayat';

export const HINTS = 3;
/** "Panggil tim lebih awal" hanya sekali per pos (fase Diskusi otomatis setelah waktu Mandiri tetap berlaku) */
export const HELP_PER_POS = 1;
export const PTS = { mandiri: 10, diskusi: 6, kedua: 3, bonus: 5, pacu: 10 } as const;
export const T_MANDIRI = 40_000;
export const T_SOAL = 120_000;
export const T_KEDUA = 45_000;
export const T_PACU = 5 * 60_000;

export interface PosResult {
  score: number;
  wrong: number;
  helped: number;
  code: string;
  reporter: string;
}

/** pos yang sedang dikerjakan (dilanjutkan bila tablet dimuat ulang atau ditinggal) */
export interface Progress {
  pos: PosId | 0;
  i: number;
  pts: number[];
  wrong: number;
  helped: number;
  firstAll: boolean;
  /** soal ke-i sudah dibuka penjawab; ditinggal = hangus */
  open: boolean;
  /** berapa kali "Panggil tim lebih awal" dipakai di pos ini */
  help?: number;
  /** Pacu Waktu: batas waktu dan keadaan tiap soal */
  end?: number;
  st?: Array<'belum' | 'benar' | 'salah'>;
}

export interface TeamState {
  game: string;
  team: number;
  seed: number;
  demo: boolean;
  members: string[];
  order: number[];
  turn: number;
  round: number;
  lapor: number;
  hints: number;
  results: Partial<Record<PosId | 0, PosResult>>;
  traps: string[];
  cur?: Progress | null;
  /** sudah memasukkan kode mulai dari Game Master */
  started?: boolean;
  startAt?: number;
  /** swafoto kelompok (data URL JPEG), hanya di tablet ini */
  photo?: string;
  finished?: boolean;
}

function shuffle(n: number, seed: number): number[] {
  const rng = mulberry32(seed >>> 0);
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function newTeam(game: string, team: number, members: string[], demo = false): TeamState {
  const seed = hash32(`${game}|${team}`);
  return {
    game,
    team,
    seed,
    demo,
    members,
    order: shuffle(members.length, seed),
    turn: 0,
    round: 0,
    lapor: 0,
    hints: HINTS,
    results: {},
    traps: [],
  };
}

/** Penjawab sekarang. */
export const answerer = (t: TeamState): string => t.members[t.order[t.turn]!]!;

/** Maju ke penjawab berikutnya; putaran baru diacak ulang tanpa orang yang sama dua kali berturut-turut. */
export function nextTurn(t: TeamState): void {
  const last = t.order[t.turn]!;
  t.turn++;
  if (t.turn < t.order.length) return;
  t.round++;
  t.turn = 0;
  const o = shuffle(t.members.length, t.seed + t.round * 7919);
  if (o.length > 1 && o[0] === last) [o[0], o[1]] = [o[1]!, o[0]!];
  t.order = o;
}

/** Juru lapor bergilir dari urutan putaran pertama, dimulai dari orang terakhir. */
export function takeReporter(t: TeamState): string {
  const base = shuffle(t.members.length, t.seed);
  const who = t.members[base[(base.length - 1 - (t.lapor % base.length) + base.length) % base.length]!]!;
  t.lapor++;
  return who;
}

function valid(t: unknown): t is TeamState {
  const x = t as TeamState;
  return (
    !!x &&
    typeof x.game === 'string' &&
    Array.isArray(x.members) &&
    x.members.length >= 2 &&
    Array.isArray(x.order) &&
    x.order.length === x.members.length &&
    typeof x.results === 'object'
  );
}

export const teamStore = {
  load(): TeamState | null {
    try {
      const v = JSON.parse(storage.get(KEY_TEAM) ?? 'null') as unknown;
      return valid(v) ? v : null;
    } catch {
      return null;
    }
  },
  save(t: TeamState): void {
    storage.set(KEY_TEAM, JSON.stringify(t));
  },
  clear(): void {
    storage.remove(KEY_TEAM);
  },
};

// ---------------------------------------------------------------------------------------------
// Game Master
// ---------------------------------------------------------------------------------------------
export interface Report {
  team: number;
  pos: PosId;
  score: number;
  wrong: number;
  helped: number;
  at: number;
}

export interface GmState {
  game: string;
  mask: number;
  teams: Array<{ no: number; name: string }>;
  /** durasi rencana (ms) */
  duration: number;
  /** batas waktu saat berjalan; null bila belum mulai atau dijeda */
  deadline: number | null;
  /** sisa waktu saat dijeda / sebelum mulai */
  left: number;
  started: boolean;
  ended: boolean;
  revealed: boolean;
  reports: Report[];
}

export const gmStore = {
  load(): GmState | null {
    try {
      const v = JSON.parse(storage.get(KEY_GM) ?? 'null') as GmState | null;
      return v && typeof v.game === 'string' && Array.isArray(v.teams) && Array.isArray(v.reports) ? v : null;
    } catch {
      return null;
    }
  },
  save(g: GmState): void {
    storage.set(KEY_GM, JSON.stringify(g));
  },
  clear(): void {
    storage.remove(KEY_GM);
  },
  /** Game Master tetap masuk 12 jam di perangkat ini */
  unlocked(): boolean {
    return Number(storage.get(KEY_GM_OK) ?? 0) > Date.now();
  },
  unlock(): void {
    storage.set(KEY_GM_OK, String(Date.now() + 12 * 3600_000));
  },
  lock(): void {
    storage.remove(KEY_GM_OK);
  },
};

export const timeLeft = (g: GmState): number =>
  g.deadline === null ? g.left : Math.max(0, g.deadline - Date.now());

export function teamScore(g: GmState, team: number): number {
  return g.reports.filter((r) => r.team === team).reduce((s, r) => s + r.score, 0);
}

export function ranking(g: GmState): Array<{ no: number; name: string; score: number; done: PosId[] }> {
  return g.teams
    .map((t) => {
      const rs = g.reports.filter((r) => r.team === t.no);
      return {
        no: t.no,
        name: t.name,
        score: rs.reduce((s, r) => s + r.score, 0),
        done: rs.map((r) => r.pos),
        last: Math.max(0, ...rs.map((r) => r.at)),
      };
    })
    .sort((a, b) => b.score - a.score || b.done.length - a.done.length || a.last - b.last)
    .map(({ no, name, score, done }) => ({ no, name, score, done }));
}

// ---------------------------------------------------------------------------------------------
// Riwayat (tablet dan Game Master), hanya di perangkat
// ---------------------------------------------------------------------------------------------
export interface TeamHistory {
  id: string;
  at: number;
  team: number;
  members: string[];
  photo?: string;
  score: number;
  pos: Array<{ pos: PosId; score: number }>;
  traps: string[];
}

export interface GmHistory {
  id: string;
  at: number;
  minutes: number;
  rank: Array<{ no: number; name: string; score: number; done: number }>;
}

function list<T>(key: string): T[] {
  try {
    const v = JSON.parse(storage.get(key) ?? '[]') as unknown;
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

export const history = {
  team: (): TeamHistory[] => list<TeamHistory>(KEY_HIST),
  addTeam(h: TeamHistory): void {
    const all = [h, ...list<TeamHistory>(KEY_HIST).filter((x) => x.id !== h.id)].slice(0, 20);
    // foto paling besar; bila penyimpanan penuh, simpan tanpa foto lama
    if (!storage.set(KEY_HIST, JSON.stringify(all)))
      storage.set(KEY_HIST, JSON.stringify(all.map((x, i) => (i === 0 ? x : { ...x, photo: undefined }))));
  },
  removeTeam(id: string): void {
    storage.set(KEY_HIST, JSON.stringify(list<TeamHistory>(KEY_HIST).filter((x) => x.id !== id)));
  },
  clearTeam(): void {
    storage.remove(KEY_HIST);
  },
  gm: (): GmHistory[] => list<GmHistory>(KEY_GM_HIST),
  addGm(h: GmHistory): void {
    storage.set(
      KEY_GM_HIST,
      JSON.stringify([h, ...list<GmHistory>(KEY_GM_HIST).filter((x) => x.id !== h.id)].slice(0, 30)),
    );
  },
  removeGm(id: string): void {
    storage.set(KEY_GM_HIST, JSON.stringify(list<GmHistory>(KEY_GM_HIST).filter((x) => x.id !== id)));
  },
  clearGm(): void {
    storage.remove(KEY_GM_HIST);
  },
};
