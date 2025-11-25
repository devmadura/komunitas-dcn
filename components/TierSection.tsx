"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, Award, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Kontributor {
  id: string;
  nim: string;
  nama: string;
  angkatan: string;
  prodi: string;
  total_poin: number;
  tier: string;
  rank: number;
}

export default function TierSection() {
  const [leaderboard, setLeaderboard] = useState<Kontributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard");
      const data = await response.json();
      setLeaderboard(data.slice(0, 10));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Gold":
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case "Silver":
        return <Medal className="w-6 h-6 text-gray-400" />;
      case "Bronze":
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return <Star className="w-6 h-6 text-slate-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Gold":
        return "from-yellow-400 to-yellow-600";
      case "Silver":
        return "from-gray-300 to-gray-500";
      case "Bronze":
        return "from-amber-600 to-amber-800";
      default:
        return "from-indigo-500 to-indigo-700";
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-linear-to-br bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading leaderboard...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="tiercontributor"
      className="py-20 bg-linear-to-br bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-white bg-clip-text">
            🏆 Top Contributors
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Kontributor terbaik berdasarkan poin kehadiran dan partisipasi aktif
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Second Place */}
            {leaderboard[1] && (
              <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-gray-300 to-gray-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4">
                    2
                  </div>
                  <div className="mb-4 flex justify-center">
                    {getTierIcon(leaderboard[1].tier)}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {leaderboard[1].nama}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {leaderboard[1].nim}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    prodi {leaderboard[1].prodi} - angkatan{" "}
                    {leaderboard[1].angkatan}
                  </p>
                  <div className="bg-linear-to-r from-gray-300 to-gray-500 text-white px-4 py-2 rounded-full font-bold">
                    {leaderboard[1].total_poin} poin
                  </div>
                </div>
              </div>
            )}

            {/* First Place */}
            {leaderboard[0] && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform md:scale-110 border-4 border-yellow-400">
                <div className="text-center">
                  <div className="w-20 h-20 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 animate-pulse">
                    1
                  </div>
                  <div className="text-5xl mb-4 flex justify-center">
                    {getTierIcon(leaderboard[0].tier)}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">
                    {leaderboard[0].nama}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {leaderboard[0].nim}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    prodi {leaderboard[0].prodi} - angkatan{" "}
                    {leaderboard[0].angkatan}
                  </p>
                  <div className="bg-linear-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full font-bold text-lg">
                    {leaderboard[0].total_poin} poin
                  </div>
                </div>
              </div>
            )}

            {/* Third Place */}
            {leaderboard[2] && (
              <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform">
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-amber-600 to-amber-800 rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4">
                    3
                  </div>
                  <div className="mb-4 flex justify-center">
                    {getTierIcon(leaderboard[2].tier)}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {leaderboard[2].nama}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {leaderboard[2].nim}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    prodi {leaderboard[2].prodi} - angkatan{" "}
                    {leaderboard[2].angkatan}
                  </p>
                  <div className="bg-linear-to-r from-amber-600 to-amber-800 text-white px-4 py-2 rounded-full font-bold">
                    {leaderboard[2].total_poin} poin
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rest of the list */}
        {leaderboard.length > 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Top 10 Kontributor
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(3, 10).map((contributor) => (
                  <div
                    key={contributor.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br",
                          getTierColor(contributor.tier)
                        )}
                      >
                        {contributor.rank}
                      </div>
                      {getTierIcon(contributor.tier)}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {contributor.nama}
                        </p>
                        <p className="text-sm text-gray-600">
                          {contributor.nim} - Angkatan {contributor.angkatan} -
                          prodi {contributor.prodi}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-indigo-600">
                        {contributor.total_poin}
                      </p>
                      <p className="text-xs text-gray-600">poin</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tier System Info */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Sistem Tier
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-linear-to-br from-yellow-50 to-yellow-100 rounded-xl">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="font-bold text-gray-900 text-lg">Gold</p>
                <p className="text-sm text-gray-600 mt-1">≥ 300 poin</p>
              </div>
              <div className="text-center p-4 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl">
                <Medal className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-bold text-gray-900 text-lg">Silver</p>
                <p className="text-sm text-gray-600 mt-1">≥ 200 poin</p>
              </div>
              <div className="text-center p-4 bg-linear-to-br from-amber-50 to-amber-100 rounded-xl">
                <Award className="w-12 h-12 text-amber-700 mx-auto mb-3" />
                <p className="font-bold text-gray-900 text-lg">Bronze</p>
                <p className="text-sm text-gray-600 mt-1">≥ 100 poin</p>
              </div>
              <div className="text-center p-4 bg-linear-to-br from-slate-50 to-slate-100 rounded-xl">
                <Star className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="font-bold text-gray-900 text-lg">Member</p>
                <p className="text-sm text-gray-600 mt-1"> 100 poin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
