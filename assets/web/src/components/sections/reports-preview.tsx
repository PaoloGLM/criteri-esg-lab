"use client";

import { useLanguage } from "@/components/language-provider";
import { Lock, ArrowRight, BookOpen } from "lucide-react";
import { reports, isFreeAccess, formatDate, getScopeLabel, getTypeLabel } from "@/lib/reports";
import { useRouter } from "next/navigation";

interface ReportsPreviewProps {
  onOpenReport: (slug: string) => void;
}

export function ReportsPreview({ onOpenReport }: ReportsPreviewProps) {
  const { lang } = useLanguage();
  const router = useRouter();

  // Mostrem només els 6 primers informes
  const previewReports = reports.slice(0, 6);
  // Els 3 primers completament visibles, els 3 següents degradats
  const visibleReports = previewReports.slice(0, 3);
  const fadedReports = previewReports.slice(3, 6);

  const goToLibrary = () => {
    router.push("/informes");
  };

  return (
    <section id="informes" className="border-b border-rule bg-secondary/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="eyebrow mb-3">
            {lang === "ca" ? "BIBLIOTECA D'INFORMES" : "BIBLIOTECA DE INFORMES"}
          </p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
            {lang === "ca"
              ? "Els informes que has de conèixer."
              : "Los informes que debes conocer."}
          </h2>
          <div className="rule-accent my-5" />
          <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
            {lang === "ca"
              ? "Una selecció dels últims informes institucionals processats amb els 8 blocs. La biblioteca completa creix cada setmana."
              : "Una selección de los últimos informes institucionales procesados con los 8 bloques. La biblioteca completa crece cada semana."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 3 targetes completament visibles */}
          {visibleReports.map((report) => (
            <ReportCard
              key={report.slug}
              report={report}
              lang={lang}
              onOpen={() => onOpenReport(report.slug)}
            />
          ))}

          {/* 3 targetes degradades (s'intueix que continua) */}
          {fadedReports.map((report) => (
            <ReportCard
              key={report.slug}
              report={report}
              lang={lang}
              faded
              onOpen={() => onOpenReport(report.slug)}
            />
          ))}
        </div>

        {/* CTA per anar a la biblioteca completa */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={goToLibrary}
            className="group inline-flex items-center gap-2 rounded-md border border-accent bg-accent-soft/20 px-6 py-3 text-sm font-semibold text-accent-deep transition-all hover:bg-accent hover:text-accent-foreground"
          >
            <BookOpen className="h-4 w-4" />
            {lang === "ca"
              ? "Veure biblioteca completa"
              : "Ver biblioteca completa"}
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Llegenda */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>
                {lang === "ca" ? "Accés lliure (>6 mesos)" : "Acceso libre (>6 meses)"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-muted-foreground" />
              <span>
                {lang === "ca" ? "Premium (últims 6 mesos)" : "Premium (últimos 6 meses)"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span>
                {lang === "ca" ? "Clica per veure l'informe complet" : "Haz clic para ver el informe completo"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportCard({
  report,
  lang,
  faded,
  onOpen,
}: {
  report: typeof reports[0];
  lang: "ca" | "es";
  faded?: boolean;
  onOpen: () => void;
}) {
  const free = isFreeAccess(report.date);

  return (
    <button
      onClick={onOpen}
      className={`group relative flex flex-col rounded-lg border bg-card p-5 text-left transition-all hover:shadow-md ${
        faded
          ? "border-rule/60 opacity-50 hover:opacity-100"
          : "border-rule hover:border-accent"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
          {getTypeLabel(report.type)}
        </span>
        {free ? (
          <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent-deep">
            {lang === "ca" ? "Accés lliure" : "Acceso libre"}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted-foreground/15 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            <Lock className="h-2.5 w-2.5" />
            Premium
          </span>
        )}
      </div>
      <h3 className="mb-1 font-serif text-base font-semibold leading-tight text-primary">
        {report.title}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">
        {report.institution} · {formatDate(report.date, lang)} · {report.pages} {lang === "ca" ? "pàg" : "pág"}
      </p>
      <p className="mb-3 flex-1 text-xs leading-relaxed text-foreground/75">
        {report.summary}
      </p>
      <div className="mt-auto flex flex-wrap gap-1">
        {report.certifications.slice(0, 3).map((cert) => (
          <span key={cert} className="rounded-sm border border-accent/30 px-1.5 py-0.5 text-[10px] text-accent-deep">
            {cert}
          </span>
        ))}
      </div>
      <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-accent">
        {lang === "ca" ? "Veure informe" : "Ver informe"}
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
}
