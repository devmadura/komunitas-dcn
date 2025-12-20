import { NextResponse } from "next/server";
import { supabase, GaleriImage } from "@/lib/supabase";
import { requirePermission } from "@/lib/auth";
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

async function deleteMultipleUploadcareFiles(uuids: string[]): Promise<void> {
  const validUuids = uuids.filter(Boolean);
  for (const uuid of validUuids) {
    await deleteUploadcareFile(uuid);
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("galeri")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Galeri tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching galeri:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data galeri" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePermission(PERMISSIONS.GALERI);
    if ("error" in authResult) return authResult.error;
    const { admin } = authResult;

    const { id } = await params;
    const body = await request.json();
    const { title, cover_image, cover_image_uuid, images, is_published } = body;

    if (!title || !cover_image) {
      return NextResponse.json(
        { error: "Title dan cover image wajib diisi" },
        { status: 400 }
      );
    }

    const { data: currentGaleri } = await supabase
      .from("galeri")
      .select("cover_image_uuid, images")
      .eq("id", id)
      .single();

    if (currentGaleri?.cover_image_uuid && currentGaleri.cover_image_uuid !== cover_image_uuid) {
      await deleteUploadcareFile(currentGaleri.cover_image_uuid);
    }

    if (currentGaleri?.images && Array.isArray(currentGaleri.images)) {
      const oldUuids = (currentGaleri.images as GaleriImage[]).map((img) => img.uuid);
      const newUuids = (images as GaleriImage[]).map((img) => img.uuid);
      const removedUuids = oldUuids.filter((uuid) => !newUuids.includes(uuid));
      await deleteMultipleUploadcareFiles(removedUuids);
    }

    const { data, error } = await supabase
      .from("galeri")
      .update({
        title,
        cover_image,
        cover_image_uuid,
        images,
        is_published,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await logActivity(
      "update_galeri",
      admin.email,
      `Mengupdate album galeri: ${title}`,
      { galeri_id: id },
      admin.nama
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating galeri:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate galeri" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePermission(PERMISSIONS.GALERI);
    if ("error" in authResult) return authResult.error;
    const { admin } = authResult;

    const { id } = await params;

    const { data: galeri } = await supabase
      .from("galeri")
      .select("title, cover_image_uuid, images")
      .eq("id", id)
      .single();

    if (galeri?.cover_image_uuid) {
      await deleteUploadcareFile(galeri.cover_image_uuid);
    }

    if (galeri?.images && Array.isArray(galeri.images)) {
      const imageUuids = (galeri.images as GaleriImage[]).map((img) => img.uuid);
      await deleteMultipleUploadcareFiles(imageUuids);
    }

    const { error } = await supabase.from("galeri").delete().eq("id", id);

    if (error) throw error;

    await logActivity(
      "delete_galeri",
      admin.email,
      `Menghapus album galeri: ${galeri?.title || id}`,
      { galeri_id: id },
      admin.nama
    );

    return NextResponse.json({ message: "Galeri berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting galeri:", error);
    return NextResponse.json(
      { error: "Gagal menghapus galeri" },
      { status: 500 }
    );
  }
}
