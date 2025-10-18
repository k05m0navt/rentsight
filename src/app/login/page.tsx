/**
 * Login Page - Redesigned
 *
 * Updated authentication form with new design system.
 * Uses redesigned Input and Button components.
 * Centered card-based layout with modern styling.
 */

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCurrentUserDefaultView } from '@/lib/user-preferences';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Login - RentSight',
  description: 'Sign in to your RentSight account',
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message: string; error: string }>;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const defaultView = await getCurrentUserDefaultView();
    return redirect(defaultView);
  }

  const { message, error } = await searchParams;

  const signIn = async (formData: FormData) => {
    'use server';
    const email = formData.get('email');
    const password = formData.get('password');
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email as string,
      password: password as string,
    });

    if (error) {
      return redirect(`/login?error=${error.message}`);
    }

    if (!data.user) {
      return redirect('/login?error=Authentication failed');
    }

    // Revalidate the layout to ensure sidebar updates
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');

    // Get user's default view preference
    const { getUserDefaultView } = await import('@/lib/user-preferences');
    const defaultView = await getUserDefaultView(data.user.id);
    return redirect(defaultView);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md px-4">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle as="h1">Sign In to RentSight</CardTitle>
            <CardDescription>
              Enter your credentials to access your rental analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" formAction={signIn} className="w-full mt-2">
                Sign In
              </Button>

              {error && (
                <div className="p-3 rounded-md bg-error/10 border border-error/20 text-error text-sm text-center">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 rounded-md bg-success/10 border border-success/20 text-success text-sm text-center">
                  {message}
                </div>
              )}

              <div className="text-center text-sm text-muted dark:text-muted-dark mt-4">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign Up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
