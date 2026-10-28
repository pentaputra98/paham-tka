# Ekspedisi TKA (PRD Revisi 1.26–1.27)

Permainan kelas untuk menguatkan titik lemah siswa sebelum TKA, bukan untuk menambah materi. Pemilik memintanya pada 29 Oktober 2026 untuk kelas pukul 11.40 WITA. Revisi 1.27 dibuat dari uji coba pemilik pada hari yang sama.

Tombolnya ada di beranda (**Ekspedisi TKA**, merah) dengan rute `#/ekspedisi`. Kodenya ada di `app/src/pages/eks.ts` dan `app/src/eks/` (`codes`, `bank`, `state`, `fx`).

## Peran

| Peran | Perangkat | Masuk |
|---|---|---|
| **Game Master** (guru) | laptop dan proyektor | kata sandi guru (yang disimpan di kode hanya sidik SHA-256-nya); tetap masuk 12 jam |
| **Kelompok** | satu tablet per kelompok | kode gabung dari guru → konfirmasi kelompok → nama anggota → swafoto (boleh dilewati) → kode mulai |
| **Coba cara bermain** | tablet mana pun | tanpa kode; 2 soal dengan waktu dipersingkat dan penjelasan setiap fase |
| **Riwayat** | tablet atau laptop | permainan yang sudah selesai; bisa dihapus satu per satu atau semuanya |

## Tanpa server

Tablet dan laptop tidak tersambung satu sama lain. Keduanya "berbicara" lewat kode (`app/src/eks/codes.ts`):

- **Kode gabung**, misalnya `KX7P-3M`, membawa kode permainan, nomor kelompok, dan satu huruf cek.
  - Di papan, kode gabung **tersembunyi** dan dibuka satu kelompok demi satu, supaya perwakilan kelompok maju bergantian.
  - Setelah mengetik kode, tablet menampilkan **"Kode ini milik Kelompok 3 · Jangkar. Benar?"**, jadi salah ketik kode kelompok lain langsung ketahuan.
- **Kode mulai** (3 huruf) baru tampil di papan setelah guru menekan **Mulai**. Tablet tidak bisa mulai tanpa kode ini, dan tombolnya baru aktif 5 detik setelah layar tunggu muncul. Tidak ada kelompok yang bisa mulai lebih dulu.
- **Kode bukti** (5 huruf) muncul setiap kali pos selesai. Isinya pos, skor, jumlah salah, dan jumlah soal yang dibantu, ditambah cek 10 bit yang terikat pada permainan dan kelompok. Kode karangan, kode kelompok lain, dan kode yang sama dua kali ditolak papan.
- **Lambang kelompok** (Kompas, Roket, Jangkar, Gunung, Api, Elang, masing-masing dengan warnanya) sama di tablet dan papan.
  - Swafoto tidak bisa dikirim ke laptop tanpa server. Foto hanya tersimpan di tablet dan menjadi ikon kelompok di tablet itu; papan memakai lambang.
  - Kamera memerlukan izin `camera=(self)` di `vercel.json`.
- **Waktu permainan** hanya ada di papan Game Master. Tablet menampilkan "waktu berjalan" sejak kode mulai dimasukkan.

## Aturan main

- **Meja depan.** Penjawab duduk sendiri dengan tablet; anggota lain menunggu di belakang.
- **Giliran.**
  - Urutan diacak dari nama anggota; setiap anggota menjawab sekali per putaran, lalu urutan diacak lagi.
  - Orang terakhir di satu putaran tidak boleh menjadi orang pertama putaran berikutnya.
  - Juru lapor (pembawa kode bukti) juga bergilir.
- **Pos berurutan** mengikuti jalur di peta. Pos berikutnya ditandai pin merah; pos lain terkunci.
- **Satu soal:**

| Tahap | Waktu | Aturan | Poin benar |
|---|---|---|---|
| Serah giliran | — | Nama penjawab tampil besar dan soal masih tersembunyi. Ada tombol **Kembali ke peta**, yang tidak mengurangi apa pun | — |
| Hitung mundur | 5 detik | Angka 5–1 beranimasi; waktu soal baru berjalan setelahnya | — |
| Mandiri | 40 detik | Hanya penjawab yang berpikir | 10 |
| Diskusi | sampai 2 menit | Mulai otomatis setelah waktu Mandiri. Lebih awal lewat **Panggil tim lebih awal**, hanya **1× per pos**. Latar layar berubah biru; penjawab tetap yang menekan | 6 |
| Kesempatan kedua | 45 detik | Nama jebakan ditampilkan, lalu soal kembaran dengan angka lain; latar kemerahan | 3 |

- **Sisa waktu soal ≤ 15 detik:** jam bergetar merah dan layar memerah samar. Dengan hemat gerak, getaran dimatikan.
- **Petunjuk:** 3 untuk seluruh permainan, dengan dua pilihan: "Ingatkan rumus" atau "Buang dua pilihan". Sisanya tampil sebagai ikon lampu "Petunjuk tersedia ●●○ 2/3". Soal yang memakai petunjuk paling banyak 6 poin. Tidak berlaku di Final dan Pacu Waktu.
- **Bonus +5** bila semua soal di satu pos benar pada percobaan pertama.
- **Pos yang ditinggal** dilanjutkan, tidak diulang dari awal. Soal yang sudah dibuka lalu ditinggal dihitung hangus.

### Mengapa batasnya begitu (keputusan revisi 1.27)

- **Panggil tim per pos, bukan global.** Setiap pos punya satu kesempatan, jadi tidak bisa dipakai di setiap soal, tetapi juga tidak habis di awal. Fase Diskusi otomatis setelah 40 detik tetap berlaku, karena tujuannya belajar bersama.
- **Petunjuk global (3).** Petunjuk adalah pengganti lembar contekan, jadi kelompok harus memilih soal mana yang paling membutuhkannya.
- **Pos berurutan.** Semua kelompok berlatih urutan yang sama. Antrean juru lapor di laptop guru tersebar karena kecepatan kelompok berbeda, dan peta jalur mudah dibaca.

## Pos

| Pos | Isi | Jebakan yang dilatih |
|---|---|---|
| 1. Lingkaran Kilat | Pusat, jari-jari, persamaan lingkaran | tanda pusat, lupa membagi 2, $r^2$ dikira $r$, tanda $C$ |
| 2. Gelombang | $h(t)=a+b\cos\left(\frac{\pi}{6}t\right)$ atau $\sin$ | lupa $a$, nilai trigonometri keliru, salah periode |
| 3. Tanpa Cheatsheet | Cermin, rotasi, dilatasi, translasi lalu cermin | aturan tertukar, urutan komposisi |
| 4. Detektif Aljabar | Baris pertama yang salah dalam penyelesaian 4 baris | $-(x-a)$, $(x-a)^2$, pindah ruas, pecahan |
| 5. Museum Jebakan | Pola jebakan soal TKA 2025 | "menjadi $p$ kali", setengah keliling, limit, lupa akar |
| 6. Pacu Waktu | 6 soal dalam 5 menit, urutan bebas, "Lewati dulu", diawali layar siap dan hitung mundur | **Jangan dikosongkan** pada 30 detik terakhir |
| 7. Final | 3 soal campuran tanpa petunjuk | — |

Kunci semua cetakan diperiksa oracle independen di `tests/unit/eks-bank.test.ts`.

## Papan Game Master

- **Persiapan**, dalam bingkai berjudul: waktu (stepper ±5 dan pilihan cepat), jumlah kelompok dengan pratinjau lambangnya, dan pos (kartu bernomor dengan sakelar) beserta perkiraan waktu. Di bawahnya ada riwayat permainan.
- **Saat bermain:**
  - **Jam**: cincin sisa waktu, −5/−1/Mulai·Jeda/+1/+5.
  - **Kode mulai**: tampil besar setelah Mulai.
  - **Kode bukti**: kolom isian dan tombol Catat (atau Enter).
  - **Tombol**: Kode gabung dan Akhiri.
  - **Peringkat**: baris berwarna kelompok, lambang, bilah kemajuan pos, dan skor besar; baris bergeser halus saat urutan berubah.
- **Sisa waktu ≤ 1 menit:** latar papan berdenyut merah samar dan jam bergetar.
- **Waktu habis:** layar penuh **"Waktu habis!"** meminta semua kelompok menekan *Selesai ekspedisi*. Kode yang sedang dibawa masih diterima selama 1 menit.
- **Umumkan hasil:**
  - podium naik bergantian (ketiga, kedua, juara bermahkota dan berwarna emas), lalu konfeti;
  - statistik: poin seluruh kelas, pos dilaporkan, kelompok paling teliti, kelompok paling mandiri;
  - peringkat sisanya dan pos yang paling banyak menjebak kelas.

## Akhir permainan di tablet

Waktu permainan hanya ada di papan, jadi tablet tidak tahu kapan waktu habis. Karena itu:
- Peta selalu menampilkan tombol merah besar **Selesai ekspedisi** ("tekan saat guru mengumumkan waktu habis").
- Papan Game Master menampilkan pengumuman waktu habis di layar depan.
- Setelah ditekan, atau setelah semua pos selesai, tablet menampilkan layar selesai: konfeti, foto atau lambang, skor, daftar kode bukti, dan "jebakan yang perlu diingat untuk hari Senin". Hasilnya masuk ke riwayat tablet.

## Papan ketik aplikasi (revisi 1.27, juga dipakai di Tes penguasaan)

- Tidak terbuka sendiri; baru muncul saat kolom diketuk.
- Tombol **Sembunyikan** berwarna merah.
- Ketukan di luar papan ketik menyembunyikannya.
- Kolom kode selalu huruf kapital.
- Nama anggota: satu nama → **Selesai** → papan ketik tertutup dan nama muncul di daftar.

## Penyimpanan

Semua data hanya ada di perangkat:
- `pahamtka:v1:eks-tim` dan `pahamtka:v1:eks-riwayat` (termasuk foto) di tablet;
- `pahamtka:v1:eks-gm`, `pahamtka:v1:eks-gm-ok`, dan `pahamtka:v1:eks-gm-riwayat` di laptop.

## Belum dibuat (menunggu tinjauan pemilik)

- Kartu kekuatan.
- Kejutan Game Master.
- Mode Satu Layar (tanpa tablet).
