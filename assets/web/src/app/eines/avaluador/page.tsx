"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Gauge,
  FileText,
  TrendingUp,
  Layers,
  Target,
  Network,
  ClipboardCheck,
  Compass,
  ArrowRight,
  Check,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";
import type { ReportBlock } from "@/lib/reports";

type Stage = "form" | "loading" | "result" | "error";

export default function AvaluadorPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const { user, plan, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("login");

  // Form state
  const [title, setTitle] = useState("");
  const [institution, setInstitution] = useState("");
  const [source, setSource] = useState("");
  const [outputLang, setOutputLang] = useState<"ca" | "es">(lang);

  // Generation state
  const [stage, setStage] = useState<Stage>("form");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generated, setGenerated] = useState<ReportBlock | null>(null);

  const isPremium = !!user && plan === "premium";
  const isLoggedOut = !loading && !user;

  const openAuth = (tab: "register" | "login" = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !institution.trim() || source.trim().length < 100) return;

    setStage("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          title,
          institution,
          lang: outputLang,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.report) {
        throw new Error("Resposta sense report");
      }

      setGenerated(data.report);
      setStage("result");
    } catch (e: any) {
      console.error("[avaluador] Error:", e);
      setErrorMsg(e?.message || t("avaluador.form.error"));
      setStage("error");
    }
  };

  const handleReset = () => {
    setStage("form");
    setGenerated(null);
    setErrorMsg(null);
    setTitle("");
    setInstitution("");
    setSource("");
  };

  const handleDownloadJSON = () => {
    if (!generated) return;
    const blob = new Blob([JSON.stringify(generated, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-criteri-esg.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // === Pantalla: cal login o cal premium ===
  if (!loading && (!user || !isPremium)) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header onOpenAuth={(tab) => openAuth(tab || "login")} />
        <main className="flex-1">
          <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
            <div className="mx-auto max-w-2xl px-6 py-20 text-center lg:px-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold mb-4" style={{ color: "#3F6653" }}>
                {t("avaluador.eyebrow")}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-medium mb-5" style={{ color: "#26312B" }}>
                {t("avaluador.premium.required.title")}
              </h1>
              <p className="text-base leading-relaxed mb-8 max-w-md mx-auto" style={{ color: "#141B18" }}>
                {t("avaluador.premium.required.body")}
              </p>
              <Button
                size="lg"
                onClick={() => isLoggedOut ? openAuth("login") : router.push("/preus")}
                style={{ background: "#5E8772", color: "#FFFFFF" }}
              >
                {t("avaluador.premium.required.cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>
        </main>
        <FooterV1 />
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      </div>
    );
  }

  // === Layout comú ===
  const heroBlock = (
    <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold mb-3" style={{ color: "#3F6653" }}>
          {t("avaluador.eyebrow")}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium mb-3 max-w-3xl" style={{ color: "#26312B" }}>
          {t("avaluador.title")}
        </h1>
        <p className="font-serif italic text-lg max-w-2xl" style={{ color: "#141B18" }}>
          {t("avaluador.subtitle")}
        </p>
      </div>
    </section>
  );

  // === Pantalla: form ===
  if (stage === "form") {
    const canSubmit = title.trim() && institution.trim() && source.trim().length >= 100;
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header onOpenAuth={(tab) => openAuth(tab || "login")} />
        <main className="flex-1">
          {heroBlock}
          <section className="bg-background">
            <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
              <h2 className="font-serif text-2xl font-medium mb-6" style={{ color: "#26312B" }}>
                {t("avaluador.form.title")}
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] font-semibold mb-1.5" style={{ color: "#3F6653" }}>
                    {t("avaluador.form.title.label")}
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("avaluador.form.title.placeholder")}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] font-semibold mb-1.5" style={{ color: "#3F6653" }}>
                    {t("avaluador.form.institution.label")}
                  </label>
                  <Input
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder={t("avaluador.form.institution.placeholder")}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] font-semibold mb-1.5" style={{ color: "#3F6653" }}>
                    {t("avaluador.form.source.label")}
                  </label>
                  <Textarea
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder={t("avaluador.form.source.placeholder")}
                    className="w-full min-h-[300px] font-mono text-sm"
                  />
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <p style={{ color: "#4A5F53" }}>{t("avaluador.form.source.help")}</p>
                    <p style={{ color: source.length < 100 ? "#A0522D" : "#5C8A5C" }}>
                      {source.length} caràcters
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-[0.18em] font-semibold mb-1.5" style={{ color: "#3F6653" }}>
                    {t("avaluador.form.lang.label")}
                  </label>
                  <div className="flex items-center rounded-md border border-rule p-0.5 w-fit">
                    <button
                      type="button"
                      onClick={() => setOutputLang("ca")}
                      className={`rounded-sm px-4 py-1.5 text-sm font-medium transition-colors ${
                        outputLang === "ca" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Català
                    </button>
                    <button
                      type="button"
                      onClick={() => setOutputLang("es")}
                      className={`rounded-sm px-4 py-1.5 text-sm font-medium transition-colors ${
                        outputLang === "es" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Castellano
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  size="lg"
                  className="w-full"
                  style={{ background: "#5E8772", color: "#FFFFFF" }}
                >
                  {t("avaluador.form.submit")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </main>
        <FooterV1 />
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      </div>
    );
  }

  // === Pantalla: loading ===
  if (stage === "loading") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header onOpenAuth={(tab) => openAuth(tab || "login")} />
        <main className="flex-1">
          {heroBlock}
          <section className="bg-background">
            <div className="mx-auto max-w-2xl px-6 py-20 text-center lg:px-8">
              <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-rule border-t-accent" style={{ borderTopColor: "#5E8772" }} />
              <p className="font-serif text-xl" style={{ color: "#26312B" }}>
                {t("avaluador.form.processing")}
              </p>
            </div>
          </section>
        </main>
        <FooterV1 />
      </div>
    );
  }

  // === Pantalla: error ===
  if (stage === "error") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header onOpenAuth={(tab) => openAuth(tab || "login")} />
        <main className="flex-1">
          {heroBlock}
          <section className="bg-background">
            <div className="mx-auto max-w-2xl px-6 py-20 text-center lg:px-8">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "rgba(160,82,45,0.15)" }}>
                <AlertTriangle className="h-7 w-7" style={{ color: "#A0522D" }} />
              </div>
              <h2 className="font-serif text-2xl font-medium mb-3" style={{ color: "#26312B" }}>
                {t("avaluador.form.error")}
              </h2>
              {errorMsg && (
                <p className="text-sm mb-6 font-mono" style={{ color: "#4A5F53" }}>
                  {errorMsg}
                </p>
              )}
              <Button onClick={() => setStage("form")} variant="outline" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t("avaluador.result.new")}
              </Button>
            </div>
          </section>
        </main>
        <FooterV1 />
      </div>
    );
  }

  // === Pantalla: result ===
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenAuth={(tab) => openAuth(tab || "login")} />
      <main className="flex-1">
        {heroBlock}
        <section className="bg-background">
          <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-serif text-2xl font-medium" style={{ color: "#26312B" }}>
                  {t("avaluador.result.title")}
                </h2>
                <p className="font-serif italic text-sm mt-1" style={{ color: "#141B18" }}>
                  {t("avaluador.result.subtitle")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleDownloadJSON} variant="outline" size="sm">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  {t("avaluador.result.download")}
                </Button>
                <Button onClick={handleReset} variant="outline" size="sm">
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  {t("avaluador.result.new")}
                </Button>
              </div>
            </div>

            {generated && <GeneratedReportView report={generated} lang={outputLang} />}

            <div className="mt-8 rounded-md p-4" style={{ background: "rgba(160,82,45,0.08)", borderLeft: "3px solid #A0522D" }}>
              <p className="text-xs italic leading-relaxed" style={{ color: "#141B18" }}>
                {t("avaluador.result.disclaimer")}
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
    </div>
  );
}

// ====================================================================
// Render del ReportBlock generat (similar a /informes/[slug])
// ====================================================================
function GeneratedReportView({ report, lang }: { report: ReportBlock; lang: "ca" | "es" }) {
  return (
    <div className="space-y-6">
      {/* Bloc 0 — Semàfor */}
      <GeneratedBloc
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
              {report.semafor.grade} · {report.semafor.gradeLabel}
            </span>
          </div>
          <div className="space-y-2">
            {report.semafor.indicators.map((ind, i) => (
              <GeneratedSemaforRow key={i} ind={ind} />
            ))}
          </div>
        </div>
      </GeneratedBloc>

      {/* Bloc 2 — Dades clau */}
      <GeneratedBloc
        num="2"
        icon={<TrendingUp className="h-4 w-4" />}
        title={lang === "ca" ? "5 dades clau" : "5 datos clave"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {report.dadesClau.map((d, i) => (
            <div key={i} className="rounded-md border border-rule bg-background p-4">
              <p className="font-serif text-3xl font-semibold text-accent">{d.value}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/80">{d.label}</p>
              {d.page && <p className="mt-1 font-mono text-[10px] text-muted-foreground">{d.page}</p>}
            </div>
          ))}
        </div>
      </GeneratedBloc>

      {/* Bloc 3 — Resum executiu */}
      <GeneratedBloc
        num="3"
        icon={<FileText className="h-4 w-4" />}
        title={lang === "ca" ? "Resum executiu" : "Resumen ejecutivo"}
      >
        <p className="text-sm leading-relaxed text-foreground/85">{report.resumExecutiu}</p>
      </GeneratedBloc>

      {/* Bloc 4 — Implicacions */}
      <GeneratedBloc
        num="4"
        icon={<Layers className="h-4 w-4" />}
        title={lang === "ca" ? "Implicacions" : "Implicaciones"}
      >
        <div className="space-y-4">
          <GeneratedImplicationBlock label={lang === "ca" ? "Empreses" : "Empresas"} body={report.implicacions.empreses} />
          <GeneratedImplicationBlock label={lang === "ca" ? "Reguladors" : "Reguladores"} body={report.implicacions.reguladors} />
          <GeneratedImplicationBlock label={lang === "ca" ? "Ciutadans" : "Ciudadanos"} body={report.implicacions.ciutadans} />
        </div>
      </GeneratedBloc>

      {/* Més enllà del checkbox */}
      {report.mesEnllaCheckbox && (
        <GeneratedBloc
          num="4b"
          icon={<Compass className="h-4 w-4" />}
          title={lang === "ca" ? "Més enllà del checkbox" : "Más allá del checkbox"}
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep mb-2">
            {report.mesEnllaCheckbox.criteri}
          </p>
          <p className="font-serif italic text-sm leading-relaxed text-foreground/80">
            {report.mesEnllaCheckbox.body}
          </p>
        </GeneratedBloc>
      )}

      {/* Bloc 5 — Connexions */}
      <GeneratedBloc
        num="5"
        icon={<Network className="h-4 w-4" />}
        title={lang === "ca" ? "Connexions" : "Conexiones"}
      >
        <div className="space-y-3">
          {report.connexions.map((c, i) => (
            <div key={i} className="rounded-md border border-rule bg-background p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep mb-1">{c.type}</p>
              <p className="font-serif text-base font-semibold text-primary mb-1">{c.target}</p>
              <p className="text-sm text-foreground/75">{c.desc}</p>
            </div>
          ))}
        </div>
      </GeneratedBloc>

      {/* Bloc 6 — Accions recomanades */}
      <GeneratedBloc
        num="6"
        icon={<Target className="h-4 w-4" />}
        title={lang === "ca" ? "Accions recomanades" : "Acciones recomendadas"}
      >
        <div className="space-y-3">
          {report.accions.map((a, i) => (
            <div key={i} className="rounded-md border border-rule bg-background p-4">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <p className="font-serif text-base font-semibold text-primary">
                  <span className="font-mono text-xs text-accent mr-2">{a.num}</span>
                  {a.title}
                </p>
              </div>
              <p className="text-sm text-foreground/75 mb-2">{a.desc}</p>
              <div className="flex gap-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {lang === "ca" ? "Esforç" : "Esfuerzo"}: <span className="text-foreground">{a.effort}</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {lang === "ca" ? "Impacte" : "Impacto"}: <span className="text-foreground">{a.impact}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </GeneratedBloc>

      {/* Bloc 7 — Cross-references */}
      <GeneratedBloc
        num="7"
        icon={<ClipboardCheck className="h-4 w-4" />}
        title="Cross-reference"
      >
        <div className="space-y-3">
          {report.crossRefs.map((c, i) => (
            <div key={i} className="rounded-md border border-rule bg-background p-4">
              <p className="font-serif text-base font-semibold text-primary mb-1">{c.framework}</p>
              <p className="text-sm text-foreground/80 mb-1">{c.criterion}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">{c.impact}</p>
            </div>
          ))}
        </div>
      </GeneratedBloc>
    </div>
  );
}

function GeneratedBloc({
  num,
  icon,
  title,
  highlighted,
  children,
}: {
  num: string;
  icon: React.ReactNode;
  title: string;
  highlighted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-md border p-6 ${highlighted ? "border-accent/30 bg-accent-soft/5" : "border-rule bg-card"}`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{num}</span>
        <span className="text-accent-deep">{icon}</span>
        <h3 className="font-serif text-lg font-semibold text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function GeneratedSemaforRow({ ind }: { ind: { name: string; status: "verd" | "groc" | "vermell"; label: string; note: string } }) {
  const color =
    ind.status === "verd" ? "bg-[#5C8A5C]" : ind.status === "groc" ? "bg-[#C9A961]" : "bg-[#A0522D]";
  return (
    <div className="flex items-start gap-3 rounded-sm border border-rule bg-background px-3 py-2">
      <span className={`mt-0.5 inline-block h-3 w-3 flex-shrink-0 rounded-full ${color}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-medium text-primary">{ind.name}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">{ind.label}</span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-foreground/70">{ind.note}</p>
      </div>
    </div>
  );
}

function GeneratedImplicationBlock({ label, body }: { label: string; body: string }) {
  return (
    <div className="rounded-md border border-rule bg-background p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep mb-2">{label}</p>
      <p className="text-sm leading-relaxed text-foreground/80">{body}</p>
    </div>
  );
}
