# 11 — Sistema de tasques

> Com gestionem les tasques del projecte Criteri ESG amb GitHub Issues + Projects.

## Estructura del sistema

Fem servir tres eines integrades de GitHub:

### 1. Issues (tasques individuals)
Cada tasca és un "issue" al repositori. Té:
- **Títol** descriptiu
- **Descripció** amb context
- **Persona assignada** (Paolo, Z.ai-bot, o col·laborador futur)
- **Etiquetes** (prioritat, tipus, àrea)
- **Data límit** (deadline amb countdown automàtic)
- **Milestone** (fase del projecte)
- **Comentaris** per al seguiment

URL: https://github.com/PaoloGLM/criteri-esg-lab/issues

### 2. Project (tauler Kanban)
Un tauler visual amb 4 columnes:
- **Backlog** — tasques planificades però no començades
- **To Do** — tasques per fer aviat
- **In Progress** — tasques en curs
- **Done** — tasques completades

URL: https://github.com/PaoloGLM/criteri-esg-lab/projects/1

### 3. Milestones (fites)
Agrupen issues per fase del projecte:
- **Fase 1 — Validació** (juny-agost 2026)
- **Fase 2 — Llançament** (setembre-desembre 2026)
- **Fase 3 — Escalada** (gener-juny 2027)

---

## Etiquetes (labels)

### Prioritats
- `P1` — Crítica, no es pot avançar sense això
- `P2` — Important, fer-la en les properes 2 setmanes
- `P3` — Normal, enquesta de backlog
- `P4` — Baixa, només si hi ha temps

### Tipus
- `operativa` — Tasques que fa Paolo (registres, contractes, etc.)
- `tècnica` — Tasques que fa Z.ai-bot (codi, documents, etc.)
- `estratègica` — Decisions de negoci
- `comunicació` — Xarxes socials, newsletter, relacions

### Àrea
- `marca` — Naming, logo, domini, OEPM
- `producte` — Web, format informe, formats Ultra
- `contingut` — Informes pilot, dossiers, newsletter
- `mercat` — Anàlisi, buyer persona, competidors
- `finances` — Preus, costos, marge
- `operacions` — Pipeline IA, hosting, eines

---

## Persona assignada

### `@PaoloGLM`
Tasques operatives que només tu pots fer:
- Registrar dominis
- Signar documents OEPM/EUIPO
- Crear comptes a Beehiiv, Stripe, etc.
- Generar podcasts amb NotebookLM
- Decisions estratègiques finals

### `@criteri-esg-bot` (jo)
Tasques tècniques i de documentació:
- Crear/editar documents del repo
- Generar PPTs i informes processats
- Anàlisi de competència
- Codi de la web
- Crear nous issues i organitzar el Project

---

## Workflow (com funciona dia a dia)

### 1. Crear tasques
Quan parlem i decidim una cosa, jo creo un issue amb:
- Descripció clara
- Persona assignada
- Prioritat
- Data límit (si aplica)
- Milestone corresponent

### 2. Revisar tasques
Tu reps notificació per email de cada nou issue. Pots:
- Llegir-lo a https://github.com/PaoloGLM/criteri-esg-lab/issues
- Comentar si tens dubtes
- Reassignar-lo si cal

### 3. Executar
- Quan comences una tasca, mou-la a "In Progress"
- Quan l'acabis, mou-la a "Done" i tanca l'issue
- Si està bloquejada, comenta amb `@criteri-esg-bot` explicant el bloqueig

### 4. Revisió setmanal
Cada diumenge vespre, faig un repàs dels issues oberts i t'envio un resum per xat amb:
- El que s'ha completat aquesta setmana
- El que està en curs
- El que hauries de fer la setmana següent (P1 i P2)

---

## Vistes disponibles al Project

El Project té 3 vistes que pots canviar a la part superior:

1. **Tauler (Kanban)** — Vista per defecte, columnes To Do/In Progress/Done
2. **Calendari** — Mostra les tasques al calendari segons data límit
3. **Roadmap** — Vista temporal per fites (milestones)

---

## Llista de tasques inicials (primers issues)

Aquests són els primers issues que crearé al Project:

### P1 — Crítiques (juny-juliol 2026)
1. Registrar domini `criteriesg.com` → @PaoloGLM
2. Registrar domini `criteriapp.com` → @PaoloGLM
3. Iniciar registre OEPM marca "CRITERI ESG" → @PaoloGLM
4. Activar subscripcions RSS/fonts prioritàries → @criteri-esg-bot
5. Crear compte Beehiiv per a newsletter → @PaoloGLM

### P2 — Importants (juliol-agost 2026)
6. Crear compte LinkedIn empresa + Twitter/X → @PaoloGLM
7. Outreach a 5 clústers catalans (CEEC, CWP, MAV, etc.) → @PaoloGLM
8. Processar 4 informes pilot manualment → @criteri-esg-bot
9. Definir 30 fonts exactes per pipeline Nivell 2 → @criteri-esg-bot
10. Crear pàgina `/informes` amb biblioteca → @criteri-esg-bot

### P3 — Normals (setembre 2026)
11. Llançament Premium amb preu promoció 29€ → @PaoloGLM
12. Crear 1r dossier temàtic (EcoVadis Bronze→Or) → @criteri-esg-bot
13. Webinar mensual sobre 3 informes clau del mes → @PaoloGLM
14. Pipeline Nivell 2 (RSS automàtic) → @criteri-esg-bot
15. Outreach 50 consultories ESG (ES, FR) → @PaoloGLM

---

## Quan arribi un col·laborador futur

Si s'uneix un soci o empleat:
1. Li dones accés al repo com a col·laborador
2. Creem etiquetes noves si cal (ex: `@colaborador-designer`)
3. Li assignem issues segons la seva especialitat
4. Rep les mateixes notificacions per email

El sistema escala naturalment sense canvis.

---

## Alternatives considerades

### Per què no Trello/Asana/Notion?
- **Trello**: eina excel·lent però externa al repo, duplicació
- **Asana**: massa complexa per la fase actual, cost
- **Notion**: ja descartat anteriorment (jo no hi puc escriure directament)
- **Linear**: massa tècnic per al públic mixt

GitHub Issues + Projects és la millor opció perquè:
- Integrat al repo (tot al mateix lloc)
- gratuït
- Jo puc crear issues via API
- Tu reps notificacions sense haver d'aprendre eina nova
- Escala quan arribin col·laboradors

---

## Històric de canvis

- **26 juny 2026** — Versió inicial. Sistema basat en GitHub Issues + Projects. 15 tasques inicials planificades entre juny i setembre 2026.
