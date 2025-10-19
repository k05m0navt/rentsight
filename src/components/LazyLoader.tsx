'use client';

import { Suspense, lazy, ComponentType, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LazyLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  delay?: number;
}

// Default loading skeleton
const DefaultSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('space-y-2', className)}>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);

// Loading spinner
const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center justify-center p-4', className)}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Card skeleton for dashboard components
const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('rounded-lg border p-6 space-y-4', className)}>
    <div className="space-y-2">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

// Table skeleton for data tables
const TableSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('space-y-3', className)}>
    <div className="flex space-x-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
    </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    ))}
  </div>
);

// Chart skeleton for charts and graphs
const ChartSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('rounded-lg border p-6 space-y-4', className)}>
    <div className="space-y-2">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="h-64 bg-muted rounded flex items-end justify-center space-x-2 p-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton
          key={i}
          className="w-8 bg-primary/20"
          style={{ height: `${Math.random() * 100 + 50}px` }}
        />
      ))}
    </div>
  </div>
);

// Form skeleton for forms
const FormSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('space-y-6', className)}>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/5" />
      <Skeleton className="h-20 w-full" />
    </div>
    <div className="flex space-x-4">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

// Skeleton types
export const SkeletonTypes = {
  default: DefaultSkeleton,
  spinner: LoadingSpinner,
  card: CardSkeleton,
  table: TableSkeleton,
  chart: ChartSkeleton,
  form: FormSkeleton,
} as const;

type SkeletonType = keyof typeof SkeletonTypes;

interface LazyComponentProps {
  fallback?: ReactNode;
  skeleton?: SkeletonType;
  className?: string;
  delay?: number;
}

/**
 * LazyLoader component for wrapping content with Suspense
 */
export const LazyLoader = ({ children, fallback, className, delay = 0 }: LazyLoaderProps) => {
  const fallbackComponent = fallback || <DefaultSkeleton className={className} />;

  return <Suspense fallback={fallbackComponent}>{children}</Suspense>;
};

/**
 * Higher-order component for lazy loading components
 */
export function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentProps = {},
) {
  const { fallback, skeleton = 'default', className, delay = 0 } = options;

  const LazyComponent = lazy(() => {
    return new Promise<{ default: ComponentType<P> }>((resolve) => {
      setTimeout(() => {
        resolve(importFunc());
      }, delay);
    });
  });

  const SkeletonComponent = SkeletonTypes[skeleton];

  return function WrappedComponent(props: P) {
    return (
      <LazyLoader fallback={fallback || <SkeletonComponent className={className} />}>
        <LazyComponent {...props} />
      </LazyLoader>
    );
  };
}

/**
 * Lazy load a component with a specific skeleton type
 */
export function lazyLoadComponent<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  skeletonType: SkeletonType = 'default',
  className?: string,
) {
  return withLazyLoading(importFunc, { skeleton: skeletonType, className });
}

/**
 * Preload a component for faster subsequent loading
 */
export function preloadComponent<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
) {
  // Start loading the component but don't wait for it
  importFunc().catch(() => {
    // Ignore errors during preloading
  });
}

/**
 * Lazy load dashboard components
 */
export const LazyDashboard = lazyLoadComponent(
  () => import('@/components/dashboard/Dashboard'),
  'card',
);

export const LazyPropertiesList = lazyLoadComponent(
  () => import('@/components/properties/PropertiesList'),
  'table',
);

export const LazyReports = lazyLoadComponent(() => import('@/components/reports/Reports'), 'chart');

export const LazySettings = lazyLoadComponent(
  () => import('@/components/settings/Settings'),
  'form',
);

/**
 * Lazy load forms
 */
export const LazyPropertyForm = lazyLoadComponent(
  () => import('@/components/forms/PropertyForm'),
  'form',
);

export const LazyRentEntryForm = lazyLoadComponent(
  () => import('@/components/forms/RentEntryForm'),
  'form',
);

export const LazyExpenseEntryForm = lazyLoadComponent(
  () => import('@/components/forms/ExpenseEntryForm'),
  'form',
);

/**
 * Lazy load charts and analytics
 */
export const LazyAnalytics = lazyLoadComponent(
  () => import('@/components/reports/Analytics'),
  'chart',
);

export const LazyCharts = lazyLoadComponent(() => import('@/components/reports/Charts'), 'chart');

/**
 * Lazy load help and documentation
 */
export const LazyHelp = lazyLoadComponent(() => import('@/components/help/Help'), 'default');

export const LazyDocumentation = lazyLoadComponent(
  () => import('@/components/help/Documentation'),
  'default',
);
