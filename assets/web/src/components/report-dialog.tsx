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
  Gauge,
  Compass,
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

          {/* Bloc 0 — Semàfor Metodològic (destacat) */}
          <Bloc num="0" icon={<Gauge className="h-4 w-4" />} title={lang === "ca" ? "Semàfor Metodològic" : "Semáforo Metodológico"} highlighted>
            <div className="rounded-md border border-accent/30 bg-accent-soft/10 p-4">
              <div className="mb-3 flex items-baseline justify-between">
                <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
                  {lang === "ca" ? "Nota global" : "Nota global"}
                </p>
                <span className="rounded-md bg-accent px-3 py-1 font-serif text-lg font-bold text-accent-foreground">
                  B · {lang === "ca" ? "Acceptable amb matisos" : "Aceptable con matices"}
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <SemaforRow label={lang === "ca" ? "Cobertura Scope 3" : "Cobertura Scope 3"} status="groc" note={lang === "ca" ? "Esmentat, no detallat" : "Mencionado, no detallado"} />
                <SemaforRow label={lang === "ca" ? "Termes temporals" : "Términos temporales"} status="verd" note={lang === "ca" ? "Aplicació 2027 definida" : "Aplicación 2027 definida"} />
                <SemaforRow label={lang === "ca" ? "Fonts independents" : "Fuentes independientes"} status="verd" note={lang === "ca" ? "Consulta pública oberta" : "Consulta pública abierta"} />
                <SemaforRow label={lang === "ca" ? "Granularitat" : "Granularidad"} status="groc" note={lang === "ca" ? "Per sector, no per empresa" : "Por sector, no por empresa"} />
                <SemaforRow label={lang === "ca" ? "Verificació externa" : "Verificación externa"} status="verd" note={lang === "ca" ? "Procés UE obert" : "Proceso UE abierto"} />
              </div>
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
                  ? "Reducció significativa de la càrrega de reporting. Les empreses han d'adaptar sistemes interns per al nou marc simplificat, prioritzant els datapoints que queden."
                  : "Reducción significativa de la carga de reporting. Las empresas deben adaptar sistemas internos para el nuevo marco simplificado, priorizando los datapoints que quedan."}
              />
              <ImplicationBlock
                label={lang === "ca" ? "Reguladors" : "Reguladores"}
                body={lang === "ca"
                  ? "La UE haurà de fer complir el marc revisat. Caldrà formació específica als auditors i revisió de guies nacionals per transposar la directiva."
                  : "La UE deberá hacer cumplir el marco revisado. Será necesaria formación específica a los auditores y revisión de guías nacionales para transponer la directiva."}
              />
              <ImplicationBlock
                label={lang === "ca" ? "Ciutadans" : "Ciudadanos"}
                body={lang === "ca"
                  ? "Risc de pèrdua de transparència: menys datapoints pot significar menys informació sobre impactes reals. Seguiment actiu d'ONGs i societat civil."
                  : "Riesgo de pérdida de transparencia: menos datapoints puede significar menos información sobre impactos reales. Seguimiento activo de ONGs y sociedad civil."}
              />
            </div>

            {/* Més enllà del Checkbox */}
            <div className="mt-4">
              <MesEnllaCheckbox
                criteri={lang === "ca"
                  ? "Criteri avaluat: Sostenibilitat absoluta + Justícia distributiva"
                  : "Criterio evaluado: Sostenibilidad absoluta + Justicia distributiva"}
                body={lang === "ca"
                  ? "La simplificació dels ESRS es presenta com a estalvi econòmic (3.700M€ en 5 anys), però no quantifica quin cost té en termes de transparència perduda. La reducció del 61% dels datapoints afecta sobretot la granularitat de dades —precisament el que permetria auditar si les empreses compleixen realment. El debat sobre si això afavoreix les empreses grans (que poden absorbir el reporting) versus les pimes (que es beneficien de la reducció però perden eina comparativa) queda fora del marc oficial. La justícia distributiva hauria de preguntar: qui paga l'estalvi en transparència?"
                  : "La simplificación de los ESRS se presenta como ahorro económico (3.700M€ en 5 años), pero no cuantifica qué costo tiene en términos de transparencia perdida. La reducción del 61% de los datapoints afecta sobre todo la granularidad de datos —precisamente lo que permitiría auditar si las empresas cumplen realmente. El debate sobre si esto favorece a las empresas grandes (que pueden absorber el reporting) versus las pymes (que se benefician de la reducción pero pierden herramienta comparativa) queda fuera del marco oficial. La justicia distributiva debería preguntar: ¿quién paga el ahorro en transparencia?"}
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

function SemaforRow({ label, status, note }: { label: string; status: "verd" | "groc" | "vermell"; note: string }) {
  const color = status === "verd" ? "bg-[#5C8A5C]" : status === "groc" ? "bg-[#C9A961]" : "bg-[#A0522D]";
  return (
    <div className="flex items-center gap-3 rounded-sm border border-rule bg-background px-3 py-1.5">
      <span className={`inline-block h-3 w-3 rounded-full ${color}`} aria-hidden />
      <span className="flex-1 font-medium text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{note}</span>
    </div>
  );
}

function MesEnllaCheckbox({ criteri, body }: { criteri: string; body: string }) {
  return (
    <div className="rounded-md border border-accent bg-accent-soft/15 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Compass className="h-4 w-4 text-accent" />
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
          Més enllà del Checkbox
        </p>
      </div>
      <p className="mb-2 text-xs italic text-accent-deep">
        {criteri}
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
