"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";

type StandarType = "reg" | "fw" | "cert";
type AccessType = "free" | "premium";

interface Standar {
  slug: string;
  name: string;
  type: StandarType;
  access: AccessType;
  descCa: string;
  descEs: string;
  count: number;
}

const STANDARDS: Standar[] = [
  { slug: "csrd-esrs", name: "CSRD / ESRS", type: "reg", access: "free", count: 10,
    descCa: "Directiva de reporting de sostenibilitat de la UE. Afecta ~11.500 empreses espanyoles. Defineix què han de publicar i com. Aplicació progressiva des de 2025.",
    descEs: "Directiva de reporting de sostenibilidad de la UE. Afecta a ~11.500 empresas españolas. Define qué deben publicar y cómo. Aplicación progresiva desde 2025." },
  { slug: "gri", name: "GRI", type: "fw", access: "free", count: 8,
    descCa: "Global Reporting Initiative. Estàndard de reporting més usat a Espanya. El 70%+ de l'IBEX 35 hi reporta. Universal + Topic + Sector Standards.",
    descEs: "Global Reporting Initiative. Estándar de reporting más usado en España. El 70%+ del IBEX 35 reporta con él. Universal + Topic + Sector Standards." },
  { slug: "ecovadis", name: "EcoVadis", type: "cert", access: "premium", count: 7,
    descCa: "Rating de sostenibilitat (medalla Bronze a Platinum). El més demandat per cadenes de subministrament. 4 àrees: Environment, Labor, Ethics, Procurement.",
    descEs: "Rating de sostenibilidad (medalla Bronze a Platinum). El más demandado por cadenas de suministro. 4 áreas: Environment, Labor, Ethics, Procurement." },
  { slug: "b-corp", name: "B Corp", type: "cert", access: "premium", count: 5,
    descCa: "Certificació d'empreses amb propòsit de B Lab. 400+ a Espanya. Score mínim 80/200 en B Impact Assessment. 5 àrees: gobernança, treballadors, comunitat, entorn, clients.",
    descEs: "Certificación de empresas con propósito de B Lab. 400+ en España. Score mínimo 80/200 en B Impact Assessment. 5 áreas: gobernanza, trabajadores, comunidad, entorno, clientes." },
  { slug: "msci-esg", name: "MSCI ESG", type: "cert", access: "premium", count: 6,
    descCa: "Rating ESG per a inversors (AAA-CCC). Totes les cotitzades de l'IBEX 35 el monitoritzen. Afecta al cost de capital. Avalua exposició a riscos ESG i gestió.",
    descEs: "Rating ESG para inversores (AAA-CCC). Todas las cotizadas del IBEX 35 lo monitorizan. Afecta al coste de capital. Evalúa exposición a riesgos ESG y gestión." },
  { slug: "csddd", name: "CSDDD", type: "reg", access: "free", count: 4,
    descCa: "Directiva de due diligence en drets humans i cadena de valor. Obliga a identificar, prevenir i mitigar impactes. Empreses +1.000 empleats i facturació >450M€.",
    descEs: "Directiva de due diligence en derechos humanos y cadena de valor. Obliga a identificar, prevenir y mitigar impactos. Empresas +1.000 empleados y facturación >450M€." },
  { slug: "sfdr", name: "SFDR", type: "reg", access: "free", count: 3,
    descCa: "Reglament de divulgació de finances sostenibles. Classifica productes en article 6, 8 o 9. Obliga gestores i asseguradores a reportar impacte sostenible.",
    descEs: "Reglamento de divulgación de finanzas sostenibles. Clasifica productos en artículo 6, 8 o 9. Obliga a gestoras y aseguradoras a reportar impacto sostenible." },
  { slug: "taxonomia-ue", name: "Taxonomía UE", type: "reg", access: "free", count: 5,
    descCa: "Classificació d'activitats econòmiques sostenibles. Defineix què és 'verd' amb criteris tècnics. 6 objectius: clima, aigua, economia circular, contaminació, biodiversitat.",
    descEs: "Clasificación de actividades económicas sostenibles. Define qué es 'verde' con criterios técnicos. 6 objetivos: clima, agua, economía circular, contaminación, biodiversidad." },
  { slug: "cdp", name: "CDP", type: "cert", access: "premium", count: 3,
    descCa: "Sistema de disclosure global per a clima, aigua i boscos. Les empreses responen qüestionaris i reben puntuació A- a D-. Usat per inversors i compradors corporatius.",
    descEs: "Sistema de disclosure global para clima, agua y bosques. Las empresas responden cuestionarios y reciben puntuación A- a D-. Usado por inversores y compradores corporativos." },
  { slug: "sge-21", name: "SGE 21", type: "cert", access: "premium", count: 3,
    descCa: "Sistema de Gestió Ètica de Forética. Metodologia espanyola per a la RSE. Usada per Ferrovial, Repsol, Bankinter. Certificable per auditoria. Alineada amb ISO 26000.",
    descEs: "Sistema de Gestión Ética de Forética. Metodología española para la RSE. Usada por Ferrovial, Repsol, Bankinter. Certificable por auditoría. Alineada con ISO 26000." },
  { slug: "sustainalytics", name: "Sustainalytics", type: "cert", access: "premium", count: 4,
    descCa: "Rating de risc ESG per a inversors. Escala de 5 nivells (Negligible a Severe). Competidor de MSCI ESG. Usat per les cotitzades de l'IBEX 35.",
    descEs: "Rating de riesgo ESG para inversores. Escala de 5 niveles (Negligible a Severe). Competidor de MSCI ESG. Usado por las cotizadas del IBEX 35." },
  { slug: "sasb", name: "SASB", type: "fw", access: "free", count: 3,
    descCa: "Sustainability Accounting Standards Board. Estàndards de reporting financer-sostenibilitat per sector (77 indústries). Crecient en cotitzades. Integrat en ISSB.",
    descEs: "Sustainability Accounting Standards Board. Estándares de reporting financiero-sostenibilidad por sector (77 industrias). Creciente en cotizadas. Integrado en ISSB." },
  { slug: "tnfd", name: "TNFD", type: "fw", access: "free", count: 2,
    descCa: "Taskforce on Nature-related Financial Disclosures. Framework per reportar dependències i impactes sobre la natura. Llançat el 2023. Complementa TCFD.",
    descEs: "Taskforce on Nature-related Financial Disclosures. Framework para reportar dependencias e impactes sobre la naturaleza. Lanzado en 2023. Complementa TCFD." },
  { slug: "tcfd", name: "TCFD", type: "fw", access: "free", count: 4,
    descCa: "Taskforce on Climate-related Financial Disclosures. Framework per reportar riscos i oportunitats climàtiques. 4 pilars: gobernança, estratègia, riscos, mètriques. Base de l'ESRS E1.",
    descEs: "Taskforce on Climate-related Financial Disclosures. Framework para reportar riesgos y oportunidades climáticas. 4 pilares: gobernanza, estrategia, riesgos, métricas. Base del ESRS E1." },
  { slug: "emas", name: "EMAS", type: "reg", access: "free", count: 2,
    descCa: "Sistema comunitari d'eco-gestió i auditoria de la UE. Certificació voluntària però regulada. Més exigent que ISO 14001: inclou declaració ambiental validada. ~4.000 organitzacions.",
    descEs: "Sistema comunitario de eco-gestión y auditoría de la UE. Certificación voluntaria pero regulada. Más exigente que ISO 14001: incluye declaración ambiental validada. ~4.000 organizaciones." },
  { slug: "iso-26000", name: "ISO 26000", type: "fw", access: "free", count: 2,
    descCa: "Guia internacional de responsabilitat social. No certificable però serveix de marc de referència. 7 àrees: gobernança, drets humans, pràctiques laborals, medi ambient, consumidors, comunitat.",
    descEs: "Guía internacional de responsabilidad social. No certificable pero sirve de marco de referencia. 7 áreas: gobernanza, derechos humanos, prácticas laborales, medio ambiente, consumidores, comunidad." },
];

const TYPE_CONFIG: Record<StandarType, { borderColor: string; badgeBg: string; badgeColor: string; labelCa: string; labelEs: string }> = {
  reg: { borderColor: "#5C3A1E", badgeBg: "rgba(92,58,30,0.15)", badgeColor: "#5C3A1E", labelCa: "Regulació", labelEs: "Regulación" },
  fw: { borderColor: "#B87333", badgeBg: "rgba(184,115,51,0.12)", badgeColor: "#B87333", labelCa: "Framework", labelEs: "Framework" },
  cert: { borderColor: "#E8C99A", badgeBg: "rgba(232,201,154,0.25)", badgeColor: "#8A6D2B", labelCa: "Certificació", labelEs: "Certificación" },
};

export default function EstandaresPage() {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);

  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        onOpenPreus={() => setPreusOpen(true)}
        onOpenAuth={(tab) => { setAuthOpen(true); }}
      />
      <main className="flex-1">
        {/* Page hero */}
        <section className="border-b border-rule bg-secondary/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="eyebrow mb-2">{tr("ESTÀNARDS ESG", "ESTÁNDARES ESG")}</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              {tr("Els teus estàndards, el nostre cross-reference.", "Tus estándares, nuestro cross-reference.")}
            </h1>
            <div className="rule-accent my-5" />
            <p className="max-w-2xl text-base leading-relaxed text-foreground/80">
              {tr(
                "Cada informe es mapeja amb regulacions, frameworks i certificacions. Selecciona el teu per veure quins informes t'afecten i quines accions prendre.",
                "Cada informe se mapea con regulaciones, frameworks y certificaciones. Selecciona el tuyo para ver qué informes te afectan y qué acciones tomar."
              )}
            </p>
          </div>
        </section>

        {/* Legend */}
        <section className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2.5">
                <span className="inline-block w-1.5 h-5 rounded-sm" style={{ background: "#5C3A1E" }} />
                <span className="text-xs">{tr("Regulacions (obligatòries)", "Regulaciones (obligatorias)")}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="inline-block w-1.5 h-5 rounded-sm" style={{ background: "#B87333" }} />
                <span className="text-xs">{tr("Frameworks (estàndards de reporting)", "Frameworks (estándares de reporting)")}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="inline-block w-1.5 h-5 rounded-sm" style={{ background: "#E8C99A" }} />
                <span className="text-xs">{tr("Certificacions i ratings", "Certificaciones y ratings")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Grid de estàndards */}
        <section className="pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STANDARDS.map((s) => {
                const cfg = TYPE_CONFIG[s.type];
                return (
                  <div
                    key={s.slug}
                    onClick={() => router.push(`/estandares-esg/${s.slug}`)}
                    className="relative cursor-pointer rounded-lg border border-rule bg-card p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                    style={{ borderLeft: `8px solid ${cfg.borderColor}` }}
                  >
                    <div className="mb-2 flex items-center gap-1.5">
                      <span
                        className="inline-block rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider"
                        style={{ background: cfg.badgeBg, color: cfg.badgeColor }}
                      >
                        {tr(cfg.labelCa, cfg.labelEs)}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${
                          s.access === "free"
                            ? "bg-[#5C8A5C]/12 text-[#4A6B3A]"
                            : "bg-foreground/8 text-foreground"
                        }`}
                      >
                        {s.access === "free" ? (lang === "ca" ? "Gratuït" : "Gratis") : "Premium"}
                      </span>
                    </div>
                    <h3 className="mb-1.5 font-serif text-base font-semibold text-primary">{s.name}</h3>
                    <p className="mb-3 text-xs leading-relaxed text-muted-foreground" style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {tr(s.descCa, s.descEs)}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
                      {s.count} {tr("informes cross-ref", "informes cross-ref")}
                    </p>
                    {s.access === "premium" && (
                      <Lock className="absolute right-4 top-4 h-3.5 w-3.5 text-muted-foreground/50" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="register" />
      <PreusDialog
        open={preusOpen}
        onOpenChange={setPreusOpen}
        onOpenRegister={() => setAuthOpen(true)}
      />
    </div>
  );
}
