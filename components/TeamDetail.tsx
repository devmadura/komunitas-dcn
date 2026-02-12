"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Instagram, Linkedin, Github, Twitter, ArrowLeft, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatJoinDate } from "@/lib/teamUtils";

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

interface TeamDetailProps {
    slug: string;
}

export default function TeamDetail({ slug }: TeamDetailProps) {
    const [member, setMember] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchMember() {
            const { data, error } = await supabase
                .from("admins")
                .select(
                    "id, nama, email, role, label, photo_url, social_media, created_at, slug, bio, skills, is_active, join_date"
                )
                .eq("slug", slug)
                .single();

            if (error || !data) {
                setNotFound(true);
            } else {
                setMember(data);
            }
            setLoading(false);
        }
        fetchMember();
    }, [slug]);

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

    if (notFound || !member) {
        return (
            <section className="py-20 md:py-32 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-4">Member Not Found</h1>
                        <p className="text-muted-foreground mb-8">
                            Maaf, member yang Anda cari tidak ditemukan.
                        </p>
                        <Link
                            href="/team"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Team
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 md:py-32 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Back Button */}
                <Link
                    href="/team"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Team
                </Link>

                {/* Member Profile Card */}
                <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl animate-fade-in">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Photo */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 mx-auto md:mx-0">
                            {member.photo_url ? (
                                <Image
                                    src={member.photo_url}
                                    alt={member.nama}
                                    width={160}
                                    height={160}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                                    <User className="w-20 h-20 dark:text-white" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full text-center lg:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 text-center lg:text-left">
                                {member.nama}
                            </h1>

                            {member.label && (
                                <div className="flex justify-center lg:justify-start mb-3">
                                    <span className="inline-block px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary rounded-full">
                                        {member.label}
                                    </span>
                                </div>
                            )}

                            {/* Status Badge */}
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${member.is_active !== false
                                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                        : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                                        }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${member.is_active !== false ? "bg-green-500" : "bg-gray-500"
                                            }`}
                                    ></span>
                                    {member.is_active !== false ? "Active CoreTeam" : "Alumni CoreTeam"}
                                </span>
                            </div>

                            {/* Social Media */}
                            {member.social_media && (
                                <div className="flex gap-3 justify-center lg:justify-start">
                                    {member.social_media.instagram && (
                                        <a
                                            href={member.social_media.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-muted hover:bg-pink-500/10 hover:text-pink-500 transition-colors"
                                        >
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social_media.linkedin && (
                                        <a
                                            href={member.social_media.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-muted hover:bg-blue-600/10 hover:text-blue-600 transition-colors"
                                        >
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social_media.github && (
                                        <a
                                            href={member.social_media.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-muted hover:bg-foreground/10 hover:text-foreground transition-colors"
                                        >
                                            <Github className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social_media.twitter && (
                                        <a
                                            href={member.social_media.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-full bg-muted hover:bg-sky-500/10 hover:text-sky-500 transition-colors"
                                        >
                                            <Twitter className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border my-8"></div>

                    {/* About Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            About
                        </h2>
                        {member.bio ? (
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {member.bio}
                            </p>
                        ) : (
                            <p className="text-muted-foreground italic">Belum ada bio.</p>
                        )}

                        {/* Join Date */}
                        {member.join_date && (
                            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {formatJoinDate(member.join_date)}
                            </div>
                        )}
                    </div>

                    {/* Skills Section */}
                    {member.skills && member.skills.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-foreground mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {member.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
