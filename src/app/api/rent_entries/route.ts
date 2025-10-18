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
    const whereClause: Prisma.RentEntryWhereInput = { user_id: user.id };
    if (tagIds.length > 0) {
      whereClause.tags = {
        some: { tag_id: { in: tagIds } },
      };
    }

    const rentEntries = await prisma.rentEntry.findMany({
      where: whereClause,
      select: {
        id: true,
        amount: true,
        booked_days: true,
        platform: true,
        custom_platform_name: true,
        start_date: true,
        end_date: true,
        property_id: true,
        created_at: true,
        updated_at: true,
        tags: {
          select: {
            tag: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    const formattedRentEntries = rentEntries.map((entry) => ({
      ...entry,
      tags: entry.tags.map((tagEntry) => tagEntry.tag),
    }));

    return NextResponse.json(formattedRentEntries);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
      user_id,
      amount,
      booked_days,
      platform,
      custom_platform_name,
      start_date,
      end_date,
      property_id,
      tag_ids = [],
    } = body;

    // Validate required fields
    if (!amount || !booked_days || !platform || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate custom platform name if platform is "other"
    if (platform === 'other' && (!custom_platform_name || custom_platform_name.trim().length < 2)) {
      return NextResponse.json(
        { error: 'Custom platform name is required when selecting "Other"' },
        { status: 400 },
      );
    }

    // Create rent entry
    const rentEntry = await prisma.rentEntry.create({
      data: {
        user_id: user_id,
        amount: parseFloat(amount),
        booked_days: parseInt(booked_days),
        platform,
        custom_platform_name: platform === 'other' ? custom_platform_name : null,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        property_id: property_id || null,
      },
    });

    // Add tags if provided
    if (tag_ids.length > 0) {
      await prisma.rentEntryTag.createMany({
        data: tag_ids.map((tagId: string) => ({
          rent_entry_id: rentEntry.id,
          tag_id: tagId,
        })),
      });
    }

    return NextResponse.json(rentEntry, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
