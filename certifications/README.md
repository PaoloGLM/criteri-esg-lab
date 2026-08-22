# Documents oficials de certificacions i frameworks ESG

Aquest directori conté els documents oficials de cada estàndard ESG.
Z.ai-bot els carrega al seu context quan processa el bloc 7 (cross-reference)
de cada informe, per poder comparar directament l'informe amb els criteris
oficials de cada certificació.

## Documents descarregats (19 juliol 2026)

| # | Estàndard | Fitxer | Mida | Estat |
|---|-----------|--------|------|-------|
| 1 | EcoVadis | ecovadis-methodology.pdf | 150 KB | ❌ **CORRUPTE** (és un HTML "Page not found" — re-descarregar) |
| 2 | B Corp | b-impact-assessment.pdf | — | ❌ Pendent (web bloqueja descàrrega) |
| 3 | MSCI ESG | msci-esg-methodology.pdf | 62 KB | ✓ |
| 4 | GRI | gri-universal-standards-2021.pdf | 78 KB | ✓ |
| 5 | CSRD/ESRS | esrs-delegated-act.html | 5.6 MB | ✓ |
| 6 | CSDDD | csddd-directive.html | 809 KB | ✓ |
| 7 | SFDR | sfdr-regulation.html | 430 KB | ✓ |
| 8 | Taxonomía UE | eu-taxonomy-delegated-act.html | 5.0 MB | ✓ |
| 9 | TCFD | tcfd-recommendations.pdf | 2.5 MB | ✓ |
| 10 | TNFD | tnfd-framework.pdf | 87 KB | ✓ |
| 11 | CDP | cdp-questionnaire.html | 11 KB | ✓ |
| 12 | ISO 26000 | iso-26000-2010.pdf | 1.9 MB | ✓ (enviat per Paolo) |
| 13 | SGE 21 | sge21-guia.pdf | 372 KB | ✓ |
| 14 | Sustainalytics | sustainalytics-methodology.html | 220 KB | ✓ |
| 15 | SASB | sasb-conceptual-framework.pdf | 365 KB | ✓ |
| 16 | EMAS | emas-regulation.html | 890 KB | ✓ |

## Pendents

- B Corp: descarregar manualment des de https://www.bcorporation.net/en-us/standards/

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
