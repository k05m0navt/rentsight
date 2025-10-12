/**
 * Accordion Component - Redesigned
 *
 * Updated with new design system from "AI Hiring - SaaS CRM Web App" reference.
 * Features:
 * - Smooth transitions
 * - Dark theme support
 * - WCAG AA compliant
 * - Keyboard accessible
 * - Icon indicators
 */

'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface AccordionItemProps {
  id: string;
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ id, title, content, isOpen, onToggle }: AccordionItemProps) {
  const contentId = `accordion-content-${id}`;
  const headerId = `accordion-header-${id}`;

  return (
    <div className="border-b border-border dark:border-border-dark">
      <button
        id={headerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        className={cn(
          'flex w-full items-center justify-between py-4 text-left',
          'text-base font-medium text-text dark:text-text-dark',
          'transition-colors duration-200',
          'hover:text-primary dark:hover:text-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:rounded-md',
        )}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 transition-transform duration-200',
            'text-muted dark:text-muted-dark',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[500px] pb-4' : 'max-h-0',
        )}
      >
        <div className="text-base text-muted dark:text-muted-dark">{content}</div>
      </div>
    </div>
  );
}

interface AccordionProps {
  items: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
  }>;
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

function Accordion({ items, allowMultiple = false, defaultOpenIds = [], className }: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set(defaultOpenIds));

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={cn('divide-y divide-border dark:divide-border-dark', className)}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          isOpen={openIds.has(item.id)}
          onToggle={() => toggleItem(item.id)}
        />
      ))}
    </div>
  );
}

export { Accordion, AccordionItem };
export type { AccordionProps };

