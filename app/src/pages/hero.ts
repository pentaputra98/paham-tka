/**
 * Animasi beranda (revisi pemilik 20 Okt 2026: bukan soal; menenangkan sekaligus memukau, agar siap belajar).
 * Pola biji bunga matahari (filotaksis): titik ke-n berada di sudut n × 137,5° dan jarak √n dari pusat.
 * Titik tumbuh satu per satu dari tengah, lalu seluruh pola berputar dan "bernapas" sangat pelan.
 * Hanya transform/opacity; hemat gerak → pola utuh statis. Berhenti saat beranda ditinggalkan.
 */
import { reducedMotion } from '../core/clock';
import { play } from '../core/motion';
import { EASE_OUT } from '../core/tokens';

const N = 340;
const GOLDEN = Math.PI * (3 - Math.sqrt(5)); // ≈ 137,5°
const R = 46; // jari-jari pola dalam satuan viewBox (100 × 100)
/** jeda tumbuh antartitik (ms) dan lama tumbuh tiap titik */
const STEP_MS = 14;
const GROW_MS = 900;

/** Markup SVG pola (dipakai juga sebagai keadaan akhir statis). */
export function heroArt(): string {
  const dots: string[] = [];
  for (let n = 1; n <= N; n++) {
    const r = R * Math.sqrt(n / N);
    const a = n * GOLDEN;
    const x = 50 + r * Math.cos(a);
    const y = 50 + r * Math.sin(a);
    // ukuran tumbuh pelan ke tepi; tiga nada biru bergantian mengikuti spiral Fibonacci (21 lengan)
    const size = 0.55 + 1.15 * Math.sqrt(n / N);
    const tone = n % 21 === 0 ? 'h-a' : n % 34 === 0 ? 'h-b' : n % 3 === 0 ? 'h-c' : 'h-d';
    dots.push(
      `<circle class="hd ${tone}" style="--n:${n}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size.toFixed(2)}"/>`,
    );
  }
  return `<svg class="hero-art" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <g class="ha-spin"><g class="ha-breath">${dots.join('')}</g></g>
    <circle class="ha-core" cx="50" cy="50" r="2.2"/>
  </svg>`;
}

/** Mulai animasi tumbuh; mengembalikan fungsi penghenti. */
export function startHero(stage: HTMLElement): () => void {
  stage.classList.add('is-live');
  if (reducedMotion()) {
    stage.classList.add('is-still');
    return () => undefined;
  }
  const dots = [...stage.querySelectorAll<SVGCircleElement>('.hd')];
  const ctl = dots.map((d, i) =>
    play(
      d,
      [
        { opacity: 0, transform: 'scale(0)' },
        { opacity: 1, transform: 'scale(1.6)', offset: 0.6 },
        { opacity: 1, transform: 'none' },
      ],
      { duration: GROW_MS, easing: EASE_OUT, delay: i * STEP_MS, fill: 'backwards', ui: true },
    ),
  );
  return () => ctl.forEach((k) => k.cancel());
}
