# Pembahasan 25 Soal TKA Matematika Tingkat Lanjut 2025 — Dokumen Acuan Konten

> **Status dokumen:** konten matematis lengkap untuk soal nomor 1–25, siap dipetakan ke template pembahasan interaktif.
> **Lokasi:** `docs/pembahasan25.md`
> **Sumber yang dipelajari (urutan baca):** `handoff/pembahasan.md` → `handoff/template-pembahasan.html` → `docs/soal25.md` → 10 aset gambar di `docs/`.
> **Catatan:** dokumen ini hanya berisi konten. Tidak ada aplikasi, CSS, JavaScript, atau gambar baru yang dibuat.

---

## Daftar isi

| No | Judul | No | Judul |
|----|-------|----|-------|
| 1 | Invers Matriks Diagonal | 14 | Kereta Api dan Koordinat 3D |
| 2 | Pakan Sapi dan Kambing | 15 | Lingkaran yang Sepusat |
| 3 | Bahan Baku Pabrik Minuman | 16 | Titik Singgung Tegak Lurus Garis f |
| 4 | Pendapatan Tiga Hotel | 17 | Cat pada Rambu Rumah Makan |
| 5 | Titik Potong dengan Sumbu X | 18 | Kerangka Kaca Patri |
| 6 | Sisa Pembagian Suku Banyak | 19 | Cermin lalu Translasi pada Garis |
| 7 | Penambahan Volume 10 Drum | 20 | Translasi lalu Dilatasi Lingkaran |
| 8 | Modal Saham | 21 | Rotasi Garis Berpusat (2, 0) |
| 9 | Populasi Kelinci | 22 | Limit Fungsi Rasional di x = 3 |
| 10 | Eceng Gondok | 23 | Limit Tak Hingga Keuntungan |
| 11 | Kedalaman Air Laut | 24 | Kerucut Es Krim dan Limit |
| 12 | Panjang Vektor 3D | 25 | Limit Trigonometri |
| 13 | Trapesium Sama Kaki | | Bagian akhir: Audit & Isu Sumber |

---

## A. Cara membaca dokumen ini

### A.1 Pemetaan ke template (ringkas dari `pembahasan.md` §2, §7, §8, §11 dan `template-pembahasan.html`)

Setiap soal dibahas dengan kerangka bagian yang sama seperti media "Saluran Irigasi":

| Bagian | Isi | Di template |
|--------|-----|-------------|
| 0 · Lobi | judul besar, ringkasan 1 kalimat, 3 fakta kunci, ilustrasi | `.lobby`, `.hero-title`, `.lede`, `dl.facts` |
| 1 · Pahami soal | stabilo kata kunci, papan *Diketahui / Ditanya* | `scene:'soal'`, `.hl[data-src]`, daftar `LK` |
| 2…n · Langkah penyelesaian | satu bagian = satu ide matematika; tiap bagian punya 2–4 langkah | `CH`, `step(ch,{cap,scene,actions,run})`, daftar `LA/LM/LV/…` |
| n+1 · Catatan lengkap | semua langkah awal–akhir dalam `aligned` | `buildNotes()` |
| n+2 · Analisis pernyataan / Cocokkan pilihan | kartu dibalik satu per satu | `CARDS`, `flipCards`, daftar `LS` |
| n+3 · Selesai | segel jawaban, ringkasan `LR`, pop-up SELESAI | `openDone()` |

Kunci istilah yang dipakai berulang di bawah:

- **Pop-up (`cap`)**: teks singkat, maksimal 2 kalimat, boleh `$LaTeX$`.
- **Papan**: judul papan (`B.chapter`), *pins* (hasil sebelumnya), lalu **baris** (`B.to`).
- **Baris papan**: satu baris = satu langkah aljabar. Kolom tabel baris:
  `id` · `Baris` (LaTeX, token dipisah spasi; pecahan ditulis `\frac{}{}` = token `F`) · `Terbang dari` (sumber tiap token) · `Keterangan` (catatan kecil di kanan) · `Kotak` (`navy` = hasil antara, `gold` = jawaban/hasil akhir).
- **Terbang dari**: `token←@nama` = elemen halaman ber-`data-src="nama"` (stabilo, label gambar, sel tabel); `token←idBaris` = token pada baris sebelumnya atau *pin*. Token tanpa sumber **ditulis dengan efek kapur**.
- **B.ask**: pertanyaan cepat di kaki papan. Setiap pilihan salah punya **petunjuk khusus** (sesuai `pembahasan.md` §11 dan checklist §17).
- **Kartu**: `Pernyataan` · `Stempel` (BENAR emas / SALAH merah) · `Rumus singkat (c)` · `Alasan/jebakan (w)`.
- **Warna bermakna** (`pembahasan.md` §4): **merah** = kendala, kesalahan, jebakan; **biru** = variabel/hasil antara; **emas hanya untuk jawaban benar dan hasil akhir**. Emas tidak dipakai sebagai hiasan.
- **Notasi angka**: dalam KaTeX ditulis tanpa pemisah ribuan (`1200`), desimal memakai `0{,}05`. Dalam teks biasa memakai format Indonesia (`1.200`, `0,05`).
- **Id** baris/token berlaku **di dalam satu soal** (tiap soal berdiri sendiri).
- **Status verifikasi**: `VALID` atau `PERLU VERIFIKASI SUMBER` (dipakai di tabel audit).

### A.2 Catatan adaptasi template (perbedaan yang ditemukan, file rujukan tidak diubah)

1. **Path template.** `pembahasan.md` menyebut salinan template di `template/template-pembahasan.html`; berkas yang ada berada di `handoff/template-pembahasan.html`. Isinya sama dengan yang dirujuk dokumen.
2. **Jumlah kartu.** Template menyiapkan tepat **4 kartu** (grid 2×2) untuk satu soal. Soal 2025 memakai 3 butir (soal 8, 9, 18), 4 butir, atau 5 butir (soal 4, 5, 14, 16, 17, 21, 24, dan pilihan A–E). Grid `.p-cards`, `CARDS`, dan daftar `LS` perlu disesuaikan (misalnya 3 kolom untuk 5 kartu).
3. **Bagian "Cocokkan dengan pilihan (A–E)".** `pembahasan.md` §2 menyebutnya untuk soal pilihan ganda biasa, tetapi template tidak memuat kodenya. Dokumen ini menulisnya dalam bentuk **kartu A–E** (pola yang sama dengan kartu pernyataan) atau `B.ask(..., {letters:true,col:true})` untuk memilih jawaban akhir.
4. **Visual 2D.** Template hanya memuat mesin 3D (`C3`) dan satu grafik modal (`G6`). `pembahasan.md` §10 menyatakan kode diagram SVG ("Section") tidak ikut. Karena itu bagian **Visual** pada tiap soal ditulis sebagai arahan deskriptif (apa yang digambar, disorot, digerakkan) dan dikaitkan dengan playbook §15; nama properti baru **tidak** dikarang.
5. **Pustaka `lucide@latest`.** Template memuat Lucide tanpa versi terpaku. Pada tahap pembangunan sebaiknya diberi versi tetap.
6. **Satu soal = satu rangkaian `CH/STEPS/PIN/L*`.** Aplikasi berikutnya boleh memuat 25 rangkaian itu dalam satu SPA; urutan bagian pada setiap soal di dokumen ini sudah sejajar dengan `CH`.

### A.3 Aturan akurasi yang dipegang

- Semua angka berasal dari `docs/soal25.md` atau gambar di `docs/`; hasil dihitung sendiri lalu diperiksa dengan substitusi balik atau metode kedua.
- Soal multi-jawaban dan tabel benar/salah dibahas **butir demi butir**.
- Ketidakjelasan sumber **tidak** diperbaiki diam-diam; semuanya dicatat di soal terkait dan di bagian **Isu sumber** pada akhir dokumen.

---

## SOAL 1 — Invers Matriks Diagonal

| Atribut | Isi |
|---|---|
| Topik | Matriks: determinan dan invers matriks 2×2 |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **E** — $\begin{pmatrix} \frac{1}{2} & 0 \\ 0 & 2 \end{pmatrix}$ |
| Status | VALID |
| Visual utama | Papan tulis + grid matriks (playbook §15: Matriks/SPL) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Matriks
- **Judul hero:** baris 1 `Pembahasan Soal` / baris 2 `Invers` + aksen `Matriks` / sub `Diagonal`
- **Lede:** Matriks $F$ hanya punya dua angka di diagonal. Kita cari matriks yang jika dikalikan dengan $F$ menghasilkan matriks identitas.
- **Fakta kunci:** Ordo → `2 × 2` · Elemen diagonal → `2 dan 1/2` · Dicari → `F⁻¹`
- **Ilustrasi lobi:** dua kotak matriks ($F$ dan kotak kosong "?") tergambar sendiri; di antaranya tanda kali, lalu muncul matriks identitas $I$.

### Bagian 1 — Pahami soal
- **Stabilo:** `matriks F` (merah, `@s-F`), `Invers` (emas, `@s-inv`).
- **Langkah 1.1** — pop-up: "Baca soalnya dulu. Santai, belum perlu menghitung apa pun." Kertas soal tampil, belum ada stabilo.
- **Langkah 1.2** — pop-up: "Yang **diketahui**: matriks $F$ berukuran 2×2." Stabilo merah pada $F$; elemen matriks terbang ke papan.
- **Langkah 1.3** — pop-up: "Yang **ditanya**: invers $F$, yaitu matriks yang jika dikali $F$ menghasilkan $I$." Stabilo emas pada kata *Invers*.

Papan "Diketahui & ditanya" (`LK`):

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | $F = \begin{pmatrix} 2 & 0 \\ 0 & \frac{1}{2} \end{pmatrix}$ | seluruh matriks←`@s-F` | matriks diagonal | — |
| k3 | **Ditanya** (label) $F^{-1}$ | $F^{-1}$←`@s-inv` | invers matriks $F$ | — |

### Bagian 2 — Menghitung invers dengan rumus
**Prasyarat konsep:** untuk $A=\begin{pmatrix}a&b\\c&d\end{pmatrix}$ berlaku $A^{-1}=\dfrac{1}{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}$, asalkan determinan $ad-bc\neq 0$. Invers $A^{-1}$ memenuhi $AA^{-1}=I$.

#### Langkah 2.1 — Determinan
- **Pop-up:** "Rumus invers membutuhkan determinan. Hitung $ad-bc$ dari $F$."
- **Visual:** matriks $F$ dengan diagonal utama ($a$ dan $d$) disorot biru, diagonal samping ($b$ dan $c$) disorot merah.
- **Papan:** judul "Determinan $F$"; pin: $F$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $\det F = ad - bc$ | — (kapur) | rumus determinan 2×2 | — |
| a2 | $\det F = 2\cdot\frac{1}{2} - 0\cdot 0$ | $2$←`@Fa`, $\frac12$←`@Fd`, $0$←`@Fb`, $0$←`@Fc` | masukkan elemen $F$ | — |
| a3 | $\det F = 1 - 0$ | — | $2\cdot\frac12=1$ | — |
| a4 | $\det F = 1$ | — | tidak nol, jadi $F$ punya invers | `navy` |

- **Pertanyaan cepat** (muncul sebelum a3 ditulis): "Berapa $2\cdot\frac{1}{2}-0\cdot0$?"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $1$ | ya | — |
| $2$ | tidak | Itu hanya elemen $a$. Determinan adalah $ad-bc$, jadi $a$ harus dikali $d=\frac12$. |
| $\frac{1}{2}$ | tidak | Itu hanya elemen $d$. Kalikan $a=2$ dengan $d=\frac12$. |
| $0$ | tidak | Nol adalah hasil $bc$. Kurangkan $bc$ dari $ad$, bukan sebaliknya. |

#### Langkah 2.2 — Matriks pendamping (adjoin)
- **Pop-up:** "Tukar posisi $a$ dan $d$, lalu ubah tanda $b$ dan $c$."
- **Visual:** animasi dua elemen diagonal bertukar tempat (2 ↔ ½); elemen $0$ di diagonal samping diberi tanda minus lalu tetap $0$.
- **Papan** (judul sama, pin: $\det F=1$):

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$ | — | pola adjoin | — |
| b2 | $\begin{pmatrix} \frac{1}{2} & -0 \\ -0 & 2 \end{pmatrix}$ | $\frac12$←`a2` (d), $2$←`a2` (a) | $-0=0$ | — |
| b3 | $\begin{pmatrix} \frac{1}{2} & 0 \\ 0 & 2 \end{pmatrix}$ | — | tanda minus pada nol tidak berpengaruh | `navy` |

#### Langkah 2.3 — Invers
- **Pop-up:** "Kalikan adjoin dengan $\frac{1}{\det F}=\frac{1}{1}$. Hasilnya langsung invers $F$."
- **Papan:**

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $F^{-1} = \dfrac{1}{\det F}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$ | $\det F$←`a4` | rumus invers | — |
| c2 | $F^{-1} = \dfrac{1}{1}\begin{pmatrix} \frac{1}{2} & 0 \\ 0 & 2 \end{pmatrix}$ | matriks←`b3` | masukkan hasil sebelumnya | — |
| c3 | $F^{-1} = \begin{pmatrix} \frac{1}{2} & 0 \\ 0 & 2 \end{pmatrix}$ | — | dikali $1$ tidak mengubah apa pun | `gold` |

- **Sorotan akhir:** elemen diagonal $F$ (2 dan ½) dan $F^{-1}$ (½ dan 2) ditampilkan berdampingan; panah menunjukkan "tiap elemen diagonal diganti kebalikannya".

### Bagian 3 — Periksa dengan perkalian (opsional, tombol Ya/Tidak)
- **Pop-up:** "Mau memeriksa hasilnya dengan perkalian $FF^{-1}$?" Tombol **[Ya, periksa]** **[Tidak, lanjut saja]**.
- **Papan:** judul "Pemeriksaan"; pin: $F^{-1}$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| p1 | $FF^{-1} = \begin{pmatrix} 2 & 0 \\ 0 & \frac12 \end{pmatrix}\begin{pmatrix} \frac12 & 0 \\ 0 & 2 \end{pmatrix}$ | $F$←`k2`, $F^{-1}$←`c3` | — | — |
| p2 | $FF^{-1} = \begin{pmatrix} 2\cdot\frac12 & 0 \\ 0 & \frac12\cdot 2 \end{pmatrix}$ | — | baris × kolom | — |
| p3 | $FF^{-1} = \begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} = I$ | — | terbukti | `navy` |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}\det F&=2\cdot\tfrac12-0\cdot0=1\\F^{-1}&=\frac{1}{1}\begin{pmatrix}\frac12&-0\\-0&2\end{pmatrix}=\begin{pmatrix}\frac12&0\\0&2\end{pmatrix}\\FF^{-1}&=\begin{pmatrix}1&0\\0&1\end{pmatrix}=I\end{aligned}$$
Alasan singkat: invers matriks diagonal adalah matriks diagonal dengan elemen kebalikan.

### Bagian 5 — Cocokkan dengan pilihan (kartu A–E)
Pin: $F^{-1}=\begin{pmatrix}\frac12&0\\0&2\end{pmatrix}$. Setiap kartu diuji dengan $F\cdot(\text{pilihan})$.

| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| A | $\begin{pmatrix}1&0\\0&2\end{pmatrix}$ | SALAH | $F\cdot A=\begin{pmatrix}2&0\\0&1\end{pmatrix}\neq I$ | Hanya elemen $d$ yang dibalik; elemen $a$ seharusnya $\frac12$. |
| B | $\begin{pmatrix}-1&0\\0&-2\end{pmatrix}$ | SALAH | $F\cdot B=\begin{pmatrix}-2&0\\0&-1\end{pmatrix}\neq I$ | Jebakan: mengira invers = lawan (dinegatifkan). Itu invers penjumlahan, bukan invers perkalian. |
| C | $\begin{pmatrix}2&0\\0&1\end{pmatrix}$ | SALAH | $F\cdot C=\begin{pmatrix}4&0\\0&\frac12\end{pmatrix}\neq I$ | Ini bukan hasil rumus; elemen $2$ tidak berubah. |
| D | $\begin{pmatrix}-\frac12&0\\0&-2\end{pmatrix}$ | SALAH | $F\cdot D=\begin{pmatrix}-1&0\\0&-1\end{pmatrix}=-I$ | Angkanya benar tetapi tandanya salah; hasilnya $-I$, bukan $I$. |
| E | $\begin{pmatrix}\frac12&0\\0&2\end{pmatrix}$ | BENAR | $F\cdot E=I$ | Kebalikan tiap elemen diagonal. |

*Revisi alur oleh pemilik materi (21 Okt 2026; kunci tidak berubah), dipakai di `app/src/content/soal/q01.ts`. Menggantikan blok "Ditambahkan M2" sebelumnya.*

Alur ini mengikuti cara Pak Penta membahas soal di kelas:
1. Kenali matriksnya: ordo $2\times2$, matriks diagonal.
2. Pakai cara cepat untuk matriks diagonal.
3. Lihat contoh lain.
4. Tegaskan bahwa cara cepat hanya berlaku untuk matriks diagonal.
5. Uji dengan rumus umum, hasilnya harus sama.
6. Cocokkan dengan pilihan.

Tata letak: **panggung penuh dua kolom** (PRD v1.5, menggantikan susunan atas–bawah v1.4). Kiri: pop-up guru di atas visual; kanan: papan kapur dengan baris rumus. Semua muat tanpa gulir. Pertanyaan cepat tampil sebagai pop-up di tengah panggung. Isi langkah dan kunci tidak berubah.

- **Bagian 1 — Pahami soal**
  - 1.1 "Perhatikan matriks $F$ ini. Ordonya $2\times2$: dua baris dan dua kolom." Baris: Diketahui $F$ (`@s-F`), ordo $2\times2$.
  - 1.2 "Elemen di luar diagonal utama semuanya $0$, jadi $F$ adalah **matriks diagonal**. Yang ditanya: inversnya, $F^{-1}$." Baris: jenis matriks diagonal, Ditanya $F^{-1}$ (`@s-inv`).
- **Bagian 2 — Cara cepat matriks diagonal**
  - 2.1 "Tahukah kalian? Untuk matriks diagonal ordo berapa pun, inversnya bisa dicari dengan cara cepat ini."
    - Baris q1: $\begin{pmatrix}a&0\0&d\end{pmatrix}^{-1}=\begin{pmatrix}\frac1a&0\0&\frac1d\end{pmatrix}$ (navy).
  - 2.2 "Caranya: tukar posisi pembilang dan penyebut elemen $a$ dan $d$. Perhatikan animasinya, cepat bukan?"
    - Adegan: elemen diagonal ditulis sebagai pecahan ($2=\frac21$). Pada $F^{-1}$, pembilang turun dan penyebut naik.
    - Baris c1 $2=\frac21\to\frac12$ (`@Fa`), c2 $\frac12\to\frac21=2$ (`@Fd`), c3 $F^{-1}=\begin{pmatrix}\frac12&0\0&2\end{pmatrix}$ (emas).
    - Pertanyaan cepat sebelum c1: "Elemen $2$ ditulis $\frac21$. Setelah pembilang dan penyebutnya ditukar, menjadi…"
      - $\frac12$ benar.
      - $-2$: "Itu lawan dari $2$ (invers penjumlahan). Yang dicari invers perkalian."
      - $2$: "Itu belum ditukar. Pembilang $2$ pindah ke bawah, penyebut $1$ naik ke atas."
  - 2.3 "Contoh lain: matriks diagonal berikut juga cukup dibalik elemen diagonalnya."
    - Baris e1: $\begin{pmatrix}4&0\0&\frac13\end{pmatrix}^{-1}=\begin{pmatrix}\frac14&0\0&3\end{pmatrix}$.
  - 2.4 "Ordo $3\times3$ pun sama, tiap elemen diagonal dibalik dan tandanya tetap. Mau tahu kenapa bisa begitu?"
    - Baris e2: $\operatorname{diag}(3,-2,\frac15)^{-1}=\operatorname{diag}(\frac13,-\frac12,5)$.
    - Contoh e1 dan e2 diminta pemilik ("berikut contoh lainnya").
    - Konten opsional **"Ya, tunjukkan alasannya" / "Tidak, lanjut saja"**:
      - $\begin{pmatrix}a&0\0&d\end{pmatrix}\begin{pmatrix}\frac1a&0\0&\frac1d\end{pmatrix}=I$;
      - lewat rumus umum $\frac1{ad}\begin{pmatrix}d&0\0&a\end{pmatrix}=\begin{pmatrix}\frac1a&0\0&\frac1d\end{pmatrix}$ (syarat $a,d\ne0$);
      - pada soal, $FF^{-1}=I$ (menggantikan Bagian 3 opsional lama).
- **Bagian 3 — Uji dengan rumus umum**
  - 3.1 "Ingat, cara cepat ini hanya berlaku untuk matriks diagonal. Untuk matriks lain, pakai rumus umum invers $2\times2$."
    - Baris g1: $A^{-1}=\frac{1}{ad-bc}\begin{pmatrix}d&-b\-c&a\end{pmatrix}$.
  - 3.2 "Mari kita uji pada $F$, hasilnya harus sama. Pertama, hitung determinannya: $ad-bc$."
    - Baris g2 $\det F=2\cdot\frac12-0\cdot0$, g3 $\det F=1$.
    - Pertanyaan cepat lama ("Berapa $2\cdot\frac12-0\cdot0$?") muncul sebelum g3.
  - 3.3 "Tukar $a$ dan $d$, beri tanda minus pada $b$ dan $c$, lalu bagi dengan $\det F=1$. Hasilnya sama dengan cara cepat."
    - Adegan: $a\leftrightarrow d$ bertukar posisi dan tanda minus muncul.
    - Baris g4: $F^{-1}=\frac11\begin{pmatrix}\frac12&-0\-0&2\end{pmatrix}=\begin{pmatrix}\frac12&0\0&2\end{pmatrix}$ (navy).
- **Bagian 4 — Catatan lengkap.**
- **Bagian 5 — Cocokkan dengan pilihan**
  - Satu langkah: kelima kartu dibuka bersama dengan stempelnya. Papan memuat jawaban E.
  - Pertanyaan berhuruf A–E dengan petunjuk dari kolom alasan.
  - Pop-up: "Cocokkan dengan pilihan: hanya E yang sama dengan $F^{-1}$. Pilih jawabannya di bawah."
- **Ringkasan `LR`:** cara cepat $a\to\frac1a,\ d\to\frac1d$ (khusus matriks diagonal, navy) · $F^{-1}$ (emas) · **Jawaban E** (emas).

*Latihan serupa (PRD v1.6), dipakai di `app/src/practice/gen01.ts`. Kunci soal asli tidak berubah.*

- **Mudah:** $F=\operatorname{diag}(p,q)$ dengan $p,q\in\{2,3,4,5,\frac12,\frac13,\frac23,\frac32\}$, $p\ne q$, $pq\ne1$ (soal asli tidak muncul). Cara cepat: balik tiap elemen diagonal.
- **Sedang:** $\begin{pmatrix}a&b\\0&d\end{pmatrix}$ dengan $a,d\in\{\pm1,\pm2,\frac12\}$, $b\in\{\pm1,\pm2,\pm3\}$. Cara cepat tidak berlaku; pakai rumus umum.
- **Menantang:** $\begin{pmatrix}a&b\\c&d\end{pmatrix}$ dengan entri bulat $[-4,4]$, $b,c\ne0$, $\det\in\{\pm1,\pm2,\pm5\}$.
- **Jebakan distraktor** (dari "Kesalahan umum" dan kartu analisis):
  - lawan ($-F$) dan tanda ($-F^{-1}$);
  - hanya sebagian elemen dibalik;
  - elemen tidak dibalik;
  - lupa dibagi determinan (adjoin saja);
  - adjoin tanpa tanda minus;
  - $a$ dan $d$ tidak ditukar;
  - "balik tiap elemen" pada matriks bukan diagonal;
  - transpos.
- **Petunjuk:** konsep → langkah pertama → arah.
- **Penyelesaian di papan:** kenali matriks → cara cepat atau rumus umum (determinan, adjoin, bagi determinan) → uji $F\cdot F^{-1}=I$.

### Bagian 6 — Selesai
- **Segel:** **E**
- **Pop-up:** "Invers $F$ adalah $\begin{pmatrix}\frac12&0\\0&2\end{pmatrix}$. Elemen diagonalnya dibalik: $2\to\frac12$ dan $\frac12\to2$."
- **Ringkasan papan (`LR`):** cara cepat $a\to\frac1a,\ d\to\frac1d$ (navy, *revisi alur 21 Okt*) · $F^{-1}=\begin{pmatrix}\frac12&0\\0&2\end{pmatrix}$ (emas) · **Jawaban E** (emas).

### Pemeriksaan hasil
Substitusi balik: $FF^{-1}=I$ (lihat Bagian 3). Metode kedua: matriks diagonal $\mathrm{diag}(p,q)$ memiliki invers $\mathrm{diag}(1/p,\,1/q)$, yaitu $\mathrm{diag}(\frac12,\,2)$. Kedua metode cocok dengan opsi E saja.

### Kesalahan umum / poin perhatian
- Menganggap invers = lawan (negatif). Pada perkalian, invers menghasilkan $I$, bukan matriks nol.
- Lupa membagi dengan determinan. Di soal ini determinannya 1, tetapi pada matriks lain faktor $\frac{1}{\det}$ menentukan hasil.
- Menukar posisi $a$ dan $d$ tanpa mengubah tanda $b$ dan $c$ (di sini tidak terlihat karena $b=c=0$).

---

## SOAL 2 — Pakan Sapi dan Kambing

| Atribut | Isi |
|---|---|
| Topik | Matriks: sistem persamaan linear dua variabel dan invers matriks |
| Jenis respons | Pilihan tunggal (A–E); tiap opsi berisi **perkalian matriks beserta hasilnya** |
| Jawaban akhir | **E** — $\begin{pmatrix}-\frac15&\frac15\\2&-1\end{pmatrix}\begin{pmatrix}19\\34\end{pmatrix}=\begin{pmatrix}3\\4\end{pmatrix}$ (3 sapi, 4 kambing) |
| Status | VALID |
| Visual utama | Gambar sumber + papan (playbook §15: Cerita aritmetika dan Matriks/SPL) |
| Aset gambar | `./sapi_dan_kambing.png` |

**Data dibaca dari gambar `sapi_dan_kambing.png`:** Sapi: rumput gajah **10 kg**, rumput gamal **10 kg**. Kambing: rumput gajah **2 kg**, rumput gamal **1 kg**. Cocok dengan tabel di `soal25.md`.

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Matriks dan SPL
- **Judul hero:** `Pembahasan Soal` / `Sistem` + aksen `Persamaan` / sub `Pakan Ternak`
- **Lede:** Pak Andi menyediakan 38 kg rumput gajah dan 34 kg rumput gamal untuk sapi dan kambingnya, tanpa sisa. Berapa ekor sapi dan kambing yang ia pelihara?
- **Fakta kunci:** Rumput gajah → `38 kg` · Rumput gamal → `34 kg` · Dicari → `(x, y)`
- **Ilustrasi lobi:** gambar sapi dan kambing (dari aset sumber) dengan dua tumpuk rumput; angka kebutuhan muncul di bawah masing-masing hewan.

### Bagian 1 — Pahami soal
- **Stabilo:** `38 kg rumput gajah` (merah, `@s-gajah`), `34 kg rumput gamal` (merah, `@s-gamal`), `tanpa sisa` (biru, `@s-tanpa`), `$x$ sapi, $y$ kambing` (biru, `@s-xy`), `$\begin{pmatrix}x\\y\end{pmatrix}$` (emas, `@s-tanya`). Selain itu sel tabel kebutuhan pakan diberi `data-src`: `@sg` (sapi gajah 10), `@sm` (sapi gamal 10), `@kg` (kambing gajah 2), `@km` (kambing gamal 1).
- **Langkah 1.1** — pop-up: "Baca soal dan lihat tabel kebutuhan pakan tiap hewan."
- **Langkah 1.2** — pop-up: "Catat **jumlah pakan** yang tersedia dan kebutuhan per ekor."
- **Langkah 1.3** — pop-up: "Yang **ditanya** adalah $\begin{pmatrix}x\\y\end{pmatrix}$. Pilihan jawaban berbentuk perkalian matriks, jadi kita susun persamaan matriksnya."

Papan "Diketahui & ditanya":

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | gajah: sapi $10$, kambing $2$, total $38$ | $10$←`@sg`, $2$←`@kg`, $38$←`@s-gajah` | kg per ekor dan total | — |
| k3 | gamal: sapi $10$, kambing $1$, total $34$ | $10$←`@sm`, $1$←`@km`, $34$←`@s-gamal` | kg per ekor dan total | — |
| k4 | **Ditanya** (label) $\begin{pmatrix}x\\y\end{pmatrix}$ | `@s-tanya` | $x$ = sapi, $y$ = kambing | — |

### Bagian 2 — Menyusun persamaan
**Prasyarat konsep:** total pakan = (pakan per ekor sapi × jumlah sapi) + (pakan per ekor kambing × jumlah kambing).

#### Langkah 2.1 — Dua persamaan
- **Pop-up:** "Setiap jenis rumput menghasilkan satu persamaan. Mulai dari rumput gajah."
- **Visual:** gambar sumber di panel kiri; baris "Rumput Gajah 10 kg" dan "2 kg" berpendar ketika angkanya terbang ke papan.
- **Papan:** judul "Persamaan pakan".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| e1 | $10x + 2y = 38$ | $10$←`@sg`, $x$←`@s-xy`, $2$←`@kg`, $y$←`@s-xy`, $38$←`@s-gajah` | rumput gajah | — |
| e2 | $10x + 1y = 34$ | $10$←`@sm`, $1$←`@km`, $34$←`@s-gamal` | rumput gamal | — |

- **Pertanyaan cepat** (sebelum e1): "Untuk $x$ sapi dan $y$ kambing, total rumput gajah adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $10x+2y=38$ | ya | — |
| $2x+10y=38$ | tidak | Angkanya tertukar. Sapi memakan $10$ kg gajah per ekor, jadi $x$ dikali $10$. |
| $10x+y=38$ | tidak | Itu persamaan untuk rumput gamal. Kambing memakan $2$ kg gajah. |
| $x+y=38$ | tidak | Kamu menghitung jumlah hewan. Yang dijumlahkan adalah kilogram pakannya. |

#### Langkah 2.2 — Bentuk matriks
- **Pop-up:** "Koefisien $x$ dan $y$ disusun menjadi matriks. Baris pertama untuk gajah, baris kedua untuk gamal."
- **Visual:** koefisien $10,2,10,1$ terbang dari persamaan ke slot matriks; vektor $(x,y)$ dan $(38,34)$ menyusul.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| m1 | $\begin{pmatrix}10&2\\10&1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}38\\34\end{pmatrix}$ | koefisien←`e1`, `e2`; ruas kanan←`e1`, `e2` | urutan: gajah di atas, gamal di bawah | `navy` |
| m2 | $M\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}38\\34\end{pmatrix}$ | $M$←`m1` | beri nama $M$ | — |

### Bagian 3 — Menyelesaikan dengan invers
**Prasyarat konsep:** $M\mathbf v=\mathbf b \Rightarrow \mathbf v=M^{-1}\mathbf b$.

#### Langkah 3.1 — Invers $M$
- **Pop-up:** "Cari determinan, lalu bentuk invers $M$."
- **Papan:** judul "Invers matriks"; pin: $M=\begin{pmatrix}10&2\\10&1\end{pmatrix}$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| i1 | $\det M = 10\cdot1 - 2\cdot10$ | semua elemen←pin $M$ | $ad-bc$ | — |
| i2 | $\det M = 10 - 20 = -10$ | — | tidak nol | `navy` |
| i3 | $M^{-1}=\dfrac{1}{-10}\begin{pmatrix}1&-2\\-10&10\end{pmatrix}$ | $-10$←`i2` | tukar $a,d$; ubah tanda $b,c$ | — |
| i4 | $M^{-1}=\begin{pmatrix}-\frac{1}{10}&\frac{2}{10}\\1&-1\end{pmatrix}$ | — | setiap elemen dibagi $-10$ | `navy` |

- **Pertanyaan cepat** (sebelum i2): "Berapa $\det M$?"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $-10$ | ya | — |
| $10$ | tidak | $10\cdot1=10$ memang benar, tetapi masih harus dikurangi $2\cdot10=20$. |
| $20$ | tidak | Determinan = $ad-bc$, jadi $bc=20$ dikurangkan, bukan dijadikan hasil. |
| $0$ | tidak | Baris pertama dan kedua tidak sebanding ($10:2\neq10:1$), jadi determinannya tidak nol. |

#### Langkah 3.2 — Kalikan dengan ruas kanan
- **Pop-up:** "Kalikan $M^{-1}$ dengan $\begin{pmatrix}38\\34\end{pmatrix}$. Urutan vektornya: gajah dulu, baru gamal."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| s1 | $\begin{pmatrix}x\\y\end{pmatrix}=M^{-1}\begin{pmatrix}38\\34\end{pmatrix}$ | $M^{-1}$←`i4`, vektor←`m1` | — | — |
| s2 | $x = -\frac{1}{10}(38)+\frac{2}{10}(34)$ | $38$, $34$←`m1` | baris 1 × kolom | — |
| s3 | $x = -3{,}8+6{,}8=3$ | — | — | `gold` |
| s4 | $y = 1(38)-1(34)=4$ | — | baris 2 × kolom | `gold` |
| s5 | $\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}3\\4\end{pmatrix}$ | $3$←`s3`, $4$←`s4` | 3 sapi, 4 kambing | `gold` |

- **Sorotan:** gambar sapi menampilkan angka 3 dan kambing angka 4 (emas) setelah `s5`.

### Bagian 4 — Catatan lengkap
$$\begin{aligned}10x+2y&=38\\10x+y&=34\end{aligned}\qquad\begin{pmatrix}10&2\\10&1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}38\\34\end{pmatrix}$$
$$\begin{aligned}\det M&=10-20=-10\\M^{-1}&=\frac{1}{-10}\begin{pmatrix}1&-2\\-10&10\end{pmatrix}=\begin{pmatrix}-\frac1{10}&\frac2{10}\\1&-1\end{pmatrix}\\\begin{pmatrix}x\\y\end{pmatrix}&=\begin{pmatrix}-\frac1{10}&\frac2{10}\\1&-1\end{pmatrix}\begin{pmatrix}38\\34\end{pmatrix}=\begin{pmatrix}3\\4\end{pmatrix}\end{aligned}$$

### Bagian 5 — Cocokkan dengan pilihan (kartu A–E)
**Cara menguji tiap opsi (tiga syarat):** (1) matriks harus menjadi invers dari matriks koefisien susunan kita (atau susunan yang setara), (2) vektor ruas kanan sesuai susunan itu, (3) hasil perkalian yang tertulis harus benar-benar sama dengan $(3,4)$.
Susunan setara pada opsi E: bagi persamaan gajah dengan 2 → $5x+y=19$ dan $10x+y=34$, sehingga matriks koefisien $M'=\begin{pmatrix}5&1\\10&1\end{pmatrix}$, $\det M'=-5$, $M'^{-1}=\begin{pmatrix}-\frac15&\frac15\\2&-1\end{pmatrix}$.

| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| A | $\begin{pmatrix}-1&1\\10&-5\end{pmatrix}\begin{pmatrix}19\\34\end{pmatrix}=\begin{pmatrix}15\\20\end{pmatrix}$ | SALAH | $10(15)+2(20)=190\neq38$ | Perkaliannya benar secara hitungan, tetapi matriks ini $5\times$ invers yang benar (pembagi $\det=-5$ terlewat), sehingga hasilnya $5\times(3,4)$. Hasil $(15,20)$ bukan solusi. |
| B | $\begin{pmatrix}10&-10\\-1&2\end{pmatrix}\begin{pmatrix}38\\34\end{pmatrix}=\begin{pmatrix}4\\3\end{pmatrix}$ | SALAH | hasil hitung sebenarnya $\begin{pmatrix}40\\30\end{pmatrix}$; $10(4)+2(3)=46\neq38$ | Matriks bukan invers matriks koefisien mana pun, dan hasil tertulis tidak sama dengan hasil perkalian. |
| C | $\begin{pmatrix}-\frac1{10}&\frac2{10}\\1&-1\end{pmatrix}\begin{pmatrix}34\\38\end{pmatrix}=\begin{pmatrix}4\\3\end{pmatrix}$ | SALAH | hasil hitung sebenarnya $\begin{pmatrix}4{,}2\\-4\end{pmatrix}$ | Jebakan urutan: matriks inversnya benar, tetapi vektor ruas kanan dibalik (gamal di atas gajah). Hasil tertulis juga keliru. |
| D | $\begin{pmatrix}-1&2\\10&-10\end{pmatrix}\begin{pmatrix}38\\34\end{pmatrix}=\begin{pmatrix}3\\4\end{pmatrix}$ | SALAH | hasil hitung sebenarnya $\begin{pmatrix}30\\40\end{pmatrix}$ | Matriks adalah adjoin tanpa dibagi $-10$. Angka $(3,4)$ di ruas kanan benar, tetapi perkalian di ruas kiri tidak menghasilkannya. |
| E | $\begin{pmatrix}-\frac15&\frac15\\2&-1\end{pmatrix}\begin{pmatrix}19\\34\end{pmatrix}=\begin{pmatrix}3\\4\end{pmatrix}$ | BENAR | $-\frac{19}{5}+\frac{34}{5}=3$; $38-34=4$ | Invers $M'$ yang benar, vektor sesuai, hasil perkalian cocok dan memenuhi kedua persamaan. |

*Ditambahkan M2 (20 Okt 2026; kunci tidak berubah), dipakai di `app/src/content/soal/q02.ts`:*
- **Visual Bagian 1–3:** kertas soal (gambar sumber, tabel, dan stabilo) tetap tampil, sehingga `@sg`, `@sm`, `@kg`, `@km`, `@s-gajah`, `@s-gamal`, dan `@s-xy` menjadi sumber terbang.
  - Langkah 1.1 menampilkan papan kosong. k1–k3 muncul di 1.2, k4 di 1.3.
- **Bagian 2:** m1–m2 berada di papan yang sama dengan e1–e2 ("Persamaan pakan"). Matriks koefisien m1 terbang dari e1, vektor kanan dari $38$ pada e1.
- **Bagian 3:**
  - Papan "Invers matriks" untuk i1–i4 dengan pin $M$.
  - Papan "Kalikan dengan ruas kanan" untuk s1–s5, dengan pin $M^{-1}$ dan $\mathbf b=(38,34)$.
- **Bagian 5:**
  - Langkah pembuka menampilkan papan "Susunan setara" dari paragraf *Cara menguji* di atas:
    - q1: gajah ÷ 2: $5x+y=19$;
    - q2: $M'=\begin{pmatrix}5&1\\10&1\end{pmatrix}$, $\det M'=-5$;
    - q3: $M'^{-1}$ (navy).
  - Pop-up langkah itu: "Pilihan memakai susunan setara: persamaan gajah dibagi 2. Uji matriks, vektor, dan hasil perkaliannya."
  - Pop-up per kartu diringkas dari kolom *Alasan*.
  - Papan ringkasan v1–v6 (id v karena s1–s5 sudah dipakai).
  - Pertanyaan berhuruf A–E memakai teks singkat per pilihan.
  - Pernyataan kartu ditulis dua baris (perkalian, lalu "= hasil") agar muat di kartu.
- **Belum dibuat:** sorotan angka 3 dan 4 pada gambar sapi dan kambing. Gambar sumber dipakai apa adanya.

### Bagian 6 — Selesai
- **Segel:** **E**
- **Pop-up:** "Pak Andi memelihara **3 sapi** dan **4 kambing**. Pilihan E adalah satu-satunya yang matriks, vektor, dan hasil perkaliannya konsisten."
- **Ringkasan papan (`LR`):** $x=3$ (emas) · $y=4$ (emas) · **Jawaban E** (emas).

### Pemeriksaan hasil
Substitusi balik: gajah $10(3)+2(4)=30+8=38$ ✓; gamal $10(3)+1(4)=34$ ✓. Metode kedua (eliminasi): kurangkan persamaan gamal dari gajah → $y=4$, lalu $10x=30$, $x=3$.

### Kesalahan umum / poin perhatian
- Menukar urutan baris vektor ruas kanan (opsi C).
- Memakai adjoin saja tanpa membagi dengan determinan (opsi A, D).
- Percaya angka hasil di ruas kanan opsi tanpa menghitung ulang perkaliannya.

---

## SOAL 3 — Bahan Baku Pabrik Minuman

| Atribut | Isi |
|---|---|
| Topik | Matriks: perkalian matriks dan penerapan pada kebutuhan bahan |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **C** — $k=40$ ml air per botol kunir asem |
| Status | VALID (anomali sumber diterima: total jahe dan gula merah pada naskah asli tidak cocok dengan hitungan; dikonfirmasi pemilik materi bahwa naskah asli memang demikian. Kunci C tidak terpengaruh) |
| Visual utama | Papan tulis + grid matriks (playbook §15: Matriks/SPL) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Matriks
- **Judul hero:** `Pembahasan Soal` / `Matriks` + aksen `Kebutuhan` / sub `Bahan Baku`
- **Lede:** Tiga jenis minuman, tiga bahan, satu angka yang belum diketahui: kebutuhan air untuk kunir asem. Pesanan dan total air sudah tercatat, jadi $k$ bisa dicari.
- **Fakta kunci:** Jenis minuman → `3` · Total air → `13.000 ml` · Dicari → `k`
- **Ilustrasi lobi:** tiga botol (WJ, BK, KA) mengisi tiga wadah bahan (J, GM, A); wadah air bertanda "13.000 ml".

### Bagian 1 — Pahami soal
- **Stabilo:** matriks kebutuhan per botol (biru, `@s-M`), sel `k` (merah, `@s-k`), pesanan $(100,120,80)$ (merah, `@s-order`), total air $13000$ (merah, `@s-air`), "air untuk satu botol kunir asem" (emas, `@s-tanya`). Tiap angka kolom air diberi `data-src`: `@a-wj` (50), `@a-bk` (40).
- **Langkah 1.1** — pop-up: "Baca soal. Perhatikan: **baris** matriks adalah jenis minuman, **kolom** adalah bahan."
- **Langkah 1.2** — pop-up: "Catat kebutuhan air per botol, pesanan, dan total air."
- **Langkah 1.3** — pop-up: "Ditanya: nilai $k$, yaitu air untuk satu botol kunir asem."

Papan "Diketahui & ditanya":

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | air per botol: WJ $50$, BK $40$, KA $k$ | $50$←`@a-wj`, $40$←`@a-bk`, $k$←`@s-k` | kolom A pada matriks | — |
| k3 | pesanan: WJ $100$, BK $120$, KA $80$ | $100,120,80$←`@s-order` | botol | — |
| k4 | total air $=13000$ ml | `@s-air` | — | — |
| k5 | **Ditanya** (label) $k$ | `@s-tanya` | air per botol kunir asem | — |

### Bagian 2 — Menyusun persamaan air
**Prasyarat konsep:** total satu bahan = jumlah dari (kebutuhan per botol × banyak botol) untuk tiap jenis minuman. Dalam matriks, itu perkalian kolom bahan dengan vektor pesanan (matriks transpos kali pesanan).

#### Langkah 2.1 — Orientasi matriks
- **Pop-up:** "Karena baris = minuman dan kolom = bahan, total bahan diperoleh dari **kolom** dikali pesanan."
- **Visual:** matriks kebutuhan; kolom **A** disorot biru, vektor pesanan disorot merah di sebelah kanan, setiap pasangan angka (50–100, 40–120, $k$–80) dihubungkan garis putus-putus.
- **Sorotan:** tampilkan $\begin{pmatrix}J\\GM\\A\end{pmatrix}=M^{\mathsf T}\begin{pmatrix}WJ\\BK\\KA\end{pmatrix}$ sebagai ringkasan (tidak dihitung seluruhnya).

#### Langkah 2.2 — Persamaan untuk air
- **Pop-up:** "Kalikan kebutuhan air tiap jenis dengan jumlah botolnya, lalu jumlahkan. Hasilnya harus 13.000 ml."
- **Papan:** judul "Persamaan air".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $A = 50\cdot100 + 40\cdot120 + k\cdot80$ | $50,100$←`@a-wj`,`@s-order`; $40,120$←`@a-bk`,`@s-order`; $k,80$←`@s-k`,`@s-order` | jumlah air tiap minuman | — |
| a2 | $13000 = 5000 + 4800 + 80k$ | $13000$←`@s-air` | $50\cdot100=5000$, $40\cdot120=4800$ | — |
| a3 | $13000 = 9800 + 80k$ | — | $5000+4800=9800$ | `navy` |

- **Pertanyaan cepat** (sebelum a1): "Air untuk 100 botol wedang jahe (50 ml/botol) adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $50\cdot100=5000$ ml | ya | — |
| $50+100=150$ ml | tidak | Kebutuhan per botol dikali banyak botol, bukan dijumlahkan. |
| $40\cdot100=4000$ ml | tidak | $40$ adalah air untuk beras kencur. Wedang jahe memakai $50$. |

#### Langkah 2.3 — Menyelesaikan $k$
- **Pop-up:** "Pindahkan 9.800 ke ruas kiri, lalu bagi dengan 80."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $13000 - 9800 = 80k$ | $13000$←`a3`, $9800$←`a3` | $9800$ pindah ruas → $-9800$ | — |
| b2 | $3200 = 80k$ | — | $13000-9800=3200$ | `navy` |
| b3 | $k = \dfrac{3200}{80}$ | $3200$←`b2`, $80$←`b2` | kedua ruas dibagi $80$ | — |
| b4 | $k = 40\ \text{ml}$ | — | $3200:80=40$ | `gold` |

- **Pertanyaan cepat** (sebelum b4): "Dari $80k=3200$, berapa $k$?"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $40$ | ya | — |
| $3200$ | tidak | Itu nilai $80k$, belum dibagi $80$. |
| $45$ | tidak | Hitung ulang $3200:80$; $80\times45=3600$ terlalu besar. |
| $30$ | tidak | $80\times30=2400$, terlalu kecil dari $3200$. |

- **Sorotan akhir:** angka $40$ terbang dari papan ke sel $k$ pada matriks soal (menjadi emas); opsi C dinyalakan emas pada panel pilihan.

### Bagian 3 — Catatan lengkap
$$\begin{aligned}\text{Air}&=50\cdot100+40\cdot120+k\cdot80\\13000&=5000+4800+80k\\13000&=9800+80k\\80k&=3200\\k&=40\text{ ml}\end{aligned}$$

### Bagian 4 — Cocokkan dengan pilihan (kartu A–E)
Pin: $k=40$. Setiap kartu menguji $9800+80k=13000$?

| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| A | 30 ml | SALAH | $9800+80\cdot30=12200$ | Kurang dari 13.000. |
| B | 35 ml | SALAH | $9800+80\cdot35=12600$ | Kurang dari 13.000. |
| C | 40 ml | BENAR | $9800+80\cdot40=13000$ | Tepat 13.000. |
| D | 45 ml | SALAH | $9800+80\cdot45=13400$ | Lebih dari 13.000. |
| E | 50 ml | SALAH | $9800+80\cdot50=13800$ | Jebakan: $50$ adalah kebutuhan air wedang jahe, bukan kunir asem. |

### Bagian 5 — Selesai
- **Segel:** **C**
- **Pop-up:** "Satu botol kunir asem membutuhkan **40 ml** air. Seluruh pesanan memakai 5.000 + 4.800 + 3.200 = 13.000 ml."
- **Ringkasan papan (`LR`):** $k=40$ ml (emas) · **Jawaban C** (emas).

### Pemeriksaan hasil
Substitusi balik: $50\cdot100+40\cdot120+40\cdot80=5000+4800+3200=13000$ ✓.

### Catatan sumber (untuk pengembang)
Data total **jahe** dan **gula merah** pada `soal25.md` tidak cocok dengan perhitungan dari matriks dan pesanan yang sama: $20\cdot100+10\cdot120+12\cdot80=4160$ (soal menulis 4.360) dan $15\cdot100+25\cdot120+8\cdot80=5140$ (soal menulis 4.960). Jawaban tidak terpengaruh karena hanya baris air yang memuat $k$. **Jangan menampilkan perbandingan J dan GM kepada siswa sebelum angka soal diperiksa ke naskah asli.**

### Kesalahan umum / poin perhatian
- Mengalikan baris matriks dengan pesanan (jenis minuman), padahal yang dijumlahkan adalah satu **kolom** bahan.
- Menjumlahkan alih-alih mengalikan kebutuhan per botol dengan banyak botol.
- Berhenti di $80k=3200$ tanpa membagi 80.

---

## SOAL 4 — Pendapatan Tiga Hotel

| Atribut | Isi |
|---|---|
| Topik | Aritmetika terapan / perkalian matriks (kapasitas × tarif) |
| Jenis respons | Multi-jawaban: pilih semua pernyataan yang benar (5 pernyataan) |
| Jawaban akhir | Pernyataan **(3)** dan **(5)** benar; (1), (2), (4) salah |
| Status | VALID (butir 4 punya catatan tafsir, tidak mengubah kunci) |
| Visual utama | Tabel kapasitas dari gambar + papan (playbook §15: Cerita aritmetika, Matriks/SPL) |
| Aset gambar | `./ikon_hotel.png` |

**Data dibaca dari gambar `ikon_hotel.png`** (sama dengan tabel di `soal25.md`):

| Tipe kamar | Hotel A | Hotel B | Hotel C | Harga/malam |
|------------|:-------:|:-------:|:-------:|------------:|
| Standard | 9 | 6 | 7 | Rp150.000 |
| Deluxe | 6 | 7 | 5 | Rp500.000 |
| Suite | 3 | 2 | 4 | Rp1.000.000 |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Aritmetika dan matriks
- **Judul hero:** `Pembahasan Soal` / `Pendapatan` + aksen `Hotel` / sub `Kamar Terisi Penuh`
- **Lede:** Tiga hotel, tiga tipe kamar, satu hari penuh. Hotel mana yang paling besar pendapatannya, dan berapa totalnya?
- **Fakta kunci:** Jumlah hotel → `3` · Kondisi → `kamar penuh` · Dicari → `pendapatan per hari`
- **Ilustrasi lobi:** gedung hotel dari aset sumber; tiga papan tarif muncul satu per satu.

### Bagian 1 — Pahami soal
- **Stabilo:** `semua tipe kamar terisi penuh` (biru, `@s-penuh`), `1 hari` (merah, `@s-hari`), `pendapatan` (emas, `@s-tanya`). Sel tabel gambar diberi `data-src`: `@A-std`, `@A-dlx`, `@A-ste`, `@B-…`, `@C-…`, `@h-std`, `@h-dlx`, `@h-ste`.
- **Langkah 1.1** — pop-up: "Baca soal dan tabel kapasitas. Pilih semua pernyataan yang benar."
- **Langkah 1.2** — pop-up: "Kamar terisi penuh berarti **semua kamar laku satu malam**."
- **Langkah 1.3** — pop-up: "Ditanya: pendapatan tiap hotel per hari, lalu bandingkan."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | tarif: Standard $0{,}15$, Deluxe $0{,}5$, Suite $1$ (juta rupiah) | `@h-std`, `@h-dlx`, `@h-ste` | Rp150.000 = $0{,}15$ juta | — |
| k3 | semua kamar terisi dalam 1 hari | `@s-penuh` | — | — |
| k4 | **Ditanya** (label) pendapatan $A,B,C$ dan totalnya | `@s-tanya` | — | — |

### Bagian 2 — Pendapatan tiap hotel
**Prasyarat konsep:** pendapatan hotel = jumlah (banyak kamar × tarif) untuk setiap tipe kamar. Satuan dipakai **juta rupiah** agar angkanya ringkas (1 juta = 1.000.000 rupiah).

#### Langkah 2.1 — Hotel A
- **Pop-up:** "Kalikan banyak kamar tiap tipe dengan tarifnya, lalu jumlahkan."
- **Visual:** kolom Hotel A pada tabel disorot; tiap sel terbang ke papan.
- **Papan:** judul "Pendapatan Hotel A".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $A = 9\cdot0{,}15 + 6\cdot0{,}5 + 3\cdot1$ | $9,6,3$←`@A-std`,`@A-dlx`,`@A-ste`; $0{,}15,0{,}5,1$←`@h-*` | kamar × tarif | — |
| a2 | $A = 1{,}35 + 3 + 3$ | — | $9\cdot0{,}15=1{,}35$; $6\cdot0{,}5=3$; $3\cdot1=3$ | — |
| a3 | $A = 7{,}35$ juta | — | Rp7.350.000 | `navy` |

#### Langkah 2.2 — Hotel B dan C
- **Pop-up:** "Cara yang sama untuk Hotel B dan Hotel C. Coba tebak Hotel B dulu."
- **Papan:** judul "Pendapatan Hotel B dan C"; pin: $A=7{,}35$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $B = 6\cdot0{,}15 + 7\cdot0{,}5 + 2\cdot1$ | kolom B dan tarif | — | — |
| b2 | $B = 0{,}9 + 3{,}5 + 2 = 6{,}4$ juta | — | Rp6.400.000 | `navy` |
| c1 | $C = 7\cdot0{,}15 + 5\cdot0{,}5 + 4\cdot1$ | kolom C dan tarif | — | — |
| c2 | $C = 1{,}05 + 2{,}5 + 4 = 7{,}55$ juta | — | Rp7.550.000 | `navy` |

- **Pertanyaan cepat** (sebelum b2): "Pendapatan Hotel B (6 Standard, 7 Deluxe, 2 Suite) adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| Rp6.400.000 | ya | — |
| Rp7.350.000 | tidak | Itu pendapatan Hotel A. Pakai kolom Hotel B: $6,7,2$. |
| Rp5.650.000 | tidak | Periksa lagi: 7 kamar × Rp500.000 = Rp3.500.000 dan 2 kamar × Rp1.000.000 = Rp2.000.000. |

#### Langkah 2.3 — Total
- **Pop-up:** "Jumlahkan ketiga pendapatan untuk melihat total per hari."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| t1 | $A+B+C = 7{,}35 + 6{,}4 + 7{,}55$ | `a3`, `b2`, `c2` | — | — |
| t2 | $A+B+C = 21{,}3$ juta | — | Rp21.300.000 | `navy` |

### Bagian 3 — Catatan lengkap
$$\begin{aligned}A&=9(0{,}15)+6(0{,}5)+3(1)=7{,}35\\B&=6(0{,}15)+7(0{,}5)+2(1)=6{,}4\\C&=7(0{,}15)+5(0{,}5)+4(1)=7{,}55\\A+B+C&=21{,}3\ \text{juta}\end{aligned}$$
Bentuk matriks (opsional): pendapatan $=K^{\mathsf T}\mathbf h$ dengan $K$ = kapasitas (baris tipe, kolom hotel) dan $\mathbf h=(0{,}15;\ 0{,}5;\ 1)^{\mathsf T}$.

### Bagian 4 — Analisis pernyataan (5 kartu)
Pin: $A=7{,}35$ · $B=6{,}4$ · $C=7{,}55$ · total $=21{,}3$ (juta rupiah).

| Kartu | Pernyataan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|------------|---------|---------------|------------------|
| (1) | Pendapatan Hotel A dan Hotel C sama besar. | SALAH | $7{,}35\neq7{,}55$ | Selisihnya Rp200.000. Jumlah kamar A (18) dan C (16) berbeda, dan C punya lebih banyak Suite. |
| (2) | Pendapatan Hotel B lebih besar daripada Hotel A. | SALAH | $6{,}4<7{,}35$ | Hotel B memang punya paling banyak Deluxe (7), tetapi kamar Standard dan Suite-nya lebih sedikit. |
| (3) | Pendapatan paling besar diperoleh dari Hotel C. | BENAR | $7{,}55>7{,}35>6{,}4$ | Hotel C punya 4 Suite (tarif tertinggi). Jebakan: Hotel A kamarnya terbanyak (18), tetapi bukan yang terbesar pendapatannya. |
| (4) | Masing-masing hotel memiliki selisih pendapatan yang sama besar. | SALAH | $A-B=0{,}95$; $C-A=0{,}2$; $C-B=1{,}15$ | Selisih antarhotel tidak sama, baik dibandingkan berpasangan maupun berurutan ($0{,}95$ lalu $0{,}2$). |
| (5) | Pendapatan ketiga hotel lebih dari Rp20.000.000. | BENAR | $21{,}3>20$ | Total Rp21.300.000. Jebakan: lupa mengubah juta ke rupiah (20 juta = Rp20.000.000). |

### Bagian 5 — Selesai
- **Segel:** **3, 5**
- **Pop-up:** "Pernyataan **(3)** dan **(5)** benar. Hotel C paling besar (Rp7.550.000), dan total ketiga hotel Rp21.300.000."
- **Ringkasan papan (`LR`):** $C=7{,}55$ (emas) · total $=21{,}3$ (emas) · **Jawaban (3) dan (5)** (emas).

### Pemeriksaan hasil
Metode kedua, hitung per tipe kamar: Standard (9+6+7) = 22 kamar × Rp150.000 = Rp3.300.000; Deluxe (6+7+5) = 18 × Rp500.000 = Rp9.000.000; Suite (3+2+4) = 9 × Rp1.000.000 = Rp9.000.000. Jumlah = Rp21.300.000 ✓ sama dengan $7{,}35+6{,}4+7{,}55$.

### Kesalahan umum / poin perhatian
- Menilai pendapatan dari jumlah kamar saja (A: 18, B: 15, C: 16), padahal tarif tiap tipe berbeda.
- Pada butir (4), "selisih sama besar" tidak terpenuhi dalam tafsir apa pun; kunci tidak berubah.

---

## SOAL 5 — Titik Potong dengan Sumbu X

| Atribut | Isi |
|---|---|
| Topik | Suku banyak: akar dan faktor |
| Jenis respons | Multi-jawaban: pilih semua titik potong yang benar (5 pilihan) |
| Jawaban akhir | **(−2, 0)** dan **(3, 0)** |
| Status | VALID |
| Visual utama | Grafik fungsi kubik SVG (playbook §15: Fungsi dan grafik) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Suku banyak
- **Judul hero:** `Pembahasan Soal` / `Akar` + aksen `Suku Banyak` / sub `Sumbu X`
- **Lede:** Grafik $f(x)=x^3+3x^2-10x-24$ memotong sumbu X di beberapa titik. Kita cari titik-titik itu dan uji kelima pilihan.
- **Fakta kunci:** Derajat → `3` · Kondisi → `y = 0` · Dicari → `titik potong sumbu X`
- **Ilustrasi lobi:** kurva kubik tergambar sendiri, tiga titik biru muncul di sumbu X.

### Bagian 1 — Pahami soal
- **Stabilo:** $f(x)=x^3+3x^2-10x-24$ (merah, `@s-f`), `sumbu X` (biru, `@s-sx`), `semua jawaban benar` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. Jawabannya bisa lebih dari satu."
- **Langkah 1.2** — pop-up: "Yang **diketahui**: bentuk fungsi $f(x)$."
- **Langkah 1.3** — pop-up: "Yang **ditanya**: titik-titik tempat grafik menyentuh sumbu X."

### Bagian 2 — Titik potong sumbu X berarti $f(x)=0$
**Prasyarat konsep:** semua titik pada sumbu X punya $y=0$. Jadi titik potong terhadap sumbu X adalah titik $(x,0)$ dengan $f(x)=0$; nilai $x$ itu disebut **akar**.

#### Langkah 2.1 — Mengapa $f(x)=0$
- **Pop-up:** "Pada sumbu X, tingginya nol. Jadi kita cari $x$ yang membuat $f(x)=0$."
- **Visual:** grafik kubik; garis sumbu X berpendar; slider "geser $x$" memperlihatkan titik pada kurva dan nilai $f(x)$-nya.
- **Pertanyaan cepat:**

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $f(x)=0$ | ya | — |
| $x=0$ | tidak | $x=0$ adalah sumbu Y. Titik potong sumbu X ditandai dengan tinggi $y=0$. |
| $f(0)=0$ | tidak | $f(0)=-24$ adalah titik potong sumbu Y, bukan sumbu X. |

#### Langkah 2.2 — Menguji tiap pilihan dengan substitusi
- **Pop-up:** "Masukkan $x$ tiap pilihan ke $f(x)$. Titik potong hanya jika hasilnya nol."
- **Papan:** judul "Uji pilihan"; pin: $f(x)$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| u1 | $f(-2)=(-2)^3+3(-2)^2-10(-2)-24$ | $-2$←`@o-1` | pilihan (−2,0) | — |
| u2 | $f(-2)=-8+12+20-24=0$ | — | nol → titik potong | `gold` |
| u3 | $f(-1)=-1+3+10-24=-12$ | $-1$←`@o-2` | bukan nol | — |
| u4 | $f(3)=27+27-30-24=0$ | $3$←`@o-3` | nol → titik potong | `gold` |
| u5 | $f(4)=64+48-40-24=48$ | $4$←`@o-4` | bukan nol | — |
| u6 | $f(5)=125+75-50-24=126$ | $5$←`@o-5` | bukan nol | — |

- **Animasi:** setiap pilihan ditulis, lalu titik pada kurva bergerak ke $x$ tersebut. Titik emas bila $f=0$, merah bila tidak.

#### Langkah 2.3 — Memeriksa dengan faktorisasi (opsional)
- **Pop-up:** "Mau memeriksa dengan faktor? Bagi $f(x)$ dengan $(x-3)$ memakai cara Horner." Tombol **[Ya, periksa]** **[Tidak, lanjut saja]**.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| h1 | koefisien: $1,\ 3,\ -10,\ -24$ dan pembagi $x=3$ | koefisien←`@s-f` | — | — |
| h2 | $1\ \to\ 3+3=6\ \to\ -10+18=8\ \to\ -24+24=0$ | — | sisa nol → $(x-3)$ faktor | `navy` |
| h3 | $f(x)=(x-3)(x^2+6x+8)$ | — | hasil bagi $x^2+6x+8$ | — |
| h4 | $f(x)=(x-3)(x+2)(x+4)$ | — | $x^2+6x+8=(x+2)(x+4)$ | `navy` |
| h5 | akar: $x=3,\ -2,\ -4$ | — | $-4$ tidak ada di pilihan | `gold` |

### Bagian 3 — Catatan lengkap
$$\begin{aligned}f(x)=0 &\Rightarrow \text{titik potong sumbu X}\\f(-2)&=-8+12+20-24=0\\f(-1)&=-12\ne0\\f(3)&=27+27-30-24=0\\f(4)&=48\ne0,\quad f(5)=126\ne0\\f(x)&=(x-3)(x+2)(x+4)\end{aligned}$$

### Bagian 4 — Analisis pilihan (5 kartu)
Pin: akar $=\{-4,\ -2,\ 3\}$.

| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| (1) | $(-2,0)$ | BENAR | $f(-2)=0$ | Akar $x=-2$. |
| (2) | $(-1,0)$ | SALAH | $f(-1)=-12$ | Grafik berada di bawah sumbu X pada $x=-1$. |
| (3) | $(3,0)$ | BENAR | $f(3)=0$ | Akar $x=3$. |
| (4) | $(4,0)$ | SALAH | $f(4)=48$ | Titik di atas sumbu X. Jebakan: $4$ adalah pembagi $24$ sehingga tampak "cocok", tetapi pembagi suku tetap belum tentu akar. |
| (5) | $(5,0)$ | SALAH | $f(5)=126$ | Jauh di atas sumbu X. |

*Ditambahkan M2 (20 Okt 2026; kunci tidak berubah), dipakai di `app/src/content/soal/q05.ts`:*
- **Bagian 1, papan:**
  - langkah 1.2: k1 Diketahui, k2 $f(x)=x^3+3x^2-10x-24$ (`@s-f`);
  - langkah 1.3: k3 Ditanya: titik potong dengan sumbu X (`@s-sx`; keterangan "jawabannya bisa lebih dari satu").
  - Urutan stabilo: 1.1 `@s-tanya`, 1.2 `@s-f`, 1.3 `@s-sx`.
- **Langkah 2.1, papan:** baris z1 "pada sumbu X $y=0\Rightarrow f(x)=0$" (navy; keterangan "nilai $x$ itu disebut akar").
  - Pertanyaan cepat muncul sebelum z1, dengan teks: "Titik potong grafik dengan sumbu X dicari dari…" (dokumen tidak memuat teks pertanyaannya).
- **Visual:** grafik kubik SVG. Skala sumbu Y dipadatkan agar $f(5)=126$ dan minimum $\approx-30$ terlihat bersama.
  - Chip pilihan $(-2,0)\ldots(5,0)$ di bawah grafik menjadi sumber `@o-1`…`@o-5`.
  - Titik pada kurva bergerak ke $x$ tiap pilihan. Titik dan chip menjadi emas bila $f=0$, merah bila tidak.
  - Slider "geser $x$" ada di langkah 2.1.
- **Langkah 2.2** dipecah: satu langkah per pilihan (u1–u2, u3, u4, u5, u6). Pop-up tambahan:
  - "Pilihan $(-1,0)$: $f(-1)=-12$. Grafik berada di bawah sumbu X."
  - "Pilihan $(3,0)$: $f(3)=0$, jadi titik potong."
  - "Pilihan $(4,0)$: $f(4)=48$, titiknya di atas sumbu X."
  - "Pilihan $(5,0)$: $f(5)=126$, jauh di atas sumbu X."
- **Langkah 2.3 (opsional):** h1–h5 ditampilkan di panel **Ya, periksa** dan di catatan lengkap. Grafik menandai ketiga akar.
- **Bagian 4:**
  - Pop-up per kartu dari kolom *Alasan*.
  - Papan ringkasan s1–s5, ditambah s6 "Jawaban $(-2,0)$ dan $(3,0)$".
  - Pertanyaan kesimpulan: $(3,0)$ saja · **$(-2,0)$ dan $(3,0)$** · $(-2,0)$, $(3,0)$, dan $(4,0)$ · $(-1,0)$ dan $(3,0)$.

### Bagian 5 — Selesai
- **Segel:** **(−2,0), (3,0)**
- **Pop-up:** "Grafik memotong sumbu X di $(-2,0)$ dan $(3,0)$ dari pilihan yang ada; titik potong ketiganya adalah $x=-4,\,-2,\,3$."
- **Ringkasan papan (`LR`):** $f(-2)=0$ (emas) · $f(3)=0$ (emas) · **Jawaban (−2,0) dan (3,0)** (emas).

### Pemeriksaan hasil
Substitusi balik pada faktor: $(x-3)(x+2)(x+4)=(x-3)(x^2+6x+8)=x^3+6x^2+8x-3x^2-18x-24=x^3+3x^2-10x-24$ ✓.

### Kesalahan umum / poin perhatian
- Mengira titik potong sumbu X adalah $x=0$ atau $f(0)$.
- Menganggap akar adalah pembagi konstanta ($\pm1,\pm2,\pm3,\pm4,\dots$) tanpa menguji dengan substitusi.
- Berhenti pada dua akar yang ada di pilihan dan melupakan bahwa kubik memiliki akar ketiga ($-4$).

---

## SOAL 6 — Sisa Pembagian Suku Banyak

| Atribut | Isi |
|---|---|
| Topik | Suku banyak: teorema pembagian dan sisa |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **C** — $a+b=-1$ (dengan $a=2$, $b=-3$) |
| Status | VALID |
| Visual utama | Papan tulis: pembagian dan kesamaan koefisien (playbook §15: papan saja) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Suku banyak
- **Judul hero:** `Pembahasan Soal` / `Sisa` + aksen `Pembagian` / sub `Suku Banyak`
- **Lede:** $f(x)=x^4+ax^3+bx^2+x-6$ dibagi $x^2+x+1$ bersisa $5x-1$. Dari informasi itu kita cari $a$ dan $b$.
- **Fakta kunci:** Pembagi → `x² + x + 1` · Sisa → `5x − 1` · Dicari → `a + b`
- **Ilustrasi lobi:** pembagian bersusun dengan sisa $5x-1$ berpendar.

### Bagian 1 — Pahami soal
- **Stabilo:** $f(x)=x^4+ax^3+bx^2+x-6$ (merah, `@s-f`), pembagi $x^2+x+1$ (biru, `@s-p`), sisa $5x-1$ (merah, `@s-r`), $a+b$ (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. Ada dua huruf yang belum diketahui: $a$ dan $b$."
- **Langkah 1.2** — pop-up: "**Diketahui**: pembagi dan sisa. **Ditanya**: $a+b$."

### Bagian 2 — Mengubah informasi sisa menjadi persamaan
**Prasyarat konsep:** jika $f(x)$ dibagi $P(x)$ menghasilkan hasil bagi $h(x)$ dan sisa $r(x)$, maka $f(x)=P(x)\,h(x)+r(x)$. Karena itu $f(x)-r(x)$ **habis dibagi** $P(x)$.

#### Langkah 2.1 — Buang sisanya
- **Pop-up:** "Kurangkan sisa $5x-1$ dari $f(x)$. Yang tersisa pasti habis dibagi $x^2+x+1$."
- **Papan:** judul "Menyingkirkan sisa".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $f(x)=(x^2+x+1)\,h(x)+(5x-1)$ | pembagi←`@s-p`, sisa←`@s-r` | teorema pembagian | — |
| a2 | $f(x)-(5x-1)=(x^2+x+1)\,h(x)$ | $5x-1$←`a1` | sisa pindah ruas | — |
| a3 | $x^4+ax^3+bx^2+x-6-5x+1=(x^2+x+1)\,h(x)$ | $f$←`@s-f` | tanda sisa berubah | — |
| a4 | $x^4+ax^3+bx^2-4x-5=(x^2+x+1)\,h(x)$ | — | $x-5x=-4x$; $-6+1=-5$ | `navy` |

- **Pertanyaan cepat** (sebelum a4): "Suku $x$ setelah dikurangi sisa $(5x-1)$ menjadi…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $-4x$ | ya | — |
| $6x$ | tidak | Sisa **dikurangkan**, jadi $x-5x$, bukan $x+5x$. |
| $x$ | tidak | Suku $x$ ikut berkurang oleh $5x$. |

#### Langkah 2.2 — Hasil bagi berderajat dua
- **Pop-up:** "$f$ berderajat 4 dan pembagi berderajat 2, jadi hasil bagi berderajat 2 dengan koefisien depan 1: $x^2+px+q$."
- **Papan:** pin: $x^4+ax^3+bx^2-4x-5$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $h(x)=x^2+px+q$ | — | koefisien $x^2$ harus 1 agar $x^4$ muncul | — |
| b2 | $(x^2+x+1)(x^2+px+q)$ | — | kalikan | — |
| b3 | $=x^4+(p+1)x^3+(p+q+1)x^2+(p+q)x+q$ | — | kumpulkan per pangkat | `navy` |

### Bagian 3 — Menyamakan koefisien
#### Langkah 3.1 — Mencari $q$ dan $p$
- **Pop-up:** "Samakan koefisien $x^4+ax^3+bx^2-4x-5$ dengan hasil perkalian tadi, mulai dari suku $x$ dan konstanta."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | konstanta: $q=-5$ | $-5$←`a4`, $q$←`b3` | suku tetap | `navy` |
| c2 | koefisien $x$: $p+q=-4$ | $-4$←`a4`, $p+q$←`b3` | — | — |
| c3 | $p-5=-4$ | $q$←`c1` | substitusi $q=-5$ | — |
| c4 | $p=1$ | — | $-4+5=1$ | `navy` |

- **Pertanyaan cepat** (sebelum c4): "Dari $p-5=-4$, berapa $p$?"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $1$ | ya | — |
| $-9$ | tidak | Jangan mengurangkan lagi. Pindahkan $-5$ ke kanan menjadi $+5$. |
| $-1$ | tidak | $-4+5=1$, bukan $-1$. |

#### Langkah 3.2 — Mencari $a$ dan $b$
| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| d1 | koefisien $x^3$: $a=p+1$ | $a$←`a4`, $p+1$←`b3` | — | — |
| d2 | $a=1+1=2$ | $p$←`c4` | — | `navy` |
| d3 | koefisien $x^2$: $b=p+q+1$ | — | — | — |
| d4 | $b=1+(-5)+1=-3$ | $p$←`c4`, $q$←`c1` | — | `navy` |
| d5 | $a+b=2+(-3)=-1$ | $a$←`d2`, $b$←`d4` | — | `gold` |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}f(x)-(5x-1)&=x^4+ax^3+bx^2-4x-5=(x^2+x+1)(x^2+px+q)\\&=x^4+(p+1)x^3+(p+q+1)x^2+(p+q)x+q\\q&=-5,\quad p+q=-4\Rightarrow p=1\\a&=p+1=2,\quad b=p+q+1=-3\\a+b&=-1\end{aligned}$$

### Bagian 5 — Cocokkan dengan pilihan (kartu A–E)
Pin: $a+b=-1$.

| Kartu | Pilihan | Stempel | Alasan / jebakan |
|-------|---------|---------|------------------|
| A | 11 | SALAH | Tidak sama dengan $2+(-3)$. |
| B | 5 | SALAH | $5$ adalah koefisien $x$ pada sisa $5x-1$, bukan $a+b$. |
| C | −1 | BENAR | $a=2$, $b=-3$. |
| D | −5 | SALAH | $-5$ adalah $q$ (konstanta hasil bagi), bukan $a+b$. |
| E | −7 | SALAH | Tidak sama dengan $2+(-3)$; jangan menjumlahkan $b$ dengan $q$ atau $p$. |

*Ditambahkan M2 (20 Okt 2026; kunci tidak berubah), dipakai di `app/src/content/soal/q06.ts`:*
- **Bagian 1, papan:**
  - langkah 1.1: k1 Diketahui, k2 $f(x)=x^4+ax^3+bx^2+x-6$ (`@s-f`);
  - langkah 1.2: k3 pembagi $x^2+x+1$ (`@s-p`), k4 sisa $5x-1$ (`@s-r`), k5 Ditanya $a+b$ (`@s-tanya`).
- **Visual:** kertas soal tetap tampil dengan stabilo sepanjang Bagian 2–3 (papan saja), sehingga `@s-f`, `@s-p`, dan `@s-r` selalu terlihat sebagai sumber.
- **Pin dipecah per suku**, agar tiap koefisien terbang sendiri:
  - $x^4\,|\,{+ax^3}\,|\,{+bx^2}\,|\,{-4x}\,|\,{-5}$;
  - $x^4\,|\,{+(p+1)x^3}\,|\,{+(p+q+1)x^2}\,|\,{+(p+q)x}\,|\,{+q}$.
  - Contoh: c1 $q\leftarrow+q$, $-5\leftarrow-5$; d1 $a\leftarrow+ax^3$, $p+1\leftarrow+(p+1)x^3$.
- **Judul papan:**
  - "Menyingkirkan sisa" untuk a1–a4;
  - "Hasil bagi berderajat dua" untuk b1–b3. b3 ditulis dua baris rata "=" agar muat;
  - "Mencari q dan p" untuk c1–c4;
  - "Mencari a dan b" untuk d1–d5, dengan pin tambahan $p=1$, $q=-5$.
  - Pop-up langkah 3.2: "Samakan koefisien $x^3$ dan $x^2$, lalu jumlahkan $a$ dan $b$."
- **Bagian 5:**
  - Rumus singkat kartu disusun dari kolom alasan: $11\ne-1$, $5\ne-1$, $2+(-3)=-1$, $-5\ne-1$, $-7\ne-1$.
  - Pop-up per kartu dari kolom *Alasan*.
  - Papan ringkasan s1–s5, ditambah s6 "Jawaban C".
  - Pertanyaan berhuruf A–E.
- **Ringkasan `LR`:** $a=2$, $b=-3$ (navy) · $a+b=-1$ (emas) · **Jawaban C** (emas).

### Bagian 6 — Selesai
- **Segel:** **C**
- **Pop-up:** "$f(x)=x^4+2x^3-3x^2+x-6$, sehingga $a=2$, $b=-3$, dan $a+b=-1$."

### Pemeriksaan hasil
Pembagian bersusun: $\dfrac{x^4+2x^3-3x^2+x-6}{x^2+x+1}=x^2+x-5$ karena $(x^2+x+1)(x^2+x-5)=x^4+2x^3-3x^2-4x-5$; selisih dengan $f$ adalah $5x-1$ ✓ (sisa sesuai soal).
Metode kedua: misalkan $\omega$ akar $x^2+x+1=0$, sehingga $\omega^2=-\omega-1$ dan $\omega^3=1$. Maka $f(\omega)=\omega+a+b(-\omega-1)+\omega-6=(2-b)\omega+(a-b-6)$. Samakan dengan $5\omega-1$: $b=-3$, $a=2$ ✓.

### Kesalahan umum / poin perhatian
- Menyamakan koefisien langsung pada $f(x)$ tanpa mengurangkan sisa.
- Lupa bahwa koefisien $x^2$ pada hasil bagi harus 1.
- Salah tanda saat mengurangkan sisa ($x-5x=-4x$, bukan $6x$).

---

## SOAL 7 — Penambahan Volume 10 Drum

| Atribut | Isi |
|---|---|
| Topik | Fungsi polinom: operasi perkalian dengan konstanta |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **D** — $0{,}5T^3+4T^2+200T$ |
| Status | VALID |
| Visual utama | Sepuluh drum SVG + papan (playbook §15: Cerita aritmetika) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Fungsi polinom
- **Judul hero:** `Pembahasan Soal` / `Fungsi` + aksen `Volume` / sub `10 Drum`
- **Lede:** Satu drum bertambah volumenya menurut $V(T)$ saat dipanasi. Berapa fungsi penambahan volume untuk 10 drum yang sama?
- **Fakta kunci:** Banyak drum → `10` · Suhu → `sama` · Dicari → `fungsi total`
- **Ilustrasi lobi:** sepuluh drum berjajar, tiap drum menggembung saat suhu naik.

### Bagian 1 — Pahami soal
- **Stabilo:** $V(T)=0{,}05T^3+0{,}4T^2+20T$ (merah, `@s-V`), `10 drum dengan jenis dan ukuran yang sama` (biru, `@s-10`), `suhu yang sama` (biru, `@s-suhu`), `total penambahan volume` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Satu drum memakai $V(T)$. Karena sepuluh drum sama dan suhunya sama, tiap drum bertambah $V(T)$."
- **Langkah 1.2** — pop-up: "Ditanya: rumus penambahan **total** untuk 10 drum."

### Bagian 2 — Mengalikan dengan 10
**Prasyarat konsep:** total = 10 × (penambahan satu drum). Mengalikan fungsi dengan konstanta berarti mengalikan **setiap suku**.

#### Langkah 2.1 — Susun totalnya
- **Pop-up:** "Total sama dengan 10 kali penambahan satu drum. Kalikan setiap suku dengan 10."
- **Visual:** satu drum bertanda $V(T)$ menyalin diri menjadi sepuluh drum; sepuluh label $V(T)$ bergabung menjadi $10\,V(T)$.
- **Papan:** judul "Total 10 drum".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $V_{\text{total}}(T)=10\cdot V(T)$ | $10$←`@s-10`, $V(T)$←`@s-V` | 10 drum sama | — |
| a2 | $V_{\text{total}}(T)=10\,(0{,}05T^3+0{,}4T^2+20T)$ | polinom←`@s-V` | — | — |
| a3 | $V_{\text{total}}(T)=10(0{,}05)T^3+10(0{,}4)T^2+10(20)T$ | — | 10 dikali ke tiap suku | — |
| a4 | $V_{\text{total}}(T)=0{,}5T^3+4T^2+200T$ | — | $10(0{,}05)=0{,}5$; $10(0{,}4)=4$; $10(20)=200$ | `gold` |

- **Pertanyaan cepat** (sebelum a4): "Berapa $10\times0{,}05$?"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $0{,}5$ | ya | — |
| $5$ | tidak | Dikali 10 menggeser koma satu tempat, bukan dua: $0{,}05\to0{,}5$. |
| $50$ | tidak | Itu kalau koma bergeser tiga tempat. $0{,}05\times10=0{,}5$. |

### Bagian 3 — Catatan lengkap
$$\begin{aligned}V_{\text{total}}&=10\,V(T)\\&=10(0{,}05T^3+0{,}4T^2+20T)\\&=0{,}5T^3+4T^2+200T\end{aligned}$$

### Bagian 4 — Cocokkan dengan pilihan (kartu A–E)
**Uji cepat dengan $T=10$:** $V(10)=0{,}05(1000)+0{,}4(100)+20(10)=50+40+200=290$, jadi 10 drum $=2900$ liter.

| Kartu | Pilihan | Stempel | Nilai di $T=10$ | Alasan / jebakan |
|-------|---------|---------|-----------------|------------------|
| A | $50T^3+40T^2+200T$ | SALAH | $56000$ | Koma digeser terlalu jauh pada dua suku pertama. |
| B | $50T^3+4T^2+200T$ | SALAH | $52400$ | Suku $T^3$ salah (50, seharusnya 0,5). |
| C | $5T^3+4T^2+200T$ | SALAH | $7400$ | Suku $T^3$ salah (5, seharusnya 0,5). |
| D | $0{,}5T^3+4T^2+200T$ | BENAR | $2900$ | Semua suku dikali 10 dengan benar. |
| E | $0{,}5T^3+0{,}4T^2+200T$ | SALAH | $2540$ | Suku $T^2$ lupa dikali 10 (jebakan: berhenti di tengah). |

### Bagian 5 — Selesai
- **Segel:** **D**
- **Pop-up:** "Untuk 10 drum, tiap suku dikali 10: $0{,}5T^3+4T^2+200T$."

### Pemeriksaan hasil
Pada $T=10$ rumus D memberi $0{,}5(1000)+4(100)+200(10)=500+400+2000=2900=10\times290$ ✓. Opsi lain memberi 56.000, 52.400, 7.400, dan 2.540, sehingga tidak sama dengan 2.900.

### Kesalahan umum / poin perhatian
- Mengalikan hanya sebagian suku (opsi E).
- Salah menggeser koma pada $0{,}05\times10$ dan $0{,}4\times10$.

---

## SOAL 8 — Modal Saham

| Atribut | Isi |
|---|---|
| Topik | Fungsi polinom: nilai fungsi dan pertidaksamaan (kecukupan modal) |
| Jenis respons | Tabel Benar/Salah, 3 baris. Tiap baris dibaca: "Perusahaan **mungkin** menjual *n* unit saham." Benar = Mungkin, Salah = Tidak Mungkin |
| Jawaban akhir | 30 unit → **Salah (Tidak Mungkin)**; 40 unit → **Benar (Mungkin)**; 60 unit → **Benar (Mungkin)** |
| Status | VALID (tafsir Benar = Mungkin dicatat; kunci sama untuk tafsir "$f(x)=2000$" maupun "$f(x)\le2000$") |
| Visual utama | Grafik $f(x)$ dengan garis modal $y=2000$ (playbook §15: Fungsi dan grafik) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Fungsi polinom
- **Judul hero:** `Pembahasan Soal` / `Modal` + aksen `Saham` / sub `Mungkin atau Tidak`
- **Lede:** Modal yang perlu disiapkan untuk menjual $x$ unit saham mengikuti $f(x)$ (dalam juta rupiah). Perusahaan hanya punya modal 2.000 juta. Unit mana yang masih mungkin?
- **Fakta kunci:** Modal perusahaan → `2.000 juta` · Satuan $f(x)$ → `juta rupiah` · Dicari → `30, 40, 60 unit`
- **Ilustrasi lobi:** kurva $f(x)$ tergambar, garis datar "modal 2.000" memotongnya.

### Bagian 1 — Pahami soal
- **Stabilo:** $f(x)=x^3-70x^2-600x+74000$ (merah, `@s-f`), `dalam jutaan rupiah` (biru, `@s-juta`), `2 miliar atau 2.000 juta` (merah, `@s-modal`), `30 unit, 40 unit, 60 unit` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. Perhatikan satuannya: $f(x)$ dalam **juta rupiah**."
- **Langkah 1.2** — pop-up: "Modal perusahaan 2 miliar sama dengan **2.000 juta**. Samakan satuan sebelum membandingkan."
- **Langkah 1.3** — pop-up: "Ditanya: apakah menjual 30, 40, atau 60 unit **mungkin**?"

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | $f(x)=x^3-70x^2-600x+74000$ | `@s-f` | juta rupiah | — |
| k3 | modal perusahaan $=2000$ juta | `@s-modal` | 2 miliar = 2.000 juta | — |
| k4 | **Ditanya** (label) mungkin jika $f(x)\le2000$ | `@s-tanya` | modal yang dibutuhkan tidak melebihi modal yang dimiliki | — |

### Bagian 2 — Modal yang dibutuhkan tiap pilihan
**Prasyarat konsep:** menjual $x$ unit mungkin bila modal yang dibutuhkan $f(x)$ **tidak melebihi** modal yang dimiliki, yaitu $f(x)\le2000$ (dua-duanya dalam juta rupiah).

#### Langkah 2.1 — 30 unit
- **Pop-up:** "Hitung $f(30)$ pangkat demi pangkat."
- **Papan:** judul "Uji 30 unit".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $f(30)=30^3-70(30)^2-600(30)+74000$ | $30$←`@o-30` | — | — |
| a2 | $f(30)=27000-63000-18000+74000$ | — | $30^3=27000$; $70\cdot900=63000$; $600\cdot30=18000$ | — |
| a3 | $f(30)=20000$ juta | — | $27000+74000=101000$; $101000-81000$ | `navy` |
| a4 | $20000>2000$ | $2000$←`k3` | butuh 20 miliar, punya 2 miliar | — |
| a5 | 30 unit: **tidak mungkin** | — | modal kurang | `gold` |

- **Pertanyaan cepat** (sebelum a4): "Modal yang dibutuhkan untuk 30 unit adalah 20.000 juta. Dibanding 2.000 juta…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| lebih besar, jadi tidak mungkin | ya | — |
| lebih kecil, jadi mungkin | tidak | $20000$ lebih besar dari $2000$. Yang tersedia hanya $2000$ juta. |
| sama besar | tidak | $20000\ne2000$; selisihnya 18.000 juta. |

#### Langkah 2.2 — 40 unit dan 60 unit
- **Pop-up:** "Dengan cara yang sama, hitung $f(40)$ dan $f(60)$."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $f(40)=64000-112000-24000+74000$ | $40$←`@o-40` | $40^3=64000$; $70\cdot1600=112000$; $600\cdot40=24000$ | — |
| b2 | $f(40)=2000$ juta | — | $64000+74000=138000$; $138000-136000$ | `navy` |
| b3 | $2000\le2000$ → 40 unit: **mungkin** | `k3` | modal pas | `gold` |
| c1 | $f(60)=216000-252000-36000+74000$ | $60$←`@o-60` | $60^3=216000$; $70\cdot3600=252000$; $600\cdot60=36000$ | — |
| c2 | $f(60)=2000$ juta | — | $216000+74000=290000$; $290000-288000$ | `navy` |
| c3 | $2000\le2000$ → 60 unit: **mungkin** | `k3` | modal pas | `gold` |

#### Langkah 2.3 — Mengapa 40 dan 60 sama-sama pas (opsional, grafik)
- **Pop-up:** "Mau melihat mengapa 40 dan 60 sama-sama pas? Lihat grafiknya." Tombol **[Ya, tampilkan grafik]** **[Tidak, lanjut saja]**.
- **Visual:** grafik $y=f(x)$ untuk $0\le x\le80$, garis datar $y=2000$. Titik $x=30$ jauh di atas garis (merah), $x=40$ dan $x=60$ tepat pada garis (emas). Daerah $40\le x\le60$ (kurva di bawah atau pada garis) diwarnai biru.
- **Papan:** $f(x)-2000=(x+30)(x-40)(x-60)$ (keterangan: tanda negatif pada $40<x<60$, sehingga $f(x)<2000$ di antara kedua titik itu).

### Bagian 3 — Catatan lengkap
$$\begin{aligned}f(30)&=27000-63000-18000+74000=20000>2000\\f(40)&=64000-112000-24000+74000=2000\\f(60)&=216000-252000-36000+74000=2000\\f(x)-2000&=(x+30)(x-40)(x-60)\end{aligned}$$
Modal yang dimiliki: 2 miliar $=2000$ juta.

### Bagian 4 — Analisis pernyataan (3 kartu)
| Kartu | Pernyataan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|------------|---------|---------------|------------------|
| (1) | 30 unit | SALAH (tidak mungkin) | $f(30)=20000>2000$ | Butuh 20 miliar. Jebakan: membandingkan 20000 dengan "2" miliar tanpa mengubah satuan. |
| (2) | 40 unit | BENAR (mungkin) | $f(40)=2000\le2000$ | Modal pas. |
| (3) | 60 unit | BENAR (mungkin) | $f(60)=2000\le2000$ | Modal pas. Jebakan: mengira makin banyak unit makin besar modal; di antara 40 dan 60 modalnya justru lebih kecil. |

### Bagian 5 — Selesai
- **Segel:** **Salah · Benar · Benar**
- **Pop-up:** "30 unit tidak mungkin (butuh 20.000 juta). 40 unit dan 60 unit mungkin, karena $f=2000$ juta."

### Pemeriksaan hasil
Metode kedua: $f(x)-2000=x^3-70x^2-600x+72000=(x+30)(x-40)(x-60)$. Karena $(x+30)(x-40)(x-60)=x^3-70x^2-600x+72000$ ✓. Untuk $x>0$, $f(x)\le2000$ tepat pada $40\le x\le60$, sehingga 30 tidak memenuhi dan 40, 60 memenuhi.

### Kesalahan umum / poin perhatian
- Membandingkan rupiah dengan juta rupiah (20000 vs 2.000.000.000).
- Mengira kenaikan $x$ selalu menaikkan $f(x)$; fungsi kubik ini turun dahulu lalu naik pada rentang tertentu.
- Catatan tafsir: jika "mungkin" diartikan $f(x)=2000$ (tepat habis), kunci sama (40 dan 60 benar, 30 salah).

---

## SOAL 9 — Populasi Kelinci

| Atribut | Isi |
|---|---|
| Topik | Fungsi eksponensial: interpretasi model |
| Jenis respons | Tabel Benar/Salah, 3 pernyataan |
| Jawaban akhir | (1) **Salah** · (2) **Benar** · (3) **Salah** |
| Status | VALID |
| Visual utama | Grafik eksponensial dan tabel nilai tiap 4 tahun (playbook §15: Fungsi dan grafik) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Fungsi eksponensial
- **Judul hero:** `Pembahasan Soal` / `Model` + aksen `Eksponensial` / sub `Populasi Kelinci`
- **Lede:** Populasi kelinci mengikuti $K(t)=4\cdot2^{t/4}$. Kita tafsirkan apa arti angka 4, angka 2, dan pangkat $\frac t4$.
- **Fakta kunci:** Populasi awal → `4 ribu` · Basis → `2` · Satuan $K$ → `ribu ekor`
- **Ilustrasi lobi:** kurva eksponensial tergambar, titik-titik kelinci bertambah tiap 4 tahun.

### Bagian 1 — Pahami soal
- **Stabilo:** $K(t)=4\cdot2^{\frac t4}$ (merah, `@s-K`), `t dalam tahun` (biru, `@s-t`), `K(t) dalam ribu ekor` (biru, `@s-ribu`), `interpretasi yang tepat` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca modelnya. $t$ dalam tahun, $K(t)$ dalam **ribu** ekor."
- **Langkah 1.2** — pop-up: "Ditanya: tiga pernyataan tentang model ini, benar atau salah."

### Bagian 2 — Menafsirkan model
**Prasyarat konsep:** untuk $K(t)=K_0\cdot b^{t/p}$, nilai $K_0$ adalah nilai awal ($t=0$) dan populasi dikali $b$ **setiap $p$ tahun**.

#### Langkah 2.1 — Populasi awal
- **Pop-up:** "Awal pengamatan berarti $t=0$. Masukkan ke model."
- **Papan:** judul "Populasi awal".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $K(0)=4\cdot2^{\frac04}$ | $0$←`@s-t` | $t=0$ | — |
| a2 | $K(0)=4\cdot2^0=4\cdot1$ | — | pangkat nol = 1 | — |
| a3 | $K(0)=4$ ribu ekor | — | pernyataan (2) benar | `gold` |

#### Langkah 2.2 — Setiap 4 tahun
- **Pop-up:** "Bandingkan populasi pada $t$ dengan $t+4$. Berapa kali lipat?"
- **Visual:** tabel $t=0,4,8,12,16,20$ dengan $K=4,8,16,32,64,128$ (ribu); panah "×2" di antara kolom.
- **Papan:** judul "Perbandingan 4 tahun".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $\dfrac{K(t+4)}{K(t)}=\dfrac{4\cdot2^{\frac{t+4}{4}}}{4\cdot2^{\frac t4}}$ | $K$←`@s-K` | bagi populasi 4 tahun kemudian dengan populasi sekarang | — |
| b2 | $=2^{\frac{t+4}{4}-\frac t4}=2^1$ | — | sifat pangkat: $\frac{a^m}{a^n}=a^{m-n}$ | — |
| b3 | $=2$ | — | populasi **2 kali** tiap 4 tahun | `navy` |

- **Pertanyaan cepat** (sebelum b3): "Setiap 4 tahun, populasi menjadi…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| 2 kali | ya | — |
| 4 kali | tidak | Angka 4 di depan adalah populasi awal. Pengalinya adalah basis $2$. |
| 8 kali | tidak | Dari tabel: $4\to8\to16$; tiap 4 tahun hanya berlipat dua. |

Dengan hasil ini, pernyataan (1) "menjadi 4 kalinya" **salah**; untuk menjadi 4 kali dibutuhkan 8 tahun.

#### Langkah 2.3 — Mencapai 1 juta ekor
- **Pop-up:** "1 juta ekor berarti $1000$ ribu ekor. Cek nilai $K(20)$ dahulu."
- **Visual:** grafik $K(t)$ sampai $t=20$; garis $y=1000$ berada jauh di atas kurva.
- **Papan:** judul "Batas 1 juta".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $1$ juta $=1000$ ribu | — | satuan $K$ adalah ribu | — |
| c2 | $K(20)=4\cdot2^{\frac{20}{4}}=4\cdot2^5$ | $20$←`@s-t` | — | — |
| c3 | $K(20)=4\cdot32=128$ ribu | — | $2^5=32$ | `navy` |
| c4 | $128<1000$ | $1000$←`c1` | belum 1 juta pada tahun ke-20 | — |
| c5 | $K(t)$ naik terus → belum 1 juta sebelum tahun ke-20 | — | model selalu naik | `gold` |

- **Sorotan opsional:** $4\cdot2^{t/4}=1000\Rightarrow2^{t/4}=250$; karena $2^7=128<250<256=2^8$, maka $28<t<32$ (sekitar 31,9 tahun). Jadi baru melewati 1 juta setelah sekitar 32 tahun.

### Bagian 3 — Catatan lengkap
$$\begin{aligned}K(0)&=4\cdot2^0=4\ \text{ribu}\\\frac{K(t+4)}{K(t)}&=2^{\frac{t+4}{4}-\frac t4}=2\\K(20)&=4\cdot2^5=128\ \text{ribu}<1000\ \text{ribu}\end{aligned}$$

### Bagian 4 — Analisis pernyataan (3 kartu)
| Kartu | Pernyataan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|------------|---------|---------------|------------------|
| (1) | Setiap 4 tahun populasi bertambah menjadi 4 kalinya. | SALAH | $\frac{K(t+4)}{K(t)}=2$ | Menjadi 2 kali. Jebakan: mencampur angka 4 (populasi awal) dengan pengali. |
| (2) | Pada saat awal populasi kelinci berjumlah 4 ribu ekor. | BENAR | $K(0)=4$ | $2^0=1$. |
| (3) | Populasi mencapai 1 juta sebelum 20 tahun dari awal pengamatan. | SALAH | $K(20)=128<1000$ | 128 ribu masih jauh dari 1 juta. Jebakan: lupa bahwa satuan $K$ adalah ribu, sehingga 1 juta $=1000$. |

### Bagian 5 — Selesai
- **Segel:** **S · B · S**
- **Pop-up:** "Populasi awal 4 ribu ekor, berlipat **dua** tiap 4 tahun, dan pada tahun ke-20 baru 128 ribu ekor."

### Pemeriksaan hasil
Pemeriksaan numerik: $K(4)=4\cdot2^1=8$, $K(8)=16$, $K(12)=32$, $K(16)=64$, $K(20)=128$; tiap langkah 4 tahun mengalikan 2, bukan 4.

### Kesalahan umum / poin perhatian
- Menyamakan "dua kali lipat" dengan "empat kali lipat" (butir 1).
- Mengabaikan satuan ribu ekor (butir 3).

---

## SOAL 10 — Eceng Gondok

| Atribut | Isi |
|---|---|
| Topik | Fungsi eksponensial: membaca grafik dan menentukan nilai awal |
| Jenis respons | Multi-jawaban: pilih semua danau yang benar (5 pilihan) |
| Jawaban akhir | **Danau C, Danau D, Danau E** |
| Status | VALID (fungsi tidak tertulis di gambar; diturunkan dari tiga titik grafik. Lihat catatan sumber) |
| Visual utama | Grafik asli + papan (playbook §15: Fungsi dan grafik) |
| Aset gambar | `./grafik_eceng_gondok.png` |

**Data dibaca dari gambar `grafik_eceng_gondok.png`:** sumbu tegak = luas area yang tertutup (m²), sumbu mendatar = tahun ke-. Titik yang diberi garis putus-putus: tahun ke-1 → **70**, tahun ke-2 → **490**. Kurva memotong sumbu tegak pada label **10** (tahun ke-0). Jadi tiga titik: $(0,10)$, $(1,70)$, $(2,490)$.

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Fungsi eksponensial
- **Judul hero:** `Pembahasan Soal` / `Eceng` + aksen `Gondok` / sub `Luas Awal`
- **Lede:** Eceng gondok menutupi permukaan danau makin cepat. Dari luas area setelah 3 tahun, kita cari danau mana yang awalnya sudah lebih dari 49 m².
- **Fakta kunci:** Lama pengamatan → `3 tahun` · Ambang awal → `49 m²` · Pilihan → `5 danau`
- **Ilustrasi lobi:** foto eceng gondok dari aset sumber di samping kurva yang menanjak.

### Bagian 1 — Pahami soal
- **Stabilo:** `grafik` (biru, `@s-grafik`), `3 tahun pengamatan` (merah, `@s-3th`), tabel luas A–E (merah, `@L-A` … `@L-E`), `lebih dari 49 m² pada awal pengamatan` (emas, `@s-tanya`). Titik grafik diberi `data-src`: `@g0` (10), `@g1` (70), `@g2` (490).
- **Langkah 1.1** — pop-up: "Baca soal dan lihat grafiknya. Angka pada grafik: 10, 70, dan 490."
- **Langkah 1.2** — pop-up: "Diketahui luas tiap danau setelah 3 tahun. **Ditanya**: danau mana yang luas awalnya lebih dari 49 m²."

### Bagian 2 — Membaca laju pertumbuhan dari grafik
**Prasyarat konsep:** jika luas dikali bilangan yang sama setiap tahun, modelnya eksponensial: $L(t)=L_0\cdot r^t$ dengan $r$ = faktor pertumbuhan per tahun.

#### Langkah 2.1 — Faktor per tahun
- **Pop-up:** "Bagi luas tahun berikutnya dengan luas sebelumnya. Hasilnya sama setiap kali?"
- **Visual:** gambar grafik; panah "×7" muncul di antara $(0,10)\to(1,70)$ dan $(1,70)\to(2,490)$.
- **Papan:** judul "Faktor tumbuh".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $\dfrac{L(1)}{L(0)}=\dfrac{70}{10}$ | $70$←`@g1`, $10$←`@g0` | tahun 0 ke 1 | — |
| a2 | $\dfrac{70}{10}=7$ | — | — | `navy` |
| a3 | $\dfrac{L(2)}{L(1)}=\dfrac{490}{70}=7$ | $490$←`@g2`, $70$←`@g1` | tahun 1 ke 2 | `navy` |
| a4 | $L(t)=10\cdot7^t$ | — | luas dikali 7 tiap tahun | `gold` |

- **Pertanyaan cepat** (sebelum a3): "Dari 70 m² ke 490 m², luasnya dikali…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| 7 | ya | — |
| 420 | tidak | $490-70=420$ adalah selisih. Pada model eksponensial yang dicari adalah rasio $490:70$. |
| 49 | tidak | $49$ adalah ambang pada soal. Hitung $490:70$. |

#### Langkah 2.2 — Faktor selama 3 tahun
- **Pop-up:** "Dalam 3 tahun luas dikali $7$ sebanyak tiga kali."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | faktor 3 tahun $=7^3$ | $7$←`a4` | — | — |
| b2 | $7^3=343$ | — | $7\cdot7=49$; $49\cdot7=343$ | `navy` |
| b3 | $L(3)=L_0\cdot343$ | $343$←`b2` | $L_0$ = luas awal danau itu | — |

### Bagian 3 — Mencari luas awal tiap danau
**Asumsi eksplisit:** semua danau tumbuh dengan faktor yang sama, 7 per tahun (dibaca dari grafik); yang berbeda hanya luas awalnya $L_0$.

#### Langkah 3.1 — Batas luas setelah 3 tahun
- **Pop-up:** "Luas awal harus lebih dari 49. Berarti luas setelah 3 tahun harus lebih dari $49\times343$."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $L_0>49$ | `@s-tanya` | syarat soal | — |
| c2 | $L_0\cdot343>49\cdot343$ | $343$←`b2` | kedua ruas dikali 343 | — |
| c3 | $L(3)>16807$ | — | $49\cdot343=16807$ ($=7^5$) | `navy` |

#### Langkah 3.2 — Cocokkan dengan data
- **Pop-up:** "Bagi luas tiap danau dengan 343 untuk melihat luas awalnya."
- **Visual:** tabel danau dengan kolom baru "luas awal" terisi satu per satu; baris yang melewati 49 menyala emas, lainnya merah.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| d1 | A: $\frac{15000}{343}\approx43{,}7$ | $15000$←`@L-A` | $<49$ | — |
| d2 | B: $\frac{16500}{343}\approx48{,}1$ | $16500$←`@L-B` | $<49$ | — |
| d3 | C: $\frac{17000}{343}\approx49{,}6$ | $17000$←`@L-C` | $>49$ | `gold` |
| d4 | D: $\frac{17500}{343}\approx51{,}0$ | $17500$←`@L-D` | $>49$ | `gold` |
| d5 | E: $\frac{18000}{343}\approx52{,}5$ | $18000$←`@L-E` | $>49$ | `gold` |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}\frac{70}{10}&=\frac{490}{70}=7\Rightarrow L(t)=10\cdot7^t\\7^3&=343\\L_0&=\frac{L(3)}{343}>49\Rightarrow L(3)>49\cdot343=16807\end{aligned}$$

### Bagian 5 — Analisis pilihan (5 kartu)
| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| A | Danau A (15.000) | SALAH | $15000<16807$ | Luas awal $\approx43{,}7$. |
| B | Danau B (16.500) | SALAH | $16500<16807$ | Luas awal $\approx48{,}1$, hampir tetapi belum 49. |
| C | Danau C (17.000) | BENAR | $17000>16807$ | Luas awal $\approx49{,}6$. |
| D | Danau D (17.500) | BENAR | $17500>16807$ | Luas awal $\approx51{,}0$. |
| E | Danau E (18.000) | BENAR | $18000>16807$ | Luas awal $\approx52{,}5$. |

### Bagian 6 — Selesai
- **Segel:** **C · D · E**
- **Pop-up:** "Luasnya berlipat 7 tiap tahun, jadi 343 kali dalam 3 tahun. Danau C, D, dan E yang luas awalnya lebih dari 49 m²."

### Pemeriksaan hasil
Uji batas: $49\cdot343=16807$ dan $17000>16807>16500$; satu-satunya pilihan di bawah ambang adalah A dan B. Cek konsistensi dengan grafik: $L(2)/L(0)=490/10=49=7^2$ ✓.

### Catatan sumber (tidak mengubah kunci)
Soal menyebut "dimodelkan dengan fungsi berikut", tetapi fungsi tidak tertulis; yang tersedia hanya grafik. Fungsi $L(t)=10\cdot7^t$ diturunkan dari tiga titik dan bentuk kurva (rasio tetap 7). Pembacaan **angka 10 pada sumbu tegak** disarankan dipastikan sekali lagi pada naskah asli. Asumsi bahwa semua danau memakai faktor 7 per tahun dituliskan di Bagian 3.

### Kesalahan umum / poin perhatian
- Membandingkan data (15.000 …) langsung dengan 49 tanpa membagi dengan faktor 343.
- Memakai $L(3)=10\cdot343=3430$ lalu membandingkan dengan data; data adalah luas tiap danau, bukan hasil model dengan $L_0=10$.
- Salah menghitung faktor 3 tahun sebagai $7\cdot3=21$.

---

## SOAL 11 — Kedalaman Air Laut

| Atribut | Isi |
|---|---|
| Topik | Fungsi trigonometri: menentukan model dari grafik dan menyelesaikan $y=\text{konstanta}$ |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **E** — 15 jam |
| Status | VALID |
| Visual utama | Grafik gelombang kosinus + titik berjalan (playbook §15: Trigonometri) |
| Aset gambar | `./grafik_kedalaman_air_laut.png` |

**Data dibaca dari gambar `grafik_kedalaman_air_laut.png`:** persamaan $y=a+b\cos\left(\frac16\pi t\right)$. Kurva mulai di **puncak 14,3 meter** pada $t=0$, turun ke **lembah 10,3 meter** pada $t=6$, naik lagi ke puncak **14,3 meter** pada $t=12$.

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Trigonometri
- **Judul hero:** `Pembahasan Soal` / `Pasang` + aksen `Surut` / sub `Kedalaman Air`
- **Lede:** Kedalaman air teluk naik-turun seperti gelombang kosinus. Kapan kedalamannya 12,3 meter untuk ketiga kalinya?
- **Fakta kunci:** Puncak → `14,3 m` · Lembah → `10,3 m` · Dicari → `waktu ke-3`
- **Ilustrasi lobi:** gelombang kosinus tergambar, tiga titik 12,3 m bernomor 1, 2, 3.

### Bagian 1 — Pahami soal
- **Stabilo:** persamaan $y=a+b\cos\left(\frac16\pi t\right)$ (merah, `@s-eq`), `14,3 meter` (merah, `@g-max`), `10,3 meter` (merah, `@g-min`), `t = 6 menyatakan 6 jam setelah pukul 00.00` (biru, `@s-t`), `12,3 meter untuk ketiga kalinya` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal dan grafik. Ada dua konstanta, $a$ dan $b$."
- **Langkah 1.2** — pop-up: "Diketahui: puncak 14,3 m dan lembah 10,3 m. **Ditanya**: waktu ke-3 saat $y=12{,}3$."

### Bagian 2 — Menentukan $a$ dan $b$
**Prasyarat konsep:** untuk $y=a+b\cos(kt)$, $a$ = garis tengah $=\dfrac{\text{maks}+\text{min}}{2}$ dan $b$ = amplitudo $=\dfrac{\text{maks}-\text{min}}{2}$ (positif karena kurva mulai dari puncak).

#### Langkah 2.1 — Garis tengah dan amplitudo
- **Pop-up:** "Garis tengah ada di tengah-tengah puncak dan lembah. Amplitudo adalah jarak dari garis tengah ke puncak."
- **Visual:** grafik; garis putus-putus tengah muncul di antara 10,3 dan 14,3; panah tegak menunjukkan amplitudo.
- **Papan:** judul "Garis tengah dan amplitudo".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $a=\dfrac{14{,}3+10{,}3}{2}$ | $14{,}3$←`@g-max`, $10{,}3$←`@g-min` | rata-rata puncak dan lembah | — |
| a2 | $a=\dfrac{24{,}6}{2}=12{,}3$ | — | — | `navy` |
| a3 | $b=\dfrac{14{,}3-10{,}3}{2}=\dfrac42=2$ | `@g-max`, `@g-min` | setengah selisih | `navy` |
| a4 | $y=12{,}3+2\cos\left(\frac16\pi t\right)$ | $12{,}3$←`a2`, $2$←`a3` | model lengkap | `gold` |

- **Pertanyaan cepat** (sebelum a2): "Nilai $a$ (garis tengah) adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $12{,}3$ | ya | — |
| $14{,}3$ | tidak | $14{,}3$ adalah puncak. Garis tengah ada di tengah antara puncak dan lembah. |
| $10{,}3$ | tidak | $10{,}3$ adalah lembah. Rata-ratakan puncak dan lembah. |
| $2$ | tidak | $2$ adalah amplitudo ($b$), bukan garis tengah. |

### Bagian 3 — Kapan $y=12{,}3$
#### Langkah 3.1 — Persamaan
- **Pop-up:** "Samakan $y$ dengan $12{,}3$. Suku konstan saling menghilang."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $12{,}3+2\cos\left(\frac16\pi t\right)=12{,}3$ | model←`a4` | — | — |
| b2 | $2\cos\left(\frac16\pi t\right)=0$ | — | $12{,}3$ dikurangkan | — |
| b3 | $\cos\left(\frac16\pi t\right)=0$ | — | dibagi 2 | `navy` |
| b4 | $\frac16\pi t=\frac\pi2+k\pi$ | — | kosinus nol di $\frac\pi2,\frac{3\pi}2,\frac{5\pi}2,\dots$ | — |
| b5 | $t=3+6k$ | — | kedua ruas dikali $\frac6\pi$ | `navy` |

#### Langkah 3.2 — Menghitung kemunculan
- **Pop-up:** "Untuk $k=0,1,2$ diperoleh kemunculan pertama, kedua, dan ketiga setelah pukul 00.00."
- **Visual:** titik berjalan di grafik; setiap kali melewati $y=12{,}3$ muncul penanda bernomor 1, 2, 3 di $t=3,9,15$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $k=0$: $t=3$ | `b5` | kemunculan ke-1 | — |
| c2 | $k=1$: $t=9$ | `b5` | kemunculan ke-2 | — |
| c3 | $k=2$: $t=15$ | `b5` | kemunculan ke-3 | `gold` |

- **Pertanyaan cepat** (sebelum c3): "Kemunculan ketiga terjadi pada $t=$…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $15$ | ya | — |
| $12$ | tidak | $t=12$ adalah puncak berikutnya (14,3 m), bukan saat $y=12{,}3$. |
| $9$ | tidak | $t=9$ baru kemunculan ke-2. |
| $10$ | tidak | Gelombang melewati garis tengah tiap setengah periode (6 jam), bukan tiap 5 jam. |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}a&=\frac{14{,}3+10{,}3}{2}=12{,}3,\quad b=\frac{14{,}3-10{,}3}{2}=2\\y&=12{,}3+2\cos\left(\tfrac16\pi t\right)\\y=12{,}3&\Rightarrow\cos\left(\tfrac16\pi t\right)=0\Rightarrow t=3+6k\\t&=3,\ 9,\ 15,\dots\end{aligned}$$

### Bagian 5 — Cocokkan dengan pilihan (kartu A–E)
| Kartu | Pilihan | Stempel | Alasan / jebakan |
|-------|---------|---------|------------------|
| A | 3 jam | SALAH | Kemunculan **pertama**. |
| B | 9 jam | SALAH | Kemunculan **kedua**. |
| C | 10 jam | SALAH | Bukan akar $t=3+6k$. |
| D | 12 jam | SALAH | Pada $t=12$ kedalaman 14,3 m (puncak). |
| E | 15 jam | BENAR | $k=2$: kemunculan ketiga. |

### Bagian 6 — Selesai
- **Segel:** **E**
- **Pop-up:** "Kedalaman 12,3 m tercapai pada $t=3,9,15$. Yang ketiga: **15 jam** setelah pukul 00.00."

### Pemeriksaan hasil
Periode: $\frac{2\pi}{\pi/6}=12$ jam, cocok dengan grafik (puncak di $t=0$ dan $t=12$). Substitusi: $y(15)=12{,}3+2\cos\left(\frac{15\pi}6\right)=12{,}3+2\cos\left(\frac{5\pi}2\right)=12{,}3+0$ ✓. Pada $t=0$ kedalaman 14,3 m, jadi $t=0$ bukan kemunculan.

### Kesalahan umum / poin perhatian
- Salah menghitung urutan: dalam satu periode (12 jam) garis tengah dilewati **dua** kali ($t=3$ dan $t=9$); kemunculan ketiga baru terjadi di periode berikutnya ($t=15$).
- Menjawab 12 jam karena menganggapnya "akhir satu siklus".

---

## SOAL 12 — Panjang Vektor 3D

| Atribut | Isi |
|---|---|
| Topik | Vektor di ruang: panjang vektor dan persamaan kuadrat |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **B** — $m=-4$ atau $m=3$ |
| Status | VALID |
| Visual utama | 3D kerangka: balok dengan diagonal ruang (playbook §15: Dimensi tiga) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Vektor
- **Judul hero:** `Pembahasan Soal` / `Panjang` + aksen `Vektor` / sub `Ruang 3D`
- **Lede:** Vektor $\vec{AB}$ punya tiga komponen yang bergantung pada $m$, dan panjangnya 9. Berapa nilai $m$?
- **Fakta kunci:** Panjang → `9 satuan` · Komponen → `2m, m+3, m` · Dicari → `m`
- **Ilustrasi lobi:** balok kerangka dengan diagonal ruang berlabel 9.

### Bagian 1 — Pahami soal
- **Stabilo:** $\vec{AB}=\begin{pmatrix}2m\\m+3\\m\end{pmatrix}$ (merah, `@s-v`), `panjang 9 satuan` (merah, `@s-9`), `nilai m` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. Vektor punya tiga komponen yang semuanya memuat $m$."
- **Langkah 1.2** — pop-up: "Diketahui: panjang $\vec{AB}=9$. **Ditanya**: nilai $m$."

### Bagian 2 — Panjang vektor
**Prasyarat konsep:** untuk $\vec v=(x,y,z)$, $|\vec v|=\sqrt{x^2+y^2+z^2}$ (teorema Pythagoras tiga dimensi: diagonal ruang balok).

#### Langkah 2.1 — Persamaan panjang
- **Pop-up:** "Kuadratkan setiap komponen, jumlahkan, lalu samakan dengan $9^2$."
- **Visual:** balok kerangka dengan rusuk $2m$, $m+3$, $m$; diagonal ruang (emas) berlabel $|\vec{AB}|=9$. Slider $m$ mengubah ukuran rusuk dan menampilkan panjang diagonal.
- **Papan:** judul "Persamaan panjang".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $\lvert\vec{AB}\rvert=\sqrt{x^2+y^2+z^2}$ | — | rumus panjang vektor | — |
| a2 | $9=\sqrt{(2m)^2+(m+3)^2+m^2}$ | $9$←`@s-9`; komponen←`@s-v` | masukkan komponen | — |
| a3 | $81=4m^2+(m^2+6m+9)+m^2$ | $81$ dari $9^2$ | kedua ruas dikuadratkan; $(m+3)^2=m^2+6m+9$ | — |
| a4 | $81=6m^2+6m+9$ | — | $4m^2+m^2+m^2=6m^2$ | `navy` |

- **Pertanyaan cepat** (sebelum a4): "Hasil $(m+3)^2$ adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $m^2+6m+9$ | ya | — |
| $m^2+9$ | tidak | Suku tengah terlewat. $(a+b)^2=a^2+2ab+b^2$, dengan $2ab=2\cdot m\cdot3=6m$. |
| $m^2+3$ | tidak | Yang dikuadratkan juga angka 3: $3^2=9$, bukan $3$. |

#### Langkah 2.2 — Menyelesaikan persamaan kuadrat
- **Pop-up:** "Kurangi 81 di kedua ruas, sederhanakan, lalu faktorkan."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $6m^2+6m+9-81=0$ | — | 81 pindah ruas | — |
| b2 | $6m^2+6m-72=0$ | — | $9-81=-72$ | — |
| b3 | $m^2+m-12=0$ | — | dibagi 6 | `navy` |
| b4 | $(m+4)(m-3)=0$ | — | $4\cdot(-3)=-12$ dan $4+(-3)=1$ | — |
| b5 | $m=-4$ atau $m=3$ | — | tiap faktor sama dengan nol | `gold` |

### Bagian 3 — Catatan lengkap
$$\begin{aligned}\lvert\vec{AB}\rvert^2&=(2m)^2+(m+3)^2+m^2=6m^2+6m+9\\6m^2+6m+9&=81\\m^2+m-12&=0\\(m+4)(m-3)&=0\Rightarrow m=-4\ \text{atau}\ m=3\end{aligned}$$

### Bagian 4 — Cocokkan dengan pilihan (kartu A–E)
Uji tiap nilai $m$: $6m^2+6m+9=81$?

| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| A | −4 atau −3 | SALAH | $m=-3$: $6\cdot9-18+9=45\ne81$ | $m=-3$ bukan akar. |
| B | −4 atau 3 | BENAR | $m=-4$: $96-24+9=81$; $m=3$: $54+18+9=81$ | Kedua akar memenuhi. |
| C | −3 atau 4 | SALAH | $m=4$: $96+24+9=129\ne81$ | Tanda kedua akar terbalik. |
| D | 3 atau 4 | SALAH | $m=4$ tidak memenuhi | $4$ bukan akar. |
| E | −4 atau 4 | SALAH | $m=4$: $96+24+9=129\ne81$ | Hanya $-4$ yang akar; jebakan menganggap akarnya $\pm4$. *(Opsi E naskah asli "4 atau 3" sama isinya dengan D; diganti 20 Okt 2026, kunci tetap B.)* |

### Bagian 5 — Selesai
- **Segel:** **B**
- **Pop-up:** "Vektornya $(-8,-1,-4)$ untuk $m=-4$ atau $(6,6,3)$ untuk $m=3$; keduanya berpanjang 9."

### Pemeriksaan hasil
$m=-4$: $\vec{AB}=(-8,-1,-4)$, $64+1+16=81$ ✓. $m=3$: $\vec{AB}=(6,6,3)$, $36+36+9=81$ ✓.

### Kesalahan umum / poin perhatian
- Menyamakan jumlah kuadrat dengan 9 (bukan 81).
- Lupa suku tengah pada $(m+3)^2$.
- Menganggap hanya satu nilai $m$ yang cocok; persamaan kuadrat memberi dua akar dan keduanya harus diuji terhadap panjang 9.

---

## SOAL 13 — Trapesium Sama Kaki

| Atribut | Isi |
|---|---|
| Topik | Vektor di bidang: geometri koordinat dan sifat trapesium sama kaki |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **C** — $a^2+2b=9$ (dengan $a=-1$, $b=4$) |
| Status | VALID (soal tanpa gambar; semua data dari teks) |
| Visual utama | Bidang koordinat SVG (playbook §15: Dimensi dua dengan vektor) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Vektor
- **Judul hero:** `Pembahasan Soal` / `Trapesium` + aksen `Sama Kaki` / sub `Vektor`
- **Lede:** Tiga vektor membentuk trapesium sama kaki $ABCD$ dengan $A$ di titik asal. Cari komponen $\vec{BC}$.
- **Fakta kunci:** $\vec{AD}$ → `(1, 4)` · $\vec{AB}$ → `(6, 0)` · Dicari → `a² + 2b`
- **Ilustrasi lobi:** trapesium tergambar di bidang koordinat, dua kakinya berwarna merah.

### Bagian 1 — Pahami soal
- **Stabilo:** `A(0, 0)` (merah, `@s-A`), `AD = BC` (biru, `@s-kaki`), $\vec{AD}=(1,4)$ (merah, `@s-AD`), $\vec{AB}=(6,0)$ (merah, `@s-AB`), $\vec{BC}=(a,b)$ (biru, `@s-BC`), $a^2+2b$ (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. Sisi $AD$ dan $BC$ adalah **kaki** trapesium (sama panjang)."
- **Langkah 1.2** — pop-up: "Diketahui dua vektor dan titik $A$. **Ditanya**: $a^2+2b$."

### Bagian 2 — Menentukan titik-titik
**Prasyarat konsep:** vektor posisi dan vektor antara dua titik: $\vec{PQ}=Q-P$. Trapesium sama kaki: sepasang sisi sejajar (alas), kedua kaki sama panjang, dan bangun simetris terhadap garis tegak lurus alas melalui titik tengahnya.

#### Langkah 2.1 — Titik $B$ dan $D$
- **Pop-up:** "Karena $A$ di titik asal, titik $B$ dan $D$ sama dengan vektor $\vec{AB}$ dan $\vec{AD}$."
- **Visual:** $A(0,0)$, $B(6,0)$, $D(1,4)$ muncul di bidang koordinat; alas $AB$ berwarna biru, kaki $AD$ merah.
- **Papan:** judul "Titik sudut".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $B=A+\vec{AB}=(0,0)+(6,0)$ | $(6,0)$←`@s-AB` | — | — |
| a2 | $B=(6,0)$ | — | — | `navy` |
| a3 | $D=A+\vec{AD}=(0,0)+(1,4)$ | $(1,4)$←`@s-AD` | — | — |
| a4 | $D=(1,4)$ | — | — | `navy` |

#### Langkah 2.2 — Titik $C$ dan $\vec{BC}$
- **Pop-up:** "Alas $AB$ sejajar $DC$ dan bangun simetris terhadap garis $x=3$ (tegak lurus alas melalui titik tengah $AB$)."
- **Visual:** garis simetri $x=3$ putus-putus; $D$ dicerminkan ke kanan menjadi $C(5,4)$ dengan animasi.
- **Papan:**

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | titik tengah $AB$: $x=\dfrac{0+6}{2}=3$ | $0,6$←`a2` | sumbu simetri $x=3$ | — |
| b2 | $D=(1,4)$ dicerminkan terhadap $x=3$ | $D$←`a4` | $1\to3+(3-1)=5$ | — |
| b3 | $C=(5,4)$ | — | tinggi tetap $4$ | `navy` |
| b4 | $\vec{BC}=C-B=(5-6,\ 4-0)$ | $B$←`a2`, $C$←`b3` | — | — |
| b5 | $\vec{BC}=(-1,\ 4)$ | — | $a=-1$, $b=4$ | `gold` |

- **Pertanyaan cepat** (sebelum b3): "Kenapa $C$ berada di ketinggian $y=4$?"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| Karena $DC$ harus sejajar alas $AB$ yang mendatar | ya | — |
| Karena $C$ harus sama panjang dengan $D$ | tidak | Yang sama panjang adalah kaki $AD$ dan $BC$, bukan titik $C$ dengan $D$. |
| Karena $B$ berada di $y=0$ | tidak | $B$ memang di $y=0$, tetapi alasannya adalah sisi $DC$ sejajar sisi $AB$. |

#### Langkah 2.3 — Menguji kaki sama panjang
- **Pop-up:** "Periksa panjang kedua kaki: $|AD|$ dan $|BC|$."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $\lvert\vec{AD}\rvert=\sqrt{1^2+4^2}=\sqrt{17}$ | $\vec{AD}$←`a3` | — | — |
| c2 | $\lvert\vec{BC}\rvert=\sqrt{(-1)^2+4^2}=\sqrt{17}$ | $\vec{BC}$←`b5` | sama panjang | `navy` |

#### Langkah 2.4 — Menghitung $a^2+2b$
| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| d1 | $a^2+2b=(-1)^2+2(4)$ | $a$, $b$←`b5` | — | — |
| d2 | $a^2+2b=1+8$ | — | $(-1)^2=1$ | — |
| d3 | $a^2+2b=9$ | — | — | `gold` |

### Bagian 3 — Catatan lengkap
$$\begin{aligned}B&=(6,0),\quad D=(1,4)\\&\text{sumbu simetri }x=3\Rightarrow C=(5,4)\\\vec{BC}&=C-B=(-1,4)\Rightarrow a=-1,\ b=4\\\lvert\vec{BC}\rvert&=\sqrt{17}=\lvert\vec{AD}\rvert\\a^2+2b&=1+8=9\end{aligned}$$

### Bagian 4 — Cocokkan dengan pilihan (kartu A–E)
Pin: $a=-1$, $b=4$.

| Kartu | Pilihan | Stempel | Alasan / jebakan |
|-------|---------|---------|------------------|
| A | 5 | SALAH | Tidak sama dengan $(-1)^2+2(4)=9$. |
| B | 7 | SALAH | Tidak sama dengan $9$. |
| C | 9 | BENAR | $a^2+2b=1+8=9$. |
| D | 10 | SALAH | Tidak sama dengan $9$. |
| E | 13 | SALAH | Tidak sama dengan $9$. |

*Ditambahkan M2 (20 Okt 2026; kunci tidak berubah), dipakai di `app/src/content/soal/q13.ts`:*
- **Bagian 1, papan:**
  - langkah 1.1: k1 Diketahui, k2 $AD=BC$ (`@s-kaki`);
  - langkah 1.2: k3 $A(0,0)$, k4 $\vec{AD}$ dan $\vec{AB}$, k5 $\vec{BC}=(a,b)$, k6 Ditanya $a^2+2b$.
- **Visual Bagian 2:** bidang koordinat SVG dengan tahap:
  - `pts` (2.1);
  - `sym` (2.2): garis $x=3$ dan $C$ bergerak dari posisi $D$ ke $(5,4)$;
  - `legs` (2.3): kedua kaki $\sqrt{17}$;
  - `final` (2.4): alas atas $DC$.
- **Pin** dipakai agar angka terbang antarpapan: $B$ dan $D$ untuk b1–b4; $\vec{AD}$ dan $\vec{BC}$ untuk c1–d1. Pop-up 2.4: "Masukkan $a=-1$ dan $b=4$ ke $a^2+2b$."
- **Langkah 2.3 (opsional) "Mengapa bukan a = 1?":** isi *Pemeriksaan hasil* (kasus $a=+1$ menghasilkan jajargenjang).
- **Bagian 4:** rumus singkat kartu $5\ne9$ … $1+8=9$; papan ringkasan s1–s6; pertanyaan berhuruf A–E.
- **Ringkasan `LR`:** $C=(5,4)$, $\vec{BC}=(-1,4)$ (navy) · $a^2+2b=9$ (emas) · **Jawaban C** (emas).

### Bagian 5 — Selesai
- **Segel:** **C**
- **Pop-up:** "$\vec{BC}=(-1,4)$, sehingga $a^2+2b=1+8=\mathbf{9}$."

### Pemeriksaan hasil
Uji dengan syarat panjang saja: $a^2+b^2=17$. Agar $DC\parallel AB$ harus $b=4$ (jika $b=-4$, titik $C$ di bawah alas dan $ABCD$ tidak menjadi trapesium). Maka $a=\pm1$. Untuk $a=+1$, $C=(7,4)$ dan $\vec{DC}=(6,0)=\vec{AB}$, sehingga bangunnya **jajargenjang**, bukan trapesium sama kaki; untuk $a=-1$, $C=(5,4)$, $DC=4\neq AB=6$, sehingga trapesium sama kaki. Kebetulan $a^2=1$ pada kedua kasus, jadi $a^2+2b=9$ tidak berubah; tetapi alasan geometrisnya memilih $a=-1$.

### Kesalahan umum / poin perhatian
- Menyalin $\vec{BC}=\vec{AD}=(1,4)$ hanya karena $AD=BC$; itu menghasilkan jajargenjang.
- Mengabaikan syarat bahwa $DC$ sejajar $AB$ sehingga komponen $b$ tidak boleh sembarang.

---

## SOAL 14 — Kereta Api dan Koordinat 3D

| Atribut | Isi |
|---|---|
| Topik | Vektor di ruang: jarak antartitik dan perbandingan pada kecepatan konstan |
| Jenis respons | Multi-jawaban: pilih semua pasangan stasiun yang benar (5 pilihan) |
| Jawaban akhir | **BC, CD, DE** (AB dan CE tidak memenuhi) |
| Status | VALID |
| Visual utama | 3D kerangka garis $A\to E$ (playbook §15: Dimensi tiga) dan diagram waktu |
| Aset gambar | `./jarak_kereta_api.png` |

**Data dibaca dari gambar `jarak_kereta_api.png`:** arah laju kereta dari A ke E. Waktu tempuh: A–B **5 menit**, B–C **3 menit**, C–D **2 menit**, D–E **3 menit**. Koordinat (dari teks soal, dalam km): $A(2,3,5)$ dan $E(11,6,8)$.

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Vektor di ruang
- **Judul hero:** `Pembahasan Soal` / `Jarak` + aksen `Stasiun` / sub `Kereta Api`
- **Lede:** Kereta melaju lurus dan konstan dari A ke E. Dari koordinat A dan E serta waktu antarstasiun, kita cari pasangan stasiun yang jaraknya kurang dari 3,5 km.
- **Fakta kunci:** Waktu A–E → `13 menit` · Ambang → `3,5 km` · Dicari → `pasangan < 3,5 km`
- **Ilustrasi lobi:** garis lurus 3D dari A ke E dengan lima stasiun; kereta bergerak di atasnya.

### Bagian 1 — Pahami soal
- **Stabilo:** `kecepatan konstan` (biru, `@s-konstan`), `lintasan lurus` (biru, `@s-lurus`), `A (2,3,5)` dan `E (11,6,8)` (merah, `@s-AE`), waktu 5, 3, 2, 3 menit pada gambar (merah, `@t-AB`, `@t-BC`, `@t-CD`, `@t-DE`), `jaraknya kurang dari 3,5 km` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal dan lihat diagram waktu antarstasiun."
- **Langkah 1.2** — pop-up: "Kecepatan **konstan** dan lintasan **lurus**: jarak sebanding dengan waktu tempuh."
- **Langkah 1.3** — pop-up: "Ditanya: pasangan stasiun yang jaraknya kurang dari 3,5 km."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | $A(2,3,5)$, $E(11,6,8)$ | `@s-AE` | dalam km | — |
| k3 | waktu: AB $=5$, BC $=3$, CD $=2$, DE $=3$ menit | `@t-AB`, `@t-BC`, `@t-CD`, `@t-DE` | dari diagram | — |
| k4 | **Ditanya** (label) jarak $<3{,}5$ km | `@s-tanya` | pasangan stasiun | — |

### Bagian 2 — Jarak $A$ ke $E$
**Prasyarat konsep:** jarak dua titik $P(x_1,y_1,z_1)$ dan $Q(x_2,y_2,z_2)$ adalah $\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}$.

#### Langkah 2.1 — Vektor $AE$ dan panjangnya
- **Pop-up:** "Kurangkan koordinat $E$ dengan $A$, lalu hitung panjangnya."
- **Visual:** kerangka 3D memperlihatkan $A$ dan $E$ sebagai sudut-sudut balok dengan rusuk 9, 3, 3; diagonal ruang $AE$ berwarna emas.
- **Papan:** judul "Jarak $A$ ke $E$".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $\vec{AE}=E-A=(11-2,\ 6-3,\ 8-5)$ | $A,E$←`@s-AE` | — | — |
| a2 | $\vec{AE}=(9,\ 3,\ 3)$ | — | — | `navy` |
| a3 | $\lvert AE\rvert=\sqrt{9^2+3^2+3^2}$ | komponen←`a2` | — | — |
| a4 | $\lvert AE\rvert=\sqrt{81+9+9}=\sqrt{99}$ | — | — | — |
| a5 | $\lvert AE\rvert=3\sqrt{11}\approx9{,}95$ km | — | $\sqrt{99}=\sqrt{9\cdot11}$ | `navy` |

- **Pertanyaan cepat** (sebelum a4): "Berapa $9^2+3^2+3^2$?"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| 99 | ya | — |
| 15 | tidak | Itu jumlah komponen $9+3+3$. Kuadratkan dahulu setiap komponen. |
| 90 | tidak | Ketiga kuadrat dijumlahkan: $81+9+9=99$. |

### Bagian 3 — Jarak berbanding lurus dengan waktu
**Prasyarat konsep:** pada kecepatan konstan $v$, jarak $=v\times$ waktu. Pada lintasan lurus, jarak $C$–$E$ adalah jumlah jarak $C$–$D$ dan $D$–$E$.

#### Langkah 3.1 — Kecepatan kereta
- **Pop-up:** "Total waktu A ke E adalah 13 menit untuk jarak $3\sqrt{11}$ km. Dari situ kecepatannya ketemu."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | waktu $A\to E=5+3+2+3$ | $5,3,2,3$←`k3` | — | — |
| b2 | waktu $A\to E=13$ menit | — | — | `navy` |
| b3 | $v=\dfrac{3\sqrt{11}}{13}\ \text{km/menit}$ | $3\sqrt{11}$←`a5`, $13$←`b2` | $v=\frac{\text{jarak}}{\text{waktu}}$ | — |
| b4 | $v\approx0{,}765$ km/menit | — | — | `navy` |

#### Langkah 3.2 — Jarak tiap pasangan
- **Pop-up:** "Kalikan kecepatan dengan waktu tiap pasangan. Untuk $CE$, jumlahkan waktu $CD$ dan $DE$."
- **Visual:** garis lurus dibagi proporsional 5 : 3 : 2 : 3; label jarak tiap segmen muncul. Segmen yang kurang dari 3,5 km berwarna emas, yang lainnya merah.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $AB=0{,}765\times5\approx3{,}83$ km | $5$←`@t-AB`, $v$←`b4` | $>3{,}5$ | — |
| c2 | $BC=0{,}765\times3\approx2{,}30$ km | $3$←`@t-BC` | $<3{,}5$ | `gold` |
| c3 | $CD=0{,}765\times2\approx1{,}53$ km | $2$←`@t-CD` | $<3{,}5$ | `gold` |
| c4 | $DE=0{,}765\times3\approx2{,}30$ km | $3$←`@t-DE` | $<3{,}5$ | `gold` |
| c5 | $CE$: waktu $=2+3=5$ menit, jarak $\approx3{,}83$ km | $2$←`@t-CD`, $3$←`@t-DE` | $>3{,}5$ | — |

- **Pertanyaan cepat** (sebelum c5): "Waktu kereta dari C ke E adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| 5 menit | ya | — |
| 3 menit | tidak | Itu waktu $DE$. Dari $C$ ke $E$ kereta melewati $CD$ dan $DE$. |
| 8 menit | tidak | Itu waktu $BE$ atau $AC$; $CE$ hanya $CD+DE=2+3$. |

- **Cara cepat (opsional):** ambang waktu $t<\dfrac{3{,}5}{v}=\dfrac{3{,}5\cdot13}{3\sqrt{11}}\approx4{,}57$ menit. Semua segmen yang waktunya kurang dari sekitar 4,6 menit lolos: 3, 2, 3 ya; 5, 5 tidak.

### Bagian 4 — Catatan lengkap
$$\begin{aligned}\vec{AE}&=(9,3,3),\quad \lvert AE\rvert=\sqrt{99}=3\sqrt{11}\approx9{,}95\\v&=\frac{3\sqrt{11}}{13}\approx0{,}765\ \text{km/menit}\\AB&=5v\approx3{,}83,\ BC=3v\approx2{,}30,\ CD=2v\approx1{,}53,\ DE=3v\approx2{,}30\\CE&=CD+DE=5v\approx3{,}83\end{aligned}$$
(Koordinat hasil pembagian proporsional, opsional untuk label 3D: $B\approx(5{,}46;\,4{,}15;\,6{,}15)$, $C\approx(7{,}54;\,4{,}85;\,6{,}85)$, $D\approx(8{,}92;\,5{,}31;\,7{,}31)$.)

### Bagian 5 — Analisis pilihan (5 kartu)
Pin: $v\approx0{,}765$ km/menit; ambang $3{,}5$ km.

| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| AB | $AB$ | SALAH | $5v\approx3{,}83>3{,}5$ | Waktu terpanjang (5 menit). |
| BC | $BC$ | BENAR | $3v\approx2{,}30<3{,}5$ | — |
| CD | $CD$ | BENAR | $2v\approx1{,}53<3{,}5$ | Pasangan terdekat. |
| DE | $DE$ | BENAR | $3v\approx2{,}30<3{,}5$ | — |
| CE | $CE$ | SALAH | $(2+3)v\approx3{,}83>3{,}5$ | Jebakan: $CE$ tidak muncul sebagai satu segmen pada diagram; harus dijumlah dari $CD$ dan $DE$. |

### Bagian 6 — Selesai
- **Segel:** **BC, CD, DE**
- **Pop-up:** "Dengan kecepatan konstan, jarak sebanding dengan waktu. $BC$, $CD$, dan $DE$ kurang dari 3,5 km; $AB$ dan $CE$ sekitar 3,83 km."

### Pemeriksaan hasil
Jumlah semua segmen: $3{,}83+2{,}30+1{,}53+2{,}30=9{,}95\approx3\sqrt{11}$ ✓. Metode kedua (eksak): $AB=CE=\dfrac{15\sqrt{11}}{13}$ dan $\left(\dfrac{15\sqrt{11}}{13}\right)^2=\dfrac{2475}{169}\approx14{,}65>12{,}25=3{,}5^2$; $BC=DE=\dfrac{9\sqrt{11}}{13}$, kuadratnya $\dfrac{891}{169}\approx5{,}27<12{,}25$.

### Kesalahan umum / poin perhatian
- Memakai waktu langsung sebagai jarak (membandingkan 5 menit dengan 3,5 km).
- Memperlakukan $CE$ sebagai segmen tunggal bernilai 3 menit.
- Memakai jarak $A$–$E$ sebagai satu langkah tanpa membaginya sebanding dengan waktu.

---

## SOAL 15 — Lingkaran yang Sepusat

| Atribut | Isi |
|---|---|
| Topik | Lingkaran: pusat dan bentuk umum persamaan |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **A** — $x^2+6x+y^2-8y+16=0$ |
| Status | VALID |
| Visual utama | Bidang koordinat SVG dengan lingkaran dan titik pusat (playbook §15: grafik) |
| Aset gambar | `./lingkaran_A.png` |

**Data dibaca dari gambar `lingkaran_A.png`:** lingkaran diberi nama "Lingkaran A" dengan titik pusat **p** yang berada di perpotongan garis $x=-3$ (di antara label $-4$ dan $-2$) dan garis $y=4$. Sebuah diameter menghubungkan dua titik pada lingkaran dan melewati $p$; diameter (dari teks soal) $=4$ satuan, sehingga jari-jari $2$. Pusat dikonfirmasi sebagai titik tengah diameter: $(-3,4)$.

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Lingkaran
- **Judul hero:** `Pembahasan Soal` / `Lingkaran` + aksen `Sepusat` / sub `Koordinat`
- **Lede:** Lingkaran A sudah digambar di bidang koordinat. Persamaan mana yang menggambarkan lingkaran lain dengan pusat yang sama?
- **Fakta kunci:** Diameter → `4 satuan` · Pusat → `terbaca dari grafik` · Dicari → `persamaan sepusat`
- **Ilustrasi lobi:** lingkaran A di bidang koordinat, lingkaran kedua melebar dari titik pusat yang sama.

### Bagian 1 — Pahami soal
- **Stabilo:** `Diameter lingkaran 4 satuan` (merah, `@s-d`), `sepusat` (biru, `@s-pusat`), `persamaan lingkaran yang sepusat` (emas, `@s-tanya`). Titik **p** pada gambar diberi `data-src="@g-p"`.
- **Langkah 1.1** — pop-up: "Baca soal. Kata kuncinya **sepusat**: pusatnya sama, jari-jarinya boleh berbeda."
- **Langkah 1.2** — pop-up: "Kita perlu **pusat** lingkaran A. Bacalah dari grafik."

### Bagian 2 — Membaca pusat dari grafik
#### Langkah 2.1 — Pusat lingkaran A
- **Pop-up:** "Titik $p$ berada tepat di tengah diameter. Bacalah koordinatnya dari garis kisi."
- **Visual:** gambar koordinat; garis putus-putus dari $p$ ke sumbu mendatar ($x=-3$) dan ke sumbu tegak ($y=4$).
- **Papan:** judul "Pusat lingkaran A".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | pusat $=p$ | $p$←`@g-p` | titik tengah diameter | — |
| a2 | $p=(-3,\ 4)$ | — | $x$ di antara $-4$ dan $-2$ → $-3$; $y=4$ | `navy` |

- **Pertanyaan cepat** (sebelum a2): "Titik $p$ berada di antara $x=-4$ dan $x=-2$ serta tepat pada $y=4$. Koordinatnya…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $(-3,4)$ | ya | — |
| $(4,-3)$ | tidak | Urutan koordinat tertukar. Pertama $x$ (mendatar), baru $y$ (tegak). |
| $(3,4)$ | tidak | $x$ berada di sebelah **kiri** sumbu tegak, jadi negatif. |

### Bagian 3 — Pusat dari bentuk umum persamaan
**Prasyarat konsep:** lingkaran $x^2+y^2+Ax+By+C=0$ berpusat di $\left(-\dfrac A2,\ -\dfrac B2\right)$ dan berjari-jari $\sqrt{\dfrac{A^2}{4}+\dfrac{B^2}{4}-C}$. Dalam soal ini bentuk ditulis $x^2+Ax+y^2+By+C=0$.

#### Langkah 3.1 — Pusat tiap pilihan
- **Pop-up:** "Dari setiap persamaan, pusatnya adalah $\left(-\frac A2,-\frac B2\right)$."
- **Papan:** judul "Pusat tiap pilihan"; pin: $p=(-3,4)$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | A: $A=6$, $B=-8$ → pusat $\left(-\frac62,\ -\frac{-8}2\right)=(-3,\ 4)$ | — | cocok dengan $p$ | `gold` |
| b2 | B: $A=-6$, $B=-8$ → pusat $(3,\ 4)$ | — | $x$ salah tanda | — |
| b3 | C: $A=6$, $B=8$ → pusat $(-3,\ -4)$ | — | $y$ salah tanda | — |
| b4 | D: $A=-8$, $B=-6$ → pusat $(4,\ 3)$ | — | $x$ dan $y$ tertukar | — |
| b5 | E: $A=8$, $B=-6$ → pusat $(-4,\ 3)$ | — | $x$ dan $y$ tertukar | — |

#### Langkah 3.2 — Melengkapkan kuadrat untuk pilihan A
- **Pop-up:** "Kita pastikan pilihan A dengan melengkapkan kuadrat."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $x^2+6x+y^2-8y+16=0$ | — | pilihan A | — |
| c2 | $(x^2+6x+9)+(y^2-8y+16)=-16+9+16$ | — | $\left(\frac62\right)^2=9$; $\left(\frac82\right)^2=16$ | — |
| c3 | $(x+3)^2+(y-4)^2=9$ | — | pusat $(-3,4)$, jari-jari $3$ | `gold` |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}\text{pusat lingkaran A}&=(-3,4)\\x^2+6x+y^2-8y+16&=0\\(x+3)^2+(y-4)^2&=9\end{aligned}$$
Lingkaran A sendiri: $(x+3)^2+(y-4)^2=4$, yaitu $x^2+6x+y^2-8y+21=0$. Pilihan A memakai pusat sama dengan jari-jari 3, jadi sepusat tetapi tidak sama dengan lingkaran A.

### Bagian 5 — Cocokkan dengan pilihan (kartu A–E)
| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| A | $x^2+6x+y^2-8y+16=0$ | BENAR | pusat $(-3,4)$, $r=3$ | Sepusat dengan lingkaran A. |
| B | $x^2-6x+y^2-8y+21=0$ | SALAH | pusat $(3,4)$, $r=2$ | Jebakan: konstanta 21 dan jari-jari 2 cocok dengan diameter 4, tetapi pusatnya salah. |
| C | $x^2+6x+y^2+8y+16=0$ | SALAH | pusat $(-3,-4)$ | Tanda $y$ salah. |
| D | $x^2-8x+y^2-6y+16=0$ | SALAH | pusat $(4,3)$ | $x$ dan $y$ tertukar. |
| E | $x^2+8x+y^2-6y+21=0$ | SALAH | pusat $(-4,3)$ | $x$ dan $y$ tertukar. |

### Bagian 6 — Selesai
- **Segel:** **A**
- **Pop-up:** "Pusat lingkaran A adalah $(-3,4)$. Hanya pilihan A yang berpusat di sana."

### Pemeriksaan hasil
Pusat dari grafik $(-3,4)$ sama dengan pusat pilihan A yang dihitung dari koefisien. Titik ujung diameter pada gambar kira-kira $(-4;\,5{,}75)$ dan $(-2;\,2{,}25)$ berjarak $\sqrt{4+12{,}25}\approx4{,}03\approx4$ ✓ dan titik tengahnya $(-3,4)$.

### Kesalahan umum / poin perhatian
- Mengira "sepusat" berarti jari-jari juga sama; padahal hanya pusat yang harus sama.
- Salah tanda pada $-\frac A2$ dan $-\frac B2$ (pusat $(-3,4)$ muncul dari $+6x$ dan $-8y$).
- Menukar $x$ dan $y$.

---

## SOAL 16 — Titik Singgung Tegak Lurus Garis f

| Atribut | Isi |
|---|---|
| Topik | Lingkaran dan garis singgung; gradien garis tegak lurus |
| Jenis respons | Multi-jawaban: pilih semua titik singgung yang benar (5 pilihan) |
| Jawaban akhir | **(3, −1)** dan **(1, −5)** |
| Status | VALID |
| Visual utama | Bidang koordinat SVG: lingkaran, garis $f$, garis singgung (playbook §15: grafik) |
| Aset gambar | `./garis_dan_lingkaran.png` |

**Data dibaca dari gambar `garis_dan_lingkaran.png`:** garis $f$ melalui $C(-1,0)$ dan $D(0,2)$. Lingkaran $c$ berpusat di $A(2,-3)$ dan melalui $B(3,-1)$.

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Lingkaran
- **Judul hero:** `Pembahasan Soal` / `Titik` + aksen `Singgung` / sub `Garis Tegak Lurus`
- **Lede:** Ada lingkaran dan garis $f$. Garis singgung yang tegak lurus $f$ menyentuh lingkaran di titik mana saja?
- **Fakta kunci:** Pusat → `A(2, −3)` · Garis $f$ → `melalui C dan D` · Dicari → `titik singgung`
- **Ilustrasi lobi:** garis $f$ dan lingkaran $c$ tergambar; dua garis singgung tegak lurus $f$ menyala bergantian.

### Bagian 1 — Pahami soal
- **Stabilo:** `garis-garis singgung lingkaran` (biru, `@s-singgung`), `tegak lurus terhadap garis f` (merah, `@s-tegak`), `semua koordinat titik singgung` (emas, `@s-tanya`). Titik pada gambar: `@g-A` (pusat), `@g-B`, `@g-C`, `@g-D`.
- **Langkah 1.1** — pop-up: "Baca soal dan lihat gambarnya. Garis $f$ dan lingkaran $c$ sudah digambar."
- **Langkah 1.2** — pop-up: "Kita butuh arah garis $f$, serta pusat dan jari-jari lingkaran."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | $f$ melalui $C(-1,0)$ dan $D(0,2)$ | `@g-C`, `@g-D` | — | — |
| k3 | lingkaran: pusat $A(2,-3)$, melalui $B(3,-1)$ | `@g-A`, `@g-B` | — | — |
| k4 | **Ditanya** (label) titik singgung garis $\perp f$ | `@s-tanya` | — | — |

### Bagian 2 — Arah garis $f$ dan jari-jari lingkaran
#### Langkah 2.1 — Gradien $f$
- **Pop-up:** "Hitung gradien $f$ dari dua titik yang dilaluinya."
- **Papan:** judul "Garis f".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $m_f=\dfrac{y_D-y_C}{x_D-x_C}$ | — | rumus gradien | — |
| a2 | $m_f=\dfrac{2-0}{0-(-1)}$ | $C,D$←`k2` | — | — |
| a3 | $m_f=2$ | — | arah $f$: naik 2 untuk tiap 1 ke kanan | `navy` |

- **Pertanyaan cepat** (sebelum a3): "Gradien garis melalui $(-1,0)$ dan $(0,2)$ adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $2$ | ya | — |
| $\frac12$ | tidak | Gradien = perubahan $y$ dibagi perubahan $x$: $2$ dibagi $1$, bukan sebaliknya. |
| $-2$ | tidak | Garis $f$ naik ke kanan pada gambar, jadi gradiennya positif. |

#### Langkah 2.2 — Jari-jari lingkaran
- **Pop-up:** "Jari-jari adalah jarak dari pusat $A$ ke titik $B$ yang ada di lingkaran."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $r^2=(3-2)^2+(-1-(-3))^2$ | $A,B$←`k3` | jarak $AB$ | — |
| b2 | $r^2=1+4=5$ | — | — | — |
| b3 | $r=\sqrt5$ | — | — | `navy` |

### Bagian 3 — Titik singgung
**Prasyarat konsep:** garis singgung selalu tegak lurus jari-jari di titik singgung. Jika garis singgungnya tegak lurus $f$, maka jari-jari **sejajar** $f$ (dua kali tegak lurus).

#### Langkah 3.1 — Jari-jari sejajar $f$
- **Pop-up:** "Garis singgung $\perp$ jari-jari dan garis singgung $\perp f$. Jadi jari-jari sejajar $f$, arahnya $(1,2)$."
- **Visual:** dua panah dari pusat $A$ searah $f$ (naik dan turun) menyentuh lingkaran; garis singgung tegak lurus panah di ujungnya.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | arah $f$: $(1,2)$ | $m_f$←`a3` | gradien 2 → geser 1, naik 2 | — |
| c2 | panjang arah $=\sqrt{1^2+2^2}=\sqrt5=r$ | $r$←`b3` | vektor $(1,2)$ sudah sepanjang jari-jari | `navy` |
| c3 | $T=A\pm(1,2)=(2\pm1,\ -3\pm2)$ | $A$←`k3` | pusat digeser sejauh jari-jari | — |
| c4 | $T_1=(3,-1)$, $T_2=(1,-5)$ | — | titik singgung | `gold` |

- **Pertanyaan cepat** (sebelum c4): "Titik singgung terletak pada jari-jari yang…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| sejajar garis $f$ | ya | — |
| tegak lurus garis $f$ | tidak | Garis **singgung** yang tegak lurus $f$. Jari-jari tegak lurus garis singgung, jadi sejajar $f$. |
| sama dengan garis $f$ | tidak | $f$ tidak melalui pusat lingkaran. Jari-jari hanya **sejajar** $f$. |

#### Langkah 3.2 — Menguji tiap kandidat
- **Pop-up:** "Uji pilihan: jaraknya dari pusat harus $\sqrt5$ dan vektor dari pusat harus sejajar $(1,2)$."
- **Visual:** setiap kandidat berwujud titik; titik emas bila lolos, merah bila gagal.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| d1 | $(3,1)$: $\vec{AT}=(1,4)$, $1+16=17\ne5$ | pusat←`k3` | di luar lingkaran | — |
| d2 | $(1,-5)$: $\vec{AT}=(-1,-2)$, $1+4=5$, sejajar $(1,2)$ | — | lolos | `gold` |
| d3 | $(-1,5)$: $\vec{AT}=(-3,8)$, $9+64=73\ne5$ | — | di luar lingkaran | — |
| d4 | $(3,-1)$: $\vec{AT}=(1,2)$, $1+4=5$, sejajar $(1,2)$ | — | lolos | `gold` |
| d5 | $(-3,-1)$: $\vec{AT}=(-5,2)$, $25+4=29\ne5$ | — | di luar lingkaran | — |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}m_f&=\frac{2-0}{0-(-1)}=2,\quad r^2=1+4=5\\\text{jari-jari}&\parallel f\Rightarrow T=A\pm(1,2)\\T&=(3,-1)\ \text{atau}\ (1,-5)\end{aligned}$$
Garis singgungnya (gradien $-\frac12$): di $(3,-1)$: $x+2y-1=0$; di $(1,-5)$: $x+2y+9=0$.

### Bagian 5 — Analisis pilihan (5 kartu)
| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| (1) | $(3,1)$ | SALAH | $AT^2=17\ne5$ | Tidak berada di lingkaran. |
| (2) | $(1,-5)$ | BENAR | $AT^2=5$, $\vec{AT}=-(1,2)$ | Titik singgung bawah. |
| (3) | $(-1,5)$ | SALAH | $AT^2=73\ne5$ | Tidak berada di lingkaran. |
| (4) | $(3,-1)$ | BENAR | $AT^2=5$, $\vec{AT}=(1,2)$ | Titik $B$ pada gambar. |
| (5) | $(-3,-1)$ | SALAH | $AT^2=29\ne5$ | Tidak berada di lingkaran. |

*Ditambahkan M2 (20 Okt 2026; kunci tidak berubah), dipakai di `app/src/content/soal/q16.ts`:*
- **Visual:** bidang koordinat SVG yang menggambar ulang `garis_dan_lingkaran.png`.
  - Label titik di gambar menjadi sumber `@g-A`, `@g-B`, `@g-C`, `@g-D`. Langkah 1.2 menampilkan adegan ini agar k2–k3 terbang dari labelnya.
  - Tahap per langkah:
    - `grad` (2.1): segitiga geser 1, naik 2;
    - `radius` (2.2): $AB=\sqrt5$;
    - `par` (3.1): jari-jari sejajar $f$, dua garis singgung putus-putus, tanda siku, titik singgung emas;
    - `test` (3.2): kandidat emas atau merah, dengan chip pilihan sebagai sumber `@o-1`…`@o-5`.
  - Rentang $y$ gambar $[-6;\ 3{,}5]$. Kandidat $(-1,5)$ berada di luar gambar dan ditandai panah di tepi atas.
- **Papan:**
  - "Garis f" untuk a1–a3; "Jari-jari lingkaran" untuk b1–b3;
  - "Titik singgung" untuk c1–c4, dengan pin $m_f=2$ dan $r=\sqrt5$;
  - "Menguji tiap pilihan" untuk d1–d5, dengan pin $A$, $r^2=5$, $T_1$, $T_2$.
- **Langkah 3.2** dipecah satu langkah per pilihan. Pop-up tambahan:
  - "Pilihan $(1,-5)$: $\vec{AT}=(-1,-2)$, panjangnya $\sqrt5$ dan sejajar $(1,2)$. Lolos."
  - "Pilihan $(-1,5)$: $AT^2=73$, jauh di luar lingkaran."
  - "Pilihan $(3,-1)$: $\vec{AT}=(1,2)$, yaitu titik $B$ pada gambar. Lolos."
  - "Pilihan $(-3,-1)$: $AT^2=29$, tidak berada di lingkaran."
- **Bagian 5:**
  - Pop-up per kartu dari kolom *Alasan*.
  - Papan ringkasan s1–s6.
  - Pertanyaan kesimpulan: $(3,-1)$ saja · $(3,1)$ dan $(1,-5)$ · **$(3,-1)$ dan $(1,-5)$** · $(-1,5)$ dan $(-3,-1)$.
- **Ringkasan `LR`** memuat persamaan kedua garis singgung dari *Catatan lengkap*.

### Bagian 6 — Selesai
- **Segel:** **(3,−1), (1,−5)**
- **Pop-up:** "Jari-jari yang sejajar $f$ menembus lingkaran di $(3,-1)$ dan $(1,-5)$; di dua titik itulah garis singgung tegak lurus $f$."

### Pemeriksaan hasil
Jarak pusat ke garis singgung $x+2y-1=0$: $\dfrac{\lvert2+2(-3)-1\rvert}{\sqrt5}=\dfrac5{\sqrt5}=\sqrt5=r$ ✓. Untuk $x+2y+9=0$: $\dfrac{\lvert2-6+9\rvert}{\sqrt5}=\sqrt5$ ✓. Gradien kedua garis $-\frac12$ dan $m_f\cdot(-\frac12)=-1$ ✓.

### Kesalahan umum / poin perhatian
- Mencari perpotongan garis $f$ dengan lingkaran. Garis $f$ tidak memotong lingkaran (jaraknya dari pusat $\frac9{\sqrt5}\approx4{,}02>\sqrt5\approx2{,}24$).
- Hanya menemukan satu titik singgung; selalu ada dua garis singgung dengan arah tertentu pada satu lingkaran.
- Menyalahartikan "tegak lurus" untuk jari-jari, bukan garis singgung.

---

## SOAL 17 — Cat pada Rambu Rumah Makan

| Atribut | Isi |
|---|---|
| Topik | Geometri bidang: luas lingkaran, cincin, dan salib; perbandingan luas |
| Jenis respons | Multi-jawaban: pilih semua jawaban yang benar (5 pilihan) |
| Jawaban akhir | **Setengah hitam dan biru**, **setengah hitam dan merah**, **biru dan merah** (butir 1, 2, 5) |
| Status | VALID (redaksi pilihan dan skala gambar mengikuti naskah asli, dikonfirmasi pemilik materi; tafsir yang dipakai dijelaskan di bawah, kunci tetap) |
| Visual utama | Rambu SVG berlapis: persegi, cincin, cakram, salib (playbook §15: bangun datar) |
| Aset gambar | `./rambu_rumah_makan.png` |

**Data dibaca dari gambar `rambu_rumah_makan.png`:**
- Latar biru berbentuk persegi **40 cm × 40 cm**.
- Lingkaran hitam luar menyinggung sisi persegi, jadi jari-jari luar $R=20$ cm.
- Cakram putih di dalam cincin hitam berjari-jari $r=14$ cm (label "14 cm" dari pusat ke tepi cakram).
- Salib merah dengan dua lengan yang ujungnya mengikuti tepi cakram. Pada garis tepi atas lengan mendatar tertulis **10 cm** di kiri dan kanan lengan tegak. Dengan $10+w+10=28$ (diameter cakram) diperoleh lebar lengan $w=8$ cm. (Pengukuran piksel gambar memberi lebar lengan sekitar 7,5 cm sehingga gambar tidak persis berskala; lihat sensitivitas di bawah.)

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Geometri bidang
- **Judul hero:** `Pembahasan Soal` / `Cat` + aksen `Rambu` / sub `Rumah Makan`
- **Lede:** Satu rambu terdiri dari persegi biru, cincin hitam, salib merah, dan sisa putih. Berapa banyak cat tiap warna, dan mana yang lebih banyak dari cat hitam?
- **Fakta kunci:** Sisi persegi → `40 cm` · Jari-jari cakram → `14 cm` · Dicari → `bandingkan cat`
- **Ilustrasi lobi:** rambu tergambar lapis demi lapis; tiap warna menyala bergantian.

### Bagian 1 — Pahami soal
- **Stabilo:** `cat yang sama` (biru, `@s-cat`), `lebih banyak digunakan dibanding cat warna hitam` (emas, `@s-tanya`). Elemen gambar: `@g-40` (sisi 40), `@g-14` (jari-jari 14), `@g-10a`, `@g-10b` (dua label 10 cm).
- **Langkah 1.1** — pop-up: "Cat dibeli dalam ukuran yang sama, jadi banyak cat sebanding dengan **luas** tiap warna."
- **Langkah 1.2** — pop-up: "Kita hitung luas hitam, biru, merah, putih, lalu bandingkan dengan hitam."

**Tafsir pilihan jawaban yang dipakai (dicatat karena redaksi soal tidak menjelaskannya):** setiap pilihan menyebut dua kuantitas cat. Pilihan dianggap **benar** bila **jumlah** kedua kuantitas itu lebih banyak daripada cat hitam; "setengah hitam" berarti $\frac12\times$ luas hitam. Alasan memilih tafsir ini: bila "lebih banyak dari hitam" dikenakan pada **tiap** warna secara terpisah, tidak ada warna yang melebihi hitam sehingga tidak ada jawaban benar sama sekali.

### Bagian 2 — Luas tiap warna
**Prasyarat konsep:** luas lingkaran $=\pi r^2$; luas cincin $=\pi(R^2-r^2)$; luas gabungan dua persegi panjang yang bertumpuk $=$ jumlah kedua luas dikurangi luas irisan. Dipakai $\pi=3{,}14$.

#### Langkah 2.1 — Hitam dan biru
- **Pop-up:** "Hitam adalah cincin antara jari-jari 14 dan 20. Biru adalah persegi dikurangi lingkaran besar."
- **Visual:** cincin hitam disorot; lalu empat sudut biru disorot.
- **Papan:** judul "Luas hitam dan biru".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | hitam $=\pi(20^2-14^2)$ | $20$←`@g-40` (setengah sisi), $14$←`@g-14` | luas cincin | — |
| a2 | hitam $=\pi(400-196)=204\pi$ | — | — | — |
| a3 | hitam $=204(3{,}14)=640{,}56\ \text{cm}^2$ | — | — | `navy` |
| a4 | biru $=40^2-\pi\cdot20^2=1600-400\pi$ | $40$←`@g-40` | persegi dikurangi lingkaran luar | — |
| a5 | biru $=1600-400(3{,}14)=1600-1256=344\ \text{cm}^2$ | — | — | `navy` |

#### Langkah 2.2 — Merah dan putih
- **Pop-up:** "Salib: dua persegi panjang $28\times8$ yang bertumpuk di persegi $8\times8$. Putih adalah sisa cakram."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | lebar lengan: $10+w+10=28\Rightarrow w=8$ | $10$←`@g-10a`,`@g-10b`; $28=2\cdot14$ | diameter cakram | — |
| b2 | merah $=2(28\cdot8)-8\cdot8$ | — | dua lengan dikurangi irisan | — |
| b3 | merah $=448-64=384\ \text{cm}^2$ | — | — | `navy` |
| b4 | cakram $=\pi\cdot14^2=196(3{,}14)=615{,}44$ | $14$←`@g-14` | — | — |
| b5 | putih $=615{,}44-384=231{,}44\ \text{cm}^2$ | $384$←`b3` | sisa cakram | `navy` |

- **Pertanyaan cepat** (sebelum b5): "Luas putih sama dengan…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| luas cakram dikurangi luas merah | ya | — |
| luas persegi dikurangi luas merah | tidak | Persegi juga memuat hitam dan biru. Putih hanya ada di dalam cakram. |
| luas cincin dikurangi luas merah | tidak | Cincin itu hitam; merah dan putih berada di dalam cakram. |

### Bagian 3 — Membandingkan dengan hitam
#### Langkah 3.1 — Setengah hitam
- **Pop-up:** "Hitung setengah dari cat hitam, lalu jumlahkan dengan tiap kuantitas pada pilihan."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $\tfrac12\ \text{hitam}=\tfrac12(640{,}56)=320{,}28$ | `a3` | — | `navy` |
| c2 | $\tfrac12\ \text{hitam}+\text{biru}=320{,}28+344=664{,}28>640{,}56$ | `a5` | pilihan 1: benar | `gold` |
| c3 | $\tfrac12\ \text{hitam}+\text{merah}=320{,}28+384=704{,}28>640{,}56$ | `b3` | pilihan 2: benar | `gold` |
| c4 | $\tfrac12\ \text{hitam}+\text{putih}=320{,}28+231{,}44=551{,}72<640{,}56$ | `b5` | pilihan 3: salah | — |
| c5 | $\text{biru}+\text{putih}=344+231{,}44=575{,}44<640{,}56$ | — | pilihan 4: salah | — |
| c6 | $\text{biru}+\text{merah}=344+384=728>640{,}56$ | — | pilihan 5: benar | `gold` |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}\text{hitam}&=\pi(20^2-14^2)=204\pi\approx640{,}56\\\text{biru}&=1600-400\pi\approx344\\\text{merah}&=2(28\cdot8)-8^2=384\\\text{putih}&=196\pi-384\approx231{,}44\end{aligned}$$

### Bagian 5 — Analisis pilihan (5 kartu)
Pin: hitam $=640{,}56$ · biru $=344$ · merah $=384$ · putih $=231{,}44$.

| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| (1) | Setengah hitam dan biru | BENAR | $320{,}28+344=664{,}28>640{,}56$ | Kebenarannya tidak bergantung ukuran salib. |
| (2) | Setengah hitam dan merah | BENAR | $320{,}28+384=704{,}28>640{,}56$ | — |
| (3) | Setengah hitam dan putih | SALAH | $320{,}28+231{,}44=551{,}72<640{,}56$ | Putih paling sedikit. |
| (4) | Biru dan putih | SALAH | $344+231{,}44=575{,}44<640{,}56$ | Hampir, tetapi masih kurang. |
| (5) | Biru dan merah | BENAR | $344+384=728>640{,}56$ | — |

*Ditambahkan M2 (20 Okt 2026; kunci tidak berubah), dipakai di `app/src/content/soal/q17.ts`:*
- **Bagian 1, papan:**
  - k1 Diketahui
  - k2 sisi persegi $=40$ cm
  - k3 jari-jari cakram putih $=14$ cm
  - k4 tepi lengan mendatar $=10$ cm (di kiri dan kanan lengan tegak)
  - k5 banyak cat $\propto$ luas warna (`@s-cat`)
  - k6 Ditanya: cat yang lebih banyak dari hitam (`@s-tanya`)
  - k7 Tafsir: jumlah dua kuantitas $>$ hitam ("setengah hitam" $=\frac12\times$ luas hitam)
- **Langkah 1.3, pop-up** (dari *Tafsir pilihan jawaban* di atas): "Setiap pilihan menyebut dua kuantitas cat. Pilihan benar bila jumlah keduanya lebih banyak daripada cat hitam."
- **Bagian 2:** pop-up 2.1 dan 2.2 masing-masing dipecah menjadi dua langkah, dan visual menyorot satu warna per langkah:
  - a1–a3 hitam: "Hitam adalah cincin antara jari-jari 14 dan 20. Jari-jari 20 adalah setengah sisi persegi 40."
  - a4–a5 biru: "Biru adalah persegi dikurangi lingkaran besar."
  - b1–b3 merah: "Salib: dua persegi panjang $28\times8$ yang bertumpuk di persegi $8\times8$."
  - b4–b5 putih: "Putih adalah sisa cakram setelah dikurangi salib."
  - Papan berganti judul "Luas merah dan putih" untuk b1–b5. Label luas yang sudah dihitung muncul di rambu.
- **Bagian 3:** pin hitam/biru/merah/putih (dari Bagian 5) dipasang sebagai sumber terbang baris c1–c6. Pop-up per langkah:
  - c1 = pop-up 3.1;
  - c2–c3: "Pilihan 1 dan 2: setengah hitam ditambah biru, atau ditambah merah, sama-sama melebihi hitam."
  - c4: "Pilihan 3: putih paling sedikit, sehingga setengah hitam ditambah putih masih kurang dari hitam."
  - c5–c6: "Pilihan 4 hampir, tetapi masih kurang. Pilihan 5, biru ditambah merah, melebihi hitam."
  - Di papan, baris c2–c6 hanya memuat angka (mis. $320{,}28+344=664{,}28>640{,}56$). Nama kuantitas pindah ke keterangan baris agar muat di layar 667 px.
- **Bagian 5:**
  - Pop-up per kartu disusun dari kolom *Rumus singkat* dan *Alasan*.
  - Rumus pada kartu diringkas menjadi perbandingan akhir ($664{,}28>640{,}56$ dst.) agar muat di kartu.
  - Papan ringkasan s1–s5, ditambah s6 "Jawaban: pilihan 1, 2, dan 5".
  - Pertanyaan kesimpulan: 1 dan 2 saja · **1, 2, dan 5** · 1, 2, 4, dan 5 · 5 saja, masing-masing dengan petunjuk dari baris c.

*Revisi alur dengan gaya mengajar pemilik materi (21 Okt 2026; kunci tidak berubah: pilihan 1, 2, 5), dipakai di `app/src/content/soal/q17.ts`. Menggantikan blok "Ditambahkan M2" di atas. Angka luas sama dengan Bagian 2–3; tafsir pilihan tetap.*

*Revisi kedua (21 Okt 2026, permintaan pemilik; kunci tetap): segel jawaban banyak berupa deret medali; simbol ∝ diganti kata-kata; **catatan luas** (deret pin di papan) menyimpan tiap luas begitu didapat dan menjadi sumber semua hitungan berikutnya; angka jari-jari dan ukuran terbang dari gambar; salib merah hanya dipisah untuk menunjukkan dua persegi panjang, lalu disatukan lagi dan tiap lengan serta kotak tengah disorot pada salib utuh. Daftar di bawah sudah memuat revisi kedua.*

Gagasan utama: rambu dipandang sebagai **tumpukan empat bangun utuh** (persegi biru, lingkaran besar hitam, lingkaran kecil putih, salib merah), sehingga **warna yang terlihat = bangunnya dikurangi bangun di atasnya**. Tata letak: panggung penuh dua kolom (PRD v1.5).

- **Bagian 1 — Pahami soal**
  - 1.1 Stabilo "cat yang dibeli dalam ukuran yang sama". Baris: warna lebih luas ⇒ cat lebih banyak.
  - 1.2 Rambu ditumpuk satu per satu (persegi → lingkaran besar → lingkaran kecil → salib) dengan daftar lapisan. Baris: warna terlihat = bangunnya − bangun di atasnya.
  - 1.3 Stabilo pertanyaan. Baris: Ditanya; tiap pilihan: cat 1 + cat 2 > hitam? ("setengah hitam" $=\frac12\times$ luas hitam).
- **Bagian 2 — Ukuran dari gambar**
  - 2.1 $R=\frac12\times40=20$ cm (lingkaran hitam menyentuh sisi persegi).
  - 2.2 $r=14$ cm (tertulis di gambar).
  - 2.3 $10+w+10=28\Rightarrow w=8$ cm ($28=2\times14$). Pertanyaan cepat baru: "$10+w+10=28$. Lebar lengan $w$ adalah…"
    - $8$ cm: benar.
    - $18$ cm: "$28-10$ baru mengurangi satu sisi".
    - $14$ cm: "itu jari-jari lingkaran putih".
- **Bagian 3 — Luas tiap warna** (bangun di atasnya diangkat ke kanan, meninggalkan lubang putus-putus; ukuran pada gambar terbang ke hitungan; tiap luas **disimpan ke catatan luas** di akhir langkahnya)
  - Hitam (lingkaran putih diangkat; jari-jari $20$ dan $14$ tampil di lubang): hitam = lingkaran besar − lingkaran kecil $=3{,}14\times(20^2-14^2)=3{,}14\times(400-196)=3{,}14\times204=640{,}56$ cm². Simpan.
  - Biru (lingkaran besar diangkat; sisi $40$ dan jari-jari lubang $20$): biru = persegi − lingkaran besar $=40^2-3{,}14\times20^2=1600-1256=344$ cm². Simpan.
  - Merah (lima langkah):
    - lengan tegak dipisah: salib = lengan mendatar + lengan tegak;
    - disatukan lagi, lengan mendatar disorot dengan ukurannya: $28\times8=224$;
    - lengan tegak disorot: $28\times8=224$;
    - kotak tengah disorot pada salib utuh: $8\times8=64$, ikut terhitung di kedua lengan;
    - merah $=224+224-64=384$ cm². Simpan. Pertanyaan cepat: $224+224-64=384$ (benar) · $224+224=448$ ("kotak tengah terhitung dua kali") · $224$ ("baru satu lengan").
  - Putih (salib diangkat; jari-jari $14$ dari gambar, merah dari catatan): putih = lingkaran kecil − merah $=3{,}14\times14^2-384=615{,}44-384=231{,}44$ cm². Simpan. Pertanyaan cepat lama (luas putih).
- **Bagian 4 — Bandingkan dengan hitam** (batang pembanding: panjang batang ∝ luas, garis putus-putus = batas cat hitam; semua angka diambil dari catatan luas yang tampil di papan)
  - 4.1 Hitam diambil dari catatan: $\frac12$ hitam $=\frac12\times640{,}56=320{,}28$, disimpan juga ke catatan.
  - 4.2 Cara cepat: $\frac12$ hitam $+X>$ hitam $\iff X>320{,}28$, karena setengah hitam ada di kedua sisi. Batas berlaku: hanya pilihan yang memuat setengah hitam (1–3).
  - Tiap pilihan: kertas soal tampil, pilihan itu disorot dan disalin ke papan, lalu batang kedua kuantitas ditumpuk; angka baris hitungan terbang dari catatan luas.
    - (1) $320{,}28+344=664{,}28>640{,}56$; biru $344>320{,}28$. **Benar.**
    - (2) $320{,}28+384=704{,}28>640{,}56$; merah $384>320{,}28$. **Benar.**
    - (3) $320{,}28+231{,}44=551{,}72<640{,}56$; putih $231{,}44<320{,}28$. **Salah.**
    - (4) tanpa setengah hitam: $344+231{,}44=575{,}44<640{,}56$, hampir tetapi kurang. **Salah.**
    - (5) $344+384=728>640{,}56$. **Benar.**
- **Bagian 5 — Catatan lengkap.**
- **Bagian 6 — Cocokkan pilihan:** satu langkah, kelima kartu terbuka; pertanyaan kesimpulan seperti di atas.
- **Bagian 7 — Selesai:** segel 1 · 2 · 5.

### Bagian 6 — Selesai
- **Segel:** **1 · 2 · 5**
- **Pop-up:** "Hitam sekitar 640,56 cm². Gabungan $\frac12$ hitam + biru, $\frac12$ hitam + merah, dan biru + merah masing-masing melebihinya."

### Pemeriksaan hasil
Pengecekan simbolik dengan $\pi$ (tanpa pembulatan), merah $=384$: pilihan 1 benar bila $1600>502\pi$ ($\pi<3{,}187$) ✓; pilihan 2 benar bila $384>102\pi$ ✓; pilihan 3 salah karena $94\pi<384$ ($\pi<4{,}085$) ✓; pilihan 4 salah karena $1216<408\pi$ ($\pi>2{,}98$) ✓; pilihan 5 benar bila $1984>604\pi$ ($\pi<3{,}285$) ✓.
**Sensitivitas ukuran salib:** jika ujung lengan dipotong mengikuti tepi cakram (sesuai gambar), merah $\approx377{,}8$ cm²; jika lebar lengan $\approx7{,}1$ cm (hasil dari label 10 cm pada tepi lengan), merah $\approx342$ cm². Pada rentang itu semua stempel kartu **tidak berubah**.

### Catatan sumber (dikonfirmasi pemilik materi: naskah asli memang demikian)
1. Redaksi "Setengah hitam dan biru" dan seterusnya tidak menjelaskan operasinya (jumlah, rasio, atau perbandingan masing-masing dengan setengah hitam). Tafsir "jumlah dibanding hitam" dipilih karena satu-satunya yang memberi himpunan jawaban tidak kosong; di bawah tafsir "kedua warna masing-masing lebih banyak dari setengah hitam" pilihan 5 tetap benar, tetapi pilihan yang memuat "setengah hitam" tidak bermakna. **Cek redaksi pilihan di naskah asli.**
2. Ukuran gambar tidak persis berskala (lebar lengan salib terukur sekitar 7,5 cm, bukan 8 cm; jari-jari cakram terukur sekitar 14,5 cm). Perhitungan memakai angka yang tertulis di gambar (40, 14, dan 10 cm).

### Kesalahan umum / poin perhatian
- Menilai luas dari "kesan" gambar atau pembagian piksel, bukan dari ukuran yang tertera.
- Menghitung merah sebagai satu persegi panjang $28\times8$ lalu lupa lengan satunya, atau menjumlah dua lengan tanpa mengurangi irisan $8\times8$.
- Mengira putih = persegi − salib; putih hanya ada di dalam cakram.

---

## SOAL 18 — Kerangka Kaca Patri

| Atribut | Isi |
|---|---|
| Topik | Geometri bidang: luas juring dan segmen, keliling lingkaran, panjang total kerangka |
| Jenis respons | Tabel Pas/Tidak Pas, 3 baris |
| Jawaban akhir | 2 logam A → **Tidak Pas**; 1 logam B → **Tidak Pas**; 1 logam C → **Pas** |
| Status | VALID (kerangka diasumsikan: lingkaran + 4 sisi persegi + 2 diagonal, sesuai gambar bawah; potongan boleh dipotong dan disambung) |
| Visual utama | Ornamen SVG dengan perhitungan bertahap (playbook §15: bangun datar) |
| Aset gambar | `./ornamen_kaca_patri.png` |

**Data dibaca dari gambar `ornamen_kaca_patri.png`:** ornamen berupa lingkaran berisi persegi yang titik sudutnya menyentuh lingkaran (diamond), dibagi dua garis tegak lurus yang melalui pusat menjadi 4 segitiga siku-siku (hijau, kuning, kuning, hijau). Empat potong kaca **merah** ada di antara sisi persegi dan lingkaran. Catatan pada gambar: luas 1 potong kaca merah $=456$ cm², $\pi=3{,}14$. Gambar kerangka (bawah) menunjukkan lingkaran, empat sisi persegi, dan dua garis tengah (mendatar dan tegak).

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Geometri bidang
- **Judul hero:** `Pembahasan Soal` / `Kerangka` + aksen `Kaca Patri` / sub `Pas atau Tidak`
- **Lede:** Dari luas satu kaca merah kita cari ukuran ornamen, lalu hitung panjang logam untuk kerangkanya.
- **Fakta kunci:** Luas 1 kaca merah → `456 cm²` · $\pi$ → `3,14` · Syarat pas → `sisa ≤ 1 m`
- **Ilustrasi lobi:** ornamen kaca patri tergambar; garis kerangka menyala berurutan.

### Bagian 1 — Pahami soal
- **Stabilo:** `luas 1 potong kaca merah = 456 cm²` (merah, `@s-merah`), `π = 3,14` (merah, `@s-pi`), `cukup … sisanya tidak lebih dari 1 meter` (biru, `@s-pas`), `Logam A 4 m, B 5 m, C 6,5 m` (merah, `@s-logam`), `Pas atau Tidak Pas` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. Pas berarti logam **cukup** dan **sisanya tidak lebih dari 1 meter**."
- **Langkah 1.2** — pop-up: "Kita cari jari-jari lingkaran dari luas kaca merah, lalu panjang seluruh kerangka."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | 1 kaca merah $=456\ \text{cm}^2$ | `@s-merah` | 4 kaca merah sama besar | — |
| k3 | $\pi=3{,}14$ | `@s-pi` | — | — |
| k4 | logam: A $=4$ m, B $=5$ m, C $=6{,}5$ m | `@s-logam` | — | — |
| k5 | **Ditanya** (label) pas atau tidak pas | `@s-tanya` | — | — |

### Bagian 2 — Jari-jari lingkaran
**Prasyarat konsep:** persegi yang titik sudutnya pada lingkaran memiliki diagonal $=2r$ sehingga luasnya $\frac12(2r)(2r)=2r^2$. Empat kaca merah adalah sisa lingkaran di luar persegi.

#### Langkah 2.1 — Luas kaca merah dalam $r$
- **Pop-up:** "Luas lingkaran dikurangi luas persegi dibagi 4 sama dengan luas satu kaca merah."
- **Visual:** lingkaran, lalu persegi diamond; empat segmen merah disorot dan diberi label "456".
- **Papan:** judul "Mencari jari-jari".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | luas lingkaran $=\pi r^2$ | — | — | — |
| a2 | luas persegi $=\dfrac12(2r)(2r)=2r^2$ | — | rumus layang-layang/belah ketupat | — |
| a3 | 1 merah $=\dfrac{\pi r^2-2r^2}{4}$ | — | dibagi 4 kaca | — |
| a4 | $456=\dfrac{(\pi-2)r^2}{4}$ | $456$←`@s-merah` | — | — |

#### Langkah 2.2 — Menghitung $r$
| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $456\times4=(3{,}14-2)\,r^2$ | $3{,}14$←`@s-pi` | kedua ruas dikali 4 | — |
| b2 | $1824=1{,}14\,r^2$ | — | $456\cdot4=1824$ | `navy` |
| b3 | $r^2=\dfrac{1824}{1{,}14}=1600$ | — | $1{,}14\cdot1600=1824$ | `navy` |
| b4 | $r=40\ \text{cm}$ | — | $\sqrt{1600}=40$ | `navy` *(diubah M2 dari `gold`: emas hanya untuk jawaban akhir, PRD; kunci tidak berubah)* |

- **Pertanyaan cepat** (sebelum b3): "Dari $1824=1{,}14\,r^2$, nilai $r^2$ adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $1600$ | ya | — |
| $40$ | tidak | $40$ adalah $r$; di sini yang dicari baru $r^2$ ($40$ muncul setelah diakarkan). |
| $2079$ | tidak | Itu hasil kali $1824\cdot1{,}14$. Untuk mencari $r^2$, bagi $1824$ dengan $1{,}14$. |

### Bagian 3 — Panjang kerangka
**Prasyarat konsep:** kerangka = keliling lingkaran + empat sisi persegi + dua diagonal persegi (yang juga merupakan diameter lingkaran). Sisi persegi: segitiga siku-siku sama kaki dengan kaki $r$, sehingga sisinya $r\sqrt2$.

#### Langkah 3.1 — Menghitung tiap bagian
- **Pop-up:** "Hitung panjang tiga jenis garis: lingkaran, sisi persegi, dan dua diameter."
- **Visual:** tiap jenis garis menyala dengan warna berbeda saat dihitung.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | keliling lingkaran $=2\pi r=2(3{,}14)(40)=251{,}2$ cm | $r$←`b4` | — | — |
| c2 | sisi persegi $=r\sqrt2=40\sqrt2\approx56{,}57$ cm | — | $\sqrt2\approx1{,}414$ | — |
| c3 | 4 sisi $=4(56{,}57)\approx226{,}27$ cm | — | — | — |
| c4 | 2 diagonal $=2(2r)=2(80)=160$ cm | — | tiap diameter $80$ cm | — |
| c5 | total $=251{,}2+226{,}27+160\approx637{,}5$ cm | — | $\approx6{,}37$ m | `navy` |

#### Langkah 3.2 — Menguji tiap pilihan logam
- **Pop-up:** "Pas jika panjang logam $\ge6{,}37$ m dan sisanya $\le1$ m. Uji tiga pilihan."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| d1 | 2 logam A $=8$ m: cukup; sisa $=8-6{,}37=1{,}63$ m $>1$ m | `@s-logam` | tidak pas | — |
| d2 | 1 logam B $=5$ m: $5<6{,}37$ | `@s-logam` | tidak cukup | — |
| d3 | 1 logam C $=6{,}5$ m: cukup; sisa $=6{,}5-6{,}37=0{,}13$ m $\le1$ m | `@s-logam` | **pas** | `gold` |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}456&=\frac{(\pi-2)r^2}{4}\Rightarrow r^2=\frac{1824}{1{,}14}=1600\Rightarrow r=40\ \text{cm}\\\text{kerangka}&=2\pi r+4(r\sqrt2)+2(2r)\\&=251{,}2+226{,}27+160\approx637{,}5\ \text{cm}=6{,}37\ \text{m}\end{aligned}$$

### Bagian 5 — Analisis pernyataan (3 kartu)
| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| (1) | Membeli 2 buah logam A (8 m) | TIDAK PAS | sisa $\approx1{,}63$ m $>1$ m | Cukup, tetapi sisanya lebih dari 1 meter. |
| (2) | Membeli 1 buah logam B (5 m) | TIDAK PAS | $5<6{,}37$ | Tidak cukup untuk kerangka. |
| (3) | Membeli 1 buah logam C (6,5 m) | PAS | sisa $\approx0{,}13$ m $\le1$ m | Cukup dan sisa kecil. |

*Ditambahkan M2 (20 Okt 2026; kunci tidak berubah), dipakai di `app/src/content/soal/q18.ts`:*
- **Visual:** adegan 3D pelengkap `door3d` (lihat `docs/spike-3d-soal18.md`) dengan padanan 2D (diagram pita). Tahap per langkah:
  - 2.1 `ornament`;
  - 2.2 `unglass`;
  - 2.3 `radius`;
  - 3.1 `unroll`;
  - 3.2 `ruler`;
  - 3.3–3.5 `match`.
- **Sumber terbang dari label adegan** (3D dan 2D memakai nama yang sama):
  - $456$ pada a4 ← `@l3-merah` (menggantikan `@s-merah`, karena kertas soal tidak tampil saat adegan dibuka);
  - $40$ cm pada b4 ← `@l3-r`;
  - $637{,}5$ pada c5 ← `@l3-total`.
- **Bagian 2:** langkah 2.2 dipecah menjadi dua langkah:
  - b1–b3, dengan pertanyaan cepat sebelum b3. Pop-up: "Kalikan kedua ruas dengan 4, lalu bagi dengan $1{,}14$ untuk mendapatkan $r^2$."
  - b4. Pop-up: "Akar dari $1600$ adalah $40$. Jari-jari lingkaran ornamen $40$ cm."
- **Bagian 3, pin:** $r=40$ cm untuk c1–c5. Untuk d1–d3: kerangka $\approx6{,}37$ m dan pas: cukup, sisa $\le1$ m.
- **Bagian 3, langkah tambahan:**
  - c5 berdiri sendiri: "Jajarkan semua batang pada penggaris: totalnya sekitar $637{,}5$ cm."
  - Satu langkah per logam. d1 memakai pop-up 3.2. d2: "1 logam B hanya 5 m, lebih pendek dari kerangka. Tidak cukup." d3: "1 logam C cukup, dan sisanya hanya $0{,}13$ m."
  - Label baris c1/c2 disingkat menjadi "lingkaran" dan "sisi", dengan keterangan "keliling" dan "sisi persegi".
- **Bagian 5:**
  - Pop-up per kartu dari kolom *Alasan*.
  - Papan ringkasan s1–s3, ditambah s4 "Jawaban: Tidak Pas · Tidak Pas · Pas".
  - Pertanyaan kesimpulan "Pilihan yang pas adalah…": 2 buah logam A · 1 buah logam B · **1 buah logam C**.

*Revisi alur dengan gaya mengajar pemilik materi (22 Okt 2026; kunci tidak berubah: Tidak Pas · Tidak Pas · Pas), dipakai di `app/src/content/soal/q18.ts`. Menggantikan blok "Ditambahkan M2" di atas. Angka sama dengan Bagian 2–3.*

Gagasan utama: ornamen dipandang sebagai **tumpukan** lingkaran merah dan persegi miring (4 segitiga hijau/kuning), sehingga **4 kaca merah = lingkaran − persegi**. Hasil tiap langkah disimpan ke **catatan** (deret pin papan) dan diambil lagi dari sana. Pintu 3D (pelengkap, PRD §9.6) hanya di Bagian 1; selebihnya gambar 2D. Tata letak: panggung penuh dua kolom.

- **Bagian 1 — Pahami soal**
  - 1.1 Stabilo luas 1 kaca merah dan $\pi$. Baris: 1 kaca merah $=456$ cm² (4 kaca sama besar); $\pi=3{,}14$.
  - 1.2 Pintu 3D: ornamen bulat dari kaca merah, hijau, kuning pada kerangka logam.
  - 1.3 Ornamen ditumpuk: lingkaran merah, lalu 4 segitiga. Baris: kaca merah = sisa lingkaran di luar persegi.
  - 1.4 Stabilo syarat pas dan logam. Baris: pas = cukup dan sisa ≤ 1 m; logam A 4 m, B 5 m, C 6,5 m; Ditanya.
- **Bagian 2 — Jari-jari lingkaran**
  - 2.1 Persegi diangkat, tersisa 4 kaca merah: 4 merah = lingkaran − persegi.
  - 2.2 Satu segitiga disorot, kedua kakinya jari-jari $r$: persegi $=4\times\frac12\times r\times r=2r^2$ (setara $\frac12(2r)(2r)$ di atas).
  - 2.3 Label 456 pada kaca merah terbang ke papan: $4\times456=3{,}14r^2-2r^2$, lalu $1824=1{,}14r^2$.
  - 2.4 Pertanyaan cepat lama ($r^2$). $r^2=1824:1{,}14=1600$, $r=\sqrt{1600}=40$ cm (navy). Simpan $r$ ke catatan.
- **Bagian 3 — Panjang kerangka** (kaca dilepas; tiap jenis garis logam disorot dengan ukurannya)
  - 3.1 kerangka = lingkaran + 2 diameter + 4 sisi.
  - 3.2 Lingkaran: $2\times3{,}14\times40=251{,}2$ cm ($r$ dari catatan). Simpan.
  - 3.3 Dua diameter, masing-masing $80$ cm: $2\times80=160$ cm. Simpan.
  - 3.4 Sisi persegi = sisi miring segitiga berkaki $40$ dan $40$: $\sqrt{40^2+40^2}=40\sqrt2\approx56{,}57$ cm; 4 sisi $\approx226{,}27$ cm. Simpan. Pertanyaan cepat baru: $40\sqrt2$ (benar) · $80$ ("itu diameter") · $40$ ("itu kaki segitiga").
  - 3.5 Papan baru "Total kerangka", batang-batang dijajarkan pada penggaris: $251{,}2+160+226{,}27\approx637{,}5$ cm $\approx6{,}37$ m (angka dari catatan). Simpan.
- **Bagian 4 — Uji ketiga pilihan**
  - 4.1 Cara cepat (baru) "zona pas": cukup ⇔ logam $\ge637{,}5$ cm; sisa ≤ 1 m ⇔ logam $\le637{,}5+100=737{,}5$ cm. Simpan zona ke catatan. Diturunkan dari *Pemeriksaan hasil* di bawah.
  - Tiap pilihan: kertas soal tampil, baris pilihan disorot dan disalin ke papan, logam diubah ke cm, lalu batang logam pada penggaris dibandingkan dengan zona.
    - (1) $2\times4$ m $=800$ cm $>737{,}5$; sisa $162{,}5$ cm $\approx1{,}63$ m. **Tidak Pas.**
    - (2) $5$ m $=500$ cm $<637{,}5$; tidak cukup. **Tidak Pas.**
    - (3) $6{,}5$ m $=650$ cm, $637{,}5\le650\le737{,}5$; sisa $12{,}5$ cm $\approx0{,}13$ m. **Pas** (emas).
- **Bagian 5 — Catatan lengkap.**
- **Bagian 6 — Cocokkan pilihan:** satu langkah, ketiga kartu terbuka; pertanyaan kesimpulan seperti di atas.
- **Bagian 7 — Selesai:** segel Tidak · Tidak · Pas (deret medali).

### Bagian 6 — Selesai
- **Segel:** **Tidak · Tidak · Pas**
- **Pop-up:** "Kerangka butuh sekitar **6,37 m**. Hanya 1 logam C (6,5 m) yang cukup dengan sisa kurang dari 1 meter."

### Pemeriksaan hasil
Substitusi balik: $\frac{(3{,}14-2)(1600)}{4}=\frac{1{,}14\cdot1600}{4}=456$ ✓.
Rentang "pas": panjang logam yang dibeli harus berada di $[637{,}5;\ 737{,}5]$ cm (cukup, dan sisa paling banyak 100 cm). Hanya 650 cm (1 logam C) yang masuk; 500 cm (B) kurang dari 637,5, dan 800 cm (2 logam A) melewati 737,5. Dengan $\sqrt2\approx1{,}41$ totalnya $\approx636{,}8$ cm dan kesimpulan tidak berubah.

### Kesalahan umum / poin perhatian
- Menghitung kerangka hanya dari lingkaran atau hanya dari persegi, tanpa dua diagonal.
- Memakai luas kaca merah $456$ sebagai luas seluruh segmen dan lupa pembagi 4.
- Mencampur satuan: panjang logam dalam meter, ukuran ornamen dalam cm.
- Menyimpulkan pas karena "cukup" saja; syarat kedua yaitu sisa $\le1$ m.

---

## SOAL 19 — Cermin lalu Translasi pada Garis

| Atribut | Isi |
|---|---|
| Topik | Transformasi geometri: refleksi terhadap $y=x$ dan translasi pada persamaan garis |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **E** — $2a-b=6$ (dengan $a=2$, $b=-2$) |
| Status | VALID |
| Visual utama | Bidang koordinat SVG: garis awal, bayangan cermin, bayangan translasi (playbook §15: grafik) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Transformasi geometri
- **Judul hero:** `Pembahasan Soal` / `Cermin` + aksen `Translasi` / sub `Persamaan Garis`
- **Lede:** Dua garis dicerminkan terhadap $y=x$ lalu digeser. Dari bayangan akhirnya kita cari $a$ dan $b$.
- **Fakta kunci:** Cermin → `y = x` · Translasi → `(1, −1)` · Dicari → `2a − b`
- **Ilustrasi lobi:** garis tercermin melintasi $y=x$ lalu bergeser satu langkah.

### Bagian 1 — Pahami soal
- **Stabilo:** `ax + y − 9 = 0` (merah, `@s-l1`), `x + by + 6 = 0` (merah, `@s-l2`), `dicerminkan terhadap y = x kemudian … translasi` (biru, `@s-urut`), bayangan `x + 2y − 8 = 0` dan `2x − y − 9 = 0` (merah, `@s-b1`, `@s-b2`), `2a − b` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. Urutannya: **cermin dahulu**, lalu **translasi**."
- **Langkah 1.2** — pop-up: "Diketahui garis awal dan bayangannya. **Ditanya**: $2a-b$."

### Bagian 2 — Aturan transformasi pada persamaan garis
**Prasyarat konsep:** Cermin terhadap $y=x$: $(x,y)\to(y,x)$, jadi pada persamaan, $x$ dan $y$ saling bertukar. Translasi $T(1,-1)$: $(x,y)\to(x+1,\ y-1)$, jadi titik bayangan $(x',y')$ berasal dari $(x'-1,\ y'+1)$.

#### Langkah 2.1 — Garis pertama
- **Pop-up:** "Tukar $x$ dan $y$, lalu ganti $x$ dengan $x-1$ dan $y$ dengan $y+1$."
- **Visual:** garis $ax+y-9=0$ tercermin terhadap $y=x$ (garis putus-putus), kemudian bergeser 1 ke kanan, 1 ke bawah.
- **Papan:** judul "Garis pertama".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $ax+y-9=0$ | `@s-l1` | garis awal | — |
| a2 | $ay+x-9=0$, yaitu $x+ay-9=0$ | — | cermin $y=x$: $x\leftrightarrow y$ | — |
| a3 | $(x-1)+a(y+1)-9=0$ | — | translasi $(1,-1)$: $x\to x-1$, $y\to y+1$ | — |
| a4 | $x+ay+(a-10)=0$ | — | $-1+a-9=a-10$ | `navy` |
| a5 | $x+ay+(a-10)=x+2y-8$ | $x+2y-8$←`@s-b1` | samakan dengan bayangan | — |
| a6 | $a=2$ | — | koefisien $y$; cek $a-10=-8$ ✓ | `gold` |

- **Pertanyaan cepat** (sebelum a3): "Setelah translasi $(1,-1)$, pada persamaan $x$ diganti dengan…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $x-1$ dan $y+1$ | ya | — |
| $x+1$ dan $y-1$ | tidak | Itu arah geseran titik. Pada persamaan bayangan, kebalikannya: titik $(x,y)$ berasal dari $(x-1,\ y+1)$. |
| $x-1$ dan $y-1$ | tidak | Pergeseran $y$ adalah $-1$, jadi di persamaan $y$ diganti $y+1$. |

#### Langkah 2.2 — Garis kedua
| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $x+by+6=0$ | `@s-l2` | garis awal | — |
| b2 | $y+bx+6=0$, yaitu $bx+y+6=0$ | — | cermin $y=x$ | — |
| b3 | $b(x-1)+(y+1)+6=0$ | — | translasi $(1,-1)$ | — |
| b4 | $bx+y+(7-b)=0$ | — | $-b+1+6=7-b$ | `navy` |
| b5 | bayangan: $2x-y-9=0\ \Rightarrow\ -2x+y+9=0$ | $2x-y-9$←`@s-b2` | kalikan $-1$ agar koefisien $y$ sama-sama $1$ | — |
| b6 | $b=-2$ dan $7-b=9$ ✓ | — | — | `gold` |

### Bagian 3 — Nilai $2a-b$
| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $2a-b=2(2)-(-2)$ | $a$←`a6`, $b$←`b6` | — | — |
| c2 | $2a-b=4+2$ | — | $-(-2)=+2$ | — |
| c3 | $2a-b=6$ | — | — | `gold` |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}ax+y-9=0&\xrightarrow{y=x}x+ay-9=0\xrightarrow{T}x+ay+(a-10)=0\equiv x+2y-8=0\Rightarrow a=2\\x+by+6=0&\xrightarrow{y=x}bx+y+6=0\xrightarrow{T}bx+y+(7-b)=0\equiv-2x+y+9=0\Rightarrow b=-2\\2a-b&=4+2=6\end{aligned}$$

### Bagian 5 — Cocokkan dengan pilihan (kartu A–E)
Pin: $a=2$, $b=-2$.

| Kartu | Pilihan | Stempel | Alasan / jebakan |
|-------|---------|---------|------------------|
| A | −6 | SALAH | Tidak sama dengan $2(2)-(-2)=6$. |
| B | −2 | SALAH | Itu nilai $b$, bukan $2a-b$. |
| C | 0 | SALAH | Tidak sama dengan $2(2)-(-2)=6$. |
| D | 2 | SALAH | Jebakan: hasil bila tanda $b$ terbalik ($b=+2$ memberi $4-2=2$). |
| E | 6 | BENAR | $2(2)-(-2)=6$. |

### Bagian 6 — Selesai
- **Segel:** **E**
- **Pop-up:** "Dari dua garis diperoleh $a=2$ dan $b=-2$, sehingga $2a-b=6$."

### Pemeriksaan hasil
Uji titik: titik $(3,3)$ pada $2x+y-9=0$ dicerminkan menjadi $(3,3)$, ditranslasi menjadi $(4,2)$, dan $4+2(2)-8=0$ ✓. Titik $(0,3)$ pada $x-2y+6=0$ dicerminkan menjadi $(3,0)$, ditranslasi menjadi $(4,-1)$, dan $2(4)-(-1)-9=0$ ✓.

### Kesalahan umum / poin perhatian
- Menukar urutan: translasi dahulu lalu cermin.
- Salah arah substitusi translasi ($x+1$ alih-alih $x-1$).
- Lupa mengalikan $-1$ saat membandingkan $2x-y-9=0$ dengan $bx+y+(7-b)=0$.

---

## SOAL 20 — Translasi lalu Dilatasi Lingkaran

| Atribut | Isi |
|---|---|
| Topik | Transformasi geometri: translasi dan dilatasi pada lingkaran |
| Jenis respons | Pilihan tunggal (A–E); tiap pilihan memuat pasangan (translasi, faktor skala) |
| Jawaban akhir | **C** — $T=\begin{pmatrix}3\\-1\end{pmatrix}$ dan faktor skala $2$ |
| Status | VALID |
| Visual utama | Bidang koordinat SVG dengan tiga lingkaran: $L\to L'\to L''$ (playbook §15: grafik) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Transformasi geometri
- **Judul hero:** `Pembahasan Soal` / `Translasi` + aksen `Dilatasi` / sub `Lingkaran`
- **Lede:** Lingkaran $L$ digeser lalu diperbesar menjadi $L''$. Dari lingkaran awal dan akhir, kita cari translasi dan faktor skalanya.
- **Fakta kunci:** $L$ → `pusat (−5, 3), r = 2` · $L''$ → `(x+4)² + (y−4)² = 16` · Dicari → `T dan k`
- **Ilustrasi lobi:** lingkaran kecil bergeser lalu melebar dari titik asal.

### Bagian 1 — Pahami soal
- **Stabilo:** `pusat (−5, 3) dan jari-jari 2` (merah, `@s-L`), `translasi T` (biru, `@s-T`), `(x+4)² + (y−4)² = 16` (merah, `@s-L2`), `dilatasi berpusat di O(0,0)` (biru, `@s-dil`), `translasi T dan faktor skala` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. Urutan transformasi: **translasi** dahulu ($L\to L'$), lalu **dilatasi** ($L'\to L''$)."
- **Langkah 1.2** — pop-up: "Diketahui $L$ dan $L''$. Kita telusuri **mundur** untuk menemukan $L'$."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | $L$: pusat $(-5,3)$, $r=2$ | `@s-L` | — | — |
| k3 | $L''$: $(x+4)^2+(y-4)^2=16$ | `@s-L2` | — | — |
| k4 | **Ditanya** (label) $T$ dan faktor skala $k$ | `@s-tanya` | — | — |

### Bagian 2 — Membaca lingkaran akhir
**Prasyarat konsep:** $(x-p)^2+(y-q)^2=r^2$ berpusat di $(p,q)$ dengan jari-jari $r$. Translasi tidak mengubah jari-jari; dilatasi $[O,k]$ mengalikan jari-jari dengan $\lvert k\rvert$ dan mengalikan koordinat pusat dengan $k$.

#### Langkah 2.1 — Pusat dan jari-jari $L''$
- **Pop-up:** "Dari persamaan $L''$, baca pusat dan jari-jarinya."
- **Papan:** judul "Lingkaran $L''$".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $(x+4)^2+(y-4)^2=16$ | `@s-L2` | — | — |
| a2 | pusat $L''=(-4,\ 4)$ | — | $x+4=x-(-4)$ | `navy` |
| a3 | $r''^2=16\Rightarrow r''=4$ | $16$←`a1` | $\sqrt{16}=4$ | `navy` |

- **Pertanyaan cepat** (sebelum a3): "Jari-jari lingkaran dengan ruas kanan $16$ adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $4$ | ya | — |
| $16$ | tidak | Ruas kanan adalah $r^2$, bukan $r$. Akarkan $16$. |
| $8$ | tidak | $16\div2=8$ tidak dipakai di sini. Jari-jari adalah akar dari $16$. |

### Bagian 3 — Faktor skala dan lingkaran $L'$
#### Langkah 3.1 — Faktor skala dari jari-jari
- **Pop-up:** "Translasi tidak mengubah jari-jari, jadi $r'=2$. Dilatasi yang membesarkan 2 menjadi 4 berfaktor $k=2$."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $r'=r=2$ | $2$←`k2` | translasi tidak mengubah jari-jari | — |
| b2 | $r''=\lvert k\rvert\cdot r'$ | — | dilatasi | — |
| b3 | $4=\lvert k\rvert\cdot2$ | $4$←`a3`, $2$←`b1` | — | — |
| b4 | $k=2$ | — | $4\div2$ | `gold` |

#### Langkah 3.2 — Pusat $L'$
- **Pop-up:** "Dilatasi berpusat di $O$ mengalikan koordinat pusat dengan $k$. Balikkan untuk mendapat pusat $L'$."
- **Visual:** panah dari pusat $L''(-4,4)$ ke arah $O$ yang memendek setengahnya menjadi $(-2,2)$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $k\cdot(\text{pusat }L')=\text{pusat }L''$ | $k$←`b4` | — | — |
| c2 | $2\cdot(p',q')=(-4,4)$ | $(-4,4)$←`a2` | — | — |
| c3 | pusat $L'=(-2,\ 2)$ | — | tiap koordinat dibagi $2$ | `navy` |

### Bagian 4 — Translasi $T$
- **Pop-up:** "Translasi memindahkan pusat $L=(-5,3)$ ke pusat $L'=(-2,2)$. Selisihnya adalah $T$."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| d1 | $T=\text{pusat }L'-\text{pusat }L$ | — | — | — |
| d2 | $T=(-2-(-5),\ 2-3)$ | $(-5,3)$←`k2`, $(-2,2)$←`c3` | — | — |
| d3 | $T=\begin{pmatrix}3\\-1\end{pmatrix}$ | — | geser 3 ke kanan, 1 ke bawah | `gold` |

- **Pertanyaan cepat** (sebelum d3): "Dari pusat $(-5,3)$ ke $(-2,2)$, translasinya…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $\begin{pmatrix}3\\-1\end{pmatrix}$ | ya | — |
| $\begin{pmatrix}1\\1\end{pmatrix}$ | tidak | Itu selisih $L$ ke $L''$, melewatkan dilatasi. Pusat tujuan translasi adalah $L'=(-2,2)$. |
| $\begin{pmatrix}-3\\1\end{pmatrix}$ | tidak | Arahnya terbalik. Hitung tujuan dikurangi asal. |

### Bagian 5 — Catatan lengkap
$$\begin{aligned}L'':&\ \text{pusat }(-4,4),\ r''=4\\r'=2&\Rightarrow4=\lvert k\rvert\cdot2\Rightarrow k=2\\k\cdot(p',q')&=(-4,4)\Rightarrow(p',q')=(-2,2)\\T&=(-2,2)-(-5,3)=\begin{pmatrix}3\\-1\end{pmatrix}\end{aligned}$$

### Bagian 6 — Cocokkan dengan pilihan (kartu A–E)
| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| A | $T=(3,-1)$, $k=8$ | SALAH | $r''=8\cdot2=16\ne4$ | Jebakan: memakai $16$ (ruas kanan) sebagai jari-jari lalu $16\div2=8$. |
| B | $T=(3,-1)$, $k=4$ | SALAH | $L'(-2,2)\to$ pusat $(-8,8)$, $r''=4\cdot2=8$; keduanya $\ne L''$ | Jebakan: $4$ adalah $r''$, bukan faktor skala. |
| C | $T=(3,-1)$, $k=2$ | BENAR | $(-5,3)\to(-2,2)\to(-4,4)$; $r:2\to2\to4$ | Cocok seluruhnya. |
| D | $T=(1,1)$, $k=2$ | SALAH | $L'$ pusat $(-4,4)$, dilatasi 2 → pusat $(-8,8)$ | Translasi dihitung langsung dari $L$ ke $L''$, melewatkan dilatasi. |
| E | $T=(1,1)$, $k=8$ | SALAH | $L'(-4,4)\to$ pusat $(-32,32)$, $r''=16$ | Kedua nilai salah. |

### Bagian 7 — Selesai
- **Segel:** **C**
- **Pop-up:** "$L(-5,3)$ digeser $(3,-1)$ menjadi $L'(-2,2)$, lalu diperbesar 2 kali menjadi $L''(-4,4)$ berjari-jari 4."

### Pemeriksaan hasil
Maju: $(-5,3)+(3,-1)=(-2,2)$; dilatasi $k=2$ menghasilkan pusat $(-4,4)$ dan jari-jari $2\cdot2=4$; persamaan $(x+4)^2+(y-4)^2=16$ ✓.

### Kesalahan umum / poin perhatian
- Mengambil $16$ sebagai jari-jari (bukan $4$).
- Menghitung $T$ langsung dari $L$ ke $L''$ tanpa menghitung dilatasi lebih dahulu (karena pusat dilatasi $O$, pusat ikut berubah).
- Mengalikan jari-jari dengan $k$ tetapi lupa mengalikan koordinat pusat (atau sebaliknya).

---

## SOAL 21 — Rotasi Garis Berpusat (2, 0)

| Atribut | Isi |
|---|---|
| Topik | Transformasi geometri: rotasi $90^\circ$ berpusat di titik tertentu pada garis |
| Jenis respons | Multi-jawaban: pilih semua titik yang terletak pada garis bayangan (5 pilihan) |
| Jawaban akhir | **(2, 0)** dan **(5, 2)** |
| Status | VALID |
| Visual utama | Bidang koordinat SVG: garis awal, bayangan, titik pusat rotasi, titik kandidat (playbook §15: grafik) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Transformasi geometri
- **Judul hero:** `Pembahasan Soal` / `Rotasi` + aksen `Garis` / sub `Pusat (2, 0)`
- **Lede:** Garis $3x+2y=6$ diputar $90^\circ$ berlawanan arah jarum jam terhadap titik $(2,0)$. Titik mana saja yang terletak pada garis hasil putaran?
- **Fakta kunci:** Garis awal → `3x + 2y = 6` · Rotasi → `90° berlawanan jarum jam` · Pusat → `(2, 0)`
- **Ilustrasi lobi:** garis berputar mengelilingi titik $(2,0)$ dan berhenti pada posisi tegak lurus semula.

### Bagian 1 — Pahami soal
- **Stabilo:** `3x + 2y = 6` (merah, `@s-g`), `90° berlawanan arah jarum jam` (biru, `@s-90`), `pusat rotasi (2, 0)` (biru, `@s-pusat`), `titik yang terletak pada garis l` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. Pusat rotasinya **bukan** titik asal, melainkan $(2,0)$."
- **Langkah 1.2** — pop-up: "Diketahui garis awal. **Ditanya**: titik-titik yang terletak pada bayangannya (garis $l$)."

### Bagian 2 — Aturan rotasi $90^\circ$ berpusat $(2,0)$
**Prasyarat konsep:** rotasi $90^\circ$ berlawanan arah jarum jam dengan pusat $(a,b)$: $(x,y)\to(a-(y-b),\ b+(x-a))$. Untuk pusat $(2,0)$: $(x,y)\to(2-y,\ x-2)$.

#### Langkah 2.1 — Aturan untuk satu titik
- **Pop-up:** "Geser pusat ke titik asal, putar $90^\circ$ ($(u,v)\to(-v,u)$), lalu geser kembali."
- **Visual:** titik $(4,-3)$ pada garis diputar mengelilingi $(2,0)$ menjadi $(5,2)$ dengan animasi busur.
- **Papan:** judul "Aturan rotasi".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $(u,v)=(x-2,\ y-0)$ | — | geser pusat ke $O$ | — |
| a2 | $(u',v')=(-v,\ u)=(-y,\ x-2)$ | — | putar $90^\circ$ berlawanan jarum jam | — |
| a3 | $(x',y')=(u'+2,\ v')=(2-y,\ x-2)$ | — | geser kembali | `navy` |

- **Pertanyaan cepat** (sebelum a3): "Rotasi $90^\circ$ berlawanan jarum jam mengubah $(u,v)$ menjadi…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $(-v,\ u)$ | ya | — |
| $(v,\ -u)$ | tidak | Itu rotasi searah jarum jam. Berlawanan jarum jam: titik $(1,0)$ menjadi $(0,1)$. |
| $(-u,\ -v)$ | tidak | Itu rotasi $180^\circ$. |

### Bagian 3 — Persamaan garis bayangan
#### Langkah 3.1 — Substitusi invers
- **Pop-up:** "Dari $x'=2-y$ dan $y'=x-2$, ambil $x$ dan $y$ lama, lalu masukkan ke $3x+2y=6$."
- **Papan:** judul "Garis bayangan $l$"; pin: $(x',y')=(2-y,\ x-2)$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $y=2-x'$ dan $x=y'+2$ | — | dari $x'=2-y$ dan $y'=x-2$ | — |
| b2 | $3x+2y=6$ | `@s-g` | garis awal | — |
| b3 | $3(y'+2)+2(2-x')=6$ | — | substitusi $x$ dan $y$ | — |
| b4 | $3y'+6+4-2x'=6$ | — | jabarkan | — |
| b5 | $-2x'+3y'+4=0$ | — | $6+4-6=4$ | `navy` |
| b6 | garis $l$: $2x-3y=4$ | — | kalikan $-1$ dan pindah konstanta | `gold` |

- **Pertanyaan cepat** (sebelum b3): "Dari $x'=2-y$, maka $y=\ldots$"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $2-x'$ | ya | — |
| $x'-2$ | tidak | Pindahkan $y$ ke kiri dan $x'$ ke kanan: $y=2-x'$, bukan $x'-2$. |
| $2+x'$ | tidak | $x'=2-y\Rightarrow y=2-x'$. Tanda $x'$ tetap negatif. |

#### Langkah 3.2 — Menguji tiap titik
- **Pop-up:** "Masukkan koordinat tiap titik ke $2x-3y=4$."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $(-3,-2)$: $2(-3)-3(-2)=-6+6=0\ne4$ | $(-3,-2)$←`@o-1` | tidak pada $l$ | — |
| c2 | $(-2,-1)$: $-4+3=-1\ne4$ | `@o-2` | tidak pada $l$ | — |
| c3 | $(1,2)$: $2-6=-4\ne4$ | `@o-3` | tidak pada $l$ | — |
| c4 | $(2,0)$: $4-0=4$ | `@o-4` | pada $l$ | `gold` |
| c5 | $(5,2)$: $10-6=4$ | `@o-5` | pada $l$ | `gold` |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}(x,y)&\to(x',y')=(2-y,\ x-2)\\x&=y'+2,\quad y=2-x'\\3(y'+2)+2(2-x')&=6\Rightarrow-2x'+3y'+4=0\\l&:\ 2x-3y=4\end{aligned}$$

### Bagian 5 — Analisis pilihan (5 kartu)
| Kartu | Pilihan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|---------|---------|---------------|------------------|
| (1) | $(-3,-2)$ | SALAH | $2(-3)-3(-2)=0\ne4$ | Tidak memenuhi. |
| (2) | $(-2,-1)$ | SALAH | $-4+3=-1\ne4$ | Tidak memenuhi. |
| (3) | $(1,2)$ | SALAH | $2-6=-4\ne4$ | Tidak memenuhi. |
| (4) | $(2,0)$ | BENAR | $4=4$ | Titik pusat rotasi. Karena $(2,0)$ juga ada di garis awal ($3\cdot2=6$), titik itu tidak ikut berpindah dan tetap di $l$. |
| (5) | $(5,2)$ | BENAR | $10-6=4$ | Bayangan titik $(4,-3)$ pada garis awal. |

### Bagian 6 — Selesai
- **Segel:** **(2,0), (5,2)**
- **Pop-up:** "Garis bayangan $l$: $2x-3y=4$. Titik yang terletak padanya: $(2,0)$ dan $(5,2)$."

### Pemeriksaan hasil
Metode kedua (titik): dua titik pada $3x+2y=6$, yaitu $(0,3)$ dan $(2,0)$. Bayangan: $(0,3)\to(2-3,\ 0-2)=(-1,-2)$ dan $(2,0)\to(2,0)$. Garis melalui $(-1,-2)$ dan $(2,0)$ memiliki gradien $\frac23$; cek $2x-3y=4$ memberi $-2+6=4$ ✓ dan $4-0=4$ ✓. Titik ketiga: $(4,-3)$ pada garis awal ($12-6=6$ ✓) menjadi $(2+3,\ 4-2)=(5,2)$ ✓.
Metode ketiga (vektor normal): $(3,2)$ berputar menjadi $(-2,3)$ sehingga bayangan berbentuk $-2x+3y=c$; melalui $(2,0)$ memberi $c=-4$, yaitu $2x-3y=4$ ✓.

### Kesalahan umum / poin perhatian
- Memakai pusat $(0,0)$ padahal pusat rotasinya $(2,0)$.
- Memutar searah jarum jam.
- Menguji titik pada **garis awal** (misal $(5,2)$ tidak terletak pada $3x+2y=6$ karena $19\neq6$), bukan pada bayangan.

---

## SOAL 22 — Limit Fungsi Rasional di $x=3$

| Atribut | Isi |
|---|---|
| Topik | Limit: substitusi langsung pada fungsi rasional |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **A** — $-\dfrac{7}{67}$ |
| Status | VALID |
| Visual utama | Papan + tabel nilai mendekati $x=3$ dari kiri dan kanan (playbook §15: Limit) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Limit
- **Judul hero:** `Pembahasan Soal` / `Limit` + aksen `Fungsi Rasional` / sub `x → 3`
- **Lede:** Pembilang dan penyebutnya sama-sama polinom. Selama penyebutnya tidak nol di $x=3$, kita bisa langsung mensubstitusi.
- **Fakta kunci:** Titik limit → `x = 3` · Bentuk → `polinom / polinom` · Dicari → `nilai limit`
- **Ilustrasi lobi:** titik bergerak mendekati $x=3$ dari kiri dan kanan; nilai fungsi mendekati satu angka.

### Bagian 1 — Pahami soal
- **Stabilo:** $x\to3$ (biru, `@s-x3`), pembilang $x^3-3x^2+2x+1$ (merah, `@s-pem`), penyebut $5+3x-9x^2$ (merah, `@s-pen`), `nilai limit` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca limitnya. Periksa dahulu: berapa penyebut saat $x=3$?"

### Bagian 2 — Substitusi langsung
**Prasyarat konsep:** bila $g(a)\ne0$, maka $\lim_{x\to a}\dfrac{f(x)}{g(x)}=\dfrac{f(a)}{g(a)}$ karena fungsi rasional kontinu di titik yang penyebutnya tidak nol.

#### Langkah 2.1 — Memeriksa penyebut
- **Pop-up:** "Hitung penyebut di $x=3$ lebih dahulu. Jika bukan nol, substitusi aman."
- **Papan:** judul "Penyebut".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $5+3(3)-9(3)^2$ | $3$←`@s-x3`, rumus←`@s-pen` | — | — |
| a2 | $=5+9-9(9)$ | — | $3(3)=9$; $3^2=9$ | — |
| a3 | $=5+9-81$ | — | $9\cdot9=81$ | — |
| a4 | $=-67\ne0$ | — | substitusi langsung boleh | `navy` |

- **Pertanyaan cepat** (sebelum a3): "Berapa $9(3)^2$?"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $81$ | ya | — |
| $27$ | tidak | Itu $9\cdot3$. Pangkat dua hanya berlaku pada $3$: $3^2=9$, lalu $9\cdot9=81$. |
| $54$ | tidak | $9\cdot6$ salah. Hitung $3^2=9$ lebih dahulu. |

#### Langkah 2.2 — Pembilang
- **Pop-up:** "Sekarang pembilangnya di $x=3$."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $3^3-3(3)^2+2(3)+1$ | $3$←`@s-x3`, rumus←`@s-pem` | — | — |
| b2 | $=27-27+6+1$ | — | $3^3=27$; $3\cdot9=27$; $2\cdot3=6$ | — |
| b3 | $=7$ | — | $27-27=0$; $0+6+1=7$ | `navy` |

#### Langkah 2.3 — Hasil limit
| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $\displaystyle\lim_{x\to3}\dfrac{x^3-3x^2+2x+1}{5+3x-9x^2}=\dfrac{7}{-67}$ | $7$←`b3`, $-67$←`a4` | pembilang di atas, penyebut di bawah | — |
| c2 | $=-\dfrac{7}{67}$ | — | tanda negatif dipindah ke depan pecahan | `gold` |

### Bagian 3 — Mengintip lewat tabel (opsional)
- **Pop-up:** "Mau melihat nilai fungsi saat $x$ mendekati 3? Tabelnya mendekati $-0{,}1045$." Tombol **[Ya, tampilkan tabel]** **[Tidak, lanjut saja]**.
- **Tabel:** $x=2{,}9\to-0{,}0961$; $x=2{,}99\to-0{,}1036$; $x=3{,}01\to-0{,}1053$; $x=3{,}1\to-0{,}1130$. Garis putus-putus pada $-\frac7{67}\approx-0{,}1045$.

### Bagian 4 — Catatan lengkap
$$\begin{aligned}\text{penyebut}&:\ 5+3(3)-9(3)^2=5+9-81=-67\ne0\\\text{pembilang}&:\ 27-27+6+1=7\\\lim_{x\to3}\frac{x^3-3x^2+2x+1}{5+3x-9x^2}&=\frac{7}{-67}=-\frac{7}{67}\end{aligned}$$

### Bagian 5 — Cocokkan dengan pilihan (kartu A–E)
| Kartu | Pilihan | Stempel | Alasan / jebakan |
|-------|---------|---------|------------------|
| A | $-\frac7{67}$ | BENAR | $\frac{7}{-67}$. |
| B | $-\frac6{67}$ | SALAH | Pembilang $7$, bukan $6$. |
| C | $\frac6{76}$ | SALAH | Pembilang dan penyebut keliru dan tanda hilang. |
| D | $\frac7{67}$ | SALAH | Tanda negatif penyebut hilang. |
| E | $\frac7{76}$ | SALAH | Jebakan: $76$ adalah $67$ dengan digit tertukar dan tanda hilang. |

### Bagian 6 — Selesai
- **Segel:** **A**
- **Pop-up:** "Penyebut di $x=3$ bernilai $-67$ dan pembilangnya $7$, jadi limitnya $-\frac7{67}$."

### Pemeriksaan hasil
Tabel numerik di atas bergerak mendekati $-0{,}1045$, dan $-\frac{7}{67}\approx-0{,}10448$ ✓. Nilai $x=2{,}99$ dan $x=3{,}01$ mengapit angka itu (−0,1036 dan −0,1053).

### Kesalahan umum / poin perhatian
- Mencoba memfaktorkan atau memakai L'Hôpital padahal penyebutnya tidak nol.
- Salah hitung $9(3)^2$ (mengurangi jadi $27$) atau $3^3$.
- Menghilangkan tanda negatif pada penyebut.

---

## SOAL 23 — Limit Tak Hingga Keuntungan

| Atribut | Isi |
|---|---|
| Topik | Limit di tak hingga: fungsi rasional berderajat sama |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **B** — Rp3.000.000,00 |
| Status | VALID |
| Visual utama | Grafik $K(p)$ yang mendekati asimtot $y=3$ + tabel nilai (playbook §15: Limit) |
| Aset gambar | tidak ada |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Limit di tak hingga
- **Judul hero:** `Pembahasan Soal` / `Keuntungan` + aksen `Sangat Banyak` / sub `Limit p → ∞`
- **Lede:** Keuntungan Roni bergantung pada banyak porsi $p$. Jika porsi yang terjual sangat banyak, keuntungan mendekati berapa?
- **Fakta kunci:** Satuan $K$ → `juta rupiah` · Porsi → `p → ∞` · Dicari → `nilai K(p)`
- **Ilustrasi lobi:** kurva $K(p)$ naik lalu mendatar mendekati garis putus-putus $y=3$.

### Bagian 1 — Pahami soal
- **Stabilo:** $K(p)=\dfrac{9p^2+2p+10}{3p^2+3p+2}$ (merah, `@s-K`), `jutaan rupiah` (biru, `@s-juta`), `jumlah porsi sangat banyak` (biru, `@s-banyak`), `keuntungan` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal. $K$ dalam **juta rupiah**. 'Sangat banyak' berarti $p\to\infty$."
- **Langkah 1.2** — pop-up: "Ditanya: nilai yang didekati $K(p)$ saat $p\to\infty$, lalu ubah ke rupiah."

### Bagian 2 — Limit di tak hingga
**Prasyarat konsep:** untuk pecahan polinom, bagilah pembilang dan penyebut dengan pangkat tertinggi penyebut ($p^2$). Suku $\frac{c}{p^n}\to0$ ketika $p\to\infty$ ($n>0$). Jika derajat pembilang dan penyebut sama, limitnya adalah perbandingan koefisien pangkat tertinggi.

#### Langkah 2.1 — Bagi dengan $p^2$
- **Pop-up:** "Bagi pembilang dan penyebut dengan $p^2$, pangkat tertinggi."
- **Papan:** judul "Limit $p\to\infty$".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $\displaystyle\lim_{p\to\infty}\dfrac{9p^2+2p+10}{3p^2+3p+2}$ | `@s-K` | — | — |
| a2 | $=\displaystyle\lim_{p\to\infty}\dfrac{\frac{9p^2}{p^2}+\frac{2p}{p^2}+\frac{10}{p^2}}{\frac{3p^2}{p^2}+\frac{3p}{p^2}+\frac{2}{p^2}}$ | — | pembilang dan penyebut dibagi $p^2$ | — |
| a3 | $=\displaystyle\lim_{p\to\infty}\dfrac{9+\frac2p+\frac{10}{p^2}}{3+\frac3p+\frac2{p^2}}$ | — | sederhanakan | `navy` |

- **Pertanyaan cepat** (sebelum a3): "Saat $p\to\infty$, $\dfrac2p$ mendekati…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $0$ | ya | — |
| $2$ | tidak | Pembilang tetap $2$, tetapi penyebutnya $p$ makin besar sehingga pecahannya mengecil. |
| $\infty$ | tidak | $p$ ada di **penyebut**. Pecahan makin kecil ketika penyebut makin besar. |

#### Langkah 2.2 — Hasil
| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $\dfrac{2}{p}\to0,\ \dfrac{10}{p^2}\to0,\ \dfrac3p\to0,\ \dfrac2{p^2}\to0$ | — | suku dengan $p$ di penyebut hilang | — |
| b2 | $=\dfrac{9+0+0}{3+0+0}$ | $9$, $3$←`a3` | — | — |
| b3 | $=\dfrac93=3$ | — | $K\to3$ juta | `navy` |
| b4 | $3$ juta $=3\times1000000=3000000$ rupiah | — | ubah satuan; ditulis Rp3.000.000 | `gold` |

### Bagian 3 — Tabel nilai (opsional)
- **Pop-up:** "Mau melihat $K(p)$ untuk $p$ makin besar?" Tombol **[Ya, tampilkan tabel]** **[Tidak, lanjut saja]**.
- **Tabel:** $K(1)=\frac{21}{8}=2{,}625$; $K(10)=\frac{930}{332}\approx2{,}801$; $K(100)=\frac{90210}{30302}\approx2{,}977$; $K(1000)\approx2{,}9977$. Grafik mendekati garis $y=3$.

### Bagian 4 — Catatan lengkap
$$\lim_{p\to\infty}\frac{9p^2+2p+10}{3p^2+3p+2}=\lim_{p\to\infty}\frac{9+\frac2p+\frac{10}{p^2}}{3+\frac3p+\frac2{p^2}}=\frac93=3$$
Satuan $K$ adalah juta rupiah: $3$ juta $=$ Rp3.000.000,00.

### Bagian 5 — Cocokkan dengan pilihan (kartu A–E)
| Kartu | Pilihan | Stempel | Alasan / jebakan |
|-------|---------|---------|------------------|
| A | Rp2.000.000,00 | SALAH | Limitnya $3$, bukan $2$. |
| B | Rp3.000.000,00 | BENAR | $\frac93=3$ juta. |
| C | Rp5.000.000,00 | SALAH | Jebakan: $\frac{10}{2}=5$ adalah $K(0)$, yaitu untuk $p$ **mendekati nol**, bukan tak hingga. |
| D | Rp9.000.000,00 | SALAH | Jebakan: hanya koefisien pembilang ($9$); penyebut juga membesar. |
| E | Rp10.000.000,00 | SALAH | Jebakan: hanya konstanta pembilang ($10$). |

### Bagian 6 — Selesai
- **Segel:** **B**
- **Pop-up:** "Untuk porsi sangat banyak, keuntungan Roni mendekati $3$ juta rupiah: **Rp3.000.000,00**."

### Pemeriksaan hasil
Tabel: $K(1000)=\frac{9002010}{3003002}\approx2{,}9977$, makin dekat $3$ ✓. Metode kedua: perbandingan koefisien $\frac{9}{3}=3$ ✓.

### Kesalahan umum / poin perhatian
- Menjawab "3" tanpa mengubah ke rupiah (satuan jutaan).
- Mengambil perbandingan konstanta ($10/2=5$): itu untuk $p\to0$.
- Mengambil hanya pembilang atau penyebut.

---

## SOAL 24 — Kerucut Es Krim dan Limit

| Atribut | Isi |
|---|---|
| Topik | Limit fungsi trigonometri pada geometri: perbandingan luas segitiga dan setengah lingkaran |
| Jenis respons | Multi-jawaban: pilih semua pernyataan yang benar (5 pernyataan) |
| Jawaban akhir | Hanya pernyataan **(5)** benar; (1), (2), (3), (4) salah |
| Status | VALID |
| Visual utama | SVG segitiga sama kaki dengan setengah lingkaran, slider $\theta$ dan jari-jari (playbook §15: Trigonometri dan Limit) |
| Aset gambar | `./kerucut_es_krim.png` |

**Data dibaca dari gambar `kerucut_es_krim.png`:** segitiga sama kaki $ABC$ dengan $AC=BC$ (tanda sama panjang pada kedua kaki), titik sudut $C$ di bawah dengan sudut $\theta$ di antara $CA$ dan $CB$. Alas $AB$ mendatar dan menjadi **diameter** setengah lingkaran yang berada di atasnya.

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Limit dan trigonometri
- **Judul hero:** `Pembahasan Soal` / `Kerucut` + aksen `Es Krim` / sub `Rasio Luas`
- **Lede:** Segitiga di bawah dan setengah lingkaran di atas membentuk bentuk es krim. Bagaimana perbandingan luas keduanya berubah ketika sudut $\theta$ berubah?
- **Fakta kunci:** $X$ → `luas segitiga ABC` · $Y$ → `luas setengah lingkaran` · Dicari → `X/Y dan limitnya`
- **Ilustrasi lobi:** kerucut es krim dengan sudut $\theta$ yang bisa dibuka-tutup.

### Bagian 1 — Pahami soal
- **Stabilo:** `segitiga sama kaki ABC` (biru, `@s-tri`), `setengah lingkaran dengan diameter AB` (biru, `@s-semi`), `X` dan `Y` (merah, `@s-X`, `@s-Y`), `θ` pada gambar (merah, `@g-theta`), `$\lim_{\theta\to a}\frac XY$` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca soal dan lihat gambar. Sudut $\theta$ ada di titik $C$, di antara kedua kaki."
- **Langkah 1.2** — pop-up: "Kita cari rumus $\frac XY$ dahulu, baru menilai kelima pernyataan."

### Bagian 2 — Rumus $X$, $Y$, dan $\frac XY$
**Prasyarat konsep:** luas segitiga $\frac12\times$ alas $\times$ tinggi; luas setengah lingkaran $\frac12\pi r^2$. Pada segitiga sama kaki, garis tinggi dari $C$ membagi sudut $\theta$ dan alas $AB$ menjadi dua bagian sama.

#### Langkah 2.1 — Tinggi segitiga
- **Pop-up:** "Tarik tinggi $CM$ dari $C$ ke tengah $AB$. Segitiga siku-siku $AMC$ punya sudut $\frac\theta2$ di $C$."
- **Visual:** garis tinggi $CM$ ditarik; segitiga siku-siku $AMC$ disorot; sisi $AM=r$ (jari-jari) berwarna merah; sudut $\frac\theta2$ berwarna biru.
- **Papan:** judul "Tinggi segitiga".

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $AB=2r$ | `@s-semi` | $AB$ = diameter setengah lingkaran | — |
| a2 | $AM=r$ | — | $M$ titik tengah $AB$ | — |
| a3 | $\tan\dfrac\theta2=\dfrac{AM}{CM}=\dfrac{r}{CM}$ | `@g-theta` | sudut $ACM=\frac\theta2$ | — |
| a4 | $CM=\dfrac{r}{\tan\frac\theta2}=r\cot\dfrac\theta2$ | — | — | `navy` |

- **Pertanyaan cepat** (sebelum a3): "Sudut $ACM$ di segitiga siku-siku $AMC$ adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $\dfrac\theta2$ | ya | — |
| $\theta$ | tidak | $\theta$ adalah seluruh sudut di $C$. Garis tinggi membaginya menjadi dua sama besar. |
| $90^\circ-\theta$ | tidak | Itu bukan sudut di $C$. Sudut $ACM$ separuh dari $\theta$. |

#### Langkah 2.2 — $X$ dan $Y$
| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $X=\tfrac12\cdot AB\cdot CM=\tfrac12(2r)\left(r\cot\tfrac\theta2\right)$ | $AB$←`a1`, $CM$←`a4` | luas segitiga | — |
| b2 | $X=r^2\cot\dfrac\theta2$ | — | $\frac12\cdot2=1$ | `navy` |
| b3 | $Y=\tfrac12\pi r^2$ | `@s-Y` | luas setengah lingkaran | `navy` |

#### Langkah 2.3 — Perbandingan $\frac XY$ dan limitnya
| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $\dfrac XY=\dfrac{r^2\cot\frac\theta2}{\frac12\pi r^2}$ | $X$←`b2`, $Y$←`b3` | — | — |
| c2 | $\dfrac XY=\dfrac{2}{\pi}\cot\dfrac\theta2$ | — | $r^2$ saling menghilang | `gold` |
| c3 | $\displaystyle\lim_{\theta\to a}\dfrac XY=\dfrac2\pi\cot\dfrac a2$ | — | $\cot\frac\theta2$ kontinu untuk $0<a\le\pi$ | `gold` |

- **Sorotan:** pada slider, jari-jari diubah; nilai $\frac XY$ **tidak berubah** (jari-jari menghilang). Sudut $\theta$ diubah; nilainya berubah.

### Bagian 3 — Menilai kelima pernyataan
- **Visual:** tabel nilai $\frac XY=\frac2\pi\cot\frac\theta2$: $\theta=\frac\pi6\to\frac2\pi(2+\sqrt3)\approx2{,}38$; $\frac\pi3\to\frac2\pi\sqrt3\approx1{,}10$; $\frac\pi2\to\frac2\pi\approx0{,}64$; $\frac{2\pi}3\to\frac2\pi\cdot\frac{\sqrt3}3\approx0{,}37$; $\pi\to0$.

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| d1 | (1) $r$ tidak muncul di $\frac2\pi\cot\frac\theta2$ | `c2` | jari-jari tidak berpengaruh → **salah** | — |
| d2 | (2) hasil limit bergantung pada $a$: $\frac2\pi\cot\frac a2$ | `c3` | sudut berpengaruh → **salah** | — |
| d3 | (3) $\frac XY$ berubah mengikuti $\theta$ | `c2` | tidak selalu sama → **salah** | — |
| d4 | (4) $a=\frac\pi6$: $\frac2\pi\cot\frac\pi{12}=\frac2\pi(2+\sqrt3)\approx2{,}38\ne\frac2\pi$ | — | $\cot15^\circ=2+\sqrt3$ → **salah** | — |
| d5 | (5) $\theta=\pi$: $\frac2\pi\cot\frac\pi2=\frac2\pi(0)=0$ | — | → **benar** | `gold` |

### Bagian 4 — Catatan lengkap
$$\begin{aligned}CM&=r\cot\frac\theta2,\quad X=\tfrac12(2r)\left(r\cot\tfrac\theta2\right)=r^2\cot\frac\theta2,\quad Y=\tfrac12\pi r^2\\\frac XY&=\frac2\pi\cot\frac\theta2,\qquad\lim_{\theta\to a}\frac XY=\frac2\pi\cot\frac a2\end{aligned}$$

### Bagian 5 — Analisis pernyataan (5 kartu)
Pin: $\frac XY=\frac2\pi\cot\frac\theta2$.

| Kartu | Pernyataan | Stempel | Rumus singkat | Alasan / jebakan |
|-------|------------|---------|---------------|------------------|
| (1) | Besar jari-jari mempengaruhi nilai limit. | SALAH | $r^2$ habis dibagi | Jari-jari menghilang dari perbandingan. |
| (2) | Besar sudut tidak mempengaruhi nilai limit. | SALAH | $\frac2\pi\cot\frac a2$ bergantung $a$ | Nilai limit berubah ketika sudut $a$ berubah. |
| (3) | Nilai $\frac XY$ selalu sama untuk berapa pun $\theta$. | SALAH | $\frac2\pi\cot\frac\theta2$ berubah | Jebakan: karena $r$ tidak berpengaruh, mengira seluruh nilai konstan. |
| (4) | $\lim_{\theta\to\frac\pi6}\frac XY=\frac2\pi$. | SALAH | $\frac2\pi(2+\sqrt3)\approx2{,}38$ | $\frac2\pi$ adalah nilai di $\theta=\frac\pi2$ ($\cot\frac\pi4=1$). |
| (5) | Jika $\theta=\pi$ maka $\frac XY=0$. | BENAR | $\cot\frac\pi2=0$ | Segitiga menjadi garis lurus: luas $X=0$. |

*Ditambahkan M1 (20 Okt 2026; kunci tidak berubah), dipakai di `app/src/content/soal/q24.ts`:*
- **Bagian 1, papan:** k1 Diketahui · k2 $X=$ luas segitiga $ABC$ (`@s-X`) · k3 $Y=$ luas setengah lingkaran (`@s-Y`) · k4 $AB=$ diameter (`@s-semi`) · k5 $\theta=\angle ACB$ (di titik $C$) · k6 Ditanya $\lim_{\theta\to a}\frac XY$ (`@s-tanya`). Label $\theta$ pada gambar SVG menjadi sumber `@g-theta` untuk baris a3.
- **Bagian 2, pop-up 2.2–2.4:** "Luas segitiga memakai alas $AB$ dan tinggi $CM$. Luas setengah lingkaran adalah $\frac12\pi r^2$." · "Bagi $X$ dengan $Y$. Jari-jari $r^2$ saling menghilang." · "Coba sendiri: geser jari-jari, nilai $\frac XY$ tidak berubah. Geser sudut $\theta$, nilainya berubah." (dari *Sorotan*).
- **Bagian 3:** satu langkah per baris d1–d5; visual mengatur $\theta$ = 60°, 120°, 90°, 30°, 180° (dan $r$ 4,5 cm pada d1). Pin: $\frac XY=\frac2\pi\cot\frac\theta2$. Tabel nilai *Visual* Bagian 3 ditawarkan sebagai konten opsional pada d3.
- **Bagian 5:** pop-up per kartu dari kolom *Alasan/jebakan*; papan ringkasan s1–s5 + s6 "Jawaban: hanya pernyataan (5)"; pertanyaan kesimpulan: (1) dan (5) · (2) dan (5) · (3) dan (5) · (4) dan (5) · **(5) saja**, petunjuk tiap pilihan salah dari kolom alasan.

*Revisi alur oleh pemilik materi (21 Okt 2026; kunci tidak berubah: hanya (5) benar), dipakai di `app/src/content/soal/q24.ts`. Menggantikan blok "Ditambahkan M1" di atas.*

Alur mengikuti cara Pak Penta membahas soal ini di kelas. Bentuk tangen dipakai: $\frac XY=\frac{2}{\pi\tan\frac\theta2}$, setara dengan $\frac2\pi\cot\frac\theta2$ di atas. Tata letak: panggung penuh dua kolom (PRD v1.5).

*Revisi kedua oleh pemilik materi (21 Okt 2026; kunci tidak berubah): es krim tidak lagi diputar; segitiga siku-siku dipisah, dipindahkan, dan diputar sebelum mencari $t$; coretan muncul setelah rumus tampil utuh; $\frac XY$ diolah bertahap tanpa menulis ulang; setiap pernyataan disalin dulu dari soal sebelum dianalisis. Daftar di bawah sudah memuat revisi kedua.*

- **Bagian 1 — Pahami soal**
  - 1.1 Es krim tampil diam (tanpa putaran). Baris: $X$ luas segitiga (`@s-X`), $Y$ luas setengah lingkaran (`@s-Y`), $\theta$ sudut puncak di $C$ (`@g-theta`).
  - 1.2 Kertas soal, stabilo pada $\lim_{\theta\to a}\frac XY$. Baris: Ditanya (`@s-tanya`).
- **Bagian 2 — Luas setengah lingkaran**
  - 2.1 Jari-jari dari pusat ke $B$ berkedip ($r$); $AB$ memerah ($2r$). Baris: $r$ (`@g-r`), $AB=2r$ (`@g-2r`).
  - 2.2 $Y=\frac12\pi r^2$ (navy).
    - Pertanyaan cepat baru: "Luas setengah lingkaran dengan jari-jari $r$ adalah…"
      - $\frac12\pi r^2$: benar.
      - $\pi r^2$: "luas lingkaran penuh".
      - $\pi r$: "setengah keliling".
      - $\frac14\pi r^2$: "seperempat lingkaran".
- **Bagian 3 — Luas segitiga**
  - 3.1 $X=\frac12\times$ alas $\times$ tinggi; alas $AB=2r$.
  - 3.2 Garis tinggi $t$ ditarik; sudut $\theta$ terbelah menjadi $\frac\theta2+\frac\theta2$ dan segitiga terbelah menjadi dua bagian. Pertanyaan cepat lama (sudut $\frac\theta2$).
  - 3.3 Segitiga siku-siku kanan disorot, dipindahkan ke tengah, dan diputar sehingga sudut $\frac\theta2$ di kanan: sisi depan $r$ tegak, sisi samping $t$ mendatar. Papan "Segitiga siku-siku". Baris: $\tan\frac\theta2=\frac{\text{depan}}{\text{samping}}=\frac rt$ (terbang dari label potongan).
  - 3.4 Baris baru: $t\tan\frac\theta2=r$ (kedua ruas dikali $t$).
  - 3.5 $t=\frac{r}{\tan\frac\theta2}$ (navy; kedua ruas dibagi $\tan\frac\theta2$).
  - 3.6 Segitiga dikembalikan. Pin $t$. Baris: $X=\frac12\times2r\times\frac{r}{\tan\frac\theta2}$ tampil utuh.
  - 3.7 Angka $2$ dicoret (garis merah) setelah rumus utuh, lalu $X=\frac{r^2}{\tan\frac\theta2}$ (navy).
- **Bagian 4 — Gabungkan $\frac XY$**
  - 4.1 Pin $X$, $Y$. Baris: $\frac XY=\dfrac{\frac{r^2}{\tan\frac\theta2}}{\frac12\pi r^2}$ (terbang dari pin).
  - 4.2 Baris yang sama: $r^2$ di atas dan di bawah dicoret (tidak ditulis ulang).
  - 4.3 Baris baru: $=\frac{1}{\tan\frac\theta2}:\frac12\pi$ (sisa setelah dicoret).
  - 4.4 Baris baru: $=\frac{1}{\tan\frac\theta2}\times\frac2\pi$ (dibagi $\frac12\pi$ sama dengan dikali $\frac2\pi$).
  - 4.5 $\frac XY=\frac{2}{\pi\tan\frac\theta2}$ (navy; emas disimpan untuk jawaban).
- **Bagian 5 — Uji kelima pernyataan** (papan per pernyataan; tiap pernyataan dibuka dengan kertas soal, pernyataan itu disorot, lalu teksnya disalin ke papan sebelum dianalisis)
  - (1) $r$ tidak ada di rumus. Visual: jari-jari diubah, $\frac XY$ tetap. **Salah.**
  - (2) $\lim_{\theta\to a}\frac XY=\frac{2}{\pi\tan\frac a2}$ bergantung pada $a$. **Salah.**
  - (3) Di $\theta=90^\circ$: $\tan45^\circ=1$, $\frac XY=\frac2\pi\approx0{,}64$. Di $\theta=60^\circ$: $\tan30^\circ=\frac{\sqrt3}3$, $\frac XY\approx1{,}10$. Berbeda, jadi **salah**.
  - (4) $\theta\to\frac\pi6$: $\tan15^\circ=2-\sqrt3$, $\lim\frac XY=\frac{2}{\pi(2-\sqrt3)}\approx2{,}38\ne\frac2\pi$. **Salah.**
  - (5) $\theta=\pi$: titik $C$ jatuh di $AB$, $t=0$, $X=\frac12\cdot2r\cdot0=0$, jadi $\frac XY=0$. **Benar** (emas).
- **Bagian 6 — Catatan lengkap.**
- **Bagian 7 — Cocokkan pernyataan:** satu langkah, kelima kartu terbuka. Pertanyaan kesimpulan seperti di atas, petunjuk dalam bentuk tangen.
- **Bagian 8 — Selesai:** segel (5).
- **Ringkasan papan:** $\frac XY=\frac{2}{\pi\tan\frac\theta2}$ (navy) · **Jawaban: hanya pernyataan (5)** (emas).

### Bagian 6 — Selesai
- **Segel:** **(5)**
- **Pop-up:** "$\frac XY=\frac2\pi\cot\frac\theta2$: bebas dari jari-jari, tetapi bergantung pada sudut. Hanya pernyataan (5) yang benar."

### Pemeriksaan hasil
Uji numerik di $\theta=\frac\pi2$: segitiga siku-siku sama kaki dengan alas $2r$ memiliki tinggi $r$, $X=\frac12(2r)(r)=r^2$, $\frac XY=\frac{r^2}{\frac12\pi r^2}=\frac2\pi$ ✓ cocok dengan rumus. Uji di $\theta=\pi$: titik $C$ berada pada $AB$, tinggi $0$, $X=0$ ✓.

### Kesalahan umum / poin perhatian
- Memakai $\cot\theta$ (bukan $\cot\frac\theta2$); pada $\theta=\frac\pi6$ akan menghasilkan $\frac2\pi\sqrt3\approx1{,}10$, juga bukan $\frac2\pi$.
- Menganggap nilai tidak bergantung $\theta$ karena $r$ saling menghilang.
- Menafsirkan "sudut tidak mempengaruhi limit" sebagai "limit tidak bergantung pada $a$".

---

## SOAL 25 — Limit Trigonometri

| Atribut | Isi |
|---|---|
| Topik | Limit fungsi trigonometri: identitas sudut ganda dan faktorisasi |
| Jenis respons | Pilihan tunggal (A–E) |
| Jawaban akhir | **E** — $\dfrac32$ |
| Status | VALID |
| Visual utama | Papan + tabel nilai mendekati $x=3$ (playbook §15: Limit) |
| Aset gambar | tidak ada (teks soal dipakai apa adanya; tidak ada gambar sumber) |

### Bagian 0 — Lobi
- **Eyebrow:** Kelas 12 · Matematika Lanjut · Limit trigonometri
- **Judul hero:** `Pembahasan Soal` / `Limit` + aksen `Trigonometri` / sub `x → 3`
- **Lede:** Pembilang dan penyebut sama-sama menjadi nol di $x=3$. Dengan identitas sudut ganda dan faktorisasi, bentuk $\frac00$ bisa dipecahkan.
- **Fakta kunci:** Titik limit → `x = 3` · Bentuk → `0/0` · Sudut → `6x − 18`
- **Ilustrasi lobi:** dua grafik (pembilang dan penyebut) sama-sama menyentuh nol di $x=3$.

### Bagian 1 — Pahami soal
- **Stabilo:** pembilang $1-\cos(6x-18)$ (merah, `@s-pem`), faktor $x-\frac9x$ (biru, `@s-faktor`), $\sin(6x-18)$ (merah, `@s-sin`), $x\to3$ (biru, `@s-x3`), `nilai limit` (emas, `@s-tanya`).
- **Langkah 1.1** — pop-up: "Baca limitnya dengan teliti. Faktornya adalah $x-\frac{9}{x}$ (bukan $\frac{x-9}{x}$)."
- **Langkah 1.2** — pop-up: "Substitusi $x=3$: pembilang $1-\cos0=0$ dan penyebut $\left(3-3\right)\sin0=0$. Bentuknya $\frac00$."

*Baris papan Bagian 1 (ditambahkan M1, 20 Okt 2026, disetujui pemilik materi; disusun dari teks soal dan pop-up 1.2; kunci tidak berubah):*

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| k1 | **Diketahui** (label) | — | — | — |
| k2 | $x\to3$ | `@s-x3` | titik limit | — |
| k3 | $1-\cos(6x-18)$ | `@s-pem` | pembilang | — |
| k4 | $\left(x-\frac9x\right)\sin(6x-18)$ | `@s-faktor`, `@s-sin` | penyebut | — |
| k5 | **Ditanya** (label) nilai limit | `@s-tanya` | — | — |
| k6 | $1-\cos0=0$ | — | pembilang di $x=3$ (langkah 1.2) | — |
| k7 | $(3-3)\sin0=0$ | — | penyebut di $x=3$ (langkah 1.2) | — |
| k8 | $\frac00$ | — | bentuk tak tentu, perlu disederhanakan | `navy` |

### Bagian 2 — Menyederhanakan bentuk trigonometri
**Prasyarat konsep:** $1-\cos2\alpha=2\sin^2\alpha$ dan $\sin2\alpha=2\sin\alpha\cos\alpha$. Karena itu $\dfrac{1-\cos2\alpha}{\sin2\alpha}=\dfrac{2\sin^2\alpha}{2\sin\alpha\cos\alpha}=\tan\alpha$.

#### Langkah 2.1 — Memisalkan $u=x-3$
- **Pop-up:** "Misalkan $u=x-3$. Maka $x\to3$ berarti $u\to0$, dan $6x-18=6u$."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| a1 | $u=x-3$ | — | $x\to3\Rightarrow u\to0$ | — |
| a2 | $6x-18=6(x-3)=6u$ | `@s-pem`, `@s-sin` | sudut menjadi $6u$ | `navy` |

#### Langkah 2.2 — Pembilang dan sinus
- **Pop-up:** "Tulis $6u=2(3u)$, lalu pakai identitas sudut ganda."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| b1 | $1-\cos6u=1-\cos2(3u)=2\sin^2 3u$ | — | $1-\cos2\alpha=2\sin^2\alpha$, $\alpha=3u$ | — |
| b2 | $\sin6u=2\sin3u\cos3u$ | — | $\sin2\alpha=2\sin\alpha\cos\alpha$ | — |
| b3 | $\dfrac{1-\cos6u}{\sin6u}=\dfrac{2\sin^23u}{2\sin3u\cos3u}$ | $b1$, $b2$ | — | — |
| b4 | $=\dfrac{\sin3u}{\cos3u}=\tan3u$ | — | $2$ dan satu $\sin3u$ dicoret | `navy` |

- **Pertanyaan cepat** (sebelum b4): "Setelah mencoret, $\dfrac{2\sin^23u}{2\sin3u\cos3u}$ menjadi…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $\tan3u$ | ya | — |
| $\cot3u$ | tidak | Yang tersisa di pembilang adalah $\sin3u$ dan di penyebut $\cos3u$: $\frac{\sin}{\cos}=\tan$. |
| $\sin3u$ | tidak | Penyebut masih menyisakan $\cos3u$, belum hilang. |

### Bagian 3 — Faktor $x-\frac9x$
#### Langkah 3.1 — Memfaktorkan
- **Pop-up:** "Samakan penyebut $x-\frac9x$ lalu faktorkan selisih kuadrat."

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| c1 | $x-\dfrac9x=\dfrac{x^2-9}{x}$ | `@s-faktor` | samakan penyebut | — |
| c2 | $=\dfrac{(x-3)(x+3)}{x}$ | — | $x^2-9=(x-3)(x+3)$ | — |
| c3 | $=\dfrac{u\,(x+3)}{x}$ | $u$←`a1` | $x-3=u$ | `navy` |

#### Langkah 3.2 — Menggabungkan
- **Pop-up** *(ditambahkan M1)*: "Gabungkan kedua hasil: bagian trigonometri menjadi $\tan3u$ dan faktornya memberi $u$ di penyebut."
- **Hasil sebelumnya (pin) Bagian 3** *(ditambahkan M1)*: $u=x-3$ dan $\frac{1-\cos6u}{\sin6u}=\tan3u$ (sumber terbang `u`←pin untuk c3, $\tan3u$←pin untuk d2).

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| d1 | bentuk soal $=\dfrac{1-\cos6u}{\left(x-\frac9x\right)\sin6u}$ | — | — | — |
| d2 | $=\dfrac{\tan3u}{\frac{u(x+3)}{x}}$ | $\tan3u$←`b4`, penyebut←`c3` | — | — |
| d3 | $=\dfrac{\tan3u}{u}\cdot\dfrac{x}{x+3}$ | — | bagi dengan pecahan = kali kebalikan | `navy` |

### Bagian 4 — Menghitung limit
**Prasyarat konsep:** $\lim_{u\to0}\dfrac{\tan au}{u}=a$.

*Pop-up (ditambahkan M1):* Langkah 4.1 (baris e1): "Pakai limit dasar $\lim_{u\to0}\frac{\tan au}{u}=a$ untuk bagian pertama." Langkah 4.2 (baris e2–e3): "Substitusi $x=3$ pada bagian kedua, lalu kalikan kedua hasil." Pin Bagian 4: $\frac{\tan3u}{u}\cdot\frac{x}{x+3}$. Konten opsional langkah 4.2: tabel nilai di sekitar $x=3$ memakai angka *Pemeriksaan hasil* ($x=2{,}999\to\approx1{,}4998$; $x=3{,}001\to\approx1{,}5003$).

| id | Baris | Terbang dari | Keterangan | Kotak |
|----|-------|--------------|------------|-------|
| e1 | $\displaystyle\lim_{u\to0}\dfrac{\tan3u}{u}=3$ | $\tan3u$←`d3` | $\lim\frac{\tan au}{u}=a$ | `navy` |
| e2 | $\displaystyle\lim_{x\to3}\dfrac{x}{x+3}=\dfrac{3}{3+3}=\dfrac12$ | $3$←`@s-x3` | substitusi langsung | `navy` |
| e3 | $\text{limit}=3\cdot\dfrac12=\dfrac32$ | $3$←`e1`, $\frac12$←`e2` | — | `gold` |

- **Pertanyaan cepat** (sebelum e2; *diperbaiki M1 dari "sebelum e3", karena yang ditanyakan adalah isi baris e2; kunci tidak berubah*): "Hasil $\displaystyle\lim_{x\to3}\dfrac{x}{x+3}$ adalah…"

| Opsi | Benar? | Petunjuk jika salah |
|------|--------|---------------------|
| $\frac12$ | ya | — |
| $1$ | tidak | $\frac{3}{3+3}=\frac36$, bukan $\frac33$. Penyebutnya $x+3=6$. |
| $0$ | tidak | Penyebut dan pembilang tidak nol di $x=3$ untuk bentuk ini. |

### Bagian 5 — Catatan lengkap
$$\begin{aligned}u&=x-3,\quad6x-18=6u\\\frac{1-\cos6u}{\sin6u}&=\frac{2\sin^23u}{2\sin3u\cos3u}=\tan3u\\x-\frac9x&=\frac{x^2-9}{x}=\frac{u(x+3)}{x}\\\lim&=\lim_{u\to0}\frac{\tan3u}{u}\cdot\lim_{x\to3}\frac{x}{x+3}=3\cdot\frac12=\frac32\end{aligned}$$

### Bagian 6 — Cocokkan dengan pilihan (kartu A–E)
| Kartu | Pilihan | Stempel | Alasan / jebakan |
|-------|---------|---------|------------------|
| A | $-\frac32$ | SALAH | Tanda seharusnya positif. |
| B | $-\frac23$ | SALAH | Kebalikan dan tanda keliru. |
| C | $0$ | SALAH | Limit bukan nol karena $\tan3u\sim3u$ dan $u$ saling menghilang. |
| D | $\frac23$ | SALAH | Jebakan: kebalikan hasil. |
| E | $\frac32$ | BENAR | $3\cdot\frac12$. |

*Ditambahkan M1 (pop-up per kartu dan pertanyaan akhir, disusun dari kolom alasan di atas):* kartu dibuka satu per satu dengan pop-up "Pilihan A, $-\frac32$: tandanya seharusnya positif. Salah." … "Pilihan E, $\frac32=3\cdot\frac12$, sama dengan hasil kita (benar). Pilih jawabannya di papan tulis." Pertanyaan akhir `B.ask` berhuruf A–E; petunjuk tiap pilihan salah = kolom alasan; rumus singkat kartu: $-\tfrac32\ne\tfrac32$, $-\tfrac23\ne\tfrac32$, $0\ne\tfrac32$, $\tfrac23\ne\tfrac32$, $3\cdot\tfrac12=\tfrac32$.

### Bagian 7 — Selesai
- **Segel:** **E**
- **Pop-up:** "Identitas sudut ganda mengubah bagian trigonometri menjadi $\tan3u$, faktor $x-\frac9x$ memberi $u$ di penyebut, dan hasilnya $3\cdot\frac12=\frac32$."

### Pemeriksaan hasil
Tabel numerik: $x=3{,}001$ memberi $\approx1{,}5003$, dan $x=2{,}999$ memberi $\approx1{,}4998$; keduanya mengapit $1{,}5$ ✓.
Metode kedua: pakai $\lim\frac{1-\cos au}{u^2}=\frac{a^2}2$ dan $\lim\frac{\sin au}{u}=a$. Pembilang $\approx18u^2$, $\sin6u\approx6u$, sehingga bentuknya $\frac{18u^2}{\frac{u(x+3)}{x}\cdot6u}=\frac{3x}{x+3}\to\frac{9}{6}=\frac32$ ✓.

### Kesalahan umum / poin perhatian
- Membaca $x-\frac9x$ sebagai $\frac{x-9}{x}$.
- Lupa faktor $\frac{x}{x+3}$ sehingga jawabannya 3 (bukan $\frac32$).
- Menyederhanakan $6x-18$ tanpa menyadari $6x-18=6(x-3)$.

---

## Audit akhir

### Tabel verifikasi 25 soal

| No | Materi utama | Jawaban/kunci yang diverifikasi | Status | Catatan singkat |
|----|--------------|---------------------------------|--------|-----------------|
| 1 | Invers matriks 2×2 (diagonal) | **E** — $\begin{pmatrix}\frac12&0\\0&2\end{pmatrix}$ | VALID | Diperiksa $FF^{-1}=I$ |
| 2 | SPL dengan matriks (invers) | **E** — $(x,y)=(3,4)$ | VALID | Opsi A–D hasil perkaliannya tidak konsisten/salah (dihitung satu per satu) |
| 3 | Perkalian matriks (kebutuhan bahan) | **C** — $k=40$ ml | VALID | Anomali sumber diterima: total jahe dan gula merah pada naskah asli tidak cocok; jawaban dari baris air konsisten |
| 4 | Aritmetika/matriks (pendapatan hotel) | **(3) dan (5)** benar | VALID | A=7,35; B=6,4; C=7,55 juta; total 21,3 juta |
| 5 | Akar suku banyak / titik potong sumbu X | **(−2,0), (3,0)** | VALID | $f=(x-3)(x+2)(x+4)$ |
| 6 | Teorema sisa suku banyak | **C** — $a+b=-1$ | VALID | $a=2$, $b=-3$; diperiksa dua metode |
| 7 | Operasi pada fungsi polinom | **D** — $0{,}5T^3+4T^2+200T$ | VALID | Diuji di $T=10$ |
| 8 | Nilai fungsi polinom dan kecukupan modal | 30: Salah; 40: Benar; 60: Benar | VALID | $f(30)=20000$, $f(40)=f(60)=2000$ (juta); tafsir Benar = Mungkin dicatat |
| 9 | Fungsi eksponensial (interpretasi) | (1) Salah; (2) Benar; (3) Salah | VALID | Berlipat 2 tiap 4 tahun; $K(20)=128$ ribu |
| 10 | Eksponensial dari grafik | **Danau C, D, E** | VALID | $L=10\cdot7^t$, ambang $49\cdot343=16807$; fungsi diturunkan dari grafik (lihat catatan) |
| 11 | Fungsi kosinus dari grafik | **E** — 15 jam | VALID | $y=12{,}3+2\cos\frac{\pi t}6$; $t=3,9,15$ |
| 12 | Panjang vektor 3D | **B** — $m=-4$ atau $3$ | VALID | $m^2+m-12=0$; keduanya berpanjang 9 |
| 13 | Vektor pada trapesium sama kaki | **C** — 9 | VALID | $\vec{BC}=(-1,4)$; $a^2$ sama untuk $a=\pm1$ |
| 14 | Jarak 3D dan kecepatan konstan | **BC, CD, DE** | VALID | $v=3\sqrt{11}/13$ km/menit; $CE\approx3{,}83$ km |
| 15 | Lingkaran sepusat | **A** | VALID | Pusat $(-3,4)$ dari grafik; $r=3$ |
| 16 | Titik singgung ⟂ garis | **(3,−1), (1,−5)** | VALID | Jari-jari sejajar $f$, $r=\sqrt5$ |
| 17 | Luas bangun datar (cat) | **Setengah hitam + biru; setengah hitam + merah; biru + merah** | VALID | Redaksi pilihan multitafsir dan gambar tidak persis berskala mengikuti naskah asli; tafsir dicatat, kunci stabil |
| 18 | Luas segmen, keliling, panjang kerangka | 2×A: Tidak Pas; B: Tidak Pas; C: Pas | VALID | $r=40$ cm, kerangka $\approx6{,}37$ m |
| 19 | Refleksi + translasi pada garis | **E** — 6 | VALID | $a=2$, $b=-2$ |
| 20 | Translasi + dilatasi lingkaran | **C** — $T=(3,-1)$, $k=2$ | VALID | Diperiksa maju |
| 21 | Rotasi garis | **(2,0), (5,2)** | VALID | $l:\ 2x-3y=4$; diperiksa tiga metode |
| 22 | Limit rasional (substitusi) | **A** — $-\frac7{67}$ | VALID | Penyebut di $x=3$ adalah $-67$ |
| 23 | Limit di tak hingga | **B** — Rp3.000.000 | VALID | $9/3=3$ juta |
| 24 | Limit trigonometri pada geometri | Hanya **(5)** | VALID | $\frac XY=\frac2\pi\cot\frac\theta2$ |
| 25 | Limit trigonometri | **E** — $\frac32$ | VALID | Diperiksa numerik di sekitar $x=3$ |

### Isu sumber yang tercatat

**A. Anomali sumber yang sudah dikonfirmasi pemilik materi (naskah asli memang demikian; kunci tidak berubah)**

1. **Soal 3 — data total jahe dan gula merah.** Sumber: `docs/soal25.md`. Dengan matriks kebutuhan dan pesanan yang tertulis, jumlah jahe $=20\cdot100+10\cdot120+12\cdot80=4160$ (soal menulis 4.360) dan jumlah gula merah $=15\cdot100+25\cdot120+8\cdot80=5140$ (soal menulis 4.960). Jawaban yang diminta ($k$) hanya bergantung pada baris air ($9800+80k=13000\Rightarrow k=40$), jadi kunci **C** tetap. **Dikonfirmasi:** naskah asli memang demikian. Yang semula diperiksa: angka matriks, pesanan, atau total jahe dan gula merah pada naskah asli. Selama belum dipastikan, tampilan interaktif sebaiknya tidak menunjukkan total jahe/GM sebagai "hasil perhitungan".
2. **Soal 17 — redaksi pilihan jawaban dan skala gambar.** Sumber: `docs/soal25.md` dan `docs/rambu_rumah_makan.png`.
   - Pilihan "Setengah hitam dan biru" dst. tidak menyatakan operasi perbandingannya. Dipakai tafsir "jumlah kedua kuantitas dibandingkan dengan cat hitam" (hanya tafsir ini yang memberi jawaban benar). **Dikonfirmasi:** naskah asli memang demikian. Yang semula diperiksa: redaksi pilihan pada naskah asli (apakah ada kata "gabungan", "jumlah", atau pembanding lain).
   - Ukuran pada gambar (40, 14, 10 cm) tidak sepenuhnya berskala; lebar lengan salib terukur sekitar 7,5 cm (dihitung 8 cm dari $10+w+10=28$). Pada rentang lebar lengan 7–8 cm kunci tidak berubah. **Dikonfirmasi:** naskah asli memang demikian. Yang semula diperiksa: ukuran lebar lengan salib pada naskah asli.

**B. Catatan interpretasi (kunci tidak berubah; tercatat agar transparan)**

| Soal | Catatan |
|------|---------|
| 2 | Opsi B, C, D menuliskan hasil perkalian yang tidak sama dengan hasil hitung sebenarnya. Hanya E yang matriks, vektor, dan hasilnya konsisten. |
| 4 | Butir (4) "selisih pendapatan yang sama besar" diuji dengan selisih antarpasangan dan selisih berurutan; keduanya salah. |
| 8 | Baris tabel dibaca sebagai "mungkin menjual *n* unit" (Benar = Mungkin). Kunci sama untuk tafsir $f(x)=2000$ maupun $f(x)\le2000$. |
| 10 | Fungsi pertumbuhan tidak tertulis di gambar; $L(t)=10\cdot7^t$ diturunkan dari tiga titik grafik dengan rasio tetap 7. Dianggap semua danau tumbuh dengan faktor 7 per tahun. |
| 13 | Tidak ada gambar; $a^2$ sama untuk $a=1$ dan $a=-1$, alasan geometris memilih $a=-1$ (trapesium, bukan jajargenjang). |
| 18 | Kerangka diasumsikan: lingkaran + 4 sisi persegi + 2 diagonal (sesuai gambar kerangka). Potongan logam boleh dipotong dan disambung; hanya total panjang yang dibandingkan. |
| 24 | Pernyataan (2) dibaca sebagai "nilai limit tidak bergantung pada besarnya $a$"; limit sebenarnya bergantung pada $a$ sehingga salah. |

**C. Pemeriksaan bahwa pembahasan dan sumber sejalan:** untuk soal yang memiliki gambar (2, 4, 10, 11, 14, 15, 16, 17, 18, 24), semua angka yang dibaca dari gambar sudah dicocokkan dengan teks pada `soal25.md` dan dicatat pada bagian "Data dibaca dari gambar" pada tiap soal. Tidak ditemukan perbedaan antara gambar dan teks selain yang tercantum pada bagian A.

