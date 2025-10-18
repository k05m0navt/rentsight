/**
 * MetricsCard Component
 *
 * Displays key performance metrics with redesigned styling.
 * Features:
 * - Card-based design from design system
 * - Accent colors for visual hierarchy (#DD1202, #1DCC5C)
 * - Icon support for visual context
 * - Responsive text sizing
 *
 * Per FR-015: Improve information hierarchy, make key data prominent
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface MetricsCardProps {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string | React.ReactNode;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'primary' | 'success';
  className?: string;
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  variant = 'default',
  className,
}: MetricsCardProps) {
  const variantColors = {
    default: 'text-text',
    primary: 'text-primary',
    success: 'text-success',
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-muted',
  };

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted">{title}</div>
          {Icon && <Icon className={cn('h-5 w-5', variantColors[variant])} aria-hidden="true" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className={cn('text-2xl font-bold', variantColors[variant])}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
          {trend && trendValue && (
            <p className={cn('text-xs font-medium', trendColors[trend])}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {trendValue}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default MetricsCard;
