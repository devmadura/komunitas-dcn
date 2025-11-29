import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
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

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Gagal membuat kuis" },
      { status: 500 }
    );
  }
}
