import Link from 'next/link'
import { Lock, Sparkles } from 'lucide-react'
import Card from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { MODULE_KEYS, MODULE_LABELS, type ModuleVisibility } from '@/lib/profiel'
import { menuKleur, tint } from '@/lib/kleuren'

// Module → bijbehorend route-pad voor de accentkleur.
const MODULE_KLEUR_PAD: Record<(typeof MODULE_KEYS)[number], string> = {
  dex: '/dex',
  hunts: '/dex/hunts',
  battle: '/battle',
  items: '/items',
  activities: '/activities',
  analytics: '/analytics',
  feed: '/feed',
}

function Schil({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 h-12 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#007AFF]" />
          <span className="text-[15px] font-semibold text-gray-900">Forever Save</span>
        </Link>
        <Link href="/login" className="text-[14px] font-medium text-[#007AFF]">
          Inloggen
        </Link>
      </header>
      <main className="px-4 sm:px-6 py-6 max-w-2xl mx-auto">{children}</main>
    </div>
  )
}

function PriveOfOnbekend() {
  return (
    <Schil>
      <div className="flex flex-col items-center justify-center text-center py-20 px-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
          <Lock size={28} className="text-gray-300" />
        </div>
        <p className="text-[15px] font-medium text-gray-500">Dit profiel bestaat niet of is privé</p>
        <p className="text-[13px] text-gray-400 mt-1 max-w-xs">
          Profielen zijn standaard privé. De eigenaar kan het publiek maken in de instellingen.
        </p>
      </div>
    </Schil>
  )
}

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  if (!isSupabaseConfigured()) return <PriveOfOnbekend />

  const supabase = await createClient()
  // RLS geeft de rij alleen terug als het profiel publiek is (of van de kijker zelf).
  const { data: profiel } = await supabase
    .from('profiles')
    .select('username, game_version, module_visibility, is_public')
    .ilike('username', username)
    .maybeSingle()

  if (!profiel || !profiel.is_public) return <PriveOfOnbekend />

  const zichtbaar = profiel.module_visibility as ModuleVisibility
  const modules = MODULE_KEYS.filter(key => zichtbaar[key])

  return (
    <Schil>
      {/* Trainerkaart */}
      <Card className="flex items-center gap-4 mb-6">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#007AFF] shrink-0">
          <Sparkles size={26} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-[20px] font-bold text-gray-900 truncate">/u/{profiel.username}</h1>
          <p className="text-[13px] text-gray-400">
            Pokémon {profiel.game_version === 'US' ? 'Ultra Sun' : 'Ultra Moon'}
          </p>
        </div>
      </Card>

      {modules.length === 0 ? (
        <p className="text-[14px] text-gray-400 text-center py-10">Deze trainer deelt nog geen modules.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {modules.map(key => {
            const kleur = menuKleur(MODULE_KLEUR_PAD[key])
            return (
              <Card key={key} className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                  style={{ backgroundColor: tint(kleur, 0.16) }}
                >
                  <Sparkles size={18} color={kleur} />
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-gray-900 truncate">{MODULE_LABELS[key]}</p>
                  <p className="text-[13px] text-gray-400">Nog geen data</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </Schil>
  )
}
