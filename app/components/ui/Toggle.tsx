// iOS-stijl toggle-switch (huisstijl notes/agenda).
interface Props {
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  'aria-label'?: string
}

export default function Toggle({ checked, onChange, disabled, ...rest }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={rest['aria-label']}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative w-12 h-7 rounded-full transition-colors shrink-0',
        checked ? 'bg-[#34C759]' : 'bg-gray-300',
        disabled ? 'opacity-40 pointer-events-none' : '',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow transition-all',
          checked ? 'left-[26px]' : 'left-[3px]',
        ].join(' ')}
      />
    </button>
  )
}
