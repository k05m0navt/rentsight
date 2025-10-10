'use client';

import { useState, useEffect } from 'react';
import { TagManager } from '@/components/ui/tag-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  useEffect(() => {
    fetchExpenseEntries();
  }, [userId, selectedTagIds]);

  const fetchExpenseEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      selectedTagIds.forEach(tagId => queryParams.append('tag_id', tagId));
      const response = await fetch(`/api/expense_entries?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: ExpenseEntry[] = await response.json();
      setExpenseEntries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading expense analytics...</div>;
  if (error) return <div className="text-red-500">Error loading expense analytics: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Expense Analytics</h2>
      <TagManager userId={userId} selectedTagIds={selectedTagIds} onSelectedTagIdsChange={setSelectedTagIds} />
      {expenseEntries.length === 0 ? (
        <div>No expense entries available for the selected filters.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {expenseEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle>${entry.amount.toFixed(2)} - {entry.category}</CardTitle>
              </CardHeader>
              <CardContent>
                {entry.description && <p>Description: {entry.description}</p>}
                <p>Date: {entry.date}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {entry.tags.map(tag => (
                    <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

