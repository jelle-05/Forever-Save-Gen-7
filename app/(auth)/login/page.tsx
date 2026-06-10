'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import AuthHeader from '@/components/AuthHeader'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState('')

  const geconfigureerd = isSupabaseConfigured()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLaden(true)
    setFout('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord })
    if (error) {
      setFout('Onjuiste e-mail of wachtwoord.')
      setLaden(false)
      return
    }
    router.replace('/')
    router.refresh()
  }

  return (
    <>
      <AuthHeader title="Welkom terug" subtitle="Log in om je forever save te beheren." />

      {!geconfigureerd && (
        <p className="mb-4 text-[13px] text-gray-400 text-center">
          Supabase is nog niet gekoppeld — inloggen is voorlopig uitgeschakeld.
        </p>
      )}

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
          <div className="px-4 py-3.5">
            <input
              type="password"
              autoComplete="current-password"
              required
              placeholder="Wachtwoord"
              value={wachtwoord}
              onChange={e => setWachtwoord(e.target.value)}
              className="w-full text-[15px] outline-none placeholder:text-gray-400 bg-transparent"
            />
          </div>
        </div>

        {fout && <p className="text-red-500 text-sm text-center px-2">{fout}</p>}

        <Button type="submit" className="w-full" disabled={laden || !geconfigureerd || !email || !wachtwoord}>
          {laden ? 'Bezig…' : 'Inloggen'}
        </Button>
      </form>

      <div className="flex items-center justify-between mt-5 text-[14px]">
        <Link href="/forgot-password" className="text-gray-400 hover:text-gray-600 transition-colors">
          Wachtwoord vergeten?
        </Link>
        <Link href="/register" className="text-[#007AFF] font-medium">
          Account aanmaken
        </Link>
      </div>
    </>
  )
}
