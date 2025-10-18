/**
 * Dashboard Skeleton Component
 *
 * Loading state that matches the dashboard layout
 * Shows skeleton cards in the same grid as actual dashboard content
 */

import { SkeletonCard, SkeletonMetricsCard } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 min-w-0">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        <SkeletonMetricsCard className="min-w-0" />
        <SkeletonMetricsCard className="min-w-0" />
        <SkeletonMetricsCard className="min-w-0" />
        <SkeletonMetricsCard className="min-w-0" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        <SkeletonCard className="h-80 min-w-0" />
        <SkeletonCard className="h-80 min-w-0" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 min-w-0">
        <SkeletonCard className="h-64 min-w-0" />
      </div>
    </div>
  );
}
