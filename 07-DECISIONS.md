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

## 29 juny 2026 — Newsletter: Beehiiv com a plataforma

**Decisió**: Beehiiv serà la plataforma per crear i enviar la newsletter setmanal de Criteri ESG

**Rao**: 
- Pla Free gratuït fins 2.500 subscriptors (millor que Mailchimp que cobra a 500)
- Excel·lent deliverability (especialitzat en newsletters, no e-commerce)
- API pública que permet crear esborranys via API (jo faig el 95% de la feina, Paolo només clica "Send")
- Monetització integrada (Boost, ad network) per al futur Premium
- Editor visual per si calen ajustaments ràpids sense demanar-me codi

**Alternatives considerades**:
- **Mailchimp** — descartat per deliverability mitja-baixa i preu que puja ràpidament (80€/mes a 2.500 subs)
- **Substack** — descartat perquè es queda 10% si cobres i no pots exportar fàcilment la llista
- **Resend** — descartat per a fase inicial perquè no té dashboard ni editor visual; reconsiderable any 2 si volem control total

**Limitació tècnica confirmada**:
- La API pública de Beehiiv permet crear esborranys però NO permet enviar emails (cal pla Enterprise a 1.000+$/mes)
- Flux setmanal: jo creo esborrany via API (5 minuts treball meu), Paolo revisa i clica "Send" al tauler (5 minuts treball Paolo)
- Quan arribem a 5.000+ subs i sigui rendible Enterprise, automatitzo tot

**Impacte**: 
- Creació de compte Beehiiv: tasca P1 al roadmap (agost 2026)
- Caldrà API key de Beehiiv (com la de GitHub) perquè jo pugui crear esborranys automàticament
- 5 minuts/setmana de feina manual de Paolo per enviar

**Estat**: Activa

---

## 29 juny 2026 — Estratègia de llançament per fases (early bird)

**Decisió**: Llançament de Criteri ESG al setembre 2026 amb model freemium progressiu i "early bird" de 2 mesos

**Rao**: 
- Generar tracció inicial amb usuaris gratis que es converteixen en ambaixadors
- Provar qualitat del producte sense pressió de venda
- Recollir feedback abans de cobrar
- Crear urgència amb oferta de llançament limitada

**Detalls del model**:
- Setembre-octubre 2026: accés total gratuït per a tothom (early bird)
- A partir de novembre 2026: paywall activat
  - Informes dels últims 6 mesos: només Premium
  - Informes antics (>6 mesos): gratis amb registre
  - Newsletter: completa per a Premium, reduïda per a gratuïts
- Ultra no disponible fins abril 2027 (6 mesos post-llançament)

**Oferta de llançament**:
- 50 primers subscriptors Premium: 29€/mes durant el primer any (vs 39€/mes normal)
- Comptador visible a la web ("Queden X places")
- 7 dies de prova gratuïta sempre disponible (per a tothom)

**Alternatives considerades**:
- Llançament directe amb paywall des del dia 1 — descartat perquè requereix molta tracció inicial sense prova social
- Tots els informes gratis per sempre — descartat perquè no genera ingressos
- Freemium pur (alguns informes gratis sempre) — descartat perquè dilueix el valor Premium

**Impacte**: 
- Calendari detallat al document `05-ROADMAP.md`
- Estratègia completa al document `14-LLANÇAMENT-FASES.md`
- Newsletter reduïda per a gratuïts: apartats Inversió ESG i Connexió limitats a una frase + CTA

**Estat**: Activa

---

## 29 juny 2026 — Newsletter bimensual (no setmanal)

**Decisió**: La newsletter es publica cada 2 setmanes, no cada setmana

**Rao**: 
- Assegurar prou informació de qualitat per a cada edició
- Reduir càrrega de producció (Paolo + Z.ai-bot)
- Freqüència bimensual és suficient per mantenir relació amb subscriptor

**Alternatives considerades**:
- Setmanal — descartat per pressió de producció i risc de baixa qualitat
- Mensual — descartat per massa espaiada, perd relació amb subscriptor

**Calendari post-llançament**:
- Newsletter #1: 7 setembre 2026
- Newsletter #2: 21 setembre 2026
- Cada 2 setmanes a partir d'aquí

**Impacte**: 
- 22-26 newsletters per any (vs 50-52 setmanals)
- Calendari actualitzat al roadmap (secció 05)

**Estat**: Activa

---

## 29 juny 2026 — Calendari juliol-setembre 2026

**Decisió**: 
- Juliol 2026: tancar dissenys + comptes + registres
- Agost 2026: proves internes amb beta testers
- Setembre 2026: llançament oficial

**Rao**: 
- Calendari realista que permet validar el producte abans del llançament
- Aprofita el pic de publicacions ESG de setembre (segons anàlisi de competència)
- Dona temps a la Roser per incorporar-se

**Detalls per mes**:
- Juliol: 5 setmanes de treball intensiu en dissenys, informes pilot, comptes, registres
- Agost: 4 setmanes de proves amb 10-20 beta testers + iteració
- Setembre: deploy a producció + estratègia de captació inicial

**Impacte**: 
- Roadmap (secció 05) completament reescrit amb aquest calendari
- 15 issues existents al GitHub Project revisats i reassignats

**Estat**: Activa

---

## 29 juny 2026 — Incorporació de la Roser a l'equip

**Decisió**: Una nova persona s'incorpora a l'equip amb rol de Tech Lead (disseny + programació + BD)

**Rao**: 
- Paolo no pot fer-ho tot sol
- Necessitem expertesa tècnica especialitzada per al llançament
- La Roser té domini en disseny, programació web i bases de dades

**Repartiment de rols**:
- **Paolo** (CEO/Estratègia): decisions estratègiques, relacions externes, enviaments newsletter, gestió de marca
- **Roser** (Tech Lead): disseny web, programació, base de dades, integracions tècniques
- **Z.ai-bot** (assistent tècnic): generació de continguts, recerques, documentació al GitHub

**Comunicació amb Z.ai-bot**:
- Paolo parla amb Z.ai-bot a través del seu xat
- Roser obre el seu propi xat amb Z.ai-bot (Opció A, recomanada)
- GitHub és el "cervell compartit" — totes les decisions hi queden registrades
- Per decisions estratègiques, Paolo i la Roser parlen primer, després Paolo consulta a Z.ai-bot

**Accessos**:
- Roser té accés al repositori GitHub (lectura i escriptura)
- Roser tindrà accés a Vercel, Supabase, Beehiiv quan es creïn els comptes
- Tokens i credencials NO es comparteixen al xat ni al GitHub

**Impacte**: 
- Roadmap (secció 05) actualitzat amb repartiment de responsabilitats
- Sistema de tasques (secció 11) manté @PaoloGLM com a persona per a tasques operatives, però la Roser es farà càrrec de les tècniques
- 15 issues existents al GitHub Project es reassignen: Paolo → operatives, la Roser → tècniques

**Estat**: Activa

---

## 29 juny 2026 — Repositori d'informes des del 1 gener 2026

**Decisió**: El repositori d'informes a la web començarà l'1 de gener de 2026

**Rao**: 
- Dona continuïtat al llançament (al setembre ja hi haurà 8 mesos d'informes)
- Permet que els primers usuaris vegin volum de contingut
- Els informes de gener-març 2026 ja seran accessibles gratis al setembre (han passat 6 mesos)

**Regla dels 6 mesos**:
- Qualsevol informe publicat fa més de 6 mesos és accessible gratis (sota registre) per sempre
- Els informes dels últims 6 mesos requereixen Premium
- Exemple: informe publicat 15 gener 2026 → gratis a partir de 15 juliol 2026

**Quantitat esperada al llançament (setembre 2026)**:
- 32-48 informes processats (gener-agost 2026)
- D'aquests, 16-24 seran gratis (>6 mesos), 16-24 requeriran Premium

**Impacte**: 
- Documentat a `14-LLANÇAMENT-FASES.md` secció 4
- Cal processar informes de gener-juny 2026 durant juliol (ja al roadmap)

**Estat**: Activa

---

## 3 juliol 2026 — Diferenciació estratègica: Semàfor Metodològic + Economia Civil

**Decisió**: Adopció de dues innovacions editorials per diferenciar Criteri dels agregadors ESG existents (Bloomberg Green, GreenBiz, MSCI ESG):

1. **Bloc 0 — Semàfor Metodològic**: targeta visual amb 5 indicadors (Scope 3, terminis, fonts independents, granularitat, verificació externa) + nota A-D. Apareix abans que la fitxa tècnica per permetre al lector avaluar la qualitat de l'informe en 10 segons.
2. **Subsecció "Més enllà del Checkbox"** dins del bloc 4 (Implicacions): paràgraf editorial de 100-150 paraules amb lent d'Economia Civil (la "S" és relacional? la "G" és democràtica? impacte territorial? lògica distributiva?).

**Rao**:
- Risc detectat: mercat ESG saturat d'agregadors que només resumeixen conclusions. Sense diferenciació clara, Criteri es percep com "igual però sense experiència"
- Semàfor Metodològic: cap competidor audita la qualitat del darrere. És innovació editorial (no tecnològica), executable des del dia 1
- Economia Civil: és la veu autèntica mediterrània que cap Big Four pot replicar (el seu ADN és anglosaxó). Connecta amb el públic natural (cooperatives, B Corps, economia social CAT/ES/EU-sud)
- Es descarten 7 idees addicionals suggerides (pasaporte corporatiu, mapeig de contradiccions, autoavaluació inversa amb dilemes) per risc de dilució del focus i càrrega editorial insostenible per a una startup de 2 persones. Queden al roadmap com a features Ultra 2027.

**Alternatives considerades**:
- Implementar totes les idees de Gemini (9 features) → descartat per càrrega editorial
- Pivotar a eina d'auditoria automàtica → descartat per perdre la veu editorial
- Mantenir format 7 blocs sense canvis → descartat per risc de percepció "igual però sense experiència"

**Impacte**: 
- Estructura d'informe passa de 7 blocs a 1 targeta + 7 blocs (vegeu `02-PRODUCTE.md`)
- El redactor ha d'omplir manualment el Semàfor per cada informe (no IA)
- Consell Assessor (pendent de constituir) revisarà aleatòriament 1 informe/mes
- Documentat a `02-PRODUCTE.md`, `03-BRANDING.md`, `CONTEXT.md`

**Estat**: Activa

---

## 3 juliol 2026 — Confirmació del nom "Criteri" (descartat "Rigor")

**Decisió**: Es confirma "Criteri ESG" com a nom definitiu. Es descarta "Rigor" que s'havia valorat per emphasitzar el gir cap a l'auditoria metodològica.

**Rao**:
- "Rigor" contradiu la diferenciació d'Economia Civil (és fred, mecànic, anglosaxó)
- "Criteri" manté la identitat mediterrània i editorial, no tècnica
- "Rigor" com a autodesignació sense track record sona pretensiós
- Cost de rebranding: logo (17 propostes ja pujades a Drive/GitHub), paleta, docs, CONTEXT, registre OEPM previst per juliol —tot s'hauria de refer
- Disponibilitat de marca: "Rigor" és paraula comuna, registre més conflictiu

**Alternatives considerades**:
- Canvi a "Rigor" → descartat
- Canvi a "Rigor." (amb punt) per suavitzar → descartat
- Mantenir "Criteri" amb estratègies de neutralització → adoptat

**Impacte**: 
- Estratègies per neutralitzar percepció "estrany" a mercats no-catalans: tagline ancorador multilingüe (CAT/ES/IT/EN), storytelling obert a "Sobre nosaltres", no traduir mai el nom
- Documentat a `03-BRANDING.md` secció "Naming"
- Logo finalista v6 (Criteri negre + punt coure + hexàgon coure ESG blanc + fons crema) es manté

**Estat**: Activa

---

## 4 juliol 2026 — Canvi de marc: Economia Civil → Economia del Bé Comú + Economia Ciutadana

**Decisió**: Substituir el marc conceptual "Economia Civil" per "Economia del Bé Comú (Christian Felber) + Economia Ciutadana (Peru Sasia, Universidad de Deusto)" com a base teòrica de la subsecció "Més enllà del Checkbox".

**Rao**:
- L'Economia del Bé Comú té una matriu operacional estructurada (5 valors × 5 grups d'stakeholders = 20 cel·les avaluables) que permet criteris concrets i auditables
- L'Economia Ciutadana de Sasia aporta l'èmfasi en l'arrelament territorial i la participació ciutadana, matisos que l'Economia Civil no cobria tant explícitament
- Tots dos marcs són mediterranis/continentals i contrasten amb l'òptica anglosaxona dominant en ESG
- Paolo coneix i valora la feina de Peru Sasia a Deusto

**Alternatives considerades**:
- Mantenir "Economia Civil" → descartat perquè Paolo no li agrada el concepte
- Usar només "Economia del Bé Comú" → descartat perquè perd el matís d'arrelament territorial
- Usar només "Economia Ciutadana" → descartat perquè no té matriu operacional estructurada

**Impacte**: 
- Nous 5 criteris per "Més enllà del Checkbox": dignitat humana, justícia distributiva, sostenibilitat absoluta, co-decisió democràtica, arrelament territorial
- Storytelling del nom "Criteri" s'actualitza per referenciar ambdós marcs
- Documentat a `02-PRODUCTE.md`, `03-BRANDING.md`, `CONTEXT.md`

**Estat**: Activa

---

## 4 juliol 2026 — Carta del Director mensual (empremta ètica de Paolo)

**Decisió**: Afegir una nova peça editorial mensual —la "Carta del Director"— escrita personalment per Paolo, complementària al "Més enllà del Checkbox" (que escriu el redactor amb criteris definits).

**Rao**:
- "Més enllà del Checkbox" aporta veu editorial basada en criteris, però és estructural i apareix a cada informe
- Falta una peça més personal, ètica i humana que només Paolo pot aportar
- Aquesta peça és allò que cap competidor (ni IA ni Big Four) pot replicar —l'empremta humana del fundador
- Diferenciació autèntica en un mercat on la majoria d'eines ESG son asèptiques

**Especificacions**:
- Freqüència: 1/mes, a l'inici de l'última newsletter del mes
- Autor: Paolo (el bot només ajuda amb estructuració/revisió)
- Extensió: 400-600 paraules
- Estructura: anècdota/gancho + mirada ètica (lent Bé Comú) + compromís concret de Criteri
- Arxiu web a `/carta-director` + GitHub a `assets/cartes-director/YYYY-MM.md`

**Alternatives considerades**:
- Carta setmanal → descartat per càrrega editorial de Paolo
- Carta per a cada informe → descartat perquè es dilueix el pes
- Peça escrita per IA i revisada per Paolo → descartat perquè perdria l'autenticitat

**Impacte**: 
- Nova secció 1 a l'última newsletter del mes
- Nou apartat a `02-PRODUCTE.md` i `CONTEXT.md`
- Estructura de carpetes GitHub: `assets/cartes-director/`

**Estat**: Activa

---

## 4 juliol 2026 — Format A com a model oficial del Semàfor + marcs teòrics interns (no públics)

**Decisió**: Dues decisions complementàries:

1. **Format A (targeta compacta vertical)** confirmat com a model oficial del Semàfor Metodològic. Format B (barra horitzontal) descartat però disponible a `assets/proves-format/` per referència futura.

2. **Els marcs teòrics (Economia del Bé Comú de Felber + Economia Ciutadana de Sasia) passen a ser criteris interns**. No s'esmenten públicament a:
   - La veu editorial dels informes ("Més enllà del Checkbox")
   - El storytelling de marca ("Sobre nosaltres", tagline, etc.)
   - La Carta del Director
   - Cap comunicació externa

**Rao**:
- Format A triat perquè ofereix més densitat informativa per indicador (justificació textual de 10-15 paraules), mentre que el Format B només mostrava 1-2 paraules per cel·la
- Format A també es llegeix millor en PDF (pàgina 1) i en mòbil (columna única)
- Sobre els marcs teòrics: Paolo considera que citar Felber/Sasia públicament podria:
  - Confondre lectors no especialitzats (marcs poc coneguts fora de cercles acadèmics)
  - Generar debat teòric sobre el marc correcte, quan el que importa és la veu editorial
  - Restar autoria a Criteri (la veu ha de ser de Criteri, no d'una escola de pensament)
- Els marcs queden com a referent intern per garantir coherència editorial entre informes

**Alternatives considerades**:
- Format B → descartat per menor densitat informativa
- Format híbrid A+B → descartat per complexitat de maquetació
- Citació pública dels marcs amb nota a peu → descartat perquè Paolo vol veu pròpia
- Silenci absolut sobre el marc teòric (ni internament) → descartat perquè sense marc escrit els criteris derivarien en criteris personals del redactor de torn

**Impacte**: 
- Maquetació PDF i web del Semàfor: Format A
- Storytelling actualitzat: mencions a Felber/Sasia eliminades
- Exemple "Més enllà del Checkbox" reescrit sense mencions a marcs teòrics
- Documentat a `02-PRODUCTE.md`, `03-BRANDING.md`, `CONTEXT.md`

**Estat**: Activa

---

## 5 juliol 2026 — Patró LLM Wiki (Karpathy): fase mínima ara, completa al octubre/novembre

**Decisió**: Implementar el patró LLM Wiki descrit per Andrej Karpathy (https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) en dues fases:

**Fase 1 (implementada ara, juliol 2026)** — fase mìnima de traçabilitat:
- Creació de `log.md` — registre cronològic d'operacions (ingests, lints, querys, ops)
- Creació de `index.md` — catàleg de contingut intel·lectual (connexions, contradiccions, temes transversals, certificacions)
- Sense wiki automàtica encara — els elements s'identifiquen manualment durant l'ingest

**Fase 2 (prevista octubre-novembre 2026, post-llançament)** — wiki completa:
- Wiki de connexions automatitzada (bloc 5): cada nou informe actualitza connexions amb els ja processats
- Wiki de certificacions vives (bloc 7 enriquit): pàgines per EcoVadis, B Corp, MSCI, GRI, SGE 21, CSRD, SFDR, TCFD
- Lint mensual: detectar contradiccions, claims desactualitzats, orphans
- Activació quan la biblioteca arribi a 20+ informes

**Rao**:
- Amb 3 informes processats (juliol 2026), la wiki completa és overengineering — el valor emergeix amb escala
- Setembre és el llançament; afegir una capa nova ara és risc de no arribar a temps
- La fase 1 (log + index) aporta valor permanent (traçabilitat, navegació, auditoria) amb cost baix (1h)
- El patlle encaixa molt bé amb els blocs 5 (Connexions) i 7 (Cross-reference) — quan s'activi la fase 2, aquests blocs es generaran automàticament

**Alternatives considerades**:
- Implementar wiki completa ara → descartat per risc de calendari
- No implementar res → descartat perquè la traçabilitat (log + index) té valor permanent
- Substituir els 7 blocs per wiki → descartat perquè perd l'estructura fixa que és el valor del producte

**Consideració ètica**: caldrà ser honest amb l'usuari sobre què és automàtic vs humà quan la wiki estigui activa. La transparència és ètica; amagar que les connexions són automàtiques fent-les passar per anàlisi humana no ho és. Aquest aspecte es definirà a la Fase 2.

**Impacte**:
- Creació de 2 fitxers nous al repo: `log.md` i `index.md`
- Sense impacte en el codi de la web (de moment) — la web segueix llegint de `reports.ts`
- Quan s'activi la Fase 2, caldrà decidir si la wiki és la font de veritat per a connexions i cross-ref (sí, recomanat) o si conviuen dues fonts (no recomanat)

**Estat**: Activa (fase 1 implementada; fase 2 prevista per revisió octubre/novembre 2026)

---

## 5 juliol 2026 — Integració tècnica del corrector LanguageTool (regla 17 reforçada)

**Decisió**: Després que en Paolo detectés que la regla 17 del CONTEXT.md (corrector obligatori) no es complia sistemàticament, s'implementen 3 mecanismes tècnics per garantir-ne el compliment:

1. **Nou mòdul `corrector_wrapper.py`** (a `/home/z/my-project/scripts/`): versió integrable del corrector que qualsevol script pot importar. Inclou whitelist de noms propis ESG (EcoVadis, Forética, ESG, ESRS, CSRD, etc.) i anglicismes acceptats (compliance, reporting, stakeholder, etc.) per evitar falsos positius.

2. **Scripts de generació integren el corrector automàticament**: cada script que generi text públic (informes, newsletters, HTML) ha de cridar `check_html()` o `check_text()` al final i guardar el log al costat del fitxer generat (`<fitxer>.corrector.log`). El log mostra errors reals (filtrats per whitelist) i marca quins són auto-corregits vs manuals.

3. **Auditoria inicial realitzada**: s'han auditat 15 fitxers públics ja generats. Resultat honest:
   - 3.582 deteccions totals en bruto
   - 419 errors reals (després de filtrar whitelist): 178 auto-corregits + 241 manuals pendents
   - Errors reals més freqüents: castellanismes ("escenarios" per "escenaris"), errors d'accentuació ("regulatoria" per "regulatòria"), apostrofació ("d'risc" per "de risc"), plurals de sigles ("ONGs" per "ONG")
   - Top falsos positius filtrats: espais HTML (2.200+), acrònims ESG (600+), noms propis (Forética, EcoVadis, etc.)

**Rao**:
- La regla 17 existia des de fa setmanes però no es complia perquè era un recordatori verbal, no un mecanisme tècnic
- L'auditoria ha revelat errors reals (castellanismes, accents) en pilots que ja s'havien ensenyat a en Paolo
- En Paolo va expressar pèrdua de confiança; la restauració de la confiança requereix mecanismes tècnics, no promeses
- L'LLM és stateless entre sessions: una promesa verbal no persisteix, però un script que importi `corrector_wrapper.py` sí

**Alternatives considerades**:
- Prometre complyment manual → descartat perquè no és verificable ni persistent
- Avortar la generació si hi ha errors manuals → descartat perquè alguns falsos positius legítims bloquejarien la generació
- Marcar tots els errors com a warnings sense guardar log → descartat perquè en Paolo no pot auditar

**Impacte**:
- `corrector_wrapper.py` (nou mòdul): importable per qualsevol script
- `auditoria_corrector.py` (nou script): per re-auditar quan calgui
- `generate_pilot_foretica.py` (modificat): ja integra el corrector i guarda log
- `CONTEXT.md` regla 17: actualitzada amb normes operatives específiques
- 15 fitxers públics ja generats queden amb logs d'auditoria al costat (`.corrector.log`)
- Cal revisió manual dels 241 errors pendents abans de publicar-los

**Estat**: Activa

---

## 5 juliol 2026 — Política d'anglicismes: mantindre, però minimitzar

**Decisió**: Es mantenen els anglicismes ESG acceptats (compliance, reporting, stakeholder, scope, greenwashing, framework, rating, score, audit, board, datapoints, disclosure, etc.) en la veu editorial de Criteri, amb dues condicions:

1. **Freqüència baixa**: no n'abusis. Quan existeixi una alternativa catalana/castellana clara i equivalent, preferir-la (ex: "tauler" per "board" si sona natural; "informe" per "reporting" si el context ho permet).

2. **Coherents amb el públic**: els professionals del sector ESG estan acostumats a aquests anglicismes; fer-los desaparèixer tots crearia un text artificiós i pedant. Però repetir-los en cada frase degrada el llenguatge i contradiu la veu mediterrània de Criteri.

**Política operativa**:
- Els anglicismes acceptats estan a la whitelist del `corrector_wrapper.py` i no saltaran com a errors
- Quan el corrector marqui un anglicisme NO whitelisted, cal decidir:
  - Si és tecnicisme ESG estès → afegir a whitelist
  - Si té alternativa clara → substituir
  - Si és dubtós → consultar en Paolo
- L'objectiu no és zero anglicismes, sinó **densitat baixa**: cap paràgraf hauria de tenir més de 2-3 anglicismes

**Rao**:
- En Paolo considera que els anglicismes degraden el llenguatge, però reconeix que els professionals del sector n'estan acostumats
- Eliminar-los tots faria el text artificial; mantindre'ls tots degrada la veu editorial
- La posició intermèdia (mantindre'ls però minimitzar) és coherent amb la identitat mediterrània de Criteri

**Llista actual d'anglicismes acceptats (juliol 2026)**:
- compliance, Compliance
- reporting, Reporting
- stakeholders, stakeholder, Stakeholders
- greenwashing, Greenwashing
- scope, Scope, Scope 1, Scope 2, Scope 3
- datapoints, datapoint
- disclosure, disclosures, Disclosure
- framework, frameworks, Framework
- rating, ratings, Rating
- score, scores, Score
- audit, auditoria, auditable
- board, Board
- feedback, Feedback
- checklist, checklists
- CEO, CFO, CSO
- AUM
- Trend, Trends (de Forética Tendencias)
- B Corp, B Corps

**Quan revisar-ho**: setembre 2026 (postllançament), quan tinguem feedback real dels primers subscriptors sobre el to editorial.

**Estat**: Activa

---

## 5 juliol 2026 — Política de contingut audiovisual: processar, no recomanar

**Decisió**: Criteri no inclourà una secció regular de "vídeos recomanats" a la newsletter ni a la web. En canvi, sí processarà vídeos institucionals llargs (presentacions d'informes, conferències acadèmiques, webinars, audiències parlamentàries) com a font d'informes, transcrivint-los i aplicant-hi els 8 blocs.

**Principi reductor**: Criteri mai recomanarà vídeos per consumir, però sí processarà vídeos com a font d'informes. La diferència:
- Recomanar per consumir ("mira aquest vídeo de 30 minuts") = rebutjat. Contradiu la proposta de valor
- Processar com a informe ("hem extret els 8 blocs d'aquesta presentació") = acceptat. Manté la proposta de valor

**Decisions operatives**:
- ❌ Secció regular "Vídeos recomanats" a la newsletter — rebutjat
- ❌ Bloc de vídeos a la web — rebutjat
- ❌ Recomanar vídeos corporatius — mai (risc greenwashing)
- ✅ Processar vídeos llargs institucionals com a informes — acceptat
- ✅ "Vídeo de la quinzena" a newsletter (màx 1, auditat) — previst per 2027
- ✅ Recomanar vídeos institucionals (UE, IPCC, WEF) — acceptat
- ⏳ Crear contingut propi en vídeo (webinars) — Phase Ultra 2027

**Rao**:
- Recomanar vídeos contradiu la proposta de valor ("5 minuts per criteri clar"). Demana més temps a l'usuari, no menys
- YouTube està ple de greenwashing corporatiu. Recomanar sense auditar seria difondre'l
- El cost de curació d'una secció regular és alt (30-60 minuts per vídeo) i el valor afegit baix (l'usuari ja pot buscar vídeos ell mateix)
- Competidors (Bloomberg Green, GreenBiz) ja tenen canals propis de vídeo. Competir-hi és competir en el seu camp, no en el nostre
- En canvi, processar vídeos institucionals com a informes és coherent amb el valor de Criteri: donar 5 minuts de lectura amb criteri clar i anàlisi crítica

**Alternatives considerades**:
- Secció regular de vídeos recomanats → descartat per contradicció amb proposta de valor
- Bloc de vídeos a la web → descartat pels mateixos motius
- Substituir el text per vídeo com a format principal → descartat perquè perd el valor analític estructurat dels 8 blocs
- "Vídeo de la quinzena" des del llançament → descartat per càrrega editorial addicional abans del llançament; previst per 2027

**Consideració ètica (Kantiana i del Bé Comú)**:
- **Kant**: tractar els vídeos com a eina de retenció d'usuari sense valor afegit seria instrumentalitzar-los. Si recomanem un vídeo, ha de ser perquè realment aporta valor — no per omplir la newsletter
- **Bé comú**: el bé comú es serveix amb contingut que millora la presa de decisions ESG. Un vídeo institucional rellevant sí; un vídeo corporatiu de greenwashing no
- **Risc principal**: difondre greenwashing per omisió d'auditoria. Si recomanem sense auditar, som còmplices del relat corporatiu

**Impacte**:
- Documentat a `02-PRODUCTE.md` secció "Política de contingut audiovisual"
- Sense impacte en codi web (de moment)
- Quan s'activi el processat de vídeos, caldrà integrar Whisper o servei similar de transcripció
- El Semàfor Metodològic haurà d'adaptar-se al format vídeo (indicadors lleugerament diferents)

**Estat**: Activa

---

## 5 juliol 2026 — Arquitectura d'automatització (DESCARTADA 24 juliol 2026)

> **Nota**: Aquesta decisió va ser **substituïda el 24 juliol 2026** per la decisió "Flux de creació d'informes: GLM + Gemini + Paolo (7 passos)". Veure més avall.

**Decisió original (descartada)**: S'integraria l'API de Z.ai-bot al backend des del llançament amb crawler Vercel Cron + Supabase com a CMS + LanguageTool per a correcció ortogràfica.

**Raó del descart**: l'arquitectura suposava vendor lock-in massa rígid amb Supabase com a CMS i LanguageTool com a únic corrector. El nou flux (24 juliol 2026) reparteix responsabilitats entre GLM i Gemini, i deixa Google Drive com a magatzem auditable de cada pas intermedi.

---

## 24 juliol 2026 — Flux de creació d'informes: GLM + Gemini + Paolo (7 passos)

**Decisió**: El flux de creació d'informes és un pipeline de 7 passos amb tres actors — GLM (Z.ai-bot), Gemini (Google) i Paolo. Cada pas escriu el seu output a una carpeta pròpia de Google Drive.

**Els 7 passos**:

1. **GLM detecta** informes nous a les fonts i els posa a `Drive /informes/0-originals/`
2. **GLM destil·la** la informació dels 8 apartats (segons METODOLOGIA.md) → `/informes/1-distilats/`
3. **Gemini revisa** l'informe original + el destil·lat de GLM, fa propostes de valor per afegir o modificar i fa d'advocat del diable → `/informes/2-aportacions-gemini/`
4. **GLM redacta** l'informe final, decidint què és rellevant de les aportacions de Gemini i què no → `/informes/3-fets/`
5. **Gemini revisa** ortogràficament l'informe (català i castellà) i canvia el que calgui → `/informes/4-revisats-ortografia/`
6. **Paolo llegeix** els informes creats i els valida → `/informes/5-validats-paolo/`
7. **GLM puja** els informes validats a la web → `/informes/6-publicats/`

**Principis**:
- Cap informe publicat sense validació humana (pas 6).
- Gemini té dos rols diferenciats: **crític** (pas 3, abans de la redacció) i **corrector** (pas 5, després).
- Cada pas té una carpeta pròpia a Drive per auditar qualsevol pas intermedi.
- GLM mai publica sense que Paolo hagi aprovat.

**Pendents d'implementació** (veure `TASQUES.md` P4):
- Paolo: crear API key de Gemini a Google AI Studio → variable d'entorn `GEMINI_API_KEY`
- GLM: scripts Python per a cada pas
- GLM: estructura de carpetes a Google Drive

**Substitueix**: la decisió del 5 juliol 2026 (crawler Vercel Cron + Supabase CMS + LanguageTool).

**Estat**: Activa

---

## 5 juliol 2026 — Estratègia de preus nova: pagament anual + early bird a 290€/any

**Decisió**: Canvi estratègic en el model de preus Premium:

1. **Preu base Premium**: 39€/mes (mantingut)
2. **Pagament anual**: 468€/any (12 × 39€) — opció sempre disponible
3. **Early bird (50 places)**: **290€/any** (impostos inclosos) — equival a 24,17€/mes, descompte del 38% vs el pagament mensual
4. Al llançament (setembre 2026) **només es podrà comprar la subscripció anual**. No hi haurà opció mensual fins que s'assignin les 50 places early bird.

**Rao**:
- **Facturació**: les subscripcions anuals faciliten molt la facturació (una factura a l'any per client en lloc de 12). En Paolo gestiona la facturació manualment, així que reduir el volum és clau
- **Cash flow**: el pagament anticipat millora la tresoreria del projecte en la fase crítica post-llançament
- **Compromís**: el pagament anual incrementa la retenció (el subscriber està compromès 12 mesos)
- **Preu competitiu**: 290€/any = 24,17€/mes és molt competitiu vs Bloomberg Green (~50€/mes), Sustainalytics (~100€/mes)

**Càlculs**:
- Preu mensual: 39€ × 12 = 468€/any
- Early bird: 290€/any → 24,17€/mes
- Estalvi: 468 - 290 = 178€ (38% de descompte)
- Ingressos potencials amb 50 early birds: 50 × 290€ = 14.500€ (llançament)

**Alternatives considerades**:
- Pagament mensual només → descartat per facturació manual complexa
- Pagament trimestral → descartat, no aporta prou avantatge vs anual
- Pagament anual sense early bird → descartat, perdem el ganxo de marketing del llançament
- Pagament anual + mensual coexistint des del principi → descartat, dilueix la urgència de l'early bird

**Impacte**:
- Web: modal Preus actualitzat (Premium ara mostra 290€/any amb preu anterior ratllat 468€)
- Subtitle del Preus actualitzat per mencionar pagament anual
- Secció Early bird reescrita amb el descompte del 38% i la justificació de facturació
- CTA Premium: "Reservar plaça early bird"
- Documents `02-PRODUCTE.md` i `07-DECISIONS.md` actualitzats

**Estat**: Activa

---

## 5 juliol 2026 — Mètodes de pagament: Stripe + Fiare Banca Ètica des del dia 1

**Decisió**: S'oferiran dos mètodes de pagament des del llançament (setembre 2026), co-iguals:

1. **Stripe (targeta)** — tant per a subscripció mensual com anual. Mètode estàndard a internet, automatitzat.
2. **Fiare Banca Ètica (transferència bancària)** — només per a subscripció anual. L'usuari fa la transferència immediatament, puja el comprovant al formulari, i en clicar "Activar Premium" el seu compte Premium s'activa **immediatament** (com si pagués amb targeta, sense periode de cortesia).

**Rao**:
- **Coherència ètica**: si defensem Economia del Bé Comú i Banca Ètica al Qui som, no podem oferir només Stripe (corporació nord-americana amb comissió) des del principi. Posposar-ho seria instrumentalitzar la banca ètica com a reclam de màrqueting sense donar l'opció real — contradiria el principi kantiana que defensem
- **Auto-selecció de l'usuari**: qui tria Fiare sap què tria. Funciona com a filtre de valors, reforça identitat
- **Storytelling potent**: "el 100% dels teus diners dona suport a l'economia social i transformadora" és un argument fortíssim per al nostre públic natural (cooperatives, B Corps, economia social)
- **Activació immediata**: la lògica és "confiança + validació posterior". L'usuari puja el comprovant i el seu Premium s'activa a l'instant. En Paolo rep 2 notificacions (web + Fiare) i si hi ha problema (import incorrecte, no transferència, comprovant fals), entra a admin i reverteix a Free

**Flux complet Fiare (actualitzat 5 juliol 2026)**:

```
1.Usuari tria Fiare al Preus → va al formulari
2.Usuari omple formulari (nom, email, telèfon, empresa, NIF/CIF)
3.Usuari decideix:
   - Rebut simplificat (per defecte)
   - Factura completa (checkbox: afegeix raó social + adreça fiscal)
4.Usuari fa transferència ara mateix (IBAN Fiare + concepte únic)
5.Usuari puja comprovant (PDF/JPG/PNG, màx 5MB)
6.Usuari marca 2 checkboxes (confirmació transferència + termes)
7.Usuari clica "Activar Premium" → compte Premium actiu immediatament
8.En Paolo rep:
   - Email de la web: "Nou Premium Fiare creat: [usuari]"
   - Email de Fiare: "Has rebut una transferència de 290€"
9.Sistema genera document fiscal automàticament:
   - Rebut simplificat (si no va demanar factura)
   - Factura completa (si va demanar factura amb NIF/CIF)
10.Document enviat per email a l'usuari en qüestió de minuts
11.Si en Paolo detecta problema → admin → canvia status a Free
12.30 i 7 dies abans de caducar → email automàtic
13.Si no renova → status canvia a Free automàticament (cron)
```

**Diferenciació operativa** (actualitzada):
| | Stripe | Fiare |
|---|--------|-------|
| Disponibilitat | Mensual + Anual | Només Anual |
| Activació compte | Automàtica (webhook) | **Immediata** (en clicar botó, sense cortesia) |
| Comissió | Sí (Stripe es queda %) | No (100% va a Criteri) |
| Document fiscal | Automàtic (Stripe) | **Automàtic** (rebut o factura segons formulari) |
| Validació posterior | No necessària | Sí — en Paolo revisa les 2 notificacions |
| Renovació | Automàtica | Manual (cron envia avisos 30 + 7 dies; si no renova → Free automàtic) |

**Storytelling a la web** (al modal Preus):
> "Si pagues amb targeta (Stripe), una corporació nord-americana es queda una comissió del nostre treball i els diners circulen pel sistema financer especulatiu. Si tries la transferència anual al nostre compte de Fiare Banca Ètica, el 100% dels teus diners dona suport a l'economia social i transformadora."

**Consideració ètica (Kantiana i del Bé Comú)**:
- **Kant**: posposar la opció Fiare per "prudència operativa" hauria estat instrumentalitzar la banca ètica com a reclam sense oferir-la. La coherència exigeix oferir-la des del dia 1
- **Bé comú**: el bé comú es serveix amb coherència entre allò que es diu i allò que es fa. Defensar Banca Ètica al Qui som i no oferir-la com a mètode de pagament seria una contradicció ètica
- **Confiança**: el flux d'activació immediata confia en l'usuari. El risc d'abús (comprovant fals) és baix i controlable per en Paolo via admin. És èticament preferible a tractar tots els usuaris com a sospitosos amb un periode de cortesia

**Alternatives considerades**:
- Stripe només al llançament, Fiare a partir de gener 2027 → **descartat** per incoherència ètica
- Fiare amb periode de cortesia de 3 dies → **descartat** (5 juliol 2026): afegia complexitat innecessària, l'usuari havia d'esperar. Flux nou: activació immediata + validació posterior per en Paolo
- Fiare com a "preferida" (posicionar-la per sobre de Stripe) → descartat, volem co-igualtat, no coacció ètica
- Només Fiare (sense Stripe) → descartat, perdrem usuaris que volen comoditat de targeta
- Pagament trimestral via Fiare → descartat, complexitat afegida sense valor

**Impacte**:
- Web: secció "Mètodes de pagament" al modal Preus amb tots dos mètodes i nota transparent
- Web: formulari dedicat per al flux Fiare (mockup a `assets/web/public/fiare-form-mockup.html`)
- Operacions: en Paolo rep 2 notificacions per cada Premium Fiare (web + Fiare)
- Operacions: en Paolo valida ràpidament; si problema → reverteix a Free via admin
- Facturació: automàtica per la web (rebut o factura segons formulari)
- Finances: compte a Fiare Banca Ètica a obrir abans del llançament

**Pendents operatius**:
- Obrir compte a Fiare Banca Ètica (abans agost 2026)
- Substituir IBAN fals del mockup per IBAN real quan es tingui
- Configurar Stripe (compte + webhooks + facturació automàtica)
- Implementar formulari real (la Roser) amb Supabase Storage per comprovants
- Implementar mini dashboard admin per en Paolo (veure usuaris, canviar status)
- Implementar generació automàtica de rebuts i factures (veure proposta específica al `02-PRODUCTE.md`)
- Implementar cron d'avís 30 i 7 dies abans de caducar
- Implementar cron de caducitat automàtica

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
