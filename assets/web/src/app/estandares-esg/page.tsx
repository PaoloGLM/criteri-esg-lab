"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";
import { STANDARDS, TYPE_CONFIG, getStandardsWithCounts } from "@/lib/standards-data";

export default function EstandaresPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [filterReg, setFilterReg] = useState(true);
  const [filterFw, setFilterFw] = useState(true);
  const [filterCert, setFilterCert] = useState(true);
  const [search, setSearch] = useState("");

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };

  // Font única de veritat: count derivat de xrefRows
  const standards = getStandardsWithCounts();

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
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-8 lg:py-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>Estándares ESG · 2026</p>
                </div>
                <h1 className="mb-4 font-serif text-5xl font-medium leading-tight tracking-tight text-primary">
                  {lang === "ca" ? "Els " : "Los "}<em className="italic" style={{ color: "#141B18" }}>{lang === "ca" ? "16 estàndards" : "16 estándares"}</em>{lang === "ca" ? " que un director de sostenibilitat no hauria de confondre." : " que un director de sostenibilidad no debería confundir."}
                </h1>
                <div className="mb-4 flex flex-wrap gap-2.5">
                  <span className="font-serif text-base italic font-medium px-3.5 py-1.5" style={{ background: "#141B18", color: "#F2F5F1" }}>{lang === "ca" ? "Una regulació t'obliga" : "Una regulación te obliga"}</span>
                  <span className="font-serif text-base italic font-medium px-3.5 py-1.5" style={{ background: "#5E8772", color: "#F2F5F1" }}>{lang === "ca" ? "Un framework t'orienta" : "Un framework te orienta"}</span>
                  <span className="font-serif text-base italic font-medium px-3.5 py-1.5" style={{ background: "#AAC9B6", color: "#141B18" }}>{lang === "ca" ? "Una certificació t'avalua" : "Una certificación te evalúa"}</span>
                </div>
                <p className="font-serif text-lg italic" style={{ color: "#141B18" }}>{lang === "ca" ? "Confondre-les té conseqüències operatives reals." : "Confundirlas tiene consecuencias operativas reales."}</p>
              </div>
              <div className="font-serif text-[120px] font-light leading-none text-primary" style={{ letterSpacing: "-0.05em" }}>16<sup className="font-mono text-[12px] font-medium" style={{ color: "#5E8772", letterSpacing: "0.15em", textTransform: "uppercase", verticalAlign: "top", marginLeft: "6px" }}>est.</sup></div>
            </div>
          </div>
        </section>

        {/* LEGEND + FILTRES */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-[1600px] px-6 py-4 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#4A5F53" }}>{lang === "ca" ? "Filtrar:" : "Filtrar:"}</span>
                <button onClick={() => setFilterReg(!filterReg)} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-3.5 py-2 border" style={{ background: filterReg ? "#26312B" : "white", color: filterReg ? "#F2F5F1" : "#141B18", borderColor: filterReg ? "#26312B" : "#D8E2DA" }}>
                  <span className="inline-block w-[18px] h-1" style={{ background: "#141B18" }} />{lang === "ca" ? "Regulacions (5)" : "Regulaciones (5)"}
                </button>
                <button onClick={() => setFilterFw(!filterFw)} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-3.5 py-2 border" style={{ background: filterFw ? "#26312B" : "white", color: filterFw ? "#F2F5F1" : "#141B18", borderColor: filterFw ? "#26312B" : "#D8E2DA" }}>
                  <span className="inline-block w-[18px] h-1" style={{ background: "#5E8772" }} />Frameworks (5)
                </button>
                <button onClick={() => setFilterCert(!filterCert)} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] font-semibold px-3.5 py-2 border" style={{ background: filterCert ? "#26312B" : "white", color: filterCert ? "#F2F5F1" : "#141B18", borderColor: filterCert ? "#26312B" : "#D8E2DA" }}>
                  <span className="inline-block w-[18px] h-1" style={{ background: "#AAC9B6" }} />{lang === "ca" ? "Certificacions (6)" : "Certificaciones (6)"}
                </button>
              </div>
              <input type="text" placeholder={lang === "ca" ? "Cercar estàndard..." : "Buscar estándar..."} value={search} onChange={(e) => setSearch(e.target.value)} className="border px-3.5 py-2 text-sm" style={{ background: "white", borderColor: "#D8E2DA", color: "#26312B", width: "260px" }} />
            </div>
          </div>
        </section>

        {/* GRID — logos GRANS, targetes més altes */}
        <section className="py-10" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((s, i) => {
                const cfg = TYPE_CONFIG[s.type];
                return (
                  <div key={s.slug} className="flex cursor-pointer flex-col border transition-all hover:shadow-md hover:-translate-y-0.5" style={{ borderColor: "#D8E2DA", background: "white" }} onClick={() => router.push(`/estandares-esg/${s.slug}`)}>
                    {/* Banda superior de color */}
                    <div className="h-1.5" style={{ background: cfg.borderColor }} />

                    {/* LOGO GRAN — block sencer */}
                    <div className="flex h-32 items-center justify-center border-b px-6" style={{ borderColor: "rgba(201,184,154,0.5)", background: "#FFFFFF" }}>
                      <Image
                        src={s.logo}
                        alt={`Logo ${s.name}`}
                        width={220}
                        height={90}
                        className="max-h-24 w-auto object-contain"
                        unoptimized
                      />
                    </div>

                    {/* Cos de la targeta */}
                    <div className="flex flex-1 flex-col gap-2.5 p-5">
                      {/* Num + tipus + accés */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9.5px] font-semibold" style={{ color: "#4A5F53" }}>{String(i + 1).padStart(2, "0")}</span>
                          <span className="font-mono text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: cfg.borderColor }}>{tr(cfg.labelCa, cfg.labelEs)}</span>
                        </div>
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] font-semibold px-1.5 py-0.5" style={{ background: s.access === "free" ? "rgba(92,138,92,0.12)" : "#5E8772", color: s.access === "free" ? "#4A6B3A" : "white" }}>{s.access === "free" ? (lang === "ca" ? "Gratis" : "Gratis") : "Premium"}</span>
                      </div>

                      {/* Títol */}
                      <h3 className="font-serif text-2xl font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>{s.name}</h3>

                      {/* Emissor */}
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: "#4A5F53" }}>{tr(s.issuerCa, s.issuerEs)}</p>

                      {/* Descripció */}
                      <p className="text-[12px] leading-relaxed" style={{ color: "#141B18", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{tr(s.descCa, s.descEs)}</p>

                      {/* Footer amb count (derivat automàticament) */}
                      <div className="mt-auto flex items-center justify-between border-t pt-3" style={{ borderColor: "rgba(201,184,154,0.5)" }}>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: "#4A5F53" }}>
                          <strong style={{ color: "#5E8772", fontWeight: 700, fontSize: "13px" }}>{s.count}</strong> {lang === "ca" ? "informes cross-ref" : "informes cross-ref"}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#5E8772", borderBottom: "1px solid #5E8772", paddingBottom: "2px" }}>Ver →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
