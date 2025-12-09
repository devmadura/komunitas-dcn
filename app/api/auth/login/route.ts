import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { logActivity } from "@/lib/axiom";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("auth-token", data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    // Get admin info for logging
    const { data: admin } = await supabase
      .from("admins")
      .select("nama")
      .eq("email", email)
      .single();

    // Log login activity
    await logActivity(
      "login",
      email,
      `Login ke dashboard`,
      undefined,
      admin?.nama
    );

    return NextResponse.json({ success: true, user: data.user });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
