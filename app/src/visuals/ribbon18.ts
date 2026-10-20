/**
 * Padanan 2D adegan 3D soal 18 (PRD §9.6 aturan 1, "diagram pita"): urutan, label, dan warna
 * sama dengan 3D sehingga Mode ringan tidak kehilangan informasi. 1 satuan = 1 cm, skala 1 px = 1 cm.
 */
import type { Stage } from './door3d-scene';

const R = 40;
const RING = 251.2;
const SIDE = 56.57;
const DIAM = 80;
const TOTAL = RING + 4 * SIDE + 2 * DIAM; // ≈ 637,5 cm

const ornament = (): string => {
  const c = 150;
  const s = 2.6; // skala gambar ornamen
  const r = R * s;
  const P = [
    [c, c - r],
    [c + r, c],
    [c, c + r],
    [c - r, c],
  ];
  const sq = P.map((p) => p.join(',')).join(' ');
  return `<g class="rb-orn">
    <circle cx="${c}" cy="${c}" r="${r}" class="rb-red"/>
    <polygon points="${sq}" class="rb-sq"/>
    <path d="M${c} ${c} L${P[0]!.join(' ')} L${P[1]!.join(' ')} Z" class="rb-yellow"/>
    <path d="M${c} ${c} L${P[1]!.join(' ')} L${P[2]!.join(' ')} Z" class="rb-green"/>
    <path d="M${c} ${c} L${P[2]!.join(' ')} L${P[3]!.join(' ')} Z" class="rb-yellow"/>
    <path d="M${c} ${c} L${P[3]!.join(' ')} L${P[0]!.join(' ')} Z" class="rb-green"/>
    <circle cx="${c}" cy="${c}" r="${r}" class="rb-ring"/>
    <polygon points="${sq}" class="rb-side"/>
    <line x1="${c - r}" y1="${c}" x2="${c + r}" y2="${c}" class="rb-diam"/>
    <line x1="${c}" y1="${c - r}" x2="${c}" y2="${c + r}" class="rb-diam"/>
    <line x1="${c - r}" y1="${c + 14}" x2="${c}" y2="${c + 14}" class="rb-rline"/>
    <text x="${c + r * 0.62}" y="${c - r * 0.78}" class="rb-t rb-on-red"><tspan data-src="l3-merah">456</tspan> cm²</text>
    <text x="${c - r / 2}" y="${c + 32}" class="rb-t rb-r">r = <tspan data-src="l3-r">40</tspan> cm</text>
  </g>`;
};

function bars(stage: Stage): string {
  const sx = 0.62; // px per cm untuk pita
  const x0 = 20;
  const line = stage === 'ruler' || stage === 'match';
  const parts: string[] = [];
  const bar = (x: number, y: number, len: number, cls: string): string =>
    `<rect x="${x}" y="${y}" width="${Math.max(1, len * sx)}" height="14" rx="3" class="${cls}"/>`;
  if (!line) {
    parts.push(
      bar(x0, 40, RING, 'rb-b-ring'),
      `<text x="${x0}" y="32" class="rb-t">lingkaran <tspan data-src="l3-ring">251,2</tspan> cm</text>`,
    );
    for (let i = 0; i < 4; i++) parts.push(bar(x0 + i * SIDE * sx, 100, SIDE - 1.5, 'rb-b-side'));
    parts.push(
      `<text x="${x0}" y="92" class="rb-t">4 sisi × <tspan data-src="l3-side">56,57</tspan> cm</text>`,
    );
    for (let i = 0; i < 2; i++) parts.push(bar(x0 + i * DIAM * sx, 160, DIAM - 1.5, 'rb-b-diam'));
    parts.push(
      `<text x="${x0}" y="152" class="rb-t">2 diameter × <tspan data-src="l3-diam">80</tspan> cm</text>`,
    );
  } else {
    let x = x0;
    parts.push(bar(x, 40, RING, 'rb-b-ring'));
    x += RING * sx;
    for (let i = 0; i < 4; i++, x += SIDE * sx) parts.push(bar(x, 40, SIDE - 1.5, 'rb-b-side'));
    for (let i = 0; i < 2; i++, x += DIAM * sx) parts.push(bar(x, 40, DIAM - 1.5, 'rb-b-diam'));
    // penggaris 0–7 m
    parts.push(`<line x1="${x0}" y1="64" x2="${x0 + 700 * sx}" y2="64" class="rb-ruler"/>`);
    for (let m = 0; m <= 7; m++)
      parts.push(
        `<line x1="${x0 + m * 100 * sx}" y1="58" x2="${x0 + m * 100 * sx}" y2="70" class="rb-ruler"/><text x="${x0 + m * 100 * sx}" y="84" class="rb-t rb-mid">${m} m</text>`,
      );
    parts.push(
      `<text x="${x0 + TOTAL * sx}" y="30" class="rb-t rb-mid rb-strong">≈ <tspan data-src="l3-total">637,5</tspan> cm</text>`,
    );
    if (stage === 'match') {
      const row = (y: number, have: number, label: string, verdict: string, cls: string): void => {
        parts.push(bar(x0, y, Math.min(have, TOTAL), 'rb-metal'));
        if (have >= TOTAL) parts.push(bar(x0 + TOTAL * sx, y, have - TOTAL, cls));
        else parts.push(bar(x0 + have * sx, y, TOTAL - have, 'rb-lack'));
        parts.push(
          `<text x="${x0}" y="${y - 6}" class="rb-t">${label} · <tspan class="rb-strong ${cls}-t">${verdict}</tspan></text>`,
        );
      };
      row(120, 800, '2 logam A = 8 m · sisa 1,63 m (lebih dari 1 m)', 'Tidak Pas', 'rb-over');
      row(170, 500, '1 logam B = 5 m · kurang 1,37 m', 'Tidak Pas', 'rb-over');
      row(220, 650, '1 logam C = 6,5 m · sisa 0,13 m', 'Pas', 'rb-pas');
    }
  }
  return `<g class="rb-bars">${parts.join('')}</g>`;
}

export function createRibbon(): { el: HTMLElement; set: (s: Stage) => void; sketch: () => string } {
  const el = document.createElement('div');
  el.className = 'ribbon18';
  el.setAttribute('role', 'img');
  let stage: Stage = 'door';
  const render = (): void => {
    const early = stage === 'door' || stage === 'ornament' || stage === 'unglass' || stage === 'radius';
    el.setAttribute(
      'aria-label',
      early
        ? 'Ornamen: lingkaran berjari-jari 40 cm, persegi di dalamnya, dua diameter; satu kaca merah 456 cm persegi.'
        : stage === 'match'
          ? 'Kerangka 637,5 cm dibandingkan dengan logam: 2 A tidak pas, B tidak pas, C pas.'
          : 'Kerangka terurai: lingkaran 251,2 cm, empat sisi 56,57 cm, dua diameter 80 cm; total sekitar 637,5 cm.',
    );
    el.innerHTML = `<svg viewBox="0 0 ${early ? '300 300' : '460 250'}" class="${stage === 'unglass' || stage === 'radius' ? 'no-glass' : ''}">${early ? ornament() : bars(stage)}</svg>`;
  };
  render();
  return {
    el,
    set(s) {
      if (s !== stage) {
        stage = s;
        render();
      }
    },
    // sketsa catatan tanpa sumber terbang (hanya panggung yang menjadi sumber)
    sketch: () =>
      `<svg viewBox="0 0 460 250" class="n-sketch ribbon18">${bars('match').replace(/ data-src="[^"]*"/g, '')}</svg>`,
  };
}
