import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { updateTag, deleteTagWithCascade } from '@/services/tagService';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { name } = await request.json();
    const updatedTag = await updateTag(user.id, id, name);
    return NextResponse.json(updatedTag);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check for confirmation parameter
    const url = new URL(request.url);
    const confirmed = url.searchParams.get('confirm') === 'true';

    // Use cascade deletion with confirmation logic
    const result = await deleteTagWithCascade(user.id, id, confirmed);

    if (result.status === 'requires_confirmation') {
      // Return 409 Conflict with usage information
      return NextResponse.json(
        {
          status: 'in_use',
          usage: result.usage,
          message: result.message,
        },
        { status: 409 },
      );
    }

    // Success - return with deleted associations info
    return NextResponse.json(
      {
        success: true,
        message: result.message,
        deletedAssociations: result.deletedAssociations,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
