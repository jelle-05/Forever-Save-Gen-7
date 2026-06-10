import { Boxes } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { menuKleur } from '@/lib/kleuren'

export default function LivingDexPage() {
  return (
    <EmptyState
      icon={Boxes}
      title="Living Dex"
      description="Binnenkort: living dex per generatie met realtime afvinken en box-weergave."
      color={menuKleur('/dex/living')}
    />
  )
}
