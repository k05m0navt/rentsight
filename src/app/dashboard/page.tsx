/**
 * Dashboard Page - Redesigned
 *
 * Main analytics dashboard with enhanced layout and visualizations.
 * Features:
 * - Clean header with title and theme toggle
 * - Suspense boundary for loading state
 * - Maximum width container for readability
 * - Consistent spacing from 8-point scale
 *
 * Per FR-015: Improved information hierarchy
 */

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { DashboardContent } from '@/components/dashboard-content';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Dashboard - RentSight',
  description: 'Analytics dashboard for rental property management',
};

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-sm text-muted dark:text-muted-dark mt-1">
          Track your rental performance and expenses
        </p>
      </div>

      {/* Dashboard Content with Loading State */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent userId={user.id} />
      </Suspense>
    </div>
  );
}

// Note: PageTransition not added to server component dashboard page to avoid hydration issues
// Animation is handled by client components within DashboardContent
