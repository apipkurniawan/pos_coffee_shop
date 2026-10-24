# POS Coffee Shop --- Stack Teknologi

Dokumen ini merangkum stack teknologi yang direkomendasikan dan urutan
implementasi untuk aplikasi POS coffee shop yang mendukung dine-in,
takeaway, kasir, antrean barista, membership, voucher, serta pengelolaan
bahan baku.

## Frontend

-   **Next.js + TypeScript** --- aplikasi kasir dan dashboard
    operasional.
-   **Tailwind CSS + shadcn/ui** --- styling dan komponen antarmuka.
-   **TanStack Query** --- pengelolaan server state, fetching, caching,
    dan mutation API.
-   **Zustand** --- state lokal UI atau state order sementara di sisi
    client jika diperlukan.

## Backend

-   **NestJS** --- REST API dengan struktur modular yang mudah
    dikembangkan dan diuji.
-   **REST API** --- komunikasi utama antara frontend dan backend.
-   **Socket.IO** --- pembaruan antrean barista/kitchen secara
    real-time.

## Database dan ORM

-   **PostgreSQL** --- penyimpanan transaksi, menu, pembayaran, member,
    voucher, resep, dan pergerakan stok.
-   **Prisma** --- ORM dan pengelolaan skema database.

## Autentikasi dan keamanan

-   Gunakan **session cookie yang aman** untuk autentikasi aplikasi web.
-   Terapkan validasi dan otorisasi di backend untuk setiap aksi
    penting, khususnya pembayaran, penggunaan voucher, dan perubahan
    stok.
-   Gunakan transaksi database untuk proses yang harus konsisten,
    misalnya menyimpan pembayaran sekaligus memperbarui loyalty
    progress.
-   Terapkan idempotency pada endpoint transaksi/pembayaran agar request
    yang diulang tidak membuat transaksi ganda.

## Testing

-   **Jest** --- unit test.
-   **Supertest** --- integration test untuk endpoint backend.
-   **Playwright** --- end-to-end test untuk alur kasir utama.

## Deployment

-   **Docker** --- menyamakan lingkungan aplikasi saat development dan
    deployment.
-   **Managed cloud atau VPS** --- tempat menjalankan aplikasi, API, dan
    database sesuai kebutuhan operasional.

## Komponen yang belum perlu untuk MVP

**Redis belum wajib** pada tahap awal. Pertimbangkan Redis ketika
aplikasi membutuhkan beberapa instance backend, koordinasi Socket.IO
lintas instance, caching bersama, atau pemrosesan job asynchronous yang
lebih kompleks.

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