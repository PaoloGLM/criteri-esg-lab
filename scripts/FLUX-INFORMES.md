# Flux de creació d'informes Criteri ESG

> **Flux oficial** — 24 juliol 2026. Substitueix versions anteriors.
> LLEGEIX AQUEST FITXER ABANS DE COMENÇAR QUALSEVOL TASCA D'INFORMES.

## El flux (7 passos)

```
1. GLM detecta  →  PDFs originals a Drive /0-originals/
2. GLM destil·la  →  JSON destil·lats a Drive /1-distilats/
3. Gemini revisa  →  JSON d'aportacions a Drive /2-aportacions-gemini/
4. GLM redacta  →  Markdown CA+ES a Drive /3-fets/
5. Gemini ortografia  →  Markdown corregits a Drive /4-revisats-ortografia/
                          + PDF generat amb plantilla oficial Criteri ESG
6. Paolo valida  →  llegeix el PDF, si està bé el mou a /5-validats-paolo/
7. GLM puja a la web  →  publica a /informes/[slug] + mou a /6-publicats/
```

## Actors

- **GLM (jo, Z.ai-bot)**: passos 1, 2, 4, 7. Fa servir `z-ai-web-dev-sdk`.
- **Gemini 2.5 Flash**: passos 3, 5. Fa servir **Vertex AI europe-west1** amb Service Account `criteri-bot@criteri-esg.iam.gserviceaccount.com`. El model `gemini-2.0-flash` ha estat retirat per Google.
- **Paolo**: pas 6 (validació humana, no negociable).

## Pujada a Drive

Es fa amb **OAuth d'usuari** (no Service Account), fent servir:
- `/home/z/my-project/.gcp-oauth-tokens.json` — tokens (es refresquen automàticament)
- `/home/z/my-project/.gcp-oauth-client.json` — client_id i client_secret

El Service Account `criteri-bot@...` no té quota d'emmagatzematge. **Sempre fer servir OAuth d'usuari per pujar.**

## Format dels PDFs (carpeta 4)

Els PDFs es generen amb la **plantilla HTML oficial Criteri ESG** (basada en `pilot-informe-foretica-amb-semafor-i-mes-enlla.html`):
- Paleta: terra+coure (#2C1810, #5C3A1E, #B87333, #E8C99A, #F5EFE6)
- Fonts: Fraunces (serif per títols), Inter (sans per text), JetBrains Mono (código/labels)
- Estructura visual dels 8 blocs amb targetes, grid de dades, semàfor amb colors verd/groc/vermell
- Footer amb disclaimer de processament IA

Script: `scripts/genera-pdf-informe.py <slug> <ca|es>`

## Scripts (tots a `/scripts/`)

| Script | Pas | Què fa |
|--------|-----|--------|
| `02-glm-distilla.py` | 2 | Llegeix PDFs, crida GLM, guarda JSON destil·lat |
| `03-gemini-revisa.py` | 3 | Crida Gemini (crític + advocat del diable), guarda JSON d'aportacions |
| `04-glm-redacta.py` | 4 | Crida GLM per redactar Markdown integrant aportacions de Gemini |
| `05-gemini-ortografia.py` | 5 | Crida Gemini per corregir ortografia (text lliure, NO JSON) |
| `genera-pdf-informe.py` | 5b | Converteix Markdown a PDF amb plantilla oficial |
| `puja-a-drive.py` | 5c | Pugen PDFs i MDs a Drive /4-revisats-ortografia/ |
| `run-flux.sh` | 1-5 | Orquestra tots els passos |

## Configuració tècnica

- **Gemini**: `gemini-2.5-flash` via `https://europe-west1-aiplatform.googleapis.com` amb Service Account (rol `Vertex AI User`).
- **GLM**: `z-ai-web-dev-sdk` via subprocess Node.
- **Drive**: OAuth d'usuari amb refresh token.
- **PDF**: pandoc NO (genera HTML directament amb Python) → weasyprint per HTML→PDF.

## IMPORTANT

- Cap informe publicat sense validació de Paolo (pas 6).
- Tots els passos intermedis queden a Drive per auditabilitat.
- Gemini té dos rols: **crític** (pas 3, retorna JSON estructurat) i **corrector** (pas 5, retorna Markdown corregit).
- El model `gemini-2.0-flash` NO està disponible. Fer servir `gemini-2.5-flash`.
