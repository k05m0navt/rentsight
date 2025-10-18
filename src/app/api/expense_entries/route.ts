import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      amount,
      category,
      custom_category_name,
      description,
      date,
      property_id,
      tag_ids = [],
    } = body;

    // Validate required fields
    if (!amount || !category || !date) {
      return NextResponse.json(
        { error: 'Amount, category, and date are required' },
        { status: 400 },
      );
    }

    // Create expense entry
    const expenseEntry = await prisma.expenseEntry.create({
      data: {
        user_id: user.id,
        amount: parseFloat(amount),
        category,
        custom_category_name: custom_category_name || null,
        description: description || null,
        date: new Date(date),
        property_id: property_id || null,
      },
    });

    // Add tags if provided
    if (tag_ids.length > 0) {
      await prisma.expenseEntryTag.createMany({
        data: tag_ids.map((tagId: string) => ({
          expense_entry_id: expenseEntry.id,
          tag_id: tagId,
        })),
      });
    }

    return NextResponse.json(expenseEntry, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
