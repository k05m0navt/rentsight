'use client';

/**
 * Sidebar Component - Desktop/Tablet Navigation
 *
 * Implements sidebar navigation pattern from "AI Hiring - SaaS CRM Web App" reference.
 * Features:
 * - Fixed position, full height (100vh)
 * - Width: 256px (16 * 16px)
 * - Icon + label navigation items
 * - Active state highlighting with primary color
 * - Only visible on md breakpoint and above (>= 768px)
 *
 * Per FR-014: Full-height layout, icon+label combinations, active state highlighting
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Home,
  Receipt,
  Tag,
  FileText,
  Building2,
  BarChart3,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
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
    label: 'Rent Entries',
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
  {
    href: '/reports',
    icon: BarChart3,
    label: 'Reports',
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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block fixed left-0 top-0 h-screen w-64 bg-card dark:bg-card-dark border-r border-border dark:border-border-dark z-40">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-border dark:border-border-dark">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">RentSight</h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-md font-medium transition-[background-color,color] duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text dark:text-text-dark hover:bg-hover dark:hover:bg-hover-dark',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
