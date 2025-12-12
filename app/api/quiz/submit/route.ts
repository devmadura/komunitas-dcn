import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, nama_peserta, jawaban } = body;

    if (!session_id || !nama_peserta || !jawaban) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Get session and verify it's still valid
    const { data: session, error: sessionError } = await supabase
      .from("quiz_sessions")
      .select("*, quiz:quiz_id(id)")
      .eq("id", session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Session tidak valid" },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Link kuis sudah kadaluarsa" },
        { status: 410 }
      );
    }

    // Check if same person already submitted (by name)
    const { data: existingSubmission } = await supabase
      .from("quiz_submissions")
      .select("id")
      .eq("session_id", session_id)
      .eq("nama_peserta", nama_peserta)
      .single();

    if (existingSubmission) {
      return NextResponse.json(
        { error: "Anda sudah pernah mengerjakan kuis ini" },
        { status: 403 }
      );
    }

    // Get questions with correct answers
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select("id, jawaban_benar")
      .eq("quiz_id", session.quiz.id);

    if (questionsError || !questions) {
      return NextResponse.json(
        { error: "Gagal mengambil soal" },
        { status: 500 }
      );
    }

    // Calculate score
    let skor = 0;
    const totalSoal = questions.length;

    questions.forEach((q) => {
      if (jawaban[q.id] === q.jawaban_benar) {
        skor++;
      }
    });

    // Calculate poin based on wrong answers
    const salah = totalSoal - skor;
    let poin = 20; // Default: lebih dari 1 salah
    if (salah === 0) {
      poin = 30; // Semua benar
    } else if (salah === 1) {
      poin = 25; // 1 salah
    }

    // Find kontributor by nama_peserta and update total_poin
    const { data: kontributor } = await supabase
      .from("kontributor")
      .select("id, total_poin")
      .ilike("nama", nama_peserta)
      .single();

    if (kontributor) {
      await supabase
        .from("kontributor")
        .update({ total_poin: kontributor.total_poin + poin })
        .eq("id", kontributor.id);
    }

    // Save submission with poin
    const { error: submitError } = await supabase
      .from("quiz_submissions")
      .insert([
        {
          session_id,
          nama_peserta,
          jawaban,
          skor,
          total_soal: totalSoal,
          poin,
        },
      ])
      .select()
      .single();

    if (submitError) throw submitError;

    return NextResponse.json({
      success: true,
      skor,
      total_soal: totalSoal,
      persentase: Math.round((skor / totalSoal) * 100),
      poin,
      kontributor_updated: !!kontributor,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Gagal submit jawaban" },
      { status: 500 }
    );
  }
}
