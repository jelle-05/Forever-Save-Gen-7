# CLAUDE.md

Guidelines for working on this project (Forever Save — Gen 7).

## Language norm

- **Documentation (all `.md` files) and git commit messages are in English.**
- **Code stays in Dutch** — identifiers, props, function names and comments follow the Dutch house style of the sister apps `agenda` / `notes`.

## Roadmap

The full roadmap, features and database spec live in **[`bouwplan.md`](./bouwplan.md)** (Part 2). The per-phase execution plan is in Part 1. Read it before making product decisions; work phase by phase and tick items off.

## Stack

- Next.js 16 (App Router, TypeScript), React 19
- Tailwind CSS v4 via `@tailwindcss/postcss` — **no** shadcn/ui, no UI library
- lucide-react (icons), Geist (font)
- Supabase (Postgres, EU region) for backend/auth/realtime
- Path alias: `@/*` → `./app/*`

## Supabase, auth & privacy

- Clients in `app/lib/supabase/`: `client.ts` (`createBrowserClient`, Client Components), `server.ts` (`createServerClient` + async `cookies()`, Server Components/Actions/Route Handlers — always `getUser()`, not `getSession()`), `service.ts` (service-role, server-only, cache/seed writes), `config.ts` (`isSupabaseConfigured()`).
- **Graceful degradation:** every place that constructs a server client / does auth gating must first check `isSupabaseConfigured()`. Without env vars the app still builds and the stub UI is browsable. Never let a missing env var break the build.
- **Session & gating:** `middleware.ts` refreshes the session and redirects unauthenticated users away from protected routes. The `(app)/layout.tsx` (async server component) does the profile check: no session → `/login`, session but no profile → `/onboarding`.
- **Schema & RLS** live in `supabase/migrations/*.sql` (apply via `supabase db push` or the SQL editor). RLS — not the UI — enforces privacy: profiles are private-by-default (`is_public`), readable by others only when public; `pokemon_cache` is read-only for users (service role seeds it). Add new user tables as `user_id`-scoped with matching policies.
- **PokeAPI cache** in `app/lib/pokeapi/`: read via `getPokemon` (fetch-on-miss). Dex/grid pages read only from `pokemon_cache`, never call PokeAPI live. Seed with `npm run seed` (`scripts/seed-pokemon.mjs`, service role). Scope is #1–#807 (no Meltan/Melmetal).
- **Reusable Pokémon grid** in `app/components/pokemon/` (`PokemonGrid`/`PokemonGridCard`/`PokemonFilters`): a server page fetches the cache + user rows and passes them to a client component that filters/sorts client-side. Reuse this for Living/Forms/Legendaries. Sprites use plain `<img loading="lazy">` + `[image-rendering:pixelated]` (not `next/image`, to avoid 807 optimization requests); type colors via `app/lib/typeKleuren.ts` + inline `style`.
- **Vercel gotcha:** `NEXT_PUBLIC_*` env vars are baked in at build time. After adding/changing them, trigger a fresh build (new commit or Redeploy without build cache) — a cached redeploy keeps auth disabled. Test on the **production domain**; immutable preview URLs are behind Deployment Protection (401) and only get *Preview*-scoped env vars.
- **Node gotcha:** `supabase-js` needs a native WebSocket (Node ≥ 22). The seed (`scripts/seed-pokemon.mjs`) therefore talks to the PostgREST REST API directly via `fetch` so it runs on any Node. For local `npm run dev`, prefer Node 22; Vercel already runs Node 22.

## Code conventions (house style of `agenda` + `notes`)

- **Dutch naming** for variables, props, functions and comments.
- Components in **PascalCase** (`Sidebar.tsx`), utilities in **camelCase** under `app/lib/`.
- **No `cn()` helper or class-variance-authority.** Compose classNames with
  `[...].join(' ')` or `[...].filter(Boolean).join(' ')` plus inline ternaries.
- Dynamic colors via inline `style`, not generated classNames.
- **Light mode only** (`color-scheme: light`); no dark mode.
- Mobile-first; breakpoint `sm` (640px). Desktop = Sidebar, mobile = BottomBar.

## Design tokens & styling

- Accent `#007AFF` (hover `#0066D6`) · green `#34C759` · red `#FF3B30`/`text-red-500` · text `#1c1c1e` · gray scale = Tailwind defaults.
- Pokémon type colors are defined as tokens in `globals.css` → use `bg-type-fire`, `text-type-water`, etc.
- Typography: explicit `text-[11px..28px]`; weights `font-medium` / `font-semibold`.
- Radii: `rounded-lg` buttons · `rounded-xl` inputs/sections · `rounded-2xl` cards/modals · `rounded-t-2xl` mobile sheets. Shadow only on modals (`shadow-xl`).
- Sheets/modals: `fixed inset-0 z-50 flex items-end sm:items-center`, backdrop `bg-black/30`, panel `rounded-t-2xl sm:rounded-2xl`, Escape closes (`useEscape`).

## Reusable building blocks

- Navigation: single source of truth in `app/lib/navigatie.ts` (sidebar, tab bar, more-sheet + `isActief`/`isMeerActief`).
- UI in `app/components/ui/`: `PageHeader` (frosted sticky title + footer slot), `SegmentedControl`, `Card`, `Button` (primary/secondary/ghost), `Sheet`, `EmptyState`.
- Each page provides its own `PageHeader`; the shell (`AppShell`) provides sidebar + tab bar.

## States to cover

hover · active (`active:scale-[0.97]`) · focus-visible (global outline) · disabled (`disabled:opacity-40`) · loading · empty (`EmptyState`) · error.

## Verification

```bash
npm run build && npm run lint
```

## Security

No secrets/API keys/tokens in code or documentation. Supabase values only in `.env.local` (gitignored); `.env.example` stays empty.
