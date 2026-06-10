import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Wisselt de code uit de e-maillink (bevestiging / wachtwoordherstel) in voor
// een sessie en stuurt door. `next` bepaalt de bestemming (default de root).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
