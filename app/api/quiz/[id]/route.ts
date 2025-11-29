import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("quiz")
      .select("*, quiz_questions(*)")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kuis" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { judul, deskripsi } = body;

    const { data, error } = await supabase
      .from("quiz")
      .update({ judul, deskripsi })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate kuis" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get all sessions for this quiz
    const { data: sessions } = await supabase
      .from("quiz_sessions")
      .select("id")
      .eq("quiz_id", id);

    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map((s) => s.id);

      // Delete all submissions for these sessions
      const { error: submissionsError } = await supabase
        .from("quiz_submissions")
        .delete()
        .in("session_id", sessionIds);

      if (submissionsError) {
        console.error("Error deleting submissions:", submissionsError);
      }

      // Delete all sessions for this quiz
      const { error: sessionsError } = await supabase
        .from("quiz_sessions")
        .delete()
        .eq("quiz_id", id);

      if (sessionsError) {
        console.error("Error deleting sessions:", sessionsError);
      }
    }

    // Delete all questions for this quiz
    const { error: questionsError } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("quiz_id", id);

    if (questionsError) {
      console.error("Error deleting questions:", questionsError);
    }

    // Finally delete the quiz
    const { error } = await supabase.from("quiz").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Kuis berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kuis" },
      { status: 500 }
    );
  }
}
