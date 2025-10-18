/**
 * Button Component - Redesigned
 *
 * Updated with new design system from "AI Hiring - SaaS CRM Web App" reference.
 * Uses design tokens for consistent styling across light and dark themes.
 *
 * Variants:
 * - primary: Primary accent (#FF6B35 - Orange from AI Hiring SaaS CRM design), white text
 * - secondary: Card background, border, hover state
 * - ghost: Transparent background, subtle hover
 * - link: Text link with underline
 *
 * Per FR-013: GPU-accelerated transitions only (opacity, transform)
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 transform active:scale-[0.96]',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:bg-primary-hover focus-visible:ring-primary/50 border border-primary/20',
        secondary:
          'bg-background text-text border border-border shadow-md hover:bg-hover hover:shadow-lg focus-visible:ring-border',
        success:
          'bg-success text-success-foreground shadow-lg hover:shadow-xl hover:bg-success-hover focus-visible:ring-success/50 border border-success/20',
        warning:
          'bg-warning text-white shadow-lg hover:shadow-xl hover:bg-warning-hover focus-visible:ring-warning/50 border border-warning/20',
        destructive:
          'bg-error text-white shadow-lg hover:shadow-xl hover:bg-error-hover focus-visible:ring-error/50 border border-error/20',
        ghost:
          'bg-transparent text-text hover:bg-hover focus-visible:ring-border shadow-none',
        link: 'text-primary underline-offset-4 hover:underline focus-visible:ring-primary/50 shadow-none',
      },
      size: {
        sm: 'h-8 px-3 py-2 text-sm',
        default: 'h-10 px-4 py-3 text-base',
        lg: 'h-12 px-5 py-4 text-lg',
        icon: 'size-10 p-0',
        'icon-sm': 'size-8 p-0',
        'icon-lg': 'size-12 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
