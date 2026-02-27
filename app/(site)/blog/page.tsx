import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, Tag } from "lucide-react";
import type { BlogPost } from "@/lib/supabase";

export const metadata: Metadata = {
    title: "Blog | DCN UNIRA",
    description: "Artikel, tutorial, dan tips seputar dunia developer dari komunitas DCN UNIRA.",
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
        <main className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900">Blog</h1>
                <p className="text-gray-500 mt-2">Artikel, tutorial, dan tips dari komunitas DCN UNIRA.</p>
            </div>

            {/* Filter Kategori */}
            {uniqueKategoris.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    <Link
                        href="/blog"
                        className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${!kategori ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        Semua
                    </Link>
                    {uniqueKategoris.map((k) => (
                        <Link
                            key={k}
                            href={`/blog?kategori=${encodeURIComponent(k)}`}
                            className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${kategori === k ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {k}
                        </Link>
                    ))}
                </div>
            )}

            {/* Grid artikel */}
            {!posts || posts.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-lg">Belum ada artikel yang dipublish.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(posts as BlogPost[]).map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                        >
                            {post.cover_image ? (
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={post.cover_image}
                                        alt={post.judul}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ) : (
                                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                    <span className="text-5xl">✍️</span>
                                </div>
                            )}
                            <div className="p-5">
                                {post.kategori && (
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2">
                                        <Tag className="w-3 h-3" />
                                        {post.kategori}
                                    </span>
                                )}
                                <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {post.judul}
                                </h2>
                                {post.excerpt && (
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                                )}
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        {post.views} views
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                            key={p}
                            href={`/blog?page=${p}${kategori ? `&kategori=${kategori}` : ""}`}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === p ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
                                }`}
                        >
                            {p}
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
