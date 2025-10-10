import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tagIds = searchParams.getAll('tag_id');

  try {
    const whereClause: any = { user_id: user.id };
    if (tagIds.length > 0) {
      whereClause.tags = {
        some: { tag_id: { in: tagIds } },
      };
    }

    const rentEntries = await prisma.rentEntry.findMany({
      where: whereClause,
      include: {
        tags: {
          select: {
            tag: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    const formattedRentEntries = rentEntries.map(entry => ({
      ...entry,
      tags: entry.tags.map(tagEntry => tagEntry.tag),
    }));

    return NextResponse.json(formattedRentEntries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

