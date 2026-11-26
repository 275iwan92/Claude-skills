---
name: devlib2-parity
description: Mengganti DevLib v1 dengan DevLib 2 dengan tampilan IDENTIK (keputusan Jo: ganti, bukan ubah desain). Berisi alat ukur piksel dan DOM, urutan teknik (skin, ukur DOM, bawa mesin v1 ke devlib2), prosedur pindah cabang Jays pilot, dan jebakan yang sudah ketemu. Muat sebelum menyentuh migrasi DevLib 2 aplikasi mana pun.
---

# Paritas DevLib 2 terhadap DevLib v1

> BATAS ARSITEKTUR (Jo 2026-11-26, mengalahkan isi skill ini bila bertentangan): "POLA KERJA BOOTSTRAP, TIDAK BERGANTUNG PADA APPS. LALU COMPONENT DIBUAT UNTUK DI TURUNKAN ATAU DI WARISKAN KE APP." Paritas/kemiripan dengan v1 adalah pekerjaan LAPISAN TEMA DI REPO APP (override token, subclass komponen, CSS @layer app), BUKAN isi inti DevLib2. Jangan menambah CSS parity, skin v1, nama app, atau ukuran lulus dari screenshot app ke src/resources/assets/dist/catalog DevLib2. Cek: node ~/.claude/tools/devlib2-independence.js --list (target 0).

Keputusan Jo (23 Nov 2026): migrasi dinyatakan berhasil hanya bila tampilan SAMA dengan v1 yang live (render, bukan sekadar fungsi). "Mengganti DevLib jadi DevLib2 BUKAN mengubah design." Jangan klaim identik tanpa angka dari `compare.py` (0,000%).

## Keadaan dan tempat kerja (per 24 Nov 2026)
- Jays laptop = cermin Biznet (`main` `28fbe6c`, DevLib 1). Pekerjaan pilot ada di cabang `pilot-devlib2-20` (repo jays) dan `pilot-jays-20` (repo devlib2, worktree `C:\Users\iwanp\Packages\devlib2-pilot`). Biznet TIDAK disentuh; deploy `main` AdminKU/Jays dengan DevLib 2 ke server membuat login 500 (server belum punya paket devlib2).
- Salinan DevLib 1 persis dari server: `C:\Users\iwanp\Packages\devlib-jays-biznet` (sumber salinan runtime v1).
- Alat ukur ada di `ops/visual/` cabang pilot Jays: `shot.mjs` (Chrome tanpa layar lewat CDP, PNG penuh-halaman, waktu/acak/animasi dibekukan), `compare.py` (selisih piksel, ambang 8/255), `pair.py` (v1 | v2 berdampingan), `rows.py`, `measure.mjs` + `cmpdom.py` (posisi/gaya tiap teks, isian, tombol; cocokkan per teks/nama). Derau terukur 0: dua tangkapan baseline identik.
- 20 halaman pilot (`pages.json`): Barang, Pemasok, Departemen, Penerima, Satuan, Kategori, Lokasi (daftar + buat), Perusahaan, dan 5 halaman lihat. Baseline PNG dan JSON DOM v1 diambil dari `main` (scratchpad sesi hilang: ambil ulang).

## Urutan teknik (dari murah ke mahal)
1. **Skin v1 opt-in** di devlib2: `src/css/components/zz-skin-v1.css`, aktif lewat `html[data-dl2-skin="v1"]` (layout-v2 memasangnya). Nilai disalin dari `devlib.css` v1 (token, tombol, badge, form master, kotak isian, tab). Tanpa atribut tidak ada yang berubah (aman untuk tmerp/mockuptm).
2. **Ukur DOM per elemen**: `measure.mjs` di v1 (`main`) dan v2 (pilot), lalu `cmpdom.py dom-v1 dom-v2 <halaman>`; sesuaikan dx/dy/lebar/tinggi dan gaya. Cara ini jauh lebih cepat daripada menebak dari piksel (departemen buat: 78% -> 0,15% dalam beberapa putaran).
3. **Bawa mesin v1 ke devlib2 di balik mode** untuk komponen yang DOM-nya beda (grid): `x-dl2::grid-v1` + `x-dl2::v1-assets`, bundel `dist/devlib2-v1grid.js|css` dari `python scripts/build-v1grid.py <folder-devlib1>` (core.js + grid.js v1 + subset CSS). Hasil: 5 daftar master identik piksel. Syarat: kamus v1 (`Devlib2\Lang::extend(\Devlib\Lang::all())`, kunci g_*, `window.DL_LANG/DL_NUM/DL_DICT`), token `--dl-font-scale:1;--dl-density:1`, aturan `placeholder` spesifik (menang atas reset Tailwind).
3b. **Legacy v1 utuh di devlib2** (langkah yang membuat 20/20 identik): `python scripts/build-v1-legacy.py <folder-devlib1>` menyalin seluruh DevLib 1 ke `legacy/v1` dengan namespace `Devlib2\V1`, komponen `<x-dl1::...>`, view `devlib2v1::`, aset `/_devlib2v1/devlib.css|js`; `Devlib2\DevlibServiceProvider::register()` mendaftarkan `Devlib2\V1\DevlibServiceProvider` bila ada; composer devlib2 memetakan `Devlib2\V1\` ke `legacy/v1/src/` (aplikasi Jays menambah psr-4 `vendor/jo/devlib2/legacy/v1/src/`). Di aplikasi: `layout-v1` (layout main dengan `\Devlib\` -> `\Devlib2\V1\`, `x-dl::` -> `x-dl1::`), view halaman = versi main dengan `x-dl1::`, kamus (`Indonesian` loop Lang::class termasuk `Devlib2\V1\Lang`) dan lookup (`App\Support\DualLookup` mendaftar ke `Devlib\Lookup` dan `Devlib2\V1\Lookup`). Sisa kerja untuk mencabut jo/devlib: ganti semua `Devlib\...` di kode aplikasi (controller, Support) ke `Devlib2\V1\...`, pindahkan route lookup/ping ke versi `devlib2v1.*`, lalu uji ulang. Catatan: ini membawa kode v1 lama ke dalam paket devlib2 (bukan komponen v2 asli); keputusan Jo diperlukan sebelum menjadikannya jalur produksi.
4. Label tombol/status form master: isi `window.Devlib2.masterForm.labels` dan `masterParity.statusLabels` SEBELUM `@devlib2` (inline di layout); devlib2 menggabungkannya saat bundel dimuat.

## Jebakan yang sudah terbukti
- Skrip ekstraksi CSS: buang komentar `/* */` dulu, kalau tidak koma di komentar memecah selektor dan aturan berikutnya jatuh diam-diam (kotak identitas hilang).
- `x-dl2::form` kini membungkus slot default sebagai tab `data`; jangan menambah `<x-dl2::form-tab key="data">` (tab ganda). Tab Riwayat: `:tabs="['data'=>'Data','history'=>'Riwayat']"` + `<x-slot:history>` (prop `:log` kosong dibuang `array_filter`).
- Komponen `field.*` dotted hanya ada di devlib2 terbaru; jangan mengunci ke komit lama. View migrasi `1fb7c7c` adalah titik awal, bukan hasil teruji.
- Margin negatif `.dl2-row` (gutter Bootstrap) menggeser isian 8 px; kartu form v1 tanpa border dan tinggi `100vh - 28px`.
- Tailwind preflight di `app-v2.css`/`app.css` ikut menentukan line-height 1.5; jangan menimpa line-height body.
- `vendor/jo/devlib2` hilang/berpindah setelah `composer install`: pasang ulang junction ke `Packages\devlib2-pilot` dan cek `ReflectionClass('Devlib2\DevlibServiceProvider')->getFileName()`.

## Prosedur pindah Jays antara main dan pilot (PowerShell untuk php/composer)
Ke pilot: `git checkout pilot-devlib2-20`; `composer install --no-interaction --no-scripts`; hapus `bootstrap\cache\packages.php` dan `services.php`; `composer dump-autoload --no-scripts`; `php artisan package:discover`; TERAKHIR hapus lalu buat ulang junction `vendor\jo\devlib2` -> `C:\Users\iwanp\Packages\devlib2-pilot` (composer install DAN dump-autoload mengembalikannya ke Herd\devlib2); `npm run build`; `php artisan optimize:clear`; buat akun `pilot` lokal (administrator, sandi acak di scratchpad, HANYA lokal).
Kembali ke main (WAJIB setelah selesai, laptop harus tetap cermin Biznet): `git checkout main`; `composer install --no-scripts`; hapus dua berkas cache bootstrap itu; `composer dump-autoload --no-scripts`; pulihkan `public/build` dari server (`ssh ... "cd /var/www/jays && tar -cf - public/build" | tar -xf - -C Herd/jays`); hapus akun `pilot`; cek `http://jays.test/login` = 200 dan `git status` tanpa perubahan terlacak. Jangan `migrate:fresh`. Jangan deploy ke Biznet tanpa persetujuan Jo.

## Jalur migrasi Jays (24 Nov 2026 malam, cabang `migrasi-devlib2-legacy`, BELUM di-deploy)
Cabang dari `main`: composer `jo/devlib2` (path `../../Packages/devlib2-pilot`, cabang `pilot-jays-20`) menggantikan `jo/devlib`; skrip `C:\...\scratchpad\migrasi.py` (hilang; logikanya: `Devlib\`->`Devlib2\V1\`, `x-dl::`->`x-dl1::`, `devlib::`->`devlib2v1::`, rute `devlib.*`->`devlib2v1.*`, kecuali teks panduan `resources/views/help/*`) diterapkan ke app, routes, config, database, bootstrap, tests, resources/views; `app.css` `@source` ke `vendor/jo/devlib2/legacy/v1/...`. Bukti: 68 halaman GET identik piksel (5 laporan hanya beda jam cetak), tes 699/701 sama dengan main. Catatan lengkap di `docs/MIGRASI-DEVLIB2-LEGACY.md` cabang itu. Yang tersisa sebelum deploy: paket devlib2+legacy di server, preflight, cadangan, 164 rute x 4 peran, persetujuan Jo.

## Membandingkan laptop dengan Biznet layar demi layar (tanpa login Biznet)
1. Render halaman Biznet di server sebagai Administrator lewat kernel (`render2.php <appRoot> <pagesJson> <outDir> <host>`: Request::create dengan cookie `ui=desktop` dan HTTPS; jalankan `sudo -u www-data php`), ambil HTML dengan `ssh ... "cd /tmp && sudo tar -cf - dir" | tar -xf -` (jangan campur keluaran teks dengan aliran tar), lalu hapus berkas sementara dan baris `sessions` ip 127.0.0.1 yang ikut terbuat.
2. `biznet-proxy.mjs <htmlDir> <port> <origin>` (env PAGES=daftar halaman) menyajikan HTML itu pada alamat aslinya dan meneruskan aset (/build, /_devlib*) ke Biznet; semua URL Biznet ditulis ulang ke proksi agar same-origin (font tanpa CORS).
3. `BASE=http://127.0.0.1:<port> NOLOGIN=1 node shot-b.mjs <out>` memotret halaman Biznet; laptop dipotret dengan `shot.mjs`; `MASK=1070,835,1280,900 python compare.py <biznet> <laptop> <diff>` (bilah "Edit with Herd" hanya ada di laptop).
4. Selisih yang wajar: nama pembuat (akun `pilot` vs Administrator), jumlah pengguna (akun pilot), jam cetak server, urutan baris berkunci sama di dasbor Stok. Hapus akun pilot sesudahnya.
Hasil 24 Nov malam (laptop cabang migrasi vs Biznet, 68 halaman): 57 identik; 11 beda hanya karena akun pilot, jam cetak, dan urutan seri.

## Jebakan baru (migrasi seluruh aplikasi)
- Daftar halaman uji piksel harus bebas halaman pengubah keadaan: `/ukur` dan `/m/*` menyetel cookie tampilan HP sehingga semua halaman sesudahnya tampil mode HP (baseline main salah, 2887 px vs 954 px).
- Setelah `composer install` di `main` Jays, junction `vendor/jo/devlib` menunjuk `Packages\devlib-pure` (bukan versi server). Urutan benar: `composer install`, `composer dump-autoload --no-scripts`, hapus junction `devlib` lalu buat ulang ke `C:\Users\iwanp\Packages\devlib-jays-biznet`, hapus cache bootstrap, `package:discover`. Pulihkan `public/build` dari server.
- Pembanding adil: baseline main dan versi migrasi dibangun dengan Tailwind `@source` setara dan diambil dengan urutan halaman sama.

- Daftar piksel berurutan juga harus membuang `/` (shell Beranda) dan `/stok` (Beranda Stok): keduanya menyetel mode HP. Tanda: tinggi 2887 px, body `dl-on-phone`. Potret `/` terpisah.
- CSS aplikasi bergantung `@source '../../storage/framework/views/*.php'`: jalankan `php artisan view:cache` SEBELUM `npm run build` (setelah `optimize:clear` view hilang dan ±150 kelas Tailwind ikut hilang, mis. gap-*, border-*).
- Cara tercepat membuktikan identik: render semua GET di Biznet lewat `renderbiz.php` (kernel, transaksi + rollBack, tanpa sisa) dan di laptop lewat `renderall.php`, lalu diff HTML ternormalisasi (token CSRF, id acak dlf-*, id foto, nama server, jam); hash `devlib.css|js` harus sama; baru piksel.

## Hasil 23 Nov 2026 malam: DevLib2 legacy (laptop) vs Biznet
HTML 98 URL x 5 kasus: 458/490 identik, sisa hanya data (id, urutan seri, jumlah pengguna). devlib.css|js byte-identik. Piksel 84 halaman admin desktop: 73 identik 0,000%, 11 beda hanya nama pembuat (Pilot Uji), jam, versi (0.341 vs 0.344), status PR 5 dan lebar kolom daftar pengguna (data).

## Perbandingan adil (24 Nov 2026): masukan harus sama, baru bandingkan
Akun pilot, jam server, versi dan isi DB membuat selisih palsu. Cara benar: DB laptop = dump Biznet (impor sebagai jays_usr, tanpa DROP DATABASE; root MySQL lokal bersandi), render kernel di dua sisi dengan `renderfair.php` (Carbon::setTestNow, binding devlib.version dibekukan, pengguna peran pertama, transaksi rollBack; Biznet: scp ke /tmp, `sudo -u www-data php`, ambil lewat tar, hapus), sajikan HTML lewat DUA proksi (`biznet-proxy.mjs`, laptop pakai asal http://jays.test, ganti https->http di HTML) lalu `shot-b.mjs` + `compare.py` tanpa MASK. Hasil: admin desktop 86/89, HP 87/89; sisa = bar "Edit with Herd" (hanya laptop), IP server di baris jaringan, tangkapan Biznet jarak jauh kadang gagal inisialisasi JS (ulang), urutan seri /stok (kini diberi pemutus id). Derau tangkapan sisi yang sama = 0.

## Bila Jo bilang "beda" padahal alat ukur 0%: periksa peramban Jo, bukan kode
Kasus 24 Nov: login laptop tampil kartu HP di Chrome Jo, padahal peramban kosong identik. Penyebab: cookie `ui` (HttpOnly) = phone di Chrome Jo (body `sstock-hp dl-on-phone` pada lebar 1536), dan `public/hot` (mode dev Vite) membuat CSS dimuat dari [::1]:5173 (logo panel login 404). Alat: ekstensi Chrome (`mcp__claude-in-chrome__*`): buka tab baru, `document.body.className`, lebar/DPR, daftar CSS; perbaiki cookie dengan `POST /ui` (ui=desktop, token dari `/login/token`). Cek dulu `public/hot` (ganti nama ke `hot.off`) dan cookie `ui` sebelum menyimpulkan kode berbeda. Cookie yang diisi lewat `document.cookie` tidak berlaku (Laravel mengenkripsi).

## Hasil terakhir (acuan)
24 Nov 2026 malam: **20 dari 20 halaman pilot identik 0,000%** dengan v1 memakai legacy v1 di devlib2 (langkah 3b). Hasil sebelumnya tanpa legacy (hanya skin + grid-v1):
Identik 0,000%: daftar Barang, Pemasok, Departemen, Satuan, Kategori. Hampir: form buat Departemen/Kategori 0,15%, Lokasi 0,39%, daftar Lokasi 0,068%. Masih jauh: halaman lihat 4-32%, Perusahaan 16,5%, Penerima 7,4%, form Barang/Satuan 6,2%, Pemasok 10,2% (penghambat: field telepon, lookup wilayah, spinner angka, select).
