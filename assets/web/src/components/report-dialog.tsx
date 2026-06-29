"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Layers,
  TrendingUp,
  Target,
  Network,
  ClipboardCheck,
  Link2,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import {
  reports,
  getScopeLabel,
  getTypeLabel,
  formatDate,
  isFreeAccess,
} from "@/lib/reports";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string | null;
}

export function ReportDialog({ open, onOpenChange, slug }: ReportDialogProps) {
  const { lang } = useLanguage();
  const report = slug ? reports.find((r) => r.slug === slug) : null;

  if (!report) return null;

  const free = isFreeAccess(report.date);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-5xl overflow-y-auto p-0">
        {/* Header */}
        <div className="border-b border-rule bg-secondary/40 p-6">
          <DialogHeader className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {lang === "ca" ? "Informes" : "Informes"} &gt; {report.institution}
            </p>
            <p className="eyebrow">
              {report.institution} · {formatDate(report.date, lang)} · {report.pages}{" "}
              {lang === "ca" ? "pàgines" : "páginas"}
            </p>
            <DialogTitle className="font-serif text-2xl font-semibold leading-tight text-primary sm:text-3xl">
              {report.title}
            </DialogTitle>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="secondary" className="border border-accent/30 bg-accent-soft/20 text-accent-deep">
                {getTypeLabel(report.type)}
              </Badge>
              <Badge variant="secondary" className="border border-accent/30 bg-accent-soft/20 text-accent-deep">
                {getScopeLabel(report.scope)}
              </Badge>
              {free ? (
                <Badge variant="secondary" className="border border-accent bg-accent-soft/40 text-accent-deep">
                  {lang === "ca" ? "Accés obert" : "Acceso abierto"}
                </Badge>
              ) : (
                <Badge variant="secondary" className="border border-muted-foreground text-muted-foreground">
                  Premium
                </Badge>
              )}
              {report.certifications.slice(0, 3).map((cert) => (
                <Badge key={cert} variant="outline" className="border-accent/40 text-accent-deep">
                  {cert}
                </Badge>
              ))}
            </div>
          </DialogHeader>
        </div>

        {/* Body — 7 blocs */}
        <div className="space-y-6 p-6">
          {/* Bloc 1 — Fitxa tècnica */}
          <Bloc num="1" icon={<FileText className="h-4 w-4" />} title={lang === "ca" ? "Fitxa tècnica" : "Ficha técnica"}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Datum label={lang === "ca" ? "Institució" : "Institución"} value={report.institution} />
              <Datum label={lang === "ca" ? "Data" : "Fecha"} value={formatDate(report.date, lang)} />
              <Datum label={lang === "ca" ? "Tipus" : "Tipo"} value={getTypeLabel(report.type)} />
              <Datum label={lang === "ca" ? "Pàgines" : "Páginas"} value={String(report.pages)} />
              <Datum label={lang === "ca" ? "Àmbit" : "Ámbito"} value={getScopeLabel(report.scope)} />
              <Datum label="URL" value={report.url.replace(/^https?:\/\//, "").slice(0, 30) + "..."} mono />
            </div>
          </Bloc>

          {/* Bloc 2 — Resum executiu */}
          <Bloc num="2" icon={<Layers className="h-4 w-4" />} title={lang === "ca" ? "Resum executiu" : "Resumen ejecutivo"}>
            <p className="text-sm leading-relaxed text-foreground/85">{report.summary}</p>
          </Bloc>

          {/* Bloc 3 — Dades clau */}
          <Bloc num="3" icon={<TrendingUp className="h-4 w-4" />} title={lang === "ca" ? "5 dades clau" : "5 datos clave"}>
            <p className="text-sm leading-relaxed text-foreground/75">
              Les dades clau específiques d'aquest informe estan disponibles a l'informe complet descarregable.
              Aquí tens el resum executiu: <em>{report.summary}</em>
            </p>
          </Bloc>

          {/* Bloc 4 — Implicacions */}
          <Bloc num="4" icon={<Target className="h-4 w-4" />} title={lang === "ca" ? "Implicacions" : "Implicaciones"}>
            <div className="grid gap-4 md:grid-cols-3">
              <ImplicationBlock
                label={lang === "ca" ? "Empreses" : "Empresas"}
                body={lang === "ca"
                  ? "Cal adaptar el reporting i les operacions segons l'abast d'aquest informe. Revisar processos interns afectats."
                  : "Hay que adaptar el reporting y las operaciones según el alcance de este informe. Revisar procesos internos afectados."}
              />
              <ImplicationBlock
                label={lang === "ca" ? "Reguladors" : "Reguladores"}
                body={lang === "ca"
                  ? "Caldrà transposar i fer complir les disposicions. Formació específica als auditors i revisió de guies nacionals."
                  : "Habrá que transponer y hacer cumplir las disposiciones. Formación específica a los auditores y revisión de guías nacionales."}
              />
              <ImplicationBlock
                label={lang === "ca" ? "Ciutadans" : "Ciudadanos"}
                body={lang === "ca"
                  ? "Impacte en transparència i accés a informació. Seguiment actiu d'ONGs i societat civil."
                  : "Impacto en transparencia y acceso a información. Seguimiento activo de ONGs y sociedad civil."}
              />
            </div>
          </Bloc>

          {/* Bloc 5 — Connexions */}
          <Bloc num="5" icon={<Network className="h-4 w-4" />} title={lang === "ca" ? "Connexions" : "Conexiones"}>
            <p className="text-sm leading-relaxed text-foreground/75">
              Les connexions amb altres informes estan disponibles a la versió Premium.
              Aquí tens el context:
            </p>
            <div className="mt-3 space-y-2">
              {report.certifications.map((cert) => (
                <div key={cert} className="rounded-md border border-rule bg-background p-3">
                  <span className="font-mono text-xs text-accent-deep">{cert}</span>
                  <span className="ml-2 text-xs text-foreground/70">
                    {lang === "ca" ? "Framework afectat per aquest informe" : "Framework afectado por este informe"}
                  </span>
                </div>
              ))}
            </div>
          </Bloc>

          {/* Bloc 6 — Accions recomanades (DESTACAT) */}
          <Bloc num="6" icon={<ClipboardCheck className="h-4 w-4" />} title={lang === "ca" ? "Accions recomanades" : "Acciones recomendadas"} highlighted>
            <div className="space-y-3">
              <Action
                num="01"
                title={lang === "ca" ? "Audita el teu estat actual" : "Audita tu estado actual"}
                body={lang === "ca"
                  ? "Identifica quins elements del teu reporting actual estan afectats per aquest informe. Marca els gaps a cobrir."
                  : "Identifica qué elementos de tu reporting actual están afectados por este informe. Marca los gaps a cubrir."}
                effort={lang === "ca" ? "Esforç: baix" : "Esfuerzo: bajo"}
                impact={lang === "ca" ? "Impacte: alt" : "Impacto: alto"}
              />
              <Action
                num="02"
                title={lang === "ca" ? "Actualitza el pla d'acció" : "Actualiza el plan de acción"}
                body={lang === "ca"
                  ? "Revisa el teu roadmap ESG i ajusta les prioritats segons les implicacions d'aquest informe."
                  : "Revisa tu roadmap ESG y ajusta las prioridades según las implicaciones de este informe."}
                effort={lang === "ca" ? "Esforç: mitjà" : "Esfuerzo: medio"}
                impact={lang === "ca" ? "Impacte: alt" : "Impacto: alto"}
              />
              <Action
                num="03"
                title={lang === "ca" ? "Comunica als stakeholders" : "Comunica a los stakeholders"}
                body={lang === "ca"
                  ? "Prepara un breu resum per al comitè de direcció i els equips afectats. Alinea expectatives."
                  : "Prepara un breve resumen para el comité de dirección y los equipos afectados. Alinea expectativas."}
                effort={lang === "ca" ? "Esforç: baix" : "Esfuerzo: bajo"}
                impact={lang === "ca" ? "Impacte: mitjà" : "Impacto: medio"}
              />
            </div>
          </Bloc>

          {/* Bloc 7 — Cross-reference (DESTACAT) */}
          <Bloc num="7" icon={<Link2 className="h-4 w-4" />} title={lang === "ca" ? "Cross-reference amb certificacions" : "Cross-reference con certificaciones"} highlighted>
            <div className="grid gap-3 sm:grid-cols-2">
              {report.certifications.map((cert) => (
                <CrossRef
                  key={cert}
                  framework={cert}
                  criterion={lang === "ca" ? "Criteri afectat" : "Criterio afectado"}
                  impact={lang === "ca"
                    ? "Aquest informe té impacte directe en aquest framework. Revisa els criteris específics afectats per prioritzar accions."
                    : "Este informe tiene impacto directo en este framework. Revisa los criterios específicos afectados para priorizar acciones."}
                />
              ))}
            </div>
          </Bloc>

          <Separator />

          {/* CTA to original */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {lang === "ca"
                ? "Criteri ESG no és font oficial. Consulta sempre el document original per a decisions compliance."
                : "Criteri ESG no es fuente oficial. Consulta siempre el documento original para decisiones compliance."}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(report.url, "_blank")}
            >
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              {lang === "ca" ? "Veure font original" : "Ver fuente original"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
      className={`rounded-lg border p-5 ${
        highlighted ? "border-accent bg-accent-soft/15" : "border-rule bg-card"
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-xs text-accent-deep">{num}</span>
        <span className="text-accent-deep">{icon}</span>
        <h3 className="font-serif text-lg font-semibold text-primary">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Datum({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className={`text-sm font-medium text-primary ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
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

function Action({
  num,
  title,
  body,
  effort,
  impact,
}: {
  num: string;
  title: string;
  body: string;
  effort: string;
  impact: string;
}) {
  return (
    <div className="rounded-md border border-accent/40 bg-background p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-xs text-accent-deep">{num}</span>
        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
        <h4 className="font-serif text-base font-semibold text-primary">{title}</h4>
      </div>
      <p className="mb-2 text-xs leading-relaxed text-foreground/80">{body}</p>
      <div className="flex flex-wrap gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {effort}
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
          {impact}
        </span>
      </div>
    </div>
  );
}

function CrossRef({
  framework,
  criterion,
  impact,
}: {
  framework: string;
  criterion: string;
  impact: string;
}) {
  return (
    <div className="rounded-md border border-accent/40 bg-background p-3">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="font-serif text-sm font-semibold text-primary">{framework}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
          {criterion}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-foreground/75">{impact}</p>
    </div>
  );
}
