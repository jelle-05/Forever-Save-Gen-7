import { createBrowserClient } from '@supabase/ssr'

// Supabase-client voor Client Components (browser). Gebruikt uitsluitend de
// publieke anon-key; RLS beschermt de data. De sessie staat in cookies, zodat
// server components en middleware 'm ook kunnen lezen.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
