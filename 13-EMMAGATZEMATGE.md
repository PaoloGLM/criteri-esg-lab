# 13 — Emmagatzematge de dades

> On es guarden els documents, informes i continguts de Criteri ESG. Arquitectura d'emmagatzematge per fases.

## Sumari executiu

Criteri ESG té **5 tipus de contingut** que s'han d'emmagatzemar en llocs diferents segons el seu ús. La regla general és:

| Tipus de contingut | On s'emmagatzema | Per què |
|--------------------|------------------|---------|
| **Documents vius del projecte** (aquest repo) | GitHub | Versionat + accés des de qualsevol lloc |
| **Codi de la web** | Vercel + GitHub | Hosting web + CI/CD |
| **Informes processats** (PDFs, HTMLs) | Vercel Blob (object storage) | Servits ràpidament a usuaris web |
| **Dades estructurades** (informes, usuaris, subscriptors) | PostgreSQL (Supabase o Neon) | Consultes amb cercador, filtres |
| **Newsletter** | Beehiiv | Plataforma especialitzada amb deliverability |

---

## 1. Tipus de contingut i on va cadascun

### 1.1 Documents vius del projecte

**Contingut:**
- Aquest repositori (12 documents + plantilles)
- Especificacions, decisions, roadmap, anàlisi de competència, fonts d'informes, plantejament legal

**On:** GitHub (`PaoloGLM/criteri-esg-lab`)

**Per què:**
- Versionat automàtic (històric de canvis)
- gratuït
- Jo hi puc fer commits via token
- Tu hi pots accedir des de qualsevol dispositiu

**Cost:** 0€ (pla Free de GitHub)

### 1.2 Codi de la web

**Contingut:**
- `src/` del projecte Next.js (components, pàgines, estils)
- Imatges estàtiques (logo, captures)
- Configuració (next.config, tailwind.config, package.json)

**On:** GitHub (codi) + Vercel (deploy automàtic)

**Per què:**
- GitHub: versionat del codi
- Vercel: hosting + CDN + deploy automàtic cada vegada que es fa push

**Cost:** 0€ (Vercel pla Free fins 100k visites/mes)

### 1.3 Informes processats (PDFs i HTMLs originals)

**Contingut:**
- PDFs dels informes processats (com `Criteri_Informe_Exemple_ESRS.pdf`)
- HTMLs dels informes per visualitzar a la web
- PPTs editables pels subscriptors Ultra
- Podcasts MP3 (quan estiguin disponibles)

**On:** Vercel Blob (object storage)

**Per què:**
- Integració nativa amb Next.js
- Servits via CDN (ràpids a tot el món)
- No compten per al límit de 100k visites de Vercel
- URL pública directa

**Cost estimat:**
- Pla Free: 1 GB emmagatzematge + 10 GB bandwidth/mes
- Pla Pro (quan calgui): 20$/mes per 100 GB + 1 TB bandwidth

**Alternativa si creixem molt:** Cloudflare R2
- 0€ egress (descàrregues gratuïtes)
- 0,015$/mes per GB emmagatzematge
- Molt més barat que S3 quan tens molts fitxers
- Inconvenient: integració una mica més manual amb Next.js

### 1.4 Dades estructurades (informes, usuaris, subscriptors)

**Contingut:**
- Catàleg d'informes (títol, data, institució, tags, cross-references)
- Usuaris registrats (nom, email, sector, interessos)
- Subscriptors Premium/Ultra (estat, data inici, preu pagat)
- Activitat (informes vists, cerques, descàrregues)
- Connexions personalitzades (Ultra)

**On:** PostgreSQL allotjat a Supabase o Neon

**Per què PostgreSQL i no SQLite:**
- SQLite és ok per prototip però no escala bé a múltiples usuaris concurrents
- PostgreSQL suporta `pgvector` (per a la cerca semàntica del bloc 7 cross-reference)
- Tots dos serveis (Supabase i Neon) tenen pla Free generosos

**Comparativa Supabase vs Neon:**

| Criteri | Supabase | Neon |
|---------|----------|------|
| Pla Free | 500 MB DB + 50k usuaris/mes | 0,5 GB emmagatzematge + 1.925 hores compute/mes |
| Auth integrat | ✅ Sí (molt bo) | ❌ No (cal NextAuth extern) |
| Storage d'arxius | ✅ Sí (pot substituir Vercel Blob) | ❌ No |
| API automàtica | ✅ Sí (REST + GraphQL) | ❌ No |
| Branching (dev/prod) | ❌ No | ✅ Sí (molt útil per testing) |
| Migració des de Prisma | Fàcil | Fàcil |

**Recomanació:** **Supabase** perquè ens dona auth + storage + DB en un sol lloc, simplificant molt la infraestructura.

**Cost estimat:**
- Pla Free: 500 MB + 50k usuaris actius/mes (suficient fins ~5.000 subscriptors)
- Pla Pro: 25$/mes per 8 GB + 100k usuaris actius

### 1.5 Newsletter

**Contingut:**
- Edicions de la newsletter (HTML + text pla)
- Llista de subscriptors
- Mètriques (obertures, clics, unsubscribes)

**On:** Beehiiv (decisió presa el 29 juny 2026, veure `07-DECISIONS.md`)

**Cost:**
- 0€ fins 2.500 subscriptors
- 39$/mes (Boost plan) fins 10.000 subscriptors
- 99$/mes (Scale plan) fins 100.000 subscriptors

### 1.6 Backups i arxiu

**Contingut:**
- Còpies de seguretat de la base de dades
- Versions antigues d'informes
- Materials crus (PDFs originals de les fonts institucionals)

**On:** Google Drive (manual) o Cloudflare R2 (automàtic)

**Per què:**
- Google Drive: 15 GB gratuïts, fàcil de compartir, accés humà
- Cloudflare R2: automatitzable via API, més escalable

**Cost:**
- Google Drive: 0€ (15 GB free)
- Cloudflare R2: ~0,02€/mes per GB (gratis fins a 10 GB)

---

## 2. Arquitectura visual

```
┌─────────────────────────────────────────────────────────┐
│                     USUARI                              │
│                  (web criteriesg.com)                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Vercel (Next.js)   │  → Hosting web + CDN
              │  + Vercel Blob      │  → PDFs, HTMLs informes
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Supabase          │  → PostgreSQL (dades)
              │   - Usuaris         │  → Auth
              │   - Informes        │  → Storage backup
              │   - Subscriptors    │
              │   - pgvector        │  → Cerca semàntica
              └──────────┬──────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │   Beehiiv           │  → Newsletter
              │   - Subscriptors    │
              │   - Edicions        │
              └─────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              GitHub (criteri-esg-lab)                   │
│  → Documents vius del projecte + codi font              │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Fases d'implementació

### Fase 1 — Validació (juliol-setembre 2026)
**Què s'emmagatzema on:**
- Documents del projecte: GitHub ✅ (ja fet)
- Codi web: Vercel ✅ (ja en marxa)
- 1r informe pilot (ESRS): Vercel Blob o directament al repo
- Subscriptors newsletter: Beehiiv (gratis fins 2.500)
- Dades d'usuaris: encara no cal (no hi ha registre real)

**Cost total fase 1:** 0€/mes

### Fase 2 — Llançament Premium (octubre 2026 - gener 2027)
**Què s'afegeix:**
- Base de dades Supabase per gestionar usuaris registrats + subscriptors Premium
- Vercel Blob per als PDFs dels informes (accedint via web)
- Integració Stripe per pagaments
- Auth amb NextAuth + Supabase Auth

**Cost estimat fase 2:** ~25€/mes (Supabase Pro si cal)

### Fase 3 — Escalada (2027)
**Què s'afegeix:**
- Migració a Cloudflare R2 si Vercel Blob es queda curt
- Bloom filters per a cerques ràpides
- Còpia de seguretat automàtica diària a Cloudflare R2
- CDN propi si el tràfic és alt

**Cost estimat fase 3:** ~50-100€/mes

---

## 4. Política de privacitat i dades personals (RGPD)

### 4.1 Quines dades personals guardem

| Dada | On | Finalitat | Base jurídica |
|------|-----|-----------|----------------|
| Nom i cognoms | Supabase | Identificació subscriptor | Consentiment |
| Email | Supabase + Beehiiv | Comunicació | Contracte / Consentiment |
| Empresa | Supabase | Personalització | Consentiment |
| Sector professional | Supabase | Personalització | Consentiment |
| Interessos ESG | Supabase | Personalització | Consentiment |
| IP | Supabase (logs) | Seguretat | Interès legítim |
| Pagaments | Stripe | Gestió subscripció | Contracte |

### 4.2 On s'emmagatzemen físicament

- **Supabase:** servidors a Frankfurt (Alemanya) — dins UE ✅
- **Vercel:** servidors globals (CDN), dades a EU per defecte ✅
- **Beehiiv:** servidors als EUA ⚠️ (cal clàusula contractual tipus RGPD)
- **Stripe:** servidors a UE per a clients europeus ✅
- **GitHub:** servidors als EUA ⚠️ (cal clàusula contractual tipus RGPD)

### 4.3 Conservació

| Tipus de dada | Període de conservació |
|---------------|------------------------|
| Subscriptors actius | Mentre duri la subscripció |
| Subscriptors cancel·lats | 30 dies + anonimització |
| Logs d'activitat | 90 dies |
| Pagaments | 10 anys (obligació legal) |
| Informes publicats | Permanent (són públics) |

### 4.4 Drets dels usuaris (RGPD)

- Accés: pot veure totes les seves dades
- Rectificació: pot corregir dades incorrectes
- Supressió: pot demanar eliminació completa
- Portabilitat: pot exportar les seves dades en format JSON
- Oposició: pot oposar-se al tractament
- Limitació: pot demanar limitació del tractament

**Implementació:** Tots aquests drets s'implementen via un panell d'usuari a la web (`/compte`) i via email a privacitat@criteriesg.com.

---

## 5. Backup i recuperació

### 5.1 Estratègia 3-2-1

- **3 còpies** de cada dada
- **2 mitjans diferents** (cloud + local)
- **1 còpia fora de línia**

### 5.2 Implementació per a cada servei

| Servei | Backup automàtic | Backup manual |
|--------|------------------|---------------|
| **GitHub** | Sí (git history) | Clone local setmanal |
| **Vercel Blob** | No | Sync setmanal a Cloudflare R2 |
| **Supabase** | Sí (diari, 7 dies retenció) | Export SQL mensual a Google Drive |
| **Beehiiv** | Sí (al seu cloud) | Export CSV mensual de subscriptors |
| **Stripe** | Sí (al seu cloud) | — |

### 5.3 Pla de recuperació (DRP)

| Escenari | Temps de recuperació | Procediment |
|----------|----------------------|-------------|
| Pèrdua GitHub | 1h | Restore des de clone local |
| Pèrdua Vercel | 30 min | Redeploy des de GitHub |
| Pèrdua Supabase | 4h | Restore backup diari |
| Pèrdua Beehiiv | 24h | Reimportar CSV subscriptors a alternativa |
| Pèrdua total | 24h | Reconstruir des de backups |

---

## 6. Costos consolidats per fase

### Fase 1 (juliol-setembre 2026)
| Servei | Cost mensual |
|--------|--------------|
| GitHub | 0€ |
| Vercel (Free) | 0€ |
| Vercel Blob (Free) | 0€ |
| Beehiiv (Free fins 2.500) | 0€ |
| Google Drive (backup) | 0€ |
| **Total fase 1** | **0€** |

### Fase 2 (octubre 2026 - gener 2027)
| Servei | Cost mensual |
|--------|--------------|
| GitHub | 0€ |
| Vercel (Free) | 0€ |
| Vercel Blob (Free o 20$ Pro) | 0-20€ |
| Supabase (Free o 25$ Pro) | 0-25€ |
| Beehiiv (Free fins 2.500) | 0€ |
| Stripe (per transacció) | ~1,5% + 0,25€ per cobrament |
| **Total fase 2** | **0-45€/mes** |

### Fase 3 (2027)
| Servei | Cost mensual |
|--------|--------------|
| GitHub | 0€ |
| Vercel Pro | 20€ |
| Cloudflare R2 (100 GB) | ~1,5€ |
| Supabase Pro | 25€ |
| Beehiiv (Boost fins 10k subs) | 35€ |
| Resend (emails transaccionals) | 0-20€ |
| **Total fase 3** | **~80-100€/mes** |

---

## 7. Accessos i permisos

### 7.1 Qui té accés a què

| Servei | Paolo | Z.ai-bot | Futur col·laborador |
|--------|-------|----------|---------------------|
| **GitHub** | Admin | Token fine-grained (write contents) | Per invitar |
| **Vercel** | Owner | Sense accés directe | Per invitar |
| **Supabase** | Owner | Service role key (quan calgui) | Per invitar |
| **Beehiiv** | Owner | API key (quan es tingui) | Per invitar |
| **Stripe** | Owner | Sense accés directe | Per invitar |

### 7.2 Gestió de credencials

- Tokens i API keys **NO** es guarden al repositori GitHub
- Es guarden a:
  - Fitxer local `/home/z/my-project/.criteri-*` (jo ho faig servir)
  - Variables d'entorn de Vercel (per a la web)
  - Supabase Vault (per a credencials sensibles)

---

## 8. Migracions previstes

### Migració 1: SQLite → PostgreSQL (Supabase)
- **Quan:** Pas de Fase 1 a Fase 2 (setembre 2026)
- **Per què:** SQLite només serveix per prototip; necessitem PostgreSQL per producció
- **Com:** Prisma migrate + exportació de dades + importació a Supabase

### Migració 2: Vercel Blob → Cloudflare R2
- **Quan:** Fase 3, quan tinguem >50 GB d'informes
- **Per què:** R2 és molt més barat per volum gran (0€ egress vs Vercel)
- **Com:** Script de migració que copia els fitxers + actualitza URLs

### Migració 3: Beehiiv → Resend (opcional)
- **Quan:** Fase 3, si volem control total i automatització
- **Per què:** Resend permet enviament via API (Beehiiv no al pla Free)
- **Com:** Export CSV subscriptors + import a Resend + recrear plantilles

---

## 9. Consideracions específiques per a Criteri ESG

### 9.1 Informes processats — duplicats intencionats

Cada informe es guarda en **3 formats** per a 3 propòsits:
1. **HTML** (a la web, per a lector online) → Vercel Blob
2. **PDF** (per a descàrrega) → Vercel Blob
3. **PPT editable** (Ultra, per descarregar i editar) → Vercel Blob amb URL signada (caduca en 24h)

### 9.2 Newsletter — arxiu públic

Cada newsletter es publica a:
1. Beehiiv (enviada per email)
2. Web `/newsletter/{slug}` (arxiu públic per a SEO)
3. Supabase (metadades per a indexació)

### 9.3 Audio podcasts (Ultra)

Quan estiguin disponibles:
- **Emmagatzematge:** Vercel Blob (gratis fins 1 GB, llavors R2)
- **Servits via:** CDN amb URL signada (només accessibles per Ultra)
- **Mida típica:** 4-8 MB per MP3 de 5 minuts

### 9.4 Base de dades vectorial per cross-reference

El bloc 7 (cross-reference) requereix una base de dades vectorial per trobar connexions semàntiques entre informes.

**Implementació:**
- `pgvector` (extensió de PostgreSQL) a Supabase
- Cada informe es vectoritza amb embeddings de GLM o OpenAI
- Cerca semàntica: "troba informes relacionats amb X"

**Cost:** Inclòs a Supabase (Free fins 500 MB, suficient per ~10.000 informes vectoritzats)

---

## 10. Fonts verificades

- https://vercel.com/docs/storage/vercel-blob — Vercel Blob
- https://supabase.com/pricing — Supabase pricing
- https://neon.tech/pricing — Neon pricing
- https://www.cloudflare.com/products/r2/ — Cloudflare R2
- https://www.beehiiv.com/pricing — Beehiiv pricing
- https://stripe.com/es/pricing — Stripe Espanya
- https://developers.beehiiv.com — Beehiiv API

---

## 11. Resum per a Paolo

**On va cada cosa a partir d'ara:**

| Estàs creant... | On es guarda |
|-----------------|--------------|
| Document estratègic o decisió | GitHub (criteri-esg-lab) |
| Informe processat (PDF) | Vercel Blob (quan tinguem la web en producció) |
| Nou informe a la web | Supabase (catàleg) + Vercel Blob (PDF) |
| Newsletter setmanal | Beehiiv (esborrany via API + tu cliques Send) |
| Nou subscriptor | Beehiiv (newsletter) + Supabase (compte usuari web) |
| Dades de pagament | Stripe (mai a la nostra DB) |
| Backup mensual | Google Drive (manual) |

**Costos any 1:** 0€/mes fins a 100 subscriptors Premium
**Costos any 2:** ~50€/mes fins a 500 subscriptors Premium
**Costos any 3:** ~150€/mes fins a 2.000 subscriptors Premium

---

## Històric de canvis

- **29 juny 2026** — Versió inicial 1.0. Arquitectura d'emmagatzematge per fases definida. Decisió Supabase + Vercel Blob + Beehiiv + GitHub.
