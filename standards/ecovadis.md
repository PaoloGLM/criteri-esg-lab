# EcoVadis — Fitxa d'expert

> ⚠️ **DOCUMENT INTERN DE CRITERI ESG — NO PÚBLIC.**
> Font de coneixement rellevant sobre EcoVadis per fer cross-references al pipeline.
> Això és el model mental d'un expert — NO tota la metodologia oficial.
> **⏳ PENDENT DE VALIDACIÓ DE PAOLO — NO usar en producció fins que estigui validada.**
> Última revisió: 20-08-2026 · Propera revisió: 20-09-2026 (o quan es detecti un canvi a les fonts oficials).
> ✅ **Document oficial verificat**: `certifications/ecovadis-methodology.pdf` ("EcoVadis Ratings Methodology Overview and Principles", V2.4, 2018/2020, 537 pàg.) — re-descarregat el 20-08-2026 (l'anterior era un HTML corrupte). Els criteris literals citats a la secció 2 provenen d'aquest document.

---

## 1. Què és + abast + a qui obliga
Plataforma comercial de **ratings de sostenibilitat de cadena de subministrament**. EcoVadis avalua proveïdors (no els avalua l'empresa mateixa: els **compradors** demanen l'avaluació als seus proveïdors). Cada empresa rep un **score 0–100** i una **medalla**: Bronze (45–54), Silver (55–64), Gold (65–74), Platinum (75+). L'avaluació es basa en: qüestionari sectorial + **evidències documentals** + **360° Watch** (monitoratge de notícies i alertes externes sobre l'empresa). Reavaluació anual (o quan el comprador ho exigeix). **No és obligatori per llei**, però és de facto un estàndard de fet en licitacions i cadenes de subministrament globals (automoció, moda, alimentació, farmàcia...).

**Rellevància de mercat**: >130.000 empreses avaluades; usat per >1.000 multinacionals compradores. És la certificació ESG més estesa en B2B (per sobre de B Corp en volum).

## 2. Estructura (4 temes, 21 criteris — segons document oficial V2.4)
Els **pesos dels 4 temes varien per indústria** (la indústria determina la materialitat; la companyia es classifica per sector, mida i ubicació).

### Els 21 criteris oficials (document V2.4)

**ENVIRONMENT** (7):
1. Energy Consumption & GHGs
2. Water
3. Biodiversity
4. Local & Accidental Pollution
5. Materials, Chemicals & Waste
6. Products (Product Use)
7. Product End-of-Life + Customer Health & Safety + Environmental Services & Advocacy *(aquests tres darrers formen part del bloc de Productes)*

**LABOR & HUMAN RIGHTS** (7):
1. Employee Health & Safety
2. Working Conditions
3. Social Dialogue
4. Career Management & Training
5. Human Rights (Child Labor, Forced Labor & Human Trafficking)
6. Diversity, Discrimination & Harassment
7. External Stakeholder Human Rights

**ETHICS** (4):
1. Corruption
2. Anticompetitive Practices
3. Responsible Information Management
4. (i compromisos basats en UN Global Compact, OIT, DUDH, Convenció Anti-corrupció)

**SUSTAINABLE PROCUREMENT** (3):
1. Supplier Environmental Practices
2. Supplier Social Practices
3. (sostenibilitat en la gestió de la cadena de subministrament en general)

> **Nota**: la numeració exacta i els pesos per tema/indústria es detallen a les pàgines següents del document (V2.4); consultar el PDF per a la distribució precisa abans de citar un pes concret.

### Com s'avalua (metodologia — clau per al crossRef)

1. **Qüestionari sectorial** adaptat per indústria, mida i ubicació de la companyia
2. **Evidències documentals**: l'empresa aporta documents (polítiques, certificacions, informes) que avalen les respostes
3. **360° Watch**: monitoratge continu de fonts externes (mitjans, ONG, sancions, litigis) que pot afegir alertes positives o negatives al perfil
4. **Puntuació per tema**: cada tema es puntua sobre la qualitat del sistema de gestió (polítiques → accions → resultats)
5. **Score global 0–100** ponderat per indústria → **Medalles**: Bronze (45–54), Silver (55–64), Gold (65–74), Platinum (75+)
6. **Reavaluació** anual o quan el comprador ho demana

> **Ús al crossRef**: l'impacte d'un informe institucional sobre EcoVadis es concreta en (a) quins criteris toca, (b) com canvia el pes/rellevància del tema, (c) com afecta el 360° Watch (risc reputacional/sancions).

### 2b. MAPA TEMÀTIC (tema → criteris EcoVadis i documents oficials)
> **Ús al pipeline**: quan el pas 2 detecti el tema d'un informe, obrir NOMÉS els documents marcats amb aquest tema per afinar el crossRef.

| Tema de l'informe | Requisits EcoVadis concrets (criterion) | Documents oficials a `certifications/` |
|---|---|---|
| **Canvi climàtic** | ENV-1 Energy Consumption & GHGs · ENV-4 Local & Accidental Pollution · ENV-5 Materials, Chemicals & Waste | `ecovadis-methodology.pdf` ✅ (537 pàg.) |
| **Natura / biodiversitat** | ENV-2 Water · ENV-3 Biodiversity · ENV-5 Materials, Chemicals & Waste | `ecovadis-methodology.pdf` ✅ |
| **Social / laboral** | LAB-1 Employee Health & Safety · LAB-2 Working Conditions · LAB-3 Social Dialogue · LAB-4 Career Mgmt & Training · LAB-6 Diversity & Non-discrimination | `ecovadis-methodology.pdf` ✅ |
| **Ètica / anticorrupció** | ETH-1 Corruption · ETH-2 Anticompetitive Practices · ETH-3 Responsible Information Management | `ecovadis-methodology.pdf` ✅ |
| **Drets humans / cadena de subministrament** | LAB-5 Human Rights (child/forced labor) · LAB-7 External Stakeholder HR · PROC-1 Supplier Environmental Practices · PROC-2 Supplier Social Practices | `ecovadis-methodology.pdf` ✅ |

> **Regla de documents**: el document oficial està disponible; els criteris citats als crossRefs EcoVadis s'han de poder rastrejar al PDF (indicar secció/pàgina quan sigui possible). Els codis ENV-/LAB-/ETH-/PROC- són la nomenclatura interna Criteri per als criteris del document V2.4.

## 3. Interoperabilitat (clau per al cross-ref)
- **CSRD/ESRS**: EcoVadis ven un mòdul d'alineació amb ESRS/CSRD; els seus qüestionaris demanen dades que coincideixen amb els disclosures ESRS (doblement rellevant des de l'Omnibus I)
- **CSDDD**: la diligència deguda de cadena de valor (CSDDD) es pot "provar" amb una avaluació EcoVadis — EcoVadis es posiciona com a eina de suport al compliment CSDDD
- **GRI**: el qüestionari EcoVadis es basa en part en indicadors GRI; una empresa amb reporting GRI madur té avantatge a l'avaluació
- **ISO 26000 / SGE 21**: marcs de referència del qüestionari (sobretot a Europa)
- **360° Watch**: alertes de tercers (ONG, mitjans, sancions) — connecta amb "Punts d'impacte" de regulació (sancions, litigis)

## 4. ⚠️ VIGILÀNCIA DE CANVIS (comprovar a la revisió periòdica, NO a cada informe)
### Fonts oficials
- Metodologia: https://support.ecovadis.com/hc/es (help center, secció "EcoVadis Ratings Methodology")
- Notícies: https://ecovadis.com/blog/ (monitoritzat pel script `vigila-estandards.py`)

### Canvis coneguts / a vigilar
- **Revisió periòdica de la metodologia**: EcoVadis actualitza pesos i criteris amb avís previ (històricament canvis menors cada 1-2 anys; verificar al help center)
- **Alineació CSRD**: nous mòduls/preguntes alineades amb ESRS (2025-2026)
- **Medalles i llindars**: revisar que els llindars Bronze/Silver/Gold/Platinum no hagin canviat (històricament estables)

## 5. Punts d'impacte típics (quan un informe institucional toca EcoVadis)
Quan apareix un informe nou (BCE, EIOPA, EBA, ESMA, reguladors), pot afectar EcoVadis en:
1. **Diligència de cadena de valor (CSDDD)**: noves obligacions per a compradors → més demandes d'avaluació EcoVadis als proveïdors
2. **Reporting ESG obligatori (CSRD)**: les dades que es demanen a EcoVadis coincideixen amb ESRS → sinergies i doble treball
3. **Risc de sancions/litigis**: si l'informe esmenta sancions o casos de greenwashing → impacta el 360° Watch i l'score
4. **Noves regulacions sectorials**: bateries (EU Battery Regulation), treball forçós (UFLPA), deforestació (EUDR) → criteris nous o pes més gran
5. **Pressió de compradors**: si els reguladors pressionen les multinacionals, aquestes traslladen la pressió als proveïdors

## 6. Accions tipus que se'n deriven (per a una empresa avaluada per EcoVadis)
- Revisar la **scorecard** actual: temes i criteris amb pitjor puntuació vs. el nou requisit regulador
- **Millorar evidències documentals** dels criteris afectats (EcoVadis és molt sensible a la qualitat de les evidències)
- Preparar **dades alineades ESRS/GRI** per al qüestionari (evitar doble feina)
- Verificar que el **360° Watch** no tingui alertes negatives (mitjans, sancions, litigis)
- Si l'empresa és proveïdora: anticipar la **demanda d'avaluació** dels seus clients compradors (preparar documents, calendari)

## 7. CRITERIS D'INTENSITAT (com assignar Alt / Mitjà / Baix a cada crossRef)

| Intensitat | Quan aplicar-la | Exemple real |
|---|---|---|
| **ALT** | L'informe canvia l'**obligació de diligència** de cadena de valor (CSDDD) o el **reporting obligatori** que EcoVadis demana (CSRD/ESRS); o introdueix **sancions/litigis** que afecten l'score; o una **nova regulació sectorial** (bateries, EUDR, UFLPA) que canvia criteris | CSDDD aprovat → els compradors exigeixen avaluacions EcoVadis als proveïdors (canvi d'exigència de mercat) |
| **MITJÀ** | L'informe **esmenta o alinea** EcoVadis/ratings de cadena de subministrament sense canviar obligacions; o afecta un **subconjunt** d'empreses (sector, mida); o introdueix expectatives de transparència | Un informe del BCE sobre risc climàtic que recomana verificar proveïdors amb ratings ESG (sense obligació) |
| **BAIX** | L'informe toca el tema de forma **tangencial** (menció general de ratings de sostenibilitat) o l'impacte és **indirecte/teòric** | Un informe que esmenta "certificacions ESG" com a dada de mercat sense canvis pràctics |

> **Regla**: quan hi hagi dubte entre dos nivells, triar el **més baix** (evitar alarmisme). La intensitat es pot revisar a la validació d'en Paolo.

## 8. Meta
- Data d'última revisió: **20-08-2026**
- Propera revisió programada: **20-09-2026** (mensual) o **abans si el pas 1 detecta un canvi** a les fonts oficials EcoVadis
- Validació: **⏳ PENDENT DE PAOLO** (no usar en producció fins a validació)
- **Pendent**: re-descarregar `certifications/ecovadis-methodology.pdf` (el fitxer actual és un HTML corrupte "Page not found")
