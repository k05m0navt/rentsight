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
        theme: 'system',
        reducedMotion: false,
        currency: 'USD',
        numberFormat: 'en-US',
        preferredPlatforms: [],
      });
    }

    return NextResponse.json({
      theme: preferences.theme,
      reducedMotion: preferences.reducedMotion,
      currency: preferences.currency,
      numberFormat: preferences.numberFormat,
      preferredPlatforms: preferences.preferredPlatforms,
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
    const allowedFields = [
      'theme',
      'reducedMotion',
      'currency',
      'numberFormat',
      'preferredPlatforms',
    ];

    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Validate theme value if provided
    if (updates.theme && !['light', 'dark', 'system'].includes(updates.theme)) {
      return NextResponse.json(
        { error: 'Invalid theme value. Must be "light", "dark", or "system"' },
        { status: 400 },
      );
    }

    // Upsert preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { user_id: user.id },
      create: {
        user_id: user.id,
        theme: updates.theme ?? 'system',
        reducedMotion: updates.reducedMotion ?? false,
        currency: updates.currency ?? 'USD',
        numberFormat: updates.numberFormat ?? 'en-US',
        preferredPlatforms: updates.preferredPlatforms ?? [],
        // Legacy fields for backward compatibility
        currency_format: updates.currency ?? 'USD',
        language: 'en',
        default_view: 'dashboard',
      },
      update: updates,
    });

    return NextResponse.json({
      theme: preferences.theme,
      reducedMotion: preferences.reducedMotion,
      currency: preferences.currency,
      numberFormat: preferences.numberFormat,
      preferredPlatforms: preferences.preferredPlatforms,
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
