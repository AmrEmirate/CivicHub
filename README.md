# 🛡️ CivicHub: Aplikasi Pengelolaan Kas RT/RW

> **Solusi Digital Terpadu untuk Administrasi Lingkungan yang Transparan dan Akuntabel.**


---

## 📖 Deskripsi Proyek (Topik 15)

**CivicHub** adalah platform manajemen digital yang dirancang khusus untuk memodernisasi infrastruktur administrasi di tingkat RT/RW. Proyek ini dibangun berdasarkan kebutuhan fungsional **Topik 15: Aplikasi Pengelolaan dan Pelaporan Kas RT/RW**, dengan fokus utama pada transparansi keuangan, efisiensi pendataan warga, dan otomatisasi penagihan iuran.

Dengan estetika desain **"Civic Sanctuary"** yang premium dan modern, aplikasi ini memberikan pengalaman pengguna yang tenang namun berwibawa bagi pengurus wilayah maupun warga.

---

## ✨ Fitur Utama

### 🏦 Manajemen Keuangan (Treasury)
- **Buku Kas Umum Otomatis**: Rekapitulasi saldo, pemasukan, dan pengeluaran secara real-time.
- **Pencatatan Kas Harian**: Input transaksi harian lengkap dengan unggah bukti transaksi digital.
- **Manajemen Jenis Iuran**: Konfigurasi nominal iuran wajib (Keamanan, Kebersihan, Sosial) secara fleksibel.
- **Export LPJ Tahunan**: Generate Laporan Pertanggungjawaban (LPJ) profesional dalam format PDF.

### 👥 Manajemen Data Warga
- **Pendataan Kepala Keluarga (KK)**: Informasi mendetail mulai dari No. KK, jumlah anggota keluarga, hingga nomor rumah.
- **Status Kepemilikan**: Klasifikasi hunian antara Milik Sendiri atau Sewa/Kontrak untuk akurasi iuran.
- **Database Terpusat**: Kemudahan integrasi data kependudukan bagi Sekretaris RT.

### 💳 Otomatisasi Penagihan & Pembayaran
- **Tagihan Otomatis**: Sistem secara cerdas membuat tagihan bulanan untuk setiap warga.
- **Payment Gateway Simulation**: Simulasi pembayaran menggunakan QRIS/Bank Transfer dengan **API Callback** yang memperbarui status "Lunas" secara seketika.
- **Kwitansi Digital**: Penerbitan bukti pembayaran otomatis yang dapat diunduh oleh warga.
- **Laporan Tunggakan**: Pemantauan warga yang belum melunasi iuran lengkap dengan hitungan jumlah bulan tunggakan.

### 🔐 Keamanan & Hak Akses (RBAC)
Menerapkan 4 Matrix Hak Akses yang ketat:
- **Ketua RT/RW**: Dashboard pengawasan penuh & ekspor laporan.
- **Sekretaris**: Fokus pada manajemen database warga & surat menyurat.
- **Bendahara**: Otoritas penuh pada modul keuangan & penagihan.
- **Warga**: Portal personal untuk cek tagihan & pembayaran mandiri.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Material Symbols Outlined](https://fonts.google.com/icons)
- **Design System**: Material Design 3 inspired (Glassmorphism & Civic Sanctuary Aesthetic)

---

## 🚀 Cara Menjalankan

1. **Clone Repositori**
   ```bash
   git clone https://github.com/AmrEmirate/CivicHub.git
   cd CivicHub
   ```

2. **Instalasi Dependensi**
   ```bash
   npm install
   ```

3. **Jalankan Mode Pengembangan**
   ```bash
   npm run dev
   ```
   Akses di `http://localhost:3000`

---

## 🎭 Mode Demo

Aplikasi ini dilengkapi dengan **"Demo Role Switcher"** di bagian Header (Pojok Kanan Atas) untuk memudahkan presentasi. Anda dapat berganti peran secara instan untuk melihat perbedaan UI antara pengurus dan warga tanpa perlu keluar-masuk akun.

---

## 📜 Lisensi & Hak Cipta

© 2026 **Amr Emirate**. Semua hak cipta dilindungi undang-undang. Proyek ini dikembangkan untuk memenuhi kebutuhan sistem administrasi publik yang modern dan transparan.

---
*Dibuat dengan ❤️ oleh Antigravity untuk CivicHub.*
