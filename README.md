# DCN UNIRA

Website komunitas Developer Community Network (DCN) UNIRA - Platform untuk mengelola komunitas Dicoding Community Network di Universitas Madura.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) dengan App Router
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Database:** [Supabase](https://supabase.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Form:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF)
- **Activity Logging:** [Axiom](https://axiom.co/)
- **UploadCare:** [UploadCare](uploadcare.com)

## Fitur

### Public

- Landing page dengan informasi komunitas
- Sistem tier kontributor
- Halaman FAQ
- Klaim sertifikat
- Verifikasi sertifikat
- Quiz online

### Dashboard Admin

- **Dashboard** - Statistik umum komunitas
- **Analytics** - Data analytics detail
- **Absensi** - Kelola pertemuan dan absensi kontributor
- **Leaderboard** - Ranking kontributor berdasarkan poin
- **Kuis** - Buat dan kelola kuis online
- **Kelola Admin** - Manajemen co-admin dengan permission custom (Super Admin only)
- **Activity Log** - Log aktivitas admin dengan integrasi Axiom

### Sistem Role & Permission

| Role            | Akses                            |
| --------------- | -------------------------------- |
| **Super Admin** | Semua fitur + kelola co-admin    |
| **Co-Admin**    | Sesuai permission yang diberikan |

**Permission yang tersedia:**

- Dashboard
- Analytics
- Absensi & Pertemuan
- Leaderboard
- Kuis
- Kontributor

## Instalasi

### Prasyarat

- Node.js 18+
- npm atau pnpm
- Akun Supabase
- Akun Axiom (untuk activity logging)

### Setup

1. Clone repository

```bash
git clone https://github.com/your-username/dcn-unira.git
cd dcn-unira
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp e.env.example .env.local
```

4. Isi file `.env.local`:

e.env.example

5.  Jalankan development server

```bash
npm run dev
```

6. Buka [http://localhost:3000](http://localhost:3000)

## Scripts

| Command         | Description                 |
| --------------- | --------------------------- |
| `npm run dev`   | Jalankan development server |
| `npm run build` | Build untuk production      |
| `npm run start` | Jalankan production server  |
| `npm run lint`  | Jalankan ESLint             |

## Struktur Folder

```
dcn-unira/
├── app/                  # Next.js App Router
│   ├── (site)/           # Landing page routes
│   ├── api/              # API routes
│   │   ├── absensi/      # API absensi
│   │   ├── admin/        # API manajemen admin
│   │   ├── activity-log/ # API activity log
│   │   ├── analytics/    # API analytics
│   │   ├── auth/         # API authentication
│   │   ├── kontributor/  # API kontributor
│   │   ├── leaderboard/  # API leaderboard
│   │   ├── pertemuan/    # API pertemuan
│   │   ├── quiz/         # API quiz
│   │   └── sertifikat/   # API sertifikat
│   ├── dashboard/        # Dashboard admin
│   ├── login/            # Halaman login
│   └── maintenance/      # Halaman maintenance
├── components/           # React components
│   ├── dashboard/        # Komponen dashboard
│   │   ├── ManageAdminTab.tsx    # UI kelola admin
│   │   ├── ActivityLogTab.tsx    # UI activity log
│   │   └── ...
│   ├── screen/           # Screen components
│   └── ui/               # UI primitives (shadcn)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   ├── auth.ts           # Helper authentication & permission
│   ├── axiom.ts          # Helper logging ke Axiom
│   ├── permissions.ts    # Konstanta & helper permission
│   └── supabase.ts       # Supabase client & types
└── public/               # Static assets
```

## Activity Logging

Sistem mencatat aktivitas admin ke Axiom:

| Aksi               | Deskripsi                   |
| ------------------ | --------------------------- |
| `login`            | Admin login ke dashboard    |
| `logout`           | Admin logout dari dashboard |
| `create_quiz`      | Membuat kuis baru           |
| `update_quiz`      | Mengupdate kuis             |
| `delete_quiz`      | Menghapus kuis              |
| `create_pertemuan` | Membuat pertemuan baru      |
| `create_absensi`   | Menyimpan absensi           |
| `create_admin`     | Menambah co-admin baru      |
| `update_admin`     | Mengupdate data admin       |
| `delete_admin`     | Menghapus admin             |

## Keamanan

- Semua API dashboard dilindungi dengan authentication
- Permission check di setiap API endpoint
- Co-admin yang dihapus langsung kehilangan akses
- Activity logging untuk audit trail
- Cookie httpOnly untuk token authentication

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
