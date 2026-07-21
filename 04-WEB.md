# 04 — Web

> Arquitectura, seccions i decisions de disseny de criteriesg.com.

## URL i hosting

- **Domini**: `criteriesg.com` (pendent de registrar)
- **Hosting frontend**: Vercel (gratuït fins a 100k visites)
- **Hosting backend**: Railway o Fly.io (~5-15€/mes)
- **Newsletter**: Beehiiv (gratuït fins a 2.500 subscriptors)

## Stack tècnic

| Component | Tecnologia |
|-----------|-----------|
| Framework | Next.js 16 (App Router) |
| Llenguatge | TypeScript 5 |
| Estils | Tailwind CSS 4 + shadcn/ui |
| Base de dades | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v4 |
| Email | Resend (transaccional) + Beehiiv (newsletter) |
| Pagaments | Stripe |
| LLM | z-ai-web-dev-sdk (GLM) — provider principal, disseny modular per canviar si cal |
| Crawler | Scrapy + BeautifulSoup + Vercel Cron |

## Arquitectura d'automatització (definida 5 juliol 2026)

### Visió general

```
┌─────────────────────────────────────────────────────────────┐
│                     Font institucional                       │
│   (UE, WEF, Forética, Banc d'Espanya, OECD, IPCC, etc.)    │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Crawler automàtic (Vercel Cron, dilluns + dijous matí)     │
│  - Scrapy + BeautifulSoup                                   │
│  - Detecta nous informes via RSS / scraping de pàgines      │
│  - Descarrega PDF → Google Drive /originals/                │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend (Next.js API routes + Supabase)                    │
│  - Rep notificació de PDF nou                               │
│  - Extreu text (PyMuPDF / pdfplumber)                       │
│  - Crida API a Z.ai-bot amb el text del PDF                 │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Z.ai-bot API                                               │
│  - Rep text del PDF                                         │
│  - Genera els 8 blocs (Semàfor + 7 blocs) en JSON           │
│  - Passa corrector LanguageTool automàticament              │
│  - Retorna JSON + log del corrector                         │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend rep JSON                                           │
│  - Aplica plantilla HTML oficial                            │
│  - Genera PDF via Playwright                                │
│  - Guarda a Supabase (taula informes) + Drive (processats/) │
│  - Notifica en Paolo per revisió                            │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Revisió humana (Paolo o Roser)                             │
│  - Revisa els 8 blocs                                       │
│  - Aprova o demana canvis                                   │
│  - Si aprova → publica a la web automàticament              │
└──────────────────────────┬──────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Publicació                                                 │
│  - Web (/informes/[slug])                                   │
│  - Drive (processats/)                                      │
│  - Notificació a subscriptors (si és informe destacat)      │
└─────────────────────────────────────────────────────────────┘
```

### Newsletter (cada 2 setmanes, dijous 15:00h)

```
Dijous 12:00h — Script selecciona els 3-4 millors informes del període
                    ↓
Z.ai-bot API genera HTML del butlletí amb:
  - Notícies ESG (apartat 6, fonts no territorials ES)
  - Inversió ESG (apartat 7, fonts imparcials)
  - 3-4 informes destacats amb connexions
  - (Última setmana del mes) Carta del Director escrita per Paolo
                    ↓
Esborrany a Beehiiv per revisió de Paolo
                    ↓
Paolo aprova → Beehiiv envia a les 15:00h
```

### Edició de contingut (CMS)

La web no es editarà com WordPress, però hi haurà 3 nivells d'edició segons el tipus de contingut:

| Tipus de contingut | Com s'edita | Qui |
|--------------------|-------------|-----|
| **Informes** (els 8 blocs) | Panell de Supabase (taula `informes`) | Paolo o Roser |
| **Pàgines estàtiques** (Sobre nosaltres, FAQ, preus) | Edició via GitHub (markdown al repo) | Roser o Z.ai-bot |
| **Carta del Director** | GitHub (`assets/cartes-director/YYYY-MM.md`) | Paolo |
| **Configuració** (preus, dates, idiomes) | Variables d'entorn + taula `config` a Supabase | Roser |

**Supabase com a CMS per a informes**: en Paolo podrà afegir/editar informes directament des del panell web de Supabase (supabase.com/dashboard), sense tocar codi. La Roser crearà la taula `informes` amb els camps dels 8 blocs i la web Next.js la llegirà via API.

### Principis ètics de l'automatització

1. **Cap informe publicat sense revisió humana**: la Z.ai-bot genera, però en Paolo (o la Roser) revisa abans de publicar. Sempre.
2. **Transparència sobre automatització**: cada informe duu nota al footer indicant que ha estat processat amb assistència d'IA i revisat per l'equip Criteri.
3. **Provider d'IA intercanviable**: l'arquitectura es dissenya modularment per poder canviar de provider (Z.ai, OpenAI, Anthropic) sense haver de refer el backend. Evitem vendor lock-in.
4. **Corrector obligatori**: tot text generat passa pel LanguageTool abans de guardar-se a Supabase. El log es guarda al camp `corrector_log` de l'informe.

## Arquitectura de pàgines (planificada)

### Pàgines públiques
- `/` — Homepage (operativa)
- `/informes` — Biblioteca amb cercador i filtres
- `/informes/[slug]` — Pàgina individual d'informe
- `/certificacions` — Pàgina amb guies per certificació
- `/autodiagnostic` — Eina interactiva
- `/preus` — Pàgina de preus
- `/sobre-nosaltres` — Sobre Criteri ESG
- `/blog` — Articles SEO

### Pàgines privades
- `/login` — Inici de sessió
- `/registre` — Formulari de registre gratuït
- `/compte` — Dashboard de l'usuari
- `/compte/informes` — Informes guardats
- `/compte/alertes` — Alertes personalitzades
- `/compte/connexions` — Connexions personalitzades (Ultra)
- `/compte/dossiers` — Dossiers descarregats (Ultra)

## Homepage — estructura actual

### 12 seccions

1. **Hero** — Claim principal + CTA prova gratuïta + CTA newsletter
2. **4 cards de seccions** — Biblioteca, Certificacions, Autodiagnòstic, Newsletter (visibles a primera vista)
3. **Últim informe publicat** — Card amb preview del darrer informe + CTA "Veure exemple complet"
4. **Speed** — "5 minuts per criteri clar" amb 3 KPIs
5. **Format** — Els 7 blocs explicats (blocs 6 i 7 destacats com a diferenciador)
6. **Diferencials** — "La informació és pública. Però és intractable." amb 3 stats
7. **Help** — Grid de 6 certificacions (EcoVadis, B Corp, MSCI, CDP, GRI, CSRD/ESRS)
8. **Autodiagnòstic** — Exemple d'empresa logística (62/100 → Or en 12 mesos)
9. **Qui som** — Text sobre la motivació del projecte
10. **FAQ** — 5 preguntes clau
11. **Doble CTA final** — Newsletter + Premium trial
12. **Footer** — Branding + links + avís legal

### Header sticky
- Logo "Criteri." + "ESG" mono
- Nav: Informes, Certificacions, Autodiagnòstic, Preus
- Cercador expandible
- Toggle CAT/ES
- Login button

### Bilingüisme CAT/ES
- Toggle al header (persisteix a localStorage)
- Totes les traduccions centralitzades a `src/lib/i18n.ts` (150+ claus)
- Idioma per defecte: català

## Modal 1 — Registre gratuït

Formulari modal amb camps:
- Nom i cognoms (requerit)
- Empresa (opcional)
- Email (requerit)
- Sector professional (select: consultoria, director, compliance, investor, ONG, públic, altres)
- 8 interessos principals (checkboxes: CSRD, EcoVadis, B Corp, MSCI, Taxonomia UE, CSDDD, drets humans, risc climàtic)
- Nota de privacitat
- Pantalla de confirmació amb èxit

## Modal 2 — Exemple d'informe complet

Modal gran amb els 7 blocs de l'informe ESRS de maig 2026:
- Bloc 1: Fitxa tècnica (6 dades)
- Bloc 2: Resum executiu (300 paraules)
- Bloc 3: 5 dades clau amb valors, context i pàgina citada
- Bloc 4: Implicacions (3 blocs: empreses, reguladors, ciutadans)
- Bloc 5: Connexions (3 relacions: evolució, complement, contradicció)
- Bloc 6: Accions recomanades (4 accions amb esforç/impacte) — DESTACAT
- Bloc 7: Cross-reference amb 4 frameworks (EcoVadis, B Corp, MSCI, GRI) — DESTACAT

## Arquitectura de components (Next.js)

```
src/
├── app/
│   ├── layout.tsx              (LanguageProvider + fonts)
│   ├── page.tsx                (Homepage amb 2 modals)
│   └── globals.css             (Paleta + tipografia)
├── components/
│   ├── language-provider.tsx   (Context bilingüe)
│   ├── site-header.tsx         (Header sticky)
│   ├── site-footer.tsx         (Footer)
│   ├── register-dialog.tsx     (Modal registre)
│   ├── report-dialog.tsx       (Modal informe exemple)
│   └── sections/
│       ├── hero.tsx
│       ├── mid-sections.tsx    (7 seccions central)
│       ├── certifications.tsx
│       └── final-cta.tsx
└── lib/
    └── i18n.ts                 (Traduccions CAT/ES)
```

## Captures de pantalla

Disponibles a `/home/z/my-project/download/`:
- `criteri-homepage-full.png` — Homepage completa en català
- `criteri-homepage-ES.png` — Homepage en castellà
- `criteri-homepage-hero.png` — Hero section
- `criteri-register-form.png` — Formulari de registre
- `criteri-report-example.png` — Modal de l'informe (part superior)
- `criteri-report-example-2.png` — Modal de l'informe (part inferior)

## Estat actual

✅ Homepage operativa amb 12 seccions
✅ Modal registre complet
✅ Modal informe exemple complet (ESRS maig 2026)
✅ Bilingüisme CAT/ES
✅ Header sticky amb cercador
✅ Responsive mòbil/desktop
✅ Lint passa net
✅ Verificat amb Agent Browser

⏳ Pendent:
- Pàgina `/informes` amb biblioteca
- Pàgina `/informes/[slug]` amb informe individual
- Pàgina `/certificacions`
- Pàgina `/autodiagnostic` interactiva
- Backend (Prisma + SQLite) per guardar informes reals
- Integració Stripe per pagaments
- Integració NextAuth per login real

## Sistema de registre i comptes d'usuari (definit juliol 2026)

### Tipus d'usuari

| Tipus | Com es registra | Què pot fer | Dades que guardem |
|-------|----------------|-------------|-------------------|
| **Newsletter** | Formulari registre (mateix que Free) | Rep newsletter bimensual | Email, idioma, data alta |
| **Free** | Email + nom (obligatoris), empresa + interessos (opcionals) | Veure informes >6 mesos + newsletter | Email, nom, empresa, interessos, idioma |
| **Premium** | Free + pagament (Stripe o Fiare) | Tot Free + informes recents + cross-ref + accions + Preguntes | Tot Free + dades fiscals + mètode pagament + estat subscripció |
| **Student** (futur) | Registre amb email universitari (.edu, .es) | Accés gratuït a tot (futur) | Mateix que Free + verificació email universitari |
| **B2B** (futur 2027) | Admin convida membres | Premium per a equip (5 usuaris) + API + dashboard | Tot Premium + gestió d'equip |

### Mètodes de login

1. **Magic link** (per defecte — email sense contrasenya, més còmode i segur)
2. **Email + contrasenya** (per als que prefereixin contrasenya)
3. **Google OAuth** (per iniciar sessió amb compte Google)

Tots gestionats per **Supabase Auth**.

### Idioma per defecte

- **Web**: castellà per defecte, català opcional (toggle al header)
- **Newsletter**: castellà per defecte, català opcional (checkbox al registre)
- L'usuari pot canviar l'idioma en qualsevol moment des de la seva compte

### Formulari de registre (mockup a `assets/web/public/registro-mockup.html`)

Camps:
- **Obligatoris**: nom, email
- **Opcionals**: empresa, interessos (10 temes ESG seleccionables)
- **Newsletter**: checkbox marcat per defecte, idioma castellà per defecte amb opció català
- **Selector de pla**: Gratis (per defecte) o Premium (early bird 290€/any)
- **GDPR**: checkbox obligatori d'acceptació de política de privacitat i termes

Flux:
1. Usuari omple formulari
2. Tria pla (Gratis o Premium)
3. Si Premium → després del registre va al formulari de pagament (Stripe o Fiare)
4. Si Gratis → compte creada, email de confirmació

### Pàgina de compte d'usuari (mockup a `assets/web/public/cuenta-mockup.html`)

4 pestanyes:
1. **Suscripción**: estat, mètode pagament, preu, renovació, ús
2. **Mi perfil**: dades editables + interessos + idioma + zona de perill (baixa newsletter + eliminar compte)
3. **Documentos**: taula de rebuts i factures amb descàrrega PDF
4. **Seguridad**: mètodes de login, sessions actives, GDPR (consentiment, exportació de dades)

### Estructura de base de dades (Supabase / PostgreSQL)

Veure detall SQL al document `12-PLANTEJAMENT-LEGAL.md` secció "Estructura de base de dades".

Taules principals:
- `profiles` (extensió d'auth.users): nom, email, empresa, interessos, idioma, tipus d'usuari, GDPR
- `subscriptions`: pla, mètode pagament, estat, dates, Stripe/Fiare
- `documents_fiscals`: rebuts i factures amb PDF
- `newsletter_subscribers`: registres només newsletter
- `report_views`: auditoria d'accés a informes

### Seguretat

- **Row Level Security (RLS)**: cada usuari només veu les seves dades
- **Rate limiting**: 5 intents de login / 15 minuts (Supabase Auth)
- **Encriptació**: TLS 1.3 en trànsit, AES-256 en repòs
- **Backups**: diaris amb 7 dies de retenció (Supabase)
- **Detecció de frau**: `report_views` registra IP + user agent
- **Sense emmagatzematge de dades de targeta**: Stripe gestiona tot el processament (PCI-DSS)

### Cancel·lació de comptes (GDPR)

1. **Cancel·lar Premium**: usuari passa a Free. Manté accés fins que caduqui
2. **Baixa newsletter**: deixa de rebre newsletter però manté compte
3. **Eliminar compte**: soft delete (30 dies per recuperar) → anonimització de dades personals → factures es conserven 6 anys (llei)

---

## Històric de canvis

- **5 juliol 2026** — Definida **arquitectura d'automatització** completa: crawler Vercel Cron + Z.ai-bot API + Supabase com a CMS + revisió humana obligatòria. Provider d'IA modular (no vendor lock-in). Decisió d'integrar API des de l'inici (no semiautomàtic).
- **25 juny 2026** — Homepage operativa amb 12 seccions, 2 modals, bilingüisme CAT/ES. Verificada amb Agent Browser
