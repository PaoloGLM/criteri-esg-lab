# Reflexió i redisseny de la newsletter Criteri ESG

> **Document de decisions** — 29 juliol 2026
> Substitueix l'estructura anterior (estil A v2).

## Problema detectat

La newsletter anterior era una **"Recap ESG" genèrica** amb notícies d'actualitat i articles d'inversió. Això té dos problemes:

1. **No aprofita el posicionament de Criteri ESG**: el nostre diferencial és sintetitzar informes institucionals + cross-reference + accions operatives, no recopilar notícies de premsa.
2. **Competeix en un mercat saturat**: hi ha moltes newsletters ESG que recapitulen notícies (Sustainalytics, Funds Society, etc.). Nosaltres hem de competir en allò que sabem fer millor.

## Reflexió sobre apartats

### Apartats eliminats (i per què)

| Apartat anterior | Per què es treu |
|------------------|-----------------|
| Notícies ESG (El País, Expansión, etc.) | Notícies d'actualitat — no és el nostre posicionament. Criteri sintetitza informes institucionals, no recopila premsa. |
| Inversió ESG (Sustainalytics, Morningstar, etc.) | Igual que l'anterior — són articles de tercers que ja estan ben coberts per altres newsletters financeres. |

### Apartats nous (i per què)

| Nou apartat | Per què s'afegeix |
|-------------|-------------------|
| **Editorial d'obertura** (Paolo) | Veu ètica pròpia des del primer paràgraf. Diferencial competitiu: cap newsletter ESG competitor té una veu ètica editorial. |
| **Més enllà del Checkbox** | És el nostre diferencial competitiu més fort (1-2 criteris ètics triats de 5). Sense això, som una newsletter més. |
| **Acció recomanada** | Únic apartat que és operativa (no informativa). Directament extreta dels informes sintetitzats. És el que fa que l'usuari torni: acció = valor concret. |

### Apartats mantinguts (i per què)

| Apartat | Per què es manté |
|---------|------------------|
| Masthead | Identitat de marca — sense canvis |
| Informe destacat (hero) | És el contingut estrella — 1 informe amb semàfor + dades clau |
| 3 articles secundaris | Grid de 3 amb cross-reference visible a EcoVadis/B Corp/MSCI/GRI |
| Connexió de la setmana | Anàlisi transversal creuant els informes — valor afegit nostre |
| Nota editorial / CTA Premium / Footer | Tancament estàndard |

## Estructura final (8 apartats)

```
1. Masthead (sense canvis)
2. Editorial d'obertura (Paolo, 1 paràgraf, veu ètica)
3. Informe destacat (1 informe amb semàfor inline + meta)
4. També aquesta setmana (3 articles secundaris amb cross-ref visible)
5. Connexió de la setmana (anàlisi transversal dels informes anteriors)
6. Més enllà del Checkbox (1 criteri ètic aplicat)
7. Acció recomanada (1 acció operativa amb esforç + impacte)
8. CTA Premium + Footer
```

## Diferència entre versions Premium i Free

| Apartat | Premium | Free |
|---------|---------|------|
| Masthead | ✓ (etiqueta "PREMIUM") | ✓ |
| Editorial d'obertura | ✓ complet | ✓ complet |
| Informe destacat | ✓ complet + semàfor | ✓ complet + semàfor |
| 3 articles secundaris | ✓ complets + cross-ref | ✓ complets + cross-ref |
| Connexió de la setmana | ✓ completa | ✗ locked (1 frase + CTA) |
| Més enllà del Checkbox | ✓ complet | ✗ locked (1 frase + CTA) |
| Acció recomanada | ✓ completa | ✗ locked (1 frase + CTA) |
| CTA Premium | "Comparteix" | "Fes-te Premium" |

Principi (CONTEXT.md línia 478):
> "La versió gratis ha de ser prou útil per mantenir l'usuari subscrit, però prou limitada per motivar l'upgrade a Premium"

## Coherència amb el disseny de la web

La newsletter nova aplica els mateixos tokens que `DESIGN_SYSTEM.md`:

| Element | Web | Newsletter |
|---------|-----|------------|
| Fons | `#F5EFE6` (--background) | mateix |
| Text cos | `#2C1810` (--foreground) | mateix |
| Card | `#FFFFFF` (--card) | mateix |
| Accent (cobre) | `#B87333` (--accent) | mateix |
| Accent-deep | `#8A5526` (--accent-deep) | mateix |
| Rule | `#C9B89A` (--rule) | mateix |
| Font serif | Fraunces | mateixa |
| Font sans | Inter | mateixa |
| Font mono | JetBrains Mono | mateixa |
| Eyebrow | 11px uppercase tracking 0.18em accent-deep | mateixa |
| Rule accent | 2px coure 48px ample | mateixa |
| Container width | 640px (estàndard email) | 640px |

### Components copiats de la web

- **StatCard** (informes/[slug]) → utilitzat al semàfor inline de l'hero
- **ArticleCard** (reports-preview) → utilitzat pels 3 articles secundaris
- **ImplicationBlock** (informes/[slug]) → utilitzat a l'editorial d'obertura
- **SemaforRow** (informes/[slug]) → adaptat com a inline a l'hero
- **Accio tags** (esforç/impacte) → mateixos colors i estils
- **CTA Premium** (final-cta) → mateix patró de card coure

## Fonts i dades importants

### Dades que han d'aparèixer sempre a la newsletter

Per cada informe destacat:
- **Institució** (no només font — ex: "Comissió Europea", no "El País")
- **Data de publicació** (de l'informe original)
- **Pàgines originals** (per donar context de la síntesi)
- **Semàfor metodològic** (nota A-D + 5 indicadors amb colors)
- **Cross-reference** (amb EcoVadis/B Corp/MSCI/GRI/ESRS/CSDDD/etc.)

### Què NO ha d'aparèixer

- Notícies de premsa genèrica (El País, Expansión, etc.) — no és el nostre negoci
- Articles d'opinió de tercers
- Dades sense cita a la font institucional original
- Preus o promocions al cos de la newsletter (només al CTA final)

## Implementació tècnica

- Script: `scripts/newsletter-generator.py`
- Genera 2 HTMLs: `newsletter-{N}.premium.html` i `newsletter-{N}.free.html`
- Pujada a Drive: `/Criteri ESG/newsletters/`
- PDF preview local: `/home/z/my-project/download/newsletter-{N}.*.pdf`
- Beehiiv: es creen 2 esborranys manualment (la API és Enterprise only)

## Pendent

- Integrar selecció automàtica d'informes destacats (de Drive `/5-validats-paolo/`)
- Generar contingut per als apartats editorials (editorial obertura, connexió, més enllà) amb GLM
- Validar amb Paolo el disseny visual final
- Definir quin és el trigger exacte (dijous 12:00h) per generar i avisar Paolo
