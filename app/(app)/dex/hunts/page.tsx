import { Target } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { menuKleur } from '@/lib/kleuren'

export default function ActiveHuntsPage() {
  return (
    <EmptyState
      icon={Target}
      title="Active Hunts"
      description="Binnenkort: de live hunt counter met odds-meter, sessies en phase-logging."
      color={menuKleur('/dex/hunts')}
    />
  )
}
