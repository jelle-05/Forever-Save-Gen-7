'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, LogOut, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  MODULE_KEYS,
  MODULE_LABELS,
  type GameVersion,
  type ModuleVisibility,
  type Profile,
} from '@/lib/profiel'
import PageHeader from '@/components/ui/PageHeader'
import Toggle from '@/components/ui/Toggle'

const sectieLabel = 'block px-1 pb-1.5 text-[12px] font-semibold uppercase tracking-wide text-gray-400'
const groep = 'bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100'
const rij = 'flex items-center justify-between gap-3 px-4 py-3'

export default function ProfielInstellingen({ profiel }: { profiel: Profile }) {
  const router = useRouter()
  const [isPublic, setIsPublic] = useState(profiel.is_public)
  const [modules, setModules] = useState<ModuleVisibility>(profiel.module_visibility)
  const [feed, setFeed] = useState(profiel.feed_enabled)
  const [versie, setVersie] = useState<GameVersion>(profiel.game_version)
  const [status, setStatus] = useState<'idle' | 'bezig' | 'ok' | 'fout'>('idle')

  const supabase = createClient()

  async function bewaar(patch: Record<string, unknown>) {
    setStatus('bezig')
    const { error } = await supabase.from('profiles').update(patch).eq('id', profiel.id)
    setStatus(error ? 'fout' : 'ok')
  }

  function zetPublic(v: boolean) {
    setIsPublic(v)
    bewaar({ is_public: v })
  }
  function zetModule(key: (typeof MODULE_KEYS)[number], v: boolean) {
    const next = { ...modules, [key]: v }
    setModules(next)
    bewaar({ module_visibility: next })
  }
  function zetFeed(v: boolean) {
    setFeed(v)
    bewaar({ feed_enabled: v })
  }
  function zetVersie(v: GameVersion) {
    setVersie(v)
    bewaar({ game_version: v })
  }

  async function uitloggen() {
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  const statusTekst =
    status === 'bezig' ? 'Opslaan…' : status === 'ok' ? 'Opgeslagen' : status === 'fout' ? 'Mislukt' : ''

  return (
    <>
      <PageHeader
        title="Profiel"
        actions={statusTekst ? <span className="text-[13px] text-gray-400">{statusTekst}</span> : undefined}
      />

      <div className="px-4 sm:px-6 py-4 space-y-6 max-w-xl">
        {/* Account */}
        <section>
          <span className={sectieLabel}>Account</span>
          <div className={groep}>
            <div className={rij}>
              <span className="text-[15px] text-gray-700">Username</span>
              <span className="text-[15px] font-medium text-gray-900 truncate">/u/{profiel.username}</span>
            </div>
            <div className={rij}>
              <span className="text-[15px] text-gray-700">Spelversie</span>
              <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5">
                {(['US', 'UM'] as GameVersion[]).map(v => (
                  <button
                    key={v}
                    onClick={() => zetVersie(v)}
                    className={[
                      'px-3 py-1 rounded-md text-[13px] font-medium transition-colors',
                      versie === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
                    ].join(' ')}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Zichtbaarheid */}
        <section>
          <span className={sectieLabel}>Zichtbaarheid</span>
          <div className={groep}>
            <div className={rij}>
              <div className="min-w-0">
                <p className="text-[15px] text-gray-900">Profiel publiek</p>
                <p className="text-[13px] text-gray-400">Alles is privé totdat je dit aanzet.</p>
              </div>
              <Toggle checked={isPublic} onChange={zetPublic} aria-label="Profiel publiek" />
            </div>
            {isPublic && (
              <Link
                href={`/u/${profiel.username}`}
                className="flex items-center gap-2 px-4 py-3 text-[14px] font-medium text-[#007AFF] hover:bg-gray-50 transition-colors"
              >
                <ExternalLink size={16} />
                Bekijk je publieke profiel
              </Link>
            )}
          </div>
          <p className="px-1 pt-2 text-[12px] text-gray-400">
            Met een publiek profiel bepaal je hieronder per module wat zichtbaar is.
          </p>
        </section>

        {/* Modules */}
        <section>
          <span className={sectieLabel}>Zichtbare modules</span>
          <div className={groep}>
            {MODULE_KEYS.map(key => (
              <div key={key} className={rij}>
                <span className="text-[15px] text-gray-700">{MODULE_LABELS[key]}</span>
                <Toggle
                  checked={modules[key]}
                  onChange={v => zetModule(key, v)}
                  disabled={!isPublic}
                  aria-label={MODULE_LABELS[key]}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Feed */}
        <section>
          <span className={sectieLabel}>Sociaal</span>
          <div className={groep}>
            <div className={rij}>
              <div className="min-w-0">
                <p className="text-[15px] text-gray-900">Meedoen met de feed</p>
                <p className="text-[13px] text-gray-400">Alleen met een publiek profiel + feed aan.</p>
              </div>
              <Toggle checked={feed} onChange={zetFeed} disabled={!isPublic} aria-label="Meedoen met de feed" />
            </div>
          </div>
        </section>

        {/* Privacy + uitloggen */}
        <section className="space-y-2">
          <Link
            href="/privacy"
            className="flex items-center gap-2 px-1 text-[14px] font-medium text-[#007AFF]"
          >
            <ShieldCheck size={16} />
            Lees ons privacybeleid
          </Link>
          <button
            onClick={uitloggen}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-[15px] font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors active:scale-[0.98]"
          >
            <LogOut size={18} />
            Uitloggen
          </button>
        </section>
      </div>
    </>
  )
}
