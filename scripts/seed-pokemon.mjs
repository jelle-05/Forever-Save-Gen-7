// Eenmalige seed van pokemon_cache (#1..#807) vanuit PokeAPI.
// Draaien:  npm run seed       (gebruikt .env.local via Node --env-file)
//
// Schrijft via de PostgREST REST-API (gewone fetch) i.p.v. supabase-js, zodat
// het op elke Node-versie werkt (supabase-js vereist een native WebSocket, die
// Node < 22 niet heeft). De service-role-key omzeilt RLS. Idempotent: upsert op id.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Ontbrekend: NEXT_PUBLIC_SUPABASE_URL en/of SUPABASE_SERVICE_ROLE_KEY (zet ze in .env.local).')
  process.exit(1)
}

console.log(`Seeden naar ${new URL(url).host} …`)

const restHeaders = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
}

// Houd in sync met app/lib/pokeapi/shinyLocked.ts.
const SHINY_LOCKED = new Set([718, 772, 773, 789, 790, 791, 792, 800, 801, 802, 803, 804, 807])

// Gen 7 national dex = #1..#807; generatie afleiden uit het dex-nummer.
const generatieVanId = id =>
  id <= 151 ? 1 : id <= 251 ? 2 : id <= 386 ? 3 : id <= 493 ? 4 : id <= 649 ? 5 : id <= 721 ? 6 : 7

async function haalOp(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  if (!res.ok) throw new Error(`PokeAPI #${id}: ${res.status}`)
  const d = await res.json()
  const usum = d.sprites?.versions?.['generation-vii']?.['ultra-sun-ultra-moon']
  return {
    id,
    name: d.name,
    types: d.types.map(t => t.type.name),
    generation: generatieVanId(id),
    sprite_default: usum?.front_default ?? d.sprites?.front_default ?? null,
    sprite_shiny: usum?.front_shiny ?? d.sprites?.front_shiny ?? null,
    base_stats: Object.fromEntries(d.stats.map(s => [s.stat.name, s.base_stat])),
    shiny_locked: SHINY_LOCKED.has(id),
  }
}

async function opslaan(batch) {
  // POST met "resolution=merge-duplicates" = upsert op de primary key (id).
  const res = await fetch(`${url}/rest/v1/pokemon_cache`, {
    method: 'POST',
    headers: { ...restHeaders, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(batch),
  })
  if (!res.ok) {
    const tekst = await res.text()
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `Geen schrijfrechten (${res.status}). Staat de geheime service_role-key in ` +
          `SUPABASE_SERVICE_ROLE_KEY (Supabase → Project Settings → API → service_role)? Detail: ${tekst}`,
      )
    }
    throw new Error(`REST ${res.status}: ${tekst}`)
  }
}

async function aantalRijen() {
  const res = await fetch(`${url}/rest/v1/pokemon_cache?select=id`, {
    method: 'HEAD',
    headers: { ...restHeaders, Prefer: 'count=exact' },
  })
  return res.headers.get('content-range')?.split('/')?.[1] ?? '?'
}

async function main() {
  let batch = []
  for (let id = 1; id <= 807; id++) {
    try {
      batch.push(await haalOp(id))
    } catch (e) {
      console.error(e.message)
      continue
    }
    if (batch.length >= 50) {
      await opslaan(batch)
      console.log(`Opgeslagen t/m #${id}`)
      batch = []
    }
  }
  if (batch.length) await opslaan(batch)

  console.log(`Seed voltooid. pokemon_cache bevat nu ${await aantalRijen()} rijen.`)
}

main().catch(e => {
  console.error('FOUT:', e.message)
  process.exit(1)
})
