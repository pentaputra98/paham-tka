/**
 * Tes penguasaan materi (revisi pemilik v1.24): 21 soal dari 7 materi TKA Matematika Tingkat Lanjut,
 * tingkatnya sedikit di bawah soal TKA 2025. Setiap percobaan memakai angka baru (benih acak).
 */
export type Materi = 'matriks' | 'polinom' | 'fungsi' | 'lingkaran' | 'transformasi' | 'vektor' | 'limit';

/** Urutan materi di tes dan di hasil (urutan dari pemilik). */
export const MATERI: readonly Materi[] = [
  'matriks',
  'polinom',
  'fungsi',
  'lingkaran',
  'transformasi',
  'vektor',
  'limit',
];

export const MATERI_LABEL: Record<Materi, string> = {
  matriks: 'Matriks',
  polinom: 'Polinomial',
  fungsi: 'Fungsi',
  lingkaran: 'Lingkaran',
  transformasi: 'Transformasi geometri',
  vektor: 'Vektor',
  limit: 'Limit',
};

/** Soal TKA 2025 yang menguji materi yang sama (untuk saran belajar di hasil tes). */
export const MATERI_SOAL: Record<Materi, readonly number[]> = {
  matriks: [1, 2, 3, 4],
  polinom: [5, 6, 7, 8],
  fungsi: [9, 10, 11],
  lingkaran: [15, 16, 17, 18],
  transformasi: [19, 20, 21],
  vektor: [12, 13, 14],
  limit: [22, 23, 24, 25],
};

/** single = pilih satu (A–E); multi = pilih semua yang benar; tf = tabel Benar/Salah tiap pernyataan. */
export type Kind = 'single' | 'multi' | 'tf';

export const KIND_LABEL: Record<Kind, string> = {
  single: 'Pilih satu jawaban',
  multi: 'Pilih semua jawaban yang benar',
  tf: 'Tentukan Benar atau Salah',
};

export interface TesItem {
  /** id cetakan soal, mis. "m1" */
  tid: string;
  materi: Materi;
  kind: Kind;
  /** topik singkat untuk rincian hasil */
  topic: string;
  /** naskah soal (HTML tepercaya dengan $…$) */
  paper: string;
  /** pilihan (single/multi: 5) atau pernyataan (tf: 3), HTML dengan $…$ */
  options: string[];
  /** single: tepat satu benar; multi: pilihan yang benar; tf: pernyataan yang Benar */
  ok: boolean[];
  /** pembahasan singkat (HTML dengan $…$) */
  explain: string;
  /** parameter mentah untuk oracle uji unit (tidak disimpan di riwayat) */
  params?: Record<string, unknown>;
}

/** Jawaban siswa untuk satu soal. */
export interface Resp {
  /** single/multi: indeks pilihan yang dipilih */
  pick: number[];
  /** tf: true = Benar, false = Salah, null = belum dijawab */
  tf: Array<boolean | null>;
  /** ditandai ragu-ragu */
  flag: boolean;
  /** waktu soal ini tampil (ms) */
  ms: number;
}

/** 21 soal dalam 40 menit: TKA 3 menit per soal, tes ini sedikit lebih mudah (sekitar 2 menit per soal). */
export const TES_MINUTES = 40;
export const PER_MATERI = 3;
