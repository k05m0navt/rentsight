'use client';

/**
 * Dashboard Content - Redesigned
 *
 * Main dashboard container with enhanced layout and visualizations.
 * Features:
 * - MetricsCard components for summary statistics
 * - New color palette (#DD1202, #1DCC5C)
 * - Card-based layout with consistent spacing
 * - Improved loading and error states
 *
 * Per FR-015: Improved information hierarchy with prominent key data
 */

import { useEffect, useState } from 'react';
import { DollarSign, Calendar, CreditCard, TrendingDown } from 'lucide-react';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { RentAnalytics } from '@/app/dashboard/rent-analytics';
import { ExpenseAnalytics } from '@/app/dashboard/expense-analytics';
import { ExportButton } from '@/components/ui/export-button';

interface AnalyticsSummary {
  total_rent_income: number;
  total_booked_days: number;
  total_platform_income: number;
  total_expenses: number;
  average_days_per_rent: number;
}

export function DashboardContent({ userId }: { userId: string }) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch('/api/analytics/summary');
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data: AnalyticsSummary = await response.json();
        setSummary(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [userId]);

  // Calculate net income
  const netIncome = summary ? summary.total_rent_income - summary.total_expenses : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-muted dark:text-muted-dark">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-error/10 border border-error/20 text-error">
        <p className="font-medium">Error loading analytics</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted dark:text-muted-dark">No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Summary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Rent Income"
          value={`$${summary.total_rent_income.toFixed(2)}`}
          icon={DollarSign}
          variant="primary"
        />
        <MetricsCard
          title="Total Booked Days"
          value={summary.total_booked_days}
          subtitle={`${summary.average_days_per_rent.toFixed(1)} avg per rental`}
          icon={Calendar}
          variant="success"
        />
        <MetricsCard
          title="Platform Income"
          value={`$${summary.total_platform_income.toFixed(2)}`}
          subtitle="Across all platforms"
          icon={CreditCard}
        />
        <MetricsCard
          title="Net Income"
          value={`$${netIncome.toFixed(2)}`}
          subtitle={`After $${summary.total_expenses.toFixed(2)} expenses`}
          icon={TrendingDown}
          trend={netIncome > 0 ? 'up' : netIncome < 0 ? 'down' : 'neutral'}
          variant={netIncome > 0 ? 'success' : 'default'}
        />
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <ExportButton />
      </div>

      {/* Detailed Analytics */}
      <RentAnalytics userId={userId} />
      <ExpenseAnalytics userId={userId} />
    </div>
  );
}
