import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Tag, ChevronLeft, User } from "lucide-react";
import type { BlogPostWithAuthor } from "@/lib/supabase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/ShareButtons";
import { BlogContentView } from "@/components/BlogContentView";

export const revalidate = 60;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const { data: post } = await supabase
        .from("blog_posts")
        .select("judul, excerpt, cover_image, tags")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!post) return { title: "Artikel tidak ditemukan" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dcn-unira.com";
    const postUrl = `${siteUrl}/blog/${slug}`;
    const cleanExcerpt = post.excerpt ? post.excerpt.substring(0, 160) : "Membaca artikel menarik seputar teknologi, tutorial, dan update DCN Unira.";

    return {
        title: post.judul,
        description: cleanExcerpt,
        keywords: post.tags?.length ? post.tags : ["Dicoding community network", "universitas madura", "Blog", "Teknologi", "Tutorial", "Mahasiswa", "DCN UNIRA"],
        authors: [{ name: "Team DCN Unira" }],
        creator: "DCN Unira",
        publisher: "DCN Unira",
        metadataBase: new URL(siteUrl),
        openGraph: {
            title: post.judul,
            description: cleanExcerpt,
            url: postUrl,
            siteName: "DCN Unira Blog",
            type: "article",
            images: post.cover_image ? [{
                url: post.cover_image,
                width: 1200,
                height: 630,
                alt: post.judul
            }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.judul,
            description: cleanExcerpt,
            images: post.cover_image ? [post.cover_image] : [],
            creator: "@dcn.unira",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        }
    };
}

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const { data: post } = await supabase
        .from("blog_posts")
        .select(`*, penulis:admins!blog_posts_penulis_id_fkey(nama, photo_url, label)`)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!post) notFound();

    const typedPost = post as unknown as BlogPostWithAuthor;

    const { data: related } = typedPost.kategori
        ? await supabase
            .from("blog_posts")
            .select("id, slug, judul, cover_image, created_at")
            .eq("status", "published")
            .eq("kategori", typedPost.kategori)
            .neq("id", typedPost.id)
            .limit(3)
        : { data: [] };

    return (
        <main className="min-h-screen bg-background py-20 mt-9 md:mt-12">
            <div className="max-w-4xl mx-auto px-4">
                <Link href="/blog" className="inline-block mb-8">
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                        Kembali ke Blog
                    </Button>
                </Link>

                <article className="animate-fade-in">
                    {typedPost.cover_image && (
                        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-10 shadow-lg">
                            <Image
                                src={typedPost.cover_image}
                                alt={typedPost.judul}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto">
                        {/* Kategori */}
                        {typedPost.kategori && (
                            <Link href={`/blog?kategori=${encodeURIComponent(typedPost.kategori)}`}>
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-6 hover:bg-primary/20 transition-colors cursor-pointer">
                                    <Tag className="w-3.5 h-3.5" />
                                    {typedPost.kategori}
                                </span>
                            </Link>
                        )}

                        {/* Judul */}
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                            {typedPost.judul}
                        </h1>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50">
                            <div className="flex items-center gap-3">
                                {typedPost.penulis?.photo_url ? (
                                    <Image
                                        src={typedPost.penulis.photo_url}
                                        alt={typedPost.penulis.nama}
                                        width={44}
                                        height={44}
                                        className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                                    />
                                ) : (
                                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-foreground">{typedPost.penulis?.nama}</p>
                                    <p className="text-xs text-muted-foreground">{typedPost.penulis?.label || "Penulis"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 ml-auto md:ml-0">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {new Date(typedPost.created_at).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Eye className="w-4 h-4 text-secondary" />
                                    {typedPost.views}jt views
                                </span>
                            </div>
                        </div>

                        {/* Konten */}
                        <BlogContentView html={typedPost.konten} />

                        {/* Tags */}
                        {typedPost.tags && typedPost.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-7 pt-7 ">
                                {typedPost.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3.5 py-1 text-xs font-semibold bg-muted text-muted-foreground rounded-full hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Share & Actions */}
                        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <ShareButtons url={`/blog/${typedPost.slug}`} title={typedPost.judul} />
                        </div>
                    </div>
                </article>

                {/* Artikel Terkait */}
                {related && related.length > 0 && (
                    <section className="mt-20 pt-10">
                        <h2 className="text-2xl font-bold text-foreground mb-8">Baca Juga</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {related.map((r) => (
                                <Link key={r.id} href={`/blog/${r.slug}`}>
                                    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
                                        {r.cover_image ? (
                                            <div className="relative h-40 overflow-hidden bg-muted">
                                                <Image
                                                    src={r.cover_image}
                                                    alt={r.judul}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-40 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
                                                <span className="text-3xl">📝</span>
                                            </div>
                                        )}
                                        <CardHeader className="p-4 pb-2">
                                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base line-clamp-2">
                                                {r.judul}
                                            </h3>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0 mt-auto">
                                            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2 border-t border-border/50 pt-3">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
