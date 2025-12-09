import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/axiom";
import { Permission } from "@/lib/permissions";

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

// GET - Fetch all admins
export async function GET() {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      currentAdmin.role !== "super-admin" &&
      !currentAdmin.permissions?.includes("manage_admin")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ admins: data });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST - Create new admin
export async function POST(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentAdmin.role !== "super-admin") {
      return NextResponse.json(
        { error: "Hanya super-admin yang bisa menambah admin" },
        { status: 403 }
      );
    }

    const { email, nama, password, permissions } = await request.json();

    if (!email || !nama || !password) {
      return NextResponse.json(
        { error: "Email, nama, dan password harus diisi" },
        { status: 400 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Insert into admins table
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .insert({
        user_id: authData.user?.id,
        email,
        nama,
        role: "co-admin",
        permissions: permissions || [],
      })
      .select()
      .single();

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 400 });
    }

    // Log activity
    await logActivity(
      "create_admin",
      currentAdmin.email,
      `Menambahkan co-admin baru: ${nama} (${email})`,
      { new_admin_id: adminData.id, permissions },
      currentAdmin.nama
    );

    return NextResponse.json({ admin: adminData });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PUT - Update admin
export async function PUT(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentAdmin.role !== "super-admin") {
      return NextResponse.json(
        { error: "Hanya super-admin yang bisa mengubah admin" },
        { status: 403 }
      );
    }

    const { id, nama, permissions } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID admin harus diisi" },
        { status: 400 }
      );
    }

    const updateData: { nama?: string; permissions?: Permission[]; updated_at: string } = {
      updated_at: new Date().toISOString(),
    };

    if (nama) updateData.nama = nama;
    if (permissions) updateData.permissions = permissions;

    const { data, error } = await supabase
      .from("admins")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logActivity(
      "update_admin",
      currentAdmin.email,
      `Mengubah data admin: ${data.nama} (${data.email})`,
      { admin_id: id, permissions },
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

// DELETE - Delete admin
export async function DELETE(request: Request) {
  try {
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentAdmin.role !== "super-admin") {
      return NextResponse.json(
        { error: "Hanya super-admin yang bisa menghapus admin" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID admin harus diisi" },
        { status: 400 }
      );
    }

    // Get admin data before delete for logging
    const { data: adminToDelete } = await supabase
      .from("admins")
      .select("*")
      .eq("id", id)
      .single();

    if (!adminToDelete) {
      return NextResponse.json(
        { error: "Admin tidak ditemukan" },
        { status: 404 }
      );
    }

    if (adminToDelete.role === "super-admin") {
      return NextResponse.json(
        { error: "Tidak bisa menghapus super-admin" },
        { status: 403 }
      );
    }

    const { error } = await supabase.from("admins").delete().eq("id", id);

    if (error) throw error;

    // Log activity
    await logActivity(
      "delete_admin",
      currentAdmin.email,
      `Menghapus admin: ${adminToDelete.nama} (${adminToDelete.email})`,
      { deleted_admin_id: id },
      currentAdmin.nama
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
