/**
 * Penilaian tes penguasaan (fungsi murni, diuji di tests/unit/tes-score.test.ts).
 * Setiap soal bernilai 1 bila seluruh bagiannya tepat: pilihan ganda tepat satu, pilihan banyak tepat
 * semua pilihannya, tabel Benar/Salah tepat semua barisnya. Penguasaan = persen soal tepat.
 */
import { MATERI, type Materi, type Resp, type TesItem } from './types';

export type ItemState = 'empty' | 'partial' | 'done';

export const emptyResp = (it: TesItem): Resp => ({
  pick: [],
  tf: it.kind === 'tf' ? it.options.map(() => null) : [],
  flag: false,
  ms: 0,
});

/** Kosong, sebagian (tabel Benar/Salah belum lengkap), atau sudah dijawab. */
export function itemState(it: TesItem, r: Resp): ItemState {
  if (it.kind === 'tf') {
    const n = r.tf.filter((v) => v !== null).length;
    return n === 0 ? 'empty' : n < it.options.length ? 'partial' : 'done';
  }
  return r.pick.length ? 'done' : 'empty';
}

export function isCorrect(it: TesItem, r: Resp): boolean {
  if (it.kind === 'tf') return it.ok.every((o, i) => r.tf[i] === o);
  const keys = it.ok.flatMap((o, i) => (o ? [i] : []));
  return r.pick.length === keys.length && keys.every((k) => r.pick.includes(k));
}

export type Level = 'kuat' | 'cukup' | 'lemah' | 'belum';

/** Tingkat penguasaan dari persen (3 soal per materi: 100 / 67 / 33 / 0). */
export const levelOf = (pct: number): Level =>
  pct >= 80 ? 'kuat' : pct >= 60 ? 'cukup' : pct > 0 ? 'lemah' : 'belum';

export const LEVEL_LABEL: Record<Level, string> = {
  kuat: 'Dikuasai',
  cukup: 'Cukup',
  lemah: 'Perlu diperkuat',
  belum: 'Belum dikuasai',
};

export interface MateriStat {
  materi: Materi;
  n: number;
  ok: number;
  pct: number;
  ms: number;
}

export interface Summary {
  n: number;
  ok: number;
  pct: number;
  /** dijawab lengkap */
  answered: number;
  /** tabel Benar/Salah yang baru sebagian diisi */
  partial: number;
  empty: number;
  flagged: number;
  /** ditandai ragu, tetapi tepat */
  flaggedOk: number;
  /** dijawab tanpa tanda ragu, tetapi tidak tepat (petunjuk salah konsep) */
  sureWrong: number;
  msUsed: number;
  limitMs: number;
  materi: MateriStat[];
  kinds: { single: { n: number; ok: number }; complex: { n: number; ok: number } };
}

const pctOf = (ok: number, n: number): number => (n ? Math.round((ok / n) * 100) : 0);

export function summarize(items: TesItem[], resps: Resp[], msUsed: number, limitMs: number): Summary {
  const right = items.map((it, i) => isCorrect(it, resps[i]!));
  const state = items.map((it, i) => itemState(it, resps[i]!));
  const ok = right.filter(Boolean).length;
  const flagged = resps.filter((r) => r.flag).length;
  const materi = MATERI.map((m): MateriStat => {
    const idx = items.flatMap((it, i) => (it.materi === m ? [i] : []));
    const k = idx.filter((i) => right[i]).length;
    return {
      materi: m,
      n: idx.length,
      ok: k,
      pct: pctOf(k, idx.length),
      ms: idx.reduce((s, i) => s + resps[i]!.ms, 0),
    };
  }).filter((s) => s.n > 0);
  const kind = (single: boolean): { n: number; ok: number } => {
    const idx = items.flatMap((it, i) => ((it.kind === 'single') === single ? [i] : []));
    return { n: idx.length, ok: idx.filter((i) => right[i]).length };
  };
  return {
    n: items.length,
    ok,
    pct: pctOf(ok, items.length),
    answered: state.filter((s) => s === 'done').length,
    partial: state.filter((s) => s === 'partial').length,
    empty: state.filter((s) => s === 'empty').length,
    flagged,
    flaggedOk: resps.filter((r, i) => r.flag && right[i]).length,
    sureWrong: resps.filter((r, i) => !r.flag && state[i] !== 'empty' && !right[i]).length,
    msUsed,
    limitMs,
    materi,
    kinds: { single: kind(true), complex: kind(false) },
  };
}

/** Materi dari yang paling lemah (persen terkecil; seri: urutan materi). */
export const weakestFirst = (s: Summary): MateriStat[] =>
  [...s.materi].sort((a, b) => a.pct - b.pct || MATERI.indexOf(a.materi) - MATERI.indexOf(b.materi));
