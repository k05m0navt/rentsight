/**
 * User Preferences API Route
 *
 * GET: Retrieve user preferences
 * PUT: Update user preferences (upsert)
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Get user preferences
    const preferences = await prisma.userPreferences.findUnique({
      where: { user_id: user.id },
    });

    // If no preferences exist, return defaults
    if (!preferences) {
      return NextResponse.json({
        currency: 'USD',
        numberFormat: 'en-US',
        preferredPlatforms: [],
        default_view: 'dashboard',
      });
    }

    return NextResponse.json({
      currency: preferences.currency,
      numberFormat: preferences.numberFormat,
      preferredPlatforms: preferences.preferredPlatforms,
      default_view: preferences.default_view,
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    // Validate request body
    const allowedFields = ['currency', 'numberFormat', 'preferredPlatforms', 'default_view'];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Validate default_view value if provided
    if (
      updates.default_view &&
      !['dashboard', 'properties', 'reports', 'settings'].includes(updates.default_view as string)
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid default_view value. Must be "dashboard", "properties", "reports", or "settings"',
        },
        { status: 400 },
      );
    }

    // Upsert preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        currency: (updates.currency as string) ?? 'USD',
        numberFormat: (updates.numberFormat as string) ?? 'en-US',
        preferredPlatforms: (updates.preferredPlatforms as string[]) ?? [],
        default_view: (updates.default_view as string) ?? 'dashboard',
        // Legacy fields for backward compatibility
        currency_format: (updates.currency as string) ?? 'USD',
      },
      update: updates,
    });

    return NextResponse.json({
      currency: preferences.currency,
      numberFormat: preferences.numberFormat,
      preferredPlatforms: preferences.preferredPlatforms,
      default_view: preferences.default_view,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
