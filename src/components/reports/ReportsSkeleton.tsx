/**
 * Reports Skeleton Component
 *
 * Loading state for reports page
 */

import { SkeletonCard, Skeleton } from '@/components/ui/skeleton';

export function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Report filters */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-96" />
        <SkeletonCard className="h-96" />
      </div>
    </div>
  );
}
