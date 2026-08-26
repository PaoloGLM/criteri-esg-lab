"use client";

import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { useLanguage } from "@/components/language-provider";



/**
 * /faq — Preguntes freqüents (AEO).
 * Cada resposta és autònoma i citable pels motors de resposta.
 * Bilingüe ca/es via ternaris (coherent amb la resta de la web).
 */
const FAQS: { q: [string, string]; a: [string, string] }[] = [
  {
    q: ["Què és Criteri ESG?", "¿Qué es Criteri ESG?"],
    a: [
      "Criteri ESG és un servei que converteix informes institucionals ESG de 80+ pàgines en resums accionables de 5 minuts, amb verificació a pàgina exacta i creuament amb 16 estàndards de sostenibilitat. Cada informe segueix el mateix format de 8 blocs: Semàfor Metodològic, Fitxa tècnica, 5 dades clau, Resum executiu, Implicacions, Connexions, Accions recomanades i Cross-reference.",
      "Criteri ESG es un servicio que convierte informes institucionales ESG de 80+ páginas en resúmenes accionables de 5 minutos, con verificación a página exacta y cruce con 16 estándares de sostenibilidad. Cada informe sigue el mismo formato de 8 bloques: Semáforo Metodológico, Ficha técnica, 5 datos clave, Resumen ejecutivo, Implicaciones, Conexiones, Acciones recomendadas y Cross-reference.",
    ],
  },
  {
    q: ["Per a qui és Criteri ESG?", "¿Para quién es Criteri ESG?"],
    a: [
      "Per a directors de sostenibilitat, consultors ESG, compliance officers i equips que necessiten decidir cada setmana amb el context regulatori actualitzat. També per a ONG i sector públic que vulguin entendre cap on va la normativa sense llegir-se 84 pàgines.",
      "Para directores de sostenibilidad, consultores ESG, compliance officers y equipos que necesitan decidir cada semana con el contexto regulatorio actualizado. También para ONG y sector público que quieran entender hacia dónde va la normativa sin leerse 84 páginas.",
    ],
  },
  {
    q: ["Quant costa Criteri ESG?", "¿Cuánto cuesta Criteri ESG?"],
    a: [
      "Gratuït per a l'arxiu (informes de més de 6 mesos) i la newsletter bimensual. El pla Premium costa 440€/any (36,67€/mes, impostos inclosos), amb early bird de 290€/any de per vida per als primers 50 subscriptors (24,17€/mes, estalvi de 150€). El pla Ultra (podcast, PowerPoint, dossier mensual) arriba l'abril 2027.",
      "Gratis para el archivo (informes de más de 6 meses) y la newsletter quincenal. El plan Premium cuesta 440€/año (36,67€/mes, impuestos incluidos), con early bird de 290€/año de por vida para los primeros 50 suscriptores (24,17€/mes, ahorro de 150€). El plan Ultra (podcast, PowerPoint, dossier mensual) llega en abril 2027.",
    ],
  },
  {
    q: ["Quina metodologia fan servir?", "¿Qué metodología utilizan?"],
    a: [
      "Doble filtre amb dos models d'IA: un destil·la l'informe original; un segon model independent fa d'advocat del diable i intenta desmuntar el resultat. Entorn tancat sense invenció: cada afirmació prové exclusivament del document, amb la pàgina citada. La inferència entre documents es marca sempre com a tal. Validació humana obligatòria abans de publicar: la responsabilitat editorial és de l'equip, mai de la IA.",
      "Doble filtro con dos modelos de IA: uno destila el informe original; un segundo modelo independiente hace de abogado del diablo e intenta desmontar el resultado. Entorno cerrado sin invención: cada afirmación proviene exclusivamente del documento, con la página citada. La inferencia entre documentos se marca siempre como tal. Validación humana obligatoria antes de publicar: la responsabilidad editorial es del equipo, nunca de la IA.",
    ],
  },
  {
    q: ["Què és el semàfor metodològic?", "¿Qué es el semáforo metodológico?"],
    a: [
      "Una nota A-D que avalua la qualitat metodològica de l'informe original en 10 segons. Cinc indicadors públics: cobertura Scope 3, objectius quantificats, traçabilitat de fonts, interoperabilitat d'estàndards i horitzó temporal. La regla és pública i auditable: A = 5 verds · B = 4 verds + 1 groc · C ≤ 1 vermell · D = 2+ vermells. El mateix criteri per a tots els informes.",
      "Una nota A-D que evalúa la calidad metodológica del informe original en 10 segundos. Cinco indicadores públicos: cobertura Scope 3, objetivos cuantificados, trazabilidad de fuentes, interoperabilidad de estándares y horizonte temporal. La regla es pública y auditable: A = 5 verdes · B = 4 verdes + 1 amarillo · C ≤ 1 rojo · D = 2+ rojos. El mismo criterio para todos los informes.",
    ],
  },
  {
    q: ["Quins estàndards i frameworks cobreix?", "¿Qué estándares y frameworks cubre?"],
    a: [
      "Els 16 principals: regulació (CSRD/ESRS, CSDDD, SFDR, Taxonomia UE, EMAS), frameworks (GRI, SASB, TCFD, TNFD, ISO 26000) i certificacions/ratings (EcoVadis, B Corp, MSCI ESG, Sustainalytics, CDP, SGE 21). Cada informe es projecta sobre els 16: què implica per a qui té una certificació EcoVadis, reporta amb GRI o cau dins del perímetre CSRD.",
      "Los 16 principales: regulación (CSRD/ESRS, CSDDD, SFDR, Taxonomía UE, EMAS), frameworks (GRI, SASB, TCFD, TNFD, ISO 26000) y certificaciones/ratings (EcoVadis, B Corp, MSCI ESG, Sustainalytics, CDP, SGE 21). Cada informe se proyecta sobre los 16: qué implica para quien tiene una certificación EcoVadis, reporta con GRI o cae dentro del perímetro CSRD.",
    ],
  },
  {
    q: ["Quan es publica cada informe?", "¿Cuándo se publica cada informe?"],
    a: [
      "El mateix dia que es valida. L'agent detecta informes nous dilluns i dijous al matí des de més de 180 fonts institucionals (UE, OECD, BCE, EFRAG, EcoVadis, Banc d'Espanya, Forética). Després de curació humana, síntesi i validació editorial, es publica a la web immediatament. La newsletter quinzenal recull els 3-4 millors del període.",
      "El mismo día que se valida. El agente detecta informes nuevos los lunes y jueves por la mañana desde más de 180 fuentes institucionales (UE, OCDE, BCE, EFRAG, EcoVadis, Banco de España, Forética). Tras curación humana, síntesis y validación editorial, se publica en la web inmediatamente. La newsletter quincenal recoge los 3-4 mejores del período.",
    ],
  },
  {
    q: ["Com es paga i què passa amb els meus diners?", "¿Cómo se paga y qué pasa con mi dinero?"],
    a: [
      "Dues vies: targeta via Stripe (activació immediata) o transferència a Fiare Banca Ètica (només anual, amb comprovant). Si tries Fiare, el 100% dels diners dona suport a l'economia social i transformadora — cap corporació nord-americana es queda una comissió. Sense permanència: cancel·les quan vulguis.",
      "Dos vías: tarjeta vía Stripe (activación inmediata) o transferencia a Fiare Banca Ética (solo anual, con justificante). Si eliges Fiare, el 100% del dinero apoya la economía social y transformadora — ninguna corporación norteamericana se queda una comisión. Sin permanencia: cancelas cuando quieras.",
    ],
  },
  {
    q: ["Qui hi ha darrere de Criteri ESG?", "¿Quién hay detrás de Criteri ESG?"],
    a: [
      "Un equip petit: Paolo (CEO, formació en filosofia i gestió d'empreses, experiència en consultoria ESG), la Tech Lead (desenvolupament web, base de dades i integracions) i un agent d'IA supervisat que fa la feina pesada de recerca i síntesi. Criteris ètics explícits: dignitat al centre, ètica empresarial, economia social i arrelament territorial.",
      "Un equipo pequeño: Paolo (CEO, formación en filosofía y gestión de empresas, experiencia en consultoría ESG), la Tech Lead (desarrollo web, base de datos e integraciones) y un agente de IA supervisado que hace el trabajo pesado de investigación y síntesis. Criterios éticos explícitos: dignidad en el centro, ética empresarial, economía social y arraigo territorial.",
    ],
  },
  {
    q: ["És una eina de compliance o estratègica?", "¿Es una herramienta de compliance o estratégica?"],
    a: [
      "Tots dos. Cobreix el que és obligatori (CSRD, CSDDD, SFDR) i el que és estratègic (EcoVadis, B Corp, MSCI rating). L'usuari tria el seu enfocament: pot prioritzar compliment normatiu o millorar reputació.",
      "Ambos. Cubre lo que es obligatorio (CSRD, CSDDD, SFDR) y lo que es estratégico (EcoVadis, B Corp, MSCI rating). El usuario elige su enfoque: puede priorizar cumplimiento normativo o mejorar reputación.",
    ],
  },
];

export default function FaqPage() {
  const { lang } = useLanguage();
  const i = lang === "ca" ? 0 : 1;

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--paper)" }}>
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section style={{ background: "var(--bg)" }} className="border-b border-[rgba(38,49,43,.09)] py-[76px]">
          <div className="mx-auto max-w-[1160px] px-7">
            <p className="eyebrow">{lang === "ca" ? "Preguntes freqüents" : "Preguntas frecuentes"}</p>
            <h1 className="mb-[22px] font-serif font-medium leading-[1.08] tracking-[-.012em] text-[var(--ink-deep)] text-[clamp(2.3rem,4.2vw,3.5rem)] [text-wrap:balance]">
              {lang === "ca" ? (
                <>Respostes <span className="hl">directes</span>, sense lletra petita.</>
              ) : (
                <>Respuestas <span className="hl">directas</span>, sin letra pequeña.</>
              )}
            </h1>
            <p className="max-w-[54ch] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]">
              {lang === "ca"
                ? "Tot el que pregunten els directors de sostenibilitat sobre Criteri ESG — respost en una línia quan pot ser en una línia."
                : "Todo lo que preguntan los directores de sostenibilidad sobre Criteri ESG — respondido en una línea cuando puede ser en una línea."}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-7 py-20">
          <div className="mx-auto max-w-[1160px]">
            {FAQS.map((f, idx) => (
              <div
                key={f.q[0]}
                className={`py-9 ${idx === FAQS.length - 1 ? "border-b border-[rgba(38,49,43,.1)]" : "border-t border-[rgba(38,49,43,.1)]"}`}
              >
                <h2 className="mb-3.5 font-serif font-semibold text-[var(--ink-deep)] text-[clamp(1.3rem,2.2vw,1.7rem)] leading-[1.3] [text-wrap:balance]">
                  {f.q[i]}
                </h2>
                <p className="max-w-[68ch] text-[1rem] leading-[1.7] text-[var(--ink)]">
                  {f.a[i]}
                </p>
              </div>
            ))}

            <p className="mt-10 rounded-[9px] p-5 font-mono text-[.72rem] leading-[1.6] text-[var(--ink-soft)]" style={{ background: "var(--bg)" }}>
              {lang === "ca"
                ? "AQUESTA PÀGINA ESTÀ PENSADA PER SER CITADA: cada resposta és autònoma, amb les xifres exactes, i es pot copiar tal qual. Els motors de resposta (ChatGPT, Perplexity, Gemini) i els cercadors hi tenen accés lliure via robots.txt i llms.txt."
                : "ESTA PÁGINA ESTÁ PENSADA PARA SER CITADA: cada respuesta es autónoma, con las cifras exactas, y se puede copiar tal cual. Los motores de respuesta (ChatGPT, Perplexity, Gemini) y los buscadores tienen acceso libre vía robots.txt y llms.txt."}
            </p>
          </div>
        </section>
      </main>
      <FooterV1 />
    </div>
  );
}
