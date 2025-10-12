'use client';

import { useEffect, useState } from 'react';
import { TagItem } from './TagItem';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagListContainerProps {
  userId: string;
}

export function TagListContainer({ userId }: TagListContainerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, [userId]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }
      const data = await response.json();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tag');
      }

      // Refresh tags list
      fetchTags();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete tag');
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading tags...</p>;
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  if (tags.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-2">No tags yet</p>
        <p className="text-sm text-muted-foreground">Create your first tag using the form above</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tags.map((tag) => (
        <TagItem key={tag.id} tag={tag} onDelete={() => handleDelete(tag.id)} />
      ))}
    </div>
  );
}
