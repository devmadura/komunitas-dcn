import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if it's a UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq(isUUID ? "id" : "slug", id)
      .single();

    if (error || !data) {
      console.error("Event lookup error:", error, "param:", id, "isUUID:", isUUID);
      return NextResponse.json(
        { error: "Event tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePermission(PERMISSIONS.EVENTS);
    if ("error" in authResult) return authResult.error;
    const { admin } = authResult;

    const { id } = await params;
    const body = await request.json();
    const { judul, deskripsi, tanggal, waktu, lokasi, tipe, gambar, gambar_uuid, is_published } = body;

    if (!judul || !tanggal) {
      return NextResponse.json(
        { error: "Judul dan tanggal wajib diisi" },
        { status: 400 }
      );
    }

    // Get current event to check if image changed
    const { data: currentEvent } = await supabase
      .from("events")
      .select("gambar_uuid")
      .eq("id", id)
      .single();

    // Delete old image from UploadCare if image changed
    if (currentEvent?.gambar_uuid && currentEvent.gambar_uuid !== gambar_uuid) {
      await deleteUploadcareFile(currentEvent.gambar_uuid);
    }

    const { data, error } = await supabase
      .from("events")
      .update({
        judul,
        deskripsi,
        tanggal,
        waktu,
        lokasi,
        tipe,
        gambar,
        gambar_uuid,
        is_published,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await logActivity(
      "update_event",
      admin.email,
      `Mengupdate event: ${judul}`,
      { event_id: id },
      admin.nama
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requirePermission(PERMISSIONS.EVENTS);
    if ("error" in authResult) return authResult.error;
    const { admin } = authResult;

    const { id } = await params;

    // Get event data including gambar_uuid
    const { data: event } = await supabase
      .from("events")
      .select("judul, gambar_uuid")
      .eq("id", id)
      .single();

    // Delete image from UploadCare first
    if (event?.gambar_uuid) {
      await deleteUploadcareFile(event.gambar_uuid);
    }

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) throw error;

    await logActivity(
      "delete_event",
      admin.email,
      `Menghapus event: ${event?.judul || id}`,
      { event_id: id },
      admin.nama
    );

    return NextResponse.json({ message: "Event berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Gagal menghapus event" },
      { status: 500 }
    );
  }
}
