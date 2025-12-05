"use client";

import { useState, useEffect, use } from "react";
import { CheckCircle, XCircle, Award, Loader2 } from "lucide-react";

interface VerifyData {
  valid: boolean;
  sertifikat?: {
    nomor: string;
    tipe: "pertemuan" | "quiz";
    tanggal_terbit: string;
    penerima: string;
    pertemuan?: string;
  };
  error?: string;
}

export default function VerifySertifikatPage({
  params,
}: {
  params: Promise<{ nomor: string }>;
}) {
  const { nomor } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerifyData | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `/api/sertifikat/verify?nomor=${encodeURIComponent(nomor)}`
        );
        const result = await res.json();
        setData(result);
      } catch {
        setData({ valid: false, error: "Gagal memverifikasi" });
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [nomor]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memverifikasi sertifikat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-32">
      <div className="max-w-md w-full">
        {data?.valid ? (
          <div className="bg-card rounded-xl shadow-lg p-8 border border-border text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              Sertifikat Valid
            </h1>
            <p className="text-muted-foreground mb-6">
              Sertifikat ini terdaftar dan sah
            </p>

            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  Nomor Sertifikat
                </p>
                <p className="font-mono font-medium text-foreground">
                  {data.sertifikat?.nomor}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Penerima</p>
                <p className="font-medium text-foreground">
                  {data.sertifikat?.penerima}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Jenis Sertifikat
                </p>
                <p className="font-medium text-foreground">
                  {data.sertifikat?.tipe === "pertemuan"
                    ? `Event: ${data.sertifikat?.pertemuan}`
                    : "Penyelesaian Quiz"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Tanggal Terbit</p>
                <p className="font-medium text-foreground">
                  {data.sertifikat?.tanggal_terbit &&
                    new Date(data.sertifikat.tanggal_terbit).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">
                DCN Universitas Madura
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-lg p-8 border border-border text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">
              Sertifikat Tidak Valid
            </h1>
            <p className="text-muted-foreground">
              {data?.error ||
                "Sertifikat dengan nomor tersebut tidak ditemukan"}
            </p>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Nomor yang dicari:
              </p>
              <p className="font-mono font-medium text-foreground">{nomor}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
