"use client";

import { useLanguage } from "@/components/language-provider";

interface ReportsPreviewProps {
  onOpenReport: (slug: string) => void;
}

/**
 * INFORME DESTACAT — Variant 2 (Manifest Editorial) · dark
 *
 * Mostra l'últim informe publicat amb els 8 BLOCS reals (no una mini-card):
 *  - Header (fitxa tècnica: tag, títol, meta)
 *  - Bloc 0: Semàfor (dark, nota C · Débil + 5 dimensions amb dots)
 *  - Body 2 columnes:
 *    * Esquerra: Bloc 2 (5 dades clau numerades) + Bloc 3 (resum executiu)
 *    * Dreta: Bloc 4 (implicacions amb subsecció "Més enllà del Checkbox" dark)
 *             + Bloc 5 (connexions)
 *             + Bloc 6 (accions recomanades amb cercles numerats coure, fons coure clar)
 *             + Bloc 7 (cross-reference: 8 xips amb certificacions + nivell d'impacte)
 *  - Footer (dark, amb CTA "Més detalls en l'informe complet →")
 *
 * El CTA del footer crida onOpenReport("revisio-esrs-maig-2026")
 */
export function ReportsPreview({ onOpenReport }: ReportsPreviewProps) {
  const { t } = useLanguage();

  // 5 dimensions del semàfor (label + color actiu)
  const dims: {
    labelKey:
      | "v2.bloc0.dim1"
      | "v2.bloc0.dim2"
      | "v2.bloc0.dim3"
      | "v2.bloc0.dim4"
      | "v2.bloc0.dim5";
    active: "g" | "y" | "r";
  }[] = [
    { labelKey: "v2.bloc0.dim1", active: "y" },
    { labelKey: "v2.bloc0.dim2", active: "g" },
    { labelKey: "v2.bloc0.dim3", active: "y" },
    { labelKey: "v2.bloc0.dim4", active: "r" },
    { labelKey: "v2.bloc0.dim5", active: "y" },
  ];

  // 5 dades clau del Bloc 2
  const dadesClau: {
    strongKey:
      | "v2.bloc2.d1.strong"
      | "v2.bloc2.d2.strong"
      | "v2.bloc2.d3.strong"
      | "v2.bloc2.d4.strong"
      | "v2.bloc2.d5.strong";
    textKey:
      | "v2.bloc2.d1.text"
      | "v2.bloc2.d2.text"
      | "v2.bloc2.d3.text"
      | "v2.bloc2.d4.text"
      | "v2.bloc2.d5.text";
  }[] = [
    { strongKey: "v2.bloc2.d1.strong", textKey: "v2.bloc2.d1.text" },
    { strongKey: "v2.bloc2.d2.strong", textKey: "v2.bloc2.d2.text" },
    { strongKey: "v2.bloc2.d3.strong", textKey: "v2.bloc2.d3.text" },
    { strongKey: "v2.bloc2.d4.strong", textKey: "v2.bloc2.d4.text" },
    { strongKey: "v2.bloc2.d5.strong", textKey: "v2.bloc2.d5.text" },
  ];

  // 3 accions recomanades del Bloc 6
  const accions: {
    num: string;
    textKey: "v2.bloc6.a1" | "v2.bloc6.a2" | "v2.bloc6.a3";
  }[] = [
    { num: "1", textKey: "v2.bloc6.a1" },
    { num: "2", textKey: "v2.bloc6.a2" },
    { num: "3", textKey: "v2.bloc6.a3" },
  ];

  // 8 xips de cross-reference (Bloc 7)
  const xrefChips: { cert: string; impact: "alto" | "medio" | "bajo" }[] = [
    { cert: "GRI", impact: "alto" },
    { cert: "EcoVadis", impact: "medio" },
    { cert: "MSCI", impact: "medio" },
    { cert: "B Corp", impact: "bajo" },
    { cert: "CDP", impact: "medio" },
    { cert: "SGE 21", impact: "bajo" },
    { cert: "Sustainalytics", impact: "bajo" },
    { cert: "TNFD", impact: "medio" },
  ];

  const impactKey = (impact: "alto" | "medio" | "bajo") => {
    if (impact === "alto") return t("v2.bloc7.impact.alto");
    if (impact === "medio") return t("v2.bloc7.impact.medio");
    return t("v2.bloc7.impact.bajo");
  };

  return (
    <section
      className="px-6 py-24 sm:px-8 sm:py-28 lg:py-32"
      style={{
        background: "#26312B",
        color: "#F2F5F1",
        borderTop: "3px solid #5E8772",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Eyebrow */}
        <div
          className="mb-4 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
          style={{ color: "#AAC9B6", letterSpacing: "0.22em" }}
        >
          <span style={{ width: "24px", height: "2px", background: "#5E8772" }} />
          {t("v2.ultim.eyebrow")}
        </div>

        {/* Title */}
        <h2
          className="mb-8 font-serif font-medium"
          style={{
            color: "#F2F5F1",
            letterSpacing: "-0.018em",
            fontSize: "clamp(2rem, 3.4vw, 2.75rem)",
            lineHeight: 1.1,
            maxWidth: "1000px",
          }}
        >
          {t("v2.ultim.title.pre")}
          <em className="italic font-normal" style={{ color: "#AAC9B6" }}>
            {t("v2.ultim.title.em")}
          </em>
          {t("v2.ultim.title.post")}
        </h2>

        {/* ===== INFORME PREVIEW ===== */}
        <div
          className="mt-8 overflow-hidden"
          style={{
            background: "#F2F5F1",
            color: "#26312B",
            border: "1px solid #D8E2DA",
          }}
        >
          {/* --- Header (fitxa tècnica) --- */}
          <div
            className="grid items-end gap-6 px-6 py-6 sm:px-8"
            style={{ borderBottom: "1px solid #26312B", gridTemplateColumns: "1fr auto" }}
          >
            <div className="flex flex-col gap-2">
              <span
                className="font-mono font-semibold uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: "#141B18",
                  background: "rgba(184, 115, 51, 0.12)",
                  padding: "4px 10px",
                  alignSelf: "flex-start",
                }}
              >
                {t("v2.informe.tag")}
              </span>
              <h3
                className="font-serif font-medium"
                style={{
                  fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
                  color: "#26312B",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                  maxWidth: "700px",
                }}
              >
                {t("v2.informe.title")}
              </h3>
            </div>
            <div
              className="hidden font-mono font-medium uppercase sm:block"
              style={{
                fontSize: "10px",
                letterSpacing: "0.14em",
                color: "#4A5F53",
                textAlign: "right",
                lineHeight: 1.7,
              }}
            >
              {t("v2.informe.meta.line1")}
              <br />
              {t("v2.informe.meta.line2")}
              <br />
              {t("v2.informe.meta.line3")}
            </div>
          </div>

          {/* --- Bloc 0: Semàfor (dark, destacat) --- */}
          <div
            className="grid gap-8 px-6 py-6 sm:px-8"
            style={{
              background: "#26312B",
              color: "#F2F5F1",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div className="flex flex-col gap-3">
              <div
                className="font-mono font-semibold uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.22em",
                  color: "#AAC9B6",
                }}
              >
                {t("v2.bloc0.label")}
              </div>
              <div className="flex items-baseline gap-4">
                <span
                  className="font-serif font-medium"
                  style={{
                    color: "#5E8772",
                    letterSpacing: "-0.04em",
                    fontSize: "clamp(4rem, 6vw, 5rem)",
                    lineHeight: 1,
                  }}
                >
                  {t("v2.bloc0.grade")}
                </span>
                <span
                  className="font-serif italic font-normal"
                  style={{ color: "#F2F5F1", fontSize: "1.375rem" }}
                >
                  {t("v2.bloc0.grade.label")}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {dims.map((dim) => (
                <div
                  key={dim.labelKey}
                  className="grid items-center gap-3 py-1"
                  style={{ gridTemplateColumns: "100px 1fr" }}
                >
                  <span
                    className="font-serif font-medium"
                    style={{
                      color: "#F2F5F1",
                      fontSize: "0.8125rem",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {t(dim.labelKey)}
                  </span>
                  <div className="flex gap-1.5">
                    {(["g", "y", "r"] as const).map((color) => {
                      const isActive = dim.active === color;
                      const bg =
                        color === "g" ? "#5C8A5C" : color === "y" ? "#C9A961" : "#A0522D";
                      return (
                        <div
                          key={color}
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: bg,
                            opacity: isActive ? 1 : 0.3,
                          }}
                          aria-hidden
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Body 2 columnes --- */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.5fr)",
            }}
          >
            {/* Columna esquerra */}
            <div
              className="flex flex-col"
              style={{ borderRight: "1px solid #D8E2DA" }}
            >
              {/* Bloc 2: 5 dades clau */}
              <Bloc>
                <BlocNum label={t("v2.bloc2.label")} />
                <BlocTitle>{t("v2.bloc2.title")}</BlocTitle>
                <div className="flex flex-col gap-2">
                  {dadesClau.map((dada, i) => (
                    <div
                      key={i}
                      className="grid items-baseline gap-2 py-1.5"
                      style={{
                        gridTemplateColumns: "24px 1fr",
                        borderBottom:
                          i < dadesClau.length - 1
                            ? "1px dotted rgba(139, 115, 85, 0.3)"
                            : "none",
                      }}
                    >
                      <span
                        className="font-mono font-semibold"
                        style={{ color: "#5E8772", fontSize: "9px" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="font-sans"
                        style={{ color: "#26312B", fontSize: "0.72rem", lineHeight: 1.4 }}
                      >
                        <strong style={{ color: "#141B18", fontWeight: 600 }}>
                          {t(dada.strongKey)}
                        </strong>
                        {t(dada.textKey)}
                      </span>
                    </div>
                  ))}
                </div>
              </Bloc>

              {/* Bloc 3: Resum executiu */}
              <Bloc>
                <BlocNum label={t("v2.bloc3.label")} />
                <BlocTitle>{t("v2.bloc3.title")}</BlocTitle>
                <div
                  className="font-sans"
                  style={{
                    color: "#141B18",
                    fontSize: "0.75rem",
                    lineHeight: 1.55,
                  }}
                >
                  <p>{t("v2.bloc3.body1")}</p>
                  <p className="mt-3">
                    {t("v2.bloc3.body2")}{" "}
                    <em
                      className="font-serif italic"
                      style={{ color: "#141B18" }}
                    >
                      {t("v2.bloc3.body3.em")}
                    </em>
                  </p>
                </div>
              </Bloc>
            </div>

            {/* Columna dreta */}
            <div style={{ background: "rgba(217, 165, 116, 0.04)" }}>
              {/* Bloc 4: Implicacions + Més enllà del Checkbox */}
              <Bloc>
                <BlocNum label={t("v2.bloc4.label")} />
                <BlocTitle>{t("v2.bloc4.title")}</BlocTitle>
                <div
                  className="font-sans"
                  style={{
                    color: "#141B18",
                    fontSize: "0.75rem",
                    lineHeight: 1.55,
                  }}
                >
                  <p>
                    <strong style={{ color: "#141B18", fontWeight: 600 }}>
                      {t("v2.bloc4.empresas.strong")}
                    </strong>
                    {t("v2.bloc4.empresas.text")}
                  </p>
                  <p className="mt-3">
                    <strong style={{ color: "#141B18", fontWeight: 600 }}>
                      {t("v2.bloc4.reguladores.strong")}
                    </strong>
                    {t("v2.bloc4.reguladores.text")}
                  </p>
                  <p className="mt-3">
                    <strong style={{ color: "#141B18", fontWeight: 600 }}>
                      {t("v2.bloc4.ciudadanos.strong")}
                    </strong>
                    {t("v2.bloc4.ciudadanos.text")}
                  </p>
                </div>

                {/* Subsecció "Més enllà del Checkbox" (dark) */}
                <div
                  className="mt-3 px-4 py-3"
                  style={{
                    background: "#26312B",
                    color: "#F2F5F1",
                    borderLeft: "3px solid #5E8772",
                  }}
                >
                  <div
                    className="mb-1.5 font-mono font-semibold uppercase"
                    style={{
                      fontSize: "8.5px",
                      letterSpacing: "0.2em",
                      color: "#AAC9B6",
                    }}
                  >
                    {t("v2.bloc4.mes.label")}
                  </div>
                  <p
                    className="font-serif italic"
                    style={{
                      color: "rgba(245, 239, 230, 0.85)",
                      fontSize: "0.75rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {t("v2.bloc4.mes.text")}
                  </p>
                </div>
              </Bloc>

              {/* Bloc 5: Connexions */}
              <Bloc>
                <BlocNum label={t("v2.bloc5.label")} />
                <BlocTitle>{t("v2.bloc5.title")}</BlocTitle>
                <div
                  className="font-sans"
                  style={{
                    color: "#141B18",
                    fontSize: "0.75rem",
                    lineHeight: 1.55,
                  }}
                >
                  {t("v2.bloc5.body.pre")}
                  <strong style={{ color: "#141B18", fontWeight: 600 }}>
                    {t("v2.bloc5.body.strong")}
                  </strong>
                  {t("v2.bloc5.body.post")}
                </div>
              </Bloc>

              {/* Bloc 6: Accions recomanades (fons coure clar) */}
              <div
                className="px-6 py-6 sm:px-8"
                style={{
                  borderBottom: "1px solid #D8E2DA",
                  background: "rgba(184, 115, 51, 0.06)",
                }}
              >
                <BlocNum label={t("v2.bloc6.label")} />
                <BlocTitle>{t("v2.bloc6.title")}</BlocTitle>
                <div className="flex flex-col gap-2.5">
                  {accions.map((accio) => (
                    <div
                      key={accio.num}
                      className="grid items-baseline gap-3"
                      style={{ gridTemplateColumns: "24px 1fr" }}
                    >
                      <span
                        className="flex items-center justify-center font-mono font-bold"
                        style={{
                          background: "#5E8772",
                          color: "#FFFFFF",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          fontSize: "9px",
                        }}
                      >
                        {accio.num}
                      </span>
                      <span
                        className="font-sans font-medium"
                        style={{
                          color: "#26312B",
                          fontSize: "0.75rem",
                          lineHeight: 1.45,
                        }}
                      >
                        {t(accio.textKey)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloc 7: Cross-reference */}
              <Bloc>
                <BlocNum label={t("v2.bloc7.label")} />
                <BlocTitle>{t("v2.bloc7.title")}</BlocTitle>
                <div className="flex flex-wrap gap-1.5">
                  {xrefChips.map((chip) => (
                    <span
                      key={chip.cert}
                      className="font-mono font-semibold"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #5E8772",
                        color: "#141B18",
                        padding: "4px 10px",
                        fontSize: "10px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {chip.cert}{" "}
                      <span style={{ color: "#5E8772", fontWeight: 500, marginLeft: "6px" }}>
                        · {impactKey(chip.impact)}
                      </span>
                    </span>
                  ))}
                </div>
              </Bloc>
            </div>
          </div>

          {/* --- Footer de l'informe amb CTA --- */}
          <div
            className="flex flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row sm:px-8"
            style={{ background: "#26312B", color: "#F2F5F1" }}
          >
            <p
              className="font-serif italic"
              style={{
                color: "rgba(245, 239, 230, 0.7)",
                fontSize: "0.875rem",
              }}
            >
              {t("v2.informe.footer.text")}
            </p>
            <button
              onClick={() => onOpenReport("revisio-esrs-maig-2026")}
              className="font-sans font-medium transition-colors hover:opacity-80"
              style={{
                color: "#AAC9B6",
                borderBottom: "1px solid #5E8772",
                paddingBottom: "4px",
                fontSize: "0.8125rem",
                letterSpacing: "0.02em",
              }}
            >
              {t("v2.informe.footer.cta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Bloc genèric per a l'interior de l'informe destacat.
 * Padding 24px 32px amb border-bottom coure pàl·lid.
 */
function Bloc({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="px-6 py-6 sm:px-8"
      style={{ borderBottom: "1px solid #D8E2DA" }}
    >
      {children}
    </div>
  );
}

/** Etiqueta BLOC X · NOM — mono uppercase coure */
function BlocNum({ label }: { label: string }) {
  return (
    <div
      className="mb-1 font-mono font-semibold uppercase"
      style={{
        color: "#5E8772",
        fontSize: "9px",
        letterSpacing: "0.22em",
      }}
    >
      {label}
    </div>
  );
}

/** Títol del bloc — Fraunces mitjà 17px color #26312B */
function BlocTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4
      className="mb-3 font-serif font-medium"
      style={{
        color: "#26312B",
        letterSpacing: "-0.008em",
        fontSize: "1.0625rem",
      }}
    >
      {children}
    </h4>
  );
}
