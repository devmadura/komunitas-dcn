"use client";

import { X, Award } from "lucide-react";

interface PertemuanFormProps {
  form: {
    tanggal: string;
    judul: string;
    berita_acara: string;
    has_sertifikat: boolean;
  };
  onFormChange: (form: {
    tanggal: string;
    judul: string;
    berita_acara: string;
    has_sertifikat: boolean;
  }) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export default function PertemuanForm({
  form,
  onFormChange,
  onSubmit,
  onClose,
}: PertemuanFormProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Buat Pertemuan Baru
          </h3>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-orange-500 italic text-sm">
            <span className="font-bold text-red-500">Peringatan: </span>
            harap isi dengan benar karean pertemuan yang di set tidak bisa di
            hapus
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              value={form.tanggal}
              onChange={(e) =>
                onFormChange({ ...form, tanggal: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Pertemuan
            </label>
            <input
              type="text"
              value={form.judul}
              onChange={(e) => onFormChange({ ...form, judul: e.target.value })}
              placeholder="Misal: Workshop Next.js"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Berita Acara
            </label>
            <textarea
              value={form.berita_acara}
              onChange={(e) =>
                onFormChange({ ...form, berita_acara: e.target.value })
              }
              placeholder="Deskripsi kegiatan pertemuan..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="font-medium text-gray-900">Sertifikat</p>
                <p className="text-sm text-gray-500">
                  Aktifkan jika pertemuan ini menyediakan sertifikat
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.has_sertifikat}
                onChange={(e) =>
                  onFormChange({ ...form, has_sertifikat: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <button
            onClick={onSubmit}
            disabled={!form.tanggal || !form.judul}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Buat Pertemuan
          </button>
        </div>
      </div>
    </div>
  );
}
