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

## Fitur

- Landing page dengan informasi komunitas
- Sistem tier kontributor
- Dashboard admin
- Autentikasi login
- Statistik komunitas
- Manajemen event dan program

## Instalasi

### Prasyarat

- Node.js 18+
- npm atau pnpm

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

Isi file `.env.local` dengan konfigurasi yang diperlukan (Supabase URL, API Key, dll).

4. Jalankan development server

```bash
npm run dev
```

5. Buka [http://localhost:3000](http://localhost:3000)

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
│   ├── dashboard/        # Dashboard admin
│   └── login/            # Halaman login
├── components/           # React components
│   ├── dashboard/        # Komponen dashboard
│   ├── screen/           # Screen components
│   └── ui/               # UI primitives (shadcn)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── public/               # Static assets
```

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
