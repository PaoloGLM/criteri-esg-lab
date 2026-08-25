import { Reveal } from "./reveal";
import { XrefDiagram } from "./xref-diagram";

const BLOCS = [
  { num: "01", t: "Semàfor", d: "Nota A–D i els cinc indicadors que l'han feta." },
  { num: "02", t: "Dades clau", d: "Els números que importen, cadascun amb la seva pàgina." },
  { num: "03", t: "Resum executiu", d: "El que hauries de saber abans del cafè." },
  { num: "04", t: "Implicacions", d: "Per a empreses, reguladors i ciutadania." },
  { num: "05", t: "Més enllà del Checkbox", d: "El que l'informe no respon — dit sense eufemismes." },
  { num: "06", t: "Connexions", d: "Evolucions, complements i contradiccions amb informes anteriors." },
  { num: "07", t: "Accions", d: "Què fer-hi, ordenat per esforç i impacte." },
  { num: "08", t: "Cross-reference", d: "L'efecte de la notícia sobre 16 estàndards. Ningú més ho fa.", dark: true },
];

const DOCFEED = [
  { who: "BCE", what: "· Risc climàtic al sistema financer" },
  { who: "EBA", what: "· Avaluació de riscos, juny" },
  { who: "WEF", what: "· Global Risks Report" },
  { who: "Forética", what: "· Tendències ESG" },
  { who: "CNMV", what: "· Pla d'activitats i butlletí" },
  { who: "ONU", what: "· Finançament sostenible (FSDR)" },
];

export default function HomePageV1Sections() {
  return (
    <>
      {/* EL PROBLEMA */}
      <section id="problema" className="px-7 py-24">
        <div className="mx-auto grid max-w-[1160px] items-start gap-16 lg:grid-cols-[1fr_.92fr]">
          <Reveal>
            <p className="eyebrow">El problema</p>
            <h2 className="sec-title">
              La normativa corre.
              <br />
              Ningú no et tradueix <span className="hl">què significa</span>.
            </h2>
            <p className="sec-body">
              Les sigles canvien d&apos;abast cada trimestre. Un informe del BCE sobre risc climàtic pot redefinir
              el que t&apos;exigirà el teu auditor; una revisió d&apos;<strong>Omnibus</strong>, decidir si el CSRD
              t&apos;aplica o deixes d&apos;aplicar-t&apos;hi. Seguir-ho és una feina a jornada completa{" "}
              <strong>que ningú t&apos;ha assignat</strong> — i que cap resum automàtic fa bé, perquè el problema
              no és llegir: és entendre què pesa.
            </p>
            <div className="mt-[30px] flex flex-wrap gap-[9px]" aria-hidden="true">
              {["CSRD", "ESRS", "Omnibus I", "ISSB", "TNFD", "SFDR", "CSDDD", "GRI 101–103"].map((a) => (
                <span key={a} className="rounded-full border border-[rgba(74,95,83,.35)] bg-white px-3 py-1.5 font-mono text-[.72rem] font-medium tracking-[.05em] text-[var(--ink-soft)]">
                  {a}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal className="border-l-2 border-[var(--accent)]">
            <p className="pb-3.5 pl-5 font-mono text-[.68rem] font-semibold uppercase tracking-[.16em] text-[var(--accent)]">
              Publicat només aquest curs
            </p>
            <ul className="list-none">
              {DOCFEED.map((d) => (
                <li key={d.who} className="flex items-baseline justify-between gap-4 border-t border-[rgba(38,49,43,.1)] px-5 py-3">
                  <div>
                    <span className="font-serif text-[1.02rem] font-medium text-[var(--ink)]">{d.who}</span>{" "}
                    <span className="text-[.86rem] text-[var(--ink-soft)]">{d.what}</span>
                  </div>
                  <span className="whitespace-nowrap font-mono text-[.68rem] text-[var(--ink-soft)]">2026</span>
                </li>
              ))}
            </ul>
            <p className="pl-5 pt-3 font-mono text-[.66rem] tracking-[.04em] text-[var(--ink-soft)]">
              Mostra real del corpus que monitoritzem. No és tot — ni de lluny.
            </p>
          </Reveal>
        </div>
      </section>

      {/* EL MÈTODE */}
      <section id="metode" style={{ background: "var(--ink-deep)" }} className="px-7 py-24 text-[var(--bg)]">
        <div className="mx-auto max-w-[1160px]">
          <Reveal>
            <p className="eyebrow" style={{ color: "var(--verd-clar)" }}>El mètode</p>
            <h2 className="sec-title" style={{ color: "var(--bg)" }}>Un semàfor, no una opinió.</h2>
            <p className="sec-body" style={{ color: "rgba(242,245,241,.78)" }}>
              Cada informe institucional passa pel mateix criteri de sempre: què <strong style={{ color: "var(--bg)" }}>quantifica</strong>,
              què només <strong style={{ color: "var(--bg)" }}>esmenta</strong> i què <strong style={{ color: "var(--bg)" }}>ignora</strong>.
              Cinc indicadors, una nota A–D, i cap caixa grisa. El resultat es pot discutir — però es pot reproduir.
            </p>
          </Reveal>
          <div className="mt-[52px] grid items-center gap-[60px] lg:grid-cols-[.9fr_1.1fr]">
            <Reveal>
              <div className="semafor" role="img" aria-label="Exemple de semàfor: nota C amb tres indicadors verds, un groc i un vermell">
                <div className="grade-row">
                  <div className="grade">C</div>
                  <div className="grade-meta">
                    <div className="dots">
                      <span className="dot g" /><span className="dot g" /><span className="dot g" />
                      <span className="dot y on" /><span className="dot r on" />
                    </div>
                    <div className="grade-label">Nota de l&apos;informe · exemple real</div>
                  </div>
                </div>
                <div className="ind"><span className="name">Cobertura Scope 3</span><span className="val val-a">Esmentat</span></div>
                <div className="ind"><span className="name">Objectius quantificats</span><span className="val val-rv">Ignorat</span></div>
                <div className="ind"><span className="name">Traçabilitat de fonts</span><span className="val val-v">Quantificat</span></div>
                <div className="ind"><span className="name">Interoperabilitat estàndards</span><span className="val val-v">Quantificat</span></div>
                <div className="ind"><span className="name">Horitzó temporal</span><span className="val val-v">Quantificat</span></div>
                <p className="semafor-note">
                  Regla pública: <em>A = 5 verds · B = 4 verds + 1 groc · C ≤ 1 vermell · D = 2+ vermells</em>.
                  El mateix criteri per a tots els informes, publicat i auditable.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <ul className="list-none">
                {[
                  ["Doble filtre, dos models", "Un model destil·la; un segon model independent fa d'advocat del diable i intenta desmuntar-lo abans que ho facis tu."],
                  ["Entorn tancat, zero invenció", "Cada afirmació prové exclusivament del document original. Si una dada no hi és, no surt. Si no té pàgina, no es publica."],
                  ["Inferència marcada", "Quan connectem punts entre documents, l'etiquetem com a interpretació nostra. El fet i l'anàlisi mai no es confonen."],
                ].map(([t, d], i) => (
                  <li key={t} className="grid grid-cols-[44px_1fr] items-start gap-4 border-t border-[rgba(242,245,241,.14)] py-[22px] first:border-t-0">
                    <span className="font-serif text-[1.7rem] font-medium leading-[1.1] text-[var(--verd-clar)]">{i + 1}</span>
                    <div>
                      <h3 className="mb-1.5 font-serif text-[1.12rem] font-semibold tracking-[.005em] text-[var(--bg)]">{t}</h3>
                      <p className="text-[.94rem] text-[rgba(242,245,241,.72)] [text-wrap:pretty]">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ELS 8 BLOCS */}
      <section id="informe" className="px-7 py-24" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1160px]">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-[30px]">
            <div>
              <p className="eyebrow">L&apos;informe</p>
              <h2 className="sec-title mb-3">Vuit blocs. Cap farciment.</h2>
              <p className="sec-body">Sempre els mateixos vuit, en el mateix ordre. Llegeixes un, ja saps llegir-los tots.</p>
            </div>
            <div className="whitespace-nowrap rounded-md border border-dashed border-[rgba(74,95,83,.4)] px-4 py-2.5 font-mono text-[.72rem] text-[var(--ink-soft)]">
              LÍMIT EDITORIAL · <b className="font-semibold text-[var(--ink)]">MÀX. 1.100 PARAULES</b>
            </div>
          </Reveal>
          <Reveal className="blocgrid">
            {BLOCS.map((b) => (
              <article key={b.num} className={`bloc${b.dark ? " dark" : ""}`}>
                <div className="num">{b.num}</div>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CROSS-REFERENCE */}
      <section id="crossref" className="px-7 py-24">
        <div className="mx-auto grid max-w-[1160px] items-center gap-[60px] lg:grid-cols-[.95fr_1.05fr]">
          <Reveal>
            <p className="eyebrow">Cross-reference</p>
            <h2 className="sec-title">
              Una dada nova,
              <br />
              llegida <span className="hl">setze</span> vegades.
            </h2>
            <p className="sec-body">
              Quan el BCE parla d&apos;emissions, nosaltres ja sabem què li demanarà el <strong>GRI 305-1</strong>,
              quina casella omple a <strong>EcoVadis</strong>, i on xoca amb la <strong>Taxonomia UE</strong>.
              Els estàndards no viuen sols: <strong>el valor és veure on s&apos;encreuen</strong>.
            </p>
            <p className="sec-body mt-4">
              És l&apos;única part de l&apos;informe que no resumeix una publicació — <strong>la multiplica</strong>.
            </p>
          </Reveal>
          <Reveal>
            <XrefDiagram />
            <p className="mt-3.5 font-mono text-[.67rem] leading-[1.6] tracking-[.04em] text-[var(--ink-soft)]">
              Exemple real de creuament: <b className="font-semibold text-[var(--accent)]">un informe sobre risc climàtic</b>{" "}
              projectat sobre sis dels 16 estàndards del catàleg. Colors = intensitat de l&apos;impacte.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PRINCIPI */}
      <section className="principle">
        <div className="mx-auto max-w-[1160px] px-7">
          <Reveal>
            <blockquote>&quot;Més enllà del checkbox.&quot;</blockquote>
            <p className="after">
              Cinc criteris ètics —dignitat, justícia distributiva, sostenibilitat absoluta, co-decisió i arrelament—
              revisen cada informe abans de publicar-se.
              <strong> La tecnologia destil·la. El criteri decideix.</strong>
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="acces" className="px-7 py-[120px] text-center" style={{ background: "var(--bg)" }}>
        <div className="mx-auto max-w-[1160px]">
          <Reveal>
            <h2 className="font-serif font-medium leading-[1.12] tracking-[-.01em] text-[var(--ink-deep)] text-[clamp(2.1rem,4vw,3.2rem)] [text-wrap:balance]">
              T&apos;entenem.
              <br />
              <span className="hl">Et retornem temps per pensar.</span>
            </h2>
            <p className="mx-auto mb-10 mt-[22px] max-w-[46ch] text-[var(--ink-soft)]">
              Subscriu-te i rebràs cada informe nou quan es publiqui. Sense soroll, sense newsletters diàries:
              la quinzena, puntualment.
            </p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <a href="/registro" className="btn-v1 btn-v1-solid">Demana accés anticipat</a>
              <a href="/informes" className="btn-v1 btn-v1-ghost">Veure un informe d&apos;exemple</a>
            </div>
            <p className="mt-[26px] font-mono text-[.68rem] tracking-[.08em] text-[var(--ink-soft)]">
              <b className="font-semibold text-[var(--accent)]">PILOT OBERT</b> · GRATUÏT DURANT LA FASE DE PROVA · SENSE TARGETA
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
