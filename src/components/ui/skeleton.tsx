/**
 * Skeleton Components
 *
 * Loading state placeholders that match content layout
 * Provides better perceived performance than text-based loading
 */

import { cn } from '@/lib/utils';

/**
 * Base Skeleton Component
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/60',
        'relative overflow-hidden',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
        className,
      )}
      {...props}
    />
  );
}

/**
 * Skeleton Card - Matches Card component layout
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-card text-text flex flex-col gap-4 p-6 transition-all duration-300 ease-out border border-border shadow-lg relative overflow-hidden',
        className,
      )}
    >
      <div className="space-y-3 min-w-0">
        <Skeleton className="h-5 w-3/4 max-w-48" />
        <Skeleton className="h-4 w-1/2 max-w-32" />
        <div className="flex gap-2 mt-4 flex-wrap">
          <Skeleton className="h-8 w-20 flex-shrink-0" />
          <Skeleton className="h-8 w-20 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton MetricsCard - Matches MetricsCard component layout
 */
export function SkeletonMetricsCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-card text-text flex flex-col transition-all duration-300 ease-out border border-border shadow-lg relative overflow-hidden',
        className,
      )}
    >
      {/* CardHeader */}
      <div className="flex flex-col gap-2 pb-2 px-6 pt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
      </div>

      {/* CardContent */}
      <div className="px-6 pb-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Table - Matches table layout
 */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border dark:border-border-dark overflow-hidden">
      {/* Table Header */}
      <div className="border-b border-border dark:border-border-dark bg-muted/50 dark:bg-muted-dark/50 p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-border dark:divide-border-dark">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton Text - For text lines
 */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-4/5' : 'w-full', // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Avatar - For circular avatars/icons
 */
export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return <Skeleton className={cn('rounded-full', sizeClasses[size])} />;
}

/**
 * Skeleton Button - For button placeholders
 */
export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-24', className)} />;
}

/**
 * Skeleton Input - For input field placeholders
 */
export function SkeletonInput({ className }: { className?: string }) {
  return <Skeleton className={cn('h-10 w-full', className)} />;
}
