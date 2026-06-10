# Build Plan — Forever Save Gen 7

> **One document for the build.** Part 1 is the **execution plan** (current bootstrap milestone, ticked off per phase). Part 2 is the **full roadmap & specification** (the 14 phases, features, privacy, database) — the source of truth for all product decisions.
>
> Language norm: documentation and commit messages are in English; code stays in Dutch (house style of `agenda`/`notes`).

---
---

# PART 1 — Execution (bootstrap milestone)

We work through this **phase by phase** in the house style of the sister apps `D:\jelle\agenda` and `D:\jelle\notes`.

## Context

`Forever-Save-Gen-7` is a Pokémon Ultra Sun "Forever Save" tracker (Next.js). The project started empty. This milestone is the **greenfield bootstrap**: scaffold + design system + app shell.

### Confirmed choices
- **Milestone scope:** Foundation + app shell. No backend/real data yet — but empty route stubs for every menu item.
- **Stack:** House style of agenda/notes — plain **Tailwind v4 + lucide-react + custom components** with `[...].join(' ')`. **No** shadcn/ui, TanStack Query, Zod, React Hook Form or Recharts.
- **Dark mode:** Light only (`color-scheme: light`).
- **Versions:** Next.js `16.2.7`, React `19.2.4`, Tailwind v4, npm.

> **Deliberate deviation from the spec below:** Part 2 mentions shadcn/TanStack/Zod/RHF/Recharts + dark mode. The house style does not use those → house style wins. Individual libraries can still be considered later per feature (e.g. a chart library for Analytics).

## House-style cheat sheet (agenda + notes)

- **Stack:** Next 16.2.7 · React 19.2.4 · TS 5 · Tailwind v4 (`@tailwindcss/postcss`) · lucide-react `^1.17.0` · Supabase · Geist font. Path alias `@/* → ./app/*`.
- **Colors:** white bg · text `#1c1c1e` · accent `#007AFF` (hover `#0066D6`) · green `#34C759` · red `#FF3B30`/`text-red-500` · Tailwind-default gray scale.
- **Typography:** explicit `text-[11px..17px]`; weights `font-medium`/`font-semibold`.
- **Radii:** `rounded-lg` buttons · `rounded-xl` inputs/sections · `rounded-2xl` cards/modals · `rounded-t-2xl` mobile sheets. Shadow only on modals (`shadow-xl`).
- **App shell:** desktop `Sidebar` (`hidden sm:flex flex-col w-60 shrink-0 border-r border-gray-200`) · mobile `BottomBar` (`sm:hidden ... safe-area-bottom`). Breakpoint `sm` (640px). Header `h-12 border-b`.
- **Nav item:** `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors` → active `bg-blue-50 text-[#007AFF]`, else `text-gray-700 hover:bg-gray-100`. Icon `size={18}` (tab bar `size={22}`).
- **Modals/sheets:** `fixed inset-0 z-50 flex items-end sm:items-center` · backdrop `bg-black/30` · panel `w-full sm:w-[480px] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh]` · Escape closes.
- **Inputs:** transparent inside `bg-gray-50 rounded-xl px-4 py-3`, `placeholder:text-gray-300 outline-none`.
- **Conventions:** Dutch naming · PascalCase components · camelCase utils in `app/lib/` · **no `cn()`** (`[...].join(' ')` / inline ternary) · dynamic colors via inline `style` · PWA via `manifest.ts` + icons · empty states = centered icon + gray text · no loading spinners (offline-first).

## Menu structure (see Part 2)

- **Desktop:** grouped sidebar (iOS Settings style).
- **Mobile:** tab bar with 5 slots — **Dex · Battle · Items · Analytics · More** (More = Activities + Feed + Profile as a sheet).
- **Segmented controls** inside Dex and Battle.

| Group | Sub-routes |
|---|---|
| **Dex** | Shiny · Active Hunts · Living · Forms · Legendaries |
| **Battle** | Battle Ready · Battle Tree · Battle Agency · Battle Royal |
| **Items** | (sub-tabs later) |
| **Activities** | (sub-tabs later) |
| **Analytics** | — |
| **Feed** | — |
| **Profile** | — |

## Execution per phase (tick off while building)

### Phase A — Scaffold & config ✅
- [x] `package.json` (deps/versions identical to `notes`; scripts `dev/build/start/lint`)
- [x] `postcss.config.mjs`, `next.config.ts`, `tsconfig.json` (alias `@/* → ./app/*`), `eslint.config.mjs`
- [x] `.gitignore` (node_modules, .next, .env*)
- [x] `.env.example` (empty `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — **no secrets**)
- [x] `npm install` runs clean

### Phase B — App foundation ✅
- [x] `app/globals.css` (notes copy + Pokémon type colors in `@theme`)
- [x] `app/layout.tsx` (Geist, `colorScheme: light`, metadata/viewport/PWA, title "Forever Save")
- [x] `app/manifest.ts` (PWA, `#ffffff`)
- [x] `public/icon.svg` (placeholder icon)
- [x] `app/page.tsx` (redirect → `/dex`)

### Phase C — Navigation & shell ✅
- [x] `app/lib/navigatie.ts` (central menu config: groups, items, icon, href)
- [x] `app/components/Sidebar.tsx` (desktop, grouped, exact active via `usePathname()`)
- [x] `app/components/BottomBar.tsx` (mobile, 5 tabs, prefix active)
- [x] `app/components/MoreMenu.tsx` (More sheet: Activities + Feed + Profile)
- [x] `app/components/AppShell.tsx` (client shell, manages More-sheet state)
- [x] `app/(app)/layout.tsx` (shell wrapper; each page provides its own PageHeader)
- [x] `app/lib/useEscape.ts` (pulled forward from Phase D — MoreMenu uses it)

### Phase D — Reusable UI components (`app/components/ui/`) ✅
- [x] `PageHeader.tsx` (large title + frosted-glass sticky header + footer slot)
- [x] `SegmentedControl.tsx` (iOS segmented control as `next/link` tabs)
- [x] `Card.tsx` (`rounded-2xl border border-gray-200 bg-white p-4`)
- [x] `Button.tsx` (primary/secondary/ghost · `rounded-xl` · `active:scale-[0.97]` · `disabled:opacity-40`)
- [x] `Sheet.tsx` (modal/bottom-sheet wrapper + Escape close)
- [x] `EmptyState.tsx` (centered icon + gray text)
- [x] `app/lib/useEscape.ts` (hook — already built in Phase C)
- [~] `app/lib/typeKleuren.ts` — **skipped**: colors live as tokens in `globals.css` (`bg-type-*`). Only add a JS lib when we need the hex values in code (e.g. inline `style`).

### Phase E — Route stubs (all menu items) ✅
Each with `PageHeader` + `EmptyState` ("Binnenkort"):
- [x] `app/(app)/dex/page.tsx` (Shiny) + `dex/hunts`, `dex/living`, `dex/forms`, `dex/legendaries` — via `dex/layout.tsx` with SegmentedControl
- [x] `app/(app)/battle/page.tsx` (Ready) + `battle/tree`, `battle/agency`, `battle/royal` — via `battle/layout.tsx` with SegmentedControl
- [x] `app/(app)/items/page.tsx`
- [x] `app/(app)/activities/page.tsx`
- [x] `app/(app)/analytics/page.tsx`
- [x] `app/(app)/feed/page.tsx`
- [x] `app/(app)/profile/page.tsx`

### Phase F — Documentation ✅
- [x] `README.md` (description, stack, run instructions, link to this build plan — no secrets)
- [x] `CLAUDE.md` (code conventions, folder structure, design tokens, "roadmap = Part 2 of bouwplan.md")

### Phase G — Verification ✅ (build + lint)
- [x] `npm run build` succeeds (18 routes generated)
- [x] `npm run lint` clean
- [ ] `npm run dev` manual check (by the user):
  - Desktop ≥640px: sidebar with all groups, navigation + active state, frosted header
  - Mobile <640px: bottom bar 5 tabs, More sheet (Activities/Feed/Profile), segmented controls in Dex/Battle
  - Every stub: PageHeader + EmptyState; focus-visible + `active:scale` work

## Watch-outs

- **No `cn()`**, no shadcn — strictly `[...].join(' ')` / inline ternary.
- **Light only**, breakpoint `sm` (640px), mobile-first.
- States: hover / active / focus-visible / disabled / empty.
- No real Supabase calls this milestone; `.env.example` without values.

## Next (after this milestone)

Per Part 2: Phase 0 cache layer + seed → Phase 1 Supabase auth/profiles/RLS → Phase 2–3 Shiny Dex → Phase 4 Live Hunt Counter (flagship) → etc.

---
---

# PART 2 — Roadmap & specification

> Full product source of truth (Pokémon Ultra Sun "Forever Save" Tracker, multi-user). Leading for all features after the bootstrap.

A free Next.js platform where **anyone can create an account** to track their Pokémon Ultra Sun (or Ultra Moon) save: shiny dex with a live hunt counter, living dex (incl. optional forms), legendaries & Ultra Beasts, battle-ready Pokémon, items, battle facilities, activities (Mantine Surf, Poké Pelago, quests, Island Scan, daily events) and a trainer profile with passport stamps. Every user gets their own, optionally public, shareable profile. Goal: **100% completion tracking** of a forever save — built **privacy-first**.

---

## Tech Stack

| Component | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router, TypeScript) | Server Components, route handlers, ISR caching |
| Database & Backend | Supabase (Postgres, **EU region**) | Auth with open sign-up, Realtime, Storage, Row Level Security |
| Styling | Tailwind CSS v4 + shadcn/ui | Component base with a custom iOS theme on top |
| Data fetching | TanStack Query v5 | Client-side caching, optimistic updates |
| Charts | shadcn/ui Charts (Recharts) | Analytics dashboard |
| External data | PokeAPI v2 — **through our own cache layer** | Pokémon, sprites, moves, items, natures, berries, Z-Crystals |
| Hosting | Vercel (free tier) | Seamless with Next.js |
| Validation | Zod + React Hook Form | Forms (shiny details, movesets, EVs) |

> ⚠️ **Implementation note:** the bootstrap deliberately deviates here (see Part 1): no shadcn/ui, TanStack, Zod, RHF or Recharts; Next 16.2.7 instead of 15; light only. The house style of agenda/notes is leading.

### Free-tier strategy
- **Supabase free tier**: 500 MB database, 1 GB storage, 50,000 monthly active users.
- **Guard storage**: client-side image compression (WebP, ~200 KB max), **max 3 photos per shiny**, EXIF stripped on upload.
- **PokeAPI data is static and free** — cached once in our own database (see cache layer), so no rate limits and no dependency on their uptime.
- **Vercel free tier**; render heavy pages statically/ISR.

### Privacy by design (core principle)
- **Private by default.** New accounts and all their data are private; making a profile public is an explicit opt-in.
- **Module-level visibility.** Even with a public profile, users can hide individual modules (e.g. show the shiny dex but hide the activity feed or items).
- **Minimal PII.** Only an email address (auth only, never displayed) and a self-chosen username. No real names, no birthdays, no phone numbers.
- **EU data residency.** Supabase project hosted in an EU region; user content never leaves the EU.
- **No third-party trackers or ads.** At most cookieless, self-hosted analytics (e.g. Umami) — or none at all.
- **EXIF stripping** on every photo upload (location metadata in screenshots/photos is silently removed).
- **GDPR rights built in**: full data export (JSON/CSV) and one-click account deletion that purges all rows *and* storage objects.
- **Social is opt-in**: the activity feed and follow system only ever surface data from users who explicitly enabled both a public profile and feed participation.
- **RLS as the enforcement layer**: visibility rules live in the database, not just the UI.

### Key data facts (verified)
- National dex through gen 7 = **#1–#807** (Zeraora). Meltan/Melmetal are not obtainable in USUM → out of scope.
- Gen 7 EV rules: **max 252 per stat, max 510 total** (UI caps at 510/252, hint about the practical 252/252/4 spread).
- Sprites: **game sprites (pixel art)**; shiny from `generation-vii/ultra-sun-ultra-moon` where available, else `front_shiny`.
- Moves filtered on version group **`ultra-sun-ultra-moon`**.
- **Not in PokeAPI** (own seed data needed): apparel, Totem Stickers, legendary locations/wormhole info, quests, Mantine Surf, Poké Pelago, passport stamps, Island Scan schedule, daily events, Poké Finder spots, forms metadata for the Forms Dex, ribbon list.
- **In PokeAPI**: Z-Crystals, Mega Stones, Poké Balls, TMs, Berries, natures, ball sprites, all species & forms sprites.
- Item cap: 999 per item, except Key Items and TMs (max 1).
- Battle Tree: Singles = team of 3, Doubles = team of 4. Battle Agency: rental battles in Festival Plaza with grades. Battle Royal: 4-player format with ranks (Normal → Master).
- Shiny odds USUM: base 1/4096 · Shiny Charm 1/1365 · Masuda 1/683 (no charm) / 1/512 (with charm) · SOS chaining up to ~1/315 · Ultra Wormhole boosted odds (distance/wormhole type).
- **Ultra Warp Ride**: nearly every legendary from gen 1–6 is catchable through wormholes; Ultra Beasts in their own worlds. Version exclusives exist.
- **Mantine Surf**: 4 courses (Melemele → Poni, increasing length/difficulty); beating the high score on all four = No. 1 = Surfing Pikachu reward. Earns BP.
- **Poké Pelago**: 5 isles (Abeens, Aphun, Evelup, Avue, Abeem), each developable to phase 3, using Plus beans.
- **Totem Stickers**: 100 total, milestones at 20/40/50/70/80/100 with version-dependent Totem rewards.
- **Island Scan**: a special, normally uncatchable Pokémon per island per weekday (incl. gen 1–3 starters), activated with 100 QR points (10 per scanned QR code; scans regenerate over time).
- **Daily events**: e.g. free Moomoo Milk in Paniola Town, an item buyer paying 5,000, Lomi lomi massage in Konikoni City, free Thrifty Megamart samples, Loto-ID — all reset daily.
- **Totem Pokémon are shiny-locked** (worth flagging in the shiny dex).

---

## Architecture principles (multi-user)

1. **Everything user-scoped** (`user_id` on every data row; RLS: write only your own rows).
2. **Public profile per user**: `/u/[username]`, read-only, private by default with opt-in publishing and module-level visibility.
3. **Shared, global PokeAPI cache + catalogs** (game data is the same for everyone).
4. **Game data ≠ user data**: cache/catalog tables are read-only for users; only the server (service role) writes to them.

---

## PokeAPI cache layer (core component)

**Principle: every PokeAPI resource is fetched at most once — ever, platform-wide.**

```
Request flow (e.g. "all moves of Dialga"):

  Client ──► Next.js route handler / Server Component
                 │
                 ▼
        1. Check Supabase cache table (pokemon_moves WHERE pokemon_id = 483)
                 │
        hit ─────┴───► serve directly
        miss ────────► 2. Fetch from PokeAPI
                       3. Normalize & store in Supabase
                       4. Serve
```

- **Three cache levels**: Supabase (permanent, shared) → Next.js Data Cache (`force-cache`; USUM data never changes) → TanStack Query (`staleTime: Infinity`).
- **Seed script** at deploy: 807 species (name, types, generation, sprite URLs, base stats), natures, balls, item categories + all custom catalogs (apparel, stickers, legendaries, quests, stamps, forms, ribbons, Island Scan, daily events, Poké Finder spots).
- **Lazy on-demand**: movesets, evolution chains, flavor texts — the first user requesting them triggers the fetch; afterwards it's there for everyone.
- Sprites keep loading from the PokeAPI/GitHub CDN (`next/image` caches); we only store **URLs**.

---

## Menu structure

```
┌──────────────────────────────────────────────────┐
│  📖 Dex                                           │
│     ├─ ✨ Shiny Dex                               │
│     ├─ 🎯 Active Hunts (live counter)             │
│     ├─ 📦 Living Dex                              │
│     ├─ 🔠 Forms Dex (optional toggle)             │
│     └─ 🌌 Legendaries & Ultra Beasts              │
│  ⚔️ Battle                                        │
│     ├─ 🏋️ Battle Ready (movesets/training)        │
│     ├─ 🌳 Battle Tree (teams & streaks)           │
│     ├─ 🎩 Battle Agency (grade)                   │
│     └─ 👑 Battle Royal (rank)                     │
│  🎒 Items                                         │
│     └─ Balls · TMs · Berries · Z-Crystals ·       │
│        Mega Stones · Other · Apparel ·            │
│        Totem Stickers                             │
│  🏄 Activities                                    │
│     ├─ Daily Checklist (auto-resets)              │
│     ├─ Island Scan ("scannable today" widget)     │
│     ├─ Mantine Surf (course records)              │
│     ├─ Poké Pelago (isle phases)                  │
│     ├─ Quests (postgame checklist)                │
│     ├─ Poké Finder (spots & scores)               │
│     ├─ Zygarde Cube (cell progress)               │
│     └─ Festival Plaza (rank & facilities)         │
│  📊 Analytics                                     │
│  👥 Feed (opt-in social)                          │
│  👤 Profile (trainer card · stamps · settings)    │
└──────────────────────────────────────────────────┘
```

- **Desktop**: grouped sidebar (iOS Settings style) with all groups.
- **Mobile**: iOS tab bar with 5 slots — **Dex · Battle · Items · Analytics · More** (More = Activities + Feed + Profile, as a grouped list). Segmented controls inside Dex and Battle.
- Public profile `/u/username` mirrors the same structure read-only, respecting module visibility settings.

---

## Phase 0 — Project setup & foundation

> **Status (done this milestone):** Next.js 16 + Tailwind v4 scaffold (no shadcn), `@supabase/ssr` client helpers (`app/lib/supabase/`), folder structure, `profiles` + `pokemon_cache` tables with RLS (`supabase/migrations/0001_init.sql`), and a working fetch-on-miss cache helper (`app/lib/pokeapi/`).
> **Deferred:** bulk seed of all 807 species (documented in README), Supabase Storage (shiny screenshots) and Realtime, custom catalog tables (come with their features).

- [ ] Next.js 15 (App Router, TS, ESLint, Prettier) · Tailwind v4 + shadcn/ui
- [ ] Supabase (**EU region**): database, Auth (open sign-up), Storage (`shiny-screenshots`), Realtime enabled
- [ ] `.env`, Supabase client helpers (`@supabase/ssr`), Vercel pipeline
- [ ] Folder structure: `app/(auth)`, `app/(app)`, `app/u/[username]`, `lib/pokeapi`, `lib/supabase`, `components/ui`, `components/ios`
- [ ] **Cache layer**: cache tables, fetch-on-miss helper, seed script (species, natures, balls + custom catalogs)

**Deliverable:** working deploy with a populated base cache.

---

## Phase 1 — Accounts, profiles, privacy & app shell (iOS styling)

> **Status (done this milestone):** email/password sign-up + login + password reset + email-confirmation callback; onboarding (unique username + US/UM); `profiles` (private-by-default, `module_visibility` jsonb, `feed_enabled` false by default, no email/PII) with RLS; server-side route gating + middleware; profile/privacy settings with public + per-module + feed toggles; public read-only `/u/[username]` honoring module visibility; plain-language `/privacy`; the iOS app shell from the bootstrap.
> **Deferred:** avatar upload + EXIF stripping, self-hosted analytics, Open Graph cards.

### Auth & accounts
- [ ] Sign-up + login (email/password, email verification), password reset
- [ ] Onboarding: **username** (unique → `/u/username`) + **game version** (US/UM — drives Totem rewards and version-exclusive legendaries)
- [ ] `profiles`: username, is_public (**default false**), module_visibility jsonb, game_version, avatar
- [ ] **RLS everywhere**: write own rows only; rows of public profiles readable by anyone *per visible module*; catalogs read-only

### Privacy foundations (built now, not bolted on later)
- [ ] Private-by-default profiles + explicit "publish profile" flow that explains exactly what becomes visible
- [ ] Module-level visibility toggles (dex, hunts, battle, items, activities, analytics, feed)
- [ ] EXIF stripping in the upload pipeline
- [ ] No third-party scripts; cookieless self-hosted analytics or none
- [ ] Privacy page in plain language (what we store, where, how to delete it)

### Public profile page
- [ ] `/u/[username]`: read-only showcase honoring module visibility
- [ ] Clean 404/private message · Open Graph preview card (later extra)

### iOS app shell
- [ ] Tab bar (mobile, 5 tabs incl. "More") / grouped sidebar (desktop) per the menu structure
- [ ] iOS design system: large collapsing titles, frosted glass headers, `rounded-2xl` cards, grouped lists, segmented controls, bottom sheets with grabber, SF Pro-like font stack, system colors, dark mode, scale-on-press animations

**Deliverable:** sign up → onboard → own private environment; public profiles work for those who opt in.

---

## Phase 2 — Dex tab: grid foundation & Shiny Dex

### Reusable Pokémon grid (powers all dexes)
- [ ] Reads from the seeded `pokemon_cache` (807) — **no** live PokeAPI calls on grid pages
- [ ] `next/image` lazy + `image-rendering: pixelated` · virtualized/infinite scroll
- [ ] **Filters**: generation, type (official type colors), status · **search** by name/number · sorting

### Shiny Dex
- [ ] Uncaught in grayscale/silhouette, caught in color + sparkle badge ✨
- [ ] Progress counter "243 / 807 ✨"
- [ ] **Shiny-locked mons flagged** (Totem gifts, in-game Cosmog line, etc.) with a lock icon + explanation

**Deliverable:** lightning-fast, filterable shiny overview.

---

## Phase 3 — Shiny detail: filling in, completing & showcase modal

### `shinies` table
- [ ] Nickname · catch date · Poké Ball (ball sprites) · Nature (+/- display)
- [ ] Method: Random Encounter · Soft Reset · Masuda · SOS Chaining · **Ultra Wormhole** · Chain Fishing · Event · Trade · Other
- [ ] Encounter/reset/egg count · hunt duration · photos (**max 3**, WebP compression, EXIF stripped → Storage)
- [ ] Extra: gender · ability (incl. hidden) · level · location · own game/trade · Shiny Charm? · note · favorite star · **luck score** (encounters vs. method odds)

**From the cache:** USUM flavor text, types, genus, height/weight, base stats, evolution chain with shiny sprites (lazily cached).

### Flow
- [ ] Owner: sprite → detail/edit → **"Complete ✨"** → completed, colors in the grid
- [ ] Completed sprite → **showcase modal** (iOS sheet): big sprite, specs, photo carousel, odds/luck
- [ ] Pencil icon top-right (owner only) · public profiles: same modal without the pencil
- [ ] **Shareable hunt card**: per completed shiny a generated OG image ("Shiny Lugia · 847 SRs · 1.8× over odds") with a copy-link/share button — perfect for Discord/socials

**Deliverable:** complete shiny lifecycle, shareable.

---

## Phase 4 — Live Hunt Counter (the companion feature) 🎯

**Goal:** turn the app from a logbook into a companion sitting next to your 3DS during every hunt.

### Active hunts
- [ ] **Start a hunt** on any mon: pick method (drives the odds), optional Shiny Charm flag
- [ ] **Multiple simultaneous hunts**, each with its own counter; one "pinned" hunt for quick access
- [ ] **Big +1 button** (thumb-sized on mobile) · **spacebar increments on desktop** · configurable step (+1 for SRs, +5 for batch eggs, etc.) · undo
- [ ] **Session tracking**: start/pause a session timer; per-session encounter counts; total hunt time accumulates
- [ ] Counter syncs via Supabase Realtime — start on your phone, continue on your laptop

### Live odds meter
- [ ] Real-time cumulative probability via binomial distribution: "63% chance you'd have found it by now"
- [ ] "1.2× past the odds 😬" indicator once you cross the expected value, with the method's base odds shown
- [ ] Honest math: a per-encounter chance never increases — the UI explains cumulative vs. per-encounter to avoid gambler's-fallacy confusion

### Phases
- [ ] **"Phase" button**: hunting mon A, a shiny mon B appears → logs the phase shiny (species, encounter count at that moment, timestamp), optionally creates a completed shiny entry for B, and the main hunt keeps running with its counter intact
- [ ] Phase history visible on the hunt and on the eventual shiny detail page ("2 phases along the way")

### Completion & wishlist
- [ ] **"Got it! ✨"** → hunt closes and everything (encounters, duration, sessions, method, phases) flows automatically into the shiny detail page of Phase 3 — just add nickname/ball/photos
- [ ] **Hunt wishlist**: planned hunts with priority and intended method ("next up: Masuda Bagon"), one tap to promote a wishlist entry to an active hunt

**Deliverable:** live counter with phases, odds and wishlist, feeding the shiny dex automatically.

---

## Phase 5 — Living Dex (Realtime) & Forms Dex

### Living Dex
- [ ] Same grid, regular sprites, sectioned per generation with sticky headers
- [ ] **One tap = check off** · **Supabase Realtime**: change on computer A instantly visible on computer B · optimistic updates
- [ ] Progress per generation + total · box view (per PC box of 30)

### Forms Dex (optional toggle)
- [ ] **Off by default** — purists simply see 807; flip the toggle and form slots appear
- [ ] `forms_catalog` seed for gen 7-relevant forms: **Alolan forms · Unown (28) · Vivillon patterns · Oricorio styles · Minior cores · Lycanroc forms · gender differences** (Unfezant, Pyroar, Meowstic, …) · plus Castform, Rotom, Deoxys, Shellos/Gastrodon, Basculin, etc.
- [ ] Form sprites from PokeAPI (`pokemon-form` endpoint, cached)
- [ ] Forms count toward a separate "Forms" progress bar, never polluting the 807 counter

**Deliverable:** realtime living dex with an opt-in forms layer.

---

## Phase 6 — Legendaries & Ultra Beasts (third dex)

- [ ] **Seed catalog** (`legendary_catalog`): per mon — category (legendary / mythical / Ultra Beast), acquisition (Ultra Warp Ride / story / static encounter / event), wormhole type & prerequisites, **US/UM version exclusivity**, shiny-locked yes/no
- [ ] Checklist UI grouped by category and generation, sprites from the cache
- [ ] Per mon: caught yes/no · date · ball · **"shiny hunt" link**: one tap jumps to that mon's shiny detail page or starts an Active Hunt (wormhole hunting is a shiny method!)
- [ ] Version exclusives of the *other* version shown with a trade icon
- [ ] Progress: "Legendaries 34/51 · UBs 9/11 · Mythicals 3/5"

**Deliverable:** complete legendary administration, wired into the shiny dex and hunt counter.

---

## Phase 7 — Analytics

- [ ] Period switcher **Year · Month · Day** + date navigation
- [ ] Charts: catches over time · cumulative toward 807 (goal line) · method donut · avg. encounters per method · avg. hunt duration · generation/type distribution · ball usage
- [ ] **Hunt-counter powered stats**: encounters per session, hunting time per week, phases per hunt, odds-luck distribution
- [ ] Fun stats: longest hunt · luckiest catch · all-time encounters · longest daily streak & dry spell · shiny of the month · heatmap calendar · projection "dex complete by …"
- [ ] **Overall completion meter** across everything (shiny dex + living dex + forms + legendaries + items + stickers + quests) 🏆
- [ ] Visible on public profiles (if the module is set to visible)

**Deliverable:** personal analytics dashboard with overall completion.

---

## Phase 8 — Battle Ready: movesets, IV/EV training, tutors & ribbons

### 8a. Moveset builder
- [ ] Search bar → mon → builder · moves via the cache layer (first request = fetch + store, then served from db for everyone)
- [ ] Filtered on `ultra-sun-ultra-moon`, grouped by learn method (level-up/TM/**tutor**/egg)
- [ ] Per move: name, **type with type color**, category icon, power, accuracy, PP, description · **max 4** with validation

### 8b. IVs, EVs, nature
- [ ] IVs 0–31 (shortcuts 6×31 / 0 Atk / 0 Spe) · EVs 0–252 per stat, **max 510 total**, live counter + 252/252/4 hint
- [ ] **Hexagon/radar chart** moving live with EV input · nature with ±10% indication · nickname, held item, ability, level (50)

### 8c. Training flow
- [ ] Save → status **"Training"** 🏋️ · progress page: check off learned moves, update EVs (hexagon grows, target as ghost overlay), IVs verified (Hyper Training), progress bar
- [ ] **Move Tutors**: BP tutor moves flagged in the move list; per battle-ready mon check off "taught by tutor" incl. BP cost overview

### 8d. Ribbons & completion
- [ ] `ribbons_catalog` seed (gen 7-obtainable ribbons: Battle Tree, Best Friends, Effort, footprint, memorial ribbons, …)
- [ ] Per battle-ready mon: check off earned ribbons — "fully trained" becomes "fully decorated"
- [ ] **"Training complete"** → completed + timestamp **Europe/Amsterdam** · "Completed" view with showcase modal (moveset, hexagon, IV/EV spread, nature, ribbons, completion date & time)

**Deliverable:** plan → train → completed pipeline, now incl. tutors and ribbons.

---

## Phase 9 — Items (subtabs)

**Subtabs:** Poké Balls · TMs · Berries · Z-Crystals · Mega Stones · Other items · Apparel · Totem Stickers

- [ ] **Regular items** via cache layer (filtered for gen 7/USUM): sprite, name, flavor, price · stepper 0–999 (+1/+10/max) · **Key Items & TMs max 1** (checkbox, TMs show their move) · progress bar per category
- [ ] **Z-Crystals**: checklist, type-specific vs. Pokémon-exclusive
- [ ] **Mega Stones**: checklist with associated Pokémon
- [ ] **Apparel** *(seed data from Serebii)*: per shop/gender/color variant, check off, filter by trainer gender
- [ ] **Totem Stickers** *(seed data)*: all 100 per island (Melemele 17 · Akala 33 · Ula'ula 34 · Poni 16) with location · milestone bar 20/40/50/70/80/100 with rewards **based on game version** (US: Gumshoos/Marowak/Lurantis/Vikavolt/Mimikyu/Ribombee · UM: Raticate/Araquanid/Salazzle/Togedemaru/Mimikyu/Kommo-o)

**Deliverable:** full item administration.

---

## Phase 10 — Battle Tree, Battle Agency & Battle Royal

### Battle Tree
- [ ] **Team builder**: Singles (3) / Doubles (4), mons from your completed pool · validation: no duplicate held items
- [ ] **Streaks**: active run with counter · close out with final streak + how it ended + note + date · **history** with best streak per format 🏆 · mini streak chart

### Battle Agency
- [ ] Grade tracker (current grade + progression) · note field for memorable rental mons/runs

### Battle Royal
- [ ] Rank tracker: Normal → Super → Hyper → Master, with date per promotion

**Deliverable:** all three battle facilities trackable in one Battle tab.

---

## Phase 11 — Activities

### Daily Checklist 📅 (auto-resets)
- [ ] `daily_events_catalog` seed: free Moomoo Milk (Paniola Town) · item buyer (5,000) · Lomi lomi massage (Konikoni City) · Thrifty Megamart sample · Loto-ID · restaurant Heart Scales · Oricorio nectars · etc.
- [ ] Daily to-do list that **resets automatically every day** (user's local date); per item check off, with a "today's streak" counter — perfect forever-save gamification
- [ ] Optional: pick which dailies you care about (hide the rest)

### Island Scan 📡 ("scannable today")
- [ ] `island_scan_catalog` seed: the full weekday × island schedule
- [ ] **"Scannable today" widget**: the app knows the real date — "It's Wednesday → Charmeleon on Akala" with sprite and location
- [ ] Checklist of all Island Scan mons (caught yes/no), QR-points reminder (100 points per scan, 10 per code)
- [ ] Links into living dex: catching an Island Scan mon offers to tick it there too

### Mantine Surf 🏄
- [ ] Per course (Heahea/Melemele · Akala · Ula'ula · Poni): **best score** + score history (mini chart)
- [ ] BP counter (total earned, optional)
- [ ] **"No. 1 on all four" badge** + Surfing Pikachu reward checkbox (linked to the dex entry 😄)

### Poké Pelago 🏝️
- [ ] Five isles (Abeens · Aphun · Evelup · Avue · Abeem): **development phase 0–3** per isle (visual phase indicator)
- [ ] Plus beans counter · "all maxed" badge

### Quests (postgame checklist) 📜
- [ ] `quests_catalog` seed, grouped:
  - **Episode Rainbow Rocket**: each leader checkable (Giovanni, Archie, Maxie, Cyrus, Ghetsis, Lysandre)
  - **Ultra Beast missions** (Looker & Anabel)
  - **Eevium Z quest**: all 8 Eevee-evolution trainers
  - **Ditto Five side quest**: 5 Dittos
  - **Mina's trial** (all petal trainers)
  - Other: Island Scan complete, Surfing Pikachu, Type: Null/Silvally, island stamps, etc.
- [ ] Per quest (step): check off + date · progress per category + total

### Poké Finder 📸
- [ ] `pokefinder_catalog` seed of photo spots; per spot: completed + **best score**
- [ ] Finder version upgrades (1 → 5) trackable as milestones

### Zygarde Cube 🧩
- [ ] Cell progress counter with milestones toward **10% / 50% / 100% Zygarde** forms; per form an "obtained" checkbox

### Festival Plaza 🎪
- [ ] Rank tracking · facilities list (which shops, with stars) · Festival Coin milestones

**Deliverable:** all USUM side content trackable; feeds the overall completion meter.

---

## Phase 12 — Social: activity feed & following (opt-in) 👥

**Privacy rule: nothing enters the feed unless the user has BOTH a public profile AND feed participation enabled.**

- [ ] **Follow system**: follow other public profiles; follower/following lists (hideable)
- [ ] **Activity feed**: "PietPoke just caught shiny Dialga after 1,204 SRs ✨" — generated from completion events (shiny completed, hunt milestone, training completed, streak record, quest done)
- [ ] Per event type a toggle: choose which achievements get broadcast
- [ ] Feed tab shows: your follows' activity + optionally a global "recent catches" stream (public + opted-in users only)
- [ ] No likes/comments in v1 — keep it celebration-only, no social pressure
- [ ] Shareable hunt cards (Phase 3) reusable directly from feed items

**Deliverable:** a living platform for those who want it; invisible for those who don't.

---

## Phase 13 — Profile: trainer card, passport stamps & settings

- [ ] Trainer card (iOS card): username, game version, save start date, avatar
- [ ] Editable: playtime · money (₽, max 9,999,999) · Battle Points · island challenge progress
- [ ] **Trainer Passport Stamps**: in-game stamps 1:1 as checkable badges (badge grid, earned = color + date, unearned = gray)
- [ ] Auto stats: shinies, living dex %, forms %, legendaries %, battle-ready, best streaks, items %, quests %, **overall completion %**
- [ ] Milestone timeline ("First shiny", "100th shiny", "No. 1 Mantine Surf", "Rainbow Rocket defeated")
- [ ] **Settings**: public/private + module visibility, feed participation, username, game version, dark mode
- [ ] **Data export**: full JSON and CSV export of all your data (GDPR Art. 20, and simply good practice — no lock-in)
- [ ] **Data import**: re-import a previous export (migration/restore)
- [ ] **Account deletion**: one click, deletes all rows + storage objects + auth record, with a clear confirmation

**Deliverable:** profile as the heart of the public page; full data ownership.

---

## Phase 14 — Polish, performance & launch

- [ ] Lighthouse/bundle audit · cache hit-rate check (PokeAPI calls → ~0 over time)
- [ ] PWA (manifest + icon) · empty states & skeletons per tab · error handling with fallbacks
- [ ] Responsive mobile ↔ desktop · accessibility (focus, alt, contrast)
- [ ] **Multi-user hardening**: RLS audit, rate limiting on sign-up/upload/feed, storage quota, mandatory email verification
- [ ] **Privacy audit**: verify private-by-default everywhere, module visibility leaks, EXIF stripping, no third-party requests, export/delete flows tested end-to-end
- [ ] Supabase backups · README + seed scripts documented
- [ ] Landing page for visitors (explanation + example profile + sign-up button) + plain-language privacy page

---

## Database schema (overview)

```
── Shared (cache & catalogs — read-only for users, server writes) ──
pokemon_cache        (807: id, name, types[], generation, sprite urls,
                      base stats, shiny_locked boolean)
pokemon_moves        (pokemon_id, USUM move data, learn method, is_tutor, bp_cost) ← lazy
pokemon_details      (pokemon_id, flavor text, evolution chain)      ← lazy
forms_catalog        (form_id, pokemon_id, form name, sprite urls)   ← seed
items_cache          (item_key, category, sprite url, flavor, price, max_one)
apparel_catalog      (id, name, category, shop, gender)              ← seed
totem_stickers       (nr 1-100, island, location)                    ← seed
legendary_catalog    (pokemon_id, category, acquisition, wormhole_info,
                      version_exclusive, shiny_locked)               ← seed
quests_catalog       (id, category, name, step_nr)                   ← seed
stamps_catalog       (id, name, description, icon)                   ← seed
ribbons_catalog      (id, name, how_obtained)                        ← seed
island_scan_catalog  (weekday, island, pokemon_id, location)         ← seed
daily_events_catalog (id, name, location, description)               ← seed
pokefinder_catalog   (spot_id, location, unlock_requirement)         ← seed

── Per user (user_id + RLS) ──
profiles            (user_id, username, is_public DEFAULT false,
                     module_visibility jsonb, feed_enabled DEFAULT false,
                     game_version, avatar)
shinies             (user_id, pokemon_id, nickname, caught_at, ball, nature,
                     method, encounter_count, hunt_duration, gender, ability,
                     level, location, shiny_charm, note, is_favorite, status)
shiny_photos        (shiny_id, storage_path, sort_order)             ← max 3
active_hunts        (user_id, pokemon_id, method, shiny_charm, count,
                     step_size, sessions jsonb, status, started_at)  ← Realtime
hunt_phases         (hunt_id, pokemon_id, count_at_phase, phased_at,
                     linked_shiny_id)
hunt_wishlist       (user_id, pokemon_id, method, priority, note)
living_dex          (user_id, pokemon_id, form_id NULL, caught, updated_at) ← Realtime
user_legendaries    (user_id, pokemon_id, caught, caught_at, ball)
battle_pokemon      (user_id, pokemon_id, nickname, nature, ability, held_item,
                     ivs jsonb, evs_target jsonb, evs_current jsonb,
                     moves jsonb[4 + learned + tutor_taught], status, completed_at)
user_ribbons        (battle_pokemon_id, ribbon_id, earned_at)
user_items          (user_id, item_key, quantity)
user_apparel        (user_id, apparel_id, owned)
user_stickers       (user_id, sticker_nr, collected)
battle_tree_runs    (user_id, format, team jsonb, streak, status,
                     ended_reason, ended_at)
battle_agency       (user_id, grade, updated_at, note)
battle_royal        (user_id, rank, promoted_at per rank)
mantine_surf        (user_id, course, best_score, history jsonb,
                     surfing_pikachu boolean)
poke_pelago         (user_id, isle, phase 0-3, beans)
user_quests         (user_id, quest_id, completed, completed_at)
user_island_scan    (user_id, pokemon_id, caught, caught_at)
user_dailies        (user_id, event_id, date, done)
user_pokefinder     (user_id, spot_id, completed, best_score)
zygarde_progress    (user_id, cells, form_10, form_50, form_100)
festival_plaza      (user_id, rank, facilities jsonb, coins_milestone)
user_stamps         (user_id, stamp_id, earned_at)
trainer_profile     (user_id, playtime, money, bp, started_at)

── Social (opt-in only) ──
follows             (follower_id, followee_id, created_at)
activity_events     (user_id, type, payload jsonb, created_at)
                    ← rows only created when feed_enabled = true;
                      readable only while profile is public & feed enabled
```

**RLS principle:** catalogs/cache `SELECT` for everyone, writes via service role · user tables: owner full access on own rows, `SELECT` for others only when `is_public = true` **and** the corresponding module is visible · social tables additionally require `feed_enabled = true`.

---

## Recommended order & sizing

| Phase | Size | Note |
|---|---|---|
| 0–1 | Foundation | Auth, RLS, privacy model and cache layer first — everything builds on this |
| 2–3 | Core | The shiny tracker is the heart |
| 4 | **Flagship** | The live hunt counter is what makes this app a companion, not a logbook |
| 5 | Quick win + | Living dex reuses the grid; forms dex is a catalog + toggle |
| 6 | Medium | Seeding the legendary catalog is the bulk (one-off) |
| 7 | After | Analytics + completion meter needs data from 3–6 |
| 8 | Largest | Moveset builder + EV system + tutors + ribbons |
| 9 | Repetitive | Subtabs share one checklist component |
| 10–11 | Build-out | Battle facilities and activities are mostly small trackers on the same pattern |
| 12 | Later | Social only becomes valuable once there are users — ship after launch is fine |
| 13 | Closer | Profile + stamps + data ownership ties it all together |
| 14 | Launch | Hardening, privacy audit, polish & deploy |

> **Build tip:** Phases 6, 9, 10 and 11 nearly all run on the same pattern — *shared catalog + per-user progress table + checklist UI*. Build that pattern once, generically (catalog component with progress bar, check-off action, optional date), and half of those phases become configuration instead of new work.
