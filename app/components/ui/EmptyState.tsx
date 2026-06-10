import type { IconType } from '@/lib/navigatie'
import { tint } from '@/lib/kleuren'

interface Props {
  icon: IconType
  title: string
  description?: string
  /** Accentkleur (hex) — kleurt het icoon-tegeltje. Zonder kleur: neutraal grijs. */
  color?: string
}

// Lege staat: gecentreerd icoon in een afgerond tegeltje + grijze tekst.
export default function EmptyState({ icon: Icon, title, description, color }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
        style={{ backgroundColor: color ? tint(color, 0.14) : '#f3f4f6' }}
      >
        <Icon size={30} color={color ?? '#d1d5db'} />
      </div>
      <p className="text-[15px] font-medium text-gray-500">{title}</p>
      {description && <p className="text-[13px] text-gray-400 mt-1 max-w-xs">{description}</p>}
    </div>
  )
}
