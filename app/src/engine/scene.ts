/**
 * Adegan satu layar (PRD §9.3, §9.4; template setScene/setCap/layout):
 * panggung blueprint, pop-up kiri atas, papan kanan, area bebas = panggung − papan − pop-up.
 * Jenis adegan: soal (kertas), svg (visual interaktif), cards, notes, done. Mode `.narrow` dihapus (K4).
 */
import { esc, html } from '../core/dom';
import { icon, type IconName } from '../core/icons';
import { renderMath } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE_OUT } from '../core/tokens';
import type { Board, Ctx } from './board';
import { Cards } from './cards';
import { mathHtml } from '../core/math';
import { verdictLabels, type SoalContent, type Step, type Visual } from './types';

export interface VisualScene {
  el: HTMLElement;
  /** idempoten: membawa visual ke keadaan langkah dari mana pun datangnya */
  apply(state: Record<string, unknown>, c: Ctx): void | Promise<void>;
  /** sketsa SVG untuk catatan lengkap */
  sketch?(): string;
  /** dipanggil saat ukuran area bebas berubah */
  resize?(): void;
  destroy?(): void;
}
export type VisualFactory = () => VisualScene;

export interface CapAction {
  label: string;
  icon?: IconName;
  kind?: 'primary' | 'secondary' | 'gold';
  onClick: () => void;
}

const MODES = ['soal', 'svg', 'cards', 'notes', 'done'] as const;
type Mode = (typeof MODES)[number];

export class Scene {
  readonly root: HTMLElement;
  readonly paper: HTMLElement;
  readonly svgHost: HTMLElement;
  readonly cards: Cards;
  readonly notes: HTMLElement;
  private readonly cap: HTMLElement;
  private readonly capK: HTMLElement;
  private readonly capT: HTMLElement;
  private readonly capA: HTMLElement;
  private mode: Mode | null = null;
  private lastKey = '';
  /** langkah yang pop-up-nya sedang tampil (diselesaikan/diulang: pop-up tidak berkedip ulang) */
  private capStep: Step | null = null;
  /** pembangun HTML catatan lengkap; dijalankan sekali saat bagian catatan pertama dibuka */
  notesBuilder: (() => string) | null = null;
  private hlLevel = -1;
  private visuals = new Map<string, VisualScene>();
  private currentVisual: string | null = null;
  private readonly ro: ResizeObserver;
  /** satu panggung besar tanpa panel papan */
  private readonly full: boolean;

  constructor(
    private readonly content: SoalContent,
    private readonly board: Board,
    private readonly factories: Record<string, VisualFactory>,
  ) {
    this.root = html('<div class="scene bp" data-scene></div>');
    this.paper = html(`<div class="p-soal inFree"><article class="soal" aria-label="Kertas soal">
      <header class="soal-h"><span>Soal ${content.meta.no}</span><span>${esc(content.meta.title)}</span></header>
      <div class="soal-b">${content.paper.html}</div></article></div>`);
    renderMath(this.paper);
    this.svgHost = html('<div class="p-svg inFree"></div>');
    this.cards = new Cards(content.cards, verdictLabels(content.meta));
    this.notes = html('<div class="notes-ov" tabindex="-1"></div>');
    this.cap = html(
      `<div class="cap" role="status" aria-live="polite"><div class="cap-k"></div><div class="cap-t"></div><div class="cap-a"></div></div>`,
    );
    this.capK = this.cap.querySelector('.cap-k')!;
    this.capT = this.cap.querySelector('.cap-t')!;
    this.capA = this.cap.querySelector('.cap-a')!;
    this.root.append(this.paper, this.svgHost, this.cards.el, this.notes, this.cap, board.el);
    this.full = content.layout === 'full';
    this.root.classList.toggle('lay-full', this.full);
    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(this.root);
    // font KaTeX/tampilan bisa selesai dimuat setelah baris ditulis (kunjungan pertama): ukur ulang
    document.fonts?.addEventListener('loadingdone', this.onFonts);
  }

  private readonly onFonts = (): void => this.board.refit();

  destroy(): void {
    this.ro.disconnect();
    document.fonts?.removeEventListener('loadingdone', this.onFonts);
    this.board.destroy();
    this.visuals.forEach((v) => v.destroy?.());
  }

  /** Visual adegan svg yang sudah dibuat (dipakai catatan untuk sketsa). */
  visual(name: string): VisualScene | undefined {
    if (!this.visuals.has(name) && this.factories[name]) this.visuals.set(name, this.factories[name]!());
    return this.visuals.get(name);
  }

  private setMode(m: Mode): void {
    if (this.mode === m) return;
    this.mode = m;
    for (const x of MODES) this.root.classList.toggle(`m-${x}`, x === m);
    // tinggi zona visual bergantung pada mode: hitung sebelum visual baru dianimasikan
    if (this.full) this.layout();
  }

  /** Stabilo bertahap (≤ level menyala). */
  private highlight(level: number, focus?: string): void {
    this.hlLevel = level;
    this.paper.querySelectorAll<HTMLElement>('[data-hl]').forEach((h) => {
      const on = Number(h.dataset.hl) <= level;
      (h.closest('.hl') ?? h).classList.toggle('on', on);
    });
    this.paper.querySelectorAll('.focus').forEach((e) => e.classList.remove('focus'));
    if (focus)
      this.paper
        .querySelector(`[data-src="${CSS.escape(focus.replace(/^@/, ''))}"]`)
        ?.closest('.hl')
        ?.classList.add('focus');
  }

  /** Ganti adegan; mengembalikan true bila stabilo baru dinyalakan (perlu jeda sebelum menulis papan). */
  async setVisual(v: Visual, c: Ctx): Promise<boolean> {
    switch (v.kind) {
      case 'soal': {
        this.setMode('soal');
        const before = this.hlLevel;
        this.highlight(v.hl ?? 0, v.focus);
        return (v.hl ?? 0) > before && c.dir > 0;
      }
      case 'svg': {
        this.setMode('svg');
        const vis = this.visual(v.scene);
        if (!vis) return false;
        if (this.currentVisual !== v.scene) {
          this.svgHost.replaceChildren(vis.el);
          this.currentVisual = v.scene;
        }
        await vis.apply(v.state, c);
        return false;
      }
      case 'cards':
        this.setMode('cards');
        this.cards.flip(v.flip, c);
        this.cards.fit();
        return false;
      case 'notes':
        // catatan dibangun saat pertama kali dibuka (bukan saat halaman dimuat)
        if (this.notesBuilder) {
          this.notes.innerHTML = this.notesBuilder();
          this.notesBuilder = null;
        }
        this.setMode('notes');
        this.notes.scrollTop = 0;
        return false;
      case 'done':
        this.setMode('done');
        return false;
    }
  }

  setCap(step: Step, chapterTitle: string, actions: CapAction[]): void {
    const again = this.capStep === step;
    this.capStep = step;
    this.capK.textContent = `Bagian ${step.ch} · ${chapterTitle}`;
    this.capT.innerHTML = mathHtml(step.cap);
    this.capA.replaceChildren();
    for (const a of actions) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `btn btn--${a.kind ?? 'secondary'}`;
      b.innerHTML = `${a.icon ? icon(a.icon) : ''}<span>${esc(a.label)}</span>`;
      b.addEventListener('click', a.onClick);
      this.capA.append(b);
    }
    if (again) return;
    play(
      this.cap,
      [
        { opacity: 0, transform: 'translateY(-10px) scale(.97)' },
        { opacity: 1, transform: 'none' },
      ],
      {
        duration: DUR.enter,
        easing: EASE_OUT,
        ui: true,
      },
    );
  }

  /** Hitung area bebas (template layout()): dipanggil saat ukuran berubah dan tiap ganti langkah. */
  layout(): void {
    const W = this.root.clientWidth;
    const H = this.root.clientHeight;
    if (!W || !H) return;
    const capBottom = this.cap.offsetTop + this.cap.offsetHeight;
    const ft = this.mode === 'notes' ? 0 : Math.round((capBottom || 120) + 10);
    let fr: number;
    let vz = 0;
    if (this.full) {
      // layar pendek (HP mendatar): visual kiri, baris rumus kanan; selain itu bertumpuk atas–bawah
      const side = H < 460;
      this.root.classList.toggle('full-side', side);
      if (side) fr = Math.round(W * (this.mode === 'cards' ? 0.42 : 0.5));
      else {
        fr = 24;
        const share = this.mode === 'cards' ? 0.56 : this.mode === 'notes' ? 0 : 0.42;
        vz = Math.round((H - ft) * share);
      }
    } else {
      const css = getComputedStyle(this.root);
      const bw =
        this.board.el.getBoundingClientRect().width || parseFloat(css.getPropertyValue('--bw')) || 320;
      fr = Math.round(bw + (H < 420 ? 18 : 34));
    }
    const key = `${fr}|${ft}|${vz}`;
    if (key !== this.lastKey) {
      this.lastKey = key;
      this.root.style.setProperty('--fr', `${fr}px`);
      this.root.style.setProperty('--ft', `${ft}px`);
      this.root.style.setProperty('--vz', `${vz}px`);
    }
    if (this.mode === 'cards') this.cards.fit();
    const vis = this.currentVisual ? this.visuals.get(this.currentVisual) : undefined;
    vis?.resize?.();
  }
}
