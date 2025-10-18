/**
 * Dashboard Skeleton Component
 *
 * Loading state that matches the dashboard layout
 * Shows skeleton cards in the same grid as actual dashboard content
 */

import { SkeletonCard } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard className="h-80" />
        <SkeletonCard className="h-80" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6">
        <SkeletonCard className="h-64" />
      </div>
    </div>
  );
}
