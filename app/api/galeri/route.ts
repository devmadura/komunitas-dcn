import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission } from "@/lib/auth";
import { logActivity } from "@/lib/axiom";
import { PERMISSIONS } from "@/lib/permissions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");

    let query = supabase
      .from("galeri")
      .select("*")
      .order("created_at", { ascending: false });

    if (published === "true") {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching galeri:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data galeri" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requirePermission(PERMISSIONS.GALERI);
    if ("error" in authResult) return authResult.error;
    const { admin } = authResult;

    const body = await request.json();
    const { title, cover_image, cover_image_uuid, images, is_published } = body;

    if (!title || !cover_image) {
      return NextResponse.json(
        { error: "Title dan cover image wajib diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("galeri")
      .insert([{
        title,
        cover_image,
        cover_image_uuid,
        images: images || [],
        is_published: is_published ?? true,
      }])
      .select()
      .single();

    if (error) throw error;

    await logActivity(
      "create_galeri",
      admin.email,
      `Membuat album galeri baru: ${title}`,
      { galeri_id: data.id },
      admin.nama
    );

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating galeri:", error);
    return NextResponse.json(
      { error: "Gagal membuat galeri" },
      { status: 500 }
    );
  }
}
