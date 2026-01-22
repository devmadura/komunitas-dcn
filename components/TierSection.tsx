"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, Award, Medal, Crown } from "lucide-react";
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

// Avatar component with gradient
const Avatar = ({ name, tier, size = "md" }: { name: string; tier: string; size?: "sm" | "md" | "lg" }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-xl",
    lg: "w-20 h-20 text-2xl",
  };

  const gradients = {
    Gold: "from-yellow-400 to-yellow-600",
    Silver: "from-gray-300 to-gray-500",
    Bronze: "from-amber-600 to-amber-800",
    Member: "from-indigo-500 to-indigo-700",
  };

  return (
    <div
      className={cn(
        "rounded-full bg-linear-to-br flex items-center justify-center font-bold text-white shadow-lg",
        sizeClasses[size],
        gradients[tier as keyof typeof gradients] || gradients.Member
      )}
    >
      {initials}
    </div>
  );
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

  const getTierIcon = (tier: string, large = false) => {
    const className = large ? "w-8 h-8" : "w-6 h-6";
    switch (tier) {
      case "Gold":
        return <Trophy className={cn(className, "text-yellow-500")} />;
      case "Silver":
        return <Medal className={cn(className, "text-gray-400")} />;
      case "Bronze":
        return <Award className={cn(className, "text-amber-700")} />;
      default:
        return <Star className={cn(className, "text-slate-400")} />;
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            🏆 Top Contributors
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kontributor terbaik berdasarkan poin kehadiran dan partisipasi aktif
          </p>
        </motion.div>

        {/* Top 3 Podium - Enhanced Design */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Second Place */}
            {leaderboard[1] && (
              <motion.div
                variants={itemVariants}
                className="group bg-card border-2 border-border rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-gray-400/5 to-transparent pointer-events-none" />

                <div className="text-center relative z-10">
                  {/* Rank Badge */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-linear-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    2
                  </div>

                  {/* Avatar */}
                  <div className="mb-4 flex justify-center">
                    <Avatar name={leaderboard[1].nama} tier={leaderboard[1].tier} size="md" />
                  </div>

                  {/* Tier Icon */}
                  <div className="mb-3 flex justify-center">
                    {getTierIcon(leaderboard[1].tier, true)}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                    {leaderboard[1].nama}
                  </h3>

                  {/* Info */}
                  <p className="text-sm text-muted-foreground mb-1">{leaderboard[1].nim}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {leaderboard[1].prodi} • {leaderboard[1].angkatan}
                  </p>

                  {/* Points Badge */}
                  <div className="inline-flex items-center gap-2 bg-linear-to-r from-gray-300 to-gray-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg">
                    <Trophy className="w-4 h-4" />
                    {leaderboard[1].total_poin} poin
                  </div>
                </div>
              </motion.div>
            )}

            {/* First Place - Winner */}
            {leaderboard[0] && (
              <motion.div
                variants={itemVariants}
                className="group bg-card border-4 border-yellow-400 rounded-3xl shadow-2xl p-8 md:scale-110 relative overflow-hidden"
              >
                {/* Gold gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-yellow-400/10 via-yellow-500/5 to-transparent pointer-events-none" />

                {/* Glow effect */}
                <div className="absolute inset-0 bg-yellow-400/5 blur-2xl" />

                <div className="text-center relative z-10">
                  {/* Crown */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <Crown className="w-10 h-10 text-yellow-500 fill-yellow-500 animate-pulse" />
                  </div>

                  {/* Rank Badge */}
                  <div className="absolute -top-3 -right-3 w-14 h-14 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl animate-pulse">
                    1
                  </div>

                  {/* Avatar */}
                  <div className="mb-4 flex justify-center mt-4">
                    <Avatar name={leaderboard[0].nama} tier={leaderboard[0].tier} size="lg" />
                  </div>

                  {/* Tier Icon */}
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-yellow-500/10 rounded-full">
                      {getTierIcon(leaderboard[0].tier, true)}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-2xl text-foreground mb-2 group-hover:text-yellow-600 transition-colors">
                    {leaderboard[0].nama}
                  </h3>

                  {/* Info */}
                  <p className="text-sm text-muted-foreground mb-1">{leaderboard[0].nim}</p>
                  <p className="text-sm text-muted-foreground mb-5">
                    {leaderboard[0].prodi} • {leaderboard[0].angkatan}
                  </p>

                  {/* Points Badge */}
                  <div className="inline-flex items-center gap-2 bg-linear-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl">
                    <Trophy className="w-5 h-5" />
                    {leaderboard[0].total_poin} poin
                  </div>
                </div>
              </motion.div>
            )}

            {/* Third Place */}
            {leaderboard[2] && (
              <motion.div
                variants={itemVariants}
                className="group bg-card border-2 border-border rounded-3xl shadow-xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-amber-600/5 to-transparent pointer-events-none" />

                <div className="text-center relative z-10">
                  {/* Rank Badge */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-linear-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    3
                  </div>

                  {/* Avatar */}
                  <div className="mb-4 flex justify-center">
                    <Avatar name={leaderboard[2].nama} tier={leaderboard[2].tier} size="md" />
                  </div>

                  {/* Tier Icon */}
                  <div className="mb-3 flex justify-center">
                    {getTierIcon(leaderboard[2].tier, true)}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors">
                    {leaderboard[2].nama}
                  </h3>

                  {/* Info */}
                  <p className="text-sm text-muted-foreground mb-1">{leaderboard[2].nim}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {leaderboard[2].prodi} • {leaderboard[2].angkatan}
                  </p>

                  {/* Points Badge */}
                  <div className="inline-flex items-center gap-2 bg-linear-to-r from-amber-600 to-amber-800 text-white px-5 py-2.5 rounded-full font-bold shadow-lg">
                    <Trophy className="w-4 h-4" />
                    {leaderboard[2].total_poin} poin
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Rest of the list - Enhanced */}
        {leaderboard.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-primary" />
                Top 10 Kontributor
              </h3>
              <div className="space-y-3">
                {leaderboard.slice(3, 10).map((contributor, idx) => (
                  <motion.div
                    key={contributor.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 hover:scale-[1.02] transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Badge */}
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br shadow-md",
                          getTierColor(contributor.tier)
                        )}
                      >
                        {contributor.rank}
                      </div>


                      {/* Tier Icon */}
                      <div className="hidden sm:block">
                        {getTierIcon(contributor.tier)}
                      </div>

                      {/* Info */}
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {contributor.nama}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {contributor.nim} • {contributor.prodi} {contributor.angkatan}
                        </p>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {contributor.total_poin}
                      </p>
                      <p className="text-xs text-muted-foreground">poin</p>
                    </div>
                  </motion.div>
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
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              Sistem Tier
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl border-2 border-yellow-500/30 hover:border-yellow-500/50 transition-all hover:scale-105">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p className="font-bold text-foreground text-lg mb-1">Gold</p>
                <p className="text-sm text-muted-foreground">≥ 300 poin</p>
              </div>
              <div className="text-center p-6 bg-gray-500/10 dark:bg-gray-500/20 rounded-xl border-2 border-gray-500/30 hover:border-gray-500/50 transition-all hover:scale-105">
                <Medal className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-bold text-foreground text-lg mb-1">Silver</p>
                <p className="text-sm text-muted-foreground">≥ 200 poin</p>
              </div>
              <div className="text-center p-6 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl border-2 border-amber-500/30 hover:border-amber-500/50 transition-all hover:scale-105">
                <Award className="w-12 h-12 text-amber-700 mx-auto mb-3" />
                <p className="font-bold text-foreground text-lg mb-1">Bronze</p>
                <p className="text-sm text-muted-foreground">≥ 100 poin</p>
              </div>
              <div className="text-center p-6 bg-slate-500/10 dark:bg-slate-500/20 rounded-xl border-2 border-slate-500/30 hover:border-slate-500/50 transition-all hover:scale-105">
                <Star className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="font-bold text-foreground text-lg mb-1">Member</p>
                <p className="text-sm text-muted-foreground">&lt; 100 poin</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
