// Dades centralitzades dels 16 estàndards ESG
// Compartit entre /estandares-esg i /estandares-esg/[slug]

export type StandarType = "reg" | "fw" | "cert";
export type AccessType = "free" | "premium";

export const TYPE_CONFIG: Record<StandarType, {
  borderColor: string;
  badgeBg: string;
  badgeColor: string;
  labelCa: string;
  labelEs: string;
}> = {
  reg: { borderColor: "#5C3A1E", badgeBg: "rgba(92,58,30,0.15)", badgeColor: "#5C3A1E", labelCa: "Regulació", labelEs: "Regulación" },
  fw: { borderColor: "#B87333", badgeBg: "rgba(184,115,51,0.12)", badgeColor: "#B87333", labelCa: "Framework", labelEs: "Framework" },
  cert: { borderColor: "#E8C99A", badgeBg: "rgba(232,201,154,0.25)", badgeColor: "#8A6D2B", labelCa: "Certificació", labelEs: "Certificación" },
};

export interface Standar {
  slug: string;
  name: string;
  type: StandarType;
  access: AccessType;
  descCa: string;
  descEs: string;
  logo: string;
  issuerCa: string;
  issuerEs: string;
  // count s'obté via getStandardsWithCounts() — derivat de xrefRows.length, mai hardcoded
}

export interface XrefRow {
  reportTitle: string;
  // NOU: slug del report a /informes/[slug] per linkar directament
  // Si no es posa, el títol queda sense link (per reports externs no publicats encara)
  reportSlug?: string;
  date: string;
  criterionCa: string;
  criterionEs: string;
  impact: "high" | "med";
  // NOU: camps opcionals per enriquir el cross-reference (pilot B Corp)
  // Pilar del framework afectat (ex B Corp: "Governance", "Workers", "Community", "Environment", "Customers")
  pillar?: string;
  // Sub-àrea específica dins del pilar (ex B Corp BIA: "Mission & Engagement")
  subArea?: string;
  // Què ha de fer l'empresa certificada (acció concreta)
  actionCa?: string;
  actionEs?: string;
  // Termini d'acció (ex: "Pròxima recertificació", "FY2026", "Q4 2026")
  deadline?: string;
}

export interface Action {
  num: string;
  textCa: string;
  textEs: string;
  sourceCa: string;
  sourceEs: string;
}

export interface StandarDetail extends Standar {
  xrefRows: XrefRow[];
  actions: Action[];
  count: number; // = xrefRows.length, sempre derivat
}

export interface StandarWithCount extends Standar {
  count: number; // derivat de STANDARDS_DETAIL[slug].xrefRows.length
}

// ============ LLISTA ESTÀNDARDS (per a la pàgina índex) ============
export const STANDARDS: Standar[] = [
  {
    slug: "csrd-esrs",
    name: "CSRD / ESRS",
    type: "reg",
    access: "free",
    logo: "/logos-estandards/csrd-esrs.png",
    issuerCa: "Comissió Europea · EFRAG",
    issuerEs: "Comisión Europea · EFRAG",
    descCa: "Directiva (UE) 2022/2464 de reporting de sostenibilitat. Substitueix el NFRD i obliga ~50.000 empreses europees (11.500 espanyoles) a publicar informació verificable sobre impactes, riscos i oportunitats ESG seguint els European Sustainability Reporting Standards (ESRS). Doble materialitat, format digital (XHTML) i verificació per tercers. Aplicació progressiva: grans cotitzades (FY2024), grans no cotitzades (FY2025), pimes cotitzades (FY2026) i pimes (FY2027). Base de l'ecosistema regulador ESG europeu.",
    descEs: "Directiva (UE) 2022/2464 de reporting de sostenibilidad. Sustituye al NFRD y obliga a ~50.000 empresas europeas (11.500 españolas) a publicar información verificable sobre impactos, riesgos y oportunidades ESG siguiendo los European Sustainability Reporting Standards (ESRS). Doble materialidad, formato digital (XHTML) y verificación por terceros. Aplicación progresiva: grandes cotizadas (FY2024), grandes no cotizadas (FY2025), pymes cotizadas (FY2026) y pymes (FY2027). Base del ecosistema regulador ESG europeo.",
  },
  {
    slug: "gri",
    name: "GRI",
    type: "fw",
    access: "free",
    logo: "/logos-estandards/gri.png",
    issuerCa: "Global Reporting Initiative · Amsterdam",
    issuerEs: "Global Reporting Initiative · Ámsterdam",
    descCa: "Global Reporting Initiative. Estàndard de reporting de sostenibilitat més usat al món: el 78% de les grans empreses europees i el 70%+ de l'IBEX 35 hi reporten. Estructura modular: Universal Standards (GRI 1-3), Topic Standards (GRI 200 econòmic, 300 ambiental, 400 social) i Sector Standards (cada vegada més sectors: carbó, agricultura, bancari, oli i gas, mineria...). Format de 'material topics' amb participació de stakeholders. Actualització 2021 amb enfocament en impactes reals i drets humans. Convergència activa amb ESRS via mapping EFRAG-GRI.",
    descEs: "Global Reporting Initiative. Estándar de reporting de sostenibilidad más usado del mundo: el 78% de las grandes empresas europeas y el 70%+ del IBEX 35 reportan con él. Estructura modular: Universal Standards (GRI 1-3), Topic Standards (GRI 200 económico, 300 ambiental, 400 social) y Sector Standards (cada vez más sectores: carbón, agricultura, banca, oil & gas, minería...). Formato de 'material topics' con participación de stakeholders. Actualización 2021 con enfoque en impactos reales y derechos humanos. Convergencia activa con ESRS vía mapping EFRAG-GRI.",
  },
  {
    slug: "ecovadis",
    name: "EcoVadis",
    type: "cert",
    access: "premium",
    logo: "/logos-estandards/ecovadis.jpg",
    issuerCa: "EcoVadis · París",
    issuerEs: "EcoVadis · París",
    descCa: "Rating de sostenibilitat corporativa amb metodologia pròpia basada en 21 criteris agrupats en 4 àrees: Environment, Labor & Human Rights, Ethics i Sustainable Procurement. Escala de medalla (Bronze, Silver, Gold, Platinum) sobre puntuació 0-100. El més demandat per cadenes de subministrament: 130.000+ empreses avaluades en 220 sectors i 175 països. Plataforma proprietària amb accés a scorecards dels proveïtors. Validació documental per analistes. Actualització anual. Cost per empresa: 1.500-15.000€ segons mida.",
    descEs: "Rating de sostenibilidad corporativa con metodología propia basada en 21 criterios agrupados en 4 áreas: Environment, Labor & Human Rights, Ethics y Sustainable Procurement. Escala de medalla (Bronze, Silver, Gold, Platinum) sobre puntuación 0-100. El más demandado por cadenas de suministro: 130.000+ empresas evaluadas en 220 sectores y 175 países. Plataforma propietaria con acceso a scorecards de proveedores. Validación documental por analistas. Actualización anual. Coste por empresa: 1.500-15.000€ según tamaño.",
  },
  {
    slug: "b-corp",
    name: "B Corp",
    type: "cert",
    access: "premium",
    logo: "/logos-estandards/b-corp.svg",
    issuerCa: "B Lab Global · Estats Units",
    issuerEs: "B Lab Global · Estados Unidos",
    descCa: "Certificació d'empreses amb propòsit de B Lab. Avalua l'impacte positiu d'una empresa en treballadors, comunitat, entorn i clients mitjançant el B Impact Assessment (BIA): 250+ preguntes, score 0-200, mínim 80 per certificarse. 5 àrees: Governance, Workers, Community, Environment, Customers. 9.500+ empreses certificades a 100 països (400+ a Espanya, 5a comunitat mundial). Requereix modificación estatutària (compromís amb propòsit). Recertificació cada 3 anys. Nous estàndards B Lab 2026 amb performance requirements obligatoris alineats amb CSRD. Cost: 500-50.000€/any segons facturació.",
    descEs: "Certificación de empresas con propósito de B Lab. Evalúa el impacto positivo de una empresa en trabajadores, comunidad, entorno y clientes mediante el B Impact Assessment (BIA): 250+ preguntas, score 0-200, mínimo 80 para certificarse. 5 áreas: Governance, Workers, Community, Environment, Customers. 9.500+ empresas certificadas en 100 países (400+ en España, 5ª comunidad mundial). Requiere modificación estatutaria (compromiso con propósito). Recertificación cada 3 años. Nuevos estándares B Lab 2026 con performance requirements obligatorios alineados con CSRD. Coste: 500-50.000€/año según facturación.",
  },
  {
    slug: "msci-esg",
    name: "MSCI ESG",
    type: "cert",
    access: "premium",
    logo: "/logos-estandards/msci-esg.svg",
    issuerCa: "MSCI Inc. · Nova York",
    issuerEs: "MSCI Inc. · Nueva York",
    descCa: "Rating ESG per a inversors amb escala AAA-CCC (líder, mitjà, retardatari). Avalua exposició a riscos ESG (10 temes, 35 categories) i gestió d'aquests riscos. Totes les cotitzades de l'IBEX 35 el monitoritzen. Impacte directe en cost de capital: un rating CCC pot augmentar el spread de deute 30-50 bp. Metodologia proprietària basada en dades públiques, disclosure de l'empresa i news screening. Actualització trimestral. MSCI també emet ratings de clima (TCFD-aligned), polèmiques i targetes de carboni. Competeix amb Sustainalytics i S&P Global ESG.",
    descEs: "Rating ESG para inversores con escala AAA-CCC (líder, medio, rezagado). Evalúa exposición a riesgos ESG (10 temas, 35 categorías) y gestión de esos riesgos. Todas las cotizadas del IBEX 35 lo monitorizan. Impacto directo en coste de capital: un rating CCC puede aumentar el spread de deuda 30-50 bp. Metodología propietaria basada en datos públicos, disclosure de la empresa y news screening. Actualización trimestral. MSCI también emite ratings de clima (TCFD-aligned), controversias y huellas de carbono. Compite con Sustainalytics y S&P Global ESG.",
  },
  {
    slug: "csddd",
    name: "CSDDD",
    type: "reg",
    access: "free",
    logo: "/logos-estandards/csddd.png",
    issuerCa: "Comissió Europea · DG Justice",
    issuerEs: "Comisión Europea · DG Justice",
    descCa: "Directiva (UE) 2024/1760 de due diligence en drets humans i sostenibilitat. Obliga empreses a identificar, prevenir, mitigar i explicar impactes adversos en drets humans i medi ambient a la seva cadena de valor. Àmbit: empreses UE >1.000 empleats i >450M€ facturació (després de l'Omnibus I, ~5.200 empreses vs 13.000 inicials). Aplicació escalonada 2027-2029 segons mida. Inclou pla de transició climàtica alineat amb 1,5°C. Sancions fins al 5% de facturació neta mundial. Transposició als estats membres obligatòria abans juliol 2026.",
    descEs: "Directiva (UE) 2024/1760 de due diligence en derechos humanos y sostenibilidad. Obliga a empresas a identificar, prevenir, mitigar y explicar impactos adversos en derechos humanos y medio ambiente en su cadena de valor. Ámbito: empresas UE >1.000 empleados y >450M€ facturación (tras Omnibus I, ~5.200 empresas vs 13.000 iniciales). Aplicación escalonada 2027-2029 según tamaño. Incluye plan de transición climática alineado con 1,5°C. Sanciones hasta el 5% de facturación neta mundial. Transposición a estados miembros obligatoria antes de julio 2026.",
  },
  {
    slug: "sfdr",
    name: "SFDR",
    type: "reg",
    access: "free",
    logo: "/logos-estandards/sfdr.png",
    issuerCa: "Comissió Europea · DG FISMA",
    issuerEs: "Comisión Europea · DG FISMA",
    descCa: "Reglament (UE) 2019/2088 de divulgació de finances sostenibles. Classifica productes financers en 3 categories: Article 6 (no sostenible), Article 8 ('light green', promou ESG) i Article 9 ('dark green', objectiu sostenible explícit). Obliga gestores, bancs i asseguradores a publicar PAI (Principal Adverse Impacts) i declaracions precontractuals. Afecta ~12.000 fons europeus. En revisió: la ESA proposa nova categorització (sustainable, transition, ESG collection) per evitar greenwashing. Entrada en vigor complet 2023, però RTS i plantilles electròniques encara en evolució.",
    descEs: "Reglamento (UE) 2019/2088 de divulgación de finanzas sostenibles. Clasifica productos financieros en 3 categorías: Artículo 6 (no sostenible), Artículo 8 ('light green', promueve ESG) y Artículo 9 ('dark green', objetivo sostenible explícito). Obliga a gestoras, bancos y aseguradoras a publicar PAI (Principal Adverse Impacts) y declaraciones precontractuales. Afecta a ~12.000 fondos europeos. En revisión: la ESA propone nueva categorización (sustainable, transition, ESG collection) para evitar greenwashing. Entrada en vigor completa 2023, pero RTS y plantillas electrónicas aún en evolución.",
  },
  {
    slug: "taxonomia-ue",
    name: "Taxonomía UE",
    type: "reg",
    access: "free",
    logo: "/logos-estandards/taxonomia-ue.png",
    issuerCa: "Comissió Europea · DG FISMA",
    issuerEs: "Comisión Europea · DG FISMA",
    descCa: "Reglament (UE) 2020/852 que classifica activitats econòmiques com a sostenibles. Defineix què és 'verd' amb criteris tècnics de pantalla (Technical Screening Criteria) per a 6 objectius ambientals: mitigació climàtica, adaptació, aigua, economia circular, contaminació, biodiversitat. Una activitat és alineada si compleix 3 condicions: contribució substancial, no fer mal significatiu (DNSH) i garanties mínimes socials. Actualment amb Delegated Acts per clima (2021), complementari (2022) i mediambiental (2023). Pendents: criteris per a transició (gas, nuclear en debat) i objectius socials.",
    descEs: "Reglamento (UE) 2020/852 que clasifica actividades económicas como sostenibles. Define qué es 'verde' con criterios técnicos de pantalla (Technical Screening Criteria) para 6 objetivos ambientales: mitigación climática, adaptación, agua, economía circular, contaminación, biodiversidad. Una actividad está alineada si cumple 3 condiciones: contribución sustancial, no hacer daño significativo (DNSH) y garantías mínimas sociales. Actualmente con Delegated Acts para clima (2021), complementario (2022) y medioambiental (2023). Pendientes: criterios para transición (gas, nuclear en debate) y objetivos sociales.",
  },
  {
    slug: "cdp",
    name: "CDP",
    type: "cert",
    access: "premium",
    logo: "/logos-estandards/cdp.png",
    issuerCa: "CDP · Londres",
    issuerEs: "CDP · Londres",
    descCa: "Sistema global de disclosure ambiental per a clima, aigua i boscos. Les empreses responen qüestionaris anuals estandarditzats (TCFD-aligned des de 2018) i reben puntuació A- a D- basada en comprehensivitat i transparència, no en performance. 24.000+ empreses responen (cobrint 66% de la capitalització global). Usat per 740+ inversors amb 136 trilions $ en actius i compradors corporatius. Dades públiques a la plataforma CDP. Gratuito per respondre, però accés a scorecards de tercers és de pagament. Integrat amb SBTi i CDP-targets verify net-zero pathways.",
    descEs: "Sistema global de divulgación ambiental para clima, agua y bosques. Las empresas responden cuestionarios anuales estandarizados (TCFD-aligned desde 2018) y reciben puntuación A- a D- basada en comprehensividad y transparencia, no en performance. 24.000+ empresas responden (cubriendo 66% de la capitalización global). Usado por 740+ inversores con 136 trillones $ en activos y compradores corporativos. Datos públicos en la plataforma CDP. Gratuito para responder, pero acceso a scorecards de terceros es de pago. Integrado con SBTi y CDP-targets verify net-zero pathways.",
  },
  {
    slug: "sge-21",
    name: "SGE 21",
    type: "cert",
    access: "premium",
    logo: "/logos-estandards/sge-21.svg",
    issuerCa: "Forética · Madrid",
    issuerEs: "Forética · Madrid",
    descCa: "Sistema de Gestió Ètica i Socialment Responsible, gestionat per Forética (2000). Únic estàndard ESG desenvolupat a Espanya i certificable per tercera part (auditoria externa anual). Alineat amb ISO 26000, ISO 9001, UNE 165002, GRI i SDGs. 4 àrees: estratègia i govern, recursos humans, proveïdors i aliances, i transparència i rendició de comptes. 350+ empreses certificades a Espanya i Llatinoamèrica (Ferrovial, Repsol, Bankinter, Vodafone España, Mapfre). Compatible amb doble materialitat CSRD. Renovació anual amb auditoria de seguiment.",
    descEs: "Sistema de Gestión Ética y Socialmente Responsable, gestionado por Forética (2000). Único estándar ESG desarrollado en España y certificable por tercera parte (auditoría externa anual). Alineado con ISO 26000, ISO 9001, UNE 165002, GRI y SDGs. 4 áreas: estrategia y gobierno, recursos humanos, proveedores y alianzas, y transparencia y rendición de cuentas. 350+ empresas certificadas en España y Latinoamérica (Ferrovial, Repsol, Bankinter, Vodafone España, Mapfre). Compatible con doble materialidad CSRD. Renovación anual con auditoría de seguimiento.",
  },
  {
    slug: "sustainalytics",
    name: "Sustainalytics",
    type: "cert",
    access: "premium",
    logo: "/logos-estandards/sustainalytics.svg",
    issuerCa: "Morningstar Sustainalytics · Amsterdam",
    issuerEs: "Morningstar Sustainalytics · Ámsterdam",
    descCa: "Rating de risc ESG per a inversors, ara propietat de Morningstar. Escala de 5 nivells: Negligible, Low, Medium, High, Severe (sobre puntuació 0-100 invertida). Diferent de MSCI: avalua risc financer no gestionat, no performance. Cobertura: 13.000+ empreses globals. Productes: ESG Risk Ratings (core), Country Risk, Controversies, Carbon Risk Ratings, Low Carbon Transition Ratings. Usat per identificar underpriced risk en renda variable i fixa. Les dades alimenten índexs Morningstar. Plataforma Moodys ESG fusionada amb Sustainalytics el 2022.",
    descEs: "Rating de riesgo ESG para inversores, ahora propiedad de Morningstar. Escala de 5 niveles: Negligible, Low, Medium, High, Severe (sobre puntuación 0-100 invertida). Diferente de MSCI: evalúa riesgo financiero no gestionado, no performance. Cobertura: 13.000+ empresas globales. Productes: ESG Risk Ratings (core), Country Risk, Controversies, Carbon Risk Ratings, Low Carbon Transition Ratings. Usado para identificar underpriced risk en renta variable y fija. Los datos alimentan índices Morningstar. Plataforma Moodys ESG fusionada con Sustainalytics en 2022.",
  },
  {
    slug: "sasb",
    name: "SASB",
    type: "fw",
    access: "free",
    logo: "/logos-estandards/sasb.png",
    issuerCa: "IFRS Foundation · ISSB",
    issuerEs: "IFRS Foundation · ISSB",
    descCa: "Sustainability Accounting Standards Board, ara integrat a l'ISSB (IFRS Sustainability Disclosure Standards). Estàndards de reporting financer-sostenibilitat per sector: 77 indústries amb ~13 temes materials cadascun. Enfocament en 'financial materiality' (una sola materialitat, contraposat a la doble materialitat de CSRD). Dades quantitatives orientades a inversors. Ús en creixement: 1.300+ empreses globals reporten amb SASB. Base de l'S2 (climate disclosure) de l'ISSB. Compatible amb TCFD i GRI. Materials gratuitament; certificación obligatòria per a reports públics.",
    descEs: "Sustainability Accounting Standards Board, ahora integrado en el ISSB (IFRS Sustainability Disclosure Standards). Estándares de reporting financero-sostenibilidad por sector: 77 industrias con ~13 temas materiales cada una. Enfoque en 'financial materiality' (una sola materialidad, contrapuesto a la doble materialidad de CSRD). Datos cuantitativos orientados a inversores. Uso en crecimiento: 1.300+ empresas globales reportan con SASB. Base del S2 (climate disclosure) del ISSB. Compatible con TCFD y GRI. Materiales gratuitos; certificación obligatoria para reports públicos.",
  },
  {
    slug: "tnfd",
    name: "TNFD",
    type: "fw",
    access: "free",
    logo: "/logos-estandards/tnfd.png",
    issuerCa: "Taskforce on Nature-related Financial Disclosures",
    issuerEs: "Taskforce on Nature-related Financial Disclosures",
    descCa: "Framework global per reportar dependències, impactes, riscos i oportunitats relacionats amb la natura. Llançat el setembre 2023 amb 14 recomanacions estructurals (4 pilars: governance, strategy, risk & impact management, metrics & targets). Complementa TCFD enfocant-se en biodiversitat, ecosistemes i serveis ecosistèmics. Eines: LEAP approach (Locate, Evaluate, Assess, Prepare) per a autoavaluació. 500+ early adopters globales. Base probable per a futurs estàndards ESRS E4 (biodiversitat) i ISSB sobre natura. Suport dels estats del GBF (Kunming-Montreal 2022).",
    descEs: "Framework global para reportar dependencias, impactos, riesgos y oportunidades relacionados con la naturaleza. Lanzado en septiembre 2023 con 14 recomendaciones estructurales (4 pilares: governance, strategy, risk & impact management, metrics & targets). Complementa a TCFD enfocándose en biodiversidad, ecosistemas y servicios ecosistémicos. Herramientas: LEAP approach (Locate, Evaluate, Assess, Prepare) para autoevaluación. 500+ early adopters globales. Base probable para futuros estándares ESRS E4 (biodiversidad) e ISSB sobre naturaleza. Apoyo de los estados del GBF (Kunming-Montreal 2022).",
  },
  {
    slug: "tcfd",
    name: "TCFD",
    type: "fw",
    access: "free",
    logo: "/logos-estandards/tcfd.png",
    issuerCa: "Financial Stability Board (FSB) · 2017",
    issuerEs: "Financial Stability Board (FSB) · 2017",
    descCa: "Taskforce on Climate-related Financial Disclosures. Framework per reportar riscos i oportunitats financeres climàtiques. 4 pilars: Governance, Strategy, Risk Management, Metrics & Targets. Classificació de riscos: físics (aguts i crònics) i de transició (regulatoris, tecnològics, mercat, reputació). 4.800+ organitzacions suporten TCFD (2024). Base de l'ESRS E1 (canvi climàtic), ISSB S2, CDP i la majoria de regulacions climàtiques nacionals (UK, Japó, Singapur, Nova Zelanda). Dissolt el 2023 i integrat a l'ISSB, però la metodologia segueix sent la referència global.",
    descEs: "Taskforce on Climate-related Financial Disclosures. Framework para reportar riesgos y oportunidades financieras climáticas. 4 pilares: Governance, Strategy, Risk Management, Metrics & Targets. Clasificación de riesgos: físicos (agudos y crónicos) y de transición (regulatorios, tecnológicos, mercado, reputación). 4.800+ organizaciones soportan TCFD (2024). Base del ESRS E1 (cambio climático), ISSB S2, CDP y la mayoría de regulaciones climáticas nacionales (UK, Japón, Singapur, Nueva Zelanda). Disuelto en 2023 e integrado en ISSB, pero la metodología sigue siendo la referencia global.",
  },
  {
    slug: "emas",
    name: "EMAS",
    type: "reg",
    access: "free",
    logo: "/logos-estandards/emas.png",
    issuerCa: "Comissió Europea · DG ENV",
    issuerEs: "Comisión Europea · DG ENV",
    descCa: "Eco-Management and Audit Scheme. Sistema comunitari d'eco-gestió i auditoria regulat pel Reglament (UE) 2017/1505. Voluntari però regulat (a diferència d'ISO 14001 que és estàndard privat). Més exigent: inclou declaració ambiental validada per verifier ambiental acreditat, compliment legal garantit, i millora contínua demostrable. 4.000+ organitzacions i 14.000+ centres a la UE (principalment Alemanya, Itàlia, Espanya). Espanya: 1.000+ centres, líder en hostaleria i administració local. Integrable amb ISO 14001 (basat en el mateix cicle PDCA). Renovació cada 3 anys.",
    descEs: "Eco-Management and Audit Scheme. Sistema comunitario de eco-gestión y auditoría regulado por el Reglamento (UE) 2017/1505. Voluntario pero regulado (a diferencia de ISO 14001 que es estándar privado). Más exigente: incluye declaración ambiental validada por verifier ambiental acreditado, cumplimiento legal garantizado, y mejora continua demostrable. 4.000+ organizaciones y 14.000+ centros en la UE (principalmente Alemania, Italia, España). España: 1.000+ centros, líder en hostelería y administración local. Integrable con ISO 14001 (basado en el mismo ciclo PDCA). Renovación cada 3 años.",
  },
  {
    slug: "iso-26000",
    name: "ISO 26000",
    type: "fw",
    access: "free",
    logo: "/logos-estandards/iso-26000.svg",
    issuerCa: "ISO · Ginebra (2010)",
    issuerEs: "ISO · Ginebra (2010)",
    descCa: "Guia internacional de responsabilitat social publicada per ISO el 2010. NO certificable (a diferència de la majoria d'estàndards ISO). Marc de referència amb 7 àrees nucli: governança organitzativa, drets humans, pràctiques laborals, medi ambient, pràctiques justes d'operació, assumptes de consumidors, participació i desenvolupament de la comunitat. 36 esferes d'acció. Adoptat per 80+ països com a estàndard nacional. Base d'estàndards certificables posteriors: ISO 26000-based SGE 21, ISO 20400 (sustainable procurement), ISO 37101 (desenvolupament sostenible comunitari). Revisió en cursor (2025-2026).",
    descEs: "Guía internacional de responsabilidad social publicada por ISO en 2010. NO certificable (a diferencia de la mayoría de estándares ISO). Marco de referencia con 7 áreas núcleo: gobernanza organizativa, derechos humanos, prácticas laborales, medio ambiente, prácticas justas de operación, asuntos de consumidores, participación y desarrollo de la comunidad. 36 esferas de acción. Adoptado por 80+ países como estándar nacional. Base de estándares certificables posteriores: ISO 26000-based SGE 21, ISO 20400 (sustainable procurement), ISO 37101 (desarrollo sostenible comunitario). Revisión en curso (2025-2026).",
  },
];

// ============ HELPER: count sempre derivat de xrefRows ============
// Aquesta funció és l'ÚNICA font de veritat per al nombre d'informes per estàndard.
// Mai facis servir un count hardcoded — sempre deriva'l de STANDARDS_DETAIL.
//
// Ús:
//   import { getStandardsWithCounts } from "@/lib/standards-data";
//   const standards = getStandardsWithCounts(); // [{...standar, count: N}, ...]
//
// Actualització: quan s'afegeix una xrefRow nova a standards-details.ts,
// el count s'actualitza automàticament a la pàgina índex. Sense sync manual.

import { STANDARDS_DETAIL } from "./standards-details";

export function getStandardsWithCounts(): StandarWithCount[] {
  return STANDARDS.map((s) => {
    const detail = STANDARDS_DETAIL[s.slug];
    const count = detail ? detail.xrefRows.length : 0;
    return { ...s, count };
  });
}

// Helper alternatiu per obtenir el count d'un sol estàndard
export function getStandarCount(slug: string): number {
  const detail = STANDARDS_DETAIL[slug];
  return detail ? detail.xrefRows.length : 0;
}
