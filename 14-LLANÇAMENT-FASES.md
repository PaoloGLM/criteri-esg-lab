# 14 — Estratègia de llançament per fases

> Model d'accés freemium amb "early bird" de 2 mesos per generar tracció inicial. Document operatiu que defineix què pot veure cada usuari a cada moment.

## Sumari executiu

Criteri ESG llançarà al setembre 2026 amb un model **freemium progressiu**:
- **Mesos 1-2 (setembre-octubre 2026)**: accés total gratuït per als primers usuaris ("early bird")
- **A partir del mes 3 (novembre 2026)**: s'activa el paywall Premium
- **Ultra** no disponible fins abril 2027 (6 mesos post-llançament)

Aquesta estratègia permet:
1. Generar tracció inicial amb usuaris gratis que després es converteixen en ambaixadors
2. Provar la qualitat del producte amb usuaris reals sense pressió de venda
3. Recollir feedback per millorar abans de cobrar
4. Crear urgència ("oferta de llançament limitada")

---

## 1. Calendari de llançament

### 1.1 Juliol 2026 — Tancament de dissenys i preparatius

**Objectiu**: Tenir tot llest per començar les proves a agost.

| Tasca | Responsable |
|-------|-------------|
| Tancar disseny final de la web (homepage + pàgines internes) | Nou membre equip + Z.ai-bot |
| Tancar disseny final de l'informe (Estil B v2) | Z.ai-bot |
| Tancar disseny final de la newsletter (Estil A v2) | Z.ai-bot |
| Processar 5-10 informes pilot (tots els de 2026) | Z.ai-bot |
| Registrar domini `criteriesg.com` + variants | Paolo |
| Iniciar registre OEPM marca "CRITERI ESG" | Paolo |
| Crear comptes Beehiiv, Supabase, Stripe | Paolo |
| Crear comptes LinkedIn empresa + Twitter/X | Paolo |
| Configurar GitHub Issues + Project (tauler) | Z.ai-bot (ja fet) |

### 1.2 Agost 2026 — Proves internes amb beta testers

**Objectiu**: Validar flux d'usuari, detectar errors, recollir feedback qualitatiu.

| Tasca | Responsable |
|-------|-------------|
| Convidar 10-20 beta testers de confiança | Paolo |
| Donar-los accés a la web amb tot llest | Nou membre equip |
| Recollir feedback estructurat (formulari) | Z.ai-bot (crea formulari) |
| Iterar disseny segons feedback | Nou membre equip |
| Provar enviat de 2 newsletters a beta testers | Z.ai-bot (esborrany) + Paolo (send) |
| Provar flux de registre i login | Nou membre equip |
| Test tècnic: rendiment, SEO, accessibility | Nou membre equip |

### 1.3 Setembre 2026 — Llançament oficial

**Objectiu**: Iniciar el període "early bird" de 2 mesos.

**Accions:**
1. Desplegar web en producció (criteriesg.com)
2. Activar Google Analytics + Hotjar
3. Llançament newsletter #1 al primer diumenge de setembre
4. Estratègia de captació:
   - Posts LinkedIn i Twitter/X
   - Outreach a 50 contactes personals de Paolo
   - Outreach a 5 clústers catalans (CEEC, CWP, MAV, etc.)
   - Col·laboració amb newsletters complementàries
   - SEO orgànic per als informes publicats

---

## 2. Model d'accés per usuari

### 2.1 Tipus d'usuari

| Tipus | Preu | Què pot veure |
|-------|------|---------------|
| **Visitant no registrat** | 0€ | Landing page + titulars d'informes només |
| **Registrat gratuït** | 0€ | Informes anteriors a 6 mesos + newsletter reduïda |
| **Premium (early bird)** | 29€/mes primer any (50 primers) | Tot el contingut + newsletter completa + 7 dies prova |
| **Premium (estàndard)** | 39€/mes | Igual que early bird |
| **Ultra** | 89€/mes | Premium + podcast + PPT + connexions personalitzades (a partir abril 2027) |

### 2.2 Accessos segons fase temporal

#### Fase 1: Setembre-octubre 2026 (early bird — 2 mesos)

| Usuari | Informes últims 6 mesos | Informes antics (>6 mesos) | Newsletter | Ultra |
|--------|-------------------------|----------------------------|------------|-------|
| Visitant | Només titulars | Només titulars | No rep | No disponible |
| Registrat gratuït | ✅ Accés complet | ✅ Accés complet | ✅ Completa (amb avís "properament serà de pagament") | No disponible |
| Premium early bird | ✅ Accés complet | ✅ Accés complet | ✅ Completa | No disponible |

**Missatge visible a la web durant aquesta fase:**
> "Estem en període de llançament. Tot el contingut és gratuït durant 2 mesos. A partir de novembre, els informes dels últims 6 mesos i les seccions premium de la newsletter requeriran subscripció. Oferta de llançament: 29€/mes (vs 39€ normal) per als primers 50 subscriptors Premium."

#### Fase 2: A partir de novembre 2026 (post early bird)

| Usuari | Informes últims 6 mesos | Informes antics (>6 mesos) | Newsletter | Ultra |
|--------|-------------------------|----------------------------|------------|-------|
| Visitant | Només titulars | Només titulars | No rep | No disponible |
| Registrat gratuït | ❌ Pop-up de subscripció | ✅ Accés complet | ⚠️ Reduïda (veure 2.3) | No disponible |
| Premium | ✅ Accés complet | ✅ Accés complet | ✅ Completa | No disponible |
| Ultra (a partir abril 2027) | ✅ Accés complet | ✅ Accés complet | ✅ Completa | ✅ Tots els formats |

### 2.3 Newsletter reduïda vs completa

#### Newsletter completa (Premium i early bird)
- Tots els apartats de la newsletter Estil A v2:
  1. Informe destacat
  2. 3 informes secundaris
  3. Notícies ESG (3 titulars amb fonts)
  4. Connexió de la setmana
  5. **Inversió ESG** (3 titulars amb fonts)
  6. Nota editorial
  7. CTA Premium

#### Newsletter reduïda (gratuïta post early bird)
Els mateixos apartats 1-4 i 6-7, però:
- L'apartat 5 (Inversió ESG) només mostra una frase: "Aquesta setmana analitzem [tema]. Subscriu-te a Premium per llegir l'anàlisi completa."
- Sense apartat de connexió de la setmana visible — només un titular que diu "Connexió Premium" i un CTA

### 2.4 Els primers 7 dies de prova (sempre disponible)

- Qualsevol usuari nou pot provar Premium gratis 7 dies
- Cal introduir dades de pagament (Stripe) però no es cobra fins al dia 8
- Es pot cancel·lar en qualsevol moment dels 7 dies sense cost
- Després dels 7 dies, es converteix automàticament en Premium a 39€/mes (o 29€/mes si encara hi ha places early bird)

---

## 3. Estratègia de preus i oferta de llançament

### 3.1 Preus definitius

| Nivell | Preu normal | Preu early bird | Quan està disponible |
|--------|-------------|-----------------|----------------------|
| Premium | 39€/mes | 29€/mes (primer any) | Setembre 2026 |
| Ultra | 89€/mes | No aplica | Abril 2027 (6 mesos post-llançament) |

### 3.2 Oferta de llançament

- **50 primers subscriptors Premium**: 29€/mes durant el primer any (vs 39€/mes normal)
- Una vegada assolits els 50 subscriptors, el preu torna a 39€/mes per als nous
- Els 50 primers mantenen 29€/mes durant 12 mesos; després passen a 39€/mes
- Comptador visible a la web: "Queden X places a 29€/mes"

### 3.3 Raonament dels preus

**Per què 29€/mes i no 19€/mes per l'oferta?**
- 29€ és el 0,4% del salari mensual brut d'un director de sostenibilitat (mitjana 5.300€/mes)
- Per sota de 25€/mes es percep com "massa barat" i resta credibilitat
- 29€ és competitiu vs Politico Pro (41€/mes) però premium vs Euractiv (gratis)

**Per què 39€/mes estàndard?**
- Coherent amb el valor percebut (estalvi 5h/setmana = 200€/mes de temps)
- Per sota de "decisió meditada" (50€+)
- Marge per descomptes anuals (15-20%)

**Per què Ultra a 89€/mes no estarà disponible al llançament?**
- Necessitem 6 mesos per afinar els formats premium (podcast, PPT, connexions personalitzades)
- No volem vendre una promesa que no podem complir
- Els primers 6 mesos ens serviran per recollir feedback dels Premium sobre què voldrien d'Ultra

---

## 4. Arxiu d'informes — política de visibilitat

### 4.1 Regla dels 6 mesos

**Regla:** qualsevol informe publicat fa més de 6 mesos és accessible gratuïtament (sota registre) per sempre. Els informes dels últims 6 mesos requereixen Premium.

**Exemple pràctic:**
- Informe publicat el 15 gener 2026 → accessible gratis a partir del 15 juliol 2026
- Informe publicat el 15 març 2026 → accessible gratis a partir del 15 setembre 2026
- Informe publicat el 15 setembre 2026 → accessible gratis a partir del 15 març 2027

### 4.2 El repositori des del 1 gener 2026

**Decisió:** el repositori d'informes a la web començarà el 1 gener 2026. Abans no hi haurà res.

**Implicacions:**
- Al setembre 2026 (llançament), el repositori tindrà tots els informes publicats entre gener i agost 2026 (~8 mesos)
- D'aquests, els informes de gener-març 2026 seran accessibles gratis (ja han passat 6 mesos)
- Els informes d'abril-agost 2026 requeriran Premium (encara no han passat 6 mesos)

### 4.3 Què veu cada usuari a la llista d'informes

**Visitant no registrat:**
- Veure tots els titulars + data + tags
- Però quan fa clic en un informe, apareix pop-up de registre

**Registrat gratuït:**
- Pot veure informes antics (>6 mesos) completament
- Quan clica un informe recent (últims 6 mesos), apareix pop-up de Premium

**Premium:**
- Pot veure tots els informes sense restricció

### 4.4 Quantitat d'informes esperada al llançament

- Gener 2026 - agost 2026: 8 mesos
- Estimació: 4-6 informes processats per mes = 32-48 informes al llançament
- D'aquests, aproximadament:
  - 16-24 seran accessibles gratis (>6 mesos)
  - 16-24 requeriran Premium (últims 6 mesos)

---

## 5. Calendari de newsletters

### 5.1 Bimensual (decisió 29 juny 2026)

**Freqüència:** un cop cada 2 setmanes (no mensual com hem parlat abans)

**Calendari 2026 (post-llançament):**
- Newsletter #1: 7 setembre 2026
- Newsletter #2: 21 setembre 2026
- Newsletter #3: 5 octubre 2026
- Newsletter #4: 19 octubre 2026
- Newsletter #5: 2 novembre 2026 (aquí s'activa el paywall, primer cop amb newsletter reduïda per als gratuïts)
- Newsletter #6: 16 novembre 2026
- Newsletter #7: 30 novembre 2026
- Newsletter #8: 14 desembre 2026
- Newsletter #9: 28 desembre 2026 (especial de tancament d'any)

### 5.2 Versions per a cada newsletter

Cada edició es genera en 2 versions:
1. **Versió Premium completa** (Estil A v2 complet)
2. **Versió gratuïta reduïda** (mateix disseny, però apartats 5 Inversió ESG i Connexió limitats a una frase)

**Implementació tècnica:**
- Beehiiv permet segmentar subscriptors per tags (Premium vs Free)
- Jo genero les dues versions via API
- Tu (Paolo) cliques "Send" per a cada segment a Beehiiv

---

## 6. Indicadors de èxit per fase

### Fase 1: Setembre-octubre 2026 (early bird)

| Mètrica | Objectiu |
|---------|----------|
| Visitants únics a la web | 2.000 |
| Subscriptors newsletter gratis | 500 |
| Usuaris registrats (amb dades) | 200 |
| Conversió visitant → registrat | 10% |
| Conversió registrat → Premium early bird | 5-10% |
| Subscriptors Premium early bird | 10-20 |

### Fase 2: Novembre-desembre 2026 (post paywall)

| Mètrica | Objectiu |
|---------|----------|
| Visitants únics a la web | 5.000 |
| Subscriptors newsletter gratis | 1.500 |
| Subscriptors Premium | 30-50 (omplir places early bird) |
| Taxa de retenció Premium | >85% |
| Conversió prova gratis → Premium | >30% |

### Fase 3: Gener-març 2027

| Mètrica | Objectiu |
|---------|----------|
| Subscriptors Premium | 80-100 |
| Preparació Ultra (investigació de formats) | Completada |
| Newsletter NPS | >40 |
| Cobertura premsa ESG | 2-3 mencions |

### Fase 4: Abril 2027 — Llançament Ultra

| Mètrica | Objectiu |
|---------|----------|
| Subscriptors Premium | 150+ |
| Subscriptors Ultra (primer mes) | 5-10 |
| Conversió Premium → Ultra | 5-7% |

---

## 7. Riscos i mitigacions

### 7.1 Risc: els usuaris gratuïts no es converteixen en Premium

**Mitigació:**
- Pop-up de Premium només quan l'usuari ha vist 3+ informes (no molestar al principi)
- Emailautomàtic als registrats gratuïts al dia 30 recordant l'oferta early bird
- Casos d'èxit públics ("Com la consultoria X ha guanyat un projecte gràcies a Criteri ESG")

### 7.2 Risc: la newsletter bimensual és insuficient

**Mitigació:**
- Si veiem que els usuaris volen més freqüència, podem passar a setmanal a partir de gener 2027
- Mentrestant, els Premium tenen accés als informes nous al moment (no esperen la newsletter)

### 7.3 Risc: Ultra es retarda massa

**Mitigació:**
- Si als 3 mesos ja tenim 50+ Premium i ens demanen Ultra, podem avançar el llançament
- No prometre data concreta als usuaris (dir "segona meitat 2027")

### 7.4 Risc: el nou membre de l'equip i jo (Z.ai-bot) no ens coordinem

**Mitigació:**
- Tot el codi i les decisions al GitHub
- El nou membre té accés al repositori
- Quan té una pregunta tècnica, em pregunta al seu propi xat
- Quan hi ha decisió estratègica, la parleu tu i ell primer, després m'ho dius a mi

---

## 8. Communicació entre Paolo, nou membre i Z.ai-bot

### 8.1 Repartiment de rols

| Persona | Rol | Què fa |
|---------|-----|--------|
| **Paolo** | CEO / Estratègia | Decisions estratègiques, relacions externes, Newsletter enviaments, gestió de marca |
| **Nou membre** | Tech Lead | Disseny web, programació, base de dades, integracions tècniques |
| **Z.ai-bot** | Assistència tècnica | Generar continguts (informes, newsletter, HTML), recerques, documentació al GitHub |

### 8.2 Comunicació amb Z.ai-bot

**Paolo** parla amb Z.ai-bot a través del seu xat (aquest).
**Nou membre** pot parlar amb Z.ai-bot:
- **Opció A (recomanada)**: obre el seu propi xat amb Z.ai-bot, llegeix el repositori GitHub per posar-se al dia, fa les seves preguntes tècniques allà
- **Opció B**: fa servir el xat de Paolo (compartit, però pot ser confús)

**El GitHub és el cervell compartit** — tot el que es decideix hi queda registrat. Els xats serveixen per conversar puntualment.

### 8.3 Quan cada persona parla amb mi

**Paolo em parla per:**
- Decisions estratègiques (preus, mercat, col·laboracions)
- Validació de continguts (informes, newsletter, comunicació)
- Pla de negoci i finançament
- Qualsevol cosa que requereixi visió global

**Nou membre em parla per:**
- Implementació tècnica (Next.js, Tailwind, Prisma, Supabase)
- Ajustaments de disseny (CSS, responsive, dark mode)
- Bugs i errors
- Optimització (SEO, rendiment, accessibility)
- Integració amb APIs (Beehiiv, Stripe, etc.)

---

## Històric de canvis

- **29 juny 2026** — Versió inicial 1.0. Estratègia completa: early bird de 2 mesos, paywall progressiu, newsletter bimensual, Ultra retardada a abril 2027, calendari juliol-setembre 2026.
