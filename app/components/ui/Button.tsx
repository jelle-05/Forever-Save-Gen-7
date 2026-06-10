type Variant = 'primary' | 'secondary' | 'ghost'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const varianten: Record<Variant, string> = {
  primary: 'bg-[#007AFF] text-white hover:bg-[#0066D6]',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost: 'text-[#007AFF] hover:bg-gray-100',
}

// Knop in huisstijl: rounded-xl, scale-on-press, disabled-state.
export default function Button({ variant = 'primary', className, children, ...rest }: Props) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[15px] font-medium transition-colors active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none',
        varianten[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
