import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Cek eligibility sertifikat berdasarkan email
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email diperlukan" }, { status: 400 });
  }

  try {
    // Cari kontributor berdasarkan email
    const { data: kontributor, error: kontributorError } = await supabase
      .from("kontributor")
      .select("*")
      .ilike("email", email.trim())
      .single();

    if (kontributorError || !kontributor) {
      return NextResponse.json(
        { error: "Email tidak terdaftar sebagai kontributor" },
        { status: 404 }
      );
    }

    // Ambil data absensi (untuk sertifikat pertemuan)
    const { data: absensi, error: absensiError } = await supabase
      .from("absensi")
      .select(`*, pertemuan (*)`)
      .eq("kontributor_id", kontributor.id)
      .eq("status", "hadir");

    if (absensiError) throw absensiError;

    // Ambil data quiz submissions berdasarkan email
    const { data: quizSubmissions, error: quizError } = await supabase
      .from("quiz_submissions")
      .select("*")
      .ilike("nama_peserta", `%${kontributor.nama}%`);

    if (quizError) throw quizError;

    // Ambil sertifikat yang sudah diklaim
    const { data: claimedCerts, error: claimedError } = await supabase
      .from("sertifikat")
      .select("*")
      .eq("kontributor_id", kontributor.id);

    if (claimedError && claimedError.code !== "PGRST116") {
      console.log("Sertifikat table may not exist yet");
    }

    // Format response - hanya tampilkan pertemuan yang has_sertifikat = true
    const pertemuanHadir =
      absensi
        ?.filter((a) => a.pertemuan?.has_sertifikat === true)
        .map((a) => {
          const claimedCert = claimedCerts?.find(
            (c) => c.tipe === "pertemuan" && c.pertemuan_id === a.pertemuan_id
          );
          return {
            id: a.pertemuan_id,
            judul: a.pertemuan?.judul,
            tanggal: a.pertemuan?.tanggal,
            claimed: !!claimedCert,
            sertifikat: claimedCert
              ? {
                  nomor_sertifikat: claimedCert.nomor_sertifikat,
                  tanggal_terbit: claimedCert.tanggal_terbit,
                }
              : undefined,
          };
        }) || [];

    const quizCount = quizSubmissions?.length || 0;
    const quizEligible = quizCount >= 5;
    const quizCert = claimedCerts?.find((c) => c.tipe === "quiz");

    return NextResponse.json({
      kontributor: {
        id: kontributor.id,
        nama: kontributor.nama,
        email: kontributor.email,
      },
      pertemuan: pertemuanHadir,
      quiz: {
        total: quizCount,
        eligible: quizEligible,
        claimed: !!quizCert,
        sertifikat: quizCert
          ? {
              nomor_sertifikat: quizCert.nomor_sertifikat,
              tanggal_terbit: quizCert.tanggal_terbit,
            }
          : undefined,
      },
    });
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return NextResponse.json(
      { error: "Gagal mengecek eligibility" },
      { status: 500 }
    );
  }
}

// POST - Generate sertifikat baru (hanya jika belum ada)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kontributor_id, tipe, pertemuan_id } = body;

    if (!kontributor_id || !tipe) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // Cek apakah sudah pernah klaim
    let checkQuery = supabase
      .from("sertifikat")
      .select("*")
      .eq("kontributor_id", kontributor_id)
      .eq("tipe", tipe);

    if (pertemuan_id) {
      checkQuery = checkQuery.eq("pertemuan_id", pertemuan_id);
    }

    const { data: existing } = await checkQuery;

    // Jika sudah ada, kembalikan sertifikat yang sudah ada (untuk re-download)
    if (existing && existing.length > 0) {
      return NextResponse.json(existing[0]);
    }

    // Generate nomor sertifikat baru
    const tahun = new Date().getFullYear();
    const prefix = tipe === "pertemuan" ? "PTM" : "QUZ";
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const nomor_sertifikat = `DCN-${prefix}-${tahun}-${random}`;

    // Insert sertifikat baru
    const insertData: Record<string, unknown> = {
      kontributor_id,
      nomor_sertifikat,
      tipe,
      tanggal_terbit: new Date().toISOString(),
    };

    if (pertemuan_id) {
      insertData.pertemuan_id = pertemuan_id;
    }

    const { data: sertifikat, error } = await supabase
      .from("sertifikat")
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(sertifikat);
  } catch (error) {
    console.error("Error generating sertifikat:", error);
    return NextResponse.json(
      { error: "Gagal membuat sertifikat" },
      { status: 500 }
    );
  }
}
