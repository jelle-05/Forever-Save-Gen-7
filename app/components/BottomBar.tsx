'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mobieleTabs, isActief, isMeerActief } from '@/lib/navigatie'

interface Props {
  onMeer: () => void
}

// Mobiele navigatiebalk (verborgen op desktop; daar neemt de Sidebar het over).
// 5 slots: Dex · Battle · Items · Analytics · Meer. 'Meer' opent een sheet.
export default function BottomBar({ onMeer }: Props) {
  const pathname = usePathname()

  const knopKlasse = (actief: boolean) =>
    [
      'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors',
      actief ? 'text-[#007AFF]' : 'text-gray-400',
    ].join(' ')

  return (
    <nav className="sm:hidden flex items-stretch border-t border-gray-200 bg-white shrink-0 safe-area-bottom">
      {mobieleTabs.map(({ key, label, icon: Icon, href, isMeer }) => {
        const actief = isMeer ? isMeerActief(pathname) : isActief(pathname, href!)
        const inhoud = (
          <>
            <Icon size={22} className={actief ? 'text-[#007AFF]' : 'text-gray-400'} />
            {label}
          </>
        )
        return isMeer ? (
          <button key={key} onClick={onMeer} className={knopKlasse(actief)}>
            {inhoud}
          </button>
        ) : (
          <Link key={key} href={href!} className={knopKlasse(actief)}>
            {inhoud}
          </Link>
        )
      })}
    </nav>
  )
}
