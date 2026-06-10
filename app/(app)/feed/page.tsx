import { Users } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import { menuKleur } from '@/lib/kleuren'

export default function FeedPage() {
  return (
    <>
      <PageHeader title="Feed" />
      <EmptyState
        icon={Users}
        title="Feed"
        description="Binnenkort: opt-in activity feed en het volgen van publieke profielen."
        color={menuKleur('/feed')}
      />
    </>
  )
}
