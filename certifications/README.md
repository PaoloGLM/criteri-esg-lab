# Documents oficials de certificacions i frameworks ESG

Aquest directori conté els documents oficials de cada estàndard ESG.
Z.ai-bot els carrega al seu context quan processa el bloc 7 (cross-reference)
de cada informe, per poder comparar directament l'informe amb els criteris
oficials de cada certificació.

## Documents (estat verificat el 20-08-2026: cada fitxer inspeccionat amb `file`)

| # | Estàndard | Fitxer | Estat real | Acció |
|---|-----------|--------|------------|-------|
| 1 | EcoVadis | ecovadis-methodology.pdf | ✅ PDF vàlid (537 pàg., re-descarregat 20-08) | — |
| 2 | B Corp | b-impact-assessment.pdf | ❌ **HTML corrupte** (no és PDF) | Descarregar manualment (bcorporation.net bloqueja bots) |
| 3 | MSCI ESG | msci-esg-methodology.pdf | ❌ **HTML corrupte** (no és PDF) | Re-descarregar |
| 4 | GRI | gri-universal-standards-2021.pdf | ❌ **HTML corrupte** (no és PDF) | Re-descarregar (gratuït a globalreporting.org) |
| 5 | CSRD/ESRS | esrs-delegated-act.html | ✅ HTML correcte | — |
| 6 | CSDDD | csddd-directive.html | ✅ HTML correcte | — |
| 7 | SFDR | sfdr-regulation.html | ✅ HTML correcte | — |
| 8 | Taxonomía UE | eu-taxonomy-delegated-act.html | ✅ HTML correcte | — |
| 9 | TCFD | tcfd-recommendations.pdf | ✅ PDF vàlid | — |
| 10 | TNFD | tnfd-framework.pdf | ❌ **HTML corrupte** (no és PDF) | Re-descarregar |
| 11 | CDP | cdp-questionnaire.html | ✅ HTML correcte | — |
| 12 | ISO 26000 | iso-26000-2010.pdf | ✅ PDF vàlid | — |
| 13 | SGE 21 | sge21-guia.pdf | ❌ **HTML corrupte** (no és PDF) | Re-descarregar |
| 14 | Sustainalytics | sustainalytics-methodology.html | ✅ HTML correcte | — |
| 15 | SASB | sasb-conceptual-framework.pdf | ✅ PDF vàlid | — |
| 16 | EMAS | emas-regulation.html | ✅ HTML correcte | — |

> ⚠️ **Lliçó apresa (20-08-2026)**: les descàrregues del 19-07-2026 que semblaven "✓" eren moltes pàgines HTML d'error desades amb extensió .pdf. **Sempre verificar amb `file`** que un .pdf sigui realment un PDF abans de donar-lo per bo.

## Pendents (descarregar manualment)

- B Corp: https://www.bcorporation.net/en-us/standards/ (web bloqueja bots)
- GRI Universal 2021: https://www.globalreporting.org/standards/download-the-standards/ (gratuït, requereix registre)
- MSCI ESG Methodology: https://www.msci.com/esg-ratings (requereix registre)
- SGE 21: https://www.foretica.org/ (guia de Forética)
- TNFD Framework: https://tnfd.global/publication/ (gratuït)

## Ús

Quan Z.ai-bot processa un informe, carrega al context:
1. L'informe original (PDF extret a text)
2. Els documents de les certificacions rellevants per a aquell informe

Per al bloc 7 (cross-reference), selecciona els 4 estàndards de MAJOR impacte
detectat (no necessàriament els mateixos 4 per a cada informe). La selecció
es basa en comparar directament el contingut de l'informe amb els criteris
oficials de cada certificació.

## Pendent

- B Corp: descarregar manualment des de https://www.bcorporation.net/en-us/standards/
- ISO 26000: Paolo enviarà el document
