import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { DashboardContent } from '@/components/dashboard-content';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Rentsight Analytics Dashboard</h1>
      <Suspense fallback={<div>Loading analytics...</div>}>
        <DashboardContent userId={user.id} />
      </Suspense>
    </div>
  );
}

