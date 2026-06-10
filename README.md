# Forever Save — Gen 7

A free platform to track your **Pokémon Ultra Sun / Ultra Moon** "forever save" to 100% completion: shiny dex with a live hunt counter, living dex, forms, legendaries & Ultra Beasts, battle-ready Pokémon, items, battle facilities, activities and a trainer profile. Privacy-first, multi-user, with optionally shareable public profiles.

> 🚧 **Status:** foundation + app shell. The navigation (desktop sidebar + mobile tab bar) and all route stubs are in place; features follow per phase. The full roadmap and execution plan live in **[`bouwplan.md`](./bouwplan.md)**.

## Stack

- **Next.js 16** (App Router, TypeScript) + **React 19**
- **Tailwind CSS v4** (`@tailwindcss/postcss`) — custom components, no UI library
- **lucide-react** for icons, **Geist** font
- **Supabase** (Postgres, EU region) — backend/auth/realtime *(not connected yet)*
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
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

> **Never** commit real keys. For the current milestone Supabase is not required; the app runs without these values.

## Structure

```
app/
  (app)/            # signed-in app routes, shared shell (sidebar + tab bar)
    dex/            # Shiny · Hunts · Living · Forms · Legendaries (segmented)
    battle/         # Ready · Tree · Agency · Royal (segmented)
    items/ activities/ analytics/ feed/ profile/
  components/        # Sidebar, BottomBar, MoreMenu, AppShell
    ui/             # PageHeader, SegmentedControl, Card, Button, Sheet, EmptyState
  lib/              # navigatie (menu config), useEscape
  globals.css       # design tokens (incl. Pokémon type colors), iOS theme
  layout.tsx        # root layout (Geist, PWA, light mode)
bouwplan.md         # execution plan (per phase) + full roadmap/specification
```

> Note: code identifiers and comments use Dutch (matching the sister apps); documentation and commit messages are in English.

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import it in Vercel — the framework is auto-detected as **Next.js**; the default build (`next build`) is sufficient.
3. Env vars are optional as long as Supabase is not connected.
