// Genormaliseerde vorm van een Pokémon zoals opgeslagen in pokemon_cache.
// Eén bron van waarheid voor de cache-laag en (later) de grids/dexes.
export interface PokemonCache {
  id: number // national dex nr (1..807)
  name: string
  types: string[]
  generation: number | null
  sprite_default: string | null
  sprite_shiny: string | null
  base_stats: Record<string, number> | null
  shiny_locked: boolean
}

// Lichtere vorm voor de grids (zonder base_stats) — wat de gridpagina's laden.
export type PokemonGridData = Pick<
  PokemonCache,
  'id' | 'name' | 'types' | 'generation' | 'sprite_default' | 'sprite_shiny' | 'shiny_locked'
>
