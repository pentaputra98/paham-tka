/**
 * Daftar 25 soal TKA Matematika Tingkat Lanjut 2025 (PRD §5).
 * Judul dari docs/pembahasan25.md (daftar isi); bentuk respons dari docs/soal25.md.
 * Status `ready` hanya untuk 10 soal Rilis 1 (K10); sisanya `soon` (K1).
 */
export type Domain =
  | 'matriks'
  | 'polinom'
  | 'fungsi'
  | 'trigonometri'
  | 'vektor'
  | 'lingkaran'
  | 'geometri'
  | 'transformasi'
  | 'limit';

export type Response = 'single' | 'multi' | 'truefalse';

export interface SoalMeta {
  no: number;
  slug: string;
  title: string;
  domain: Domain;
  response: Response;
  /** label dua kolom untuk truefalse, mis. ['Pas', 'Tidak Pas'] */
  labels?: [string, string];
  status: 'ready' | 'soon';
  sourceRef: string;
}

/** Label ranah untuk kartu dan filter (FR-HOME-2). `lingkaran` dan `geometri` tergabung di filter Geometri. */
export const DOMAIN_LABEL: Record<Domain, string> = {
  matriks: 'Matriks',
  polinom: 'Suku banyak',
  fungsi: 'Fungsi dan grafik',
  trigonometri: 'Trigonometri',
  vektor: 'Vektor',
  lingkaran: 'Lingkaran',
  geometri: 'Geometri bidang',
  transformasi: 'Transformasi',
  limit: 'Limit',
};

export interface Filter {
  id: string;
  label: string;
  domains: Domain[];
}

export const FILTERS: Filter[] = [
  { id: 'matriks', label: 'Matriks', domains: ['matriks'] },
  { id: 'polinom', label: 'Suku banyak', domains: ['polinom'] },
  { id: 'fungsi', label: 'Fungsi dan grafik', domains: ['fungsi'] },
  { id: 'trigonometri', label: 'Trigonometri', domains: ['trigonometri'] },
  { id: 'vektor', label: 'Vektor', domains: ['vektor'] },
  { id: 'geometri', label: 'Geometri', domains: ['geometri', 'lingkaran'] },
  { id: 'transformasi', label: 'Transformasi', domains: ['transformasi'] },
  { id: 'limit', label: 'Limit', domains: ['limit'] },
];

export const RESPONSE_LABEL: Record<Response, string> = {
  single: 'Pilih satu',
  multi: 'Pilih beberapa',
  truefalse: 'Tabel dua kolom',
};

/** Sepuluh soal Rilis 1 (K10): kontennya sudah ada dan tetap diverifikasi (verify:content, uji unit). */
export const RELEASE_1: readonly number[] = [1, 2, 5, 6, 13, 16, 17, 18, 24, 25];

/**
 * Soal yang DIBUKA untuk siswa (revisi pemilik PRD v1.6–1.7): dibuka satu per satu setelah pembahasannya
 * ditulis ulang mengikuti alur guru dan disetujui; soal lain tampil "Segera hadir". Soal 1, lalu 24, 17, dan 18 (PRD v1.12).
 */
export const OPEN: readonly number[] = [1, 17, 18, 24];

type Row = [no: number, title: string, domain: Domain, response: Response, labels?: [string, string]];

const ROWS: Row[] = [
  [1, 'Invers Matriks Diagonal', 'matriks', 'single'],
  [2, 'Pakan Sapi dan Kambing', 'matriks', 'single'],
  [3, 'Bahan Baku Pabrik Minuman', 'matriks', 'single'],
  [4, 'Pendapatan Tiga Hotel', 'matriks', 'multi'],
  [5, 'Titik Potong dengan Sumbu X', 'polinom', 'multi'],
  [6, 'Sisa Pembagian Suku Banyak', 'polinom', 'single'],
  [7, 'Penambahan Volume 10 Drum', 'polinom', 'single'],
  [8, 'Modal Saham', 'polinom', 'truefalse', ['Benar', 'Salah']],
  [9, 'Populasi Kelinci', 'fungsi', 'truefalse', ['Benar', 'Salah']],
  [10, 'Eceng Gondok', 'fungsi', 'multi'],
  [11, 'Kedalaman Air Laut', 'trigonometri', 'single'],
  [12, 'Panjang Vektor 3D', 'vektor', 'single'],
  [13, 'Trapesium Sama Kaki', 'vektor', 'single'],
  [14, 'Kereta Api dan Koordinat 3D', 'vektor', 'multi'],
  [15, 'Lingkaran yang Sepusat', 'lingkaran', 'single'],
  [16, 'Titik Singgung Tegak Lurus Garis f', 'lingkaran', 'multi'],
  [17, 'Cat pada Rambu Rumah Makan', 'geometri', 'multi'],
  [18, 'Kerangka Kaca Patri', 'geometri', 'truefalse', ['Pas', 'Tidak Pas']],
  [19, 'Cermin lalu Translasi pada Garis', 'transformasi', 'single'],
  [20, 'Translasi lalu Dilatasi Lingkaran', 'transformasi', 'single'],
  [21, 'Rotasi Garis Berpusat (2, 0)', 'transformasi', 'multi'],
  [22, 'Limit Fungsi Rasional di x = 3', 'limit', 'single'],
  [23, 'Limit Tak Hingga Keuntungan', 'limit', 'single'],
  [24, 'Kerucut Es Krim dan Limit', 'limit', 'multi'],
  [25, 'Limit Trigonometri', 'limit', 'single'],
];

export const SOAL: readonly SoalMeta[] = ROWS.map(([no, title, domain, response, labels]) => ({
  no,
  slug: `q${String(no).padStart(2, '0')}`,
  title,
  domain,
  response,
  labels,
  status: OPEN.includes(no) ? 'ready' : 'soon',
  sourceRef: `docs/pembahasan25.md#soal-${no}`,
}));

export const getSoal = (no: number): SoalMeta | undefined => SOAL.find((s) => s.no === no);

export const isReady = (no: number): boolean => getSoal(no)?.status === 'ready';

export const SOON_MESSAGE =
  'Soal ini sedang disiapkan dan akan dibuka setelah pembahasan dan latihannya selesai diperiksa.';
