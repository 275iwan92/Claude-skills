---
name: inventory-gudang
description: Pakai SEBELUM merancang, menilai, atau mengubah layar/engine inventory, stok, gudang, opname, batch, valuasi, reorder, landed cost, return di tmerp; melengkapi erp-saran.
---

> **WAJIB BACA DULU (Jo 2026-11-26)**: sebelum menyentuh modul Inventory, baca bagian `## Sub-goal` (kutipan Jo) dan tabel `### Keputusan Jo` K1-K10 di `docs/tg/inventory/stock/00_submodule_stock.md` (salinan sama di warehouse dan batch-quality). Pernyataan Jo baru tentang Inventory: tambah kutipan bertanggal + baris keputusan di ketiga kartu itu (di TM176, push GitHub). Jo: "DAN ALWAYS you READ BEFORE you handle inventory module."

# Inventory dan gudang (tmerp, CV. Telasih Makmur)

Rumus, contoh angka, dan URL ada di `references/inventory-teknis.md` (baca bagian topik yang dipakai). Skill ini melengkapi `erp-saran` (`references/procure-to-pay-gudang.md`: alur P2P, 16 saran berperingkat); jangan menduplikasi. Mutu/klaim: `tqm-iso`. Kertas/proses cetak: `print-packaging-pro`. Pajak/akuntansi ID: `fat-indonesia`.

## Cara kerja
1. Baca dulu bagian topik di `references/inventory-teknis.md`, lalu kartu TG terkait di `docs/tg/inventory/` (stock, warehouse, batch-quality) dan kartu stok nyata (`rm_stockcard`); jangan menjawab dari ingatan.
2. Cocokkan dengan fakta tmerp: nilai = Average berjalan per item, Issue tidak mengubah Average, tanpa LIFO, tanpa stok negatif, satu pintu posting (`20_engine_stock-posting`); `inv_stock_layer` (FIFO) kosong tanpa kode.
3. Sebelum mengusul skema/field/engine: `php artisan concept:find "<kata>"` (aturan D.24) dan tulis "Already exists? Searched where, result".
4. Saran berformat `[acuan] saran - dampak - usaha (S/M/L)`; tiap klaim eksternal berlabel [V] (dibaca langsung), [S] (ringkasan pencarian), [U] (umum, belum dibaca). Angka vendor/blog bukan standar.
5. Perubahan apa pun hanya seizin Jo (preview JPEG, "Ya"); skill ini hanya pengetahuan. Perubahan engine = sertakan workflow Input -> langkah -> Output + tabel baca/tulis.
6. Uji dengan angka nyata dari `ddt*` (`--env=mockup`), bukan contoh buatan; jangan memakai angka stok sebelum cur_stock vs kartu sinkron (lihat Celah).

## 10 topik: inti, rumus, cek di tmerp
1. Stock ledger dan jurnal ganda. Tiap gerak = baris ledger + jurnal; saldo ledger = akun persediaan. GR: Dr Persediaan / Cr GR/IR; invoice: Dr GR/IR +- selisih harga / Cr Utang. Pembalikan = dokumen lawan arah. Cek: jalur Confirm -> `rm_stockcard` -> `fin_voucher`; Daily Reconciliation (DIFF); GR/IR aging (sisi invoice mati).
2. Valuasi. FIFO (lapisan), rata-rata bergerak (rate dihitung ulang saat receipt, issue tidak mengubah), standar. PSAK 14/IAS 2: FIFO atau rata-rata, LIFO dilarang, ukur min(biaya, NRV). NRV = harga jual - biaya selesai - biaya jual. Cek: tetap Average (cukup untuk PSAK; catat alasannya di kartu); `obsolete-stock` vs NRV.
3. Batch/lot dan telusur. Terima wajib lot; telusur maju-mundur; status karantina/released/rejected. Cek: dari satu lot kertas, daftar WO dan DO terdampak; `batch-quality/10_card_batch-master`, `20_engine_batch-service`; Transfer belum menulis `batch_id`.
4. Putaway dan lokasi. Aturan (kelas bahan, kondisi, kapasitas) -> area/bin; strategi picking FIFO/FEFO. Cek: `21_engine_putaway-planner`, Building/Area/Bin, pallet; usul aturan per kelas bahan (kertas kering, tinta FEFO).
5. Reservasi dan alokasi. Tersedia = on hand - reserved; forecast = on hand + masuk - keluar. Cek: booking ada di Production (`rm_booking`); Stock Out manual dan GR tidak cek reservasi; layar stok belum menampilkan "tersedia".
6. Opname dan cycle count. ABC menurut nilai pakai tahunan: A bulanan, B kuartalan, C tahunan (praktik umum, bukan standar); IRA = cocok / dihitung, target 98-99%. Cek: Count Task (kunci bin hanya blok transfer/putaway/pick), Adjustment Approval; belum ada kelas ABC.
7. Reorder point, safety stock, EOQ. ROP = d x L + SS; SS = z x sigma_d x akar(L); EOQ = akar(2DS/H). Contoh kertas: d=250 kg/hari, sigma 60, L=7, z=1,65 -> SS 262, ROP 2.012 kg; EOQ D=60.000, S=500.000, H=1.200 -> 7.071 kg. Cek: `mat_raw` ROP hanya badge; `MaterialPlanningEngine::leadDays`; rancangan `docs/laporan/2026-11-22-rancangan-engine-reorder.md`.
8. Return. Retur ke supplier: stok keluar pada nilai receipt asli + debit note + buka sisa PO; retur dari produksi = lawan issue pada rate issue. Cek: persetujuan retur beli tidak menggerakkan stok/jurnal/PO; reversal tanpa asal (7 baris).
9. Landed cost. Alokasi menurut qty/nilai/berat/volume/sama rata; terlambat -> porsi yang sudah keluar ke HPP/selisih. Contoh 600.000 atas 1.000/500/500 kg: qty 300/150/150 rb. Cek: `25_engine_landed_cost` (`LandedCostService`) hanya value/qty; belum ada berat/volume.
10. Kertas/karton. 500 lembar = 1 rim; kg/ream = gsm x m2 x 500/1000 (plano 79x109 cm, 300 gsm: 129,2 kg/rim, 1 ton = 3.871 lembar). Roll berat variabel; sisa (remnant) dilacak di atas ambang; susut = alasan adjustment tersendiri; kertas offset ~50% RH, aklimatisasi dalam bungkus; FSC: faktor konversi = output/input, credit account, makloon. Cek: konversi LBR/RIM di PO, `WarehouseStock::stacks`, atribut sertifikasi batch.

## Celah tmerp (dari TG; verifikasi ulang sebelum dipakai)
- Reorder point/safety stock/min-max: tidak ada engine; hanya `shortage-auto-detector` dan badge Below reorder.
- Klasifikasi ABC: tidak ada; cycle count berbasis interval hari per area.
- Reservasi: tidak dicek di Stock Out manual dan GR; "tersedia" tidak tampil.
- Laporan volume FSC/PEFC per periode dan faktor konversi: tidak ada (atribut batch ada).
- NRV: provisi obsolete ada, kaitan ke NRV belum dinyatakan di kartu.
- Susut kelembapan/selisih berat roll: hanya alasan klaim "moisture test"; offcut/roll sisa belum dimodelkan.
- FG: produksi tidak menambah, DO tidak mengurangi (prioritas tinggi).
- Data: cur_stock vs kartu tidak sinkron (46 dari 81 item), 7 reversal tanpa asal; selesaikan sebelum angka stok dipakai untuk reorder.
- Lain: invoice vendor tidak dicocokkan ke PO/GR; PO tanpa Cancel/Close; retur beli tidak menggerakkan stok (lihat `erp-saran` bagian D-E).

## Batas
- Teks resmi PSAK 14/IAI, klausul FSC-STD-40-004 (volume control), dan CPIM belum dibaca; jangan menaruh angka/klausul di kode sebelum dibaca dari sumber resmi.
- Interval ABC, aklimatisasi, toleransi +/-5-10% adalah praktik/vendor; tanyakan ke gudang Jo sebelum dijadikan aturan.
