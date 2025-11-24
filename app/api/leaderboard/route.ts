import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("kontributor")
    .select("*")
    .order("total_poin", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Add tier information
  const leaderboard = data.map((k, index) => {
    let tier = "Member";
    if (k.total_poin >= 300) tier = "Gold";
    else if (k.total_poin >= 200) tier = "Silver";
    else if (k.total_poin >= 100) tier = "Bronze";

    return {
      ...k,
      rank: index + 1,
      tier,
    };
  });

  return NextResponse.json(leaderboard);
}
