/**
 * Adegan satu layar (PRD §9.3, §9.4; template setScene/setCap/layout):
 * panggung blueprint, pop-up kiri atas, papan kanan, area bebas = panggung − papan − pop-up.
 * Panggung penuh (layout 'full', PRD v1.5): grid dua kolom tanpa area bebas; kertas dan baris papan diskalakan agar muat.
 * Jenis adegan: soal (kertas), svg (visual interaktif), cards, notes, done. Mode `.narrow` dihapus (K4).
 */
import { esc, html } from '../core/dom';
import { icon, type IconName } from '../core/icons';
import { renderMath } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE_OUT } from '../core/tokens';
import type { Board, Ctx } from './board';
import { Cards } from './cards';
import { expandSeals } from './seal';
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
  /** panggung penuh dua kolom (pop-up + visual kiri, papan kapur kanan), tanpa area bebas */
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
    this.root.append(this.paper, this.svgHost, this.cards.el, this.notes, this.cap, board.el, board.askEl);
    this.full = content.layout === 'full';
    this.root.classList.toggle('lay-full', this.full);
    // panggung penuh: semua baris rumus harus muat setinggi kolom papan (tanpa gulir)
    board.fitHeight = this.full;
    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(this.root);
    // font KaTeX/tampilan bisa selesai dimuat setelah baris ditulis (kunjungan pertama): ukur ulang
    document.fonts?.addEventListener('loadingdone', this.onFonts);
  }

  private readonly onFonts = (): void => (this.full ? this.layout() : this.board.refit());

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
    expandSeals(this.capT);
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

  /**
   * Panggung penuh: kertas soal diskalakan utuh agar muat di kolom visual tanpa gulir (62–125 %).
   * Lebar kertas dikompensasi (100 % / k) sehingga setelah diskalakan tetap selebar kolom; teks ditata ulang
   * pada lebar itu, jadi diukur dua kali. Bila batas bawah tercapai, kolom boleh digulir (sisa ruang dipangkas).
   */
  private fitPaper(): void {
    const art = this.paper.querySelector<HTMLElement>('.soal');
    const H = this.paper.clientHeight;
    if (!art || !H) return;
    let k = 1;
    art.style.setProperty('--paper-k', '1');
    art.style.removeProperty('margin-bottom');
    for (let n = 0; n < 2; n++) {
      const h = art.offsetHeight;
      if (!h) return;
      // offsetHeight = tinggi sebelum transform; tinggi tampil = h × k
      k = Math.min(1.25, Math.max(0.62, H / h));
      art.style.setProperty('--paper-k', k.toFixed(3));
    }
    const over = art.offsetHeight * k > H + 1;
    this.paper.classList.toggle('is-scroll', over);
    // ruang tata letak = tinggi asli; pangkas agar gulir berakhir tepat di bawah kertas yang diskalakan
    art.style.marginBottom = `${Math.round(art.offsetHeight * (k - 1))}px`;
  }

  /**
   * Kertas soal yang perlu digulir (naskah panjang di layar pendek): stabilo fokus (mis. pilihan yang sedang
   * disalin) digulir ke tengah kertas agar terlihat dan bisa menjadi sumber terbang.
   */
  private scrollFocus(): void {
    const f = this.paper.querySelector<HTMLElement>('.hl.focus');
    if (!f || !this.paper.classList.contains('is-scroll')) return;
    const pr = this.paper.getBoundingClientRect();
    const fr = f.getBoundingClientRect();
    if (fr.top >= pr.top && fr.bottom <= pr.bottom) return;
    this.paper.scrollTop += (fr.top + fr.bottom) / 2 - (pr.top + pr.bottom) / 2;
  }

  /** Hitung area bebas (template layout()): dipanggil saat ukuran berubah dan tiap ganti langkah. */
  layout(): void {
    const W = this.root.clientWidth;
    const H = this.root.clientHeight;
    if (!W || !H) return;
    if (this.full) {
      // dua kolom pada satu panggung (CSS grid): pop-up + visual di kiri, papan di kanan; tanpa area bebas
      if (this.mode === 'soal' || this.mode === 'done') {
        this.fitPaper();
        this.scrollFocus();
      }
      this.board.refit();
    } else {
      const capBottom = this.cap.offsetTop + this.cap.offsetHeight;
      const ft = this.mode === 'notes' ? 0 : Math.round((capBottom || 120) + 10);
      const css = getComputedStyle(this.root);
      const bw =
        this.board.el.getBoundingClientRect().width || parseFloat(css.getPropertyValue('--bw')) || 320;
      const fr = Math.round(bw + (H < 420 ? 18 : 34));
      const key = `${fr}|${ft}`;
      if (key !== this.lastKey) {
        this.lastKey = key;
        this.root.style.setProperty('--fr', `${fr}px`);
        this.root.style.setProperty('--ft', `${ft}px`);
      }
    }
    if (this.mode === 'cards') this.cards.fit();
    const vis = this.currentVisual ? this.visuals.get(this.currentVisual) : undefined;
    vis?.resize?.();
  }
}
