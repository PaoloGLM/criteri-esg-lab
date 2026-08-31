# DOCUMENT INTERN — NO PÚBLIC
**Estat: ⏳ PENDENT DE VALIDACIÓ DE PAOLO**

---

# Fitxa Tècnica Completa: Metodologia EcoVadis (v2024/2025)

> **Font principal:** *EcoVadis Rating Methodology: Principles & Implementation* (PDF oficial EcoVadis).  
> **Nota:** Tots els punts marcats amb **[pendent de verificar al PDF EcoVadis]** requereixen confirmació creuada amb el document PDF físic proporcionat (`certifications/ecovadis-methodology.pdf`) per garantir exactitud de pesos, criteris específics i redacció oficial.

---

## 1. RESUM EXECUTIU

**Què és:** EcoVadis és una plataforma d'avaluació de la sostenibilitat empresarial (ESG) que emet **qualificacions (scorecards)** estandarditzades per a cadenes de subministrament. No és una certificació pass/fail, sinó una **puntuació de 0 a 100** amb medalles (Platinum, Gold, Silver, Bronze) i badges (Committed, Fast Mover).

**Objectiu:** Proporcionar als compradors (grans corporacions) una visió fiable, comparable i actualitzada del rendiment ESG dels seus proveïdors per prendre decisions de compra, gestió de riscos i millora contínua.

**Alcance:** +130.000 empreses avaluades, +180 sectors, +175 països. Metodologia alineada amb **GRI, UNGC, ISO 26000, GHG Protocol, TCFD, CDP, SASB, EU Taxonomy, CSRD/ESRS**.

**Principis rectors (7):**
1.  **Basada en proves** (Evidence-based).
2.  **Sectors, mida, geografia** (Contextualització).
3.  **Diversitat de fonts** (Declaracions públiques, ONGs, sindicats, mitjans, dades 3r).
4.  **Tecnologia + Experts** (IA per processar + analistes humans per validar).
5.  **Millora contínua** (Reavaluació anual/bianual).
6.  **Transparència i traçabilitat** (Accés a la fita de puntuació detallada).
7.  **Confidencialitat** (Dades no públiques sense consentiment).

---

## 2. ESTRUCTURA I PESOS DEL MODEL (WEIGHTING)

### 2a. Les 4 Temàtiques Principals (Pilars)
El model avalua 21 criteris agrupats en 4 pilars. Els **pesos varien segons el sector (ISIC/NACE), mida (facturació/empleats) i geografia** de l'empresa avaluada.

| Pilar | Codi Intern | Descripció General | Pes Típic (Mitjana) |
| :--- | :--- | :--- | :--- |
| **Medi Ambient** | `ENV` | Consum energia, emissions, aigua, residus, biodiversitat, productes. | **25% - 40%** |
| **Treball i Drets Humans** | `LAB` | Salut/seguretat, condicions laborals, diversitat, drets humans, diàleg social. | **20% - 35%** |
| **Ètica** | `ETH` | Corrupció, informació no pública, competència, gestió responsables. | **15% - 25%** |
| **Compres Sostenibles** | `SUP` | Polítiques, accions, informes i auditoria de proveïdors propis. | **10% - 20%** |

> **[pendent de verificar al PDF EcoVadis]**: Taula exacta de matrius de pes per sector (ex: Manufactura pesada vs Serveis TIC) i trams de mida (Micro <10, PME 10-250, Gran >250, Enterprise >1000).

### 2b. MAPA TEMÀTIC DETALLAT (21 CRITERIS + SUBCRITERIS)

> **Llegenda:** ✅ = Criteri principal (Puntuat 0-100). 🔹 = Subcriteri d'avaluació (Polítiques, Accions, Resultats). Els subcriters tenen pesos interns dins del criteri (habitualment: Polítiques ~25%, Accions ~35%, Resultats ~40%).

#### **PILAR 1: MEDI AMBIENT (ENV)**
| Codi | Criteri Principal | Subcriteris Clau (Exemples) |
| :--- | :--- | :--- |
| **ENV1** | **Energia i Emissions de Gasos d'Efecte Hivernacle** | 🔹 Polítiques/Objectius (SBTi), 🔹 Accions (Eficiència, Renovables), 🔹 Resultats (Scopes 1, 2, 3, Intensitat). |
| **ENV2** | **Aigua** | 🔹 Gestió del risc hídric, 🔹 Reducció consum/recirculació, 🔹 Qualitat verts. |
| **ENV3** | **Residus** | 🔹 Jerarquia residus (Prevenció, Reutilització, Reciclatge), 🔹 Residus perillosos, 🔹 Economia Circular. |
| **ENV4** | **Contaminació de l'Aire, Sòl i Soroll** | 🔹 Emissions NOx, SOx, VOCs, PM, 🔹 Gestió sòl contaminat, 🔹 Soroll industrial. |
| **ENV5** | **Ús de Sostàncies Perilloses / Químics** | 🔹 Llista substàncies (REACH, SVHC, Prop 65), 🔹 Substitució, 🔹 Gestió seguretat producte. |
| **ENV6** | **Biodiversitat i Ús del Sòl** | 🔹 Avalució impactes (IBAT), 🔹 Protecció hàbitats, 🔹 No desforestació. |
| **ENV7** | **Impacte Ambiental dels Productes/Serveis** | 🔹 Ecodisseny / LCA (ACV), 🔹 Etiquetatge ambiental, 🔹 Durabilitat/Reparabilitat, 🔹 Fi de vida. |
| **ENV8** | **Transport i Logística** (Si aplicable) | 🔹 Optimització rutes, 🔹 Flota baixa emissió, 🔹 Modal shift. |

#### **PILAR 2: TREBALL I DRETS HUMANS (LAB)**
| Codi | Criteri Principal | Subcriteris Clau |
| :--- | :--- | :--- |
| **LAB1** | **Salut i Seguretat al Treball (SST)** | 🔹 Sistema gestió (ISO 45001), 🔹 Identificació perills/Riscos, 🔹 Formació, 🔹 Taxes incidentis (LTIR, TRIR), 🔹 Malalties professionals. |
| **LAB2** | **Condicions de Treball i Protecció Social** | 🔹 Contractes, hores extra, salaris, conciliació, beneficis, teletreball, desconnectació digital. |
| **LAB3** | **Diàleg Social i Relacions Laborals** | 🔹 Llibertat associació, negociació col·lectiva, comitès empresa, procediments queixa. |
| **LAB4** | **Diversitat, Equitat i Inclusió (DEI)** | 🔹 Polítiques anti-discriminació, 🔹 Brexa salarial gènere, 🔹 Inclusió discapacitat, 🔹 Lideratge divers. |
| **LAB5** | **Formació i Desenvolupament Professional** | 🔹 Plans formació, hores/empleat, upskilling/reskilling, avaliació rendiment. |
| **LAB6** | **Drets Humans (Propis i Cadena)** | 🔹 Due Diligence (UNGP), 🔹 Treball forçat/infantil, 🔹 Drets indígenes, 🔹 Treballadors migrants, 🔹 Mecanismes reparació. |

#### **PILAR 3: ÈTICA (ETH)**
| Codi | Criteri Principal | Subcriteris Clau |
| :--- | :--- | :--- |
| **ETH1** | **Corrupció i Soborn** | 🔹 Codi ètic, 🔹 Avaliació riscos (FCPA, UK Bribery Act, Llei 10/2010), 🔹 Due diligence tercers, 🔹 Canal denúncies (Whistleblowing), 🔹 Formació. |
| **ETH2** | **Informació No Pública i Competència** | 🔹 Secrets comercials, dades personals (GDPR), seguretat cibernètica, pràctiques anti-competitives (cartells, abus dominici). |
| **ETH3** | **Gestió Responsable de la Informació / Màrqueting** | 🔹 Publicitat veraç, greenwashing, protecció consumidors, IA ètica. |
| **ETH4** | **Fiscalitat Responsable** (Nou/Reforçat) | 🔹 Transparència fiscal (CBCR), 🔹 No evasió, 🔹 Polítiques fiscals. |

#### **PILAR 4: COMPRES SOSTENIBLES (SUP)**
| Codi | Criteri Principal | Subcriteris Clau |
| :--- | :--- | :--- |
| **SUP1** | **Polítiques i Compromisos de Compres** | 🔹 Codi conducta proveïdors, 🔹 Clàusules contractuals ESG, 🔹 Alineació amb pilars 1-3. |
| **SUP2** | **Accions i Desplegament** | 🔹 Avaliació riscos proveïdors (Mapping), 🔹 Auditories (SMETA, ISO), 🔹 Formació proveïdors, 🔹 Incentius/Plans millora. |
| **SUP3** | **Resultats i Informes de la Cadena** | 🔹 KPIs proveïdors (cobertura avaluació, % amb accions correctives), 🔹 Informes públics (Modern Slavery Act, Devoir de Vigilance). |

---

## 3. INTEROPERABILITAT I ALINEAMENT REGULATORI

> **[pendent de verificar al PDF EcoVadis]**: Detall específic de la matriu de mapeig "EcoVadis Criteria ↔ ESRS / CSRD / EU Taxonomy / CSDDD" inclosa en l'annex del PDF.

| Marc / Regulació | Nivell Alineament | Com EcoVadis ho cobreix |
| :--- | :--- | :--- |
| **CSRD / ESRS (EU)** | **Alt (Core)** | Mapeig directe criteris EcoVadis → *Disclosure Requirements* (ESRS E1-E5, S1-S4, G1). La Scorecard serveix com a *data point* per "Value Chain" (ESRS 2 SBM-3, IRO-1, MDR-M/P/T). |
| **CSDDD (Directiva Due Diligence)** | **Alt** | Mòdul `SUP` + `LAB6` + `ENV` = Cobertura obligacions *Due Diligence* (identificació, prevenció, mitigació, reparació, monitoratge, comunicació). |
| **EU Taxonomy** | **Mitjà-Alt** | Dades `ENV1` (Mitigació/Adaptació CC), `ENV3` (Economia Circular), `ENV6` (Biodiversitat) alimenten elegibilitat/alineament. EcoVadis no certifica Taxonomy, però proveeix dades. |
| **SFDR (Finances Sostenibles)** | **Mitjà** | PAI Indicators (Principal Adverse Impacts) coberts per `ENV1` (GHG), `LAB1` (SST), `ETH1` (Corrupció), `SUP` (Cadena). |
| **GHG Protocol / SBTi** | **Alt** | `ENV1` exigeix inventaris Scope 1,2,3. Validació objectius SBTi = punts màxims en "Resultats". |
| **GRI / UNGC / ISO 26000** | **Base** | Estructura metodològica inspirada en GRI (Materialitat), Principis UNGC (10), Guia ISO 26000 (7 temes nucleus). |
| **TCFD / ISSB (IFRS S2)** | **Alt** | Governança, Estratègia, Gestió Riscos, Mètriques (Scope 1,2,3) → `ENV1`, `GOV` (part d'Ètica/Gestió). |
| **CDP** | **Intercanvi Dades** | EcoVadis accepta dades CDP (Clima, Aigua, Boscos) com a "Documentació vàlida" i comparteix scores amb CDP (si client ho sol·licita). |

**Utilitat pràctica:** L'empresa pot exportar la **"EcoVadis Regulatory Report"** (funcionalitat Premium) per omplir automàticment qüestionaris CSRD/CSDDD.

---

## 4. VIGILÀNCIA, VERIFICACIÓ I QUALITAT DE LA DADE (WATCH / 360°)

### 4.1. EcoVadis 360° Watch (Monitoratge Continu)
*   **Fonts:** +100.000 fonts públiques (mitjans, ONGs, sindicats, registres sancions, tribunals, bolets oficials, bases de dades sanctions OFAC/UE/ONU).
*   **Freqüència:** Temps quasi-real (alertes diàries/setmanals).
*   **Impacte en Score:**
    *   **Casos "Critical" / "Severe"**: Penyalització directa al criteri afectat (ex: accident mortal → `LAB1`, multa contaminació → `ENV1/4`, corrupció → `ETH1`).
    *   **Gestió de la controvèrsia**: L'empresa pot respondre (remediació, investigació). La qualitat de la resposta mitiga la penyalització.
    *   **Sense resposta / Reincidència**: Penyalització màxima (score criteri → 0-25).

### 4.2. Verificació Documental (Document Check)
*   **IA (NLP/OCR):** Llegeix PDFs, webs, informes (PDF, DOC, XLS, HTML). Extreu: KPIs, dates, scopes, certificacions, comitès.
*   **Analistes Humans:** Validen la coherència (ex: objectiu SBTi sense inventari Scope 3 → incoherència).
*   **Verificació Creuada:** Dades declarades vs. 360° Watch vs. Bases de dades terceres (CDP, GRI, registres ISO, Science Based Targets initiative).

### 4.3. Fiabilitat de la Documentació (Evidence Quality)
| Nivell | Tipus Document | Pes en Avaluació |
| :--- | :--- | :--- |
| **Nivell 1 (Alt)** | Informes auditats externament (ISO 14001, 45001, 50001, SA8000, B Corp), Informes Sostenibilitat GRI (auditats), CDP, SBTi validat, Informes Anuals auditats. | **Màxim** (Proves independents). |
| **Nivell 2 (Mitjà)** | Polítiques internes signades, Procediments, Minutes comitès, Formacions (llistes assistència), Autoavaluacions proveïdors, Dades internes no auditades. | **Alt** (Proves gestió). |
| **Nivell 3 (Baix)** | Declaracions genèriques web, "Estem treballant en...", Logos sense certificat, Documents sense data/firma/responsable. | **Baix / Zero** (Intenció, no prova). |

> **Regla d'Or:** **"No document = No fet"**. L'absència de documentació implica puntuació 0 en el subcriteri "Accions" o "Resultats" corresponent.

---

## 5. PROCÉS D'AVALUACIÓ (END-TO-END)

### Fase 1: Registre i Cuestionari (Registration & Questionnaire)
1.  **Invitació** (Client comprador o Auto-registre).
2.  **Perfilatge:** Sector (ISIC/NACE 4 dígits), Mida (Facturació/Empleats), País seu + Filials.
3.  **Cuestionari Adaptatiu:** ~50-
---

## 6. Accions
- Revisar i aprovar la política de sostenibilitat (medi ambient, drets humans, ètica i compra sostenible).
- Implantar formació anual per a empleats i proveïdors crítics.
- Publicar KPIs de seguiment alineats amb EcoVadis.
- Auditar proveïdors d'alt risc i incloure clàusules de sostenibilitat en contractes.
- Actuar sobre les àrees amb puntuació més baixa (ex. emissions, diversitat, anticorrupció).

## 7. Intensitat (Alt/Mitjà/Baix)
- Polítiques i mesures estructurals: **Alt**
- Formació i comunicació: **Mitjà**
- Seguiment i reporting: **Mitjà**
- Due diligence de proveïdors: **Alt**
- Certificacions i millora contínua: **Mitjà**

## 8. META
- **PENDENT DE VALIDACIÓ DE PAOLO**
- Revisió final del redactat i alineació amb el PDF EcoVadis.
- Actualitzar dates, responsables i estat abans de publicar.
