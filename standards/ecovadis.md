# EcoVadis — Fitxa d'expert

> ⚠️ **DOCUMENT INTERN DE CRITERI ESG — NO PÚBLIC.**
> Font de coneixement rellevant sobre EcoVadis per fer cross-references al pipeline.
> Això és el model mental d'un expert — NO tota la metodologia oficial.
> **⏳ PENDENT DE VALIDACIÓ DE PAOLO — NO usar en producció fins que estigui validada.**
> Última revisió: 20-08-2026 · Propera revisió: 20-09-2026 (o quan es detecti un canvi a les fonts oficials).

> ⚠️ **NOTA DE FONT**: el fitxer `certifications/ecovadis-methodology.pdf` és en realitat un HTML corrupte ("Page not found" — descàrrega fallida). Aquesta fitxa es basa en el **coneixement expert del model**; els criteris literals de la metodologia oficial s'han de verificar quan es re-descarregui el document. **Mentre no hi hagi document oficial: marcar els crossRefs EcoVadis com a "baixa confiança" i no inventar cites literals de criteris.**

---

## 1. Què és + abast + a qui obliga
Plataforma comercial de **ratings de sostenibilitat de cadena de subministrament**. EcoVadis avalua proveïdors (no els avalua l'empresa mateixa: els **compradors** demanen l'avaluació als seus proveïdors). Cada empresa rep un **score 0–100** i una **medalla**: Bronze (45–54), Silver (55–64), Gold (65–74), Platinum (75+). L'avaluació es basa en: qüestionari sectorial + **evidències documentals** + **360° Watch** (monitoratge de notícies i alertes externes sobre l'empresa). Reavaluació anual (o quan el comprador ho exigeix). **No és obligatori per llei**, però és de facto un estàndard de fet en licitacions i cadenes de subministrament globals (automoció, moda, alimentació, farmàcia...).

**Rellevància de mercat**: >130.000 empreses avaluades; usat per >1.000 multinacionals compradores. És la certificació ESG més estesa en B2B (per sobre de B Corp en volum).

## 2. Estructura (4 temes, 21 criteris ponderats)
Els **pesos dels 4 temes varien per indústria** (la indústria determina la materialitat):

- **Environment** (7 criteris): Energia i GHG, Aigua, Biodiversitat, Contaminació, Materials/Residus/Circularitat, ...
- **Labor & Human Rights** (7 criteris): Salut i Seguretat, Condicions de treball, Relacions laborals, Drets humans, Treball infantil/forçós, ...
- **Ethics** (4 criteris): Corrupció/suborn, Pràctiques anticompetitives, Seguretat de la informació, ...
- **Sustainable Procurement** (3 criteris): Pràctiques ambientals dels proveïdors, Pràctiques socials dels proveïdors, ...

**Pesos indicatius per defecte**: Environment ~25-30%, Labor ~25-30%, Ethics ~20%, Procurement ~15-25% (segons sector). **Verificar amb el document oficial quan es descarregui.**

### 2b. MAPA TEMÀTIC (tema → criteris EcoVadis i documents oficials)
> **Ús al pipeline**: quan el pas 2 detecti el tema d'un informe, obrir NOMÉS els documents marcats amb aquest tema per afinar el crossRef.

| Tema de l'informe | Criteris EcoVadis afectats | Documents oficials a `certifications/` |
|---|---|---|
| **Canvi climàtic** | Energy & GHG, Contaminació, Materials/Circularitat | `ecovadis-methodology.pdf` — **⛔ CORRUPTE (re-descarregar)** |
| **Natura / biodiversitat** | Biodiversitat, Aigua, Materials/Residus | `ecovadis-methodology.pdf` — **⛔ CORRUPTE** |
| **Social / laboral** | Salut i Seguretat, Condicions de treball, Relacions laborals, Drets humans, Treball infantil/forçós | `ecovadis-methodology.pdf` — **⛔ CORRUPTE** |
| **Ètica / anticorrupció** | Corrupció, Pràctiques anticompetitives, Seguretat de la informació | `ecovadis-methodology.pdf` — **⛔ CORRUPTE** |
| **Cadena de subministrament / diligència** | Pràctiques ambientals i socials dels proveïdors (Sustainable Procurement) | `ecovadis-methodology.pdf` — **⛔ CORRUPTE** |

> **Regla de documents**: mentre `ecovadis-methodology.pdf` sigui corrupte, cap crossRef EcoVadis pot citar criteris literals → **criterion genèric + nota de baixa confiança** (ex: "criteri d'energia i GHG (pendent de verificació del document oficial)").

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
