import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { userPreferencesSchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    let preferences = await prisma.userPreferences.findUnique({
      where: { user_id: user.id },
    });

    // Create defaults if not exists
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: {
          user_id: user.id,
          currency_format: 'USD',
          date_format: 'MM/DD/YYYY',
          language: 'en',
          default_view: 'dashboard',
        },
      });
    }

    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = userPreferencesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const updated = await prisma.userPreferences.upsert({
      where: { user_id: user.id },
      update: validation.data,
      create: {
        user_id: user.id,
        ...validation.data,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
