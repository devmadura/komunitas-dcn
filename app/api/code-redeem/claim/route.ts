import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = await request.json();
  const { code, nim } = body;

  if (!code || !nim) {
    return NextResponse.json(
      { error: "Code dan NIM harus diisi" },
      { status: 400 }
    );
  }

  const { data: kontributor, error: kontributorError } = await supabase
    .from("kontributor")
    .select("id, nama, total_poin")
    .eq("nim", nim)
    .single();

  if (kontributorError || !kontributor) {
    return NextResponse.json(
      { error: "NIM tidak terdaftar dalam sistem" },
      { status: 404 }
    );
  }

  const { data: codeData, error: codeError } = await supabase
    .from("code_redeem")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (codeError || !codeData) {
    return NextResponse.json(
      { error: "Code tidak valid" },
      { status: 404 }
    );
  }

  if (!codeData.is_active) {
    return NextResponse.json(
      { error: "Code sudah tidak aktif" },
      { status: 400 }
    );
  }

  if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Code sudah expired" },
      { status: 400 }
    );
  }

  if (codeData.current_usage >= codeData.max_usage) {
    return NextResponse.json(
      { error: "Kuota code sudah habis" },
      { status: 400 }
    );
  }

  const { data: existingUsage } = await supabase
    .from("code_redeem_usage")
    .select("id")
    .eq("code_id", codeData.id)
    .eq("kontributor_id", kontributor.id)
    .single();

  if (existingUsage) {
    return NextResponse.json(
      { error: "Anda sudah pernah menggunakan code ini" },
      { status: 400 }
    );
  }

  const { error: usageError } = await supabase
    .from("code_redeem_usage")
    .insert([
      {
        code_id: codeData.id,
        kontributor_id: kontributor.id,
      },
    ]);

  if (usageError) {
    return NextResponse.json({ error: usageError.message }, { status: 500 });
  }

  const { error: updateCodeError } = await supabase
    .from("code_redeem")
    .update({ current_usage: codeData.current_usage + 1 })
    .eq("id", codeData.id);

  if (updateCodeError) {
    return NextResponse.json({ error: updateCodeError.message }, { status: 500 });
  }

  const newTotalPoin = kontributor.total_poin + codeData.poin;
  const { error: updatePoinError } = await supabase
    .from("kontributor")
    .update({ total_poin: newTotalPoin })
    .eq("id", kontributor.id);

  if (updatePoinError) {
    return NextResponse.json({ error: updatePoinError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: `Selamat ${kontributor.nama}! Anda berhasil mendapatkan ${codeData.poin} poin.`,
    data: {
      nama: kontributor.nama,
      poin_didapat: codeData.poin,
      total_poin: newTotalPoin,
    },
  });
}
