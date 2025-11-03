import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { customCategorySchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/categories/custom
 * Fetch all custom categories for the authenticated user
 */
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const customCategories = await prisma.customCategory.findMany({
      where: { user_id: user.id },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(customCategories);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/categories/custom
 * Create a new custom category for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = customCategorySchema.parse(body);

    // Check if category with this name already exists for this user
    const existingCategory = await prisma.customCategory.findFirst({
      where: {
        user_id: user.id,
        name: validatedData.name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 },
      );
    }

    const customCategory = await prisma.customCategory.create({
      data: {
        user_id: user.id,
        name: validatedData.name,
      },
    });

    return NextResponse.json(customCategory, { status: 201 });
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
