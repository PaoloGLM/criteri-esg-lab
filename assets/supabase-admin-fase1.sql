-- ============================================================
-- CRITERI ESG — Fase 1: Panell d'administració (v2 — idempotent de veritat)
-- Es pot executar tantes vegades com calgui sense errors.
-- (CREATE POLICY no admet IF NOT EXISTS a Postgres → drop + create)
-- ============================================================

-- 1. Columna is_admin a profiles
alter table public.profiles add column if not exists is_admin boolean default false;

-- 2. Taula error_log (alarmes d'errors del sistema)
create table if not exists public.error_log (
  id uuid primary key default gen_random_uuid(),
  error_id text not null,               -- ex: ADM-REPORTS-001 (l'identificador que veuràs)
  severity text not null default 'error' check (severity in ('info','warning','error','critical')),
  context jsonb,                        -- detalls tècnics (user, ruta, dades)
  resolved boolean default false,
  created_at timestamptz default now()
);

alter table public.error_log enable row level security;

-- 3. Policy: només admins veuen els errors
drop policy if exists "Admins can view error_log" on public.error_log;
create policy "Admins can view error_log" on public.error_log
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 4. Helper: és l'usuari actual admin? (funció security definer, evita recursió RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- 5. Policies d'administració sobre informes
-- (llegir només published ja existeix; això afegeix accés admin total)
drop policy if exists "Admins full access informes" on public.informes;
create policy "Admins full access informes" on public.informes
  for all using (public.is_admin() = true) with check (public.is_admin() = true);

-- 6. Policies d'administració sobre profiles i subscriptions
drop policy if exists "Admins view all profiles" on public.profiles;
create policy "Admins view all profiles" on public.profiles
  for select using (public.is_admin() = true);

drop policy if exists "Admins update subscriptions" on public.subscriptions;
create policy "Admins update subscriptions" on public.subscriptions
  for update using (public.is_admin() = true) with check (public.is_admin() = true);

drop policy if exists "Admins view all subscriptions" on public.subscriptions;
create policy "Admins view all subscriptions" on public.subscriptions
  for select using (public.is_admin() = true);

-- (Les vistes admin_users_view / admin_errors_view s'han eliminat:
--  Supabase executa les vistes amb permisos del propietari i bypassejarien
--  RLS. El panell consulta les taules directes amb aquestes policies.)

-- ============================================================
-- 9. TEU ADMIN: treu els dos guionets de la línia següent i executa-ho tot:
-- ============================================================
-- update public.profiles set is_admin = true where email = 'davidbm.eno@gmail.com';
