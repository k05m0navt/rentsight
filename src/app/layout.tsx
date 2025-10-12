/**
 * Root Layout - Complete Application Redesign
 *
 * Integrates redesigned navigation system:
 * - Sidebar navigation for desktop/tablet (>= 768px)
 * - Bottom navigation bar for mobile (< 768px)
 * - Dark theme as default with Inter font family
 *
 * Per FR-014: Sidebar navigation on desktop/tablet, bottom nav on mobile
 * Per FR-016: Dark theme as primary theme
 */

import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import ThemeProvider from '@/components/ThemeProvider';
import { Sidebar } from '@/components/Layout/Sidebar';
import { BottomNav } from '@/components/Layout/BottomNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Optimize font loading
});

export const metadata = {
  title: 'RentSight - Rental Analytics Dashboard',
  description:
    'Modern analytics platform for rental property management. Track income, expenses, and performance across all your properties.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark font-sans antialiased',
          inter.variable,
        )}
      >
        <ThemeProvider>
          {/* Desktop/Tablet: Sidebar Navigation */}
          <Sidebar />

          {/* Mobile: Bottom Navigation Bar */}
          <BottomNav />

          {/* Main content area with responsive padding */}
          {/* pb-20 for bottom nav on mobile, md:pb-12 for desktop */}
          {/* md:pl-80 = 320px (256px sidebar + 64px space) */}
          {/* md:pr-16 = 64px for equal spacing on both sides */}
          {/* px-8 py-10 for spacing on mobile (32px horizontal, 40px vertical) */}
          {/* md:pr-16 md:py-12 for spacing on desktop (64px right, 48px vertical) */}
          <main className="min-h-screen pb-20 md:pb-12 pl-8 pr-8 py-10 md:pl-80 md:pr-16 md:py-12 transition-[padding] duration-200">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
