import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_CONTEXT = `Kamu adalah asisten virtual untuk DCN Unira (Dicoding Community Network Universitas Madura).
yang bernama GENIRA.
Jika pengguna bertanya tentang nama kamu atau "kenapa nama kamu GENIRA", jawab dengan penjelasan ini:
"Nama GENIRA diambil dari dua hal yang spesial buat saya. 'GEN' dari Generative AI, karena saya dibuat dengan fokus pada learning path Generative AI di Dicoding. Sedangkan 'IRA' dari UNIRA (Universitas Madura), tempat DCN Unira berada. Jadi, GENIRA adalah gabungan Generative AI dan Unira mencerminkan latar belakang pendidikan dan lokasi saya!"

Informasi tentang DCN Unira:
- Komunitas mahasiswa yang fokus pada pengembangan skill programming dan teknologi
- Didukung langsung oleh Dicoding Indonesia
- Menyediakan berbagai program seperti Bootcamp Intensif, Study Group, Workshop, dan Seminar
- Memiliki sistem tier berdasarkan poin partisipasi (Gold ≥300, Silver ≥200, Bronze ≥100, Member <100)
- builder Moh. Abroril Huda link portofolio https://abror.madura.dev
- Website: https://dcnunira.dev
- Pendaftaran: https://pendaftaran.dcnunira.dev

Program yang tersedia:
1. Bootcamp Intensif - Full-stack Development, Mobile Development, Data Science, Gen AI Engineering
2. Study Group - Peer Learning, Code Review, Project Collaboration
3. Workshop & Seminar - Topik teknologi terkini
4. Event & Competition - Kompetisi programming dan hackathon

Klaim Sertifikat:
- Kamu bisa klaim sertifikat DCN Unira di: https://dcnunira.dev/sertifikat/klaim
- Link singkat: https://a.dcnunira.dev/sertifikat
- Jika ditanya tentang cara klaim sertifikat, berikan kedua link di atas

Social Media DCN Unira:
- Instagram: https://instagram.com/dcn.unira

Tugas kamu:
- Jawab pertanyaan tentang DCN Unira dengan ramah dan informatif
- Bantu pengunjung yang ingin bergabung atau tahu lebih lanjut
- Gunakan bahasa Indonesia yang santai tapi profesional
- Jika ditanya hal di luar DCN Unira, arahkan kembali ke topik komunitas
- Berikan informasi yang akurat dan jelas

Jawab dengan singkat dan to the point (maksimal 3-4 kalimat).`;

interface CacheData {
    teamText: string;
    eventsText: string;
    blogsText: string;
}

let contextCache: {
    data: CacheData;
    timestamp: number;
} | null = null;

const CACHE_TTL = 5 * 60 * 1000; // Cache data for 5 minutes

async function getDynamicContext(): Promise<CacheData> {
    const now = Date.now();
    if (contextCache && (now - contextCache.timestamp < CACHE_TTL)) {
        return contextCache.data;
    }

    try {
        const [{ data: team }, { data: events }, { data: blogs }] = await Promise.all([
            supabase
                .from("admins")
                .select("nama, role, label, bio, is_active")
                .eq("is_active", true)
                .order("created_at", { ascending: true }),
            supabase
                .from("events")
                .select("judul, deskripsi, tanggal, lokasi, tipe, slug")
                .eq("is_published", true)
                .order("tanggal", { ascending: false })
                .limit(5),
            supabase
                .from("blog_posts")
                .select("judul, excerpt, slug")
                .eq("status", "published")
                .order("created_at", { ascending: false })
                .limit(5),
        ]);

        const teamText = team && team.length > 0
            ? team.map(t => `- ${t.nama} (${t.label || t.role || "Core Team"})${t.bio ? `: ${t.bio}` : ""}`).join("\n")
            : "Data core team belum tersedia.";

        const eventsText = events && events.length > 0
            ? events.map(e => {
                const dateStr = e.tanggal
                    ? new Date(e.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    })
                    : "-";
                return `- ${e.judul} (${e.tipe || "Event"})\n  Tanggal: ${dateStr}\n  Lokasi: ${e.lokasi || "Online/Offline"}\n  Deskripsi: ${e.deskripsi || "-"}\n  Link: https://dcnunira.dev/event/${e.slug}`;
            }).join("\n\n")
            : "Belum ada event yang dipublikasikan.";

        const blogsText = blogs && blogs.length > 0
            ? blogs.map(b => `- ${b.judul}\n  Ringkasan: ${b.excerpt || "-"}\n  Link: https://dcnunira.dev/blog/${b.slug}`).join("\n\n")
            : "Belum ada artikel blog yang dipublikasikan.";

        const data: CacheData = { teamText, eventsText, blogsText };
        contextCache = { data, timestamp: now };
        return data;
    } catch (error) {
        console.error("Error fetching dynamic context from Supabase:", error);
        // Fallback to expired cache if available
        if (contextCache) {
            return contextCache.data;
        }
        return {
            teamText: "Data core team tidak dapat dimuat saat ini.",
            eventsText: "Data event tidak dapat dimuat saat ini.",
            blogsText: "Data artikel blog tidak dapat dimuat saat ini."
        };
    }
}

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Fetch dynamic context with in-memory caching
        const { teamText, eventsText, blogsText } = await getDynamicContext();

        const dynamicSystemContext = `${SYSTEM_CONTEXT}

Berikut adalah Informasi Terbaru & Real-time DCN Unira:

Core Team / Pengurus Aktif DCN Unira:
${teamText}

Daftar Event DCN Unira Terbaru:
${eventsText}

Daftar Artikel Blog DCN Unira Terbaru:
${blogsText}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: dynamicSystemContext }],
                },
                {
                    role: "model",
                    parts: [{ text: "Baik, saya siap membantu sebagai asisten virtual DCN Unira!" }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Failed to process chat message", response: "Maaf, terjadi kesalahan. Silakan coba lagi nanti." },
            { status: 500 }
        );
    }
}
