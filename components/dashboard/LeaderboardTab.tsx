"use client";

import { Award } from "lucide-react";
import { Kontributor } from "@/lib/supabase";
import { getTier } from "./DashboardStats";

interface LeaderboardTabProps {
  kontributor: Kontributor[];
}

export default function LeaderboardTab({ kontributor }: LeaderboardTabProps) {
  const topKontributor = [...kontributor]
    .sort((a, b) => b.total_poin - a.total_poin)
    .slice(0, 10);

  return (
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
                      <p className="font-bold text-gray-900 text-lg">{k.nama}</p>
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

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Sistem Tier</h3>
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
  );
}
