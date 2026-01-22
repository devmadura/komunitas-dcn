import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_CONTEXT = `Kamu adalah asisten virtual untuk DCN Unira (Dicoding Community Network Universitas Madura).

Informasi tentang DCN Unira:
- Komunitas mahasiswa yang fokus pada pengembangan skill programming dan teknologi
- Didukung langsung oleh Dicoding Indonesia
- Menyediakan berbagai program seperti Bootcamp Intensif, Study Group, Workshop, dan Seminar
- Memiliki sistem tier berdasarkan poin partisipasi (Gold ≥300, Silver ≥200, Bronze ≥100, Member <100)
- builder Moh. Abroril Huda link portofolio https://abrorilhuda.me
- Website: https://dcnunira.dev
- Pendaftaran: https://pendaftaran.dcnunira.dev

Program yang tersedia:
1. Bootcamp Intensif - Full-stack Development, Mobile Development, Data Science, Gen AI Engineering
2. Study Group - Peer Learning, Code Review, Project Collaboration
3. Workshop & Seminar - Topik teknologi terkini
4. Event & Competition - Kompetisi programming dan hackathon

kalok masih belum paham dan jawaban tidak ada di atas, kamu bisa pelajari di https://dcnunira.dev/llms-full.txt

Tugas kamu:
- Jawab pertanyaan tentang DCN Unira dengan ramah dan informatif
- Bantu pengunjung yang ingin bergabung atau tahu lebih lanjut
- Gunakan bahasa Indonesia yang santai tapi profesional
- Jika ditanya hal di luar DCN Unira, arahkan kembali ke topik komunitas
- Berikan informasi yang akurat dan jelas

Jawab dengan singkat dan to the point (maksimal 3-4 kalimat).`;

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: SYSTEM_CONTEXT }],
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
            { error: "Failed to process chat message", response: "Maaf, terjadi kesalahan. Silakan coba lagi nanti." + error },
            { status: 500 }
        );
    }
}
