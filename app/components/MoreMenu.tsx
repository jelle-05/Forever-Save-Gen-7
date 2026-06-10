'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, X } from 'lucide-react'
import { meerItems, isActief } from '@/lib/navigatie'
import { useEscape } from '@/lib/useEscape'

interface Props {
  open: boolean
  onClose: () => void
}

// Bottom-sheet achter de 'Meer'-tab (mobiel). Toont de routes die niet in de
// tab bar passen: Activiteiten · Feed · Profiel. Huisstijl-sheet (notes/agenda).
export default function MoreMenu({ open, onClose }: Props) {
  const pathname = usePathname()
  useEscape(open, onClose)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 sm:hidden">
      {/* Achtergrond */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Meer"
        className="relative w-full bg-white rounded-t-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header met grabber-gevoel + sluitknop */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-gray-100 shrink-0">
          <span className="text-[15px] font-semibold text-gray-900">Meer</span>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="p-1.5 -mr-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Gegroepeerde lijst */}
        <div className="overflow-y-auto flex-1 p-2 modal-safe-bottom">
          <div className="bg-gray-50 rounded-xl overflow-hidden divide-y divide-gray-200">
            {meerItems.map(({ label, href, icon: Icon }) => {
              const actief = isActief(pathname, href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Icon size={20} className={actief ? 'text-[#007AFF]' : 'text-gray-400'} />
                  <span className="flex-1 truncate">{label}</span>
                  <ChevronRight size={18} className="text-gray-300" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
