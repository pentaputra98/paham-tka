/**
 * Lab uji kelayakan gerak (PRD §13.5a, M1 tugas 1.2) — khusus pengembangan, tidak dibundel ke dist.
 * Prototipe: penerbangan token (lengkung, sumber → slot) dan transisi lembar.
 * Diakses Playwright lewat window.lab untuk mengukur 6 kriteria pada backend 'motion' dan 'waapi'.
 */
import '../styles/index.css';
import { setPaused } from '../core/clock';
import { activeCount, completeAll, getBackend, play, setBackend, type Backend } from '../core/motion';
import { store } from '../core/store';
import { DUR, EASE } from '../core/tokens';

const root = document.getElementById('lab')!;
root.innerHTML = `<div class="lab-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:24px;height:100vh">
  <div data-src-col style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;align-content:start"></div>
  <div data-dst-col style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;align-content:end"></div>
</div>`;
const srcCol = root.querySelector<HTMLElement>('[data-src-col]')!;
const dstCol = root.querySelector<HTMLElement>('[data-dst-col]')!;
const N = 24;
for (let i = 0; i < N; i++) {
  srcCol.insertAdjacentHTML('beforeend', `<span class="pill" data-s="${i}">${i + 1}</span>`);
  dstCol.insertAdjacentHTML(
    'beforeend',
    `<span class="pill" data-d="${i}" style="visibility:hidden">${i + 1}</span>`,
  );
}

/** Penerbangan token persis seperti template B.fly: klon di slot tujuan, mulai dari sumber, lengkung. */
function fly(i: number, duration: number = DUR.flyMax): Promise<boolean> {
  const s = srcCol.querySelector<HTMLElement>(`[data-s="${i}"]`)!;
  const d = dstCol.querySelector<HTMLElement>(`[data-d="${i}"]`)!;
  const a = s.getBoundingClientRect();
  const b = d.getBoundingClientRect();
  const g = d.cloneNode(true) as HTMLElement;
  g.className = 'fly-tok pill';
  g.dataset.fly = String(i);
  Object.assign(g.style, {
    visibility: 'visible',
    left: `${b.left}px`,
    top: `${b.top}px`,
    width: `${b.width}px`,
    height: `${b.height}px`,
  });
  document.body.append(g);
  const dx = a.left - b.left;
  const dy = a.top - b.top;
  const arc = Math.min(80, Math.hypot(dx, dy) * 0.22);
  const k = play(
    g,
    [
      { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 0.85 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - arc}px) scale(1.1)`, opacity: 1, offset: 0.5 },
      { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
    ],
    { duration, easing: EASE, tag: 'fly' },
  );
  return k.finished.then((ok) => {
    g.remove();
    d.style.visibility = 'visible';
    return ok;
  });
}

function reset(): void {
  completeAll();
  document.querySelectorAll('[data-fly]').forEach((e) => e.remove());
  dstCol.querySelectorAll<HTMLElement>('[data-d]').forEach((e) => (e.style.visibility = 'hidden'));
}

/** Transisi lembar (prototipe kedua). */
function sheet(): Promise<boolean> {
  const el = document.createElement('div');
  el.className = 'panel';
  Object.assign(el.style, { position: 'fixed', left: '30%', top: '30%', width: '40%' });
  el.textContent = 'Lembar uji';
  document.body.append(el);
  return play(
    el,
    [
      { opacity: 0, transform: 'translateY(12px) scale(.98)' },
      { opacity: 1, transform: 'none' },
    ],
    {
      duration: DUR.base,
      ui: true,
    },
  ).finished.then((ok) => {
    el.remove();
    return ok;
  });
}

(window as unknown as { lab: unknown }).lab = {
  N,
  setBackend: (b: Backend) => setBackend(b),
  backend: () => getBackend(),
  setSpeed: (s: 0.75 | 1 | 1.5) => store.updateSettings({ speed: s }),
  setMotion: (m: 'system' | 'reduce' | 'full') => store.updateSettings({ motion: m }),
  setPaused,
  fly,
  flyAll: (duration?: number) => Promise.all(Array.from({ length: N }, (_, i) => fly(i, duration))),
  /** urutan penyelesaian beberapa penerbangan berurutan (kriteria 5) */
  flySequence: async (n: number) => {
    const order: number[] = [];
    for (let i = 0; i < n; i++) {
      await fly(i);
      order.push(i);
    }
    return order;
  },
  sheet,
  completeAll: () => completeAll(),
  activeCount: () => activeCount(),
  flyingLeft: () => document.querySelectorAll('[data-fly]').length,
  hiddenTargets: () => dstCol.querySelectorAll('[data-d][style*="hidden"]').length,
  reset,
  /** posisi pusat token terbang i (px) */
  pos: (i: number) => {
    const g = document.querySelector<HTMLElement>(`[data-fly="${i}"]`);
    if (!g) return null;
    const r = g.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  },
};
