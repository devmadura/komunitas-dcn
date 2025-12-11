"use client";

import { useState } from "react";
import { Plus, Calendar, Award } from "lucide-react";
import { Kontributor, Pertemuan } from "@/lib/supabase";
import PertemuanForm from "./PertemuanForm";
import AbsensiForm from "./AbsensiForm";
import { toast } from "@/hooks/use-toast";

interface AbsensiTabProps {
  pertemuan: Pertemuan[];
  kontributor: Kontributor[];
  onDataChanged: () => void;
}

export default function AbsensiTab({
  pertemuan,
  kontributor,
  onDataChanged,
}: AbsensiTabProps) {
  const [showPertemuanForm, setShowPertemuanForm] = useState(false);
  const [selectedPertemuan, setSelectedPertemuan] = useState<Pertemuan | null>(null);
  const [formPertemuan, setFormPertemuan] = useState({
    tanggal: "",
    judul: "",
    berita_acara: "",
    has_sertifikat: false,
  });

  const handleCreatePertemuan = async () => {
    try {
      const response = await fetch("/api/pertemuan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPertemuan),
      });

      if (response.ok) {
        onDataChanged();
        setFormPertemuan({ tanggal: "", judul: "", berita_acara: "", has_sertifikat: false });
        setShowPertemuanForm(false);
        toast({ title: "Pertemuan berhasil dibuat!" });
      }
    } catch (error) {
      console.error("Error creating pertemuan:", error);
      toast({ title: "Gagal membuat pertemuan", variant: "destructive" });
    }
  };

  const handleAbsensiSaved = () => {
    onDataChanged();
    setSelectedPertemuan(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Kelola Absensi</h2>
        <button
          onClick={() => setShowPertemuanForm(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Buat Pertemuan</span>
        </button>
      </div>

      {pertemuan.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada pertemuan</p>
          <p className="text-gray-400 text-sm mt-2">
            Klik Buat Pertemuan untuk memulai
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pertemuan.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPertemuan(p)}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-600"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-lg">{p.judul}</h3>
                    {p.has_sertifikat && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        <Award className="w-3 h-3" />
                        Sertifikat
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(p.tanggal).toLocaleDateString("id-ID")}
                  </p>
                  {p.berita_acara && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                      {p.berita_acara}
                    </p>
                  )}
                </div>
                <Calendar className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          ))}
        </div>
      )}

      {showPertemuanForm && (
        <PertemuanForm
          form={formPertemuan}
          onFormChange={setFormPertemuan}
          onSubmit={handleCreatePertemuan}
          onClose={() => setShowPertemuanForm(false)}
        />
      )}

      {selectedPertemuan && (
        <AbsensiForm
          pertemuan={selectedPertemuan}
          kontributor={kontributor}
          onClose={() => setSelectedPertemuan(null)}
          onSaved={handleAbsensiSaved}
        />
      )}
    </div>
  );
}
