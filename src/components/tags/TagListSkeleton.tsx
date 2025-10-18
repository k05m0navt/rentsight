/**
 * Tag List Skeleton Component
 *
 * Loading state for tags page
 */

import { SkeletonCard } from '@/components/ui/skeleton';

export function TagListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Grid of tag cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
