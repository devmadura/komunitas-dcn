"use client";
import { useEffect, useState } from "react";
import { Users, Calendar, Award, TrendingUp } from "lucide-react";
import {
  getKontributorCount,
  getPertemuanCount,
} from "@/lib/services/serviceAll";

export default function Stats() {
  interface Stat {
    totalKontributor: number;
    totalPertemuan: number;
  }
  const [totalCount, setTotalCount] = useState<Stat>({
    totalKontributor: 0,
    totalPertemuan: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [countPertemuan, countKontributor] = await Promise.all([
          getPertemuanCount(),
          getKontributorCount(),
        ]);

        setTotalCount({
          totalKontributor: countKontributor,
          totalPertemuan: countPertemuan,
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui.");
          // console.error("Caught an unknown error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading data</p>
          </div>
        </div>
      </section>
    );

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const statistics = [
    {
      icon: Users,
      value: `${totalCount.totalKontributor}+`,
      label: "Member Aktif",
    },
    {
      icon: Calendar,
      value: `${totalCount.totalPertemuan}+`,
      label: "Events Dilaksanakan",
    },
    {
      icon: Award,
      value: "11+",
      label: "Sertifikat Diraih",
    },
    {
      icon: TrendingUp,
      value: "99%",
      label: "Tingkat Partisipasi",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statistics.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-card rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in border border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="w-6 h-6 dark:text-white" />
                </div>

                {/* Value */}
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm md:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
