# Template Pembahasan Soal Interaktif (Single-File HTML)

> Dokumen ini merangkum **semua teknologi, konsep, dan ide penyajian** dari media "Saluran Irigasi — Optimasi dengan Turunan".
> Tujuannya: dipakai ulang untuk membahas **soal lain**, baik yang butuh 3D, gambar 2D, animasi hitungan, maupun yang cukup teks + papan tulis.
>
> - File jadi (contoh lengkap): `index.html`
> - Salinan template: `template/template-pembahasan.html`
> - Dokumen ini: `pembahasan.md`

---

## Daftar isi

1. [Filosofi: cara guru menjelaskan, cara siswa menonton](#1-filosofi)
2. [Alur standar pembahasan (kerangka bagian)](#2-alur-standar)
3. [Tata letak satu layar](#3-tata-letak-satu-layar)
4. [Sistem desain: warna bermakna, huruf, ukuran](#4-sistem-desain)
5. [Teknologi & CDN](#5-teknologi--cdn)
6. [Arsitektur kode (peta modul)](#6-arsitektur-kode)
7. [Mesin langkah (step engine)](#7-mesin-langkah)
8. [Papan tulis: baris demi baris, angka terbang tepat sasaran](#8-papan-tulis)
9. [Mesin 3D (Three.js)](#9-mesin-3d)
10. [Visual 2D: SVG, grafik, kartu](#10-visual-2d)
11. [Interaksi: soal cepat, slider, grafik opsional](#11-interaksi)
12. [Audio sintetis (Web Audio API)](#12-audio)
13. [Catatan lengkap (cetak/unduh)](#13-catatan-lengkap)
14. [Landscape only, layar pendek, layar penuh](#14-landscape-only)
15. [Playbook: memilih visual sesuai jenis soal](#15-playbook)
16. [Gaya bahasa & penulisan](#16-gaya-bahasa)
17. [Checklist kualitas & pengujian](#17-checklist)
18. [Pelajaran dari bug yang pernah terjadi](#18-pelajaran-bug)
19. [Prompt siap pakai untuk soal baru](#19-prompt-siap-pakai)

---

## 1. Filosofi

### POV guru: runtut seperti di papan tulis
Guru menjelaskan dengan urutan yang jelas dan setiap langkah **ditulis di bawah langkah sebelumnya**:

```
L = p × l
1200 = 100 × l
l = 1200 / 100
l = 12 m
```

Aturan yang dipegang:
- **Satu baris = satu langkah aljabar.** Jangan melompat dua operasi sekaligus.
- Setiap baris boleh punya **keterangan kecil** di kanan: "kedua ruas dibagi 100", "2t pindah ruas → jadi −2t".
- Hasil penting diberi **kotak** (biru = hasil antara, emas = jawaban/optimum).
- Gambar (sketsa/3D) muncul **sebelum** rumus, lalu rumus "mengambil" angka dari gambar.
- Ikuti cara guru apa adanya, kecuali jika notasinya berpotensi membingungkan. Contoh di soal ini: memakai `f(t)`, bukan `f(x)`, karena x sudah dipakai untuk lebar.

### POV siswa: tidak perlu menoleh kiri-kanan
Masukan siswa yang menjadi aturan desain:
- **Satu layar penuh.** Visual utama memenuhi layar. Teks tampil sebagai **pop-up singkat** (maks. 2 kalimat), bukan kolom bacaan panjang.
- **Teks muncul di tempat yang sesuai.** Label menempel di objek 3D ("Luas = 1.200 m²", "garis lipat", "air").
- **Animasi hitungan harus runtut**, bukan angka beterbangan acak. Angka hanya terbang dari **sumber yang benar** ke **slot yang benar**, satu per satu.
- Bisa **maju-mundur dan mengulang** setiap langkah (tombol ↻ di papan tulis).
- Interaksi tetap di layar yang sama (pertanyaan muncul di papan tulis).

### Prinsip umum
- Membimbing **dari nol**: pahami soal → gambar → rumus → hitung → simpulkan.
- **Tidak menambah hal yang membingungkan.** Konten ekstra (misal grafik pembuktian) dibuat **opsional**: "Mau lihat buktinya lewat grafik? [Ya] [Tidak, lanjut saja]".
- Hindari bahasa game ("misi", "level", "skor"). Pakai bahasa sehari-hari yang formal-santai.

---

## 2. Alur standar

Kerangka bagian yang terbukti efektif. Sesuaikan isinya per soal; bagian bertanda *(opsional)* boleh dihapus.

| # | Bagian | Isi | Visual |
|---|--------|-----|--------|
| 0 | **Lobi** | Judul besar, ringkasan soal 1 kalimat, 3 fakta kunci, tombol Mulai, toggle musik & SFX | Ilustrasi SVG yang "tergambar sendiri" |
| 1 | **Pahami soal** | Soal asli → stabilo kata kunci → papan: *Diketahui / Ditanya* (angka terbang dari stabilo) | Kertas soal |
| 2–6 | **Langkah penyelesaian** | Tiap bagian = satu ide matematika (mis. cari lebar, susun kendala, fungsi, turunan, hasil) | 3D / SVG / grafik + papan tulis |
| * | *(opsional)* **Coba sendiri** | Slider/eksplorasi, siswa menebak sebelum dibuktikan | Lab 3D / SVG interaktif |
| * | *(opsional)* **Bukti grafik** | Modal grafik dengan garis singgung bergerak | Grafik SVG |
| 7 | **Catatan lengkap** | Semua langkah awal–akhir + sketsa, bisa dicetak/disimpan PDF/diunduh | Lembar catatan |
| 8 | **Analisis pernyataan / pilihan** | Kartu dibalik satu per satu (stempel BENAR/SALAH + jebakan), lalu pilih jawaban | Kartu flip + papan |
| 9 | **Selesai** | Ringkasan, segel jawaban, tombol ulang/catatan, pop-up **SELESAI** | 3D akhir berputar pelan |

Untuk soal pilihan ganda biasa (bukan analisis pernyataan), Bagian 8 diganti "Cocokkan dengan pilihan" (kartu A–E).

---

## 3. Tata letak satu layar

```
┌──────────────────────────────────────────────────────────────┐
│ Header: logo · BAGIAN 04/09 Volume air · musik · SFX · ⛶ · ☰ │
├──────────────────────────────────────────────────────────────┤
│ ┌Pop-up teks (cap)──────┐              ┌Papan tulis (board)─┐ │
│ │BAGIAN 4 · VOLUME AIR  │              │Volume air        ↻ │ │
│ │Ganti x dengan 12−2t…  │              │Hasil sebelumnya:   │ │
│ └───────────────────────┘              │ (x = 12 − 2t)      │ │
│                                        │V = p × l × t       │ │
│       [ objek 3D / SVG / kartu ]       │V = 100 · x · t     │ │
│     label menempel di objek ("air")    │...                 │ │
│                                        │[Coba jawab: A B C] │ │
│                                        └────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ ← Kembali   BAGIAN 4 · LANGKAH 2 DARI 3  ▬▬▬    Lanjut →     │
└──────────────────────────────────────────────────────────────┘
```

- **Scene** (`#scene`) memenuhi area tengah, latar *blueprint* biru tua.
- **Pop-up teks** (`#cap`) di kiri atas.
- **Papan tulis** (`#board`) di kanan; lebar `clamp(W×0.33, 270–480px)`.
- **Area bebas (free rect)** = scene dikurangi papan dan tinggi pop-up. Objek 3D/SVG dipusatkan di area ini.
  - 3D memakai `camera.setViewOffset()` supaya objek tampil di tengah area bebas, bukan di tengah layar.
  - Panel 2D memakai kelas `.inFree` (CSS var `--ft`, `--fr`, `--fb`).
- Fungsi `layout()` menghitung semuanya dan dipanggil saat resize dan setiap ganti langkah (tinggi pop-up berbeda-beda).
- Mode **sempit** (jendela desktop tegak, `W < 900 && W/H < 1.25`): papan pindah ke bawah (kelas `.scene.narrow`).

---

## 4. Sistem desain

### Warna yang punya arti (konsisten di semua soal)

| Token | Hex | Makna |
|-------|-----|-------|
| `--paper` | `#FFFFFF` | latar kertas, kartu, papan tulis |
| `--navy` | `#0E2A5C` | struktur, teks utama, tombol utama |
| `--navy-3` | `#2A5BB0` | variabel/bagian "dasar", hasil antara (kotak biru) |
| `--bp` | `#0A1830` | latar panel blueprint |
| `--red` | `#C8102E` | **garis lipat, kendala, kesalahan, jebakan** |
| `--gold-2` | `#E2B43C` | **hanya untuk yang terbaik**: optimum, jawaban benar, hasil akhir |

> Aturan emas: **emas tidak boleh dipakai sebagai hiasan.** Siswa belajar bahwa emas berarti "ini jawabannya".

Pewarnaan variabel bisa dipetakan per soal, misalnya *t* = merah (dinding) dan *x* = biru (dasar). Pakai warna yang sama di 3D, label, papan, dan catatan.

### Huruf
- **Display:** *Archivo* dengan sumbu lebar (`font-stretch:118–125%`, berat 800–900) untuk judul.
- **Body:** *Plus Jakarta Sans* (karya desainer Indonesia), untuk teks.
- **Data/label:** *JetBrains Mono* untuk eyebrow, angka, label teknis.
- **Matematika:** KaTeX. Variabel di label 3D memakai `font-family: KaTeX_Math` agar serasi.

### Detail khas "gambar teknik"
- Grid blueprint dua lapis (80px + 16px).
- Tanda potong (crop marks) emas di sudut panel (`.crop::before`).
- Blok judul ala gambar teknik di header: `BAGIAN 04/09 Judul`.
- Keterangan gambar `GBR. 00 …` dengan huruf mono.

---

## 5. Teknologi & CDN

Semua dalam **satu file HTML** (CSS + JS internal). Pustaka eksternal:

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,300..900&family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..600&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>
```

| Kebutuhan | Teknologi |
|-----------|-----------|
| Rumus | KaTeX (`katex.renderToString`, `renderMathInElement` untuk teks `$…$`) |
| 3D | Three.js r128 + OrbitControls (global `THREE`) |
| Diagram 2D & grafik | SVG murni (dibuat via JS helper `sv()`) |
| Animasi DOM | Web Animations API (`el.animate`) + transisi CSS |
| Animasi nilai | Tween kecil buatan sendiri (`tween()`, easing `io/out/smooth`) |
| Suara | Web Audio API (semua disintesis, tanpa file audio) |
| Perayaan | canvas-confetti (warna tema) |
| Ikon | Lucide (`<i data-lucide="…">` + `lucide.createIcons()`) |

Jika Three.js gagal dimuat (offline), `C3.attach()` menampilkan pesan ramah. Bagian non-3D tetap berjalan.

---

## 6. Arsitektur kode

Urutan blok dalam `<script>`:

| Blok | Isi |
|------|-----|
| UTIL | `$`, `$$`, `fmt` (format angka id-ID), `sleep`, `clamp`, `math`, `tex`, `icons`, `sv`, `raf2` |
| Tween + loop | `Ease`, `tween({from,to,dur,ease,tag,update})`, `killTween(tag)`, `LOOPS` (callback per frame) |
| `SND` | audio sintetis (lihat §12) |
| `burst`, `toast`, `flyTo` | confetti, notifikasi, terbang elemen antar-kontainer |
| `C3` | mesin 3D (lihat §9) |
| `B` | papan tulis (lihat §8) |
| Data papan | `PIN` (hasil sebelumnya), `LK`, `LA`, `LM`, … (baris per bagian), `LT` (teks label 3D) |
| `CH`, `STEPS`, `step()` | daftar bagian & langkah (lihat §7) |
| `scene3d(o)` | helper menyetel seluruh state 3D untuk satu langkah |
| Kartu, Lab, Grafik `G6`, Catatan | modul per fitur |
| Navigasi | `chrome()`, `setCap()`, `setScene()`, `go()`, `next()`, `prev()`, `layout()` |
| Tombol & keyboard | musik, SFX, layar penuh, menu, ←/→, F, M, Esc |
| INIT | `B.init()`, `buildNotes()`, `LOOPS.add(C3.frame)`, `go(0)`, `requestAnimationFrame(raf)` |

---

## 7. Mesin langkah

### Mendefinisikan bagian & langkah

```js
const CH=[ {t:'Lobi',d:'Halaman awal'}, {t:'Pahami soal',d:'Diketahui & ditanya'}, /* … */ ];

step(2,{                                   // nomor bagian
  cap:'Teks pop-up singkat, boleh $LaTeX$.',
  scene:'3d',                              // '3d' | 'soal' | 'cards' | 'notes'
  lab:false,                               // true → tampilkan slider
  actions:[{label:'Ya, tampilkan grafik',icon:'trending-up',cls:'gold',fn:openGraph}],
  async run(c){
    scene3d({...});                        // setel 3D
    B.chapter('Judul papan',[PIN.l],c);    // judul + "hasil sebelumnya"
    await B.to(LA,4,1,c);                  // tampilkan baris 0..3, animasikan mulai indeks 1
  }
});
STEPS.unshift({ch:0});                     // langkah 0 = lobi
```

### Konteks `c` yang diterima `run(c)`

| Field | Arti |
|-------|------|
| `run` | token unik. Cek `live(c.run)` setelah setiap `await`; jika false, berhenti |
| `dir` | `1` maju, `-1` mundur. Mundur = tampilkan keadaan akhir **tanpa animasi** |
| `seq` | datang dari langkah tepat sebelumnya, jadi semua yang belum tampil dianimasikan |
| `replay` | tombol ↻ ditekan, sehingga animasi langkah ini diulang |
| `entered` | baru masuk bagian ini |

### Aturan penting
- **Setiap langkah harus idempoten**: dari langkah mana pun siswa datang, `run(c)` harus membawa layar ke keadaan langkah itu (3D, label, papan, kartu).
- **Jangan percaya animasi lama.** `go()` menaikkan `S.run`, membatalkan pertanyaan (`B.cancelAsk()`), menutup modal, lalu `B.flush()` menyelesaikan seketika semua token yang masih terbang.
- Pertanyaan (`B.ask`) hanya muncul jika jawabannya belum pernah ditulis (`!B.has('m3') && c.dir>0`). Saat siswa mundur, pertanyaan tidak diulang.
- Saat pertanyaan terbuka, tombol "Lanjut" berubah menjadi **"Lewati soal"**.

---

## 8. Papan tulis

### Format satu baris

```js
const T=(k,t,c,src)=>({k,t,c,src});   // token KaTeX
const O=(k,t)=>({k,t,c:'op'});        // operator (=, +, −, ×) dengan jarak lebih lebar
const H=(k,h,c,src)=>({k,h,c,src});   // token HTML biasa (teks)
const F=(n,d)=>({frac:[n,d]});         // pecahan: n dan d = array token

{id:'a3',
 toks:[ T('a3a','l','red','a2e'), O('a3b','='), F([T('a3c','1200','','a2a')],[T('a3d','100','','a2c')]) ],
 note:'kedua ruas dibagi 100',        // keterangan kecil di kanan
 box:'navy'}                          // 'navy' = hasil antara, 'gold' = hasil akhir
```

- `k`: **kunci unik** di papan (prefiks per baris, mis. `a3a`).
- `c`: kelas warna/gaya: `red`, `blue`, `gold`, `u` (satuan), `muted`, `lbl` (label kecil), `sp`.
- `src`: **dari mana token ini terbang**:
  - `'a2e'` = token lain di papan (baris sebelumnya atau *pin*).
  - `'@luas'` = elemen mana pun di halaman dengan `data-src="luas"`, misalnya label 3D `Luas = <b data-src="luas">1.200</b> m²` atau stabilo di soal.
  - Kosong = token "ditulis" (efek kapur: muncul dari kiri ke kanan).

### Cara menulis satu baris (`B.write`)
1. Buat baris baru di bawah, semua token disembunyikan, gulir papan ke bawah.
2. Untuk **setiap token dari kiri ke kanan**:
   - Jika `src` ada dan terlihat: klon token terbang dari sumber ke slotnya (lengkung halus, sumber berpendar emas, durasi 480–860 ms sesuai jarak), lalu slot muncul dengan efek "pop".
   - Jika tidak: token ditulis dengan efek kapur (`clip-path`), disertai suara kapur.
3. Keterangan muncul, kotak hasil menyala (emas berbunyi *chime*).
4. Baris sebelumnya meredup (`.past`), hasil berkotak tetap terang.

### Fungsi papan

| Fungsi | Kegunaan |
|--------|----------|
| `B.chapter(title,pins,c)` | ganti judul & bersihkan papan jika bagian berbeda; pasang *pins* |
| `B.to(list,n,from,c)` | tampilkan baris `0..n-1`; animasikan baris ≥ `from` (atau semua yang belum tampil jika `c.seq`) |
| `B.has(id)` | apakah baris sudah tampil |
| `B.ask(q,opts,c,o)` | pertanyaan pilihan di kaki papan (lihat §11) |
| `B.flush()` | selesaikan semua animasi seketika |
| `B.foot.innerHTML` | area kaki papan (dipakai juga untuk HUD lab) |

### "Hasil sebelumnya" (pins)
Hasil berkotak dari bagian sebelumnya dibawa sebagai chip di atas papan (`PIN.l`, `PIN.x`, …). Chip ini menjadi **sumber terbang** untuk bagian baru, sehingga siswa melihat dari mana angka berasal walaupun papan sudah dibersihkan.

### Pola penulisan langkah aljabar (contoh siap tiru)

| Operasi | Baris |
|---------|-------|
| Substitusi | `V = 100 · x · t` → `V = 100 · (12−2t) · t` (token `(12−2t)` terbang dari pin `x = 12−2t`) |
| Pindah ruas | `12 = 2t + x` → `12 − 2t = x`, keterangan "2t pindah ruas → jadi −2t" |
| Bagi kedua ruas | `−400t = −1200` → `t = −1200 / −400` (pembilang & penyebut terbang dari baris atas) |
| Hitung | `t = 3 m` ditulis baru, kotak emas, keterangan "negatif : negatif = positif" |
| Turunan | baris aturan `(a tⁿ)' = n·a·tⁿ⁻¹` (redup), lalu `f'(t) = 1200 − 400t` dengan keterangan per suku |

---

## 9. Mesin 3D

### Kapan memakai 3D
Pakai 3D bila **bentuk ruang membantu memahami variabel**: bangun ruang (balok, tabung, kerucut, prisma), jaring-jaring yang dilipat, wadah yang diisi, benda berputar, volume benda putar, jarak titik–bidang. Untuk soal yang murni aljabar/fungsi, cukup SVG 2D.

### Pola yang dipakai di soal ini
- **Pelat yang dilipat**: alas + dua dinding sebagai `Group` berengsel (pivot di garis lipat). Sudut lipat dianimasikan 0 → 90° (kiri lalu kanan, jeda 0,32 s). Kamera berpindah dari atas ke isometrik.
- **Garis lipat merah putus-putus** (`LineDashedMaterial`) memudar saat dilipat.
- **Ukuran (dimensi)** = `LineSegments` dengan tanda ujung, mengikuti objek tiap frame (dihitung lewat `localToWorld`).
- **Label HTML** diproyeksikan dari titik 3D (`vector.project(camera)`), sehingga tetap tajam dan bisa jadi sumber angka terbang (`data-src`).
- **Air**: kotak transparan + permukaan bergelombang (vertex dianimasikan), naik dengan tween.
- **Air bereaksi pada putaran** (hiburan): kecepatan sudut kamera menggerakkan pegas teredam. Permukaan miring, lalu berayun dan tenang dalam ±1,5 detik. Jika melewati bibir dinding, keluar tetesan (`THREE.Points`) yang jatuh oleh gravitasi. **Volume tidak berubah.**
- Material beton: tekstur kanvas prosedural (bintik agregat), garis tepi biru tua.
- Bayangan lembut (`PCFSoftShadowMap`), grid emas tipis di lantai, kabut biru.

### API `C3`

| Fungsi | Kegunaan |
|--------|----------|
| `attach(el)` / `detach()` | pindahkan kanvas ke host & mulai/berhenti render |
| `setFree({l,t,r,b})` | area bebas → view offset kamera |
| `mode('fold' \| 'lab')` | `lab` = ukuran mengikuti slider (`setT`) dengan interpolasi halus |
| `dims(t,dur)` | ubah ukuran (mis. ke t = 3) dengan animasi |
| `fold(v,dur)` | lipat (1) / buka (0) |
| `water(v,dur)`, `dash(v)`, `hl(alas,dinding)` | isi air, garis lipat, sorot bagian |
| `goView('flat' \| 'iso',dur)` | kamera bergerak melengkung ke pose; pose dihitung agar objek pas di area bebas |
| `orbit(on)`, `auto(on)` | izinkan seret/putar, putar otomatis |
| `show({p,x,tl,tr,w12,area,tip})`, `text(k,html)`, `gold([...])` | label & dimensi |
| `tip(html,'dash' \| 'water' \| 'top')` | balon kuning menunjuk bagian objek |
| `labelEl(k)` | elemen label (target/sumber angka terbang) |

### Helper per langkah

```js
scene3d({ fold:1, view:'iso', orbit:true, water:1, t:3,
  show:{p:1,x:1,tl:1}, text:{p:LT.p, x:LT.x6, tl:LT.t3}, gold:['p','x','tl'],
  tip:'ukuran terbaik', tipAt:'top', viewDur:900 });
```

### Mengadaptasi ke bangun lain (ide)

| Soal | Objek 3D | Animasi kunci |
|------|----------|---------------|
| Kotak tanpa tutup dari karton yang dipotong pojoknya | Persegi + 4 sayap berengsel | Pojok persegi x dipotong (merah) → 4 sisi dilipat → slider x |
| Tabung luas permukaan tetap | Silinder `CylinderGeometry` | Jaring: 2 lingkaran + persegi panjang yang menggulung menjadi selimut |
| Kerucut dari juring | Juring lingkaran | Juring menggulung jadi kerucut, slider sudut |
| Kolam/tandon diisi (laju berubah) | Wadah transparan | Air naik dengan laju konstan, grafik tinggi vs waktu tergambar bersamaan |
| Bayangan/tangga (laju berkaitan) | Batang + titik cahaya | Ujung tangga bergeser, segitiga siku-siku dengan label dinamis |
| Jarak titik ke bidang (dimensi tiga) | Kubus kerangka | Titik, garis tegak lurus, segitiga bantu menyala bertahap |
| Volume benda putar | Kurva 2D | Kurva diputar 360° membentuk benda (`LatheGeometry`) |

---

## 10. Visual 2D

### Kertas soal (`.p-soal`)
- Gaya kertas ujian dengan garis margin merah.
- **Stabilo** `.hl` (merah = diketahui, biru = bagian/syarat, emas = ditanya) dengan animasi `background-size`.
- Setiap stabilo punya `data-src`, sehingga angkanya terbang ke papan "Diketahui".

### Diagram SVG (untuk soal tanpa 3D)
Versi awal media ini punya diagram **penampang** (kelas `Section`; kodenya tidak ikut di template final, tetapi polanya mudah dibuat ulang): bentuk U dengan "tali" sepanjang 12 m yang dibagi t | x | t, air bergelombang, label dimensi, dan tulisan "terlalu dangkal/dalam" saat ukurannya ekstrem. Cara membuatnya:
- Gambar dengan `sv('path',{…},svg)`, perbarui atribut tiap frame lewat `LOOPS`.
- Garis yang "tergambar" memakai `pathLength="1"` + `stroke-dasharray:1; stroke-dashoffset:1 → 0`.
- **Filter glow pada garis horizontal** wajib `filterUnits="userSpaceOnUse"` (lihat §18).

### Grafik fungsi (`G6`, modal opsional)
- Sumbu, grid, kurva, daerah "naik" (biru) dan "turun" (merah), garis putus emas di puncak.
- **Titik + garis singgung + pendaki** bergerak sepanjang kurva. Garis singgung menjadi **emas dan datar** saat `|f'(t)| < 10`.
- Kotak status berubah otomatis: "Mendaki → f′(t) positif", "Di puncak → f′(t) = 0", "Menurun → f′(t) negatif".
- Animasi otomatis (naik → puncak → turun → kembali ke puncak) + slider "Geser titik".

### Kartu analisis (`.p-cards`)
- Grid 2×2. Depan: nomor + pernyataan. Belakang: stempel BENAR (emas) / SALAH (merah) yang "dihentak" (`slam`), rumus singkat, alasan/jebakan.
- Dibuka satu per satu per langkah. Bunyi *stamp*, lalu *chime* atau *buzz*.
- Papan menuliskan ringkasan per kartu: `(2) x = 6 ≠ 4 ×`.

---

## 11. Interaksi

### Pertanyaan cepat di papan (`B.ask`)
```js
const ok=await B.ask('Dari $12 = 2t + x$, maka $x = \\ldots$',[
  {tex:'x = 12 + 2t', hint:'Saat $2t$ pindah ruas, tandanya berubah.'},
  {tex:'x = 12 - 2t', ok:true},
  {tex:'x = 12 - t',  hint:'Dindingnya ada dua, jadi yang dikurangkan $2t$.'}
],c,{letters:false,col:false,win:'Kita tulis langkahnya.'});
if(!ok||!live(c.run)) return;
```
- Salah: bunyi *buzz*, tombol bergetar, **petunjuk ramah** khusus untuk kesalahan tersebut.
- Benar: *chime* + confetti kecil, lalu baris jawaban ditulis di papan.
- "Lihat jawabannya saja" tersedia untuk siswa yang buntu.
- Petunjuk ditulis berdasarkan **jenis kesalahan yang umum** (tanda pindah ruas, lupa faktor 2, pembagian terbalik, lupa mengalikan panjang).

### Lab / eksplorasi
- Slider di bawah area bebas. Objek mengikuti dengan interpolasi (`st.t += (target − t)·dt·12`).
- HUD di kaki papan: nilai variabel, volume besar, bar, penanda rekor.
- Saat siswa menemukan optimum: *chime*, confetti, toast "Setelah ini kita buktikan dengan turunan".

### Konten opsional
Tawarkan dengan tombol di pop-up, bukan dipaksakan:
`Mau lihat buktinya lewat grafik?` → **[Ya, tampilkan grafik]** **[Tidak, lanjut saja]**.

---

## 12. Audio

Semua suara disintesis (`SND`), tidak ada file audio. Aktif setelah interaksi pertama (kebijakan autoplay browser).

| Fungsi | Bunyi | Dipakai saat |
|--------|-------|--------------|
| `click()` | pop pendek | tombol |
| `tick()` | ketukan halus | slider, token mendarat |
| `chalk()` | desis kapur | token ditulis |
| `whoosh()` | desir | token/kartu terbang |
| `correct()` | arpeggio kristal C-E-G-C | jawaban benar |
| `wrong()` | dengung ganda lembut | jawaban salah |
| `chime()` | lonceng | hasil berkotak emas, puncak ditemukan |
| `stamp()` | hentakan | stempel kartu |
| `fanfare()` | fanfare + akor | bagian/jawaban akhir, pop-up SELESAI |
| `bgmStart()/bgmStop()` | pad ambient Cmaj7–Am7–Fmaj7–G + denting pentatonik, reverb sintetis | musik latar (toggle) |

Volume BGM rendah; audio di-*suspend* saat tab disembunyikan.

---

## 13. Catatan lengkap

- Lembar putih berisi **semua langkah** (`\begin{aligned}…\end{aligned}` per bagian) + **sketsa SVG** (pelat dengan garis lipat, saluran dengan label, saluran ukuran akhir berwarna emas) + tabel analisis + kotak jawaban.
- **Cetak / simpan PDF**: `window.print()`. CSS `@media print` menyembunyikan aplikasi dan hanya mencetak `#printRoot` (salinan catatan).
- **Unduh catatan**: membuat file `.html` mandiri (KaTeX CSS + gaya catatan dari `<style id="notesCss">`).
- Gaya catatan dipisah di `<style id="notesCss">` supaya bisa dipakai ulang di file unduhan.

---

## 14. Landscape only

- **Overlay putar HP** (`.rotate-ov`) aktif lewat CSS `@media (orientation:portrait) and (max-width:1024px)`: animasi HP berputar 90° dengan panah emas dan air di layar HP ikut miring. Aplikasi disembunyikan.
- Tombol **"Layar penuh & mendatar"** dan tombol **Mulai** (di perangkat sentuh) memanggil `lockLandscape()`: `requestFullscreen()` → `screen.orientation.lock('landscape')`. Berfungsi di Android Chrome; di iOS Safari siswa memutar sendiri.
- **Layar pendek** (`@media (max-height:520px)`, HP mendatar): header/footer/pop-up/papan/label diringkas, rumus tidak boleh terpotong (`white-space:nowrap`), keterangan turun ke bawah bila perlu, sisi belakang kartu hanya menampilkan rumus.
- Ukuran yang diuji: HP 780×360, 812×375, laptop 1280×720, 1366×768, 1440×860.

---

## 15. Playbook

Gunakan tabel ini untuk memilih visual dan animasi sesuai jenis soal. Tidak semua soal butuh 3D; yang penting **gambar dulu, lalu rumus mengambil angka dari gambar**.

### 15.1 Pemilihan per jenis soal

| Jenis soal | Visual utama | Animasi khas | Interaksi |
|------------|--------------|--------------|-----------|
| **Optimasi bangun ruang** (kotak, tabung, saluran) | 3D | jaring-jaring dilipat → isi air/volume → ukuran optimum berubah emas | slider ukuran, tebak optimum |
| **Optimasi bangun datar** (kebun, pagar, jendela) | SVG denah | pagar tergambar, panjang total tetap, persegi panjang berubah bentuk | slider, luas live |
| **Fungsi & grafik** (titik stasioner, naik/turun, cekung) | Grafik SVG | titik + garis singgung berjalan, daerah naik/turun diwarnai | geser titik |
| **Turunan aturan rantai/hasil kali** | Papan tulis saja | bagian fungsi "dibungkus" kotak warna, turunan dalam & luar terbang ke posisi | pilih langkah benar |
| **Laju yang berkaitan** | 2D/3D sederhana | benda bergerak + segitiga siku dengan label berubah | slider waktu |
| **Gerak (s, v, a)** | Lintasan + grafik | benda bergerak sinkron dengan titik di grafik s(t), v(t) | play/pause waktu |
| **Persamaan garis singgung** | Grafik | garis secan mendekati singgung (h → 0) | slider h |
| **Limit** | Grafik + tabel | titik mendekati dari kiri/kanan, tabel nilai terisi | geser x |
| **Integral luas/volume** | Grafik → 3D | persegi panjang Riemann bertambah, lalu diputar (`LatheGeometry`) | slider n |
| **Trigonometri** | Lingkaran satuan SVG | sudut berputar, proyeksi sin/cos tergambar | geser sudut |
| **Dimensi tiga (jarak/sudut)** | 3D kerangka | garis bantu & segitiga menyala bertahap, label panjang | putar objek |
| **Statistika** | Diagram batang/titik SVG | data jatuh ke tempat, rata-rata sebagai garis keseimbangan | tambah/ubah data |
| **Peluang** | Kartu/dadu/koin SVG/3D | ruang sampel tersusun, kejadian disorot | simulasi acak |
| **Barisan & deret** | Balok/batang bertumbuh | suku muncul satu per satu, pola diberi warna | geser n |
| **Matriks/SPL** | Papan tulis + grid | baris/kolom disorot, elemen terbang saat dikalikan | pilih operasi |
| **Cerita aritmetika/persentase** | Ilustrasi SVG sederhana | angka dari cerita terbang ke papan | tebak cepat |

### 15.2 Resep animasi hitungan (berlaku untuk semua soal)
1. **Ambil angka dari sumbernya.** Semua angka di baris pertama terbang dari soal/gambar (`@data-src`).
2. **Satu operasi per baris** dengan keterangan kecil.
3. **Token yang sama berpindah** (mis. `x` terbang dari baris atas), sementara **hasil hitungan baru ditulis**.
4. **Kotak hasil**: biru untuk hasil antara, emas untuk jawaban.
5. **Bawa hasil ke bagian berikutnya** sebagai *pin*, lalu terbangkan lagi dari situ.
6. **Hubungkan kembali ke gambar.** Setelah hasil didapat, ubah gambar/3D ke ukuran itu dan beri label emas, atau terbangkan angka dari papan ke label (`flyTo`).

### 15.3 Resep animasi gambar
- **Morph, jangan ganti.** Objek tetap ada dan berubah bentuk (pelat → saluran, bar → kurva), tidak menghilang lalu diganti.
- **Gambar tergambar sendiri** (`stroke-dashoffset`) untuk ilustrasi pembuka.
- **Sorot bagian** dengan emisif/warna (alas biru, dinding merah) saat suku rumusnya ditulis.
- **Balon tip** menunjuk bagian ("garis lipat", "air", "ukuran terbaik").

---

## 16. Gaya bahasa

- Bahasa Indonesia **formal-santai**, sapaan **"kamu" / "kita"**.
- Pop-up maksimal **2 kalimat**; satu ide per langkah.
- Tanpa istilah game ("misi", "level", "skor", "boss").
- Jelaskan istilah saat pertama muncul: "**kendala** (syarat yang selalu berlaku)", "**garis singgung**".
- Petunjuk saat salah: mulai dengan apa yang perlu diperhatikan, bukan "Salah!". Contoh: "Hati-hati tanda. Saat 2t pindah ruas…".
- Analogi singkat bila membantu: "bukit volume", "di puncak jalannya datar".
- Sorot **jebakan** di analisis jawaban: dari mana angka pengecoh berasal (contoh: 2.400 = 100·6·4 → kendala tidak terpenuhi).
- Format angka Indonesia: `1.200`, `2,5` (pakai `fmt()`); di rumus KaTeX tulis `1200` tanpa pemisah.

---

## 17. Checklist

**Konten**
- [ ] Kunci jawaban dan setiap baris aljabar sudah dicek ulang.
- [ ] Notasi tidak bentrok (huruf variabel tidak dipakai ganda).
- [ ] Setiap pertanyaan punya petunjuk untuk tiap pilihan salah.
- [ ] Catatan lengkap sama persis dengan papan tulis.

**Tampilan**
- [ ] Laptop (1280×720, 1366×768) dan HP mendatar (≈780×360): tidak ada yang terpotong atau meluber (`scrollWidth ≤ innerWidth`).
- [ ] HP tegak: overlay putar HP muncul.
- [ ] Emas hanya untuk hasil terbaik.
- [ ] Label 3D tidak saling menumpuk (sembunyikan label yang berlebihan).

**Perilaku**
- [ ] Jalankan semua langkah otomatis dengan `go(i)` + `next()` dan pastikan tidak ada error konsol.
- [ ] Tekan "Lanjut" cepat-cepat saat papan masih menulis: tidak boleh ada baris ganda atau token tersembunyi.
- [ ] Mundur (←) ke setiap langkah: keadaan benar tanpa animasi.
- [ ] Tombol ↻ mengulang animasi langkah.
- [ ] Musik/SFX bisa dimatikan; `prefers-reduced-motion` dihormati.

**Cara uji cepat di konsol**
```js
for (let i=1;i<STEPS.length;i++){ go(i,1); await new Promise(r=>setTimeout(r,1300)); }
```

---

## 18. Pelajaran bug

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| Baris papan tertulis dua kali | loop animasi lama terus menulis setelah siswa pindah langkah | cek `live(c.run)` **sebelum setiap baris**, `B.flush()` di awal `B.to` |
| Chip/angka tidak muncul saat klik cepat | penanda "sedang terbang" milik run lama | simpan run di elemen (`dataset.run`), callback lama berhenti |
| Garis singgung emas tidak tampil | filter SVG pada garis horizontal punya *bounding box* tinggi 0 | `filterUnits="userSpaceOnUse"` + x/y/width/height eksplisit |
| Baris tabel berantakan | nama kelas `.top` bentrok dengan header | nama kelas spesifik (`tr.best`) |
| Bayangan abu-abu di tepi kanan | bayangan panel menu yang tersembunyi bocor | `visibility:hidden` pada drawer saat tertutup |
| Layout HP melebar | header terlalu lebar mendorong grid | `grid-template-columns:minmax(0,1fr)`, header ringkas |
| Objek 3D kecil/terpotong | kamera dipusatkan ke layar penuh, bukan area bebas | `setViewOffset` + pose dihitung dari ukuran area bebas |
| Pelat terlalu putih | exposure & warna terlalu terang | `toneMappingExposure .92`, warna beton `#c4cad2` |
| Script rusak setelah edit | PowerShell menafsirkan `$(...)` di string pengganti | edit file dengan tool Edit, atau string kutip tunggal di PowerShell |
| Animasi tampak patah saat diuji | pane browser tersembunyi dibatasi ±1 fps | ukur fps dulu; uji visual saat pane tampil |

---

## 19. Prompt siap pakai

Salin, lalu isi bagian dalam kurung siku:

```text
Gunakan template pembahasan di folder "irigasi-air" (template/template-pembahasan.html dan pembahasan.md)
untuk membuat index.html baru (single-file) yang membahas soal berikut:

[TEMPEL SOAL LENGKAP + PILIHAN JAWABAN + KUNCI]

Alur penyelesaian versi guru (ikuti urutan ini, satu baris = satu langkah):
[TULIS LANGKAH-LANGKAH SEPERTI DI PAPAN TULIS]

Ketentuan:
- Satu layar, landscape only (overlay putar HP saat tegak), pop-up teks singkat, papan tulis di kanan.
- Visual: [3D / SVG 2D / grafik / papan saja], pilih sesuai playbook §15.
- Animasi hitungan runtut: angka terbang hanya dari sumber yang tepat (gambar/soal/baris sebelumnya/pin).
- Interaksi: [daftar pertanyaan cepat + petunjuk untuk kesalahan umum], [slider/eksplorasi bila cocok].
- Konten tambahan yang opsional (mis. grafik) ditawarkan dengan tombol Ya/Tidak.
- Akhiri dengan: Catatan lengkap (cetak/unduh) → analisis jawaban (kartu) → pop-up SELESAI.
- Warna bermakna: merah = kendala/salah, emas = hasil terbaik saja.
- Bahasa Indonesia formal-santai ("kamu/kita"), tanpa istilah game.
- Uji semua langkah (maju, mundur, klik cepat, HP mendatar, laptop) sebelum selesai.
```

---

*Dibuat sebagai dokumentasi template media "Saluran Irigasi — Optimasi dengan Turunan", Kelas 12 Kalkulus.*
