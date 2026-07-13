# 12 — Plantejament legal i fiscal (CAT/ES)

> **Data:** 27 juny 2026
> **Autor:** Criteri ESG (amb recerca de Z.ai)
> **Fonts:** Totes verificades (URLs al final del document)
> **Cobertura:** Marc legal català i espanyol per a Criteri ESG
> **IMPORTANT:** Aquest document és una guia operativa, NO assessorament legal. Per decisions definitives, consulta un gestor/advocat.

---

## Sumari executiu

**Recomanació estratègica:** Començar com a **autònom** (ja ho ets), validar el producte amb primers ingressos, i **constituir SL quan la facturació anual arribi a ~30.000€** o quan vulguis incorporar una sòcia. Mentrestant, tota la facturació entra per l'alta d'autònom actual.

**Costos any 1 (fase autònom):** ~1.500-2.500€
**Costos any 2 (amb SL):** ~3.500-5.000€ addicional per constitució + ~2.400€/any de gestoria

---

## 1. Situació actual i principis generals

### 1.1 El teu punt de partida
- Ja ets **autònom** donat d'alta a RETA
- Tens una activitat professional donada d'alta a l'AEAT
- Vols començar a generar ingressos amb Criteri ESG progressivament

### 1.2 Principis legals clau a Espanya

1. **Pots tenir múltiples activitats sota una sola alta d'autònom** — no cal donar-te d'alta nova per Criteri ESG si la teva alta actual cobreix serveis professionals. Cal només **modificar l'alta a l'IAE** per afegir l'epígraf correcte.

2. **L'IVA és del 21% per a serveis digitals** (no 10%). Excepcions: formació (que pot ser 4% o exempta segons casos).

3. **L'IRPF per a autònom** tributa per trams (escala estatal + autonòmica Catalunya). Els primers 12.450€ tributen al 19%, després puja progressivament fins al 47% per sobre de 300.000€.

4. **La quota d'autònom (RETA) des de 2023 és per trams** segons rendiment net previst. El 2026: base mínima 1.424€/mes → quota ~294€/mes si no preveus ingressos alts; fins a ~607€/mes si preveus rendiments elevats.

---

## 2. Fase 1: Començar a ingressar diners (mes 1-3)

### 2.1 Modifica la teva alta d'autònom

**Què has de fer:**
1. Presenta **model 036/037** a l'AEAT per modificar l'alta a l'IAE
2. Afegeix l'epígraf professional corresponent:
   - **Epígraf 849.1** (serveis empresarials no classificats) — vàlid per a serveis digitals
   - **Epígraf 861.2** (serveis de programació i informàtica) — si vols enfocar-ho així
3. Comunica que la teva activitat inclourà: serveis d'informació ESG, newsletter, accessos a plataforma, formació

**Cost:** 0€ (presentació telemàtica gratuïta a l'AEAT)

**Font:** https://sede.agenciatributaria.gob.es — Modelos 036/037

### 2.2 Obre un compte bancari separat

**Per què:** Encara que no sigui obligatori legalment sent autònom, és molt recomanable separar el compte personal del professional. Facilita enormement la comptabilitat i demostra "capacitat professional" davant Hisenda.

**Què fer:**
- Obre un compte corrent nominal en qualsevol banc (pot ser online com N26, BBVA, Bankinter)
- Nomen-lo "Criteri ESG - compte operatiu"
- Adreça-hi totes les cobraments i pagaments relacionats amb el negoci

**Cost:** 0-10€/mes segons banc

### 2.3 Configura un sistema de cobrament online

**Opció recomanada: Stripe**

**Per què Stripe:**
- Pensa en subscripcions i pagament únic
- Suporta IVA espanyol automàticament (Stripe Tax)
- Permet cobrar en EUR, USD, GBP, etc.
- Tarifes: 1.5% + 0.25€ per transacció europea (més competitiu que PayPal)

**Cost inicial:** 0€ (només es paga per transacció)
**Cost Stripe Tax:** 0.5% addicional per transacció (gestiona IVA automàticament)

**Configuració bàsica:**
1. Crea compte a https://stripe.com/es
2. Verifica identitat (NIF + compte bancari)
3. Configura productes: "Criteri Premium" (39€/mes), "Criteri Ultra" (89€/mes)
4. Activa Stripe Tax per a Espanya
5. Integra a la web via API

**Font:** https://stripe.com/resources/more/sell-services-online-spain

### 2.4 Emets factures

**Què ha de contenir cada factura:**
- Número correlatiu i data
- NIF teu i del client
- Dades fiscal i domicili d'ambdós
- Descripció del servei
- Base imponible + IVA (21%) + total
- Si el client és d'un altre país UE: NIF-IVA vàlid i factura sense IVA (inversió del subjecte passiu)
- Si és fora UE: factura sense IVA

**Eina recomanada:** Holded, Anfix, o Quipu (10-30€/mes). Gratuït primer any amb Anfix per a autònoms nous.

### 2.5 Quan comences a pagar IVA i IRPF

- **IVA**: Trimestralment. Model 303. Si has cobrat més IVA del que has pagat, ingresses la diferència. Si has pagat més, et retornen.
- **IRPF (retenció)**: Els clients et retenen un 15% (7% si és primer any amb rendiments inferiors a 15.000€) i l'ingressen a Hisenda per tu. Tu anualment presentes model 130 (pagament a compte).

---

## 3. Fase 2: Creixement (mes 4-12)

### 3.1 Quan constituir SL — els 4 triggers

Constitueix una SL quan es compleixi **algun** d'aquests:

| Trigger | Raó |
|---------|-----|
| **Facturació anual > 30.000€** | A partir d'aquí, la fiscalitat SL és més avantatjosa que autònom |
| **Vols incorporar una sòcia** | Una SL permet repartir participacions netament |
| **Risc de responsabilitat** | Si tens contracts amb clients B2B grans, una SL limita la responsabilitat al capital social |
| **Vols buscar inversió** | Cap inversor investirà en un autònom |

### 3.2 Per què SL i no SA

| Característica | SL | SA |
|----------------|----|----|
| Capital mínim | 3.000€ | 60.000€ |
| Constitució | Simple i barata (~600€) | Complexa i cara (~2.500€) |
| Responsabilitat | Limitada al capital | Limitada al capital |
| Transmissió participacions | Restringida (preferència als socis) | Lliure |
| Auditoria | No obligatòria fins certs llindars | Obligatòria |
| **Recomanació Criteri ESG** | ✅ Sí | ❌ No |

### 3.3 Cost real de constituir una SL (2026)

| Concepte | Cost aprox. | Detalls |
|----------|-------------|---------|
| **Certificat negatiu de denominació** | 14€ | Tràmit al Registre Mercantil Central — reservar el nom "Criteri ESG SL" |
| **Capital social mínim** | 3.000€ | Aportats al compte bancari de la societat. NO és un cost, és un actiu que queda a l'empresa |
| **Escriptura pública davant notari** | 60-150€ | Tarifa regulada. **Si s'usa CIRCE (sistema telemàtic) és 60€** |
| **Inscripció al Registre Mercantil** | 70-100€ | Tarifa regulada |
| **Honoraris assessoria/gestoria** | 300-800€ | Per redactar estatuts, model 036 societat, alta IAE societat, etc. |
| **Impuesto de Actos Jurídicos Documentados (IAJD)** | Exempt | Constitució SL està exempta a Catalunya |
| **Total estimat** | **550-1.100€** | Sense capital social (que queda a l'empresa) |

**Font:** https://www.billeo.es/herramientas/calculadora-gastos-constitucion-sl

### 3.4 Procés pas a pas (versió CIRCE — més ràpida i barata)

1. **Sol·licitud de denominació** al Registre Mercantil Central (online, 1-2 dies)
2. **Obertura compte bancari** a nom de la futura SL i dipòsit dels 3.000€
3. **Redacció d'estatuts** (assessoria o plantilla CIRCE)
4. **Cita amb notari** que faci servir CIRCE (60€ tots conceptes)
5. **Inscripció al Registre Mercantil** automàtica via CIRCE (1-3 setmanes)
6. **Alta a l'AEAT** de la SL (model 036) — pot fer-ho la gestoria
7. **Alta a la Seguretat Social** del soci treballador (si tu seràs administrador)
8. **Llibre de socis, llibre d'actes, llibre comptable** (compra online, ~50€)

**Temps total:** 3-6 setmanes
**Font:** https://www.mesadvocats.com/blog/constitucio-de-societats-telematiques

### 3.5 Fiscalitat SL vs autònom (2026)

| Concepte | Autònom | SL |
|----------|---------|----|
| **Impost sobre beneficis** | IRPF (19-47% progressiu) | Impost de Societats (IS) — 23% micropimes 2026 |
| **IVA** | 21% serveis digitals | 21% serveis digitals (igual) |
| **Quota Seguretat Social** | ~294-607€/mes segons trams | Si ets administrador soci: ~294-500€/mes + pot haver-hi assalariat|
| **Repartiment de beneficis** | Directament teu | Dividends: 23% IRPF al soci |
| **Comptabilitat** | Simplementificada (llibre factures + despeses) | Obligació de comptabilitat formal amb dipòsit al Registre Mercantil |
| **Cost gestoria any 1** | 300-600€/any | 1.500-2.500€/any |

**Llei de Startups (Llei 28/2022) — si Criteri ESG compleix els requisits:**
- Nova o recentment creada (menys de 7 anys)
- No cotitza
- No reparteix dividends
- Té seu a Espanya
- 60% plantilla a Espanya
- Un dels 4 tipus: innovadora, escala, transferència tecnològica, en regulated sandbox

**Si compleix, beneficis:**
- IS al 15% (vs 23% micropimes normal) — primer any rendible i 2 anys següents
- Stock options fins a 50.000€/any exemptes
- Compatibilitat ser administrador soci i també assalariat
- Inversors Business Angels dedueixen 50% de la inversió (fins a 100.000€/any)

**Criteri ESG compleix?**
- ✅ Nova
- ✅ No cotitza
- ✅ No repartirà dividends al principi
- ✅ Seu a Espanya
- ✅ 100% plantila a Espanya (al principi)
- ❓ Innovadora — cal documentar innovació tecnolòfica (la nostra IA de curació i cross-reference és innovadora)

**Recomanació:** Sol·licita la certificació com a empresa emergent a ENISA (https://enisa.es) un cop constituïda la SL. Cost: 0€. Estalvi fiscal any 1-3 rendible: pot ser 8 punts d'IS.

---

## 4. Incorporar una nova sòcia

### 4.1 Quan incorporar

**Triggers per incorporar una sòcia:**
- Quan necessitis coneixements complementaris (ex. experta en ESG, expert en vendes B2B)
- Quan necessitis capital (sòcia inversora)
- Quan la persona fa 6+ mesos col·laborant i vols formalitzar

### 4.2 Com incorporar una sòcia a una SL existent

**Pas 1 — Pacte parasocial (abans de l'escriptura)**

Document privat entre els socis on s'estableix:
- Percentatge de participacions de cada soci
- Compromisos de temps i recursos
- Política de dividends
- Clausules de sortida (exit, lock-up, dret de tempteig, dret d'adjuntar)
- Restriccions a la transmissió de participacions
- Confidencialitat i no competència
- Resolució de conflictes (arbitratge o via judicial)

**Cost:** 500-2.000€ honorari advocat especialista en mercantil
**Vigencia:** És un acord privat, no cal inscriure'l al Registre (tot i que es pot notaritzar)

**Font:** https://globalpacta.com/ca/els-pactes-parasocials-una-eina-per-guanyar-seguretat-i

**Pas 2 — Augment de capital**

Procediment:
1. Junta general universal acordi l'augment de capital
2. Certificat d'acord firmat pels socis
3. Aportació dinerària de la nova sòcia al compte bancari de la societat
4. Escriptura pública davant notari de l'augment
5. Inscripció al Registre Mercantil

**Cost:**
- Notari: 120-300€
- Registre: 60-100€
- Honoraris assessoria: 400-1.000€
- **Total: 580-1.400€**

**Pas 3 — Modificació estatuts (si cal)**

Si la nova sòcia implica canviar l'estructura de govern (ex. co-administradores), cal modificar estatuts. Més notari + registre.

**Cost addicional:** 200-500€

### 4.3 Tipus d'aportació de la nova sòcia

| Tipus | Funcionament | Quan |
|-------|--------------|------|
| **Aportació dinerària** | La sòcia ingressa diners a la SL i rep participacions | Cas estàndard |
| **Aportació no dinerària** | La sòcia aporta actius (propietat intel·lectual, clients, equip) valorats | Si aporta un negoci previ |
| **Prestació accessòria** | Compromís de treball sense sou (a banda de la condició de soci) | Primer any sense cash |
| **Crèdit participatiu** | La sòcia presta diners a la SL amb condicions especials | Si vol protecció però no vol ser sòcia |

### 4.4 Pacte de socis — clàusules crítiques

**Clàusules imprescindibles per a Criteri ESG:**

1. **Vesting de participacions** — si una sòcia marxa abans de 4 anys, perd part de les seves participacions
2. **Clàusula de good leaver / bad leaver** — què passa si marxa per decisió pròpia vs acomiadament
3. **Dret de tempteig (right of first refusal)** — si una vol vendre, l'altra té preferència
4. **Dret d'adjuntar (tag-along)** — si una vol vendre a tercer, l'altra pot sumar-se a la venda
5. **Drag-along** — si una vol vendre i l'altra no, pot arrossegar-la (majoria qualificada)
6. **Liquidació preferent** — en cas de venda, qui recupera primer la inversió
7. **Anti-dilució** — protecció si hi ha rondes futures
8. **Bloqueig de decisions clau** — què requereix unanimitat vs majoria

---

## 5. Documentació adequada (Checklist complet)

### 5.1 Fase autònom (ara mateix)

- [ ] **Alta IAE actualitzada** amb epígraf serveis digitals
- [ ] **Model 037 presentat** modificant l'alta
- [ ] **Compte bancari separat** per l'activitat
- [ ] **Llibre de factures emeses** (electrònic)
- [ ] **Llibre de despeses** (electrònic)
- [ ] **Llibre de factures rebudes** (electrònic)
- [ ] **Factures amb sèrie específica** per Criteri ESG (ex. CR-2026-001)
- [ ] **Contracte amb Stripe** + termes i condicions de servei
- [ ] **Política de privacitat** de la web (obligatori RGPD)
- [ ] **Política de cookies** de la web
- [ ] **Avís legal** de la web
- [ ] **Terms & conditions** per subscriptors
- [ ] **Contracte de servei Premium/Ultra** (pot estar dins els T&C)
- [ ] **Assegurança RC professional** (recomanada, ~150-300€/any)

### 5.2 Fase SL (constitució)

- [ ] **Certificat negatiu denominació**
- [ ] **Estatuts socials** redactats per assessoria
- [ ] **Escriptura pública de constitució** davant notari
- [ ] **Inscripció al Registre Mercantil**
- [ ] **NIF provisional** (després del notari) → **NIF definitiu** (després del Registre)
- [ ] **Model 036 SL** a l'AEAT
- [ ] **Alta IAE SL**
- [ ] **Obertura compte bancari SL**
- [ ] **Llibre de socis**
- [ ] **Llibre d'actes**
- [ ] **Llibre comptable** (Diari i Inventari)
- [ ] **Alta a Seguretat Social** del soci treballador
- [ ] **Assegurança RC professional SL**

### 5.3 Fase incorporació sòcia

- [ ] **Pacte parasocial** firmat per ambdós socis (notaritzat recomanat)
- [ ] **Junta general universal** acordant augment de capital
- [ ] **Certificat d'acord**
- [ ] **Aportació dinerària** al compte de la SL
- [ ] **Escriptura pública d'augment de capital**
- [ ] **Inscripció al Registre Mercantil**
- [ ] **Llibre de socis actualitzat**
- [ ] **Comunicació a Hisenda** (model 036 amb canvis)

---

## 6. Pressupost consolidat per fases

### 6.1 Fase 1 (mes 1-3, autònom actual)

| Concepte | Cost |
|----------|------|
| Modificació alta IAE (model 037) | 0€ |
| Obertura compte bancari separat | 0-30€ |
| Stripe setup | 0€ (es paga per transacció) |
| Eina facturació (Anfix/Quipu) | 0-15€/mes |
| Assegurança RC | 150-300€/any |
| **Total fase 1** | **~50€ inicial + ~50€/mes** |

### 6.2 Fase 2 (mes 4-12, autònom creixent)

| Concepte | Cost |
|----------|------|
| Quota autònom RETA | 294-500€/mes |
| Gestoria mensual | 30-60€/mes |
| Assessorament comptable/fiscal puntual | 200-500€/any |
| Hosting web (Vercel + Railway) | 20-30€/mes |
| Newsletter (Beehiiv) | 0€ (gratis fins 2.500 subs) |
| Eines (Notion, Figma, Google Workspace) | 0-20€/mes |
| **Total fase 2** | **~400-650€/mes** |

### 6.3 Fase 3 (any 2, constitució SL)

| Concepte | Cost únic | Cost recurrent any |
|----------|-----------|---------------------|
| Constitució SL (CIRCE + notari + registre) | 200€ | — |
| Honoraris assessoria (estatuts, altes) | 600-1.000€ | — |
| Gestoria mensual SL | — | 150-250€/mes |
| Comptabilitat + dipòsit al Registre | — | 100-200€/any |
| Auditoria (no obligatòria any 1) | — | 0€ |
| Assegurança RC SL | — | 300-500€/any |
| **Total any 1 SL** | **~1.000€** | **~2.500-3.500€/any** |

### 6.4 Fase 4 (incorporació sòcia)

| Concepte | Cost |
|----------|------|
| Pacte parasocial (advocat) | 500-2.000€ |
| Notarització pacte (opcional) | 100-200€ |
| Augment capital: notari + registre | 200-400€ |
| Honoraris assessoria augment | 400-1.000€ |
| **Total incorporació sòcia** | **1.200-3.600€** |

---

## 7. Calendari recomanat per a Criteri ESG

### 7.1 Pla temporal (basat en el roadmap de negoci)

| Període | Què fer | Per què |
|---------|---------|---------|
| **Mes 1 (juliol 2026)** | Modificar alta autònom + obrir compte separat + Stripe + assegurança RC | Començar a ingressar diners sense gaires costos fixos |
| **Mes 2-3 (agost-set 2026)** | Validar producte, primers subscriptors Premium (objectiu 30) | Demostrar que el negoci funciona abans de constituir SL |
| **Mes 4 (octubre 2026)** | Si facturació mensual > 3.000€, constituir SL | Óptim fiscal + prepara per a futura sòcia |
| **Mes 6 (desembre 2026)** | Sol·licitar certificació empresa emergent ENISA | Beneficis fiscals anys posteriors |
| **Mes 9-12 (març-juny 2027)** | Si coneixes la persona que serà sòcia, començar pacte parasocial | Donar temps a la relació abans de formalitzar |
| **Any 2 (segona meitat 2027)** | Constituir SL + incorporar sòcia | Quan el negoci és sòlid i la sòcia és la correcta |

### 7.2 Fites clau que disparen accions legals

| Fita | Acció legal |
|------|-------------|
| Primer ingrés | Ja estàs donat d'alta, només factura correctament |
| 1.000€ facturats/mes | Assegurança RC professional |
| 3.000€ facturats/mes | Avalua constituir SL (fiscalment més interessant) |
| 5.000€ facturats/mes | SL imprescindible. Possibilitat contractar assalariat |
| 30.000€ facturats/any | SL obligatòria si vols optimitzar fiscalment |
| Incorporar sòcia | Pacte parasocial + augment capital |
| Ronda inversió | SL + pacte parasocial complet + valoració |

---

## 8. Consideracions específiques per a Criteri ESG

### 8.1 Serveis digitals transfronterers (UE)

Si vols vendre a LATAM o altres països UE:
- **IVA intracomunitari**: Si el client és empresa amb NIF-IVA vàlid en altre estat UE → inversió del subjecte passiu (no cobres IVA, ho gestiona el client)
- **Fora UE**: Operació exempta d'IVA. Has de presentar model 369 (declaració recaptació IVA serveis electrònics a no establerts)

**Stripe Tax** gestiona tot això automàticament per tu.

### 8.2 Protecció de dades (RGPD + LOPDGDD)

Com a servei que recull dades personals dels usuaris (formulari registre), cal:
- **Política de privacitat** completa
- **Base jurídica** per tractament (consentiment explícit per al newsletter; contracte per al Premium)
- **Registre d'activitats de tractament**
- **Encarregat de tractament** amb Stripe, Beehiiv, etc.
- **Dret d'accés, rectificació, supressió, portabilitat** garantits
- **Notificació de violació** en 72h si hi ha breach

**Cost:** Pots fer-ho tu mateix amb plantilles (gratuït) o contractar assessorament especialitzat (300-800€ puntual)

### 8.3 Propietat intel·lectual i marca

Ja comentat al document `03-BRANDING.md`:
- Registre OEPM marca "CRITERI ESG" (~150€)
- Registre EUIPO (~850€)
- Es recomana fer-ho **abans del llançament públic** (setembre 2026)

### 8.4 Cookies i LSSI

La web ha de tenir:
- Banner de cookies compliant amb LSSI-CE
- Política de cookies detallada
- Avís legal amb dades fiscals teus (NIF, domicili, dades registre si SL)

---

## 9. Errors comuns a evitar

1. **No separar comptes bancaris** — Embolica la comptabilitat i fa sospitar Hisenda
2. **No tenir assegurança RC** — Una demanda d'un client per informació errònia pot arruïnar-te
3. **Constituir SL massa aviat** — Si no factures res, estàs pagant 2.500€/any de gestoria per res
4. **Constituir SL massa tard** — Si factures 50.000€ com a autònom, estàs pagant molts impostos de més
5. **No tenir pacte parasocial** — Els conflictes entre socis sense acord escrit són la causa #1 de mort de startups
6. **No donar-se d'alta a IAE amb epígraf correcte** — Inspecció d'Hisenda pot sancionar
7. **No ingressar IVA a temps** — Sancions fins al 150% de l'IVA degut
8. **No declarar rendiments a LATAM** — Cal declarar a Hisenda espanyola encara que els clients siguin fora

---

## 10. Fonts verificades

### Oficials (govern i administració)
- https://sede.agenciatributaria.gob.es — AEAT (Hisenda espanyola)
- https://www.boe.es/buscar/act.php?id=BOE-A-2022-21739 — Llei 28/2022 Startups
- https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/10721/10724/1320/1322 — Taula cotització RETA 2026
- https://sede.agenciatributaria.gob.es/Sede/va_es/impuesto-sobre-sociedades — Impost de Societats tipus
- https://canalempresa.gencat.cat — Generalitat Catalunya empreses
- https://www.justitonotario.es/tramitacion-telematica-integral-notaria-gestion-serfides-gestoria-notarios — CIRCE notari
- https://one.gob.es/en/startups-law — ENISA Llei Startups

### Especialistes (advocats i gestories)
- https://www.strongabogados.com/articles/sl-self-registration — SL registration step-by-step
- https://legalfournier.com/en/business-in-spain/constitucion-de-la-sociedad-limitada — Cost SL
- https://www.billeo.es/herramientas/calculadora-gastos-constitucion-sl — Calculadora cost SL
- https://www.mesadvocats.com/blog/constitucio-de-societats-telematiques — Constitució telemàtica
- https://globalpacta.com/ca/els-pactes-parasocials-una-eina-per-guanyar-seguretat-i — Pactes parasocials
- https://www.virtusadvocats.com/en/partnership-documentation — Pacte de socis
- https://www.jlanotarios.com/ca_ES/servicios-notariales/mercantil-y-sociedades/pacto-parasocial-protocolo-familiar.html — Pacte parasocial notari
- https://www.assessoria-teixidor.com/ca/el-tipus-de-limpost-sobre-societats-sajusta-de-nou-el-2026 — IS 2026 Catalunya
- https://pimec.org/serveis/competitivitat-i-estrategia/reduccio-progressiva-de-limpost-de-societats — Pimec IS reducció
- https://www.wolterskluwer.com/es-es/expert-insights/cuotas-autonomos-2026 — Quote autònom 2026
- https://getrenn.com/blog/autonomo-costs — Cost autònom Spain 2026
- https://cuentica.com/asesoria/guia-cuota-autonomos — Guia cuota autònoms
- https://grupcarles.com/ca/noticies/reial-decret-llei-2-2026-autonoms-contribuents-impostos-deduccions-2026 — RD Llei 2/2026
- https://www.assessoriacodina.com/novetat/saprova-la-nova-llei-de-suport-als-emprenedors-i-a-la-seva-internacionalitzacio — Nova llei emprenedors

### Stripe i eines
- https://stripe.com/resources/more/sell-services-online-spain — Stripe Espanya
- https://stripe.com/en-mx/resources/more/vat-ecommerce-businesses-spain — IVA Espanya Stripe

---

## 11. Resum executiu per a Paolo (acció immediata)

### Què fer ARA (aquesta setmana)
1. **Modifica la teva alta d'autònom** amb model 037 per afegir serveis ESG (0€, 30 minuts)
2. **Obre compte bancari separat** per Criteri ESG (0-30€, 1 hora)
3. **Crea compte Stripe** per poder cobrar (0€ inicial, 1 hora)
4. **Assegurança RC professional** — demana pressupost a 2 asseguradores (150-300€/any)

### Què NO fer encara
- ❌ No constitueixis SL encara (massa aviat)
- ❌ No busquis sòcia encara (valida el negoci primer)
- ❌ No registris OEPM marca encara (fes-ho quan tinguis els primers 5 subscriptors Premium)

### Què fer als propers 3 mesos
1. **Juliol 2026**: alta + compte + Stripe + assegurança
2. **Agost 2026**: primers clients pilot (gratuïts)
3. **Setembre 2026**: llançament Premium amb 30 subs objectiu

### Quan saltar a SL
- Quan facturis > 3.000€/mes de manera consistent (3 mesos seguits)
- O quan vulguis incorporar una sòcia
- O quan vulguis sol·licitar inversió

### Quan buscar sòcia
- Quan tinguis 100+ subscriptors Premium
- O quan el negoci et superi i necessitis ajuda professional qualificada
- Abans de buscar: pacte parasocial redactat per advocat

---

## Política de privacitat (juliol 2026)

La política de privacitat completa està disponible a:
- **Web**: `https://criteriesg.com/privacidad`
- **Mockup HTML**: `assets/web/public/privacidad.html`
- **Adaptada de**: Vitivin PRO SCCL (revisada per advocat)

### Punts clau

1. **Responsable**: CRITERI ESG · info@criteriesg.com
2. **Base legal**: consentiment (newsletter), execució de contracte (servei), obligació legal (facturació)
3. **Dades obligatòries**: nom + email. Opcionals: empresa, interessos
4. **Conservació**: compte 30 dies post-baixa; factures 6 anys (llei)
5. **Eliminació (GDPR dret a l'oblit)**: soft delete 30 dies → anonimització
6. **Destinataris**: Supabase (UE), Vercel (UE), Stripe (UE), Fiare (ES), Resend (UE), Beehiiv (EE.UU. amb CCT)
7. **Drets RGPD**: accés, rectificació, supressió, limitació, portabilitat, oposició
8. **Contacte**: info@criteriesg.com amb assumpte "Ejercicio de derechos RGPD"

### Recomanació

La política està adaptada de Vitivin (revisada per advocat). Es recomana una **revisió legal específica** abans del llançament (setembre 2026) per:
- Verificar que cobreix els 3 mètodes de login (magic link, contrasenya, Google OAuth)
- Verificar l'apartat de transferències internacionals (Beehiiv EE.UU.)
- Verificar l'apartat d'estudiants universitaris (futur)

---

## Estructura de base de dades (Supabase / PostgreSQL)

### Taula `profiles` (extensió d'auth.users)

```sql
create table profiles (
  id uuid references auth.users primary key,
  email text not null,
  full_name text,
  company text,
  nif_cif text,
  phone text,
  preferred_language text default 'es' check (preferred_language in ('ca', 'es')),
  sector text,
  certifications text[],
  interests text[],
  user_type text default 'standard' check (user_type in ('standard', 'student', 'b2b_admin', 'b2b_member')),
  newsletter_subscribed boolean default true,
  newsletter_language text default 'es' check (newsletter_language in ('ca', 'es')),
  gdpr_consent boolean default false,
  gdpr_consent_date timestamptz,
  marketing_consent boolean default false,
  marketing_consent_date timestamptz,
  is_active boolean default true,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Taula `subscriptions`

```sql
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  plan text not null check (plan in ('free', 'premium', 'ultra')),
  payment_method text check (payment_method in ('stripe', 'fiare')),
  billing_period text check (billing_period in ('monthly', 'annual')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'expired', 'pending', 'suspended')),
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  cancelled_at timestamptz,
  amount_paid numeric(10,2),
  payment_currency text default 'EUR',
  stripe_customer_id text,
  stripe_subscription_id text,
  fiare_proof_url text,
  fiare_validated boolean default false,
  fiscal_document_id uuid,
  is_early_bird boolean default false,
  early_bird_number integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### Taula `documents_fiscals`

```sql
create table documents_fiscals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  subscription_id uuid references subscriptions(id),
  type text not null check (type in ('receipt', 'invoice', 'credit_note')),
  document_number text not null unique,
  issue_date timestamptz not null default now(),
  amount numeric(10,2) not null,
  vat_amount numeric(10,2),
  currency text default 'EUR',
  client_name text not null,
  client_nif text not null,
  client_address text,
  client_postal_code text,
  concept text not null,
  period_start date,
  period_end date,
  payment_method text check (payment_method in ('stripe', 'fiare')),
  pdf_path text not null,
  related_document_id uuid,
  created_at timestamptz default now()
);
```

### Taula `newsletter_subscribers`

```sql
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  language text default 'es' check (language in ('ca', 'es')),
  source text default 'web',
  is_active boolean default true,
  unsubscribed_at timestamptz,
  gdpr_consent boolean default false,
  gdpr_consent_date timestamptz,
  created_at timestamptz default now()
);
```

### Taula `report_views` (auditoria)

```sql
create table report_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  report_slug text not null,
  viewed_at timestamptz default now(),
  ip_address inet,
  user_agent text
);
```

### Row Level Security (RLS)

```sql
-- Cada usuari només veu el seu perfil
create policy "Users see own profile" on profiles
  for select using (auth.uid() = id);

-- Cada usuari només veu les seves subscripcions
create policy "Users see own subscriptions" on subscriptions
  for select using (auth.uid() = user_id);

-- Cada usuari només veu els seus documents fiscals
create policy "Users see own documents" on documents_fiscals
  for select using (auth.uid() = user_id);
```

En Paolo (admin) pot veure totes les taules via `service_role` key de Supabase.

---

## Històric de canvis

- **27 juny 2026** — Versió inicial 1.0. Cobertura completa: autònom, SL, sòcia, documentació, costos per fases, fonts verificades
