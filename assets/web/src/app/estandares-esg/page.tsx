"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";

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
    descCa: "Directiva de reporting de sostenibilitat de la UE. Afecta ~11.500 empreses espanyoles.",
    descEs: "Directiva de reporting de sostenibilidad de la UE. Afecta a ~11.500 empresas españolas." },
  { slug: "csddd", name: "CSDDD", type: "reg", access: "free", count: 4,
    descCa: "Directiva de due diligence en drets humans. Empreses +1.000 empleats.",
    descEs: "Directiva de due diligence en derechos humanos. Empresas +1.000 empleados." },
  { slug: "sfdr", name: "SFDR", type: "reg", access: "free", count: 3,
    descCa: "Reglament de divulgació de finances sostenibles. Articles 6, 8 i 9.",
    descEs: "Reglamento de divulgación de finanzas sostenibles. Artículos 6, 8 y 9." },
  { slug: "taxonomia-ue", name: "Taxonomía UE", type: "reg", access: "free", count: 5,
    descCa: "Classificació d'activitats sostenibles. 6 objectius. Defineix què és 'verd'.",
    descEs: "Clasificación de actividades sostenibles. 6 objetivos. Define qué es 'verde'." },
  { slug: "emas", name: "EMAS", type: "reg", access: "free", count: 2,
    descCa: "Sistema comunitari d'eco-gestió i auditoria. UE. Més exigent que ISO 14001.",
    descEs: "Sistema comunitario de eco-gestión y auditoría. UE. Más exigente que ISO 14001." },
  { slug: "gri", name: "GRI", type: "fw", access: "free", count: 8,
    descCa: "Framework de reporting més usat. 70%+ de l'IBEX 35 hi reporta.",
    descEs: "Framework de reporting más usado. 70%+ del IBEX 35 reporta con él." },
  { slug: "sasb", name: "SASB", type: "fw", access: "free", count: 3,
    descCa: "Estàndards de reporting per sector. 77 indústries. Integrat en ISSB.",
    descEs: "Estándares de reporting por sector. 77 industrias. Integrado en ISSB." },
  { slug: "tnfd", name: "TNFD", type: "fw", access: "free", count: 2,
    descCa: "Framework de natura. Riscos i dependències. Complementa TCFD.",
    descEs: "Framework de naturaleza. Riesgos y dependencias. Complementa TCFD." },
  { slug: "tcfd", name: "TCFD", type: "fw", access: "free", count: 4,
    descCa: "Framework climàtic. 4 pilars: gobernança, estratègia, riscos, mètriques.",
    descEs: "Framework climático. 4 pilares: gobernanza, estrategia, riesgos, métricas." },
  { slug: "iso-26000", name: "ISO 26000", type: "fw", access: "free", count: 2,
    descCa: "Guia de responsabilitat social. No certificable. 7 àrees.",
    descEs: "Guía de responsabilidad social. No certificable. 7 áreas." },
  { slug: "ecovadis", name: "EcoVadis", type: "cert", access: "premium", count: 7,
    descCa: "Rating de sostenibilitat. Medalles Bronze a Platinum. Cadenes de subministrament.",
    descEs: "Rating de sostenibilidad. Medallas Bronze a Platinum. Cadenas de suministro." },
  { slug: "b-corp", name: "B Corp", type: "cert", access: "premium", count: 5,
    descCa: "Certificació d'empreses amb propòsit. Score mínim 80/200.",
    descEs: "Certificación de empresas con propósito. Score mínimo 80/200." },
  { slug: "msci-esg", name: "MSCI ESG", type: "cert", access: "premium", count: 6,
    descCa: "Rating ESG per a inversors (AAA-CCC). Afecta al cost de capital.",
    descEs: "Rating ESG para inversores (AAA-CCC). Afecta al coste de capital." },
  { slug: "cdp", name: "CDP", type: "cert", access: "premium", count: 3,
    descCa: "Disclosure global de clima, aigua i boscos. Puntuació A- a D-.",
    descEs: "Disclosure global de clima, agua y bosques. Puntuación A- a D-." },
  { slug: "sge-21", name: "SGE 21", type: "cert", access: "premium", count: 3,
    descCa: "Sistema de Gestió Ètica de Forética. Metodologia espanyola.",
    descEs: "Sistema de Gestión Ética de Forética. Metodología española." },
  { slug: "sustainalytics", name: "Sustainalytics", type: "cert", access: "premium", count: 4,
    descCa: "Rating de risc ESG. 5 nivells (Negligible a Severe). Competidor de MSCI.",
    descEs: "Rating de riesgo ESG. 5 niveles (Negligible a Severe). Competidor de MSCI." },
];

const TYPE_CONFIG: Record<StandarType, { color: string; labelCa: string; labelEs: string }> = {
  reg: { color: "#5C3A1E", labelCa: "Regulació", labelEs: "Regulación" },
  fw: { color: "#B87333", labelCa: "Framework", labelEs: "Framework" },
  cert: { color: "#E8C99A", labelCa: "Certificació", labelEs: "Certificación" },
};

export default function EstandaresPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [preusOpen, setPreusOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  const filteredStandards = STANDARDS.filter((s) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.descEs.toLowerCase().includes(q) || s.descCa.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={() => setAuthOpen(true)} />
      <main className="flex-1">
        {/* PAGE HEADER */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>
                    {tr("Estàndards ESG · 2026", "Estándares ESG · 2026")}
                  </p>
                </div>
                <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight text-primary">
                  {tr("Els ", "Los ")}<em className="italic" style={{ color: "#5C3A1E" }}>{tr("16 estàndards", "16 estándares")}</em>{tr(" que un director de sostenibilitat no hauria de confondre.", " que un director de sostenibilidad no debería confundir.")}
                </h1>
                {/* 3 conceptes amb colors */}
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <span className="font-serif italic text-base font-medium px-3.5 py-1.5" style={{ background: "#5C3A1E", color: "#F5EFE6" }}>
                    {tr("Una regulació t'obliga", "Una regulación te obliga")}
                  </span>
                  <span className="font-serif italic text-base font-medium px-3.5 py-1.5" style={{ background: "#B87333", color: "#F5EFE6" }}>
                    {tr("Un framework t'orienta", "Un framework te orienta")}
                  </span>
                  <span className="font-serif italic text-base font-medium px-3.5 py-1.5" style={{ background: "#E8C99A", color: "#5C3A1E" }}>
                    {tr("Una certificació t'avalua", "Una certificación te evalúa")}
                  </span>
                </div>
                <p className="mt-4 font-serif text-base italic" style={{ color: "#5C3A1E" }}>
                  {tr("Confondre-les té conseqüències operatives reals.", "Confundirlas tiene consecuencias operativas reales.")}
                </p>
              </div>
              {/* Big number */}
              <div className="text-right">
                <span className="font-serif font-light leading-none" style={{ fontSize: "clamp(5rem, 10vw, 7.5rem)", color: "#2C1810", letterSpacing: "-0.05em" }}>
                  16<sup className="font-mono text-xs font-medium align-top ml-1" style={{ color: "#B87333", letterSpacing: "0.15em" }}>EST.</sup>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* LEGEND + SEARCH */}
        <section className="border-b py-6" style={{ background: "#F5EFE6", borderColor: "#C9B89A" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-[18px] h-1" style={{ background: "#5C3A1E" }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#5C3A1E" }}>
                    {tr("Regulacions (5)", "Regulaciones (5)")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-[18px] h-1" style={{ background: "#B87333" }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#5C3A1E" }}>
                    {tr("Frameworks (5)", "Frameworks (5)")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-[18px] h-1" style={{ background: "#E8C99A" }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#5C3A1E" }}>
                    {tr("Certificacions (6)", "Certificaciones (6)")}
                  </span>
                </div>
              </div>
              <input
                type="text"
                placeholder={tr("Cercar estàndard...", "Buscar estándar...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border px-3.5 py-2 text-sm"
                style={{ background: "white", borderColor: "#C9B89A", color: "#2C1810", width: "220px" }}
              />
            </div>
          </div>
        </section>

        {/* GRID 4 COLS */}
        <section className="py-10" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredStandards.map((s, i) => {
                const cfg = TYPE_CONFIG[s.type];
                return (
                  <div
                    key={s.slug}
                    onClick={() => router.push(`/estandares-esg/${s.slug}`)}
                    className="cursor-pointer border transition-all hover:shadow-md hover:-translate-y-0.5"
                    style={{ borderColor: "#C9B89A", background: "white" }}
                  >
                    {/* Franja superior color categoria */}
                    <div style={{ height: "6px", background: cfg.color }} />
                    <div className="flex flex-col gap-2.5 p-5">
                      <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: "rgba(201,184,154,0.5)" }}>
                        <span className="font-mono text-[9.5px] font-semibold" style={{ color: "#8B7355", letterSpacing: "0.08em" }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] font-semibold px-1.5 py-0.5"
                          style={s.access === "free"
                            ? { background: "rgba(92,138,92,0.12)", color: "#4A6B3A" }
                            : { background: "#B87333", color: "white" }
                          }>
                          {s.access === "free" ? (lang === "ca" ? "Gratis" : "Gratis") : "Premium"}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.22em] font-semibold" style={{ color: cfg.color }}>
                        {tr(cfg.labelCa, cfg.labelEs)}
                      </span>
                      <h3 className="font-serif text-lg font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>
                        {s.name}
                      </h3>
                      <p className="text-[11.5px] leading-relaxed" style={{ color: "#5C3A1E" }}>
                        {tr(s.descCa, s.descEs)}
                      </p>
                      <div className="mt-auto flex items-center justify-between border-t pt-3" style={{ borderColor: "rgba(201,184,154,0.5)" }}>
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] font-medium" style={{ color: "#8B7355" }}>
                          <strong style={{ color: "#B87333", fontWeight: 700 }}>{s.count}</strong> {tr("informes", "informes")}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#B87333", borderBottom: "1px solid #B87333", paddingBottom: "2px" }}>
                          {tr("Veure →", "Ver →")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab="register" />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => setAuthOpen(true)} />
    </div>
  );
}
