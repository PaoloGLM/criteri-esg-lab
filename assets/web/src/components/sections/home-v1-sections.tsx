"use client";

import { useLanguage } from "@/components/language-provider";
import { Reveal } from "./reveal";
import { XrefDiagram } from "./xref-diagram";
import { EditableItem, EditableText } from "@/components/cms/editable-texts";
import { useGroupOrder, sortItems } from "@/components/cms/text-order";

const BLOCS = [
  { num: "01", star: true },
  { num: "02" }, { num: "03" }, { num: "04" },
  { num: "05", star: true },
  { num: "06" }, { num: "07" },
  { num: "08", dark: true },
];

export default function HomePageV1Sections() {
  const { lang } = useLanguage();
  const ca = lang === "ca";
  const ordreBlocs = useGroupOrder("home.informe.blocs");

  return (
    <>
      {/* EL PROBLEMA */}
      <section id="problema" className="px-7 py-24">
        <div className="mx-auto grid max-w-[1160px] items-start gap-16 lg:grid-cols-[1fr_.92fr]">
          <Reveal>
            <EditableText id="problema.eyebrow" as="p" className="eyebrow">{ca ? "El problema" : "El problema"}</EditableText>
            <EditableText id="problema.title" as="h2" className="sec-title">
              {ca ? <>La normativa corre.<br />Ningú no et tradueix <span className="hl">què significa</span>.</>
                  : <>La normativa corre.<br />Nadie te traduce <span className="hl">qué significa</span>.</>}
            </EditableText>
            <EditableText id="problema.body" as="p" className="sec-body">
              {ca ? (
                <>Les sigles canvien d&apos;abast cada trimestre. Un informe del BCE sobre risc climàtic pot redefinir
                el que t&apos;exigirà el teu auditor; una revisió d&apos;<strong>Omnibus</strong>, decidir si el CSRD
                t&apos;aplica o deixes d&apos;aplicar-t&apos;hi. Seguir-ho és una feina a jornada completa{" "}
                <strong>que ningú t&apos;ha assignat</strong> — i que cap resum automàtic fa bé, perquè el problema
                no és llegir: és entendre què pesa.</>
              ) : (
                <>Las siglas cambian de alcance cada trimestre. Un informe del BCE sobre riesgo climático puede redefinir
                lo que te exigirá tu auditor; una revisión de <strong>Omnibus</strong>, decidir si la CSRD te aplica o dejas
                de aplicársete. Seguirlo es un trabajo a jornada completa <strong>que nadie te ha asignado</strong> — y que ningún
                resumen automático hace bien, porque el problema no es leer: es entender qué pesa.</>
              )}
            </EditableText>
            <div className="mt-[30px] flex flex-wrap gap-[9px]" aria-hidden="true">
              {["CSRD", "ESRS", "Omnibus I", "ISSB", "TNFD", "SFDR", "CSDDD", "GRI 101–103"].map((a) => (
                <span key={a} className="rounded-full border border-[rgba(74,95,83,.35)] bg-white px-3 py-1.5 font-mono text-[.72rem] font-medium tracking-[.05em] text-[var(--ink-soft)]">
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal className="border-l-2 border-[var(--accent)]">
            <EditableText id="problema.pub-title" as="p" className="pb-3.5 pl-5 font-mono text-[.68rem] font-semibold uppercase tracking-[.16em] text-[var(--accent)]">
              {ca ? "Publicat només aquest curs" : "Publicado solo este curso"}
            </EditableText>
            <ul className="list-none">
              {(ca
                ? [["BCE", "· Risc climàtic al sistema financer"], ["EBA", "· Avaluació de riscos, juny"], ["WEF", "· Global Risks Report"], ["Forética", "· Tendències ESG"], ["CNMV", "· Pla d'activitats i butlletí"], ["ONU", "· Finançament sostenible (FSDR)"]]
                : [["BCE", "· Riesgo climático en el sistema financiero"], ["EBA", "· Evaluación de riesgos, junio"], ["WEF", "· Global Risks Report"], ["Forética", "· Tendencias ESG"], ["CNMV", "· Plan de actividades y boletín"], ["ONU", "· Financiamiento sostenible (FSDR)"]]
              ).map(([who, what], i) => (
                <li key={who} className="flex items-baseline justify-between gap-4 border-t border-[rgba(38,49,43,.1)] px-5 py-3">
                  <div>
                    <EditableText id={`problema.pub.${i + 1}.who`} as="span" className="font-serif text-[1.02rem] font-medium text-[var(--ink)]">{who}</EditableText>{" "}
                    <EditableText id={`problema.pub.${i + 1}.what`} as="span" className="text-[.86rem] text-[var(--ink-soft)]">{what}</EditableText>
                  </div>
                  <span className="whitespace-nowrap font-mono text-[.68rem] text-[var(--ink-soft)]">2026</span>
                </li>
              ))}
            </ul>
            <EditableText id="problema.pub.note" as="p" className="pl-5 pt-3 font-mono text-[.66rem] tracking-[.04em] text-[var(--ink-soft)]">
              {ca ? "Mostra real del corpus que monitoritzem. No és tot — ni de lluny." : "Muestra real del corpus que monitorizamos. No es todo — ni de lejos."}
            </EditableText>
          </Reveal>
        </div>
      </section>

      {/* EL MÈTODE */}
      <section id="metode" style={{ background: "var(--ink-deep)", color: "var(--bg)" }} className="px-7 py-24">
        <div className="mx-auto max-w-[1160px]">
          <Reveal>
            <EditableText id="metode.eyebrow" as="p" className="eyebrow" style={{ color: "var(--verd-clar)" }}>{ca ? "El mètode" : "El método"}</EditableText>
            {/* Verd més claret per llegibilitat sobre fosc (#5) */}
            <EditableText id="metode.title" as="h2" className="sec-title" style={{ color: "#AAC9B6" }}>
              {ca ? "Un semàfor, no una opinió." : "Un semáforo, no una opinión."}
            </EditableText>
            <EditableText id="metode.body" as="p" className="sec-body" style={{ color: "rgba(242,245,241,.78)" }}>
              {ca ? (
                <>Cada informe institucional passa pel mateix criteri de sempre: què <strong style={{ color: "var(--bg)" }}>quantifica</strong>,
                què només <strong style={{ color: "var(--bg)" }}>esmenta</strong> i què <strong style={{ color: "var(--bg)" }}>ignora</strong>.
                Cinc indicadors, una nota A–D, i cap caixa grisa. El resultat es pot discutir — però es pot reproduir.</>
              ) : (
                <>Cada informe institucional pasa por el mismo criterio de siempre: qué <strong style={{ color: "var(--bg)" }}>cuantifica</strong>,
                qué solo <strong style={{ color: "var(--bg)" }}>menciona</strong> y qué <strong style={{ color: "var(--bg)" }}>ignora</strong>.
                Cinco indicadores, una nota A–D, y ninguna caja gris. El resultado se puede discutir — pero se puede reproducir.</>
              )}
            </EditableText>
          </Reveal>
          <div className="mt-[52px] grid items-center gap-[60px] lg:grid-cols-[.9fr_1.1fr]">
            <Reveal>
              <div className="semafor" role="img" aria-label={ca ? "Exemple de semàfor: nota C" : "Ejemplo de semáforo: nota C"}>
                <div className="grade-row">
                  <EditableText id="metode.semafor.grade" as="div" styleEl="h1" className="grade">C</EditableText>
                  <div className="grade-meta">
                    <div className="dots">
                      <span className="dot g" /><span className="dot g" /><span className="dot g" />
                      <span className="dot y on" /><span className="dot r on" />
                    </div>
                    <EditableText id="metode.semafor.grade.label" as="div" styleEl="eyebrow" className="grade-label">{ca ? "Nota de l'informe · exemple real" : "Nota del informe · ejemplo real"}</EditableText>
                  </div>
                </div>
                {(ca
                  ? [["Cobertura Scope 3", "Esmentat", "a"], ["Objectius quantificats", "Ignorat", "rv"], ["Traçabilitat de fonts", "Quantificat", "v"], ["Interoperabilitat estàndards", "Quantificat", "v"], ["Horitzó temporal", "Quantificat", "v"]]
                  : [["Cobertura Scope 3", "Mencionado", "a"], ["Objetivos cuantificados", "Ignorado", "rv"], ["Trazabilidad de fuentes", "Cuantificado", "v"], ["Interoperabilidad estándares", "Cuantificado", "v"], ["Horizonte temporal", "Cuantificado", "v"]]
                ).map(([name, val, cls], i) => (
                  <div key={name} className="ind">
                    <EditableText id={`metode.semafor.dim.${i + 1}.name`} as="span" className="name">{name}</EditableText>
                    <EditableText id={`metode.semafor.dim.${i + 1}.val`} as="span" className={`val val-${cls}`}>{val}</EditableText>
                  </div>
                ))}
                <EditableText id="metode.semafor.note" as="p" className="semafor-note">
                  {ca ? <>Regla pública: <em>A = 5 verds · B = 4 verds + 1 groc · C ≤ 1 vermell · D = 2+ vermells</em>. El mateix criteri per a tots els informes, publicat i auditable.</>
                      : <>Regla pública: <em>A = 5 verdes · B = 4 verdes + 1 amarillo · C ≤ 1 rojo · D = 2+ rojos</em>. El mismo criterio para todos los informes, publicado y auditable.</>}
                </EditableText>
              </div>
            </Reveal>
            <Reveal>
              <ul className="list-none">
                {(ca
                  ? [["Doble filtre, dos models", "Un model destil·la; un segon model independent fa d'advocat del diable i intenta desmuntar-lo abans que ho facis tu."],
                     ["Entorn tancat, zero invenció", "Cada afirmació prové exclusivament del document original. Si una dada no hi és, no surt. Si no té pàgina, no es publica."],
                     ["Inferència marcada", "Quan connectem punts entre documents, l'etiquetem com a interpretació nostra. El fet i l'anàlisi mai no es confonen."]]
                  : [["Doble filtro, dos modelos", "Un modelo destila; un segundo modelo independiente hace de abogado del diablo e intenta desmontarlo antes que lo hagas tú."],
                     ["Entorno cerrado, cero invención", "Cada afirmación proviene exclusivamente del documento original. Si un dato no está, no sale. Si no tiene página, no se publica."],
                     ["Inferencia marcada", "Cuando conectamos puntos entre documentos, la etiquetamos como interpretación nuestra. El hecho y el análisis nunca se confunden."]]
                ).map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[44px_1fr] items-start gap-4 border-t border-[rgba(242,245,241,.14)] py-[22px] first:border-t-0">
                    <EditableText id={`metode.item.${i + 1}.n`} as="span" styleEl="h2" className="font-serif text-[1.7rem] font-medium leading-[1.1] text-[var(--verd-clar)]">{i + 1}</EditableText>
                    {/* Verd més claret (#5) */}
                    <div>
                      <EditableText id={`metode.item.${i + 1}.t`} as="h3" styleEl="h2" className="mb-1.5 font-serif text-[1.12rem] font-semibold tracking-[.005em]" style={{ color: "#AAC9B6" }}>{t}</EditableText>
                      <EditableText id={`metode.item.${i + 1}.d`} as="p" styleEl="body" className="text-[.94rem] text-[rgba(242,245,241,.72)] [text-wrap:pretty]">{d}</EditableText>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ELS 8 BLOCS — redisseny: 01/05/08 destacats en verd fosc (#6) */}
      <section id="informe" className="px-7 py-24" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1160px]">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-[30px]">
            <div>
              <EditableText id="informe.eyebrow" as="p" className="eyebrow">{ca ? "L'informe" : "El informe"}</EditableText>
              <EditableText id="informe.title" as="h2" className="sec-title mb-3">{ca ? "Vuit blocs. Cap farciment." : "Ocho bloques. Sin relleno."}</EditableText>
              <EditableText id="informe.body" as="p" className="sec-body">{ca ? "Sempre els mateixos vuit, en el mateix ordre. Llegeixes un, ja saps llegir-los tots." : "Siempre los mismos ocho, en el mismo orden. Lees uno, ya sabes leerlos todos."}</EditableText>
            </div>
            <EditableText id="informe.limit" as="div" styleEl="eyebrow" className="whitespace-nowrap rounded-md border border-dashed border-[rgba(74,95,83,.4)] px-4 py-2.5 font-mono text-[.72rem] text-[var(--ink-soft)]">
              {ca ? <>LÍMIT EDITORIAL · <b className="font-semibold text-[var(--ink)]">MÀX. 1.100 PARAULES</b></> : <>LÍMITE EDITORIAL · <b className="font-semibold text-[var(--ink)]">MÁX. 1.100 PALABRAS</b></>}
            </EditableText>
          </Reveal>
          <Reveal className="blocgrid">
            <div data-corder="home.informe.blocs" style={{ display: "contents" }}>
            {sortItems((ca
              ? [["01", "Semàfor", "Nota A–D i els cinc indicadors que l'han feta."], ["02", "Dades clau", "Els números que importen, cadascun amb la seva pàgina."], ["03", "Resum executiu", "El que hauries de saber abans del cafè."], ["04", "Implicacions", "Per a empreses, reguladors i ciutadania."], ["05", "Més enllà del Checkbox", "El que l'informe no respon — dit sense eufemismes."], ["06", "Connexions", "Evolucions, complements i contradiccions amb informes anteriors."], ["07", "Accions", "Què fer-hi, ordenat per esforç i impacte."], ["08", "Cross-reference", "L'efecte de la notícia sobre 16 estàndards. Ningú més ho fa."]]
              : [["01", "Semáforo", "Nota A–D y los cinco indicadores que la han hecho."], ["02", "Datos clave", "Los números que importan, cada uno con su página."], ["03", "Resumen ejecutivo", "Lo que deberías saber antes del café."], ["04", "Implicaciones", "Para empresas, reguladores y ciudadanía."], ["05", "Más allá del Checkbox", "Lo que el informe no responde — dicho sin eufemismos."], ["06", "Conexiones", "Evoluciones, complementos y contradicciones con informes anteriores."], ["07", "Acciones", "Qué hacer con ello, ordenado por esfuerzo e impacto."], ["08", "Cross-reference", "El efecto de la noticia sobre 16 estándares. Nadie más lo hace."]]
            ), ordreBlocs, (x) => String(x[0])).map(([num, titol, desc, dark]) => {
              // #6: 01, 05 i 08 destacats en verd fosc; 02/03/04/06/07 requadre salvia (prova disseny 2026-09)
              const star = num === "01" || num === "05" || num === "08";
              const salvia = num === "02" || num === "03" || num === "04" || num === "06" || num === "07";
              return (
                <EditableItem
                  key={num as string}
                  as="article"
                  id={`home.informe.blocs.${num}`}
                  dataCitem={num as string}
                  className="bloc"
                  style={
                    star && !dark
                      ? { background: "var(--ink)", borderColor: "var(--ink)" }
                      : salvia
                        ? { background: "#AAC9B6", borderColor: "#26312B" }
                        : undefined
                  }
                >
                  <EditableText id={`informe.bloc.${num}.num`} as="div" className="num" style={star && !dark ? { color: "var(--highlight)" } : salvia ? { color: "#26312B" } : undefined}>{num}</EditableText>
                  <EditableText id={`informe.bloc.${num}.name`} as="h3" styleEl="h2" style={star && !dark ? { color: "var(--bg)" } : salvia ? { color: "#26312B" } : undefined}>{titol as string}</EditableText>
                  <EditableText id={`informe.bloc.${num}.desc`} as="p" styleEl="body" style={star && !dark ? { color: "rgba(242,245,241,.75)" } : salvia ? { color: "rgba(38,49,43,.82)" } : undefined}>{desc as string}</EditableText>
                </EditableItem>
              );
            })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CROSS-REFERENCE */}
      <section id="crossref" className="px-7 py-24">
        <div className="mx-auto grid max-w-[1160px] items-center gap-[60px] lg:grid-cols-[.95fr_1.05fr]">
          <Reveal>
            <EditableText id="crossref.eyebrow" as="p" className="eyebrow">Cross-reference</EditableText>
            <EditableText id="crossref.title" as="h2" className="sec-title">
              {ca ? <>Una dada nova,<br />llegida <span className="hl">setze</span> vegades.</>
                  : <>Un dato nuevo,<br />leído <span className="hl">dieciséis</span> veces.</>}
            </EditableText>
            <EditableText id="crossref.body" as="p" className="sec-body">
              {ca ? (
                <>Quan el BCE parla d&apos;emissions, nosaltres ja sabem què li demanarà el <strong>GRI 305-1</strong>,
                quina casella omple a <strong>EcoVadis</strong>, i on xoca amb la <strong>Taxonomia UE</strong>.
                Els estàndards no viuen sols: <strong>el valor és veure on s&apos;encreuen</strong>.</>
              ) : (
                <>Cuando el BCE habla de emisiones, nosotros ya sabemos qué le pedirá el <strong>GRI 305-1</strong>,
                qué casilla rellena en <strong>EcoVadis</strong>, y dónde choca con la <strong>Taxonomía UE</strong>.
                Los estándares no viven solos: <strong>el valor es ver dónde se cruzan</strong>.</>
              )}
            </EditableText>
            <EditableText id="crossref.body2" as="p" className="sec-body mt-4">
              {ca ? <>És l&apos;única part de l&apos;informe que no resumeix una publicació — <strong>la multiplica</strong>.</>
                  : <>Es la única parte del informe que no resumeve una publicación — <strong>la multiplica</strong>.</>}
            </EditableText>
          </Reveal>
          <Reveal>
            <XrefDiagram />
            <EditableText id="crossref.note" as="p" styleEl="eyebrow" className="mt-3.5 font-mono text-[.67rem] leading-[1.6] tracking-[.04em] text-[var(--ink-soft)]">
              {ca ? <>Exemple real de creuament: <b className="font-semibold text-[var(--accent)]">un informe sobre risc climàtic</b> projectat sobre sis dels 16 estàndards del catàleg. Colors = intensitat de l&apos;impacte.</>
                  : <>Ejemplo real de cruce: <b className="font-semibold text-[var(--accent)]">un informe sobre riesgo climático</b> proyectado sobre seis de los 16 estándares del catálogo. Colores = intensidad del impacto.</>}
            </EditableText>
          </Reveal>
        </div>
      </section>

      {/* PRINCIPI */}
      <section className="principle">
        <div className="mx-auto max-w-[1160px] px-7">
          <Reveal>
            <EditableText id="principi.quote" as="blockquote">&quot;{ca ? "Més enllà del checkbox." : "Más allá del checkbox."}&quot;</EditableText>
            <EditableText id="principi.body" as="p" className="after">
              {ca ? (
                <>Cinc criteris ètics —dignitat, justícia distributiva, sostenibilitat absoluta, co-decisió i arrelament—
                revisen cada informe abans de publicar-se.
                <strong> La tecnologia destil·la. El criteri decideix.</strong></>
              ) : (
                <>Cinco criterios éticos —dignidad, justicia distributiva, sostenibilidad absoluta, co-decisión y arraigo—
                revisan cada informe antes de publicarse.
                <strong> La tecnología destila. El criterio decide.</strong></>
              )}
            </EditableText>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="acces" className="px-7 py-[120px] text-center" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1160px]">
          <Reveal>
            <EditableText
              id="acces.title"
              as="h2"
              className="font-serif font-medium leading-[1.12] tracking-[-.01em] text-[var(--ink-deep)] text-[clamp(2.1rem,4vw,3.2rem)] [text-wrap:balance]"
            >
              {/* #7: 'T'entenem.' en verd clar, sense subratllat la segona línia */}
              <span style={{ color: "var(--accent)" }}>{ca ? "T'entenem." : "Te entendemos."}</span>
              <br />
              {ca ? "Et retornem temps per pensar." : "Te devolvemos tiempo para pensar."}
            </EditableText>
            <EditableText id="acces.body" as="p" className="mx-auto mb-10 mt-[22px] max-w-[46ch] text-[var(--ink-soft)]">
              {ca ? "Subscriu-te i rebràs cada informe nou quan es publiqui. Sense soroll, sense newsletters diàries: la quinzena, puntualment."
                  : "Suscríbete y recibirás cada informe nuevo cuando se publique. Sin ruido, sin newsletters diarias: la quincena, puntualmente."}
            </EditableText>
            <div className="flex flex-wrap justify-center gap-3.5">
              <EditableText id="acces.cta.registro" as="a" href="/registro" styleEl="button" className="btn-v1 btn-v1-solid">{ca ? "Demana accés anticipat" : "Solicita acceso anticipado"}</EditableText>
              <EditableText id="acces.cta.informes" as="a" href="/informes" styleEl="button" className="btn-v1 btn-v1-ghost">{ca ? "Veure un informe d'exemple" : "Ver un informe de ejemplo"}</EditableText>
            </div>
            <EditableText id="acces.note" as="p" styleEl="eyebrow" className="mt-[26px] font-mono text-[.68rem] tracking-[.08em] text-[var(--ink-soft)]">
              <b className="font-semibold text-[var(--accent)]">{ca ? "PILOT OBERT" : "PILOTO ABIERTO"}</b> ·{" "}
              {ca ? "GRATUÏT DURANT LA FASE DE PROVA · SENSE TARGETA" : "GRATUITO DURANTE LA FASE DE PRUEBA · SIN TARJETA"}
            </EditableText>
          </Reveal>
        </div>
      </section>
    </>
  );
}
