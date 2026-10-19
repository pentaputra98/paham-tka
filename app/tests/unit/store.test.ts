import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, migrateProgress, migrateSettings } from '../../src/core/store';

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
