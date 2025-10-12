/**
 * Select Component - Redesigned
 *
 * Updated with new design system from "AI Hiring - SaaS CRM Web App" reference.
 * Features:
 * - Border radius: md (8px)
 * - Padding: 12px 16px
 * - Focus ring: primary color with offset
 * - Dark theme support
 * - WCAG AA compliant contrast
 * - Native select with custom styling
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'h-10 w-full rounded-md border border-border dark:border-border-dark',
        'bg-background dark:bg-background-dark',
        'px-3 py-2 text-base',
        'text-text dark:text-text-dark',
        'transition-[border-color,box-shadow] duration-200',
        'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'aria-invalid:border-error aria-invalid:focus-visible:ring-error/20',
        // Add arrow styling
        'appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]',
        'bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3E%3Cpath stroke="%236b7280" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/%3E%3C/svg%3E\')]',
        'dark:bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"%3E%3Cpath stroke="%239ca3af" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m6 8 4 4 4-4"/%3E%3C/svg%3E\')]',
        'pr-10', // Add padding for the arrow
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };

