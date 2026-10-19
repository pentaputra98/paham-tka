/**
 * Layar putar potret (FR-ORI-1, FR-ORI-4). Tampilan diatur CSS (@media orientation: portrait);
 * modul ini memberi teks sesuai perangkat, tombol layar penuh, dan sinyal jeda.
 */
import { enterFullscreenLandscape, canFullscreen } from '../core/fullscreen';
import { icon } from '../core/icons';

const mq = matchMedia('(orientation: portrait)');
const listeners = new Set<(portrait: boolean) => void>();

export const isPortrait = (): boolean => mq.matches;

export function onOrientation(f: (portrait: boolean) => void): () => void {
  listeners.add(f);
  return () => listeners.delete(f);
}

export function mountRotate(): void {
  const el = document.getElementById('rotate');
  if (!el) return;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const title = el.querySelector('h2');
  const text = el.querySelector('p');
  const btn = el.querySelector<HTMLButtonElement>('button');
  if (title) title.textContent = coarse ? 'Putar HP-mu ke posisi mendatar' : 'Lebarkan jendela peramban';
  if (text)
    text.textContent = coarse
      ? 'Paham TKA dirancang untuk layar mendatar supaya gambar dan papan tulis terlihat bersamaan.'
      : 'Paham TKA dirancang untuk layar mendatar. Buat jendela lebih lebar daripada tingginya.';
  if (btn) {
    btn.innerHTML = `${icon('maximize')}<span>Layar penuh &amp; mendatar</span>`;
    btn.hidden = !coarse || !canFullscreen();
    btn.addEventListener('click', () => void enterFullscreenLandscape());
  }
  const sync = (): void => {
    el.setAttribute('aria-hidden', String(!mq.matches));
    listeners.forEach((f) => f(mq.matches));
  };
  mq.addEventListener('change', sync);
  sync();
}
