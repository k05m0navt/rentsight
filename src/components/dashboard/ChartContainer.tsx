/**
 * ChartContainer Component
 *
 * Wrapper for chart visualizations with consistent styling.
 * Features:
 * - Card-based container
 * - Consistent padding and spacing
 * - Title and description support
 * - Dark theme support
 *
 * Per FR-003: Enhanced chart designs with new color schemes
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({ title, description, children, className }: ChartContainerProps) {
  return (
    <Card className={cn('p-4', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-4">
        {/* Chart content wrapper with min-height for consistent sizing */}
        <div className="min-h-[300px] w-full">{children}</div>
      </CardContent>
    </Card>
  );
}

export default ChartContainer;
