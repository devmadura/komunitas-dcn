import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const shouldCount = searchParams.get("count");
  if (shouldCount === "true") {
    const { count, error } = await supabase
      .from("kontributor")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ total: count });
  }
  const { data, error } = await supabase
    .from("kontributor")
    .select("*", { count: "exact" })
    .order("total_poin", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("kontributor")
    .insert([body])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
