import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncAllUsers } from '@/lib/user-sync';

/**
 * Admin endpoint to manually sync all users
 * This can be used for initial setup or troubleshooting
 */
export async function POST() {
  try {
    // Verify admin access (you might want to add proper admin authentication here)
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[AdminSync] Starting manual user sync...');
    const result = await syncAllUsers();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully synced ${result.synced} users`,
        synced: result.synced,
        errors: result.errors,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Sync failed',
          errors: result.errors,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[AdminSync] Error in manual sync:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'User sync endpoint - use POST to trigger sync',
    endpoint: '/api/admin/sync-users',
    method: 'POST',
  });
}
