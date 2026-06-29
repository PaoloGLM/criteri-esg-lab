#!/usr/bin/env python3
"""Crea els 15 issues inicials de Criteri ESG."""
import json
import urllib.request
import sys

TOKEN = open("/home/z/my-project/.criteri-token").read().strip()
REPO = "PaoloGLM/criteri-esg-lab"
API = f"https://api.github.com/repos/{REPO}/issues"

# Mapeig milestone: 1=Fase 1, 2=Fase 2, 3=Fase 3
M_FASE1 = 1
M_FASE2 = 2
M_FASE3 = 3

# Persona assignada - PaoloGLM es l'unic que podem assignar explicitament
# Les tasques tecniques les fa el bot pero no es pot assignar a un bot
# Solucio: assignem a PaoloGLM totes, i en el titol/body indiquem qui les fa
PAOLO = "PaoloGLM"

issues = [
    # === P1 - Fase 1 (juny-juliol 2026) ===
    {
        "title": "[P1] Registrar domini criteriesg.com",
        "body": "## Què\nRegistrar el domini `criteriesg.com` al registrar (GoDaddy, Namecheap, o similar).\n\n## Per què\nÉs el domini principal del projecte. Tots els altres assets (emails, web, Stripe) depenen d'això.\n\n## Com\n1. Ves a https://www.godaddy.com o https://www.namecheap.com\n2. Cerca `criteriesg.com`\n3. Compra el domini (espera ~10-15€/any)\n4. Configura DNS per apuntar a Vercel (et donaré les instruccions quan tinguis el domini)\n\n## Acceptance criteria\n- [ ] Domini comprat\n- [ ] DNS configurat\n- [ ] `criteriesg.com` accessible des del navegador\n\n## Persona\n@PaoloGLM (operativa)",
        "labels": ["P1-Critica", "operativa", "marca"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-07-15",
    },
    {
        "title": "[P1] Registrar dominis secundaris (criteriapp.com, criteri-esg.com)",
        "body": "## Què\nRegistrar els dominis secundaris `criteriapp.com` i `criteri-esg.com` com a backup/defensiva.\n\n## Per què\n- `criteriapp.com` per si volem canviar de brand o fer una app\n- `criteri-esg.com` per si algú busca \"criteri esg\" directament\n- Evitar que competidors els agafin\n\n## Com\nMateix registrar que el domini principal. Cost estimat: ~20€/any total.\n\n## Acceptance criteria\n- [ ] criteriapp.com comprat\n- [ ] criteri-esg.com comprat\n- [ ] Redireccions 301 a criteriesg.com configurades\n\n## Persona\n@PaoloGLM (operativa)",
        "labels": ["P1-Critica", "operativa", "marca"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-07-15",
    },
    {
        "title": "[P1] Iniciar registre OEPM marca CRITERI ESG",
        "body": "## Què\nRegistrar la marca verbal `CRITERI ESG` a l'OEPM (Oficina Española de Patentes y Marcas) en classes 35 i 41.\n\n## Per què\nProtegir el nom legalment. Si algú altre registra una marca similar, podríem tenir problemes per operar.\n\n## Com\n1. Ves a https://www.oepm.es\n2. Sol·licitud de marca nacional (classe 35: serveis empresarials, classe 41: educació)\n3. Cost aproximat: 150€\n4. Tramitació: 6-12 mesos\n\n## Acceptance criteria\n- [ ] Sol·licitud presentada a OEPM\n- [ ] Número de sol·licitud guardat al document de branding\n\n## Persona\n@PaoloGLM (operativa)",
        "labels": ["P1-Critica", "operativa", "marca"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-07-31",
    },
    {
        "title": "[P1] Activar subscripcions a les 9 fonts prioritàries",
        "body": "## Què\nSubscriure's a les newsletters / alertes RSS de les 9 fonts marcades com a 'processar sempre' al document `10-FONTS-INFORMES.md`.\n\n## Fonts prioritàries\n1. OCCC Catalunya (canviclimatic.gencat.cat)\n2. CADS (cads.gencat.cat)\n3. MITECO (miteco.gob.es)\n4. OECC (miteco.gob.es)\n5. CES (ces.es)\n6. Comisión Europea - DG FISMA (finance.ec.europa.eu)\n7. Comisión Europea - DG ENV (environment.ec.europa.eu)\n8. Comisión Europea - DG CLIMA (climate.ec.europa.eu)\n9. EFRAG (efrag.org)\n\n## Per què\nSense aquestes subscripcions, no detectarem els nous informes rellevants a temps per sintetitzar-los.\n\n## Acceptance criteria\n- [ ] Subscrit a les 9 newsletters\n- [ ] Llista de confirmació al document 10-FONTS-INFORMES (canviar ⏳ per ✅)\n\n## Persona\n@criteri-esg-bot (tecnica) - farà el bot, però @PaoloGLM ha de validar que les subscripcions arriben al seu email",
        "labels": ["P1-Critica", "tecnica", "contingut", "operacions"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-07-15",
    },
    {
        "title": "[P1] Crear compte Beehiiv per a la newsletter",
        "body": "## Què\nCrear compte a https://www.beehiiv.com (gratuït fins a 2.500 subscriptors) per gestionar la newsletter setmanal.\n\n## Per què\nÉs la millor eina per newsletters el 2026. gratuït fins a 2.500 subs, bona deliverability, analytics integrades.\n\n## Com\n1. Ves a https://www.beehiiv.com\n2. Sign up amb el email professional (quan tinguis el domini)\n3. Crea la publicació 'Criteri ESG'\n4. Configura la plantilla amb la paleta terra+coure\n\n## Acceptance criteria\n- [ ] Compte creat\n- [ ] Publicació 'Criteri ESG' creada\n- [ ] Formulari d'inscripció integrat a la web\n\n## Persona\n@PaoloGLM (operativa)",
        "labels": ["P1-Critica", "operativa", "comunicacio", "producte"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-07-31",
    },
    # === P2 - Fase 1 (juliol-agost 2026) ===
    {
        "title": "[P2] Crear comptes LinkedIn empresa + Twitter/X",
        "body": "## Què\nCrear perfil d'empresa a LinkedIn i compte a Twitter/X per a Criteri ESG.\n\n## Per què\n- LinkedIn: canal principal B2B, on són els directors de sostenibilitat\n- Twitter/X: reposta contingut, interactua amb comunitat ESG europea\n\n## Com\n1. LinkedIn: https://www.linkedin.com/company/create - necessari tenir pàgina LinkedIn personal primer\n2. Twitter/X: https://twitter.com/i/flow/signup\n3. Logo: fer servir 'Criteri.' amb punt coure (encara no tenim logo oficial)\n4. Descripció: 'Intel·ligència ESG per a decisions ètiques. criteriesg.com'\n\n## Acceptance criteria\n- [ ] LinkedIn empresa creat amb URL linkedin.com/company/criteri-esg\n- [ ] Twitter/X creat amb handle @criteri_esg\n- [ ] Bio i descripció completades en ambdues\n\n## Persona\n@PaoloGLM (operativa)",
        "labels": ["P2-Important", "operativa", "comunicacio", "marca"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-08-15",
    },
    {
        "title": "[P2] Outreach a 5 clústers catalans per col·laboració",
        "body": "## Què\nContactar 5 clústers catalans (CEEC, CWP, MAV, Packaging Cluster, CLÚSIC) per explorar col·laboracions.\n\n## Per què\nEls clústers agrupen 60-80 empreses cadascun. Una col·laboració = accés directe a un sector sencer.\n\n## Com\n1. Identificar persona de contacte (direcció del clúster)\n2. Email de presentació curt (5-10 línies)\n3. Proposta concreta: 3 mesos gratis Premium pels seus membres + webinar mensual\n4. Follow-up en 1 setmana si no resposta\n\n## Acceptance criteria\n- [ ] 5 emails enviats\n- [ ] Mínim 3 respostes (follow-up inclòs)\n- [ ] Mínim 1 reunió agendada\n\n## Persona\n@PaoloGLM (operativa)",
        "labels": ["P2-Important", "operativa", "comunicacio", "mercat"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-08-31",
    },
    {
        "title": "[P2] Processar 4 informes pilot manualment",
        "body": "## Què\nProcessar 4 informes reals seguint el format de 7 blocs definit al document `02-PRODUCTE.md`.\n\n## Quins informes\nSuggeriments (a validar):\n1. Revisió ESRS (maig 2026) - ja fet ✅\n2. EFRAG ESRS S4 (esborrany, previst 2026)\n3. EcoVadis Methodology Update 2026 (quan surti)\n4. TNFD v2.0 (publicat 2025)\n5. BCE Climate risk stress test 2026\n\n## Per què\nTenir un arxiu inicial de 5 informes processats ens permetrà llançar la web amb contingut real, no només amb l'exemple.\n\n## Acceptance criteria\n- [ ] 4 informes processats amb 7 blocs\n- [ ] Tots en PDF a /download/\n- [ ] Tots publicats a la web (modal o pàgina individual)\n\n## Persona\n@criteri-esg-bot (tecnica)",
        "labels": ["P2-Important", "tecnica", "contingut"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-08-31",
    },
    {
        "title": "[P2] Definir 30 fonts exactes per pipeline Nivell 2",
        "body": "## Què\nDe les 88 fonts del document `10-FONTS-INFORMES.md`, seleccionar les 30 prioritàries que tindran crawler RSS automàtic.\n\n## Per què\nNo podem monitoritzar 88 fonts en la fase inicial. Necessitem focalitzar-nos en les 30 que més valor aportaran al públic objectiu (directors ESG + consultories).\n\n## Com\n1. Revisar les 88 fonts\n2. Aplicar criteris: rellevància per al públic + freqüència de publicació + qualitat tècnica\n3. Documentar les 30 seleccionades al document 10-FONTS-INFORMES\n4. Per cada una, identificar si té RSS i URL exacta\n\n## Acceptance criteria\n- [ ] 30 fonts seleccionades i marcades al document\n- [ ] URL de RSS identificada per cadascuna (si existeix)\n- [ ] Documentació actualitzada\n\n## Persona\n@criteri-esg-bot (tecnica)",
        "labels": ["P2-Important", "tecnica", "contingut", "operacions"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-08-15",
    },
    {
        "title": "[P2] Crear pàgina /informes amb biblioteca i cercador",
        "body": "## Què\nDesenvolupar la pàgina `/informes` a la web amb:\n- Llistat de tots els informes processats\n- Filtres per àmbit (CAT, ES, EU, Global, Sectorial)\n- Filtres per certificació afectada (EcoVadis, B Corp, MSCI, GRI)\n- Cercador per paraula clau\n- Vista de graella amb targetes\n\n## Per què\nLa homepage mostra 1 exemple. Però els subscriptors necessiten poder navegar per tot l'arxiu i trobar informes per temàtica.\n\n## Com\n- Next.js + TailwindCSS (ja en marxa)\n- Dades inicials hardcoded (més endavant vindran de Prisma/SQLite)\n- Component de cerca amb fuse.js o similar\n\n## Acceptance criteria\n- [ ] Pàgina /informes operativa\n- [ ] Mínim 5 informes visibles (els pilots)\n- [ ] Filtres funcionant\n- [ ] Cercador funcionant\n- [ ] Responsive mòbil\n\n## Persona\n@criteri-esg-bot (tecnica)",
        "labels": ["P2-Important", "tecnica", "producte"],
        "milestone": M_FASE1,
        "assignee": PAOLO,
        "due_date": "2026-08-31",
    },
    # === P3 - Fase 2 (setembre 2026) ===
    {
        "title": "[P3] Llançament Premium amb preu promoció 29€/mes",
        "body": "## Què\nLlançament oficial de la subscripció Premium amb preu promocional de 29€/mes (vs 39€ normal) pels primers 50 subscriptors.\n\n## Per què\nEl setembre és el mes amb més volum d'informes. El descompte accelera adopció en els primers 90 dies.\n\n## Com\n1. Activar Stripe per pagaments\n2. Configurar paywall a la web\n3. Crear landing page específica de llançament\n4. Newsletter especial de llançament\n5. Posts a LinkedIn i Twitter/X\n6. Email als primers 100 subscriptors gratis\n\n## Acceptance criteria\n- [ ] Stripe operatiu\n- [ ] Landing page publicada\n- [ ] Mínim 30 subscriptors premium en 30 dies\n\n## Persona\n@PaoloGLM (operativa) + @criteri-esg-bot (tecnica: Stripe + landing)",
        "labels": ["P3-Normal", "operativa", "tecnica", "finances", "comunicacio"],
        "milestone": M_FASE2,
        "assignee": PAOLO,
        "due_date": "2026-09-30",
    },
    {
        "title": "[P3] Crear 1r dossier temàtic (EcoVadis Bronze→Or)",
        "body": "## Què\nCrear el primer dossier temàtic Premium: 'Com pujar d'EcoVadis Bronze a Or en 12 mesos'.\n\n## Format\nPDF llarg (15-25 pàgines) amb:\n- Anàlisi dels 4 canvis clau d'EcoVadis 2026\n- 15 accions amb impacte alt/baix\n- Matriu esforç-impacte\n- Plantilles: política supply chain, code of conduct, grievance log\n- Cross-reference amb CSRD, B Corp i GRI\n- Checklist final\n\n## Per què\nEls dossiers són una de les 4 fonts d'ingrés. EcoVadis és la certificació més usada a Espanya.\n\n## Acceptance criteria\n- [ ] PDF de 15-25 pàgines creat\n- [ ] Publicat a la web amb preu 79-149€\n- [ ] Pàgina de venda (sales page) creada\n- [ ] Mínim 5 vendes en 30 dies\n\n## Persona\n@criteri-esg-bot (tecnica)",
        "labels": ["P3-Normal", "tecnica", "contingut", "finances"],
        "milestone": M_FASE2,
        "assignee": PAOLO,
        "due_date": "2026-10-15",
    },
    {
        "title": "[P3] Webinar mensual sobre 3 informes clau del mes",
        "body": "## Què\nWebinar gratuït mensual (45 min) on es presenten els 3 informes més rellevants del mes.\n\n## Per què\n- Generació de leads qualificats\n- Demostració de valor del producte\n- Posicionament com a expert\n\n## Com\n1. Triar 3 informes del mes\n2. Preparar PPT (fer servir plantilla Criteri ESG)\n3. Streaming via Zoom o YouTube Live\n4. Gravar i publicar a YouTube + web\n5. Newsletter amb resum + link al recording\n\n## Acceptance criteria\n- [ ] Webinar mensual programat (primer dijous del mes)\n- [ ] Mínim 30 registres per webinar\n- [ ] Recording publicat\n\n## Persona\n@PaoloGLM (operativa - presenta el webinar)",
        "labels": ["P3-Normal", "operativa", "comunicacio", "contingut"],
        "milestone": M_FASE2,
        "assignee": PAOLO,
        "due_date": "2026-10-31",
    },
    {
        "title": "[P3] Pipeline Nivell 2 (RSS automàtic + notificacions)",
        "body": "## Què\nImplementar el pipeline Nivell 2 d'automatització descrit al document `02-PRODUCTE.md`:\n- Crawler RSS per a les 30 fonts seleccionades\n- Filtre de rellevància amb LLM (GLM via z-ai-web-dev-sdk)\n- Notificacions per Slack/email quan es detecta un informe rellevant\n\n## Per què\nReduir la càrrega manual. Actualment el Nivell 1 (manual) funciona però no escala.\n\n## Com\n- Python + Scrapy per al crawler\n- GLM per al filtre de rellevància\n- Slack webhook per notificacions\n\n## Acceptance criteria\n- [ ] Crawler operatiu per a 30 fonts\n- [ ] Filtre LLM amb 80%+ precisió\n- [ ] Notificacions Slack funcionant\n- [ ] Cost API < 30€/mes\n\n## Persona\n@criteri-esg-bot (tecnica)",
        "labels": ["P3-Normal", "tecnica", "operacions"],
        "milestone": M_FASE2,
        "assignee": PAOLO,
        "due_date": "2026-11-30",
    },
    {
        "title": "[P3] Outreach 50 consultories ESG (ES, FR)",
        "body": "## Què\nContactar directament 50 consultories ESG petites-mitjanes a Espanya i França per oferir pla equip B2B.\n\n## Per què\nLes consultories ESG són el buyer persona Ultra. Una sola consulta contractant el pla equip (199€/mes) = 2.400€/any recurrents.\n\n## Com\n1. Llistat de 50 consultories (LinkedIn + directori ANTHEISI + Anthesis)\n2. Email personalitzat per a cadascuna\n3. Proposta: 1 mes gratis + webinar per al seu equip\n4. Follow-up en 1 setmana\n5. Reunió de 30 min per presentar el producte\n\n## Acceptance criteria\n- [ ] 50 emails enviats\n- [ ] Mínim 10 respostes\n- [ ] Mínim 5 reunions\n- [ ] Mínim 2 contractes B2B signats\n\n## Persona\n@PaoloGLM (operativa)",
        "labels": ["P3-Normal", "operativa", "comunicacio", "mercat", "finances"],
        "milestone": M_FASE2,
        "assignee": PAOLO,
        "due_date": "2026-12-15",
    },
]

# Funcio per crear un issue
def create_issue(issue_data):
    # GitHub no accepta due_date directament als issues. Es pot posar al body.
    body = issue_data["body"]
    if "due_date" in issue_data:
        body += f"\n\n---\n\n**Data limit:** {issue_data['due_date']}"
    
    payload = {
        "title": issue_data["title"],
        "body": body,
        "labels": issue_data["labels"],
        "milestone": issue_data["milestone"],
        "assignee": issue_data["assignee"],
    }
    
    req = urllib.request.Request(
        API,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode("utf-8"))
            return result.get("number"), result.get("html_url"), None
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return None, None, f"HTTP {e.code}: {error_body}"
    except Exception as e:
        return None, None, str(e)


# Crear tots els issues
print(f"Creant {len(issues)} issues...")
print("=" * 70)

created = 0
failed = 0
for i, issue in enumerate(issues, 1):
    print(f"\n[{i}/{len(issues)}] {issue['title']}")
    number, url, error = create_issue(issue)
    if number:
        print(f"  ✓ Issue #{number} creat: {url}")
        created += 1
    else:
        print(f"  ✗ Error: {error}")
        failed += 1

print("\n" + "=" * 70)
print(f"RESULTAT: {created} creats, {failed} fallats")
