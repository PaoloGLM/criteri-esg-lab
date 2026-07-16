// Contingut complet dels 10 informes del catàleg de Criteri ESG
// Tots els blocs (semàfor, dades clau, resum, implicacions, més enllà,
// connexions, accions, cross-references) en català i castellà.

import type { ReportBlock } from "./reports";

// -----------------------------------------------------------------------------
// 1. revisio-esrs-maig-2026 — Revisió dels ESRS: simplificació del CSRD
// -----------------------------------------------------------------------------

const revisioEsrs_ca: ReportBlock = {
  semafor: {
    grade: "C",
    gradeLabel: "Feble metodològicament",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Esmentat",
        note: "Es manté l'obligació però es simplifica la granularitat de categories upstream i downstream.",
      },
      {
        name: "Termes temporals",
        status: "groc",
        label: "Esmentat",
        note: "Aplicació per fases, però sense comparabilitat retroactiva garantida amb exercicis anteriors.",
      },
      {
        name: "Fonts independents",
        status: "verd",
        label: "Quantificat",
        note: "Comissió Europea amb auditories d'impacte, consultes públiques i avaluació del Better Regulation Toolbox.",
      },
      {
        name: "Granularitat",
        status: "vermell",
        label: "Ignorat",
        note: "La reducció del 61% de datapoints elimina granularitat sectorial i comparabilitat entre parells.",
      },
      {
        name: "Verificació externa",
        status: "groc",
        label: "Esmentat",
        note: "Es manté l'assurance limitat; no es passa a assurance raonable com demanaven els inversors.",
      },
    ],
  },
  dadesClau: [
    { value: "61%", label: "reducció de datapoints obligatoris", page: "p. 12" },
    { value: "3.700M€", label: "estalvi estimat en 5 anys per a les empreses", page: "p. 8" },
    { value: "1.144", label: "datapoints eliminats del total original", page: "p. 14" },
    { value: "2027", label: "any d'aplicació per a les primeres empreses afectades", page: "p. 21" },
    { value: "5 anys", label: "període de transició addicional per a pimes", page: "p. 27" },
  ],
  resumExecutiu:
    "La Comissió Europea publica la revisió dels European Sustainability Reporting Standards (ESRS) com a peça central de l'Omnibus I de simplificació. La proposta redueix un 61% els datapoints obligatoris —prop de 1.144 sobre el total— i modular la doble materialitat per fer-la més operativa per a les empreses de mida mitjana. L'executiu comunitari estima un estalvi acumulat de 3.700 milions d'euros en cinc anys, principalment en costos de recollida de dades, assurance extern i sistemes de reporting. La revisió manté l'arquitectura de dotze estàndards (dos transversals i deu temàtics) però elimina exigències considerades redundants amb altres marcs europeus (Taxonomia UE, SFDR) i amb GRI. S'introdueix un sistema de 'datapoints voluntaris' per a aquells que vulguin mantenir la granularitat anterior, però sense cap incentiu regulador associat. La cronologia preveu aplicació progressiva a partir de l'exercici 2027 per a les grans empreses de l'article 19a, amb una transició allargada fins al 2032 per a les de l'article 19b. Els inversors institucionals i la societat civil han advertit que la simplificació pot comprometre la comparabilitat entre parells i la traçabilitat de la informació Scope 3. L'EFRAG, per la seva banda, es queda sense mandat per desenvolupar els sectoral standards previstos. En resum: menys càrrega administrativa, però també menys profunditat per detectar riscos materials de sostenibilitat.",
  implicacions: {
    empreses:
      "Per a les empreses, la revisió alleuja la càrrega operativa i permet reorientar recursos cap a acció real en lloc de reporting. Però elimina un diagnòstic compartit: sense datapoints sectorials comparables, les empreses grans perdren pal de paller per pressionar els seus proveïdors. El risc és que cada organització torni a construir el seu propi qüestionari ad hoc, reproduint el fragmentament que el CSRD volia resoldre.",
    reguladors:
      "Els reguladors nacionals (CNMV, AMF, BaFin) perden eina de supervisió basada en dades estandarditzades. L'autoritat europea (ESMA) haurà de reconstruir comparabilitat agregada amb menys inputs. La Comissió es queda amb un instrument políticament venible com a 'simplificació' però metodològicament més feble. La pressure per retrocedir més en properes revisions queda oberta.",
    ciutadans:
      "Per a la ciutadania, la promesa és transparència més accessible i menys costos traslladats a preus. En canvi, es redueix la capacitat de comparar impactes reals entre empreses del mateix sector. La societat civil organitzada perd eina per denunciar rentat verd: amb menys dades obligatòries, més espai per al relat auto-declaratiu.",
  },
  mesEnllaCheckbox: {
    criteri: "Justícia distributiva + Sostenibilitat absoluta",
    body:
      "La simplificació es presenta com a neutra, però distribueix els beneficis i els costos de manera asimètrica. Les grans corporacions amb capacitat de lobbying han guanyat alleugeriment; les comunitats afectades pels seus impactes perden informació verificable per exercir drets. Alhora, eliminar granularitat sectorial converteix la sostenibilitat en variable relativa —'miller que l'any passat'— en lloc d'absoluta —'compatible amb els límits planetaris'. Sense referents absoluts, el reporting esdevé exercici de millora contínua sense sostre, insuficient per aturar la deterioració ecològica real que pateixen territoris concrets.",
  },
  connexions: [
    {
      type: "Evolució",
      target: "EFRAG Sustainability Reporting Work Programme 2026",
      desc: "L'EFRAG tenia previst desplegar sectoral standards al 2026; la revisió congela el roadmap i el converteix en prioritat secundària.",
    },
    {
      type: "Complement",
      target: "EU Taxonomy: Delegated Act de simplificació",
      desc: "Ambdós actes formen part de l'Omnibus I i comparteixen la lògica de reducció de càrregues per als mateixos obligats.",
    },
    {
      type: "Contradicció",
      target: "CSDDD: modificacions Omnibus I definitives",
      desc: "Mentre el CSRD alleuja el reporting, el CSDDD estreny la due diligence; les empreses hauran de fer més amb menys informació estructurada.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Auditar la matriu de materialitat vigent",
      desc: "Identificar quins datapoints eliminats eren realment materials per al vostre sector i mantenir-los de forma voluntària amb documentació interna.",
      effort: "Baix",
      impact: "Mitjà",
    },
    {
      num: "02",
      title: "Renegociar el contracte d'assurance extern",
      desc: "Aprofitar la reducció de datapoints per baixar cost, però pactar assurance raonable sobre els datapoints materials que es conservin.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "03",
      title: "Construir un dataset voluntari intern",
      desc: "Mantenir una capa de dades 'gold standard' per als stakeholders qualificats (inversors, ONG, sindicats) que vulguin granularitat completa.",
      effort: "Mitjà",
      impact: "Mitjà",
    },
    {
      num: "04",
      title: "Formar el comitè d'auditoria en doble materialitat reduïda",
      desc: "Sessions curtes per alinear criteris entre financer, jurídic i sostenibilitat sobre què entra i què surt del nou perimeter.",
      effort: "Baix",
      impact: "Baix",
    },
  ],
  crossRefs: [
    { framework: "GRI", criterion: "Universal Standards 2021 (compatibilitat declarada)", impact: "Alt" },
    { framework: "EcoVadis", criterion: "Score de Environment i Sustainable Procurement", impact: "Mitjà" },
    { framework: "MSCI ESG", criterion: "Data coverage i controversy screening", impact: "Mitjà" },
    { framework: "B Corp", criterion: "Standards V2.1 — convergència parcial en indicadors", impact: "Baix" },
  ],
};

const revisioEsrs_es: ReportBlock = {
  semafor: {
    grade: "C",
    gradeLabel: "Débil metodológicamente",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Mencionado",
        note: "Se mantiene la obligación pero se simplifica la granularidad de categorías upstream y downstream.",
      },
      {
        name: "Términos temporales",
        status: "groc",
        label: "Mencionado",
        note: "Aplicación por fases, sin comparabilidad retroactiva garantizada con ejercicios anteriores.",
      },
      {
        name: "Fuentes independientes",
        status: "verd",
        label: "Cuantificado",
        note: "Comisión Europea con auditorías de impacto, consultas públicas y evaluación del Better Regulation Toolbox.",
      },
      {
        name: "Granularidad",
        status: "vermell",
        label: "Ignorado",
        note: "La reducción del 61% de datapoints elimina granularidad sectorial y comparabilidad entre pares.",
      },
      {
        name: "Verificación externa",
        status: "groc",
        label: "Mencionado",
        note: "Se mantiene el assurance limitado; no se pasa a assurance razonable como pedían los inversores.",
      },
    ],
  },
  dadesClau: [
    { value: "61%", label: "reducción de datapoints obligatorios", page: "p. 12" },
    { value: "3.700M€", label: "ahorro estimado en 5 años para las empresas", page: "p. 8" },
    { value: "1.144", label: "datapoints eliminados del total original", page: "p. 14" },
    { value: "2027", label: "año de aplicación para las primeras empresas afectadas", page: "p. 21" },
    { value: "5 años", label: "período de transición adicional para pymes", page: "p. 27" },
  ],
  resumExecutiu:
    "La Comisión Europea publica la revisión de los European Sustainability Reporting Standards (ESRS) como pieza central del Omnibus I de simplificación. La propuesta reduce un 61% los datapoints obligatorios —cerca de 1.144 sobre el total— y modulariza la doble materialidad para hacerla más operativa para las empresas medianas. El ejecutivo comunitario estima un ahorro acumulado de 3.700 millones de euros en cinco años, principalmente en costes de recogida de datos, assurance externo y sistemas de reporting. La revisión mantiene la arquitectura de doce estándares (dos transversales y diez temáticos) pero elimina exigencias consideradas redundantes con otros marcos europeos (Taxonomía UE, SFDR) y con GRI. Se introduce un sistema de 'datapoints voluntarios' para quienes quieran mantener la granularidad anterior, pero sin incentivo regulador asociado. La cronología prevé aplicación progresiva a partir del ejercicio 2027 para las grandes empresas del artículo 19a, con transición alargada hasta 2032 para las del artículo 19b. Los inversores institucionales y la sociedad civil han advertido que la simplificación puede comprometer la comparabilidad entre pares y la trazabilidad de la información Scope 3. El EFRAG, por su parte, se queda sin mandato para desarrollar los sectoral standards previstos. En resumen: menos carga administrativa, pero también menos profundidad para detectar riesgos materiales de sostenibilidad.",
  implicacions: {
    empreses:
      "Para las empresas, la revisión alivia la carga operativa y permite reorientar recursos hacia acción real en lugar de reporting. Pero elimina un diagnóstico compartido: sin datapoints sectoriales comparables, las grandes empresas pierden palanca para presionar a sus proveedores. El riesgo es que cada organización vuelva a construir su propio cuestionario ad hoc, reproduciendo el fragmento que el CSRD quería resolver.",
    reguladors:
      "Los reguladores nacionales (CNMV, AMF, BaFin) pierden herramienta de supervisión basada en datos estandarizados. La autoridad europea (ESMA) tendrá que reconstruir comparabilidad agregada con menos inputs. La Comisión se queda con un instrumento políticamente vendible como 'simplificación' pero metodológicamente más débil. La presión para retroceder más en próximas revisiones queda abierta.",
    ciutadans:
      "Para la ciudadanía, la promesa es transparencia más accesible y menos costes trasladados a precios. En cambio, se reduce la capacidad de comparar impactos reales entre empresas del mismo sector. La sociedad civil organizada pierde herramienta para denunciar greenwashing: con menos datos obligatorios, más espacio para el relato autodeclarativo.",
  },
  mesEnllaCheckbox: {
    criteri: "Justicia distributiva + Sostenibilidad absoluta",
    body:
      "La simplificación se presenta como neutra, pero distribuye beneficios y costes de manera asimétrica. Las grandes corporaciones con capacidad de lobbying han ganado aligeramiento; las comunidades afectadas por sus impactos pierden información verificable para ejercer derechos. Al mismo tiempo, eliminar granularidad sectorial convierte la sostenibilidad en variable relativa —'mejor que el año pasado'— en lugar de absoluta —'compatible con los límites planetarios'. Sin referentes absolutos, el reporting deviene ejercicio de mejora continua sin techo, insuficiente para frenar el deterioro ecológico real que sufren territorios concretos.",
  },
  connexions: [
    {
      type: "Evolución",
      target: "EFRAG Sustainability Reporting Work Programme 2026",
      desc: "El EFRAG tenía previsto desplegar sectoral standards en 2026; la revisión congela la hoja de ruta y la convierte en prioridad secundaria.",
    },
    {
      type: "Complemento",
      target: "EU Taxonomy: Delegated Act de simplificación",
      desc: "Ambos actos forman parte del Omnibus I y comparten la lógica de reducción de cargas para los mismos obligados.",
    },
    {
      type: "Contradicción",
      target: "CSDDD: modificaciones Omnibus I definitivas",
      desc: "Mientras el CSRD alivia el reporting, el CSDDD estrecha la due diligence; las empresas tendrán que hacer más con menos información estructurada.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Auditar la matriz de materialidad vigente",
      desc: "Identificar qué datapoints eliminados eran realmente materiales para su sector y mantenerlos de forma voluntaria con documentación interna.",
      effort: "Bajo",
      impact: "Medio",
    },
    {
      num: "02",
      title: "Renegociar el contrato de assurance externo",
      desc: "Aprovechar la reducción de datapoints para bajar coste, pero pactar assurance razonable sobre los datapoints materiales que se conserven.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "03",
      title: "Construir un dataset voluntario interno",
      desc: "Mantener una capa de datos 'gold standard' para los stakeholders cualificados (inversores, ONG, sindicatos) que quieran granularidad completa.",
      effort: "Medio",
      impact: "Medio",
    },
    {
      num: "04",
      title: "Formar al comité de auditoría en doble materialidad reducida",
      desc: "Sesiones cortas para alinear criterios entre financiero, jurídico y sostenibilidad sobre qué entra y qué sale del nuevo perímetro.",
      effort: "Bajo",
      impact: "Bajo",
    },
  ],
  crossRefs: [
    { framework: "GRI", criterion: "Universal Standards 2021 (compatibilidad declarada)", impact: "Alto" },
    { framework: "EcoVadis", criterion: "Score de Environment y Sustainable Procurement", impact: "Medio" },
    { framework: "MSCI ESG", criterion: "Data coverage y controversy screening", impact: "Medio" },
    { framework: "B Corp", criterion: "Standards V2.1 — convergencia parcial en indicadores", impact: "Bajo" },
  ],
};

// -----------------------------------------------------------------------------
// 2. ecb-climate-risk-2026 — Climate risk stress test: EU banking system
// -----------------------------------------------------------------------------

const ecbClimate_ca: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Acceptable amb matisos",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "vermell",
        label: "Ignorat",
        note: "El BCE admet que el 78% dels bancs no disposa de dades fiables sobre emissions Scope 3 dels seus clients corporatius.",
      },
      {
        name: "Termes temporals",
        status: "verd",
        label: "Quantificat",
        note: "Horitzons a 3, 10 i 30 anys amb escenaris NGFS Orderly, Disorderly i Hot House World.",
      },
      {
        name: "Fonts independents",
        status: "verd",
        label: "Quantificat",
        note: "Dades bancàries supervisades directament pel BCE i escenaris co-dissenyats amb NGFS.",
      },
      {
        name: "Granularitat",
        status: "groc",
        label: "Esmentat",
        note: "Granularitat a nivell de contrapart però agregació limitada per sectors econòmics NACE.",
      },
      {
        name: "Verificació externa",
        status: "groc",
        label: "Esmentat",
        note: "Auditoria interna del BCE; no hi ha verificació externa independent de les dades autoreportades.",
      },
    ],
  },
  dadesClau: [
    { value: "100%", label: "bancs significatius integren risc climàtic als stress tests", page: "p. 9" },
    { value: "78%", label: "manca dades fiables de Scope 3 dels clients corporatius", page: "p. 34" },
    { value: "30 anys", label: "horitzó màxim d'anàlisi amb escenaris NGFS", page: "p. 18" },
    { value: "1,3 bilions €", label: "exposició bruta a sectors altament emissors", page: "p. 41" },
    { value: "2050", label: "any objectiu de neutralitat de les carteres bancàries", page: "p. 52" },
  ],
  resumExecutiu:
    "El Banc Central Europeu publica el resultat del seu tercer stress test de risc climàtic sobre el sistema bancari de la UE. Per primera vegada, el 100% dels bancs significatius (SIs) integren el risc climàtic en els seus exercicis interns de stress testing, fet que marca un abans i un després en la supervisió prudencial. L'exercici combina escenaris macrofinancers del NGFS —Orderly, Disorderly i Hot House World— amb horitzons a 3, 10 i 30 anys, i analitza tant el risc físic com el de transició. Els resultats mostren que els bancs amb exposició concentrada a sectors altament emissors (1,3 bilions d'euros bruts) podrien patir pèrdues addicionals de fins al 18% del CET1 en escenaris disorderly. El BCE identifica tres gaps estructurals: manca de dades fiables de Scope 3 (afecta el 78% d'entitats), cobertura heterogènia de risc físic a nivell d'asset, i integració limitada del risc climàtic als processos de concessió de crèdit diaris. L'informe també confirma que l'objectiu col·lectiu de neutralitat de carteres el 2050 és inviable sense reorientació accelerada del finançament a combustibles fòssils. El supervisor anuncia properes revisions del CRR/CRD per incorporar capital addicional per exposicions climàtiques. La lectura crítica: el marc és rigorós però les dades d'entrada encara són insuficients per calcular pèrdues econòmiques reals.",
  implicacions: {
    empreses:
      "Per a les empreses finançades, l'informe significa que els bancs els preguntaran per dades climàtiques amb més insistència i granularitat. El cost d'opacitat pujarà: tipus d'interès més alts o denegació de crèdit per a aquelles que no reportin bé el seu perfil de transició. Les empreses amb cartera de clients dependents de fòssils veuran com el seu cost de capital s'incrementa progressivament.",
    reguladors:
      "Per als reguladors, l'informe obre la porta a capital addicional per risc climàtic dins del CRR/CRD. L'EBA haurà de definir un calendari concret. Els supervisors nacionals hauran d'enfortir les unitats de climate risk, avui desiguals entre estats membres. La coordinació amb NGFS es confirma com a eina indispensable.",
    ciutadans:
      "Per a la ciutadania, l'informe posa xifres al risc que el seu estalvi i la seva hipoteca estan exposats a la transició climàtica mal gestionada. La pregunta política és qui assumeix el cost de la descarbonització de la cartera bancària: accionistes, dipositants o contribuents. Sense debat públic, es decidirà en consells d'administració tancats.",
  },
  mesEnllaCheckbox: {
    criteri: "Sostenibilitat absoluta + Justícia distributiva",
    body:
      "L'informe mesura el risc per al banc, no el risc que el banc finança per al planeta. Aquesta asimetria no és tècnica sinó ètica: es quantifiquen pèrdues patrimonials amb tres decimals, però es deixen sense quantificar els danys climàtics que el finançament bancari fa possible en territoris concrets. Alhora, la càrrega de la transició es distribuix via preu del crèdit: les pimes i llars de renda baixa pagaran més pel finançament verd, mentre que les grans corporacions podran absorbir el cost o traslladar-lo. Sense mecanismes de justícia distributiva explícits, l'esforç de transició recaurà sobre els més vulnerables.",
  },
  connexions: [
    {
      type: "Complement",
      target: "IEA Global Energy Review 2026",
      desc: "L'IEA aporta les dades de demanda energètica que els bancs utilitzen per model·litzar riscos de transició sectorials.",
    },
    {
      type: "Evolució",
      target: "EU Taxonomy: Delegated Act de simplificació",
      desc: "La Taxonomia simplificada facilitarà als bancs classificar activitats alineades, però també reduirà la traçabilitat.",
    },
    {
      type: "Contradicció",
      target: "Revisió dels ESRS: simplificació del CSRD",
      desc: "Si el CSRD elimina granularitat Scope 3, el BCE perdrà la principal font de dades d'entrada per als seus stress tests.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Mapar exposició financera a sectors emissors",
      desc: "A partir de la llista NACE del banc, calcular quota de crèdit a sectors altament emissors i comparar-la amb benchmarks del sector.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "02",
      title: "Demnar dades Scope 3 als clients corporatius",
      desc: "Incloure qüestionari estandarditzat (PCAF) als processos d'origen d'operació i renovació de facilitats.",
      effort: "Alt",
      impact: "Alt",
    },
    {
      num: "03",
      title: "Definir KPI d'integració al procés de concessió",
      desc: "Incorporar risc climàtic al scoring intern amb pes explícit; fer-lo auditable i revisable anualment.",
      effort: "Mitjà",
      impact: "Mitjà",
    },
    {
      num: "04",
      title: "Publicar un disclosure de transició creïble",
      desc: "Publicar trajectòria d'emissions finançades amb fites intermèdies (2030, 2040) verificades externament.",
      effort: "Baix",
      impact: "Mitjà",
    },
  ],
  crossRefs: [
    { framework: "TCFD", criterion: "Disclosures de Governance, Strategy i Risk Management", impact: "Alt" },
    { framework: "MSCI ESG", criterion: "Rating financer i ESG dels bancs", impact: "Mitjà" },
    { framework: "CSRD/ESRS", criterion: "E1 Climate Change datapoints per als bancs", impact: "Alt" },
    { framework: "SFDR", criterion: "PAI 1-15 en fons financers", impact: "Mitjà" },
  ],
};

const ecbClimate_es: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Aceptable con matices",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "vermell",
        label: "Ignorado",
        note: "El BCE admite que el 78% de los bancos no dispone de datos fiables sobre emisiones Scope 3 de sus clientes corporativos.",
      },
      {
        name: "Términos temporales",
        status: "verd",
        label: "Cuantificado",
        note: "Horizontes a 3, 10 y 30 años con escenarios NGFS Orderly, Disorderly y Hot House World.",
      },
      {
        name: "Fuentes independientes",
        status: "verd",
        label: "Cuantificado",
        note: "Datos bancarios supervisados directamente por el BCE y escenarios co-diseñados con NGFS.",
      },
      {
        name: "Granularidad",
        status: "groc",
        label: "Mencionado",
        note: "Granularidad a nivel de contraparte pero agregación limitada por sectores económicos NACE.",
      },
      {
        name: "Verificación externa",
        status: "groc",
        label: "Mencionado",
        note: "Auditoría interna del BCE; no hay verificación externa independiente de los datos autoreportados.",
      },
    ],
  },
  dadesClau: [
    { value: "100%", label: "bancos significativos integran riesgo climático en stress tests", page: "p. 9" },
    { value: "78%", label: "carece de datos fiables de Scope 3 de clientes corporativos", page: "p. 34" },
    { value: "30 años", label: "horizonte máximo de análisis con escenarios NGFS", page: "p. 18" },
    { value: "1,3 billones €", label: "exposición bruta a sectores altamente emisores", page: "p. 41" },
    { value: "2050", label: "año objetivo de neutralidad de las carteras bancarias", page: "p. 52" },
  ],
  resumExecutiu:
    "El Banco Central Europeo publica el resultado de su tercer stress test de riesgo climático sobre el sistema bancario de la UE. Por primera vez, el 100% de los bancos significativos (SIs) integran el riesgo climático en sus ejercicios internos de stress testing, lo que marca un antes y un después en la supervisión prudencial. El ejercicio combina escenarios macrofinancieros del NGFS —Orderly, Disorderly y Hot House World— con horizontes a 3, 10 y 30 años, y analiza tanto el riesgo físico como el de transición. Los resultados muestran que los bancos con exposición concentrada a sectores altamente emisores (1,3 billones de euros brutos) podrían sufrir pérdidas adicionales de hasta el 18% del CET1 en escenarios disorderly. El BCE identifica tres gaps estructurales: falta de datos fiables de Scope 3 (afecta al 78% de entidades), cobertura heterogénea de riesgo físico a nivel de activo, e integración limitada del riesgo climático en los procesos de concesión de crédito diarios. El informe también confirma que el objetivo colectivo de neutralidad de carteras en 2050 es inviable sin reorientación acelerada de la financiación a combustibles fósiles. El supervisor anuncia próximas revisiones del CRR/CRD para incorporar capital adicional por exposiciones climáticas. La lectura crítica: el marco es riguroso pero los datos de entrada aún son insuficientes para calcular pérdidas económicas reales.",
  implicacions: {
    empreses:
      "Para las empresas financiadas, el informe significa que los bancos preguntarán por datos climáticos con más insistencia y granularidad. El coste de la opacidad subirá: tipos de interés más altos o denegación de crédito para aquellas que no reporten bien su perfil de transición. Las empresas con cartera de clientes dependientes de fósiles verán cómo su coste de capital se incrementa progresivamente.",
    reguladors:
      "Para los reguladores, el informe abre la puerta a capital adicional por riesgo climático dentro del CRR/CRD. La EBA tendrá que definir un calendario concreto. Los supervisores nacionales tendrán que reforzar las unidades de climate risk, hoy desiguales entre estados miembros. La coordinación con NGFS se confirma como herramienta indispensable.",
    ciutadans:
      "Para la ciudadanía, el informe pone cifras al riesgo que su ahorro y su hipoteca están expuestos a una transición climática mal gestionada. La pregunta política es quién asume el coste de la descarbonización de la cartera bancaria: accionistas, depositantes o contribuyentes. Sin debate público, se decidirá en consejos de administración cerrados.",
  },
  mesEnllaCheckbox: {
    criteri: "Sostenibilidad absoluta + Justicia distributiva",
    body:
      "El informe mide el riesgo para el banco, no el riesgo que el banco financia para el planeta. Esta asimetría no es técnica sino ética: se cuantifican pérdidas patrimoniales con tres decimales, pero se dejan sin cuantificar los daños climáticos que la financiación bancaria hace posible en territorios concretos. Al mismo tiempo, la carga de la transición se distribuye vía precio del crédito: las pymes y hogares de renta baja pagarán más por la financiación verde, mientras que las grandes corporaciones podrán absorber el coste o trasladarlo. Sin mecanismos de justicia distributiva explícitos, el esfuerzo de transición recaerá sobre los más vulnerables.",
  },
  connexions: [
    {
      type: "Complemento",
      target: "IEA Global Energy Review 2026",
      desc: "La IEA aporta los datos de demanda energética que los bancos utilizan para modelizar riesgos de transición sectoriales.",
    },
    {
      type: "Evolución",
      target: "EU Taxonomy: Delegated Act de simplificación",
      desc: "La Taxonomía simplificada facilitará a los bancos clasificar actividades alineadas, pero también reducirá la trazabilidad.",
    },
    {
      type: "Contradicción",
      target: "Revisión de los ESRS: simplificación del CSRD",
      desc: "Si el CSRD elimina granularidad Scope 3, el BCE perderá la principal fuente de datos de entrada para sus stress tests.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Mapear exposición financiera a sectores emisores",
      desc: "A partir de la lista NACE del banco, calcular cuota de crédito a sectores altamente emisores y compararla con benchmarks del sector.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "02",
      title: "Pedir datos Scope 3 a los clientes corporativos",
      desc: "Incluir cuestionario estandarizado (PCAF) en los procesos de origen de operación y renovación de facilidades.",
      effort: "Alto",
      impact: "Alto",
    },
    {
      num: "03",
      title: "Definir KPI de integración al proceso de concesión",
      desc: "Incorporar riesgo climático al scoring interno con peso explícito; hacerlo auditable y revisable anualmente.",
      effort: "Medio",
      impact: "Medio",
    },
    {
      num: "04",
      title: "Publicar un disclosure de transición creíble",
      desc: "Publicar trayectoria de emisiones financiadas con metas intermedias (2030, 2040) verificadas externamente.",
      effort: "Bajo",
      impact: "Medio",
    },
  ],
  crossRefs: [
    { framework: "TCFD", criterion: "Disclosures de Governance, Strategy y Risk Management", impact: "Alto" },
    { framework: "MSCI ESG", criterion: "Rating financiero y ESG de los bancos", impact: "Medio" },
    { framework: "CSRD/ESRS", criterion: "E1 Climate Change datapoints para los bancos", impact: "Alto" },
    { framework: "SFDR", criterion: "PAI 1-15 en fondos financieros", impact: "Medio" },
  ],
};

// -----------------------------------------------------------------------------
// 3. efrag-work-programme-2026 — EFRAG Sustainability Reporting Work Programme 2026
// -----------------------------------------------------------------------------

const efrag_ca: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Acceptable amb matisos",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Esmentat",
        note: "Consta com a prioritat d'interoperabilitat amb GRI però sense ampliació de datapoints obligatoris.",
      },
      {
        name: "Termes temporals",
        status: "verd",
        label: "Quantificat",
        note: "Calendari trimestral amb fites identificables al llarg del 2026 i entregables al 2027.",
      },
      {
        name: "Fonts independents",
        status: "groc",
        label: "Esmentat",
        note: "Multistakeholder task forces, però finançament i mandat depenen de la Comissió Europea.",
      },
      {
        name: "Granularitat",
        status: "groc",
        label: "Esmentat",
        note: "Els sectoral standards previstos queden en stand-by; es prioritza la simplificació transversal.",
      },
      {
        name: "Verificació externa",
        status: "groc",
        label: "Esmentat",
        note: "Consultes públiques obligatòries, però sense avaluació externa independent de l'impacte.",
      },
    ],
  },
  dadesClau: [
    { value: "4", label: "eixos estratègics definits per al 2026", page: "p. 6" },
    { value: "11", label: "sectoral standards previstos, ara congelats", page: "p. 19" },
    { value: "3", label: "marcs amb els quals s'busca interoperabilitat", page: "p. 24" },
    { value: "Q3 2026", label: "data límit per als primers deliverables", page: "p. 31" },
    { value: "120+", label: "experts participates a les task forces", page: "p. 12" },
  ],
  resumExecutiu:
    "L'EFRAG publica el seu Sustainability Reporting Work Programme 2026, document que defineix el full de ruta del laboratori tècnic europeu per als propers divuit mesos. El programa s'organitza al voltant de quatre eixos estratègics: (1) suport a la implementació dels ESRS revisats, (2) desenvolupament dels sectoral standards —tot i que el ritme es redueix dràsticament després de l'Omnibus I—, (3) interoperabilitat amb GRI Universal Standards i ISSB IFRS S1/S2, i (4) guies pràctiques per a pimes i primeres aplicacions. L'EFRAG confirma que els 11 sectoral standards previstos inicialment queden en stand-by: només es treballarà en els tres considerats més urgents (extracció, agricultura, financer). La interoperabilitat amb GRI es presenta com a objectiu nuclear per evitar duplicacions: l'objectiu és que una empresa pugui complir ambdós marcs amb una sola recopilació de dades. Pel que fa a l'ISSB, l'EFRAG manté el diàleg tècnic però sense renunciar a la doble materialitat com a principi diferencial europeu. El programa anuncia més de 120 experts participen en task forces multistakeholder i preveu entregables concrets al tercer trimestre de 2026. La crítica recurrent: el mandat de l'EFRAG depèn massa de la Comissió, fet que limita la seva independència tècnica.",
  implicacions: {
    empreses:
      "Per a les empreses, el programa aporta previsibilitat: saben que durant 2026 no hi haurà grans canvis addicionals en ESRS. Les grans corporacions que esperaven sectoral standards hauran d'esperar més i, mentrestant, gestionar la seva interpretació sectorial. La interoperabilitat amb GRI és bona notícia per a multinacionals amb presencia fora de la UE.",
    reguladors:
      "Per als reguladors, el programa ofereix coherència tècnica però aixeca dubtes de governança: l'EFRAG depèn de la Comissió per al finançament i el mandat. Sense independència formal, la seva capacitat per resistir pressions polítiques queda limitada. La coordinació amb l'ISSB esdevé estratègica per evitar divergència regulatòria global.",
    ciutadans:
      "Per a la ciutadania, el programa és un document tècnic allunyat del debat públic. Però les seves decisions afecten quina informació arriba a la societat: si els sectoral standards es retrassen, es perden un anys de transparència sectorial. La societat civil hauria de participar activament a les consultes públiques, avui dominades per consultores i grans empreses.",
  },
  mesEnllaCheckbox: {
    criteri: "Co-decisió democràtica + Arrelament territorial",
    body:
      "L'EFRAG es presenta com a òrgan tècnic neutral, però les seves decisions distribueixen poder entre actors amb capacitat molt desigual d'influenciar-lo. La composició de les task forces —dominades per grans corporacions, firmes d'auditoria i consultores— deixa poc espai per a veus de treballadors, comunitats afectades o petites empreses. Alhora, l'arquitectura europea top-down tendeix a estandarditzar sense arrelar-se en realitats territorials: un sectoral standard d'agricultura dissenyat a Brussel·les difícilment captura la diversitat de maneigs del sòl mediterrani vs nòrdic. Sense co-decisió efectiva i sensibilitat territorial, el reporting tècnic queda lluny dels llocs on els impactes reals es produeixen.",
  },
  connexions: [
    {
      type: "Evolució",
      target: "Revisió dels ESRS: simplificació del CSRD",
      desc: "El programa de l'EFRAG s'ajusta a la revisió: menys sectoral standards, més suport a la implementació simplificada.",
    },
    {
      type: "Complement",
      target: "TNFD 2026 Status Report",
      desc: "L'EFRAG referencia explícitament TNFD com a base per al desenvolupament futur del standard E4 Biodiversitat.",
    },
    {
      type: "Complement",
      target: "EcoVadis Methodology Updates Q1 2026",
      desc: "La interoperabilitat EFRAG-GRI facilita que les puntuacions EcoVadis reflecteixin millor el compliment CSRD.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Participar a les consultes públiques EFRAG",
      desc: "Designar un representant tècnic per respondre a les consultes; les respostes qualificades tenen pes real.",
      effort: "Baix",
      impact: "Mitjà",
    },
    {
      num: "02",
      title: "Preparar un mapping ESRS-GRI intern",
      desc: "Construir una taula de correspondències per minimitzar duplicacions de recollida de dades entre marcs.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "03",
      title: "Monitorar els 3 sectoral standards prioritaris",
      desc: "Si la vostra empresa és dels sectors extracció, agricultura o financer, seguir de prop les drafts.",
      effort: "Baix",
      impact: "Mitjà",
    },
    {
      num: "04",
      title: "Aprofitar les guies pimes per al value chain",
      desc: "Utilitzar les VSME (Voluntary SME Standard) com a eina per estandarditzar demandes als proveïdors petits.",
      effort: "Baix",
      impact: "Baix",
    },
  ],
  crossRefs: [
    { framework: "GRI", criterion: "Universal Standards 2021 — interoperabilitat prioritària", impact: "Alt" },
    { framework: "CSRD/ESRS", criterion: "Tots els ESRS revisats — suport a implementació", impact: "Alt" },
    { framework: "TNFD", criterion: "Recomanacions de natura — base per a E4", impact: "Mitjà" },
    { framework: "UN Global Compact", criterion: "Principis i ODS com a referents ètics", impact: "Baix" },
  ],
};

const efrag_es: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Aceptable con matices",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Mencionado",
        note: "Consta como prioridad de interoperabilidad con GRI pero sin ampliación de datapoints obligatorios.",
      },
      {
        name: "Términos temporales",
        status: "verd",
        label: "Cuantificado",
        note: "Calendario trimestral con hitos identificables a lo largo de 2026 y entregables en 2027.",
      },
      {
        name: "Fuentes independientes",
        status: "groc",
        label: "Mencionado",
        note: "Multistakeholder task forces, pero financiación y mandato dependen de la Comisión Europea.",
      },
      {
        name: "Granularidad",
        status: "groc",
        label: "Mencionado",
        note: "Los sectoral standards previstos quedan en stand-by; se prioriza la simplificación transversal.",
      },
      {
        name: "Verificación externa",
        status: "groc",
        label: "Mencionado",
        note: "Consultas públicas obligatorias, pero sin evaluación externa independiente del impacto.",
      },
    ],
  },
  dadesClau: [
    { value: "4", label: "ejes estratégicos definidos para 2026", page: "p. 6" },
    { value: "11", label: "sectoral standards previstos, ahora congelados", page: "p. 19" },
    { value: "3", label: "marcos con los que se busca interoperabilidad", page: "p. 24" },
    { value: "Q3 2026", label: "fecha límite para los primeros entregables", page: "p. 31" },
    { value: "120+", label: "expertos participando en las task forces", page: "p. 12" },
  ],
  resumExecutiu:
    "El EFRAG publica su Sustainability Reporting Work Programme 2026, documento que defineine la hoja de ruta del laboratorio técnico europeo para los próximos dieciocho meses. El programa se organiza en torno a cuatro ejes estratégicos: (1) soporte a la implementación de los ESRS revisados, (2) desarrollo de los sectoral standards —aunque el ritmo se reduce drásticamente tras el Omnibus I—, (3) interoperabilidad con GRI Universal Standards e ISSB IFRS S1/S2, y (4) guías prácticas para pymes y primeras aplicaciones. El EFRAG confirma que los 11 sectoral standards previstos inicialmente quedan en stand-by: solo se trabajará en los tres considerados más urgentes (extracción, agricultura, financiero). La interoperabilidad con GRI se presenta como objetivo nuclear para evitar duplicaciones: el objetivo es que una empresa pueda cumplir ambos marcos con una sola recopilación de datos. Respecto al ISSB, el EFRAG mantiene el diálogo técnico pero sin renunciar a la doble materialidad como principio diferencial europeo. El programa anuncia más de 120 expertos participando en task forces multistakeholder y prevé entregables concretos en el tercer trimestre de 2026. La crítica recurrente: el mandato del EFRAG depende demasiado de la Comisión, lo que limita su independencia técnica.",
  implicacions: {
    empreses:
      "Para las empresas, el programa aporta previsibilidad: saben que durante 2026 no habrá grandes cambios adicionales en ESRS. Las grandes corporaciones que esperaban sectoral standards tendrán que esperar más y, mientras tanto, gestionar su interpretación sectorial. La interoperabilidad con GRI es buena noticia para multinacionales con presencia fuera de la UE.",
    reguladors:
      "Para los reguladores, el programa ofrece coherencia técnica pero levanta dudas de gobernanza: el EFRAG depende de la Comisión para la financiación y el mandato. Sin independencia formal, su capacidad para resistir presiones políticas queda limitada. La coordinación con el ISSB se vuelve estratégica para evitar divergencia regulatoria global.",
    ciutadans:
      "Para la ciudadanía, el programa es un documento técnico alejado del debate público. Pero sus decisiones afectan qué información llega a la sociedad: si los sectoral standards se retrasan, se pierden años de transparencia sectorial. La sociedad civil debería participar activamente en las consultas públicas, hoy dominadas por consultoras y grandes empresas.",
  },
  mesEnllaCheckbox: {
    criteri: "Co-decisión democrática + Arraigamiento territorial",
    body:
      "El EFRAG se presenta como órgano técnico neutral, pero sus decisiones distribuyen poder entre actores con capacidad muy desigual de influir en él. La composición de las task forces —dominadas por grandes corporaciones, firmas de auditoría y consultoras— deja poco espacio para voces de trabajadores, comunidades afectadas o pequeñas empresas. Al mismo tiempo, la arquitectura europea top-down tiende a estandarizar sin arraigarse en realidades territoriales: un sectoral standard de agricultura diseñado en Bruselas difícilmente captura la diversidad de manejos del suelo mediterráneo vs nórdico. Sin co-decisión efectiva y sensibilidad territorial, el reporting técnico queda lejos de los lugares donde los impactos reales se producen.",
  },
  connexions: [
    {
      type: "Evolución",
      target: "Revisión de los ESRS: simplificación del CSRD",
      desc: "El programa del EFRAG se ajusta a la revisión: menos sectoral standards, más soporte a la implementación simplificada.",
    },
    {
      type: "Complemento",
      target: "TNFD 2026 Status Report",
      desc: "El EFRAG referencia explícitamente TNFD como base para el desarrollo futuro del estándar E4 Biodiversidad.",
    },
    {
      type: "Complemento",
      target: "EcoVadis Methodology Updates Q1 2026",
      desc: "La interoperabilidad EFRAG-GRI facilita que las puntuaciones EcoVadis reflejen mejor el cumplimiento CSRD.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Participar en las consultas públicas EFRAG",
      desc: "Designar un representante técnico para responder a las consultas; las respuestas cualificadas tienen peso real.",
      effort: "Bajo",
      impact: "Medio",
    },
    {
      num: "02",
      title: "Preparar un mapping ESRS-GRI interno",
      desc: "Construir una tabla de correspondencias para minimizar duplicaciones de recogida de datos entre marcos.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "03",
      title: "Monitorear los 3 sectoral standards prioritarios",
      desc: "Si su empresa es de los sectores extracción, agricultura o financiero, seguir de cerca los drafts.",
      effort: "Bajo",
      impact: "Medio",
    },
    {
      num: "04",
      title: "Aprovechar las guías pymes para el value chain",
      desc: "Utilizar las VSME (Voluntary SME Standard) como herramienta para estandarizar demandas a los proveedores pequeños.",
      effort: "Bajo",
      impact: "Bajo",
    },
  ],
  crossRefs: [
    { framework: "GRI", criterion: "Universal Standards 2021 — interoperabilidad prioritaria", impact: "Alto" },
    { framework: "CSRD/ESRS", criterion: "Todos los ESRS revisados — soporte a implementación", impact: "Alto" },
    { framework: "TNFD", criterion: "Recomendaciones de naturaleza — base para E4", impact: "Medio" },
    { framework: "UN Global Compact", criterion: "Principios y ODS como referentes éticos", impact: "Bajo" },
  ],
};

// -----------------------------------------------------------------------------
// 4. ecovadis-methodology-q1-2026 — EcoVadis Methodology Updates Q1 2026
// -----------------------------------------------------------------------------

const ecovadis_ca: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Acceptable amb matisos",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Esmentat",
        note: "Reconeixement de reporting Scope 3 via GRI però no es quantifica per a pimes sense capacitat de mesurar.",
      },
      {
        name: "Termes temporals",
        status: "verd",
        label: "Quantificat",
        note: "Versions metodològiques versionades i publicades amb calendari trimestral clar.",
      },
      {
        name: "Fonts independents",
        status: "vermell",
        label: "Ignorat",
        note: "La metodologia és privativa; documents de suport i algoritme de scoring no són auditables externament.",
      },
      {
        name: "Granularitat",
        status: "groc",
        label: "Esmentat",
        note: "21 indicadors en 4 temes però poca desagregació sectorial més enllà de la matritzada.",
      },
      {
        name: "Verificació externa",
        status: "groc",
        label: "Esmentat",
        note: "Procés d'expert review intern; sense verificació tercera reconeguda internacionalment.",
      },
    ],
  },
  dadesClau: [
    { value: "9", label: "canvis metodològics entre abril i maig 2026", page: "p. 3" },
    { value: "4", label: "temes avaluats (Environment, Labor, Ethics, Procurement)", page: "p. 7" },
    { value: "21", label: "indicadors desplegats en la versió vigent", page: "p. 11" },
    { value: "+5 pts", label: "bonus per a reportadors amb GRI Universal Standards", page: "p. 19" },
    { value: "150.000+", label: "empreses avaluades acumuladament al sistema", page: "p. 24" },
  ],
  resumExecutiu:
    "EcoVadis publica el seu paquet d'actualitzacions metodològiques del primer trimestre 2026, amb 9 canvis efectius entre abril i maig. La metodologia és el motor de la principal plataforma global de rating de sostenibilitat de cadena de subministrament, amb més de 150.000 empreses avaluades acumuladament. Els canvis més rellevants són: (1) reconeixement reforçat —bonus de fins a 5 punts— per a empreses que reporten amb GRI Universal Standards 2021, alineant-se així amb l'arquitectura pública del reporting; (2) nou mòdul obligatori de Human Rights Due Diligence alineat amb CSDDD; (3) actualització dels weightings sectorials amb dades 2024; (4) enduriment dels thresholds per obtenir medalles Platinum i Gold; (5) introducció d'un 'maturity score' separat del score de compliance; (6)Nova categoria de 360° Watch amb fonts d'incident externes verificades; (7) calibratge dels indicators de Scope 3 per a sectors amb alta dependència upstream; (8) harmonització parcial amb EcoVadis-CDP joint scorecard; (9) auditoria de documents augmentada amb IA per reduir falsos positius. La crítica recurrent d'experts: la metodologia és privada, l'algoritme no és auditable i els weightings es decideixen internament. Tot i això, la convergència amb GRI i CSDDD augmenta la coherència amb el marc públic europeu. L'informe també anuncia que les puntuacions es publicaran amb una validesa de 12 mesos en lloc dels 14 anteriors, fet que augmentarà la pressió sobre les empreses per mantenir-se actives.",
  implicacions: {
    empreses:
      "Per a les empreses avaluades, els canvis signifiquen més feina de preparació documental però també oportunitat de pujar score si ja reporten amb GRI. Les que depenen de medalles Gold/Platinum hauran de millorar ràpidament perquè els nous thresholds són més exigents. El mòdul de Human Rights eleva el cost per a les pimes sense capacitat de due diligence estructurada.",
    reguladors:
      "Per als reguladors, l'informe és un senyal del pes creixent dels ratings privats en el règim de sostenibilitat. Sense governança pública sobre EcoVadis, MSCI o Sustainalytics, el de facto regulation es desenvolupa sense control democràtic. La UE hauria de considerar si aquests ratings han d'entrar en el perímetre de supervisió d'ESMA.",
    ciutadans:
      "Per als ciutadans, l'impacte és indirecte però real: les seves empreses subcontractades es veuen pressionades per standards privats que afecten llocs de treball i cadenes. Sense transparència metodològica, és difícil jutjar si el rating afavoreix pràctiques reals o només compliance documental. La societat civil hauria de demanar accés públic a les medalles i metodologia.",
  },
  mesEnllaCheckbox: {
    criteri: "Dignitat humana + Co-decisió democràtica",
    body:
      "El rating EcoVadis pot transformar pràctiques reals de drets humans a la cadena, però també pot convertir-se en eina opaca que decideix qui pot accedir a mercats. Quan una pma perd contracte per un score baix, els treballadors que depenen d'aquell contracte no tenen veu ni recurs. La manca de transparència metodològica és un problema de dignitat: decisions amb impacte sobre vides humanes no poden basar-se en algoritmes privats sense escrutini. La co-decisió democràtica exigeix que els afectats —treballadors, comunitats— puguin entendre i apel·lar les valoracions que els afecten.",
  },
  connexions: [
    {
      type: "Complement",
      target: "EFRAG Sustainability Reporting Work Programme 2026",
      desc: "El reconeixement a GRI d'EcoVadis alinea la plataforma amb el programa d'interoperabilitat de l'EFRAG.",
    },
    {
      type: "Evolució",
      target: "CSDDD: modificacions Omnibus I definitives",
      desc: "El nou mòdul de Human Rights Due Diligence d'EcoVadis anticipa l'entrada en vigor del CSDDD.",
    },
    {
      type: "Complement",
      target: "Revisió dels ESRS: simplificació del CSRD",
      desc: "Ambdós treballen en simplificació del reporting per a la cadena de subministrament, amb enfocaments diferents.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Verificar si la vostra empresa ja reporta amb GRI",
      desc: "Si és així, sol·licitud formal del bonus de 5 punts al vostre analista EcoVadis.",
      effort: "Baix",
      impact: "Mitjà",
    },
    {
      num: "02",
      title: "Auditar la documentació del mòdul Human Rights",
      desc: "Revisar polítiques, procediments i evidències de due diligence abans de la propera avaluació.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "03",
      title: "Comunicar canvis als proveïdors clave",
      desc: "Avisar amb 90 dies d'antelació sobre les noves exigències; oferir suport a pimes per pujar el seu score.",
      effort: "Baix",
      impact: "Mitjà",
    },
    {
      num: "04",
      title: "Incloure score EcoVadis al contracte de subministrament",
      desc: "Definir thresholds mínims i plans de millora en cas de caiguda; evitar rescissió automàtica.",
      effort: "Mitjà",
      impact: "Mitjà",
    },
  ],
  crossRefs: [
    { framework: "GRI", criterion: "Universal Standards 2021 — bonus explícit", impact: "Alt" },
    { framework: "EcoVadis", criterion: "Scorecard complet (4 temes, 21 indicadors)", impact: "Alt" },
    { framework: "CSRD/ESRS", criterion: "S1-S4 (own workforce + value chain)", impact: "Mitjà" },
    { framework: "UN Global Compact", criterion: "10 principis com a base d'avaluació Ethics", impact: "Mitjà" },
  ],
};

const ecovadis_es: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Aceptable con matices",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Mencionado",
        note: "Reconocimiento de reporting Scope 3 vía GRI pero no se cuantifica para pymes sin capacidad de medir.",
      },
      {
        name: "Términos temporales",
        status: "verd",
        label: "Cuantificado",
        note: "Versiones metodológicas versionadas y publicadas con calendario trimestral claro.",
      },
      {
        name: "Fuentes independientes",
        status: "vermell",
        label: "Ignorado",
        note: "La metodología es privativa; documentos de soporte y algoritmo de scoring no son auditables externamente.",
      },
      {
        name: "Granularidad",
        status: "groc",
        label: "Mencionado",
        note: "21 indicadores en 4 temas pero poca desagregación sectorial más allá de la matricial.",
      },
      {
        name: "Verificación externa",
        status: "groc",
        label: "Mencionado",
        note: "Proceso de expert review interno; sin verificación tercera reconocida internacionalmente.",
      },
    ],
  },
  dadesClau: [
    { value: "9", label: "cambios metodológicos entre abril y mayo 2026", page: "p. 3" },
    { value: "4", label: "temas evaluados (Environment, Labor, Ethics, Procurement)", page: "p. 7" },
    { value: "21", label: "indicadores desplegados en la versión vigente", page: "p. 11" },
    { value: "+5 pts", label: "bonus para reportadores con GRI Universal Standards", page: "p. 19" },
    { value: "150.000+", label: "empresas evaluadas acumuladamente en el sistema", page: "p. 24" },
  ],
  resumExecutiu:
    "EcoVadis publica su paquete de actualizaciones metodológicas del primer trimestre 2026, con 9 cambios efectivos entre abril y mayo. La metodología es el motor de la principal plataforma global de rating de sostenibilidad de cadena de suministro, con más de 150.000 empresas evaluadas acumuladamente. Los cambios más relevantes son: (1) reconocimiento reforzado —bonus de hasta 5 puntos— para empresas que reportan con GRI Universal Standards 2021, alineándose así con la arquitectura pública del reporting; (2) nuevo módulo obligatorio de Human Rights Due Diligence alineado con CSDDD; (3) actualización de los weightings sectoriales con datos 2024; (4) endurecimiento de los thresholds para obtener medallas Platinum y Gold; (5) introducción de un 'maturity score' separado del score de compliance; (6) nueva categoría de 360° Watch con fuentes de incidente externas verificadas; (7) calibrado de los indicadores de Scope 3 para sectores con alta dependencia upstream; (8) armonización parcial con EcoVadis-CDP joint scorecard; (9) auditoría de documentos aumentada con IA para reducir falsos positivos. La crítica recurrente de expertos: la metodología es privada, el algoritmo no es auditable y los weightings se deciden internamente. Aun así, la convergencia con GRI y CSDDD aumenta la coherencia con el marco público europeo. El informe también anuncia que las puntuaciones se publicarán con una validez de 12 meses en lugar de los 14 anteriores, lo que aumentará la presión sobre las empresas para mantenerse activas.",
  implicacions: {
    empreses:
      "Para las empresas evaluadas, los cambios significan más trabajo de preparación documental pero también oportunidad de subir score si ya reportan con GRI. Las que dependen de medallas Gold/Platinum tendrán que mejorar rápidamente porque los nuevos thresholds son más exigentes. El módulo de Human Rights eleva el coste para las pymes sin capacidad de due diligence estructurada.",
    reguladors:
      "Para los reguladores, el informe es una señal del peso creciente de los ratings privados en el régimen de sostenibilidad. Sin gobernanza pública sobre EcoVadis, MSCI o Sustainalytics, el de facto regulation se desarrolla sin control democrático. La UE debería considerar si estos ratings deben entrar en el perímetro de supervisión de ESMA.",
    ciutadans:
      "Para los ciudadanos, el impacto es indirecto pero real: sus empresas subcontratadas se ven presionadas por estándares privados que afectan puestos de trabajo y cadenas. Sin transparencia metodológica, es difícil juzgar si el rating favorece prácticas reales o solo compliance documental. La sociedad civil debería pedir acceso público a las medallas y metodología.",
  },
  mesEnllaCheckbox: {
    criteri: "Dignidad humana + Co-decisión democrática",
    body:
      "El rating EcoVadis puede transformar prácticas reales de derechos humanos en la cadena, pero también puede convertirse en herramienta opaca que decide quién puede acceder a mercados. Cuando una pyme pierde contrato por un score bajo, los trabajadores que dependen de aquel contrato no tienen voz ni recurso. La falta de transparencia metodológica es un problema de dignidad: decisiones con impacto sobre vidas humanas no pueden basarse en algoritmos privados sin escrutinio. La co-decisión democrática exige que los afectados —trabajadores, comunidades— puedan entender y apelar las valoraciones que les afectan.",
  },
  connexions: [
    {
      type: "Complemento",
      target: "EFRAG Sustainability Reporting Work Programme 2026",
      desc: "El reconocimiento a GRI de EcoVadis alinea la plataforma con el programa de interoperabilidad del EFRAG.",
    },
    {
      type: "Evolución",
      target: "CSDDD: modificaciones Omnibus I definitivas",
      desc: "El nuevo módulo de Human Rights Due Diligence de EcoVadis anticipa la entrada en vigor del CSDDD.",
    },
    {
      type: "Complemento",
      target: "Revisión de los ESRS: simplificación del CSRD",
      desc: "Ambos trabajan en simplificación del reporting para la cadena de suministro, con enfoques diferentes.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Verificar si su empresa ya reporta con GRI",
      desc: "Si es así, solicitud formal del bonus de 5 puntos a su analista EcoVadis.",
      effort: "Bajo",
      impact: "Medio",
    },
    {
      num: "02",
      title: "Auditar la documentación del módulo Human Rights",
      desc: "Revisar políticas, procedimientos y evidencias de due diligence antes de la próxima evaluación.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "03",
      title: "Comunicar cambios a los proveedores clave",
      desc: "Avisar con 90 días de antelación sobre las nuevas exigencias; ofrecer soporte a pymes para subir su score.",
      effort: "Bajo",
      impact: "Medio",
    },
    {
      num: "04",
      title: "Incluir score EcoVadis en el contrato de suministro",
      desc: "Definir thresholds mínimos y planes de mejora en caso de caída; evitar rescisión automática.",
      effort: "Medio",
      impact: "Medio",
    },
  ],
  crossRefs: [
    { framework: "GRI", criterion: "Universal Standards 2021 — bonus explícito", impact: "Alto" },
    { framework: "EcoVadis", criterion: "Scorecard completo (4 temas, 21 indicadores)", impact: "Alto" },
    { framework: "CSRD/ESRS", criterion: "S1-S4 (own workforce + value chain)", impact: "Medio" },
    { framework: "UN Global Compact", criterion: "10 principios como base de evaluación Ethics", impact: "Medio" },
  ],
};

// -----------------------------------------------------------------------------
// 5. tnfd-status-report-2026 — TNFD 2026 Status Report
// -----------------------------------------------------------------------------

const tnfd_ca: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Acceptable amb matisos",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Esmentat",
        note: "El concepte equivalent —dependència i impacte en natura al value chain— és recomanat però opcional.",
      },
      {
        name: "Termes temporals",
        status: "verd",
        label: "Quantificat",
        note: "Tracking anual amb fites identificables i balanç acumulat des del llançament 2023.",
      },
      {
        name: "Fonts independents",
        status: "verd",
        label: "Quantificat",
        note: "Dades d'adopció verificades amb enquesta pròpia i corroborades amb disclosures públics.",
      },
      {
        name: "Granularitat",
        status: "groc",
        label: "Esmentat",
        note: "Cobertura sectorial limitada: pocs sectors amb protocols específics desenvolupats.",
      },
      {
        name: "Verificació externa",
        status: "groc",
        label: "Esmentat",
        note: "Auto-reporting d'adopció; sense verificació externa del nivell real d'implementació.",
      },
    ],
  },
  dadesClau: [
    { value: "520+", label: "organitzacions adoptants alineades amb TNFD", page: "p. 8" },
    { value: "76", label: "països amb almenys una organització adoptant", page: "p. 15" },
    { value: "14", label: "sectors amb guies específiques publicades", page: "p. 27" },
    { value: "3 anys", label: "trajectòria des del llançament del framework 2023", page: "p. 4" },
    { value: "42%", label: "adoptants amb ubicacions a EU (concentració regional)", page: "p. 33" },
  ],
  resumExecutiu:
    "La Taskforce on Nature-related Financial Disclosures publica el seu Status Report 2026, primer balanç global acumulat des del llançament del framework el setembre 2023. El document confirma que més de 520 organitzacions —distribuïdes en 76 països— s'han alineat formalment amb les 14 recomanacions TNFD, amb concentració significativa a Europa (42%) i creixement ràpid a Àsia-Pacífic. El balanç identifica patrons d'adopció desiguals: els sectors financer i d'alimentació/beure lideren la implementació, mentre que construcció i tèxtil queden endarrerits. El report també confirma que la integració amb GRI 101 Biodiversitat 2024 i amb ISSB S1/S2 està avançant, fet que facilitarà el compliment múltiple. L'informe destaca que el LEAP approach (Locate, Evaluate, Assess, Prepare) s'ha consolidat com a metodologia de facto per a l'avaluació de riscos de natura, però admet que la granularitat sectorial és limitada: només 14 sectors tenen guies específiques. El report també reconeix un gap crític en dades espacials: les eines geolocalitzades per a dependències i impactes en natura encara cobreixen menys del 30% dels biomes globals. La crítica recurrent: l'adopció és voluntària i no hi ha mecanisme per verificar el nivell real d'implementació més enllà de l'autodeclaració. El TNFD anuncia que durant 2027 explorarà l'eventual conversió en standard mandatory sota la interlocució amb el post-2020 Global Biodiversity Framework.",
  implicacions: {
    empreses:
      "Per a les empreses amb dependències materials en natura (agroalimentària, farma, turisme, fusta), el TNFD esdevé framework de referència. Les primeres adoptants guanyen capacitat de gestió de riscos reputacional i operacional, però assumeixen costos de preparació elevats. Les que esperin es trobaran en desavantatge competitiu davant reguladors i inversors.",
    reguladors:
      "Per als reguladors, el TNFD és la base tècnica sobre la qual construir futurs mandats. La UE ha integrat TNFD al ESRS E4 i la UK post-2025 està explorant adoptar-lo com a standard. La coordinació amb el Global Biodiversity Framework de CBD és clau per evitar duplicacions. Falta definir qui supervisa i verifica la qualitat dels disclosures.",
    ciutadans:
      "Per als ciutadans, el TNFD és una promesa de transparència sobre com les empreses depenen i impacten en la natura que els envolta. Però la naturalesa voluntària fa que moltes empreses rellevants encara no reportin. La societat civil hauria de demanar accés a les dades geolocalitzades per poder verificar impactes en territoris concrets.",
  },
  mesEnllaCheckbox: {
    criteri: "Sostenibilitat absoluta + Arrelament territorial",
    body:
      "El TNFD avança cap a la transparència, però corre el risc de quedar en exercici comptable: quantificar impactes sense aturar-los. La sostenibilitat absoluta exigeix llindars ecològics —com els planetary boundaries— que el framework encara no incorpora com a referència normativa. Alhora, l'enfocament geolocalitzat del LEAP és prometedor per arrelar el reporting en territoris concrets, però la majoria d'empreses encara no publiquen les coordenades dels seus impactes materials. Sense aquesta granularitat territorial, les comunitats afectades no poden exercir drets ni verificar danys. La propera frontera del TNFD ha de ser posar els mapes a disposició pública.",
  },
  connexions: [
    {
      type: "Complement",
      target: "EFRAG Sustainability Reporting Work Programme 2026",
      desc: "L'EFRAG pren TNFD com a base tècnica per al desenvolupament del sectoral standard E4 Biodiversitat.",
    },
    {
      type: "Evolució",
      target: "Europe Sustainable Development Report 2026",
      desc: "Els ODS 14 i 15 del SDSN utilitzen mètriques parcialment alineades amb TNFD per a territori europeu.",
    },
    {
      type: "Complement",
      target: "EU Taxonomy: Delegated Act de simplificació",
      desc: "Els criteris de Taxonomia per a activitats amb impacte en ecosistemes requereixen dades TNFD per verificar alignment.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Fer un screening inicial de dependències en natura",
      desc: "Utilitzar ENCORE i les guies sectorials TNFD per identificar hotspots al value chain.",
      effort: "Baix",
      impact: "Mitjà",
    },
    {
      num: "02",
      title: "Aplicar el LEAP approach a un pilot sectorial",
      desc: "Començar per una unitat de negoci amb dependència clara (agricola, forestal, mineria) i generar informe intern.",
      effort: "Alt",
      impact: "Alt",
    },
    {
      num: "03",
      title: "Geolocalitzar els actius operacionals materials",
      desc: "Construir base de dades GIS amb ubicacions i biomes; creuar amb eines IBAT per a àrees protegides.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "04",
      title: "Publicar un disclosure TNFD simplificat al primer any",
      desc: "Aprofitar la flexibilitat del framework per publicar 4-5 indicadors bàsics i anar creixent any rere any.",
      effort: "Baix",
      impact: "Mitjà",
    },
  ],
  crossRefs: [
    { framework: "TNFD", criterion: "14 recomanacions + LEAP approach", impact: "Alt" },
    { framework: "GRI", criterion: "GRI 101 Biodiversitat 2024 — interoperabilitat", impact: "Alt" },
    { framework: "CSRD/ESRS", criterion: "E4 Biodiversitat i ecosistemes", impact: "Alt" },
    { framework: "MSCI ESG", criterion: "Pillars Environmental amb naturalesa", impact: "Mitjà" },
  ],
};

const tnfd_es: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Aceptable con matices",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Mencionado",
        note: "El concepto equivalente —dependencia e impacto en naturaleza en value chain— es recomendado pero opcional.",
      },
      {
        name: "Términos temporales",
        status: "verd",
        label: "Cuantificado",
        note: "Tracking anual con hitos identificables y balance acumulado desde el lanzamiento 2023.",
      },
      {
        name: "Fuentes independientes",
        status: "verd",
        label: "Cuantificado",
        note: "Datos de adopción verificados con encuesta propia y corroborados con disclosures públicos.",
      },
      {
        name: "Granularidad",
        status: "groc",
        label: "Mencionado",
        note: "Cobertura sectorial limitada: pocos sectores con protocolos específicos desarrollados.",
      },
      {
        name: "Verificación externa",
        status: "groc",
        label: "Mencionado",
        note: "Auto-reporting de adopción; sin verificación externa del nivel real de implementación.",
      },
    ],
  },
  dadesClau: [
    { value: "520+", label: "organizaciones adoptantes alineadas con TNFD", page: "p. 8" },
    { value: "76", label: "países con al menos una organización adoptante", page: "p. 15" },
    { value: "14", label: "sectores con guías específicas publicadas", page: "p. 27" },
    { value: "3 años", label: "trayectoria desde el lanzamiento del framework 2023", page: "p. 4" },
    { value: "42%", label: "adoptantes con ubicaciones en UE (concentración regional)", page: "p. 33" },
  ],
  resumExecutiu:
    "La Taskforce on Nature-related Financial Disclosures publica su Status Report 2026, primer balance global acumulado desde el lanzamiento del framework en septiembre 2023. El documento confirma que más de 520 organizaciones —distribuidas en 76 países— se han alineado formalmente con las 14 recomendaciones TNFD, con concentración significativa en Europa (42%) y crecimiento rápido en Asia-Pacífico. El balance identifica patrones de adopción desiguales: los sectores financiero y de alimentación/bebida lideran la implementación, mientras que construcción y textil quedan rezagados. El reporte también confirma que la integración con GRI 101 Biodiversidad 2024 y con ISSB S1/S2 está avanzando, lo que facilitará el cumplimiento múltiple. El informe destaca que el enfoque LEAP (Locate, Evaluate, Assess, Prepare) se ha consolidado como metodología de facto para la evaluación de riesgos de naturaleza, pero admite que la granularidad sectorial es limitada: solo 14 sectores tienen guías específicas. El reporte también reconoce un gap crítico en datos espaciales: las herramientas geolocalizadas para dependencias e impactos en naturaleza aún cubren menos del 30% de los biomas globales. La crítica recurrente: la adopción es voluntaria y no hay mecanismo para verificar el nivel real de implementación más allá de la autodeclaración. El TNFD anuncia que durante 2027 explorará la eventual conversión en estándar mandatory bajo la interlocución con el post-2020 Global Biodiversity Framework.",
  implicacions: {
    empreses:
      "Para las empresas con dependencias materiales en naturaleza (agroalimentaria, farma, turismo, madera), el TNFD se vuelve framework de referencia. Las primeras adoptantes ganan capacidad de gestión de riesgos reputacional y operacional, pero asumen costes de preparación elevados. Las que esperen se encontrarán en desventaja competitiva ante reguladores e inversores.",
    reguladors:
      "Para los reguladores, el TNFD es la base técnica sobre la que construir futuros mandatos. La UE ha integrado TNFD en el ESRS E4 y el Reino Unido post-2025 está explorando adoptarlo como estándar. La coordinación con el Global Biodiversity Framework de CBD es clave para evitar duplicaciones. Falta definir quién supervisa y verifica la calidad de los disclosures.",
    ciutadans:
      "Para los ciudadanos, el TNFD es una promesa de transparencia sobre cómo las empresas dependen e impactan en la naturaleza que les rodea. Pero la naturaleza voluntaria hace que muchas empresas relevantes aún no reporten. La sociedad civil debería pedir acceso a los datos geolocalizados para poder verificar impactos en territorios concretos.",
  },
  mesEnllaCheckbox: {
    criteri: "Sostenibilidad absoluta + Arraigamiento territorial",
    body:
      "El TNFD avanza hacia la transparencia, pero corre el riesgo de quedarse en ejercicio contable: cuantificar impactos sin detenerlos. La sostenibilidad absoluta exige umbrales ecológicos —como los planetary boundaries— que el framework aún no incorpora como referencia normativa. Al mismo tiempo, el enfoque geolocalizado del LEAP es prometedor para arraigar el reporting en territorios concretos, pero la mayoría de empresas aún no publican las coordenadas de sus impactos materiales. Sin esta granularidad territorial, las comunidades afectadas no pueden ejercer derechos ni verificar daños. La próxima frontera del TNFD debe ser poner los mapas a disposición pública.",
  },
  connexions: [
    {
      type: "Complemento",
      target: "EFRAG Sustainability Reporting Work Programme 2026",
      desc: "El EFRAG toma TNFD como base técnica para el desarrollo del sectoral standard E4 Biodiversidad.",
    },
    {
      type: "Evolución",
      target: "Europe Sustainable Development Report 2026",
      desc: "Los ODS 14 y 15 del SDSN utilizan métricas parcialmente alineadas con TNFD para territorio europeo.",
    },
    {
      type: "Complemento",
      target: "EU Taxonomy: Delegated Act de simplificación",
      desc: "Los criterios de Taxonomía para actividades con impacto en ecosistemas requieren datos TNFD para verificar alignment.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Hacer un screening inicial de dependencias en naturaleza",
      desc: "Utilizar ENCORE y las guías sectoriales TNFD para identificar hotspots en el value chain.",
      effort: "Bajo",
      impact: "Medio",
    },
    {
      num: "02",
      title: "Aplicar el enfoque LEAP a un piloto sectorial",
      desc: "Empezar por una unidad de negocio con dependencia clara (agrícola, forestal, minería) y generar informe interno.",
      effort: "Alto",
      impact: "Alto",
    },
    {
      num: "03",
      title: "Geolocalizar los activos operacionales materiales",
      desc: "Construir base de datos GIS con ubicaciones y biomas; cruzar con herramientas IBAT para áreas protegidas.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "04",
      title: "Publicar un disclosure TNFD simplificado en el primer año",
      desc: "Aprovechar la flexibilidad del framework para publicar 4-5 indicadores básicos e ir creciendo año tras año.",
      effort: "Bajo",
      impact: "Medio",
    },
  ],
  crossRefs: [
    { framework: "TNFD", criterion: "14 recomendaciones + enfoque LEAP", impact: "Alto" },
    { framework: "GRI", criterion: "GRI 101 Biodiversidad 2024 — interoperabilidad", impact: "Alto" },
    { framework: "CSRD/ESRS", criterion: "E4 Biodiversidad y ecosistemas", impact: "Alto" },
    { framework: "MSCI ESG", criterion: "Pillars Environmental con naturaleza", impact: "Medio" },
  ],
};

// -----------------------------------------------------------------------------
// 6. bcorp-new-standards-2026 — B Lab Standards V2.1
// -----------------------------------------------------------------------------

const bcorp_ca: ReportBlock = {
  semafor: {
    grade: "A",
    gradeLabel: "Rigorós",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "verd",
        label: "Quantificat",
        note: "El nou Environment standard exigeix quantificació Scope 3 categories 1 i 11 per a totes les B Corps.",
      },
      {
        name: "Termes temporals",
        status: "verd",
        label: "Quantificat",
        note: "Recertificació obligatòria cada 3 anys amb dates clau anunciades amb 24 mesos d'antelació.",
      },
      {
        name: "Fonts independents",
        status: "verd",
        label: "Quantificat",
        note: "Standards Council independent, procés d'avaluació públic i documents de suport accessibles.",
      },
      {
        name: "Granularitat",
        status: "verd",
        label: "Quantificat",
        note: "Requirements per mida, sector i regió; granularitat operacional detallada.",
      },
      {
        name: "Verificació externa",
        status: "verd",
        label: "Quantificat",
        note: "Avaluació per B Lab i verificació documental per acreditats independents; risk-based sampling.",
      },
    ],
  },
  dadesClau: [
    { value: "V2.1", label: "versió dels Standards en vigor des de gener 2026", page: "p. 4" },
    { value: "9", label: "empreses pioneres ja recertificant-se", page: "p. 17" },
    { value: "març 2026", label: "obertura a noves certificacions amb V2.1", page: "p. 22" },
    { value: "80", label: "punts mínims sobre 200 per a la certificació", page: "p. 9" },
    { value: "3 anys", label: "cicle de recertificació obligatòria", page: "p. 31" },
  ],
  resumExecutiu:
    "B Lab Global publica la implementació definitiva dels Standards V2.1, marcant el canvi més profund des de la creació del moviment B Corp. A partir de gener 2026, les empreses amb certificació vigent comencen el procés de recertificació sota els nous standards; al març 2026 s'obre la porta a noves certificacions. Les 9 empreses pioneres que ja han completat el procés —majoritàriament pimes i mitjanes empreses d'Europa i Amèrica Llatina— serveixen de cas d'estudi per validar la metodologia. Els V2.1 reestructuren completament el framework anterior: dels 5 Impact Areas heretats es passa a 8 Standards temàtics (Governance, Workers, Community, Environment, Customers, Land, Justice i Economic Systems), cadascun amb requirements obligatoris i disclosures. Els canvis més rellevants són: (1) incorporació de requirements de Justice, Equity, Diversity i Inclusion (JEDI) com a core, no com a bonus; (2) obligació de reporting públic sencer —no només score agregat—; (3) eliminació de la possibilitat de canviar legal purpose com a prerequisit exclusiu, integrat al standard Governance; (4) introducció del concepte de 'reciprocity' que obliga a estendre pràctiques a la cadena de subministrament; (5) requirements específics per a la transició ecològica amb fites quantitatives. La crítica reconeguda pel mateix B Lab: el cost de preparació és elevat i pot excloure pimes amb menys capacitat.",
  implicacions: {
    empreses:
      "Per a les B Corps existents, els V2.1 signifiquen un salt d'exigència substancial: algunes perdran la certificació si no s'hi adapten. Per a les candidates, el cost-benefici canvia: més cost de compliance però més credibilitat de mercat. Les pimes mediterrànies amb pràctiques sòlides però poca capacitat administrativa necessitaran suport extern per navegar el procés.",
    reguladors:
      "Per als reguladors, els V2.1 són un referent de rigor en certificació voluntària. Haurien d'inspirar el redisseny d'esquemes públics (segells, etiquetes) que avui estan per sota en exigència. La convergència amb CSRD/ESRS i amb GRI augmenta la coherència del sistema. Falta mecanisme públic de reconeixement oficial.",
    ciutadans:
      "Per als ciutadans, els nous standards signifiquen que el segell B Corp torna a ser credible després d'anys de crítiques per 'B Corp washing'. Els consumidors poden confar més en el segell com a indicador de pràctica real. Però la transparència completa —accedir a l'avaluació sencer— encara requereix navegació per la web de B Lab.",
  },
  mesEnllaCheckbox: {
    criteri: "Dignitat humana + Justícia distributiva",
    body:
      "Els V2.1 fan un pas remarcable al integrar JEDI com a core i no com a bonus: reconeixen que la sostenibilitat sense equitat és exercici parcial. Però la justícia distributiva exigeix anar més enllà de les pràctiques internes i mirar la cadena de valor: quines empreses decideixen deixar fora, quines comunitats afecten, com es reparteix la riquesa generada. El standard de 'reciprocity' apunta en aquesta direcció però queda curt en mecanismes verificables. La propera frontera hauria de ser la incorporació de mètriques de ràtio salarial màxim-mínim i d'impacte en comunitats territorials concretes, no només agregades.",
  },
  connexions: [
    {
      type: "Complement",
      target: "EcoVadis Methodology Updates Q1 2026",
      desc: "Ambdós frameworks evolucionen en direcció similar: més rigor, integració amb GRI i èmfasi en drets humans.",
    },
    {
      type: "Evolució",
      target: "Revisió dels ESRS: simplificació del CSRD",
      desc: "Mentre el CSRD simplifica, els V2.1 van en direcció oposada: augmenten l'exigència. Divergència estratègica.",
    },
    {
      type: "Complement",
      target: "CSDDD: modificacions Omnibus I definitives",
      desc: "Els standards de Justice i Workers anticipen i superen les exigències del CSDDD en drets laborals.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Fer un gap analysis entre V2.0 i V2.1",
      desc: "Identificar quins nous requirements afecten l'empresa i construir pla de tancament amb 12 mesos de marge.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "02",
      title: "Integrar JEDI al sistema intern de RRHH",
      desc: "Política salarial, composició de la plantilla, board diversity i procés de queixa intern com a mínim.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "03",
      title: "Mapejar la cadena de subministrament per reciprocity",
      desc: "Identificar els 20 proveïdors clave i comunicar-los els standards esperats; oferir suport als més petits.",
      effort: "Alt",
      impact: "Mitjà",
    },
    {
      num: "04",
      title: "Documentar la transició ecològica amb fites quantitatives",
      desc: "Pla de reducció d'emissions amb fites 2030 i 2040, amb inversió en eficiència i renovables verificable.",
      effort: "Mitjà",
      impact: "Alt",
    },
  ],
  crossRefs: [
    { framework: "B Corp", criterion: "B Impact Assessment (BIA) V2.1", impact: "Alt" },
    { framework: "GRI", criterion: "Universal Standards + sectorials", impact: "Mitjà" },
    { framework: "UN Global Compact", criterion: "10 principis com a base ètica", impact: "Mitjà" },
    { framework: "CSRD/ESRS", criterion: "S1 (own workforce) + G1 (business conduct)", impact: "Mitjà" },
  ],
};

const bcorp_es: ReportBlock = {
  semafor: {
    grade: "A",
    gradeLabel: "Riguroso",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "verd",
        label: "Cuantificado",
        note: "El nuevo Environment standard exige cuantificación Scope 3 categorías 1 y 11 para todas las B Corps.",
      },
      {
        name: "Términos temporales",
        status: "verd",
        label: "Cuantificado",
        note: "Recertificación obligatoria cada 3 años con fechas clave anunciadas con 24 meses de antelación.",
      },
      {
        name: "Fuentes independientes",
        status: "verd",
        label: "Cuantificado",
        note: "Standards Council independiente, proceso de evaluación público y documentos de soporte accesibles.",
      },
      {
        name: "Granularidad",
        status: "verd",
        label: "Cuantificado",
        note: "Requirements por tamaño, sector y región; granularidad operacional detallada.",
      },
      {
        name: "Verificación externa",
        status: "verd",
        label: "Cuantificado",
        note: "Evaluación por B Lab y verificación documental por acreditados independientes; risk-based sampling.",
      },
    ],
  },
  dadesClau: [
    { value: "V2.1", label: "versión de los Standards en vigor desde enero 2026", page: "p. 4" },
    { value: "9", label: "empresas pioneras ya recertificándose", page: "p. 17" },
    { value: "marzo 2026", label: "apertura a nuevas certificaciones con V2.1", page: "p. 22" },
    { value: "80", label: "puntos mínimos sobre 200 para la certificación", page: "p. 9" },
    { value: "3 años", label: "ciclo de recertificación obligatoria", page: "p. 31" },
  ],
  resumExecutiu:
    "B Lab Global publica la implementación definitiva de los Standards V2.1, marcando el cambio más profundo desde la creación del movimiento B Corp. A partir de enero 2026, las empresas con certificación vigente comienzan el proceso de recertificación bajo los nuevos estándares; en marzo 2026 se abre la puerta a nuevas certificaciones. Las 9 empresas pioneras que ya han completado el proceso —mayoritariamente pymes y medianas empresas de Europa y América Latina— sirven de caso de estudio para validar la metodología. Los V2.1 reestructuran completamente el framework anterior: de los 5 Impact Areas heredados se pasa a 8 Standards temáticos (Governance, Workers, Community, Environment, Customers, Land, Justice y Economic Systems), cada uno con requirements obligatorios y disclosures. Los cambios más relevantes son: (1) incorporación de requirements de Justice, Equity, Diversity e Inclusion (JEDI) como core, no como bonus; (2) obligación de reporting público completo —no solo score agregado—; (3) eliminación de la posibilidad de cambio de propósito legal como prerequisito exclusivo, integrado al standard Governance; (4) introducción del concepto de 'reciprocity' que obliga a extender prácticas a la cadena de suministro; (5) requirements específicos para la transición ecológica con metas cuantitativas. La crítica reconocida por el propio B Lab: el coste de preparación es elevado y puede excluir pymes con menor capacidad.",
  implicacions: {
    empreses:
      "Para las B Corps existentes, los V2.1 significan un salto de exigencia sustancial: algunas perderán la certificación si no se adaptan. Para las candidatas, el coste-beneficio cambia: más coste de compliance pero más credibilidad de mercado. Las pymes mediterráneas con prácticas sólidas pero poca capacidad administrativa necesitarán soporte externo para navegar el proceso.",
    reguladors:
      "Para los reguladores, los V2.1 son un referente de rigor en certificación voluntaria. Deberían inspirar el rediseño de esquemas públicos (sellos, etiquetas) que hoy están por debajo en exigencia. La convergencia con CSRD/ESRS y con GRI aumenta la coherencia del sistema. Falta mecanismo público de reconocimiento oficial.",
    ciutadans:
      "Para los ciudadanos, los nuevos estándares significan que el sello B Corp vuelve a ser creíble después de años de críticas por 'B Corp washing'. Los consumidores pueden confiar más en el sello como indicador de práctica real. Pero la transparencia completa —acceder a la evaluación completa— aún requiere navegación por la web de B Lab.",
  },
  mesEnllaCheckbox: {
    criteri: "Dignidad humana + Justicia distributiva",
    body:
      "Los V2.1 dan un paso remarcable al integrar JEDI como core y no como bonus: reconocen que la sostenibilidad sin equidad es ejercicio parcial. Pero la justicia distributiva exige ir más allá de las prácticas internas y mirar la cadena de valor: qué empresas deciden dejar fuera, qué comunidades afectan, cómo se reparte la riqueza generada. El standard de 'reciprocity' apunta en esta dirección pero queda corto en mecanismos verificables. La próxima frontera debería ser la incorporación de métricas de ratio salarial máximo-mínimo y de impacto en comunidades territoriales concretas, no solo agregadas.",
  },
  connexions: [
    {
      type: "Complemento",
      target: "EcoVadis Methodology Updates Q1 2026",
      desc: "Ambos frameworks evolucionan en dirección similar: más rigor, integración con GRI y énfasis en derechos humanos.",
    },
    {
      type: "Evolución",
      target: "Revisión de los ESRS: simplificación del CSRD",
      desc: "Mientras el CSRD simplifica, los V2.1 van en dirección opuesta: aumentan la exigencia. Divergencia estratégica.",
    },
    {
      type: "Complemento",
      target: "CSDDD: modificaciones Omnibus I definitivas",
      desc: "Los estándares de Justice y Workers anticipan y superan las exigencias del CSDDD en derechos laborales.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Hacer un gap analysis entre V2.0 y V2.1",
      desc: "Identificar qué nuevos requirements afectan a la empresa y construir plan de cierre con 12 meses de margen.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "02",
      title: "Integrar JEDI en el sistema interno de RRHH",
      desc: "Política salarial, composición de la plantilla, board diversity y proceso de queja interno como mínimo.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "03",
      title: "Mapear la cadena de suministro para reciprocity",
      desc: "Identificar los 20 proveedores clave y comunicarles los estándares esperados; ofrecer soporte a los más pequeños.",
      effort: "Alto",
      impact: "Medio",
    },
    {
      num: "04",
      title: "Documentar la transición ecológica con metas cuantitativas",
      desc: "Plan de reducción de emisiones con metas 2030 y 2040, con inversión en eficiencia y renovables verificable.",
      effort: "Medio",
      impact: "Alto",
    },
  ],
  crossRefs: [
    { framework: "B Corp", criterion: "B Impact Assessment (BIA) V2.1", impact: "Alto" },
    { framework: "GRI", criterion: "Universal Standards + sectoriales", impact: "Medio" },
    { framework: "UN Global Compact", criterion: "10 principios como base ética", impact: "Medio" },
    { framework: "CSRD/ESRS", criterion: "S1 (own workforce) + G1 (business conduct)", impact: "Medio" },
  ],
};

// -----------------------------------------------------------------------------
// 7. csddd-omnibus-març-2026 — CSDDD: modificacions Omnibus I definitives
// -----------------------------------------------------------------------------

const csddd_ca: ReportBlock = {
  semafor: {
    grade: "C",
    gradeLabel: "Feble metodològicament",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Esmentat",
        note: "S'estén la due diligence als socis comercials però amb thresholds d'empleats i volum més alts que limiten cobertura real.",
      },
      {
        name: "Termes temporals",
        status: "verd",
        label: "Quantificat",
        note: "Aplicació per fases ben definida amb dates clares al llarg del 2027-2029.",
      },
      {
        name: "Fonts independents",
        status: "groc",
        label: "Esmentat",
        note: "Directiva europea amb procés legislatiu obert, però pressió industrial evident en les modificacions finals.",
      },
      {
        name: "Granularitat",
        status: "vermell",
        label: "Ignorat",
        note: "Reducció de l'abast a 1.000 empleats i 450M€ volum limita dràsticament el nombre d'empreses obligades.",
      },
      {
        name: "Verificació externa",
        status: "groc",
        label: "Esmentat",
        note: "Supervisió per estats membres però sense mecanisme harmonitzat a nivell UE.",
      },
    ],
  },
  dadesClau: [
    { value: "18 març 2026", label: "entrada en vigor de l'Omnibus I Amending Directive", page: "p. 5" },
    { value: "1.000+", label: "empleats i 450M€ volum per caure sota l'abast", page: "p. 14" },
    { value: "5.400", label: "empreses obligades estimades (vs 13.000 abans)", page: "p. 19" },
    { value: "2027-2029", label: "aplicació per fases segons mida empresarial", page: "p. 27" },
    { value: "5%", label: "del volum nete com a threshold per a socis comercials", page: "p. 33" },
  ],
  resumExecutiu:
    "La Comissió Europea publica la versió definitiva de l'Omnibus I Amending Directive que modifica la Corporate Sustainability Due Diligence Directive (CSDDD). L'entrada en vigor és el 18 de març de 2026, amb aplicació progressiva entre 2027 i 2029 segons la mida empresarial. La directiva original aprovada el 2024 obligava unes 13.000 empreses; l'Omnibus I redueix aquest nombre a aproximadament 5.400 en elevar els thresholds a 1.000 empleats i 450 milions d'euros de volum nete. Aquesta reducció d'abast és la decisió més polèmica del paquet. Pel que fa a la cadena de subministrament, es manté l'obligació de due diligence sobre socis comercials, però el threshold s'eleva al 5% del volum nete de l'empresa (abans era indiscriminat). La directiva reforça, en canvi, l'enfocament en drets humans: l'annex I amb els convenis internacionals de referència s'amplia amb el Conveni 190 de l'OIT sobre assetjament i violència. Es manté el règim de responsabilitat civil per danys causats per incompliment, però amb càrrega de la prova més favorable a l'empresa. La clàusula de transició climàtica es debilita: les empreses només han d'elaborar un pla de transició compatible amb 1,5°C, sense obligació concreta de reducció. La crítica recurrent: l'Omnibus I suposa un retrocés substantiu respecte al compromís inicial de la UE amb la due diligence obligatòria. Els defensors argumenten que millora la viabilitat operativa sense desnaturalitzar la directiva.",
  implicacions: {
    empreses:
      "Per a les grans empreses que queden dins l'abast, l'Omnibus I alleuja càrrega en dos fronts: menys socis comercials a monitoritzar i règim de responsabilitat més manejable. Però la incertesa sobre futures revisions fa difícil planificar inversions de llarg termini. Les pimes que queden fora de l'abast directe segueixen sent pressionades via clàusules contractuals pels seus clients obligats.",
    reguladors:
      "Per als reguladors nacionals, l'Omnibus I arriba amb terminis justos per transposar a dret intern. La manca d'harmonització en supervisió pot crear carrils reguladors divergents entre estats membres. La Comissió perd credibilitat en la defensa dels drets humans com a prioritat política. La pressió per nous reculsos en properes legislatures queda oberta.",
    ciutadans:
      "Per a la ciutadania —especialment treballadors de la cadena global i comunitats afectades per abusos—, la reducció d'abast és una mala notícia: menys empreses supervisades significa menys protecció efectiva. Les ONG de drets humans perden eina legal clau. La societat civil europea hauria de mobilizar-se per mantenir la pressió sobre les empreses voluntàriament subjectes a estàndards alts.",
  },
  mesEnllaCheckbox: {
    criteri: "Dignitat humana + Co-decisió democràtica",
    body:
      "Elevant el threshold a 1.000 empleats, l'Omnibus I exclou milers d'empreses que també produeixen impactes materials en drets humans. La decisió tècnica amaga una opció ètica: protegir l'estructura industrial europea per sobre de les víctimes potencials a la cadena global. La co-decisió democràtica queda mermada perquè els parlaments nacionals transposen una directiva ja retallada, sense capacitat real d'eixamplar l'abast. La veu dels treballadors i comunitats del Sud Global —els principals afectats— no ha tingut representació en el procés. Sense mecanismes d'accés a la justícia efectius per a aquestes víctimes, la due diligence queda en compliance documental.",
  },
  connexions: [
    {
      type: "Contradicció",
      target: "Revisió dels ESRS: simplificació del CSRD",
      desc: "Ambdós actes simplifiquen però en direccions divergents: el CSRD redueix reporting, el CSDDD redueix abast material.",
    },
    {
      type: "Complement",
      target: "B Lab Standards V2.1: nova era per a B Corps",
      desc: "Els standards B Corp V2.1 cobreixen el gap deixat pel CSDDD en exigir reciprocity a la cadena.",
    },
    {
      type: "Evolució",
      target: "EcoVadis Methodology Updates Q1 2026",
      desc: "EcoVadis introdueix mòdul Human Rights alineat amb el CSDDD, anticipant l'entrada en vigor.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Verificar si l'empresa cau sota el nou abast",
      desc: "Calcular empleats i volum nete consolidat; en cas límit, planificar per ambdós escenaris.",
      effort: "Baix",
      impact: "Mitjà",
    },
    {
      num: "02",
      title: "Revisar la llista de socis comercials materials",
      desc: "Identificar aquells per sobre del 5% del volum; restringir la due diligence als realment crítics.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "03",
      title: "Dissenyar el pla de transició climàtica 1,5°C",
      desc: "Trajectòria d'emissions amb fets 2030, 2040 i 2050; alinear amb SBTi o equivalent reconegut.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "04",
      title: "Establir un canal de queixa accessible",
      desc: "Procés d'alerta intern i extern per a treballadors i comunitats afectades, amb protecció de represàlies.",
      effort: "Baix",
      impact: "Alt",
    },
  ],
  crossRefs: [
    { framework: "UN Global Compact", criterion: "10 principis com a base ètica del due diligence", impact: "Alt" },
    { framework: "CSRD/ESRS", criterion: "G1 Business Conduct + S1-S2 workforce", impact: "Alt" },
    { framework: "EcoVadis", criterion: "Mòdul Labor & Human Rights", impact: "Mitjà" },
    { framework: "B Corp", criterion: "Standards V2.1 — Workers + Community", impact: "Mitjà" },
  ],
};

const csddd_es: ReportBlock = {
  semafor: {
    grade: "C",
    gradeLabel: "Débil metodológicamente",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Mencionado",
        note: "Se extiende la due diligence a socios comerciales pero con thresholds de empleados y volumen más altos que limitan la cobertura real.",
      },
      {
        name: "Términos temporales",
        status: "verd",
        label: "Cuantificado",
        note: "Aplicación por fases bien definida con fechas claras a lo largo de 2027-2029.",
      },
      {
        name: "Fuentes independientes",
        status: "groc",
        label: "Mencionado",
        note: "Directiva europea con proceso legislativo abierto, pero presión industrial evidente en las modificaciones finales.",
      },
      {
        name: "Granularidad",
        status: "vermell",
        label: "Ignorado",
        note: "Reducción del alcance a 1.000 empleados y 450M€ volumen limita drásticamente el número de empresas obligadas.",
      },
      {
        name: "Verificación externa",
        status: "groc",
        label: "Mencionado",
        note: "Supervisión por estados miembros pero sin mecanismo armonizado a nivel UE.",
      },
    ],
  },
  dadesClau: [
    { value: "18 marzo 2026", label: "entrada en vigor de la Omnibus I Amending Directive", page: "p. 5" },
    { value: "1.000+", label: "empleados y 450M€ volumen para caer bajo el alcance", page: "p. 14" },
    { value: "5.400", label: "empresas obligadas estimadas (vs 13.000 antes)", page: "p. 19" },
    { value: "2027-2029", label: "aplicación por fases según tamaño empresarial", page: "p. 27" },
    { value: "5%", label: "del volumen neto como threshold para socios comerciales", page: "p. 33" },
  ],
  resumExecutiu:
    "La Comisión Europea publica la versión definitiva del Omnibus I Amending Directive que modifica la Corporate Sustainability Due Diligence Directive (CSDDD). La entrada en vigor es el 18 de marzo de 2026, con aplicación progresiva entre 2027 y 2029 según el tamaño empresarial. La directiva original aprobada en 2024 obligaba a unas 13.000 empresas; el Omnibus I reduce este número a aproximadamente 5.400 al elevar los thresholds a 1.000 empleados y 450 millones de euros de volumen neto. Esta reducción de alcance es la decisión más polémica del paquete. En cuanto a la cadena de suministro, se mantiene la obligación de due diligence sobre socios comerciales, pero el threshold se eleva al 5% del volumen neto de la empresa (antes era indiscriminado). La directiva refuerza, en cambio, el enfoque en derechos humanos: el anexo I con los convenios internacionales de referencia se amplía con el Convenio 190 de la OIT sobre acoso y violencia. Se mantiene el régimen de responsabilidad civil por daños causados por incumplimiento, pero con carga de la prueba más favorable a la empresa. La cláusula de transición climática se debilita: las empresas solo deben elaborar un plan de transición compatible con 1,5°C, sin obligación concreta de reducción. La crítica recurrente: el Omnibus I supone un retroceso sustancial respecto al compromiso inicial de la UE con la due diligence obligatoria. Los defensores argumentan que mejora la viabilidad operativa sin desnaturalizar la directiva.",
  implicacions: {
    empreses:
      "Para las grandes empresas que quedan dentro del alcance, el Omnibus I alivia carga en dos frentes: menos socios comerciales a monitorizar y régimen de responsabilidad más manejable. Pero la incertidumbre sobre futuras revisiones hace difícil planificar inversiones de largo plazo. Las pymes que quedan fuera del alcance directo siguen siendo presionadas vía cláusulas contractuales por sus clientes obligados.",
    reguladors:
      "Para los reguladores nacionales, el Omnibus I llega con plazos justos para transponer a derecho interno. La falta de armonización en supervisión puede crear carriles regulatorios divergentes entre estados miembros. La Comisión pierde credibilidad en la defensa de los derechos humanos como prioridad política. La presión por nuevos retrocesos en próximas legislaturas queda abierta.",
    ciutadans:
      "Para la ciudadanía —especialmente trabajadores de la cadena global y comunidades afectadas por abusos—, la reducción de alcance es una mala noticia: menos empresas supervisadas significa menos protección efectiva. Las ONG de derechos humanos pierden herramienta legal clave. La sociedad civil europea debería movilizarse para mantener la presión sobre las empresas voluntariamente sujetas a estándares altos.",
  },
  mesEnllaCheckbox: {
    criteri: "Dignidad humana + Co-decisión democrática",
    body:
      "Elevando el threshold a 1.000 empleados, el Omnibus I excluye a miles de empresas que también producen impactos materiales en derechos humanos. La decisión técnica esconde una opción ética: proteger la estructura industrial europea por encima de las víctimas potenciales en la cadena global. La co-decisión democrática queda mermada porque los parlamentos nacionales transponen una directiva ya recortada, sin capacidad real de ampliar el alcance. La voz de los trabajadores y comunidades del Sur Global —los principales afectados— no ha tenido representación en el proceso. Sin mecanismos de acceso a la justicia efectivos para estas víctimas, la due diligence queda en compliance documental.",
  },
  connexions: [
    {
      type: "Contradicción",
      target: "Revisión de los ESRS: simplificación del CSRD",
      desc: "Ambos actos simplifican pero en direcciones divergentes: el CSRD reduce reporting, el CSDDD reduce alcance material.",
    },
    {
      type: "Complemento",
      target: "B Lab Standards V2.1: nueva era para B Corps",
      desc: "Los estándares B Corp V2.1 cubren el gap dejado por el CSDDD al exigir reciprocity en la cadena.",
    },
    {
      type: "Evolución",
      target: "EcoVadis Methodology Updates Q1 2026",
      desc: "EcoVadis introduce módulo Human Rights alineado con el CSDDD, anticipando la entrada en vigor.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Verificar si la empresa cae bajo el nuevo alcance",
      desc: "Calcular empleados y volumen neto consolidado; en caso límite, planificar para ambos escenarios.",
      effort: "Bajo",
      impact: "Medio",
    },
    {
      num: "02",
      title: "Revisar la lista de socios comerciales materiales",
      desc: "Identificar aquellos por encima del 5% del volumen; restringir la due diligence a los realmente críticos.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "03",
      title: "Diseñar el plan de transición climática 1,5°C",
      desc: "Trayectoria de emisiones con metas 2030, 2040 y 2050; alinear con SBTi o equivalente reconocido.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "04",
      title: "Establecer un canal de queja accesible",
      desc: "Proceso de alerta interno y externo para trabajadores y comunidades afectadas, con protección de represalias.",
      effort: "Bajo",
      impact: "Alto",
    },
  ],
  crossRefs: [
    { framework: "UN Global Compact", criterion: "10 principios como base ética del due diligence", impact: "Alto" },
    { framework: "CSRD/ESRS", criterion: "G1 Business Conduct + S1-S2 workforce", impact: "Alto" },
    { framework: "EcoVadis", criterion: "Módulo Labor & Human Rights", impact: "Medio" },
    { framework: "B Corp", criterion: "Standards V2.1 — Workers + Community", impact: "Medio" },
  ],
};

// -----------------------------------------------------------------------------
// 8. iea-global-energy-review-2026 — Global Energy Review 2026
// -----------------------------------------------------------------------------

const iea_ca: ReportBlock = {
  semafor: {
    grade: "A",
    gradeLabel: "Rigorós",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "verd",
        label: "Quantificat",
        note: "Anàlisi completa d'emissions per font primària, regió i sector, amb descomposició fins a nivell subregional.",
      },
      {
        name: "Termes temporals",
        status: "verd",
        label: "Quantificat",
        note: "Sèrie històrica 2010-2025 amb projeccions a 2026 i referències a escenaris WEO 2025 (STEPS, APS, NZE).",
      },
      {
        name: "Fonts independents",
        status: "verd",
        label: "Quantificat",
        note: "Dades primàries d'administracions nacionals, operadors i IEA family; metodologia pública i auditable.",
      },
      {
        name: "Granularitat",
        status: "verd",
        label: "Quantificat",
        note: "Detall per regió (80+), font (12 primàries) i sector (8 macro-sectors amb sub-sectors).",
      },
      {
        name: "Verificació externa",
        status: "verd",
        label: "Quantificat",
        note: "Revisió per parells externs (Energy Institute, BloombergNEF) i publicació de dades obertes.",
      },
    ],
  },
  dadesClau: [
    { value: "4%", label: "creixement de la demanda elèctrica global al 2026", page: "p. 21" },
    { value: "Xina", label: "principal motor del creixement de demanda", page: "p. 28" },
    { value: "60%", label: "quota de renovables en nova capacitat instal·lada", page: "p. 35" },
    { value: "1,2%", label: "creixement de demanda de petroli (vs 1,9% 2025)", page: "p. 42" },
    { value: "2050", label: "any objectiu de neutralitat dels escenaris NZE", page: "p. 67" },
  ],
  resumExecutiu:
    "L'International Energy Agency publica el Global Energy Review 2026, informe anual de referència sobre l'estat i les tendències del mercat energètic mundial. L'edició confirma que la demanda elèctrica global creixerà un 4% al 2026, liderada per la Xina (que suposa el 55% del creixement absolut), l'Índia i el Sud-est asiàtic. Aquest augment està impulsat per tres factors convergents: electrificació d'usos finals (transport, calefacció, indústria), expansió de centres de dades i IA, i creixement econòmic emergent. El 60% de la nova capacitat instal·lada és renovable, però la demanda absoluta de combustibles fòssils encara creix en termes absoluts en països no-OECD. La demanda de petroli creix només un 1,2% (vs 1,9% al 2025), fet que confirma la proximitat del pic. El gas natural experimenta un repunt transient degut a la substitució del carbó en economies en transició. L'informe confirma que les emissions del sector energètic arribaran al pic entre 2025 i 2026, però el declivi posterior no serà suficient per assolir la trajectòria 1,5°C de l'Acord de París sense polítiques addicionals. L'escenari NZE (Net Zero Emissions) requereix una acceleració de la inversió en eficiència i electrificació que els actuals plans nacionals no assoleixen. La crítica principal: l'informe és rigorós però dependent de dades declarades per estats amb interessos divergents; la triangulació amb dades satel·litals hauria de ser el proper salt metodològic.",
  implicacions: {
    empreses:
      "Per a les empreses energointensives, l'informe confirma la tendència cap a l'electrificació: avançar en estratègia d'electrificació de processos és avantatge competitiu. Les utilities tenen oportunitat històrica però també responsabilitat: el creixement elèctric ha de ser amb renovables, no amb fòssils. Les empreses de dades i IA han de gestionar la seva petjada elèctrica creixent amb transparència.",
    reguladors:
      "Per als reguladors, l'informe és base de polítiques energètiques nacionals i europees. Les dades avalen accelerar permisos de renovables, xarxes i emmagatzematge. Però també adverteixen que sense mesures de gestió de demanda —especialment eficiència—, l'objectiu 1,5°C és inabastable. Els països OECD haurien de liderar amb reduccions absolutes més ambicioses.",
    ciutadans:
      "Per als ciutadans, l'informe és lectura obligada per entendre el preu de l'energia i la transició. La bona notícia: les renovables ja són l'opció més barata en la majoria de mercats. La mala notícia: la transició no serà automàtica; requereix inversió pública i privada massiva, i decisions polítiques que la ciutadania ha de legitimar.",
  },
  mesEnllaCheckbox: {
    criteri: "Sostenibilitat absoluta + Justícia distributiva",
    body:
      "L'informe demostra rigor tècnic notable, però la sostenibilitat absoluta exigeix mirar no només el pic d'emissions sinó la trajectòria posterior. La diferència entre el pic 2025-2026 i el camí NZE és abismal: ambdós són 'pic', però un condueix a +2,7°C i l'altre a +1,5°C. El llenguatge tècnic pot amagar la urgència ètica. Alhora, la justícia distributiva és clau: el creixement elèctric de Xina i Índia respon a necessitats legítimes de desenvolupament. Serien els països OECD qui haurien de reduir consum absolut per deixar espai. Sense aquest reconeixement explícit, el discurs europeu de transició corre el risc de ser percebut com a proteccionisme ambiental.",
  },
  connexions: [
    {
      type: "Complement",
      target: "ECB Climate risk stress test: EU banking system",
      desc: "L'IEA aporta dades de demanda energètica que els bancs utilitzen per model·litzar riscos de transició sectorials.",
    },
    {
      type: "Evolució",
      target: "EU Taxonomy: Delegated Act de simplificació",
      desc: "L'escenari NZE de l'IEA és referent per als criteris de Taxonomia en sectors energètics.",
    },
    {
      type: "Complement",
      target: "Europe Sustainable Development Report 2026",
      desc: "L'ODS 7 (energia) i ODS 13 (clima) utilitzen dades IEA com a font primària.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Actualitzar l'anàlisi d'exposició a preus volàtils",
      desc: "Model·litzar impacte de variabilitat de preus elèctrics i gasistes sobre el marge operatiu a 3 anys.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "02",
      title: "Accelerar electrificació de processos tèrmics",
      desc: "Identificar 2-3 processos amb substitució tècnicament viable per bombes de calor o resistència elèctrica.",
      effort: "Alt",
      impact: "Alt",
    },
    {
      num: "03",
      title: "Negociar PPAs renovables a llarg termini",
      desc: "Aprofitar baixada de cost LCOE per tancar contractes a 10-15 anys amb preu fixat o indexat a mercat.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "04",
      title: "Invertir en eficiència energètica com a primera prioritat",
      desc: "Auditoria energètica integral i pla d'inversió en mesures amb payback inferior a 4 anys.",
      effort: "Baix",
      impact: "Mitjà",
    },
  ],
  crossRefs: [
    { framework: "TCFD", criterion: "Escenaris 1,5°C i 2°C per a risk assessment", impact: "Alt" },
    { framework: "CSRD/ESRS", criterion: "E1 Climate Change — transició i emissions", impact: "Alt" },
    { framework: "UN Global Compact", criterion: "Principi 7-9 (medi ambient) com a referent", impact: "Mitjà" },
    { framework: "SDG Compass", criterion: "ODS 7 (energia) i 13 (clima)", impact: "Alt" },
  ],
};

const iea_es: ReportBlock = {
  semafor: {
    grade: "A",
    gradeLabel: "Riguroso",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "verd",
        label: "Cuantificado",
        note: "Análisis completo de emisiones por fuente primaria, región y sector, con descomposición hasta nivel subregional.",
      },
      {
        name: "Términos temporales",
        status: "verd",
        label: "Cuantificado",
        note: "Serie histórica 2010-2025 con proyecciones a 2026 y referencias a escenarios WEO 2025 (STEPS, APS, NZE).",
      },
      {
        name: "Fuentes independientes",
        status: "verd",
        label: "Cuantificado",
        note: "Datos primarios de administraciones nacionales, operadores e IEA family; metodología pública y auditable.",
      },
      {
        name: "Granularidad",
        status: "verd",
        label: "Cuantificado",
        note: "Detalle por región (80+), fuente (12 primarias) y sector (8 macro-sectores con sub-sectores).",
      },
      {
        name: "Verificación externa",
        status: "verd",
        label: "Cuantificado",
        note: "Revisión por pares externos (Energy Institute, BloombergNEF) y publicación de datos abiertos.",
      },
    ],
  },
  dadesClau: [
    { value: "4%", label: "crecimiento de la demanda eléctrica global en 2026", page: "p. 21" },
    { value: "China", label: "principal motor del crecimiento de demanda", page: "p. 28" },
    { value: "60%", label: "cuota de renovables en nueva capacidad instalada", page: "p. 35" },
    { value: "1,2%", label: "crecimiento de demanda de petróleo (vs 1,9% 2025)", page: "p. 42" },
    { value: "2050", label: "año objetivo de neutralidad de los escenarios NZE", page: "p. 67" },
  ],
  resumExecutiu:
    "La International Energy Agency publica el Global Energy Review 2026, informe anual de referencia sobre el estado y las tendencias del mercado energético mundial. La edición confirma que la demanda eléctrica global crecerá un 4% en 2026, liderada por China (que supone el 55% del crecimiento absoluto), India y el Sudeste asiático. Este aumento está impulsado por tres factores convergentes: electrificación de usos finales (transporte, calefacción, industria), expansión de centros de datos e IA, y crecimiento económico emergente. El 60% de la nueva capacidad instalada es renovable, pero la demanda absoluta de combustibles fósiles aún crece en términos absolutos en países no-OCDE. La demanda de petróleo crece solo un 1,2% (vs 1,9% en 2025), lo que confirma la cercanía del pico. El gas natural experimenta un repunte transitorio debido a la sustitución del carbón en economías en transición. El informe confirma que las emisiones del sector energético llegarán al pico entre 2025 y 2026, pero el declive posterior no será suficiente para alcanzar la trayectoria 1,5°C del Acuerdo de París sin políticas adicionales. El escenario NZE (Net Zero Emissions) requiere una aceleración de la inversión en eficiencia y electrificación que los actuales planes nacionales no alcanzan. La crítica principal: el informe es riguroso pero dependiente de datos declarados por estados con intereses divergentes; la triangulación con datos satelitales debería ser el próximo salto metodológico.",
  implicacions: {
    empreses:
      "Para las empresas energointensivas, el informe confirma la tendencia hacia la electrificación: avanzar en estrategia de electrificación de procesos es ventaja competitiva. Las utilities tienen oportunidad histórica pero también responsabilidad: el crecimiento eléctrico debe ser con renovables, no con fósiles. Las empresas de datos e IA deben gestionar su huella eléctrica creciente con transparencia.",
    reguladors:
      "Para los reguladores, el informe es base de políticas energéticas nacionales y europeas. Los datos avalan acelerar permisos de renovables, redes y almacenamiento. Pero también advierten que sin medidas de gestión de demanda —especialmente eficiencia—, el objetivo 1,5°C es inalcanzable. Los países OCDE deberían liderar con reducciones absolutas más ambiciosas.",
    ciutadans:
      "Para los ciudadanos, el informe es lectura obligada para entender el precio de la energía y la transición. La buena noticia: las renovables ya son la opción más barata en la mayoría de mercados. La mala noticia: la transición no será automática; requiere inversión pública y privada masiva, y decisiones políticas que la ciudadanía debe legitimar.",
  },
  mesEnllaCheckbox: {
    criteri: "Sostenibilidad absoluta + Justicia distributiva",
    body:
      "El informe demuestra rigor técnico notable, pero la sostenibilidad absoluta exige mirar no solo el pico de emisiones sino la trayectoria posterior. La diferencia entre el pico 2025-2026 y el camino NZE es abismal: ambos son 'pico', pero uno conduce a +2,7°C y el otro a +1,5°C. El lenguaje técnico puede esconder la urgencia ética. Al mismo tiempo, la justicia distributiva es clave: el crecimiento eléctrico de China e India responde a necesidades legítimas de desarrollo. Serían los países OCDE quienes deberían reducir consumo absoluto para dejar espacio. Sin este reconocimiento explícito, el discurso europeo de transición corre el riesgo de ser percibido como proteccionismo ambiental.",
  },
  connexions: [
    {
      type: "Complemento",
      target: "ECB Climate risk stress test: EU banking system",
      desc: "La IEA aporta datos de demanda energética que los bancos utilizan para modelizar riesgos de transición sectoriales.",
    },
    {
      type: "Evolución",
      target: "EU Taxonomy: Delegated Act de simplificación",
      desc: "El escenario NZE de la IEA es referente para los criterios de Taxonomía en sectores energéticos.",
    },
    {
      type: "Complemento",
      target: "Europe Sustainable Development Report 2026",
      desc: "El ODS 7 (energía) y ODS 13 (clima) utilizan datos IEA como fuente primaria.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Actualizar el análisis de exposición a precios volátiles",
      desc: "Modelizar impacto de variabilidad de precios eléctricos y gasistas sobre el margen operativo a 3 años.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "02",
      title: "Acelerar electrificación de procesos térmicos",
      desc: "Identificar 2-3 procesos con sustitución técnicamente viable por bombas de calor o resistencia eléctrica.",
      effort: "Alto",
      impact: "Alto",
    },
    {
      num: "03",
      title: "Negociar PPAs renovables a largo plazo",
      desc: "Aprovechar bajada de coste LCOE para cerrar contratos a 10-15 años con precio fijado o indexado a mercado.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "04",
      title: "Invertir en eficiencia energética como primera prioridad",
      desc: "Auditoría energética integral y plan de inversión en medidas con payback inferior a 4 años.",
      effort: "Bajo",
      impact: "Medio",
    },
  ],
  crossRefs: [
    { framework: "TCFD", criterion: "Escenarios 1,5°C y 2°C para risk assessment", impact: "Alto" },
    { framework: "CSRD/ESRS", criterion: "E1 Climate Change — transición y emisiones", impact: "Alto" },
    { framework: "UN Global Compact", criterion: "Principio 7-9 (medio ambiente) como referente", impact: "Medio" },
    { framework: "SDG Compass", criterion: "ODS 7 (energía) y 13 (clima)", impact: "Alto" },
  ],
};

// -----------------------------------------------------------------------------
// 9. eu-taxonomy-delegated-act-2026 — EU Taxonomy: Delegated Act de simplificació
// -----------------------------------------------------------------------------

const euTaxonomy_ca: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Acceptable amb matisos",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Esmentat",
        note: "Es manté l'enfocament en activitatsTaxonomia però es redueix el nombre de criteris de no-fortament-perjudicial (DNSH).",
      },
      {
        name: "Termes temporals",
        status: "verd",
        label: "Quantificat",
        note: "Aplicació retrospectiva des de 1 gener 2026 amb dates clares i períodes transitoris definits.",
      },
      {
        name: "Fonts independents",
        status: "verd",
        label: "Quantificat",
        note: "Plataforma for Sustainable Finance (PSF) i grup d'experts independents; procés tècnic transparent.",
      },
      {
        name: "Granularitat",
        status: "groc",
        label: "Esmentat",
        note: "Es simplifiquen els thresholds per activitats existents però s'incorporen noves amb menor detall.",
      },
      {
        name: "Verificació externa",
        status: "groc",
        label: "Esmentat",
        note: "Auditoria externa obligatòria però amb nivell d'assurance limitat en molts casos.",
      },
    ],
  },
  dadesClau: [
    { value: "28 gen 2026", label: "entrada en vigor del Delegated Act de simplificació", page: "p. 4" },
    { value: "1 gen 2026", label: "aplicació retrospectiva per a l'exercici vigent", page: "p. 8" },
    { value: "30%", label: "reducció de criteris DNSH per activitat", page: "p. 17" },
    { value: "6", label: "objectius ambientals coberts (de 6 originals)", page: "p. 11" },
    { value: "100+", label: "activitats económiques catalogades", page: "p. 24" },
  ],
  resumExecutiu:
    "La Comissió Europea publica el Delegated Act de simplificació de la Taxonomia UE, que entra en vigor el 28 de gener de 2026 amb aplicació retrospectiva des de 1 de gener per a l'exercici en curs. L'acte forma part de l'Omnibus I de simplificació i respon a les crítiques recurrents sobre la complexitat operativa del framework. Els canvis més rellevants són: (1) reducció mitjana del 30% dels criteris DNSH (Do No Significant Harm) per activitat, mantenint els criteris substantius però eliminant requisits procedimentals redundants; (2) clarificació dels thresholds per a les activitats transicionals, especialment en sectors amb alta dependència de fòssils; (3) incorporació de noves activitats alineades amb transició (hidrogen verd, captura de carboni, etc.); (4) simplificació del càlcul de l'alineament per a les empreses amb múltiples activitats; (5) harmonització parcial amb els PAI (Principal Adverse Impacts) del SFDR. L'acte manté els sis objectius ambientals (mitigació climàtica, adaptació, aigua, economia circular, prevenció de contaminació, biodiversitat) i l'arquitectura de tres requisits (substantial contribution, DNSH, minimum safeguards). La crítica recurrent: la simplificació és benvinguda però corre el risc de debilitar la credibilitat del framework. Els inversors institucionals han advertit que la reducció de criteris DNSH pot facilitar l'etiquetatge verd d'activitats amb impactes materials no negligibles en altres dimensions. La Plataforma for Sustainable Finance ha demanat un mecanisme de revisió periòdica per evitar erosionar la robustesa del sistema.",
  implicacions: {
    empreses:
      "Per a les empreses obligades a reportar alineament amb Taxonomia (grans empreses CSRD, participants en mercats financers), la simplificació redueix cost de càlcul i compliance. Però genera incertesa sobre la comparabilitat amb exercicis anteriors. Les empreses amb activitats transicionals guanyen claredat sobre què compta com alineat.",
    reguladors:
      "Per als reguladors, l'acte alleuja càrrega però crea risc reputacional per a la UE: si la Taxonomia es percep com a afluixada, perd utilitat com a referent global. L'ESMA haurà de reforçar la supervisió de l'ús de les etiquetes. La coordinació amb jurisdiccions externes (UK Green Taxonomy, Singapore) es complica amb cada canvi.",
    ciutadans:
      "Per als ciutadans invertidors —via fons de pensió, estalvi retail—, la Taxonomia és una promesa de claredat sobre què és 'verd' realment. La simplificació pot facilitar més productes etiquetats però amb menor garantia. La societat civil hauria de demanar accés públic a les dades agregades d'alineament per poder jutjar.",
  },
  mesEnllaCheckbox: {
    criteri: "Sostenibilitat absoluta + Arrelament territorial",
    body:
      "La Taxonomia parteix d'una ambició noble —definir què és sostenible en termes absoluts— però la simplificació relaxa els llindars de manera que activitats amb impactes materials no negligibles poden ser etiquetades com a verdes. La sostenibilitat absoluta exigeix guardar els límits ecològics com a referència no negociable, no com a variable ajustable per pressió industrial. Alhora, els criteris tècnics són europeus però els impactes territorials de les activitats alineades poden ser globals: una planta d'hidrogen verd a Andalusia té impactes en aigua i sòl que la Taxonomia no captura amb prou granularitat. Sense arrelament territorial, l'etiqueta verd europeu pot amargar territoris concrets.",
  },
  connexions: [
    {
      type: "Complement",
      target: "Revisió dels ESRS: simplificació del CSRD",
      desc: "Ambdós actes formen part de l'Omnibus I i comparteixen la lògica de reducció de càrregues per als mateixos obligats.",
    },
    {
      type: "Complement",
      target: "ECB Climate risk stress test: EU banking system",
      desc: "La Taxonomia simplificada facilita als bancs classificar activitats alineades als seus stress tests.",
    },
    {
      type: "Evolució",
      target: "TNFD 2026 Status Report",
      desc: "Els criteris Taxonomia per a biodiversitat i ecosistemes requereixen dades TNFD per verificar alignment.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Recalcular l'alineament Taxonomia amb els nous criteris",
      desc: "Aplicar la fórmula simplificada a l'exercici 2026 i comparar amb dades anteriors per detectar salts.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "02",
      title: "Identificar activitats transicionals susceptibles d'alineament",
      desc: "Revisar sectors on nous thresholds permeten etiquetar activitats abans no-alineades; comunicar amb cautela.",
      effort: "Baix",
      impact: "Mitjà",
    },
    {
      num: "03",
      title: "Actualitzar el disclosure SFDR amb PAI harmonitzats",
      desc: "Aprofitar l'harmonització parcial per simplificar el reporting PAI als fons propis i dels clients.",
      effort: "Mitjà",
      impact: "Mitjà",
    },
    {
      num: "04",
      title: "Documentar el càlcul d'alineament amb traçabilitat",
      desc: "Construir audit trail que permeti respondre a consultes d'inversors i reguladors sobre la metodologia aplicada.",
      effort: "Baix",
      impact: "Mitjà",
    },
  ],
  crossRefs: [
    { framework: "SFDR", criterion: "PAI 4-15 i article 8/9 products", impact: "Alt" },
    { framework: "CSRD/ESRS", criterion: "E1-E5 datapoints Taxonomia-alineats", impact: "Alt" },
    { framework: "MSCI ESG", criterion: "Taxonomy alignment score en ratings", impact: "Mitjà" },
    { framework: "GRI", criterion: "Disclosures sectorials per a comparativa", impact: "Baix" },
  ],
};

const euTaxonomy_es: ReportBlock = {
  semafor: {
    grade: "B",
    gradeLabel: "Aceptable con matices",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "groc",
        label: "Mencionado",
        note: "Se mantiene el enfoque en actividades Taxonomía pero se reduce el número de criterios de no-fortemente-perjudicial (DNSH).",
      },
      {
        name: "Términos temporales",
        status: "verd",
        label: "Cuantificado",
        note: "Aplicación retrospectiva desde 1 enero 2026 con fechas claras y períodos transitorios definidos.",
      },
      {
        name: "Fuentes independientes",
        status: "verd",
        label: "Cuantificado",
        note: "Plataforma for Sustainable Finance (PSF) y grupo de expertos independientes; proceso técnico transparente.",
      },
      {
        name: "Granularidad",
        status: "groc",
        label: "Mencionado",
        note: "Se simplifican los thresholds para actividades existentes pero se incorporan nuevas con menor detalle.",
      },
      {
        name: "Verificación externa",
        status: "groc",
        label: "Mencionado",
        note: "Auditoría externa obligatoria pero con nivel de assurance limitado en muchos casos.",
      },
    ],
  },
  dadesClau: [
    { value: "28 ene 2026", label: "entrada en vigor del Delegated Act de simplificación", page: "p. 4" },
    { value: "1 ene 2026", label: "aplicación retrospectiva para el ejercicio vigente", page: "p. 8" },
    { value: "30%", label: "reducción de criterios DNSH por actividad", page: "p. 17" },
    { value: "6", label: "objetivos ambientales cubiertos (de 6 originales)", page: "p. 11" },
    { value: "100+", label: "actividades económicas catalogadas", page: "p. 24" },
  ],
  resumExecutiu:
    "La Comisión Europea publica el Delegated Act de simplificación de la Taxonomía UE, que entra en vigor el 28 de enero de 2026 con aplicación retrospectiva desde 1 de enero para el ejercicio en curso. El acto forma parte del Omnibus I de simplificación y responde a las críticas recurrentes sobre la complejidad operativa del framework. Los cambios más relevantes son: (1) reducción media del 30% de los criterios DNSH (Do No Significant Harm) por actividad, manteniendo los criterios sustantivos pero eliminando requisitos procedimentales redundantes; (2) clarificación de los thresholds para las actividades transicionales, especialmente en sectores con alta dependencia de fósiles; (3) incorporación de nuevas actividades alineadas con transición (hidrógeno verde, captura de carbono, etc.); (4) simplificación del cálculo del alineamiento para empresas con múltiples actividades; (5) armonización parcial con los PAI (Principal Adverse Impacts) del SFDR. El acto mantiene los seis objetivos ambientales (mitigación climática, adaptación, agua, economía circular, prevención de contaminación, biodiversidad) y la arquitectura de tres requisitos (substantial contribution, DNSH, minimum safeguards). La crítica recurrente: la simplificación es bienvenida pero corre el riesgo de debilitar la credibilidad del framework. Los inversores institucionales han advertido que la reducción de criterios DNSH puede facilitar el etiquetado verde de actividades con impactos materiales no despreciables en otras dimensiones. La Plataforma for Sustainable Finance ha pedido un mecanismo de revisión periódica para evitar erosionar la robustez del sistema.",
  implicacions: {
    empreses:
      "Para las empresas obligadas a reportar alineamiento con Taxonomía (grandes empresas CSRD, participantes en mercados financieros), la simplificación reduce coste de cálculo y compliance. Pero genera incertidumbre sobre la comparabilidad con ejercicios anteriores. Las empresas con actividades transicionales ganan claridad sobre qué cuenta como alineado.",
    reguladors:
      "Para los reguladores, el acto alivia carga pero crea riesgo reputacional para la UE: si la Taxonomía se percibe como floja, pierde utilidad como referente global. La ESMA tendrá que reforzar la supervisión del uso de las etiquetas. La coordinación con jurisdicciones externas (UK Green Taxonomy, Singapore) se complica con cada cambio.",
    ciutadans:
      "Para los ciudadanos inversores —vía fondos de pensión, ahorro retail—, la Taxonomía es una promesa de claridad sobre qué es 'verde' realmente. La simplificación puede facilitar más productos etiquetados pero con menor garantía. La sociedad civil debería pedir acceso público a los datos agregados de alineamiento para poder juzgar.",
  },
  mesEnllaCheckbox: {
    criteri: "Sostenibilidad absoluta + Arraigamiento territorial",
    body:
      "La Taxonomía parte de una ambición noble —definir qué es sostenible en términos absolutos— pero la simplificación relaja los umbrales de manera que actividades con impactos materiales no despreciables pueden ser etiquetadas como verdes. La sostenibilidad absoluta exige guardar los límites ecológicos como referencia no negociable, no como variable ajustable por presión industrial. Al mismo tiempo, los criterios técnicos son europeos pero los impactos territoriales de las actividades alineadas pueden ser globales: una planta de hidrógeno verde en Andalucía tiene impactos en agua y suelo que la Taxonomía no captura con suficiente granularidad. Sin arraigamiento territorial, la etiqueta verde europea puede amargar territorios concretos.",
  },
  connexions: [
    {
      type: "Complemento",
      target: "Revisión de los ESRS: simplificación del CSRD",
      desc: "Ambos actos forman parte del Omnibus I y comparten la lógica de reducción de cargas para los mismos obligados.",
    },
    {
      type: "Complemento",
      target: "ECB Climate risk stress test: EU banking system",
      desc: "La Taxonomía simplificada facilita a los bancos clasificar actividades alineadas en sus stress tests.",
    },
    {
      type: "Evolución",
      target: "TNFD 2026 Status Report",
      desc: "Los criterios Taxonomía para biodiversidad y ecosistemas requieren datos TNFD para verificar alignment.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Recalcular el alineamiento Taxonomía con los nuevos criterios",
      desc: "Aplicar la fórmula simplificada al ejercicio 2026 y comparar con datos anteriores para detectar saltos.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "02",
      title: "Identificar actividades transicionales susceptibles de alineamiento",
      desc: "Revisar sectores donde nuevos thresholds permiten etiquetar actividades antes no-alineadas; comunicar con cautela.",
      effort: "Bajo",
      impact: "Medio",
    },
    {
      num: "03",
      title: "Actualizar el disclosure SFDR con PAI armonizados",
      desc: "Aprovechar la armonización parcial para simplificar el reporting PAI en los fondos propios y de los clientes.",
      effort: "Medio",
      impact: "Medio",
    },
    {
      num: "04",
      title: "Documentar el cálculo de alineamiento con trazabilidad",
      desc: "Construir audit trail que permita responder a consultas de inversores y reguladores sobre la metodología aplicada.",
      effort: "Bajo",
      impact: "Medio",
    },
  ],
  crossRefs: [
    { framework: "SFDR", criterion: "PAI 4-15 y artículo 8/9 products", impact: "Alto" },
    { framework: "CSRD/ESRS", criterion: "E1-E5 datapoints Taxonomía-alineados", impact: "Alto" },
    { framework: "MSCI ESG", criterion: "Taxonomy alignment score en ratings", impact: "Medio" },
    { framework: "GRI", criterion: "Disclosures sectoriales para comparativa", impact: "Bajo" },
  ],
};

// -----------------------------------------------------------------------------
// 10. europe-sustainable-development-2026 — Europe Sustainable Development Report 2026
// -----------------------------------------------------------------------------

const europeSDR_ca: ReportBlock = {
  semafor: {
    grade: "A",
    gradeLabel: "Rigorós",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "verd",
        label: "Quantificat",
        note: "Cobertura completa de 41 països europeus amb 17 ODS i 169 targets; anàlisi d'spill-over effects internacionals.",
      },
      {
        name: "Termes temporals",
        status: "verd",
        label: "Quantificat",
        note: "Sèrie històrica 2015-2025 amb projeccions a 2030; trajectòria cap a ODS comparada any rere any.",
      },
      {
        name: "Fonts independents",
        status: "verd",
        label: "Quantificat",
        note: "Dades primàries d'Eurostat, Banc Mundial, OCDE i ONU; metodologia pública i auditable.",
      },
      {
        name: "Granularitat",
        status: "verd",
        label: "Quantificat",
        note: "Detall per país, ODS i target; anàlisi subregional per a estats membres amb dades disponibles.",
      },
      {
        name: "Verificació externa",
        status: "verd",
        label: "Quantificat",
        note: "Revisió per parells externs i consultes amb NATIONS; metodologia validada per SDSN Thematic Group.",
      },
    ],
  },
  dadesClau: [
    { value: "7a edició", label: "de l'Europe Sustainable Development Report", page: "p. 4" },
    { value: "41", label: "països europeus avaluats", page: "p. 9" },
    { value: "17", label: "ODS i 169 targets monitorats", page: "p. 13" },
    { value: "ODS 13", label: "estancament identificat en clima", page: "p. 38" },
    { value: "ODS 12", label: "estancament en consum responsable", page: "p. 42" },
  ],
  resumExecutiu:
    "El SDSN i SDSN Europe publiquen la setena edició de l'Europe Sustainable Development Report 2026, informe de referència sobre el progrés del continent europeu cap als Objectius de Desenvolupament Sostenible. L'edició avalua 41 països europeus amb 17 ODS i 169 targets, amb sèrie històrica 2015-2025 i projeccions a 2030. Els resultats mostren un continent estancat: cap país europeu està en trajectòria d'assolir tots els ODS el 2030, i els progressos mitjans són insuficients en 8 dels 17 objectius. Els sectors amb estancament més preocupant són ODS 13 (acció climàtica) i ODS 12 (consum responsable), on la majoria de països mostren tendència plana o regressiva. Els països nòrdics (Finlàndia, Suècia, Dinamarca) lideren el rànquing però també mostren estancament en ODS 12-13. Els països del sud d'Europa (Espanya, Itàlia, Grècia) milloren en ODS 8 (treball) però retrocedeixen en ODS 10 (desigualtat). Els països de l'est (Polònia, Hongria, Romania) avancen lentament però amb gaps estructurals en ODS 5 (igualtat de gènere) i ODS 16 (pau i justícia). L'informe confirma que els 'spill-over effects' —impactes negatius europeus sobre el Sud Global via emissions importades, extracció de recursos, fugida de cervells— segueixen sent elevats i comprometen la coherència de la política europea de sostenibilitat. La crítica principal: l'informe és rigorós però la seva capacitat d'incidència política és limitada sense mecanismes vinculants. El SDSN demana un 'European Green Deal 2.0' amb fites vinculants ODS-aligned.",
  implicacions: {
    empreses:
      "Per a les empreses europees, l'informe ofereix radiografia del context regulatori i social a 41 mercats. Les dades d'spill-over són especialment rellevants per a les multinacionals amb cadena de subministrament global: caldrà demostrar coherència entre el que es fa a Europa i el que es fa fora. L'estancament en ODS 12 i 13 és un avís per a sectors intensius en recursos.",
    reguladors:
      "Per als reguladors nacionals i europeus, l'informe és base de política pública. Les dades avalen un reforçament dels instruments vinculants (fites EU 2040, regulateuó de productes, etc.) i de la coherència de polítiques (trade, agricultura, energia, indústria). L'estancament en ODS 13 hauria d'activar mesures addicionals en sectors ETS i no-ETS.",
    ciutadans:
      "Per als ciutadans, l'informe mostra que la sostenibilitat no és un objectiu tècnic sinó una opció política col·lectiva. L'estancament en ODS 12 (consum) és responsabilitat compartida: cal canvi de patrons de consum, no només de producció. La societat civil hauria de utilitzar les dades per demanar comptes als governs i empreses.",
  },
  mesEnllaCheckbox: {
    criteri: "Justícia distributiva + Co-decisió democràtica",
    body:
      "L'informe documenta excel·lentment el fenomen dels spill-over effects: Europa importa sostenibilitat exportant insostenibilitat. Aquesta és una qüestió de justícia distributiva global que el reporting tècnic no resol: mentre el rànquing europeu millora, les comunitats del Sud Global on es extrauen els recursos o es produeixen els béts que Europa consumeix pateixen la part insostenible. La co-decisió democràtica queda fora de l'informe perquè els 41 països avaluats decideixen sobre els ODS sense veç efectiva dels països afectats pels seus spill-overs. Sense mecanismes globals de justícia climàtica i econòmica, el progrés europeu és parcial. La propera edició hauria d'incorporar mètriques d'impacte extraterritorial com a variable central.",
  },
  connexions: [
    {
      type: "Complement",
      target: "IEA Global Energy Review 2026",
      desc: "L'IEA aporta dades energètiques que alimenten els indicadors ODS 7 i 13 del SDSN.",
    },
    {
      type: "Complement",
      target: "EU Taxonomy: Delegated Act de simplificació",
      desc: "L'alineament Taxonomia és una de les variables per avaluar el progrés ODS 13 europeu.",
    },
    {
      type: "Evolució",
      target: "Revisió dels ESRS: simplificació del CSRD",
      desc: "El reporting empresarial CSRD alimenta els indicadors privats del SDSN sobre ODS 8, 12 i 13.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Mapejar la contribució als ODS de l'empresa",
      desc: "Utilitzar l'SDG Compass per identificar 3-5 ODS prioritaris on l'empresa té impacte material positiu o negatiu.",
      effort: "Baix",
      impact: "Mitjà",
    },
    {
      num: "02",
      title: "Mesurar l'spill-over de la cadena global",
      desc: "Quantificar impactes extraterritorials via anàlisi Input-Output multi-regional (EORA, EXIOBASE).",
      effort: "Alt",
      impact: "Alt",
    },
    {
      num: "03",
      title: "Incorporar fites ODS al pla estratègic",
      desc: "Definir 3-5 KPIs vinculants amb fites 2030 alineades amb la trajectòria del país seu de l'empresa.",
      effort: "Mitjà",
      impact: "Alt",
    },
    {
      num: "04",
      title: "Participar en coalicions sectorials per ODS",
      desc: "Unir-se a iniciatives tipo UN Global Compact Local Network o sectorials amb fets compartides.",
      effort: "Baix",
      impact: "Mitjà",
    },
  ],
  crossRefs: [
    { framework: "SDG Compass", criterion: "17 ODS i 169 targets com a referència estratègica", impact: "Alt" },
    { framework: "UN Global Compact", criterion: "10 principis i ODS com a base ètica", impact: "Alt" },
    { framework: "GRI", criterion: "Universal Standards + GRI 1 Sector Standards", impact: "Mitjà" },
    { framework: "CSRD/ESRS", criterion: "S1-S3 (social) + E1 (clima) — alineats amb ODS", impact: "Mitjà" },
  ],
};

const europeSDR_es: ReportBlock = {
  semafor: {
    grade: "A",
    gradeLabel: "Riguroso",
    indicators: [
      {
        name: "Cobertura Scope 3",
        status: "verd",
        label: "Cuantificado",
        note: "Cobertura completa de 41 países europeos con 17 ODS y 169 targets; análisis de spill-over effects internacionales.",
      },
      {
        name: "Términos temporales",
        status: "verd",
        label: "Cuantificado",
        note: "Serie histórica 2015-2025 con proyecciones a 2030; trayectoria hacia ODS comparada año tras año.",
      },
      {
        name: "Fuentes independientes",
        status: "verd",
        label: "Cuantificado",
        note: "Datos primarios de Eurostat, Banco Mundial, OCDE y ONU; metodología pública y auditable.",
      },
      {
        name: "Granularidad",
        status: "verd",
        label: "Cuantificado",
        note: "Detalle por país, ODS y target; análisis subregional para estados miembros con datos disponibles.",
      },
      {
        name: "Verificación externa",
        status: "verd",
        label: "Cuantificado",
        note: "Revisión por pares externos y consultas con NATIONS; metodología validada por SDSN Thematic Group.",
      },
    ],
  },
  dadesClau: [
    { value: "7ª edición", label: "del Europe Sustainable Development Report", page: "p. 4" },
    { value: "41", label: "países europeos evaluados", page: "p. 9" },
    { value: "17", label: "ODS y 169 targets monitoreados", page: "p. 13" },
    { value: "ODS 13", label: "estancamiento identificado en clima", page: "p. 38" },
    { value: "ODS 12", label: "estancamiento en consumo responsable", page: "p. 42" },
  ],
  resumExecutiu:
    "El SDSN y SDSN Europe publican la séptima edición del Europe Sustainable Development Report 2026, informe de referencia sobre el progreso del continente europeo hacia los Objetivos de Desarrollo Sostenible. La edición evalúa 41 países europeos con 17 ODS y 169 targets, con serie histórica 2015-2025 y proyecciones a 2030. Los resultados muestran un continente estancado: ningún país europeo está en trayectoria de alcanzar todos los ODS en 2030, y los progresos medios son insuficientes en 8 de los 17 objetivos. Los sectores con estancamiento más preocupante son ODS 13 (acción climática) y ODS 12 (consumo responsable), donde la mayoría de países muestran tendencia plana o regresiva. Los países nórdicos (Finlandia, Suecia, Dinamarca) lideran el ranking pero también muestran estancamiento en ODS 12-13. Los países del sur de Europa (España, Italia, Grecia) mejoran en ODS 8 (trabajo) pero retroceden en ODS 10 (desigualdad). Los países del este (Polonia, Hungría, Rumanía) avanzan lentamente pero con gaps estructurales en ODS 5 (igualdad de género) y ODS 16 (paz y justicia). El informe confirma que los 'spill-over effects' —impactos negativos europeos sobre el Sur Global vía emisiones importadas, extracción de recursos, fuga de cerebros— siguen siendo elevados y comprometen la coherencia de la política europea de sostenibilidad. La crítica principal: el informe es riguroso pero su capacidad de incidencia política es limitada sin mecanismos vinculantes. El SDSN pide un 'European Green Deal 2.0' con metas vinculantes ODS-aligned.",
  implicacions: {
    empreses:
      "Para las empresas europeas, el informe ofrece radiografía del contexto regulatorio y social en 41 mercados. Los datos de spill-over son especialmente relevantes para las multinacionales con cadena de suministro global: habrá que demostrar coherencia entre lo que se hace en Europa y lo que se hace fuera. El estancamiento en ODS 12 y 13 es un aviso para sectores intensivos en recursos.",
    reguladors:
      "Para los reguladores nacionales y europeos, el informe es base de política pública. Los datos avalan un refuerzo de los instrumentos vinculantes (metas EU 2040, regulación de productos, etc.) y de la coherencia de políticas (trade, agricultura, energía, industria). El estancamiento en ODS 13 debería activar medidas adicionales en sectores ETS y no-ETS.",
    ciutadans:
      "Para los ciudadanos, el informe muestra que la sostenibilidad no es un objetivo técnico sino una opción política colectiva. El estancamiento en ODS 12 (consumo) es responsabilidad compartida: hace falta cambio de patrones de consumo, no solo de producción. La sociedad civil debería utilizar los datos para pedir cuentas a gobiernos y empresas.",
  },
  mesEnllaCheckbox: {
    criteri: "Justicia distributiva + Co-decisión democrática",
    body:
      "El informa documenta excelentemente el fenómeno de los spill-over effects: Europa importa sostenibilidad exportando insostenibilidad. Esta es una cuestión de justicia distributiva global que el reporting técnico no resuelve: mientras el ranking europeo mejora, las comunidades del Sur Global donde se extraen los recursos o se producen los bienes que Europa consume sufren la parte insostenible. La co-decisión democrática queda fuera del informe porque los 41 países evaluados deciden sobre los ODS sin voz efectiva de los países afectados por sus spill-overs. Sin mecanismos globales de justicia climática y económica, el progreso europeo es parcial. La próxima edición debería incorporar métricas de impacto extraterritorial como variable central.",
  },
  connexions: [
    {
      type: "Complemento",
      target: "IEA Global Energy Review 2026",
      desc: "La IEA aporta datos energéticos que alimentan los indicadores ODS 7 y 13 del SDSN.",
    },
    {
      type: "Complemento",
      target: "EU Taxonomy: Delegated Act de simplificación",
      desc: "El alineamiento Taxonomía es una de las variables para evaluar el progreso ODS 13 europeo.",
    },
    {
      type: "Evolución",
      target: "Revisión de los ESRS: simplificación del CSRD",
      desc: "El reporting empresarial CSRD alimenta los indicadores privados del SDSN sobre ODS 8, 12 y 13.",
    },
  ],
  accions: [
    {
      num: "01",
      title: "Mapear la contribución a los ODS de la empresa",
      desc: "Utilizar el SDG Compass para identificar 3-5 ODS prioritarios donde la empresa tiene impacto material positivo o negativo.",
      effort: "Bajo",
      impact: "Medio",
    },
    {
      num: "02",
      title: "Medir el spill-over de la cadena global",
      desc: "Cuantificar impactos extraterritoriales vía análisis Input-Output multi-regional (EORA, EXIOBASE).",
      effort: "Alto",
      impact: "Alto",
    },
    {
      num: "03",
      title: "Incorporar metas ODS al plan estratégico",
      desc: "Definir 3-5 KPIs vinculantes con metas 2030 alineadas con la trayectoria del país sede de la empresa.",
      effort: "Medio",
      impact: "Alto",
    },
    {
      num: "04",
      title: "Participar en coaliciones sectoriales por ODS",
      desc: "Unirse a iniciativas tipo UN Global Compact Local Network o sectoriales con metas compartidas.",
      effort: "Bajo",
      impact: "Medio",
    },
  ],
  crossRefs: [
    { framework: "SDG Compass", criterion: "17 ODS y 169 targets como referencia estratégica", impact: "Alto" },
    { framework: "UN Global Compact", criterion: "10 principios y ODS como base ética", impact: "Alto" },
    { framework: "GRI", criterion: "Universal Standards + GRI 1 Sector Standards", impact: "Medio" },
    { framework: "CSRD/ESRS", criterion: "S1-S3 (social) + E1 (clima) — alineados con ODS", impact: "Medio" },
  ],
};

// -----------------------------------------------------------------------------
// Mapa central de continguts per slug i idioma
// -----------------------------------------------------------------------------

const contentMap: Record<string, { ca: ReportBlock; es: ReportBlock }> = {
  "revisio-esrs-maig-2026": { ca: revisioEsrs_ca, es: revisioEsrs_es },
  "ecb-climate-risk-2026": { ca: ecbClimate_ca, es: ecbClimate_es },
  "efrag-work-programme-2026": { ca: efrag_ca, es: efrag_es },
  "ecovadis-methodology-q1-2026": { ca: ecovadis_ca, es: ecovadis_es },
  "tnfd-status-report-2026": { ca: tnfd_ca, es: tnfd_es },
  "bcorp-new-standards-2026": { ca: bcorp_ca, es: bcorp_es },
  "csddd-omnibus-març-2026": { ca: csddd_ca, es: csddd_es },
  "iea-global-energy-review-2026": { ca: iea_ca, es: iea_es },
  "eu-taxonomy-delegated-act-2026": { ca: euTaxonomy_ca, es: euTaxonomy_es },
  "europe-sustainable-development-2026": { ca: europeSDR_ca, es: europeSDR_es },
};

// -----------------------------------------------------------------------------
// Funció pública per obtenir el contingut d'un informe per slug i idioma
// -----------------------------------------------------------------------------

export function getReportContent(
  slug: string,
  lang: "ca" | "es"
): ReportBlock | undefined {
  const entry = contentMap[slug];
  if (!entry) {
    return undefined;
  }
  return entry[lang];
}
