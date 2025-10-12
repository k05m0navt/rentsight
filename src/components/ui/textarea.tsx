/**
 * Textarea Component - Redesigned
 *
 * Updated with new design system from "AI Hiring - SaaS CRM Web App" reference.
 * Features:
 * - Border radius: md (8px)
 * - Padding: 12px 16px
 * - Focus ring: primary color with offset
 * - Dark theme support
 * - WCAG AA compliant contrast
 * - Minimum height for usability
 */

import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-[80px] w-full rounded-md border border-border dark:border-border-dark',
        'bg-background dark:bg-background-dark',
        'px-3 py-3 text-base',
        'text-text dark:text-text-dark',
        'placeholder:text-muted dark:placeholder:text-muted-dark',
        'transition-[border-color,box-shadow] duration-200',
        'focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'aria-invalid:border-error aria-invalid:focus-visible:ring-error/20',
        'resize-y', // Allow vertical resizing only
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

