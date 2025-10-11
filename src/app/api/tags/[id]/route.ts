import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { updateTag, deleteTag } from '@/services/tagService';

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
    await deleteTag(user.id, id);
    return NextResponse.json(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
