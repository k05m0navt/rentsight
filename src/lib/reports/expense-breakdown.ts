import { prisma } from '@/lib/prisma';
import { ReportFilters, ExpenseBreakdownData } from '@/types/report';

export async function generateExpenseBreakdown(
  userId: string,
  filters: ReportFilters = {},
): Promise<ExpenseBreakdownData> {
  const where: any = { user_id: userId };

  // Apply filters
  if (filters.startDate) where.date = { gte: new Date(filters.startDate) };
  if (filters.endDate) {
    where.date = where.date || {};
    where.date.lte = new Date(filters.endDate);
  }
  if (filters.propertyId) where.property_id = filters.propertyId;
  if (filters.category) where.category = filters.category;
  if (filters.tagIds && filters.tagIds.length > 0) {
    where.tags = { some: { tag_id: { in: filters.tagIds } } };
  }

  // Fetch all matching expense entries
  const expenseEntries = await prisma.expenseEntry.findMany({
    where,
    include: {
      property: { select: { id: true, name: true } },
    },
    orderBy: { date: 'asc' },
  });

  // Aggregate by category
  const byCategory: Record<string, { amount: number; entries: number }> = {};
  expenseEntries.forEach((entry) => {
    if (!byCategory[entry.category]) byCategory[entry.category] = { amount: 0, entries: 0 };
    byCategory[entry.category].amount += entry.amount;
    byCategory[entry.category].entries += 1;
  });

  // Aggregate by property
  const byProperty: Record<string, { id: string; name: string; amount: number; entries: number }> =
    {};
  expenseEntries.forEach((entry) => {
    if (entry.property_id && entry.property) {
      const key = entry.property_id;
      if (!byProperty[key]) {
        byProperty[key] = {
          id: entry.property.id,
          name: entry.property.name,
          amount: 0,
          entries: 0,
        };
      }
      byProperty[key].amount += entry.amount;
      byProperty[key].entries += 1;
    }
  });

  // Calculate trends by month
  const trendsByMonth: Record<string, number> = {};
  expenseEntries.forEach((entry) => {
    const month = entry.date.toISOString().slice(0, 7); // YYYY-MM
    if (!trendsByMonth[month]) trendsByMonth[month] = 0;
    trendsByMonth[month] += entry.amount;
  });

  return {
    byCategory: Object.entries(byCategory).map(([category, data]) => ({
      category,
      ...data,
    })),
    byProperty: Object.values(byProperty).map((data) => ({
      propertyId: data.id,
      propertyName: data.name,
      amount: data.amount,
      entries: data.entries,
    })),
    trends: Object.entries(trendsByMonth)
      .map(([period, amount]) => ({
        period,
        amount,
      }))
      .sort((a, b) => a.period.localeCompare(b.period)),
  };
}

