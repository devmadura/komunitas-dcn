"use client";

import { useEffect, useState } from "react";
import { X, Download, Loader2 } from "lucide-react";
import { Kontributor, Pertemuan } from "@/lib/supabase";
import { exportAbsensiToPDF } from "@/lib/exportPDF";
import { toast } from "@/hooks/use-toast";

export type AbsensiFormData = {
  status?: "hadir" | "izin" | "alpha";
  poin?: number;
  keterangan?: string;
};

interface AbsensiFormProps {
  pertemuan: Pertemuan;
  kontributor: Kontributor[];
  onClose: () => void;
  onSaved: () => void;
}

export default function AbsensiForm({
  pertemuan,
  kontributor,
  onClose,
  onSaved,
}: AbsensiFormProps) {
  const [absensiData, setAbsensiData] = useState<Record<string, AbsensiFormData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load existing absensi data saat pertemuan dipilih
  useEffect(() => {
    const loadExistingAbsensi = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/absensi?pertemuan_id=${pertemuan.id}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const existingData: Record<string, AbsensiFormData> = {};
          data.forEach((item: { kontributor_id: string; status: string; poin: number; keterangan?: string }) => {
            existingData[item.kontributor_id] = {
              status: item.status as "hadir" | "izin" | "alpha",
              poin: item.poin,
              keterangan: item.keterangan || "",
            };
          });
          setAbsensiData(existingData);
        }
      } catch (error) {
        console.error("Error loading absensi:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExistingAbsensi();
  }, [pertemuan.id]);

  const handleSaveAbsensi = async () => {
    try {
      setSaving(true);
      const absensiArray = Object.entries(absensiData)
        .filter(([, data]) => data.status)
        .map(([kontributor_id, data]) => ({
          kontributor_id,
          status: data.status!,
          poin: data.poin || 0,
          keterangan: data.keterangan || null,
        }));

      if (absensiArray.length === 0) {
        toast({ title: "Tidak ada data absensi yang diisi", variant: "destructive" });
        return;
      }

      const response = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pertemuan_id: pertemuan.id,
          absensi: absensiArray,
        }),
      });

      if (response.ok) {
        onSaved();
        toast({ title: "Absensi berhasil disimpan!" });
      } else {
        const error = await response.json();
        toast({ title: `Gagal menyimpan absensi: ${error.error}`, variant: "destructive" });
      }
    } catch (error) {
      console.error("Error saving absensi:", error);
      toast({ title: "Gagal menyimpan absensi", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    const exportData = {
      pertemuan,
      absensi: Object.entries(absensiData)
        .filter(([, data]) => data.status)
        .map(([id, data]) => {
          const k = kontributor.find((k) => k.id === id);
          return {
            nim: k?.nim || "",
            nama: k?.nama || "",
            angkatan: k?.angkatan || "",
            status: data.status!,
            poin: data.poin || 0,
            keterangan: data.keterangan || undefined,
          };
        }),
    };

    exportAbsensiToPDF(exportData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto text-black">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{pertemuan.judul}</h3>
            <p className="text-sm text-gray-600">
              {new Date(pertemuan.tanggal).toLocaleDateString("id-ID")}
            </p>
          </div>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Memuat data absensi...</span>
          </div>
        ) : kontributor.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada kontributor terdaftar</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
              {kontributor.map((k) => (
                <div key={k.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{k.nama}</p>
                      <p className="text-sm text-gray-600">
                        {k.nim} - Angkatan {k.angkatan}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={absensiData[k.id]?.status || ""}
                        onChange={(e) =>
                          setAbsensiData({
                            ...absensiData,
                            [k.id]: {
                              ...absensiData[k.id],
                              status: e.target.value as "hadir" | "izin" | "alpha",
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="">Pilih</option>
                        <option value="hadir">Hadir</option>
                        <option value="izin">Izin</option>
                        <option value="alpha">Alpha</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Poin
                      </label>
                      <input
                        type="number"
                        value={absensiData[k.id]?.poin ?? ""}
                        onChange={(e) =>
                          setAbsensiData({
                            ...absensiData,
                            [k.id]: {
                              ...absensiData[k.id],
                              poin: parseInt(e.target.value, 10) || 0,
                            },
                          })
                        }
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Keterangan
                      </label>
                      <input
                        type="text"
                        value={absensiData[k.id]?.keterangan || ""}
                        onChange={(e) =>
                          setAbsensiData({
                            ...absensiData,
                            [k.id]: {
                              ...absensiData[k.id],
                              keterangan: e.target.value,
                            },
                          })
                        }
                        placeholder="Optional"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSaveAbsensi}
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan Absensi"}
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Export PDF</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
