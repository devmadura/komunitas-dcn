"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Award,
  CheckCircle,
  Clock,
  FileText,
  Mail,
} from "lucide-react";
import { generateSertifikatPDF } from "@/lib/generateSertifikat";
import { toast } from "@/hooks/use-toast";

interface Pertemuan {
  id: string;
  judul: string;
  tanggal: string;
  claimed: boolean;
  sertifikat?: {
    nomor_sertifikat: string;
    tanggal_terbit: string;
  };
}

interface Kontributor {
  id: string;
  nama: string;
  email: string;
}

interface EligibilityData {
  kontributor: Kontributor;
  pertemuan: Pertemuan[];
  quiz: {
    total: number;
    eligible: boolean;
    claimed: boolean;
    sertifikat?: {
      nomor_sertifikat: string;
      tanggal_terbit: string;
    };
  };
}

export default function KlaimSertifikatPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [data, setData] = useState<EligibilityData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!email.trim()) return;

    setSearching(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/sertifikat?email=${encodeURIComponent(email)}`
      );
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Terjadi kesalahan");
        return;
      }

      setData(result);
    } catch {
      setError("Gagal mencari data");
    } finally {
      setSearching(false);
    }
  };

  const handleDownloadPertemuan = async (pertemuan: Pertemuan) => {
    if (!data) return;

    setClaimingId(pertemuan.id);
    setLoading(true);

    try {
      // Jika sudah pernah diklaim, langsung download ulang
      if (pertemuan.claimed && pertemuan.sertifikat) {
        try {
          await generateSertifikatPDF({
            nomor: pertemuan.sertifikat.nomor_sertifikat,
            nama: data.kontributor.nama,
            tipe: "pertemuan",
            pertemuanJudul: pertemuan.judul,
            pertemuanTanggal: pertemuan.tanggal,
            tanggalTerbit: pertemuan.sertifikat.tanggal_terbit,
          });
        } catch (pdfError) {
          console.error("PDF Error:", pdfError);
          toast({
            title: "Gagal generate PDF. Silakan coba lagi.",
            variant: "destructive",
          });
        }
        return;
      }

      // Jika belum, buat sertifikat baru
      const res = await fetch("/api/sertifikat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kontributor_id: data.kontributor.id,
          tipe: "pertemuan",
          pertemuan_id: pertemuan.id,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: result.error || "Gagal klaim sertifikat",
          variant: "destructive",
        });
        return;
      }

      try {
        await generateSertifikatPDF({
          nomor: result.nomor_sertifikat,
          nama: data.kontributor.nama,
          tipe: "pertemuan",
          pertemuanJudul: pertemuan.judul,
          pertemuanTanggal: pertemuan.tanggal,
          tanggalTerbit: result.tanggal_terbit,
        });
      } catch (pdfError) {
        console.error("PDF Error:", pdfError);
        toast({
          title:
            "Sertifikat tersimpan tapi gagal download. Coba download ulang.",
          variant: "destructive",
        });
      }

      // Update state
      setData({
        ...data,
        pertemuan: data.pertemuan.map((p) =>
          p.id === pertemuan.id
            ? {
                ...p,
                claimed: true,
                sertifikat: {
                  nomor_sertifikat: result.nomor_sertifikat,
                  tanggal_terbit: result.tanggal_terbit,
                },
              }
            : p
        ),
      });
    } catch {
      toast({ title: "Gagal mengunduh sertifikat", variant: "destructive" });
    } finally {
      setLoading(false);
      setClaimingId(null);
    }
  };

  const handleDownloadQuiz = async () => {
    if (!data) return;

    setClaimingId("quiz");
    setLoading(true);

    try {
      // Jika sudah pernah diklaim, langsung download ulang
      if (data.quiz.claimed && data.quiz.sertifikat) {
        try {
          await generateSertifikatPDF({
            nomor: data.quiz.sertifikat.nomor_sertifikat,
            nama: data.kontributor.nama,
            tipe: "quiz",
            tanggalTerbit: data.quiz.sertifikat.tanggal_terbit,
          });
        } catch (pdfError) {
          console.error("PDF Error:", pdfError);
          toast({
            title: "Gagal generate PDF. Silakan coba lagi.",
            variant: "destructive",
          });
        }
        return;
      }

      // Jika belum, buat sertifikat baru
      const res = await fetch("/api/sertifikat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kontributor_id: data.kontributor.id,
          tipe: "quiz",
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: result.error || "Gagal klaim sertifikat",
          variant: "destructive",
        });
        return;
      }

      try {
        await generateSertifikatPDF({
          nomor: result.nomor_sertifikat,
          nama: data.kontributor.nama,
          tipe: "quiz",
          tanggalTerbit: result.tanggal_terbit,
        });
      } catch (pdfError) {
        console.error("PDF Error:", pdfError);
        toast({
          title:
            "Sertifikat tersimpan tapi gagal download. Coba download ulang.",
          variant: "destructive",
        });
      }

      // Update state
      setData({
        ...data,
        quiz: {
          ...data.quiz,
          claimed: true,
          sertifikat: {
            nomor_sertifikat: result.nomor_sertifikat,
            tanggal_terbit: result.tanggal_terbit,
          },
        },
      });
    } catch {
      toast({ title: "Gagal mengunduh sertifikat", variant: "destructive" });
    } finally {
      setLoading(false);
      setClaimingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 pt-32">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Award className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Klaim Sertifikat
          </h1>
          <p className="text-muted-foreground">
            Masukkan email Anda untuk melihat sertifikat yang tersedia
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-card rounded-xl shadow-lg p-6 mb-6 border border-border">
          <label className="block text-sm font-medium text-foreground mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Masukkan email Anda..."
              className="flex-1 px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !email.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {searching ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Cari
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {data.kontributor.nama.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {data.kontributor.nama}
                  </h2>
                  <p className="text-muted-foreground">
                    {data.kontributor.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Sertifikat Pertemuan */}
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-foreground">
                  Sertifikat Event/Pertemuan
                </h3>
              </div>

              {data.pertemuan.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Anda belum mengikuti event apapun
                </p>
              ) : (
                <div className="space-y-3">
                  {data.pertemuan.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">{p.judul}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(p.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        {p.claimed && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                            <CheckCircle className="w-3 h-3" />
                            Sudah diklaim
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDownloadPertemuan(p)}
                        disabled={loading && claimingId === p.id}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {loading && claimingId === p.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        {p.claimed ? "Download Ulang" : "Download"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sertifikat Quiz */}
            <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-foreground">
                  Sertifikat Quiz
                </h3>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-foreground">Progress Quiz</span>
                  <span className="font-bold text-foreground">
                    {data.quiz.total} / 5
                  </span>
                </div>

                <div className="w-full bg-muted rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      data.quiz.eligible ? "bg-green-500" : "bg-indigo-600"
                    }`}
                    style={{
                      width: `${Math.min((data.quiz.total / 5) * 100, 100)}%`,
                    }}
                  />
                </div>

                {data.quiz.eligible ? (
                  <div className="space-y-3">
                    {data.quiz.claimed && (
                      <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Sertifikat sudah diklaim</span>
                      </div>
                    )}
                    <button
                      onClick={handleDownloadQuiz}
                      disabled={loading && claimingId === "quiz"}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading && claimingId === "quiz" ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                      {data.quiz.claimed
                        ? "Download Ulang Sertifikat"
                        : "Download Sertifikat Quiz"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span>
                      Ikuti {5 - data.quiz.total} quiz lagi untuk unlock
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
