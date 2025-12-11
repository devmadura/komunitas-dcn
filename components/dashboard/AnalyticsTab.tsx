"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Download,
  FileText,
  FileSpreadsheet,
  File,
  UserCheck,
  UserX,
  UserMinus,
  TrendingUp,
} from "lucide-react";
import { exportToPDF, exportToXLSX, exportToCSV } from "@/lib/exportAnalytics";
import { toast } from "@/hooks/use-toast";

interface AttendanceData {
  month: string;
  monthKey: string;
  hadir: number;
  izin: number;
  alpha: number;
  total: number;
}

interface QuizData {
  month: string;
  monthKey: string;
  avgScore: number;
  totalSubmissions: number;
}

interface AnalyticsData {
  attendanceData: AttendanceData[];
  quizData: QuizData[];
  totalStats: {
    hadir: number;
    izin: number;
    alpha: number;
    totalQuiz: number;
  };
}

export default function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: "pdf" | "xlsx" | "csv") => {
    if (!data) return;
    setExporting(type);

    try {
      if (type === "pdf") exportToPDF(data);
      else if (type === "xlsx") exportToXLSX(data);
      else exportToCSV(data);
    } catch (error) {
      console.error("Export error:", error);
      toast({ title: "Gagal export data", variant: "destructive" });
    } finally {
      setTimeout(() => setExporting(null), 500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Gagal memuat data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("pdf")}
            disabled={exporting === "pdf"}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {exporting === "pdf" ? "..." : "PDF"}
          </button>
          <button
            onClick={() => handleExport("xlsx")}
            disabled={exporting === "xlsx"}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {exporting === "xlsx" ? "..." : "XLSX"}
          </button>
          <button
            onClick={() => handleExport("csv")}
            disabled={exporting === "csv"}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <File className="w-4 h-4" />
            {exporting === "csv" ? "..." : "CSV"}
          </button>
        </div>
      </div>

      {/* Total Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Hadir</p>
              <p className="text-3xl font-bold text-green-600">
                {data.totalStats.hadir}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Izin</p>
              <p className="text-3xl font-bold text-yellow-600">
                {data.totalStats.izin}
              </p>
            </div>
            <UserMinus className="w-12 h-12 text-yellow-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Alpha</p>
              <p className="text-3xl font-bold text-red-600">
                {data.totalStats.alpha}
              </p>
            </div>
            <UserX className="w-12 h-12 text-red-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Statistik Kehadiran per Bulan
        </h3>
        {data.attendanceData.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Belum ada data kehadiran</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hadir" name="Hadir" fill="#22c55e" />
              <Bar dataKey="izin" name="Izin" fill="#eab308" />
              <Bar dataKey="alpha" name="Alpha" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Quiz Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-900">Trend Skor Quiz</h3>
        </div>
        {data.quizData.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Belum ada data quiz</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.quizData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Rata-rata Skor"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgScore"
                name="Rata-rata Skor (%)"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Detail Kehadiran per Bulan
        </h3>
        {data.attendanceData.length === 0 ? (
          <p className="text-gray-500 text-center py-10">Belum ada data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Bulan
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-green-600">
                    Hadir
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-yellow-600">
                    Izin
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-red-600">
                    Alpha
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.attendanceData.map((row) => (
                  <tr key={row.monthKey} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {row.month}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-green-600 font-semibold">
                      {row.hadir}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-yellow-600 font-semibold">
                      {row.izin}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-red-600 font-semibold">
                      {row.alpha}
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-900 font-bold">
                      {row.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
