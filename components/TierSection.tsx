"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, Award, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tiercontributor" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-foreground">
            🏆 Top Contributors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
            Kontributor terbaik berdasarkan poin kehadiran dan partisipasi aktif
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Second Place */}
            {leaderboard[1] && (
              <motion.div
                variants={itemVariants}
                className="bg-card border border-border rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-gray-300 to-gray-500 rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4">
                    2
                  </div>
                  <div className="mb-4 flex justify-center">
                    {getTierIcon(leaderboard[1].tier)}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {leaderboard[1].nama}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {leaderboard[1].nim}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    prodi {leaderboard[1].prodi} - angkatan{" "}
                    {leaderboard[1].angkatan}
                  </p>
                  <div className="bg-linear-to-r from-gray-300 to-gray-500 text-white px-4 py-2 rounded-full font-bold">
                    {leaderboard[1].total_poin} poin
                  </div>
                </div>
              </motion.div>
            )}

            {/* First Place */}
            {leaderboard[0] && (
              <motion.div
                variants={itemVariants}
                className="bg-card border-4 rounded-2xl shadow-2xl p-8 transform md:scale-110 border-yellow-400"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 animate-pulse">
                    1
                  </div>
                  <div className="text-5xl mb-4 flex justify-center">
                    {getTierIcon(leaderboard[0].tier)}
                  </div>
                  <h3 className="font-bold text-xl text-foreground mb-1">
                    {leaderboard[0].nama}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    {leaderboard[0].nim}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    prodi {leaderboard[0].prodi} - angkatan{" "}
                    {leaderboard[0].angkatan}
                  </p>
                  <div className="bg-linear-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full font-bold text-lg">
                    {leaderboard[0].total_poin} poin
                  </div>
                </div>
              </motion.div>
            )}

            {/* Third Place */}
            {leaderboard[2] && (
              <motion.div
                variants={itemVariants}
                className="bg-card border border-border rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-linear-to-br from-amber-600 to-amber-800 rounded-full mx-auto flex items-center justify-center text-white font-bold text-2xl mb-4">
                    3
                  </div>
                  <div className="mb-4 flex justify-center">
                    {getTierIcon(leaderboard[2].tier)}
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {leaderboard[2].nama}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {leaderboard[2].nim}
                  </p>
                  <p className="text-sm text-muted-foreground mb-1">
                    prodi {leaderboard[2].prodi} - angkatan{" "}
                    {leaderboard[2].angkatan}
                  </p>
                  <div className="bg-linear-to-r from-amber-600 to-amber-800 text-white px-4 py-2 rounded-full font-bold">
                    {leaderboard[2].total_poin} poin
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Rest of the list */}
        {leaderboard.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Top 10 Kontributor
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(3, 10).map((contributor) => (
                  <div
                    key={contributor.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
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
                        <p className="font-semibold text-foreground">
                          {contributor.nama}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {contributor.nim} - Angkatan {contributor.angkatan} -
                          prodi {contributor.prodi}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">
                        {contributor.total_poin}
                      </p>
                      <p className="text-xs text-muted-foreground">poin</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tier System Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Sistem Tier
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl border border-yellow-500/20">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="font-bold text-foreground text-lg">Gold</p>
                <p className="text-sm text-muted-foreground mt-1">≥ 300 poin</p>
              </div>
              <div className="text-center p-4 bg-gray-500/10 dark:bg-gray-500/20 rounded-xl border border-gray-500/20">
                <Medal className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-bold text-foreground text-lg">Silver</p>
                <p className="text-sm text-muted-foreground mt-1">≥ 200 poin</p>
              </div>
              <div className="text-center p-4 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl border border-amber-500/20">
                <Award className="w-12 h-12 text-amber-700 mx-auto mb-3" />
                <p className="font-bold text-foreground text-lg">Bronze</p>
                <p className="text-sm text-muted-foreground mt-1">≥ 100 poin</p>
              </div>
              <div className="text-center p-4 bg-slate-500/10 dark:bg-slate-500/20 rounded-xl border border-slate-500/20">
                <Star className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="font-bold text-foreground text-lg">Member</p>
                <p className="text-sm text-muted-foreground mt-1">
                  &lt; 100 poin
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
