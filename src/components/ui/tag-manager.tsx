'use client';

import { useState, useEffect } from 'react';
import { Input } from './input';
import { Button } from './button';
import { Card } from './card';
import { TagList } from '@/components/tags/TagList';
import { TagItem } from '@/components/tags/TagItem';
import { TagForm } from '@/components/tags/TagForm';
import { TagEmptyState } from '@/components/tags/TagEmptyState';
import { ErrorMessage } from '@/components/ui/error-message';
import { Search, Plus, Grid, List, X } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagManagerProps {
  userId: string;
  selectedTagIds: string[];
  onSelectedTagIdsChange: (tagIds: string[]) => void;
  mode?: 'select' | 'manage';
  layout?: 'grid' | 'list' | 'compact';
}

export function TagManager({
  userId,
  selectedTagIds,
  onSelectedTagIdsChange,
  mode = 'select',
  layout = 'compact',
}: TagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>(
    layout === 'compact' ? 'grid' : layout,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  useEffect(() => {
    fetchTags();
  }, [userId]);

  useEffect(() => {
    // Filter tags based on search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredTags(tags.filter((tag) => tag.name.toLowerCase().includes(query)));
    } else {
      setFilteredTags(tags);
    }
  }, [searchQuery, tags]);

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
      setFilteredTags(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (tag: { id?: string; name: string; color?: string }) => {
    const { name, color } = tag;
    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const newTag: Tag = await response.json();
    setTags((prev) => [...prev, newTag]);
    setShowCreateForm(false);
  };

  const handleUpdateTag = async (tag: { id?: string; name: string; color?: string }) => {
    if (!tag.id) return;
    const response = await fetch(`/api/tags/${tag.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tag.name, color: tag.color }),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const updatedTag: Tag = await response.json();
    setTags((prev) => prev.map((t) => (t.id === updatedTag.id ? updatedTag : t)));
    setEditingTag(null);
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) {
      return;
    }

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
      // If the deleted tag was selected, update the selectedTagIds as well
      if (selectedTagIds.includes(tagId)) {
        onSelectedTagIdsChange(selectedTagIds.filter((id: string) => id !== tagId));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = (tag: Tag) => {
    const isSelected = selectedTagIds.includes(tag.id);
    const newSelectedTagIds = isSelected
      ? selectedTagIds.filter((id) => id !== tag.id)
      : [...selectedTagIds, tag.id];
    onSelectedTagIdsChange(newSelectedTagIds);
  };

  if (loading && tags.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted dark:text-muted-dark">Loading tags...</div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  // Compact mode - inline badges for forms
  if (layout === 'compact') {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {filteredTags.length === 0 && searchQuery && (
            <p className="text-sm text-muted dark:text-muted-dark">
              No tags found matching &quot;{searchQuery}&quot;
            </p>
          )}
          {filteredTags.length === 0 && !searchQuery && (
            <p className="text-sm text-muted dark:text-muted-dark">
              No tags available. Create your first tag!
            </p>
          )}
          {filteredTags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              selected={selectedTagIds.includes(tag.id)}
              onClick={() => handleTagClick(tag)}
              onDelete={mode === 'manage' ? () => handleDeleteTag(tag.id) : undefined}
              variant="compact"
            />
          ))}
        </div>
      </div>
    );
  }

  // Full management mode with search, filtering, and layout options
  return (
    <div className="space-y-4">
      {/* Search and Actions Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted dark:text-muted-dark" />
          <Input
            type="text"
            placeholder="Search tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors duration-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {mode === 'manage' && (
            <>
              <div className="flex border border-border dark:border-border-dark rounded-md overflow-hidden">
                <button
                  onClick={() => setViewLayout('grid')}
                  className={`p-2 transition-colors duration-200 ${
                    viewLayout === 'grid'
                      ? 'bg-primary text-white'
                      : 'bg-card dark:bg-card-dark text-muted dark:text-muted-dark hover:bg-hover dark:hover:bg-hover-dark'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-2 transition-colors duration-200 ${
                    viewLayout === 'list'
                      ? 'bg-primary text-white'
                      : 'bg-card dark:bg-card-dark text-muted dark:text-muted-dark hover:bg-hover dark:hover:bg-hover-dark'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Tag
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted dark:text-muted-dark">
            Found {filteredTags.length} tag{filteredTags.length !== 1 ? 's' : ''} matching &quot;
            {searchQuery}&quot;
          </span>
        </div>
      )}

      {/* Create/Edit Form */}
      {(showCreateForm || editingTag) && mode === 'manage' && (
        <Card className="p-5">
          <h3 className="text-lg font-bold text-text dark:text-text-dark mb-4">
            {editingTag ? 'Edit Tag' : 'Create New Tag'}
          </h3>
          <TagForm
            tag={editingTag || undefined}
            onSubmit={editingTag ? handleUpdateTag : handleCreateTag}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingTag(null);
            }}
            submitLabel={editingTag ? 'Update Tag' : 'Create Tag'}
          />
        </Card>
      )}

      {/* Tags Display */}
      {filteredTags.length === 0 && !searchQuery ? (
        <TagEmptyState
          onCreateTag={mode === 'manage' ? () => setShowCreateForm(true) : undefined}
        />
      ) : filteredTags.length === 0 && searchQuery ? (
        <Card className="p-8 text-center">
          <p className="text-muted dark:text-muted-dark">No tags found matching your search.</p>
        </Card>
      ) : mode === 'manage' ? (
        <TagList
          tags={filteredTags}
          selectedTagIds={selectedTagIds}
          onTagClick={handleTagClick}
          onTagEdit={setEditingTag}
          onTagDelete={handleDeleteTag}
          layout={viewLayout}
        />
      ) : (
        <div className="space-y-2">
          {filteredTags.map((tag) => (
            <TagItem
              key={tag.id}
              tag={tag}
              selected={selectedTagIds.includes(tag.id)}
              onClick={() => handleTagClick(tag)}
              variant="selectable"
            />
          ))}
        </div>
      )}
    </div>
  );
}
