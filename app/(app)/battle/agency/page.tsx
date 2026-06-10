import { Drama } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

export default function BattleAgencyPage() {
  return (
    <EmptyState
      icon={Drama}
      title="Battle Agency"
      description="Binnenkort: grade-tracker en notities voor memorabele rental-runs."
    />
  )
}
