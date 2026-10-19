/** Diagnostik lokal (PRD §14.8): ring buffer 50 galat; laporan tanpa data pribadi. */
const MAX = 50;
const ring: Array<{ t: string; msg: string }> = [];

export function logError(msg: string): void {
  ring.push({ t: new Date().toISOString(), msg: msg.slice(0, 400) });
  if (ring.length > MAX) ring.shift();
}

export function report(extra: Record<string, string> = {}): string {
  const lines = [
    `Paham TKA v${__APP_VERSION__}`,
    `Waktu: ${new Date().toISOString()}`,
    `Peramban: ${navigator.userAgent}`,
    `Layar: ${innerWidth}×${innerHeight} @${devicePixelRatio}x, ${matchMedia('(orientation: portrait)').matches ? 'potret' : 'mendatar'}`,
    `Mode: ${matchMedia('(display-mode: standalone)').matches ? 'terpasang' : 'peramban'}`,
    ...Object.entries(extra).map(([k, v]) => `${k}: ${v}`),
    `Galat terakhir (${ring.length}):`,
    ...ring.slice(-10).map((e) => `  ${e.t} ${e.msg}`),
  ];
  return lines.join('\n');
}

export const errorCount = (): number => ring.length;
