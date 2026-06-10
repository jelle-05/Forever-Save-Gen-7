// Gedeelde types/constanten rond het gebruikersprofiel. Gebruikt door de
// onboarding, profiel-instellingen, app-gating en het publieke profiel.

export type GameVersion = 'US' | 'UM'

// De modules die per publiek profiel zichtbaar/verborgen kunnen worden.
export const MODULE_KEYS = ['dex', 'hunts', 'battle', 'items', 'activities', 'analytics', 'feed'] as const
export type ModuleKey = (typeof MODULE_KEYS)[number]

export const MODULE_LABELS: Record<ModuleKey, string> = {
  dex: 'Shiny & Living Dex',
  hunts: 'Active Hunts',
  battle: 'Battle Ready',
  items: 'Items',
  activities: 'Activiteiten',
  analytics: 'Analytics',
  feed: 'Feed',
}

export type ModuleVisibility = Record<ModuleKey, boolean>

// Standaard: alle modules zichtbaar zodra een profiel publiek wordt. Het profiel
// zelf staat privé (is_public=false), dus standaard is er niets zichtbaar.
export const DEFAULT_MODULE_VISIBILITY: ModuleVisibility = {
  dex: true,
  hunts: true,
  battle: true,
  items: true,
  activities: true,
  analytics: true,
  feed: true,
}

export interface Profile {
  id: string
  username: string
  is_public: boolean
  module_visibility: ModuleVisibility
  feed_enabled: boolean
  game_version: GameVersion
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Username-validatie (moet matchen met de CHECK-constraint in de migratie).
export const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/

export function valideerUsername(username: string): string | null {
  if (username.length < 3) return 'Minimaal 3 tekens.'
  if (username.length > 20) return 'Maximaal 20 tekens.'
  if (!USERNAME_REGEX.test(username)) return 'Alleen kleine letters, cijfers en _ toegestaan.'
  return null
}
