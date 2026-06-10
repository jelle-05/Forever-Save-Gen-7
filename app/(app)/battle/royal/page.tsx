import { Crown } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

export default function BattleRoyalPage() {
  return (
    <EmptyState
      icon={Crown}
      title="Battle Royal"
      description="Binnenkort: rank-tracker Normal → Super → Hyper → Master, met datum per promotie."
    />
  )
}
