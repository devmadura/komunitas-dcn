import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission, requireAuth } from "@/lib/auth";
import { logActivity } from "@/lib/axiom";
import { PERMISSIONS } from "@/lib/permissions";

function generateSlug(judul: string): string {
    return judul
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
        + "-" + Date.now().toString(36);
}

// GET — public list, filter by status & kategori
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "published";
        const kategori = searchParams.get("kategori");
        const limit = parseInt(searchParams.get("limit") || "20");
        const page = parseInt(searchParams.get("page") || "1");
        const offset = (page - 1) * limit;

        let query = supabase
            .from("blog_posts")
            .select(
                `*, penulis:admins!blog_posts_penulis_id_fkey(nama, photo_url, label)`,
                { count: "exact" }
            )
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (status !== "all") {
            query = query.eq("status", status);
        }
        if (kategori) {
            query = query.eq("kategori", kategori);
        }

        // Kalau bukan public (non-published), harus auth dan filter by role
        if (status !== "published") {
            const authResult = await requireAuth();
            if ("error" in authResult) return authResult.error;
            const { admin } = authResult;

            // co-admin hanya bisa lihat miliknya sendiri
            if (admin.role !== "super-admin") {
                query = query.eq("penulis_id", admin.id);
            }
        }

        const { data, error, count } = await query;

        if (error) throw error;

        return NextResponse.json({ data: data || [], total: count || 0, page, limit });
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json({ error: "Gagal mengambil data blog" }, { status: 500 });
    }
}

// POST — buat blog baru (butuh permission BLOG)
export async function POST(request: Request) {
    try {
        const authResult = await requirePermission(PERMISSIONS.BLOG);
        if ("error" in authResult) return authResult.error;
        const { admin } = authResult;

        const body = await request.json();
        const { judul, konten, excerpt, cover_image, cover_image_uuid, kategori, tags, status } = body;

        if (!judul || !konten) {
            return NextResponse.json({ error: "Judul dan konten wajib diisi" }, { status: 400 });
        }

        // Validasi status: co-admin hanya bisa draft/pending, tidak bisa langsung published
        const allowedStatuses = ["draft", "pending"];
        let finalStatus: string = "draft";
        if (status && allowedStatuses.includes(status)) {
            finalStatus = status;
        } else if (status === "published" && admin.role === "super-admin") {
            finalStatus = "published";
        }

        // Generate unique slug dari judul
        let slug = generateSlug(judul);

        const { data, error } = await supabase
            .from("blog_posts")
            .insert({
                slug,
                judul,
                konten,
                excerpt: excerpt || null,
                cover_image: cover_image || null,
                cover_image_uuid: cover_image_uuid || null,
                penulis_id: admin.id,
                kategori: kategori || null,
                tags: tags || null,
                status: finalStatus,
                views: 0,
            })
            .select()
            .single();

        if (error) throw error;

        await logActivity(
            "create_blog",
            admin.email,
            `Membuat blog: ${judul}`,
            { blog_id: data.id },
            admin.nama
        );

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("Error creating blog post:", error);
        return NextResponse.json({ error: "Gagal membuat blog post" }, { status: 500 });
    }
}
