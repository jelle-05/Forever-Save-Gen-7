import { BarChart3 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'
import { menuKleur } from '@/lib/kleuren'

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" />
      <EmptyState
        icon={BarChart3}
        title="Analytics"
        description="Binnenkort: grafieken, overall completion-meter en fun stats (langste hunt, geluk, streaks)."
        color={menuKleur('/analytics')}
      />
    </>
  )
}
