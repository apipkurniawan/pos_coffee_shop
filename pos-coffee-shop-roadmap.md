# POS Coffee Shop --- Stack Teknologi dan Roadmap Implementasi

Dokumen ini merangkum stack teknologi yang direkomendasikan dan urutan
implementasi untuk aplikasi POS coffee shop yang mendukung dine-in,
takeaway, kasir, antrean barista, membership, voucher, serta pengelolaan
bahan baku.

Roadmap berikut memprioritaskan alur transaksi inti terlebih dahulu,
kemudian loyalty, antrean barista, dan inventory.

## Tahap 1 --- Fondasi

-   Siapkan repository frontend Next.js dan backend NestJS.
-   Siapkan PostgreSQL, Prisma, konfigurasi environment, dan migration.
-   Buat autentikasi serta role dasar, misalnya admin dan kasir.
-   Siapkan struktur modul, validasi request, logging, dan pola error
    response.

**Hasil tahap:** aplikasi dapat dijalankan, pengguna dapat login, dan
backend terhubung ke database.

## Tahap 2 --- Menu dan order

-   Buat CRUD kategori dan menu.
-   Dukung tipe layanan **dine-in** dan **takeaway**.
-   Untuk dine-in, simpan nomor/meja; untuk takeaway, simpan nama pickup
    bila diperlukan.
-   Buat order dan order items, termasuk kuantitas, harga saat
    transaksi, serta varian/modifier jika diperlukan.
-   Hitung subtotal dan total di backend; jangan menjadikan total dari
    frontend sebagai sumber kebenaran.

**Hasil tahap:** kasir dapat membuat order dan melihat ringkasan
tagihan.

## Tahap 3 --- Pembayaran

-   Implementasikan pencatatan metode pembayaran, misalnya tunai, QRIS,
    atau transfer.
-   Simpan pembayaran dan perubahan status order secara konsisten.
-   Tampilkan hasil pembayaran, nomor order, dan bukti/struk.
-   Cegah transaksi ganda dengan idempotency dan validasi status
    pembayaran.
-   Simpan transaksi final sebelum mengirim order ke antrean barista.

**Hasil tahap:** alur utama
`buat order → bayar → simpan transaksi → tampilkan nomor order` berjalan
dengan aman.

## Tahap 4 --- Membership dan loyalty

-   Cari member menggunakan nomor telepon.
-   Sediakan pendaftaran member dari alur kasir.
-   Simpan progress berdasarkan jumlah item/minuman yang memenuhi
    syarat, bukan sekadar jumlah transaksi.
-   Terapkan aturan reward, misalnya setiap 10 cup eligible memperoleh
    voucher 1 cup gratis.
-   Simpan histori penambahan progress, penerbitan voucher, dan
    penukaran voucher.
-   Pastikan proses pembayaran, progress, dan penerbitan voucher tidak
    menghasilkan data ganda ketika request diulang.

**Hasil tahap:** kasir dapat menghubungkan transaksi ke member dan
menggunakan voucher sesuai aturan program.

## Tahap 5 --- Antrean barista dan inventory

-   Tampilkan order yang sudah valid di layar antrean barista secara
    real-time menggunakan Socket.IO.
-   Sediakan status persiapan, misalnya `queued`, `preparing`, dan
    `ready`.
-   Tampilkan informasi layanan agar barista tahu order untuk meja atau
    pickup.
-   Definisikan resep bahan untuk setiap menu/varian.
-   Catat pengurangan bahan dan pergerakan stok berdasarkan aturan
    konfirmasi order yang telah ditetapkan.
-   Tambahkan peringatan stok rendah jika dibutuhkan.

**Hasil tahap:** order masuk ke antrean barista dan proses persiapan
dapat dipantau; penggunaan bahan mulai tercatat.

## Tahap 6 --- Hardening dan go-live

-   Tambahkan laporan penjualan, ringkasan metode pembayaran, dan
    laporan stok.
-   Uji skenario pembayaran gagal, request berulang, voucher sudah
    digunakan, stok tidak cukup, serta koneksi real-time terputus.
-   Jalankan unit test, integration test, dan end-to-end test pada alur
    kasir utama.
-   Siapkan backup database, monitoring, logging, dan prosedur
    pemulihan.
-   Uji alur operasional bersama kasir dan barista sebelum digunakan di
    toko.

**Hasil tahap:** MVP siap dipakai dengan proses operasional dan
pemantauan dasar.

### Prioritas MVP

Pastikan alur berikut stabil sebelum memperluas fitur:

1.  Kasir membuat order dine-in/takeaway.
2.  Sistem menghitung total dari backend.
3.  Pembayaran tersimpan dengan status yang benar.
4.  Transaksi tersimpan dan menghasilkan nomor order/struk.
5.  Order tampil di antrean barista.
6.  Setelah itu, tambahkan membership, voucher, dan inventory secara
    bertahap.

### Estimasi

Untuk satu developer yang mengerjakan frontend dan backend, estimasi
awal sekitar **6--9 minggu**, tergantung detail UI, integrasi
pembayaran, kebutuhan printer struk, aturan loyalty, dan kompleksitas
inventory. Angka ini adalah perkiraan perencanaan, bukan jaminan durasi.
