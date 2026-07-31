"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";
import { STANDARDS, TYPE_CONFIG, type StandarType } from "@/lib/standards-data";

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

  const filtered = STANDARDS.filter((s) => {
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
        {/* PAGE HEADER — disseny Paolo */}
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
                const cfg = TYPE_CONFIG[s.type];
                return (
                  <div key={s.slug} className="flex cursor-pointer flex-col border" style={{ borderColor: "#C9B89A", background: "white" }} onClick={() => router.push(`/estandares-esg/${s.slug}`)}>
                    <div className="h-1.5" style={{ background: cfg.borderColor }} />
                    <div className="flex flex-col gap-2.5 p-5">
                      <div className="flex justify-between border-b pb-2" style={{ borderColor: "rgba(201,184,154,0.5)" }}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9.5px] font-semibold" style={{ color: "#8B7355" }}>{String(i + 1).padStart(2, "0")}</span>
                          {/* Logo local */}
                          <Image
                            src={s.logo}
                            alt={`Logo ${s.name}`}
                            width={60}
                            height={24}
                            className="h-6 w-auto object-contain"
                            unoptimized
                          />
                        </div>
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] font-semibold px-1.5 py-0.5" style={{ background: s.access === "free" ? "rgba(92,138,92,0.12)" : "#B87333", color: s.access === "free" ? "#4A6B3A" : "white" }}>{s.access === "free" ? (lang === "ca" ? "Gratis" : "Gratis") : "Premium"}</span>
                      </div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: cfg.borderColor }}>{tr(cfg.labelCa, cfg.labelEs)}</span>
                      <h3 className="font-serif text-lg font-medium text-primary" style={{ letterSpacing: "-0.01em" }}>{s.name}</h3>
                      <p className="text-[11.5px] leading-relaxed" style={{ color: "#5C3A1E", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{tr(s.descCa, s.descEs)}</p>
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
