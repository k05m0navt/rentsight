/**
 * Expense Analytics Skeleton Component
 *
 * Loading state for the expense analytics section
 * Shows skeleton cards that match the expense analytics layout
 */

import { Skeleton, SkeletonCard } from '@/components/ui/skeleton';

export function ExpenseAnalyticsSkeleton() {
  return (
    <div className="space-y-6 min-w-0">
      {/* Section Header */}
      <div className="space-y-2 min-w-0">
        <Skeleton className="h-6 w-48 max-w-full" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
        <SkeletonCard className="h-24 min-w-0" />
        <SkeletonCard className="h-24 min-w-0" />
        <SkeletonCard className="h-24 min-w-0" />
      </div>

      {/* Expense Entries Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
        <SkeletonCard className="h-32 min-w-0" />
        <SkeletonCard className="h-32 min-w-0" />
        <SkeletonCard className="h-32 min-w-0" />
      </div>
    </div>
  );
}
