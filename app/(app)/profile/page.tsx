import { redirect } from 'next/navigation'
import { UserRound } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import ProfielInstellingen from '@/components/ProfielInstellingen'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { menuKleur } from '@/lib/kleuren'
import type { Profile } from '@/lib/profiel'

export default async function ProfilePage() {
  // Stub-modus: Supabase nog niet gekoppeld.
  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageHeader title="Profiel" />
        <EmptyState
          icon={UserRound}
          title="Profiel"
          description="Koppel Supabase (env-vars) om accounts, profielen en privacy-instellingen te activeren."
          color={menuKleur('/profile')}
        />
      </>
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profiel } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (!profiel) redirect('/onboarding')

  return <ProfielInstellingen profiel={profiel as Profile} />
}
