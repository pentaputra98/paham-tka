/**
 * Papan tulis (PRD §9.1 engine/board; port perilaku `B` template, pembahasan.md §8 dan §18).
 * Aturan yang dijaga:
 *  - satu baris = satu langkah; token terbang hanya dari sumber yang benar ke slot yang benar;
 *  - `to()` memanggil flush() di awal, menyimpan prefiks baris yang sama, cek live() sebelum
 *    SETIAP baris dan SETIAP token (mencegah baris ganda saat klik cepat);
 *  - penanda terbang menyimpan run (dataset.run); callback run lama berhenti;
 *  - sumber tidak terlihat → token ditulis dengan efek kapur.
 */
import { SND } from '../core/audio';
import { reducedMotion, sleep } from '../core/clock';
import { esc, html } from '../core/dom';
import { mathHtml, mathLabel, tex } from '../core/math';
import { completeAll, play } from '../core/motion';
import { DUR, EASE_OUT, RISE_PX } from '../core/tokens';
import { flyClone, visibleEnough } from './fly';
import { isFrac, type Ask, type Piece, type Pin, type Row, type Tok } from './types';

export interface Ctx {
  run: number;
  dir: 1 | -1;
  seq: boolean;
  replay: boolean;
  entered: boolean;
  live: () => boolean;
}

interface RowView {
  id: string;
  spec: Row;
  el: HTMLElement;
  m: HTMLElement;
  boxed: boolean;
}

interface Flying {
  g: HTMLElement;
  tk: HTMLElement;
  res: () => void;
}

export class Board {
  readonly el: HTMLElement;
  readonly foot: HTMLElement;
  /** lapisan pertanyaan cepat: pop-up di tengah panggung, latar diburamkan (dipasang Scene di atas panggung) */
  readonly askEl: HTMLElement;
  /** panggung penuh: semua baris diperkecil bersama agar muat setinggi papan tanpa gulir */
  fitHeight = false;
  private readonly titleEl: HTMLElement;
  private readonly pinsEl: HTMLElement;
  readonly body: HTMLElement;
  private readonly live: HTMLElement;
  private rows: RowView[] = [];
  private title: string | null = null;
  private pinKey = '';
  private flying = new Set<Flying>();
  private askRes: ((v: boolean) => void) | null = null;
  /** dipanggil saat pertanyaan dibuka/ditutup (tombol Lanjut → "Lewati soal") */
  onPending: (pending: boolean) => void = () => undefined;
  onReplay: () => void = () => undefined;

  constructor() {
    this.el = html(`<aside class="board" aria-label="Papan tulis">
      <div class="bd-head"><span class="bd-k">Papan tulis</span><h2 class="bd-t">–</h2>
        <button type="button" class="bd-re icon-btn" aria-label="Ulangi langkah ini" title="Ulangi langkah ini (R)"></button></div>
      <div class="bd-pins" aria-label="Hasil sebelumnya"></div>
      <div class="bd-lines"></div>
      <div class="bd-foot"></div>
      <div class="sr-only" aria-live="polite" aria-atomic="true"></div>
    </aside>`);
    this.titleEl = this.el.querySelector('.bd-t')!;
    this.pinsEl = this.el.querySelector('.bd-pins')!;
    this.body = this.el.querySelector('.bd-lines')!;
    this.foot = this.el.querySelector('.bd-foot')!;
    this.live = this.el.querySelector('[aria-live]')!;
    this.askEl = html('<div class="ask-ov" hidden></div>');
    this.el.querySelector('.bd-re')!.addEventListener('click', () => this.onReplay());
    // lebar isi papan berubah saat papan diubah ukurannya atau scrollbar muncul: ukur ulang baris
    this.ro = new ResizeObserver(() => this.refit());
    this.ro.observe(this.body);
  }

  private readonly ro: ResizeObserver;

  destroy(): void {
    this.ro.disconnect();
  }

  setReplayIcon(svg: string): void {
    this.el.querySelector('.bd-re')!.innerHTML = svg;
  }

  // ---------- pembuatan DOM ----------
  private tok(d: Piece): HTMLElement {
    if (isFrac(d)) {
      const f = document.createElement('span');
      f.className = 'm-frac';
      const n = document.createElement('span');
      n.className = 'm-num';
      const b = document.createElement('span');
      b.className = 'm-bar';
      const dn = document.createElement('span');
      dn.className = 'm-den';
      d.frac[0].forEach((x) => n.append(this.tok(x)));
      d.frac[1].forEach((x) => dn.append(this.tok(x)));
      f.append(n, b, dn);
      return f;
    }
    const t = d as Tok;
    const s = document.createElement('span');
    s.className = `tk${t.h != null ? ' tx' : ''}${t.c ? ` ${t.c}` : ''}`;
    s.dataset.k = t.k;
    if (t.src) s.dataset.src = t.src;
    s.innerHTML = t.h != null ? t.h : tex(t.t ?? '');
    return s;
  }

  private mkRow(spec: Row): RowView {
    const el = document.createElement('div');
    el.className = 'bl';
    el.dataset.row = spec.id;
    const m = document.createElement('div');
    m.className = 'bl-m';
    spec.toks.forEach((t) => m.append(this.tok(t)));
    el.append(m);
    if (spec.note) {
      const n = document.createElement('div');
      n.className = 'bl-n';
      n.innerHTML = mathHtml(spec.note);
      el.append(n);
    }
    return { id: spec.id, spec, el, m, boxed: false };
  }

  has(id: string): boolean {
    return this.rows.some((r) => r.id === id);
  }

  private scroll(): void {
    this.body.scrollTo({ top: this.body.scrollHeight, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  /** Perkecil huruf baris yang lebih lebar dari papan (min 60 %), tidak pernah memotong rumus. */
  private fit(row: RowView): void {
    if (this.fitHeight) return this.refit();
    this.fitRows([row]);
  }

  /** Hitung ulang penyesuaian saat ukuran papan berubah. */
  refit(): void {
    if (this.fitHeight) this.fitV();
    this.fitRows(this.rows);
  }

  /**
   * Skala bersama --fitv (62–100 %) untuk semua baris, agar isi papan muat setinggi kolomnya.
   * Ukuran huruf tidak persis linear terhadap tinggi (jarak, tinggi minimum), jadi diukur ulang maksimal tiga kali.
   */
  private fitV(): void {
    const b = this.body;
    b.style.removeProperty('--fitv');
    let k = 1;
    for (let n = 0; n < 3 && b.clientHeight > 0 && b.scrollHeight > b.clientHeight + 1 && k > 0.62; n++) {
      k = Math.max(0.62, k * (b.clientHeight / b.scrollHeight));
      b.style.setProperty('--fitv', k.toFixed(3));
    }
  }

  /** Tulis–baca–tulis berkelompok (bukan per baris) agar tidak memicu reflow berulang. */
  private fitRows(rows: RowView[]): void {
    if (!rows.length) return;
    rows.forEach((r) => r.m.style.removeProperty('--fit'));
    // lebar acuan = lebar baris itu sendiri (isi papan tanpa padding dan scrollbar)
    const need = rows.map((r) => [r.m.scrollWidth, r.el.clientWidth] as const);
    rows.forEach((r, i) => {
      const [n, avail] = need[i]!;
      if (avail > 0 && n > avail) r.m.style.setProperty('--fit', Math.max(0.6, avail / n).toFixed(3));
    });
  }

  private dimPast(): void {
    this.rows.forEach((r, i) => r.el.classList.toggle('past', i < this.rows.length - 1));
  }

  private finish(row: RowView, anim: boolean): void {
    row.el.querySelectorAll('.tk.hid').forEach((t) => t.classList.remove('hid'));
    if (row.spec.note) row.el.classList.add('noted');
    // ukur ulang setelah token tampil: lebar baris bisa berubah sejak ditulis (font, catatan, kotak)
    this.fit(row);
    if (row.spec.box && !row.boxed) {
      row.boxed = true;
      row.m.classList.add(`box-${row.spec.box}`);
      row.el.classList.add('res');
      if (anim) {
        play(row.m, [{ transform: 'scale(1.04)' }, { transform: 'none' }], {
          duration: DUR.enter,
          easing: EASE_OUT,
        });
        if (row.spec.box === 'gold') SND.chime();
      }
    }
  }

  private announce(row: RowView): void {
    const math = mathLabel(row.m);
    const n = row.el.querySelector('.bl-n');
    const note = n ? mathLabel(n) : '';
    this.live.textContent = `${math}${note ? `. ${note}` : ''}`;
  }

  /** Selesaikan seketika semua yang masih terbang/tertulis (template B.flush). */
  flush(): void {
    completeAll('fly');
    completeAll('chalk');
    this.flying.forEach((f) => {
      f.g.remove();
      f.tk.classList.remove('hid');
      f.res();
    });
    this.flying.clear();
    this.rows.forEach((r) => this.finish(r, false));
  }

  chapter(title: string, pins: Pin[], c: Ctx): void {
    if (this.title !== title) {
      this.flush();
      this.title = title;
      this.titleEl.textContent = title;
      this.rows.forEach((r) => r.el.remove());
      this.rows = [];
      if (c.dir > 0) play(this.body, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.slow, ui: true });
    }
    const key = pins.map((p) => p.id).join('|');
    if (key !== this.pinKey) {
      this.pinKey = key;
      this.pinsEl.replaceChildren();
      pins.forEach((p, i) => {
        const e = document.createElement('span');
        e.className = `pin${p.gold ? ' gold' : ''}`;
        e.dataset.pin = p.id;
        p.toks.forEach((t) => e.append(this.tok(t)));
        this.pinsEl.append(e);
        if (c.dir > 0)
          play(
            e,
            [
              { opacity: 0, transform: 'translateY(-6px) scale(.97)' },
              { opacity: 1, transform: 'none' },
            ],
            {
              duration: DUR.enter,
              easing: EASE_OUT,
              delay: i * 120,
            },
          );
      });
    }
  }

  /** Tampilkan baris 0..n-1; animasikan baris ≥ from (atau semua yang belum tampil bila c.seq). */
  async to(list: Row[], n: number, from: number, c: Ctx): Promise<boolean> {
    const want = list.slice(0, n);
    let k = 0;
    while (k < this.rows.length && k < want.length && this.rows[k]!.id === want[k]!.id) k++;
    if (c.replay) k = Math.min(k, from);
    this.flush();
    this.rows.splice(k).forEach((r) => r.el.remove());
    for (let i = k; i < want.length; i++) {
      if (!c.live()) return false;
      const anim = c.dir > 0 && (c.seq || c.replay || i >= from);
      await this.write(want[i]!, anim, c, i === want.length - 1);
    }
    this.dimPast();
    // satu pengukuran akhir untuk semua baris (tata letak papan bisa bergeser selama langkah berjalan)
    this.refit();
    return c.live();
  }

  private async write(spec: Row, anim: boolean, c: Ctx, last = false): Promise<void> {
    const row = this.mkRow(spec);
    this.body.append(row.el);
    this.rows.push(row);
    this.fit(row);
    this.dimPast();
    if (!anim) {
      this.finish(row, false);
      this.body.scrollTop = this.body.scrollHeight;
      return;
    }
    const toks = [...row.el.querySelectorAll<HTMLElement>('.tk')];
    toks.forEach((t) => t.classList.add('hid'));
    this.scroll();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await sleep(120);
    for (const tk of toks) {
      if (!c.live()) return this.finish(row, false);
      const s = srcEl(tk.dataset.src, this.el);
      if (s && visibleEnough(s)) await this.fly(s, tk, c);
      else {
        tk.classList.remove('hid');
        play(
          tk,
          [
            { clipPath: 'inset(0 100% 0 0)', opacity: 0.2, transform: 'translateY(3px)' },
            { clipPath: 'inset(0 0 0 0)', opacity: 1, transform: 'none' },
          ],
          { duration: DUR.chalk, easing: 'ease-out', tag: 'chalk' },
        );
        SND.chalk();
        await sleep(115);
      }
    }
    if (!c.live()) return this.finish(row, false);
    await sleep(140);
    this.finish(row, true);
    this.announce(row);
    // jeda antarbaris; baris terakhir tidak ditunggu (langkah dianggap selesai saat baris terakhir tampil)
    if (!last) await sleep(spec.box ? 650 : 330);
  }

  private fly(s: HTMLElement, tk: HTMLElement, c: Ctx): Promise<void> {
    return new Promise((res) => {
      const { g, k } = flyClone(s, tk, { tag: 'fly', scaleFromSource: true });
      g.dataset.run = String(c.run);
      SND.whoosh(0.55);
      const rec: Flying = { g, tk, res: () => res() };
      this.flying.add(rec);
      void k.finished.then(() => {
        if (!this.flying.has(rec)) return;
        this.flying.delete(rec);
        g.remove();
        tk.classList.remove('hid');
        if (g.dataset.run === String(c.run) && c.live()) {
          play(tk, [{ transform: 'scale(1.22)' }, { transform: 'none' }], {
            duration: DUR.chalk,
            easing: 'ease-out',
          });
          SND.tick();
          void sleep(120).then(() => res());
        } else res();
      });
    });
  }

  // ---------- pertanyaan cepat (template B.ask) ----------
  /**
   * Pop-up di tengah panggung; panggung di belakangnya diburamkan agar perhatian hanya pada pertanyaan.
   * Fokus terperangkap di kartu (Tab berputar); jawaban benar menutup pop-up lalu baris ditulis.
   */
  ask(a: Ask, c: Ctx): Promise<boolean> {
    return new Promise((resolve) => {
      const f = this.askEl;
      f.innerHTML = `<div class="ask" role="dialog" aria-modal="true" aria-labelledby="ask-q">
        <p class="ask-k">Coba jawab dulu</p>
        <p class="ask-q" id="ask-q">${mathHtml(a.q)}</p>
        <div class="ask-o${a.col ? ' col' : ''}${a.letters ? ' abc' : ''}" role="group"></div>
        <div class="ask-h" role="status" aria-live="polite"></div>
        <div class="ask-x"><button type="button" class="link-btn" data-skip>Lihat jawabannya saja</button></div></div>`;
      const box = f.querySelector<HTMLElement>('.ask-o')!;
      const hint = f.querySelector<HTMLElement>('.ask-h')!;
      const card = f.querySelector<HTMLElement>('.ask')!;
      f.hidden = false;
      play(f, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.base, ui: true });
      play(
        card,
        [
          { opacity: 0, transform: `translateY(${RISE_PX}px) scale(.97)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: DUR.slow, easing: EASE_OUT, ui: true },
      );
      const trap = (e: KeyboardEvent): void => {
        if (e.key !== 'Tab') return;
        const items = [...card.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
        if (!items.length) return;
        const i = items.indexOf(document.activeElement as HTMLButtonElement);
        const j = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
        e.preventDefault();
        items[j]!.focus();
      };
      card.addEventListener('keydown', trap);
      const done = (v: boolean): void => {
        if (this.askRes !== done) return;
        this.askRes = null;
        f.hidden = true;
        f.replaceChildren();
        this.onPending(false);
        resolve(v);
      };
      this.askRes = done;
      // beri tahu setelah askRes diisi: `pending` diturunkan dari askRes
      this.onPending(true);
      a.opts.forEach((op, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.innerHTML = `${a.letters ? `<span class="ol">${'ABCDE'[i]}</span>` : ''}<span>${op.tex ? tex(op.tex) : esc(op.txt ?? '')}</span>`;
        b.addEventListener('click', () => {
          if (!c.live() || this.askRes !== done) return;
          if (!op.ok) {
            SND.wrong();
            b.classList.add('wrong');
            play(
              b,
              [
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(-5px)' },
                { transform: 'none' },
              ],
              {
                duration: DUR.shake,
                ui: true,
              },
            );
            hint.className = 'ask-h no';
            hint.innerHTML = `<b class="k-red">Belum tepat.</b> ${mathHtml(op.hint ?? '')}`;
            return;
          }
          SND.correct();
          b.classList.add('right');
          box.querySelectorAll('button').forEach((x) => (x.disabled = true));
          hint.className = 'ask-h ok';
          hint.innerHTML = `<b class="k-gold">Benar.</b> ${mathHtml(a.win ?? 'Kita tulis langkahnya.')}`;
          void sleep(1100).then(() => done(true));
        });
        // KaTeX di dalam tombol tidak memberi nama aksesibel di Chrome: ambil teks MathML
        b.setAttribute('aria-label', `${a.letters ? `${'ABCDE'[i]}. ` : ''}${mathLabel(b)}`);
        box.append(b);
      });
      f.querySelector('[data-skip]')!.addEventListener('click', () => {
        SND.click();
        done(true);
      });
      requestAnimationFrame(() =>
        box.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true }),
      );
    });
  }

  cancelAsk(): void {
    this.askRes?.(false);
  }

  get pending(): boolean {
    return this.askRes !== null;
  }
}

/** '@nama' → elemen [data-src=nama] di halaman; selain itu id token di papan (baris atau pin). */
export function srcEl(src: string | undefined, board: HTMLElement): HTMLElement | null {
  if (!src) return null;
  if (src.startsWith('@')) {
    // nama yang sama bisa ada di kertas soal dan di label visual: pakai yang terlihat
    const all = [...document.querySelectorAll<HTMLElement>(`[data-src="${CSS.escape(src.slice(1))}"]`)];
    return all.find(visibleEnough) ?? all[0] ?? null;
  }
  return board.querySelector<HTMLElement>(`[data-k="${CSS.escape(src)}"]`);
}
