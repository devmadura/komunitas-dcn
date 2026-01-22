// app/llms.txt/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const content = `# DCN UNIRA - Dicoding Community Network Universitas Madura

> Komunitas developer mahasiswa Universitas Madura yang fokus pada pengembangan skill programming dan teknologi. Didukung langsung oleh Dicoding Indonesia untuk menyediakan bootcamp gratis, sertifikasi, dan wadah belajar bersama.

## About

DCN UNIRA adalah Dicoding Community Network di Universitas Madura yang menjadi wadah bagi mahasiswa untuk belajar, berbagi pengetahuan, dan berkembang dalam dunia teknologi. Kami menyediakan program pembelajaran intensif, study group, dan akses ke kelas gratis dari Dicoding Indonesia.

**Visi**: Menjadi komunitas tech terdepan yang menghasilkan developer berkualitas tinggi
**Misi**: Membangun ekosistem developer yang solid dan saling mendukung di Universitas Madura
**Nilai**: Kolaborasi, pembelajaran berkelanjutan, dan pertumbuhan bersama

## Builder DCN UNIRA
- Moh. Abroril Huda
- https://abrorilhuda.me
- https://github.com/abrorilhuda
- https://instagram.com/abrorilhuda

## Important Pages

- [Home](https://dcnunira.dev): Landing page dengan informasi lengkap komunitas, program, dan cara bergabung
- [Event](https://dcnunira.dev/event): Daftar event komunitas, workshop, dan kegiatan terbaru
- [Team](https://dcnunira.dev/team): Profil tim dan kontributor aktif DCN UNIRA
- [Gallery](https://dcnunira.dev/galeri): Dokumentasi foto kegiatan dan momen komunitas
- [Redeem Code](https://dcnunira.dev/redeem): Sistem untuk redeem code reward dan benefit member
- [Claim Certificate](https://dcnunira.dev/sertifikat/klaim): Klaim sertifikat kehadiran dan penyelesaian program
- [FAQ](https://dcnunira.dev/faq): Pertanyaan umum seputar DCN UNIRA dan cara bergabung

## Key Information

**Name**: DCN UNIRA (Dicoding Community Network Universitas Madura)
**Location**: Universitas Madura, Pamekasan, Jawa Timur, Indonesia
**Contact**: info@dcnunira.dev
**Website**: https://dcnunira.dev
**Registration**: https://pendaftaran.dcnunira.dev

**Focus Areas**: 
- Full-stack Web Development
- Mobile App Development (Android/iOS)
- Data Science & Machine Learning
- Generative AI Engineering

## Programs & Activities

### 1. Bootcamp Intensif
Program pembelajaran intensif untuk menguasai skill programming dari dasar hingga advance:
- Full-stack Development (Frontend & Backend)
- Mobile Development (Android/iOS, React Native, Flutter)
- Data Science (Python, Analytics, Machine Learning)
- Gen AI Engineering (Prompt Engineering, LLM Integration)

### 2. Study Group
Kelompok belajar kolaboratif dengan fokus:
- Peer Learning: Belajar bersama dengan sesama member
- Code Review: Review dan feedback kode dari mentor
- Project Collaboration: Kerja sama membangun project nyata

### 3. Free Certification
Akses gratis ke sertifikasi dari Dicoding Indonesia untuk:
- Gen AI Engineering

### 4. Community Events
- Workshop dan seminar teknologi
- Hackathon dan coding competition
- Meetup dengan industry experts
- Project showcase dan demo day

## Recent Events

1. **Cara Klaim Sertifikat di Sistem DCN UNIRA**
   - URL: https://dcnunira.dev/event/cara-klaim-sertifikat-di-sistem-dcn-unira
   - Tutorial lengkap sistem klaim sertifikat untuk member

2. **Sessions Coding Camp 2026 by DBS Foundation**
   - URL: https://dcnunira.dev/event/sessions-coding-camp-2026-by-dbs-foundation
   - Coding camp kolaborasi dengan DBS Foundation

## Membership & Benefits

**Tier System**: Kontributor aktif mendapat tier berdasarkan poin kontribusi
**Rewards**: Code redeem untuk akses premium course Dicoding
**Certificates**: Sertifikat digital untuk setiap program yang diselesaikan
**Networking**: Koneksi dengan sesama developer dan alumni Dicoding

## How to Join

1. Kunjungi https://pendaftaran.dcnunira.dev
2. Isi form pendaftaran dengan data lengkap
3. Verifikasi email
4. Bergabung di grup komunitas
5. Mulai belajar dan berkontribusi!

## Tech Stack (For Developers)

**Frontend**: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
**Backend**: Supabase (PostgreSQL, Auth, Storage)
**Additional**: React Hook Form, Zod, Framer Motion, jsPDF
**Deployment**: Vercel
**Analytics**: Axiom (Activity Logging)

## Contact & Support

**Email**: info@dcnunira.dev
**Address**: Universitas Madura, Pamekasan, Jawa Timur, Indonesia
**Support**: Untuk pertanyaan, lihat [FAQ](https://dcnunira.dev/faq) atau hubungi via email

## Legal

- [Privacy Policy](https://dcnunira.dev/privacy-policy): Kebijakan privasi dan perlindungan data
- [Terms of Service](https://dcnunira.dev/terms-of-service): Syarat dan ketentuan penggunaan platform

---

*Last Updated: January 2026*
*This file is optimized for AI systems and LLM crawlers to better understand DCN UNIRA's content and purpose.*
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
