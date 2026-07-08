// Catàleg d'informes - 10 informes reals publicats al 2026
// Cada informe té les dades bàsiques per mostrar a la biblioteca
// El contingut complet dels 8 blocs està a reports-content.ts

export type SemaforStatus = "verd" | "groc" | "vermell";

export type SemaforIndicator = {
  name: string;
  status: SemaforStatus;
  label: string;
  note: string;
};

export type SemaforGrade = "A" | "B" | "C" | "D";

export type ReportBlock = {
  // Bloc 0: Semàfor Metodològic
  semafor: {
    grade: SemaforGrade;
    gradeLabel: string;
    indicators: SemaforIndicator[];
  };
  // Bloc 1: Fitxa tècnica (es genera amb les dades bàsiques)
  // Bloc 2: 5 dades clau
  dadesClau: { value: string; label: string; page?: string }[];
  // Bloc 3: Resum executiu (300 paraules)
  resumExecutiu: string;
  // Bloc 4: Implicacions (450-540 paraules)
  implicacions: {
    empreses: string;
    reguladors: string;
    ciutadans: string;
  };
  // Subbloc: Més enllà del Checkbox
  mesEnllaCheckbox: {
    criteri: string;
    body: string;
  };
  // Bloc 5: Connexions
  connexions: { type: string; target: string; desc: string }[];
  // Bloc 6: Accions recomanades
  accions: { num: string; title: string; desc: string; effort: string; impact: string }[];
  // Bloc 7: Cross-reference
  crossRefs: { framework: string; criterion: string; impact: string }[];
};

export type Report = {
  slug: string;
  title: string;
  institution: string;
  date: string; // ISO format YYYY-MM-DD
  pages: number;
  type: "regulatory" | "framework" | "rating" | "industry" | "official";
  scope: "CAT" | "ES" | "EU" | "GLOBAL";
  tags: string[];
  certifications: string[]; // frameworks afectats
  summary: string; // 1-2 frases pel card
  url: string; // URL original
  // Contingut dels 8 blocs (en català)
  content_ca?: ReportBlock;
  // Contingut dels 8 blocs (en castellà)
  content_es?: ReportBlock;
};

export const reports: Report[] = [
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
    url: "https://finance.ec.europa.eu/news/commission-seeks-feedback-revised-sustainability-reporting-2026-05-06_en",
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
      "El 100% dels bancs significatius de la UE integren el risc climàtic als stress tests, però es mantenen gaps clau. El BCE identifica mancances en dades Scope 3.",
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
      "Global stocktake del progrés del mercat en avaluació i reporting de riscos relacionats amb natura. Es detecta adopció creixent però desigual entre sectors.",
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
      "A partir de gener 2026, B Lab comença recertificacions amb els nous Standards V2.1. El març 2026 s'obren a noves certificacions. 9 empreses pioneres ja certificant.",
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
      "Estimacions de demanda energètica global per regió i font. La demanda elèctrica creix un 4% liderada per renovables i Xina.",
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
      "7a edició de l'informe. Avalua el progrés de 41 països europeus en els ODS. Identifica estancament en ODS 13 (clima) i 12 (consum responsable).",
    url: "https://sdgtransformationcenter.org/reports/europe-sustainable-development-report-2026",
  },
];

// Helper per obtenir el label llegible d'un scope
export function getScopeLabel(scope: Report["scope"]): string {
  const labels: Record<Report["scope"], string> = {
    CAT: "Catalunya",
    ES: "Espanya",
    EU: "Europa",
    GLOBAL: "Global",
  };
  return labels[scope] ?? scope;
}

// Helper per obtenir el label llegible d'un tipus
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

// Helper per formatar la data
export function formatDate(isoDate: string, lang: "ca" | "es" = "ca"): string {
  const date = new Date(isoDate);
  const locale = lang === "es" ? "es-ES" : "ca-ES";
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Helper per calcular fa quants mesos es va publicar
export function getMonthsAgo(isoDate: string): number {
  const date = new Date(isoDate);
  const now = new Date();
  const months =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());
  return Math.max(0, months);
}

// Helper per saber si un informe és accessible gratis (>6 mesos)
export function isFreeAccess(isoDate: string): boolean {
  return getMonthsAgo(isoDate) >= 6;
}
