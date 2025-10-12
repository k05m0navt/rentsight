/**
 * Pagination Component - Redesigned
 *
 * Updated with new design system from "AI Hiring - SaaS CRM Web App" reference.
 * Features:
 * - Button-based navigation
 * - Dark theme support
 * - WCAG AA compliant
 * - Keyboard accessible
 * - Responsive layout
 */

'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisible?: number;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisible = 5,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ellipsis')[] = [];
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      {showFirstLast && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          First
        </Button>
      )}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-muted dark:text-muted-dark"
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
            className={cn(currentPage === page && 'pointer-events-none')}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {showFirstLast && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          Last
        </Button>
      )}
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };
