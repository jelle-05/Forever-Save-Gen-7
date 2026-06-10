'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import PokemonFilters, { type SortOrder, type StatusFilter } from './PokemonFilters'
import PokemonGrid, { type GridItem } from './PokemonGrid'
import { SHINY_LOCKED_IDS } from '@/lib/pokeapi/shinyLocked'
import type { PokemonGridData } from '@/lib/pokeapi/types'

const TOTAAL = 807 // national dex t/m gen 7 (#1..#807)

export default function ShinyDex({
  pokemons,
  caughtIds,
}: {
  pokemons: PokemonGridData[]
  caughtIds: number[]
}) {
  const caught = useMemo(() => new Set(caughtIds), [caughtIds])
  const [query, setQuery] = useState('')
  const [gen, setGen] = useState<number | 'all'>('all')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<SortOrder>('dex')

  const items: GridItem[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list: GridItem[] = pokemons.map(p => ({
      pokemon: p,
      caught: caught.has(p.id),
      locked: p.shiny_locked || SHINY_LOCKED_IDS.has(p.id),
    }))

    if (q) list = list.filter(it => it.pokemon.name.toLowerCase().includes(q) || String(it.pokemon.id).includes(q))
    if (gen !== 'all') list = list.filter(it => it.pokemon.generation === gen)
    if (type !== 'all') list = list.filter(it => it.pokemon.types.includes(type))
    if (status === 'caught') list = list.filter(it => it.caught)
    else if (status === 'uncaught') list = list.filter(it => !it.caught)
    else if (status === 'locked') list = list.filter(it => it.locked)

    if (sort === 'name') list = [...list].sort((a, b) => a.pokemon.name.localeCompare(b.pokemon.name))
    else if (sort === 'caught') list = [...list].sort((a, b) => Number(b.caught) - Number(a.caught) || a.pokemon.id - b.pokemon.id)
    else list = [...list].sort((a, b) => a.pokemon.id - b.pokemon.id)

    return list
  }, [pokemons, caught, query, gen, type, status, sort])

  const aantal = caught.size
  const pct = Math.round((aantal / TOTAAL) * 100)

  return (
    <div className="px-4 sm:px-6 py-4 space-y-4">
      {/* Voortgang */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[13px] text-gray-400">Shiny Dex</p>
            <p className="text-[22px] font-bold text-gray-900">
              {aantal} / {TOTAAL} <span className="text-[#FFCC00]">✨</span>
            </p>
          </div>
          <span className="text-[15px] font-semibold text-gray-500">{pct}%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full bg-[#FFCC00] transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <PokemonFilters
        query={query}
        onQuery={setQuery}
        gen={gen}
        onGen={setGen}
        type={type}
        onType={setType}
        status={status}
        onStatus={setStatus}
        sort={sort}
        onSort={setSort}
      />

      {items.length === 0 ? (
        <EmptyState icon={Search} title="Geen Pokémon gevonden" description="Pas je zoekopdracht of filters aan." />
      ) : (
        <PokemonGrid items={items} />
      )}
    </div>
  )
}
