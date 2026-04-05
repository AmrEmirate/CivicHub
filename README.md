<div align="center">

# 🛡️ CivicHub Frontend

**Platform Manajemen & Pelaporan Kas RT/RW Modern dengan Estetika Civic Sanctuary**

[![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-Latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com/)

*Solusi antarmuka cerdas untuk transparansi keuangan dan efisiensi administrasi warga*

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Folder](#-arsitektur-folder)
- [Demo Role Switcher](#-demo-role-switcher)
- [Role & Akses UI](#-role--akses-ui)
- [Instalasi & Setup](#-instalasi--setup)
- [Panduan Pengembangan](#-panduan-pengembangan)

---

## 🌟 Tentang Proyek

**CivicHub Frontend** adalah antarmuka pengguna (UI) dari ekosistem CivicHub, sebuah platform manajemen digital tingkat RT/RW. Proyek ini mengusung konsep **"Civic Sanctuary"** — sebuah desain yang menggabungkan profesionalisme administrasi dengan ketenangan visual melalui penggunaan *glassmorphism*, tipografi modern, dan palet warna yang harmonis.

Aplikasi ini dibangun untuk memenuhi standar **Topik 15: Aplikasi Pengelolaan dan Pelaporan Kas RT/RW**, memastikan setiap transaksi keuangan tercatat secara transparan dan mudah dipahami oleh pengurus maupun warga.

---

## ✨ Fitur Utama

### 📊 Dashboard & Analitik
- Visualisasi kas (Pemasukan vs Pengeluaran) menggunakan **Recharts**.
- Summary saldo real-time dan statistik tagihan warga.
- Widget aktivitas terbaru untuk transparansi data.

### 💰 Treasury (Manajemen Kas)
- Input transaksi harian dengan validasi data yang ketat.
- Manajemen invoice dan iuran otomatis.
- Laporan tunggakan warga yang informatif dan filterable.
- Interface untuk pembuatan LPJ (Laporan Pertanggungjawaban).

### 👥 Portal Warga & Pengurus
- Manajemen database warga lengkap (KK, Status Rumah, Kontak).
- Portal personal warga untuk cek histori tagihan dan status pembayaran.
- Integrasi status pembayaran otomatis (Lunas/Pending).

### 🎨 UI/UX Premium
- **Responsive Design**: Optimal di desktop, tablet, maupun smartphone.
- **Dark/Light Mode**: Dukungan tema yang adaptif.
- **Micro-interactions**: Animasi halus menggunakan `tailwindcss-animate`.

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Core Framework** | Next.js 15+ (App Router) |
| **Library UI** | React 19 |
| **Language** | TypeScript 5.7+ |
| **Styling** | Tailwind CSS 4.x |
| **Component Kit** | Shadcn UI (Radix UI) |
| **State Management** | React Context API |
| **Forms & Validation** | React Hook Form + Zod |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Animations** | Tailwind Animate + Framer Motion (optional) |
| **Notifications** | Sonner |

---

## 🏗️ Arsitektur Folder

Proyek ini mengikuti struktur **Next.js App Router** yang modular:

```
CivicHub/
├── app/                # Page route & Layout (App Router)
│   ├── (auth)/         # Halaman Login & Register
│   ├── (dashboard)/    # Dashboard Core (RBAC protected)
│   └── api/            # Route handler (jika diperlukan)
│
├── components/         # UI Components
│   ├── ui/             # Base components (Shadcn)
│   ├── dashboard/      # Business logical components
│   └── shared/         # Reusable global components
│
├── hooks/              # Custom React Hooks
├── lib/                # Core Logic
│   ├── services/       # API call handlers (current: mock service)
│   ├── types/          # TypeScript interface & types
│   ├── utils/          # Formatting & mapping helpers
│   └── mock-data/      # Data dummy untuk keperluan demo/dev
│
└── public/             # Static assets (Images, Icons, Fonts)
```

---

## 🎭 Demo Role Switcher

Salah satu fitur unggulan proyek ini adalah **Demo Role Switcher** yang terletak di pojok kanan atas. Fitur ini memungkinkan Anda untuk mensimulasikan berbagai peran pengguna secara instan tanpa login berulang kali:

*   **SUPER_ADMIN**: Akses penuh ke seluruh fitur dan pengaturan sistem.
*   **ADMIN_ADMINISTRASI**: Fokus pada pengelolaan data warga dan surat menyurat.
*   **ADMIN_KEUANGAN**: Akses khusus ke modul kas, iuran, dan laporan keuangan.
*   **WARGA**: Tampilan user-friendly untuk melihat tagihan pribadi.

---

## 🔐 Role & Akses UI

| Role | Aksesibilitas Halaman |
|---|---|
| `SUPER_ADMIN` | Semua halaman termasuk pengaturan sistem & user management. |
| `ADMIN_ADMINISTRASI` | Dashboard warga, pendataan KK, dan status rumah. |
| `ADMIN_KEUANGAN` | Dashboard finansial, input kas, invoice, dan laporan. |
| `WARGA` | Dashboard tagihan saya, riwayat pembayaran, dan profil. |

---

## 🚀 Instalasi & Setup

### Prasyarat
- **Node.js** v20 atau lebih baru (direkomendasikan)
- **npm** atau **yarn**

### 1. Clone Repository
```bash
git clone https://github.com/AmrEmirate/CivicHub.git
cd CivicHub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env.local` di root folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```
*(Catatan: Saat ini aplikasi masih menggunakan Mock Service di `lib/services`, pastikan beralih ke API real saat backend tersedia)*

---

## ▶️ Panduan Pengembangan

### Menjalankan Mode Development
```bash
npm run dev
```
Aplikasi akan tersedia di [http://localhost:3000](http://localhost:3000)

### Membuat Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

---

## 👤 Author

**Amar** — [GitHub @AmrEmirate](https://github.com/AmrEmirate)

---

<div align="center">

*Dibuat dengan ❤️ untuk CivicHub.*

</div>
