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
 * - Authentication controls at bottom (Sign In/Log Out)
 * - Theme toggle at bottom
 *
 * Per FR-001 to FR-003: Sidebar authentication controls and theme toggle
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
  LogOut,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

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
  const { user, loading, logout } = useAuth();

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-40 flex-col"
      data-testid="sidebar"
    >
      {/* Logo/Brand */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">RentSight</h1>
        </Link>
      </div>

      {/* Navigation - Grows to push bottom section down */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-md font-medium transition-[background-color,color] duration-200',
                isActive ? 'bg-primary/10 text-primary' : 'text-text hover:bg-hover',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section - Auth Controls */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Authentication Controls */}
        <div className="flex flex-col gap-2">
          {loading ? (
            // Loading state
            <div className="flex items-center justify-center px-4 py-2 rounded-md border border-border">
              <span className="text-xs text-muted">Loading...</span>
            </div>
          ) : user ? (
            // Logged in - Show Log Out button
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm bg-background border border-border hover:bg-hover transition-colors duration-200"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>Log Out</span>
            </button>
          ) : (
            // Not logged in - Show Sign In button
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
              aria-label="Sign in"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
