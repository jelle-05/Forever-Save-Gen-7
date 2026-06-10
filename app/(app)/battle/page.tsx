import { Dumbbell } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { menuKleur } from '@/lib/kleuren'

export default function BattleReadyPage() {
  return (
    <EmptyState
      icon={Dumbbell}
      title="Battle Ready"
      description="Binnenkort: moveset-builder, EV/IV-training met hexagon, move tutors en ribbons."
      color={menuKleur('/battle')}
    />
  )
}
