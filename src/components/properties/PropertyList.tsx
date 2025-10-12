/**
 * PropertyList Component
 *
 * Displays list of properties with infinite scroll and virtualization.
 * Shows empty state when no properties exist.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { PropertyWithStats } from '@/types/property';
import { PropertyItem } from './PropertyItem';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Plus, Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PropertyListProps {
  onAdd: () => void;
  onEdit: (property: PropertyWithStats) => void;
  onDelete: (property: PropertyWithStats) => void;
}

export function PropertyList({ onAdd, onEdit, onDelete }: PropertyListProps) {
  const [properties, setProperties] = useState<PropertyWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);

  const fetchProperties = useCallback(
    async (cursor?: string, reset = false) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        if (searchTerm) params.set('search', searchTerm);

        const response = await fetch(`/api/properties?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setProperties((prev) => (reset ? data.items : [...prev, ...data.items]));
          setNextCursor(data.nextCursor);
          setTotal(data.total);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm],
  );

  useEffect(() => {
    fetchProperties(undefined, true);
  }, [fetchProperties]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties(undefined, true);
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchProperties(nextCursor, false);
    }
  };

  // Empty state
  if (!loading && properties.length === 0 && !searchTerm) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 rounded-full bg-card dark:bg-card-dark mb-4">
          <Building2 className="h-12 w-12 text-muted dark:text-muted-dark" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No properties yet</h2>
        <p className="text-muted dark:text-muted-dark mb-6 max-w-md">
          Start by adding your first property to organize your rental business
        </p>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add First Property
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <form onSubmit={handleSearch} className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted dark:text-muted-dark" />
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Property count */}
      <p className="text-sm text-muted dark:text-muted-dark">
        {total} {total === 1 ? 'property' : 'properties'} found
      </p>

      {/* Property grid */}
      {loading && properties.length === 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-card dark:bg-card-dark rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-card dark:bg-card-dark rounded w-full mb-2" />
                <div className="h-4 bg-card dark:bg-card-dark rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyItem
              key={property.id}
              property={property}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted dark:text-muted-dark">
            No properties found matching &quot;{searchTerm}&quot;
          </p>
          <Button variant="secondary" onClick={() => setSearchTerm('')} className="mt-4">
            Clear Search
          </Button>
        </div>
      )}

      {/* Load more button */}
      {nextCursor && !loading && (
        <div className="flex justify-center pt-4">
          <Button variant="secondary" onClick={handleLoadMore}>
            Load More
          </Button>
        </div>
      )}

      {loading && properties.length > 0 && (
        <div className="flex justify-center pt-4">
          <p className="text-sm text-muted dark:text-muted-dark">Loading more properties...</p>
        </div>
      )}
    </div>
  );
}
