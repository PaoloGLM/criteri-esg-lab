# 02 — Producte

> Especificacions del producte: format de l'informe, formats addicionals, nivells de subscripció.

## Format de l'informe — 8 blocs (1 targeta + 7 blocs narratius)

Cada informe processat per Criteri ESG segueix una estructura fixa. La consistència és el que permet escalar i comparar informes entre ells.

L'estructura s'organitza en **1 targeta d'avaluació ràpida + 7 blocs narratius**:

### Blocs

0. **Semàfor Metodològic** ⭐ — Targeta visual amb 5 indicadors de qualitat de l'informe. Permet al lector decidir en 10 segons si l'informe mereix ser llegit a fons. Cap competidor ho fa.
1. **Fitxa tècnica** (60-80 paraules) — Institució, data, tipus, pàgines, URL original, context de publicació
2. **Cinc dades clau** — Punts quantitatius amb valor, context ampliat (2-3 frases) i pàgina citada
3. **Resum executiu** (300 paraules) — Què diu en llenguatge planer, context, impacte general
4. **Implicacions** (450-540 paraules) — Tres blocs: empreses, reguladors, ciutadans. Inclou la subsecció **"Més enllà del Checkbox"** (lent d'Economia Civil, 100-150 paraules)
5. **Connexions** (200-250 paraules) — Relacions amb altres informes i actualitat. Tipus de relació explicat
6. **Accions recomanades** ⭐ — 3-5 accions concretes per millorar. El cor operatiu. Cada acció amb context ampliat
7. **Cross-reference** ⭐ — Mapatge automàtic amb EcoVadis, B Corp, MSCI i GRI. Impacte específic explicat

⭐ = blocs diferenciadors. Cap competidor els fa perquè requereixen coneixement expert dels frameworks.

---

## Bloc 0 — Semàfor Metodològic (diferenciació principal)

### Propòsit

Abans que el lector dediqui 7 minuts a llegir el resum, Criteri li dona una avaluació de 10 segons sobre la **qualitat metodològica** de l'informe original. Això resol el problema que la majoria d'agregadors ESG resumeixen conclusions optimistes sense qüestionar com s'han construït.

### Els 5 indicadors (cadascun: verd / groc / vermell)

| # | Indicador | 🟢 Verd | 🟡 Groc | 🔴 Vermell |
|---|-----------|---------|---------|------------|
| 1 | **Cobertura Scope 3** | Quantificat amb dades | Esmentat però no quantificat | Ignorat |
| 2 | **Termes temporals** | Anys concrets + SBTi alineat | Decennis genèrics ("by 2050") | Només "compromís futur" sense data |
| 3 | **Fonts independents** | Auditor extern verificat | Alguna cita externa | Només autocitacions |
| 4 | **Granularitat de dades** | Desglossat per segment/instal·lació | Desglossat per regió | Només agregat global |
| 5 | **Verificació externa** | Third-party auditada | Second-party | Self-declared |

### Puntuació global (lletra A-D)

| Verds | Lletra | Etiqueta | Significat |
|-------|--------|----------|------------|
| 5 | **A** | Rigorós | Informe fiable per a presa de decisions |
| 3-4 | **B** | Acceptable amb matisos | Útil, però cal complementar amb altres fonts |
| 1-2 | **C** | Feble metodològicament | Conclusions a prendre amb precaució |
| 0 | **D** | Materialitat qüestionable | No utilitzar com a font única |

### Format visual (model oficial — Format A)

S'han provat 2 formats (juliol 2026). S'adopta el **Format A: targeta compacta vertical**, amb 5 files (una per indicador), justificació textual breu a cada fila, i la nota global en un pill a la capçalera.

Prova visual real (aplicada al WEF Global Risks Report 2026): [`assets/proves-format/semafor-format-A-compacte.png`](assets/proves-format/semafor-format-A-compacte.png)

Esquema:

```
┌─────────────────────────────────────────────┐
│  SEMÀFOR METODOLÒGIC           Nota: B      │
│  ─────────────────────────────────────      │
│  Scope 3              🟢 Quantificat        │
│  Termes temporals     🟡 2050 sense SBTi    │
│  Fonts independents   🟢 Auditor extern     │
│  Granularitat         🟡 Per regió           │
│  Verificació          🟢 Third-party        │
│  ─────────────────────────────────────      │
│  3 verds + 2 grocs. Útil, però cal ...      │
└─────────────────────────────────────────────┘
```

El format B (barra horitzontal amb cel·les) queda descartat però disponible a `assets/proves-format/semafor-format-B-horitzontal.png` per referència futura.

### Criteris d'aplicació

- **Qui l'omple**: el redactor de Criteri (no IA) durant el processat de l'informe
- **Auditoria**: el Consell Assessor revisa aleatòriament 1 informe/mes per validar coherència
- **Transparència**: cada indicador té una frase justificant breu (màx. 15 paraules) accessible fent clic a la web
- **No és una nota moral**: evalua metodologia, no contingut polític. Un informe pot ser "A" metodològicament i políticament discutible

---

## Subsecció "Més enllà del Checkbox" (dins del bloc 4)

### Propòsit

És **la veu editorial diferencial** de Criteri. Aplica una lent crítica als marcs ESG hegemònons (anglosaxons, basats en retorn financer i headcount diversity) per detectar què mesuren i què ometen.

> **Note interna (no pública)**: els criteris d'avaluació s'inspiren en l'Economia del Bé Comú (Christian Felber) i l'Economia Ciutadana (Peru Sasia, Universidad de Deusto), però **aquestes referències mai s'esmenten públicament**. La veu és de Criteri, directament. Els marcs teòrics són només un referent intern per garantir coherència editorial.

### Els 5 criteris (1-2 per informe, no tots)

Per cada informe, el redactor tria **1 o 2 criteris** que siguin més rellevants per aquell informe concret. L'elecció es justifica breument.

| # | Criteri | Pregunta clau | Què busca |
|---|---------|---------------|-----------|
| 1 | **Dignitat humana** | L'informe mesura condicions de vida digna (salari just, salut mental, conciliació, dret a desconnexió) o només compliance laboral mínima? | Si la persona és subjecte, no recurs |
| 2 | **Justícia distributiva** | Es mesura com es reparteix la riquesa generada (ràtio salarial CEO/mitjà, repartiment de beneficis amb treballadors i comunitat) o només rendibilitat per accionista? | Si hi ha distribució, no només maximització |
| 3 | **Sostenibilitat absoluta** | Es mesura l'impacte vs límits planetaris (emissions absolutes, biocapacitat, extracció de materials) o només intensitats relatives (emissions/unitat produïda)? | Si es respecten sostres ecològics |
| 4 | **Co-decisió democràtica** | Hi ha participació real dels stakeholders (treballadors, comunitats, clients) en decisions materials o només compliance amb codis de govern corporatiu? | Si la governança és democràtica, no només procedimental |
| 5 | **Arrelament territorial** | Es mesura l'impacte al territori on opera (comunitat local, proveïdors propers, cadena de valor relacional) o només xifres globals agregades? | Si hi ha economia territorial, no abstracta |

### Format

```
MÉS ENLLÀ DEL CHECKBOX
[Veu editorial de Criteri — 100-150 paraules]
```

Identificada visualment amb una capçalera diferenciada (capçalera pròpia amb tipografia i color coure). Apareix sempre al final del bloc 4 (Implicacions), abans del bloc 5 (Connexions). **No menciona mai els marcs teòrics interns** (Bé Comú, Sasia) — la veu és de Criteri.

### Exemple

> "**Criteri avaluat: Justícia distributiva + Arrelament territorial**
>
> L'informe mesura la 'S' a través de diversity metrics (headcount per gènere i origen), però no pas a través de la ràtio salarial CEO/salari mitjà —un indicador que cooperatives i B Corps sí reporten i que aquí brilla per la seva absència. La riquesa generada es presenta com a rendibilitat per accionista, sense desglossar quina part retorna als treballadors o a la comunitat d'origen. Quant a l'arrelament territorial, l'impacte es reporta només globalment (emissions agregades), sense dades per centre operatiu ni per comunitat local afectada. Aquesta mancança no és un error de l'informe; és un símptoma del marc ESG hegemònic, que mesura el que és fàcil de comptar, no el que és rellevant."

**Nota**: l'exemple públic no menciona Felber ni Sasia. La tria dels criteris (justícia distributiva, arrelament territorial) es fa internament sobre la base d'aquests marcs, però la veu editorial parla en nom de Criteri.

### Criteris d'aplicació

- **Qui l'escriu**: el redactor de Criteri (pot ser assistit per IA, però la tria dels criteris i la veu editorial són humanes)
- **Selecció de criteris**: 1-2 per informe, segons rellevància. No es repeteix el mateix criteri en dos informes consecutius
- **To**: editorial, no acusatori. Es qüestiona el marc, no l'empresa
- **Validació**: el Consell Assessor (pendent) revisa aleatòriament 1 informe/mes

---

## Carta del Director (mensual)

### Propòsit

És **l'empremta humana i ètica** de Criteri, escrita personalment per Paolo. Mentre "Més enllà del Checkbox" és la veu editorial basada en criteris definits, la Carta del Director és la mirada personal i ètica del fundador — allò que cap competidor (ni IA ni Big Four) pot replicar.

### Especificacions

| Atribut | Definició |
|---------|-----------|
| **Freqüència** | 1 cop al mes, a l'inici de l'última newsletter del mes (última setmana) |
| **Autor** | Paolo (no Z.ai-bot). El bot pot ajudar amb estructuració o revisió ortogràfica, però el contingut i la veu són de Paolo |
| **Extensió** | 400-600 paraules |
| **Tonalitat** | Personal, ètica, editorial. No neutral — Paolo pren posició |
| **Ubicació** | Secció 1 de l'última newsletter mensual (abans de notícies ESG) |

### Estructura recomanada

1. **Anècdota o gancho del mes** (1 paràgraf, ~100 paraules) — Un fet concret, personal o d'actualitat, que serveixi de porta d'entrada
2. **Mirada ètica** (2-3 paràgrafs, ~250-350 paraules) — Què ensenyen els informes del mes des de la lent del Bé Comú / Economia Ciutadana. Connecta amb 1-2 informes publicats aquell mes
3. **Compromís de Criteri** (1 paràgraf, ~100 paraules) — Què farem nosaltres amb això. No només opinar, sinó actuar

### Examples temàtics (roadmap editorial)

- **Setembre 2026 (llançament)**: "Per què Criteri, per què ara"
- **Octubre 2026**: "El verdader cost del greenwashing"
- **Novembre 2026**: "Quan la 'S' deixa de ser social"
- **Desembre 2026**: "Balanç de l'any i propòsits per al 2027"

### Integració

- A la web: arxiu accessible a `/carta-director` (pàgina pública amb històric)
- A la newsletter: secció 1 de l'última edició del mes
- A GitHub: cada carta es guarda com a `assets/cartes-director/YYYY-MM.md`

### Estructura de pàgines (regla fixa)

| Pàgina | Contingut |
|--------|-----------|
| **1** | Títol + missatge clau + **00 Semàfor Metodològic** + 01 Fitxa tècnica + 02 Cinc dades clau |
| **2** | 03 Resum executiu + 04 Implicacions per actor + **"Més enllà del Checkbox"** |
| **3** | 05 Connexions amb altres informes + 06 Accions recomanades |
| **4** | 07 Cross-reference amb certificacions + disclaimer |

- Sense subtítol a la portada (anar directe al missatge clau després del títol)
- Marge uniforme de 18mm a totes les pàgines
- Cap bloc tallat entre pàgines
- Si un bloc no cap a la pàgina que li correspon, adaptar mides perquè hi càpiga

### Eslògan

**"Amb 7 minuts pots estalviar 5 hores de feina."**

Aquest eslògan defineix la proposta de valor de Criteri ESG: cada informe processat amb els 7 blocs permet a un professional estalviar les 5 hores que trigaria a llegir i analitzar el document original de 200 pàgines. El temps de lectura del nostre informe processat és d'aproximadament 7 minuts.

### Exemple pilot

L'informe pilot de referència és la **Revisió dels ESRS publicada per la Comissió Europea el 6 de maig de 2026**. Està completament processat en els 7 blocs i disponible a:
- `/home/z/my-project/download/Criteri_Informe_Exemple_ESRS.pdf` (PDF, 4 pàgines, 335 KB)
- Visible també com a modal a la web (botó "Veure exemple complet" a la homepage)

## Formats addicionals per a Ultra

Els subscriptors Ultra tenen accés a 3 formats addicionals per a cada informe:

### Format 1 — Podcast d'àudio (5 minuts)

- **Durada**: 4-6 minuts (~700-900 paraules)
- **Idiomes**: català i castellà (un per idioma per informe)
- **Estructura**:
  - 30s — Hook + fitxa tècnica
  - 2 min — Resum executiu i dades clau
  - 2 min — Accions recomanades
  - 30s — Tancament + CTA per al detall complet
- **Contingut**: només l'informe (no connexions ni context polític)
- **To**: periodístic, com si un periodista expliqués el que ha investigat
- **Eina de generació**: **NotebookLM** (Paolo ho genera manualment i ho comparteix)
  - ❌ z-ai TTS descartat — qualitat insuficient, veus robòtiques
  - ❌ ElevenLabs pendent de validació futura

**Decisió presa**: 25 juny 2026 — Paolo confirma que NotebookLM dona moltíssima millor qualitat i que ell generarà els àudios manualment.

### Format 2 — Diapositives PowerPoint editables

- **Format**: .pptx real i editable (no PDF)
- **Diapositives**: 8-10
- **Estructura**:
  - Slide 1: Portada (títol, data, etiquetes)
  - Slide 2: Fitxa tècnica
  - Slide 3: Resum executiu (3-4 punts)
  - Slide 4-5: 5 dades clau
  - Slide 6: Implicacions
  - Slide 7-8: Accions recomanades
  - Slide 9: Cross-reference amb certificacions
  - Slide 10: Resum visual + CTA
- **Estil**: coherent amb Criteri ESG (terra+coure, fonts clàssiques) però sobri
- **Editabilitat**: l'usuari pot canviar logo, colors, afegir pròpia portada
- **Plantilla mestra**: generada via python-pptx, disponible a `/home/z/my-project/scripts/generate_ppt_editable.py`

**Exemple pilot generat**: `/home/z/my-project/download/Criteri_Informe_ESRS_PPT_editable.pptx` (47 KB, 10 slides)

### Format 3 — Dossier mensual temàtic (segons interessos)

- **Format**: PDF llarg (15-25 pàgines)
- **Freqüència**: 1/mes per subscriptor Ultra
- **Personalització**: segons interessos declarats (CSRD, EcoVadis, B Corp, etc.)
- **Contingut**: recopilació temàtica dels informes del mes + anàlisi transversal

## Connexions personalitzades mensuals

Els subscriptors Ultra tenen dret a 1 petició mensual de connexions personalitzades.

### Què és

L'usuari Ultra fa 1 petició al mes on descriu la seva empresa i nosaltres li entreguem un informe personalitzat que mapeja els informes publicats aquell mes amb la seva situació concreta.

### Informació que demanem (formulari d'onboarding Ultra)

- Nom i sector de l'empresa
- Mida (treballadors + facturació)
- Certificacions actuals (EcoVadis score, B Corp, MSCI rating, etc.)
- Mercats on opera
- Supply chain clau (3-5 principals proveïdors per regió)
- 3 àmbits prioritaris (ex. "millorar EcoVadis, preparar CSRD, drets humans")
- Riscos específics detectats (si n'hi ha)

### Què entreguem (PDF de 4-6 pàgines)

- Bloc 1: Resum del seu context ESG actual
- Bloc 2: 3 informes del mes amb impacte directe en la seva empresa
- Bloc 3: Per a cadascun, 2-3 connexions específiques amb la seva situació
- Bloc 4: 3 accions prioritàries personalitzades per als propers 30 dies
- Bloc 5: Projecció a 90 dies (què necessitarà quan entrin en vigor properes lleis)

### Limitació

1 petició/mes/empresa. Peticions addicionals: 99€/cadascuna.

## Nivells de subscripció — resum actualitzat

| Nivell | Preu | Contingut |
|--------|------|-----------|
| **Free** | 0€ | Newsletter + 3 informes oberts/mes + autodiagnòstic bàsic |
| **Premium** | 39€/mes | Tot Free + arxiu complet + cerca + alertes + cross-reference + accions recomanades |
| **Ultra** | 89€/mes | Tot Premium + **podcast** + **PPT editable** + **dossier mensual temàtic** + **1 connexió personalitzada/mes** |
| **Equip B2B** | 199€/mes | Ultra per a 5 usuaris + API + dashboard d'equip |

## Fonts de dades que cobrim

### 1. Certificacions i ratings
- EcoVadis, B Corp, MSCI ESG, Sustainalytics, ISS ESG, CDP, FTSE4Good

### 2. Regulació UE
- CSRD, Taxonomia UE, SFDR, CSDDD, Right to Repair, Pacte Verd UE

### 3. Frameworks i estàndards
- GRI, SASB, TCFD, TNFD, EFRAG ESRS, GHG Protocol, ISO 26000

### 4. Ètica i drets
- UN Global Compact, OECD Guidelines, ILO Declaration, UN Guiding Principles, SDG Compass, Principles for Responsible Investment

**Total**: 30+ fonts monitoritzades via RSS i crawler automàtic.

---

## Política de contingut audiovisual (vídeos)

### Principi rector

**Criteri mai recomanarà vídeos per consumir, però sí processarà vídeos com a font d'informes.**

La diferència és crucial:
- **Recomanar per consumir**: "Mira aquest vídeo de 30 minuts" → rebutjat. Contradiu la proposta de valor ("amb 7 minuts estalvies 5 hores")
- **Processar com a informe**: "Hem extret els 8 blocs d'aquesta presentació de la UE" → acceptat. Manté la proposta de valor

### Tractament de vídeos com a font d'informes

Hi ha institucions que publiquen vídeos llargs amb contingut substancial que es poden processar:

| Tipus de vídeo | Exemple | Tractament |
|----------------|---------|------------|
| Presentacions d'informes oficials | UE presentant CSRD, IPCC presentant informe | Transcriure → processar amb 8 blocs |
| Conferències acadèmiques | Harvard, IESE, ESADE | Transcriure → processar |
| Webinars institucionals | WEF, OECD, ILO | Transcriure → processar |
| Audiències parlamentàries | Comissió Europea, Congrés dels Diputats | Transcriure → processar |

**Fluxe**: detectem vídeo rellevant → transcriure (Whisper o servei similar) → aplicar els 8 blocs incloent Semàfor Metodològic (adaptat al format vídeo) i Més enllà del Checkbox → publicar com a informe processat.

### Decisions operatives

| Idea | Decisió | Raó |
|------|---------|-----|
| Secció regular "Vídeos recomanats" a la newsletter | ❌ No | Contradiu proposta de valor, cost alt, risc greenwashing |
| Bloc de vídeos a la web | ❌ No | Mateixos motius |
| Processar vídeos llargs com a informes | ✅ Sí | Coherent amb proposta de valor |
| "Vídeo de la quinzena" a newsletter (màx 1, auditat) | ✅ Sí (des de 2027) | Baix cost, alt descobriment, disciplina |
| Recomanar vídeos corporatius | ❌ Mai | Risc greenwashing |
| Recomanar vídeos institucionals (UE, IPCC, WEF) | ✅ Sí | Contingut rellevant i auditable |
| Crear contingut propi en vídeo (webinars) | ⏳ Phase Ultra 2027 | Ja tenim podcast, vídeo és evolució natural |

### Consideració ètica

- **Risc principal**: difondre greenwashing per omisió d'auditoria. Si recomanem sense auditar, som còmplices del relat corporatiu
- **Principi kantiana**: tractar els vídeos com a eina de retenció d'usuari sense valor afegit seria instrumentalitzar-los. Si recomanem un vídeo, ha de ser perquè realment aporta valor — no per omplir la newsletter
- **Bé comú**: el bé comú es serveix amb contingut que millora la presa de decisions ESG. Un vídeo institucional rellevant sí; un vídeo corporatiu de greenwashing no

---

## Històric de canvis

- **5 juliol 2026** — **Política de contingut audiovisual**: Criteri no recomanarà vídeos per consumir, però sí processarà vídeos institucionals com a font d'informes (transcriure + 8 blocs). "Vídeo de la quinzena" a newsletter previst per 2027.
- **4 juliol 2026** — Canvi de marc conceptual: "Economia Civil" → **Economia del Bé Comú (Felber) + Economia Ciutadana (Sasia, Deusto)**. Nous 5 criteris operacionals per "Més enllà del Checkbox": dignitat humana, justícia distributiva, sostenibilitat absoluta, co-decisió democràtica, arrelament territorial.
- **4 juliol 2026** — Afegida **Carta del Director mensual**: peça editorial escrita per Paolo, 400-600 paraules, a l'inici de l'última newsletter del mes. Empremta humana ètica, complementària al "Més enllà del Checkbox".
- **4 juliol 2026** — Generades 2 propostes visuals pel Semàfor Metodològic (Format A: compacte vertical · Format B: barra horitzontal). Pendents de selecció.
- **3 juliol 2026** — Afegit **Bloc 0: Semàfor Metodològic** (5 indicadors + nota A-D). Diferenciació principal vs competidors. Inspirat en valoració amb Gemini.
- **3 juliol 2026** — Afegida **subsecció "Més enllà del Checkbox"** dins del bloc 4 (Implicacions). Veu editorial mediterrània vs marcs ESG anglosaxons.
- **25 juny 2026** — Format Ultra completat: podcast (NotebookLM), PPT editable (python-pptx), dossier mensual, connexions personalitzades
- **25 juny 2026** — Eliminada "sessió consultiva mensual" d'Ultra per decisió de Paolo
