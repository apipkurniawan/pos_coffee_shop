## Batas modul backend yang disarankan

-   `auth` dan `users`
-   `menu` dan `categories`
-   `orders` dan `order-items`
-   `payments`
-   `members` dan `loyalty`
-   `vouchers` dan `redemptions`
-   `recipes` dan `inventory`
-   `barista-queue`
-   `reports` dan `audit-logs`

## Catatan desain penting

-   Pisahkan **status order**, **status pembayaran**, dan **status
    persiapan**. Ketiganya menggambarkan hal yang berbeda.
-   Simpan pembayaran sebagai entitas tersendiri agar transaksi dapat
    mendukung split payment bila diperlukan.
-   Catat perubahan stok sebagai inventory movement, bukan hanya
    mengubah angka stok tanpa riwayat.
-   Pengurangan bahan berdasarkan resep harus dilakukan secara konsisten
    di backend dan dalam transaksi database sesuai kebijakan kapan order
    dianggap valid.
-   Progress loyalty hanya bertambah untuk item/transaksi yang memenuhi
    aturan program. Tentukan secara eksplisit apakah minuman gratis dari
    voucher ikut dihitung.
-   Penerbitan dan penukaran voucher harus aman terhadap request
    berulang agar voucher tidak terbit atau terpakai dua kali.