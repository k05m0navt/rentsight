import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { propertySchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');

    const where = {
      user_id: user.id,
      ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
    };

    const properties = await prisma.property.findMany({
      where,
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      include: {
        _count: {
          select: {
            rentEntries: true,
            expenseEntries: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const hasMore = properties.length > limit;
    const items = hasMore ? properties.slice(0, -1) : properties;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    const total = await prisma.property.count({ where });

    return NextResponse.json({ items, nextCursor, total });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
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
    const validation = propertySchema.safeParse(body);

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

    const property = await prisma.property.create({
      data: {
        user_id: user.id,
        ...validation.data,
        start_date: validation.data.start_date ? new Date(validation.data.start_date) : null,
      },
      include: {
        _count: {
          select: {
            rentEntries: true,
            expenseEntries: true,
          },
        },
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property:', error);

    if (error.code === 'P2002') {
      // Unique constraint violation
      return NextResponse.json(
        { error: 'Property with this name already exists', code: 'DUPLICATE_NAME' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

