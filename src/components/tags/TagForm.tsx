'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { ErrorMessage } from '@/components/ui/error-message';

interface Tag {
  id?: string;
  name: string;
  color?: string;
}

interface TagFormProps {
  tag?: Tag;
  onSubmit: (tag: { id?: string; name: string; color?: string }) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TagForm({ tag, onSubmit, onCancel, submitLabel = 'Create Tag' }: TagFormProps) {
  const [name, setName] = useState(tag?.name || '');
  const [color, setColor] = useState(tag?.color || '#FF6B35');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tag) {
      setName(tag.name);
      setColor(tag.color || '#FF6B35');
    }
  }, [tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Tag name is required');
      return;
    }

    if (name.length > 50) {
      setError('Tag name must be 50 characters or less');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...(tag?.id ? { id: tag.id } : {}),
        name: name.trim(),
        color,
      });

      // Reset form if creating new tag (no tag.id)
      if (!tag?.id) {
        setName('');
        setColor('#FF6B35');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="tag-name"
          className="block text-sm font-medium text-text dark:text-text-dark mb-2"
        >
          Tag Name
        </label>
        <Input
          id="tag-name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="Enter tag name"
          maxLength={50}
          disabled={loading}
          className="w-full"
          aria-required="true"
          aria-invalid={error ? 'true' : 'false'}
        />
        <span className="text-xs text-muted dark:text-muted-dark mt-1 block">
          {name.length}/50 characters
        </span>
      </div>

      <div>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="flex items-center gap-3 pt-3">
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !name.trim()}
          className="flex-1"
        >
          {loading ? 'Saving...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
