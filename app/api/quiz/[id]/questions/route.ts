import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("quiz_questions")
      .select("*")
      .eq("quiz_id", id)
      .order("urutan", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Gagal mengambil soal" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar, urutan } = body;

    if (!pertanyaan || !opsi_a || !opsi_b || !opsi_c || !opsi_d || !jawaban_benar) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("quiz_questions")
      .insert([
        {
          quiz_id: id,
          pertanyaan,
          opsi_a,
          opsi_b,
          opsi_c,
          opsi_d,
          jawaban_benar,
          urutan: urutan || 1,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Gagal membuat soal" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params;
    const body = await request.json();
    const { questionId, pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar, urutan } = body;

    const { data, error } = await supabase
      .from("quiz_questions")
      .update({ pertanyaan, opsi_a, opsi_b, opsi_c, opsi_d, jawaban_benar, urutan })
      .eq("id", questionId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate soal" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        { error: "ID soal wajib diisi" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("id", questionId);

    if (error) throw error;

    return NextResponse.json({ message: "Soal berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Gagal menghapus soal" },
      { status: 500 }
    );
  }
}
