'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { navGroepen } from '@/lib/navigatie'

const itemKlasse = (actief: boolean) =>
  [
    'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors',
    actief ? 'bg-blue-50 text-[#007AFF]' : 'text-gray-700 hover:bg-gray-100',
  ].join(' ')

// Desktop-sidebar (verborgen op mobiel; daar neemt BottomBar de navigatie over).
// Gegroepeerde lijst in iOS Settings-stijl, met een sectiekopje per groep.
export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden sm:flex flex-col w-60 shrink-0 border-r border-gray-200 bg-white">
      {/* App-naam */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-gray-200">
        <Sparkles size={18} className="text-[#007AFF]" />
        <span className="text-[15px] font-semibold text-gray-900">Forever Save</span>
      </div>

      {/* Navigatie */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {navGroepen.map(groep => (
          <div key={groep.titel} className="space-y-0.5">
            <span className="block px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              {groep.titel}
            </span>
            {groep.items.map(({ label, href, icon: Icon }) => {
              // Exacte match: elke sub-route is een eigen item, dus géén prefix.
              const actief = pathname === href
              return (
                <Link key={href} href={href} className={itemKlasse(actief)}>
                  <Icon size={18} className={actief ? 'text-[#007AFF]' : 'text-gray-400'} />
                  <span className="truncate">{label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
