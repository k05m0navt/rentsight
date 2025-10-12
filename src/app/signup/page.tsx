/**
 * Signup Page - Redesigned
 *
 * Updated registration form with new design system.
 * Uses redesigned Input and Button components.
 * Centered card-based layout matching login page.
 */

import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<{ message: string; error: string }>;
}) {
  const { message, error } = await searchParams;

  const signUp = async (formData: FormData) => {
    'use server';
    const email = formData.get('email');
    const password = formData.get('password');
    const supabase = createClient();
    const headersList = await headers();
    const origin = headersList.get('origin');

    const { error } = await supabase.auth.signUp({
      email: email as string,
      password: password as string,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect(`/signup?error=${error.message}`);
    }

    return redirect('/login?message=Check email to verify your account');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md px-4">
        {/* Back navigation */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <Card>
          <CardHeader>
            <CardTitle as="h1">Create Your Account</CardTitle>
            <CardDescription>Sign up to start tracking your rental analytics</CardDescription>
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

              <Button type="submit" formAction={signUp} className="w-full mt-2">
                Sign Up
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
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
