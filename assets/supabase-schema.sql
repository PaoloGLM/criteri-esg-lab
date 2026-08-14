
-- ============================================
-- CRITERI ESG — Esquema de base de dades
-- Executar al Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Taula profiles (extensió d'auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  company text,
  nif_cif text,
  phone text,
  preferred_language text default 'es' check (preferred_language in ('ca', 'es')),
  sector text,
  interests text[] default '{}',
  user_type text default 'standard' check (user_type in ('standard', 'student', 'b2b_admin', 'b2b_member')),
  newsletter_subscribed boolean default true,
  newsletter_language text default 'es' check (newsletter_language in ('ca', 'es')),
  gdpr_consent boolean default false,
  gdpr_consent_date timestamptz,
  marketing_consent boolean default false,
  marketing_consent_date timestamptz,
  is_active boolean default true,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Taula subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  plan text not null default 'free' check (plan in ('free', 'premium', 'ultra')),
  payment_method text check (payment_method in ('stripe', 'fiare')),
  billing_period text check (billing_period in ('monthly', 'annual')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired', 'pending', 'suspended')),
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  cancelled_at timestamptz,
  amount_paid numeric(10,2),
  payment_currency text default 'EUR',
  stripe_customer_id text,
  stripe_subscription_id text,
  fiare_proof_url text,
  fiare_validated boolean default false,
  fiscal_document_id uuid,
  is_early_bird boolean default false,
  early_bird_number integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Taula documents_fiscals
create table if not exists public.documents_fiscals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  subscription_id uuid references public.subscriptions on delete set null,
  type text not null check (type in ('receipt', 'invoice', 'credit_note')),
  document_number text not null unique,
  issue_date timestamptz not null default now(),
  amount numeric(10,2) not null,
  vat_amount numeric(10,2),
  currency text default 'EUR',
  client_name text not null,
  client_nif text not null,
  client_address text,
  client_postal_code text,
  concept text not null,
  period_start date,
  period_end date,
  payment_method text check (payment_method in ('stripe', 'fiare')),
  pdf_path text not null,
  related_document_id uuid,
  created_at timestamptz default now()
);

-- 4. Taula newsletter_subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  language text default 'es' check (language in ('ca', 'es')),
  source text default 'web',
  is_active boolean default true,
  unsubscribed_at timestamptz,
  gdpr_consent boolean default false,
  gdpr_consent_date timestamptz,
  created_at timestamptz default now()
);

-- 5. Taula report_views (auditoria)
create table if not exists public.report_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete set null,
  report_slug text not null,
  viewed_at timestamptz default now(),
  ip_address inet,
  user_agent text
);

-- 6. Taula informes (publicació del pipeline — pas 7)
-- Cada informe publicat: metadades + contingut dels 8 blocs en CA i ES
create table if not exists public.informes (
  slug text primary key,
  title text not null,
  institution text not null,
  date text not null,
  pages integer default 0,
  type text default 'official' check (type in ('regulatory', 'framework', 'rating', 'industry', 'official')),
  scope text default 'EU' check (scope in ('CAT', 'ES', 'EU', 'GLOBAL')),
  tags text[] default '{}',
  certifications text[] default '{}',
  summary text,
  url text,
  content_ca jsonb,
  content_es jsonb,
  status text not null default 'published' check (status in ('draft', 'validated', 'published', 'archived')),
  published_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activar RLS a totes les taules
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.documents_fiscals enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.report_views enable row level security;

-- Profiles: cada usuari veu/edita només el seu perfil
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Subscriptions: cada usuari veu només les seves
create policy "Users can view own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Documents: cada usuari veu només els seus
create policy "Users can view own documents" on public.documents_fiscals
  for select using (auth.uid() = user_id);

-- Newsletter: qualsevol pot subscriure's (insert), però només veu el seu
create policy "Anyone can subscribe to newsletter" on public.newsletter_subscribers
  for insert with check (true);
create policy "Users can view own newsletter subscription" on public.newsletter_subscribers
  for select using (email = (select email from public.profiles where id = auth.uid()));

-- Report views: cada usuari veu només els seus
create policy "Users can view own report views" on public.report_views
  for select using (auth.uid() = user_id);
create policy "Users can insert own report views" on public.report_views
  for insert with check (auth.uid() = user_id);

-- Informes: lectura pública (els informes publicats són de domini públic),
-- escriptura/edició només via service role (scripts del pas 7)
alter table public.informes enable row level security;
create policy "Anyone can read published informes" on public.informes
  for select using (status = 'published');
create policy "Service role manages informes" on public.informes
  for all using (auth.role() = 'service_role');

-- ============================================
-- TRIGGER: crear perfil automàticament al registre
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, gdpr_consent, gdpr_consent_date)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'gdpr_consent')::boolean,
    now()
  );
  
  -- Crear subscripció free per defecte
  insert into public.subscriptions (user_id, plan, status, started_at)
  values (new.id, 'free', 'active', now());
  
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

-- Trigger que s'executa quan es crea un nou usuari
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();



--- SQL generat correctament ---
Copia aquest SQL i executa'l a:
Supabase Dashboard → SQL Editor → New Query → Pegar → Run
