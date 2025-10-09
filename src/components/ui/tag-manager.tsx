import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input } from './input';
import { Button } from './button';
import { Badge } from './badge';

interface Tag {
  id: string;
  name: string;
}

interface TagManagerProps {
  userId: string;
  onTagsChange?: (tags: Tag[]) => void;
}

export function TagManager({ userId, onTagsChange }: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchTags();
  }, [userId]);

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: Tag[] = await response.json();
      setTags(data);
      onTagsChange?.(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTagName }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const newTag: Tag = await response.json();
      setTags((prev) => [...prev, newTag]);
      onTagsChange?.([...tags, newTag]);
      setNewTagName('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      setTags((prev) => prev.filter((tag) => tag.id !== tagId));
      onTagsChange?.(tags.filter((tag) => tag.id !== tagId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading tags...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddTag();
            }
          }}
        />
        <Button onClick={handleAddTag} disabled={loading}>
          Add Tag
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
            {tag.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteTag(tag.id)}
              disabled={loading}
              className="h-auto p-0 ml-1 leading-none text-red-500"
            >
              x
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
}

