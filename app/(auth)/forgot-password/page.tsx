'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import AuthHeader from '@/components/AuthHeader'
import Button from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState('')
  const [verstuurd, setVerstuurd] = useState(false)

  const geconfigureerd = isSupabaseConfigured()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLaden(true)
    setFout('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) {
      setFout(error.message)
      setLaden(false)
      return
    }
    setVerstuurd(true)
    setLaden(false)
  }

  if (verstuurd) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#34C759] mx-auto mb-3">
          <Mail size={28} className="text-white" />
        </div>
        <h1 className="text-[22px] font-bold text-gray-900 mb-2">Check je e-mail</h1>
        <p className="text-[15px] text-gray-500 leading-relaxed">
          Als er een account bij <strong className="text-gray-800">{email}</strong> hoort, hebben we een herstellink
          gestuurd.
        </p>
        <Link href="/login" className="inline-block mt-6 text-[14px] text-[#007AFF] font-medium">
          Terug naar inloggen
        </Link>
      </div>
    )
  }

  return (
    <>
      <AuthHeader title="Wachtwoord vergeten" subtitle="We sturen je een link om een nieuw wachtwoord in te stellen." />

      <form onSubmit={submit} className="space-y-3">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 divide-y divide-gray-100 shadow-sm">
          <div className="px-4 py-3.5">
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="E-mailadres"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-[15px] outline-none placeholder:text-gray-400 bg-transparent"
            />
          </div>
        </div>

        {fout && <p className="text-red-500 text-sm text-center px-2">{fout}</p>}

        <Button type="submit" className="w-full" disabled={laden || !geconfigureerd || !email}>
          {laden ? 'Bezig…' : 'Stuur herstellink'}
        </Button>
      </form>

      <p className="text-center text-[14px] text-gray-400 mt-5">
        <Link href="/login" className="text-[#007AFF] font-medium">
          Terug naar inloggen
        </Link>
      </p>
    </>
  )
}
