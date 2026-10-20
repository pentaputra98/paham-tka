/** Pembuat token papan (template: T, O, H, F). */
import type { Cls, Frac, Piece, Tok } from './types';

/** Token KaTeX. */
export const T = (k: string, t: string, c?: Cls | '', src?: string): Tok => ({
  k,
  t,
  ...(c ? { c } : {}),
  ...(src ? { src } : {}),
});
/** Operator (=, +, −, ×, ·) dengan jarak lebih lebar. */
export const O = (k: string, t: string): Tok => ({ k, t, c: 'op' });
/** Token HTML teks pendek. */
export const H = (k: string, h: string, c?: Cls | '', src?: string): Tok => ({
  k,
  h,
  ...(c ? { c } : {}),
  ...(src ? { src } : {}),
});
/** Pecahan: pembilang dan penyebut berupa daftar token. */
export const F = (n: Piece[], d: Piece[]): Frac => ({ frac: [n, d] });
