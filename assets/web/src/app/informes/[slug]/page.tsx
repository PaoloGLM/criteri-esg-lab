"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { SemaforoPopup } from "@/components/sections/semaforo-popup";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import {
  reports,
  isFreeAccess,
  formatDate,
  getTypeLabel,
  getScopeLabel,
  getGradeColor,
  type SemaforStatus,
  type Report,
  type ReportBlock,
} from "@/lib/reports";
import { getReportContent } from "@/lib/reports-content";
import {
  FileText,
  TrendingUp,
  Layers,
  Target,
  Network,
  ClipboardCheck,
  Gauge,
  Compass,
  ExternalLink,
  Lock,
  BookOpen,
  ArrowRight,
  Check,
  Crown,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function InformeSlugPage() {
  const { lang } = useLanguage();
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

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };
  const [preusOpen, setPreusOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const report = reports.find((r) => r.slug === slug);

  // Els diàlegs sempre es renderitzen (estables entre renders)
  const dialogs = (
    <>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => openAuth("register")}
      />
    </>
  );

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header
          onOpenPreus={() => setPreusOpen(true)}
        />
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <p className="eyebrow mb-3">404 — INFORME NO TROBAT</p>
            <h1 className="mb-4 font-serif text-3xl font-semibold text-primary">
              {lang === "ca" ? "Aquest informe no existeix." : "Este informe no existe."}
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-foreground/70">
              {lang === "ca"
                ? "No hem trobat cap informe amb aquest identificador. Torna a la biblioteca per veure el catàleg complet."
                : "No hemos encontrado ningún informe con este identificador. Vuelve a la biblioteca para ver el catálogo completo."}
            </p>
            <Button asChild className="mt-6">
              <a href="/informes">
                {lang === "ca" ? "Tornar a la biblioteca" : "Volver a la biblioteca"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </main>
        <FooterV1 />
        {dialogs}
      </div>
    );
  }

  const content = getReportContent(slug, lang);
  const isProbeReport = slug === "revisio-esrs-maig-2026";
  const isFree = isFreeAccess(report.date);
  const showFreeBadge = isProbeReport || isFree;

  // Lògica d'accés:
  // - Informe pilot (revisio-esrs-maig-2026): accés lliure
  // - Informe > 6 mesos: requereix registre (o sessió iniciada)
  // - Informe recent (< 6 mesos): requereix Premium
  // - Usuari Premium: accés total, mai bloquejat
  const isPremiumUser = !!user && plan === "premium";
  const isLoggedUser = !!user;
  const isLockedPremium = !isProbeReport && !isFree && !isPremiumUser;
  const isLockedRegister =
    !isProbeReport && isFree && !isRegistered && !isLoggedUser;
  const isLocked = isLockedPremium || isLockedRegister;

  // Determina la variant de l'upgrade bloc quan està bloquejat per Premium:
  // - Variant A: visitant no loguejat → mostra "Crea compte" + "Fes-te Premium"
  // - Variant C: usuari gratuït loguejat → mostra només "Fes-te Premium"
  const upgradeVariant: "A" | "C" = isLoggedUser ? "C" : "A";

  const handleRegister = () => {
    // Simulació: en clicar per registrar-se, ja es considera registrat
    setIsRegistered(true);
    openAuth("register");
  };

  const articleJsonLd = report
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: report.title,
        author: {
          "@type": "Organization",
          name: "Criteri ESG",
        },
        publisher: {
          "@type": "Organization",
          name: "Criteri ESG",
          logo: {
            "@type": "ImageObject",
            url: "https://criteriesg.com/logo.svg",
          },
        },
        datePublished: report.date,
        dateModified: report.date,
        description: report.summary,
        about: report.tags.join(", "),
        inLanguage: lang === "ca" ? "ca" : "es",
        isPartOf: {
          "@type": "WebSite",
          name: "Criteri ESG",
          url: "https://criteriesg.com",
        },
        mainEntityOfPage: `https://criteriesg.com/informes/${report.slug}`,
        image: "https://criteriesg.com/og-image.png",
      }
    : null;

  // A4: BreadcrumbList (Inici → Informes → títol de l'informe)
  const breadcrumbJsonLd = report
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inici", item: "https://criteriesg.com" },
          { "@type": "ListItem", position: 2, name: lang === "ca" ? "Informes" : "Informes", item: "https://criteriesg.com/informes" },
          { "@type": "ListItem", position: 3, name: report.title },
        ],
      }
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <Header
        onOpenPreus={() => setPreusOpen(true)}
      />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-rule px-6 py-4 lg:px-8" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl flex justify-between items-baseline">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: "#4A5F53" }}>
              <a href="/informes" style={{ color: "#3F6653" }}>Biblioteca</a>
              <span style={{ color: "#D8E2DA", margin: "0 12px" }}>/</span>
              <a href="/informes" style={{ color: "#3F6653" }}>Informes</a>
              <span style={{ color: "#D8E2DA", margin: "0 12px" }}>/</span>
              <span style={{ color: "#26312B" }}>{report.title}</span>
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#3F6653" }}>5 min · 8 bloques</span>
          </div>
        </div>

        {/* Layout: sidebar + main */}
        <div className="grid lg:grid-cols-[280px_1fr]">
          {/* SIDEBAR */}
          <aside className="sticky top-[70px] hidden h-[calc(100vh-70px)] flex-col gap-8 overflow-y-auto p-10 lg:flex" style={{ background: "#F2F5F1", borderRight: "1px solid #D8E2DA" }}>
            <div className="flex flex-col gap-2.5">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{lang === "ca" ? "Índex de l'informe" : "Índice del informe"}</p>
              <nav className="flex flex-col">
                {[
                  { num: "00", name: lang === "ca" ? "Semàfor metodològic" : "Semáforo metodológico" },
                  { num: "01", name: lang === "ca" ? "Fitxa tècnica" : "Ficha técnica" },
                  { num: "02", name: lang === "ca" ? "5 dades clau" : "5 datos clave" },
                  { num: "03", name: lang === "ca" ? "Resum executiu" : "Resumen ejecutivo" },
                  { num: "04", name: lang === "ca" ? "Implicacions" : "Implicaciones" },
                  { num: "05", name: lang === "ca" ? "Connexions" : "Conexiones" },
                  { num: "06", name: lang === "ca" ? "Accions recomanades" : "Acciones recomendadas" },
                  { num: "07", name: "Cross-reference" },
                ].map((item) => (
                  <a key={item.num} href={`#bloc-${item.num}`} className="grid grid-cols-[24px_1fr] gap-2.5 items-baseline py-2 border-b" style={{ borderBottomColor: "rgba(201,184,154,0.5)", textDecoration: "none" }}>
                    <span className="font-mono text-[10px] font-medium" style={{ color: "#4A5F53" }}>{item.num}</span>
                    <span className="font-serif text-[13px] font-medium text-primary">{item.name}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Mini semàfor */}
            {content?.semafor && (
              <div className="p-4 flex flex-col gap-2" style={{ background: "#26312B", color: "#F2F5F1" }}>
                <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#AAC9B6" }}>{lang === "ca" ? "Semàfor" : "Semáforo"}</p>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serif text-4xl font-normal" style={{ color: getGradeColor(content.semafor.grade), letterSpacing: "-0.04em" }}>{content.semafor.grade}</span>
                  <span className="font-serif text-sm italic" style={{ color: "#F2F5F1" }}>{content.semafor.gradeLabel}</span>
                </div>
              </div>
            )}

            {/* Progress */}
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] font-medium" style={{ color: "#4A5F53" }}>{lang === "ca" ? "Lectura · 5 min" : "Lectura · 5 min"}</p>
              <div className="h-1 overflow-hidden" style={{ background: "rgba(201,184,154,0.3)" }}>
                <div className="h-full" style={{ background: "#5E8772", width: "40%" }} />
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="p-8 lg:p-12" style={{ background: "#F2F5F1" }}>
            {/* Header de l'informe (fitxa tècnica) */}
            <header className="border-b border-primary pb-6 mb-10" id="bloc-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "rgba(92,58,30,0.12)", color: "#141B18" }}>{getTypeLabel(report.type)}</span>
                {showFreeBadge ? (
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "rgba(92,138,92,0.12)", color: "#4A6B3A" }}>{lang === "ca" ? "Gratis" : "Gratis"}</span>
                ) : (
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1" style={{ background: "#5E8772", color: "white" }}>Premium</span>
                )}
              </div>
              <h1 className="mb-4 font-serif text-4xl font-medium leading-tight text-primary" style={{ letterSpacing: "-0.022em" }}>{report.title}</h1>
              <div className="flex flex-wrap gap-8 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#4A5F53" }}>
                <span><strong className="text-primary">{report.institution}</strong></span>
                <span>{formatDate(report.date, lang)}</span>
                <span>{report.pages} {lang === "ca" ? "pàg" : "pág"}</span>
                <span>{getScopeLabel(report.scope)}</span>
              </div>
            </header>

            {/* Cos: pantalla de bloqueig (registre), preview+upgrade (Premium), o 8 blocs */}
            {isLockedRegister ? (
          // Informe > 6 mesos, cal registre — pantalla genèrica simple
          <LockScreen
            isPremium={false}
            lang={lang}
            onRegister={handleRegister}
            onPreus={() => setPreusOpen(true)}
          />
        ) : isLockedPremium && content ? (
          // Informe recent (< 6 mesos), no Premium — preview + upgrade bloc contextual
          <UpgradePreview
            report={report}
            content={content}
            lang={lang}
            variant={upgradeVariant}
            onRegister={handleRegister}
            onPreus={() => setPreusOpen(true)}
          />
        ) : !content ? (
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-md border border-rule bg-card p-8 text-center">
              <p className="font-serif text-lg text-foreground/80">
                {lang === "ca"
                  ? "El contingut complet d'aquest informe encara no està disponible."
                  : "El contenido completo de este informe aún no está disponible."}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {/* Bloc 0 — Semáforo (dark, full-width) amb explicacions + link popup */}
            <section id="bloc-0" className="scroll-mt-20" style={{ background: "#26312B", color: "#F2F5F1", margin: "0 -32px", padding: "48px 32px" }}>
              <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
                <div className="flex flex-col gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#AAC9B6" }}>{lang === "ca" ? "Bloc 0 · Semàfor metodològic" : "Bloque 0 · Semáforo metodológico"}</p>
                  <div className="flex items-baseline gap-4">
                    <span className="font-serif text-[100px] font-normal leading-none" style={{ color: getGradeColor(content.semafor.grade), letterSpacing: "-0.04em" }}>{content.semafor.grade}</span>
                    <span className="font-serif text-2xl italic" style={{ color: "#F2F5F1" }}>{content.semafor.gradeLabel}</span>
                  </div>
                  <button onClick={() => setPopupOpen(true)} className="self-start font-mono text-[10px] uppercase tracking-[0.14em] font-semibold mt-2" style={{ color: "#AAC9B6", borderBottom: "1px solid #5E8772", paddingBottom: "3px" }}>
                    {lang === "ca" ? "Com es valora el semàfor? →" : "¿Cómo se valora el semáforo? →"}
                  </button>
                </div>
                <div className="flex flex-col gap-0">
                  {content.semafor.indicators.map((ind) => (
                    <div key={ind.name} className="flex flex-col gap-1 py-3 border-b" style={{ borderBottomColor: "rgba(217,165,116,0.2)" }}>
                      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                        <span className="font-serif text-base font-medium" style={{ color: "#F2F5F1" }}>{ind.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full" style={{ background: "#5C8A5C", opacity: ind.status === "verd" ? 1 : 0.3 }} />
                            <span className="w-3 h-3 rounded-full" style={{ background: "#C9A961", opacity: ind.status === "groc" ? 1 : 0.3 }} />
                            <span className="w-3 h-3 rounded-full" style={{ background: "#A0522D", opacity: ind.status === "vermell" ? 1 : 0.3 }} />
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-[0.14em] font-semibold" style={{ color: ind.status === "verd" ? "#5C8A5C" : ind.status === "groc" ? "#C9A961" : "#A0522D" }}>{ind.label}</span>
                        </div>
                      </div>
                      <p className="text-[12px] leading-relaxed mt-1" style={{ color: "rgba(245,239,230,0.55)" }}>{ind.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bloc 2 — 5 dades clau */}
            <section id="bloc-2" className="scroll-mt-20 py-8 border-b" style={{ borderColor: "#D8E2DA" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#5E8772" }}>{lang === "ca" ? "Bloc 02 · 5 dades clau" : "Bloque 02 · 5 datos clave"}</p>
              <h2 className="mb-6 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "El que diu l'informe, en xifres" : "Lo que dice el informe, en cifras"}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.dadesClau.map((d, i) => (
                  <div key={i} className="grid grid-cols-[24px_1fr] gap-3 items-baseline py-3 border-b" style={{ borderBottomColor: "rgba(201,184,154,0.5)" }}>
                    <span className="font-mono text-[11px] font-semibold" style={{ color: "#5E8772" }}>{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-sm text-primary"><strong className="font-serif text-lg font-semibold" style={{ color: "#141B18" }}>{d.value}</strong> {d.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bloc 3 — Resum executiu */}
            <section id="bloc-3" className="scroll-mt-20 py-8 border-b" style={{ borderColor: "#D8E2DA" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#5E8772" }}>{lang === "ca" ? "Bloc 03 · Resum executiu" : "Bloque 03 · Resumen ejecutivo"}</p>
              <h2 className="mb-4 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "Qu\u00e8 diu en llenguatge clar" : "Qu\u00e9 dice en lenguaje claro"}</h2>
              <p className="font-serif text-base leading-relaxed text-primary">{content.resumExecutiu}</p>
            </section>

            {/* Bloc 4 — Implicacions + M\u00e9s enll\u00e0 */}
            <section id="bloc-4" className="scroll-mt-20 py-8 border-b" style={{ borderColor: "#D8E2DA" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#5E8772" }}>{lang === "ca" ? "Bloc 04 · Implicacions" : "Bloque 04 · Implicaciones"}</p>
              <h2 className="mb-6 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "Per a empreses, reguladors, ciutadans" : "Para empresas, reguladores, ciudadanos"}</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="flex flex-col gap-2 pt-4 border-t-2" style={{ borderTopColor: "#141B18" }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#141B18" }}>{lang === "ca" ? "Empreses" : "Empresas"}</span>
                  <p className="text-[13px] leading-relaxed text-primary">{content.implicacions.empreses}</p>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t-2" style={{ borderTopColor: "#5E8772" }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#5E8772" }}>{lang === "ca" ? "Reguladors" : "Reguladores"}</span>
                  <p className="text-[13px] leading-relaxed text-primary">{content.implicacions.reguladors}</p>
                </div>
                <div className="flex flex-col gap-2 pt-4 border-t-2" style={{ borderTopColor: "#AAC9B6" }}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "#8A6D2B" }}>{lang === "ca" ? "Ciutadans" : "Ciudadanos"}</span>
                  <p className="text-[13px] leading-relaxed text-primary">{content.implicacions.ciutadans}</p>
                </div>
              </div>
              <div className="mt-6 p-6" style={{ background: "#26312B", color: "#F2F5F1", borderLeft: "4px solid #5E8772" }}>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#AAC9B6" }}>{lang === "ca" ? "Més enllà del Checkbox" : "Más allá del Checkbox"}</p>
                <p className="font-serif text-lg italic" style={{ color: "#F2F5F1" }}>{content.mesEnllaCheckbox.criteri}</p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(245,239,230,0.75)" }}>{content.mesEnllaCheckbox.body}</p>
              </div>
            </section>

            {/* Bloc 5 — Connexions */}
            <section id="bloc-5" className="scroll-mt-20 py-8 border-b" style={{ borderColor: "#D8E2DA" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#5E8772" }}>{lang === "ca" ? "Bloc 05 · Connexions" : "Bloque 05 · Conexiones"}</p>
              <h2 className="mb-4 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "Relacions amb altres informes" : "Relaciones con otros informes"}</h2>
              <div className="space-y-3">
                {content.connexions.map((c, i) => (
                  <div key={i} className="border p-4" style={{ borderColor: "#D8E2DA", background: "white" }}>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-2 py-0.5" style={{ background: c.type.includes("Contrad") ? "rgba(160,82,45,0.15)" : c.type.includes("Complement") ? "rgba(92,138,92,0.15)" : "rgba(184,115,51,0.12)", color: c.type.includes("Contrad") ? "#A0522D" : c.type.includes("Complement") ? "#4A6B3A" : "#3F6653" }}>{c.type}</span>
                      <span className="font-serif text-sm font-semibold text-primary">{c.target}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#141B18" }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bloc 6 — Accions recomanades (destacat) */}
            <section id="bloc-6" className="scroll-mt-20" style={{ background: "rgba(184,115,51,0.06)", margin: "0 -32px", padding: "48px 32px", borderTop: "1px solid #5E8772", borderBottom: "1px solid #5E8772" }}>
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#5E8772" }}>{lang === "ca" ? "Bloc 06 · Accions recomanades ⭐" : "Bloque 06 · Acciones recomendadas ⭐"}</p>
              <h2 className="mb-6 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "3 accions operatives per aquesta setmana" : "3 acciones operativas para esta semana"}</h2>
              <div className="grid gap-8 sm:grid-cols-3">
                {content.accions.map((a) => (
                  <div key={a.num} className="flex flex-col gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-serif text-xl font-semibold text-white" style={{ background: "#5E8772" }}>{a.num}</div>
                    <p className="text-sm font-medium leading-relaxed text-primary">{a.desc || a.title}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bloc 7 — Cross-reference */}
            <section id="bloc-7" className="scroll-mt-20 py-8">
              <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#5E8772" }}>{lang === "ca" ? "Bloc 07 · Cross-reference ⭐" : "Bloque 07 · Cross-reference ⭐"}</p>
              <h2 className="mb-4 font-serif text-2xl font-medium text-primary">{lang === "ca" ? "Com t'afecta segons les teves certificacions" : "C\u00f3mo te afecta seg\u00fan tus certificaciones"}</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3" style={{ background: "#141B18", color: "#F2F5F1" }}>{lang === "ca" ? "Certificació" : "Certificación"}</th>
                    <th className="text-left font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3" style={{ background: "#141B18", color: "#F2F5F1" }}>{lang === "ca" ? "Com t'afecta" : "C\u00f3mo te afecta"}</th>
                    <th className="text-left font-mono text-[9.5px] uppercase tracking-[0.18em] font-semibold p-3" style={{ background: "#141B18", color: "#F2F5F1" }}>{lang === "ca" ? "Impacte" : "Impacto"}</th>
                  </tr>
                </thead>
                <tbody>
                  {content.crossRefs.map((cr, i) => (
                    <tr key={i} className="border-b" style={{ borderBottomColor: "#D8E2DA" }}>
                      <td className="p-3.5"><span className="font-serif text-[15px] font-semibold text-primary">{cr.framework}</span></td>
                      <td className="p-3.5 text-[13px] leading-relaxed" style={{ color: "#26312B" }}>{cr.criterion}</td>
                      <td className="p-3.5"><span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1" style={{ background: cr.impact === "Alto" || cr.impact === "Alt" ? "rgba(160,82,45,0.15)" : cr.impact === "Medio" || cr.impact === "Mitj\u00e0" ? "rgba(201,169,97,0.18)" : "rgba(139,115,85,0.1)", color: cr.impact === "Alto" || cr.impact === "Alt" ? "#A0522D" : cr.impact === "Medio" || cr.impact === "Mitj\u00e0" ? "#8A6D2B" : "#4A5F53" }}>{cr.impact}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t flex justify-between items-baseline" style={{ borderTopColor: "#26312B" }}>
              <p className="font-serif text-sm italic" style={{ color: "#141B18" }}>5 minutos de lectura. 8 bloques que cambian tu criterio sobre un informe de {report.pages} p\u00e1ginas.</p>
              <button onClick={() => window.open(report.url, "_blank")} className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#3F6653", borderBottom: "1px solid #5E8772", paddingBottom: "4px" }}>{lang === "ca" ? "Veure font original \u2192" : "Ver fuente original \u2192"}</button>
            </div>
          </div>
        )}
          </div>
        </div>

        {/* Disclaimer IA */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center font-serif text-xs italic leading-relaxed text-foreground/60">
            Criteri ESG aplica un flux de doble revisió per a cada informe: GLM redacta, Gemini fa d&apos;advocat del diable, i l&apos;equip humà valida sempre cada bloc abans de publicar.
          </p>
        </div>
      </main>
      <FooterV1 />
      {dialogs}
      <SemaforoPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function Bloc({
  num,
  icon,
  title,
  children,
  highlighted,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <section
      className={`rounded-md border p-5 ${
        highlighted ? "border-accent bg-accent-soft/10" : "border-rule bg-card"
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-xs text-accent-deep">{num}</span>
        <span className="text-accent-deep">{icon}</span>
        <h2 className="font-serif text-lg font-semibold text-primary">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Datum({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-primary">{value}</p>
    </div>
  );
}

function ImplicationBlock({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-md border border-rule bg-background p-4">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-accent-deep">
        {label}
      </p>
      <p className="text-xs leading-relaxed text-foreground/80">{body}</p>
    </div>
  );
}

function SemaforRow({
  name,
  status,
  label,
  note,
}: {
  name: string;
  status: SemaforStatus;
  label: string;
  note: string;
}) {
  const color =
    status === "verd"
      ? "bg-[#5C8A5C]"
      : status === "groc"
        ? "bg-[#C9A961]"
        : "bg-[#A0522D]";
  return (
    <div className="flex items-start gap-3 rounded-sm border border-rule bg-background px-3 py-2">
      <span
        className={`mt-0.5 inline-block h-3 w-3 flex-shrink-0 rounded-full ${color}`}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-medium text-primary">{name}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
            {label}
          </span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-foreground/70">{note}</p>
      </div>
    </div>
  );
}

function LockScreen({
  isPremium,
  lang,
  onRegister,
  onPreus,
}: {
  isPremium: boolean;
  lang: "ca" | "es";
  onRegister: () => void;
  onPreus: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-md border border-accent bg-accent-soft/10 p-8 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Lock className="h-5 w-5" />
        </div>
        {isPremium ? (
          <>
            <p className="eyebrow mb-3">PREMIUM</p>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-primary">
              {lang === "ca"
                ? "Aquest informe requereix Premium"
                : "Este informe requiere Premium"}
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-foreground/75">
              {lang === "ca"
                ? "Els informes publicats fa menys de 6 mesos són exclusius per a subscriptors Premium. Crea el teu compte per accedir a tota la biblioteca, cross-references i accions recomanades."
                : "Los informes publicados hace menos de 6 meses son exclusivos para suscriptores Premium. Crea tu cuenta para acceder a toda la biblioteca, cross-references y acciones recomendadas."}
            </p>
            <Button onClick={onPreus} size="lg">
              {lang === "ca" ? "Veure preus" : "Ver precios"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <p className="eyebrow mb-3">
              {lang === "ca" ? "REGISTRE GRATUÏT" : "REGISTRO GRATUITO"}
            </p>
            <h2 className="mb-3 font-serif text-2xl font-semibold text-primary">
              {lang === "ca"
                ? "Cal registrar-se per veure aquest informe"
                : "Es necesario registrarse para ver este informe"}
            </h2>
            <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-foreground/75">
              {lang === "ca"
                ? "Aquest informe és d'accés obert per a usuaris registrats. Crea un compte gratuït per accedir als 8 blocs: semàfor, fitxa tècnica, dades clau, resum executiu i accions recomanades."
                : "Este informe es de acceso abierto para usuarios registrados. Crea una cuenta gratis para acceder a los 8 bloques: semáforo, ficha técnica, datos clave, resumen ejecutivo y acciones recomendadas."}
            </p>
            <Button onClick={onRegister} size="lg">
              {lang === "ca" ? "Registra't gratis" : "Regístrate gratis"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UPGRADE PREVIEW — per a informes Premium bloquejats
// ---------------------------------------------------------------------------
// Quan un visitant (o usuari gratuït) obre un informe recent (< 6 mesos),
// en lloc de mostrar la pantalla genèrica de LockScreen, mostrem:
//   - Bloc 0 (Semàfor Metodològic) complet — el gancho visual
//   - Bloc 1 (Fitxa tècnica) complet
//   - Bloc 3 (Resum executiu) tallat a 280 paraules amb "[continua]"
//   - UpgradeBloc contextual amb els 5 blocs que es perden + CTA
//
// Variant A (visitant no loguejat): "Crea compte gratuït" + "Fes-te Premium"
// Variant C (gratuït loguejat): només "Fes-te Premium"
//
// Segueix estrictament DESIGN_SYSTEM.md: mateix patró de Bloc, mateixa
// tipografia, mateixa paleta. Cap invent nou.
// ---------------------------------------------------------------------------

type UpgradePreviewProps = {
  report: Report;
  content: ReportBlock;
  lang: "ca" | "es";
  variant: "A" | "C";
  onRegister: () => void;
  onPreus: () => void;
};

function UpgradePreview({
  report,
  content,
  lang,
  variant,
  onRegister,
  onPreus,
}: UpgradePreviewProps) {
  // Tallar el resum executiu a ~280 caràcters (3-4 línies) per fer de gancho
  const resumCurt =
    content.resumExecutiu.length > 280
      ? content.resumExecutiu.slice(0, 280).trim() + "…"
      : content.resumExecutiu;

  // Data en què l'informe serà d'accés gratuït (data + 6 mesos)
  const freeDate = new Date(report.date);
  freeDate.setMonth(freeDate.getMonth() + 6);
  const freeDateStr = freeDate.toLocaleDateString(
    lang === "ca" ? "ca-ES" : "es-ES",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      {/* Bloc 0 — Semàfor Metodològic (destacat, visible complet) */}
      <Bloc
        num="0"
        icon={<Gauge className="h-4 w-4" />}
        title={lang === "ca" ? "Semàfor Metodològic" : "Semáforo Metodológico"}
        highlighted
      >
        <div className="rounded-md border border-accent/30 bg-accent-soft/10 p-4">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
              {lang === "ca" ? "Nota global" : "Nota global"}
            </p>
            <span className="rounded-md bg-accent px-3 py-1 text-right font-serif text-base font-bold text-accent-foreground">
              {content.semafor.grade} · {content.semafor.gradeLabel}
            </span>
          </div>
          <div className="space-y-2">
            {content.semafor.indicators.map((ind) => (
              <SemaforRow
                key={ind.name}
                name={ind.name}
                status={ind.status}
                label={ind.label}
                note={ind.note}
              />
            ))}
          </div>
        </div>
      </Bloc>

      {/* Bloc 1 — Fitxa tècnica (visible complet) */}
      <Bloc
        num="1"
        icon={<FileText className="h-4 w-4" />}
        title={lang === "ca" ? "Fitxa tècnica" : "Ficha técnica"}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Datum
            label={lang === "ca" ? "Institució" : "Institución"}
            value={report.institution}
          />
          <Datum
            label={lang === "ca" ? "Data" : "Fecha"}
            value={formatDate(report.date, lang)}
          />
          <Datum
            label={lang === "ca" ? "Tipus" : "Tipo"}
            value={getTypeLabel(report.type)}
          />
          <Datum
            label={lang === "ca" ? "Pàgines" : "Páginas"}
            value={String(report.pages)}
          />
          <Datum
            label={lang === "ca" ? "Àmbit" : "Ámbito"}
            value={getScopeLabel(report.scope)}
          />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              URL
            </p>
            <a
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-deep hover:underline"
            >
              <span className="font-mono">
                {report.url.replace(/^https?:\/\//, "").slice(0, 28)}…
              </span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          </div>
        </div>
      </Bloc>

      {/* Bloc 3 — Resum executiu (tallat com a preview) */}
      <Bloc
        num="3"
        icon={<Layers className="h-4 w-4" />}
        title={lang === "ca" ? "Resum executiu" : "Resumen ejecutivo"}
      >
        <p className="text-sm leading-relaxed text-foreground/80">
          {resumCurt}{" "}
          <span className="italic text-muted-foreground">
            {lang === "ca" ? "[continua]" : "[continúa]"}
          </span>
        </p>
      </Bloc>

      {/* === UPGRADE BLOC CONTEXTUAL ===
          Bloc destacat més (mateix patró que Bloc highlighted),
          no pas un component alien. L'única diferenciació és una icona
          de cadenat dins un cercle accent/15 a la capçalera. */}
      <UpgradeBloc
        lang={lang}
        variant={variant}
        freeDateStr={freeDateStr}
        onRegister={onRegister}
        onPreus={onPreus}
      />

      {/* Peu de l'informe (igual que l'aprovat, sense CTA a Preus) */}
      <div className="flex flex-col gap-3 rounded-md border border-rule bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {lang === "ca"
            ? "Criteri ESG no és font oficial. Consulta sempre el document original per a decisions compliance."
            : "Criteri ESG no es fuente oficial. Consulta siempre el documento original para decisiones compliance."}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(report.url, "_blank")}
          className="flex-shrink-0"
        >
          <ExternalLink className="mr-2 h-3.5 w-3.5" />
          {lang === "ca" ? "Veure font original" : "Ver fuente original"}
        </Button>
      </div>
    </div>
  );
}

function UpgradeBloc({
  lang,
  variant,
  freeDateStr,
  onRegister,
  onPreus,
}: {
  lang: "ca" | "es";
  variant: "A" | "C";
  freeDateStr: string;
  onRegister: () => void;
  onPreus: () => void;
}) {
  // Llista del que l'usuari es perd (contextual a l'estructura de l'informe)
  const missItems: { num: string; star?: boolean; title: { ca: string; es: string }; detail: { ca: string; es: string }; exclusive?: boolean }[] = [
    {
      num: "2",
      title: {
        ca: "5 dades clau amb pàgina citada",
        es: "5 datos clave con página citada",
      },
      detail: {
        ca: "Punts quantitatius amb valor, context i pàgina citada al document original.",
        es: "Puntos cuantitativos con valor, contexto y página citada en el documento original.",
      },
    },
    {
      num: "4",
      title: {
        ca: "Implicacions per a empreses, reguladors i ciutadans",
        es: "Implicaciones para empresas, reguladores y ciudadanos",
      },
      detail: {
        ca: "Anàlisi triple + secció «Més enllà del Checkbox» amb mirada ètica.",
        es: "Análisis triple + sección «Más allá del Checkbox» con mirada ética.",
      },
    },
    {
      num: "5",
      title: {
        ca: "Connexions amb altres informes i actualitat",
        es: "Conexiones con otros informes y actualidad",
      },
      detail: {
        ca: "Relacions de complementarietat i contradicció amb altres informes.",
        es: "Relaciones de complementariedad y contradicción con otros informes.",
      },
    },
    {
      num: "⭐",
      star: true,
      title: {
        ca: "Accions recomanades",
        es: "Acciones recomendadas",
      },
      detail: {
        ca: "El cor operatiu. 3-5 accions concretes amb esforç i impacte estimats.",
        es: "El corazón operativo. 3-5 acciones concretas con esfuerzo e impacto estimados.",
      },
      exclusive: true,
    },
    {
      num: "⭐",
      star: true,
      title: {
        ca: "Cross-reference amb EcoVadis, B Corp, MSCI i GRI",
        es: "Cross-reference con EcoVadis, B Corp, MSCI y GRI",
      },
      detail: {
        ca: "Mapatge exacte de quins canvis de l'informe afecten cada certificació.",
        es: "Mapeo exacte de qué cambios del informe afectan cada certificación.",
      },
      exclusive: true,
    },
  ];

  return (
    <section className="rounded-md border border-accent bg-accent-soft/10 p-5 shadow-sm">
      {/* Capçalera del bloc — mateix patró que Bloc però amb icona Lock */}
      <div className="mb-4 flex items-center gap-3 border-b border-accent/30 pb-4">
        <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Lock className="h-4 w-4" />
        </span>
        <h2 className="flex-1 font-serif text-lg font-semibold text-primary">
          {lang === "ca"
            ? "Et queden 5 blocs per llegir en aquest informe"
            : "Te quedan 5 bloques por leer en este informe"}
        </h2>
        <span className="inline-block rounded-full bg-accent px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent-foreground">
          PREMIUM
        </span>
      </div>

      {/* Subtítol mono com el dels altres blocs */}
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-accent-deep">
        {lang === "ca"
          ? "QUÈ ET PERDS EN AQUEST INFORME"
          : "QUÉ TE PIERDES EN ESTE INFORME"}
      </p>

      {/* Llista del que es perd */}
      <ul className="space-y-0">
        {missItems.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 border-b border-dashed border-rule py-3 last:border-b-0"
          >
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ${
                item.star
                  ? "bg-accent text-accent-foreground"
                  : "bg-accent/10 text-accent-deep"
              }`}
            >
              {item.num}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-primary">
                {item.title[lang]}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-foreground/70">
                {item.detail[lang]}
              </p>
              {item.exclusive && (
                <span className="mt-1 inline-block rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent-deep">
                  {lang === "ca"
                    ? "Exclusiu Premium — cap competidor ho fa"
                    : "Exclusivo Premium — ningún competidor lo hace"}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Peu: preu (patró Preus, 36px + period) + CTA segons variant */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-accent/30 pt-5">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-4xl font-semibold text-accent">
              290 €
            </span>
            <span className="text-xs text-muted-foreground">
              {lang === "ca" ? "/ any" : "/ año"}
            </span>
          </div>
          <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-accent-deep">
            {lang === "ca" ? "EARLY BIRD · 50 PLACES" : "EARLY BIRD · 50 PLAZAS"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {variant === "A" && (
            <Button variant="outline" onClick={onRegister} size="sm">
              {lang === "ca" ? "Crea compte gratuït" : "Crear cuenta gratis"}
            </Button>
          )}
          <Button onClick={onPreus} size="sm">
            <Crown className="mr-1.5 h-3.5 w-3.5" />
            {lang === "ca" ? "Fes-te Premium" : "Hazte Premium"}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Nota inferior: data d'alliberament */}
      <div className="mt-4 border-l-2 border-accent bg-accent-soft/5 px-3 py-2 text-xs leading-relaxed text-foreground/70">
        {lang === "ca" ? (
          <>
            Aquest informe serà d&apos;accés gratuït a partir del{" "}
            <strong className="text-primary">{freeDateStr}</strong> (fa més de 6
            mesos). Fins llavors, és exclusiu per a subscriptors Premium.
          </>
        ) : (
          <>
            Este informe será de acceso gratis a partir del{" "}
            <strong className="text-primary">{freeDateStr}</strong> (hace más de
            6 meses). Hasta entonces, es exclusivo para suscriptores Premium.
          </>
        )}
      </div>
    </section>
  );
}
