import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { reportRequestSchema } from '@/lib/validations';
import { generateIncomeSummary } from '@/lib/reports/income-summary';
import { generateExpenseBreakdown } from '@/lib/reports/expense-breakdown';
import { generateTaxReport } from '@/lib/reports/tax-report';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = reportRequestSchema.safeParse(body);

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

    const { reportType, filters } = validation.data;

    let reportData: unknown;

    switch (reportType) {
      case 'income_summary':
        reportData = await generateIncomeSummary(user.id, filters || {});
        break;
      case 'expense_breakdown':
        reportData = await generateExpenseBreakdown(user.id, filters || {});
        break;
      case 'tax_report':
        reportData = await generateTaxReport(user.id, filters || {});
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid report type', code: 'INVALID_REPORT_TYPE' },
          { status: 400 },
        );
    }

    // Calculate summary
    const rentEntries = await prisma.rentEntry.count({
      where: { user_id: user.id },
    });

    const expenseEntries = await prisma.expenseEntry.count({
      where: { user_id: user.id },
    });

    const totalIncome = await prisma.rentEntry.aggregate({
      where: { user_id: user.id },
      _sum: { amount: true },
    });

    const totalExpenses = await prisma.expenseEntry.aggregate({
      where: { user_id: user.id },
      _sum: { amount: true },
    });

    const summary = {
      totalIncome: totalIncome._sum.amount || 0,
      totalExpenses: totalExpenses._sum.amount || 0,
      netIncome: (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
      entryCount: rentEntries + expenseEntries,
    };

    return NextResponse.json({
      reportType,
      generated_at: new Date().toISOString(),
      filters: filters || {},
      data: reportData,
      summary,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 },
    );
  }
}
