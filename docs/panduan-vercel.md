# Panduan menghubungkan Paham TKA ke Vercel (M0, tugas 0.8)

> Belum ada yang dihubungkan atau di-*push*. Setiap langkah bertanda **[izin]** dilakukan hanya setelah Pak Penta menyetujuinya secara eksplisit.

## Yang sudah siap di repositori
- `app/vercel.json`: perintah build `npm run build`, keluaran `dist`, `npm ci`, header CSP, `nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, `X-Frame-Options: DENY`, cache `no-cache` untuk `index.html`/`sw.js`, `immutable` untuk `assets/`.
- `app/.nvmrc` = 24 (Node 24 LTS).
- Router berbasis hash, jadi tidak perlu aturan *rewrite*.

## Langkah Pak Penta (sekali saja)
1. **Akun GitHub** (gratis) di github.com, bila belum punya.
2. **Akun Vercel** (gratis, paket Hobby) di vercel.com → *Continue with GitHub*.
3. **Repositori GitHub baru** bernama `paham-tka`, pilih **Private** (disarankan) atau Public. Jangan centang README/.gitignore (repo lokal sudah punya).

## Langkah yang saya kerjakan setelah diizinkan
4. **[izin]** Menambahkan remote dan *push* cabang `main`:
   ```bash
   git remote add origin https://github.com/<akun>/paham-tka.git
   git push -u origin main
   ```
   Saat itu Git meminta Pak Penta masuk ke GitHub di jendela peramban (saya tidak mengetik kata sandi).
5. **[izin]** Di dasbor Vercel: *Add New → Project → Import* `paham-tka`, lalu isi:
   - **Root Directory:** `app`
   - **Framework Preset:** Other
   - **Build Command:** `npm run build` · **Output Directory:** `dist` · **Install Command:** `npm ci`
   - **Node.js Version** (Settings → General): 24.x
   - **Project Name:** `paham-tka` → tautan `https://paham-tka.vercel.app` (bila nama sudah dipakai orang lain, Vercel menambahkan akhiran; nama tidak boleh mengesankan situs resmi pemerintah, §14.11).
6. Setiap *push* ke cabang selain `main` menghasilkan **preview deploy** (tautan tinjauan). *Push* ke `main` = produksi.

## Uji di perangkat (setelah preview aktif)
1. Buka tautan preview di **HP Android** (Chrome), **iPhone** (Safari), dan **tablet** dengan internet menyala.
2. Tunggu lencana **Siap offline** di kanan atas (atau buka Pengaturan → *Periksa mode offline*).
3. Pasang di layar utama: Android → tombol **Pasang** / menu ⋮ → *Instal aplikasi*; iPhone → **Bagikan → Tambahkan ke Layar Utama**.
4. Aktifkan **mode pesawat**, buka Paham TKA dari layar utama: beranda, Tentang, Pengaturan, dan detail soal harus terbuka.
5. Putar ke potret: layar "Putar HP-mu" harus muncul.
6. Catat hasil dan tipe perangkat di `docs/perangkat-uji.md`.
