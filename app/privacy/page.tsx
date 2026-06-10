import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy — Forever Save',
}

const blokken: { titel: string; tekst: string }[] = [
  {
    titel: 'Privé tenzij je publiceert',
    tekst:
      'Nieuwe accounts en al je gegevens zijn standaard privé. Je profiel publiek maken is een expliciete keuze die je zelf maakt in de instellingen.',
  },
  {
    titel: 'Wat we opslaan',
    tekst:
      'Een e-mailadres (alleen voor inloggen, nooit zichtbaar op je profiel) en een zelfgekozen username. Daarnaast de gegevens die je zelf invoert om je save bij te houden. Geen echte namen, geboortedata of telefoonnummers.',
  },
  {
    titel: 'E-mail is alleen voor auth',
    tekst: 'Je e-mailadres wordt uitsluitend gebruikt om in te loggen en je account te beveiligen. Het wordt nergens publiek getoond.',
  },
  {
    titel: 'Publieke profielen zijn opt-in',
    tekst:
      'Pas als jij je profiel publiek maakt, kan iemand anders het via /u/jouw-username bekijken. Met module-zichtbaarheid bepaal je zelf welke onderdelen zichtbaar zijn; de feed staat standaard uit.',
  },
  {
    titel: 'Beveiliging op databaseniveau',
    tekst:
      'Zichtbaarheid wordt afgedwongen door Row Level Security in de database — niet alleen door de interface. Privégegevens zijn voor anderen simpelweg niet opvraagbaar.',
  },
  {
    titel: 'Export en verwijderen',
    tekst:
      'Volledige data-export (JSON/CSV) en het in één keer verwijderen van je account met alle gegevens komen volgens de roadmap in een latere fase.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center gap-2 px-3 h-12 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <Link
          href="/"
          className="flex items-center gap-1 text-[14px] font-medium text-[#007AFF] p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} />
          Terug
        </Link>
      </header>

      <main className="px-4 sm:px-6 py-8 max-w-2xl mx-auto">
        <h1 className="text-[28px] font-bold text-gray-900">Privacy</h1>
        <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">
          Forever Save is privacy-first gebouwd. In gewone taal: jij bepaalt wat je deelt.
        </p>

        <div className="mt-6 space-y-5">
          {blokken.map(b => (
            <section key={b.titel}>
              <h2 className="text-[16px] font-semibold text-gray-900">{b.titel}</h2>
              <p className="text-[14px] text-gray-600 mt-1 leading-relaxed">{b.tekst}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
