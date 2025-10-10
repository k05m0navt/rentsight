'use client';

import { useState, useEffect } from 'react';
import { TagManager } from '@/components/ui/tag-manager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Tag {
  id: string;
  name: string;
}

interface RentEntry {
  id: string;
  amount: number;
  booked_days: number;
  platform: string;
  start_date: string;
  end_date: string;
  tags: Tag[];
}

export function RentAnalytics({ userId }: { userId: string }) {
  const [rentEntries, setRentEntries] = useState<RentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  useEffect(() => {
    fetchRentEntries();
  }, [userId, selectedTagIds]);

  const fetchRentEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      selectedTagIds.forEach(tagId => queryParams.append('tag_id', tagId));
      const response = await fetch(`/api/rent_entries?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: RentEntry[] = await response.json();
      setRentEntries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading rent analytics...</div>;
  if (error) return <div className="text-red-500">Error loading rent analytics: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Rent Income Analytics</h2>
      <TagManager userId={userId} selectedTagIds={selectedTagIds} onSelectedTagIdsChange={setSelectedTagIds} />
      {rentEntries.length === 0 ? (
        <div>No rent entries available for the selected filters.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rentEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle>${entry.amount.toFixed(2)} - {entry.platform}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Booked Days: {entry.booked_days}</p>
                <p>From: {entry.start_date} to {entry.end_date}</p>
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

