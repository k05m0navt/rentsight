import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TagListContainer } from '@/components/tags/TagListContainer';
import { TagForm } from '@/components/tags/TagForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function TagsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
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
            <TagForm userId={user.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Tags</CardTitle>
            <CardDescription>
              Manage and organize your existing tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TagListContainer userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

