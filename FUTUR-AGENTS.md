# 🤖 Futur: Agents IA d'empresa ↔ Agent Hermes Criteri ESG

> **Declarat per**: Paolo (CEO) · 20-08-2026
> **Estat**: VISIÓ — documentat per dissenyar-hi el model de dades ara, sense construir-hi res encara.

---

## 1. La visió

En un futur molt proper, cada empresa disposarà de **sistemes d'IA integrats als seus equips, sistemes i bases de dades**. Seran els **agents de IA de l'empresa** (no les persones) els que es connectaran amb Criteri ESG.

L'arquitectura prevista:

```
Agent de l'empresa  ←──→  Agent Hermes Criteri ESG
   (sap: materialitat,          (sap: informes destil·lats,
    perímetre consolidat,        crossRefs, fitxes d'expert,
    sistemes i bases de dades)   semàfor, criteris ètics)
```

L'agent empresa aporta el **context** (què és material per a ells, quin perímetre cobreixen, quines dades tenen). L'agent Criteri aporta el **criteri**: informes processats, crossRefs amb traçabilitat, i el component editorial ètic.

## 2. Per què és la direcció correcta (i el moat)

- **La informació és commoditat**: qualsevol model la troba. La diferenciació de Criteri és el **judici** — semàfor metodològic, 5 criteris ètics (dignitat, justícia distributiva, sostenibilitat absoluta, co-decisió, arrelament), advocat del diable.
- Un agent empresa no pot fabricar-se aquest criteri sol; **pot comprar-lo** a Criteri.
- L'intercanvi agent↔agent elimina la fricció humana: l'empresa no ha d'omplir formularis; el seu agent porta les dades directament.

## 3. Què implica per al model de dades (ja, avui)

El crossRef es dissenya **ara** perquè sigui consumible per agents (JSON net, autodescriptiu, traçable):

```json
crossRefs: [{
  "framework": "gri",
  "criterion": "GRI 305-1 Direct GHG emissions",
  "coverage": "compleix | parcial | no-cobert",
  "evidence": { "page": 42, "section": "3.2", "table": "T-3" },
  "nature": "quantitatiu | qualitatiu | compromis",
  "impact": "alt | mitja | baixa",
  "action": "..."
}]
```

### Separació pipeline / web (i futur agent)

| Capa | Pregunta que respon | Informació que té |
|---|---|---|
| **Pipeline (pas 2-5)** | "Què diu aquest informe sobre aquest estàndard?" (fet objectiu) | Informe + estàndard + fitxes |
| **Web / futur agent** | "Què significa això PER A MI?" (judici personalitzat) | Perfil de l'empresa: materialitat, perímetre, sistemes |

**Regla pràctica**: si la resposta depèn de l'empresa que llegeix → capa d'empresa (ara: web; futur: agent). Si només depèn de l'informe i l'estàndard → pipeline.

Dimensions de l'anàlisi de Gemini (2026-08-20) classificades:
- **Pipeline ara**: estatus de cobertura (compleix/parcial/no-cobert), traçabilitat (pàgina/secció), naturalesa de la dada (quantitatiu/qualitatiu/compromís)
- **Capa d'empresa (futur agent)**: matriu de doble materialitat, perímetre de cobertura, omissió justificada
- **Ambdós**: acció concreta (el pilot B Corp ja la té)

## 4. Quan arribi l'agent empresa

1. L'empresa autoritza el seu agent a connectar-se (API autenticada)
2. L'agent empresa envia el seu context: materialitat, perímetre, sistemes
3. L'agent Criteri creua el context amb els informes/crossRefs publicats i respon amb judici personalitzat + accions
4. Contracte de dades: JSON (el mateix model del crossRef + context d'empresa)

## 5. Pendent (no construir ara)

- ⏳ Disseny de l'API d'agents (autenticació, contracte)
- ⏳ Esquema de "context d'empresa" (materialitat, perímetre)
- ⏳ Decisió de producte: agent Criteri com a servei autònom vs mòdul del dashboard

---

## 6. Disseny tècnic proposat (documentat 26-08-2026 · valida la Roser/Paolo)

> Afegeix l'arquitectura concreta a la visió. No construeix res encara; deixa el full de ruta i les decisions de disseny preses perquè la implementació sigui directa quan es validi.

### 6.1 Objectiu
Connectar la web (Next.js/Supabase, depliegat a Vercel) amb els agents d'IA de les empreses perquè puguin:
1. **Consultar** informes, estàndards i crossRefs (capa de lectura).
2. **Enviar el seu context** (sector, mida, perímetre, certificacions) per rebre la **projecció personalitzada** dels informes.
3. Rebre **judici editorial** (semàfor, accions prioritzades per al seu perfil) sense que l'informe genèric canviï mai.

**Regla inviolable (Paolo)**: l'informe és sempre genèric (1.100 paraules, 8 blocs). La personalització viu a la **capa de consum** (què es mostra a qui, amb quin pes), mai dins del contingut.

### 6.2 Arquitectura en 3 vies (amb grau de maduresa)

| Via | Protocol | Què li permet a l'agent | Estat recomanat |
|---|---|---|---|
| **1. API REST documentada** | JSON sobre HTTPS | Cridar endpoints `reports`, `standards`, `crossrefs` | **BASE** — ara |
| **2. MCP** (Model Context Protocol, Anthropic) | `@modelcontextprotocol/sdk` | Els agents (Claude, ChatGPT connectors, Cursor) es connecten natiu com a "tool" | **Capa fina** sobre l'API — quan hi hagi pilot |
| **3. A2A** (Agent2Agent, Google/Linux Foundation) | cards de tasca | Col·laboració agent↔agent (la visió llarga de Paolo) | **NO ara** — 2027+ |

**Estratègia**: API REST és la fundació. MCP és una capa prima que crida els mateixos endpoints (mateixa lògica, un cop construïda). A2A s'afegeix quan l'ecosistema el parli — la visió de "l'agent empresa em connecta amb el vostre agent" ja encaixa en aquest esquema.

### 6.3 Contracte de l'API (fase 1 · lectura)

```
GET /api/v1/reports?crossref=ecovadis&since=2026-08-01&lan=ca
  → { id, title, slug, date, semafor: { nota, dots }, blocs: [ {...} ], crossRefs }
GET /api/v1/reports/{slug}
  → informe complet amb crossRefs traçables (page, section)
GET /api/v1/standards
  → els 16 estàndards amb counts i tipus (regulació/framework/certificació)
GET /api/v1/reports/{slug}/projected   [fase 2 · requereix perfil]
  → el mateix informe + projecció segons el perfil de l'empresa
```

**Model de dades**: reutilitza el `crossRefs` existent (JSON net amb `framework / criterion / coverage / evidence.page / nature / impact / action`) — ja està dissenyat per ser consumible per agents (FUTUR-AGENTS §3).

### 6.4 Perfil d'empresa i projecció personalitzada (fase 2)

```
POST /api/v1/profile                     [context d'empresa]
  { sector, mida, perímetre, certificacions: [{ standard, puntuacio }], interessos, llengua }

GET /api/v1/reports/{slug}/projected      [judici segons perfil]
  → informe genèric + crossRefs FILTRATS/prioritzats per al perfil
```

**Principi de projecció (determinista, zero tokens per petició)**:
- El text de l'informe **no canvia mai**.
- Només canvien: quin blocs es destaquen (04 Implicacions, 07 Accions, 08 Cross-reference), amb quin **pes** es marquen els crossRefs (`impact: alt` si toca la seva certificació), i quines alarmes es mostren (fora de perímetre CSRD → no rep por CSRD, rep TCFD/ISO).
- És una capa de **judici**: el fet és igual per a tothom, el focus varia.

**Dades**: taula `company_profiles` (Supabase) lligada a l'usuari/empresa + funció de projecció pura (criteris → pesos → ordenació/filtre). El crossRef ja està estructurat per estàndard; només falta el pes per empresa.

### 6.5 Seguretat i confiança (crític)

1. **API keys per empresa** hashejades (com contrasenyes), revocables, amb **scopes**: `read:reports`, `read:standards`, `write:profile`.
2. **Rate limits per pla**: Free 100 req/dia · Premium 10k · API dedicada il·limitat.
3. **Zero aïllament trencat**: el perfil de l'empresa A mai entra en respostes de B.
4. **RGPD**: el perfil és dada de tractament → documentar a la política de privacitat (12-PLANTEJAMENT-LEGAL.md) + **export/delete** via API.
5. **Logging d'accés** auditable: qui ha demanat què i quan.
6. **Opció "stateless"**: si una empresa no vol emmagatzemar el perfil a Criteri, pot enviar el context a cada petició (`POST /projected`) i no es desa res.

### 6.6 Model de negoci (a decidir amb Paolo)

| Opció | Descripció | Ajust |
|---|---|---|
| A | Accés API dins del Premium | fàcil, sense nova venda |
| B | **Pla API/Enterprise** dedicat (API key + perfil + SLA) | el natural per a agents |
| C | Integració MCP com a add-on del Ultra (abril 2027) | lligat al roadmap |

Recomanació: **B com a base + C com a vitrina** (un MCP demostrable és el que una empresa mitjana prova en una tarda).

### 6.7 Roadmap (tot traspassable a Vercel)

| Fase | Què | Esforç estimat |
|---|---|---|
| 1 | API REST read-only (reports, standards, crossrefs) + taula `api_keys` | 2-3 dies |
| 2 | Endpoint `POST /api/v1/profile` + projecció personalitzada | 2 dies |
| 3 | Servidor MCP prim (fina capa sobre l'API) | 1-2 dies |
| 4 | (2027) A2A si l'ecosistema ho demana | — |

**Quan**: la fase 1 és invisible per als usuaris i es pot fer abans del llançament públic. La 2 requereix que el perfil de `/cuenta` sigui real (ara és mockup). La 3 espera al primer client pilot.

### 6.8 Advocat del diable

1. **Canibalització**: si l'agent llegeix tot el catàleg per API, per què pagaria la subscripció humana? → **Mitigar**: la projecció personalitzada ÉS el producte; el genèric es regala via llms.txt, el judici personalitzat es cobra.
2. **Fuga de dades**: les empreses no voldran declarar certificacions a un tercer → **Mitigar**: opció "stateless" (el context viatja a cada petició, no s'emmagatzema).
3. **Cost**: cada petició = crida a model? → **No**: la projecció és determinista (regles, zero tokens). Només caldria LLM per a resums per empresa — i per decisió de Paolo, això no es fa.
4. **Ètica** (Kant/Bé Comú): el fet no varia mai, el focus sí. Un agent amb EcoVadis baix rep les mateixes dades, però amb el pes d'allò que li és material. La regla editorial es manté: la veritat objectiva és per a tots; el senyal prioritari depèn del subjecte.
