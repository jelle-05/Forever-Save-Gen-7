'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import BottomBar from './BottomBar'
import MoreMenu from './MoreMenu'

// App-frame: desktop-Sidebar + scrollbare main + mobiele BottomBar.
// Beheert de open/dicht-state van het 'Meer'-sheet. Elke pagina levert zelf
// zijn (sticky, frosted) PageHeader binnen de main-scrollcontainer.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [meerOpen, setMeerOpen] = useState(false)

  return (
    <div className="flex h-full bg-white">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 h-full">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <BottomBar onMeer={() => setMeerOpen(true)} />
      </div>

      <MoreMenu open={meerOpen} onClose={() => setMeerOpen(false)} />
    </div>
  )
}
