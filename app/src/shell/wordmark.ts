/**
 * Penanda kata "PAHAM TKA" (PRD §13.8): Archivo lebar 125 berat 900, biru tua, dengan garis aksen
 * yang tergambar dari kusut menjadi lurus saat muat pertama (bingung → paham). Statis selanjutnya.
 * Gerak hanya clip-path dan opacity.
 */
let played = false;

export function wordmark(): string {
  const anim = played ? '' : ' wm--intro';
  played = true;
  return `<svg class="wordmark${anim}" viewBox="0 0 232 40" role="img" aria-label="Paham TKA">
    <text x="0" y="27" textLength="230" lengthAdjust="spacingAndGlyphs" class="wm-text" font-size="30">PAHAM TKA</text>
    <path class="wm-kusut" d="M2 35 C 2 29, 14 28, 13 33 C 12 38, 5 38, 6 34 C 7 30, 15 31, 18 35 L 230 35" />
    <path class="wm-lurus" d="M2 35 L 230 35" />
  </svg>`;
}
