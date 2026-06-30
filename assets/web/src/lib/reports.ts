// Catàleg d'informes — versió amb 7 blocs complets per als 3 primers informes processats
// + 7 informes amb resum bàsic (resta del catàleg)

export type ReportBlock = {
  type: "fitxa" | "resum" | "dades" | "implicacions" | "connexions" | "accions" | "xref";
  title: string;
  content: string;
  data?: { value: string; label: string; page?: string }[];
  actions?: { num: string; title: string; desc: string; effort: string; impact: string }[];
  xrefs?: { framework: string; criterion: string; impact: string }[];
  connections?: { type: string; target: string; desc: string }[];
  implications?: { actor: string; body: string }[];
};

export type Report = {
  slug: string;
  title: string;
  institution: string;
  date: string;
  pages: number;
  type: "regulatory" | "framework" | "rating" | "industry" | "official";
  scope: "CAT" | "ES" | "EU" | "GLOBAL";
  tags: string[];
  certifications: string[];
  summary: string;
  url: string;
  processed?: boolean; // true si té els 7 blocs complets
  blocks?: ReportBlock[];
};

export const reports: Report[] = [
  // =====================================================
  // INFORME 1: Forética Tendencias ESG 2026 (PROCESAT)
  // =====================================================
  {
    slug: "foretica-tendencias-esg-2026",
    title: "Tendencias ESG 2026: cinco claves para la década decisiva",
    institution: "Forética",
    date: "2026-02-01",
    pages: 10,
    type: "framework",
    scope: "ES",
    tags: ["Tendencias", "Competitividad", "Finanzas sostenibles", "Social", "Clima", "Agua"],
    certifications: ["SGE 21", "CSRD", "SFDR", "TCFD"],
    summary:
      "Forética identifica 5 tendències ESG per al 2026: la sostenibilitat com a estratègia de competitivitat, el reajustament dels mercats financers ESG, les fractures socials, l'acomiadament a l'1.5°C, i l'aigua com a risc central del segle XXI.",
    url: "https://foretica.org/wp-content/uploads/2026/02/2026-ESG-Trends_Foretica.pdf",
    processed: true,
    blocks: [
      {
        type: "fitxa",
        title: "1. Fitxa tècnica",
        content:
          "Institució: Forética | Data: febrer 2026 | Tipus: Informe de tendències | Pàgines: 10 | Llengua: anglès (traduït de l'espanyol) | URL: foretica.org",
      },
      {
        type: "resum",
        title: "2. Resum executiu",
        content:
          "Forética analitza 5 tendències ESG que marcaran l'agenda 2026 i la resta de la dècada. (1) Europa arriba al final d'un procés de 'deflació regulatoria' en sostenibilitat: la UE ha recalibrat el marc regulador per reduir complexitat, però la incertesa ha creat polarització entre maximalistes i reduccionistes. (2) Els mercats financers ESG han patit tres cops: inseguretat geopolítica, hostilitat política (MAGA anti-ESG als EUA) i el boom energètic de la IA. Tot i això, els fons sostenibles europeus mantenen el 85% de l'AUM global. (3) Les fractures socials s'agreugen: creixement a la meitat del ritme dels 60s, desigualtat intergeneracional, crisi d'habitatge. Espanya n'és un exemple paradigmàtic. (4) L'objectiu d'1.5°C és ja inassolible; amb polítiques actuals anem cap a 3°C. (5) L'aigua emergeix com a risc central: 2.000 milions sense accés segur, el 91% de pèrdues per desastres naturals el 2024 van ser relacionades amb l'aigua.",
      },
      {
        type: "dades",
        title: "3. 5 dades clau",
        data: [
          { value: "85%", label: "dels fons sostenibles globals (AUM) són europeus", page: "Trend #2" },
          { value: "+17%", label: "volum d'actius sostenibles respecte fa un any, malgrat les sortides", page: "Trend #2" },
          { value: "3°C", label: "escalfament projectat amb polítiques actuals (vs 1.5°C objectiu)", page: "Trend #4" },
          { value: "2.000M", label: "persones sense accés a aigua potable segura", page: "Trend #5" },
          { value: "91%", label: "de pèrdues per desastres naturals el 2024 relacionades amb l'aigua", page: "Trend #5" },
        ],
      },
      {
        type: "implicacions",
        title: "4. Implicacions",
        implications: [
          {
            actor: "Empreses",
            body: "La sostenibilitat ha de passar de càrrega de compliance a plataforma de competitivitat. Les empreses han d'orientar la sostenibilitat cap a la creació de valor, reforçar models de negoci de baix impacte i energia independent, i minimitzar la vulnerabilitat geopolítica a les cadenes de subministrament. L'aigua ha de passar de preocupació operativa a factor d'risc estratègic.",
          },
          {
            actor: "Reguladors",
            body: "La 'deflació regulatoria' europea necessita estabilitzar-se. La incertesa entre cicles polítics i cicles d'implementació corporativa és el principal problema. Cal alinear la pressió reguladora amb la capacitat real d'implementació de les pimes.",
          },
          {
            actor: "Ciutadans",
            body: "Les fractures socials (joves, habitatge, pobresa infantil) s'agreugen. L'1.5°C ja no és assolible i els impactes del canvi climàtic (especialment relacionats amb l'aigua) afectaran directament la salut, infraestructures i activitat econòmica.",
          },
        ],
      },
      {
        type: "connexions",
        title: "5. Connexions",
        connections: [
          {
            type: "Evolució",
            target: "Revisió ESRS (maig 2026)",
            desc: "La 'deflació regulatoria' que Forética identifica com a Trend #1 es materialitza en la revisió dels ESRS que redueix un 61% dels datapoints obligatoris.",
          },
          {
            type: "Complement",
            target: "WEF Global Risks Report 2026",
            desc: "El WEF identifica els mateixos riscos estructurals (geopolítica, clima, desigualtat) des d'una perspectiva global, mentre Forética ho fa des de la perspectiva empresarial espanyola.",
          },
          {
            type: "Contradicció",
            target: "Boom IA i transició energètica",
            desc: "L'informe assenyala que el boom de la IA està desviant capital d'inversió verda cap a centres de dades i semiconductors, creant tensió entre dues prioritats ESG.",
          },
        ],
      },
      {
        type: "accions",
        title: "6. Accions recomanades",
        actions: [
          {
            num: "01",
            title: "Reorientar la sostenibilitat cap a la competitivitat",
            desc: "Passar de veure la sostenibilitat com a compliance a veure-la com a plataforma de creació de valor. Auditar quines inversions ESG generen avantatge competitiu real.",
            effort: "Mitjà",
            impact: "Alt",
          },
          {
            num: "02",
            title: "Reassessir la materialitat de l'aigua",
            desc: "L'aigua ha de passar de preocupació operativa a factor d'risc estratègic. Mapejar la cadena de valor completa i desenvolupar plans de contingència per a escenarios extrems.",
            effort: "Alt",
            impact: "Alt",
          },
          {
            num: "03",
            title: "Prioritzar adaptació climàtica",
            desc: "Amb 3°C projectats, l'adaptació ha de ser pilar central. Assegurances, infraestructures resilients i preparació per a esdeveniments extrems són prioritaris abans que els costos escalin.",
            effort: "Alt",
            impact: "Alt",
          },
          {
            num: "04",
            title: "Invertir en reskilling i joventut",
            desc: "Les fractures socials (especialment la desigualtat intergeneracional) amenacen la cohesió. Les empreses han d'invertir en formació a gran escala i prioritzar joventut, habitatge i pobresa infantil.",
            effort: "Mitjà",
            impact: "Mitjà",
          },
        ],
      },
      {
        type: "xref",
        title: "7. Cross-reference amb certificacions",
        xrefs: [
          {
            framework: "SGE 21",
            criterion: "Gestió ètica i socialment responsable",
            impact: "Forética és l'organització darrere l'SGE 21. Aquest informe reforça la necessitat d'integrar la sostenibilitat com a estratègia competitiva, alineat amb el capítol de governança de l'SGE 21.",
          },
          {
            framework: "CSRD/ESRS",
            criterion: "Materialitat doble",
            impact: "La Trend #1 (deflació regulatoria) afecta directament com les empreses implementen la CSRD. La incertesa reguladora fa més difícil el double materiality assessment.",
          },
          {
            framework: "SFDR",
            criterion: "Fons Article 8/9",
            impact: "La Trend #2 (mercats financers) mostra que els fons sostenibles europeus mantenen el 85% de l'AUM global, però els EUA han tingut 12 trimestres consecutius de sortides.",
          },
          {
            framework: "TCFD",
            criterion: "Risc físic i de transició",
            impact: "La Trend #4 (acomiadament a 1.5°C) i la Trend #5 (aigua) afecten directament l'avaluació de riscos físics que exigeix TCFD. Les empreses han d'actualitzar els seus escenaris.",
          },
        ],
      },
    ],
  },

  // =====================================================
  // INFORME 2: WEF Global Risks Report 2026 (PROCESAT)
  // =====================================================
  {
    slug: "wef-global-risks-2026",
    title: "Global Risks Report 2026: The Age of Competition",
    institution: "World Economic Forum (WEF)",
    date: "2026-01-15",
    pages: 102,
    type: "official",
    scope: "GLOBAL",
    tags: ["Riscos globals", "Geopolítica", "Clima", "IA", "Competència"],
    certifications: ["TCFD", "CSRD", "GRI"],
    summary:
      "El WEF identifica una nova era de competència multipolar sense multilateralisme. Els riscos es comparen i s'amplifiquen: guerres cinètiques, armes econòmiques, fragmentació social, IA sense governança, i infraestructures amenaçades. 1.300 experts consultats.",
    url: "https://reports.weforum.org/docs/WEF_Global_Risks_Report_2026.pdf",
    processed: true,
    blocks: [
      {
        type: "fitxa",
        title: "1. Fitxa tècnica",
        content:
          "Institució: World Economic Forum | Data: gener 2026 | Tipus: Informe de riscos globals | Pàgines: 102 | Llengua: anglès | URL: weforum.org",
      },
      {
        type: "resum",
        title: "2. Resum executiu",
        content:
          "El 21è informe del WEF explora com un nou ordre competitiu està prenent forma i el seu impacte en múltiples dominis de risc simultanis. S'identifiquen tres horitzons: el món el 2026 (a la vora del precipici), el camí cap al 2028 (riscos que es combinen), i el camí cap al 2036 (cair?. Els riscos principals a curt termini (2 anys) inclouen conflictes armats, desinformació, extrema meteorologia, polarització social i inflació. A llarg termini (10 anys), els riscos dominants són canvi climàtic, pèrdua de biodiversitat, escassetat de recursos crítics, IA descontrolada i col·lapse d'infraestructures. L'informe subratlla que la competència entre potències està substituint la cooperació multilateral, dificultant la gestió d'aquests riscos globals. Aquesta és una informació genèrica, no específicament ESG, però els riscos identificats tenen implicacions directes per a les empreses en matèria de sostenibilitat, governança i responsabilitat social.",
      },
      {
        type: "dades",
        title: "3. 5 dades clau",
        data: [
          { value: "1.300+", label: "experts consultats per al Global Risks Perception Survey", page: "Overview" },
          { value: "Top 3", label: "riscos a 2 anys: conflicte armat, desinformació, meteorologia extrema", page: "Ch.1" },
          { value: "Top 3", label: "riscos a 10 anys: canvi climàtic, biodiversitat, escassetat de recursos", page: "Ch.1" },
          { value: "3 domains", label: "competència multipolar sense multilateralisme, valors en guerra, IA sense governança", page: "Ch.2" },
          { value: "2026", label: "any marcat per 'riscos que es combinen' (compounding risks)", page: "Ch.1.2" },
        ],
      },
      {
        type: "implicacions",
        title: "4. Implicacions",
        implications: [
          {
            actor: "Empreses",
            body: "Les empreses han d'incorporar anàlisi de riscos geopolítics i climàtics en la seva estratègia. La competència entre EUA i Xina afecta cadenes de subministrament, accés a minerals crítics i tecnologies. La IA descontrolada és un risc operacional i reputacional. Cal planificació d'escenarios i resiliència d'infraestructures.",
          },
          {
            actor: "Reguladors",
            body: "La manca de cooperació multilateral dificulta gestionar riscos globals. La fragmentació regulatòria (EUA vs UE vs Xina) augmenta els costos de compliance. Cal diàleg internacional sobre governança de la IA i finançament climàtic.",
          },
          {
            actor: "Ciutadans",
            body: "La polarització social i la desinformació amenacen la confiança en institucions. Els impactes del canvi climàtic (esdeveniments extrems, escassetat d'aigua) afecten directament la vida quotidiana. La desigualtat econòmica s'agreuja amb la competència global.",
          },
        ],
      },
      {
        type: "connexions",
        title: "5. Connexions",
        connections: [
          {
            type: "Complement",
            target: "Forética Tendencias ESG 2026",
            desc: "Forética analitza els mateixos riscos des de la perspectiva empresarial espanyola. El WEF ho fa des de la perspectiva global. Junts ofereixen una visió completa macro + micro.",
          },
          {
            type: "Evolució",
            target: "WEF Global Risks Report 2025",
            desc: "El concepte de 'policrisi' introduït fa 3 anys evoluciona cap a 'era de competència'. Els riscos ja no es només es combinen, sinó que es converteixen en armes estratègiques.",
          },
          {
            type: "Complement",
            target: "Oxfam Rule of the Rich 2026",
            desc: "Oxfam documenta la desigualtat extrema que el WEF identifica com a factor de polarització social i risc polític.",
          },
        ],
      },
      {
        type: "accions",
        title: "6. Accions recomanades",
        actions: [
          {
            num: "01",
            title: "Integrar anàlisi de riscos geopolítics",
            desc: "Les empreses han de mapejar la seva exposició a la competència EUA-Xina: cadenes de subministrament, minerals crítics, tecnologies. Desenvolupar plans de contingència.",
            effort: "Alt",
            impact: "Alt",
          },
          {
            num: "02",
            title: "Enfortir la resiliència d'infraestructures",
            desc: "Amb esdeveniments extrems creixents, cal invertir en infraestructures resilients, plans de continuïtat de negoci i assegurances adequades.",
            effort: "Alt",
            impact: "Alt",
          },
          {
            num: "03",
            title: "Desenvolupar governança d'IA",
            desc: "La IA descontrolada és un dels riscos principals. Les empreses han d'establir marcs de governança d'IA, policies d'ús ètic i plans de mitigació de riscos.",
            effort: "Mitjà",
            impact: "Alt",
          },
        ],
      },
      {
        type: "xref",
        title: "7. Cross-reference amb certificacions",
        xrefs: [
          {
            framework: "TCFD",
            criterion: "Risc físic i de transició",
            impact: "Els riscos climàtics identificats pel WEF (meteorologia extrema, escassetat de recursos) han d'incorporar-se als escenaris TCFD de les empreses.",
          },
          {
            framework: "CSRD/ESRS",
            criterion: "Materialitat doble",
            impact: "Els riscos globals del WEF són materialment rellevants per al double materiality assessment. Especialment riscos geopolítics i de IA.",
          },
          {
            framework: "GRI",
            criterion: "Universal 2 + 300",
            impact: "Els riscos identificats afecten múltiples categories GRI: emissions (300), aigua (303), biodiversitat (304), proveïdors (308).",
          },
        ],
      },
    ],
  },

  // =====================================================
  // INFORME 3: Oxfam Rule of the Rich 2026 (PROCESAT)
  // =====================================================
  {
    slug: "oxfam-rule-rich-2026",
    title: "Resisting the Rule of the Rich: Protecting freedom from billionaire power",
    institution: "Oxfam International",
    date: "2026-01-19",
    pages: 69,
    type: "official",
    scope: "GLOBAL",
    tags: ["Desigualtat", "Bilionaris", "Democràcia", "Ètica empresarial", "Poder polític"],
    certifications: ["B Corp", "UN Global Compact", "GRI"],
    summary:
      "Oxfam documenta com la desigualtat extrema s'ha convertit en una amenaça per a la democràcia. Els bilionaris utilitzen la seva riquesa per comprar política, mitjans i justícia. L'informe proposa 3 vies: reduir desigualtat econòmica, frenar el poder polític dels super-rich, i construir el poder polític de la majoria.",
    url: "https://assets.oxfamnovib.nl/downloads/Resisting-the-Rule-of-the-Rich-rapport-2026.pdf",
    processed: true,
    blocks: [
      {
        type: "fitxa",
        title: "1. Fitxa tècnica",
        content:
          "Institució: Oxfam International | Data: 19 gener 2026 | Tipus: Informe de desigualtat global | Pàgines: 69 | Llengua: anglès | URL: oxfam.org",
      },
      {
        type: "resum",
        title: "2. Resum executiu",
        content:
          "L'informe d'Oxfam 2026 se centra en com la desigualtat extrema està destruint la democràcia. Els bilionaris han augmentat la seva riquesa a un ritme sense precedents mentre milions de persones enfronten pobresa i fam. L'informe documenta tres mecanismes pels quals els super-rich exerceixen poder polític: (1) comprar accés polític mitjançant donacions i lobby, (2) legitimar el seu poder a través del control de mitjans de comunicació, i (3) ocupar directament càrrecs polítics i institucionals. Alhora, els governs estan reprimint protestes contra la desigualtat i l'austeritat. L'informe proposa tres vies per construir un futur més igualitari: reduir radicalment la desigualtat econòmica (impostos a la riquesa), frenar el poder polític dels super-rich (regulació de lobby i finançament polític), i construir el poder polític de la majoria (protecció de drets laborals i drets civils). Aquest informe no és específicament ESG, però té implicacions ètiques directes per a la governança corporativa i la responsabilitat social empresarial.",
      },
      {
        type: "dades",
        title: "3. 5 dades clau",
        data: [
          { value: "Dècada", label: "record per als bilionaris: la seva riquesa ha crescut més que mai", page: "Ch.1.1" },
          { value: "3 mecanismes", label: "de poder polític: comprar política, controlar mitjans, ocupar càrrecs", page: "Ch.2" },
          { value: "Repressió", label: "creixent de protestes contra desigualtat i austeritat arreu del món", page: "Ch.3.2" },
          { value: "3 vies", label: "de solució: reduir desigualtat, frenar poder polític, construir poder popular", page: "Ch.4" },
          { value: "Oligarquia", label: "o democràcia: l'informe presenta aquesta disjuntiva com a fonamental", page: "Exec. Summary" },
        ],
      },
      {
        type: "implicacions",
        title: "4. Implicacions",
        implications: [
          {
            actor: "Empreses",
            body: "Les empreses han de revisar la seva governança: transparencia en lobby i finançament polític, politiques d'ètica en donacions, i revisió de l'impacte en desigualtat. La 'G' de ESG (governança) ha d'incloure la lluita contra la captura regulatòria. Les empreses amb bilionaris al capdavant han de ser especialment transparents.",
          },
          {
            actor: "Reguladors",
            body: "Cal regulació estricta del finançament polític, lobby i propietat de mitjans. Els impostos a la riquesa i la lluita contra els paradisos fiscales són urgents. La protecció de drets laborals i drets de protesta és fonamental per a la democràcia econòmica.",
          },
          {
            actor: "Ciutadans",
            body: "La desigualtat extrema no és només un problema econòmic, sinó una amenaça a la democràcia. La repressió de protestes i la captura de mitjans redueixen la capacitat de participació ciutadana. Cal mobilització i demanda col·lectiva de canvi.",
          },
        ],
      },
      {
        type: "connexions",
        title: "5. Connexions",
        connections: [
          {
            type: "Complement",
            target: "WEF Global Risks Report 2026",
            desc: "El WEF identifica la polarització social com a risc principal. Oxfam documenta la causa arrel: desigualtat extrema i captura política pels super-rich.",
          },
          {
            type: "Complement",
            target: "Forética Tendencias ESG 2026 (Trend #3)",
            desc: "Forética identifica les fractures socials com a tendència clau. Oxfam proporciona el context global: la desigualtat està destruint la cohesió social i la democràcia.",
          },
          {
            type: "Evolució",
            target: "Oxfam Inequality Inc. (2024)",
            desc: "L'informe del 2024 se centrava en el monopoli corporatiu. El 2026 va un pas més enllà: documenta com la riquesa extrema es converteix en poder polític que s'autoperpetúa.",
          },
        ],
      },
      {
        type: "accions",
        title: "6. Accions recomanades",
        actions: [
          {
            num: "01",
            title: "Auditar la governança política de l'empresa",
            desc: "Revisar totes les activitats de lobby, donacions polítiques i finançament. Publicar transparencia radical. Implementar politiques d'ètica que prohibeixin la captura regulatòria.",
            effort: "Baix",
            impact: "Alt",
          },
          {
            num: "02",
            title: "Revisar l'impacte en desigualtat",
            desc: "Analitzar com les pràctiques de l'empresa (salarios, cadenes de subministrament, polítiques fiscals) contribueixen a la desigualtat. Implementar living wage i auditories de proveïdors.",
            effort: "Mitjà",
            impact: "Alt",
          },
          {
            num: "03",
            title: "Enfortir la 'G' de ESG amb perspectiva democràtica",
            desc: "La governança corporativa ha d'incloure criteris de democràcia econòmica: participació de treballadors en decisions, transparencia fiscal, i compromís amb l'ètica Kantiana de tractar les persones com a fins, no com a mitjans.",
            effort: "Alt",
            impact: "Alt",
          },
        ],
      },
      {
        type: "xref",
        title: "7. Cross-reference amb certificacions",
        xrefs: [
          {
            framework: "B Corp",
            criterion: "Governance + Community",
            impact: "L'informe d'Oxfam reforça la necessitat de la certificació B Corp: governança transparent, propietat responsable, i compromís amb la comunitat. Les empreses B Corp estan millor posicionades per resistir la captura política.",
          },
          {
            framework: "UN Global Compact",
            criterion: "Principi 10: Anti-corrupció",
            impact: "La captura política pels bilionaris és una forma de corrupció sistèmica. El principi 10 contra la corrupció del UN Global Compact és directament rellevant.",
          },
          {
            framework: "GRI",
            criterion: "Universal 2: Governança i ètica",
            impact: "Els criteris GRI sobre governança, ètica i transparencia (201-205) són directament afectats per les pràctiques de lobby i finançament polític que Oxfam documenta.",
          },
        ],
      },
    ],
  },

  // =====================================================
  // RESTA DEL CATÀLEG (sense processar amb 7 blocs)
  // =====================================================
  {
    slug: "revisio-esrs-maig-2026",
    title: "Revisió dels ESRS: simplificació del CSRD",
    institution: "Comissió Europea (DG FISMA)",
    date: "2026-05-06",
    pages: 47,
    type: "regulatory",
    scope: "EU",
    tags: ["CSRD", "Reporting", "Estalvi de costos"],
    certifications: ["EcoVadis", "B Corp", "MSCI ESG", "GRI"],
    summary:
      "La Comissió Europea redueix un 61% els datapoints obligatoris del reporting de sostenibilitat. Estalvi estimat de 3.700M€ en 5 anys.",
    url: "https://finance.ec.europa.eu/news/commission-seeks-feedback-revised-sustainability-reporting-standards-2026-05-06_en",
  },
  {
    slug: "ecb-climate-risk-2026",
    title: "Climate risk stress test: EU banking system",
    institution: "Banc Central Europeu (BCE)",
    date: "2026-05-22",
    pages: 62,
    type: "official",
    scope: "EU",
    tags: ["Banca", "Risc climàtic", "Stress test"],
    certifications: ["MSCI ESG", "TCFD"],
    summary:
      "El 100% dels bancs significatius de la UE integren el risc climàtic als stress tests, però es mantenen gaps clau en dades Scope 3.",
    url: "https://www.ecb.europa.eu/press/financial-stability-publications/macroprudential-bulletin/html/ecb.mpbu202511_04.en.html",
  },
  {
    slug: "efrag-work-programme-2026",
    title: "EFRAG Sustainability Reporting Work Programme 2026",
    institution: "EFRAG",
    date: "2026-02-12",
    pages: 38,
    type: "framework",
    scope: "EU",
    tags: ["ESRS", "Prioritats estratègiques", "Reporting"],
    certifications: ["GRI", "CSRD"],
    summary:
      "L'EFRAG defineix les seves prioritats estratègiques per al 2026: sectorial standards, simplificació, interoperabilitat amb GRI i ISSB.",
    url: "https://www.efrag.org/en/news-and-calendar/news/efrag-submits-its-sustainability-reporting-work-programme-2026-to-the-european-commission",
  },
  {
    slug: "ecovadis-methodology-q1-2026",
    title: "EcoVadis Methodology Updates Q1 2026",
    institution: "EcoVadis",
    date: "2026-04-15",
    pages: 28,
    type: "rating",
    scope: "GLOBAL",
    tags: ["EcoVadis", "Methodology", "Supplier CSR"],
    certifications: ["EcoVadis"],
    summary:
      "9 canvis metodològics entre abril i maig 2026. Es refuerça el reconeixement a empreses que reporten amb GRI Universal Standards.",
    url: "https://support.ecovadis.com/hc/en-us/articles/34621845310994-Methodology-Updates-Q1-2026",
  },
  {
    slug: "tnfd-status-report-2026",
    title: "TNFD 2026 Status Report",
    institution: "Taskforce on Nature-related Financial Disclosures",
    date: "2026-06-10",
    pages: 54,
    type: "framework",
    scope: "GLOBAL",
    tags: ["Biodiversitat", "Natura", "Reporting"],
    certifications: ["TNFD", "GRI", "ISSB"],
    summary:
      "Global stocktake del progrés del mercat en avaluació i reporting de riscos relacionats amb natura. Adopció creixent però desigual entre sectors.",
    url: "https://tnfd.global",
  },
  {
    slug: "bcorp-new-standards-2026",
    title: "B Lab Standards V2.1: nova era per a B Corps",
    institution: "B Lab Global",
    date: "2026-01-15",
    pages: 41,
    type: "framework",
    scope: "GLOBAL",
    tags: ["B Corp", "Certificació", "Ètica empresarial"],
    certifications: ["B Corp"],
    summary:
      "A partir de gener 2026, B Lab comença recertificacions amb els nous Standards V2.1. 9 empreses pioneres ja certificant.",
    url: "https://www.bcorporation.net/standards/performance-requirements",
  },
  {
    slug: "csddd-omnibus-març-2026",
    title: "CSDDD: modificacions Omnibus I definitives",
    institution: "Comissió Europea (DG JUST)",
    date: "2026-03-18",
    pages: 35,
    type: "regulatory",
    scope: "EU",
    tags: ["CSDDD", "Due diligence", "Drets humans"],
    certifications: ["CSDDD", "UN Global Compact"],
    summary:
      "L'Omnibus I Amending Directive entra en vigor el 18 març 2026. Estreny l'abast de la due diligence obligatòria a la cadena de subministrament.",
    url: "https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2026/corporate-sustainability-due-diligence-directive-amendments-under-omnibus-i-finalised",
  },
  {
    slug: "iea-global-energy-review-2026",
    title: "Global Energy Review 2026",
    institution: "International Energy Agency (IEA)",
    date: "2026-03-15",
    pages: 78,
    type: "industry",
    scope: "GLOBAL",
    tags: ["Energia", "Emissions", "Transició"],
    certifications: ["CDP", "TCFD"],
    summary:
      "La demanda elèctrica global creix un 4% liderada per renovables i Xina. Les renovables cobreixen el 70% del creixement de demanda.",
    url: "https://www.iea.org/reports/global-energy-review-2026",
  },
  {
    slug: "eu-taxonomy-delegated-act-2026",
    title: "EU Taxonomy: Delegated Act de simplificació",
    institution: "Comissió Europea (DG FISMA)",
    date: "2026-01-28",
    pages: 32,
    type: "regulatory",
    scope: "EU",
    tags: ["Taxonomia UE", "Reporting", "Finances sostenibles"],
    certifications: ["SFDR", "CSRD"],
    summary:
      "El Delegated Act entra en vigor el 28 gener 2026 amb aplicació retrospectiva des de 1 gener 2026. Simplifica el reporting de Taxonomia.",
    url: "https://sustainablefutures.linklaters.com/post/102m1i3/eu-delegated-act-on-simplifying-taxonomy-reporting-published-in-the-official-jou",
  },
  {
    slug: "europe-sustainable-development-2026",
    title: "Europe Sustainable Development Report 2026",
    institution: "SDSN / SDSN Europe",
    date: "2026-04-22",
    pages: 95,
    type: "official",
    scope: "EU",
    tags: ["ODS", "Comparativa", "Estats membres"],
    certifications: ["UN Global Compact", "SDG Compass"],
    summary:
      "7a edició. Avalua el progrés de 41 països europeus en els ODS. Estancament en ODS 13 (clima) i 12 (consum responsable).",
    url: "https://sdgtransformationcenter.org/reports/europe-sustainable-development-report-2026",
  },
];

// Helpers
export function getScopeLabel(scope: Report["scope"]): string {
  const labels: Record<Report["scope"], string> = {
    CAT: "Catalunya",
    ES: "Espanya",
    EU: "Europa",
    GLOBAL: "Global",
  };
  return labels[scope] ?? scope;
}

export function getTypeLabel(type: Report["type"]): string {
  const labels: Record<Report["type"], string> = {
    regulatory: "Regulador",
    framework: "Framework",
    rating: "Rating",
    industry: "Sectorial",
    official: "Oficial",
  };
  return labels[type] ?? type;
}

export function formatDate(isoDate: string, lang: "ca" | "es" = "ca"): string {
  const date = new Date(isoDate);
  const locale = lang === "es" ? "es-ES" : "ca-ES";
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getMonthsAgo(isoDate: string): number {
  const date = new Date(isoDate);
  const now = new Date();
  const months =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());
  return Math.max(0, months);
}

export function isFreeAccess(isoDate: string): boolean {
  return getMonthsAgo(isoDate) >= 6;
}
