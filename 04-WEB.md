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
| LLM | z-ai-web-dev-sdk (GLM) o Claude 3.5 Sonnet |
| Crawler | Scrapy + BeautifulSoup |

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
4. **Speed** — "5 minuts vs 5 hores" amb 3 KPIs
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

## Històric de canvis

- **25 juny 2026** — Homepage operativa amb 12 seccions, 2 modals, bilingüisme CAT/ES. Verificada amb Agent Browser
