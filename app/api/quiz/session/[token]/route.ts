import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Get session with quiz and questions
    const { data: session, error: sessionError } = await supabase
      .from("quiz_sessions")
      .select(`
        *,
        quiz:quiz_id (
          id,
          judul,
          deskripsi,
          quiz_questions (
            id,
            pertanyaan,
            opsi_a,
            opsi_b,
            opsi_c,
            opsi_d,
            urutan
          )
        )
      `)
      .eq("token", token)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Link kuis tidak valid" },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Link kuis sudah kadaluarsa", expired: true },
        { status: 410 }
      );
    }

    // Check if already submitted
    const { data: existingSubmission } = await supabase
      .from("quiz_submissions")
      .select("id")
      .eq("session_id", session.id)
      .single();

    if (existingSubmission) {
      return NextResponse.json(
        { error: "Kuis ini sudah pernah dikerjakan", already_submitted: true },
        { status: 403 }
      );
    }

    // Sort questions and remove answer key
    const quiz = session.quiz;
    if (quiz?.quiz_questions) {
      quiz.quiz_questions.sort((a: { urutan: number }, b: { urutan: number }) => a.urutan - b.urutan);
    }

    return NextResponse.json({
      session_id: session.id,
      expires_at: session.expires_at,
      quiz,
    });
  } catch (error) {
    console.error("Error validating session:", error);
    return NextResponse.json(
      { error: "Gagal memvalidasi link kuis" },
      { status: 500 }
    );
  }
}
