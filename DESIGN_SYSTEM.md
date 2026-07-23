# DESIGN_SYSTEM.md — Criteri ESG

> **DOCUMENT OBLIGATORI.** Qualsevol canvi a la web (nova pàgina, nou component, edició d'un existent) **HA DE** consultar aquest document primer i seguir les regles exactes. No es pot inventar un estil nou si ja existeix un patró aprovat.
>
> Si es detecta una inconsistència entre aquest document i el codi, el codi s'ha d'adaptar a aquest document (o bé el document s'actualitza explícitament amb justificació).
>
> Última actualització: 15 juliol 2026
> Auditor: Task AUDIT-DESIGN-1 (vegeu `worklog.md`)

---

## 1. Paleta de colors (tokens)

Tots els tokens estan definits a `src/app/globals.css` (`:root`) i es consumeixen via classes Tailwind.

| Token | Hex | Tailwind class | Ús |
|---|---|---|---|
| `--background` | `#F5EFE6` | `bg-background` | Fons de la pàgina (terra clara) |
| `--foreground` | `#2C1810` | `text-foreground` | Text cos per defecte (marró fosc) |
| `--card` | `#FFFFFF` | `bg-card` | Targetes blanques sobre terra |
| `--popover` | `#FFFFFF` | `bg-popover` | Popovers |
| `--primary` | `#2C1810` | `bg-primary` / `text-primary` | Mateix que foreground. Fons del footer, botons primaris |
| `--primary-foreground` | `#F5EFE6` | `text-primary-foreground` | Text sobre fons `primary` (terra sobre marró) |
| `--secondary` | `#EFE7DA` | `bg-secondary` | Terra una mica més fosca. Seccions alternes |
| `--muted-foreground` | `#8B7355` | `text-muted-foreground` | Marró-gris per a text secundari |
| `--accent` | `#B87333` | `bg-accent` / `text-accent` | Coure. Color de marca principal |
| `--accent-foreground` | `#FFFFFF` | `text-accent-foreground` | Text sobre coure |
| `--accent-soft` | `#D9A574` | `bg-accent-soft` | Coure suau per a tints |
| `--accent-deep` | `#8A5526` | `text-accent-deep` | Coure fosc. Eyebrow labels, bloc num |
| `--rule` | `#C9B89A` | `border-rule` | Filets de separació (sorra) |
| `--destructive` | `#B91C1C` | `bg-destructive` | Només per "Cerrar sesión" i errors |

### Colors del semàfor (hardcoded)

| Status | Hex | Ús |
|---|---|---|
| Verd | `#5C8A5C` | Semafor verd, badge Complement |
| Groc | `#C9A961` | Semafor groc |
| Vermell | `#A0522D` | Semafor vermell, badge Contradicció |

No mapejar a variables CSS — s'usen directament com `bg-[#5C8A5C]`, `bg-[#C9A961]`, `bg-[#A0522D]`.

### Opacitats d'accent-soft admeses

| Opacitat | Ús |
|---|---|
| `bg-accent-soft/10` | Bloc destacat (Semàfor, Accions, Cross-reference) |
| `bg-accent-soft/15` | Èmfasi més fort (Early bird box, pla seleccionat, "Més enllà del Checkbox") |
| `bg-accent-soft/20` | Badges Type/Scope/Free |
| `bg-accent-soft/30` | Plan pill gratuït, badge Tipus en biblioteca |
| `bg-accent-soft/40` | (mantenir només si cal contrasts molt forts; revisar) |

### Regla de fons per seccions

- **Per defecte**: cap classe `bg-*` (fa servir `bg-background` heretat del body).
- **Seccions alternes** (ritme visual): `bg-secondary/30`.
- **Mai** dues seccions adjacents amb el mateix fons.
- **Fons coure sòlid `bg-accent`**: només per a (1) targeta Premium CTA a final-cta, (2) pill de nota semàfor, (3) toggle actiu (llengua/període), (4) PlanBadge petit.
- **Fons `bg-primary` (marró fosc)**: només pel footer.

---

## 2. Tipografia

### Famílies (carregades a `layout.tsx`)

| Família | Variable | Tailwind class | Ús |
|---|---|---|---|
| Fraunces (serif) | `--font-fraunces` | `font-serif` | Tot el que és `h1`–`h6` (auto via `@layer base`), logo, preus, valors estadístics, cites itàliques |
| Inter (sans) | `--font-inter` | `font-sans` (default body) | Cos, eyebrows, botons, labels |
| JetBrains Mono | `--font-jetbrains` | `font-mono` | Breadcrumbs, mono labels, preu period, xips |

### Estils canònics (exactes)

| Estil | Tailwind classes |
|---|---|
| **Display H1** (home hero) | `font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl` |
| **Page H1** (informes, cuenta) | `font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl` |
| **Single-report H1** (capçalera densa) | `font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl` |
| **Section H2** (regular) | `font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl` |
| **H3 card title** (petita) | `font-serif text-lg font-semibold leading-tight text-primary` |
| **H3 featured card** (hero, final-cta) | `font-serif text-2xl font-semibold leading-tight text-primary sm:text-3xl` |
| **H3 plan card** (diàlegs) | `font-serif text-xl font-semibold text-primary` |
| **H4 sub-title** (Accions, Valor, diàleg) | `font-serif text-base font-semibold leading-tight text-primary` |
| **H4 preu gran** (pla Preus) | `font-serif text-4xl font-semibold text-accent` |
| **Body** (cos de pàgina) | `text-base leading-relaxed text-foreground/80` |
| **Body dins Bloc** | `text-sm leading-relaxed text-foreground/85` *(veure inconsistència #14 — proposat: `/80`)* |
| **Body dins diàleg/card** | `text-sm leading-relaxed text-foreground/80` |
| **Body secundari** (card summary) | `text-sm leading-relaxed text-foreground/75` |
| **Fine print** (notes petites) | `text-xs leading-relaxed text-foreground/70` |
| **Eyebrow / kicker** | classe CSS `.eyebrow` (definida a globals.css) |
| **Mono label** (breadcrumb, pàgina, URL) | `font-mono text-[10px] uppercase tracking-widest text-muted-foreground` |
| **Mono label accent** (Esforç, Impacte, Nota global) | `font-mono text-[10px] uppercase tracking-widest text-accent-deep` |
| **Stat value** (card, bloc) | `font-serif text-3xl font-semibold text-accent` (o `sm:text-4xl` per gran) |
| **Logo header** | `font-serif text-2xl font-semibold tracking-tight text-primary` amb `<span className="text-accent">.</span>` |
| **Logo footer** | `font-serif text-2xl font-semibold` amb `<span className="text-accent-soft">.</span>` |
| **Cita itàlica** | `font-serif text-lg leading-relaxed text-foreground italic` |
| **Trigger accordion** | `text-left text-base font-medium` (sense color — hereta foreground) |

### Classes CSS utilitàries (globals.css)

```css
.eyebrow {
  font-family: var(--font-inter), sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-deep);
}

.rule-accent { height: 2px; background: var(--accent); border: none; width: 48px; }
.rule        { height: 1px; background: var(--rule);    border: none; width: 100%; }

.editorial-link { /* animated underline, header nav */ }
```

**Ús**: `<p className="eyebrow mb-2">EYEBROW</p>` + `<h2>...</h2>` + `<div className="rule-accent my-5" />` + `<p>...</p>`.

**Mai** fer servir inline `font-mono text-[10px] uppercase tracking-widest` per a un eyebrow — són visuals diferents. Els mono labels inline només són per breadcrumbs, page numbers, URLs i meta dades (Esforç/Impacte).

---

## 3. Espaiat i layout

### Container widths

| Class | Context |
|---|---|
| `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` | Seccions full-width (hero, mid-sections, reports-preview, reports-library, final-cta, header, footer) |
| `mx-auto max-w-5xl px-4 sm:px-6 lg:px8` | Cuenta body (3-card grid) |
| `mx-auto max-w-4xl px-4 sm:px-6 lg:px-8` | Single-report (capçalera + body llegible) |
| `mx-auto max-w-3xl px-4 sm:px-6 lg:px-8` | FAQ (estret per llegibilitat) |
| `max-w-2xl` | Hero subtitle, paragraphs dins hero/cuenta |
| `max-w-md` | 404, sub-caixes de diàleg |
| `max-w-xs` | Footer tagline |

**Regla**: el padding horitzontal és **siempre** `px-4 sm:px-6 lg:px-8` (la triple). Mai `px-6` sol, ni `px-4 lg:px-12`.

### Paddings de secció

| Class | Context |
|---|---|
| `py-16 lg:py-24` | Home hero (més generós) |
| `py-12` | Page hero (informes, cuenta) |
| `py-10` | Single-report header (densa) |
| `py-16 sm:py-20` | Secció regular de contingut |
| `py-12` | LockScreen, footer |
| `py-8` | 404 |

### Paddings interns de cards

| Class | Component |
|---|---|
| `p-8` | Final-cta cards, PreusDialog early bird i mètodes |
| `p-6` | Hero featured card |
| `p-5` | Bloc (informe), SectionCard (hero), ReportCard, PlanCard, wrappers de Pillar/Valor, nota final |
| `p-4` | StatCard, FormatBloc, ImplicationBlock, sub-cards dins Bloc, SemaforRow box, sub-caixes de diàleg |
| `p-3` | Form rows, checkbox grids, notes petites |

### Gaps en grids

| Pattern | Context |
|---|---|
| `gap-3` | Grids molt densos (StatCards 3-up, interessos) |
| `gap-4` | Cards estàndard (FormatBloc, ReportCard library, sub-cards) |
| `gap-5` | Densitat mitja (hero SectionCard, preus PlanCard) |
| `gap-6` | Final-cta 2-up, certifications 3-up |
| `gap-8` | Footer 3-col |
| `space-y-8` | Entre blocs d'informe (single-report body) |
| `space-y-5` | Qui-som dialog |
| `space-y-6` | Cuenta form edició |
| `space-y-4` | Auth-dialog form |
| `space-y-3` | Cuenta CardContent lectura, plan radio cards |
| `space-y-2` | Semafor rows |

---

## 4. Components canònics

### Bloc (informe)

```tsx
<section className={`rounded-md border p-5 ${
  highlighted ? "border-accent bg-accent-soft/10" : "border-rule bg-card"
}`}>
  <div className="mb-4 flex items-center gap-3">
    <span className="font-mono text-xs text-accent-deep">{num}</span>
    <span className="text-accent-deep">{icon}</span>  {/* icon: h-4 w-4 */}
    <h2 className="font-serif text-lg font-semibold text-primary">{title}</h2>
  </div>
  {children}
</section>
```

**Regla**: el `bloc num` fa servir `text-accent-deep` (#8A5526), NO `text-primary`.

### Card variants

| Variant | className |
|---|---|
| **Small content** | `rounded-md border border-rule bg-card p-4` |
| **Standard** | `rounded-lg border border-rule bg-card p-5 transition-all hover:border-accent hover:shadow-md` |
| **Highlighted** | `rounded-lg border border-accent bg-accent-soft/10 p-5` (o `/15`) |
| **Empty state** | `rounded-lg border border-rule bg-card p-10 text-center` |

No fer servir shadcn `<Card>` amb `rounded-xl` per cards inline — només pel dashboard de cuenta.

### Badge variants canòniques

```tsx
// Type label
<Badge variant="secondary" className="bg-accent-soft/30 text-[10px] text-accent-deep">Regulador</Badge>

// Scope label
<Badge variant="outline" className="border-rule text-[10px] text-foreground/70">
  <Globe className="mr-1 h-2.5 w-2.5" /> Unió Europea
</Badge>

// Free/Obert
<Badge variant="outline" className="border-accent bg-accent-soft/20 text-[10px] text-accent-deep">Obert</Badge>

// Premium
<Badge variant="outline" className="border-muted-foreground text-[10px] text-muted-foreground">
  <Lock className="mr-1 h-2.5 w-2.5" /> Premium
</Badge>

// Cert (single-report header)
<Badge variant="outline" className="border-accent/40 text-accent-deep">EcoVadis</Badge>
```

### Button variants i mides

| Variant |Ús |
|---|---|
| `default` | Primari (un per visible region). CTA principal |
| `outline` | Secundari. "Veure", "Gestiona", "Editar" |
| `secondary` | CTA dins de card amb `bg-accent` (final-cta Premium) |
| `ghost` | Toolbar (header), terciari inline, "clear filters" |
| `destructive` | Només "Cerrar sesión" |
| `link` | Declarat però no usat |

**Mides canòniques**:
- `size="lg"` + `className="h-12 px-6 text-base"` → CTA del hero (48px alt).
- `size="lg"` + `className="h-11 px-6"` → CTA de final-cta (44px).
- `size="lg"` sol (h-10) → LockScreen.
- `size="sm"` → sub-accions dins cards, header login.
- `size="icon"` + `className="h-9 w-9"` → header search/menu.

### Dialog max-widths

| Diàleg | sm:max-w |
|---|---|
| Auth (form) | `sm:max-w-[560px]` |
| Qui-som (content) | `sm:max-w-3xl` |
| Preus (complex) | `sm:max-w-4xl` |

Tots afegeixen `max-h-[90vh] overflow-y-auto` (o `[92vh]` per forms alts).

Tots els diàlegs fan servir `bg-background` (terra), no `bg-card`. Les cards interiors fan servir `bg-card` per contrastar.

### Helper components d'informe

```tsx
// StatCard (mid-sections.tsx)
<div className="rounded-md border border-rule bg-card p-4 text-center">
  <div className="font-serif text-3xl font-semibold text-accent sm:text-4xl">{value}</div>
  <div className="mt-1 text-xs leading-tight text-muted-foreground">{label}</div>
</div>

// Datum (informes/[slug])
<div>
  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
  <p className="text-sm font-medium text-primary">{value}</p>
</div>

// ImplicationBlock
<div className="rounded-md border border-rule bg-background p-4">
  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent-deep">{label}</p>
  <p className="text-xs leading-relaxed text-foreground/80">{body}</p>
</div>

// SemaforRow
<div className="flex items-start gap-3 rounded-sm border border-rule bg-background px-3 py-2">
  <span className={`mt-0.5 inline-block h-3 w-3 flex-shrink-0 rounded-full ${color}`} />
  <div className="min-w-0 flex-1">
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className="text-sm font-medium text-primary">{name}</span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">{label}</span>
    </div>
    <p className="mt-0.5 text-xs leading-relaxed text-foreground/70">{note}</p>
  </div>
</div>
```

---

## 5. Anatomia de seccions

### Page hero

```tsx
<section className="border-b border-rule bg-secondary/30 py-12">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <p className="eyebrow mb-2">EYEBROW LABEL</p>
    <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">Title</h1>
    <div className="rule-accent my-5" />
    <p className="max-w-2xl text-base leading-relaxed text-foreground/80">Subtitle paragraph</p>
  </div>
</section>
```

### Content section

```tsx
<section className="border-b border-rule py-16 sm:py-20">  {/* o bg-secondary/30 per alterna */}
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mb-10">
      <p className="eyebrow mb-3">EYEBROW</p>
      <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">Title</h2>
      <div className="rule-accent my-5" />
      <p className="max-w-2xl text-base leading-relaxed text-foreground/80">Subtitle</p>
    </div>
    {/* grid de cards */}
  </div>
</section>
```

### Pàgina wrapper (obligatori)

```tsx
<div className="flex min-h-screen flex-col bg-background">
  <Header ... />
  <main className="flex-1">
    {/* seccions */}
  </main>
  <Footer />
  {/* diàlegs al final */}
  <AuthDialog ... />
  <PreusDialog ... />
  <QuiSomDialog ... />
</div>
```

---

## 6. Iconografia

**Llibreria**: només `lucide-react` (cap Material Icon a la web).

### Mides estàndard

| Mida | Ús |
|---|---|
| `h-2.5 w-2.5` (10px) | Chips inline dins Badge |
| `h-3 w-3` (12px) | Dots de llegenda, meta icons |
| `h-3.5 w-3.5` (14px) | Check inline, LogIn |
| `h-4 w-4` (16px) | Estàndard — CTA arrows, Bloc icons, form actions |
| `h-5 w-5` (20px) | SectionCard, LockScreen, certifications |
| `h-6 w-6` (24px) | Loading spinner, success check, magic link icon |
| `h-12 w-12` (48px) | LockScreen wrapper, success state |

### Icon containers (canònic)

```tsx
// Default (40px)
<span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-accent-deep">
  <Icon className="h-5 w-5" />
</span>

// Dins de card destacat (40px, accent-soft)
<span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft/20 text-accent-deep">
  <Icon className="h-5 w-5" />
</span>

// LockScreen wrapper (48px, accent/15)
<div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
  <Lock className="h-5 w-5" />
</div>
```

---

## 7. Regles d'i18n

### Com consumir traduccions

| Mètode | Quan |
|---|---|
| `t("namespace.key")` via `useLanguage()` | Qualsevol string reutilitzat en 2+ llocs o mostrat a anònims |
| `lang === "ca" ? "..." : "..."` inline | Strings curts d'un sol component |
| `tr(ca, es)` helper local | Components amb molts strings curts (cuenta pattern) |

### Llengua per defecte

- `<html lang="ca">` (layout.tsx)
- **Pendent d'arreglar**: `LanguageProvider` inicialitza a `"es"` (veure inconsistència #19).
- Tots els strings han de tenir versió CA i ES.

### Terminologia de plans

- **CA**: "Gratuït"
- **ES**: "Gratis"
- **Mai**: "Free", "Gratuito"

### Regles tipogràfiques

- **CA** fa servir `·` (middlet) dins paraules: `Intel·ligència`.
- **Moneda**: `290 €/any` (espai primis).
- **Marques angleses preserved**: Newsletter, Premium, Cross-reference, Early bird, Compliance, Framework.

---

## 8. Regles obligatòries per a components nous (CHECKLIST)

Abans de pujar codi nou, verifica:

1. [ ] Wrapper de pàgina: `<div className="flex min-h-screen flex-col bg-background">` + Header + `<main className="flex-1">` + Footer + diàlegs.
2. [ ] Cada secció fa servir `border-b border-rule` i alterna `bg-secondary/30` amb res.
3. [ ] Padding horitzontal sempre `px-4 sm:px-6 lg:px-8`.
4. [ ] Eyebrows fan servir la classe `.eyebrow`, no inline mono.
5. [ ] H1 page: `text-4xl sm:text-5xl`. H2 section: `text-3xl sm:text-4xl`. Mai invertir.
6. [ ] H3 card: `text-lg`. H3 featured: `text-2xl sm:text-3xl`.
7. [ ] Body paragraph: `text-base leading-relaxed text-foreground/80` (o `/75` per secundari).
8. [ ] Bloc num: `text-accent-deep` (#8A5526).
9. [ ] Cards fan servir `rounded-md` (petites) o `rounded-lg` (estàndard), no `rounded-xl`.
10. [ ] Badges fan servir shadcn `<Badge>` amb `variant` + `className` explícit.
11. [ ] Buttons fan servir shadcn `<Button>`. Hero CTA: `size="lg" className="h-12 px-6 text-base"`.
12. [ ] Stat values: `font-serif text-3xl font-semibold text-accent` (mai `font-medium`).
13. [ ] Mono labels: `font-mono text-[10px] uppercase tracking-widest text-muted-foreground` (o `text-accent-deep`).
14. [ ] Dividers entre seccions: `border-b border-rule` a la secció. Dins cards: `<Separator />` o `border-t border-rule`.
15. [ ] Diàlegs: `max-h-[90vh] overflow-y-auto` + sm:max-w segons tipus.
16. [ ] Icons: només `lucide-react`. Mida segons context (veure taula).
17. [ ] Tots els strings tenen versió CA i ES.
18. [ ] Mai "Free" ni "Gratuito" — sempre "Gratuït" / "Gratis".
19. [ ] Plan / Preu: `290 €/any` amb espai. Mai `EUR` ni `$`.
20. [ ] Cap caràcter Unicode escapat (`\u2245`, etc.) — només literals dins `Paragraph()`.

---

## 9. Inconsistències detectades (PENDENTS D'ARREGLAR)

> Aquesta llista és el resultat de l'auditoria AUDIT-DESIGN-1. Quan s'arregli una inconsistència, marcar-la com a ✅ amb data.

### Prioritat alta (impacte visual gran)

1. **✅ `reports-library.tsx:94`** — H2 canviat de `text-4xl sm:text-5xl` a `text-3xl sm:text-4xl`. *(15 jul 2026)*
2. **✅ `mid-sections.tsx:102`** — StatCard canviat de `font-medium` a `font-semibold`. *(15 jul 2026)*
3. **✅ `mid-sections.tsx`** — Migrat a i18n (`mid.speed.*`, `mid.format.*`). Tots els texts ara bilingües. *(15 jul 2026)*
4. **✅ `site-header.tsx`** — Migrat a i18n (`nav.cuenta`, `nav.logout`, `nav.menu`, `nav.user.default`). "Mi cuenta", "Cerrar sesión", "Usuario", "Menu" ja no estan hardcoded. *(15 jul 2026)*
5. **✅ `language-provider.tsx`** — Default canviat de `"es"` a `"ca"`. Ara respecta localStorage i `navigator.language` (ca/es). *(15 jul 2026)*
6. **✅ Reports-preview vs reports-library** — ReportCard de `reports-preview` reescrit per coincidir amb `reports-library` (shadcn Badge + `text-lg` + `line-clamp-2` + mono certs + footer hover-reveal). *(15 jul 2026)*

### Prioritat mitja (coherència)

7. **✅ Free/Obert badge** — Unificat a `variant="outline" border-accent bg-accent-soft/20 text-[10px] text-accent-deep` a reports-preview, reports-library i informes/[slug]. *(15 jul 2026)*
8. **✅ Premium badge** — Unificat a `variant="outline" border-muted-foreground text-[10px] text-muted-foreground` + `<Lock>` icon. Aplicat a reports-preview, reports-library i informes/[slug]. *(15 jul 2026)*
9. **❌ Eyebrow en diàlegs** — `preus-dialog` i `qui-som-dialog` fan servir `font-mono text-xs uppercase tracking-widest text-accent` (no és la classe `.eyebrow`). Decidir: extendre `.eyebrow` amb variant accent, o documentar com a excepció. *(PENDENT de decisió)*
10. **✅ "Veure informe" color** — Ara `reports-preview` fa servir `text-accent-deep` com a `reports-library` (footer hover-reveal). *(15 jul 2026)*
11. **❌ `cuenta/page.tsx:333`** — Hero usa `max-w-5xl`. Hauria de ser `max-w-7xl` (el body pot quedar a 5xl). *(PENDENT de decisió — el body de cuenta té 3 cards en grid que poden fer 7xl massa ample)*
12. **❌ `informes/[slug]/page.tsx:170`** — Single-report header usa `py-10`. Hauria de ser `py-12` com els altres page heroes. *(PENDENT de decisió — la densitat pot ser deliberada)*
13. **❌ `certifications.tsx`** — Tot hardcoded català. A més, sembla dead code (no importat enlloc). Decidir: eliminar o i18n. *(PENDENT de decisió)*

### Prioritat baixa (poliment)

14. **✅ Opacitats de foreground** — Eliminat `/85` (canviat a `/80` a `informes/[slug]/page.tsx:381` i `report-dialog.tsx:126`). Regla adoptada: body=`/80`, secundari=`/75`, fine=`/70`. *(15 jul 2026)*
15. **❌ `eyebrow mb-*` inconsistent** — `mb-2` en page hero, `mb-3` en section, `mt-4` en single-report header (per breadcrumb). Documentar la regla. *(PENDENT — la variant `mt-4` és correcta quan hi ha breadcrumb a sobre)*
16. **✅ `rule-accent my-*` inconsistent** — FAQ canviat de `my-6` a `my-5`. Regla: `my-5` per seccions, `my-6` només per home hero. *(15 jul 2026)*
17. **✅ `reports-library.tsx:307`** — "pàg" hardcoded català → `{lang === "ca" ? "pàg" : "pág"}`. També simplificat `{lang === "ca" ? "Informes" : "Informes"}` → `"Informes"` a informes/[slug]:188. *(15 jul 2026)*
18. **✅ Accessibilitat Card onClick** — `reports-library` i `reports-preview` ara fan servir `role="button" tabIndex={0} onKeyDown` + `aria-label` + `focus-visible:ring`. *(15 jul 2026)*

### Afegits fora de la llista original (bilingüisme addicional detectat)

19. **✅ `faq-section.tsx`** — Migrat a i18n (`faq.eyebrow`, `faq.title`, `faq.q1.q/a` ... `faq.q5.q/a`). Abans tot estava hardcoded en català (no estava a la llista però era evident). *(15 jul 2026)*

### Pendents de decisió de l'usuari (RESOLTS 15 jul 2026)

- **✅ `/informes/page.tsx`** — S'ha triat opció (b): eliminada la H1 de la pàgina. `ReportsLibrary` ara té la capçalera completa com a page hero (eyebrow + H1 + descripció + rule-accent + body). *(15 jul 2026)*
- **✅ `certifications.tsx`, `register-dialog.tsx`, `report-dialog.tsx`, `qui-som-dialog.tsx`** — Eliminats (dead code). `QuiSomDialog` substituït per pàgines estàtiques `/que-fem` i `/qui-som`. *(15 jul 2026)*
- **❌ `cuenta/page.tsx:333`** — Es manté `max-w-5xl` per decisió de Paolo. *(15 jul 2026)*
- **❌ `informes/[slug]/page.tsx:170`** — Es manté `py-10` per decisió de Paolo. *(15 jul 2026)*

---

## 11. Pàgines estàtiques (creades 15 jul 2026)

S'han creat dues pàgines noves que substitueixen l'antic `QuiSomDialog`:

### `/que-fem` (Producte — com elaborem els informes)

- **Capçalera**: page hero canònic (`border-b border-rule bg-secondary/30 py-12` + eyebrow + H1 + rule-accent + descripció)
- **Procés**: 5 passos en grid 3 cols (Detecció → Curació → Síntesi → Validació → Publicació). Cada pas és una card `rounded-md border border-rule bg-card p-5` amb icona dins cercle accent/10, mono label "PAS N", H3 i body.
- **Format**: 8 blocs reutilitzant claus `mid.format.bloc*` (same patró que `mid-sections.tsx`)
- **Sistema d'IA + supervisió**: card destacada amb border-accent/30 bg-card p-5
- **Criteris i valors**: grid 2 cols amb 4 valors (ètica, economia social, dignitat, territori)
- **Preguntes per millorar (Premium)**: card destacada amb border-accent bg-accent-soft/15
- **Tancament**: cita itàlica amb border-l-2 border-accent

### `/qui-som` (Empresa — equip humà)

- **Capçalera**: page hero canònic
- **Manifest**: cita itàlica amb border-l-2 border-accent
- **Equip**: grid 3 cols amb 3 membres (Paolo, Tech Lead, Assistent d'IA). Card per persona amb icona dins cercle, nom + rol (mono), bio. L'Assistent d'IA té un estil diferent (border-accent/40 bg-accent-soft/10) per marcar que no és humà.
- **CTA "Vols formar-ne part?"**: card amb enllaç mailto
- **Tancament**: cita itàlica amb border-l-2 border-accent

### Footer reorganitzat (15 jul 2026)

- **Producte**: Biblioteca d'informes + Què fem
- **Empresa**: Qui som + Preguntes freqüents
- **Legal**: Privadesa + Termes + Cookies

Tot bilingüe via `t()`. Eliminat el "Qui som" duplicat que apareixia a Producte.

---

## 10. Quan actualitzar aquest document

- Sempre que s'aprovi un nou patró visual (cal screenshot + decisió explícita de Paolo).
- Sempre que s'arregli una inconsistència de la secció 9 (marcar com a ✅ amb data).
- Sempre que s'afegeixi un component nou recurrent (afegir a la secció 4).

**Qui és responsable d'actualitzar-lo**: l'agent que faci el canvi. No es pot pujar codi nou sense haver consultat aquest document primer.

---

## Actualització 22 juliol 2026 — Fase 2 (redisseny web)

### Estat actual del redisseny

| Pàgina | Fase | Estat React | Estat Deploy |
|--------|------|-------------|--------------|
| Homepage | 2A | ✅ Implementada | ✅ Deployada |
| /que-fem | 2D | ✅ Implementada | ✅ Deployada |
| /qui-som | 2D | ✅ Implementada | ✅ Deployada |
| /cuenta | 2D | ✅ Implementada | ✅ Deployada |
| /informes/[slug] | 2B | ❌ Pendent | ❌ No deployada |
| /informes (biblioteca) | 2C | ❌ Pendent | ❌ No deployada |
| /estandares-esg | 2C | ❌ Pendent | ❌ No deployada |
| /preus | 2E | ❌ HTML validat | ❌ No implementada |
| /mas-alla-del-checkbox | 2E | ❌ HTML validat | ❌ No implementada |

### Sistema visual consolidat (Fase 2)

**Paleta terra+coure (actual, en producció):**
- `#2C1810` — dark primari (fons hero, manifest, sidebar compte)
- `#5C3A1E` — secundari (headers taula, text secondary)
- `#B87333` — accent (CTAs, eyebrows, números)
- `#E8C99A` — accent clar (certificacions, badges suaus)
- `#F5EFE6` — background clar
- `#D9A574` — text sobre dark
- `#C9B89A` — rule/border
- `#8B7355` — muted text
- `#8A5526` — hover/deep accent

**Tipografia:**
- Fraunces (display, headings, èmfasi italic)
- Inter (body, UI)
- JetBrains Mono (eyebrows, meta, labels uppercase)

**Layout canònic:**
- `border-top: 3px solid #2C1810` (o coure en dark) marca inici de secció
- Eyebrow en mono uppercase 0.22em letter-spacing
- Títol en Fraunces 38-56px amb `<em>` italic per èmfasi
- Dark per impacte (hero, manifest, sidebar compte)
- Clar per lectura (informes, biblioteca, estàndards)

**Prova paleta verda (no implementada, en prova):**
- `#1F6F5F` — teal fosc (substitueix #2C1810)
- `#2FA084` — verd mitjà (substitueix #B87333)
- `#6FCF97` — verd clar (substitueix #E8C99A)
- `#EEEEEE` — gris clar (substitueix #F5EFE6)
- Logo nou verd integrat
- Capture a Drive: /redisseny-web/prova-paleta-verda/

### Banner 2 mesos Premium gratis
- Afegit al hero de la homepage (subtle, dins requadre coure)
- Afegit al formulari de registre (auth-dialog)
- Text ES: "Durante los dos primeros meses de Criteri ESG disfrutarás de las ventajas Premium sin coste."

### Eslògan oficial (decisió editorial 17)
- "5 minuts per obtenir un criteri clar d'un informe"
- NO "7 minuts" (obsolet)
- Informes: max 1.100 paraules, objectiu 1.000

### Deploy
- Via Vercel deploy hook (decisió editorial 18)
- Hook URL al .env local (VERCEL_DEPLOY_HOOK)
- Build script: `next build` (sense cp standalone)
