'use client';

/**
 * Expense Analytics Component - Redesigned
 *
 * Updated with enhanced visualizations using new design system.
 * Features:
 * - MetricsCard components for expense statistics
 * - Primary accent color (#DD1202) for total expense metrics
 * - Improved categorization and visual hierarchy
 * - Enhanced loading and empty states
 *
 * Per FR-003: Enhanced chart designs with new color palette
 */

import { useState, useEffect, useCallback } from 'react';
import { DollarSign, Receipt, PieChart } from 'lucide-react';
import { TagManager } from '@/components/ui/tag-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { ExpenseAnalyticsSkeleton } from '@/components/dashboard/ExpenseAnalyticsSkeleton';

interface Tag {
  id: string;
  name: string;
}

interface ExpenseEntry {
  id: string;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  tags: Tag[];
}

export function ExpenseAnalytics({ userId }: { userId: string }) {
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const fetchExpenseEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      selectedTagIds.forEach((tagId) => queryParams.append('tag_id', tagId));
      const response = await fetch(`/api/expense_entries?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: ExpenseEntry[] = await response.json();
      setExpenseEntries(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedTagIds]);

  useEffect(() => {
    fetchExpenseEntries();
  }, [fetchExpenseEntries]);

  // Calculate summary metrics
  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const categories = [...new Set(expenseEntries.map((e) => e.category))];
  const averageExpense = expenseEntries.length > 0 ? totalExpenses / expenseEntries.length : 0;

  if (loading) {
    return <ExpenseAnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-error/10 border border-error/20 text-error">
        Error loading expense analytics: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Expense Analytics</h2>
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
          title="Total Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
          subtitle={`From ${expenseEntries.length} expenses`}
          icon={DollarSign}
          variant="primary"
        />
        <MetricsCard
          title="Categories"
          value={categories.length}
          subtitle="Different expense types"
          icon={PieChart}
        />
        <MetricsCard
          title="Average Expense"
          value={`$${averageExpense.toFixed(2)}`}
          subtitle="Per expense entry"
          icon={Receipt}
        />
      </div>

      {/* Expense Entries List */}
      {expenseEntries.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted dark:text-muted-dark">
            No expense entries available for the selected filters.
          </p>
          <p className="text-sm text-muted dark:text-muted-dark mt-2">
            Try adjusting your tag filters or add new expense entries.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expenseEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="text-lg">${entry.amount.toFixed(2)}</CardTitle>
                <p className="text-sm text-muted dark:text-muted-dark">{entry.category}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {entry.description && (
                    <p className="text-muted dark:text-muted-dark">{entry.description}</p>
                  )}
                  <p className="text-xs text-muted dark:text-muted-dark">Date: {entry.date}</p>
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
