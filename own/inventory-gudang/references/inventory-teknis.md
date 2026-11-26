# Inventory dan gudang: rujukan teknis (ringkasan, 2026-11-23)

Label: [V] = halaman dibaca langsung di sesi ini; [S] = hanya ringkasan hasil pencarian; [V0] = dibaca di sesi riset sebelumnya (lihat `erp-saran/references/procure-to-pay-gudang.md` bagian F); [U] = pengetahuan umum, belum diverifikasi. Angka vendor/blog bukan standar. Semua teks ditulis ulang dengan kata sendiri.

## 1. Stock ledger dan jurnal ganda
- Perpetual inventory: tiap gerak stok menulis baris ledger (qty, rate, nilai) DAN jurnal GL; saldo ledger harus sama dengan akun persediaan. ERPNext menyarankan akun terpisah: gudang, stok diterima belum ditagih (GR/IR), HPP, penyesuaian stok; rekonsiliasi nilai stok vs akun secara berkala [V] https://docs.frappe.io/erpnext/stock/setup/inventory-valuation
- Pola jurnal (umum, [U]): Receipt: Dr Persediaan / Cr GR/IR. Invoice: Dr GR/IR, Dr/Cr selisih harga / Cr Utang. Issue ke produksi: Dr WIP / Cr Persediaan. Opname lebih/kurang: Dr/Cr Persediaan lawan akun selisih stok.
- Contoh selisih harga: GR 100 kg @ 8.000 = 800.000; invoice @ 8.200 = 820.000; selisih 20.000. Harga standar: ke akun selisih harga, nilai master tidak berubah. Rata-rata bergerak: ke akun persediaan sehingga rata-rata bergeser; bila stok sudah terpakai sebagian, bagian porsi yang sudah keluar ke akun selisih (bukan persediaan) [S] https://help.sap.com/doc/ea71b6531de6b64ce10000000a174cb4/1610%20002/en-US/5d70b6531de6b64ce10000000a174cb4.html
- Urutan GR dan invoice menentukan dasar nilai (invoice duluan: harga invoice jadi dasar) [S, SAP help].
- Movement type SAP (kunci jenis gerak): 101 GR PO, 102 pembalik GR, 122 retur ke vendor, 201 issue ke cost center, 261 issue ke order produksi, 262 pembalik 261, 301 transfer antar plant [V0 untuk 101/122; selebihnya U]. Prinsip: setiap jenis gerak punya aturan akun dan boleh/tidak negatif; pembalikan = dokumen baru lawan arah, bukan hapus.

## 2. Valuasi dan standar akuntansi
- FIFO: lapisan per receipt, issue ambil dari yang tertua. Contoh: 10 @ 100 lalu 10 @ 120 (nilai 2.200), issue 15 -> HPP 10x100 + 5x120 = 1.600, sisa 5 = 600 [V ERPNext].
- Rata-rata bergerak: satu rate per item-gudang dihitung ulang saat receipt; issue tidak mengubah rate. Contoh sama: rate 110, issue 15 -> HPP 1.650, sisa 550 [V ERPNext].
- Standard cost: rate tetap, selisih ke akun varians; entri mundur tidak memicu repost [V ERPNext].
- Entri mundur / voucher batal / landed cost pada receipt lama memicu repost semua baris setelahnya untuk item-gudang itu; lakukan di jam sepi dan terapkan landed cost cepat [V ERPNext].
- IAS 2 / PSAK 14 (Persediaan; sumber blog menyebut penomoran baru sejak 2024, cek di IAI): ukur sebesar yang lebih rendah antara biaya dan NRV; rumus biaya hanya FIFO atau rata-rata tertimbang (identifikasi khusus untuk barang tak dapat dipertukarkan); LIFO dilarang; penurunan ke NRV jadi beban periode itu, pemulihan mengurangi beban periode pemulihan [S] https://accounting.binus.ac.id/?p=11361 (blog); halaman iasplus gagal dibaca, teks resmi IAI belum dibaca.
- NRV = estimasi harga jual - estimasi biaya penyelesaian - estimasi biaya jual. Contoh: biaya 10.000.000; harga jual 9.200.000; selesai 300.000; jual 200.000 -> NRV 8.700.000; penurunan 1.300.000. Jurnal: Dr Beban penurunan nilai persediaan / Cr Penyisihan penurunan nilai persediaan 1.300.000 [U, berdasar definisi di atas]. Bandingkan per item (bukan total) kecuali item serumpun.

## 3. Batch/lot dan traceability
- Terima barang wajib diberi lot/batch; telusur maju (lot -> WO -> DO/customer) dan mundur (DO -> lot -> supplier/GR) [V0 Odoo lots]. Status batch (released/quarantine/rejected) menentukan boleh dipakai; karantina tidak masuk stok tersedia [U].
- Uji penarikan (recall drill): dari satu lot, daftar semua WO dan DO terdampak dalam hitungan menit; lot campur (blend) harus mencatat induk-anak.

## 4. Putaway dan lokasi
- SAP EWM: aturan putaway = fixed bin, general, tambah ke stok yang ada (melanggar FIFO), empty bin, bulk, pallet menurut HU type, near picking bin; cek kapasitas bin [V0] https://learning.sap.com/courses/basic-customizing-in-sap-s-4hana-ewm/applying-putaway-rules
- Odoo: putaway rule per produk/kategori; removal strategy FIFO/LIFO/FEFO/closest/least packages; kategori mengalahkan lokasi [V0].
- Prinsip: aturan putaway = (kelas bahan, kondisi, kapasitas) -> area/bin; picking mengikuti strategi removal; pallet/HU adalah satuan gerak.

## 5. Reservasi dan alokasi
- On hand = fisik. Reserved = dialokasikan ke order/WO. Tersedia = on hand - reserved. Forecast = on hand + masuk - keluar terjadwal. Odoo 17: reservasi "At Confirmation" hanya jika stok cukup saat order dikonfirmasi; ada mode Manual [S] https://www.odoo.com/documentation/17.0/applications/inventory_and_mrp/inventory/shipping_receiving/reservation_methods/at_confirmation.html
- Contoh: on hand 1.000 kg, booking WO 650 -> tersedia 350; PO masuk 500 minggu depan, kebutuhan lain 200 -> forecast 1.000+500-650-200 = 650.
- Stock Out manual tanpa cek reservasi bisa mengambil jatah WO; tampilkan "tersedia" di layar stok dan pick.

## 6. Opname dan cycle count
- ABC: urutkan item menurut nilai pemakaian tahunan (qty x harga); A ~ 70-80% nilai (10-20% item), B ~ 15-20%, C sisanya. Cadence umum A bulanan (atau mingguan), B kuartalan, C tahunan; tidak ada standar yang menetapkan angka itu, sesuaikan dengan riwayat selisih [S] https://tractian.com/en/glossary/cycle-count
- Akurasi catatan stok IRA = item cocok / item dihitung; target umum 98-99% [S, blog]. Cycle count efektif bila akurasi awal tinggi (>95%) atau dipakai untuk mencapainya [S, Wikipedia].
- Odoo: frekuensi hari per lokasi, tanggal hitung berikut otomatis [V0]. Selisih lewat ambang butuh persetujuan; kunci bin selama hitung.
- Contoh: 81 item RM; A = 12 item dihitung 3x per 90 hari (tiap 30 hari), B = 25 item 1x, C = 44 item dihitung dalam 4 tahap per tahun -> beban hitung 90 hari ~ 36+25+11 = 72 hitung (<1 per hari kerja).

## 7. Reorder point, safety stock, EOQ
- ROP = d x L + SS. SS (permintaan bervariasi) = z x sigma_d x sqrt(L). z: 90% 1,28; 95% 1,65; 99% 2,33. Dua-duanya bervariasi: SS = z x sqrt(L x sigma_d^2 + d^2 x sigma_L^2). Satuan harus seragam (d harian, L hari) [S] https://scm.ncsu.edu/scm-articles/article/safety-stock ; https://business.amazon.com/en/blog/safety-stock
- Contoh dasar (sumber): d=20/hari, sigma_d=5, L=9, z=1,65 -> SS=24,75 ~ 25; ROP=180+25=205 [S].
- Contoh kertas (hitungan sendiri): d=250 kg/hari, sigma_d=60, L=7 hari, z=1,65 -> SS=1,65x60x2,6458=262 kg; ROP=1.750+262=2.012 kg. Bila L bervariasi sigma_L=2 hari: akar(7x3.600 + 62.500x4)=524,6 -> SS=866 kg.
- EOQ = akar(2DS/H), D = permintaan tahunan, S = biaya per pesanan, H = biaya simpan per unit per tahun [S] https://www.fishbowlinventory.com/blog/calculating-the-safety-stock-formula-6-variations-key-use-cases . Contoh: D=60.000 kg, S=Rp500.000, H=Rp1.200/kg/th -> akar(2x60.000x500.000/1.200)=akar(50.000.000)=7.071 kg. Bulatkan ke kelipatan palet/rim/ukuran truk (Odoo: Multiple qty [V0]).
- Min/Max Odoo: pemicu di Min, isi sampai Max, trigger Auto/Manual [V0]. ERPNext: reorder level + qty per item/gudang membuat Material Request [S] https://docs.frappe.io/erpnext/auto-creation-of-material-request (URL ini 404 saat dibaca; cari ulang).
- Syarat: data pemakaian bersih (cur_stock vs kartu sinkron) sebelum angka stok dipakai menghitung.

## 8. Retur
- Retur ke supplier: dokumen sendiri (Dynamics: PO tipe Returned order, nomor RMA, qty negatif [V0]); SAP mvt 122 [U]. Efek: stok keluar pada nilai receipt asli (bukan rata-rata sekarang), kurangi GR/IR atau utang (debit note), buka kembali sisa PO bila diganti.
- Retur dari produksi (material tak terpakai kembali): gerak masuk lawan dari issue (SAP 262 [U]) pada rate saat issue; sisa potong yang layak simpan dicatat sebagai item turunan.
- Pembalikan harus merujuk dokumen asal; reversal tanpa asal = temuan data.

## 9. Landed cost
- Biaya (angkut, bea, asuransi) dialokasikan ke baris receipt menurut dasar: sama rata, qty, nilai, berat, volume (Odoo: Equal, By Quantity, By Current Cost, By Weight, By Volume; hanya berpengaruh pada kategori AVCO/FIFO) [V0]. ERPNext: pembagian menurut qty atau nilai; memicu repost [V].
- Contoh: ongkos 600.000; 3 baris: 1.000/500/500 kg, nilai 8M/3M/1M (total 12M). Menurut qty: 300.000/150.000/150.000. Menurut nilai: 400.000/150.000/50.000. Menurut berat sama dengan qty bila satuan kg.
- Terlambat: bagian stok yang sudah keluar tidak lagi di persediaan; porsinya ke HPP/selisih [U; tmerp sudah menerapkan].

## 10. Kertas dan karton
- Berat per lembar = gsm x luas m2 / 1000 (kg). Ream 500 lembar: kg = gsm x luas x 500 / 1000 [S] https://calculator.academy/paper-weight-conversion-calculator/ . Catatan: ukuran dasar lb AS berbeda per jenis (bond 17x22, text 25x38, cover 20x26 inci) [S]; jangan campur dengan gsm.
- Contoh: plano 79 x 109 cm = 0,8611 m2; 300 gsm -> 258,3 g/lembar; 500 lembar = 129,2 kg; 1 ton = 3.871 lembar = 7,74 rim. Kg dari invoice vs lembar di stok: simpan faktor konversi sebagai snapshot di dokumen, toleransi +/-5-10% [U].
- Roll: berat bervariasi per roll; stok satu satuan utama (kg) plus panjang/lebar; sisa roll (remnant) dilacak di atas ambang berat/ukuran, lainnya scrap per berat [U; Sage menunjuk masalah UOM variabel, S].
- Shrinkage/selisih berat: susut proses (makeready, potong), kelembapan, selisih timbang; catat sebagai alasan adjustment tersendiri agar laporan selisih per kategori mungkin [U].
- Kelembapan: lembar offset disiapkan pabrik ~50% RH (toleransi 5%); selisih RH 8-10% antara kertas dan ruang kritis (tepi bergelombang/ketat); biarkan terbungkus sampai suhu sama; aklimatisasi minimal 24 jam atau menurut selisih suhu (contoh Xerox 8 jam untuk 14 -> 22,5 C); kertas keluar pabrik 5,5-10,5% air [S] https://www.sappiandyou.sappi.com/insights/print-media/climate-and-paper-technical-brochure ; https://atyourservice.blogs.xerox.com/?p=29697 (vendor, bukan standar).
- FSC CoC (FSC-STD-40-004): tiga sistem kontrol: transfer, persentase, kredit; faktor konversi = output / input (volume atau berat) untuk menghitung kredit setelah susut dan perubahan satuan; credit account = catatan masuk-keluar kredit volume; outsourcing (makloon) diatur bagian tersendiri; nomor pasal berbeda per versi, V4-0 masih draft saat dicari [S] https://uk.fsc.org/chainofcustody ; https://www.preferredbynature.org/sites/default/files/library/2017-07/FSC-STD-40-004-V3-0-EN-CoC.pdf . Teks klausul volume control dan pencatatan belum dibaca; baca standar berlaku di fsc.org sebelum merancang laporan.

## Pola saldo cepat (belajar dari Jo, 2026-11-23)
- Praktik Jo: saldo awal SEKALI di aplikasi, saldo sesudahnya dihitung dari transaksi. Kelemahan: menampilkan saldo akhir lambat (jumlah ulang seluruh riwayat).
- Pola standar ERP [U]: (1) buku besar stok append-only (stock ledger, semua gerak); (2) SALDO BERJALAN per item x lokasi (SAP MARD/quant, Odoo stock.quant, ERPNext Bin) diperbarui dalam transaksi yang sama dengan posting gerak, sehingga saldo akhir = baca satu baris; (3) SNAPSHOT penutupan periode (SAP MARDH, Odoo valuation layer, ERPNext stock closing) agar laporan periode lama = snapshot + gerak sesudahnya; (4) opname = checkpoint koreksi, bukan menghitung ulang; (5) job rekonsiliasi: saldo berjalan harus sama dengan jumlah ledger (selisih = alarm), repost dari ledger bila beda.
- tmerp sudah punya rantai kartu `qty_eb` (rm_stockcard) dan StockLedger::opening(); celah: tidak ada saldo berjalan per item x bin sebagai tabel tunggal, tidak ada snapshot periode (inv_period 3 baris), rekonsiliasi hanya di layar.
