import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission } from "@/lib/auth";
import { logActivity } from "@/lib/axiom";
import { PERMISSIONS } from "@/lib/permissions";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission(PERMISSIONS.CODE_REDEEM);
  if ("error" in authResult) return authResult.error;
  const { admin } = authResult;

  const { id } = await params;

  const { data: codeData } = await supabase
    .from("code_redeem")
    .select("code")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("code_redeem")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity(
    "delete_code_redeem",
    admin.email,
    `Menghapus code redeem: ${codeData?.code || id}`,
    { code_id: id },
    admin.nama
  );

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requirePermission(PERMISSIONS.CODE_REDEEM);
  if ("error" in authResult) return authResult.error;
  const { admin } = authResult;

  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("code_redeem")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity(
    "update_code_redeem",
    admin.email,
    `Mengupdate code redeem: ${data.code}`,
    { code_id: id, updates: body },
    admin.nama
  );

  return NextResponse.json(data);
}
