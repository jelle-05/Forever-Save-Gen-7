import { Sparkles } from 'lucide-react'

// Merk-header boven de auth-formulieren: blauw pokéball/sparkle-tegeltje + titel.
export default function AuthHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#007AFF] mb-3">
        <Sparkles size={28} className="text-white" />
      </div>
      <h1 className="text-[22px] font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-[14px] text-gray-500 mt-1 leading-relaxed">{subtitle}</p>}
    </div>
  )
}
