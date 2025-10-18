/**
 * Tag Usage API Route (T056)
 *
 * GET: Get usage count for a tag
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getTagWithUsage } from '@/services/tagService';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const usage = await getTagWithUsage(user.id, id);

    if (!usage) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    return NextResponse.json({
      status: usage.total > 0 ? 'in_use' : 'not_in_use',
      usage,
      message:
        usage.total > 0
          ? `This tag is used by ${usage.rentEntries} rent entries and ${usage.expenseEntries} expense entries.`
          : 'This tag is not currently in use',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
