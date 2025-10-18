'use client';

import { useEffect, useState } from 'react';
import { TagItem } from './TagItem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagUsage {
  properties: number;
  rentEntries: number;
  expenseEntries: number;
  total: number;
}

interface ConfirmationDialog {
  tagId: string;
  tagName: string;
  usage: TagUsage;
}

interface TagListContainerProps {
  userId: string;
}

export function TagListContainer({ userId }: TagListContainerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmationDialog | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleDelete = async (tagId: string, tagName: string) => {
    try {
      // First, check if tag is in use (T057)
      const usageResponse = await fetch(`/api/tags/${tagId}/usage`);

      if (!usageResponse.ok) {
        throw new Error('Failed to check tag usage');
      }

      const usageData = await usageResponse.json();

      // If tag is in use, show confirmation dialog (T057)
      if (usageData.status === 'in_use' && usageData.usage.total > 0) {
        setConfirmDialog({
          tagId,
          tagName,
          usage: usageData.usage,
        });
        return;
      }

      // Tag is not in use, delete directly
      await deleteTagConfirmed(tagId, tagName, usageData.usage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag');
    }
  };

  const deleteTagConfirmed = async (tagId: string, tagName: string, usage: TagUsage) => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/tags/${tagId}?confirm=true`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete tag');
      }

      const result = await response.json();

      // Show success message (T059)
      const message =
        usage.total > 0
          ? `Tag "${tagName}" deleted successfully. Removed from ${usage.rentEntries} rent entries and ${usage.expenseEntries} expense entries.`
          : `Tag "${tagName}" deleted successfully.`;

      setSuccessMessage(message);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);

      // Refresh tags list
      await fetchTags();

      // Close confirmation dialog
      setConfirmDialog(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag');
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDialog) {
      deleteTagConfirmed(confirmDialog.tagId, confirmDialog.tagName, confirmDialog.usage);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog(null);
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
    <>
      {/* Success Message (T059) */}
      {successMessage && (
        <div className="mb-4 p-4 rounded-md bg-success/10 border border-success/20 text-success">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-md bg-error/10 border border-error/20 text-error">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline hover:no-underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Tag Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <TagItem key={tag.id} tag={tag} onDelete={() => handleDelete(tag.id, tag.name)} />
        ))}
      </div>

      {/* Confirmation Dialog (T057) */}
      {confirmDialog && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={handleCancelDelete}
        >
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="text-error">Delete Tag: {confirmDialog.tagName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Warning message with counts */}
              <div className="p-4 rounded-md bg-warning/10 border border-warning/20">
                <p className="text-sm font-medium text-warning mb-2">
                  This tag is currently in use
                </p>
                <p className="text-sm text-muted dark:text-muted-dark">This tag is used by:</p>
                <ul className="mt-2 text-sm text-text dark:text-text-dark space-y-1 ml-4">
                  {confirmDialog.usage.rentEntries > 0 && (
                    <li>• {confirmDialog.usage.rentEntries} rent entries</li>
                  )}
                  {confirmDialog.usage.expenseEntries > 0 && (
                    <li>• {confirmDialog.usage.expenseEntries} expense entries</li>
                  )}
                </ul>
                <p className="mt-3 text-sm text-muted dark:text-muted-dark">
                  The tag will be automatically removed from all associated entries before deletion.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={handleCancelDelete} disabled={deleting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="bg-error hover:bg-error/90 text-white"
                >
                  {deleting ? 'Deleting...' : 'Delete Anyway'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
