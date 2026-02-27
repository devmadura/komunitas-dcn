import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, Tag, ChevronLeft, User } from "lucide-react";
import type { BlogPostWithAuthor } from "@/lib/supabase";

export const revalidate = 60;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const { data: post } = await supabase
        .from("blog_posts")
        .select("judul, excerpt, cover_image")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

    if (!post) return { title: "Artikel tidak ditemukan | DCN UNIRA" };

    return {
        title: `${post.judul} | Blog DCN UNIRA`,
        description: post.excerpt || undefined,
        openGraph: {
            title: post.judul,
            description: post.excerpt || undefined,
            images: post.cover_image ? [post.cover_image] : undefined,
        },
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

    // Artikel terkait (sama kategori)
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
        <main className="max-w-4xl mx-auto px-4 py-12">
            {/* Back */}
            <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-8 transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Blog
            </Link>

            <article>
                {/* Cover */}
                {typedPost.cover_image && (
                    <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8">
                        <Image
                            src={typedPost.cover_image}
                            alt={typedPost.judul}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Kategori */}
                {typedPost.kategori && (
                    <Link
                        href={`/blog?kategori=${encodeURIComponent(typedPost.kategori)}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4"
                    >
                        <Tag className="w-3 h-3" />
                        {typedPost.kategori}
                    </Link>
                )}

                {/* Judul */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                    {typedPost.judul}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b">
                    <div className="flex items-center gap-2">
                        {typedPost.penulis?.photo_url ? (
                            <Image
                                src={typedPost.penulis.photo_url}
                                alt={typedPost.penulis.nama}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-indigo-500" />
                            </div>
                        )}
                        <div>
                            <p className="font-medium text-gray-700">{typedPost.penulis?.nama}</p>
                            {typedPost.penulis?.label && (
                                <p className="text-xs text-gray-400">{typedPost.penulis.label}</p>
                            )}
                        </div>
                    </div>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(typedPost.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {typedPost.views} views
                    </span>
                </div>

                {/* Konten */}
                <div
                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-indigo-600 prose-img:rounded-xl prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                    dangerouslySetInnerHTML={{ __html: typedPost.konten }}
                />

                {/* Tags */}
                {typedPost.tags && typedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t">
                        {typedPost.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </article>

            {/* Artikel Terkait */}
            {related && related.length > 0 && (
                <section className="mt-16">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Artikel Terkait</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {related.map((r) => (
                            <Link
                                key={r.id}
                                href={`/blog/${r.slug}`}
                                className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                            >
                                {r.cover_image ? (
                                    <div className="relative h-36 overflow-hidden">
                                        <Image
                                            src={r.cover_image}
                                            alt={r.judul}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-36 bg-gradient-to-br from-indigo-50 to-purple-50" />
                                )}
                                <div className="p-4">
                                    <p className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                        {r.judul}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
