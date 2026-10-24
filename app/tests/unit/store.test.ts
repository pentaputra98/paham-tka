import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SETTINGS,
  itemStatus,
  migrateProgress,
  migrateSettings,
  type PracticeRecord,
} from '../../src/core/store';

describe('migrasi penyimpanan (PRD §14.5)', () => {
  it('data kosong menjadi bawaan', () => {
    expect(migrateSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(migrateProgress(null)).toEqual({ schemaVersion: 1, items: {}, totalMs: 0 });
  });
  it('nilai rusak diganti bawaan tanpa melempar', () => {
    const s = migrateSettings({ speed: 3, music: 'ya', motion: 'aneh', pen: { color: 'gold', width: 9 } });
    expect(s.speed).toBe(1);
    expect(s.music).toBe(false);
    expect(s.motion).toBe('system');
    // emas tidak tersedia untuk coretan (FR-COR-2)
    expect(s.pen.color).toBe('navy');
    expect(s.pen.width).toBe(2);
  });
  it('kunci lama reducedMotion dipetakan ke motion', () => {
    expect(migrateSettings({ reducedMotion: true }).motion).toBe('reduce');
  });
  it('kemajuan: hanya kunci nomor soal yang sah', () => {
    const p = migrateProgress({
      items: { '5': { watched: 2, done: true, marks: [1, 'x'] }, x: {} },
      totalMs: 1000,
    });
    expect(Object.keys(p.items)).toEqual(['5']);
    expect(p.items['5']).toMatchObject({ watched: 2, done: true, marks: [1] });
  });
});

describe('status siswa per soal (PRD §7.4, revisi v1.23)', () => {
  const rec = (ts: number, correct: boolean, hints = 0): PracticeRecord => ({
    ts,
    level: 'mudah',
    seed: '000001-M',
    correct,
    hints,
    timeMs: 1000,
  });
  const base = { watched: 1, done: true, marks: [] as number[], practice: [] as PracticeRecord[] };
  it('pembahasan selesai tanpa tanda dan tanpa latihan: Sudah dibahas', () => {
    expect(itemStatus(base)).toBe('done');
    expect(itemStatus(undefined)).toBe('none');
  });
  it('latihan terakhir salah sesudah pembahasan: Perlu diulang', () => {
    expect(itemStatus({ ...base, doneTs: 100, practice: [rec(200, false)] })).toBe('review-practice');
  });
  it('pembahasan diselesaikan lagi sesudah latihan salah: kembali Sudah dibahas', () => {
    expect(itemStatus({ ...base, doneTs: 300, practice: [rec(200, false)] })).toBe('done');
  });
  it('ada bagian ditandai belum paham: Perlu diulang', () => {
    expect(itemStatus({ ...base, doneTs: 300, marks: [2] })).toBe('review-mark');
  });
  it('dua dari tiga latihan terakhir benar tanpa petunjuk, termasuk yang terakhir: Sudah paham', () => {
    expect(itemStatus({ ...base, practice: [rec(1, false), rec(2, true), rec(3, true)] })).toBe('mastered');
  });
  it('waktu selesai pembahasan ikut dimigrasi', () => {
    const p = migrateProgress({ items: { '17': { ...base, doneTs: 5 } } });
    expect(p.items['17']!.doneTs).toBe(5);
  });
});
