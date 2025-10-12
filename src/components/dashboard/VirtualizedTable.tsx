'use client';

/**
 * VirtualizedTable Component
 *
 * Implements virtualized scrolling for handling large datasets (10,000+ entries)
 * using @tanstack/react-virtual for optimal performance.
 *
 * Features:
 * - Only renders visible rows (60fps scrolling performance)
 * - Supports 10,000+ entries without performance degradation
 * - GPU-accelerated scrolling
 * - Responsive design with new styling
 *
 * Per FR-019: Handle enterprise-scale datasets (10,000+ entries) efficiently
 * Per SC-010: <2s render, fluid interactions with 10,000+ entries
 */

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  width?: string;
}

export interface VirtualizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (item: T) => string;
  estimateSize?: number; // Estimated row height
  overscan?: number; // Number of extra rows to render
  className?: string;
}

export function VirtualizedTable<T>({
  data,
  columns,
  getRowId,
  estimateSize = 60,
  overscan = 5,
  className,
}: VirtualizedTableProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  return (
    <div
      className={cn(
        'border border-border dark:border-border-dark rounded-lg overflow-hidden',
        className,
      )}
    >
      {/* Table Header */}
      <div className="bg-card dark:bg-card-dark border-b border-border dark:border-border-dark sticky top-0 z-10">
        <div className="flex">
          {columns.map((column) => (
            <div
              key={column.key}
              className={cn(
                'px-4 py-3 text-sm font-medium text-muted dark:text-muted-dark',
                column.width || 'flex-1',
              )}
            >
              {column.header}
            </div>
          ))}
        </div>
      </div>

      {/* Virtualized Body */}
      <div
        ref={parentRef}
        className="h-[600px] overflow-auto bg-background dark:bg-background-dark"
      >
        <div
          style={{
            height: `${totalSize}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const item = data[virtualRow.index];
            return (
              <div
                key={getRowId(item)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="border-b border-border dark:border-border-dark hover:bg-hover dark:hover:bg-hover-dark transition-colors duration-150"
              >
                <div className="flex items-center h-full">
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-sm text-text dark:text-text-dark',
                        column.width || 'flex-1',
                      )}
                    >
                      {column.render(item)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with count */}
      <div className="bg-card dark:bg-card-dark border-t border-border dark:border-border-dark px-4 py-2">
        <p className="text-xs text-muted dark:text-muted-dark">
          Showing {data.length.toLocaleString()} entries
        </p>
      </div>
    </div>
  );
}

export default VirtualizedTable;
