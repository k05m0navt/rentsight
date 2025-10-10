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

  try {
    const totalRentIncomeResult = await prisma.rentEntry.aggregate({
      _sum: {
        amount: true,
      },
      where: { user_id: user.id },
    });
    const totalBookedDaysResult = await prisma.rentEntry.aggregate({
      _sum: {
        booked_days: true,
      },
      where: { user_id: user.id },
    });
    // For total platform income, we need to sum amounts grouped by platform, then sum those up. 
    // This will require a raw query or more complex Prisma aggregation later if needed, 
    // but for now, we'll consider it as part of total rent income or a separate, more complex task.
    const totalPlatformIncome = totalRentIncomeResult._sum?.amount || 0; 

    const totalExpensesResult = await prisma.expenseEntry.aggregate({
      _sum: {
        amount: true,
      },
      where: { user_id: user.id },
    });

    const summary = {
      total_rent_income: totalRentIncomeResult._sum?.amount || 0,
      total_booked_days: totalBookedDaysResult._sum?.booked_days || 0,
      total_platform_income: totalPlatformIncome,
      total_expenses: totalExpensesResult._sum?.amount || 0,
      average_days_per_rent: 0, // This will be calculated in a later task if required.
    };

    return NextResponse.json(summary);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

