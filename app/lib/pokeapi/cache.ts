import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import type { PokemonCache } from './types'

// === PokeAPI cache layer ====================================================
// Principe: elke PokeAPI-resource wordt hoogstens één keer opgehaald — daarna
// staat 'ie in pokemon_cache voor iedereen. Grids/dexes lezen alleen uit de
// cache; ze doen NOOIT live PokeAPI-calls.
//
// Stroom: db-check → bij miss PokeAPI fetch → normaliseren → opslaan → teruggeven.
// De bulk-seed (1..807) wordt later via een script gedraaid; zie README.

const POKEAPI = 'https://pokeapi.co/api/v2'

// Gen 7 national dex = #1..#807; generatie afleiden uit het dex-nummer
// (scheelt een extra species-fetch).
function generatieVanId(id: number): number {
  if (id <= 151) return 1
  if (id <= 251) return 2
  if (id <= 386) return 3
  if (id <= 493) return 4
  if (id <= 649) return 5
  if (id <= 721) return 6
  return 7
}

// Lees een Pokémon uit de cache; bij een miss wordt 'ie opgehaald en opgeslagen.
export async function getPokemon(id: number): Promise<PokemonCache | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = await createClient()
  const { data } = await supabase.from('pokemon_cache').select('*').eq('id', id).maybeSingle()
  if (data) return data as PokemonCache

  return fetchAndCachePokemon(id)
}

// Haal één Pokémon op bij PokeAPI, normaliseer en sla op via de service role.
// Geeft null als de service role niet is geconfigureerd (cache-write overgeslagen).
export async function fetchAndCachePokemon(id: number): Promise<PokemonCache | null> {
  const service = createServiceClient()
  if (!service) return null

  const res = await fetch(`${POKEAPI}/pokemon/${id}`)
  if (!res.ok) return null
  const data = await res.json()

  const usum = data.sprites?.versions?.['generation-vii']?.['ultra-sun-ultra-moon']

  const genormaliseerd: PokemonCache = {
    id,
    name: data.name,
    types: (data.types ?? []).map((t: { type: { name: string } }) => t.type.name),
    generation: generatieVanId(id),
    sprite_default: usum?.front_default ?? data.sprites?.front_default ?? null,
    sprite_shiny: usum?.front_shiny ?? data.sprites?.front_shiny ?? null,
    base_stats: Object.fromEntries(
      (data.stats ?? []).map((s: { base_stat: number; stat: { name: string } }) => [s.stat.name, s.base_stat]),
    ),
    shiny_locked: false,
  }

  await service.from('pokemon_cache').upsert(genormaliseerd)
  return genormaliseerd
}
