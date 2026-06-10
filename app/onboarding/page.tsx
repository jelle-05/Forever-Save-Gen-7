import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import OnboardingForm from '@/components/OnboardingForm'

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) redirect('/dex')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Heeft de gebruiker al een profiel? Dan door naar de app.
  const { data: profiel } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle()
  if (profiel) redirect('/dex')

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <OnboardingForm userId={user.id} />
        </div>
      </div>
    </div>
  )
}
