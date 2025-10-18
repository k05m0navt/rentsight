/**
 * Expense Entry Skeleton Component
 *
 * Loading state for expense entries page
 */

import { SkeletonTable } from '@/components/ui/skeleton';

export function ExpenseEntrySkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonTable rows={8} />
    </div>
  );
}
