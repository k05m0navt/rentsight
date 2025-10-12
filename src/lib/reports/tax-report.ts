import { prisma } from '@/lib/prisma';
import { ReportFilters, TaxReportData } from '@/types/report';

export async function generateTaxReport(
  userId: string,
  filters: ReportFilters = {},
): Promise<TaxReportData> {
  // For tax reports, typically we want a full calendar year
  const year = filters.startDate ? new Date(filters.startDate).getFullYear() : new Date().getFullYear();
  const yearStart = new Date(`${year}-01-01`);
  const yearEnd = new Date(`${year}-12-31`);

  // Fetch rent entries for the year
  const rentEntries = await prisma.rentEntry.findMany({
    where: {
      user_id: userId,
      start_date: { gte: yearStart, lte: yearEnd },
      ...(filters.propertyId && { property_id: filters.propertyId }),
      ...(filters.tagIds &&
        filters.tagIds.length > 0 && {
          tags: { some: { tag_id: { in: filters.tagIds } } },
        }),
    },
  });

  // Fetch expense entries for the year
  const expenseEntries = await prisma.expenseEntry.findMany({
    where: {
      user_id: userId,
      date: { gte: yearStart, lte: yearEnd },
      ...(filters.propertyId && { property_id: filters.propertyId }),
      ...(filters.tagIds &&
        filters.tagIds.length > 0 && {
          tags: { some: { tag_id: { in: filters.tagIds } } },
        }),
    },
  });

  // Calculate total income
  const totalIncome = rentEntries.reduce((sum, entry) => sum + entry.amount, 0);

  // Calculate total expenses
  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);

  // Income by month
  const incomeByMonth: Record<string, number> = {};
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Initialize all months
  monthNames.forEach((month) => {
    incomeByMonth[month] = 0;
  });

  // Aggregate income by month
  rentEntries.forEach((entry) => {
    const monthIndex = entry.start_date.getMonth();
    const monthName = monthNames[monthIndex];
    incomeByMonth[monthName] += entry.amount;
  });

  // Expenses by category
  const expensesByCategory: Record<string, number> = {};
  expenseEntries.forEach((entry) => {
    if (!expensesByCategory[entry.category]) {
      expensesByCategory[entry.category] = 0;
    }
    expensesByCategory[entry.category] += entry.amount;
  });

  return {
    year,
    totalIncome,
    totalExpenses,
    netIncome: totalIncome - totalExpenses,
    incomeByMonth: Object.entries(incomeByMonth).map(([month, income]) => ({
      month,
      income,
    })),
    expensesByCategory: Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
    })),
  };
}

