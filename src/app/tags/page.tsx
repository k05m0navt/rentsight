'use client';

export const dynamic = 'force-dynamic';

import { TagListContainer } from '@/components/tags/TagListContainer';
import { TagForm } from '@/components/tags/TagForm';
import { TagListSkeleton } from '@/components/tags/TagListSkeleton';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function TagsPage() {
  const { user } = useAuth();

  const handleTagSubmit = async (tag: { name: string; color?: string }) => {
    const response = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tag),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create tag');
    }

    // Reload to refresh the tag list
    window.location.reload();
  };

  return (
    <AuthGuard fallback={<TagListSkeleton />}>
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tags</h1>
          <p className="text-muted-foreground">
            Create and manage tags for organizing your entries
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Tag</CardTitle>
              <CardDescription>
                Add a new tag to categorize your rent and expense entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TagForm onSubmit={handleTagSubmit} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Tags</CardTitle>
              <CardDescription>Manage and organize your existing tags</CardDescription>
            </CardHeader>
            <CardContent>{user && <TagListContainer userId={user.id} />}</CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}
