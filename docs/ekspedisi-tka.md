# Ekspedisi TKA (PRD Revisi 1.26)

Permainan kelas untuk menguatkan titik lemah siswa sebelum TKA, bukan untuk menambah materi. Permainan ini diminta pemilik pada 29 Oktober 2026 dan dimainkan hari itu juga, pukul 11.40 WITA.

Tombolnya ada di beranda (**Ekspedisi TKA**, merah) dengan rute `#/ekspedisi`. Kodenya ada di `app/src/pages/eks.ts` dan `app/src/eks/`.

## Peran

| Peran | Perangkat | Masuk |
|---|---|---|
| **Game Master** (guru) | laptop dan proyektor | kata sandi guru (yang disimpan di kode hanya sidik SHA-256-nya); tetap masuk 12 jam di perangkat itu |
| **Kelompok** | satu tablet per kelompok | kode gabung dari Game Master, lalu nama anggota |
| **Coba cara bermain** | tablet mana pun | tanpa kode; 2 soal latihan yang tidak dinilai |

## Tanpa server

Tablet dan laptop tidak tersambung satu sama lain. Keduanya "berbicara" lewat kode (`app/src/eks/codes.ts`).

- **Kode permainan** (4 huruf) juga membawa daftar pos yang dimainkan.
- **Kode gabung** kelompok, misalnya `KX7P-3M`, terdiri dari kode permainan, nomor kelompok, dan satu huruf cek. Angka soal setiap kelompok berbeda karena diacak dari kode ini.
- **Kode bukti** (5 huruf) muncul setiap kali pos selesai. Isinya pos, skor, jumlah salah, dan jumlah soal yang dibantu, ditambah cek 10 bit yang terikat pada permainan dan kelompok.
  - Kode kelompok lain atau kode karangan ditolak papan.
  - Kode yang sama dua kali juga ditolak.
- Waktu permainan hanya ada di papan Game Master, jadi guru bebas menambah, mengurangi, atau menjeda tanpa menyentuh tablet.

## Aturan main

- **Meja depan.** Setiap kelompok punya satu meja di depan. Penjawab duduk sendiri dengan tablet; anggota lain menunggu di belakang.
- **Giliran.** Urutan diacak dari nama anggota.
  - Setiap anggota menjawab sekali per putaran, lalu urutan diacak lagi.
  - Orang terakhir di satu putaran tidak boleh menjadi orang pertama di putaran berikutnya.
  - Urutan bersambung antarpos.
  - Juru lapor (yang membawa kode bukti ke Game Master) juga bergilir.
- **Satu soal:**

| Fase | Waktu | Aturan | Poin benar |
|---|---|---|---|
| Serah giliran | — | Nama penjawab tampil besar; soal tersembunyi sampai penjawab menekan "siap" | — |
| Mandiri | 40 detik | Hanya penjawab yang berpikir | 10 |
| Diskusi | sampai 2 menit | Mulai otomatis, atau lewat tombol "Minta bantuan tim". Tim boleh ke meja, tetapi penjawab tetap yang menekan dan menjelaskan | 6 |
| Kesempatan kedua | 45 detik | Setelah jawaban salah, **nama jebakannya** ditampilkan, lalu muncul soal kembaran dengan angka lain | 3 |

- Bila waktu soal habis, soal hangus (0 poin) dan kuncinya ditunjukkan.
- **Petunjuk:** 3 untuk seluruh permainan, dengan dua pilihan: "Ingatkan rumus" atau "Buang dua pilihan". Soal yang memakai petunjuk paling banyak 6 poin. Tidak berlaku di Final dan Pacu Waktu.
- **Bonus +5** bila semua soal di satu pos benar pada percobaan pertama.
- **Pos yang ditinggal:**
  - Satu pos harus diselesaikan dulu sebelum pindah ke pos lain.
  - Bila tablet dimuat ulang, pos dilanjutkan, tidak diulang dari awal.
  - Soal yang sudah dibuka lalu ditinggal dihitung hangus.

## Pos

| Pos | Isi | Jebakan yang dilatih |
|---|---|---|
| 0. Pemanasan | Mode Coba cara bermain | $(a+b)^2\ne a^2+b^2$, negatif × negatif |
| 1. Lingkaran Kilat | Pusat, jari-jari, persamaan lingkaran | tanda pusat, lupa membagi 2, $r^2$ dikira $r$, tanda $C$, $x$ dan $y$ tertukar |
| 2. Gelombang | $h(t)=a+b\cos\left(\frac{\pi}{6}t\right)$ atau $\sin$: tertinggi, terendah, nilai pada $t$, periode | lupa $a$, nilai trigonometri keliru, setengah atau seperempat periode |
| 3. Tanpa Cheatsheet | Cermin sumbu X/Y, $y=x$, $y=-x$; rotasi 90° dan 180°; dilatasi; translasi lalu cermin | aturan tertukar, urutan komposisi, tanda translasi |
| 4. Detektif Aljabar | Menunjuk baris pertama yang salah dalam penyelesaian 4 baris (bisa juga semua benar) | $-(x-a)$, $(x-a)^2$, pindah ruas, membagi dengan bilangan negatif, menjumlah pecahan |
| 5. Museum Jebakan | Pola jebakan soal TKA 2025 | "menjadi $p$ kali" (soal 9), setengah keliling (soal 17), limit $\frac00$, limit tak hingga, lupa akar panjang vektor |
| 6. Pacu Waktu | 6 soal campuran dalam 5 menit, urutan bebas, ada tombol "Lewati dulu" | Strategi waktu. Pada 30 detik terakhir tampil peringatan **Jangan dikosongkan**. Benar = 10 poin per soal |
| 7. Final | 3 soal campuran tanpa petunjuk | Terbuka setelah 4 pos lain selesai |

Setiap pos berisi 3 soal. Kunci semua cetakan diperiksa oracle independen di `tests/unit/eks-bank.test.ts` (400 benih per pos).

## Papan Game Master

- **Persiapan:** waktu (pilihan cepat 10, 30, 45, atau 60 menit, atau ±5 menit), jumlah kelompok (2–6), dan pos yang dimainkan, lengkap dengan perkiraan waktunya.
- **Saat bermain:**
  - jam besar dengan tombol −5, −1, Mulai/Jeda/Lanjut, +1, +5;
  - kolom kode bukti (tekan Enter);
  - daftar kode gabung;
  - tombol Akhiri;
  - peringkat dengan skor dan pos yang sudah selesai, yang bergeser halus saat urutan berubah.
- **Waktu habis:** kode yang sedang dibawa masih diterima selama 1 menit. Setelah itu tombol **Umumkan hasil** membuka peringkat dari bawah ke atas, juara bertanda emas, beserta **pos yang paling banyak menjebak kelas**.
- **Tablet kelompok** di akhir menampilkan "Jebakan yang perlu kalian ingat untuk hari Senin".

## Penyimpanan

Semua data hanya ada di perangkat:
- `pahamtka:v1:eks-tim` di tablet;
- `pahamtka:v1:eks-gm` dan `pahamtka:v1:eks-gm-ok` di laptop.

## Belum dibuat (menunggu tinjauan pemilik)

- Kartu kekuatan (Penyelamat, Ganda, Tambah Petunjuk).
- Kejutan Game Master (Ronde Kilat, Papan Dibekukan).
- Mode Satu Layar (Konsep B, tanpa tablet siswa).
