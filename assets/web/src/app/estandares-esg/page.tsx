"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";

type StandarType = "reg" | "fw" | "cert";
type AccessType = "free" | "premium";

interface Standar {
  slug: string;
  name: string;
  type: StandarType;
  access: AccessType;
  descCa: string;
  descEs: string;
  count: number;
}

const STANDARDS: Standar[] = [
  // 5 REGULACIONS (01-05)
  { slug: "csrd-esrs", name: "CSRD / ESRS", type: "reg", access: "free", count: 7,
    descCa: "Regulació europea de reporting. Obligatòria per a >250 empleats des de 2024.",
    descEs: "Regulación europea de reporting. Obligatoria para >250 empleados desde 2024." },
  { slug: "csddd", name: "CSDDD", type: "reg", access: "free", count: 4,
    descCa: "Deure de diligència en drets humans. Empreses >1000 empleats.",
    descEs: "Deber de diligencia en derechos humanos. Empresas >1000 empleados." },
  { slug: "sfdr", name: "SFDR", type: "reg", access: "free", count: 3,
    descCa: "Regulació de disclosure financer. Articles 6, 8 i 9.",
    descEs: "Regulación de disclosure financiero. Artículos 6, 8 y 9." },
  { slug: "taxonomia-ue", name: "Taxonomia UE", type: "reg", access: "free", count: 5,
    descCa: "Classificació d'activitats econòmiques sostenibles. 6 objectius.",
    descEs: "Clasificación de actividades económicas sostenibles. 6 objetivos." },
  { slug: "emas", name: "EMAS", type: "reg", access: "free", count: 2,
    descCa: "Sistema comunitari d'eco-gestió i auditoria. UE.",
    descEs: "Sistema comunitario de eco-gestión y auditoría. UE." },

  // 5 FRAMEWORKS (06-10)
  { slug: "gri", name: "GRI", type: "fw", access: "free", count: 9,
    descCa: "Framework global més usat. 70%+ de l'IBEX 35 hi reporta.",
    descEs: "Framework global más usado. 70%+ del IBEX 35 reporta con él." },
  { slug: "sasb", name: "SASB", type: "fw", access: "free", count: 3,
    descCa: "Framework de reporting per industria. 77 indústries.",
    descEs: "Framework de reporting por industria. 77 industrias." },
  { slug: "tnfd", name: "TNFD", type: "fw", access: "free", count: 4,
    descCa: "Framework de natura. Riscos i dependències.",
    descEs: "Framework de naturaleza. Riesgos y dependencias." },
  { slug: "tcfd", name: "TCFD", type: "fw", access: "free", count: 6,
    descCa: "Framework climàtic. Recomanacions de disclosure.",
    descEs: "Framework climático. Recomendaciones de disclosure." },
  { slug: "iso-26000", name: "ISO 26000", type: "fw", access: "free", count: 2,
    descCa: "Guia de responsabilitat social. No certificable.",
    descEs: "Guía de responsabilidad social. No certificable." },

  // 6 CERTIFICACIONS (11-16)
  { slug: "ecovadis", name: "EcoVadis", type: "cert", access: "premium", count: 7,
    descCa: "Rating de sostenibilitat per a cadenes de subministrament. Medalles Bronze-Platinum.",
    descEs: "Rating de sostenibilidad para cadenas de suministro. Medallas Bronze-Platinum." },
  { slug: "b-corp", name: "B Corp", type: "cert", access: "premium", count: 5,
    descCa: "Certificació d'empreses amb propòsit. Score mínim 80/200.",
    descEs: "Certificación de empresas con propósito. Score mínimo 80/200." },
  { slug: "msci-esg", name: "MSCI ESG", type: "cert", access: "premium", count: 6,
    descCa: "Rating per a inversors (AAA-CCC). Afacta al cost de capital.",
    descEs: "Rating para inversores (AAA-CCC). Afecta al coste de capital." },
  { slug: "cdp", name: "CDP", type: "cert", access: "premium", count: 3,
    descCa: "Disclosure global de clima, aigua i boscos. Puntuació A- a D-.",
    descEs: "Disclosure global de clima, agua y bosques. Puntuación A- a D-." },
  { slug: "sge-21", name: "SGE 21", type: "cert", access: "premium", count: 3,
    descCa: "Sistema de Gestió Ètica de Forética. Metodologia espanyola.",
    descEs: "Sistema de Gestión Ética de Forética. Metodología española." },
  { slug: "sustainalytics", name: "Sustainalytics", type: "cert", access: "premium", count: 4,
    descCa: "Rating de risc ESG per a inversors. 5 nivells.",
    descEs: "Rating de riesgo ESG para inversores. 5 niveles." },
];

const STRIPE_COLOR: Record<StandarType, string> = {
  reg: "#5C3A1E",
  fw: "#B87333",
  cert: "#E8C99A",
};

const TAG_COLOR: Record<StandarType, string> = {
  reg: "#5C3A1E",
  fw: "#B87333",
  cert: "#8A6D2B",
};

/**
 * ESTÀNDARDS ESG — redissenyats
 *
 * Layout:
 *  - Page header 2 cols: text (eyebrow + title + 3 conceptes amb fons colors) + "16" gran
 *  - Legend/filter bar: 3 toggle chips amb color bars + search input
 *  - Grid 4 cols de 16 cards amb franja superior 6px del color de la categoria
 */
export default function EstandaresPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<StandarType>>(
    new Set(["reg", "fw", "cert"])
  );

  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  const toggleFilter = (type: StandarType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      // Si cap filtre actiu, mostra tots
      if (next.size === 0) {
        next.add("reg");
        next.add("fw");
        next.add("cert");
      }
      return next;
    });
  };

  const filteredStandards = useMemo(() => {
    return STANDARDS.filter((s) => {
      if (!activeFilters.has(s.type)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.descCa.toLowerCase().includes(q) ||
          s.descEs.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeFilters, searchQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
      />
      <main className="flex-1">
        {/* PAGE HEADER */}
        <section
          className="border-b bg-background px-6 pb-8 pt-16 sm:px-8 lg:px-12"
          style={{ borderColor: "#2C1810" }}
        >
          <div
            className="grid items-end gap-8"
            style={{ gridTemplateColumns: "minmax(0, 1fr) auto" }}
          >
            <div>
              <div
                className="mb-3.5 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
                style={{ color: "#8A5526", letterSpacing: "0.22em" }}
              >
                <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
                {t("v2.estandards.eyebrow")}
              </div>
              <h1
                className="mb-3.5 font-serif font-medium"
                style={{
                  color: "#2C1810",
                  fontSize: "clamp(2rem, 4.5vw, 3rem)",
                  letterSpacing: "-0.022em",
                  lineHeight: 1.05,
                }}
              >
                {t("v2.estandards.title.pre")}{" "}
                <em
                  className="italic font-normal"
                  style={{ color: "#5C3A1E" }}
                >
                  {t("v2.estandards.title.em")}
                </em>{" "}
                {t("v2.estandards.title.post")}
              </h1>
              <div
                className="font-serif italic"
                style={{
                  color: "#5C3A1E",
                  fontSize: "1.0625rem",
                  maxWidth: "720px",
                  lineHeight: 1.4,
                }}
              >
                {/* 3 conceptes amb colors diferents */}
                <div className="mb-3.5 flex flex-wrap gap-2.5 not-italic">
                  <span
                    className="font-serif italic"
                    style={{
                      background: "#5C3A1E",
                      color: "#F5EFE6",
                      padding: "6px 14px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {t("v2.estandards.concept.reg")}
                  </span>
                  <span
                    className="font-serif italic"
                    style={{
                      background: "#B87333",
                      color: "#F5EFE6",
                      padding: "6px 14px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {t("v2.estandards.concept.fw")}
                  </span>
                  <span
                    className="font-serif italic"
                    style={{
                      background: "#E8C99A",
                      color: "#5C3A1E",
                      padding: "6px 14px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {t("v2.estandards.concept.cert")}
                  </span>
                </div>
                <span className="block">
                  {t("v2.estandards.subtitle.line2")}
                </span>
              </div>
            </div>
            {/* Number 16 gegant */}
            <div
              className="hidden font-serif sm:block"
              style={{
                color: "#2C1810",
                fontSize: "clamp(5rem, 10vw, 7.5rem)",
                fontWeight: 300,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
              }}
            >
              16<sup
                className="font-mono"
                style={{
                  fontSize: "12px",
                  color: "#B87333",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  verticalAlign: "top",
                  marginLeft: "6px",
                }}
              >
                {tr("est.", "est.")}
              </sup>
            </div>
          </div>
        </section>

        {/* LEGEND / FILTERS */}
        <section
          className="flex flex-wrap items-center justify-between gap-4 border-b bg-background px-6 py-5 sm:px-8 lg:px-12"
          style={{ borderColor: "#C9B89A" }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="mr-2 font-mono text-[10px] font-semibold uppercase"
              style={{ color: "#8B7355", letterSpacing: "0.18em" }}
            >
              {t("v2.estandards.legend.label")}
            </span>
            {([
              { type: "reg" as const, label: t("v2.estandards.legend.reg"), color: "#5C3A1E" },
              { type: "fw" as const, label: t("v2.estandards.legend.fw"), color: "#B87333" },
              { type: "cert" as const, label: t("v2.estandards.legend.cert"), color: "#E8C99A" },
            ]).map((chip) => {
              const isActive = activeFilters.has(chip.type);
              const activeBg =
                chip.type === "reg"
                  ? "#5C3A1E"
                  : chip.type === "fw"
                    ? "#B87333"
                    : "#E8C99A";
              const activeColor = chip.type === "cert" ? "#5C3A1E" : "#F5EFE6";
              return (
                <button
                  key={chip.type}
                  onClick={() => toggleFilter(chip.type)}
                  className="flex cursor-pointer items-center gap-2 font-mono text-[10px] font-semibold uppercase transition-transform hover:-translate-y-0.5"
                  style={{
                    padding: "8px 14px",
                    letterSpacing: "0.14em",
                    background: isActive
                      ? activeBg
                      : chip.type === "reg"
                        ? "rgba(92, 58, 30, 0.12)"
                        : chip.type === "fw"
                          ? "rgba(184, 115, 51, 0.12)"
                          : "rgba(232, 201, 154, 0.25)",
                    border: "1px solid",
                    borderColor: isActive
                      ? activeBg
                      : chip.type === "reg"
                        ? "#5C3A1E"
                        : chip.type === "fw"
                          ? "#B87333"
                          : "#E8C99A",
                    color: isActive
                      ? activeColor
                      : chip.type === "cert"
                        ? "#8A6D2B"
                        : "#5C3A1E",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "4px",
                      background: isActive
                        ? chip.type === "cert"
                          ? "#5C3A1E"
                          : "#B87333"
                        : chip.color,
                    }}
                  />
                  {chip.label}
                </button>
              );
            })}
          </div>
          <input
            type="search"
            placeholder={t("v2.estandards.search.placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-sans"
            style={{
              padding: "8px 14px",
              background: "#FFFFFF",
              border: "1px solid #C9B89A",
              color: "#8B7355",
              width: "220px",
              fontSize: "12px",
            }}
          />
        </section>

        {/* GRID D'ESTÀNDARDS (4 cols) */}
        <section className="bg-background px-6 pb-16 pt-10 sm:px-8 lg:px-12">
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
          >
            {filteredStandards.map((s, idx) => (
              <button
                key={s.slug}
                onClick={() => router.push(`/estandares-esg/${s.slug}`)}
                className="group flex cursor-pointer flex-col text-left transition-all hover:-translate-y-0.5"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #C9B89A",
                }}
              >
                {/* Franja superior 6px */}
                <div
                  style={{
                    height: "6px",
                    background: STRIPE_COLOR[s.type],
                  }}
                  aria-hidden
                />
                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  {/* Header: num + access badge */}
                  <div
                    className="flex items-baseline justify-between border-b pb-2"
                    style={{ borderColor: "rgba(201, 184, 154, 0.5)" }}
                  >
                    <span
                      className="font-mono text-[9.5px] font-semibold"
                      style={{
                        color: "#8B7355",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="font-mono text-[8.5px] font-semibold uppercase"
                      style={{
                        background:
                          s.access === "free"
                            ? "rgba(92, 138, 92, 0.12)"
                            : "#B87333",
                        color: s.access === "free" ? "#4A6B3A" : "#FFFFFF",
                        padding: "3px 7px",
                        letterSpacing: "0.14em",
                      }}
                    >
                      {s.access === "free"
                        ? t("v2.estandards.access.free")
                        : t("v2.estandards.access.premium")}
                    </span>
                  </div>

                  {/* Tag categoria */}
                  <span
                    className="font-mono text-[9px] font-semibold uppercase"
                    style={{
                      color: TAG_COLOR[s.type],
                      letterSpacing: "0.18em",
                    }}
                  >
                    {s.type === "reg"
                      ? t("v2.estandards.tag.reg.ue")
                      : s.type === "fw"
                        ? t("v2.estandards.tag.fw.global")
                        : s.name === "MSCI ESG" || s.name === "Sustainalytics"
                          ? t("v2.estandards.tag.rating")
                          : t("v2.estandards.tag.cert")}
                  </span>

                  {/* Name */}
                  <h3
                    className="font-serif font-medium"
                    style={{
                      color: "#2C1810",
                      fontSize: "1.1875rem",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.15,
                    }}
                  >
                    {s.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="font-sans"
                    style={{
                      color: "#5C3A1E",
                      fontSize: "0.718rem",
                      lineHeight: 1.45,
                    }}
                  >
                    {tr(s.descCa, s.descEs)}
                  </p>

                  {/* Footer */}
                  <div
                    className="mt-auto flex items-baseline justify-between border-t pt-3"
                    style={{ borderColor: "rgba(201, 184, 154, 0.5)" }}
                  >
                    <span
                      className="font-mono text-[9px] font-medium uppercase"
                      style={{
                        color: "#8B7355",
                        letterSpacing: "0.14em",
                      }}
                    >
                      <strong style={{ color: "#B87333", fontWeight: 700 }}>
                        {s.count}
                      </strong>{" "}
                      {t("v2.estandards.card.count")}
                    </span>
                    <span
                      className="font-mono text-[9px] font-semibold uppercase transition-colors group-hover:text-accent-deep"
                      style={{
                        color: "#B87333",
                        letterSpacing: "0.14em",
                        borderBottom: "1px solid #B87333",
                        paddingBottom: "2px",
                      }}
                    >
                      {t("v2.estandards.card.link")}
                    </span>
                  </div>
                </div>
              </button>
            ))}
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
