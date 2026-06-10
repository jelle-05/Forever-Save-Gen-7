// Officiële Pokémon type-kleuren als hex (zelfde waarden als de tokens in
// globals.css). In JS nodig omdat Tailwind dynamische klassen als
// `bg-type-${type}` niet kan genereren — we gebruiken inline style + tint().
export const TYPE_KLEUREN: Record<string, string> = {
  normal: '#a8a77a',
  fire: '#ee8130',
  water: '#6390f0',
  electric: '#f7d02c',
  grass: '#7ac74c',
  ice: '#96d9d6',
  fighting: '#c22e28',
  poison: '#a33ea1',
  ground: '#e2bf65',
  flying: '#a98ff3',
  psychic: '#f95587',
  bug: '#a6b91a',
  rock: '#b6a136',
  ghost: '#735797',
  dragon: '#6f35fc',
  dark: '#705746',
  steel: '#b7b7ce',
  fairy: '#d685ad',
}

export const TYPE_NAMES = Object.keys(TYPE_KLEUREN)

export function typeKleur(type: string): string {
  return TYPE_KLEUREN[type] ?? '#8e8e93'
}
