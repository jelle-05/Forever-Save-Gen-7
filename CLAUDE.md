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
