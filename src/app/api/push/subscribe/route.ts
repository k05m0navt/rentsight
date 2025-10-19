import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@rentsight.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

interface SubscriptionData {
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  settings: {
    enabled: boolean;
    propertyUpdates: boolean;
    rentReminders: boolean;
    expenseAlerts: boolean;
    reportReady: boolean;
    systemUpdates: boolean;
  };
}

// In-memory storage for demo purposes
// In production, you would store this in a database
const subscriptions = new Map<string, SubscriptionData>();

export async function POST(request: NextRequest) {
  try {
    const body: SubscriptionData = await request.json();
    const { subscription, settings } = body;

    // Validate subscription data
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    // Store subscription
    subscriptions.set(subscription.endpoint, { subscription, settings });

    console.log('Push subscription stored:', subscription.endpoint);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to store push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to store subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      count: subscriptions.size,
      subscriptions: Array.from(subscriptions.values()),
    });
  } catch (error) {
    console.error('Failed to retrieve push subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve subscriptions' },
      { status: 500 }
    );
  }
}
