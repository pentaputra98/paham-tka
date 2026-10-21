/**
 * Coretan (PRD §12, inti FR-COR-1…5, 7, 8): kanvas di atas panggung pembahasan.
 * - alat: pena, penanda (semitransparan), penghapus per goresan; warna merah, biru, putih, abu (tanpa emas);
 *   3 ketebalan; urungkan, ulangi, hapus semua (konfirmasi lewat lembar aplikasi, bukan dialog bawaan peramban), sembunyikan;
 * - Pointer Events (sentuh, stylus, mouse); penolakan telapak tangan: setelah stylus terdeteksi, jari diabaikan;
 * - goresan disimpan sebagai vektor ternormalisasi 0–1 per soal dan per langkah (localStorage), tajam di layar
 *   mana pun; menggambar tidak memicu layout (hanya kanvas digambar ulang).
 * Saat aktif, kanvas menerima semua sentuhan; saat nonaktif, coretan tetap terlihat tetapi tidak menghalangi.
 */
import { icon } from '../core/icons';
import { storage } from '../core/storage';
import { openSheet } from '../shell/sheet';

type Tool = 'pen' | 'mark' | 'erase';
interface Stroke {
  tool: 'pen' | 'mark';
  color: string;
  w: number;
  /** x, y ternormalisasi 0–1 berselang-seling */
  p: number[];
}

const COLORS: Array<[string, string]> = [
  ['merah', '--ink-red'],
  ['biru', '--ink-blue'],
  ['putih', '--ink-white'],
  ['abu', '--ink-grey'],
];
const WIDTHS = [2, 4, 8];
const KEY = 'pahamtka:v1:ink';
const MAX_POINTS = 5000;

export class Ink {
  readonly canvas: HTMLCanvasElement;
  readonly bar: HTMLElement;
  private readonly ctx: CanvasRenderingContext2D;
  private strokes: Stroke[] = [];
  private redo: Stroke[] = [];
  private tool: Tool = 'pen';
  private color = COLORS[0]![1];
  private width = 1;
  private active = false;
  private hidden = false;
  private penSeen = false;
  private cur: Stroke | null = null;
  private page = '';
  private store: Record<string, Stroke[]>;
  private readonly ro: ResizeObserver;
  private readonly off = new AbortController();
  /** dipanggil saat status aktif berubah (tombol di bilah atas) */
  onChange: (active: boolean) => void = () => undefined;

  constructor(
    private readonly host: HTMLElement,
    private readonly soal: number,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'ink';
    this.canvas.setAttribute('aria-hidden', 'true');
    this.ctx = this.canvas.getContext('2d')!;
    this.bar = document.createElement('div');
    this.bar.className = 'ink-bar';
    this.bar.setAttribute('role', 'toolbar');
    this.bar.setAttribute('aria-label', 'Alat coretan');
    this.bar.innerHTML = `
      <div class="seg ink-tools" role="radiogroup" aria-label="Alat">
        <button type="button" role="radio" data-tool="pen" aria-label="Pena" title="Pena">${icon('pen-line')}</button>
        <button type="button" role="radio" data-tool="mark" aria-label="Penanda" title="Penanda">${icon('highlighter')}</button>
        <button type="button" role="radio" data-tool="erase" aria-label="Penghapus goresan" title="Penghapus">${icon('eraser')}</button>
      </div>
      <div class="ink-colors" role="radiogroup" aria-label="Warna">${COLORS.map(([n, v]) => `<button type="button" role="radio" class="ink-sw" data-color="${v}" style="--sw: var(${v})" aria-label="Warna ${n}" title="${n}"></button>`).join('')}</div>
      <div class="seg ink-widths" role="radiogroup" aria-label="Ketebalan">${WIDTHS.map((w, i) => `<button type="button" role="radio" data-width="${i}" aria-label="Ketebalan ${i + 1}" title="Ketebalan ${i + 1}"><span class="ink-dot" style="--d:${w}"></span></button>`).join('')}</div>
      <button type="button" class="icon-btn" data-ink="undo" aria-label="Urungkan" title="Urungkan">${icon('undo-2')}</button>
      <button type="button" class="icon-btn" data-ink="redo" aria-label="Ulangi" title="Ulangi">${icon('redo-2')}</button>
      <button type="button" class="icon-btn" data-ink="clear" aria-label="Hapus semua coretan" title="Hapus semua">${icon('trash-2')}</button>
      <button type="button" class="icon-btn" data-ink="hide" aria-pressed="false" aria-label="Sembunyikan coretan" title="Sembunyikan">${icon('eye-off')}</button>
      <button type="button" class="btn btn--primary ink-done" data-ink="done">${icon('check')}<span>Selesai coret</span></button>`;
    host.append(this.canvas, this.bar);
    this.store = load(soal);
    this.sync();

    const sig = { signal: this.off.signal };
    this.canvas.addEventListener('pointerdown', (e) => this.down(e), sig);
    this.canvas.addEventListener('pointermove', (e) => this.move(e), sig);
    this.canvas.addEventListener('pointerup', () => this.up(), sig);
    this.canvas.addEventListener('pointercancel', () => this.up(), sig);
    this.bar.addEventListener('click', (e) => this.onBar(e), sig);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
  }

  get isActive(): boolean {
    return this.active;
  }

  setActive(on: boolean): void {
    this.active = on;
    this.host.classList.toggle('ink-on', on);
    if (on && this.hidden) this.setHidden(false);
    this.onChange(on);
  }

  /** Ganti halaman coretan (satu lapisan per langkah pembahasan). */
  setPage(page: string): void {
    if (page === this.page) return;
    this.commit();
    this.page = page;
    this.strokes = (this.store[page] ?? []).map((s) => ({ ...s, p: [...s.p] }));
    this.redo = [];
    this.draw();
  }

  destroy(): void {
    this.commit();
    this.off.abort();
    this.ro.disconnect();
    this.canvas.remove();
    this.bar.remove();
  }

  // ---------- masukan ----------
  private down(e: PointerEvent): void {
    if (!this.active) return;
    if (e.pointerType === 'pen') this.penSeen = true;
    // penolakan telapak tangan: setelah stylus terlihat, sentuhan jari tidak menggambar
    if (this.penSeen && e.pointerType === 'touch') return;
    e.preventDefault();
    this.canvas.setPointerCapture(e.pointerId);
    const [x, y] = this.norm(e);
    if (this.tool === 'erase') {
      this.eraseAt(x, y);
      this.cur = { tool: 'pen', color: '', w: 0, p: [] }; // penanda "sedang menghapus"
      return;
    }
    this.cur = { tool: this.tool, color: this.color, w: WIDTHS[this.width]!, p: [x, y] };
    this.strokes.push(this.cur);
    this.redo = [];
    this.draw();
  }

  private move(e: PointerEvent): void {
    if (!this.cur) return;
    const [x, y] = this.norm(e);
    if (this.tool === 'erase') return this.eraseAt(x, y);
    const p = this.cur.p;
    const dx = (x - p[p.length - 2]!) * this.canvas.clientWidth;
    const dy = (y - p[p.length - 1]!) * this.canvas.clientHeight;
    if (dx * dx + dy * dy < 4) return;
    if (this.points() >= MAX_POINTS) return;
    p.push(x, y);
    requestAnimationFrame(() => this.draw());
  }

  private up(): void {
    if (!this.cur) return;
    this.cur = null;
    this.commit();
  }

  private norm(e: PointerEvent): [number, number] {
    const r = this.canvas.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  }

  private points(): number {
    return this.strokes.reduce((n, s) => n + s.p.length / 2, 0);
  }

  /** penghapus berbasis goresan: hapus goresan yang dilewati (jarak ≤ 12 px) */
  private eraseAt(x: number, y: number): void {
    const W = this.canvas.clientWidth;
    const H = this.canvas.clientHeight;
    const before = this.strokes.length;
    this.strokes = this.strokes.filter((s) => {
      for (let i = 0; i < s.p.length; i += 2) {
        const dx = (s.p[i]! - x) * W;
        const dy = (s.p[i + 1]! - y) * H;
        if (dx * dx + dy * dy < 144) {
          this.redo.push(s);
          return false;
        }
      }
      return true;
    });
    if (this.strokes.length !== before) this.draw();
  }

  private onBar(e: Event): void {
    const t = (e.target as Element).closest<HTMLElement>('button');
    if (!t) return;
    if (t.dataset.tool) this.tool = t.dataset.tool as Tool;
    else if (t.dataset.color) {
      this.color = t.dataset.color;
      if (this.tool === 'erase') this.tool = 'pen';
    } else if (t.dataset.width) this.width = Number(t.dataset.width);
    else if (t.dataset.ink === 'undo') {
      const s = this.strokes.pop();
      if (s) this.redo.push(s);
      this.commit();
    } else if (t.dataset.ink === 'redo') {
      const s = this.redo.pop();
      if (s) this.strokes.push(s);
      this.commit();
    } else if (t.dataset.ink === 'clear') {
      if (this.strokes.length)
        openSheet({
          title: 'Hapus semua coretan?',
          body: '<p>Semua coretan di langkah ini akan dihapus dan tidak bisa diurungkan.</p>',
          // Batal lebih dulu: fokus awal jatuh pada aksi yang aman
          actions: [
            { label: 'Batal', kind: 'secondary' },
            {
              label: 'Hapus semua',
              kind: 'danger',
              icon: 'trash-2',
              onClick: () => {
                this.redo = [];
                this.strokes = [];
                this.commit();
                this.sync();
                this.draw();
              },
            },
          ],
          closeLabel: null,
        });
    } else if (t.dataset.ink === 'hide') this.setHidden(!this.hidden);
    else if (t.dataset.ink === 'done') this.setActive(false);
    this.sync();
    this.draw();
  }

  private setHidden(h: boolean): void {
    this.hidden = h;
    this.canvas.classList.toggle('is-hidden', h);
    const b = this.bar.querySelector<HTMLElement>('[data-ink="hide"]');
    b?.setAttribute('aria-pressed', String(h));
    if (b) b.innerHTML = icon(h ? 'eye' : 'eye-off');
  }

  private sync(): void {
    this.bar
      .querySelectorAll<HTMLElement>('[data-tool]')
      .forEach((b) => b.setAttribute('aria-checked', String(b.dataset.tool === this.tool)));
    this.bar
      .querySelectorAll<HTMLElement>('[data-color]')
      .forEach((b) => b.setAttribute('aria-checked', String(b.dataset.color === this.color)));
    this.bar
      .querySelectorAll<HTMLElement>('[data-width]')
      .forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.width) === this.width)));
  }

  private commit(): void {
    if (!this.page) return;
    if (this.strokes.length) this.store[this.page] = this.strokes;
    else this.store = Object.fromEntries(Object.entries(this.store).filter(([k]) => k !== this.page));
    storage.set(`${KEY}:${this.soal}`, JSON.stringify(this.store));
    this.draw();
  }

  // ---------- gambar ----------
  private resize(): void {
    const dpr = Math.min(2, devicePixelRatio || 1);
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  }

  private draw(): void {
    const c = this.ctx;
    const W = this.canvas.clientWidth;
    const H = this.canvas.clientHeight;
    c.clearRect(0, 0, W, H);
    const css = getComputedStyle(this.host);
    for (const s of this.strokes) {
      const p = s.p;
      if (p.length < 2) continue;
      c.strokeStyle = css.getPropertyValue(s.color).trim() || 'white';
      c.lineCap = 'round';
      c.lineJoin = 'round';
      c.globalAlpha = s.tool === 'mark' ? 0.35 : 1;
      c.lineWidth = s.tool === 'mark' ? s.w * 3.5 : s.w;
      c.beginPath();
      c.moveTo(p[0]! * W, p[1]! * H);
      if (p.length === 2) c.lineTo(p[0]! * W + 0.1, p[1]! * H);
      // interpolasi kuadrat lewat titik tengah: garis halus
      for (let i = 2; i < p.length - 2; i += 2) {
        const mx = ((p[i]! + p[i + 2]!) / 2) * W;
        const my = ((p[i + 1]! + p[i + 3]!) / 2) * H;
        c.quadraticCurveTo(p[i]! * W, p[i + 1]! * H, mx, my);
      }
      if (p.length > 2) c.lineTo(p[p.length - 2]! * W, p[p.length - 1]! * H);
      c.stroke();
    }
    c.globalAlpha = 1;
  }
}

function load(soal: number): Record<string, Stroke[]> {
  try {
    const v = JSON.parse(storage.get(`${KEY}:${soal}`) ?? '{}') as unknown;
    return v && typeof v === 'object' ? (v as Record<string, Stroke[]>) : {};
  } catch {
    return {};
  }
}
