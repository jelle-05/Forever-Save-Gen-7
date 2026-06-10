import AppShell from '@/components/AppShell'

// Layout voor alle ingelogde app-routes: zet de gedeelde shell (sidebar +
// bottom bar) om de pagina-inhoud heen.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
