import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tagIds = searchParams.getAll('tag_id');

  try {
    const whereClause: Prisma.ExpenseEntryWhereInput = { user_id: user.id };
    if (tagIds.length > 0) {
      whereClause.tags = {
        some: { tag_id: { in: tagIds } },
      };
    }

    const expenseEntries = await prisma.expenseEntry.findMany({
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

    const formattedExpenseEntries = expenseEntries.map((entry) => ({
      ...entry,
      tags: entry.tags.map((tagEntry) => tagEntry.tag),
    }));

    return NextResponse.json(formattedExpenseEntries);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
