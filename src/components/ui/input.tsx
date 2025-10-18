/**
 * Input Component - Redesigned
 *
 * Updated with new design system from "AI Hiring - SaaS CRM Web App" reference.
 * Features:
 * - Border radius: md (8px)
 * - Padding: 12px 16px (vertical: 3, horizontal: 3)
 * - Focus ring: primary color with offset
 * - Dark theme support
 * - WCAG AA compliant contrast
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-10 w-full rounded-md border border-border',
        'bg-background',
        'px-3 py-3 text-base',
        'text-text',
        'placeholder:text-muted',
        'transition-[border-color,box-shadow] duration-200',
        'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'aria-invalid:border-error aria-invalid:focus-visible:ring-error/20',
        // Success state styling with green accent from design reference
        '[&:not([aria-invalid])]:valid:border-success [&:not([aria-invalid])]:valid:focus-visible:ring-success/20',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
