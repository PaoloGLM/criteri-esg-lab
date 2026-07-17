# METODOLOGIA — Com processa Criteri ESG cada informe

> **Document intern.** Especifica exactament com es construeix cada bloc dels 8 que composen un informe Criteri ESG. Serveix perquè Paolo pugui auditar la riguresa del procés.
>
> **Data**: 17 juliol 2026
> **Basat en**: `02-PRODUCTE.md`, `CONTEXT.md`, i l'informe pilot real (`revisio-esrs-maig-2026`)

---

## Visió general del procés

```
Font institucional (PDF/web, 30-200 pàgines)
         ↓
    Detecció automàtica (agent IA, dilluns i dijous)
         ↓
    Curació humana (Paolo decideix si es processa)
         ↓
    Lectura completa + extracció de dades (agent IA)
         ↓
    Redacció dels 8 blocs (agent IA amb supervisió humana)
         ↓
    Validació editorial (Paolo revisa i corregeix)
         ↓
    Publicació a la web (tots els informes) + proposta per newsletter
```

---

## Bloc 0 — Semàfor Metodològic ⭐

### Què és

Una targeta visual amb 5 indicadors que avaluen la **qualitat metodològica** de l'informe original (no les seves conclusions). Permet al lector decidir en 10 segons si l'informe mereix ser llegit.

### Com es construeix (pas a pas)

1. **Llegir l'informe original complet** (no només l'executive summary)
2. **Per a cadascun dels 5 indicadors**, buscar evidència concreta al text:

| # | Indicador | Què buscar al text | 🟢 Verd | 🟡 Groc | 🔴 Vermell |
|---|-----------|-------------------|---------|---------|------------|
| 1 | **Cobertura Scope 3** | Es menciona Scope 3? Hi ha dades quantificades (tones CO2e) per categories upstream/downstream? | Quantificat amb dades per categoria | Esmentat però no quantificat o només global | Ignorat — no es menciona Scope 3 |
| 2 | **Termes temporals** | Hi ha anys concrets de compliment? Estan alineats amb SBTi (Science-Based Targets)? | Anys concrets + alineació SBTi verificada | Decennis genèrics ("by 2050") sense SBTi | Només "compromís futur" sense data |
| 3 | **Fonts independents** | L'informe cita fonts externes (acadèmiques, ONG, auditors)? O només s'autocita? | Auditor extern verificat o cites acadèmiques peer-reviewed | Alguna cita externa però majoria pròpia | Només autocitacions o dades internes |
| 4 | **Granularitat de dades** | Les dades estan desglossades per segment, instal·lació, país? O només agregat global? | Desglossat per segment/instal·lació/centre operatiu | Desglossat per regió o país | Només agregat global |
| 5 | **Verificació externa** | Hi ha third-party assurance? Qui? | Third-party auditada (Big 4, auditor independent) | Second-party (consultoria contractada) o assurance limitat | Self-declared sense verificació |

3. **Per a cada indicador**, escriure una justificació breu (màx. 15 paraules) que expliqui per què té aquest color. Aquesta justificació és visible a la web (clic a l'indicador).

4. **Calcular la nota global** segons el nombre de verds:

| Verds | Lletra | Etiqueta | Significat |
|-------|--------|----------|------------|
| 5 | A | Rigorós | Informe fiable per a presa de decisions |
| 3-4 | B | Acceptable amb matisos | Útil, però cal complementar amb altres fonts |
| 1-2 | C | Feble metodològicament | Conclusions a prendre amb precaució |
| 0 | D | Materialitat qüestionable | No utilitzar com a font única |

### Regles de riguresa

- **No és una nota moral**: avalua metodologia, no contingut polític. Un informe pot ser "A" metodològicament i políticament discutible.
- **Cal evidència**: cada color ha de tenir una cita o dada concreta de l'informe que el justifiqui. No es posa verd/groc/vermell per impressió.
- **Si no es troba la informació**: és vermell (no groc). El groc és per quan es menciona però no es quantifica.
- **Excepció**: si l'informe no tracta de clima (ex: un informe de drets humans), l'indicador 1 (Scope 3) es marca com a "N/A" i no compta per a la nota.

### Exemple real (Revisió ESRS maig 2026)

| Indicador | Color | Justificació |
|-----------|-------|--------------|
| Scope 3 | 🟡 Groc | Es manté l'obligació però es simplifica la granularitat de categories |
| Termes temporals | 🟡 Groc | Aplicació per fases, però sense comparabilitat retroactiva garantida |
| Fonts independents | 🟢 Verd | Comissió Europea amb auditories d'impacte i consultes públiques |
| Granularitat | 🔴 Vermell | La reducció del 61% de datapoints elimina granularitat sectorial |
| Verificació externa | 🟡 Groc | Es manté assurance limitat; no es passa a assurance raonable |

**Nota global**: C (1 verd) — Feble metodològicament

---

## Bloc 1 — Fitxa tècnica

### Què és

Dades bàsiques de l'informe en 60-80 paraules.

### Com es construeix

Extreure directament de la portada/contraportada de l'informe original:

| Camp | D'on ve |
|------|---------|
| Institució | Portada o peu de pàgina |
| Data | Portada o data de publicació al web |
| Tipus | Classificació pròpia: Regulador, Framework, Rating, Industry, Oficial |
| Pàgines | Comptar les pàgines del PDF o indicar "N/A" si és web |
| Àmbit | CAT, ES, EU, GLOBAL |
| URL | URL directa al document original |

### Regla de riguresa

- La URL ha de portar al document original, no a una pàgina intermèdia
- Si l'informe no és específicament ESG (ex: Banc d'Espanya Estabilitat Financera), el bloc 3 (resum) ha d'indicar-ho: "Aquest informe no és específicament ESG, però conté elements rellevants"

---

## Bloc 2 — Cinc dades clau

### Què és

5 punts quantitatius amb valor, context i pàgina citada.

### Com es construeix

1. **Llegir l'informe buscant nombres**: percentatges, milions d'euros, tones, anys, número d'empreses afectades, ratis
2. **Filtrar per rellevància**: seleccionar les 5 dades que més impacten a un director de sostenibilitat espanyol
3. **Per a cada dada**, proporcionar:
   - **Valor**: el número amb unitat (ex: "61%", "3.700M€", "2027")
   - **Context**: 1-2 frases que expliquin què significa aquest número (ex: "reducció de datapoints obligatoris del CSRD")
   - **Pàgina**: citació exacta a la pàgina de l'informe original (ex: "p. 12")

### Regles de riguresa

- **Màxim 5**: si n'hi ha més de 5 rellevants, triar les 5 més accionables
- **Mínim 3**: si l'informe té menys de 3 dades quantitatives rellevants, és un senyal que potser no mereix ser processat
- **Cita obligatòria**: cada dada ha de tenir pàgina citada. Si no es troba la pàgina, no s'inclou la dada
- **No inventar**: si l'informe diu "aproximadadament 60%", posar "aprox. 60%", no "61%"
- **Context obligatori**: una dada sense context no serveix. "61%" sol no vol dir res

### Exemple real

| Valor | Context | Pàgina |
|-------|---------|--------|
| 61% | reducció de datapoints obligatoris | p. 12 |
| 3.700M€ | estalvi estimat en 5 anys per a les empreses | p. 8 |
| 1.144 | datapoints eliminats del total original | p. 14 |
| 2027 | any d'aplicació per a les primeres empreses afectades | p. 21 |
| 5 anys | període de transició addicional per a pimes | p. 27 |

---

## Bloc 3 — Resum executiu

### Què és

Què diu l'informe en llenguatge planer, en 300 paraules.

### Com es construeix

1. **Llegir l'executive summary de l'informe original** (si en té)
2. **Llegir les conclusions i recomanacions**
3. **Redactar en llenguatge planer**: sense jerga tècnica innecessària, sense acrònims sense explicar
4. **Estructura**:
   - Frase 1-2: què és l'informe i què proposa
   - Frases 3-5: dades clau amb context (sense repetir el bloc 2)
   - Frases 6-8: què canvia per a les empreses
   - Frases 9-10: cronologia i pròxims passos

### Regles de riguresa

- **300 paraules ±10%**: entre 270 i 330 paraules
- **No copiar**: no copiar l'executive summary de l'original. Sintetitzar amb paraules pròpies
- **No opinar**: el resum executa és neutre. L'opinió va al bloc 4 (implicacions) i al "Més enllà del Checkbox"
- **Bilingüe**: versió en català i castellà, no traducció literal sinó adaptació natural

---

## Bloc 4 — Implicacions + "Més enllà del Checkbox"

### Què és

Anàlisi de l'impacte per a tres actors (empreses, reguladors, ciutadans) + secció editorial ètica.

### Com es construeix — Implicacions (450-540 paraules)

Per a cadascun dels 3 actors, respondre:

**Empreses** (150-180 paraules):
- Què canvia per a les empreses espanyoles?
- Quines han de fer acció immediata?
- Quin és el cost/benefici econòmic?
- Hi ha guanyadors i perdedors per sector?

**Reguladors** (150-180 paraules):
- Com afecta a la CNMV, ESMA, OECC?
- Guanya o perd capacitat de supervisió?
- Hi ha conflictes amb altres regulacions?

**Ciutadans** (150-180 paraules):
- Com afecta a la societat civil?
- Més o menys transparència?
- Impacte en consumidors, treballadors, comunitats?

### Com es construeix — "Més enllà del Checkbox" (100-150 paraules)

1. **Triar 1-2 criteris** dels 5 disponibles (segons què sigui més rellevant per aquest informe concret):

| # | Criteri | Pregunta clau |
|---|---------|---------------|
| 1 | Dignitat humana | L'informe mesura condicions de vida digna o només compliance laboral mínima? |
| 2 | Justícia distributiva | Es mesura com es reparteix la riquesa o només rendibilitat per accionista? |
| 3 | Sostenibilitat absoluta | Es mesura impacte vs límits planetaris o només intensitats relatives? |
| 4 | Co-decisió democràtica | Hi ha participació real dels stakeholders o només compliance? |
| 5 | Arrelament territorial | Es mesura impacte al territori o només xifres globals? |

2. **Redactar 100-150 paraules** aplicant aquesta lent a l'informe concret:
   - Què mesura l'informe
   - Què omet
   - Per què això importa

### Regles de riguresa

- **No es repeteix el mateix criteri en dos informes consecutius**
- **To editorial, no acusatori**: es qüestiona el marc, no l'empresa o institució
- **No s'esmenten mai els marcs teòrics interns** (Economia del Bé Comú, Economia Ciutadana). La veu és de Criteri
- **L'elecció de criteris és humana**: l'IA proposa, Paolo decideix
- **Si l'informe no és ESG**: el bloc 4 se centra només en la part ESG

### Exemple real ("Més enllà del Checkbox" — Revisió ESRS)

> **Criteri avaluat: Justícia distributiva + Sostenibilitat absoluta**
>
> La simplificació es presenta com a neutra, però distribueix els beneficis i els costos de manera asimètrica. Les grans corporacions amb capacitat de lobbying han guanyat alleugeriment; les comunitats afectades pels seus impactes perden informació verificable per exercir drets. Alhora, eliminar granularitat sectorial converteix la sostenibilitat en variable relativa —"millor que l'any passat"— en lloc d'absoluta —"compatible amb els límits planetaris". Sense referents absoluts, el reporting esdevé exercici de millora contínua sense sostre, insuficient per aturar la deterioració ecològica real que pateixen territoris concrets.

---

## Bloc 5 — Connexions

### Què és

Relacions de l'informe amb altres informes publicats i amb l'actualitat (200-250 paraules).

### Com es construeix

1. **Identificar relacions** buscant a la biblioteca de Criteri ESG i a l'actualitat:
   - **Evolució**: aquest informe és continuació o actualització d'un anterior?
   - **Complement**: aquest informe es complementa amb un altre (junts donen visió completa)?
   - **Contradicció**: aquest informe diu el contrari que un altre?
2. **Per a cada connexió**, escriure:
   - Tipus (Evolució / Complement / Contradicció)
   - Títol de l'informe connectat
   - Descripció de la connexió (2-3 frases)

### Regles de riguresa

- **Mínim 2 connexions, màxim 4**: si no hi ha cap connexió amb altres informes, l'informe potser no mereix ser processat
- **La connexió ha de ser substancial**: no "parlen del mateix tema" sinó "l'un afecta directament l'altre"
- **Tipus obligatori**: cada connexió ha de tenir un tipus identificat

---

## Bloc 6 — Accions recomanades ⭐

### Què és

3-5 accions concretes que un director de sostenibilitat pot prendre. És el cor operatiu de Criteri.

### Com es construeix

1. **Identificar punts d'acció** a l'informe original:
   - Recomanacions explícites de l'informe
   - Canvis reguladors que requereixen adaptació
   - Riscos materials que es poden anticipar
   - Oportunitats estratègiques
2. **Convertir en accions concretas** (no genèriques):
   - ❌ "Millorar el reporting ESG" (massa genèric)
   - ✅ "Auditar la matriu de materialitat vigent per identificar quins datapoints eliminats eren materials per al vostre sector"
3. **Per a cada acció**, proporcionar:
   - **Número** (01, 02, 03...)
   - **Títol** (màx. 8 paraules, accionable)
   - **Descripció** (2-3 frases que expliquin què fer, com i per què)
   - **Esforç** (Baix / Mitjà / Alt)
   - **Impacte** (Baix / Mitjà / Alt)

### Regles de riguresa

- **Mínim 3, màxim 5 accions**: si n'hi ha més de 5, prioritzar per impacte
- **Accionables**: cada acció ha de poder fer-se en 30 dies
- **Específiques**: han de ser aplicables a empreses espanyoles, no genèriques globals
- **Esforç vs impacte**: indicar ambdues dimensions perquè l'usuari pugui prioritzar
- **No copiar de l'informe**: si l'informe recomana algo, adaptar-ho al context espanyol

### Exemple real

| # | Títol | Esforç | Impacte |
|---|-------|--------|---------|
| 01 | Auditar la matriu de materialitat vigent | Baix | Mitjà |
| 02 | Renegociar el contracte d'assurance extern | Mitjà | Alt |
| 03 | Construir un dataset voluntari intern | Mitjà | Mitjà |
| 04 | Formar el comitè d'auditoria en doble materialitat reduïda | Baix | Baix |

---

## Bloc 7 — Cross-reference amb certificacions ⭐

### Què és

Mapatge de l'informe amb els 4 frameworks/certificacions principals: EcoVadis, B Corp, MSCI ESG i GRI.

### Com es construeix

Per a cadascun dels 4 frameworks, respondre:

1. **L'informe afecta aquest framework?** Sí/No
2. **Si sí, com?** Escriure 1-2 frases que expliquin:
   - Quin criteri o indicador del framework es veu afectat
   - En quina direcció (facilita, complica, és neutral)
3. **Impacte**: Alt / Mitjà / Baix segons:
   - **Alt**: canvia directament un requeriment del framework o el score
   - **Mitjà**: afecta indirectament o canvia context però no requeriment
   - **Baix**: relació marginal o de llarg termini

### Taula de referència ràpida

| Framework | Què buscar | Impacte Alt | Impacte Mitjà | Impacte Baix |
|-----------|-----------|-------------|---------------|--------------|
| **EcoVadis** | Score de Environment, Labor & Human Rights, Ethics, Sustainable Procurement | Canvia un criteri de puntuació directament | Canvia context però no puntuació | Relació marginal |
| **B Corp** | B Impact Assessment: Governance, Workers, Community, Environment, Customers | Canvia un requeriment de la certificació | Facilita o dificulta el procés | Relació marginal |
| **MSCI ESG** | Rating AAA-CCC: data coverage, controversy screening, exposure | Canvia metodologia de rating o data coverage | Canvia context de risc | Relació marginal |
| **GRI** | Universal Standards, Topic Standards, Sector Standards | Canvia interoperabilitat o requeriment de reporting | Canvia context però no requeriment | Relació marginal |

### Regles de riguresa

- **Els 4 frameworks sempre apareixen**: si l'informe no afecta un framework, es posa "Sense impacte directe" amb impacte "Baix"
- **Criteri específic**: no "afecta EcoVadis" sinó "Score de Environment i Sustainable Procurement"
- **Direcció clara**: indicar si facilita o complica
- **No especular**: si no hi ha evidència clara d'impacte, és "Baix"

### Exemple real

| Framework | Criteri afectat | Impacte |
|-----------|----------------|---------|
| GRI | Universal Standards 2021 (compatibilitat declarada) | Alt |
| EcoVadis | Score de Environment i Sustainable Procurement | Mitjà |
| MSCI ESG | Data coverage i controversy screening | Mitjà |
| B Corp | Standards V2.1 — convergència parcial en indicadors | Baix |

---

## Procés de validació humana (Paolo)

Després que l'agent IA generi els 8 blocs:

1. **Paolo rep l'informe complet** (8 blocs en català i castellà)
2. **Revisa cada bloc** verificant:
   - Semàfor: els colors estan justificats amb evidència?
   - Dades clau: les xifres són correctes i les pàgines citades existeixen?
   - Resum: és fidel a l'original sense copiar?
   - Implicacions: són pertinents per al context espanyol?
   - Més enllà del Checkbox: la tria de criteris és coherent?
   - Connexions: les relacions identificades són reals?
   - Accions: són accionables i específiques?
   - Cross-reference: els impactes estan ben calibrats?
3. **Corregeix o demana canvis** a l'agent IA
4. **Aprova** → l'informe es publica a la web
5. **Selecciona per newsletter**: decideix si l'informe va a la propera newsletter (màx. 4 per newsletter)

### Regla fonamental

**Tots els informes detectats es publiquen a la web. Tots tenen els 8 blocs. No tots van a la newsletter. Només Paolo selecciona els que hi van, i Paolo és qui determina si els informes creats per l'agent IA estan bé. Aquesta és la part humana principal del procés.**

---

## Corrector ortogràfic obligatori

Abans de publicar, tots els textos en català i castellà passen pel corrector LanguageTool:

```bash
python3 /home/z/my-project/scripts/corrector.py <fitxer> [ca|es]
```

Si hi ha errors manuals pendents, l'informe no es publica fins que es revisen.

---

## Annex — Estructura de pàgines del PDF

| Pàgina | Contingut |
|--------|-----------|
| 1 | Títol + missatge clau + Bloc 0 (Semàfor) + Bloc 1 (Fitxa tècnica) + Bloc 2 (5 dades clau) |
| 2 | Bloc 3 (Resum executiu) + Bloc 4 (Implicacions + Més enllà del Checkbox) |
| 3 | Bloc 5 (Connexions) + Bloc 6 (Accions recomanades) |
| 4 | Bloc 7 (Cross-reference) + disclaimer |

- Sense subtítol a la portada
- Marge uniforme de 18mm
- Cap bloc tallat entre pàgines
