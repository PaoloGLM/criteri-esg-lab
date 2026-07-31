"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { Lock, ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

type StandarType = "reg" | "fw" | "cert";

interface StandarDetail {
  slug: string;
  name: string;
  type: StandarType;
  issuerCa: string;
  issuerEs: string;
  descCa: string;
  descEs: string;
  icon: string;
  logoUrl?: string;
  xrefRows: {
    reportTitle: string;
    date: string;
    criterionCa: string;
    criterionEs: string;
    impact: "high" | "med";
  }[];
  actions: {
    num: string;
    textCa: string;
    textEs: string;
    sourceCa: string;
    sourceEs: string;
  }[];
}

const TYPE_CONFIG: Record<StandarType, { color: string; bg: string; borderColor: string; labelCa: string; labelEs: string }> = {
  reg: { color: "#5C3A1E", bg: "rgba(92,58,30,0.15)", borderColor: "#5C3A1E", labelCa: "Regulació", labelEs: "Regulación" },
  fw: { color: "#B87333", bg: "rgba(184,115,51,0.12)", borderColor: "#B87333", labelCa: "Framework", labelEs: "Framework" },
  cert: { color: "#8A6D2B", bg: "rgba(232,201,154,0.25)", borderColor: "#E8C99A", labelCa: "Certificació", labelEs: "Certificación" },
};

const STANDARDS_DETAIL: Record<string, StandarDetail> = {
  "b-corp": {
    slug: "b-corp",
    name: "B Corp",
    type: "cert",
    issuerCa: "B Lab · Empreses amb propòsit",
    issuerEs: "B Lab · Empresas con propósito",
    descCa: "B Corp avalua l'impacte positiu d'una empresa en els seus treballadors, comunitat i medi ambient. Requiereix un score mínim de 80/200 en el B Impact Assessment. La certificació inclou 5 àrees: gobernança, treballadors, comunitat, entorn i clients.",
    descEs: "B Corp evalúa el impacto positivo de una empresa en sus trabajadores, comunidad y medio ambiente. Requiere un score mínimo de 80/200 en el B Impact Assessment. La certificación incluye 5 áreas: gobernanza, trabajadores, comunidad, entorno y clientes.",
    icon: "🌱",
    xrefRows: [
      { reportTitle: "Revisió dels ESRS: simplificació del CSRD", date: "6 may 2026",
        criterionCa: "La simplificació de datapoints pot facilitar el procés de certificació B Corp en reduir la càrrega de reporting paral·lel",
        criterionEs: "La simplificación de datapoints puede facilitar el proceso de certificación B Corp al reducir la carga de reporting paralelo",
        impact: "med" },
      { reportTitle: "EFRAG Sustainability Reporting Work Programme 2026", date: "12 feb 2026",
        criterionCa: "Convergència ESRS-GRI: les empreses B Corp que ja reporten amb GRI tindran menys treball duplicat en ESRS",
        criterionEs: "Convergencia ESRS-GRI: las empresas B Corp que ya reportan con GRI tendrán menos trabajo duplicado en ESRS",
        impact: "high" },
      { reportTitle: "CSDDD Omnibus I: esmenes finals", date: "15 mar 2026",
        criterionCa: "El deure de diligència en drets humans reforça el pilar 'Comunitat' del B Impact Assessment",
        criterionEs: "El deber de diligencia en derechos humanos refuerza el pilar 'Comunidad' del B Impact Assessment",
        impact: "high" },
      { reportTitle: "B Corp New Standards 2026", date: "22 abr 2026",
        criterionCa: "Nous performance requirements: alineació amb CSRD. Les empreses B Corp han de verificar compatibilitat amb reporting ESRS",
        criterionEs: "Nuevos performance requirements: alineación con CSRD. Las empresas B Corp deben verificar compatibilidad con reporting ESRS",
        impact: "high" },
      { reportTitle: "EU Taxonomy Delegated Act 2026", date: "28 mar 2026",
        criterionCa: "Activitats alineades amb Taxonomia UE poden comptar com a evidència per al pilar 'Entorn' de B Corp",
        criterionEs: "Actividades alineadas con Taxonomía UE pueden contar como evidencia para el pilar 'Entorno' de B Corp",
        impact: "med" },
    ],
    actions: [
      { num: "1", textCa: "Auditar la compatibilitat entre els nous B Corp Performance Requirements i el reporting ESRS vigent abans del proper cicle de certificació",
        textEs: "Auditar la compatibilidad entre los nuevos B Corp Performance Requirements y el reporting ESRS vigente antes del próximo ciclo de certificación",
        sourceCa: "Font: B Corp New Standards 2026", sourceEs: "Fuente: B Corp New Standards 2026" },
      { num: "2", textCa: "Aprofitar la convergència ESRS-GRI per reduir treball duplicat en el B Impact Assessment",
        textEs: "Aprovechar la convergencia ESRS-GRI para reducir trabajo duplicado en el B Impact Assessment",
        sourceCa: "Font: EFRAG Work Programme 2026", sourceEs: "Fuente: EFRAG Work Programme 2026" },
      { num: "3", textCa: "Documentar el deure de diligència en drets humans com a evidència per al pilar 'Comunitat' de B Corp",
        textEs: "Documentar el deber de diligencia en derechos humanos como evidencia para el pilar 'Comunidad' de B Corp",
        sourceCa: "Font: CSDDD Omnibus I", sourceEs: "Fuente: CSDDD Omnibus I" },
      { num: "4", textCa: "Mapejar activitats alineades amb Taxonomia UE com a evidència per al pilar 'Entorn' del B Impact Assessment",
        textEs: "Mapear actividades alineadas con Taxonomía UE como evidencia para el pilar 'Entorno' del B Impact Assessment",
        sourceCa: "Font: EU Taxonomy Delegated Act 2026", sourceEs: "Fuente: EU Taxonomy Delegated Act 2026" },
    ],
  },
  "csrd-esrs": {
    slug: "csrd-esrs",
    name: "csrd-esrs",
    type: "reg" as StandarType,
    issuerCa: "Comissio Europea / EFRAG",
    issuerEs: "Comision Europea / EFRAG",
    descCa: "La Directiva de Informació sobre Sostenibilitat Corporativa (CSRD) és una regulació de la UE que exigeix a les grans empreses i pimes cotitzades divulgar informació detallada sobre la seva sostenibilitat. Substitueix la NFRD i amplia significativament l\'abast i el detall dels requisits d\'informació. Els Estàndards Europeus d\'Informació sobre Sostenibilitat (ESRS), desenvolupats per l\'EFRAG, són els estàndards obligatoris que les empreses han de seguir per complir amb la CSRD, cobrint aspectes ambientals, socials i de governança (ESG) amb una perspectiva de doble materialitat. L\'objectiu és millorar la transparència i la comparabilitat de la informació de sostenibilitat.",
    descEs: "La Directiva de Información sobre Sostenibilidad Corporativa (CSRD) es una regulación de la UE que exige a las grandes empresas y pymes cotizadas divulgar información detallada sobre su sostenibilidad. Sustituye a la NFRD y amplía significativamente el alcance y el detalle de los requisitos de información. Los Estándares Europeos de Información sobre Sostenibilidad (ESRS), desarrollados por EFRAG, son los estándares obligatorios que las empresas deben seguir para cumplir con la CSRD, cubriendo aspectos ambientales, sociales y de gobernanza (ESG) con una perspectiva de doble materialidad. El objetivo es mejorar la transparencia y la comparabilidad de la información de sostenibilidad.",
    icon: "🇪🇺",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png",
    xrefRows: [
      { reportTitle: "Informe de Sostenibilitat 2024", date: "2025-04-15",
        criterionCa: "Divulgació d\'emissions de GEH (ESRS E1)",
        criterionEs: "Divulgación de emisiones de GEI (ESRS E1)",
        impact: "high" as "high" | "med" },
      { reportTitle: "Declaració d\'Informació No Financera 2023", date: "2024-03-20",
        criterionCa: "Anàlisi de doble materialitat",
        criterionEs: "Análisis de doble materialidad",
        impact: "high" as "high" | "med" },
      { reportTitle: "Pla de Transició Climàtica", date: "2024-11-01",
        criterionCa: "Impacte en la biodiversitat (ESRS E4)",
        criterionEs: "Impacto en la biodiversidad (ESRS E4)",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Realitzar una anàlisi de doble materialitat per identificar els temes ESG rellevants.",
        textEs: "Realizar un análisis de doble materialidad para identificar los temas ESG relevantes.",
        sourceCa: "Guia d\'implementació CSRD", sourceEs: "Guía de implementación CSRD" },
      { num: "2", textCa: "Recopilar dades i preparar informes conforme als ESRS aplicables.",
        textEs: "Recopilar datos y preparar informes conforme a los ESRS aplicables.",
        sourceCa: "EFRAG ESRS Q&A", sourceEs: "EFRAG ESRS Q&A" },
      { num: "3", textCa: "Integrar els requisits de la CSRD en els sistemes de gestió i governança de l\'empresa.",
        textEs: "Integrar los requisitos de la CSRD en los sistemas de gestión y gobernanza de la empresa.",
        sourceCa: "Recomanacions Comissió Europea", sourceEs: "Recomendaciones Comisión Europea" },
    ],
  },
  "csddd": {
    slug: "csddd",
    name: "csddd",
    type: "reg" as StandarType,
    issuerCa: "Comissio Europea",
    issuerEs: "Comision Europea",
    descCa: "La Directiva de Diligència Deguda de Sostenibilitat Corporativa (CSDDD) és una proposta legislativa de la UE que busca establir un deure de diligència deguda per a les empreses respecte als impactes negatius en els drets humans i el medi ambient en les seves cadenes de valor. Obliga les empreses a identificar, prevenir, mitigar i rendir comptes dels impactes adversos, tant en les seves pròpies operacions com en les de les seves filials i socis comercials. L\'objectiu és fomentar un comportament empresarial sostenible i responsable, i garantir que les empreses tinguin un paper actiu en la protecció dels drets humans i el medi ambient a nivell global.",
    descEs: "La Directiva de Diligencia Debida de Sostenibilidad Corporativa (CSDDD) es una propuesta legislativa de la UE que busca establecer un deber de diligencia debida para las empresas respecto a los impactos negativos en los derechos humanos y el medio ambiente en sus cadenas de valor. Obliga a las empresas a identificar, prevenir, mitigar y rendir cuentas de los impactos adversos, tanto en sus propias operaciones como en las de sus filiales y socios comerciales. El objetivo es fomentar un comportamiento empresarial sostenible y responsable, y garantizar que las empresas desempeñen un papel activo en la protección de los derechos humanos y el medio ambiente a nivel global.",
    icon: "⚖️",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png",
    xrefRows: [
      { reportTitle: "Informe de Diligència Deguda de la Cadena de Subministrament 2024", date: "2025-01-30",
        criterionCa: "Identificació de riscos de drets humans en proveïdors",
        criterionEs: "Identificación de riesgos de derechos humanos en proveedores",
        impact: "high" as "high" | "med" },
      { reportTitle: "Avaluació d\'Impacte Ambiental de Projecte", date: "2024-07-10",
        criterionCa: "Mesures de mitigació de la contaminació de l\'aigua",
        criterionEs: "Medidas de mitigación de la contaminación del agua",
        impact: "high" as "high" | "med" },
      { reportTitle: "Política de Compres Sostenibles", date: "2024-05-01",
        criterionCa: "Clàusules contractuals de sostenibilitat per a proveïdors",
        criterionEs: "Cláusulas contractuales de sostenibilidad para proveedores",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Establir i implementar un procés de diligència deguda en tota la cadena de valor.",
        textEs: "Establecer e implementar un proceso de diligencia debida en toda la cadena de valor.",
        sourceCa: "Guia CSDDD de la Comissió Europea", sourceEs: "Guía CSDDD de la Comisión Europea" },
      { num: "2", textCa: "Identificar i avaluar els impactes adversos reals i potencials en drets humans i medi ambient.",
        textEs: "Identificar y evaluar los impactos adversos reales y potenciales en derechos humanos y medio ambiente.",
        sourceCa: "Principis Rectors de l\'ONU sobre Empreses i Drets Humans", sourceEs: "Principios Rectores de la ONU sobre Empresas y Derechos Humanos" },
      { num: "3", textCa: "Desenvolupar i implementar plans de prevenció, mitigació i reparació d\'aquests impactes.",
        textEs: "Desarrollar e implementar planes de prevención, mitigación y reparación de dichos impactos.",
        sourceCa: "Proposta de Directiva CSDDD", sourceEs: "Propuesta de Directiva CSDDD" },
    ],
  },
  "sfdr": {
    slug: "sfdr",
    name: "sfdr",
    type: "reg" as StandarType,
    issuerCa: "Comissio Europea",
    issuerEs: "Comision Europea",
    descCa: "El Reglament sobre Divulgació d\'Informació de Sostenibilitat en el Sector dels Serveis Financers (SFDR) és una regulació de la UE que té com a objectiu augmentar la transparència sobre com els participants dels mercats financers i els assessors financers integren els riscos de sostenibilitat i consideren els impactes adversos de la sostenibilitat en els seus processos. Classifica els productes financers en tres categories (Article 6, 8 i 9) segons el seu nivell d\'ambició en sostenibilitat, facilitant als inversors la presa de decisions informades i lluitant contra el \'greenwashing\'.",
    descEs: "El Reglamento sobre Divulgación de Información de Sostenibilidad en el Sector de los Servicios Financieros (SFDR) es una regulación de la UE que tiene como objetivo aumentar la transparencia sobre cómo los participantes de los mercados financieros y los asesores financieros integran los riesgos de sostenibilidad y consideran los impactos adversos de la sostenibilidad en sus procesos. Clasifica los productos financieros en tres categorías (Artículo 6, 8 y 9) según su nivel de ambición en sostenibilidad, facilitando a los inversores la toma de decisiones informadas y luchando contra el \'greenwashing\'.",
    icon: "💰",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png",
    xrefRows: [
      { reportTitle: "Informe Anual de Fons d\'Inversió Sostenible", date: "2024-02-28",
        criterionCa: "Classificació de fons segons Article 8 SFDR",
        criterionEs: "Clasificación de fondos según Artículo 8 SFDR",
        impact: "high" as "high" | "med" },
      { reportTitle: "Declaració de Principals Impactes Adversos (PAI)", date: "2024-06-30",
        criterionCa: "Divulgació de PAI sobre emissions de CO2",
        criterionEs: "Divulgación de PAI sobre emisiones de CO2",
        impact: "high" as "high" | "med" },
      { reportTitle: "Prospecte de Producte Financer", date: "2024-01-15",
        criterionCa: "Integració de riscos de sostenibilitat en la presa de decisions",
        criterionEs: "Integración de riesgos de sostenibilidad en la toma de decisiones",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Classificar els productes financers segons els articles 6, 8 o 9 de l\'SFDR.",
        textEs: "Clasificar los productos financieros según los artículos 6, 8 o 9 del SFDR.",
        sourceCa: "Reglament SFDR (UE) 2019/2088", sourceEs: "Reglamento SFDR (UE) 2019/2088" },
      { num: "2", textCa: "Divulgar informació sobre com s\'integren els riscos de sostenibilitat en les decisions d\'inversió.",
        textEs: "Divulgar información sobre cómo se integran los riesgos de sostenibilidad en las decisiones de inversión.",
        sourceCa: "ESMA Q&A sobre SFDR", sourceEs: "ESMA Q&A sobre SFDR" },
      { num: "3", textCa: "Publicar declaracions sobre els principals impactes adversos (PAI) de les inversions.",
        textEs: "Publicar declaraciones sobre los principales impactos adversos (PAI) de las inversiones.",
        sourceCa: "Reglament Delegat (UE) 2022/1288", sourceEs: "Reglamento Delegado (UE) 2022/1288" },
    ],
  },
  "taxonomia-ue": {
    slug: "taxonomia-ue",
    name: "taxonomia-ue",
    type: "reg" as StandarType,
    issuerCa: "Comissio Europea",
    issuerEs: "Comision Europea",
    descCa: "La Taxonomia de la UE és un sistema de classificació que estableix una llista d\'activitats econòmiques ambientalment sostenibles. El seu objectiu és dirigir la inversió cap a activitats que contribueixin significativament a almenys un dels sis objectius ambientals (mitigació del canvi climàtic, adaptació al canvi climàtic, ús sostenible i protecció dels recursos hídrics i marins, transició a una economia circular, prevenció i control de la contaminació, i protecció i restauració de la biodiversitat i els ecosistemes), sense causar un dany significatiu a cap dels altres (principi \'Do No Significant Harm\' - DNSH).",
    descEs: "La Taxonomía de la UE es un sistema de clasificación que establece una lista de actividades económicas ambientalmente sostenibles. Su objetivo es dirigir la inversión hacia actividades que contribuyan significativamente a al menos uno de los seis objetivos ambientales (mitigación del cambio climático, adaptación al cambio climático, uso sostenible y protección de los recursos hídricos y marinos, transición a una economía circular, prevención y control de la contaminación, y protección y restauración de la biodiversidad y los ecosistemas), sin causar un daño significativo a ninguno de los demás (principio \'Do No Significant Harm\' - DNSH).",
    icon: "🌱",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png",
    xrefRows: [
      { reportTitle: "Declaració No Financera 2023", date: "2024-03-10",
        criterionCa: "Percentatge de facturació alineat amb la Taxonomia UE",
        criterionEs: "Porcentaje de facturación alineado con la Taxonomía UE",
        impact: "high" as "high" | "med" },
      { reportTitle: "Informe de Projectes d\'Inversió Sostenible", date: "2024-09-01",
        criterionCa: "Alineació de CapEx amb objectius de mitigació climàtica",
        criterionEs: "Alineación de CapEx con objetivos de mitigación climática",
        impact: "high" as "high" | "med" },
      { reportTitle: "Avaluació de Sostenibilitat de la Cartera", date: "2024-06-20",
        criterionCa: "Compliment del principi DNSH en activitats clau",
        criterionEs: "Cumplimiento del principio DNSH en actividades clave",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Avaluar les activitats econòmiques de l\'empresa segons els criteris tècnics de la Taxonomia.",
        textEs: "Evaluar las actividades económicas de la empresa según los criterios técnicos de la Taxonomía.",
        sourceCa: "Reglament (UE) 2020/852", sourceEs: "Reglamento (UE) 2020/852" },
      { num: "2", textCa: "Divulgar el percentatge de facturació, CapEx i OpEx alineat amb la Taxonomia.",
        textEs: "Divulgar el porcentaje de facturación, CapEx y OpEx alineado con la Taxonomía.",
        sourceCa: "Actes Delegats de la Taxonomia", sourceEs: "Actos Delegados de la Taxonomía" },
      { num: "3", textCa: "Assegurar que les activitats alineades compleixen el principi \'Do No Significant Harm\' (DNSH).",
        textEs: "Asegurar que las actividades alineadas cumplen el principio \'Do No Significant Harm\' (DNSH).",
        sourceCa: "Guia de la Comissió Europea sobre la Taxonomia", sourceEs: "Guía de la Comisión Europea sobre la Taxonomía" },
    ],
  },
  "emas": {
    slug: "emas",
    name: "emas",
    type: "reg" as StandarType,
    issuerCa: "Comissio Europea",
    issuerEs: "Comision Europea",
    descCa: "El Sistema Comunitari de Gestió i Auditoria Ambientals (EMAS) és un instrument voluntari de la Unió Europea que permet a les organitzacions avaluar, gestionar i millorar el seu rendiment ambiental. Les organitzacions registrades amb EMAS es comprometen a una millora contínua del seu comportament ambiental, publiquen regularment una declaració ambiental verificada de forma independent i compleixen amb tota la legislació ambiental aplicable. EMAS promou la transparència i la credibilitat en la gestió ambiental corporativa.",
    descEs: "El Sistema Comunitario de Gestión y Auditoría Ambientales (EMAS) es un instrumento voluntario de la Unión Europea que permite a las organizaciones evaluar, gestionar y mejorar su rendimiento ambiental. Las organizaciones registradas con EMAS se comprometen a una mejora continua de su comportamiento ambiental, publican regularmente una declaración ambiental verificada de forma independiente y cumplen con toda la legislación ambiental aplicable. EMAS promueve la transparencia y la credibilidad en la gestión ambiental corporativa.",
    icon: "🌳",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png",
    xrefRows: [
      { reportTitle: "Declaració Ambiental 2024", date: "2024-05-01",
        criterionCa: "Reducció del consum energètic per unitat de producció",
        criterionEs: "Reducción del consumo energético por unidad de producción",
        impact: "high" as "high" | "med" },
      { reportTitle: "Informe d\'Auditoria Ambiental EMAS", date: "2024-03-15",
        criterionCa: "Compliment de la legislació ambiental vigent",
        criterionEs: "Cumplimiento de la legislación ambiental vigente",
        impact: "high" as "high" | "med" },
      { reportTitle: "Revisió de la Gestió Ambiental", date: "2024-10-01",
        criterionCa: "Objectius de reducció de residus i reciclatge",
        criterionEs: "Objetivos de reducción de residuos y reciclaje",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Implementar un sistema de gestió ambiental d\'acord amb els requisits d\'EMAS.",
        textEs: "Implementar un sistema de gestión ambiental de acuerdo con los requisitos de EMAS.",
        sourceCa: "Reglament (CE) No 1221/2009 (EMAS III)", sourceEs: "Reglamento (CE) No 1221/2009 (EMAS III)" },
      { num: "2", textCa: "Realitzar auditories ambientals periòdiques i millorar contínuament el rendiment.",
        textEs: "Realizar auditorías ambientales periódicas y mejorar continuamente el rendimiento.",
        sourceCa: "Guia d\'implementació EMAS", sourceEs: "Guía de implementación EMAS" },
      { num: "3", textCa: "Publicar una declaració ambiental verificada i registrar-se a EMAS.",
        textEs: "Publicar una declaración ambiental verificada y registrarse en EMAS.",
        sourceCa: "Comissió Europea - EMAS", sourceEs: "Comisión Europea - EMAS" },
    ],
  },
  "gri": {
    slug: "gri",
    name: "gri",
    type: "fw" as StandarType,
    issuerCa: "Global Reporting Initiative",
    issuerEs: "Global Reporting Initiative",
    descCa: "Els Estàndards GRI (Global Reporting Initiative) són els estàndards de reporting de sostenibilitat més utilitzats a nivell mundial. Proporcionen un marc modular i interconnectat que permet a les organitzacions divulgar els seus impactes més significatius en l\'economia, el medi ambient i les persones. Els estàndards GRI ajuden les empreses a entendre i comunicar la seva contribució al desenvolupament sostenible, basant-se en el principi de materialitat per identificar els temes rellevants per als seus grups d\'interès. Són un referent clau per a la transparència i la rendició de comptes en sostenibilitat.",
    descEs: "Los Estándares GRI (Global Reporting Initiative) son los estándares de reporting de sostenibilidad más utilizados a nivel mundial. Proporcionan un marco modular e interconectado que permite a las organizaciones divulgar sus impactos más significativos en la economía, el medio ambiente y las personas. Los estándares GRI ayudan a las empresas a entender y comunicar su contribución al desarrollo sostenible, basándose en el principio de materialidad para identificar los temas relevantes para sus grupos de interés. Son un referente clave para la transparencia y la rendición de cuentas en sostenibilidad.",
    icon: "📊",
    logoUrl: "https://www.globalreporting.org/themes/custom/gri/images/logo.svg",
    xrefRows: [
      { reportTitle: "Informe de Sostenibilitat 2023 (GRI)", date: "2024-04-01",
        criterionCa: "Divulgació d\'emissions de GEH (GRI 305)",
        criterionEs: "Divulgación de emisiones de GEI (GRI 305)",
        impact: "high" as "high" | "med" },
      { reportTitle: "Matriu de Materialitat", date: "2023-11-15",
        criterionCa: "Identificació de temes materials amb GRI 1",
        criterionEs: "Identificación de temas materiales con GRI 1",
        impact: "high" as "high" | "med" },
      { reportTitle: "Informe de Drets Humans i Pràctiques Laborals", date: "2024-06-01",
        criterionCa: "Pràctiques laborals i treball digne (GRI 401)",
        criterionEs: "Prácticas laborales y trabajo digno (GRI 401)",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Realitzar un procés de materialitat per identificar els temes rellevants segons GRI 1.",
        textEs: "Realizar un proceso de materialidad para identificar los temas relevantes según GRI 1.",
        sourceCa: "GRI Universal Standards", sourceEs: "GRI Universal Standards" },
      { num: "2", textCa: "Recopilar dades i informar sobre els temes materials utilitzant els Estàndards Tèmatics GRI.",
        textEs: "Recopilar datos e informar sobre los temas materiales utilizando los Estándares Temáticos GRI.",
        sourceCa: "GRI Standards Library", sourceEs: "GRI Standards Library" },
      { num: "3", textCa: "Publicar un informe de sostenibilitat que compleixi amb els principis de reporting GRI.",
        textEs: "Publicar un informe de sostenibilidad que cumpla con los principios de reporting GRI.",
        sourceCa: "Guia d\'implementació GRI", sourceEs: "Guía de implementación GRI" },
    ],
  },
  "sasb": {
    slug: "sasb",
    name: "sasb",
    type: "fw" as StandarType,
    issuerCa: "IFRS Foundation",
    issuerEs: "IFRS Foundation",
    descCa: "Els Estàndards SASB (Sustainability Accounting Standards Board), ara part de la IFRS Foundation, proporcionen un conjunt de 77 estàndards específics per a la indústria que identifiquen els temes de sostenibilitat financerament materials. El seu objectiu és ajudar les empreses a divulgar informació ESG rellevant per als inversors, que sigui comparable, coherent i útil per a la presa de decisions financeres. A diferència d\'altres marcs, SASB se centra en la materialitat financera, és a dir, en els temes ESG que podrien afectar el valor empresarial a curt i llarg termini.",
    descEs: "Los Estándares SASB (Sustainability Accounting Standards Board), ahora parte de la IFRS Foundation, proporcionan un conjunto de 77 estándares específicos para la industria que identifican los temas de sostenibilidad financieramente materiales. Su objetivo es ayudar a las empresas a divulgar información ESG relevante para los inversores, que sea comparable, coherente y útil para la toma de decisiones financieras. A diferencia de otros marcos, SASB se centra en la materialidad financiera, es decir, en los temas ESG que podrían afectar el valor empresarial a corto y largo plazo.",
    icon: "📈",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/IFRS_Foundation_logo.svg/120px-IFRS_Foundation_logo.svg.png",
    xrefRows: [
      { reportTitle: "Informe Anual Integrat 2023", date: "2024-03-05",
        criterionCa: "Divulgació de riscos climàtics segons SASB (indústria)",
        criterionEs: "Divulgación de riesgos climáticos según SASB (industria)",
        impact: "high" as "high" | "med" },
      { reportTitle: "Presentació a Inversors ESG", date: "2024-05-20",
        criterionCa: "Mètriques de gestió de l\'aigua per a la indústria minera",
        criterionEs: "Métricas de gestión del agua para la industria minera",
        impact: "med" as "high" | "med" },
      { reportTitle: "Declaració de Sostenibilitat Sectorial", date: "2024-07-01",
        criterionCa: "Gestió de la seguretat de productes (indústria química)",
        criterionEs: "Gestión de la seguridad de productos (industria química)",
        impact: "high" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Identificar els estàndards SASB rellevants per a la indústria de l\'empresa.",
        textEs: "Identificar los estándares SASB relevantes para la industria de la empresa.",
        sourceCa: "SASB Standards Navigator", sourceEs: "SASB Standards Navigator" },
      { num: "2", textCa: "Recopilar i divulgar dades sobre els temes de sostenibilitat financerament materials.",
        textEs: "Recopilar y divulgar datos sobre los temas de sostenibilidad financieramente materiales.",
        sourceCa: "Guia d\'implementació SASB", sourceEs: "Guía de implementación SASB" },
      { num: "3", textCa: "Integrar la informació SASB en els informes financers o en informes integrats.",
        textEs: "Integrar la información SASB en los informes financieros o en informes integrados.",
        sourceCa: "IFRS Foundation - SASB", sourceEs: "IFRS Foundation - SASB" },
    ],
  },
  "tnfd": {
    slug: "tnfd",
    name: "tnfd",
    type: "fw" as StandarType,
    issuerCa: "Taskforce on Nature-related Financial Disclosures",
    issuerEs: "Taskforce on Nature-related Financial Disclosures",
    descCa: "El Taskforce on Nature-related Financial Disclosures (TNFD) és un marc de divulgació voluntari que permet a les organitzacions informar sobre els seus riscos i oportunitats relacionats amb la natura. Inspirat en el TCFD, el TNFD té com a objectiu ajudar les empreses a integrar la natura en la presa de decisions estratègiques i financeres, avaluació de riscos i processos de divulgació. El seu marc es basa en quatre pilars (governança, estratègia, gestió de riscos i impactes, i mètriques i objectius) i busca mobilitzar capital cap a resultats positius per a la natura.",
    descEs: "El Taskforce on Nature-related Financial Disclosures (TNFD) es un marco de divulgación voluntario que permite a las organizaciones informar sobre sus riesgos y oportunidades relacionados con la naturaleza. Inspirado en el TCFD, el TNFD tiene como objetivo ayudar a las empresas a integrar la naturaleza en la toma de decisiones estratégicas y financieras, evaluación de riesgos y procesos de divulgación. Su marco se basa en cuatro pilares (gobernanza, estrategia, gestión de riesgos e impactos, y métricas y objetivos) y busca movilizar capital hacia resultados positivos para la naturaleza.",
    icon: "🦋",
    logoUrl: "https://tnfd.global/wp-content/uploads/2023/09/tnfd-logo.svg",
    xrefRows: [
      { reportTitle: "Informe de Riscos i Oportunitats Relacionats amb la Natura", date: "2025-01-20",
        criterionCa: "Avaluació de la dependència de la biodiversitat en la cadena de valor",
        criterionEs: "Evaluación de la dependencia de la biodiversidad en la cadena de valor",
        impact: "high" as "high" | "med" },
      { reportTitle: "Estratègia de Sostenibilitat 2030", date: "2024-09-10",
        criterionCa: "Integració de la natura en la governança corporativa",
        criterionEs: "Integración de la naturaleza en la gobernanza corporativa",
        impact: "med" as "high" | "med" },
      { reportTitle: "Anàlisi d\'Escenaris de Biodiversitat", date: "2024-04-01",
        criterionCa: "Mètriques d\'impacte en ecosistemes locals",
        criterionEs: "Métricas de impacto en ecosistemas locales",
        impact: "high" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Realitzar una avaluació dels riscos i oportunitats relacionats amb la natura (LEAP approach).",
        textEs: "Realizar una evaluación de los riesgos y oportunidades relacionados con la naturaleza (LEAP approach).",
        sourceCa: "TNFD Disclosure Framework", sourceEs: "TNFD Disclosure Framework" },
      { num: "2", textCa: "Integrar els riscos i oportunitats relacionats amb la natura en l\'estratègia i la gestió de riscos.",
        textEs: "Integrar los riesgos y oportunidades relacionados con la naturaleza en la estrategia y la gestión de riesgos.",
        sourceCa: "Recomanacions TNFD", sourceEs: "Recomendaciones TNFD" },
      { num: "3", textCa: "Divulgar informació sobre governança, estratègia, gestió de riscos i mètriques de natura.",
        textEs: "Divulgar información sobre gobernanza, estrategia, gestión de riesgos y métricas de naturaleza.",
        sourceCa: "Guia d\'implementació TNFD", sourceEs: "Guía de implementación TNFD" },
    ],
  },
  "tcfd": {
    slug: "tcfd",
    name: "tcfd",
    type: "fw" as StandarType,
    issuerCa: "Financial Stability Board",
    issuerEs: "Financial Stability Board",
    descCa: "El Task Force on Climate-related Financial Disclosures (TCFD) és un marc de divulgació voluntari creat pel Financial Stability Board (FSB) per millorar i augmentar la qualitat de la informació financera relacionada amb el clima. Proporciona recomanacions per a la divulgació de riscos i oportunitats climàtiques a través de quatre pilars: governança, estratègia, gestió de riscos, i mètriques i objectius. L\'objectiu és ajudar les empreses a proporcionar informació útil als inversors i altres parts interessades sobre com gestionen els impactes financers del canvi climàtic.",
    descEs: "El Task Force on Climate-related Financial Disclosures (TCFD) es un marco de divulgación voluntario creado por el Financial Stability Board (FSB) para mejorar y aumentar la calidad de la información financiera relacionada con el clima. Proporciona recomendaciones para la divulgación de riesgos y oportunidades climáticas a través de cuatro pilares: gobernanza, estrategia, gestión de riesgos, y métricas y objetivos. El objetivo es ayudar a las empresas a proporcionar información útil a los inversores y otras partes interesadas sobre cómo gestionan los impactos financieros del cambio climático.",
    icon: "🌡️",
    logoUrl: "https://www.fsb-tcfd.org/wp-content/uploads/2021/03/TCFD-logo-300x77.png",
    xrefRows: [
      { reportTitle: "Informe de Riscos Climàtics 2023", date: "2024-03-30",
        criterionCa: "Anàlisi d\'escenaris climàtics (TCFD Estratègia)",
        criterionEs: "Análisis de escenarios climáticos (TCFD Estrategia)",
        impact: "high" as "high" | "med" },
      { reportTitle: "Declaració Anual de Sostenibilitat", date: "2024-04-15",
        criterionCa: "Mètriques d\'emissions de GEH (Scope 1, 2, 3)",
        criterionEs: "Métricas de emisiones de GEI (Alcance 1, 2, 3)",
        impact: "high" as "high" | "med" },
      { reportTitle: "Informe de Govern Corporatiu", date: "2024-02-20",
        criterionCa: "Supervisió de riscos climàtics per part del consell",
        criterionEs: "Supervisión de riesgos climáticos por parte del consejo",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Integrar la supervisió dels riscos i oportunitats climàtiques en la governança corporativa.",
        textEs: "Integrar la supervisión de los riesgos y oportunidades climáticas en la gobernanza corporativa.",
        sourceCa: "Recomanacions TCFD", sourceEs: "Recomendaciones TCFD" },
      { num: "2", textCa: "Avaluar l\'impacte dels riscos i oportunitats climàtiques en l\'estratègia i la planificació financera.",
        textEs: "Evaluar el impacto de los riesgos y oportunidades climáticas en la estrategia y la planificación financiera.",
        sourceCa: "Guia d\'implementació TCFD", sourceEs: "Guía de implementación TCFD" },
      { num: "3", textCa: "Divulgar mètriques i objectius relacionats amb el clima, incloses les emissions de GEH.",
        textEs: "Divulgar métricas y objetivos relacionados con el clima, incluidas las emisiones de GEI.",
        sourceCa: "FSB TCFD Status Report", sourceEs: "FSB TCFD Status Report" },
    ],
  },
  "iso-26000": {
    slug: "iso-26000",
    name: "iso-26000",
    type: "fw" as StandarType,
    issuerCa: "ISO",
    issuerEs: "ISO",
    descCa: "La norma ISO 26000 proporciona orientació sobre responsabilitat social (RS) per a organitzacions de tot tipus i mida, tant del sector públic com privat. Aquesta norma no és certificable, sinó que ofereix un marc per ajudar les organitzacions a operar de manera socialment responsable. Cobreix set matèries fonamentals: governança organitzacional, drets humans, pràctiques laborals, medi ambient, pràctiques justes d\'operació, assumptes de consumidors i participació activa i desenvolupament de la comunitat. Ajuda a les organitzacions a traduir els principis de RS en accions efectives.",
    descEs: "La norma ISO 26000 proporciona orientación sobre responsabilidad social (RS) para organizaciones de todo tipo y tamaño, tanto del sector público como privado. Esta norma no es certificable, sino que ofrece un marco para ayudar a las organizaciones a operar de manera socialmente responsable. Cubre siete materias fundamentales: gobernanza organizacional, derechos humanos, prácticas laborales, medio ambiente, prácticas justas de operación, asuntos de consumidores y participación activa y desarrollo de la comunidad. Ayuda a las organizaciones a traducir los principios de RS en acciones efectivas.",
    icon: "🌐",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/ISO_Logo.svg/120px-ISO_Logo.svg.png",
    xrefRows: [
      { reportTitle: "Informe de Responsabilitat Social Corporativa", date: "2024-05-01",
        criterionCa: "Integració de principis de drets humans en la política interna",
        criterionEs: "Integración de principios de derechos humanos en la política interna",
        impact: "high" as "high" | "med" },
      { reportTitle: "Codi de Conducta i Ètica", date: "2023-10-20",
        criterionCa: "Pràctiques justes d\'operació i anticorrupció",
        criterionEs: "Prácticas justas de operación y anticorrupción",
        impact: "med" as "high" | "med" },
      { reportTitle: "Avaluació d\'Impacte Comunitari", date: "2024-07-15",
        criterionCa: "Contribució al desenvolupament local",
        criterionEs: "Contribución al desarrollo local",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Comprendre els principis i les set matèries fonamentals de la responsabilitat social.",
        textEs: "Comprender los principios y las siete materias fundamentales de la responsabilidad social.",
        sourceCa: "ISO 26000:2010", sourceEs: "ISO 26000:2010" },
      { num: "2", textCa: "Integrar la responsabilitat social en les decisions i operacions de l\'organització.",
        textEs: "Integrar la responsabilidad social en las decisiones y operaciones de la organización.",
        sourceCa: "Guia d\'implementació ISO 26000", sourceEs: "Guía de implementación ISO 26000" },
      { num: "3", textCa: "Comunicar el compromís i el rendiment en responsabilitat social als grups d\'interès.",
        textEs: "Comunicar el compromiso y el rendimiento en responsabilidad social a los grupos de interés.",
        sourceCa: "ISO - Beneficis de la ISO 26000", sourceEs: "ISO - Beneficios de la ISO 26000" },
    ],
  },
  "ecovadis": {
    slug: "ecovadis",
    name: "ecovadis",
    type: "cert" as StandarType,
    issuerCa: "EcoVadis",
    issuerEs: "EcoVadis",
    descCa: "EcoVadis és una plataforma de qualificació de sostenibilitat empresarial que avalua el rendiment ESG de les empreses a través de la seva cadena de subministrament global. Utilitza una metodologia basada en 21 indicadors agrupats en quatre temes principals: Medi Ambient, Pràctiques Laborals i Drets Humans, Ètica i Compres Sostenibles. Les empreses reben una puntuació i una medalla (Bronze, Plata, Or, Platí) que els permeten millorar el seu rendiment i comunicar el seu compromís amb la sostenibilitat als seus socis comercials. És un referent per a la gestió de riscos de sostenibilitat en la cadena de valor.",
    descEs: "EcoVadis es una plataforma de calificación de sostenibilidad empresarial que evalúa el rendimiento ESG de las empresas a través de su cadena de suministro global. Utiliza una metodología basada en 21 indicadores agrupados en cuatro temas principales: Medio Ambiente, Prácticas Laborales y Derechos Humanos, Ética y Compras Sostenibles. Las empresas reciben una puntuación y una medalla (Bronce, Plata, Oro, Platino) que les permiten mejorar su rendimiento y comunicar su compromiso con la sostenibilidad a sus socios comerciales. Es un referente para la gestión de riesgos de sostenibilidad en la cadena de valor.",
    icon: "🏅",
    logoUrl: "https://ecovadis.com/wp-content/uploads/2022/02/ecovadis-logo.svg",
    xrefRows: [
      { reportTitle: "Targeta de Puntuació EcoVadis 2024", date: "2024-06-01",
        criterionCa: "Puntuació en el tema Medi Ambient",
        criterionEs: "Puntuación en el tema Medio Ambiente",
        impact: "high" as "high" | "med" },
      { reportTitle: "Avaluació de Proveïdors Clau", date: "2024-03-10",
        criterionCa: "Compliment de requisits ètics en la cadena de subministrament",
        criterionEs: "Cumplimiento de requisitos éticos en la cadena de suministro",
        impact: "med" as "high" | "med" },
      { reportTitle: "Pla de Millora de Sostenibilitat", date: "2024-09-01",
        criterionCa: "Accions per millorar la puntuació en Pràctiques Laborals",
        criterionEs: "Acciones para mejorar la puntuación en Prácticas Laborales",
        impact: "high" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Completar el qüestionari d\'avaluació de sostenibilitat d\'EcoVadis.",
        textEs: "Completar el cuestionario de evaluación de sostenibilidad de EcoVadis.",
        sourceCa: "Plataforma EcoVadis", sourceEs: "Plataforma EcoVadis" },
      { num: "2", textCa: "Desenvolupar un pla d\'acció de millora basat en els resultats de l\'avaluació.",
        textEs: "Desarrollar un plan de acción de mejora basado en los resultados de la evaluación.",
        sourceCa: "Metodologia EcoVadis", sourceEs: "Metodología EcoVadis" },
      { num: "3", textCa: "Compartir la targeta de puntuació amb els socis comercials per demostrar el compromís ESG.",
        textEs: "Compartir la tarjeta de puntuación con los socios comerciales para demostrar el compromiso ESG.",
        sourceCa: "EcoVadis Support Center", sourceEs: "EcoVadis Support Center" },
    ],
  },
  "msci-esg": {
    slug: "msci-esg",
    name: "msci-esg",
    type: "cert" as StandarType,
    issuerCa: "MSCI",
    issuerEs: "MSCI",
    descCa: "MSCI ESG Research proporciona qualificacions ESG per a milers d\'empreses públiques a nivell mundial. Aquestes qualificacions mesuren la resiliència d\'una empresa davant els riscos ESG financerament rellevants a llarg termini, basant-se en l\'exposició de l\'empresa a riscos ESG específics de la indústria i la seva capacitat per gestionar-los en relació amb els seus parells. Les qualificacions van des de \'AAA\' (líder) fins a \'CCC\' (endarrerit) i són àmpliament utilitzades per inversors institucionals per integrar consideracions ESG en les seves decisions d\'inversió i gestió de carteres.",
    descEs: "MSCI ESG Research proporciona calificaciones ESG para miles de empresas públicas a nivel mundial. Estas calificaciones miden la resiliencia de una empresa ante los riesgos ESG financieramente relevantes a largo plazo, basándose en la exposición de la empresa a riesgos ESG específicos de la industria y su capacidad para gestionarlos en relación con sus pares. Las calificaciones van desde \'AAA\' (líder) hasta \'CCC\' (rezagado) y son ampliamente utilizadas por inversores institucionales para integrar consideraciones ESG en sus decisiones de inversión y gestión de carteras.",
    icon: "📊",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/MSCI_logo.svg/120px-MSCI_logo.svg.png",
    xrefRows: [
      { reportTitle: "Informe de Qualificació MSCI ESG 2024", date: "2024-07-01",
        criterionCa: "Gestió de riscos de governança corporativa",
        criterionEs: "Gestión de riesgos de gobernanza corporativa",
        impact: "high" as "high" | "med" },
      { reportTitle: "Anàlisi de Cartera d\'Inversió", date: "2024-04-20",
        criterionCa: "Exposició a riscos climàtics (carboni intensiu)",
        criterionEs: "Exposición a riesgos climáticos (carbono intensivo)",
        impact: "high" as "high" | "med" },
      { reportTitle: "Presentació a Inversors", date: "2024-09-15",
        criterionCa: "Puntuació en pràctiques laborals i cadena de subministrament",
        criterionEs: "Puntuación en prácticas laborales y cadena de suministro",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Entendre la metodologia de qualificació de MSCI ESG i els factors clau per a la seva indústria.",
        textEs: "Entender la metodología de calificación de MSCI ESG y los factores clave para su industria.",
        sourceCa: "Metodologia MSCI ESG Ratings", sourceEs: "Metodología MSCI ESG Ratings" },
      { num: "2", textCa: "Millorar la gestió dels riscos ESG identificats com a materials per MSCI.",
        textEs: "Mejorar la gestión de los riesgos ESG identificados como materiales por MSCI.",
        sourceCa: "Informe de Qualificació MSCI ESG", sourceEs: "Informe de Calificación MSCI ESG" },
      { num: "3", textCa: "Comunicar de manera transparent la informació ESG rellevant per influir en la qualificació.",
        textEs: "Comunicar de manera transparente la información ESG relevante para influir en la calificación.",
        sourceCa: "Guia de comunicació amb MSCI", sourceEs: "Guía de comunicación con MSCI" },
    ],
  },
  "cdp": {
    slug: "cdp",
    name: "cdp",
    type: "cert" as StandarType,
    issuerCa: "CDP",
    issuerEs: "CDP",
    descCa: "CDP (anteriorment Carbon Disclosure Project) gestiona el sistema de divulgació ambiental global per a empreses, ciutats, estats i regions. Treballa amb inversors i compradors per motivar les empreses a divulgar els seus impactes ambientals i prendre mesures per reduir-los. Les empreses responen a qüestionaris anuals sobre canvi climàtic, seguretat hídrica i boscos, i reben una puntuació (de A a D-). Aquesta informació és crucial per a inversors, compradors i responsables polítics que busquen avaluar i gestionar els riscos i oportunitats ambientals.",
    descEs: "CDP (anteriormente Carbon Disclosure Project) gestiona el sistema de divulgación ambiental global para empresas, ciudades, estados y regiones. Trabaja con inversores y compradores para motivar a las empresas a divulgar sus impactos ambientales y tomar medidas para reducirlos. Las empresas responden a cuestionarios anuales sobre cambio climático, seguridad hídrica y bosques, y reciben una puntuación (de A a D-). Esta información es crucial para inversores, compradores y responsables políticos que buscan evaluar y gestionar los riesgos y oportunidades ambientales.",
    icon: "💧",
    logoUrl: "https://cdp.net/themes/custom/cdp/images/cdp-logo.svg",
    xrefRows: [
      { reportTitle: "Resposta al Qüestionari CDP Canvi Climàtic 2023", date: "2024-01-15",
        criterionCa: "Divulgació d\'emissions de GEH i objectius de reducció",
        criterionEs: "Divulgación de emisiones de GEI y objetivos de reducción",
        impact: "high" as "high" | "med" },
      { reportTitle: "Informe de Gestió de l\'Aigua", date: "2024-06-01",
        criterionCa: "Avaluació de riscos de seguretat hídrica",
        criterionEs: "Evaluación de riesgos de seguridad hídrica",
        impact: "high" as "high" | "med" },
      { reportTitle: "Política de Compres de Fusta Sostenible", date: "2023-11-01",
        criterionCa: "Impacte en la desforestació de la cadena de subministrament",
        criterionEs: "Impacto en la deforestación de la cadena de suministro",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Respondre anualment als qüestionaris de CDP sobre canvi climàtic, aigua i/o boscos.",
        textEs: "Responder anualmente a los cuestionarios de CDP sobre cambio climático, agua y/o bosques.",
        sourceCa: "Plataforma de divulgació CDP", sourceEs: "Plataforma de divulgación CDP" },
      { num: "2", textCa: "Establir objectius ambiciosos de reducció d\'emissions i gestió de recursos naturals.",
        textEs: "Establecer objetivos ambiciosos de reducción de emisiones y gestión de recursos naturales.",
        sourceCa: "Guia de puntuació CDP", sourceEs: "Guía de puntuación CDP" },
      { num: "3", textCa: "Implementar estratègies per mitigar els riscos ambientals i aprofitar les oportunitats.",
        textEs: "Implementar estrategias para mitigar los riesgos ambientales y aprovechar las oportunidades.",
        sourceCa: "CDP Technical Guidance", sourceEs: "CDP Technical Guidance" },
    ],
  },
  "sge-21": {
    slug: "sge-21",
    name: "sge-21",
    type: "cert" as StandarType,
    issuerCa: "Foretica",
    issuerEs: "Foretica",
    descCa: "SGE 21 és la primera norma espanyola certificable de gestió ètica i socialment responsable, desenvolupada per Foretica. Aquesta norma permet a les organitzacions integrar la gestió dels seus impactes ètics, socials i ambientals en la seva estratègia i operacions. Cobreix deu àrees de gestió: Alta Direcció, Clients, Empleats, Proveïdors, Entorn Social, Entorn Ambiental, Inversors, Competència, Administracions Públiques i Mitjans de Comunicació. La certificació SGE 21 demostra el compromís d\'una empresa amb la responsabilitat social i la millora contínua en aquests àmbits.",
    descEs: "SGE 21 es la primera norma española certificable de gestión ética y socialmente responsable, desarrollada por Foretica. Esta norma permite a las organizaciones integrar la gestión de sus impactos éticos, sociales y ambientales en su estrategia y operaciones. Cubre diez áreas de gestión: Alta Dirección, Clientes, Empleados, Proveedores, Entorno Social, Entorno Ambiental, Inversores, Competencia, Administraciones Públicas y Medios de Comunicación. La certificación SGE 21 demuestra el compromiso de una empresa con la responsabilidad social y la mejora continua en estos ámbitos.",
    icon: "🇪🇸",
    logoUrl: "https://www.foretica.org/wp-content/themes/foretica/img/logo-foretica.svg",
    xrefRows: [
      { reportTitle: "Informe de Certificació SGE 21", date: "2024-08-01",
        criterionCa: "Compliment dels requisits de l\'àrea d\'Empleats",
        criterionEs: "Cumplimiento de los requisitos del área de Empleados",
        impact: "high" as "high" | "med" },
      { reportTitle: "Auditoria Interna de Sostenibilitat", date: "2024-03-25",
        criterionCa: "Gestió de l\'entorn ambiental i reducció d\'impactes",
        criterionEs: "Gestión del entorno ambiental y reducción de impactos",
        impact: "med" as "high" | "med" },
      { reportTitle: "Codi Ètic i de Conducta", date: "2023-12-10",
        criterionCa: "Principis de l\'àrea d\'Alta Direcció i Ètica",
        criterionEs: "Principios del área de Alta Dirección y Ética",
        impact: "high" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Implementar un sistema de gestió ètica i socialment responsable segons la norma SGE 21.",
        textEs: "Implementar un sistema de gestión ética y socialmente responsable según la norma SGE 21.",
        sourceCa: "Norma SGE 21 (Foretica)", sourceEs: "Norma SGE 21 (Foretica)" },
      { num: "2", textCa: "Realitzar auditories internes i externes per verificar el compliment dels requisits.",
        textEs: "Realizar auditorías internas y externas para verificar el cumplimiento de los requisitos.",
        sourceCa: "Guia d\'Auditoria SGE 21", sourceEs: "Guía de Auditoría SGE 21" },
      { num: "3", textCa: "Obtenir la certificació SGE 21 per demostrar el compromís i la millora contínua.",
        textEs: "Obtener la certificación SGE 21 para demostrar el compromiso y la mejora continua.",
        sourceCa: "Foretica - Certificació SGE 21", sourceEs: "Foretica - Certificación SGE 21" },
    ],
  },
  "sustainalytics": {
    slug: "sustainalytics",
    name: "sustainalytics",
    type: "cert" as StandarType,
    issuerCa: "Morningstar",
    issuerEs: "Morningstar",
    descCa: "Sustainalytics, una empresa de Morningstar, és un proveïdor líder de recerca i qualificacions ESG per a inversors. Avalua milers d\'empreses sobre la seva exposició a riscos ESG materials específics de la indústria i la seva capacitat per gestionar aquests riscos. Les seves qualificacions de risc ESG (ESG Risk Ratings) proporcionen una mesura quantificable del risc ESG no gestionat d\'una empresa, ajudant els inversors a identificar i entendre els riscos i oportunitats de sostenibilitat que podrien afectar el valor a llarg termini. S\'utilitza àmpliament per a la integració ESG en carteres d\'inversió.",
    descEs: "Sustainalytics, una empresa de Morningstar, es un proveedor líder de investigación y calificaciones ESG para inversores. Evalúa miles de empresas sobre su exposición a riesgos ESG materiales específicos de la industria y su capacidad para gestionar dichos riesgos. Sus calificaciones de riesgo ESG (ESG Risk Ratings) proporcionan una medida cuantificable del riesgo ESG no gestionado de una empresa, ayudando a los inversores a identificar y comprender los riesgos y oportunidades de sostenibilidad que podrían afectar el valor a largo plazo. Se utiliza ampliamente para la integración ESG en carteras de inversión.",
    icon: "🌟",
    logoUrl: "https://www.sustainalytics.com/sites/g/files/pkgnbr2416/themes/site/files/sustainalytics-logo.svg",
    xrefRows: [
      { reportTitle: "Informe de Risc ESG Sustainalytics 2024", date: "2024-05-10",
        criterionCa: "Exposició i gestió de riscos de governança corporativa",
        criterionEs: "Exposición y gestión de riesgos de gobernanza corporativa",
        impact: "high" as "high" | "med" },
      { reportTitle: "Anàlisi de Cartera de Fons", date: "2024-03-01",
        criterionCa: "Risc ESG no gestionat en la indústria de serveis públics",
        criterionEs: "Riesgo ESG no gestionado en la industria de servicios públicos",
        impact: "high" as "high" | "med" },
      { reportTitle: "Presentació a Inversors Responsables", date: "2024-08-20",
        criterionCa: "Gestió de riscos de capital humà i pràctiques laborals",
        criterionEs: "Gestión de riesgos de capital humano y prácticas laborales",
        impact: "med" as "high" | "med" },
    ],
    actions: [
      { num: "1", textCa: "Monitoritzar la qualificació de risc ESG de Sustainalytics i entendre els factors que la impulsen.",
        textEs: "Monitorear la calificación de riesgo ESG de Sustainalytics y entender los factores que la impulsan.",
        sourceCa: "Metodologia Sustainalytics ESG Risk Ratings", sourceEs: "Metodología Sustainalytics ESG Risk Ratings" },
      { num: "2", textCa: "Implementar millores en la gestió dels riscos ESG materials identificats.",
        textEs: "Implementar mejoras en la gestión de los riesgos ESG materiales identificados.",
        sourceCa: "Informe de Risc ESG personalitzat", sourceEs: "Informe de Riesgo ESG personalizado" },
      { num: "3", textCa: "Comunicar de manera transparent les polítiques i el rendiment ESG per influir en l\'avaluació.",
        textEs: "Comunicar de manera transparente las políticas y el rendimiento ESG para influir en la evaluación.",
        sourceCa: "Morningstar Sustainalytics Insights", sourceEs: "Morningstar Sustainalytics Insights" },
    ],
  },
};

export default function EstandarDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : Array.isArray(params?.slug) ? params.slug[0] ?? "" : "";
  const { lang } = useLanguage();
  const { user, plan } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  const detail = STANDARDS_DETAIL[slug];

  // Per a estàndards sense detall encara, usar B Corp com a demo
  const effectiveDetail = detail || STANDARDS_DETAIL["b-corp"];
  const isDemo = !detail;

  const isPremium = user && plan === "premium";
  const isPremiumContent = effectiveDetail?.type === "cert";

  // Ordenar files
  const sortedRows = useMemo(() => {
    if (!effectiveDetail) return [];
    const rows = [...effectiveDetail.xrefRows];
    if (!sortBy) return rows;
    rows.sort((a, b) => {
      let aVal = "", bVal = "";
      if (sortBy === "report") { aVal = a.reportTitle; bVal = b.reportTitle; }
      else if (sortBy === "date") { aVal = a.date; bVal = b.date; }
      else if (sortBy === "criterion") { aVal = tr(a.criterionCa, a.criterionEs); bVal = tr(b.criterionCa, b.criterionEs); }
      else if (sortBy === "impact") { aVal = a.impact; bVal = b.impact; }
      if (sortDir === "asc") return aVal.localeCompare(bVal);
      return bVal.localeCompare(aVal);
    });
    return rows;
  }, [effectiveDetail, sortBy, sortDir, lang]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  if (!effectiveDetail) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={() => setAuthOpen(true)} />
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <p className="eyebrow mb-3">404 — ESTÀNDARD NO TROBAT</p>
            <h1 className="mb-4 font-serif text-3xl font-semibold text-primary">
              {tr("Aquest estàndard no existeix.", "Este estándar no existe.")}
            </h1>
            <Button asChild>
              <a href="/estandares-esg">{tr("Tornar als estàndards", "Volver a los estándares")}</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cfg = TYPE_CONFIG[effectiveDetail.type];
  const showLocked = isPremiumContent && !isPremium;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={() => setAuthOpen(true)} />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <a href="/estandares-esg" className="text-accent-deep hover:underline">{tr("Estàndards ESG", "Estándares ESG")}</a> &gt; {effectiveDetail.name}
            </p>
            <div className="flex items-start gap-5">
              <div
                className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl overflow-hidden"
                style={{ background: effectiveDetail.logoUrl ? "white" : cfg.bg, border: `1px solid ${cfg.borderColor}` }}
              >
                {effectiveDetail.logoUrl ? (
                  <img src={effectiveDetail.logoUrl} alt={effectiveDetail.name} className="h-10 w-10 object-contain" />
                ) : (
                  effectiveDetail.icon
                )}
              </div>
              <div>
                <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
                  {effectiveDetail.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="inline-block rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider" style={{ background: cfg.bg, color: cfg.color }}>
                    {tr(cfg.labelCa, cfg.labelEs)}
                  </span>
                  {"  "}{tr(effectiveDetail.issuerCa, effectiveDetail.issuerEs)}
                </p>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/80">
                  {tr(effectiveDetail.descCa, effectiveDetail.descEs)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-reference table */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Filtres */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep font-semibold">
                {tr("Filtrar:", "Filtrar:")}
              </span>
              <select className="rounded-md border border-rule bg-card px-3.5 py-2 text-sm text-foreground cursor-pointer">
                <option>{tr("Tots els mesos", "Todos los meses")}</option>
                <option>Gener 2026</option>
                <option>Febrer 2026</option>
                <option>Març 2026</option>
                <option>Abril 2026</option>
                <option>Maig 2026</option>
              </select>
              <select className="rounded-md border border-rule bg-card px-3.5 py-2 text-sm text-foreground cursor-pointer">
                <option>{tr("Tots els impactes", "Todos los impactos")}</option>
                <option>{tr("Alt", "Alto")}</option>
                <option>{tr("Mitjà", "Medio")}</option>
                <option>{tr("Baix", "Bajo")}</option>
              </select>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                {effectiveDetail.xrefRows.length} {tr("informes amb cross-reference a", "informes con cross-reference a")} {effectiveDetail.name}
              </span>
            </div>

            {/* Taula */}
            <div className="overflow-hidden rounded-lg border border-rule bg-card shadow-sm">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {[
                      { key: "report", label: tr("Informe", "Informe"), width: "28%" },
                      { key: "date", label: tr("Data", "Fecha"), width: "10%" },
                      { key: "criterion", label: tr(`Criteri afectat (${effectiveDetail.name})`, `Criterio afectado (${effectiveDetail.name})`), width: "47%" },
                      { key: "impact", label: tr("Impacte", "Impacto"), width: "15%" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="cursor-pointer select-none border-b border-rule bg-secondary/30 px-4 py-3.5 text-left font-mono text-[9px] uppercase tracking-widest text-accent-deep transition-colors hover:bg-secondary/50"
                        style={{ width: col.width, position: "relative", paddingRight: "28px" }}
                      >
                        {col.label}
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-40">
                          {sortBy === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row, i) => {
                    const isLocked = showLocked && i >= 3;
                    return (
                      <tr key={i} className={`border-b border-rule/40 transition-colors hover:bg-secondary/20 ${isLocked ? "relative" : ""}`}>
                        <td className="px-4 py-3.5 align-top">
                          <span className="font-serif text-sm font-semibold text-primary">{row.reportTitle}</span>
                        </td>
                        <td className="px-4 py-3.5 align-top">
                          <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">{row.date}</span>
                        </td>
                        <td className="px-4 py-3.5 align-top text-xs leading-relaxed text-foreground/80">
                          {tr(row.criterionCa, row.criterionEs)}
                        </td>
                        <td className="px-4 py-3.5 align-top">
                          <span className={`inline-block rounded px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                            row.impact === "high" ? "bg-[#A0522D]/12 text-[#A0522D]" : "bg-[#C9A961]/15 text-[#8A6D2B]"
                          }`}>
                            {row.impact === "high" ? tr("Alt", "Alto") : tr("Mitjà", "Medio")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Lock overlay per no-Premium */}
            {showLocked && (
              <div className="mt-6 rounded-lg border border-accent bg-accent-soft/15 p-6 text-center">
                <Lock className="mx-auto mb-3 h-6 w-6 text-accent" />
                <p className="mb-2 font-serif text-lg font-semibold text-primary">
                  {tr("Contingut Premium", "Contenido Premium")}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  {tr(
                    `Estàs veient les 3 primeres files. Fes-te Premium per veure tots els ${effectiveDetail.xrefRows.length} informes amb cross-reference a ${effectiveDetail.name}.`,
                    `Estás viendo las 3 primeras filas. Hazte Premium para ver todos los ${effectiveDetail.xrefRows.length} informes con cross-reference a ${effectiveDetail.name}.`
                  )}
                </p>
                <Button onClick={() => setPreusOpen(true)}>
                  <Crown className="mr-2 h-4 w-4" />
                  {tr("Fes-te Premium", "Hazte Premium")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Accions recomanades */}
        <section className="border-t border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 font-serif text-2xl font-semibold text-primary">
              {tr(`Accions recomanades relacionades amb ${effectiveDetail.name}`, `Acciones recomendadas relacionadas con ${effectiveDetail.name}`)}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {effectiveDetail.actions.map((action) => (
                <div key={action.num} className="flex gap-3 rounded-md border border-rule bg-card p-4">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-bold text-accent-foreground">
                    {action.num}
                  </span>
                  <div>
                    <p className="text-sm leading-relaxed text-foreground">{tr(action.textCa, action.textEs)}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">{tr(action.sourceCa, action.sourceEs)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="register" />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => setAuthOpen(true)}
      />
    </div>
  );
}
