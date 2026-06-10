import PageHeader from '@/components/ui/PageHeader'
import SegmentedControl, { type Segment } from '@/components/ui/SegmentedControl'

const segments: Segment[] = [
  { label: 'Ready', href: '/battle' },
  { label: 'Tree', href: '/battle/tree' },
  { label: 'Agency', href: '/battle/agency' },
  { label: 'Royal', href: '/battle/royal' },
]

export default function BattleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader title="Battle" footer={<SegmentedControl segments={segments} />} />
      {children}
    </>
  )
}
