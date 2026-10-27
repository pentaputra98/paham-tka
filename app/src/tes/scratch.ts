/**
 * Kertas coretan tes penguasaan (revisi 1.25, usulan siswa).
 * - Kertas terang terpisah di sisi kanan panggung, soal tetap terlihat di kiri. Satu halaman per soal,
 *   tersimpan di perangkat selama tes berjalan dan dihapus saat tes dikumpulkan.
 * - Tinta gelap kontras di kertas putih (hitam, biru, merah); pena, stabilo, penghapus goresan;
 *   urungkan/ulangi; latar kotak, garis, atau polos; kertas lebar yang bisa digeser dan diperbesar.
 * - Masukan: stylus selalu menulis. Mode "Hanya stylus" (otomatis aktif saat stylus terdeteksi, bisa
 *   dimatikan): jari dan telapak tidak menulis, satu jari menggeser, dua jari memperbesar. Mode jari: satu jari
 *   menulis, sentuhan sebesar telapak diabaikan, dan begitu jari kedua menyentuh goresan yang sedang dibuat
 *   dibatalkan lalu berubah menjadi geser/perbesar sampai semua jari terangkat, jadi cubitan tidak meninggalkan
 *   coretan liar.
 * - Menggambar hanya menggambar ulang kanvas (tanpa tata letak); koordinat disimpan dalam satuan kertas.
 */
import { clamp } from '../core/dom';
import { icon } from '../core/icons';
import { storage } from '../core/storage';
import { openSheet } from '../shell/sheet';
import { toast } from '../shell/toast';

type Tool = 'pen' | 'mark' | 'erase';
type Bg = 'grid' | 'lines' | 'plain';

interface Stroke {
  t: 'pen' | 'mark';
  /** indeks warna */
  c: number;
  /** indeks ketebalan */
  w: number;
  /** x, y berselang-seling dalam satuan kertas (dibulatkan 0,1) */
  p: number[];
}

interface Pref {
  on: boolean;
  stylus: boolean;
  bg: Bg;
  tool: Tool;
  color: number;
  width: number;
}

const KEY_PAGES = 'pahamtka:v1:tes-coret';
const KEY_PREF = 'pahamtka:v1:coret-pref';
/** ukuran kertas dalam satuan kertas (1 satuan = 1 px CSS pada perbesaran 100 %) */
export const SHEET_W = 1600;
export const SHEET_H = 2000;
const MAX_ZOOM = 4;
const GRID = 32;
const RULE = 40;
const WIDTHS = [2, 3.5, 6];
const COLORS: Array<[string, string]> = [
  ['hitam', '--coret-1'],
  ['biru', '--coret-2'],
  ['merah', '--coret-3'],
];
const MAX_POINTS = 12000;
/** sentuhan selebar ini (px CSS) dianggap telapak tangan */
const PALM_PX = 44;
/** perubahan jarak dua jari di bawah ini dianggap geser saja (cubitan tidak sengaja) */
const PINCH_DEAD = 0.04;

const DEFAULT_PREF: Pref = { on: false, stylus: false, bg: 'grid', tool: 'pen', color: 0, width: 1 };

export function loadPref(): Pref {
  try {
    const v = JSON.parse(storage.get(KEY_PREF) ?? '{}') as Partial<Pref>;
    return {
      on: v.on === true,
      stylus: v.stylus === true,
      bg: v.bg === 'lines' || v.bg === 'plain' ? v.bg : 'grid',
      tool: v.tool === 'mark' || v.tool === 'erase' ? v.tool : 'pen',
      color: Number.isInteger(v.color) && v.color! >= 0 && v.color! < COLORS.length ? v.color! : 0,
      width: Number.isInteger(v.width) && v.width! >= 0 && v.width! < WIDTHS.length ? v.width! : 1,
    };
  } catch {
    return { ...DEFAULT_PREF };
  }
}

const savePref = (p: Pref): void => {
  storage.set(KEY_PREF, JSON.stringify(p));
};

/** Hapus coretan tes (dipanggil saat tes dikumpulkan atau dibatalkan). */
export function clearScratch(): void {
  storage.remove(KEY_PAGES);
}

function validStroke(s: unknown): s is Stroke {
  const x = s as Stroke;
  return (
    !!x &&
    (x.t === 'pen' || x.t === 'mark') &&
    Number.isInteger(x.c) &&
    Number.isInteger(x.w) &&
    Array.isArray(x.p) &&
    x.p.length >= 2 &&
    x.p.every((n) => typeof n === 'number' && Number.isFinite(n))
  );
}

function loadPages(id: string): Record<string, Stroke[]> {
  try {
    const v = JSON.parse(storage.get(KEY_PAGES) ?? 'null') as { id?: string; pages?: unknown } | null;
    if (!v || v.id !== id || !v.pages || typeof v.pages !== 'object') return {};
    const out: Record<string, Stroke[]> = {};
    for (const [k, list] of Object.entries(v.pages as Record<string, unknown>))
      if (Array.isArray(list)) out[k] = list.filter(validStroke);
    return out;
  } catch {
    return {};
  }
}

const r1 = (n: number): number => Math.round(n * 10) / 10;

interface View {
  s: number;
  tx: number;
  ty: number;
}

interface Gesture {
  s0: number;
  /** titik kertas di bawah pusat jari saat gestur dimulai */
  wx: number;
  wy: number;
  d0: number;
  pinch: boolean;
}

export class Scratch {
  /** permukaan coretan (di panggung) */
  readonly el: HTMLElement;
  /** bilah alat (di bilah navigasi bawah) */
  readonly bar: HTMLElement;
  /** menu alat lain (melayang di atas bilah) */
  readonly menu: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly surf: HTMLElement;
  private readonly hint: HTMLElement;
  private readonly zoomChip: HTMLButtonElement;
  readonly pref: Pref;
  private pages: Record<string, Stroke[]>;
  private strokes: Stroke[] = [];
  private redo: Stroke[] = [];
  private page = '';
  private views = new Map<string, View>();
  private v: View = { s: 1, tx: 0, ty: 0 };
  private visible = false;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private raf = 0;
  private cssColors: string[] = [];
  private paperCss = { bg: '', line: '', margin: '' };

  // masukan
  private touches = new Map<number, { x: number; y: number }>();
  private ignored = new Set<number>();
  private drawId: number | null = null;
  private drawType = '';
  private cur: Stroke | null = null;
  /** goresan yang terhapus oleh sapuan penghapus saat ini (untuk dibatalkan bila berubah jadi gestur) */
  private erased: Stroke[] = [];
  private erasing = false;
  private gesturing = false;
  private g: Gesture | null = null;
  private panning: { x: number; y: number } | null = null;
  private penNoticed = false;
  private swallowId: number | null = null;
  private readonly ro: ResizeObserver;
  private readonly off = new AbortController();

  constructor(private readonly testId: string) {
    this.pref = loadPref();
    this.pages = loadPages(testId);
    // tes lain (atau rusak): mulai bersih
    storage.set(KEY_PAGES, JSON.stringify({ id: testId, pages: this.pages }));

    this.el = document.createElement('section');
    this.el.className = 'sc';
    this.el.setAttribute('aria-label', 'Kertas coretan');
    this.el.hidden = true;
    this.el.innerHTML = `<div class="sc-surf">
        <canvas class="sc-cv" aria-hidden="true"></canvas>
        <p class="sc-hint" aria-hidden="true"><b>Kertas coretan</b><span data-hint></span></p>
        <button type="button" class="sc-zoom num" data-sc="fit" hidden></button>
      </div>`;
    this.surf = this.el.querySelector('.sc-surf')!;
    this.canvas = this.el.querySelector('canvas')!;
    this.ctx = this.canvas.getContext('2d')!;
    this.hint = this.el.querySelector('.sc-hint')!;
    this.zoomChip = this.el.querySelector('.sc-zoom')!;

    this.bar = document.createElement('div');
    this.bar.className = 'sc-bar';
    this.bar.setAttribute('role', 'toolbar');
    this.bar.setAttribute('aria-label', 'Alat coretan');
    this.bar.hidden = true;
    this.bar.innerHTML = `
      <div class="seg sc-tools" role="radiogroup" aria-label="Alat">
        <button type="button" role="radio" data-tool="pen" aria-label="Pena" title="Pena">${icon('pen-line')}</button>
        <button type="button" role="radio" data-tool="mark" aria-label="Stabilo" title="Stabilo">${icon('highlighter')}</button>
        <button type="button" role="radio" data-tool="erase" aria-label="Penghapus" title="Penghapus (hapus goresan yang disapu)">${icon('eraser')}</button>
      </div>
      <div class="sc-colors" role="radiogroup" aria-label="Warna tinta">${COLORS.map(
        ([n, v], i) =>
          `<button type="button" role="radio" class="sc-sw" data-color="${i}" style="--sw: var(${v})" aria-label="Tinta ${n}" title="Tinta ${n}"></button>`,
      ).join('')}</div>
      <button type="button" class="icon-btn" data-sc="undo" aria-label="Urungkan" title="Urungkan (Ctrl+Z)">${icon('undo-2')}</button>
      <button type="button" class="icon-btn sc-redo" data-sc="redo" aria-label="Ulangi" title="Ulangi (Ctrl+Y)">${icon('redo-2')}</button>
      <button type="button" class="icon-btn sc-stylus" data-sc="stylus" aria-pressed="false" aria-label="Hanya stylus yang menulis" title="Hanya stylus yang menulis (telapak tangan dan jari tidak menulis)">${icon('pen-tool')}</button>
      <button type="button" class="icon-btn" data-sc="menu" aria-expanded="false" aria-label="Alat lain" title="Alat lain">${icon('ellipsis')}</button>`;

    this.menu = document.createElement('div');
    this.menu.className = 'sc-menu';
    this.menu.hidden = true;
    this.menu.setAttribute('role', 'dialog');
    this.menu.setAttribute('aria-label', 'Pengaturan coretan');
    this.menu.innerHTML = `
      <div class="sc-row"><span class="sc-lbl" id="sc-w">Ketebalan</span>
        <div class="seg" role="radiogroup" aria-labelledby="sc-w">${WIDTHS.map(
          (w, i) =>
            `<button type="button" role="radio" data-width="${i}" aria-label="Ketebalan ${i + 1}"><span class="sc-dot" style="--d:${w}"></span></button>`,
        ).join('')}</div></div>
      <div class="sc-row"><span class="sc-lbl" id="sc-bg">Latar</span>
        <div class="seg" role="radiogroup" aria-labelledby="sc-bg">
          <button type="button" role="radio" data-bg="grid">${icon('grid-3x3')}<span>Kotak</span></button>
          <button type="button" role="radio" data-bg="lines">${icon('rows-3')}<span>Garis</span></button>
          <button type="button" role="radio" data-bg="plain">${icon('square')}<span>Polos</span></button>
        </div></div>
      <button type="button" class="toggle" role="switch" data-sc="stylus" aria-checked="false">
        <span class="toggle-text">Hanya stylus yang menulis<small>Telapak dan jari tidak menulis. Satu jari menggeser, dua jari memperbesar.</small></span><span class="sw" aria-hidden="true"></span>
      </button>
      <div class="sc-acts">
        <button type="button" class="btn" data-sc="redo">${icon('redo-2')}<span>Ulangi</span></button>
        <button type="button" class="btn" data-sc="fit">${icon('scan')}<span>Tampilan awal</span></button>
        <button type="button" class="btn btn--danger" data-sc="clear">${icon('trash-2')}<span>Hapus coretan soal ini</span></button>
      </div>`;

    const sig = { signal: this.off.signal };
    const cv = this.canvas;
    cv.addEventListener('pointerdown', (e) => this.down(e), sig);
    cv.addEventListener('pointermove', (e) => this.move(e), sig);
    cv.addEventListener('pointerup', (e) => this.up(e, false), sig);
    cv.addEventListener('pointercancel', (e) => this.up(e, true), sig);
    cv.addEventListener('lostpointercapture', (e) => this.up(e, false), sig);
    cv.addEventListener('wheel', (e) => this.wheel(e), { ...sig, passive: false });
    cv.addEventListener('contextmenu', (e) => e.preventDefault(), sig);
    // Safari iOS: cubit halaman
    for (const t of ['gesturestart', 'gesturechange', 'gestureend'])
      this.el.addEventListener(t, (e) => e.preventDefault(), sig);
    this.bar.addEventListener('click', (e) => this.onTool(e), sig);
    this.menu.addEventListener('click', (e) => this.onTool(e), sig);
    this.zoomChip.addEventListener('click', () => this.fit(), sig);
    document.addEventListener(
      'pointerdown',
      (e) => {
        if (this.menu.hidden) return;
        const t = e.target as Element;
        if (t.closest('.sc-menu') || t.closest('[data-sc="menu"]')) return;
        this.closeMenu();
        // ketukan di kertas untuk menutup menu tidak ikut menjadi titik coretan
        if (t === this.canvas) this.swallowId = e.pointerId;
      },
      { ...sig, capture: true },
    );
    document.addEventListener('keydown', (e) => this.key(e), sig);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.surf);
    this.sync();
  }

  get isVisible(): boolean {
    return this.visible;
  }

  setVisible(on: boolean): void {
    this.visible = on;
    this.el.hidden = !on;
    this.bar.hidden = !on;
    if (!on) {
      this.closeMenu();
      this.endInput();
    } else {
      this.readColors();
      this.resize();
    }
    this.pref.on = on;
    savePref(this.pref);
  }

  /** Ganti halaman ke soal ke-i. */
  setPage(i: number): void {
    const page = String(i);
    if (page === this.page) return;
    this.endInput();
    if (this.page) this.views.set(this.page, { ...this.v });
    this.page = page;
    this.strokes = (this.pages[page] ?? []).map((s) => ({ ...s, p: [...s.p] }));
    this.redo = [];
    this.v = this.views.get(page) ?? { s: 1, tx: 0, ty: 0 };
    this.clampView();
    this.sync();
    this.request();
  }

  hasInk(i: number): boolean {
    return (this.pages[String(i)]?.length ?? 0) > 0;
  }

  destroy(): void {
    this.endInput();
    this.off.abort();
    this.ro.disconnect();
    cancelAnimationFrame(this.raf);
    this.el.remove();
    this.bar.remove();
    this.menu.remove();
  }

  // ---------------------------------------------------------------------------------------------
  // masukan
  // ---------------------------------------------------------------------------------------------
  private local(e: PointerEvent): [number, number] {
    const r = this.canvas.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  /** tangkap penunjuk (gagal diam-diam bila penunjuk sudah terangkat) */
  private capture(id: number): void {
    try {
      this.canvas.setPointerCapture(id);
    } catch {
      /* penunjuk tidak aktif */
    }
  }

  private toWorld(x: number, y: number): [number, number] {
    return [(x - this.v.tx) / this.v.s, (y - this.v.ty) / this.v.s];
  }

  private down(e: PointerEvent): void {
    if (!this.visible) return;
    e.preventDefault();
    if (this.swallowId === e.pointerId) {
      this.swallowId = null;
      return;
    }
    const [x, y] = this.local(e);

    if (e.pointerType === 'pen') {
      if (!this.pref.stylus && !this.penNoticed) {
        this.penNoticed = true;
        this.setStylus(true, true);
      }
      // stylus mengambil alih dari jari: goresan jari yang mungkin tersentuh telapak dibatalkan
      if (this.drawId !== null && this.drawType === 'touch') this.cancelDraw();
      this.endGesture();
      this.startDraw(e, x, y, (e.buttons & 32) !== 0);
      return;
    }

    if (e.pointerType === 'touch') {
      // telapak: sentuhan lebar diabaikan sampai terangkat
      if (Math.max(e.width, e.height) > PALM_PX) {
        this.ignored.add(e.pointerId);
        return;
      }
      // stylus sedang menulis: sentuhan lain (telapak, jari) diabaikan
      if (this.drawId !== null && this.drawType === 'pen') {
        this.ignored.add(e.pointerId);
        return;
      }
      this.touches.set(e.pointerId, { x, y });
      this.capture(e.pointerId);
      if (this.pref.stylus || this.gesturing || this.touches.size > 1) {
        // jari kedua datang saat jari pertama menulis: batalkan goresan itu
        if (this.drawId !== null && this.drawType === 'touch') this.cancelDraw();
        this.startGesture();
        return;
      }
      this.startDraw(e, x, y, false);
      return;
    }

    // tetikus: tombol kiri menulis, tombol tengah/kanan menggeser
    if (e.button === 0) this.startDraw(e, x, y, false);
    else {
      this.panning = { x, y };
      this.capture(e.pointerId);
    }
  }

  private move(e: PointerEvent): void {
    if (this.ignored.has(e.pointerId)) return;
    const [x, y] = this.local(e);
    const t = this.touches.get(e.pointerId);
    if (t) {
      t.x = x;
      t.y = y;
      if (this.gesturing) this.applyGesture();
      // jari yang menulis: lanjutkan goresan di bawah
      if (e.pointerId !== this.drawId) return;
    }
    if (this.panning) {
      this.v.tx += x - this.panning.x;
      this.v.ty += y - this.panning.y;
      this.panning = { x, y };
      this.clampView();
      this.request();
      return;
    }
    if (e.pointerId !== this.drawId) return;
    const evs = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : [];
    for (const ce of evs.length ? evs : [e]) {
      const [cx, cy] = this.local(ce);
      this.addPoint(cx, cy);
    }
  }

  private up(e: PointerEvent, cancelled: boolean): void {
    if (this.ignored.delete(e.pointerId)) return;
    if (this.panning && e.pointerType === 'mouse') {
      this.panning = null;
      return;
    }
    if (e.pointerId === this.drawId) {
      // pointercancel pada jari biasanya berarti peramban mengambil alih (gestur): buang goresan
      if (cancelled && this.drawType === 'touch') this.cancelDraw();
      else this.finishDraw();
    }
    if (this.touches.delete(e.pointerId) && this.gesturing) {
      if (this.touches.size === 0) this.endGesture();
      else this.startGesture();
    }
  }

  private startDraw(e: PointerEvent, x: number, y: number, eraserButton: boolean): void {
    this.drawId = e.pointerId;
    this.drawType = e.pointerType;
    if (e.pointerType !== 'touch') this.capture(e.pointerId);
    const [wx, wy] = this.toWorld(x, y);
    if (this.pref.tool === 'erase' || eraserButton) {
      this.erasing = true;
      this.erased = [];
      this.eraseAt(wx, wy);
      return;
    }
    if (this.points() >= MAX_POINTS) {
      toast('Kertas coretan soal ini sudah penuh. Hapus sebagian coretan dulu.');
      this.drawId = null;
      return;
    }
    this.cur = {
      t: this.pref.tool === 'mark' ? 'mark' : 'pen',
      c: this.pref.color,
      w: this.pref.width,
      p: [r1(wx), r1(wy)],
    };
    this.strokes.push(this.cur);
    this.hint.hidden = true;
    this.request();
  }

  private addPoint(x: number, y: number): void {
    const [wx, wy] = this.toWorld(x, y);
    if (this.erasing) return this.eraseAt(wx, wy);
    const c = this.cur;
    if (!c) return;
    const p = c.p;
    const dx = (wx - p[p.length - 2]!) * this.v.s;
    const dy = (wy - p[p.length - 1]!) * this.v.s;
    if (dx * dx + dy * dy < 2.25) return;
    if (p.length / 2 > 4000) return;
    p.push(r1(wx), r1(wy));
    this.request();
  }

  private finishDraw(): void {
    if (this.erasing) {
      if (this.erased.length) {
        this.redo = [];
        this.commit();
      }
    } else if (this.cur) {
      this.redo = [];
      this.commit();
    }
    this.drawId = null;
    this.cur = null;
    this.erasing = false;
    this.erased = [];
  }

  /** Batalkan goresan atau sapuan penghapus yang sedang berjalan tanpa jejak. */
  private cancelDraw(): void {
    if (this.erasing) this.strokes.push(...this.erased);
    else if (this.cur) this.strokes = this.strokes.filter((s) => s !== this.cur);
    this.drawId = null;
    this.cur = null;
    this.erasing = false;
    this.erased = [];
    this.syncHint();
    this.request();
  }

  private endInput(): void {
    if (this.drawId !== null) this.finishDraw();
    this.endGesture();
    this.touches.clear();
    this.ignored.clear();
    this.panning = null;
  }

  // ---------- geser dan perbesar ----------
  private center(): { x: number; y: number; d: number } {
    const pts = [...this.touches.values()].slice(0, 2);
    if (pts.length < 2) return { x: pts[0]!.x, y: pts[0]!.y, d: 0 };
    const [a, b] = pts as [{ x: number; y: number }, { x: number; y: number }];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) };
  }

  private startGesture(): void {
    if (!this.touches.size) return;
    this.gesturing = true;
    const c = this.center();
    const [wx, wy] = this.toWorld(c.x, c.y);
    this.g = { s0: this.v.s, wx, wy, d0: c.d, pinch: false };
  }

  private applyGesture(): void {
    const g = this.g;
    if (!g || !this.touches.size) return;
    const c = this.center();
    let s = g.s0;
    if (g.d0 > 0 && c.d > 0) {
      const f = c.d / g.d0;
      if (g.pinch || Math.abs(f - 1) > PINCH_DEAD) {
        g.pinch = true;
        s = clamp(g.s0 * f, this.minScale(), MAX_ZOOM);
      }
    }
    this.v.s = s;
    this.v.tx = c.x - g.wx * s;
    this.v.ty = c.y - g.wy * s;
    this.clampView();
    this.request();
  }

  private endGesture(): void {
    this.gesturing = false;
    this.g = null;
  }

  private wheel(e: WheelEvent): void {
    if (!this.visible) return;
    e.preventDefault();
    const [x, y] = [e.offsetX, e.offsetY];
    if (e.ctrlKey || e.metaKey) {
      const [wx, wy] = this.toWorld(x, y);
      const s = clamp(this.v.s * Math.exp(-e.deltaY / 300), this.minScale(), MAX_ZOOM);
      this.v = { s, tx: x - wx * s, ty: y - wy * s };
    } else {
      this.v.tx -= e.shiftKey ? e.deltaY : e.deltaX;
      this.v.ty -= e.shiftKey ? 0 : e.deltaY;
    }
    this.clampView();
    this.request();
  }

  private minScale(): number {
    if (!this.W || !this.H) return 1;
    return Math.min(1, Math.max(this.W / SHEET_W, this.H / SHEET_H));
  }

  private clampView(): void {
    const v = this.v;
    v.s = clamp(v.s, this.minScale(), MAX_ZOOM);
    v.tx = clamp(v.tx, Math.min(0, this.W - SHEET_W * v.s), 0);
    v.ty = clamp(v.ty, Math.min(0, this.H - SHEET_H * v.s), 0);
    const home = Math.abs(v.s - 1) < 0.01 && v.tx > -1 && v.ty > -1;
    this.zoomChip.hidden = home;
    if (!home) this.zoomChip.textContent = `${Math.round(v.s * 100)}%`;
    this.zoomChip.setAttribute(
      'aria-label',
      `Perbesaran ${Math.round(v.s * 100)} persen. Kembalikan tampilan awal`,
    );
  }

  private fit(): void {
    this.v = { s: 1, tx: 0, ty: 0 };
    this.clampView();
    this.request();
  }

  // ---------- penghapus ----------
  private eraseAt(wx: number, wy: number): void {
    const r = 12 / this.v.s;
    const r2 = r * r;
    const before = this.strokes.length;
    this.strokes = this.strokes.filter((s) => {
      const pad = (WIDTHS[s.w] ?? 3) * (s.t === 'mark' ? 2 : 0.5);
      const lim = (r + pad) * (r + pad);
      for (let i = 0; i < s.p.length; i += 2) {
        const dx = s.p[i]! - wx;
        const dy = s.p[i + 1]! - wy;
        if (dx * dx + dy * dy < Math.max(r2, lim)) {
          this.erased.push(s);
          return false;
        }
      }
      return true;
    });
    if (this.strokes.length !== before) this.request();
  }

  private points(): number {
    return this.strokes.reduce((n, s) => n + s.p.length / 2, 0);
  }

  // ---------------------------------------------------------------------------------------------
  // alat
  // ---------------------------------------------------------------------------------------------
  private onTool(e: Event): void {
    const b = (e.target as Element).closest<HTMLElement>('button');
    if (!b) return;
    const d = b.dataset;
    if (d.tool) this.pref.tool = d.tool as Tool;
    else if (d.color) {
      this.pref.color = Number(d.color);
      if (this.pref.tool === 'erase') this.pref.tool = 'pen';
    } else if (d.width) {
      this.pref.width = Number(d.width);
      if (this.pref.tool === 'erase') this.pref.tool = 'pen';
    } else if (d.bg) {
      this.pref.bg = d.bg as Bg;
      this.request();
    } else if (d.sc === 'undo') this.undo();
    else if (d.sc === 'redo') this.redoOne();
    else if (d.sc === 'stylus') this.setStylus(!this.pref.stylus, false);
    else if (d.sc === 'fit') {
      this.fit();
      this.closeMenu();
    } else if (d.sc === 'menu') {
      if (this.menu.hidden) this.openMenu();
      else this.closeMenu();
      return;
    } else if (d.sc === 'clear') {
      this.closeMenu();
      if (!this.strokes.length) return;
      openSheet({
        title: 'Hapus coretan soal ini?',
        body: '<p>Semua coretan di kertas soal ini akan dihapus. Jawabanmu tidak berubah.</p>',
        actions: [
          { label: 'Batal', kind: 'secondary' },
          {
            label: 'Hapus coretan',
            kind: 'danger',
            icon: 'trash-2',
            onClick: () => {
              this.strokes = [];
              this.redo = [];
              this.commit();
            },
          },
        ],
        closeLabel: null,
      });
      return;
    }
    savePref(this.pref);
    this.sync();
  }

  private undo(): void {
    const s = this.strokes.pop();
    if (!s) return;
    this.redo.push(s);
    this.commit();
  }

  private redoOne(): void {
    const s = this.redo.pop();
    if (!s) return;
    this.strokes.push(s);
    this.commit();
  }

  private setStylus(on: boolean, auto: boolean): void {
    this.pref.stylus = on;
    savePref(this.pref);
    this.sync();
    toast(
      on
        ? auto
          ? 'Stylus terdeteksi. Kini hanya stylus yang menulis; telapak tangan dan jari tidak menulis.'
          : 'Hanya stylus yang menulis. Satu jari menggeser kertas, dua jari memperbesar.'
        : 'Jari ikut menulis. Sentuhan selebar telapak tangan tetap diabaikan.',
    );
  }

  private openMenu(): void {
    this.menu.hidden = false;
    this.bar.querySelector('[data-sc="menu"]')!.setAttribute('aria-expanded', 'true');
  }

  private closeMenu(): void {
    if (this.menu.hidden) return;
    this.menu.hidden = true;
    this.bar.querySelector('[data-sc="menu"]')!.setAttribute('aria-expanded', 'false');
  }

  private key(e: KeyboardEvent): void {
    if (!this.visible) return;
    if (e.key === 'Escape' && !this.menu.hidden) {
      this.closeMenu();
      e.stopImmediatePropagation();
      return;
    }
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'z' && !e.shiftKey) this.undo();
    else if (k === 'y' || (k === 'z' && e.shiftKey)) this.redoOne();
    else return;
    e.preventDefault();
  }

  private sync(): void {
    const p = this.pref;
    const mark = (sel: string, f: (b: HTMLElement) => boolean): void =>
      [this.bar, this.menu].forEach((root) =>
        root.querySelectorAll<HTMLElement>(sel).forEach((b) => b.setAttribute('aria-checked', String(f(b)))),
      );
    mark('[data-tool]', (b) => b.dataset.tool === p.tool);
    mark('[data-color]', (b) => Number(b.dataset.color) === p.color && p.tool !== 'erase');
    mark('[data-width]', (b) => Number(b.dataset.width) === p.width);
    mark('[data-bg]', (b) => b.dataset.bg === p.bg);
    this.bar.querySelector('.sc-stylus')!.setAttribute('aria-pressed', String(p.stylus));
    this.menu.querySelector('[data-sc="stylus"]')!.setAttribute('aria-checked', String(p.stylus));
    (this.bar.querySelector('[data-sc="undo"]') as HTMLButtonElement).disabled = !this.strokes.length;
    this.bar
      .querySelectorAll<HTMLButtonElement>('[data-sc="redo"]')
      .forEach((b) => (b.disabled = !this.redo.length));
    (this.menu.querySelector('[data-sc="redo"]') as HTMLButtonElement).disabled = !this.redo.length;
    (this.menu.querySelector('[data-sc="clear"]') as HTMLButtonElement).disabled = !this.strokes.length;
    this.el.dataset.tool = p.tool;
    this.hint.querySelector('[data-hint]')!.textContent = p.stylus
      ? 'Stylus menulis. Satu jari menggeser, dua jari memperbesar.'
      : 'Tulis dengan jari atau stylus. Dua jari untuk menggeser dan memperbesar.';
    this.syncHint();
  }

  private syncHint(): void {
    this.hint.hidden = this.strokes.length > 0;
  }

  private commit(): void {
    if (!this.page) return;
    if (this.strokes.length) this.pages[this.page] = this.strokes.map((s) => ({ ...s, p: [...s.p] }));
    else this.pages = Object.fromEntries(Object.entries(this.pages).filter(([k]) => k !== this.page));
    if (!storage.set(KEY_PAGES, JSON.stringify({ id: this.testId, pages: this.pages })))
      toast('Penyimpanan perangkat penuh. Coretan hanya tersimpan sampai halaman ditutup.');
    this.sync();
    this.request();
  }

  // ---------------------------------------------------------------------------------------------
  // gambar
  // ---------------------------------------------------------------------------------------------
  private readColors(): void {
    const css = getComputedStyle(this.el);
    this.cssColors = COLORS.map(([, v]) => css.getPropertyValue(v).trim() || 'black');
    this.paperCss = {
      bg: css.getPropertyValue('--coret-paper').trim() || 'white',
      line: css.getPropertyValue('--coret-line').trim() || 'lightsteelblue',
      margin: css.getPropertyValue('--coret-margin').trim() || 'pink',
    };
  }

  private resize(): void {
    const w = this.surf.clientWidth;
    const h = this.surf.clientHeight;
    if (!w || !h) return;
    this.dpr = Math.min(2, devicePixelRatio || 1);
    this.W = w;
    this.H = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.clampView();
    this.draw();
  }

  private request(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.draw();
    });
  }

  private draw(): void {
    if (!this.visible || !this.W) return;
    if (!this.cssColors.length) this.readColors();
    const c = this.ctx;
    const { s, tx, ty } = this.v;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.fillStyle = this.paperCss.bg;
    c.fillRect(0, 0, this.W, this.H);
    // latar mengikuti kertas (ikut tergeser dan membesar)
    const x0 = Math.max(0, -tx / s);
    const y0 = Math.max(0, -ty / s);
    const x1 = Math.min(SHEET_W, (this.W - tx) / s);
    const y1 = Math.min(SHEET_H, (this.H - ty) / s);
    c.lineWidth = 1;
    c.strokeStyle = this.paperCss.line;
    c.beginPath();
    if (this.pref.bg === 'grid') {
      for (let gx = Math.ceil(x0 / GRID) * GRID; gx <= x1; gx += GRID) {
        const X = Math.round(gx * s + tx) + 0.5;
        c.moveTo(X, y0 * s + ty);
        c.lineTo(X, y1 * s + ty);
      }
    }
    if (this.pref.bg !== 'plain') {
      const step = this.pref.bg === 'grid' ? GRID : RULE;
      for (let gy = Math.ceil(y0 / step) * step; gy <= y1; gy += step) {
        const Y = Math.round(gy * s + ty) + 0.5;
        c.moveTo(x0 * s + tx, Y);
        c.lineTo(x1 * s + tx, Y);
      }
    }
    c.stroke();
    if (this.pref.bg === 'lines') {
      c.strokeStyle = this.paperCss.margin;
      c.beginPath();
      const X = Math.round(56 * s + tx) + 0.5;
      c.moveTo(X, y0 * s + ty);
      c.lineTo(X, y1 * s + ty);
      c.stroke();
    }
    // goresan
    c.setTransform(this.dpr * s, 0, 0, this.dpr * s, this.dpr * tx, this.dpr * ty);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    for (const st of this.strokes) {
      const p = st.p;
      c.strokeStyle = this.cssColors[st.c] ?? this.cssColors[0]!;
      c.globalAlpha = st.t === 'mark' ? 0.3 : 1;
      c.lineWidth = (WIDTHS[st.w] ?? 3.5) * (st.t === 'mark' ? 4 : 1);
      c.beginPath();
      c.moveTo(p[0]!, p[1]!);
      if (p.length === 2) c.lineTo(p[0]! + 0.01, p[1]!);
      // kurva kuadrat lewat titik tengah: garis halus
      for (let i = 2; i < p.length - 2; i += 2) {
        const mx = (p[i]! + p[i + 2]!) / 2;
        const my = (p[i + 1]! + p[i + 3]!) / 2;
        c.quadraticCurveTo(p[i]!, p[i + 1]!, mx, my);
      }
      if (p.length > 2) c.lineTo(p[p.length - 2]!, p[p.length - 1]!);
      c.stroke();
    }
    c.globalAlpha = 1;
  }
}
