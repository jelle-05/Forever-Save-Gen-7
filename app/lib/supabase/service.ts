import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service-role client — omzeilt RLS. UITSLUITEND server-side gebruiken (seed /
// cache-writes naar pokemon_cache). Wordt alleen aangemaakt als de geheime
// SUPABASE_SERVICE_ROLE_KEY is gezet; anders null (cache-write wordt overgeslagen).
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null

  return createSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
