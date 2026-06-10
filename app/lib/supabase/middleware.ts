import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from './config'

// Routes die inloggen vereisen (de hele app-shell + onboarding).
const BESCHERMD = ['/dex', '/battle', '/items', '/activities', '/analytics', '/feed', '/profile', '/onboarding']
// Auth-pagina's: ingelogde gebruikers stuferen we hier weg naar de app.
const AUTH_PADEN = ['/login', '/register', '/forgot-password', '/reset-password']

// Ververst de Supabase-sessie bij elke request en handelt route-bescherming af.
// Zonder Supabase-config doet de middleware niets (stub-modus).
export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.next()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  // getUser() valideert het token bij Supabase (niet alleen de cookie lezen).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pad = request.nextUrl.pathname
  const isBeschermd = BESCHERMD.some(p => pad === p || pad.startsWith(p + '/'))

  if (!user && isBeschermd) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && AUTH_PADEN.some(p => pad === p)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}
