import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { propertySchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const property = await prisma.property.findFirst({
      where: {
        id,
        user_id: user.id, // Ensure user owns this property
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

    if (!property) {
      return NextResponse.json({ error: 'Property not found', code: 'NOT_FOUND' }, { status: 404 });
    }

    // Calculate stats
    const rentIncome = await prisma.rentEntry.aggregate({
      where: { property_id: id },
      _sum: { amount: true },
    });

    const expenses = await prisma.expenseEntry.aggregate({
      where: { property_id: id },
      _sum: { amount: true },
    });

    const stats = {
      rentEntriesCount: property._count.rentEntries,
      expenseEntriesCount: property._count.expenseEntries,
      totalIncome: rentIncome._sum.amount || 0,
      totalExpenses: expenses._sum.amount || 0,
    };

    return NextResponse.json({ property, stats });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const { id } = await params;
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

    // Verify ownership
    const existing = await prisma.property.findFirst({
      where: { id, user_id: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Property not found', code: 'NOT_FOUND' }, { status: 404 });
    }

    const updated = await prisma.property.update({
      where: { id },
      data: {
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

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Error updating property:', error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Property name already exists', code: 'DUPLICATE_NAME' },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Verify ownership
    const existing = await prisma.property.findFirst({
      where: { id, user_id: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Property not found', code: 'NOT_FOUND' }, { status: 404 });
    }

    // Delete property (property_id in entries will be set to null due to onDelete: SetNull)
    await prisma.property.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
