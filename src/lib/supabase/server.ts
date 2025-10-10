import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies()
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          const cookieStore = await cookies()
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler
            // This error is typically ignored if we're in a Client Component
          }
        },
        async remove(name: string, options: CookieOptions) {
          const cookieStore = await cookies()
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `cookies().set()` method can only be called in a Server Component or Route Handler
            // This error is typically ignored if we're in a Client Component
          }
        },
      },
    }
  )
}

