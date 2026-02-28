import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPost } from "@/lib/supabase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Blog",
    description: "Kumpulan artikel, tutorial pemrograman, dan tips seputar dunia IT dari Developer Community of Network UNIRA.",
    keywords: ["Blog DCN", "Tutorial Pemrograman", "Tips IT", "Berita Teknologi", "Mahasiswa IT Unira"],
    authors: [{ name: "DCN Unira" }],
    creator: "DCN Unira",
    publisher: "Developer Community of Network UNIRA",
    openGraph: {
        title: "Blog",
        description: "Baca artikel terbaru, tutorial programming mendalam, dan berita seputar dunia teknologi dari Developer Community of Network Universitas Madura.",
        url: "https://dcn-unira.com/blog",
        siteName: "DCN Unira",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog",
        description: "Kumpulan artikel, tutorial pemrograman, dan berita dari Developer Community of Network Universitas Madura.",
        creator: "@dcn_unira",
    },
};

export const revalidate = 60;

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ kategori?: string; page?: string }>;
}) {
    const sp = await searchParams;
    const kategori = sp.kategori;
    const page = parseInt(sp.page || "1");
    const limit = 9;
    const offset = (page - 1) * limit;

    let query = supabase
        .from("blog_posts")
        .select("*", { count: "exact" })
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (kategori) {
        query = query.eq("kategori", kategori);
    }

    const { data: posts, count } = await query;
    const totalPages = Math.ceil((count || 0) / limit);

    const { data: kategoris } = await supabase
        .from("blog_posts")
        .select("kategori")
        .eq("status", "published")
        .not("kategori", "is", null);

    const uniqueKategoris = [...new Set((kategoris || []).map((k) => k.kategori).filter(Boolean))] as string[];

    return (
        <div className="min-h-screen bg-background py-20 mt-9 md:mt-12">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-5">
                        Blogs
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Artikel, tutorial, dan tips seputar dunia teknologi dari komunitas DCN UNIRA.
                    </p>
                </div>

                {/* Filter Kategori */}
                {uniqueKategoris.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        <Link href="/blog">
                            <Button
                                variant={!kategori ? "default" : "outline"}
                                className="rounded-full"
                                size="sm"
                            >
                                Semua
                            </Button>
                        </Link>
                        {uniqueKategoris.map((k) => (
                            <Link key={k} href={`/blog?kategori=${encodeURIComponent(k)}`}>
                                <Button
                                    variant={kategori === k ? "default" : "outline"}
                                    className="rounded-full"
                                    size="sm"
                                >
                                    {k}
                                </Button>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Grid artikel */}
                {!posts || posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">
                            Belum ada artikel yang dipublish.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {(posts as BlogPost[]).map((post, index) => (
                            <Link key={post.id} href={`/blog/${post.slug}`}>
                                <Card
                                    className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in h-full flex flex-col"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Cover Image */}
                                    <div className="relative h-56 overflow-hidden bg-muted">
                                        {post.cover_image ? (
                                            <Image
                                                src={post.cover_image}
                                                alt={post.judul}
                                                fill
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                                <span className="text-5xl">✍️</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />

                                        {post.kategori && (
                                            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/90 backdrop-blur text-black text-xs font-semibold shadow-lg">
                                                {post.kategori}
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="flex-none">
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                            {post.judul}
                                        </h3>
                                    </CardHeader>

                                    <CardContent className="flex flex-col grow space-y-4">
                                        {post.excerpt && (
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                {new Date(post.created_at).toLocaleDateString("id-ID", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1.5 font-medium">
                                                <Eye className="w-3.5 h-3.5 text-secondary" />
                                                {post.views || 0} views
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-16">
                        {page > 1 ? (
                            <Link href={`/blog?page=${page - 1}${kategori ? `&kategori=${kategori}` : ""}`}>
                                <Button variant="outline" size="icon">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="outline" size="icon" disabled>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <Link
                                key={p}
                                href={`/blog?page=${p}${kategori ? `&kategori=${kategori}` : ""}`}
                            >
                                <Button
                                    variant={page === p ? "default" : "outline"}
                                    size="icon"
                                >
                                    {p}
                                </Button>
                            </Link>
                        ))}

                        {page < totalPages ? (
                            <Link href={`/blog?page=${page + 1}${kategori ? `&kategori=${kategori}` : ""}`}>
                                <Button variant="outline" size="icon">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Button variant="outline" size="icon" disabled>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
