import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps extends React.ComponentPropsWithoutRef<'div'> {
  children?: React.ReactNode;
  cols?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols,
  gap = 'gap-4',
  className,
  ...props
}) => {
  const colClasses =
    typeof cols === 'number'
      ? `grid-cols-${cols}`
      : cn(
          cols?.sm && `sm:grid-cols-${cols.sm}`,
          cols?.md && `md:grid-cols-${cols.md}`,
          cols?.lg && `lg:grid-cols-${cols.lg}`,
          cols?.xl && `xl:grid-cols-${cols.xl}`,
        );

  return (
    <div className={cn('grid', colClasses, gap, className)} {...props}>
      {children}
    </div>
  );
};

export default Grid;
