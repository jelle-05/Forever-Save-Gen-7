import { Shapes } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

export default function FormsDexPage() {
  return (
    <EmptyState
      icon={Shapes}
      title="Forms Dex"
      description="Binnenkort: optionele forms dex (Alolan-vormen, Unown, Vivillon, Oricorio, …)."
    />
  )
}
