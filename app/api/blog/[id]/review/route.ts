import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireSuperAdmin } from "@/lib/auth";
import { logActivity, ActivityAction } from "@/lib/axiom";

// POST — super-admin review: approve, reject (back to draft), atau revision
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authResult = await requireSuperAdmin();
        if ("error" in authResult) return authResult.error;
        const { admin } = authResult;

        const { id } = await params;
        const body = await request.json();
        const { action, catatan_revisi } = body;

        // action: "publish" | "revision" | "reject"
        if (!["publish", "revision", "reject"].includes(action)) {
            return NextResponse.json({ error: "Action tidak valid. Gunakan: publish, revision, atau reject" }, { status: 400 });
        }

        // Cek post ada & statusnya pending
        const { data: post } = await supabase
            .from("blog_posts")
            .select("judul, status")
            .eq("id", id)
            .single();

        if (!post) {
            return NextResponse.json({ error: "Blog post tidak ditemukan" }, { status: 404 });
        }

        if (post.status !== "pending") {
            return NextResponse.json(
                { error: `Post tidak bisa di-review karena statusnya '${post.status}', harus 'pending'` },
                { status: 400 }
            );
        }

        let newStatus: string;
        let logAction: ActivityAction;
        let logDesc: string;

        if (action === "publish") {
            newStatus = "published";
            logAction = "publish_blog";
            logDesc = `Mempublish blog: ${post.judul}`;
        } else if (action === "revision") {
            if (!catatan_revisi) {
                return NextResponse.json({ error: "Catatan revisi wajib diisi" }, { status: 400 });
            }
            newStatus = "revision";
            logAction = "revision_blog";
            logDesc = `Mengembalikan blog untuk direvisi: ${post.judul}`;
        } else {
            // reject → kembali ke draft
            newStatus = "draft";
            logAction = "reject_blog";
            logDesc = `Menolak blog: ${post.judul}`;
        }

        const { data, error } = await supabase
            .from("blog_posts")
            .update({
                status: newStatus,
                catatan_revisi: action === "revision" ? catatan_revisi : null,
                reviewed_by: admin.id,
                reviewed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        await logActivity(logAction, admin.email, logDesc, { blog_id: id }, admin.nama);

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reviewing blog post:", error);
        return NextResponse.json({ error: "Gagal memproses review blog" }, { status: 500 });
    }
}
