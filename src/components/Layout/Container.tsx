/**
 * Container Component - Redesigned
 *
 * Updated with 8-point spacing scale from the new design system.
 * Provides consistent padding across breakpoints.
 *
 * Per FR-007: Update spacing system with 8-point scale
 * Spacing: px-3 (16px), px-5 (32px), px-6 (40px)
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('mx-auto max-w-7xl px-3 sm:px-5 lg:px-6', className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
