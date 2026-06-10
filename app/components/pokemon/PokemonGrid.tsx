import PokemonGridCard from './PokemonGridCard'
import type { PokemonGridData } from '@/lib/pokeapi/types'

export interface GridItem {
  pokemon: PokemonGridData
  caught: boolean
  locked: boolean
}

// Responsive Pokémon-grid. Presentational: krijgt de (al gefilterde/gesorteerde)
// items en rendert per item een kaart. Herbruikbaar voor alle dexes.
export default function PokemonGrid({ items }: { items: GridItem[] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
      {items.map(it => (
        <PokemonGridCard key={it.pokemon.id} pokemon={it.pokemon} caught={it.caught} locked={it.locked} />
      ))}
    </div>
  )
}
