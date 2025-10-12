import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { passwordChangeSchema } from '@/lib/validations';

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
    const validation = passwordChangeSchema.safeParse(body);

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

    // Verify current password by attempting sign in
    const verifySupabase = createClient();
    const { error: signInError } = await verifySupabase.auth.signInWithPassword({
      email: user.email!,
      password: validation.data.currentPassword,
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Current password is incorrect', code: 'INVALID_PASSWORD' },
        { status: 401 },
      );
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: validation.data.newPassword,
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message, code: 'PASSWORD_UPDATE_FAILED' },
        { status: 400 },
      );
    }

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
