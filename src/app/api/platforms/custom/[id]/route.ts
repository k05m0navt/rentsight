/**
 * Custom Platform API Routes - Individual Platform
 *
 * Handles operations for specific custom platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { customPlatformSchema } from '@/lib/validations';

/**
 * PUT /api/platforms/custom/[id]
 * Update a custom platform
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const body = await request.json();
    const validatedData = customPlatformSchema.parse(body);

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

    // Check if new name already exists for this user (excluding current platform)
    const duplicatePlatform = await prisma.customPlatform.findFirst({
      where: {
        user_id: user.id,
        name: validatedData.name.trim(),
        id: { not: id },
      },
    });

    if (duplicatePlatform) {
      return NextResponse.json({ error: 'Platform name already exists' }, { status: 409 });
    }

    const updatedPlatform = await prisma.customPlatform.update({
      where: { id: id },
      data: {
        name: validatedData.name.trim(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json({ customPlatform: updatedPlatform });
  } catch (error) {
    console.error('Error updating custom platform:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid platform data', details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json({ error: 'Failed to update custom platform' }, { status: 500 });
  }
}

/**
 * DELETE /api/platforms/custom/[id]
 * Delete a custom platform (only if no rent entries use it)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    // Check if platform is used in any rent entries
    const rentEntriesCount = await prisma.rentEntry.count({
      where: {
        platform: id,
        user_id: user.id,
      },
    });

    if (rentEntriesCount > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete platform that is used in rent entries',
          usageCount: rentEntriesCount,
        },
        { status: 409 },
      );
    }

    await prisma.customPlatform.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting custom platform:', error);
    return NextResponse.json({ error: 'Failed to delete custom platform' }, { status: 500 });
  }
}
