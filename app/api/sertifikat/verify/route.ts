import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nomor = searchParams.get("nomor");

  if (!nomor) {
    return NextResponse.json(
      { error: "Nomor sertifikat diperlukan" },
      { status: 400 }
    );
  }

  try {
    const { data: sertifikat, error } = await supabase
      .from("sertifikat")
      .select(`*, kontributor (*), pertemuan (*)`)
      .eq("nomor_sertifikat", nomor)
      .single();

    if (error || !sertifikat) {
      return NextResponse.json(
        { valid: false, error: "Sertifikat tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      sertifikat: {
        nomor: sertifikat.nomor_sertifikat,
        tipe: sertifikat.tipe,
        tanggal_terbit: sertifikat.tanggal_terbit,
        penerima: sertifikat.kontributor?.nama,
        nim: sertifikat.kontributor?.nim,
        pertemuan: sertifikat.pertemuan?.judul,
      },
    });
  } catch (error) {
    console.error("Error verifying:", error);
    return NextResponse.json(
      { valid: false, error: "Gagal verifikasi" },
      { status: 500 }
    );
  }
}
