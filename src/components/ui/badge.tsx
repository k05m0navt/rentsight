/**
 * Badge Component - Redesigned
 *
 * Updated with new design system from "AI Hiring - SaaS CRM Web App" reference.
 * Features:
 * - Pill shape (border-radius: full)
 * - Primary accent color (#DD1202)
 * - Success color (#1DCC5C)
 * - Compact padding (4px 12px)
 * - Font: xs size, medium weight
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-[background-color,color] duration-200',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white',
        success: 'bg-success text-white',
        muted: 'bg-muted text-white',
        outline:
          'border border-border text-text bg-transparent',
        error: 'bg-error text-white',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
