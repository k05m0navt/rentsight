/**
 * Rent Entry Skeleton Component
 *
 * Loading state for rent entries page
 */

import { SkeletonTable } from '@/components/ui/skeleton';

export function RentEntrySkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonTable rows={8} />
    </div>
  );
}
