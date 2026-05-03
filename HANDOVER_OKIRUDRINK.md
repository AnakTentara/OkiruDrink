# 📄 Dokumen Serah Terima Proyek: OkiruDrink Web App

**Tanggal**: 3 Mei 2026  
**Disiapkan Oleh**: Tim Developer & UI/UX  
**Status**: Siap untuk Review Manajemen  

---

## 1. Executive Summary
**OkiruDrink** hadir sebagai pionir solusi minuman sehat berbasis teknologi (*Digital-First Health Drink*). Menyadari pergeseran gaya hidup masyarakat urban yang menuntut kepraktisan tanpa mengorbankan kesehatan, platform ini dirancang untuk menjembatani kesenjangan antara produk berkualitas tinggi dan pengalaman pemesanan yang sangat mudah digunakan (*user-friendly*). 

Sistem web aplikasi ini tidak hanya berfokus pada penjualan, tetapi juga pada retensi pelanggan (membuat pelanggan terus kembali) melalui sistem poin, keanggotaan (membership), dan keamanan data tingkat tinggi.

---

## 2. Struktur Aplikasi (Daftar Halaman & Fungsinya)
Aplikasi ini dirancang seperti aplikasi ponsel sungguhan (*mobile-app like*), yang terdiri dari beberapa halaman utama. Berikut adalah panduan singkat mengenai fungsi setiap halamannya:

1. **Halaman Beranda (Home)**: Layar pertama yang menyambut pelanggan. Berisi deretan spanduk promo (Carousel), info gerai terdekat, status poin Membership secara sekilas, dan menu "Spesial Hari Ini".
2. **Halaman Menu (Katalog)**: Etalase digital tempat pelanggan melihat seluruh daftar minuman. Dilengkapi fitur pencarian pintar dan filter kategori (Teh Herbal, Bundle, dll) agar pelanggan cepat menemukan apa yang mereka cari.
3. **Halaman Keranjang (Cart)**: Rangkuman pesanan pelanggan sebelum melakukan pembayaran. Di sini pelanggan bisa mengatur tingkat kemanisan es/gula, menambahkan catatan, dan memasukkan kode voucher diskon.
4. **Halaman Profil (Profile)**: Pusat kendali pelanggan. Menampilkan kartu identitas, level keanggotaan (*Basic, Silver, Gold, Diamond*), *Progress Bar* (garis persentase menuju level berikutnya), dan riwayat pesanan.
5. **Halaman Autentikasi (Masuk & Daftar)**: Gerbang utama aplikasi. Didesain sangat aman namun mudah, dengan opsi pendaftaran cepat.
6. **Halaman Verifikasi OTP**: Layar khusus keamanan yang bertugas memvalidasi kepemilikan nomor telepon.
7. **Halaman Keamanan Akun (Security)**: Area khusus privasi di mana pengguna dapat mengganti kata sandi atau menghapus akun mereka secara permanen jika diinginkan.

---

## 3. Sistem Akun & Keamanan (Untuk Manajemen)
Kami mengimplementasikan standar keamanan industri terkini yang memprioritaskan kenyamanan sekaligus privasi pelanggan:

### A. Kemudahan Pendaftaran (Login & Register)
Pelanggan tidak perlu repot menghafal banyak kata sandi. Sistem kami telah siap untuk mendukung:
- **Pendaftaran via Email & Nomor HP**: Pendaftaran standar yang cepat.
- **Login Sosial (Google & Apple)**: *(Segera Hadir)* Pelanggan cukup 1 kali klik menggunakan akun Google atau Apple yang sudah ada di HP mereka untuk langsung masuk ke aplikasi.

### B. Sistem Anti-Robot & Akun Palsu (OTP WhatsApp)
Setiap akun baru **diwajibkan** melewati Verifikasi OTP (*One-Time Password*).
- **Pengiriman via WhatsApp**: Sistem akan mengirimkan 6 digit angka unik langsung ke WhatsApp pelanggan. Hal ini sangat efektif menekan biaya SMS biasa dan lebih familiar bagi orang Indonesia.
- **Fallback (Rencana Cadangan)**: Jika nomor WhatsApp tidak aktif atau sedang gangguan jaringan, sistem dapat mengalihkan pengiriman kode OTP tersebut melalui Email yang terdaftar.

### C. Kebebasan & Perlindungan Privasi (Fitur Hapus Akun)
Sesuai dengan undang-undang perlindungan data privasi (seperti UU PDP di Indonesia), kami menyediakan fitur **"Hapus Akun"**.
- Fitur ini diletakkan di **Halaman Keamanan**.
- Jika ditekan, sistem tidak akan langsung menghapusnya (mencegah kepencet). Sistem akan **meminta kode OTP ulang** ke WhatsApp pelanggan untuk memastikan bahwa yang menghapus benar-benar pemilik asli.
- **Data Perusahaan Tetap Aman**: Saat akun dihapus, sistem hanya melakukan *Soft Delete* (Menghapus identitas nama, nomor HP, dan email). Data riwayat pembelian (*Order History*) tetap akan anonim dan utuh di *database* agar pembukuan dan laporan keuangan manajemen (*Dashboard Admin*) tidak berantakan.

---

## 4. Filosofi Visual & UI/UX (Meningkatkan Penjualan)
- **Desain Kelas Atas (*Perfectionist Aesthetica*)**: Menggunakan palet Hijau Mint dan Putih yang memberikan kesan bersih, higienis, dan sehat (*Healthy but Tasty*).
- **Sistem Keanggotaan Mirip Game (*RPG-style*)**: Sistem level (Basic ke Diamond) yang menghitung otomatis persentase progres. Hal ini secara psikologis memicu rasa penasaran (*Gamification*) yang mendorong pelanggan untuk membeli lagi agar levelnya naik.
- **Tombol Belanja yang Selalu Mengikuti**: Tombol "Keranjang" selalu mengambang di bawah layar, terjangkau oleh ibu jari, sehingga kapan pun pelanggan merasa lapar/haus, tombol beli selalu siap sedia (*Conversion-Optimized*).

---

## 5. Kesimpulan & Langkah Selanjutnya
Aplikasi OkiruDrink saat ini telah berdiri dengan pondasi teknologi (Node.js/MySQL) yang amat solid, stabil, dan fungsional dari ujung pendaftaran akun hingga pelacakan poin. 

**Langkah Selanjutnya untuk Manajemen:**
1. **Integrasi Gerbang Pembayaran (*Payment Gateway*)**: Menghubungkan aplikasi dengan Midtrans/Xendit agar pelanggan bisa langsung bayar pakai QRIS, GoPay, ShopeePay, atau Virtual Account BCA.
2. **Integrasi Vendor WhatsApp**: Menyambungkan sistem pengiriman OTP dengan pihak ketiga pengirim pesan (seperti Bailseye/Watzap).
3. **Dashboard Admin**: Menyelesaikan tampilan kontrol panel khusus Manajemen untuk melihat laporan laba harian, pesanan masuk, dan mengatur stok barang.

---
*Dokumen ini bersifat rahasia (Confidential) dan diperuntukkan khusus bagi jajaran Manajemen Internal Proyek OkiruDrink.*
