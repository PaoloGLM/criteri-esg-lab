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
