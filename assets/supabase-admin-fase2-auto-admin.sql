-- ============================================================
-- CRITERI ESG — Fase 2: auto-admin per email conegut
-- ============================================================
-- Objectiu: quan un compte autoritzat es registra amb Google,
-- queda marcat com a administrador AUTOMÀTICAMENT (sense haver-ho
-- de fer a mà després). Idempotent: es pot reexecutar sense errors.
--
-- Llista d'admins: davidbm.eno@gmail.com (Paolo) i roserpasgar@gmail.com (Roser).
-- Per afegir-ne un altre, només cal afegir-lo a la llista de sota.
--
-- Com executar-ho: Supabase Dashboard → SQL Editor → New query →
-- enganxar-ho tot → Run. Un sol cop.
-- ============================================================

-- 1. Assegura que la columna is_admin existeix
alter table public.profiles add column if not exists is_admin boolean default false;

-- 2. Reescriptura del trigger handle_new_user: igual que l'original,
--    però afegeix el càlcul automàtic d'is_admin per email conegut.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  _is_admin boolean;
begin
  _is_admin := (new.email in ('davidbm.eno@gmail.com', 'roserpasgar@gmail.com'));

  insert into public.profiles (id, email, full_name, gdpr_consent, gdpr_consent_date, is_admin)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'gdpr_consent')::boolean,
    now(),
    _is_admin
  )
  on conflict (id) do update set
    email = excluded.email,
    is_admin = excluded.is_admin;

  -- Crear subscripció free per defecte
  insert into public.subscriptions (user_id, plan, status, started_at)
  values (new.id, 'free', 'active', now())
  on conflict do nothing;

  -- Si s'ha subscrit a la newsletter, afegir a newsletter_subscribers
  if (new.raw_user_meta_data->>'newsletter_subscribed')::boolean = true then
    insert into public.newsletter_subscribers (email, language, gdpr_consent, gdpr_consent_date)
    values (
      new.email,
      coalesce(new.raw_user_meta_data->>'newsletter_language', 'es'),
      true,
      now()
    )
    on conflict (email) do update set is_active = true, unsubscribed_at = null;
  end if;

  return new;
end;
$$;

-- 3. El trigger que crida la funció (es manté igual)
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Marca com a admin qualsevol compte JA EXISTENT amb aquests emails
--    (per si la Roser ja s'havia registrat abans d'aplicar aquest SQL).
update public.profiles
  set is_admin = true
  where email in ('davidbm.eno@gmail.com', 'roserpasgar@gmail.com');
