"use client";

import { X } from "lucide-react";

interface PertemuanFormProps {
  form: {
    tanggal: string;
    judul: string;
    berita_acara: string;
  };
  onFormChange: (form: { tanggal: string; judul: string; berita_acara: string }) => void;
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
              onChange={(e) =>
                onFormChange({ ...form, judul: e.target.value })
              }
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
