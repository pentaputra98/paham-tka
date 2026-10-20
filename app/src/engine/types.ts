/**
 * Skema data konten pembahasan (PRD §10), turunan dari kunci data template
 * (T, O, H, F, PIN, L*, CH, STEPS, CARDS, B.ask). Ditulis TypeScript agar kesalahan
 * data tertangkap saat kompilasi; aturan isi diperiksa `verify:content` (engine/validate.ts).
 */
import type { SoalMeta } from '../content';

// ---- token papan tulis ----
export type Cls = 'red' | 'blue' | 'gold' | 'u' | 'muted' | 'lbl' | 'sp' | 'op' | 'tx';
/** Token: t = LaTeX, h = HTML teks pendek; src = sumber terbang ('@nama' atau id token lain). */
export interface Tok {
  k: string;
  t?: string;
  h?: string;
  c?: Cls;
  src?: string;
}
export interface Frac {
  frac: [Array<Tok | Frac>, Array<Tok | Frac>];
}
export type Piece = Tok | Frac;

export const isFrac = (p: Piece): p is Frac => 'frac' in p;
export interface Row {
  id: string;
  toks: Piece[];
  note?: string;
  box?: 'navy' | 'gold';
}
export interface Pin {
  id: string;
  toks: Tok[];
  gold?: boolean;
}

// ---- pertanyaan cepat ----
export interface AskOpt {
  tex?: string;
  txt?: string;
  ok?: boolean;
  /** wajib untuk ok=false */
  hint?: string;
}
export interface Ask {
  q: string;
  opts: AskOpt[];
  /** teks setelah benar */
  win?: string;
  letters?: boolean;
  col?: boolean;
  /** id baris jawaban: pertanyaan muncul sebelum baris ini ditulis, hanya bila belum ada di papan */
  before: string;
}

// ---- kartu analisis ----
export interface Card {
  /** '(1)' atau 'A' */
  label: string;
  statement: string;
  ok: boolean;
  /** rumus singkat (LaTeX) */
  formula: string;
  why: string;
}

// ---- visual ----
export type Visual =
  | { kind: 'soal'; hl?: number; focus?: string }
  | { kind: 'svg'; scene: string; state: Record<string, unknown> }
  | { kind: 'cards'; flip: number }
  | { kind: 'notes' }
  | { kind: 'done' };

// ---- langkah ----
export interface BoardSpec {
  title: string;
  pins?: string[];
  list: string;
  /** tampilkan baris 0..upTo-1 */
  upTo: number;
  /** animasikan mulai indeks ini (bila datang berurutan, semua yang belum tampil dianimasikan) */
  from: number;
}
export interface Step {
  ch: number;
  /** pop-up ≤ 2 kalimat, boleh $LaTeX$ dan <b> */
  cap: string;
  visual: Visual;
  board?: BoardSpec;
  ask?: Ask;
  /** konten opsional (mis. tabel nilai) yang ditawarkan Ya/Tidak */
  optional?: { label: string; yes: string; panel: string };
}

export interface Fact {
  dt: string;
  dd: string;
}

export interface NotesSection {
  title: string;
  /** daftar papan yang dirangkum sebagai blok aligned */
  lists: string[];
  why?: string;
  /** SVG sketsa (nama adegan visual) */
  sketch?: string;
}

/** Label stempel kartu: BENAR/SALAH, atau label soal dua kolom (mis. PAS/TIDAK PAS). */
export function verdictLabels(meta: SoalMeta): [string, string] {
  return meta.response === 'truefalse' && meta.labels
    ? [meta.labels[0].toUpperCase(), meta.labels[1].toUpperCase()]
    : ['BENAR', 'SALAH'];
}

export interface SoalContent {
  meta: SoalMeta;
  /** HTML kertas soal; rumus $…$, stabilo lewat \htmlClass/\htmlData (KaTeX trust terbatas) */
  paper: { html: string; srcNames: string[] };
  lobby: { eyebrow: string; titleLines: [string, string, string]; lede: string; facts: [Fact, Fact, Fact] };
  chapters: Array<{ t: string; d: string }>;
  pins: Record<string, Pin>;
  lists: Record<string, Row[]>;
  steps: Step[];
  cards: Card[];
  notes: { title: string; meta: string; sections: NotesSection[]; answer: string };
  done: { seal: string; message: string };
  key: {
    /** jawaban resmi (docs/pembahasan25.md) */
    answer: string;
    /** benar/salah per kartu, urut kartu */
    cardOk: boolean[];
    /** id baris berkotak emas yang memang hasil akhir/jawaban */
    goldRows: string[];
  };
  /** nama sumber terbang yang disediakan visual (label SVG/3D) */
  visualSrc?: string[];
  sourceRef: string;
  /** catatan penulis: baris yang ditambahkan dan dilaporkan (bukan dari docs) */
  authorNotes?: string[];
}
