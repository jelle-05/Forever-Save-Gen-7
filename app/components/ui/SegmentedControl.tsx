'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface Segment {
  label: string
  href: string
}

// iOS-segmented control als next/link-tabs. Gebruikt voor de sub-navigatie
// binnen Dex en Battle. Actief segment = exacte route-match.
export default function SegmentedControl({ segments }: { segments: Segment[] }) {
  const pathname = usePathname()

  return (
    <div className="flex gap-1 rounded-xl bg-gray-100 p-1 text-[13px] font-medium overflow-x-auto">
      {segments.map(({ label, href }) => {
        const actief = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex-1 whitespace-nowrap text-center rounded-lg px-3 py-1.5 transition-colors',
              actief ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {label}
          </Link>
        )
      })}
    </div>
  )
}
