import { Backpack } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import EmptyState from '@/components/ui/EmptyState'

export default function ItemsPage() {
  return (
    <>
      <PageHeader title="Items" />
      <EmptyState
        icon={Backpack}
        title="Items"
        description="Binnenkort: Poké Balls, TMs, Berries, Z-Crystals, Mega Stones, Apparel en Totem Stickers."
      />
    </>
  )
}
