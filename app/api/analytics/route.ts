import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Ambil semua data absensi dengan relasi
    const { data: absensi, error: absensiError } = await supabase
      .from("absensi")
      .select(`*, pertemuan (*), kontributor (*)`)
      .order("created_at", { ascending: true });

    if (absensiError) throw absensiError;

    // Ambil data quiz submissions
    const { data: quizSubmissions, error: quizError } = await supabase
      .from("quiz_submissions")
      .select("*")
      .order("submitted_at", { ascending: true });

    if (quizError) throw quizError;

    // Proses data kehadiran per bulan
    const monthlyAttendance: Record<string, { hadir: number; izin: number; alpha: number }> = {};

    absensi?.forEach((a) => {
      const date = new Date(a.pertemuan?.tanggal || a.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyAttendance[monthKey]) {
        monthlyAttendance[monthKey] = { hadir: 0, izin: 0, alpha: 0 };
      }

      if (a.status === "hadir") monthlyAttendance[monthKey].hadir++;
      else if (a.status === "izin") monthlyAttendance[monthKey].izin++;
      else if (a.status === "alpha") monthlyAttendance[monthKey].alpha++;
    });

    // Format untuk chart
    const attendanceData = Object.entries(monthlyAttendance)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: formatMonth(month),
        monthKey: month,
        ...data,
        total: data.hadir + data.izin + data.alpha,
      }));

    // Proses data quiz per bulan
    const monthlyQuiz: Record<string, { totalSkor: number; count: number }> = {};

    quizSubmissions?.forEach((q) => {
      const date = new Date(q.submitted_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyQuiz[monthKey]) {
        monthlyQuiz[monthKey] = { totalSkor: 0, count: 0 };
      }

      const persentase = q.total_soal > 0 ? (q.skor / q.total_soal) * 100 : 0;
      monthlyQuiz[monthKey].totalSkor += persentase;
      monthlyQuiz[monthKey].count++;
    });

    const quizData = Object.entries(monthlyQuiz)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month: formatMonth(month),
        monthKey: month,
        avgScore: Math.round(data.totalSkor / data.count),
        totalSubmissions: data.count,
      }));

    // Total keseluruhan
    const totalStats = {
      hadir: absensi?.filter((a) => a.status === "hadir").length || 0,
      izin: absensi?.filter((a) => a.status === "izin").length || 0,
      alpha: absensi?.filter((a) => a.status === "alpha").length || 0,
      totalQuiz: quizSubmissions?.length || 0,
    };

    return NextResponse.json({
      attendanceData,
      quizData,
      totalStats,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data analytics" },
      { status: 500 }
    );
  }
}

function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}
