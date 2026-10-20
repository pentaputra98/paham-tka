/**
 * Tanda khas beranda: siklus "angka terbang" ±6 s (PRD §6.2, FR-HOME-5).
 * Angka dari kertas soal 25 terbang ke papan mini, satu baris satu langkah, berakhir di kotak emas.
 * Berhenti otomatis saat tab tersembunyi (jam global berhenti) dan saat beranda ditinggalkan;
 * hemat gerak → keadaan akhir statis (markup awal tidak diubah).
 * Isi dari docs/pembahasan25.md soal 25 (a2, e1, e2, e3).
 */
import { reducedMotion, sleep } from '../core/clock';
import { tex } from '../core/math';
import { play } from '../core/motion';
import { DUR, EASE, EASE_OUT } from '../core/tokens';

interface HTok {
  k: string;
  t: string;
  /** sumber: 'p:<nama>' = bagian kertas soal, 'b:<k>' = token papan sebelumnya */
  src?: string;
  op?: boolean;
}
interface HRow {
  toks: HTok[];
  note?: string;
  gold?: boolean;
}

const ROWS: HRow[] = [
  {
    toks: [
      { k: 'a', t: '6x-18', src: 'p:pem' },
      { k: 'b', t: '=', op: true },
      { k: 'c', t: '6u' },
    ],
    note: '$u=x-3$',
  },
  {
    toks: [
      { k: 'd', t: '\\lim_{u\\to0}\\tfrac{\\tan 3u}{u}' },
      { k: 'e', t: '=', op: true },
      { k: 'f', t: '3' },
    ],
  },
  {
    toks: [
      { k: 'g', t: '\\lim_{x\\to3}\\tfrac{x}{x+3}', src: 'p:x3' },
      { k: 'h', t: '=', op: true },
      { k: 'i', t: '\\tfrac12' },
    ],
  },
  {
    toks: [
      { k: 'j', t: '3', src: 'b:f' },
      { k: 'l', t: '\\cdot', op: true },
      { k: 'm', t: '\\tfrac12', src: 'b:i' },
      { k: 'n', t: '=', op: true },
      { k: 'o', t: '\\tfrac32' },
    ],
    note: 'jawaban E',
    gold: true,
  },
];

const mt = (s: string): string => s.replace(/\$([^$]+)\$/g, (_m, x: string) => tex(x));

function visible(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return (
    r.width > 0 &&
    r.height > 0 &&
    getComputedStyle(el).visibility !== 'hidden' &&
    (el as HTMLElement).offsetParent !== null
  );
}

/** Mulai siklus; mengembalikan fungsi berhenti. */
export function startHero(stage: HTMLElement): () => void {
  const board = stage.querySelector<HTMLElement>('.fly-board');
  const paper = stage.querySelector<HTMLElement>('.fly-paper');
  if (!board || !paper || reducedMotion()) return () => undefined;
  let alive = true;
  const live = (): boolean => alive && stage.isConnected;

  const fly = async (from: Element, to: HTMLElement): Promise<void> => {
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    const g = to.cloneNode(true) as HTMLElement;
    g.classList.add('fly-tok');
    Object.assign(g.style, {
      left: `${b.left}px`,
      top: `${b.top}px`,
      width: `${b.width}px`,
      height: `${b.height}px`,
      margin: '0',
    });
    document.body.append(g);
    const dx = a.left + a.width / 2 - (b.left + b.width / 2);
    const dy = a.top + a.height / 2 - (b.top + b.height / 2);
    const arc = Math.min(70, Math.hypot(dx, dy) * 0.22);
    from.classList.add('src-glow');
    await play(
      g,
      [
        { transform: `translate(${dx}px, ${dy}px) scale(.9)`, opacity: 0.85 },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - arc}px) scale(1.08)`, opacity: 1, offset: 0.5 },
        { transform: 'none', opacity: 1 },
      ],
      {
        duration: Math.max(DUR.flyMin, Math.min(DUR.flyMax, Math.hypot(dx, dy) * 0.9)),
        easing: EASE,
        tag: 'hero',
      },
    ).finished;
    g.remove();
    from.classList.remove('src-glow');
    to.style.visibility = '';
  };

  const cycle = async (): Promise<void> => {
    while (live()) {
      board.querySelectorAll('.bl').forEach((r) => r.remove());
      for (let i = 0; i < ROWS.length && live(); i++) {
        const spec = ROWS[i]!;
        const row = document.createElement('div');
        row.className = 'bl';
        const m = document.createElement('span');
        m.className = 'bl-m';
        row.append(m);
        for (const t of spec.toks) {
          const s = document.createElement('span');
          s.className = `ht${t.op ? ' op' : ''}`;
          s.dataset.hk = t.k;
          s.innerHTML = tex(t.t);
          s.style.visibility = 'hidden';
          m.append(s);
        }
        if (spec.note) row.insertAdjacentHTML('beforeend', `<span class="note">${mt(spec.note)}</span>`);
        board.append(row);
        board.querySelectorAll('.bl').forEach((r, j, all) => r.classList.toggle('past', j < all.length - 1));
        for (const t of spec.toks) {
          if (!live()) return;
          const el = m.querySelector<HTMLElement>(`[data-hk="${t.k}"]`)!;
          const from = t.src?.startsWith('p:')
            ? paper.querySelector(`[data-h="${t.src.slice(2)}"]`)
            : t.src
              ? board.querySelector(`[data-hk="${t.src.slice(2)}"]`)
              : null;
          if (from && visible(from)) await fly(from, el);
          else {
            el.style.visibility = '';
            await play(
              el,
              [
                { clipPath: 'inset(0 100% 0 0)', opacity: 0.3 },
                { clipPath: 'inset(0 0 0 0)', opacity: 1 },
              ],
              {
                duration: DUR.chalk,
                easing: EASE_OUT,
                tag: 'hero',
              },
            ).finished;
          }
          if (!(await sleep(90))) return;
        }
        if (spec.gold) {
          m.classList.add('box-gold');
          play(m, [{ transform: 'scale(1.06)' }, { transform: 'none' }], {
            duration: DUR.enter,
            easing: EASE_OUT,
            tag: 'hero',
          });
        }
        if (!(await sleep(380))) return;
      }
      if (!(await sleep(2400)) || !live()) return;
      const rows = [...board.querySelectorAll<HTMLElement>('.bl')];
      await Promise.all(
        rows.map(
          (r) =>
            play(r, [{ opacity: 1 }, { opacity: 0 }], { duration: DUR.slow, tag: 'hero', fill: 'forwards' })
              .finished,
        ),
      );
      rows.forEach((r) => r.remove());
      if (!(await sleep(500))) return;
    }
  };
  void cycle();
  return () => {
    alive = false;
    document.querySelectorAll('.fly-tok').forEach((e) => e.remove());
  };
}
