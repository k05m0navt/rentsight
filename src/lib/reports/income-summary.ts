import { prisma } from '@/lib/prisma';
import { ReportFilters, IncomeSummaryData } from '@/types/report';

export async function generateIncomeSummary(
  userId: string,
  filters: ReportFilters = {},
): Promise<IncomeSummaryData> {
  const where: any = { user_id: userId };

  // Apply filters
  if (filters.startDate) where.start_date = { gte: new Date(filters.startDate) };
  if (filters.endDate) where.end_date = { lte: new Date(filters.endDate) };
  if (filters.propertyId) where.property_id = filters.propertyId;
  if (filters.platform) where.platform = filters.platform;
  if (filters.tagIds && filters.tagIds.length > 0) {
    where.tags = { some: { tag_id: { in: filters.tagIds } } };
  }

  // Fetch all matching rent entries
  const rentEntries = await prisma.rentEntry.findMany({
    where,
    include: {
      property: { select: { id: true, name: true } },
    },
    orderBy: { start_date: 'asc' },
  });

  // Aggregate by period (month)
  const byPeriod: Record<string, { income: number; entries: number }> = {};
  rentEntries.forEach((entry) => {
    const month = entry.start_date.toISOString().slice(0, 7); // YYYY-MM
    if (!byPeriod[month]) byPeriod[month] = { income: 0, entries: 0 };
    byPeriod[month].income += entry.amount;
    byPeriod[month].entries += 1;
  });

  // Aggregate by platform
  const byPlatform: Record<string, { income: number; entries: number }> = {};
  rentEntries.forEach((entry) => {
    if (!byPlatform[entry.platform]) byPlatform[entry.platform] = { income: 0, entries: 0 };
    byPlatform[entry.platform].income += entry.amount;
    byPlatform[entry.platform].entries += 1;
  });

  // Aggregate by property (if applicable)
  const byProperty: Record<string, { id: string; name: string; income: number; entries: number }> =
    {};
  rentEntries.forEach((entry) => {
    if (entry.property_id && entry.property) {
      const key = entry.property_id;
      if (!byProperty[key]) {
        byProperty[key] = {
          id: entry.property.id,
          name: entry.property.name,
          income: 0,
          entries: 0,
        };
      }
      byProperty[key].income += entry.amount;
      byProperty[key].entries += 1;
    }
  });

  return {
    byPeriod: Object.entries(byPeriod).map(([period, data]) => ({
      period,
      ...data,
    })),
    byPlatform: Object.entries(byPlatform).map(([platform, data]) => ({
      platform,
      ...data,
    })),
    byProperty: Object.values(byProperty).map((data) => ({
      propertyId: data.id,
      propertyName: data.name,
      income: data.income,
      entries: data.entries,
    })),
  };
}

