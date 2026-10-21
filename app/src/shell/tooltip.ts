/**
 * Tooltip aplikasi (revisi pemilik PRD v1.6: tidak ada UI bawaan peramban).
 * Atribut `title` dipindah ke `data-tip` saat pertama kali disentuh penunjuk atau fokus keyboard, sehingga
 * tooltip bawaan tidak muncul; sebagai gantinya satu gelembung bertema tampil di atas/bawah elemen.
 * Hanya untuk penunjuk halus (mouse) dan fokus keyboard; layar sentuh tidak memakai tooltip.
 */
import { html } from '../core/dom';
import { play } from '../core/motion';
import { DUR, EASE_OUT } from '../core/tokens';

const DELAY_MS = 450;

export function initTooltips(): void {
  const tip = html('<div class="tip" role="tooltip" hidden></div>');
  document.body.append(tip);
  let timer = 0;
  let owner: HTMLElement | null = null;

  /** title → data-tip (sekali); elemen tanpa nama aksesibel mendapat aria-label dari teks tooltip */
  const adopt = (el: HTMLElement): string => {
    const t = el.getAttribute('title');
    if (t !== null) {
      el.removeAttribute('title');
      el.dataset.tip = t;
      if (!el.getAttribute('aria-label') && !el.textContent?.trim()) el.setAttribute('aria-label', t);
    }
    return el.dataset.tip ?? '';
  };

  const hide = (): void => {
    window.clearTimeout(timer);
    owner = null;
    tip.hidden = true;
  };

  const show = (el: HTMLElement): void => {
    const text = adopt(el);
    if (!text || !el.isConnected) return;
    owner = el;
    tip.textContent = text;
    tip.hidden = false;
    const r = el.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    const gap = 8;
    // di bawah elemen bila muat (header), selain itu di atasnya; tetap di dalam layar
    const below = r.bottom + gap + t.height <= innerHeight;
    const x = Math.max(gap, Math.min(innerWidth - t.width - gap, r.left + r.width / 2 - t.width / 2));
    const y = below ? r.bottom + gap : r.top - gap - t.height;
    tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    play(tip, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.fast, easing: EASE_OUT, ui: true });
  };

  const arm = (el: HTMLElement): void => {
    adopt(el);
    window.clearTimeout(timer);
    timer = window.setTimeout(() => show(el), DELAY_MS);
  };

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = (e.target as Element).closest<HTMLElement>('[title], [data-tip]');
    if (el && el !== owner) arm(el);
    else if (!el) hide();
  });
  document.addEventListener('focusin', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('[title], [data-tip]');
    if (el && el.matches(':focus-visible')) arm(el);
  });
  document.addEventListener('focusout', hide);
  document.addEventListener('pointerdown', hide, true);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && hide());
  window.addEventListener('scroll', hide, true);
  window.addEventListener('hashchange', hide);
}
