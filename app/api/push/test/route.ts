import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requirePermission } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { sendPushNotification, type PushSubscription } from "@/lib/webpush";

export async function POST(request: Request) {
    try {
        // Require admin permission
        const authResult = await requirePermission(PERMISSIONS.EVENTS);
        if ("error" in authResult) return authResult.error;

        const body = await request.json();
        const { title, message, url } = body;

        // Default values for test notification
        const notificationTitle = title || "Test Notification 🔔";
        const notificationBody = message || "Ini adalah test notification dari DCN UNIRA";
        const notificationUrl = url || "/";

        // Fetch all push subscriptions
        const { data: subscriptions, error: subError } = await supabase
            .from("push_subscriptions")
            .select("endpoint, p256dh, auth");

        if (subError) {
            throw new Error(`Failed to fetch subscriptions: ${subError.message}`);
        }

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No subscribers found. Please subscribe to notifications first.",
                sent: 0,
                failed: 0,
            });
        }

        // Format subscriptions for web-push
        const pushSubscriptions: PushSubscription[] = subscriptions.map((sub) => ({
            endpoint: sub.endpoint,
            keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
            },
        }));

        // Send notification
        const result = await sendPushNotification(pushSubscriptions, {
            title: notificationTitle,
            body: notificationBody,
            icon: "/icons/icon-192x192.png",
            url: notificationUrl,
        });

        // Clean up invalid subscriptions
        if (result.invalidSubscriptions.length > 0) {
            await supabase
                .from("push_subscriptions")
                .delete()
                .in("endpoint", result.invalidSubscriptions);
        }

        return NextResponse.json({
            success: true,
            message: "Test notification sent successfully",
            sent: result.sent,
            failed: result.failed,
            totalSubscribers: subscriptions.length,
            invalidSubscriptions: result.invalidSubscriptions.length,
        });
    } catch (error: any) {
        console.error("Error sending test notification:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to send test notification",
                details: error.message
            },
            { status: 500 }
        );
    }
}
