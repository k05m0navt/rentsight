import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { userProfileSchema } from '@/lib/validations';
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
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found', code: 'NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
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
    const validation = userProfileSchema.safeParse(body);

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

    // Update email in Supabase Auth if changed
    if (validation.data.email && validation.data.email !== user.email) {
      const { error: updateError } = await supabase.auth.updateUser({
        email: validation.data.email,
      });

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message, code: 'AUTH_UPDATE_FAILED' },
          { status: 400 },
        );
      }
    }

    // Update in database
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: validation.data.email,
        name: validation.data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Error updating profile:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      // Unique constraint violation
      return NextResponse.json(
        { error: 'Email already in use', code: 'EMAIL_EXISTS' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
