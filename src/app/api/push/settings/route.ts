import { NextRequest, NextResponse } from 'next/server';

interface SettingsRequest {
  endpoint: string;
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
const subscriptions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body: SettingsRequest = await request.json();
    const { endpoint, settings } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    // Update settings for existing subscription
    const existingSubscription = subscriptions.get(endpoint);
    if (existingSubscription) {
      existingSubscription.settings = settings;
      subscriptions.set(endpoint, existingSubscription);
      
      console.log('Push notification settings updated:', endpoint, settings);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Failed to update push notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
