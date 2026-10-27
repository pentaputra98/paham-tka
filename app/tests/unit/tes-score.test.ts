import { describe, expect, it } from 'vitest';
import { makeTest } from '../../src/tes/bank';
import { emptyResp, isCorrect, itemState, levelOf, summarize, weakestFirst } from '../../src/tes/score';
import { identity, migrateTes } from '../../src/tes/state';
import type { Resp, TesItem } from '../../src/tes/types';

const keyResp = (it: TesItem): Resp => ({
  ...emptyResp(it),
  pick: it.kind === 'tf' ? [] : it.ok.flatMap((o, i) => (o ? [i] : [])),
  tf: it.kind === 'tf' ? [...it.ok] : [],
});

describe('penilaian tes penguasaan', () => {
  const items = makeTest(777);

  it('jawaban kunci tepat; kosong tidak tepat', () => {
    for (const it of items) {
      expect(isCorrect(it, keyResp(it))).toBe(true);
      expect(isCorrect(it, emptyResp(it))).toBe(false);
      expect(itemState(it, emptyResp(it))).toBe('empty');
      expect(itemState(it, keyResp(it))).toBe('done');
    }
  });

  it('pilihan banyak dan Benar/Salah dinilai utuh', () => {
    const multi = items.find((x) => x.kind === 'multi')!;
    const r = keyResp(multi);
    expect(isCorrect(multi, { ...r, pick: r.pick.slice(1) })).toBe(false);
    const wrong = multi.ok.findIndex((o) => !o);
    expect(isCorrect(multi, { ...r, pick: [...r.pick, wrong] })).toBe(false);
    const tf = items.find((x) => x.kind === 'tf')!;
    const t = keyResp(tf);
    expect(itemState(tf, { ...t, tf: [t.tf[0]!, null, null] })).toBe('partial');
    expect(isCorrect(tf, { ...t, tf: [!t.tf[0], t.tf[1]!, t.tf[2]!] })).toBe(false);
  });

  it('ringkasan: persen per materi, ragu, yakin tetapi salah, bentuk soal', () => {
    const resps = items.map((it, i) => {
      if (it.materi === 'matriks') return keyResp(it);
      if (it.materi === 'limit') return { ...emptyResp(it), flag: i % 2 === 0 };
      if (it.materi === 'vektor' && it.kind === 'single') {
        const w = it.ok.findIndex((o) => !o);
        return { ...emptyResp(it), pick: [w] };
      }
      return { ...keyResp(it), flag: it.materi === 'fungsi' };
    });
    const s = summarize(items, resps, 600000, 2400000);
    expect(s.n).toBe(21);
    const by = Object.fromEntries(s.materi.map((m) => [m.materi, m.pct]));
    expect(by.matriks).toBe(100);
    expect(by.limit).toBe(0);
    expect(by.vektor).toBe(33);
    expect(s.ok).toBe(3 + 3 + 3 + 3 + 3 + 1);
    expect(s.pct).toBe(Math.round((16 / 21) * 100));
    expect(s.empty).toBe(3);
    expect(s.sureWrong).toBe(2);
    expect(s.flaggedOk).toBe(3);
    expect(s.kinds.single.n + s.kinds.complex.n).toBe(21);
    expect(weakestFirst(s)[0]!.materi).toBe('limit');
  });

  it('tingkat penguasaan', () => {
    expect([100, 67, 33, 0].map(levelOf)).toEqual(['kuat', 'cukup', 'lemah', 'belum']);
  });
});

describe('penyimpanan tes', () => {
  it('data rusak tidak membuat gagal', () => {
    for (const raw of [null, 3, 'x', [], { history: 'x' }, { active: { items: [{}] } }]) {
      const s = migrateTes(raw);
      expect(s.history).toEqual([]);
      expect(s.active).toBeNull();
    }
  });

  it('jawaban disesuaikan dengan bentuk soal', () => {
    const its = makeTest(5).map(({ params: _p, ...x }) => x);
    const s = migrateTes({
      active: { id: 'a', deadline: 10, items: its, resps: [{ pick: [9, 1, 'x'], tf: [true], flag: 1 }] },
      history: [{ id: 'h', no: 2, items: its, resps: [] }],
    });
    expect(s.active!.resps[0]!.pick).toEqual([1]);
    expect(s.active!.resps[0]!.flag).toBe(false);
    const tfIdx = its.findIndex((x) => x.kind === 'tf');
    expect(s.active!.resps[tfIdx]!.tf).toEqual([null, null, null]);
    expect(s.history[0]!.no).toBe(2);
  });

  it('identitas tidak peka huruf besar dan spasi', () => {
    expect(identity({ name: ' Budi  Santoso', school: 'SMA Vidatra ' })).toBe(
      identity({ name: 'budi santoso', school: 'sma vidatra' }),
    );
  });
});
