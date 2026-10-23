/**
 * Aturan verify:content (PRD §10, §9.5). Dipakai oleh scripts/verify-content.ts dan uji unit.
 * - id baris, kunci token, dan id pin unik dalam satu soal;
 * - setiap `src` terselesaikan: '@nama' ada di kertas soal/visual; id token ada pada baris yang tampil
 *   SEBELUMNYA pada papan yang sama, atau pada pin langkah itu;
 * - AskOpt salah wajib punya hint; tepat satu opsi benar; `before` menunjuk baris dalam daftar;
 * - cap ≤ 2 kalimat dan ≤ 220 karakter (peringatan > 160);
 * - jumlah kartu 3–5 dan sesuai kunci; baris emas hanya yang dideklarasikan sebagai hasil akhir.
 */
import { isFrac, type Piece, type Row, type SoalContent, type Tok } from './types';

function flatToks(ps: Piece[]): Tok[] {
  return ps.flatMap((p) => (isFrac(p) ? [...flatToks(p.frac[0]), ...flatToks(p.frac[1])] : [p]));
}

/** Hitung kalimat pada teks pop-up: abaikan rumus $…$ dan tag HTML. */
export function sentences(cap: string): number {
  const plain = cap
    .replace(/\$[^$]*\$/g, 'X')
    .replace(/<[^>]+>/g, '')
    .replace(/\b(mis|dll|dst|yaitu)\./gi, '$1')
    .replace(/(\d)[.,](\d)/g, '$1$2')
    .trim();
  return plain.split(/[.!?](?:\s|$)/).filter((s) => s.trim().length > 0).length;
}

export function validateSoal(raw: unknown): { errors: string[]; warns: string[] } {
  const errors: string[] = [];
  const warns: string[] = [];
  const c = raw as SoalContent;
  if (!c?.meta || !Array.isArray(c.steps))
    return { errors: ['modul tidak mengekspor SoalContent sebagai default'], warns };

  // ---- garis miring LaTeX tunggal di string TS ('\b', '\f', '\t', '\v') menjadi karakter kendali ----
  JSON.stringify(c, (k, v: unknown) => {
    if (typeof v === 'string' && /[\b\f\t\v]/.test(v))
      errors.push(`karakter kendali di '${k}': tulis garis miring LaTeX ganda (\\\\) — ${v.slice(0, 40)}`);
    return v;
  });

  // ---- keunikan ----
  const rowIds = new Set<string>();
  const tokKeys = new Set<string>();
  const dup = (set: Set<string>, id: string, what: string): void => {
    if (set.has(id)) errors.push(`${what} ganda: ${id}`);
    set.add(id);
  };
  for (const [lid, rows] of Object.entries(c.lists)) {
    for (const r of rows) {
      dup(rowIds, r.id, 'id baris');
      for (const t of flatToks(r.toks)) dup(tokKeys, t.k, `kunci token (${lid}/${r.id})`);
    }
  }
  for (const p of Object.values(c.pins)) {
    dup(rowIds, p.id, 'id pin');
    for (const t of p.toks) dup(tokKeys, t.k, `kunci token pin ${p.id}`);
  }

  // ---- sumber '@nama' ----
  const atNames = new Set([...c.paper.srcNames, ...(c.visualSrc ?? [])]);
  for (const name of c.paper.srcNames)
    if (!c.paper.html.includes(`src=${name}`) && !c.paper.html.includes(`data-src="${name}"`))
      errors.push(`srcNames '${name}' tidak ada di kertas soal`);

  // ---- per langkah ----
  const listsShown = new Map<string, number>(); // daftar → jumlah baris tertinggi yang pernah tampil
  c.steps.forEach((st, si) => {
    const tag = `langkah ${si + 1} (bagian ${st.ch})`;
    if (!c.chapters[st.ch]) errors.push(`${tag}: bagian ${st.ch} tidak terdaftar`);
    const n = sentences(st.cap);
    if (st.cap.length > 220) errors.push(`${tag}: pop-up ${st.cap.length} karakter (> 220)`);
    else if (st.cap.length > 160) warns.push(`${tag}: pop-up ${st.cap.length} karakter (> 160)`);
    if (n > 2) errors.push(`${tag}: pop-up ${n} kalimat (> 2)`);
    if (st.branch && !c.chapters[st.ch + 1]?.opt)
      errors.push(`${tag}: tawaran branch harus diikuti bagian opsional (chapters[${st.ch + 1}].opt)`);
    if (st.visual.kind === 'cards' && (st.visual.flip < 0 || st.visual.flip > c.cards.length))
      errors.push(`${tag}: flip ${st.visual.flip} di luar jumlah kartu`);
    const b = st.board;
    if (!b) return;
    const list = c.lists[b.list];
    if (!list) return errors.push(`${tag}: daftar papan '${b.list}' tidak ada`);
    if (b.upTo > list.length) errors.push(`${tag}: upTo ${b.upTo} > panjang daftar ${list.length}`);
    for (const pid of b.pins ?? []) if (!c.pins[pid]) errors.push(`${tag}: pin '${pid}' tidak ada`);
    // token yang tersedia sebagai sumber: pin langkah + baris sebelumnya pada daftar ini
    const pinToks = new Set((b.pins ?? []).flatMap((pid) => c.pins[pid]?.toks.map((t) => t.k) ?? []));
    list.slice(0, b.upTo).forEach((row: Row, ri) => {
      // baris sebelum `from` sudah ditulis langkah sebelumnya (atau muncul tanpa terbang): sumbernya diperiksa di sana
      if (ri < b.from) return;
      const before = new Set(list.slice(0, ri).flatMap((r) => flatToks(r.toks).map((t) => t.k)));
      for (const t of flatToks(row.toks)) {
        if (!t.src) continue;
        if (t.src.startsWith('@')) {
          if (!atNames.has(t.src.slice(1)))
            errors.push(`${tag}: ${row.id}/${t.k} sumber '${t.src}' tidak dikenal`);
        } else if (!before.has(t.src) && !pinToks.has(t.src))
          errors.push(`${tag}: ${row.id}/${t.k} sumber '${t.src}' tidak tampil sebelumnya`);
      }
    });
    listsShown.set(b.list, Math.max(listsShown.get(b.list) ?? 0, b.upTo));
    // pertanyaan
    const a = st.ask;
    if (a) {
      if (!list.some((r) => r.id === a.before))
        errors.push(`${tag}: ask.before '${a.before}' bukan baris daftar ${b.list}`);
      const okCount = a.opts.filter((o) => o.ok).length;
      if (okCount !== 1) errors.push(`${tag}: pertanyaan harus punya tepat satu opsi benar (ada ${okCount})`);
      a.opts.forEach((o, oi) => {
        if (!o.ok && !o.hint?.trim()) errors.push(`${tag}: opsi ${oi + 1} salah tanpa petunjuk`);
      });
    }
  });

  // ---- kartu dan kunci ----
  if (c.cards.length < 3 || c.cards.length > 5) errors.push(`jumlah kartu ${c.cards.length} (harus 3–5)`);
  if (c.key.cardOk.length !== c.cards.length)
    errors.push('panjang key.cardOk tidak sama dengan jumlah kartu');
  c.cards.forEach((card, i) => {
    if (card.ok !== c.key.cardOk[i]) errors.push(`kartu ${card.label}: ok=${card.ok} berbeda dengan kunci`);
  });
  if (c.meta.response === 'single' && c.cards.filter((x) => x.ok).length !== 1)
    errors.push('soal pilih-satu harus punya tepat satu kartu benar');

  // ---- aturan emas ----
  const gold = Object.values(c.lists)
    .flat()
    .filter((r) => r.box === 'gold')
    .map((r) => r.id);
  for (const g of gold)
    if (!c.key.goldRows.includes(g))
      errors.push(`baris ${g} berkotak emas tetapi tidak dideklarasikan sebagai hasil akhir`);
  for (const g of c.key.goldRows)
    if (!gold.includes(g)) errors.push(`key.goldRows '${g}' tidak berkotak emas`);

  // ---- catatan dari data yang sama ----
  for (const s of c.notes.sections)
    for (const l of s.lists) if (!c.lists[l]) errors.push(`catatan: daftar '${l}' tidak ada`);

  // ---- langkah terakhir SELESAI ----
  if (c.steps.at(-1)?.visual.kind !== 'done')
    errors.push('langkah terakhir harus visual "done" (pop-up SELESAI)');
  return { errors, warns };
}
