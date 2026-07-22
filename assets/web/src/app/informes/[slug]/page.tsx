"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { SemaforoPopup } from "@/components/sections/semaforo-popup";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { reports, isFreeAccess } from "@/lib/reports";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock } from "lucide-react";

/**
 * INFORME DETALL — Variant A (sidebar sticky)
 *
 * Layout:
 *  - Header (sticky, from layout)
 *  - Breadcrumb: Biblioteca / Informes / [Report title] · "5 min · 8 blocs"
 *  - Layout grid: 280px sidebar (sticky, top: 70px) + main content
 *  - Sidebar: Índice del informe (8 nav items) + mini semàfor + progress
 *  - Main:
 *    * Header (Bloc 1 fitxa tècnica)
 *    * Bloc 0 Semàfor (dark full-width band) amb 5 dims + JUSTIFICACIONS
 *    * Bloc 2 5 dades clau (2 cols)
 *    * Bloc 3 Resum executiu (serif)
 *    * Bloc 4 Implicacions (3 cols) + subsecció "Més enllà del Checkbox" (dark)
 *    * Bloc 5 Connexions
 *    * Bloc 6 Accions recomanades (banda coure clar)
 *    * Bloc 7 Cross-reference taula amb badges
 *    * Footer informe
 *
 * Manté lògica d'accés (free/premium/anonymous) i gating del Bloc 7
 * (3 files visibles + blur de la resta si no premium).
 */
export default function InformeSlugPage() {
  const { t } = useLanguage();
  const { user, plan } = useAuth();
  const params = useParams();
  const slugRaw = params?.slug;
  const slug =
    typeof slugRaw === "string"
      ? slugRaw
      : Array.isArray(slugRaw)
        ? slugRaw[0] ?? ""
        : "";

  const [isRegistered, setIsRegistered] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [activeBloc, setActiveBloc] = useState<string>("bloc-0");

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const report = reports.find((r) => r.slug === slug);

  // Scroll-spy: detecta el bloc visible per marcar-lo actiu al sidebar
  useEffect(() => {
    if (!report) return;
    const blocs = ["bloc-0", "bloc-2", "bloc-3", "bloc-4", "bloc-5", "bloc-6", "bloc-7"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveBloc(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: [0.05, 0.25, 0.5] }
    );
    blocs.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [report]);

  // Scroll suau al clicar un ítem del sidebar
  const scrollToBloc = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const dialogs = (
    <>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => openAuth("register")}
      />
      <SemaforoPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </>
  );

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header
          onOpenPreus={() => setPreusOpen(true)}
          onOpenAuth={(tab) => openAuth(tab || "register")}
        />
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <p className="eyebrow mb-3">404</p>
            <h1 className="mb-4 font-serif text-3xl font-semibold text-primary">
              {t("v2.detall.breadcrumb.informes")} — 404
            </h1>
            <Button asChild className="mt-6">
              <a href="/informes">
                ←{" "}
                <ArrowRight className="ml-2 h-4 w-4 rotate-180" />
              </a>
            </Button>
          </div>
        </main>
        <Footer />
        {dialogs}
      </div>
    );
  }

  const isProbeReport = slug === "revisio-esrs-maig-2026";
  const isFree = isFreeAccess(report.date);
  const isPremiumUser = !!user && plan === "premium";
  const isLoggedUser = !!user;
  const isLockedPremium = !isProbeReport && !isFree && !isPremiumUser;
  const isLockedRegister =
    !isProbeReport && isFree && !isRegistered && !isLoggedUser;
  const isLocked = isLockedPremium || isLockedRegister;

  const handleRegister = () => {
    setIsRegistered(true);
    openAuth("register");
  };

  // ========================================
  // Pantalla de bloqueig (registre/premium)
  // ========================================
  if (isLocked) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header
          onOpenPreus={() => setPreusOpen(true)}
          onOpenAuth={(tab) => openAuth(tab || "register")}
        />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
            <p className="eyebrow mb-3">{t("v2.detall.breadcrumb.informes")}</p>
            <h1 className="mb-3 font-serif text-4xl font-semibold leading-tight text-primary">
              {report.title}
            </h1>
            <p className="mb-8 max-w-xl font-serif text-base italic text-foreground/70">
              {report.summary}
            </p>
            <div
              className="rounded-md border border-rule bg-card p-6"
              style={{ borderLeft: "4px solid #B87333" }}
            >
              <div className="mb-4 flex items-center gap-3">
                <Lock className="h-5 w-5 text-accent" />
                <p className="font-serif text-lg text-primary">
                  {isLockedPremium
                    ? "Contingut Premium"
                    : "Registra't per accedir"}
                </p>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-foreground/70">
                {isLockedPremium
                  ? "Aquest informe és recent (menys de 6 mesos). Subscriu-te a Premium per accedir a tots els informes en el moment de publicar-se."
                  : "Crea un compte gratuït per accedir als informes de més de 6 mesos. Sense targeta de crèdit."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleRegister}>
                  {isLockedPremium ? "Fes-te Premium" : "Crea compte gratuït"}
                </Button>
                {!isLockedPremium && (
                  <Button variant="outline" onClick={() => setPreusOpen(true)}>
                    Veure plans Premium
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
        {dialogs}
      </div>
    );
  }

  // ========================================
  // Pàgina detall Variant A — sidebar sticky
  // ========================================
  const semaforDims = [
    { id: "dim1", label: t("v2.bloc0.dim1"), status: "y", statusKey: "v2.detall.bloc0.dim1.status", expKey: "v2.detall.bloc0.dim1.exp" },
    { id: "dim2", label: t("v2.bloc0.dim2"), status: "g", statusKey: "v2.detall.bloc0.dim2.status", expKey: "v2.detall.bloc0.dim2.exp" },
    { id: "dim3", label: t("v2.bloc0.dim3"), status: "y", statusKey: "v2.detall.bloc0.dim3.status", expKey: "v2.detall.bloc0.dim3.exp" },
    { id: "dim4", label: t("v2.bloc0.dim4"), status: "r", statusKey: "v2.detall.bloc0.dim4.status", expKey: "v2.detall.bloc0.dim4.exp" },
    { id: "dim5", label: t("v2.bloc0.dim5"), status: "y", statusKey: "v2.detall.bloc0.dim5.status", expKey: "v2.detall.bloc0.dim5.exp" },
  ] as const;

  const dadesClau = [
    { strongKey: "v2.detall.bloc2.d1.strong", textKey: "v2.detall.bloc2.d1.text" },
    { strongKey: "v2.detall.bloc2.d2.strong", textKey: "v2.detall.bloc2.d2.text" },
    { strongKey: "v2.detall.bloc2.d3.strong", textKey: "v2.detall.bloc2.d3.text" },
    { strongKey: "v2.detall.bloc2.d4.strong", textKey: "v2.detall.bloc2.d4.text" },
  ] as const;

  const navItems = [
    { id: "bloc-0", num: "00", labelKey: "v2.detall.sidebar.nav.0" },
    { id: "bloc-1", num: "01", labelKey: "v2.detall.sidebar.nav.1" },
    { id: "bloc-2", num: "02", labelKey: "v2.detall.sidebar.nav.2" },
    { id: "bloc-3", num: "03", labelKey: "v2.detall.sidebar.nav.3" },
    { id: "bloc-4", num: "04", labelKey: "v2.detall.sidebar.nav.4" },
    { id: "bloc-5", num: "05", labelKey: "v2.detall.sidebar.nav.5" },
    { id: "bloc-6", num: "06", labelKey: "v2.detall.sidebar.nav.6" },
    { id: "bloc-7", num: "07", labelKey: "v2.detall.sidebar.nav.7" },
  ] as const;

  const xrefRows = [
    { certKey: "v2.detall.bloc7.row1.cert", catKey: "v2.detall.bloc7.row1.cat", textKey: "v2.detall.bloc7.row1.text", impact: "high" as const },
    { certKey: "v2.detall.bloc7.row2.cert", catKey: "v2.detall.bloc7.row2.cat", textKey: "v2.detall.bloc7.row2.text", impact: "med" as const },
    { certKey: "v2.detall.bloc7.row3.cert", catKey: "v2.detall.bloc7.row3.cat", textKey: "v2.detall.bloc7.row3.text", impact: "med" as const },
    { certKey: "v2.detall.bloc7.row4.cert", catKey: "v2.detall.bloc7.row4.cat", textKey: "v2.detall.bloc7.row4.text", impact: "low" as const },
    { certKey: "v2.detall.bloc7.row5.cert", catKey: "v2.detall.bloc7.row5.cat", textKey: "v2.detall.bloc7.row5.text", impact: "med" as const },
    { certKey: "v2.detall.bloc7.row6.cert", catKey: "v2.detall.bloc7.row6.cat", textKey: "v2.detall.bloc7.row6.text", impact: "low" as const },
  ];

  const impactBadge = (impact: "high" | "med" | "low") => {
    if (impact === "high")
      return {
        text: t("v2.detall.bloc7.impact.high"),
        bg: "rgba(160, 82, 45, 0.15)",
        color: "#A0522D",
      };
    if (impact === "med")
      return {
        text: t("v2.detall.bloc7.impact.med"),
        bg: "rgba(201, 169, 97, 0.18)",
        color: "#8A6D2B",
      };
    return {
      text: t("v2.detall.bloc7.impact.low"),
      bg: "rgba(139, 115, 85, 0.1)",
      color: "#8B7355",
    };
  };

  const statusColor = (status: "g" | "y" | "r") => {
    if (status === "g") return "#5C8A5C";
    if (status === "y") return "#C9A961";
    return "#A0522D";
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: report.title,
    author: { "@type": "Organization", name: "Criteri ESG" },
    publisher: {
      "@type": "Organization",
      name: "Criteri ESG",
      logo: { "@type": "ImageObject", url: "https://criteriesg.com/logo.svg" },
    },
    datePublished: report.date,
    dateModified: report.date,
    description: report.summary,
    about: report.tags.join(", "),
    inLanguage: "es",
    isPartOf: { "@type": "WebSite", name: "Criteri ESG", url: "https://criteriesg.com" },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={(tab) => openAuth(tab || "register")}
      />

      <main className="flex-1">
        {/* BREADCRUMB */}
        <div
          className="flex items-baseline justify-between border-b bg-background px-6 py-4 sm:px-8 lg:px-12"
          style={{ borderColor: "#C9B89A" }}
        >
          <div className="font-mono text-[10px] font-medium uppercase"
            style={{ letterSpacing: "0.16em", color: "#8B7355" }}
          >
            <a href="/informes" className="hover:text-accent" style={{ color: "#8A5526" }}>
              {t("v2.detall.breadcrumb.biblioteca")}
            </a>
            <span className="mx-3" style={{ color: "#C9B89A" }}>/</span>
            <a href="/informes" className="hover:text-accent" style={{ color: "#8A5526" }}>
              {t("v2.detall.breadcrumb.informes")}
            </a>
            <span className="mx-3" style={{ color: "#C9B89A" }}>/</span>
            <span style={{ color: "#2C1810" }}>{report.title}</span>
          </div>
          <div
            className="hidden font-mono text-[10px] font-semibold uppercase sm:block"
            style={{ letterSpacing: "0.16em", color: "#8A5526" }}
          >
            {t("v2.detall.breadcrumb.right")}
          </div>
        </div>

        {/* LAYOUT: 280px sidebar + main */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "minmax(0, 280px) minmax(0, 1fr)",
          }}
        >
          {/* SIDEBAR (sticky) */}
          <aside
            className="hidden border-r bg-background lg:block"
            style={{
              borderColor: "#C9B89A",
              position: "sticky",
              top: "64px",
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              padding: "40px 32px",
            }}
          >
            <div className="flex flex-col gap-8">
              {/* Índex */}
              <div className="flex flex-col gap-2.5">
                <div
                  className="font-mono text-[9px] font-semibold uppercase"
                  style={{ letterSpacing: "0.22em", color: "#8A5526" }}
                >
                  {t("v2.detall.sidebar.index_label")}
                </div>
                <nav className="flex flex-col">
                  {navItems.map((item) => {
                    const isActive = activeBloc === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToBloc(item.id)}
                        className="group grid items-baseline gap-2.5 border-b py-2 text-left transition-all hover:bg-accent/5 hover:pl-1.5"
                        style={{
                          gridTemplateColumns: "24px 1fr",
                          borderColor: "rgba(201, 184, 154, 0.5)",
                        }}
                      >
                        <span
                          className="font-mono text-[10px] font-medium"
                          style={{
                            color: isActive ? "#B87333" : "#8B7355",
                            fontWeight: isActive ? 600 : 500,
                          }}
                        >
                          {item.num}
                        </span>
                        <span
                          className="font-serif text-[13px] font-medium"
                          style={{
                            color: isActive ? "#5C3A1E" : "#2C1810",
                            fontWeight: isActive ? 600 : 500,
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {t(item.labelKey)}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mini semàfor (dark) */}
              <button
                onClick={() => setPopupOpen(true)}
                className="flex flex-col gap-2 text-left transition-transform hover:scale-[1.01]"
                style={{ background: "#2C1810", color: "#F5EFE6", padding: "16px" }}
                aria-label={t("v2.popup.eyebrow")}
              >
                <div
                  className="font-mono text-[8.5px] font-semibold uppercase"
                  style={{ color: "#D9A574", letterSpacing: "0.2em" }}
                >
                  {t("v2.detall.sidebar.semafor.label")}
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span
                    className="font-serif font-medium"
                    style={{
                      color: "#B87333",
                      fontSize: "40px",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                    }}
                  >
                    {t("v2.detall.sidebar.semafor.grade")}
                  </span>
                  <span
                    className="font-serif italic"
                    style={{ color: "#F5EFE6", fontSize: "14px" }}
                  >
                    {t("v2.detall.sidebar.semafor.label_text")}
                  </span>
                </div>
              </button>

              {/* Progress */}
              <div className="flex flex-col gap-1.5">
                <div
                  className="font-mono text-[8.5px] font-medium uppercase"
                  style={{ letterSpacing: "0.16em", color: "#8B7355" }}
                >
                  {t("v2.detall.sidebar.progress.label")}
                </div>
                <div
                  className="overflow-hidden"
                  style={{
                    height: "4px",
                    background: "rgba(201, 184, 154, 0.3)",
                  }}
                >
                  <div
                    style={{ height: "100%", background: "#B87333", width: "40%" }}
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div
            className="flex flex-col bg-background"
            style={{ padding: "40px 64px 60px 64px" }}
          >
            {/* Header (Bloc 1 fitxa tècnica) */}
            <header
              id="bloc-1"
              className="mb-10 border-b pb-6"
              style={{ borderBottom: "1px solid #2C1810", scrollMarginTop: "90px" }}
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className="font-mono text-[9.5px] font-semibold uppercase"
                  style={{
                    background: "rgba(92, 58, 30, 0.12)",
                    color: "#5C3A1E",
                    padding: "4px 10px",
                    letterSpacing: "0.16em",
                  }}
                >
                  {t("v2.detall.tag.regulacio")}
                </span>
                <span
                  className="font-mono text-[9.5px] font-semibold uppercase"
                  style={{
                    background: "rgba(92, 138, 92, 0.12)",
                    color: "#4A6B3A",
                    padding: "4px 10px",
                    letterSpacing: "0.16em",
                  }}
                >
                  {t("v2.detall.tag.gratis")}
                </span>
              </div>
              <h1
                className="mb-4 font-serif font-medium"
                style={{
                  color: "#2C1810",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  letterSpacing: "-0.022em",
                  lineHeight: 1.05,
                  maxWidth: "800px",
                }}
              >
                {t("v2.detall.title.pre")}{" "}
                <em
                  className="italic font-normal"
                  style={{ color: "#5C3A1E" }}
                >
                  {t("v2.detall.title.em")}
                </em>
              </h1>
              <div
                className="flex flex-wrap gap-8 font-mono text-[10px] font-medium uppercase"
                style={{ letterSpacing: "0.14em", color: "#8B7355" }}
              >
                <span style={{ color: "#2C1810", fontWeight: 600 }}>
                  {t("v2.detall.meta.comissio")}
                </span>
                <span>{t("v2.detall.meta.date")}</span>
                <span>{t("v2.detall.meta.pages")}</span>
                <span>{t("v2.detall.meta.platform")}</span>
              </div>
            </header>

            {/* Bloc 0: Semàfor (dark full-width band) */}
            <section
              id="bloc-0"
              className="grid items-center gap-10"
              style={{
                background: "#2C1810",
                color: "#F5EFE6",
                margin: "0 -64px",
                padding: "48px 64px",
                borderBottom: "1px solid #B87333",
                gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.5fr)",
                scrollMarginTop: "90px",
              }}
            >
              <div className="flex flex-col gap-4">
                <div
                  className="font-mono text-[11px] font-semibold uppercase"
                  style={{ color: "#D9A574", letterSpacing: "0.22em" }}
                >
                  {t("v2.detall.bloc0.label")}
                </div>
                <div className="flex items-baseline gap-5">
                  <span
                    className="font-serif font-normal"
                    style={{
                      color: "#B87333",
                      fontSize: "clamp(5rem, 9vw, 7.5rem)",
                      letterSpacing: "-0.04em",
                      lineHeight: 0.9,
                    }}
                  >
                    {t("v2.detall.bloc0.grade")}
                  </span>
                  <span
                    className="font-serif italic"
                    style={{ color: "#F5EFE6", fontSize: "1.75rem" }}
                  >
                    {t("v2.detall.bloc0.grade_label")}
                  </span>
                </div>
                <p
                  className="font-serif italic"
                  style={{
                    color: "rgba(245, 239, 230, 0.7)",
                    fontSize: "0.9375rem",
                    lineHeight: 1.5,
                    maxWidth: "400px",
                  }}
                >
                  {t("v2.detall.bloc0.desc")}
                </p>
              </div>

              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "1fr 1fr", gap: "12px 32px" }}
              >
                {semaforDims.map((dim) => (
                  <div
                    key={dim.id}
                    className="flex flex-col gap-1.5 border-b py-2.5"
                    style={{ borderColor: "rgba(217, 165, 116, 0.2)" }}
                  >
                    <div
                      className="grid items-center gap-3.5"
                      style={{ gridTemplateColumns: "110px 1fr auto" }}
                    >
                      <span
                        className="font-serif text-sm font-medium"
                        style={{ color: "#F5EFE6" }}
                      >
                        {dim.label}
                      </span>
                      <div className="flex gap-1.5">
                        {(["g", "y", "r"] as const).map((color) => {
                          const isActive = dim.status === color;
                          return (
                            <div
                              key={color}
                              style={{
                                width: "11px",
                                height: "11px",
                                borderRadius: "50%",
                                background: statusColor(color),
                                opacity: isActive ? 1 : 0.3,
                              }}
                              aria-hidden
                            />
                          );
                        })}
                      </div>
                      <span
                        className="font-mono text-[9px] font-medium uppercase"
                        style={{
                          color: statusColor(dim.status),
                          letterSpacing: "0.14em",
                        }}
                      >
                        {t(dim.statusKey)}
                      </span>
                    </div>
                    <p
                      className="font-sans"
                      style={{
                        color: "rgba(245, 239, 230, 0.6)",
                        fontSize: "11px",
                        lineHeight: 1.4,
                      }}
                    >
                      {t(dim.expKey)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bloc 2: 5 dades clau */}
            <section
              id="bloc-2"
              className="border-b py-8"
              style={{
                borderColor: "#C9B89A",
                scrollMarginTop: "90px",
              }}
            >
              <div className="mb-5 flex items-baseline gap-4">
                <span
                  className="font-mono text-[11px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.22em" }}
                >
                  {t("v2.detall.bloc2.label")}
                </span>
              </div>
              <h2
                className="mb-6 font-serif font-medium"
                style={{
                  color: "#2C1810",
                  fontSize: "1.75rem",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {t("v2.detall.bloc2.title")}
              </h2>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}
              >
                {dadesClau.map((dada, i) => (
                  <div
                    key={i}
                    className="grid items-baseline gap-4 border-b py-3.5"
                    style={{
                      gridTemplateColumns: "36px 1fr",
                      borderColor: "rgba(201, 184, 154, 0.5)",
                    }}
                  >
                    <span
                      className="font-mono text-[11px] font-semibold"
                      style={{ color: "#B87333" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p
                      className="font-sans"
                      style={{
                        color: "#2C1810",
                        fontSize: "0.875rem",
                        lineHeight: 1.45,
                      }}
                    >
                      <strong
                        className="font-serif"
                        style={{
                          color: "#5C3A1E",
                          fontWeight: 600,
                          fontSize: "1.125rem",
                        }}
                      >
                        {t(dada.strongKey)}
                      </strong>
                      {t(dada.textKey)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bloc 3: Resum executiu */}
            <section
              id="bloc-3"
              className="border-b py-8"
              style={{
                borderColor: "#C9B89A",
                scrollMarginTop: "90px",
              }}
            >
              <div className="mb-5 flex items-baseline gap-4">
                <span
                  className="font-mono text-[11px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.22em" }}
                >
                  {t("v2.detall.bloc3.label")}
                </span>
              </div>
              <h2
                className="mb-5 font-serif font-medium"
                style={{
                  color: "#2C1810",
                  fontSize: "1.75rem",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {t("v2.detall.bloc3.title")}{" "}
                <em
                  className="italic font-normal"
                  style={{ color: "#5C3A1E" }}
                >
                  {t("v2.detall.bloc3.title.em")}
                </em>
              </h2>
              <div
                className="font-serif"
                style={{
                  color: "#2C1810",
                  fontSize: "1.0625rem",
                  lineHeight: 1.6,
                  maxWidth: "720px",
                }}
              >
                <p className="mb-4">{t("v2.detall.bloc3.body1")}</p>
                <p>
                  {t("v2.detall.bloc3.body2")}{" "}
                  <em
                    className="italic"
                    style={{ color: "#5C3A1E" }}
                  >
                    {t("v2.detall.bloc3.body3.em")}
                  </em>
                </p>
              </div>
            </section>

            {/* Bloc 4: Implicacions + Més enllà */}
            <section
              id="bloc-4"
              className="border-b py-8"
              style={{
                borderColor: "#C9B89A",
                scrollMarginTop: "90px",
              }}
            >
              <div className="mb-5 flex items-baseline gap-4">
                <span
                  className="font-mono text-[11px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.22em" }}
                >
                  {t("v2.detall.bloc4.label")}
                </span>
              </div>
              <h2
                className="mb-6 font-serif font-medium"
                style={{
                  color: "#2C1810",
                  fontSize: "1.75rem",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {t("v2.detall.bloc4.title.pre")}{" "}
                <em
                  className="italic font-normal"
                  style={{ color: "#5C3A1E" }}
                >
                  {t("v2.detall.bloc4.title.em")}
                </em>
              </h2>

              {/* 3 implicacions */}
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { labelKey: "v2.detall.bloc4.empresas.label", textKey: "v2.detall.bloc4.empresas.text", color: "#5C3A1E" },
                  { labelKey: "v2.detall.bloc4.reguladors.label", textKey: "v2.detall.bloc4.reguladors.text", color: "#B87333" },
                  { labelKey: "v2.detall.bloc4.ciutadans.label", textKey: "v2.detall.bloc4.ciutadans.text", color: "#E8C99A" },
                ].map((imp, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-2 py-4"
                    style={{ borderTop: `2px solid ${imp.color}` }}
                  >
                    <span
                      className="font-mono text-[10px] font-semibold uppercase"
                      style={{
                        color: idx === 2 ? "#8A6D2B" : imp.color,
                        letterSpacing: "0.2em",
                      }}
                    >
                      {t(imp.labelKey as never)}
                    </span>
                    <p
                      className="font-sans"
                      style={{
                        color: "#2C1810",
                        fontSize: "0.8125rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {t(imp.textKey as never)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Subsecció Més enllà del Checkbox (dark) */}
              <div
                className="mt-7 p-7"
                style={{
                  background: "#2C1810",
                  color: "#F5EFE6",
                  borderLeft: "4px solid #B87333",
                }}
              >
                <div
                  className="mb-3 font-mono text-[9.5px] font-semibold uppercase"
                  style={{ color: "#D9A574", letterSpacing: "0.22em" }}
                >
                  {t("v2.detall.bloc4.mes.label")}
                </div>
                <p
                  className="font-serif italic"
                  style={{
                    color: "#F5EFE6",
                    fontSize: "1.125rem",
                    lineHeight: 1.4,
                    maxWidth: "720px",
                  }}
                >
                  {t("v2.detall.bloc4.mes.question")}{" "}
                  <em
                    className="not-italic font-medium"
                    style={{ color: "#D9A574" }}
                  >
                    {t("v2.detall.bloc4.mes.question.em")}
                  </em>
                  {t("v2.detall.bloc4.mes.question.post")}
                </p>
                <p
                  className="mt-4 border-t pt-4 font-sans"
                  style={{
                    color: "rgba(245, 239, 230, 0.75)",
                    fontSize: "0.875rem",
                    lineHeight: 1.55,
                    borderColor: "rgba(217, 165, 116, 0.25)",
                  }}
                >
                  {t("v2.detall.bloc4.mes.reflection")}{" "}
                  <em
                    className="italic font-medium"
                    style={{ color: "#D9A574" }}
                  >
                    {t("v2.detall.bloc4.mes.reflection.em")}
                  </em>
                  {t("v2.detall.bloc4.mes.reflection.post")}
                </p>
              </div>
            </section>

            {/* Bloc 5: Connexions */}
            <section
              id="bloc-5"
              className="border-b py-8"
              style={{
                borderColor: "#C9B89A",
                scrollMarginTop: "90px",
              }}
            >
              <div className="mb-5 flex items-baseline gap-4">
                <span
                  className="font-mono text-[11px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.22em" }}
                >
                  {t("v2.detall.bloc5.label")}
                </span>
              </div>
              <h2
                className="mb-5 font-serif font-medium"
                style={{
                  color: "#2C1810",
                  fontSize: "1.75rem",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {t("v2.detall.bloc5.title.pre")}{" "}
                <em
                  className="italic font-normal"
                  style={{ color: "#5C3A1E" }}
                >
                  {t("v2.detall.bloc5.title.em")}
                </em>
              </h2>
              <p
                className="font-serif"
                style={{
                  color: "#2C1810",
                  fontSize: "1rem",
                  lineHeight: 1.55,
                  maxWidth: "720px",
                }}
              >
                {t("v2.detall.bloc5.body.pre")}
                <strong
                  className="font-semibold"
                  style={{ color: "#5C3A1E" }}
                >
                  {t("v2.detall.bloc5.body.strong")}
                </strong>
                {t("v2.detall.bloc5.body.post")}
              </p>
            </section>

            {/* Bloc 6: Accions recomanades (banda coure clar) */}
            <section
              id="bloc-6"
              style={{
                background: "rgba(184, 115, 51, 0.06)",
                margin: "0 -64px",
                padding: "48px 64px",
                borderTop: "1px solid #B87333",
                borderBottom: "1px solid #B87333",
                scrollMarginTop: "90px",
              }}
            >
              <div className="mb-5 flex items-baseline gap-4">
                <span
                  className="font-mono text-[11px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.22em" }}
                >
                  {t("v2.detall.bloc6.label")}
                </span>
              </div>
              <h2
                className="mb-6 font-serif font-medium"
                style={{
                  color: "#2C1810",
                  fontSize: "1.75rem",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {t("v2.detall.bloc6.title.pre")}{" "}
                <em
                  className="italic font-normal"
                  style={{ color: "#5C3A1E" }}
                >
                  {t("v2.detall.bloc6.title.em")}
                </em>
              </h2>
              <div className="grid gap-8 sm:grid-cols-3">
                {[
                  { num: "1", textKey: "v2.detall.bloc6.a1" },
                  { num: "2", textKey: "v2.detall.bloc6.a2" },
                  { num: "3", textKey: "v2.detall.bloc6.a3" },
                ].map((accio) => (
                  <div key={accio.num} className="flex flex-col gap-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full font-serif text-xl font-semibold"
                      style={{
                        background: "#B87333",
                        color: "#FFFFFF",
                      }}
                    >
                      {accio.num}
                    </div>
                    <p
                      className="font-sans font-medium"
                      style={{
                        color: "#2C1810",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {t(accio.textKey as never)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bloc 7: Cross-reference */}
            <section
              id="bloc-7"
              className="py-8"
              style={{ scrollMarginTop: "90px" }}
            >
              <div className="mb-5 flex items-baseline gap-4">
                <span
                  className="font-mono text-[11px] font-semibold uppercase"
                  style={{ color: "#B87333", letterSpacing: "0.22em" }}
                >
                  {t("v2.detall.bloc7.label")}
                </span>
              </div>
              <h2
                className="mb-5 font-serif font-medium"
                style={{
                  color: "#2C1810",
                  fontSize: "1.75rem",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.15,
                }}
              >
                {t("v2.detall.bloc7.title.pre")}{" "}
                <em
                  className="italic font-normal"
                  style={{ color: "#5C3A1E" }}
                >
                  {t("v2.detall.bloc7.title.em")}
                </em>
              </h2>

              <div className="overflow-x-auto">
                <table
                  className="w-full border-collapse"
                  style={{ marginTop: "16px" }}
                >
                  <thead>
                    <tr>
                      {[
                        t("v2.detall.bloc7.col.cert"),
                        t("v2.detall.bloc7.col.cat"),
                        t("v2.detall.bloc7.col.how"),
                        t("v2.detall.bloc7.col.impact"),
                      ].map((header, i) => (
                        <th
                          key={i}
                          className="px-4 py-3 text-left font-mono text-[9.5px] font-semibold uppercase"
                          style={{
                            background: "#5C3A1E",
                            color: "#F5EFE6",
                            letterSpacing: "0.18em",
                          }}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {xrefRows.map((row, idx) => {
                      // Gating Premium: 3 primeres files visibles, resta blurred
                      const isBlurred = idx >= 3 && !isPremiumUser;
                      const badge = impactBadge(row.impact);
                      return (
                        <tr
                          key={idx}
                          className="border-b transition-colors hover:bg-accent/5"
                          style={{
                            borderColor: "#C9B89A",
                            filter: isBlurred ? "blur(3px)" : "none",
                            opacity: isBlurred ? 0.5 : 1,
                            pointerEvents: isBlurred ? "none" : "auto",
                          }}
                        >
                          <td
                            className="px-4 py-3.5 font-serif text-[15px] font-medium"
                            style={{ color: "#2C1810" }}
                          >
                            {t(row.certKey as never)}
                          </td>
                          <td
                            className="px-4 py-3.5 font-mono text-[9px] font-medium uppercase"
                            style={{
                              color: "#8B7355",
                              letterSpacing: "0.14em",
                            }}
                          >
                            {t(row.catKey as never)}
                          </td>
                          <td
                            className="px-4 py-3.5 font-sans text-[13px]"
                            style={{
                              color: "#2C1810",
                              lineHeight: 1.4,
                            }}
                          >
                            {t(row.textKey as never)}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className="inline-block font-mono text-[10px] font-semibold uppercase"
                              style={{
                                background: badge.bg,
                                color: badge.color,
                                padding: "4px 10px",
                                letterSpacing: "0.14em",
                              }}
                            >
                              {badge.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Premium overlay hint si no premium */}
              {!isPremiumUser && (
                <div className="mt-4 flex items-center justify-between rounded-md border border-rule bg-card p-4">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-accent" />
                    <span
                      className="font-serif text-sm"
                      style={{ color: "#5C3A1E" }}
                    >
                      3 files més visibles només per a usuaris Premium
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setPreusOpen(true)}
                  >
                    Fes-te Premium
                  </Button>
                </div>
              )}
            </section>

            {/* Footer informe */}
            <footer
              className="mt-12 flex flex-wrap items-baseline justify-between gap-4 border-t py-6"
              style={{ borderColor: "#2C1810" }}
            >
              <p
                className="font-serif italic"
                style={{ color: "#5C3A1E", fontSize: "0.875rem" }}
              >
                {t("v2.detall.footer.text")}
              </p>
              <div className="flex gap-4">
                <a
                  href="/informes"
                  className="font-mono text-[10px] font-medium uppercase hover:text-accent"
                  style={{
                    color: "#8A5526",
                    letterSpacing: "0.16em",
                    borderBottom: "1px solid #B87333",
                    paddingBottom: "4px",
                  }}
                >
                  {t("v2.detall.footer.prev")}
                </a>
                <a
                  href="/informes"
                  className="font-mono text-[10px] font-medium uppercase hover:text-accent"
                  style={{
                    color: "#8A5526",
                    letterSpacing: "0.16em",
                    borderBottom: "1px solid #B87333",
                    paddingBottom: "4px",
                  }}
                >
                  {t("v2.detall.footer.next")}
                </a>
              </div>
            </footer>
          </div>
        </div>
      </main>

      <Footer />
      {dialogs}
    </div>
  );
}
