# Forever Save — Gen 7

A free platform to track your **Pokémon Ultra Sun / Ultra Moon** "forever save" to 100% completion: shiny dex with a live hunt counter, living dex, forms, legendaries & Ultra Beasts, battle-ready Pokémon, items, battle facilities, activities and a trainer profile. Privacy-first, multi-user, with optionally shareable public profiles.

> 🚧 **Status:** foundation + app shell + accounts. Navigation (desktop sidebar + mobile tab bar), all route stubs, and the Phase 0/1 backend (Supabase auth, profiles with RLS, onboarding, privacy settings, public profiles, PokeAPI cache layer) are in place; the actual tracker features follow per phase. The full roadmap and execution plan live in **[`bouwplan.md`](./bouwplan.md)**.

## Stack

- **Next.js 16** (App Router, TypeScript) + **React 19**
- **Tailwind CSS v4** (`@tailwindcss/postcss`) — custom components, no UI library
- **lucide-react** for icons, **Geist** font
- **Supabase** (`@supabase/ssr`, Postgres, EU region) — auth, profiles, RLS, PokeAPI cache
- Hosting: **Vercel**

The styling and code conventions follow the sister apps `agenda` and `notes` (see [`CLAUDE.md`](./CLAUDE.md)).

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000  → redirects to /dex
```

Other scripts:

```bash
npm run build    # production build
npm run start    # production server (after build)
npm run lint     # eslint
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in your own Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL=...        # public, browser-safe (protected by RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # public, browser-safe
SUPABASE_SERVICE_ROLE_KEY=...       # server-only / SECRET — never NEXT_PUBLIC, never commit
```

> **Never** commit real keys. The app **degrades gracefully**: without these values it still builds and the stub UI is browsable, with auth/gating disabled — so a credential-less Vercel deploy stays green. The service-role key is only needed to seed the PokeAPI cache.

## Database & auth (Supabase)

1. Create a Supabase project (EU region). Put the URL + anon key (and, for seeding, the service-role key) in `.env.local` and in your Vercel project env.
2. **Apply the schema** in `supabase/migrations/`:
   - Supabase CLI: `supabase db push`, **or**
   - paste `supabase/migrations/0001_init.sql` into the Supabase SQL editor and run it.
   - This creates `profiles` (private-by-default, module-level visibility) and `pokemon_cache`, with **RLS** enforcing privacy (own profile full access; public profiles readable by anyone; cache read-only for users, written only via the service role).
3. **Auth flow:** register (email/password, email confirmation) → `/auth/callback` exchanges the code → **onboarding** (unique `username` + game version `US`/`UM`) → the app. The `(app)` routes are gated server-side: no session → `/login`; session but no profile → `/onboarding`. Privacy/visibility is managed on the **Profile** page; the public, read-only profile lives at `/u/[username]`.
4. **PokeAPI cache (Phase 0):** `app/lib/pokeapi/cache.ts` does fetch-on-miss (db check → PokeAPI → normalize → store via the service role). The bulk seed of all 807 species is **not run yet**; later, a small script (`scripts/seed-pokemon.ts`) can loop `1..807` calling `fetchAndCachePokemon`. Grid/dex pages will only ever read from the cache, never call PokeAPI live.

## Structure

```
middleware.ts       # Supabase session refresh + route protection (graceful when unconfigured)
supabase/migrations/ # SQL schema + RLS (apply via CLI or SQL editor)
app/
  (app)/            # signed-in app routes (gated), shared shell (sidebar + tab bar)
    dex/            # Shiny · Hunts · Living · Forms · Legendaries (segmented)
    battle/         # Ready · Tree · Agency · Royal (segmented)
    items/ activities/ analytics/ feed/ profile/
  (auth)/           # login · register · forgot-password · reset-password
  auth/callback/    # email-link code exchange (route handler)
  onboarding/       # finish profile (username + US/UM)
  u/[username]/     # public, read-only profile (respects module visibility)
  privacy/          # plain-language privacy page
  components/        # Sidebar, BottomBar, MoreMenu, AppShell, AuthHeader, OnboardingForm, ProfielInstellingen
    ui/             # PageHeader, SegmentedControl, Card, Button, Sheet, EmptyState, Toggle
  lib/              # navigatie, kleuren, useEscape, profiel; supabase/ (client/server/service/middleware/config); pokeapi/ (cache layer)
  globals.css       # design tokens (incl. Pokémon type colors), iOS theme
  layout.tsx        # root layout (Geist, PWA, light mode)
bouwplan.md         # execution plan (per phase) + full roadmap/specification
```

> Note: code identifiers and comments use Dutch (matching the sister apps); documentation and commit messages are in English.

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it in Vercel — the framework is auto-detected as **Next.js**; the default build (`next build`) is sufficient.
3. Env vars are optional as long as Supabase is not connected.
