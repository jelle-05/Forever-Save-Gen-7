'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import AuthHeader from '@/components/AuthHeader'
import Button from '@/components/ui/Button'

// Bereikt na het klikken van de herstellink: de callback heeft dan al een sessie
// aangemaakt, hier stelt de gebruiker een nieuw wachtwoord in.
export default function ResetPasswordPage() {
  const router = useRouter()
  const [wachtwoord, setWachtwoord] = useState('')
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState('')

  const geconfigureerd = isSupabaseConfigured()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (wachtwoord.length < 8) {
      setFout('Kies een wachtwoord van minimaal 8 tekens.')
      return
    }
    setLaden(true)
    setFout('')
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: wachtwoord })
    if (error) {
      setFout(error.message)
      setLaden(false)
      return
    }
    router.replace('/')
    router.refresh()
  }

  return (
    <>
      <AuthHeader title="Nieuw wachtwoord" subtitle="Stel een nieuw wachtwoord in voor je account." />

      <form onSubmit={submit} className="space-y-3">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 divide-y divide-gray-100 shadow-sm">
          <div className="px-4 py-3.5">
            <input
              type="password"
              autoComplete="new-password"
              required
              placeholder="Nieuw wachtwoord (min. 8 tekens)"
              value={wachtwoord}
              onChange={e => setWachtwoord(e.target.value)}
              className="w-full text-[15px] outline-none placeholder:text-gray-400 bg-transparent"
            />
          </div>
        </div>

        {fout && <p className="text-red-500 text-sm text-center px-2">{fout}</p>}

        <Button type="submit" className="w-full" disabled={laden || !geconfigureerd || !wachtwoord}>
          {laden ? 'Bezig…' : 'Wachtwoord opslaan'}
        </Button>
      </form>
    </>
  )
}
