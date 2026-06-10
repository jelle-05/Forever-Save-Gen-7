import { Lock, Sparkles } from 'lucide-react'
import { tint } from '@/lib/kleuren'
import { typeKleur } from '@/lib/typeKleuren'
import type { PokemonGridData } from '@/lib/pokeapi/types'

interface Props {
  pokemon: PokemonGridData
  caught: boolean
  locked: boolean
}

// Eén kaartje in de Pokémon-grid. Herbruikbaar voor Shiny/Living/Forms/Legendaries.
// Niet klikbaar in Phase 2 — de detail/showcase-flow komt in Phase 3.
export default function PokemonGridCard({ pokemon, caught, locked }: Props) {
  const sprite = pokemon.sprite_shiny ?? pokemon.sprite_default
  const nr = '#' + String(pokemon.id).padStart(3, '0')

  return (
    <div
      className={[
        'relative rounded-2xl border p-2 flex flex-col items-center text-center',
        caught ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50',
      ].join(' ')}
      title={locked ? 'Shiny-locked: deze Pokémon kan niet shiny zijn in Ultra Sun/Moon.' : undefined}
    >
      {caught && <Sparkles size={14} className="absolute top-1.5 right-1.5 text-[#FFCC00]" />}
      {locked && (
        <span
          className="absolute top-1.5 left-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-gray-900/70"
          aria-label="Shiny-locked"
        >
          <Lock size={11} className="text-white" />
        </span>
      )}

      {sprite ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sprite}
          alt={pokemon.name}
          width={72}
          height={72}
          loading="lazy"
          decoding="async"
          className={['w-[72px] h-[72px] [image-rendering:pixelated]', caught ? '' : 'grayscale opacity-40'].join(' ')}
        />
      ) : (
        <div className="w-[72px] h-[72px]" />
      )}

      <span className="text-[11px] text-gray-400 mt-1">{nr}</span>
      <span className="text-[13px] font-medium text-gray-900 capitalize truncate w-full">{pokemon.name}</span>

      <div className="flex flex-wrap justify-center gap-1 mt-1">
        {pokemon.types.map(t => {
          const kleur = typeKleur(t)
          return (
            <span
              key={t}
              className="rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
              style={{ backgroundColor: tint(kleur, 0.16), color: kleur }}
            >
              {t}
            </span>
          )
        })}
      </div>
    </div>
  )
}
