import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

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
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <nav aria-label="Page navigation" className="absolute left-8 top-8">
        <Link
          href="/login"
          className="py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Login
        </Link>
      </nav>

      <main className="flex-1 flex flex-col w-full justify-center gap-2">
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
        <form className="flex flex-col w-full gap-2 text-foreground">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button
            type="submit"
            formAction={signUp}
            className="bg-green-700 rounded-md px-4 py-2 text-white hover:bg-green-800 mb-2"
          >
            Sign Up
          </button>
          {error && (
            <p className="mt-4 p-4 bg-foreground/10 text-destructive text-center">{error}</p>
          )}
          {message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">{message}</p>
          )}
        </form>
      </main>
    </div>
  );
}
