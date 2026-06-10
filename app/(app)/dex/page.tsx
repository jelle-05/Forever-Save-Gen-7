import { Sparkles } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { menuKleur } from '@/lib/kleuren'

export default function ShinyDexPage() {
  return (
    <EmptyState
      icon={Sparkles}
      title="Shiny Dex"
      description="Binnenkort: je shiny-overzicht (243 / 807 ✨) met filters, zoeken en koppeling naar de hunt counter."
      color={menuKleur('/dex')}
    />
  )
}
