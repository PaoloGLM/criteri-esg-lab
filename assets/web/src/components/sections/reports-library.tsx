"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  FileText,
  Lock,
  Globe,
  Calendar,
  Building2,
  Filter,
  X,
  ArrowRight,
} from "lucide-react";
import {
  reports,
  getScopeLabel,
  getTypeLabel,
  formatDate,
  isFreeAccess,
  type Report,
} from "@/lib/reports";

interface ReportsLibraryProps {
  onOpenReport: (slug: string) => void;
}

export function ReportsLibrary({ onOpenReport }: ReportsLibraryProps) {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [certFilter, setCertFilter] = useState<string>("all");

  // Filtratge
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          report.title.toLowerCase().includes(q) ||
          report.institution.toLowerCase().includes(q) ||
          report.summary.toLowerCase().includes(q) ||
          report.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          report.certifications.some((cert) => cert.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }
      if (scopeFilter !== "all" && report.scope !== scopeFilter) return false;
      if (typeFilter !== "all" && report.type !== typeFilter) return false;
      if (certFilter !== "all") {
        if (!report.certifications.includes(certFilter)) return false;
      }
      return true;
    });
  }, [searchQuery, scopeFilter, typeFilter, certFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setScopeFilter("all");
    setTypeFilter("all");
    setCertFilter("all");
  };

  const hasActiveFilters =
    searchQuery ||
    scopeFilter !== "all" ||
    typeFilter !== "all" ||
    certFilter !== "all";

  const allCertifications = useMemo(() => {
    const certs = new Set<string>();
    reports.forEach((r) => r.certifications.forEach((c) => certs.add(c)));
    return Array.from(certs).sort();
  }, []);

  return (
    <>
    {/* Page hero — capçalera de la biblioteca */}
    <section className="border-b border-rule bg-secondary/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow mb-2">
          {lang === "ca" ? "BIBLIOTECA D'INFORMES" : "BIBLIOTECA DE INFORMES"}
        </p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
          {lang === "ca" ? "Biblioteca d'informes" : "Biblioteca de informes"}
        </h1>
        <div className="rule-accent my-5" />
        <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
          {lang === "ca"
            ? "Tots els informes rellevants publicats el 2026, sintetitzats en 8 blocs amb cross-reference a EcoVadis, B Corp, MSCI i GRI. Fes clic a sobre per accedir a l'informe complet."
            : "Todos los informes relevantes publicados en 2026, sintetizados en 8 bloques con cross-reference a EcoVadis, B Corp, MSCI y GRI. Haz clic para acceder al informe completo."}
        </p>
      </div>
    </section>

    {/* Cos: filtres + grid */}
    <section id="informes" className="border-b border-rule py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Filtres + cerca */}
        <div className="mb-8 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={
                lang === "ca"
                  ? "Cerca per paraula clau, institució, tag..."
                  : "Busca por palabra clave, institución, tag..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-10 pr-4"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Select value={scopeFilter} onValueChange={setScopeFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={lang === "ca" ? "Àmbit" : "Ámbito"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {lang === "ca" ? "Tots els àmbits" : "Todos los ámbitos"}
                </SelectItem>
                <SelectItem value="CAT">{getScopeLabel("CAT")}</SelectItem>
                <SelectItem value="ES">{getScopeLabel("ES")}</SelectItem>
                <SelectItem value="EU">{getScopeLabel("EU")}</SelectItem>
                <SelectItem value="GLOBAL">{getScopeLabel("GLOBAL")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={lang === "ca" ? "Tipus" : "Tipo"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {lang === "ca" ? "Tots els tipus" : "Todos los tipos"}
                </SelectItem>
                <SelectItem value="regulatory">
                  {getTypeLabel("regulatory")}
                </SelectItem>
                <SelectItem value="framework">
                  {getTypeLabel("framework")}
                </SelectItem>
                <SelectItem value="rating">{getTypeLabel("rating")}</SelectItem>
                <SelectItem value="industry">{getTypeLabel("industry")}</SelectItem>
                <SelectItem value="official">{getTypeLabel("official")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={certFilter} onValueChange={setCertFilter}>
              <SelectTrigger className="h-10">
                <SelectValue
                  placeholder={
                    lang === "ca"
                      ? "Certificació afectada"
                      : "Certificación afectada"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {lang === "ca" ? "Tots els frameworks" : "Todos los frameworks"}
                </SelectItem>
                {allCertifications.map((cert) => (
                  <SelectItem key={cert} value={cert}>
                    {cert}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredReports.length} {lang === "ca" ? "informes" : "informes"} ·{" "}
              {reports.length} {lang === "ca" ? "total al catàleg" : "total en catálogo"}
            </p>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                {lang === "ca" ? "Netejar filtres" : "Limpiar filtros"}
              </Button>
            )}
          </div>
        </div>

        {/* Grid d'informes */}
        {filteredReports.length === 0 ? (
          <div className="rounded-lg border border-rule bg-card p-10 text-center">
            <Filter className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {lang === "ca"
                ? "No s'han trobat informes amb aquests filtres. Prova de canviar-los."
                : "No se han encontrado informes con estos filtros. Prueba a cambiarlos."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.slug}
                report={report}
                onOpen={() => onOpenReport(report.slug)}
              />
            ))}
          </div>
        )}

        {/* Nota peu */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
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
            <FileText className="h-3 w-3 text-muted-foreground" />
            <span>
              {lang === "ca"
                ? "Clica per veure l'informe complet"
                : "Clica para ver el informe completo"}
            </span>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

function ReportCard({
  report,
  onOpen,
}: {
  report: Report;
  onOpen: () => void;
}) {
  const { lang } = useLanguage();
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
