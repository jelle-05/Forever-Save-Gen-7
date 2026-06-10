// Frosted-glass sticky pagina-header met grote iOS-titel. Plakt bovenaan de
// scrollende main. Optioneel een footer-slot (bv. een SegmentedControl) die
// mee-plakt, en een actions-slot rechts.
interface Props {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  footer?: React.ReactNode
}

export default function PageHeader({ title, subtitle, actions, footer }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="px-4 sm:px-6 pt-4 pb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[28px] leading-tight font-bold text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-[13px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0 flex items-center gap-2 pb-1">{actions}</div>}
      </div>
      {footer && <div className="px-4 sm:px-6 pb-3">{footer}</div>}
    </header>
  )
}
