"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  FileText,
  Download,
  Plus,
  X,
  Award,
} from "lucide-react";
import { exportAbsensiToPDF } from "@/lib/exportPDF";
import {  Kontributor, Pertemuan } from "@/lib/supabase";

// FIX 1: Buat tipe baru untuk data form absensi agar lebih spesifik
// dan tidak bertabrakan dengan tipe `Absensi` dari database.
type AbsensiFormData = {
  status?: "hadir" | "izin" | "alpha";
  poin?: number;
  keterangan?: string;
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [kontributor, setKontributor] = useState<Kontributor[]>([]);
  const [pertemuan, setPertemuan] = useState<Pertemuan[]>([]);
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPertemuanForm, setShowPertemuanForm] = useState(false);
  const [selectedPertemuan, setSelectedPertemuan] = useState<Pertemuan | null>(
    null
  );
  const [formPertemuan, setFormPertemuan] = useState({
    tanggal: "",
    judul: "",
    berita_acara: "",
  });

  // FIX 2: Gunakan tipe `AbsensiFormData` untuk state `absensiData`
  const [absensiData, setAbsensiData] = useState<
    Record<string, AbsensiFormData>
  >({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kontributorRes, pertemuanRes, absensiRes] = await Promise.all([
        fetch("/api/kontributor"),
        fetch("/api/pertemuan"),
        fetch("/api/absensi"),
      ]);

      const kontributorData = await kontributorRes.json();
      const pertemuanData = await pertemuanRes.json();
      const absensiData = await absensiRes.json();

      // Pastikan data adalah array
      setKontributor(Array.isArray(kontributorData) ? kontributorData : []);
      setPertemuan(Array.isArray(pertemuanData) ? pertemuanData : []);
      setAbsensi(absensiData);

      // Debug log
      console.log("Kontributor data:", kontributorData);
      console.log("Pertemuan data:", pertemuanData);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set empty arrays on error
      setKontributor([]);
      setPertemuan([]);
      setAbsensi([]);
    } finally {
      setLoading(false);
    }
  };

  const getTier = (poin: number) => {
    if (poin >= 300)
      return { name: "Gold", color: "bg-yellow-500", icon: "👑" };
    if (poin >= 200)
      return { name: "Silver", color: "bg-gray-400", icon: "🥈" };
    if (poin >= 100)
      return { name: "Bronze", color: "bg-amber-700", icon: "🥉" };
    return { name: "Member", color: "bg-slate-400", icon: "⭐" };
  };

  // Pastikan kontributor adalah array sebelum spread
  const topKontributor = Array.isArray(kontributor)
    ? [...kontributor].sort((a, b) => b.total_poin - a.total_poin).slice(0, 10)
    : [];

  const handleCreatePertemuan = async () => {
    try {
      const response = await fetch("/api/pertemuan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPertemuan),
      });

      if (response.ok) {
        await fetchData();
        setFormPertemuan({ tanggal: "", judul: "", berita_acara: "" });
        setShowPertemuanForm(false);
        alert("Pertemuan berhasil dibuat!");
      }
    } catch (error) {
      console.error("Error creating pertemuan:", error);
      alert("Gagal membuat pertemuan");
    }
  };

  const handleSaveAbsensi = async () => {
    try {
      // FIX 3: Ganti `_` dengan `_kontributorId` untuk memenuhi aturan ESLint
      const absensiArray = Object.entries(absensiData)
        .filter(([_kontributorId, data]) => data.status) // Gunakan optional chaining jika data bisa undefined
        .map(([kontributor_id, data]) => ({
          kontributor_id,
          status: data.status!,
          poin: data.poin || 0,
          keterangan: data.keterangan || null,
        }));

      if (absensiArray.length === 0) {
        alert("Tidak ada data absensi yang diisi");
        return;
      }

      const response = await fetch("/api/absensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pertemuan_id: selectedPertemuan?.id,
          absensi: absensiArray,
        }),
      });

      if (response.ok) {
        await fetchData();
        setAbsensiData({});
        setSelectedPertemuan(null);
        alert("Absensi berhasil disimpan!");
      } else {
        const error = await response.json();
        alert(`Gagal menyimpan absensi: ${error.error}`);
      }
    } catch (error) {
      console.error("Error saving absensi:", error);
      alert("Gagal menyimpan absensi");
    }
  };

  const handleExportPDF = () => {
    if (!selectedPertemuan) return;

    const exportData = {
      pertemuan: selectedPertemuan,
      absensi: Object.entries(absensiData)
        .filter(([_kontributorId, data]) => data.status)
        .map(([id, data]) => {
          const k = kontributor.find((k) => k.id === id);
          return {
            nim: k?.nim || "",
            nama: k?.nama || "",
            angkatan: k?.angkatan || "",
            status: data.status!,
            poin: data.poin || 0,
            // FIX 4: Konversi `null` menjadi `undefined` agar sesuai dengan tipe `ExportData`
            keterangan: data.keterangan || undefined,
          };
        }),
    };

    exportAbsensiToPDF(exportData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard DCN
                </h1>
                <p className="text-sm text-gray-600">
                  Sistem Absensi Kontributor
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "dashboard"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("absensi")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "absensi"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Absensi
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === "leaderboard"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Kontributor</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {kontributor.length}
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-indigo-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Pertemuan</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {pertemuan.length}
                    </p>
                  </div>
                  <Calendar className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Absensi</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {absensi.length}
                    </p>
                  </div>
                  <FileText className="w-12 h-12 text-purple-600 opacity-20" />
                </div>
              </div>
            </div>

            {/* Top Contributors Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Top 5 Kontributor
              </h3>
              {topKontributor.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Belum ada data kontributor
                </p>
              ) : (
                <div className="space-y-3">
                  {topKontributor.slice(0, 5).map((k, idx) => {
                    const tier = getTier(k.total_poin);
                    return (
                      <div
                        key={k.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-gray-400">
                            #{idx + 1}
                          </span>
                          <span className="text-2xl">{tier.icon}</span>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {k.nama}
                            </p>
                            <p className="text-sm text-gray-600">
                              {k.nim} - Angkatan {k.angkatan}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-600">
                            {k.total_poin}
                          </p>
                          <p className="text-xs text-gray-600">poin</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Absensi Tab */}
        {activeTab === "absensi" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Kelola Absensi
              </h2>
              <button
                onClick={() => setShowPertemuanForm(true)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Buat Pertemuan</span>
              </button>
            </div>

            {/* Pertemuan List */}
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
                        <h3 className="font-bold text-gray-900 text-lg">
                          {p.judul}
                        </h3>
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

            {/* Form Buat Pertemuan Modal */}
            {showPertemuanForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      Buat Pertemuan Baru
                    </h3>
                    <button onClick={() => setShowPertemuanForm(false)}>
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
                        value={formPertemuan.tanggal}
                        onChange={(e) =>
                          setFormPertemuan({
                            ...formPertemuan,
                            tanggal: e.target.value,
                          })
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
                        value={formPertemuan.judul}
                        onChange={(e) =>
                          setFormPertemuan({
                            ...formPertemuan,
                            judul: e.target.value,
                          })
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
                        value={formPertemuan.berita_acara}
                        onChange={(e) =>
                          setFormPertemuan({
                            ...formPertemuan,
                            berita_acara: e.target.value,
                          })
                        }
                        placeholder="Deskripsi kegiatan pertemuan..."
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={handleCreatePertemuan}
                      disabled={!formPertemuan.tanggal || !formPertemuan.judul}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Buat Pertemuan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Form Absensi Modal */}
            {selectedPertemuan && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto text-black">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 my-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedPertemuan.judul}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedPertemuan.tanggal).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                    <button onClick={() => setSelectedPertemuan(null)}>
                      <X className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>

                  {kontributor.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        Belum ada kontributor terdaftar
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                        {kontributor.map((k) => (
                          <div key={k.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {k.nama}
                                </p>
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
                                        status: e.target.value as
                                          | "hadir"
                                          | "izin"
                                          | "alpha",
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
                                  value={absensiData[k.id]?.poin || ""}
                                  onChange={(e) =>
                                    setAbsensiData({
                                      ...absensiData,
                                      [k.id]: {
                                        ...absensiData[k.id],
                                        // FIX 5: Konversi nilai input string ke number
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
                          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                          Simpan Absensi
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
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Award className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Leaderboard Kontributor
                </h2>
              </div>

              {topKontributor.length === 0 ? (
                <p className="text-gray-500 text-center py-12">
                  Belum ada data kontributor
                </p>
              ) : (
                <div className="space-y-3">
                  {topKontributor.map((k, idx) => {
                    const tier = getTier(k.total_poin);
                    return (
                      <div
                        key={k.id}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          idx < 3
                            ? "bg-linear-to-r from-yellow-50 to-amber-50"
                            : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                              idx === 0
                                ? "bg-yellow-500"
                                : idx === 1
                                ? "bg-gray-400"
                                : idx === 2
                                ? "bg-amber-700"
                                : "bg-gray-300"
                            }`}
                          >
                            {idx + 1}
                          </div>

                          <span className="text-3xl">{tier.icon}</span>

                          <div>
                            <p className="font-bold text-gray-900 text-lg">
                              {k.nama}
                            </p>
                            <p className="text-sm text-gray-600">
                              {k.nim} - Angkatan {k.angkatan}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-white mt-1 ${tier.color}`}
                            >
                              {tier.name} Tier
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-3xl font-bold text-indigo-600">
                            {k.total_poin}
                          </p>
                          <p className="text-sm text-gray-600">total poin</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tier Explanation */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Sistem Tier
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-4xl mb-2">👑</div>
                  <p className="font-bold text-gray-900">Gold</p>
                  <p className="text-sm text-gray-600">≥ 300 poin</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-4xl mb-2">🥈</div>
                  <p className="font-bold text-gray-900">Silver</p>
                  <p className="text-sm text-gray-600">≥ 200 poin</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-4xl mb-2">🥉</div>
                  <p className="font-bold text-gray-900">Bronze</p>
                  <p className="text-sm text-gray-600">≥ 100 poin</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-4xl mb-2">⭐</div>
                  <p className="font-bold text-gray-900">Member</p>
                  <p className="text-sm text-gray-600">100 poin</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
