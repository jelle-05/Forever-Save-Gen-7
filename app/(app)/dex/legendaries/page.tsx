import { Orbit } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

export default function LegendariesPage() {
  return (
    <EmptyState
      icon={Orbit}
      title="Legendaries & Ultra Beasts"
      description="Binnenkort: checklist met Ultra Warp Ride-info, version exclusives en shiny-koppeling."
    />
  )
}
