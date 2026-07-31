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
  count: number;
  descCa: string;
  descEs: string;
  logoUrl?: string;
}

const standards: Standar[] = [
  { slug: "csrd-esrs", name: "CSRD / ESRS", type: "reg", access: "free", count: 10, descCa: "Directiva de reporting de sostenibilitat de la UE. Afecta ~11.500 empreses espanyoles.", descEs: "Directiva de reporting de sostenibilidad de la UE. Afecta a ~11.500 empresas españolas.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" },
  { slug: "csddd", name: "CSDDD", type: "reg", access: "free", count: 4, descCa: "Deure de diligència en drets humans per a empreses >1000 empleats.", descEs: "Deber de diligencia en derechos humanos para empresas >1000 empleados.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" },
  { slug: "sfdr", name: "SFDR", type: "reg", access: "free", count: 3, descCa: "Regulació de disclosure financer. Articles 6, 8 i 9.", descEs: "Regulación de disclosure financiero. Artículos 6, 8 y 9.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" },
  { slug: "taxonomia-ue", name: "Taxonomía UE", type: "reg", access: "free", count: 5, descCa: "Classificació d'activitats econòmiques sostenibles. 6 objectius.", descEs: "Clasificación de actividades económicas sostenibles. 6 objetivos.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" },
  { slug: "emas", name: "EMAS", type: "reg", access: "free", count: 2, descCa: "Sistema comunitari d'eco-gestió i auditoria. UE.", descEs: "Sistema comunitario de eco-gestión y auditoría. UE.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" },
  { slug: "gri", name: "GRI", type: "fw", access: "free", count: 8, descCa: "Global Reporting Initiative. Estàndard més usat a Espanya.", descEs: "Global Reporting Initiative. Estándar más usado en España.", logoUrl: "https://www.globalreporting.org/themes/custom/gri/images/logo.svg" },
  { slug: "sasb", name: "SASB", type: "fw", access: "free", count: 3, descCa: "Framework de reporting per indústria. 77 indústries.", descEs: "Framework de reporting por industria. 77 industrias.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/IFRS_Foundation_logo.svg/120px-IFRS_Foundation_logo.svg.png" },
  { slug: "tnfd", name: "TNFD", type: "fw", access: "free", count: 4, descCa: "Framework de natura. Riscos i dependències.", descEs: "Framework de naturaleza. Riesgos y dependencias.", logoUrl: "https://tnfd.global/wp-content/uploads/2023/09/tnfd-logo.svg" },
  { slug: "tcfd", name: "TCFD", type: "fw", access: "free", count: 6, descCa: "Framework climàtic. Recomanacions de disclosure.", descEs: "Framework climático. Recomendaciones de disclosure.", logoUrl: "https://www.fsb-tcfd.org/wp-content/uploads/2021/03/TCFD-logo-300x77.png" },
  { slug: "iso-26000", name: "ISO 26000", type: "fw", access: "free", count: 2, descCa: "Guia de responsabilitat social. No certificable.", descEs: "Guía de responsabilidad social. No certificable.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/ISO_Logo.svg/120px-ISO_Logo.svg.png" },
  { slug: "ecovadis", name: "EcoVadis", type: "cert", access: "premium", count: 7, descCa: "Rating de sostenibilitat per a cadenes de subministrament.", descEs: "Rating de sostenibilidad para cadenas de suministro.", logoUrl: "https://ecovadis.com/wp-content/uploads/2022/02/ecovadis-logo.svg" },
  { slug: "b-corp", name: "B Corp", type: "cert", access: "premium", count: 5, descCa: "Certificació d'empreses amb propòsit de B Lab.", descEs: "Certificación de empresas con propósito de B Lab.", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/B_Corporation_logo.svg/120px-B_Corporation_logo.svg.png" },
  { slug: "msci-esg", name: "MSCI ESG", type: "cert", access: "premium", count: 6, descCa: "Rating ESG per a inversors (AAA-CCC).", descEs: "Rating ESG para inversores (AAA-CCC).", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/MSCI_logo.svg/120px-MSCI_logo.svg.png" },
  { slug: "cdp", name: "CDP", type: "cert", access: "premium", count: 3, descCa: "Disclosure global de clima, aigua i boscos.", descEs: "Disclosure global de clima, agua y bosques.", logoUrl: "https://cdp.net/themes/custom/cdp/images/cdp-logo.svg" },
  { slug: "sge-21", name: "SGE 21", type: "cert", access: "premium", count: 3, descCa: "Sistema de Gestió Ètica de Forética. Metodologia espanyola.", descEs: "Sistema de Gestión Ética de Forética. Metodología española.", logoUrl: "https://www.foretica.org/wp-content/themes/foretica/img/logo-foretica.svg" },
  { slug: "sustainalytics", name: "Sustainalytics", type: "cert", access: "premium", count: 4, descCa: "Rating de risc ESG per a inversors. 5 nivells.", descEs: "Rating de riesgo ESG para inversores. 5 niveles.", logoUrl: "https://www.sustainalytics.com/sites/g/files/pkgnbr2416/themes/site/files/sustainalytics-logo.svg" },
];

const catConfig: Record<StandarType, { color: string; labelCa: string; labelEs: string }> = {
  reg: { color: "#5C3A1E", labelCa: "Regulació · UE", labelEs: "Regulación · UE" },
  fw: { color: "#B87333", labelCa: "Framework · Global", labelEs: "Framework · Global" },
  cert: { color: "#E8C99A", labelCa: "Certificació", labelEs: "Certificación" },
};

export default function EstandaresPage() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [filterReg, setFilterReg] = useState(true);
  const [filterFw, setFilterFw] = useState(true);
  const [filterCert, setFilterCert] = useState(true);
  const [search, setSearch] = useState("");

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };

  const filtered = standards.filter((s) => {
    if (s.type === "reg" && !filterReg) return false;
    if (s.type === "fw" && !filterFw) return false;
    if (s.type === "cert" && !filterCert) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tr = (ca: string, es: string) => (lang === "ca" ? ca : es);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* PAGE HEADER */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>Estándares ESG · 2026</p>
                </div>
                <h1 className="mb-4 font-serif text-5xl font-medium leading-tight tracking-tight text-primary">
                  {lang === "ca" ? "Els " : "Los "}<em className="italic" style={{ color: "#5C3A1E" }}>{lang === "ca" ? "16 estàndards" : "16 estándares"}</em>{lang === "ca" ? " que un director de sostenibilitat no hauria de confondre." : " que un director de sostenibilidad no debería confundir."}
                </h1>
                {/* 3 conceptes amb colors */}
                <div className="mb-4 flex flex-wrap gap-2.5">
                  <span className="font-serif text-base italic font-medium px-3.5 py-1.5" style={{ background: "#5C3A1E", color: "#F5EFE6" }}>{lang === "ca" ? "Una regulació t'obliga" : "Una regulación te obliga"}</span>
                  <span className="font-serif text-base italic font-medium px-3.5 py-1.5" style={{ background: "#B87333", color: "#F5EFE6" }}>{lang === "ca" ? "Un framework t'orienta" : "Un framework te orienta"}</span>
                  <span className="font-serif text-base italic font-medium px-3.5 py-1.5" style={{ background: "#E8C99A", color: "#5C3A1E" }}>{lang === "ca" ? "Una certificació t'avalua" : "Una certificación te evalúa"}</span>
                </div>
                <p className="font-serif text-lg italic" style={{ color: "#5C3A1E" }}>{lang === "ca" ? "Confondre-les té conseqüències operatives reals." : "Confundirlas tiene consecuencias operativas reales."}</p>
              </div>
              <div className="font-serif text-[120px] font-light leading-none text-primary" style={{ letterSpacing: "-0.05em" }}>16<sup className="font-mono text-[12px] font-medium" style={{ color: "#B87333", letterSpacing: "0.15em", textTransform: "uppercase", verticalAlign: "top", marginLeft: "6px" }}>est.</sup></div>
            </div>
          </div>
        </section>

        {/* LEGEND + FILTRES */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#8B7355" }}>{lang === "ca" ? "Filtrar:" : "Filtrar:"}</span>
                <button onClick={() => setFilterReg(!filterReg)} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-3.5 py-2 border" style={{ background: filterReg ? "#2C1810" : "white", color: filterReg ? "#F5EFE6" : "#5C3A1E", borderColor: filterReg ? "#2C1810" : "#C9B89A" }}>
                  <span className="inline-block w-[18px] h-1" style={{ background: "#5C3A1E" }} />{lang === "ca" ? "Regulacions (5)" : "Regulaciones (5)"}
                </button>
                <button onClick={() => setFilterFw(!filterFw)} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-3.5 py-2 border" style={{ background: filterFw ? "#2C1810" : "white", color: filterFw ? "#F5EFE6" : "#5C3A1E", borderColor: filterFw ? "#2C1810" : "#C9B89A" }}>
                  <span className="inline-block w-[18px] h-1" style={{ background: "#B87333" }} />Frameworks (5)
                </button>
                <button onClick={() => setFilterCert(!filterCert)} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-3.5 py-2 border" style={{ background: filterCert ? "#2C1810" : "white", color: filterCert ? "#F5EFE6" : "#5C3A1E", borderColor: filterCert ? "#2C1810" : "#C9B89A" }}>
                  <span className="inline-block w-[18px] h-1" style={{ background: "#E8C99A" }} />{lang === "ca" ? "Certificacions (6)" : "Certificaciones (6)"}
                </button>
              </div>
              <input type="text" placeholder={lang === "ca" ? "Cercar estàndard..." : "Buscar estándar..."} value={search} onChange={(e) => setSearch(e.target.value)} className="border px-3.5 py-2 text-sm" style={{ background: "white", borderColor: "#C9B89A", color: "#2C1810", width: "220px" }} />
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="py-10" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filtered.map((s, i) => {
                const cfg = catConfig[s.type];
                return (
                  <div key={s.slug} className="flex cursor-pointer flex-col border" style={{ borderColor: "#C9B89A", background: "white" }} onClick={() => router.push(`/estandares-esg/${s.slug}`)}>
                    <div className="h-1.5" style={{ background: cfg.color }} />
                    <div className="flex flex-col gap-2.5 p-5">
                      <div className="flex justify-between border-b pb-2" style={{ borderColor: "rgba(201,184,154,0.5)" }}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9.5px] font-semibold" style={{ color: "#8B7355" }}>{String(i + 1).padStart(2, "0")}</span>
                        {s.logoUrl && <img src={s.logoUrl} alt={s.name} className="h-5 w-5 object-contain" />}
                      </div>
                      <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] font-semibold px-1.5 py-0.5" style={{ background: s.access === "free" ? "rgba(92,138,92,0.12)" : "#B87333", color: s.access === "free" ? "#4A6B3A" : "white" }}>{s.access === "free" ? (lang === "ca" ? "Gratis" : "Gratis") : "Premium"}</span>
                    </div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: cfg.color }}>{tr(cfg.labelCa, cfg.labelEs)}</span>
                      <h3 className="font-serif text-lg font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>{s.name}</h3>
                      <p className="text-[11.5px] leading-relaxed" style={{ color: "#5C3A1E" }}>{tr(s.descCa, s.descEs)}</p>
                      <div className="mt-auto flex justify-between border-t pt-3" style={{ borderColor: "rgba(201,184,154,0.5)" }}>
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: "#8B7355" }}><strong style={{ color: "#B87333", fontWeight: 700 }}>{s.count}</strong> {lang === "ca" ? "informes" : "informes"}</span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#B87333", borderBottom: "1px solid #B87333", paddingBottom: "2px" }}>Ver →</span>
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
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
