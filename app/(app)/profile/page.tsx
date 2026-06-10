import { UserRound } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import { menuKleur } from '@/lib/kleuren'

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Profiel" />
      <EmptyState
        icon={UserRound}
        title="Profiel"
        description="Binnenkort: trainerkaart, passport stamps, auto-stats en instellingen (privacy, data-export)."
        color={menuKleur('/profile')}
      />
    </>
  )
}
