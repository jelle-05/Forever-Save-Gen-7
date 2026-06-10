import {
  Sparkles, Target, Boxes, Shapes, Orbit,
  Dumbbell, Trees, Drama, Crown,
  Backpack, Waves, BarChart3, Users, UserRound,
  Swords, MoreHorizontal,
} from 'lucide-react'

// Centrale bron van waarheid voor de navigatie. Wordt hergebruikt door de
// desktop-Sidebar, de mobiele BottomBar en het More-sheet.
export type IconType = React.ComponentType<{
  size?: number
  className?: string
  color?: string
  style?: React.CSSProperties
}>

export interface NavItem {
  label: string
  href: string
  icon: IconType
}

export interface NavGroep {
  titel: string
  items: NavItem[]
}

// Desktop-sidebar: gegroepeerde lijst (iOS Settings-stijl).
export const navGroepen: NavGroep[] = [
  {
    titel: 'Dex',
    items: [
      { label: 'Shiny Dex', href: '/dex', icon: Sparkles },
      { label: 'Active Hunts', href: '/dex/hunts', icon: Target },
      { label: 'Living Dex', href: '/dex/living', icon: Boxes },
      { label: 'Forms Dex', href: '/dex/forms', icon: Shapes },
      { label: 'Legendaries & UBs', href: '/dex/legendaries', icon: Orbit },
    ],
  },
  {
    titel: 'Battle',
    items: [
      { label: 'Battle Ready', href: '/battle', icon: Dumbbell },
      { label: 'Battle Tree', href: '/battle/tree', icon: Trees },
      { label: 'Battle Agency', href: '/battle/agency', icon: Drama },
      { label: 'Battle Royal', href: '/battle/royal', icon: Crown },
    ],
  },
  {
    titel: 'Verzamelen',
    items: [
      { label: 'Items', href: '/items', icon: Backpack },
      { label: 'Activiteiten', href: '/activities', icon: Waves },
    ],
  },
  {
    titel: 'Meer',
    items: [
      { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      { label: 'Feed', href: '/feed', icon: Users },
      { label: 'Profiel', href: '/profile', icon: UserRound },
    ],
  },
]

// Mobiele tab bar: 5 slots. 'Meer' opent een sheet i.p.v. te navigeren.
export interface TabItem {
  key: string
  label: string
  icon: IconType
  href?: string
  isMeer?: boolean
}

export const mobieleTabs: TabItem[] = [
  { key: 'dex', label: 'Dex', icon: Sparkles, href: '/dex' },
  { key: 'battle', label: 'Battle', icon: Swords, href: '/battle' },
  { key: 'items', label: 'Items', icon: Backpack, href: '/items' },
  { key: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { key: 'meer', label: 'Meer', icon: MoreHorizontal, isMeer: true },
]

// 'Meer'-sheet: Activities + Feed + Profile (de tabs die niet in de bar passen).
export const meerItems: NavItem[] = [
  { label: 'Activiteiten', href: '/activities', icon: Waves },
  { label: 'Feed', href: '/feed', icon: Users },
  { label: 'Profiel', href: '/profile', icon: UserRound },
]

// Active-state: exact de route of een sub-route ervan (/dex matcht ook /dex/hunts).
export function isActief(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + '/')
}

// De 'Meer'-tab is actief zodra een van zijn sheet-routes actief is.
export function isMeerActief(pathname: string): boolean {
  return meerItems.some(item => isActief(pathname, item.href))
}
