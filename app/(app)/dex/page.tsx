import { redirect } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import ShinyDex from '@/components/pokemon/ShinyDex'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { menuKleur } from '@/lib/kleuren'
import type { PokemonGridData } from '@/lib/pokeapi/types'

// Shiny Dex — leest uitsluitend uit de Supabase-cache (pokemon_cache) en de
// eigen shinies van de gebruiker. GEEN live PokeAPI-calls op deze pagina.
export default async function ShinyDexPage() {
  if (!isSupabaseConfigured()) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Shiny Dex"
        description="Koppel Supabase (env-vars) om de Shiny Dex te activeren."
        color={menuKleur('/dex')}
      />
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pokemons } = await supabase
    .from('pokemon_cache')
    .select('id, name, types, generation, sprite_default, sprite_shiny, shiny_locked')
    .order('id')

  if (!pokemons || pokemons.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Pokédex-cache is nog leeg"
        description="Vul de cache met `npm run seed` (zie README) — daarna verschijnen hier alle 807 Pokémon."
        color={menuKleur('/dex')}
      />
    )
  }

  const { data: shinies } = await supabase
    .from('shinies')
    .select('pokemon_id')
    .eq('user_id', user.id)
    .eq('status', 'completed')

  const caughtIds = [...new Set((shinies ?? []).map(s => s.pokemon_id as number))]

  return <ShinyDex pokemons={pokemons as PokemonGridData[]} caughtIds={caughtIds} />
}
