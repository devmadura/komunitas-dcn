import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/axiom";

async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  if (!user) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("email", user.email)
    .single();

  return admin;
}

async function deleteUploadcareFile(
  uuid: string
): Promise<{ success: boolean; message: string }> {
  const secretKey = process.env.UPLOADCARE_SECRET_KEY;
  const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

  if (!secretKey) {
    console.error("UPLOADCARE_SECRET_KEY is not configured");
    return {
      success: false,
      message: "Konfigurasi Uploadcare tidak ditemukan",
    };
  }
  if (!uuid) {
    return { success: false, message: "UUID foto tidak valid" };
  }

  try {
    // Use batch delete endpoint for API v0.7
    const response = await fetch("https://api.uploadcare.com/files/storage/", {
      method: "DELETE",
      headers: {
        Authorization: `Uploadcare.Simple ${publicKey}:${secretKey}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.uploadcare-v0.7+json",
      },
      body: JSON.stringify([uuid]),
    });

    if (response.ok) {
      return {
        success: true,
        message: "Foto berhasil dihapus dari Uploadcare",
      };
    } else {
      const errorText = await response.text();
      console.error("Uploadcare delete error:", response.status, errorText);
      return {
        success: false,
        message: `Gagal menghapus dari Uploadcare: ${response.status}`,
      };
    }
  } catch (error) {
    console.error("Error deleting Uploadcare file:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus dari Uploadcare",
    };
  }
}

// PUT - Update current admin profile
export async function PUT(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nama, label, photo_url, photo_uuid, social_media } =
      await request.json();

    if (!nama) {
      return NextResponse.json({ error: "Nama harus diisi" }, { status: 400 });
    }

    // If photo changed and old photo exists, delete from Uploadcare
    if (currentAdmin.photo_uuid && currentAdmin.photo_uuid !== photo_uuid) {
      const result = await deleteUploadcareFile(currentAdmin.photo_uuid);
      if (!result.success) {
        console.warn(
          "Failed to delete old photo from Uploadcare:",
          result.message
        );
      }
    }

    const updateData = {
      nama,
      label: label || null,
      photo_url: photo_url || null,
      photo_uuid: photo_uuid || null,
      social_media: social_media || null,
      updated_at: new Date().toISOString(),
    };

    // console.log("Updating admin profile:", { id: currentAdmin.id, updateData });

    const { data, error } = await supabase
      .from("admins")
      .update(updateData)
      .eq("id", currentAdmin.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // console.log("Update result:", data);

    await logActivity(
      "update_profile",
      currentAdmin.email,
      `Memperbarui profil akun`,
      { admin_id: currentAdmin.id },
      currentAdmin.nama
    );

    return NextResponse.json({ admin: data });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE - Remove photo only
export async function DELETE(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photo_uuid } = await request.json();

    if (!photo_uuid) {
      return NextResponse.json(
        { error: "photo_uuid harus diisi" },
        { status: 400 }
      );
    }

    // Delete from Uploadcare first
    const uploadcareResult = await deleteUploadcareFile(photo_uuid);
    if (!uploadcareResult.success) {
      return NextResponse.json(
        { error: uploadcareResult.message },
        { status: 500 }
      );
    }

    // Update database only if Uploadcare deletion succeeded
    const { error } = await supabase
      .from("admins")
      .update({
        photo_url: null,
        photo_uuid: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentAdmin.id);

    if (error) throw error;

    await logActivity(
      "delete_photo",
      currentAdmin.email,
      `Menghapus foto profil`,
      { admin_id: currentAdmin.id },
      currentAdmin.nama
    );

    return NextResponse.json({
      success: true,
      message: "Foto berhasil dihapus dari Uploadcare dan database",
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
