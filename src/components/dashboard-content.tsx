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
import { CurrencyDisplay } from '@/components/ui/currency-display';

interface AnalyticsSummary {
  total_rent_income: number;
  total_booked_days: number;
  total_platform_income: number;
  total_expenses: number;
  average_days_per_rent: number;
}

interface UserPreferences {
  currency_format: string;
  language: string;
  default_view: string;
  theme_preference?: string | null;
}

export function DashboardContent({ userId }: { userId: string }) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch analytics summary
        const summaryResponse = await fetch('/api/analytics/summary');
        if (!summaryResponse.ok) {
          throw new Error(`Error: ${summaryResponse.status}`);
        }
        const summaryData: AnalyticsSummary = await summaryResponse.json();
        setSummary(summaryData);

        // Fetch user preferences
        const preferencesResponse = await fetch('/api/user/preferences');
        if (preferencesResponse.ok) {
          const preferencesData: UserPreferences = await preferencesResponse.json();
          setPreferences(preferencesData);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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

  const currency = preferences?.currency_format || 'USD';

  return (
    <div className="flex flex-col gap-8" data-testid="dashboard-content">
      {/* Currency Display */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted dark:text-muted-dark">
          Displaying amounts in: <span className="font-medium">{currency}</span>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Rent Income"
          value={<CurrencyDisplay value={summary.total_rent_income} currency={currency} />}
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
          value={<CurrencyDisplay value={summary.total_platform_income} currency={currency} />}
          subtitle="Across all platforms"
          icon={CreditCard}
        />
        <MetricsCard
          title="Net Income"
          value={<CurrencyDisplay value={netIncome} currency={currency} />}
          subtitle={
            <CurrencyDisplay
              value={summary.total_expenses}
              currency={currency}
              showSymbol={false}
            />
          }
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
