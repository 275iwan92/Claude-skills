# Catatan pemahaman ACCURATE 5 (untuk modul accounting tmerp)

Dasar: layar yang benar-benar tampil di ACCURATE 5 Enterprise, database contoh PT ABZ, periode 10/2026 (modul Pabrikasi aktif saat pengambilan layar Pabrikasi; tidak saya ubah sendiri). Tidak ada transaksi yang dibuat, jadi perilaku nyata (validasi, jurnal otomatis, perhitungan) TIDAK diuji; yang dicatat di sini hanya apa yang terlihat di layar.

## 1. Kerangka aplikasi
- Menu atas: Berkas, Persiapan, Daftar, Aktifitas, Laporan, Jendela, Bantuan. Panel kiri "Penjelajah" memuat 11 modul: Buku Besar, Kas Bank, Persediaan, Penjualan, Pembelian, Aset Tetap, Daftar, RMA, Proyek, Pabrikasi, e-Faktur.
- Tiap modul membuka halaman alur: ikon dokumen dihubungkan panah menurut urutan kerja (mis. Penawaran > Pesanan > Pengiriman > Faktur > Penerimaan). Ikon yang abu-abu = fitur belum diaktifkan di Preferensi (Proyek, Pabrikasi, Gudang).
- Semua layar berupa tab (MDI). Menu Jendela punya Tutup Semua. Layar daftar (list) berisi filter kiri (Cari, tipe, Non Aktif Ya/Tidak/Semua) dan tombol Baru, Ubah, Hapus, Perbarui, Print, Impor dari File.
- Menu Aktifitas = membuat transaksi baru. Menu Daftar = melihat daftar (master data dan histori transaksi). Pola ini menjaga pemisahan "input" dan "lihat".

## 2. Pola dokumen transaksi (Penawaran, Pesanan, Pengiriman, Faktur, Retur, Penerimaan; versi Pembelian sama)
- Kepala: pihak (kode + nama, dua kolom, kuning = wajib), alamat tagih dan kirim, kanan atas kotak merah-kuning: Nomor (bawaan 1000, bisa diubah bila Preferensi mengizinkan) dan Tanggal; lalu PO No., Ship Date, FOB, Terms, Ship Via.
- Tengah: tab "Barang" (kadang tambahan "Uang Muka", "Beban", "Catatan"), grid baris: Item, Deskripsi, Qty, Harga, Disc %, Pajak, Jumlah, SN; Pengiriman hanya Item, Deskripsi, Qty, SN.
- Kaki: Deskripsi, Sub Total, Diskon (% dan nilai), Freight/Ongkos kirim, Total. Pesanan punya Akun DP (uang muka) dan ringkasan uang muka.
- Bawah: Simpan & Baru, Simpan & Tutup, Batal, kadang Cetak/Bayar. Atas: panah maju/mundur dokumen, Hapus, Salin Transaksi, Transaksi berulang.
- Rantai dokumen: tombol "Pilih Pesanan / Pilih Pengiriman / Requisition" menarik isi dokumen hulu; toolbar punya aksi ke dokumen hilir (Pesanan Penjualan > Kirim Pesanan, Faktur > Terima Bayaran, Penerimaan Barang > Buat Faktur, Pesanan Pembelian > Terima Barang).
- Status "Ditutup" (centang) pada Penawaran, Pesanan, Permintaan dan per baris, serta kolom Terproses / Qty Ordered / Qty Received: melacak sisa dokumen hulu.
- Setiap dokumen punya "Rancangan" (pilihan tata letak cetak) dan "Ke Layar" (pratinjau/cetak).

## 3. Kas dan Jurnal
- Pembayaran/Penerimaan lain: "Paid From / Deposit To" (akun kas/bank), Voucher No., Cheque No., Tanggal, Memo, Payee, Amount (+ terbilang "Say"), grid Akun / Nama / Jumlah / Memo. Total muncul di kaki.
- Rekonsiliasi Bank: akun bank, saldo rekening koran, kalkulasi saldo, selisih; grid transaksi dengan centang "Beres"; total sesuai dan beredar.
- Bukti Jurnal Umum: Voucher No., Tanggal, centang Multi Mata Uang, Deskripsi, grid Akun / Debit / Kredit / Memo; total Debits dan Credits di kaki.
- Penerimaan Penjualan (Cust. Receipt) dan Pembayaran Pembelian: pilih pihak, bank, nomor/tgl cek, jumlah cek; grid faktur terbuka (Invoice No., Date, Due, Amount, Owing, Payment Amount, Disc, Bayar); ada Alokasi otomatis.

## 4. Persediaan
- Penyesuaian Persediaan: Adj No., Adj Date, Adj Account, Deskripsi, "Value Adjustment"; grid Item, Kuantitas Sekarang (abu), Kuantitas Baru, SN. Selisih dihitung dari dua kuantitas.
- Master Barang (6 tab): Umum (tipe Persediaan / Non Persediaan / Servis, Sub Item, kategori, saldo awal kuantitas + unit + harga/unit + tanggal), Penjualan/Pembelian (harga jual, diskon, kode pajak, pemasok utama, min jumlah reorder), Akun-Akun (8 akun per barang: persediaan, penjualan, retur jual, diskon jual, barang terkirim, HPP, retur beli, belum tertagih; tombol Set sbg Default), Kolom lain, Kontrol Persediaan (nomor seri unik/produksi, tanggal kedaluwarsa), Lain-lain (catatan, gambar, dimensi, berat, lama pengiriman).
- Metode biaya persediaan: Rata-rata (bawaan) atau FIFO; layar wizard menyatakan tidak bisa diganti setelah ada transaksi.
- Set Harga Penjualan: sampai 5 tingkat harga per barang, tanggal efektif, impor, "Sesuaikan" massal.
- Grup Barang (paket/bundle): daftar barang + kuantitas, harga jual, akun penjualan/retur/diskon, opsi cetak di faktur, komisi.

## 5. Master pihak dan data pendukung
- Pelanggan (6 tab): Alamat (nomor, nama, alamat, alamat pajak, kota/prop/kodepos, telepon, kontak, e-mail), Termin (termin pembayaran, batasan piutang: hari jatuh tempo dan jumlah, mata uang, saldo awal + tanggal, pesan, cetak statement), Penjualan (pajak 1 dan 2, NPWP, NIK, tipe pelanggan, tingkat harga, default diskon), Kontak (grid), Catatan, Kolom Tambahan.
- Pemasok (5 tab) serupa: Termin, mata uang, saldo awal, pajak (NPWP, No. PKP).
- Pendukung: Mata Uang (nama, nilai tukar, negara, simbol), Kode Pajak (nama, % nilai, kode, akun pajak penjualan dan pembelian), Syarat Pembayaran (diskon jika bayar dalam n hari, jatuh tempo, COD), Jasa Pengiriman, Tipe Pelanggan, Kategori Barang, Departemen (sub dept, saldo awal, anggaran), Penjual (kontak + komisi), Proyek (General/Contractor; tanggal, % komplit, pelanggan terkait, saldo awal, anggaran), Tipe Aktiva Tetap (terkait tipe pajak, metode dan umur penyusutan pajak), Anggaran Akun (saldo awal + 12 periode per akun per tahun).
- Aktiva Tetap Baru: kode, tipe, tanggal beli dan pakai, kuantitas, tab Umum (umur bulan/tahun, metode penyusutan, akun aktiva, akum penyusutan, beban penyusutan, tidak berwujud, fiskal), Pengeluaran, Catatan.

## 6. Setup, periode, dan kontrol
- Info Perusahaan: nama, alamat, mata uang default; tab Periode Akuntansi (tanggal mulai/tutup buku, tahun fiskal, periode default, peringatan dan pencegahan transaksi di luar jangka periode default), Pajak (NPWP, PKP, KLU), ID Cabang.
- Preferensi (13 bagian): Perusahaan, Fitur (metode biaya, multi gudang, kuantitas < 0, multi unit, pakai penjual, ubah nomor faktur, jejak audit, log perbarui HPP, departemen/proyek, modul pabrikasi), akun default mata uang dan barang, pengingat, aturan Penjualan/Pembelian/Pembiayaan, huruf, Perpajakan, skin.
- Akhir Periode (Proses Akhir Bulan): pilih periode dan tahun, tabel nilai tukar per mata uang, "Proses terakhir"; di sinilah revaluasi kurs dan penutupan bulan.
- Rancangan Formulir: 25 tipe dokumen; tiap dokumen punya pengaturan field per bagian (Kepala, Kepala tambahan, Detil, Kaki, Lain, Info Perusahaan): centang tampil di Layar dan di Cetak, urutan kolom, dan nama/label yang dapat diubah. Desain cetak lanjut lewat "Desain" (FRF).
- Laporan: Daftar Laporan memuat 19 kategori (Keuangan, Buku Besar, Kas & Bank, Piutang, Penjualan, Hutang, Pembelian, Pembiayaan Pesanan, Aktiva Tetap, Persediaan, Pabrikasi, Gudang, Proyek, Departemen, Pemeriksaan, Pajak, Lain, Tersimpan, Terdesain). Tiap laporan memunculkan dialog parameter (periode, kolom dan filter, grup, nomor, blok/total, formasi huruf, analisa) yang bisa disimpan sebagai format. Laporan Keuangan Kustomisasi = perancang baris (judul, baris pembuka, tipe, tingkatan, rentang akun, total).

## 7. Keamanan dan pengguna
- Profil Pengguna: pilih pengguna, nama lengkap, kata kunci + konfirmasi, tingkatan (Admin). Hak akses = matriks per aktivitas dengan enam aksi: Buat, Ubah, Hapus, Laporan, Lihat, Daftar. Dikelompokkan dalam tab modul (Penjualan, Pembelian, Barang/Jasa/Persediaan, Proyek, Buku Besar & Lain-lain, Bank & Aktiva tetap, Laporan Tersimpan, Laporan Terdesain, Transaksi Tersimpan). Ada saklar khusus: cetak faktur, ubah harga jual, komisi, melebihi batas kredit/kuantitas, ubah informasi pelanggan di faktur, cetak ulang, ekspor/impor data.
- Ubah Kata Kunci: kunci lama, kunci baru, konfirmasi. Preferensi: backup otomatis saat keluar dan konfirmasi sebelum keluar. Dialog "Data belum disimpan" (Yes/No/Cancel) saat menutup form yang berubah.

## 8. Pabrikasi, RMA, dan Proyek
- Alur Pabrikasi: Formula Produk (BOM) > Perintah Kerja (Work Order) > Pengeluaran Bahan Baku (Material Release) > Produk dan Bahan Baku Keluaran (Product and Material Result); pendukung: Biaya Produksi (master biaya per jam/tarif) dan Bahan Baku.
- Formula Produk: No Formula, Keterangan, centang Default / Non-Aktif, produk referensi (jumlah produksi, kuantitas minimal), tab Bahan Baku (No Brg, Keterangan, Kuantitas, Standard Cost, Total) dan tab Biaya (No Biaya, Nama, Jam, Biaya Standar, Biaya); "Ambil Biaya Terakhir" menarik harga terbaru.
- Perintah Kerja: WO No., Start Date, Expected Date, Auto Update from Release, Penanggung Jawab, Prod Departemen, Description; grid Pekerjaan (Description, Item No., Quantity, Total Biaya, SO No, Selesai, Ditutup) dan di bawahnya detil per pekerjaan (tab Bahan Baku: kuantitas, standard cost, total, kuantitas terambil; tab Biaya Kerja: cost no, jam, standard cost); tombol Ambil Formula, Pilih Pesanan (dari Sales Order), Release.
- Pengeluaran Bahan Baku: Release No./Date, Work Order No, Job, Description; grid Item, Quantity, Notes, Pekerjaan, Nomor Seri; "Ambil Bhn Baku" menarik dari WO.
- Produk dan Bahan Baku Keluaran: Result No./Date/Time, Work Order, Job; grid Item, Quantity, Unit Cost, Total Cost, Portion, Pekerjaan, Nomor Seri (hasil produksi dan sisa/limbah); "Get Product".
- RMA (klaim pelanggan): RMA No., tanggal, perkiraan selesai, pelanggan, ship to, nomor barang, serial, nomor faktur, deskripsi masalah; Aktifitas Proses Klaim: RMA No., teknisi, aksi (Batal/..), barang pengganti, gudang stok dan gudang scrap, komponen/servis yang dipakai.
- Proyek: Proyek (General/Contractor; tanggal, % komplit, pelanggan), Upah Kerja (master biaya proyek: tipe langsung/tak langsung, default price/cost, akun beban), Pembayaran Upah Proyek (voucher, proyek, bayar dari, grid biaya upah). Survei, Bahan Baku Terpakai, Tagihan, Penyelesaian Proyek masih abu-abu (butuh fitur proyek/departemen diaktifkan).

## 10. Tambahan dari database PT ABC (kosong)
- Kolom Tambahan: form Pelanggan, Pemasok, dan Barang punya tab "Kolom Tambahan"/"Kolom lain" dengan tombol Tambah Kolom: pengguna dapat menambah kolom buatan sendiri tanpa mengubah program. Pola ini setara "field kustom" per master.
- Preferensi, bagian yang baru dilihat: akun default per mata uang (hutang, piutang, uang muka pembelian dan penjualan, diskon penjualan, laba/rugi terealisir dan tak terealisir); akun default barang (persediaan, penjualan, retur jual, diskon jual, barang terkirim, HPP, retur beli, beban, belum tertagih); Pengingat (barang untuk dipesan, kedaluwarsa, piutang/hutang jatuh tempo, transaksi berulang, dengan hari sebelum jatuh tempo); Pembelian (retur dari semua faktur atau yang belum lunas, default biaya penerimaan); Lain-lain (umur faktur dari jatuh tempo atau tanggal faktur, bahasa, format tanggal dan angka); Set Huruf; Pilihan Skin.
- Profil Pengguna: pengguna baru mulai dengan tingkatan "User" dan semua hak kosong; "Salin Hak" menyalin hak dari pengguna lain; ada tab hak untuk Laporan Tersimpan, Laporan Terdesain, dan Transaksi Tersimpan (daftar yang tersedia dan yang diizinkan).
- SPT Masa PPN (e-Faktur): masa pajak (bulan s/d bulan, tahun), nomor SPT, tanggal, tab Perusahaan (nama PKP, NPWP, alamat, usaha, KLU, wajib PPnBM) dan tab Pajak Keluaran (daftar faktur dengan kolom kode jenis penyerahan 01-13); ada ekspor XML e-Faktur.
- Laporan Tersimpan: daftar format laporan yang disimpan pengguna (Nama, Judul, Perubahan Terakhir) dengan Tampilkan, Impor, Ekspor.

## 9. Yang layak dipertimbangkan untuk tmerp (pendapat saya, bukan fakta ACCURATE)
- Pola kepala + grid + kaki + rantai dokumen hulu/hilir sudah cocok dengan objek form/grid DevLib; sumber kebenaran status dokumen = kolom "sisa/terproses" per baris, bukan hanya status kepala.
- Hak akses enam aksi per aktivitas lebih halus daripada matriks level per modul; pertimbangkan untuk standar Security admin DevLib.
- Rancangan Formulir (label dan visibilitas field per dokumen) adalah fitur konfigurasi yang bisa ditunda; saldo awal, periode akuntansi, dan akun default per barang lebih mendasar untuk modul accounting.
- Alur Pabrikasi (BOM > WO > release bahan > hasil) memetakan langsung ke produksi tmerp (formula, perintah kerja, pemakaian bahan, hasil); biaya standar per jam di formula adalah pola biaya konversi yang sederhana.
- Belum diverifikasi: jurnal otomatis tiap dokumen, perhitungan pajak, alokasi pembayaran, revaluasi kurs, dan penyusutan. Itu perlu diuji dengan transaksi contoh (di database uji, atas izin Jo).

## 11. Perilaku terverifikasi lewat uji input (PT ABC, 2026-10-30, data fiktif)
- Jurnal Umum (Bank D 10.000.000 / Modal K 10.000.000) langsung masuk Neraca Saldo.
- Faktur Penjualan (Pelanggan Umum, barang Servis 1001 harga 500.000): harga terisi dari master; jurnal otomatis Piutang (110302) D 500.000 / Penjualan (4000.01) K 500.000.
- Penerimaan Penjualan: bank dan faktur terbuka terisi otomatis, centang Bayar mengisi Payment Amount, Cheque Amount diisi manual; jurnal otomatis Bank D 500.000 / Piutang K 500.000; piutang kembali 0.
- Laba/Rugi: Pendapatan 500.000, HPP 0, Laba bersih 500.000. Neraca Saldo akhir seimbang 10.500.000.
- Belum diuji: PPN, retur, uang muka, persediaan fisik dan HPP, Pabrikasi, penyusutan, revaluasi kurs.
- Implikasi tmerp: setiap dokumen punya "akun default" yang menentukan jurnal otomatis (piutang di faktur, penjualan di barang, bank di penerimaan); modul accounting tmerp perlu tabel akun default per barang/pihak/dokumen, bukan hanya jurnal manual.

## 12. Uji lanjutan: laporan, PPN, aktiva tetap, penyusutan (PT ABC)
Rincian lengkap dan bukti gambar ada di `SKILL.md` bagian 3 butir 8-14 dan `uji/`. Ringkasan: Neraca dan Arus Kas konsisten dengan Neraca Saldo; PPN 11% menjurnal PPn Keluaran dan muncul otomatis di SPT Masa PPN (kode 01); aktiva tetap 12.000.000 menjurnal Aktiva D / Bank K tanpa menolak saldo kas negatif; penyusutan bulanan garis lurus dijurnal oleh Proses Akhir Bulan mulai bulan setelah aktiva dipakai; ada validasi wajib (keterangan kode pajak dan aktiva, umur >= 1 tahun). Pengetahuan akuntansi dan pajak Indonesia: `akuntansi-indonesia.md`.

## 13. Uji pembelian, PPN Masukan, persediaan, HPP (PT ABC)
Terverifikasi: Faktur Pembelian menjurnal Persediaan dan PPn Masukan terhadap Hutang; Faktur Penjualan barang persediaan menjurnal HPP dengan biaya rata-rata; pembayaran pembelian memakai Cheque Amount manual; Neraca (Standar) seimbang. Rincian: `SKILL.md` butir 15-20.
