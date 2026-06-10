// Layout voor de auth-pagina's (login/register/wachtwoord). Geen app-shell:
// een gecentreerde kaart op een grijze achtergrond (huisstijl agenda/notes).
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
