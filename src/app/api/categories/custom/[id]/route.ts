import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { customCategorySchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/categories/custom/[id]
 * Update a custom category
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = customCategorySchema.parse(body);

    // Check if category exists and belongs to user
    const existingCategory = await prisma.customCategory.findFirst({
      where: {
        id,
        user_id: user.id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if another category with this name already exists for this user
    const duplicateCategory = await prisma.customCategory.findFirst({
      where: {
        user_id: user.id,
        name: validatedData.name,
        id: { not: id },
      },
    });

    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 },
      );
    }

    const updatedCategory = await prisma.customCategory.update({
      where: { id },
      data: {
        name: validatedData.name,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid category data', details: error.message },
        { status: 400 },
      );
    }

    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/categories/custom/[id]
 * Delete a custom category (only if no expense entries use it)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if category exists and belongs to user
    const existingCategory = await prisma.customCategory.findFirst({
      where: {
        id,
        user_id: user.id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if any expense entries use this category
    const usageCount = await prisma.expenseEntry.count({
      where: {
        user_id: user.id,
        custom_category_name: existingCategory.name,
      },
    });

    if (usageCount > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete category that is being used by expense entries',
          usage_count: usageCount,
        },
        { status: 409 },
      );
    }

    await prisma.customCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
