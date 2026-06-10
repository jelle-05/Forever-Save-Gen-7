// Unieke accentkleur per menu-item (iOS-systeemkleuren). Gebruikt voor de
// gekleurde icoon-tegeltjes in de sidebar, het More-sheet en de lege staten.
// Gekoppeld aan het route-pad zodat er één bron van waarheid is.
export const menuKleuren: Record<string, string> = {
  '/dex': '#FFCC00', // Shiny — geel/goud
  '/dex/hunts': '#FF3B30', // Active Hunts — rood
  '/dex/living': '#34C759', // Living — groen
  '/dex/forms': '#AF52DE', // Forms — paars
  '/dex/legendaries': '#5856D6', // Legendaries — indigo
  '/battle': '#FF9500', // Battle Ready — oranje
  '/battle/tree': '#00C7BE', // Battle Tree — mint
  '/battle/agency': '#FF2D55', // Battle Agency — roze
  '/battle/royal': '#5AC8FA', // Battle Royal — lichtblauw
  '/items': '#A2845E', // Items — bruin
  '/activities': '#32ADE6', // Activiteiten — cyaan
  '/analytics': '#007AFF', // Analytics — blauw
  '/feed': '#BF5AF2', // Feed — lichtpaars
  '/profile': '#8E8E93', // Profiel — grijs
}

// Fallback-grijs als een pad (nog) geen kleur heeft.
export const standaardKleur = '#8E8E93'

export function menuKleur(href: string): string {
  return menuKleuren[href] ?? standaardKleur
}

// Maak een lichte pastel-tint van een hex-kleur (rgba). Zelfde aanpak als de
// labelAchtergrond-helper in de zustersapps.
export function tint(hex: string, alpha = 0.15): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
