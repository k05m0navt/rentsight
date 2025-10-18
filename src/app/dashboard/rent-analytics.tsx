'use client';

/**
 * Rent Analytics Component - Redesigned
 *
 * Updated with enhanced visualizations using new design system.
 * Features:
 * - MetricsCard components for key statistics
 * - Primary accent color (#DD1202) for income metrics
 * - Success color (#1DCC5C) for positive trends
 * - Improved loading and empty states
 *
 * Per FR-003: Enhanced chart designs with new color palette
 */

import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { TagManager } from '@/components/ui/tag-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { useDateFormat } from '@/hooks/useDateFormat';
import { RentAnalyticsSkeleton } from '@/components/dashboard/RentAnalyticsSkeleton';
import { getPlatformDisplayName } from '@/lib/services/platformService';

interface Tag {
  id: string;
  name: string;
}

interface RentEntry {
  id: string;
  amount: number;
  booked_days: number;
  platform: string;
  custom_platform_name?: string;
  start_date: string;
  end_date: string;
  tags: Tag[];
}

export function RentAnalytics({ userId }: { userId: string }) {
  const [rentEntries, setRentEntries] = useState<RentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const { formatDate } = useDateFormat();

  const fetchRentEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      selectedTagIds.forEach((tagId) => queryParams.append('tag_id', tagId));
      const response = await fetch(`/api/rent_entries?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: RentEntry[] = await response.json();
      setRentEntries(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedTagIds]);

  useEffect(() => {
    fetchRentEntries();
  }, [fetchRentEntries]);

  // Calculate summary metrics
  const totalIncome = rentEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalDays = rentEntries.reduce((sum, entry) => sum + entry.booked_days, 0);
  const averageIncome = rentEntries.length > 0 ? totalIncome / rentEntries.length : 0;

  if (loading) {
    return <RentAnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-error/10 border border-error/20 text-error">
        Error loading rent analytics: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rent Income Analytics</h2>
      </div>

      {/* Tag Filter */}
      <TagManager
        userId={userId}
        selectedTagIds={selectedTagIds}
        onSelectedTagIdsChange={setSelectedTagIds}
      />

      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricsCard
          title="Total Income"
          value={`$${totalIncome.toFixed(2)}`}
          subtitle={`From ${rentEntries.length} bookings`}
          icon={DollarSign}
          variant="primary"
        />
        <MetricsCard
          title="Total Booked Days"
          value={totalDays}
          subtitle="Across all properties"
          icon={Calendar}
          variant="success"
        />
        <MetricsCard
          title="Average Booking"
          value={`$${averageIncome.toFixed(2)}`}
          subtitle="Per rental period"
          icon={TrendingUp}
        />
      </div>

      {/* Rent Entries List */}
      {rentEntries.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted dark:text-muted-dark">
            No rent entries available for the selected filters.
          </p>
          <p className="text-sm text-muted dark:text-muted-dark mt-2">
            Try adjusting your tag filters or add new rent entries.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rentEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="text-lg">${entry.amount.toFixed(2)}</CardTitle>
                <p className="text-sm text-muted dark:text-muted-dark">
                  {getPlatformDisplayName(entry.platform, entry.custom_platform_name)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted dark:text-muted-dark" />
                    <span>{entry.booked_days} days booked</span>
                  </div>
                  <p className="text-xs text-muted dark:text-muted-dark">
                    {formatDate(entry.start_date)} → {formatDate(entry.end_date)}
                  </p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border dark:border-border-dark">
                      {entry.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
