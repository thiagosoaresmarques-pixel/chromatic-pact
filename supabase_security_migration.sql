-- ============================================================================
-- CHROMATIC PACT — BLINDAGEM DE SEGURANÇA SUPABASE (RLS + SECURITY DEFINER RPCs)
-- Script 100% idempotente (seguro para executar mais de uma vez no SQL Editor).
--
-- O que esta migração faz:
--   1. Cria o cofre privado `public.sovereign_secrets` (RLS ativo, ZERO acesso via REST)
--      para guardar `email`, `password_hash` e `is_admin` fora de `sovereign_profiles`.
--   2. Migra automaticamente `email` ("e") e `password_hash` ("p") das contas atuais
--      e remove esses campos sensíveis do JSON público `sovereign_profiles.title`.
--   3. Remove as políticas Beta abertas (`USING (true) WITH CHECK (true)`) e aplica
--      RLS estritamente Somente-Leitura (`FOR SELECT`) nas tabelas públicas, bloqueando
--      qualquer `INSERT`, `UPDATE` ou `DELETE` direto via DevTools / REST.
--   4. Instala RPCs `SECURITY DEFINER` autenticadas e com travas anti-cheat de servidor
--      para Login, Recuperação de Senha, Sincronização de Perfil (teto de Elo/Ouro),
--      Inscrições/Súmulas de Torneio, Salas 1v1 e Painel Administrativo (`tsm81`).
-- ============================================================================

begin;

-- 1. Garantir tabelas base (caso executado em banco limpo)
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

create table if not exists public.multiplayer_rooms (
  code text primary key,
  status text not null default 'waiting',
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

do $$
begin
  alter publication supabase_realtime add table public.multiplayer_rooms;
exception when duplicate_object or undefined_object then
  null;
end;
$$;

-- 2. Cofre privado de credenciais (100% inacessível via PostgREST anon/authenticated)
create table if not exists public.sovereign_secrets (
  username text primary key,
  email text not null default '',
  password_hash text not null default '',
  is_admin boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists idx_sovereign_secrets_lower_user
  on public.sovereign_secrets (lower(username));

create index if not exists idx_sovereign_secrets_lower_email
  on public.sovereign_secrets (lower(email))
  where email <> '';

create index if not exists idx_sovereign_profiles_lower_user
  on public.sovereign_profiles (lower(username));

alter table public.sovereign_secrets enable row level security;
revoke all on table public.sovereign_secrets from anon, authenticated;

-- 3. Helper seguro para parsear JSON sem lançar exceção em títulos legados
create or replace function public.try_parse_jsonb(p_raw text)
returns jsonb
language plpgsql
immutable
set search_path = public
as $$
begin
  if p_raw is null or left(btrim(p_raw), 1) <> '{' then
    return null;
  end if;
  return p_raw::jsonb;
exception when others then
  return null;
end;
$$;

-- 4. Backfill automático das credenciais existentes + higienização de `sovereign_profiles.title`
do $$
declare
  r record;
  v_json jsonb;
  v_email text;
  v_pwd text;
  v_adm boolean;
begin
  for r in
    select id, username, title
    from public.sovereign_profiles
    where left(username, 2) <> '__'
  loop
    v_json := public.try_parse_jsonb(r.title);
    v_email := lower(btrim(coalesce(v_json->>'e', '')));
    v_pwd := btrim(coalesce(v_json->>'p', ''));
    v_adm := (lower(btrim(r.username)) = 'tsm81') or coalesce((v_json->>'adm')::boolean, false);

    insert into public.sovereign_secrets (username, email, password_hash, is_admin, updated_at)
    values (r.username, v_email, v_pwd, v_adm, now())
    on conflict (username) do update set
      email = case when excluded.email <> '' then excluded.email else public.sovereign_secrets.email end,
      password_hash = case when excluded.password_hash <> '' then excluded.password_hash else public.sovereign_secrets.password_hash end,
      is_admin = public.sovereign_secrets.is_admin or excluded.is_admin,
      updated_at = now();

    if v_json is not null and (v_json ? 'e' or v_json ? 'p') then
      update public.sovereign_profiles
      set title = (jsonb_set(v_json - 'e' - 'p', '{adm}', to_jsonb(v_adm), true))::text
      where id = r.id;
    end if;
  end loop;
end;
$$;

-- 5. Políticas RLS estritas (Somente-Leitura pública; escrita/deleção 100% via RPC)
alter table public.sovereign_profiles enable row level security;
alter table public.multiplayer_rooms enable row level security;

drop policy if exists "Public read/write profiles in beta" on public.sovereign_profiles;
drop policy if exists "Public read/write rooms in beta" on public.multiplayer_rooms;
drop policy if exists "sovereign_profiles_public_select_v2" on public.sovereign_profiles;
drop policy if exists "multiplayer_rooms_public_select_v2" on public.multiplayer_rooms;

create policy "sovereign_profiles_public_select_v2"
  on public.sovereign_profiles
  for select
  to anon, authenticated
  using (not starts_with(username, '__telemetry_session__:'));

create policy "multiplayer_rooms_public_select_v2"
  on public.multiplayer_rooms
  for select
  to anon, authenticated
  using (true);

-- Garantir privilégios de tabela coerentes com RLS (sem INSERT/UPDATE/DELETE direto)
revoke insert, update, delete, truncate on table public.sovereign_profiles from anon, authenticated;
revoke insert, update, delete, truncate on table public.multiplayer_rooms from anon, authenticated;
grant select on table public.sovereign_profiles to anon, authenticated;
grant select on table public.multiplayer_rooms to anon, authenticated;

-- 6. Helper interno: verifica se credencial pertence a um Administrador válido
create or replace function public.is_verified_sovereign_admin(
  p_username text,
  p_password_hash text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sec public.sovereign_secrets%rowtype;
begin
  if coalesce(btrim(p_username), '') = '' or coalesce(btrim(p_password_hash), '') = '' then
    return false;
  end if;

  select * into v_sec
  from public.sovereign_secrets
  where lower(username) = lower(btrim(p_username))
  limit 1;

  if not found then
    return false;
  end if;

  if not (v_sec.is_admin or lower(v_sec.username) = 'tsm81') then
    return false;
  end if;

  if v_sec.password_hash = '' then
    return false;
  end if;

  return v_sec.password_hash = btrim(p_password_hash);
end;
$$;

revoke all on function public.is_verified_sovereign_admin(text, text) from public, anon, authenticated;

-- ============================================================================
-- RPC 1: Autenticação de Conta Soberana (por Nickname ou E-mail + Hash)
-- ============================================================================
create or replace function public.rpc_auth_sovereign(
  p_identifier text,
  p_password_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clean text := btrim(coalesce(p_identifier, ''));
  v_pwd text := btrim(coalesce(p_password_hash, ''));
  v_prof public.sovereign_profiles%rowtype;
  v_sec public.sovereign_secrets%rowtype;
begin
  if v_clean = '' or v_pwd = '' then
    return jsonb_build_object('ok', false, 'code', 'MISSING_CREDENTIALS');
  end if;

  if position('@' in v_clean) > 0 then
    select s.* into v_sec
    from public.sovereign_secrets s
    where lower(s.email) = lower(v_clean)
      and left(s.username, 2) <> '__'
    limit 1;

    if found then
      select p.* into v_prof
      from public.sovereign_profiles p
      where lower(p.username) = lower(v_sec.username)
      limit 1;
    end if;
  else
    select p.* into v_prof
    from public.sovereign_profiles p
    where lower(p.username) = lower(v_clean)
      and left(p.username, 2) <> '__'
    limit 1;

    if found then
      select s.* into v_sec
      from public.sovereign_secrets s
      where lower(s.username) = lower(v_prof.username)
      limit 1;
    end if;
  end if;

  if v_prof.id is null then
    return jsonb_build_object('ok', false, 'code', 'NOT_FOUND');
  end if;

  if v_sec.username is not null and v_sec.password_hash <> '' and v_sec.password_hash <> v_pwd then
    return jsonb_build_object('ok', false, 'code', 'INVALID_PASSWORD');
  end if;

  -- Vincula hash caso conta legada ainda estivesse sem senha gravada
  insert into public.sovereign_secrets (username, email, password_hash, is_admin, updated_at)
  values (
    v_prof.username,
    coalesce(v_sec.email, ''),
    v_pwd,
    coalesce(v_sec.is_admin, false) or lower(v_prof.username) = 'tsm81',
    now()
  )
  on conflict (username) do update set
    password_hash = case
      when public.sovereign_secrets.password_hash = '' then excluded.password_hash
      else public.sovereign_secrets.password_hash
    end,
    is_admin = public.sovereign_secrets.is_admin or lower(v_prof.username) = 'tsm81',
    updated_at = now()
  returning * into v_sec;

  return jsonb_build_object(
    'ok', true,
    'row', to_jsonb(v_prof),
    'email', v_sec.email,
    'is_admin', v_sec.is_admin
  );
end;
$$;

-- ============================================================================
-- RPC 2: Recuperação e Redefinição de Senha (Nickname + E-mail Cadastrado)
-- ============================================================================
create or replace function public.rpc_recover_password(
  p_username text,
  p_email text,
  p_new_password_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user text := btrim(coalesce(p_username, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_new_pwd text := btrim(coalesce(p_new_password_hash, ''));
  v_prof public.sovereign_profiles%rowtype;
  v_sec public.sovereign_secrets%rowtype;
begin
  if v_user = '' or v_email = '' or v_new_pwd = '' then
    return jsonb_build_object('ok', false, 'code', 'INVALID_INPUT');
  end if;

  select * into v_prof
  from public.sovereign_profiles
  where lower(username) = lower(v_user)
    and left(username, 2) <> '__'
  limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'code', 'NOT_FOUND');
  end if;

  select * into v_sec
  from public.sovereign_secrets
  where lower(username) = lower(v_prof.username)
  limit 1;

  if found and v_sec.email <> '' and lower(v_sec.email) <> v_email then
    return jsonb_build_object('ok', false, 'code', 'EMAIL_MISMATCH');
  end if;

  insert into public.sovereign_secrets (username, email, password_hash, is_admin, updated_at)
  values (
    v_prof.username,
    v_email,
    v_new_pwd,
    coalesce(v_sec.is_admin, false) or lower(v_prof.username) = 'tsm81',
    now()
  )
  on conflict (username) do update set
    email = case when public.sovereign_secrets.email = '' then excluded.email else public.sovereign_secrets.email end,
    password_hash = excluded.password_hash,
    updated_at = now()
  returning * into v_sec;

  return jsonb_build_object(
    'ok', true,
    'row', to_jsonb(v_prof),
    'email', v_sec.email,
    'is_admin', v_sec.is_admin
  );
end;
$$;

-- ============================================================================
-- RPC 3: Sincronização Autenticada de Perfil com Guardas Anti-Cheat (Elo/Ouro)
-- ============================================================================
create or replace function public.rpc_sync_sovereign_profile(
  p_username text,
  p_password_hash text,
  p_email text,
  p_title_json text,
  p_avatar_card_id text,
  p_elo_rating integer,
  p_pvp_wins integer,
  p_pvp_losses integer,
  p_gold integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user text := btrim(coalesce(p_username, ''));
  v_pwd text := btrim(coalesce(p_password_hash, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_existing public.sovereign_profiles%rowtype;
  v_sec public.sovereign_secrets%rowtype;
  v_meta jsonb;
  v_is_admin boolean := false;
  v_clamped_elo integer;
  v_clamped_gold integer;
  v_clamped_wins integer;
  v_clamped_losses integer;
  v_sanitized_title text;
begin
  if v_user = '' or length(v_user) > 40 or left(v_user, 2) = '__' then
    return jsonb_build_object('ok', false, 'code', 'INVALID_USERNAME');
  end if;

  if octet_length(coalesce(p_title_json, '')) > 393216 then
    return jsonb_build_object('ok', false, 'code', 'PAYLOAD_TOO_LARGE');
  end if;

  select * into v_existing
  from public.sovereign_profiles
  where lower(username) = lower(v_user)
  limit 1;

  if found then
    v_user := v_existing.username;
    select * into v_sec
    from public.sovereign_secrets
    where lower(username) = lower(v_user)
    limit 1;

    if found and v_sec.password_hash <> '' then
      if v_pwd = '' or v_sec.password_hash <> v_pwd then
        return jsonb_build_object('ok', false, 'code', 'UNAUTHORIZED');
      end if;
    end if;

    v_is_admin := coalesce(v_sec.is_admin, false) or lower(v_user) = 'tsm81';

    if v_is_admin then
      v_clamped_elo := greatest(100, least(3500, coalesce(p_elo_rating, v_existing.elo_rating)));
      v_clamped_gold := greatest(0, least(9999999, coalesce(p_gold, v_existing.gold)));
      v_clamped_wins := greatest(0, coalesce(p_pvp_wins, v_existing.pvp_wins));
      v_clamped_losses := greatest(0, coalesce(p_pvp_losses, v_existing.pvp_losses));
    else
      -- Guardas anti-cheat por sincronização (rejeita saltos impossíveis de Elo/Ouro via DevTools)
      v_clamped_elo := case
        when p_elo_rating is null then v_existing.elo_rating
        when p_elo_rating > v_existing.elo_rating + 150 then v_existing.elo_rating
        else greatest(100, least(3200, p_elo_rating))
      end;
      v_clamped_gold := case
        when p_gold is null then v_existing.gold
        when p_gold > v_existing.gold + 8000 then v_existing.gold
        else greatest(0, least(2000000, p_gold))
      end;
      v_clamped_wins := case
        when p_pvp_wins is null then v_existing.pvp_wins
        when p_pvp_wins > v_existing.pvp_wins + 15 then v_existing.pvp_wins
        else greatest(0, p_pvp_wins)
      end;
      v_clamped_losses := greatest(
        0,
        coalesce(p_pvp_losses, v_existing.pvp_losses)
      );
    end if;
  else
    -- Criação de nova conta: exige hash de senha e aplica tetos iniciais canônicos
    if v_pwd = '' then
      return jsonb_build_object('ok', false, 'code', 'PASSWORD_REQUIRED');
    end if;
    v_is_admin := (lower(v_user) = 'tsm81');
    if v_is_admin then
      v_clamped_elo := greatest(100, least(3500, coalesce(p_elo_rating, 1000)));
      v_clamped_gold := greatest(0, least(9999999, coalesce(p_gold, 500)));
      v_clamped_wins := greatest(0, coalesce(p_pvp_wins, 0));
      v_clamped_losses := greatest(0, coalesce(p_pvp_losses, 0));
    else
      v_clamped_elo := greatest(800, least(1350, coalesce(p_elo_rating, 1000)));
      v_clamped_gold := greatest(0, least(2500, coalesce(p_gold, 500)));
      v_clamped_wins := greatest(0, least(5, coalesce(p_pvp_wins, 0)));
      v_clamped_losses := greatest(0, least(5, coalesce(p_pvp_losses, 0)));
    end if;
  end if;

  -- Atualiza cofre privado de credenciais
  insert into public.sovereign_secrets (username, email, password_hash, is_admin, updated_at)
  values (v_user, v_email, v_pwd, v_is_admin, now())
  on conflict (username) do update set
    email = case when excluded.email <> '' then excluded.email else public.sovereign_secrets.email end,
    password_hash = case when excluded.password_hash <> '' then excluded.password_hash else public.sovereign_secrets.password_hash end,
    is_admin = public.sovereign_secrets.is_admin or excluded.is_admin,
    updated_at = now();

  -- Remove campos sensíveis ('e', 'p') do JSON público e sincroniza 'g' e 'adm' validados pelo servidor
  v_meta := public.try_parse_jsonb(p_title_json);
  if v_meta is not null then
    v_meta := (v_meta - 'e' - 'p')
      || jsonb_build_object('g', v_clamped_gold, 'adm', v_is_admin);
    v_sanitized_title := v_meta::text;
  else
    v_sanitized_title := coalesce(nullif(btrim(p_title_json), ''), 'Soberano Iniciado');
  end if;

  insert into public.sovereign_profiles (
    username, title, avatar_card_id, elo_rating, pvp_wins, pvp_losses, gold, updated_at
  )
  values (
    v_user,
    v_sanitized_title,
    coalesce(nullif(btrim(p_avatar_card_id), ''), 'neutral_10_valkyra_pentacromatica'),
    v_clamped_elo,
    v_clamped_wins,
    v_clamped_losses,
    v_clamped_gold,
    now()
  )
  on conflict (username) do update set
    title = excluded.title,
    avatar_card_id = excluded.avatar_card_id,
    elo_rating = excluded.elo_rating,
    pvp_wins = excluded.pvp_wins,
    pvp_losses = excluded.pvp_losses,
    gold = excluded.gold,
    updated_at = now();

  return jsonb_build_object(
    'ok', true,
    'elo_rating', v_clamped_elo,
    'gold', v_clamped_gold
  );
end;
$$;

-- ============================================================================
-- RPC 4: Exclusão Autenticada da Própria Conta pelo Titular
-- ============================================================================
create or replace function public.rpc_delete_own_account(
  p_username text,
  p_password_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sec public.sovereign_secrets%rowtype;
begin
  if coalesce(btrim(p_username), '') = '' or coalesce(btrim(p_password_hash), '') = '' then
    return jsonb_build_object('ok', false, 'code', 'UNAUTHORIZED');
  end if;

  select * into v_sec
  from public.sovereign_secrets
  where lower(username) = lower(btrim(p_username))
  limit 1;

  if not found or v_sec.password_hash = '' or v_sec.password_hash <> btrim(p_password_hash) then
    return jsonb_build_object('ok', false, 'code', 'UNAUTHORIZED');
  end if;

  delete from public.sovereign_profiles where lower(username) = lower(v_sec.username);
  delete from public.sovereign_secrets where lower(username) = lower(v_sec.username);

  return jsonb_build_object('ok', true);
end;
$$;

-- ============================================================================
-- RPC 5: Gravação Controlada de Registros de Sistema (Torneios, Replays, Telemetria)
-- ============================================================================
create or replace function public.rpc_upsert_system_record(
  p_key text,
  p_payload text,
  p_avatar_card_id text default 'neutral_10_valkyra_pentacromatica',
  p_elo_rating integer default 1000,
  p_pvp_wins integer default 0,
  p_pvp_losses integer default 0,
  p_actor_username text default null,
  p_actor_password_hash text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key text := btrim(coalesce(p_key, ''));
  v_len integer := octet_length(coalesce(p_payload, ''));
  v_entry_suffix text;
  v_entry_user text;
  v_sec public.sovereign_secrets%rowtype;
  v_exists boolean;
begin
  if left(v_key, 2) <> '__' or v_len = 0 or v_len > 655360 then
    return jsonb_build_object('ok', false, 'code', 'REJECTED_KEY_OR_SIZE');
  end if;

  -- 1. Chaves administrativas exclusivas NUNCA podem ser gravadas por esta RPC pública
  if v_key = '__admin_global_announcement__' or starts_with(v_key, '__community_config__:') then
    return jsonb_build_object('ok', false, 'code', 'ADMIN_ONLY_KEY');
  end if;

  -- 2. Definição de Torneio: permite seed inicial automático se ainda não existir;
  --    sobrescrita de torneio existente exige credencial de Administrador!
  if starts_with(v_key, '__tournament_meta__:') then
    select exists(select 1 from public.sovereign_profiles where username = v_key) into v_exists;
    if v_exists and not public.is_verified_sovereign_admin(p_actor_username, p_actor_password_hash) then
      return jsonb_build_object('ok', true, 'skipped', true);
    end if;

  -- 3. Inscrição / Resultado Humano em Torneio (`__tournament_entry__:<tid>:<user>`):
  --    se `<user>` possui senha registrada, exige autenticação do próprio jogador ou Admin!
  elsif starts_with(v_key, '__tournament_entry__:') then
    v_entry_suffix := substring(v_key from length('__tournament_entry__:') + 1);
    v_entry_user := regexp_replace(v_entry_suffix, '^.*:', '');
    if v_entry_user <> '' then
      select * into v_sec
      from public.sovereign_secrets
      where lower(username) = lower(v_entry_user)
      limit 1;

      if found and v_sec.password_hash <> '' then
        if btrim(coalesce(p_actor_password_hash, '')) <> v_sec.password_hash
           and not public.is_verified_sovereign_admin(p_actor_username, p_actor_password_hash) then
          return jsonb_build_object('ok', false, 'code', 'ENTRY_UNAUTHORIZED');
        end if;
      end if;
    end if;

  -- 4. Demais namespaces públicos permitidos com limites estritos de tamanho
  elsif starts_with(v_key, '__telemetry_session__:') then
    if v_len > 49152 then
      return jsonb_build_object('ok', false, 'code', 'TELEMETRY_TOO_LARGE');
    end if;
  elsif starts_with(v_key, '__shared_replay__:')
     or starts_with(v_key, '__tournament_match__:')
     or starts_with(v_key, '__sovereign_live_elo_')
     or v_key = '__discord_herald_log__:global' then
    null; -- Permitido dentro do limite global de 640 KB
  else
    return jsonb_build_object('ok', false, 'code', 'UNKNOWN_NAMESPACE');
  end if;

  insert into public.sovereign_profiles (
    username, title, avatar_card_id, elo_rating, pvp_wins, pvp_losses, gold, updated_at
  )
  values (
    v_key,
    p_payload,
    coalesce(nullif(btrim(p_avatar_card_id), ''), 'neutral_10_valkyra_pentacromatica'),
    coalesce(p_elo_rating, 1000),
    coalesce(p_pvp_wins, 0),
    coalesce(p_pvp_losses, 0),
    0,
    now()
  )
  on conflict (username) do update set
    title = excluded.title,
    avatar_card_id = excluded.avatar_card_id,
    elo_rating = excluded.elo_rating,
    pvp_wins = excluded.pvp_wins,
    pvp_losses = excluded.pvp_losses,
    gold = 0,
    updated_at = now();

  return jsonb_build_object('ok', true);
end;
$$;

-- ============================================================================
-- RPC 6: Operações Exclusivas do Painel Administrativo (Autenticadas)
-- ============================================================================
create or replace function public.rpc_admin_action(
  p_admin_username text,
  p_admin_password_hash text,
  p_action text,
  p_target_username text default null,
  p_payload jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profiles jsonb;
  v_telemetry jsonb;
  v_ann text;
  v_meta jsonb;
  v_target_email text;
  v_target_pwd text;
  v_target_adm boolean;
  v_sanitized_title text;
begin
  if not public.is_verified_sovereign_admin(p_admin_username, p_admin_password_hash) then
    return jsonb_build_object('ok', false, 'code', 'ADMIN_UNAUTHORIZED');
  end if;

  if p_action = 'fetch_dashboard' then
    select coalesce(jsonb_agg(row_data), '[]'::jsonb) into v_profiles
    from (
      select jsonb_build_object(
        'id', p.id,
        'username', p.username,
        'title', p.title,
        'avatar_card_id', p.avatar_card_id,
        'elo_rating', p.elo_rating,
        'pvp_wins', p.pvp_wins,
        'pvp_losses', p.pvp_losses,
        'gold', p.gold,
        'updated_at', p.updated_at,
        'email', coalesce(s.email, ''),
        'is_admin', coalesce(s.is_admin, false)
      ) as row_data
      from public.sovereign_profiles p
      left join lateral (
        select s2.email, s2.is_admin
        from public.sovereign_secrets s2
        where lower(s2.username) = lower(p.username)
        order by (s2.email <> '') desc, s2.updated_at desc
        limit 1
      ) s on true
      where left(p.username, 2) <> '__'
      order by p.updated_at desc
      limit 1000
    ) sub;

    select coalesce(jsonb_agg(jsonb_build_object('username', username, 'title', title, 'updated_at', updated_at)), '[]'::jsonb)
    into v_telemetry
    from (
      select username, title, updated_at
      from public.sovereign_profiles
      where starts_with(username, '__telemetry_session__:')
      order by updated_at desc
      limit 1000
    ) tsub;

    select title into v_ann
    from public.sovereign_profiles
    where username = '__admin_global_announcement__'
    limit 1;

    return jsonb_build_object(
      'ok', true,
      'profiles', v_profiles,
      'telemetry', v_telemetry,
      'announcement_raw', v_ann
    );

  elsif p_action = 'save_profile' then
    if coalesce(btrim(p_target_username), '') = '' or p_payload is null then
      return jsonb_build_object('ok', false, 'code', 'INVALID_TARGET');
    end if;

    v_meta := public.try_parse_jsonb(p_payload->>'title');
    v_target_email := lower(btrim(coalesce(p_payload->>'email', v_meta->>'e', '')));
    v_target_pwd := btrim(coalesce(p_payload->>'password_hash', v_meta->>'p', ''));
    v_target_adm := coalesce((p_payload->>'is_admin')::boolean, (v_meta->>'adm')::boolean, false)
                    or lower(btrim(p_target_username)) = 'tsm81';

    insert into public.sovereign_secrets (username, email, password_hash, is_admin, updated_at)
    values (btrim(p_target_username), v_target_email, v_target_pwd, v_target_adm, now())
    on conflict (username) do update set
      email = case when excluded.email <> '' then excluded.email else public.sovereign_secrets.email end,
      password_hash = case when excluded.password_hash <> '' then excluded.password_hash else public.sovereign_secrets.password_hash end,
      is_admin = excluded.is_admin,
      updated_at = now();

    if v_meta is not null then
      v_sanitized_title := ((v_meta - 'e' - 'p') || jsonb_build_object('adm', v_target_adm))::text;
    else
      v_sanitized_title := coalesce(p_payload->>'title', 'Soberano Iniciado');
    end if;

    insert into public.sovereign_profiles (
      username, title, avatar_card_id, elo_rating, pvp_wins, pvp_losses, gold, updated_at
    )
    values (
      btrim(p_target_username),
      v_sanitized_title,
      coalesce(p_payload->>'avatar_card_id', 'neutral_10_valkyra_pentacromatica'),
      coalesce((p_payload->>'elo_rating')::integer, 1000),
      coalesce((p_payload->>'pvp_wins')::integer, 0),
      coalesce((p_payload->>'pvp_losses')::integer, 0),
      coalesce((p_payload->>'gold')::integer, 0),
      now()
    )
    on conflict (username) do update set
      title = excluded.title,
      avatar_card_id = excluded.avatar_card_id,
      elo_rating = excluded.elo_rating,
      pvp_wins = excluded.pvp_wins,
      pvp_losses = excluded.pvp_losses,
      gold = excluded.gold,
      updated_at = now();

    return jsonb_build_object('ok', true);

  elsif p_action = 'delete_profile' then
    delete from public.sovereign_profiles where lower(username) = lower(btrim(coalesce(p_target_username, '')));
    delete from public.sovereign_secrets where lower(username) = lower(btrim(coalesce(p_target_username, '')));
    return jsonb_build_object('ok', true);

  elsif p_action = 'clear_telemetry' then
    delete from public.sovereign_profiles where starts_with(username, '__telemetry_session__:');
    return jsonb_build_object('ok', true);

  elsif p_action = 'set_announcement' then
    if p_payload is null or p_payload = 'null'::jsonb then
      delete from public.sovereign_profiles where username = '__admin_global_announcement__';
    else
      insert into public.sovereign_profiles (
        username, title, avatar_card_id, elo_rating, pvp_wins, pvp_losses, gold, updated_at
      )
      values (
        '__admin_global_announcement__',
        p_payload::text,
        'neutral_10_valkyra_pentacromatica',
        1000, 0, 0, 0, now()
      )
      on conflict (username) do update set
        title = excluded.title,
        updated_at = now();
    end if;
    return jsonb_build_object('ok', true);

  elsif p_action = 'save_community_config' then
    if p_payload is null then
      return jsonb_build_object('ok', false, 'code', 'EMPTY_CONFIG');
    end if;
    insert into public.sovereign_profiles (
      username, title, avatar_card_id, elo_rating, pvp_wins, pvp_losses, gold, updated_at
    )
    values (
      '__community_config__:global',
      p_payload::text,
      'neutral_10_valkyra_pentacromatica',
      1000, 0, 0, 0, now()
    )
    on conflict (username) do update set
      title = excluded.title,
      updated_at = now();
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'code', 'UNKNOWN_ACTION');
end;
$$;

-- ============================================================================
-- RPC 7: Salas 1v1 Multiplayer com Validação de Participante (Host / Guest)
-- ============================================================================
create or replace function public.rpc_sync_multiplayer_room(
  p_room jsonb,
  p_actor_id text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text := btrim(coalesce(p_room->>'code', ''));
  v_actor text := btrim(coalesce(p_actor_id, p_room->>'lastActorId', p_room->'host'->>'id', ''));
  v_existing public.multiplayer_rooms%rowtype;
begin
  if v_code = '' or length(v_code) > 64 or pg_column_size(p_room) > 393216 then
    return jsonb_build_object('ok', false, 'code', 'INVALID_ROOM');
  end if;

  select * into v_existing
  from public.multiplayer_rooms
  where code = v_code
  limit 1;

  -- Se a sala já existe, somente o Host, o Guest atual ou um desafiante entrando em sala 'waiting' aberta pode alterá-la
  if found then
    if v_actor <> ''
       and v_actor <> v_existing.host_id
       and (v_existing.guest_id is not null and v_actor <> v_existing.guest_id) then
      return jsonb_build_object('ok', false, 'code', 'NOT_PARTICIPANT');
    end if;
  end if;

  insert into public.multiplayer_rooms (
    code, status, is_public_queue,
    host_id, host_name, host_title, host_avatar, host_elo, host_deck_id,
    guest_id, guest_name, guest_title, guest_avatar, guest_elo, guest_deck_id,
    game_state, updated_at
  )
  values (
    v_code,
    coalesce(p_room->>'status', 'waiting'),
    coalesce((p_room->>'isPublicQueue')::boolean, true),
    coalesce(p_room->'host'->>'id', ''),
    coalesce(p_room->'host'->>'username', 'Soberano'),
    coalesce(p_room->'host'->>'title', 'Soberano'),
    coalesce(p_room->'host'->>'avatarCardId', 'neutral_10_valkyra_pentacromatica'),
    coalesce((p_room->'host'->>'eloRating')::integer, 1000),
    coalesce(p_room->'host'->>'deckId', ''),
    nullif(coalesce(p_room->'guest'->>'id', ''), ''),
    p_room->'guest'->>'username',
    p_room->'guest'->>'title',
    p_room->'guest'->>'avatarCardId',
    (p_room->'guest'->>'eloRating')::integer,
    p_room->'guest'->>'deckId',
    p_room,
    now()
  )
  on conflict (code) do update set
    status = excluded.status,
    is_public_queue = excluded.is_public_queue,
    guest_id = excluded.guest_id,
    guest_name = excluded.guest_name,
    guest_title = excluded.guest_title,
    guest_avatar = excluded.guest_avatar,
    guest_elo = excluded.guest_elo,
    guest_deck_id = excluded.guest_deck_id,
    game_state = excluded.game_state,
    updated_at = now();

  return jsonb_build_object('ok', true);
end;
$$;

create or replace function public.rpc_close_multiplayer_room(
  p_code text,
  p_actor_id text default null,
  p_admin_username text default null,
  p_admin_password_hash text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing public.multiplayer_rooms%rowtype;
  v_actor text := btrim(coalesce(p_actor_id, ''));
begin
  select * into v_existing
  from public.multiplayer_rooms
  where code = btrim(coalesce(p_code, ''))
  limit 1;

  if not found then
    return jsonb_build_object('ok', true);
  end if;

  if (v_actor <> '' and (v_actor = v_existing.host_id or v_actor = coalesce(v_existing.guest_id, '')))
     or v_existing.updated_at < (now() - interval '15 minutes')
     or public.is_verified_sovereign_admin(p_admin_username, p_admin_password_hash) then
    delete from public.multiplayer_rooms where code = v_existing.code;
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'code', 'NOT_PARTICIPANT');
end;
$$;

-- Permissões explícitas de execução das RPCs para o cliente Web e GitHub Actions
grant execute on function public.rpc_auth_sovereign(text, text) to anon, authenticated;
grant execute on function public.rpc_recover_password(text, text, text) to anon, authenticated;
grant execute on function public.rpc_sync_sovereign_profile(text, text, text, text, text, integer, integer, integer, integer) to anon, authenticated;
grant execute on function public.rpc_delete_own_account(text, text) to anon, authenticated;
grant execute on function public.rpc_upsert_system_record(text, text, text, integer, integer, integer, text, text) to anon, authenticated;
grant execute on function public.rpc_admin_action(text, text, text, text, jsonb) to anon, authenticated;
grant execute on function public.rpc_sync_multiplayer_room(jsonb, text) to anon, authenticated;
grant execute on function public.rpc_close_multiplayer_room(text, text, text, text) to anon, authenticated;

-- Atualiza o cache de schema do PostgREST imediatamente
notify pgrst, 'reload schema';

commit;
