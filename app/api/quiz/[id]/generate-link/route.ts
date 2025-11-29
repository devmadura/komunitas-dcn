import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Check for active session
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get the base URL from request headers
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    // Check for existing active session (not expired and not submitted)
    const { data: activeSession } = await supabase
      .from("quiz_sessions")
      .select("*, quiz_submissions(id)")
      .eq("quiz_id", id)
      .gt("expires_at", new Date().toISOString())
      .order("expires_at", { ascending: false })
      .limit(1)
      .single();

    if (activeSession && !activeSession.quiz_submissions?.length) {
      const quizUrl = `${protocol}://${host}/quiz/${activeSession.token}`;
      return NextResponse.json({
        ...activeSession,
        url: quizUrl,
        is_active: true,
      });
    }

    return NextResponse.json({ is_active: false });
  } catch (error) {
    return NextResponse.json({ is_active: false });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Generate random token
    const token = crypto.randomUUID().replace(/-/g, "");

    // Set expiry to 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("quiz_sessions")
      .insert([
        {
          quiz_id: id,
          token,
          expires_at: expiresAt,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Get the base URL from request headers
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const quizUrl = `${protocol}://${host}/quiz/${token}`;

    return NextResponse.json({
      ...data,
      url: quizUrl,
    });
  } catch (error) {
    console.error("Error generating link:", error);
    return NextResponse.json(
      { error: "Gagal generate link kuis" },
      { status: 500 }
    );
  }
}
