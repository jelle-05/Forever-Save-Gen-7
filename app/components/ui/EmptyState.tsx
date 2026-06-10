import type { IconType } from '@/lib/navigatie'

interface Props {
  icon: IconType
  title: string
  description?: string
}

// Lege staat: gecentreerd icoon + grijze tekst. Huisstijl van notes/agenda.
export default function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <Icon size={40} className="text-gray-300 mb-3" />
      <p className="text-[15px] font-medium text-gray-500">{title}</p>
      {description && <p className="text-[13px] text-gray-400 mt-1 max-w-xs">{description}</p>}
    </div>
  )
}
