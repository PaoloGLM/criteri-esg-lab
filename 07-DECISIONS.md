# 07 — Decisions

> Log de decisions preses amb data i raonament. Si una decisió es canvia, NO s'esborra l'anterior — s'afegeix una nova entrada marcant l'anterior com a superseded.

## Format de cada entrada

```
### [DATA] — Decisió
**Decisió**: [què s'ha decidit]
**Rao**: [per què]
**Alternatives considerades**: [què més es va pensar]
**Impacte**: [en què afecta el producte/negoci]
**Estat**: Activa | Superseded per [DATA]
```

---

## 25 juny 2026 — Naming: Criteri ESG

**Decisió**: El nom del projecte serà "Criteri ESG"

**Rao**: Combina els tres eixos (ètica, reputació, acció), funciona en català/castellà/anglès, és memoritzable i té tagline natural ("El teu criteri per decidir bé")

**Alternatives considerades**:
- Clàusula — descartat per tonalitat legalista
- Sumari — descartat per massa genèric
- Llindar — descartat per massa poètic
- Mèrit — descartat per connotacions pretensioses
- Ethos — descartat per massa acadèmic
- Pauta — descartat per no funcionar en anglès
- Praxis — descartat per connotacions polítiques

**Impacte**: Marca, domini (criteriesg.com), tota la comunicació

**Estat**: Activa

---

## 25 juny 2026 — Nicho: Ètica + ESG + Certificacions

**Decisió**: Centrar el producte en sostenibilitat, ètica empresarial i certificacions (EcoVadis, B Corp, MSCI, etc.), no només en "informes ESG generals"

**Rao**: Així diferenciem de competidors generalistes (EURACTIV, POLITICO) i ens enfocquem en un públic amb poder adquisitiu i necessitat real (directors de sostenibilitat, consultories)

**Alternatives considerades**:
- Cobertura general ESG sense focus — descartat per competir amb tots
- Només compliance (CSRD) — descartat per limitar sostre
- Només inversors — descartat per mercat massa estret

**Impacte**: Públic objectiu, fonts a monitoritzar, valor afegit del producte (cross-references amb certificacions)

**Estat**: Activa

---

## 25 juny 2026 — Eliminada sessió consultiva mensual d'Ultra

**Decisió**: Eliminar "sessió consultiva mensual" del nivell Ultra

**Rao**: Paolo no vol oferir sessions 1:1 perquè no escalen i obliguen a un compromís de temps que no es vol assumir en la fase inicial

**Alternatives considerades**:
- Mantenir-la però a un preu més alt (150€/mes) — descartat per complexitat
- Oferir-la només als primers 10 Ultra com a beta — descartat

**Impacte**: Nivell Ultra redefinit: Premium + podcast + PPT + dossier mensual + 1 connexió personalitzada/mes (sense sessió 1:1)

**Estat**: Activa

---

## 25 juny 2026 — Connexions personalitzades mensuals (Ultra)

**Decisió**: Afegir "1 petició mensual de connexions personalitzades" al nivell Ultra

**Rao**: Aportació de Paolo — servei altament personalitzat on l'usuari Ultra demana com afecten els informes del mes a la seva empresa concreta. Cap competitor ho ofereix.

**Alternatives considerades**:
- Limitar a 1 petició per trimestre — descartat per poc valor percebut
- Peticions il·limitades — descartat per no escalable

**Impacte**: 
- Cal formulari d'onboarding Ultra demanant dades de l'empresa (sector, mida, certificacions, supply chain)
- Cal dissenyar PDF de 4-6 pàgines amb l'estructura definida
- Peticions addicionals: 99€/cadascuna

**Estat**: Activa

---

## 25 juny 2026 — Podcasts: NotebookLM, no z-ai TTS

**Decisió**: Els podcasts s' generaran amb NotebookLM (manualment per Paolo), no amb l'API TTS de z-ai

**Rao**: La qualitat de z-ai TTS és insuficient (veus robòtiques, sense to periodístic). Paolo ja ha experimentat amb NotebookLM i la qualitat és molt superior. Tu (Z.ai) no saps generar podcasts prou bons amb les eines disponibles.

**Alternatives considerades**:
- z-ai TTS amb veus diferents (provades: xiaochen, luodo) — descartat per qualitat
- ElevenLabs via API — pendent de validació futura quan el producte estigui en marxa
- Hire voice actor — descartat per cost

**Impacte**: 
- Els podcasts no es poden generar automàticament per a cada informe
- Cal temps manual de Paolo per generar-los
- Limita el nombre d'informes amb podcast (només Ultra i només els més rellevants)

**Estat**: Activa

---

## 25 juny 2026 — Document viu a GitHub, no Notion

**Decisió**: El document viu del projecte serà un repositori GitHub privat (`criteri-esg-lab`), no Notion ni Google Docs

**Rao**: 
- Z.ai pot escriure directament a GitHub via Personal Access Token
- Paolo pot llegir còmodament via github.com sense saber res de tècnic
- Històric de canvis automàtic (versionat)
- Cost: 0€

**Alternatives considerades**:
- Notion — descartat perquè Z.ai no hi pot escriure directament
- Google Docs — descartat per mateixa raó
- Markdown passat per xat — descartat perquè es perd històric

**Impacte**: 
- Tot el contingut del projecte viu a GitHub
- Paolo ha creat compte i Personal Access Token
- Z.ai fa commits directament quan es pren una decisió

**Estat**: Activa

---

## 25 juny 2026 — Logo provisional amb tipografia

**Decisió**: No tenim logo oficial encara. Usem la tipografia ("Criteri." amb punt en coure) com a identitat provisional

**Rao**: 
- Volem un logo professional però encara no és prioritari
- La tipografia Fraunces + el punt en coure ja donen identitat
- Quan tinguem 5 informes pilot i 50 subscriptors, ensenyarem 3 propostes a un dissenyador o farem servir IA generativa

**Alternatives considerades**:
- Fer logo amb IA ara mateix — descartat per no ser prioritari
- Contractar dissenyador — descartat per cost
- Logo concurs 99designs — descartat per mateixa raó

**Impacte**: 
- Web, PPTs i PDFs usen "Criteri." com a logo
- Caldrà actualizar quan tinguem logo oficial

**Estat**: Activa

---

## 25 juny 2026 — Bilingüisme CAT/ES per defecte

**Decisió**: La web i tots els continguts seran bilingües català/castellà des del primer dia

**Rao**: 
- Paolo és catalanoparlant però el mercat objectiu inclou tot Espanya
- Mostrar compromís amb la llengua pròpia
- B Corp i EcoVadis valoren positivament el compromís lingüístic

**Alternatives considerades**:
- Només castellà — descartat per contradir missió ètica
- Només català — descartat per limitar mercat
- Trilingüe CAT/ES/EN — descartat per ara (any 2)

**Impacte**: 
- Tots els continguts doblats
- Toggle d'idioma al header
- Newsletter bilingüe (l'usuari tria)

**Estat**: Activa

---

## Plantilla per a futures decisions

```markdown
### [DATA] — [Decisió breu]

**Decisió**: 
**Rao**: 
**Alternatives considerades**: 
**Impacte**: 
**Estat**: Activa | Superseded per [DATA]
```
