import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission } from "@/lib/auth";
import { logActivity } from "@/lib/axiom";
import { PERMISSIONS } from "@/lib/permissions";

export async function GET() {
  try {
    // Cek permission
    const authResult = await requirePermission(PERMISSIONS.QUIZ);
    if ("error" in authResult) return authResult.error;

    const { data, error } = await supabase
      .from("quiz")
      .select("*, quiz_questions(count)")
      .order("created_at", { ascending: false });

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

export async function POST(request: Request) {
  try {
    // Cek permission
    const authResult = await requirePermission(PERMISSIONS.QUIZ);
    if ("error" in authResult) return authResult.error;
    const { admin } = authResult;

    const body = await request.json();
    const { judul, deskripsi } = body;

    if (!judul) {
      return NextResponse.json(
        { error: "Judul kuis wajib diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("quiz")
      .insert([{ judul, deskripsi }])
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logActivity(
      "create_quiz",
      admin.email,
      `Membuat kuis baru: ${judul}`,
      { quiz_id: data.id },
      admin.nama
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Gagal membuat kuis" },
      { status: 500 }
    );
  }
}
