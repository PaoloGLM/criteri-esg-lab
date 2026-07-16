"use client";

import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, ArrowRight, BookOpen, Building2, Calendar, Globe } from "lucide-react";
import { reports, isFreeAccess, formatDate, getScopeLabel, getTypeLabel, type Report } from "@/lib/reports";
import { useRouter } from "next/navigation";

interface ReportsPreviewProps {
  onOpenReport: (slug: string) => void;
}

export function ReportsPreview({ onOpenReport }: ReportsPreviewProps) {
  const { lang } = useLanguage();
  const router = useRouter();

  // Mostrem 4 informes: 2 primeres (senceres) + 2 següents (mig amagades)
  const previewReports = reports.slice(0, 4);

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

        {/* Container amb max-height per tallar la segona fila + gradient overlay */}
        <div className="relative">
          <div
            className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2"
            style={{ maxHeight: "350px" }}
          >
            {previewReports.map((report) => (
              <ReportCard
                key={report.slug}
                report={report}
                lang={lang}
                onOpen={() => onOpenReport(report.slug)}
              />
            ))}
          </div>

          {/* Gradient overlay que difumina la part inferior */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background: "linear-gradient(to bottom, rgba(245, 239, 230, 0) 0%, rgba(245, 239, 230, 0.85) 50%, #F5EFE6 100%)",
            }}
            aria-hidden
          />
        </div>

        {/* CTA per anar a la biblioteca completa — sobre la part tallada */}
        <div className="relative z-10 -mt-8 flex flex-col items-center gap-4">
          <button
            onClick={goToLibrary}
            className="group inline-flex items-center gap-2 rounded-md border border-accent bg-accent-soft/20 px-6 py-3 text-sm font-semibold text-accent-deep shadow-sm backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground"
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

/**
 * ReportCard unificat amb el patró canònic de reports-library:
 * - shadcn Card + CardContent p-5
 * - Badge variants per Type/Scope/Free/Premium
 * - text-lg + line-clamp-2 per títol
 * - text-sm leading-relaxed text-foreground/75 + line-clamp-3 per summary
 * - certifications com a mono chips (text-[9px])
 * - Footer amb "Veure informe complet" hover-reveal
 *
 * L'única diferència amb el de reports-library és que aquest és clicable
 * des de tota la card (per la naturalesa de la preview amb overlay),
 * mentre que el de library també ho és. Tots dos fan servir Card amb onClick.
 */
function ReportCard({
  report,
  lang,
  onOpen,
}: {
  report: Report;
  lang: "ca" | "es";
  onOpen: () => void;
}) {
  const free = isFreeAccess(report.date);

  return (
    <Card
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
      className="group cursor-pointer border-rule bg-card transition-all hover:border-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Badge
              variant="secondary"
              className="bg-accent-soft/30 text-[10px] text-accent-deep"
            >
              {getTypeLabel(report.type)}
            </Badge>
            <Badge
              variant="outline"
              className="border-rule text-[10px] text-foreground/70"
            >
              <Globe className="mr-1 h-2.5 w-2.5" />
              {getScopeLabel(report.scope)}
            </Badge>
          </div>
          {free ? (
            <Badge
              variant="outline"
              className="border-accent bg-accent-soft/20 text-[10px] text-accent-deep"
            >
              {lang === "ca" ? "Obert" : "Abierto"}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-muted-foreground text-[10px] text-muted-foreground"
            >
              <Lock className="mr-1 h-2.5 w-2.5" />
              Premium
            </Badge>
          )}
        </div>

        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Building2 className="h-3 w-3" />
          <span className="truncate">{report.institution}</span>
        </div>
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(report.date, lang)}</span>
          <span>·</span>
          <span>{report.pages} {lang === "ca" ? "pàg" : "pág"}</span>
        </div>

        <h3 className="mb-2 font-serif text-lg font-semibold leading-tight text-primary line-clamp-2">
          {report.title}
        </h3>

        <p className="mb-3 text-sm leading-relaxed text-foreground/75 line-clamp-3">
          {report.summary}
        </p>

        <div className="mb-3 flex flex-wrap gap-1">
          {report.certifications.slice(0, 3).map((cert) => (
            <span
              key={cert}
              className="font-mono text-[9px] uppercase tracking-widest text-accent-deep"
            >
              {cert}
            </span>
          ))}
          {report.certifications.length > 3 && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              +{report.certifications.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 border-t border-rule pt-2 text-xs font-medium text-accent-deep opacity-0 transition-opacity group-hover:opacity-100">
          <span>
            {lang === "ca" ? "Veure informe complet" : "Ver informe completo"}
          </span>
          <ArrowRight className="h-3 w-3" />
        </div>
      </CardContent>
    </Card>
  );
}
