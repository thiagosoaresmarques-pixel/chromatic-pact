-- ============================================================================
-- CHROMATIC PACT — SUPABASE SQL SCHEMA (PROFILES, 1v1 ROOMS & MATCH HISTORY)
-- Cole e execute este script no "SQL Editor" do seu painel gratuito no Supabase
-- ============================================================================

-- 1. Tabela de Perfis de Soberano (Sincronizada com Supabase Auth ou Modo Teste)
create table if not exists public.sovereign_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  username text not null unique,
  title text not null default 'Soberano Iniciado',
  avatar_card_id text not null default 'neutral_10_valkyra_pentacromatica',
  elo_rating integer not null default 1200,
  pvp_wins integer not null default 0,
  pvp_losses integer not null default 0,
  gold integer not null default 500,
  updated_at timestamptz not null default now()
);

-- 2. Tabela de Salas 1v1 em Tempo Real (Matchmaking & Salas Privadas com Código)
create table if not exists public.multiplayer_rooms (
  code text primary key,
  status text not null default 'waiting', -- 'waiting' | 'playing' | 'finished'
  is_public_queue boolean not null default true,
  host_id text not null,
  host_name text not null,
  host_title text not null,
  host_avatar text not null,
  host_elo integer not null default 1200,
  host_deck_id text not null,
  guest_id text,
  guest_name text,
  guest_title text,
  guest_avatar text,
  guest_elo integer,
  guest_deck_id text,
  game_state jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Habilita Realtime na tabela de salas para sincronizar jogadas 1x1 instantaneamente
alter publication supabase_realtime add table public.multiplayer_rooms;

-- Políticas públicas para modo Beta / Teste (ajuste conforme desejar em produção)
alter table public.sovereign_profiles enable row level security;
alter table public.multiplayer_rooms enable row level security;

create policy "Public read/write profiles in beta"
  on public.sovereign_profiles for all
  using (true) with check (true);

create policy "Public read/write rooms in beta"
  on public.multiplayer_rooms for all
  using (true) with check (true);
