"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { RegisterDialog } from "@/components/register-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { QuiSomDialog } from "@/components/qui-som-dialog";
import { useLanguage } from "@/components/language-provider";
import {
  reports,
  isFreeAccess,
  formatDate,
  getTypeLabel,
  getScopeLabel,
  type SemaforStatus,
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function InformeSlugPage() {
  const { lang } = useLanguage();
  const params = useParams();
  const slugRaw = params?.slug;
  const slug =
    typeof slugRaw === "string"
      ? slugRaw
      : Array.isArray(slugRaw)
        ? slugRaw[0] ?? ""
        : "";

  const [isRegistered, setIsRegistered] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [quiSomOpen, setQuiSomOpen] = useState(false);

  const report = reports.find((r) => r.slug === slug);

  // Els diàlegs sempre es renderitzen (estables entre renders)
  const dialogs = (
    <>
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => setRegisterOpen(true)}
      />
      <QuiSomDialog open={quiSomOpen} onOpenChange={setQuiSomOpen} />
    </>
  );

  if (!report) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header
          onOpenPreus={() => setPreusOpen(true)}
          onOpenQuiSom={() => setQuiSomOpen(true)}
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
        <Footer />
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
  // - Informe > 6 mesos: requereix registre
  // - Informe recent (< 6 mesos): requereix Premium
  const isLockedPremium = !isProbeReport && !isFree;
  const isLockedRegister = !isProbeReport && isFree && !isRegistered;
  const isLocked = isLockedPremium || isLockedRegister;

  const handleRegister = () => {
    // Simulació: en clicar per registrar-se, ja es considera registrat
    setIsRegistered(true);
    setRegisterOpen(true);
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
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenQuiSom={() => setQuiSomOpen(true)}
      />
      <main className="flex-1">
        {/* Capçalera de l'informe */}
        <section className="border-b border-rule bg-secondary/30">
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {lang === "ca" ? "Informes" : "Informes"} &gt; {report.institution}
            </p>
            <p className="eyebrow mt-4">
              {report.institution} · {formatDate(report.date, lang)} · {report.pages}{" "}
              {lang === "ca" ? "pàgines" : "páginas"}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
              {report.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="border border-accent/30 bg-accent-soft/20 text-accent-deep"
              >
                {getTypeLabel(report.type)}
              </Badge>
              <Badge
                variant="secondary"
                className="border border-accent/30 bg-accent-soft/20 text-accent-deep"
              >
                {getScopeLabel(report.scope)}
              </Badge>
              {showFreeBadge ? (
                <Badge
                  variant="secondary"
                  className="border border-accent bg-accent-soft/40 text-accent-deep"
                >
                  {lang === "ca" ? "Accés obert" : "Acceso abierto"}
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="border border-muted-foreground text-muted-foreground"
                >
                  Premium
                </Badge>
              )}
              {report.certifications.slice(0, 4).map((cert) => (
                <Badge
                  key={cert}
                  variant="outline"
                  className="border-accent/40 text-accent-deep"
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Cos: pantalla de bloqueig o 8 blocs */}
        {isLocked ? (
          <LockScreen
            isPremium={isLockedPremium}
            lang={lang}
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
          <div className="mx-auto max-w-4xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
            {/* Bloc 0 — Semàfor Metodològic (destacat) */}
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

            {/* Bloc 1 — Fitxa tècnica */}
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

            {/* Bloc 2 — 5 dades clau */}
            <Bloc
              num="2"
              icon={<TrendingUp className="h-4 w-4" />}
              title={lang === "ca" ? "5 dades clau" : "5 datos clave"}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {content.dadesClau.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-rule bg-background p-4"
                  >
                    <p className="font-serif text-3xl font-semibold text-accent">
                      {d.value}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                      {d.label}
                    </p>
                    {d.page && (
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {d.page}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Bloc>

            {/* Bloc 3 — Resum executiu */}
            <Bloc
              num="3"
              icon={<Layers className="h-4 w-4" />}
              title={lang === "ca" ? "Resum executiu" : "Resumen ejecutivo"}
            >
              <p className="text-sm leading-relaxed text-foreground/85">
                {content.resumExecutiu}
              </p>
            </Bloc>

            {/* Bloc 4 — Implicacions + Més enllà del Checkbox */}
            <Bloc
              num="4"
              icon={<Target className="h-4 w-4" />}
              title={lang === "ca" ? "Implicacions" : "Implicaciones"}
            >
              <div className="grid gap-4 md:grid-cols-3">
                <ImplicationBlock
                  label={lang === "ca" ? "Empreses" : "Empresas"}
                  body={content.implicacions.empreses}
                />
                <ImplicationBlock
                  label={lang === "ca" ? "Reguladors" : "Reguladores"}
                  body={content.implicacions.reguladors}
                />
                <ImplicationBlock
                  label={lang === "ca" ? "Ciutadans" : "Ciudadanos"}
                  body={content.implicacions.ciutadans}
                />
              </div>

              <div className="mt-4 rounded-md border border-accent bg-accent-soft/15 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Compass className="h-4 w-4 text-accent" />
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
                    {lang === "ca" ? "Més enllà del Checkbox" : "Más allá del Checkbox"}
                  </p>
                </div>
                <p className="mb-2 text-sm italic text-accent-deep">
                  {content.mesEnllaCheckbox.criteri}
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {content.mesEnllaCheckbox.body}
                </p>
              </div>
            </Bloc>

            {/* Bloc 5 — Connexions */}
            <Bloc
              num="5"
              icon={<Network className="h-4 w-4" />}
              title={lang === "ca" ? "Connexions" : "Conexiones"}
            >
              <div className="space-y-2">
                {content.connexions.map((c, i) => {
                  const isContradiction =
                    c.type === "Contradicció" || c.type === "Contradicción";
                  const isComplement =
                    c.type === "Complement" || c.type === "Complemento";
                  const badgeClass = isContradiction
                    ? "border-[#A0522D]/40 bg-[#A0522D]/10 text-[#A0522D]"
                    : isComplement
                      ? "border-[#5C8A5C]/40 bg-[#5C8A5C]/10 text-[#5C8A5C]"
                      : "border-accent/40 bg-accent-soft/20 text-accent-deep";
                  return (
                    <div
                      key={i}
                      className="rounded-md border border-rule bg-background p-4"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className={badgeClass}>
                          {c.type}
                        </Badge>
                        <span className="font-serif text-sm font-semibold text-primary">
                          {c.target}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/75">
                        {c.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Bloc>

            {/* Bloc 6 — Accions recomanades (destacat) */}
            <Bloc
              num="6"
              icon={<ClipboardCheck className="h-4 w-4" />}
              title={lang === "ca" ? "Accions recomanades" : "Acciones recomendadas"}
              highlighted
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {content.accions.map((a) => (
                  <div
                    key={a.num}
                    className="rounded-md border border-accent/40 bg-background p-4"
                  >
                    <div className="mb-2 flex items-baseline gap-3">
                      <span className="font-serif text-3xl font-semibold text-accent">
                        {a.num}
                      </span>
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 flex-shrink-0 text-accent" />
                        <h4 className="font-serif text-base font-semibold leading-tight text-primary">
                          {a.title}
                        </h4>
                      </div>
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-foreground/80">
                      {a.desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-widest">
                      <span className="text-muted-foreground">
                        {lang === "ca" ? "Esforç" : "Esfuerzo"}: {a.effort}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-accent-deep">
                        {lang === "ca" ? "Impacte" : "Impacto"}: {a.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Bloc>

            {/* Bloc 7 — Cross-reference (destacat) */}
            <Bloc
              num="7"
              icon={<BookOpen className="h-4 w-4" />}
              title={
                lang === "ca"
                  ? "Cross-reference amb certificacions"
                  : "Cross-reference con certificaciones"
              }
              highlighted
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {content.crossRefs.map((cr, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-accent/40 bg-background p-4"
                  >
                    <div className="mb-2 flex items-baseline justify-between gap-2">
                      <span className="font-serif text-lg font-semibold text-accent">
                        {cr.framework}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-accent-deep">
                        {lang === "ca" ? "Impacte" : "Impacto"}: {cr.impact}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {cr.criterion}
                    </p>
                  </div>
                ))}
              </div>
            </Bloc>

            {/* Nota final + CTA a la font original */}
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
        )}
      </main>
      <Footer />
      {dialogs}
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
                : "Este informe es de acceso abierto para usuarios registrados. Crea una cuenta gratuita para acceder a los 8 bloques: semáforo, ficha técnica, datos clave, resumen ejecutivo y acciones recomendadas."}
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
