// Standaard iOS-card: afgeronde hoeken, dunne rand, witte achtergrond.
interface Props {
  className?: string
  children: React.ReactNode
}

export default function Card({ className, children }: Props) {
  return (
    <div className={['rounded-2xl border border-gray-200 bg-white p-4', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
