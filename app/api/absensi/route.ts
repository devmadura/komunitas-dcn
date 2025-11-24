import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface AbsensiItem {
  kontributor_id: string;
  status: string;
  poin: number;
  keterangan?: string;
}

export async function GET(request: Request) {
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
  const body = await request.json();

  // body expected format: { pertemuan_id, absensi: [{kontributor_id, status, poin, keterangan}] }
  const absensiRecords = body.absensi.map((item: AbsensiItem) => ({
    pertemuan_id: body.pertemuan_id,
    ...item,
  }));

  const { data, error } = await supabase
    .from("absensi")
    .insert(absensiRecords)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
