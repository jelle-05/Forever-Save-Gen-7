import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

// Layout voor alle ingelogde app-routes. Bewaakt toegang: zonder sessie naar
// /login, met sessie maar zonder profiel naar /onboarding. Zonder Supabase-config
// (stub-modus) tonen we de shell direct zodat de app browsable blijft.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profiel } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle()
    if (!profiel) redirect('/onboarding')
  }

  return <AppShell>{children}</AppShell>
}
