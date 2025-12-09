import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission } from "@/lib/auth";
import { logActivity } from "@/lib/axiom";
import { PERMISSIONS } from "@/lib/permissions";

interface AbsensiItem {
  kontributor_id: string;
  status: string;
  poin: number;
  keterangan?: string;
}

export async function GET(request: Request) {
  // Cek permission
  const authResult = await requirePermission(PERMISSIONS.ABSENSI);
  if ("error" in authResult) return authResult.error;

  const { searchParams } = new URL(request.url);
  const pertemuan_id = searchParams.get("pertemuan_id");

  let query = supabase.from("absensi").select(`
      *,
      kontributor (*),
      pertemuan (*)
    `);

  if (pertemuan_id) {
    query = query.eq("pertemuan_id", pertemuan_id);
  }

  const { data, error } = await query;

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

  // body expected format: { pertemuan_id, absensi: [{kontributor_id, status, poin, keterangan}] }
  const absensiRecords = body.absensi.map((item: AbsensiItem) => ({
    pertemuan_id: body.pertemuan_id,
    ...item,
  }));

  // Upsert: update jika sudah ada, insert jika belum
  const { data, error } = await supabase
    .from("absensi")
    .upsert(absensiRecords, {
      onConflict: "pertemuan_id,kontributor_id",
      ignoreDuplicates: false,
    })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log activity
  // Get pertemuan info for logging
  const { data: pertemuan } = await supabase
    .from("pertemuan")
    .select("judul")
    .eq("id", body.pertemuan_id)
    .single();

  await logActivity(
    "create_absensi",
    admin.email,
    `Menyimpan absensi untuk pertemuan: ${pertemuan?.judul || body.pertemuan_id} (${absensiRecords.length} orang)`,
    { pertemuan_id: body.pertemuan_id, total: absensiRecords.length },
    admin.nama
  );

  return NextResponse.json(data);
}
