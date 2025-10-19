import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@rentsight.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
}

interface SendNotificationRequest {
  type: 'propertyUpdates' | 'rentReminders' | 'expenseAlerts' | 'reportReady' | 'systemUpdates';
  payload: NotificationPayload;
  targetEndpoint?: string; // Optional: send to specific endpoint for testing
}

// In-memory storage for demo purposes
// In production, you would store this in a database
const subscriptions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body: SendNotificationRequest = await request.json();
    const { type, payload, targetEndpoint } = body;

    if (!type || !payload) {
      return NextResponse.json(
        { error: 'Type and payload are required' },
        { status: 400 }
      );
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Get subscriptions to send to
    const subscriptionsToSend = targetEndpoint
      ? [subscriptions.get(targetEndpoint)].filter(Boolean)
      : Array.from(subscriptions.values());

    // Filter subscriptions based on notification type settings
    const filteredSubscriptions = subscriptionsToSend.filter((sub) => {
      if (!sub?.settings?.enabled) return false;
      return sub.settings[type] === true;
    });

    // Send notifications
    for (const subscription of filteredSubscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.subscription.endpoint,
            keys: {
              p256dh: subscription.subscription.keys.p256dh,
              auth: subscription.subscription.keys.auth,
            },
          },
          JSON.stringify(payload)
        );
        results.sent++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to send to ${subscription.subscription.endpoint}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
        
        // Remove invalid subscriptions
        if (error instanceof Error && error.message.includes('410')) {
          subscriptions.delete(subscription.subscription.endpoint);
        }
      }
    }

    console.log(`Push notification sent: ${type}`, results);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Failed to send push notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Get notification templates
export async function GET() {
  try {
    const templates = {
      propertyUpdates: {
        title: 'New Property Update',
        body: 'A property has been updated in your portfolio',
        icon: '/icons/icon-192x192.png',
        tag: 'property-update',
        data: { type: 'propertyUpdate', url: '/properties' },
      },
      rentReminders: {
        title: 'Rent Payment Reminder',
        body: 'Don\'t forget about upcoming rent payments',
        icon: '/icons/icon-192x192.png',
        tag: 'rent-reminder',
        data: { type: 'rentReminder', url: '/dashboard' },
      },
      expenseAlerts: {
        title: 'Expense Alert',
        body: 'High expense detected - check your budget',
        icon: '/icons/icon-192x192.png',
        tag: 'expense-alert',
        data: { type: 'expenseAlert', url: '/expense-entries' },
      },
      reportReady: {
        title: 'Report Ready',
        body: 'Your monthly report is ready for download',
        icon: '/icons/icon-192x192.png',
        tag: 'report-ready',
        data: { type: 'reportReady', url: '/reports' },
      },
      systemUpdates: {
        title: 'System Update',
        body: 'RentSight has been updated with new features',
        icon: '/icons/icon-192x192.png',
        tag: 'system-update',
        data: { type: 'systemUpdate', url: '/about' },
      },
    };

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Failed to get notification templates:', error);
    return NextResponse.json(
      { error: 'Failed to get templates' },
      { status: 500 }
    );
  }
}
