# Brand Design — POS Coffee Shop

**Versi:** 1.0  
**Status:** Konsep awal untuk design system

Dokumen ini menetapkan arah identitas visual untuk aplikasi POS coffee shop: konsep logo, palet warna, dan typography. Nama brand belum ditentukan, sehingga logo di bawah merupakan konsep visual yang dapat disesuaikan setelah nama brand dipilih.

---

## 1. Brand Direction

### Karakter brand

- **Warm:** terinspirasi dari kopi, roasted beans, dan suasana kedai.
- **Modern:** bentuk sederhana, bersih, dan tidak terlalu dekoratif.
- **Friendly:** mudah didekati oleh pelanggan dan staf.
- **Reliable:** cocok untuk aplikasi operasional yang menampilkan harga, pembayaran, dan status pesanan.

### Prinsip desain UI

1. Utamakan keterbacaan dan kecepatan interaksi kasir.
2. Gunakan warna brand untuk aksi utama, bukan pada setiap komponen.
3. Gunakan warna status secara konsisten dan selalu sertakan label teks.
4. Pertahankan ruang kosong yang cukup agar layar kasir tidak terasa padat.

---

## 2. Logo Brand

### Konsep logo

**Arah visual:** ikon cangkir kopi minimalis dengan uap berbentuk garis sederhana, dipadukan dengan wordmark sans-serif tebal.

Elemen logo:

- **Ikon:** siluet cangkir atau biji kopi geometris yang tetap terbaca dalam ukuran kecil.
- **Wordmark:** nama brand dengan huruf sans-serif tegas, ramah, dan mudah dibaca.
- **Gaya:** flat, minim detail, tanpa gradasi kompleks atau bayangan berlebihan.
- **Kesan:** hangat, modern, praktis, dan profesional.

### Variasi logo yang perlu disiapkan

| Variasi | Penggunaan |
|---|---|
| Horizontal | Halaman login, header dashboard, materi brand |
| Icon-only | Favicon, sidebar compact, ikon aplikasi |
| Monokrom gelap | Struk, dokumen, atau latar terang |
| Monokrom terang | Latar gelap |
| Full color | Penggunaan utama pada UI dan materi brand |

### Panduan penggunaan

- Sisakan clear space minimal setinggi ikon di sekeliling logo.
- Jangan meregangkan, memiringkan, atau mengubah proporsi logo.
- Hindari menempatkan logo pada latar dengan kontras rendah.
- Hindari detail tipis yang hilang ketika logo dicetak kecil pada struk.
- Gunakan ikon saja jika ruang terlalu sempit untuk wordmark.

### Brief untuk desainer

> Rancang logo untuk software POS coffee shop modern. Gunakan ikon cangkir kopi atau biji kopi geometris dengan bentuk sederhana dan mudah dikenali pada ukuran kecil. Pasangkan dengan wordmark sans-serif yang tegas tetapi ramah. Gunakan warna espresso gelap dan terracotta hangat. Hindari ilustrasi yang terlalu ramai, efek 3D, dan detail tipis. Siapkan versi horizontal, icon-only, full color, monokrom gelap, dan monokrom terang.

**Catatan:** nama brand final belum ditentukan. Jangan mengunci wordmark sebelum nama brand dipilih.

---

## 3. Color Palette

Palet menggunakan warna espresso sebagai warna gelap utama, terracotta sebagai aksen brand, dan krem hangat sebagai latar. Warna status dipisahkan dari warna brand agar pesan operasional mudah dikenali.

### 3.1 Brand colors

| Token | Hex | Penggunaan |
|---|---|---|
| `brand-950` | `#2B1D18` | Teks utama, header gelap |
| `brand-800` | `#4A3027` | Navigasi dan elemen brand gelap |
| `brand-700` | `#684536` | Hover/active pada elemen gelap |
| `brand-500` | `#B86F4B` | Aksen brand dan tombol utama setelah validasi kontras |
| `brand-100` | `#F2E3D9` | Latar aksen lembut |
| `background` | `#FAF7F3` | Latar utama aplikasi |
| `surface` | `#FFFFFF` | Kartu, modal, panel |
| `border` | `#E7DED6` | Border dan divider |
| `text-primary` | `#2B1D18` | Teks utama |
| `text-secondary` | `#74665D` | Teks sekunder |

### 3.2 Semantic colors

| Token | Hex | Penggunaan |
|---|---|---|
| `success` | `#21865B` | Pembayaran berhasil, pesanan siap |
| `success-bg` | `#E7F5ED` | Latar status sukses |
| `warning` | `#8A5200` | Stok menipis, status perlu perhatian |
| `warning-bg` | `#FFF3D9` | Latar peringatan |
| `danger` | `#B42318` | Pembayaran gagal, error, aksi destruktif |
| `danger-bg` | `#FCEAE8` | Latar error |
| `info` | `#2768A8` | Informasi dan status netral |
| `info-bg` | `#EAF3FC` | Latar informasi |

### 3.3 Aturan penggunaan warna

- Gunakan `brand-500` untuk aksi utama yang paling penting pada satu tampilan.
- Pastikan warna teks pada tombol memiliki kontras yang cukup; gunakan `brand-800` atau `brand-950` sebagai latar tombol jika teks putih pada `brand-500` tidak memenuhi kontras.
- Jangan membedakan status hanya dengan warna. Sertakan label seperti **Paid**, **Pending**, **Preparing**, atau **Ready**.
- Hindari menggunakan warna `danger` untuk dekorasi biasa.
- Validasi rasio kontras sebelum rilis, khususnya untuk teks kecil dan elemen interaktif.

### 3.4 CSS custom properties

```css
:root {
  /* Brand */
  --brand-950: #2b1d18;
  --brand-800: #4a3027;
  --brand-700: #684536;
  --brand-500: #b86f4b;
  --brand-100: #f2e3d9;

  /* Surfaces and text */
  --background: #faf7f3;
  --surface: #ffffff;
  --border: #e7ded6;
  --text-primary: #2b1d18;
  --text-secondary: #74665d;

  /* Semantic */
  --success: #21865b;
  --success-bg: #e7f5ed;
  --warning: #8a5200;
  --warning-bg: #fff3d9;
  --danger: #b42318;
  --danger-bg: #fceae8;
  --info: #2768a8;
  --info-bg: #eaf3fc;
}
```

---

## 4. Typography

### 4.1 Font utama

**Rekomendasi: Inter**

Inter cocok untuk dashboard dan aplikasi kasir karena bentuk hurufnya jelas untuk label, tabel, formulir, dan angka transaksi.

Font stack:

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system,
  BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Jika menggunakan Next.js, font dapat di-load melalui `next/font/google` agar font dikelola dan dioptimalkan oleh aplikasi. Pastikan penggunaan font sesuai kebijakan jaringan dan deployment proyek.

### 4.2 Type scale

| Token | Ukuran | Weight | Line height | Penggunaan |
|---|---:|---:|---:|---|
| `display` | 32 px | 700 | 1.2 | Total besar atau angka ringkasan |
| `h1` | 28 px | 700 | 1.25 | Judul halaman |
| `h2` | 22 px | 600 | 1.3 | Judul section |
| `h3` | 18 px | 600 | 1.35 | Judul kartu/panel |
| `body-lg` | 16 px | 400 | 1.5 | Konten penting |
| `body` | 14 px | 400 | 1.5 | Teks UI umum |
| `label` | 13 px | 500 | 1.4 | Label input dan tabel |
| `caption` | 12 px | 400 | 1.4 | Metadata dan keterangan sekunder |

### 4.3 Aturan typography

- Gunakan 14–16 px untuk mayoritas teks UI.
- Hindari ukuran 12 px untuk informasi kritis seperti total, status pembayaran, atau nomor order.
- Gunakan weight 600 untuk heading dan label penting; jangan membuat semua teks bold.
- Gunakan angka tabular untuk harga dan kuantitas agar kolom angka lebih mudah dibandingkan.
- Format mata uang secara konsisten, misalnya `Rp25.000`.
- Gunakan line-height yang nyaman dan hindari paragraf panjang pada layar kasir.

### 4.4 Contoh CSS typography

```css
:root {
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;

  --text-display: 2rem;
  --text-h1: 1.75rem;
  --text-h2: 1.375rem;
  --text-h3: 1.125rem;
  --text-body-lg: 1rem;
  --text-body: 0.875rem;
  --text-label: 0.8125rem;
  --text-caption: 0.75rem;
}

body {
  font-family: var(--font-sans);
  color: var(--text-primary);
  background: var(--background);
  font-size: var(--text-body);
  line-height: 1.5;
}

.numeric {
  font-variant-numeric: tabular-nums;
}
```

---

## 5. Ringkasan keputusan desain

| Area | Keputusan awal |
|---|---|
| Brand personality | Warm, modern, friendly, reliable |
| Logo | Ikon cangkir/biji kopi minimalis + wordmark |
| Primary accent | Terracotta `#B86F4B` |
| Dark brand | Espresso `#2B1D18` |
| App background | Warm cream `#FAF7F3` |
| Surface | White `#FFFFFF` |
| Font | Inter |
| UI priority | Kontras, keterbacaan, dan interaksi kasir yang cepat |

## 6. Hal yang perlu difinalisasi

- Nama brand untuk wordmark final.
- Pemeriksaan kontras warna berdasarkan kombinasi foreground/background yang benar-benar dipakai.
- Uji tampilan pada layar kasir, tablet, layar barista, dan hasil cetak struk.
- Finalisasi file logo dalam SVG dan PNG setelah nama brand ditetapkan.
