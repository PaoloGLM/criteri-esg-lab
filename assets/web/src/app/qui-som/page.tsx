"use client";

import { useState } from "react";
import { Header } from "@/components/site-header-v1";
import { FooterV1 } from "@/components/site-footer-v1";
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
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-28">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{t("quisom.v2.hero.eyebrow")}</p>
            </div>
            <h1 className="mb-6 max-w-5xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-primary sm:text-6xl lg:text-7xl">
              {t("quisom.v2.hero.title.pre")}<em className="italic" style={{ color: "#141B18" }}>{t("quisom.v2.hero.title.em")}</em>{t("quisom.v2.hero.title.post")}
            </h1>
            <p className="max-w-3xl font-serif text-xl italic" style={{ color: "#141B18" }}>{t("quisom.v2.hero.subtitle")}</p>
          </div>
        </section>

        {/* 2. MANIFEST */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="border-l-4 p-6 lg:p-8" style={{ borderColor: "#5E8772", background: "rgba(184,115,51,0.06)" }}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{t("quisom.v2.manifest.eyebrow")}</p>
              <p className="max-w-4xl font-serif text-xl italic leading-relaxed text-primary sm:text-2xl">{t("quisom.manifest.page.body")}</p>
            </div>
          </div>
        </section>

        {/* 3. EQUIP */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{t("quisom.v2.team.eyebrow")}</p>
            </div>
            <h2 className="mb-4 font-serif text-4xl font-medium leading-tight tracking-tight text-primary sm:text-5xl">
              {t("quisom.v2.team.title.pre")}<em className="italic" style={{ color: "#141B18" }}>{t("quisom.v2.team.title.em")}</em>{t("quisom.v2.team.title.post")}
            </h2>
            <p className="mb-12 max-w-3xl font-serif text-lg italic" style={{ color: "#141B18" }}>{t("quisom.v2.team.intro")}</p>
            <div className="grid gap-8 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex flex-col gap-4 border p-8" style={{ borderColor: "#D8E2DA", background: "white" }}>
                  <div className="flex h-14 w-14 items-center justify-center font-serif text-2xl font-medium" style={{ background: member.isAI ? "#5E8772" : "#26312B", color: "#F2F5F1" }}>{member.icon}</div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#3F6653" }}>{member.role}</p>
                  <h3 className="font-serif text-2xl font-medium text-primary" style={{ letterSpacing: "-0.012em" }}>{member.name}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#141B18" }}>{member.bio}</p>
                  <p className="mt-auto border-t pt-3 font-mono text-[9px] uppercase tracking-[0.16em]" style={{ borderColor: "#D8E2DA", color: "#4A5F53" }}>{member.tag}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. LO QUE CREEMOS (dark) */}
        <section style={{ background: "#26312B", color: "#F2F5F1" }}>
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#AAC9B6" }}>{t("quisom.v2.conviccions.eyebrow")}</p>
            </div>
            <h2 className="mb-12 font-serif text-4xl font-medium leading-tight tracking-tight sm:text-5xl" style={{ color: "#F2F5F1" }}>
              {t("quisom.v2.conviccions.title.pre")}<em className="italic" style={{ color: "#AAC9B6" }}>{t("quisom.v2.conviccions.title.em")}</em>{t("quisom.v2.conviccions.title.post")}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-16">
              {conviccions.map((c, i) => (
                <div key={c.num} className="border-b py-5" style={{ borderBottomColor: "rgba(217,165,116,0.2)", gridColumn: i === 4 ? "span 2" : "auto" }}>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "#AAC9B6" }}>{c.num} · {c.name}</p>
                  <p className="font-serif text-xl italic leading-snug" style={{ color: "#F2F5F1", letterSpacing: "-0.005em" }}>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CLOSING */}
        <section className="border-b border-rule" style={{ background: "#F2F5F1" }}>
          <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] font-semibold" style={{ color: "#3F6653" }}>{t("quisom.v2.closing.eyebrow")}</p>
              <span className="inline-block h-0.5 w-6" style={{ background: "#5E8772" }} />
            </div>
            <p className="font-serif text-3xl leading-snug text-primary sm:text-4xl" style={{ letterSpacing: "-0.015em" }}>
              {t("quisom.v2.closing.text.pre")}<em className="italic font-medium" style={{ color: "#141B18" }}>{t("quisom.v2.closing.text.em")}</em>{t("quisom.v2.closing.text.post")}
            </p>
            <button onClick={() => openAuth("register")} className="mt-8 px-9 py-4 text-sm font-semibold text-white" style={{ background: "#5E8772" }}>{t("quisom.v2.closing.cta")}</button>
          </div>
        </section>
      </main>
      <FooterV1 />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} defaultTab={authTab} />
      <PreusDialog open={preusOpen} onOpenChange={setPreusOpen} onOpenRegister={() => openAuth("register")} />
    </div>
  );
}
