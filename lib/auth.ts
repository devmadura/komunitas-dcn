import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Admin, Permission, hasPermission } from "@/lib/permissions";

export async function getCurrentAdmin(): Promise<Admin | null> {
  try {
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

    // Jika tidak ada di tabel admins, return null (tidak punya akses)
    if (!admin) return null;

    return admin;
  } catch {
    return null;
  }
}

// Helper untuk proteksi API dengan permission check
export async function requireAuth(): Promise<{ admin: Admin } | { error: NextResponse }> {
  const admin = await getCurrentAdmin();
  
  if (!admin) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - Silakan login kembali" },
        { status: 401 }
      ),
    };
  }

  return { admin };
}

export async function requirePermission(
  permission: Permission
): Promise<{ admin: Admin } | { error: NextResponse }> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - Silakan login kembali" },
        { status: 401 }
      ),
    };
  }

  if (!hasPermission(admin, permission)) {
    return {
      error: NextResponse.json(
        { error: "Forbidden - Anda tidak memiliki akses ke fitur ini" },
        { status: 403 }
      ),
    };
  }

  return { admin };
}

export async function requireSuperAdmin(): Promise<{ admin: Admin } | { error: NextResponse }> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized - Silakan login kembali" },
        { status: 401 }
      ),
    };
  }

  if (admin.role !== "super-admin") {
    return {
      error: NextResponse.json(
        { error: "Forbidden - Hanya super-admin yang bisa mengakses" },
        { status: 403 }
      ),
    };
  }

  return { admin };
}
