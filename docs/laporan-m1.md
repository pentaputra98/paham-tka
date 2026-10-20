# Laporan M0 + M1 Paham TKA

**Tanggal:** 20 Oktober 2026 · **Repositori:** https://github.com/pentaputra98/paham-tka (cabang `main`) · **Acuan:** PRD v1.3

## 1. Status M0 dan M1

| Tonggak                  | Status                               | Bukti                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M0: fondasi**          | selesai                              | `npm run check` lolos (tsc, ESLint, Stylelint, Prettier, `validate:tokens`, `verify:content`). Service worker precache atomik dan uji offline lolos (`tests/e2e/shell.spec.ts`). Header CSP/keamanan di `app/vercel.json` juga diterapkan ke `vite preview`. Anggaran build: JS awal 110,7 KB, CSS 16,6 KB, font 315,8 KB, precache 1.420,5 KB (semua di bawah batas `check-budget`). |
| **M1: mesin pembahasan** | selesai, kecuali uji perangkat nyata | Papan, pemutar langkah, adegan, kartu, catatan, dan validator konten sudah ada. Pilot **soal 25** dan **soal 24** lolos G-Gerak (11 uji e2e) dan matriks viewport (11 ukuran × 9 layar). Oracle independen mengonfirmasi kunci: 24 → hanya (5), 25 → E. Spike 3D soal 18 berstatus LANJUT. Hero angka terbang di beranda tanpa pergeseran tata letak.                                 |
| Belum                    | —                                    | Uji di HP Android, iPhone, dan tablet acuan (`docs/perangkat-uji.md`), karena tautan Vercel belum aktif.                                                                                                                                                                                                                                                                              |

Perintah uji: `npm --prefix app run check`, `npx vitest run`, `npx playwright test` (e2e + visual), dan `npx playwright test -c playwright.lab.config.ts` (lab Motion dan 3D).

## 2. Berkas penting

- `PRD.md` v1.3: `connect-src 'self'`, cadangan `file://` dipindah ke M5, catatan dist ESM, dan temuan §11.4.
- `app/src/engine/`:
  - `board.ts`: papan, terbang, pertanyaan cepat;
  - `player.ts`: `go()`/run/live, putar otomatis;
  - `scene.ts`: mode adegan dan `layout()`;
  - `cards.ts`, `notes.ts`;
  - `fly.ts`: klon terbang dan `visibleEnough`;
  - `validate.ts`: aturan `verify:content`;
  - `types.ts`: skema konten.
- `app/src/core/`:
  - `motion.ts`: adaptor, bawaan WAAPI;
  - `clock.ts`, `loop.ts`, `tween.ts`: satu loop rAF yang diam bila tidak ada kerja;
  - `math.ts`: KaTeX dengan trust terbatas dan cache;
  - `store.ts`, `audio.ts`.
- `app/src/content/soal/q25.ts` dan `q24.ts`: konten pilot. `content/index.ts` berisi 25 meta soal dan `RELEASE_1`.
- `app/src/visuals/`:
  - `cone.ts`: SVG kerucut, slider θ dan r;
  - `door3d.ts` dan `door3d-scene.ts`: spike 3D;
  - `ribbon18.ts`: padanan 2D.
- `app/src/pages/bahas.ts` dan `hero.ts`; `app/src/styles/tokens.css` (token tiga lapis).
- Tes:
  - `app/tests/unit/*`: termasuk `oracle-pilot.spec.ts`;
  - `app/tests/e2e/*`: bahas, bahas24, hero, hero-cls, review-fixes, shell;
  - `app/tests/visual/*`: matriks viewport;
  - `app/tests/lab/*`.
- Dokumen keputusan: `docs/keputusan-motion.md`, `docs/spike-3d-soal18.md`, `docs/panduan-vercel.md`, `docs/perangkat-uji.md`.

## 3. Skill yang dipakai dan keputusan yang dipengaruhinya

| Skill                             | Keputusan yang dipengaruhi                                                                                                                                              |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| design, design-system, ui-styling | Token tiga lapis (primitif → semantik → komponen). Validator `validate:tokens` menolak nilai mentah. Emas hanya untuk jawaban; biru untuk sumber/terbang.               |
| frontend-design, ui-ux-pro-max    | Tipografi (Archivo, Plus Jakarta Sans, JetBrains Mono lokal), target sentuh ≥ 44 px, kontras ≥ 4,5:1, layar putar-perangkat tanpa mode sempit, papan tanpa elipsis.     |
| motion-framer                     | Uji kelayakan Motion vs WAAPI dengan enam kriteria §13.5a. Hasilnya: WAAPI menjadi bawaan.                                                                              |
| security-review                   | CSP ketat (`connect-src 'self'` agar service worker bisa precache), nosniff, no-referrer, COOP, Permissions-Policy. KaTeX trust dibatasi pada `\htmlData`/`\htmlClass`. |
| code-review                       | 10 temuan diperbaiki dan diuji (`tests/e2e/review-fixes.spec.ts`); lihat commit `cf4f083`.                                                                              |
| simplify                          | Merapikan kode tanpa mengubah perilaku (lihat §5).                                                                                                                      |

## 4. Keputusan Motion dan hasil spike 3D

- **Motion:** bawaan **WAAPI + tween**.
  - Motion penuh berukuran 27,6 KB gzip, di atas batas 20 KB.
  - `motion/mini` menghasilkan bingkai terburuk 50–117 ms pada CPU 4×, melampaui batas 50 ms; WAAPI 25–42 ms.
  - Rincian: `docs/keputusan-motion.md`.
- **3D soal 18:** **LANJUT** sebagai pelengkap.
  - Potongan 3D 138,1 KB gzip (batas 180 KB).
  - fps ≥ 128 pada CPU 4× (emulasi); ±1.020 segitiga.
  - Memori stabil setelah perbaikan kebocoran LUT Three r186 (satu renderer dipakai ulang).
  - Padanan 2D otomatis untuk Mode ringan, tanpa WebGL, hemat gerak, atau fps < 30 selama 3 s.
  - Rincian dan syaratnya: `docs/spike-3d-soal18.md`.

## 5. Temuan, risiko, deviasi, dan usulan revisi

- **Simplify (commit `refactor(m1)`):**
  - Fungsi bersama `isFrac`/`verdictLabels`/`visibleEnough`; cache `tex()`; catatan dibangun malas.
  - API mati dihapus: `solid3d`, `hlLevels`, `Board.rowIds`/`reset`, `releaseShared`.
  - `Player.pending` diturunkan dari papan.
  - Adegan 3D: tween inti (ikut kecepatan/jeda dan diselesaikan saat pindah langkah), menggambar hanya bila ada perubahan, satu jalur ubah ukuran.
  - `hasWebGL` diperiksa sekali.
  - Kerucut: HUD hanya dihitung saat lab tampil.
  - `layout()` tidak menulis ulang properti yang sama dan hanya menyesuaikan papan bila lebarnya berubah.
- **Regresi yang tertangkap uji, sudah diperbaiki:** setelah `pending` diturunkan dari papan, papan memberi tahu "pertanyaan terbuka" sebelum `askRes` diisi. Akibatnya tombol Lanjut tidak berubah menjadi "Lewati soal". Pemberitahuan kini dikirim setelah `askRes` diisi, dan uji G-Gerak lolos lagi.
- **Hasil uji akhir:**
  - unit: 19/19;
  - e2e: 27/27;
  - visual (matriks viewport): 25/25;
  - lab Motion + 3D: 13/13. Memori 20× buka-tutup +0,56 MB dengan 1 kanvas; fps 3D pada CPU 4× 130–144.
- **Simplify yang dilewati (dicatat):**
  - resolver sumber berlingkup;
  - satu makro stabilo;
  - `Intl.Segmenter` di validator;
  - penurunan `srcNames` otomatis;
  - `Ctx.entered` dipertahankan karena dirujuk PRD §9.1.
- **Deviasi yang sudah disetujui (PRD v1.3):**
  - `connect-src 'self'`;
  - berkas tunggal `file://` di M5.
- **Penambahan konten yang dilaporkan:**
  - baris "Diketahui/Ditanya" soal 25 (k1–k8);
  - pop-up tambahan;
  - blok "tambahan M1" soal 24.
    Semuanya disinkronkan ke `docs/pembahasan25.md`. **Kunci tidak berubah.**
- **Risiko:**
  - fps dan memori baru diukur di Chrome desktop (emulasi CPU), belum di perangkat acuan.
  - Bingkai pertama 3D 125–278 ms (muat potongan + kompilasi shader). Rencananya prefetch dan `renderer.compile()` di M2.
  - Dua pop-up mendekati batas (193 dan 219 karakter; batas keras 220): ada peringatan `verify:content`.
- **Temuan PRD §11.4:** teks "√2 = 1,41 diberikan di soal" tidak ada di `docs/soal25.md` (pembahasan memakai ≈ 1,414). Ditunda ke M3 sesuai riwayat §20.2.

## 6. Butuh keputusan atau tindakan Pak Penta

1. **Hubungkan Vercel** ke repo `pentaputra98/paham-tka` (panduan: `docs/panduan-vercel.md`). Saya tidak melakukannya tanpa konfirmasi.
2. **Uji di perangkat nyata** (Android, iPhone, tablet) memakai `docs/perangkat-uji.md`, setelah tautan aktif.
3. **Keputusan teks √2 = 1,41** pada PRD §11.4 (untuk M3).

## 7. Draf prompt M2

> Lanjutkan Paham TKA ke M2 (konten Rilis 1) dari commit terakhir `main`. Soal 25 dan 24 sudah selesai. Kerjakan berurutan **17 → 18 → 1, 6, 2, 5, 13, 16**. Untuk tiap soal:
>
> - konten diambil dari `docs/soal25.md`, `docs/pembahasan25.md`, dan gambar `docs/`;
> - baris atau pop-up tambahan disinkronkan ke `docs/pembahasan25.md` dan dilaporkan;
> - kunci tidak diubah;
> - wajib lolos `verify:content`, oracle independen, G-Gerak, dan matriks viewport.
>
> Soal 18:
>
> - pasang `door3d` dengan prefetch saat Detail dibuka dan `renderer.compile()`;
> - padanan 2D harus setara informasinya.
>
> Setelah setiap soal, commit dan push ke GitHub. Jangan menghubungkan Vercel tanpa konfirmasi. Jangan mulai M3.
