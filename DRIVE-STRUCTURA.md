# Estructura del Drive Criteri ESG

> Referència del Drive de Google (compte de la Roser) per a l'agent i l'equip.
> Aquest document és el "lloc gran" on viuen els detalls que no caben a la memòria d'Hermes.
> **Actualitzat: 22-08-2026**

---

## Arrel

El Drive té **2 carpetes arrel** del compte de la Roser (`iaiarous.pg@gmail.com`), que són les compartides del projecte:

1. **`Criteri ESG`** — id: `1HGRugtsRGDN3su_n_dbd9y1p8VkyuUgG`
2. **`Criteri ESG Informes`** — carpetes de flux `0-originals` … `6-publicats`

> Nota: originalment les carpetes són del compte `davidbm.eno@gmail.com` (compartides a la Roser com a writer).

---

## Carpeta `Estàndards ESG` (creada 22-08-2026)

Ubicada dins de **`Criteri ESG`**. Id: `1HQ96V8g6tofmny1YLBa8Tz450OykQZk4`

Conté **16 subcarpetes**, una per estàndard de `certifications/`, cada una amb el document oficial corresponent:

| Subcarpeta | Document | Estat ∈ `certifications/` |
|---|---|---|
| `csrd-esrs` | esrs-delegated-act.html | ✅ HTML correcte |
| `csddd` | csddd-directive.html | ✅ |
| `sfdr` | sfdr-regulation.html | ✅ |
| `taxonomia-ue` | eu-taxonomy-delegated-act.html | ✅ |
| `emas` | emas-regulation.html | ✅ |
| `gri` | gri-universal-standards-2021.pdf | ⛔ **CORRUPTE — re-descarregar** |
| `ecovadis` | ecovadis-methodology.pdf | ✅ PDF vàlid (537 pàg., re-desc. 20-08) |
| `msci-esg` | msci-esg-methodology.pdf | ⛔ **CORRUPTE — re-descarregar** |
| `b-corp` | b-impact-assessment.pdf | ⛔ **CORRUPTE — re-descarregar** |
| `cdp` | cdp-questionnaire.html | ✅ |
| `sge-21` | sge21-guia.pdf | ⛔ **CORRUPTE — re-descarregar** |
| `sustainalytics` | sustainalytics-methodology.html | ✅ |
| `sasb` | sasb-conceptual-framework.pdf | ✅ PDF vàlid |
| `tnfd` | tnfd-framework.pdf | ⛔ **CORRUPTE — re-descarregar** |
| `tcfd` | tcfd-recommendations.pdf | ✅ PDF vàlid |
| `iso-26000` | iso-26000-2010.pdf | ✅ PDF vàlid |

> **Lliçó (20-08-2026)**: les descàrregues del 19-07-2026 sovint eren pàgines HTML d'error desades amb extensió `.pdf`. **Sempre verificar amb `file`** que un `.pdf` sigui realment un PDF.
>
> Les 5 subcarpetes marcades ⛔ tenen el document **corrupte** a `certifications/`; cal substituir-lo pel PDF vàlid quan es re-descarregui.

---

## Altres

- **`mockups-homepage`** — id: `1Ib2-1RaxvKPoW51pWBViGcM6glVSauEj`. Conté els mockups de la pàgina web (versions base/desktop/mòbil).

---

## OAuth

- Token OAuth de la Roser: `~/AppData/Local/hermes/google_token.json`
- **Estat**: reautenticat el **22-08-2026** amb scopes `drive` + `documents` (l'anterior havia caducat).
- Si torna a caducar: regenerar la URL d'autorització amb el setup d'Hermes i repetir l'intercanvi del codi.
