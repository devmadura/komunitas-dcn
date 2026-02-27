import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission, getCurrentAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/axiom";
import { PERMISSIONS } from "@/lib/permissions";

async function deleteUploadcareFile(uuid: string): Promise<boolean> {
    const secretKey = process.env.UPLOADCARE_SECRET_KEY;
    const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

    if (!secretKey || !uuid) return false;

    try {
        const response = await fetch("https://api.uploadcare.com/files/storage/", {
            method: "DELETE",
            headers: {
                Authorization: `Uploadcare.Simple ${publicKey}:${secretKey}`,
                "Content-Type": "application/json",
                Accept: "application/vnd.uploadcare-v0.7+json",
            },
            body: JSON.stringify([uuid]),
        });
        return response.ok;
    } catch (error) {
        console.error("Error deleting Uploadcare file:", error);
        return false;
    }
}

// GET — detail post by id atau slug (public)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        const { data, error } = await supabase
            .from("blog_posts")
            .select(`*, penulis:admins!blog_posts_penulis_id_fkey(nama, photo_url, label)`)
            .eq(isUUID ? "id" : "slug", id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Blog post tidak ditemukan" }, { status: 404 });
        }

        // Increment views jika published
        if (data.status === "published") {
            await supabase
                .from("blog_posts")
                .update({ views: (data.views || 0) + 1 })
                .eq("id", data.id);
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return NextResponse.json({ error: "Gagal mengambil data blog" }, { status: 500 });
    }
}

// PUT — edit post (hanya penulis sendiri atau super-admin)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requirePermission(PERMISSIONS.BLOG);
        if ("error" in authResult) return authResult.error;
        const { admin } = authResult;

        const { id } = await params;
        const body = await request.json();
        const { judul, konten, excerpt, cover_image, cover_image_uuid, kategori, tags, status } = body;

        if (!judul || !konten) {
            return NextResponse.json({ error: "Judul dan konten wajib diisi" }, { status: 400 });
        }

        // Ambil post yang ada
        const { data: existingPost } = await supabase
            .from("blog_posts")
            .select("penulis_id, cover_image_uuid, status")
            .eq("id", id)
            .single();

        if (!existingPost) {
            return NextResponse.json({ error: "Blog post tidak ditemukan" }, { status: 404 });
        }

        // Co-admin hanya bisa edit post miliknya sendiri
        if (admin.role !== "super-admin" && existingPost.penulis_id !== admin.id) {
            return NextResponse.json({ error: "Anda tidak bisa mengedit post milik orang lain" }, { status: 403 });
        }

        // Co-admin tidak bisa langsung set status ke published
        let finalStatus = status;
        if (admin.role !== "super-admin" && status === "published") {
            finalStatus = existingPost.status; // Tetap status lama
        }

        // Hapus gambar lama jika diganti
        if (existingPost.cover_image_uuid && existingPost.cover_image_uuid !== cover_image_uuid) {
            await deleteUploadcareFile(existingPost.cover_image_uuid);
        }

        const { data, error } = await supabase
            .from("blog_posts")
            .update({
                judul,
                konten,
                excerpt: excerpt || null,
                cover_image: cover_image || null,
                cover_image_uuid: cover_image_uuid || null,
                kategori: kategori || null,
                tags: tags || null,
                status: finalStatus,
                // Reset catatan revisi jika di-resubmit ke pending
                ...(finalStatus === "pending" ? { catatan_revisi: null } : {}),
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        await logActivity(
            "update_blog",
            admin.email,
            `Mengupdate blog: ${judul}`,
            { blog_id: id, status: finalStatus },
            admin.nama
        );

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error updating blog post:", error);
        return NextResponse.json({ error: "Gagal mengupdate blog post" }, { status: 500 });
    }
}

// DELETE — hapus post (penulis atau super-admin)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requirePermission(PERMISSIONS.BLOG);
        if ("error" in authResult) return authResult.error;
        const { admin } = authResult;

        const { id } = await params;

        const { data: post } = await supabase
            .from("blog_posts")
            .select("judul, cover_image_uuid, penulis_id")
            .eq("id", id)
            .single();

        if (!post) {
            return NextResponse.json({ error: "Blog post tidak ditemukan" }, { status: 404 });
        }

        // Co-admin hanya bisa hapus post miliknya sendiri
        if (admin.role !== "super-admin" && post.penulis_id !== admin.id) {
            return NextResponse.json({ error: "Anda tidak bisa menghapus post milik orang lain" }, { status: 403 });
        }

        // Hapus gambar dari Uploadcare
        if (post.cover_image_uuid) {
            await deleteUploadcareFile(post.cover_image_uuid);
        }

        const { error } = await supabase.from("blog_posts").delete().eq("id", id);
        if (error) throw error;

        await logActivity(
            "delete_blog",
            admin.email,
            `Menghapus blog: ${post.judul}`,
            { blog_id: id },
            admin.nama
        );

        return NextResponse.json({ message: "Blog post berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        return NextResponse.json({ error: "Gagal menghapus blog post" }, { status: 500 });
    }
}
