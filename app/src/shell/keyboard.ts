/**
 * Papan ketik layar milik aplikasi (revisi pemilik v1.24, identitas tes penguasaan). Papan ketik bawaan HP
 * menutupi separuh layar mendatar, jadi kolom isian memakai inputmode="none" dan papan ini menggantikannya.
 * Papan ketik fisik (laptop) tetap bekerja langsung di kolom isian.
 *  - huruf besar otomatis di awal kata; Shift sekali = satu huruf besar, Shift dua kali = terkunci;
 *  - tahan Hapus untuk menghapus berulang;
 *  - baris atas menampilkan kolom yang sedang diisi (tetap terlihat walaupun papan menutupi formulir).
 */
import { esc, html } from '../core/dom';
import { icon } from '../core/icons';
import { play } from '../core/motion';
import { DUR, EASE_OUT, RISE_PX } from '../core/tokens';

export interface KbField {
  input: HTMLInputElement;
  label: string;
  /** selalu huruf kapital (kode) */
  caps?: boolean;
}

type Shift = 'off' | 'once' | 'lock';

const ROWS: string[][] = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', "'"],
  ['{shift}', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '{del}'],
  ['-', '.', '{space}', '{next}'],
];

export interface Keyboard {
  open(i: number): void;
  close(): void;
  readonly isOpen: boolean;
  destroy(): void;
}

/** Pasang papan ketik untuk kolom-kolom isian; onDone dipanggil saat "Selesai" di kolom terakhir. */
export function mountKeyboard(host: HTMLElement, fields: KbField[], onDone: () => void): Keyboard {
  let cur = -1;
  let shift: Shift = 'once';
  let lastShiftTap = 0;
  let repeat = 0;
  let repeatDelay = 0;

  const keyHtml = (k: string): string => {
    switch (k) {
      case '{shift}':
        return `<button type="button" class="kb-key kb-wide" data-k="shift" aria-label="Huruf besar" aria-pressed="false">${icon('arrow-big-up')}</button>`;
      case '{del}':
        return `<button type="button" class="kb-key kb-wide" data-k="del" aria-label="Hapus">${icon('delete')}</button>`;
      case '{space}':
        return `<button type="button" class="kb-key kb-space" data-k=" " aria-label="Spasi">spasi</button>`;
      case '{next}':
        return `<button type="button" class="kb-key kb-next" data-k="next"><span data-next-t>Lanjut</span>${icon('corner-down-left')}</button>`;
      default:
        return `<button type="button" class="kb-key" data-k="${esc(k)}">${esc(k)}</button>`;
    }
  };

  const el = html(`<div class="kb" role="group" aria-label="Papan ketik" hidden>
    <div class="kb-top">
      <span class="kb-lbl" data-kb-lbl></span>
      <span class="kb-val" aria-hidden="true"><span data-kb-val></span><span class="kb-caret"></span></span>
      <button type="button" class="btn kb-x" data-k="close" aria-label="Sembunyikan papan ketik">${icon('chevron-down')}<span>Sembunyikan</span></button>
    </div>
    <div class="kb-rows">${ROWS.map((r) => `<div class="kb-row">${r.map(keyHtml).join('')}</div>`).join('')}</div>
  </div>`);
  host.append(el);

  const field = (): KbField | undefined => fields[cur];

  const autoShift = (): void => {
    if (field()?.caps) {
      shift = 'lock';
      return;
    }
    if (shift === 'lock') return;
    const f = field();
    const v = f?.input.value ?? '';
    const caret = f?.input.selectionStart ?? v.length;
    const before = v.slice(0, caret);
    shift = before === '' || /\s$/.test(before) ? 'once' : 'off';
  };

  const render = (): void => {
    const f = field();
    if (!f) return;
    el.querySelector('[data-kb-lbl]')!.textContent = f.label;
    el.querySelector('[data-kb-val]')!.textContent = f.input.value;
    const upper = shift !== 'off';
    el.querySelectorAll<HTMLElement>('.kb-key[data-k]').forEach((b) => {
      const k = b.dataset.k!;
      if (k.length === 1 && /[a-z]/.test(k)) b.textContent = upper ? k.toUpperCase() : k;
    });
    const sb = el.querySelector<HTMLElement>('[data-k="shift"]')!;
    sb.setAttribute('aria-pressed', String(upper));
    sb.classList.toggle('is-lock', shift === 'lock');
    el.querySelector('[data-next-t]')!.textContent = cur < fields.length - 1 ? 'Lanjut' : 'Selesai';
  };

  const emit = (inp: HTMLInputElement): void => {
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  };

  function insert(ch: string): void {
    const f = field();
    if (!f) return;
    const inp = f.input;
    const v = inp.value;
    const max = inp.maxLength > 0 ? inp.maxLength : 60;
    if (v.length >= max) return;
    const a = inp.selectionStart ?? v.length;
    const b = inp.selectionEnd ?? v.length;
    // tidak ada spasi di awal atau spasi ganda
    if (ch === ' ' && (a === 0 || v[a - 1] === ' ')) return;
    const c = shift !== 'off' ? ch.toUpperCase() : ch;
    inp.value = v.slice(0, a) + c + v.slice(b);
    inp.setSelectionRange(a + 1, a + 1);
    if (shift === 'once' && /[a-z]/i.test(ch)) shift = 'off';
    emit(inp);
    autoShift();
    render();
  }

  function del(): void {
    const f = field();
    if (!f) return;
    const inp = f.input;
    const v = inp.value;
    let a = inp.selectionStart ?? v.length;
    const b = inp.selectionEnd ?? v.length;
    if (a === b) {
      if (a === 0) return;
      a -= 1;
    }
    inp.value = v.slice(0, a) + v.slice(b);
    inp.setSelectionRange(a, a);
    emit(inp);
    autoShift();
    render();
  }

  const stopRepeat = (): void => {
    window.clearTimeout(repeatDelay);
    window.clearInterval(repeat);
    repeat = 0;
    repeatDelay = 0;
  };

  // pointerdown dicegah: fokus tetap di kolom isian (caret tidak hilang); aksi dijalankan pada click
  el.addEventListener('pointerdown', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-k]');
    if (!b) return;
    e.preventDefault();
    if (b.dataset.k === 'del') {
      stopRepeat();
      repeatDelay = window.setTimeout(() => {
        repeat = window.setInterval(del, 70);
      }, 420);
    }
  });
  const end = (): void => stopRepeat();
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  el.addEventListener('pointerleave', end);

  el.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-k]');
    if (!b) return;
    const k = b.dataset.k!;
    if (k === 'close') return close();
    if (k === 'del') {
      // tahan berulang sudah menghapus; ketuk biasa menghapus satu
      if (!repeat) del();
      stopRepeat();
      return;
    }
    if (k === 'shift') {
      const now = performance.now();
      shift = shift === 'lock' ? 'off' : now - lastShiftTap < 400 ? 'lock' : shift === 'off' ? 'once' : 'off';
      lastShiftTap = now;
      render();
      return;
    }
    if (k === 'next') {
      if (cur < fields.length - 1) fields[cur + 1]!.input.focus();
      else {
        close();
        onDone();
      }
      return;
    }
    insert(k);
  });

  // ketukan di luar papan ketik dan kolomnya menyembunyikan papan ketik
  const onOutside = (e: PointerEvent): void => {
    if (el.hidden) return;
    const t = e.target as Node;
    if (el.contains(t) || fields.some((f) => f.input === t)) return;
    close();
  };
  document.addEventListener('pointerdown', onOutside, true);

  const onFocus = (i: number) => (): void => open(i);
  const onInput = (): void => render();
  const handlers = fields.map((f, i) => {
    const h = onFocus(i);
    f.input.setAttribute('inputmode', 'none');
    f.input.addEventListener('focus', h);
    f.input.addEventListener('input', onInput);
    // ketukan pada kolom yang sudah fokus (papan ketik sempat ditutup) membuka papan lagi
    f.input.addEventListener('click', h);
    return h;
  });

  function open(i: number): void {
    const wasOpen = !el.hidden;
    cur = i;
    autoShift();
    render();
    if (wasOpen) return;
    el.hidden = false;
    host.classList.add('kb-on');
    play(
      el,
      [
        { opacity: 0, transform: `translateY(${RISE_PX * 2}px)` },
        { opacity: 1, transform: 'none' },
      ],
      { duration: DUR.base, easing: EASE_OUT, ui: true },
    );
  }

  function close(): void {
    if (el.hidden) return;
    stopRepeat();
    el.hidden = true;
    host.classList.remove('kb-on');
  }

  return {
    open,
    close,
    get isOpen() {
      return !el.hidden;
    },
    destroy() {
      stopRepeat();
      document.removeEventListener('pointerdown', onOutside, true);
      fields.forEach((f, i) => {
        f.input.removeEventListener('focus', handlers[i]!);
        f.input.removeEventListener('click', handlers[i]!);
        f.input.removeEventListener('input', onInput);
      });
      el.remove();
    },
  };
}
