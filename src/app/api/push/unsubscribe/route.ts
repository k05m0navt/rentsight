import { NextRequest, NextResponse } from 'next/server';

interface UnsubscribeRequest {
  endpoint: string;
}

// In-memory storage for demo purposes
// In production, you would store this in a database
const subscriptions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body: UnsubscribeRequest = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    // Remove subscription
    const removed = subscriptions.delete(endpoint);

    if (removed) {
      console.log('Push subscription removed:', endpoint);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Failed to remove push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 }
    );
  }
}
