/**
 * Custom Platform Usage API Route
 *
 * Handles checking usage count for custom platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/platforms/custom/[id]/usage
 * Get usage count for a custom platform
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if platform exists and belongs to user
    const existingPlatform = await prisma.customPlatform.findFirst({
      where: {
        id: id,
        user_id: user.id,
      },
    });

    if (!existingPlatform) {
      return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
    }

    // Get usage count
    const usageCount = await prisma.rentEntry.count({
      where: {
        platform: id,
        user_id: user.id,
      },
    });

    return NextResponse.json({
      platformId: id,
      usageCount,
      canDelete: usageCount === 0,
    });
  } catch (error) {
    console.error('Error getting platform usage:', error);
    return NextResponse.json({ error: 'Failed to get platform usage' }, { status: 500 });
  }
}
