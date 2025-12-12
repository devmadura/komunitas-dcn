"use client";

import { useState } from "react";
import {
  Award,
  FileDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Users,
} from "lucide-react";
import { Kontributor, supabase } from "@/lib/supabase";
import { getTier } from "./DashboardStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  exportLeaderboardToPDF,
  exportAllKontributorToPDF,
} from "@/lib/exportPDF";
import { toast } from "sonner";

interface LeaderboardTabProps {
  kontributor: Kontributor[];
  onRefresh?: () => void;
}

const ITEMS_PER_PAGE = 15;

export default function LeaderboardTab({
  kontributor,
  onRefresh,
}: LeaderboardTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingKontributor, setEditingKontributor] =
    useState<Kontributor | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Kontributor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const topKontributor = [...kontributor]
    .sort((a, b) => b.total_poin - a.total_poin)
    .slice(0, 10);

  const filteredKontributor = kontributor.filter((k) =>
    k.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredKontributor.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedKontributor = filteredKontributor.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleExportLeaderboard = () => {
    exportLeaderboardToPDF(topKontributor);
    toast.success("PDF Leaderboard berhasil diunduh");
  };

  const handleExportAll = () => {
    const sortedAll = [...kontributor].sort(
      (a, b) => b.total_poin - a.total_poin
    );
    exportAllKontributorToPDF(sortedAll);
    toast.success("PDF Semua Kontributor berhasil diunduh");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKontributor) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("kontributor")
      .update({
        nama: editingKontributor.nama,
        nim: editingKontributor.nim,
        angkatan: editingKontributor.angkatan,
        total_poin: editingKontributor.total_poin,
      })
      .eq("id", editingKontributor.id);

    setIsLoading(false);

    if (error) {
      toast.error("Gagal mengupdate kontributor");
    } else {
      toast.success("Kontributor berhasil diupdate");
      setEditingKontributor(null);
      onRefresh?.();
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    setIsLoading(true);
    const { error } = await supabase
      .from("kontributor")
      .delete()
      .eq("id", deleteConfirm.id);

    setIsLoading(false);

    if (error) {
      toast.error("Gagal menghapus kontributor");
    } else {
      toast.success("Kontributor berhasil dihapus");
      setDeleteConfirm(null);
      onRefresh?.();
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === i
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600">
          Menampilkan {startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredKontributor.length)}{" "}
          dari {filteredKontributor.length} kontributor
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {pages}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="leaderboard" className="w-full text-black">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            value="leaderboard"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            Semua Kontributor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Award className="w-8 h-8 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Leaderboard Kontributor
                </h2>
              </div>
              <button
                onClick={handleExportLeaderboard}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                Print PDF
              </button>
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

          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
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
        </TabsContent>

        <TabsContent value="all">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-indigo-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Semua Kontributor
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari nama..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                <button
                  onClick={handleExportAll}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  Print PDF
                </button>
              </div>
            </div>

            {paginatedKontributor.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                {searchQuery
                  ? "Tidak ada kontributor yang cocok dengan pencarian"
                  : "Belum ada data kontributor"}
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          NIM
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Angkatan
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Poin
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tier
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedKontributor.map((k, idx) => {
                        const tier = getTier(k.total_poin);
                        return (
                          <tr key={k.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {startIndex + idx + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {k.nim}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {k.nama}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {k.angkatan}
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-indigo-600">
                              {k.total_poin}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white ${tier.color}`}
                              >
                                {tier.icon} {tier.name}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setEditingKontributor(k)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(k)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {renderPagination()}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {editingKontributor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Edit Kontributor
              </h3>
              <button
                onClick={() => setEditingKontributor(null)}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4 text-black">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={editingKontributor.nama}
                  onChange={(e) =>
                    setEditingKontributor({
                      ...editingKontributor,
                      nama: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIM
                </label>
                <input
                  type="text"
                  value={editingKontributor.nim}
                  onChange={(e) =>
                    setEditingKontributor({
                      ...editingKontributor,
                      nim: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Angkatan
                </label>
                <input
                  type="text"
                  value={editingKontributor.angkatan}
                  onChange={(e) =>
                    setEditingKontributor({
                      ...editingKontributor,
                      angkatan: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Poin
                </label>
                <input
                  type="number"
                  value={editingKontributor.total_poin}
                  onChange={(e) =>
                    setEditingKontributor({
                      ...editingKontributor,
                      total_poin: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingKontributor(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Konfirmasi Hapus
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="p-1 hover:bg-gray-100 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus kontributor{" "}
              <span className="font-bold">{deleteConfirm.nama}</span>? Tindakan
              ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
