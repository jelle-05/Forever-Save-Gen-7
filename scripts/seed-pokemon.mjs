// Eenmalige seed van pokemon_cache (#1..#807) vanuit PokeAPI.
// Draaien:  npm run seed       (gebruikt .env.local via Node --env-file)
//
// Vereist NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (service role
// omzeilt RLS om in de gedeelde cache te schrijven). Idempotent: upsert op id.
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('Ontbrekend: NEXT_PUBLIC_SUPABASE_URL en/of SUPABASE_SERVICE_ROLE_KEY (zet ze in .env.local).')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

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
      const { error } = await supabase.from('pokemon_cache').upsert(batch)
      if (error) throw error
      console.log(`Opgeslagen t/m #${id}`)
      batch = []
    }
  }
  if (batch.length) {
    const { error } = await supabase.from('pokemon_cache').upsert(batch)
    if (error) throw error
  }
  console.log('Seed voltooid: 807 species.')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
