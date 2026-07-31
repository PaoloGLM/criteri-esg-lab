# Pendent: Disseny de l'informe PDF — tancar amb la Roser

> **Estat**: pendent
> **Qui**: Roser (disseny) + GLM (implementació tècnica)
> **Quan**: quan la Roser estigui disponible

## Context

El flux de creació d'informes (passos 1-4) funciona correctament:
- Pas 1: GLM detecta PDFs originals → Drive `/0-originals/`
- Pas 2: GLM destil·la → Drive `/1-distilats/`
- Pas 3: Gemini revisa (crític + advocat del diable) → Drive `/2-aportacions-gemini/`
- Pas 4: GLM redacta Markdown CA+ES → Drive `/3-fets/`

Els passos 1-4 queden congelats en aquest estat — no es processen més informes fins que el disseny estigui tancat.

## Què cal tancar amb la Roser

### 1. Plantilla HTML oficial de l'informe

La plantilla actual (a `scripts/genera-pdf-informe.py`) està basada en `pilot-informe-foretica-amb-semafor-i-mes-enlla.html` però **no és el disseny final aprovat**. La Roser ha de:

- Validar o redissenyar la plantilla
- Confirmar paleta de colors (actualment: #2C1810, #5C3A1E, #B87333, #E8C99A, #F5EFE6 — terra+coure)
- Confirmar tipografies (actualment: Fraunces, Inter, JetBrains Mono)
- Confirmar estructura visual dels 8 blocs (Semàfor, Fitxa, Dades clau, Resum, Implicacions, Més enllà, Connexions, Accions, Cross-ref)
- Confirmar el comportament dels elements:
  - Semàfor: 5 indicadors amb colors verd/groc/vermell + nota A-D
  - Dades clau: grid 2 columnes amb valors destacats
  - Accions: targetes amb esforç + impacte
  - Més enllà del Checkbox: requadre destacat amb criteri ètic

### 2. Un cop tancat el disseny

GLM refactoritza `scripts/genera-pdf-informe.py` amb la plantilla final i es reprèn el flux:

- Pas 5: Gemini ortografia (corregeix Markdown)
- Pas 5b: genera PDF amb plantilla final
- Pas 5c: puja a Drive `/4-revisats-ortografia/`
- Pas 6: Paolo valida
- Pas 7: GLM puja a la web

## Què NO fer

- No processar més informes fins que el disseny estigui tancat
- No tocar els 5 informes ja generats (eu-taxonomy, europe-sustainable, cnmv-boletin, cnmv-plan, unepfi-strategy) — queden com a referència del pas 4
- No avançar al pas 5 sense plantilla final

## Referències

- Plantilla actual: `scripts/genera-pdf-informe.py` (CSS dins del script)
- Pilot original: `/home/z/my-project/download/pilot-informe-foretica-amb-semafor-i-mes-enlla.html`
- DESIGN_SYSTEM.md (paleta + tipografies del projecte)
- METODOLOGIA.md (estructura dels 8 blocs)
