# Tes Penguasaan Materi (PRD Revisi 1.24)

Menu khusus untuk mengukur penguasaan siswa per materi TKA Matematika Tingkat Lanjut. Diminta pemilik pada 27 Oktober 2026.

## Ringkasan

| Hal | Keputusan |
|---|---|
| Materi | Matriks, Polinomial, Fungsi, Lingkaran, Transformasi geometri, Vektor, Limit (urutan dari pemilik) |
| Banyak soal | 21 soal, **3 per materi**, sehingga persen per materi bernilai 0, 33, 67, atau 100 |
| Waktu | **40 menit**. TKA memberi 75 menit untuk 25 soal (3 menit per soal); tes ini sedikit lebih mudah, jadi sekitar 2 menit per soal |
| Tingkat | Sedikit di bawah soal TKA 2025 yang materinya sama |
| Bentuk soal | Seperti TKA: pilih satu jawaban (15 soal), pilih semua jawaban yang benar (3 soal), dan tabel Benar/Salah (3 soal) |
| Penilaian | Soal dihitung tepat bila seluruh bagiannya tepat. Penguasaan = persen soal tepat |
| Tingkat penguasaan | ≥ 80 % Dikuasai · ≥ 60 % Cukup · > 0 % Perlu diperkuat · 0 % Belum dikuasai |
| Soal berbeda | Setiap percobaan memakai benih acak baru, jadi angka dan urutan pilihannya berbeda |
| Penyimpanan | Hanya di perangkat (`localStorage` kunci `pahamtka:v1:tes`): identitas terakhir, tes yang sedang berjalan, riwayat (maks. 40 percobaan) |

## Alur

1. **Identitas** (`#/tes`): nama lengkap dan asal sekolah wajib diisi.
   - Isian memakai papan ketik aplikasi (`shell/keyboard.ts`), karena papan ketik bawaan HP menutupi separuh layar mendatar.
   - Huruf besar muncul otomatis di awal kata. Tombol Shift ditekan sekali untuk satu huruf besar, dua kali untuk mengunci.
   - Ada pilihan cepat sekolah (sekolah terakhir dan SMA Vidatra Bontang).
2. **Petunjuk**: tujuan tes, 21 soal dalam 40 menit, bentuk soal, cara berpindah soal dan menandai ragu-ragu, waktu yang terus berjalan, dan anjuran mengerjakan sendiri. Halaman ini juga menampilkan nomor percobaan peserta.
3. **Pengerjaan** (`#/tes/kerjakan?n=`):
   - kertas soal di kiri, papan jawaban di kanan;
   - bilah bawah berisi Sebelumnya, **Daftar soal** (dikelompokkan per materi, dengan status dijawab, belum lengkap, dan ragu-ragu), **Ragu-ragu**, serta Berikutnya (di soal terakhir menjadi Kumpulkan);
   - pengatur waktu ada di header. Pada sisa 5 menit dan 1 menit muncul pemberitahuan;
   - jawaban tersimpan setiap kali berubah. Memuat ulang atau menutup aplikasi tidak menghilangkan jawaban, tetapi waktu tetap berjalan;
   - saat waktu habis, tes dikumpulkan otomatis, termasuk bila aplikasi sedang ditutup (dikumpulkan saat dibuka lagi);
   - meninggalkan tes lewat tautan meminta konfirmasi.
4. **Kumpulkan**: lembar konfirmasi menyebut soal yang belum dijawab dan yang ditandai ragu-ragu.
5. **Animasi proses data**: tiga tahap, yaitu memeriksa 21 jawaban (petak per soal), menghitung penguasaan tiap materi (batang), dan menyusun saran belajar. Ada tombol Lewati, dan animasi menghormati pengaturan hemat gerak.
6. **Hasil** (`#/tes/hasil?id=`):
   - persen keseluruhan (emas, karena merupakan hasil akhir);
   - persen per materi beserta tingkatnya dan persen percobaan sebelumnya;
   - statistik: waktu dipakai, rata-rata per soal, dijawab, dikosongkan, ragu-ragu (dan berapa yang tepat), yakin tetapi tidak tepat (petunjuk salah konsep), hasil per bentuk soal, dan materi dengan waktu terlama;
   - **Yang perlu diperkuat**: materi yang lemah diurutkan dari yang paling lemah, beserta topik yang belum tepat dan tautan ke pembahasan soal TKA serta latihan serupa yang sudah dibuka;
   - grafik perkembangan bila sudah ada dua percobaan atau lebih;
   - rincian jawaban: setiap soal dengan jawaban siswa, kunci, dan pembahasan singkat;
   - aksi: Coba lagi dengan soal baru, Simpan PDF / cetak (lembar A4 ringkas), Riwayat tes, Beranda.
7. **Riwayat** (`#/tes/riwayat`): percobaan dikelompokkan per peserta (nama dan sekolah), dengan batang mini per materi. Riwayat bisa dihapus setelah konfirmasi.

## Bank soal (`app/src/tes/bank.ts`)

Ada 21 cetakan soal. Setiap cetakan membuat soal baru dari benih dengan parameter acak dalam rentang di bawah ini. Pengecoh diambil dari kesalahan umum siswa.

| Cetakan | Materi (soal TKA terkait) | Bentuk | Isi | Pengecoh utama |
|---|---|---|---|---|
| m1 | Matriks (1) | pilih satu | Invers matriks 2×2 dengan determinan 1 | tanda tidak diubah, diagonal tidak ditukar, semua tanda terbalik, transpos |
| m2 | Matriks (2, 3) | pilih satu | Harga buku dan pensil dari persamaan matriks $AX=B$ | nilai tertukar, nilai yang hanya memenuhi satu persamaan |
| m3 | Matriks (3, 4) | Benar/Salah | Pendapatan dua kantin $QH$ | pasangan baris–kolom tertukar, perbandingan, batas total |
| p1 | Polinomial (6) | pilih satu | Sisa pembagian oleh $(x-k)$ | $f(-k)$, hanya konstanta, lupa konstanta, $f(1)$ |
| p2 | Polinomial (5) | pilih semua | Titik potong sumbu X; satu faktor diberikan | lawan tanda akar, titik potong sumbu Y |
| p3 | Polinomial (7) | pilih satu | $n\cdot V(T)$ dengan koefisien desimal | hanya sebagian suku dikali, salah letak koma |
| f1 | Fungsi (9, 10) | pilih satu | Nilai $a\cdot 2^{t/p}$ | dianggap bertambah tetap, pangkat kurang/lebih satu, lupa $a$ |
| f2 | Fungsi (9) | Benar/Salah | Interpretasi $a\cdot m^{t/p}$ | "menjadi $p$ kali" (jebakan soal 9), populasi awal salah, pertumbuhan linear |
| f3 | Fungsi (11) | pilih satu | Model $h(t)=a+b\cos\left(\frac{\pi}{6}t\right)$: nilai pada pukul tertentu, tertinggi, terendah | $a\pm b$, $a$, $b$, $a\pm 2b$ |
| l1 | Lingkaran (15) | pilih satu | Pusat dan jari-jari dari bentuk umum | tanda pusat, $r^2$ dianggap $r$, $x$–$y$ tertukar, tanda $C$ |
| l2 | Lingkaran (15, 16) | pilih satu | Persamaan dari pusat dan satu titik | tanda, ruas kanan $r$ bukan $r^2$, pusat di titik yang dilalui |
| l3 | Lingkaran (17, 18) | Benar/Salah | Keliling, luas, dan sisa bingkai persegi ($\pi=\frac{22}{7}$ atau $3{,}14$) | setengah keliling, memakai diameter, mengurangkan keliling |
| t1 | Transformasi (19) | pilih satu | Translasi lalu pencerminan (sumbu X, sumbu Y, $y=x$, $y=-x$) | urutan tertukar, aturan cermin lain |
| t2 | Transformasi (20) | pilih satu | Dilatasi $[O,k]$ lingkaran | jari-jari tetap, $r^2$ dikali $k$, pusat tetap |
| t3 | Transformasi (21) | pilih semua | Titik pada bayangan garis setelah rotasi 90° berlawanan arah jarum jam berpusat $O$ | rotasi searah jarum jam, titik asal, pencerminan |
| v1 | Vektor (12) | pilih satu | Panjang vektor 3D (kuadrupel Pythagoras) | jumlah komponen, lupa akar, lupa satu komponen |
| v2 | Vektor (13) | pilih satu | Titik $B$ dari $A$ dan $\vec{AB}$ | $A-\vec{AB}$, $\vec{AB}-A$, tanda satu komponen |
| v3 | Vektor (14) | pilih semua | Pasangan titik dengan jarak kurang dari $d$ | jarak tepat $d$ (bukan "kurang dari") |
| li1 | Limit (22) | pilih satu | Limit $\frac{0}{0}$ dengan pemfaktoran | 0 (substitusi langsung), tanda tertukar |
| li2 | Limit (23) | pilih satu | Limit di tak hingga, pangkat sama | perbandingan konstanta/suku lain, $0$, $\infty$, terbalik |
| li3 | Limit (25) | pilih satu | $\lim_{x\to0}$ bentuk $\sin$ dan $\tan$ | terbalik, dikali, $0$, $1$ |

**Uji** (`app/tests/unit/tes-bank.test.ts`): setiap cetakan diuji dengan 1.000 benih.
- Pilihan tidak ada yang sama.
- Pilih satu memiliki tepat satu kunci, pilih semua memiliki 2–3 kunci, dan Benar/Salah memiliki campuran kedua jawaban.
- Kunci diperiksa oracle independen, yaitu dihitung ulang dengan cara lain: perkalian matriks, pembagian bersusun, hitung numerik limit, matriks transformasi, dan jarak numerik.
- Semua rumus dapat dirender KaTeX.

Penilaian dan penyimpanan diuji di `tes-score.test.ts`, alur lengkap di `tests/e2e/tes.spec.ts`.

Soal tes dibuat otomatis dan bukan soal resmi TKA (sejalan dengan pernyataan sumber soal PRD §15.3).
