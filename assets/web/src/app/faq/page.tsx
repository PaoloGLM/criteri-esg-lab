"use client";

import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";

/**
 * /faq — Preguntes freqüents (AEO).
 * Cada resposta és autònoma i citable: pensada perquè els motors de resposta
 * (ChatGPT, Perplexity, Gemini) la copiïn tal qual. El JSON-LD FAQPage global
 * ja és al layout; aquesta pàgina és la cara visible.
 */
const FAQS = [
  {
    q: "Què és Criteri ESG?",
    a: (
      <>
        <strong>Criteri ESG és un servei que converteix informes institucionals ESG de 80+ pàgines
        en resums accionables de 5 minuts</strong>, amb verificació a pàgina exacta i creuament amb 16
        estàndards de sostenibilitat. Cada informe segueix el mateix format de 8 blocs: Semàfor
        Metodològic, Fitxa tècnica, 5 dades clau, Resum executiu, Implicacions, Connexions, Accions
        recomanades i Cross-reference.
      </>
    ),
  },
  {
    q: "Per a qui és Criteri ESG?",
    a: (
      <>
        Per a <strong>directors de sostenibilitat, consultors ESG, compliance officers i equips que
        necessiten decidir cada setmana</strong> amb el context regulatori actualitzat. També per a ONG
        i sector públic que vulguin entendre cap on va la normativa sense llegir-se 84 pàgines.
      </>
    ),
  },
  {
    q: "Quant costa Criteri ESG?",
    a: (
      <>
        <strong>Gratuït per a l&apos;arxiu</strong> (informes de més de 6 mesos) i la newsletter bimensual.
        El pla <strong>Premium costa 440€/any</strong> (36,67€/mes, impostos inclosos), amb
        <strong> early bird de 290€/any de per vida per als primers 50 subscriptors</strong> (24,17€/mes,
        estalvi de 150€). El pla Ultra (podcast, PowerPoint, dossier mensual) arriba l&apos;abril 2027.
      </>
    ),
  },
  {
    q: "Quina metodologia fan servir?",
    a: (
      <>
        <strong>Doble filtre amb dos models d&apos;IA</strong>: un destil·la l&apos;informe original; un segon
        model independent fa d&apos;advocat del diable i intenta desmuntar el resultat. Entorn tancat sense
        invenció: cada afirmació prové exclusivament del document, amb la pàgina citada. La inferència
        entre documents es marca sempre com a tal. <strong>Validació humana obligatòria</strong> abans de
        publicar: la responsabilitat editorial és de l&apos;equip, mai de la IA.
      </>
    ),
  },
  {
    q: "Què és el semàfor metodològic?",
    a: (
      <>
        Una <strong>nota A-D que avalua la qualitat metodològica de l&apos;informe original en 10 segons</strong>.
        Cinc indicadors públics: cobertura Scope 3, objectius quantificats, traçabilitat de fonts,
        interoperabilitat d&apos;estàndards i horitzó temporal. La regla és pública i auditable:{" "}
        <strong>A = 5 verds · B = 4 verds + 1 groc · C ≤ 1 vermell · D = 2+ vermells</strong>.
        El mateix criteri per a tots els informes.
      </>
    ),
  },
  {
    q: "Quins estàndards i frameworks cobreix?",
    a: (
      <>
        Els 16 principals: <strong>regulació</strong> (CSRD/ESRS, CSDDD, SFDR, Taxonomia UE, EMAS),{" "}
        <strong>frameworks</strong> (GRI, SASB, TCFD, TNFD, ISO 26000) i{" "}
        <strong>certificacions/ratings</strong> (EcoVadis, B Corp, MSCI ESG, Sustainalytics, CDP, SGE 21).
        Cada informe es projecta sobre els 16: què implica per a qui té una certificació EcoVadis,
        reporta amb GRI o cau dins del perímetre CSRD.
      </>
    ),
  },
  {
    q: "Quan es publica cada informe?",
    a: (
      <>
        El mateix dia que es valida. L&apos;agent detecta informes nous dilluns i dijous al matí des de
        <strong> més de 180 fonts institucionals</strong> (UE, OECD, BCE, EFRAG, EcoVadis, Banc
        d&apos;Espanya, Forética). Després de curació humana, síntesi i validació editorial, es publica a
        la web immediatament. La newsletter quinzenal recull els 3-4 millors del període.
      </>
    ),
  },
  {
    q: "Com es paga i què passa amb els meus diners?",
    a: (
      <>
        Dues vies: <strong>targeta via Stripe</strong> (activació immediata) o{" "}
        <strong>transferència a Fiare Banca Ètica</strong> (només anual, amb comprovant). Si tries Fiare,{" "}
        <strong>el 100% dels diners dona suport a l&apos;economia social i transformadora</strong> — cap
        corporació nord-americana es queda una comissió. Sense permanència: cancel·les quan vulguis.
      </>
    ),
  },
  {
    q: "Qui hi ha darrere de Criteri ESG?",
    a: (
      <>
        Un equip petit: <strong>Paolo</strong> (CEO, formació en filosofia i gestió d&apos;empreses,
        experiència en consultoria ESG), la <strong>Tech Lead</strong> (desenvolupament web, base de dades
        i integracions) i un <strong>agent d&apos;IA supervisat</strong> que fa la feina pesada de recerca i
        síntesi. Criteris ètics explícits: dignitat al centre, ètica empresarial, economia social i
        arrelament territorial.
      </>
    ),
  },
  {
    q: "És una eina de compliance o estratègica?",
    a: (
      <>
        <strong>Tots dos</strong>. Cobreix el que és obligatori (CSRD, CSDDD, SFDR) i el que és estratègic
        (EcoVadis, B Corp, MSCI rating). L&apos;usuari tria el seu enfocament: pot prioritzar compliment
        normatiu o millorar reputació.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--paper)" }}>
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section style={{ background: "var(--bg)" }} className="border-b border-[rgba(38,49,43,.09)] py-[76px]">
          <div className="mx-auto max-w-[1160px] px-7">
            <p className="eyebrow">Preguntes freqüents</p>
            <h1 className="mb-[22px] font-serif font-medium leading-[1.08] tracking-[-.012em] text-[var(--ink-deep)] text-[clamp(2.3rem,4.2vw,3.5rem)] [text-wrap:balance]">
              Respostes <span className="hl">directes</span>, sense lletra petita.
            </h1>
            <p className="max-w-[54ch] text-[1.06rem] leading-[1.6] text-[var(--ink-soft)]">
              Tot el que pregunten els directors de sostenibilitat sobre Criteri ESG —
              respost en una línia quan pot ser en una línia.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-7 py-20">
          <div className="mx-auto max-w-[1160px]">
            {FAQS.map((f, i) => (
              <div
                key={f.q}
                className={`py-9 ${i === FAQS.length - 1 ? "border-b border-[rgba(38,49,43,.1)]" : "border-t border-[rgba(38,49,43,.1)]"}`}
              >
                <h2 className="mb-3.5 font-serif font-semibold text-[var(--ink-deep)] text-[clamp(1.3rem,2.2vw,1.7rem)] leading-[1.3] [text-wrap:balance]">
                  {f.q}
                </h2>
                <p className="max-w-[68ch] text-[1rem] leading-[1.7] text-[var(--ink)] [&_strong]:font-medium [&_strong]:text-[var(--ink-deep)]">
                  {f.a}
                </p>
              </div>
            ))}

            <p className="mt-10 rounded-[9px] p-5 font-mono text-[.72rem] leading-[1.6] text-[var(--ink-soft)]" style={{ background: "var(--bg)" }}>
              AQUESTA PÀGINA ESTÀ PENSADA PER SER CITADA: cada resposta és autònoma, amb les xifres
              exactes, i es pot copiar tal qual. Els motors de resposta (ChatGPT, Perplexity, Gemini)
              i els cercadors hi tenen accés lliure via robots.txt i llms.txt.
            </p>
          </div>
        </section>
      </main>
      <FooterV1 />
    </div>
  );
}
