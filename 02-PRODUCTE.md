# 02 — Producte

> Especificacions del producte: format de l'informe, formats addicionals, nivells de subscripció.

## Format de l'informe — 7 blocs

Cada informe processat per Criteri ESG segueix una estructura fixa de 7 blocs. La consistència és el que permet escalar i comparar informes entre ells.

### Blocs

1. **Fitxa tècnica** (60-80 paraules) — Institució, data, tipus, pàgines, URL original, context de publicació
2. **Cinc dades clau** — Punts quantitatius amb valor, context ampliat (2-3 frases) i pàgina citada
3. **Resum executiu** (300 paraules) — Què diu en llenguatge planer, context, impacte general
4. **Implicacions** (450-540 paraules) — Tres blocs: empreses, reguladors, ciutadans. Anàlisi més profunda
5. **Connexions** (200-250 paraules) — Relacions amb altres informes i actualitat. Tipus de relació explicat
6. **Accions recomanades** ⭐ — 3-5 accions concretes per millorar. El cor operatiu. Cada acció amb context ampliat
7. **Cross-reference** ⭐ — Mapatge automàtic amb EcoVadis, B Corp, MSCI i GRI. Impacte específic explicat

⭐ = blocs diferenciadors. Cap competidor els fa perquè requereixen coneixement expert dels frameworks.

### Estructura de pàgines (regla fixa)

| Pàgina | Contingut |
|--------|-----------|
| **1** | Títol + missatge clau + 01 Fitxa tècnica + 02 Cinc dades clau |
| **2** | 03 Resum executiu + 04 Implicacions per actor |
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

## Històric de canvis

- **25 juny 2026** — Format Ultra completat: podcast (NotebookLM), PPT editable (python-pptx), dossier mensual, connexions personalitzades
- **25 juny 2026** — Eliminada "sessió consultiva mensual" d'Ultra per decisió de Paolo
