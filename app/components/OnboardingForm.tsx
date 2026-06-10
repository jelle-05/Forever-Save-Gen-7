'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { valideerUsername, type GameVersion } from '@/lib/profiel'
import AuthHeader from '@/components/AuthHeader'
import Button from '@/components/ui/Button'

// Profiel afronden na registratie: unieke username + spelversie (US/UM).
export default function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [versie, setVersie] = useState<GameVersion | null>(null)
  const [laden, setLaden] = useState(false)
  const [fout, setFout] = useState('')

  const formatFout = username.length > 0 ? valideerUsername(username) : null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const v = valideerUsername(username)
    if (v) {
      setFout(v)
      return
    }
    if (!versie) {
      setFout('Kies je spelversie.')
      return
    }
    setLaden(true)
    setFout('')

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .insert({ id: userId, username, game_version: versie })

    if (error) {
      // 23505 = unique violation → username al bezet.
      setFout(error.code === '23505' ? 'Deze username is al bezet.' : error.message)
      setLaden(false)
      return
    }
    router.replace('/dex')
    router.refresh()
  }

  return (
    <>
      <AuthHeader title="Maak je profiel af" subtitle="Kies een username en je spelversie. Je profiel is privé." />

      <form onSubmit={submit} className="space-y-3">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 divide-y divide-gray-100 shadow-sm">
          <div className="flex items-center px-4 py-3.5">
            <span className="text-[15px] text-gray-400 select-none">/u/</span>
            <input
              type="text"
              required
              autoCapitalize="none"
              autoComplete="off"
              placeholder="username"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase())}
              className="flex-1 min-w-0 text-[15px] outline-none placeholder:text-gray-400 bg-transparent"
            />
          </div>
        </div>
        {formatFout && <p className="text-[12px] text-gray-400 px-2">{formatFout}</p>}

        {/* Spelversie */}
        <div className="grid grid-cols-2 gap-2">
          {(['US', 'UM'] as GameVersion[]).map(v => {
            const actief = versie === v
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVersie(v)}
                className={[
                  'rounded-xl border py-3 text-[15px] font-medium transition-colors active:scale-[0.98]',
                  actief
                    ? 'border-[#007AFF] bg-blue-50 text-[#007AFF]'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                {v === 'US' ? 'Ultra Sun' : 'Ultra Moon'}
              </button>
            )
          })}
        </div>

        {fout && <p className="text-red-500 text-sm text-center px-2">{fout}</p>}

        <Button type="submit" className="w-full" disabled={laden || !username || !versie}>
          {laden ? 'Bezig…' : 'Aan de slag'}
        </Button>
      </form>
    </>
  )
}
