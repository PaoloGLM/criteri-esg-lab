# GRI — Fitxa d'expert (Global Reporting Initiative)

> ⚠️ **DOCUMENT INTERN DE CRITERI ESG — NO PÚBLIC.**
> Font de coneixement rellevant sobre GRI per fer cross-references al pipeline.
> Això és el model mental d'un expert — NO tota la normativa (60+ estàndards).
> **⏳ PENDENT DE VALIDACIÓ DE PAOLO — NO usar en producció fins que estigui validada.**
> Última revisió: 20-08-2026 · Propera revisió: 20-09-2026 (o quan es detecti un canvi als informes oficials).

---

## 1. Què és + abast + a qui obliga
Marc **voluntari** de reporting de sostenibilitat, el més usat del món. Emès pel GRI (Global Reporting Initiative, Amsterdam). Qualsevol organització pot fer-lo servir per informar dels seus **impactes** econòmics, ambientals i socials. **No és obligatori** per llei (excepte on una regulació el referenciï explícitament). El GSSB (Global Sustainability Standards Board) en governa el desenvolupament.

**Rellevància de mercat**: >10.000 organitzacions al món l'usen; de facto el "denominador comú" del reporting voluntari, i la base de qualsevol sistema de reporting quan CSRD/ESRS no aplica.

## 2. Estructura (3 sèries interconnectades)
- **Universal Standards** (obligatoris per a qualsevol usuari GRI):
  - GRI 1: Foundation — principis: impacte, materialitat d'impacte, doble materialitat, stakeholders, due diligence
  - GRI 2: General Disclosures — perfil organitzatiu, governança, estratègia, implicació d'stakeholders
  - GRI 3: Material Topics — determinació dels temes materials
- **Sector Standards** (obligatoris per al sector corresponent): GRI 11 Oil&Gas, GRI 12 Coal, GRI 13 Agricultura/Aqüicultura/Pesca, **GRI 14 Mining (efectiu 01-01-2026)**...
- **Topic Standards** (desenes, segons materialitat): GRI 201 Econòmic, GRI 205 Anti-corrupció, GRI 302 Energia, GRI 303 Aigua, GRI 305 Emissions, GRI 306 Residus, GRI 403 Salut i Seguretat, GRI 405 Diversitat, **GRI 101 Biodiversitat (2024, efectiu 01-01-2026)**, **GRI 102 Clima (2025, efectiu 01-01-2027)**, **GRI 103 Energia (2025, efectiu 01-01-2027)**...

### 2b. MAPA TEMÀTIC (tema → requisits concrets GRI)
> **Ús al pipeline**: quan el pas 2 detecti el tema d'un informe, obrir NOMÉS els documents marcats amb aquest tema per afinar el crossRef. Els temes es poden solapar.
> ⚠️ **Estat documental (20-08-2026)**: `gri-universal-standards-2021.pdf` és un **HTML corrupte** (no és PDF) — PENDENT de re-descarregar. Fins aleshores, els requisits concrets següents són **de domini públic estable però NO verificats al document oficial** → marcar els crossRefs com a "criterion de baixa confiança" fins que es pugui contrastar.

| Tema de l'informe | Requisits GRI concrets (criterion) | Documents oficials a `certifications/` |
|---|---|---|
| **Canvi climàtic** | GRI 305-1 Direct GHG emissions · GRI 305-2 Energy indirect GHG · GRI 305-3 Other indirect GHG · GRI 302-1 Energy consumption · GRI 201-2 Climate implications | `gri-universal-standards-2021.pdf` ⛔ **corrupte — re-descarregar** |
| **Natura / biodiversitat** | GRI 101-1/101-2/101-3 (Biodiversitat 2024) · GRI 303-3 Water withdrawal · GRI 306-3 Waste generated | `gri-universal-standards-2021.pdf` ⛔ **corrupte** |
| **Energia / transició** | GRI 302-1/302-2/302-4 (Energia) · GRI 103-1/103-2 (Energia 2025) · GRI 305-1 | `gri-universal-standards-2021.pdf` ⛔ **corrupte** |
| **Social / laboral** | GRI 401-1 New hires · GRI 403-9 Work-related injuries · GRI 404-1 Training hours · GRI 405-1 Diversity · GRI 406-1 Discrimination incidents | `gri-universal-standards-2021.pdf` ⛔ **corrupte** |
| **Drets humans / cadena de valor** | GRI 2-23 Policy commitments (DH) · GRI 412-1/412-2 Human rights assessments · GRI 408-1 Child labor · GRI 409-1 Forced labor · GRI 414-1 Supplier social screening | `gri-universal-standards-2021.pdf` ⛔ **corrupte** |
| **Governança / ètica** | GRI 205-1/205-2/205-3 Anti-corruption · GRI 206-1 Anticompetitive · GRI 207-1 Tax approach · GRI 2-9 Governance structure | `gri-universal-standards-2021.pdf` ⛔ **corrupte** |
| **Sectorial** (oil&gas, carbó, agricultura, mineria) | GRI 11 / GRI 12 / GRI 13 / GRI 14 (Sector Standards) | Sector Standards: ⛔ **pendents de descarregar** |

> **Regla de documents**: mentre `gri-universal-standards-2021.pdf` sigui corrupte, cap crossRef GRI pot citar requisits amb seguretat documental → **criterion amb nota de baixa confiança** ("requisit de domini públic, pendent de verificació del document oficial") i mai inventar numeracions alternatives.

## 3. Interoperabilitat (clau per al cross-ref)
- **CSRD/ESRS**: interoperabilitat alta però diferències: ESRS obligatori vs GRI voluntari; ESRS = doble materialitat + **assegurament extern independent**; GRI = materialitat d'impacte sense assegurament obligatori
- **Omnibus I (2025)**: l'abast del CSRD es redueix (des de FY2027: >450M€ facturació I >1.000 empleats). Moltes empreses (pimes cotitzades, no-PIE, tercers països) **tornen a GRI com a marc principal**
- **IFRS/ISSB**: reafirmada la complementarietat GRI+IFRS (26-05-2026). GRI = impactes; ISSB = riscos/oportunitats financeres. La **GRI Sustainability Taxonomy** (machine-readable) busca interoperabilitat digital amb ISSB i CSRD
- **CDP**: alineació GRI-CDP per a disclosures més coherents (28-04-2026)
- **TNFD**: alineació creixent en divulgació de natura (GRI 101 Biodiversitat)

## 4. ⚠️ VIGILÀNCIA DE CANVIS (comprovar a la revisió periòdica, NO a cada informe)
### Efectius recentment
- **GRI 101 Biodiversitat** — efectiu **01-01-2026** (substitueix l'estàndard de 2016). Font: https://www.globalreporting.org/standards/standards-development/topic-standard-for-biodiversity/
- **GRI 14 Mining Sector** — efectiu **01-01-2026**. Font: https://www.globalreporting.org/standards/standards-development/sector-standard-for-mining/
- **Sector Standards alineats** amb Biodiversitat, Clima i Energia (2024-2025)

### En efectivitat propera
- **GRI 102 Climate Change 2025** — efectiu **01-01-2027** (rellevant des de 2026)
- **GRI 103 Energy 2025** — efectiu **01-01-2027**

### En consulta/revisió ara (2026)
- **Review de labor-related standards** (drets dels treballadors: treball forçat/infantil, llibertat d'associació) — consulta pública fins **09-03-2026**
- **Review d'economic impact disclosures** (corrupció, competència, lobby) — consulta fins **10-04-2026**
- **GSSB work program 2026-2028** — consulta fins **27-03-2026** (finalitzar labor/economia/pollution, nova fase de Sector Standards, nou estàndard de digitalització)
- **Pollution standards** — consulta en marxa ("Clearing the air on pollution reporting")

### Canal oficial de vigilància
- Notícies d'estàndards: https://www.globalreporting.org/standards/ (secció "Latest news")
- Actualització trimestral: https://www.globalreporting.org/news/news-center/accelerating-progress-in-2026-towards-a-streamlined-sustainability-reporting-system/ (26-01-2026)

## 5. Punts d'impacte típics (quan un informe institucional toca GRI)
Quan apareix un informe nou (BCE, EIOPA, EBA, ESMA, reguladors), pot afectar GRI en:
1. **Abast/obligació**: si un regulador endureix o relaxa el reporting, canvia qui ha de reportar amb GRI (ex: Omnibus I)
2. **Interoperabilitat**: alineació o divergència amb CSRD/ISSB/TNFD
3. **Nous temes materials**: riscos emergents (clima, natura, social) que forcen nous Topic Standards
4. **Assegurament**: pressió per verificació externa del que GRI reporta
5. **Granularitat de dades**: exigència de dades quantitatives més detallades

## 6. Accions tipus que se'n deriven (per a una empresa que reporta amb GRI)
- Revisar la **materialitat** (i doble materialitat si hi ha pressió reguladora)
- Adoptar els **Topic/Sector Standards nous o revisats** que toquin el seu negoci (ex: GRI 101 si depèn de natura; GRI 102/103 per al 2027)
- Verificar **interoperabilitat** amb el nou requisit (evitar doble reporting)
- Preparar-se per a **assegurament** si el regulador ho demana
- Actualitzar la **taxonomia digital** de reporting

## 7. CRITERIS D'INTENSITAT (com assignar Alt / Mitjà / Baix a cada crossRef)

| Intensitat | Quan aplicar-la | Exemple real |
|---|---|---|
| **ALT** | L'informe canvia l'**abast o l'obligació** de l'estàndard (qui ha de reportar), o introdueix un **Topic/Sector Standard nou o revisat** que afecta el negoci, o canvia la **interoperabilitat** amb un marc obligatori (CSRD/ISSB), o exigeix **assegurament** nou | Omnibus I redueix el CSRD → les empreses fora de l'abast tornen a GRI (canvi d'abast de facto) |
| **MITJÀ** | L'informe **esmenta o alinea** l'estàndard sense canviar-ne l'abast; o introdueix **expectatives de divulgació** en un tema concret (clima, natura) sense obligació; o afecta un **subconjunt** d'empreses (sector, mida) | Alineació GRI-CDP per a disclosures coherents (28-04-2026) |
| **BAIX** | L'informe toca l'estàndard de forma **tangencial** (menció general, dada relacionada) o l'impacte és **indirecte/teòric** | Un informe de banca que esmenta GRI com a marc de referència sense canvis pràctics |

> **Regla**: quan hi hagi dubte entre dos nivells, triar el **més baix** (evitar alarmisme). La intensitat es pot revisar a la validació d'en Paolo.

## 8. Meta
- Data d'última revisió: **20-08-2026**
- Propera revisió programada: **20-09-2026** (mensual) o **abans si el pas 1 detecta un canvi** a les fonts oficials GRI
- Validació: **⏳ PENDENT DE PAOLO** (no usar en producció fins a validació)
