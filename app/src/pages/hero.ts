/**
 * Animasi beranda (revisi pemilik 21 Okt 2026, PRD v1.5): string art, bukan soal.
 * Tiga karya bergantian: kapal layar, kardioid (garis dari paku n ke paku 2n), dan bintang empat sumbu.
 * Setiap lengkung tersusun dari garis lurus saja (lengkung "selubung"); benang ditarik satu per satu
 * dari paku awal ke paku akhir (scale dari titik awal), ditahan sebentar, lalu berganti karya.
 * Hanya transform/opacity; hemat gerak → kapal utuh statis. Berhenti saat beranda ditinggalkan.
 */
import { reducedMotion } from '../core/clock';
import { play, type Kendali } from '../core/motion';
import { DUR, EASE_OUT } from '../core/tokens';

type P = [number, number];
/** benang: dari, ke, nada warna */
type Thread = [P, P, 'a' | 'b' | 'c'];
interface Art {
  caption: string;
  threads: Thread[];
  nails: P[];
}

/** jeda antarbenang (ms), lama tarik tiap benang, dan lama karya utuh ditahan */
const STEP_MS = 16;
const PULL_MS = 650;
const HOLD_MS = 6500;

const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/**
 * Selubung pada sudut: lengan pertama dari `a` ke titik sudut `v`, lengan kedua dari `v` ke `b`;
 * titik ke-i lengan pertama disambung ke titik ke-i lengan kedua (n + 1 benang) → lengkung parabola.
 */
function envelope(a: P, v: P, b: P, n: number, tone: Thread[2], out: Art): void {
  for (let i = 0; i <= n; i++) {
    const p = lerp(a, v, i / n);
    const q = lerp(v, b, i / n);
    out.threads.push([p, q, tone]);
    out.nails.push(p, q);
  }
}

function ship(): Art {
  const art: Art = {
    caption: 'Kapal layar · setiap lengkung tersusun dari garis lurus',
    threads: [],
    nails: [],
  };
  // layar utama (kanan tiang) dan layar depan (kiri tiang)
  envelope([50, 10], [50, 62], [82, 62], 20, 'a', art);
  envelope([47, 16], [47, 62], [21, 62], 16, 'b', art);
  // lambung: anyaman belah ketupat antara geladak (lurus) dan lunas (melengkung ke bawah)
  const n = 18;
  const deck = (i: number): P => lerp([12, 66], [88, 66], i / n);
  const keel = (i: number): P => {
    const [x, y] = lerp([25, 79], [75, 79], i / n);
    return [x, y + 4 * Math.sin((Math.PI * i) / n)];
  };
  for (let i = 0; i <= n; i++) {
    if (i + 3 <= n) art.threads.push([deck(i), keel(i + 3), 'b']);
    if (i - 3 >= 0) art.threads.push([deck(i), keel(i - 3), 'c']);
    art.nails.push(deck(i), keel(i));
  }
  art.threads.push([deck(0), keel(0), 'b'], [deck(n), keel(n), 'b']);
  // ombak: lengkung-lengkung kecil berjajar
  for (let w = 0; w < 7; w++) {
    const x = 9 + w * 12;
    envelope([x, 89], [x + 6, 84], [x + 12, 89], 5, 'c', art);
  }
  // matahari: 24 paku melingkar, tiap paku disambung ke paku ke-9 berikutnya
  const N = 24;
  const sun = (i: number): P => [
    80 + 8 * Math.cos((2 * Math.PI * i) / N),
    22 + 8 * Math.sin((2 * Math.PI * i) / N),
  ];
  for (let i = 0; i < N; i++) {
    art.threads.push([sun(i), sun(i + 9), 'a']);
    art.nails.push(sun(i));
  }
  return art;
}

function cardioid(): Art {
  const art: Art = {
    caption: 'Kardioid · paku ke-n disambung ke paku ke-2n pada 120 paku',
    threads: [],
    nails: [],
  };
  const N = 120;
  const at = (i: number): P => [
    50 + 42 * Math.cos((2 * Math.PI * i) / N + Math.PI),
    50 + 42 * Math.sin((2 * Math.PI * i) / N + Math.PI),
  ];
  for (let i = 1; i < N; i++) {
    art.threads.push([at(i), at(2 * i), i % 3 === 0 ? 'b' : i % 3 === 1 ? 'a' : 'c']);
    art.nails.push(at(i));
  }
  return art;
}

function star(): Art {
  const art: Art = { caption: 'Bintang · lengkung selubung pada empat sumbu', threads: [], nails: [] };
  const R = 42;
  const n = 16;
  // dua pasang sumbu: tegak–mendatar, lalu diagonal (diputar 45°) dengan nada lain
  for (const [rot, tone] of [
    [0, 'a'],
    [Math.PI / 4, 'c'],
  ] as const) {
    const ax = (k: number, r: number): P => [
      50 + r * Math.cos(rot + (k * Math.PI) / 2),
      50 + r * Math.sin(rot + (k * Math.PI) / 2),
    ];
    for (let k = 0; k < 4; k++)
      for (let i = 0; i <= n; i++) {
        const p = ax(k, (R * (n - i)) / n);
        const q = ax(k + 1, (R * i) / n);
        art.threads.push([p, q, k % 2 ? 'b' : tone]);
        art.nails.push(p, q);
      }
  }
  return art;
}

const ARTS: Art[] = [ship(), cardioid(), star()];

const f = (x: number): string => x.toFixed(2);

/** Markup SVG ketiga karya (karya pertama tampil sebagai keadaan awal/statis). */
export function heroArt(): string {
  const groups = ARTS.map((a, gi) => {
    const lines = a.threads
      .map(
        ([p, q, t]) =>
          `<line class="sa-l t-${t}" x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(q[0])}" y2="${f(q[1])}" style="transform-origin:${f(p[0])}px ${f(p[1])}px"/>`,
      )
      .join('');
    const seen = new Set<string>();
    const nails = a.nails
      .filter((p) => {
        const k = `${f(p[0])},${f(p[1])}`;
        return !seen.has(k) && !!seen.add(k);
      })
      .map((p) => `<circle class="sa-n" cx="${f(p[0])}" cy="${f(p[1])}" r="0.55"/>`)
      .join('');
    return `<g class="sa-shape${gi === 0 ? ' on' : ''}" data-art="${gi}">${nails}${lines}</g>`;
  });
  return `<svg class="hero-art" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <g class="ha-breath">${groups.join('')}</g>
  </svg>`;
}

/** Keterangan karya pertama (dipakai beranda sebagai teks awal). */
export const HERO_CAPTION = ARTS[0]!.caption;

/** Mulai siklus karya; mengembalikan fungsi penghenti. */
export function startHero(stage: HTMLElement): () => void {
  stage.classList.add('is-live');
  if (reducedMotion()) {
    stage.classList.add('is-still');
    return () => undefined;
  }
  const shapes = [...stage.querySelectorAll<SVGGElement>('.sa-shape')];
  const cap = stage.querySelector<HTMLElement>('.ha-cap');
  let live: Kendali[] = [];
  let timer = 0;
  let cur = 0;

  const draw = (gi: number): void => {
    shapes.forEach((g, i) => g.classList.toggle('on', i === gi));
    if (cap) cap.textContent = ARTS[gi]!.caption;
    const g = shapes[gi]!;
    const lines = [...g.querySelectorAll<SVGLineElement>('.sa-l')];
    live = [
      play(g, [{ opacity: 0 }, { opacity: 1 }], { duration: DUR.slow, ui: true }),
      ...lines.map((l, i) =>
        play(
          l,
          [
            { opacity: 0, transform: 'scale(0)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: PULL_MS,
            easing: EASE_OUT,
            delay: i * STEP_MS,
            fill: 'backwards',
            ui: true,
          },
        ),
      ),
    ];
    timer = window.setTimeout(fadeOut, lines.length * STEP_MS + PULL_MS + HOLD_MS);
  };

  const fadeOut = (): void => {
    const g = shapes[cur]!;
    const k = play(g, [{ opacity: 1 }, { opacity: 0 }], { duration: DUR.enter, ui: true, fill: 'forwards' });
    live = [k];
    void k.finished.then((ok) => {
      // dibatalkan (beranda ditinggalkan): siklus berhenti
      if (!ok || !stage.isConnected) return;
      k.cancel();
      cur = (cur + 1) % shapes.length;
      draw(cur);
    });
  };

  draw(0);
  return () => {
    window.clearTimeout(timer);
    live.forEach((k) => k.cancel());
  };
}
