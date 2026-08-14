# Flux de creació d'informes Criteri ESG

> **Flux oficial** — 13 agost 2026 (v2). Substitueix versions anteriors.
> LLEGEIX AQUEST FITXER ABANS DE COMENÇAR QUALSEVOL TASCA D'INFORMES.

## El flux (7 passos)

```
1. Gemini free detecta      →  PDFs originals a Drive /0-originals/
2. DeepSeek v4 Pro destil·la →  JSON destil·lats a Drive /1-distilats/
3. Gemini 3.6 Flash revisa   →  JSON d'aportacions a Drive /2-aportacions-gemini/
                                (API de pagament)
4. DeepSeek v4 Pro redacta   →  Markdown CA+ES a Drive /3-fets/
5. Gemini free ortografia    →  Markdown corregits a Drive /4-revisats-ortografia/
                                + PDF generat amb plantilla oficial Criteri ESG
6. Paolo valida              →  llegeix el PDF, si està bé el mou a /5-validats-paolo/
7. DeepSeek v4 Pro puja web  →  publica a /informes/[slug] + mou a /6-publicats/
```

## Actors

- **Gemini free tier** (`gemini-3-flash-preview`, clau `GEMINI_FREE_API_KEY`): passos **1** (detecció a les fonts) i **5** (ortografia).
- **DeepSeek v4 Pro** (clau `HERMES_CUSTOM_DEEPSEEK_API_KEY_API_KEY`): passos **2** (destil·lació), **4** (redacció) i **7** (publicació web).
- **Gemini 3.6 Flash** (API de pagament, clau `GEMINI_API_KEY` — compte PRO): pas **3** (revisió crítica + advocat del diable).
- **Paolo**: pas **6** (validació humana, no negociable).

## Pujada a Drive

Es fa amb **OAuth d'usuari** (no Service Account), fent servir:
- `scripts/.gcp-oauth-tokens.json` — tokens (es refresquen automàticament, mode production)
- `scripts/.gcp-oauth-client.json` — client_id i client_secret

El Service Account `criteri-bot@...` no té quota d'emmagatzematge. **Sempre fer servir OAuth d'usuari per pujar.**

## Format dels PDFs (carpeta 4)

Els PDFs es generen amb la **plantilla HTML oficial Criteri ESG** (basada en `pilot-informe-foretica-amb-semafor-i-mes-enlla.html`):
- Paleta: terra+coure (#2C1810, #5C3A1E, #B87333, #E8C99A, #F5EFE6)
- Fonts: Fraunces (serif per títols), Inter (sans per text), JetBrains Mono (código/labels)
- Estructura visual dels 8 blocs amb targetes, grid de dades, semàfor amb colors verd/groc/vermell
- Footer amb disclaimer de processament IA

Script: `scripts/genera-pdf-informe.py <slug> <ca|es>`

## Format canònic del Markdown (pas 4) — CRÍTIC per al PDF

El parser `parse_md_to_reportblock` (a `genera-pdf-informe.py`) accepta **dos formats** per a cada bloc (el format "vell" de llistes i el format "nou" de taules que genera DeepSeek). El prompt del pas 4 NO fixa el format intern — DeepSeek tendeix a taules. **No canviïs el parser sense re-verificar els 3 casos de test** (EIOPA CA/ES nous + UNEPFI antic).

Resum de formats acceptats per bloc:

| Bloc | Format vell (llistes) | Format nou (DeepSeek) |
|------|----------------------|----------------------|
| 0 Semàfor | `- **Nom**: estat — nota` + `Nota global: A · ...` | Taula `\| Indicador \| Estat \| Nota \|` + `**Grau: A** — ...` (ES: `**Grado: B**`, indicadors `- **Verde** · Nombre: valor — nota`) |
| 1 Fitxa | Llista `- Clau: valor` | Llista `- Clau: valor` |
| 2 Dades clau | `1. **valor** — label (p. X)` | `1. **valor** — label (p. X)` (idèntic) |
| 3 Resum | Paràgraf | Paràgraf |
| 4 Implicacions | `### Empreses` / `### Reguladors` / `### Ciutadans` / `### Més enllà` | `**Empreses**` (negreta, també amb 2 espais de línia dura) |
| 5 Connexions | `- **Type** — target: desc` | `- **Evolució:** X → Y` (dos punts dins o fora de la negreta) o taula |
| 6 Accions | `01. **títol** — desc` + `- Esforç: X · Impacte: Y` | Taula `\| # \| Títol \| Descripció \| Esforç \| Impacte \|` o `**01 — Títol**\ndesc\n*Esfuerzo: X \| Impacto: Y*` (ES) |
| 7 Cross-ref | `- **Marc** — criteri: impact` | Taula `\| Marc \| Criteri \| Impacte \|` (CA/ES) |

**Normes del parser**:
- Els títols de bloc es normalitzen: `Bloque` (ES) → `Bloc` abans de comparar
- El grau accepta `Nota global:` / `Grau:` / `Grado:`
- Els estats accepten català (verd/groc/vermell) i castellà (verde/amarillo/rojo)
- Els fitxers poden tenir `
\n` (CRLF) — els regex ho tenen en compte

## Scripts (tots a `/scripts/`)

| Script | Pas | Què fa |
|--------|-----|--------|
| `01-nemotron-detecta.py` | 1 | Gemini free cerca informes nous a les fonts institucionals (FONT_URLS) i descarrega PDFs a 0-originals/ |
| `02-glm-distilla.py` | 2 | Llegeix PDFs, crida DeepSeek v4 Pro, guarda JSON destil·lat |
| `03-gemini-revisa.py` | 3 | Crida Gemini 3.6 Flash (crític + advocat del diable, API de pagament), guarda JSON d'aportacions |
| `04-glm-redacta.py` | 4 | Crida DeepSeek v4 Pro per redactar Markdown integrant aportacions de Gemini |
| `05-gemini-ortografia.py` | 5 | Crida Gemini free per corregir ortografia (text lliure, NO JSON) |
| `genera-pdf-informe.py` | 5b | Converteix Markdown a PDF amb plantilla oficial |
| `puja-a-drive.py` | 5c | Puja PDFs i MDs a Drive /4-revisats-ortografia/ |

> Nota: el pas 7 (publicació web) s'executa des d'Hermes amb DeepSeek v4 Pro; no hi ha script dedicat al repositori.

## Configuració tècnica

- **Gemini free**: `gemini-3-flash-preview` amb clau `GEMINI_FREE_API_KEY` (free tier, `AIza...`) a `assets/web/.env.local`. Retry automàtic: si l'API respon 429, espera 60 s i reintenta (`call_gemini_safe` a `config.py`).
- **DeepSeek v4 Pro**: `deepseek-v4-pro` amb clau `HERMES_CUSTOM_DEEPSEEK_API_KEY_API_KEY`.
- **Gemini 3.6 Flash (pagament)**: `gemini-3.6-flash` amb clau `GEMINI_API_KEY` (compte PRO de Google AI Studio). Ús restringit al pas 3 per contenir costos.
- **Drive**: OAuth d'usuari amb refresh token.
- **PDF**: pandoc NO (genera HTML directament amb Python) → weasyprint per HTML→PDF.

## IMPORTANT

- Cap informe publicat sense validació de Paolo (pas 6).
- Tots els passos intermedis queden a Drive per auditabilitat.
- Gemini té dos rols: **crític** (pas 3, retorna JSON estructurat, model de pagament) i **corrector** (pas 5, retorna Markdown corregit, model free).
- Els passos 1 i 5 són gratuïts per disseny (Gemini free tier); el pas 3 és l'únic que consumeix API de pagament.
