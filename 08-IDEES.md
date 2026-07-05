# 08 — Idees pendents

> Parking d'idees per validar. No són decisions, són pensaments en brut que caldrà analitzar.

## Idees validades pendents de desenvolupament

### Newsletter en versió podcast
Convertir la newsletter setmanal en un podcast automàtic (5-10 minuts) pels subscriptors que prefereixen escoltar en lloc de llegir.
- **Eina**: NotebookLM (com els podcasts d'informe)
- **Prioritat**: Baixa (any 2)
- **Objectiu**: Diferenciar canal d'adquisició

### WhatsApp bot per a alertes crítiques
Per als subscriptors Premium/Ultra: quan surti un informe crític per al seu sector, reben un missatge de WhatsApp automàtic amb el resum + link al detall.
- **Eina**: WhatsApp Business API
- **Prioritat**: Mitja (validar quan tinguem 100 subs Premium)
- **Risc**: Spam percebut — cal opt-in molt clar

### Programa de referències
Subscriptors Premium que portin 3 amics reben 1 mes gratis. Subscriptors Ultra que portin 1 client B2B reben 3 mesos gratis.
- **Prioritat**: Mitja (llançar quan tinguem 50 subs Premium)
- **Objectiu**: CAC baix via boca-orella

### Ambassador program amb consultories
5-10 consultories ESG petites que es converteixin en "ambaixadores" de Criteri: recomanen el producte als seus clients, reben 20% de comissió recurrent.
- **Prioritat**: Alta (any 1, quan tinguem 5 informes pilot sòlids)
- **Objectiu**: Canal B2B2C escalable

### Criteri Academy
Plataforma de formació ESG amb cursos curts (4-8h) sobre temes específics: "CSRD per a no-experts", "Com preparar EcoVadis Or", "B Corp des de zero".
- **Preu**: 50-200€ per curs
- **Prioritat**: Baixa (any 2)
- **Objectiu**: Diversificació d'ingressos + adquisició

### Comparativa sectorial
Eina que et permet veure com estàs vs els teus 5 competidors en EcoVadis/MSCI/GRI. Dades públiques + scrapeig.
- **Preu**: Inclòs en Ultra o 99€/informe
- **Prioritat**: Mitja (any 2)
- **Risc**: Dades públiques sovint incompletes

### API pública per a integracions
Perquè consultories i grans empreses puguin integrar Criteri ESG als seus propis sistemes (PowerBI, Tableau, Notion, etc.).
- **Preu**: 199-499€/mes per empresa
- **Prioritat**: Baixa (any 2-3)
- **Objectiu**: B2B enterprise

### Mercat anglès (UK) i francès
Expansió a UK i França amb traduccions a anglès i francès.
- **Prioritat**: Baixa (any 2-3)
- **Objectiu**: Validar mercat abans d'inversió

---

## Idees en discussió (sense validar)

### EsgBlog — contingut SEO
Crear un blog amb articles SEO sobre temes ESG (ex: "Què és la CSRD", "Com pujar EcoVadis") per atreure tràfic orgànic cap a la web.
- **Pros**: Tràfic qualificat gratuït, autoritat
- **Contres**: Temps editorial, competència alta (Anthesis, Forética)

### Newsletter diària vs setmanal
Actualment newsletter és setmanal (diumenge vespre). Alternativa: diària (5 minuts cada dia).
- **Pros**: Més touchpoints, més hàbit
- **Contres**: Fatiga de l'usuari, més producció

### Newsletter en anglès
Afegir versió anglesa de la newsletter per mercat internacional.
- **Pros**: Amplia audiència
- **Contres**: Duplica producció, competència més forta

### Plugin Notion
Permitir que els usuaris exportin informes directament al seu Notion amb format estructurat.
- **Pros**: Integració en workflow existent
- **Contres**: Complexitat tècnica, audiència limitada

### Servei de "due diligence express"
Per a inversors PE/VC: informe ràpid (48h) sobre una empresa específica abans d'inversió.
- **Preu**: 499-999€ per informe
- **Pros**: Alt marge, públic diferent
- **Contres**: Possible competència amb due diligence firms

### Patró LLM Wiki (Karpathy) — fase 2 per octubre/novembre 2026
Implementar la fase completa del patró LLM Wiki descrit per Andrej Karpathy (https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). La fase 1 (log.md + index.md) ja està implementada el juliol 2026; aquesta és la fase 2 que cal revisar al octubre/novembre.

**Què inclouria**:
- Wiki de connexions automatitzada (bloc 5): cada nou informe actualitza connexions amb tots els ja processats
- Wiki de certificacions vives (bloc 7 enriquit): pàgines per EcoVadis, B Corp, MSCI, GRI, SGE 21, CSRD, SFDR, TCFD
- Lint mensual: detectar contradiccions, claims desactualitzats, orphans, pàgines pendents
- Operacions: Ingest (processar + actualitzar wiki), Query (pregunta + resposta arxivable), Lint (health-check)

**Quan revisar-ho**: octubre o novembre 2026, quan la biblioteca arribi a 20+ informes processats. La decisió estratègica ja està registrada a `07-DECISIONS.md` (5 juliol 2026).

**Pros**:
- Escalabilitat del bloc 5 (Connexions) — dóna valor sense cost editorial marginal
- Escalabilitat del bloc 7 (Cross-reference) — enriqueix automàticament
- Detecció de contradiccions entre informes (valor únic vs competidors)
- Lint mensual manté la qualitat del sistema

**Contres**:
- Complexitat addicional al sistema
- Risc de desvincular la wiki del codi de la web (caldrà que la wiki sigui font de veritat)
- Cal ser honest amb l'usuari sobre què és automàtic vs humà (transparència ètica)

- **Prioritat**: Mitja (depèn de com evolucioni la biblioteca post-llançament)
- **Objectiu**: Escalabilitat del bloc 5 i 7 a 50+ informes sense augment de cost editorial
- **Riscos**: Doble font de veritat (wiki vs reports.ts), pèrdua de qualitat si la generació automàtica no es valida
- **Estimació esforç**: 2-3 setmanes de desenvolupament (Rosier + Z.ai-bot)

---

## Idees descartades (registre)

### Web3/blockchain per verificació d'informes
Verificar autenticitat dels informes via blockchain.
- **Raó descart**: Massa complexitat per valor afegit mínim en aquesta fase

### App mòbil nativa
App iOS/Android per llegir informes.
- **Raó descart**: Web responsive suficient, cost de desenvolupament doble

### Xarxa social pròpia
Crear una xarxa social per a professionals ESG.
- **Raó descart**: Fora de focus, competència impossible amb LinkedIn

---

## Com afegir una idea nova

```markdown
### [Títol de la idea]
[Descripció breu]
- **Prioritat**: Alta | Mitja | Baixa
- **Objectiu**: 
- **Riscos**: 
- **Estimació esforç**: 
```
