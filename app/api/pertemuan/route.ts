import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission } from "@/lib/auth";
import { logActivity } from "@/lib/axiom";
import { PERMISSIONS } from "@/lib/permissions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shouldCount = searchParams.get("count");
  if (shouldCount === "true") {
    const { count, error } = await supabase
      .from("pertemuan")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ total: count });
  }

  // Cek permission
  const authResult = await requirePermission(PERMISSIONS.ABSENSI);
  if ("error" in authResult) return authResult.error;

  const { data, error } = await supabase
    .from("pertemuan")
    .select("*")
    .order("tanggal", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  // Cek permission
  const authResult = await requirePermission(PERMISSIONS.ABSENSI);
  if ("error" in authResult) return authResult.error;
  const { admin } = authResult;

  const body = await request.json();

  const { data, error } = await supabase
    .from("pertemuan")
    .insert([body])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log activity
  if (data && data[0]) {
    await logActivity(
      "create_pertemuan",
      admin.email,
      `Membuat pertemuan baru: ${data[0].judul}`,
      { pertemuan_id: data[0].id },
      admin.nama
    );
  }

  return NextResponse.json(data);
}
