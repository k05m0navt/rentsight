'use client';

/**
 * Bottom Navigation Component - Mobile Navigation
 *
 * Implements mobile-friendly bottom navigation bar per clarification Q4.
 * Features:
 * - Fixed position at bottom of viewport
 * - Height: 64px
 * - Icon + label tabs (5 core items for essential navigation)
 * - Active state with primary color
 * - Only visible on screens < 768px (md breakpoint)
 *
 * Per FR-014: Bottom navigation bar with icon+label tabs on mobile viewports
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Home,
  Receipt,
  BarChart3,
  MoreHorizontal,
  Tag,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/properties',
    icon: Building2,
    label: 'Properties',
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
    href: '/reports',
    icon: BarChart3,
    label: 'Reports',
  },
];

const moreNavItems = [
  {
    href: '/tags',
    icon: Tag,
    label: 'Tags',
  },
  {
    href: '/settings',
    icon: Settings,
    label: 'Settings',
  },
  {
    href: '/help',
    icon: HelpCircle,
    label: 'Help',
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-50">
        <div className="flex justify-around items-center h-full px-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium min-w-12 transition-colors duration-200',
                  isActive(item.href) ? 'text-primary' : 'text-muted hover:text-text',
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-center">{item.label}</span>
              </Link>
            );
          })}

          {/* More Menu Button */}
          <button
            onClick={() => setShowMoreMenu(true)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium min-w-12 transition-colors duration-200',
              moreNavItems.some((item) => isActive(item.href))
                ? 'text-primary'
                : 'text-muted hover:text-text',
            )}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            <span className="text-center">More</span>
          </button>
        </div>
      </nav>

      {/* More Menu Modal */}
      {showMoreMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowMoreMenu(false)}
        >
          <div className="absolute bottom-16 left-0 right-0 bg-card border-t border-border rounded-t-lg shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text">More Options</h3>
                <button
                  onClick={() => setShowMoreMenu(false)}
                  className="p-2 text-muted hover:text-text transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {moreNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMoreMenu(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                        isActive(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-text hover:bg-hover',
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BottomNav;
