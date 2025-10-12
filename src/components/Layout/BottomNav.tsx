'use client';

/**
 * Bottom Navigation Component - Mobile Navigation
 *
 * Implements mobile-friendly bottom navigation bar per clarification Q4.
 * Features:
 * - Fixed position at bottom of viewport
 * - Height: 64px
 * - Icon + label tabs (4 items maximum recommended)
 * - Active state with primary color
 * - Only visible on screens < 768px (md breakpoint)
 *
 * Per FR-014: Bottom navigation bar with icon+label tabs on mobile viewports
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Home, Receipt, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/rent-entries',
    icon: Home,
    label: 'Rent',
  },
  {
    href: '/expense-entries',
    icon: Receipt,
    label: 'Expenses',
  },
  {
    href: '/tags',
    icon: Tag,
    label: 'Tags',
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card dark:bg-card-dark border-t border-border dark:border-border-dark z-50">
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium min-w-16 transition-colors duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
