-- ============================================================
-- CRITERI ESG — Fase 1: Panell d'administració
-- Executar a: Supabase Dashboard → SQL Editor → New Query → Run
-- Execució segura: tots els passos són idempotents (IF NOT EXISTS)
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

-- 3. Policy: només admins veuen els errors
alter table public.error_log enable row level security;
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
-- (un admin veu tots els perfils per gestionar usuaris)
drop policy if exists "Admins view all profiles" on public.profiles;
create policy "Admins view all profiles" on public.profiles
  for select using (public.is_admin() = true);

drop policy if exists "Admins update plans" on public.subscriptions;
create policy "Admins update subscriptions" on public.subscriptions
  for update using (public.is_admin() = true) with check (public.is_admin() = true);

drop policy if exists "Admins view all subscriptions" on public.subscriptions;
create policy "Admins view all subscriptions" on public.subscriptions
  for select using (public.is_admin() = true);

-- 7. Vista d'usuaris per al panell (perfil + pla actual)
create or replace view public.admin_users_view as
select
  p.id,
  p.email,
  p.full_name,
  p.company,
  p.created_at,
  s.plan,
  s.status,
  s.updated_at as plan_updated_at
from public.profiles p
left join public.subscriptions s on s.user_id = p.id
where p.deleted_at is null;

grant select on public.admin_users_view to authenticated;

-- 8. Vista d'errors no resolts per al panell
create or replace view public.admin_errors_view as
select id, error_id, severity, context, resolved, created_at
from public.error_log
where resolved = false
order by created_at desc;

grant select on public.admin_errors_view to authenticated;

-- ============================================================
-- 9. TEU ADMIN: troba el teu user_id i marca'l com a admin.
-- Canvia l'email si cal i executa:
-- ============================================================
-- update public.profiles set is_admin = true where email = 'davidbm.eno@gmail.com';
