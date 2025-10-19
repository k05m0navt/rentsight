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
  searchParams: Promise<{ message: string; error: string; redirectTo?: string }>;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { message, error, redirectTo } = await searchParams;

  if (user) {
    // If user is already authenticated, redirect to the originally requested URL
    // or their default view if no specific redirect was requested
    const targetUrl = redirectTo || (await getCurrentUserDefaultView());
    return redirect(targetUrl);
  }

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
      // Preserve redirectTo parameter when showing error
      const redirectParam = redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : '';
      return redirect(`/login?error=${encodeURIComponent(error.message)}${redirectParam}`);
    }

    if (!data.user) {
      const redirectParam = redirectTo ? `&redirectTo=${encodeURIComponent(redirectTo)}` : '';
      return redirect(
        `/login?error=${encodeURIComponent('Authentication failed')}${redirectParam}`,
      );
    }

    // Revalidate the layout to ensure sidebar updates
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');

    // Redirect to the originally requested URL or user's default view
    const { getUserDefaultView } = await import('@/lib/user-preferences');
    const defaultView = await getUserDefaultView(data.user.id);
    const targetUrl = redirectTo || defaultView;
    return redirect(targetUrl);
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
