# Keputusan lapisan gerak: Motion atau WAAPI + tween (PRD K21, §13.5a; M1 tugas 1.2)

**Tanggal:** 20 Oktober 2026 · **Status:** diputuskan, diterapkan sebagai bawaan adaptor `app/src/core/motion.ts`

## Keputusan
**Bawaan: WAAPI + tween bawaan template.** Motion vanilla tetap tersedia di adaptor (`setBackend('motion')`, varian `motion/mini`, dimuat malas sebagai potongan terpisah dan ikut *precache*), tetapi tidak dipakai secara bawaan.

## Alasan singkat
1. Paket Motion penuh (`animate` + `stagger` + `spring`) berukuran **27,6 KB gzip**, melewati batas kriteria 4 (≤ 20 KB). Hanya `motion/mini` (4,1 KB) yang masuk anggaran. `motion/mini` adalah pembungkus tipis WAAPI, jadi tidak membawa keunggulan inti (spring berbasis JS, transform independen) yang menjadi alasan memilih Motion.
2. Pada uji beban dengan CPU diperlambat 4× (emulasi HP kelas menengah), `motion/mini` menghasilkan **bingkai terburuk 100–117 ms** saat 24 token mulai terbang serentak. WAAPI menghasilkan **25–42 ms**. PRD §14.7 mensyaratkan "tidak ada tugas utama > 50 ms pada animasi".
3. Perilaku lain setara (kecepatan, `complete()`, hemat gerak), sehingga tidak ada fitur yang hilang dengan memilih WAAPI.

## Metode
- **Prototipe:** `app/lab/motion.html` + `app/src/lab/motion-lab.ts` (khusus pengembangan, tidak ikut `dist/`). Penerbangan token persis pola `B.fly` template: klon di slot tujuan, mulai dari sumber, lengkung lewat *keyframe* tengah, hanya `transform`/`opacity`. Juga ada transisi lembar.
- **Uji otomatis:** `npx playwright test -c playwright.lab.config.ts` (Chrome sistem, 1280×720). Hasil mentah: `app/tests/lab/__out__/motion-results.json`.
- **Ukuran:** `npx tsx scripts/lab/measure-motion.ts` (build pustaka terpisah, minify, gzip).
- Laju kecepatan siswa diterapkan sebagai *playbackRate* (bukan dipanggang ke durasi), sehingga mengubah kecepatan di tengah gerak tidak menimbulkan lompatan, dan tombol jeda = laju 0.

## Hasil per kriteria (PRD §13.5a)

| # | Kriteria | Motion (`motion/mini`) | WAAPI + tween | Batas |
|---|----------|------------------------|---------------|-------|
| 1 | Ubah kecepatan 0,75× → 1,5× di tengah terbang: rasio langkah sesudah/sebelum | 1,16 (lolos) | 1,15 (lolos) | < 3 (laju naik 2×) |
| 2 | `complete()` saat 24 token terbang: token tersisa / slot tersembunyi / kendali aktif | 0 / 0 / 0, 9 ms (lolos) | 0 / 0 / 0, 8 ms (lolos) | semua 0 |
| 3 | 24 token terbang serentak, CPU 4× lebih lambat: fps rata-rata | 111–115 (lolos) | 117–118 (lolos) | ≥ 55 |
| 3b | Bingkai terburuk pada uji yang sama | 50–117 ms (**gagal** §14.7) | 25–42 ms (lolos) | ≤ 50 ms |
| 4 | Tambahan ukuran gzip | penuh 27,6 KB (**gagal**); mini 4,1 KB (lolos) | 0 KB | ≤ 20 KB |
| 5 | Hemat gerak: 1 terbang 860 ms → durasi nyata; urutan 5 terbang berurutan | 219 ms, urutan benar (lolos) | 228 ms, urutan benar (lolos) | ≈ 25 %, urutan utuh |
| 6 | Berjalan dari cache offline | lolos (potongan lokal ikut *precache*) | lolos (bawaan peramban) | tanpa jaringan |

## Batasan pengukuran (jujur)
- fps diukur di Chrome desktop pada layar ±120 Hz dengan CPU diperlambat (emulasi). **Belum diukur di tiga perangkat acuan nyata** (HP Android, iPhone, tablet), karena tautan preview Vercel belum aktif. Ulangi pengukuran di perangkat nyata sebelum Rilis 1. Halaman lab dapat dibuka dari server dev, atau diukur di aplikasi lewat profil bingkai.
- Kriteria 3b (bingkai terburuk) bukan bagian dari enam kriteria §13.5a, tetapi merupakan anggaran §14.7. Kriteria inilah yang menentukan pilihan.

## Dampak pada kode
- `core/motion.ts`: bawaan `'waapi'`. `setBackend('motion')` memuat `motion/mini` secara dinamis.
- Semua animasi instruksional dan antarmuka lewat `play()`. Mesin memanggil `completeAll()` / `cancelAll()` saat siswa berpindah langkah.
- Tween nilai (`core/tween.ts`) dan jeda (`core/clock.sleep`) memakai laju yang sama.
