"use client";

import { useState, useEffect } from "react";
import { Activity, ExternalLink, RefreshCw } from "lucide-react";
import { ActivityLog } from "@/lib/axiom";

const ACTION_LABELS: Record<string, string> = {
  login: "Login",
  logout: "Logout",
  create_quiz: "Buat Kuis",
  update_quiz: "Update Kuis",
  delete_quiz: "Hapus Kuis",
  create_pertemuan: "Buat Pertemuan",
  update_pertemuan: "Update Pertemuan",
  delete_pertemuan: "Hapus Pertemuan",
  create_absensi: "Buat Absensi",
  update_absensi: "Update Absensi",
  delete_absensi: "Hapus Absensi",
  create_admin: "Tambah Admin",
  update_admin: "Update Admin",
  delete_admin: "Hapus Admin",
  generate_sertifikat: "Generate Sertifikat",
};

const ACTION_COLORS: Record<string, string> = {
  login: "bg-green-100 text-green-700",
  logout: "bg-gray-100 text-gray-700",
  create_quiz: "bg-blue-100 text-blue-700",
  update_quiz: "bg-yellow-100 text-yellow-700",
  delete_quiz: "bg-red-100 text-red-700",
  create_pertemuan: "bg-blue-100 text-blue-700",
  update_pertemuan: "bg-yellow-100 text-yellow-700",
  delete_pertemuan: "bg-red-100 text-red-700",
  create_absensi: "bg-blue-100 text-blue-700",
  update_absensi: "bg-yellow-100 text-yellow-700",
  delete_absensi: "bg-red-100 text-red-700",
  create_admin: "bg-purple-100 text-purple-700",
  update_admin: "bg-yellow-100 text-yellow-700",
  delete_admin: "bg-red-100 text-red-700",
  generate_sertifikat: "bg-indigo-100 text-indigo-700",
};

export default function ActivityLogTab() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/activity-log?limit=100");
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <a
            href="https://app.axiom.co"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <span>Lihat Selengkapnya</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada aktivitas</p>
          <p className="text-gray-400 text-sm mt-2">
            Log aktivitas akan muncul di sini
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {log.admin_name || "-"}
                      </p>
                      <p className="text-xs text-gray-500">{log.admin_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        ACTION_COLORS[log.action] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">
                    {log.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
