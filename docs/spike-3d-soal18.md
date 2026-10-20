# Spike 3D soal 18: pintu kaca patri (PRD §9.6, K12, K19; M1 tugas 1.6)

**Tanggal:** 20 Oktober 2026 · **Keputusan:** **LANJUT** dengan 3D sebagai pelengkap, dengan tiga syarat yang dicatat di bawah. Mode ringan **tidak** perlu menjadi bawaan.

## Yang dibangun
- `app/src/visuals/door3d-scene.ts`: adegan rendah-poligon prosedural tanpa berkas model maupun tekstur, Three.js r186, dimuat malas.
  - Pintu: rangka aluminium dan kaca berkisi.
  - Ornamen: 4 kaca merah, 2 hijau, 2 kuning sesuai `docs/ornamen_kaca_patri.png`.
  - Kerangka: lingkaran 64 ruas (InstancedMesh), 4 sisi persegi, 2 diameter.
  - Penggaris 0–7 m dan logam A, B, C.
- Tahap gerak:
  - `door` (berputar pelan, bisa diseret)
  - `ornament` (label "Luas 1 kaca merah = 456 cm²")
  - `unglass` (kaca lepas dan memudar)
  - `radius` (label r = 40 cm)
  - `unroll` (**pecahan kerangka**: lingkaran diluruskan menjadi batang 251,2 cm; 4 sisi menjadi 4 batang 56,57 cm; 2 diameter menjadi 2 batang 80 cm; warna biru/putih/langit)
  - `ruler` (berjajar di penggaris, total ≈ 637,5 cm)
  - `match`:
    - 2 logam A: sisa 1,63 m (merah), **Tidak Pas**
    - B: kurang, **Tidak Pas**
    - C: sisa 0,13 m, emas, **Pas**
- Semua tahap adalah *morph*, bukan ganti (ruas lingkaran diinterpolasi dari busur ke garis).
- Label HTML terproyeksi dengan `data-src` (`l3-merah`, `l3-r`, `l3-ring`, `l3-side`, `l3-diam`, `l3-total`) sehingga dapat menjadi sumber angka terbang ke papan.
- `app/src/visuals/ribbon18.ts`: **padanan 2D** berupa diagram pita SVG dengan urutan, label, dan warna yang sama.
- `app/src/visuals/door3d.ts`: pembungkus. Beralih ke 2D bila Mode ringan aktif, WebGL tidak ada, hemat gerak aktif, atau **fps < 30 selama 3 s** (dengan toast "Tetap 3D"). Tombol **Lewati animasi 3D** selalu ada.
- Angka dari `docs/pembahasan25.md` soal 18 (r = 40 cm, π = 3,14, √2 ≈ 1,414). Ukuran pintu hanya dekoratif dan tidak dipakai dalam hitungan.

## Hasil ukur (Chrome 1280×720; uji `npx playwright test -c playwright.lab.config.ts tests/lab/door3d.spec.ts`)

| Kriteria PRD §9.6 | Hasil | Batas | Status |
|---|---|---|---|
| (c) Ukuran potongan 3D (Three.js + adegan), gzip | **141,9 KB** (laporan Vite; 137,6 KiB versi `check-budget`) | ≤ 180 KB | lolos |
| JS awal tanpa 3D | 109,6 KB gzip (3D tidak ikut bundel awal) | ≤ 250 KB | lolos |
| (b) fps per tahap, CPU normal | 137–144 fps (layar ±144 Hz) | ≥ 30 | lolos |
| (b) fps per tahap, CPU 4× lebih lambat | 128–145 fps | ≥ 30 | lolos |
| Bingkai terburuk saat tahap pertama dimuat | 125 ms (CPU 1×), 278 ms (CPU 4×): satu kali, untuk memuat potongan dan mengompilasi shader | — | catatan (lihat syarat 2) |
| Bingkai terburuk tahap lain | 7–8 ms | — | lolos |
| Segitiga / draw call | ±1.020 segitiga / 22 panggilan | ≤ 25.000 segitiga | lolos |
| (d) 20× buka-tutup, setelah GC paksa | +0,48 MB, 1 kanvas, 1 konteks WebGL | tanpa kebocoran | lolos (setelah perbaikan) |
| (a) Mode ringan → padanan 2D | diagram pita memuat 637,5 cm dan Pas/Tidak Pas | informasi sama | lolos |
| Mode ringan otomatis | CPU 40× → beralih ke 2D + toast | < 30 fps selama 3 s | lolos |
| (e) Kamera/label tidak menutupi papan | adegan berada di area bebas (`.inFree`), kamera menyesuaikan rasio layar | — | lolos di lab; dicek ulang saat dipasang di q18 (M2) |

## Temuan penting: kebocoran memori di Three.js r186 (sudah diatasi)
- **Gejala:** setiap buka-tutup adegan menahan ±225 KB, terdiri dari 1 kanvas, 1 konteks WebGL, dan ±13 elemen. Kenaikannya linear meski GC dipaksa.
- **Penyebab** (ditemukan lewat heap snapshot):
  - Three.js r186 memakai **DataTexture LUT tingkat-modul** untuk `MeshStandardMaterial`.
  - Setiap `WebGLRenderer` baru mendaftarkan listener `dispose` pada tekstur bersama itu.
  - Karena tekstur tersebut tidak pernah dibuang, renderer lama beserta kanvasnya tertahan selamanya.
- **Perbaikan:** satu `WebGLRenderer` dipakai ulang, sama dengan pola `C3.attach/detach` di template. Geometri dan material adegan tetap dibuang, dan listener per adegan dilepas lewat `AbortController`.
- **Hasil:** +0,48 MB setelah 20 siklus (pemanasan); siklus berikutnya mendatar.

## Batasan pengukuran (jujur)
- fps diukur di Chrome desktop dengan GPU laptop. Pelambatan CPU tidak memperlambat GPU, jadi angka di atas **bukan pengganti perangkat nyata**. Wajib diukur ulang di HP Android, iPhone, dan tablet acuan setelah tautan Vercel aktif. Panduan uji ada di `docs/perangkat-uji.md`; halaman lab tersedia di server dev (`/lab/door3d.html`).
- Memori diukur dengan `performance.memory` (hanya Chrome).

## Keputusan dan syarat lanjut (untuk M2, konten soal 18)
1. **Lanjut 3D** sebagai pelengkap. Bawaan tetap 3D, dan peralihan otomatis ke 2D menjaga HP yang lambat.
2. **Muat dan kompilasi lebih awal:** *prefetch* potongan 3D saat Detail soal 18 dibuka (PRD §9.6 aturan 6) dan panggil `renderer.compile()` sebelum tahap pertama, untuk menghilangkan bingkai 125–278 ms saat pertama tampil.
3. **Ukur di tiga perangkat acuan** sebelum soal 18 dinyatakan lolos G-Visual/G-Gerak. Bila fps < 30 di perangkat acuan, Mode ringan menjadi bawaan khusus soal 18.

## Sisa pekerjaan untuk M2 (bukan bagian spike)
- Sambungkan ke `content/soal/q18.ts` (visual `door3d` dengan `state.stage`), sumber terbang `@l3-*` ke baris papan, dan warna baris papan yang sama dengan kelompok batang.
- Angka meter pada penggaris dan ketebalan batang yang dibesarkan saat kamera jauh.
- Uji G-Visual pada matriks viewport untuk adegan 3D dan 2D.
