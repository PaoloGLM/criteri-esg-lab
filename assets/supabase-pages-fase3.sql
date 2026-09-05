-- ============================================
-- CRITERI ESG — Fase 3 CMS: taula pages
-- Executar a Supabase Dashboard → SQL Editor → New Query → Run
-- Mateix patró de seguretat que public.informes:
--   lectura pública de files published, escriptura només service role
-- ============================================

create table if not exists public.pages (
  slug text primary key,                      -- ex: 'qui-som', 'que-fem'
  status text not null default 'published'
    check (status in ('draft', 'published', 'archived')),
  -- Contingut estructurat: { sections: [ {id, type, fields:{...}} ] }
  content_ca jsonb,
  content_es jsonb,
  updated_by uuid,                            -- admin que fa l'últim canvi
  published_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.pages enable row level security;

create policy "Anyone can read published pages"
  on public.pages for select using (status = 'published');

create policy "Service role manages pages"
  on public.pages for all using (auth.role() = 'service_role');

-- ============================================
-- Seed inicial: qui-som (buit = fallback estàtic)
-- El contingut real el mantindrà el panell /admin;
-- mentre un camp estigui buit, la web mostra el contingut
-- estàtic de sempre (mai es trenca res).
-- ============================================
insert into public.pages (slug, status, content_ca, content_es)
values
  ('qui-som', 'published',
   jsonb_build_object('sections', jsonb_build_array()),
   jsonb_build_object('sections', jsonb_build_array()))
on conflict (slug) do nothing;
