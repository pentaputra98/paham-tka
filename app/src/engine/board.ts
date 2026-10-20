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
import { dur, reducedMotion, sleep } from '../core/clock';
import { esc, html } from '../core/dom';
import { mathLabel, tex } from '../core/math';
import { completeAll, play } from '../core/motion';
import { DUR, EASE, EASE_OUT } from '../core/tokens';
import type { Ask, Piece, Pin, Row, Tok } from './types';

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

const isFrac = (p: Piece): p is { frac: [Piece[], Piece[]] } => 'frac' in p;

export class Board {
  readonly el: HTMLElement;
  readonly foot: HTMLElement;
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
    this.el.querySelector('.bd-re')!.addEventListener('click', () => this.onReplay());
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
      n.innerHTML = spec.note.includes('$')
        ? spec.note.replace(/\$([^$]+)\$/g, (_x, s: string) => tex(s))
        : spec.note;
      el.append(n);
    }
    return { id: spec.id, spec, el, m, boxed: false };
  }

  has(id: string): boolean {
    return this.rows.some((r) => r.id === id);
  }

  rowIds(): string[] {
    return this.rows.map((r) => r.id);
  }

  private scroll(): void {
    this.body.scrollTo({ top: this.body.scrollHeight, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  /** Perkecil huruf baris yang lebih lebar dari papan (min 60 %), tidak pernah memotong rumus. */
  private fit(row: RowView): void {
    row.m.style.removeProperty('--fit');
    const avail = this.body.clientWidth - 2 * parseFloat(getComputedStyle(this.body).paddingLeft || '0');
    const need = row.m.scrollWidth;
    if (avail > 0 && need > avail)
      row.m.style.setProperty('--fit', String(Math.max(0.6, avail / need).toFixed(3)));
  }

  /** Hitung ulang penyesuaian saat ukuran papan berubah. */
  refit(): void {
    this.rows.forEach((r) => this.fit(r));
  }

  private dimPast(): void {
    this.rows.forEach((r, i) => r.el.classList.toggle('past', i < this.rows.length - 1));
  }

  private finish(row: RowView, anim: boolean): void {
    row.el.querySelectorAll('.tk.hid').forEach((t) => t.classList.remove('hid'));
    if (row.spec.note) row.el.classList.add('noted');
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

  /** Bersihkan papan sepenuhnya (masuk lobi atau ganti soal). */
  reset(): void {
    this.flush();
    this.cancelAsk();
    this.rows.forEach((r) => r.el.remove());
    this.rows = [];
    this.title = null;
    this.pinKey = '';
    this.pinsEl.replaceChildren();
    this.titleEl.textContent = '–';
    this.foot.replaceChildren();
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
      await this.write(want[i]!, anim, c);
    }
    this.dimPast();
    return c.live();
  }

  private async write(spec: Row, anim: boolean, c: Ctx): Promise<void> {
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
    await sleep(spec.box ? 650 : 330);
  }

  private fly(s: HTMLElement, tk: HTMLElement, c: Ctx): Promise<void> {
    return new Promise((res) => {
      const a = s.getBoundingClientRect();
      const b = tk.getBoundingClientRect();
      const g = tk.cloneNode(true) as HTMLElement;
      g.classList.remove('hid');
      g.classList.add('fly-tok');
      g.dataset.run = String(c.run);
      Object.assign(g.style, {
        left: `${b.left}px`,
        top: `${b.top}px`,
        width: `${b.width}px`,
        height: `${b.height}px`,
        margin: '0',
        fontSize: getComputedStyle(tk).fontSize,
      });
      document.body.append(g);
      s.classList.remove('src-glow');
      void s.offsetWidth;
      s.classList.add('src-glow');
      const dx = a.left + a.width / 2 - (b.left + b.width / 2);
      const dy = a.top + a.height / 2 - (b.top + b.height / 2);
      const sc = Math.max(0.6, Math.min(1.5, a.height / Math.max(b.height, 1)));
      const dist = Math.hypot(dx, dy);
      const arc = Math.min(80, dist * 0.22);
      const D = Math.max(DUR.flyMin, Math.min(DUR.flyMax, dist * 0.95));
      SND.whoosh(0.55);
      const rec: Flying = { g, tk, res: () => res() };
      this.flying.add(rec);
      const k = play(
        g,
        [
          { transform: `translate(${dx}px, ${dy}px) scale(${sc})`, opacity: 0.85 },
          {
            transform: `translate(${dx * 0.5}px, ${dy * 0.5 - arc}px) scale(${(sc + 1.15) / 2})`,
            opacity: 1,
            offset: 0.5,
          },
          { transform: 'none', opacity: 1 },
        ],
        { duration: D, easing: EASE, tag: 'fly' },
      );
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
          setTimeout(res, dur(120));
        } else res();
      });
    });
  }

  // ---------- pertanyaan cepat (template B.ask) ----------
  ask(a: Ask, c: Ctx): Promise<boolean> {
    return new Promise((resolve) => {
      this.onPending(true);
      const f = this.foot;
      f.innerHTML = `<div class="ask"><p class="ask-q"><span class="ask-k">Coba jawab</span>${mathText(a.q)}</p>
        <div class="ask-o${a.col ? ' col' : ''}" role="group"></div>
        <div class="ask-h" role="status" aria-live="polite"></div>
        <div class="ask-x"><button type="button" class="link-btn" data-skip>Lihat jawabannya saja</button></div></div>`;
      const box = f.querySelector<HTMLElement>('.ask-o')!;
      const hint = f.querySelector<HTMLElement>('.ask-h')!;
      const done = (v: boolean): void => {
        if (this.askRes !== done) return;
        this.askRes = null;
        f.replaceChildren();
        this.onPending(false);
        resolve(v);
      };
      this.askRes = done;
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
            hint.innerHTML = `<b class="k-red">Belum tepat.</b> ${mathText(op.hint ?? '')}`;
            return;
          }
          SND.correct();
          b.classList.add('right');
          box.querySelectorAll('button').forEach((x) => (x.disabled = true));
          hint.className = 'ask-h ok';
          hint.innerHTML = `<b class="k-gold">Benar.</b> ${mathText(a.win ?? 'Kita tulis langkahnya.')}`;
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

/** Teks bercampur $…$ (konten bundel tepercaya). */
export function mathText(s: string): string {
  return s.replace(/\$([^$]+)\$/g, (_m, x: string) => tex(x));
}

/** '@nama' → elemen [data-src=nama] di halaman; selain itu id token di papan (baris atau pin). */
export function srcEl(src: string | undefined, board: HTMLElement): HTMLElement | null {
  if (!src) return null;
  if (src.startsWith('@'))
    return document.querySelector<HTMLElement>(`[data-src="${CSS.escape(src.slice(1))}"]`);
  return board.querySelector<HTMLElement>(`[data-k="${CSS.escape(src)}"]`);
}

/** Sumber hanya dipakai bila benar-benar terlihat di layar (template visibleEnough). */
export function visibleEnough(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) return false;
  if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return false;
  if (el.closest('.tk.hid')) return false;
  const hidden = el.closest<HTMLElement>('[hidden], .is-hidden');
  if (hidden) return false;
  const lines = el.closest('.bd-lines');
  if (lines) {
    const lr = lines.getBoundingClientRect();
    if (r.bottom < lr.top || r.top > lr.bottom) return false;
  }
  return getComputedStyle(el).visibility !== 'hidden';
}
