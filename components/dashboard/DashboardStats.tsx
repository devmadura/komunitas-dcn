"use client";

import { Users, Calendar, FileText } from "lucide-react";
import { Kontributor, Pertemuan } from "@/lib/supabase";

interface DashboardStatsProps {
  kontributor: Kontributor[];
  pertemuan: Pertemuan[];
  absensiCount: number;
}

export function getTier(poin: number) {
  if (poin >= 300) return { name: "Gold", color: "bg-yellow-500", icon: "👑" };
  if (poin >= 200) return { name: "Silver", color: "bg-gray-400", icon: "🥈" };
  if (poin >= 100) return { name: "Bronze", color: "bg-amber-700", icon: "🥉" };
  return { name: "Member", color: "bg-slate-400", icon: "⭐" };
}

export default function DashboardStats({
  kontributor,
  pertemuan,
  absensiCount,
}: DashboardStatsProps) {
  const topKontributor = [...kontributor]
    .sort((a, b) => b.total_poin - a.total_poin)
    .slice(0, 5);

  return (
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
              <p className="text-3xl font-bold text-gray-900">{absensiCount}</p>
            </div>
            <FileText className="w-12 h-12 text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

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
            {topKontributor.map((k, idx) => {
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
                      <p className="font-semibold text-gray-900">{k.nama}</p>
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
  );
}
