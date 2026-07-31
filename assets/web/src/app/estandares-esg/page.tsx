"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { STANDARDS, TYPE_CONFIG } from "@/lib/standards-data";

export default function EstandaresPage() {
  const { lang } = useLanguage();
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
                    className="relative cursor-pointer rounded-lg border border-rule bg-card p-5 transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col"
                    style={{ borderLeft: `8px solid ${cfg.borderColor}` }}
                  >
                    <div className="mb-3 flex items-center gap-1.5">
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

                    {/* Logo */}
                    <div className="mb-3 flex h-12 items-center justify-start">
                      <Image
                        src={s.logo}
                        alt={`Logo ${s.name}`}
                        width={120}
                        height={48}
                        className="max-h-12 w-auto object-contain"
                        unoptimized
                      />
                    </div>

                    <h3 className="mb-1.5 font-serif text-base font-semibold text-primary">{s.name}</h3>
                    <p className="mb-3 text-xs leading-relaxed text-muted-foreground flex-1" style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
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
