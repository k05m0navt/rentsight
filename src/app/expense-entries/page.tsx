import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import { ExpenseEntryForm } from '@/components/forms/expense-entry-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseEntrySkeleton } from '@/components/expense-entries/ExpenseEntrySkeleton';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const dynamic = 'force-dynamic';

export default async function ExpenseEntriesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <ProtectedRoute>
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Expense Entries</h1>
          <p className="text-muted-foreground">Add and manage your rental property expenses</p>
        </div>

        <Suspense fallback={<ExpenseEntrySkeleton />}>
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense Entry</CardTitle>
              <CardDescription>Record expenses related to your rental properties</CardDescription>
            </CardHeader>
            <CardContent>
              {user ? <ExpenseEntryForm userId={user.id} /> : <ExpenseEntrySkeleton />}
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
