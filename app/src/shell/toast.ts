/** Toast (PRD §13.6): aria-live polite, tidak mencuri fokus, hilang otomatis 3–5 s. */
import { esc, html } from '../core/dom';
import { play } from '../core/motion';
import { DUR, EASE_OUT, RISE_PX } from '../core/tokens';

export interface ToastOptions {
  kind?: 'info' | 'result';
  action?: { label: string; onClick: () => void };
  /** ms; 0 = tetap sampai ditutup lewat aksi */
  duration?: number;
}

let host: HTMLElement | null = null;

function ensureHost(): HTMLElement {
  if (host?.isConnected) return host;
  host = html('<div class="toast-host" role="status" aria-live="polite" aria-atomic="false"></div>');
  document.body.append(host);
  return host;
}

export function toast(message: string, o: ToastOptions = {}): { dismiss: () => void } {
  const h = ensureHost();
  const el = html(
    `<div class="toast${o.kind === 'result' ? ' toast--result' : ''}"><span>${esc(message)}</span></div>`,
  );
  if (o.action) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn';
    b.textContent = o.action.label;
    b.addEventListener('click', () => {
      o.action!.onClick();
      dismiss();
    });
    el.append(b);
  }
  h.append(el);
  play(
    el,
    [
      { opacity: 0, transform: `translateY(${RISE_PX}px)` },
      { opacity: 1, transform: 'none' },
    ],
    {
      duration: DUR.base,
      easing: EASE_OUT,
      ui: true,
    },
  );
  let gone = false;
  const dismiss = (): void => {
    if (gone) return;
    gone = true;
    void play(el, [{ opacity: 1 }, { opacity: 0 }], {
      duration: DUR.fast,
      ui: true,
      fill: 'forwards',
    }).finished.then(() => el.remove());
  };
  const ms = o.duration ?? DUR.toast;
  if (ms > 0) setTimeout(dismiss, ms);
  return { dismiss };
}
