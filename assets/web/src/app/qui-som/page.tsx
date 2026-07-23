"use client";

import { useState } from "react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site-footer";
import { AuthDialog } from "@/components/auth-dialog";
import { PreusDialog } from "@/components/preus-dialog";
import { useLanguage } from "@/components/language-provider";

export default function QuiSomPage() {
  const { t } = useLanguage();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"register" | "login">("register");
  const [preusOpen, setPreusOpen] = useState(false);

  const openAuth = (tab: "register" | "login" = "register") => {
    setAuthTab(tab);
    setAuthOpen(true);
  };

  const teamMembers = [
    { icon: "★", role: t("quisom.v2.team.01.role"), name: t("quisom.v2.team.01.name"), bio: t("quisom.v2.team.01.bio"), tag: t("quisom.v2.team.01.tag"), isAI: false },
    { icon: "⚙", role: t("quisom.v2.team.02.role"), name: t("quisom.v2.team.02.name"), bio: t("quisom.v2.team.02.bio"), tag: t("quisom.v2.team.02.tag"), isAI: false },
    { icon: "◆", role: t("quisom.v2.team.03.role"), name: t("quisom.v2.team.03.name"), bio: t("quisom.v2.team.03.bio"), tag: t("quisom.v2.team.03.tag"), isAI: true },
  ];

  const conviccions = [
    { num: "01", name: t("quisom.v2.conviccio.01.name"), text: t("quisom.v2.conviccio.01.text") },
    { num: "02", name: t("quisom.v2.conviccio.02.name"), text: t("quisom.v2.conviccio.02.text") },
    { num: "03", name: t("quisom.v2.conviccio.03.name"), text: t("quisom.v2.conviccio.03.text") },
    { num: "04", name: t("quisom.v2.conviccio.04.name"), text: t("quisom.v2.conviccio.04.text") },
    { num: "05", name: t("quisom.v2.conviccio.05.name"), text: t("quisom.v2.conviccio.05.text") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenPreus={() => setPreusOpen(true)} onOpenAuth={(tab) => openAuth(tab || "register")} />
      <main className="flex-1">
        {/* 1. HERO */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>{t("quisom.v2.hero.eyebrow")}</p>
            </div>
            <h1 className="mb-6 max-w-5xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              {t("quisom.v2.hero.title.pre")}<em className="italic" style={{ color: "#5C3A1E" }}>{t("quisom.v2.hero.title.em")}</em>{t("quisom.v2.hero.title.post")}
            </h1>
            <p className="max-w-3xl font-serif text-xl italic" style={{ color: "#5C3A1E" }}>{t("quisom.v2.hero.subtitle")}</p>
          </div>
        </section>

        {/* 2. MANIFEST */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="border-l-4 p-6 lg:p-8" style={{ borderColor: "#B87333", background: "rgba(184,115,51,0.06)" }}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>{t("quisom.v2.manifest.eyebrow")}</p>
              <p className="max-w-4xl font-serif text-xl italic leading-relaxed text-primary sm:text-2xl">{t("quisom.manifest.page.body")}</p>
            </div>
          </div>
        </section>

        {/* 3. EQUIP */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>{t("quisom.v2.team.eyebrow")}</p>
            </div>
            <h2 className="mb-4 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quisom.v2.team.title.pre")}<em className="italic" style={{ color: "#5C3A1E" }}>{t("quisom.v2.team.title.em")}</em>{t("quisom.v2.team.title.post")}
            </h2>
            <p className="mb-12 max-w-3xl font-serif text-lg italic" style={{ color: "#5C3A1E" }}>{t("quisom.v2.team.intro")}</p>
            <div className="grid gap-8 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex flex-col gap-4 border p-8" style={{ borderColor: "#C9B89A", background: "white" }}>
                  <div className="flex h-14 w-14 items-center justify-center font-serif text-2xl font-medium" style={{ background: member.isAI ? "#B87333" : "#2C1810", color: "#F5EFE6" }}>{member.icon}</div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#8A5526" }}>{member.role}</p>
                  <h3 className="font-serif text-2xl font-medium text-primary" style={{ letterSpacing: "-0.012em" }}>{member.name}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#5C3A1E" }}>{member.bio}</p>
                  <p className="mt-auto border-t pt-3 font-mono text-[9px] uppercase tracking-[0.16em]" style={{ borderColor: "#C9B89A", color: "#8B7355" }}>{member.tag}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. LO QUE CREEMOS (dark) */}
        <section style={{ background: "#2C1810", color: "#F5EFE6" }}>
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#D9A574" }}>{t("quisom.v2.conviccions.eyebrow")}</p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl" style={{ color: "#F5EFE6" }}>
              {t("quisom.v2.conviccions.title.pre")}<em className="italic" style={{ color: "#D9A574" }}>{t("quisom.v2.conviccions.title.em")}</em>{t("quisom.v2.conviccions.title.post")}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-16">
              {conviccions.map((c, i) => (
                <div key={c.num} className="border-b py-5" style={{ borderBottomColor: "rgba(217,165,116,0.2)", gridColumn: i === 4 ? "span 2" : "auto" }}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#D9A574" }}>{c.num} · {c.name}</p>
                  <p className="font-serif text-xl italic leading-snug" style={{ color: "#F5EFE6", letterSpacing: "-0.005em" }}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CLOSING */}
        <section className="border-b border-rule" style={{ background: "#F5EFE6" }}>
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#8A5526" }}>{t("quisom.v2.closing.eyebrow")}</p>
              <span className="inline-block h-0.5 w-6" style={{ background: "#B87333" }} />
            </div>
            <p className="font-serif text-3xl leading-snug text-primary sm:text-4xl" style={{ letterSpacing: "-0.015em" }}>
              {t("quisom.v2.closing.text.pre")}<em className="italic font-medium" style={{ color: "#5C3A1E" }}>{t("quisom.v2.closing.text.em")}</em>{t("quisom.v2.closing.text.post")}
            </p>
            <button onClick={() => openAuth("register")} className="mt-8 px-9 py-4 text-sm font-semibold text-white" style={{ background: "#B87333" }}>{t("quisom.v2.closing.cta")}</button>
          </div>
        </section>
      </main>
      <Footer />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
