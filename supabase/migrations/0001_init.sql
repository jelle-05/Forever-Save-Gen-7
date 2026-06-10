-- =============================================================================
-- Forever Save — Phase 0/1 init
-- profiles (private-by-default, module-level visibility) + pokemon_cache.
-- Inclusief RLS. Privacy wordt door de database afgedwongen, niet alleen de UI.
--
-- Toepassen:
--   - Supabase CLI:  supabase db push
--   - of: plak dit bestand in de Supabase SQL editor en voer het uit.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Generieke updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — één rij per gebruiker. Geen e-mail/PII hier (auth-only).
-- Standaard privé; publiceren is een expliciete opt-in. module_visibility
-- bepaalt per module wat zichtbaar is op een publiek profiel.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                 uuid primary key references auth.users (id) on delete cascade,
  username           text not null check (username ~ '^[a-z0-9_]{3,20}$'),
  is_public          boolean not null default false,
  module_visibility  jsonb not null default
                       '{"dex":true,"hunts":true,"battle":true,"items":true,"activities":true,"analytics":true,"feed":true}'::jsonb,
  feed_enabled       boolean not null default false,
  game_version       text not null check (game_version in ('US', 'UM')),
  avatar_url         text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.profiles is 'Profiel per gebruiker. Privé tenzij is_public=true; module_visibility regelt zichtbaarheid per module. Bevat geen e-mail of andere PII.';

-- Hoofdletterongevoelig uniek (en URL-veilig voor /u/[username]).
create unique index profiles_username_lower_idx on public.profiles (lower(username));

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- pokemon_cache — gedeelde, globale PokeAPI-cache (read-only voor gebruikers).
-- Writes gebeuren uitsluitend via de service role (seed / fetch-on-miss).
-- ---------------------------------------------------------------------------
create table public.pokemon_cache (
  id             int primary key,                 -- national dex nr (1..807)
  name           text not null,
  types          text[] not null default '{}',
  generation     int,
  sprite_default text,
  sprite_shiny   text,
  base_stats     jsonb,
  shiny_locked   boolean not null default false,
  created_at     timestamptz not null default now()
);

comment on table public.pokemon_cache is 'Gedeelde PokeAPI-cache. SELECT voor iedereen; schrijven alleen via service role.';

-- =============================================================================
-- RLS
-- =============================================================================
alter table public.profiles      enable row level security;
alter table public.pokemon_cache enable row level security;

-- profiles: eigen profiel volledig; publieke profielen leesbaar voor iedereen.
create policy "profiles_select_public_or_own"
  on public.profiles for select
  using (is_public or id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- pokemon_cache: iedereen mag lezen; geen write-policies → gebruikers kunnen
-- niet schrijven (de service role omzeilt RLS en seedt de data).
create policy "pokemon_cache_select_all"
  on public.pokemon_cache for select
  using (true);
