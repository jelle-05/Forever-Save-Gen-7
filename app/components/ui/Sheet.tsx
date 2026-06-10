'use client'

import { X } from 'lucide-react'
import { useEscape } from '@/lib/useEscape'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

// Generieke modal/bottom-sheet in huisstijl: bottom-sheet op mobiel, gecentreerde
// dialog op desktop. Backdrop-klik en Escape sluiten. Voor inhoudelijke modals
// (showcase, formulieren); de MoreMenu-navigatie heeft zijn eigen variant.
export default function Sheet({ open, onClose, title, children, footer }: Props) {
  useEscape(open, onClose)
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full sm:w-[480px] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {title && (
          <div className="flex items-center justify-between px-4 h-12 border-b border-gray-100 shrink-0">
            <span className="text-[15px] font-semibold text-gray-900 truncate">{title}</span>
            <button
              onClick={onClose}
              aria-label="Sluiten"
              className="p-1.5 -mr-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-4 modal-safe-bottom">{children}</div>

        {footer && <div className="px-4 py-3 border-t border-gray-100 shrink-0">{footer}</div>}
      </div>
    </div>
  )
}
