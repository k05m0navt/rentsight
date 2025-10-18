/**
 * Card Component - Redesigned
 *
 * Updated with new design system from "AI Hiring - SaaS CRM Web App" reference.
 * Features:
 * - Border radius: lg (12px)
 * - Padding: 24px (design token: 4)
 * - Shadow: Medium elevation
 * - Supports dark theme
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-xl bg-card text-text flex flex-col gap-4 p-6 transition-all duration-300 ease-out',
  {
    variants: {
      variant: {
        default: 'border border-border shadow-lg hover:shadow-xl transform hover:-translate-y-1',
        bordered: 'border-2 border-border shadow-md',
        elevated: 'border border-border shadow-2xl hover:shadow-2xl transform hover:-translate-y-2',
        flat: 'border border-border shadow-none',
        interactive:
          'border border-border shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer transition-all duration-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof cardVariants>) {
  return <div data-slot="card" className={cn(cardVariants({ variant }), className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-header" className={cn('flex flex-col gap-2', className)} {...props} />
  );
}

function CardTitle({
  className,
  as: Component = 'h2',
  ...props
}: React.ComponentProps<'h2'> & { as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' }) {
  return (
    <Component
      data-slot="card-title"
      className={cn('text-xl font-bold leading-tight', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p data-slot="card-description" className={cn('text-sm text-muted', className)} {...props} />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn(className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center gap-3 pt-4 border-t border-border', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="card-action" className={cn('flex items-center gap-2', className)} {...props} />
  );
}

export {
  Card,
  cardVariants,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
