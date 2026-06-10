import PageHeader from '@/components/ui/PageHeader'
import SegmentedControl, { type Segment } from '@/components/ui/SegmentedControl'

const segments: Segment[] = [
  { label: 'Shiny', href: '/dex' },
  { label: 'Hunts', href: '/dex/hunts' },
  { label: 'Living', href: '/dex/living' },
  { label: 'Forms', href: '/dex/forms' },
  { label: 'Legends', href: '/dex/legendaries' },
]

export default function DexLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader title="Dex" footer={<SegmentedControl segments={segments} />} />
      {children}
    </>
  )
}
