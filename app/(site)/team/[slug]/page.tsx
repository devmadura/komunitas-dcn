import TeamDetail from "@/components/TeamDetail";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

const siteUrl = "https://dcnunira.dev";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const { data: member } = await supabase
        .from("admins")
        .select("nama, label, bio, photo_url, skills, is_active")
        .eq("slug", slug)
        .single();

    if (!member) {
        return {
            title: "Member Not Found - DCN Unira",
            description: "Member tidak ditemukan di DCN Unira",
        };
    }

    const memberTitle = member.nama;
    const memberDescription = member.bio
        ? member.bio.substring(0, 160)
        : `${member.nama}${member.label ? `, ${member.label}` : ""} - ${member.is_active !== false ? "Active Member" : "Alumni"} DCN Unira (Dicoding Community Network Universitas Madura). Komunitas developer dan tech enthusiast di Universitas Madura.`;

    const memberImage = member.photo_url || `${siteUrl}/og-image.png`;
    const memberUrl = `${siteUrl}/team/${slug}`;

    // Generate keywords from skills and basic info
    const keywords = [
        "dcn unira",
        "core team dcn unira",
        "alumni dcn unira",
        member.nama,
        member.label || "",
        ...(member.skills || []),
        member.is_active !== false ? "Active Member" : "Alumni",
    ].filter(Boolean);

    return {
        title: memberTitle,
        description: memberDescription,
        keywords: keywords.join(", "),
        authors: [{ name: member.nama }],
        creator: member.nama,
        publisher: "DCN Unira",
        alternates: {
            canonical: memberUrl,
        },
        openGraph: {
            type: "profile",
            url: memberUrl,
            title: memberTitle,
            description: memberDescription,
            images: [
                {
                    url: memberImage,
                    width: 1200,
                    height: 630,
                    alt: `${member.nama} - DCN Unira`,
                },
            ],
            siteName: "DCN UNIRA",
            locale: "id_ID",
        },
        twitter: {
            card: "summary_large_image",
            title: memberTitle,
            description: memberDescription,
            images: [memberImage],
            creator: "@dev_dcnunira",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

export default async function TeamMemberPage({ params }: PageProps) {
    const { slug } = await params;
    return <TeamDetail slug={slug} />;
}
