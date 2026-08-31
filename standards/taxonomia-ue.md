# DOCUMENT INTERN — NO PÚBLIC

# Taxonomia UE — Fitxer d'Estàndard v3

---

## 1. RESUM EXECUTIU

**Objectiu:** Document de referència interna per a la implementació, monitoratge i reporting de la **Taxonomia de la UE** (Reglament (UE) 2020/852) i els seus Acts Delegats, alineat amb els 6 objectius ambientals i els criteris tècnics de selecció (TSC).

**Alcance:** Cobreix els Acts Delegats principals:
- **Delegated Act 2021/2139** (Objectius 1 i 2: Clima — Mitigació i Adaptació)
- **Delegated Act 2023/2486** (Objectius 3–6: Aigua, Economia circular, Contaminació, Biodiversitat)
- **Complementary DA 2022/1214** (Activitats de gas i nuclear)
- Informes de la **Platform on Sustainable Finance**

**Aplicabilitat:** Entitats subjectes a **CSRD/ESRS** (Art. 8 Taxonomia), **SFDR** (Art. 8 i 9), i **CSDDD** (devoir de vigilance). KPIs obligatoris: % Facturació, % CapEx, % OpEx alineats.

**Estat:** ⏳ **PENDENT DE VALIDACIÓ DE PAOLO** — Les dades concretes (articles exactes, taules NACE, llindars numèrics) s'han d'extreure del PDF `certifications/eu-taxonomy-delegated-act.html` (4.9 MB).

---

## 2. MARCO NORMATIU

### 2a. Jerarquia i Àmbit

| Nivell | Instrument | Referència | Estat | Aplicabilitat |
|--------|------------|------------|-------|---------------|
| Nivell 1 | Reglament Taxonomia | Reg. (UE) 2020/852 | En vigor des 12/07/2020 | Base legal; 6 objectius ambientals; principis DNSH + Minimum Safeguards |
| Nivell 2 | DA Clima (Mitigació + Adaptació) | **Delegated Regulation (UE) 2021/2139** | Aplicable des 01/01/2022 | TSC per ~100 activitats NACE (Seccions A–J, L) |
| Nivell 2 | DA 4 Objectius Restants | **Delegated Regulation (UE) 2023/2486** | Aplicable des 01/01/2024 | TSC per objectius 3–6; ~60 activitats addicionals |
| Nivell 2 | DA Complementari (Gas/Nuclear) | **Delegated Regulation (UE) 2022/1214** | Aplicable des 01/01/2023 | Condicions estrictes per activitats de transició (gas) i nuclear |
| Nivell 3 | Orients Platform on Sustainable Finance | Informes 2022, 2023, 2024 | Consultius | Recomanacions TSC, usabilitat, ampliació activitats |
| Nivell 3 | FAQ / Notícies Comissió | C/2023/... ; C/2024/... | Interpretatius | Aclariments sobre reporting, DNSH, safeguards |

> **[pendent de verificar al PDF Taxonomia]**: Numero exact d'activitats per DA, codis NACE complets, articles específics de cada TSC/DNSH.

### 2b. Mapa Temàtic — Objectius Ambientals vs. Criteris Tècnics (TSC) + Documents a `certifications/`

| Objectiu Ambiental (Art. 9 Reg. 2020/852) | Acte Delegat Font | Criteris Tècnics Concrets (TSC) — Articles Clau | Documents a `certifications/` |
|-------------------------------------------|-------------------|--------------------------------------------------|-------------------------------|
| **1. Mitigació del canvi climàtic** | DA 2021/2139 (Anexs I–II) | **TSC Mitigació**: Llindars GHG per activitat (gCO₂e/kWh, % reducció, etc.)<br>**DNSH Adaptació** (Art. 3 DA 2021/2139): Avaluació riscos climàtics + plan d'adaptació<br>**DNSH Aigua** (Art. 4): Gestió sostenible aigua<br>**DNSH Economia Circular** (Art. 5): Prevenció residus, reciclatge<br>**DNSH Contaminació** (Art. 6): Emissions contaminants<br>**DNSH Biodiversitat** (Art. 7): Avaluació impacte + mitigació | `eu-taxonomy-delegated-act.html` (Anexs I–II) |
| **2. Adaptació al canvi climàtic** | DA 2021/2139 (Anexs I–II) | **TSC Adaptació**: Solucions d'adaptació (infraestructures resilients, serveis climàtics, etc.)<br>**DNSH Mitigació** (Art. 3): No incrementar emissions significativament<br>**DNSH 3–6**: Idem objectiu 1 | `eu-taxonomy-delegated-act.html` (Anexs I–II) |
| **3. Ús sostenible i protecció de l'aigua i recursos marins** | DA 2023/2486 (Anexs III–IV) | **TSC Aigua**: Eficiència hídrica, reutilització, qualitat aigua, gestió conques<br>**DNSH 1,2,4,5,6**: Articles 3–6 DA 2023/2486 | `eu-taxonomy-delegated-act.html` (Anexs III–IV) **[pendent de verificar al PDF Taxonomia]** |
| **4. Transició cap a una economia circular** | DA 2023/2486 (Anexs V–VI) | **TSC Circularitat**: Disseny per durabilitat/reparabilitat, matèries primeres secundàries, gestió residus<br>**DNSH 1,2,3,5,6**: Articles 3–6 DA 2023/2486 | `eu-taxonomy-delegated-act.html` (Anexs V–VI) **[pendent de verificar al PDF Taxonomia]** |
| **5. Prevenció i control de la contaminació** | DA 2023/2486 (Anexs VII–VIII) | **TSC Contaminació**: Reducció emissions aire/aigua/sòl, substitució substàncies perilloses<br>**DNSH 1,2,3,4,6**: Articles 3–6 DA 2023/2486 | `eu-taxonomy-delegated-act.html` (Anexs VII–VIII) **[pendent de verificar al PDF Taxonomia]** |
| **6. Protecció i restauració de la biodiversitat i ecosistemes** | DA 2023/2486 (Anexs IX–X) | **TSC Biodiversitat**: Restauració hàbitats, gestió forestal sostenible,urbanisme verd<br>**DNSH 1,2,3,4,5**: Articles 3–6 DA 2023/2486 | `eu-taxonomy-delegated-act.html` (Anexs IX–X) **[pendent de verificar al PDF Taxonomia]** |

> **Nota:** Cada activitat econòmica (codi NACE) té els seus propis TSC i DNSH als anexos correspondents. El PDF `eu-taxonomy-delegated-act.html` conté els **10 anexos** complets.

---

## 3. INTEROPERABILITAT

| Marc / Estàndard | Punt de Connexió amb Taxonomia | Relevància per a Reporting |
|------------------|--------------------------------|----------------------------|
| **CSRD / ESRS** (Directive 2022/2464 + Delegated Act 2023/2772) | **ESRS E1–E5** mapegen als 6 objectius Taxonomia.<br>**Art. 8 Taxonomia** = KPIs obligatoris a l'Informe de Sostenibilitat (ESRS 2 BP-2, ESRS E1–E5 AR 16–18).<br>**Double Materiality**: Taxonomia = "financial materiality" proxy per activitats alineades. | Reporting unificat: Taules **EU Taxonomy KPIs** (Turnover, CapEx, OpEx) dins ESRS 2 / E1–E5. Plantilles ESRS Annex II. |
| **SFDR** (Reg. 2019/2088 + RTS 2022/1288) | **Art. 8 SFDR** (productes promouent característiques ambientals): % inversions alineades Taxonomia.<br>**Art. 9 SFDR** (objectiu sostenible): Mínim % alineat Taxonomia (excloent "do no significant harm").<br>**PAI Indicators** (Tabla 1, 2, 3 RTS): Overlap amb DNSH (ex. GHG, biodiversitat, aigua). | Fites de producte: `% Taxonomy-aligned` a pre-contractual + periodic reports. Plantilles RTS Anexs II–V. |
| **CSDDD** (Directive 2024/1760) | **Devoir de vigilance**: Les empreses han d'identificar impactes adversos en drets humans i medi ambient a la cadena de valor.<br>**Taxonomia DNSH + Minimum Safeguards** = base per a "adverse impacts" climàtics/ambientals.<br>**Transition Plan** (Art. 15 CSDDD): Ha de ser consistent amb activitats Taxonomia-alineades. | Alineament pla de transició CSDDD amb % CapEx Taxonomia. Due diligence = base per Minimum Safeguards (OCDE/ONU/OIL). |
| **NFRD** (Directive 2014/95/EU) | Predecessora de CSRD. Art. 8 Taxonomia ja s'aplicava a entitats NFRD (grans empreses d'interès públic). | Històric: Reports 2022–2023 sota NFRD + Art. 8 Taxonomia. Migració a CSRD 2024+. |
| **ISSB / IFRS S1–S2** | **IFRS S2**: Climate-related disclosures. **Taxonomia TSC Mitigació/Adaptació** = referència per a "climate-related metrics" (GHG, CapEx verd).<br>**Interoperabilitat**: ISSB reconeix Taxonomia com a "framework compatible". | Empreses multinacionals: Reporting ISSB + ESRS + Taxonomia. Mapeig KPIs CapEx/Turnover. |
| **EU Climate Benchmarks** (Reg. 2019/2089 + 2020/1818) | **CTB / PAB**: Índexs han d'excloure activitats no alineades Taxonomia (ex. carbó, gas sense CCS). | Gestors d'actius: Compliance benchmarks = filtratge Taxonomia. |
| **Green Bond Standard** (Reg. 2023/2631) | **Use-of-proceeds**: 100% CapEx a activitats Taxonomia-alineades (TSC + DNSH + Safeguards). | Emissions obligacions verdes UE: Reporting Taxonomia obligatori. |

> **[pendent de verificar al PDF Taxonomia]**: Articles exactes de referència creuada ESRS E1–E5 ↔ Anexs Taxonomia; taules de mapeig NACE ↔ ESRS sector codes.

---

## 4. VIGILÀNCIA DE CANVIS — Dates i Enllaços Verificables

| Acte / Document | Referència Oficial | Data Publicació DOUE | Data Aplicabilitat | Enllaç Verificable (EUR-Lex) | Estat / Pròxims Passos |
|-----------------|--------------------|----------------------|--------------------|------------------------------|------------------------|
| **Delegated Act Clima** (Mitigació + Adaptació) | **Commission Delegated Regulation (EU) 2021/2139** | 06/07/2021 (DOUE L 442) | 01/01/2022 (exercicis obrirs a partir d'aquesta data) | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021R2139 | **Consolidat** — Inclou modificacions DA 2023/2486 (Art. 1.2) i DA 2022/1214. Verificar versió consolidada EUR-Lex. |
| **Delegated Act 4 Objectius Restants** (Aigua, Circular, Contaminació, Biodiversitat) | **Commission Delegated Regulation (EU) 2023/2486** | 27/06/2023 (DOUE L 228) | 01/01/2024 (reporting exercici 2024, publicat 2025) | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2486 | **En vigor** — Primer reporting complet 2025. Platform on Sustainable Finance: informe usabilitat 2024. |
| **Complementary DA Gas / Nuclear** | **Commission Delegated Regulation (EU) 2022/1214** | 15/07/2022 (DOUE L 187) | 01/01/2023 | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R1214 | **Condicionat** — Gas: fins 2030/2035 amb CCS.
---

## 4. Vigilància i Monitoratge Continu (Continuació)

### 4.4. Gestió de Canvis Regulatoris i Tècnics

| Trigger | Acció Requerida | Responsable | Plàxim | Evidència |
| :--- | :--- | :--- | :--- | :--- |
| **Publicació Delegated Acts nous/amendats** (ex. Nuclear/Gas, TSC actualitzats) | Anàlisi d'impacte sobre activitats elegibles/aliniades actuals. Actualització *Taxonomy Mapper*. | Sustainability / Legal | < 30 dies des publicació DOUE | Informe d'impacte + v. nova *Mapper* |
| **Revisió TSC (Technical Screening Criteria)** per CCC (Climate Change Committee) | Verificar si *Substantial Contribution* (SC) o *Do No Significant Harm* (DNSH) canvien per activitats *core*. | Enginyeria / Sustainability | Abans data d'entrada en vigor | Matriu *Gap Analysis* SC/DNSH |
| **Canvi perímetre consolidació** (M&A, desinversions, *joint ventures*) | Recàlcul KPIs (Art. 8). Reavaluació elegibilitat noves entitats/actius. | Consolidació / FP&A | Tancament trimestral | Workpaper KPIs ajustats |
| **Actualització NACE / CNAE** (Eurostat/INE) | Mapeig nous codis a activitats Taxonomia (Annex I/II Delegated Acts). | IT / Data Office | Any natural (gener) | Taula correspondències NACE-Taxonomia v.YYYY |
| **Noves guies/FAQs Comissió UE / Platform on Sustainable Finance** | Revisió criteris interpretatius controvertits (ex. *adaptation* vs *mitigation*, *enabling* vs *transitional*). | Comitè Taxonomia Intern | < 15 dies | Acta comitè + decisions documentades |

### 4.5. Qualitat de Dades i Rastreabilitat (Data Lineage)

*   **Font Primària:** ERP (FI/CO, PM, MM) → Dades transaccionals (factures, ordres feina, projectes, actius immobilitzats).
*   **Capa d'Enriquiment:** *Taxonomy Tagging Engine* (regles: NACE + Descripció activitat + Paràmetres tècnics SC/DNSH).
*   **Capa de Validació:** Motor de regles (ex. *Threshold* 100g CO2e/kWh, *DNSH Water* BREF, *Minimum Safeguards* OECD/UN).
*   **Sortida:** *Data Package* per Auditor (ISAE 3000 / ESRS E1) i Publicació (CSV/ESEF).

**Controls Mínims (Three Lines of Defense):**
1.  **1a Línia (Operativa):** *Self-assessment* gestor activitat (Check-lista SC/DNSH/MS). Signatura digital.
2.  **2a Línia (Sustainability/Control):** Revisió mostral (min. 25% CapEx/OpEx material, 100% *enabling/transitional*). Verificació fonts documentals (certificats ISO 14001, EPC, LCA, permisos).
3.  **3a Línia (Internal Audit):** Auditoria anyal procés *end-to-end* (Governança, Dades, Càlcul, Divulgació). Informe a Comitè Auditoria.

### 4.6. Gestió de *Minimum Safeguards* (Art. 18 / Annex Delegat 2021/2178)

| Pilar OCDE/ONU | Verificació Anual | Font Evidència | Freq. |
| :--- | :--- | :--- | :--- |
| **Drets Humans** (UN Guiding Principles) | Due Diligence DDHS completada? Procés remediació operatiu? | Informe DDHS, *Grievance Mechanism* logs | Anual |
| **Corrupció/Soborn** | Programa *Anti-bribery* (ISO 37001)? Canal denúncies? | Certificacions, Codi Ètic, Registre conflictes | Anual |
| **Fiscalitat** | *Country-by-Country Reporting* (CbCR) publicat? Polítiques fiscals transparents? | Informe CbCR, *Tax Strategy* | Anual |
| **Competència** | Absència sancions *antitrust* significatives? | Legal *Compliance* register | Continu |

> **Nota:** Si *Minimum Safeguards* = **NO** → **Cap activitat pot ser "Aliniada"** (KPIs = 0% aliniació), tot i que sigui elegible i compleixi SC/DNSH.

---

## 5. KPIs i Reporting (Article 8 Taxonomia + Delegat 2021/2178)

### 5.1. Definició Formal dels Tres Indicadors (NFRD/CSRD Scope)

| KPI | Numerador (Aliniat) | Denominador (Total Elegible + No Elegible) | Perímetre Consolidació |
| :--- | :--- | :--- | :--- |
| **Turnover (Xarxa)** | Ingressos activitats **Aliniades** (SC+DNSH+MS) | **Total Ingressos Nets** (Compte Pèrdues i Guanyos, IFRS 15) | Perímetre Comptable (IFRS 10) |
| **CapEx** | CapEx activitats **Aliniades** + CapEx *Plans Transició* (Art. 10.2 DA 2178) | **Total CapEx** (Addicions Actius Immob. + Dret d'ús IFRS 16 + Intangibles) | Perímetre Comptable |
| **OpEx** | OpEx activitats **Aliniades** (Manteniment, R&D curt termini, neteja) | **Total OpEx** (Definició estricta Art. 1.1.b DA 2178: *non-capitalised direct costs*) | Perímetre Comptable |

> **Clau OpEx:** *No* és total Compte Resultats. Exclou: despeses personal (exclòs R&D/manteniment), impostos, dotacions, logística sortida, màrqueting, vendes. Inclou: Manteniment (preventiu/correctiu), R&D no capitalitzat (IAS 38), Neteja residuals, Curta durada/baixa valor (IFRS 16).

### 5.2. Plantilles Obligatories (Annex II Delegat 2021/2178) — Resum Estructura

#### Taula 1: Proporció Turnover / CapEx / OpEx (Model *Template* UE)

| Codi Activitat (NACE) | Descripció Activitat | **Turnover** | | **CapEx** | | **OpEx** | |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| | | **Absolut (M€)** | **%** | **Absolut (M€)** | **%** | **Absolut (M€)** | **%** |
| **A. ELIGIBLES ALINIADES (Taxonomy-Aligned)** | | | | | | | |
| CCM 3.1 | Solar PV Electricity | 12,5 | 2,1% | 45,0 | 15,2% | 0,8 | 3,4% |
| CCA 7.1 | Renovació Edificis (nZEB) | 0,0 | 0,0% | 12,0 | 4,1% | 0,0 | 0,0% |
| **Subtotal A** | | **12,5** | **2,1%** | **57,0** | **19,3%** | **0,8** | **3,4%** |
| **B. ELIGIBLES NO ALINIADES (Eligible but Not Aligned)** | | | | | | | |
| CCM 4.9 | Cogeneració Gas (No DNSH) | 5,0 | 0,8% | 2,0 | 0,7% | 0,5 | 2,1% |
| **Subtotal B** | | **5,0** | **0,8%** | **2,0** | **0,7%** | **0,5** | **2,1%** |
| **TOTAL ELIGIBLE (A+B)** | | **17,5** | **2,9%** | **59,0** | **20,0%** | **1,3** | **5,5%** |
| **C. NO ELIGIBLES** | | **582,5** | **97,1%** | **236,0** | **80,0%** | **22,7** | **94,5%** |
| **TOTAL (A+B+C)** | | **600,0** | **100%** | **295,0** | **100%** | **24,0** | **100%** |

#### Taula 2: CapEx Plans (Art. 10.2 DA 2178) — *Només si CapEx Aliniat < 100% i hi ha Pla Transició*
*   Requisits: Pla aprovat Órgan Administració, horizons ≤ 5/10 anys, milestones quantificats, CapEx planificat ≥ 50% total CapEx 3 anys.
*   Divulgació: Descripció activitats, *taxonomy codes*, import any a any, % aliniació esperada.

#### Taula 3: Nuclear / Fossil Gas (Template específic Annex XII/XIII)
*   Obligatori si exposició > 0. Desglossat per activitats 4.26-4.31 (Gas) / 4.27-4.28 (Nuclear).

#### Taules Qualitatives (Annex I DA 2178) — *Narrativa Obligatòria*
1.  **Context:** Model negoci, estratègia, perímetre.
2.  **Metodologia:** Fonts dades, assignació costos indirectes, tractament *enabling/transitional*, estimacions/judicis clau.
3.  **Compliment SC/DNSH/MS:** Resum per activitat material (com s'ha verificat *threshold*, *BREF*, *DDHS*).
4.  **Canvis vs Any Anterior:** Perímetre, metodologia, TSC, *restatements*.

### 5.3. Casos Especials Càlcul

| Situació | Tractament KPIs |
| :--- | :--- |
| **Activitat *Enabling* (Art. 10.1.i)** | Comptabilitza com **Aliniada** si compleix SC/DNSH/MS pròpis. No requereix que client final sigui aliniat. |
| **Activitat *Transitional* (Art. 10.2)** | Només si *no hi ha alternativa tecnològica/econòmicament viable* (best-in-class sector). *Threshold* estricte (ex. Ciment < 0,498 tCO2/t clinker). |
| **CapEx "Green" comprat a tercers** (ex. Vehicle Elèctric) | **CapEx Aliniat** si activitat proveïdor és elegible/aliniada (CCM 6.5) I empresa compradora usa per activitat elegible/aliniada pròpia. Si ús general (commuting) → **OpEx** (manteniment) o **No Elegible** (actiu no vinculat activitat Taxonomia). |
| **R&D Capitalitzat (IAS 38)** | **CapEx** (si projecte vinculat activitat elegible). **OpEx** (si no capitalitzat, Art. 1.1.b DA 2178). |
| **IFRS 16 (Lloguer)** | **CapEx** = Addició Dret d'Ús (RoU Asset) any corrent. **OpEx** = Quota amortització + Interessos (NO: quota lloguer P&L). |

---

## 6. Accions i Implementació per Empreses (Playbook Pràctic)

### 6.1. Fases Projecte Típic (Timeline 12-18 mesos)

| Fase | Activitats Clau | Entregables | Durada Est. |
| :--- | :--- | :--- | :--- |
| **0. Governança & Kick-off** | Constitució *Taxonomy Steering Committee* (CFO, CRO, CTO, Legal, Sustain). Assignació *Data Owners* per BU/Actiu. | *Charter*, RACI, Calendaritz. | 1 mes |
| **1. Perímetre & Elegibilitat (Screening)** | Mapeig NACE/CNAE a Annex I/II DA Clima + DA Medi Ambient. Entrevistes *Business Units*. Llista activitats *Core* vs *Enabling* vs *Transitional*. | *Taxonomy Registry* (v0.1), Llista *Gaps* dades. | 2-3 mesos |
| **2. Anàlisi Tècnic SC/DNSH (Deep Dive)** | Per activitat material: Recol·lecció evidències (EPC, LCA, EPD, Permisos, ISO 14001, BREF, *Climate Risk Assessment* físic). Aplicació *Decision Trees* SC/DNSH. | *Technical Assessment Files* per activitat. Matriu Compliment (SÍ/NO/Parcial). | 4-6 mesos |
| **3. Minimum Safeguards Assessment** | Autoavaluació DDHS, Anti-corrupció, Fiscalitat, Competència. Enquesta filials/regions. | *MS Compliance Report*, *Remediation Plan* (si gaps). | 2 mesos (paral·lel) |
| **4. Construcció KPIs & Data Pipeline** | Configuració ERP/EPM (tagging centres cost/projectes/actius). Regles assignació costos indirectes. Conciliació Comptabilitat vs Taxonomia. | *Data Package* auditable. *Reconciliation Bridge* (P&L/BS vs KPIs). | 3-4 mesos |
| **5. Validació i Assurance** | *Dry-run* amb Auditors. Revisió *Internal Audit*. Aprovació Comitè Sostenibilitat / CA. | *Management Representation Letter*, *Assurance Report* (ISAE 3000). | 1-2 mesos |
| **6. Reporting & Divulgació** | Redacció Taules Obligatories (Annex II DA 2178) + Narrativa (Annex I). Integració Informe Gestió / ESRS E1. Publicació ESEF/XBRL. | Informe Final Publicat. | 1 mes |
| **7. Millora Contínua** | *Lessons Learned*. Automatització tagging. Integració pressupostari (CapEx Planning). Actualització *Registry*. | *Roadmap Any+1*. | Continu |

### 6.2. RACI Clau (Resum)

| Activitat | CFO/Finances | Sustainability/ESG | Enginyeria/Operacions | Legal/Compliance | IT/Data | Auditors |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Governança / Aprovació Final | **A** | R | C | C | I | I |
| Screening Elegibilitat (NACE) | I | **R/A** | C | C | R (Mapeig) | I |
| Anàlisi SC/DNSH Tècnic | I | **A** | **R** | C | I | I |
| Minimum Safeguards | C | **R** | I | **A** | I | I |
| Càlcul KPIs (CapEx/OpEx/Turnover) | **A** | R | C (Dades) | I | **R** (Sistema) | I |
| Assurance / Verificació | I | C | C | C | C | **R/A** |
| Reporting / XBRL | **A** | R | I | I | R | I |

### 6.3. Requisits Mínims Sistemes d'Informació (IT)

1.  **Tagging Granular:** A nivell *Cost Center / Internal Order / WBS Element / Asset Master* (no només Society/Company Code).
2.  **Atributs Actiu/Projecte:** `Taxonomy_Activity_Code`, `SC_Status` (Met/Not Met/NA), `DNSH_Status`, `MS_Status`, `Alignment_
---

## 7. CRITERIS D'INTENSITAT (Alt / Mitjà / Baix)

| Nivell | Regla Explicita | Exemples Reals Taxonomia UE |
|--------|----------------|------------------------------|
| **Alt** | **Canvi de criteri tècnic obligatori** (llindars numèrics TSC, noves activitats, canvis DNSH/Minimum Safeguards). Termin dur (<12 mesos). Canvi de % mínim alineament per productes SFDR Art. 8/9. | - DA 2023/2486 (4 objectius nous) — entrad en vigor 01/2024<br>- Complementary DA Gas/Nuclear (2022/1214) — condicions estrictes<br>- Canvi llindars GHG (ex. gCO₂e/kWh més estrictes)<br>- Noves activitats NACE afegides als anexos<br>- Canvi % mínim alineament Art. 8/9 SFDR |
| **Mitjà** | **Nous requisits de reporting/mètriques** (noves plantilles KPI, canvis metodologia càlcul CapEx/OpEx/Turnover, noves FAQs/clarifications). Termin flexible (12-24 mesos). | - Noves plantilles Annex II DA 2178 (KPIs)<br>- FAQs Comissió (DNSH, Minimum Safeguards, Gas/Nuclear)<br>- Canvi metodologia CapEx/OpEx (Annex I DA 2178)<br>- Guies Platform on Sustainable Finance (usabilitat, activitats nous)<br>- Clarifications DNSH / Minimum Safeguards |
| **Baix** | **Guies metodològiques, FAQs, exemples, actualitzacions editorials, canvis editorials, canvis de format/plantilla sense canvi de fons**. | - FAQs Comissió (interpretació)<br>- Exemples *Best Practices* Platform Sustainable Finance<br>- Actualització FAQs DNSH / Minimum Safeguards<br>- Canvis editorials plantilles XBRL / ESEF<br>- Canvis editorials FAQs |

> **Regla de decisió**: En cas de dubte, triar el nivell **més baix** (precaució per no sobre-dimmensionar).

---

## 8. META (⏳ PENDENT DE VALIDACIÓ DE PAOLO)

- **Última revisió**: 31-08-2026 (generada per Nemotron 3 Ultra via OpenRouter free)
- **Propera revisió**: 30-09-2026 (o quan el pas 1 detecti un canvi a fonts oficials UE / Platform on Sustainable Finance)
- **Estat de validació**: ⏳ **PENDENT DE VALIDACIÓ DE PAOLO** — NO usar en producció fins que estigui validada

### Punts Pendents de Verificar (Fonts PDF)
1. Articles exactes TSC/DNSH per cada activitat NACE (Annexos I–X DA Clima + Medi Ambient)
2. Taules NACE ↔ CNAE-2009 / ESRS sector codes
3. Llindars numèrics exactes GHG per activitat (gCO₂e/kWh, % reducció)
4. Articles DNSH exactes per objectiu (Art. 3–7 DA Clima; Art. 3–6 DA Medi Ambient)
5. Minimum Safeguards: referències exactes OCDE/ONU/OIL
6. Minimum Safeguards: criteris *substantial contribution* vs *DNSH* vs *safeguards*
7. Articles exactes Minimum Safeguards (Art. 18 Reg. 2020/852 + OCDE/ONU/OIL)
8. Taules NACE ↔ ESRS sector codes per reporting integrat CSRD
9. Plantilles exactes KPIs (Annex II DA 2178/2021) i fórmules Turnover/CapEx/OpEx
10. FAQs oficials Comissió / Platform on Sustainable Finance (llista completa)
