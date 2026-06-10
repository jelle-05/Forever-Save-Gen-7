// Geeft aan of Supabase geconfigureerd is. Zonder env-vars draait de app in
// een "stub"-modus: pagina's zijn te bekijken, maar auth/gating staan uit.
// Hierdoor blijft een credential-loze (Vercel-)deploy gewoon builden.
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
