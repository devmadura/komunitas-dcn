import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get all sessions for this quiz with their submissions
    const { data: sessions, error } = await supabase
      .from("quiz_sessions")
      .select(`
        id,
        token,
        expires_at,
        created_at,
        quiz_submissions (
          id,
          nama_peserta,
          skor,
          total_soal,
          submitted_at
        )
      `)
      .eq("quiz_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Flatten submissions with session info
    const submissions = sessions?.flatMap((session) =>
      (session.quiz_submissions || []).map((sub: {
        id: string;
        nama_peserta: string;
        skor: number;
        total_soal: number;
        submitted_at: string;
      }) => ({
        ...sub,
        session_token: session.token,
        session_expires_at: session.expires_at,
      }))
    ) || [];

    // Sort by submitted_at descending
    submissions.sort((a, b) => 
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data submission" },
      { status: 500 }
    );
  }
}
