/**
 * Kode Ekspedisi TKA (v1.26). Tanpa server: papan Game Master (laptop guru) dan tablet tim "berbicara"
 * lewat kode pendek yang bisa diperiksa keasliannya.
 * - Kode permainan (4 huruf, 20 bit): 7 bit pos yang dimainkan + 13 bit acak.
 * - Kode gabung tim: kode permainan + nomor tim + 1 huruf cek → "KX7P-3M".
 * - Kode bukti pos (5 huruf): pos, skor, jumlah salah, jumlah dibantu (14 bit) + cek 10 bit yang terikat
 *   pada kode permainan dan tim. Tebakan acak lolos ≈ 1 : 1000; tim lain tidak bisa memakai kode tim lain.
 * Kata sandi Game Master hanya disimpan sebagai sidik SHA-256.
 */

/** 32 simbol tanpa huruf/angka yang mirip (O/0, I/1/L tetap dihindari kecuali L) */
export const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Pos: 1 Lingkaran, 2 Gelombang, 3 Transformasi, 4 Detektif, 5 Museum, 6 Pacu, 7 Final */
export const POS_IDS = [1, 2, 3, 4, 5, 6, 7] as const;
export type PosId = (typeof POS_IDS)[number];

const SALT = 'paham-tka-ekspedisi-v1';

/** FNV-1a 32 bit */
export function hash32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function enc(n: number, len: number): string {
  let out = '';
  for (let i = 0; i < len; i++) {
    out = ALPHA[n & 31]! + out;
    n >>>= 5;
  }
  return out;
}

function dec(s: string): number | null {
  let n = 0;
  for (const ch of s) {
    const v = ALPHA.indexOf(ch);
    if (v < 0) return null;
    n = n * 32 + v;
  }
  return n;
}

/** Rapikan masukan: huruf besar, buang spasi/strip, 0→O tidak ada di alfabet jadi dibiarkan gagal. */
export const clean = (s: string): string => s.toUpperCase().replace(/[^A-Z0-9]/g, '');

// ---------- kode permainan ----------
export function makeGameCode(posMask: number, rand: number): string {
  return enc(((posMask & 0x7f) << 13) | (rand & 0x1fff), 4);
}

export function posMaskOf(game: string): number {
  const n = dec(game);
  return n === null ? 0 : (n >>> 13) & 0x7f;
}

export const posList = (mask: number): PosId[] => POS_IDS.filter((p) => mask & (1 << (p - 1)));

// ---------- kode gabung tim ----------
export function joinCode(game: string, team: number): string {
  const c = ALPHA[hash32(`${SALT}|join|${game}|${team}`) & 31]!;
  return `${game}-${team}${c}`;
}

export interface Join {
  game: string;
  team: number;
}

export function parseJoin(raw: string): Join | null {
  const s = clean(raw);
  if (s.length !== 6) return null;
  const game = s.slice(0, 4);
  const team = Number(s[4]);
  if (!Number.isInteger(team) || team < 1 || team > 6) return null;
  if (dec(game) === null || posMaskOf(game) === 0) return null;
  return joinCode(game, team) === `${game}-${s.slice(4)}` ? { game, team } : null;
}

// ---------- kode mulai ----------
/** Kode mulai (3 huruf) baru tampil di papan saat guru menekan Mulai: kelompok tidak bisa mulai lebih dulu. */
export const startCode = (game: string): string => enc(hash32(`${SALT}|mulai|${game}`) & 0x7fff, 3);

export const checkStart = (game: string, raw: string): boolean => clean(raw) === startCode(game);

// ---------- lambang kelompok ----------
/** Lambang per nomor kelompok, sama di tablet dan papan Game Master (tanpa server, foto tidak bisa dikirim). */
export const EMBLEMS = [
  { name: 'Kompas', icon: 'compass' },
  { name: 'Roket', icon: 'rocket' },
  { name: 'Jangkar', icon: 'anchor' },
  { name: 'Gunung', icon: 'mountain' },
  { name: 'Api', icon: 'flame' },
  { name: 'Elang', icon: 'bird' },
] as const;

export const emblem = (team: number): (typeof EMBLEMS)[number] =>
  EMBLEMS[(team - 1 + EMBLEMS.length) % EMBLEMS.length]!;
export const teamName = (team: number): string => `Kelompok ${team} · ${emblem(team).name}`;

// ---------- kode bukti pos ----------
export interface Proof {
  pos: PosId;
  /** 0–127 */
  score: number;
  /** jawaban salah pertama (dibatasi 3) */
  wrong: number;
  /** soal yang memakai fase diskusi atau petunjuk (dibatasi 3) */
  helped: number;
}

const proofCheck = (game: string, team: number, payload: number): number =>
  hash32(`${SALT}|bukti|${game}|${team}|${payload}`) & 0x3ff;

export function proofCode(game: string, team: number, p: Proof): string {
  const payload =
    ((p.pos & 7) << 11) |
    ((Math.min(127, Math.max(0, p.score)) & 127) << 4) |
    ((Math.min(3, p.wrong) & 3) << 2) |
    (Math.min(3, p.helped) & 3);
  return enc(payload, 3) + enc(proofCheck(game, team, payload), 2);
}

/** Cocokkan kode bukti dengan salah satu tim di permainan ini. */
export function readProof(game: string, teams: number[], raw: string): { team: number; proof: Proof } | null {
  const s = clean(raw);
  if (s.length !== 5) return null;
  const payload = dec(s.slice(0, 3));
  const check = dec(s.slice(3));
  if (payload === null || check === null) return null;
  const pos = (payload >>> 11) & 7;
  if (pos < 1 || pos > 7) return null;
  for (const team of teams)
    if (proofCheck(game, team, payload) === check)
      return {
        team,
        proof: {
          pos: pos as PosId,
          score: (payload >>> 4) & 127,
          wrong: (payload >>> 2) & 3,
          helped: payload & 3,
        },
      };
  return null;
}

// ---------- kata sandi Game Master ----------
/** SHA-256 dari kata sandi (huruf kecil, tanpa spasi tepi). Nilai sandi tidak disimpan di kode. */
export const GM_HASH = '9bb0f0d6a0e7e8fac314648b59963dbb29c484aebd6831c6150d6c806f5c1bef';

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function checkGmPassword(text: string): Promise<boolean> {
  return (await sha256(text.trim().toLowerCase())) === GM_HASH;
}
