import { NextRequest, NextResponse } from 'next/server';
import { syncUserToPrisma } from '@/lib/user-sync';

/**
 * Webhook handler for Supabase Auth events
 * This endpoint receives webhooks when users sign up, sign in, or update their profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[AuthWebhook] Received webhook:', {
      type: body.type,
      record: body.record ? { id: body.record.id, email: body.record.email } : null,
    });

    // Handle different event types
    switch (body.type) {
      case 'INSERT': // User signed up
      case 'UPDATE': // User profile updated
        if (body.record) {
          const userData = {
            id: body.record.id,
            email: body.record.email,
            name: body.record.raw_user_meta_data?.name || 
                  body.record.raw_user_meta_data?.full_name ||
                  body.record.raw_user_meta_data?.display_name,
          };

          const result = await syncUserToPrisma(userData);
          
          if (result.success) {
            console.log(`[AuthWebhook] Successfully synced user: ${userData.email}`);
            return NextResponse.json({ success: true, message: 'User synced successfully' });
          } else {
            console.error(`[AuthWebhook] Failed to sync user: ${result.error}`);
            return NextResponse.json(
              { success: false, error: result.error },
              { status: 500 }
            );
          }
        }
        break;

      case 'DELETE': // User deleted
        if (body.record) {
          console.log(`[AuthWebhook] User deleted: ${body.record.email}`);
          // Note: We might want to handle user deletion here
          // For now, we'll just log it
        }
        break;

      default:
        console.log(`[AuthWebhook] Unhandled event type: ${body.type}`);
    }

    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('[AuthWebhook] Error processing webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'Auth webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}
