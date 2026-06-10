import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Supabase-client voor Server Components, Route Handlers en Server Actions.
// In Next.js 16 is cookies() async, vandaar de await.
//
// Let op: roep altijd supabase.auth.getUser() aan (niet getSession()) wanneer je
// server-side op de identiteit van de gebruiker vertrouwt — getUser valideert
// het token bij Supabase, getSession leest enkel de cookie.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // setAll wordt aangeroepen vanuit een Server Component zonder
            // schrijfrechten op cookies. Veilig te negeren: de middleware
            // ververst de sessie bij elke request.
          }
        },
      },
    },
  )
}
