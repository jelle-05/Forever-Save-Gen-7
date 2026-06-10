-- =============================================================================
-- Forever Save — shinies (Phase 2)
-- User-scoped shiny-voortgang. Phase 3 breidt deze tabel later uit met meer
-- detailvelden (ball, nature, photos, …). Hier alleen wat het overzicht nodig heeft.
-- =============================================================================

create extension if not exists pgcrypto;

create table public.shinies (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  pokemon_id      int not null references public.pokemon_cache (id),
  status          text not null default 'completed' check (status in ('completed', 'in_progress')),
  nickname        text,
  caught_at       timestamptz,
  encounter_count int not null default 0,
  method          text,
  is_favorite     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.shinies is 'Shiny-voortgang per gebruiker. Meerdere rijen per soort mogelijk; dex-completion telt distinct pokemon_id met status=completed.';

create index shinies_user_idx on public.shinies (user_id);
create index shinies_user_pokemon_idx on public.shinies (user_id, pokemon_id);

create trigger trg_shinies_updated_at
  before update on public.shinies
  for each row execute function public.set_updated_at();

-- =============================================================================
-- RLS — privacy in de database, niet alleen in de UI.
-- =============================================================================
alter table public.shinies enable row level security;

-- Eigenaar: volledige toegang tot eigen rijen.
create policy "shinies_select_own"
  on public.shinies for select
  using (user_id = auth.uid());

create policy "shinies_insert_own"
  on public.shinies for insert
  with check (user_id = auth.uid());

create policy "shinies_update_own"
  on public.shinies for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "shinies_delete_own"
  on public.shinies for delete
  using (user_id = auth.uid());

-- Publiek lezen: alleen als het profiel publiek is én de dex-module zichtbaar.
-- Bereidt de read-only publieke Shiny Dex voor (Phase 1 /u/[username]).
create policy "shinies_select_public"
  on public.shinies for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = shinies.user_id
        and p.is_public
        and coalesce((p.module_visibility ->> 'dex')::boolean, false)
    )
  );
