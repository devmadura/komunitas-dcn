import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission } from "@/lib/auth";
import { logActivity } from "@/lib/axiom";
import { PERMISSIONS } from "@/lib/permissions";
import { sendPushNotification, type PushSubscription } from "@/lib/webpush";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6");
    const page = parseInt(searchParams.get("page") || "1");
    const published = searchParams.get("published");
    const offset = (page - 1) * limit;

    let query = supabase
      .from("events")
      .select("*", { count: "exact" })
      .order("tanggal", { ascending: false });

    if (published === "true") {
      query = query.eq("is_published", true);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requirePermission(PERMISSIONS.EVENTS);
    if ("error" in authResult) return authResult.error;
    const { admin } = authResult;

    const body = await request.json();
    const { judul, deskripsi, tanggal, waktu, lokasi, tipe, gambar, gambar_uuid, is_published } = body;

    if (!judul || !tanggal) {
      return NextResponse.json(
        { error: "Judul dan tanggal wajib diisi" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(judul);
    const { data: existing } = await supabase
      .from("events")
      .select("slug")
      .like("slug", `${slug}%`);

    if (existing && existing.length > 0) {
      slug = `${slug}-${existing.length + 1}`;
    }

    const { data, error } = await supabase
      .from("events")
      .insert([{
        slug,
        judul,
        deskripsi,
        tanggal,
        waktu,
        lokasi,
        tipe: tipe || "Event",
        gambar,
        gambar_uuid,
        is_published: is_published || false,
      }])
      .select()
      .single();

    if (error) throw error;

    await logActivity(
      "create_event",
      admin.email,
      `Membuat event baru: ${judul}`,
      { event_id: data.id, slug: data.slug },
      admin.nama
    );

    // Send push notification if event is published
    if (is_published) {
      try {
        // Fetch all push subscriptions
        const { data: subscriptions, error: subError } = await supabase
          .from("push_subscriptions")
          .select("endpoint, p256dh, auth");

        if (!subError && subscriptions && subscriptions.length > 0) {
          // Format subscriptions for web-push
          const pushSubscriptions: PushSubscription[] = subscriptions.map((sub) => ({
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          }));

          // Format tanggal untuk notifikasi
          const eventDate = new Date(tanggal).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });

          // Send notification
          const result = await sendPushNotification(pushSubscriptions, {
            title: "Event Baru! 🎉",
            body: `${judul} - ${eventDate}`,
            icon: gambar || "/icons/icon-192x192.png",
            url: `/event/${slug}`,
          });

          console.log(`Push notification sent: ${result.sent} success, ${result.failed} failed`);

          // Clean up invalid subscriptions
          if (result.invalidSubscriptions.length > 0) {
            await supabase
              .from("push_subscriptions")
              .delete()
              .in("endpoint", result.invalidSubscriptions);

            console.log(`Removed ${result.invalidSubscriptions.length} invalid subscriptions`);
          }
        }
      } catch (notifError) {
        // Don't fail the request if notification fails
        console.error("Error sending push notification:", notifError);
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Gagal membuat event" },
      { status: 500 }
    );
  }
}
