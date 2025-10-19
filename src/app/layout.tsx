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
import { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import ThemeProvider from '@/components/ThemeProvider';
import { MotionProvider } from '@/components/MotionProvider';
import { Sidebar } from '@/components/Layout/Sidebar';
import { BottomNav } from '@/components/Layout/BottomNav';
import { InstallPrompt } from '@/components/InstallPrompt';
import { OfflineIndicator, OfflineIndicatorCompact } from '@/components/OfflineIndicator';
import { PWAUpdateNotification } from '@/components/PWAUpdateNotification';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Optimize font loading
});

export const metadata: Metadata = {
  title: 'RentSight - Rental Analytics Dashboard',
  description:
    'Modern analytics platform for rental property management. Track income, expenses, and performance across all your properties.',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'RentSight',
    title: 'RentSight - Rental Analytics Dashboard',
    description: 'Modern analytics platform for rental property management.',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f97316',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={cn('min-h-screen bg-background text-text font-sans antialiased', inter.variable)}
      >
        <Analytics />
        <SpeedInsights />
        <ThemeProvider>
          <MotionProvider>
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

            {/* PWA Install Prompt */}
            <InstallPrompt />

            {/* PWA Update Notification */}
            <PWAUpdateNotification />

            {/* Offline Indicators */}
            <OfflineIndicator />
            <OfflineIndicatorCompact />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
