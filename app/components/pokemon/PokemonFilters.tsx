'use client'

import { Search } from 'lucide-react'
import { TYPE_NAMES } from '@/lib/typeKleuren'

export type StatusFilter = 'all' | 'caught' | 'uncaught' | 'locked'
export type SortOrder = 'dex' | 'name' | 'caught'

interface Props {
  query: string
  onQuery: (v: string) => void
  gen: number | 'all'
  onGen: (v: number | 'all') => void
  type: string
  onType: (v: string) => void
  status: StatusFilter
  onStatus: (v: StatusFilter) => void
  sort: SortOrder
  onSort: (v: SortOrder) => void
}

const select = 'bg-gray-50 rounded-xl px-3 py-2 text-[14px] text-gray-700 outline-none capitalize'

// Zoeken (naam/nummer), filters (generatie, type, status) en sortering. Werkt
// direct (geen submit); de filtering zelf gebeurt client-side in ShinyDex.
export default function PokemonFilters({
  query,
  onQuery,
  gen,
  onGen,
  type,
  onType,
  status,
  onStatus,
  sort,
  onSort,
}: Props) {
  return (
    <div className="space-y-2">
      {/* Zoeken */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          type="search"
          inputMode="search"
          placeholder="Zoek op naam of nummer…"
          value={query}
          onChange={e => onQuery(e.target.value)}
          className="flex-1 min-w-0 text-[15px] outline-none bg-transparent placeholder:text-gray-400"
        />
      </div>

      {/* Filters + sortering */}
      <div className="flex flex-wrap gap-2">
        <select className={select} value={gen} onChange={e => onGen(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
          <option value="all">Alle generaties</option>
          {[1, 2, 3, 4, 5, 6, 7].map(g => (
            <option key={g} value={g}>
              Generatie {g}
            </option>
          ))}
        </select>

        <select className={select} value={type} onChange={e => onType(e.target.value)}>
          <option value="all">Alle types</option>
          {TYPE_NAMES.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select className={select} value={status} onChange={e => onStatus(e.target.value as StatusFilter)}>
          <option value="all">Alle</option>
          <option value="caught">Gevangen</option>
          <option value="uncaught">Nog niet gevangen</option>
          <option value="locked">Shiny-locked</option>
        </select>

        <select className={select} value={sort} onChange={e => onSort(e.target.value as SortOrder)}>
          <option value="dex">Op dexnummer</option>
          <option value="name">Op naam (A–Z)</option>
          <option value="caught">Gevangen eerst</option>
        </select>
      </div>
    </div>
  )
}
