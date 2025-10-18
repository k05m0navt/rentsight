/**
 * Property List Skeleton Component
 *
 * Loading state for properties page
 */

import { SkeletonCard } from '@/components/ui/skeleton';

export function PropertyListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Grid of property cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} className="h-48" />
        ))}
      </div>
    </div>
  );
}
