"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Instagram, Linkedin, Github, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { truncateText } from "@/lib/teamUtils";

interface SocialMedia {
  instagram?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
}

interface Admin {
  id: string;
  nama: string;
  email: string;
  role: string;
  label?: string;
  photo_url?: string;
  social_media?: SocialMedia;
  created_at: string;
  slug?: string;
  bio?: string;
  skills?: string[];
  is_active?: boolean;
  join_date?: string;
}

export default function CoreTeam() {
  const [team, setTeam] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "alumni">("active");

  useEffect(() => {
    async function fetchTeam() {
      const { data, error } = await supabase
        .from("admins")
        .select(
          "id, nama, email, role, label, photo_url, social_media, created_at, slug, bio, skills, is_active, join_date"
        )
        .order("created_at", { ascending: true });

      if (!error && data) {
        setTeam(data);
      }
      setLoading(false);
    }
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Core Team
            <span className="block mt-2 bg-linear-to-r from-blue-400 to-yellow-200 bg-clip-text text-transparent py-2">
              DCN Unira
            </span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Kenali orang-orang di balik komunitas DCN Unira yang berdedikasi
            untuk membangun ekosistem developer di Universitas Madura.
          </p>

          {/* Tab Toggle */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === "active"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 scale-105"
                : "bg-card text-muted-foreground hover:bg-primary/10 hover:text-foreground border border-border"
                }`}
            >
              Active Core Team
            </button>
            <button
              onClick={() => setActiveTab("alumni")}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === "alumni"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40 scale-105"
                : "bg-card text-muted-foreground hover:bg-primary/10 hover:text-foreground border border-border"
                }`}
            >
              Alumni
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team
            .filter((member) =>
              activeTab === "active"
                ? member.is_active !== false
                : member.is_active === false
            )
            .map((member, index) => (
              <Link
                key={member.id}
                href={`/team/${member.slug || member.id}`}
                className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 animate-fade-in block cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.nama}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                        <User className="w-12 h-12 dark:text-white" />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h4 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                      {member.nama}
                    </h4>

                    {member.label && (
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
                        {member.label}
                      </span>
                    )}

                    {/* Bio Preview
                    {member.bio && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 px-2">
                        {truncateText(member.bio, 80)}
                      </p>
                    )} */}

                    {member.social_media && (
                      <div className="flex justify-center gap-3">
                        {member.social_media.instagram && (
                          <a
                            href={member.social_media.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-pink-500 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {member.social_media.linkedin && (
                          <a
                            href={member.social_media.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin className="w-5 h-5" />
                          </a>
                        )}
                        {member.social_media.github && (
                          <a
                            href={member.social_media.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {member.social_media.twitter && (
                          <a
                            href={member.social_media.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-sky-500 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Empty State - Tab Specific */}
        {team.filter((member) =>
          activeTab === "active"
            ? member.is_active !== false
            : member.is_active === false
        ).length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {activeTab === "active" ? "Belum Ada Active Member" : "Belum Ada Alumni"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {activeTab === "active"
                  ? "Saat ini belum ada data active core team member."
                  : "Saat ini belum ada data alumni. Semua member masih aktif berkontribusi di DCN Unira! 🎉"}
              </p>
            </div>
          )}
      </div>
    </section>
  );
}
