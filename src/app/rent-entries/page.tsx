import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RentEntryForm } from '@/components/forms/rent-entry-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function RentEntriesPage() {
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
        <h1 className="text-3xl font-bold mb-2">Rent Entries</h1>
        <p className="text-muted-foreground">Add and manage your rental income entries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Rent Entry</CardTitle>
          <CardDescription>Record rental income from your properties</CardDescription>
        </CardHeader>
        <CardContent>
          <RentEntryForm userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
