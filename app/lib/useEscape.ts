'use client'

import { useEffect } from 'react'

// Sluit een overlay (sheet/modal) wanneer op Escape wordt gedrukt en open=true.
export function useEscape(open: boolean, callback: () => void) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') callback()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, callback])
}
