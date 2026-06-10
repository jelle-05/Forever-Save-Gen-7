import { Trees } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { menuKleur } from '@/lib/kleuren'

export default function BattleTreePage() {
  return (
    <EmptyState
      icon={Trees}
      title="Battle Tree"
      description="Binnenkort: team builder (Singles/Doubles) en streak-historie met records."
      color={menuKleur('/battle/tree')}
    />
  )
}
