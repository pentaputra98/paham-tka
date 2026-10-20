# Laporan M2 Paham TKA (konten Rilis 1)

**Tanggal:** 20 Oktober 2026 · **Repositori:** https://github.com/pentaputra98/paham-tka (`main`) · **Acuan:** PRD v1.3, `docs/pembahasan25.md`

## 1. Status

Kesepuluh soal Rilis 1 kini punya modul pembahasan lengkap: 1, 2, 5, 6, 13, 16, 17, 18, 24, 25. Urutan pengerjaan mengikuti "berisiko dahulu": 25 → 24 → 17 → 18 → 1, 6, 2, 5, 13, 16.

| Soal | Visual | Uji G-Gerak (e2e) | Oracle independen | Kunci |
|---|---|---|---|---|
| 1 | grid matriks: diagonal, tukar a↔d, F dan F⁻¹ | 3 | perkalian F·X dan X·F = I | E |
| 2 | gambar sumber, tabel sebagai sumber terbang | 3 | cari (x, y) cacah, hitung ulang tiap pilihan | E |
| 5 | grafik kubik: titik ke tiap pilihan, slider | 3 | akar dari perubahan tanda dan bagi dua | (−2, 0), (3, 0) |
| 6 | papan saja | 3 | pembagian bersusun untuk semua (a, b) bulat | C |
| 13 | bidang koordinat: pencerminan D→C | 3 | uji definisi trapesium sama kaki pada semua (a, b) | C |
| 16 | garis f, lingkaran, garis singgung, uji kandidat | 3 | sapuan sudut pada lingkaran | (3, −1), (1, −5) |
| 17 | rambu SVG berlapis (sorot per warna) | 3 | cacah titik pada kisi 40×40 cm, termasuk sensitivitas salib | 1, 2, 5 |
| 18 | 3D pintu kaca patri + padanan 2D | 4 | lingkaran sebagai poligon, bagi dua untuk r | Tidak · Tidak · Pas |
| 24 | SVG kerucut, slider θ dan r (M1) | 4 | tali sepatu dan Simpson (M1) | (5) |
| 25 | papan (M1) | 7 | evaluasi numerik (M1) | E |

Semua oracle mencocokkan kunci di `docs/pembahasan25.md`. **Tidak ada kunci yang berubah.**

## 2. Perbaikan mesin yang ditemukan saat mengerjakan konten

- **Papan:**
  - Lebar acuan pengukuran baris kini lebar baris itu sendiri, dan `scrollbar-gutter: stable` dipasang.
  - Ukur ulang dilakukan saat baris selesai, di akhir langkah, saat font dimuat, dan saat ukuran papan berubah (ResizeObserver).
  - Sebelumnya baris panjang bisa melewati tepi isi papan beberapa piksel.
- **Kartu:** `Cards.fit()` memperkecil rumus dan pernyataan kartu yang lebih lebar atau lebih tinggi dari kartunya (min 50 %). Rumus kartu tidak dipatahkan.
- **Pin papan:** token pin tidak terlipat di dalam dirinya. Pin panjang dibungkus per token.
- **3D soal 18:**
  - Potongan Three.js dimuat lebih awal saat Detail soal 18 dibuka, kecuali dalam Mode ringan.
  - Shader dikompilasi awal (`compileAsync`). Bingkai terburuk pertama di CPU 1× turun dari 125 ms ke 42 ms.
  - Label tersembunyi tidak lagi dipilih sebagai sumber terbang.
  - Padanan 2D memakai nama sumber yang sama.
  - Batang logam di tahap "match" direnggangkan agar label tidak bertumpuk.
- **verify:content:** menolak karakter kendali yang muncul karena garis miring LaTeX tunggal di string TypeScript (mis. `'\begin'` menjadi backspace). Ada uji unitnya.

## 3. Penambahan konten yang dilaporkan

Setiap soal punya blok *"Ditambahkan M2"* di `docs/pembahasan25.md` (dan `authorNotes` di modulnya). Ringkasnya:

- **Baris "Diketahui/Ditanya"** disusun dari stabilo dan pop-up untuk soal yang dokumennya belum memuat tabel baris: 1, 2, 5, 6, 13, 17.
- **Langkah panjang dipecah** menjadi satu langkah per pilihan atau per warna, dengan pop-up dari kolom keterangan dan alasan kartu: 5, 16, 17, 18.
- **Pin tambahan** agar angka bisa terbang antarpapan. Di soal 6, pin dipecah per suku.
- **Papan ringkasan kartu dan pertanyaan kesimpulan** disusun dari tabel kartu (pola M1).
- **Teks pertanyaan cepat 2.1 soal 5** belum ada di dokumen. Teks yang dipakai: "Titik potong grafik dengan sumbu X dicari dari…".

## 4. Deviasi dari dokumen (dengan alasan, kunci tetap)

1. **Emas hanya untuk jawaban (PRD).** Tiga kotak yang di dokumen berwarna emas diubah menjadi navy:
   - $r=40$ cm (soal 18, b4);
   - $\det F=1$ di ringkasan soal 1;
   - $a=2,\ b=-3$ di ringkasan soal 6 (tidak ditandai di dokumen).
   Dokumen sudah diperbarui serempak.
2. **Sumber terbang soal 18** a4/b4/c5 memakai label adegan (`@l3-*`), bukan kertas soal, karena kertas tidak tampil saat adegan dibuka.
3. **Rumus kartu soal 17** diringkas menjadi perbandingan akhir agar muat. Baris papan c2–c6 hanya memuat angka; nama kuantitas dipindah ke keterangan.
4. **Soal 1:** baris b2 ditulis kapur sebagai satu matriks. Pertukaran a↔d ditunjukkan oleh adegan.

## 5. Risiko dan batasan (jujur)

- **Layar terkecil (667×360):**
  - Grafik soal 5 dan 16 serta kartu soal 2 tetap terbaca, tetapi kecil.
  - Keterangan "alasan" di balik kartu bisa terpotong pada kartu yang sangat pendek. Ini sudah terjadi sejak M1 dan berlaku untuk semua soal.
- **Ukuran gambar:** precache naik menjadi ±2,7 MB, karena gambar PNG sumber 0,1–0,64 MB per gambar. Masih jauh di bawah batas 8 MB. Usulan M5: konversi ke WebP/AVIF.
- **Sorotan angka 3 dan 4** pada gambar sapi/kambing (soal 2, dokumen *Sorotan*) belum dibuat.
- **Perangkat nyata** (Android, iPhone, tablet) belum diuji. Pengukuran fps 3D dan Motion masih emulasi Chrome desktop.

## 6. Butuh keputusan atau tindakan Pak Penta

1. Hubungkan Vercel (`docs/panduan-vercel.md`) dan uji di perangkat nyata (`docs/perangkat-uji.md`).
2. Tinjau blok "Ditambahkan M2" di `docs/pembahasan25.md`, terutama tafsir soal 17, teks pertanyaan 2.1 soal 5, dan perubahan warna kotak emas menjadi navy.
3. Keputusan √2 = 1,41 pada PRD §11.4 (masih untuk M3).
