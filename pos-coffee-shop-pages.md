# POS Coffee Shop — Rekomendasi Daftar Halaman

Dokumen ini berisi rancangan halaman untuk aplikasi POS coffee shop yang mendukung **dine-in, takeaway, kasir, antrean barista, pembayaran, membership, voucher, laporan, dan inventori bahan baku**.

## 1. Struktur Aplikasi

Sebaiknya pisahkan aplikasi menjadi dua area utama:

1. **Aplikasi operasional** — digunakan kasir dan barista untuk melayani pesanan dengan cepat.
2. **Dashboard manajemen** — digunakan owner atau admin untuk mengatur menu, stok, pengguna, dan melihat laporan.

Hak akses ditentukan berdasarkan role pengguna. Halaman yang tidak sesuai dengan role sebaiknya tidak hanya disembunyikan di frontend, tetapi juga dilindungi di backend.

## 2. Halaman MVP — Prioritas Utama

Halaman berikut adalah versi awal yang paling direkomendasikan agar alur jual-beli coffee shop dapat berjalan terlebih dahulu.

| Prioritas | Halaman | Route contoh | Pengguna | Fungsi utama |
|---|---|---|---|---|
| P0 | Login | `/login` | Semua pengguna | Autentikasi pengguna |
| P0 | Dashboard ringkas | `/dashboard` | Owner, admin | Ringkasan penjualan dan kondisi operasional |
| P0 | POS / Kasir | `/pos` | Kasir | Membuat order dine-in atau takeaway, memilih menu dan modifier |
| P0 | Pembayaran | `/pos/checkout` | Kasir | Ringkasan tagihan, diskon/voucher, metode pembayaran, konfirmasi pembayaran |
| P0 | Detail transaksi / struk | `/transactions/[id]` | Kasir, admin | Detail transaksi dan cetak atau unduh struk |
| P0 | Riwayat transaksi | `/transactions` | Kasir, admin, owner | Pencarian transaksi dan melihat status pembayaran |
| P0 | Antrean barista | `/barista/queue` | Barista | Melihat pesanan masuk dan memperbarui status persiapan |
| P0 | Daftar menu | `/menus` | Admin, owner | Melihat dan mencari menu |
| P0 | Form menu | `/menus/new`, `/menus/[id]/edit` | Admin, owner | Membuat atau mengubah menu, harga, kategori, varian, dan ketersediaan |
| P0 | Kategori menu | `/menu-categories` | Admin, owner | Mengelola kategori seperti Coffee, Non-Coffee, dan Food |
| P0 | Manajemen pengguna | `/users` | Admin, owner | Mengelola akun dan role kasir/barista |
| P0 | Pengaturan toko | `/settings/store` | Admin, owner | Nama toko, alamat, pajak/service charge, format struk, dan pengaturan dasar |

### Detail penting halaman POS / Kasir

- Pilih tipe pesanan: **Dine-in** atau **Takeaway**.
- Dine-in dapat memilih nomor meja; takeaway dapat mencatat nama pelanggan atau nama pickup.
- Menu ditampilkan berdasarkan kategori, dengan pencarian cepat.
- Dukung varian dan modifier, misalnya ukuran, level gula, jenis susu, extra shot, dan catatan pesanan.
- Keranjang menampilkan jumlah item, subtotal, diskon, pajak/service charge bila berlaku, dan total.
- Harga final dihitung dan divalidasi di backend, bukan dipercaya dari frontend.
- Setelah pembayaran berhasil dan transaksi tersimpan, pesanan yang valid masuk ke antrean barista.

### Detail penting halaman Antrean Barista

- Pisahkan pesanan menjadi kolom atau tab: **Baru**, **Sedang dibuat**, dan **Siap**.
- Tampilkan nomor order, waktu masuk, tipe pesanan, item, modifier, dan catatan khusus.
- Barista dapat memperbarui status sesuai alur kerja.
- Gunakan pembaruan real-time agar order baru muncul tanpa reload.
- Status persiapan harus terpisah dari status pembayaran dan status order.

## 3. Halaman Membership dan Voucher

Direkomendasikan setelah alur POS dan pembayaran stabil.

| Halaman | Route contoh | Pengguna | Fungsi utama |
|---|---|---|---|
| Daftar member | `/members` | Kasir, admin, owner | Mencari dan melihat member |
| Detail member | `/members/[id]` | Kasir, admin, owner | Profil, histori transaksi, dan progress loyalty |
| Registrasi member | `/members/new` | Kasir, admin | Mendaftarkan member baru |
| Daftar voucher | `/vouchers` | Admin, owner | Melihat voucher dan statusnya |
| Form voucher | `/vouchers/new`, `/vouchers/[id]/edit` | Admin, owner | Membuat voucher diskon atau produk gratis dengan aturan yang jelas |
| Riwayat loyalty | `/loyalty/transactions` | Admin, owner | Audit progress, reward, dan penukaran voucher |

**Catatan aturan loyalty:** tetapkan apakah progress dihitung per minuman eligible atau per transaksi. Tentukan juga apakah minuman gratis dari voucher ikut menambah progress. Penerbitan dan penukaran voucher harus aman dari request ganda.

## 4. Halaman Inventori dan Resep

Halaman ini penting untuk mengontrol pemakaian bahan baku dan mengurangi selisih stok.

| Halaman | Route contoh | Pengguna | Fungsi utama |
|---|---|---|---|
| Ringkasan inventori | `/inventory` | Admin, owner | Ringkasan stok dan bahan yang hampir habis |
| Daftar bahan baku | `/inventory/ingredients` | Admin, owner | Mengelola nama bahan, satuan, dan batas minimum stok |
| Detail bahan baku | `/inventory/ingredients/[id]` | Admin, owner | Melihat stok dan histori pergerakan bahan |
| Pergerakan stok | `/inventory/movements` | Admin, owner | Melihat stok masuk, pemakaian, penyesuaian, dan alasan perubahan |
| Penerimaan stok | `/inventory/receiving` | Admin, owner | Mencatat bahan baku yang masuk |
| Penyesuaian stok | `/inventory/adjustments` | Admin, owner | Koreksi stok dengan alasan dan audit trail |
| Resep menu | `/inventory/recipes` | Admin, owner | Menghubungkan menu dengan bahan baku dan kuantitas pemakaian |
| Detail resep | `/inventory/recipes/[menuId]` | Admin, owner | Mengatur komposisi bahan untuk tiap menu/varian |

**Rekomendasi teknis:** jangan hanya mengubah angka stok. Catat setiap perubahan sebagai inventory movement agar histori dapat diaudit. Pengurangan bahan berdasarkan resep perlu dilakukan secara konsisten di backend sesuai kebijakan kapan order dianggap valid.

## 5. Halaman Laporan

| Halaman | Route contoh | Pengguna | Fungsi utama |
|---|---|---|---|
| Laporan penjualan | `/reports/sales` | Owner, admin | Penjualan berdasarkan rentang tanggal, toko, atau kasir |
| Laporan produk | `/reports/products` | Owner, admin | Produk terlaris dan produk dengan penjualan rendah |
| Laporan pembayaran | `/reports/payments` | Owner, admin | Ringkasan berdasarkan tunai, QRIS, transfer, atau metode lain |
| Laporan shift kasir | `/reports/cash-sessions` | Owner, admin | Rekap buka/tutup kas dan selisih kas |
| Laporan inventori | `/reports/inventory` | Owner, admin | Pemakaian bahan, stok menipis, dan penyesuaian |
| Laporan loyalty | `/reports/loyalty` | Owner, admin | Progress reward dan penukaran voucher |

Filter umum yang berguna: rentang tanggal, status, metode pembayaran, kasir, dan toko bila aplikasi mendukung banyak cabang. Sediakan ekspor CSV jika memang dibutuhkan operasional.

## 6. Halaman Operasional Tambahan

Halaman ini dapat ditambahkan sesuai proses toko.

| Halaman | Route contoh | Kapan dibutuhkan |
|---|---|---|
| Manajemen meja | `/tables` | Jika dine-in menggunakan nomor meja dan status meja |
| Sesi kasir | `/cash-sessions` | Jika kasir perlu membuka dan menutup shift serta mencatat modal awal |
| Detail order | `/orders/[id]` | Jika perlu melacak satu order lintas pembayaran dan persiapan |
| Pembatalan/refund | `/transactions/[id]/refund` | Jika kebijakan toko memperbolehkan pembatalan atau refund; wajib ada otorisasi dan audit |
| Notifikasi | `/notifications` | Jika admin perlu melihat peringatan stok atau kejadian operasional |
| Audit log | `/audit-logs` | Jika perlu menelusuri perubahan harga, stok, voucher, dan aksi sensitif |
| Pengaturan pembayaran | `/settings/payments` | Jika metode pembayaran dan konfigurasi penyedia perlu dikelola |
| Pengaturan loyalty | `/settings/loyalty` | Jika aturan reward harus dapat diatur admin |

## 7. Navigasi yang Disarankan

Contoh sidebar untuk dashboard admin/owner:

```text
Dashboard
Penjualan
  ├── POS / Kasir
  ├── Transaksi
  └── Sesi Kasir
Operasional
  ├── Antrean Barista
  └── Meja (opsional)
Menu
  ├── Daftar Menu
  └── Kategori Menu
Pelanggan
  ├── Member
  ├── Voucher
  └── Riwayat Loyalty
Inventori
  ├── Ringkasan Stok
  ├── Bahan Baku
  ├── Penerimaan Stok
  ├── Pergerakan Stok
  └── Resep Menu
Laporan
  ├── Penjualan
  ├── Produk
  ├── Pembayaran
  └── Inventori
Pengaturan
  ├── Toko
  ├── Pengguna & Role
  └── Pembayaran
```

Untuk layar kasir, sebaiknya gunakan tampilan POS yang fokus dan minim navigasi agar proses transaksi cepat. Untuk layar barista, gunakan tampilan antrean khusus dengan tombol status yang besar dan mudah disentuh.

## 8. Role dan Akses Halaman

| Fitur | Owner | Admin | Kasir | Barista |
|---|---:|---:|---:|---:|
| Dashboard ringkas | Ya | Ya | Opsional | Tidak perlu |
| POS dan pembayaran | Ya | Ya | Ya | Tidak |
| Riwayat transaksi | Ya | Ya | Terbatas sesuai kebijakan | Tidak |
| Antrean barista | Ya | Ya | Lihat status | Ya |
| Kelola menu dan harga | Ya | Ya | Tidak | Tidak |
| Kelola pengguna | Ya | Ya, sesuai kebijakan | Tidak | Tidak |
| Member dan voucher | Ya | Ya | Cari/member dan redeem sesuai izin | Tidak |
| Inventori dan resep | Ya | Ya | Tidak atau terbatas | Tidak |
| Laporan | Ya | Ya sesuai izin | Tidak atau laporan shift sendiri | Tidak |
| Pengaturan toko | Ya | Terbatas | Tidak | Tidak |

Matriks ini adalah titik awal. Akses final harus disesuaikan dengan struktur organisasi toko dan diterapkan di backend.

## 9. Alur Utama Aplikasi

```text
Login
  ↓
POS / Kasir
  ↓
Pilih dine-in atau takeaway
  ↓
Pilih menu, varian, modifier, dan catatan
  ↓
Hubungkan member / gunakan voucher (opsional)
  ↓
Validasi total di backend
  ↓
Pembayaran
  ↓
Transaksi tersimpan dan pembayaran terkonfirmasi
  ↓
Order masuk ke antrean barista
  ↓
Barista: Baru → Sedang dibuat → Siap
  ↓
Pesanan diserahkan / diambil pelanggan
  ↓
Struk dan histori transaksi tersedia
```

Alur pengecualian seperti pembayaran gagal, pembatalan, refund, dan stok tidak mencukupi harus dirancang secara terpisah. Jangan menganggap pembayaran berhasil hanya karena tombol bayar diklik.

## 10. Urutan Pembuatan Halaman

### Fase 1 — MVP transaksi

1. Login dan role dasar.
2. POS / Kasir.
3. Checkout dan pembayaran.
4. Detail transaksi dan struk.
5. Riwayat transaksi.
6. Antrean barista real-time.
7. CRUD kategori dan menu.

### Fase 2 — Operasional toko

1. Dashboard ringkas.
2. Sesi buka/tutup kasir.
3. Member dan loyalty.
4. Voucher dan penukaran.
5. Bahan baku, resep, dan pergerakan stok.

### Fase 3 — Manajemen dan scale-up

1. Laporan lengkap dan ekspor.
2. Audit log dan notifikasi stok.
3. Pengaturan lanjutan.
4. Multi-cabang, jika dibutuhkan.
5. Refund dan rekonsiliasi pembayaran sesuai kebutuhan bisnis.

## 11. Keputusan yang Perlu Ditetapkan Sebelum Implementasi

- Apakah aplikasi hanya untuk satu toko atau multi-cabang?
- Apakah dine-in wajib menggunakan meja bernomor?
- Metode pembayaran apa yang didukung pada MVP: tunai, QRIS, transfer, atau lainnya?
- Apakah kasir wajib membuka dan menutup sesi kas?
- Apakah stok dikurangi saat order dibayar atau pada tahap lain yang ditetapkan?
- Apakah menu memiliki varian, modifier, dan harga tambahan?
- Apa aturan pasti membership, voucher, refund, dan pembatalan?
- Apakah struk dicetak melalui printer thermal atau cukup digital pada tahap awal?

**Rekomendasi akhir:** mulai dari halaman MVP yang mendukung satu siklus lengkap **buat order → bayar → antrean barista → pesanan selesai → transaksi tercatat**. Setelah alur ini stabil, lanjutkan membership, voucher, inventori, dan laporan.
