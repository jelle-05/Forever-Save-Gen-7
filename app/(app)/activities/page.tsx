import { Waves } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

export default function ActivitiesPage() {
  return (
    <>
      <PageHeader title="Activiteiten" />
      <EmptyState
        icon={Waves}
        title="Activiteiten"
        description="Binnenkort: daily checklist, Island Scan, Mantine Surf, Poké Pelago, quests, Poké Finder en meer."
      />
    </>
  )
}
