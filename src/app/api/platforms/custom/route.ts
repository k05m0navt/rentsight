/**
 * Custom Platform API Routes
 *
 * Handles CRUD operations for user-specific custom platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { customPlatformSchema } from '@/lib/validations';

/**
 * GET /api/platforms/custom
 * Get all custom platforms for the authenticated user
 */
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customPlatforms = await prisma.customPlatform.findMany({
      where: { user_id: user.id },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ customPlatforms });
  } catch (error) {
    console.error('Error fetching custom platforms:', error);
    return NextResponse.json({ error: 'Failed to fetch custom platforms' }, { status: 500 });
  }
}

/**
 * POST /api/platforms/custom
 * Create a new custom platform for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = customPlatformSchema.parse(body);

    // Check if platform name already exists for this user
    const existingPlatform = await prisma.customPlatform.findFirst({
      where: {
        user_id: user.id,
        name: validatedData.name.trim(),
      },
    });

    if (existingPlatform) {
      return NextResponse.json({ error: 'Platform name already exists' }, { status: 409 });
    }

    const customPlatform = await prisma.customPlatform.create({
      data: {
        user_id: user.id,
        name: validatedData.name.trim(),
        usage_count: 0,
      },
    });

    return NextResponse.json({ customPlatform }, { status: 201 });
  } catch (error) {
    console.error('Error creating custom platform:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid platform data', details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Failed to create custom platform' }, { status: 500 });
  }
}
