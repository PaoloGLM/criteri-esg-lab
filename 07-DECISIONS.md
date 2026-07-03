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
- Dona temps al nou membre de l'equip per incorporar-se

**Detalls per mes**:
- Juliol: 5 setmanes de treball intensiu en dissenys, informes pilot, comptes, registres
- Agost: 4 setmanes de proves amb 10-20 beta testers + iteració
- Setembre: deploy a producció + estratègia de captació inicial

**Impacte**: 
- Roadmap (secció 05) completament reescrit amb aquest calendari
- 15 issues existents al GitHub Project revisats i reassignats

**Estat**: Activa

---

## 29 juny 2026 — Incorporació nou membre equip

**Decisió**: Una nova persona s'incorpora a l'equip amb rol de Tech Lead (disseny + programació + BD)

**Rao**: 
- Paolo no pot fer-ho tot sol
- Necessitem expertesa tècnica especialitzada per al llançament
- El nou membre té domini en disseny, programació web i bases de dades

**Repartiment de rols**:
- **Paolo** (CEO/Estratègia): decisions estratègiques, relacions externes, enviaments newsletter, gestió de marca
- **Nou membre** (Tech Lead): disseny web, programació, base de dades, integracions tècniques
- **Z.ai-bot** (assistent tècnic): generació de continguts, recerques, documentació al GitHub

**Comunicació amb Z.ai-bot**:
- Paolo parla amb Z.ai-bot a través del seu xat
- Nou membre obre el seu propi xat amb Z.ai-bot (Opció A, recomanada)
- GitHub és el "cervell compartit" — totes les decisions hi queden registrades
- Per decisions estratègiques, Paolo i nou membre parlen primer, després Paolo consulta a Z.ai-bot

**Accessos**:
- Nou membre té accés al repositori GitHub (lectura i escriptura)
- Nou membre tindrà accés a Vercel, Supabase, Beehiiv quan es creïn els comptes
- Tokens i credencials NO es comparteixen al xat ni al GitHub

**Impacte**: 
- Roadmap (secció 05) actualitzat amb repartiment de responsabilitats
- Sistema de tasques (secció 11) manté @PaoloGLM com a persona per a tasques operatives, però el nou membre es farà càrrec de les tècniques
- 15 issues existents al GitHub Project es reassignen: Paolo → operatives, nou membre → tècniques

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

## Plantilla per a futures decisions

```markdown
### [DATA] — [Decisió breu]

**Decisió**: 
**Rao**: 
**Alternatives considerades**: 
**Impacte**: 
**Estat**: Activa | Superseded per [DATA]
```
