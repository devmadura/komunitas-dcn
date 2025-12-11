import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission } from "@/lib/auth";
import { logActivity } from "@/lib/axiom";
import { PERMISSIONS } from "@/lib/permissions";

export async function GET() {
  const authResult = await requirePermission(PERMISSIONS.CODE_REDEEM);
  if ("error" in authResult) return authResult.error;

  const { data, error } = await supabase
    .from("code_redeem")
    .select(`
      *,
      code_redeem_usage (
        id,
        kontributor_id,
        redeemed_at
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const authResult = await requirePermission(PERMISSIONS.CODE_REDEEM);
  if ("error" in authResult) return authResult.error;
  const { admin } = authResult;

  const body = await request.json();
  const { code, poin, max_usage, expires_at } = body;

  if (!code || !poin || !max_usage) {
    return NextResponse.json(
      { error: "Code, poin, dan max_usage harus diisi" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("code_redeem")
    .select("id")
    .eq("code", code.toUpperCase())
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Code sudah digunakan" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("code_redeem")
    .insert([
      {
        code: code.toUpperCase(),
        poin: Number(poin),
        max_usage: Number(max_usage),
        expires_at: expires_at || null,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity(
    "create_code_redeem",
    admin.email,
    `Membuat code redeem: ${code.toUpperCase()} (${poin} poin, max ${max_usage} orang)`,
    { code_id: data.id, code: code.toUpperCase(), poin, max_usage },
    admin.nama
  );

  return NextResponse.json(data);
}
