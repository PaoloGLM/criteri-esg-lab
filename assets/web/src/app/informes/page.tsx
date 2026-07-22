"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { SemaforoPopup } from "@/components/sections/semaforo-popup";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import {
  reports,
  isFreeAccess,
  formatDate,
  type Report,
  type SemaforStatus,
  type SemaforGrade,
} from "@/lib/reports";
import { getReportContent } from "@/lib/reports-content";

/**
 * BIBLIOTECA D'INFORMES — redissenyada
 *
 * Layout:
 *  - Page header: eyebrow + "Tots els informes Criteri." + subtitle
 *  - Controls bar: certification filter chips + sort select
 *  - Card destacada (spans 3 cols): 1.4fr contingut + 1fr semàfor dark
 *  - Grid 3 cols normal cards
 *  - "Carregar més" + count
 *  - Popup metodologia semàfor (obrible clicant qualsevol semàfor)
 */
export default function InformesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, plan } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [certFilter, setCertFilter] = useState<string>("all");
  const [sortMode, setSortMode] = useState<"recent" | "best" | "impact">("recent");
  const [visibleCount, setVisibleCount] = useState<number>(7);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleOpenReport = (slug: string) => {
    router.push(`/informes/${slug}`);
  };

  // Llista de certificacions per als xips de filtre (7 principals + "Tots")
  const certFilters = [
    { id: "all", label: t("v2.biblioteca.filter.tots") },
    { id: "GRI", label: "GRI" },
    { id: "EcoVadis", label: "EcoVadis" },
    { id: "B Corp", label: "B Corp" },
    { id: "MSCI ESG", label: "MSCI" },
    { id: "CDP", label: "CDP" },
    { id: "SGE 21", label: "SGE 21" },
    { id: "CSRD", label: "CSRD / ESRS" },
  ];

  // Filtratge + ordenació
  const filteredReports = useMemo(() => {
    let list = reports.slice();
    if (certFilter !== "all") {
      list = list.filter((r) =>
        r.certifications.some((c) =>
          c.toLowerCase().includes(certFilter.toLowerCase())
        )
      );
    }
    if (sortMode === "recent") {
      list.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sortMode === "best") {
      list.sort((a, b) => {
        const ga = getReportContent(a.slug, "es")?.semafor.grade ?? "D";
        const gb = getReportContent(b.slug, "es")?.semafor.grade ?? "D";
        return ga.localeCompare(gb);
      });
    } else if (sortMode === "impact") {
      list.sort((a, b) => {
        const ca = getReportContent(a.slug, "es")?.crossRefs ?? [];
        const cb = getReportContent(b.slug, "es")?.crossRefs ?? [];
        const ia = ca.filter((c) => c.impact === "Alt").length;
        const ib = cb.filter((c) => c.impact === "Alt").length;
        return ib - ia;
      });
    }
    return list;
  }, [certFilter, sortMode]);

  // El primer informe sempre és el destacat
  const featured = filteredReports[0];
  const normalReports = filteredReports.slice(1, visibleCount);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={(tab) => openAuth(tab || "register")}
      />
      <main className="flex-1">
        {/* PAGE HEADER */}
        <section
          className="border-b bg-background px-6 pb-8 pt-16 sm:px-8 lg:px-12"
          style={{ borderColor: "#2C1810" }}
        >
          <div
            className="mb-3 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase"
            style={{ color: "#8A5526", letterSpacing: "0.22em" }}
          >
            <span style={{ width: "24px", height: "2px", background: "#B87333" }} />
            {t("v2.biblioteca.eyebrow")}
          </div>
          <h1
            className="mb-4 font-serif font-medium"
            style={{
              color: "#2C1810",
              fontSize: "clamp(2rem, 4.5vw, 3rem)",
              letterSpacing: "-0.022em",
              lineHeight: 1.05,
            }}
          >
            {t("v2.biblioteca.title.pre")}{" "}
            <em
              className="italic font-normal"
              style={{ color: "#5C3A1E" }}
            >
              {t("v2.biblioteca.title.em")}
            </em>
            {t("v2.biblioteca.title.post")}
          </h1>
          <p
            className="font-serif italic"
            style={{
              color: "#5C3A1E",
              fontSize: "1.125rem",
              lineHeight: 1.4,
              maxWidth: "720px",
            }}
          >
            {t("v2.biblioteca.subtitle")}
          </p>
        </section>

        {/* CONTROLS */}
        <section
          className="border-b bg-background px-6 py-5 sm:px-8 lg:px-12"
          style={{ borderColor: "#C9B89A" }}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="font-mono text-[10px] font-semibold uppercase"
                style={{ color: "#8B7355", letterSpacing: "0.18em" }}
              >
                {t("v2.biblioteca.filter.label")}
              </span>
              {certFilters.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => {
                    setCertFilter(chip.id);
                    setVisibleCount(7);
                  }}
                  className="cursor-pointer font-mono text-[10px] font-medium uppercase transition-colors"
                  style={{
                    padding: "6px 12px",
                    background:
                      certFilter === chip.id ? "#2C1810" : "#FFFFFF",
                    color: certFilter === chip.id ? "#F5EFE6" : "#5C3A1E",
                    border: "1px solid",
                    borderColor: certFilter === chip.id ? "#2C1810" : "#C9B89A",
                    letterSpacing: "0.14em",
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <select
              value={sortMode}
              onChange={(e) =>
                setSortMode(e.target.value as "recent" | "best" | "impact")
              }
              className="cursor-pointer border bg-white font-mono text-[10px] font-medium uppercase"
              style={{
                padding: "6px 12px",
                borderColor: "#C9B89A",
                color: "#5C3A1E",
                letterSpacing: "0.14em",
              }}
            >
              <option value="recent">{t("v2.biblioteca.sort.recent")}</option>
              <option value="best">{t("v2.biblioteca.sort.best")}</option>
              <option value="impact">{t("v2.biblioteca.sort.impact")}</option>
            </select>
          </div>
        </section>

        {/* GRID */}
        <section className="bg-background px-6 pb-16 pt-10 sm:px-8 lg:px-12">
          <div
            className="grid gap-7"
            style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            {/* CARD DESTACADA */}
            {featured && (
              <FeaturedCard
                report={featured}
                onOpen={() => handleOpenReport(featured.slug)}
                onOpenPopup={() => setPopupOpen(true)}
              />
            )}

            {/* CARDS NORMALS */}
            {normalReports.map((report, idx) => (
              <NormalCard
                key={report.slug}
                report={report}
                num={String(idx + 2).padStart(2, "0")}
                onOpen={() => handleOpenReport(report.slug)}
                onOpenPopup={() => setPopupOpen(true)}
              />
            ))}
          </div>

          {/* LOAD MORE */}
          <div
            className="mt-10 flex flex-col items-center gap-3 border-t pt-10"
            style={{ borderColor: "#C9B89A" }}
          >
            <button
              onClick={() => setVisibleCount((n) => n + 6)}
              className="cursor-pointer font-sans text-[13px] font-semibold transition-all"
              style={{
                background: "transparent",
                color: "#2C1810",
                padding: "14px 36px",
                border: "1px solid #2C1810",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#2C1810";
                e.currentTarget.style.color = "#F5EFE6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#2C1810";
              }}
            >
              {t("v2.biblioteca.load_more")}
            </button>
            <p
              className="font-mono text-[10px] font-medium uppercase"
              style={{ color: "#8B7355", letterSpacing: "0.16em" }}
            >
              {t("v2.biblioteca.count")}
            </p>
          </div>
        </section>
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => openAuth("register")}
      />
      <SemaforoPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </div>
  );
}

// ============================================================================
// CARD DESTACADA (1.4fr contingut + 1fr semàfor dark)
// ============================================================================

function FeaturedCard({
  report,
  onOpen,
  onOpenPopup,
}: {
  report: Report;
  onOpen: () => void;
  onOpenPopup: () => void;
}) {
  const { t, lang } = useLanguage();
  const content = getReportContent(report.slug, lang);
  const semafor = content?.semafor;
  const crossRefs = content?.crossRefs ?? [];

  return (
    <article
      className="grid bg-white"
      style={{
        gridColumn: "span 3",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
        border: "1px solid #C9B89A",
        marginBottom: "12px",
      }}
    >
      {/* Contingut */}
      <div className="flex flex-col gap-4 p-8">
        <div className="flex flex-wrap gap-2">
          <span
            className="font-mono text-[9px] font-semibold uppercase"
            style={{
              background: "rgba(184, 115, 51, 0.1)",
              color: "#B87333",
              border: "1px solid #B87333",
              padding: "3px 8px",
              letterSpacing: "0.16em",
            }}
          >
            {t("v2.biblioteca.destacada.tag.ultim")}
          </span>
          <span
            className="font-mono text-[9px] font-semibold uppercase"
            style={{
              background: "rgba(92, 58, 30, 0.12)",
              color: "#5C3A1E",
              padding: "3px 8px",
              letterSpacing: "0.16em",
            }}
          >
            {t("v2.detall.tag.regulacio")}
          </span>
          <span
            className="font-mono text-[9px] font-semibold uppercase"
            style={{
              background: "rgba(92, 138, 92, 0.12)",
              color: "#4A6B3A",
              padding: "3px 8px",
              letterSpacing: "0.16em",
            }}
          >
            {t("v2.detall.tag.gratis")}
          </span>
        </div>

        <h2
          className="font-serif font-medium"
          style={{
            color: "#2C1810",
            fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
            letterSpacing: "-0.018em",
            lineHeight: 1.1,
          }}
        >
          {report.title.split(":")[0]}:{" "}
          <em className="italic font-normal" style={{ color: "#5C3A1E" }}>
            {report.title.split(":")[1]?.trim() ?? ""}
          </em>
        </h2>

        <div
          className="font-mono text-[10px] font-medium uppercase"
          style={{ color: "#8B7355", letterSpacing: "0.14em" }}
        >
          <strong style={{ color: "#2C1810", fontWeight: 600 }}>
            {report.institution.split("(")[0].trim()}
          </strong>{" "}
          · {formatDate(report.date, lang)} · {report.pages}{" "}
          {lang === "ca" ? "pàg" : "pág"} · ESRS Q&A Platform
        </div>

        <p
          className="font-sans"
          style={{
            color: "#2C1810",
            fontSize: "0.875rem",
            lineHeight: 1.55,
            maxWidth: "600px",
          }}
        >
          {report.summary}
        </p>

        {/* Xref chips */}
        <div className="flex flex-wrap gap-1.5">
          {crossRefs.slice(0, 5).map((xref, idx) => {
            const impactLabel =
              xref.impact === "Alto"
                ? t("v2.biblioteca.xref.impact.high")
                : xref.impact === "Medio"
                  ? t("v2.biblioteca.xref.impact.med")
                  : t("v2.biblioteca.xref.impact.low");
            return (
              <span
                key={idx}
                className="font-mono text-[9px] font-semibold uppercase"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #B87333",
                  color: "#5C3A1E",
                  padding: "3px 8px",
                  letterSpacing: "0.12em",
                }}
              >
                {xref.framework} · {impactLabel}
              </span>
            );
          })}
        </div>

        <button
          onClick={onOpen}
          className="mt-2 cursor-pointer self-start font-sans text-[13px] font-semibold transition-opacity hover:opacity-70"
          style={{
            color: "#B87333",
            borderBottom: "1px solid #B87333",
            paddingBottom: "4px",
          }}
        >
          {t("v2.biblioteca.destacada.cta")}
        </button>
      </div>

      {/* Semàfor (dark) */}
      <button
        onClick={onOpenPopup}
        className="flex flex-col justify-between text-left"
        style={{
          background: "#2C1810",
          color: "#F5EFE6",
          padding: "20px 24px",
          cursor: "pointer",
        }}
        aria-label={t("v2.popup.eyebrow")}
      >
        <div className="flex items-baseline justify-between">
          <span
            className="font-mono text-[9.5px] font-semibold uppercase"
            style={{ color: "#D9A574", letterSpacing: "0.22em" }}
          >
            {t("v2.detall.sidebar.semafor.label")}
          </span>
          <span
            className="font-mono text-[9px] font-medium uppercase underline"
            style={{
              color: "rgba(245, 239, 230, 0.4)",
              letterSpacing: "0.16em",
              textUnderlineOffset: "3px",
              textDecorationColor: "rgba(217, 165, 116, 0.5)",
            }}
          >
            {t("v2.biblioteca.semafor.info")}
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span
            className="font-serif font-normal"
            style={{
              color: "#B87333",
              fontSize: "2.5rem",
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            {semafor?.grade ?? "C"}
          </span>
          <span
            className="font-serif italic"
            style={{ color: "#F5EFE6", fontSize: "14px" }}
          >
            {semafor?.gradeLabel ?? t("v2.detall.bloc0.grade_label")}
          </span>
        </div>

        {/* 5 dimensions mini */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}
        >
          {(semafor?.indicators ?? []).map((ind, idx) => (
            <div
              key={idx}
              className="grid items-center gap-2 border-b py-0.5"
              style={{
                gridTemplateColumns: "80px 1fr",
                borderColor: "rgba(217, 165, 116, 0.15)",
              }}
            >
              <span
                className="font-mono text-[8.5px] font-medium uppercase"
                style={{
                  color: "rgba(245, 239, 230, 0.6)",
                  letterSpacing: "0.16em",
                }}
              >
                {shortDimName(ind.name)}
              </span>
              <div className="flex gap-1">
                {(["verd", "groc", "vermell"] as const).map((color) => {
                  const isActive = ind.status === color;
                  return (
                    <div
                      key={color}
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: dotColor(color),
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

        <p
          className="font-serif italic"
          style={{
            color: "rgba(245, 239, 230, 0.5)",
            fontSize: "11px",
            lineHeight: 1.4,
            borderTop: "1px solid rgba(217, 165, 116, 0.2)",
            paddingTop: "8px",
          }}
        >
          {t("v2.biblioteca.semafor.footer")}
        </p>
      </button>
    </article>
  );
}

// ============================================================================
// CARD NORMAL (3 cols grid)
// ============================================================================

function NormalCard({
  report,
  num,
  onOpen,
  onOpenPopup,
}: {
  report: Report;
  num: string;
  onOpen: () => void;
  onOpenPopup: () => void;
}) {
  const { t, lang } = useLanguage();
  const content = getReportContent(report.slug, lang);
  const semafor = content?.semafor;
  const crossRefs = content?.crossRefs ?? [];
  const free = isFreeAccess(report.date);
  const isPremiumReport = report.slug === "revisio-esrs-maig-2026";
  const showFree = isPremiumReport || free;

  // Tag segons type
  const tagLabel = (() => {
    if (report.type === "rating") return t("v2.biblioteca.tag.rating");
    if (report.type === "framework") return t("v2.biblioteca.tag.framework");
    if (report.type === "regulatory" || report.type === "official")
      return t("v2.biblioteca.tag.regulacio");
    return t("v2.biblioteca.tag.framework");
  })();

  const tagBg = (() => {
    if (report.type === "rating") return "rgba(184,115,51,0.12)";
    if (report.type === "framework") return "rgba(232,201,154,0.25)";
    return "rgba(92, 58, 30, 0.12)";
  })();

  const tagColor = (() => {
    if (report.type === "rating") return "#B87333";
    if (report.type === "framework") return "#8A6D2B";
    return "#5C3A1E";
  })();

  return (
    <article
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${report.title} — ${report.institution}`}
      className="group flex cursor-pointer flex-col gap-3.5 bg-white p-6 transition-all hover:border-accent"
      style={{ border: "1px solid #C9B89A" }}
    >
      {/* Top: tags + num */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <span
            className="font-mono text-[9px] font-semibold uppercase"
            style={{
              background: tagBg,
              color: tagColor,
              padding: "3px 8px",
              letterSpacing: "0.16em",
            }}
          >
            {tagLabel}
          </span>
          {showFree ? (
            <span
              className="font-mono text-[9px] font-semibold uppercase"
              style={{
                background: "rgba(92, 138, 92, 0.12)",
                color: "#4A6B3A",
                padding: "3px 8px",
                letterSpacing: "0.16em",
              }}
            >
              {t("v2.detall.tag.gratis")}
            </span>
          ) : (
            <span
              className="font-mono text-[9px] font-semibold uppercase"
              style={{
                background: "#B87333",
                color: "#FFFFFF",
                padding: "3px 8px",
                letterSpacing: "0.16em",
              }}
            >
              {t("v2.biblioteca.tag.premium")}
            </span>
          )}
        </div>
        <span
          className="font-mono text-[9px] font-medium"
          style={{ color: "#8B7355" }}
        >
          {num}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-serif font-medium"
        style={{
          color: "#2C1810",
          fontSize: "1.125rem",
          letterSpacing: "-0.008em",
          lineHeight: 1.2,
        }}
      >
        {report.title.split(":")[0]}
        {report.title.includes(":") && (
          <>
            :{" "}
            <em className="italic font-normal" style={{ color: "#5C3A1E" }}>
              {report.title.split(":")[1]?.trim()}
            </em>
          </>
        )}
      </h3>

      {/* Meta */}
      <div
        className="font-mono text-[9.5px] font-medium uppercase"
        style={{ color: "#8B7355", letterSpacing: "0.14em" }}
      >
        <strong style={{ color: "#2C1810", fontWeight: 600 }}>
          {report.institution.split("(")[0].trim()}
        </strong>{" "}
        · {formatDate(report.date, lang)} · {report.pages}{" "}
        {lang === "ca" ? "pàg" : "pág"}
      </div>

      {/* Semàfor inline compacte */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenPopup();
        }}
        className="flex cursor-pointer items-center gap-2.5 border-y py-2.5"
        style={{ borderColor: "#C9B89A" }}
        aria-label={t("v2.popup.eyebrow")}
      >
        <span
          className="font-mono text-[8.5px] font-semibold uppercase"
          style={{ color: "#8A5526", letterSpacing: "0.16em" }}
        >
          {t("v2.biblioteca.card.semafor.label")}
        </span>
        <span
          className="font-serif font-semibold"
          style={{
            color: "#B87333",
            fontSize: "1.125rem",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {semafor?.grade ?? "C"}
        </span>
        <span
          className="font-serif italic"
          style={{ color: "#5C3A1E", fontSize: "12px" }}
        >
          {semafor?.gradeLabel ?? t("v2.detall.bloc0.grade_label")}
        </span>
        <div className="ml-auto flex gap-1">
          {(semafor?.indicators ?? []).map((ind, idx) => (
            <div
              key={idx}
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: dotColor(ind.status),
              }}
              aria-hidden
            />
          ))}
        </div>
      </button>

      {/* Summary */}
      <p
        className="font-sans"
        style={{
          color: "#5C3A1E",
          fontSize: "0.75rem",
          lineHeight: 1.5,
        }}
      >
        {report.summary}
      </p>

      {/* Xref chips */}
      <div className="mt-auto flex flex-wrap gap-1">
        {crossRefs.slice(0, 4).map((xref, idx) => {
          const impactClass =
            xref.impact === "Alto"
              ? "#A0522D"
              : xref.impact === "Medio"
                ? "#8A6D2B"
                : "#8B7355";
          const impactLabel =
            xref.impact === "Alto"
              ? t("v2.biblioteca.xref.impact.high")
              : xref.impact === "Medio"
                ? t("v2.biblioteca.xref.impact.med")
                : t("v2.biblioteca.xref.impact.low");
          return (
            <span
              key={idx}
              className="font-mono text-[8px] font-semibold uppercase"
              style={{
                background: "rgba(184, 115, 51, 0.08)",
                color: impactClass,
                padding: "2px 6px",
                letterSpacing: "0.1em",
              }}
            >
              {xref.framework} · {impactLabel}
            </span>
          );
        })}
      </div>
    </article>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function shortDimName(name: string): string {
  if (name.toLowerCase().includes("scope")) return "Scope 3";
  if (name.toLowerCase().includes("temporal") || name.toLowerCase().includes("plazo"))
    return "Terminis";
  if (name.toLowerCase().includes("font")) return "Fonts";
  if (name.toLowerCase().includes("granular")) return "Granular.";
  if (name.toLowerCase().includes("verificaci") || name.toLowerCase().includes("verificaci"))
    return "Verific.";
  return name.slice(0, 8);
}

function dotColor(status: SemaforStatus): string {
  if (status === "verd") return "#5C8A5C";
  if (status === "groc") return "#C9A961";
  return "#A0522D";
}
