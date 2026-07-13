# 01 — Pla de negoci

> Document estratègic principal. Totes les decisions de model, mercat i execució es prenen i s'actualitzen aquí.

## Visió

**Criteri ESG** és un servei d'intel·ligència ESG que converteix informes institucionals, frameworks i certificacions europees en accions concretes. Cada informe es processa seguint una estructura de 7 blocs que acaba amb 3-5 accions recomanades i la seva cross-reference amb EcoVadis, B Corp i MSCI. L'usuari no ha de llegir 200 pàgines — ha de llegir 5 minuts i saber què fer.

## Missió

Cap empresa hauria de decidir a cegues en matèria d'ètica i sostenibilitat. La informació necessària per actuar amb criteri és pública, però dispersa i intractable. Criteri ESG la filtra, la sintetitza i la converteix en accions.

## Nicho

**Sostenibilitat + Ètica empresarial + Certificacions ESG**, amb focus en mercat europeu (ES, FR, IT, PT) i audiència principal B2B (directors de sostenibilitat, consultories ESG, compliance officers).

## Model de negoci — 4 fonts d'ingrés

### 1. Freemium (adquisició)
- Newsletter setmanal gratuïta: 3 informes + 1 connexió
- Acceso a resúmenes de informes generados por Criteri ESG (> 6 meses)
- Autodiagnòstic bàsic
- Objectiu: 3.000 subscriptors gratuïts en 6 mesos

### 2. Premium (recurrent)
- 39€/mes (29€ promoció primers 50 subscriptors)
- Arxiu complet, cerca semàntica, alertes personalitzades
- Cross-reference amb 5 frameworks principals
- 200 subscriptors any 1 (target)

### 3. Projectes (cross-sell)
- **Dossiers temàtics** (79-149€): "Com pujar d'EcoVadis Bronze a Or", "Guia B Corp first-time", "CSRD compliance"
- **Self-assessment tool** (49€): informe automàtic amb 15 preguntes
- Marge 95%

### 4. B2B (sostre alt)
- **Ultra** individual (89€/mes): Premium + podcast + PPT editable + dossier mensual + 1 connexió personalitzada/mes
- **Equip B2B** (199-499€/mes): Ultra per a 5 usuaris + API + dashboard d'equip

## Mercat

| Métrica | Valor | Font |
|---------|-------|------|
| TAM | 12.000 directors ESG a la UE | LinkedIn |
| SAM | 4.500 consultories/corporacions sud-europees | Estimació |
| SOM (any 2) | 300 subscriptors de pagament | Target realista |
| Creixement pressupost ESG UE | +38% anual | PwC 2024 |

## Públic objectiu — 5 perfils

1. **Director de sostenibilitat** — ARPU 39€/mes. Pain: preparar certificacions sense temps
2. **Consultoria ESG** — ARPU 99€/mes (equip). Pain: estar al dia per múltiples clients
3. **Compliance officer** — ARPU 79€/mes. Pain: CSRD/SFDD sense errors
4. **Investor Relations** — ARPU 99€/mes. Pain: justificar ratings davant inversors
5. **Equip B Corp certificat** — ARPU 49€/mes. Pain: mantenir i millorar score

## Competidors

| Competidor | Què fan | Forat que deixen |
|-----------|---------|------------------|
| EURACTIV | Periodisme diari UE | No sintetitzen informes, no cross-ref |
| POLITICO PRO | Newsletter premium | Massa general, no ESG profund |
| RESPONSIBLE INVESTOR | Notícies ESG | Massa car (1.200€/any), anglès |
| ECOVADIS ACADEMY | Formació EcoVadis | Només 1 framework |
| **CRITERI ESG** | Curació + cross-reference CAT/ES | Únic en integrar frameworks + accions |

## Finances — projecció 12 mesos

| Mes | Subs | Ingressos | Costos | Marge |
|-----|------|-----------|--------|-------|
| 2 | 5 | 195€ | 120€ | 75€ |
| 4 | 30 | 1.170€ | 120€ | 1.050€ |
| 6 | 100 | 3.900€ | 150€ | 3.750€ |
| 8 | 180 | 7.020€ | 180€ | 6.840€ |
| 10 | 250 | 9.750€ | 200€ | 9.550€ |
| 12 | 350 | 13.650€ | 220€ | 13.430€ |

- **Break-even**: 20 subscriptors
- **Marge brut**: 85%
- **Cost fix màxim**: 220€/mes (hosting + API + tools)

## Roadmap 90 dies

| Setmana | Tasca | Entregable |
|---------|-------|-----------|
| 1-2 | Confirmar nom + registrar OEPM + muntar Beehiiv + Twitter/LinkedIn | Marca registrada + newsletter operativa |
| 3-4 | Publicar 4 resums pilot manualment + llistar 30 fonts ESG + prototip logo | 4 resums publicats + 100 lectors gratis |
| 5-6 | Script Python processant informe real via API + 7 blocs estructurats + cross-ref manual | Prototip automàtic + 1 informe cross-ref complet |
| 7-8 | Web simple Next.js + arxiu + premium paywall (Stripe) + 8 resums nous | Web operativa + 12 resums totals + 300 lectors |
| 9-10 | Llançament premium (39€/mes promo 29€) + 1er dossier (EcoVadis) + webinar | 30 subs premium + 1 dossier publicat |
| 11-12 | Pipeline Nivell 2 (RSS automàtic) + outreach 50 consultories ESG + cas d'èxit públic | Sistema autònom + 5 converses B2B obertes |

## Riscos principals

1. **Al·lucinacions IA** → RAG estricte + cites obligatòries + auditoria setmanal
2. **Responsabilitat en recomanacions** → Disclaimer + assegurança RC any 2
3. **Cost API no controlat** → Cache vectorial + rate limiting + optimització prompts
4. **Adquisició B2B lenta** → Mix B2C per cash flow + casos d'èxit públics

## Decisions financeres clau

- **Pressupost inicial**: 500€ (marca + domini + eines primer any)
- **Cost operatiu mensual màxim**: 220€
- **Preu Premium**: 39€/mes (per sota de "decisió meditada")
- **Preu Ultra**: 89€/mes (per sobre de decisió meditada, justificat per formats addicionals)
- **Mix 70/30**: 70% ingressos recurrents (premium + B2B), 30% projectes (dossiers + self-assessment)

## Històric de canvis

- **25 juny 2026** — Nivell Ultra actualitzat: afegit "1 connexió personalitzada mensual" i eliminat "sessió consultiva mensual" per decisió de Paolo
