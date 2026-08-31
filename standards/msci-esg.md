# MSCI ESG RATINGS — ESTÀNDARD INTERN DE REFERÈNCIA

> **DOCUMENT INTERN — NO PÚBLIC**  
> Versió: 1.0 | Estat: ⏳ PENDENT DE VALIDACIÓ DE PAOLO  
> Última actualització: 2025-01-15

---

## 1. METADADES I OBJECTIU

| Camp | Valor |
|------|-------|
| **Estàndard** | MSCI ESG Ratings |
| **Editor** | MSCI Inc. (Morgan Stanley Capital International) |
| **Àmbit** | Global — company ratings (AAA–CCC), fund ratings, index licensing |
| **Unitat d'anàlisi** | Empresa cotitzada / emissor / fons d'inversió |
| **Freqüència d'actualització** | Ratings corporatius: mensual (revisió anual completa) · Fund Ratings: mensual |
| **Llicència** | Propietari — accés via subscripció MSCI ESG Direct / MSCI ONE / Data feeds |
| **Document de referència a `certifications/`** | `msci-esg-methodology.pdf` (metodologia 2024) · `msci-esg-key-issues.pdf` (Materiality Map) · `msci-climate-vulnerability.pdf` (CCVA) · `msci-controversies-methodology.pdf` |
| **Objectiu del fitxer** | Definir com mapejar, auditar i certificar dades corporatives segons la metodologia MSCI per a: (a) preparació de resposta a MSCI ESG Ratings Assessment, (b) alineament amb MSCI ESG Fund Ratings, (c) integració en reporting GRI/ESRS/SASB, (d) gestió de controversies i Climate Change Vulnerability Assessment. |

> ⚠️ **Nota de confiança**: Els documents a `certifications/` estan marcats com a **[pendent de verificar amb font oficial]** fins que es confirmi la seva existència i versió actualitzada al repositori.

---

## 2. ESTRUCTURA NORMATIVA MSCI

### 2a. Tres Pilars i 10 Temes Transversals

| Pilar | Temes (Categories) | Descripció sintètica |
|-------|-------------------|---------------------|
| **Environment (E)** | Climate Change, Natural Capital, Pollution & Waste, Environmental Opportunities | Riscos i oportunitats mediambientals, inclòs CCVA |
| **Social (S)** | Human Capital, Product Liability, Stakeholder Opposition, Social Opportunities | Gestió laboral, seguretat producte, relacions comunitats |
| **Governance (G)** | Corporate Governance, Corporate Behavior | Estructura consell, remuneracions, pràctiques negocis, corrupció |

> **Font**: MSCI ESG Ratings Methodology (2024), pp. 4–7. [pendent de verificar amb font oficial]

### 2b. MAPA TEMÀTIC — KEY ISSUES PER SECTOR (MATERIALITY MAP)

MSCI assigna **Key Issues** (temes materials) a cada empresa segons el seu **GICS Sub-Industry**. Els pesos varien dinàmicament (0–100%) per pilar i tema.

| Tema MSCI (Key Issue) | Pilar | Requisits concrets MSCI (exemples) | Documents a `certifications/` |
|----------------------|-------|-----------------------------------|------------------------------|
| **Carbon Emissions** | E | Emissions Scope 1+2+3, objectius SBTi, intensitat carbò, transition plan | `msci-esg-methodology.pdf` §4.1 · `msci-climate-vulnerability.pdf` |
| **Climate Change Vulnerability** | E | Exposició física (inundacions, calor, aigua), vulnerabilitat operativa, costos d'adaptació | `msci-climate-vulnerability.pdf` (CCVA 2024) |
| **Water Stress** | E | Consum aïgües en zones d'estrès hàdric, reciclatge, objectius reducció | `msci-esg-key-issues.pdf` |
| **Biodiversity & Land Use** | E | Impacte en zones protegides, policies no-deforestation, cadena subministrament | `msci-esg-key-issues.pdf` |
| **Toxic Emissions & Waste** | E | Emissions tòxiques (TRI/E-PRTR), gestió residus perillosos, economia circular | `msci-esg-key-issues.pdf` |
| **Labor Management** | S | Relacions laborals, convenis col·lectius, rotació, seguretat laboral (LTIR/TRIR) | `msci-esg-methodology.pdf` §5.1 |
| **Human Capital Development** | S | Formació, diversitat, bretxa salarial gènere, promoció interna, benestar | `msci-esg-key-issues.pdf` |
| **Product Safety & Quality** | S | Retirades producte, reclamacions, certificacions qualitat (ISO 9001), farmacovigilància | `msci-esg-key-issues.pdf` |
| **Data Privacy & Security** | S | Bretxes seguretat, GDPR/CCPA compliance, certificacions ISO 27001 | `msci-esg-key-issues.pdf` |
| **Community Relations** | S | Impacte comunitats locals, consentiment lliure previ informat (FPIC), inversió social | `msci-esg-key-issues.pdf` |
| **Corporate Governance** | G | Independència consell, diversitat consell, separació CEO/Chair, drets accionistes | `msci-esg-methodology.pdf` §6.1 |
| **Corporate Behavior** | G | Anti-corrupció, ètica negocis, lobbying, fiscalitat, controversies greus | `msci-controversies-methodology.pdf` |
| **Green Building** | E (Opp) | Certificacions LEED/BREEAM, portfoli verd, eficiència energètica | `msci-esg-key-issues.pdf` |
| **Clean Tech / Renewable Energy** | E (Opp) | Ingressos verds, R&D net zero, capacitat renovables | `msci-esg-key-issues.pdf` |

> **Nota**: La llista completa de Key Issues per GICS Sub-Industry (158 sub-indústries) es troba a `msci-esg-key-issues.pdf` (Materiality Map 2024). [pendent de verificar amb font oficial]

### 2c. Pesos Dinàmics (Dynamic Weights)

- **Model**: MSCI utilitza un model de **pesos específics per indústria** (no pesos fixos globals).
- **Rang**: Cada Key Issue té un pes entre **0% i 100%** dins del seu pilar; la suma dels pesos del pilar = 100%.
- **Actualització**: Pesos revisats **anualment** (abril/maig) amb publicació a "MSCI ESG Ratings Methodology — Industry Weights".
- **Exemple sector Bancari (Banks)**:
  - E: Carbon Emissions (15%), Financing Environmental Impact (35%), Climate Change Vulnerability (20%), Environmental Opportunities (30%)
  - S: Labor Management (20%), Human Capital (25%), Data Privacy (30%), Financial Inclusion (25%)
  - G: Corporate Governance (60%), Corporate Behavior (40%)

> **Font**: MSCI ESG Ratings Methodology 2024, Appendix A: Industry Weights. [pendent de verificar amb font oficial]

### 2c. Escala de Ratings (7 nivells)

| Rating | Descripció | Percentil aproximat (univers MSCI) |
|--------|------------|-----------------------------------|
| **AAA** | Líder (Leader) | Top ~10% |
| **AA** | Líder (Leader) | ~10–25% |
| **A** | Mitjà-alt (Average) | ~25–50% |
| **BBB** | Mitjà (Average) | ~50–65% |
| **BB** | Mitjà-baix (Laggard) | ~65–80% |
| **B** | Baix (Laggard) | ~80–90% |
| **CCC** | Molt baix (Laggard) | Bottom ~10% |

> **Regla**: Ratings **AAA/AA = Leader**, **A/BBB = Average**, **BB/B/CCC = Laggard**. Els fons MSCI ESG Fund Ratings usen la mateixa escala.

---

## 3. INTEROPERABILITAT AMB ALTERS ESTÀNDARDS

| Estàndard / Framework | Relació amb MSCI | Punts de connexió concrets | Gaps / Atenció |
|----------------------|------------------|---------------------------|----------------|
| **GRI (Universal + Topic Standards)** | Base de dades principal per a MSCI ESG Ratings Assessment | GRI 302/305 → Carbon Emissions · GRI 403 → Labor Management · GRI 418 → Data Privacy · GRI 205 → Corporate Behavior | MSCI no usa tots els indicadors GRI; prioritza *key metrics* quantitatives i policies documentades |
| **CSRD / ESRS** | Alineament creixent (ESRS E1 → CCVA, ESRS S1 → Human Capital, ESRS G1 → Corporate Governance) | ESRS E1-1/2/3 → Climate transition plan & Scope 1-3 · ESRS S1-6 → Formació i diversitat · ESRS G1-1 → Consell i comitès | MSCI encara no mapeja 1:1 ESRS; cal traduir *Disclosure Requirements* a *Key Issue evidence* |
| **SASB Standards** | Alt grau de solapament (MSCI va adquirir SASB-insights via investidors) | SASB Industry Standards → map direct a MSCI Key Issues per sector (ex: SASB HC-BP-130a.1 → Product Safety) | SASB més granular financer; MSCI més qualitatiu en policies |
| **Sustainalytics (Morningstar)** | Competidor directe; metodologia diferent (Risk Rating vs. Rating) | Sustainalytics Material Risk Factors ≈ MSCI Key Issues; Controversies Research similar | Pesos Sustainalytics = fixos per sub-indústria; MSCI = dinàmics. Escala: Negligible–Severe vs AAA–CCC |
| **CDP (Climate/Water/Forests)** | Font de dades primària per MSCI (especialment Climate Change) | CDP Climate Change C1-C14 → Carbon Emissions, Climate Vulnerability, Opportunities | MSCI puntua *performance* no *disclosure*; CDP score (A–D-) ≠ MSCI rating |
| **ISSB / IFRS S2** | Alineament amb TCFD → base per CCVA i Climate Transition | IFRS S2 Governance/Strategy/Risk/Metrics → MSCI Climate Change Vulnerability Assessment | ISSB més enfocat a *financial materiality*; MSCI = *double materiality* implícita |
| **TCFD** | Pilar central del pilar Environment (Climate Change) | 4 pilars TCFD → Governance, Strategy, Risk Management, Metrics & Targets | MSCI integra TCFD al CCVA i a Carbon Emissions Key Issue |
| **SFDR (EU)** | MSCI ESG Fund Ratings usats per Article 8/9 classification | Principal Adverse Indicators (PAIs) → MSCI Controversies + Key Issue data | SFDR requereix *do no significant harm*; MSCI Controversies flags = proxy |
| **EU Taxonomy** | MSCI proveeix dades d'alineament (Revenue/CapEx/OpEx %) | Taxonomy-eligible & aligned activities → Environmental Opportunities Key Issue | MSCI no certifica Taxonomy; proveeix *estimacions* basades en dades públiques |

> **Recomanació operativa**: Construir una **taula de mapeig indicador-a-indicador** (GRI/ESRS/SASB → MSCI Key Issue) per a cada client segons el seu GICS Sub-Industry.

---

## 4. VIGILÀNCIA DE CANVIS (CHANGE LOG OFICIAL)

| Data | Canvi | Font oficial verifiable | Impacte operatiu |
|------|-------|------------------------|------------------|
| **2024-04** | Publicació **MSCI ESG Ratings Methodology 2024** (versió anual) | https://www.msci.com/documents/1296102/34404357/MSCI+ESG+Ratings+Methodology+2024.pdf | Actualització pesos per indústria, noves Key Issues (ex: *Biodiversity*, *Supply Chain Labor Standards*), refinament CCVA |
| **2024-06** | **Climate Change Vulnerability Assessment (CCVA) v2.0** — nova metodologia d'exposició física i vulnerabilitat | https://www.msci.com/documents/1296102/34404357/MSCI+Climate+Change+Vulnerability+Assessment+Methodology.pdf | Nou scoring de vulnerabilitat (0–10), integració a Carbon Emissions weight, escenaris NGFS |
| **2024-09** | Afegit **Supply Chain Labor Standards** com a Key Issue independent (abans part de Labor Management) | MSCI ESG Ratings Methodology 2024, §5.2 / Press release 2024-09-12 | Nou pes per sectors amb cadena complexa (Apparel, Electronics, Food) |
| **2024-11** | **MSCI ESG Fund Ratings Methodology 2024** — actualització per SFDR Article 8/9 | https://www.msci.com/documents/1296102/34404357/MSCI+ESG+Fund+Ratings+Methodology.pdf | Nous umbrals % holdings AAA/AA, integració PAIs, exclusions controversies |
| **2025-01** | **MSCI ESG Ratings Methodology 2025** (previst abril 2025) | [pendent de publicar — vigil·lància activa] | Previsió: major pes Biodiversity, refinament Scope 3, alineament ISSB/ESRS |
| **Contínu** | Actualització mensual de **Controversies** (Red/Orange flags) | MSCI ESG Direct platform / Controversies Alerts | Revisió setmanal alertes clients; red flag = revisió rating en 30 dies |

> **Fonts de vigil·lància**: MSCI ESG Ratings Methodology page (msci.com/esg-ratings/methodology), MSCI Blog "ESG & Climate Insights", MSCI ESG Direct notifications, PRI/UNEP FI webinars.

---

## 5. PROCESSOS D'APLICACIÓ I CERTIFICACIÓ

### 5.1. Cicle de Rating MSCI (Corporate)

```
[1] Data Collection (públich + company questionnaire + alternative data)
        ↓
[2] Key Issue Identification (per GICS Sub-Industry + company-specific)
        ↓
[3] Indicator Scoring (0–10 per indicador dins Key Issue)
        ↓
[4] Key Issue Score (weighted average indicadors)
        ↓
[5] Pillar Score (weighted average Key Issues — dynamic weights)
        ↓
[6] ESG Rating (AAA–CCC) + Controversies adjustment (Red/Orange flag)
        ↓
[7] Rating Review Committee (validació final)
        ↓
[8] Publicació a MSCI ESG Direct + notificació a l'empresa
```

### 5.2. Company Questionnaire (Annual Assessment)

- **Finestra**: Generalment **març–abril** (anual)
- **Format**: Online portal (MSCI ESG Direct) — ~150–300 preguntes segons sector
- **Seccions**: Policies, Targets, Performance Data, Governance, Controversies response
- **Deadline**: Crítica — sense resposta, MSCI usa *public data only* (penalització implícita)

### 5.3. Controversies Management

| Flag | Definició | Conseqüència | Acció recomanada |
|------|-----------|--------------|------------------|
| **Red Flag** | Controversia greu, impacte material, violació llei/normes internacionals (ex: corrupció, dany mediambiental greu, violació DDHH) | **Downgrade automàtic** (mínim 1 nivell, fins a CCC) + "Very Severe" label | Resposta immediata (<30 dies), remediació documentada, engagement amb MSCI |
| **Orange Flag** | Controversia moderada, en curs, o amb impacte potencial (ex: reclamacions laborals, multes regulatòries) | **Cap downgrade automàtic**, però pesa negativament en Key Issue score | Monitoratge, pla d'acció, comunicació proactiva |
| **Green Flag** | Resposta exemplar / remediació verificada | Pot millorar Key Issue score |
---

## 6. ACCIONS I PROCESSOS RESTANTS (⏳ PENDENT DE VALIDACIÓ DE PAOLO)

Aquesta secció detalla els passos operatius i analítics pendents per tancar el cicle d'anàlisi i generar el deliverable final.

| ID | Acció / Procés | Descripció Detallada | Responsable | Estat | Dependències |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ACT-01** | **Validació Final de Pesos (Key Issue Weights)** | Confirmar els pesos exactes aplicats a cada *Key Issue* per a la sub-indústria específica de l'empresa (MSCI GICS Sub-Industry). Verificar si s'han aplicat *overrides* qualitatius per part de l'analista MSCI. | Analista ESG / Paolo | ⏳ PENDENT | Recepció *Rating Report* complet / Methodology Map específic. |
| **ACT-02** | **Quantificació "Score Gap" per Pilar** | Calcular la diferència entre el *Score* actual de l'empresa i el *Score* necessari per assolir el proper *Rating Threshold* (ex. BBB → A) a nivell de Pilar (E, S, G) i Global. | Analista ESG | ⏳ PENDENT | ACT-01 completat. Dades de *Score History* (últims 3-5 anys). |
| **ACT-03** | **Anàlisi de Sensibilitat (What-If Scenarios)** | Modelar l'impacte en el *Final Rating* de millores concretes: <br>• Millora de *Data Disclosure* en *Key Issues* de pes alt.<br>• Implementació de policies formals en *Governance* (Board Diversity, Pay-for-Performance).<br>• Reducció d'intensitat de Carboni (Scope 1+2+3). | Analista ESG | ⏳ PENDENT | ACT-02. Definició d'accions realistes per part de l'empresa. |
| **ACT-04** | **Revisió de Controversies Recents (Últims 12-24 mesos)** | Cribar bases de dades (RepRisk, Factiva, pressa local) per detectar controversies *no capturades* o *actualitzades* per MSCI (lag habitual de 3-6 mesos). Avaluar impacte potencial *Score Penalty* (0-10 pts per *Key Issue*). | Analista ESG / Compliance | ⏳ PENDENT | Accés a bases de dades de controversies. |
| **ACT-05** | **Benchmarking Peer Group Detallat** | Comparativa granular (no noms reals, anonimitzats) dels *Key Issue Scores* vs. *Top Quartile*, *Median* i *Bottom Quartile* del *GICS Industry Group*. Identificar *Best Practices* observables en *Disclosure*. | Analista ESG | ⏳ PENDENT | ACC-01. Universe MSCI definida. |
| **ACT-06** | **Redacció "Executive Summary" i "Action Plan"** | Síntesi executiva (1-2 pàgines) + Pla d'accions prioritzat (Quick Wins vs. Structural Changes) amb *Owner*, *Timeline* i *KPI* de seguiment per a propera actualització MSCI (generalment anual). | Analista ESG / Paolo | ⏳ PENDENT | Totes les anteriors. |
| **ACT-07** | **Preparació Q&A per a Reunió amb MSCI (Opcional)** | Si s'ha sol·licitat *Rating Review* o *Assessment Meeting*: preparar argumentari basat en dades no públiques (internes) o correccions factuais. | ESG Lead / IR | ⏳ PENDENT | Decisió estratègica de l'empresa. |

---

## 7. CRITERIS D'INTENSITAT: ALT / MITJÀ / BAIX (⏳ PENDENT DE VALIDACIÓ DE PAOLO)

Definició operativa per classificar la **Intensitat d'Esforç / Impacte** de les accions correctores identificades a l'ACT-03. Aquesta classificació alimenta la Matriu d'Impacte-Esforç del Pla d'Acció.

### 7.1. Intensitat ALTA (🔴 High Impact / High Effort)
**Definició:** Canvis estructurals que requereixen inversió significativa (CapEx/OpEx), canvis de governança, o transformació del model de negoci. Impacte directe i massiu en *Key Issues* de **Pes Molt Alt (>15-20%)** o resolució de *Red Flags* actius.

| Criteri | Descripció | Exemples Típics |
| :--- | :--- | :--- |
| **Horitzó Temporal** | 18 - 36+ mesos | |
| **Cost** | Alt (CapEx significatiu / Contractació C-level / Consultoria estratègica) | |
| **Impacte Rating** | **+1 a +2 Notches** (ex. BB → BBB / BBB → A) | |
| **Key Issues Típics** | *Carbon Emissions* (Heavy Industry), *Water Stress*, *Labor Management* (Supply Chain), *Corporate Governance* (Board Structure), *Toxic Emissions*. | |
| **Accions Tipo** | • Net Zero Transition Plan (SBTi validated).<br>• Tractament d'aigües residuals / Circuit tancat.<br>• Auditoria i remediació Cadença Subministrament (Tier 1-2-3).<br>• Separació Cadira CEO/Chair, Comitès Independents.<br>• Desinversió actius "Stranded" / Línies negici alt carboni. | |

### 7.2. Intensitat MITJANA (🟡 Medium Impact / Medium Effort)
**Definició:** Millores de gestió, sistemes i divulgació (*Disclosure*) en *Key Issues* de **Pes Mitjà/Alt (5-15%)**. Requereixen coordinació interdepartamental però no canvien el model de negoci. Sovint tancen *Amber Flags*.

| Criteri | Descripció | Exemples Típics |
| :--- | :--- | :--- |
| **Horitzó Temporal** | 6 - 18 mesos | |
| **Cost** | Moderat (Sistemes IT, Personal dedicat, Certificacions) | |
| **Impacte Rating** | **+0.5 a +1 Notch** (Dins la banda *BBB* / *A* / evitem *Downgrade*) | |
| **Key Issues Típics** | *Data Privacy & Security*, *Human Capital Development*, *Product Safety & Quality*, *Supply Chain Labor Standards* (Policy), *Board Diversity* (Policy/Targets). | |
| **Accions Tipo** | • Implementació ISO 27001 / NIST Cybersecurity Framework.<br>• Publicació Informe Sostenibilitat (GRI/SASB/TCFD) complet.<br>• Definició KPIs DEI (Diversitat, Equitat, Inclusió) amb objectius públics.<br>• Política Compres Responsable + Auditories Proveïdors Crítics.<br>• Assessorament Votació (Say on Pay) / Proxy Access. | |

### 7.3. Intensitat BAIXA (🟢 Low Effort / Quick Wins)
**Definició:** Accions principalment de **Divulgació (Disclosure)**, formalització de pràctiques existents no comunicades, o correccions factuais. Impacten *Key Issues* de **Pes Baix/Mitjà (<5-10%)** o milloren la qualitat del *Score* sense canviar el *Notch* immediatament (eviten penalitzacions *Lack of Disclosure*).

| Criteri | Descripció | Exemples Típics |
| :--- | :--- | :--- |
| **Horitzó Temporal** | 1 - 6 mesos | |
| **Cost** | Baix (Treball intern, Redacció, Web) | |
| **Impacte Rating** | **Estabilització / +0.25 Notch** (Evita *Negative Signal*) | |
| **Key Issues Típics** | *Electronic Waste*, *Packaging Material & Waste*, *Business Ethics* (Policy disclosure), *Tax Transparency*, *Chemical Safety* (Policy). | |
| **Accions Tipo** | • Publicar Política d'Ètica / Anti-corrupció a web corporativa.<br>• Divulgar dades consum aigua/energia ja mesurades internament.<br>• Resposta activa a *MSCI ESG Questionnaire* (anyual).<br>• Publicar Informe Fiscal (Country-by-Country Report) si ja existeix.<br>• Actualitzar *Board Skills Matrix* a web. | |

---

### 7.4. Matriu de Decisió Ràpida (Heatmap)

| **Impacte Potencial en Rating** ▼ | **Esforç / Cost / Temps** ▶ | **BAIX (Quick Win)** | **MITJÀ (Projecte)** | **ALT (Transformació)** |
| :--- | :--- | :---: | :---: | :---: |
| **ALT (Notch+)** | | ⚠️ *Rar* (Revisar si realment és Baix Esforç) | 🟡 **PRIORITAT 2** (Strategic Projects) | 🔴 **PRIORITAT 1** (Strategic Imperative) |
| **MITJÀ (Dins Banda / Evita Downgrade)** | | 🟢 **PRIORITAT 3** (Hygiene / Disclosure) | 🟡 **PRIORITAT 2** (Core Improvement) | 🔴 *Revaluar* (Potser no worth it vs Cost) |
| **BAIX (Hygiene / Signal)** | | 🟢 **DO IT NOW** (MSCI Questionnaire) | 🟡 *Delegar / Automatitzar* | 🔴 **NO FER** (Opportunity Cost) |

> **Nota Metodològica:** La classificació final de cada acció concreta es farà a l'**ACT-03** i **ACT-06** creuant el *Key Issue Weight* específic de l'empresa amb la maduresa actual de la pràctica (Gap Analysis).

---

## 8. META (⏳ PENDENT DE VALIDACIÓ DE PAOLO)

### 8.1. Objectiu Principal (North Star)
> **Assolir i mantenir un Rating MSCI ESG de "AA" (Leader) en el proper cicle d'actualització (Any 202X), amb marge de seguretat (> 1.5 punts sobre el tall *AA/AAA*) per absorbir volatilitat de pesos o controversies no previstes.**

*   **Rating Actual (Any 202X-1):** `[PENDENT: Inserir Rating Real, ex. A]`
*   **Target Rating:** `AA`
*   **Data Límite (Cut-off MSCI):** `[PENDENT: Inserir Data Tall MSCI per a l'empresa, generalment 4-6 setmanes abans de publicació]`

### 8.2. Objectius Específics (SMART) per Pilar

| Pilar | KPI Objectiu (Proxy MSCI) | Metrica Interna | Responsable | Deadline |
| :--- | :--- | :--- | :--- | :--- |
| **Environment (E)** | **Carbon Emissions Score ≥ 7.5/10** | Reducció Intensitat Carboni (Scope 1+2) **≥ 30% vs Base Year** + SBTi Approved. | Sustainability Ops / CFO | T4 202X |
| | **Water Stress / Biodiversity Score ≥ 6/10** | 100% operacions en zones estrès hídric amb *Water Management Plan* auditats. | HSE / Engineering | T2 202X+1 |
| **Social (S)** | **Labor Management / H&S Score ≥ 8/10** | TRIR < 0.5 / eNPS > 50 / Living Wage Commitment Tier 1. | HR / Procurement | T4 202X |
| | **Supply Chain Labor Standards Score ≥ 7/10** | 100% Proveïdors Crítics auditats (Sedex/SMETA) + Corrective Action Rate > 90%. | Procurement / Legal | T3 202X |
| **Governance (G)** | **Corporate Governance Score ≥ 8.5/10** | Board Independence > 66% / Gender Diversity > 40% / Say on Pay > 90% Support. | Corp Gov / Board Sec | AGM 202X |
| | **Business Ethics / Data Privacy Score ≥ 7/10** | ISO 27001 Certified / Zero Data Breaches / Whistleblower Resolution < 30 dies. | CISO / Compliance | T2 202X |

### 8.3. KPIs de Seguiment Mensual/Trimestral (Dashboard Intern)

1.  **MSCI Disclosure Completeness:** % camps clau responduts al *Questionnaire* / Web pública vs. *Methodology Map* (Objectiu: **100% High Weight, >90% Total**).
2.  **Controversy Alert Count:** Nombre d'alertes *RepRisk/Watchdog* noves al mes (Objectiu: **0 Severe, < 3 Moderate**).
3.  **Carbon Intensity Trajectory:** tCO2e/M€ Revenu (Tracking vs. Glidepath SBTi).
4.  **Board/Committee Attendance & Composition:** Tracking temps real per a *Governance Score*.
5.  **Policy Deployment Rate:** % empleats formats en *Code of Conduct* / *Cybersecurity* / *DEI* (Objectiu: **>95%**).

### 8.4. Riscos Crítics per a la META (Risk Register)

| Risco | Probabilitat | Impacte | Mitigació (Contingency Plan) |
| :--- | :---: | :---: | :--- |
| **Canvi Metodologia MSCI** (Reweighting anyual) | Mitja | Alt | Subscripció *MSCI Methodology Alerts*; Anàlisi sensibilitat anyual (ACT-03). |
| **Controvèrsia Greu Súbita** (Accident, Sancció, Frau) | Baixa | Molt Alt | Protocol *Crisis Management* activat; Monitoratge Realtime (RepRisk); Segur D&O / EIL. |
| **Divergència Dades (Empresa vs MSCI)** | Alta | Mitja | *Pre-submission Review* rigorós (ACT-06); Punt de contacte únic (SPOC) amb MSCI. |
| **Falta de Recursos / Priorització Interna** | Mitja | Alt | Compromís C-Suite (Steering Committee); Pressupost dedicat "ESG Rating Readiness". |
| **Greenwashing Perception** (Gap Discurs vs Realitat) | Mitja | Alt | Verificació Externa (Assurance ISAE 3000) de dades clau; Alineament CSRD/ESRS. |

### 8.5. Governança del Projecte "MSCI AA Target"

| Órgan | Freqüència | Funció | Participants Clau |
| :--- | :--- | :--- | :--- |
| **ESG Steering Committee** | Trimestral | Aprovar Pressupost, Desbloquejar Decisions Estratègiques, Validar Target. | CEO, CFO, CSO, General Counsel. |
| **ESG Working Group** | Mensual | Seguiment KPIs (8.3), Resoldre Obstacles Operatius, Preparar Dades MSCI. | ESG Lead, IR, HSE, HR, Procurement, IT, Legal. |
| **MSCI Liaison (SPOC)** | Continu / Puntual | Gestió *Questionnaire*, *Assessment Meeting*, *Feedback Loop* amb Analista MSCI. | ESG Lead / IR Lead. |

---

**📌 PRÒXIM PAS IMEDIAT (Post-Validació Paolo):**
1.  **Omplir dades reals** a les taules (Rating Actual, Pesos Específics, Dates Tall).
2.  **Executar ACT-01 i ACT-02** per obtenir el *Baseline* numèric exacte.
3.  **Convocar ESG Working Group** per assignar *Owners* a les accions de la Matriu 7.4.

--- *Fi del Document v0.9 (Draft per Validació)* ---
---

## 9. META (⏳ PENDENT DE VALIDACIÓ DE PAOLO)

- **Última revisió**: 31-08-2026 (generada per Nemotron 3 Ultra via OpenRouter free)
- **Propera revisió**: 30-09-2026 (o quan el pas 1 detecti un canvi a fonts oficials MSCI / metodologia)
- **Estat de validació**: ⏳ **PENDENT DE VALIDACIÓ DE PAOLO** — NO usar en producció fins que estigui validada
