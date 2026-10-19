/**
 * Lembar/modal (PRD §13.6): scrim, fokus terperangkap, Esc menutup, tombol tutup terlihat,
 * fokus kembali ke pemicu. Gerak skala+pudar dari pemicu (masuk 220 ms, keluar ≈65 %).
 */
import { esc, html } from '../core/dom';
import { icon } from '../core/icons';
import { play } from '../core/motion';
import { DUR, EASE_IN, EASE_OUT, RISE_PX } from '../core/tokens';

export interface SheetAction {
  label: string;
  kind?: 'primary' | 'secondary' | 'gold' | 'danger';
  /** kembalikan false untuk menahan lembar tetap terbuka */
  onClick?: () => unknown;
  icon?: Parameters<typeof icon>[0];
}

export interface SheetOptions {
  title: string;
  /** HTML tepercaya (konten bundel) atau elemen */
  body: string | HTMLElement;
  actions?: SheetAction[];
  /** label tombol tutup default; null = tanpa tombol tutup di kaki */
  closeLabel?: string | null;
  onClose?: () => void;
}

let open: { close: () => void } | null = null;
let seq = 0;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function isSheetOpen(): boolean {
  return open !== null;
}

export function closeSheet(): void {
  open?.close();
}

export function openSheet(o: SheetOptions): { close: () => void; root: HTMLElement } {
  open?.close();
  const id = `sheet-${++seq}`;
  const opener = document.activeElement as HTMLElement | null;
  const root = html(`
    <div class="sheet" role="presentation">
      <div class="sheet-scrim" data-close></div>
      <section class="sheet-card" role="dialog" aria-modal="true" aria-labelledby="${id}-t" tabindex="-1">
        <header class="sheet-head">
          <h2 class="sheet-title" id="${id}-t">${esc(o.title)}</h2>
          <button class="icon-btn" type="button" data-close aria-label="Tutup">${icon('x')}</button>
        </header>
        <div class="sheet-body"></div>
        <footer class="sheet-actions"></footer>
      </section>
    </div>`);
  const card = root.querySelector<HTMLElement>('.sheet-card')!;
  const body = root.querySelector<HTMLElement>('.sheet-body')!;
  const foot = root.querySelector<HTMLElement>('.sheet-actions')!;
  if (typeof o.body === 'string') body.innerHTML = o.body;
  else body.append(o.body);

  const actions = [...(o.actions ?? [])];
  if (o.closeLabel !== null)
    actions.push({ label: o.closeLabel ?? 'Tutup', kind: actions.length ? 'secondary' : 'primary' });
  for (const a of actions) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `btn btn--${a.kind ?? 'secondary'}`;
    b.innerHTML = `${a.icon ? icon(a.icon) : ''}<span>${esc(a.label)}</span>`;
    b.addEventListener('click', async () => {
      const keep = a.onClick ? await a.onClick() : undefined;
      if (keep !== false) close();
    });
    foot.append(b);
  }
  if (!foot.childElementCount) foot.remove();

  const app = document.getElementById('app');
  app?.setAttribute('inert', '');
  document.body.append(root);

  play(root.querySelector('.sheet-scrim')!, [{ opacity: 0 }, { opacity: 1 }], {
    duration: DUR.base,
    ui: true,
  });
  play(
    card,
    [
      { opacity: 0, transform: `translateY(${RISE_PX}px) scale(.98)` },
      { opacity: 1, transform: 'none' },
    ],
    { duration: DUR.base, easing: EASE_OUT, ui: true },
  );

  const onKey = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      const items = [...card.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((x) => x.offsetParent !== null);
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  document.addEventListener('keydown', onKey, true);
  root.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', () => close()));

  let closed = false;
  function close(): void {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', onKey, true);
    if (open?.close === close) open = null;
    app?.removeAttribute('inert');
    const out = play(
      card,
      [{ opacity: 1 }, { opacity: 0, transform: `translateY(${RISE_PX / 2}px) scale(.98)` }],
      {
        duration: Math.round(DUR.base * 0.65),
        easing: EASE_IN,
        ui: true,
        fill: 'forwards',
      },
    );
    play(root.querySelector('.sheet-scrim')!, [{ opacity: 1 }, { opacity: 0 }], {
      duration: Math.round(DUR.base * 0.65),
      ui: true,
      fill: 'forwards',
    });
    void out.finished.then(() => root.remove());
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    o.onClose?.();
  }

  open = { close };
  requestAnimationFrame(() => {
    const target = card.querySelector<HTMLElement>('.sheet-actions .btn') ?? card;
    target.focus({ preventScroll: true });
  });
  return { close, root };
}
