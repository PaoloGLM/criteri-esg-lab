"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

type StandarType = "reg" | "fw" | "cert";

const ESTANDARES: { slug: string; name: string; type: StandarType }[] = [
  { slug: "csrd-esrs", name: "CSRD / ESRS", type: "reg" },
  { slug: "csddd", name: "CSDDD", type: "reg" },
  { slug: "sfdr", name: "SFDR", type: "reg" },
  { slug: "taxonomia-ue", name: "Taxonomía UE", type: "reg" },
  { slug: "emas", name: "EMAS", type: "reg" },
  { slug: "gri", name: "GRI", type: "fw" },
  { slug: "sasb", name: "SASB", type: "fw" },
  { slug: "tnfd", name: "TNFD", type: "fw" },
  { slug: "tcfd", name: "TCFD", type: "fw" },
  { slug: "iso-26000", name: "ISO 26000", type: "fw" },
  { slug: "ecovadis", name: "EcoVadis", type: "cert" },
  { slug: "b-corp", name: "B Corp", type: "cert" },
  { slug: "msci-esg", name: "MSCI ESG", type: "cert" },
  { slug: "cdp", name: "CDP", type: "cert" },
  { slug: "sge-21", name: "SGE 21", type: "cert" },
  { slug: "sustainalytics", name: "Sustainalytics", type: "cert" },
];

const INTERESSOS = [
  { id: "csrd", key: "form.interest.csrd" as const },
  { id: "ecovadis", key: "form.interest.ecovadis" as const },
  { id: "bcorp", key: "form.interest.bcorp" as const },
  { id: "msci", key: "form.interest.msci" as const },
  { id: "taxonomy", key: "form.interest.taxonomy" as const },
  { id: "csddd", key: "form.interest.csddd" as const },
  { id: "humanrights", key: "form.interest.humanrights" as const },
  { id: "climate", key: "form.interest.climate" as const },
];

const CAT_COLOR: Record<StandarType, string> = { reg: "#5C3A1E", fw: "#B87333", cert: "#E8C99A" };

export default function CuentaPage() {
  const { t } = useLanguage();
  const { user, plan } = useAuth();
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("perfil");
  const [selectedEstandards, setSelectedEstandards] = useState<string[]>(["csrd-esrs", "gri", "ecovadis"]);
  const [selectedInteressos, setSelectedInteressos] = useState<string[]>(["csrd", "ecovadis", "taxonomy", "climate"]);
  const [newsletterLang, setNewsletterLang] = useState<"ca" | "es">("es");

  const openAuth = (tab: "register" | "login" = "register") => { setAuthTab(tab); setAuthOpen(true); };
  const toggleEstandar = (slug: string) => setSelectedEstandards((p) => p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]);
  const toggleInteres = (id: string) => setSelectedInteressos((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="text-center">
            <h1 className="mb-4 font-serif text-3xl font-medium text-primary">{t("cuenta.v2.login_required.title")}</h1>
            <p className="mb-8 font-serif text-lg italic" style={{ color: "#5C3A1E" }}>{t("cuenta.v2.login_required.body")}</p>
            <button onClick={() => openAuth("login")} className="px-8 py-3 text-sm font-semibold text-white" style={{ background: "#B87333" }}>{t("cuenta.v2.login_required.cta")}</button>
          </div>
        </main>
        <Footer />
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
        <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
      </div>
    );
  }

  const navItems = [
    { id: "perfil", num: "01", label: t("cuenta.v2.nav.perfil") },
    { id: "newsletter", num: "02", label: t("cuenta.v2.nav.newsletter") },
    { id: "plan", num: "03", label: t("cuenta.v2.nav.plan") },
    { id: "estandares", num: "04", label: t("cuenta.v2.nav.estandares") },
    { id: "intereses", num: "05", label: t("cuenta.v2.nav.intereses") },
    { id: "billing", num: "06", label: t("cuenta.v2.nav.billing") },
  ];
  const userInitial = (user.email?.[0] || "U").toUpperCase();
  const isPremium = plan === "premium";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        <div className="grid lg:grid-cols-[320px_1fr]">
          {/* SIDEBAR */}
          <aside className="sticky top-[70px] hidden h-[calc(100vh-70px)] flex-col p-12 lg:flex" style={{ background: "#2C1810", color: "#F5EFE6" }}>
            <div className="mb-8 pb-6 border-b" style={{ borderColor: "rgba(217,165,116,0.25)" }}>
              <div className="font-serif text-xl font-semibold" style={{ color: "#F5EFE6" }}>Criteri<span style={{ color: "#D9A574" }}>.</span> ESG</div>
            </div>
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full font-serif text-2xl font-medium" style={{ background: "#B87333", color: "#FFFFFF" }}>{userInitial}</div>
              <div className="flex flex-col gap-1">
                <div className="font-serif text-lg font-medium" style={{ color: "#F5EFE6" }}>{user.email?.split("@")[0] || "Usuario"}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#D9A574" }}>{isPremium ? t("cuenta.v2.plan.premium") : t("cuenta.v2.plan.free")}</div>
              </div>
            </div>
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { setActiveNav(item.id); document.getElementById(`card-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                  className="grid grid-cols-[24px_1fr] items-baseline gap-3 border-l-2 px-4 py-3 text-left text-sm font-medium transition-colors"
                  style={{ color: activeNav === item.id ? "#F5EFE6" : "rgba(245,239,230,0.7)", background: activeNav === item.id ? "rgba(217,165,116,0.12)" : "transparent", borderLeftColor: activeNav === item.id ? "#B87333" : "transparent" }}>
                  <span className="font-mono text-[10px] font-semibold" style={{ color: activeNav === item.id ? "#D9A574" : "rgba(217,165,116,0.5)" }}>{item.num}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <button onClick={() => router.push("/")} className="mt-auto border-t pt-3 text-left text-[13px] font-medium" style={{ borderColor: "rgba(217,165,116,0.15)", color: "rgba(245,239,230,0.5)" }}>← {t("cuenta.v2.logout")}</button>
          </aside>

          {/* MAIN */}
          <div className="flex flex-col gap-8 p-12" style={{ background: "#F5EFE6" }}>
            <div>
              <h1 className="mb-2 font-serif text-4xl font-medium text-primary" style={{ letterSpacing: "-0.018em" }}>{t("cuenta.v2.page.title")}</h1>
              <p className="font-serif text-base italic" style={{ color: "#5C3A1E" }}>{t("cuenta.v2.page.subtitle")}</p>
            </div>

            {/* 01 PERFIL */}
            <div id="card-perfil" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary">{t("cuenta.v2.perfil.title")}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>01</span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5"><label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>{t("cuenta.v2.perfil.nombre")}</label><input className="border p-3 text-sm font-medium text-primary" style={{ background: "#F5EFE6", borderColor: "#C9B89A" }} defaultValue={user.email?.split("@")[0] || ""} /></div>
                <div className="flex flex-col gap-1.5"><label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>{t("cuenta.v2.perfil.email")}</label><input className="border p-3 text-sm font-medium text-primary" style={{ background: "#F5EFE6", borderColor: "#C9B89A" }} defaultValue={user.email || ""} disabled /></div>
                <div className="flex flex-col gap-1.5"><label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>{t("cuenta.v2.perfil.empresa")}</label><input className="border p-3 text-sm font-medium text-primary" style={{ background: "#F5EFE6", borderColor: "#C9B89A" }} placeholder={t("cuenta.v2.perfil.empresa_placeholder")} /></div>
                <div className="flex flex-col gap-1.5"><label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>{t("cuenta.v2.perfil.sector")}</label><input className="border p-3 text-sm font-medium text-primary" style={{ background: "#F5EFE6", borderColor: "#C9B89A" }} placeholder={t("cuenta.v2.perfil.sector_placeholder")} /></div>
              </div>
            </div>

            {/* 02 NEWSLETTER */}
            <div id="card-newsletter" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary">{t("cuenta.v2.newsletter.title")}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>02</span>
              </div>
              <div className="flex flex-col gap-1.5"><label className="font-mono text-[10px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#8A5526" }}>{t("cuenta.v2.newsletter.idioma")}</label>
                <div className="inline-flex border" style={{ borderColor: "#C9B89A" }}>
                  {(["ca", "es"] as const).map((lang) => (
                    <button key={lang} onClick={() => setNewsletterLang(lang)} className="px-6 py-3 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ background: newsletterLang === lang ? "#B87333" : "#F5EFE6", color: newsletterLang === lang ? "#FFFFFF" : "#5C3A1E" }}>{lang.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <p className="mt-4 font-serif text-sm italic leading-relaxed" style={{ color: "#5C3A1E" }}>{t("cuenta.v2.newsletter.desc")}</p>
            </div>

            {/* 03 PLAN */}
            <div id="card-plan" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary">{t("cuenta.v2.plan.title")}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>03</span>
              </div>
              <div className="flex items-center justify-between gap-6 p-6" style={{ background: "#2C1810", color: "#F5EFE6" }}>
                <div className="flex flex-col gap-1">
                  <div className="font-serif text-2xl font-medium" style={{ color: "#F5EFE6" }}>{isPremium ? t("cuenta.v2.plan.premium") : t("cuenta.v2.plan.free")}</div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#D9A574" }}>{isPremium ? t("cuenta.v2.plan.premium_desc") : t("cuenta.v2.plan.free_desc")}</div>
                </div>
                {!isPremium && <button onClick={() => setPreusOpen(true)} className="px-6 py-3 text-[13px] font-semibold text-white" style={{ background: "#B87333" }}>{t("cuenta.v2.plan.upgrade")}</button>}
              </div>
              <p className="mt-4 text-[13px] leading-relaxed" style={{ color: "#5C3A1E" }}>{t("cuenta.v2.plan.premium_info")}</p>
            </div>

            {/* 04 ESTÁNDARES */}
            <div id="card-estandares" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary">{t("cuenta.v2.estandares.title")}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>04</span>
              </div>
              <p className="mb-4 font-serif text-sm italic leading-relaxed" style={{ color: "#5C3A1E" }}>{t("cuenta.v2.estandares.desc")}</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {ESTANDARES.map((est) => {
                  const selected = selectedEstandards.includes(est.slug);
                  return (
                    <button key={est.slug} onClick={() => toggleEstandar(est.slug)} className="flex items-center gap-2.5 p-3 text-left text-[13px] font-medium"
                      style={{ background: selected ? "#2C1810" : "#F5EFE6", color: selected ? "#F5EFE6" : "#2C1810", border: selected ? "1px solid #B87333" : "1px solid #C9B89A", borderLeftWidth: "4px", borderLeftColor: CAT_COLOR[est.type] }}>
                      <span className="flex h-4 w-4 items-center justify-center text-[11px]" style={{ background: selected ? "#B87333" : "transparent", border: selected ? "1px solid #B87333" : "1.5px solid #C9B89A", color: "white" }}>{selected ? "✓" : ""}</span>
                      {est.name}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-6 font-mono text-[9.5px] uppercase tracking-[0.16em] font-semibold" style={{ color: "#5C3A1E" }}>
                <div className="flex items-center gap-2"><span className="inline-block w-[18px] h-1" style={{ background: "#5C3A1E" }} /><span>{t("cuenta.v2.estandares.legend.reg")}</span></div>
                <div className="flex items-center gap-2"><span className="inline-block w-[18px] h-1" style={{ background: "#B87333" }} /><span>{t("cuenta.v2.estandares.legend.fw")}</span></div>
                <div className="flex items-center gap-2"><span className="inline-block w-[18px] h-1" style={{ background: "#E8C99A" }} /><span>{t("cuenta.v2.estandares.legend.cert")}</span></div>
              </div>
            </div>

            {/* 05 INTERESES */}
            <div id="card-intereses" className="border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
              <div className="mb-5 flex justify-between border-b pb-4" style={{ borderColor: "#C9B89A" }}>
                <h2 className="font-serif text-xl font-medium text-primary">{t("cuenta.v2.intereses.title")}</h2>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#B87333" }}>05</span>
              </div>
              <p className="mb-4 font-serif text-sm italic leading-relaxed" style={{ color: "#5C3A1E" }}>{t("cuenta.v2.intereses.desc")}</p>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {INTERESSOS.map((interes) => {
                  const selected = selectedInteressos.includes(interes.id);
                  return (
                    <button key={interes.id} onClick={() => toggleInteres(interes.id)} className="flex items-center gap-2.5 p-3 text-left text-[13px] font-medium"
                      style={{ background: selected ? "rgba(184,115,51,0.12)" : "#F5EFE6", border: selected ? "1px solid #B87333" : "1px solid #C9B89A", color: selected ? "#5C3A1E" : "#2C1810" }}>
                      <span className="flex h-4 w-4 items-center justify-center text-[11px]" style={{ background: selected ? "#B87333" : "transparent", border: selected ? "1px solid #B87333" : "1.5px solid #C9B89A", color: "white" }}>{selected ? "✓" : ""}</span>
                      {t(interes.key)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
