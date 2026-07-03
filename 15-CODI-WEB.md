# 15 — Codi web (manual de reconstrucció)

> **Document crític.** Conté tot el codi de la web Criteri ESG salvat al directori `assets/web/`. Si l'entorn de desenvolupament es reseteja, aquest document permet reconstruir la web en 15 minuts.
>
> **Data última actualització:** 29 juny 2026
> **Estat:** Codi de la web v2 reconstruïda + biblioteca d'informes amb 10 informes reals

---

## Com reconstruir la web si es perd l'entorn

### Pas 1 — Inicialitzar projecte Next.js

```bash
curl -s https://z-cdn.chatglm.cn/fullstack/init-fullstack.sh | bash
```

Espera que el dev server arranqui (veuràs `Initialization completed successfully`).

### Pas 2 — Copiar els fitxers del GitHub al projecte

Des del directori del repositori clonat, copia els fitxers a `/home/z/my-project/src/`:

```bash
# Copia el codi font
cp -r assets/web/src/* /home/z/my-project/src/

# Verifica
ls /home/z/my-project/src/app/
# Ha de mostrar: globals.css  layout.tsx  page.tsx

ls /home/z/my-project/src/components/
# Ha de mostrar: language-provider.tsx  register-dialog.tsx  report-dialog.tsx  site-footer.tsx  site-header.tsx  sections/  ui/

ls /home/z/my-project/src/components/sections/
# Ha de mostrar: certifications.tsx  final-cta.tsx  hero.tsx  mid-sections.tsx  reports-library.tsx

ls /home/z/my-project/src/lib/
# Ha de mostrar: i18n.ts  reports.ts
```

### Pas 3 — Verificar

Espera 5 segons i comprova el log de desenvolupament:

```bash
tail -20 /home/z/my-project/dev.log
# Ha de mostrar: GET / 200
```

Obre http://localhost:3000 i verifica:
- Hero amb "El teu criteri per decidir bé."
- Toggle CAT/ES funciona
- Biblioteca d'informes amb 10 cards
- Clic en un informe obre modal amb 7 blocs

---

## Estructura de fitxers

```
src/
├── app/
│   ├── layout.tsx              # Layout root + fonts Fraunces/Inter/JetBrains + LanguageProvider
│   ├── globals.css             # Paleta terra+coure + tipografia + brand utilities
│   └── page.tsx                # Homepage principal (uneix totes les seccions)
├── components/
│   ├── language-provider.tsx   # Context React per idioma CAT/ES (lazy init localStorage)
│   ├── site-header.tsx         # Header sticky + nav + cercador + toggle idioma + login
│   ├── site-footer.tsx         # Footer amb branding + 3 columnes + legal
│   ├── register-dialog.tsx     # Modal de registre (nom, empresa, email, sector, interessos)
│   ├── report-dialog.tsx       # Modal amb 7 blocs de l'informe (clicable des de biblioteca)
│   ├── ui/                     # Components shadcn/ui (ja vénen amb el template)
│   └── sections/
│       ├── hero.tsx            # Hero + 4 cards seccions + últim informe destacat
│       ├── mid-sections.tsx    # Speed + Format 7 blocs + Autodiagnòstic + FAQ
│       ├── certifications.tsx  # Grid 6 certificacions (EcoVadis, B Corp, MSCI, CDP, GRI, CSRD)
│       ├── reports-library.tsx # Biblioteca amb 10 informes + cerca + 3 filtres
│       └── final-cta.tsx       # Doble CTA (newsletter + premium)
├── lib/
│   ├── i18n.ts                 # Traduccions CAT/ES (80+ claus)
│   └── reports.ts              # Catàleg amb 10 informes reals de 2026 + helpers
└── hooks/
    ├── use-mobile.ts           # Hook responsive (ja ve amb template)
    └── use-toast.ts            # Hook notificacions (ja ve amb template)
```

---

## Paleta de colors (CSS variables a `globals.css`)

```css
--background: #F5EFE6;       /* Terra clara (fons) */
--foreground: #2C1810;       /* Marró fosc (text principal) */
--card: #FFFFFF;             /* Blanc (targetes) */
--primary: #2C1810;          /* Marró fosc (botons primaris) */
--secondary: #EFE7DA;        /* Terra suau (targetes secundàries) */
--accent: #B87333;           /* Coure (accent principal) */
--accent-foreground: #FFFFFF;/* Blanc sobre coure */
--accent-soft: #D9A574;      /* Coure suau */
--accent-deep: #8A5526;      /* Coure fosc */
--bg-deep: #E8DDC9;          /* Terra més profunda */
--rule: #C9B89A;             /* Sorra (línies i separadors) */
--muted-foreground: #8B7355; /* Marró gris (text secundari) */
--border: #C9B89A;           /* Sorra (borders) */
--ring: #B87333;             /* Coure (focus ring) */
```

## Tipografia

Definida al `layout.tsx` amb `next/font/google`:

- **Fraunces** (serif) — Titulars, noms de marca, noms d'informes
  - Pesos: 300, 400, 500, 600, 700 (normal + italic)
  - Variable CSS: `--font-fraunces`
- **Inter** (sans-serif) — Cos de text, descripcions, butons
  - Pesos: 300, 400, 500, 600, 700
  - Variable CSS: `--font-inter`
- **JetBrains Mono** (monospace) — Dades, etiquetes, números de pàgina
  - Pesos: 400, 500, 600
  - Variable CSS: `--font-jetbrains`

Aplicada via CSS:
```css
body { font-family: var(--font-inter), system-ui, sans-serif; }
h1, h2, h3, h4, h5, h6, .font-serif { font-family: var(--font-fraunces), Georgia, serif; }
.font-mono { font-family: var(--font-jetbrains), 'Courier New', monospace; }
```

## Brand utilities (a `globals.css`)

```css
.eyebrow {
  font-family: var(--font-inter), sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-deep);
}

.rule-accent {
  height: 2px;
  background: var(--accent);
  border: none;
  width: 48px;
}

.rule {
  height: 1px;
  background: var(--rule);
  border: none;
  width: 100%;
}

.editorial-link {
  position: relative;
  transition: color 0.2s ease;
}
.editorial-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--accent);
  transition: width 0.2s ease;
}
.editorial-link:hover::after {
  width: 100%;
}
```

---

## Catàleg d'informes (`src/lib/reports.ts`)

10 informes reals publicats al 2026, verificats amb URLs originals:

| # | Slug | Títol | Institució | Data | Pàg | Tipus | Scope | Frameworks |
|---|------|-------|------------|------|-----|-------|-------|------------|
| 1 | revisio-esrs-maig-2026 | Revisió dels ESRS: simplificació del CSRD | Comissió Europea (DG FISMA) | 2026-05-06 | 47 | regulatory | EU | EcoVadis, B Corp, MSCI ESG, GRI |
| 2 | ecb-climate-risk-2026 | Climate risk stress test: EU banking system | Banc Central Europeu (BCE) | 2026-05-22 | 62 | official | EU | MSCI ESG, TCFD |
| 3 | efrag-work-programme-2026 | EFRAG Sustainability Reporting Work Programme 2026 | EFRAG | 2026-02-12 | 38 | framework | EU | GRI, CSRD |
| 4 | ecovadis-methodology-q1-2026 | EcoVadis Methodology Updates Q1 2026 | EcoVadis | 2026-04-15 | 28 | rating | GLOBAL | EcoVadis |
| 5 | tnfd-status-report-2026 | TNFD 2026 Status Report | TNFD | 2026-06-10 | 54 | framework | GLOBAL | TNFD, GRI, ISSB |
| 6 | bcorp-new-standards-2026 | B Lab Standards V2.1: nova era per a B Corps | B Lab Global | 2026-01-15 | 41 | framework | GLOBAL | B Corp |
| 7 | csddd-omnibus-març-2026 | CSDDD: modificacions Omnibus I definitives | Comissió Europea (DG JUST) | 2026-03-18 | 35 | regulatory | EU | CSDDD, UN Global Compact |
| 8 | iea-global-energy-review-2026 | Global Energy Review 2026 | International Energy Agency (IEA) | 2026-03-15 | 78 | industry | GLOBAL | CDP, TCFD |
| 9 | eu-taxonomy-delegated-act-2026 | EU Taxonomy: Delegated Act de simplificació | Comissió Europea (DG FISMA) | 2026-01-28 | 32 | regulatory | EU | SFDR, CSRD |
| 10 | europe-sustainable-development-2026 | Europe Sustainable Development Report 2026 | SDSN | 2026-04-22 | 95 | official | EU | UN Global Compact, SDG Compass |

### Helpers al `reports.ts`

- `getScopeLabel(scope)` — Retorna "Catalunya" / "Espanya" / "Europa" / "Global"
- `getTypeLabel(type)` — Retorna "Regulador" / "Framework" / etc.
- `formatDate(isoDate, lang)` — Formata data en català o castellà
- `getMonthsAgo(isoDate)` — Fa quants mesos es va publicar
- `isFreeAccess(isoDate)` — True si fa més de 6 mesos (regla freemium)

---

## Sistema bilingüe (`src/lib/i18n.ts` + `language-provider.tsx`)

80+ claus de traducció CAT/ES. Toggle al header, persisteix a localStorage.

Estructura:
```typescript
export const translations = {
  "hero.title": { ca: "El teu criteri per decidir bé.", es: "Tu criterio para decidir bien." },
  // ... 80+ claus més
} as const;
```

Ús als components:
```tsx
const { t, lang } = useLanguage();
<h1>{t("hero.title")}</h1>
```

---

## Modal de l'informe (`src/components/report-dialog.tsx`)

Mostra els 7 blocs definits al document `02-PRODUCTE.md`:

1. **Fitxa tècnica** — 6 dades (institució, data, tipus, pàgines, scope, URL)
2. **Resum executiu** — El summary de l'informe (text)
3. **5 dades clau** — (per ara mostra placeholder + resum, cal desenvolupar)
4. **Implicacions** — 3 columnes (empreses, reguladors, ciutadans)
5. **Connexions** — Llistat de frameworks afectats
6. **Accions recomanades** (DESTACAT) — 3 accions genèriques amb esforç/impacte
7. **Cross-reference** (DESTACAT) — 4 frameworks amb impacte

Blocs 6 i 7 tenen `border-accent bg-accent-soft/15` per destacar-los.

---

## Biblioteca d'informes (`src/components/sections/reports-library.tsx`)

### Funcionalitats

- **Cerca** per text (títol, institució, summary, tags, certificacions)
- **3 filtres**:
  - Àmbit: CAT / ES / EU / GLOBAL
  - Tipus: regulatory / framework / rating / industry / official
  - Framework afectat: EcoVadis / B Corp / MSCI / GRI / TNFD / etc.
- **Botó "Netejar filtres"** quan n'hi ha cap d'actiu
- **Grid responsive**: 1 col mòbil, 2 col tablet, 3 col desktop
- **Card clicable** — obre el modal de l'informe

### Card d'informe mostra

- Badges: tipus (Regulador/Framework/Rating/Sectorial/Oficial) + scope
- Badge accés: **Obert** (verde, >6 mesos) o **Premium** (gris, <6 mesos)
- Institució + data + pàgines
- Títol (font-serif)
- Resum (màxim 3 línies amb `line-clamp-3`)
- Tags de frameworks afectats (mono uppercase)
- CTA "Veure informe complet →" (visible només al hover)

---

## Lliurables HTML originals (a `assets/`)

Aquests HTML són les plantilles originals dels informes i newsletters. Útils com a referència de disseny:

- `assets/informe_estil_A.html` — Editorial Bloomberg (serif clàssic, fons crema)
- `assets/informe_estil_B.html` — McKinsey consultor (quadrats, blanc+coure)
- `assets/informe_estil_C.html` — Diari modern (tipografia gegant, asimètric)
- `assets/newsletter_estil_A.html` — Editorial setmanal (capçalera + hero + 3 cols + connexió)
- `assets/newsletter_estil_B.html` — Dashboard de dades (fons fosc, KPI cards, taula)

**Decisió presa (29 juny 2026):** Informe = Estil B, Newsletter = Estil A v2.

**Nota:** Les versions homogeneïtzades (v2) i l'`.eml` de la newsletter es van perdre en un reset de l'entorn. Es poden regenerar seguint els criteris definits al `07-DECISIONS.md` i `14-LLANÇAMENT-FASES.md`.

---

## Scripts útils (a `assets/`)

- `assets/html_to_pdf_native.js` — Converteix HTML multi-pàgina a PDF amb Playwright
  - Ús: `node assets/html_to_pdf_native.js input.html output.pdf`
- `assets/create_issues.py` — Crea 15 issues al repositori GitHub via API
  - Ús: `python3 assets/create_issues.py` (requereix token a `/home/z/my-project/.criteri-token`)
- `assets/fix_pptx_compression.py` — Repara fitxers .pptx amb compressió DEFLATE
  - Ús: `python3 assets/fix_pptx_compression.py input.pptx [output.pptx]`

---

## Configuració del projecte (ja ve amb el template)

- **Framework:** Next.js 16 amb App Router
- **Llenguatge:** TypeScript 5
- **Estils:** Tailwind CSS 4 amb shadcn/ui (estil New York)
- **Base de dades:** Prisma ORM amb SQLite (de moment, migrar a Supabase a la Fase 2)
- **Auth:** NextAuth.js v4 disponible
- **UI Components:** Tots els components shadcn/ui ja instal·lats a `src/components/ui/`

Fitxers de configuració (NO cal tocar):
- `package.json` — Dependències
- `tailwind.config.ts` — Config Tailwind
- `tsconfig.json` — Config TypeScript
- `next.config.ts` — Config Next.js
- `components.json` — Config shadcn/ui
- `prisma/schema.prisma` — Schema base de dades

---

## Llistat de tasques pendents (per a la Roser)

### Prioritat alta (juliol 2026)

1. **Tancar disseny final de la homepage** — Iterar sobre la versió actual segons feedback de Paolo
2. **Implementar pàgines internes** — `/informes/[slug]`, `/sobre-nosaltre`, `/faq`, `/preus`
3. **Processar 5 informes pilot amb 7 blocs complets** — Ara els blocs 3, 5 tenen placeholder; cal omplir amb dades reals
4. **Implementar Supabase** — Auth + PostgreSQL per a usuaris registrats (setembre)
5. **Integrar Stripe** — Preparat per a paywall de novembre
6. **Integrar Beehiiv API** — Per crear esborranys de newsletter automàticament

### Prioritat mitjana (agost 2026)

7. **Pàgina `/compte`** — Dashboard d'usuari (informes guardats, alertes, subscripció)
8. **Pàgina `/autodiagnostic`** — Eina interactiva amb 15 preguntes
9. **Tracker de places early bird** — Comptador visible "Queden X places a 29€/mes"
10. **Sistema de paywall** — Preparat per activar al novembre
11. **Optimització SEO** — Meta tags, sitemap, robots.txt, structured data
12. **Test tècnic** — Rendiment, accessibility, responsive, cross-browser

### Prioritat baixa (setembre 2026 i més enllà)

13. **Newsletter reduïda per a gratuïts** — Versió alternativa amb apartats Inversió ESG i Connexió limitats
14. **Pàgina `/certificacions`** — Detall per certificació (EcoVadis, B Corp, etc.)
15. **Pipeline IA Nivell 2** — Crawler RSS automàtic per a les 30 fonts prioritàries
16. **Base de dades vectorial** — `pgvector` a Supabase per a cerca semàntica (bloc 7 cross-reference automàtic)
17. **Dark mode** — Paleta fosca ja definida al CSS, només cal implementar toggle

---

## Notes importants per a la Roser

### Sobre el codi

1. **Totes les traduccions són a `src/lib/i18n.ts`** — Mai hardcoded als components. Si necessites una nova clau, afegir-la allà primer.

2. **Els 10 informes estan a `src/lib/reports.ts`** — Si vols afegir un informe nou, segueix l'estructura del tipus `Report`. Cada informe ha de tenir: slug, title, institution, date, pages, type, scope, tags, certifications, summary, url.

3. **El modal de l'informe és genèric** — Funciona amb qualsevol informe de la biblioteca. Quan es clica una card, es crida `onOpenReport(slug)` que obre el `ReportDialog` amb l'informe seleccionat.

4. **Blocs 6 i 7 destaquen** — Tenen `border-accent bg-accent-soft/15` per diferenciar-los com a elements de valor Premium.

5. **Paleta terra+coure** — Tots els colors són variables CSS a `globals.css`. NO usar colors hardcoded als components.

### Sobre el flux de treball

1. **GitHub és el cervell compartit** — Totes les decisions, documents i codi són al repositori `PaoloGLM/criteri-esg-lab`. Llegeix els 15 documents del repo abans de començar.

2. **Commits amb descripcions clares** — Fes commits sovint amb missatges descriptius en català o castellà.

3. **No pujar credencials** — Tokens, API keys, contrasenyes MAI al repositori. El fitxer `.criteri-token` està al `.gitignore`.

4. **Z.ai-bot pot ajudar** — Pots parlar amb Z.ai-bot al teu propi xat per preguntes tècniques (implementació, bugs, optimització). GitHub és el registre oficial de decisions.

5. **Paolo decideix estratègicament** — Per decisions de preus, mercat, col·laboracions, parla primer amb Paolo. Després ell consulta amb Z.ai-bot si cal.

---

## Històric de canvis

- **29 juny 2026** — Versió inicial 1.0. Codi de la web v2 salvat al directori `assets/web/`. Manual de reconstrucció complet.
