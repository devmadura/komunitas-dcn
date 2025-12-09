import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/axiom";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    // Get user info before logout for logging
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user?.email) {
        const { data: admin } = await supabase
          .from("admins")
          .select("nama")
          .eq("email", user.email)
          .single();

        await logActivity(
          "logout",
          user.email,
          "Logout dari dashboard",
          undefined,
          admin?.nama
        );
      }
    }

    cookieStore.delete("auth-token");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
