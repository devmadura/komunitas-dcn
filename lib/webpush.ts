import webpush from 'web-push';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;

if (!vapidPublicKey || !vapidPrivateKey) {
  throw new Error('VAPID keys not found in environment variables');
}

webpush.setVapidDetails(
  'mailto:info@dcnunira.dev',
  vapidPublicKey,
  vapidPrivateKey
);

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
}

export async function sendToSubscription(
  subscription: PushSubscription,
  payload: NotificationPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify(payload)
    );
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send notification:', error);

    
    if (error.statusCode === 410 || error.statusCode === 404) {
      return { success: false, error: 'subscription_expired' };
    }

    return { success: false, error: error.message };
  }
}


export async function sendPushNotification(
  subscriptions: PushSubscription[],
  payload: NotificationPayload
): Promise<{ sent: number; failed: number; invalidSubscriptions: string[] }> {
  let sent = 0;
  let failed = 0;
  const invalidSubscriptions: string[] = [];

  const results = await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      const result = await sendToSubscription(subscription, payload);

      if (result.success) {
        sent++;
      } else {
        failed++;
        if (result.error === 'subscription_expired') {
          invalidSubscriptions.push(subscription.endpoint);
        }
      }

      return result;
    })
  );

  return { sent, failed, invalidSubscriptions };
}


export function getVapidPublicKey(): string {
  return vapidPublicKey;
}
